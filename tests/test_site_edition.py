"""End-to-end regressions for the local experimental edition; uses an HTTP preview."""
import argparse
from playwright.sync_api import sync_playwright

parser = argparse.ArgumentParser()
parser.add_argument('--url', default='http://127.0.0.1:4334/')
args = parser.parse_args()

with sync_playwright() as pw:
    browser = pw.chromium.launch()
    context = browser.new_context(viewport={'width':1440,'height':960},accept_downloads=True)
    page = context.new_page()
    page.route_web_socket('**', lambda websocket: None)
    errors=[]
    page.on('pageerror', lambda error: errors.append(str(error)))
    page.goto(args.url,wait_until='load')
    page.wait_for_function('window.__SL_DEBUG?.ready')
    assert page.locator('h1').count()==1
    # Preserve the complete opening argument and its three distinct editorial roles.
    assert 'quem trabalha, produz e se organiza' in page.locator('#hero .hero-lead').inner_text()
    argument=page.locator('#hero .hero-argument').inner_text()
    assert all(phrase in argument for phrase in ['Quem trabalha', 'poder sobre a tecnologia', 'Ferramentas e conhecimento', 'decidir e transformar a própria realidade'])
    assert 'cooperativas, comunidades e negócios sociais' in page.locator('#hero .hero-method').inner_text()
    assert 'Sistemas brasileiros' in page.locator('.brand-signature .eyebrow-tech-label').inner_text()
    assert page.locator('section[data-number]').count()==16
    assert page.locator('meta[name="robots"]').get_attribute('content')=='noindex,follow'
    assert page.locator('link[rel="canonical"]').count()==0
    assert not page.locator('a[href="#"]').count()
    assert 'Ã§' not in page.locator('body').inner_text()
    # Local simulation never calls the inference API and never submits context in a URL.
    requests=[]
    page.on('request', lambda req: requests.append(req.url))
    page.locator('#atelier-context').fill('Organizar uma coleção de obras com suas fontes e autorias.')
    page.locator('#atelier-sector').select_option('cultura')
    assert 'arquivo vivo' in page.locator('[data-atelier-title]').inner_text()
    assert not any('/api/atelier' in url for url in requests)
    with page.expect_download() as download:
        page.locator('[data-atelier-export]').click()
    exported=open(download.value.path(),encoding='utf-8').read()
    assert 'Organizar uma coleção' in exported and 'Demonstração local' in exported
    assert '?' not in page.url
    # References have equivalent pointer and keyboard interactions, plus a real timed shuffle.
    page.locator('[data-reference-targets] button').first.click()
    assert page.locator('[data-reference-targets] button[aria-pressed="true"]').count()==1
    assert page.locator('.reference-cell[data-found="true"]').count()>3
    before=page.locator('[data-reference-grid]').inner_text()
    page.locator('[data-reference-shuffle]').click()
    assert page.locator('[data-reference-shuffle]').is_disabled()
    page.wait_for_function('!document.querySelector("[data-reference-shuffle]").disabled',timeout=8000)
    assert page.locator('[data-reference-grid]').inner_text()!=before
    assert page.locator('[data-reference-targets] button[aria-pressed="true"]').count()==0
    # Nested phone scrolling must not move the document or its outer project track.
    page.evaluate('SLMotion.jumpScene("laboratorio",0)')
    page.wait_for_function('__SL_DEBUG.scenes.find(s=>s.id==="laboratorio").lastIndex===0')
    page.wait_for_timeout(350)
    rail=page.locator('.landing-phone-rail')
    phone=page.locator('.landing-phone-screen').first
    assert 'ELARA' in page.locator('.landing-phone-heading').first.inner_text()
    assert page.locator('.landing-phone-card').count()==9
    assert page.locator('.landing-phone-card').nth(1).inner_text().startswith('Soberania Labs')
    assert page.locator('.landing-phone-card').nth(2).inner_text().startswith('Rotina da Empreendedora Selvagem')
    box=phone.bounding_box();page.mouse.move(box['x']+box['width']/2,box['y']+box['height']/2)
    y=page.evaluate('scrollY')
    page.mouse.wheel(0,420);page.wait_for_timeout(200)
    assert phone.evaluate('(el)=>el.scrollTop')>300
    assert abs(page.evaluate('scrollY')-y)<2
    page.mouse.wheel(420,0);page.wait_for_timeout(200)
    assert rail.evaluate('(el)=>el.scrollLeft')>300
    assert abs(page.evaluate('scrollY')-y)<2
    rail.focus();x=rail.evaluate('(el)=>el.scrollLeft');page.keyboard.press('ArrowRight')
    assert rail.evaluate('(el)=>el.scrollLeft')>x
    # Screens are present before controller enhancements, and actual images are available.
    assert 'portfolio-uve-studio' in page.locator('.work-uve img').get_attribute('src')
    assert 'portfolio-rag-overview' in page.locator('.work-rag img').get_attribute('src')
    assert not errors,errors
    print('PASS desktop: semantic HTML, privacy, export, references, nested scrolling, app previews',flush=True)
    context.close()
    for width,height in [(320,680),(390,844),(768,1024)]:
        context=browser.new_context(viewport={'width':width,'height':height},reduced_motion='reduce')
        page=context.new_page();page.route_web_socket('**',lambda websocket:None)
        page.goto(args.url,wait_until='load');page.wait_for_function('window.__SL_DEBUG?.ready')
        assert not page.evaluate('__SL_DEBUG.enabled')
        assert page.evaluate('document.documentElement.scrollWidth<=innerWidth'),width
        assert page.locator('[data-reference-library-list]').text_content().count(' · ')==106
        page.locator('#atelier-context').fill('Uma situação fictícia para organizar pedidos de uma feira.')
        page.locator('[data-atelier-form] button[type="submit"]').click()
        assert 'cenário preparado' in page.locator('[data-atelier-output-mode]').text_content()
        # Compact/reading flow still contains each long landing page inside a phone.
        phone=page.locator('.landing-phone-screen').first
        phone.scroll_into_view_if_needed()
        dimensions=phone.evaluate('(el)=>({viewport:el.clientHeight,page:el.scrollHeight})')
        assert 180 < dimensions['viewport'] <= 560 and dimensions['page'] > dimensions['viewport']*2,dimensions
        assert page.locator('.landing-project').evaluate('(el)=>el.offsetHeight') < 900
        box=phone.bounding_box();page.mouse.move(box['x']+box['width']/2,box['y']+box['height']/2)
        y=page.evaluate('scrollY');page.mouse.wheel(0,240);page.wait_for_timeout(200)
        assert phone.evaluate('(el)=>el.scrollTop')>100
        assert abs(page.evaluate('scrollY')-y)<2
        context.close()
        print(f'PASS {width}x{height}: reduced motion, no overflow, full library, local interaction, contained phone scroll',flush=True)
    context=browser.new_context(java_script_enabled=False,viewport={'width':390,'height':844})
    page=context.new_page();page.goto(args.url,wait_until='load')
    assert page.locator('#atelier-context').is_disabled()
    assert page.locator('[data-atelier-form] button[type="submit"]').is_disabled()
    assert page.locator('h1').count()==1 and page.locator('.work-uve img').count()==1
    assert 'Paulo Freire' in page.locator('[data-reference-library-list]').text_content()
    assert page.locator('#caderno details').count()==6
    assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
    page.goto(args.url+'perguntas/',wait_until='load')
    assert page.locator('h1').count()==1
    assert page.locator('meta[name="description"]').get_attribute('content')
    print('PASS no-JS: all content readable, form cannot transmit text, reference library, FAQ',flush=True)
    browser.close()
