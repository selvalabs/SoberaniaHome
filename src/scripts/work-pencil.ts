import { measureInk, drawInk } from './ink-drawing';
const clamp = (value: number) => Math.max(0, Math.min(1, value));

/** A scroll-addressable drawing. No timer, random state or extra leaf clock. */
export function createWorkPencil() {
  const figure = document.querySelector<HTMLElement>('[data-work-sketch]');
  const svg = figure?.querySelector<SVGSVGElement>('svg');
  if (!figure || !svg) return null;
  const pencil = svg.querySelector<SVGGElement>('.sketch-pencil-tip');
  const dust = svg.querySelector<SVGGElement>('.sketch-dust');
  const phases = Array.from(svg.querySelectorAll<SVGGElement>('[data-sketch-phase]')).map(group => {
    return {group, drawing: measureInk(group)};
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
      cursor = drawInk(phase.drawing, p) || cursor;
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
