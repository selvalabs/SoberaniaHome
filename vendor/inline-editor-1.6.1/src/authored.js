(function(){
'use strict';
if(window.IEAuthored?.version==='1.5.1')return;
// Production-only runtime. It never creates toolbox controls or modifies site copy.
const records=new Map(),reduce=matchMedia('(prefers-reduced-motion: reduce)');let scheduled=false;
const meta=e=>{try{return JSON.parse(e.getAttribute('data-ie-effects')||'{}')}catch(_){return{}}};
const identity={transform:'translate(0px,0px) rotate(0deg) scale(1)',filter:'brightness(1)',boxShadow:'0px 0px 0px 0px rgba(0,0,0,0)',clipPath:'inset(0% 0% 0% 0%)',opacity:1};
const num=(v,f=0)=>Number.isFinite(Number(v))?Number(v):f;
function cancel(rec,k){(rec.channels[k]||[]).forEach(a=>a.cancel());delete rec.channels[k]}
function spec(e,k,c){const i=Math.max(0,Math.min(100,num(c.intensity,50)))/100,id=c.id;const n=(x)=>Math.round(x*1000)/1000;
  const tr=(x=0,y=0,s=1,r=0)=>`translate(${n(x)}px,${n(y)}px) rotate(${n(r)}deg) scale(${n(s)})`;
  const shadow=(y,b,a)=>`drop-shadow(0px ${n(y)}px ${n(b)}px rgba(180,154,190,${n(a)}))`;
  const zero={}, light={filter:`brightness(${1+.5*i})`};let frames=[],duration=Math.max(.05,num(c.duration,k==='loop'?5:.6))*1000;
  if(k==='hover'){
    const target={lift:{transform:tr(0,-12*i)},scale:{transform:tr(0,0,1+.13*i)},shadow:{filter:shadow(12*i,16*i,.55*i)},glow:{filter:shadow(0,20*i,.7*i)},brighten:light,dim:{filter:`brightness(${1-.45*i})`},shift:{transform:tr(18*i)},border:{boxShadow:`inset 0 0 0 ${n(4*i)}px rgba(180,154,190,${i})`},'tilt-left':{transform:tr(0,0,1,-7*i)},'tilt-right':{transform:tr(0,0,1,7*i)},'zoom-glow':{transform:tr(0,0,1+.1*i),filter:shadow(0,18*i,.6*i)},'desaturate-color':{filter:'grayscale(0%)'},'color-desaturate':{filter:`grayscale(${100*i}%)`},'blur-clear':{filter:'blur(0px)'},'shadow-side':{filter:`drop-shadow(${n(14*i)}px ${n(8*i)}px ${n(12*i)}px rgba(50,36,54,${.35*i}))`},depth:{transform:`perspective(900px) rotateX(${n(9*i)}deg) translateY(${n(-5*i)}px)`}}[id]||zero;
    const from=id==='desaturate-color'?{filter:`grayscale(${100*i}%)`}:id==='blur-clear'?{filter:`blur(${n(3*i)}px)`}:zero;frames=[from,target];
  }else if(k==='enter'){
    const target=zero,from={fade:{opacity:1-i},up:{transform:tr(0,50*i),opacity:1-i},down:{transform:tr(0,-50*i),opacity:1-i},left:{transform:tr(-60*i),opacity:1-i},right:{transform:tr(60*i),opacity:1-i},scale:{transform:tr(0,0,1-.2*i),opacity:1-i},blur:{filter:`blur(${n(14*i)}px)`,opacity:1-i},rotate:{transform:tr(0,0,1,-12*i),opacity:1-i},'zoom-up':{transform:tr(0,45*i,1-.2*i),opacity:1-i},'clip-x':{clipPath:`inset(0 ${100*i}% 0 0)`},'clip-y':{clipPath:`inset(0 0 ${100*i}% 0)`},drop:{transform:tr(0,-65*i),opacity:1-i},pop:{transform:tr(0,0,1-.3*i),opacity:1-i},diagonal:{transform:tr(-45*i,45*i),opacity:1-i}}[id]||zero;
    frames=(id==='pop'||id==='drop')?[from,{transform:tr(0,id==='drop'?7*i:0,id==='pop'?1+.06*i:1)},target]:[from,target];
  }else if(k==='loop'){
    const peak={float:{transform:tr(0,-14*i)},breathe:{transform:tr(0,0,1+.045*i)},opacity:{opacity:1-.25*i},glow:{filter:shadow(0,18*i,.65*i)},sway:{transform:tr(0,0,1,4*i)},drift:{transform:tr(18*i)},bob:{transform:tr(0,-23*i)},brightness:light,'border-pulse':{boxShadow:`0 0 0 ${n(5*i)}px rgba(180,154,190,${.48*i})`},shimmer:{filter:`brightness(${1+.35*i}) contrast(${1+.16*i})`},pendulum:{transform:tr(0,0,1,8*i)},bounce:{transform:tr(0,-9*i)}}[id]||zero;
    if(id==='rotate'){duration=duration/Math.max(.1,i);frames=[{transform:'rotate(0deg)'},{transform:'rotate(360deg)'}]}
    else if(id==='pendulum'||id==='sway')frames=[{transform:tr(0,0,1,-(id==='sway'?4:8)*i)},peak,{transform:tr(0,0,1,-(id==='sway'?4:8)*i)}];
    else frames=[zero,peak,zero];
  }else{const peak={press:{transform:tr(0,2*i,1-.05*i)},tap:{transform:tr(0,0,1-.1*i)},sink:{transform:tr(0,7*i)},flash:{filter:shadow(0,22*i,.75*i)},pulse:{transform:tr(0,0,1+.075*i)}}[id]||zero;frames=[zero,peak,zero]}
  return{frames,duration,intensity:i};
}

// Registered numeric/color channels let animations coexist with explicit authored !important
// filters, opacity and borders. Animating the derived CSS property itself would lose to !important.
const groups=['hover','enter','loop','interaction'];
const channelDefs={brightness:['<number>','1'],contrast:['<number>','1'],grayscale:['<number>','0'],blur:['<length>','0px'],dx:['<length>','0px'],dy:['<length>','0px'],db:['<length>','0px'],dc:['<color>','transparent'],sw:['<length>','0px'],sc:['<color>','transparent'],alpha:['<number>','1'],cx:['<percentage>','0%'],cy:['<percentage>','0%']};
for(const k of groups)for(const [p,[syntax,initialValue]] of Object.entries(channelDefs))try{CSS.registerProperty({name:`--ie-fx-${k}-${p}`,syntax,initialValue,inherits:false})}catch(_){}
function managed(rec,p,value){if(!rec.originals[p])rec.originals[p]={value:rec.el.style.getPropertyValue(p),priority:rec.el.style.getPropertyPriority(p)};rec.el.style.setProperty(p,value,'important');rec.managed[p]=rec.el.style.getPropertyValue(p)}
function prepareChannel(rec,p){if(rec.managed[p])return;
  const cs=getComputedStyle(rec.el),base=cs[p];
  if(p==='filter')managed(rec,p,(base==='none'?'':base+' ')+groups.map(k=>`brightness(var(--ie-fx-${k}-brightness,1)) contrast(var(--ie-fx-${k}-contrast,1)) grayscale(var(--ie-fx-${k}-grayscale,0)) blur(var(--ie-fx-${k}-blur,0px)) drop-shadow(var(--ie-fx-${k}-dx,0px) var(--ie-fx-${k}-dy,0px) var(--ie-fx-${k}-db,0px) var(--ie-fx-${k}-dc,transparent))`).join(' '));
  if(p==='opacity')managed(rec,p,`calc(${Number.isFinite(parseFloat(base))?parseFloat(base):1} * ${groups.map(k=>`var(--ie-fx-${k}-alpha,1)`).join(' * ')})`);
  if(p==='boxShadow'){const orig=cs.boxShadow==='none'?'':cs.boxShadow+', ';managed(rec,'box-shadow',orig+groups.map(k=>`${k==='hover'?'inset ':''}0 0 0 var(--ie-fx-${k}-sw,0px) var(--ie-fx-${k}-sc,transparent)`).join(', '));rec.managed.boxShadow=rec.managed['box-shadow'];}
  if(p==='clipPath'){managed(rec,'clip-path','inset(0 var(--ie-fx-enter-cx,0%) var(--ie-fx-enter-cy,0%) 0)');rec.managed.clipPath=rec.managed['clip-path'];}
}
function filterParts(s){const v={brightness:'1',contrast:'1',grayscale:'0',blur:'0px',dx:'0px',dy:'0px',db:'0px',dc:'transparent'};for(const p of ['brightness','contrast','grayscale','blur']){const m=s.match(new RegExp(p+'\\(([^)]+)\\)'));if(m)v[p]=p==='blur'?m[1]:(m[1].includes('%')?String(parseFloat(m[1])/100):m[1]);}
  const drop=s.match(/drop-shadow\((.*)\)$/);if(drop){const lengths=drop[1].match(/-?[\d.]+px/g)||[];v.dx=lengths[0]||'0px';v.dy=lengths[1]||'0px';v.db=lengths[2]||'0px';v.dc=drop[1].match(/rgba?\([^)]+\)/)?.[0]||'transparent';}return v;}
function channelFrame(k,p,v){let fields={};if(p==='filter')fields=filterParts(v);if(p==='opacity')fields={alpha:String(v)};if(p==='boxShadow'){fields={sw:(String(v).match(/-?[\d.]+px/g)||[])[3]||'0px',sc:String(v).match(/rgba?\([^)]+\)/)?.[0]||'transparent'};}if(p==='clipPath'){const a=String(v).match(/-?[\d.]+%?/g)||[];fields={cx:(a[1]||'0')+(a[1]?.includes('%')?'':'%'),cy:(a[2]||'0')+(a[2]?.includes('%')?'':'%')};}return Object.fromEntries(Object.entries(fields).map(([key,x])=>[`--ie-fx-${k}-${key}`,x]));}
function restoreManaged(rec,root=null){let el=rec.el;if(root){const key=el.dataset.ieEffectKey;el=key?(root.matches?.(`[data-ie-effect-key="${CSS.escape(key)}"]`)?root:root.querySelector(`[data-ie-effect-key="${CSS.escape(key)}"]`)):null}if(!el)return;
  for(const [p,orig] of Object.entries(rec.originals)){const applied=rec.managed[p];if(el.style.getPropertyValue(p)===applied){if(orig.value)el.style.setProperty(p,orig.value,orig.priority);else el.style.removeProperty(p)}}}
function play(rec,k,{preview=false,reverse=false}={}){const c=rec.config[k];if(!c?.id||reduce.matches)return;cancel(rec,k);const {frames:source,duration,intensity}=spec(rec.el,k,c);if(!intensity)return;
  let frames=source;if(reverse)frames=[...frames].reverse();const props=new Set(frames.flatMap(f=>Object.keys(f))),baseOpacity=parseFloat(getComputedStyle(rec.el).opacity)||1;
  const anims=[];for(const p of props){let fs=frames.map((frame,index)=>({[p]:(frame[p]??identity[p]),offset:index/(frames.length-1)}));const isChannel=['filter','opacity','boxShadow','clipPath'].includes(p);if(isChannel){prepareChannel(rec,p);fs=fs.map(f=>({...channelFrame(k,p,f[p]),offset:f.offset}));}
    const loop=k==='loop'&&!preview;const timing={duration,iterations:loop?Infinity:1,fill:k==='hover'?'both':k==='enter'?'backwards':'none',easing:(loop&&c.id==='rotate')?'linear':'ease-in-out',delay:k==='enter'?Math.max(0,num(c.delay))*1000:0,composite:p==='transform'?'add':'replace'};
    try{const a=rec.el.animate(fs,timing);a.id=`ie-${k}-${p}`;anims.push(a);if(!loop&&k!=='hover')a.finished.then(()=>a.cancel()).catch(()=>{})}catch(e){console.warn('Inline Editor: animation unavailable',p,e.message)}
  }rec.channels[k]=anims;
  if(preview&&k==='hover')setTimeout(()=>{if(records.get(rec.el)===rec)play(rec,k,{reverse:true})},Math.min(duration+600,3000));
}
function remove(rec){for(const k of Object.keys(rec.channels))cancel(rec,k);restoreManaged(rec);rec.listeners.forEach(([type,fn])=>rec.el.removeEventListener(type,fn));observer?.unobserve(rec.el);records.delete(rec.el)}
function bind(el){const config=meta(el),signature=JSON.stringify([config,el.getAttribute('data-ie-visual'),el.getAttribute('data-ie-fx-style-revision')]);let rec=records.get(el);if(rec?.signature===signature)return;if(rec)remove(rec);
  if(!el.dataset.ieEffectKey)el.dataset.ieEffectKey='iefx-'+Math.random().toString(36).slice(2,10);rec={el,config,signature,channels:{},listeners:[],entered:false,originals:{},managed:{}};records.set(el,rec);const on=(type,fn)=>{el.addEventListener(type,fn);rec.listeners.push([type,fn])};
  on('pointerenter',()=>play(rec,'hover'));on('pointerleave',()=>{if(rec.config.hover)play(rec,'hover',{reverse:true})});on('focusin',()=>play(rec,'hover'));on('focusout',()=>{if(rec.config.hover)play(rec,'hover',{reverse:true})});on('pointerdown',()=>play(rec,'interaction'));on('keydown',e=>{if(e.key==='Enter'||e.key===' ')play(rec,'interaction')});
  if(['desaturate-color','blur-clear'].includes(config.hover?.id))play(rec,'hover',{reverse:true});play(rec,'loop');if(config.enter?.id)observer?.observe(el);
}
const observer='IntersectionObserver'in window?new IntersectionObserver(entries=>entries.forEach(entry=>{const rec=records.get(entry.target);if(rec&&entry.isIntersecting&&!rec.entered){rec.entered=true;play(rec,'enter');observer.unobserve(entry.target)}}),{threshold:.12}):null;
function renderDecor(){let style=document.querySelector('#ie-authored-decorations');if(!style){style=document.createElement('style');style.id='ie-authored-decorations';style.setAttribute('data-ie-authored','');document.head.appendChild(style)}const rules=[];
  for(const e of document.querySelectorAll('[data-ie-decor][data-ie-decor-key]')){let m;try{m=JSON.parse(e.dataset.ieDecor)}catch(_){continue}const key=e.dataset.ieDecorKey;if(!/^[\w-]+$/.test(key))continue;
    for(const side of ['before','after']){const v=m[side];if(!v)continue;const text=String(v.content||'').replace(/\\/g,'\\\\').replace(/"/g,'\\"').replace(/\n/g,'\\A ').replace(/</g,'\\3c ');
      const col=/^#[0-9a-f]{6}$/i.test(v.color)?v.color:'#342b36',bg=/^#[0-9a-f]{6}$/i.test(v.backgroundColor)?v.backgroundColor:'transparent';
      rules.push(`[data-ie-decor-key="${key}"]::${side}{content:"${text}"!important;color:${col}!important;background-color:${bg}!important;font-size:${num(v.fontSize,14)}px!important;padding:${num(v.paddingY)}px ${num(v.paddingX)}px!important;border-radius:${num(v.radius)}px!important;letter-spacing:${num(v.letterSpacing)}px!important;translate:${num(v.x)}px ${num(v.y)}px!important;white-space:pre-wrap;}`)
    }
  }const text=rules.join('\n');if(style.textContent!==text)style.textContent=text;
}
function refresh(){for(const [e,r] of records)if(!e.isConnected||!e.hasAttribute('data-ie-effects'))remove(r);document.querySelectorAll('[data-ie-effects]').forEach(e=>{if(!e.closest('[data-ie-runtime]'))bind(e)});renderDecor()}
function schedule(){if(scheduled)return;scheduled=true;queueMicrotask(()=>{scheduled=false;refresh()})}
function underlyingStyle(el,prop){const rec=records.get(el),p=prop.replace(/[A-Z]/g,c=>'-'+c.toLowerCase());if(!rec||!rec.managed[p]||el.style.getPropertyValue(p)!==rec.managed[p])return getComputedStyle(el).getPropertyValue(p);const original=rec.originals[p],current=el.style.getPropertyValue(p),priority=el.style.getPropertyPriority(p);if(original?.value)el.style.setProperty(p,original.value,original.priority);else el.style.removeProperty(p);const value=getComputedStyle(el).getPropertyValue(p);el.style.setProperty(p,current,priority);return value;}
window.IEAuthored={version:'1.5.1',refresh,underlyingStyle,cleanClone(root){for(const rec of records.values())restoreManaged(rec,root);return root;},preview(e,k){const rec=records.get(e);if(rec)play(rec,k,{preview:true})},spec,dispose(){for(const r of [...records.values()])remove(r)}};
function boot(){refresh();new MutationObserver(schedule).observe(document.body,{subtree:true,childList:true,attributes:true,attributeFilter:['data-ie-effects','data-ie-decor','data-ie-decor-key']});reduce.addEventListener('change',()=>{for(const r of [...records.values()])remove(r);refresh()})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
