"""Four-cover artifact excludes drafts and retains navigation and motion."""
from pathlib import Path
import json
import subprocess
from functools import partial
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from threading import Thread
from playwright.sync_api import sync_playwright, expect

ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'.pages-release'
identity=json.loads((OUT/'release.json').read_text(encoding='utf-8'))
assert identity['commit']==subprocess.check_output(['git','rev-parse','HEAD'],cwd=ROOT,text=True).strip()
assert identity['sections']==4
class QuietHandler(SimpleHTTPRequestHandler):
    def log_message(self,*args):
        pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(QuietHandler,directory=str(ROOT)))
Thread(target=server.serve_forever,daemon=True).start()
# The non-root path exercises the same relative-URL behavior as /SoberaniaHome/.
url=f'http://127.0.0.1:{server.server_port}/.pages-release/'
with sync_playwright() as pw:
    browser=pw.chromium.launch()
    for width,height in [(320,568),(390,844),(412,915),(1366,768)]:
        page=browser.new_page(viewport={'width':width,'height':height})
        errors=[]
        page.on('pageerror',lambda error:errors.append(str(error)))
        page.goto(url)
        page.wait_for_function('window.__SL_DEBUG?.ready')
        assert page.locator('main > section').count()==4
        assert page.locator('#trabalho,#processo,#editor,#laboratorio,#manifesto,#caderno,#content-dialog').count()==0
        assert not any('portfolio' in f.name for f in OUT.rglob('*') if f.is_file())
        assert page.locator('#section-counter').inner_text()=='01 / 04'
        page.locator('#open-index').click()
        expect(page.locator('#index-dialog')).to_be_visible()
        assert page.locator('.index-links a').count()==4
        page.locator('.index-links a[href="#deslocamento-2"]').click()
        expect(page.locator('#index-dialog')).not_to_be_visible()
        page.wait_for_timeout(120)
        assert page.locator('#section-counter').inner_text()=='04 / 04'
        page.evaluate('scrollTo({top:document.documentElement.scrollHeight,behavior:"instant"})')
        page.wait_for_timeout(160)
        expect(page.locator('#construction-title')).to_be_in_viewport()
        assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
        assert page.evaluate('''()=>[...document.querySelectorAll('a[href^="#"]')].every(a=>document.getElementById(a.hash.slice(1)))''')
        assert page.locator('.construction-signature strong').text_content()=='Soberania Labs'
        assert page.locator('.construction-signature span').text_content()=='Florianópolis · Brasil'
        assert page.locator('.construction-link').evaluate('(e)=>e.getAnimations().length')==1
        assert page.evaluate('''()=>[...document.images].every(i=>i.complete&&i.naturalWidth>0)''')
        assert page.request.get(url+'index.html').status==200
        assert page.request.get(url+'portfolio.js').status==404
        assert page.request.get(url+'assets/portfolio-monitor-public-v1.png').status==404
        page.locator('#toggle-motion-footer').click()
        page.wait_for_function('!window.__SL_DEBUG.enabled')
        assert page.locator('.construction-link').evaluate('(e)=>e.getAnimations().length')==0
        assert not errors,errors
        print(f'PASS public {width}x{height}: four covers, index, footer, motion, no draft chapters')
        page.close()
    for options in [{'reduced_motion':'reduce'},{'java_script_enabled':False}]:
        page=browser.new_page(viewport={'width':390,'height':844},**options)
        page.goto(url)
        page.locator('#construction-title').scroll_into_view_if_needed()
        expect(page.locator('#construction-title')).to_be_in_viewport()
        assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
        assert page.locator('.construction-link').evaluate('(e)=>e.getAnimations().length')==0
        print('PASS public fallback',options)
        page.close()
    browser.close()
server.shutdown()
server.server_close()
