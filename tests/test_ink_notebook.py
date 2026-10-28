"""Notebook: actual native scroll, reverse, themes, viewport, idle and fallbacks."""
import argparse
from pathlib import Path
from urllib.parse import urljoin
from playwright.sync_api import sync_playwright

parser=argparse.ArgumentParser();parser.add_argument('--url',default='http://127.0.0.1:4198/');args=parser.parse_args()
url=urljoin(args.url,'ensaios/animacoes/')
Path('.playwright').mkdir(exist_ok=True)
with sync_playwright() as pw:
 browser=pw.chromium.launch()
 for w,h in [(1440,900),(1280,680),(1024,768),(390,844),(375,667),(320,480),(844,390)]:
  q=browser.new_page(viewport={'width':w,'height':h});errors=[];q.on('pageerror',lambda e:errors.append(str(e)))
  response=q.goto(url,wait_until='networkidle');assert response.status==200
  q.wait_for_function('window.__INK_DEBUG?.ready')
  assert q.locator('meta[name=robots]').get_attribute('content')=='noindex,follow'
  assert not q.locator('link[rel=canonical]').count()
  assert q.locator('[data-ink-scene]').count()==3
  animated=q.evaluate('__INK_DEBUG.enabled')
  for scene in ['tempo','saberes','autonomia']:
   el=q.locator(f'[data-ink-scene={scene}]')
   def go(p):
    y=el.evaluate('(e,p)=>+e.dataset.inkStart + +e.dataset.inkRun*p',p)
    q.evaluate('(y)=>scrollTo({top:y,behavior:"instant"})',y)
    current=el.get_attribute('data-ink-scene')
    q.wait_for_function('(o)=>Math.abs(Number(document.querySelector(o.s).dataset.inkProgress)-o.p)<.002',arg={'s':f'[data-ink-scene={current}]','p':p})
   if animated:
    for p in [.02,.12,.27,.46,.57,.70,.86,.98]:
     go(p)
     box=el.locator('.ink-stage').bounding_box()
     mast=q.locator('.notebook-mast').bounding_box()
     assert box['y']>=mast['height']-1 and box['y']+box['height']<=h+1,(w,h,scene,p,box)
     copy=el.locator('[data-ink-copy][data-current=true]').bounding_box()
     controls=el.locator('.ink-controls').bounding_box()
     assert copy['y']>=box['y'] and copy['y']+copy['height']<=controls['y']+1,(w,h,scene,p,copy,controls)
     svg=el.locator('.ink-art').bounding_box()
     assert svg['height']>70 and svg['y']+svg['height']<=controls['y']+1,(w,h,svg,controls)
     if w<=760:assert el.locator('.ink-art').evaluate('e=>getComputedStyle(e).overflow')=='hidden','portrait camera leaks into the text'
     nib_error=el.evaluate('''e=>{
      if(!e.dataset.tip)return 0;
      const svg=e.querySelector('svg'),paths=[...svg.querySelectorAll('[data-pencil]')];
      const path=paths.filter(p=>+p.style.strokeDashoffset>.001&&+p.style.strokeDashoffset<.999).at(-1);
      if(!path)return 0;
      const p=path.getPointAtLength(path.getTotalLength()*(1-Number(path.style.strokeDashoffset)));
      const v=new DOMPoint(p.x,p.y).matrixTransform(path.getCTM()).matrixTransform(svg.getCTM().inverse());
      const [x,y]=e.dataset.tip.split(',').map(Number);return Math.hypot(x-v.x,y-v.y);
     }''')
     assert nib_error<.05,('pencil detached from line',w,h,scene,p,nib_error)
    go(.46);snapshot=el.locator('svg').evaluate('e=>e.outerHTML');go(.86);go(.46)
    assert el.locator('svg').evaluate('e=>e.outerHTML')==snapshot,'drawing changed after rewind'
    el.locator('[data-ink-step="1"]').click();q.wait_for_timeout(60)
    assert el.get_attribute('data-ink-stage')=='1'
    slider=el.locator('input[type=range]');slider.focus();slider.press('End');q.wait_for_timeout(60)
    assert float(el.get_attribute('data-ink-progress'))>.998
   else:
    assert el.get_attribute('data-ink-progress')=='1.000000'
    assert el.locator('[data-ink-copy]').evaluate_all('es=>es.every(e=>getComputedStyle(e).display!=="none")')
  tempo=q.locator('[data-ink-scene=tempo]')
  if animated:
   el=tempo;go(.46)
   if w==1440:
    for rw,rh in [(390,844),(1440,900)]:
     q.set_viewport_size({'width':rw,'height':rh});q.wait_for_timeout(100)
     assert abs(float(tempo.get_attribute('data-ink-progress'))-.46)<.003,('resize lost progress',rw,rh,tempo.get_attribute('data-ink-progress'))
  else:tempo.scroll_into_view_if_needed()
  for theme in ['dark','light']:
   q.evaluate('(theme)=>{if(document.documentElement.dataset.theme!==theme)document.querySelector("[data-theme-toggle]").click()}',theme)
   colors=tempo.evaluate('e=>{const s=getComputedStyle(e);return [s.getPropertyValue("--sketch-bg"),s.getPropertyValue("--sketch-ink")]}')
   assert colors[0].strip()!=colors[1].strip()
   q.screenshot(path=f'.playwright/ink-{w}-{h}-{theme}.png')
  q.wait_for_timeout(150);frames=q.evaluate('__INK_DEBUG.metrics.frames');q.wait_for_timeout(200)
  assert frames==q.evaluate('__INK_DEBUG.metrics.frames'),'renderer runs while idle'
  q.locator('[data-ink-storyboard=tempo] summary').click();q.wait_for_timeout(100)
  assert q.locator('[data-ink-storyboard=tempo]').get_attribute('data-rendered')=='true'
  assert q.locator('[data-ink-storyboard=tempo] [data-ink-snapshot][data-ink-ready]').count()==5
  q.locator('[data-ink-reading]').click();q.wait_for_timeout(100)
  assert not q.evaluate('__INK_DEBUG.enabled')
  assert q.locator('[data-ink-copy]').evaluate_all('es=>es.every(e=>getComputedStyle(e).display!=="none")')
  q.locator('[data-ink-reading]').click();q.emulate_media(reduced_motion='reduce');q.wait_for_timeout(100)
  assert not q.evaluate('__INK_DEBUG.enabled')
  assert q.evaluate('document.documentElement.scrollWidth<=innerWidth'),(w,h,'horizontal overflow')
  assert not errors,errors
  print('PASS ink notebook',w,h,flush=True);q.close()
 q=browser.new_page(java_script_enabled=False,viewport={'width':320,'height':480});q.goto(url)
 assert q.locator('[data-ink-copy]').count()==11
 assert q.locator('[data-ink-copy]').evaluate_all('es=>es.every(e=>getComputedStyle(e).display!=="none")')
 assert q.locator('.ink-source a').get_attribute('href').startswith('https://www.marxists.org/')
 assert q.evaluate('document.documentElement.scrollWidth<=innerWidth')
 print('PASS ink no-JS',flush=True);browser.close()
