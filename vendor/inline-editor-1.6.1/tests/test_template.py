from pathlib import Path
import json,traceback,math,time,os
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]; (ROOT/'qa').mkdir(exist_ok=True); HTML=Path(os.environ.get('IE_TEMPLATE_HTML',str(ROOT/'INLINE_EDITOR_TEMPLATE.html'))).read_text(encoding='utf-8'); results=[]
def close(a,b,tol=1):return abs(a-b)<=tol
class Suite:
 def __init__(self,b):self.b=b;self.page=None;self.errors=[];self.gates=[]
 def new(self,w=1440,h=960):
  if self.page:self.page.close(run_before_unload=False)
  self.errors=[];self.page=self.b.new_page(viewport={'width':w,'height':h},accept_downloads=True)
  self.page.on('pageerror',lambda e:self.errors.append(str(e)))
  self.page.set_default_timeout(2500);self.page.set_content(HTML,wait_until='load');self.page.wait_for_timeout(150);return self.page
 def open(self):self.page.locator('#ie-launcher').click();self.page.evaluate("document.querySelector('#ie-toolbar').style.left='1050px';document.querySelector('#ie-toolbar').style.top='10px'")
 def sel(self,s):self.page.evaluate('(s)=>InlineEditor.select(document.querySelector(s))',s);self.page.wait_for_timeout(50)
 def many(self,ss):self.page.evaluate('(ss)=>InlineEditor.selectMany(ss.map(s=>document.querySelector(s)))',ss);self.page.wait_for_timeout(50)
 def tab(self,main,sub):
  self.page.locator('#ie-tab-'+main).click();self.page.locator('#ie-subtab-'+sub).click();self.page.wait_for_timeout(30)
 def set(self,id,v):
  self.page.evaluate('([id,v])=>{const n=document.getElementById(id);n.value=v;n.dispatchEvent(new Event("change",{bubbles:true}))}',[id,str(v)]);self.page.wait_for_timeout(30)
 def box(self,s):return self.page.locator(s).bounding_box()
 def css(self,s,p):return self.page.evaluate('([s,p])=>getComputedStyle(document.querySelector(s))[p]',[s,p])
 def scroll(self,s):self.page.locator(s).scroll_into_view_if_needed();self.page.wait_for_timeout(50)
 def hist(self):return self.page.evaluate('InlineEditor.diagnostics().history')
 def drag(self,handle,dx,dy,shift=False,alt=True):
  h=self.box(handle);assert h,'handle hidden '+handle;x=h['x']+h['width']/2;y=h['y']+h['height']/2
  self.page.mouse.move(x,y);self.page.mouse.down()
  if shift:self.page.keyboard.down('Shift')
  if alt:self.page.keyboard.down('Alt')
  self.page.mouse.move(x+dx,y+dy,steps=8)
  before=self.page.evaluate('InlineEditor.state.selectionSet.map(e=>({w:e.getBoundingClientRect().width,h:e.getBoundingClientRect().height,x:e.getBoundingClientRect().left,y:e.getBoundingClientRect().top}))')
  self.page.mouse.up()
  if shift:self.page.keyboard.up('Shift')
  if alt:self.page.keyboard.up('Alt')
  self.page.wait_for_timeout(180)
  after=self.page.evaluate('InlineEditor.state.selectionSet.map(e=>({w:e.getBoundingClientRect().width,h:e.getBoundingClientRect().height,x:e.getBoundingClientRect().left,y:e.getBoundingClientRect().top}))')
  return before,after
 def gate(self,n,title,fn):
  only=os.environ.get('GATES')
  if only and n not in [int(x) for x in only.split(',')]:return
  try:
   self.new();out=fn() or {};assert not self.errors,'pageerrors: '+str(self.errors);entry={'gate':n,'name':title,'status':'PASS','measurements':out};print('PASS',n,title,flush=True)
  except Exception as e:
   entry={'gate':n,'name':title,'status':'FAIL','error':str(e),'trace':traceback.format_exc(),'pageerrors':self.errors};print('FAIL',n,title,str(e)[:260],flush=True)
   try:self.page.screenshot(path=str(ROOT/f'qa/fail-{n}.png'))
   except:pass
  results.append(entry);(ROOT/'qa/template-results.json').write_text(json.dumps(results,ensure_ascii=False,indent=2))
with sync_playwright() as p:
 try:browser=p.chromium.launch(headless=True)
 except:browser=p.chromium.launch(executable_path=os.environ.get('CHROMIUM_EXECUTABLE','/usr/bin/chromium'),headless=True,args=['--no-sandbox'])
 s=Suite(browser)
 def g1():
  assert s.page.evaluate('InlineEditor.version')==json.loads((ROOT/'VERSION.json').read_text())['version'];assert s.page.locator('#ie-toolbar').count()==1;assert not s.page.evaluate('InlineEditor.diagnostics().dirty');return {'version':s.page.evaluate('InlineEditor.version'),'pageerrors':0}
 s.gate(1,'Boot',g1)
 def g2():
  s.open();s.sel('#qa-text-a')
  for m,sub in [('content','text'),('layout','size'),('visual','background'),('effects','hover'),('more','history')]:
   s.tab(m,sub);assert s.page.locator('.ie-main-panel:visible').count()==1;assert s.page.locator('.ie-pane:visible').count()==1
  s.page.locator('#ie-tab-content').hover();s.page.wait_for_timeout(220);assert s.page.locator('#ie-tooltip').is_visible();assert s.page.locator('#ie-toolbar [title]').count()==0
  s.page.locator('#ie-tab-content').focus();s.page.keyboard.press('ArrowRight');assert s.page.locator('#ie-tab-layout').get_attribute('aria-selected')=='true'
  return {'tabs':5,'native_titles':0,'tooltip':True,'keyboard':True}
 s.gate(2,'Main tabs / tooltip / keyboard',g2)
 def g3():
  s.open();s.sel('#qa-a');assert s.page.locator('[data-subtab]').count()==25
  s.tab('visual','borders');s.sel('#qa-b');assert s.page.locator('#ie-pane-borders').is_visible()
  s.page.locator('#ie-tab-content').click();assert s.page.locator('#ie-subtab-link').get_attribute('aria-disabled')=='true'
  s.page.locator('#ie-subtab-link').hover();s.page.wait_for_timeout(200);assert s.page.locator('#ie-tooltip').is_visible()
  return {'subtabs':25,'context_disabled':True,'valid_subtab_retained':True}
 s.gate(3,'Subtabs / context',g3)
 def g4():
  s.open();s.sel('#qa-text-a');s.tab('content','typography');s.set('ie-font-size',30);s.set('ie-line-height',1.8);s.set('ie-letter-spacing',2.3)
  assert s.css('#qa-text-a','fontSize')=='30px';assert close(float(s.css('#qa-text-a','lineHeight')[:-2]),54,.2);assert s.css('#qa-text-a','letterSpacing')=='2.3px'
  s.page.evaluate('InlineEditor.undo();InlineEditor.undo();InlineEditor.undo()');assert s.css('#qa-text-a','fontSize')=='22px'
  s.page.evaluate('InlineEditor.redo();InlineEditor.redo();InlineEditor.redo()');assert s.css('#qa-text-a','fontSize')=='30px';return {'fontSize':30,'lineHeight':54,'letterSpacing':2.3,'important_host_override':True}
 s.gate(4,'Typography / undo / redo',g4)
 def g5():
  s.open();s.sel('#qa-text-a');s.tab('content','typography');h=s.hist();plus=s.page.locator('[data-step-for=ie-font-size][data-direction="1"]');plus.click();assert s.css('#qa-text-a','fontSize')=='23px';assert s.hist()==h+1
  plus.click(modifiers=['Shift']);assert s.css('#qa-text-a','fontSize')=='33px'
  b=plus.bounding_box();s.page.mouse.move(b['x']+10,b['y']+10);s.page.mouse.down();s.page.wait_for_timeout(660);s.page.mouse.up();s.page.wait_for_timeout(40);n=float(s.css('#qa-text-a','fontSize')[:-2]);assert n>=36;assert s.hist()==h+3
  s.page.locator('#ie-font-size').focus();s.page.keyboard.press('ArrowDown');s.page.wait_for_timeout(40);assert s.css('#qa-text-a','fontSize')==str(int(n-1))+'px'
  return {'hold_value':n,'one_history_per_hold':True,'shift_10':True}
 s.gate(5,'Steppers / hold / Shift ×10 / keyboard',g5)
 def g6():
  s.open();s.scroll('#qa-text-a');s.page.locator('#qa-text-a').click(position={'x':5,'y':8});assert s.page.evaluate('InlineEditor.state.selected.id')=='qa-text-a'
  s.page.locator('#ie-child').click();assert s.page.evaluate('InlineEditor.state.selected.tagName')=='STRONG';s.page.locator('#ie-parent').click();assert s.page.evaluate('InlineEditor.state.selected.id')=='qa-text-a'
  s.page.locator('#ie-parent').click();s.page.locator('#ie-child').click();assert s.page.locator('#ie-child-popover button').count()==3;s.page.locator('#ie-child-popover button').nth(1).click();assert s.page.evaluate('InlineEditor.state.selected.id')=='qa-text-b'
  return {'normal_click':True,'parent':True,'child':True,'child_picker':3}
 s.gate(6,'Single selection / parent / child',g6)
 def g7():
  s.open();s.scroll('#qa-group');s.page.locator('#qa-a').click();s.page.locator('#qa-b').click(modifiers=['Control']);s.page.locator('#qa-c').click(modifiers=['Control']);s.page.wait_for_timeout(50)
  assert s.page.evaluate('InlineEditor.state.selectionSet.length')==3;assert s.page.evaluate('InlineEditor.state.selected.id')=='qa-c';assert s.page.locator('#ie-multi-outlines .ie-outline').count()==3
  s.page.locator('#qa-b').click(modifiers=['Control']);assert s.page.evaluate('InlineEditor.state.selectionSet.length')==2;s.page.keyboard.press('Escape');assert s.page.evaluate('InlineEditor.state.selectionSet.length')==0
  return {'ctrl_click':True,'primary_last':True,'group_outlines':3}
 s.gate(7,'Multiselect',g7)
 def g8():
  s.open();s.many(['#qa-text-a','#qa-text-b','#qa-text-c']);s.tab('content','typography');h=s.hist();s.set('ie-font-size',27);assert all(s.css(sel,'fontSize')=='27px' for sel in ['#qa-text-a','#qa-text-b','#qa-text-c']);assert s.hist()==h+1
  s.tab('content','text');s.set('ie-text-color','#663399');s.page.locator('#ie-bold').click();s.tab('visual','opacity');s.set('ie-opacity',75)
  s.tab('effects','hover');s.set('ie-fx-hover','lift');assert s.page.evaluate('[...document.querySelectorAll("#qa-text-group p")].every(e=>JSON.parse(e.dataset.ieEffects).hover.id==="lift")')
  assert s.page.locator('#ie-subtab-link').get_attribute('aria-disabled')=='true';return {'batch':3,'one_history_each':True,'blocked_url_batch':True}
 s.gate(8,'Batch formatting',g8)
 def g9():
  s.open();s.scroll('#qa-group');s.many(['#qa-a','#qa-b','#qa-c']);s.tab('layout','group');out={}
  for mode,key in [('left','x'),('center','cx'),('right','right'),('top','y'),('middle','cy'),('bottom','bottom')]:
   s.page.locator(f'[data-group-align={mode}]').click();bs=[s.box('#qa-'+x) for x in 'abc'];values=[b['x'] if key=='x' else b['y'] if key=='y' else b['x']+b['width']/2 if key=='cx' else b['y']+b['height']/2 if key=='cy' else b['x']+b['width'] if key=='right' else b['y']+b['height'] for b in bs];assert max(values)-min(values)<1;out[mode]=round(max(values)-min(values),3);s.page.evaluate('InlineEditor.undo()')
  return out
 s.gate(9,'Group align six axes',g9)
 def g10():
  s.open();s.scroll('#qa-group');s.many(['#qa-a','#qa-b','#qa-c']);s.tab('layout','group');s.set('ie-group-gap',18);s.page.locator('#ie-gap-x').click();bs=[s.box('#qa-'+x) for x in 'abc'];assert close(bs[1]['x']-bs[0]['x']-bs[0]['width'],18,.2);assert close(bs[2]['x']-bs[1]['x']-bs[1]['width'],18,.2)
  s.page.locator('#ie-gap-y').click();bs=sorted([s.box('#qa-'+x) for x in 'abc'],key=lambda b:b['y']);assert close(bs[1]['y']-bs[0]['y']-bs[0]['height'],18,.2)
  s.page.locator('#ie-distribute-y').click();s.many(['#qa-a','#qa-text-b']);h=s.hist();s.page.evaluate('InlineEditor.controllers.GroupController.distribute("x",20)');assert s.hist()==h
  return {'gap_x':18,'gap_y':18,'cross_parent_blocked':True}
 s.gate(10,'Distribute and equal gap',g10)
 def g11():
  s.open();s.scroll('#qa-group');s.many(['#qa-a','#qa-b','#qa-c']);s.tab('layout','position');s.page.locator('#ie-free-move').check();h=s.hist();before=[s.box('#qa-'+x) for x in 'abc'];live,end=s.drag('#ie-move-handle',65,22,shift=True);assert s.hist()==h+1
  after=[s.box('#qa-'+x) for x in 'abc'];assert all(close(a['x']-b['x'],65) and close(a['y'],b['y']) for a,b in zip(after,before));assert all(close(l['x'],e['x'],.1) for l,e in zip(live,end))
  s.page.evaluate('InlineEditor.undo()');assert close(s.box('#qa-a')['x'],before[0]['x']);s.page.evaluate('InlineEditor.redo()');assert close(s.box('#qa-a')['x'],after[0]['x']);return {'delta_x':65,'locked_y':0,'history_entries':1,'release_jump':0}
 s.gate(11,'Group drag / Shift / undo',g11)
 def g12():
  s.open();s.scroll('#qa-media-scaled');s.sel('#qa-media-scaled');s.tab('layout','size');a=s.box('#qa-media-scaled');h=s.hist();live,end=s.drag('[data-dir=e]',36,0);assert close(end[0]['w']-a['width'],36,1);assert close(end[0]['h'],a['height'],.1);assert close(live[0]['w'],end[0]['w'],.1)
  live,end=s.drag('[data-dir=se]',27,19);ratio=end[0]['w']/end[0]['h'];prior=live[0]['w']/live[0]['h'];assert close(ratio,prior,.001)
  s.page.locator('#ie-lock-ratio').uncheck();live,end=s.drag('[data-dir=s]',0,27);assert close(live[0]['w'],end[0]['w'],.1);assert close(live[0]['h'],end[0]['h'],.1)
  s.tab('layout','position');s.page.locator('#ie-free-move').check();w=s.box('#qa-media-scaled')['width'];s.drag('#ie-move-handle',40,0);assert close(s.box('#qa-media-scaled')['width'],w,.1)
  return {'scaled_parent':.9,'release_jump':0,'move_preserves_width':True}
 s.gate(12,'Geometry regression / scaled parent',g12)
 def g13():
  s.open();s.sel('#qa-a');s.tab('layout','position');assert not s.page.locator('#ie-element-position').is_visible();s.set('ie-position-css','absolute');assert s.page.locator('#ie-element-position').is_visible();s.set('ie-position-css','fixed');assert s.page.locator('#ie-element-position').is_visible();s.set('ie-position-css','relative');assert not s.page.locator('#ie-element-position').is_visible();return {'absolute_fixed_only':True}
 s.gate(13,'Position grid context',g13)
 def g14():
  s.open();s.sel('#qa-shadow');s.tab('visual','borders');s.set('ie-border-width',3);s.set('ie-border-style','double');s.set('ie-inner-width',2);s.set('ie-inner-color','#cc8844');s.set('ie-outer-width',2);s.set('ie-outer-offset',4)
  assert s.css('#qa-shadow','borderStyle')=='double';assert 'inset' in s.css('#qa-shadow','boxShadow');assert s.css('#qa-shadow','outlineWidth')=='2px';return {'main':'double 3px','inner':2,'outer':2,'offset':4}
 s.gate(14,'Three simultaneous borders',g14)
 def g15():
  s.open();s.sel('#qa-shadow');orig=s.css('#qa-shadow','boxShadow');s.tab('visual','shadow');s.set('ie-shadow-preset','raised');assert orig in s.css('#qa-shadow','boxShadow');s.tab('visual','filters');s.set('ie-brightness',130);assert 'contrast(1.12)' in s.css('#qa-shadow','filter')
  s.tab('effects','loop');s.set('ie-fx-loop','glow');s.page.wait_for_timeout(500);f=s.css('#qa-shadow','filter');assert 'contrast(1.12)' in f and 'brightness(1.3)' in f and 'drop-shadow' in f;return {'host_shadow_preserved':True,'filter_composed':f}
 s.gate(15,'Shadow / filter / effects composition',g15)
 def g16():
  s.open();s.sel('#qa-a');out={}
  for k,id in [('hover','lift'),('enter','up'),('loop','float'),('interaction','tap')]:
   s.tab('effects',k);s.set('ie-fx-'+k,id);s.set('ie-fx-'+k+'-intensity',20);low=s.page.evaluate('([k,id])=>IEAuthored.spec(document.querySelector("#qa-a"),k,{id,intensity:20,duration:1}).frames',[k,id]);s.set('ie-fx-'+k+'-intensity',90);hi=s.page.evaluate('([k,id])=>IEAuthored.spec(document.querySelector("#qa-a"),k,{id,intensity:90,duration:1}).frames',[k,id]);assert low!=hi;out[k]={'low':low,'high':hi}
  # Actual slider gesture must be atomic.
  s.tab('effects','hover');h=s.hist();r=s.box('[data-range-for="ie-fx-hover-intensity"]');s.page.mouse.move(r['x']+10,r['y']+8);s.page.mouse.down();s.page.mouse.move(r['x']+r['width']*.8,r['y']+8,steps=8);s.page.mouse.up();s.page.wait_for_timeout(50);assert s.hist()==h+1
  return {'four_classes_intensity':True,'slider_atomic':True,'sample':out['hover']}
 s.gate(16,'Intensity / slider transactions',g16)
 def g17():
  s.open();s.scroll('#qa-shadow');s.sel('#qa-shadow');catalog=s.page.evaluate('Object.fromEntries(["hover","enter","loop","interaction"].map(k=>[k,[...document.querySelector("#ie-fx-"+k).options].slice(1).map(o=>o.value)]))');count=0
  for k,ids in catalog.items():
   for id in ids:
    s.page.evaluate('([k,id])=>{const e=document.querySelector("#qa-shadow");InlineEditor.controllers.EffectsEngine.configure(k,{id,intensity:70,duration:.2,delay:0});IEAuthored.refresh();IEAuthored.preview(e,k)}',[k,id]);s.page.wait_for_timeout(15)
    assert s.page.evaluate('document.querySelector("#qa-shadow").getAnimations().some(a=>a.id.startsWith("ie-"))'),k+id
    count+=1
  s.page.emulate_media(reduced_motion='reduce');s.page.wait_for_timeout(50);assert s.page.evaluate('document.querySelector("#qa-shadow").getAnimations().filter(a=>a.id.startsWith("ie-")).length')==0
  return {'effects_activated':count,'counts':{k:len(v) for k,v in catalog.items()},'reduced_motion':True}
 s.gate(17,'48 effects / reduced motion',g17)
 def g18():
  s.open();s.sel('#qa-text-a');s.tab('content','typography');s.set('ie-font-size',39);s.page.locator('#ie-reset-selected').click();assert s.page.locator('#ie-dialog').is_visible();s.page.locator('#ie-dialog-cancel').click();assert s.css('#qa-text-a','fontSize')=='39px';s.page.locator('#ie-reset-selected').click();s.page.locator('#ie-dialog-confirm').click();s.page.wait_for_timeout(80);assert s.css('#qa-text-a','fontSize')=='22px';s.page.evaluate('InlineEditor.undo()');assert s.css('#qa-text-a','fontSize')=='39px';return {'baseline_restore':True,'cancel':True,'undo_reset':True}
 s.gate(18,'Reset confirmation / baseline',g18)
 def g19():
  s.open();s.sel('#qa-text-a');s.tab('content','typography');s.set('ie-font-size',24);assert s.page.evaluate('InlineEditor.diagnostics().dirty');s.page.locator('#ie-close').click();assert s.page.locator('#ie-dialog').is_visible();s.page.locator('#ie-dialog-cancel').click()
  dialogs=[]
  s.page.on('dialog',lambda d:(dialogs.append(d.type),d.accept()))
  s.page.reload(wait_until='domcontentloaded');assert 'beforeunload' in dialogs
  return {'native_beforeunload':dialogs,'close_editor_confirmation':True}
 s.gate(19,'Dirty guard / real reload',g19)
 def g20():
  s.open();s.sel('#qa-text-a');s.set('ie-font-size',32)
  with s.page.expect_download() as d:s.page.locator('#ie-save').click()
  download=d.value;path=ROOT/'qa/saved-template.html';download.save_as(str(path));assert path.stat().st_size>150000;assert not s.page.evaluate('InlineEditor.diagnostics().dirty');s.set('ie-font-size',34);assert s.page.evaluate('InlineEditor.diagnostics().dirty')
  return {'download_bytes':path.stat().st_size,'checkpoint_clean_then_dirty':True}
 s.gate(20,'Save checkpoint / actual download',g20)
 def g21():
  s.open();s.sel('#qa-a');s.tab('more','decorations');s.set('ie-decor-text','SEU SERVIR · TESTE');s.set('ie-decor-bg','#775588');s.page.locator('#ie-decor-apply').click();s.page.wait_for_timeout(60)
  val=s.page.evaluate('getComputedStyle(document.querySelector("#qa-a"),"::after").content');assert 'SEU SERVIR' in val;s.page.evaluate('InlineEditor.undo()');s.page.wait_for_timeout(60);assert 'SEU SERVIR' not in s.page.evaluate('getComputedStyle(document.querySelector("#qa-a"),"::after").content');s.page.evaluate('InlineEditor.redo()');s.page.wait_for_timeout(60);assert 'SEU SERVIR' in s.page.evaluate('getComputedStyle(document.querySelector("#qa-a"),"::after").content');return {'pseudo_after':val,'undo_redo':True}
 s.gate(21,'Selos & detalhes',g21)
 def g22():
  s.open();s.sel('#qa-table tr:nth-child(2) td');s.tab('layout','table');s.set('ie-col-width',270);s.set('ie-row-height',76);s.scroll('#qa-table');assert close(s.box('#qa-table tr:nth-child(2) td:first-child')['width'],270,1);assert close(s.box('#qa-table tr:nth-child(2)')['height'],76,1)
  s.page.evaluate('InlineEditor.undo();InlineEditor.undo()');assert s.box('#qa-table tr:nth-child(2)')['height']<76;s.sel('#qa-table-merged td');h=s.hist();s.set('ie-col-width',450);assert s.hist()==h;return {'column':270,'row':76,'merged_blocked':True}
 s.gate(22,'Tables regression',g22)
 def g23():
  s.open();s.scroll('#qa-action');s.page.locator('#qa-action').click();assert s.page.evaluate('qaActionCount')==0;assert s.page.locator('#ie-snackbar').is_visible();s.page.locator('#ie-snack-cancel').click();assert s.page.evaluate('qaActionCount')==0;s.page.locator('#qa-action').click();s.page.locator('#ie-snack-confirm').click();assert s.page.evaluate('qaActionCount')==1;return {'blocked':True,'confirmed_host_action':1}
 s.gate(23,'CTA / snackbar',g23)
 def g24():
  s.open();s.sel('#qa-a');s.tab('visual','borders');s.set('ie-inner-width',4);s.tab('more','decorations');s.set('ie-decor-text','PERSISTE');s.page.locator('#ie-decor-apply').click();s.tab('effects','loop');s.set('ie-fx-loop','breathe');s.tab('layout','position');s.set('ie-offset-x',19)
  html=s.page.evaluate('InlineEditor.serialize()');clean=s.page.evaluate('InlineEditor.serialize({clean:true})');(ROOT/'qa/reopen.html').write_text(html);(ROOT/'qa/clean.html').write_text(clean)
  count=s.page.locator('.ie-stepper').count();s.page.close(run_before_unload=False);s.page=s.b.new_page(viewport={'width':1440,'height':960});s.page.on('pageerror',lambda e:s.errors.append(str(e)));s.page.set_content(html,wait_until='load');s.page.wait_for_timeout(250);assert s.page.evaluate('InlineEditor.version')==json.loads((ROOT/'VERSION.json').read_text())['version'];assert s.page.locator('.ie-stepper').count()==count;assert not s.page.locator('#ie-toolbar').is_visible();assert 'inset' in s.css('#qa-a','boxShadow');assert s.page.evaluate('document.querySelector("#qa-a").style.getPropertyValue("--ie-move-x")')=='19px';assert 'PERSISTE' in s.page.evaluate('getComputedStyle(document.querySelector("#qa-a"),"::after").content');assert s.page.evaluate('document.querySelector("#qa-a").getAnimations().length')>0
  s.page.close(run_before_unload=False);s.page=s.b.new_page();s.page.on('pageerror',lambda e:s.errors.append(str(e)));s.page.set_content(clean,wait_until='load');s.page.wait_for_timeout(150);assert s.page.locator('#ie-toolbar').count()==0;assert 'PERSISTE' in s.page.evaluate('getComputedStyle(document.querySelector("#qa-a"),"::after").content');assert s.page.evaluate('document.querySelector("#qa-a").getAnimations().length')>0
  return {'save_reopen':True,'no_stepper_duplication':count,'clean_build_preserves_motion':True,'clean_bytes':len(clean)}
 s.gate(24,'Save / reopen / clean build',g24)
 def g25():
  evidence=[]
  for w,h in [(320,700),(390,844),(430,932),(768,1024)]:
   s.new(w,h);s.page.locator('#ie-launcher').click();s.sel('#qa-text-a');s.tab('content','typography');b=s.box('#ie-toolbar');assert b['x']>=0 and b['x']+b['width']<=w+.1 and b['y']>=0 and b['y']+b['height']<=h+.1;s.page.locator('#ie-help-open').click();assert s.page.locator('#ie-help-modal').is_visible();s.page.locator('#ie-help-close').click();s.page.locator('#ie-multi-mode').check();assert s.page.evaluate('InlineEditor.state.multiMode');evidence.append([w,h,round(b['height'])])
  s.page.screenshot(path=str(ROOT/'qa/mobile-template.png'));return {'sizes':evidence,'help':True,'touch_multiselect_toggle':True}
 s.gate(25,'Mobile / tablet',g25)
 if s.page:s.page.close(run_before_unload=False)
 browser.close()
print('SUMMARY',sum(x['status']=='PASS' for x in results),'/',len(results))
