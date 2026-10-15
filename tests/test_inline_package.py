from pathlib import Path
import json
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
RESULTS = []
with sync_playwright() as pw:
    browser = pw.chromium.launch()
    for width, height in [(1366, 900), (390, 844), (320, 568)]:
        page = browser.new_page(viewport={'width': width, 'height': height}, accept_downloads=True)
        errors = []
        page.on('pageerror', lambda error: errors.append(str(error)))
        page.goto('http://192.168.3.204:4177/demos/editor-editavel.html')
        page.wait_for_function('window.InlineEditor?.version')
        assert page.evaluate('InlineEditor.version') == '1.6.1'
        assert page.evaluate('document.documentElement.scrollWidth <= innerWidth')
        page.locator('#ie-launcher').click()
        page.evaluate("InlineEditor.select(document.getElementById('sample-title'))")
        page.locator('#sample-title').fill('Uma página nas nossas mãos.')
        page.evaluate("InlineEditor.select(document.getElementById('sample-image'))")
        page.locator('#ie-tab-layout').click()
        page.locator('#ie-subtab-size').click()
        page.locator('#ie-width').fill('70')
        page.locator('#ie-width').press('Tab')
        assert abs(page.locator('#sample-image').bounding_box()['width'] - 70) < 1
        page.evaluate('InlineEditor.undo(); InlineEditor.redo()')
        assert abs(page.locator('#sample-image').bounding_box()['width'] - 70) < 1
        page.locator('#ie-save').focus()
        with page.expect_download() as pending:
            page.locator('#ie-save').click()
        editable = ROOT / 'tests' / f'inline-saved-{width}.html'
        pending.value.save_as(str(editable))
        saved = editable.read_text(encoding='utf-8')
        assert 'Uma página nas nossas mãos.' in saved
        assert 'data:image/png;base64,' in saved
        assert 'inline-editor-runtime-js' in saved
        reopen = browser.new_page(viewport={'width': width, 'height': height})
        reopen.goto(editable.as_uri())
        reopen.wait_for_function('window.InlineEditor?.version')
        assert not reopen.evaluate('InlineEditor.state.editMode')
        assert reopen.locator('#sample-title').inner_text() == 'Uma página nas nossas mãos.'
        assert reopen.locator('#sample-image').evaluate('e=>e.complete && e.naturalWidth>0')
        assert abs(reopen.locator('#sample-image').bounding_box()['width'] - 70) < 1
        reopen.locator('#ie-launcher').click()
        assert reopen.evaluate('InlineEditor.state.editMode')
        page.locator('#ie-export-final').click()
        with page.expect_download() as pending:
            page.locator('#ie-dialog-confirm').click()
        final = ROOT / 'tests' / f'inline-final-{width}.html'
        pending.value.save_as(str(final))
        final_html = final.read_text(encoding='utf-8')
        assert 'inline-editor-runtime-js' not in final_html
        final_page = browser.new_page()
        final_page.goto(final.as_uri())
        assert final_page.locator('#sample-title').inner_text() == 'Uma página nas nossas mãos.'
        assert final_page.locator('#ie-toolbar').count() == 0
        if width == 1366:
            page.goto('http://192.168.3.204:4177/demos/editor-editavel.html')
            page.screenshot(path=str(ROOT / 'assets' / 'portfolio-editor-real-document-v1.png'))
            page.locator('#ie-launcher').click()
            page.evaluate("InlineEditor.select(document.getElementById('sample-image'))")
            page.screenshot(path=str(ROOT / 'assets' / 'portfolio-editor-real-v1.png'))
        page.goto('http://192.168.3.204:4177/')
        page.wait_for_function('window.__SL_DEBUG?.ready')
        page.evaluate("SLMotion.jumpScene('editor',2.4)")
        page.wait_for_timeout(200)
        page.locator('#enable-editor').click()
        frame = page.frame_locator('#inline-editor-frame')
        frame.locator('#ie-toolbar').wait_for(state='visible')
        assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
        assert frame.locator('#sample-image').evaluate('e=>e.complete && e.naturalWidth>0')
        page.screenshot(path=str(ROOT / 'tests' / f'inline-dialog-{width}.png'))
        page.locator('#close-inline-editor').click()
        assert not page.locator('#inline-editor-dialog').is_visible()
        page.locator('#enable-editor').click()
        assert frame.locator('#ie-toolbar').is_visible()
        page.locator('#close-inline-editor').click()
        assert not errors, errors
        RESULTS.append({'viewport': [width, height], 'status': 'PASS', 'downloads': ['editable', 'final'], 'reopened': True})
        print(RESULTS[-1], flush=True)
    browser.close()
(ROOT / 'tests' / 'inline-package-results.json').write_text(json.dumps(RESULTS, indent=2), encoding='utf-8')

