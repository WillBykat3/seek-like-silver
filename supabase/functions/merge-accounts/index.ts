// Supabase Edge Function: merge-accounts
//
// Joins a separate Google-sign-in account into the account the person is
// signed in to right now (the one they want to keep).
//
// Proof required, both checked here:
//   1. They're signed in to the account being kept (their Supabase session),
//      with their authenticator code if they've turned one on.
//   2. They control the other account's Google login: a fresh Google ID token,
//      signed by Google, issued to this site, carrying the one-time nonce the
//      site created for this request.
//
// Then: the other account's answers move over (if both answered the same
// question, the newer answer wins), its YouVersion connection moves over if
// the kept account has none, and the other account is deleted. The kept
// account's settings are untouched. The site then attaches Google to the
// kept account.
//
// Setup (Supabase dashboard): deploy as "merge-accounts", turn OFF "Verify JWT"
// (this function verifies the session itself), and run
// supabase-migrations/004-merge-accounts.sql.

import { createClient, type SupabaseClient } from "npm:@supabase/supabase-js@2";
import { createRemoteJWKSet, decodeJwt, jwtVerify } from "npm:jose@5";

const GOOGLE_CLIENT_ID = "684287820535-5dh585uinpli7afbirco3r33jejkclqi.apps.googleusercontent.com";
const GOOGLE_ISSUERS = ["https://accounts.google.com", "accounts.google.com"];
const GOOGLE_JWKS = createRemoteJWKSet(new URL("https://www.googleapis.com/oauth2/v3/certs"));
const ALLOWED_ORIGINS = new Set(["https://seeklikesilver.com", "https://www.seeklikesilver.com"]);

function serviceKey(): string {
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

type Reply = (status: number, body: unknown) => Response;

async function currentUser(req: Request, admin: SupabaseClient, reply: Reply) {
  const jwt = (req.headers.get("Authorization") ?? "").replace(/^Bearer\s+/i, "");
  if (!jwt) return reply(401, { error: "not_signed_in" });
  const { data, error } = await admin.auth.getUser(jwt); // validated by Supabase Auth
  if (error || !data?.user) return reply(401, { error: "not_signed_in" });
  let aal = "aal1";
  try { aal = String(decodeJwt(jwt).aal ?? "aal1"); } catch { /* treat as aal1 */ }
  const { data: factors } = await admin.auth.admin.mfa.listFactors({ userId: data.user.id });
  const hasVerifiedFactor = (factors?.factors ?? []).some((f: { status: string }) => f.status === "verified");
  if (hasVerifiedFactor && aal !== "aal2") return reply(403, { error: "authenticator_required" });
  return data.user;
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

  const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
  const key = serviceKey();
  if (!supabaseUrl || !key) return reply(500, { error: "server_not_configured" });

  let body: Record<string, unknown>;
  try { body = await req.json(); } catch { return reply(400, { error: "bad_request" }); }
  const { provider, id_token: idToken, nonce } = body;
  if (provider !== "google" || typeof idToken !== "string" || typeof nonce !== "string" || nonce.length < 16) {
    return reply(400, { error: "bad_request" });
  }

  const admin = createClient(supabaseUrl, key, { auth: { persistSession: false, autoRefreshToken: false } });

  try {
    const user = await currentUser(req, admin, reply);
    if (user instanceof Response) return user;

    // Proof they control the other account's Google login.
    let payload: Record<string, unknown>;
    try {
      ({ payload } = await jwtVerify(idToken, GOOGLE_JWKS, {
        issuer: GOOGLE_ISSUERS,
        audience: GOOGLE_CLIENT_ID,
        algorithms: ["RS256"],
        clockTolerance: 30
      }));
    } catch (err) {
      const e = err as { code?: string; claim?: string };
      return reply(401, { error: "invalid_google_token", detail: [e.code, e.claim].filter(Boolean).join(" ") });
    }
    // The site gave Google the SHA-256 of a one-time nonce; it sends us the original.
    if (payload.nonce !== (await sha256Hex(nonce))) return reply(401, { error: "nonce_mismatch" });
    const googleId = String(payload.sub ?? "");
    if (!googleId) return reply(401, { error: "invalid_google_token" });

    const { data: otherId, error: findError } = await admin.rpc("sls_user_id_by_identity", { p_provider: "google", p_provider_id: googleId });
    if (findError) throw new Error("identity lookup failed: " + findError.message);
    if (!otherId) return reply(404, { error: "no_other_account" });
    if (otherId === user.id) return reply(200, { merged: false, already_same_account: true });

    // Answers: newer copy wins on conflicts.
    const { error: mergeError } = await admin.rpc("sls_merge_answers", { p_from: otherId, p_to: user.id });
    if (mergeError) throw new Error("merge failed: " + mergeError.message);

    // YouVersion connection: move it over if the kept account doesn't have one.
    const { data: keptLink } = await admin.from("youversion_links").select("yvp_id").eq("user_id", user.id).maybeSingle();
    if (!keptLink) {
      const { error: moveError } = await admin.from("youversion_links").update({ user_id: user.id }).eq("user_id", otherId);
      if (moveError) throw new Error("link move failed: " + moveError.message);
    }

    // Remove the other account (its Google login is then free to attach here).
    const { error: delError } = await admin.auth.admin.deleteUser(otherId as string);
    if (delError) throw new Error("delete failed: " + delError.message);

    return reply(200, { merged: true });
  } catch (err) {
    console.error("merge-accounts error:", (err as Error).message);
    return reply(500, { error: "server_error" });
  }
});
