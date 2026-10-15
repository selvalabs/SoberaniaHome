/* v1.6.1 — structural deletion. Native reflow first; no host stylesheet rewriting.
 * Uses the existing chronological HistoryManager and retains the actual DOM nodes.
 * A spacer is a best-effort snapshot of a box at the current viewport, not a new
 * responsive layout engine. Unsupported / non-equivalent substitutions roll back.
 */
const DeleteController={
  ROOTS:'#app,#root,#__next,#__nuxt,[data-reactroot],[data-ie-root]',
  pending:false,feedback:null,feedbackTimer:null,menuOrigin:null,
  protectedReason(el){
    if(!el?.isConnected||U.isProtected(el))return 'Este elemento é estrutural ou protegido e não pode ser excluído.';
    if(el.matches(this.ROOTS)||el.querySelector(this.ROOTS))return 'A raiz da aplicação não pode ser excluída.';
    if(el.querySelector('[data-ie-runtime],[data-ie-protected],[data-ie-root]'))return 'Este container contém elementos protegidos.';
    if(el.getRootNode()!==document)return 'A exclusão não opera dentro de Shadow DOM.';
    return '';
  },
  roots(elements=selection()){
    return U.roots(elements).sort((a,b)=>a===b?0:(a.compareDocumentPosition(b)&Node.DOCUMENT_POSITION_FOLLOWING)?-1:1);
  },
  hasTextRange(){
    if(EditorState.textRange?.invalid||TR.resolve()?.mode==='range')return true;
    const s=getSelection();if(!s?.rangeCount||s.isCollapsed)return false;
    const node=s.getRangeAt(0).commonAncestorContainer;
    return !U.isRuntime(node.nodeType===1?node:node.parentElement);
  },
  textField(target){return !!target?.closest?.('input,textarea,select,[role="textbox"],[role="searchbox"], [role="combobox"]')||!!target?.isContentEditable},
  componentOwnsFocus(e){
    // Events from component internals can be retargeted to the host. Leave their
    // editing keys to the component, including opaque focused custom elements.
    const active=document.activeElement;
    return !!active?.shadowRoot||!!active?.localName?.includes('-')||(e.composedPath?.()||[]).some(n=>n instanceof ShadowRoot);
  },
  reason(elements=selection()){
    if(!EditorState.editMode)return 'Abra o editor antes de excluir.';
    if(this.pending)return 'Conclua a confirmação em aberto.';
    if(EditorState.geometry)return 'Conclua o movimento ou redimensionamento antes de excluir.';
    if(this.hasTextRange())return 'Há um trecho de texto selecionado. Volte à seleção de bloco antes de excluir.';
    if(!elements.length)return 'Selecione um elemento para excluir.';
    for(const el of elements){const why=this.protectedReason(el);if(why)return why}
    return '';
  },
  openTasks(roots){
    return roots.flatMap(el=>[el,...el.querySelectorAll('[data-ie-comments]')])
      .flatMap(el=>CommentManager.parse(el)).filter(r=>r.type==='llm_task'&&r.status==='open').length;
  },
  refreshComments(){
    CommentManager.refreshRegistry();
    // Saved editables may already contain an aggregate registry. Keep it aligned
    // with the authoritative per-element records; deleted records live only in undo.
    const registry=$('#ie-comments-data');
    if(registry?.matches('script[type="application/json"]'))registry.textContent=JSON.stringify(CommentManager.createRegistry(),null,2);
  },
  rect(el){const r=el.getBoundingClientRect();return{x:r.x,y:r.y,width:r.width,height:r.height}},
  closeEnough(a,b,tolerance=2){return ['x','y','width','height'].every(k=>Math.abs(a[k]-b[k])<=tolerance)},
  spaceReason(el){
    const c=getComputedStyle(el);
    if(el.matches('table,thead,tbody,tfoot,tr,td,th,col,colgroup,caption,option,optgroup,br,hr'))return 'Preservar espaço não está disponível para estruturas de tabela ou elementos sem caixa substituível.';
    if(c.display==='contents'||c.display==='none'||(c.display==='inline'&&!el.matches('img,svg,video,canvas,iframe')))
      return 'Selecione um bloco, card ou imagem com uma caixa própria para preservar espaço.';
    if(c.position==='sticky'||c.float!=='none'||c.writingMode!=='horizontal-tb'||c.animationName!=='none'||c.perspective!=='none')
      return 'Este posicionamento exige revisão manual. Use Excluir ou selecione o container externo.';
    if(el.getAnimations?.().some(a=>a.playState==='running'))return 'Pause a animação antes de preservar a caixa deste elemento.';
    const r=this.rect(el);if(r.width<=0||r.height<=0)return 'Este elemento não possui uma caixa visível para preservar.';
    return '';
  },
  spacer(el){
    const c=getComputedStyle(el),p=el.parentElement,pc=getComputedStyle(p);
    // Keep list markup valid, never copy IDs, semantics, links, classes or content.
    const tag=el.matches('li,dt,dd')?el.tagName.toLowerCase():(c.display.startsWith('inline')?'span':'div');
    const n=document.createElement(tag);n.setAttribute('data-ie-spacer','1');n.setAttribute('aria-hidden','true');
    // Assign the declaration string once. Mixing `all` with individual important
    // properties through CSSOM would expand the reset into hundreds of longhands.
    const declarations=new Map(),set=(k,v)=>declarations.set(k,v);
    set('box-sizing','border-box');
    const axis=(prop)=>{
      const value=parseFloat(c.getPropertyValue(prop));
      if(!Number.isFinite(value))throw new Error('Dimensão intrínseca não resolvida.');
      const sides=prop==='width'?['left','right']:['top','bottom'];
      return value+(c.boxSizing==='border-box'?0:sides.reduce((sum,s)=>sum+safeNum(c.getPropertyValue('padding-'+s))+safeNum(c.getPropertyValue('border-'+s+'-width')),0));
    };
    const width=axis('width'),height=axis('height');
    set('display',c.display.startsWith('inline')?'inline-block':c.display==='list-item'?'list-item':'block');
    set('width',px(width));set('height',px(height));set('min-width','0');set('min-height','0');set('max-width','none');set('max-height','none');
    for(const side of ['top','right','bottom','left'])set('margin-'+side,c.getPropertyValue('margin-'+side));
    for(const prop of ['position','top','right','bottom','left','order','align-self','justify-self','vertical-align','direction','transform','transform-origin','translate','rotate','scale','grid-column-start','grid-column-end','grid-row-start','grid-row-end']){
      const v=c.getPropertyValue(prop);if(v)set(prop,v);
    }
    if(pc.display.includes('flex'))set('flex','0 0 '+px(pc.flexDirection.startsWith('column')?height:width));
    set('padding','0');set('border','0');set('list-style','none');set('background','none');
    // These two are normal priority so the editor-only CSS can reveal/select the
    // empty slot. Clean Build removes that CSS and leaves an inert visual spacer.
    n.setAttribute('style','all:initial;'+[...declarations].map(([k,v])=>`${k}:${v}!important;`).join('')+'visibility:hidden;pointer-events:none;');
    return n;
  },
  contextSnapshot(roots){
    const parents=[...new Set(roots.map(el=>el.parentElement))];
    const siblings=[...new Set(parents.flatMap(p=>[...p.children]))].filter(el=>!roots.includes(el)&&!U.isRuntime(el));
    return {parents:parents.map(el=>({el,rect:this.rect(el)})),siblings:siblings.map(el=>({el,rect:this.rect(el)}))};
  },
  restoreItems(items){
    // Reverse document order restores adjacent deletions without reversing siblings.
    for(const it of [...items].reverse()){
      if(it.spacer?.parentNode===it.parent){it.parent.replaceChild(it.node,it.spacer);continue}
      const next=it.next?.parentNode===it.parent?it.next:null;
      const previous=it.previous?.parentNode===it.parent?it.previous:null;
      const anchor=next||(previous?previous.nextSibling:it.parent.childNodes[Math.min(it.index,it.parent.childNodes.length)]||null);
      it.parent.insertBefore(it.node,anchor);
    }
  },
  detachItems(items){for(const it of items){if(it.spacer)it.parent.replaceChild(it.spacer,it.node);else it.parent.removeChild(it.node)}},
  refreshAfterMutation(){
    TextActivationController.pointerRoot=null;TextRangeController.clear();ActionSnackbar.hide();TooltipController.hide();
    this.refreshComments();CommentManager.render();AuthoredManager.refresh();syncUI();
  },
  async remove({preserveSpace=false,targets=null,label=null}={}){
    const prior=selection(),roots=this.roots(targets||prior),why=this.reason(roots);
    if(why){notify(why);return false}
    if(!$('#ie-dialog').hidden||!$('#ie-help-modal').hidden||!$('#ie-about-modal').hidden)return false;
    if(preserveSpace){for(const el of roots){const reason=this.spaceReason(el);if(reason){notify(reason);return false}}}
    const parents=roots.map(el=>el.parentNode),taskCount=this.openTasks(roots);
    this.closeMenu(false);
    if(taskCount){
      this.pending=true;syncUI();let proceed;
      try{proceed=await Dialog.confirm('Excluir elemento com ajuste para LLM?',
        `${taskCount} ajuste(s) aberto(s) estão neste elemento ou em seus descendentes. A exclusão também retira essas tarefas do documento. Desfazer recupera os elementos e seus comentários nesta sessão.`,
        'Excluir mesmo assim');}finally{this.pending=false;SE.refreshFlags();syncUI()}
      if(!proceed)return false;
    }
    // A host script or another UI action may change the document during a dialog.
    if(!EditorState.editMode||roots.some((el,i)=>!el.isConnected||el.parentNode!==parents[i]||this.protectedReason(el))||
      (!targets&&(selection().length!==prior.length||selection().some((el,i)=>el!==prior[i])))||this.hasTextRange()){
      notify('A seleção ou o documento mudou. Selecione novamente antes de excluir.');return false;
    }
    TextEditor.finishColor();H.uiEnd();H.commitContinuous();
    const focused=document.activeElement;let items=[];const beforeContext=preserveSpace?this.contextSnapshot(roots):null;
    try{
      items=roots.map(node=>({node,parent:node.parentNode,next:node.nextSibling,previous:node.previousSibling,index:[...node.parentNode.childNodes].indexOf(node),rect:this.rect(node),spacer:preserveSpace?this.spacer(node):null}));
    }catch(error){notify('Não foi possível preservar este espaço. Nenhum elemento foi excluído.');return false}
    SE.select(null);let changed=[];
    try{
      for(const it of items){this.detachItems([it]);changed.push(it)}
      if(preserveSpace){
        const same=items.every(it=>this.closeEnough(it.rect,this.rect(it.spacer)))&&
          beforeContext.siblings.every(({el,rect})=>el.isConnected&&this.closeEnough(rect,this.rect(el)))&&
          beforeContext.parents.every(({el,rect})=>Math.abs(this.rect(el).width-rect.width)<=2&&Math.abs(this.rect(el).height-rect.height)<=2);
        if(!same)throw new Error('A caixa não manteve a composição.');
      }
    }catch(error){
      this.restoreItems(changed);SE.selectMany(prior.filter(el=>el.isConnected));this.refreshAfterMutation();
      notify('Este layout não permite preservar a caixa com segurança. A exclusão foi cancelada.');return false;
    }
    const description=label||(preserveSpace?'Excluir preservando espaço':roots.length===1?'Excluir elemento':'Excluir '+roots.length+' elementos');
    const undo=()=>{
      if(items.some(it=>!it.parent.isConnected||it.node.isConnected||(it.spacer&&it.spacer.parentNode!==it.parent))){
        notify('Não foi possível restaurar: o container ou o espaço foi alterado fora do histórico.');return false;
      }
      this.closeMenu(false);this.hideFeedback();this.restoreItems(items);
      SE.selectMany(prior.filter(el=>el.isConnected).length?prior.filter(el=>el.isConnected):roots);this.refreshAfterMutation();return true;
    };
    const redo=()=>{
      if(items.some(it=>it.node.parentNode!==it.parent||!it.parent.isConnected||this.protectedReason(it.node))){
        notify('Não foi possível refazer: a estrutura original mudou.');return false;
      }
      this.closeMenu(false);this.hideFeedback();SE.select(null);this.detachItems(items);this.refreshAfterMutation();return true;
    };
    H.pushCustom(description,undo,redo);const record=H.undoStack.at(-1);record.kind='delete';
    this.refreshAfterMutation();
    if(!focused?.isConnected||overlay.contains(focused)||$('#ie-delete-menu').contains(focused))$('#ie-save').focus({preventScroll:true});
    const count=items.length,comments=taskCount?` ${taskCount} ajuste(s) retirado(s) com o alvo.`:'';
    this.showFeedback(record,(count===1?'Elemento excluído.':count+' elementos excluídos.')+(preserveSpace?' Espaço preservado nesta largura de tela.':'')+comments,
      preserveSpace?null:this.suggestions([...new Set(items.map(it=>it.parent))]));
    return true;
  },
  // Suggestions deliberately exclude scenes, pseudo-elements and original sizing.
  hasPseudo(el){return ['::before','::after'].some(p=>!['none','normal'].includes(getComputedStyle(el,p).content))},
  simpleContainer(el){
    if(!el?.isConnected||this.protectedReason(el)||!el.matches('div,section,article,aside,figure')||el.hasAttribute('data-ie-spacer'))return false;
    const c=getComputedStyle(el);
    if(!['static','relative'].includes(c.position)||c.transform!=='none'||c.animationName!=='none'||this.hasPseudo(el))return false;
    if(el.matches('[data-ie-effects],[data-ie-decor],[data-scroll],[data-scrollytelling],[data-scroll-scene]')||el.querySelector('script,style,iframe,canvas,video,[data-ie-effects],[data-scroll],[data-scrollytelling],[data-scroll-scene]'))return false;
    return ![...el.querySelectorAll('*')].some(n=>['absolute','fixed','sticky'].includes(getComputedStyle(n).position));
  },
  compactProps(el){
    if(!this.simpleContainer(el))return [];
    const base=BaselineManager.entries.get(el.dataset.ieHistoryId);if(!base)return [];
    const original=document.createElement('div');original.setAttribute('style',base.attrs.find(([k])=>k==='style')?.[1]||'');
    const authored=(el.getAttribute('data-ie-authored-style-props')||'').split(',');
    const props=['height','min-height'].filter(p=>authored.includes(p)&&el.style.getPropertyValue(p)&&
      ['', 'auto', '0px','0'].includes(original.style.getPropertyValue(p))&&el.style.getPropertyValue(p)!==original.style.getPropertyValue(p));
    if(!props.length)return [];
    const r=el.getBoundingClientRect(),c=getComputedStyle(el),bottom=Math.max(r.top,...[...el.children].filter(U.visible).map(e=>e.getBoundingClientRect().bottom));
    return r.bottom-bottom-safeNum(c.paddingBottom)-safeNum(c.borderBottomWidth)>=48?props:[];
  },
  emptyCandidate(el){
    if(!this.simpleContainer(el)||el.children.length||el.textContent.trim()||el.matches('[role],[aria-label],[aria-labelledby],[tabindex]'))return false;
    const c=getComputedStyle(el);
    if(c.backgroundImage!=='none'||!['transparent','rgba(0, 0, 0, 0)'].includes(c.backgroundColor)||c.boxShadow!=='none'||
      ['Top','Right','Bottom','Left'].some(side=>safeNum(c['border'+side+'Width'])>0)||safeNum(c.minHeight)>0||el.getBoundingClientRect().height>48)return false;
    if(el.id&&$$('a[href], [aria-controls], [aria-labelledby]').some(n=>n.getAttribute('href')==='#'+el.id||(n.getAttribute('aria-controls')||'').split(/\s+/).includes(el.id)||(n.getAttribute('aria-labelledby')||'').split(/\s+/).includes(el.id)))return false;
    return true;
  },
  suggestions(parents){
    // A multi-parent operation must never guess which ancestor the user intended.
    if(parents.length!==1)return null;
    const el=parents[0];if(this.compactProps(el).length)return{kind:'compact',el};
    if(this.emptyCandidate(el))return{kind:'empty',el};return null;
  },
  compact(el){
    const props=this.compactProps(el);if(!props.length){notify('Não há uma altura autoral que possa ser compactada com segurança.');return false}
    TextEditor.finishColor();H.uiEnd();H.commitContinuous();
    const base=BaselineManager.entries.get(el.dataset.ieHistoryId),original=document.createElement('div');original.setAttribute('style',base.attrs.find(([k])=>k==='style')?.[1]||'');
    const before=H.begin([el]),height=el.getBoundingClientRect().height;
    for(const p of props){const v=original.style.getPropertyValue(p);if(v)el.style.setProperty(p,v,original.style.getPropertyPriority(p));else el.style.removeProperty(p)}
    if(el.getBoundingClientRect().height>=height-1){H.applySnapshot(before);notify('O espaço é controlado pelo CSS original. Nenhuma altura foi alterada.');return false}
    const remain=(el.getAttribute('data-ie-authored-style-props')||'').split(',').filter(p=>!props.includes(p));
    if(remain.length)el.setAttribute('data-ie-authored-style-props',remain.join(','));else el.removeAttribute('data-ie-authored-style-props');
    H.end('Compactar container',before);this.refreshAfterMutation();this.showFeedback(H.undoStack.at(-1),'Altura autoral do container restaurada.');return true;
  },
  showFeedback(record,text,suggestion=null){
    this.hideFeedback();clearTimeout(Toast.timer);$('#ie-toast').hidden=true;this.feedback={record,suggestion};$('#ie-delete-feedback-text').textContent=text;
    const action=$('#ie-delete-followup');action.hidden=!suggestion;
    action.textContent=suggestion?.kind==='compact'?'Compactar container':'Excluir container vazio';
    action.dataset.help=suggestion?.kind==='compact'?'Restaura somente a altura criada pelo editor nesta sessão. Pode ser desfeito.':'Exclui apenas este container vazio. Não remove seus ancestrais.';
    $('#ie-delete-feedback').hidden=false;this.scheduleFeedbackHide();this.sync();
  },
  scheduleFeedbackHide(){clearTimeout(this.feedbackTimer);this.feedbackTimer=setTimeout(()=>{
    if($('#ie-delete-feedback').contains(document.activeElement)){this.scheduleFeedbackHide();return}this.hideFeedback();
  },12000)},
  hideFeedback(){clearTimeout(this.feedbackTimer);this.feedback=null;const node=$('#ie-delete-feedback');if(node)node.hidden=true},
  undoFeedback(){const r=this.feedback?.record;if(!r||H.continuous||H.uiTransaction||H.undoStack.at(-1)!==r){notify('Há ações mais recentes. Use Desfazer no histórico para respeitar a ordem.');return}H.undo();this.hideFeedback()},
  async followup(){
    const f=this.feedback;if(!f||H.undoStack.at(-1)!==f.record||!f.suggestion)return;
    const {kind,el}=f.suggestion;
    if(kind==='compact')this.compact(el);
    else if(this.emptyCandidate(el))await this.remove({targets:[el],label:'Excluir container vazio'});
  },
  openMenu(origin=$('#ie-delete-options')){
    const why=this.reason();if(why){notify(why);return}
    this.menuOrigin=origin;$('#ie-delete-menu').hidden=false;$('#ie-delete-options').setAttribute('aria-expanded','true');
    this.updateMenu();this.placeMenu();$('#ie-delete-menu-normal').focus({preventScroll:true});TooltipController.hide();
  },
  closeMenu(restore=true){
    $('#ie-delete-menu').hidden=true;$('#ie-delete-options').setAttribute('aria-expanded','false');
    if(restore&&this.menuOrigin?.isConnected&&!this.menuOrigin.hidden)this.menuOrigin.focus({preventScroll:true});this.menuOrigin=null;
  },
  updateMenu(){
    const reasons=this.roots().map(el=>this.spaceReason(el)).filter(Boolean),button=$('#ie-delete-menu-space');
    button.disabled=!!reasons.length;$('#ie-delete-space-hint').textContent=reasons[0]||'Mantém uma caixa vazia nesta largura de tela. Revise também outras larguras.';
  },
  placeMenu(){
    const node=$('#ie-delete-menu');if(node.hidden)return;
    const a=this.menuOrigin?.getBoundingClientRect()||$('#ie-selection-actions').getBoundingClientRect();
    const w=node.offsetWidth,h=node.offsetHeight,tb=toolbar.hidden?null:toolbar.getBoundingClientRect();
    const clampPoint=([x,y])=>[clamp(x,8,Math.max(8,innerWidth-w-8)),clamp(y,8,Math.max(8,innerHeight-h-8))];
    const points=[[a.left,a.bottom+6],[a.left,a.top-h-6],[a.right+6,a.top],[a.left-w-6,a.top],[8,8],[innerWidth-w-8,8]].map(clampPoint);
    const [x,y]=points.find(([x,y])=>!tb||!OverlayManager.intersects({left:x,top:y,right:x+w,bottom:y+h},tb,4))||points[0];
    Object.assign(node.style,{left:px(x),top:px(y)});
  },
  placeActions(group){
    const selectionRect=U.bound(selection());OverlayManager.placeGrab(group,selectionRect);
    const tb=toolbar.hidden?null:toolbar.getBoundingClientRect(),r=group.getBoundingClientRect(),w=r.width,h=r.height;
    const free=(x,y)=>x>=8&&y>=8&&x+w<=innerWidth-8&&y+h<=innerHeight-8&&(!tb||!OverlayManager.intersects({left:x,top:y,right:x+w,bottom:y+h},tb,5));
    if(free(r.left,r.top))return;
    const x=clamp(selectionRect.left,8,Math.max(8,innerWidth-w-8)),y=clamp(selectionRect.top,8,Math.max(8,innerHeight-h-8));
    const candidates=[...(tb?[[x,tb.top-h-8],[x,tb.bottom+8],[tb.left-w-8,y],[tb.right+8,y]]:[]),[x,8],[8,8],[innerWidth-w-8,8],[8,innerHeight-h-8],[innerWidth-w-8,innerHeight-h-8]];
    const hit=candidates.find(([x,y])=>free(x,y));if(hit){group.style.left=px(hit[0]-selectionRect.left);group.style.top=px(hit[1]-selectionRect.top)}
  },
  sync(){
    const group=$('#ie-selection-actions'),trash=$('#ie-delete-element'),more=$('#ie-delete-options');if(!group)return;
    const roots=this.roots(),why=this.reason(roots),protectedSelection=roots.some(el=>!!this.protectedReason(el));
    const present=EditorState.editMode&&!!roots.length&&!protectedSelection;
    trash.hidden=more.hidden=!present;trash.disabled=more.disabled=!!why;
    trash.dataset.help=why||(roots.length>1?'Excluir seleção (Del).':'Excluir elemento (Del).');
    trash.setAttribute('aria-label',roots.length>1?'Excluir seleção':'Excluir elemento');
    const panel=$('#ie-delete-from-panel');if(panel){panel.disabled=!!why;panel.dataset.help=why||'Excluir a seleção ou preservar seu espaço.'}
    const grab=$('#ie-move-handle');group.hidden=grab.hidden&&!present;
    if(!overlay.hidden&&!group.hidden&&!EditorState.geometry){
      this.placeActions(group);grab.style.removeProperty('left');grab.style.removeProperty('top');
    }
    if(!$('#ie-delete-menu').hidden){if(why)this.closeMenu(false);else{this.updateMenu();this.placeMenu()}}
    if(this.feedback){
      const current=H.undoStack.at(-1)===this.feedback.record&&!H.continuous&&!H.uiTransaction;
      $('#ie-delete-undo').disabled=!current;$('#ie-delete-followup').disabled=!current;
      if(!EditorState.editMode)this.hideFeedback();
    }
  },
  handleKeydown(e){
    if(!$('#ie-delete-menu').hidden){
      if(e.key==='Escape'){e.preventDefault();this.closeMenu();return true}
      const buttons=$$('button:not(:disabled)',$('#ie-delete-menu'));
      if(['ArrowDown','ArrowUp','Home','End'].includes(e.key)){
        e.preventDefault();const i=buttons.indexOf(document.activeElement);
        const next=e.key==='Home'?0:e.key==='End'?buttons.length-1:(i+(e.key==='ArrowDown'?1:-1)+buttons.length)%buttons.length;
        buttons[next]?.focus();return true;
      }
      if(e.key==='Tab'){this.closeMenu(false);return false}
    }
    if(e.key!=='Delete'||e.ctrlKey||e.metaKey||e.altKey||e.shiftKey||e.repeat||e.defaultPrevented||e.isComposing||TextEditor.composing||!EditorState.editMode)return false;
    if(this.componentOwnsFocus(e)||this.textField(e.target)||this.textField(document.activeElement)||this.hasTextRange())return false;
    if(!selection().length)return false;
    e.preventDefault();void this.remove();return true;
  },
  install(){
    $('#ie-delete-element').addEventListener('click',()=>this.remove());
    $('#ie-delete-options').addEventListener('click',()=>$('#ie-delete-menu').hidden?this.openMenu():this.closeMenu());
    $('#ie-delete-from-panel').addEventListener('click',e=>this.openMenu(e.currentTarget));
    $('#ie-delete-menu-normal').addEventListener('click',()=>this.remove());
    $('#ie-delete-menu-space').addEventListener('click',()=>this.remove({preserveSpace:true}));
    $('#ie-delete-undo').addEventListener('click',()=>this.undoFeedback());
    $('#ie-delete-followup').addEventListener('click',()=>this.followup());
    $('#ie-delete-feedback-close').addEventListener('click',()=>this.hideFeedback());
    document.addEventListener('pointerdown',e=>{if(!$('#ie-delete-menu').hidden&&!e.target.closest?.('#ie-delete-menu,#ie-delete-options,#ie-delete-from-panel'))this.closeMenu(false)},true);
  }
};
