// Supabase Edge Function: bible-passage
//
// Backup route for the verse preview. The site first asks YouVersion's API
// directly; only if the browser blocks that (CORS) does it come here, and this
// function makes the same request server-side with the site's App Key.
//
// It only forwards two kinds of read-only requests, for the site's own
// translations, from the site's own pages:
//   /bibles/{id}/passages/{BOOK.CH[.V[-V]]}?format=text
//   /bibles/{id}
//
// Setup (Supabase dashboard): uses the same YOUVERSION_APP_KEY secret as
// youversion-signin; turn OFF "Verify JWT" (visitors may not be signed in).

const API = "https://api.youversion.com/v1";
const ALLOWED_ORIGINS = new Set(["https://seeklikesilver.com", "https://www.seeklikesilver.com"]);
// bible.com / YouVersion IDs of the translations offered on the site (questions.js).
const ALLOWED_BIBLES = new Set([59, 111, 116, 1, 114, 1713, 2692, 100, 3345, 1588, 107, 3523, 2020, 463, 37, 97, 110, 12]);
const PASSAGE = /^\/bibles\/(\d+)\/passages\/([1-3]?[A-Z]{2,3})\.(\d{1,3})(?:\.(\d{1,3})(?:-(\d{1,3}))?)?\?format=text$/;
const BIBLE = /^\/bibles\/(\d+)$/;

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

  const appKey = Deno.env.get("YOUVERSION_APP_KEY") ?? "";
  if (!appKey) return reply(500, { error: "server_not_configured" });

  let path: unknown;
  try {
    ({ path } = await req.json());
  } catch {
    return reply(400, { error: "bad_request" });
  }
  if (typeof path !== "string" || path.length > 120) return reply(400, { error: "bad_request" });

  const decoded = path.replace(/%2E/gi, ".");
  const match = decoded.match(PASSAGE) ?? decoded.match(BIBLE);
  if (!match || !ALLOWED_BIBLES.has(Number(match[1]))) return reply(400, { error: "path_not_allowed" });

  const upstream = await fetch(API + decoded, { headers: { "X-YVP-App-Key": appKey } });
  const body = await upstream.text();
  if (!upstream.ok) return reply(upstream.status === 404 || upstream.status === 403 ? upstream.status : 502, { error: "upstream_" + upstream.status });
  return new Response(body, { status: 200, headers: { ...headers, "Cache-Control": "public, max-age=3600" } });
});
