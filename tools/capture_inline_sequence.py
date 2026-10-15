"""Four actual states of the canonical editor, including its clean export."""
from pathlib import Path
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
with sync_playwright() as pw:
    browser = pw.chromium.launch()
    page = browser.new_page(viewport={'width': 1366, 'height': 780})
    page.goto((ROOT / 'demos/editor-editavel.html').as_uri())
    page.wait_for_function('window.InlineEditor?.version')
    page.screenshot(path=str(ROOT / 'assets/inline-sequence-open-v1.png'))
    page.locator('#ie-launcher').click()
    style = page.add_style_tag(content='main{max-width:calc(100% - 390px);margin:0 390px 0 0}#ie-toolbar{left:auto!important;right:18px!important;top:38px!important}')
    style.evaluate("e=>e.dataset.ieRuntime=''")
    page.evaluate("InlineEditor.select(document.getElementById('sample-title'))")
    page.locator('#sample-title').fill('Uma página que podemos transformar juntos.')
    page.locator('#ie-tab-content').click()
    page.locator('#ie-subtab-typography').click()
    page.wait_for_timeout(100)
    page.screenshot(path=str(ROOT / 'assets/inline-sequence-text-v1.png'))
    page.evaluate("InlineEditor.select(document.getElementById('sample-image'))")
    page.locator('#ie-tab-layout').click()
    page.locator('#ie-subtab-size').click()
    page.locator('#ie-width').fill('110')
    page.locator('#ie-width').press('Tab')
    page.wait_for_timeout(100)
    image = page.locator('#sample-image').bounding_box()
    overlay = page.locator('#ie-selection-overlay').bounding_box()
    toolbar = page.locator('#ie-toolbar').bounding_box()
    assert abs(image['width'] - 110) < 1
    assert abs(overlay['x'] - image['x']) < 2
    assert toolbar['x'] > image['x'] + image['width']
    page.screenshot(path=str(ROOT / 'assets/inline-sequence-image-v1.png'))
    clean = page.evaluate('InlineEditor.serialize({clean:true})')
    final = browser.new_page(viewport={'width': 1366, 'height': 780})
    final.set_content(clean, wait_until='load')
    assert final.locator('#ie-toolbar').count() == 0
    assert final.locator('#sample-title').inner_text() == 'Uma página que podemos transformar juntos.'
    assert abs(final.locator('#sample-image').bounding_box()['width'] - 110) < 1
    final.screenshot(path=str(ROOT / 'assets/inline-sequence-final-v1.png'))
    browser.close()
print('PASS: four real states; clean export preserves edited text and image')
