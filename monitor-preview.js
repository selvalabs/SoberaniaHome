/* Open the requested demonstration only when explicitly present in the URL. */
(() => {
  const params = new URLSearchParams(location.search);
  if (params.get('projeto') !== 'monitor' || params.get('vista') !== 'avisos') return;
  const open = () => {
    const deadline = performance.now() + 10000;
    function ready() {
      const button = document.querySelector('.work-monitor .work-page-selector button:last-of-type');
      if (!button || !window.__SL_DEBUG?.ready) {
        if (performance.now() < deadline) requestAnimationFrame(ready);
        return;
      }
      if (document.documentElement.classList.contains('motion')) window.SLMotion.jumpScene('trabalho', 3);
      else button.closest('.work-monitor').scrollIntoView({block:'center',behavior:'instant'});
      requestAnimationFrame(() => requestAnimationFrame(() => button.click()));
    }
    ready();
  };
  if (document.readyState === 'complete') open();
  else window.addEventListener('load', open, {once:true});
})();
