"""Four real products fit; image galleries preserve reading and scene navigation."""
from pathlib import Path
from playwright.sync_api import sync_playwright, expect

ROOT = Path(__file__).resolve().parents[1]

def click_visible(page, button):
    # Locator.click scrolls a transformed sticky scene before pointerdown even
    # when the button is visible. Click where a user sees it to test scroll.
    rect = button.bounding_box()
    assert rect and rect['y'] >= 0 and rect['y'] + rect['height'] <= page.viewport_size['height']
    page.mouse.click(rect['x'] + rect['width']/2, rect['y'] + rect['height']/2)

with sync_playwright() as pw:
    browser = pw.chromium.launch()
    for width, height in [(320,568),(360,640),(390,724),(390,844),(412,915),(768,1024),(1366,768),(1440,900)]:
        page = browser.new_page(viewport={'width': width, 'height': height})
        errors = []
        page.on('pageerror', lambda error: errors.append(str(error)))
        page.goto((ROOT/'index.html').as_uri())
        page.wait_for_function('window.__SL_DEBUG?.ready')
        cards = page.locator('#trabalho .work-project')
        assert cards.count() == 4
        for index in range(4):
            page.evaluate('(i)=>window.SLMotion.jumpScene("trabalho",i)', index)
            page.wait_for_timeout(180)
            card = cards.nth(index)
            card.locator('img').evaluate('(image)=>image.decode()')
            bounds = card.evaluate("""card => {
                const r=card.getBoundingClientRect(),view=card.closest('.track-viewport').getBoundingClientRect();
                return {left:r.left,right:r.right,top:r.top,bottom:r.bottom,viewTop:view.top,viewBottom:view.bottom,
                  clipped:[...card.children].filter(e=>{const b=e.getBoundingClientRect();return b.top<r.top-2||b.bottom>r.bottom+2}).map(e=>e.className),
                  imageHeight:card.querySelector('.work-screen').getBoundingClientRect().height,
                  overflow:document.documentElement.scrollWidth-innerWidth};
            }""")
            assert bounds['overflow'] <= 1, bounds
            assert bounds['left'] >= -1 and bounds['right'] <= width+1, bounds
            assert bounds['top'] >= bounds['viewTop']-1 and bounds['bottom'] <= bounds['viewBottom']+1, bounds
            assert not bounds['clipped'] and bounds['imageHeight'] >= 75, bounds
            assert page.locator('#trabalho .scene-count').inner_text() == f'{index+1:02} / 04'
            buttons=card.locator('.work-page-selector button')
            assert buttons.count() >= 2
            before=page.evaluate('scrollY')
            sources=set()
            for i in range(buttons.count()):
                button=buttons.nth(i)
                click_visible(page, button)
                expect(button).to_have_attribute('aria-pressed','true')
                card.locator('img').evaluate('(image)=>image.decode()')
                sources.add(card.locator('img').get_attribute('src').split('/')[-1])
                assert card.locator('.work-page-count').inner_text()==f'{i+1} / {buttons.count()}'
                assert page.locator('#trabalho .scene-count').inner_text()==f'{index+1:02} / 04'
                assert abs(page.evaluate('scrollY')-before)<2,(width,height,index,i,before,page.evaluate('scrollY'))
            assert len(sources)==buttons.count(),sources
            click_visible(page, buttons.first)
            expect(buttons.first).to_have_attribute('aria-pressed','true')
            if (width,height) in [(390,844),(1366,768)]:
                page.screenshot(path=str(ROOT/'tests'/f'work-{width}-{index+1}-preview.png'))
        page.evaluate('window.SLMotion.jumpScene("trabalho",0)')
        page.wait_for_timeout(100)
        page.locator('#trabalho [data-next]').click()
        page.wait_for_timeout(120)
        assert page.locator('#trabalho .scene-count').inner_text() == '02 / 04'
        page.locator('#trabalho [data-next]').click()
        page.wait_for_timeout(120)
        assert page.locator('#trabalho .scene-count').inner_text() == '03 / 04'
        page.locator('#trabalho [data-next]').click()
        page.wait_for_timeout(120)
        assert page.locator('#trabalho .scene-count').inner_text() == '04 / 04'
        page.locator('#trabalho [data-prev]').click()
        page.wait_for_timeout(120)
        page.locator('#trabalho a[data-jump]').click()
        page.wait_for_timeout(200)
        assert page.evaluate('location.hash') == '#editor'
        assert not errors, errors
        print(f'PASS work {width}x{height}: four products, image galleries, stable scroll, navigation, editor link')
        page.close()
    page=browser.new_page(viewport={'width':390,'height':844})
    page.goto((ROOT/'index.html').as_uri())
    page.wait_for_function('window.__SL_DEBUG?.ready')
    page.evaluate('SLMotion.jumpScene("trabalho",0)')
    page.wait_for_timeout(180)
    card=page.locator('.work-analytics')
    buttons=card.locator('.work-page-selector button')
    first_source=card.locator('img').get_attribute('src')
    page.evaluate('''()=>{const b=document.querySelectorAll('.work-analytics .work-page-selector button');b[1].click();b[0].click();}''')
    page.wait_for_timeout(200)
    assert card.locator('img').get_attribute('src')==first_source
    expect(buttons.first).to_have_attribute('aria-pressed','true')
    buttons.first.focus()
    buttons.first.press('End')
    expect(buttons.last).to_have_attribute('aria-pressed','true')
    last_source=card.locator('img').get_attribute('src')
    page.evaluate('SLMotion.jumpScene("trabalho",1)')
    page.wait_for_timeout(100)
    page.evaluate('SLMotion.jumpScene("trabalho",0)')
    page.wait_for_timeout(100)
    assert card.locator('img').get_attribute('src')==last_source
    page.route('**/portfolio-analytics-funnel-v1.png',lambda route:route.abort())
    # Reload so the previously decoded funnel cannot satisfy the failure case
    # from the document's image cache.
    page.reload()
    page.wait_for_function('window.__SL_DEBUG?.ready')
    page.evaluate('SLMotion.jumpScene("trabalho",0)')
    page.wait_for_timeout(180)
    click_visible(page, buttons.last)
    expect(buttons.last).to_have_attribute('aria-pressed','true')
    last_source=card.locator('img').get_attribute('src')
    buttons.nth(1).click()
    expect(card.locator('.work-page-count')).to_have_text('Imagem indisponível')
    assert card.locator('img').get_attribute('src')==last_source
    expect(buttons.last).to_have_attribute('aria-pressed','true')
    assert card.locator('.work-evidence').get_attribute('aria-busy') is None
    print('PASS galleries: rapid reversal, keyboard, selection persists, failed image keeps previous screen')
    page.close()
    page=browser.new_page(viewport={'width':390,'height':844},reduced_motion='reduce')
    page.goto((ROOT/'index.html').as_uri())
    page.wait_for_function('window.__SL_DEBUG?.ready')
    for index in range(4):
        card=page.locator('#trabalho .work-project').nth(index)
        card.scroll_into_view_if_needed()
        assert card.is_visible()
    assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
    print('PASS work reduced motion: all four projects readable')
    page=browser.new_page(viewport={'width':1366,'height':768},java_script_enabled=False)
    page.goto((ROOT/'index.html').as_uri())
    assert page.locator('#trabalho .work-project').count()==4
    assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
    print('PASS work without JavaScript: real screenshot and text for every product')
    browser.close()
