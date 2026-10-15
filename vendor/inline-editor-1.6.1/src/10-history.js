// DOM snapshots follow the v1.4 element-granularity model; no body.innerHTML replacement.
const HistoryManager={
  seq:0,undoStack:[],redoStack:[],continuous:null,typingTimer:null,restoring:false,
  ensureId(e){if(!e.dataset.ieHistoryId)e.dataset.ieHistoryId='iehid-'+(++this.seq);return e.dataset.ieHistoryId},
  find(id){return id?document.querySelector(`[data-ie-history-id="${CSS.escape(id)}"]`):null},
  cleanClone(e){const c=e.cloneNode(true);window.IEAuthored?.cleanClone(c);[c,...c.querySelectorAll('*')].forEach(n=>{TRANSIENT_ATTRS.forEach(k=>n.removeAttribute(k));if(n.hasAttribute('data-ie-history-id'))n.removeAttribute('data-ie-history-id')});return c},
  capture(e,opts={}){if(!e)return null;const id=this.ensureId(e),normal=e.cloneNode(false);window.IEAuthored?.cleanClone(normal);const attrs=[...normal.attributes].filter(a=>!TRANSIENT_ATTRS.has(a.name)&&a.name!=='data-ie-history-id').map(a=>[a.name,a.value]);
    return{id,attrs,html:opts.deep?this.cleanClone(e).innerHTML:null};},
  captureMany(items){return items.map(it=>({state:this.capture(it.el,{deep:!!it.deep})})).filter(x=>x.state)},
  snapshotKey(ss){return JSON.stringify(ss)},
  applyState(st){const e=this.find(st.id);if(!e)return null;[...e.attributes].forEach(a=>{if(a.name!=='data-ie-history-id'&&!TRANSIENT_ATTRS.has(a.name))e.removeAttribute(a.name)});st.attrs.forEach(([k,v])=>e.setAttribute(k,v));
    if(st.html!==null && this.cleanClone(e).innerHTML!==st.html){const t=document.createElement('template');t.innerHTML=st.html;this.reconcile(e,t.content)}
    return e;},
  reconcile(parent,desired){
    // Reuse same-type DOM nodes whenever possible to retain the host's listeners.
    const wanted=[...desired.childNodes];let cursor=parent.firstChild;
    wanted.forEach(w=>{let n=cursor;
      const matches=(a,b)=>a&&a.nodeType===b.nodeType&&(a.nodeType!==1||(a.tagName===b.tagName&&(!b.id||a.id===b.id)));
      if(n&&!matches(n,w)){let found=n.nextSibling;while(found&&!matches(found,w))found=found.nextSibling;if(found){parent.insertBefore(found,n);n=found;cursor=found}}
      if(n && n.nodeType===w.nodeType && (n.nodeType!==1 || (n.tagName===w.tagName && (!w.id||n.id===w.id)))){
        if(n.nodeType===1){[...n.attributes].forEach(a=>{if(a.name!=='data-ie-history-id'&&!TRANSIENT_ATTRS.has(a.name)&&!w.hasAttribute(a.name))n.removeAttribute(a.name)});[...w.attributes].forEach(a=>n.setAttribute(a.name,a.value));this.reconcile(n,w)}
        else if(n.nodeValue!==w.nodeValue)n.nodeValue=w.nodeValue;cursor=n.nextSibling;
      }else{parent.insertBefore(w.cloneNode(true),cursor)}
    });while(cursor){const next=cursor.nextSibling;cursor.remove();cursor=next}
  },
  applySnapshot(ss){this.restoring=true;try{ss.forEach(x=>this.applyState(x.state));TextRangeController.clear();SelectionEngine.refreshFlags();AuthoredManager.refresh()}finally{this.restoring=false}syncUI()},
  begin(elements=selection(),opts={}){this.commitContinuous();const els=Utils.roots(elements).filter(e=>!Utils.isProtected(e));els.forEach(e=>BaselineManager.ensure(e));return this.captureMany(els.map(el=>({el,deep:!!opts.deep})))},
  end(label,before,opts={}){const after=this.captureMany(before.map(x=>({el:this.find(x.state.id),deep:x.state.html!==null||!!opts.deep})).filter(x=>x.el));this.push(label,before,after)},
  push(label,before,after){if(!before?.length||this.snapshotKey(before)===this.snapshotKey(after))return false;this.undoStack.push({label,before,after});if(this.undoStack.length>HISTORY_LIMIT)this.undoStack.shift();this.redoStack=[];DirtyStateGuard.changed();syncUI();return true},
  pushCustom(label,undo,redo){this.commitContinuous();this.undoStack.push({label,custom:true,undo,redo});if(this.undoStack.length>HISTORY_LIMIT)this.undoStack.shift();this.redoStack=[];DirtyStateGuard.changed();syncUI();return true},
  mutate(label,elements,fn,opts={}){const b=this.begin(elements,opts);if(!b.length)return;try{fn()}catch(e){this.applySnapshot(b);notify('A alteração foi cancelada: '+e.message);console.error(e);return}this.end(label,b,opts);AuthoredManager.refresh();syncUI()},
  beginContinuous(label,elements=selection(),opts={}){const key=elements.map(e=>this.ensureId(e)).join('|');if(this.continuous?.key===key&&this.continuous.label===label)return;
    const b=this.begin(elements,opts);if(!b.length)return;this.continuous={label,key,before:b,opts};},
  commitContinuous(){clearTimeout(this.typingTimer);if(!this.continuous)return;const c=this.continuous;this.continuous=null;this.end(c.label,c.before,c.opts)},
  flushTyping(){this.commitContinuous()},
  undo(){if(EditorState.geometry)GeometryController.cancel();this.commitContinuous();const r=this.undoStack.at(-1);if(!r){notify('Nada para desfazer.');return}
    if(r.custom){if(r.undo()===false)return}else this.applySnapshot(r.before);this.undoStack.pop();this.redoStack.push(r);DirtyStateGuard.changed();notify('Desfeito: '+r.label);syncUI()},
  redo(){this.commitContinuous();const r=this.redoStack.at(-1);if(!r){notify('Nada para refazer.');return}
    if(r.custom){if(r.redo()===false)return}else this.applySnapshot(r.after);this.redoStack.pop();this.undoStack.push(r);DirtyStateGuard.changed();notify('Refeito: '+r.label);syncUI()},
  syncButtons(){for(const b of $$('[data-action="undo"]'))b.disabled=!this.undoStack.length&&!this.continuous;for(const b of $$('[data-action="redo"]'))b.disabled=!this.redoStack.length}
};
const H=HistoryManager;
const BaselineManager={
  entries:new Map(),
  ensure(e){const id=H.ensureId(e);if(!this.entries.has(id))this.entries.set(id,H.capture(e,{deep:true}));},
  async resetSelected(){H.commitContinuous();const els=Utils.roots(selection());if(!els.length){notify('Selecione um elemento.');return}const ids=els.map(e=>H.ensureId(e));
    if(!ids.some(id=>this.entries.has(id))){notify('Nenhuma alteração desta sessão nesta seleção.');return}
    const ok=await Dialog.confirm('Restaurar seleção?',`Restaurar ${els.length===1?'o elemento selecionado':els.length+' elementos'} ao estado anterior à primeira edição desta sessão? Esta ação pode ser desfeita.`,'Restaurar');
    if(!ok)return;const targets=ids.map(id=>H.find(id)).filter(Boolean),commentMeta=targets.map(e=>[e,e.getAttribute('data-ie-comment-anchor'),e.getAttribute('data-ie-comments')]);const b=H.begin(targets,{deep:true});ids.forEach(id=>{const st=this.entries.get(id);if(st)H.applyState(st)});for(const [e,a,c] of commentMeta){if(a!=null)e.setAttribute('data-ie-comment-anchor',a);else e.removeAttribute('data-ie-comment-anchor');if(c!=null)e.setAttribute('data-ie-comments',c);else e.removeAttribute('data-ie-comments')}H.end('Restaurar seleção',b,{deep:true});AuthoredManager.refresh();SelectionEngine.refreshFlags();syncUI();},
  async resetSession(){H.commitContinuous();if(!this.entries.size){notify('Nenhuma alteração nesta sessão.');return}
    if(!await Dialog.confirm('Restaurar toda a sessão?','Textos, estilos, posição e efeitos alterados nesta sessão serão restaurados. O estado do arquivo aberto é a referência.','Continuar'))return;
    if(!await Dialog.confirm('Confirmar restauração completa','Esta confirmação afeta todos os elementos editados, não apenas a seleção atual.','Restaurar tudo'))return;
    const entries=[...this.entries.values()].reverse(),els=entries.map(st=>H.find(st.id)).filter(Boolean),commentMeta=els.map(e=>[e,e.getAttribute('data-ie-comment-anchor'),e.getAttribute('data-ie-comments')]),b=H.begin(els,{deep:true});entries.forEach(st=>H.applyState(st));for(const [e,a,c] of commentMeta){if(a!=null)e.setAttribute('data-ie-comment-anchor',a);else e.removeAttribute('data-ie-comment-anchor');if(c!=null)e.setAttribute('data-ie-comments',c);else e.removeAttribute('data-ie-comments')}H.end('Restaurar sessão',b,{deep:true});AuthoredManager.refresh();SelectionEngine.refreshFlags();syncUI();}
};
const DirtyStateGuard={
  dirty:false,revision:0,checkpoint:null,timer:null,listening:false,
  onUnload(e){if(DirtyStateGuard.dirty){e.preventDefault();e.returnValue='';return''}},
  // Hash only touched elements, not multi-megabyte assets on every pointermove.
  fingerprint(){const list=[];for(const [id,base] of BaselineManager.entries){const e=H.find(id);if(e)list.push([id,H.capture(e,{deep:true})]);}return JSON.stringify(list)},
  changed(){this.revision++;this.dirty=true;this.updateGuard();},
  updateGuard(){if(this.dirty&&!this.listening){window.addEventListener('beforeunload',this.onUnload);this.listening=true}else if(!this.dirty&&this.listening){window.removeEventListener('beforeunload',this.onUnload);this.listening=false}
    const e=$('#ie-dirty-status');if(e){e.textContent=this.dirty?'Alterações não salvas':'Sem alterações pendentes';e.dataset.dirty=String(this.dirty)}},
  refresh(){this.updateGuard()},
  markSaved(revision){if(this.revision!==revision){notify('Arquivo salvo; há alterações mais recentes ainda não salvas.');return}this.dirty=false;this.checkpoint={time:Date.now(),revision};this.updateGuard();syncUI()}
};
const Dialog={
  pending:null,prev:null,
  confirm(title,message,confirmLabel='Confirmar'){
    if(this.pending)this.finish(false);this.prev=document.activeElement;
    $('#ie-dialog-title').textContent=title;$('#ie-dialog-message').textContent=message;$('#ie-dialog-confirm').textContent=confirmLabel;
    $('#ie-dialog').hidden=false;$('#ie-dialog-cancel').focus();return new Promise(resolve=>this.pending=resolve);
  },
  finish(value){$('#ie-dialog').hidden=true;const p=this.pending;this.pending=null;p?.(value);this.prev?.focus?.()}
};
