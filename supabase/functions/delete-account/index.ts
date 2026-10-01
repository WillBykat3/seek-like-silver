// Supabase Edge Function: delete-account
//
// Permanently deletes the signed-in person's account. Everything tied to it
// goes too (the database deletes it automatically): profile, every answer,
// YouVersion connection, group memberships, and any groups they own.
//
// Proof required: a valid session for the account being deleted (with the
// authenticator code if they've turned one on), plus {"confirm": "DELETE"}.
//
// Setup (Supabase dashboard): deploy as "delete-account" and turn OFF
// "Verify JWT" (this function checks the session itself).

import { createClient } from "npm:@supabase/supabase-js@2";
import { decodeJwt } from "npm:jose@5";

const ALLOWED_ORIGINS = new Set(["https://seeklikesilver.com", "https://www.seeklikesilver.com"]);

function serviceKey(): string {
  try {
    const keys = JSON.parse(Deno.env.get("SUPABASE_SECRET_KEYS") ?? "{}");
    const first = Object.values(keys)[0];
    if (typeof first === "string" && first) return first;
  } catch { /* fall through */ }
  return Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
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
  if (!ALLOWED_ORIGINS.has(origin)) return reply(403, { error: "origin_not_allowed" });

  const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
  const key = serviceKey();
  if (!supabaseUrl || !key) return reply(500, { error: "server_not_configured" });

  let body: Record<string, unknown>;
  try { body = await req.json(); } catch { return reply(400, { error: "bad_request" }); }
  if (body.confirm !== "DELETE") return reply(400, { error: "not_confirmed" });

  const admin = createClient(supabaseUrl, key, { auth: { persistSession: false, autoRefreshToken: false } });
  try {
    const jwt = (req.headers.get("Authorization") ?? "").replace(/^Bearer\s+/i, "");
    if (!jwt) return reply(401, { error: "not_signed_in" });
    const { data, error } = await admin.auth.getUser(jwt); // validated by Supabase Auth
    if (error || !data?.user) return reply(401, { error: "not_signed_in" });

    let aal = "aal1";
    try { aal = String(decodeJwt(jwt).aal ?? "aal1"); } catch { /* treat as aal1 */ }
    const { data: factors } = await admin.auth.admin.mfa.listFactors({ userId: data.user.id });
    const hasVerifiedFactor = (factors?.factors ?? []).some((f: { status: string }) => f.status === "verified");
    if (hasVerifiedFactor && aal !== "aal2") return reply(403, { error: "authenticator_required" });

    const { error: delError } = await admin.auth.admin.deleteUser(data.user.id);
    if (delError) throw new Error("delete failed: " + delError.message);
    return reply(200, { deleted: true });
  } catch (err) {
    console.error("delete-account error:", (err as Error).message);
    return reply(500, { error: "server_error" });
  }
});
