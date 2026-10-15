const ShadowComposer={
  compose(e,v){const parts=[];if(v.innerWidth>0)parts.push(`inset 0 0 0 ${v.innerWidth}px ${v.innerColor||'#b49abe'}`);if(v.shadowEnabled)parts.push(`${v.shadowX||0}px ${v.shadowY||0}px ${v.shadowBlur||0}px ${v.shadowSpread||0}px ${U.rgba(v.shadowColor||'#342b36',(v.shadowAlpha??20)/100)}`);
    if(v.baseShadow&&v.baseShadow!=='none')parts.push(v.baseShadow);S.set(e,'boxShadow',parts.length?parts.join(', '):(v.baseShadow||'none'),{strong:true});}
};
const FilterComposer={
  compose(e,v){const parts=[];if(v.baseFilter&&v.baseFilter!=='none')parts.push(v.baseFilter);
    for(const [k,name,base,unit] of [['brightness','brightness',100,'%'],['contrast','contrast',100,'%'],['saturate','saturate',100,'%'],['grayscale','grayscale',0,'%'],['blur','blur',0,'px']])if(v[k]!=null&&v[k]!==base)parts.push(`${name}(${v[k]}${unit})`);
    if(v.dropEnabled)parts.push(`drop-shadow(${v.dropX||0}px ${v.dropY||0}px ${v.dropBlur||0}px ${U.rgba(v.dropColor||'#342b36',(v.dropAlpha??25)/100)})`);
    S.set(e,'filter',parts.length?parts.join(' '):(v.baseFilter||'none'),{strong:true});}
};
const VisualEngine={
  meta(e){return U.json(e,'data-ie-visual',{})},
  patch(values,label='Aparência'){const els=selection();withHistory(label,els,()=>els.forEach(e=>{
    const v=this.meta(e),cs=getComputedStyle(e);
    if(Object.keys(values).some(k=>k.startsWith('shadow')||k.startsWith('inner'))&&v.baseShadow==null)v.baseShadow=window.IEAuthored?.underlyingStyle(e,'boxShadow')||cs.boxShadow;
    if(Object.keys(values).some(k=>['brightness','contrast','saturate','grayscale','blur'].includes(k)||k.startsWith('drop'))&&v.baseFilter==null)v.baseFilter=window.IEAuthored?.underlyingStyle(e,'filter')||cs.filter;
    Object.assign(v,values);e.setAttribute('data-ie-visual',JSON.stringify(v));if(v.baseShadow!=null)ShadowComposer.compose(e,v);if(v.baseFilter!=null)FilterComposer.compose(e,v);
  }))},
  property(p,v,label){withHistory(label||'Aparência',selection(),()=>selection().forEach(e=>{if(p==='backgroundImage')this.writeBackgroundImage(e,v);else S.set(e,p,v,{strong:true});if(['opacity','filter','boxShadow','clipPath'].includes(p))e.setAttribute('data-ie-fx-style-revision',String(Number(e.getAttribute('data-ie-fx-style-revision')||0)+1))}))},
  setBackground(){const mode=$('#ie-bg-mode').value,c1=$('#ie-bg-color').value,c2=$('#ie-gradient-color2').value,angle=Number($('#ie-gradient-angle').value)||0,alpha=(Number($('#ie-bg-alpha').value)||0)/100;
    withHistory('Fundo',selection(),()=>selection().forEach(e=>{if(mode==='solid'){S.set(e,'backgroundColor',U.rgba(c1,alpha),{strong:true})}else if(mode==='gradient'){this.writeBackgroundImage(e,`linear-gradient(${angle}deg,${U.rgba(c1,alpha)},${U.rgba(c2,alpha)})`)}else S.set(e,'backgroundColor','transparent',{strong:true});e.setAttribute('data-ie-bg-config',JSON.stringify({mode,c1,c2,angle,alpha}))}))},
  writeBackgroundImage(e,image){const v=this.meta(e);v.baseBgImage=image;if(image==='none')v.overlay=0;e.setAttribute('data-ie-visual',JSON.stringify(v));const a=v.overlay||0,col=v.overlayColor||'#342b36';S.set(e,'backgroundImage',a?`linear-gradient(${U.rgba(col,a)},${U.rgba(col,a)}), ${image}`:image,{strong:true})},
  overlay(value){const a=clamp(Number(value),0,100)/100,col=$('#ie-bg-overlay-color').value;withHistory('Véu da imagem de fundo',selection(),()=>selection().forEach(e=>{const v=this.meta(e);if(v.baseBgImage==null)v.baseBgImage=getComputedStyle(e).backgroundImage;v.overlay=a;v.overlayColor=col;e.setAttribute('data-ie-visual',JSON.stringify(v));S.set(e,'backgroundImage',a?`linear-gradient(${U.rgba(col,a)},${U.rgba(col,a)}), ${v.baseBgImage}`:v.baseBgImage,{strong:true})}))},
  shadowPreset(name){const presets={none:{shadowEnabled:false},soft:{shadowEnabled:true,shadowX:0,shadowY:8,shadowBlur:20,shadowSpread:0,shadowColor:'#342b36',shadowAlpha:14},raised:{shadowEnabled:true,shadowX:0,shadowY:18,shadowBlur:36,shadowSpread:0,shadowColor:'#342b36',shadowAlpha:22},deep:{shadowEnabled:true,shadowX:0,shadowY:25,shadowBlur:55,shadowSpread:2,shadowColor:'#342b36',shadowAlpha:32},glow:{shadowEnabled:true,shadowX:0,shadowY:0,shadowBlur:28,shadowSpread:3,shadowColor:U.rgbToHex(getComputedStyle(toolbar).getPropertyValue('--ie-accent'))==='#000000'?'#b49abe':U.rgbToHex(getComputedStyle(toolbar).getPropertyValue('--ie-accent')),shadowAlpha:40}};this.patch(presets[name]||presets.none,'Preset de sombra')},
  resetFilters(){this.patch({brightness:100,contrast:100,saturate:100,grayscale:0,blur:0,dropEnabled:false},'Restaurar filtros do editor')},
  async replaceImage(file,background=false){if(!file)return;if(file.size>15*1024*1024){notify('Use uma imagem com até 15 MB.');return}if(!/^image\/(png|jpeg|webp|gif|avif)$/.test(file.type)){notify('Use PNG, JPEG, WebP, GIF ou AVIF. SVGs existentes são preservados como elementos vetoriais.');return}
    if(selection().length!==1){notify('Selecione uma única imagem ou bloco.');return}const el=selected(),id=H.ensureId(el);
    try{const uri=await U.fileToDataURL(file);if(!H.find(id))return;withHistory(background?'Imagem de fundo':'Trocar imagem',[el],()=>{if(background)this.writeBackgroundImage(el,`url("${uri}")`);else if(el.tagName==='IMG'){el.setAttribute('src',uri);el.removeAttribute('srcset');el.removeAttribute('sizes')}})}catch(e){notify(e.message)}
  }
};
const Decorations={
  side:'after',
  meta(e){return U.json(e,'data-ie-decor',{})},
  value(e=selected()){if(!e)return{};const m=this.meta(e);if(m[this.side])return m[this.side];const c=getComputedStyle(e,'::'+this.side);const content=['none','normal','""'].includes(c.content)?'':c.content.replace(/^['"]|['"]$/g,'');return{content,color:U.rgbToHex(c.color),backgroundColor:U.rgbToHex(c.backgroundColor),fontSize:safeNum(c.fontSize,14),paddingX:safeNum(c.paddingLeft),paddingY:safeNum(c.paddingTop),radius:safeNum(c.borderRadius),letterSpacing:safeNum(c.letterSpacing),x:0,y:0}},
  apply(){if(selection().length!==1){notify('Selecione um único selo ou container.');return}const e=selected(),v={content:$('#ie-decor-text').value,color:$('#ie-decor-color').value,backgroundColor:$('#ie-decor-bg').value,fontSize:Number($('#ie-decor-size').value)||14,paddingX:Number($('#ie-decor-px').value)||0,paddingY:Number($('#ie-decor-py').value)||0,radius:Number($('#ie-decor-radius').value)||0,letterSpacing:Number($('#ie-decor-spacing').value)||0,x:Number($('#ie-decor-x').value)||0,y:Number($('#ie-decor-y').value)||0};
    withHistory('Editar selo',[e],()=>{const m=this.meta(e);m[this.side]=v;if(!e.dataset.ieDecorKey)e.dataset.ieDecorKey='iedec-'+Math.random().toString(36).slice(2,10);e.setAttribute('data-ie-decor',JSON.stringify(m))})},
  clear(){const e=selected();if(!e)return;withHistory('Remover ajuste do selo',[e],()=>{const m=this.meta(e);delete m[this.side];e.setAttribute('data-ie-decor',JSON.stringify(m))})}
};
const EFFECT_CATALOG={
  hover:[['lift','Elevar'],['scale','Ampliar'],['shadow','Sombra suave'],['glow','Brilho suave'],['brighten','Iluminar'],['dim','Escurecer'],['shift','Deslocar à direita'],['border','Borda de destaque'],['tilt-left','Inclinar à esquerda'],['tilt-right','Inclinar à direita'],['zoom-glow','Zoom + brilho'],['desaturate-color','Cinza → cor'],['color-desaturate','Cor → cinza'],['blur-clear','Desfocado → nítido'],['shadow-side','Sombra lateral'],['depth','Profundidade 3D']],
  enter:[['fade','Aparecer'],['up','Subir'],['down','Descer'],['left','Vir da esquerda'],['right','Vir da direita'],['scale','Ampliar suavemente'],['blur','Revelar com nitidez'],['rotate','Girar suavemente'],['zoom-up','Zoom + subir'],['clip-x','Revelar horizontal'],['clip-y','Revelar vertical'],['drop','Cair suavemente'],['pop','Saltar suavemente'],['diagonal','Entrada diagonal']],
  loop:[['float','Flutuar'],['breathe','Respirar'],['opacity','Pulso de opacidade'],['glow','Brilho pulsante'],['rotate','Giro lento'],['sway','Balançar'],['drift','Deslizar horizontal'],['bob','Oscilar vertical'],['brightness','Luz oscilante'],['border-pulse','Contorno pulsante'],['shimmer','Cintilar'],['pendulum','Inclinar em pêndulo'],['bounce','Micro salto']],
  interaction:[['press','Pressionar'],['tap','Reduzir ao tocar'],['sink','Afundar'],['flash','Flash suave'],['pulse','Pulso único']]
};
const EffectsEngine={
  meta(e){return U.json(e,'data-ie-effects',{})},
  configure(kind,config){if(!EFFECT_CATALOG[kind])return;const els=selection();withHistory('Efeito '+kind+' em '+els.length+' elemento(s)',els,()=>els.forEach(e=>{const m=this.meta(e);m[kind]={id:config.id||'',intensity:clamp(Number(config.intensity)||0,0,100),duration:clamp(Number(config.duration)||1,.05,120),delay:clamp(Number(config.delay)||0,0,30)};
        if(!m[kind].id)delete m[kind];e.setAttribute('data-ie-effects',JSON.stringify(m));S.set(e,'--ie-'+kind+'-intensity',String(config.intensity||0));}));},
  readControls(kind){return{id:$('#ie-fx-'+kind).value,intensity:Number($('#ie-fx-'+kind+'-intensity').value),duration:Number($('#ie-fx-'+kind+'-duration').value),delay:kind==='enter'?Number($('#ie-fx-enter-delay').value):0}},
  apply(kind){this.configure(kind,this.readControls(kind))},
  reset(kind){this.configure(kind,{id:'',intensity:50,duration:kind==='loop'?5:.6,delay:0})},
  preview(kind){selection().forEach(e=>window.IEAuthored?.preview(e,kind));notify('Prévia do efeito.');}
};
const AuthoredManager={refresh(){window.IEAuthored?.refresh()}};
