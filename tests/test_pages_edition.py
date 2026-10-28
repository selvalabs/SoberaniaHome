"""The complete public edition must work at the actual GitHub Pages prefix."""
import argparse
import json
from urllib.parse import urljoin, urlsplit
from urllib.request import urlopen
from playwright.sync_api import sync_playwright

parser = argparse.ArgumentParser()
parser.add_argument('--url', required=True)
args = parser.parse_args()
base = urlsplit(args.url)
assert base.path == '/SoberaniaHome/'
with urlopen(urljoin(args.url, 'release.json')) as response:
    release = json.load(response)
assert release['sections'] == 17 and release['edition'] == 'complete'
assert release['url'] == 'https://selvalabs.github.io/SoberaniaHome/'
with sync_playwright() as pw:
    browser = pw.chromium.launch()
    for width, height in [(390, 844), (1440, 900)]:
        context = browser.new_context(viewport={'width': width, 'height': height}, accept_downloads=True)
        page = context.new_page()
        errors, failures, escaped, requests = [], [], [], []
        page.on('pageerror', lambda error: errors.append(str(error)))
        def inspect(request):
            requests.append(request.url)
            url = urlsplit(request.url)
            if url.netloc == base.netloc and not url.path.startswith(base.path):
                escaped.append(request.url)
        page.on('request', inspect)
        page.on('response', lambda response: failures.append(response.url) if response.status >= 400 and urlsplit(response.url).netloc == base.netloc else None)
        page.goto(args.url, wait_until='networkidle')
        try:
            page.wait_for_function('window.__SL_DEBUG?.ready')
        except Exception:
            print({'errors': errors, 'failures': failures, 'escaped': escaped}, flush=True)
            raise
        assert page.locator('h1').count() == 1
        assert page.locator('section[data-number]').count() == 17
        assert page.locator('[data-atelier]').get_attribute('data-edge-enabled') == 'false'
        assert 'precisa chegar a quem trabalha.' in page.locator('#folha h2').inner_text()
        assert 'Saberes diferentes.' in page.locator('#knowledge-title').inner_text()
        assert page.locator('link[rel=canonical]').get_attribute('href') == release['url']
        assert page.locator('meta[name=robots]').get_attribute('content').startswith('index,follow')
        page.wait_for_function('document.querySelector(".tree").naturalWidth > 0')
        for scene in ['trabalho', 'laboratorio']:
            page.evaluate('(id)=>SLMotion.jumpScene(id,1)', scene)
            page.wait_for_function('(id)=>Math.abs(__SL_DEBUG.scenes.find(s=>s.id===id).raw-1)<.01', arg=scene)
            page.wait_for_timeout(250)
            assert page.locator(f'#{scene} .scene-frame').is_visible()
        page.evaluate('SLMotion.jumpScene("laboratorio",0)')
        page.wait_for_function('Math.abs(__SL_DEBUG.scenes.find(s=>s.id==="laboratorio").raw)<.01')
        page.wait_for_function('document.querySelector(".landing-phone-screen img").naturalWidth > 0')
        page.locator('#atelier-context').fill('Uma situação demonstrativa para organizar uma feira.')
        page.locator('[data-atelier-form] button[type=submit]').click()
        assert 'cenário preparado' in page.locator('[data-atelier-output-mode]').text_content()
        with page.expect_download():
            page.locator('[data-atelier-export]').click()
        assert not any('/api/' in url for url in requests), 'Static edition must not invoke external AI'
        for theme in ['dark', 'light']:
            page.evaluate('(theme)=>{if(document.documentElement.dataset.theme!==theme)document.querySelector("[data-theme-toggle]").click()}', theme)
            assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
        page.evaluate('SLMotion.setReading(true)')
        page.wait_for_function('!__SL_DEBUG.leafEnabled')
        for demo in ['demos/monitor-whatsapp/', 'demos/editor-editavel.html']:
            response = page.goto(urljoin(args.url, demo), wait_until='networkidle')
            assert response.status == 200
            assert 'noindex' in page.locator('meta[name=robots]').get_attribute('content')
        page.goto(urljoin(args.url, 'perguntas/'), wait_until='networkidle')
        assert page.locator('link[rel=canonical]').get_attribute('href') == release['url'] + 'perguntas/'
        assert page.locator('.faq-return').get_attribute('href') == base.path
        page.locator('.faq-return').click()
        page.wait_for_function('window.__SL_DEBUG?.ready')
        assert urlsplit(page.url).path == base.path
        assert not escaped, escaped
        assert not failures, failures
        assert not errors, errors
        print(f'PASS public Pages {width}x{height}: complete edition, resources, metadata, galleries, phones, local export, themes, reading and FAQ', flush=True)
        context.close()
    context = browser.new_context(java_script_enabled=False, viewport={'width': 390, 'height': 844})
    page = context.new_page()
    page.goto(args.url)
    assert page.locator('section[data-number]').count() == 17
    assert page.locator('[data-atelier-form] button[type=submit]').is_disabled()
    assert 'Paulo Freire' in page.locator('.knowledge-reference').inner_text()
    assert page.locator('a[href="/SoberaniaHome/perguntas/"]').count() > 0
    print('PASS public Pages without JavaScript: full content, safe form and prefixed links', flush=True)
    browser.close()
