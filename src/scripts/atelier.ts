import { scenarios, sectorLabels, examples, type Proposal, type Sector } from '../data/atelier';

const root = document.querySelector<HTMLElement>('[data-atelier]');
if (root) {
  const find = <T extends HTMLElement>(selector:string) => root.querySelector<T>(selector)!;
  const controls = find<HTMLFieldSetElement>('[data-atelier-controls]');
  const form = find<HTMLFormElement>('[data-atelier-form]');
  const sector = find<HTMLSelectElement>('#atelier-sector');
  const context = find<HTMLTextAreaElement>('#atelier-context');
  const output = find('[data-atelier-output]');
  const status = find('[data-atelier-status]');
  const ai = find<HTMLButtonElement>('[data-atelier-ai]');
  const download = find<HTMLButtonElement>('[data-atelier-export]');
  const retry = find<HTMLButtonElement>('[data-atelier-retry]');
  const example = find<HTMLButtonElement>('[data-atelier-example]');
  const error = find('[data-atelier-error]');
  let current = scenarios.cooperativa;
  let mode = 'Demonstração local / cenário preparado';
  let resultContext = '', resultSector:Sector = 'cooperativa', busy = false;
  let arrivalTimer:ReturnType<typeof setTimeout>;
  controls.disabled = false;
  download.hidden = false;
  find('[data-atelier-view]').addEventListener('click',event=>{
    event.preventDefault();find('[data-atelier-title]').focus();
  });

  const text = (selector:string,value:string) => { find(selector).textContent=value; };
  const list = (selector:string,values:string[]) => {
    find(selector).replaceChildren(...values.map(value => {
      const li=document.createElement('li');li.textContent=value;return li;
    }));
  };
  function updateDraft() {
    const changed=context.value.trim()!==resultContext || sector.value!==resultSector;
    find('[data-atelier-draft]').hidden=!changed;
    text('[data-atelier-count]',`${context.value.length} / 1800`);
    example.textContent=context.value ? 'Substituir anotação por um exemplo' : 'Usar um exemplo de situação';
  }
  function clearError() { error.hidden=true;error.textContent='';context.removeAttribute('aria-invalid'); }
  context.addEventListener('input',()=>{clearError();updateDraft();});
  example.addEventListener('click',()=>{
    context.value=examples[sector.value as Sector];clearError();updateDraft();context.focus();
    status.textContent='Situação de exemplo inserida. Você pode editá-la antes de montar o esboço.';
  });
  function show(proposal:Proposal,source:string,submittedContext:string,submittedSector:Sector,focusResult:boolean) {
    current=proposal;mode=source;resultContext=submittedContext;resultSector=submittedSector;
    const generated=source.startsWith('Proposta de IA');
    text('[data-atelier-mode]',generated?'IA na borda · contexto enviado para processamento':'Modo local · esta ação não envia dados');
    text('[data-atelier-title]',proposal.title);text('[data-atelier-summary]',proposal.summary);
    text('[data-atelier-output-mode]',source);text('[data-atelier-next]',proposal.next);
    text('[data-atelier-result-context]',submittedContext||`Nenhuma anotação incluída. Exemplo: ${sectorLabels[submittedSector].toLowerCase()}.`);
    text('[data-atelier-context-origin]',generated?'Contexto utilizado nesta proposta de IA. Revise a interpretação.':'Anotação de contexto; o roteiro local é preparado.');
    list('[data-atelier-data]',proposal.data);list('[data-atelier-human]',proposal.human);
    find('[data-atelier-steps]').replaceChildren(...proposal.steps.map((step,index)=>{
      const li=document.createElement('li');li.dataset.step=String(index+1).padStart(2,'0');
      const strong=document.createElement('strong');strong.textContent=step.title;
      const p=document.createElement('p');p.textContent=step.detail;li.append(strong,p);return li;
    }));
    updateDraft();clearTimeout(arrivalTimer);output.dataset.arriving='true';
    arrivalTimer=setTimeout(()=>delete output.dataset.arriving,900);
    document.dispatchEvent(new Event('sl:layout-change'));
    if(focusResult) find('[data-atelier-title]').focus();
  }
  function local(focusResult:boolean) {
    if(busy)return;
    clearError();
    show(scenarios[sector.value as Sector],'Demonstração local / cenário preparado',context.value.trim(),sector.value as Sector,focusResult);
    status.textContent=context.value.trim()
      ?'Anotação incluída. O roteiro é o exemplo preparado para o campo escolhido; nenhuma IA interpretou o texto.'
      :'Exemplo local atualizado. Anote sua situação ou leve o roteiro para conversar com sua equipe.';
  }
  form.addEventListener('submit',event=>{event.preventDefault();local(true);});
  sector.addEventListener('change',()=>local(false));
  download.addEventListener('click',()=>{
    const generated=mode.startsWith('Proposta de IA');
    const content=['SOBERANIA LABS / MESA DE POSSIBILIDADES',mode,`CAMPO: ${sectorLabels[resultSector]}`,'',
      generated?'Contexto utilizado pela IA; proposta sujeita a revisão.':'Roteiro preparado. A anotação abaixo não foi interpretada por IA.',
      '', 'CONTEXTO',resultContext||'Não informado','',current.title,current.summary,'',
      ...current.steps.flatMap((s,i)=>[`${i+1}. ${s.title}`,s.detail,'']),
      'DADOS',...current.data.map(s=>`- ${s}`),'','DECISÕES HUMANAS',...current.human.map(s=>`- ${s}`),'',current.next,'',
      'Esboço para discussão. Não constitui orçamento nem projeto técnico validado.'].join('\n');
    const url=URL.createObjectURL(new Blob([content],{type:'text/plain;charset=utf-8'}));
    const a=document.createElement('a');a.href=url;a.download='soberania-esboco-de-projeto.txt';a.click();
    setTimeout(()=>URL.revokeObjectURL(url),1000);
    status.textContent='Último esboço exportado. Anotações ainda não incorporadas ficam fora deste arquivo.';
  });

  // Match the public Worker contract before changing the visible result.
  const safe=(value:unknown,max:number):value is string => typeof value==='string'&&!!value.trim()&&value.length<=max&&!/[<>\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f\u202a-\u202e\u2066-\u2069]/.test(value);
  const keys=(p:any,names:string[])=>p&&typeof p==='object'&&!Array.isArray(p)&&Object.keys(p).length===names.length&&names.every(k=>Object.hasOwn(p,k));
  const valid=(p:any):p is Proposal=>keys(p,['title','summary','steps','data','human','next'])&&safe(p.title,100)&&safe(p.summary,500)&&safe(p.next,300)
    &&Array.isArray(p.steps)&&p.steps.length>=3&&p.steps.length<=4&&p.steps.every((s:any)=>keys(s,['title','detail'])&&safe(s.title,80)&&safe(s.detail,300))
    &&['data','human'].every(k=>Array.isArray(p[k])&&p[k].length>=1&&p[k].length<=4&&p[k].every((v:unknown)=>safe(v,200)));
  async function connect() {
    retry.hidden=true;retry.disabled=true;
    text('[data-atelier-connection]','Verificando disponibilidade da IA. O exemplo local continua disponível.');
    try {
      const response=await fetch('/api/atelier',{signal:AbortSignal.timeout(5000)});
      if(!response.ok)throw new Error('unavailable');
      const config=await response.json();
      ai.hidden=config?.enabled!==true;
      if(!ai.hidden){
        text('[data-atelier-connection]','Conectada. “Explorar com IA” usa sua situação para propor um novo caminho. O envio só ocorre ao clicar.');
        text('[data-atelier-privacy]','O esboço local usa um roteiro preparado e não envia dados. Ao clicar “Explorar com IA”, seu texto e o campo escolhido serão enviados ao Worker da Soberania e processados por Cloudflare Workers AI. Evite dados pessoais ou confidenciais. Revise a resposta.');
      } else {
        text('[data-atelier-connection]','Não ativada neste ambiente. Explore os exemplos locais enquanto a integração não estiver disponível.');
        retry.hidden=false;
      }
    } catch {
      ai.hidden=true;retry.hidden=false;
      text('[data-atelier-connection]','Não foi possível verificar a conexão. Os exemplos locais e o download continuam disponíveis.');
    } finally {retry.disabled=false;}
  }
  retry.addEventListener('click',()=>void connect());
  if(root.dataset.edgeEnabled==='true')void connect();
  ai.addEventListener('click',async()=>{
    if(busy)return;
    clearError();
    if(context.value.trim().length<20){
      error.hidden=false;error.textContent='Para usar IA, descreva a situação em pelo menos 20 caracteres.';
      context.setAttribute('aria-invalid','true');status.textContent='Complete a descrição para explorar com IA.';context.focus();return;
    }
    const submittedContext=context.value.trim(),submittedSector=sector.value as Sector;
    busy=true;controls.disabled=true;download.disabled=true;retry.disabled=true;output.setAttribute('aria-busy','true');
    text('[data-atelier-mode]','IA na borda · envio para processamento externo');
    status.textContent='Preparando uma hipótese com IA. Isso pode levar alguns segundos…';
    try {
      const response=await fetch('/api/atelier',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({sector:submittedSector,context:submittedContext}),signal:AbortSignal.timeout(30000)});
      if(!response.ok){
        const message=response.status===429?'O limite de uso foi atingido. Aguarde um minuto ou monte um esboço local.'
          :response.status===504?'A IA demorou demais para responder. Tente novamente ou use o exemplo local.'
          :response.status===400?'Não foi possível aceitar a descrição. Revise o texto e tente novamente.'
          :'A IA está indisponível agora. Tente novamente ou use o exemplo local.';
        throw new Error(message);
      }
      let result;
      try {result=await response.json();}catch{throw new Error('A IA devolveu uma resposta ilegível. Tente novamente ou use o exemplo local.');}
      if(!valid(result?.proposal))throw new Error('A resposta da IA veio incompleta. Tente novamente ou use o exemplo local.');
      // Return focus only if the visitor is still working in the form.
      const focusResult=root.contains(document.activeElement)&&!output.contains(document.activeElement);
      show(result.proposal,'Proposta de IA / revisar antes de usar',submittedContext,submittedSector,focusResult);
      status.textContent='Proposta pronta. Confira as hipóteses, os dados necessários e quem deve participar do primeiro teste.';
    } catch(caught) {
      let message='Não foi possível concluir. Tente novamente ou monte um esboço local.';
      if(caught instanceof Error){
        if(caught.name==='TimeoutError'||caught.name==='AbortError')message='A resposta demorou demais. Tente novamente ou use o exemplo local.';
        else if(caught instanceof TypeError)message='A conexão falhou durante o envio. Verifique sua rede ou use o exemplo local.';
        else message=caught.message;
      }
      status.textContent=`${message} O último esboço foi mantido.`;
    } finally {
      busy=false;controls.disabled=false;download.disabled=false;retry.disabled=false;output.removeAttribute('aria-busy');updateDraft();
    }
  });
}
