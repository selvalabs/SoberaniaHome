"""Work argument: closing callout starts below headline, then is pushed by text."""
from playwright.sync_api import sync_playwright
import argparse
parser=argparse.ArgumentParser();parser.add_argument('--url',default='http://127.0.0.1:4198/');args=parser.parse_args()
with sync_playwright() as pw:
 b=pw.chromium.launch()
 for w,h in [(1440,900),(390,844),(844,390),(320,568)]:
  q=b.new_page(viewport={'width':w,'height':h});errors=[]
  q.on('pageerror',lambda e:errors.append(str(e)))
  q.goto(args.url,wait_until='networkidle');q.wait_for_function('window.__SL_DEBUG?.ready')
  section=q.locator('#folha');blocks=q.locator('#folha [data-print-progress]');closing=q.locator('.choices-closing')
  text=q.locator('.choices-print-body').inner_text()
  assert 'O trabalhador é que não' in text and 'menos desgaste' in text
  def go(p):
   start,run=section.evaluate('(e)=>[+e.dataset.printStart,+e.dataset.printRun]')
   y=round(start+run*p);q.evaluate('(y)=>scrollTo({top:y,behavior:"instant"})',y)
   q.wait_for_function('(y)=>Math.abs(__SL_DEBUG.scroll-y)<2',arg=y);q.wait_for_timeout(200)
  def values():return blocks.evaluate_all('(es)=>es.map(e=>Number(e.dataset.printProgress))')
  go(0);initial_y=closing.bounding_box()['y'];initial_offset=closing.evaluate('(e)=>e.getBoundingClientRect().top-e.closest(".choices-print-stage").getBoundingClientRect().top');title=q.locator('#folha h2').bounding_box()
  assert 0<=initial_y-title['y']-title['height']<85,(w,h,initial_y,title)
  assert values()==[0]*4
  for index,progress in enumerate([.15,.39,.62,.85]):
   go(progress);v=values()
   assert 0<v[index]<1 and v[:index]==[1]*index and v[index+1:]==[0]*(3-index),v
   if index==0:assert closing.evaluate('(e)=>e.getBoundingClientRect().top-e.closest(".choices-print-stage").getBoundingClientRect().top')>initial_offset+10,'callout was not pushed'
   rect=blocks.nth(index).bounding_box()
   assert rect['y']<h and rect['y']+rect['height']>60,(w,h,index,rect)
   if index<2:assert q.locator('.choices-reference').evaluate('(e)=>e.inert')
  go(.96);assert values()==[1]*4
  final=closing.bounding_box();assert final['y']>=0 and final['y']+final['height']<=h+2,(w,h,final)
  assert not q.locator('.choices-reference').evaluate('(e)=>e.inert')
  reference=q.locator('.choices-reference a');reference.focus();assert reference.evaluate('(e)=>document.activeElement===e')
  go(.62);snapshot=values();y=q.evaluate('scrollY')
  q.evaluate("document.dispatchEvent(new CustomEvent('sl:layout-change'))");q.wait_for_timeout(350)
  assert abs(q.evaluate('scrollY')-y)<2
  assert values()==snapshot
  assert q.locator('.choices-print-body').inner_text()==text
  q.evaluate('SLMotion.setReading(true)');q.wait_for_timeout(300)
  assert section.get_attribute('data-print-pinned')=='false' and values()==[1]*4
  assert not q.locator('.choices-reference').evaluate('(e)=>e.inert')
  q.evaluate('SLMotion.setReading(false)');q.emulate_media(reduced_motion='reduce');q.wait_for_timeout(300)
  assert values()==[1]*4
  assert q.evaluate('document.documentElement.scrollWidth<=innerWidth')
  assert not errors,errors
  print('PASS work reveal',w,h,flush=True);q.close()
 q=b.new_page(java_script_enabled=False);q.goto(args.url)
 assert q.locator('.choices-reference').evaluate('(e)=>getComputedStyle(e).clipPath')=='none'
 assert q.locator('.choices-reference a').get_attribute('href').startswith('https://www.marxists.org/')
 print('PASS work no-JS',flush=True);b.close()
