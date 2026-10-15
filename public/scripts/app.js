/* Navigation, native dialogs, history and honest prototype destinations. */
(() => {
  'use strict';
  const data=window.SL_CONTENT,config=window.SL_CONFIG;
  const index=document.getElementById('index-dialog'),dialog=document.getElementById('content-dialog');
  const title=document.getElementById('dialog-title'),content=document.getElementById('dialog-content'),kicker=document.getElementById('dialog-kicker');
  const scrollArea=document.getElementById('dialog-scroll');
  const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  let locked=null,openKind=null;
  function lock(opener){
    if(locked)return;
    locked={y:scrollY,opener:opener||document.activeElement,restoration:history.scrollRestoration};
    window.SLMotion.pause();history.scrollRestoration='manual';
    document.body.style.position='fixed';document.body.style.top=-locked.y+'px';document.body.style.width='100%';
  }
  function unlock(){
    if(!locked)return;
    const restore=locked;locked=null;
    document.body.style.position='';document.body.style.top='';document.body.style.width='';
    scrollTo({top:restore.y,behavior:'instant'});history.scrollRestoration=restore.restoration;
    restore.opener?.focus?.({preventScroll:true});window.SLMotion.resume();
  }
  function groupsMarkup(groups){return groups.map(g=>`<section class="map-group"><h3>${escape(g.title)}</h3>${g.names.map(n=>`<p>${escape(n)}</p>`).join('')}</section>`).join('');}
  function openContent(kind,id,opener,{historyMode='push'}={}){
    if(index.open)index.close();
    lock(opener);openKind={kind,id};
    let t='',k='',body='';
    if(kind==='article'){
      const a=data.articles[id];if(!a){unlock();return;}
      t=a.title;k='Caderno / '+a.category;
      body=`<p class="dialog-deck">${escape(a.deck)}</p><div class="pending-note"><strong>Texto em preparação.</strong><p>Esta edição demonstra a abertura e a leitura do Caderno. O título e a apresentação já estão definidos; o artigo integral ainda será inserido. Não há texto ou pesquisa inventados para preencher este espaço.</p></div>`;
    }else if(kind==='project'){
      const p=data.projects[id];if(!p){unlock();return;}
      t=p.title;k='Laboratório / '+p.category;
      body=p.paragraphs.map(t=>`<p>${escape(t)}</p>`).join('')+'<div class="pending-note">Apresentação provisória do arquivo. Imagens reais, anatomia do projeto e endereço público serão adicionados quando esse material estiver selecionado.</div>';
    }else if(kind==='map'){
      t='Não formam uma doutrina única.';k='Referências / mapa de leitura';
      body='<p class="dialog-deck">Formam uma conversa.</p><div class="topic-filter" role="group" aria-label="Filtrar referências"><button type="button" data-topic="all" aria-pressed="true">Todas</button>'+data.referenceGroups.map((g,i)=>`<button type="button" data-topic="${i}" aria-pressed="false">${escape(g.title)}</button>`).join('')+'</div><div class="map-board" id="map-board">'+groupsMarkup(data.referenceGroups)+'</div><p class="pending-note">Agrupamentos editoriais para explorar o repertório. Não são categorias exclusivas nem equivalências entre autores.</p>';
    }else if(kind==='notebook'){
      t='Caderno do Laboratório';k='Índice / 06 textos em preparação';
      body='<p class="dialog-deck">Pesquisa, código, território e ideias em andamento.</p><div class="notebook-index">'+Object.entries(data.articles).map(([id,a])=>`<button type="button" data-article="${id}">${escape(a.title)}<span>${escape(a.deck)}</span></button>`).join('')+'</div>';
    }else if(kind==='channel'){
      t=id==='contact'?'Podemos investigar.':id==='github'?'GitHub':'Instagram';k='Soberania Labs / canal público';
      body='<p class="dialog-deck">O canal de contato ainda precisa ser configurado.</p><p>Este protótipo não presume um e-mail nem direciona para um perfil não confirmado.</p><p class="pending-note">Para publicação, preencher o endereço correspondente em <code>config.js</code>. O botão passará a abrir esse canal.</p>';
    }
    title.textContent=t;kicker.textContent=k;content.innerHTML=body;
    const hash=kind==='article'?`#nota/${id}`:kind==='project'?`#projeto/${id}`:kind==='map'?'#mapa-referencias':kind==='notebook'?'#caderno-completo':`#canal/${id}`;
    if(historyMode==='push'){
      if(dialog.open)history.replaceState({slModal:true,kind,id,scrollY:locked.y},'',hash);
      else history.pushState({slModal:true,kind,id,scrollY:locked.y},'',hash);
    }
    if(!dialog.open)dialog.showModal();scrollArea.scrollTop=0;
    dialog.querySelector('[data-close-dialog]').focus({preventScroll:true});
  }
  function closeIndex(fromHistory=false){
    if(!index.open)return;
    if(!fromHistory&&history.state?.slIndex){history.back();return;}
    index.close();unlock();
  }
  function closeContent(fromHistory=false){
    if(!dialog.open)return;
    if(!fromHistory&&history.state?.slModal){history.back();return;}
    dialog.close();openKind=null;unlock();
  }
  function openIndex(opener,fromHistory=false){
    lock(opener);
    if(!fromHistory)history.pushState({slIndex:true},'','#indice');
    if(!index.open)index.showModal();index.querySelector('[data-close-dialog]').focus();
  }
  document.getElementById('open-index').addEventListener('click',e=>openIndex(e.currentTarget));
  index.querySelector('[data-close-dialog]').addEventListener('click',()=>closeIndex());
  dialog.querySelector('[data-close-dialog]').addEventListener('click',()=>closeContent());
  index.addEventListener('cancel',e=>{e.preventDefault();closeIndex();});
  dialog.addEventListener('cancel',e=>{e.preventDefault();closeContent();});
  document.addEventListener('click',e=>{
    const a=e.target.closest('[data-jump]');
    if(a){
      const id=a.getAttribute('href')?.slice(1);if(!id||!document.getElementById(id))return;
      e.preventDefault();const fromIndex=index.open;if(fromIndex)closeIndex(true);
      if(dialog.open)closeContent(true);
      if(fromIndex)history.replaceState({slAnchor:id},'','#'+id);else history.pushState({slAnchor:id},'','#'+id);window.SLMotion.jumpSection(id);return;
    }
    const article=e.target.closest('[data-article]');if(article){openContent('article',article.dataset.article,article);return;}
    const project=e.target.closest('[data-project]');if(project){openContent('project',project.dataset.project,project);return;}
    const topic=e.target.closest('[data-topic]');if(topic){
      document.querySelectorAll('[data-topic]').forEach(b=>b.setAttribute('aria-pressed',String(b===topic)));
      const g=topic.dataset.topic==='all'?data.referenceGroups:[data.referenceGroups[+topic.dataset.topic]];
      document.getElementById('map-board').innerHTML=groupsMarkup(g);return;
    }
    const channel=e.target.closest('[data-channel]');if(channel)openChannel(channel.dataset.channel,channel);
  });
  function openChannel(name,opener){
    const url=name==='contact'?config.contactUrl:name==='github'?config.githubUrl:config.instagramUrl;
    if(url&&/^(https:\/\/|mailto:)/i.test(url))location.assign(url);else openContent('channel',name,opener);
  }
  document.getElementById('contact-action').addEventListener('click',e=>openChannel('contact',e.currentTarget));
  document.getElementById('open-map').addEventListener('click',e=>openContent('map','',e.currentTarget));
  document.getElementById('open-notebook').addEventListener('click',e=>openContent('notebook','',e.currentTarget));
  document.getElementById('reading-switch').addEventListener('change',e=>{window.SLMotion.setReading(e.target.checked);});
  document.getElementById('toggle-motion-footer').addEventListener('click',()=>window.SLMotion.setReading(window.__SL_DEBUG.enabled));
  function readHash(){
    let hash='';try{hash=decodeURIComponent(location.hash.slice(1));}catch(_){return;}
    if(hash.startsWith('nota/'))return {kind:'article',id:hash.slice(5)};
    if(hash.startsWith('projeto/'))return {kind:'project',id:hash.slice(8)};
    if(hash==='mapa-referencias')return {kind:'map',id:''};
    if(hash==='caderno-completo')return {kind:'notebook',id:''};
    if(hash.startsWith('canal/'))return {kind:'channel',id:hash.slice(6)};
    return null;
  }
  addEventListener('popstate',()=>{
    if(history.state?.slIndex){if(dialog.open)closeContent(true);openIndex(document.getElementById('open-index'),true);return;}
    const info=readHash();
    if(info){openContent(info.kind,info.id,null,{historyMode:'none'});return;}
    const wasOpen=dialog.open;
    if(wasOpen)closeContent(true);
    if(index.open)closeIndex(true);
    if(!wasOpen){const id=location.hash.slice(1);if(document.getElementById(id))window.SLMotion.jumpSection(id);}
  });
  document.addEventListener('sl:ready',()=>{
    const info=readHash();
    if(info){
      const hash=location.hash;
      history.replaceState({slAnchor:'caderno'},'','#caderno');window.SLMotion.jumpSection('caderno');
      openContent(info.kind,info.id,null,{historyMode:'push'});
    }else{const id=location.hash.slice(1);if(id&&document.getElementById(id))window.SLMotion.jumpSection(id);}
  },{once:true});
})();
