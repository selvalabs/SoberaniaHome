/* Box Model 1.5.2. This is the only writer for the Spacing pane.
 * Scope: author CSS from readable sheets (media/supports and ordinary selectors).
 * Unknown cascade constructs are explicitly reported as Calculado, never guessed.
 * No runtime dependencies, no replacement of GeometryController or host rules.
 */
const BoxValue = {
  units:['px','%','rem','em','vw','vh'],
  parse(raw,source='computed',extra={}) {
    raw=String(raw??'').trim();
    const base={kind:'expression',value:null,unit:null,raw,source,...extra};
    if(raw.toLowerCase()==='auto')return {...base,kind:'auto'};
    const m=raw.match(/^([+-]?(?:\d+(?:\.\d*)?|\.\d+))(px|%|rem|em|vw|vh)?$/i);
    if(m&&(m[2]||Number(m[1])===0))return {...base,kind:'length',value:Number(m[1]),unit:(m[2]||'px').toLowerCase()};
    return base;
  },
  format(n,u){return String(Math.round((n+Number.EPSILON)*100000)/100000)+u},
  // Split only outside function/attribute/string nesting, retaining the raw formula.
  split(s,comma=false){const out=[];let part='',depth=0,quote='',escaped=false;
    for(const c of s){if(escaped){part+=c;escaped=false;continue}if(c==='\\'){part+=c;escaped=true;continue}if(quote){part+=c;if(c===quote)quote='';continue}if(c==='"'||c==="'"){quote=c;part+=c;continue}if(c==='('||c==='[')depth++;if(c===')'||c===']')depth--;
      if(!depth&&(comma?c===',':/\s/.test(c))){if(part.trim())out.push(part.trim());part=''}else part+=c}
    if(part.trim())out.push(part.trim());return out},
  same(a,b){return a.kind===b.kind&&a.unit===b.unit&&(a.kind==='length'?Math.abs(a.value-b.value)<.00001:a.raw===b.raw)},
  aggregate(values){if(!values.length)return this.parse('0px');if(values.every(x=>this.same(x,values[0])))return {...values[0],members:values};
    const length=values.every(v=>v.kind==='length'),sameUnit=length&&values.every(v=>v.unit===values[0].unit);
    return {kind:'mixed',raw:'',value:null,unit:sameUnit?values[0].unit:null,source:'computed',members:values,
      reason:sameUnit?'values':length?'units':values.some(v=>v.kind==='auto')?'auto':'expression'};
  }
};
const BoxSourceResolver = {
  serialized(style){
    // CSSOM exposes empty longhands for pending var() shorthands. cssText retains
    // the authored shorthand, so parse its declarations without splitting functions.
    const text=style.cssText,out=[];let part='',depth=0,quote='',escape=false;
    const push=()=>{const m=part.trim().match(/^([-\w]+)\s*:\s*([\s\S]*)$/);part='';if(!m)return;const important=/\s*!important\s*$/i.test(m[2]);out.push([m[1],m[2].replace(/\s*!important\s*$/i,'').trim(),important?'important':''])};
    for(const c of text){if(escape){part+=c;escape=false;continue}if(c==='\\'){part+=c;escape=true;continue}if(quote){part+=c;if(c===quote)quote='';continue}if(c==='"'||c==="'"){quote=c;part+=c;continue}if(c==='('||c==='[')depth++;if(c===')'||c===']')depth--;if(c===';'&&!depth)push();else part+=c}push();return out;
  },
  // CSS specificity, including :is/:not/:has/:where and :nth-child(... of ...).
  specificity(selector){let a=0,b=0,c=0,i=0;const ident=()=>{let start=i;while(i<selector.length&&/[\w\-\u0080-\uffff]/.test(selector[i]))i++;if(i===start)i++};
    while(i<selector.length){const t=selector[i];if(/\s|[>+~,*]/.test(t)){i++;continue}if(t==='&'||t==='\\'||t==='|')return null;
      if(t==='#'){a++;i++;ident();continue}if(t==='.'){b++;i++;ident();continue}
      if(t==='['){b++;i++;let quote='';while(i<selector.length){const q=selector[i++];if(q==='\\'){i++;continue}if(quote){if(q===quote)quote=''}else if(q==='"'||q==="'")quote=q;else if(q===']')break}continue}
      if(t===':'){i++;if(selector[i]===':'){c++;i++;ident();continue}const start=i;ident();const name=selector.slice(start,i).toLowerCase();
        if(['before','after','first-line','first-letter'].includes(name))c++;else if(!['where','is','not','has'].includes(name))b++;
        if(selector[i]==='('){i++;let d=1,arg='',quote='';while(i<selector.length&&d){const q=selector[i++];if(quote){arg+=q;if(q===quote)quote='';continue}if(q==='"'||q==="'"){quote=q;arg+=q;continue}if(q==='(')d++;if(q===')')d--;if(d)arg+=q}
          if(['is','not','has'].includes(name)||(['nth-child','nth-last-child'].includes(name)&&/\s+of\s+/i.test(arg))){if(name.startsWith('nth-'))arg=arg.replace(/^.*?\s+of\s+/i,'');const specs=BoxValue.split(arg,true).map(x=>this.specificity(x));if(specs.some(x=>!x))return null;specs.sort(this.compare);const max=specs.at(-1)||[0,0,0];a+=max[0];b+=max[1];c+=max[2]}}
        continue}
      if(/[a-zA-Z_\u0080-\uffff]/.test(t)){c++;ident();continue}i++;
    }return [a,b,c];
  },
  compare(a,b){for(let k=0;k<a.length;k++)if(a[k]!==b[k])return a[k]-b[k];return 0},
  logicalMap(el){const cs=getComputedStyle(el),vertical=cs.writingMode.startsWith('vertical'),rtl=cs.direction==='rtl';
    return vertical?{'inline-start':rtl?'bottom':'top','inline-end':rtl?'top':'bottom','block-start':cs.writingMode==='vertical-rl'?'right':'left','block-end':cs.writingMode==='vertical-rl'?'left':'right'}:{'inline-start':rtl?'right':'left','inline-end':rtl?'left':'right','block-start':'top','block-end':'bottom'};
  },
  declaration(style,prop,el){let result=null;
    const family=prop.split('-')[0],gap=prop==='row-gap'||prop==='column-gap';
    const relevant=name=>name===prop||name==='all'||(['padding','margin'].includes(family)&&(name===family||name.startsWith(family+'-')))||(gap&&['gap','row-gap','column-gap','grid-gap','grid-row-gap','grid-column-gap'].includes(name));
    const names=[...style].filter(relevant);if(!names.length)return null;
    // Avoid serializing/parsing embedded multi-megabyte background images on each read.
    // Only pending var() shorthands need cssText; ordinary CSSOM longhands are exact.
    const declarations=names.some(n=>!style.getPropertyValue(n))?this.serialized(style).filter(([n])=>relevant(n)):names.map(n=>[n,style.getPropertyValue(n).trim(),style.getPropertyPriority(n)]);
    const map=names.some(n=>/-(inline|block)/.test(n))?this.logicalMap(el):{};
    for(const [name,value,priority] of declarations){let raw=null;
      if(name===prop)raw=value;
      const kind=prop.split('-')[0],side=prop.slice(kind.length+1);
      if(name===kind&&['padding','margin'].includes(kind)){
        // Substitution of a var()-shorthand can contain an unknown number of sides.
        if(/var\(/i.test(value))raw=value;
        else {const v=BoxValue.split(value);if(v.length>=1&&v.length<=4)raw=[v[0],v[1]??v[0],v[2]??v[0],v[3]??v[1]??v[0]][['top','right','bottom','left'].indexOf(side)]}
      }
      if(['padding','margin'].includes(kind)&&name.startsWith(kind+'-')){const suffix=name.slice(kind.length+1);if(map[suffix]===side)raw=value;
        if(['inline','block'].includes(suffix)){const vals=BoxValue.split(value);for(const [j,end] of ['start','end'].entries())if(map[suffix+'-'+end]===side)raw=vals[j]??vals[0]}
      }
      if((prop==='row-gap'||prop==='column-gap')&&(name==='gap'||name==='grid-gap')){const vals=BoxValue.split(value);raw=/var\(/.test(value)?value:vals[prop==='row-gap'?0:1]??vals[0]}
      if(name==='all')raw=value;
      if(raw!=null && (!result || priority==='important'||result.priority!=='important'))result={raw,priority,declared:name};
    }return result;
  },
  resolve(el,prop){const matches=[];let order=0,unknown=false;const sheets=[...document.styleSheets,...(document.adoptedStyleSheets||[])];
    const visit=(rules,opaque=false)=>{for(const rule of rules){
      if(rule.type===1){const selectors=BoxValue.split(rule.selectorText,true).filter(s=>{try{return el.matches(s)}catch(_){return false}});if(selectors.length){const decl=this.declaration(rule.style,prop,el);if(decl){const specs=selectors.map(s=>this.specificity(s));if(opaque||specs.some(s=>!s))unknown=true;else{specs.sort(this.compare);matches.push({...decl,source:'stylesheet',selector:rule.selectorText,spec:specs.at(-1),inline:0,order:order++})}}}else if(rule.selectorText.includes('&')&&this.declaration(rule.style,prop,el))unknown=true;
        if(rule.cssRules?.length)visit(rule.cssRules,true);
      } else if(rule.type===4){if(matchMedia(rule.conditionText).matches)visit(rule.cssRules,opaque)}
      else if(rule.type===12){if(CSS.supports(rule.conditionText))visit(rule.cssRules,opaque)}
      else if(rule.type===3){if(!rule.media?.mediaText||matchMedia(rule.media.mediaText).matches){try{visit(rule.styleSheet.cssRules,opaque)}catch(_){unknown=true}}}
      else if(rule.cssRules && rule.type!==7)visit(rule.cssRules,true);
    }};
    for(const sheet of sheets){if(sheet.disabled||sheet.ownerNode?.hasAttribute?.('data-ie-runtime'))continue;if(sheet.media?.mediaText&&!matchMedia(sheet.media.mediaText).matches)continue;try{visit(sheet.cssRules)}catch(_){unknown=true}}
    const inline=this.declaration(el.style,prop,el);if(inline)matches.push({...inline,source:'inline',selector:'style',spec:[0,0,0],inline:1,order:Infinity});
    matches.sort((a,b)=>(a.priority==='important')-(b.priority==='important')||a.inline-b.inline||this.compare(a.spec,b.spec)||a.order-b.order);
    const winner=matches.at(-1),computed=getComputedStyle(el).getPropertyValue(prop).trim();
    // Inline important is unambiguous even with inaccessible author sheets.
    if(unknown&&!(winner?.inline&&winner.priority==='important'))return BoxValue.parse(computed,'computed',{computed,reason:'Cascata não identificável com segurança (CSS externo, camadas, nesting ou escopo).'});
    if(winner){const meta=U.json(el,'data-ie-box-model',{}),auth=meta[prop];return BoxValue.parse(winner.raw,auth&&winner.inline&&auth.raw===winner.raw?'authored':winner.source,{computed,priority:winner.priority,selector:winner.selector,declared:winner.declared});}
    return BoxValue.parse(computed||'0px','computed',{computed,reason:'Nenhuma declaração de autor identificada; este é o resultado calculado.'});
  }
};
const BoxModelController = {
  sides:['top','right','bottom','left'],key:'',pending:null,fields:new Map(),memo:null,
  props(family){return family==='gap'?['column-gap','row-gap']:this.sides.map(s=>family+'-'+s)},
  family(prop){return prop.includes('gap')?'gap':prop.split('-')[0]},
  label(prop){const family=this.family(prop);return (family==='padding'?'Espaço interno':family==='margin'?'Espaço externo':'Espaço entre itens')+(prop==='gap'?' geral':({'top':' acima','right':' à direita','bottom':' abaixo','left':' à esquerda','column-gap':' horizontal','row-gap':' vertical'}[prop.replace(/^(padding|margin)-/,'')]||''))},
  limits(prop){return {min:this.family(prop)==='margin'?-2000:0,max:2000}},
  read(el,prop){if(prop==='gap')return BoxValue.aggregate(this.props('gap').map(p=>this.read(el,p)));const key=H.ensureId(el)+'|'+prop;if(this.memo?.has(key))return this.memo.get(key);const result=BoxSourceResolver.resolve(el,prop);this.memo?.set(key,result);return result},
  values(prop,els=selection()){return BoxValue.aggregate(els.flatMap(e=>prop==='gap'?this.props('gap').map(p=>this.read(e,p)):[this.read(e,prop)]))},
  allowed(el,prop){const c=getComputedStyle(el),f=this.family(prop);if(f==='gap')return /^(inline-)?(flex|grid)$/.test(c.display);
    if(f==='margin'&&(/^(table-cell|table-row|table-row-group|table-header-group|table-footer-group|table-column|table-column-group)$/.test(c.display)||['TD','TH'].includes(el.tagName)))return false;
    if(f==='margin'&&c.display==='inline'&&/-(top|bottom)$/.test(prop)&&!['IMG','VIDEO','IFRAME','INPUT','SELECT','TEXTAREA'].includes(el.tagName))return false;
    return c.display!=='contents'&&c.display!=='none';
  },
  targets(prop){const f=this.family(prop),linked=$('#ie-link-'+f)?.checked;
    return prop==='gap'||linked?this.props(f):[prop];
  },
  stateKey(){return selection().map(e=>H.ensureId(e)).join('|')+'|'+selection().map(e=>getComputedStyle(e).display).join('|')},
  error(message,input=null){if(input){input.setAttribute('aria-invalid','true');input.dataset.boxInvalid='1'}$('#ie-box-feedback').textContent=message;$('#ie-box-feedback').hidden=false;notify(message);return{status:'blocked',reason:message}},
  validate(prop,raw){const v=BoxValue.parse(raw),bounds=this.limits(prop);if(v.kind==='auto')return this.family(prop)==='margin'?{ok:true,value:v}:{ok:false,reason:'Auto só é permitido no espaço externo.'};
    if(v.kind!=='length'||!BoxValue.units.includes(v.unit)||!Number.isFinite(v.value))return {ok:false,reason:'Defina um número e uma unidade válidos. Fórmulas existentes são preservadas, não editadas como números.'};
    if(v.value<bounds.min||v.value>bounds.max)return {ok:false,reason:`Use um valor entre ${bounds.min} e ${bounds.max} ${v.unit}. Nenhuma alteração foi aplicada.`};
    if(!CSS.supports(prop,raw))return {ok:false,reason:'Esta medida não é aceita para a propriedade.'};return {ok:true,value:v};
  },
  contentSize(el,axis){const c=getComputedStyle(el),v=safeNum(c[axis]);return Math.max(0,c.boxSizing==='border-box'?v-safeNum(c[axis==='width'?'paddingLeft':'paddingTop'])-safeNum(c[axis==='width'?'paddingRight':'paddingBottom'])-safeNum(c[axis==='width'?'borderLeftWidth':'borderTopWidth'])-safeNum(c[axis==='width'?'borderRightWidth':'borderBottomWidth']):v)},
  basis(el,prop,unit){if(unit==='px')return 1;if(unit==='rem')return safeNum(getComputedStyle(document.documentElement).fontSize,16);if(unit==='em')return safeNum(getComputedStyle(el).fontSize,16);if(unit==='vw')return innerWidth/100;if(unit==='vh')return innerHeight/100;
    if(unit!=='%')return null;const cs=getComputedStyle(el);
    if(this.family(prop)==='gap'){
      // Cyclic gaps in an auto-sized flex/grid box have no safe general conversion.
      const dim=prop==='column-gap'?'width':'height',rule=BoxSourceResolver.resolve(el,dim);
      if(rule.source==='computed'||['auto','normal'].includes(rule.raw))return null;
      return this.contentSize(el,dim)/100||null;
    }
    let parent=['absolute','fixed'].includes(cs.position)?el.offsetParent:el.parentElement;
    while(parent&&getComputedStyle(parent).display==='contents')parent=parent.parentElement;
    if(!parent)return innerWidth/100;
    if(getComputedStyle(parent).writingMode!=='horizontal-tb')return null;
    return (['absolute','fixed'].includes(cs.position)?parent.clientWidth:this.contentSize(parent,'width'))/100||null;
  },
  equivalentPx(el,prop,v){if(v.kind==='length'){const b=this.basis(el,prop,v.unit);return b==null?null:v.value*b}const computed=getComputedStyle(el).getPropertyValue(prop).trim();return /^[+-]?[\d.]+px$/.test(computed)?parseFloat(computed):computed==='normal'&&this.family(prop)==='gap'?0:null},
  requestedPx(el,prop,raw){return this.equivalentPx(el,prop,BoxValue.parse(raw))},
  preflight(ops){const unique=[...new Set(ops.map(o=>o.el))],styles=unique.map(e=>[e,e.getAttribute('style')]);const conflicts=[];
    try{for(const o of ops)o.el.style.setProperty(o.prop,o.raw,'');
      for(const o of ops){const result=BoxSourceResolver.resolve(o.el,o.prop);const req=BoxValue.parse(o.raw);
        const expected=this.requestedPx(o.el,o.prop,o.raw),got=getComputedStyle(o.el).getPropertyValue(o.prop).trim();
        const semanticBlocked=result.source!=='computed'&&!BoxValue.same(result,req);
        const transitioning=o.el.getAnimations().some(a=>a.transitionProperty===o.prop);
        const mismatch=semanticBlocked||(!transitioning&&expected!=null&&/px$/.test(got)&&Math.abs(parseFloat(got)-expected)>.75);
        if(mismatch)conflicts.push({element:U.label(o.el),property:o.prop,requested:o.raw,applied:got,source:result.selector||'Cascata/limitação CSS'});
      }
    }finally{for(const [e,s] of styles)if(s===null)e.removeAttribute('style');else e.setAttribute('style',s)}
    return conflicts;
  },
  ask(type,ops,message){NumericStepperController.finish();this.pending={type,ops,key:this.stateKey()};const panel=$('#ie-box-pending');panel.hidden=false;$('#ie-box-pending-text').textContent=message;
    $('#ie-box-force').hidden=type!=='conflict';$('#ie-box-accept').hidden=type==='conflict';$('#ie-box-accept').textContent=type==='conversion'?'Converter na tela atual':'Aplicar substituição';
    $('#ie-box-cancel').focus();return{status:'pending',type};
  },
  clearPending(){this.pending=null;$('#ie-box-pending').hidden=true},
  write(ops,label){const els=[...new Set(ops.map(o=>o.el))];this.memo=null;
    // No StyleEngine.set here: its automatic importance is intentionally retained
    // for geometry/text but is forbidden in the Box Model path.
    H.mutate(label,els,()=>{for(const o of ops){o.el.style.setProperty(o.prop,o.raw,o.force?'important':'');S.authoredProp(o.el,o.prop);const meta=U.json(o.el,'data-ie-box-model',{});meta[o.prop]={raw:o.el.style.getPropertyValue(o.prop),priority:o.force?'important':''};o.el.setAttribute('data-ie-box-model',JSON.stringify(meta))}});
    $('#ie-box-feedback').hidden=true;this.sync(true);OverlayManager.update();return{status:'applied',count:ops.length};
  },
  submit(ops,{confirmed=false,force=false,label='Ajustar espaçamento'}={}){
    if(EditorState.geometry)return this.error('Termine o movimento ou redimensionamento antes de alterar o espaçamento.');
    if(!ops.length)return{status:'empty'};this.memo=null;
    for(const o of ops){if(!o.el.isConnected||U.isProtected(o.el)||!this.allowed(o.el,o.prop))return this.error('Esta seleção não aceita esse espaçamento. Use o container ou os controles de tabela.');const valid=this.validate(o.prop,o.raw);if(!valid.ok)return this.error(valid.reason);}
    if(!confirmed){const replaces=ops.some(o=>{const prev=this.read(o.el,o.prop),next=BoxValue.parse(o.raw);return prev.kind==='expression'||(prev.kind==='auto'&&next.kind!=='auto')||prev.source==='computed'||(next.unit==='px'&&prev.kind==='length'&&prev.unit!=='px')});
      if(replaces)return this.ask('replace',ops,'A origem inclui AUTO, fórmula, valor calculado ou unidade relativa. Substituir pode mudar a adaptação em outras telas. Cancelar mantém a regra original; nenhum estilo foi gravado.');}
    if(!force){const conflicts=this.preflight(ops);if(conflicts.length){return this.ask('conflict',ops,`O CSS da página impediu ${conflicts.length} ajuste(s). Exemplo: ${conflicts[0].property} solicitado ${conflicts[0].requested}, aplicado ${conflicts[0].applied}. Forçar usa !important e pode prevalecer em outros tamanhos de tela. Nenhuma alteração aplicada.`)}}
    return this.write(ops.map(o=>({...o,force})),label);
  },
  async accept(force=false){const p=this.pending;if(!p||p.key!==this.stateKey()){this.clearPending();return{status:'stale'}};
    if(force&&!await Dialog.confirm('Forçar regra de espaçamento?','Aplica !important ao elemento em todas as telas. Não é uma edição restrita ao breakpoint atual. Media queries podem deixar de prevalecer.','Forçar regra'))return{status:'cancelled'};
    if(!this.pending||p!==this.pending||p.key!==this.stateKey())return{status:'stale'};this.clearPending();return this.submit(p.ops,{confirmed:true,force,label:force?'Forçar espaçamento':'Ajustar espaçamento'});
  },
  apply(prop,value,unit,options={}){const raw=String(value)==='auto'?'auto':BoxValue.format(Number(value),unit||'px');const ops=selection().flatMap(el=>this.targets(prop).map(p=>({el,prop:p,raw})));return this.submit(ops,options)},
  fromInput(input){const prop=input.dataset.boxProp,value=input.value,unit=$('#'+input.id+'-unit').value;
    if(value===''||!BoxValue.units.includes(unit))return this.error('Escolha uma unidade e digite um valor comum para substituir esta seleção.',input);
    const raw=BoxValue.format(Number(value),unit),valid=this.validate(prop==='gap'?'row-gap':prop,raw);if(!valid.ok)return this.error(valid.reason,input);
    delete input.dataset.boxInvalid;input.removeAttribute('aria-invalid');this.clearPending();return this.apply(prop,value,unit);
  },
  canStep(prop){const props=this.targets(prop),vals=selection().flatMap(el=>props.map(p=>({el,p,v:this.read(el,p)})));if(!vals.length||vals.some(o=>!this.allowed(o.el,o.p)))return false;
    return vals.every(o=>o.v.kind==='length')&&vals.every(o=>o.v.unit===vals[0].v.unit)&&vals.every(o=>o.v.source!=='computed');
  },
  step(input,direction,shift=false){const prop=input.dataset.boxProp;this.memo=null;if(!this.canStep(prop))return this.error('Defina primeiro um valor comum e uma unidade. AUTO, fórmulas e unidades diferentes não são incrementados automaticamente.');
    const ops=selection().flatMap(el=>this.targets(prop).map(p=>{const v=this.read(el,p),{min,max}=this.limits(p);return {el,prop:p,raw:BoxValue.format(clamp(v.value+direction*(shift?10:1),min,max),v.unit)}}));
    if(ops.every(o=>BoxValue.same(this.read(o.el,o.prop),BoxValue.parse(o.raw))))return {status:'unchanged'};
    const result=this.submit(ops,{confirmed:true,label:'Incrementar espaçamento'});this.sync(true);return result;
  },
  changeUnit(prop,newUnit){this.clearPending();if(newUnit==='auto'){this.clearPending();return this.apply(prop,'auto')}
    if(!BoxValue.units.includes(newUnit))return this.error('Escolha uma unidade válida.');
    const input=$('#ie-'+prop),draft=input.dataset.boxDraft==='1';if(draft&&input.value!==''){delete input.dataset.boxDraft;return this.fromInput(input)}
    this.memo=null;const ops=[];let warn=false;for(const el of selection())for(const p of this.targets(prop)){const v=this.read(el,p);if(v.kind==='length'&&v.unit===newUnit)continue;
      const valuePx=this.equivalentPx(el,p,v),basis=this.basis(el,p,newUnit);
      if(valuePx==null||!basis){return this.error('Não há equivalência segura neste contexto. Escolha a unidade e digite um valor explícito; a regra original não será alterada.');}
      const raw=BoxValue.format(valuePx/basis,newUnit),valid=this.validate(p,raw);if(!valid.ok)return this.error(valid.reason);
      ops.push({el,prop:p,raw});warn=warn||v.kind!=='length'||v.source==='computed'||(newUnit==='px'&&v.unit!=='px');}
    if(!ops.length){this.sync(true);return{status:'unchanged'}};
    if(warn)return this.ask('conversion',ops,'Converter usa a equivalência da tela atual. A regra AUTO, fórmula ou unidade relativa será substituída; em outras telas o comportamento pode mudar.');
    return this.submit(ops,{confirmed:true,label:'Converter unidade de espaçamento'});
  },
  async reset(family){H.uiEnd();H.commitContinuous();const es=selection(),relevant=p=>family==='gap'?['gap','row-gap','column-gap','grid-gap','grid-row-gap','grid-column-gap'].includes(p):p===family||p.startsWith(family+'-');
    const changes=[];for(const el of es){const base=BaselineManager.entries.get(H.ensureId(el));if(!base)continue;const b=document.createElement('div');b.setAttribute('style',base.attrs.find(([k])=>k==='style')?.[1]||'');
      const values=BoxSourceResolver.serialized(b.style).filter(([p])=>relevant(p));
      const current=BoxSourceResolver.serialized(el.style).filter(([p])=>relevant(p));
      const meta=U.json(el,'data-ie-box-model',{});if(JSON.stringify(values)!==JSON.stringify(current)||Object.keys(meta).some(relevant))changes.push({el,base,values,count:this.props(family).filter(p=>el.style.getPropertyValue(p)!==b.style.getPropertyValue(p)||el.style.getPropertyPriority(p)!==b.style.getPropertyPriority(p)).length});}
    if(!changes.length)return this.error('Nenhuma alteração deste grupo para restaurar nesta sessão.');
    const key=this.stateKey();if(changes.reduce((a,c)=>a+c.count,0)>1&&!await Dialog.confirm('Restaurar '+(family==='padding'?'espaço interno':family==='margin'?'espaço externo':'gap')+'?','Somente este grupo de espaçamento volta ao estado anterior à primeira edição da sessão. Texto, cores, imagens, posição e efeitos permanecem.','Restaurar'))return{status:'cancelled'};
    if(key!==this.stateKey())return{status:'stale'};this.clearPending();
    H.mutate('Restaurar espaçamento '+family,changes.map(c=>c.el),()=>{for(const {el,base,values} of changes){[...el.style].filter(relevant).forEach(p=>el.style.removeProperty(p));values.forEach(([p,v,pr])=>el.style.setProperty(p,v,pr));
      let baselineMeta={};try{baselineMeta=JSON.parse(base.attrs.find(([k])=>k==='data-ie-box-model')?.[1]||'{}')}catch(_){}const m=U.json(el,'data-ie-box-model',{});Object.keys(m).filter(relevant).forEach(p=>delete m[p]);Object.entries(baselineMeta).filter(([p])=>relevant(p)).forEach(([p,v])=>m[p]=v);if(Object.keys(m).length)el.setAttribute('data-ie-box-model',JSON.stringify(m));else el.removeAttribute('data-ie-box-model');
      const old=(base.attrs.find(([k])=>k==='data-ie-authored-style-props')?.[1]||'').split(',').filter(Boolean);const props=new Set((el.getAttribute('data-ie-authored-style-props')||'').split(',').filter(p=>p&&!relevant(p)));old.filter(relevant).forEach(p=>props.add(p));if(props.size)el.setAttribute('data-ie-authored-style-props',[...props].join(','));else el.removeAttribute('data-ie-authored-style-props');
    }});this.memo=null;this.sync(true);OverlayManager.update();return {status:'applied'};
  },
  sync(force=false){const key=this.stateKey();if(key!==this.key){this.key=key;this.clearPending();for(const f of ['padding','margin','gap'])$('#ie-link-'+f).checked=false;for(const input of this.fields.values()){delete input.dataset.boxDraft;delete input.dataset.boxInvalid;input.removeAttribute('aria-invalid')}$('#ie-box-feedback').hidden=true;}
    this.memo=new Map();const es=selection();$('#ie-box-gap').hidden=!es.length||!es.every(e=>this.allowed(e,'row-gap'));
    const messages=new Set();for(const el of es){const c=getComputedStyle(el);if(c.display==='inline'&&!['IMG','VIDEO','INPUT'].includes(el.tagName))messages.add('Texto em linha: margem vertical não reposiciona o texto. Use altura da linha ou selecione o container.');if(c.display==='table-cell'||['TD','TH'].includes(el.tagName))messages.add('Célula de tabela: use espaço interno ou a subaba Tabela. Margem não move células.');if(['absolute','fixed'].includes(c.position))messages.add('Margem não é X/Y: muda o espaço externo; para reposicionar use Movimento.');if(/^(inline-)?(flex|grid)$/.test(c.display)&&[...el.children].some(x=>['Top','Right','Bottom','Left'].some(s=>safeNum(getComputedStyle(x)['margin'+s])!==0)))messages.add('Os filhos também têm margens. Elas podem somar espaço ao gap; nada será removido.');if(c.display==='flex'&&c.flexDirection.startsWith('column'))messages.add('Flex em coluna: gap vertical separa os itens; horizontal separa as linhas/colunas formadas pelo wrap.');}
    $('#ie-box-context').textContent=[...messages].join(' ');$('#ie-box-context').hidden=!messages.size;$('#ie-box-table').hidden=!es.some(e=>['TD','TH'].includes(e.tagName));
    for(const [prop,input] of this.fields){const aggregate=this.values(prop),unit=$('#'+input.id+'-unit'),raw=$('#'+input.id+'-raw'),info=$('#'+input.id+'-source'),props=this.targets(prop);const allowed=es.length>0&&es.every(e=>props.every(p=>this.allowed(e,p)));const numeric=aggregate.kind==='length';
      input.disabled=!allowed;unit.disabled=!allowed;input.min=this.limits(prop).min;input.max=this.limits(prop).max;
      if(force||(!input.dataset.boxDraft&&!input.dataset.boxInvalid&&document.activeElement!==input)){
        input.value=numeric?aggregate.value:'';unit.value=aggregate.kind==='auto'?'auto':aggregate.kind==='expression'?'expression':aggregate.unit||'mixed';
        input.placeholder=aggregate.kind==='auto'?'AUTO':aggregate.kind==='expression'?'Fórmula':aggregate.kind==='mixed'?'— vários —':'0';delete input.dataset.boxDraft;
      }
      input.dataset.boxKind=aggregate.kind;input.dataset.mixed=aggregate.kind==='mixed'?'1':'0';
      const unitLabel=aggregate.kind==='mixed'?(aggregate.reason==='units'?'Unidades diferentes':aggregate.reason==='auto'?'AUTO + valores':aggregate.reason==='expression'?'Fórmulas / valores':'Valores diferentes'):aggregate.kind==='auto'?'Automático':aggregate.kind==='expression'?'Fórmula preservada':aggregate.source==='computed'?'Calculado':aggregate.source==='authored'?'Editado':aggregate.source==='inline'?'No HTML':'No CSS';
      info.textContent=unitLabel;info.dataset.help=aggregate.source==='computed'?'Valor calculado pelo navegador. A origem não foi identificada com segurança; substituir pede confirmação.':aggregate.kind==='mixed'?'Valores diferentes: as setas somam a cada elemento apenas se todos usarem a mesma unidade numérica. Digitar um número e uma unidade normaliza o conjunto.':aggregate.kind==='auto'?'AUTO mantém a decisão automática do navegador; nas margens laterais pode centralizar. Não é zero pixels.':'Origem: '+(aggregate.selector||aggregate.source)+'. Medida preservada; edição vale para todas as telas.';
      raw.hidden=aggregate.kind!=='expression';raw.textContent=aggregate.kind==='expression'?aggregate.raw:'';raw.dataset.help='Esta fórmula continua no CSS original. Para substituir, escolha uma unidade e um valor; você terá de confirmar.';
      for(const b of $$(`[data-step-for="${input.id}"]`,toolbar)){b.disabled=!allowed||!this.canStep(prop);b.setAttribute('aria-disabled',String(b.disabled));if(b.disabled)b.dataset.help='Incremento indisponível: AUTO, fórmula, unidades diferentes ou contexto sem suporte. Digite um valor e unidade para normalizar explicitamente.';else b.dataset.help='Ajustar '+this.label(prop)+' relativamente. Clique: 1; Shift: 10; segure para repetir. Em vários itens, preserva diferenças.';}
    }
    for(const f of ['padding','margin','gap']){$('#ie-box-'+f).dataset.linked=String($('#ie-link-'+f).checked);$('#ie-link-'+f).disabled=!es.length||(f==='margin'&&es.some(e=>this.props(f).some(p=>!this.allowed(e,p))));}
    this.memo=null;
  },
  install(){for(const input of $$('[data-box-prop]',toolbar)){this.fields.set(input.dataset.boxProp,input);input.addEventListener('input',()=>{input.dataset.boxDraft='1';delete input.dataset.boxInvalid;input.removeAttribute('aria-invalid')});input.addEventListener('change',()=>this.fromInput(input));const unit=$('#'+input.id+'-unit');unit.addEventListener('change',()=>this.changeUnit(input.dataset.boxProp,unit.value));input.addEventListener('keydown',e=>{if(e.key==='Escape'){delete input.dataset.boxDraft;delete input.dataset.boxInvalid;input.removeAttribute('aria-invalid');this.sync(true)}})}
    for(const f of ['padding','margin','gap']){$('#ie-link-'+f).onchange=()=>this.sync();$('#ie-box-reset-'+f).onclick=()=>this.reset(f)}
    $('#ie-box-cancel').onclick=()=>{this.clearPending();for(const input of this.fields.values()){delete input.dataset.boxDraft;delete input.dataset.boxInvalid;input.removeAttribute('aria-invalid')}this.sync(true)};$('#ie-box-accept').onclick=()=>this.accept();$('#ie-box-force').onclick=()=>this.accept(true);$('#ie-box-table').onclick=()=>SubTabController.setSub('layout','table');
    window.addEventListener('resize',()=>{if(EditorState.editMode)syncUI()});
  }
};
