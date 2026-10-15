"""36 behavior gates for Spacing v1.5.2. Isolated tests; no network required.
IE_LANDING_EDITABLE points at the integrated self-contained landing for gates 35/36.
Only tests use Python/Playwright; the editor remains plain inline JS/CSS.
"""
from pathlib import Path
import os,json,traceback,time,math
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1];OUT=ROOT/'qa';OUT.mkdir(exist_ok=True)
HTML=(ROOT/'INLINE_EDITOR_TEMPLATE.html').read_text(encoding='utf-8')
LANDING=Path(os.environ.get('IE_LANDING_EDITABLE',str(ROOT.parent/'rotina-empreendedora-selvagem-EDITAVEL-v1.5.3.html')))
GATES={int(x) for x in os.environ.get('BOX_GATES',','.join(map(str,range(1,37)))).split(',')}
results=[]
class Suite:
 def __init__(self,b):self.b=b;self.page=None;self.errors=[]
 def fresh(self,html=HTML,w=1440,h=900):
  if self.page:self.page.close(run_before_unload=False)
  self.errors=[];self.page=self.b.new_page(viewport={'width':w,'height':h},accept_downloads=True)
  self.page.set_default_timeout(3000);self.page.on('pageerror',lambda e:self.errors.append(str(e)))
  self.page.set_content(html,wait_until='load');self.page.wait_for_timeout(90)
  return self.page
 def ev(self,code,args=None):return self.page.evaluate(code,args)
 def open(self):self.page.locator('#ie-launcher').click();self.ev("document.querySelector('#ie-toolbar').style.left='1050px';document.querySelector('#ie-toolbar').style.top='8px'")
 def sel(self,s):self.ev('(s)=>InlineEditor.select(document.querySelector(s))',s);self.page.wait_for_timeout(30);self.tabs()
 def many(self,ss):self.ev('(ss)=>InlineEditor.selectMany(ss.map(s=>document.querySelector(s)))',ss);self.page.wait_for_timeout(30);self.tabs()
 def tabs(self):self.ev('InlineEditor.controllers.SubTabController.setMain("layout");InlineEditor.controllers.SubTabController.setSub("layout","spacing")');self.page.wait_for_timeout(20)
 def read(self,sel,prop):return self.ev('([s,p])=>InlineEditor.controllers.BoxModelController.read(document.querySelector(s),p)',[sel,prop])
 def raw(self,sel,prop):return self.ev('([s,p])=>document.querySelector(s).style.getPropertyValue(p)',[sel,prop])
 def css(self,sel,prop):return self.ev('([s,p])=>getComputedStyle(document.querySelector(s)).getPropertyValue(p)',[sel,prop])
 def hist(self):return self.ev('InlineEditor.diagnostics().history')
 def apply(self,p,n,u='px',**opts):return self.ev('([p,n,u,o])=>InlineEditor.controllers.BoxModelController.apply(p,n,u,o)',[p,n,u,opts])
 def input(self,prop,val):
  loc=self.page.locator('#ie-'+prop);loc.fill(str(val));loc.press('Tab');self.page.wait_for_timeout(40)
 def unit(self,prop,unit):self.page.locator('#ie-'+prop+'-unit').select_option(unit);self.page.wait_for_timeout(40)
 def fields(self,prop):return self.page.locator('#ie-'+prop).input_value()
 def undo(self):self.ev('InlineEditor.undo()');self.page.wait_for_timeout(30)
 def redo(self):self.ev('InlineEditor.redo()');self.page.wait_for_timeout(30)
 def serialize(self,clean=False):return self.ev('(clean)=>InlineEditor.serialize({clean})',clean)
 def reopen(self,html,w=1440):self.fresh(html,w=w);self.open()
 def dialog_confirm(self):self.page.locator('#ie-dialog-confirm').click();self.page.wait_for_timeout(45)
 def rect(self,sel):return self.page.locator(sel).bounding_box()
 def scroll(self,sel):self.ev('(s)=>document.querySelector(s).scrollIntoView({block:"center",behavior:"instant"})',sel);self.page.wait_for_timeout(50)
 def drag(self,handle,dx,dy):
  r=self.rect(handle);assert r,handle+' hidden';x=r['x']+r['width']/2;y=r['y']+r['height']/2
  self.page.mouse.move(x,y);self.page.mouse.down();self.page.keyboard.down('Alt');self.page.mouse.move(x+dx,y+dy,steps=10);self.page.wait_for_timeout(40)
  live=self.ev('InlineEditor.state.selectionSet.map(e=>{const r=e.getBoundingClientRect();return{x:r.x,y:r.y,w:r.width,h:r.height}})')
  self.page.mouse.up();self.page.keyboard.up('Alt');self.page.wait_for_timeout(120)
  final=self.ev('InlineEditor.state.selectionSet.map(e=>{const r=e.getBoundingClientRect();return{x:r.x,y:r.y,w:r.width,h:r.height}})')
  return live,final
 def gate(self,n,title,fn):
  if n not in GATES:return
  self.fresh();start=time.monotonic()
  try:
   out=fn() or {};assert not self.errors,self.errors
   result={'gate':n,'name':title,'status':'PASS','measurements':out}
  except Exception as e:
   result={'gate':n,'name':title,'status':'FAIL','error':repr(e),'trace':traceback.format_exc(),'pageerrors':self.errors}
   try:self.page.screenshot(path=str(OUT/f'box-fail-{n}.png'))
   except:pass
  result['seconds']=round(time.monotonic()-start,3);results.append(result);print(result['status'],n,title,result.get('error',''),flush=True)
  (OUT/'box-model-results.json').write_text(json.dumps(results,ensure_ascii=False,indent=2),encoding='utf-8')
with sync_playwright() as pw:
 try:browser=pw.chromium.launch(headless=True)
 except:browser=pw.chromium.launch(executable_path=os.environ.get('CHROMIUM_EXECUTABLE','/usr/bin/chromium'),headless=True,args=['--no-sandbox'])
 s=Suite(browser)
 def g1():
  assert s.ev('InlineEditor.version')==json.loads((ROOT/'VERSION.json').read_text())['version'];s.open();s.sel('#bm-px');assert s.page.locator('#ie-pane-spacing').is_visible();assert s.page.locator('#ie-toolbar [title]').count()==0
  assert not s.ev('InlineEditor.diagnostics().dirty');return {'version':s.ev('InlineEditor.version'),'numberFields':s.page.locator('[data-box-prop]').count(),'nativeTitles':0}
 s.gate(1,'Boot e Espaçamento',g1)
 def g2():
  s.open();s.sel('#bm-px')
  for side,n in zip(['top','right','bottom','left'],[25,27,29,31]):s.input('padding-'+side,n);assert s.raw('#bm-px','padding-'+side)==str(n)+'px'
  s.page.locator('#ie-subtab-size').click();s.tabs();assert s.fields('padding-top')=='25';assert s.hist()==4
  return {'four_independent':True,'blur_retains':True,'history':4}
 s.gate(2,'Padding individual via campos',g2)
 def g3():
  s.open();s.sel('#bm-px');before=[s.css('#bm-px','padding-'+x) for x in ['top','right','bottom','left']]
  s.page.locator('#ie-link-padding').check();s.input('padding-top',24);assert s.hist()==1;assert all(s.raw('#bm-px','padding-'+x)=='24px' for x in ['top','right','bottom','left'])
  s.undo();assert [s.css('#bm-px','padding-'+x) for x in ['top','right','bottom','left']]==before;s.redo();assert s.raw('#bm-px','padding-bottom')=='24px';return {'atomic':True}
 s.gate(3,'Padding vinculado e histórico atômico',g3)
 def g4():
  s.open();s.sel('#bm-px')
  for side,n in zip(['top','right','bottom','left'],[-8,12,-6,10]):s.input('margin-'+side,n);assert s.raw('#bm-px','margin-'+side)==str(n)+'px'
  return {'negativeMargins':True,'independentSides':True}
 s.gate(4,'Margin individual e negativos',g4)
 def g5():
  s.open();s.sel('#bm-px');s.page.locator('#ie-link-margin').check();s.input('margin-left',18);assert s.hist()==1;assert s.raw('#bm-px','margin-top')=='18px';s.undo();assert s.css('#bm-px','margin-top')=='5px';return {'atomic':True}
 s.gate(5,'Margin vinculado',g5)
 def g6():
  s.open();s.sel('#bm-auto');assert s.read('#bm-auto','margin-left')['kind']=='auto';assert s.page.locator('#ie-margin-left-unit').input_value()=='auto';assert s.page.locator('#ie-margin-left').get_attribute('placeholder')=='AUTO';assert s.raw('#bm-auto','margin-left')==''
  s.unit('margin-top','auto');assert s.raw('#bm-auto','margin-top')=='auto';html=s.serialize();s.reopen(html);s.sel('#bm-auto');assert s.read('#bm-auto','margin-left')['kind']=='auto';assert s.raw('#bm-auto','margin-top')=='auto';return {'leftRightOriginalAuto':True,'authoredAutoReopens':True}
 s.gate(6,'AUTO detectado, exibido e reaberto',g6)
 def g7():
  s.open();s.sel('#bm-auto');orig=s.rect('#bm-auto');s.input('padding-top',18);html=s.serialize();s.reopen(html);r=s.rect('#bm-auto');assert abs(r['x']-orig['x'])<.1;assert s.raw('#bm-auto','margin-left')==''
  s.page.set_viewport_size({'width':900,'height':900});r=s.rect('#bm-auto');pr=s.rect('#bm-fixture');assert abs((r['x']+r['width']/2)-(pr['x']+pr['width']/2))<1;return {'centerPreserved':True,'noMarginPx':True}
 s.gate(7,'Centralização AUTO preservada',g7)
 def g8():
  s.open();s.sel('#bm-percent');assert s.fields('padding-top')=='10';assert s.page.locator('#ie-padding-top-unit').input_value()=='%';s.input('padding-top',12);assert s.raw('#bm-percent','padding-top')=='12%'
  p1=float(s.css('#bm-percent','padding-top')[:-2]);s.page.set_viewport_size({'width':650,'height':850});p2=float(s.css('#bm-percent','padding-top')[:-2]);assert p2<p1;return {'raw':'12%','desktopPx':p1,'narrowPx':p2}
 s.gate(8,'Percentual preservado ao editar',g8)
 def g9():
  s.open();s.sel('#bm-rem');assert s.fields('padding-top')=='1.5';s.page.locator('[data-step-for="ie-padding-top"][data-direction="1"]').click();assert s.raw('#bm-rem','padding-top')=='2.5rem';return {'raw':'2.5rem','stepInRem':True}
 s.gate(9,'rem e stepper',g9)
 def g10():
  s.open();s.sel('#bm-em');assert s.read('#bm-em','padding-top')['raw']=='2em';s.input('padding-left',3);assert s.raw('#bm-em','padding-left')=='3em';assert s.css('#bm-em','padding-left')=='60px';return {'raw':'3em','computed':60}
 s.gate(10,'em preservado',g10)
 def g11():
  s.open();s.sel('#bm-vp');assert s.page.locator('#ie-padding-top-unit').input_value()=='vw';assert s.page.locator('#ie-padding-right-unit').input_value()=='vh';s.input('padding-top',2);s.input('padding-right',3);assert s.raw('#bm-vp','padding-top')=='2vw';assert s.raw('#bm-vp','padding-right')=='3vh';return {'vw':True,'vh':True}
 s.gate(11,'vw / vh',g11)
 def g12():
  s.open();s.sel('#bm-expression');vals={side:s.read('#bm-expression','padding-'+side) for side in ['top','right','bottom','left']};assert all(x['kind']=='expression' for x in vals.values());assert s.hist()==0;assert s.page.locator('[data-step-for="ie-padding-top"][data-direction="1"]').is_disabled();assert s.page.locator('#ie-padding-bottom-raw').inner_text()=='var(--bm-space)';html=s.serialize();assert 'var(--bm-space)' in html;return {'raws':{k:v['raw'] for k,v in vals.items()},'noFlattening':True}
 s.gate(12,'calc / clamp / var preservados',g12)
 def g13():
  s.open();s.sel('#bm-percent');before=s.css('#bm-percent','padding-top');s.unit('padding-top','px');assert s.page.locator('#ie-box-pending').is_visible();assert s.hist()==0;s.page.locator('#ie-box-cancel').click();assert s.raw('#bm-percent','padding-top')==''
  s.unit('padding-top','px');s.page.locator('#ie-box-accept').click();assert s.raw('#bm-percent','padding-top').endswith('px');assert abs(float(s.css('#bm-percent','padding-top')[:-2])-float(before[:-2]))<.1
  s.sel('#bm-expression');s.unit('padding-bottom','px');s.page.locator('#ie-box-accept').click();assert s.raw('#bm-expression','padding-bottom')=='15px';return {'cancelAndConfirm':True,'expressionConversion':True,'equivalentAtCurrentViewport':True}
 s.gate(13,'Conversão explícita com aviso',g13)
 def g14():
  s.open();s.sel('#bm-responsive');s.input('padding-top',25);assert s.raw('#bm-responsive','padding-top')=='25px';assert s.ev('document.querySelector("#bm-responsive").style.getPropertyPriority("padding-top")')=='';s.page.set_viewport_size({'width':390,'height':844});s.page.wait_for_timeout(80);assert s.css('#bm-responsive','padding-top')=='8px';return {'inlineNormal':25,'mobileHostImportant':8}
 s.gate(14,'CSS responsivo sem important automático',g14)
 def g15():
  s.open();s.sel('#bm-important');s.input('padding-top',32);assert s.page.locator('#ie-box-force').is_visible();assert s.css('#bm-important','padding-top')=='16px';assert s.hist()==0
  s.page.locator('#ie-box-force').click();assert s.page.locator('#ie-dialog').is_visible();s.dialog_confirm();assert s.raw('#bm-important','padding-top')=='32px';assert s.ev('document.querySelector("#bm-important").style.getPropertyPriority("padding-top")')=='important';assert s.hist()==1;s.undo();assert s.css('#bm-important','padding-top')=='16px';return {'requiresConfirm':True,'oneHistory':True,'rollbackBeforeConsent':True}
 s.gate(15,'Forçar regra somente com consentimento',g15)
 def g16():
  s.open();s.sel('#bm-inline');assert s.page.locator('#ie-margin-top').is_disabled();assert s.page.locator('#ie-margin-bottom').is_disabled();assert s.page.locator('#ie-link-margin').is_disabled();s.input('padding-left',8);s.input('margin-left',9);assert s.raw('#bm-inline','margin-left')=='9px';assert s.css('#bm-inline','display')=='inline';return {'verticalDisabled':True,'noDisplayMutation':True}
 s.gate(16,'Inline contextual',g16)
 def g17():
  s.open();s.sel('#bm-cell');assert all(s.page.locator('#ie-margin-'+x).is_disabled() for x in ['top','right','bottom','left']);s.input('padding-top',15);assert s.css('#bm-cell','padding-top')=='15px';s.page.locator('#ie-box-table').click();assert s.page.locator('#ie-pane-table').is_visible();return {'marginDisabled':True,'padding':15,'tableLink':True}
 s.gate(17,'Célula de tabela contextual',g17)
 def g18():
  s.open();s.sel('#bm-flex');assert s.page.locator('#ie-box-gap').is_visible();s.input('gap',16);assert s.css('#bm-flex','column-gap')=='16px';assert s.css('#bm-flex','row-gap')=='16px';s.input('column-gap',24);s.input('row-gap',12);assert s.css('#bm-flex','column-gap')=='24px';assert s.css('#bm-flex','row-gap')=='12px';s.page.locator('#ie-link-gap').check();s.input('row-gap',20);assert s.css('#bm-flex','column-gap')=='20px';return {'generalAndAxes':True,'linkedHV':True}
 s.gate(18,'Gap em flex',g18)
 def g19():
  s.open();s.sel('#bm-grid');s.input('gap',17);assert s.css('#bm-grid','row-gap')=='17px';s.input('row-gap',21);assert s.css('#bm-grid','column-gap')=='17px';s.sel('#bm-grid-margins');assert 'margens' in s.page.locator('#ie-box-context').inner_text();assert s.css('#bm-grid-margins>div','margin-left')=='10px';return {'grid':True,'childrenMarginsRetained':True}
 s.gate(19,'Gap em grid e aviso de margens',g19)
 def g20():
  s.open();s.sel('#bm-px');s.page.locator('#ie-link-padding').check();s.sel('#bm-a');assert not s.page.locator('#ie-link-padding').is_checked();s.page.locator('#ie-link-margin').check();s.many(['#bm-a','#bm-b']);assert not s.page.locator('#ie-link-margin').is_checked();return {'resetOnSelectionAndSetChange':True}
 s.gate(20,'Vínculo local à seleção',g20)
 def g21():
  s.open();s.sel('#bm-px');s.input('padding-top',5000);assert s.css('#bm-px','padding-top')=='10px';assert s.page.locator('#ie-padding-top').get_attribute('aria-invalid')=='true';s.input('padding-top',-1);assert s.css('#bm-px','padding-top')=='10px';s.input('margin-top',-2500);assert s.css('#bm-px','margin-top')=='5px';assert s.hist()==0;s.input('padding-top',2000);assert s.css('#bm-px','padding-top')=='2000px';s.page.locator('[data-step-for="ie-padding-top"][data-direction="1"]').click();assert s.css('#bm-px','padding-top')=='2000px';assert s.hist()==1;return {'rejects5000andNegativePadding':True,'stepClamp':True,'noOpNoHistory':True}
 s.gate(21,'Validação real de limites',g21)
 def g22():
  s.open();s.sel('#bm-px');plus=s.page.locator('[data-step-for="ie-padding-top"][data-direction="1"]');plus.click();assert s.raw('#bm-px','padding-top')=='11px';plus.click(modifiers=['Shift']);assert s.raw('#bm-px','padding-top')=='21px';h=s.hist();r=plus.bounding_box();s.page.mouse.move(r['x']+8,r['y']+10);s.page.mouse.down();s.page.wait_for_timeout(770);s.page.mouse.up();s.page.wait_for_timeout(50);n=float(s.raw('#bm-px','padding-top')[:-2]);assert n>23;assert s.hist()==h+1;s.page.locator('#ie-padding-top').focus();s.page.keyboard.press('Shift+ArrowDown');s.page.wait_for_timeout(30);assert float(s.raw('#bm-px','padding-top')[:-2])==n-10;return {'holdFinal':n,'oneOperationPerHold':True,'keyboard':True}
 s.gate(22,'Stepper, hold, Shift e teclado',g22)
 def g23():
  s.open();s.many(['#bm-a','#bm-b']);s.input('padding-top',20);assert s.raw('#bm-a','padding-top')=='20px';assert s.raw('#bm-b','padding-top')=='20px';assert s.hist()==1;s.undo();assert s.css('#bm-a','padding-top')=='10px';assert s.css('#bm-b','padding-top')=='30px';return {'normalizesExplicitNumber':True,'oneHistory':True}
 s.gate(23,'Multiselect absoluto',g23)
 def g24():
  s.open();s.many(['#bm-a','#bm-b']);assert s.fields('padding-top')=='';s.page.locator('[data-step-for="ie-padding-top"][data-direction="1"]').click();assert s.raw('#bm-a','padding-top')=='11px';assert s.raw('#bm-b','padding-top')=='31px';assert s.hist()==1
  s.page.locator('#ie-link-padding').check();s.page.locator('[data-step-for="ie-padding-left"][data-direction="1"]').click();assert s.raw('#bm-a','padding-top')=='12px';assert s.raw('#bm-a','padding-left')=='11px';assert s.raw('#bm-b','padding-left')=='31px';s.undo();assert s.raw('#bm-a','padding-top')=='11px';return {'relative10_30to11_31':True,'linkedRelativePreservesEachSide':True}
 s.gate(24,'Mixed mesma unidade: incremento relativo',g24)
 def g25():
  s.open();s.many(['#bm-a','#bm-unit-mix']);assert s.page.locator('[data-step-for="ie-padding-top"][data-direction="1"]').is_disabled();assert s.page.locator('#ie-padding-top-source').inner_text()=='Unidades diferentes';s.page.locator('#ie-padding-top').fill('20');s.unit('padding-top','px');assert s.page.locator('#ie-box-pending').is_visible();s.page.locator('#ie-box-accept').click();assert s.raw('#bm-a','padding-top')=='20px';assert s.raw('#bm-unit-mix','padding-top')=='20px';return {'noSilentBase':True,'explicitNormalization':True}
 s.gate(25,'Mixed unidades diferentes',g25)
 def g26():
  s.open();s.many(['#bm-a','#bm-auto-mix']);assert s.page.locator('#ie-margin-left-source').inner_text()=='AUTO + valores';assert s.page.locator('[data-step-for="ie-margin-left"][data-direction="1"]').is_disabled();assert s.hist()==0;s.page.locator('#ie-margin-left').fill('18');s.unit('margin-left','px');s.page.locator('#ie-box-cancel').click();assert s.raw('#bm-auto-mix','margin-left')=='';return {'autoMixed':True,'cancelNoMutation':True}
 s.gate(26,'Mixed AUTO + length',g26)
 def g27():
  s.open();s.sel('#bm-px');s.input('padding-top',25);s.input('margin-left',30);s.ev('InlineEditor.controllers.VisualEngine.property("color","rgb(80, 50, 90)")');s.page.locator('#ie-box-reset-padding').click();s.page.wait_for_timeout(30);assert s.css('#bm-px','padding-top')=='10px';assert s.css('#bm-px','margin-left')=='30px';assert s.css('#bm-px','color')=='rgb(80, 50, 90)';s.undo();assert s.css('#bm-px','padding-top')=='25px';return {'onlyPadding':True,'undoReset':True}
 s.gate(27,'Reset local interno',g27)
 def g28():
  s.open();s.sel('#bm-auto');s.page.locator('#ie-margin-left').fill('22');s.unit('margin-left','px');s.page.locator('#ie-box-accept').click();s.input('padding-top',15);s.page.locator('#ie-box-reset-margin').click();s.page.wait_for_timeout(40);assert s.read('#bm-auto','margin-left')['kind']=='auto';assert s.css('#bm-auto','padding-top')=='15px';return {'restoresAutoNotResolvedPixels':True}
 s.gate(28,'Reset local externo',g28)
 def g29():
  s.open();s.sel('#bm-flex');s.input('gap',26);s.input('padding-top',22);s.page.locator('#ie-box-reset-gap').click();assert s.page.locator('#ie-dialog').is_visible();s.dialog_confirm();assert s.css('#bm-flex','row-gap')=='12px';assert s.css('#bm-flex','column-gap')=='18px';assert s.css('#bm-flex','padding-top')=='22px';return {'onlyGap':True,'confirmationForTwoProperties':True}
 s.gate(29,'Reset local gap',g29)
 def g30():
  s.open();s.sel('#bm-rem');s.input('padding-top',2.5);s.input('margin-left',1.5);s.unit('padding-bottom','em');assert s.hist()==3
  for _ in range(3):s.undo()
  assert s.raw('#bm-rem','padding-top')=='';assert s.read('#bm-rem','padding-top')['raw']=='1.5rem'
  for _ in range(3):s.redo()
  assert s.raw('#bm-rem','padding-top')=='2.5rem';assert s.raw('#bm-rem','margin-left')=='1.5rem';return {'semanticUndoRedo':True,'operations':3}
 s.gate(30,'Histórico semântico',g30)
 def g31():
  s.open();s.sel('#bm-px');assert not s.ev('InlineEditor.diagnostics().dirty');s.input('padding-top',19);assert s.ev('InlineEditor.diagnostics().dirty');s.ev('window.showSaveFilePicker=undefined')
  with s.page.expect_download() as info:s.page.locator('#ie-save').click()
  info.value.save_as(str(OUT/'box-saved.html'));s.page.wait_for_timeout(50);assert not s.ev('InlineEditor.diagnostics().dirty');s.input('padding-top',21);assert s.ev('InlineEditor.diagnostics().dirty');return {'download':True,'checkpoint':True,'subsequentDirty':True}
 s.gate(31,'Dirty / download / checkpoint',g31)
 def g32():
  s.open();s.sel('#bm-auto');s.unit('margin-top','auto');s.sel('#bm-percent');s.input('padding-left',12);s.sel('#bm-rem');s.input('padding-top',2.5);s.sel('#bm-flex');s.input('gap',17);html=s.serialize();clean=s.serialize(True);assert 'id="ie-toolbar"' not in clean;assert 'padding-left: 12%' in clean
  s.reopen(html);assert s.raw('#bm-auto','margin-top')=='auto';assert s.raw('#bm-percent','padding-left')=='12%';assert s.raw('#bm-rem','padding-top')=='2.5rem';assert s.raw('#bm-flex','row-gap')=='17px';assert s.read('#bm-expression','padding-right')['kind']=='expression';assert not s.ev('InlineEditor.diagnostics().dirty');return {'authoredSave':True,'cleanBuildRetainsSemantics':True,'formulas':True}
 s.gate(32,'Salvar, reabrir e clean build',g32)
 def g33():
  s.open();s.scroll('#bm-img');s.sel('#bm-img');s.input('padding-left',14);s.input('margin-top',22);s.ev('InlineEditor.controllers.GeometryController.setDimension("width",320)');s.page.wait_for_timeout(50);s.scroll('#bm-img');s.ev('InlineEditor.controllers.SubTabController.setSub("layout","position")');s.page.locator('#ie-free-move').check();s.page.wait_for_timeout(50)
  live,final=s.drag('#ie-move-handle',55,22);assert all(abs(live[0][k]-final[0][k])<.2 for k in ['x','y','w','h']),(live,final)
  s.undo();s.redo();s.page.wait_for_timeout(50);r=s.rect('#bm-img');assert abs(r['width']-final[0]['w'])<.1
  live,final=s.drag('[data-dir="se"]',48,20);assert all(abs(live[0][k]-final[0][k])<.2 for k in ['x','y','w','h']),(live,final)
  return {'resizeMoveRelease':True,'scaledParent':True,'releaseDeltaBelowPx':.2}
 s.gate(33,'Regressão geometria após Box Model',g33)
 def g34():
  s.open();s.sel('#bm-px');s.ev('InlineEditor.controllers.SubTabController.setMain("effects");InlineEditor.controllers.SubTabController.setSub("effects","loop")');s.page.locator('#ie-fx-loop').select_option('breathe');s.tabs();s.input('padding-top',28);s.page.wait_for_timeout(50);assert s.ev('document.querySelector("#bm-px").getAnimations().some(a=>a.id.startsWith("ie-"))');assert s.raw('#bm-px','padding-top')=='28px';s.undo();assert s.ev('JSON.parse(document.querySelector("#bm-px").dataset.ieEffects).loop.id')=='breathe';return {'effectRetained':True}
 s.gate(34,'Efeitos preservados',g34)
 def g35():
  assert LANDING.exists(),'Integrate the real landing first';s.fresh(LANDING.read_text(encoding='utf-8'));s.open();checks={}
  for target,prop,n in [('.price-card','padding-top',26),('.hero .button','margin-top',20),('.guide','padding-top',82),('.device-imac','margin-top',16)]:
   s.sel(target);s.scroll(target);s.input(prop,n)
   if s.page.locator('#ie-'+prop+'-unit').input_value() not in ['px','%','rem','em','vw','vh']:s.unit(prop,'px')
   if s.page.locator('#ie-box-pending').is_visible():
    if s.page.locator('#ie-box-accept').is_visible():s.page.locator('#ie-box-accept').click()
    if s.page.locator('#ie-box-force').is_visible():s.page.locator('#ie-box-force').click();s.dialog_confirm()
   s.page.wait_for_timeout(400) # Host CTA uses transition: all .25s; inspect its settled state.
   assert abs(float(s.css(target,prop)[:-2])-n)<.6,(target,prop,s.css(target,prop));checks[target]=s.css(target,prop)
  s.page.screenshot(path=str(OUT/'box-landing-desktop.png'));return checks
 s.gate(35,'Landing real desktop: card / CTA / seção / mockup',g35)
 def g36():
  assert LANDING.exists();s.fresh(LANDING.read_text(encoding='utf-8'),w=390,h=844);s.page.locator('#ie-launcher').click();s.sel('.price-card');old=s.read('.price-card','padding-top');s.input('padding-top',29)
  if s.page.locator('#ie-box-pending').is_visible():s.page.locator('#ie-box-cancel').click()
  assert not s.ev('document.querySelector(".price-card").style.getPropertyPriority("padding-top")==="important"')
  bar=s.rect('#ie-toolbar');assert bar['x']>=-1 and bar['x']+bar['width']<=391;assert s.ev('document.documentElement.scrollWidth<=innerWidth+1')
  s.page.screenshot(path=str(OUT/'box-landing-mobile.png'))
  s.fresh(w=390,h=844);s.page.locator('#ie-launcher').click();s.sel('#bm-responsive');s.input('padding-top',30);assert s.css('#bm-responsive','padding-top')=='8px';assert s.hist()==0
  s.page.set_viewport_size({'width':320,'height':700});s.page.wait_for_timeout(80);bar=s.rect('#ie-toolbar');assert bar['x']>=-1 and bar['x']+bar['width']<=321
  s.page.screenshot(path=str(OUT/'box-template-mobile-320.png'));return {'viewports':['390x844','320x700'],'noSilentImportant':True,'mobileHostKept':8,'browser':'Chromium '+browser.version}
 s.gate(36,'Mobile emulado: UI e regras do host',g36)
 if s.page:s.page.close(run_before_unload=False)
 browser.close()
print('SUMMARY',sum(r['status']=='PASS' for r in results),'/',len(results),flush=True)
raise SystemExit(1 if any(r['status']!='PASS' for r in results) else 0)
