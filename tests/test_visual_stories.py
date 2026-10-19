"""Explanatory scenes: reversibility, explicit steps, preserved detail and fallbacks."""
import argparse
from playwright.sync_api import sync_playwright

parser=argparse.ArgumentParser();parser.add_argument('--url',default='http://127.0.0.1:4197/')
args=parser.parse_args()
with sync_playwright() as pw:
    browser=pw.chromium.launch()
    for width,height,theme in [(320,740,'light'),(390,844,'dark'),(1440,900,'light')]:
        context=browser.new_context(viewport={'width':width,'height':height},color_scheme=theme)
        page=context.new_page();errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
        page.goto(args.url,wait_until='networkidle');page.wait_for_function('window.__SL_DEBUG?.ready')
        page.bring_to_front()
        for kind in ['time','handover','routes']:
            story=page.locator(f'[data-visual-story="{kind}"]')
            assert story.get_attribute('data-enhanced')=='true'
            story.scroll_into_view_if_needed()
            if kind=='handover':
                page.wait_for_function('(()=>{const image=document.querySelector(".story-bench-art");return image.complete&&image.naturalWidth>0})()')
            snapshots=[];heights=[]
            for step in [0,1,2,0]:
                button=story.locator(f'[data-story-go="{step}"]')
                button.focus();page.keyboard.press('Enter')
                page.wait_for_function('([k,i])=>document.querySelector(`[data-visual-story="${k}"]`).dataset.storyStep===String(i)',arg=[kind,step])
                page.wait_for_function('([k,p])=>Number(document.querySelector(`[data-visual-story="${k}"]`).style.getPropertyValue("--story-progress"))===p',arg=[kind,[.08,.5,1][step]])
                assert button.get_attribute('aria-pressed')=='true'
                assert story.locator(f'[data-story-caption="{step}"]').is_visible()
                snapshots.append(story.locator('svg.story-drawing').inner_html())
                heights.append(story.bounding_box()['height'])
            assert snapshots[0]!=snapshots[1]!=snapshots[2]
            assert snapshots[0]==snapshots[3],'manual state must be reversible'
            assert max(heights)-min(heights)<1,'phase changes must not displace later chapters'
            # Real wheel input hands control back to the page scroll.
            page.mouse.move(width-5,height/2);page.mouse.wheel(0,100);page.wait_for_timeout(180)
            assert story.evaluate('e=>Number(e.style.getPropertyValue("--story-progress"))')!=.08
        assert page.locator('.project-explainer').count()==9
        page.locator('.national-references > summary').click()
        for text in ['Lua','RNP','SciELO','Álvaro Vieira Pinto','Paulo Freire','Gilberto Gil']:
            assert text in page.locator('.national-references').inner_text()
        assert page.locator('.national-references a').count()==6
        assert not page.locator('#caderno details[open]').count()
        assert page.locator('.hero-argument-detail').get_attribute('open') is None
        page.locator('.hero-argument-detail > summary').click()
        assert 'vulnerável à exploração' in page.locator('.hero-argument-detail').inner_text()
        page.locator('.hero-argument-detail > summary').click()
        assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
        page.emulate_media(reduced_motion='reduce');page.wait_for_timeout(180)
        page.locator('[data-visual-story="time"]').scroll_into_view_if_needed();page.wait_for_timeout(120)
        assert page.locator('[data-visual-story="time"] [data-story-caption]:visible').count()==3
        assert not errors,errors
        context.close()
        print(f'PASS visual stories {width} {theme}: steps, reversal, keyboard, wheel, detail, national sources and reduced motion',flush=True)
    context=browser.new_context(java_script_enabled=False,viewport={'width':390,'height':844})
    page=context.new_page();page.goto(args.url,wait_until='load')
    assert page.locator('[data-visual-story]').count()==3
    assert page.locator('.story-captions li:visible').count()==9
    assert page.locator('.story-controls:visible').count()==0
    page.locator('#editor > details > summary').click()
    assert 'Mapear contas' in page.locator('#entrega-acesso').inner_text()
    assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
    print('PASS no JS: explanatory captions and original delivery inventory remain accessible')
    browser.close()
