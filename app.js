// Seek Like Silver — app logic
// All user-written text is inserted with textContent (never innerHTML) so it can't inject code.

// YouVersion sends people back to this page with ?state=… (and later &code=…).
// Grab those parameters and clean the address bar before anything else reads the URL.
const YV_API = "https://api.youversion.com";
const YV_STORE = { state: "sls-yv-state", verifier: "sls-yv-verifier", nonce: "sls-yv-nonce" };
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
// bible.com version IDs, each checked against a live bible.com page on 2026-09-30.
const YV_VERSIONS = {
  KJV: [1, "KJV"],
  NIV: [111, "NIV"],
  ESV: [59, "ESV"],
  NKJV: [114, "NKJV"],
  CSB: [1713, "CSB"],
  NASB: [2692, "NASB2020"],
  NRSVUE: [3523, "NRSVUE"]
};

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

// ─────────────────────────── Views ───────────────────────────

function showView(name) {
  for (const v of ["home", "question", "answers", "settings"]) {
    $("view-" + v).hidden = v !== name;
  }
  document.querySelectorAll(".nav-link").forEach((b) => {
    const target = b.dataset.nav;
    b.classList.toggle("active", target === name || (name === "question" && target === "home"));
  });
  if (name === "answers") renderAnswers();
  if (name === "settings") renderSettings();
  window.scrollTo(0, 0);
}

function openQuestion(q, level) {
  state.level = level;
  state.question = q;

  $("q-level").textContent = LEVEL_LABELS[level];
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
    meta.className = "meta";
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

function renderSettings() {
  $("settings-signed-out").hidden = !!state.user;
  $("settings-form").hidden = !state.user;
  if (!state.user) return;

  const denom = $("set-denomination");
  if (!denom.options.length) {
    for (const [value, t] of Object.entries(TRADITIONS)) denom.add(new Option(t.label, value));
  }
  const trans = $("set-translation");
  if (!trans.options.length) {
    for (const t of TRANSLATIONS) trans.add(new Option(t, t));
  }
  $("set-name").value = state.profile.display_name || "";
  denom.value = state.profile.denomination;
  trans.value = state.profile.translation;
  setStatus("settings-status", "");
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

async function startYouVersion() {
  if (!YOUVERSION_APP_KEY || !db) return;
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
  const fail = (message) => {
    clearYouVersionStore();
    openSignIn();
    setStatus("signin-status", message, "err");
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

  openSignIn();
  setStatus("signin-status", "Finishing YouVersion sign-in…");
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

    // Our server function checks the token and returns a one-time sign-in key.
    const { data, error } = await db.functions.invoke("youversion-signin", {
      body: { id_token: tokens.id_token, nonce }
    });
    if (error || !data || !data.token_hash) {
      // Show the server's reason code so problems can be diagnosed.
      let reason = error ? error.message : "no sign-in key returned";
      try {
        const ctx = error && error.context;
        if (ctx && typeof ctx.json === "function") {
          const body = await ctx.json();
          reason = [body.error, body.detail].filter(Boolean).join(": ") || reason;
        }
      } catch (_) { /* keep the generic reason */ }
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

async function setUpGoogleButton() {
  const holder = $("google-btn");
  const gsi = window.google && window.google.accounts && window.google.accounts.id;
  if (!db || !gsi || !window.crypto || !crypto.subtle) {
    holder.hidden = true;
    $("signin-google").hidden = false;
    return;
  }
  holder.hidden = false;
  $("signin-google").hidden = true;

  // A fresh nonce each time: Google gets the hashed one, Supabase checks the raw one.
  googleNonce = await makeNonce();
  gsi.initialize({
    client_id: GOOGLE_CLIENT_ID,
    callback: handleGoogleCredential,
    nonce: googleNonce.hashed,
    ux_mode: "popup",
    context: "signin"
  });
  holder.replaceChildren();
  gsi.renderButton(holder, {
    type: "standard",
    theme: "outline",
    size: "large",
    text: "continue_with",
    shape: "rectangular",
    logo_alignment: "center",
    width: Math.min(400, Math.max(200, holder.clientWidth || 320))
  });
}

async function handleGoogleCredential(response) {
  if (!googleNonce) return;
  setStatus("signin-status", "Signing in…");
  const { error } = await db.auth.signInWithIdToken({
    provider: "google",
    token: response.credential,
    nonce: googleNonce.raw
  });
  googleNonce = null;
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

const otpBoxes = [];
let verifying = false;

function buildOtp() {
  const wrap = $("otp");
  for (let i = 0; i < OTP_LENGTH; i++) {
    const box = document.createElement("input");
    box.className = "otp-box";
    box.type = "text";
    box.inputMode = "numeric";
    box.maxLength = OTP_LENGTH; // lets autofill/paste land the whole code in one box; we spread it out
    box.autocomplete = i === 0 ? "one-time-code" : "off";
    box.setAttribute("aria-label", "Digit " + (i + 1) + " of " + OTP_LENGTH);

    box.addEventListener("input", () => {
      const digits = box.value.replace(/\D/g, "");
      if (digits.length > 1) return fillOtpFrom(i, digits);
      box.value = digits;
      if (digits && i < OTP_LENGTH - 1) otpBoxes[i + 1].focus();
      maybeSubmitOtp();
    });
    box.addEventListener("keydown", (e) => {
      if (e.key === "Backspace" && !box.value && i > 0) {
        otpBoxes[i - 1].value = "";
        otpBoxes[i - 1].focus();
        e.preventDefault();
      } else if (e.key === "ArrowLeft" && i > 0) {
        otpBoxes[i - 1].focus();
      } else if (e.key === "ArrowRight" && i < OTP_LENGTH - 1) {
        otpBoxes[i + 1].focus();
      }
    });
    box.addEventListener("paste", (e) => {
      e.preventDefault();
      fillOtpFrom(i, (e.clipboardData || window.clipboardData).getData("text").replace(/\D/g, ""));
    });
    box.addEventListener("focus", () => box.select());

    otpBoxes.push(box);
    wrap.append(box);
  }
}

function fillOtpFrom(start, digits) {
  for (let j = 0; j < digits.length && start + j < OTP_LENGTH; j++) {
    otpBoxes[start + j].value = digits[j];
  }
  const next = Math.min(start + digits.length, OTP_LENGTH - 1);
  otpBoxes[next].focus();
  maybeSubmitOtp();
}

function getOtp() {
  return otpBoxes.map((b) => b.value).join("");
}

function clearOtp() {
  otpBoxes.forEach((b) => (b.value = ""));
  otpBoxes[0].focus();
}

function maybeSubmitOtp() {
  if (/^\d+$/.test(getOtp()) && getOtp().length === OTP_LENGTH) verifyCode();
}

async function verifyCode(e) {
  if (e) e.preventDefault();
  if (!db || verifying) return;
  const token = getOtp();
  if (token.length !== OTP_LENGTH) {
    return setStatus("signin-status", "Enter all " + OTP_LENGTH + " digits.", "err");
  }
  verifying = true;
  otpBoxes.forEach((b) => (b.disabled = true));
  setStatus("signin-status", "Checking…");
  const { error } = await db.auth.verifyOtp({ email: pendingEmail, token, type: "email" });
  verifying = false;
  otpBoxes.forEach((b) => (b.disabled = false));
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
$("signin-youversion").addEventListener("click", startYouVersion);
if (yvReturn) finishYouVersion(yvReturn);
$("email-form").addEventListener("submit", sendCode);
buildOtp();
$("code-form").addEventListener("submit", verifyCode);
$("code-back").addEventListener("click", () => {
  $("code-form").hidden = true;
  $("email-form").hidden = false;
  setStatus("signin-status", "");
});
$("settings-form").addEventListener("submit", saveSettings);

let lastUserId;
if (db) db.auth.onAuthStateChange((_event, session) => {
  const user = session ? session.user : null;
  if ((user && user.id) === lastUserId) return; // ignore token refreshes
  lastUserId = user && user.id;
  state.user = user;
  updateAuthButton();
  // Run outside the auth callback, as Supabase recommends, to avoid deadlocks.
  setTimeout(async () => {
    await loadUserData();
    if (!$("view-question").hidden && state.question) {
      renderTradition();
      openQuestion(state.question, state.level);
    }
    if (!$("view-answers").hidden) renderAnswers();
    if (!$("view-settings").hidden) renderSettings();
    if (state.user) restoreDraft();
  }, 0);
});
