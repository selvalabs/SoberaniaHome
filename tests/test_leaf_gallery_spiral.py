"""Gallery-specific helical flight: multiple turns, bounds and exact reversal."""
import argparse,math
from playwright.sync_api import sync_playwright
parser=argparse.ArgumentParser();parser.add_argument('--url',default='http://127.0.0.1:4198/');args=parser.parse_args()
with sync_playwright() as pw:
 b=pw.chromium.launch()
 for w,h in [(390,844),(1440,900),(844,390)]:
  q=b.new_page(viewport={'width':w,'height':h});errors=[];q.on('pageerror',lambda e:errors.append(str(e)))
  q.goto(args.url,wait_until='networkidle');q.wait_for_function('window.__SL_DEBUG?.ready')
  for sid in ['trabalho','laboratorio']:
   data=q.evaluate('(id)=>__SL_DEBUG.scenes.find(s=>s.id===id)',sid)
   samples=[]
   def go(p):
    y=round(data['start']+(data['end']-data['start'])*p)
    q.evaluate('(y)=>scrollTo({top:y,behavior:"instant"})',y)
    q.wait_for_function('(y)=>Math.abs(__SL_DEBUG.scroll-y)<1',arg=y);q.wait_for_timeout(50)
    return q.evaluate('({...__SL_DEBUG.leaf})')
   for i in range(31):
    state=go(i/30);samples.append(state)
    r=q.locator('#wind-leaf').bounding_box()
    assert r['x']>=8 and r['y']>=8 and r['x']+r['width']<=w-8 and r['y']+r['height']<=h-8,(w,h,sid,i,r)
    assert q.locator('#leaf-flight').evaluate('(e)=>+getComputedStyle(e).opacity')>=.4
   assert abs(samples[-1]['galleryRoll']-samples[0]['galleryRoll'])>=1070,(sid,samples[0],samples[-1])
   assert max(s['gallerySpiralX'] for s in samples)-min(s['gallerySpiralX'] for s in samples)>w*.12
   assert max(s['gallerySpiralY'] for s in samples)-min(s['gallerySpiralY'] for s in samples)>min(h*.04,30)
   for index in [24,15,6]:
    replay=go(index/30)
    for key in ['x','y','roll','pitch','yaw','galleryRoll','gallerySpiralX','gallerySpiralY']:
     assert abs(replay[key]-samples[index][key])<.01,('reversal changed pose',sid,index,key)
   for boundary in [0,1]:
    a=go(boundary-.0001);c=go(boundary+.0001)
    assert math.hypot(a['x']-c['x'],a['y']-c['y'])<5,('gallery edge jumps',sid,boundary,a,c)
    assert abs(a['roll']-c['roll'])<5,('gallery edge unwinds',sid,boundary)
   go(.4);q.screenshot(path=f'.playwright/gallery-spiral-{sid}-{w}.png')
   print('PASS helical gallery',sid,w,h,flush=True)
  q.evaluate('SLMotion.setReading(true)');q.wait_for_timeout(250)
  assert q.locator('#leaf-flight').is_hidden()
  q.evaluate('SLMotion.setReading(false)');q.emulate_media(reduced_motion='reduce');q.wait_for_timeout(250)
  assert q.locator('#leaf-flight').is_hidden()
  assert not errors,errors
  q.close()
 b.close()
