/* Navigation for the four published covers; no draft content or dialogs. */
(() => {
  'use strict';
  const dialog=document.getElementById('index-dialog');
  const footer=document.getElementById('footer');
  const growthObserver=new IntersectionObserver(entries=>{
    footer.classList.toggle('is-growing',entries[0].isIntersecting);
  },{threshold:.1});
  growthObserver.observe(footer);
  let savedY=0,opener=null;
  const close=()=>{
    dialog.close();
    document.body.style.position='';document.body.style.top='';document.body.style.width='';
    scrollTo({top:savedY,behavior:'instant'});
    window.SLMotion.resume();opener?.focus({preventScroll:true});
  };
  document.getElementById('open-index').addEventListener('click',event=>{
    savedY=scrollY;opener=event.currentTarget;window.SLMotion.pause();
    document.body.style.position='fixed';document.body.style.top=-savedY+'px';document.body.style.width='100%';
    dialog.showModal();
  });
  dialog.querySelector('[data-close-dialog]').addEventListener('click',close);
  dialog.addEventListener('cancel',event=>{event.preventDefault();close();});
  document.addEventListener('click',event=>{
    const link=event.target.closest('[data-jump]');
    if(!link)return;
    const id=link.getAttribute('href')?.slice(1);
    if(!id||!document.getElementById(id))return;
    event.preventDefault();if(dialog.open)close();
    history.pushState(null,'','#'+id);window.SLMotion.jumpSection(id);
  });
  document.getElementById('reading-switch').addEventListener('change',event=>window.SLMotion.setReading(event.target.checked));
  document.getElementById('toggle-motion-footer').addEventListener('click',()=>window.SLMotion.setReading(window.__SL_DEBUG.enabled));
  addEventListener('popstate',()=>{
    if(dialog.open)close();window.SLMotion.jumpSection(location.hash.slice(1)||'hero');
  });
})();
