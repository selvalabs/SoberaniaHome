"""Simulate a notch/home indicator without claiming a physical iOS test."""
import argparse
from playwright.sync_api import sync_playwright
parser=argparse.ArgumentParser();parser.add_argument('--url',default='http://127.0.0.1:4198/');args=parser.parse_args()
with sync_playwright() as pw:
 browser=pw.chromium.launch();q=browser.new_page(viewport={'width':390,'height':844},is_mobile=True,has_touch=True)
 q.goto(args.url,wait_until='networkidle');q.wait_for_function('window.__SL_DEBUG?.ready')
 # The browser runner has no physical safe-area insets. Exercise the same
 # computed padding and mast height used by env(safe-area-inset-*) on devices.
 q.add_style_tag(content=':root{--mobile-safe-bottom:34px}#mast{height:95px;padding-top:35px}')
 q.evaluate("document.dispatchEvent(new CustomEvent('sl:layout-change'))");q.wait_for_timeout(350)
 for sid,closing in [('hero','.text-actions'),('folha','.choices-closing'),('deslocamento-2','.knowledge-cover-closing')]:
  q.locator('#'+sid).evaluate('(e)=>scrollTo({top:Number(e.dataset.printStart)+Number(e.dataset.printRun)*.96,behavior:"instant"})');q.wait_for_timeout(150)
  title=q.locator('#'+sid+' h1,#'+sid+' h2').bounding_box();r=q.locator('#'+sid+' '+closing).bounding_box()
  assert title['y']>=95 and r['y']+r['height']<=844-34,(sid,title,r)
 for sid in ['trabalho','laboratorio']:
  q.evaluate('(id)=>SLMotion.jumpScene(id,0)',sid)
  q.wait_for_function('(id)=>Math.abs(document.querySelector(`#${id} .scene-frame`).getBoundingClientRect().top)<1',arg=sid)
  q.wait_for_timeout(180)
  head=q.locator('#'+sid+' .scene-head').bounding_box();r=q.locator('#'+sid+' .scene-controls').bounding_box()
  assert head['height']>=95 and r['y']+r['height']<=844-34+1,(sid,head,r)
 print('PASS simulated top/bottom safe areas: reveal calls and both gallery controls',flush=True)
 browser.close()
