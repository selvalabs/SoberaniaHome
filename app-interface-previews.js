/* Captured app interfaces. Dataset and API responses are demonstrative. */
(() => {
  const previews = [
    {card:'.work-uve',pages:[
      {label:'Studio',asset:'portfolio-uve-studio-v1.png',caption:'Editor e controles de voz. Interface real, perfil demonstrativo.'},
      {label:'Perfil de voz',asset:'portfolio-uve-profile-v1.png',caption:'Preparação de um perfil local. Interface real do UVE.'}
    ]},
    {card:'.work-rag',pages:[
      {label:'Entrada',asset:'portfolio-rag-overview-v1.png',caption:'Documentos e consulta local. Interface real, base demonstrativa.'},
      {label:'Consulta',asset:'portfolio-rag-query-v1.png',caption:'Resposta com fontes. Conteúdo demonstrativo, sem inferência real.'}
    ]}
  ];
  previews.forEach(({card,pages}) => {
    const figure=document.querySelector(`#laboratorio ${card} .work-evidence`);
    if(!figure||figure.dataset.appPreview)return;
    figure.dataset.appPreview='true';
    const image=figure.querySelector('img'),caption=figure.querySelector('figcaption');
    if(!image||!caption)return;
    image.width=1440;image.height=960;
    const controls=document.createElement('div');controls.className='work-page-selector';
    controls.setAttribute('aria-label','Telas do aplicativo');
    let request=0;
    const buttons=pages.map((page,index)=>{
      const button=document.createElement('button');button.type='button';button.textContent=page.label;
      button.setAttribute('aria-pressed',String(index===0));
      button.addEventListener('click',()=>show(index));controls.append(button);return button;
    });
    const count=document.createElement('span');count.className='work-page-count';count.setAttribute('aria-live','polite');controls.append(count);
    figure.insertBefore(controls,caption);
    async function show(index){
      const token=++request,page=pages[index],preview=new Image();preview.src=`./assets/${page.asset}`;
      figure.setAttribute('aria-busy','true');
      try{
        await preview.decode();if(token!==request)return;
        image.src=preview.src;image.alt=page.caption;caption.textContent=page.caption;
        buttons.forEach((button,i)=>button.setAttribute('aria-pressed',String(i===index)));
        count.textContent=`${index+1} / ${pages.length}`;
      }catch{if(token===request)count.textContent='Prévia indisponível';}
      finally{if(token===request)figure.removeAttribute('aria-busy');}
    }
    show(0);
  });
})();
