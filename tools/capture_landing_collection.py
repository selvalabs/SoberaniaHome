"""Render local public landing pages in isolated browser contexts, without external requests."""
from pathlib import Path
from urllib.parse import urlsplit, unquote
import json, mimetypes
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
LP=Path('C:/Users/carlo/projects/landingpages')
SOURCES=[
 ('entretrama','Entretrama','Escola de tecelagem · estudo demonstrativo',ROOT/'demos/entretrama','/index.html','#metodo'),
 ('penochao','Escola Pé no Chão','Ensino de sapatos de crochê',LP/'pe_no_chao_landingpage_v31_remodelada_skill','/index.html','#metodo'),
 ('lapidar','Lapidar-se','Expressão criativa · Larissa Sampaio',LP/'clients/larissa-sampaio/lapidar-se/landing/larissa-lapidar-se','/index.html',None),
 ('mariana','Mariana Tevah','Apresentação pessoal e caminhos',LP/'mariana-tevah/current','/index-ABRA-ESTE-AQUI.html','#catalog-title'),
 ('alma','Planejamento Estratégico da Alma','Página de workshop',LP/'workshop-planejamento-estrategico-da-alma/current','/index.html',None),
 ('mariaanna','Comunidade Mariaanna Paz','Corpo, dança e pertencimento',LP/'mariaanna_comunidade_landing/pastas/mariaanna_comunidade_landing_v3/mariaanna_comunidade_landing','/index.html',None),
 ('ciclico','Planejamento Cíclico','Apresentação de comunidade',Path('C:/Users/carlo/projects/planejamento_ciclico_repo/dist'),'/',None),
 ('shala','SHÅLA Yoga & Arte','Reconstrução de referência · autoria da entrega a validar',LP/'shala-site','/index.html',None),
]
def serve(route,root):
 url=urlsplit(route.request.url)
 if url.hostname!='landing-capture.invalid': route.abort(); return
 p=(root/unquote(url.path).lstrip('/')).resolve()
 if p.is_dir():p=p/'index.html'
 if not p.is_relative_to(root.resolve()) or not p.is_file():route.fulfill(status=404,body='Not found');return
 route.fulfill(body=p.read_bytes(),content_type=mimetypes.guess_type(p.name)[0] or 'application/octet-stream')
output=ROOT/'demos/landing-collection/screens';output.mkdir(exist_ok=True,parents=True)
manifest=[]
with sync_playwright() as pw:
 browser=pw.chromium.launch()
 for key,name,kind,source,entry,anchor in SOURCES:
  page=browser.new_page(viewport={'width':1200,'height':840},reduced_motion='reduce')
  page.route('**/*',lambda route:serve(route,source))
  page.goto('http://landing-capture.invalid'+entry);page.wait_for_timeout(900)
  page.evaluate("document.querySelectorAll('img').forEach(i=>i.loading='eager')")
  page.wait_for_timeout(300)
  page.screenshot(path=str(output/f'{key}-abertura-v1.png'))
  if anchor and page.locator(anchor).count():page.locator(anchor).first.evaluate('e=>scrollTo(0,e.getBoundingClientRect().top+scrollY-110)')
  else:page.evaluate('scrollTo(0,innerHeight*1.1)')
  page.wait_for_timeout(300);page.screenshot(path=str(output/f'{key}-conteudo-v1.png'))
  manifest.append({'key':key,'name':name,'kind':kind,'pages':[{'label':'Abertura','asset':f'{key}-abertura-v1.png'},{'label':'Conteúdo','asset':f'{key}-conteudo-v1.png'}]})
  print('Captured',key,flush=True);page.close()
 browser.close()
(ROOT/'demos/landing-collection/data.js').write_text('window.SLLandingPages='+json.dumps(manifest,ensure_ascii=False,indent=2)+';\n',encoding='utf-8')
