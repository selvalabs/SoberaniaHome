function installBindings(){
  const draftIds=['ie-bg-mode','ie-bg-color','ie-gradient-color2','ie-gradient-angle','ie-bg-alpha','ie-bg-overlay-color','ie-shadow-enabled','ie-shadow-x','ie-shadow-y','ie-shadow-blur','ie-shadow-spread','ie-shadow-color','ie-shadow-alpha','ie-drop-enabled','ie-drop-x','ie-drop-y','ie-drop-blur','ie-drop-color','ie-drop-alpha','ie-decor-text','ie-decor-color','ie-decor-bg','ie-decor-size','ie-decor-px','ie-decor-py','ie-decor-radius','ie-decor-x','ie-decor-y'];
  draftIds.forEach(id=>{const n=$('#'+id);for(const ev of ['input','change'])n.addEventListener(ev,()=>ToolbarController.drafts.add(id));});
  const clearDraft=prefix=>{for(const id of [...ToolbarController.drafts])if(id.startsWith(prefix))ToolbarController.drafts.delete(id)};

  const change=(id,fn)=>{const el=$('#'+id);if(el)el.addEventListener('change',e=>{if(selection().length)fn(e.target.value,e.target,e)})};
  const click=(id,fn)=>{const el=$('#'+id);if(el)el.addEventListener('click',fn)};
  for(const k of Object.keys(EFFECT_CATALOG)){const sel=$('#ie-fx-'+k);for(const [v,label] of EFFECT_CATALOG[k]){const o=document.createElement('option');o.value=v;o.textContent=label;sel.appendChild(o)}
    change('ie-fx-'+k,(v)=>{if(k==='loop'&&v==='rotate')$('#ie-fx-loop-duration').value=24;EffectsEngine.apply(k)});for(const tail of ['intensity','duration',...(k==='enter'?['delay']:[])])change('ie-fx-'+k+'-'+tail,()=>EffectsEngine.apply(k));
  }
  for(const b of $$('[data-fx-preview]',toolbar))b.onclick=()=>EffectsEngine.preview(b.dataset.fxPreview);
  for(const b of $$('[data-fx-reset]',toolbar))b.onclick=()=>EffectsEngine.reset(b.dataset.fxReset);
  click('ie-parent',()=>SE.parent());click('ie-child',()=>SE.child());click('ie-duplicate-element',()=>DuplicateController.duplicate());click('ie-reset-selected',()=>BaselineManager.resetSelected());click('ie-reset-session',()=>BaselineManager.resetSession());
  $('#ie-multi-mode').onchange=e=>{EditorState.multiMode=e.target.checked;notify(EditorState.multiMode?'Clique para adicionar/remover elementos.':'Seleção individual ativa.')};
  click('ie-select-all-text',()=>TextEditor.selectAll());
  click('ie-bold',()=>TextEditor.toggle('fontWeight','700','400','Negrito'));click('ie-italic',()=>TextEditor.toggle('fontStyle','italic','normal','Itálico'));click('ie-underline',()=>TextEditor.toggle('textDecorationLine','underline','none','Sublinhado'));
  for(const [id,prop,label,convert] of [['ie-font-family','fontFamily','Fonte',v=>v],['ie-font-size','fontSize','Tamanho do texto',v=>px(clamp(Number(v),6,300))],['ie-font-weight','fontWeight','Peso do texto',v=>String(clamp(Number(v),100,900))],['ie-line-height','lineHeight','Altura da linha',v=>String(clamp(Number(v),.5,6))],['ie-letter-spacing','letterSpacing','Espaço entre letras',v=>px(clamp(Number(v),-5,40))],['ie-text-transform','textTransform','Maiúsculas/minúsculas',v=>v]])change(id,v=>TextEditor.apply(prop,convert(v),label));
  for(const [id,prop,label] of [['ie-text-color','color','Cor do texto'],['ie-text-bg','backgroundColor','Marca-texto']]){
    const input=$('#'+id);input.addEventListener('input',()=>TextEditor.previewColor(prop,input.value,label));
    input.addEventListener('change',()=>{TextEditor.previewColor(prop,input.value,label);TextEditor.finishColor()});
    input.addEventListener('blur',()=>TextEditor.finishColor());
  }
  for(const b of $$('[data-text-align]',toolbar))b.onclick=()=>TextEditor.apply('textAlign',b.dataset.textAlign,'Alinhar texto');
  for(const family of ['system-ui','Arial','Georgia','Verdana','Trebuchet MS','Times New Roman','Courier New']){const o=document.createElement('option');o.value=family;o.textContent=family;$('#ie-font-family').appendChild(o)}
  change('ie-link-url',v=>{if(selection().length!==1||ctx()!=='link')return;if(!U.safeUrl(v)){notify('Destino inválido. Use #seção ou um endereço web, e-mail ou telefone.');return}withHistory('Destino do link',[selected()],()=>selected().setAttribute('href',v))});
  change('ie-link-target',v=>{if(selection().length!==1||ctx()!=='link')return;withHistory('Abertura do link',[selected()],()=>{selected().setAttribute('target',v);if(v==='_blank'){const rel=new Set((selected().getAttribute('rel')||'').split(/\s+/).filter(Boolean));rel.add('noopener');selected().setAttribute('rel',[...rel].join(' '))}})});
  change('ie-image-alt',v=>{if(selection().length===1&&ctx()==='image')withHistory('Descrição da imagem',[selected()],()=>selected().setAttribute('alt',v))});
  click('ie-replace-image',()=>$('#ie-image-file').click());$('#ie-image-file').onchange=e=>{VisualEngine.replaceImage(e.target.files[0]);e.target.value=''};
  for(const prop of ['width','height','min-width','min-height'])change('ie-'+prop,v=>GeometryController.setDimension(prop,v));
  click('ie-width-auto',()=>GeometryController.clearDimension('width'));click('ie-height-auto',()=>GeometryController.clearDimension('height'));
  $('#ie-lock-ratio').onchange=e=>{EditorState.lockRatio=e.target.checked;Storage.set('ratio',EditorState.lockRatio)};
  click('ie-restore-size',()=>{const el=selected(),base=el&&BaselineManager.entries.get(H.ensureId(el));if(!base){notify('O tamanho ainda não foi alterado nesta sessão.');return}withHistory('Restaurar tamanho',[el],()=>{const t=document.createElement('div');t.setAttribute('style',base.attrs.find(([k])=>k==='style')?.[1]||'');for(const p of ['width','height','min-width','max-width','min-height','max-height','box-sizing','flex-shrink']){const v=t.style.getPropertyValue(p);if(v)el.style.setProperty(p,v,t.style.getPropertyPriority(p));else el.style.removeProperty(p)}})});
  for(const mode of ['top','middle','bottom'])click('ie-align-'+mode,()=>GeometryController.alignVertical(mode));click('ie-media-borders',()=>SubTabController.setSub('visual','borders'));
  for(const mode of ['left','center','right'])click('ie-align-'+mode,()=>GeometryController.alignSingle(mode));
  $('#ie-free-move').onchange=e=>{EditorState.freeMove=e.target.checked;Storage.set('free-move',EditorState.freeMove);OverlayManager.update()};$('#ie-smart-guides').onchange=e=>{EditorState.smartGuides=e.target.checked;Storage.set('guides',EditorState.smartGuides)};$('#ie-snapping').onchange=e=>{EditorState.snapping=e.target.checked;Storage.set('snapping',EditorState.snapping)};
  change('ie-offset-x',v=>GeometryController.offset('x',v));change('ie-offset-y',v=>GeometryController.offset('y',v));change('ie-position-css',v=>GeometryController.setPositionMode(v));
  for(const b of $$('[data-pos]',toolbar))b.onclick=()=>GeometryController.preset(b.dataset.pos);
  change('ie-col-width',v=>TableEditor.setColumn(Number(v)));change('ie-row-height',v=>TableEditor.setRow(Number(v)));click('ie-col-auto',()=>TableEditor.setColumn(''));click('ie-row-auto',()=>TableEditor.setRow(''));
  $('#ie-table-col-handle').onpointerdown=e=>TableEditor.start('column',e);$('#ie-table-row-handle').onpointerdown=e=>TableEditor.start('row',e);
  for(const b of $$('[data-group-align]',toolbar))b.onclick=()=>GroupController.align(b.dataset.groupAlign);click('ie-distribute-x',()=>GroupController.distribute('x'));click('ie-distribute-y',()=>GroupController.distribute('y'));click('ie-gap-x',()=>GroupController.distribute('x',Number($('#ie-group-gap').value)));click('ie-gap-y',()=>GroupController.distribute('y',Number($('#ie-group-gap').value)));
  click('ie-bg-apply',()=>{clearDraft('ie-bg-');clearDraft('ie-gradient-');VisualEngine.setBackground()});click('ie-bg-file-open',()=>$('#ie-bg-file').click());$('#ie-bg-file').onchange=e=>{VisualEngine.replaceImage(e.target.files[0],true);e.target.value=''};click('ie-bg-image-remove',()=>VisualEngine.property('backgroundImage','none','Remover imagem de fundo'));
  change('ie-bg-overlay',v=>VisualEngine.overlay(v));change('ie-bg-size',v=>VisualEngine.property('backgroundSize',v));change('ie-bg-repeat',v=>VisualEngine.property('backgroundRepeat',v));for(const b of $$('[data-bgpos]',toolbar))b.onclick=()=>VisualEngine.property('backgroundPosition',b.dataset.bgpos,'Posição do fundo');
  for(const [id,p,convert] of [['ie-border-width','borderWidth',v=>px(Math.max(0,Number(v)))],['ie-border-style','borderStyle',v=>v],['ie-border-color','borderColor',v=>v],['ie-radius','borderRadius',v=>px(Math.max(0,Number(v)))],['ie-outer-width','outlineWidth',v=>px(Math.max(0,Number(v)))],['ie-outer-color','outlineColor',v=>v],['ie-outer-offset','outlineOffset',v=>px(Number(v))],['ie-outer-style','outlineStyle',v=>v]])change(id,v=>{withHistory('Bordas',selection(),()=>selection().forEach(e=>{S.set(e,p,convert(v),{strong:true});if(p==='borderWidth'&&getComputedStyle(e).borderStyle==='none')S.set(e,'borderStyle',$('#ie-border-style').value==='none'?'solid':$('#ie-border-style').value,{strong:true});if(p==='outlineWidth')S.set(e,'outlineStyle',$('#ie-outer-style').value||'solid',{strong:true})}))});
  change('ie-inner-width',v=>VisualEngine.patch({innerWidth:Math.max(0,Number(v)),innerColor:$('#ie-inner-color').value},'Borda interna'));change('ie-inner-color',v=>VisualEngine.patch({innerColor:v},'Cor da borda interna'));
  change('ie-shadow-preset',v=>VisualEngine.shadowPreset(v));click('ie-shadow-apply',()=>VisualEngine.patch({shadowEnabled:$('#ie-shadow-enabled').checked,shadowX:Number($('#ie-shadow-x').value),shadowY:Number($('#ie-shadow-y').value),shadowBlur:Math.max(0,Number($('#ie-shadow-blur').value)),shadowSpread:Number($('#ie-shadow-spread').value),shadowColor:$('#ie-shadow-color').value,shadowAlpha:Number($('#ie-shadow-alpha').value)},'Sombra adicional'));
  for(const k of ['brightness','contrast','saturate','grayscale','blur'])change('ie-'+k,v=>VisualEngine.patch({[k]:Number(v)},'Filtro '+k));click('ie-filters-reset',()=>VisualEngine.resetFilters());
  change('ie-img-fit',v=>{if(ctx()==='image')VisualEngine.property('objectFit',v,'Enquadramento')});for(const b of $$('[data-object-pos]',toolbar))b.onclick=()=>{if(ctx()==='image')VisualEngine.property('objectPosition',b.dataset.objectPos,'Recorte da foto')};
  click('ie-drop-apply',()=>VisualEngine.patch({dropEnabled:$('#ie-drop-enabled').checked,dropX:Number($('#ie-drop-x').value),dropY:Number($('#ie-drop-y').value),dropBlur:Number($('#ie-drop-blur').value),dropAlpha:Number($('#ie-drop-alpha').value),dropColor:$('#ie-drop-color').value},'Sombra da mídia'));
  change('ie-opacity',v=>VisualEngine.property('opacity',String(clamp(Number(v),0,100)/100),'Opacidade da seleção'));
  change('ie-decor-side',v=>{Decorations.side=v;clearDraft('ie-decor-');syncUI()});$('#ie-decor-side').value='after';click('ie-decor-apply',()=>{clearDraft('ie-decor-');Decorations.apply()});click('ie-decor-clear',()=>Decorations.clear());
  click('ie-hide-element',()=>{const es=selection(),show=es.every(e=>getComputedStyle(e).display==='none');withHistory('Ocultar/mostrar seleção',es,()=>es.forEach(e=>{if(show){const saved=U.json(e,'data-ie-hidden-display',null);if(saved?.value)e.style.setProperty('display',saved.value,saved.priority||'');else e.style.removeProperty('display');e.removeAttribute('data-ie-hidden-display')}else{e.setAttribute('data-ie-hidden-display',JSON.stringify({value:e.style.getPropertyValue('display'),priority:e.style.getPropertyPriority('display')}));S.set(e,'display','none',{strong:true})}}))});
  change('ie-overflow',v=>VisualEngine.property('overflow',v));change('ie-z-index',v=>VisualEngine.property('zIndex',String(Math.round(Number(v)))));
  for(const id of ['ie-shadow-apply','ie-drop-apply'])$('#'+id).addEventListener('click',()=>clearDraft(id==='ie-shadow-apply'?'ie-shadow-':'ie-drop-'));
  for(const b of $$('[data-action=undo]',toolbar))b.onclick=()=>{H.uiEnd();H.undo()};for(const b of $$('[data-action=redo]',toolbar))b.onclick=()=>{H.uiEnd();H.redo()};
  click('ie-clear-format',()=>TextEditor.clear());
  click('ie-save',()=>Serializer.save());click('ie-dialog-cancel',()=>Dialog.finish(false));click('ie-dialog-confirm',()=>Dialog.finish(true));
  ProductUI.install();
  DeleteController.install();
  click('ie-snack-cancel',()=>ActionSnackbar.hide());click('ie-snack-confirm',()=>ActionSnackbar.confirm());click('ie-snack-save',()=>ActionSnackbar.confirm(true));
  document.addEventListener('keydown',e=>{const openModal=!$('#ie-dialog').hidden?$('#ie-dialog'):!$('#ie-help-modal').hidden?$('#ie-help-modal'):!$('#ie-about-modal').hidden?$('#ie-about-modal'):null;
    if(openModal){if(e.key==='Escape'){e.preventDefault();if(openModal.id==='ie-dialog')Dialog.finish(false);else ProductUI.close(openModal.id);return}if(e.key==='Tab'){const list=$$('button,input,select,textarea,a[href],[tabindex="0"]',openModal).filter(e=>!e.disabled&&U.visible(e)),a=list[0],b=list.at(-1);if(!openModal.contains(document.activeElement)){e.preventDefault();a?.focus()}else if(e.shiftKey&&document.activeElement===a){e.preventDefault();b?.focus()}else if(!e.shiftKey&&document.activeElement===b){e.preventDefault();a?.focus()}}return}
    if(DeleteController.handleKeydown(e))return;
    if(e.key==='Escape'){if(EditorState.geometry){e.preventDefault();GeometryController.cancel();return}if(EditorState.editMode){SE.select(null);ActionSnackbar.hide();TooltipController.hide()}return}
    const mod=e.ctrlKey||e.metaKey,k=e.key.toLowerCase();if(mod&&k==='s'){e.preventDefault();Serializer.save();return}if(mod&&e.shiftKey&&k==='e'){e.preventDefault();EditorState.editMode?ToolbarController.close():ToolbarController.open();return}
    if(!EditorState.editMode||!mod)return;const inInput=!!e.target.closest?.('input,textarea,select,[role=\"textbox\"],[role=\"searchbox\"]');
    const foreignEditable=e.target.isContentEditable&&!(selection().length===1&&selected()?.contains(e.target));
    if(inInput||foreignEditable||e.isComposing||DeleteController.componentOwnsFocus(e))return;
    if(k==='z'||k==='y'){e.preventDefault();H.uiEnd();(k==='y'||e.shiftKey)?H.redo():H.undo()}
  },true);
}
// Table separators belong to the same overlay and the same pointer-session dispatcher.
const updateOverlayBase=OverlayManager.update.bind(OverlayManager);
OverlayManager.update=function(){updateOverlayBase();const info=TableEditor.info(),show=EditorState.editMode&&selection().length===1&&info&&!info.ambiguous;$('#ie-table-col-handle').hidden=!show;$('#ie-table-row-handle').hidden=!show;DeleteController.sync()};
