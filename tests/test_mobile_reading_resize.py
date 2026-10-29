"""Changing mobile browser height must not lose a paragraph or focused field."""
import argparse
from playwright.sync_api import sync_playwright
parser=argparse.ArgumentParser();parser.add_argument('--url',default='http://127.0.0.1:4198/');args=parser.parse_args()
with sync_playwright() as pw:
 browser=pw.chromium.launch()
 for w,h,next_height in [(390,844,600),(360,640,740)]:
  q=browser.new_page(viewport={'width':w,'height':h},is_mobile=True,has_touch=True)
  q.goto(args.url,wait_until='networkidle');q.wait_for_function('window.__SL_DEBUG?.ready')
  q.wait_for_timeout(300)
  for selector in ['#deslocamento-2 .scene-narration p[data-current=true]','#sobre .about-copy p','.journal-featured h3','#footer .footer-details p']:
   target=q.locator(selector).first
   if selector=='#deslocamento-2 .scene-narration p[data-current=true]':
    section=q.locator('#deslocamento-2')
    section.evaluate('(e)=>scrollTo({top:+e.dataset.printStart + +e.dataset.printRun*.3,behavior:"instant"})');q.wait_for_timeout(200)
    before=section.evaluate('e=>[Number(e.dataset.narrativeProgress)]')
    q.set_viewport_size({'width':w,'height':next_height});q.wait_for_timeout(500)
    after=section.evaluate('e=>[Number(e.dataset.narrativeProgress)]')
    assert all(abs(a-b)<.015 for a,b in zip(before,after)),('knowledge reveal moved on resize',before,after)
    box=section.locator('.scene-narration').bounding_box()
    assert box['y']>=60 and box['y']+box['height']<=next_height+1
    q.set_viewport_size({'width':w,'height':h});q.wait_for_timeout(450)
    continue
   target.evaluate('(e)=>scrollTo({top:scrollY+e.getBoundingClientRect().top-innerHeight*.3,behavior:"instant"})')
   q.wait_for_timeout(250);before=target.bounding_box()['y']
   q.set_viewport_size({'width':w,'height':next_height});q.wait_for_timeout(500)
   after=target.bounding_box()['y']
   # At the document's lower boundary a taller window reveals more above it;
   # preserving an identical offset there would require scrolling past the end.
   at_end=q.evaluate('scrollY>=document.documentElement.scrollHeight-innerHeight-2')
   assert abs(after-before)<24 or at_end,('reading jumped',w,selector,before,after)
   assert after>=60 and after<next_height,(w,selector,after)
   q.set_viewport_size({'width':w,'height':h});q.wait_for_timeout(450)
  field=q.locator('#atelier-context');field.scroll_into_view_if_needed();field.focus();q.wait_for_timeout(150)
  q.set_viewport_size({'width':w,'height':next_height});q.wait_for_timeout(500)
  box=field.bounding_box()
  assert box['y']>=60 and box['y']+box['height']<=next_height-10,(w,'field outside viewport',box)
  assert field.evaluate('e=>document.activeElement===e')
  q.wait_for_timeout(200);frames=q.evaluate('__SL_DEBUG.metrics.frames');q.wait_for_timeout(250)
  assert frames==q.evaluate('__SL_DEBUG.metrics.frames'),'idle animation loop'
  print('PASS mobile reading and focused-field resize',w,h,next_height,flush=True);q.close()
 browser.close()
