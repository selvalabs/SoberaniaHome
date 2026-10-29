"""Visual-first pilot: framing, drawing/narration order, real reading routes and fallbacks."""
import argparse,json
from pathlib import Path
from urllib.parse import urljoin
from playwright.sync_api import sync_playwright

def run(url,focus='all'):
 with sync_playwright() as pw:
  browser=pw.chromium.launch()
  scenes=[('hero','.hero-stage'),('folha','.choices-print-stage'),('meios-digitais','.network-stage'),('deslocamento-2','.knowledge-narrative-stage'),('handover-drawing','.handover-narrative-stage')]
  if focus!='all':scenes=[scene for scene in scenes if scene[0]=={'hero':'hero','time':'folha','network':'meios-digitais','knowledge':'deslocamento-2','handover':'handover-drawing'}[focus]]
  for width,height in [(1440,900),(1280,680),(1024,768),(390,844),(360,640),(320,480),(844,390)]:
   q=browser.new_page(viewport={'width':width,'height':height});errors=[];q.on('pageerror',lambda e:errors.append(str(e)))
   q.goto(url,wait_until='networkidle');q.wait_for_function('window.__SL_DEBUG?.ready')
   assert q.locator('main>section[data-number]').count()==16
   for sid,stage_selector in scenes:
    section=q.locator('#'+sid)
    def go(progress):
     y=section.evaluate('(e,p)=>Math.round(+e.dataset.printStart + +e.dataset.printRun*p)',progress)
     q.evaluate('(y)=>scrollTo({top:y,behavior:"instant"})',y);q.wait_for_function('(y)=>Math.abs(__SL_DEBUG.scroll-y)<2',arg=y);q.wait_for_timeout(100)
    for p in [.1,.4,.85,.99]:
     go(p)
     for selector in [stage_selector,'h1,h2','.text-actions' if sid=='hero' else '.scene-narration','.hero-message' if sid=='hero' else '.narrative-footer']:
      box=section.locator(selector).bounding_box();assert box and box['y']>=-1 and box['y']+box['height']<=height+1,(width,height,sid,p,selector,box)
     if sid!='hero':
      active=section.locator('[data-narration-step][data-current=true]');assert active.count()==1
      assert active.is_visible() and len(active.inner_text().split())<=9
      art=section.locator('.narrative-art').bounding_box();assert art['height']>=height*.27,(sid,width,height,art)
    if sid=='hero':
     assert len(section.locator('.hero-message').inner_text().split())<=20
     assert section.locator('.text-actions a').all_text_contents()==['Ver projetos','Conversar']
    else:
     assert len(section.inner_text().split())<75,(sid,section.inner_text())
     go(.43);snapshot=section.locator('[data-generated-guide]').evaluate_all('es=>es.map(e=>e.getAttribute("stroke-dashoffset"))')
     go(.94);go(.43);assert snapshot==section.locator('[data-generated-guide]').evaluate_all('es=>es.map(e=>e.getAttribute("stroke-dashoffset"))')
     if sid=='meios-digitais':
      go(.54);assert q.evaluate('__SL_DEBUG.ink.network.progress')==1;assert q.evaluate('__SL_DEBUG.ink["network-solution"].progress')==0
      go(.96);assert section.locator('[data-network-plate="capture"]').evaluate('e=>+getComputedStyle(e).opacity')==0
      assert section.locator('[data-network-plate="response"]').evaluate('e=>+getComputedStyle(e).opacity')==1
     go(.43);q.wait_for_function('(sid)=>[...document.querySelectorAll(`#${sid} [data-landing-ink]`)].every(e=>__SL_DEBUG.ink[e.dataset.landingInk].maskCached)',arg=sid);state=section.locator('[data-landing-ink]').evaluate_all('es=>es.map(e=>e.outerHTML)')
     q.evaluate('dispatchEvent(new Event("beforeprint"))')
     assert section.locator('[data-generated-complete]').evaluate_all('es=>es.every(e=>e.getAttribute("opacity")==="1")')
     q.evaluate('dispatchEvent(new Event("afterprint"))')
     restored=section.locator('[data-landing-ink]').evaluate_all('es=>es.map(e=>e.outerHTML)')
     for before,after in zip(state,restored):
      if before!=after:
       diff=next((i for i,(a,b) in enumerate(zip(before,after)) if a!=b),min(len(before),len(after)))
       raise AssertionError((width,height,sid,'print restoration',before[max(0,diff-60):diff+130],after[max(0,diff-60):diff+130]))
    go(.98)
    if sid!='hero':
     q.emulate_media(media='print');assert section.locator('[data-narration-step]:visible').count()==3
     assert section.locator('[data-generated-complete]').evaluate_all('es=>es.every(e=>getComputedStyle(e).opacity==="1")')
     q.emulate_media(media='screen');q.wait_for_timeout(100)
    Path('.playwright').mkdir(exist_ok=True);q.screenshot(path=f'.playwright/visual85-{sid}-{width}-{height}.png')
   assert q.evaluate('document.documentElement.scrollWidth<=innerWidth')
   q.wait_for_timeout(300);frames=q.evaluate('__SL_DEBUG.metrics.frames');q.wait_for_timeout(200);assert frames==q.evaluate('__SL_DEBUG.metrics.frames'),'idle render loop'
   for theme in ['dark','light']:
    q.evaluate('(theme)=>{if(document.documentElement.dataset.theme!==theme)document.querySelector("[data-theme-toggle]").click()}',theme)
    assert q.locator('.scene-narration').evaluate_all('es=>es.every(e=>getComputedStyle(e).color!==getComputedStyle(e.closest("section")).backgroundColor)')
   q.evaluate('SLMotion.setReading(true)');q.wait_for_function('!__SL_DEBUG.enabled && [...document.querySelectorAll(".narrative-section")].every(e=>e.dataset.printPinned==="false")')
   assert q.locator('.narrative-section [data-narration-step]:visible').count()==12
   assert q.locator('.narrative-section [data-network-plate]').evaluate_all('es=>es.every(e=>getComputedStyle(e).opacity==="1")')
   q.evaluate('SLMotion.setReading(false)');q.emulate_media(reduced_motion='reduce');q.wait_for_function('!__SL_DEBUG.enabled && [...document.querySelectorAll(".narrative-section [data-narration-step]")].every(e=>e.dataset.current==="true")')
   assert q.locator('.narrative-section [data-narration-step]:visible').count()==12
   assert not errors,errors
   print('PASS visual narration',focus,width,height,flush=True);q.close()
  if focus=='all':
   q=browser.new_page(java_script_enabled=False,viewport={'width':390,'height':844});q.goto(url)
   assert q.locator('[data-narration-step]:visible').count()==12
   assert q.evaluate('document.documentElement.scrollWidth<=innerWidth')
   links=q.locator('#caderno .journal-library a.journal-read').evaluate_all('es=>es.map(e=>e.href)')
   expected=int(q.locator('.journal-stamp b').inner_text());assert len(links)==expected and expected>=18
   assert len(set(links))==expected
   for link in links:
    response=q.goto(link);assert response.status==200
    assert q.locator('h1').count()==1
    assert q.locator('main article p').count()>2
    assert q.evaluate('document.documentElement.scrollWidth<=innerWidth')
    data=[json.loads(t) for t in q.locator('script[type="application/ld+json"]').all_text_contents()];assert any(d.get('@type')=='Article' for d in data)
    if '/manifesto/' in link:assert q.locator('.reading-principles section').count()==10
    if '/meios-digitais-poder-popular/' in link:
     assert 'capitalismo selvagem' in q.locator('main').inner_text();assert 'perderemos batalhas' in q.locator('main').inner_text();assert q.locator('.reading-sources a').count()==2
    if '/tempo-de-quem-trabalha/' in link:
     assert 'E a jornada de trabalho?' in q.locator('main').inner_text();assert 'Paráfrase de V. I. Lenin, 1914' in q.locator('main').inner_text()
   print('PASS no-JS transcript and all reading routes, original manifesto, sources and article metadata',flush=True);q.close()
  browser.close()

if __name__=='__main__':
 parser=argparse.ArgumentParser();parser.add_argument('--url',default='http://127.0.0.1:4205/');parser.add_argument('--focus',default='all');args=parser.parse_args();run(args.url,args.focus)
