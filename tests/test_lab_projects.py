from pathlib import Path
from playwright.sync_api import sync_playwright, expect

ROOT = Path(__file__).resolve().parents[1]
with sync_playwright() as pw:
    browser = pw.chromium.launch()
    for width, height in [(320,568),(360,640),(390,724),(390,844),(412,915),(768,1024),(1366,768),(1440,900)]:
        page = browser.new_page(viewport={'width':width,'height':height})
        errors = []
        page.on('pageerror', lambda error: errors.append(str(error)))
        page.goto((ROOT/'index.html').as_uri())
        page.wait_for_function('window.__SL_DEBUG?.ready')
        cards = page.locator('#laboratorio .lab-project')
        assert cards.count() == 5
        assert page.locator('#laboratorio .sequence').get_attribute('data-direction') == 'reverse'
        for index in range(5):
            page.evaluate('(i)=>SLMotion.jumpScene("laboratorio",i)', index)
            page.wait_for_timeout(160)
            card = cards.nth(index)
            card.locator('img').evaluate('e=>e.decode()')
            bounds = card.evaluate("""e=>{const r=e.getBoundingClientRect(),v=e.closest('.track-viewport').getBoundingClientRect();return {left:r.left,right:r.right,top:r.top,bottom:r.bottom,vtop:v.top,vbottom:v.bottom,clipped:[...e.children].filter(c=>{const b=c.getBoundingClientRect();return b.top<r.top-2||b.bottom>r.bottom+2}).map(c=>c.className),imageHeight:e.querySelector('.work-screen').getBoundingClientRect().height}}""")
            assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
            assert bounds['left']>=-1 and bounds['right']<=width+1, bounds
            assert bounds['top']>=bounds['vtop']-1 and bounds['bottom']<=bounds['vbottom']+1, bounds
            assert not bounds['clipped'] and bounds['imageHeight']>=75, bounds
            assert page.locator('#laboratorio .scene-count').inner_text()==f'{index+1:02} / 05'
            buttons = card.locator('.work-page-selector button')
            assert buttons.count()==2
            sources = set()
            scroll = page.evaluate('scrollY')
            for button_index in range(2):
                button = buttons.nth(button_index)
                b = button.bounding_box()
                assert b['y']>=0 and b['y']+b['height']<=height
                page.mouse.click(b['x']+b['width']/2,b['y']+b['height']/2)
                expect(button).to_have_attribute('aria-pressed','true')
                expect(card.locator('.work-page-count')).to_have_text(f'{button_index+1} / 2')
                card.locator('img').evaluate('e=>e.decode()')
                sources.add(card.locator('img').get_attribute('src'))
                assert abs(page.evaluate('scrollY')-scroll)<2
            assert len(sources)==2
            if (width,height) in [(390,844),(1366,768)]:
                page.screenshot(path=str(ROOT/'tests'/f'lab-{width}-{index}.png'))
        page.evaluate('SLMotion.jumpScene("laboratorio",0)')
        page.wait_for_timeout(150)
        button = page.locator('#laboratorio [data-next]').bounding_box()
        page.mouse.click(button['x']+button['width']/2,button['y']+button['height']/2)
        page.wait_for_timeout(150)
        expect(page.locator('#laboratorio .scene-count')).to_have_text('02 / 05')
        button = page.locator('#laboratorio [data-prev]').bounding_box()
        page.mouse.click(button['x']+button['width']/2,button['y']+button['height']/2)
        page.wait_for_timeout(150)
        expect(page.locator('#laboratorio .scene-count')).to_have_text('01 / 05')
        assert not errors, errors
        print(f'PASS {width}x{height}: five real projects, ten images, stable gallery and navigation',flush=True)
        page.close()
    for options in [{'reduced_motion':'reduce'},{'java_script_enabled':False}]:
        page = browser.new_page(viewport={'width':390,'height':844},**options)
        page.goto((ROOT/'index.html').as_uri())
        if options.get('reduced_motion'):page.wait_for_function('window.__SL_DEBUG?.ready')
        assert page.locator('#laboratorio .lab-project').count()==5
        assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
        for card in page.locator('#laboratorio .lab-project').all():
            assert card.is_visible()
            card.locator('img').evaluate('e=>e.decode()')
        print('PASS reading',options,flush=True)
    browser.close()
