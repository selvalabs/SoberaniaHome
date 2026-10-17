/** Small, progressively enhanced instruments; all content remains native HTML. */
export function initEditionInteractions() {
  const initialise = () => {
    document.querySelectorAll<HTMLElement>('[data-edition-tabs]').forEach(instrument => {
      if (instrument.dataset.enhanced === 'true') return;
      const tabs = Array.from(instrument.querySelectorAll<HTMLAnchorElement>('[data-edition-tab]'));
      const panels = Array.from(instrument.querySelectorAll<HTMLElement>('[data-edition-panel]'));
      const list = instrument.querySelector<HTMLElement>('[data-edition-tablist]');
      if (!tabs.length || !list || panels.length !== tabs.length) return;

      list.setAttribute('role', 'tablist');
      if (list.classList.contains('handover-tabs')) list.setAttribute('aria-orientation', 'vertical');
      tabs.forEach((tab,index) => {
        const panel = panels.find(item => item.dataset.editionPanel === tab.dataset.editionTab)!;
        tab.id = `${panel.id}-tab`;
        tab.setAttribute('role', 'tab');
        tab.setAttribute('aria-controls', panel.id);
        panel.setAttribute('role', 'tabpanel');
        panel.setAttribute('aria-labelledby', tab.id);
        panel.tabIndex = 0;
        tab.addEventListener('click', event => {
          if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
          event.preventDefault();
          activate(index);
        });
        tab.addEventListener('keydown', event => {
          const vertical = list.getAttribute('aria-orientation') === 'vertical';
          const forward = vertical ? 'ArrowDown' : 'ArrowRight';
          const backward = vertical ? 'ArrowUp' : 'ArrowLeft';
          let next = index;
          if (event.key === forward) next = (index + 1) % tabs.length;
          else if (event.key === backward) next = (index + tabs.length - 1) % tabs.length;
          else if (event.key === 'Home') next = 0;
          else if (event.key === 'End') next = tabs.length - 1;
          else if (event.key === ' ') { event.preventDefault(); activate(index); return; }
          else return;
          event.preventDefault();
          activate(next);
          tabs[next].focus({preventScroll:true});
        });
      });

      function activate(index: number) {
        const selected = tabs[index].dataset.editionTab!;
        instrument.dataset.active = selected;
        tabs.forEach(tab => {
          const active = tab.dataset.editionTab === selected;
          tab.setAttribute('aria-selected', String(active));
          tab.tabIndex = active ? 0 : -1;
        });
        panels.forEach(panel => { panel.hidden = panel.dataset.editionPanel !== selected; });
        document.dispatchEvent(new CustomEvent('sl:layout-change'));
      }

      instrument.dataset.enhanced = 'true';
      const hashMatch = panels.findIndex(panel => `#${panel.id}` === location.hash);
      activate(hashMatch >= 0 ? hashMatch : 0);
    });

    const ledger = document.querySelector<HTMLElement>('[data-manifesto-ledger]');
    if (ledger && ledger.dataset.enhanced !== 'true') {
      ledger.dataset.enhanced = 'true';
      const principles = Array.from(ledger.querySelectorAll<HTMLDetailsElement>('details'));
      const number = document.querySelector<HTMLElement>('[data-manifesto-number]');
      principles.forEach(principle => principle.addEventListener('toggle', () => {
        if (principle.open && number) number.textContent = principle.dataset.principleNumber || '01';
        document.dispatchEvent(new CustomEvent('sl:layout-change'));
      }));
    }

    document.querySelectorAll<HTMLDetailsElement>('.field-note-reading').forEach(note => {
      if (note.dataset.enhanced === 'true') return;
      note.dataset.enhanced = 'true';
      note.addEventListener('toggle', () => document.dispatchEvent(new CustomEvent('sl:layout-change')));
    });
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initialise, {once:true});
  else initialise();
}
