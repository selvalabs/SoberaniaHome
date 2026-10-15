"""Visible text responds to the real leaf and clears in reading modes."""
from pathlib import Path
from playwright.sync_api import sync_playwright

ROOT=Path(__file__).resolve().parents[1]
with sync_playwright() as pw:
    browser=pw.chromium.launch()
    for width,height in [(320,568),(390,844),(1366,768)]:
        page=browser.new_page(viewport={'width':width,'height':height})
        errors=[]
        page.on('pageerror',lambda error:errors.append(str(error)))
        page.goto((ROOT/'index.html').as_uri())
        page.wait_for_function('window.__SL_DEBUG?.ready')
        assert page.locator('.eyebrow-tech .eyebrow-readable').text_content()=='Sistemas Brasileiros'
        assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
        labels=page.locator('.hero-identity').evaluate('''e=>[...e.children].map(e=>e.getBoundingClientRect().toJSON())''')
        assert all(r['left']>=0 and r['right']<=width for r in labels),labels
        for section_id in ['folha','deslocamento-1','deslocamento-2','trabalho','sobre','manifesto']:
            start=page.locator('#'+section_id).evaluate('(e)=>e.getBoundingClientRect().top+scrollY-innerHeight*.8')
            found=None
            for offset in range(0,height*2,45):
                page.evaluate('(y)=>scrollTo(0,y)',max(0,start+offset))
                page.wait_for_timeout(35)
                strongest=page.locator('#'+section_id).evaluate('''e=>[...e.querySelectorAll('[data-glow]')].reduce((m,e)=>Math.max(m,Number(e.dataset.glow)),0)''')
                if strongest>.15:
                    found=page.evaluate('scrollY');break
            assert found is not None,(width,section_id)
            reference=page.locator('#'+section_id).evaluate("e=>[...e.querySelectorAll('[data-glow]')].map(e=>[e.dataset.glow,e.style.textShadow])")
            page.wait_for_timeout(120)
            assert page.locator('#'+section_id).evaluate("e=>[...e.querySelectorAll('[data-glow]')].map(e=>[e.dataset.glow,e.style.textShadow])")==reference
            measurements=page.evaluate('__SL_DEBUG.metrics.measurements')
            page.evaluate('(y)=>scrollTo(0,y)',found+250);page.wait_for_timeout(45)
            page.evaluate('(y)=>scrollTo(0,y)',found);page.wait_for_timeout(45)
            assert page.locator('#'+section_id).evaluate("e=>[...e.querySelectorAll('[data-glow]')].map(e=>[e.dataset.glow,e.style.textShadow])")==reference
            assert page.evaluate('__SL_DEBUG.metrics.measurements')==measurements
        page.evaluate('SLMotion.setReading(true)')
        page.wait_for_function('!__SL_DEBUG.enabled')
        assert page.evaluate("[...document.querySelectorAll('[data-glow]')].every(e=>!e.style.textShadow)")
        assert not errors,errors
        print(f'PASS glow {width}x{height}: six chapters, idle, reverse, no remeasurement, reading')
        page.close()
    page=browser.new_page(viewport={'width':390,'height':844},reduced_motion='reduce')
    page.goto((ROOT/'index.html').as_uri());page.wait_for_function('window.__SL_DEBUG?.ready')
    assert not page.evaluate('__SL_DEBUG.enabled')
    assert page.evaluate("[...document.querySelectorAll('[data-glow]')].every(e=>!e.style.textShadow)")
    print('PASS reduced motion: no glow')
    browser.close()
