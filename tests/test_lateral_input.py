"""Real wheel and mobile swipe input drive the same slow, indexed scene."""
from pathlib import Path
import sys
from playwright.sync_api import sync_playwright
URL=sys.argv[1] if len(sys.argv)>1 else (Path(__file__).resolve().parents[1]/'index.html').as_uri()
with sync_playwright() as p:
    browser=p.chromium.launch()
    page=browser.new_page(viewport={'width':1366,'height':900})
    page.goto(URL,wait_until='domcontentloaded');page.wait_for_function('window.__SL_DEBUG?.ready')
    scenes=page.evaluate('__SL_DEBUG.scenes.filter(s=>s.kind==="horizontal")')
    for scene in scenes:
        page.evaluate('(y)=>scrollTo(0,y)',scene['start']+scene['run']*.4);page.wait_for_timeout(80)
        before=page.evaluate('scrollY');page.mouse.move(1000,450);page.mouse.wheel(0,200);page.wait_for_timeout(100)
        delta=page.evaluate('scrollY')-before
        assert 85<=delta<=95,(scene['id'],delta)
        rotations=[]
        for fraction in [0,.25,.5,.75,1]:
            page.evaluate('(y)=>scrollTo(0,y)',scene['start']+scene['run']*fraction);page.wait_for_timeout(45)
            rotations.append(page.evaluate('__SL_DEBUG.leaf.rotation'))
        assert max(rotations)-min(rotations)>250,(scene['id'],rotations)
    page.evaluate('scrollTo(0,0)');page.wait_for_timeout(80)
    page.mouse.move(1000,450);page.mouse.wheel(0,200);page.wait_for_timeout(200)
    assert page.evaluate('scrollY')>=190
    print('PASS desktop: wheel 200px -> 90px in both galleries; wind rotation; native wheel outside')
    page.close()
    page=browser.new_page(viewport={'width':390,'height':844},is_mobile=True,has_touch=True)
    page.goto(URL,wait_until='domcontentloaded');page.wait_for_function('window.__SL_DEBUG?.ready')
    cdp=page.context.new_cdp_session(page)
    def swipe(x,y,dx,dy):
        cdp.send('Input.dispatchTouchEvent',{'type':'touchStart','touchPoints':[{'x':x,'y':y}]})
        for i in range(1,8):
            cdp.send('Input.dispatchTouchEvent',{'type':'touchMove','touchPoints':[{'x':x+dx*i/7,'y':y+dy*i/7}]});page.wait_for_timeout(20)
        cdp.send('Input.dispatchTouchEvent',{'type':'touchEnd','touchPoints':[]});page.wait_for_timeout(100)
    scenes=page.evaluate('__SL_DEBUG.scenes.filter(s=>s.kind==="horizontal")')
    for scene in scenes:
        page.evaluate('(y)=>scrollTo(0,y)',scene['start']+scene['run']*.5);page.wait_for_timeout(80)
        direction=page.locator('#'+scene['id']+' .sequence').get_attribute('data-direction')
        before=page.evaluate('scrollY');swipe(265,350,-140,0)
        delta=page.evaluate('scrollY')-before
        assert delta*(-1 if direction=='reverse' else 1)>50,(scene['id'],delta,direction)
        stopped=page.evaluate('scrollY');page.wait_for_timeout(250);assert page.evaluate('scrollY')==stopped
        swipe(125,350,140,0);assert abs(page.evaluate('scrollY')-before)<5
        before=page.evaluate('scrollY');swipe(265,380,0,-140)
        delta=page.evaluate('scrollY')-before
        assert 65<=delta<=85,(scene['id'],'vertical',delta)
    page.evaluate('SLMotion.jumpScene("trabalho",1)');page.wait_for_timeout(80)
    button=page.locator('#trabalho [data-next]').bounding_box()
    x=button['x']+button['width']/2;y=button['y']+button['height']/2
    cdp.send('Input.dispatchTouchEvent',{'type':'touchStart','touchPoints':[{'x':x,'y':y}]})
    cdp.send('Input.dispatchTouchEvent',{'type':'touchEnd','touchPoints':[]});page.wait_for_timeout(100)
    assert page.evaluate('__SL_DEBUG.scenes.find(s=>s.id==="trabalho").lastIndex')==2
    scene=page.evaluate('__SL_DEBUG.scenes.find(s=>s.id==="trabalho")')
    page.evaluate('(y)=>scrollTo(0,y)',scene['end']);page.wait_for_timeout(80)
    swipe(265,380,0,-140)
    assert page.evaluate('scrollY')>scene['end']+5
    print('PASS mobile: horizontal swipe both directions and both galleries; slowed vertical swipe; no drift; controls and vertical exit')
    browser.close()
