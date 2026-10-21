export interface Guide { phase: number; length: number }
export interface ScheduledGuide extends Guide { start: number; end: number }
const clamp = (p: number) => Math.min(1, Math.max(0, Number.isFinite(p) ? p : 0));
const smooth = (p: number) => { const t = clamp(p); return t*t*(3-2*t); };

export const generatedActs = [
  { start: 0, end: .30, title: 'A matéria', copy: 'Uma base firme. Uma peça a transformar.' },
  { start: .30, end: .49, title: 'A ferramenta', copy: 'O instrumento amplia a força e a precisão do gesto.' },
  { start: .49, end: .90, title: 'A experiência', copy: 'Quem trabalha percebe, ajusta e conduz.' },
  { start: .90, end: 1, title: 'O encontro', copy: 'A ferramenta amplia. A experiência dá direção.' },
];

export function scheduleGeneratedGuides(guides: Guide[]): ScheduledGuide[] {
  const weights = guides.map(guide => Math.pow(guide.length, 1.35));
  const totals = [0,0,0];
  guides.forEach((guide,i) => { totals[guide.phase] += weights[i]; });
  const positions = [0,0,0];
  return guides.map((guide,i) => {
    const act = generatedActs[guide.phase];
    // Leave breathing room between the subjects; no pencil flying across the page.
    const from = act.start+.012, span = act.end-from-.015;
    const start = from+span*positions[guide.phase]/totals[guide.phase];
    positions[guide.phase] += weights[i];
    return {...guide, start, end: from+span*positions[guide.phase]/totals[guide.phase]};
  });
}

export function sampleGeneratedInk(schedule: ScheduledGuide[], value: number) {
  const progress = clamp(value);
  let low = 0, high = schedule.length;
  while (low < high) {
    const middle = (low+high)>>>1;
    if (schedule[middle].end < progress) low=middle+1;
    else high=middle;
  }
  const guide = schedule[low];
  const travel = guide ? clamp((progress-guide.start)/(guide.end-guide.start)) : 1;
  const draw = clamp((travel-.08)/.92);
  const act = Math.max(0,generatedActs.findIndex((stage,i)=>progress < stage.end || i===3));
  const complete = smooth((progress-.91)/.075);
  const glow = Math.sin(Math.PI*smooth((progress-.905)/.095));
  return { progress, index: low, draw, act, complete, glow,
    pencil: !!guide && progress>=guide.start && travel>.08 && travel<.995,
    pressure: Math.sin(Math.PI*draw),
  };
}
