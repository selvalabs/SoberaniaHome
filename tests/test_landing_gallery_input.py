from pathlib import Path
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
with sync_playwright() as p:
    browser = p.chromium.launch()
    for width in (390, 1366):
        context = browser.new_context(viewport={'width': width, 'height': 844}, has_touch=True, is_mobile=width == 390)
        page = context.new_page()
        page.set_content('''<style>
body {margin:0;height:1800px} #laboratorio {margin:100px 20px;width:calc(100% - 40px);height:500px}
.landing-phone-rail {display:flex;gap:16px;height:100%;overflow-x:auto;overflow-y:hidden;scroll-snap-type:x proximity;touch-action:pan-x pan-y;overscroll-behavior:contain}
.landing-phone-card {flex:0 0 200px;scroll-snap-align:start;display:grid;grid-template-rows:40px 400px 30px}
.landing-phone-frame {height:400px}.landing-phone-screen {height:100%;overflow-y:auto;overflow-x:hidden;touch-action:pan-y;overscroll-behavior:contain}
.landing-phone-screen img {display:block;width:100%;height:1800px;background:linear-gradient(#eee,#444)}
</style><section id="laboratorio"><figure data-landing-gallery style="margin:0;height:100%"></figure></section>''')
        page.evaluate("window.SLLandingPages=Array.from({length:8},(_,i)=>({key:'test'+i,name:'Landing '+i,kind:'Demo'}))")
        page.add_script_tag(path=str(ROOT / 'demos/landing-collection/gallery.js'))
        rail = page.locator('.landing-phone-rail')
        phones = page.locator('.landing-phone-screen')
        page.mouse.move(100, 200)
        positions = []
        for _ in range(4):
            page.mouse.wheel(0, 25)
            page.wait_for_timeout(350)
            positions.append(rail.evaluate('e=>e.scrollLeft'))
        assert all(b > a for a,b in zip([0]+positions, positions)), positions
        before = positions[-1]
        page.mouse.wheel(-45, 0)
        page.wait_for_timeout(350)
        assert rail.evaluate('e=>e.scrollLeft') < before
        # Both edges must retain the same wheel routing, including over a phone.
        for edge, delta in [(0,-300),(99999,300)]:
            rail.evaluate('(e,x)=>e.scrollLeft=x',edge)
            page.wait_for_timeout(50)
            box = rail.bounding_box()
            page.mouse.move(box['x']+50,box['y']+100)
            y = page.evaluate('scrollY')
            tops = phones.evaluate_all('es=>es.map(e=>e.scrollTop)')
            position = rail.evaluate('e=>e.scrollLeft')
            page.mouse.wheel(0,delta)
            page.wait_for_timeout(350)
            assert rail.evaluate('e=>e.scrollLeft') == position
            assert page.evaluate('scrollY') == y
            assert phones.evaluate_all('es=>es.map(e=>e.scrollTop)') == tops
        rail.evaluate('e=>e.scrollLeft=0')
        page.mouse.move(100,200)
        page.keyboard.down('Shift')
        page.mouse.wheel(0,150)
        page.keyboard.up('Shift')
        page.wait_for_timeout(100)
        assert phones.first.evaluate('e=>e.scrollTop') > 0
        assert rail.evaluate('e=>e.scrollLeft') == 0
        page.mouse.move(170,200)
        page.mouse.down()
        page.mouse.move(70,200,steps=8)
        page.mouse.up()
        assert rail.evaluate('e=>e.scrollLeft') >= 90
        assert rail.get_attribute('data-dragging') is None
        # Real Chromium touch, starting on the inner image.
        rail.evaluate('e=>e.scrollLeft=0')
        phones.first.evaluate('e=>e.scrollTop=0')
        cdp = context.new_cdp_session(page)
        def swipe(start,end):
            cdp.send('Input.dispatchTouchEvent',{'type':'touchStart','touchPoints':[{'x':start[0],'y':start[1]}]})
            for i in range(1,11):
                x=start[0]+(end[0]-start[0])*i/10
                y=start[1]+(end[1]-start[1])*i/10
                cdp.send('Input.dispatchTouchEvent',{'type':'touchMove','touchPoints':[{'x':x,'y':y}]})
                page.wait_for_timeout(20)
            cdp.send('Input.dispatchTouchEvent',{'type':'touchEnd','touchPoints':[]})
            page.wait_for_timeout(400)
        swipe((180,250),(50,250))
        assert rail.evaluate('e=>e.scrollLeft') > 50, 'horizontal touch blocked by phone'
        rail.evaluate('e=>e.scrollLeft=0')
        swipe((100,350),(100,200))
        assert phones.first.evaluate('e=>e.scrollTop') > 50, 'vertical touch blocked'
        print(f'PASS {width}: small wheel settling, reversal, edges, Shift, drag, touch in both axes',flush=True)
        context.close()
    browser.close()
