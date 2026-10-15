"""The entire Choices composition must fit below the mast at normal text size."""
from pathlib import Path
from playwright.sync_api import sync_playwright

URL = (Path(__file__).resolve().parents[1] / 'index.html').as_uri()
with sync_playwright() as pw:
    browser = pw.chromium.launch()
    for width, height in [(320, 568), (360, 640), (390, 724), (390, 844), (412, 915), (768, 1024), (1366, 768), (1440, 900)]:
        page = browser.new_page(viewport={'width': width, 'height': height})
        errors = []
        page.on('pageerror', lambda error: errors.append(str(error)))
        page.goto(URL)
        page.wait_for_function('window.__SL_DEBUG?.ready')
        page.evaluate("SLMotion.jumpSection('folha')")
        page.wait_for_timeout(150)
        bounds = page.evaluate("""()=>{
            const section=document.querySelector('#folha');
            const r=section.querySelector('.choices-stage').getBoundingClientRect();
            const mast=document.querySelector('#mast').getBoundingClientRect();
            const c=section.querySelector('.choices-resolution').getBoundingClientRect();
            return {top:r.top,height:r.height,available:innerHeight-mast.height,
                    codaBottom:c.bottom,viewport:innerHeight,overflow:document.documentElement.scrollWidth>innerWidth};
        }""")
        assert bounds['height'] <= bounds['available'] + 2, bounds
        assert bounds['codaBottom'] <= bounds['viewport'], bounds
        assert not bounds['overflow'], bounds
        assert page.locator('#folha h2').inner_text().startswith('O trabalho é humano.')
        assert page.locator('#folha blockquote').count() == 1
        assert page.locator('#folha .choices-reference a').get_attribute('href') == 'https://www.marxists.org/archive/lenin/works/1914/mar/13.htm'
        assert 'Tradução nossa' not in page.locator('#folha figcaption').inner_text()
        assert page.locator('#folha blockquote').get_attribute('data-translation') == 'Tradução nossa da edição inglesa.'
        assert page.locator('#folha .choices-paper').count() == 1
        assert page.evaluate("getComputedStyle(document.querySelector('.choices-closing strong')).backgroundColor !== 'rgba(0, 0, 0, 0)'")
        assert page.evaluate("document.querySelector('#folha').dataset.pin === 'true'")
        assert not errors, errors
        if width == 390 and height == 844:
            page.screenshot(path='tests/choices-mobile-preview.png')
        print(f'PASS choices {width}x{height}: complete composition {bounds["height"]:.0f}px / {bounds["available"]:.0f}px')
        page.close()
    browser.close()
