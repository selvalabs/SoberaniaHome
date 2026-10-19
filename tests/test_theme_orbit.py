"""Theme persistence, contrast and scroll-linked orbit on desktop and phones."""
import argparse
import math
from playwright.sync_api import sync_playwright

parser = argparse.ArgumentParser()
parser.add_argument('--url', default='http://127.0.0.1:4196/')
args = parser.parse_args()

def settle(page):
    page.evaluate('() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))')

def seek(page, y):
    page.evaluate('(y)=>scrollTo({top:y,behavior:"instant"})', y)
    settle(page)
    return page.evaluate('__SL_DEBUG.leaf')

with sync_playwright() as pw:
    browser = pw.chromium.launch()
    for w,h in [(390,844),(1440,900)]:
        context = browser.new_context(viewport={'width':w,'height':h}, color_scheme='light')
        page = context.new_page()
        errors=[]
        page.on('pageerror', lambda error: errors.append(str(error)))
        page.goto(args.url, wait_until='load')
        page.wait_for_function('window.__SL_DEBUG?.ready')
        assert page.locator('html').get_attribute('data-theme') == 'light'
        toggle=page.get_by_role('button',name='Tema escuro',exact=True)
        toggle.focus(); page.keyboard.press('Space')
        assert toggle.get_attribute('aria-pressed') == 'true'
        assert page.evaluate('localStorage.getItem("sl-theme")') == 'dark'
        page.reload();page.wait_for_function('window.__SL_DEBUG?.ready')
        assert page.locator('html').get_attribute('data-theme') == 'dark'
        assert page.evaluate('document.documentElement.scrollWidth <= innerWidth'), 'theme control overflow'
        # A reversal must recover exactly the same attitude and flight path.
        early=[seek(page,y) for y in [0,60,120,240]]
        assert early[-1]['roll']-early[0]['roll']>45,'opening has no visible turn'
        assert early[-1]['clock'] < 240*2.4/h,'fall clock was not slowed'
        saved=seek(page,240);seek(page,700);returned=seek(page,240)
        for key in ['x','y','roll','rotation']:
            assert abs(saved[key]-returned[key])<.01,(key,saved,returned)
        scene=page.evaluate('__SL_DEBUG.scenes.find(s=>s.id==="espiral")')
        quadrants=set()
        for p in [.12,.25,.4,.55,.7,.85]:
            state=seek(page,scene['start']+(scene['end']-scene['start'])*p)
            box=page.locator('#orbit-view').bounding_box()
            cx,cy=box['x']+box['width']/2,box['y']+box['height']/2
            rx=min(box['width'],box['height'])*.29
            distance=math.hypot((state['x']-cx)/rx,(state['y']-cy)/(rx*.84))
            assert state['mode']=='orbit' and abs(distance-1)<.03,(p,state,distance)
            quadrants.add((state['x']>cx,state['y']>cy))
            ring=page.locator('.ring-outer').evaluate('e=>new DOMMatrix(getComputedStyle(e).transform).a')
            assert abs(ring-math.cos(state['orbitPhase']))<.001
            assert page.locator('#leaf-flight').evaluate('e=>Number(getComputedStyle(e).opacity)')>.35
        assert len(quadrants)==4,'leaf did not travel around VIDA'
        middle=scene['start']+(scene['end']-scene['start'])*.5
        orbit_saved=seek(page,middle);seek(page,scene['end']);orbit_returned=seek(page,middle)
        for key in ['x','y','roll','orbitPhase']:
            assert abs(orbit_saved[key]-orbit_returned[key])<.01,('orbit reversal',key)
        # Bounded displacement on both joins; there must be no scene-boundary teleport.
        for y in [scene['start']-h*.32,scene['start'],scene['end'],scene['end']+h*.32]:
            a=seek(page,y-1);b=seek(page,y+1)
            assert math.hypot(a['x']-b['x'],a['y']-b['y'])<18,(a,b)
        frames=page.evaluate('__SL_DEBUG.metrics.frames');page.wait_for_timeout(300)
        assert frames==page.evaluate('__SL_DEBUG.metrics.frames'),'idle animation loop'
        # Theme changes must not move scroll or retain the old ink in the glow.
        seek(page,1000)
        before=page.evaluate('scrollY')
        page.evaluate('document.querySelector("[data-theme-toggle]").click()');settle(page)
        assert abs(page.evaluate('scrollY')-before)<1
        assert page.locator('html').get_attribute('data-theme')=='light'
        ink=page.locator('.hero-title-human').evaluate('e=>({cache:e.style.getPropertyValue("--leaf-ink"),actual:getComputedStyle(e).color})')
        assert ink['cache']==ink['actual'],ink
        # System changes are observed until an explicit preference is made.
        page.locator('[data-theme-preference]').evaluate('e=>{e.value="system";e.dispatchEvent(new Event("change",{bubbles:true}))}')
        page.emulate_media(color_scheme='dark')
        page.wait_for_function('document.documentElement.dataset.theme==="dark"')
        page.evaluate('document.querySelector("[data-theme-toggle]").click()')
        page.emulate_media(color_scheme='light');page.emulate_media(color_scheme='dark')
        assert page.locator('html').get_attribute('data-theme')=='light'
        page.emulate_media(reduced_motion='reduce')
        page.wait_for_function('!__SL_DEBUG.leafEnabled')
        assert page.locator('#leaf-flight').is_hidden()
        page.evaluate('document.querySelector("[data-theme-toggle]").click()')
        # Regressions: legacy paper backgrounds must not survive behind pale ink,
        # including all cards in reading mode and the later editorial instruments.
        contrast=page.evaluate('''()=>{
          const rgb=s=>(s.match(/[\\d.]+/g)||[]).map(Number);
          const lum=c=>c.slice(0,3).map(x=>{x/=255;return x<=.04045?x/12.92:((x+.055)/1.055)**2.4}).reduce((v,x,i)=>v+x*[.2126,.7152,.0722][i],0);
          return [...document.querySelectorAll('.portfolio-card h3,.knowledge-copy-technical,.handover-heading>p,.route-heading>p,.field-note-deck,.reference-cell')].map(e=>{
            const fg=rgb(getComputedStyle(e).color);let parent=e,bg=[24,30,28];
            while(parent){const c=rgb(getComputedStyle(parent).backgroundColor);if(c.length===3||c[3]===1){bg=c;break;}parent=parent.parentElement;}
            const a=lum(fg),b=lum(bg);return (Math.max(a,b)+.05)/(Math.min(a,b)+.05);
          });
        }''')
        assert contrast and min(contrast)>=4.5, min(contrast)
        page.goto(args.url+'perguntas/',wait_until='load')
        page.get_by_role('button',name='Tema escuro',exact=True).click()
        assert page.locator('html').get_attribute('data-theme')=='light'
        assert not errors,errors
        print(f'PASS theme, opening turn, slower reversible flight, VIDA orbit and reduced motion {w}x{h}',flush=True)
        context.close()
    context=browser.new_context(color_scheme='dark')
    context.add_init_script('Object.defineProperty(window,"localStorage",{get(){throw new DOMException("blocked","SecurityError")}})')
    page=context.new_page();page.goto(args.url,wait_until='load')
    assert page.locator('html').get_attribute('data-theme')=='dark'
    page.get_by_role('button',name='Tema escuro',exact=True).click()
    assert page.locator('html').get_attribute('data-theme')=='light'
    print('PASS blocked storage: system theme and in-session toggle',flush=True)
    context.close();browser.close()
