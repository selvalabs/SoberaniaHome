(() => {
  document.querySelectorAll('[data-landing-gallery]').forEach(figure => {
    const projects=window.SLLandingPages, prefix=figure.dataset.imagePrefix || 'screens/';
    const tileManifest=JSON.parse(document.querySelector('[data-landing-tiles]')?.textContent || '{}');
    if(!projects?.length) return;
    if(figure.closest('#laboratorio')){
      const card=figure.closest('.landing-project');
      card?.querySelector('.card-meta .work-status')?.remove();
      card?.querySelector('.card-tail')?.remove();
      const rail=document.createElement('div');
      rail.className='landing-phone-rail';rail.tabIndex=0;rail.setAttribute('role','region');
      // Native snap competes with each wheel/drag update and pulls the rail back.
      rail.style.scrollSnapType='none';
      rail.style.scrollBehavior='auto';
      const touchPreview=window.matchMedia('(pointer: coarse)').matches;
      rail.setAttribute('aria-label',touchPreview
        ? 'Landing pages em mockups de celular. Deslize para cima ou para baixo dentro da tela para ler. Deslize para os lados para ver outras páginas.'
        : 'Landing pages em mockups de celular. Role dentro da tela para ler a página. Arraste para os lados ou use Shift mais a roda do mouse para ver outras páginas.');
      const startScreens=[];
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
        const tiles=tileManifest[project.key] || [{src:`mobile/${project.key}-mobile-v1.jpg`,width:390,height:1200}];
        const images=[];
        startScreens.push(()=>{
          if('IntersectionObserver' in window){const observer=new IntersectionObserver(entries=>{for(const entry of entries)if(entry.isIntersecting){const img=entry.target;img.src=img.dataset.src;observer.unobserve(img);}},{root:screen,rootMargin:'600px 0px'});images.forEach(image=>observer.observe(image));}
          else images.forEach(image=>{image.src=image.dataset.src;});
        });
        tiles.forEach((tile,index)=>{
          const image=document.createElement('img');
          image.alt=index===0?`Prévia de ${project.name}, em versão para celular.`:'';
          image.width=tile.width;image.height=tile.height;image.decoding='async';image.draggable=false;
          image.dataset.src=prefix+tile.src;
          image.style.aspectRatio=`${tile.width} / ${tile.height}`;
          images.push(image);
          screen.append(image);
        });
        frame.append(screen);
        card.append(heading,frame);rail.append(card);
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
      rail.addEventListener('keydown',event=>{if(event.target!==rail)return;if(event.key==='ArrowLeft'||event.key==='ArrowRight'){event.preventDefault();event.stopPropagation();rail.scrollLeft+=(event.key==='ArrowRight'?1:-1)*280;}});
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
      const hint=document.createElement('figcaption');hint.className='landing-phone-scroll-hint';hint.textContent=touchPreview?'Deslize na tela para ler · Para os lados, outros sites':'Role na tela para ler · Arraste para ver outros sites';
      figure.replaceChildren(rail,hint);
      if('IntersectionObserver' in window){const visible=new IntersectionObserver(entries=>{if(entries.some(entry=>entry.isIntersecting)){startScreens.forEach(start=>start());visible.disconnect();}},{rootMargin:'400px'});visible.observe(figure);}
      else startScreens.forEach(start=>start());
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
