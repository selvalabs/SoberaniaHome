(function(){
'use strict';
// Inline Editor __IE_VERSION__ — single runtime. Source modules are concatenated by tools/build.mjs.
if(window.InlineEditor && document.querySelector('#ie-toolbar[data-ie-booted]')) return;
const VERSION='__IE_VERSION__', HISTORY_LIMIT=100, STORAGE_PREFIX='ie-v15-';
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>Array.from(r.querySelectorAll(s));
const toolbar=$('#ie-toolbar'), overlay=$('#ie-selection-overlay');
if(!toolbar || !overlay) return;
const RUNTIME_UI_ORIGINAL=new Map($$('body > [data-ie-runtime]').filter(e=>!['STYLE','SCRIPT'].includes(e.tagName)).map(e=>[e.id,e.outerHTML]));
const EditorState={editMode:false, selected:null, selectionSet:[], savedRange:null, textRange:null, freeMove:false, smartGuides:true,
  snapping:true, lockRatio:true, multiMode:false, geometry:null, saving:false, closed:false};
const selected=()=>EditorState.selected;
const selection=()=>EditorState.selectionSet.filter(e=>e.isConnected);
const ctx=()=>SelectionEngine.contextOf(selected());
const safeNum=(v,f=0)=>Number.isFinite(parseFloat(v))?parseFloat(v):f;
const px=v=>`${Math.round(v*100)/100}px`;
const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
const Storage={get(k,f=null){try{return JSON.parse(localStorage.getItem(STORAGE_PREFIX+k))??f}catch(_){return f}},set(k,v){try{localStorage.setItem(STORAGE_PREFIX+k,JSON.stringify(v))}catch(_){}}};
const TRANSIENT_ATTRS=new Set(['data-ie-selected','data-ie-multi','contenteditable','spellcheck','data-ie-gesture']);
const Utils={
  getNum:safeNum, px, clamp,
  cssProp(p){return p.startsWith('--')?p:p.replace(/[A-Z]/g,c=>'-'+c.toLowerCase())},
  isRuntime(e){return !!e?.closest?.('[data-ie-runtime],#ie-toolbar,#ie-selection-overlay,#ie-tooltip,#ie-dialog,#ie-snackbar')},
  isProtected(e){return !e||e.nodeType!==1||this.isRuntime(e)||!!e.closest?.('script,style,head,iframe,canvas,noscript,[data-ie-protected]')||e===document.body||e===document.documentElement},
  label(e){if(!e)return'Sem seleção';return `${String(e.tagName).toLowerCase()}${e.id?'#'+e.id:'.'+([...e.classList].find(c=>!c.startsWith('ie-'))||'elemento')}`.slice(0,60)},
  visible(e){const c=getComputedStyle(e),r=e.getBoundingClientRect();return c.display!=='none'&&c.visibility!=='hidden'&&r.width>0&&r.height>0},
  rgbToHex(v){const m=String(v).match(/rgba?\(\s*(\d+)[, ]+\s*(\d+)[, ]+\s*(\d+)/);return m?'#'+m.slice(1,4).map(x=>(+x).toString(16).padStart(2,'0')).join(''):'#000000'},
  rgba(hex,a=1){if(!/^#[0-9a-f]{6}$/i.test(hex))return 'rgba(0,0,0,'+a+')';return `rgba(${[1,3,5].map(i=>parseInt(hex.slice(i,i+2),16)).join(',')},${clamp(a,0,1)})`},
  fileToDataURL(f){return new Promise((resolve,reject)=>{const r=new FileReader();r.onload=()=>resolve(r.result);r.onerror=()=>reject(new Error('Não foi possível ler o arquivo.'));r.readAsDataURL(f)})},
  json(e,k,f={}){try{return JSON.parse(e.getAttribute(k)||'null')??f}catch(_){return f}},
  bound(els){const rs=els.map(e=>e.getBoundingClientRect());const left=Math.min(...rs.map(r=>r.left)),top=Math.min(...rs.map(r=>r.top)),right=Math.max(...rs.map(r=>r.right)),bottom=Math.max(...rs.map(r=>r.bottom));return{left,top,right,bottom,width:right-left,height:bottom-top}},
  roots(els){return [...new Set(els)].filter(e=>!els.some(p=>p!==e&&p.contains(e)))},
  safeUrl(v){try{const u=new URL(v,location.href==='about:blank'?'https://local.invalid':location.href);return ['http:','https:','mailto:','tel:'].includes(u.protocol)||String(v).startsWith('#')}catch(_){return false}},
  escapeCssText(v){return String(v).replace(/\\/g,'\\\\').replace(/"/g,'\\"').replace(/\n/g,'\\A ').replace(/</g,'\\3c ')}
};
const Toast={timer:null,notify(m,ms=2800){const t=$('#ie-toast');t.textContent=m;t.hidden=false;clearTimeout(this.timer);this.timer=setTimeout(()=>t.hidden=true,ms)}};
const notify=m=>Toast.notify(m);
const StyleEngine={
  authoredProp(e,p){const a=new Set((e.getAttribute('data-ie-authored-style-props')||'').split(',').filter(Boolean));a.add(Utils.cssProp(p));e.setAttribute('data-ie-authored-style-props',[...a].join(','))},
  valueMatches(e,p,v){p=Utils.cssProp(p);const c=getComputedStyle(e).getPropertyValue(p).trim();if(!v)return!e.style.getPropertyValue(p);
    if(/^-?[\d.]+px$/.test(v))return Math.abs(safeNum(c)-safeNum(v))<.55;
    if(p==='opacity')return Math.abs(safeNum(c)-safeNum(v))<.01;
    return c.toLowerCase()===String(v).toLowerCase()||c.toLowerCase().includes(String(v).toLowerCase());},
  set(e,p,v,{strong=false}={}){if(!e)return; p=Utils.cssProp(p);if(v==null||v===''){e.style.removeProperty(p);this.authoredProp(e,p);return}
    // Preserve existing inline importance; host !important must not recover geometry on release.
    const priority=strong||e.style.getPropertyPriority(p)==='important'?'important':'';
    e.style.setProperty(p,String(v),priority);
    if(!priority&&!this.valueMatches(e,p,String(v)))e.style.setProperty(p,String(v),'important');this.authoredProp(e,p);},
  clearAuthored(e){(e.getAttribute('data-ie-authored-style-props')||'').split(',').filter(Boolean).forEach(p=>e.style.removeProperty(p));e.removeAttribute('data-ie-authored-style-props')}
};
const S=StyleEngine,U=Utils;
// Synchronization never mutates authored DOM; UI reads are deliberately one-way.
let syncQueued=false;
function syncUI(){if(syncQueued)return;syncQueued=true;queueMicrotask(()=>{syncQueued=false;ToolbarController.sync();OverlayManager.update();DirtyStateGuard.refresh()})}
function withHistory(label,e,fn,opts={}){if(!e)return;HistoryManager.mutate(label,Array.isArray(e)?e:[e],fn,opts)}
