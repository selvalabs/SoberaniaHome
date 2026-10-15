"""Capture existing local interfaces; no production servers or accounts are used."""
from pathlib import Path
from urllib.parse import urlsplit, unquote
import mimetypes, re
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
PROJECTS = Path('C:/Users/carlo/projects')
SOURCES = {
    'roots': (PROJECTS / 'grow_ai/frontend', '/'),
    'game': (PROJECTS / 'plataforma-educativa-game/dist', '/'),
    'foco': (PROJECTS / 'esquerda-em-foco', '/'),
    'ciclico': (PROJECTS / 'planejamento_ciclico_repo/dist', '/'),
    'techia': (PROJECTS / 'websites/techia/main-release', '/contracts/preview/TECHIA_UI_ATLAS_I18N.html'),
}

def respond(route, root):
    url = urlsplit(route.request.url)
    if url.hostname != 'lab-capture.invalid':
        route.abort()
        return
    relative = unquote(url.path).lstrip('/')
    path = (root / relative).resolve()
    if path.is_dir():
        path = path / 'index.html'
    if not path.is_relative_to(root.resolve()) or not path.is_file():
        route.fulfill(status=404, body='Unavailable in isolated capture')
        return
    route.fulfill(body=path.read_bytes(), content_type=mimetypes.guess_type(path.name)[0] or 'application/octet-stream')

with sync_playwright() as pw:
    browser = pw.chromium.launch()
    for key, (source, entry) in SOURCES.items():
        page = browser.new_page(viewport={'width': 1200, 'height': 840})
        page.route('**/*', lambda route: respond(route, source))
        page.goto('http://lab-capture.invalid' + entry)
        page.wait_for_timeout(1200)
        page.screenshot(path=str(ROOT / 'assets' / f'lab-{key}-overview-v1.png'))
        print('Captured', key, flush=True)
        assert page.locator('body').inner_text().strip(), key
        if key == 'foco':
            page.goto('http://lab-capture.invalid/sc/')
            page.wait_for_timeout(300)
            page.screenshot(path=str(ROOT / 'assets/lab-foco-edition-v1.png'))
        elif key == 'roots':
            page.locator('[data-model="glass"]').click()
            page.locator('.model-tabs').evaluate('e=>scrollTo(0,e.getBoundingClientRect().top+scrollY-60)')
            page.screenshot(path=str(ROOT / 'assets/lab-roots-greenhouse-v1.png'))
        elif key == 'game':
            page.get_by_role('button', name='Abrir aula', exact=True).click()
            page.wait_for_timeout(400)
            page.screenshot(path=str(ROOT / 'assets/lab-game-lesson-v1.png'))
        elif key == 'techia':
            page.get_by_role('button', name='Glossário', exact=True).click()
            page.wait_for_timeout(200)
            page.screenshot(path=str(ROOT / 'assets/lab-techia-glossary-v1.png'))
        elif key == 'ciclico':
            page.evaluate('scrollTo(0,760)')
            page.screenshot(path=str(ROOT / 'assets/lab-ciclico-community-v1.png'))
        page.close()
    browser.close()
