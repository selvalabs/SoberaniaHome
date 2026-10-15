/* Independent, user-controlled page galleries inside the real work mockups. */
(() => {
  'use strict';
  const galleries = {
    analytics: [
      {label:'Visão geral',asset:'portfolio-analytics-v1.png',alt:'Visão geral real do SoberanIA Analytics com dados de demonstração.',caption:'Entender os acessos. Manter o controle dos dados.'},
      {label:'Funil',asset:'portfolio-analytics-funnel-v1.png',alt:'Página real de funil do Analytics, com etapas e números fictícios de demonstração.',caption:'Acompanhar o caminho entre a visita e a ação.'},
      {label:'Docs',asset:'portfolio-analytics-documentation-v1.png',alt:'Documentação dentro do Analytics, com orientações para instalar, interpretar e operar a ferramenta.',caption:'Conhecer a ferramenta também faz parte de usá-la.'}
    ],
    circulo: [
      {label:'Portal',asset:'portfolio-circulo-v1.png',alt:'Portal real do Círculo em pré-visualização, com cursos e jornadas da comunidade.',caption:'Uma casa para o conhecimento compartilhado.'},
      {label:'Curso',asset:'portfolio-circulo-course-v1.png',alt:'Página real de curso no Círculo em pré-visualização, com apresentação e lista de conteúdos.',caption:'Organizar uma jornada, do primeiro passo às aulas.'},
      {label:'Aula',asset:'portfolio-circulo-lesson-v1.png',alt:'Página real de aula do Círculo em desenvolvimento, com material, progresso e comentários.',caption:'Conteúdo, acompanhamento e conversa no mesmo lugar.'}
    ],
    editor: [
      {label:'Documento',asset:'portfolio-editor-document-v1.png',alt:'Documento real no editor HTML desta página, antes de ativar a edição.',caption:'Um documento aberto para ler e transformar.'},
      {label:'Edição',asset:'portfolio-editor-v1.png',alt:'Editor HTML real com edição ativa, controles de imagem e exportação do documento.',caption:'Editar na página. Levar o documento consigo.'}
    ],
    monitor: [
      {label:'Abertura',asset:'portfolio-monitor-public-v1.png',alt:'Página real do Monitor Comunitário para acompanhar avisos públicos e cadastrar um endereço.',caption:'Avisos públicos, mais perto de quem precisa.'},
      {label:'Cadastro',asset:'portfolio-monitor-registration-v1.png',alt:'Formulário real de cadastro por endereço do Monitor Comunitário, sem dados preenchidos.',caption:'O endereço conecta a informação ao cotidiano.'},
      {label:'Avisos',asset:'portfolio-monitor-member-v1.png',alt:'Painel real de avisos do Monitor Comunitário, exibindo um alerta fictício de demonstração.',caption:'Um aviso relacionado ao endereço cadastrado.'}
    ]
  };

  document.querySelectorAll('[data-work-gallery]').forEach(figure => {
    const key=figure.dataset.workGallery,pages=galleries[key];
    if(!pages?.length)return;
    const image=figure.querySelector('img'),caption=figure.querySelector('figcaption');
    let current=0,requestId=0;
    image.id=`work-image-${key}`;
    image.alt=pages[0].alt;
    caption.textContent=pages[0].caption;
    const selector=document.createElement('div');
    selector.className='work-page-selector';
    selector.setAttribute('role','group');
    selector.setAttribute('aria-label','Páginas deste produto');
    const buttons=pages.map((page,index)=>{
      const button=document.createElement('button');
      button.type='button';button.textContent=page.label;
      button.setAttribute('aria-pressed',String(index===0));
      button.setAttribute('aria-controls',image.id);
      button.addEventListener('click',()=>show(index));
      selector.append(button);
      return button;
    });
    const count=document.createElement('span');
    count.className='work-page-count';count.textContent=`1 / ${pages.length}`;
    count.setAttribute('aria-live','polite');count.setAttribute('aria-atomic','true');
    selector.append(count);
    figure.insertBefore(selector,caption);

    async function show(index){
      const token=++requestId;
      if(index===current){figure.removeAttribute('aria-busy');return;}
      const page=pages[index],preview=new Image();
      preview.src=`./assets/${page.asset}`;
      figure.setAttribute('aria-busy','true');
      try{
        await preview.decode();
        if(token!==requestId)return;
        image.src=preview.src;image.alt=page.alt;caption.textContent=page.caption;
        current=index;
        buttons.forEach((button,i)=>button.setAttribute('aria-pressed',String(i===index)));
        count.textContent=`${index+1} / ${pages.length}`;
      }catch{
        if(token===requestId)count.textContent='Imagem indisponível';
      }finally{
        if(token===requestId)figure.removeAttribute('aria-busy');
      }
    }
    selector.addEventListener('keydown',event=>{
      if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;
      event.preventDefault();
      const active=buttons.indexOf(document.activeElement),base=active<0?current:active;
      const index=event.key==='Home'?0:event.key==='End'?pages.length-1:
        (base+(event.key==='ArrowRight'?1:-1)+pages.length)%pages.length;
      buttons[index].focus({preventScroll:true});show(index);
    });
  });
})();
