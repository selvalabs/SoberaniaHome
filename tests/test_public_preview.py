"""Four-cover artifact excludes drafts and retains navigation and motion."""
from pathlib import Path
from playwright.sync_api import sync_playwright, expect

ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'public-preview'
with sync_playwright() as pw:
    browser=pw.chromium.launch()
    for width,height in [(320,568),(390,844),(412,915),(1366,768)]:
        page=browser.new_page(viewport={'width':width,'height':height})
        errors=[]
        page.on('pageerror',lambda error:errors.append(str(error)))
        page.goto((OUT/'index.html').as_uri())
        page.wait_for_function('window.__SL_DEBUG?.ready')
        assert page.locator('main > section').count()==4
        assert page.locator('#trabalho,#processo,#editor,#laboratorio,#manifesto,#caderno,#content-dialog').count()==0
        assert not any('portfolio' in f.name for f in OUT.rglob('*') if f.is_file())
        assert page.locator('#section-counter').inner_text()=='01 / 04'
        page.locator('#open-index').click()
        expect(page.locator('#index-dialog')).to_be_visible()
        assert page.locator('.index-links a').count()==4
        page.locator('.index-links a[href="#deslocamento-2"]').click()
        expect(page.locator('#index-dialog')).not_to_be_visible()
        page.wait_for_timeout(120)
        assert page.locator('#section-counter').inner_text()=='04 / 04'
        page.evaluate('scrollTo({top:document.documentElement.scrollHeight,behavior:"instant"})')
        page.wait_for_timeout(160)
        expect(page.locator('#construction-title')).to_be_in_viewport()
        assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
        assert page.evaluate('''()=>[...document.querySelectorAll('a[href^="#"]')].every(a=>document.getElementById(a.hash.slice(1)))''')
        page.screenshot(path=str(ROOT/'tests'/f'public-ending-{width}.png'))
        page.locator('#toggle-motion-footer').click()
        page.wait_for_function('!window.__SL_DEBUG.enabled')
        assert not errors,errors
        print(f'PASS public {width}x{height}: four covers, index, footer, motion, no draft chapters')
        page.close()
    for options in [{'reduced_motion':'reduce'},{'java_script_enabled':False}]:
        page=browser.new_page(viewport={'width':390,'height':844},**options)
        page.goto((OUT/'index.html').as_uri())
        page.locator('#construction-title').scroll_into_view_if_needed()
        expect(page.locator('#construction-title')).to_be_in_viewport()
        assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
        print('PASS public fallback',options)
        page.close()
    assert 'work-monitor' in (ROOT/'index.html').read_text(encoding='utf-8')
    print('PASS full working draft preserved')
    browser.close()
