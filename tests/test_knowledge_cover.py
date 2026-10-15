"""Editorial knowledge cover: fit, native pin, leaf continuity and reading mode."""
from pathlib import Path
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
with sync_playwright() as pw:
    browser = pw.chromium.launch()
    for width, height in [(320,568),(360,640),(390,724),(390,844),(412,915),(768,1024),(1366,768),(1440,900)]:
        page = browser.new_page(viewport={'width':width,'height':height})
        errors=[]
        page.on('pageerror',lambda error:errors.append(str(error)))
        page.goto((ROOT/'index.html').as_uri())
        page.wait_for_function('window.__SL_DEBUG?.ready')
        page.wait_for_timeout(450)
        state=page.evaluate("""()=>{
          const s=document.querySelector('.knowledge-cover'),stage=s.querySelector('.knowledge-cover-stage'),mast=document.querySelector('#mast').offsetHeight;
          return {start:s.offsetTop-mast,run:parseFloat(s.style.getPropertyValue('--knowledge-hold')),pin:s.dataset.pin,
            height:stage.scrollHeight,viewport:parseFloat(s.style.getPropertyValue('--knowledge-viewport')),
            overflow:document.documentElement.scrollWidth-innerWidth,
            images:[...s.querySelectorAll('img')].every(i=>i.complete&&i.naturalWidth>0)};
        }""")
        assert state['pin']=='true',state
        assert state['height']<=state['viewport']+2,state
        assert state['overflow']<=1 and state['images'],state
        def at(y):
            page.evaluate('(y)=>scrollTo(0,y)',round(y))
            page.wait_for_timeout(45)
            return page.evaluate("""()=>({x:__SL_DEBUG.leaf.x,y:__SL_DEBUG.leaf.y,r:__SL_DEBUG.leaf.rotation,
              stage:document.querySelector('.knowledge-cover-stage').getBoundingClientRect().top,
              bottom:document.querySelector('.knowledge-cover-closing').getBoundingClientRect().bottom})""")
        start,end=state['start'],state['start']+state['run']
        a,b=at(start+state['run']*.25),at(start+state['run']*.7)
        assert abs(a['stage']-b['stage'])<1,(a,b)
        assert b['y']>a['y']+height*.25,(a,b)
        assert b['bottom']<=height+1,b
        for boundary in [start,end,end+state['viewport']]:
            a,b=at(boundary-1),at(boundary+1)
            assert abs(a['x']-b['x'])<3 and abs(a['y']-b['y'])<3 and abs(a['r']-b['r'])<3,(boundary,a,b)
        assert page.evaluate("()=>[...document.querySelectorAll('.knowledge-note')].every(e=>Number(getComputedStyle(e).opacity)>.99)")
        before=at(start+state['run']*.45)
        frozen=page.evaluate('JSON.stringify(__SL_DEBUG.leaf)')
        page.wait_for_timeout(180)
        assert page.evaluate('JSON.stringify(__SL_DEBUG.leaf)')==frozen
        at(end+30)
        assert at(start+state['run']*.45)==before
        if (width,height) in [(390,844),(1366,768)]:
            at(start+state['run']*.8)
            page.screenshot(path=str(ROOT/'tests'/f'knowledge-{width}-preview.png'))
            at(start+state['run']*.45)
        if width==390:
            page.set_viewport_size({'width':width,'height':height+40})
            page.wait_for_timeout(450)
            assert abs(page.evaluate('scrollY')-(start+state['run']*.45))<2
        assert not errors,errors
        print(f'PASS knowledge {width}x{height}: viewport fit, assets, pin, leaf, reverse, idle')
        page.close()
    page=browser.new_page(viewport={'width':390,'height':844},reduced_motion='reduce')
    page.goto((ROOT/'index.html').as_uri())
    page.wait_for_function('window.__SL_DEBUG?.ready')
    assert page.locator('.knowledge-cover').get_attribute('data-pin')=='false'
    assert page.locator('.knowledge-cover-closing').is_visible()
    print('PASS reduced motion: full content, no pin')
    browser.close()
