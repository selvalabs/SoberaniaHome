"""Capture the actual package without obscuring the document or stale handles."""
from pathlib import Path
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
with sync_playwright() as pw:
    browser = pw.chromium.launch()
    page = browser.new_page(viewport={'width': 1366, 'height': 780})
    page.goto((ROOT / 'demos/editor-editavel.html').as_uri())
    page.wait_for_function('window.InlineEditor?.version')
    page.locator('#ie-launcher').click()
    # Capture-only layout. The original document and editor package stay intact.
    page.add_style_tag(content='main{max-width:calc(100% - 390px);margin:0 390px 0 0}#ie-toolbar{left:auto!important;right:18px!important;top:38px!important}')
    page.wait_for_timeout(80)
    page.evaluate("InlineEditor.select(document.getElementById('sample-image'))")
    page.wait_for_timeout(80)
    box = page.locator('#ie-toolbar').bounding_box()
    image = page.locator('#sample-image').bounding_box()
    title = page.locator('#sample-title').bounding_box()
    overlay = page.locator('#ie-selection-overlay').bounding_box()
    assert box['x'] > image['x'] + image['width']
    assert box['x'] > title['x'] + title['width']
    assert abs(overlay['x'] - image['x']) < 2 and abs(overlay['y'] - image['y']) < 2
    page.screenshot(path=str(ROOT / 'assets/portfolio-editor-real-v2.png'))
    browser.close()
print('PASS: document unobscured; selection handles aligned with image')
