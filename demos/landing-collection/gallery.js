(() => {
  document.querySelectorAll('[data-landing-gallery]').forEach(figure => {
    const projects=window.SLLandingPages, prefix=figure.dataset.imagePrefix || 'screens/';
    if(!projects?.length) return;
    if(figure.closest('#laboratorio')){
      const card=figure.closest('.landing-project');
      card?.querySelector('.card-meta .work-status')?.remove();
      card?.querySelector('.card-tail')?.remove();
      const rail=document.createElement('div');
      rail.className='landing-phone-rail';
      // Native snap competes with each wheel/drag update and pulls the rail back.
      rail.style.scrollSnapType='none';
      rail.style.scrollBehavior='auto';
      rail.setAttribute('aria-label','Oito landing pages em mockups de celular. Role dentro da tela para ler a página. Arraste para os lados ou use Shift mais a roda do mouse para ver outras páginas.');
      projects.forEach(project=>{
        const card=document.createElement('article');
        card.className='landing-phone-card';
        const heading=document.createElement('div');
        heading.className='landing-phone-heading';
        const name=document.createElement('strong');name.textContent=project.name;
        const kind=document.createElement('span');kind.textContent=project.kind;
        heading.append(name,kind);
        const frame=document.createElement('div');frame.className='landing-phone-frame';
        const screen=document.createElement('div');
        screen.className='landing-phone-screen';screen.tabIndex=0;screen.setAttribute('role','region');
        // Let the browser route horizontal touch to the rail and vertical touch
        // to this screen, including gestures that start on the image.
        screen.style.touchAction='pan-x pan-y';
        screen.style.overscrollBehaviorX='auto';
        screen.setAttribute('aria-label',`${project.name}. Tela rolável da landing page.`);
        const image=document.createElement('img');
        image.src=`${prefix}mobile/${project.key}-mobile-v1.jpg`;
        image.alt=`Página completa de ${project.name}, em versão para celular.`;
        image.width=390;image.loading='lazy';image.decoding='async';
        image.draggable=false;
        image.addEventListener('error',()=>{screen.setAttribute('aria-label',`Prévia indisponível: ${project.name}.`);},{once:true});
        screen.append(image);frame.append(screen);
        const hint=document.createElement('span');hint.className='landing-phone-scroll-hint';hint.textContent='Role na tela ↕ · Arraste ou Shift + roda ↔';
        card.append(heading,frame,hint);rail.append(card);
      });
      rail.addEventListener('wheel',event=>{
        if(event.ctrlKey||!event.cancelable)return;
        const overPhone=event.target.closest?.('.landing-phone-screen');
        const horizontalInput=Math.abs(event.deltaX)>Math.abs(event.deltaY)*1.15;
        const verticalPhone=overPhone&&!event.shiftKey&&(!horizontalInput||event.altKey);
        const unit=event.deltaMode===1?16:event.deltaMode===2?(verticalPhone?overPhone.clientHeight:rail.clientWidth):1;
        if(verticalPhone){
          event.preventDefault();event.stopPropagation();
          overPhone.scrollTop+=(event.deltaY||event.deltaX)*unit;return;
        }
        const delta=(horizontalInput?event.deltaX:event.deltaY)*unit;
        const max=rail.scrollWidth-rail.clientWidth;
        if(!delta)return;
        // Consume the gesture at both edges too: otherwise the same wheel
        // suddenly starts scrolling the phone or the surrounding chapter.
        event.preventDefault();event.stopPropagation();rail.scrollLeft=Math.max(0,Math.min(max,rail.scrollLeft+delta));
      },{passive:false});
      let drag=null;
      rail.addEventListener('pointerdown',event=>{
        if(event.pointerType!=='mouse'||event.button!==0||event.target.closest?.('a,button,input,select,textarea'))return;
        drag={id:event.pointerId,x:event.clientX,y:event.clientY,scroll:rail.scrollLeft,moved:false};
        rail.setPointerCapture(event.pointerId);
      });
      rail.addEventListener('pointermove',event=>{
        if(!drag||event.pointerId!==drag.id)return;
        const dx=event.clientX-drag.x,dy=event.clientY-drag.y;
        if(!drag.moved&&Math.max(Math.abs(dx),Math.abs(dy))<7)return;
        if(!drag.moved&&Math.abs(dy)>Math.abs(dx))return;
        drag.moved=true;rail.dataset.dragging='true';event.preventDefault();rail.scrollLeft=drag.scroll-dx;
      });
      const endDrag=event=>{if(drag?.id===event.pointerId){drag=null;delete rail.dataset.dragging;if(rail.hasPointerCapture(event.pointerId))rail.releasePointerCapture(event.pointerId);}};
      rail.addEventListener('pointerup',endDrag);rail.addEventListener('pointercancel',endDrag);
      rail.addEventListener('lostpointercapture',endDrag);
      figure.replaceChildren(rail);
      return;
    }
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
