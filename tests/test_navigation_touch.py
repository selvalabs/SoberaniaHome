from pathlib import Path
from playwright.sync_api import sync_playwright
import json
from common import HTML,R,launch
results=[]
def ok(t,v,d=''):
 results.append({'test':t,'pass':bool(v),'detail':d});print('PASS' if v else 'FAIL',t,str(d)[:100])
with sync_playwright() as pw:
 b=launch(pw)
 p=b.new_page(viewport={'width':390,'height':844},is_mobile=True,has_touch=True)
 p.set_content(HTML);p.wait_for_function('__SL_DEBUG.ready');p.wait_for_timeout(100)
 ids=p.locator('#index-dialog .index-links a').evaluate_all('(as)=>as.map(a=>a.hash.slice(1))')
 links=[]
 for sid in ids:
  p.locator('#open-index').click();p.locator(f'#index-dialog a[href="#{sid}"]').click();p.wait_for_timeout(50)
  links.append({'id':sid,'active':p.evaluate('__SL_DEBUG.activeId'),'hash':p.evaluate('location.hash')})
 ok('all 15 index destinations match active section',all(x['id']==x['active'] for x in links),links)
 p.evaluate('SLMotion.jumpScene("trabalho",0)');p.wait_for_timeout(80);y0=p.evaluate('scrollY')
 c=p.context.new_cdp_session(p)
 c.send('Input.dispatchTouchEvent',{'type':'touchStart','touchPoints':[{'x':195,'y':675}]})
 for y in [625,560,495,430,375]:
  c.send('Input.dispatchTouchEvent',{'type':'touchMove','touchPoints':[{'x':195,'y':y}]});p.wait_for_timeout(24)
 c.send('Input.dispatchTouchEvent',{'type':'touchEnd','touchPoints':[]});p.wait_for_timeout(400)
 y1=p.evaluate('scrollY');sc=p.evaluate('__SL_DEBUG.scenes.find(s=>s.id==="trabalho")')
 ok('native touch swipe moves page and horizontal scene',y1>y0 and sc['visual']>0,{'delta':y1-y0,'phase':sc['visual']})
 # Scrolling must not trigger fresh full geometry measurements.
 m1=p.evaluate('__SL_DEBUG.metrics.measurements')
 for _ in range(6):p.evaluate('scrollBy({top:40,behavior:"instant"})');p.wait_for_timeout(40)
 p.wait_for_timeout(250);m2=p.evaluate('__SL_DEBUG.metrics.measurements')
 ok('geometry cache stable during scroll',m1==m2,{'before':m1,'after':m2})
 # Same spatial leaf state after returning through the same point.
 p.evaluate('SLMotion.jumpScene("espiral",1.35)');p.wait_for_timeout(70);a=p.evaluate('__SL_DEBUG.leaf')
 p.evaluate('SLMotion.jumpScene("espiral",2.8)');p.wait_for_timeout(70)
 p.evaluate('SLMotion.jumpScene("espiral",1.35)');p.wait_for_timeout(70);z=p.evaluate('__SL_DEBUG.leaf')
 delta=max(abs(a[k]-z[k]) for k in ['x','y','rotation'])
 ok('spiral leaf reversible at same progress',delta<1,delta)
 # Dark sections own an explicit leaf occlusion state. The leaf must be
 # hidden through the dark field and return only after its exit band.
 p.evaluate('''id=>{const e=document.getElementById(id),top=e.getBoundingClientRect().top+scrollY;scrollTo({top:top+innerHeight*.20,behavior:"instant"});SLMotion.request(true)}''','processo')
 p.wait_for_function("__SL_DEBUG?.leaf?.occlusionState === 'occluded'",timeout=6000)
 hidden=p.evaluate('({state:__SL_DEBUG.leaf.occlusionState,opacity:getComputedStyle(document.getElementById("leaf-flight")).opacity,visibility:getComputedStyle(document.getElementById("leaf-flight")).visibility})')
 ok('leaf stays hidden in dark process field',hidden['state']=='occluded' and hidden['opacity']=='0' and hidden['visibility']=='hidden',hidden)
 p.evaluate('''id=>{const e=document.getElementById(id),bottom=e.getBoundingClientRect().bottom+scrollY;scrollTo({top:bottom+innerHeight*.30,behavior:"instant"});SLMotion.request(true)}''','processo')
 p.wait_for_function("__SL_DEBUG?.leaf?.occlusionState === 'visible'",timeout=6000)
 shown=p.evaluate('({state:__SL_DEBUG.leaf.occlusionState,opacity:getComputedStyle(document.getElementById("leaf-flight")).opacity,visibility:getComputedStyle(document.getElementById("leaf-flight")).visibility})')
 ok('leaf returns after dark process field',shown['state']=='visible' and shown['visibility']=='visible' and float(shown['opacity'])>0,shown)
 p.evaluate('''id=>{const e=document.getElementById(id),top=e.getBoundingClientRect().top+scrollY;scrollTo({top:top+innerHeight*.35,behavior:"instant"});SLMotion.request(true)}''','espiral')
 p.wait_for_function("__SL_DEBUG?.leaf?.occlusionState === 'occluded'",timeout=6000)
 ok('leaf hides independently in spiral field',p.evaluate('__SL_DEBUG.leaf.occlusionState')=='occluded')
 p.evaluate('SLMotion.jumpSection("soberania")')
 p.wait_for_function("__SL_DEBUG?.leaf?.occlusionState === 'exiting'",timeout=6000)
 exiting=p.evaluate('({state:__SL_DEBUG.leaf.occlusionState,opacity:getComputedStyle(document.getElementById("leaf-flight")).opacity,visibility:getComputedStyle(document.getElementById("leaf-flight")).visibility})')
 ok('leaf begins returning after spiral field',exiting['state']=='exiting' and exiting['visibility']=='visible' and float(exiting['opacity'])>0,exiting)
 p.evaluate('SLMotion.jumpSection("referencias")')
 p.wait_for_function("__SL_DEBUG?.leaf?.occlusionState === 'visible'",timeout=6000)
 ok('leaf fully returns after spiral exit band',p.evaluate('__SL_DEBUG.leaf.occlusionState')=='visible')
 # End position anchored to the real footer dock.
 p.evaluate('scrollTo({top:document.documentElement.scrollHeight,behavior:"instant"})')
 p.wait_for_function("__SL_DEBUG?.leaf?.mode === 'rest'",timeout=2000)
 d=p.evaluate('({leaf:__SL_DEBUG.leaf,dock:document.getElementById("leaf-dock").getBoundingClientRect().toJSON()})')
 ok('final landing matches physical pile anchor',abs(d['leaf']['x']-d['dock']['left'])<1 and abs(d['leaf']['y']-d['dock']['top'])<1,d)
 p.close()
 p=b.new_page(viewport={'width':390,'height':844})
 p.evaluate('history.replaceState(null,"","#nota/ia-sem-magia")');p.set_content(HTML);p.wait_for_function('__SL_DEBUG.ready');p.wait_for_timeout(150)
 ok('direct article hash opens on load',p.locator('#content-dialog').evaluate('(e)=>e.open') and 'IA SEM MAGIA' in p.locator('#dialog-title').inner_text())
 p.locator('#content-dialog [data-close-dialog]').click();p.wait_for_timeout(180)
 ok('direct hash close returns to notebook',not p.locator('#content-dialog').evaluate('(e)=>e.open') and p.evaluate('location.hash')=='#caderno')
 # Horizontal orientation resize without reducing height: current project retained.
 p.evaluate('SLMotion.jumpScene("laboratorio",3)');p.wait_for_timeout(100)
 p.set_viewport_size({'width':1024,'height':768});p.wait_for_timeout(500)
 d=p.evaluate('__SL_DEBUG.scenes.find(s=>s.id==="laboratorio")')
 ok('resize preserves current portfolio phase',abs(d['visual']-3)<.02,d['visual'])
 p.close();b.close()
(R/'additional-results.json').write_text(json.dumps(results,ensure_ascii=False,indent=2))
