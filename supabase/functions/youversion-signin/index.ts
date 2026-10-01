// Supabase Edge Function: youversion-signin
//
// The site signs a person in with YouVersion in the browser and receives a
// signed ID token. This function:
//   1. verifies that token really came from YouVersion and was issued for
//      Seek Like Silver (signature, issuer, audience, expiry, nonce);
//   2. finds or creates a site account tied to the person's YouVersion ID;
//   3. returns a one-time key the site exchanges for a normal Supabase session.
//
// YouVersion's tokens don't say whether the email address was verified, so a
// YouVersion login never merges into an existing Google/email account. Each
// YouVersion user gets an account keyed to their YouVersion ID instead.
//
// Setup (Supabase dashboard):
//   - Edge Functions → Secrets: add YOUVERSION_APP_KEY = your YouVersion App Key
//   - This function's settings: turn OFF "Verify JWT" (the site calls it before
//     the person is signed in; this function does its own token verification)

import { createClient } from "npm:@supabase/supabase-js@2";
import { createRemoteJWKSet, jwtVerify } from "npm:jose@5";

// YouVersion's written docs give the issuer as "https://api.youversion.com", but
// their discovery document (/.well-known/openid-configuration) says
// "https://api.youversion.com/auth/token", which is what real tokens use. Accept both.
const ISSUERS = ["https://api.youversion.com/auth/token", "https://api.youversion.com"];
const JWKS = createRemoteJWKSet(new URL("https://api.youversion.com/.well-known/jwks.json"));
const ALLOWED_ORIGINS = new Set(["https://seeklikesilver.com", "https://www.seeklikesilver.com"]);
// Accounts get an address on a subdomain we own that never receives mail.
// No email is ever sent to it (generateLink below does not send email).
const ACCOUNT_DOMAIN = "youversion.seeklikesilver.com";

function serviceKey(): string {
  // New-style secret keys arrive as a JSON dictionary; fall back to the legacy key.
  try {
    const keys = JSON.parse(Deno.env.get("SUPABASE_SECRET_KEYS") ?? "{}");
    const first = Object.values(keys)[0];
    if (typeof first === "string" && first) return first;
  } catch { /* fall through */ }
  return Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
}

async function sha256Hex(text: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

Deno.serve(async (req) => {
  const origin = req.headers.get("Origin") ?? "";
  const headers: Record<string, string> = { "Content-Type": "application/json", "Vary": "Origin" };
  if (ALLOWED_ORIGINS.has(origin)) {
    headers["Access-Control-Allow-Origin"] = origin;
    headers["Access-Control-Allow-Headers"] = "authorization, apikey, content-type, x-client-info";
    headers["Access-Control-Allow-Methods"] = "POST, OPTIONS";
  }
  const reply = (status: number, body: unknown) => new Response(JSON.stringify(body), { status, headers });

  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers });
  if (req.method !== "POST") return reply(405, { error: "method_not_allowed" });

  const appKey = Deno.env.get("YOUVERSION_APP_KEY") ?? "";
  const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
  const key = serviceKey();
  if (!appKey || !supabaseUrl || !key) {
    console.error("Missing configuration:", { appKey: !!appKey, supabaseUrl: !!supabaseUrl, serviceKey: !!key });
    return reply(500, { error: "server_not_configured" });
  }

  let idToken: unknown, nonce: unknown;
  try {
    ({ id_token: idToken, nonce } = await req.json());
  } catch {
    return reply(400, { error: "bad_request" });
  }
  if (typeof idToken !== "string" || typeof nonce !== "string" || nonce.length < 16) {
    return reply(400, { error: "bad_request" });
  }

  // 1. Verify the token.
  let payload: Record<string, unknown>;
  try {
    // Signature and expiry are checked here; issuer and audience are checked just
    // below so a mismatch can report the token's actual (non-secret) value.
    ({ payload } = await jwtVerify(idToken, JWKS, {
      algorithms: ["RS256", "ES256"],
      clockTolerance: 30
    }));
  } catch (err) {
    // Report which check failed (e.g. "ERR_JWT_CLAIM_VALIDATION_FAILED aud") without echoing token contents.
    const e = err as { code?: string; claim?: string };
    const detail = [e.code, e.claim].filter(Boolean).join(" ");
    console.error("YouVersion token rejected:", detail || String(err));
    return reply(401, { error: "invalid_token", detail });
  }
  if (typeof payload.iss !== "string" || !ISSUERS.includes(payload.iss)) {
    console.error("YouVersion token rejected: unexpected issuer", payload.iss);
    return reply(401, { error: "invalid_token", detail: "issuer is " + String(payload.iss) });
  }
  const audiences = Array.isArray(payload.aud) ? payload.aud : [payload.aud];
  if (!audiences.includes(appKey)) {
    console.error("YouVersion token rejected: audience", payload.aud, "does not match YOUVERSION_APP_KEY");
    return reply(401, { error: "invalid_token", detail: "token is for app " + audiences.join(",") + ", not the YOUVERSION_APP_KEY secret" });
  }
  if (payload.nonce !== nonce) {
    console.error("YouVersion token rejected: nonce mismatch (token has nonce: " + (typeof payload.nonce === "string") + ")");
    return reply(401, { error: "nonce_mismatch" });
  }

  const yvId = String(payload.yvp_id ?? payload.sub ?? "");
  if (!yvId) return reply(401, { error: "missing_user_id" });

  // 2. Find or create the account for this YouVersion user.
  const email = "yv-" + (await sha256Hex(yvId)).slice(0, 40) + "@" + ACCOUNT_DOMAIN;
  const admin = createClient(supabaseUrl, key, { auth: { persistSession: false, autoRefreshToken: false } });

  const { error: createError } = await admin.auth.admin.createUser({
    email,
    email_confirm: true,
    app_metadata: { signin: "youversion", yvp_id: yvId },
    user_metadata: { full_name: typeof payload.name === "string" ? payload.name.slice(0, 100) : null }
  });
  const createCode = (createError as { code?: string } | null)?.code;
  const alreadyExists = createError &&
    (createCode === "email_exists" || createCode === "user_already_exists" ||
      /already|exists|registered/i.test(createError.message));
  if (createError && !alreadyExists) {
    console.error("createUser failed:", createError.message);
    return reply(500, { error: "account_error" });
  }

  // 3. One-time sign-in key (generateLink returns it without sending any email).
  const { data, error } = await admin.auth.admin.generateLink({ type: "magiclink", email });
  const tokenHash = data?.properties?.hashed_token;
  if (error || !tokenHash) {
    console.error("generateLink failed:", error?.message);
    return reply(500, { error: "session_error" });
  }

  return reply(200, { token_hash: tokenHash });
});
