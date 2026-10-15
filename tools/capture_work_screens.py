"""Capture real local product interfaces using isolated demonstration responses.

No product server, production data, account or source file is modified.
"""
import json
import mimetypes
from pathlib import Path
from urllib.parse import urlsplit
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
PROJECTS = Path('C:/Users/carlo/projects')
ANALYTICS = PROJECTS/'apitracker-internal-current/dashboard/frontend/dist'
MONITOR = PROJECTS/'monitor-comunitario/src/monitor_comunitario/web/static'


def static_response(route, root, relative):
    target = (root/relative).resolve()
    if not target.is_relative_to(root.resolve()) or not target.is_file():
        route.fulfill(status=404, body='Unavailable in local capture')
        return
    route.fulfill(body=target.read_bytes(), content_type=mimetypes.guess_type(target.name)[0] or 'application/octet-stream')


def analytics_response(route):
    path = urlsplit(route.request.url).path
    if path.startswith('/dashboard-api/'):
        endpoint = path.removeprefix('/dashboard-api/')
        responses = {
            'auth/me': {'username':'demo-viewer','role':'viewer'},
            'projects': [{'id':'demo','project_id':'demo','slug':'demo','name':'Projeto de demonstração','status':'active','origins':['https://example.invalid']}],
            'meta': {'event_catalog':['page_view','scroll_50','click_cta'],'default_funnel':['page_view','scroll_50','click_cta'],'public_base_url':'https://example.invalid','retention_days':90,'max_report_days':90},
            'funnel': {'start_sessions':100,'steps':[
                {'event_name':'page_view','sessions':100,'rate_from_previous':100,'rate_from_start':100,'drop_off':0},
                {'event_name':'scroll_50','sessions':68,'rate_from_previous':68,'rate_from_start':68,'drop_off':32},
                {'event_name':'click_cta','sessions':24,'rate_from_previous':2400/68,'rate_from_start':24,'drop_off':44},
            ]},
        }
        route.fulfill(status=200 if endpoint in responses else 404, content_type='application/json',body=json.dumps(responses.get(endpoint,{'detail':'Not needed for local capture'})))
        return
    static_response(route,ANALYTICS,path.lstrip('/') or 'index.html')


def monitor_response(route):
    path = urlsplit(route.request.url).path
    if path == '/member/me':
        data = {'user':{'id':0,'name':'Morador de demonstração','municipality':'Florianópolis','neighborhood':'Bairro de exemplo','street':'Rua de exemplo'},
            'preferences':{'celesc_scheduled':True,'celesc_emergency':True,'casan_water':True},
            'notifications':[{'title':'Exemplo de aviso programado','created_at':'2026-10-03T12:00:00Z',
                'message':'Demonstração: possível interrupção de energia no endereço cadastrado. Este registro é fictício e não representa um aviso atual da distribuidora.'}]}
        route.fulfill(content_type='application/json',body=json.dumps(data))
    elif path.startswith('/static/'):
        static_response(route,MONITOR,path.removeprefix('/static/'))
    elif path in ('/','/member'):
        static_response(route,MONITOR,'member.html' if path=='/member' else 'index.html')
    else:
        route.fulfill(content_type='application/json',body=json.dumps({'analytics_enabled':False,'ads_enabled':False,'consent_required':False,'consent_version':'portfolio-demo'}))


with sync_playwright() as pw:
    browser = pw.chromium.launch()
    page = browser.new_page(viewport={'width':1366,'height':900},device_scale_factor=1)
    page.route('**/*',analytics_response)
    for name, heading in [('funnel','Funil'),('documentation','Docs')]:
        page.goto(f'https://analytics-portfolio.invalid/#/{name}')
        page.get_by_role('heading',name=heading,exact=True).wait_for()
        if name=='funnel': page.get_by_text('Sessões que iniciaram',exact=True).wait_for()
        page.wait_for_timeout(450)
        page.screenshot(path=str(ROOT/'assets'/f'portfolio-analytics-{name}-v1.png'),full_page=True)
        print('Captured analytics:',name,flush=True)
    page.close()

    page = browser.new_page(viewport={'width':1100,'height':820},device_scale_factor=1)
    page.route('**/*',monitor_response)
    page.goto('https://monitor-portfolio.invalid/')
    page.wait_for_timeout(300)
    page.screenshot(path=str(ROOT/'assets'/'portfolio-monitor-public-v1.png'))
    page.locator('#cadastro').screenshot(path=str(ROOT/'assets'/'portfolio-monitor-registration-v1.png'))
    page.goto('https://monitor-portfolio.invalid/member')
    page.locator('#member-panel').wait_for(state='visible')
    notice_panel=page.locator('.panel').filter(has=page.locator('#member-notifications'))
    notice_panel.scroll_into_view_if_needed()
    position=notice_panel.bounding_box()
    page.evaluate('(y)=>scrollTo(0,scrollY+y-100)',position['y'])
    notice_panel.screenshot(path=str(ROOT/'assets'/'portfolio-monitor-member-v1.png'))
    print('Captured monitor: public page, registration, member notices with synthetic data',flush=True)
    page.close()

    page = browser.new_page(viewport={'width':1366,'height':900},device_scale_factor=1)
    page.goto((ROOT/'index.html').as_uri())
    page.wait_for_function('window.__SL_DEBUG?.ready')
    page.evaluate("window.SLMotion.jumpScene('editor',2)")
    page.wait_for_timeout(350)
    page.locator('#editor-demo').screenshot(path=str(ROOT/'assets'/'portfolio-editor-document-v1.png'))
    print('Captured inline editor: document before editing',flush=True)
    browser.close()
