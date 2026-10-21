export interface Guide { phase: number; length: number; gap?: number }
export interface ScheduledGuide extends Guide { start: number; drawStart: number; end: number }
const clamp = (p: number) => Math.min(1, Math.max(0, Number.isFinite(p) ? p : 0));
const smooth = (p: number) => { const t = clamp(p); return t*t*(3-2*t); };

export const generatedPlaybackSeconds = 52;
export const generatedActs = [
  { start: 0, end: .27, title: 'A matéria', copy: 'Uma base firme. Uma peça a transformar.' },
  { start: .27, end: .43, title: 'A ferramenta', copy: 'O instrumento amplia a força e a precisão do gesto.' },
  { start: .43, end: .76, title: 'A experiência', copy: 'Quem trabalha percebe, ajusta e conduz.' },
  { start: .76, end: 1, title: 'O encontro', copy: 'A ferramenta amplia. A experiência dá direção.' },
];

export const generatedHighlights = [
  { name:'grip', x:426, y:405, rx:150, ry:105, at:.775 },
  { name:'contact', x:828, y:467, rx:126, ry:112, at:.815 },
  { name:'support', x:1090, y:570, rx:180, ry:158, at:.855 },
];

export function scheduleGeneratedGuides(guides: Guide[]): ScheduledGuide[] {
  const weights = guides.map(guide => ({draw:Math.pow(guide.length,1.12),lift:Math.min(65,4+(guide.gap||0)*.35)}));
  const totals = [0,0,0];
  guides.forEach((guide,i) => { totals[guide.phase] += weights[i].draw+weights[i].lift; });
  const positions = [0,0,0];
  return guides.map((guide,i) => {
    const act = generatedActs[guide.phase];
    const from = act.start+.009, span = act.end-from-.009;
    const unit = span/totals[guide.phase];
    const start = from+positions[guide.phase]*unit;
    const drawStart = start+weights[i].lift*unit;
    positions[guide.phase] += weights[i].draw+weights[i].lift;
    return {...guide,start,drawStart,end:from+positions[guide.phase]*unit};
  });
}

export function sampleGeneratedInk(schedule: ScheduledGuide[], value: number, highlights = generatedHighlights) {
  const progress = clamp(value);
  let low = 0, high = schedule.length;
  while (low < high) {
    const middle = (low+high)>>>1;
    if (schedule[middle].end < progress) low=middle+1;
    else high=middle;
  }
  const guide = schedule[low];
  const draw = guide ? clamp((progress-guide.drawStart)/(guide.end-guide.drawStart)) : 1;
  const travel = guide ? clamp((progress-guide.start)/(guide.drawStart-guide.start)) : 1;
  const travelling = !!guide && progress>=guide.start && progress<guide.drawStart && low>0
    && guide.phase===schedule[low-1].phase && (guide.gap||0)<160;
  const act = Math.max(0,generatedActs.findIndex((stage,i)=>progress < stage.end || i===3));
  const lights: { index:number; from:number; to:number; strength:number }[] = [];
  for(let i=Math.min(low,schedule.length-1);i>=0 && lights.length<16;i--) {
    const line=schedule[i];
    const age=Math.max(0,progress-line.end);
    if(age>.024)break;
    const to=clamp((progress-line.drawStart)/(line.end-line.drawStart));
    if(!to)continue;
    lights.push({index:i,from:Math.max(0,to-115/line.length),to,strength:1-smooth(age/.024)});
  }
  const keyLights = highlights.map(point=>{
    const enter=smooth((progress-point.at)/.028);
    const pulse=Math.sin(Math.PI*clamp((progress-point.at)/.13))**2;
    return enter*(.38+.36*pulse);
  });
  return { progress,index:low,draw,act,lights,keyLights,
    complete:smooth((progress-.75)/.035),
    pencil:(!!guide && progress>=guide.drawStart && draw<.998) || travelling,
    travelling,travel:smooth(travel),elevation:travelling?Math.sin(Math.PI*travel):0,
    pressure:Math.sin(Math.PI*draw),
  };
}
