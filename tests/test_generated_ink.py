"""Generated-art pilot: real scroll, image loading, pencil registration and fallbacks."""
import argparse
from pathlib import Path
from urllib.parse import urljoin
from playwright.sync_api import sync_playwright

parser=argparse.ArgumentParser();parser.add_argument('--url',default='http://127.0.0.1:4198/');args=parser.parse_args()
url=urljoin(args.url,'ensaios/arte-gerada/')
Path('.playwright').mkdir(exist_ok=True)
with sync_playwright() as pw:
 browser=pw.chromium.launch()
 for w,h in [(1440,900),(1280,680),(1024,768),(800,900),(390,844),(375,667),(320,480),(844,390)]:
  q=browser.new_page(viewport={'width':w,'height':h},has_touch=w<761);errors=[]
  q.on('pageerror',lambda e:errors.append(str(e)))
  response=q.goto(url,wait_until='networkidle');assert response.status==200
  q.wait_for_function('window.__GENERATED_INK?.ready')
  q.wait_for_function('__GENERATED_INK.maskCached')
  assert q.locator('meta[name=robots]').get_attribute('content')=='noindex,follow'
  assert not q.locator('link[rel=canonical]').count()
  assert q.locator('[data-generated-guide]').count()>100
  loaded=q.evaluate('''async()=>{
   const image=new Image();image.src=document.querySelector('#workbench-ink image').getAttribute('href');
   await image.decode();return [image.naturalWidth,image.naturalHeight];
  }''');assert loaded==[1536,1024]
  animated=q.evaluate('__GENERATED_INK.enabled')
  def go(p):
   q.evaluate('(p)=>scrollTo({top:__GENERATED_INK.start+__GENERATED_INK.run*p,behavior:"instant"})',p)
   try:q.wait_for_function('(p)=>Math.abs(__GENERATED_INK.progress-p)<.002',arg=p)
   except Exception:
    print('Seek failure',w,h,p,q.evaluate('JSON.stringify({state:__GENERATED_INK,y:scrollY})'),errors,flush=True)
    raise
  if animated:
   for p in [.015,.16,.29,.43,.65,.78,.84,.93,1]:
    go(p)
    stage=q.locator('.generated-stage').bounding_box();mast=q.locator('.generated-mast').bounding_box()
    assert stage['y']>=mast['height']-1 and stage['y']+stage['height']<=h+1,(w,h,p,stage)
    copy=q.locator('[data-generated-copy][data-current=true]').bounding_box()
    controls=q.locator('.generated-controls').bounding_box()
    assert copy['y']>=stage['y'] and copy['y']+copy['height']<=controls['y']+1,(w,h,p,copy,controls)
    graphic=q.locator('.generated-art').bounding_box()
    assert graphic['height']>100 and graphic['y']+graphic['height']<=controls['y']+1,(w,h,p,graphic,controls)
    assert q.evaluate('document.documentElement.scrollWidth<=innerWidth'),(w,h,p,'overflow')
    if w>760:
     overflow=q.locator('.generated-editorial').evaluate('e=>[...e.querySelectorAll("h1>span,h1>em")].some(s=>s.scrollWidth>e.clientWidth+1)')
     assert not overflow,(w,h,p,'headline overlaps the drawing')
    error=q.evaluate('''()=>{
     const tip=__GENERATED_INK.tip;if(!tip)return 0;
     const path=document.querySelectorAll('[data-generated-guide]')[tip.index];
     const p=path.getPointAtLength(path.getTotalLength()*(1-Number(path.getAttribute('stroke-dashoffset'))));
     return Math.hypot(p.x-tip.x,p.y-tip.y);
    }''');assert error<.01,('detached pencil',w,h,p,error)
   go(.43);snapshot=q.locator('.generated-art').evaluate('e=>e.outerHTML');go(.78);go(.43)
   assert snapshot==q.locator('.generated-art').evaluate('e=>e.outerHTML'),'rewind changed the drawing'
   q.evaluate('dispatchEvent(new Event("beforeprint"))')
   assert q.locator('[data-generated-complete]').get_attribute('opacity')=='1'
   q.evaluate('dispatchEvent(new Event("afterprint"))');q.wait_for_timeout(60)
   assert q.locator('.generated-art').evaluate('e=>e.outerHTML')==snapshot,'print lost the drawing state'
   slider=q.locator('input[type=range]');slider.focus();slider.press('End')
   q.wait_for_function('__GENERATED_INK.progress>.998')
   assert q.locator('[data-generated-complete]').get_attribute('opacity')=='1'
   assert q.locator('[data-generated-pencil]').get_attribute('hidden') is not None
   assert q.locator('[data-generated-guide]').evaluate_all('es=>es.every(e=>+e.getAttribute("stroke-dashoffset")===0)')
   assert q.locator('[data-generated-highlight]').evaluate_all('es=>es.every(e=>+e.getAttribute("opacity")>=.3)')
   go(.20)
   assert q.locator('[data-generated-light-guide]').evaluate_all('es=>es.some(e=>+e.getAttribute("opacity")>0)')
   assert q.locator('[data-generated-highlight]').evaluate_all('es=>es.every(e=>+e.getAttribute("opacity")===0)')
   go(1)
   # Keyboard and touch must be able to pause, rather than restart, playback.
   play=q.locator('[data-generated-play]');play.focus();play.press('Space')
   q.wait_for_timeout(500);assert q.evaluate('__GENERATED_INK.playing')
   assert 0<q.evaluate('__GENERATED_INK.progress')<.05
   play.press('Space');q.wait_for_timeout(80);assert not q.evaluate('__GENERATED_INK.playing')
   play.click();q.wait_for_timeout(80)
   if w<761:play.tap()
   else:q.mouse.wheel(0,60)
   q.wait_for_function('!__GENERATED_INK.playing',timeout=1500)
   # Wheel is passive: its native compositor scroll may finish after the pause
   # handler. Wait for that real movement before seeking somewhere unrelated.
   q.evaluate('''async()=>new Promise(resolve=>{
    let last=scrollY,stable=0;
    const frame=()=>{stable=Math.abs(scrollY-last)<.5?stable+1:0;last=scrollY;
     if(stable>=4)resolve();else requestAnimationFrame(frame);
    };requestAnimationFrame(frame);
   })''')
   go(.72)
   if w==1440:
    q.set_viewport_size({'width':390,'height':844});q.wait_for_timeout(150)
    assert abs(q.evaluate('__GENERATED_INK.progress')-.72)<.002
    q.set_viewport_size({'width':w,'height':h});q.wait_for_timeout(150)
    assert abs(q.evaluate('__GENERATED_INK.progress')-.72)<.002
  else:
   assert q.evaluate('__GENERATED_INK.progress')==1
   assert q.locator('[data-generated-copy]').evaluate_all('es=>es.every(e=>getComputedStyle(e).display!=="none")')
  for theme in ['dark','light']:
   q.evaluate('(t)=>{if(document.documentElement.dataset.theme!==t)document.querySelector("[data-theme-toggle]").click()}',theme)
   if animated:go(1)
   q.screenshot(path=f'.playwright/generated-verified-{w}-{h}-{theme}.png')
  q.wait_for_timeout(120);frames=q.evaluate('__GENERATED_INK.frames');q.wait_for_timeout(200)
  assert frames==q.evaluate('__GENERATED_INK.frames'),'drawing animates while idle'
  q.locator('[data-generated-reading]').click();q.wait_for_timeout(80)
  assert not q.evaluate('__GENERATED_INK.enabled')
  assert q.locator('[data-generated-complete]').get_attribute('opacity')=='1'
  assert q.locator('[data-generated-copy]').evaluate_all('es=>es.every(e=>getComputedStyle(e).display!=="none")')
  q.locator('[data-generated-reading]').click();q.emulate_media(reduced_motion='reduce');q.wait_for_timeout(80)
  assert not q.evaluate('__GENERATED_INK.enabled')
  assert q.evaluate('document.documentElement.scrollWidth<=innerWidth')
  assert not errors,errors
  print('PASS generated ink',w,h,flush=True);q.close()
 q=browser.new_page(java_script_enabled=False,viewport={'width':320,'height':480});q.goto(url)
 assert q.locator('[data-generated-copy]').count()==4
 assert q.locator('[data-generated-copy]').evaluate_all('es=>es.every(e=>getComputedStyle(e).display!=="none")')
 assert q.locator('[data-generated-controls]').evaluate('e=>getComputedStyle(e).display')=='none'
 assert q.locator('[data-generated-complete]').get_attribute('opacity') is None
 assert q.evaluate('document.documentElement.scrollWidth<=innerWidth')
 q.screenshot(path='.playwright/generated-no-js.png',full_page=True)
 print('PASS generated ink no-JS',flush=True);q.close()
 q=browser.new_page(viewport={'width':390,'height':844})
 q.add_init_script('HTMLCanvasElement.prototype.getContext=()=>null')
 q.goto(url,wait_until='networkidle');q.wait_for_function('window.__GENERATED_INK?.ready')
 assert not q.evaluate('__GENERATED_INK.maskCached')
 q.locator('[data-generated-reading]').click();q.wait_for_timeout(80)
 assert q.locator('#workbench-ink image').get_attribute('filter')=='url(#workbench-invert)'
 assert q.locator('[data-generated-complete]').get_attribute('opacity')=='1'
 q.screenshot(path='.playwright/generated-no-canvas.png')
 print('PASS generated ink Canvas fallback',flush=True);browser.close()
