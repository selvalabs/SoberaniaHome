"""Visible reading lines, chapter bounds, toolbar resize and full mobile content."""
import argparse
from playwright.sync_api import sync_playwright

parser=argparse.ArgumentParser();parser.add_argument('--url',default='http://127.0.0.1:4198/');args=parser.parse_args()

# Ranges track actual typeset lines, including links and emphasized text. A
# paragraph bounding box alone cannot tell whether its final line was clipped.
lines_js='''body=>{
 const window=body.getBoundingClientRect(),walker=document.createTreeWalker(body,NodeFilter.SHOW_TEXT);
 const result=[];let index=0;
 while(walker.nextNode()){
  const node=walker.currentNode;if(!node.textContent.trim())continue;
  const block=node.parentElement.closest('[data-print-progress]'),progress=Number(block?.dataset.printProgress||0);
  const range=document.createRange();range.selectNodeContents(node);
  const rect=block.getBoundingClientRect(),clip=getComputedStyle(block).clipPath;
  const edge=clip.match(/100% ([\\d.]+)%/),bottom=progress===1?rect.bottom:edge?rect.top+rect.height*Number(edge[1])/100:rect.top;
  [...range.getClientRects()].forEach((r,line)=>result.push({id:`${index}:${line}`,visible:progress>0&&r.top>=window.top-1&&r.bottom<=Math.min(window.bottom,bottom)+1}));
  index++;
 }return result;
}'''

with sync_playwright() as pw:
 browser=pw.chromium.launch()
 for w,h in [(320,480),(320,568),(360,640),(375,667),(390,844),(430,932),(667,375),(844,390)]:
  q=browser.new_page(viewport={'width':w,'height':h},is_mobile=w<760,has_touch=w<760);errors=[]
  q.on('pageerror',lambda e:errors.append(str(e)))
  q.goto(args.url,wait_until='networkidle');q.wait_for_function('window.__SL_DEBUG?.ready')
  q.wait_for_timeout(300)
  assert q.locator('main > section[data-number]').count()==16
  for sid,body_sel,stage_sel,closing_sel in [('hero','.hero-message','.hero-stage','.text-actions'),('folha','.choices-print-body','.choices-print-stage','.choices-closing')]:
   section=q.locator('#'+sid);body=section.locator(body_sel);seen=set();expected=set()
   for step in range(71):
    progress=step/70
    section.evaluate('(e,p)=>scrollTo({top:Number(e.dataset.printStart)+Number(e.dataset.printRun)*p,behavior:"instant"})',progress)
    q.wait_for_function('Math.abs(__SL_DEBUG.scroll-scrollY)<1');q.wait_for_timeout(20)
    for line in body.evaluate(lines_js):
     expected.add(line['id'])
     if line['visible']:seen.add(line['id'])
    for selector in [stage_sel,'h1,h2',closing_sel]:
     r=section.locator(selector).bounding_box()
     assert r['y']>=-1 and r['y']+r['height']<=h+1,(w,h,sid,progress,selector,r)
   assert expected<=seen,('unreadable lines',w,h,sid,sorted(expected-seen))
   # First body rows must never collapse underneath later text rows.
   if sid=='hero':
    assert section.locator('.hero-method').bounding_box()['y']>=section.locator('.hero-thesis').evaluate('e=>e.getBoundingClientRect().bottom')-1
   # Resizing a toolbar mid-reveal must preserve the reading position.
   section.evaluate('(e)=>scrollTo({top:Number(e.dataset.printStart)+Number(e.dataset.printRun)*.62,behavior:"instant"})')
   q.wait_for_timeout(100)
   state=section.locator('[data-print-progress]').evaluate_all('es=>es.map(e=>Number(e.dataset.printProgress))')
   q.set_viewport_size({'width':w,'height':h+54});q.wait_for_timeout(420)
   after=section.locator('[data-print-progress]').evaluate_all('es=>es.map(e=>Number(e.dataset.printProgress))')
   assert all(abs(a-b)<.015 for a,b in zip(state,after)),('resize changed reveal',sid,w,state,after)
   q.set_viewport_size({'width':w,'height':h});q.wait_for_timeout(420)
  # Check every chapter, not only the pinned opening. Long essays, forms and
  # accordion contents keep native vertical flow rather than being truncated.
  for sid in q.locator('main > section[data-number]').evaluate_all('es=>es.map(e=>e.id)')[2:]:
   q.evaluate('(id)=>SLMotion.jumpSection(id)',sid)
   q.wait_for_function('(id)=>__SL_DEBUG.activeId===id',arg=sid)
   section=q.locator('#'+sid)
   assert q.evaluate('document.documentElement.scrollWidth<=innerWidth'),(w,h,sid)
   # The intentionally moving work marquee is wider than the window.
   if sid!='trabalho':
    title=section.locator('h2').first.bounding_box()
    assert title['x']>=-1 and title['x']+title['width']<=w+1,(w,h,sid,title)
   if sid in ['trabalho','laboratorio']:
    q.evaluate('(id)=>SLMotion.jumpScene(id,0)',sid)
    q.wait_for_function('(id)=>Math.abs(document.querySelector(`#${id} .scene-frame`).getBoundingClientRect().top)<1',arg=sid)
    frame=section.locator('.scene-frame').bounding_box()
    assert frame['y']>=-1 and frame['y']+frame['height']<=h+1,(w,h,sid,frame)
   elif sid not in ['processo','espiral']:
    # A real paragraph or control at the end of each long chapter is reachable.
    tail=section.locator('p,a,button,summary').filter(visible=True).last
    tail.scroll_into_view_if_needed();r=tail.bounding_box()
    assert r['y']<h and r['y']+r['height']>0,(w,h,sid,'unreachable end',r)
  tabs=q.locator('.handover-tabs')
  assert tabs.get_attribute('aria-orientation')==('horizontal' if w<760 else 'vertical')
  tabs.locator('a').first.focus();q.keyboard.press('ArrowRight' if w<760 else 'ArrowDown')
  assert tabs.locator('a').nth(1).get_attribute('aria-selected')=='true'
  assert q.locator('#entrega-conhecimento').is_visible()
  q.evaluate('SLMotion.setReading(true)');q.wait_for_timeout(300)
  for selector in ['.hero-message','.choices-print-body']:
   assert q.locator(selector).evaluate('e=>e.scrollHeight<=e.clientHeight+1'),('reading content clipped',w,h,selector)
  assert not errors,errors
  print('PASS mobile reading, 16 chapters and resize',w,h,flush=True);q.close()
 browser.close()
