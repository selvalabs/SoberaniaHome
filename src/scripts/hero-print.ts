import '../styles/hero-print.css';

const clamp = (n: number, max = 1) => Math.max(0, Math.min(max, n));
type PrintOptions = { stage: string; message: string; blocks: string; finishAtBottom?: boolean; keepHeading?: boolean; sidecar?: string };
const heroOptions: PrintOptions = {stage: '.hero-stage', message: '.hero-message', blocks: '.hero-lead,.hero-argument,.hero-method'};

/** One complete paragraph per print pass, with a reading pause between passes. */
export function createHeroPrint(hero: HTMLElement | null, options: PrintOptions = heroOptions) {
  const stage = hero?.querySelector<HTMLElement>(options.stage);
  if (!hero || !stage) return null;
  const message = hero.querySelector<HTMLElement>(options.message);
  const blockGeometry: { top: number; height: number; lines: number }[] = [];
  let messageHeight = 0;
  let natural = {bottom: 0, origin: null as {x:number; y:number} | null};
  let runway = {start:0,end:0,extra:0};
  const blocks = Array.from(hero.querySelectorAll<HTMLElement>(options.blocks));
  const step = .93 / Math.max(1,blocks.length);
  const duration = step - .07;
  const starts = blocks.map((_,index) => .07 + index * step);
  let enabled = false, start = 0, run = 1, anchor = 0;
  let viewport = false, readingRoom = 0;
  let framing: number[] = [];
  function measure(active: boolean, height: number, width: number, mast: number, paceHeight = height) {
    enabled = active;
    hero!.dataset.printPinned = 'false';
    hero!.dataset.printEnabled = 'false';
    hero!.dataset.printViewport = 'false';
    message?.style.removeProperty('height');
    if (message) message.scrollTop = 0;
    const rect = stage!.getBoundingClientRect();
    const messageRect = message!.getBoundingClientRect();
    messageHeight = messageRect.height;
    blockGeometry.length = 0;
    blocks.forEach(block => { const r=block.getBoundingClientRect(); blockGeometry.push({top:r.top-messageRect.top,height:r.height,lines:Math.max(1,Math.round(r.height/(parseFloat(getComputedStyle(block).lineHeight)||parseFloat(getComputedStyle(block.querySelector("p")||block).lineHeight)||24)))}); });
    viewport = active && (options.keepHeading === true || width < 760 || height < 620);
    anchor = mast + (viewport ? 8 : 12);
    const frameHeight = viewport ? Math.max(120, height - anchor - 12) : rect.height;
    const closing = hero!.querySelector<HTMLElement>('.text-actions,.choices-resolution');
    const tail = closing ? closing.getBoundingClientRect().height + parseFloat(getComputedStyle(closing).marginTop) : 0;
    const sidecar = options.sidecar ? hero!.querySelector<HTMLElement>(options.sidecar) : null;
    const sidecarRect = sidecar?.getBoundingClientRect();
    const reserved = sidecar && sidecarRect && sidecarRect.left < messageRect.right - 1
      ? sidecarRect.height + parseFloat(getComputedStyle(sidecar).marginTop) : 0;
    readingRoom = Math.max(48, frameHeight - (messageRect.top - rect.top) - tail - reserved - parseFloat(getComputedStyle(stage!).paddingBottom) - 5);
    hero!.style.setProperty('--print-stage-height', `${frameHeight}px`);
    hero!.style.setProperty('--print-reading-room', `${readingRoom}px`);
    const padding = parseFloat(getComputedStyle(hero!).paddingTop) + parseFloat(getComputedStyle(hero!).paddingBottom);
    // Capture the launch in document space while the stage is unpinned.
    const launchMark = hero!.querySelector<HTMLElement>('#leaf-origin,#cover-origin');
    const launchRect = launchMark?.getBoundingClientRect();
    natural = {
      bottom: hero!.getBoundingClientRect().top + scrollY + frameHeight + padding,
      origin: launchRect ? {x:launchRect.left+launchRect.width/2,y:launchRect.top+scrollY} : null
    };
    // The fixed-heading composition starts at the actual stage edge,
    // including the section's border; it must not settle one pixel later.
    const pinTop = options.keepHeading ? rect.top + scrollY
      : hero!.getBoundingClientRect().top + scrollY + parseFloat(getComputedStyle(hero!).paddingTop);
    start = Math.max(0, pinTop - anchor);
    // Browser toolbars can resize a phone's visible area during a swipe.
    // Reframe the page, but keep the same reading time and scroll progress.
    run = Math.round(Math.max(1800, Math.min(3400, paceHeight * 2.8 * blocks.length/3)));
    const room = height - anchor - 16;
    const travel = Math.max(0, rect.height - room);
    framing = blocks.map(block => {
      const r = block.getBoundingClientRect();
      return clamp(r.top - rect.top - Math.max(12,(room-r.height)/2),travel);
    });
    if (options.finishAtBottom && framing.length) framing[framing.length-1] = travel;
    hero!.dataset.printEnabled = String(active);
    hero!.dataset.printPinned = String(active);
    hero!.dataset.printViewport = String(viewport);
    hero!.dataset.printStart = String(start);
    hero!.dataset.printRun = String(run);
    const sectionTop=hero!.getBoundingClientRect().top+scrollY;
    runway={start:sectionTop,end:sectionTop+frameHeight+padding+(active?run:0),extra:active?run:0};
    hero!.style.height = active ? `${frameHeight + run + padding}px` : '';
    // Restore the reveal before the measurement can be painted or observed.
    render(scrollY);
  }
  function render(y: number) {
    const progress = clamp((y-start)/run);
    let shift = 0, occupied = 0, pressure = 0;
    blocks.forEach((element,index) => {
      // Finish the previous block before the next even starts.
      const p = enabled ? clamp((progress-starts[index])/duration) : 1;
      element.dataset.printProgress = p.toFixed(3);
      if (element.querySelector("a,button")) element.inert = enabled && p < 1;
      const geometry = blockGeometry[index];
      const cursor=p*geometry.lines;
      const fraction=cursor-Math.floor(cursor);
      const advance=clamp((fraction-.12)/.76);
      const printed=p>=1?1:(Math.floor(cursor)+advance*advance*(3-2*advance))/geometry.lines;
      if (p>0 && p<1) pressure=Math.sin(advance*Math.PI);
      if (p > 0) occupied = Math.max(occupied, geometry.top + geometry.height*printed);
      if (p >= 1) element.style.removeProperty('clip-path');
      else if (p <= 0) element.style.clipPath = 'inset(0 0 100% 0)';
      else {
        const edge=printed*100;
        element.style.clipPath=`polygon(0 0,100% 0,100% ${edge}%,74% ${edge+.5}%,42% ${edge-.4}%,16% ${edge+.3}%,0 ${edge}%)`;
      }
      element.style.setProperty('--print-register',`${(1-p)*1.8}px`);
      element.style.setProperty('--print-highlight',`${clamp((p-.55)/.45)*100}%`);
      // Tall compositions stay pinned too; frame each paragraph during the pause.
      const previous=index===0?0:framing[index-1];
      const t=clamp((progress-(starts[index]-.07))/.07);
      shift+=(framing[index]-previous)*t*t*(3-2*t);
    });
    hero!.style.setProperty('--print-pressure',String(enabled?pressure:0));
    if (message) {
      message.style.height = enabled ? `${Math.min(messageHeight,occupied,viewport?readingRoom:Infinity)}px` : '';
      message.scrollTop = viewport ? Math.max(0,occupied-readingRoom) : 0;
    }
    hero!.style.setProperty('--print-anchor',`${anchor-(enabled&&!viewport?shift:0)}px`);
    return progress;
  }
  return { measure, render, naturalGeometry: () => natural, runway: () => runway };
}
