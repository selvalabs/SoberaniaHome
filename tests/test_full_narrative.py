"""All chapters retain their instruments, optional depth and accessible reading paths."""
import argparse
from pathlib import Path
from playwright.sync_api import sync_playwright
parser=argparse.ArgumentParser();parser.add_argument('--url',default='http://127.0.0.1:4205/');args=parser.parse_args()
IDS=['hero','folha','meios-digitais','trabalho','deslocamento-2','processo','laboratorio','deslocamento-1','editor','soberania','espiral','sobre','manifesto','referencias','caderno','possibilidades','contato']
with sync_playwright() as pw:
 browser=pw.chromium.launch()
 for width,height in [(1440,900),(390,844),(320,568),(844,390)]:
  q=browser.new_page(viewport={'width':width,'height':height},has_touch=width<760,accept_downloads=True);errors=[];q.on('pageerror',lambda e:errors.append(str(e)))
  q.goto(args.url,wait_until='networkidle');q.wait_for_function('window.__SL_DEBUG?.ready');q.evaluate('document.fonts.ready');q.wait_for_timeout(220)
  assert q.locator('main>section[data-number]').evaluate_all('es=>es.map(e=>e.id)')==IDS
  assert q.locator('[data-landing-ink]').count()==5
  assert q.locator('.process-node').count()==6 and q.locator('[data-orbit-node]').count()==9
  assert q.locator('#trabalho .portfolio-card').count()==4 and q.locator('#laboratorio .portfolio-card').count()==5
  assert q.locator('.manifesto-compass').is_visible() and q.locator('.pile-leaf').count()>=30
  for sid in IDS:
   q.evaluate('(sid)=>SLMotion.jumpSection(sid)',sid)
   q.wait_for_function('(sid)=>__SL_DEBUG.activeId===sid',arg=sid)
   if sid!='trabalho':
    r=q.locator('#'+sid+' h1,#'+sid+' h2').first.bounding_box();assert r['x']>=-1 and r['x']+r['width']<=width+1,(sid,width,r)
   assert q.evaluate('document.documentElement.scrollWidth<=innerWidth'),(sid,width,'horizontal overflow')
  # Restored compass: real selection, finite rotation, keyboard and complete reading link.
  q.evaluate("SLMotion.jumpSection('manifesto')")
  q.wait_for_function("__SL_DEBUG.activeId==='manifesto'")
  assert q.locator('.manifesto-compass').is_visible()
  # Palette contrast is checked in both themes; the compass section stays dark.
  for theme in ['light','dark']:
   q.evaluate('(theme)=>document.documentElement.dataset.theme=theme',theme)
   contrast=q.locator('.manifesto-readout .journal-read').first.evaluate(r'''e=>{const rgb=s=>s.match(/[\d.]+/g).slice(0,3).map(Number).map(v=>{v/=255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4});const lum=s=>rgb(s).reduce((a,v,i)=>a+v*[.2126,.7152,.0722][i],0);const a=lum(getComputedStyle(e).color),b=lum(getComputedStyle(e.closest('section')).backgroundColor);return (Math.max(a,b)+.05)/(Math.min(a,b)+.05)}''')
   assert contrast>=4.5,('manifesto reading link contrast',theme,contrast)
  first=q.locator('.manifesto-tabs a').first;first.focus();first.press('End')
  assert q.locator('.manifesto-tabs a').last.get_attribute('aria-selected')=='true'
  assert q.locator('[data-manifesto-number]').inner_text()=='10'
  assert q.locator('.manifesto-readout article:visible').count()==1
  assert q.locator('.manifesto-compass').evaluate('e=>e.style.getPropertyValue("--compass-angle")')=='324deg'
  # The original delivery documents were retained, not removed for concision.
  inspector=q.locator('.handover-inspector');inspector.locator('summary').first.click();q.wait_for_timeout(220)
  for i in range(3):
   q.locator('.handover-tabs a').nth(i).click();assert q.locator('.handover-document:visible').count()==1
  # Each sovereign route still changes its path and short readout.
  for i,key in enumerate(['hospedar','migrar','integrar']):
   q.locator('.route-tabs a').nth(i).click();assert q.locator('.sovereign-instrument').get_attribute('data-active')==key
   assert q.locator('.route-panel:visible').count()==1
  # The Caderno can grow without expanding every article into the landing.
  before=q.evaluate('document.documentElement.scrollHeight')
  assert q.locator('.journal-library details[open]').count()==0
  q.locator('.journal-library summary').first.click();q.wait_for_timeout(300)
  assert q.evaluate('document.documentElement.scrollHeight')>before
  assert q.evaluate('Math.abs(__SL_DEBUG.maxScroll-(document.documentElement.scrollHeight-innerHeight))<2')
  # Prepared proposals remain complete even though their steps are progressive disclosures.
  q.locator('[data-atelier-example]').click();q.locator('[data-atelier-form] button[type=submit]').click()
  q.wait_for_function('document.querySelector("[data-atelier-export]").hidden===false')
  assert q.locator('[data-atelier-steps] details[open]').count()==1
  q.locator('[data-atelier-steps] summary').nth(1).click()
  assert q.locator('[data-atelier-steps] details[open]').count()==1
  with q.expect_download() as download:q.locator('[data-atelier-export]').click()
  content=Path(download.value.path()).read_text(encoding='utf-8');assert '1.' in content and '2.' in content and '3.' in content
  assert 'controle' in content.lower() and 'não' in q.locator('[data-atelier-privacy]').inner_text().lower()
  q.wait_for_timeout(400);frames=q.evaluate('__SL_DEBUG.metrics.frames');q.wait_for_timeout(220);assert frames==q.evaluate('__SL_DEBUG.metrics.frames'),'perpetual animation loop'
  q.evaluate('SLMotion.setReading(true)');q.wait_for_function('!__SL_DEBUG.enabled')
  assert q.locator('[data-generated-complete]').evaluate_all('es=>es.every(e=>e.getAttribute("opacity")==="1")')
  assert not errors,errors
  print('PASS all 17 chapters and preserved instruments',width,height,flush=True);q.close()
 q=browser.new_page(java_script_enabled=False,viewport={'width':320,'height':480});q.goto(args.url)
 assert q.evaluate('document.documentElement.scrollWidth<=innerWidth')
 assert q.locator('#caderno .journal-library a').count()>=19
 q.locator('.handover-inspector>summary').click();assert q.locator('.handover-document:visible').count()==3
 assert q.locator('.manifesto-readout article:visible').count()==10
 assert q.locator('[data-atelier-steps] details').count()==3
 assert q.locator('[data-atelier-form] button[type=submit]').is_disabled()
 print('PASS complete no-JS content and safe controls',flush=True);browser.close()
