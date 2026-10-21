"""Work argument: closing callout starts below headline, then is pushed by text."""
from playwright.sync_api import sync_playwright
import argparse
parser=argparse.ArgumentParser();parser.add_argument('--url',default='http://127.0.0.1:4198/');args=parser.parse_args()
with sync_playwright() as pw:
 b=pw.chromium.launch()
 for w,h in [(1440,900),(1440,680),(1280,720),(1024,768),(1920,1080),(390,844),(844,390),(320,568)]:
  q=b.new_page(viewport={'width':w,'height':h});errors=[]
  q.on('pageerror',lambda e:errors.append(str(e)))
  q.goto(args.url,wait_until='networkidle');q.wait_for_function('window.__SL_DEBUG?.ready')
  section=q.locator('#folha');blocks=q.locator('#folha [data-print-progress]');closing=q.locator('.choices-closing')
  text=q.locator('.choices-print-body').inner_text()
  assert 'menos desgaste' in text
  assert 'O salário não acompanha.' in q.locator('.choices-reference').inner_text()
  def go(p):
   start,run=section.evaluate('(e)=>[+e.dataset.printStart,+e.dataset.printRun]')
   y=round(start+run*p);q.evaluate('(y)=>scrollTo({top:y,behavior:"instant"})',y)
   q.wait_for_function('(y)=>Math.abs(__SL_DEBUG.scroll-y)<2',arg=y);q.wait_for_timeout(200)
  def values():return blocks.evaluate_all('(es)=>es.map(e=>Number(e.dataset.printProgress))')
  go(0);initial_y=closing.bounding_box()['y'];initial_offset=closing.evaluate('(e)=>e.getBoundingClientRect().top-e.closest(".choices-print-stage").getBoundingClientRect().top');title=q.locator('#folha h2').bounding_box()
  assert 0<=initial_y-title['y']-title['height']<85,(w,h,initial_y,title)
  assert values()==[0]*3
  title_top=title['y']
  for index,progress in enumerate([.15,.5,.85]):
   go(progress);v=values()
   assert 0<v[index]<1 and v[:index]==[1]*index and v[index+1:]==[0]*(2-index),v
   if index==0:assert closing.evaluate('(e)=>e.getBoundingClientRect().top-e.closest(".choices-print-stage").getBoundingClientRect().top')>initial_offset+10,'callout was not pushed'
   rect=blocks.nth(index).bounding_box()
   assert rect['y']<h and rect['y']+rect['height']>60,(w,h,index,rect)
   assert abs(q.locator('#folha h2').bounding_box()['y']-title_top)<1,'headline moved during pin'
   assert title_top>=q.locator('#mast').evaluate('(e)=>e.offsetHeight')
   stage=section.locator('.choices-print-stage').bounding_box()
   assert stage['y']>=0 and stage['y']+stage['height']<=h+1,(w,h,stage)
  go(.96);assert values()==[1]*3
  if w>=760 and h>=620:
   seen=set();expected=set()
   for step in range(61):
    start,run=section.evaluate('(e)=>[+e.dataset.printStart,+e.dataset.printRun]')
    y=round(start+run*step/60);q.evaluate('(y)=>scrollTo({top:y,behavior:"instant"})',y)
    q.wait_for_function('(y)=>Math.abs(__SL_DEBUG.scroll-y)<2',arg=y)
    rows=q.locator('.choices-print-body').evaluate(r'''body=>{
     const box=body.getBoundingClientRect(),walk=document.createTreeWalker(body,NodeFilter.SHOW_TEXT),rows=[];let i=0;
     while(walk.nextNode()){
      const node=walk.currentNode;if(!node.textContent.trim())continue;
      const block=node.parentElement.closest('[data-print-progress]'),p=Number(block.dataset.printProgress),r=block.getBoundingClientRect();
      const clip=getComputedStyle(block).clipPath.match(/100% ([\d.]+)%/),bottom=p===1?r.bottom:clip?r.top+r.height*Number(clip[1])/100:r.top;
      const range=document.createRange();range.selectNodeContents(node);
      [...range.getClientRects()].forEach((line,j)=>rows.push({id:`${i}:${j}`,visible:p>0&&line.top>=box.top-1&&line.bottom<=Math.min(box.bottom,bottom)+1}));i++;
     }return rows;
    }''')
    for row in rows:
     expected.add(row['id'])
     if row['visible']:seen.add(row['id'])
    head=q.locator('#folha h2').bounding_box()
    assert head['y']>=q.locator('#mast').evaluate('(e)=>e.offsetHeight')
   assert expected<=seen,('unreadable desktop lines',w,h,expected-seen)
   go(.96)
  sketch=q.locator('[data-work-sketch]')
  assert sketch.locator('svg').get_attribute('role')=='img'
  ink=sketch.locator('[data-pencil]')
  assert ink.evaluate_all('(es)=>es.every(e=>Number(e.style.strokeDashoffset)<.001)')
  assert sketch.locator('.sketch-pencil-tip').get_attribute('hidden') is not None
  go(.5);drawing=ink.evaluate_all('(es)=>es.map(e=>e.style.strokeDashoffset)')
  assert any(float(p)>0 for p in drawing) and any(float(p)==0 for p in drawing)
  go(.85);go(.5)
  assert ink.evaluate_all('(es)=>es.map(e=>e.style.strokeDashoffset)')==drawing,'drawing did not reverse deterministically'
  go(.96)
  final=closing.bounding_box();assert final['y']>=0 and final['y']+final['height']<=h+2,(w,h,final)
  assert not q.locator('.choices-reference').evaluate('(e)=>e.inert')
  reference=q.locator('.choices-reference a');reference.focus();assert reference.evaluate('(e)=>document.activeElement===e')
  go(.62);snapshot=values();y=q.evaluate('scrollY')
  q.evaluate("document.dispatchEvent(new CustomEvent('sl:layout-change'))");q.wait_for_timeout(350)
  assert abs(q.evaluate('scrollY')-y)<2
  assert values()==snapshot
  assert q.locator('.choices-print-body').inner_text()==text
  q.evaluate('SLMotion.setReading(true)');q.wait_for_timeout(300)
  assert section.get_attribute('data-print-pinned')=='false' and values()==[1]*3
  assert not q.locator('.choices-reference').evaluate('(e)=>e.inert')
  q.evaluate('SLMotion.setReading(false)');q.emulate_media(reduced_motion='reduce');q.wait_for_timeout(300)
  assert values()==[1]*3
  assert ink.evaluate_all('(es)=>es.every(e=>Number(e.style.strokeDashoffset)<.001)')
  assert q.evaluate('document.documentElement.scrollWidth<=innerWidth')
  assert not errors,errors
  print('PASS work reveal',w,h,flush=True);q.close()
 q=b.new_page(java_script_enabled=False);q.goto(args.url)
 assert q.locator('.choices-reference').evaluate('(e)=>getComputedStyle(e).clipPath')=='none'
 assert q.locator('.choices-reference a').get_attribute('href').startswith('https://www.marxists.org/')
 print('PASS work no-JS',flush=True);b.close()
