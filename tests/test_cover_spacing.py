"""Changing mobile browser chrome must not recompose cover boundary spacing."""
from pathlib import Path
from playwright.sync_api import sync_playwright

URL=(Path(__file__).resolve().parents[1]/'index.html').as_uri()
with sync_playwright() as pw:
    browser=pw.chromium.launch()
    page=browser.new_page(viewport={'width':390,'height':760})
    page.goto(URL)
    page.wait_for_function('window.__SL_DEBUG?.ready')
    hold=page.evaluate("parseFloat(document.querySelector('#hero').style.getPropertyValue('--hero-hold'))")
    page.evaluate('(y)=>scrollTo(0,y)',hold+220)
    page.wait_for_timeout(100)
    def bounds():
        return page.evaluate("""()=>{
            const c=document.querySelector('#folha'),line=c.getBoundingClientRect().top;
            const cta=document.querySelector('#hero .text-actions').getBoundingClientRect().bottom;
            const label=c.querySelector('.section-label').getBoundingClientRect().top;
            return {before:line-cta,after:label-line,line,scroll:scrollY,leaf:__SL_DEBUG.leaf.y};
        }""")
    initial=bounds()
    page.set_viewport_size({'width':390,'height':844})
    page.wait_for_timeout(500)
    expanded=bounds()
    print('Toolbar expanded viewport:',initial,expanded)
    for key in ['before','after','line','scroll','leaf']:
        assert abs(initial[key]-expanded[key])<2,(key,initial,expanded)
    page.set_viewport_size({'width':390,'height':760})
    page.wait_for_timeout(500)
    collapsed=bounds()
    for key in initial:
        assert abs(initial[key]-collapsed[key])<2,(key,initial,collapsed)
    # During actual scrolling, both adjacent gaps remain constant.
    page.evaluate('(y)=>scrollTo(0,y)',hold+360)
    page.wait_for_timeout(100)
    moved=bounds()
    for key in ['before','after']:
        assert abs(initial[key]-moved[key])<2,(key,initial,moved)
    print('PASS toolbar in/out and native passage: no cover-spacing jump')
    page.set_viewport_size({'width':412,'height':915})
    page.wait_for_timeout(500)
    assert page.evaluate("Math.abs(document.querySelector('.choices-stage').getBoundingClientRect().height-(innerHeight-document.querySelector('#mast').offsetHeight))<2")
    assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
    page.emulate_media(reduced_motion='reduce')
    page.wait_for_timeout(100)
    assert page.evaluate("document.querySelector('#folha').dataset.pin==='false'")
    assert page.evaluate("document.querySelector('.choices-stage').style.fontSize === ''")
    print('PASS width change recomposes; reduced motion restores ordinary reading')
    browser.close()
