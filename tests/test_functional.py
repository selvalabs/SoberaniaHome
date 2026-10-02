from pathlib import Path
from playwright.sync_api import sync_playwright
import json,math,time
from common import HTML,R,launch
checks=[]
def record(name,passed,detail=''):
 checks.append({'test':name,'pass':bool(passed),'detail':detail});print(('PASS' if passed else 'FAIL'),name,str(detail)[:140])
with sync_playwright() as pw:
 b=launch(pw)
 p=b.new_page(viewport={'width':390,'height':844},is_mobile=True,has_touch=True,accept_downloads=True)
 errors=[];requests=[];p.on('pageerror',lambda e:errors.append(str(e)));p.on('request',lambda r: requests.append(r.url))
 p.set_content(HTML);p.wait_for_function('__SL_DEBUG?.ready');p.wait_for_timeout(150)
 timed=p.evaluate('''()=>[...document.querySelectorAll('#leaf-flight,#leaf-depth,#wind-leaf,.process-node,.editor-caption')].map(e=>({node:e.id||e.className,transition:getComputedStyle(e).transitionDuration,animation:getComputedStyle(e).animationName}))''')
 record('scroll narrative has no CSS timing transitions',all(x['transition']=='0s' and x['animation']=='none' for x in timed),timed)
 # Touch-dimension controls all main actions reachable and 44px-high.
 record('nav index 15 sections',p.locator('#index-dialog .index-links a').count()==15)
 p.locator('#open-index').click();p.wait_for_timeout(100)
 record('index modal opens',p.locator('#index-dialog').evaluate('(e)=>e.open'))
 p.evaluate('history.back()');p.wait_for_timeout(180)
 record('back closes index',not p.locator('#index-dialog').evaluate('(e)=>e.open'))
 p.locator('#open-index').click();p.locator('#index-dialog a[href="#laboratorio"]').click();p.wait_for_timeout(120)
 record('index jump matches destination',p.evaluate('__SL_DEBUG.activeId')=='laboratorio',p.evaluate('location.hash'))
 # With forward scroll, the leaf follows a strictly descending vertical path.
 fall=[]
 for progress in [0,.04,.12,.25,.40,.60,.80,1]:
  p.evaluate('''p=>{const max=document.documentElement.scrollHeight-innerHeight;scrollTo({top:max*p,behavior:"instant"});SLMotion.request(true)}''',progress);p.wait_for_timeout(35)
  fall.append(p.evaluate('__SL_DEBUG.leaf.y'))
 record('forward scroll never raises leaf',all(fall[i+1]>=fall[i]-.1 for i in range(len(fall)-1)),fall)
 p.evaluate('SLMotion.jumpSection("trabalho")');p.wait_for_timeout(80)
 # Every scene's phase endpoints map to correct, bounded positions.
 for sid in ['trabalho','laboratorio']:
  phases=[]
  for phase in [0,1,2,3,4]:
   p.evaluate('([id,n])=>SLMotion.jumpScene(id,n)',[sid,phase]);p.wait_for_timeout(65)
   phases.append(p.evaluate('(id)=>({x:document.querySelector(`#${id} .portfolio-track`).getBoundingClientRect().x,idx:__SL_DEBUG.scenes.find(s=>s.id===id).lastIndex})',sid))
  diffs=[phases[i+1]['x']-phases[i]['x'] for i in range(4)]
  direction=all(d<0 for d in diffs) if sid=='trabalho' else all(d>0 for d in diffs)
  record(sid+' opposite direction & all cards',direction and [q['idx'] for q in phases]==list(range(5)),diffs)
 # Slow scroll: progressive transforms actually change between endpoints.
 p.evaluate('SLMotion.jumpScene("trabalho",1)');p.wait_for_timeout(80)
 before=p.evaluate('__SL_DEBUG.scenes.find(s=>s.id==="trabalho").visual')
 p.evaluate('scrollBy({top:110,behavior:"instant"})');p.wait_for_timeout(300)
 after=p.evaluate('__SL_DEBUG.scenes.find(s=>s.id==="trabalho").visual')
 record('vertical scroll drives horizontal on mobile',after>before and after-before<.5,{'before':before,'after':after})
 # Visual state must be an exact projection of the document position, even
 # after a large native wheel gesture on a coarse-pointer device.
 p.mouse.move(180,500);p.mouse.wheel(0,1900);p.wait_for_timeout(400)
 d=p.evaluate('__SL_DEBUG');lags=[abs(s['raw']-s['visual']) for s in d['scenes'] if not s['static']]
 record('visual scenes match document scroll exactly',max(lags)<.0001,{'lag':max(lags),'scroll':d['scroll']})
 f1=p.evaluate('__SL_DEBUG.metrics.frames');p.wait_for_timeout(220);f2=p.evaluate('__SL_DEBUG.metrics.frames')
 record('leaf stops promptly after scroll input',p.evaluate('__SL_DEBUG.metrics.idle') and f1==f2,{'before':f1,'after':f2})
 p.wait_for_function('__SL_DEBUG.metrics.idle === true',timeout=4000)
 f1=p.evaluate('__SL_DEBUG.metrics.frames');p.wait_for_timeout(250);f2=p.evaluate('__SL_DEBUG.metrics.frames')
 record('motion RAF stops after scroll settles',f1==f2,{'before':f1,'after':f2})
 # Editor local behavior.
 p.evaluate('SLMotion.jumpScene("editor",2)');p.wait_for_timeout(100)
 p.locator('#enable-editor').click();p.wait_for_timeout(120)
 record('editor explicitly activates',p.locator('#edit-body').get_attribute('contenteditable')=='true')
 p.locator('#edit-body').fill('Documento de teste: autonomia preservada.')
 p.locator('[data-format="bold"]').click()
 record('editor edits and formats real content',p.locator('#edit-body').evaluate('(e)=>e.textContent.includes("autonomia preservada") && e.style.fontWeight==="700"'))
 # Simulated pointer through handle; no dragging via paragraph/ordinary scroll.
 h=p.locator('#move-image').bounding_box();old=p.locator('#demo-image').evaluate('(e)=>e.offsetLeft')
 p.mouse.move(h['x']+h['width']/2,h['y']+h['height']/2);p.mouse.down();p.mouse.move(h['x']+h['width']/2+38,h['y']+h['height']/2+9,steps=6);p.mouse.up()
 new=p.locator('#demo-image').evaluate('(e)=>e.offsetLeft')
 record('editor bounded drag handle',new>old,{'old':old,'new':new})
 p.locator('#more-tools').click();p.locator('#image-angle').fill('25');p.locator('#image-angle').dispatch_event('input')
 record('editor rotation control', '25deg' in p.locator('#demo-image').get_attribute('style'))
 p.locator('#more-tools').click()
 try:
  with p.expect_download(timeout=5000) as dl:p.locator('#export-html').click()
  download=dl.value;dest=R/'editor-export.html';download.save_as(str(dest));text=dest.read_text()
  record('editor portable HTML export', 'autonomia preservada' in text and 'data:image/png;base64,' in text)
 except Exception as e:record('editor portable HTML export',False,str(e))
 p.locator('#enable-editor').click()
 record('editor exits live mode',p.locator('#edit-body').get_attribute('contenteditable')=='false')
 # Note modal return, focus trap, URL and browser back.
 p.evaluate('SLMotion.jumpSection("caderno")');p.wait_for_timeout(100)
 reader=p.locator('.read-link[data-article="ia-sem-magia"]');reader.scroll_into_view_if_needed();p.wait_for_timeout(120);beforeY=p.evaluate('scrollY')
 reader.click();p.wait_for_timeout(100)
 record('article modal & URL',p.locator('#content-dialog').evaluate('(e)=>e.open') and p.evaluate('location.hash')=='#nota/ia-sem-magia')
 record('article pending label honest','Texto em preparação' in p.locator('#dialog-content').inner_text())
 p.keyboard.press('Tab');p.keyboard.press('Tab')
 record('modal focus stays inside',p.evaluate('document.querySelector("#content-dialog").contains(document.activeElement)'))
 p.evaluate('history.back()');p.wait_for_timeout(180)
 record('article back restores scroll',not p.locator('#content-dialog').evaluate('(e)=>e.open') and abs(p.evaluate('scrollY')-beforeY)<3,{'before':beforeY,'after':p.evaluate('scrollY')})
 record('article restores opener focus',p.locator('.read-link[data-article="ia-sem-magia"]').evaluate('(e)=>e===document.activeElement'))
 # Reference filtering.
 p.evaluate('SLMotion.jumpSection("referencias")');p.locator('#open-map').scroll_into_view_if_needed();p.locator('#open-map').click()
 p.locator('[data-topic="2"]').click();record('reference map filters',p.locator('#map-board .map-group').count()==1)
 p.keyboard.press('Escape');p.wait_for_timeout(150)
 record('Escape closes reference modal',not p.locator('#content-dialog').evaluate('(e)=>e.open'))
 # Index mode switch and all-content fallback.
 p.locator('#open-index').click();p.locator('#reading-switch').check();p.locator('#index-dialog [data-close-dialog]').click();p.wait_for_timeout(400)
 record('manual reading mode removes motion',not p.evaluate('__SL_DEBUG.enabled'))
 record('reading mode all project panels accessible',p.locator('.portfolio-card[inert]').count()==0 and p.locator('.process-panel[aria-hidden]').count()==0)
 record('reading mode scene not artificially long',p.locator('#processo .sequence').evaluate('(e)=>e.offsetHeight===e.querySelector(".scene-frame").offsetHeight'))
 p.evaluate('SLMotion.setReading(false)');p.wait_for_timeout(300)
 # Orientation: landscape low height switches to normal reading; restoration to portrait.
 p.set_viewport_size({'width':844,'height':390});p.wait_for_timeout(450)
 record('landscape low-height reading fallback',not p.evaluate('__SL_DEBUG.enabled'))
 p.set_viewport_size({'width':390,'height':844});p.wait_for_timeout(450)
 record('portrait motion restored',p.evaluate('__SL_DEBUG.enabled'))
 # Reduced motion dynamic change.
 p.emulate_media(reduced_motion='reduce');p.wait_for_timeout(300)
 record('OS reduced-motion structural fallback',not p.evaluate('__SL_DEBUG.enabled') and p.locator('.portfolio-card[inert]').count()==0)
 f1=p.evaluate('__SL_DEBUG.metrics.frames');p.wait_for_timeout(250);f2=p.evaluate('__SL_DEBUG.metrics.frames')
 record('RAF stops in reduced mode',f1==f2)
 p.emulate_media(reduced_motion='no-preference');p.wait_for_timeout(220)
 record('no visual scroll playhead remains',p.evaluate('!Object.hasOwn(SLMotion,"math")'))
 # Final pose after direct End, then reverse.
 p.evaluate('scrollTo({top:document.documentElement.scrollHeight,behavior:"instant"})')
 p.wait_for_function("__SL_DEBUG?.leaf?.mode === 'rest'",timeout=6000)
 end=p.evaluate('__SL_DEBUG');record('End reaches leaf rest',end['leaf']['mode']=='rest')
 p.evaluate('SLMotion.jumpSection("hero")');p.wait_for_timeout(150)
 record('Home reverses leaf to branch',p.evaluate('__SL_DEBUG.leaf.mode')=='branch')
 record('no console errors',not errors,errors)
 record('no external requests',not any(u.startswith(('https://','http://')) for u in requests),len(requests))
 p.close()
 # Fine-pointer wheel input is smoothed by moving the actual document, never
 # by delaying the leaf or the scene transforms.
 c=b.new_context(viewport={'width':1280,'height':820})
 p=c.new_page();p.set_content(HTML);p.wait_for_function('__SL_DEBUG?.ready');p.wait_for_timeout(120)
 # The leaf can be picked up with a mouse without changing document scroll;
 # after release its intentional pendulum settles back on the scroll route.
 p.evaluate('scrollTo({top:1200,behavior:"instant"});SLMotion.request(true)');p.wait_for_timeout(80)
 box=p.locator('#wind-leaf').bounding_box();before_drag=p.evaluate('__SL_DEBUG')
 p.mouse.move(box['x']+box['width']/2,box['y']+box['height']/2);p.mouse.down();p.mouse.move(box['x']+box['width']/2+105,box['y']+box['height']/2-55,steps=4);p.wait_for_timeout(45)
 held=p.evaluate('__SL_DEBUG')
 record('mouse can pick up leaf without scrolling document',held['leaf']['drag']['active'] and held['scroll']['actual']==before_drag['scroll']['actual'] and math.hypot(held['leaf']['x']-before_drag['leaf']['x'],held['leaf']['y']-before_drag['leaf']['y'])>65,{'before':before_drag['leaf'],'held':held['leaf'],'scroll':held['scroll']['actual']})
 p.mouse.up();p.wait_for_timeout(3600)
 returned=p.evaluate('__SL_DEBUG')
 record('released leaf settles back on scroll route',not returned['leaf']['drag']['active'] and not returned['leaf']['drag']['returning'] and math.hypot(returned['leaf']['x']-returned['leaf']['drag']['baseX'],returned['leaf']['y']-returned['leaf']['drag']['baseY'])<1.2,{'leaf':returned['leaf']})
 # The process board builds with scroll but one desktop piece may be placed by
 # hand in its matching outline without changing document position.
 p.evaluate('SLMotion.jumpScene("processo",0)');p.wait_for_timeout(100)
 piece=p.locator('[data-process-piece="0"]');piece_box=piece.bounding_box();process_before=p.evaluate('scrollY')
 slot=p.evaluate('''()=>{const stage=document.querySelector('#processo .process-stage'),piece=document.querySelector('[data-process-piece="0"]'),r=stage.getBoundingClientRect(),scale=piece.offsetWidth/662;return {x:r.x+r.width*.42-498*scale,y:r.y+r.height*.5-212*scale}}''')
 p.mouse.move(piece_box['x']+piece_box['width']/2,piece_box['y']+piece_box['height']/2);p.mouse.down();p.mouse.move(slot['x'],slot['y'],steps=6);p.mouse.up();p.wait_for_timeout(100)
 record('process piece snaps into matching outline',piece.evaluate('(e)=>e.classList.contains("is-assembled")') and p.evaluate('scrollY')==process_before,{'scroll':p.evaluate('scrollY'),'class':piece.get_attribute('class')})
 p.evaluate('SLMotion.jumpScene("processo",5)');p.wait_for_timeout(100)
 record('process board completes from scroll alone',p.locator('#processo .process-node.is-assembled').count()==6,p.locator('#processo .process-node.is-assembled').count())
 takeoff=[]
 for y in range(180,1001,25):
  p.evaluate('''y=>{scrollTo({top:y,behavior:"instant"});SLMotion.request(true)}''',y);p.wait_for_timeout(18)
  takeoff.append(p.evaluate('({x:__SL_DEBUG.leaf.x,y:__SL_DEBUG.leaf.y})'))
 takeoff_steps=[math.hypot(takeoff[i+1]['x']-takeoff[i]['x'],takeoff[i+1]['y']-takeoff[i]['y']) for i in range(len(takeoff)-1)]
 record('leaf takeoff has no positional jump',max(takeoff_steps)<55,{'maxStep':max(takeoff_steps),'steps':takeoff_steps[:10]})
 # Sample the whole scroll route at a short, fixed document distance. This
 # catches a target that switches sides abruptly even when it occurs far from
 # the initial release sequence.
 max_scroll=p.evaluate('document.documentElement.scrollHeight-innerHeight')
 route=[]
 for y in range(0,int(max_scroll)+1,120):
  p.evaluate('''y=>{scrollTo({top:y,behavior:"instant"});SLMotion.request(true)}''',y);p.wait_for_timeout(12)
  route.append(p.evaluate('({scroll:__SL_DEBUG.scroll.actual,x:__SL_DEBUG.leaf.x,y:__SL_DEBUG.leaf.y,mode:__SL_DEBUG.leaf.mode,active:__SL_DEBUG.activeId})'))
 if route[-1]['scroll']<max_scroll:
  p.evaluate('''y=>{scrollTo({top:y,behavior:"instant"});SLMotion.request(true)}''',max_scroll);p.wait_for_timeout(12)
  route.append(p.evaluate('({scroll:__SL_DEBUG.scroll.actual,x:__SL_DEBUG.leaf.x,y:__SL_DEBUG.leaf.y,mode:__SL_DEBUG.leaf.mode,active:__SL_DEBUG.activeId})'))
 route_steps=[{'fromScroll':route[i]['scroll'],'scroll':route[i+1]['scroll'],'fromX':route[i]['x'],'toX':route[i+1]['x'],'dx':abs(route[i+1]['x']-route[i]['x']),'fromActive':route[i]['active'],'active':route[i+1]['active'],'mode':route[i+1]['mode']} for i in range(len(route)-1) if route[i]['scroll']>=250]
 largest_route_steps=sorted(route_steps,key=lambda step:step['dx'],reverse=True)[:5]
 record('leaf route has no horizontal punch',max(step['dx'] for step in route_steps)<60,{'largest':largest_route_steps})
 p.evaluate('scrollTo({top:0,behavior:"instant"});SLMotion.request(true)');p.wait_for_timeout(60)
 p.evaluate('''()=>{window.__scrollTrace=[];const until=performance.now()+1400;const sample=t=>{window.__scrollTrace.push({t,y:scrollY,active:__SL_DEBUG.scroll.controllerActive});if(t<until)requestAnimationFrame(sample)};requestAnimationFrame(sample)}''')
 before=p.evaluate('__SL_DEBUG.scroll.actual');p.mouse.move(600,400);p.mouse.wheel(0,1200);p.wait_for_timeout(55)
 mid=p.evaluate('__SL_DEBUG')
 record('wheel controller moves document scroll',mid['scroll']['actual']>before and mid['scroll']['controllerActive'],{'before':before,'mid':mid['scroll']})
 p.wait_for_function('__SL_DEBUG.scroll.controllerActive === false',timeout=2000)
 end=p.evaluate('__SL_DEBUG');lags=[abs(s['raw']-s['visual']) for s in end['scenes'] if not s['static']]
 record('wheel settles with leaf directly on document scroll',not end['scroll']['controllerActive'] and max(lags)<.0001 and end['scroll']['actual']==end['scroll']['target'],{'scroll':end['scroll'],'lag':max(lags)})
 trace=p.evaluate('window.__scrollTrace');steps=[trace[i]['y']-trace[i-1]['y'] for i in range(1,len(trace)) if trace[i]['active'] and trace[i]['y']>trace[i-1]['y']]
 record('wheel scroll accelerates through small continuous steps',len(steps)>6 and max(steps)<=30 and steps[2]>steps[0],{'frames':len(steps),'min':min(steps) if steps else None,'max':max(steps) if steps else None,'steps':steps[:12]})
 p.close();c.close()
 # No JavaScript content is still a usable document.
 c=b.new_context(viewport={'width':390,'height':844},java_script_enabled=False)
 p=c.new_page();p.set_content(HTML)
 record('no-JS all sections present',p.locator('main>.section').count()==15 and p.locator('.process-panel').count()==5)
 record('no-JS navigation available',p.locator('.no-js-index a').count()==15)
 record('no-JS no page width overflow',p.locator('html').evaluate('(e)=>e.scrollWidth<=390'))
 c.close();b.close()
(R/'functional-results.json').write_text(json.dumps(checks,ensure_ascii=False,indent=2))
print('RESULT',sum(c['pass'] for c in checks),'/',len(checks))
