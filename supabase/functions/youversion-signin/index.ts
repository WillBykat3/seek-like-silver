// Supabase Edge Function: youversion-signin
//
// The site signs a person in with YouVersion in the browser and receives a
// signed ID token. Every request first verifies that token really came from
// YouVersion and was issued for Seek Like Silver (signature, issuer, audience,
// expiry, nonce). Then, depending on `mode`:
//
//   "signin" (default)  Sign in. If this YouVersion account is connected to a
//                       site account, sign into that one. Otherwise use (or
//                       create) a YouVersion-only account keyed to the
//                       YouVersion ID. Returns a one-time key the site trades
//                       for a normal session.
//   "link"              The person is already signed in (their session token is
//                       in the Authorization header). Connect this YouVersion
//                       account to that site account. If an older
//                       YouVersion-only account exists, its answers move over
//                       and the empty account is deleted.
//   "unlink"            Disconnect YouVersion from the signed-in account.
//                       (No YouVersion token needed.)
//
// YouVersion's tokens don't say whether the email address was verified, so a
// YouVersion login is never matched to an existing account by email. Accounts
// are only joined when the person, signed in, connects them on purpose.
//
// Setup (Supabase dashboard):
//   - Edge Functions → Secrets: YOUVERSION_APP_KEY = your YouVersion App Key
//   - This function's settings: turn OFF "Verify JWT" (sign-in happens before
//     the person has a session; this function verifies everything itself)
//   - Run supabase-migrations/003-account-linking-and-mfa.sql

import { createClient, type SupabaseClient } from "npm:@supabase/supabase-js@2";
import { createRemoteJWKSet, decodeJwt, jwtVerify } from "npm:jose@5";

// YouVersion's written docs give the issuer as "https://api.youversion.com", but
// their discovery document (/.well-known/openid-configuration) says
// "https://api.youversion.com/auth/token", which is what real tokens use. Accept both.
const ISSUERS = ["https://api.youversion.com/auth/token", "https://api.youversion.com"];
const JWKS = createRemoteJWKSet(new URL("https://api.youversion.com/.well-known/jwks.json"));
const ALLOWED_ORIGINS = new Set(["https://seeklikesilver.com", "https://www.seeklikesilver.com"]);
// YouVersion-only accounts get an address on a subdomain we own that never
// receives mail. No email is ever sent to it (generateLink does not send email).
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

const isYouVersionOnly = (email: string | undefined | null) =>
  !!email && email.toLowerCase().endsWith("@" + ACCOUNT_DOMAIN);

type Reply = (status: number, body: unknown) => Response;

// Verify YouVersion's ID token. Returns the YouVersion user ID and claims, or a Response on failure.
async function verifyYouVersionToken(idToken: unknown, nonce: unknown, appKey: string, reply: Reply) {
  if (typeof idToken !== "string" || typeof nonce !== "string" || nonce.length < 16) {
    return reply(400, { error: "bad_request" });
  }
  let payload: Record<string, unknown>;
  try {
    // Signature and expiry are checked here; issuer and audience are checked just
    // below so a mismatch can report the token's actual (non-secret) value.
    ({ payload } = await jwtVerify(idToken, JWKS, { algorithms: ["RS256", "ES256"], clockTolerance: 30 }));
  } catch (err) {
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
    console.error("YouVersion token rejected: nonce mismatch");
    return reply(401, { error: "nonce_mismatch" });
  }
  const yvId = String(payload.yvp_id ?? payload.sub ?? "");
  if (!yvId) return reply(401, { error: "missing_user_id" });
  return { yvId, payload };
}

// Identify the signed-in person from their Supabase session token.
async function currentUser(req: Request, admin: SupabaseClient, reply: Reply) {
  const jwt = (req.headers.get("Authorization") ?? "").replace(/^Bearer\s+/i, "");
  if (!jwt) return reply(401, { error: "not_signed_in" });
  const { data, error } = await admin.auth.getUser(jwt); // validated by Supabase Auth
  if (error || !data?.user) return reply(401, { error: "not_signed_in" });
  let aal = "aal1";
  try { aal = String(decodeJwt(jwt).aal ?? "aal1"); } catch { /* treat as aal1 */ }
  // If they've turned on an authenticator app, require that they've used it this session.
  const { data: factors } = await admin.auth.admin.mfa.listFactors({ userId: data.user.id });
  const hasVerifiedFactor = (factors?.factors ?? []).some((f: { status: string }) => f.status === "verified");
  if (hasVerifiedFactor && aal !== "aal2") return reply(403, { error: "authenticator_required" });
  return data.user;
}

async function linkRow(admin: SupabaseClient, column: "yvp_id" | "user_id", value: string) {
  const { data, error } = await admin.from("youversion_links").select("yvp_id, user_id").eq(column, value).maybeSingle();
  if (error) throw new Error("link lookup failed: " + error.message);
  return data as { yvp_id: string; user_id: string } | null;
}

async function oneTimeKey(admin: SupabaseClient, email: string) {
  const { data, error } = await admin.auth.admin.generateLink({ type: "magiclink", email });
  const tokenHash = data?.properties?.hashed_token;
  if (error || !tokenHash) throw new Error("generateLink failed: " + error?.message);
  return { tokenHash, userId: data?.user?.id as string | undefined };
}

Deno.serve(async (req) => {
  const origin = req.headers.get("Origin") ?? "";
  const headers: Record<string, string> = { "Content-Type": "application/json", "Vary": "Origin" };
  if (ALLOWED_ORIGINS.has(origin)) {
    headers["Access-Control-Allow-Origin"] = origin;
    headers["Access-Control-Allow-Headers"] = "authorization, apikey, content-type, x-client-info";
    headers["Access-Control-Allow-Methods"] = "POST, OPTIONS";
  }
  const reply: Reply = (status, body) => new Response(JSON.stringify(body), { status, headers });

  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers });
  if (req.method !== "POST") return reply(405, { error: "method_not_allowed" });

  const appKey = Deno.env.get("YOUVERSION_APP_KEY") ?? "";
  const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
  const key = serviceKey();
  if (!appKey || !supabaseUrl || !key) {
    console.error("Missing configuration:", { appKey: !!appKey, supabaseUrl: !!supabaseUrl, serviceKey: !!key });
    return reply(500, { error: "server_not_configured" });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return reply(400, { error: "bad_request" });
  }
  const mode = body.mode ?? "signin";
  if (mode !== "signin" && mode !== "link" && mode !== "unlink") return reply(400, { error: "bad_request" });

  const admin = createClient(supabaseUrl, key, { auth: { persistSession: false, autoRefreshToken: false } });

  try {
    // ───── Disconnect ─────
    if (mode === "unlink") {
      const user = await currentUser(req, admin, reply);
      if (user instanceof Response) return user;
      if (isYouVersionOnly(user.email)) return reply(400, { error: "youversion_only_account" });
      const { error } = await admin.from("youversion_links").delete().eq("user_id", user.id);
      if (error) throw new Error("unlink failed: " + error.message);
      return reply(200, { linked: false });
    }

    const verified = await verifyYouVersionToken(body.id_token, body.nonce, appKey, reply);
    if (verified instanceof Response) return verified;
    const { yvId, payload } = verified;
    const legacyEmail = "yv-" + (await sha256Hex(yvId)).slice(0, 40) + "@" + ACCOUNT_DOMAIN;

    // ───── Connect to the signed-in account ─────
    if (mode === "link") {
      const user = await currentUser(req, admin, reply);
      if (user instanceof Response) return user;
      if (isYouVersionOnly(user.email)) return reply(400, { error: "youversion_only_account" });

      const mine = await linkRow(admin, "user_id", user.id);
      if (mine && mine.yvp_id !== yvId) return reply(409, { error: "already_linked_to_different_youversion" });
      if (mine) return reply(200, { linked: true, merged: false });

      // Is this YouVersion account already tied to some other site account?
      const existing = await linkRow(admin, "yvp_id", yvId);
      let oldUserId: string | null = null;
      if (existing) {
        const { data: other } = await admin.auth.admin.getUserById(existing.user_id);
        if (!isYouVersionOnly(other?.user?.email)) return reply(409, { error: "linked_to_other_account" });
        oldUserId = existing.user_id;
      } else {
        const { data: found, error } = await admin.rpc("sls_user_id_by_email", { p_email: legacyEmail });
        if (error) throw new Error("legacy lookup failed: " + error.message);
        oldUserId = (found as string | null) ?? null;
      }

      // Move answers from the old YouVersion-only account, then remove it.
      if (oldUserId && oldUserId !== user.id) {
        const { error: mergeError } = await admin.rpc("sls_merge_answers", { p_from: oldUserId, p_to: user.id });
        if (mergeError) throw new Error("merge failed: " + mergeError.message);
      }
      const { error: upsertError } = await admin.from("youversion_links")
        .upsert({ yvp_id: yvId, user_id: user.id, linked_at: new Date().toISOString() }, { onConflict: "yvp_id" });
      if (upsertError) throw new Error("link save failed: " + upsertError.message);
      if (oldUserId && oldUserId !== user.id) {
        const { error: delError } = await admin.auth.admin.deleteUser(oldUserId);
        if (delError) console.error("Old YouVersion-only account not deleted:", delError.message);
      }
      return reply(200, { linked: true, merged: !!oldUserId });
    }

    // ───── Sign in ─────
    const link = await linkRow(admin, "yvp_id", yvId);
    if (link) {
      const { data: linked } = await admin.auth.admin.getUserById(link.user_id);
      const email = linked?.user?.email;
      if (!email) throw new Error("linked account has no email");
      const { tokenHash } = await oneTimeKey(admin, email);
      return reply(200, { token_hash: tokenHash });
    }

    // Not connected to anything: use (or create) the YouVersion-only account.
    const { error: createError } = await admin.auth.admin.createUser({
      email: legacyEmail,
      email_confirm: true,
      app_metadata: { signin: "youversion", yvp_id: yvId },
      user_metadata: { full_name: typeof payload.name === "string" ? payload.name.slice(0, 100) : null }
    });
    const createCode = (createError as { code?: string } | null)?.code;
    const alreadyExists = createError &&
      (createCode === "email_exists" || createCode === "user_already_exists" ||
        /already|exists|registered/i.test(createError.message));
    if (createError && !alreadyExists) throw new Error("createUser failed: " + createError.message);

    const { tokenHash, userId } = await oneTimeKey(admin, legacyEmail);
    if (userId) {
      // Record the link so later sign-ins and connections find it directly.
      await admin.from("youversion_links").upsert({ yvp_id: yvId, user_id: userId }, { onConflict: "yvp_id", ignoreDuplicates: true });
    }
    return reply(200, { token_hash: tokenHash });
  } catch (err) {
    console.error("youversion-signin error:", (err as Error).message);
    return reply(500, { error: "server_error" });
  }
});
