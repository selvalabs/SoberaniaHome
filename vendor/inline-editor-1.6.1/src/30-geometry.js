// GeometryController 1.5.1: same authored geometry contract, smoother gesture transport.
// Pointer input is coalesced to one frame, snap lines are cached per session and movement previews use
// the compositor-friendly individual translate property. Absolute/fixed left/top are committed only on release.
const GeometryController={
  min:24,snapTolerance:6,raf:0,pendingEvent:null,
  isResizable(e){return !!e&&['image','svg','container'].includes(SE.contextOf(e))},
  canMove(e){return !!e&&SE.contextOf(e)!=='section'&&Utils.visible(e)},
  moveMode(e){return ['absolute','fixed'].includes(getComputedStyle(e).position)?'absolute':'flow'},
  boxSize(e){const c=getComputedStyle(e),extraX=safeNum(c.paddingLeft)+safeNum(c.paddingRight)+safeNum(c.borderLeftWidth)+safeNum(c.borderRightWidth),extraY=safeNum(c.paddingTop)+safeNum(c.paddingBottom)+safeNum(c.borderTopWidth)+safeNum(c.borderBottomWidth);
    return{width:safeNum(c.width,e.getBoundingClientRect().width)+(c.boxSizing==='border-box'?0:extraX),height:safeNum(c.height,e.getBoundingClientRect().height)+(c.boxSizing==='border-box'?0:extraY)}},
  parentMatrix(e,includeSelf=false){let m=new DOMMatrix(),chain=[];for(let p=includeSelf?e:e.parentElement;p&&p!==document.documentElement;p=p.parentElement)chain.unshift(p);
    for(const p of chain){const c=getComputedStyle(p);let t=new DOMMatrix();const rotate=c.rotate,scale=c.scale;if(rotate&&rotate!=='none'&&/^[-\d.]+deg$/.test(rotate))t=t.rotate(safeNum(rotate));if(scale&&scale!=='none'){const ss=scale.split(' ').map(Number);t=t.scale(ss[0]||1,ss[1]||ss[0]||1)}if(c.transform!=='none')t=t.multiply(new DOMMatrix(c.transform));const z=safeNum(c.zoom,1);if(z!==1)t=t.scale(z);m=m.multiply(t)}return m},
  delta(localMatrix,dx,dy){const inv=localMatrix.inverse();if(!inv.is2D||!Number.isFinite(inv.a))return{x:dx,y:dy};return{x:inv.a*dx+inv.c*dy,y:inv.b*dx+inv.d*dy}},
  record(e){const rect=e.getBoundingClientRect(),cs=getComputedStyle(e),mode=this.moveMode(e);let parent=mode==='absolute'?(e.offsetParent||e.parentElement||document.documentElement):(e.parentElement||document.documentElement);const fixed=cs.position==='fixed'&&!e.offsetParent;
    const pr=fixed?{left:0,top:0,width:innerWidth,height:innerHeight,right:innerWidth,bottom:innerHeight}:parent.getBoundingClientRect();const off=this.delta(this.parentMatrix(e),rect.left-pr.left,rect.top-pr.top);
    return{el:e,id:H.ensureId(e),startRect:rect,box:this.boxSize(e),parent,parentRect:pr,mode,matrix:this.parentMatrix(e),resizeMatrix:this.parentMatrix(e,true),
      moveX:safeNum(e.style.getPropertyValue('--ie-move-x')),moveY:safeNum(e.style.getPropertyValue('--ie-move-y')),
      left:Number.isFinite(parseFloat(cs.left))?parseFloat(cs.left):off.x+(parent.scrollLeft||0)-(parent.clientLeft||0)-safeNum(cs.marginLeft),
      top:Number.isFinite(parseFloat(cs.top))?parseFloat(cs.top):off.y+(parent.scrollTop||0)-(parent.clientTop||0)-safeNum(cs.marginTop),
      isFixed:fixed,baseTranslate:cs.translate==='none'?'0px 0px':cs.translate,
      preview:{hadClass:e.classList.contains('ie-gesture-preview'),willChange:e.style.getPropertyValue('will-change'),willPriority:e.style.getPropertyPriority('will-change'),
        baseX:e.style.getPropertyValue('--ie-gesture-base-x'),baseY:e.style.getPropertyValue('--ie-gesture-base-y'),x:e.style.getPropertyValue('--ie-gesture-x'),y:e.style.getPropertyValue('--ie-gesture-y')}};},
  ensureMove(e,rec=null){if(!e.classList.contains('ie-move-authored')){const c=(rec?.baseTranslate||getComputedStyle(e).translate||'none').split(' ');S.set(e,'--ie-base-translate-x',c[0]==='none'?'0px':c[0]);S.set(e,'--ie-base-translate-y',c[1]||'0px');e.classList.add('ie-move-authored')}},
  writeMove(rec,dx,dy){const d=this.delta(rec.matrix,dx,dy),e=rec.el;
    if(rec.mode==='absolute'){S.set(e,'left',px(rec.left+d.x),{strong:true});S.set(e,'top',px(rec.top+d.y),{strong:true});S.set(e,'right','auto',{strong:true});S.set(e,'bottom','auto',{strong:true})}
    else{this.ensureMove(e,rec);S.set(e,'--ie-move-x',px(rec.moveX+d.x));S.set(e,'--ie-move-y',px(rec.moveY+d.y));e.setAttribute('data-ie-authored','1')}
  },
  previewStart(rec){const e=rec.el,c=String(rec.baseTranslate||'0px 0px').split(/\s+/);e.style.setProperty('--ie-gesture-base-x',c[0]==='none'?'0px':c[0]);e.style.setProperty('--ie-gesture-base-y',c[1]||'0px');e.style.setProperty('--ie-gesture-x','0px');e.style.setProperty('--ie-gesture-y','0px');e.style.setProperty('will-change','translate');e.classList.add('ie-gesture-preview')},
  previewMove(rec,dx,dy){const d=this.delta(rec.matrix,dx,dy),e=rec.el;e.style.setProperty('--ie-gesture-x',px(d.x));e.style.setProperty('--ie-gesture-y',px(d.y))},
  previewClear(rec){const e=rec.el,p=rec.preview;if(!p.hadClass)e.classList.remove('ie-gesture-preview');for(const [prop,val] of [['--ie-gesture-base-x',p.baseX],['--ie-gesture-base-y',p.baseY],['--ie-gesture-x',p.x],['--ie-gesture-y',p.y]]){if(val)e.style.setProperty(prop,val);else e.style.removeProperty(prop)}if(p.willChange)e.style.setProperty('will-change',p.willChange,p.willPriority);else e.style.removeProperty('will-change')},
  freezeSize(e,w,h){S.set(e,'boxSizing','border-box',{strong:true});S.set(e,'width',px(w),{strong:true});S.set(e,'height',px(h),{strong:true});S.set(e,'minWidth','0px',{strong:true});S.set(e,'minHeight','0px',{strong:true});S.set(e,'maxWidth','none',{strong:true});S.set(e,'maxHeight','none',{strong:true});if(getComputedStyle(e.parentElement).display.includes('flex'))S.set(e,'flexShrink','0',{strong:true});
    if(e.tagName==='IMG'&&getComputedStyle(e).objectFit==='fill'&&!(e.getAttribute('data-ie-authored-style-props')||'').includes('object-fit'))S.set(e,'objectFit','contain')},
  pauseMotion(s){const seen=new Set();for(const rec of s.records){let n=rec.el;for(let depth=0;n&&n!==document.body&&depth<7;n=n.parentElement,depth++){for(const a of n.getAnimations()){if(a.playState==='running'&&!seen.has(a)){seen.add(a);s.paused.push(a);try{a.pause()}catch(_){}}}if(n.tagName==='SECTION')break}}},
  startSession(type,event,dir=null){const els=selection();if(!EditorState.editMode||!els.length||EditorState.geometry)return;
    if(type==='resize'&&(els.length!==1||!this.isResizable(els[0])))return;
    if(type==='move'&&(!els.every(e=>this.canMove(e))||(!EditorState.freeMove&&!els.every(e=>this.moveMode(e)==='absolute')))){notify('Ative Mover livre. Seções inteiras permanecem no fluxo.');return}
    event.preventDefault();event.stopImmediatePropagation();const historyBefore=H.begin(els),records=els.map(e=>this.record(e));
    const s=EditorState.geometry={type,id:event.pointerId,dir,records,historyBefore,startPointer:{x:event.clientX,y:event.clientY},startRect:Utils.bound(els),target:els[0],parentRect:records[0].parentRect,axisLock:null,lastValues:null,moved:false,capture:event.currentTarget,paused:[],snapLines:null};
    s.snapLines=this.siblingLines(s);if(type==='move')records.forEach(rec=>this.previewStart(rec));this.pauseMotion(s);
    s.capture?.setPointerCapture?.(event.pointerId);document.body.setAttribute('data-ie-gesture','1');OverlayManager.update();this.showBadge(type,s.startRect,{dx:0,dy:0})
  },
  latchAxis(s,dx,dy,e){if(s.axisLock)return;if(!e.shiftKey)return;if(Math.hypot(dx,dy)<6)return;s.axisLock=Math.abs(dx)>=Math.abs(dy)?'x':'y'},
  siblingLines(s){const x=[],y=[],add=r=>{x.push(r.left,(r.left+r.right)/2,r.right);y.push(r.top,(r.top+r.bottom)/2,r.bottom)};add(s.parentRect);x.push(innerWidth/2);y.push(innerHeight/2);const skip=new Set(s.records.map(r=>r.el));const parent=s.target.parentElement;
    if(parent)for(const e of parent.children){if(skip.has(e)||Utils.isRuntime(e)||!Utils.visible(e))continue;const r=e.getBoundingClientRect();if(r.bottom>=0&&r.top<=innerHeight&&r.right>=0&&r.left<=innerWidth)add(r)}return{x,y}},
  snapMove(s,dx,dy,e){if((!EditorState.smartGuides&&!EditorState.snapping)||e.altKey)return{dx,dy,gx:null,gy:null};const lines=s.snapLines||this.siblingLines(s),r=s.startRect,t=this.snapTolerance;let bestX=null,bestY=null;
    if(s.axisLock!=='y'){const pts=[r.left+dx,(r.left+r.right)/2+dx,r.right+dx];for(const p of pts)for(const line of lines.x){const d=line-p;if(Math.abs(d)<=t&&(!bestX||Math.abs(d)<Math.abs(bestX.d)))bestX={d,line}}}
    if(s.axisLock!=='x'){const pts=[r.top+dy,(r.top+r.bottom)/2+dy,r.bottom+dy];for(const p of pts)for(const line of lines.y){const d=line-p;if(Math.abs(d)<=t&&(!bestY||Math.abs(d)<Math.abs(bestY.d)))bestY={d,line}}}
    if(EditorState.snapping){if(bestX)dx+=bestX.d;if(bestY)dy+=bestY.d}return{dx,dy,gx:bestX?.line??null,gy:bestY?.line??null}},
  move(e){const s=EditorState.geometry;if(!s||s.id!==e.pointerId||s.type!=='move')return;let dx=e.clientX-s.startPointer.x,dy=e.clientY-s.startPointer.y;this.latchAxis(s,dx,dy,e);if(s.axisLock==='x')dy=0;if(s.axisLock==='y')dx=0;const snap=this.snapMove(s,dx,dy,e);dx=snap.dx;dy=snap.dy;if(s.axisLock==='x')dy=0;if(s.axisLock==='y')dx=0;
    if(Math.hypot(dx,dy)<.01&&!s.moved)return;s.moved=true;s.records.forEach(rec=>this.previewMove(rec,dx,dy));s.lastValues={dx,dy};this.showGuides(snap.gx,snap.gy,s.axisLock);OverlayManager.previewMove(dx,dy);const r={left:s.startRect.left+dx,top:s.startRect.top+dy,right:s.startRect.right+dx,bottom:s.startRect.bottom+dy,width:s.startRect.width,height:s.startRect.height};this.showBadge('move',r,{dx,dy})},
  resize(e){const s=EditorState.geometry;if(!s||s.id!==e.pointerId||s.type!=='resize')return;const rec=s.records[0],d=s.dir,delta=this.delta(rec.resizeMatrix,e.clientX-s.startPointer.x,e.clientY-s.startPointer.y);let w=rec.box.width,h=rec.box.height;
    if(d.includes('e'))w+=delta.x;if(d.includes('w'))w-=delta.x;if(d.includes('s'))h+=delta.y;if(d.includes('n'))h-=delta.y;w=Math.max(this.min,w);h=Math.max(this.min,h);const corner=d.length===2;
    if(corner&&EditorState.lockRatio){const ratio=rec.box.width/rec.box.height;if(Math.abs(w-rec.box.width)>=Math.abs(h-rec.box.height))h=w/ratio;else w=h*ratio;const scale=Math.max(this.min/w,this.min/h,1);w*=scale;h*=scale}
    if(Math.abs(w-rec.box.width)+Math.abs(h-rec.box.height)<.01&&!s.moved)return;s.moved=true;this.freezeSize(rec.el,w,h);
    if(d.includes('w')||d.includes('n')){const wx=d.includes('w')?rec.box.width-w:0,hy=d.includes('n')?rec.box.height-h:0;const screen={x:rec.matrix.a*wx+rec.matrix.c*hy,y:rec.matrix.b*wx+rec.matrix.d*hy};this.writeMove(rec,screen.x,screen.y)}
    s.lastValues={w,h};OverlayManager.update();this.showBadge('resize',rec.el.getBoundingClientRect(),{w,h});$('#ie-width').value=Math.round(w);$('#ie-height').value=Math.round(h)},
  eventCopy(e){return{pointerId:e.pointerId,clientX:e.clientX,clientY:e.clientY,shiftKey:e.shiftKey,altKey:e.altKey,preventDefault(){}}},
  queue(e){const s=EditorState.geometry;if(!s||s.id!==e.pointerId)return;e.preventDefault();this.pendingEvent=this.eventCopy(e);if(this.raf)return;this.raf=requestAnimationFrame(()=>{this.raf=0;const ev=this.pendingEvent;this.pendingEvent=null;if(!ev||!EditorState.geometry||EditorState.geometry.id!==ev.pointerId)return;if(EditorState.geometry.type==='move')this.move(ev);else this.resize(ev)})},
  flush(e=null){if(!this.pendingEvent)return;const ev=e&&e.pointerId===this.pendingEvent.pointerId?this.eventCopy(e):this.pendingEvent;this.pendingEvent=null;if(this.raf){cancelAnimationFrame(this.raf);this.raf=0}if(EditorState.geometry?.id===ev.pointerId){if(EditorState.geometry.type==='move')this.move(ev);else this.resize(ev)}},
  end(e,cancel=false){const s=EditorState.geometry;if(!s||s.id!==e.pointerId)return;e.preventDefault?.();e.stopPropagation?.();if(!cancel)this.flush(e);else{this.pendingEvent=null;if(this.raf){cancelAnimationFrame(this.raf);this.raf=0}}
    if(s.type==='move'){if(!cancel&&s.moved&&s.lastValues){s.records.forEach(rec=>this.previewClear(rec));s.records.forEach(rec=>this.writeMove(rec,s.lastValues.dx,s.lastValues.dy))}else s.records.forEach(rec=>this.previewClear(rec))}
    OverlayManager.clearGesturePreview();EditorState.geometry=null;this.hideGuides();$('#ie-geometry-badge').hidden=true;document.body.removeAttribute('data-ie-gesture');try{s.capture?.releasePointerCapture?.(e.pointerId)}catch(_){ }
    if(cancel)H.applySnapshot(s.historyBefore);else H.end(s.type==='move'?(s.records.length>1?'Mover grupo':'Mover elemento'):'Redimensionar elemento',s.historyBefore);
    s.paused.forEach(a=>{try{a.play()}catch(_){}});syncUI()},
  cancel(){const s=EditorState.geometry;if(s)this.end({pointerId:s.id},true)},
  showGuides(x,y,axis){for(const [id,v,allowed] of [['ie-guide-v',x,axis!=='y'],['ie-guide-h',y,axis!=='x']]){const n=$('#'+id);n.hidden=!EditorState.smartGuides||v==null||!allowed;if(!n.hidden)n.style[id.endsWith('v')?'left':'top']=v+'px'}},
  hideGuides(){$('#ie-guide-v').hidden=true;$('#ie-guide-h').hidden=true},
  showBadge(type,r,v){const b=$('#ie-geometry-badge');b.textContent=type==='move'?`X ${Math.round(v.dx||0)} · Y ${Math.round(v.dy||0)}`:`W ${Math.round(v.w||r.width)} · H ${Math.round(v.h||r.height)}`;b.hidden=false;b.style.left=clamp(r.left,8,innerWidth-155)+'px';b.style.top=clamp(r.bottom+8,8,innerHeight-40)+'px'},
  setDimension(prop,value){const n=Number(value);if(!Number.isFinite(n)||n<0)return;const els=selection();withHistory('Ajustar '+prop,els,()=>els.forEach(el=>{if(prop==='width'||prop==='height'){const box=this.boxSize(el);if(getComputedStyle(el).display==='inline'&&el.tagName!=='svg')S.set(el,'display','inline-block');this.freezeSize(el,prop==='width'?Math.max(this.min,n):box.width,prop==='height'?Math.max(this.min,n):box.height)}else S.set(el,prop,px(n),{strong:true})}))},
  clearDimension(prop){withHistory('Restaurar '+prop+' automático',selection(),()=>selection().forEach(e=>S.set(e,prop,'auto',{strong:true})))},
  offset(axis,value){const n=Number(value);if(!Number.isFinite(n))return;const els=selection();withHistory('Deslocamento '+axis,els,()=>els.forEach(el=>{const rec=this.record(el);if(rec.mode==='absolute')S.set(el,axis==='x'?'left':'top',px(n),{strong:true});else{this.ensureMove(el,rec);S.set(el,axis==='x'?'--ie-move-x':'--ie-move-y',px(n))}}))},
  preset(code){const el=selected();if(selection().length!==1||!['absolute','fixed'].includes(getComputedStyle(el).position))return;withHistory('Posicionar elemento',[el],()=>{const rec=this.record(el),r=el.getBoundingClientRect(),pr=rec.parentRect;const row=code[0],col=code[1];const x=col==='l'?pr.left:col==='c'?(pr.left+pr.right-r.width)/2:pr.right-r.width,y=row==='t'?pr.top:row==='m'?(pr.top+pr.bottom-r.height)/2:pr.bottom-r.height;this.writeMove(rec,x-r.left,y-r.top)})},
  setPositionMode(v){if(!['static','relative','absolute','fixed','sticky'].includes(v))return;withHistory('Modo de posição',selection(),()=>selection().forEach(e=>{S.set(e,'position',v);if(v==='static')for(const p of ['left','right','top','bottom'])S.set(e,p,'auto')}))},
  alignSingle(mode){const el=selected();if(!el||selection().length!==1)return;const pcs=getComputedStyle(el.parentElement),abs=this.moveMode(el)==='absolute';withHistory('Alinhar elemento',[el],()=>{
      if(abs){const rec=this.record(el),r=el.getBoundingClientRect(),pr=rec.parentRect;const x=mode==='left'?pr.left:mode==='center'?(pr.left+pr.right-r.width)/2:pr.right-r.width;this.writeMove(rec,x-r.left,0);return}
      el.style.removeProperty('--ie-move-x');el.style.removeProperty('--ie-move-y');el.classList.remove('ie-move-authored');S.set(el,'float','none');
      if(pcs.display.includes('grid')){S.set(el,'justifySelf',mode==='left'?'start':mode==='center'?'center':'end');S.set(el,'marginLeft','0px');S.set(el,'marginRight','0px')}
      else if(pcs.display.includes('flex')&&pcs.flexDirection.startsWith('column')){S.set(el,'alignSelf',mode==='left'?'flex-start':mode==='center'?'center':'flex-end');S.set(el,'marginLeft','0px');S.set(el,'marginRight','0px')}
      else{S.set(el,'display','block');S.set(el,'marginLeft',mode==='left'?'0px':'auto');S.set(el,'marginRight',mode==='right'?'0px':'auto')}
      el.dataset.ieAlign=mode;})},
  alignVertical(mode){const el=selected();if(!el||selection().length!==1)return;const pc=getComputedStyle(el.parentElement),valid=this.moveMode(el)==='absolute'||pc.display.includes('grid')||(pc.display.includes('flex')&&pc.flexDirection.startsWith('row'));if(!valid){notify('O container não oferece alinhamento vertical.');return}withHistory('Alinhar verticalmente',[el],()=>{if(this.moveMode(el)==='absolute'){const rec=this.record(el),r=rec.startRect,pr=rec.parentRect;const y=mode==='top'?pr.top:mode==='middle'?(pr.top+pr.bottom-r.height)/2:pr.bottom-r.height;this.writeMove(rec,0,y-r.top)}else{S.set(el,'alignSelf',mode==='top'?'start':mode==='middle'?'center':'end');S.set(el,'marginTop','0px');S.set(el,'marginBottom','0px')}})},
  install(){for(const h of $$('.ie-resize-handle',overlay))h.addEventListener('pointerdown',e=>this.startSession('resize',e,h.dataset.dir));$('#ie-move-handle').addEventListener('pointerdown',e=>this.startSession('move',e));
    window.addEventListener('pointermove',e=>{if(EditorState.geometry)this.queue(e)},{capture:true,passive:false});
    window.addEventListener('pointerup',e=>this.end(e),true);window.addEventListener('pointercancel',e=>this.end(e,true),true);window.addEventListener('blur',()=>this.cancel())
  }
};
const GroupController={
  compatible(els=selection()){return els.length>1&&els.every(e=>e.parentElement===els[0].parentElement)},
  require(){if(!this.compatible()){notify('Selecione pelo menos dois elementos do mesmo container. A operação foi bloqueada para preservar o layout.');return null}return selection()},
  align(mode){const els=this.require();if(!els)return;const bound=Utils.bound(els),recs=els.map(e=>GeometryController.record(e));withHistory('Alinhar '+els.length+' elementos',els,()=>recs.forEach(rec=>{const r=rec.startRect;const dx=mode==='left'?bound.left-r.left:mode==='center'?(bound.left+bound.right-r.left-r.right)/2:mode==='right'?bound.right-r.right:0;const dy=mode==='top'?bound.top-r.top:mode==='middle'?(bound.top+bound.bottom-r.top-r.bottom)/2:mode==='bottom'?bound.bottom-r.bottom:0;GeometryController.writeMove(rec,dx,dy)}))},
  distribute(axis,gap=null){const els=this.require();if(!els)return;if(gap==null&&els.length<3){notify('Distribuição exige três elementos. Para dois, defina uma distância.');return}const h=axis==='x',recs=els.map(e=>GeometryController.record(e)).sort((a,b)=>a.startRect[h?'left':'top']-b.startRect[h?'left':'top']);
    const first=recs[0].startRect,last=recs.at(-1).startRect,total=recs.reduce((v,r)=>v+r.startRect[h?'width':'height'],0);let g=gap==null?(last[h?'right':'bottom']-first[h?'left':'top']-total)/(recs.length-1):Number(gap);if(!Number.isFinite(g)||g<0){notify('Não há espaço livre suficiente; indique um espaçamento positivo.');return}
    withHistory('Distribuir '+els.length+' elementos',els,()=>{let cursor=first[h?'left':'top'];for(const rec of recs){GeometryController.writeMove(rec,h?cursor-rec.startRect.left:0,h?0:cursor-rec.startRect.top);cursor+=rec.startRect[h?'width':'height']+g}})
  }
};
const OverlayManager={
  intersects(a,b,p=4){return a.left<b.right+p&&a.right>b.left-p&&a.top<b.bottom+p&&a.bottom>b.top-p},
  previewMove(dx,dy){overlay.style.transform=`translate3d(${dx}px,${dy}px,0)`;const root=$('#ie-multi-outlines');if(root)root.style.transform=`translate3d(${dx}px,${dy}px,0)`},
  clearGesturePreview(){overlay.style.removeProperty('transform');const root=$('#ie-multi-outlines');if(root)root.style.removeProperty('transform')},
  placeGrab(grab,r){const w=grab.offsetWidth||76,h=grab.offsetHeight||27,p=7,tb=!toolbar.hidden?toolbar.getBoundingClientRect():null;const within=(x,y)=>x>=p&&y>=p&&x+w<=innerWidth-p&&y+h<=innerHeight-p;const free=(x,y)=>{const q={left:x,top:y,right:x+w,bottom:y+h};return within(x,y)&&(!tb||!this.intersects(q,tb,6))};
    const xs=[clamp(r.left,p,innerWidth-w-p),clamp(r.right-w,p,innerWidth-w-p),clamp((r.left+r.right-w)/2,p,innerWidth-w-p)],ys=[r.top-h-5,r.bottom+5,clamp((r.top+r.bottom-h)/2,p,innerHeight-h-p)];const candidates=[[xs[0],ys[0]],[xs[1],ys[0]],[xs[0],ys[1]],[xs[1],ys[1]],[r.right+5,ys[2]],[r.left-w-5,ys[2]],[xs[2],ys[0]],[xs[2],ys[1]]];let hit=candidates.find(([x,y])=>free(x,y));
    if(!hit){const side=tb&&tb.left<innerWidth/2?innerWidth-w-p:p;hit=[side,clamp(r.top,p,innerHeight-h-p)]}grab.style.left=(hit[0]-r.left)+'px';grab.style.top=(hit[1]-r.top)+'px';grab.dataset.iePlacement='safe';
  },
  update(){const els=selection(),root=$('#ie-multi-outlines');if(!EditorState.geometry)this.clearGesturePreview();root.replaceChildren();if(!EditorState.editMode||!els.length){overlay.hidden=true;return}const r=Utils.bound(els);overlay.hidden=false;Object.assign(overlay.style,{left:r.left+'px',top:r.top+'px',width:r.width+'px',height:r.height+'px'});
    if(els.length>1)for(const el of els){const b=el.getBoundingClientRect(),n=document.createElement('div');n.className=el===selected()?'ie-outline ie-primary-outline':'ie-outline';Object.assign(n.style,{left:b.left+'px',top:b.top+'px',width:b.width+'px',height:b.height+'px'});root.appendChild(n)}
    const resizable=els.length===1&&GeometryController.isResizable(els[0]);for(const h of $$('.ie-resize-handle',overlay))h.hidden=!resizable;
    const grab=$('#ie-move-handle');grab.hidden=!els.every(e=>GeometryController.canMove(e))||!(EditorState.freeMove||els.every(e=>GeometryController.moveMode(e)==='absolute'));grab.textContent=els.length>1?'⠿ Mover grupo':'⠿ Mover';if(!grab.hidden&&!EditorState.geometry)this.placeGrab(grab,r);
  },
  install(){window.addEventListener('scroll',()=>this.update(),true);window.addEventListener('resize',()=>{GeometryController.cancel();this.update();ToolbarController.clampPosition()})}
};
