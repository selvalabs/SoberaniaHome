function boot(){
  if(toolbar.hasAttribute('data-ie-booted'))return;toolbar.setAttribute('data-ie-booted',VERSION);
  const existing=$$('[data-ie-history-id]');for(const e of existing)e.removeAttribute('data-ie-history-id');
  EditorState.freeMove=Storage.get('free-move',false);EditorState.smartGuides=Storage.get('guides',true);EditorState.snapping=Storage.get('snapping',true);EditorState.lockRatio=Storage.get('ratio',true);
  // Initialize before exposing the API: integrations see a ready, single runtime.
  TextRangeController.install();TextActivationController.install();ActionSnackbar.install();SE.install();TextEditor.install();TextNavigationController.install();CommentManager.install();GeometryController.install();OverlayManager.install();
  SubTabController.install();ToolbarController.install();installBindings();BoxModelController.install();NumericStepperController.install();TooltipController.install();
  $$('[title]',toolbar).forEach(e=>e.removeAttribute('title'));
  window.InlineEditor={version:VERSION,state:EditorState,select:(e,opts)=>SE.select(e,opts),selectMany:es=>SE.selectMany(es),open:()=>ToolbarController.open(),close:()=>ToolbarController.close(),undo:()=>H.undo(),redo:()=>H.redo(),serialize:opts=>Serializer.html(opts),save:()=>Serializer.save(),
    // Documented diagnostics/services used by the included behavioral QA suite.
    controllers:{DeleteController,TextRangeController,TextActivationController,InlineFormatEngine,TextNavigationController,DuplicateController,CommentManager,BoxModelController,BoxValue,BoxSourceResolver,SubTabController,SelectionEngine,GroupController,GeometryController,HistoryManager,BaselineManager,DirtyStateGuard,VisualEngine,ShadowComposer,FilterComposer,EffectsEngine,TextEditor,TableEditor,Decorations,Serializer,Dialog,ToolbarController},
    diagnostics(){return{version:VERSION,selection:selection().map(U.label),dirty:DirtyStateGuard.dirty,history:H.undoStack.length,redo:H.redoStack.length,geometryActive:!!EditorState.geometry}}
  };
  syncUI();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
