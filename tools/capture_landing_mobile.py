"""Capture complete mobile pages for the landing-page phone gallery."""
from pathlib import Path
from urllib.parse import unquote, urlsplit
import mimetypes
import sys
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
LP = Path('C:/Users/carlo/projects/landingpages')
SOURCES = [
    ('soberania-lp', None, 'https://landingpage.soberania.cloud/'),
    ('desafio-selvagem', Path('C:/Users/carlo/projects/websites/soberania-landing-pages/soberania-labs-scrollytelling/desafio-selvagem'), '/index.html'),
    ('entretrama', ROOT / 'demos/entretrama', '/index.html'),
    ('ciclico', Path('C:/Users/carlo/projects/planejamento_ciclico_repo/dist'), '/'),
    ('shala', LP / 'shala-site', '/index.html'),
    ('alma', LP / 'workshop-planejamento-estrategico-da-alma/current', '/index.html'),
    ('mariana', LP / 'mariana-tevah/current', '/index-ABRA-ESTE-AQUI.html'),
    ('mariaanna', LP / 'mariaanna_comunidade_landing/pastas/mariaanna_comunidade_landing_v3/mariaanna_comunidade_landing', '/index.html'),
]
OUTPUT = ROOT / 'demos/landing-collection/screens/mobile'


def serve(route, source):
    request = urlsplit(route.request.url)
    if request.hostname != 'landing-mobile.invalid':
        route.abort()
        return
    path = (source / unquote(request.path).lstrip('/')).resolve()
    if path.is_dir():
        path /= 'index.html'
    if not path.is_relative_to(source.resolve()) or not path.is_file():
        route.fulfill(status=404, body='Not found')
        return
    route.fulfill(body=path.read_bytes(), content_type=mimetypes.guess_type(path.name)[0] or 'application/octet-stream')


OUTPUT.mkdir(parents=True, exist_ok=True)
with sync_playwright() as playwright:
    browser = playwright.chromium.launch()
    for key, source, entry in SOURCES:
        if sys.argv[1:] and key not in sys.argv[1:]:
            continue
        page = browser.new_page(
            viewport={'width': 390, 'height': 844},
            device_scale_factor=1,
            is_mobile=True,
            has_touch=True,
            reduced_motion='reduce',
        )
        if source is None:
            page.goto(entry, wait_until='domcontentloaded')
        else:
            page.route('**/*', lambda route, request, root=source: serve(route, root))
            page.goto('http://landing-mobile.invalid' + entry, wait_until='domcontentloaded')
        page.wait_for_timeout(900)
        page.evaluate("document.querySelectorAll('img').forEach(image => image.loading = 'eager')")
        page.wait_for_timeout(350)
        output = OUTPUT / f'{key}-mobile-v1.jpg'
        page.screenshot(path=str(output), type='jpeg', quality=86, full_page=True)
        print(f'{key}: {output.stat().st_size:,} bytes; {page.locator("body").evaluate("e => e.scrollHeight")} px tall', flush=True)
        page.close()
    browser.close()
