"""Hero print: scroll reversal, fitting, accessibility and label glow."""
from playwright.sync_api import sync_playwright
import argparse
parser=argparse.ArgumentParser();parser.add_argument('--url',default='http://127.0.0.1:4198/');args=parser.parse_args()
with sync_playwright() as pw:
 b=pw.chromium.launch()
 for w,h in [(1440,900),(390,844),(844,390),(320,568)]:
  page=b.new_page(viewport={'width':w,'height':h});errors=[]
  page.on('pageerror',lambda e:errors.append(str(e)))
  page.goto(args.url,wait_until='networkidle');page.wait_for_function('window.__SL_DEBUG?.ready')
  def values():return page.locator('[data-print-progress]').evaluate_all('(es)=>es.map(e=>Number(e.dataset.printProgress))')
  original=page.locator('.hero-message').inner_text()
  assert 'sociedade mais justa' in original and 'decidir seu futuro' in original
  initial=values();assert min(initial)<1
  headline=page.locator('#cover-title').inner_text();assert 'humanidade' in headline
  assert page.locator('#hero').get_attribute('data-print-pinned')==('true' if w==1440 else 'false')
  label=page.locator('.brand-signature .eyebrow-tech');anchor=label.bounding_box()
  page.evaluate('scrollTo({top:400,behavior:"instant"})');page.wait_for_function('Math.abs(__SL_DEBUG.scroll-400)<2');page.wait_for_timeout(120)
  middle=values();assert sum(middle)>sum(initial),(w,h,initial,middle,page.evaluate("scrollY"))
  assert abs(page.evaluate('scrollY')-400)<2,'scroll anchor jumped'
  page.evaluate("document.dispatchEvent(new CustomEvent('sl:layout-change'))");page.wait_for_timeout(350)
  assert abs(page.evaluate('scrollY')-400)<2,'remeasure jumped'
  clip=page.locator('.hero-argument').evaluate('(e)=>e.style.clipPath')
  if w==1440:
   assert page.locator('.eyebrow-lab').bounding_box()['y']>0
   assert page.locator('.brand-signature .eyebrow-tech-label').get_attribute('data-scroll-glow')=='true'
  page.evaluate('scrollTo(0,1150)');page.wait_for_timeout(300)
  assert values()==[1,1,1],values()
  assert page.locator('.hero-message').inner_text()==original
  page.evaluate('scrollTo({top:400,behavior:"instant"})');page.wait_for_function('Math.abs(__SL_DEBUG.scroll-400)<2');page.wait_for_timeout(120)
  assert values()==middle
  assert page.locator('.hero-argument').evaluate('(e)=>e.style.clipPath')==clip
  assert abs(label.bounding_box()['y']-anchor['y'])<1
  page.evaluate('scrollTo(0,0)');page.wait_for_timeout(300)
  page.locator('[data-theme-toggle]').click();page.wait_for_timeout(300)
  page.screenshot(path=f'.playwright/print-dark-{w}.png')
  page.evaluate('SLMotion.setReading(true)');page.wait_for_timeout(300)
  assert values()==[1,1,1]
  assert page.locator('#hero').get_attribute('data-print-pinned')=='false'
  page.evaluate('SLMotion.setReading(false)');page.emulate_media(reduced_motion='reduce');page.wait_for_timeout(300)
  assert values()==[1,1,1]
  page.emulate_media(reduced_motion='no-preference');page.set_viewport_size({'width':390,'height':600});page.wait_for_timeout(400)
  assert page.locator('#hero').get_attribute('data-print-pinned')=='false'
  assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
  frames=page.evaluate('__SL_DEBUG.metrics.frames');page.wait_for_timeout(300)
  assert frames==page.evaluate('__SL_DEBUG.metrics.frames'),'idle render loop'
  assert not errors,errors
  print('PASS hero print',w,h,flush=True);page.close()
 page=b.new_page(java_script_enabled=False);page.goto(args.url)
 assert page.locator('.hero-argument').evaluate('(e)=>getComputedStyle(e).clipPath')=='none'
 assert 'decidir seu futuro' in page.locator('.hero-message').inner_text()
 print('PASS no JS',flush=True);b.close()

