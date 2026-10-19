/* Native navigation, history and the complete reference map. */
(() => {
  'use strict';
  const index = document.getElementById('index-dialog');
  const dialog = document.getElementById('content-dialog');
  if (!index || !dialog) return;
  const title = document.getElementById('dialog-title');
  const content = document.getElementById('dialog-content');
  const kicker = document.getElementById('dialog-kicker');
  const escape = value => String(value).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  let groups = [];
  try {
    const parsed=JSON.parse(document.getElementById('reference-data')?.textContent || '[]');
    groups=parsed.filter(group=>typeof group.field==='string'&&Array.isArray(group.people)).map(group=>({title:group.field,names:group.people.filter(name=>typeof name==='string')}));
  } catch { /* The readable reference library remains available in the page. */ }
  let locked=null;
  let restorationFrame=0, pendingRestoration=null;

  function jump(id) {
    const element=document.getElementById(id);if(!element)return;
    if(window.SLMotion)window.SLMotion.jumpSection(id);
    else element.scrollIntoView({block:'start',behavior:'instant'});
  }
  function lock(opener,fromHistory=false) {
    if(locked)return;
    // A second dialog may open before the previous unlock frame. Preserve the
    // original preference rather than inheriting our temporary manual mode.
    const recorded=fromHistory&&history.state?.slRestoration;
    const restoration=['auto','manual'].includes(recorded)?recorded:pendingRestoration??history.scrollRestoration;
    if(restorationFrame)cancelAnimationFrame(restorationFrame);
    restorationFrame=0;pendingRestoration=null;
    locked={y:scrollY,opener:opener||document.activeElement,restoration};
    window.SLMotion?.pause();history.scrollRestoration='manual';
    document.body.style.position='fixed';document.body.style.top=`${-locked.y}px`;document.body.style.width='100%';
  }
  function unlock() {
    if(!locked)return;
    const restore=locked;locked=null;
    document.body.style.position='';document.body.style.top='';document.body.style.width='';
    scrollTo({top:restore.y,behavior:'instant'});
    restore.opener?.focus?.({preventScroll:true});window.SLMotion?.resume();
    // Native persisted-state restoration happens after popstate listeners.
    // Stay manual through that traversal so it cannot overwrite restore.y.
    pendingRestoration=restore.restoration;
    restorationFrame=requestAnimationFrame(()=>{
      restorationFrame=0;
      if(!locked&&pendingRestoration!==null){history.scrollRestoration=pendingRestoration;pendingRestoration=null;}
    });
  }
  function closeAll(fromHistory=false) {
    if(!fromHistory&&(history.state?.slIndex||history.state?.slModal)){history.back();return;}
    if(index.open)index.close();if(dialog.open)dialog.close();unlock();
  }
  function openIndex(opener,fromHistory=false) {
    lock(opener,fromHistory);
    if(!fromHistory)history.pushState({slIndex:true,slRestoration:locked.restoration},'','#indice');
    if(dialog.open)dialog.close();if(!index.open)index.showModal();
    index.querySelector('[data-close-dialog]')?.focus({preventScroll:true});
  }
  const groupsMarkup=items=>items.map(group=>`<section class="map-group"><h3>${escape(group.title)}</h3>${group.names.map(name=>`<p>${escape(name)}</p>`).join('')}</section>`).join('');
  function openMap(opener,fromHistory=false) {
    lock(opener,fromHistory);if(index.open)index.close();
    title.textContent='Não formam uma doutrina única.';kicker.textContent='Referências / mapa de leitura';
    const count=groups.reduce((sum,group)=>sum+group.names.length,0);
    content.innerHTML=`<p class="dialog-deck">${count} vozes que formam uma conversa.</p><div class="topic-filter" role="group" aria-label="Filtrar referências"><button type="button" data-topic="all" aria-pressed="true">Todas</button>${groups.map((group,i)=>`<button type="button" data-topic="${i}" aria-pressed="false">${escape(group.title)}</button>`).join('')}</div><div class="map-board" id="map-board">${groupsMarkup(groups)}</div><p class="pending-note">Uma curadoria de repertório. Os agrupamentos não são categorias exclusivas, equivalências entre autores ou declarações de endosso.</p>`;
    if(!fromHistory)history.pushState({slModal:true,kind:'map',slRestoration:locked.restoration},'','#mapa-referencias');
    if(!dialog.open)dialog.showModal();document.getElementById('dialog-scroll').scrollTop=0;
    dialog.querySelector('[data-close-dialog]')?.focus({preventScroll:true});
  }
  function applyHash() {
    let hash='';try{hash=decodeURIComponent(location.hash.slice(1));}catch{return;}
    if(hash==='indice'){openIndex(document.getElementById('open-index'),true);return;}
    if(hash==='mapa-referencias'){openMap(document.getElementById('open-map'),true);return;}
    if(hash.startsWith('nota/')) {
      const note=document.getElementById(`nota-${hash.slice(5)}`);
      if(note){const details=note.querySelector('details');if(details)details.open=true;document.dispatchEvent(new CustomEvent('sl:layout-change'));}
      const id=note?.id||'caderno';history.replaceState({slAnchor:id},'',`#${id}`);jump(id);return;
    }
    if(hash==='caderno-completo'){history.replaceState({slAnchor:'caderno'},'','#caderno');jump('caderno');return;}
    if(hash.startsWith('projeto/')) {
      const key=hash.slice(8),figure=[...document.querySelectorAll('[data-work-gallery]')].find(item=>item.dataset.workGallery===key);
      const card=figure?.closest('.portfolio-card'),section=card?.closest('.section');
      const id=section?.id||'laboratorio';history.replaceState({slAnchor:id},'',`#${id}`);
      if(card&&section&&window.SLMotion)window.SLMotion.jumpScene(id,[...section.querySelectorAll('.portfolio-card')].indexOf(card));else jump(id);return;
    }
    if(hash.startsWith('canal/')){history.replaceState({slAnchor:'contato'},'','#contato');jump('contato');return;}
    if(hash)jump(hash);
  }

  document.getElementById('open-index')?.addEventListener('click',event=>openIndex(event.currentTarget));
  document.getElementById('open-map')?.addEventListener('click',event=>openMap(event.currentTarget));
  for(const modal of [index,dialog]) {
    modal.querySelector('[data-close-dialog]')?.addEventListener('click',()=>closeAll());
    modal.addEventListener('cancel',event=>{event.preventDefault();closeAll();});
  }
  document.addEventListener('click',event=>{
    if(event.defaultPrevented||event.metaKey||event.ctrlKey||event.altKey||event.shiftKey)return;
    const target=event.target instanceof Element?event.target:null;
    const link=target?.closest('[data-jump]');
    if(link) {
      const id=link.getAttribute('href')?.slice(1);if(!id||!document.getElementById(id))return;
      event.preventDefault();const wasOpen=index.open||dialog.open;if(wasOpen)closeAll(true);
      history[wasOpen?'replaceState':'pushState']({slAnchor:id},'',`#${id}`);jump(id);return;
    }
    const topic=target?.closest('[data-topic]');
    if(topic) {
      const selected=topic.dataset.topic==='all'?groups:groups.filter((_,i)=>String(i)===topic.dataset.topic);
      dialog.querySelectorAll('[data-topic]').forEach(button=>button.setAttribute('aria-pressed',String(button===topic)));
      document.getElementById('map-board').innerHTML=groupsMarkup(selected);
    }
  });
  document.getElementById('reading-switch')?.addEventListener('change',event=>{
    if(window.SLMotion)window.SLMotion.setReading(event.target.checked);
    else {try{localStorage.setItem('sl-reading',String(event.target.checked));}catch{}}
  });
  document.getElementById('toggle-motion-footer')?.addEventListener('click',()=>window.SLMotion?.setReading(document.documentElement.dataset.reading==='false'));
  addEventListener('popstate',()=>{
    const wasOpen=index.open||dialog.open;
    const hash=location.hash;
    if(hash==='#indice'){if(dialog.open)dialog.close();openIndex(document.getElementById('open-index'),true);return;}
    if(hash==='#mapa-referencias'){openMap(document.getElementById('open-map'),true);return;}
    if(wasOpen){closeAll(true);return;}
    applyHash();
  });
  function onReady() {
    // A directly opened modal gets a local return destination, not an exit
    // to the previous website in the browser's history.
    if(location.hash==='#mapa-referencias'&&!history.state?.slModal){history.replaceState({slAnchor:'referencias'},'','#referencias');jump('referencias');openMap(document.getElementById('open-map'));return;}
    if(location.hash==='#indice'&&!history.state?.slIndex){history.replaceState({slAnchor:'hero'},'','#hero');openIndex(document.getElementById('open-index'));return;}
    applyHash();
  }
  if(window.__SL_DEBUG?.ready)onReady();else document.addEventListener('sl:ready',onReady,{once:true});
})();
