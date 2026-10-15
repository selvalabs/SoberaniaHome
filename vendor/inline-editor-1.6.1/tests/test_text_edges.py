"""Additional invariants beyond the 43 scope gates. Native browser interaction where possible."""
from pathlib import Path
import json,traceback,os
from playwright.sync_api import sync_playwright
R=Path(__file__).resolve().parents[1]
ns={'__file__':str(R/'tests/test_text_range.py')};source=(R/'tests/test_text_range.py').read_text();exec(source[:source.index('with sync_playwright() as pw:')],ns);Suite=ns['Suite'];results=[]
def case(name,fn):
 s.new();s.open()
 try:
  d=fn() or {};assert not s.errors,s.errors;row={'name':name,'status':'PASS','measurements':d}
 except Exception as e:row={'name':name,'status':'FAIL','error':str(e),'trace':traceback.format_exc(),'pageerrors':s.errors}
 results.append(row);print(row['status'],name,row.get('error','')[:220],flush=True);(R/'qa/text-edges.json').write_text(json.dumps(results,ensure_ascii=False,indent=2))
with sync_playwright() as pw:
 b=pw.chromium.launch(executable_path=os.environ.get('CHROMIUM_EXECUTABLE','/usr/bin/chromium'),headless=True,args=['--no-sandbox']);s=Suite(b)
 def caret():
  s.scroll('#tr-plain');s.page.locator('#tr-plain').click();s.page.wait_for_timeout(30);assert s.ev('InlineEditor.state.textRange.mode')=='caret';s.tab('content','typography');s.set('ie-font-size',25);assert s.css('#tr-plain','fontSize')=='25px';assert s.page.locator('#tr-plain [data-ie-text-run]').count()==0
  return {'caret_formats_block':True}
 case('Caret sem range mantém escopo de bloco',caret)
 def backward():
  s.range('#tr-plain','clara',back=True);s.tab();s.page.locator('#ie-bold').click();assert s.page.locator('#tr-plain [data-ie-text-run]').text_content()=='clara';return {'backward_range':True}
 case('Range reverso',backward)
 def strong_off():
  s.range('#tr-strong','importante');s.tab();s.page.locator('#ie-bold').click();assert s.css('#tr-strong-node [data-ie-text-run]','fontWeight')=='400';assert s.css('#tr-strong-node','fontWeight')=='700';assert s.page.locator('#tr-strong-node').count()==1;s.undo();assert s.page.locator('#tr-strong-node [data-ie-text-run]').count()==0
 case('Remover negrito herdado apenas do trecho',strong_off)
 def underline():
  s.ev("document.querySelector('#tr-plain').innerHTML='Antes <u id=tr-u>palavra marcada</u> depois.'")
  s.range('#tr-plain','marcada');s.tab();s.page.locator('#ie-underline').click();assert s.css('#tr-u [data-ie-text-run]','textDecorationLine')=='none';assert s.css('#tr-u [data-ie-text-run]','display')=='inline-block';s.page.locator('#ie-underline').click();assert s.css('#tr-u [data-ie-text-run]','textDecorationLine')=='underline';assert s.css('#tr-u [data-ie-text-run]','display')=='inline';assert s.page.locator('#tr-u').count()==1
 case('Underline herdado preserva U e isola remoção parcial',underline)
 def align():
  s.range('#tr-plain','clara');s.tab();s.page.locator('[data-text-align=center]').click();assert s.css('#tr-plain','textAlign')=='center';assert s.page.locator('#tr-plain [data-ie-text-run]').count()==0
 case('Alinhamento permanece do bloco com range ativo',align)
 def cross():
  s.sel('#tr-first');s.scroll('#tr-first');s.ev('''()=>{const a=document.querySelector('#tr-first'),b=document.querySelector('#tr-next'),r=document.createRange();a.focus();r.setStart(a.firstChild,2);r.setEnd(b.firstChild,6);getSelection().removeAllRanges();getSelection().addRange(r);document.dispatchEvent(new Event('selectionchange'))}''');s.page.wait_for_timeout(30);assert s.ev('InlineEditor.state.textRange.invalid');h=s.history();s.tab();s.page.locator('#ie-bold').click();assert s.history()==h;assert s.page.locator('#tr-first [data-ie-text-run],#tr-next [data-ie-text-run]').count()==0
 case('Range entre dois roots bloqueia sem formatar o bloco',cross)
 def batch():
  s.range('#tr-plain','clara');s.ev("InlineEditor.selectMany([document.querySelector('#tr-plain'),document.querySelector('#tr-long')])");s.tab('content','typography');assert s.page.locator('#tr-plain[contenteditable],#tr-long[contenteditable]').count()==0;s.set('ie-font-size',24);assert s.css('#tr-plain','fontSize')=='24px' and s.css('#tr-long','fontSize')=='24px';assert s.page.locator('#tr-plain [data-ie-text-run],#tr-long [data-ie-text-run]').count()==0
 case('Multiseleção não reaproveita o range anterior',batch)
 def enter():
  s.scroll('#tr-plain');s.page.locator('#tr-plain').click(position={'x':70,'y':12});s.page.keyboard.press('Enter');s.page.keyboard.insert_text('NOVA');s.page.keyboard.press('Shift+Enter');s.page.keyboard.insert_text('LINHA');assert s.page.locator('#tr-plain div,#tr-plain p').count()==0;before=s.page.locator('#tr-plain').inner_text();html=s.ev('InlineEditor.serialize()');s.new(html);assert s.page.locator('#tr-plain').inner_text()==before
  return {'native_enter_and_shift_enter':'preserved after reopen'}
 case('Enter nativo normalizado para HTML reabrível válido',enter)
 def ime():
  s.scroll('#tr-plain');s.page.locator('#tr-plain').click();h=s.history();s.ev("document.querySelector('#tr-plain').dispatchEvent(new CompositionEvent('compositionstart',{bubbles:true,data:''}))");s.page.keyboard.insert_text('ação');s.page.wait_for_timeout(600);assert s.history()==h;s.ev("document.querySelector('#tr-plain').dispatchEvent(new CompositionEvent('compositionend',{bubbles:true,data:'ação'}))");s.page.wait_for_timeout(600);assert s.history()==h+1;assert 'ação' in s.text('#tr-plain')
  return {'composition_event_simulation':True}
 case('Composição textual não é dividida durante IME',ime)
 def paste():
  s.scroll('#tr-plain');s.page.locator('#tr-plain').click();s.ev('''()=>{const d=new DataTransfer();d.setData('text/plain','<img src=x onerror=alert(1)>');d.setData('text/html','<script>alert(1)</'+'script>');document.querySelector('#tr-plain').dispatchEvent(new ClipboardEvent('paste',{bubbles:true,cancelable:true,clipboardData:d}))}''');assert s.page.locator('#tr-plain img,#tr-plain script').count()==0;assert '<img src=x' in s.text('#tr-plain');s.undo();assert '<img src=x' not in s.text('#tr-plain')
 case('Colagem é texto simples, não injeta markup',paste)
 def repeated():
  s.range('#tr-plain','clara');s.tab();s.ev("()=>{for(let i=0;i<40;i++){InlineEditor.controllers.TextEditor.apply('fontSize',(20+i%3)+'px','Tamanho');InlineEditor.controllers.TextEditor.apply('color',i%2?'#664477':'#775544','Cor')}}")
  assert s.page.locator('#tr-plain [data-ie-text-run]').count()==1;assert s.page.locator('#tr-plain [data-ie-text-run] [data-ie-text-run]').count()==0;assert s.text('#tr-plain')=='Uma rotina clara organiza seu negócio todos os dias.';return {'operations':80,'runs':1}
 case('80 alterações não produzem floresta de spans',repeated)
 def stepper():
  s.range('#tr-plain','clara');s.tab('content','typography');h=s.history();step=s.page.locator('[data-step-for=ie-font-size][data-direction="1"]');r=step.bounding_box();s.page.mouse.move(r['x']+8,r['y']+8);s.page.mouse.down();s.page.wait_for_timeout(660);s.page.mouse.up();s.page.wait_for_timeout(30);assert s.history()==h+1;assert s.css('#tr-plain','fontSize')=='18px';assert s.css('#tr-plain [data-ie-text-run]','fontSize')!='18px';s.undo();assert s.page.locator('#tr-plain [data-ie-text-run]').count()==0
 case('Segurar stepper em trecho é um undo e não muda fora',stepper)
 def color():
  s.range('#tr-plain','clara');s.tab();h=s.history();s.page.locator('#ie-text-color').focus()
  for c in ['#443377','#334455','#112233']:s.set('ie-text-color',c,'input')
  s.set('ie-text-color','#112233');assert s.history()==h+1;s.undo();assert s.page.locator('#tr-plain [data-ie-text-run]').count()==0;s.redo();assert s.css('#tr-plain [data-ie-text-run]','color')=='rgb(17, 34, 51)'
 case('Picker ao vivo desfaz toda a sessão de cores',color)
 def keyboard():
  s.range('#tr-plain','clara');s.page.keyboard.press('Control+b');s.page.keyboard.press('Control+i');assert s.css('#tr-plain [data-ie-text-run]','fontWeight')=='700';assert s.css('#tr-plain [data-ie-text-run]','fontStyle')=='italic';s.page.keyboard.press('Control+z');assert s.css('#tr-plain [data-ie-text-run]','fontStyle')=='normal'
 case('Atalhos B/I e undo usam o histórico autoral',keyboard)
 def skip():
  s.ev("document.querySelector('#tr-next').hidden=true");s.scroll('#tr-first');s.page.locator('#tr-first').click();s.page.keyboard.press('Tab');assert s.ev('InlineEditor.state.selected.id')=='tr-last-near'
 case('Tab ignora conteúdo oculto',skip)
 def emoji():
  s.ev("document.querySelector('#tr-plain').textContent='Visão 🌱 com ação e café.'")
  s.sel('#tr-plain');s.scroll('#tr-plain');s.ev("""()=>{const el=document.querySelector('#tr-plain');el.focus();const r=document.createRange(),i=el.textContent.indexOf('ação');r.setStart(el.firstChild,i);r.setEnd(el.firstChild,i+4);getSelection().removeAllRanges();getSelection().addRange(r);document.dispatchEvent(new Event('selectionchange'))}""");s.tab();s.page.locator('#ie-bold').click();assert s.page.locator('#tr-plain [data-ie-text-run]').text_content()=='ação';assert s.text('#tr-plain')=='Visão 🌱 com ação e café.'
 case('Offsets UTF-16 preservam emoji e acentos',emoji)
 def pointer():
  s.scroll('#tr-plain');s.page.locator('#tr-plain').click();s.scroll('#qa-media-scaled');s.page.locator('#qa-media-scaled').click();assert s.ev('InlineEditor.state.selected.id')=='qa-media-scaled';assert s.ev('InlineEditor.state.textRange.mode')=='block'
 case('Selecionar mídia depois de texto funciona',pointer)
 def rows():
  s.range('#tr-cell-multi',start=1,end=32);s.tab();s.page.locator('#ie-bold').click();html=s.ev('InlineEditor.serialize({clean:true})');s.new(html);assert s.page.locator('#tr-cell-multi p').count()==1 and s.page.locator('#tr-cell-multi div').count()==1;assert s.page.locator('#tr-cell-multi span p,#tr-cell-multi span div').count()==0
 case('Formatação multicamada da célula sobrevive Clean Build',rows)
 def begin_end():
  s.sel('#tr-far');s.scroll('#tr-far');s.page.locator('#tr-far').click();s.page.keyboard.press('Tab');assert s.ev('document.activeElement.id')=='ie-save';h=s.history();s.page.keyboard.press('Tab');assert s.ev("!!document.activeElement.closest('#ie-toolbar')");assert s.history()==h
 case('Tab no limite devolve foco à toolbox sem trap',begin_end)
 def focusfields():
  s.range('#tr-plain','clara');s.tab('content','typography');s.page.locator('#ie-font-size').fill('26');s.page.locator('#ie-font-size').press('Tab');assert s.ev("!!document.activeElement.closest('#ie-toolbar')");assert s.page.locator('#ie-text-scope').get_attribute('data-scope')=='range';s.set('ie-font-family','Georgia');assert s.css('#tr-plain [data-ie-text-run]','fontFamily')=='Georgia'
 case('Foco nos controles mantém bookmark congelado',focusfields)
 if s.page:s.page.close(run_before_unload=False)
 b.close()
print('SUMMARY',sum(x['status']=='PASS' for x in results),'/',len(results),flush=True)
if any(x['status']!='PASS' for x in results):raise SystemExit(1)
