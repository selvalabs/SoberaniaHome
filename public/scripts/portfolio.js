/* Independent, user-controlled page galleries inside the real work mockups. */
(() => {
  'use strict';
  const galleries = {
    lab_roots: [{"label": "Operação", "asset": "edition/lab-roots-overview-v1.webp", "alt": "Painel real do T1 Roots em modo demonstração.", "caption": "O cultivo visto como um sistema."}, {"label": "Estufa", "asset": "edition/lab-roots-greenhouse-v1.webp", "alt": "Visualização da estufa envidraçada no painel T1 Roots.", "caption": "Sensores e atuadores, no contexto da estufa."}],
    lab_game: [{"label": "Abertura", "asset": "edition/lab-game-overview-v1.webp", "alt": "Abertura real do Laboratório Educativo, com missões da primeira aula.", "caption": "Aprender observando o que uma regra muda."}, {"label": "Aula", "asset": "edition/lab-game-lesson-v1.webp", "alt": "Interface real da primeira aula do Laboratório Educativo.", "caption": "Da regra ao movimento dentro do jogo."}],
    lab_foco: [{"label": "Entrada", "asset": "edition/lab-foco-overview-v1.webp", "alt": "Página inicial local do Esquerda em Foco.", "caption": "A consulta começa pelo contexto."}, {"label": "Edição SC", "asset": "edition/lab-foco-edition-v1.webp", "alt": "Hub de Santa Catarina do site Esquerda em Foco.", "caption": "Estados e cargos com seus próprios recortes."}],
    lab_techia: [{"label": "Publicação", "asset": "edition/lab-techia-overview-v1.webp", "alt": "Atlas real da interface pública Tech/IA, um protótipo com conteúdo em rascunho.", "caption": "Leitura e consulta na mesma publicação."}, {"label": "Glossário", "asset": "edition/lab-techia-glossary-v1.webp", "alt": "Tela de glossário do protótipo Tech/IA.", "caption": "Uma palavra abre outros caminhos de leitura."}],
    lab_ciclico: [{"label": "Abertura", "asset": "edition/lab-ciclico-overview-v1.webp", "alt": "Página pública real do Planejamento Cíclico em prévia local.", "caption": "Dar forma digital a uma proposta de comunidade."}, {"label": "Comunidade", "asset": "edition/lab-ciclico-community-v1.webp", "alt": "Apresentação da comunidade na página pública do Planejamento Cíclico.", "caption": "A narrativa acompanha a proposta e o método."}],
    analytics: [
      {label:'Login',asset:'edition/portfolio-analytics-login-v1.webp',alt:'Tela real de login do SoberanIA Analytics com usuário e senha vazios.',caption:'Entrar para acompanhar os próprios dados.'},
      {label:'Visão geral',asset:'edition/portfolio-analytics-v1.webp',alt:'Visão geral real do SoberanIA Analytics com dados de demonstração.',caption:'Entender os acessos. Manter o controle dos dados.'},
      {label:'Mapa',asset:'edition/portfolio-analytics-map-v1.webp',alt:'Mapa real do SoberanIA Analytics com cidades e acessos fictícios de demonstração.',caption:'Os acessos no território. Cidades e coordenadas aproximadas.'},
      {label:'Documentação',asset:'edition/portfolio-analytics-documentation-v1.webp',alt:'Documentação dentro do Analytics, com orientações para instalar, interpretar e operar a ferramenta.',caption:'Conhecer a ferramenta também faz parte de usá-la.'}
    ],
    circulo: [
      {label:'Login',asset:'edition/portfolio-circulo-login-v2.webp',alt:'Tela real de login do Círculo, com campos de email e senha vazios.',caption:'Entrar no Círculo. Um começo para cada jornada.'},
      {label:'Portal',asset:'edition/portfolio-circulo-v1.webp',alt:'Portal real do Círculo em pré-visualização, com cursos e jornadas da comunidade.',caption:'Uma casa para o conhecimento compartilhado.'},
      {label:'Curso',asset:'edition/portfolio-circulo-course-v1.webp',alt:'Página real de curso no Círculo em pré-visualização, com apresentação e lista de conteúdos.',caption:'Organizar uma jornada, do primeiro passo às aulas.'},
      {label:'Aula',asset:'edition/portfolio-circulo-lesson-v1.webp',alt:'Página real de aula do Círculo em desenvolvimento, com material, progresso e comentários.',caption:'Conteúdo, acompanhamento e conversa no mesmo lugar.'}
    ],
    editor: [
      {label:'Documento',asset:'edition/portfolio-editor-real-document-v1.webp',alt:'Documento HTML autocontido antes de abrir o Inline Editor 1.6.1.',caption:'Um documento aberto para ler e transformar.'},
      {label:'Edição',asset:'edition/portfolio-editor-real-v2.webp',alt:'Inline Editor 1.6.1 com ferramentas de edição e exportação do HTML.',caption:'Editar na página. Levar o documento consigo.'}
    ],
    monitor: [
      {label:'Abertura',asset:'edition/portfolio-monitor-public-v1.webp',alt:'Página real do Monitor Comunitário para acompanhar avisos públicos e cadastrar um endereço.',caption:'Avisos públicos, mais perto de quem precisa.'},
      {label:'Cadastro',asset:'edition/portfolio-monitor-registration-v1.webp',alt:'Formulário real de cadastro por endereço do Monitor Comunitário, sem dados preenchidos.',caption:'O endereço conecta a informação ao cotidiano.'},
      {label:'Avisos',asset:'edition/portfolio-monitor-whatsapp-v10.webp',alt:'Conversa demonstrativa no WhatsApp com o texto do alerta utilizado em produção pelo Monitor Comunitário; nome e ocorrência fictícios.',caption:'O alerta pelo WhatsApp. Texto de produção, dados ilustrativos.'}
    ]
  };

  document.querySelectorAll('[data-work-gallery]').forEach(figure => {
    const key=figure.dataset.workGallery,pages=galleries[key];
    if(!pages?.length)return;
    const image=figure.querySelector('img'),caption=figure.querySelector('figcaption');
    let current=0,requestId=0;
    image.id=`work-image-${key}`;
    if(key === "circulo" || key === "analytics") image.src=`./assets/${pages[0].asset}`;
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
        figure.querySelector(".work-screen").classList.toggle("phone-mockup",key==="monitor"&&page.label==="Avisos");
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
