const TEXT_TAGS=new Set('H1 H2 H3 H4 H5 H6 P SPAN SMALL STRONG B I EM U LI DT DD BLOCKQUOTE Q CITE LABEL FIGCAPTION TIME A BUTTON TD TH'.split(' '));
const STRUCTURAL_TAGS='section,article,div,figure,header,footer,nav,aside,main';
const SelectionEngine={
  originals:new WeakMap(),
  isTextualCandidate(e){if(!e||Utils.isProtected(e)||e.closest?.('svg'))return false;if(TEXT_TAGS.has(e.tagName))return true;
    const direct=[...e.childNodes].some(n=>n.nodeType===3&&n.textContent.trim());return direct&&![...e.children].some(c=>c.matches(STRUCTURAL_TAGS+',table,ul,ol,form'));},
  contextOf(e){if(!e)return'none';const tag=String(e.tagName).toUpperCase();if(tag==='IMG')return'image';if(tag==='SVG')return'svg';if(['TD','TH'].includes(tag))return'table_cell';if(tag==='TABLE')return'table';
    if(e.matches('a,button,input[type=submit],[role=button]'))return'link';if(tag==='SECTION'||tag==='HEADER'||tag==='FOOTER')return'section';if(this.isTextualCandidate(e))return'text';if(e.matches(STRUCTURAL_TAGS))return'container';return'element';},
  contextualElement(t,{preferStructural=false}={}){if(t?.nodeType!==1)t=t?.parentElement;if(!t||Utils.isProtected(t))return null;
    const svg=t.closest('svg');if(svg)return svg;if(preferStructural)return t.closest(STRUCTURAL_TAGS)||t;
    if(t.closest('img'))return t.closest('img');if(t.closest('td,th'))return t.closest('td,th');const a=t.closest('a,button,[role=button]');if(a)return a;
    for(let e=t;e&&e!==document.body;e=e.parentElement){if(this.isTextualCandidate(e))return e;}return t.closest(STRUCTURAL_TAGS+',table')||t;},
  remember(e){if(!this.originals.has(e))this.originals.set(e,{contenteditable:e.getAttribute('contenteditable'),spellcheck:e.getAttribute('spellcheck'),textBlocks:new WeakSet([...e.querySelectorAll('div,p')])})},
  clearFlags(e){e.removeAttribute('data-ie-selected');e.removeAttribute('data-ie-multi');const o=this.originals.get(e);if(o)for(const k of ['contenteditable','spellcheck']){if(o[k]==null)e.removeAttribute(k);else e.setAttribute(k,o[k])}},
  refreshFlags(){for(const e of $$('[data-ie-selected],[data-ie-multi]'))this.clearFlags(e);EditorState.selectionSet=selection();if(!EditorState.selectionSet.includes(selected()))EditorState.selected=EditorState.selectionSet.at(-1)||null;
    selection().forEach(e=>{this.remember(e);e.setAttribute('data-ie-multi','1');if(e===selected())e.setAttribute('data-ie-selected','1')});
    if(EditorState.editMode&&selection().length===1&&['text','link','table_cell'].includes(ctx())){selected().setAttribute('contenteditable','true');selected().setAttribute('spellcheck','true')}
  },
  select(e,{add=false}={}){if(e&&Utils.isProtected(e))return;if(EditorState.geometry)GeometryController.cancel();H.commitContinuous();
    let next=add?[...selection()]:[];if(e){const i=next.indexOf(e);if(add&&i>=0)next.splice(i,1);else{next=next.filter(x=>!x.contains(e)&&!e.contains(x));next.push(e)}}
    EditorState.selectionSet=next;EditorState.selected=next.at(-1)||null;TextRangeController.clear();this.refreshFlags();$('#ie-child-popover').hidden=true;syncUI();},
  selectMany(els){if(EditorState.geometry)GeometryController.cancel();H.commitContinuous();EditorState.selectionSet=Utils.roots(els).filter(e=>!Utils.isProtected(e));EditorState.selected=selection().at(-1)||null;TextRangeController.clear();this.refreshFlags();syncUI()},
  parent(){const p=selected()?.parentElement;if(p&&!Utils.isProtected(p))this.select(p);else notify('Não há outro pai editável.')},
  children(e=selected()){if(!e||this.contextOf(e)==='svg')return[];return [...e.children].filter(n=>!Utils.isProtected(n)&&Utils.visible(n))},
  child(){const children=this.children();if(children.length===1){this.select(children[0]);return}if(!children.length){notify('Este elemento não tem filhos editáveis.');return}
    const pop=$('#ie-child-popover');pop.replaceChildren();children.forEach(e=>{const b=document.createElement('button');b.type='button';b.textContent=Utils.label(e)+' — '+e.textContent.trim().slice(0,42);b.dataset.help='Selecionar este elemento filho.';b.onclick=()=>this.select(e);pop.appendChild(b)});pop.hidden=false;pop.querySelector('button')?.focus();},
  breadcrumb(){const w=$('#ie-breadcrumb');w.replaceChildren();let e=selected(),chain=[];while(e&&!Utils.isProtected(e)){chain.unshift(e);e=e.parentElement}for(const n of chain.slice(-7)){const b=document.createElement('button');b.type='button';b.textContent=Utils.label(n);b.dataset.help='Selecionar '+Utils.label(n);b.classList.toggle('ie-active',n===selected());b.onclick=()=>this.select(n);w.appendChild(b)}w.scrollLeft=w.scrollWidth;},
  install(){window.addEventListener('click',e=>{if(!EditorState.editMode||Utils.isRuntime(e.target)||EditorState.bypassAction)return;
      const a=e.target.closest?.('a[href],button,input[type=submit],[role=button]');if(a)return;
      const add=e.ctrlKey||e.metaKey||EditorState.multiMode;
      if(!add&&!e.altKey&&TextActivationController.pointerRoot===selected()&&selection().length===1&&selected()?.contains(e.target)){TextRangeController.capture();syncUI();return}
      const target=this.contextualElement(e.target,{preferStructural:e.altKey});if(target)this.select(target,{add});
    },true);}

};
const SE=SelectionEngine;
const TextEditor={
  composing:false,colorSession:null,
  eligible(){return selection().filter(e=>['text','link','table_cell'].includes(SE.contextOf(e)))},
  target(){if(!TR.toolbarFocused&&!Utils.isRuntime(document.activeElement))TR.capture();const es=this.eligible();if(!es.length)return null;
    if(EditorState.textRange?.invalid)return {invalid:true};const resolved=es.length===1?TR.resolve():null;
    return {elements:es,root:es[0],bookmark:resolved?.mode==='range'?{start:resolved.start,end:resolved.end,backward:resolved.backward}:null};},
  mutateTarget(t,prop,value){
    if(t.bookmark&&prop!=='textAlign'&&prop!=='text-align'){
      InlineFormatEngine.apply(t.root,t.bookmark,prop,value);TR.restore(t.root,t.bookmark);
    }else t.elements.forEach(e=>S.set(e,prop,value));
  },
  apply(prop,value,label){this.finishColor();const t=this.target();if(!t){notify('Selecione um texto, título ou botão.');return}if(t.invalid){notify('Selecione um trecho dentro de um único bloco de texto.');return}
    withHistory(label,t.elements,()=>this.mutateTarget(t,prop,value),{deep:!!t.bookmark});syncUI();
  },
  toggle(prop,on,off,label){this.finishColor();const t=this.target();if(!t||t.invalid){notify('Selecione um texto ou um trecho dentro dele.');return}
    const samples=t.bookmark?TR.pieces(t.root,t.bookmark).map(x=>x.node.parentElement):t.elements;
    const all=samples.length&&samples.every(e=>InlineFormatEngine.isOn(e,prop,on));this.apply(prop,all?off:on,label);
  },
  selectAll(){if(selection().length!==1||!['text','link','table_cell'].includes(ctx()))return;const e=selected();TR.restore(e,{start:0,end:e.textContent.length},{focus:true});syncUI()},
  // Kept as an API alias for integrations; no extra UI step is required.
  editDirect(){this.selectAll()},
  clear(){this.finishColor();const t=this.target();if(!t||t.invalid)return;
    withHistory('Limpar formatação de texto',t.elements,()=>{
      if(t.bookmark){InlineFormatEngine.clear(t.root,t.bookmark);TR.restore(t.root,t.bookmark)}
      else for(const e of t.elements){for(const prop of InlineFormatEngine.props)S.set(e,prop,'');S.set(e,'textAlign','');for(const run of e.querySelectorAll('span[data-ie-text-run="1"]'))for(const prop of InlineFormatEngine.props)run.style.removeProperty(prop);InlineFormatEngine.normalize(e)}
    },{deep:true});
  },
  previewColor(prop,value,label){
    let session=this.colorSession;if(session&&(session.prop!==prop||session.history!==H.continuous)){this.finishColor();session=null}
    if(!session){const target=this.target();if(!target||target.invalid){notify('Selecione um trecho dentro do texto ou um bloco textual.');return}H.beginContinuous(label,target.elements,{deep:!!target.bookmark});session=this.colorSession={prop,target,history:H.continuous};}
    if(!session.target.elements.every(e=>e.isConnected)){this.finishColor();return}
    this.mutateTarget(session.target,prop,value);DirtyStateGuard.changed();syncUI();
  },
  finishColor(){if(!this.colorSession)return;const c=this.colorSession;this.colorSession=null;if(H.continuous===c.history)H.commitContinuous();syncUI()},
  normalizeBreaks(root){
    // Native Enter may insert a <div> inside a <p>/<h*> editing host. Keep the
    // native input, then replace only newly-created invalid line containers with BRs.
    if(!root||!root.matches('p,h1,h2,h3,h4,h5,h6,span,strong,b,i,em,u,small,label,a,button,q,cite,time'))return;
    const originals=SE.originals.get(root)?.textBlocks;
    const blocks=[...root.querySelectorAll('div,p')].filter(e=>!originals?.has(e));if(!blocks.length)return;
    const sel=getSelection(),range=sel?.rangeCount?sel.getRangeAt(0):null;let marker=null;
    if(range?.collapsed&&root.contains(range.startContainer)){marker=document.createComment('ie-caret');range.insertNode(marker)}
    for(const block of blocks.reverse()){
      const prev=block.previousSibling,next=block.nextSibling;
      const meaningful=n=>n&&n.nodeType!==8&&(n.nodeType!==3||n.textContent.length);
      if(meaningful(prev)&&!(prev.nodeType===1&&prev.tagName==='BR'))block.before(document.createElement('br'));
      const last=block.lastChild;const needsEnd=meaningful(next)&&!(next.nodeType===1&&next.tagName==='BR')&&!(last?.nodeType===1&&last.tagName==='BR');
      if(needsEnd)block.after(document.createElement('br'));block.replaceWith(...block.childNodes);
    }
    if(marker?.isConnected){const r=document.createRange();r.setStartBefore(marker);r.collapse(true);marker.remove();sel.removeAllRanges();sel.addRange(r);TR.remember(root,r)}
  },
  scheduleCommit(){clearTimeout(H.typingTimer);if(!this.composing)H.typingTimer=setTimeout(()=>{H.commitContinuous();syncUI()},550)},
  install(){
    const canEdit=e=>EditorState.editMode&&!Utils.isRuntime(e.target)&&selection().length===1&&['text','link','table_cell'].includes(ctx())&&selected()?.contains(e.target);
    document.addEventListener('compositionstart',e=>{if(canEdit(e)){this.composing=true;clearTimeout(H.typingTimer);H.beginContinuous('Editar texto',[selected()],{deep:true})}});
    document.addEventListener('compositionend',e=>{if(canEdit(e)){this.composing=false;this.normalizeBreaks(selected());TR.capture();this.scheduleCommit()}});
    document.addEventListener('beforeinput',e=>{if(!canEdit(e))return;
      if(e.inputType==='historyUndo'||e.inputType==='historyRedo'){e.preventDefault();e.inputType==='historyUndo'?H.undo():H.redo();return}
      this.finishColor();H.beginContinuous('Editar texto',[selected()],{deep:true});});
    document.addEventListener('input',e=>{if(!canEdit(e))return;DirtyStateGuard.changed();if(!this.composing){this.normalizeBreaks(selected());TR.capture()}this.scheduleCommit();OverlayManager.update()});
    document.addEventListener('paste',e=>{if(!canEdit(e))return;e.preventDefault();const text=e.clipboardData?.getData('text/plain')||'';const r=getSelection().rangeCount?getSelection().getRangeAt(0):null;if(!r||!selected().contains(r.commonAncestorContainer))return;
      withHistory('Colar texto',[selected()],()=>{r.deleteContents();const n=document.createTextNode(text);r.insertNode(n);r.setStartAfter(n);r.collapse(true);getSelection().removeAllRanges();getSelection().addRange(r);TR.remember(selected(),r)},{deep:true});});
  }
};

const ActionSnackbar={
  pending:null,
  show(a){this.pending=a;const url=a.getAttribute('href');$('#ie-snack-text').textContent=(url?`Destino: ${url}`:'Este botão executa uma ação da página.')+(DirtyStateGuard.dirty?' Há alterações não salvas.':'');$('#ie-snack-save').hidden=!DirtyStateGuard.dirty;$('#ie-snackbar').hidden=false;},
  hide(){this.pending=null;$('#ie-snackbar').hidden=true},
  async confirm(save=false){const a=this.pending;if(!a)return;if(save&&!await Serializer.save())return;this.hide();
    EditorState.bypassAction=a;try{a.click()}finally{EditorState.bypassAction=null}},
  install(){
    // Window capture runs before the host's document/bubbling listeners.
    window.addEventListener('click',e=>{if(!EditorState.editMode||Utils.isRuntime(e.target))return;const a=e.target.closest?.('a[href],button,input[type=submit],[role=button]');if(!a||EditorState.bypassAction===a)return;
      e.preventDefault();e.stopImmediatePropagation();const add=e.ctrlKey||e.metaKey||EditorState.multiMode;const same=selection().length===1&&(selected()===a||selected()?.contains(a));
      if(!same||add)SE.select(a,{add});TR.capture();if(!add&&!(same&&e.detail>=2)&&TR.resolve()?.mode!=='range')this.show(a);else if(!add)this.hide();},true);
    window.addEventListener('dblclick',e=>{if(!EditorState.editMode||Utils.isRuntime(e.target))return;const a=e.target.closest?.('a,button,[role=button]');if(a){e.preventDefault();e.stopImmediatePropagation();this.hide();TR.capture();syncUI()}},true);
    window.addEventListener('submit',e=>{if(!EditorState.editMode||Utils.isRuntime(e.target)||EditorState.bypassAction===e.submitter)return;e.preventDefault();e.stopImmediatePropagation();const b=e.submitter||e.target.querySelector('[type=submit]');if(b)this.show(b);else notify('Envio de formulário bloqueado durante edição.');},true)
  }
};
