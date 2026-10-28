import { clampInk } from './ink-model';

/** Measure pen-down strokes once; keep frame updates limited to drawing attributes. */
export function measureInk(group: SVGGElement, selector = '[data-pencil]') {
  for (const original of group.querySelectorAll<SVGPathElement>(selector)) {
    const strokes = original.getAttribute('d')?.match(/M[^M]*/g) || [];
    if (strokes.length < 2) continue;
    for (const stroke of strokes) {
      const path = original.cloneNode() as SVGPathElement;
      path.setAttribute('d', stroke);
      original.before(path);
    }
    original.remove();
  }
  const paths = Array.from(group.querySelectorAll<SVGPathElement>(selector));
  const lengths = paths.map(path => path.getTotalLength());
  const weights = lengths.map(length => Math.sqrt(Math.max(.01, length)));
  const total = weights.reduce((sum, n) => sum + n, 0);
  return { paths, lengths, weights, total };
}

export function drawInk(measured: ReturnType<typeof measureInk>, progress: number) {
  const p = clampInk(progress);
  let used = 0;
  let cursor: { path: SVGPathElement; length: number; progress: number } | null = null;
  for (const [i, path] of measured.paths.entries()) {
    const local = clampInk((p * measured.total - used) / measured.weights[i]);
    used += measured.weights[i];
    path.style.strokeDashoffset = String(1 - local);
    path.style.fillOpacity = String(local);
    if (local > .001 && local < .999) cursor = { path, length: measured.lengths[i], progress: local };
  }
  return cursor;
}
