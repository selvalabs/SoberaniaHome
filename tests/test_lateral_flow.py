"""Excess lateral input hands off through either gallery boundary."""
from pathlib import Path
import sys
from playwright.sync_api import sync_playwright
URL=sys.argv[1] if len(sys.argv)>1 else (Path(__file__).resolve().parents[1]/'index.html').as_uri()
with sync_playwright() as p:
    browser=p.chromium.launch()
    page=browser.new_page(viewport={'width':1366,'height':900})
    page.goto(URL,wait_until='domcontentloaded');page.wait_for_function('window.__SL_DEBUG?.ready')
    scenes=page.evaluate('__SL_DEBUG.scenes.filter(s=>s.kind==="horizontal")')
    for s in scenes:
        direction=-1 if page.locator('#'+s['id']+' .sequence').get_attribute('data-direction')=='reverse' else 1
        for edge,sign in [('end',1),('start',-1)]:
            y=s['end']-s['run']*.03 if edge=='end' else s['start']+s['run']*.03
            page.evaluate('(y)=>scrollTo(0,y)',y);page.wait_for_timeout(60);before=page.evaluate('scrollY')
            page.mouse.move(1000,300);page.mouse.wheel(sign*direction*600,0);page.wait_for_timeout(60)
            after=page.evaluate('scrollY')
            assert after>s['end']+5 if edge=='end' else after<s['start']-5,(s['id'],edge,before,after)
            page.mouse.wheel(0,sign*100);page.wait_for_timeout(60)
            next_scroll=page.evaluate('scrollY')
            assert abs(next_scroll-after-sign*100)<3,(s['id'],edge,after,next_scroll)
    for s in scenes:
        direction=-1 if page.locator('#'+s['id']+' .sequence').get_attribute('data-direction')=='reverse' else 1
        for edge,sign in [('end',1),('start',-1)]:
            y=s['end']-s['run']*.03 if edge=='end' else s['start']+s['run']*.03
            page.evaluate('(y)=>scrollTo(0,y)',y);page.wait_for_timeout(60);before=page.evaluate('scrollY')
            page.mouse.move(1000,300);page.mouse.down();page.mouse.move(1000-direction*sign*340,300,steps=12);page.wait_for_timeout(60)
            after=page.evaluate('scrollY')
            assert after>s['end']+5 if edge=='end' else after<s['start']-5,(s['id'],edge,'mouse',before,after)
            page.mouse.move(1000-direction*sign*440,300,steps=5);page.wait_for_timeout(50)
            continued=page.evaluate('scrollY')
            assert (continued>after+20 if edge=='end' else continued<after-20)
            page.mouse.up();page.wait_for_timeout(50)
    print('PASS mouse drag: excess exits both edges and continues vertically while held')
    print('PASS wheel: overrun hands off past both edges of both galleries; next vertical scroll follows the page')
    page.close()
    page=browser.new_page(viewport={'width':390,'height':844},is_mobile=True,has_touch=True)
    page.goto(URL,wait_until='domcontentloaded');page.wait_for_function('window.__SL_DEBUG?.ready')
    cdp=page.context.new_cdp_session(page)
    def swipe(x,y,dx,dy):
        cdp.send('Input.dispatchTouchEvent',{'type':'touchStart','touchPoints':[{'x':x,'y':y}]})
        for i in range(1,15):
            cdp.send('Input.dispatchTouchEvent',{'type':'touchMove','touchPoints':[{'x':x+dx*i/14,'y':y+dy*i/14}]});page.wait_for_timeout(8)
        cdp.send('Input.dispatchTouchEvent',{'type':'touchEnd','touchPoints':[]});page.wait_for_timeout(80)
    scenes=page.evaluate('__SL_DEBUG.scenes.filter(s=>s.kind==="horizontal")')
    for s in scenes:
        direction=-1 if page.locator('#'+s['id']+' .sequence').get_attribute('data-direction')=='reverse' else 1
        for edge,sign in [('end',1),('start',-1)]:
            y=s['end']-s['run']*.03 if edge=='end' else s['start']+s['run']*.03
            page.evaluate('(y)=>scrollTo(0,y)',y);page.wait_for_timeout(80)
            before=page.evaluate('scrollY')
            swipe(340,380,-direction*300*sign,0);after=page.evaluate('scrollY')
            assert after>s['end']+5 if edge=='end' else after<s['start']-5,(s['id'],edge,before,after)
            swipe(200,380,0,-sign*100);following=page.evaluate('scrollY')
            assert (following>after+30 if edge=='end' else following<after-30),(s['id'],edge,after,following)
    print('PASS touch: excess horizontal swipe exits both gallery edges; next vertical swipe follows the page')
    browser.close()
