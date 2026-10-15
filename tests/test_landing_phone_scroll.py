from pathlib import Path
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]

with sync_playwright() as playwright:
    browser = playwright.chromium.launch()
    for width, height in [(390, 844), (1366, 768)]:
        page = browser.new_page(viewport={'width': width, 'height': height})
        errors = []
        page.on('pageerror', lambda error: errors.append(str(error)))
        page.goto((ROOT / 'index.html').as_uri())
        page.wait_for_function('window.__SL_DEBUG?.ready')
        page.wait_for_selector('#laboratorio .landing-phone-card')
        page.evaluate('SLMotion.jumpScene("laboratorio", 0)')
        phones = page.locator('#laboratorio .landing-phone-screen')
        assert phones.count() == 8
        assert page.evaluate('SLLandingPages.map(project => project.key)') == [
            'soberania-lp', 'desafio-selvagem', 'entretrama', 'ciclico',
            'shala', 'alma', 'mariana', 'mariaanna'
        ]

        for index in range(phones.count()):
            screen = phones.nth(index)
            image = screen.locator('img')
            image.evaluate('(img) => { img.loading = "eager"; return img.decode(); }')
            details = screen.evaluate("e => ({scrollHeight:e.scrollHeight,clientHeight:e.clientHeight,width:e.querySelector('img').naturalWidth})")
            assert details['width'] >= 300, details
            assert details['scrollHeight'] > details['clientHeight'], details

        first, second = phones.nth(0), phones.nth(1)
        first.evaluate('e => e.scrollTop = 0')
        second.evaluate('e => e.scrollTop = 0')
        first.scroll_into_view_if_needed()
        page.wait_for_timeout(120)
        viewport_y = page.evaluate('scrollY')
        point = first.evaluate("""el => {
          const r=el.getBoundingClientRect();
          const candidates=[[12,18],[r.width-12,18],[12,r.height-18],[r.width-12,r.height-18],[r.width/2,r.height-24]];
          const candidate=candidates.find(([x,y])=>document.elementFromPoint(r.left+x,r.top+y)?.closest('.landing-phone-screen')===el);
          return candidate ? {x:r.left+candidate[0],y:r.top+candidate[1]} : null;
        }""")
        assert point['x'] is not None, {'width': width, 'reason': 'could not find an unobstructed spot inside the first phone'}
        rail = page.locator('#laboratorio .landing-phone-rail')
        page.mouse.move(point['x'], point['y'])
        page.mouse.wheel(0, 300)
        page.wait_for_timeout(120)
        first_after = first.evaluate('e => e.scrollTop')
        second_after = second.evaluate('e => e.scrollTop')
        assert rail.evaluate('e => e.scrollLeft') == 0, {'width': width, 'wheel-over-phone': rail.evaluate('e => e.scrollLeft')}
        assert first_after > 0, {'width': width, 'first': first_after}
        assert second_after == 0, {'width': width, 'second': second_after}
        assert page.evaluate('scrollY') == viewport_y, {'width': width, 'page': page.evaluate('scrollY'), 'before': viewport_y}

        first.evaluate("e => e.dispatchEvent(new WheelEvent('wheel',{deltaY:300,bubbles:true,cancelable:true,shiftKey:true}))")
        assert rail.evaluate('e => e.scrollLeft') > 0, {'width': width, 'shift-wheel-horizontal': rail.evaluate('e => e.scrollLeft')}
        assert first.evaluate('e => e.scrollTop') == first_after
        first.evaluate('e => e.scrollTop = 0')
        rail.evaluate('e => e.scrollLeft = 0')
        heading_box = rail.locator('.landing-phone-heading').first.bounding_box()
        rail_point = {'x': heading_box['x'] + 10, 'y': heading_box['y'] + 10}
        page.mouse.move(rail_point['x'], rail_point['y'])
        page.mouse.wheel(0, 280)
        page.wait_for_timeout(100)
        right = rail.evaluate('e => e.scrollLeft')
        assert right > 0, {'width': width, 'right': right}
        page.mouse.wheel(0, -280)
        page.wait_for_timeout(100)
        left = rail.evaluate('e => e.scrollLeft')
        assert left < right, {'width': width, 'left': left, 'right': right}
        assert page.evaluate('scrollY') == viewport_y, {'width': width, 'page': page.evaluate('scrollY'), 'before': viewport_y}

        page.evaluate('document.querySelector(".landing-phone-rail").scrollLeft = 0')
        page.wait_for_timeout(350)
        drag_point = first.evaluate('''el => {
          const r=el.getBoundingClientRect();
          for (let y=r.top+20;y<r.bottom-20;y+=20) {
            const x=Math.min(r.right-20,innerWidth-20);
            if (document.elementFromPoint(x,y)?.closest('.landing-phone-screen')===el) return {x,y};
          }
          return null;
        }''')
        assert drag_point, 'Phone drag needs an unobstructed start point'
        page.mouse.move(drag_point['x'], drag_point['y'])
        page.mouse.down()
        page.mouse.move(drag_point['x'] - 90, drag_point['y'], steps=4)
        page.mouse.up()
        assert rail.evaluate('e => e.scrollLeft') > 0, {'width': width, 'drag': rail.evaluate('e => e.scrollLeft')}
        assert not errors, errors
        print(f'PASS {width}x{height}: independent phone scrolling, bidirectional wheel navigation, and mouse dragging', flush=True)
        page.close()
    browser.close()
