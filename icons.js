// Seek Like Silver: a small set of line icons (drawn here, no outside library).
// icon("trash") makes an <svg>; iconButton(...) makes an icon-only button with a tooltip;
// any element in the page with data-icon="name" gets that icon added in front of its text.

const ICONS = {
  edit: ["M4 20h4L19 9l-4-4L4 16z", "M13.5 6.5l4 4"],
  trash: ["M4 7h16", "M10 11v6", "M14 11v6", "M6 7l1 13h10l1-13", "M9 7V4h6v3"],
  share: ["M12 3v12", "M7 8l5-5 5 5", "M5 13v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6"],
  link: ["M10 14a4 4 0 0 0 5.66 0l3-3a4 4 0 0 0-5.66-5.66l-1 1", "M14 10a4 4 0 0 0-5.66 0l-3 3a4 4 0 0 0 5.66 5.66l1-1"],
  "link-off": ["M10 14a4 4 0 0 0 5.66 0l3-3a4 4 0 0 0-5.66-5.66l-1 1", "M14 10a4 4 0 0 0-5.66 0l-3 3a4 4 0 0 0 5.66 5.66l1-1", "M3 3l18 18"],
  printer: ["M7 9V3h10v6", "M7 18H5a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2", "M7 14h10v7H7z"],
  download: ["M12 3v12", "M7 10l5 5 5-5", "M4 21h16"],
  x: ["M6 6l12 12", "M18 6L6 18"],
  "arrow-left": ["M19 12H5", "M11 18l-6-6 6-6"],
  "arrow-right": ["M5 12h14", "M13 6l6 6-6 6"],
  check: ["M5 12l5 5L20 7"],
  refresh: ["M20 11a8 8 0 0 0-14.9-3.9L4 8", "M4 3v5h5", "M4 13a8 8 0 0 0 14.9 3.9L20 16", "M20 21v-5h-5"],
  "log-out": ["M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4", "M16 17l5-5-5-5", "M21 12H9"],
  "user-minus": ["M9 3a4 4 0 1 0 0 8a4 4 0 1 0 0-8", "M2 21v-1a6 6 0 0 1 6-6h2a6 6 0 0 1 6 6v1", "M16 11h6"],
  eye: ["M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z", "M12 9a3 3 0 1 0 0 6a3 3 0 1 0 0-6"],
};

const SVG_NS = "http://www.w3.org/2000/svg";

function icon(name) {
  const svg = document.createElementNS(SVG_NS, "svg");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("class", "icon");
  svg.setAttribute("aria-hidden", "true");
  svg.setAttribute("focusable", "false");
  for (const d of ICONS[name] || []) {
    const p = document.createElementNS(SVG_NS, "path");
    p.setAttribute("d", d);
    svg.append(p);
  }
  return svg;
}

// An icon-only button. The label is read out by screen readers and shown as a tooltip.
function iconButton(name, label, onclick, { danger = false } = {}) {
  const b = document.createElement("button");
  b.type = "button";
  b.className = "icon-btn" + (danger ? " icon-danger" : "");
  b.setAttribute("aria-label", label);
  b.dataset.tip = label;
  b.append(icon(name));
  if (onclick) b.addEventListener("click", onclick);
  return b;
}

// Briefly swap a button's icon and tooltip (e.g. to a check mark and "Copied") and then put them back.
function flashIcon(b, name, tip, ms = 1600) {
  const old = { svg: b.querySelector("svg.icon"), tip: b.dataset.tip, label: b.getAttribute("aria-label") };
  if (!old.svg) return;
  clearTimeout(b._flash);
  if (!b._orig) b._orig = old;
  old.svg.replaceWith(icon(name));
  b.dataset.tip = tip;
  b.classList.add("icon-flash");
  b._flash = setTimeout(() => {
    const o = b._orig;
    b.querySelector("svg.icon").replaceWith(o.svg);
    if (o.tip !== undefined) b.dataset.tip = o.tip; else delete b.dataset.tip;
    b.classList.remove("icon-flash");
    b._orig = null;
  }, ms);
}

function hydrateIcons(root = document) {
  root.querySelectorAll("[data-icon]").forEach((el) => {
    if (el.querySelector(":scope > svg.icon")) return;
    if (el.dataset.iconAfter !== undefined) el.append(icon(el.dataset.icon));
    else el.prepend(icon(el.dataset.icon));
  });
}
hydrateIcons();
