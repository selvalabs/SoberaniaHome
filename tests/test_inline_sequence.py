from pathlib import Path
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
with sync_playwright() as pw:
    browser = pw.chromium.launch()
    for width, height in [(320, 568), (390, 844), (1366, 768)]:
        page = browser.new_page(viewport={'width': width, 'height': height})
        errors = []
        page.on('pageerror', lambda error: errors.append(str(error)))
        page.goto('http://192.168.3.204:4177/?inline-sequence-1')
        page.wait_for_function('window.__SL_DEBUG?.ready')
        sources = set()
        for step in range(4):
            page.evaluate('(i)=>SLMotion.jumpScene("editor",i)', step)
            page.wait_for_timeout(220)
            visible = page.locator('.inline-step:visible')
            assert visible.count() == 1
            assert visible.get_attribute('data-step') == str(step)
            visible.locator('img').evaluate('e=>e.decode()')
            sources.add(visible.locator('img').get_attribute('src'))
            assert page.locator('#editor-caption-kicker').inner_text().startswith(f'{step+1:02} /')
            assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
            box = visible.bounding_box()
            foot = page.locator('.editor-sequence .scene-foot').bounding_box()
            assert box['height'] > 100 and box['y'] + box['height'] <= foot['y'] + 2, (box, foot)
            if width == 390:
                page.screenshot(path=str(ROOT / 'tests' / f'inline-sequence-step-{step}.png'))
        assert len(sources) == 4
        page.locator('#enable-editor').click()
        page.frame_locator('#inline-editor-frame').locator('#ie-toolbar').wait_for(state='visible')
        page.locator('#close-inline-editor').click()
        # Reading mode retains the entire demonstration without scroll phases.
        page.evaluate("document.documentElement.classList.remove('motion')")
        assert page.locator('.inline-step:visible').count() == 4
        assert not errors, errors
        print(f'PASS {width}x{height}: four distinct states, captions, frame fit, live editor, reading', flush=True)
    browser.close()
