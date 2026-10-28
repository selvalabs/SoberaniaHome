"""Mobile sticky process stack and independently scrollable phone previews."""
import argparse
from playwright.sync_api import sync_playwright
parser=argparse.ArgumentParser();parser.add_argument('--url',default='http://127.0.0.1:4201/');args=parser.parse_args()
with sync_playwright() as p:
 b=p.chromium.launch()
 for width,height in [(320,568),(390,844),(430,932)]:
  q=b.new_page(viewport={'width':width,'height':height},is_mobile=True,has_touch=True);errors=[]
  q.on('pageerror',lambda e:errors.append(str(e)))
  q.goto(args.url,wait_until='networkidle');q.wait_for_function('window.__SL_DEBUG?.ready')
  poses=[]
  for progress in [0,.5,.98]:
   q.evaluate('(p)=>{const s=__SL_DEBUG.scenes.find(s=>s.id==="processo");scrollTo(0,s.start+(s.end-s.start)*p)}',progress);q.wait_for_timeout(250)
   intro=q.locator('#processo .process-intro').bounding_box();head=q.locator('#processo .scene-head').bounding_box();board=q.locator('#processo .process-periphery').bounding_box()
   assert 0<=intro['y']<100 and intro['y']+intro['height']<=head['y']+2,(width,progress,intro,head)
   assert head['y']+head['height']<=board['y']+2
   assert board['y']+board['height']<height-80
   poses.append(q.locator('[data-process-piece="5"]').evaluate('(e)=>getComputedStyle(e).transform'))
  assert poses[0]!=poses[-1], 'Pieces must travel to their fitted position'
  q.evaluate('SLMotion.jumpScene("laboratorio",0)');q.wait_for_timeout(1000)
  rail=q.locator('.landing-phone-rail');hint=q.locator('.landing-phone-scroll-hint')
  assert hint.count()==1 and hint.locator('xpath=ancestor::*[contains(@class,"landing-phone-rail")]').count()==0
  rect=q.locator('.landing-phone-frame').first.bounding_box();assert 1.95<rect['height']/rect['width']<2.15,rect
  phone=q.locator('.landing-phone-screen').first;phone.evaluate('(e)=>e.scrollTop=150');assert phone.evaluate('(e)=>e.scrollTop')>=149
  before=hint.bounding_box()['x'];rail.evaluate('(e)=>e.scrollLeft=300');q.wait_for_timeout(100);assert abs(hint.bounding_box()['x']-before)<1
  assert q.locator('.landing-phone-heading strong',has_text='ELARA').count()==1
  assert q.locator('.landing-phone-heading strong').first.inner_text()=='ELARA'
  elara=q.locator('.landing-phone-card').filter(has=q.locator('.landing-phone-heading strong',has_text='ELARA'))
  elara.evaluate('(e)=>e.parentElement.scrollLeft=e.offsetLeft');q.wait_for_timeout(300)
  image=elara.locator('img').first;image.wait_for();q.wait_for_function('(e)=>e.complete&&e.naturalWidth===390',arg=image.element_handle())
  assert elara.locator('.landing-phone-screen').evaluate('(e)=>e.scrollHeight>e.clientHeight*2')
  assert not errors,errors
  print('PASS mobile process/gallery',width,height,flush=True);q.close()
 b.close()
