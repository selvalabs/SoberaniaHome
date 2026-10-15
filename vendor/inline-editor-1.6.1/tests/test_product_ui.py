"""1.6 product UI regression: real downloads, editable/final round-trips and modal UX.

No production dependency is added. Native picker branches are simulated explicitly;
real OS pickers, Firefox, WebKit and physical mobile devices are not claimed tested.
"""
from pathlib import Path
import json, os, subprocess, traceback
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
QA = ROOT / 'qa/v161/product-ui'
QA.mkdir(parents=True, exist_ok=True)
HTML = (ROOT / 'INLINE_EDITOR_TEMPLATE.html').read_text(encoding='utf-8')
VERSION = json.loads((ROOT / 'VERSION.json').read_text())['version']
ROWS = []
VIEWPORTS = [(320,568),(375,667),(390,844),(768,1024),(1366,768),(1440,900),(1920,1080),(844,390)]

class Suite:
    def __init__(self, browser):
        self.browser = browser
        self.page = None
        self.errors = []
        self.downloads = []

    def new(self, width=1440, height=900, html=HTML):
        if self.page:
            self.page.close(run_before_unload=False)
        self.errors, self.downloads = [], []
        self.page = self.browser.new_page(viewport={'width': width, 'height': height}, accept_downloads=True)
        self.page.set_default_timeout(4000)
        self.page.on('pageerror', lambda error: self.errors.append(str(error)))
        self.page.on('download', lambda download: self.downloads.append(download.suggested_filename))
        self.page.set_content(html, wait_until='load')
        self.page.wait_for_timeout(80)
        return self.page

    def open(self):
        self.page.locator('#ie-launcher').click()

    def select(self, selector='#qa-text-a'):
        self.page.evaluate('(s)=>InlineEditor.select(document.querySelector(s))', selector)
        self.page.wait_for_timeout(30)

    def note(self, kind='note'):
        self.page.locator('#ie-tab-more').click()
        self.page.locator('#ie-subtab-comments').click()
        self.page.locator('#ie-comment-type').select_option(kind)
        self.page.locator('#ie-comment-text').fill('Registro QA 1.6 ' + kind)
        self.page.locator('#ie-comment-add').click()

    def dirty(self):
        return self.page.evaluate('InlineEditor.diagnostics().dirty')

    def focus(self):
        return self.page.evaluate('document.activeElement.id')

    def gate(self, name, fn):
        number = len(ROWS) + 1
        try:
            self.new()
            result = fn() or {}
            assert not self.errors, self.errors
            row = {'gate':number,'name':name,'status':'PASS','measurements':result}
            print('PASS', number, name, flush=True)
        except Exception as error:
            row = {'gate':number,'name':name,'status':'FAIL','error':str(error),'trace':traceback.format_exc(),'pageerrors':self.errors}
            print('FAIL', number, name, repr(error), flush=True)
            try:
                self.page.screenshot(path=str(QA / f'fail-{number}.png'))
            except Exception:
                pass
        ROWS.append(row)
        (ROOT/'qa/product-ui-results.json').write_text(json.dumps(ROWS,ensure_ascii=False,indent=2))

with sync_playwright() as pw:
    try:
        browser = pw.chromium.launch(headless=True)
    except Exception:
        browser = pw.chromium.launch(executable_path=os.environ.get('CHROMIUM_EXECUTABLE','/usr/bin/chromium'),headless=True,args=['--no-sandbox'])
    s = Suite(browser)

    def identity():
        assert s.page.evaluate('InlineEditor.version') == VERSION == json.loads((ROOT / 'VERSION.json').read_text())['version']
        assert s.page.locator('#ie-drag-handle small').inner_text() == VERSION
        assert '__IE_VERSION__' not in HTML
        assert VERSION in s.page.locator('#ie-about-modal').inner_text()
        assert VERSION in s.page.locator('#ie-help-modal').inner_text()
        assert not s.dirty()
        return {'version':VERSION}
    s.gate('Version consistency and clean boot', identity)

    def header():
        s.open()
        buttons=s.page.locator('#ie-drag-handle button')
        assert buttons.all_text_contents()==['?','©','−','×']
        for item in buttons.all():
            assert item.get_attribute('aria-label')
            assert item.get_attribute('data-help')
        assert s.page.locator('#ie-finish').inner_text()=='Fechar edição'
        assert s.page.locator('#ie-save').inner_text()=='Salvar editável'
        s.page.screenshot(path=str(QA/'editor-desktop.png'))
        return {'buttons':buttons.all_text_contents()}
    s.gate('Header order, accessible names and action labels',header)

    def about():
        s.open();s.page.locator('#ie-about-open').click()
        assert s.page.locator('#ie-about-modal').is_visible()
        text=s.page.locator('#ie-about-modal').inner_text()
        for word in ['© 2026','Execução local','Uso interno','COPYRIGHT.md']:assert word in text
        assert s.focus()=='ie-about-close'
        assert s.page.locator('#ie-about-open').get_attribute('aria-expanded')=='true'
        s.page.screenshot(path=str(QA/'about-desktop.png'))
        s.page.locator('#ie-about-close').click()
        assert s.focus()=='ie-about-open'
        assert s.page.locator('#ie-about-open').get_attribute('aria-expanded')=='false'
    s.gate('About content, close and focus restoration',about)

    def about_keys():
        s.open();s.page.locator('#ie-about-open').click()
        for key in ['Tab','Shift+Tab']:s.page.keyboard.press(key);assert s.focus()=='ie-about-close'
        s.page.keyboard.press('Escape');assert s.focus()=='ie-about-open'
        assert s.page.locator('#ie-about-modal').is_hidden()
    s.gate('About keyboard loop and Escape',about_keys)

    def help_home():
        s.open();s.page.locator('#ie-help-open').click()
        assert s.focus()=='ie-help-search'
        assert s.page.locator('[data-ie-help-topic]:visible').count()==8
        assert s.page.locator('.ie-help-article:visible').count()==0
        s.page.screenshot(path=str(QA/'help-desktop.png'))
        assert s.page.locator('#ie-help-modal [role=dialog]').get_attribute('aria-modal')=='true'
    s.gate('Help overview with eight task guides',help_home)

    def help_topics():
        s.open();s.page.locator('#ie-help-open').click()
        ids=s.page.locator('[data-ie-help-topic]').evaluate_all('(es)=>es.map(e=>e.dataset.ieHelpTopic)')
        for name in ids:
            s.page.locator(f'[data-ie-help-topic={name}]').click()
            assert s.page.locator('.ie-help-article:visible').count()==1
            assert s.page.locator(f'#ie-help-article-{name}').is_visible()
            assert s.page.evaluate('document.activeElement.tagName')=='H3'
            s.page.locator('#ie-help-back').click()
        s.page.locator('[data-ie-help-topic=comments]').click()
        s.page.locator('#ie-help-category').select_option('layout')
        assert s.page.locator('#ie-help-article-layout').is_visible()
        s.page.screenshot(path=str(QA/'help-layout-desktop.png'))
        return {'topics':ids}
    s.gate('Navigate every guide, back and category switch',help_topics)

    def search():
        s.open();s.page.locator('#ie-help-open').click()
        for query,topic in [('PADDING','layout'),('comENTÁrios','comments'),('publicar','save'),('FONTE','text'),('column-gap','layout')]:
            s.page.locator('#ie-help-search').fill(query)
            assert s.page.locator(f'[data-ie-help-topic={topic}]').is_visible(),query
        s.page.locator('#ie-help-search').fill('padding')
        s.page.keyboard.press('Enter');assert s.page.locator('#ie-help-article-layout').is_visible()
        return {'case_accent_body_search':True}
    s.gate('Local search, accents, keywords and Enter',search)

    def empty():
        s.open();s.page.locator('#ie-help-open').click();s.page.locator('#ie-help-search').fill('xxyyzzzznothing')
        assert s.page.locator('#ie-help-empty').is_visible()
        assert s.page.locator('[data-ie-help-topic]:visible').count()==0
        assert '0 tópicos' in s.page.locator('#ie-help-search-status').inner_text()
        s.page.locator('#ie-help-clear').click();assert s.focus()=='ie-help-search'
        assert s.page.locator('[data-ie-help-topic]:visible').count()==8
    s.gate('Empty results, live status and clear search',empty)

    def inert_query():
        s.open();s.page.locator('#ie-help-open').click()
        s.page.locator('#ie-help-search').fill('<img src=x onerror="window.__injected=1">')
        assert s.page.evaluate('window.__injected') is None
        assert s.page.locator('#ie-help-modal img').count()==0
        assert s.page.locator('#ie-help-empty').is_visible()
    s.gate('Search input is never interpreted as markup',inert_query)

    def no_selection():
        s.open();s.page.locator('#ie-help-open').click();assert s.page.locator('#ie-help-context').is_hidden()
    s.gate('Help without a selection',no_selection)

    def selection():
        s.open();s.select();s.page.locator('#ie-help-open').click()
        assert s.page.locator('#ie-help-context').is_visible()
        assert 'qa-text-a' in s.page.locator('#ie-help-selection').inner_text()
        assert 'BLOCO' in s.page.locator('#ie-help-scope').inner_text()
    s.gate('Single-selection context',selection)

    def multiple():
        s.open();s.page.evaluate("InlineEditor.selectMany(['#qa-text-a','#qa-text-b'].map(x=>document.querySelector(x)))")
        s.page.wait_for_timeout(40);s.page.locator('#ie-help-open').click()
        assert '2 elementos' in s.page.locator('#ie-help-selection').inner_text()
        assert '2 BLOCOS' in s.page.locator('#ie-help-scope').inner_text()
    s.gate('Multiple-selection context',multiple)

    def range_context():
        s.open();s.select()
        s.page.evaluate('''()=>{const e=document.querySelector('#qa-text-a'),w=document.createTreeWalker(e,NodeFilter.SHOW_TEXT),n=w.nextNode(),r=document.createRange();r.setStart(n,0);r.setEnd(n,5);getSelection().removeAllRanges();getSelection().addRange(r);document.dispatchEvent(new Event('selectionchange'))}''')
        s.page.wait_for_timeout(80)
        before=s.page.evaluate('InlineEditor.controllers.TextRangeController.resolve().range.toString()')
        s.page.locator('#ie-help-open').click();assert 'TRECHO' in s.page.locator('#ie-help-scope').inner_text()
        s.page.keyboard.press('Escape')
        after=s.page.evaluate('InlineEditor.controllers.TextRangeController.resolve().range.toString()')
        assert before==after
        return {'quote':after}
    s.gate('Text Range survives Help focus and Escape',range_context)

    def ui_no_mutation():
        s.open();s.select();initial=s.page.evaluate('InlineEditor.diagnostics()')
        s.page.locator('#ie-help-open').click();s.page.locator('#ie-help-search').fill('fundo');s.page.keyboard.press('Escape')
        s.page.locator('#ie-about-open').click();s.page.keyboard.press('Escape')
        end=s.page.evaluate('InlineEditor.diagnostics()')
        assert initial['history']==end['history'] and not end['dirty'] and initial['selection']==end['selection']
        assert s.focus()=='ie-about-open'
    s.gate('Help and About do not change authoring history or dirty state',ui_no_mutation)

    def minimized():
        s.new(320,568);s.open();s.page.locator('#ie-minimize').click()
        assert s.page.locator('#ie-minimize').get_attribute('aria-label')=='Expandir editor'
        assert s.page.locator('#ie-minimize').get_attribute('aria-expanded')=='false'
        bounds=s.page.locator('#ie-toolbar').bounding_box();assert bounds['x']+bounds['width']<=320
        s.page.locator('#ie-about-open').click();s.page.keyboard.press('Escape')
        s.page.locator('#ie-minimize').click();assert s.page.locator('#ie-minimize').get_attribute('aria-expanded')=='true'
        return {'minimized_bounds':bounds}
    s.gate('Mobile minimized header remains usable',minimized)

    def finish():
        s.open();s.page.locator('#ie-finish').click()
        assert s.page.locator('#ie-launcher').is_visible() and not s.downloads
        s.open();s.page.locator('#ie-close').click();assert s.page.locator('#ie-launcher').is_visible()
    s.gate('Fechar edição and × only close the editor',finish)

    def close_dirty():
        s.open();s.select();s.note();s.page.locator('#ie-finish').click()
        assert s.page.locator('#ie-dialog').is_visible()
        assert 'Salvar editável' in s.page.locator('#ie-dialog-message').inner_text()
        s.page.keyboard.press('Escape');assert s.page.locator('#ie-toolbar').is_visible() and s.dirty()
    s.gate('Closing a dirty edit asks for confirmation',close_dirty)

    def save_editable():
        s.open();s.select();s.note('llm_task')
        with s.page.expect_download() as download:s.page.locator('#ie-save').click()
        d=download.value;d.save_as(str(QA/'editable.html'))
        assert '_EDITADO_' in d.suggested_filename and not s.dirty()
        html=(QA/'editable.html').read_text();s.new(html=html)
        assert s.page.evaluate('InlineEditor.version')==VERSION
        for modal in ['ie-toolbar','ie-help-modal','ie-about-modal']:assert s.page.locator('#'+modal).is_hidden()
        registry=json.loads(s.page.locator('#ie-comments-data').text_content())
        assert registry['records'][0]['type']=='llm_task'
        s.open();s.page.locator('#ie-help-open').click();assert s.page.locator('[data-ie-help-topic]:visible').count()==8
        return {'bytes':len(html.encode()),'comment_persisted':True}
    s.gate('Editable real download and reopen retain editor and tasks',save_editable)

    def save_open_help():
        s.open();s.select();s.page.locator('#ie-help-open').click();s.page.locator('[data-ie-help-topic=layout]').click()
        html=s.page.evaluate('InlineEditor.serialize()');s.new(html=html)
        assert s.page.locator('#ie-help-modal').is_hidden()
        assert s.page.locator('#ie-help-open').get_attribute('aria-expanded')=='false'
        s.open();s.page.locator('#ie-help-open').click();assert s.page.locator('#ie-help-home').is_visible()
        assert s.page.locator('.ie-help-article:visible').count()==0
    s.gate('Editable serialization resets open Help UI state',save_open_help)

    def save_open_about():
        s.open();s.page.locator('#ie-about-open').click()
        html=s.page.evaluate('InlineEditor.serialize()');s.new(html=html)
        assert s.page.locator('#ie-about-modal').is_hidden()
        assert s.page.locator('#ie-about-open').get_attribute('aria-expanded')=='false'
        s.open();s.page.locator('#ie-about-open').click();assert s.page.locator('#ie-about-modal').is_visible()
    s.gate('Editable serialization resets open About UI state',save_open_about)

    def export_cancel():
        s.open();s.select();s.note();s.page.locator('#ie-export-final').click()
        assert s.page.locator('#ie-dialog-confirm').inner_text()=='Exportar final'
        assert 'comentários' in s.page.locator('#ie-dialog-message').inner_text()
        s.page.locator('#ie-dialog-cancel').click()
        assert not s.downloads and s.dirty() and s.focus()=='ie-export-final'
    s.gate('Final export confirmation cancel preserves the working document',export_cancel)

    def final_download():
        s.open();s.select();s.note('llm_task')
        s.page.evaluate('''()=>{const e=document.querySelector('#qa-text-a');InlineEditor.controllers.HistoryManager.mutate('QA color',[e],()=>e.style.color='rgb(170, 40, 80)')}''')
        s.page.locator('#ie-export-final').click()
        with s.page.expect_download() as download:s.page.locator('#ie-dialog-confirm').click()
        d=download.value;d.save_as(str(QA/'final.html'));assert '_FINAL_' in d.suggested_filename
        assert s.dirty() and s.page.evaluate('InlineEditor.state.editMode')
        assert s.page.locator('#qa-text-a').get_attribute('data-ie-comments')
        html=(QA/'final.html').read_text();s.new(html=html)
        assert s.page.evaluate('typeof InlineEditor')=='undefined'
        assert s.page.locator('[data-ie-runtime],#ie-comments-data,[data-ie-comment-anchor],[data-ie-comments]').count()==0
        assert s.page.locator('#qa-text-a').evaluate('e=>getComputedStyle(e).color')=='rgb(170, 40, 80)'
        assert s.page.locator('#inline-editor-authored-css[data-ie-authored]').count()==1
        assert s.page.locator('#inline-editor-authored-js[data-ie-authored]').count()==1
        assert s.page.evaluate('typeof IEAuthored')=='object'
        assert 'Registro QA 1.6' not in html and 'ie-about-modal' not in html
        return {'bytes':len(html.encode()),'editor_absent':True,'authored_preserved':True}
    s.gate('Final real download strips editorial UI and preserves authored result',final_download)

    def final_then_editable():
        s.open();s.select();s.note('llm_task')
        s.page.locator('#ie-export-final').click()
        with s.page.expect_download() as d:s.page.locator('#ie-dialog-confirm').click()
        assert s.dirty()
        with s.page.expect_download() as d:s.page.locator('#ie-save').click()
        d.value.save_as(str(QA/'editable-after-final.html'));assert not s.dirty()
        s.new(html=(QA/'editable-after-final.html').read_text());assert s.page.locator('#ie-comments-data').count()==1
        assert s.page.evaluate('InlineEditor.version')==VERSION
    s.gate('Final export does not replace saving the editable draft',final_then_editable)

    def keyboard_save():
        s.open();s.select();s.note()
        with s.page.expect_download() as d:s.page.keyboard.press('Control+s')
        assert '_EDITADO_' in d.value.suggested_filename and not s.dirty()
    s.gate('Ctrl+S still saves editable, not final',keyboard_save)

    def native_success():
        s.open();s.select();s.note()
        s.page.evaluate('''()=>{Object.defineProperty(window,'isSecureContext',{value:true,configurable:true});window.showSaveFilePicker=async(opts)=>{window.__pickerOptions=opts;return {createWritable:async()=>({write:async value=>{window.__written=value},close:async()=>{window.__closed=true}})}}}''')
        s.page.locator('#ie-export-final').click();s.page.locator('#ie-dialog-confirm').click();s.page.wait_for_timeout(100)
        assert s.page.evaluate('window.__closed') and s.dirty()
        assert '_FINAL_' in s.page.evaluate('window.__pickerOptions.suggestedName')
        assert 'ie-about-modal' not in s.page.evaluate('window.__written')
        s.page.locator('#ie-save').click();s.page.wait_for_timeout(100);assert not s.dirty()
        assert '_EDITADO_' in s.page.evaluate('window.__pickerOptions.suggestedName')
        return {'picker':'simulated, not native OS UI'}
    s.gate('Simulated file picker writes final versus editable correctly',native_success)

    def native_abort():
        s.open();s.select();s.note()
        s.page.evaluate("()=>{Object.defineProperty(window,'isSecureContext',{value:true,configurable:true});window.showSaveFilePicker=async()=>{throw new DOMException('Cancelled','AbortError')}}")
        s.page.locator('#ie-export-final').click();s.page.locator('#ie-dialog-confirm').click();s.page.wait_for_timeout(100)
        assert s.dirty() and not s.downloads and not s.page.evaluate('InlineEditor.state.saving')
    s.gate('Simulated native picker cancellation preserves pending edits',native_abort)

    def native_fallback():
        s.open();s.select();s.note()
        s.page.evaluate("()=>{Object.defineProperty(window,'isSecureContext',{value:true,configurable:true});window.showSaveFilePicker=async()=>{throw new Error('Permission denied')}}")
        s.page.locator('#ie-export-final').click()
        with s.page.expect_download() as d:s.page.locator('#ie-dialog-confirm').click()
        assert '_FINAL_' in d.value.suggested_filename and s.dirty()
    s.gate('Simulated picker failure falls back to final HTML download',native_fallback)

    def repeat_export():
        s.open();s.page.evaluate("document.querySelector('#ie-export-final').click();document.querySelector('#ie-export-final').click()")
        assert s.page.locator('#ie-dialog:visible').count()==1
        with s.page.expect_download() as d:s.page.locator('#ie-dialog-confirm').click()
        s.page.wait_for_timeout(80);assert len(s.downloads)==1
    s.gate('Repeated export click does not open duplicate saves',repeat_export)

    def focus_help():
        s.open();s.page.locator('#ie-help-open').click()
        s.page.locator('#ie-help-close').focus();s.page.keyboard.press('Shift+Tab')
        assert s.page.locator('[data-ie-help-topic=limits]').evaluate('e=>e===document.activeElement')
        s.page.keyboard.press('Tab');assert s.focus()=='ie-help-close'
        s.page.keyboard.press('Escape');assert s.focus()=='ie-help-open'
    s.gate('Help Tab loop, Shift+Tab and return focus',focus_help)

    def comment_guidance():
        s.open();s.page.locator('#ie-help-open').click();s.page.locator('[data-ie-help-topic=comments]').click()
        text=s.page.locator('#ie-help-article-comments').inner_text()
        for word in ['Não solicita uma alteração','llm_task','status=open','data-ie-comment-anchor','não chama uma IA','Salvar editável']:assert word in text,word
        s.page.screenshot(path=str(QA/'help-comments-desktop.png'))
    s.gate('Help explains notes, LLM tasks, anchors and manual handoff',comment_guidance)

    def no_network():
        s.new();requests=[]
        s.page.on('request',lambda req:requests.append(req.url))
        s.page.context.set_offline(True)
        s.open();s.select();s.page.locator('#ie-help-open').click();s.page.locator('#ie-help-search').fill('publicar');s.page.keyboard.press('Escape')
        s.page.locator('#ie-about-open').click();s.page.keyboard.press('Escape')
        with s.page.expect_download() as d:s.page.locator('#ie-save').click()
        assert not [url for url in requests if url.startswith(('http:','https:'))]
        return {'offline_help_about_save':True,'http_requests':0}
    s.gate('New UI and editable download work offline with no HTTP request',no_network)

    def integrate():
        output=QA/'integrated-template.html'
        source=ROOT/'tests/fixtures/canonical-host.html'
        # Source token belongs to the example title only; stamp it just as build does.
        host=QA/'integration-host.html';host.write_text(source.read_text().replace('__IE_VERSION__',VERSION))
        result=subprocess.run(['node',str(ROOT/'tools/integrate.mjs'),str(host),str(output)],capture_output=True,text=True,check=True)
        data=output.read_text();head=(ROOT/'src/head.fragment.html').read_text();body=(ROOT/'src/body.fragment.html').read_text()
        restored=data.replace(head+'\n','',1).replace(body+'\n','',1)
        assert restored==host.read_text()
        s.new(html=data);assert s.page.evaluate('InlineEditor.version')==VERSION
        refused=subprocess.run(['node',str(ROOT/'tools/integrate.mjs'),str(output),str(QA/'should-not-exist.html')],capture_output=True,text=True)
        assert refused.returncode!=0 and not (QA/'should-not-exist.html').exists()
        return {'host_bytes_unchanged':True,'duplicate_install_refused':True}
    s.gate('Canonical integration preserves host bytes and refuses an existing editor',integrate)

    def responsive(width,height):
        s.new(width,height);s.open();s.select()
        for kind in ['help','about']:
            s.page.locator('#ie-'+kind+'-open').click()
            card=s.page.locator('#ie-'+kind+'-modal [role=dialog]')
            rect=card.bounding_box();assert rect['x']>=0 and rect['y']>=0
            assert rect['x']+rect['width']<=width+1 and rect['y']+rect['height']<=height+1
            assert card.evaluate('e=>e.scrollWidth<=e.clientWidth+1')
            if kind=='help':
                s.page.screenshot(path=str(QA/f'help-{width}x{height}.png'))
                s.page.locator('[data-ie-help-topic=layout]').click()
                assert s.page.locator('#ie-help-scroll').evaluate('e=>e.scrollWidth<=e.clientWidth+1')
                s.page.locator('#ie-help-scroll').evaluate('e=>e.scrollTop=e.scrollHeight')
                assert s.page.locator('#ie-help-close').is_visible()
            else:s.page.screenshot(path=str(QA/f'about-{width}x{height}.png'))
            s.page.keyboard.press('Escape')
        s.page.locator('#ie-export-final').click()
        card=s.page.locator('#ie-dialog [role=dialog]');rect=card.bounding_box()
        assert rect['x']>=0 and rect['y']>=0 and rect['y']+rect['height']<=height+1,rect
        s.page.keyboard.press('Escape')
        return {'viewport':[width,height],'help_about_export_bounds':True}
    for width,height in VIEWPORTS:
        s.gate(f'Responsive modals {width}x{height}',lambda w=width,h=height:responsive(w,h))

    if s.page:s.page.close(run_before_unload=False)
    environment={'browser':browser.version,'engine':'Chromium','platform':'Linux','viewports':[list(x) for x in VIEWPORTS],'physical_devices':False,'native_picker':'simulated'}
    (QA/'environment.json').write_text(json.dumps(environment,indent=2))
    browser.close()
print('SUMMARY',sum(r['status']=='PASS' for r in ROWS),'/',len(ROWS),flush=True)
raise SystemExit(0 if all(r['status']=='PASS' for r in ROWS) else 1)
