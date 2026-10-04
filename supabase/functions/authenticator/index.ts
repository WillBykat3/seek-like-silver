// Supabase Edge Function: authenticator
//
// Lets someone sign in with EITHER an emailed code (handled by Supabase as before)
// OR a 6-digit code from their authenticator app (handled here).
//
// Actions (POST JSON {action, ...}):
//   status          signed in  → { enabled }
//   enroll_start    signed in  → { secret, otpauth, qr_svg }   (new secret, not active yet)
//   enroll_confirm  signed in  → { enabled: true }             (needs a correct code)
//   disable         signed in  → { enabled: false }
//   signin          signed out → { token_hash }                 (needs email + correct code)
//
// Safety:
//   - Secrets are encrypted (AES-GCM) with a key derived from the project's secret key.
//   - A code can't be reused; 5 wrong codes lock that account's authenticator sign-in for
//     15 minutes; each IP address gets 20 tries per 15 minutes.
//   - Sign-in answers the same way whether or not the email exists or has an authenticator.
//
// Setup (Supabase dashboard): deploy as "authenticator", turn OFF "Verify JWT"
// (this function checks sessions itself), and run supabase-migrations/008-authenticator-signin.sql.

import { createClient, type SupabaseClient } from "npm:@supabase/supabase-js@2";
import { decodeJwt } from "npm:jose@5";
import QRCode from "npm:qrcode@1";

const ALLOWED_ORIGINS = new Set(["https://seeklikesilver.com", "https://www.seeklikesilver.com"]);
const ISSUER = "Seek Like Silver";
const STEP = 30;
const MAX_FAILURES = 5;
const LOCK_MINUTES = 15;
const IP_LIMIT = 20;

function serviceKey(): string {
  try {
    const keys = JSON.parse(Deno.env.get("SUPABASE_SECRET_KEYS") ?? "{}");
    const first = Object.values(keys)[0];
    if (typeof first === "string" && first) return first;
  } catch { /* fall through */ }
  return Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
}

// ───── small helpers ─────
const enc = new TextEncoder();
const b64 = (u: Uint8Array) => btoa(String.fromCharCode(...u));
const unb64 = (s: string) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0));
const B32 = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
function base32(bytes: Uint8Array): string {
  let bits = 0, value = 0, out = "";
  for (const b of bytes) {
    value = (value << 8) | b; bits += 8;
    while (bits >= 5) { out += B32[(value >>> (bits - 5)) & 31]; bits -= 5; }
  }
  if (bits > 0) out += B32[(value << (5 - bits)) & 31];
  return out;
}
async function sha256Hex(text: string): Promise<string> {
  const d = await crypto.subtle.digest("SHA-256", enc.encode(text));
  return [...new Uint8Array(d)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

async function aesKey(secretKey: string): Promise<CryptoKey> {
  const base = await crypto.subtle.importKey("raw", enc.encode(secretKey), "HKDF", false, ["deriveKey"]);
  return crypto.subtle.deriveKey(
    { name: "HKDF", hash: "SHA-256", salt: enc.encode("sls-authenticator-v1"), info: enc.encode("totp-secrets") },
    base, { name: "AES-GCM", length: 256 }, false, ["encrypt", "decrypt"]);
}
async function seal(key: CryptoKey, secret: Uint8Array): Promise<string> {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const ct = new Uint8Array(await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, secret));
  return b64(iv) + "." + b64(ct);
}
async function open(key: CryptoKey, sealed: string): Promise<Uint8Array> {
  const [iv, ct] = sealed.split(".");
  return new Uint8Array(await crypto.subtle.decrypt({ name: "AES-GCM", iv: unb64(iv) }, key, unb64(ct)));
}

// RFC 6238 TOTP (SHA-1, 30 s, 6 digits) — what authenticator apps use.
async function totp(secret: Uint8Array, step: number): Promise<string> {
  const msg = new Uint8Array(8);
  new DataView(msg.buffer).setBigUint64(0, BigInt(step));
  const k = await crypto.subtle.importKey("raw", secret, { name: "HMAC", hash: "SHA-1" }, false, ["sign"]);
  const h = new Uint8Array(await crypto.subtle.sign("HMAC", k, msg));
  const o = h[h.length - 1] & 15;
  const n = ((h[o] & 127) << 24) | (h[o + 1] << 16) | (h[o + 2] << 8) | h[o + 3];
  return String(n % 1_000_000).padStart(6, "0");
}
// Returns the matching step (allowing one step of clock drift either way), or 0.
async function matchStep(secret: Uint8Array, code: string, nowSec: number): Promise<number> {
  const now = Math.floor(nowSec / STEP);
  for (const s of [now, now - 1, now + 1]) if ((await totp(secret, s)) === code) return s;
  return 0;
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
  const skey = serviceKey();
  if (!supabaseUrl || !skey) return reply(500, { error: "server_not_configured" });
  const admin = createClient(supabaseUrl, skey, { auth: { persistSession: false, autoRefreshToken: false } });
  const key = await aesKey(skey);

  let body: Record<string, unknown>;
  try { body = await req.json(); } catch { return reply(400, { error: "bad_request" }); }
  const action = body.action;
  const code = typeof body.code === "string" ? body.code.replace(/\D/g, "") : "";

  try {
    // ───── signing in (no session) ─────
    if (action === "signin") {
      const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
      if (!email || email.length > 320 || code.length !== 6) return reply(400, { error: "bad_request" });

      const ip = (req.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || "unknown";
      const ipKey = await sha256Hex("ip:" + ip);
      const since = new Date(Date.now() - LOCK_MINUTES * 60_000).toISOString();
      const { count } = await admin.from("sls_signin_attempts").select("id", { count: "exact", head: true })
        .eq("key", ipKey).gte("at", since);
      if ((count ?? 0) >= IP_LIMIT) return reply(429, { error: "too_many_attempts" });
      await admin.from("sls_signin_attempts").insert({ key: ipKey });
      await admin.from("sls_signin_attempts").delete().lt("at", new Date(Date.now() - 24 * 3600_000).toISOString());

      const { data: userId } = await admin.rpc("sls_user_id_by_email", { p_email: email });
      const { data: row } = userId
        ? await admin.from("sls_authenticators").select("*").eq("user_id", userId).eq("confirmed", true).maybeSingle()
        : { data: null };
      if (!row) return reply(401, { error: "invalid_code" }); // same answer as a wrong code
      if (row.locked_until && new Date(row.locked_until) > new Date()) return reply(429, { error: "too_many_attempts" });

      const step = await matchStep(await open(key, row.secret_enc), code, Date.now() / 1000);
      if (!step || step <= row.last_step) {
        const failures = row.failures + 1;
        await admin.from("sls_authenticators").update({
          failures: failures >= MAX_FAILURES ? 0 : failures,
          locked_until: failures >= MAX_FAILURES ? new Date(Date.now() + LOCK_MINUTES * 60_000).toISOString() : row.locked_until
        }).eq("user_id", row.user_id);
        return reply(failures >= MAX_FAILURES ? 429 : 401, { error: failures >= MAX_FAILURES ? "too_many_attempts" : "invalid_code" });
      }
      await admin.from("sls_authenticators").update({ last_step: step, failures: 0, locked_until: null }).eq("user_id", row.user_id);

      // Make a one-time sign-in token for this account (nothing is emailed).
      const { data: user } = await admin.auth.admin.getUserById(row.user_id);
      const { data: link, error: linkError } = await admin.auth.admin.generateLink({ type: "magiclink", email: user.user!.email! });
      if (linkError || !link?.properties?.hashed_token) throw new Error("link failed: " + (linkError?.message ?? "no token"));
      return reply(200, { token_hash: link.properties.hashed_token });
    }

    // ───── everything else needs a signed-in person ─────
    const jwt = (req.headers.get("Authorization") ?? "").replace(/^Bearer\s+/i, "");
    if (!jwt) return reply(401, { error: "not_signed_in" });
    const { data: auth, error: authError } = await admin.auth.getUser(jwt);
    if (authError || !auth?.user) return reply(401, { error: "not_signed_in" });
    const user = auth.user;
    // If they still use Supabase's built-in two-step code, they must have entered it.
    let aal = "aal1";
    try { aal = String(decodeJwt(jwt).aal ?? "aal1"); } catch { /* aal1 */ }
    const { data: factors } = await admin.auth.admin.mfa.listFactors({ userId: user.id });
    const oldFactors = (factors?.factors ?? []).filter((f: { status: string }) => f.status === "verified");
    if (oldFactors.length && aal !== "aal2") return reply(403, { error: "authenticator_required" });

    const { data: row } = await admin.from("sls_authenticators").select("*").eq("user_id", user.id).maybeSingle();

    if (action === "status") return reply(200, { enabled: !!row?.confirmed, legacy_two_step: oldFactors.length > 0 });

    if (action === "enroll_start") {
      const secret = crypto.getRandomValues(new Uint8Array(20));
      await admin.from("sls_authenticators").upsert({
        user_id: user.id, secret_enc: await seal(key, secret), confirmed: false, last_step: 0, failures: 0, locked_until: null, confirmed_at: null
      });
      const label = encodeURIComponent(ISSUER + ":" + (user.email ?? "account"));
      const s32 = base32(secret);
      const otpauth = `otpauth://totp/${label}?secret=${s32}&issuer=${encodeURIComponent(ISSUER)}&algorithm=SHA1&digits=6&period=30`;
      const qr_svg = await QRCode.toString(otpauth, { type: "svg", margin: 1, errorCorrectionLevel: "M" });
      return reply(200, { secret: s32.replace(/(.{4})/g, "$1 ").trim(), otpauth, qr_svg });
    }

    if (action === "enroll_confirm") {
      if (!row || row.confirmed) return reply(400, { error: "no_pending_setup" });
      if (code.length !== 6) return reply(400, { error: "bad_request" });
      const secret = await open(key, row.secret_enc);
      const step = await matchStep(secret, code, Date.now() / 1000);
      if (!step) {
        // Right app, wrong clock? Look up to 10 minutes either way, only to explain the problem.
        const now = Math.floor(Date.now() / 1000 / STEP);
        for (let d = 2; d <= 20; d++) {
          if ((await totp(secret, now - d)) === code || (await totp(secret, now + d)) === code) {
            return reply(401, { error: "clock_off" });
          }
        }
        return reply(401, { error: "invalid_code" });
      }
      await admin.from("sls_authenticators").update({ confirmed: true, confirmed_at: new Date().toISOString(), last_step: step }).eq("user_id", user.id);
      // The authenticator is now a sign-in option, so retire Supabase's built-in two-step code.
      for (const f of oldFactors) await admin.auth.admin.mfa.deleteFactor({ userId: user.id, id: f.id });
      return reply(200, { enabled: true });
    }

    if (action === "disable") {
      await admin.from("sls_authenticators").delete().eq("user_id", user.id);
      return reply(200, { enabled: false });
    }

    return reply(400, { error: "bad_request" });
  } catch (err) {
    console.error("authenticator error:", (err as Error).message);
    return reply(500, { error: "server_error" });
  }
});
