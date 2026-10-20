const clamp = (n: number) => Math.max(0, Math.min(1, n));
const ease = (n: number) => { const p = clamp(n); return p * p * (3 - 2 * p); };

/** One bounded animation clock for scroll and explicit choices; sleeps when settled. */
export function initVisualStories() {
 const init = () => {
  const elements = [...document.querySelectorAll<HTMLElement>('[data-visual-story]:not([data-enhanced])')];
  if (!elements.length) return;
  document.documentElement.classList.add('narrative-43');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const isStatic = () => reduced.matches || document.documentElement.dataset.reading === 'true';
  const knowledge = document.querySelector<HTMLElement>('[data-knowledge-assembly]');
  const scenes = elements.map(el => ({
   el, kind: el.dataset.visualStory,
   frame: el.querySelector<HTMLElement>('.story-frame')!,
   kit: el.querySelector<HTMLElement>('.handover-kit'),
   pieces: [...el.querySelectorAll<HTMLElement>('[data-delivery-piece]')],
   tickets: [...el.querySelectorAll<HTMLElement>('[data-time-ticket]')],
   captions: [...el.querySelectorAll<HTMLElement>('[data-story-caption]')],
   buttons: [...el.querySelectorAll<HTMLButtonElement>('[data-story-go]')],
   checks: [...el.querySelectorAll<HTMLElement>('[data-migration-check]')],
   manual: null as number | null, current: null as number | null,
   visible: true, travel: 0, anchor: 12, kitWidth: 0, cardHeight: 144,
   error: false, shared: true,
  }));
  let raf = 0, previous = 0, measurePending = true, resumeOnScroll = false;
  const request = () => { if (!raf && !document.hidden) raf = requestAnimationFrame(render); };
  function measure() {
   let changed = false;
   for (const s of scenes) {
    const height = Math.ceil(s.frame.getBoundingClientRect().height);
    const anchor = innerWidth < 760 ? 12 : 80;
    const travel = !isStatic() && height + anchor + 20 < innerHeight ? Math.round(innerHeight * (innerWidth < 760 ? .6 : .85)) : 0;
    const value = `${height}px`;
    if (s.el.style.getPropertyValue('--story-frame-h') !== value || s.travel !== travel) changed = true;
    s.travel = travel; s.anchor = anchor;
    s.el.style.setProperty('--story-frame-h', value);
    s.el.style.setProperty('--story-travel', `${travel}px`);
    s.el.style.setProperty('--story-top', `${travel ? anchor : 0}px`);
    s.el.dataset.storyPinned = String(travel > 0);
    const instruction = s.el.querySelector<HTMLElement>('.story-instruction');
    if (instruction) instruction.textContent = travel ? 'Role ou escolha um ato' : 'Explore os três atos';
    s.kitWidth = s.kit?.clientWidth ?? 0;
    s.cardHeight = s.pieces[0]?.offsetHeight ?? 144;
   }
   if (changed) document.dispatchEvent(new CustomEvent('sl:layout-change'));
   measurePending = false;
  }
  function render(now = performance.now()) {
   raf = 0;
   const staticMode = isStatic();
   const dt = Math.min(64, Math.max(1, now - (previous || now - 16)));
   previous = now;
   if (measurePending) measure();
   let unsettled = false;
   if (knowledge) {
    const box = knowledge.getBoundingClientRect();
    if (box.bottom > 0 && box.top < innerHeight) knowledge.style.setProperty('--assembly', String(staticMode ? 1 : ease((innerHeight - box.top) / (innerHeight + box.height * .2))));
   }
   for (const s of scenes) {
    if (!s.visible && !staticMode) continue;
    const box = s.el.getBoundingClientRect();
    const scroll = s.travel ? (s.anchor - box.top) / s.travel : (innerHeight * .8 - box.top) / (innerHeight * .65);
    const target = staticMode ? (s.manual ?? 1) : (s.manual ?? clamp(scroll));
    const prior = s.current ?? target;
    const p = staticMode || Math.abs(prior - target) < .0008 ? target : prior + (target - prior) * (1 - Math.exp(-dt / 100));
    s.current = p;
    if (p !== target) unsettled = true;
    const step = Math.min(2, Math.floor(p * 3));
    s.el.dataset.storyStatic = String(staticMode);
    s.el.dataset.storyStep = String(step);
    s.el.style.setProperty('--story-progress', String(p));
    s.captions.forEach((caption, i) => caption.hidden = !staticMode && i !== step);
    s.buttons.forEach((button, i) => {
     button.setAttribute('aria-pressed', String(i === step));
     button.style.setProperty('--act-progress', String(clamp(p * 3 - i)));
    });
    if (s.kind === 'time') {
     const gather = ease((p - .1) / .34), share = ease((p - .48) / .42);
     s.el.style.setProperty('--gather', String(gather));
     s.el.style.setProperty('--share', String(share));
     s.tickets.forEach((ticket, i) => {
      const g = ease((p - .1 - i * .035) / .28);
      const pitch = innerWidth < 760 ? 58 : 68;
      ticket.style.transform = `translate(${g * (innerWidth < 760 ? innerWidth * .2 : 0)}px,${i * pitch * (1 - g) + (innerWidth < 760 ? 85 * g : 0)}px) rotate(${(i - 1) * 3 * (1 - g)}deg) scale(${1 - g * .3})`;
      ticket.style.opacity = String(1 - g);
     });
    } else if (s.kind === 'handover') {
     const unpack = ease((p - .12) / .34), deliver = ease((p - .6) / .33);
     s.el.style.setProperty('--unpack', String(unpack));
     s.el.style.setProperty('--deliver', String(deliver));
     s.pieces.forEach((piece, i) => {
      const x = s.kitWidth * (.5 + (i % 2 ? .255 : -.255) * unpack);
      const centerY = s.cardHeight + 10;
      const destinationY = s.cardHeight / 2 + Math.floor(i / 2) * (s.cardHeight + 12);
      const y = centerY + (destinationY - centerY) * unpack - deliver * 6;
      piece.style.left = `${x}px`; piece.style.top = `${y}px`;
      piece.style.transform = `translate(-50%,-50%) rotate(${(i - 1.5) * 7 * (1 - unpack)}deg)`;
      piece.style.opacity = String(unpack);
     });
    } else {
     let journey = p < .36 ? ease(p / .36) * .5 : p < .68 ? .5 : .5 + ease((p - .68) / .32) * .5;
     if (s.error) journey = Math.min(.5, journey);
     const check = s.error ? 0 : ease((p - .7) / .28);
     s.el.style.setProperty('--journey', String(journey));
     s.el.style.setProperty('--check', String(check));
     s.checks.forEach((el, i) => el.dataset.checked = String(p > .4 + i * .08 && (!s.error || i === 0)));
     const status = s.el.querySelector<HTMLElement>('[data-route-status]');
     if (status) status.textContent = s.error ? 'Aguardando revisão' : p > .98 ? 'Em operação' : p > .38 ? 'Em conferência' : 'Preparado';
    }
   }
   if (unsettled) request();
  }
  const observer = new IntersectionObserver(entries => {
   for (const entry of entries) { const s = scenes.find(s => s.el === entry.target); if (s) s.visible = entry.isIntersecting; }
   request();
  }, { rootMargin: '200px' });
  const resize = new ResizeObserver(() => { measurePending = true; request(); });
  for (const s of scenes) {
   s.el.dataset.enhanced = 'true'; s.el.dataset.storyStatic = String(isStatic());
   s.buttons.forEach((button, i) => button.addEventListener('click', () => { s.manual = [.08, .5, 1][i]; request(); }));
   s.el.querySelectorAll<HTMLButtonElement>('[data-distribution]').forEach(button => button.addEventListener('click', () => {
    s.shared = button.dataset.distribution === 'shared';
    s.el.dataset.timeDistribution = s.shared ? 'shared' : 'quota';
    s.el.querySelectorAll<HTMLButtonElement>('[data-distribution]').forEach(b => b.setAttribute('aria-pressed', String(b === button)));
    s.el.querySelector<HTMLElement>('.distribution-result')!.textContent = s.shared ? 'A equipe participa do benefício.' : 'A produção cresce. O descanso não chega.';
    s.manual = 1; request();
   }));
   s.el.querySelector<HTMLButtonElement>('[data-route-test]')?.addEventListener('click', event => {
    s.error = !s.error; s.el.dataset.routeError = String(s.error);
    const button = event.currentTarget as HTMLButtonElement;
    button.setAttribute('aria-pressed', String(s.error));
    button.textContent = s.error ? 'Corrigir e conferir novamente ↗' : 'E se a conferência falhar? ↗';
    s.el.querySelector<HTMLElement>('.route-test-result')!.textContent = s.error ? 'A troca é interrompida. A origem mantém a operação.' : 'Conferência refeita. O destino pode assumir.';
    s.manual = s.error ? .5 : 1; request();
   });
   observer.observe(s.el); resize.observe(s.frame);
  }
  for (const type of ['wheel', 'touchmove']) addEventListener(type, () => { resumeOnScroll = true; }, { passive: true });
  addEventListener('keydown', event => { if (['PageDown','PageUp','ArrowDown','ArrowUp','Home','End',' '].includes(event.key) && !(event.target as HTMLElement)?.closest('button,input,select,textarea,summary,[role="slider"]')) resumeOnScroll = true; });
  addEventListener('scroll', () => { if (resumeOnScroll) { scenes.forEach(s => s.manual = null); resumeOnScroll = false; } request(); }, { passive: true });
  const relayout = () => { measurePending = true; request(); };
  addEventListener('resize', relayout, { passive: true });
  reduced.addEventListener('change', relayout);
  new MutationObserver(relayout).observe(document.documentElement, { attributes: true, attributeFilter: ['data-reading'] });
  document.addEventListener('visibilitychange', () => { if (document.hidden && raf) { cancelAnimationFrame(raf); raf = 0; } else { previous = 0; request(); } });
  document.querySelectorAll<HTMLDetailsElement>('details.narrative-detail').forEach(detail => detail.addEventListener('toggle', () => document.dispatchEvent(new CustomEvent('sl:layout-change'))));
  render();
 };
 if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true }); else init();
}
