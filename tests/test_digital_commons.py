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
  [...range.getClientRects()].forEach((line,j)=>rows.push({id:`${i}:${j}`,visible:p>0&&line.top>=box.top-1&&line.bottom<=Math.min(box.bottom,bottom)+1}));i++;
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
  go(.74);q.wait_for_function('__SL_DEBUG.ink.network.maskCached');q.wait_for_timeout(100)
  before=svg.locator('[data-network-flow]').evaluate('(e)=>e.outerHTML')
  guide=svg.locator('[data-generated-guide]').evaluate_all('es=>es.map(e=>e.getAttribute("stroke-dashoffset"))')
  go(.92);go(.74)
  assert svg.locator('[data-network-flow]').evaluate('(e)=>e.outerHTML')==before,'cables/packets did not reverse'
  assert svg.locator('[data-generated-guide]').evaluate_all('es=>es.map(e=>e.getAttribute("stroke-dashoffset"))')==guide
  q.evaluate('dispatchEvent(new Event("beforeprint"))');q.evaluate('dispatchEvent(new Event("afterprint"))')
  assert svg.locator('[data-network-flow]').evaluate('(e)=>e.outerHTML')==before,'print lost flow state'
  go(.98);q.screenshot(path=f'.playwright/network83-final-{w}-{h}.png')
  assert svg.locator('[data-generated-pencil]').get_attribute('hidden') is not None
  q.wait_for_timeout(250);frames=q.evaluate('__SL_DEBUG.metrics.frames');q.wait_for_timeout(160)
  assert frames==q.evaluate('__SL_DEBUG.metrics.frames'),'network keeps animating at rest'
  q.evaluate('SLMotion.setReading(true)');q.wait_for_timeout(220)
  assert section.get_attribute('data-print-pinned')=='false'
  assert section.locator('.network-act').evaluate_all('es=>es.every(e=>getComputedStyle(e).clipPath==="none")')
  assert svg.locator('.network-packet').evaluate_all('es=>es.every(e=>+e.getAttribute("opacity")===0)')
  q.evaluate('SLMotion.setReading(false)');q.emulate_media(reduced_motion='reduce');q.wait_for_timeout(220)
  assert svg.locator('[data-generated-complete]').get_attribute('opacity')=='1'
  assert not errors,errors
  print('PASS digital commons: complete reading, bounded pin, reverse, print, idle and accessible modes',w,h,flush=True);q.close()
 q=b.new_page(java_script_enabled=False,viewport={'width':390,'height':844});q.goto(args.url)
 assert q.locator('#meios-digitais .network-act').count()==3
 assert q.locator('#meios-digitais').inner_text().find('capitalismo selvagem')>=0
 assert q.locator('#meios-digitais .network-sources a').count()==2
 assert q.evaluate('document.documentElement.scrollWidth<=innerWidth')
 print('PASS digital commons without JavaScript',flush=True);b.close()
