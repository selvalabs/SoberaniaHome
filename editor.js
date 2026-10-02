/* Bounded inline demonstration. Not a substitute for the full external editor. */
(() => {
  'use strict';
  const button=document.getElementById('enable-editor'),demo=document.getElementById('editor-demo');
  const fields=[document.getElementById('edit-title'),document.getElementById('edit-body')];
  const status=document.getElementById('demo-status'),tip=document.getElementById('editor-tip');
  const figure=document.getElementById('demo-image'),zone=document.getElementById('image-zone');
  const mover=document.getElementById('move-image'),resizer=document.getElementById('resize-image');
  const size=document.getElementById('image-size'),angle=document.getElementById('image-angle');
  let live=false,selected=fields[1],pointer=null;
  const original=fields.map(f=>f.textContent);
  const geom={x:20,y:6,w:75,h:118,angle:-14};
  const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
  function selectedStatus(){document.querySelectorAll('[data-format]').forEach(b=>{
    const fmt=b.dataset.format;
    const on=fmt==='bold'?selected.style.fontWeight==='700':fmt==='italic'?selected.style.fontStyle==='italic':selected.style.textDecoration==='underline';
    b.setAttribute('aria-pressed',String(on));
  });}
  fields.forEach(f=>f.addEventListener('focus',()=>{selected=f;selectedStatus();}));
  function setLive(on){
    live=on;
    if(on&&window.__SL_DEBUG?.enabled)window.SLMotion.jumpScene('editor',2.4);
    window.SLMotion.editorLive(on);demo.classList.toggle('editor-live',on);demo.querySelector('.demo-toolbar').inert=!on;
    demo.classList.remove('demo-preview-tools','demo-preview-bounds');
    fields.forEach(f=>{f.contentEditable=String(on);});
    status.textContent=on?'Edição local':'Leitura';
    button.innerHTML=on?'ENCERRAR EDIÇÃO <span>✓</span>':'ABRIR O EDITOR <span>↗</span>';
    tip.textContent=on?'Formate o bloco selecionado. Use “Mover” na imagem; o restante da tela continua rolando.':'Prévia funcional · edição local, sem envio de dados.';
    if(on){selected.focus({preventScroll:true});applyGeometry();}
    else{document.getElementById('extra-tools').hidden=true;document.getElementById('more-tools').setAttribute('aria-expanded','false');selected.blur();}
  }
  button.addEventListener('click',()=>setLive(!live));
  document.querySelectorAll('[data-format]').forEach(b=>{
    b.addEventListener('pointerdown',e=>{if(e.pointerType==='mouse')e.preventDefault();});
    b.addEventListener('click',()=>{
      if(!live)return;
      const fmt=b.dataset.format,on=b.getAttribute('aria-pressed')!=='true';
      if(fmt==='bold')selected.style.fontWeight=on?'700':'400';
      if(fmt==='italic')selected.style.fontStyle=on?'italic':'normal';
      if(fmt==='underline')selected.style.textDecoration=on?'underline':'none';
      selectedStatus();selected.focus({preventScroll:true});
    });
  });
  document.getElementById('more-tools').addEventListener('click',e=>{
    if(!live)return;
    const panel=document.getElementById('extra-tools');panel.hidden=!panel.hidden;
    e.currentTarget.setAttribute('aria-expanded',String(!panel.hidden));
  });
  function applyGeometry(){
    const zw=zone.clientWidth,zh=zone.clientHeight;
    geom.w=clamp(geom.w,48,Math.min(170,zw*.56));
    const theta=Math.abs(geom.angle)*Math.PI/180,aspect=.63;
    geom.h=Math.min(geom.w/aspect,(zh-12)/(Math.cos(theta)+aspect*Math.sin(theta)));
    geom.x=clamp(geom.x,8,Math.max(8,zw-geom.w-16));geom.y=clamp(geom.y,4,Math.max(4,zh-geom.h-8));
    figure.style.width=geom.w+'px';figure.style.height=geom.h+'px';figure.style.left=geom.x+'px';figure.style.top=geom.y+'px';figure.style.transform=`rotate(${geom.angle}deg)`;
  }
  function down(e,kind){
    if(!live||e.button>0)return;
    e.preventDefault();e.stopPropagation();
    pointer={kind,id:e.pointerId,x:e.clientX,y:e.clientY,g:{...geom},handle:e.currentTarget};
    e.currentTarget.setPointerCapture(e.pointerId);
  }
  function move(e){
    if(!pointer||pointer.id!==e.pointerId)return;
    e.preventDefault();
    const dx=e.clientX-pointer.x,dy=e.clientY-pointer.y;
    if(pointer.kind==='move'){geom.x=pointer.g.x+dx;geom.y=pointer.g.y+dy;}
    else{geom.w=pointer.g.w+dx+dy*.25;size.value=geom.w;}
    applyGeometry();
  }
  function finish(e){if(pointer?.id===e.pointerId){pointer=null;tip.textContent='Imagem ajustada. O documento permanece editável.';}}
  [mover,resizer].forEach((h,i)=>{
    h.addEventListener('pointerdown',e=>down(e,i?'resize':'move'));
    h.addEventListener('pointermove',move);h.addEventListener('pointerup',finish);h.addEventListener('pointercancel',finish);h.addEventListener('lostpointercapture',()=>pointer=null);
    h.addEventListener('keydown',e=>{
      if(!live||!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key))return;
      e.preventDefault();const step=e.shiftKey?12:4;
      if(i){geom.w+=['ArrowRight','ArrowDown'].includes(e.key)?step:-step;}else{if(e.key==='ArrowLeft')geom.x-=step;if(e.key==='ArrowRight')geom.x+=step;if(e.key==='ArrowUp')geom.y-=step;if(e.key==='ArrowDown')geom.y+=step;}
      applyGeometry();
    });
  });
  size.addEventListener('input',()=>{geom.w=+size.value;applyGeometry();});
  angle.addEventListener('input',()=>{geom.angle=+angle.value;applyGeometry();});
  document.getElementById('reset-demo').addEventListener('click',()=>{
    fields.forEach((f,i)=>{f.textContent=original[i];f.removeAttribute('style');});
    Object.assign(geom,{x:20,y:6,w:75,h:118,angle:-14});size.value=75;angle.value=-14;applyGeometry();selectedStatus();tip.textContent='Documento restaurado.';
  });
  const escape=s=>s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  document.getElementById('export-html').addEventListener('click',()=>{
    if(!live)return;
    let image='';
    try{
      const img=document.getElementById('editable-image'),canvas=document.createElement('canvas');
      canvas.width=img.naturalWidth;canvas.height=img.naturalHeight;canvas.getContext('2d').drawImage(img,0,0);image=canvas.toDataURL('image/png');
    }catch(_){ /* Export remains portable without an inaccessible decoration. */ }
    const styles=fields.map(f=>`font-weight:${f.style.fontWeight||'400'};font-style:${f.style.fontStyle||'normal'};text-decoration:${f.style.textDecoration||'none'}`);
    const out=`<!doctype html><html lang="pt-BR"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escape(fields[0].textContent)}</title><style>body{max-width:780px;margin:7vh auto;padding:24px;background:#eee9df;color:#1c211a;font:18px/1.7 Georgia,serif}h1{font:42px/1.15 Arial,sans-serif;letter-spacing:-.03em}figure{min-height:220px;position:relative;border-top:1px solid #b7b7a6}img{display:block;max-width:100%;width:${geom.w}px;transform:rotate(${geom.angle}deg);margin:30px 0 0 ${Math.round(geom.x)}px}small{font:12px monospace}</style><main><small>Documento independente / Soberania Labs</small><h1 style="${styles[0]}">${escape(fields[0].textContent)}</h1><p style="${styles[1]}">${escape(fields[1].textContent)}</p>${image?`<figure><img src="${image}" alt="Folha botânica"></figure>`:''}</main></html>`;
    const url=URL.createObjectURL(new Blob([out],{type:'text/html;charset=utf-8'})),a=document.createElement('a');
    a.href=url;a.download='soberania-documento.html';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
    tip.textContent=image?'HTML autocontido salvo, com texto e imagem.':'HTML salvo. A imagem não pôde ser incorporada neste navegador.';
  });
})();
