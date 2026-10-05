"""Lateral leaf follows scroll, preserves boundaries, and lights aligned text."""
from pathlib import Path
import sys
from playwright.sync_api import sync_playwright
URL=sys.argv[1] if len(sys.argv)>1 else (Path(__file__).resolve().parents[1]/'index.html').as_uri()
with sync_playwright() as p:
    browser=p.chromium.launch()
    for width,height in [(320,640),(390,844),(1366,900)]:
        page=browser.new_page(viewport={'width':width,'height':height})
        errors=[]
        page.on('pageerror',lambda e:errors.append(str(e)))
        page.goto(URL,wait_until="domcontentloaded");page.wait_for_function('window.__SL_DEBUG?.ready')
        scenes=page.evaluate('__SL_DEBUG.scenes.filter(s=>s.kind==="horizontal"&&!s.static)')
        assert len(scenes)==2
        def at(y):
            page.evaluate('(y)=>scrollTo(0,y)',y);page.wait_for_timeout(45)
            return page.evaluate('({y:__SL_DEBUG.leaf.y,x:__SL_DEBUG.leaf.x,scroll:scrollY,glow:[...document.querySelectorAll("[data-glow]")].map(e=>[e.dataset.glow,e.style.textShadow])})')
        for scene in scenes:
            maximum=0
            xs=[]
            steps=(len(page.locator("#"+scene["id"]+" .portfolio-card").all())-1)
            assert scene["run"]>steps*max(500,scene["frameHeight"])*.95
            for fraction in [0,.2,.4,.6,.8,1]:
                pose=at(scene['start']+scene['run']*fraction)
                xs.append(pose['x'])
                mast=page.locator('#mast').evaluate('e=>e.offsetHeight')
                ratio=(pose['y']-mast)/(height-mast)
                assert .40<ratio<.56,(width,scene['id'],fraction,ratio)
                maximum=max(maximum,max((float(v[0]) for v in pose['glow']),default=0))
            assert max(xs)-min(xs)>width*.12,(width,scene['id'],xs)
            assert maximum>.15,(width,scene['id'],maximum)
            for boundary in [scene['start'],scene['end']]:
                left,right=at(boundary-1),at(boundary+1)
                assert abs(left['y']-right['y'])<3 and abs(left['x']-right['x'])<3,(width,scene['id'],left,right)
            y=scene['start']+scene['run']*.43
            original=at(y);at(scene['end']);returned=at(y)
            assert original==returned
            page.wait_for_timeout(180)
            assert page.evaluate('__SL_DEBUG.leaf.y')==returned['y']
        page.evaluate('SLMotion.setReading(true)');page.wait_for_function('!__SL_DEBUG.enabled')
        page.wait_for_function('[...document.querySelectorAll("[data-glow]")].every(e=>!e.style.textShadow)')
        assert page.evaluate('[...document.querySelectorAll("[data-glow]")].every(e=>!e.style.textShadow)')
        assert not errors,errors
        print(f'PASS {width}x{height}: both scenes, centre, glow, boundaries, reverse, idle, reading')
        page.close()
    page=browser.new_page(viewport={'width':390,'height':844},reduced_motion='reduce')
    page.goto(URL,wait_until="domcontentloaded");page.wait_for_function('window.__SL_DEBUG?.ready')
    assert not page.evaluate('__SL_DEBUG.enabled')
    assert page.evaluate('[...document.querySelectorAll("[data-glow]")].every(e=>!e.style.textShadow)')
    print('PASS reduced motion')
    browser.close()
