// Branch tree (adapted from the original p5 tree). Every branch is always visible.
// The branch you tap is "lit" (black); everything else is grayed out.
// A tapped node with text pops out a small card; nodes with their own page open it.
let root, nodes = [], hovered = null, hoveredOpen = null, W = 800, H = 500, lastH = 0;
let activeSec = null, activeKid = null, cardNode = null;
const Y0 = 78, Y1 = 190, Y2 = 320, GRAY = 175, LINE = 215;

class N {
  constructor(d, level, parent) {
    this.label = d.label; this.page = d.page || null; this.desc = d.desc || null;
    this.link = d.link || null; this.img = d.img || null; this.imgs = d.imgs || null;
    this.level = level; this.parent = parent;
    this.kids = []; this.x = 0; this.y = 0; this.tx = 0; this.ty = 0; this.w = 100; this.side = 1;
    this.showLabel = true; this.init = false;
    nodes.push(this);
    (d.kids || []).forEach(k => this.kids.push(new N(k, level + 1, this)));
  }
  get sec() { let n = this; while (n.parent && n.parent.parent) n = n.parent; return n; }
  get lit() {
    if (this.level <= 1) return this.level === 0 || activeSec === this;
    if (this.level === 2) return activeSec === this.sec;
    return activeKid === this.parent;
  }
  get expanded() { return this === activeSec || this === activeKid; }
  get hasCard() { return !!(this.desc || this.link || this.img || this.imgs); }
  get hasOpen() { return this.expanded && !!this.page && this.kids.length > 0; }
  over(x, y) { return dist(x, y, this.x, this.y) < (W < 560 ? 14 : 18); }
  overOpen(x, y) { return this.hasOpen && x > this.x + 6 && x < this.x + 78 && y > this.y + 2 && y < this.y + 24; }
}

const narrow = () => W < 560;
const fs = () => (narrow() ? 12 : 14);

function layout() {
  W = Math.max(280, document.getElementById('tree').clientWidth);
  root.tx = W / 2; root.ty = Y0; root.w = Math.min(240, W - 20);
  const secs = root.kids, wts = secs.map(s => (s === activeSec ? (narrow() ? 2.6 : 2.8) : 1));
  const sum = wts.reduce((a, b) => a + b, 0);
  let c0 = 0, maxY = Y2;
  secs.forEach((s, i) => {
    const cw = W * wts[i] / sum, m = s.kids.length, slot = cw / m;
    s.tx = c0 + cw / 2; s.ty = Y1; s.w = cw - 6;
    const lit = s === activeSec;
    s.kids.forEach((k, j) => {
      k.tx = c0 + slot * (j + 0.5);
      k.ty = Y2 + (narrow() && lit && j % 2 ? 50 : 0);
      k.w = lit ? (narrow() ? 96 : Math.min(124, slot - 4)) : slot - 4;
      k.showLabel = lit || slot >= Math.max(...k.label.split(/\s+/).map(w => w.length)) * 6.6 + 8;
      const step = (lit && k === activeKid) ? (k.kids.length > 5 ? 68 : 60) : 38;
      k.kids.forEach((c, jj) => {
        c.tx = k.tx; c.ty = k.ty + 100 + jj * step;
        c.side = k.tx < W * 0.6 ? 1 : -1;
        c.w = Math.max(60, Math.min(150, (c.side === 1 ? W - k.tx : k.tx) - 22));
        c.showLabel = k === activeKid;
        maxY = Math.max(maxY, c.ty);
      });
      maxY = Math.max(maxY, k.ty);
    });
    c0 += cw;
  });
  H = maxY + 60;
  nodes.forEach(n => { if (!n.init) { n.x = n.tx; n.y = n.ty; n.init = true; } });
  placeCard();
}

function setup() {
  root = new N(TREE, 0, null);
  const c = createCanvas(Math.max(280, document.getElementById('tree').clientWidth), 500);
  c.parent('tree'); textWrap(WORD);
  layout(); resizeCanvas(W, H);
}
function windowResized() { layout(); resizeCanvas(W, H); }

function draw() {
  if (Math.abs(H - lastH) > 0.5) { resizeCanvas(W, H); lastH = H; }
  background(255); cursor(ARROW);
  nodes.forEach(n => { n.x = lerp(n.x, n.tx, 0.25); n.y = lerp(n.y, n.ty, 0.25); });
  noFill(); strokeWeight(1);
  [false, true].forEach(litPass => nodes.forEach(n => {
    if (!n.parent || n.lit !== litPass) return;
    stroke(litPass ? 0 : LINE);
    const p = n.parent, my = (p.y + n.y) / 2;
    bezier(p.x, p.y, p.x, my, n.x, my, n.x, n.y);
  }));
  hovered = null; hoveredOpen = null;
  for (let i = nodes.length - 1; i >= 0; i--) {
    if (nodes[i].overOpen(mouseX, mouseY)) { hoveredOpen = nodes[i]; break; }
    if (nodes[i].over(mouseX, mouseY)) { hovered = nodes[i]; break; }
  }
  if (hovered || hoveredOpen) cursor(HAND);
  nodes.filter(n => !n.lit).forEach(show);
  nodes.filter(n => n.lit).forEach(show);
  if (hovered && !hovered.showLabel) tip(hovered);
  if (cardNode) placeCard();
}

function labelFor(n) { return n.level === 1 && narrow() ? n.label.split(':')[0] : n.label; }

function show(n) {
  const h = n === hovered, lit = n.lit, size = lit ? fs() : Math.max(10, fs() - 3);
  noStroke();
  fill(h ? 'red' : (n === cardNode ? 'red' : (lit ? (n.expanded ? 60 : 150) : GRAY)));
  ellipse(n.x, n.y, n.level === 0 ? 13 : (lit ? 11 : 8));
  if (n.showLabel) {
    fill(h || n === cardNode ? 'red' : (lit ? 0 : GRAY)); textSize(size); textStyle(lit && n.level < 2 ? BOLD : NORMAL);
    if (n.level === 3) {
      textAlign(n.side === 1 ? LEFT : RIGHT, CENTER);
      text(n.label, n.side === 1 ? n.x + 12 : n.x - 12 - n.w, n.y - 28, n.w, 56);
    } else {
      textAlign(CENTER, BOTTOM);
      text(labelFor(n), n.x - n.w / 2, n.y - 64, n.w, 58);
    }
  }
  if (n.hasOpen) {
    textSize(size - 1); textStyle(NORMAL); textAlign(LEFT, TOP);
    fill(n === hoveredOpen ? 'red' : 110); text('open page ↗', n.x + 8, n.y + 6);
  }
}

function tip(n) {
  textSize(13); textStyle(NORMAL);
  const w = Math.min(180, textWidth(n.label) + 14), x = constrain(n.x - w / 2, 2, W - w - 2);
  noStroke(); fill(255); rect(x, n.y - 38, w, 24, 4);
  fill('red'); textAlign(CENTER, CENTER); text(n.label, x, n.y - 38, w, 24);
}

/* ---------- pop-out card ---------- */
function cardEl() {
  let el = document.getElementById('tree-card');
  if (!el) {
    el = document.createElement('div'); el.id = 'tree-card';
    document.getElementById('tree').appendChild(el);
  }
  return el;
}
function showCard(n) {
  cardNode = n;
  const el = cardEl(); el.innerHTML = '';
  const x = document.createElement('button'); x.className = 'card-x'; x.textContent = '×'; x.setAttribute('aria-label', 'Close');
  x.onclick = hideCard; el.appendChild(x);
  const t = document.createElement('div'); t.className = 'card-title'; t.textContent = n.label; el.appendChild(t);
  if (n.imgs) { const r = document.createElement('div'); r.className = 'card-imgs'; n.imgs.forEach(u => { const i = document.createElement('img'); i.src = u; i.alt = ''; r.appendChild(i); }); el.appendChild(r); }
  if (n.img) { const i = document.createElement('img'); i.src = n.img; i.alt = ''; el.appendChild(i); }
  if (n.desc) { const p = document.createElement('p'); p.textContent = n.desc; el.appendChild(p); }
  if (n.link) { const a = document.createElement('a'); a.href = n.link.url; a.textContent = n.link.label + ' ↗'; a.target = '_blank'; a.rel = 'noopener'; el.appendChild(a); }
  el.style.display = 'block'; placeCard();
}
function hideCard() { cardNode = null; const el = document.getElementById('tree-card'); if (el) el.style.display = 'none'; }
function placeCard() {
  const el = document.getElementById('tree-card'); if (!el || !cardNode) return;
  const w = Math.min(320, W - 12);
  el.style.width = w + 'px';
  el.style.left = constrain(cardNode.x - w / 2, 4, W - w - 4) + 'px';
  el.style.top = (cardNode.y + 16) + 'px';
}

/* ---------- clicks ---------- */
function go(url) { window.location.href = url; }

function activate(n) {
  if (n.level === 1) { activeSec = activeSec === n ? null : n; activeKid = null; }
  else if (n.level === 2) { activeSec = n.sec; activeKid = (n.kids.length && activeKid !== n) ? n : null; }
  else { activeSec = n.sec; activeKid = n.parent; }
  layout();
}

function clickNode(n) {
  if (n.level === 0) return go(n.page);
  if (!n.kids.length && n.page && !n.hasCard) return go(n.page);          // leaf that is just a page
  if (!n.lit) { activate(n); n.hasCard ? showCard(n) : hideCard(); return; }
  if (n.kids.length) { activate(n); n.expanded && n.hasCard ? showCard(n) : hideCard(); return; }
  if (n.hasCard) { cardNode === n ? hideCard() : showCard(n); return; }
  if (n.page) go(n.page);
}

function mouseClicked() {
  if (mouseX < 0 || mouseY < 0 || mouseX > width || mouseY > height) return;
  for (let i = nodes.length - 1; i >= 0; i--) {
    const n = nodes[i];
    if (n.overOpen(mouseX, mouseY)) return go(n.page);
    if (n.over(mouseX, mouseY)) return clickNode(n);
  }
  hideCard();
}
