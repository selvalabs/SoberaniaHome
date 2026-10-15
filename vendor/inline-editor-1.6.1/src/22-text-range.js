/* Text services v1.5.4. Runtime-only selection state; authored spans survive saving.
 * Bookmarks use UTF-16 offsets within one editing root, not browser pixel positions.
 * The formatter splits Text nodes in place: no block-wide extractContents().
 */
const TextRangeController={
  toolbarFocused:false,
  fresh(){return {elementId:null,range:null,collapsed:true,mode:'block',start:0,end:0,backward:false,invalid:false}},
  clear(){EditorState.savedRange=null;EditorState.textRange=this.fresh();this.renderScope()},
  root(){return selection().length===1&&['text','link','table_cell'].includes(ctx())?selected():null},
  nodes(root){const w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT),out=[];while(w.nextNode())out.push(w.currentNode);return out},
  allowed(n,root){const p=n.parentElement;return !!p&&!p.closest('script,style,svg,math,input,textarea,select,[data-ie-protected],[contenteditable="false"],[aria-hidden="true"],.arrow')&&root.contains(n)},
  entries(root){let offset=0;return this.nodes(root).map(node=>{const start=offset;offset+=node.length;return {node,start,end:offset,allowed:this.allowed(node,root)}})},
  bookmark(root,r){if(!r||!root.contains(r.startContainer)||!root.contains(r.endContainer))return null;
    const a=document.createRange();a.selectNodeContents(root);a.setEnd(r.startContainer,r.startOffset);const start=a.toString().length;
    a.setEnd(r.endContainer,r.endOffset);return {start,end:a.toString().length,collapsed:r.collapsed};},
  rangeAt(root,b){if(!root?.isConnected||!b)return null;const ns=this.nodes(root),total=ns.reduce((s,n)=>s+n.length,0);if(b.start<0||b.end<b.start||b.end>total)return null;
    const r=document.createRange();if(!ns.length){r.selectNodeContents(root);r.collapse(true);return r}
    const point=(offset,end=false)=>{let pos=0;for(let i=0;i<ns.length;i++){const n=ns[i];if(offset<pos+n.length||(end&&offset===pos+n.length)||i===ns.length-1)return [n,Math.max(0,Math.min(n.length,offset-pos))];pos+=n.length}return [root,0]};
    const [an,ao]=point(b.start),[bn,bo]=point(b.end,true);r.setStart(an,ao);r.setEnd(bn,bo);return r;},
  remember(root,r,{backward=false,invalid=false}={}){const b=this.bookmark(root,r);if(!b)return false;
    EditorState.textRange={elementId:H.ensureId(root),range:r.cloneRange(),...b,mode:r.collapsed?'caret':'range',backward,invalid};EditorState.savedRange=r.collapsed?null:r.cloneRange();this.renderScope();return true;},
  capture(){const root=this.root();if(!EditorState.editMode||!root){this.clear();return false}const sel=getSelection();if(!sel?.rangeCount)return false;const r=sel.getRangeAt(0);
    if(root.contains(r.startContainer)&&root.contains(r.endContainer)){const backwards=sel.anchorNode===r.endContainer&&sel.anchorOffset===r.endOffset&&!r.collapsed;return this.remember(root,r,{backward:backwards})}
    // A real selection crossing editing roots is unsupported; never silently style the whole block.
    if(!sel.isCollapsed&&(root.contains(sel.anchorNode)||root.contains(sel.focusNode))){this.clear();EditorState.textRange.invalid=true;this.renderScope()}
    return false;},
  freeze(){if(!this.toolbarFocused&&!Utils.isRuntime(document.activeElement))this.capture();return this.resolve()},
  resolve(){const root=this.root(),s=EditorState.textRange;if(!root||s?.elementId!==H.ensureId(root))return null;
    let b=null;if(s.range&&s.range.startContainer.isConnected&&root.contains(s.range.startContainer)&&root.contains(s.range.endContainer))b=this.bookmark(root,s.range);
    if(!b)b={start:s.start,end:s.end,collapsed:s.collapsed};const range=this.rangeAt(root,b);return range?{root,range,...b,backward:s.backward,mode:b.collapsed?'caret':'range'}:null;},
  restore(root,b,{focus=false,native=(!TextRangeController.toolbarFocused&&!Utils.isRuntime(document.activeElement))}={}){const r=this.rangeAt(root,b);if(!r)return false;if(focus){this.toolbarFocused=false;root.focus({preventScroll:true})}
    this.remember(root,r,{backward:!!b.backward});if(native||focus){const sel=getSelection();sel.removeAllRanges();sel.addRange(r);if(b.backward&&sel.setBaseAndExtent)sel.setBaseAndExtent(r.endContainer,r.endOffset,r.startContainer,r.startOffset)}return true;},
  pieces(root,b){return this.entries(root).filter(e=>e.allowed&&e.end>b.start&&e.start<b.end&&e.node.length).map(e=>({...e,from:Math.max(0,b.start-e.start),to:Math.min(e.node.length,b.end-e.start)}))},
  samples(){const r=this.resolve();return r&&r.mode==='range'?this.pieces(r.root,r).map(e=>e.node.parentElement):[]},
  renderScope(){const el=$('#ie-text-scope');if(!el)return;const n=selection().length,s=EditorState.textRange,valid=this.root()&&s?.elementId===H.ensureId(selected());
    let label='BLOCO',help='Sem trecho selecionado, a formatação afeta o elemento textual inteiro.';
    if(n>1){label=n+' BLOCOS';help='Formatação em lote nos elementos textuais completos. Não há seleção parcial em vários blocos.'}
    else if(s?.invalid){label='SELEÇÃO FORA DO BLOCO';help='Selecione um trecho dentro de um único texto para formatá-lo.'}
    else if(valid&&s.mode==='range'){label='TRECHO';help='A formatação será aplicada apenas ao texto selecionado.'}
    else if(valid&&s.mode==='caret'){label='CARET';help='Você está digitando neste ponto. Selecione um trecho para formatar só uma parte; sem trecho, o ajuste vale para o bloco.'}
    el.textContent='Escopo: '+label;el.dataset.help=help;el.dataset.scope=n>1?'batch':s?.invalid?'invalid':valid?s.mode:'block';},
  syncTypography(ui){this.renderScope();const els=this.samples();if(!els.length)return;
    const bind=(id,prop,fn=v=>v)=>{const vs=els.map(e=>fn(getComputedStyle(e)[prop]));ui.set(id,vs[0],vs.some(v=>String(v)!==String(vs[0])))};
    bind('ie-font-size','fontSize',v=>Math.round(safeNum(v)*100)/100);bind('ie-font-weight','fontWeight',v=>safeNum(v,400));bind('ie-letter-spacing','letterSpacing',safeNum);bind('ie-text-transform','textTransform');bind('ie-text-color','color',U.rgbToHex);bind('ie-text-bg','backgroundColor',U.rgbToHex);
    const lh=els.map(e=>{const c=getComputedStyle(e);return Math.round((c.lineHeight==='normal'?1.2:safeNum(c.lineHeight)/safeNum(c.fontSize,16))*100)/100});ui.set('ie-line-height',lh[0],lh.some(v=>v!==lh[0]));
    const families=els.map(e=>getComputedStyle(e).fontFamily),ff=$('#ie-font-family');for(const f of new Set(families))if(![...ff.options].some(o=>o.value===f)){const o=document.createElement('option');o.value=f;o.textContent=f;ff.appendChild(o)}ui.set('ie-font-family',families[0],families.some(f=>f!==families[0]));
    for(const [id,p,v] of [['ie-bold','fontWeight','700'],['ie-italic','fontStyle','italic'],['ie-underline','textDecorationLine','underline']]){const on=els.every(e=>InlineFormatEngine.isOn(e,p,v));$('#'+id).classList.toggle('ie-active',on);$('#'+id).setAttribute('aria-pressed',String(on))}
  },
  install(){EditorState.textRange=this.fresh();
    document.addEventListener('focusin',e=>{if(U.isRuntime(e.target))this.toolbarFocused=true;else if(this.root()?.contains(e.target))this.toolbarFocused=false},true);
    document.addEventListener('selectionchange',()=>{if(TextEditor.composing||this.toolbarFocused||Utils.isRuntime(document.activeElement))return;if(this.capture())syncUI()});}

};
const TR=TextRangeController;

const InlineFormatEngine={
  props:new Set(['font-family','font-size','font-weight','font-style','text-decoration-line','color','background-color','letter-spacing','line-height','text-transform']),
  run(e){return e?.nodeType===1&&e.matches('span[data-ie-text-run="1"]')},
  signature(e){return JSON.stringify([...e.style].sort().map(p=>[p,e.style.getPropertyValue(p),e.style.getPropertyPriority(p)]))},
  safe(e){return this.run(e)&&[...e.attributes].every(a=>['style','data-ie-text-run','data-ie-authored-style-props'].includes(a.name))},
  normalize(root){
    if(!root)return;for(const e of [...root.querySelectorAll('span[data-ie-text-run="1"]')].reverse()){
      if(!this.safe(e))continue;
      if(!e.hasChildNodes()){e.remove();continue}
      const child=e.childNodes.length===1?e.firstChild:null;
      if(this.safe(child)){for(const p of e.style)if(!child.style.getPropertyValue(p))child.style.setProperty(p,e.style.getPropertyValue(p),e.style.getPropertyPriority(p));e.replaceWith(child)}
    }
    for(const e of [...root.querySelectorAll('span[data-ie-text-run="1"]')]){
      if(!this.safe(e))continue;if(!e.style.length){e.replaceWith(...e.childNodes);continue}
      let n=e.nextSibling;while(this.safe(n)&&this.signature(e)===this.signature(n)){e.append(...n.childNodes);n.remove();n=e.nextSibling}
      e.removeAttribute('data-ie-authored-style-props');
    }
    root.normalize();
  },
  isolate(node){const p=node.parentElement;
    if(this.safe(p)&&[...p.childNodes].every(n=>n.nodeType===3)){
      const before=p.cloneNode(false),after=p.cloneNode(false);while(p.firstChild&&p.firstChild!==node)before.appendChild(p.firstChild);while(node.nextSibling)after.appendChild(node.nextSibling);
      if(before.hasChildNodes())p.before(before);if(after.hasChildNodes())p.after(after);return p;
    }
    const span=document.createElement('span');span.setAttribute('data-ie-text-run','1');node.before(span);span.appendChild(node);return span;
  },
  isOn(el,prop,on){const c=getComputedStyle(el);if(prop==='fontWeight')return safeNum(c.fontWeight,400)>=600;if(prop!=='textDecorationLine')return c[prop]===on;
    for(let e=el;e&&e!==document.body;e=e.parentElement){const cs=getComputedStyle(e);if(cs.textDecorationLine.includes(on))return true;if(e!==el&&['inline-block','inline-flex','inline-grid'].includes(cs.display))break;if(e===el&&cs.display==='inline-block')break}return false;
  },
  apply(root,b,prop,value){prop=U.cssProp(prop);if(!this.props.has(prop))throw new Error('Esta propriedade pertence ao bloco, não ao trecho.');
    const pieces=TR.pieces(root,b);if(!pieces.length)return;
    // Process right-to-left; splitText preserves original semantic element nodes and listeners.
    for(const part of pieces.reverse()){
      let node=part.node;if(part.to<node.length)node.splitText(part.to);if(part.from>0)node=node.splitText(part.from);
      const run=this.isolate(node);
      if(value==null||value==='')run.style.removeProperty(prop);else run.style.setProperty(prop,String(value),'important');
      // Text decorations propagate through normal inline boxes. An atomic inline isolates
      // an explicit "none" inside an existing <u> without deleting that semantic element.
      if(prop==='text-decoration-line'){
        if(value==='none'&&this.isOn(run.parentElement,'textDecorationLine','underline'))run.style.setProperty('display','inline-block');
        else if(run.style.display==='inline-block')run.style.removeProperty('display');
      }
    }
    this.normalize(root);
  },
  clear(root,b){const pieces=TR.pieces(root,b);for(const part of pieces.reverse()){
      let n=part.node;if(part.to<n.length)n.splitText(part.to);if(part.from)n=n.splitText(part.from);
      if(this.safe(n.parentElement)){const run=this.isolate(n);for(const p of this.props)run.style.removeProperty(p);if(run.style.display==='inline-block')run.style.removeProperty('display')}
    }this.normalize(root);}
};

const TextActivationController={
  pointerRoot:null, pointerId:null,
  primary:'h1,h2,h3,h4,h5,h6,p,li,dt,dd,blockquote,figcaption,label,a,button,td,th',
  nativeControl(t){return !!t?.closest?.('input,textarea,select,option,[data-ie-protected],[contenteditable="false"],svg')},
  rootFor(t){if(t?.nodeType!==1)t=t?.parentElement;if(!t||U.isProtected(t)||this.nativeControl(t))return null;
    const cell=t.closest('td,th');if(cell)return cell;
    let n=t,standalone=null,main=null;while(n&&n!==document.body&&!U.isProtected(n)){
      if(n.matches(this.primary)){
        // Do not make a container with nested blocks/lists an editing host (cells excepted).
        if(!n.querySelector('p,h1,h2,h3,h4,h5,h6,ul,ol,table,form,section,article,input,textarea,select'))main=n;
        else if(main)break;
      }
      if(!main&&!standalone&&SE.isTextualCandidate(n)&&!n.matches('[data-ie-text-run]'))standalone=n;
      if(n.matches('section,article,figure,header,footer,main')&&n!==t)break;n=n.parentElement;
    }
    return main||standalone;
  },
  install(){window.addEventListener('pointerdown',e=>{
      if(!EditorState.editMode)return;
      if(U.isRuntime(e.target)){TR.freeze();TR.toolbarFocused=true;if(!e.target.closest('#ie-text-color,#ie-text-bg'))TextEditor.finishColor();return}
      TextEditor.finishColor();TR.toolbarFocused=false;if(e.button!==0||e.ctrlKey||e.metaKey||e.altKey||EditorState.multiMode||EditorState.geometry||this.nativeControl(e.target)){this.pointerRoot=null;return}
      this.pointerRoot=null;const root=this.rootFor(e.target);if(!root)return;this.pointerRoot=root;this.pointerId=e.pointerId;
      if(selected()!==root||selection().length!==1)SE.select(root);else SE.refreshFlags();
      // Do not preventDefault or select-all: the native pointer gesture sets the caret/range.
    },true);
    window.addEventListener('pointerup',()=>{if(this.pointerRoot)queueMicrotask(()=>{TR.capture();syncUI()})},true);
    window.addEventListener('pointercancel',()=>{this.pointerRoot=null},true);
    window.addEventListener('keydown',e=>{
      if(!EditorState.editMode||e.isComposing||U.isRuntime(e.target)||selection().length!==1)return;
      const root=TR.root();if(!root?.contains(e.target))return;const mod=e.ctrlKey||e.metaKey,k=e.key.toLowerCase();
      if(mod&&!e.altKey&&['b','i','u'].includes(k)){e.preventDefault();e.stopImmediatePropagation();const c={b:['fontWeight','700','400','Negrito'],i:['fontStyle','italic','normal','Itálico'],u:['textDecorationLine','underline','none','Sublinhado']}[k];TR.capture();TextEditor.toggle(...c);return}
      if(e.key==='Enter'&&root.matches('a,button,[role=button]')){e.preventDefault();e.stopImmediatePropagation();TR.capture();const r=TR.resolve()?.range;if(!r)return;
        H.beginContinuous('Editar texto',[root],{deep:true});r.deleteContents();const br=document.createElement('br');r.insertNode(br);r.setStartAfter(br);r.collapse(true);TR.remember(root,r);getSelection().removeAllRanges();getSelection().addRange(r);DirtyStateGuard.changed();TextEditor.scheduleCommit();
      }
    },true);
  }
};
const TextNavigationController={
  roots(){const out=[];for(const e of $$('body h1,body h2,body h3,body h4,body h5,body h6,body p,body li,body dt,body dd,body blockquote,body figcaption,body label,body a,body button,body td,body th,body span,body strong,body em,body small,body div')){
      if(U.isProtected(e)||e.matches('[data-ie-text-run]')||e.closest('[hidden],[inert],[aria-hidden="true"],svg')||!U.visible(e)||!e.textContent.trim())continue;
      const root=TextActivationController.rootFor(e);if(root===e&&!out.includes(root))out.push(root);
    }return out.filter(e=>!out.some(p=>p!==e&&p.contains(e)));},
  navigate(back=false){const root=TR.root();if(!root)return false;TextEditor.finishColor();H.uiEnd();H.commitContinuous();
    const roots=this.roots();let i=roots.indexOf(root);if(i<0)i=roots.findIndex(e=>e.contains(root));const next=roots[i+(back?-1:1)];
    if(!next){notify(back?'Primeiro texto da página. O foco voltou à toolbox.':'Último texto da página. O foco voltou à toolbox.');$('#ie-save').focus();return true}
    ActionSnackbar.hide();SE.select(next);TR.restore(next,{start:back?next.textContent.length:0,end:back?next.textContent.length:0,backward:false},{focus:true});
    const r=next.getBoundingClientRect(),vh=window.visualViewport?.height||innerHeight;
    if(r.top<8||r.bottom>vh-8){
      if(matchMedia('(prefers-reduced-motion: reduce)').matches){
        // `auto` alone would still inherit a host's scroll-behavior:smooth.
        const scrollers=[];for(let e=next.parentElement;e;e=e.parentElement)scrollers.push([e,e.style.getPropertyValue('scroll-behavior'),e.style.getPropertyPriority('scroll-behavior')]);
        try{for(const [e] of scrollers)e.style.setProperty('scroll-behavior','auto','important');next.scrollIntoView({block:'center',behavior:'auto'})}
        finally{for(const [e,v,p] of scrollers){if(v)e.style.setProperty('scroll-behavior',v,p);else e.style.removeProperty('scroll-behavior')}}
      }else next.scrollIntoView({block:'center',behavior:'smooth'});
    }syncUI();return true;
  },
  install(){document.addEventListener('keydown',e=>{if(e.key!=='Tab'||e.ctrlKey||e.metaKey||e.altKey||e.isComposing||!EditorState.editMode||U.isRuntime(e.target)||!$('#ie-dialog').hidden||!$('#ie-help-modal').hidden)return;
      const root=TR.root();if(!root?.contains(e.target)||TextActivationController.nativeControl(e.target))return;if(this.navigate(e.shiftKey)){e.preventDefault();e.stopImmediatePropagation()}
    },true);}
};
