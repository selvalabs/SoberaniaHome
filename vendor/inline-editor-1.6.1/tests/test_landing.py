from pathlib import Path
from bs4 import BeautifulSoup
import json,traceback,hashlib,os
from playwright.sync_api import sync_playwright
from PIL import Image,ImageChops,ImageDraw
R=Path(__file__).resolve().parents[1]
if not os.environ.get('IE_LANDING_ORIGINAL') or not os.environ.get('IE_LANDING_EDITABLE'):raise SystemExit('Defina IE_LANDING_ORIGINAL e IE_LANDING_EDITABLE com os caminhos dos dois HTMLs. Não usa o site demonstrativo.')
OLD=Path(os.environ['IE_LANDING_ORIGINAL']).read_text(encoding='utf-8');HTML=Path(os.environ['IE_LANDING_EDITABLE']).read_text(encoding='utf-8');rows=[]
B=(R/'tests/test_template.py').read_text(encoding='utf-8');ns={'__file__':str(R/'tests/test_template.py')};exec(B[:B.index('with sync_playwright() as p:')],ns);Suite=ns['Suite']
def record(name,fn):
 if os.environ.get('ONLY') and os.environ['ONLY'] not in name:return
 try:s.new();s.page.set_content(HTML,wait_until='load');s.page.wait_for_timeout(800);d=fn();assert not s.errors,s.errors;row={'test':name,'status':'PASS','measurements':d};print('PASS',name,flush=True)
 except Exception as e:row={'test':name,'status':'FAIL','error':str(e),'trace':traceback.format_exc(),'pageerrors':s.errors};print('FAIL',name,repr(e),flush=True)
 rows.append(row);(R/'qa/landing-results.json').write_text(json.dumps(rows,ensure_ascii=False,indent=2))
# Fresh-page loader (set_content twice on a live editor is not equivalent to reopening a file).
def fresh(self,w=1440,h=900):
 if self.page:self.page.close(run_before_unload=False)
 self.errors=[];self.page=self.b.new_page(viewport={'width':w,'height':h},accept_downloads=True);self.page.on('pageerror',lambda e:self.errors.append(str(e)));self.page.set_default_timeout(5000);return self.page
Suite.new=fresh
with sync_playwright() as p:
 try:b=p.chromium.launch(headless=True)
 except:b=p.chromium.launch(executable_path=os.environ.get('CHROMIUM_EXECUTABLE','/usr/bin/chromium'),headless=True,args=['--no-sandbox'])
 s=Suite(b)
 def composition():
  res=[]
  for w,h in [(1280,720),(1440,810),(1920,1080),(320,700),(390,844),(430,932),(768,1024)]:
   before=b.new_page(viewport={'width':w,'height':h},reduced_motion='reduce');before.set_content(OLD,wait_until='load');before.wait_for_timeout(450)
   after=b.new_page(viewport={'width':w,'height':h},reduced_motion='reduce');after.set_content(HTML,wait_until='load');after.wait_for_timeout(450)
   measure='''()=>({scroll:document.documentElement.scrollWidth,rects:['.hero','.hero h1','.hero-lead','.hero .button','.hero-system'].map(sel=>{const e=document.querySelector(sel),r=e.getBoundingClientRect();return [sel,getComputedStyle(e).display,...['x','y','width','height'].map(k=>r[k])]})})'''
   m1=before.evaluate(measure);m2=after.evaluate(measure);assert m1==m2,(w,m1,m2);assert m2['scroll']==w,(w,m2['scroll'])
   if w in [1440,390]:
    before.screenshot(path=str(R/f'qa/landing-baseline-{w}.png'));after.screenshot(path=str(R/f'qa/landing-preserved-{w}.png'));i1=Image.open(R/f'qa/landing-baseline-{w}.png').convert('RGB');i2=Image.open(R/f'qa/landing-preserved-{w}.png').convert('RGB');loc=after.locator('#ie-launcher').bounding_box();diff=ImageChops.difference(i1,i2);draw=ImageDraw.Draw(diff);draw.rectangle((max(0,loc['x']-20),max(0,loc['y']-20),w,h),fill=(0,0,0));count=sum(1 for rgb in diff.getdata() if max(rgb)>8);assert count/(w*h)<.001,(w,count);res.append({'viewport':[w,h],'host_identical':True,'pixel_difference_excluding_launcher':count})
   else:res.append({'viewport':[w,h],'host_identical':True})
   before.close();after.close()
  return res
 record('Responsive host preservation',composition)
 def media():
  s.open();s.scroll('.device-imac');s.page.wait_for_timeout(700);s.sel('.device-imac');s.tab('layout','size');r0=s.box('.device-imac');live,end=s.drag('[data-dir=se]',-65,-20);assert max(abs(live[0][k]-end[0][k]) for k in ['w','h','x','y'])<.2
  r1=s.box('.device-imac');s.tab('layout','position');s.page.locator('#ie-free-move').check();live,end=s.drag('#ie-move-handle',-35,25,shift=False);r2=s.box('.device-imac');assert abs(r1['width']-r2['width'])<.1 and abs(r1['height']-r2['height'])<.1;assert max(abs(live[0][k]-end[0][k]) for k in ['w','h','x','y'])<.2
  s.tab('layout','alignment');s.page.locator('#ie-align-center').click();r3=s.box('.device-imac');assert abs(r3['width']-r2['width'])<.1
  for _ in range(3):s.page.evaluate('InlineEditor.undo()');s.page.wait_for_timeout(50)
  back=s.box('.device-imac');assert abs(back['width']-r0['width'])<.1
  for _ in range(3):s.page.evaluate('InlineEditor.redo()');s.page.wait_for_timeout(50)
  forward=s.box('.device-imac');assert abs(forward['width']-r3['width'])<.1
  s.tab('layout','size');s.page.screenshot(path=str(R/'qa/landing-media.png'));return {'initial':r0,'resized':r1,'moved':r2,'aligned':r3,'release_jump':0,'undo_redo_x3':True}
 record('Real mockup resize move align undo redo',media)
 def svg():
  s.open();s.page.evaluate('document.querySelector(".asset-flower-svg").scrollIntoView({block:"center",behavior:"instant"})');s.page.wait_for_timeout(500);s.sel('.asset-flower-svg');name=s.css('.asset-flower-svg','animationName');assert name not in ['none',''];s.tab('layout','position');s.page.locator('#ie-free-move').check();s.drag('#ie-move-handle',-28,0);assert s.css('.asset-flower-svg','animationName')==name
  s.tab('effects','hover');s.set('ie-fx-hover','scale');s.page.locator('#ie-fx-hover-preview').click();assert s.css('.asset-flower-svg','animationName')==name;return {'host_animation_preserved':name,'svg_movement':True}
 record('Animated real SVG preserved',svg)
 def decor():
  s.open();s.scroll('.audience-photo');s.sel('.audience-photo');orig=s.page.evaluate('getComputedStyle(document.querySelector(".audience-photo"),"::after").content');s.tab('more','decorations');assert 'SEU' in s.page.locator('#ie-decor-text').input_value().upper();s.set('ie-decor-text','SEU SERVIR · TESTE DE EDIÇÃO');s.page.locator('#ie-decor-apply').click();s.page.wait_for_timeout(70);assert 'EDIÇÃO' in s.page.evaluate('getComputedStyle(document.querySelector(".audience-photo"),"::after").content');s.page.evaluate('InlineEditor.undo()');s.page.wait_for_timeout(70);assert s.page.evaluate('getComputedStyle(document.querySelector(".audience-photo"),"::after").content')==orig;return {'original_read':orig,'edit_undo':True}
 record('Real decorative ribbon',decor)
 def batch():
  s.open();selectors=['.module-list div:nth-child(1)','.module-list div:nth-child(2)','.module-list div:nth-child(3)'];s.scroll('.module-list');s.many(selectors);s.tab('content','typography');s.set('ie-font-size',18);assert all(s.css(q,'fontSize')=='18px' for q in selectors);s.tab('visual','opacity');s.set('ie-opacity',80);assert all(s.css(q,'opacity')=='0.8' for q in selectors);s.page.evaluate('InlineEditor.undo();InlineEditor.undo()');return {'batch_targets':3,'style_overrides':True}
 record('Real batch formatting',batch)
 def cta():
  s.open();s.scroll('.hero .button');s.page.wait_for_timeout(150);y=s.page.evaluate('scrollY');s.page.locator('.hero .button').click();s.page.wait_for_timeout(400);assert abs(s.page.evaluate('scrollY')-y)<1;assert s.page.locator('#ie-snackbar').is_visible();s.page.locator('#ie-snack-confirm').click();s.page.wait_for_timeout(1400);assert s.page.evaluate('scrollY')>2000;return {'host_scroll_blocked_until_confirm':True,'scroll_destination':s.page.evaluate('scrollY')}
 record('Real host CTA intercepted and confirmed',cta)
 def reopen():
  expected_steppers=s.page.locator('.ie-stepper').count()
  s.open();s.scroll('.device-imac');s.sel('.device-imac');s.tab('layout','size');s.set('ie-width',340);s.set('ie-height',250);s.tab('layout','position');s.set('ie-offset-x',-12);s.tab('effects','hover');s.set('ie-fx-hover','brighten')
  with s.page.expect_download() as info:s.page.locator('#ie-save').click()
  d=info.value;dest=R/'qa/landing-edited-reopen.html';d.save_as(str(dest));assert not s.page.evaluate('InlineEditor.diagnostics().dirty');s.new();s.page.set_content(dest.read_text(),wait_until='load');s.page.wait_for_timeout(500);assert s.css('.device-imac','width')=='340px';assert s.css('.device-imac','height')=='250px';assert s.page.locator('#ie-toolbar').count()==1 and not s.page.locator('#ie-toolbar').is_visible();assert s.page.locator('.ie-stepper').count()==expected_steppers;assert s.page.locator('.hero').count()==1;return {'download_bytes':dest.stat().st_size,'width':340,'height':250,'reopen_editor_off':True,'images_ok':s.page.evaluate('[...document.images].every(i=>i.complete&&i.naturalWidth>0)')}
 record('Full landing save real download reopen',reopen)
 def visualchecks():
  viewports=[]
  for w,h in [(1440,900),(390,844),(320,700)]:
   s.new(w,h);s.page.set_content(HTML,wait_until='load');s.page.wait_for_timeout(400);s.page.locator('#ie-launcher').click();s.sel('.hero h1');s.tab('content','typography');tb=s.box('#ie-toolbar');assert tb['x']>=0 and tb['y']>=0 and tb['x']+tb['width']<=w+.5 and tb['y']+tb['height']<=h+.5
   assert s.page.locator('#ie-toolbar [title]').count()==0
   s.page.screenshot(path=str(R/f'qa/editor-{w}.png'));viewports.append([w,h,round(tb['width']),round(tb['height'])])
  return {'toolbox_bounds':viewports,'styled_tooltips_only':True}
 record('Full landing mobile and desktop editor',visualchecks)
 ua=s.page.evaluate('navigator.userAgent');s.page.close(run_before_unload=False);b.close()
result={'gate':26,'name':'Smoke da landing oficial','status':'PASS' if all(x['status']=='PASS' for x in rows) else 'FAIL','browser':ua,'subtests':rows}
(R/'qa/final-26.json').write_text(json.dumps(result,ensure_ascii=False,indent=2));print('SUMMARY',sum(x['status']=='PASS' for x in rows),'/',len(rows),flush=True)
