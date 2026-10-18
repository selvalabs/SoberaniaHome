"""Atelier UX/edge contract. All inference is mocked; no external model calls."""
import argparse, json, tempfile
from pathlib import Path
from playwright.sync_api import sync_playwright

parser=argparse.ArgumentParser();parser.add_argument('--url',default='http://127.0.0.1:4191/');args=parser.parse_args()
proposal={'title':'Biblioteca com fontes','summary':'Uma hipótese pequena para investigar.','steps':[{'title':'Escutar','detail':'Conversar com a equipe.'},{'title':'Organizar','detail':'Testar uma coleção.'},{'title':'Revisar','detail':'Conferir as referências.'}],'data':['Documentos autorizados'],'human':['Revisão das fontes'],'next':'Testar uma coleção pequena.'}

def enable_preview(route):
    response=route.fetch()
    route.fulfill(response=response,body=response.text().replace('data-edge-enabled="false"','data-edge-enabled="true"'))

def exported(page):
    with page.expect_download() as download: page.locator('[data-atelier-export]').click()
    return Path(download.value.path()).read_text(encoding='utf-8')

with sync_playwright() as pw:
    browser=pw.chromium.launch()
    for width,height in [(320,680),(390,844),(768,1024),(1440,960)]:
        ctx=browser.new_context(viewport={'width':width,'height':height},reduced_motion='reduce',accept_downloads=True)
        page=ctx.new_page();requests=[];page.on('request',lambda req:requests.append(req.url))
        page.goto(args.url,wait_until='load')
        assert 'Não conectada' in page.locator('[data-atelier-connection]').inner_text()
        assert page.locator('[data-atelier-ai]').is_hidden()
        page.locator('[data-atelier-example]').click()
        assert 'pedidos da feira' in page.locator('#atelier-context').input_value()
        assert page.locator('[data-atelier-draft]').is_visible()
        page.locator('[data-atelier-form] button[type=submit]').click()
        assert page.locator('[data-atelier-title]').evaluate('(el)=>el===document.activeElement')
        assert page.locator('[data-atelier-draft]').is_hidden()
        original=page.locator('#atelier-context').input_value()
        assert original in page.locator('[data-atelier-result-context]').inner_text()
        page.locator('#atelier-context').fill('Outra situação, ainda sem incorporar.')
        assert page.locator('[data-atelier-draft]').is_visible()
        report=exported(page)
        assert original in report and 'Outra situação' not in report
        assert 'não foi interpretada por IA' in report
        for sector,title in [('comunidade','Informação pública'),('educacao','Uma casa para aprender'),('cultura','Um arquivo vivo')]:
            page.locator('#atelier-sector').select_option(sector)
            assert title in page.locator('[data-atelier-title]').inner_text()
        assert not any('/api/atelier' in url for url in requests)
        assert '?' not in page.url
        assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
        page.locator('#possibilidades').screenshot(path=str(Path(tempfile.gettempdir())/f'atelier-36-{width}.png'))
        print(f'PASS local {width}: examples, drafts, snapshot export, focus, no transmission, no overflow',flush=True)
        ctx.close()

    ctx=browser.new_context(viewport={'width':1280,'height':900},reduced_motion='reduce',accept_downloads=True)
    page=ctx.new_page();page.route(args.url,enable_preview)
    held=[]
    def api(route):
        if route.request.method=='GET':route.fulfill(json={'enabled':True,'mode':'edge'})
        else:held.append(route)
    page.route('**/api/atelier',api)
    page.goto(args.url,wait_until='load');page.locator('[data-atelier-ai]').wait_for(state='visible')
    assert 'Cloudflare Workers AI' in page.locator('[data-atelier-privacy]').inner_text()
    page.locator('[data-atelier-ai]').click()
    assert page.locator('#atelier-context').get_attribute('aria-invalid')=='true'
    assert '20 caracteres' in page.locator('[data-atelier-error]').inner_text() and not held
    original='Uma biblioteca comunitária precisa organizar seus documentos com fontes.'
    page.locator('#atelier-context').fill(original)
    assert page.locator('[data-atelier-error]').is_hidden()
    page.locator('[data-atelier-ai]').click();page.wait_for_timeout(100)
    assert len(held)==1 and held[0].request.post_data_json['context']==original
    assert page.locator('#atelier-context').is_disabled() and page.locator('#atelier-sector').is_disabled()
    assert page.locator('[data-atelier-export]').is_disabled()
    assert 'processamento externo' in page.locator('[data-atelier-mode]').text_content()
    held.pop().fulfill(json={'mode':'edge','proposal':proposal})
    page.wait_for_function('document.querySelector("[data-atelier-title]").textContent === "Biblioteca com fontes"')
    assert original in page.locator('[data-atelier-result-context]').inner_text()
    page.locator('[data-atelier-view]').click()
    assert page.locator('[data-atelier-title]').evaluate('(el)=>el===document.activeElement')
    page.locator('#atelier-context').fill('Outro contexto, ainda não submetido ao serviço de inteligência artificial.')
    report=exported(page)
    assert original in report and 'Outro contexto' not in report and 'Proposta de IA' in report
    for status,payload,expected in [
        (503,{'error':{'message':'SECRET provider detail'}},'indisponível'),
        (429,{'error':{}},'limite de uso'),
        (504,{'error':{}},'demorou demais'),
        (200,{'proposal':{**proposal,'steps':[None]}},'incompleta'),
        (200,{'proposal':{**proposal,'title':'x'*101}},'incompleta'),
        (200,{'proposal':{**proposal,'summary':'<script>alert(1)</script>'}},'incompleta'),
        (200,None,'ilegível'),
    ]:
        page.locator('[data-atelier-ai]').click();page.wait_for_timeout(80)
        route=held.pop()
        if payload is None:route.fulfill(status=status,body='not json',content_type='text/plain')
        else:route.fulfill(status=status,json=payload)
        page.wait_for_function('!document.querySelector("#atelier-context").disabled')
        text=page.locator('[data-atelier-status]').inner_text()
        assert expected in text and 'SECRET' not in text and 'mantido' in text,text
        assert page.locator('[data-atelier-title]').text_content()=='Biblioteca com fontes'
        assert 'processamento externo' in page.locator('[data-atelier-mode]').text_content()
    page.locator('[data-atelier-ai]').click();page.wait_for_timeout(80);held.pop().abort('failed')
    page.wait_for_function('!document.querySelector("#atelier-context").disabled')
    assert 'conexão falhou' in page.locator('[data-atelier-status]').inner_text()
    # Accelerate only the 30s inference deadline; exercise the actual abort/catch path.
    page.evaluate("""() => {const original=AbortSignal.timeout.bind(AbortSignal);AbortSignal.timeout=ms=>original(ms===30000?100:ms)}""")
    page.locator('[data-atelier-ai]').click();page.wait_for_timeout(200)
    page.wait_for_function('!document.querySelector("#atelier-context").disabled')
    assert 'demorou demais' in page.locator('[data-atelier-status]').inner_text()
    held.pop().abort('aborted')
    page.locator('[data-atelier-form] button[type=submit]').click()
    assert 'Modo local' in page.locator('[data-atelier-mode]').text_content()
    assert 'Outro contexto' in page.locator('[data-atelier-result-context]').inner_text()
    assert 'Demonstração local' in exported(page)
    print('PASS mocked edge: validation, pending lock, snapshot, 503/429/504, malformed output, network, timeout, local recovery',flush=True)
    ctx.close()

    # Connection discovery fails visibly and can recover without sending a context.
    ctx=browser.new_context(viewport={'width':390,'height':844},reduced_motion='reduce')
    page=ctx.new_page();page.route(args.url,enable_preview);calls=[]
    def connection(route):
        calls.append(route.request.method)
        if len(calls)==1:route.abort('failed')
        elif len(calls)==2:route.fulfill(json={'enabled':False,'mode':'demo'})
        else:route.fulfill(json={'enabled':True,'mode':'edge'})
    page.route('**/api/atelier',connection);page.goto(args.url,wait_until='load')
    page.locator('[data-atelier-retry]').wait_for(state='visible')
    assert 'verificar a conexão' in page.locator('[data-atelier-connection]').inner_text()
    page.locator('[data-atelier-retry]').click()
    page.wait_for_function('document.querySelector("[data-atelier-connection]").textContent.includes("Não ativada")')
    page.locator('[data-atelier-retry]').click();page.locator('[data-atelier-ai]').wait_for(state='visible')
    assert calls==['GET','GET','GET']
    print('PASS mobile discovery: offline, disabled, explicit retry, connected; zero POST',flush=True)
    ctx.close();browser.close()
