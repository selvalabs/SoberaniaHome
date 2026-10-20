"""Marquee continuity, pause, static reading and unchanged portfolio navigation."""
from playwright.sync_api import sync_playwright
import argparse
parser=argparse.ArgumentParser();parser.add_argument('--url',default='http://127.0.0.1:4198/');args=parser.parse_args()
with sync_playwright() as pw:
 b=pw.chromium.launch()
 for w,h in [(1440,900),(390,844),(320,568),(844,390)]:
  q=b.new_page(viewport={'width':w,'height':h});errors=[];q.on('pageerror',lambda e:errors.append(str(e)))
  q.goto(args.url,wait_until='networkidle');q.wait_for_function('window.__SL_DEBUG?.ready')
  marquee=q.locator('[data-work-marquee]');marquee.scroll_into_view_if_needed();q.mouse.move(2,2)
  q.wait_for_function('document.querySelector("[data-work-marquee]").dataset.marqueeVisible==="true"')
  track=q.locator('.work-marquee-track');button=q.locator('.work-marquee-toggle')
  assert q.locator('#trabalho h2').count()==1
  assert q.locator('#trabalho h2').inner_text()=='Do conhecimento à construção.'
  groups=q.locator('.work-marquee-group').evaluate_all('(es)=>es.map(e=>e.getBoundingClientRect().width)')
  assert max(groups)-min(groups)<1,groups
  assert sum(groups)>w,groups
  assert q.locator('#trabalho .work-intro').evaluate('(e)=>!!(e.compareDocumentPosition(document.querySelector("#trabalho .portfolio-sequence"))&Node.DOCUMENT_POSITION_FOLLOWING)')
  t=track.evaluate('(e)=>getComputedStyle(e).transform');q.wait_for_timeout(200)
  assert track.evaluate('(e)=>getComputedStyle(e).transform')!=t,'marquee not moving'
  q.locator('.work-marquee-window').hover();q.wait_for_timeout(250)
  assert track.evaluate('(e)=>e.getAnimations()[0].playbackRate')>2
  q.mouse.move(2,2);q.wait_for_timeout(250)
  assert track.evaluate('(e)=>e.getAnimations()[0].playbackRate')==1
  button.click();q.mouse.move(2,2);button.evaluate('(e)=>e.blur()');q.wait_for_timeout(100)
  assert button.get_attribute('aria-pressed')=='true'
  t=track.evaluate('(e)=>getComputedStyle(e).transform');q.wait_for_timeout(180)
  assert track.evaluate('(e)=>getComputedStyle(e).transform')==t
  button.click();q.mouse.move(2,2);button.evaluate('(e)=>e.blur()');q.wait_for_timeout(180)
  assert track.evaluate('(e)=>getComputedStyle(e).animationPlayState')=='running'
  q.screenshot(path=f'.playwright/marquee-{w}.png')
  q.evaluate('SLMotion.jumpScene("trabalho",2)');q.wait_for_timeout(350)
  assert q.evaluate('__SL_DEBUG.scenes.find(s=>s.id==="trabalho").lastIndex')==2
  q.evaluate('SLMotion.setReading(true)');q.wait_for_timeout(300)
  assert track.evaluate('(e)=>getComputedStyle(e).animationName')=='none'
  q.evaluate('SLMotion.setReading(false)');q.emulate_media(reduced_motion='reduce');q.wait_for_timeout(300)
  assert track.evaluate('(e)=>getComputedStyle(e).animationName')=='none'
  assert q.evaluate('document.documentElement.scrollWidth<=innerWidth')
  assert q.locator('#trabalho .portfolio-card').count()==4
  assert not errors,errors
  print('PASS marquee',w,h,flush=True);q.close()
 q=b.new_page(java_script_enabled=False,viewport={'width':320,'height':568});q.goto(args.url)
 assert all(e.is_hidden() for e in q.locator('.work-marquee-group[aria-hidden="true"]').all())
 assert q.locator('#trabalho h2').evaluate('(e)=>getComputedStyle(e).whiteSpace')=='normal'
 assert q.evaluate('document.documentElement.scrollWidth<=innerWidth')
 print('PASS marquee no-JS',flush=True);b.close()
