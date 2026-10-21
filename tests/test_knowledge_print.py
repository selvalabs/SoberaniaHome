"""Knowledge: successive reading blocks, bounded pin, reversal and fallbacks."""
import argparse
from playwright.sync_api import sync_playwright

parser=argparse.ArgumentParser();parser.add_argument('--url',default='http://127.0.0.1:4198/');args=parser.parse_args()
with sync_playwright() as pw:
 browser=pw.chromium.launch()
 for w,h in [(1440,900),(1280,680),(1920,1080),(1024,768),(390,844),(320,480),(844,390)]:
  q=browser.new_page(viewport={'width':w,'height':h});errors=[];q.on('pageerror',lambda e:errors.append(str(e)))
  q.goto(args.url,wait_until='networkidle');q.wait_for_function('window.__SL_DEBUG?.ready')
  q.wait_for_timeout(200)
  section=q.locator('#deslocamento-2');body=section.locator('.knowledge-cover-copy');blocks=body.locator('[data-print-progress]')
  text=body.inner_text();assert blocks.count()==3
  assert 'Quem trabalha com uma ferramenta' in text and 'Quem vive o problema participa da construção.' in text
  def go(progress):
   y=section.evaluate('(e,p)=>Math.round(+e.dataset.printStart + +e.dataset.printRun*p)',progress)
   q.evaluate('(y)=>scrollTo({top:y,behavior:"instant"})',y)
   q.wait_for_function('(y)=>Math.abs(__SL_DEBUG.scroll-y)<2',arg=y)
  def values():return blocks.evaluate_all('es=>es.map(e=>Number(e.dataset.printProgress))')
  go(0);top=section.locator('h2').bounding_box()['y'];assert values()==[0]*3
  for i,p in enumerate([.15,.5,.85]):
   go(p);v=values()
   assert v[:i]==[1]*i and 0<v[i]<1 and v[i+1:]==[0]*(2-i),v
   assert abs(section.locator('h2').bounding_box()['y']-top)<1.1
   stage=section.locator('.knowledge-cover-stage').bounding_box()
   assert stage['y']>=60 and stage['y']+stage['height']<=h+1,(w,h,stage)
   assert section.locator('h2').bounding_box()['y']>=q.locator('#mast').evaluate('e=>e.offsetHeight')
   if w<1000 or h<620:
    notes=section.locator('.knowledge-notes').bounding_box();window=body.bounding_box()
    assert notes['y']+notes['height']<=window['y']+1,('collage labels cover reading',w,h,notes,window)
  go(.5);snapshot=values();pose=q.evaluate('({...__SL_DEBUG.leaf})');go(.85);go(.5)
  assert values()==snapshot,'reveal did not reverse'
  q.wait_for_timeout(100);returned=q.evaluate('({...__SL_DEBUG.leaf})')
  assert all(abs(pose[k]-returned[k])<.5 for k in ['x','y','rotation','roll']),('leaf not reversible',w,h)
  if w>=1000 and h>=620:
   expected=set();seen=set()
   for step in range(71):
    go(step/70)
    rows=body.evaluate(r'''body=>{
     const box=body.getBoundingClientRect(),walk=document.createTreeWalker(body,NodeFilter.SHOW_TEXT),rows=[];let i=0;
     while(walk.nextNode()){
      const node=walk.currentNode;if(!node.textContent.trim())continue;
      const block=node.parentElement.closest('[data-print-progress]'),p=+block.dataset.printProgress,r=block.getBoundingClientRect();
      const edge=getComputedStyle(block).clipPath.match(/100% ([\d.]+)%/),bottom=p===1?r.bottom:edge?r.top+r.height*Number(edge[1])/100:r.top;
      const range=document.createRange();range.selectNodeContents(node);
      [...range.getClientRects()].forEach((r,j)=>rows.push({id:`${i}:${j}`,visible:p>0&&r.top>=box.top-1&&r.bottom<=Math.min(box.bottom,bottom)+1}));i++;
     }return rows;
    }''')
    for row in rows:
     expected.add(row['id'])
     if row['visible']:seen.add(row['id'])
   assert expected<=seen,('unreadable knowledge lines',w,h,expected-seen)
  go(.96);assert values()==[1]*3
  closing=blocks.last.bounding_box();assert closing['y']>=0 and closing['y']+closing['height']<=h+1,(w,h,closing)
  assert section.locator('.knowledge-collage [data-landing-ink=knowledge]').count()==1
  q.wait_for_timeout(100);frames=q.evaluate('__SL_DEBUG.metrics.frames');q.wait_for_timeout(120)
  assert q.evaluate('__SL_DEBUG.metrics.frames')==frames,'reveal runs without scroll'
  for theme in ['dark','light']:
   q.evaluate('(t)=>{if(document.documentElement.dataset.theme!==t)document.querySelector("[data-theme-toggle]").click()}',theme)
   assert body.inner_text()==text
   assert section.locator('.knowledge-copy-experience .leaf-ink').count()>0
  q.screenshot(path=f'.playwright/knowledge-reveal-{w}.png')
  q.evaluate('SLMotion.setReading(true)');q.wait_for_timeout(150)
  assert section.get_attribute('data-print-pinned')=='false' and values()==[1]*3
  assert body.evaluate('e=>getComputedStyle(e).overflowY==="visible"||e.scrollHeight<=e.clientHeight+1')
  q.evaluate('SLMotion.setReading(false)');q.emulate_media(reduced_motion='reduce');q.wait_for_timeout(150)
  assert values()==[1]*3 and body.evaluate('e=>getComputedStyle(e).overflowY==="visible"||e.scrollHeight<=e.clientHeight+1')
  assert q.evaluate('document.documentElement.scrollWidth<=innerWidth')
  assert not errors,errors
  print('PASS knowledge reveal',w,h,flush=True);q.close()
 q=browser.new_page(java_script_enabled=False,viewport={'width':320,'height':480});q.goto(args.url)
 assert q.locator('.knowledge-cover-copy>p').count()==3
 assert q.locator('.knowledge-cover-copy>p').evaluate_all('es=>es.every(e=>getComputedStyle(e).clipPath==="none")')
 assert q.locator('.knowledge-reference a').get_attribute('href').startswith('https://dominiopublico.mec.gov.br/')
 assert q.evaluate('document.documentElement.scrollWidth<=innerWidth')
 print('PASS knowledge no-JS',flush=True);browser.close()
