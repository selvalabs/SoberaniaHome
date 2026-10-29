"""The approved raster/pencil language inside the real landing's single clock."""
import argparse
from playwright.sync_api import sync_playwright

parser=argparse.ArgumentParser();parser.add_argument('--url',default='http://127.0.0.1:4198/');args=parser.parse_args()
SCENES=[('workbench','folha','.choices-print-stage'),('knowledge','deslocamento-2','.knowledge-cover-stage'),('handover','handover-drawing','.handover-ink-stage'),('network','meios-digitais','.network-stage'),('network-solution','meios-digitais','.network-stage')]
with sync_playwright() as pw:
 b=pw.chromium.launch()
 for w,h in [(1440,900),(1280,680),(1024,768),(390,844),(360,640),(320,480),(844,390)]:
  q=b.new_page(viewport={'width':w,'height':h},has_touch=w<760);errors=[]
  q.on('pageerror',lambda e:errors.append(str(e)))
  q.goto(args.url,wait_until='networkidle');q.wait_for_function('window.__SL_DEBUG?.ready')
  assert q.locator('[data-landing-ink]').count()==5
  ids=q.locator('[id]').evaluate_all('es=>es.map(e=>e.id)');assert len(ids)==len(set(ids)),'duplicate SVG/HTML IDs'
  for name,sid,stage_sel in SCENES:
   section=q.locator('#'+sid);svg=q.locator(f'[data-landing-ink={name}]')
   def go(p):
    y=section.evaluate('(e,p)=>Math.round(+e.dataset.printStart + +e.dataset.printRun*p)',p)
    q.evaluate('(y)=>scrollTo({top:y,behavior:"instant"})',y)
    q.wait_for_function('(y)=>Math.abs(__SL_DEBUG.scroll-y)<2',arg=y)
   at=.27 if name=='network' else .78 if name=='network-solution' else .5
   go(at);q.wait_for_timeout(120)
   stage=section.locator(stage_sel).bounding_box()
   assert stage['y']>=0 and stage['y']+stage['height']<=h+1,(w,h,name,stage)
   assert svg.get_attribute('role')=='img' and svg.locator('desc').text_content()
   assert q.evaluate('document.documentElement.scrollWidth<=innerWidth')
   if h>=580:
    q.wait_for_function('(name)=>__SL_DEBUG.ink[name].maskCached',arg=name)
    offsets=svg.locator('[data-generated-guide]').evaluate_all('es=>es.map(e=>+e.getAttribute("stroke-dashoffset"))')
    assert any(x==0 for x in offsets) and any(x>0 for x in offsets)
    state=q.evaluate('(name)=>JSON.parse(JSON.stringify(__SL_DEBUG.ink[name]))',name)
    if state['tip']:
     actual=svg.locator('[data-generated-guide]').nth(state['tip']['index']).evaluate('(p,t)=>{const a=p.getPointAtLength(p.getTotalLength()*t.draw);return [a.x,a.y]}',state['tip'])
     assert abs(actual[0]-state['tip']['x'])<.1 and abs(actual[1]-state['tip']['y'])<.1
    leaf=q.evaluate('JSON.parse(JSON.stringify(__SL_DEBUG.leaf))')
    go(.9);go(at)
    assert offsets==svg.locator('[data-generated-guide]').evaluate_all('es=>es.map(e=>+e.getAttribute("stroke-dashoffset"))')
    returned=q.evaluate('__SL_DEBUG.leaf')
    assert all(abs(leaf[k]-returned[k])<.6 for k in ['x','y','rotation','roll'])
    snapshot=svg.evaluate('e=>e.outerHTML')
    q.evaluate('dispatchEvent(new Event("beforeprint"))')
    assert svg.locator('[data-generated-complete]').get_attribute('opacity')=='1'
    q.evaluate('dispatchEvent(new Event("afterprint"))')
    assert svg.evaluate('e=>e.outerHTML')==snapshot,'printing lost the drawing state'
   go(.96)
   assert float(svg.locator('[data-generated-complete]').get_attribute('opacity'))==1
   assert svg.locator('[data-generated-pencil]').get_attribute('hidden') is not None
   if h>=580:assert svg.locator('[data-generated-highlight]').evaluate_all('es=>es.every(e=>+e.getAttribute("opacity")>0)')
  assert '/caderno/tempo-de-quem-trabalha/' in q.locator('#folha .narrative-footer a').get_attribute('href')
  assert q.locator('.knowledge-reference a').get_attribute('href').startswith('https://dominiopublico.mec.gov.br/')
  for i in range(3):
   q.locator('.handover-tabs a').nth(i).click()
   assert q.locator('.handover-tabs a').nth(i).get_attribute('aria-selected')=='true'
  q.wait_for_timeout(500);frames=q.evaluate('__SL_DEBUG.metrics.frames');q.wait_for_timeout(150)
  assert q.evaluate('__SL_DEBUG.metrics.frames')==frames,'idle drawing creates frames'
  for theme in ['dark','light']:
   q.evaluate('(t)=>{if(document.documentElement.dataset.theme!==t)document.querySelector("[data-theme-toggle]").click()}',theme)
   assert q.locator('[data-generated-art]').evaluate_all('es=>es.every(e=>getComputedStyle(e).color!==getComputedStyle(document.body).backgroundColor)')
  q.evaluate('SLMotion.setReading(true)');q.wait_for_timeout(200)
  assert q.locator('[data-landing-ink]').evaluate_all('es=>es.every(e=>e.dataset.inkEnabled==="false"&&e.querySelector("[data-generated-complete]").getAttribute("opacity")==="1")')
  q.evaluate('SLMotion.setReading(false)');q.emulate_media(reduced_motion='reduce');q.wait_for_timeout(200)
  assert q.locator('[data-landing-ink]').evaluate_all('es=>es.every(e=>e.dataset.inkEnabled==="false")')
  assert not errors,errors
  print('PASS integrated ink',w,h,flush=True);q.close()
 q=b.new_page(java_script_enabled=False,viewport={'width':390,'height':844});q.goto(args.url)
 assert q.locator('[data-landing-ink]').count()==5
 assert q.locator('[data-landing-ink]').evaluate_all('es=>es.every(e=>e.querySelector("[data-generated-complete]").getAttribute("opacity")!=="0")')
 assert q.locator('.handover-document:visible').count()==3
 assert q.evaluate('document.documentElement.scrollWidth<=innerWidth')
 print('PASS integrated ink no-JS',flush=True);q.close()
 q=b.new_page(viewport={'width':390,'height':844})
 q.add_init_script('HTMLCanvasElement.prototype.getContext=()=>null')
 q.goto(args.url,wait_until='networkidle');q.wait_for_function('window.__SL_DEBUG?.ready')
 q.evaluate('SLMotion.setReading(true)');q.wait_for_timeout(100)
 assert q.locator('[data-ink-mask] image').evaluate_all('es=>es.every(e=>e.getAttribute("filter").includes("-invert"))')
 assert q.locator('[data-generated-complete]').evaluate_all('es=>es.every(e=>e.getAttribute("opacity")==="1")')
 print('PASS integrated ink SVG fallback without Canvas',flush=True);b.close()
