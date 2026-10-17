"""Browser contract test with a mocked edge API; never invokes external inference."""
import argparse,json
from playwright.sync_api import sync_playwright

parser=argparse.ArgumentParser();parser.add_argument('--url',default='http://127.0.0.1:4183/');args=parser.parse_args()
with sync_playwright() as pw:
    browser=pw.chromium.launch()
    page=browser.new_page(viewport={'width':1280,'height':900},reduced_motion='reduce',accept_downloads=True)
    def enable_preview(route):
        response=route.fetch()
        route.fulfill(response=response,body=response.text().replace('data-edge-enabled="false"','data-edge-enabled="true"'))
    page.route(args.url,enable_preview)
    held=[]
    def api(route):
        if route.request.method=='GET':route.fulfill(json={'enabled':True,'mode':'edge'})
        else:held.append(route)
    page.route('**/api/atelier',api)
    page.goto(args.url,wait_until='load')
    page.locator('[data-atelier-ai]').wait_for(state='visible')
    original='Uma biblioteca comunitária precisa organizar seus documentos com fontes.'
    page.locator('#atelier-context').fill(original)
    page.locator('[data-atelier-ai]').click()
    page.wait_for_timeout(100)
    assert len(held)==1 and held[0].request.post_data_json['context']==original
    assert page.locator('#atelier-context').is_disabled()
    assert page.locator('#atelier-sector').is_disabled()
    assert page.locator('[data-atelier-export]').is_disabled()
    assert 'processamento externo' in page.locator('[data-atelier-mode]').text_content()
    proposal={'title':'Biblioteca com fontes','summary':'Uma hipótese pequena para investigar.','steps':[{'title':'Escutar','detail':'Conversar com a equipe.'},{'title':'Organizar','detail':'Testar uma coleção.'},{'title':'Revisar','detail':'Conferir as referências.'}],'data':['Documentos autorizados'],'human':['Revisão das fontes'],'next':'Testar uma coleção pequena.'}
    held.pop().fulfill(json={'mode':'edge','proposal':proposal})
    page.wait_for_function('document.querySelector("[data-atelier-title]").textContent === "Biblioteca com fontes"')
    assert not page.locator('#atelier-context').is_disabled()
    page.locator('#atelier-context').fill('Outro contexto, ainda não submetido ao serviço de inteligência artificial.')
    with page.expect_download() as download:page.locator('[data-atelier-export]').click()
    report=open(download.value.path(),encoding='utf-8').read()
    assert original in report and 'Outro contexto' not in report
    assert 'Nenhuma informação foi enviada' not in page.locator('[data-atelier-status]').inner_text()
    page.locator('[data-atelier-ai]').click();page.wait_for_timeout(100)
    held.pop().fulfill(status=503,json={'error':{'code':'AI_UNAVAILABLE','message':'IA temporariamente indisponível.'}})
    page.wait_for_function('!document.querySelector("#atelier-context").disabled')
    assert 'processamento externo' in page.locator('[data-atelier-mode]').text_content()
    assert page.locator('[data-atelier-title]').text_content()=='Biblioteca com fontes'
    print('PASS mocked edge UI: explicit sending, pending lock, response snapshot, local export, truthful failure state')
    browser.close()
