"""The network story shares the native clock, remains legible and reverses exactly."""
import argparse
from playwright.sync_api import sync_playwright
parser=argparse.ArgumentParser();parser.add_argument('--url',default='http://127.0.0.1:4204/');args=parser.parse_args()
lines_js=r'''body=>{
 const box=body.getBoundingClientRect(),walk=document.createTreeWalker(body,NodeFilter.SHOW_TEXT),rows=[];let i=0;
 while(walk.nextNode()){
  const node=walk.currentNode;if(!node.textContent.trim())continue;
  const block=node.parentElement.closest('[data-print-progress]'),p=Number(block.dataset.printProgress),r=block.getBoundingClientRect();
  const clip=getComputedStyle(block).clipPath.match(/100% ([\d.]+)%/),bottom=p===1?r.bottom:clip?r.top+r.height*Number(clip[1])/100:r.top;
  const range=document.createRange();range.selectNodeContents(node);
  [...range.getClientRects()].forEach((line,j)=>rows.push({id:`${i}:${j}`,visible:p>0&&getComputedStyle(block).visibility!=="hidden"&&line.top>=box.top-1&&line.bottom<=Math.min(box.bottom,bottom)+1}));i++;
 }return rows;
}'''
with sync_playwright() as pw:
 b=pw.chromium.launch()
 for w,h in [(1440,900),(1280,680),(1024,768),(390,844),(360,640),(320,480),(844,390)]:
  q=b.new_page(viewport={'width':w,'height':h},has_touch=w<760);errors=[]
  q.on('pageerror',lambda e:errors.append(str(e)))
  q.goto(args.url,wait_until='networkidle');q.wait_for_function('window.__SL_DEBUG?.ready')
  section=q.locator('#meios-digitais');svg=section.locator('[data-landing-ink=network]');seen=set();expected=set()
  assert q.locator('main>section[data-number]').count()==17
  def go(p):
   y=section.evaluate('(e,p)=>Math.round(+e.dataset.printStart + +e.dataset.printRun*p)',p)
   q.evaluate('(y)=>scrollTo({top:y,behavior:"instant"})',y)
   q.wait_for_function('(y)=>Math.abs(__SL_DEBUG.scroll-y)<2',arg=y)
  for step in range(71):
   go(step/70)
   for selector in ['.network-stage','h2','.network-art','.network-footer']:
    r=section.locator(selector).bounding_box()
    assert r['y']>=-1 and r['y']+r['height']<=h+1,(w,h,step,selector,r)
   for row in section.locator('.network-message').evaluate(lines_js):
    expected.add(row['id'])
    if row['visible']:seen.add(row['id'])
  assert expected<=seen,('unreadable network lines',w,h,expected-seen)
  assert q.evaluate('document.documentElement.scrollWidth<=innerWidth')
  go(.185)
  assert section.locator('.network-act').nth(0).evaluate('e=>getComputedStyle(e).visibility')=='visible','reading pause erased the completed text'
  go(.53)
  assert section.locator('.network-act').nth(2).get_attribute('data-print-progress')=='1.000','answer arrived before the problem text finished'
  assert section.locator('[data-landing-ink=network] [data-generated-complete]').get_attribute('opacity')=='1'
  assert section.locator('[data-landing-ink="network-solution"]').get_attribute('data-ink-progress')=='0.000000','answer began before the first drawing finished'
  go(.78);q.wait_for_function('__SL_DEBUG.ink.network.maskCached && __SL_DEBUG.ink["network-solution"].maskCached');q.wait_for_timeout(100)
  before=section.locator('[data-network-flow]').evaluate_all('es=>es.map(e=>e.outerHTML)')
  guide=section.locator('[data-generated-guide]').evaluate_all('es=>es.map(e=>e.getAttribute("stroke-dashoffset"))')
  go(.92);go(.78)
  assert section.locator('[data-network-flow]').evaluate_all('es=>es.map(e=>e.outerHTML)')==before,'cables/packets did not reverse'
  assert section.locator('[data-generated-guide]').evaluate_all('es=>es.map(e=>e.getAttribute("stroke-dashoffset"))')==guide
  q.evaluate('dispatchEvent(new Event("beforeprint"))');q.evaluate('dispatchEvent(new Event("afterprint"))')
  assert section.locator('[data-network-flow]').evaluate_all('es=>es.map(e=>e.outerHTML)')==before,'print lost flow state'
  q.emulate_media(media='print');q.wait_for_timeout(250)
  assert section.locator('.network-act').evaluate_all('es=>es.every(e=>getComputedStyle(e).visibility==="visible")')
  plates=section.locator('[data-network-plate]').all()
  assert plates[1].bounding_box()['y']>=plates[0].evaluate('e=>e.getBoundingClientRect().bottom'),'print overlaid the two drawings'
  q.emulate_media(media='screen');q.wait_for_timeout(250);go(.78)
  go(.98);q.screenshot(path=f'.playwright/network83-final-{w}-{h}.png')
  assert section.locator('[data-generated-pencil]').evaluate_all('es=>es.every(e=>e.hasAttribute("hidden"))')
  assert section.locator('[data-network-plate="capture"]').evaluate('e=>+getComputedStyle(e).opacity')==0
  assert section.locator('[data-network-plate="response"]').evaluate('e=>+getComputedStyle(e).opacity')==1
  q.wait_for_timeout(250);frames=q.evaluate('__SL_DEBUG.metrics.frames');q.wait_for_timeout(160)
  assert frames==q.evaluate('__SL_DEBUG.metrics.frames'),'network keeps animating at rest'
  q.evaluate('SLMotion.setReading(true)');q.wait_for_timeout(220)
  assert section.get_attribute('data-print-pinned')=='false'
  assert section.locator('.network-act').evaluate_all('es=>es.every(e=>getComputedStyle(e).clipPath==="none")')
  assert section.locator('.network-packet').evaluate_all('es=>es.every(e=>+e.getAttribute("opacity")===0)')
  q.evaluate('SLMotion.setReading(false)');q.emulate_media(reduced_motion='reduce');q.wait_for_timeout(220)
  assert section.locator('[data-generated-complete]').evaluate_all('es=>es.every(e=>e.getAttribute("opacity")==="1")')
  assert section.locator('[data-network-plate]').evaluate_all('es=>es.every(e=>getComputedStyle(e).opacity==="1")')
  assert not errors,errors
  print('PASS digital commons: complete reading, bounded pin, reverse, print, idle and accessible modes',w,h,flush=True);q.close()
 q=b.new_page(java_script_enabled=False,viewport={'width':390,'height':844});q.goto(args.url)
 assert q.locator('#meios-digitais .network-act').count()==4
 assert q.locator('#meios-digitais').inner_text().find('capitalismo selvagem')>=0
 assert q.locator('#meios-digitais .network-sources a').count()==2
 assert q.evaluate('document.documentElement.scrollWidth<=innerWidth')
 assert q.locator('#meios-digitais [data-network-plate]').count()==2
 assert q.locator('#meios-digitais [data-network-plate]').evaluate_all('es=>es.every(e=>getComputedStyle(e).opacity==="1")')
 print('PASS digital commons without JavaScript',flush=True);b.close()
