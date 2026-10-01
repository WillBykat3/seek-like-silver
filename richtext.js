// Seek Like Silver — formatted answers (bold, italic, underline, colors, highlights, lists, quotes)
//
// Formatted answers are saved as HTML that starts with RICH_MARK. Older answers
// are plain text. People in a group can read each other's shared answers, so
// HTML is NEVER trusted: everything shown or saved is rebuilt from scratch by
// cleanRich() using only the tags and class names allowed below. No attributes,
// links, images, or styles from the input ever reach the page.

const RICH_MARK = "<!--sls:rich-->";

// Colors offered in the editor: value used while editing -> class saved.
const TEXT_COLORS = [
  { name: "Red", value: "#b42318", cls: "c-red" },
  { name: "Blue", value: "#2453a6", cls: "c-blue" },
  { name: "Green", value: "#1f7a4d", cls: "c-green" },
  { name: "Gold", value: "#8a5a00", cls: "c-gold" },
  { name: "Purple", value: "#6b3fa0", cls: "c-purple" }
];
const HIGHLIGHTS = [
  { name: "Yellow", value: "#fff3a3", cls: "hl-yellow" },
  { name: "Green", value: "#d4f5dc", cls: "hl-green" },
  { name: "Blue", value: "#d6e6ff", cls: "hl-blue" },
  { name: "Pink", value: "#ffd9e8", cls: "hl-pink" }
];
const RICH_CLASSES = new Set([...TEXT_COLORS, ...HIGHLIGHTS].map((c) => c.cls));

// Tag in the input -> tag in the output (null = keep the text, drop the tag).
const RICH_TAGS = {
  B: "strong", STRONG: "strong", I: "em", EM: "em", U: "u", S: "s", STRIKE: "s", DEL: "s",
  MARK: "mark", UL: "ul", OL: "ol", LI: "li", BLOCKQUOTE: "blockquote",
  P: "p", DIV: "p", H1: "p", H2: "p", H3: "p", H4: "p", H5: "p", H6: "p",
  BR: "br", SPAN: "span", FONT: "span"
};
const DROP_ENTIRELY = new Set(["SCRIPT", "STYLE", "TEMPLATE", "IFRAME", "OBJECT", "EMBED", "SVG", "MATH", "NOSCRIPT", "TITLE", "HEAD", "META", "LINK", "TEXTAREA", "SELECT", "BUTTON", "INPUT"]);

const isRich = (answer) => typeof answer === "string" && answer.startsWith(RICH_MARK);

function rgbKey(color) {
  if (!color) return "";
  const c = String(color).trim().toLowerCase();
  let m = c.match(/^#([0-9a-f]{6})$/);
  if (m) return [0, 2, 4].map((i) => parseInt(m[1].slice(i, i + 2), 16)).join(",");
  m = c.match(/^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+)\s*)?\)$/);
  if (m && (m[4] === undefined || Number(m[4]) > 0)) return [m[1], m[2], m[3]].join(",");
  return "";
}
const COLOR_BY_RGB = new Map(TEXT_COLORS.map((c) => [rgbKey(c.value), c.cls]));
const HL_BY_RGB = new Map(HIGHLIGHTS.map((c) => [rgbKey(c.value), c.cls]));

// Which allowed classes an input element carries (from class names or from the
// colors the browser's editing commands produce).
function richClassesOf(el) {
  const out = [];
  for (const c of (el.getAttribute("class") || "").split(/\s+/)) if (RICH_CLASSES.has(c)) out.push(c);
  const color = el.style ? el.style.color : "";
  const bg = el.style ? (el.style.backgroundColor || el.style.background) : "";
  const fontColor = el.tagName === "FONT" ? el.getAttribute("color") : "";
  const fg = COLOR_BY_RGB.get(rgbKey(color)) || COLOR_BY_RGB.get(rgbKey(fontColor));
  const hl = HL_BY_RGB.get(rgbKey(bg));
  if (fg) out.push(fg);
  if (hl) out.push(hl);
  // Keep at most one text color and one highlight.
  const firstColor = out.find((c) => c.startsWith("c-"));
  const firstHl = out.find((c) => c.startsWith("hl-"));
  return [firstColor, firstHl].filter(Boolean);
}

// Rebuild untrusted HTML as a safe DocumentFragment.
function cleanRich(html) {
  const doc = new DOMParser().parseFromString("<body>" + String(html) + "</body>", "text/html"); // inert: nothing runs
  const frag = document.createDocumentFragment();
  const walk = (from, to, depth) => {
    for (const node of from.childNodes) {
      if (node.nodeType === 3) { to.append(document.createTextNode(node.data)); continue; }
      if (node.nodeType !== 1) continue; // comments etc.
      if (DROP_ENTIRELY.has(node.tagName) || depth > 20) continue;
      const tag = RICH_TAGS[node.tagName];
      if (tag === "br") { to.append(document.createElement("br")); continue; }
      if (!tag) { walk(node, to, depth + 1); continue; } // unknown tag: keep its text
      let out = document.createElement(tag);
      if (tag === "span" || tag === "mark") {
        const classes = richClassesOf(node);
        if (tag === "mark" && !classes.some((c) => c.startsWith("hl-"))) classes.push("hl-yellow");
        if (!classes.length) { walk(node, to, depth + 1); continue; } // plain span: unwrap
        out = document.createElement("span");
        out.className = classes.join(" ");
      }
      // Bold/italic/underline the browser may express as styles on a span.
      if (node.style) {
        if (/^(bold|[6-9]00)$/.test(node.style.fontWeight)) { const s = document.createElement("strong"); out.append(s); walk(node, s, depth + 1); to.append(out); continue; }
      }
      walk(node, out, depth + 1);
      if (tag === "li" || out.childNodes.length || tag === "p") to.append(out);
    }
  };
  walk(doc.body, frag, 0);
  return frag;
}

// Saved answer -> safe content for the page.
function answerContent(answer) {
  if (!isRich(answer)) return document.createTextNode(answer || "");
  return cleanRich(answer.slice(RICH_MARK.length));
}

// Saved answer -> plain text (for downloads and length checks).
function answerPlainText(answer) {
  if (!isRich(answer)) return answer || "";
  const box = document.createElement("div");
  box.append(cleanRich(answer.slice(RICH_MARK.length)));
  const lines = [];
  let line = "";
  const flush = () => { lines.push(line); line = ""; };
  const walk = (n, listType, index) => {
    for (const c of n.childNodes) {
      if (c.nodeType === 3) { line += c.data; continue; }
      const t = c.tagName;
      if (t === "BR") { flush(); continue; }
      if (t === "LI") {
        if (line) flush();
        line += listType === "OL" ? (++index.n) + ". " : "• ";
        walk(c, listType, index); flush(); continue;
      }
      if (t === "UL" || t === "OL") { if (line) flush(); walk(c, t, { n: 0 }); continue; }
      if (t === "P" || t === "BLOCKQUOTE") {
        if (line) flush();
        if (t === "BLOCKQUOTE") line += "> ";
        walk(c, listType, index); flush(); continue;
      }
      walk(c, listType, index);
    }
  };
  walk(box, null, { n: 0 });
  if (line) flush();
  return lines.join("\n").replace(/\u00a0/g, " ").replace(/\n{3,}/g, "\n\n").trim();
}

// ─────────────────────────── The editor ───────────────────────────

function createRichEditor({ editor, toolbar, grip, onChange }) {
  const exec = (cmd, value) => {
    editor.focus();
    try { document.execCommand("styleWithCSS", false, cmd === "hiliteColor"); } catch (_) { /* ignore */ }
    document.execCommand(cmd, false, value);
    updateToolbar();
    if (onChange) onChange();
  };

  const isEmpty = () => !editor.textContent.trim() && !editor.querySelector("li");

  // Toolbar buttons keep the text selection (mousedown would otherwise steal it).
  toolbar.addEventListener("mousedown", (e) => { if (e.target.closest("button")) e.preventDefault(); });
  toolbar.addEventListener("click", (e) => {
    const b = e.target.closest("button");
    if (!b) return;
    if (b.dataset.menu) return toggleMenu(b);
    closeMenus();
    if (b.dataset.cmd) exec(b.dataset.cmd, b.dataset.value);
    if (b.dataset.color !== undefined) exec("foreColor", b.dataset.color || getComputedStyle(editor).color);
    if (b.dataset.highlight !== undefined) exec("hiliteColor", b.dataset.highlight || "transparent");
  });

  function toggleMenu(b) {
    const menu = document.getElementById(b.dataset.menu);
    const open = menu.hidden;
    closeMenus();
    menu.hidden = !open;
    b.setAttribute("aria-expanded", String(open));
  }
  function closeMenus() {
    toolbar.querySelectorAll(".rt-menu").forEach((m) => { m.hidden = true; });
    toolbar.querySelectorAll("[data-menu]").forEach((b) => b.setAttribute("aria-expanded", "false"));
  }
  document.addEventListener("click", (e) => { if (!toolbar.contains(e.target)) closeMenus(); });
  toolbar.addEventListener("keydown", (e) => { if (e.key === "Escape") { closeMenus(); editor.focus(); } });

  function updateToolbar() {
    for (const b of toolbar.querySelectorAll("[data-state]")) {
      let on = false;
      try { on = document.queryCommandState(b.dataset.state); } catch (_) { /* ignore */ }
      b.setAttribute("aria-pressed", String(!!on && editor.contains(document.getSelection().anchorNode)));
    }
  }
  document.addEventListener("selectionchange", () => { if (editor.contains(document.getSelection().anchorNode)) updateToolbar(); });

  // Pasting and dropping bring in plain text only, so nothing odd sneaks in.
  const insertPlain = (text) => document.execCommand("insertText", false, text.replace(/\r\n?/g, "\n"));
  editor.addEventListener("paste", (e) => {
    e.preventDefault();
    insertPlain((e.clipboardData || window.clipboardData).getData("text/plain") || "");
  });
  editor.addEventListener("drop", (e) => {
    e.preventDefault();
    const text = e.dataTransfer && e.dataTransfer.getData("text/plain");
    if (text) insertPlain(text);
  });
  editor.addEventListener("input", () => {
    editor.classList.toggle("is-empty", isEmpty());
    if (onChange) onChange();
  });

  // Resize by dragging the grip (works with mouse, finger, or arrow keys).
  const HEIGHT_KEY = "sls-editor-height";
  const setHeight = (h) => {
    const height = Math.max(140, Math.min(1200, Math.round(h)));
    editor.style.height = height + "px";
    grip.setAttribute("aria-valuenow", String(height));
    try { localStorage.setItem(HEIGHT_KEY, String(height)); } catch (_) { /* ignore */ }
  };
  try { const saved = Number(localStorage.getItem(HEIGHT_KEY)); if (saved) setHeight(saved); } catch (_) { /* ignore */ }
  grip.addEventListener("pointerdown", (e) => {
    e.preventDefault();
    grip.setPointerCapture(e.pointerId);
    const startY = e.clientY;
    const startH = editor.getBoundingClientRect().height;
    grip.classList.add("dragging");
    const move = (ev) => setHeight(startH + ev.clientY - startY);
    const up = () => {
      grip.classList.remove("dragging");
      grip.removeEventListener("pointermove", move);
      grip.removeEventListener("pointerup", up);
      grip.removeEventListener("pointercancel", up);
    };
    grip.addEventListener("pointermove", move);
    grip.addEventListener("pointerup", up);
    grip.addEventListener("pointercancel", up);
  });
  grip.addEventListener("keydown", (e) => {
    const h = editor.getBoundingClientRect().height;
    if (e.key === "ArrowDown") { e.preventDefault(); setHeight(h + 40); }
    if (e.key === "ArrowUp") { e.preventDefault(); setHeight(h - 40); }
  });

  return {
    // Saved value: plain text when there's no formatting, otherwise RICH_MARK + clean HTML.
    getValue() {
      if (isEmpty()) return "";
      const box = document.createElement("div");
      box.append(cleanRich(editor.innerHTML));
      const plain = editor.innerText.replace(/ /g, " ").trim();
      const hasFormatting = !!box.querySelector("strong, em, u, s, span, ul, ol, blockquote");
      return hasFormatting ? RICH_MARK + box.innerHTML : plain;
    },
    setValue(answer) {
      editor.replaceChildren();
      if (isRich(answer)) editor.append(answerContent(answer));
      else if (answer) {
        answer.split("\n").forEach((lineText, i) => { if (i) editor.append(document.createElement("br")); editor.append(lineText); });
      }
      editor.classList.toggle("is-empty", isEmpty());
      updateToolbar();
    },
    clear() { this.setValue(""); },
    focus() { editor.focus(); },
    isEmpty
  };
}
