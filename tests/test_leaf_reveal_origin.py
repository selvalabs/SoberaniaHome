"""Pinned reveals must not move the launch anchor or stretch the leaf's fall."""
import argparse,math
from playwright.sync_api import sync_playwright
parser=argparse.ArgumentParser();parser.add_argument('--url',default='http://127.0.0.1:4198/');args=parser.parse_args()
with sync_playwright() as pw:
 browser=pw.chromium.launch()
 for width,height in [(390,844),(1440,900),(844,390)]:
  q=browser.new_page(viewport={'width':width,'height':height});errors=[]
  q.on('pageerror',lambda e:errors.append(str(e)))
  q.goto(args.url,wait_until='networkidle');q.wait_for_function('window.__SL_DEBUG?.ready')
  initial=q.evaluate('({...__SL_DEBUG.leafOrigin})')
  for y in [200,600,1000,1800,600,200]:
   q.evaluate('(y)=>scrollTo({top:y,behavior:"instant"})',y)
   q.wait_for_function('(y)=>Math.abs(__SL_DEBUG.scroll-y)<1',arg=y);q.wait_for_timeout(80)
   before=q.evaluate('({...__SL_DEBUG.leaf})')
   q.evaluate("document.dispatchEvent(new CustomEvent('sl:layout-change'))");q.wait_for_timeout(300)
   after=q.evaluate('({...__SL_DEBUG.leaf})')
   origin=q.evaluate('({...__SL_DEBUG.leafOrigin})')
   assert math.hypot(origin['x']-initial['x'],origin['y']-initial['y'])<.5,('launch moved',y,initial,origin)
   for key in ['x','y','rotation','pitch','yaw','roll']:
    assert abs(before[key]-after[key])<.5,('stationary remeasure changed leaf',width,y,key,before,after)
   if y==1800:
    assert 20<after['y']<height*.9,('leaf stuck on edge during pinned hero',width,after)
    assert 0<after['clockScroll']<y*.5,('reveal did not slow the leaf clock',width,after)
  for fold in ['hero','folha','deslocamento-2']:
   limits=q.locator('#'+fold).evaluate('(e)=>({top:e.getBoundingClientRect().top+scrollY,height:e.offsetHeight})')
   clocks=[]
   for offset in [limits['height']*.45,limits['height']*.45+100]:
    y=round(limits['top']+offset);q.evaluate('(y)=>scrollTo({top:y,behavior:"instant"})',y)
    q.wait_for_function('(y)=>Math.abs(__SL_DEBUG.scroll-y)<1',arg=y);q.wait_for_timeout(80)
    clocks.append(q.evaluate('__SL_DEBUG.leaf.clockScroll'))
   assert 0<clocks[1]-clocks[0]<45,('reading fold is not slower',fold,clocks)
  for sid in ['trabalho','laboratorio']:
   start=q.evaluate('(id)=>__SL_DEBUG.scenes.find(s=>s.id===id).start',sid)
   poses=[]
   for y in [round(start)-1,round(start)+1]:
    q.evaluate('(y)=>scrollTo({top:y,behavior:"instant"})',y)
    q.wait_for_function('(y)=>Math.abs(__SL_DEBUG.scroll-y)<1',arg=y);q.wait_for_timeout(80)
    poses.append(q.evaluate('({...__SL_DEBUG.leaf})'))
   assert math.hypot(poses[1]['x']-poses[0]['x'],poses[1]['y']-poses[0]['y'])<5,('gallery entry jumps',sid,poses)
  q.evaluate('scrollTo({top:1000,behavior:"instant"})');q.wait_for_timeout(150)
  q.screenshot(path=f'.playwright/leaf-reveal-fix-{width}.png')
  assert not errors,errors
  print('PASS stable natural origin and fall',width,height,flush=True)
  q.close()
 browser.close()

