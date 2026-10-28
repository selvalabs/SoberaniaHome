"""Inline demo: nearby action, expanded panel and unchanged portable exports."""
import argparse
from pathlib import Path
from urllib.parse import urljoin
from playwright.sync_api import sync_playwright

parser=argparse.ArgumentParser();parser.add_argument('--url',default='http://127.0.0.1:4198/');args=parser.parse_args()
url=urljoin(args.url,'demos/editor-editavel.html')
Path('.playwright').mkdir(exist_ok=True)
with sync_playwright() as pw:
 b=pw.chromium.launch()
 for w,h in [(1920,1080),(1440,900),(1180,720),(1024,768),(768,1024),(390,844),(320,568),(844,390)]:
  q=b.new_page(viewport={'width':w,'height':h},accept_downloads=True);errors=[]
  q.on('pageerror',lambda e:errors.append(str(e)))
  q.add_init_script('''localStorage.setItem('ie-v15-minimized','true');localStorage.setItem('ie-v15-position',JSON.stringify({x:9999,y:-500}))''')
  response=q.goto(url,wait_until='networkidle');assert response.status==200
  q.wait_for_function('document.querySelector("#demo-editor-slot")?.dataset.ready==="true"')
  bar=q.locator('#ie-toolbar');button=q.locator('#ie-launcher')
  assert q.locator('#ie-launcher').count()==1 and q.locator('#ie-toolbar').count()==1
  assert bar.is_visible() and 'ie-minimized' not in (bar.get_attribute('class') or '')
  assert bar.locator('.ie-tool-content').is_visible() and button.get_attribute('aria-expanded')=='true'
  assert not q.evaluate('InlineEditor.diagnostics().dirty'),'layout adapter dirtied the document'
  assert q.evaluate('document.documentElement.scrollWidth<=innerWidth')
  r=bar.bounding_box();assert r['x']>=0 and r['x']+r['width']<=w+1,(w,h,r)
  if w>=1180:
   copy=q.locator('.demo-copy').bounding_box();leaf=q.locator('.intro>figure').bounding_box();action=button.bounding_box()
   assert copy['x']+copy['width']<=action['x'] and action['x']+action['width']<=leaf['x']
   assert r['x']>=copy['x']+copy['width'] and r['x']+r['width']<=leaf['x']
   assert r['y']>=action['y']+action['height']
  button.click();assert bar.is_hidden() and button.get_attribute('aria-expanded')=='false'
  button.click();assert bar.is_visible() and 'ie-minimized' not in (bar.get_attribute('class') or '')
  bar.locator('#ie-minimize').click();assert 'ie-minimized' in bar.get_attribute('class')
  button.click();button.click();assert 'ie-minimized' not in (bar.get_attribute('class') or '')
  if h<540:
   q.evaluate('InlineEditor.select(document.querySelector("#sample-title"))')
   assert bar.locator('.ie-main-panel:not([hidden]) .ie-pane-scroller').evaluate('e=>e.clientHeight')>80,'short viewport clips the editing controls'
  if w==1440:
   # A deliberate drag still works; reopening restores the docked composition.
   head=bar.locator('#ie-drag-handle').bounding_box();before=bar.bounding_box()
   q.mouse.move(head['x']+24,head['y']+15);q.mouse.down();q.mouse.move(head['x']-80,head['y']+80,steps=5);q.mouse.up()
   assert q.locator('#demo-editor-slot').get_attribute('data-floating')=='true'
   assert abs(bar.bounding_box()['x']-before['x'])>40
   button.click();button.click();assert q.locator('#demo-editor-slot').get_attribute('data-floating')=='false'
   # Real edit, undo and edit again; serialization must preserve the new text.
   title=q.locator('#sample-title');original=title.inner_text()
   q.evaluate('InlineEditor.select(document.querySelector("#sample-title"))')
   title.click();q.keyboard.press('ControlOrMeta+A');q.keyboard.insert_text('Uma ferramenta para criar com autonomia.')
   q.wait_for_timeout(100)
   assert title.inner_text()=='Uma ferramenta para criar com autonomia.'
   q.evaluate('InlineEditor.undo()');assert title.inner_text()==original
   q.evaluate('InlineEditor.redo()');assert 'autonomia' in title.inner_text()
   editable=q.evaluate('InlineEditor.serialize()');clean=q.evaluate('InlineEditor.serialize({clean:true})')
   assert 'data-demo-editor-autostart' not in editable.split('<body',1)[1].split('>',1)[0]
   Path('.playwright/editor-demo-edited.html').write_text(editable,encoding='utf-8')
   offline=b.new_page(viewport={'width':1440,'height':900});offline_errors=[]
   offline.on('pageerror',lambda e:offline_errors.append(str(e)))
   offline.set_content(editable,wait_until='load')
   try:offline.wait_for_function('document.querySelector("#demo-editor-slot")?.dataset.ready==="true"')
   except Exception:
    print('Editable reload diagnostic',offline_errors,offline.evaluate('({api:!!window.InlineEditor,slot:document.querySelector("#demo-editor-slot")?.outerHTML.slice(0,200),boot:document.querySelector("#ie-toolbar")?.dataset.ieBooted})'),flush=True)
    raise
   assert offline.locator('#ie-toolbar').is_hidden(),'saved editable unexpectedly opens itself'
   assert offline.locator('#ie-launcher').is_visible() and 'autonomia' in offline.locator('#sample-title').inner_text()
   offline.locator('#ie-launcher').click();assert offline.locator('#ie-toolbar').is_visible()
   final=b.new_page(java_script_enabled=False,viewport={'width':390,'height':844});final.set_content(clean)
   assert final.locator('[data-ie-runtime]').count()==0
   assert final.locator('#ie-toolbar,#ie-launcher,#demo-editor-slot').count()==0
   assert 'autonomia' in final.locator('#sample-title').inner_text()
   assert final.locator('#sample-image').evaluate('async e=>{await e.decode();return e.naturalWidth>0}')
   assert final.evaluate('document.documentElement.scrollWidth<=innerWidth')
   final.screenshot(path='.playwright/editor-demo-clean.png',full_page=True)
   offline.close();final.close()
  if w in [1440,390]:q.screenshot(path=f'.playwright/editor-demo-layout-{w}.png',full_page=True)
  assert not errors,errors
  print('PASS editor demo layout',w,h,flush=True);q.close()
 q=b.new_page(java_script_enabled=False,viewport={'width':390,'height':844});q.goto(url)
 assert q.locator('#sample-title').is_visible() and q.locator('#sample-image').is_visible()
 assert q.locator('#ie-launcher').is_hidden()
 assert q.evaluate('document.documentElement.scrollWidth<=innerWidth')
 print('PASS editor demo without JS',flush=True);b.close()
