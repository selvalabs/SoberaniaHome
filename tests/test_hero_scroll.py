"""Hero pin, scroll-only lettering and viewport-resize regression checks."""
from pathlib import Path
from playwright.sync_api import sync_playwright

URL = (Path(__file__).resolve().parents[1] / 'index.html').as_uri()

with sync_playwright() as pw:
    browser = pw.chromium.launch()
    for width, height in [(320, 568), (360, 640), (390, 724), (390, 760), (390, 844), (1366, 768), (1440, 900)]:
        page = browser.new_page(viewport={'width': width, 'height': height})
        errors = []
        page.on('pageerror', lambda error: errors.append(str(error)))
        page.goto(URL)
        page.wait_for_function('window.__SL_DEBUG?.ready')
        assert page.evaluate("document.querySelector('#hero').dataset.pin === 'true'")
        assert page.evaluate('document.documentElement.scrollWidth <= innerWidth')
        assert page.evaluate("document.querySelector('.hero-copy .text-actions').getBoundingClientRect().bottom <= innerHeight")
        assert page.evaluate("""()=>{
            const a=document.querySelector('.hero-title-block').getBoundingClientRect();
            const b=document.querySelector('.hero-identity').getBoundingClientRect();
            return Math.abs(a.left-b.left)<1 && Math.abs(a.right-b.right)<1;
        }""")
        hold = page.evaluate("parseFloat(document.querySelector('#hero').style.getPropertyValue('--hero-hold'))")
        positions = []
        for progress in [0.5, 1, 1.001]:
            page.evaluate('(y)=>scrollTo(0,y)', round(hold * progress))
            page.wait_for_timeout(80)
            positions.append(page.evaluate("""()=>({
                stage:document.querySelector('.hero-stage').getBoundingClientRect().top,
                mast:document.querySelector('#mast').getBoundingClientRect().height,
                leaf:__SL_DEBUG.leaf.y
            })"""))
        assert abs(positions[0]['stage'] - positions[0]['mast']) < 1
        assert abs(positions[1]['stage'] - positions[1]['mast']) < 1
        assert height - 89 <= positions[1]['leaf'] <= height - 50
        assert abs(positions[2]['leaf'] - positions[1]['leaf']) < 1
        # Near the edge, vertical progress slows; the native page then releases.
        late_fall = []
        for progress in [.80, .90, .95, .99, 1]:
            page.evaluate('(y)=>scrollTo(0,y)', round(hold * progress))
            page.wait_for_timeout(40)
            late_fall.append(page.evaluate('__SL_DEBUG.leaf.y'))
        assert all(b >= a - .01 for a, b in zip(late_fall, late_fall[1:]))
        assert (late_fall[-1] - late_fall[-2]) / .01 < (late_fall[1] - late_fall[0]) / .10
        choices_start = page.evaluate("document.querySelector('#folha').offsetTop-document.querySelector('#mast').offsetHeight")
        page.evaluate('(y)=>scrollTo(0,y)', round((hold + choices_start) / 2))
        page.wait_for_timeout(80)
        assert page.evaluate("__SL_DEBUG.leaf.mode === 'carried'")
        assert page.evaluate('__SL_DEBUG.leaf.y') < positions[1]['leaf']
        assert page.evaluate("document.querySelector('.hero-stage').getBoundingClientRect().top < document.querySelector('#mast').offsetHeight")
        assert page.evaluate('__SL_DEBUG.scroll.controllerActive === false')
        page.evaluate('(y)=>scrollTo(0,y)', round(hold / 2))
        page.wait_for_timeout(80)
        assert abs(page.evaluate('__SL_DEBUG.leaf.y') - positions[0]['leaf']) < 1
        assert page.evaluate("new Set([...document.querySelectorAll('.eyebrow-glyph')].map(e=>e.style.color)).size > 5")
        state = page.evaluate("JSON.stringify({leaf:__SL_DEBUG.leaf,colors:[...document.querySelectorAll('.eyebrow-glyph')].map(e=>e.style.color),scroll:scrollY})")
        glow_state = page.evaluate("[...document.querySelectorAll('.hero-message [data-glow]')].map(e=>e.style.textShadow)")
        page.wait_for_timeout(250)
        assert page.evaluate("JSON.stringify({leaf:__SL_DEBUG.leaf,colors:[...document.querySelectorAll('.eyebrow-glyph')].map(e=>e.style.color),scroll:scrollY})") == state
        assert page.evaluate("[...document.querySelectorAll('.hero-message [data-glow]')].map(e=>e.style.textShadow)") == glow_state
        copy_top = page.evaluate("document.querySelector('.hero-copy').getBoundingClientRect().top")
        page.set_viewport_size({'width': width, 'height': height + 40})
        page.wait_for_timeout(500)
        assert abs(page.evaluate("document.querySelector('.hero-copy').getBoundingClientRect().top") - copy_top) < 1
        expected_height = height if width < 760 else height + 40
        assert page.evaluate("(h)=>Math.abs(document.querySelector('.hero-stage').getBoundingClientRect().height - (h-document.querySelector('#mast').offsetHeight)) < 1", expected_height)
        assert page.evaluate("Math.abs(scrollY / parseFloat(document.querySelector('#hero').style.getPropertyValue('--hero-hold')) - .5) < .002")
        assert 'processos inteligentes' in page.locator('.hero-method').inner_text()
        peak_glow = 0
        new_hold = page.evaluate("parseFloat(document.querySelector('#hero').style.getPropertyValue('--hero-hold'))")
        for step in range(1, 21):
            page.evaluate('(y)=>scrollTo(0,y)', round(new_hold * step / 20))
            page.wait_for_timeout(40)
            peak_glow = max(peak_glow, page.evaluate("Math.max(...[...document.querySelectorAll('.hero-message [data-glow]')].map(e=>+e.dataset.glow))"))
        assert peak_glow > .8
        # With the earlier launch, the leaf may still be next to the last
        # paragraph at the exact pin boundary. It quiets once that block passes.
        page.evaluate('(y)=>scrollTo(0,y)', round(new_hold + max(1600, min((height + 40) * 2.8, 3000))))
        page.wait_for_timeout(80)
        assert page.evaluate("[...document.querySelectorAll('.hero-message [data-glow]')].every(e=>+e.dataset.glow === 0 && e.style.textShadow === '')")
        assert not errors, errors
        print(f'PASS hero {width}x{height}: alignment, pin, handoff, idle, reverse, stable text on resize, proximity glow')
        page.close()
    # A stale scene used to teleport the reader thousands of pixels when
    # mobile browser chrome resized after returning to the leaf's glide.
    page = browser.new_page(viewport={'width': 390, 'height': 844})
    page.goto(URL)
    page.wait_for_function('window.__SL_DEBUG?.ready')
    for height in [800, 844, 760, 844]:
        page.evaluate("SLMotion.jumpScene('trabalho', 2)")
        page.wait_for_timeout(100)
        hold = page.evaluate("parseFloat(document.querySelector('#hero').style.getPropertyValue('--hero-hold'))")
        page.evaluate('(y)=>scrollTo(0,y)', hold + 150)
        page.wait_for_timeout(100)
        before = page.evaluate('({scroll:scrollY,x:__SL_DEBUG.leaf.x})')
        page.set_viewport_size({'width': 390, 'height': height})
        page.wait_for_timeout(500)
        after = page.evaluate('({scroll:scrollY,x:__SL_DEBUG.leaf.x})')
        assert abs(after['scroll'] - before['scroll']) < 300, (before, after)
        assert abs(after['x'] - before['x']) < 10, (before, after)
        still = page.evaluate('scrollY')
        page.wait_for_timeout(250)
        assert page.evaluate('scrollY') == still
    print('PASS mobile toolbar resize after scene navigation: no stale-scene teleport or lateral snap')
    page.close()
    page = browser.new_page(viewport={'width': 390, 'height': 844})
    page.goto(URL)
    page.wait_for_function('window.__SL_DEBUG?.ready')
    hold = page.evaluate("parseFloat(document.querySelector('#hero').style.getPropertyValue('--hero-hold'))")
    samples = []
    for y in range(round(hold) - 40, round(hold + 844 * 2.8) + 41, 20):
        page.evaluate('(y)=>scrollTo(0,y)', y)
        page.wait_for_timeout(30)
        samples.append(page.evaluate('({scroll:scrollY,x:__SL_DEBUG.leaf.x,r:__SL_DEBUG.leaf.rotation})'))
    horizontal_step = max(abs(b['x'] - a['x']) for a, b in zip(samples, samples[1:]))
    rotation_step = max(abs(b['r'] - a['r']) for a, b in zip(samples, samples[1:]))
    assert horizontal_step < 10, horizontal_step
    assert rotation_step < 5, rotation_step
    assert all(b['scroll'] - a['scroll'] == 20 for a, b in zip(samples, samples[1:]))
    page.mouse.wheel(0, 120)
    page.wait_for_timeout(300)
    stopped = page.evaluate('JSON.stringify({scroll:scrollY,leaf:__SL_DEBUG.leaf})')
    page.wait_for_timeout(300)
    assert page.evaluate('JSON.stringify({scroll:scrollY,leaf:__SL_DEBUG.leaf})') == stopped
    print(f'PASS chapter continuity: max {horizontal_step:.2f}px / {rotation_step:.2f}deg per 20px scroll; no residual wheel drift')
    page.close()
    page = browser.new_page(viewport={'width': 390, 'height': 844}, reduced_motion='reduce')
    page.goto(URL)
    page.wait_for_function('window.__SL_DEBUG?.ready')
    assert page.evaluate("document.querySelector('#hero').dataset.pin === 'false' && !__SL_DEBUG.enabled")
    print('PASS reduced motion: unpinned reading layout')
    browser.close()
