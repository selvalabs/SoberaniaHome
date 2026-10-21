import { inkScenes, type InkScene } from '../data/ink-scenes';
import { drawInk, measureInk } from './ink-drawing';
import { clampInk, inkCamera, inkFragment, inkRopeImpulse, sampleInkScene } from './ink-model';

function createIllustration(host: HTMLElement, definition: InkScene) {
  const svg = host.querySelector<SVGSVGElement>('.ink-art')!;
  const phases = Array.from(svg.querySelectorAll<SVGGElement>('[data-ink-phase]')).map(group => ({ group, drawing: measureInk(group) }));
  const pencil = svg.querySelector<SVGGElement>('[data-ink-pencil]')!;
  const dust = svg.querySelector<SVGGElement>('[data-ink-dust]')!;
  const matter = new Map(Array.from(svg.querySelectorAll<SVGGElement>('[data-matter]')).map(el => [el.dataset.matter!, el]));
  const fragments = Array.from(svg.querySelectorAll<SVGRectElement>('[data-fragment]'));
  const threads = Array.from(matter.get('threads')?.querySelectorAll<SVGPathElement>('[data-pencil]') || []);
  const originalThreads = threads.map(path=>path.getAttribute('d')!);
  const tethers = definition.id === 'saberes'
    ? [[197,398,140,491,431,463,512,511],[493,398,473,436,479.33,473.67,512,511],[832,423,893,489,606,454,512,511]]
    : [[303,459,283,552,505,581,570,535],[695,452,676.33,506.67,634.67,534.33,570,535],[570,535,653.33,585,732.33,584.67,807,534]];
  host.dataset.inkReady = 'true';
  let last = '';
  return (progress: number, enabled: boolean) => {
    const portrait = enabled && innerWidth <= 760 && host.hasAttribute('data-ink-scene');
    const key = `${progress.toFixed(6)}:${enabled}:${portrait}`;
    if (last === key) return false;
    last = key;
    const state = sampleInkScene(definition, progress);
    svg.setAttribute('viewBox',portrait ? inkCamera(definition,progress).join(' ') : '0 0 1040 680');
    const transform = (name: string, value: string) => matter.get(name)?.setAttribute('transform', value);
    transform('hand', `translate(0 ${state.hand}) rotate(${state.act[1]*7} 405 310)`);
    transform('wheel', `rotate(${state.wheel} 499 264)`);
    transform('piston', `translate(0 ${state.piston})`);
    transform('clock-hand', `rotate(${state.act[1]*270} 516 145)`);
    transform('lever', `rotate(${state.lever} 560 435)`);
    transform('decision-hand', `rotate(${state.lever} 560 435)`);
    const paperProgress = definition.id === 'autonomia' ? state.act[1] : state.act.at(-1)!;
    transform('paper', `translate(0 ${state.paper*.16}) rotate(${(1-paperProgress)*-4} 625 555)`);
    for(const [i,path] of threads.entries()) {
      const phase = definition.id === 'saberes' ? 1 : 2;
      const start = definition.stages[phase].start + (definition.stages[phase].end-definition.stages[phase].start)*.72;
      const wave = inkRopeImpulse(progress,definition.seed,i,start);
      const [x,y,cx,cy,dx,dy,tx,ty] = tethers[i];
      path.setAttribute('d',state.draw[phase] < 1 ? originalThreads[i] : `M${x} ${y} C${cx} ${cy+wave.first} ${dx} ${dy+wave.second} ${tx} ${ty}`);
    }
    transform('wind', `rotate(${state.wind*1.3} 861 584)`);
    host.style.setProperty('--ink-glow', String(state.glow));
    svg.querySelector<SVGGElement>('[data-history]')?.setAttribute('opacity', String(enabled ? 1-state.proposal*.7 : 1));
    let cursor: ReturnType<typeof drawInk> = null;
    for (const [index, phase] of phases.entries()) {
      cursor = drawInk(phase.drawing, enabled ? state.draw[index] : 1) || cursor;
      for (const label of phase.group.querySelectorAll<SVGGElement>('[data-ink-label]')) {
        const visible = !portrait || index === state.stage;
        label.style.setProperty('--ink-label', String(enabled ? visible ? clampInk((state.phases[index]-.72)/.18) : 0 : 1));
      }
    }
    for (const fragment of fragments) {
      const point = inkFragment(progress, definition.seed, Number(fragment.dataset.fragment), fragment.dataset.route === 'proposal');
      fragment.setAttribute('transform', `translate(${point.x} ${point.y}) rotate(${point.rotation})`);
      fragment.setAttribute('opacity', String(enabled ? point.opacity : 0));
    }
    pencil.toggleAttribute('hidden', !cursor || !enabled);
    dust.toggleAttribute('hidden', !cursor || !enabled);
    if (cursor && enabled) {
      const point = cursor.path.getPointAtLength(cursor.length * cursor.progress);
      const matrix = cursor.path.getCTM(), rootMatrix = svg.getCTM();
      if (matrix && rootMatrix) {
        const root = new DOMPoint(point.x, point.y).matrixTransform(matrix).matrixTransform(rootMatrix.inverse());
        pencil.setAttribute('transform', `translate(${root.x} ${root.y}) rotate(${-35+Math.sin(progress*29)*6})`);
        dust.setAttribute('transform', `translate(${root.x} ${root.y})`);
        // Useful for verifying that the nib stays on the actual transformed stroke.
        host.dataset.tip = `${root.x.toFixed(3)},${root.y.toFixed(3)}`;
      }
    } else delete host.dataset.tip;
    host.dataset.inkProgress = progress.toFixed(6);
    host.dataset.inkStage = String(state.stage);
    return true;
  };
}

/** This isolated notebook owns one native-scroll renderer. The landing's motion
 * engine is disabled on this route; no wheel interception or additional clock. */
export function initInkNotebook() {
  const elements = Array.from(document.querySelectorAll<HTMLElement>('[data-ink-scene]'));
  if (!elements.length) return;
  document.documentElement.dataset.inkNotebookReady = 'true';
  const header = document.querySelector<HTMLElement>('.notebook-mast')!;
  const readingButton = document.querySelector<HTMLButtonElement>('[data-ink-reading]')!;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let reading = false;
  try { reading = localStorage.getItem('sl-ink-reading') === 'true'; } catch { /* Storage optional. */ }
  let enabled = false, raf = 0, layoutPending = true;
  let layoutWidth = innerWidth, layoutHeight = innerHeight;
  const metrics = { frames: 0, drawings: 0, measurements: 0, idle: true };
  const scenes = elements.map(element => {
    const definition = inkScenes.find(scene => scene.id === element.dataset.inkScene)!;
    return {
      element, definition, paint: createIllustration(element, definition), start: 0, run: 1,
      stage: element.querySelector<HTMLElement>('.ink-stage')!,
      copies: Array.from(element.querySelectorAll<HTMLElement>('[data-ink-copy]')),
      buttons: Array.from(element.querySelectorAll<HTMLButtonElement>('[data-ink-step]')),
      slider: element.querySelector<HTMLInputElement>('input[type=range]')!,
      percent: element.querySelector<HTMLOutputElement>('[data-ink-percent]')!,
      context: element.querySelector<HTMLElement>('[data-ink-context]')!,
    };
  });
  const debug = { metrics, ready: false, enabled: false, scenes: [] as {id:string;start:number;run:number;progress:number}[] };
  (window as unknown as { __INK_DEBUG: typeof debug }).__INK_DEBUG = debug;

  function measure() {
    const active = enabled ? scenes.find(scene => scrollY >= scene.start && scrollY <= scene.start+scene.run) : undefined;
    // Browser scroll anchoring may already have moved scrollY after reflow.
    // Preserve the last drawn narrative state rather than that transient offset.
    const oldProgress = active ? clampInk(Number(active.element.dataset.inkProgress)) : 0;
    const wasEnabled = enabled;
    enabled = !reading && !reduced.matches && innerHeight >= 580;
    const top = header.offsetHeight;
    // svh avoids treating the mobile browser toolbar as narrative movement.
    const probe = document.createElement('div');
    probe.style.cssText = 'position:fixed;pointer-events:none;visibility:hidden;height:100svh';
    document.body.append(probe);
    const available = (probe.offsetHeight || innerHeight)-top;
    probe.remove();
    for (const scene of scenes) {
      scene.element.dataset.inkAnimated = String(enabled);
      scene.element.style.setProperty('--ink-height', `${available}px`);
      scene.element.style.setProperty('--ink-run', `${available*scene.definition.stages.length*1.10}px`);
    }
    for (const scene of scenes) {
      scene.start = scene.element.getBoundingClientRect().top+scrollY-top;
      scene.run = Math.max(1, scene.element.offsetHeight-scene.stage.offsetHeight);
      scene.element.dataset.inkStart = String(scene.start);
      scene.element.dataset.inkRun = String(scene.run);
    }
    if (active && enabled && wasEnabled) scrollTo({top:active.start+active.run*oldProgress,behavior:'instant'});
    else if (active && !enabled) scrollTo({top:active.start,behavior:'instant'});
    readingButton.setAttribute('aria-pressed', String(reading));
    readingButton.textContent = reading ? 'Voltar ao movimento' : 'Modo de leitura';
    debug.enabled = enabled;
    layoutWidth = innerWidth;
    layoutHeight = innerHeight;
    debug.metrics.measurements++;
    layoutPending = false;
  }
  function render() {
    raf = 0;
    metrics.frames++;
    if (layoutWidth !== innerWidth || layoutHeight !== innerHeight) layoutPending = true;
    if (layoutPending) measure();
    for (const scene of scenes) {
      const progress = enabled ? clampInk((scrollY-scene.start)/scene.run) : 1;
      if (!scene.paint(progress, enabled)) continue;
      metrics.drawings++;
      const model = sampleInkScene(scene.definition, progress);
      scene.copies.forEach((copy,index) => {
        copy.dataset.current = String(index === model.stage);
        copy.toggleAttribute('aria-hidden', enabled && index !== model.stage);
        if (enabled && index !== model.stage) copy.setAttribute('aria-hidden','true');
      });
      scene.buttons.forEach((button,index) => {
        if (model.stage === index) button.setAttribute('aria-current','step');
        else button.removeAttribute('aria-current');
      });
      scene.element.style.setProperty('--ink-closing-visibility', progress > .94 || !enabled ? 'visible' : 'hidden');
      scene.slider.value = String(Math.round(progress*1000));
      scene.percent.textContent = `${Math.round(progress*100)}%`;
      scene.context.textContent = scene.definition.id === 'tempo' && enabled
        ? model.stage < 3 ? 'Leitura do exemplo histórico · Lenin, 1914' : 'Proposta da Soberania Labs · decisão coletiva'
        : scene.definition.deck;
    }
    debug.scenes = scenes.map(scene => ({id:scene.definition.id,start:scene.start,run:scene.run,progress:Number(scene.element.dataset.inkProgress)}));
    debug.ready = true;
    metrics.idle = true;
  }
  function request() {
    if (raf || document.hidden) return;
    metrics.idle = false;
    raf = requestAnimationFrame(render);
  }
  function layout() { layoutPending = true; request(); }
  for (const scene of scenes) {
    const seek = (progress: number) => {
      if (enabled) scrollTo({top:scene.start+scene.run*clampInk(progress),behavior:'instant'});
    };
    scene.slider.addEventListener('input', () => seek(Number(scene.slider.value)/1000));
    scene.buttons.forEach((button,index) => button.addEventListener('click', () => {
      const stage = scene.definition.stages[index];
      seek(stage.start+(stage.end-stage.start)*.85);
    }));
  }
  readingButton.addEventListener('click', () => {
    reading = !reading;
    try { localStorage.setItem('sl-ink-reading',String(reading)); } catch { /* Storage optional. */ }
    layout();
  });
  document.querySelectorAll<HTMLDetailsElement>('[data-ink-storyboard]').forEach(details => {
    details.addEventListener('toggle', () => {
      if (!details.open || details.dataset.rendered) return;
      const definition = inkScenes.find(scene => scene.id === details.dataset.inkStoryboard)!;
      // Make SVGs measurable before preparing this one-off contact sheet.
      details.dataset.rendered = 'true';
      details.querySelectorAll<HTMLElement>('[data-ink-snapshot]').forEach(host => {
        const paint = createIllustration(host, definition);
        paint(Number(host.dataset.inkSnapshot), true);
        host.querySelectorAll('[data-ink-pencil],[data-ink-dust]').forEach(el => el.setAttribute('hidden',''));
      });
      layout();
    });
  });
  addEventListener('scroll',request,{passive:true});
  addEventListener('resize',layout,{passive:true});
  reduced.addEventListener('change',layout);
  document.addEventListener('sl:themechange',request);
  document.addEventListener('visibilitychange',() => {
    if (document.hidden) { cancelAnimationFrame(raf); raf=0; metrics.idle=true; }
    else request();
  });
  request();
}
