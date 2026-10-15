"""Additional defensive Box Model checks, separate from 36 scope gates."""
from pathlib import Path
import os, json, traceback
from playwright.sync_api import sync_playwright
R=Path(__file__).resolve().parents[1]
ns={'__file__':str(R/'tests/test_box_model.py')};t=(R/'tests/test_box_model.py').read_text();exec(t[:t.index('with sync_playwright() as pw:')],ns);Suite=ns['Suite']
out=[]
def check(name,fn):
 s.fresh();s.open()
 try:d=fn();assert not s.errors,s.errors;row={'name':name,'status':'PASS','measurements':d}
 except Exception as e:row={'name':name,'status':'FAIL','error':repr(e),'trace':traceback.format_exc()}
 print(row['status'],name,row.get('error',''),flush=True);out.append(row);(R/'qa/box-edges.json').write_text(json.dumps(out,indent=2,ensure_ascii=False))
with sync_playwright() as p:
 b=p.chromium.launch(executable_path=os.environ.get('CHROMIUM_EXECUTABLE','/usr/bin/chromium'),headless=True,args=['--no-sandbox']);s=Suite(b)
 def logical():
  s.sel('#bm-logical');assert s.read('#bm-logical','padding-left')['raw']=='3rem';assert s.read('#bm-logical','padding-right')['raw']=='2rem';assert s.read('#bm-logical','margin-left')['kind']=='auto';return {'logicalRTL':True}
 check('Logical properties / RTL',logical)
 def specificity():
  assert s.read('#bm-specificity','padding-top')['raw']=='25px';assert s.read('#bm-specificity','padding-left')['raw']=='31px'
  s.page.add_style_tag(content='@supports(display:grid){#bm-specificity{padding-top:29px}}');assert s.read('#bm-specificity','padding-top')['raw']=='29px';return {'isWhereAndSupports':True}
 check('Specificity is/where/supports',specificity)
 def shorthand():
  s.page.add_style_tag(content='#bm-px{--sp:1rem 2rem 3rem 4rem;padding:var(--sp)}');s.sel('#bm-px');a=s.read('#bm-px','padding-left');assert a['kind']=='expression' and a['raw']=='var(--sp)',a
  assert s.apply('padding-top',19)['status']=='pending';s.page.locator('#ie-box-accept').click();assert s.raw('#bm-px','padding-top')=='19px';assert s.css('#bm-px','padding-right')=='32px';return {'otherVarSidesUnchanged':True}
 check('var shorthand remains raw',shorthand)
 def inlinevar():
  s.ev('document.querySelector("#bm-px").style.cssText="--sp:1rem 2rem 3rem 4rem;padding:var(--sp);margin:5px"');s.sel('#bm-px');assert s.read('#bm-px','padding-top')['raw']=='var(--sp)';s.apply('padding-top',20);s.page.locator('#ie-box-accept').click();s.page.locator('#ie-box-reset-padding').click();s.page.wait_for_timeout(40)
  if s.page.locator('#ie-dialog').is_visible():s.dialog_confirm()
  assert s.ev('document.querySelector("#bm-px").style.getPropertyValue("padding")')=='var(--sp)';assert s.css('#bm-px','padding-left')=='64px';assert s.css('#bm-px','margin-left')=='5px';return {'inlineShorthandReset':True}
 check('Inline var shorthand reset',inlinevar)
 def fallback():
  s.page.add_style_tag(content='@layer complicated{#bm-px{padding-left:6rem !important}}');s.sel('#bm-px');v=s.read('#bm-px','padding-left');assert v['source']=='computed',v;assert s.page.locator('#ie-padding-left-source').inner_text()=='Calculado';assert s.apply('padding-left',20)['status']=='pending';assert s.hist()==0;return {'complexCascadeExplicitFallback':True}
 check('Unknown layer cascade labeled Calculado',fallback)
 def equalDifferent():
  s.page.add_style_tag(content='#bm-a{padding:16px}#bm-unit-mix{padding:1rem}');s.many(['#bm-a','#bm-unit-mix']);assert s.css('#bm-a','padding-top')==s.css('#bm-unit-mix','padding-top');assert s.page.locator('[data-step-for="ie-padding-top"][data-direction="1"]').is_disabled();return {'equalComputedNotEqualUnits':True}
 check('Equal pixels but different semantics',equalDifferent)
 def rejectedBatch():
  s.many(['#bm-a','#bm-important']);h=s.hist();s.input('padding-top',23);assert s.page.locator('#ie-box-force').is_visible();assert s.raw('#bm-a','padding-top')=='';assert s.css('#bm-important','padding-top')=='16px';assert s.hist()==h
  s.page.locator('#ie-box-cancel').click();assert not s.ev('InlineEditor.diagnostics().dirty');return {'batchRollbackAtomic':True}
 check('Batch conflict rollback',rejectedBatch)
 def negativeAndBlank():
  s.sel('#bm-px');before=s.ev('document.querySelector("#bm-px").getAttribute("style")');s.input('padding-top','');assert s.ev('document.querySelector("#bm-px").getAttribute("style")')==before;assert s.hist()==0
  s.ev('InlineEditor.controllers.BoxModelController.apply("padding-top","auto")');assert s.hist()==0;return {'emptyIsNotZero':True,'paddingAutoRejected':True}
 check('Empty input / invalid AUTO are not applied',negativeAndBlank)
 def mixedGap():
  s.page.add_style_tag(content='#bm-grid{row-gap:1rem;column-gap:14px}');s.sel('#bm-grid');assert s.page.locator('[data-step-for="ie-gap"][data-direction="1"]').is_disabled();assert s.page.locator('#ie-gap-source').inner_text()=='Unidades diferentes';s.page.locator('#ie-gap').fill('20');s.unit('gap','px');s.page.locator('#ie-box-accept').click();assert s.css('#bm-grid','row-gap')=='20px';assert s.css('#bm-grid','column-gap')=='20px';return {'gapMixedNormalization':True}
 check('Gap axes in different units',mixedGap)
 def stale():
  s.sel('#bm-expression');s.unit('padding-bottom','px');assert s.page.locator('#ie-box-pending').is_visible();s.sel('#bm-px');assert not s.page.locator('#ie-box-pending').is_visible();assert s.ev('InlineEditor.controllers.BoxModelController.pending') is None;assert s.raw('#bm-expression','padding-bottom')=='';return {'staleConsentCleared':True}
 check('Pending confirmation cannot leak into next selection',stale)
 def percentVertical():
  s.sel('#bm-percent');parent=s.ev('InlineEditor.controllers.BoxModelController.contentSize(document.querySelector("#bm-fixture"),"width")');s.input('padding-top',12);assert abs(float(s.css('#bm-percent','padding-top')[:-2])-parent*.12)<.1
  s.unit('padding-top','rem');assert abs(float(s.css('#bm-percent','padding-top')[:-2])-parent*.12)<.1;assert s.raw('#bm-percent','padding-top').endswith('rem');return {'percentUsesParentWidth':True,'explicitRemEquivalent':True}
 check('Vertical percentage and rem conversion',percentVertical)
 def transition():
  s.page.add_style_tag(content='#bm-px{transition:padding-top .25s}');s.sel('#bm-px');result=s.apply('padding-top',28);assert result['status']=='applied',result;s.page.wait_for_timeout(360);assert s.css('#bm-px','padding-top')=='28px';assert s.ev('document.querySelector("#bm-px").style.getPropertyPriority("padding-top")')=='';return {'noFalseImportantEscalationDuringTransition':True}
 check('Host transition is not an important conflict',transition)
 def cleanmeta():
  s.sel('#bm-percent');s.input('padding-top',12);clean=s.serialize(True);assert 'data-ie-box-model=' not in clean;assert 'padding-top: 12%' in clean;return {'cleanMetaRemovedRawCSSKept':True}
 check('Clean build removes Box Model bookkeeping only',cleanmeta)
 def defaultGap():
  s.page.add_style_tag(content='#bm-flex{gap:normal}');s.sel('#bm-flex');assert s.read('#bm-flex','row-gap')['raw']=='normal';s.page.locator('#ie-gap').fill('14');s.unit('gap','px');s.page.locator('#ie-box-accept').click();assert s.css('#bm-flex','row-gap')=='14px';return {'normalGapNotInventedPixels':True}
 check('normal gap explicitly replaced',defaultGap)
 def forcedReset():
  s.sel('#bm-important');s.input('padding-top',32);s.page.locator('#ie-box-force').click();s.dialog_confirm();s.page.locator('#ie-box-reset-padding').click();s.page.wait_for_timeout(30);assert s.raw('#bm-important','padding-top')=='';assert s.css('#bm-important','padding-top')=='16px';s.undo();assert s.raw('#bm-important','padding-top')=='32px';assert s.ev('document.querySelector("#bm-important").style.getPropertyPriority("padding-top")')=='important';return {'priorityRestoredOnUndo':True}
 check('Local reset of explicit force',forcedReset)
 s.page.close(run_before_unload=False);b.close()
print('SUMMARY',sum(x['status']=='PASS' for x in out),'/',len(out));raise SystemExit(1 if any(x['status']=='FAIL' for x in out) else 0)
