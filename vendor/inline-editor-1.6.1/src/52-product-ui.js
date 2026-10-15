// Product surface only. Reuses selection, modal keyboard handling and Serializer.
const ProductUI={
  previous:new Map(),query:'',activeTopic:null,exportPending:false,
  fold(text){return String(text).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase()},
  open(id){
    if(!$('#ie-dialog').hidden)return;
    for(const other of ['ie-help-modal','ie-about-modal'])if(other!==id&&!$('#'+other).hidden)this.close(other,false);
    const modal=$('#'+id);if(!modal.hidden)return;
    this.previous.set(id,document.activeElement);TooltipController.hide();modal.hidden=false;
    $('#'+(id==='ie-help-modal'?'ie-help-open':'ie-about-open')).setAttribute('aria-expanded','true');
    if(id==='ie-help-modal'){
      const es=selection();$('#ie-help-context').hidden=!es.length;
      $('#ie-help-selection').textContent=es.length>1?es.length+' elementos selecionados':U.label(es[0]);
      $('#ie-help-scope').textContent=$('#ie-text-scope').textContent;
      this.query='';$('#ie-help-search').value='';this.showHome();$('#ie-help-search').focus({preventScroll:true});
    }else $('#ie-about-close').focus({preventScroll:true});
  },
  close(id,restore=true){
    $('#'+id).hidden=true;TooltipController.hide();
    $('#'+(id==='ie-help-modal'?'ie-help-open':'ie-about-open')).setAttribute('aria-expanded','false');
    const previous=this.previous.get(id);this.previous.delete(id);
    if(restore&&previous?.isConnected)previous.focus({preventScroll:true});
  },
  showHome({focus=false}={}){
    this.activeTopic=null;$('#ie-help-detail').hidden=true;$('#ie-help-home').hidden=false;
    $$('.ie-help-article',$('#ie-help-modal')).forEach(e=>e.hidden=true);
    const words=this.fold(this.query).trim().split(/\s+/).filter(Boolean);let count=0;
    for(const button of $$('[data-ie-help-topic]',$('#ie-help-modal'))){
      const article=$('#ie-help-article-'+button.dataset.ieHelpTopic);
      const text=this.fold(button.textContent+' '+article.dataset.helpKeywords+' '+article.textContent);
      button.hidden=!words.every(word=>text.includes(word));if(!button.hidden)count++;
    }
    $('#ie-help-clear').hidden=!this.query;$('#ie-help-empty').hidden=count>0;
    $('#ie-help-search-status').textContent=words.length?count+' '+(count===1?'tópico encontrado':'tópicos encontrados'):'';
    $('#ie-help-scroll').scrollTop=0;
    if(focus)($('#ie-help-topics button:not([hidden])')||$('#ie-help-search')).focus({preventScroll:true});
  },
  showTopic(topic){
    const section=$('#ie-help-article-'+topic);if(!section)return;
    this.activeTopic=topic;$('#ie-help-home').hidden=true;$('#ie-help-detail').hidden=false;
    $$('.ie-help-article',$('#ie-help-modal')).forEach(e=>e.hidden=e!==section);
    $('#ie-help-category').value=topic;$('#ie-help-scroll').scrollTop=0;
    section.querySelector('h3').focus({preventScroll:true});
  },
  async exportFinal(){
    if(this.exportPending||EditorState.saving)return;this.exportPending=true;
    try{
      const proceed=await Dialog.confirm('Exportar versão final?',
        'Será criada uma cópia sem a interface, comentários e tarefas do editor. Suas alterações visuais e os efeitos necessários serão preservados. Esta página continua editável: salve também o editável para guardar comentários e continuar depois.',
        'Exportar final');
      if(proceed)await Serializer.save({clean:true});
    }finally{this.exportPending=false}
  },
  install(){
    for(const kind of ['help','about']){
      $('#ie-'+kind+'-open').addEventListener('click',()=>this.open('ie-'+kind+'-modal'));
      $('#ie-'+kind+'-close').addEventListener('click',()=>this.close('ie-'+kind+'-modal'));
    }
    $('#ie-help-search').addEventListener('input',e=>{this.query=e.target.value;this.showHome()});
    $('#ie-help-search').addEventListener('keydown',e=>{if(e.key==='Enter'){
      e.preventDefault();const first=$('#ie-help-topics button:not([hidden])');if(first)this.showTopic(first.dataset.ieHelpTopic);
    }});
    $('#ie-help-clear').addEventListener('click',()=>{this.query='';$('#ie-help-search').value='';this.showHome();$('#ie-help-search').focus()});
    $$('[data-ie-help-topic]',$('#ie-help-modal')).forEach(b=>b.addEventListener('click',()=>this.showTopic(b.dataset.ieHelpTopic)));
    $('#ie-help-back').addEventListener('click',()=>this.showHome({focus:true}));
    $('#ie-help-category').addEventListener('change',e=>this.showTopic(e.target.value));
    $('#ie-export-final').addEventListener('click',()=>this.exportFinal());
  }
};
