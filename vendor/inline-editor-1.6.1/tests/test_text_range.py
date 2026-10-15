"""43 acceptance gates for direct text editing / partial formatting / Tab v1.5.3.
No network required. Includes real pointer/keyboard actions and real Blob download.
Set IE_LANDING_EDITABLE for landing gates 39–43. TEXT_GATES selects a subset.
"""
from pathlib import Path
from playwright.sync_api import sync_playwright
from bs4 import BeautifulSoup
import os,json,time,traceback,hashlib
ROOT=Path(__file__).resolve().parents[1];OUT=ROOT/'qa';OUT.mkdir(exist_ok=True)
HTML=(ROOT/'INLINE_EDITOR_TEMPLATE.html').read_text()
LANDING=Path(os.environ.get('IE_LANDING_EDITABLE', ROOT.parent/'rotina-empreendedora-selvagem-EDITAVEL-v1.5.3.html'))
GATES={int(x) for x in os.environ.get('TEXT_GATES',','.join(map(str,range(1,44)))).split(',')};RESULTS=[]
JS_SELECT="""([selector,start,end,back])=>{const el=document.querySelector(selector);const walk=document.createTreeWalker(el,NodeFilter.SHOW_TEXT),nodes=[];while(walk.nextNode())nodes.push(walk.currentNode);let count=0;function point(v){let at=0;for(let i=0;i<nodes.length;i++){const n=nodes[i];if(v<=at+n.length||i===nodes.length-1)return[n,Math.min(n.length,v-at)];at+=n.length}return[el,0]}
const [a,ao]=point(start),[b,bo]=point(end),r=document.createRange();r.setStart(a,ao);r.setEnd(b,bo);el.focus({preventScroll:true});const s=getSelection();s.removeAllRanges();s.addRange(r);if(back)s.setBaseAndExtent(b,bo,a,ao);document.dispatchEvent(new Event('selectionchange'));return s.toString()}"""
JS_CHARS="""([selector,prop])=>{const root=document.querySelector(selector),w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT),out=[];while(w.nextNode()){const n=w.currentNode,c=getComputedStyle(n.parentElement)[prop];for(const ch of n.data)out.push(c)}return out}"""
class Suite:
 def __init__(self,b):self.b=b;self.page=None;self.errors=[];self.mobileContext=None
 def new(self,html=HTML,mobile=False,w=1440,h=900):
  if self.page:self.page.close(run_before_unload=False)
  if self.mobileContext:self.mobileContext.close();self.mobileContext=None
  self.errors=[]
  if mobile:
   self.mobileContext=self.b.new_context(viewport={'width':w,'height':h},is_mobile=True,has_touch=True,device_scale_factor=2,accept_downloads=True)
   self.page=self.mobileContext.new_page()
  else:self.page=self.b.new_page(viewport={'width':w,'height':h},accept_downloads=True)
  self.page.set_default_timeout(3500);self.page.on('pageerror',lambda e:self.errors.append(str(e)));self.page.set_content(html,wait_until='load');self.page.wait_for_timeout(100)
  return self.page
 def ev(self,code,arg=None):return self.page.evaluate(code,arg)
 def open(self):
  self.page.locator('#ie-launcher').click()
  if self.page.viewport_size['width']>1000:self.ev("document.querySelector('#ie-toolbar').style.left='1050px';document.querySelector('#ie-toolbar').style.top='8px'")
 def sel(self,selector):self.ev('(s)=>InlineEditor.select(document.querySelector(s))',selector);self.page.wait_for_timeout(20)
 def scroll(self,selector):self.ev('(s)=>document.querySelector(s).scrollIntoView({block:"center",behavior:"instant"})',selector);self.page.wait_for_timeout(40)
 def tab(self,main='content',sub='text'):
  self.page.locator('#ie-tab-'+main).click();self.page.locator('#ie-subtab-'+sub).click();self.page.wait_for_timeout(15)
 def text(self,selector):return self.page.locator(selector).text_content()
 def range(self,selector,phrase=None,start=None,end=None,back=False):
  if start is None:
   text=self.text(selector);start=text.index(phrase);end=start+len(phrase)
  self.sel(selector);self.scroll(selector);self.ev(JS_SELECT,[selector,start,end,back]);self.page.wait_for_timeout(35)
  assert self.ev('InlineEditor.state.textRange.mode')==('caret' if start==end else 'range')
  return start,end
 def set(self,id,value,event='change'):
  self.ev('([id,v,event])=>{const el=document.getElementById(id);el.value=String(v);el.dispatchEvent(new Event(event,{bubbles:true}))}',[id,value,event]);self.page.wait_for_timeout(25)
 def css(self,selector,p):return self.ev('([s,p])=>getComputedStyle(document.querySelector(s))[p]',[selector,p])
 def chars(self,selector,p):return self.ev(JS_CHARS,[selector,p])
 def history(self):return self.ev('InlineEditor.diagnostics().history')
 def undo(self):self.ev('InlineEditor.undo()');self.page.wait_for_timeout(25)
 def redo(self):self.ev('InlineEditor.redo()');self.page.wait_for_timeout(25)
 def charpoint(self,selector,offset,end=False):
  return self.ev('''([s,o,end])=>{const el=document.querySelector(s),w=document.createTreeWalker(el,NodeFilter.SHOW_TEXT);let sum=0;while(w.nextNode()){const n=w.currentNode;if(o<sum+n.length){const r=document.createRange();r.setStart(n,o-sum);r.setEnd(n,o-sum+1);const b=r.getBoundingClientRect();return {x:end?b.right-.2:b.left+.2,y:b.top+b.height/2}}sum+=n.length}throw Error('offset')}''',[selector,offset,end])
 def assertPartial(self,selector,prop,before,start,end,value):
  after=self.chars(selector,prop);assert len(before)==len(after),(len(before),len(after))
  for i,(a,b) in enumerate(zip(before,after)):
   if start<=i<end:assert b==value,(i,b,value)
   else:assert a==b,('outside changed',i,a,b)
  return {'property':prop,'range':[start,end],'outside_unchanged':True,'value':value}
 def gate(self,n,title,fn):
  if n not in GATES:return
  self.new();t=time.monotonic()
  try:
   d=fn() or {};assert not self.errors,self.errors;row={'gate':n,'name':title,'status':'PASS','measurements':d}
  except Exception as e:
   row={'gate':n,'name':title,'status':'FAIL','error':str(e),'trace':traceback.format_exc(),'pageerrors':self.errors}
   try:self.page.screenshot(path=str(OUT/f'text-fail-{n}.png'))
   except:pass
  row['seconds']=round(time.monotonic()-t,3);RESULTS.append(row);print(row['status'],n,title,row.get('error','')[:280],flush=True)
  (OUT/'text-range-results.json').write_text(json.dumps(RESULTS,ensure_ascii=False,indent=2))
with sync_playwright() as pw:
 try:b=pw.chromium.launch(headless=True)
 except:b=pw.chromium.launch(headless=True,executable_path=os.environ.get('CHROMIUM_EXECUTABLE','/usr/bin/chromium'),args=['--no-sandbox'])
 s=Suite(b)
 def g1():
  assert s.ev('InlineEditor.version')==json.loads((ROOT/'VERSION.json').read_text())['version'];assert s.page.locator('#ie-toolbar').count()==1;return {'version':json.loads((ROOT/'VERSION.json').read_text())['version'],'pageerrors':0}
 s.gate(1,'Boot sem erros',g1)
 def g2():
  rs=json.loads((OUT/'template-results.json').read_text());assert len(rs)==25 and all(x['status']=='PASS' for x in rs);return {'template_regression':25}
 s.gate(2,'Regressão v1.5.2',g2)
 def g3():
  s.open();s.scroll('#tr-plain');s.page.locator('#tr-plain').click(position={'x':50,'y':12});assert s.ev("document.querySelector('#tr-plain').isContentEditable");assert s.ev('document.activeElement.id')=='tr-plain';return {'single_click':True}
 s.gate(3,'Primeiro clique ativa edição',g3)
 def g4():
  s.open();s.scroll('#tr-plain');p=s.charpoint('#tr-plain',11);s.page.mouse.click(p['x'],p['y']);s.page.wait_for_timeout(30)
  offset=s.ev('InlineEditor.state.textRange.start');assert offset==11,offset;s.page.keyboard.insert_text('X');assert s.text('#tr-plain')=='Uma rotina Xclara organiza seu negócio todos os dias.';return {'caret_offset':offset}
 s.gate(4,'Caret no ponto clicado',g4)
 def g5():
  s.open();s.scroll('#tr-plain');s.page.locator('#tr-plain').click(position={'x':3,'y':14});s.page.keyboard.insert_text('Teste ');assert 'Teste ' in s.text('#tr-plain');assert s.ev('InlineEditor.diagnostics().dirty');return {'typing_after_first_click':True}
 s.gate(5,'Digitar imediatamente',g5)
 def g6():
  assert s.page.locator('#ie-edit-text,#ie-cta-text').count()==0;s.open();s.sel('#tr-plain');s.tab();assert s.page.locator('#ie-select-all-text').is_visible();return {'edit_buttons_removed':2}
 s.gate(6,'Sem botão intermediário Editar texto',g6)
 def g7():
  s.open();s.scroll('#tr-plain');a=s.charpoint('#tr-plain',11);bpt=s.charpoint('#tr-plain',15,True);s.page.mouse.move(a['x'],a['y']);s.page.mouse.down();s.page.mouse.move(bpt['x'],bpt['y'],steps=12);s.page.mouse.up();s.page.wait_for_timeout(45)
  assert s.ev('getSelection().toString()')=='clara';assert s.ev('InlineEditor.state.textRange.mode')=='range';s.tab();s.page.locator('#ie-bold').click();assert s.page.locator('#tr-plain [data-ie-text-run]').text_content()=='clara';return {'native_drag':'clara','survives_toolbar':True}
 s.gate(7,'Range nativo preservado após drag e click',g7)
 def partial(prop,id,value,expected,button=False):
  s.open();q='#tr-plain';before=s.chars(q,prop);a,z=s.range(q,'clara');s.tab('content','text' if id in ['ie-bold','ie-italic','ie-underline','ie-text-color','ie-text-bg'] else 'typography')
  if button:s.page.locator('#'+id).click()
  else:s.set(id,value)
  assert s.page.locator('#tr-plain [data-ie-text-run]').count()==1
  return s.assertPartial(q,prop,before,a,z,expected)
 s.gate(8,'Negrito somente na palavra',lambda:partial('fontWeight','ie-bold',None,'700',True))
 s.gate(9,'Itálico somente no trecho',lambda:partial('fontStyle','ie-italic',None,'italic',True))
 s.gate(10,'Sublinhado parcial',lambda:partial('textDecorationLine','ie-underline',None,'underline',True))
 def g11():
  s.open();q='#tr-plain';before=s.chars(q,'color');a,z=s.range(q,'clara');s.tab();h=s.history();s.page.locator('#ie-text-color').focus()
  for color in ['#993344','#445599','#663399']:s.set('ie-text-color',color,'input')
  assert s.history()==h;assert s.page.locator('#tr-plain [data-ie-text-run]').count()==1;s.set('ie-text-color','#663399','change');assert s.history()==h+1
  d=s.assertPartial(q,'color',before,a,z,'rgb(102, 51, 153)');d['live_picker_one_history']=True;return d
 s.gate(11,'Cor parcial ao vivo / commit único',g11)
 s.gate(12,'Marca-texto parcial',lambda:partial('backgroundColor','ie-text-bg','#eedd99','rgb(238, 221, 153)'))
 s.gate(13,'Tamanho parcial',lambda:partial('fontSize','ie-font-size',29,'29px'))
 s.gate(14,'Fonte parcial',lambda:partial('fontFamily','ie-font-family','Georgia','Georgia'))
 s.gate(15,'Espaço entre letras parcial',lambda:partial('letterSpacing','ie-letter-spacing',2,'2px'))
 def g16():
  s.open();q='#tr-plain';before=s.chars(q,'lineHeight');a,z=s.range(q,'clara');font=float(s.css(q,'fontSize')[:-2]);s.tab('content','typography');s.set('ie-line-height',1.7);return s.assertPartial(q,'lineHeight',before,a,z,str(round(font*1.7,2)).rstrip('0').rstrip('.')+'px')
 s.gate(16,'Altura de linha parcial',g16)
 s.gate(17,'Maiúsculas parcial',lambda:partial('textTransform','ie-text-transform','uppercase','uppercase'))
 def g18():
  s.open();s.range('#tr-plain','clara');s.tab();s.page.locator('#ie-bold').click();s.set('ie-text-color','#664466');s.tab('content','typography');s.page.locator('#ie-font-size').fill('28');s.page.locator('#ie-font-size').press('Tab');s.page.wait_for_timeout(30)
  assert s.page.locator('#tr-plain [data-ie-text-run]').count()==1;assert s.page.locator('#tr-plain [data-ie-text-run] [data-ie-text-run]').count()==0;assert s.css('#tr-plain [data-ie-text-run]','fontSize')=='28px';return {'runs':1,'format_count':3}
 s.gate(18,'Operações sucessivas reutilizam o run',g18)
 def g19():
  s.open();s.range('#tr-plain','clara organiza');s.tab();s.page.locator('#ie-bold').click();s.range('#tr-plain','clara');s.tab();s.page.locator('#ie-bold').click()
  vals=s.chars('#tr-plain','fontWeight');assert all(v=='400' for v in vals[11:16]);assert all(v=='700' for v in vals[17:25]);return {'toggle_off_partial':True}
 s.gate(19,'Remover toggle não altera vizinhos',g19)
 def g20():
  s.open();s.range('#tr-plain','clara');s.tab();s.page.locator('#ie-bold').click();s.range('#tr-plain',' organiza');s.tab();s.page.locator('#ie-bold').click();assert s.page.locator('#tr-plain [data-ie-text-run]').count()==1;assert s.page.locator('#tr-plain [data-ie-text-run]').text_content()=='clara organiza';return {'adjacent_runs_merged':True}
 s.gate(20,'Unir runs adjacentes idênticos',g20)
 def g21():
  s.open();s.range('#tr-plain','clara');s.tab();s.page.locator('#ie-bold').click();s.tab('more','advanced');s.page.locator('#ie-clear-format').click();assert s.page.locator('#tr-plain [data-ie-text-run]').count()==0;assert s.text('#tr-plain')=='Uma rotina clara organiza seu negócio todos os dias.';return {'unstyled_run_unwrapped':True}
 s.gate(21,'Run sem estilo é desembrulhado',g21)
 def g22():
  s.open();q='#tr-cell-multi';s.range(q,start=3,end=35);s.tab();s.set('ie-text-color','#772299');assert s.page.locator('#tr-cell-multi [data-ie-text-run] p,#tr-cell-multi [data-ie-text-run] div').count()==0;assert s.page.locator('#tr-cell-multi p').count()==1;assert s.page.locator('#tr-cell-multi div').count()==1;return {'block_inside_span':0}
 s.gate(22,'Sem blocos estruturais dentro de span',g22)
 def g23():
  s.open();s.ev("window.keepStrong=document.querySelector('#tr-strong-node')");before=s.text('#tr-strong');s.range('#tr-strong','importante');s.tab();s.set('ie-text-color','#883344');assert s.ev("window.keepStrong===document.querySelector('#tr-strong-node')");assert s.css('#tr-strong-node [data-ie-text-run]','fontWeight')=='700';assert s.text('#tr-strong')==before;return {'original_strong_node_preserved':True}
 s.gate(23,'Preservar strong',g23)
 def g24():
  s.open();s.ev("window.keepAnchor=document.querySelector('#tr-inline-link')");s.range('#tr-markup','útil');s.tab();s.set('ie-text-color','#883344');assert s.page.locator('#tr-inline-link').get_attribute('href')=='#tr-next';assert s.ev("window.keepAnchor===document.querySelector('#tr-inline-link')");return {'href':'#tr-next','node_preserved':True}
 s.gate(24,'Preservar link e href',g24)
 def g25():
  s.open();q='#tr-markup';original=s.text(q);before=s.chars(q,'color');a,z=s.range(q,start=8,end=len(original)-3);s.tab();s.set('ie-text-color','#662266');assert s.text(q)==original;assert s.page.locator('#tr-markup strong,#tr-markup em,#tr-markup a,#tr-markup .tr-original,#tr-markup small,#tr-markup sub,#tr-markup sup,#tr-markup br').count()==8
  return s.assertPartial(q,'color',before,a,z,'rgb(102, 34, 102)')
 s.gate(25,'Range atravessando markup inline',g25)
 def g26():
  s.open();s.scroll('#tr-first');s.page.locator('#tr-first').click();h=s.history();s.page.keyboard.press('Tab');assert s.ev('InlineEditor.state.selected.id')=='tr-next';assert s.ev('InlineEditor.state.textRange.start')==0;assert s.history()==h;return {'next':'tr-next','history_added':0}
 s.gate(26,'Tab próximo root',g26)
 def g27():
  s.open();s.scroll('#tr-next');s.page.locator('#tr-next').click();s.page.keyboard.press('Shift+Tab');assert s.ev('InlineEditor.state.selected.id')=='tr-first';assert s.ev('InlineEditor.state.textRange.start')==len(s.text('#tr-first'));return {'previous':'tr-first','caret':'end'}
 s.gate(27,'Shift+Tab anterior',g27)
 def g28():
  s.open();s.range('#tr-first','texto');s.tab();s.page.locator('#ie-bold').click();s.ev("document.querySelector('#tr-first').focus()");s.page.keyboard.press('Tab');assert s.ev('InlineEditor.state.selected.id')=='tr-next';roots=s.ev('InlineEditor.controllers.TextNavigationController.roots().map(e=>e.id)');assert 'tr-hidden' not in roots;return {'no_internal_run_navigation':True,'hidden_skipped':True}
 s.gate(28,'Tab não visita runs ou ocultos',g28)
 def g29():
  s.open();s.sel('#tr-first');s.tab('content','typography');s.page.locator('#ie-font-size').focus();s.page.keyboard.press('Tab');assert s.ev('InlineEditor.state.selected.id')=='tr-first';assert s.ev("!!document.activeElement.closest('#ie-toolbar')");return {'toolbar_native_tab':True}
 s.gate(29,'Tab da toolbox permanece nativo',g29)
 def g30():
  s.open();s.page.emulate_media(reduced_motion='reduce');s.scroll('#tr-last-near');s.page.locator('#tr-last-near').click();before=s.ev('scrollY');s.page.keyboard.press('Tab');assert s.ev('InlineEditor.state.selected.id')=='tr-far';assert s.ev('scrollY')>before+500;return {'scrolled_px':s.ev('scrollY')-before}
 s.gate(30,'Tab rola até próximo texto',g30)
 def g31():
  s.open();s.scroll('#tr-action');s.page.locator('#tr-action').click(position={'x':70,'y':20});assert s.ev('trActionCount')==0;assert s.ev('document.activeElement.id')=='tr-action';s.page.keyboard.insert_text('X');assert 'X' in s.text('#tr-action');s.page.keyboard.press('Enter');assert s.ev('trActionCount')==0;assert s.page.locator('#tr-action br').count()>=1;return {'action_count':0,'editable':True,'enter_no_action':True}
 s.gate(31,'CTA editável sem executar',g31)
 def g32():
  s.open();q='#tr-td';before=s.chars(q,'fontSize');a,z=s.range(q,'ação');s.tab('content','typography');s.set('ie-font-size',26);d=s.assertPartial(q,'fontSize',before,a,z,'26px');assert s.page.locator('span td,span th,span tr').count()==0;return d
 s.gate(32,'Texto parcial em TD/TH',g32)
 def g33():
  s.open();s.range('#tr-plain','clara');s.tab();h=s.history();s.page.locator('#ie-bold').click();assert s.history()==h+1;return {'history_added':1}
 s.gate(33,'Uma formatação = um undo',g33)
 def g34():
  s.open();original=s.page.locator('#tr-plain').inner_html();s.range('#tr-plain','clara');s.tab();s.page.locator('#ie-bold').click();after=s.page.locator('#tr-plain').inner_html();s.undo();assert s.page.locator('#tr-plain').inner_html()==original;s.redo();assert s.page.locator('#tr-plain').inner_html()==after;assert s.ev('InlineEditor.state.selected.id')=='tr-plain';return {'deep_undo_redo':True}
 s.gate(34,'Undo/redo restaura trecho',g34)
 def g35():
  s.open();s.scroll('#tr-first');s.page.locator('#tr-first').click();s.page.keyboard.insert_text('ZZ');s.page.keyboard.press('Tab');assert s.ev('InlineEditor.state.selected.id')=='tr-next';assert s.ev('InlineEditor.controllers.HistoryManager.continuous===null');assert s.history()==1;s.undo();assert 'ZZ' not in s.text('#tr-first');return {'typing_committed_on_tab':True}
 s.gate(35,'Tab commita digitação',g35)
 def makeSaved():
  s.open();s.range('#tr-plain','clara');s.tab();s.page.locator('#ie-bold').click();s.set('ie-text-color','#664488');s.tab('content','typography');s.set('ie-font-size',28)
  with s.page.expect_download() as info:s.page.locator('#ie-save').click()
  dest=OUT/'text-saved-reopen.html';info.value.save_as(str(dest));assert not s.ev('InlineEditor.diagnostics().dirty');return dest.read_text()
 def g36():
  html=makeSaved();s.new(html);assert s.css('#tr-plain [data-ie-text-run]','color')=='rgb(102, 68, 136)';assert s.css('#tr-plain [data-ie-text-run]','fontSize')=='28px';assert s.css('#tr-plain [data-ie-text-run]','fontWeight')=='700';return {'download_reopen':True,'bytes':len(html.encode())}
 s.gate(36,'Download e reabertura preservam trechos',g36)
 def g37():
  html=makeSaved();sp=BeautifulSoup(html,'html.parser');assert not sp.select('[contenteditable],[data-ie-selected],[data-ie-multi]');assert len(sp.select('#tr-plain [data-ie-text-run]'))==1
  clean=s.ev('InlineEditor.serialize({clean:true})');sp=BeautifulSoup(clean,'html.parser');assert not sp.select('[data-ie-text-run],#ie-toolbar');assert 'font-weight' in str(sp.select_one('#tr-plain'));s.new(clean);assert s.css('#tr-plain span','fontWeight')=='700';return {'no_transient_attributes':True,'clean_preserves_style_without_marker':True}
 s.gate(37,'Serializer e Clean Build',g37)
 def g38():
  html=makeSaved();s.new(html);s.open();s.scroll('#tr-plain');s.page.locator('#tr-plain [data-ie-text-run]').click();assert s.ev('InlineEditor.state.selected.id')=='tr-plain';s.page.keyboard.insert_text('X');assert 'X' in s.text('#tr-plain');return {'reopened_run_editable':True}
 s.gate(38,'Reeditar run salvo',g38)
 def landing():
  assert LANDING.exists(),'Landing integrada não encontrada';s.new(LANDING.read_text());s.open();s.page.wait_for_timeout(800)
 def g39():
  landing();q='.hero h1';text=s.text(q);phrase='seu servir';before=s.chars(q,'color');a,z=s.range(q,phrase);s.tab();s.set('ie-text-color','#553377');assert s.page.locator('.hero h1 em').count()==1;return s.assertPartial(q,'color',before,a,z,'rgb(85, 51, 119)')
 s.gate(39,'Headline real parcial',g39)
 def g40():
  landing();q='.day-card p';s.scroll(q);s.page.wait_for_timeout(850);s.page.locator(q).first.click(position={'x':30,'y':10});assert s.ev('InlineEditor.state.selected.isContentEditable');s.page.keyboard.insert_text('Teste ');assert 'Teste ' in s.page.locator(q).first.text_content();return {'real_card_first_click':True}
 s.gate(40,'Texto de card real no primeiro clique',g40)
 def g41():
  landing();q='.hero .button';s.scroll(q);s.page.locator(q).click();s.page.wait_for_timeout(80);clickedY=s.ev('scrollY');s.range(q,'organizar');y=s.ev('scrollY');s.tab();s.set('ie-text-color','#664488');s.page.wait_for_timeout(120);assert abs(s.ev('scrollY')-y)<2;assert s.page.locator(q+' .arrow').count()==1;return {'cta_range_preserved':True,'no_navigation':True,'arrow_preserved':True,'formatting_scroll_delta':s.ev('scrollY')-y,'helper_hover_recenter_px':y-clickedY}
 s.gate(41,'CTA real parcial sem navegar',g41)
 def g42():
  landing();q='.day-card h3';s.scroll(q);s.page.wait_for_timeout(850);s.page.locator(q).first.click();targets=[]
  for _ in range(6):
   s.page.keyboard.press('Tab');s.page.wait_for_timeout(60);targets.append(s.ev('InlineEditor.state.selected.tagName'));assert not s.ev("!!document.activeElement.closest('[data-ie-runtime]')")
  return {'navigated_roots':targets}
 s.gate(42,'Tab em textos reais',g42)
 def g43():
  assert LANDING.exists();s.new(LANDING.read_text(),mobile=True,w=390,h=844);s.open();s.ev("document.querySelector('#ie-toolbar').classList.add('ie-minimized')");q='.hero h1';s.scroll(q);s.page.wait_for_timeout(400);s.page.locator(q).tap(position={'x':35,'y':20});assert s.ev('InlineEditor.state.selected.isContentEditable');s.page.keyboard.insert_text('X');assert 'X' in s.text(q)
  # Native mobile caret + programmatic native Range, controls exercised at phone width.
  s.range(q,'servir');s.ev("document.querySelector('#ie-toolbar').classList.remove('ie-minimized')");s.tab();s.set('ie-text-color','#554477');assert s.page.locator(q+' [data-ie-text-run]').count()>=1
  r=s.page.locator('#ie-toolbar').bounding_box();assert r['x']>=0 and r['x']+r['width']<=390.5;s.page.screenshot(path=str(OUT/'text-landing-mobile.png'));return {'mobile':[390,844],'native_tap_caret':True,'range':True}
 s.gate(43,'Mobile: toque, edição e trecho',g43)
 if s.page:s.page.close(run_before_unload=False)
 if s.mobileContext:s.mobileContext.close()
 b.close()
print('SUMMARY',sum(x['status']=='PASS' for x in RESULTS),'/',len(RESULTS),flush=True)
if any(x['status']!='PASS' for x in RESULTS):raise SystemExit(1)
