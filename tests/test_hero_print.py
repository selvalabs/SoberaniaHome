"""Sequential whole-block reveal, pin duration, responsive framing and fallbacks."""
from playwright.sync_api import sync_playwright
import argparse
parser=argparse.ArgumentParser();parser.add_argument('--url',default='http://127.0.0.1:4198/');args=parser.parse_args()
with sync_playwright() as pw:
 b=pw.chromium.launch()
 for w,h in [(1440,900),(390,844),(844,390),(320,568)]:
  page=b.new_page(viewport={'width':w,'height':h});errors=[]
  page.on('pageerror',lambda e:errors.append(str(e)))
  page.goto(args.url,wait_until='networkidle');page.wait_for_function('window.__SL_DEBUG?.ready')
  original=page.locator('.hero-message').inner_text()
  def values():return page.locator('[data-print-progress]').evaluate_all('(es)=>es.map(e=>Number(e.dataset.printProgress))')
  start,run=page.locator('#hero').evaluate('(e)=>[+e.dataset.printStart,+e.dataset.printRun]')
  assert run>=1800
  assert page.locator('#hero').get_attribute('data-print-pinned')=='true'
  def go(p):
   y=round(start+run*p);page.evaluate('(y)=>scrollTo({top:y,behavior:"instant"})',y)
   page.wait_for_function('(y)=>Math.abs(__SL_DEBUG.scroll-y)<2',arg=y);page.wait_for_timeout(120)
  go(0)
  buttons=page.locator('#hero .text-actions')
  initial_button_y=buttons.bounding_box()['y']
  title=page.locator('#cover-title').bounding_box()
  assert 0<=initial_button_y-(title['y']+title['height'])<70,'buttons are not below headline'
  assert page.locator('#hero .text-actions a').all_text_contents()==['Ver o que fazemos','Ler o manifesto']
  for link in page.locator('#hero .text-actions a').all():
   assert link.evaluate('(e)=>parseFloat(getComputedStyle(e).fontSize)')>=15
  for progress,active in [(.19,0),(.50,1),(.81,2)]:
   go(progress);states=values()
   assert 0<states[active]<1,states
   assert states[:active]==[1]*active and states[active+1:]==[0]*(2-active),states
   r=page.locator('[data-print-progress]').nth(active).bounding_box()
   assert r['y']>=-2 and r['y']+r['height']<=h+2,(w,h,progress,r)
   if w==1440 and active==0: assert buttons.bounding_box()['y']>initial_button_y+15,'text did not push buttons'
   stage=page.locator('.hero-stage').bounding_box()
   assert stage['y']+stage['height']>=h-50,(w,h,stage)
  go(.96);assert values()==[1,1,1]
  stage=page.locator('.hero-stage').bounding_box()
  go(.99);assert abs(stage['y']-page.locator('.hero-stage').bounding_box()['y'])<2,'released before final reading pause'
  go(.50);middle=values();y=page.evaluate('scrollY')
  page.evaluate("document.dispatchEvent(new CustomEvent('sl:layout-change'))");page.wait_for_timeout(350)
  assert abs(page.evaluate('scrollY')-y)<2,'remeasure jumped'
  assert values()==middle
  assert page.locator('.hero-message').inner_text()==original
  if w==1440: assert page.locator('.eyebrow-lab').bounding_box()['y']>0
  assert page.locator('.brand-signature .eyebrow-tech-label').get_attribute('data-scroll-glow')=='true'
  page.screenshot(path=f'.playwright/print-sequential-{w}.png')
  page.evaluate('SLMotion.setReading(true)');page.wait_for_timeout(300)
  assert values()==[1,1,1] and page.locator('#hero').get_attribute('data-print-pinned')=='false'
  page.evaluate('SLMotion.setReading(false)');page.emulate_media(reduced_motion='reduce');page.wait_for_timeout(300)
  assert values()==[1,1,1]
  page.emulate_media(reduced_motion='no-preference');page.set_viewport_size({'width':390,'height':600});page.wait_for_timeout(400)
  assert page.locator('#hero').get_attribute('data-print-pinned')=='true'
  assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
  frames=page.evaluate('__SL_DEBUG.metrics.frames');page.wait_for_timeout(350)
  assert frames==page.evaluate('__SL_DEBUG.metrics.frames'),'idle render loop'
  assert not errors,errors
  print('PASS sequential print',w,h,flush=True);page.close()
 page=b.new_page(java_script_enabled=False);page.goto(args.url)
 assert page.locator('.hero-argument').evaluate('(e)=>getComputedStyle(e).clipPath')=='none'
 assert 'decidir seu futuro' in page.locator('.hero-message').inner_text()
 print('PASS no JS',flush=True);b.close()
