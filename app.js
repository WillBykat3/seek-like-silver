// Seek Like Silver — app logic
// All user-written text is inserted with textContent (never innerHTML) so it can't inject code.

// YouVersion sends people back to this page with ?state=… (and later &code=…).
// Grab those parameters and clean the address bar before anything else reads the URL.
const YV_API = "https://api.youversion.com";
const YV_STORE = { state: "sls-yv-state", verifier: "sls-yv-verifier", nonce: "sls-yv-nonce", mode: "sls-yv-mode" };
const yvReturn = (() => {
  try {
    const expected = sessionStorage.getItem(YV_STORE.state);
    if (!expected) return null;
    const p = new URLSearchParams(window.location.search);
    if (!p.has("state") && !p.has("error")) return null;
    const ret = {
      expected,
      state: p.get("state"),
      code: p.get("code"),
      error: p.get("error"),
      errorDescription: p.get("error_description")
    };
    history.replaceState(null, "", window.location.pathname + window.location.hash);
    return ret;
  } catch (_) {
    return null;
  }
})();

// If the Supabase library fails to load (ad blocker, network), questions still work;
// only sign-in and saving are unavailable.
const db = window.supabase ? window.supabase.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY) : null;
if (!db) console.error("Supabase library didn't load; sign-in and saving are unavailable.");

const LEVEL_LABELS = { beginner: "Beginner", moderate: "Moderate", philosopher: "Philosopher" };
const DRAFT_KEY = "sls-draft"; // keeps an unsaved answer through the Google sign-in redirect

const state = {
  user: null,
  profile: { denomination: "general", translation: "ESV", display_name: "" },
  answers: new Map(), // question_id -> answer row
  level: null,
  question: null
};

const $ = (id) => document.getElementById(id);

// ─────────────────────────── Question lookup ───────────────────────────

const QUESTION_INDEX = new Map();
for (const [level, list] of Object.entries(QUESTIONS)) {
  for (const q of list) QUESTION_INDEX.set(q.id, { ...q, level });
}

function pickQuestion(level) {
  const list = QUESTIONS[level];
  const notCurrent = list.filter((q) => !state.question || q.id !== state.question.id);
  const unanswered = notCurrent.filter((q) => !state.answers.has(q.id));
  const pool = unanswered.length ? unanswered : (notCurrent.length ? notCurrent : list);
  return pool[Math.floor(Math.random() * pool.length)];
}

// ─────────────────────────── Verse links (YouVersion / bible.com) ───────────────────────────
// Built from TRANSLATION_INFO in questions.js.
const YV_VERSIONS = Object.fromEntries(TRANSLATION_INFO.map((t) => [t.code, [t.id, t.abbr]]));

// Standard (USFM) book codes used by bible.com.
const BOOK_CODES = {
  "genesis": "GEN", "exodus": "EXO", "leviticus": "LEV", "numbers": "NUM", "deuteronomy": "DEU",
  "joshua": "JOS", "judges": "JDG", "ruth": "RUT", "1 samuel": "1SA", "2 samuel": "2SA",
  "1 kings": "1KI", "2 kings": "2KI", "1 chronicles": "1CH", "2 chronicles": "2CH", "ezra": "EZR",
  "nehemiah": "NEH", "esther": "EST", "job": "JOB", "psalm": "PSA", "psalms": "PSA",
  "proverbs": "PRO", "ecclesiastes": "ECC", "song of songs": "SNG", "song of solomon": "SNG",
  "isaiah": "ISA", "jeremiah": "JER", "lamentations": "LAM", "ezekiel": "EZK", "daniel": "DAN",
  "hosea": "HOS", "joel": "JOL", "amos": "AMO", "obadiah": "OBA", "jonah": "JON", "micah": "MIC",
  "nahum": "NAM", "habakkuk": "HAB", "zephaniah": "ZEP", "haggai": "HAG", "zechariah": "ZEC",
  "malachi": "MAL", "matthew": "MAT", "mark": "MRK", "luke": "LUK", "john": "JHN", "acts": "ACT",
  "romans": "ROM", "1 corinthians": "1CO", "2 corinthians": "2CO", "galatians": "GAL",
  "ephesians": "EPH", "philippians": "PHP", "colossians": "COL", "1 thessalonians": "1TH",
  "2 thessalonians": "2TH", "1 timothy": "1TI", "2 timothy": "2TI", "titus": "TIT",
  "philemon": "PHM", "hebrews": "HEB", "james": "JAS", "1 peter": "1PE", "2 peter": "2PE",
  "1 john": "1JN", "2 john": "2JN", "3 john": "3JN", "jude": "JUD", "revelation": "REV"
};

// "John 1:1-14" -> "JHN.1.1-14"; "Psalm 23" -> "PSA.23"; "Job 38-42" -> "JOB.38"
// (bible.com can't show a span of whole chapters, so those open at the first chapter).
function usfmFor(ref) {
  const m = ref.trim().match(/^(.+?)\s+(\d+)(?::(\d+)(?:-(\d+))?)?(?:-\d+)?$/);
  if (!m) return null;
  const book = BOOK_CODES[m[1].toLowerCase()];
  if (!book) return null;
  let usfm = book + "." + m[2];
  if (m[3]) usfm += "." + m[3] + (m[4] ? "-" + m[4] : "");
  return usfm;
}

function verseLink(ref) {
  const [id, abbr] = YV_VERSIONS[state.profile.translation] || YV_VERSIONS.ESV;
  const usfm = usfmFor(ref);
  if (!usfm) return "https://www.bible.com/search/bible?q=" + encodeURIComponent(ref);
  return "https://www.bible.com/bible/" + id + "/" + usfm + "." + abbr;
}

// ─────────────────────────── Verse preview (YouVersion licensed text) ───────────────────────────
// Hovering a verse link for PREVIEW_DELAY_MS (or tapping the small "Show text"
// button, for phones and keyboards) shows the passage right under the link.
// Text comes from YouVersion's API under the site's license. Translations the
// license doesn't cover fall back to PREVIEW_FALLBACK, clearly labeled.

const PREVIEW_DELAY_MS = 1500;
const PREVIEW_FALLBACK = "NIV";
const YV_BIBLE_API = "https://api.youversion.com/v1";
const passageCache = new Map();   // "id|usfm" -> Promise<{text, reference} | null>
const copyrightCache = new Map(); // id -> Promise<string>
let directApiBlocked = false;     // set if the browser blocks direct calls (CORS); then use our proxy

async function yvGet(path) {
  if (!YOUVERSION_APP_KEY) throw new Error("no_app_key");
  if (!directApiBlocked) {
    try {
      const resp = await fetch(YV_BIBLE_API + path, { headers: { "X-YVP-App-Key": YOUVERSION_APP_KEY } });
      if (resp.ok) return await resp.json();
      if (resp.status === 401 || resp.status === 403 || resp.status === 404) return null; // not licensed / not found
      throw new Error("http_" + resp.status);
    } catch (err) {
      if (!(err instanceof TypeError)) throw err;
      directApiBlocked = true; // network/CORS block; try our proxy from now on
    }
  }
  if (!db) throw new Error("unavailable");
  const { data, error } = await db.functions.invoke("bible-passage", { body: { path } });
  if (error) {
    const status = error.context && error.context.status;
    if (status === 404 || status === 403) return null;
    throw error;
  }
  return data;
}

function fetchPassage(id, usfm) {
  const key = id + "|" + usfm;
  if (!passageCache.has(key)) {
    const p = yvGet("/bibles/" + id + "/passages/" + encodeURIComponent(usfm) + "?format=text")
      .then((d) => (d && typeof d.content === "string" && d.content.trim() ? { text: d.content.trim(), reference: d.reference || "" } : null));
    p.catch(() => passageCache.delete(key)); // let a later hover retry after a network error
    passageCache.set(key, p);
  }
  return passageCache.get(key);
}

function fetchCopyright(id) {
  if (!copyrightCache.has(id)) {
    const p = yvGet("/bibles/" + id).then((d) => {
      const raw = (d && (d.copyright || d.copyright_short || d.promotional_content)) || "";
      // Copyright may contain HTML; keep only its text.
      return new DOMParser().parseFromString(String(raw), "text/html").body.textContent.trim();
    }).catch(() => "");
    copyrightCache.set(id, p);
  }
  return copyrightCache.get(id);
}

function attachVersePreview(li, link, ref) {
  const usfm = usfmFor(ref);
  if (!usfm || !YOUVERSION_APP_KEY) return;

  const toggle = document.createElement("button");
  toggle.type = "button";
  toggle.className = "verse-toggle";
  toggle.textContent = "Show text";
  toggle.setAttribute("aria-expanded", "false");

  const panel = document.createElement("div");
  panel.className = "verse-preview";
  panel.hidden = true;
  panel.setAttribute("role", "region");
  panel.setAttribute("aria-label", ref + " text");
  toggle.setAttribute("aria-controls", (panel.id = "vp-" + usfm.replace(/[^A-Za-z0-9]/g, "-")));

  li.append(" ", toggle, panel);

  let timer = null;
  let loaded = false;
  const open = async () => {
    panel.hidden = false;
    toggle.setAttribute("aria-expanded", "true");
    toggle.textContent = "Hide text";
    if (!loaded) {
      loaded = true;
      await fillPreview(panel, ref, usfm);
    }
  };
  const close = () => {
    panel.hidden = true;
    toggle.setAttribute("aria-expanded", "false");
    toggle.textContent = "Show text";
  };

  link.addEventListener("mouseenter", () => { timer = setTimeout(open, PREVIEW_DELAY_MS); });
  link.addEventListener("mouseleave", () => clearTimeout(timer));
  toggle.addEventListener("click", () => (panel.hidden ? open() : close()));
}

async function fillPreview(panel, ref, usfm) {
  panel.replaceChildren();
  const status = document.createElement("p");
  status.className = "verse-preview-status";
  status.textContent = "Loading…";
  panel.append(status);

  const wanted = state.profile.translation in YV_VERSIONS ? state.profile.translation : "ESV";
  try {
    let code = wanted;
    let passage = await fetchPassage(YV_VERSIONS[code][0], usfm);
    if (!passage && wanted !== PREVIEW_FALLBACK) {
      code = PREVIEW_FALLBACK;
      passage = await fetchPassage(YV_VERSIONS[code][0], usfm);
    }
    if (!passage) {
      status.textContent = "Text preview isn't available for this passage. Open the link to read it.";
      return;
    }
    const id = YV_VERSIONS[code][0];
    const text = document.createElement("p");
    text.className = "verse-preview-text";
    text.textContent = passage.text;

    const source = document.createElement("p");
    source.className = "verse-preview-source";
    source.textContent = (passage.reference || ref.replace(/-/g, "–")) + " (" + code + ")" +
      (code !== wanted ? ". " + wanted + " isn't available for preview, so this is shown in " + code + "." : "");

    const copyright = document.createElement("p");
    copyright.className = "verse-preview-copyright";
    panel.replaceChildren(text, source, copyright);
    copyright.textContent = await fetchCopyright(id);
    if (!copyright.textContent) copyright.remove();
  } catch (err) {
    console.error("Verse preview:", err);
    status.textContent = "Couldn't load the text right now. Open the link to read it.";
  }
}

// ─────────────────────────── Views ───────────────────────────

function showView(name) {
  for (const v of ["home", "question", "answers", "library", "settings"]) {
    $("view-" + v).hidden = v !== name;
  }
  document.querySelectorAll(".nav-link").forEach((b) => {
    const target = b.dataset.nav;
    b.classList.toggle("active", target === name || (name === "question" && target === "home"));
  });
  if (name === "answers") renderAnswers();
  if (name === "settings") renderSettings();
  if (name === "library") renderLibrary();
  window.scrollTo(0, 0);
}

function openQuestion(q, level) {
  state.level = level;
  state.question = q;

  $("q-level").textContent = LEVEL_LABELS[level];
  $("view-question").dataset.level = level; // drives the level color
  $("q-prompt").textContent = q.prompt;

  const verses = $("q-verses");
  verses.replaceChildren();
  for (const ref of q.verses) {
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.href = verseLink(ref);
    a.target = "_blank";
    a.rel = "noopener";
    a.textContent = ref.replace(/-/g, "–");
    li.append(a);
    attachVersePreview(li, a, ref);
    verses.append(li);
  }

  const readings = $("q-readings");
  readings.replaceChildren();
  for (const r of q.readings) {
    const li = document.createElement("li");
    li.append(document.createTextNode(r.who + ", "));
    const w = document.createElement("span");
    w.className = "work";
    w.textContent = r.work;
    li.append(w);
    readings.append(li);
  }

  renderTradition();

  const saved = state.answers.get(q.id);
  $("answer").value = saved ? saved.answer : "";
  setStatus("save-status", saved ? "You answered this on " + formatDate(saved.updated_at) + "." : "");

  showView("question");
}

function renderTradition() {
  const t = TRADITIONS[state.profile.denomination] || TRADITIONS.general;
  $("q-tradition-label").textContent = "(" + t.label + ")";
  const list = $("q-tradition");
  list.replaceChildren();
  for (const s of t.sources) {
    const li = document.createElement("li");
    li.textContent = s;
    list.append(li);
  }
}

function renderAnswers() {
  const list = $("answers-list");
  list.replaceChildren();
  $("answers-signed-out").hidden = !!state.user;
  $("answers-empty").hidden = !state.user || state.answers.size > 0;
  if (!state.user) return;

  const rows = [...state.answers.values()].sort((a, b) => b.updated_at.localeCompare(a.updated_at));
  for (const row of rows) {
    const q = QUESTION_INDEX.get(row.question_id);
    const card = document.createElement("article");
    card.className = "saved-answer";

    const meta = document.createElement("div");
    meta.className = "meta level-" + row.level;
    meta.textContent = LEVEL_LABELS[row.level] + " · " + formatDate(row.updated_at);

    const title = document.createElement("h3");
    title.textContent = q ? q.prompt : "(This question is no longer in the bank)";

    const body = document.createElement("p");
    body.className = "body";
    body.textContent = row.answer;

    const actions = document.createElement("div");
    actions.className = "row";
    if (q) {
      const edit = document.createElement("button");
      edit.className = "link-button";
      edit.textContent = "Open";
      edit.onclick = () => openQuestion(q, q.level);
      actions.append(edit);
    }
    const del = document.createElement("button");
    del.className = "link-button";
    del.textContent = "Delete";
    del.onclick = () => deleteAnswer(row);
    actions.append(del);

    card.append(meta, title, body, actions);
    list.append(card);
  }
}

function renderLibrary() {
  const freeList = $("library-free");
  if (freeList.childElementCount) return; // already built
  const copyList = $("library-copyright");
  const byAuthor = (x, y) => x.who.localeCompare(y.who) || x.work.localeCompare(y.work);
  for (const book of [...LIBRARY].sort(byAuthor)) {
    const li = document.createElement("li");
    li.className = "library-item";
    const title = document.createElement("span");
    title.className = "library-work";
    title.textContent = book.work;
    const author = document.createElement("span");
    author.className = "library-who";
    author.textContent = book.who;

    const a = document.createElement("a");
    a.className = "library-link";
    a.target = "_blank";
    a.rel = "noopener";
    if (book.free) {
      a.href = book.url;
      a.textContent = "Read free at " + book.source;
    } else {
      a.href = "https://search.worldcat.org/search?q=" + encodeURIComponent(book.work + " " + book.who);
      a.textContent = "Find a copy";
    }
    li.append(title, author, a);
    if (book.note) {
      const note = document.createElement("span");
      note.className = "library-note";
      note.textContent = book.note;
      li.append(note);
    }
    (book.free ? freeList : copyList).append(li);
  }
}

function renderSettings() {
  $("settings-signed-out").hidden = !!state.user;
  $("settings-form").hidden = !state.user;
  if (!state.user) {
    $("methods-panel").hidden = true;
    $("mfa-panel").hidden = true;
    return;
  }

  const denom = $("set-denomination");
  if (!denom.options.length) {
    for (const [value, t] of Object.entries(TRADITIONS)) denom.add(new Option(t.label, value));
  }
  const trans = $("set-translation");
  if (!trans.options.length) {
    for (const t of TRANSLATION_INFO) trans.add(new Option(t.name + " (" + t.code + ")", t.code));
  }
  $("set-name").value = state.profile.display_name || "";
  denom.value = state.profile.denomination;
  trans.value = state.profile.translation;
  setStatus("settings-status", "");
  renderMethods();
  renderMfaPanel();
}

// ─────────────────────────── Data ───────────────────────────

async function loadUserData() {
  if (!state.user) {
    state.answers.clear();
    state.profile = { denomination: "general", translation: "ESV", display_name: "" };
    return;
  }

  // Create the profile row the first time someone signs in (does nothing if it exists).
  await db.from("profiles").upsert({ id: state.user.id }, { onConflict: "id", ignoreDuplicates: true });

  const [{ data: profile, error: pErr }, { data: answers, error: aErr }] = await Promise.all([
    db.from("profiles").select("display_name, denomination, translation").eq("id", state.user.id).maybeSingle(),
    db.from("answers").select("id, question_id, level, answer, updated_at")
  ]);

  if (pErr) console.error("Profile load failed:", pErr);
  if (aErr) console.error("Answers load failed:", aErr);
  if (profile) state.profile = profile;
  state.answers = new Map((answers || []).map((r) => [r.question_id, r]));
}

async function saveAnswer() {
  const text = $("answer").value.trim();
  if (!state.question) return;
  if (!text) return setStatus("save-status", "Write an answer first.", "err");

  if (!state.user) {
    stashDraft(text);
    setStatus("save-status", "Sign in to save. Your answer will be kept.", "");
    return openSignIn();
  }

  $("save-answer").disabled = true;
  setStatus("save-status", "Saving…");
  const { data, error } = await db
    .from("answers")
    .upsert(
      {
        user_id: state.user.id,
        question_id: state.question.id,
        level: state.level,
        answer: text,
        updated_at: new Date().toISOString()
      },
      { onConflict: "user_id,question_id" }
    )
    .select("id, question_id, level, answer, updated_at")
    .single();
  $("save-answer").disabled = false;

  if (error) {
    console.error(error);
    return setStatus("save-status", "Couldn't save: " + error.message, "err");
  }
  state.answers.set(data.question_id, data);
  clearDraft();
  setStatus("save-status", "Saved.", "ok");
}

async function deleteAnswer(row) {
  if (!confirm("Delete this answer? This can't be undone.")) return;
  const { error } = await db.from("answers").delete().eq("id", row.id);
  if (error) return alert("Couldn't delete: " + error.message);
  state.answers.delete(row.question_id);
  renderAnswers();
}

async function saveSettings(e) {
  e.preventDefault();
  const update = {
    display_name: $("set-name").value.trim() || null,
    denomination: $("set-denomination").value,
    translation: $("set-translation").value
  };
  setStatus("settings-status", "Saving…");
  const { error } = await db.from("profiles").update(update).eq("id", state.user.id);
  if (error) return setStatus("settings-status", "Couldn't save: " + error.message, "err");
  state.profile = { ...state.profile, ...update };
  setStatus("settings-status", "Saved.", "ok");
}

// ─────────────────────────── Sign in ───────────────────────────

function redirectUrl() {
  return window.location.origin + window.location.pathname;
}

function openSignIn() {
  // Keep anything typed so far; signing in reloads the question view.
  if (state.question && !$("view-question").hidden && $("answer").value.trim()) {
    stashDraft($("answer").value);
  }
  $("email-form").hidden = false;
  $("code-form").hidden = true;
  setStatus("signin-status", db ? "" : "Sign-in couldn't load. Check your connection or ad blocker, then refresh.", db ? "" : "err");
  if (!$("signin-dialog").open) $("signin-dialog").showModal();
  setUpGoogleButton();
  setUpYouVersionButton();
}

// ─────────────────────────── YouVersion sign-in ───────────────────────────
// YouVersion's documented flow: (1) send the person to /auth/authorize;
// (2) they come back with only ?state, and we send them to /auth/callback;
// (3) they come back with ?code, which we exchange for an ID token.
// Our Supabase function "youversion-signin" verifies that token and returns a
// one-time key we trade for a normal session.

function randomUrlSafe(byteCount) {
  const bytes = crypto.getRandomValues(new Uint8Array(byteCount));
  return btoa(String.fromCharCode(...bytes)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function pkceChallenge(verifier) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(verifier));
  return btoa(String.fromCharCode(...new Uint8Array(digest))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function clearYouVersionStore() {
  for (const k of Object.values(YV_STORE)) {
    try { sessionStorage.removeItem(k); } catch (_) { /* ignore */ }
  }
}

function setUpYouVersionButton() {
  const btn = $("signin-youversion");
  const ready = !!(YOUVERSION_APP_KEY && db && window.crypto && crypto.subtle);
  btn.disabled = !ready;
  btn.textContent = ready ? "Continue with YouVersion" : "Continue with YouVersion (coming soon)";
  btn.title = ready ? "" : "Coming soon";
}

// mode "signin" signs in; mode "link" connects YouVersion to the signed-in account.
async function startYouVersion(mode) {
  if (!YOUVERSION_APP_KEY || !db) return;
  mode = mode === "link" ? "link" : "signin";
  // The return trip must land on the same address this starts from (browser storage is per-address).
  if (window.location.origin !== new URL(YOUVERSION_REDIRECT_URI).origin) {
    window.location.assign(YOUVERSION_REDIRECT_URI);
    return;
  }
  const verifier = randomUrlSafe(32);
  const stateValue = randomUrlSafe(16);
  const nonce = randomUrlSafe(16);
  try {
    sessionStorage.setItem(YV_STORE.verifier, verifier);
    sessionStorage.setItem(YV_STORE.state, stateValue);
    sessionStorage.setItem(YV_STORE.nonce, nonce);
    sessionStorage.setItem(YV_STORE.mode, mode);
  } catch (_) {
    return setStatus("signin-status", "Your browser blocked the storage YouVersion sign-in needs. Try Google or email instead.", "err");
  }
  const params = new URLSearchParams({
    response_type: "code",
    client_id: YOUVERSION_APP_KEY,
    redirect_uri: YOUVERSION_REDIRECT_URI,
    scope: "openid profile email",
    nonce,
    state: stateValue,
    code_challenge: await pkceChallenge(verifier),
    code_challenge_method: "S256"
  });
  setStatus("signin-status", "Opening YouVersion…");
  window.location.assign(YV_API + "/auth/authorize?" + params.toString());
}

async function finishYouVersion(ret) {
  let mode = "signin";
  try { mode = sessionStorage.getItem(YV_STORE.mode) === "link" ? "link" : "signin"; } catch (_) { /* default */ }
  const linking = mode === "link";
  const fail = (message) => {
    clearYouVersionStore();
    if (linking) {
      showView("settings");
      setStatus("methods-status", message.replace("YouVersion sign-in", "Connecting YouVersion"), "err");
    } else {
      openSignIn();
      setStatus("signin-status", message, "err");
    }
  };

  if (!ret.state || ret.state !== ret.expected) {
    return fail("YouVersion sign-in didn't match this browser session. Please try again.");
  }
  if (ret.error) {
    return fail("YouVersion sign-in was cancelled or failed (" + (ret.errorDescription || ret.error) + ").");
  }
  if (!ret.code) {
    // Step 2: hand the state back to YouVersion; it redirects here again with a code.
    window.location.assign(YV_API + "/auth/callback?state=" + encodeURIComponent(ret.state));
    return;
  }

  let verifier, nonce;
  try {
    verifier = sessionStorage.getItem(YV_STORE.verifier);
    nonce = sessionStorage.getItem(YV_STORE.nonce);
  } catch (_) { /* handled below */ }
  if (!db || !verifier || !nonce) return fail("YouVersion sign-in lost its place. Please try again.");

  if (linking) {
    showView("settings");
    setStatus("methods-status", "Connecting YouVersion…");
  } else {
    openSignIn();
    setStatus("signin-status", "Finishing YouVersion sign-in…");
  }
  try {
    // Step 3: trade the code for YouVersion's signed ID token.
    const tokenResp = await fetch(YV_API + "/auth/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code: ret.code,
        redirect_uri: YOUVERSION_REDIRECT_URI,
        client_id: YOUVERSION_APP_KEY,
        code_verifier: verifier
      })
    });
    if (!tokenResp.ok) return fail("YouVersion sign-in failed (token step, " + tokenResp.status + "). Please try again.");
    const tokens = await tokenResp.json();
    if (!tokens.id_token) return fail("YouVersion didn't return a sign-in token. Please try again.");

    if (linking) {
      // Our server function checks the token and attaches YouVersion to this account.
      const { data, error } = await db.functions.invoke("youversion-signin", {
        body: { mode: "link", id_token: tokens.id_token, nonce }
      });
      if (error || !data || !data.linked) {
        // An old copy of the function ignores "link" and answers with a sign-in key.
        const reason = data && data.token_hash ? "server_outdated" : await functionErrorReason(error);
        return fail(LINK_ERRORS[reason] || "Couldn't connect YouVersion (" + reason + "). Please try again.");
      }
      clearYouVersionStore();
      await loadUserData(); // answers may have moved over
      showView("settings");
      setStatus("methods-status", data.merged
        ? "YouVersion is connected. Answers from your earlier YouVersion sign-in moved to this account."
        : "YouVersion is connected.", "ok");
      return;
    }

    // Our server function checks the token and returns a one-time sign-in key.
    const { data, error } = await db.functions.invoke("youversion-signin", {
      body: { id_token: tokens.id_token, nonce }
    });
    if (error || !data || !data.token_hash) {
      const reason = await functionErrorReason(error);
      console.error("youversion-signin:", reason);
      return fail("Couldn't finish YouVersion sign-in on our side (" + reason + "). Please try again, or use Google or email.");
    }
    const { error: verifyError } = await db.auth.verifyOtp({ token_hash: data.token_hash, type: "email" });
    if (verifyError) return fail("Couldn't finish YouVersion sign-in (" + verifyError.message + ").");
  } catch (err) {
    console.error(err);
    return fail("YouVersion sign-in hit a network problem. Please try again.");
  }

  clearYouVersionStore();
  $("signin-dialog").close();
}

// ─────────────────────────── Google button ───────────────────────────
// Google's own button signs in on this page, so Google's screen shows this
// site instead of the supabase.co address. If Google's script can't load,
// we fall back to the redirect button (which works, but shows supabase.co).

let googleNonce = null;

async function makeNonce() {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  const raw = btoa(String.fromCharCode(...bytes));
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(raw));
  const hashed = [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
  return { raw, hashed };
}

// Render Google's button into `holder`. `onCredential(idToken, rawNonce)` runs
// after the person picks an account. Returns false if Google's script isn't available.
async function renderGoogleButton(holder, onCredential, text, width) {
  const gsi = window.google && window.google.accounts && window.google.accounts.id;
  if (!db || !gsi || !window.crypto || !crypto.subtle) return false;
  // A fresh nonce each time: Google gets the hashed one, Supabase checks the raw one.
  googleNonce = await makeNonce();
  const nonce = googleNonce;
  gsi.initialize({
    client_id: GOOGLE_CLIENT_ID,
    callback: (response) => { if (googleNonce === nonce) { googleNonce = null; onCredential(response.credential, nonce.raw); } },
    nonce: nonce.hashed,
    ux_mode: "popup",
    context: "signin"
  });
  holder.replaceChildren();
  gsi.renderButton(holder, {
    type: "standard",
    theme: "outline",
    size: "large",
    text: text || "continue_with",
    shape: "rectangular",
    logo_alignment: "center",
    width: width || Math.min(400, Math.max(200, holder.clientWidth || 320))
  });
  return true;
}

async function setUpGoogleButton() {
  const holder = $("google-btn");
  holder.hidden = false;
  const ok = await renderGoogleButton(holder, handleGoogleCredential);
  holder.hidden = !ok;
  $("signin-google").hidden = ok;
}

async function handleGoogleCredential(idToken, rawNonce) {
  setStatus("signin-status", "Signing in…");
  const { error } = await db.auth.signInWithIdToken({ provider: "google", token: idToken, nonce: rawNonce });
  if (error) {
    setStatus("signin-status", "Google sign-in failed: " + error.message, "err");
    return setUpGoogleButton(); // ready for another try with a new nonce
  }
  $("signin-dialog").close();
}

async function signInWithGoogle() {
  if (!db) return;
  const { error } = await db.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: redirectUrl() }
  });
  if (error) setStatus("signin-status", error.message, "err");
}

let pendingEmail = "";

async function sendCode(e) {
  e.preventDefault();
  if (!db) return;
  pendingEmail = $("email").value.trim();
  setStatus("signin-status", "Sending…");
  const { error } = await db.auth.signInWithOtp({
    email: pendingEmail,
    // The email contains a sign-in link, and also a 6-digit code once the email
    // template includes {{ .Token }} (requires custom SMTP). Either one works.
    options: { shouldCreateUser: true, emailRedirectTo: redirectUrl() }
  });
  if (error) return setStatus("signin-status", error.message, "err");
  $("email-form").hidden = true;
  $("code-form").hidden = false;
  $("code-sent-to").textContent = "We sent a " + OTP_LENGTH + "-digit code to " + pendingEmail + ". It may take a minute; check your spam folder too.";
  setStatus("signin-status", "");
  clearOtp();
}

// ─────────────────────────── Code boxes ───────────────────────────
// One box per digit. Typing moves to the next box, Backspace moves back,
// pasting or phone autofill spreads the digits across the boxes,
// and the code submits by itself once every box is filled.
// Used for the email code and for authenticator-app codes.

// `allowAutofill`: let the browser/phone fill the code (useful for emailed codes).
// Authenticator boxes turn it off so password managers (Dashlane, 1Password,
// LastPass…) don't insert a stored code that may be out of date.
function createCodeBoxes(wrap, length, onComplete, allowAutofill = true) {
  const boxes = [];
  const value = () => boxes.map((b) => b.value).join("");
  const complete = () => {
    const v = value();
    if (v.length === length && /^\d+$/.test(v)) onComplete(v);
  };
  const fillFrom = (start, digits) => {
    for (let j = 0; j < digits.length && start + j < length; j++) boxes[start + j].value = digits[j];
    boxes[Math.min(start + digits.length, length - 1)].focus();
    complete();
  };
  for (let i = 0; i < length; i++) {
    const box = document.createElement("input");
    box.className = "otp-box";
    box.type = "text";
    box.inputMode = "numeric";
    box.maxLength = length; // lets autofill/paste land the whole code in one box; we spread it out
    box.autocomplete = allowAutofill && i === 0 ? "one-time-code" : "off";
    if (!allowAutofill) {
      box.name = "sls-authenticator-" + i; // no login-like name for managers to match
      box.setAttribute("data-form-type", "other");   // Dashlane
      box.setAttribute("data-lpignore", "true");     // LastPass
      box.setAttribute("data-1p-ignore", "");        // 1Password
      box.setAttribute("data-bwignore", "");         // Bitwarden
    }
    box.setAttribute("aria-label", "Digit " + (i + 1) + " of " + length);
    box.addEventListener("input", () => {
      const digits = box.value.replace(/\D/g, "");
      if (digits.length > 1) return fillFrom(i, digits);
      box.value = digits;
      if (digits && i < length - 1) boxes[i + 1].focus();
      complete();
    });
    box.addEventListener("keydown", (e) => {
      if (e.key === "Backspace" && !box.value && i > 0) {
        boxes[i - 1].value = "";
        boxes[i - 1].focus();
        e.preventDefault();
      } else if (e.key === "ArrowLeft" && i > 0) {
        boxes[i - 1].focus();
      } else if (e.key === "ArrowRight" && i < length - 1) {
        boxes[i + 1].focus();
      }
    });
    box.addEventListener("paste", (e) => {
      e.preventDefault();
      fillFrom(i, (e.clipboardData || window.clipboardData).getData("text").replace(/\D/g, ""));
    });
    box.addEventListener("focus", () => box.select());
    boxes.push(box);
    wrap.append(box);
  }
  return {
    boxes,
    value,
    clear() { boxes.forEach((b) => (b.value = "")); boxes[0].focus(); },
    setDisabled(on) { boxes.forEach((b) => (b.disabled = on)); },
    focus() { boxes[0].focus(); }
  };
}

const emailCode = createCodeBoxes($("otp"), OTP_LENGTH, () => verifyCode());
const otpBoxes = emailCode.boxes; // (kept for tests)
const clearOtp = () => emailCode.clear();
let verifying = false;

async function verifyCode(e) {
  if (e) e.preventDefault();
  if (!db || verifying) return;
  const token = emailCode.value();
  if (token.length !== OTP_LENGTH) {
    return setStatus("signin-status", "Enter all " + OTP_LENGTH + " digits.", "err");
  }
  verifying = true;
  emailCode.setDisabled(true);
  setStatus("signin-status", "Checking…");
  const { error } = await db.auth.verifyOtp({ email: pendingEmail, token, type: "email" });
  verifying = false;
  emailCode.setDisabled(false);
  if (error) {
    setStatus("signin-status", "That code didn't work (" + error.message + "). Try again or request a new one.", "err");
    return clearOtp();
  }
  $("signin-dialog").close();
}

async function signOut() {
  await db.auth.signOut();
}

function updateAuthButton() {
  $("auth-button").textContent = state.user ? "Sign out" : "Sign in";
}

// ─────────────────────────── Sign-in methods (account linking) ───────────────────────────

const YOUVERSION_ONLY_DOMAIN = "@youversion.seeklikesilver.com";
const isYouVersionOnly = (user) => !!(user && user.email && user.email.toLowerCase().endsWith(YOUVERSION_ONLY_DOMAIN));

const LINK_ERRORS = {
  linked_to_other_account: "That YouVersion account is already connected to a different Seek Like Silver account. Sign in there and disconnect it first.",
  already_linked_to_different_youversion: "This account is already connected to a different YouVersion account. Disconnect it first.",
  authenticator_required: "Enter your authenticator code first: sign out and back in, then try again.",
  youversion_only_account: "This account was created with YouVersion, so YouVersion can't be connected or disconnected here.",
  not_signed_in: "You need to be signed in to connect YouVersion.",
  server_outdated: "The youversion-signin function in Supabase is an older version. Paste the latest code into it and deploy, then try again."
};

// Pull the server's reason code out of a Supabase function error.
async function functionErrorReason(error) {
  let reason = error ? error.message : "no response";
  try {
    const ctx = error && error.context;
    if (ctx && typeof ctx.json === "function") {
      const body = await ctx.json();
      reason = body.error || reason;
      if (body.detail) reason += ": " + body.detail;
    }
  } catch (_) { /* keep the generic reason */ }
  return reason;
}

function methodRow(name, detail, stateText, actions) {
  const li = document.createElement("li");
  li.className = "method";
  const left = document.createElement("div");
  const n = document.createElement("span");
  n.className = "method-name";
  n.textContent = name;
  left.append(n);
  if (detail) {
    const d = document.createElement("span");
    d.className = "method-detail";
    d.textContent = detail;
    left.append(d);
  }
  const right = document.createElement("div");
  right.className = "method-actions";
  if (stateText) {
    const s = document.createElement("span");
    s.className = "method-state";
    s.textContent = stateText;
    right.append(s);
  }
  for (const [label, handler, ghost] of actions || []) {
    const b = document.createElement("button");
    b.type = "button";
    b.className = ghost ? "link-button" : "btn btn-small";
    b.textContent = label;
    b.addEventListener("click", handler);
    right.append(b);
  }
  li.append(left, right);
  return li;
}

async function renderMethods() {
  const panel = $("methods-panel");
  panel.hidden = !state.user || !db;
  if (panel.hidden) return;
  const list = $("method-list");
  const googleHolder = $("link-google-btn");

  const { data: fresh } = await db.auth.getUser();
  const user = (fresh && fresh.user) || state.user;
  const identities = user.identities || [];
  const google = identities.find((i) => i.provider === "google");
  const yvOnly = isYouVersionOnly(user);
  let yvLinked = yvOnly;
  if (!yvOnly) {
    const { data: link } = await db.from("youversion_links").select("yvp_id").maybeSingle();
    yvLinked = !!link;
  }

  list.replaceChildren();
  googleHolder.hidden = true;

  // Google
  if (google) {
    const gEmail = google.identity_data && google.identity_data.email;
    const canRemove = identities.length >= 2;
    list.append(methodRow("Google", gEmail, "Connected", canRemove ? [["Disconnect", () => disconnectGoogle(google), true]] : []));
  } else if (!yvOnly) {
    const row = methodRow("Google", "Sign in with your Google account", null, []);
    list.append(row);
    // Google draws its own button; put it in this row's action spot.
    const holder = document.createElement("div");
    holder.className = "google-btn-inline";
    row.querySelector(".method-actions").append(holder);
    const ok = await renderGoogleButton(holder, connectGoogle, "signin_with", 240);
    if (!ok) holder.remove();
  }

  // Email code
  if (!yvOnly) {
    list.append(methodRow("Email code", user.email, "On", []));
  }

  // YouVersion
  if (yvOnly) {
    list.append(methodRow("YouVersion", "This account was created with YouVersion", "Connected", []));
  } else if (yvLinked) {
    list.append(methodRow("YouVersion", null, "Connected", [["Disconnect", disconnectYouVersion, true]]));
  } else if (YOUVERSION_APP_KEY) {
    list.append(methodRow("YouVersion", "Sign in with your Bible App account", null, [["Connect YouVersion", () => startYouVersion("link")]]));
  }

  const oldNote = panel.querySelector(".method-note");
  if (oldNote) oldNote.remove();
  if (yvOnly) {
    const note = document.createElement("p");
    note.className = "method-note";
    note.textContent = "To add Google or email: sign out, sign in with Google or an email code, then come back here and choose Connect YouVersion. Your saved answers will move over.";
    list.after(note);
  }
}

async function connectGoogle(idToken, rawNonce) {
  setStatus("methods-status", "Connecting Google…");
  const { error } = await db.auth.linkIdentity({ provider: "google", token: idToken, nonce: rawNonce });
  if (error) {
    const code = error.code || "";
    let msg = "Couldn't connect Google (" + error.message + ").";
    if (code === "identity_already_exists" || /already/i.test(error.message)) {
      setStatus("methods-status", "");
      return offerGoogleMerge(idToken, rawNonce);
    } else if (code === "manual_linking_disabled" || /manual linking/i.test(error.message)) {
      msg = "Connecting accounts is switched off in Supabase. Turn on \"Allow manual linking\" under Authentication → Sign In / Providers.";
    }
    setStatus("methods-status", msg, "err");
    return renderMethods();
  }
  setStatus("methods-status", "Google is connected.", "ok");
  renderMethods();
}

// ── Merging a separate Google account into this one ──
let pendingGoogleMerge = null;

function emailFromIdToken(idToken) {
  try {
    const part = idToken.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(part)).email || "";
  } catch (_) { return ""; }
}

function offerGoogleMerge(idToken, rawNonce) {
  pendingGoogleMerge = { idToken, rawNonce, email: emailFromIdToken(idToken) };
  const who = pendingGoogleMerge.email ? "Your Google account (" + pendingGoogleMerge.email + ")" : "That Google account";
  $("merge-offer-text").textContent = who + " already has its own Seek Like Silver account. " +
    "You can merge it into this one: its saved answers move here (if both have an answer to the same question, the newer one is kept), " +
    "this account keeps its own settings, and the Google-only account is then deleted so Google can be connected here.";
  $("merge-offer").hidden = false;
  renderMethods();
}

function closeMergeOffer() {
  pendingGoogleMerge = null;
  $("merge-offer").hidden = true;
}

async function mergeGoogleAccount() {
  const pending = pendingGoogleMerge;
  if (!pending) return;
  if (!confirm("Merge the Google account into this one? Its answers move here and the Google-only account is deleted. This can't be undone.")) return;
  $("merge-google").disabled = true;
  setStatus("methods-status", "Merging…");
  const { data, error } = await db.functions.invoke(MERGE_FUNCTION, {
    body: { provider: "google", id_token: pending.idToken, nonce: pending.rawNonce }
  });
  $("merge-google").disabled = false;
  if (error || !data || (!data.merged && !data.already_same_account)) {
    const reason = await functionErrorReason(error);
    const friendly = {
      authenticator_required: "Enter your authenticator code first: sign out and back in, then try again.",
      nonce_mismatch: "That Google sign-in expired. Click the Google button again, then choose Merge.",
      invalid_google_token: "That Google sign-in expired. Click the Google button again, then choose Merge.",
      no_other_account: "There's no separate Google account to merge anymore. Click the Google button to connect it."
    }[reason.split(":")[0]];
    closeMergeOffer();
    setStatus("methods-status", friendly || "Couldn't merge (" + reason + ").", "err");
    return renderMethods();
  }
  closeMergeOffer();
  // The Google login is free now; attach it to this account.
  const { error: linkError } = await db.auth.linkIdentity({ provider: "google", token: pending.idToken, nonce: pending.rawNonce });
  await loadUserData();
  setStatus("methods-status", linkError
    ? "Merged. Your Google account's answers are here now. Click the Google button once more to finish connecting it."
    : "Merged and connected. Your Google account's answers are here now, and Google signs you in to this account.", "ok");
  renderMethods();
}

async function disconnectGoogle(identity) {
  if (!confirm("Disconnect Google? You can still sign in with your other methods.")) return;
  const { error } = await db.auth.unlinkIdentity(identity);
  setStatus("methods-status", error ? "Couldn't disconnect Google (" + error.message + ")." : "Google is disconnected.", error ? "err" : "ok");
  renderMethods();
}

async function disconnectYouVersion() {
  if (!confirm("Disconnect YouVersion? Signing in with YouVersion afterward will open a separate account.")) return;
  const { data, error } = await db.functions.invoke("youversion-signin", { body: { mode: "unlink" } });
  if (error || !data || data.linked !== false) {
    const reason = await functionErrorReason(error);
    setStatus("methods-status", LINK_ERRORS[reason] || "Couldn't disconnect YouVersion (" + reason + ").", "err");
  } else {
    setStatus("methods-status", "YouVersion is disconnected.", "ok");
  }
  renderMethods();
}

// ─────────────────────────── Authenticator app (TOTP) ───────────────────────────
// Turning it on adds a 6-digit code from the person's authenticator app at
// every sign-in. The database (supabase-migrations/003) refuses to show their
// answers until that code is entered.

// Explain a rejected authenticator code. A wrong or expired code gets the plain
// message; anything else shows Supabase's own reason so it can be fixed.
function authenticatorError(error) {
  const code = (error && error.code) || "";
  if (code === "mfa_verification_failed" || /invalid totp|invalid code|expired/i.test((error && error.message) || "")) {
    return "That code didn't match. Use the newest code for Seek Like Silver in your app (codes change every 30 seconds), and make sure your phone's time is set automatically.";
  }
  return "Couldn't check the code (" + ((error && (error.code || error.message)) || "unknown error") + ").";
}

let pendingFactorId = null;
let mfaLoginBusy = false;

async function needsAuthenticatorCode() {
  if (!db) return false;
  const { data, error } = await db.auth.mfa.getAuthenticatorAssuranceLevel();
  if (error || !data) return false;
  return data.nextLevel === "aal2" && data.currentLevel !== "aal2";
}

async function verifiedTotpFactor() {
  const { data } = await db.auth.mfa.listFactors();
  return ((data && data.totp) || []).find((f) => f.status === "verified") || null;
}

const mfaLoginCode = createCodeBoxes($("mfa-login-code"), 6, async (code) => {
  if (mfaLoginBusy) return;
  mfaLoginBusy = true;
  mfaLoginCode.setDisabled(true);
  setStatus("mfa-login-status", "Checking…");
  const factor = await verifiedTotpFactor();
  const { error } = factor
    ? await db.auth.mfa.challengeAndVerify({ factorId: factor.id, code })
    : { error: { message: "no authenticator found" } };
  mfaLoginBusy = false;
  mfaLoginCode.setDisabled(false);
  if (error) {
    setStatus("mfa-login-status", authenticatorError(error), "err");
    return mfaLoginCode.clear();
  }
  $("mfa-dialog").close();
  await refreshAfterSignIn();
}, false);

function promptForAuthenticator() {
  setStatus("mfa-login-status", "");
  mfaLoginCode.boxes.forEach((b) => (b.value = ""));
  if (!$("mfa-dialog").open) $("mfa-dialog").showModal();
  mfaLoginCode.focus();
}

const mfaEnrollCode = createCodeBoxes($("mfa-enroll-code"), 6, async (code) => {
  if (!pendingFactorId) return;
  mfaEnrollCode.setDisabled(true);
  setStatus("mfa-status", "Checking…");
  const { error } = await db.auth.mfa.challengeAndVerify({ factorId: pendingFactorId, code });
  mfaEnrollCode.setDisabled(false);
  if (error) {
    setStatus("mfa-status", authenticatorError(error), "err");
    return mfaEnrollCode.clear();
  }
  pendingFactorId = null;
  $("mfa-enroll").hidden = true;
  setStatus("mfa-status", "Authenticator is on. You'll enter a code from it each time you sign in.", "ok");
  renderMfaPanel(true);
}, false);

async function renderMfaPanel(keepStatus) {
  const panel = $("mfa-panel");
  panel.hidden = !state.user || !db;
  if (panel.hidden) return;
  if (!keepStatus) setStatus("mfa-status", "");
  const factor = await verifiedTotpFactor();
  const enrolling = !$("mfa-enroll").hidden;
  $("mfa-summary").textContent = factor
    ? "On. Each time you sign in, you'll also enter a 6-digit code from your authenticator app."
    : "Add a second step to signing in: a 6-digit code from an app on your phone. Even if someone gets into your email or Google account, they can't open your answers without it.";
  $("mfa-setup").hidden = !!factor || enrolling;
  $("mfa-remove").hidden = !factor;
}

async function startAuthenticatorSetup() {
  setStatus("mfa-status", "Setting up…");
  // Clear any half-finished setup first.
  const { data: list } = await db.auth.mfa.listFactors();
  for (const f of ((list && list.all) || []).filter((x) => x.factor_type === "totp" && x.status !== "verified")) {
    await db.auth.mfa.unenroll({ factorId: f.id });
  }
  const { data, error } = await db.auth.mfa.enroll({ factorType: "totp", friendlyName: "Seek Like Silver" });
  if (error) return setStatus("mfa-status", "Couldn't start setup (" + error.message + ").", "err");
  pendingFactorId = data.id;
  $("mfa-qr").src = data.totp.qr_code;
  $("mfa-secret").textContent = data.totp.secret;
  $("mfa-enroll").hidden = false;
  $("mfa-setup").hidden = true;
  setStatus("mfa-status", "");
  mfaEnrollCode.clear();
}

async function cancelAuthenticatorSetup() {
  if (pendingFactorId) await db.auth.mfa.unenroll({ factorId: pendingFactorId });
  pendingFactorId = null;
  $("mfa-enroll").hidden = true;
  renderMfaPanel();
}

async function removeAuthenticator() {
  if (!confirm("Turn off the authenticator? Signing in will go back to just Google, email, or YouVersion.")) return;
  const factor = await verifiedTotpFactor();
  if (!factor) return renderMfaPanel();
  const { error } = await db.auth.mfa.unenroll({ factorId: factor.id });
  setStatus("mfa-status", error ? "Couldn't turn it off (" + error.message + ")." : "Authenticator is off.", error ? "err" : "ok");
  renderMfaPanel(true);
}

// ─────────────────────────── Drafts (survive sign-in) ───────────────────────────

function stashDraft(text) {
  try {
    sessionStorage.setItem(DRAFT_KEY, JSON.stringify({ id: state.question.id, level: state.level, text }));
  } catch (_) { /* storage unavailable; nothing to do */ }
}
function takeDraft() {
  try {
    const raw = sessionStorage.getItem(DRAFT_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (_) { return null; }
}
function clearDraft() {
  try { sessionStorage.removeItem(DRAFT_KEY); } catch (_) { /* ignore */ }
}
function restoreDraft() {
  const draft = takeDraft();
  if (!draft) return;
  const q = QUESTION_INDEX.get(draft.id);
  if (!q) return clearDraft();
  openQuestion(q, draft.level);
  $("answer").value = draft.text;
  setStatus("save-status", state.user ? "Your draft is back. Press Save answer to keep it." : "");
}

// ─────────────────────────── Helpers ───────────────────────────

function setStatus(id, text, kind) {
  const el = $(id);
  el.textContent = text;
  el.className = "status" + (kind ? " " + kind : "");
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

// ─────────────────────────── Wire up ───────────────────────────

document.querySelectorAll("[data-nav]").forEach((el) =>
  el.addEventListener("click", (e) => {
    e.preventDefault();
    showView(el.dataset.nav);
  })
);

document.querySelectorAll("[data-level]").forEach((el) =>
  el.addEventListener("click", () => {
    state.question = null;
    const lvl = el.dataset.level;
    openQuestion(pickQuestion(lvl), lvl);
  })
);

$("next-question").addEventListener("click", () => openQuestion(pickQuestion(state.level), state.level));
$("save-answer").addEventListener("click", saveAnswer);
$("auth-button").addEventListener("click", () => (state.user ? signOut() : openSignIn()));
$("signin-google").addEventListener("click", signInWithGoogle);
$("signin-youversion").addEventListener("click", () => startYouVersion("signin"));
if (yvReturn) finishYouVersion(yvReturn);
$("email-form").addEventListener("submit", sendCode);
$("code-form").addEventListener("submit", verifyCode);
$("code-back").addEventListener("click", () => {
  $("code-form").hidden = true;
  $("email-form").hidden = false;
  setStatus("signin-status", "");
});
$("settings-form").addEventListener("submit", saveSettings);

async function refreshAfterSignIn() {
  await loadUserData();
  if (!$("view-question").hidden && state.question) {
    renderTradition();
    openQuestion(state.question, state.level);
  }
  if (!$("view-answers").hidden) renderAnswers();
  if (!$("view-settings").hidden) renderSettings();
  if (state.user) restoreDraft();
}

$("merge-google").addEventListener("click", mergeGoogleAccount);
$("merge-cancel").addEventListener("click", closeMergeOffer);
$("mfa-setup").addEventListener("click", startAuthenticatorSetup);
$("mfa-cancel").addEventListener("click", cancelAuthenticatorSetup);
$("mfa-remove").addEventListener("click", removeAuthenticator);
$("mfa-signout").addEventListener("click", async () => { $("mfa-dialog").close(); await signOut(); });
$("mfa-dialog").addEventListener("cancel", (e) => e.preventDefault()); // must enter a code or sign out

let lastUserId;
if (db) db.auth.onAuthStateChange((_event, session) => {
  const user = session ? session.user : null;
  if ((user && user.id) === lastUserId) return; // ignore token refreshes
  lastUserId = user && user.id;
  state.user = user;
  updateAuthButton();
  // Run outside the auth callback, as Supabase recommends, to avoid deadlocks.
  setTimeout(async () => {
    if (state.user && (await needsAuthenticatorCode())) return promptForAuthenticator();
    if (!state.user && $("mfa-dialog").open) $("mfa-dialog").close();
    await refreshAfterSignIn();
  }, 0);
});
