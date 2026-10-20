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
            assert story.locator('img.story-art').count()>0
            story.scroll_into_view_if_needed()
            page.wait_for_function("el=>[...el.querySelectorAll('img.story-art')].every(img=>img.complete&&img.naturalWidth>0)",arg=story.element_handle())
            snapshots=[];heights=[]
            for step in [0,1,2,0]:
                button=story.locator(f'[data-story-go="{step}"]')
                button.focus();page.keyboard.press('Enter')
                page.wait_for_function('([k,i])=>document.querySelector(`[data-visual-story="${k}"]`).dataset.storyStep===String(i)',arg=[kind,step])
                page.wait_for_function('([k,p])=>Number(document.querySelector(`[data-visual-story="${k}"]`).style.getPropertyValue("--story-progress"))===p',arg=[kind,[.08,.5,1][step]])
                assert button.get_attribute('aria-pressed')=='true'
                assert story.locator(f'[data-story-caption="{step}"]').is_visible()
                snapshots.append(story.evaluate("""e=>[...e.querySelectorAll('.time-ticket,.time-processor,.time-occupied,.time-reclaimed,.handover-piece,.handover-system,.handover-hands,.migration-bundle,.migration-destination')].map(el=>{const s=getComputedStyle(el);return [s.transform,s.opacity,s.width,s.left,s.top]})"""))
                heights.append(story.bounding_box()['height'])
            assert snapshots[0]!=snapshots[1]!=snapshots[2]
            assert snapshots[0]==snapshots[3],'manual state must be reversible'
            frame=story.locator('.story-frame').bounding_box()
            assert frame['width']<=width, 'story must fit the viewport'
            assert story.evaluate('e=>e.scrollWidth<=e.clientWidth'), 'figure must not overflow the page'
            assert max(heights)-min(heights)<1,'phase changes must not displace later chapters'
            # Real wheel input hands control back to the page scroll.
            page.mouse.move(width-5,height/2);page.mouse.wheel(0,100);page.wait_for_timeout(180)
            assert story.evaluate('e=>Number(e.style.getPropertyValue("--story-progress"))')!=.08
            # The entire frame stays readable while real document scroll advances/reverses it.
            if story.get_attribute('data-story-pinned')=='true':
                geom=story.evaluate('e=>({start:e.getBoundingClientRect().top+scrollY,run:parseFloat(e.style.getPropertyValue("--story-travel")),top:parseFloat(e.style.getPropertyValue("--story-top"))})')
                for fraction in [.05,.5,.95,.05]:
                    page.evaluate('y=>scrollTo({top:y,behavior:"instant"})',geom['start']-geom['top']+geom['run']*fraction)
                    page.wait_for_function('([k,p])=>Math.abs(Number(document.querySelector(`[data-visual-story="${k}"]`).style.getPropertyValue("--story-progress"))-p)<.003',arg=[kind,fraction])
                    assert abs(story.locator('.story-frame').bounding_box()['y']-geom['top'])<2,'sticky frame must stay in the viewport'
            page.wait_for_timeout(1000)
            mutations=story.evaluate('e=>new Promise(resolve=>{let n=0;const observer=new MutationObserver(records=>n+=records.length);observer.observe(e,{attributes:true});setTimeout(()=>{observer.disconnect();resolve(n)},250)})')
            assert mutations==0,'story animation must sleep at rest'

        # Choices have different consequences, not just different captions.
        time=page.locator('[data-visual-story="time"]')
        time.scroll_into_view_if_needed()
        time.locator('[data-distribution="quota"]').evaluate('(e)=>e.click()')
        page.wait_for_function('document.querySelector("[data-visual-story=time]").style.getPropertyValue("--story-progress")==="1"')
        assert time.locator('.time-quota-label').is_visible()
        assert not time.locator('.time-shared-label').is_visible()
        assert 'descanso não chega' in time.locator('.distribution-result').inner_text()
        time.locator('[data-distribution="shared"]').evaluate('(e)=>e.click()')
        assert time.locator('.time-shared-label').is_visible()
        routes=page.locator('[data-visual-story="routes"]')
        routes.scroll_into_view_if_needed()
        route_height=routes.locator('.story-frame').bounding_box()['height']
        routes.locator('[data-route-test]').evaluate('(e)=>e.click()')
        page.wait_for_function('document.querySelector("[data-visual-story=routes]").style.getPropertyValue("--story-progress")==="0.5"')
        assert routes.locator('.migration-failure').is_visible()
        assert abs(routes.locator('.story-frame').bounding_box()['height']-route_height)<1,'failure must not move following folds'
        assert 'Aguardando revisão' in routes.locator('[data-route-status]').inner_text()
        routes.locator('[data-story-go="2"]').evaluate('(e)=>e.click()')
        page.wait_for_function('document.querySelector("[data-visual-story=routes]").style.getPropertyValue("--story-progress")==="1"')
        assert routes.evaluate('e=>Number(e.style.getPropertyValue("--journey"))')==.5,'a failed validation must never activate destination'
        routes.locator('[data-route-test]').evaluate('(e)=>e.click()')
        page.wait_for_function('document.querySelector("[data-route-status]").textContent==="Em operação"')
        assert routes.evaluate('e=>Number(e.style.getPropertyValue("--journey"))')==1
        assert page.locator('.project-explainer').count()==9
        assert page.locator('.project-overview').count()==9
        page.locator('.national-references > summary').click()
        for text in ['Lua','RNP','SciELO','Álvaro Vieira Pinto','Paulo Freire','Gilberto Gil']:
            assert text in page.locator('.national-references').inner_text()
        assert page.locator('.national-references a').count()==6
        assert not page.locator('#caderno details[open]').count()
        assert page.locator('.hero-argument-detail').get_attribute('open') is None
        page.locator('.hero-argument-detail > summary').click()
        assert 'vulnerável à exploração' in page.locator('.hero-context').inner_text()
        assert page.locator('.hero-context').is_visible()
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
