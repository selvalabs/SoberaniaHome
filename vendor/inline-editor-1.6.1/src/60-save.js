const Serializer={
  cleanClone(clone,{clean=false}={}){
    window.IEAuthored?.cleanClone(clone);if(typeof CommentManager!=='undefined')CommentManager.prepareClone(clone,{clean});
    const content=clone.querySelector('body');if(content)InlineFormatEngine.normalize(content);
    if(clean)clone.querySelectorAll('span[data-ie-text-run]').forEach(e=>e.removeAttribute('data-ie-text-run'));
    clone.querySelector('body')?.classList.remove('ie-edit-mode');clone.querySelector('body')?.removeAttribute('data-ie-gesture');
    // Selection flags are transient; authored styles and metadata are intentionally preserved.
    for(const e of clone.querySelectorAll('[data-ie-history-id]')){const source=H.find(e.dataset.ieHistoryId),orig=source&&SE.originals.get(source);TRANSIENT_ATTRS.forEach(k=>e.removeAttribute(k));if(orig)for(const k of ['contenteditable','spellcheck']){if(orig[k]!=null)e.setAttribute(k,orig[k])}e.removeAttribute('data-ie-history-id')}
    if(clean){clone.querySelectorAll('[data-ie-spacer]').forEach(e=>e.removeAttribute('data-ie-spacer'));clone.querySelectorAll('[data-ie-box-model]').forEach(e=>e.removeAttribute('data-ie-box-model'));clone.querySelectorAll('[data-ie-runtime]').forEach(e=>e.remove());const walker=document.createTreeWalker(clone,NodeFilter.SHOW_COMMENT);const remove=[];while(walker.nextNode()){if(/INLINE-EDITOR/.test(walker.currentNode.data))remove.push(walker.currentNode)}remove.forEach(n=>n.remove())}
    else{
      for(const [id,html] of RUNTIME_UI_ORIGINAL){const old=clone.querySelector('#'+id);if(old){const t=document.createElement('template');t.innerHTML=html;old.replaceWith(t.content.firstElementChild)}}
      for(const id of ['ie-toolbar','ie-selection-overlay','ie-tooltip','ie-toast','ie-snackbar','ie-dialog','ie-help-modal','ie-about-modal','ie-geometry-badge','ie-guide-v','ie-guide-h','ie-child-popover']){const e=clone.querySelector('#'+id);if(e){e.hidden=true;if(['ie-tooltip','ie-toast','ie-geometry-badge','ie-child-popover'].includes(id))e.replaceChildren()}}
      clone.querySelector('#ie-multi-outlines')?.replaceChildren();const bar=clone.querySelector('#ie-toolbar');bar?.removeAttribute('data-ie-booted');bar?.removeAttribute('style');bar?.classList.remove('ie-minimized');const launcher=clone.querySelector('#ie-launcher');if(launcher)launcher.hidden=false;
      for(const e of clone.querySelectorAll('[data-ie-runtime] [aria-describedby]'))if(e.getAttribute('aria-describedby')==='ie-tooltip')e.removeAttribute('aria-describedby');
    }
    // Text inside raw script/style nodes must not terminate them on HTML reparsing.
    clone.querySelectorAll('script:not([src])').forEach(s=>{s.textContent=s.textContent.replace(/<\/script/gi,'<\\/script')});
    return clone;
  },
  html({clean=false}={}){TextEditor.finishColor();H.uiEnd();H.commitContinuous();AuthoredManager.refresh();const clone=this.cleanClone(document.documentElement.cloneNode(true),{clean});return '<!DOCTYPE html>\n'+clone.outerHTML;},
  async save({clean=false}={}){if(EditorState.saving)return false;TextEditor.finishColor();H.uiEnd();H.commitContinuous();EditorState.saving=true;const revision=DirtyStateGuard.revision;const html=this.html({clean});const name=(document.title||'landing').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/gi,'-').replace(/^-|-$/g,'').slice(0,62)+(clean?'_FINAL_':'_EDITADO_')+new Date().toISOString().slice(0,19).replace(/[-:T]/g,'')+'.html';
    try{
      if(window.showSaveFilePicker&&window.isSecureContext){try{const handle=await window.showSaveFilePicker({suggestedName:name,types:[{description:'Página HTML autocontida',accept:{'text/html':['.html']}}]});const writable=await handle.createWritable();await writable.write(html);await writable.close();if(!clean)DirtyStateGuard.markSaved(revision);notify(clean?'HTML final exportado. Salve também o editável para continuar depois.':'HTML editável salvo com as alterações.');return true}catch(e){if(e.name==='AbortError')return false;notify('Gravação direta indisponível. Vou iniciar o download.')}}
      const blob=new Blob([html],{type:'text/html;charset=utf-8'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.dataset.ieRuntime='';a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),3000);if(!clean)DirtyStateGuard.markSaved(revision);notify(clean?'Download da versão final iniciado. O editável ainda deve ser salvo separadamente.':'Download do editável iniciado. Confira o arquivo na pasta de downloads.');return true;
    }catch(e){notify('Não foi possível salvar. Suas alterações continuam na página.');console.error(e);return false}finally{EditorState.saving=false;syncUI()}
  }
};
