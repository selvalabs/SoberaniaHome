(() => {
  document.querySelectorAll('[data-landing-gallery]').forEach(figure => {
    const projects=window.SLLandingPages, prefix=figure.dataset.imagePrefix || 'screens/';
    if(!projects?.length) return;
    const image=figure.querySelector('img'), caption=figure.querySelector('figcaption');
    const controls=document.createElement('div');controls.className='work-page-selector landing-selector';
    const select=document.createElement('select');select.setAttribute('aria-label','Escolher apresentação de site');
    projects.forEach((p,i)=>{const o=document.createElement('option');o.value=i;o.textContent=p.name;select.append(o)});
    controls.append(select);
    let project=0, page=0, request=0;
    const buttons=['Abertura','Conteúdo'].map((name,i)=>{
      const b=document.createElement('button');b.type='button';b.textContent=name;b.setAttribute('aria-pressed',String(i===0));
      b.addEventListener('click',()=>show(project,i));controls.append(b);return b;
    });
    const count=document.createElement('span');count.className='work-page-count';count.setAttribute('aria-live','polite');controls.append(count);
    figure.insertBefore(controls,caption);
    const link=figure.querySelector('[data-demo-link]');
    async function show(p,i){
      const token=++request, item=projects[p], candidate=new Image();candidate.src=prefix+item.pages[i].asset;
      figure.setAttribute('aria-busy','true');
      try {
        await candidate.decode();if(token!==request)return;
        project=p;page=i;image.src=candidate.src;image.alt=item.name+' — '+item.pages[i].label+'. '+item.kind;
        caption.textContent=item.name+' / '+item.kind;
        buttons.forEach((b,n)=>b.setAttribute('aria-pressed',String(n===i)));count.textContent=`${i+1} / ${item.pages.length}`;
        if(link){link.hidden=item.key!=='entretrama'}
      }catch{if(token===request){count.textContent='Imagem indisponível';select.value=project}}
      finally{if(token===request)figure.removeAttribute('aria-busy')}
    }
    select.addEventListener('change',()=>show(Number(select.value),0));
    controls.addEventListener('keydown',e=>{if(e.target===select)return;if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();const next=1-page;buttons[next].focus({preventScroll:true});show(project,next)}});
    show(0,0);
  });
})();
