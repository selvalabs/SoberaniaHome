"""The contact draft copies/downloads locally, without simulating a delivery."""
import argparse
from pathlib import Path
from playwright.sync_api import sync_playwright

parser = argparse.ArgumentParser()
parser.add_argument('--url', default='http://127.0.0.1:4206/')
args = parser.parse_args()
need = 'Projeto-teste-87: organizar o acervo da nossa cooperativa.'
clipboard_mock = """Object.defineProperty(navigator, 'clipboard', {configurable:true,
  value:{writeText:async text=>{window.__contactCopied=text}}});"""
storage = 'JSON.stringify({local:{...localStorage},session:{...sessionStorage}})'

with sync_playwright() as pw:
    browser = pw.chromium.launch()
    for width, height in [(320, 680), (390, 844), (1440, 960)]:
        ctx = browser.new_context(viewport={'width': width, 'height': height}, reduced_motion='reduce')
        ctx.add_init_script(clipboard_mock)
        page = ctx.new_page()
        page.goto(args.url, wait_until='load')
        action = page.locator('[data-contact-brief-copy]')
        action.wait_for(state='visible')
        form = page.locator('[data-contact-brief]')
        assert 'O envio ainda não está conectado' in form.inner_text()
        assert form.locator('[name]').count() == 0
        requests = []
        page.on('request', lambda req: requests.append((req.method, req.url, req.post_data)))
        before = page.evaluate(storage)
        original_url = page.url
        action.click()
        assert not page.locator('#contact-brief-project').evaluate('(el)=>el.validity.valid')
        assert page.evaluate('window.__contactCopied') is None
        page.locator('#contact-brief-project').fill('   ')
        action.click()
        assert 'Conte o que' in page.locator('#contact-brief-project').evaluate('(el)=>el.validationMessage')
        page.locator('#contact-brief-name').fill('Ana Exemplo')
        page.locator('#contact-brief-reply').fill('ana@example.invalid')
        page.locator('#contact-brief-project').fill(need)
        action.click()
        page.wait_for_function("document.querySelector('[data-contact-brief-status]').textContent.includes('Mensagem copiada')")
        copied = page.evaluate('window.__contactCopied')
        assert all(text in copied for text in ['Ana Exemplo', 'ana@example.invalid', need])
        assert 'Nada foi enviado' in page.locator('[data-contact-brief-status]').inner_text()
        assert page.locator('#contact-brief-project').input_value() == need
        assert page.url == original_url and page.evaluate(storage) == before
        assert not any(method == 'POST' or 'Projeto-teste-87' in url or body for method, url, body in requests)
        assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
        page.locator('#contact-brief-project').fill(need + ' Novo detalhe.')
        assert page.locator('[data-contact-brief-status]').inner_text() == ''
        print(f'PASS contact {width}: native validation, local copy, no request/storage, no overflow', flush=True)
        ctx.close()

    for fallback in ['missing', 'denied']:
        ctx = browser.new_context(viewport={'width': 390, 'height': 844}, reduced_motion='reduce', accept_downloads=True)
        value = 'undefined' if fallback == 'missing' else "{writeText:async()=>{throw new Error('denied')}}"
        ctx.add_init_script(f"Object.defineProperty(navigator,'clipboard',{{configurable:true,value:{value}}});")
        page = ctx.new_page()
        page.goto(args.url, wait_until='load')
        page.locator('#contact-brief-project').fill(need)
        with page.expect_download() as downloading:
            page.locator('[data-contact-brief-copy]').click()
        download = downloading.value
        assert download.suggested_filename == 'mensagem-soberania-labs.txt'
        message = Path(download.path()).read_text(encoding='utf-8')
        assert need in message and 'Nome:' not in message and 'Contato:' not in message
        assert 'download' in page.locator('[data-contact-brief-status]').inner_text()
        assert 'Nada foi enviado' in page.locator('[data-contact-brief-status]').inner_text()
        print(f'PASS contact fallback {fallback}: TXT contains only the local draft', flush=True)
        ctx.close()

    ctx = browser.new_context(java_script_enabled=False, viewport={'width': 390, 'height': 844})
    page = ctx.new_page()
    page.goto(args.url, wait_until='load')
    assert page.locator('[data-contact-brief-copy]').is_hidden()
    assert page.locator('[data-contact-brief-copy]').is_disabled()
    assert page.locator('#contact-brief-project').is_visible()
    assert 'Sem JavaScript' in page.locator('[data-contact-brief]').inner_text()
    navigations = []
    page.on('framenavigated', lambda frame: navigations.append(frame.url))
    page.locator('#contact-brief-name').fill('Ana Exemplo')
    page.locator('#contact-brief-name').press('Enter')
    page.wait_for_timeout(100)
    assert not navigations
    print('PASS contact without JS: honest notice, visible textarea, no implicit submission', flush=True)
    ctx.close()
    browser.close()
