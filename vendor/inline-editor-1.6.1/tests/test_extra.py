from pathlib import Path
import json,traceback,time,os
from playwright.sync_api import sync_playwright
R=Path(__file__).resolve().parents[1];B=(R/'tests/test_template.py').read_text(encoding='utf-8');ns={'__file__':str(R/'tests/test_template.py')};exec(B[:B.index('with sync_playwright() as p:')],ns);Suite=ns['Suite'];out=[]
def check(name,fn):
 try:s.new();d=fn();assert not s.errors,s.errors;out.append({'test':name,'status':'PASS','measurements':d});print('PASS',name,flush=True)
 except Exception as e:out.append({'test':name,'status':'FAIL','error':str(e),'trace':traceback.format_exc()});print('FAIL',name,repr(e),flush=True)
 (R/'qa/extra-results.json').write_text(json.dumps(out,ensure_ascii=False,indent=2))
with sync_playwright() as p:
 try:b=p.chromium.launch(headless=True)
 except:b=p.chromium.launch(executable_path=os.environ.get('CHROMIUM_EXECUTABLE','/usr/bin/chromium'),headless=True,args=['--no-sandbox'])
 s=Suite(b)
 def effects():
  s.open();s.sel('#qa-shadow');s.scroll('#qa-shadow')
  results=s.page.evaluate('''async()=>{const e=document.querySelector('#qa-shadow'),out=[];const wait=()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));const val=()=>{const c=getComputedStyle(e);return JSON.stringify([c.transform,c.filter,c.boxShadow,c.clipPath,c.opacity])};for(const k of ['hover','enter','loop','interaction']){for(const id of [...document.querySelector('#ie-fx-'+k).options].slice(1).map(o=>o.value)){e.setAttribute('data-ie-effects',JSON.stringify({[k]:{id,intensity:75,duration:20,delay:0}}));IEAuthored.refresh();IEAuthored.preview(e,k);const aa=e.getAnimations().filter(a=>a.id.startsWith('ie-'));for(const a of aa){a.pause();a.currentTime=0}await wait();const start=val();for(const a of aa)a.currentTime=a.effect.getTiming().duration*(k==='enter'?.94:.5);await wait();const mid=val();out.push({k,id,changed:start!==mid,animations:aa.length});}}return out}''')
  assert len(results)==48;assert all(r['changed'] for r in results),[r for r in results if not r['changed']];return {'presets_visually_change_computed_styles':48,'detail':results}
 check('48 effects actual computed appearance',effects)
 def shift():
  s.open();s.scroll('#qa-group');s.sel('#qa-a');s.page.evaluate('InlineEditor.state.freeMove=true');s.page.evaluate('InlineEditor.controllers.GeometryController.offset("x",0)');s.tab('layout','position')
  r=s.box('#ie-move-handle');x=r['x']+r['width']/2;y=r['y']+r['height']/2;s.page.mouse.move(x,y);s.page.mouse.down();s.page.keyboard.down('Shift');s.page.mouse.move(x+22,y+3);s.page.keyboard.up('Shift');s.page.mouse.move(x+35,y+88);state=s.page.evaluate('({axis:InlineEditor.state.geometry.axisLock,values:InlineEditor.state.geometry.lastValues})');s.page.mouse.up();assert state['axis']=='x' and state['values']['dy']==0;return state
 check('Shift remains latched after key release',shift)
 def snap():
  s.open();s.scroll('#qa-group');s.sel('#qa-a');s.tab('layout','position');s.page.locator('#ie-free-move').check();a=s.box('#qa-a');bb=s.box('#qa-b');r=s.box('#ie-move-handle');x=r['x']+r['width']/2;y=r['y']+r['height']/2;dx=bb['x']-a['x']-3
  s.page.mouse.move(x,y);s.page.mouse.down();s.page.mouse.move(x+dx,y+1);v=s.page.evaluate('({values:InlineEditor.state.geometry.lastValues,guide:!document.querySelector("#ie-guide-v").hidden})');assert v['guide'];assert abs(v['values']['dx']-(bb['x']-a['x']))<.5
  s.page.keyboard.down('Alt');s.page.mouse.move(x+dx+.5,y+1);no=s.page.evaluate('InlineEditor.state.geometry.lastValues');assert abs(no['dx']-(dx+.5))<.5;s.page.mouse.up();s.page.keyboard.up('Alt');return {'snapped':v,'alt_no_snap':no}
 check('Smart guides sibling and Alt bypass',snap)
 def ratio():
  s.open();s.scroll('#qa-media-scaled');s.sel('#qa-media-scaled');start=s.box('#qa-media-scaled');live,end=s.drag('[data-dir=se]',76,15);assert abs(live[0]['w']/live[0]['h']-start['width']/start['height'])<.001;assert live==end;h=s.hist();s.tab('layout','position');s.page.locator('#ie-free-move').check();start=s.box('#qa-media-scaled');r=s.box('#ie-move-handle');x=r['x']+20;y=r['y']+10;s.page.mouse.move(x,y);s.page.mouse.down();s.page.keyboard.down('Alt');s.page.mouse.move(x+80,y+55);s.page.keyboard.press('Escape');s.page.mouse.up();s.page.keyboard.up('Alt');end=s.box('#qa-media-scaled');assert all(abs(start[k]-end[k])<.1 for k in start);assert h==s.hist();return {'corner_ratio':start['width']/start['height'],'release_jump':0,'cancel_restores_position':True}
 check('Corner aspect and Escape cancels drag',ratio)
 def visualafterfx():
  s.open();s.sel('#qa-shadow');s.tab('effects','loop');s.set('ie-fx-loop','glow');s.page.wait_for_timeout(50);s.tab('visual','filters');s.set('ie-brightness',120);meta=s.page.evaluate('JSON.parse(document.querySelector("#qa-shadow").dataset.ieVisual)');assert meta['baseFilter']=='contrast(1.12)',meta
  s.tab('visual','opacity');s.set('ie-opacity',0);s.page.wait_for_timeout(40);assert float(s.css('#qa-shadow','opacity'))==0;s.tab('effects','loop');s.set('ie-fx-loop','opacity');s.page.wait_for_timeout(100);assert float(s.css('#qa-shadow','opacity'))==0;return {'base_not_contaminated':meta['baseFilter'],'zero_opacity_stays_zero_with_pulse':True}
 check('Visual after effects and opacity zero',visualafterfx)
 def backgrounds():
  s.open();s.sel('#qa-a');s.tab('visual','background');s.set('ie-bg-mode','gradient');s.set('ie-bg-color','#332244');s.set('ie-gradient-color2','#b49abe');s.set('ie-gradient-angle',85);s.page.locator('[data-step-for="ie-gradient-angle"][data-direction="1"]').click();assert float(s.page.locator('#ie-gradient-angle').input_value())==86;s.page.locator('#ie-bg-apply').click();assert '86deg' in s.css('#qa-a','backgroundImage');s.set('ie-bg-overlay',25);s.set('ie-gradient-angle',110);s.page.locator('#ie-bg-apply').click();s.set('ie-bg-overlay',0);bg=s.css('#qa-a','backgroundImage');assert '110deg' in bg and '86deg' not in bg;return {'gradient_stepper':86,'replacement_then_overlay':bg}
 check('Staged stepper and background overlay replacement',backgrounds)
 def alignment():
  s.open();s.sel('#qa-a');s.tab('layout','alignment');assert s.page.locator('#ie-align-bottom').is_enabled();s.page.locator('#ie-align-bottom').click();assert s.css('#qa-a','alignSelf')=='end';s.sel('#qa-text-a');assert s.page.locator('#ie-align-bottom').get_attribute('aria-disabled')=='true' or not s.page.locator('#ie-align-bottom').is_enabled();return {'flex_row_vertical':True,'invalid_context_disabled':True}
 check('Vertical alignment context',alignment)
 def tablehandle():
  s.open();s.scroll('#qa-table');s.sel('#qa-table tr:nth-child(2) td');w=s.box('#qa-table tr:nth-child(2) td:first-child')['width'];r=s.box('#ie-table-col-handle');s.page.mouse.move(r['x']+r['width']/2,r['y']+r['height']/2);s.page.mouse.down();s.page.mouse.move(r['x']+r['width']/2+32,r['y']+r['height']/2,steps=5);live=s.box('#qa-table tr:nth-child(2) td:first-child')['width'];s.page.mouse.up();assert abs(live-s.box('#qa-table tr:nth-child(2) td:first-child')['width'])<.1 and abs(live-(w+32))<1;return {'delta':live-w,'release_jump':0}
 check('Table separator real gesture',tablehandle)
 if s.page:s.page.close(run_before_unload=False)
 b.close()
print('SUMMARY',sum(x['status']=='PASS' for x in out),'/',len(out))
