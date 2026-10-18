"""Scroll-linked movement must work with mobile browser chrome present."""
import argparse
from playwright.sync_api import sync_playwright
parser=argparse.ArgumentParser();parser.add_argument('--url',default='http://127.0.0.1:4200/')
args=parser.parse_args()
with sync_playwright() as pw:
    browser=pw.chromium.launch()
    for w,h in [(360,640),(390,690),(1440,900)]:
        context=browser.new_context(viewport={'width':w,'height':h},is_mobile=w<760,has_touch=w<760)
        page=context.new_page();page.goto(args.url,wait_until='load')
        page.wait_for_function('window.__SL_DEBUG?.ready')
        assert page.evaluate('__SL_DEBUG.enabled'),'short viewport disabled scroll scrub'
        for sid,sign in [('trabalho',-1),('laboratorio',1)]:
            page.evaluate('(id)=>SLMotion.jumpScene(id,0)',sid)
            page.wait_for_function('(id)=>Math.abs(__SL_DEBUG.scenes.find(s=>s.id===id).raw)<.01',arg=sid)
            page.wait_for_timeout(250)
            track=page.locator(f'#{sid} .portfolio-track')
            initial=track.evaluate('el=>new DOMMatrix(getComputedStyle(el).transform).m41')
            title=page.locator(f'#{sid} .portfolio-card h3').first.bounding_box()
            gesture_y=title['y']+title['height']/2
            if w<760:
                client=context.new_cdp_session(page)
                client.send('Input.dispatchTouchEvent',{'type':'touchStart','touchPoints':[{'x':w*.5,'y':gesture_y}]})
                for step in range(1,13):
                    client.send('Input.dispatchTouchEvent',{'type':'touchMove','touchPoints':[{'x':w*.5,'y':gesture_y-step*7}]})
                    page.wait_for_timeout(30)
                client.send('Input.dispatchTouchEvent',{'type':'touchEnd','touchPoints':[]});client.detach()
            else:
                page.mouse.move(w*.4,gesture_y);page.mouse.wheel(0,140)
            page.wait_for_timeout(350)
            current=track.evaluate('el=>new DOMMatrix(getComputedStyle(el).transform).m41')
            assert (current-initial)*sign>20,('vertical input did not scrub',sid,initial,current)
            state=page.evaluate('(id)=>__SL_DEBUG.scenes.find(s=>s.id===id)',sid)
            assert 0<state['raw']<1,('scrub skipped instead of following scroll',state)
            bounds=page.locator(f'#{sid} .scene-frame').bounding_box()
            assert bounds['y']>=-1 and bounds['y']+bounds['height']<=h+1,bounds
            # Crossing either endpoint resumes native document flow.
            page.evaluate('(id)=>{const s=__SL_DEBUG.scenes.find(s=>s.id===id);scrollTo({top:s.end+180,behavior:"instant"})}',sid)
            page.wait_for_timeout(80)
            assert page.locator(f'#{sid} .scene-frame').bounding_box()['y']<0
        # The glow is colored ink with a band in text coordinates, not a gold shadow.
        page.evaluate('''()=>{const r=document.querySelector('.choices-closing strong').getBoundingClientRect();scrollTo({top:scrollY+r.top+r.height/2-innerHeight*.49,behavior:'instant'})}''')
        page.wait_for_function('document.querySelector(".choices-closing [data-leaf-lit]")')
        mark=page.locator('.choices-closing [data-leaf-lit]').first
        style=mark.evaluate('el=>({fill:getComputedStyle(el.querySelector(".leaf-ink")).webkitTextFillColor,image:getComputedStyle(el.querySelector(".leaf-ink")).backgroundImage,y:el.style.getPropertyValue("--leaf-light-y")})')
        assert style['fill']=='rgba(0, 0, 0, 0)' and 'linear-gradient' in style['image'] and style['y'],style
        leaf=page.locator('#wind-leaf').bounding_box()
        assert leaf['width']>leaf['height']*1.2,('leaf stands upright',leaf)
        first_hue=mark.evaluate('el=>el.style.getPropertyValue("--leaf-hue")')
        page.evaluate('scrollBy({top:24,behavior:"instant"})');page.wait_for_timeout(80)
        assert mark.evaluate('el=>el.style.getPropertyValue("--leaf-hue")')!=first_hue
        frames=page.evaluate('__SL_DEBUG.metrics.frames');page.wait_for_timeout(300)
        assert page.evaluate('__SL_DEBUG.metrics.frames')==frames,'animation loops while idle'
        page.evaluate('SLMotion.setReading(true)');page.wait_for_function('!__SL_DEBUG.leafEnabled')
        assert not page.locator('[data-leaf-lit]').count()
        print(f'PASS flow {w}x{h}: vertical gestures scrub both galleries, endpoint release, colored ink follows leaf, horizontal floating posture, idle and reading',flush=True)
        context.close()
    browser.close()
