from pathlib import Path
import json,os,traceback
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1];HTML=(ROOT/'INLINE_EDITOR_TEMPLATE.html').read_text(encoding='utf-8');OUT=[]
class S:
 def __init__(self,b):self.b=b;self.p=None;self.errors=[]
 def new(self):
  if self.p:self.p.close(run_before_unload=False)
  self.errors=[];self.p=self.b.new_page(viewport={'width':1440,'height':960});self.p.on('pageerror',lambda e:self.errors.append(str(e)));self.p.set_default_timeout(3000);self.p.set_content(HTML,wait_until='load');self.p.wait_for_timeout(120)
 def open(self):self.p.locator('#ie-launcher').click();self.p.evaluate("document.querySelector('#ie-toolbar').style.left='1060px';document.querySelector('#ie-toolbar').style.top='10px'")
 def sel(self,s):self.p.evaluate('(s)=>InlineEditor.select(document.querySelector(s))',s);self.p.wait_for_timeout(30)
 def gate(self,n,name,fn):
  try:self.new();m=fn() or {};assert not self.errors,self.errors;row={'gate':n,'name':name,'status':'PASS','measurements':m};print('PASS',n,name,flush=True)
  except Exception as e:
   row={'gate':n,'name':name,'status':'FAIL','error':str(e),'trace':traceback.format_exc(),'pageerrors':self.errors};print('FAIL',n,name,e,flush=True)
   try:self.p.screenshot(path=str(ROOT/f'qa/comments-fail-{n}.png'))
   except:pass
  OUT.append(row);(ROOT/'qa/comments-duplicate-results.json').write_text(json.dumps(OUT,ensure_ascii=False,indent=2))
with sync_playwright() as pw:
 try:b=pw.chromium.launch(headless=True)
 except:b=pw.chromium.launch(executable_path=os.environ.get('CHROMIUM_EXECUTABLE','/usr/bin/chromium'),headless=True,args=['--no-sandbox'])
 s=S(b)
 def g1():
  assert s.p.evaluate('InlineEditor.version')==json.loads((ROOT/'VERSION.json').read_text())['version'];assert s.p.locator('#ie-duplicate-element').count()==1;assert s.p.locator('#ie-subtab-comments').count()==1;return {'version':json.loads((ROOT/'VERSION.json').read_text())['version']}
 s.gate(1,'Boot / UI',g1)
 def g2():
  s.open();s.sel('#qa-a');s.p.locator('#ie-tab-more').click();s.p.locator('#ie-subtab-element').click();before=s.p.locator('#qa-a').evaluate('e=>e.parentElement.children.length');s.p.locator('#ie-duplicate-element').click();after=s.p.locator('#qa-a').evaluate('e=>e.parentElement.children.length');assert after==before+1;return {'children_before':before,'after':after}
 s.gate(2,'Duplicate inserts sibling',g2)
 def g3():
  s.open();s.sel('#qa-a');s.p.evaluate('InlineEditor.controllers.DuplicateController.duplicate()');cid=s.p.evaluate('InlineEditor.state.selected.id');assert cid!='qa-a';assert s.p.locator('#'+cid).count()==1;assert s.p.locator('#qa-a').count()==1;assert s.p.evaluate('(id)=>document.getElementById(id).className',cid)==s.p.evaluate('document.querySelector("#qa-a").className');return {'copy_id':cid}
 s.gate(3,'Unique root ID / visual attrs preserved',g3)
 def g4():
  s.open();s.sel('#qa-text-group');ids=s.p.evaluate('[...document.querySelectorAll("#qa-text-group [id]")].map(e=>e.id)');s.p.evaluate('InlineEditor.controllers.DuplicateController.duplicate()');copy=s.p.evaluate('InlineEditor.state.selected.id');newids=s.p.evaluate('(id)=>[...document.getElementById(id).querySelectorAll("[id]")].map(e=>e.id)',copy);assert not set(ids)&set(newids);return {'source_ids':ids,'copy_ids':newids}
 s.gate(4,'Nested IDs remapped',g4)
 def g5():
  s.open();s.sel('#qa-a');h=s.p.evaluate('InlineEditor.diagnostics().history');s.p.evaluate('InlineEditor.controllers.DuplicateController.duplicate()');cid=s.p.evaluate('InlineEditor.state.selected.id');assert s.p.locator('#'+cid).count()==1;assert s.p.evaluate('InlineEditor.diagnostics().history')==h+1;s.p.evaluate('InlineEditor.undo()');assert s.p.locator('#'+cid).count()==0;s.p.evaluate('InlineEditor.redo()');assert s.p.locator('#'+cid).count()==1;return {'atomic_history':True}
 s.gate(5,'Duplicate undo / redo',g5)
 def add_comment(kind,text):
  s.p.locator('#ie-tab-more').click();s.p.locator('#ie-subtab-comments').click();s.p.locator('#ie-comment-type').select_option(kind);s.p.locator('#ie-comment-text').fill(text);s.p.locator('#ie-comment-add').click();s.p.wait_for_timeout(50)
 def g6():
  s.open();s.sel('#qa-a');add_comment('note','Contexto apenas. Não alterar automaticamente.');a=json.loads(s.p.get_attribute('#qa-a','data-ie-comments'));assert a[0]['type']=='note' and a[0]['status']=='info';assert s.p.get_attribute('#qa-a','data-ie-comment-anchor');return {'type':a[0]['type'],'anchor':True}
 s.gate(6,'Informational note',g6)
 def g7():
  s.open();s.sel('#qa-a');add_comment('llm_task','Aumentar o contraste deste card.');a=json.loads(s.p.get_attribute('#qa-a','data-ie-comments'));assert a[0]['type']=='llm_task' and a[0]['status']=='open';assert 'AJUSTE LLM' in s.p.locator('#ie-comment-list').inner_text().upper();return {'status':'open'}
 s.gate(7,'LLM adjustment record',g7)
 def g8():
  s.open();s.sel('#qa-text-a');s.p.evaluate("""()=>{const e=document.querySelector('#qa-text-a');const w=document.createTreeWalker(e,NodeFilter.SHOW_TEXT);let n;while(n=w.nextNode()){const i=n.data.indexOf('Texto');if(i>=0){const r=document.createRange();r.setStart(n,i);r.setEnd(n,Math.min(n.length,i+5));const sel=getSelection();sel.removeAllRanges();sel.addRange(r);document.dispatchEvent(new Event('selectionchange'));break}}}""");s.p.wait_for_timeout(80);add_comment('llm_task','Dar destaque visual a este trecho.');a=json.loads(s.p.get_attribute('#qa-text-a','data-ie-comments'));assert a[0].get('range',{}).get('quote');return {'quote':a[0]['range']['quote']}
 s.gate(8,'Text Range stored as comment reference',g8)
 def g9():
  s.open();s.sel('#qa-a');add_comment('llm_task','Trocar a borda.');s.p.locator('#ie-comment-list button',has_text='Resolver').click();a=json.loads(s.p.get_attribute('#qa-a','data-ie-comments'));assert a[0]['status']=='resolved';s.p.locator('#ie-comment-list button',has_text='Reabrir').click();a=json.loads(s.p.get_attribute('#qa-a','data-ie-comments'));assert a[0]['status']=='open';return {'resolve_reopen':True}
 s.gate(9,'Resolve / reopen LLM task',g9)
 def g10():
  s.open();s.sel('#qa-a');add_comment('note','Nota original');s.p.evaluate('InlineEditor.controllers.DuplicateController.duplicate()');copy=s.p.evaluate('InlineEditor.state.selected.id');assert not s.p.get_attribute('#'+copy,'data-ie-comments');assert not s.p.get_attribute('#'+copy,'data-ie-comment-anchor');assert s.p.get_attribute('#qa-a','data-ie-comments');return {'comments_not_copied':True}
 s.gate(10,'Duplicate does not copy comments',g10)
 def g11():
  s.open();s.sel('#qa-a');add_comment('note','Somente referência');add_comment('llm_task','Mudar este card para fundo claro.');html=s.p.evaluate('InlineEditor.serialize()');assert 'id="ie-comments-data"' in html;assert 'INLINE-EDITOR-COMMENT-PROTOCOL' in html;assert 'MUST NOT be treated as modification requests' in html;assert 'llm_task' in html and 'Somente referência' in html;return {'registry':True,'protocol':True}
 s.gate(11,'Saved HTML contains machine-readable LLM protocol',g11)
 def g12():
  s.open();s.sel('#qa-a');add_comment('note','Não deve ir ao deploy');clean=s.p.evaluate('InlineEditor.serialize({clean:true})');assert 'ie-comments-data' not in clean;assert 'data-ie-comments' not in clean;assert 'data-ie-comment-anchor' not in clean;assert 'INLINE-EDITOR-COMMENT-PROTOCOL' not in clean;return {'clean_removed':True}
 s.gate(12,'Clean Build strips comment metadata',g12)
 def g13():
  s.open();s.sel('#qa-a');add_comment('note','Persistência');html=s.p.evaluate('InlineEditor.serialize()');s.p.close(run_before_unload=False);s.p=s.b.new_page(viewport={'width':1440,'height':960});s.p.on('pageerror',lambda e:s.errors.append(str(e)));s.p.set_content(html,wait_until='load');s.p.wait_for_timeout(180);assert s.p.evaluate('InlineEditor.version')==json.loads((ROOT/'VERSION.json').read_text())['version'];assert 'Persistência' in s.p.get_attribute('#qa-a','data-ie-comments');registry=json.loads(s.p.locator('#ie-comments-data').text_content());assert registry['records'][0]['type']=='note';return {'reopen':True}
 s.gate(13,'Save / reopen comments',g13)
 def g14():
  s.open();s.sel('#qa-a');add_comment('note','Não perder no reset');s.p.locator('#ie-tab-visual').click();s.p.locator('#ie-subtab-opacity').click();s.p.evaluate("""()=>{const n=document.querySelector('#ie-opacity');n.value='55';n.dispatchEvent(new Event('change',{bubbles:true}))}""");s.p.wait_for_timeout(30);s.p.locator('#ie-reset-selected').click();s.p.locator('#ie-dialog-confirm').click();s.p.wait_for_timeout(80);assert 'Não perder' in s.p.get_attribute('#qa-a','data-ie-comments');return {'comment_survives_visual_reset':True}
 s.gate(14,'Visual reset preserves authoring comments',g14)
 def g15():
  s.open();s.sel('#qa-a');add_comment('note','Undo me');assert s.p.get_attribute('#qa-a','data-ie-comments');s.p.evaluate('InlineEditor.undo()');assert not s.p.get_attribute('#qa-a','data-ie-comments');s.p.evaluate('InlineEditor.redo()');assert 'Undo me' in s.p.get_attribute('#qa-a','data-ie-comments');return {'undo_redo':True}
 s.gate(15,'Comment undo / redo',g15)
 if s.p:s.p.close(run_before_unload=False)
 b.close()
print('SUMMARY',sum(x['status']=='PASS' for x in OUT),'/',len(OUT))
