"""Native page passage alternates with scroll-indexed leaf falls."""
from pathlib import Path
from playwright.sync_api import sync_playwright

URL = (Path(__file__).resolve().parents[1] / 'index.html').as_uri()
with sync_playwright() as pw:
    browser = pw.chromium.launch()
    for width, height in [(320,568),(390,724),(390,844),(1366,768)]:
        page = browser.new_page(viewport={'width':width,'height':height})
        errors=[]
        page.on('pageerror',lambda error:errors.append(str(error)))
        page.goto(URL)
        page.wait_for_function('window.__SL_DEBUG?.ready')
        geometry=page.evaluate("""()=>{
            const c=document.querySelector('#folha'),mast=document.querySelector('#mast').offsetHeight;
            return {hero:parseFloat(document.querySelector('#hero').style.getPropertyValue('--hero-hold')),
              start:c.offsetTop-mast,run:parseFloat(c.style.getPropertyValue('--choices-hold')),viewport:innerHeight-mast};
        }""")
        def at(y):
            page.evaluate('(y)=>scrollTo(0,y)',round(y))
            page.wait_for_timeout(40)
            return page.evaluate("""()=>({x:__SL_DEBUG.leaf.x,y:__SL_DEBUG.leaf.y,r:__SL_DEBUG.leaf.rotation,
              mode:__SL_DEBUG.leaf.mode,background:document.querySelector('.choices-stage').getBoundingClientRect().top,
              scroll:scrollY})""")
        h,s,run,v=geometry['hero'],geometry['start'],geometry['run'],geometry['viewport']
        a,b=at(h+v*.35),at(h+v*.65)
        assert a['mode']==b['mode']=='carried'
        assert abs((b['y']-a['y'])+(b['scroll']-a['scroll']))<2,(a,b)
        assert abs((b['background']-a['background'])-(b['y']-a['y']))<2,(a,b)
        assert b['x']<a['x']-width*.15,(a,b)
        left=at(s)
        assert abs(left['x']-width*.18)<2,left
        a,b=at(s+run*.25),at(s+run*.60)
        assert a['mode']==b['mode']=='chapter-fall'
        assert abs(a['background']-b['background'])<1
        assert b['y']-a['y']>v*.35
        assert abs(at(s+run)['x']-left['x'])>width*.35
        # Every boundary is spatially continuous, including the legacy bridge.
        # The old global-route bridge is now inside the Technology fall,
        # not a hand-off. Its real boundaries are checked by that cover's test.
        boundaries=[h,s,s+run,s+run+v]
        if page.locator('.technology-section').get_attribute('data-pin')!='true':
            boundaries.append(s+run+v*2)
        for boundary in boundaries:
            a,b=at(boundary-1),at(boundary+1)
            assert abs(a['x']-b['x'])<2 and abs(a['y']-b['y'])<3,(boundary,a,b)
            assert abs(a['r']-b['r'])<2,(boundary,a,b)
        a,b=at(s+run+v*.35),at(s+run+v*.65)
        assert a['mode']==b['mode']=='carried'
        assert abs((b['y']-a['y'])+(b['scroll']-a['scroll']))<2
        assert b['x']>a['x']+width*.10,(a,b)
        reference=at(s+run*.45)
        at(s+run+v)
        assert at(s+run*.45)==reference
        stopped=page.evaluate('JSON.stringify({scroll:scrollY,leaf:__SL_DEBUG.leaf})')
        page.wait_for_timeout(250)
        assert page.evaluate('JSON.stringify({scroll:scrollY,leaf:__SL_DEBUG.leaf})')==stopped
        assert not errors,errors
        if width==390 and height==844:
            page.screenshot(path='tests/choices-pinned-preview.png')
        before=page.evaluate('scrollY')
        page.set_viewport_size({'width':width,'height':height+40})
        page.wait_for_timeout(500)
        progress=page.evaluate("""()=>{
            const c=document.querySelector('#folha');
            return (scrollY-(c.offsetTop-document.querySelector('#mast').offsetHeight))/parseFloat(c.style.getPropertyValue('--choices-hold'));
        }""")
        assert abs(progress-.45)<.002,progress
        assert abs(page.evaluate('scrollY')-before)<300
        print(f'PASS chapters {width}x{height}: carried passage, pinned fall, boundaries, reverse, idle, resize')
        page.close()
    page=browser.new_page(viewport={'width':390,'height':844},reduced_motion='reduce')
    page.goto(URL)
    page.wait_for_function('window.__SL_DEBUG?.ready')
    assert page.evaluate("document.querySelector('#folha').dataset.pin === 'false'")
    print('PASS reduced motion: no Choices pin')
    browser.close()
