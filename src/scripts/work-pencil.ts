const clamp = (value: number) => Math.max(0, Math.min(1, value));

/** A scroll-addressable drawing. No timer, random state or extra leaf clock. */
export function createWorkPencil() {
  const figure = document.querySelector<HTMLElement>('[data-work-sketch]');
  const svg = figure?.querySelector<SVGSVGElement>('svg');
  if (!figure || !svg) return null;
  const pencil = svg.querySelector<SVGGElement>('.sketch-pencil-tip');
  const dust = svg.querySelector<SVGGElement>('.sketch-dust');
  // A pencil lifts between absolute M commands. Give each pen-down stroke
  // its own dash length so the tip and the appearing ink share one path.
  for (const original of svg.querySelectorAll<SVGPathElement>('[data-pencil]')) {
    const strokes = original.getAttribute('d')?.match(/M[^M]*/g) || [];
    if (strokes.length < 2) continue;
    for (const stroke of strokes) {
      const path = original.cloneNode() as SVGPathElement;
      path.setAttribute('d', stroke);
      original.before(path);
    }
    original.remove();
  }
  const phases = Array.from(svg.querySelectorAll<SVGGElement>('[data-sketch-phase]')).map(group => {
    const paths = Array.from(group.querySelectorAll<SVGPathElement>('[data-pencil]'));
    const lengths = paths.map(path => path.getTotalLength());
    const weights = lengths.map(length => Math.sqrt(length));
    return {group, paths, lengths, weights, total: weights.reduce((sum, value) => sum + value, 0)};
  });
  figure.classList.add('is-drawing');
  let lastSample = -1;
  function render(progress: number, enabled: boolean) {
    const sample = enabled ? progress : 1;
    if (sample === lastSample) return;
    lastSample = sample;
    let cursor: {path: SVGPathElement; length: number; progress: number} | null = null;
    for (const [index, phase] of phases.entries()) {
      const p = enabled ? clamp((progress - .025 - index * .30) / .30) : 1;
      phase.group.style.setProperty('--sketch-label', String(clamp((p - .65) / .35)));
      let used = 0;
      for (const [i, path] of phase.paths.entries()) {
        const local = clamp((p * phase.total - used) / phase.weights[i]);
        used += phase.weights[i];
        path.style.strokeDashoffset = String(1 - local);
        path.style.fillOpacity = String(local);
        if (local > .001 && local < .999) cursor = {path, length: phase.lengths[i], progress: local};
      }
    }
    pencil?.toggleAttribute('hidden', !cursor);
    dust?.toggleAttribute('hidden', !cursor);
    if (cursor) {
      const point = cursor.path.getPointAtLength(cursor.length * cursor.progress);
      pencil?.setAttribute('transform', `translate(${point.x} ${point.y}) rotate(${-35 + Math.sin(progress * 24) * 6})`);
      dust?.setAttribute('transform', `translate(${point.x} ${point.y})`);
    }
    figure!.dataset.sketchProgress = sample.toFixed(3);
  }
  return {render};
}
