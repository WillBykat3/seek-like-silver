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
const DEFAULT_TRANSLATION = "NIV"; // signed out, or nothing chosen yet

const state = {
  user: null,
  profile: { denomination: "general", translation: DEFAULT_TRANSLATION, display_name: "" },
  answers: new Map(), // question_id -> [answer rows], newest first
  level: null,
  question: null,
  topic: null,         // set when studying by topic instead of by level
  editing: null,       // the answer row being edited, or null when writing a new one
  features: { multi: true, groups: true, share: true },
  shares: new Map(),   // answer_id -> share link code // switched off if the database update (005) hasn't been run
  groups: [],          // [{ id, name, owner_id, invite_code, members: [...] }]
  names: new Map()     // user_id -> display name, for people in your groups
};

const $ = (id) => document.getElementById(id);

const answerEditor = createRichEditor({
  editor: $("answer"),
  toolbar: $("answer-toolbar"),
  grip: $("answer-grip")
});

// ─────────────────────────── Question lookup ───────────────────────────

const QUESTION_INDEX = new Map();
// Each question's public number (#482): random, permanent, used in links and printouts.
const questionNumber = (q) => (QUESTION_INDEX.get(q.id) || q).num;
const questionLabel = (q) => "Question #" + questionNumber(q) + " (" + LEVEL_LABELS[q.level] + ")";
const QUESTION_BY_NUM = new Map();
for (const [level, list] of Object.entries(QUESTIONS)) {
  for (const q of list) { QUESTION_INDEX.set(q.id, { ...q, level }); QUESTION_BY_NUM.set(String(q.num), q.id); }
}

function questionsFor(level, topic) {
  return [...QUESTION_INDEX.values()].filter((q) =>
    (!level || q.level === level) && (!topic || (q.topics || []).includes(topic)));
}

function pickQuestion(level) {
  let list = questionsFor(state.anyLevel ? null : level, state.topic);
  if (!list.length) list = questionsFor(null, state.topic); // no questions at this level on this topic
  const notCurrent = list.filter((q) => !state.question || q.id !== state.question.id);
  const unanswered = notCurrent.filter((q) => !state.answers.has(q.id));
  const pool = unanswered.length ? unanswered : (notCurrent.length ? notCurrent : list);
  return pool[Math.floor(Math.random() * pool.length)];
}

// ─────────────────────────── Study level (Settings) ───────────────────────────
// Saved on the profile (database update 007); kept on this device as a backup.
const LEVEL_KEY = "sls-study-level";
function studyLevel() {
  const fromProfile = state.profile && state.profile.study_level;
  if (fromProfile && LEVEL_LABELS[fromProfile]) return fromProfile;
  if (state.profile && "study_level" in state.profile) return null; // saved as "all levels"
  try { const v = localStorage.getItem(LEVEL_KEY); return state.user && LEVEL_LABELS[v] ? v : null; } catch (_) { return null; }
}

function applyHomeLevel() {
  const lvl = studyLevel();
  document.querySelectorAll(".levels [data-level]").forEach((card) => { card.hidden = !!lvl && card.dataset.level !== lvl; });
  document.querySelector(".levels").classList.toggle("single", !!lvl);
  $("home-level-title").textContent = lvl ? "Your level" : "Choose your level";
  $("home-level-note").hidden = !lvl;
}

// Choose a level for a topic (skipped if Settings already has one).
function chooseTopicLevel(topicKey) {
  const lvl = studyLevel();
  if (lvl && questionsFor(lvl, topicKey).length) return startTopic(topicKey, lvl);
  const wrap = $("level-choices");
  wrap.replaceChildren();
  $("level-dialog-topic").textContent = "Topic: " + TOPICS[topicKey].label;
  for (const level of Object.keys(LEVEL_LABELS)) {
    const n = questionsFor(level, topicKey).length;
    const b = document.createElement("button");
    b.type = "button";
    b.className = "level-choice level-" + level;
    b.disabled = !n;
    b.append(
      Object.assign(document.createElement("span"), { className: "level-choice-name", textContent: LEVEL_LABELS[level] }),
      Object.assign(document.createElement("span"), { className: "level-choice-count", textContent: n ? (n === 1 ? "1 question" : n + " questions") : "None yet" })
    );
    b.onclick = () => { $("level-dialog").close(); startTopic(topicKey, level); };
    wrap.append(b);
  }
  $("level-dialog").showModal();
  const first = wrap.querySelector("button:not(:disabled)");
  if (first) first.focus();
}

function startTopic(topicKey, level) {
  state.anyLevel = false;
  state.topic = topicKey;
  state.question = null;
  const q = pickQuestion(level);
  openQuestion(q, q.level);
}

// The level menu on the question page: switch levels any time.
function renderLevelSwitch(current) {
  const sel = $("q-level");
  sel.replaceChildren();
  for (const level of Object.keys(LEVEL_LABELS)) {
    const n = state.topic ? questionsFor(level, state.topic).length : 1;
    const o = new Option(LEVEL_LABELS[level] + (state.topic && !n ? " (none on this topic)" : ""), level);
    o.disabled = !n;
    sel.add(o);
  }
  sel.value = current;
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
  const [id, abbr] = YV_VERSIONS[state.profile.translation] || YV_VERSIONS[DEFAULT_TRANSLATION];
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

// The reader's translation; NIV when signed out. If the license doesn't cover
// their translation, NIV instead (callers label it).
function readerTranslation() {
  return state.profile.translation in YV_VERSIONS ? state.profile.translation : DEFAULT_TRANSLATION;
}

async function fetchInReaderTranslation(usfm) {
  const wanted = readerTranslation();
  let code = wanted;
  let passage = await fetchPassage(YV_VERSIONS[code][0], usfm);
  if (!passage && wanted !== PREVIEW_FALLBACK) {
    code = PREVIEW_FALLBACK;
    passage = await fetchPassage(YV_VERSIONS[code][0], usfm);
  }
  return { wanted, code, passage, id: YV_VERSIONS[code][0] };
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
    link.classList.remove("warming");
    clearTimeout(panel._t);
    panel.classList.remove("closing");
    panel.hidden = false;
    toggle.setAttribute("aria-expanded", "true");
    toggle.textContent = "Hide text";
    if (!loaded) {
      loaded = true;
      await fillPreview(panel, ref, usfm);
    }
  };
  const close = () => {
    panel.classList.add("closing");
    clearTimeout(panel._t);
    panel._t = setTimeout(() => { panel.hidden = true; panel.classList.remove("closing"); }, reducedMotion() ? 0 : 220);
    toggle.setAttribute("aria-expanded", "false");
    toggle.textContent = "Show text";
  };

  link.style.setProperty("--warm-ms", PREVIEW_DELAY_MS + "ms");
  link.addEventListener("mouseenter", () => {
    if (!panel.hidden) return;
    link.classList.add("warming"); // a line fills under the link while you hover
    timer = setTimeout(open, PREVIEW_DELAY_MS);
  });
  link.addEventListener("mouseleave", () => { clearTimeout(timer); link.classList.remove("warming"); });
  toggle.addEventListener("click", () => (panel.hidden || panel.classList.contains("closing") ? open() : close()));
}

async function fillPreview(panel, ref, usfm) {
  panel.replaceChildren();
  const status = document.createElement("p");
  status.className = "verse-preview-status";
  status.textContent = "Loading…";
  panel.append(status);

  try {
    const { wanted, code, passage } = await fetchInReaderTranslation(usfm);
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

// ─────────────────────────── Home page verses ───────────────────────────
// Proverbs 2:4–5 at the top and YouVersion's Verse of the Day, both in the
// reader's translation (NIV when signed out; NIV when the license doesn't
// cover theirs, labeled). If YouVersion can't be reached, the top verse stays
// the public-domain KJV already in the page and the Verse of the Day stays hidden.

const HERO_USFM = "PRO.2.4-5";
const votdCache = new Map(); // day -> Promise<passage_id | null>
let homeVersesRun = 0;

// Day of the year in the reader's own time zone, 1 = January 1 (as YouVersion counts).
// Built from calendar dates so daylight-saving changes can't shift it.
function dayOfYear(date = new Date()) {
  return Math.round((Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) - Date.UTC(date.getFullYear(), 0, 1)) / 86400000) + 1;
}

function fetchVotdPassageId(day) {
  if (!votdCache.has(day)) {
    const p = yvGet("/verse_of_the_days/" + day).then((d) => {
      const id = d && typeof d.passage_id === "string" ? d.passage_id.trim() : "";
      return /^[1-3]?[A-Z]{2,3}\.\d{1,3}(\.\d{1,3}(-\d{1,3})?)?$/.test(id) ? id : null;
    });
    p.catch(() => votdCache.delete(day));
    votdCache.set(day, p);
  }
  return votdCache.get(day);
}

function bibleComLink(code, usfm) {
  const [id, abbr] = YV_VERSIONS[code];
  return "https://www.bible.com/bible/" + id + "/" + usfm + "." + abbr;
}

function fallbackNote(wanted, code) {
  return code === wanted ? "" : " · " + wanted + " isn't available here";
}

// Copyright line: one line, cut off with "…"; tap or click to read all of it.
function setCopyright(el, text) {
  el.textContent = text;
  el.title = text;
  el.classList.remove("expanded");
  el.tabIndex = text ? 0 : -1;
  el.setAttribute("role", "button");
  el.setAttribute("aria-expanded", "false");
}
for (const id of ["hero-note", "votd-note"]) {
  const el = document.getElementById(id);
  const toggle = () => el.setAttribute("aria-expanded", String(el.classList.toggle("expanded")));
  el.addEventListener("click", toggle);
  el.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggle(); } });
}

async function renderHomeVerses() {
  if (!YOUVERSION_APP_KEY) return;
  const run = ++homeVersesRun; // ignore results from an older run (e.g., translation changed meanwhile)
  await Promise.all([renderHeroVerse(run), renderVerseOfTheDay(run)]);
}

async function renderHeroVerse(run) {
  try {
    const { wanted, code, passage, id } = await fetchInReaderTranslation(HERO_USFM);
    if (run !== homeVersesRun || !passage) return;
    const copyright = await fetchCopyright(id);
    if (run !== homeVersesRun) return;
    $("hero-verse").textContent = "“" + passage.text + "”";
    const link = $("hero-link");
    link.href = bibleComLink(code, HERO_USFM);
    link.textContent = "Proverbs 2:4–5 (" + code + ")";
    $("hero-fallback").textContent = fallbackNote(wanted, code);
    setCopyright($("hero-note"), copyright);
  } catch (err) {
    console.error("Top verse:", err); // keep the KJV already shown
  }
}

async function renderVerseOfTheDay(run) {
  const card = $("votd");
  try {
    const usfm = await fetchVotdPassageId(dayOfYear());
    if (!usfm) { if (run === homeVersesRun) card.hidden = true; return; }
    const { wanted, code, passage, id } = await fetchInReaderTranslation(usfm);
    if (run !== homeVersesRun) return;
    if (!passage) { card.hidden = true; return; }
    const copyright = await fetchCopyright(id);
    if (run !== homeVersesRun) return;
    $("votd-text").textContent = passage.text;
    const link = $("votd-link");
    link.href = bibleComLink(code, usfm);
    link.textContent = (passage.reference || usfm) + " (" + code + ")";
    $("votd-fallback").textContent = fallbackNote(wanted, code);
    setCopyright($("votd-note"), copyright);
    card.hidden = false;
  } catch (err) {
    console.error("Verse of the Day:", err);
    if (run === homeVersesRun) card.hidden = true;
  }
}

// ─────────────────────────── Views ───────────────────────────

// ─────────────────────────── Page addresses (back button, reload) ───────────────────────────
// Each page has its own address: Study is the plain address, others are #answers, #groups,
// #library, #settings, #all, #stats, and #q=652 for a question.
const ROUTED_VIEWS = ["answers", "groups", "library", "settings", "stats", "all"];
function setRoute(hash) {
  const url = location.pathname + location.search + hash;
  if (url !== location.pathname + location.search + location.hash) history.pushState(null, "", url);
}

function showView(name, opts = {}) {
  if (!opts.fromHistory && name !== "question") setRoute(name === "home" ? "" : "#" + name);
  for (const v of ["home", "question", "answers", "groups", "library", "settings", "stats", "all", "shared"]) {
    $("view-" + v).hidden = v !== name;
  }
  document.querySelectorAll(".nav-link").forEach((b) => {
    const target = b.dataset.nav;
    b.classList.toggle("active", target === name || (name === "question" && target === "home"));
  });
  if (name === "answers") renderAnswers();
  if (name === "settings") renderSettings();
  if (name === "library") { renderLibrary(); renderGlossaryList(); }
  if (name === "groups") renderGroups();
  if (name === "stats") renderStats();
  if (name === "all") renderAllQuestions();
  hideTerm();
  window.scrollTo(0, 0);
}

function renderVerseList(list, refs) {
  list.replaceChildren();
  for (const ref of refs || []) {
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.href = verseLink(ref);
    a.target = "_blank";
    a.rel = "noopener";
    a.textContent = ref.replace(/-/g, "–");
    li.append(a);
    attachVersePreview(li, a, ref);
    list.append(li);
  }
}

function openQuestion(q, level, opts = {}) {
  state.level = level;
  state.question = q;

  renderLevelSwitch(level);
  const topic = state.topic && TOPICS[state.topic];
  $("q-topic").hidden = !topic && !state.anyLevel;
  $("q-topic").textContent = topic ? topic.label : state.anyLevel ? "Random: all levels" : "";
  $("q-topic").className = "topic-pill" + (topic ? " topic-" + state.topic : "");
  $("view-question").dataset.level = level; // drives the level color
  $("q-number").textContent = "#" + questionNumber(q);
  $("q-number").title = "Question number " + questionNumber(q) + ". Share or find this question by its number.";
  renderWithTerms($("q-prompt"), q.prompt);

  renderVerseList($("q-passage"), q.passage);
  renderVerseList($("q-inspiration"), q.inspiration);

  const readings = $("q-readings");
  readings.replaceChildren();
  for (const r of q.readings) {
    const li = document.createElement("li");
    li.append(document.createTextNode(r.who + ", "));
    const book = findLibraryBook(r.who, r.work);
    const link = bookLink(r.who, r.work, book);
    link.className = "work";
    link.textContent = r.work;
    li.append(link);
    if (book && !book.free) li.append(" ", Object.assign(document.createElement("span"), { className: "book-note", textContent: "(find a copy)" }));
    readings.append(li);
  }

  renderFathers(q);
  renderTradition();
  const n = (k) => (k === 1 ? "1 book" : k + " books");
  $("q-readings-count").textContent = n(q.readings.length);
  $("q-fathers-count").textContent = (q.fathers || []).length === 1 ? "1 passage" : (q.fathers || []).length + " passages";
  // Start each question with the extras folded up, so the question and verses stay in view.
  document.querySelectorAll("#view-question .more-block").forEach((d) => { d.open = false; });

  state.editing = null;
  answerEditor.clear();
  $("answer-shared").checked = false;
  setStatus("save-status", "");
  setStatus("share-status", "");
  renderMyAnswers();
  renderGroupAnswers();

  showView("question");
  if (!opts.fromHistory) setRoute("#q=" + questionNumber(q));
}

// A link that opens the source page and jumps to (and highlights) the quoted words,
// using a browser "text fragment": #:~:text=start,end
const fragPart = (t) => encodeURIComponent(t).replace(/-/g, "%2D");
function fatherLink(f) {
  if (!f.quote || !f.anchor) return f.url;
  return f.url.split("#")[0] + "#:~:text=" + fragPart(f.anchor) + (f.anchorEnd && f.anchorEnd !== f.anchor ? "," + fragPart(f.anchorEnd) : "");
}
// Show where a quote starts or stops partway through a sentence.
function quoteText(q) {
  let t = q.trim();
  if (/^[a-z]/.test(t)) t = "\u2026" + t;
  if (!/[.!?;:"'\u201d\u2019\])]$/.test(t)) t += "\u2026";
  return t;
}

function renderFathers(q) {
  const list = $("q-fathers");
  list.replaceChildren();
  for (const f of q.fathers || []) {
    const li = document.createElement("li");
    li.className = "father";
    const head = document.createElement("p");
    head.className = "father-head";
    head.append(Object.assign(document.createElement("strong"), { className: "father-who", textContent: f.who }), ", ");
    const link = Object.assign(document.createElement("a"), { className: "work", href: fatherLink(f), target: "_blank", rel: "noopener", textContent: f.work });
    head.append(link);
    if (f.where) head.append(", " + f.where);
    li.append(head);
    li.append(Object.assign(document.createElement("p"), { className: "father-summary", textContent: f.summary || f.about }));
    if (f.quote) {
      const bq = document.createElement("blockquote");
      bq.className = "father-quote";
      bq.cite = f.url;
      bq.textContent = quoteText(f.quote);
      li.append(bq);
    }
    const more = Object.assign(document.createElement("a"), {
      className: "father-source with-icon", href: fatherLink(f), target: "_blank", rel: "noopener",
      textContent: f.quote ? "Read it in context" : "Read the passage",
    });
    more.append(icon("arrow-right"));
    more.title = f.quote ? "Opens the full text and jumps to this quote" : "Opens the full text";
    li.append(more);
    list.append(li);
  }
  list.closest(".fathers-block").hidden = !list.childElementCount;
}

// ─────────────────────────── Book links ───────────────────────────
// Turn a cited book into a link: its free copy (via the Library list) or,
// for books still in copyright, a library search.

const normTitle = (s) => s.toLowerCase()
  .replace(/\(.*?\)/g, " ")
  .replace(/,?\s*(book|books|part|session|chs?\.|chapter|question|questions|orations|lectures|on psalm)\s.*$/, " ")
  .replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();

function findLibraryBook(who, work) {
  const full = who ? who + ", " + work : work;
  const exact = LIBRARY.find((b) => (b.cites || []).some((c) => c === work || c === full));
  if (exact) return exact;
  const w = normTitle(work);
  const sameAuthor = (b) => !who || b.who === who;
  return LIBRARY.find((b) => sameAuthor(b) && normTitle(b.work) === w) ||
    LIBRARY.find((b) => sameAuthor(b) && (normTitle(b.work).includes(w) || w.includes(normTitle(b.work)))) ||
    null;
}

function bookLink(who, work, book) {
  const a = document.createElement("a");
  a.target = "_blank";
  a.rel = "noopener";
  if (book && book.free) {
    a.href = book.url;
    a.title = "Read free at " + book.source;
  } else {
    a.href = "https://search.worldcat.org/search?q=" + encodeURIComponent(((book && book.work) || work) + " " + ((book && book.who) || who || ""));
    a.title = "Still in copyright: find a copy at a library";
  }
  return a;
}

// "Author, Work" strings (tradition sources) → [who, work]
function splitSource(s) {
  const i = s.indexOf(", ");
  if (i > 0 && LIBRARY.some((b) => b.who === s.slice(0, i) || b.who.startsWith(s.slice(0, i)))) return [s.slice(0, i), s.slice(i + 2)];
  return ["", s];
}

function renderTradition() {
  const t = TRADITIONS[state.profile.denomination] || TRADITIONS.general;
  $("q-tradition-label").textContent = t.label;
  const list = $("q-tradition");
  list.replaceChildren();
  for (const s of t.sources) {
    const li = document.createElement("li");
    const [who, work] = splitSource(s);
    const book = findLibraryBook(who, work) || findLibraryBook("", s);
    const link = bookLink(who, work, book);
    link.textContent = s;
    li.append(link);
    if (book && !book.free) li.append(" ", Object.assign(document.createElement("span"), { className: "book-note", textContent: "(find a copy)" }));
    list.append(li);
  }
}

function renderAnswers() {
  const list = $("answers-list");
  list.replaceChildren();
  $("answers-signed-out").hidden = !!state.user;
  $("answers-empty").hidden = !state.user || state.answers.size > 0;
  $("answers-export").hidden = !state.user || state.answers.size === 0;
  if (!state.user) return;

  const latest = (rows) => rows.reduce((m, r) => (r.updated_at > m ? r.updated_at : m), "");
  const groups = [...state.answers.entries()].sort((x, y) => latest(y[1]).localeCompare(latest(x[1])));
  for (const [qid, rows] of groups) {
    const q = QUESTION_INDEX.get(qid);
    const level = q ? q.level : rows[0].level;
    const card = document.createElement("article");
    card.className = "saved-answer";

    const meta = document.createElement("div");
    meta.className = "meta level-" + level;
    meta.textContent = LEVEL_LABELS[level] + (q ? " · #" + questionNumber(q) : "") + " · " + (rows.length === 1 ? "1 answer" : rows.length + " answers");

    const title = document.createElement("h3");
    title.textContent = q ? q.prompt : "(This question is no longer in the bank)";
    card.append(meta, title);

    for (const row of rows) card.append(answerEntry(row, { onDelete: () => deleteAnswer(row), own: true }));

    if (q) {
      const actions = document.createElement("div");
      actions.className = "row";
      const open = document.createElement("button");
      open.className = "link-button with-icon";
      open.textContent = "Open question";
      open.append(icon("arrow-right"));
      open.onclick = () => openQuestion(q, q.level);
      actions.append(open);
      card.append(actions);
    }
    list.append(card);
  }
}

// One saved answer: date, text, and optional actions.
function answerEntry(row, { onEdit, onDelete, author, own } = {}) {
  const wrap = document.createElement("div");
  wrap.className = "answer-entry";
  const head = document.createElement("div");
  head.className = "answer-entry-head";
  const when = document.createElement("span");
  when.className = "answer-date";
  const edited = row.created_at && row.updated_at && row.updated_at.slice(0, 16) !== row.created_at.slice(0, 16);
  when.textContent = (author ? author + " · " : "") + formatDate(row.created_at || row.updated_at) + (edited ? " (edited " + formatDate(row.updated_at) + ")" : "");
  head.append(when);
  if (row.shared && !author) {
    const tag = document.createElement("span");
    tag.className = "shared-tag";
    tag.textContent = "Shared with groups";
    head.append(tag);
  }
  const actions = document.createElement("span");
  actions.className = "entry-actions";
  const status = Object.assign(document.createElement("p"), { className: "status entry-status" });
  status.hidden = true;
  if (own && state.features.share) actions.append(shareControls(row, status));
  if (onEdit) actions.append(iconButton("edit", "Edit this answer", onEdit));
  if (onDelete) actions.append(iconButton("trash", "Delete this answer", onDelete, { danger: true }));
  if (actions.childNodes.length) head.append(actions);
  const body = document.createElement("div");
  body.className = "body" + (isRich(row.answer) ? " rich" : "");
  body.append(answerContent(row.answer));
  wrap.append(head, body, status);
  return wrap;
}

// ─────────────────────────── Share an answer by link ───────────────────────────
// Each of your answers can get a private link (#share=…) that anyone can open to read
// just that answer. "Stop sharing" turns the link off. (Database update 010.)

const shareUrl = (token) => location.origin + location.pathname + "#share=" + token;

function shareControls(row, status) {
  const box = document.createElement("span");
  box.className = "share-controls";
  const say = (msg, kind) => {
    status.hidden = !msg;
    status.textContent = msg || "";
    status.className = "status entry-status " + (kind || "");
  };
  const draw = () => {
    box.replaceChildren();
    const token = state.shares.get(row.id);
    if (!token) {
      box.append(iconButton("share", "Share a link to this answer", async (e) => {
        const b = e.currentTarget;
        b.disabled = true;
        say("Making a link…");
        const { data, error } = await db.rpc("sls_share_answer", { p_answer: row.id });
        b.disabled = false;
        if (error) return say("Couldn't make a link: " + error.message, "err");
        state.shares.set(row.id, data);
        await copyText(shareUrl(data));
        draw();
        say("Link copied. Anyone with it can read this answer.", "ok");
      }));
    } else {
      const copy = iconButton("link", "Copy share link", async () => {
        await copyText(shareUrl(token));
        flashIcon(copy, "check", "Copied");
        say("Link copied.", "ok");
      });
      box.append(
        Object.assign(document.createElement("span"), { className: "share-on", textContent: "Shared by link" }),
        copy,
        iconButton("link-off", "Stop sharing this answer", async () => {
          if (!confirm("Stop sharing this answer? The link will stop working for everyone.")) return;
          const { error } = await db.rpc("sls_unshare_answer", { p_answer: row.id });
          if (error) return say("Couldn't stop sharing: " + error.message, "err");
          state.shares.delete(row.id);
          draw();
          say("Link turned off.", "ok");
        }));
    }
  };
  draw();
  return box;
}

async function copyText(text) {
  try { await navigator.clipboard.writeText(text); return true; }
  catch (_) { window.prompt("Copy this link:", text); return false; }
}

async function loadShares() {
  state.shares = new Map();
  if (!state.user) return;
  const { data, error } = await db.from("answer_shares").select("answer_id, token");
  state.features.share = !error;
  for (const r of data || []) state.shares.set(r.answer_id, r.token);
}

async function renderSharedAnswer(token) {
  const box = $("shared-body");
  box.replaceChildren(Object.assign(document.createElement("p"), { className: "muted", textContent: "Loading…" }));
  const { data, error } = db ? await db.rpc("sls_shared_answer", { p_token: token }) : { data: null, error: true };
  const row = !error && data && data[0];
  box.replaceChildren();
  if (!row) {
    box.append(Object.assign(document.createElement("p"), { className: "muted", textContent: "This link isn't working. The person who shared it may have stopped sharing, or the answer was deleted." }));
    return;
  }
  const q = QUESTION_INDEX.get(row.question_id);
  const card = document.createElement("article");
  card.className = "question-card shared-card level-" + (q ? q.level : row.level);
  if (q) {
    card.append(
      Object.assign(document.createElement("span"), { className: "question-number", textContent: "#" + questionNumber(q) }),
      Object.assign(document.createElement("p"), { className: "shared-level", textContent: LEVEL_LABELS[q.level] + " · " + q.passage.map((r) => r.replace(/-/g, "–")).join("; ") }));
    const h = Object.assign(document.createElement("h2"), { className: "question-text" });
    renderWithTerms(h, q.prompt);
    card.append(h);
  }
  const who = (row.display_name || "").trim() || "Someone";
  const ans = document.createElement("div");
  ans.className = "shared-answer";
  ans.append(Object.assign(document.createElement("p"), { className: "shared-by", textContent: who + "\u2019s answer · " + formatDate(row.created_at) + (row.updated_at && row.updated_at.slice(0, 16) !== row.created_at.slice(0, 16) ? " (edited " + formatDate(row.updated_at) + ")" : "") }));
  const body = document.createElement("div");
  body.className = "body" + (isRich(row.answer) ? " rich" : "");
  body.append(answerContent(row.answer));
  ans.append(body);
  card.append(ans);
  box.append(card);
  if (q) {
    const go = Object.assign(document.createElement("button"), { type: "button", className: "btn", textContent: "Answer this question yourself" });
    go.classList.add("with-icon");
    go.prepend(icon("edit"));
    go.onclick = () => { state.topic = null; state.anyLevel = false; openQuestion(q, q.level); };
    box.append(Object.assign(document.createElement("div"), { className: "shared-actions" }));
    box.lastChild.append(go);
  }
}

function renderMyAnswers() {
  const q = state.question;
  const rows = (q && state.answers.get(q.id)) || [];
  const list = $("my-answers-list");
  list.replaceChildren();
  for (const row of rows) {
    const li = document.createElement("li");
    li.append(answerEntry(row, { onEdit: () => startEdit(row), onDelete: () => deleteAnswer(row), own: true }));
    if (state.editing && state.editing.id === row.id) li.classList.add("editing");
    list.append(li);
  }
  $("my-answers").hidden = !rows.length;
  const canAddMore = state.features.multi || !rows.length;
  $("answer-label").textContent = state.editing ? "Edit your answer" : rows.length ? (canAddMore ? "Add another answer" : "Your answer") : "Your answer";
  if (!state.features.multi && rows.length && !state.editing) startEdit(rows[0], true);
  $("save-answer").textContent = state.editing ? "Save changes" : "Save answer";
  $("cancel-edit").hidden = !state.editing || !state.features.multi;
  $("share-row").hidden = !state.user || !state.features.groups || !state.groups.length;
}

function startEdit(row, quiet) {
  state.editing = row;
  answerEditor.setValue(row.answer);
  $("answer-shared").checked = !!row.shared;
  if (!quiet) { renderMyAnswers(); answerEditor.focus(); }
}

function cancelEdit() {
  state.editing = null;
  answerEditor.clear();
  $("answer-shared").checked = false;
  renderMyAnswers();
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
  $("data-panel").hidden = !state.user;
  if (!state.user) {
    $("methods-panel").hidden = true;
    $("mfa-panel").hidden = true;
    return;
  }
  $("delete-confirm").value = "";
  $("delete-account").disabled = true;
  setStatus("delete-status", "");

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
  $("set-level").value = studyLevel() || "";
  setStatus("settings-status", "");
  renderMethods();
  renderMfaPanel();
}

// ─────────────────────────── Data ───────────────────────────

async function loadUserData() {
  if (!state.user) {
    state.answers.clear();
    state.groups = [];
    state.names = new Map();
    state.profile = { denomination: "general", translation: DEFAULT_TRANSLATION, display_name: "" };
    return;
  }

  // Create the profile row the first time someone signs in (does nothing if it exists).
  await db.from("profiles").upsert({ id: state.user.id, translation: DEFAULT_TRANSLATION }, { onConflict: "id", ignoreDuplicates: true });

  const [{ data: profile, error: pErr }, answers] = await Promise.all([
    db.from("profiles").select("*").eq("id", state.user.id).maybeSingle(),
    loadMyAnswers()
  ]);

  if (pErr) console.error("Profile load failed:", pErr);
  if (profile) state.profile = profile;
  state.answers = new Map();
  for (const r of answers) {
    if (!state.answers.has(r.question_id)) state.answers.set(r.question_id, []);
    state.answers.get(r.question_id).push(r);
  }
  await Promise.all([loadGroups(), loadShares()]);
}

const ANSWER_COLUMNS = "id, question_id, level, answer, created_at, updated_at, shared";

async function loadMyAnswers() {
  let { data, error } = await db.from("answers").select(ANSWER_COLUMNS)
    .eq("user_id", state.user.id).order("created_at", { ascending: false });
  if (error && /shared/.test(error.message || "")) {
    // Database update 005 not run yet: no sharing, one answer per question.
    state.features = { multi: false, groups: false };
    ({ data, error } = await db.from("answers").select("id, question_id, level, answer, created_at, updated_at")
      .eq("user_id", state.user.id).order("created_at", { ascending: false }));
  }
  if (error) { console.error("Answers load failed:", error); return []; }
  return data || [];
}

function myAnswerRows() {
  return [...state.answers.values()].flat();
}

async function saveAnswer() {
  const text = answerEditor.getValue();
  if (!state.question) return;
  if (!text) return setStatus("save-status", "Write an answer first.", "err");
  if (text.length > 20000) return setStatus("save-status", "That answer is too long to save (about 20,000 characters, counting formatting). Try splitting it into two answers.", "err");

  if (!state.user) {
    stashDraft(text);
    setStatus("save-status", "Sign in to save. Your answer will be kept.", "");
    return openSignIn();
  }

  const qid = state.question.id;
  const existing = state.answers.get(qid) || [];
  // Before database update 005, each question holds one answer: keep updating it.
  const target = state.editing || (!state.features.multi && existing[0]) || null;
  const fields = { answer: text, updated_at: new Date().toISOString() };
  if (state.features.groups) fields.shared = $("answer-shared").checked;

  $("save-answer").disabled = true;
  setStatus("save-status", "Saving…");
  const cols = state.features.groups ? ANSWER_COLUMNS : "id, question_id, level, answer, created_at, updated_at";
  const query = target
    ? db.from("answers").update(fields).eq("id", target.id)
    : db.from("answers").insert({ ...fields, user_id: state.user.id, question_id: qid, level: state.level });
  const { data, error } = await query.select(cols).single();
  $("save-answer").disabled = false;

  if (error) {
    console.error(error);
    return setStatus("save-status", "Couldn't save: " + error.message, "err");
  }
  const rows = existing.filter((r) => r.id !== data.id);
  rows.unshift(data);
  rows.sort((x, y) => y.created_at.localeCompare(x.created_at));
  state.answers.set(qid, rows);
  clearDraft();
  const wasEditing = !!target;
  state.editing = null;
  answerEditor.clear();
  $("answer-shared").checked = false;
  renderMyAnswers();
  setStatus("save-status", wasEditing ? "Saved your changes." : "Saved. You can add another answer any time.", "ok");
}

async function deleteAnswer(row) {
  if (!confirm("Delete this answer? This can't be undone.")) return;
  const { error } = await db.from("answers").delete().eq("id", row.id);
  if (error) return alert("Couldn't delete: " + error.message);
  const rows = (state.answers.get(row.question_id) || []).filter((r) => r.id !== row.id);
  if (rows.length) state.answers.set(row.question_id, rows); else state.answers.delete(row.question_id);
  if (state.editing && state.editing.id === row.id) cancelEdit();
  if (!$("view-question").hidden) renderMyAnswers();
  if (!$("view-answers").hidden) renderAnswers();
}

async function saveSettings(e) {
  e.preventDefault();
  const level = $("set-level").value || null;
  const update = {
    display_name: $("set-name").value.trim() || null,
    denomination: $("set-denomination").value,
    translation: $("set-translation").value,
    study_level: level
  };
  setStatus("settings-status", "Saving…");
  let { error } = await db.from("profiles").update(update).eq("id", state.user.id);
  let deviceOnly = false;
  if (error && /study_level/.test(error.message || "")) {
    // Database update 007 not run yet: save the rest, keep the level on this device.
    delete update.study_level;
    ({ error } = await db.from("profiles").update(update).eq("id", state.user.id));
    deviceOnly = true;
  }
  if (error) return setStatus("settings-status", "Couldn't save: " + error.message, "err");
  try { if (level) localStorage.setItem(LEVEL_KEY, level); else localStorage.removeItem(LEVEL_KEY); } catch (_) { /* ignore */ }
  state.profile = { ...state.profile, ...update };
  if (deviceOnly) delete state.profile.study_level;
  setStatus("settings-status", deviceOnly ? "Saved. (Your study level is saved on this device for now.)" : "Saved.", "ok");
  applyHomeLevel();
  renderHomeVerses();
}

// ─────────────────────────── Sign in ───────────────────────────

function redirectUrl() {
  return window.location.origin + window.location.pathname;
}

function openSignIn() {
  // Keep anything typed so far; signing in reloads the question view.
  if (state.question && !$("view-question").hidden && !answerEditor.isEmpty()) {
    stashDraft(answerEditor.getValue());
  }
  $("email-form").hidden = false;
  $("code-form").hidden = true;
  setStatus("signin-status", db ? "" : "Sign-in couldn't load. Check your connection or ad blocker, then refresh.", db ? "" : "err");
  if (!$("signin-dialog").open) openSoftModal($("signin-dialog"));
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

const mfaLoginCode = createCodeBoxes($("mfa-login-code"), 6, async (code) => { // password managers may fill this
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
});

function promptForAuthenticator() {
  setStatus("mfa-login-status", "");
  mfaLoginCode.boxes.forEach((b) => (b.value = ""));
  if (!$("mfa-dialog").open) openSoftModal($("mfa-dialog"));
  mfaLoginCode.focus();
}

// ─────────────────────────── Authenticator (being retired) ───────────────────────────
// Authenticator codes are no longer offered. Accounts that still have Supabase's older
// two-step code see this panel only so they can turn it off; everyone else never sees it.

async function renderMfaPanel(keepStatus) {
  const panel = $("mfa-panel");
  panel.hidden = true;
  if (!state.user || !db) return;
  const legacy = await verifiedTotpFactor();
  panel.hidden = !legacy;
  if (!legacy) return;
  if (!keepStatus) setStatus("mfa-status", "");
  $("mfa-summary").textContent = "Your account still asks for an authenticator code after your email code. Authenticator codes are being retired: turn it off to sign in with just your email code or Google.";
}

async function removeAuthenticator() {
  if (!confirm("Turn off the authenticator? You'll sign in with just your email code, Google, or YouVersion.")) return;
  const factor = await verifiedTotpFactor();
  if (factor) {
    const { error } = await db.auth.mfa.unenroll({ factorId: factor.id });
    if (error) return setStatus("mfa-status", "Couldn't turn it off (" + error.message + ").", "err");
  }
  setStatus("mfa-status", "Authenticator is off. You can delete Seek Like Silver from Dashlane or your authenticator app.", "ok");
  setTimeout(() => renderMfaPanel(true), 2500);
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
  answerEditor.setValue(draft.text);
  setStatus("save-status", state.user ? "Your draft is back. Press Save answer to keep it." : "");
}

// ─────────────────────────── Helpers ───────────────────────────

function setStatus(id, text, kind) {
  const el = $(id);
  el.textContent = text;
  el.classList.add("status");
  el.classList.remove("ok", "err");
  if (kind) el.classList.add(kind);
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

// ─────────────────────────── Glossary (hover or tap a dotted word) ───────────────────────────

const GLOSSARY_RES = GLOSSARY.map((g) => ({ ...g, re: new RegExp(g.match, g.cs ? "g" : "gi") }));

// Put text into an element, marking the first use of each glossary word.
function renderWithTerms(el, text) {
  const hits = [];
  for (const g of GLOSSARY_RES) {
    g.re.lastIndex = 0;
    const m = g.re.exec(text);
    if (m) hits.push({ start: m.index, end: m.index + m[0].length, g });
  }
  hits.sort((x, y) => x.start - y.start || (y.end - y.start) - (x.end - x.start));
  const chosen = [];
  for (const h of hits) if (!chosen.length || h.start >= chosen[chosen.length - 1].end) chosen.push(h);
  el.replaceChildren();
  let at = 0;
  for (const h of chosen) {
    // Punctuation touching a term ("the Word.") stays on the same line as the term.
    const before = text.slice(at, h.start);
    const lead = /[^\s\w]+$/.exec(before);
    el.append(lead ? before.slice(0, lead.index) : before);
    const b = document.createElement("button");
    b.type = "button";
    b.className = "term";
    b.textContent = text.slice(h.start, h.end);
    b.dataset.term = h.g.term;
    b.setAttribute("aria-describedby", "term-pop");
    at = h.end;
    const next = chosen[chosen.indexOf(h) + 1];
    let trail = (/^[^\s\w]+/.exec(text.slice(at)) || [""])[0];
    if (next && at + trail.length > next.start) trail = text.slice(at, next.start);
    if (lead || trail) {
      const glue = Object.assign(document.createElement("span"), { className: "term-glue" });
      glue.append(lead ? lead[0] : "", b, trail);
      el.append(glue);
      at += trail.length;
    } else el.append(b);
  }
  el.append(text.slice(at));
}

let termAnchor = null;
let termHideTimer = null;
let termShownAt = 0; // a tap on a phone also counts as a hover, so don't let that tap close it again
function showTerm(btn) {
  clearTimeout(termHideTimer);
  const g = GLOSSARY.find((x) => x.term === btn.dataset.term);
  if (!g) return;
  const pop = $("term-pop");
  pop.replaceChildren(
    Object.assign(document.createElement("strong"), { textContent: g.term }),
    Object.assign(document.createElement("span"), { textContent: g.def })
  );
  const cs = getComputedStyle(btn);
  for (const v of ["--pigment", "--pigment-tint", "--pigment-deep"]) pop.style.setProperty(v, cs.getPropertyValue(v));
  pop.hidden = false;
  pop.classList.remove("show");
  void pop.offsetWidth; // restart the entrance animation
  pop.classList.add("show");
  if (termAnchor !== btn) termShownAt = Date.now();
  termAnchor = btn;
  btn.setAttribute("aria-expanded", "true");
  const r = btn.getBoundingClientRect();
  const width = Math.min(320, window.innerWidth - 32);
  pop.style.width = width + "px";
  const left = Math.max(16, Math.min(r.left + window.scrollX, window.scrollX + window.innerWidth - width - 16));
  pop.style.left = left + "px";
  const below = r.bottom + 12 + pop.offsetHeight < window.innerHeight;
  pop.classList.toggle("above", !below);
  pop.style.top = (below ? r.bottom + window.scrollY + 10 : r.top + window.scrollY - pop.offsetHeight - 10) + "px";
  pop.style.setProperty("--arrow-x", Math.max(14, Math.min(width - 14, r.left + window.scrollX + r.width / 2 - left)) + "px");
}
function hideTerm() {
  const pop = $("term-pop");
  if (pop && !pop.hidden) {
    pop.classList.remove("show");
    clearTimeout(pop._t);
    pop._t = setTimeout(() => { if (!pop.classList.contains("show")) pop.hidden = true; }, reducedMotion() ? 0 : 180);
  }
  if (termAnchor) termAnchor.setAttribute("aria-expanded", "false");
  termAnchor = null;
}
const reducedMotion = () => window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
document.addEventListener("click", (e) => {
  const t = e.target.closest && e.target.closest(".term");
  if (t) { e.preventDefault(); return termAnchor === t && Date.now() - termShownAt > 600 ? hideTerm() : showTerm(t); }
  if (!e.target.closest || !e.target.closest("#term-pop")) hideTerm();
});
document.addEventListener("mouseover", (e) => { const t = e.target.closest && e.target.closest(".term"); if (t) showTerm(t); });
document.addEventListener("mouseout", (e) => {
  const t = e.target.closest && e.target.closest(".term, #term-pop");
  if (t) termHideTimer = setTimeout(hideTerm, 220);
});
document.addEventListener("mouseover", (e) => { if (e.target.closest && e.target.closest("#term-pop")) clearTimeout(termHideTimer); });
document.addEventListener("keydown", (e) => { if (e.key === "Escape") hideTerm(); });
window.addEventListener("resize", hideTerm);

function renderGlossaryList() {
  const dl = $("glossary-list");
  if (dl.childElementCount) return;
  for (const g of [...GLOSSARY].sort((x, y) => x.term.localeCompare(y.term))) {
    dl.append(Object.assign(document.createElement("dt"), { textContent: g.term }),
              Object.assign(document.createElement("dd"), { textContent: g.def }));
  }
}

// ─────────────────────────── Browse by topic or book ───────────────────────────

// A topic card opens a question on that topic; "New question" then stays on it.
function setUpTopics() {
  const wrap = $("topic-chips");
  for (const [key, t] of Object.entries(TOPICS)) {
    const count = [...QUESTION_INDEX.values()].filter((q) => (q.topics || []).includes(key)).length;
    const b = document.createElement("button");
    b.type = "button";
    b.className = "topic-card topic-" + key;
    b.append(
      Object.assign(document.createElement("span"), { className: "tesserae", ariaHidden: "true" }),
      Object.assign(document.createElement("span"), { className: "topic-name", textContent: t.label }),
      Object.assign(document.createElement("span"), { className: "topic-desc", textContent: t.desc }),
      Object.assign(document.createElement("span"), { className: "topic-count", textContent: count + " questions" })
    );
    b.onclick = () => chooseTopicLevel(key);
    wrap.append(b);
  }
}

// ─────────────────────────── Share and print a question ───────────────────────────

async function copyQuestionLink() {
  if (!state.question) return;
  const url = location.origin + location.pathname + "#q=" + questionNumber(state.question);
  try {
    await navigator.clipboard.writeText(url);
    flashIcon($("copy-link"), "check", "Copied");
    setStatus("share-status", "Link copied. Anyone with it can open this question.", "ok");
  } catch (_) {
    window.prompt("Copy this link:", url);
  }
}

// ─────────────────────────── Download my answers ───────────────────────────

function downloadFile(name, type, text) {
  const blob = new Blob([text], { type });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = name;
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

function exportAnswers(kind) {
  if (!state.user) return openSignIn();
  const rows = myAnswerRows().sort((x, y) => (x.created_at || "").localeCompare(y.created_at || ""));
  const stamp = new Date().toISOString().slice(0, 10);
  if (kind === "json") {
    const data = {
      exported_at: new Date().toISOString(),
      site: "https://seeklikesilver.com",
      profile: { display_name: state.profile.display_name || null, denomination: state.profile.denomination, translation: state.profile.translation },
      answers: rows.map((r) => {
        const q = QUESTION_INDEX.get(r.question_id);
        return { question_id: r.question_id, level: r.level, question: q ? q.prompt : null, answer: answerPlainText(r.answer),
                 answer_formatted_html: isRich(r.answer) ? r.answer.slice(RICH_MARK.length) : null,
                 shared_with_groups: !!r.shared, created_at: r.created_at, updated_at: r.updated_at };
      })
    };
    return downloadFile("seek-like-silver-answers-" + stamp + ".json", "application/json", JSON.stringify(data, null, 2));
  }
  const lines = ["Seek Like Silver: my answers", "Downloaded " + formatDate(new Date().toISOString()), ""];
  const byQ = new Map();
  for (const r of rows) { if (!byQ.has(r.question_id)) byQ.set(r.question_id, []); byQ.get(r.question_id).push(r); }
  for (const [qid, list] of byQ) {
    const q = QUESTION_INDEX.get(qid);
    lines.push("────────────────────────────────────────");
    lines.push(q ? questionLabel(q) : (LEVEL_LABELS[list[0].level] || "") + " · " + qid);
    lines.push(q ? q.prompt : "(This question is no longer in the bank)");
    if (q) lines.push("In question: " + q.passage.join("; ").replace(/-/g, "–"));
    lines.push("");
    for (const r of list) {
      lines.push(formatDate(r.created_at || r.updated_at) + (r.shared ? " (shared with groups)" : ""));
      lines.push(answerPlainText(r.answer), "");
    }
  }
  downloadFile("seek-like-silver-answers-" + stamp + ".txt", "text/plain;charset=utf-8", lines.join("\n"));
}

// ─────────────────────────── Delete my account ───────────────────────────

async function deleteAccount() {
  if ($("delete-confirm").value.trim() !== "DELETE" || !state.user) return;
  if (!confirm("Last check: permanently delete your account and everything in it?")) return;
  $("delete-account").disabled = true;
  setStatus("delete-status", "Deleting…");
  const { data, error } = await db.functions.invoke(DELETE_FUNCTION, { body: { confirm: "DELETE" } });
  if (error || !data || !data.deleted) {
    const status = error && error.context && error.context.status;
    const reason = error ? await functionErrorReason(error) : "unknown";
    const msg = reason === "authenticator_required" ? "Enter your authenticator code first (sign out and back in), then try again."
      : status === 404 || /Failed to send/i.test(String(reason)) ? "Account deletion isn't switched on yet. (Site owner: deploy the delete-account function.)"
      : "Couldn't delete your account (" + reason + "). Nothing was deleted.";
    $("delete-account").disabled = false;
    return setStatus("delete-status", msg, "err");
  }
  clearDraft();
  await db.auth.signOut({ scope: "local" }).catch(() => {});
  showView("home");
  alert("Your account and everything in it has been deleted.");
}

// ─────────────────────────── Groups ───────────────────────────

const GROUP_ERRORS = {
  bad_code: "That code didn't match a group. Check it and try again.",
  group_full: "That group is full (50 people).",
  too_many_groups: "You can start up to 10 groups.",
  bad_name: "Give the group a name (up to 60 characters).",
  not_allowed: "Enter your authenticator code first, then try again."
};
const groupError = (error) => {
  const key = Object.keys(GROUP_ERRORS).find((k) => (error.message || "").includes(k));
  return key ? GROUP_ERRORS[key] : "Something went wrong: " + error.message;
};

async function loadGroups() {
  state.groups = [];
  state.names = new Map();
  if (!state.user || !state.features.groups) return;
  const { data, error } = await db.from("study_groups").select("id, name, owner_id, invite_code, created_at").order("created_at");
  if (error) {
    if (/study_groups|schema cache|does not exist/i.test(error.message || "")) state.features.groups = false;
    else console.error("Groups load failed:", error);
    return;
  }
  state.groups = await Promise.all((data || []).map(async (g) => {
    const { data: members } = await db.rpc("sls_group_members", { p_group: g.id });
    return { ...g, members: members || [] };
  }));
  for (const g of state.groups) for (const m of g.members) state.names.set(m.user_id, m.display_name || "A group member");
}

function memberName(userId) {
  if (state.user && userId === state.user.id) return "You";
  return state.names.get(userId) || "A group member";
}

async function renderGroupAnswers() {
  const card = $("group-answers");
  const q = state.question;
  card.hidden = true;
  $("group-answers-list").hidden = true;
  $("group-answers-list").replaceChildren();
  if (!q || !state.user || !state.features.groups || !state.groups.length) return;
  const { data, error } = await db.from("answers").select("id, user_id, answer, created_at, updated_at, question_id")
    .eq("question_id", q.id).eq("shared", true).neq("user_id", state.user.id).order("created_at", { ascending: false });
  if (error || !data || !data.length || state.question !== q) return;
  card.hidden = false;
  const people = new Set(data.map((r) => r.user_id)).size;
  $("group-answers-note").textContent = (people === 1 ? "1 person" : people + " people") + " in your groups shared an answer to this question. You might write your own first.";
  $("show-group-answers").hidden = false;
  $("show-group-answers").onclick = () => {
    $("show-group-answers").hidden = true;
    const list = $("group-answers-list");
    for (const r of data) list.append(answerEntry(r, { author: memberName(r.user_id) }));
    list.hidden = false;
  };
}

async function renderGroups() {
  const signedIn = !!state.user;
  $("groups-signed-out").hidden = signedIn;
  $("groups-unavailable").hidden = !signedIn || state.features.groups;
  $("groups-main").hidden = !signedIn || !state.features.groups;
  if (!signedIn || !state.features.groups) return;
  $("groups-name-hint").hidden = !!(state.profile.display_name || "").trim();
  const pending = takePendingJoin();
  if (pending) {
    $("join-code").value = pending;
    setStatus("groups-status", "You were invited to a group. Press Join to join it.", "");
  }
  const wrap = $("groups-list");
  wrap.replaceChildren();
  if (!state.groups.length) {
    wrap.append(Object.assign(document.createElement("p"), { className: "muted", textContent: "You're not in any groups yet." }));
    return;
  }
  for (const g of state.groups) wrap.append(groupCard(g));
}

function groupCard(g) {
  const isOwner = state.user && g.owner_id === state.user.id;
  const card = document.createElement("article");
  card.className = "group-card";
  const title = Object.assign(document.createElement("h2"), { className: "panel-title", textContent: g.name });
  card.append(title);

  const invite = document.createElement("p");
  invite.className = "group-invite";
  invite.append("Invite code: ");
  invite.append(Object.assign(document.createElement("code"), { textContent: g.invite_code }));
  const copy = iconButton("link", "Copy invite link", async () => {
    const url = location.origin + location.pathname + "#join=" + g.invite_code;
    try { await navigator.clipboard.writeText(url); flashIcon(copy, "check", "Invite link copied"); }
    catch (_) { window.prompt("Copy this invite link:", url); }
  });
  invite.append(" ", copy);
  card.append(invite);

  const ul = document.createElement("ul");
  ul.className = "member-list";
  for (const m of g.members) {
    const li = document.createElement("li");
    li.append((m.user_id === state.user.id ? "You" : (m.display_name || "A group member")) + (m.is_owner ? " (leader)" : ""));
    if (isOwner && !m.is_owner) {
      const rm = iconButton("user-minus", "Remove " + (m.display_name || "this person"), null, { danger: true });
      rm.onclick = () => groupAction(() => db.from("study_group_members").delete().eq("group_id", g.id).eq("user_id", m.user_id),
        "Remove " + (m.display_name || "this person") + " from the group?");
      li.append(" ", rm);
    }
    ul.append(li);
  }
  card.append(Object.assign(document.createElement("h3"), { className: "group-sub", textContent: g.members.length === 1 ? "1 member" : g.members.length + " members" }), ul);

  const feed = document.createElement("div");
  feed.className = "group-feed";
  const feedBtn = Object.assign(document.createElement("button"), { type: "button", className: "btn btn-ghost btn-small with-icon", textContent: "See shared answers" });
  feedBtn.prepend(icon("eye"));
  feedBtn.onclick = () => loadGroupFeed(g, feed, feedBtn);
  card.append(feedBtn, feed);

  const actions = document.createElement("div");
  actions.className = "group-actions";
  const add = (name, label, fn, danger) => actions.append(iconButton(name, label, fn, { danger }));
  if (isOwner) {
    add("edit", "Rename group", () => {
      const name = (window.prompt("New name for the group:", g.name) || "").trim();
      if (name && name !== g.name) groupAction(() => db.from("study_groups").update({ name }).eq("id", g.id));
    });
    add("refresh", "Make a new invite code", () => groupAction(() => db.rpc("sls_new_invite_code", { p_group: g.id }), "Make a new code? The old code and links will stop working."));
    add("trash", "Delete group", () => groupAction(() => db.from("study_groups").delete().eq("id", g.id), "Delete \"" + g.name + "\" for everyone? Members keep their own answers."), true);
  } else {
    add("log-out", "Leave group", () => groupAction(() => db.from("study_group_members").delete().eq("group_id", g.id).eq("user_id", state.user.id), "Leave \"" + g.name + "\"?"), true);
  }
  const top = Object.assign(document.createElement("div"), { className: "group-top" });
  title.replaceWith(top);
  top.append(title, actions);
  return card;
}

async function loadGroupFeed(g, feed, btn) {
  btn.disabled = true;
  const ids = g.members.map((m) => m.user_id);
  const { data, error } = await db.from("answers").select("id, user_id, question_id, answer, created_at, updated_at")
    .eq("shared", true).in("user_id", ids).order("created_at", { ascending: false }).limit(30);
  btn.hidden = true;
  if (error) return feed.append(Object.assign(document.createElement("p"), { className: "status err", textContent: "Couldn't load answers: " + error.message }));
  if (!data.length) return feed.append(Object.assign(document.createElement("p"), { className: "muted", textContent: "No one has shared an answer yet. Tick \"Share this answer with my groups\" when you save one." }));
  for (const r of data) {
    const q = QUESTION_INDEX.get(r.question_id);
    const item = document.createElement("div");
    item.className = "feed-item";
    if (q) {
      const open = Object.assign(document.createElement("button"), { type: "button", className: "link-button feed-question", textContent: questionLabel(q) + ": " + q.prompt });
      open.onclick = () => openQuestion(q, q.level);
      item.append(open);
    }
    item.append(answerEntry(r, { author: memberName(r.user_id) }));
    feed.append(item);
  }
}

async function groupAction(run, confirmText) {
  if (confirmText && !confirm(confirmText)) return;
  setStatus("groups-status", "Working…");
  const { error } = await run();
  if (error) return setStatus("groups-status", groupError(error), "err");
  await loadGroups();
  setStatus("groups-status", "Done.", "ok");
  renderGroups();
}

async function createGroup(e) {
  e.preventDefault();
  const name = $("new-group-name").value.trim();
  if (!name) return;
  setStatus("groups-status", "Creating…");
  const { data, error } = await db.rpc("sls_create_group", { p_name: name });
  if (error) return setStatus("groups-status", groupError(error), "err");
  $("new-group-name").value = "";
  await loadGroups();
  renderGroups();
  const g = data && data[0];
  setStatus("groups-status", g ? "Created \"" + g.name + "\". Share the invite code " + g.invite_code + " with your group." : "Created.", "ok");
}

async function joinGroup(e) {
  e.preventDefault();
  const code = $("join-code").value.trim().toUpperCase();
  if (!code) return;
  setStatus("groups-status", "Joining…");
  const { data, error } = await db.rpc("sls_join_group", { p_code: code });
  if (error) return setStatus("groups-status", groupError(error), "err");
  $("join-code").value = "";
  await loadGroups();
  renderGroups();
  const g = data && data[0];
  setStatus("groups-status", g ? "You joined \"" + g.name + "\"." : "Joined.", "ok");
}

// Invite links (#join=CODE) survive signing in.
const JOIN_KEY = "sls-join";
function stashPendingJoin(code) { try { sessionStorage.setItem(JOIN_KEY, code); } catch (_) { /* ignore */ } }
function takePendingJoin() {
  try { const c = sessionStorage.getItem(JOIN_KEY); sessionStorage.removeItem(JOIN_KEY); return c; } catch (_) { return null; }
}

// ─────────────────────────── Links into the site (#q=b17, #join=CODE) ───────────────────────────

// Show whatever page the address points to (on load, reload, and back/forward).
function handleRoute() {
  const h = location.hash;
  const go = { fromHistory: true };
  let m;
  if ((m = h.match(/^#q=(\d{3}|[a-z]\d{1,3})$/))) {
    const q = QUESTION_INDEX.get(QUESTION_BY_NUM.get(m[1]) || m[1]); // new links use the number; old ones the ID
    if (!q) return showView("home", go);
    if (!state.question || state.question.id !== q.id || $("view-question").hidden) openQuestion(q, q.level, go);
  } else if ((m = h.match(/^#share=([a-f0-9]{24})$/i))) {
    showView("shared", go);
    renderSharedAnswer(m[1].toLowerCase());
  } else if ((m = h.match(/^#join=([A-Fa-f0-9]{10})$/))) {
    stashPendingJoin(m[1].toUpperCase());
    history.replaceState(null, "", location.pathname + location.search + "#groups");
    showView("groups", go);
    if (!state.user) openSignIn();
  } else if (ROUTED_VIEWS.includes(h.slice(1))) {
    showView(h.slice(1), go);
  } else {
    showView("home", go);
  }
}
const handleHash = handleRoute;

// Reloading keeps your place on the page, too.
const SCROLL_KEY = "sls-scroll";
window.addEventListener("pagehide", () => {
  try { sessionStorage.setItem(SCROLL_KEY, JSON.stringify({ url: location.href, y: window.scrollY })); } catch (_) { /* ignore */ }
});
function restoreScroll() {
  try {
    const saved = JSON.parse(sessionStorage.getItem(SCROLL_KEY) || "null");
    sessionStorage.removeItem(SCROLL_KEY);
    if (saved && saved.url === location.href && saved.y > 0) setTimeout(() => window.scrollTo(0, saved.y), 150);
  } catch (_) { /* ignore */ }
}

// ─────────────────────────── Site stats (owner only) ───────────────────────────
// The database decides who's an admin (supabase-migrations/006-site-stats.sql);
// hiding the link is only a convenience.

async function checkAdmin() {
  $("stats-link").hidden = true;
  if (!state.user) return;
  const { data, error } = await db.rpc("sls_is_admin");
  $("stats-link").hidden = !(!error && data === true);
}

const fmt = (n) => Number(n || 0).toLocaleString();

async function renderStats() {
  $("stats-body").hidden = true;
  if (!state.user) return setStatus("stats-status", "Sign in to see stats.");
  setStatus("stats-status", "Loading…");
  const { data: s, error } = await db.rpc("sls_site_stats");
  if (error) {
    const msg = /not_allowed/.test(error.message || "") ? "This page is only for the site owner (and needs your authenticator code if you use one)."
      : /sls_site_stats|schema cache|does not exist/i.test(error.message || "") ? "Stats aren't switched on yet. (Run supabase-migrations/006-site-stats.sql.)"
      : "Couldn't load stats: " + error.message;
    return setStatus("stats-status", msg, "err");
  }
  setStatus("stats-status", "");
  $("stats-body").hidden = false;

  const tiles = [
    ["Accounts", s.users, fmt(s.new_7_days) + " new this week · " + fmt(s.new_30_days) + " this month"],
    ["Signed in, last 30 days", s.active_30_days, fmt(s.active_7_days) + " in the last 7 days"],
    ["Answers", s.answers, fmt(s.answers_7_days) + " this week · from " + fmt(s.people_who_answered) + " people"],
    ["Groups", s.groups, fmt(s.group_members) + " memberships · " + fmt(s.shared_answers) + " shared answers"],
    ["Sign-in methods", null, "Google " + fmt(s.with_google) + " · Email " + fmt(s.with_email) + " · YouVersion " + fmt(s.with_youversion)],
    ["Authenticator on", s.with_authenticator, s.users ? Math.round(100 * s.with_authenticator / s.users) + "% of accounts" : ""]
  ];
  const wrap = $("stat-tiles");
  wrap.replaceChildren();
  for (const [label, value, sub] of tiles) {
    const t = document.createElement("div");
    t.className = "stat-tile";
    t.append(Object.assign(document.createElement("span"), { className: "stat-label", textContent: label }));
    if (value !== null) t.append(Object.assign(document.createElement("span"), { className: "stat-value", textContent: fmt(value) }));
    t.append(Object.assign(document.createElement("span"), { className: "stat-sub", textContent: sub }));
    wrap.append(t);
  }

  renderWeekChart(s.signups_by_week || []);

  const levels = ["beginner", "moderate", "philosopher"];
  const byLevel = s.answers_by_level || {};
  const maxL = Math.max(1, ...levels.map((l) => byLevel[l] || 0));
  const lb = $("level-bars");
  lb.replaceChildren();
  for (const l of levels) {
    const n = byLevel[l] || 0;
    const row = document.createElement("div");
    row.className = "level-bar-row level-" + l;
    const bar = Object.assign(document.createElement("span"), { className: "level-bar-fill" });
    bar.style.width = (n ? Math.max(2, 100 * n / maxL) : 0) + "%";
    const track = Object.assign(document.createElement("span"), { className: "level-bar-track" });
    track.append(bar);
    row.append(Object.assign(document.createElement("span"), { className: "level-bar-label", textContent: LEVEL_LABELS[l] }), track,
               Object.assign(document.createElement("span"), { className: "level-bar-value", textContent: fmt(n) }));
    lb.append(row);
  }

  const tq = $("top-questions");
  tq.replaceChildren();
  for (const t of s.top_questions || []) {
    const q = QUESTION_INDEX.get(t.question_id);
    const li = document.createElement("li");
    const b = Object.assign(document.createElement("button"), { type: "button", className: "link-button feed-question", textContent: q ? q.prompt : t.question_id });
    if (q) b.onclick = () => openQuestion(q, q.level);
    li.append(b, Object.assign(document.createElement("span"), { className: "stat-sub", textContent: " " + fmt(t.answers) + (t.answers === 1 ? " answer" : " answers") }));
    tq.append(li);
  }
  if (!tq.childElementCount) tq.append(Object.assign(document.createElement("li"), { className: "muted", textContent: "No answers yet." }));
  $("stats-time").textContent = "Updated " + new Date(s.generated_at).toLocaleString() + ". Includes your own and any test accounts.";
}

function renderWeekChart(weeks) {
  const box = $("week-chart");
  box.replaceChildren();
  const max = Math.max(1, ...weeks.map((w) => w.users));
  const nice = max <= 4 ? max : Math.ceil(max / 5) * 5;
  const W = 640, H = 200, padL = 32, padB = 26, padT = 10;
  const plotW = W - padL - 8, plotH = H - padB - padT;
  const gap = 2, bw = plotW / weeks.length - 6;
  const ns = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(ns, "svg");
  svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
  svg.setAttribute("role", "img");
  svg.setAttribute("aria-label", "New accounts per week for the last 12 weeks. Table below.");
  const el = (tag, attrs, text) => { const e = document.createElementNS(ns, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); if (text != null) e.textContent = text; svg.append(e); return e; };
  for (const v of [0, Math.round(nice / 2), nice]) {
    const y = padT + plotH - (v / nice) * plotH;
    el("line", { x1: padL, x2: W - 8, y1: y, y2: y, class: "grid" });
    el("text", { x: padL - 6, y: y + 4, class: "axis", "text-anchor": "end" }, String(v));
  }
  const tip = Object.assign(document.createElement("div"), { className: "chart-tip", hidden: true });
  weeks.forEach((w, i) => {
    const x = padL + i * (plotW / weeks.length) + 3;
    const h = (w.users / nice) * plotH;
    const y = padT + plotH - h;
    const label = new Date(w.week + "T12:00:00").toLocaleDateString(undefined, { month: "short", day: "numeric" });
    if (h > 0) {
      const r = Math.min(4, bw / 2, h);
      el("path", { class: "bar", d: `M${x},${padT + plotH} V${y + r} Q${x},${y} ${x + r},${y} H${x + bw - r} Q${x + bw},${y} ${x + bw},${y + r} V${padT + plotH} Z` });
    }
    if (i % 2 === weeks.length % 2 || i === weeks.length - 1) el("text", { x: x + bw / 2, y: H - 8, class: "axis", "text-anchor": "middle" }, label);
    const hit = el("rect", { x: x - 3 + gap / 2, y: padT, width: plotW / weeks.length - gap, height: plotH, class: "hit", tabindex: 0 });
    const show = () => {
      tip.hidden = false;
      tip.textContent = "Week of " + label + ": " + fmt(w.users) + (w.users === 1 ? " new account" : " new accounts");
      const bb = box.getBoundingClientRect(), hb = hit.getBoundingClientRect();
      tip.style.left = Math.min(bb.width - 170, Math.max(0, hb.left - bb.left + hb.width / 2 - 85)) + "px";
      hit.classList.add("on");
    };
    const hide = () => { tip.hidden = true; hit.classList.remove("on"); };
    hit.addEventListener("mouseenter", show); hit.addEventListener("focus", show);
    hit.addEventListener("mouseleave", hide); hit.addEventListener("blur", hide);
  });
  box.append(svg, tip);
  const tb = $("week-table").querySelector("tbody");
  tb.replaceChildren();
  for (const w of weeks) {
    const tr = document.createElement("tr");
    tr.append(Object.assign(document.createElement("td"), { textContent: new Date(w.week + "T12:00:00").toLocaleDateString() }),
              Object.assign(document.createElement("td"), { textContent: fmt(w.users) }));
    tb.append(tr);
  }
}

// ─────────────────────────── All questions ───────────────────────────

const allView = { query: "", sort: "level" };

// "#482", "482", words ("prodigal son"), a verse ("John 3"), or a topic; capitals don't matter.
// Every word typed must appear somewhere in the question, its number, passages, or topics.
function questionHaystack(q) {
  return [q.prompt, String(questionNumber(q)), q.passage.join(" ; "), q.inspiration.join(" ; "),
          (q.topics || []).map((t) => TOPICS[t].label).join(" ; "), LEVEL_LABELS[q.level]].join(" ; ").toLowerCase().replace(/[“”"]/g, " ");
}
function questionMatches(q, query, mode) {
  const text = query.toLowerCase().replace(/#/g, " ").replace(/\s+/g, " ").trim();
  if (!text) return true;
  const hay = questionHaystack(q);
  if (mode === "phrase") return hay.includes(text);
  // Every word must appear; a number only counts as a whole number (so "3" doesn't match "13" or "#311").
  return text.split(" ").every((w) => /^\d+$/.test(w) ? new RegExp("(^|\\D)" + w + "(\\D|$)").test(hay) : hay.includes(w));
}

// Put text into an element with the searched words highlighted (built safely as text nodes).
function appendHighlighted(el, text, query) {
  const words = query.toLowerCase().replace(/#/g, " ").split(/\s+/).filter((w) => w.length > 1);
  if (!words.length) return el.append(text);
  const lower = text.toLowerCase();
  const marks = [];
  for (const w of words) { let i = lower.indexOf(w); while (i !== -1) { marks.push([i, i + w.length]); i = lower.indexOf(w, i + w.length); } }
  marks.sort((x, y) => x[0] - y[0]);
  let at = 0;
  for (const [s, e] of marks) {
    if (s < at) continue;
    el.append(text.slice(at, s), Object.assign(document.createElement("mark"), { className: "search-hit", textContent: text.slice(s, e) }));
    at = e;
  }
  el.append(text.slice(at));
}

function allQuestionItem(q, query, showLevel) {
  const li = document.createElement("li");
  const b = document.createElement("button");
  b.type = "button";
  b.className = "all-q-item level-" + q.level;
  const num = Object.assign(document.createElement("span"), { className: "all-q-num", ariaLabel: "Question number " + questionNumber(q) });
  appendHighlighted(num, "#" + questionNumber(q), query);
  const prompt = Object.assign(document.createElement("span"), { className: "all-q-prompt" });
  appendHighlighted(prompt, q.prompt, query);
  const meta = Object.assign(document.createElement("span"), { className: "all-q-meta" });
  appendHighlighted(meta, (showLevel ? LEVEL_LABELS[q.level] + " · " : "") + q.passage.map((r) => r.replace(/-/g, "–")).join("; ") + " · " + (q.topics || []).map((t) => TOPICS[t].label).join(", "), query);
  b.append(num, prompt, meta);
  if (state.answers.has(q.id)) b.append(Object.assign(document.createElement("span"), { className: "all-q-done", textContent: "Answered" }));
  b.onclick = () => { state.topic = null; state.anyLevel = false; openQuestion(q, q.level); };
  li.append(b);
  return li;
}

function renderAllQuestions() {
  const wrap = $("all-list");
  wrap.replaceChildren();
  const all = [...QUESTION_INDEX.values()];
  const done = all.filter((q) => state.answers.has(q.id)).length;
  $("all-intro").textContent = all.length + " questions" + (state.user ? " · you've answered " + done : "") + ". Pick any one to study.";
  $("all-search").value = allView.query;
  $("all-sort").value = allView.sort;

  const query = allView.query.trim();
  // An exact phrase ("John 3", "prodigal son") wins when it matches anything; otherwise match the words.
  let matches = all.filter((q) => questionMatches(q, query, "phrase"));
  if (!matches.length) matches = all.filter((q) => questionMatches(q, query, "words"));
  $("all-count").textContent = query ? (matches.length === 1 ? "1 question matches" : matches.length + " questions match") : "";
  if (!matches.length) {
    wrap.append(Object.assign(document.createElement("p"), { className: "muted", textContent: "No questions match “" + query + "”. Try fewer or different words." }));
    return;
  }

  if (allView.sort === "level") {
    const mine = studyLevel();
    const order = Object.keys(LEVEL_LABELS).sort((x, y) => (x === mine ? -1 : y === mine ? 1 : 0));
    for (const level of order) {
      const qs = matches.filter((q) => q.level === level);
      if (!qs.length) continue;
      const section = document.createElement("section");
      section.className = "all-level level-" + level;
      const head = document.createElement("h2");
      head.className = "all-level-title";
      head.append(Object.assign(document.createElement("span"), { className: "tesserae", ariaHidden: "true" }),
                  Object.assign(document.createElement("span"), { textContent: LEVEL_LABELS[level] }),
                  Object.assign(document.createElement("span"), { className: "all-level-count", textContent: qs.length === 1 ? "1 question" : qs.length + " questions" }));
      const ol = document.createElement("ol");
      ol.className = "all-q-list";
      for (const q of qs) ol.append(allQuestionItem(q, query, false));
      section.append(head, ol);
      wrap.append(section);
    }
    return;
  }

  const byText = (x, y) => x.prompt.replace(/^\W+/, "").localeCompare(y.prompt.replace(/^\W+/, ""), undefined, { sensitivity: "base" });
  const sorters = {
    "num-asc": (x, y) => questionNumber(x) - questionNumber(y),
    "num-desc": (x, y) => questionNumber(y) - questionNumber(x),
    az: byText,
    za: (x, y) => byText(y, x),
    unanswered: (x, y) => (state.answers.has(x.id) - state.answers.has(y.id)) || questionNumber(x) - questionNumber(y)
  };
  const ol = document.createElement("ol");
  ol.className = "all-q-list all-flat";
  for (const q of matches.sort(sorters[allView.sort] || sorters["num-asc"])) ol.append(allQuestionItem(q, query, true));
  wrap.append(ol);
}

// ─────────────────────────── Sign-in popups that password managers can reach ───────────────────────────
// A dialog opened with showModal() sits in the browser's "top layer" and makes the rest of
// the page inert, which hides password managers' own popups (Dashlane's list flashes and
// vanishes). These two dialogs open normally instead, with our own backdrop, and only the
// site's own content is made inert, so a password manager's popup stays usable.
function openSoftModal(d) {
  if (d.open) return;
  let shade = document.getElementById("soft-backdrop");
  if (!shade) {
    shade = Object.assign(document.createElement("div"), { id: "soft-backdrop", className: "soft-backdrop" });
    document.body.append(shade);
  }
  shade.hidden = false;
  d.classList.add("soft-modal");
  d.show();
  for (const el of document.querySelectorAll("body > header, body > main, body > footer")) el.inert = true;
  setTimeout(() => {
    const usable = (el) => el.offsetParent !== null && !el.disabled;
    const first = [...d.querySelectorAll("input")].find(usable) || [...d.querySelectorAll("button")].find(usable);
    if (first) first.focus();
  }, 0);
}
function closeSoftModalCleanup() {
  if ([...document.querySelectorAll("dialog.soft-modal")].some((x) => x.open)) return;
  const shade = document.getElementById("soft-backdrop");
  if (shade) shade.hidden = true;
  for (const el of document.querySelectorAll("body > header, body > main, body > footer")) el.inert = false;
}
for (const id of ["signin-dialog", "mfa-dialog"]) document.getElementById(id).addEventListener("close", closeSoftModalCleanup);
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && $("signin-dialog").open) { e.preventDefault(); $("signin-dialog").close(); } // the code prompt can't be skipped
});

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
    state.topic = null;
    state.anyLevel = false;
    const lvl = el.dataset.level;
    openQuestion(pickQuestion(lvl), lvl);
  })
);

$("next-question").addEventListener("click", () => { const q = pickQuestion(state.level); openQuestion(q, q.level); });
$("save-answer").addEventListener("click", saveAnswer);
$("cancel-edit").addEventListener("click", cancelEdit);
$("all-questions-btn").addEventListener("click", () => $("all-dialog").showModal());
$("all-search").addEventListener("input", (e) => { allView.query = e.target.value; renderAllQuestions(); });
$("all-search").addEventListener("keydown", (e) => {
  if (e.key !== "Enter") return;
  const first = document.querySelector("#all-list .all-q-item"); // Enter opens the top result
  if (first) { e.preventDefault(); first.click(); }
});
$("all-sort").addEventListener("change", (e) => { allView.sort = e.target.value; renderAllQuestions(); });
$("all-choose").addEventListener("click", () => { $("all-dialog").close(); showView("all"); });
$("all-random").addEventListener("click", () => {
  $("all-dialog").close();
  state.topic = null;
  state.anyLevel = true; // "New question" keeps picking from every level
  state.question = null;
  const q = pickQuestion(null);
  openQuestion(q, q.level);
});
// "Print for a group": a one-page worksheet with the question and lines to write on
// (instead of the whole web page). Printing with the browser's own Print still prints the page.
function printWorksheet() {
  const q = state.question;
  if (!q) return;
  const sheet = $("print-sheet");
  sheet.replaceChildren();
  const el = (tag, cls, text) => Object.assign(document.createElement(tag), { className: cls, textContent: text || "" });
  const top = el("div", "ps-top");
  const site = el("span", "ps-site");
  site.append(Object.assign(document.createElement("img"), { className: "ps-logo", src: "logo.svg", alt: "" }), "Seek Like Silver");
  top.append(site, el("span", "ps-meta", "Question #" + questionNumber(q) + " · " + LEVEL_LABELS[q.level]));
  const verses = (list) => list.map((r) => r.replace(/-/g, "\u2013")).join("; ");
  const refs = el("p", "ps-refs");
  refs.append(el("strong", "", "Read: "), verses(q.passage));
  if (q.inspiration && q.inspiration.length) refs.append(el("span", "ps-sep", "  ·  "), el("strong", "", "Also: "), verses(q.inspiration));
  const who = el("div", "ps-name");
  who.append(el("span", "", "Name"), el("span", "ps-blank"), el("span", "", "Date"), el("span", "ps-blank ps-short"));
  const lines = el("div", "ps-lines");
  for (let i = 0; i < 40; i++) lines.append(el("div", "ps-line"));
  const foot = el("p", "ps-foot", location.host + location.pathname.replace(/index\.html$/, "") + "#q=" + questionNumber(q));
  sheet.append(top, el("h1", "ps-question", q.prompt), refs, who, lines, foot);
  document.body.classList.add("printing-sheet");
  window.print();
}
window.addEventListener("afterprint", () => document.body.classList.remove("printing-sheet"));

// Printing the page itself opens every section, then puts them back.
let printOpened = [];
window.addEventListener("beforeprint", () => {
  if (document.body.classList.contains("printing-sheet")) return;
  printOpened = [...document.querySelectorAll(".more-block:not([open])")];
  printOpened.forEach((d) => { d.open = true; });
});
window.addEventListener("afterprint", () => { printOpened.forEach((d) => { d.open = false; }); printOpened = []; });
$("q-level").addEventListener("change", (e) => {
  const level = e.target.value;
  state.anyLevel = false;
  state.question = null;
  const q = pickQuestion(level);
  openQuestion(q, q.level);
});
$("copy-link").addEventListener("click", copyQuestionLink);
$("print-question").addEventListener("click", printWorksheet);
document.querySelectorAll("[data-export]").forEach((b) => b.addEventListener("click", () => exportAnswers(b.dataset.export)));
$("delete-confirm").addEventListener("input", () => { $("delete-account").disabled = $("delete-confirm").value.trim() !== "DELETE"; });
$("delete-account").addEventListener("click", deleteAccount);
$("create-group-form").addEventListener("submit", createGroup);
$("join-group-form").addEventListener("submit", joinGroup);
window.addEventListener("popstate", handleRoute);
setUpTopics();
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

let refreshedOnce = false;
async function refreshAfterSignIn() {
  await loadUserData();
  applyHomeLevel();
  checkAdmin();
  if (!$("view-question").hidden && state.question) {
    renderTradition();
    openQuestion(state.question, state.level);
  }
  if (!$("view-answers").hidden) renderAnswers();
  if (!$("view-settings").hidden) renderSettings();
  if (!$("view-groups").hidden) renderGroups();
  if (state.user) restoreDraft();
  if (!refreshedOnce) { refreshedOnce = true; handleRoute(); restoreScroll(); }
  renderHomeVerses();
}

$("merge-google").addEventListener("click", mergeGoogleAccount);
$("merge-cancel").addEventListener("click", closeMergeOffer);
$("mfa-remove").addEventListener("click", removeAuthenticator);
$("mfa-signout").addEventListener("click", async () => { $("mfa-dialog").close(); await signOut(); });
$("mfa-dialog").addEventListener("cancel", (e) => e.preventDefault()); // must enter a code or sign out

handleRoute(); // show the right page right away; it's refreshed once we know who's signed in
if (!db) { renderHomeVerses(); restoreScroll(); } // otherwise these run once we know who's signed in

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
