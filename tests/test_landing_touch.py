"""Real Chromium touch gestures for the nested landing-page previews."""
import argparse
from pathlib import Path
from playwright.sync_api import sync_playwright

parser = argparse.ArgumentParser()
parser.add_argument('--url', default='http://127.0.0.1:4186/')
parser.add_argument('--gallery-source', type=Path, help='Optional unbuilt gallery.js for isolated development checks.')
args = parser.parse_args()

with sync_playwright() as playwright:
    browser = playwright.chromium.launch()
    context = browser.new_context(viewport={'width': 390, 'height': 844}, is_mobile=True, has_touch=True)
    page = context.new_page()
    if args.gallery_source:
        page.route('**/demos/landing-collection/gallery.js*', lambda route: route.fulfill(path=args.gallery_source, content_type='text/javascript'))
    page.goto(args.url, wait_until='load')
    page.wait_for_function('window.__SL_DEBUG?.ready')
    phone = page.locator('.landing-phone-screen').first
    rail = page.locator('.landing-phone-rail')
    phone.scroll_into_view_if_needed()
    page.wait_for_timeout(500)
    assert 'Shift' not in page.locator('.landing-phone-scroll-hint').first.inner_text()
    assert 'Deslize' in rail.get_attribute('aria-label')
    assert page.evaluate('navigator.maxTouchPoints') > 0
    client = context.new_cdp_session(page)

    def swipe(x, y, dx, dy, inside_rail=True):
        if inside_rail:
            assert page.evaluate('([x,y])=>Boolean(document.elementFromPoint(x,y)?.closest(".landing-phone-rail"))', [x,y]), 'A decorative overlay intercepted the preview.'
        client.send('Input.dispatchTouchEvent', {'type':'touchStart', 'touchPoints':[{'x':x, 'y':y}]})
        for step in range(1, 13):
            client.send('Input.dispatchTouchEvent', {'type':'touchMove', 'touchPoints':[{'x':x + dx * step / 12, 'y':y + dy * step / 12}]})
            page.wait_for_timeout(20)
        client.send('Input.dispatchTouchEvent', {'type':'touchEnd', 'touchPoints':[]})
        page.wait_for_timeout(350)

    document_y = page.evaluate('scrollY')
    box = phone.bounding_box()
    swipe(box['x'] + box['width'] * .8, box['y'] + 150, -110, 0)
    assert rail.evaluate('(el)=>el.scrollLeft') > 60, 'Left swipe on a phone must reveal the next preview.'
    assert phone.evaluate('(el)=>el.scrollTop') == 0
    assert abs(page.evaluate('scrollY') - document_y) < 2

    # Reverse the same native gesture; no pointer simulation or wheel fallback.
    box = phone.bounding_box()
    swipe(max(90, box['x'] + box['width'] * .7), box['y'] + 150, 110, 0)
    assert rail.evaluate('(el)=>el.scrollLeft') < 10, 'Right swipe must return to the first preview.'

    heading = page.locator('.landing-phone-heading').first.bounding_box()
    swipe(heading['x'] + heading['width'] * .8, heading['y'] + heading['height'] / 2, -110, 0)
    assert rail.evaluate('(el)=>el.scrollLeft') > 60, 'The preview heading must allow the same horizontal gesture.'
    assert abs(page.evaluate('scrollY') - document_y) < 2

    rail.evaluate('(el)=>el.scrollLeft=0')
    page.wait_for_timeout(100)
    box = phone.bounding_box()
    swipe(box['x'] + box['width'] / 2, box['y'] + box['height'] * .65, 0, -140)
    assert phone.evaluate('(el)=>el.scrollTop') > 90, 'Vertical touch inside a phone must scroll its page.'
    assert rail.evaluate('(el)=>el.scrollLeft') < 2
    assert abs(page.evaluate('scrollY') - document_y) < 2

    swipe(12, 600, 0, -140, inside_rail=False)
    assert page.evaluate('scrollY') > document_y + 60, 'Vertical touch outside the previews must still scroll the document.'
    assert rail.evaluate('(el)=>el.scrollLeft') < 2
    context.close()
    browser.close()
    print('PASS touch: both horizontal directions, heading, contained phone scroll, outer page scroll and touch instructions')
