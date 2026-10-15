"""Delete & Smart Reflow: browser behavior, node identity, layouts and serialization.
No HTML scripts from an external service are fetched. Uses the included local fixture.
"""
from pathlib import Path
import json, os, traceback, subprocess
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
QA=ROOT/'qa/v161'; QA.mkdir(parents=True,exist_ok=True)
subprocess.run(['node',str(ROOT/'tools/integrate.mjs'),str(ROOT/'tests/fixtures/delete-layouts-host.html'),str(QA/'layouts-editable.html')],check=True)
HTML=(QA/'layouts-editable.html').read_text()
RESULTS=[]
class Suite:
    def __init__(self,b):self.b=b;self.page=None
    def new(self,w=1440,h=900,html=HTML):
        if self.page:self.page.close(run_before_unload=False)
        self.errors=[];self.page=self.b.new_page(viewport={'width':w,'height':h},accept_downloads=True)
        self.page.on('pageerror',lambda e:self.errors.append(str(e)));self.page.set_default_timeout(3500)
        self.page.set_content(html,wait_until='load');self.page.wait_for_timeout(40)
        self.page.evaluate('window.DC=InlineEditor.controllers.DeleteController;window.HM=InlineEditor.controllers.HistoryManager;window.CM=InlineEditor.controllers.CommentManager;window.SE=InlineEditor.controllers.SelectionEngine')
        self.open();return self.page
    def open(self):
        self.page.evaluate('InlineEditor.open()')
        if self.page.viewport_size['width']>700:self.page.evaluate("Object.assign(document.querySelector('#ie-toolbar').style,{left:(innerWidth-375)+'px',top:'20px'})")
        self.page.wait_for_timeout(40)
    def js(self,code,arg=None):return self.page.evaluate(code,arg)
    def select(self,*ids):
        self.js('(ids)=>InlineEditor.selectMany(ids.map(id=>document.getElementById(id)))',list(ids));self.page.wait_for_timeout(25)
    def remove(self,space=False):return self.js('(space)=>DC.remove({preserveSpace:space})',space)
    def exists(self,id):return self.page.locator('#'+id).count()==1
    def box(self,id):return self.js('(id)=>DC.rect(document.getElementById(id))',id)
    def near(self,a,b,t=2):assert all(abs(a[k]-b[k])<=t for k in a),(a,b)
    def history(self):return self.js('HM.undoStack.length')
    def order(self,id):return self.js('(id)=>[...document.getElementById(id).children].map(e=>e.id)',id)
    def undo(self):self.js('InlineEditor.undo()');self.page.wait_for_timeout(35)
    def redo(self):self.js('InlineEditor.redo()');self.page.wait_for_timeout(35)
    def focus_blank(self):self.js('document.activeElement.blur()')
    def add_record(self,id,type='note',status=None):
        return self.js('''([id,type,status])=>{const el=document.getElementById(id),anchor='anchor-'+id;const record={id:'record-'+id,type,status:status||(type==='note'?'info':'open'),text:'Comentário de teste '+id,target:anchor,createdAt:'2026-09-13T00:00:00Z',range:{start:0,end:4,quote:'teste'}};CM.writeRaw(el,anchor,[record]);return record}''',[id,type,status])
    def begin_delete(self,space=False):self.js('(space)=>{window.deletePromise=DC.remove({preserveSpace:space});}',space)
    def confirm(self,yes=True):
        assert self.page.locator('#ie-dialog').is_visible()
        self.page.locator('#ie-dialog-confirm' if yes else '#ie-dialog-cancel').click()
        return self.js('window.deletePromise')
    def set_height(self,id,n):
        self.select(id);self.js('(n)=>InlineEditor.controllers.GeometryController.setDimension("height",n)',str(n));self.page.wait_for_timeout(20)
    def case(self,name,fn):
        n=len(RESULTS)+1
        only=os.environ.get('DELETE_ONLY')
        if only and str(n) not in only.split(','):
            RESULTS.append({'gate':n,'name':name,'status':'NOT_RUN'});return
        try:
            self.new();out=fn() or {};self.page.wait_for_timeout(20);assert not self.errors,self.errors
            result={'gate':n,'name':name,'status':'PASS','measurements':out};print('PASS',n,name,flush=True)
        except Exception as e:
            result={'gate':n,'name':name,'status':'FAIL','error':str(e),'trace':traceback.format_exc(),'pageerrors':self.errors};print('FAIL',n,name,str(e)[:300],flush=True)
            try:self.page.screenshot(path=str(QA/f'delete-fail-{n}.png'))
            except:pass
        RESULTS.append(result);(ROOT/'qa/delete-reflow-results.json').write_text(json.dumps(RESULTS,ensure_ascii=False,indent=2))
with sync_playwright() as w:
    try:b=w.chromium.launch(headless=True)
    except:b=w.chromium.launch(executable_path=os.environ.get('CHROMIUM_EXECUTABLE','/usr/bin/chromium'),headless=True,args=['--no-sandbox'])
    s=Suite(b)
    def boot():
        assert s.js('InlineEditor.version')==json.loads((ROOT/'VERSION.json').read_text())['version'];assert s.js('!!DC')
        assert s.page.locator('#ie-delete-element').get_attribute('aria-keyshortcuts')=='Delete'
        assert not s.js('InlineEditor.diagnostics().dirty')
    s.case('Boot / accessible delete control',boot)
    def adjacent():
        s.select('flex-b');s.js('InlineEditor.state.freeMove=true');s.select('flex-b')
        a=s.page.locator('#ie-move-handle').bounding_box();d=s.page.locator('#ie-delete-element').bounding_box();assert a and d
        assert d['x']>=a['x']+a['width'] and abs(d['y']-a['y'])<=4
        s.page.screenshot(path=str(QA/'delete-desktop.png'));return {'move':a,'delete':d}
    s.case('Delete is beside the move handle',adjacent)
    s.case('No selection: actions hidden',lambda: (None if not s.page.locator('#ie-delete-element').is_visible() else (_ for _ in ()).throw(AssertionError())))
    def root_ui():
        s.select('app');assert not s.page.locator('#ie-delete-element').is_visible();assert not s.remove();assert s.exists('app')
    s.case('Protected app root: hidden delete and feedback',root_ui)
    def natural_click():
        y=s.box('flow-c')['y'];s.select('flow-b');s.page.locator('#ie-delete-element').click();assert not s.exists('flow-b');assert s.box('flow-c')['y']<y-80;assert s.history()==1;assert s.js('InlineEditor.state.selected') is None
        assert not s.page.locator('#ie-selection-overlay').is_visible();return {'natural_shift':y-s.box('flow-c')['y']}
    s.case('Real click: normal flow collapses naturally',natural_click)
    def keyboard():
        s.select('flow-b');s.focus_blank();s.page.keyboard.press('Delete');assert not s.exists('flow-b');assert s.history()==1
    s.case('Delete keyboard removes structural selection',keyboard)
    def modified():
        s.select('flow-b');s.focus_blank()
        for key in ['Control+Delete','Alt+Delete','Shift+Delete','Backspace']:s.page.keyboard.press(key);assert s.exists('flow-b')
        assert s.history()==0
    s.case('Modified Delete and Backspace are not global deletion',modified)
    def repeat():
        s.select('flow-b');s.focus_blank();s.js("document.body.dispatchEvent(new KeyboardEvent('keydown',{key:'Delete',repeat:true,bubbles:true,cancelable:true}))");assert s.exists('flow-b');assert s.history()==0
    s.case('Repeated key events do not trigger deletion',repeat)
    def inactive():
        s.select('flow-b');s.js('InlineEditor.close()');s.page.keyboard.press('Delete');assert s.exists('flow-b');assert not s.remove()
    s.case('Editor closed: no structural deletion',inactive)
    def during_move():
        s.page.locator('#abs-a').scroll_into_view_if_needed();s.select('abs-a');r=s.page.locator('#ie-move-handle').bounding_box();s.page.mouse.move(r['x']+r['width']/2,r['y']+r['height']/2);s.page.mouse.down();assert s.js('!!InlineEditor.state.geometry')
        s.page.keyboard.press('Delete');assert s.exists('abs-a');assert s.history()==0;s.page.mouse.up();assert s.js("HM.undoStack.filter(r=>r.kind==='delete').length")==0
    s.case('No deletion during a live pointer gesture',during_move)
    def field(id):
        s.select('flow-b');s.js('(id)=>{const e=document.getElementById(id);e.focus();e.setSelectionRange?.(0,0)}',id);s.page.keyboard.press('Delete');assert s.exists('flow-b')
        assert s.page.locator('#'+id).input_value()=='BC';assert s.history()==0
    s.case('Host input: Delete edits characters',lambda:field('host-input'))
    s.case('Host textarea: Delete edits characters',lambda:field('host-textarea'))
    def select_field():
        s.select('flow-b');s.page.locator('#host-select').focus();s.page.keyboard.press('Delete');assert s.exists('flow-b');assert s.history()==0
    s.case('Host select: Delete is not intercepted',select_field)
    def native_editable():
        s.select('flow-b');s.js("{const e=document.getElementById('host-editable');e.focus();const r=document.createRange();r.setStart(e.firstChild,0);r.collapse(true);getSelection().removeAllRanges();getSelection().addRange(r)}")
        s.page.keyboard.press('Delete');assert s.exists('flow-b');assert s.exists('host-editable');assert s.page.locator('#host-editable').inner_text()=='BC'
    s.case('Foreign contenteditable remains text editing',native_editable)
    def editor_text():
        s.select('text-root');before=s.page.locator('#text-root').inner_text();s.js("{const e=document.getElementById('text-root');e.focus();const r=document.createRange();r.setStart(e.firstChild,0);r.collapse(true);getSelection().removeAllRanges();getSelection().addRange(r)}");s.page.keyboard.press('Delete');assert s.exists('text-root');assert s.page.locator('#text-root').inner_text()==before[1:]
    s.case('Editor contenteditable: no structural delete',editor_text)
    def range_select():
        s.select('text-root');s.js("InlineEditor.controllers.TextRangeController.restore(document.getElementById('text-root'),{start:0,end:5},{focus:true})");s.page.wait_for_timeout(40)
    def range_key():
        range_select();s.page.keyboard.press('Delete');assert s.exists('text-root');assert not s.page.locator('#text-root').inner_text().startswith('Texto')
    s.case('Range: Delete removes selected characters only',range_key)
    def range_button():
        range_select();assert s.page.locator('#ie-delete-element').is_disabled();assert not s.remove();assert s.exists('text-root')
    s.case('Range: trash disabled and controller guarded',range_button)
    def cross_range():
        s.select('text-root');s.js("{const a=document.getElementById('text-root'),b=document.getElementById('text-other'),r=document.createRange();r.setStart(a.firstChild,2);r.setEnd(b.firstChild,5);getSelection().removeAllRanges();getSelection().addRange(r);InlineEditor.controllers.TextRangeController.capture()}");assert not s.remove();assert s.exists('text-root') and s.exists('text-other')
    s.case('Cross-root text range never deletes a block',cross_range)
    def toolbar_field():
        s.select('text-root');s.js("InlineEditor.controllers.SubTabController.setSub('content','typography')");s.page.locator('#ie-font-size').focus();s.page.keyboard.press('Delete');assert s.exists('text-root')
    s.case('Toolbar input: Delete remains field editing',toolbar_field)
    def ime():
        s.select('flow-b');s.focus_blank();s.js("document.body.dispatchEvent(new KeyboardEvent('keydown',{key:'Delete',isComposing:true,bubbles:true,cancelable:true}))");assert s.exists('flow-b');assert s.history()==0
    s.case('IME composition blocks structural shortcuts',ime)
    def input_undo():
        s.select('flow-b');assert s.remove();h=s.history();s.page.locator('#host-input').focus();s.page.keyboard.press('Control+z');assert s.history()==h;assert not s.exists('flow-b')
    s.case('Ctrl+Z in host input does not undo a deletion',input_undo)
    def notes():
        s.add_record('flow-b');s.select('flow-b');assert s.remove();assert s.page.locator('#ie-dialog').is_hidden();assert s.js('CM.all().length')==0
    s.case('Notes removed with target without confirmation',notes)
    def tasks_cancel():
        s.add_record('comment-child','llm_task');s.select('comment-parent');s.begin_delete();assert not s.confirm(False);assert s.exists('comment-parent');assert s.history()==0
    s.case('Open descendant LLM task: cancel is nondestructive',tasks_cancel)
    def tasks_accept():
        s.add_record('comment-child','llm_task');s.select('comment-parent');s.begin_delete();assert s.confirm();assert not s.exists('comment-parent');assert s.js('CM.all().length')==0;assert s.history()==1
    s.case('Open descendant LLM task: explicit confirmation',tasks_accept)
    def comments_undo():
        original=s.add_record('comment-child','llm_task');s.add_record('comment-title');s.select('comment-parent');s.begin_delete();s.confirm();s.undo();assert s.js("CM.parse(document.getElementById('comment-child'))")==[original];assert s.js('CM.all().length')==2
    s.case('Undo restores exact comments, anchors and Range metadata',comments_undo)
    def comments_redo():
        s.add_record('comment-child','llm_task','resolved');s.select('comment-parent');assert s.remove();s.undo();assert s.js('CM.all().length')==1;s.redo();assert s.js('CM.all().length')==0
    s.case('Redo removes restored comments without re-executing tasks',comments_redo)
    def registry():
        s.add_record('flow-b');s.add_record('flow-c');html=s.js('InlineEditor.serialize()');s.new(html=html);assert s.page.locator('#ie-comments-data').count()==1
        s.select('flow-b');assert s.remove();assert len(s.js("JSON.parse(document.getElementById('ie-comments-data').textContent).records"))==1;s.undo();assert len(s.js("JSON.parse(document.getElementById('ie-comments-data').textContent).records"))==2
    s.case('Saved aggregate registry stays aligned after delete and undo',registry)
    def unrelated():
        a=s.add_record('flow-b');c=s.add_record('flow-c');s.select('flow-b');assert s.remove();assert s.js("CM.parse(document.getElementById('flow-c'))")==[c]
    s.case('Unrelated annotations are unchanged',unrelated)
    def stale_confirm():
        s.add_record('flow-b','llm_task');s.select('flow-b');s.begin_delete();s.js("document.getElementById('flow-b').remove()");assert not s.confirm();assert s.history()==0;assert s.exists('flow-c')
    s.case('Stale confirmation cannot delete a different target',stale_confirm)
    def double_request():
        s.add_record('flow-b','llm_task');s.select('flow-b');s.begin_delete();assert not s.remove();assert s.confirm();assert s.history()==1
    s.case('Repeated requests while confirming create one transaction',double_request)
    def identity():
        s.js("window.originalNode=document.getElementById('comment-parent');window.originalChild=document.getElementById('comment-child')");s.select('comment-parent');assert s.remove();s.undo();assert s.js("originalNode===document.getElementById('comment-parent')&&originalChild===document.getElementById('comment-child')")
    s.case('Undo reuses original nodes, not replacement innerHTML',identity)
    def listeners():
        s.select('comment-parent');assert s.remove();s.undo();s.js("document.getElementById('comment-child').dispatchEvent(new Event('host-probe'))");assert s.js('window.hostProbe')==1
    s.case('Undo retains host event listeners',listeners)
    def state_values():
        s.js("{const e=document.getElementById('state-input');e.value='Valor não serializado';e.customState={alive:true}}")
        s.select('comment-parent');assert s.remove();s.undo();assert s.page.locator('#state-input').input_value()=='Valor não serializado';assert s.js("document.getElementById('state-input').customState.alive")
    s.case('Undo retains live input values and element state',state_values)
    def multi_adjacent():
        before=s.order('multi-one');s.select('multi-b','multi-c');assert s.remove();assert s.order('multi-one')==['multi-a','multi-d'];assert s.history()==1;s.undo();assert s.order('multi-one')==before
    s.case('Adjacent multi-delete restores exact sibling order',multi_adjacent)
    def multi_containers():
        before=[s.order('multi-one'),s.order('multi-two')];s.select('multi-b','multi-f');assert s.remove();assert s.history()==1;s.undo();assert [s.order('multi-one'),s.order('multi-two')]==before
    s.case('Multi-delete across parents is atomic',multi_containers)
    def nested():
        s.select('nested-parent');assert s.js("DC.remove({targets:[document.getElementById('nested-parent'),document.getElementById('nested-child')]})");assert s.history()==1;s.undo();assert s.exists('nested-child')
    s.case('Parent + child normalized to one removed subtree',nested)
    def mixed_block():
        s.select('flow-b','app');assert not s.remove();assert s.exists('flow-b') and s.exists('app');assert s.history()==0
    s.case('Mixed protected selection is all-or-nothing',mixed_block)
    def roots():
        for expr in ['document.body','document.documentElement','document.head',"document.querySelector('#ie-toolbar')", "document.querySelector('#ie-selection-overlay')"]:
            assert not s.js('DC.remove({targets:['+expr+']})')
        assert s.history()==0
    s.case('HTML, body, head and runtime components protected',roots)
    def ancestor_protect():
        s.select('protected-parent');assert not s.remove();assert s.exists('protected-item')
    s.case('Ancestor containing protected content is protected',ancestor_protect)
    def root_child():
        s.select('app-child');assert s.remove();assert s.exists('app');s.undo();assert s.exists('app-child')
    s.case('App root protection does not forbid all child editing',root_child)
    def absolute():
        before=[s.box('abs-a'),s.box('abs-c')];style=s.js("document.getElementById('absolute-scene').getAttribute('style')");s.select('abs-b');assert s.remove();s.near(before[0],s.box('abs-a'));s.near(before[1],s.box('abs-c'));assert s.js("document.getElementById('absolute-scene').getAttribute('style')")==style
    s.case('Absolute: siblings and parent CSS unchanged',absolute)
    def fixed():
        r=s.box('demo-main');s.select('fixed-item');assert s.remove();s.near(r,s.box('demo-main'))
    s.case('Fixed deletion does not move the page content',fixed)
    def free():
        s.select('free-b');s.js("InlineEditor.controllers.GeometryController.offset('x',35)");s.select('free-a');before=s.js("document.getElementById('free-b').getAttribute('style')");assert s.remove();assert s.js("document.getElementById('free-b').getAttribute('style')")==before
    s.case('Free authored movement: no sibling coordinate rewrite',free)
    def flex():
        before=s.box('flex-a');attrs=s.js("['flex-a','flex-c','flex-list'].map(id=>document.getElementById(id).getAttribute('style'))");s.select('flex-b');assert s.remove();assert s.box('flex-a')['width']>before['width'];assert s.js("['flex-a','flex-c','flex-list'].map(id=>document.getElementById(id).getAttribute('style'))")==attrs
    s.case('Flex reflows through browser without manual style changes',flex)
    def grid():
        original=s.box('grid-b');s.select('grid-b');assert s.remove();s.near(original,s.box('grid-c'))
    s.case('Grid auto-placement fills the natural slot',grid)
    def explicit():
        original=s.box('explicit-c');s.select('explicit-b');assert s.remove();s.near(original,s.box('explicit-c'));assert s.js("document.getElementById('explicit-c').style.gridArea")=='c'
    s.case('Explicit grid areas are not reassigned',explicit)
    def height():
        h=s.box('fixed-height')['height'];s.select('height-content');assert s.remove();assert s.box('fixed-height')['height']==h;assert s.page.locator('#ie-delete-followup').is_hidden()
    s.case('Original stylesheet height retained without compact suggestion',height)
    def minheight():
        h=s.box('min-height')['height'];s.select('min-content');assert s.remove();assert s.box('min-height')['height']==h;assert s.js("document.getElementById('min-height').style.minHeight")=='170px'
    s.case('Original inline min-height retained',minheight)
    def scrolly():
        h=s.box('scroll-scene')['height'];a=s.box('sticky-asset');s.select('scroll-asset');assert s.remove();assert s.box('scroll-scene')['height']==h;s.near(a,s.box('sticky-asset'));assert s.page.locator('#ie-delete-followup').is_hidden()
    s.case('Scrollytelling scene height and sticky sibling preserved',scrolly)
    def css_immutable():
        before=s.js("document.querySelector('head style:not([data-ie-runtime]):not([data-ie-authored])').textContent");s.select('flow-b');assert s.remove();assert s.js("document.querySelector('head style:not([data-ie-runtime]):not([data-ie-authored])').textContent")==before
    s.case('Delete never rewrites host stylesheet rules',css_immutable)
    def space_case(target,neighbors):
        boxes={id:s.box(id) for id in neighbors};s.select(target);assert s.remove(True),s.page.locator('#ie-toast').text_content();assert not s.exists(target);assert s.page.locator('[data-ie-spacer]').count()==1
        for id,r in boxes.items():s.near(r,s.box(id))
        s.undo();assert s.exists(target);assert s.page.locator('[data-ie-spacer]').count()==0
    for name,target,neighbors in [('flow','flow-b',['flow-a','flow-c']),('flex','flex-b',['flex-a','flex-c']),('grid auto','grid-e',['grid-d','grid-f']),('grid explicit','explicit-b',['explicit-a','explicit-c']),('absolute','abs-b',['abs-a','abs-c']),('fixed','fixed-item',['demo-main'])]:
        s.case('Preserve space: '+name,lambda t=target,ns=neighbors:space_case(t,ns))
    def mobile_space():
        s.new(390,844);space_case('grid-b',['grid-a','grid-c']);space_case('flex-b',['flex-a','flex-c'])
    s.case('Preserve space at mobile viewport',mobile_space)
    def neutral_spacer():
        s.add_record('flow-b');s.select('flow-b');assert s.remove(True)
        n=s.page.locator('[data-ie-spacer]');assert n.get_attribute('id') is None;assert n.get_attribute('aria-hidden')=='true';assert n.inner_text()=='';assert n.locator('[data-ie-comments],input,a,script').count()==0
    s.case('Spacer contains no deleted content, IDs or comments',neutral_spacer)
    def space_save():
        r=s.box('flow-c');s.select('flow-b');assert s.remove(True);html=s.js('InlineEditor.serialize()');(QA/'delete-editable.html').write_text(html);s.new(html=html);assert not s.exists('flow-b');assert s.page.locator('[data-ie-spacer]').count()==1;s.near(r,s.box('flow-c'));assert s.history()==0
    s.case('Spacer persists through editable save and reopen',space_save)
    def space_clean():
        r=s.box('flow-c');s.select('flow-b');assert s.remove(True);html=s.js('InlineEditor.serialize({clean:true})');(QA/'delete-final.html').write_text(html)
        s.page.set_content(html);assert s.page.locator('[data-ie-runtime]').count()==0;assert s.page.locator('[data-ie-spacer]').count()==0;assert s.page.locator('#flow-b').count()==0
        actual=s.page.locator('#flow-c').bounding_box();s.near(r,actual);slot=s.page.locator('#flow-list').locator(':scope > *').nth(1);assert slot.get_attribute('aria-hidden')=='true';assert slot.evaluate('e=>getComputedStyle(e).visibility')=='hidden'
    s.case('Clean Build keeps spatial box but strips editor marker/UI',space_clean)
    def reopen_clean_state():
        s.select('flow-b');assert s.remove();html=s.js('InlineEditor.serialize()');s.new(html=html);assert not s.exists('flow-b');assert s.history()==0;assert s.page.locator('#ie-delete-feedback').is_hidden();assert s.page.locator('#ie-delete-menu').is_hidden();assert not s.js('InlineEditor.diagnostics().dirty')
    s.case('Editable reopen: no detached nodes, old undo or open notices',reopen_clean_state)
    def unsupported(id):
        s.select(id);assert not s.remove(True);assert s.exists(id);assert s.history()==0;assert not s.js('InlineEditor.diagnostics().dirty')
    for id in ['narrow-inline','table-cell','contents-slot','sticky-asset']:
        s.case('Unsupported spacer is refused: '+id,lambda id=id:unsupported(id))
    def anim():
        s.js("document.getElementById('flow-b').animate([{opacity:1},{opacity:.8}],{duration:10000,iterations:Infinity})");unsupported('flow-b')
    s.case('Animated box: preserve space requires pause',anim)
    def mismatch():
        s.js("{const st=document.createElement('style');st.textContent='#grid-list:not(:has(#grid-b)){gap:40px}';document.head.append(st)}");before=s.order('grid-list');s.select('grid-b');assert not s.remove(True);assert s.order('grid-list')==before;assert s.history()==0;assert s.page.locator('[data-ie-spacer]').count()==0;assert not s.js('InlineEditor.diagnostics().dirty')
    s.case('Geometry mismatch rolls back the entire substitution',mismatch)
    def select_spacer():
        s.page.locator('#grid-b').scroll_into_view_if_needed();s.select('grid-b');assert s.remove(True);slot=s.page.locator('[data-ie-spacer]');slot.click(position={'x':20,'y':45});assert s.js("InlineEditor.state.selected?.hasAttribute('data-ie-spacer')");assert s.remove();s.undo();assert s.page.locator('[data-ie-spacer]').count()==1;s.undo();assert s.exists('grid-b')
    s.case('Spacer can be selected/deleted and both actions undone',select_spacer)
    def chronological():
        s.select('flow-b');s.js("HM.mutate('Cor QA',[document.getElementById('flow-b')],()=>document.getElementById('flow-b').style.color='rgb(20, 40, 60)')");assert s.remove();assert s.history()==2;s.undo();assert s.js("document.getElementById('flow-b').style.color")=='rgb(20, 40, 60)';s.undo();assert s.js("document.getElementById('flow-b').style.color")=='';s.redo();s.redo();assert not s.exists('flow-b')
    s.case('Deletion and style edits share chronological undo/redo',chronological)
    def stale_notice():
        s.select('flow-b');assert s.remove();s.select('flow-c');s.js("HM.mutate('Cor seguinte',[document.getElementById('flow-c')],()=>document.getElementById('flow-c').style.color='blue')");s.page.wait_for_timeout(30);assert s.page.locator('#ie-delete-undo').is_disabled();h=s.history();s.js('DC.undoFeedback()');assert s.history()==h;assert not s.exists('flow-b')
    s.case('Notice Undo never skips newer operations',stale_notice)
    def missing_parent():
        s.select('multi-b');assert s.remove();h=s.history();s.js("document.getElementById('multi-one').remove()");s.undo();assert s.history()==h;assert s.js('HM.redoStack.length')==0
    s.case('Missing undo parent is reported without consuming history',missing_parent)
    def compact():
        s.set_height('compact-parent',500);s.select('compact-child');assert s.remove();assert s.page.locator('#ie-delete-followup').is_visible();assert s.page.locator('#ie-delete-followup').inner_text()=='Compactar container';s.page.locator('#ie-delete-followup').click();assert s.box('compact-parent')['height']<10;assert s.history()==3
    s.case('Compact offered only for a known editor-authored height',compact)
    def compact_undo():
        s.set_height('compact-parent',500);s.select('compact-child');assert s.remove();assert s.js("DC.compact(document.getElementById('compact-parent'))");s.undo();assert s.box('compact-parent')['height']==500;assert not s.exists('compact-child');s.undo();assert s.exists('compact-child');assert s.box('compact-parent')['height']==500
    s.case('Compaction and deletion undo independently in order',compact_undo)
    def original_inline():
        s.set_height('compact-original',500);s.select('compact-original-child');assert s.remove();assert not s.js("DC.compact(document.getElementById('compact-original'))");assert s.box('compact-original')['height']==500
    s.case('Compaction does not erase an original explicit height',original_inline)
    def scene_compact():
        s.set_height('scroll-scene',2000);s.select('scroll-asset');assert s.remove();assert not s.js("DC.compact(document.getElementById('scroll-scene'))")
    s.case('No compact suggestion for authored scrollytelling scenes',scene_compact)
    def compact_sibling():
        s.set_height('compact-sibling-parent',500);s.select('compact-sibling-a');assert s.remove();assert s.js("DC.compact(document.getElementById('compact-sibling-parent'))");assert s.box('compact-sibling-parent')['height']==70;assert s.exists('compact-sibling-b')
    s.case('Compaction restores auto height around remaining content',compact_sibling)
    def empty():
        s.select('empty-child');assert s.remove();assert s.page.locator('#ie-delete-followup').inner_text()=='Excluir container vazio';s.page.locator('#ie-delete-followup').click();assert not s.exists('empty-wrapper');assert s.exists('empty-grand') and s.exists('empty-neighbor');assert s.history()==2
    s.case('Empty wrapper removal is explicit, one container only',empty)
    def empty_undo():
        s.select('empty-child');assert s.remove();s.page.locator('#ie-delete-followup').click();s.undo();assert s.exists('empty-wrapper') and not s.exists('empty-child');s.undo();assert s.exists('empty-child')
    s.case('Undo restores empty wrapper, then its deleted child',empty_undo)
    def unsafe_empty(id,child):
        s.select(child);assert s.remove();assert s.page.locator('#ie-delete-followup').is_hidden();assert s.exists(id)
    for kind,id,child in [('script','empty-code','empty-code-child'),('pseudo-element','empty-pseudo','empty-pseudo-child'),('background','empty-decor','empty-decor-child')]:
        s.case('No empty cleanup with '+kind,lambda id=id,child=child:unsafe_empty(id,child))
    def no_session_base():
        s.set_height('compact-parent',500);html=s.js('InlineEditor.serialize()');s.new(html=html);s.select('compact-child');assert s.remove();assert s.page.locator('#ie-delete-followup').is_hidden();assert s.box('compact-parent')['height']==500
    s.case('No compaction inferred after reopening without original baseline',no_session_base)
    def menu_escape():
        s.select('flow-b');s.page.locator('#ie-delete-options').click();assert s.page.locator('#ie-delete-menu').is_visible();assert s.js("document.activeElement.id")=='ie-delete-menu-normal';s.page.keyboard.press('Escape');assert s.page.locator('#ie-delete-menu').is_hidden();assert s.js('InlineEditor.state.selected.id')=='flow-b'
    s.case('Menu Escape restores focus and preserves selection',menu_escape)
    def menu_arrows():
        s.select('flow-b');s.page.locator('#ie-delete-options').click();s.page.keyboard.press('ArrowDown');assert s.js('document.activeElement.id')=='ie-delete-menu-space';s.page.keyboard.press('Home');assert s.js('document.activeElement.id')=='ie-delete-menu-normal';s.page.keyboard.press('End');assert s.js('document.activeElement.id')=='ie-delete-menu-space';s.page.screenshot(path=str(QA/'delete-menu-desktop.png'))
    s.case('Menu keyboard navigation is accessible',menu_arrows)
    def menu_tab():
        s.select('flow-b');s.page.locator('#ie-delete-options').click();s.page.keyboard.press('Tab');assert s.page.locator('#ie-delete-menu').is_hidden();assert s.exists('flow-b')
    s.case('Tab exits delete menu without deleting',menu_tab)
    def outside():
        s.select('flow-b');s.page.locator('#ie-delete-options').click();s.page.locator('#ie-tab-layout').click();assert s.page.locator('#ie-delete-menu').is_hidden()
    s.case('Outside pointer closes delete menu',outside)
    def modal_guard():
        s.select('flow-b');s.page.locator('#ie-help-open').click();s.page.keyboard.press('Delete');assert s.exists('flow-b');assert s.history()==0
    s.case('Help modal captures keys instead of deleting document content',modal_guard)
    def mobile():
        out=[]
        for width,height in [(320,568),(390,844),(844,390)]:
            s.new(width,height);s.page.locator('#flow-b').scroll_into_view_if_needed();s.select('flow-b');r=s.page.locator('#ie-delete-element').bounding_box();assert r
            assert r['x']>=0 and r['y']>=0 and r['x']+r['width']<=width and r['y']+r['height']<=height
            if width<=700:assert r['width']>=44 and r['height']>=44
            hit=s.js('([x,y])=>document.elementFromPoint(x,y)?.closest("button")?.id',[r['x']+r['width']/2,r['y']+r['height']/2]);assert hit=='ie-delete-element',hit
            s.page.screenshot(path=str(QA/f'delete-controls-{width}x{height}.png'));out.append({'viewport':[width,height],'button':r,'hit':hit})
        return {'viewports':out}
    s.case('Controls remain visible and hit-testable on small screens',mobile)
    def mobile_feedback():
        s.new(320,568);s.select('flow-b');assert s.remove();r=s.page.locator('#ie-delete-feedback').bounding_box();assert r['x']>=0 and r['x']+r['width']<=320;assert s.page.locator('#ie-delete-undo').bounding_box()['height']>=44;s.page.screenshot(path=str(QA/'delete-notice-mobile.png'))
    s.case('Mobile feedback fits and offers a touch-sized Undo',mobile_feedback)
    def help_search():
        s.page.locator('#ie-help-open').click();s.page.locator('#ie-help-search').fill('lixeira');s.page.locator('[data-ie-help-topic="layout"]').click();assert 'Excluir elementos' in s.page.locator('#ie-help-article-layout').inner_text();assert 'baseline' in s.page.locator('#ie-help-article-layout').inner_text();s.page.screenshot(path=str(QA/'delete-help-desktop.png'))
    s.case('Local Help search finds delete, space, undo and compaction',help_search)
    def list_space():space_case('list-b',['list-a','list-c']);
    s.case('Spacer respects list-item markup and siblings',list_space)
    def scaled_space():space_case('scaled-block',['scaled-neighbor']);
    s.case('Spacer dimensions handle a scaled parent without double scaling',scaled_space)
    def download():
        s.select('flow-b');assert s.remove();
        with s.page.expect_download() as d:s.page.locator('#ie-save').click()
        d.value.save_as(str(QA/'delete-download-editable.html'));html=(QA/'delete-download-editable.html').read_text();assert 'ie-delete-menu' in html
        s.new(html=html);assert not s.exists('flow-b');assert s.history()==0
    s.case('Actual editable download reopens deleted DOM correctly',download)
    def host_script():
        original=s.js("[...document.scripts].find(x=>!x.hasAttribute('data-ie-runtime')&&!x.hasAttribute('data-ie-authored')).textContent");s.select('flow-b');assert s.remove();html=s.js('InlineEditor.serialize({clean:true})');s.page.set_content(html)
        assert s.js("[...document.scripts].find(x=>!x.hasAttribute('data-ie-runtime')&&!x.hasAttribute('data-ie-authored')).textContent")==original
        s.js("document.getElementById('comment-child').dispatchEvent(new Event('host-probe'))");assert s.js('window.hostProbe')==1
    s.case('Unrelated host script is preserved and still executes after export',host_script)
    def keyboard_undo(key):
        s.select('flow-b');assert s.remove();s.focus_blank();s.page.keyboard.press(key);assert s.exists('flow-b');assert s.js('InlineEditor.state.selected.id')=='flow-b';assert s.history()==0
    s.case('Ctrl+Z restores deleted selection',lambda:keyboard_undo('Control+z'))
    s.case('Cmd+Z event restores deleted selection',lambda:keyboard_undo('Meta+z'))
    def keyboard_redo():
        keyboard_undo('Control+z');s.focus_blank();s.page.keyboard.press('Control+Shift+z');assert not s.exists('flow-b');assert s.history()==1
    s.case('Ctrl+Shift+Z redoes structural deletion',keyboard_redo)
    def multi_space():
        a=s.box('flex-a');c=s.box('flow-c');s.select('flex-b','flow-b');assert s.remove(True);assert s.page.locator('[data-ie-spacer]').count()==2;assert s.history()==1;s.near(a,s.box('flex-a'));s.near(c,s.box('flow-c'));s.undo();assert s.exists('flex-b') and s.exists('flow-b')
    s.case('Multiple spacers are one reversible transaction',multi_space)
    def concise_space():
        s.select('flow-b');assert s.remove(True);style=s.page.locator('[data-ie-spacer]').get_attribute('style');assert len(style)<2200,len(style);return {'style_bytes':len(style.encode())}
    s.case('Spacer carries limited styles, not a full computed-style dump',concise_space)
    def redo_conflict():
        s.select('multi-b');assert s.remove();s.undo();s.js("document.getElementById('multi-two').append(document.getElementById('multi-b'))");s.redo();assert s.exists('multi-b');assert s.js('HM.redoStack.length')==1;assert s.history()==0
    s.case('Conflicting custom redo does not consume its history entry',redo_conflict)
    def llm_save():
        s.add_record('flow-b','llm_task');s.add_record('flow-c');s.select('flow-b');s.begin_delete();s.confirm();html=s.js('InlineEditor.serialize()');s.new(html=html);records=s.js("JSON.parse(document.getElementById('ie-comments-data').textContent).records");assert len(records)==1 and records[0]['type']=='note';assert s.page.locator('[data-ie-comments]').count()==1
    s.case('Deleted LLM tasks cannot leak into a saved aggregate registry',llm_save)
    def compact_original_css():
        before=s.box('fixed-height')['height'];s.set_height('fixed-height',600);s.select('height-content');assert s.remove();assert s.js("DC.compact(document.getElementById('fixed-height'))");assert s.box('fixed-height')['height']==before;assert s.js("document.getElementById('fixed-height').style.height")==''
    s.case('Compaction reveals original stylesheet height, never erases it',compact_original_css)
    def panel_menu():
        s.select('flow-b');s.page.locator('[data-main-tab="more"]').click();s.page.locator('#ie-subtab-element').click();s.page.locator('#ie-delete-from-panel').click();assert s.page.locator('#ie-delete-menu').is_visible();s.page.locator('#ie-delete-menu-normal').click();assert not s.exists('flow-b')
    s.case('Element pane offers the same delete menu',panel_menu)
    def feedback_undo_click():
        s.select('flow-b');assert s.remove();s.page.locator('#ie-delete-undo').click();assert s.exists('flow-b');assert s.page.locator('#ie-delete-feedback').is_hidden()
    s.case('Notice Undo is a working pointer action',feedback_undo_click)
    landing=Path(os.environ.get('IE_LANDING_ORIGINAL',str(ROOT/'tests/fixtures/recovered-landing-host.html')))
    subprocess.run(['node',str(ROOT/'tools/integrate.mjs'),str(landing),str(QA/'landing-delete-editable.html')],check=True)
    landing_html=(QA/'landing-delete-editable.html').read_text()
    def real_landing(width,height):
        s.new(width,height,landing_html);s.page.wait_for_timeout(200);target='.device-tablet';assert s.page.locator(target).count()==1
        s.js("window.landingNode=document.querySelector('.device-tablet');InlineEditor.select(landingNode)");before=s.js('DC.rect(landingNode)');s.page.wait_for_timeout(40);assert s.remove();assert s.page.locator(target).count()==0;s.undo();assert s.js("landingNode===document.querySelector('.device-tablet')");s.near(before,s.js('DC.rect(landingNode)'));s.page.screenshot(path=str(QA/f'landing-delete-undo-{width}.png'));return {'source':landing.name,'viewport':[width,height]}
    s.case('Recovered real landing: delete / undo on desktop',lambda:real_landing(1440,900))
    s.case('Recovered real landing: delete / undo on mobile',lambda:real_landing(390,844))
    def component_input(undo=False):
        s.select('flow-b')
        if undo:assert s.remove()
        s.js("""()=>{const host=document.createElement('div');host.id='component-host';document.body.append(host);const input=document.createElement('input');input.value='ABC';host.attachShadow({mode:'open'}).append(input);input.focus();input.setSelectionRange(0,0)}""")
        s.page.keyboard.press('Control+z' if undo else 'Delete')
        assert s.exists('flow-b') is (not undo);assert s.history()==(1 if undo else 0)
        if not undo:assert s.js("document.getElementById('component-host').shadowRoot.firstChild.value")=='BC'
    s.case('Retargeted Shadow DOM input: Delete never removes page selection',component_input)
    s.case('Component input Ctrl+Z does not consume page deletion history',lambda:component_input(True))
    b.close()
failed=[r for r in RESULTS if r['status']=='FAIL'];print(f'{sum(r["status"]=="PASS" for r in RESULTS)}/{len(RESULTS)} PASS; {len(failed)} FAIL',flush=True)
if failed:raise SystemExit(1)
