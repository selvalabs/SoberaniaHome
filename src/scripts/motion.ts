import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

declare global {
  interface Window {
    SLMotion: any;
    __SL_DEBUG: any;
    gsap: typeof gsap;
    ScrollTrigger: typeof ScrollTrigger;
  }
}

// Utilitários matemáticos para a física da folha
const clamp = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const mix = (a: number, b: number, t: number) => a + (b - a) * t;
const smooth = (t: number) => { t = clamp(t); return t * t * (3 - 2 * t); };
const range = (a: number, b: number, t: number) => smooth((t - a) / (b - a));
const hold = (t: number) => range(0.18, 0.82, t);
const smoother = (t: number) => { t = clamp(t); return t * t * t * (t * (t * 6 - 15) + 10); };
const bell = (a: number, b: number, v: number) => {
  if (v <= a || v >= b) return 0;
  const q = (v - a) / (b - a);
  return Math.sin(q * Math.PI) ** 2;
};
const catmull = (p0: number, p1: number, p2: number, p3: number, t: number) => {
  const t2 = t * t, t3 = t2 * t;
  return 0.5 * ((2 * p1) + (-p0 + p2) * t + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2 + (-p0 + 3 * p1 - 3 * p2 + p3) * t3);
};
const mobile = () => window.innerWidth < 760;

// Waypoints oficiais do Leaf Motion 5.0 (Dança Pendular Contínua & Fluida)
interface LeafKey { p: number; x: number; y: number; s: number; rz: number; rx: number; ry: number; phase: string; }
const leafKeys: LeafKey[] = [
  { p: 0.00, x: 0.58, y: 0.44, s: 0.85, rz: 88, rx: 20, ry: 28, phase: 'origem' },
  { p: 0.09, x: 0.68, y: 0.46, s: 1.15, rz: 58, rx: -10, ry: 36, phase: 'deriva-dir' },
  { p: 0.18, x: 0.32, y: 0.48, s: 1.20, rz: 112, rx: 18, ry: -34, phase: 'danca-esq-1' },
  { p: 0.28, x: 0.68, y: 0.50, s: 0.96, rz: 62, rx: -16, ry: 30, phase: 'danca-dir-2' },
  { p: 0.38, x: 0.30, y: 0.48, s: 0.82, rz: 114, rx: 16, ry: -36, phase: 'danca-esq-3' },
  { p: 0.49, x: 0.70, y: 0.51, s: 1.18, rz: 60, rx: -18, ry: 34, phase: 'trabalho-dir' },
  { p: 0.60, x: 0.28, y: 0.49, s: 0.84, rz: 116, rx: 18, ry: -34, phase: 'processo-esq' },
  { p: 0.70, x: 0.72, y: 0.52, s: 1.15, rz: 58, rx: -16, ry: 32, phase: 'laboratorio-dir' },
  { p: 0.80, x: 0.30, y: 0.53, s: 0.80, rz: 114, rx: 18, ry: -36, phase: 'espiral-esq' },
  { p: 0.89, x: 0.68, y: 0.56, s: 1.12, rz: 62, rx: -12, ry: 28, phase: 'caderno-dir' },
  { p: 0.95, x: 0.40, y: 0.68, s: 0.90, rz: 98, rx: 12, ry: -16, phase: 'descida-final' },
  { p: 1.00, x: 0.54, y: 0.80, s: 0.74, rz: 96, rx: 6, ry: 0, phase: 'pouso' }
];

const leafGusts = [
  { c: 0.12, w: 0.12, amp: 0.14, twist: 8 },
  { c: 0.30, w: 0.14, amp: -0.12, twist: -7 },
  { c: 0.50, w: 0.15, amp: 0.16, twist: 9 },
  { c: 0.72, w: 0.14, amp: -0.13, twist: -8 },
  { c: 0.90, w: 0.11, amp: 0.12, twist: 7 }
];

const tumbleSteps = [
  { a: 0.130, b: 0.210, axis: 'ry', deg: 180 },
  { a: 0.330, b: 0.420, axis: 'rx', deg: -180 },
  { a: 0.570, b: 0.660, axis: 'ry', deg: -180 },
  { a: 0.840, b: 0.910, axis: 'rz', deg: 180 }
];

// O estado e a geometria da janela para projeção exata
let geometry: any = null;
let enabled = true;

const docRect = (el: HTMLElement) => {
  const r = el.getBoundingClientRect();
  return { left: r.left, top: r.top + window.scrollY, width: r.width, height: r.height, right: r.right, bottom: r.bottom + window.scrollY };
};

export function initMotion() {
  const root = document.documentElement;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  enabled = !reduced;

  root.classList.toggle('motion', enabled);
  root.dataset.reading = enabled ? 'false' : 'true';

  // Configurar stages para os holds se não existirem
  const setupStage = (id: string, stageClass: string) => {
    const el = document.getElementById(id);
    if (el && !el.querySelector('.' + stageClass)) {
      const stage = document.createElement('div');
      stage.className = stageClass;
      stage.append(...Array.from(el.childNodes));
      el.append(stage);
      return { el, stage };
    }
    return { el, stage: el?.querySelector('.' + stageClass) as HTMLElement };
  };

  const hero = document.getElementById('hero');
  const choicesData = setupStage('folha', 'choices-stage');
  const technologyData = setupStage('deslocamento-1', 'technology-stage');
  const knowledgeData = setupStage('deslocamento-2', 'knowledge-cover-stage');

  const els = {
    mast: document.getElementById('mast') as HTMLElement,
    flight: document.getElementById('leaf-flight') as HTMLElement,
    depth: document.getElementById('leaf-depth') as HTMLElement,
    leaf: document.getElementById('wind-leaf') as HTMLElement,
    origin: document.getElementById('leaf-origin') as HTMLElement,
    dock: document.getElementById('leaf-dock') as HTMLElement,
    pile: document.getElementById('leaf-pile') as HTMLElement,
    counter: document.getElementById('section-counter') as HTMLElement
  };

  if (!els.flight || !els.leaf) return;

  // Medir layout e definir holds nativos
  function measure() {
    if (!enabled) return;
    const vh = window.innerHeight;
    const vw = document.documentElement.clientWidth;
    const mast = els.mast?.getBoundingClientRect().height || 0;

    const coverHeight = vh;
    const heroViewport = Math.max(1, coverHeight - mast);
    const heroRun = Math.round(clamp(heroViewport * 3.6, 1200, 5000) * 0.9);

    if (hero) {
      hero.style.setProperty('--hero-viewport', heroViewport + 'px');
      hero.style.setProperty('--hero-hold', heroRun + 'px');
      hero.dataset.pin = 'true';
    }
    const heroHold = heroRun;

    const choices = choicesData.el;
    const choicesStage = choicesData.stage;
    if (choices && choicesStage) {
      choices.dataset.pin = 'false';
      choices.style.setProperty('--choices-viewport', heroViewport + 'px');
      choices.style.setProperty('--choices-hold', Math.round(heroViewport * 2.4) + 'px');
      if (heroHold && choicesStage.scrollHeight <= heroViewport + 2) choices.dataset.pin = 'true';
    }

    const technology = technologyData.el;
    const technologyStage = technologyData.stage;
    if (technology && technologyStage) {
      technology.dataset.pin = choices?.dataset.pin === 'true' ? 'true' : 'false';
      technology.style.setProperty('--technology-viewport', heroViewport + 'px');
      technology.style.setProperty('--technology-hold', Math.round(heroViewport * 2.4) + 'px');
      if (technologyStage.scrollHeight > heroViewport + 2) technology.dataset.pin = 'false';
    }

    const knowledge = knowledgeData.el;
    const knowledgeStage = knowledgeData.stage;
    if (knowledge && knowledgeStage) {
      knowledge.dataset.pin = technology?.dataset.pin === 'true' ? 'true' : 'false';
      knowledge.style.setProperty('--knowledge-viewport', heroViewport + 'px');
      knowledge.style.setProperty('--knowledge-hold', Math.round(heroViewport * 2.6) + 'px');
      if (knowledgeStage.scrollHeight > heroViewport + 2) knowledge.dataset.pin = 'false';
    }

    geometry = {
      width: vw, height: vh, mast, heroHold, coverHeight,
      maxScroll: Math.max(0, document.documentElement.scrollHeight - vh),
      origin: els.origin ? docRect(els.origin) : { left: vw*0.35, top: vh*0.35, width: 0, height: 0 },
      dock: els.dock ? docRect(els.dock) : { top: vh*2, left: vw*0.5 },
      pile: els.pile ? docRect(els.pile) : { top: vh*2.5, left: vw*0.5 }
    };

    if (heroHold && els.origin) {
      geometry.origin.top -= Math.min(window.scrollY, heroHold);
    }

    if (choices?.dataset.pin === 'true') {
      const start = docRect(choices).top - mast;
      const run = parseFloat(choices.style.getPropertyValue('--choices-hold') || '0');
      geometry.choices = { start, end: start + run, run, viewport: heroViewport };
    }
    if (technology?.dataset.pin === 'true') {
      const start = docRect(technology).top - mast;
      const run = parseFloat(technology.style.getPropertyValue('--technology-hold') || '0');
      geometry.technology = { start, end: start + run, run, viewport: heroViewport };
    }
    if (knowledge?.dataset.pin === 'true') {
      const start = docRect(knowledge).top - mast;
      const run = parseFloat(knowledge.style.getPropertyValue('--knowledge-hold') || '0');
      geometry.knowledge = { start, end: start + run, run, viewport: heroViewport };
    }
  }

  // Inicializar seções GSAP
  setupEyebrowRainbow();
  setupTextHighlights();
  setupHorizontalTrack('trabalho', '.portfolio-track', '.portfolio-sequence', false);
  setupProcessAssembly();
  setupHorizontalTrack('laboratorio', '.portfolio-track', '.portfolio-sequence', true);
  setupSpiralOrbit();
  setupJournalTrack();
  setupSectionCounter(els.counter);

  // A folha depende das dimensões pós-GSAP pins
  measure();
  window.addEventListener('resize', measure);
  ScrollTrigger.addEventListener('refresh', measure);

  // Motor vanilla de folha
  setupVanillaLeaf(els);
  setupInteractiveLeafDrag(els);

  window.SLMotion = {
    pause: () => ScrollTrigger.getAll().forEach(st => st.disable()),
    resume: () => ScrollTrigger.getAll().forEach(st => st.enable()),
    jumpSection: (id: string) => { const el = document.getElementById(id); if (el) el.scrollIntoView({ behavior: 'smooth' }); },
    setReading: (isReading: boolean) => {
      enabled = !isReading;
      root.classList.toggle('motion', enabled);
      root.dataset.reading = enabled ? 'false' : 'true';
      const switchEl = document.getElementById('reading-switch') as HTMLInputElement | null;
      if (switchEl) switchEl.checked = isReading;
      els.flight.style.display = enabled ? '' : 'none';
      if (!enabled) ScrollTrigger.getAll().forEach(st => st.disable());
      else ScrollTrigger.getAll().forEach(st => st.enable());
    }
  };
}

// ---- FÍSICA VANILLA DA FOLHA (Restaurada) ----

function splineKeyTarget(p: number) {
  let i = 0;
  while (i < leafKeys.length - 2 && p > leafKeys[i + 1].p) i++;
  const p1 = leafKeys[i], p2 = leafKeys[Math.min(leafKeys.length - 1, i + 1)];
  const p0 = leafKeys[Math.max(0, i - 1)], p3 = leafKeys[Math.min(leafKeys.length - 1, i + 2)];
  const u = clamp((p - p1.p) / Math.max(0.0001, p2.p - p1.p));
  const val = (prop: keyof LeafKey) => catmull(p0[prop] as number, p1[prop] as number, p2[prop] as number, p3[prop] as number, u);
  return { x: val('x') * geometry.width, y: val('y') * geometry.height, scale: val('s'), rx: val('rx'), ry: val('ry'), rz: val('rz') };
}

function gustAt(p: number) {
  let gx = 0, twist = 0;
  for (const g of leafGusts) {
    const env = bell(g.c - g.w, g.c + g.w, p);
    gx += g.amp * env; twist += g.twist * env;
  }
  return { gx, twist };
}

function tumbleAt(p: number) {
  const out = { rx: 0, ry: 0, rz: 0 };
  for (const e of tumbleSteps) out[e.axis as keyof typeof out] += e.deg * smoother(range(e.a, e.b, p));
  return out;
}

function releaseTarget(y: number) {
  if (!geometry) return { x: 0, y: 0, scale: 1, rx: 0, ry: 0, rz: 0, releasePx: 0 };
  const { width: w, origin, mast, coverHeight, height: h } = geometry;
  const releasePx = geometry.heroHold || (mobile() ? 270 : h * 3);
  const raw = clamp(y / releasePx);
  const q = smoother(raw);
  let fall = Math.pow(raw, 1.12);
  if (raw > 0.78) {
    const u = (raw - 0.78) / 0.22, u2 = u * u, u3 = u2 * u;
    const start = Math.pow(0.78, 1.12), tangent = 0.22 * 1.12 * Math.pow(0.78, 0.12);
    fall = (2 * u3 - 3 * u2 + 1) * start + (u3 - 2 * u2 + u) * tangent + (-2 * u3 + 3 * u2);
  }
  const endX = w * 0.564, endY = Math.max(origin.top + 3, h - clamp(h * 0.085, 52, 88));
  const broadSway = Math.sin(raw * Math.PI * 3) * w * (mobile() ? 0.12 : 0.11) * (0.72 + raw * 0.28);
  const fineSway = Math.sin(raw * Math.PI * 6) * w * 0.018;
  const floatBob = Math.sin(raw * Math.PI * 3) * h * 0.018 * (1 - raw * 0.28) * (1 - smoother(range(0.78, 1, raw)));
  return {
    x: mix(origin.left, endX, q) + broadSway + fineSway,
    y: y <= 1 ? origin.top + 3 : Math.max(mast + 22, mix(origin.top + 3, endY, fall) + floatBob),
    scale: mix(mobile() ? 0.64 : 0.72, mobile() ? 0.80 : 0.84, q),
    rx: mix(0, 24, q) + Math.sin(raw * Math.PI * 2) * 18,
    ry: mix(-5, 38, q) + Math.sin(raw * Math.PI * 2.3) * 42,
    rz: mix(mobile() ? 128 : 142, 88, q) + Math.sin(raw * Math.PI * 2.15) * 34,
    releasePx
  };
}

function carriedDistance(distance: number, total: number) {
  const d = clamp(distance, 0, total), r = Math.min(total / 3, clamp((geometry.coverHeight || geometry.height) * 0.12, 80, 120));
  const entry = (v: number) => { const u = clamp(v / r); return r * (u * u * u - 0.5 * u * u * u * u); };
  if (d < r) return entry(d);
  if (d > total - r) return total - r - entry(total - d);
  return d - r / 2;
}

function carriedPose(pose: any, distance: number, total: number, toX: number) {
  const p = clamp(distance / total), q = smoother(p);
  const flutter = Math.sin(p * Math.PI * 2) * Math.pow(Math.sin(p * Math.PI), 2);
  return {
    ...pose, x: mix(pose.x, toX, q) + geometry.width * 0.018 * flutter,
    y: pose.y - carriedDistance(distance, total),
    rx: mix(pose.rx, 14, q) + flutter * 8,
    ry: mix(pose.ry, 12, q) + flutter * 16,
    rz: mix(pose.rz, 90, q) + flutter * 22
  };
}

function choicesFall(p: number) {
  const c = geometry.choices, end = releaseTarget(geometry.heroHold);
  const travel = c.start - geometry.heroHold;
  const start = carriedPose(end, travel, travel, geometry.width * 0.18);
  const q = smoother(p), sway = Math.sin(p * Math.PI * 3) * Math.pow(Math.sin(p * Math.PI), 2);
  return {
    ...end, x: mix(start.x, end.x, q) + geometry.width * 0.18 * sway, y: mix(start.y, end.y, q),
    rx: mix(start.rx, 12, q) + Math.sin(p * Math.PI * 4) * 12 * Math.pow(Math.sin(p * Math.PI), 2),
    ry: mix(start.ry, 18, q) + sway * 38, rz: mix(start.rz, 102, q) + sway * 40
  };
}

function chapterTarget(y: number) {
  const c = geometry.choices; if (!c || y <= geometry.heroHold) return null;
  const end = releaseTarget(geometry.heroHold);
  if (y < c.start) return carriedPose(end, y - geometry.heroHold, c.start - geometry.heroHold, geometry.width * 0.18);
  if (y <= c.end) return choicesFall(clamp((y - c.start) / c.run));
  const tech = geometry.technology;
  if (tech) {
    const passage = tech.start - c.end;
    if (y < tech.start) return carriedPose(choicesFall(1), y - c.end, passage, geometry.width * 0.82);
    if (y <= tech.end) return technologyFall(clamp((y - tech.start) / tech.run));
    const k = geometry.knowledge;
    if (k) {
      if (y < k.start) return carriedPose(technologyFall(1), y - tech.end, k.start - tech.end, geometry.width * 0.78);
      if (y <= k.end) return knowledgeFall(clamp((y - k.start) / k.run));
      if (y <= k.end + k.viewport) return carriedPose(knowledgeFall(1), y - k.end, k.viewport, geometry.width * 0.18);
      return null;
    }
    if (y <= tech.end + tech.viewport) return carriedPose(technologyFall(1), y - tech.end, tech.viewport, geometry.width * 0.78);
    return null;
  }
  if (y <= c.end + c.viewport) return carriedPose(choicesFall(1), y - c.end, c.viewport, geometry.width * 0.82);
  return null;
}

function technologyFall(p: number) {
  const c = geometry.choices, tech = geometry.technology, end = releaseTarget(geometry.heroHold);
  const start = carriedPose(choicesFall(1), tech.start - c.end, tech.start - c.end, geometry.width * 0.82);
  const q = smoother(p), sway = Math.sin(p * Math.PI * 3) * Math.pow(Math.sin(p * Math.PI), 2);
  return {
    ...end, x: mix(start.x, geometry.width * 0.24, q) + geometry.width * 0.16 * sway, y: mix(start.y, end.y, q),
    rx: mix(start.rx, 12, q) + sway * 10, ry: mix(start.ry, 18, q) + sway * 32, rz: mix(start.rz, 102, q) + sway * 38
  };
}

function knowledgeFall(p: number) {
  const tech = geometry.technology, k = geometry.knowledge, end = releaseTarget(geometry.heroHold);
  const start = carriedPose(technologyFall(1), k.start - tech.end, k.start - tech.end, geometry.width * 0.78);
  const q = smoother(p), sway = Math.sin(p * Math.PI * 3) * Math.pow(Math.sin(p * Math.PI), 2);
  return {
    ...end, x: mix(start.x, geometry.width * 0.3, q) + geometry.width * 0.16 * sway, y: mix(start.y, end.y, q),
    rx: mix(start.rx, 12, q) + sway * 10, ry: mix(start.ry, 18, q) + sway * 32, rz: mix(start.rz, 102, q) + sway * 38
  };
}

let dragOffset = { x: 0, y: 0 };

function setupVanillaLeaf(els: any) {
  gsap.ticker.add(() => {
    if (!enabled || !geometry) return;
    const y = window.scrollY;
    const release = releaseTarget(y);
    let t: any;
    let depth = 'mid';

    if (y <= release.releasePx) {
      t = release;
    } else {
      const chapter = chapterTarget(y);
      if (chapter) {
        t = chapter;
      } else {
        const { width: w, height: h, dock, mast, maxScroll } = geometry;
        const flightP = clamp((y - release.releasePx) / Math.max(1, maxScroll - release.releasePx));
        const releaseEnd = releaseTarget(release.releasePx);
        t = splineKeyTarget(flightP);

        const tb = tumbleAt(flightP);
        const now = performance.now() * 0.0014;

        // Microflutuação sutil de ar ambiente em repouso
        const idleY = Math.sin(now * 2.0) * 3.2;
        const idleX = Math.cos(now * 1.5) * 2.5;
        const idleRot = Math.sin(now * 1.7) * 2.0;

        t.x += idleX;
        t.y += idleY;
        t.rz += tb.rz + idleRot;
        t.ry += tb.ry;
        t.rx += tb.rx;

        // Transição inicial de descolamento suave do topo
        const takeoffBlend = smoother(range(0, 0.05, flightP));
        if (takeoffBlend < 1) {
          t.x = mix(releaseEnd.x, t.x, takeoffBlend);
          t.y = mix(releaseEnd.y, t.y, takeoffBlend);
          t.scale = mix(releaseEnd.scale, t.scale, takeoffBlend);
          t.rx = mix(releaseEnd.rx, t.rx, takeoffBlend);
          t.ry = mix(releaseEnd.ry, t.ry, takeoffBlend);
          t.rz = mix(releaseEnd.rz, t.rz, takeoffBlend);
        }

        const exitRun = clamp(h * 2.8, 1600, 3000), exitP = clamp((y - release.releasePx) / exitRun);
        if (!geometry.choices && exitP < 1) {
          const before = releaseTarget(release.releasePx - 1);
          const u = clamp(exitP / 0.55), u2 = u * u, u3 = u2 * u, leftX = w * 0.16;
          const tangent = (releaseEnd.x - before.x) * exitRun * 0.55;
          const traverse = (2 * u3 - 3 * u2 + 1) * releaseEnd.x + (u3 - 2 * u2 + u) * tangent + (-2 * u3 + 3 * u2) * leftX;
          const linger = bell(0.55, 0.72, exitP) * Math.sin(range(0.55, 0.72, exitP) * Math.PI * 2) * w * 0.018;
          const bridge = smoother(clamp((exitP - 0.60) / 0.40)), turn = smoother(clamp(exitP / 0.42));
          const flutter = bell(0, 0.72, exitP);
          t.x = mix(traverse + linger, t.x, bridge);
          t.y = mix(releaseEnd.y + Math.sin(exitP * Math.PI * 4) * 3 * flutter, t.y, bridge);
          t.rz = mix(mix(releaseEnd.rz, 90, turn) + Math.sin(turn * Math.PI) * 35 + Math.sin(exitP * Math.PI * 4) * 9 * flutter, t.rz, bridge);
          t.ry = mix(mix(releaseEnd.ry, 12, turn) + Math.sin(turn * Math.PI) * 20, t.ry, bridge);
          t.rx = mix(mix(releaseEnd.rx, 8, turn) + Math.sin(exitP * Math.PI * 4) * 6 * flutter, t.rx, bridge);
          t.scale = mix(releaseEnd.scale, t.scale, bridge);
        }

        if (geometry.choices) {
          const c = geometry.knowledge || geometry.technology || geometry.choices, joinStart = c.end + c.viewport;
          const join = smoother(clamp((y - joinStart) / c.viewport));
          if (join < 1) {
            const pose = carriedPose(geometry.knowledge ? knowledgeFall(1) : geometry.technology ? technologyFall(1) : choicesFall(1), c.viewport, c.viewport, geometry.width * (geometry.knowledge ? 0.18 : geometry.technology ? 0.78 : 0.82));
            for (const key of ['x', 'y', 'scale', 'rx', 'ry', 'rz']) t[key as keyof typeof t] = mix(pose[key as keyof typeof pose], t[key as keyof typeof t], join);
          }
        }

        // Condução elegante nos capítulos de rolagem horizontal (Trabalho e Laboratório)
        for (const s of horizontalScenes) {
          const start = s.getStart();
          const end = s.getEnd();
          const run = Math.max(1, end - start);
          const transition = (h - mast) * 0.45;
          const enter = smoother(clamp((y - (start - transition)) / transition));
          const leave = 1 - smoother(clamp((y - end) / transition));
          const weight = enter * leave;
          if (weight <= 0) continue;

          const progress = clamp((y - start) / run);
          const phase = progress * Math.PI * 2;
          const dir = s.reverse ? -1 : 1;
          const sway = Math.sin(phase);
          const centre = mast + (h - mast) * (0.48 + 0.06 * sway);

          t.y = mix(t.y, centre, weight);
          t.x = mix(t.x, w * (0.5 + dir * (mobile() ? 0.18 : 0.24) * sway), weight);
          t.rz += dir * (180 * smoother(progress) * enter + 32 * sway * weight);
          t.ry += dir * 85 * Math.sin(phase) * weight;
          t.rx += 18 * Math.cos(phase) * weight;
          t.scale *= 1 + (0.18 * Math.sin(phase) * weight);
          depth = 'front';
        }

        // Aproximação final fluida diretamente conectada à geometria do rodapé
        const dockViewportY = geometry.dock.top - y;
        const startBand = mobile() ? 260 : 360;
        const startLanding = dockViewportY < h + startBand;
        let landPhase = 'none', contactAmt = 0, settleAmt = 0;
        
        if (startLanding) {
          const near = clamp((h + startBand - dockViewportY) / (startBand + h * 0.55));
          const approach = smoother(near);
          contactAmt = smoother(range(0.56, 0.84, near));
          settleAmt = smoother(range(0.82, 1, near));
          
          t.x = mix(t.x, geometry.dock.left, approach);
          t.y = mix(t.y, dockViewportY, approach);
          t.scale = mix(t.scale, mobile() ? 0.76 : 0.74, approach);
          t.rx = mix(t.rx, mix(16, 7, contactAmt), approach);
          t.ry = mix(t.ry, 0, approach);
          t.rz = mix(t.rz, mix(110, 96, contactAmt), approach);
          depth = 'front';
          
          if (settleAmt > 0.985) landPhase = 'rest';
          else if (contactAmt > 0.02) landPhase = settleAmt > 0.1 ? 'settle' : 'contact';
          else landPhase = 'approach';
        }

        if (y >= geometry.maxScroll - 1) {
          t.x = geometry.dock.left;
          t.y = dockViewportY;
          t.scale = mobile() ? 0.76 : 0.74;
          t.rx = 7; t.ry = 0; t.rz = 96;
          depth = 'front';
          landPhase = 'rest'; contactAmt = 1; settleAmt = 1;
        }
      }
    }

    // Oclusão geométrica em seções escuras (Processo e Espiral)
    const occlusion = checkOcclusion(y);
    const isOccluded = occlusion.state === 'occluded';
    document.documentElement.dataset.leafOccluded = isOccluded ? '1' : '0';

    if (isOccluded || occlusion.state === 'entering') {
      depth = 'back';
    }

    const leafOpacity = occlusion.state === 'entering'
      ? 1 - occlusion.progress
      : occlusion.state === 'exiting'
      ? occlusion.progress
      : isOccluded ? 0 : 1;

    els.flight.style.opacity = leafOpacity.toFixed(3);
    els.flight.style.visibility = isOccluded ? 'hidden' : 'visible';
    document.documentElement.dataset.leafDepth = depth;

    if (isNaN(t.x) || isNaN(t.y)) {
      console.error('Leaf coordinates became NaN!', t);
    }

    els.flight.style.transform = `translate3d(${t.x + dragOffset.x}px, ${t.y + dragOffset.y}px, 0)`;
    els.depth.style.transform = `translate(-50%, -91%) scale(${t.scale})`;
    els.leaf.style.transform = `perspective(${mobile() ? 610 : 860}px) rotateX(${t.rx}deg) rotateY(${t.ry}deg) rotateZ(${t.rz}deg)`;
    els.leaf.style.filter = `saturate(0.96) contrast(1.03) drop-shadow(0 6px 14px rgba(28,33,26,0.18))`;

    // Renders physical distance highlights
    try {
      renderHighlights(t.x, t.y, y);
    } catch (err) {
      console.error('Highlights error:', err);
    }
  });
}

function checkOcclusion(y: number) {
  if (!geometry) return { state: 'visible', progress: 0 };
  const h = geometry.height;
  const darkSections = ['processo', 'espiral']
    .map(id => document.getElementById(id))
    .filter(Boolean) as HTMLElement[];

  for (const sec of darkSections) {
    const rect = docRect(sec);
    const entryStart = rect.top - h * 0.40;
    const entryEnd = rect.top + h * 0.15;
    const exitStart = rect.bottom - h * 0.35;
    const exitEnd = rect.bottom + h * 0.15;

    if (y < entryStart || y > exitEnd) continue;
    if (y < entryEnd) {
      return { state: 'entering', progress: smoother(range(entryStart, entryEnd, y)) };
    }
    if (y <= exitStart) {
      return { state: 'occluded', progress: 1 };
    }
    return { state: 'exiting', progress: smoother(range(exitStart, exitEnd, y)) };
  }
  return { state: 'visible', progress: 0 };
}

export const sceneProgress: Record<string, number> = {};

function setupInteractiveLeafDrag(els: any) {
  let isDragging = false;
  let startX = 0, startY = 0;

  els.leaf.addEventListener('pointerdown', (e: PointerEvent) => {
    isDragging = true;
    startX = e.clientX - dragOffset.x;
    startY = e.clientY - dragOffset.y;
    els.leaf.setPointerCapture(e.pointerId);
  });

  window.addEventListener('pointermove', (e: PointerEvent) => {
    if (!isDragging) return;
    dragOffset.x = e.clientX - startX;
    dragOffset.y = e.clientY - startY;
  });

  const endDrag = () => {
    if (!isDragging) return;
    isDragging = false;
    gsap.to(dragOffset, { x: 0, y: 0, duration: 1.2, ease: 'elastic.out(1, 0.4)' });
  };

  window.addEventListener('pointerup', endDrag);
  window.addEventListener('pointercancel', endDrag);
}

// ---- EFEITOS GSAP (Mantidos e limpos) ----

function setupEyebrowRainbow() {
  const hero = document.getElementById('hero');
  if (!hero) return;
  const eyebrowGlyphs = gsap.utils.toArray<HTMLElement>('.eyebrow-glyph');
  ScrollTrigger.create({
    trigger: hero, start: 'top top', end: 'bottom top', scrub: true,
    onUpdate: (self) => {
      const p = self.progress;
      eyebrowGlyphs.forEach((glyph, i) => {
        const hue = (185 + p * 790 + i * 19) % 360;
        glyph.style.color = p === 0 ? '' : `hsl(${hue} 90% 23%)`;
        glyph.style.textShadow = p === 0 ? '' : `0 0 1px #fff9e8,0 0 4px hsl(${hue} 100% 60% / .85),0 0 9px hsl(${(hue + 65) % 360} 100% 60% / .55)`;
      });
    }
  });
}

const markSelector = 'strong, em, .technology-note, .knowledge-note, .hero-future';
let highlightElements: HTMLElement[] = [];
let litMarks = new Set<HTMLElement>();

function setupTextHighlights() {
  highlightElements = gsap.utils.toArray<HTMLElement>(markSelector);
}

function renderHighlights(leafX: number, leafY: number, y: number) {
  if (!enabled || !geometry) return;
  const radius = clamp(window.innerHeight * 0.12, 65, 120);
  const nextLit = new Set<HTMLElement>();
  
  highlightElements.forEach((mark, i) => {
    const r = mark.getBoundingClientRect();
    if (r.width === 0 || r.height === 0 || r.bottom < 0 || r.top > window.innerHeight) return;
    
    const centre = (r.top + r.bottom) / 2;
    const dx = Math.max(r.left - leafX, 0, leafX - r.right);
    const lateral = sceneProgress['trabalho'] > 0 || sceneProgress['laboratorio'] > 0;
    const vertical = lateral ? Math.max(r.top - leafY, 0, leafY - r.bottom) : leafY - centre;
    const distance = Math.hypot(vertical, dx * 0.18);
    
    const amount = 1 - smoother(clamp(distance / (lateral ? radius : r.height / 2 + radius)));
    
    if (amount >= 0.001) {
      const hue = (y * 0.43 + i * 47) % 360;
      mark.style.textShadow = `0 0 2px hsl(${hue} 100% 80% / ${amount * 0.95}),0 0 6px hsl(${hue} 100% 60% / ${amount}),0 0 15px hsl(${(hue + 65) % 360} 100% 55% / ${amount * 0.8})`;
      nextLit.add(mark);
    }
  });

  litMarks.forEach(mark => {
    if (!nextLit.has(mark)) mark.style.textShadow = '';
  });
  litMarks = nextLit;
}

function setupSectionCounter(counterEl: HTMLElement | null) {
  const allSections = Array.from(document.querySelectorAll<HTMLElement>('main > .section'));
  allSections.forEach(section => {
    const num = section.dataset.number || '01';
    ScrollTrigger.create({ trigger: section, start: 'top center', end: 'bottom center', onEnter: () => { if(counterEl) counterEl.textContent = `${num.padStart(2, '0')} / 15`; }, onEnterBack: () => { if(counterEl) counterEl.textContent = `${num.padStart(2, '0')} / 15`; } });
  });
}

interface HorizontalSceneInfo {
  id: string;
  reverse: boolean;
  getStart: () => number;
  getEnd: () => number;
}
const horizontalScenes: HorizontalSceneInfo[] = [];

function setupHorizontalTrack(sectionId: string, trackSel: string, seqSel: string, reverse = false) {
  const section = document.getElementById(sectionId);
  const track = section?.querySelector<HTMLElement>(trackSel);
  const seq = section?.querySelector<HTMLElement>(seqSel);
  const cards = section?.querySelectorAll<HTMLElement>('.portfolio-card');
  const progressMeter = section?.querySelector<HTMLElement>('.scene-progress i');
  const counter = section?.querySelector<HTMLElement>('.scene-count');
  const prevBtn = section?.querySelector<HTMLButtonElement>('[data-prev]');
  const nextBtn = section?.querySelector<HTMLButtonElement>('[data-next]');

  if (!section || !track || !seq || !cards || cards.length === 0) return;

  const count = cards.length;

  function renderHorizontal(p: number) {
    const v = p * (count - 1);
    const index = Math.max(0, Math.min(count - 1, Math.round(v)));

    if (progressMeter) progressMeter.style.transform = `scaleX(${p})`;
    if (counter) counter.textContent = `0${index + 1} / 0${count}`;
    if (prevBtn) prevBtn.disabled = index === 0;
    if (nextBtn) nextBtn.disabled = index === count - 1;

    const stageWidth = track!.parentElement?.clientWidth || window.innerWidth;
    const offsets = Array.from(cards!).map(c => c.offsetLeft + c.offsetWidth / 2 - stageWidth / 2);

    const i0 = Math.floor(v);
    const i1 = Math.min(count - 1, i0 + 1);
    const frac = v - i0;

    if (reverse) {
      const revIdx0 = count - 1 - i0;
      const revIdx1 = Math.max(0, count - 2 - i0);
      const revOffset = (offsets[revIdx0] || 0) + ((offsets[revIdx1] || 0) - (offsets[revIdx0] || 0)) * frac;
      track!.style.transform = `translate3d(${-revOffset}px, 0, 0)`;
    } else {
      const targetOffset = (offsets[i0] || 0) + ((offsets[i1] || 0) - (offsets[i0] || 0)) * frac;
      track!.style.transform = `translate3d(${-targetOffset}px, 0, 0)`;
    }

    cards!.forEach((card, i) => {
      const logicalV = reverse ? count - 1 - v : v;
      const dist = Math.abs(i - logicalV);
      card.style.opacity = String(0.64 + 0.36 * (1 - clamp(dist)));
    });
  }

  const tween = ScrollTrigger.create({
    trigger: seq,
    pin: true,
    scrub: true,
    start: () => 'top ' + (geometry?.mast || 64) + 'px',
    end: () => `+=${Math.max(1600, track!.scrollWidth * 1.1)}`,
    invalidateOnRefresh: true,
    onUpdate: (self) => {
      sceneProgress[sectionId] = self.progress;
      renderHorizontal(self.progress);
    }
  });

  prevBtn?.addEventListener('click', () => {
    const currentP = sceneProgress[sectionId] || 0;
    const currentIndex = Math.round(currentP * (count - 1));
    const targetP = clamp((currentIndex - 1) / (count - 1));
    window.scrollTo({ top: tween.start + targetP * (tween.end - tween.start), behavior: 'smooth' });
  });

  nextBtn?.addEventListener('click', () => {
    const currentP = sceneProgress[sectionId] || 0;
    const currentIndex = Math.round(currentP * (count - 1));
    const targetP = clamp((currentIndex + 1) / (count - 1));
    window.scrollTo({ top: tween.start + targetP * (tween.end - tween.start), behavior: 'smooth' });
  });

  horizontalScenes.push({
    id: sectionId,
    reverse,
    getStart: () => tween.start,
    getEnd: () => tween.end
  });

  renderHorizontal(0);
}

// Geometria e montagem do tabuleiro de processo
const processScatter = {
  desktop: [
    [12, 18], // 01 ENTENDER (superior esquerdo)
    [34, 15], // 02 INVESTIGAR (superior centro)
    [56, 19], // 03 PROTOTIPAR (superior direito)
    [13, 58], // 04 CONSTRUIR (inferior esquerdo)
    [35, 63], // 05 TESTAR (inferior centro)
    [57, 59]  // 06 TRANSFERIR (inferior direito)
  ],
  mobile: [
    [16, 12],
    [50, 9],
    [84, 12],
    [16, 32],
    [50, 37],
    [84, 32]
  ]
};
const processOrigins = [[20, 88], [518, 88], [1016, 88], [20, 507], [518, 507], [1016, 507]];
const processCrop = { width: 662, height: 568, left: 82, top: 72, sourceWidth: 1536, sourceHeight: 1024 };

function setupProcessAssembly() {
  const processSection = document.getElementById('processo');
  const seq = processSection?.querySelector<HTMLElement>('.process-sequence');
  const stage = processSection?.querySelector<HTMLElement>('.process-stage');
  const board = processSection?.querySelector<HTMLElement>('.process-board');
  const nodes = processSection?.querySelectorAll<HTMLElement>('.process-node');
  const panels = processSection?.querySelectorAll<HTMLElement>('.process-panel');
  const counter = processSection?.querySelector<HTMLElement>('.scene-count');
  const meter = processSection?.querySelector<HTMLElement>('.scene-progress i');

  if (!processSection || !seq || !stage || !nodes || !panels) return;

  const state = {
    assembled: [false, false, false, false, false, false],
    dragging: -1,
    points: Array(6).fill(null),
    pointerId: null as number | null,
    movedAt: -Infinity
  };

  function renderProcess(p: number) {
    const isMob = mobile();
    const w = stage!.clientWidth || window.innerWidth;
    const h = stage!.clientHeight || (window.innerHeight - 150);
    const scatter = isMob ? processScatter.mobile : processScatter.desktop;
    const basePieceWidth = isMob ? clamp(w * 0.26, 105, 145) : clamp(h * 0.33, 145, 205);
    const pieceWidth = basePieceWidth;
    const scale = pieceWidth / processCrop.width;
    const centreX = isMob ? w * 0.5 : w * 0.34;
    const centreY = isMob ? h * 0.40 : h * 0.50;

    if (board) {
      board.style.width = `${processCrop.sourceWidth * scale}px`;
      board.style.height = `${processCrop.sourceHeight * scale}px`;
      board.style.left = `${centreX}px`;
      board.style.top = `${centreY}px`;
    }

    const currentIndex = Math.min(5, Math.floor(p * 6));
    if (counter) counter.textContent = `0${currentIndex + 1} / 06`;
    if (meter) meter.style.transform = `scaleX(${p})`;

    const builds = Array.from(nodes!).map((_, i) => {
      if (state.assembled[i]) return 1;
      const startP = i * 0.15;
      const endP = Math.min(1, startP + 0.25);
      return clamp((p - startP) / (endP - startP));
    });

    nodes!.forEach((n, i) => {
      const built = builds[i];
      const [originX, originY] = processOrigins[i];
      const target = {
        x: centreX - (processCrop.sourceWidth * scale) / 2 + (originX - processCrop.left + processCrop.width / 2) * scale,
        y: centreY - (processCrop.sourceHeight * scale) / 2 + (originY - processCrop.top + processCrop.height / 2) * scale
      };
      let x = mix((w * scatter[i][0]) / 100, target.x, built);
      let y = mix((h * scatter[i][1]) / 100, target.y, built);

      if (state.dragging === i && state.points[i]) {
        x = state.points[i].x;
        y = state.points[i].y;
      }

      const active = i === currentIndex;
      const tilt = (i % 2 ? 1 : -1) * mix(8, 0, built);
      const pieceScale = mix(active ? 1.04 : 0.97, 1, built);

      n.style.width = `${processCrop.width * scale}px`;
      n.style.height = `${processCrop.height * scale}px`;
      n.style.left = `${(originX - processCrop.left) * scale}px`;
      n.style.top = `${(originY - processCrop.top) * scale}px`;
      n.style.transform = `translate3d(${x - target.x}px, ${y - target.y}px, 0) rotate(${tilt}deg) scale(${pieceScale})`;
      n.style.opacity = String(0.82 + 0.18 * mix(built, active ? 1 : 0.88, 0.4));

      n.classList.toggle('is-assembled', built > 0.96);
      n.classList.toggle('is-active', active);
      n.classList.toggle('is-dragging', state.dragging === i);
    });

    panels!.forEach((panel, i) => {
      const active = i === currentIndex;
      panel.style.opacity = active ? '1' : '0';
      panel.classList.toggle('is-active', active);
    });
  }

  // Interatividade de arrastar e clicar para encaixar peças
  nodes!.forEach((node, i) => {
    node.addEventListener('pointerdown', (e: PointerEvent) => {
      if (e.pointerType !== 'mouse' || window.innerWidth < 760) return;
      e.preventDefault();
      e.stopPropagation();
      const r = stage!.getBoundingClientRect();
      state.dragging = i;
      state.pointerId = e.pointerId;
      state.points[i] = { x: clamp(e.clientX - r.left, 0, r.width), y: clamp(e.clientY - r.top, 0, r.height) };
      node.setPointerCapture?.(e.pointerId);
      renderProcess(sceneProgress['processo'] || 0);
    });

    node.addEventListener('pointermove', (e: PointerEvent) => {
      if (state.dragging !== i || state.pointerId !== e.pointerId) return;
      e.preventDefault();
      const r = stage!.getBoundingClientRect();
      state.points[i] = { x: clamp(e.clientX - r.left, 0, r.width), y: clamp(e.clientY - r.top, 0, r.height) };
      renderProcess(sceneProgress['processo'] || 0);
    });

    const release = (e: PointerEvent) => {
      if (state.dragging !== i || state.pointerId !== e.pointerId) return;
      const r = stage!.getBoundingClientRect();
      const dropped = { x: clamp(e.clientX - r.left, 0, r.width), y: clamp(e.clientY - r.top, 0, r.height) };
      const isMob = mobile();
      const w = stage!.clientWidth || window.innerWidth;
      const h = stage!.clientHeight || (window.innerHeight - 150);
      const pieceWidth = isMob ? clamp(w * 0.26, 105, 145) : clamp(h * 0.33, 145, 205);
      const scale = pieceWidth / processCrop.width;
      const centreX = isMob ? w * 0.5 : w * 0.34;
      const centreY = isMob ? h * 0.40 : h * 0.50;
      const [originX, originY] = processOrigins[i];
      const target = {
        x: centreX - (processCrop.sourceWidth * scale) / 2 + (originX - processCrop.left + processCrop.width / 2) * scale,
        y: centreY - (processCrop.sourceHeight * scale) / 2 + (originY - processCrop.top + processCrop.height / 2) * scale
      };
      state.assembled[i] = Math.hypot(dropped.x - target.x, dropped.y - target.y) < Math.min(w, h) * 0.17;
      state.points[i] = null;
      state.dragging = -1;
      state.pointerId = null;
      state.movedAt = performance.now();
      if (node.hasPointerCapture?.(e.pointerId)) node.releasePointerCapture(e.pointerId);
      renderProcess(sceneProgress['processo'] || 0);
    };

    node.addEventListener('pointerup', release);
    node.addEventListener('pointercancel', release);

    node.addEventListener('click', () => {
      if (window.innerWidth < 760) return;
      if (performance.now() - state.movedAt < 280) return;
      state.assembled[i] = true;
      renderProcess(sceneProgress['processo'] || 0);
    });
  });

  ScrollTrigger.create({
    trigger: seq,
    pin: true,
    scrub: true,
    start: () => 'top ' + (geometry?.mast || 64) + 'px',
    end: '+=2600',
    onUpdate: (self) => {
      sceneProgress['processo'] = self.progress;
      renderProcess(self.progress);
    }
  });

  renderProcess(0);
}

function setupSpiralOrbit() {
  const spiral = document.getElementById('espiral');
  const seq = spiral?.querySelector<HTMLElement>('.spiral-sequence');
  const orbitView = spiral?.querySelector<HTMLElement>('.orbit-view');
  const orbitWords = spiral?.querySelectorAll<HTMLElement>('.orbit-word');
  const captions = spiral?.querySelectorAll<HTMLElement>('.spiral-caption');
  const ringOuter = spiral?.querySelector<HTMLElement>('.ring-outer');
  const ringInner = spiral?.querySelector<HTMLElement>('.ring-inner');
  const counter = spiral?.querySelector<HTMLElement>('.scene-count');
  const meter = spiral?.querySelector<HTMLElement>('.scene-progress i');

  if (!spiral || !seq || !orbitWords) return;

  function renderSpiral(p: number) {
    const isMob = mobile();
    const ow = orbitView ? orbitView.clientWidth : (isMob ? 320 : 600);
    const oh = orbitView ? orbitView.clientHeight : (isMob ? 240 : 400);
    const base = Math.min(ow, oh);
    const twist = p * Math.PI * 4.15;
    const compress = range(0.22, 0.70, p) * (1 - range(0.76, 1, p));
    const radii = [0.43, 0.31, 0.48, 0.37, 0.44, 0.29, 0.47, 0.34, 0.40];

    orbitWords!.forEach((n, i) => {
      const a = (i / orbitWords!.length) * Math.PI * 2 + twist - Math.PI / 2 + (i % 2 ? -0.10 : 0.08);
      const r = base * radii[i % radii.length] * (1 - compress * 0.46);
      const ellipseX = 1 + (i % 3) * 0.07;
      const ellipseY = 0.82 + (i % 2) * 0.11;
      const x = ow * 0.5 + Math.cos(a) * r * ellipseX;
      const y = oh * 0.50 + Math.sin(a) * r * ellipseY;
      n.style.left = `${x}px`;
      n.style.top = `${y}px`;
      n.style.transform = `translate(-50%, -50%) rotate(${Math.sin(a) * 5}deg)`;

      const currentQuadrant = Math.min(3, Math.floor(p * 4));
      const windowStart = (currentQuadrant * 2) % orbitWords!.length;
      const rel = (i - windowStart + orbitWords!.length) % orbitWords!.length;
      const visible = !isMob || rel < 5;
      n.style.opacity = visible ? (rel === 0 ? '1' : '0.58') : '0';
    });

    if (ringOuter) ringOuter.style.transform = `translate(-50%, -50%) rotate(${p * 220}deg)`;
    if (ringInner) ringInner.style.transform = `translate(-50%, -50%) rotate(${-p * 180}deg)`;

    const currentQuadrant = Math.min(3, Math.floor(p * 4));
    if (counter) counter.textContent = `0${currentQuadrant + 1} / 04`;
    if (meter) meter.style.transform = `scaleX(${p})`;

    if (captions) {
      captions.forEach((cap, i) => {
        const d = p * 3 - i;
        const alpha = Math.round(p * 3) === i ? 1 : 0;
        cap.style.opacity = String(alpha);
        cap.style.transform = `translate3d(0, ${-d * 16}px, 0)`;
        cap.style.pointerEvents = alpha === 1 ? 'auto' : 'none';
      });
    }
  }

  ScrollTrigger.create({
    trigger: seq,
    pin: true,
    scrub: true,
    start: () => 'top ' + (geometry?.mast || 64) + 'px',
    end: '+=2000',
    onUpdate: (self) => {
      sceneProgress['espiral'] = self.progress;
      renderSpiral(self.progress);
    }
  });

  renderSpiral(0);
}

function setupJournalTrack() {
  const journal = document.getElementById('caderno');
  const seq = journal?.querySelector<HTMLElement>('.journal-sequence');
  const strip = journal?.querySelector<HTMLElement>('.newspaper-strip');
  const paper = journal?.querySelector<HTMLElement>('.newspaper-window');
  const counter = journal?.querySelector<HTMLElement>('.scene-count');
  const meter = journal?.querySelector<HTMLElement>('.scene-progress i');

  if (!journal || !seq || !strip || !paper) return;

  function renderJournal(p: number) {
    const paperTravel = Math.max(0, strip!.scrollHeight - paper!.clientHeight);
    strip!.style.transform = `translate3d(0, ${-paperTravel * p}px, 0)`;
    if (meter) meter.style.transform = `scaleX(${p})`;
    if (counter) {
      const idx = Math.min(5, Math.floor(p * 6));
      counter.textContent = `0${idx + 1} / 06`;
    }
  }

  ScrollTrigger.create({
    trigger: seq,
    pin: true,
    scrub: true,
    start: () => 'top ' + (geometry?.mast || 64) + 'px',
    end: '+=1800',
    onUpdate: (self) => {
      sceneProgress['caderno'] = self.progress;
      renderJournal(self.progress);
    }
  });

  renderJournal(0);
}



























