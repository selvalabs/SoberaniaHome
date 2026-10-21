import type { InkScene } from '../data/ink-scenes';

export const clampInk = (n: number) => Math.max(0, Math.min(1, Number.isFinite(n) ? n : 0));
export const easeInk = (n: number) => { const p = clampInk(n); return p * p * (3 - 2 * p); };
export const intervalInk = (p: number, start: number, end: number) => clampInk((p - start) / (end - start));

/** Stable noise by index, never by render/frame count. */
export function inkNoise(seed: number, index: number) {
  let x = (seed ^ Math.imul(index + 1, 0x9e3779b9)) >>> 0;
  x = Math.imul(x ^ (x >>> 16), 0x21f0aaad);
  x = Math.imul(x ^ (x >>> 15), 0x735a2d97);
  return ((x ^ (x >>> 15)) >>> 0) / 4294967296;
}

/** Analytic damped spring step. Narrative seconds, independent of wall clock. */
export function inkSpring(seconds: number, frequency = 1.4, damping = .48) {
  if (!Number.isFinite(seconds) || seconds <= 0) return 0;
  const omega = Math.PI * 2 * frequency;
  const zeta = Math.max(.05, Math.min(.95, damping));
  const damped = omega * Math.sqrt(1 - zeta * zeta);
  return 1 - Math.exp(-zeta * omega * seconds) *
    (Math.cos(damped * seconds) + zeta * omega / damped * Math.sin(damped * seconds));
}

function settle(p: number) {
  return inkSpring(p * 2.8) * (1 - easeInk((p - .75) / .25)) + easeInk((p - .75) / .25);
}

export function sampleInkScene(scene: InkScene, raw: number) {
  const p = clampInk(raw);
  const index = scene.stages.findIndex(stage => p < stage.end);
  const stage = index < 0 ? scene.stages.length - 1 : index;
  const phases = scene.stages.map(s => intervalInk(p, s.start, s.end));
  const draw = phases.map(local => intervalInk(local, .02, .72));
  const act = phases.map(local => easeInk(intervalInk(local, .36, .94)));
  const first = phases[0];
  const workEnvelope = Math.sin(Math.PI * first) ** 2;
  const strain = scene.id === 'tempo' ? Math.sin(Math.PI * phases[2]) ** 2 : 0;
  const seedPhase = inkNoise(scene.seed, 0) * .6;
  const decision = scene.id === 'tempo' ? phases[3] : phases[1];
  const final = phases.at(-1) || 0;
  return {
    progress: p, stage, local: phases[stage], phases, draw, act,
    hand: Math.sin(first * Math.PI * 8 + seedPhase) * workEnvelope * 7 + Math.sin(phases[2] * Math.PI * 20) * strain * 4,
    wheel: act[1] * 540 + (scene.id === 'tempo' ? act[2] * 1080 : 0),
    piston: Math.sin(phases[1] * Math.PI * 12) * Math.sin(Math.PI * phases[1]) ** 2 * 9,
    lever: -32 + settle(decision) * 66,
    ropeSag: 20 * (1 - settle(decision)) + 3,
    paper: (1 - settle(final)) * 24,
    wind: Math.sin(p * 17 + seedPhase) * Math.sin(Math.PI * p) ** 2 * 9,
    glow: easeInk(intervalInk(p, .2, .38)) * (1 - easeInk(intervalInk(p, .94, 1)) * .35),
    proposal: scene.id === 'tempo' ? easeInk(intervalInk(p, .60, .78)) : easeInk(intervalInk(p, .32, .66)),
  };
}

/** One-shot particles with seeded curved paths. Completed journeys stay completed. */
export function inkFragment(p: number, seed: number, index: number, proposal = false) {
  const start = proposal ? .70 : .38;
  const end = proposal ? .98 : .60;
  const delay = inkNoise(seed, index) * .26;
  const t = clampInk((intervalInk(p, start, end) - delay) / .70);
  const target = index % 3;
  const x0 = proposal ? 560 : 510, y0 = proposal ? 435 : 150;
  const x1 = proposal ? [650, 805, 940][target] : 825;
  const y1 = proposal ? 535 : 220 - index * 3;
  const bend = (inkNoise(seed + 71, index) - .5) * 70;
  const u = 1 - t;
  return {
    x: u * u * x0 + 2 * u * t * (650 + bend) + t * t * x1,
    y: u * u * y0 + 2 * u * t * (proposal ? 390 - bend : 70 + bend) + t * t * y1,
    rotation: t * (180 + inkNoise(seed + 12, index) * 180),
    opacity: Math.sin(Math.PI * t) ** 2,
  };
}

/** Damped transverse wave on a tether: fixed endpoints, opposing control motion.
 * Activated only after the pen has finished this line, so drawing stays exact. */
export function inkRopeImpulse(p: number, seed: number, branch: number, start = .565) {
  const t = intervalInk(p, start, 1);
  const envelope = Math.sin(Math.PI*t)**2 * Math.exp(-t*3.2);
  const phase = inkNoise(seed,branch)*.7;
  return {
    first: Math.sin(t*22+phase)*envelope*65,
    second: Math.sin(t*22+phase-1.3)*envelope*52,
  };
}

/** Portrait framing follows the argument, rather than shrinking an entire board. */
export function inkCamera(scene: InkScene, p: number) {
  const views: Record<InkScene['id'], number[][]> = {
    tempo: [[35,230,530,370],[295,45,385,400],[650,125,365,430],[430,320,355,310],[490,425,555,260]],
    saberes: [[45,125,950,335],[100,315,850,295],[325,445,445,235]],
    autonomia: [[100,200,710,325],[505,115,410,370],[270,410,660,250]],
  };
  const state = sampleInkScene(scene,p);
  const to = views[scene.id][state.stage], from = views[scene.id][Math.max(0,state.stage-1)];
  const t = easeInk(state.local/.32);
  return from.map((value,i)=>value+(to[i]-value)*t);
}
