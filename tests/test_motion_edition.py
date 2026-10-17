"""HTTP smoke tests for the experimental motion runtime.
Run: python tests/test_motion_edition.py --url http://127.0.0.1:4334/
No legacy fixture, root HTML, or generated repository artifacts required.
"""
import argparse
from playwright.sync_api import sync_playwright

parser=argparse.ArgumentParser();parser.add_argument('--url',default='http://127.0.0.1:4334/')
args=parser.parse_args()

def ready(page):
    page.goto(args.url,wait_until='load')
    page.wait_for_function('window.__SL_DEBUG?.ready')
    page.wait_for_timeout(250)

def scene(page,sid,index):
    page.evaluate('([id,i])=>SLMotion.jumpScene(id,i)',[sid,index])
    page.wait_for_function('([id,i])=>__SL_DEBUG.scenes.find(s=>s.id===id).lastIndex===i',arg=[sid,index])
    page.wait_for_timeout(300)

def open_index(page):
    box=page.locator('#open-index').bounding_box()
    page.mouse.click(box['x']+box['width']/2,box['y']+box['height']/2)

with sync_playwright() as pw:
    browser=pw.chromium.launch()
    for w,h in [(390,844),(1440,900)]:
        context=browser.new_context(viewport={'width':w,'height':h},is_mobile=w<760,has_touch=w<760)
        page=context.new_page();page.route_web_socket('**',lambda websocket: None);errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
        ready(page)
        assert page.evaluate('document.documentElement.scrollWidth<=innerWidth'), 'horizontal page overflow'
        for sid in ['processo','espiral']:
            scene(page,sid,2)
            bounds=page.locator(f'#{sid} .scene-frame').bounding_box()
            assert bounds['y']>=0 and bounds['y']+bounds['height']<=h+1,(sid,bounds)
            if sid=='processo':
                rows=page.locator('#processo .process-panel').evaluate_all('(els)=>els.map(e=>({top:e.getBoundingClientRect().top,bottom:e.getBoundingClientRect().bottom,height:e.scrollHeight,client:e.clientHeight}))')
                assert len(rows)==6 and all(r['bottom']<=h-35 and r['height']<=r['client']+2 for r in rows),rows
        page.locator('[data-orbit-node="4"]').click()
        assert page.locator('#orbit-note-title').inner_text()=='Infraestrutura encontra território.'
        page.wait_for_timeout(200);frames=page.evaluate('__SL_DEBUG.metrics.frames');page.wait_for_timeout(400)
        assert page.evaluate('__SL_DEBUG.metrics.frames')==frames,'motion renders at rest'
        scene(page,'trabalho',0)
        page.locator('#trabalho [data-next]').click();page.wait_for_function('__SL_DEBUG.scenes.find(s=>s.id==="trabalho").lastIndex===1')
        page.wait_for_timeout(400)
        page.evaluate('scrollBy({top:-16,behavior:"instant"})');page.wait_for_timeout(280)
        before=page.evaluate('scrollY')
        open_index(page);page.keyboard.press('Escape')
        page.wait_for_function('!document.querySelector("#index-dialog").open')
        assert abs(page.evaluate('scrollY')-before)<3,'modal changes underlying scroll'
        open_index(page);page.locator('#reading-switch').check();page.keyboard.press('Escape')
        page.wait_for_function('!document.querySelector("#index-dialog").open')
        assert not page.evaluate('__SL_DEBUG.enabled')
        assert page.locator('.pin-spacer').count()==0
        assert page.locator('.portfolio-card[inert]').count()==0
        dimensions=page.locator('#processo .sequence').evaluate('(el)=>[el.offsetHeight,el.querySelector(".scene-frame").offsetHeight]')
        assert abs(dimensions[0]-dimensions[1])<2,dimensions
        page.reload(wait_until='load');page.wait_for_function('window.__SL_DEBUG?.ready')
        assert not page.evaluate('__SL_DEBUG.enabled'),'reading preference not persisted'
        page.evaluate('SLMotion.setReading(false)');page.wait_for_function('__SL_DEBUG.enabled')
        page.emulate_media(reduced_motion='reduce');page.wait_for_function('!__SL_DEBUG.enabled')
        open_index(page);page.keyboard.press('Escape');page.wait_for_timeout(150)
        assert not page.evaluate('__SL_DEBUG.enabled'),'closing modal re-enabled reduced motion'
        assert not errors,errors
        print(f'PASS {w}x{h}: scenes, nodes, controls, modal, idle, reading, persistence, reduced motion',flush=True)
        context.close()
    browser.close()
