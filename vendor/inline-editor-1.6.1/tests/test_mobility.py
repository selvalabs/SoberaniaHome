from pathlib import Path
from playwright.sync_api import sync_playwright
import os,json,time,statistics
ROOT=Path(__file__).resolve().parents[1]
HTML=Path(os.environ.get('IE_LANDING_EDITABLE', ROOT/'INLINE_EDITOR_TEMPLATE.html')).read_text(encoding='utf-8')
out={}
with sync_playwright() as p:
    try:b=p.chromium.launch(headless=True)
    except:b=p.chromium.launch(executable_path=os.environ.get('CHROMIUM_EXECUTABLE','/usr/bin/chromium'),headless=True,args=['--no-sandbox'])
    page=b.new_page(viewport={'width':1440,'height':900});page.set_content(HTML,wait_until='load');page.wait_for_timeout(450)
    page.locator('#ie-launcher').click()
    target='.device-tablet' if page.locator('.device-tablet').count() else '#qa-media'
    page.evaluate('(s)=>document.querySelector(s).scrollIntoView({block:"center",behavior:"instant"})',target);page.wait_for_timeout(120)
    page.evaluate('(s)=>{InlineEditor.select(document.querySelector(s));const c=document.querySelector("#ie-free-move");c.checked=true;c.dispatchEvent(new Event("change",{bubbles:true}))}',target)
    page.wait_for_timeout(60)
    h=page.locator('#ie-move-handle').bounding_box();assert h
    x=h['x']+h['width']/2;y=h['y']+h['height']/2
    hit=page.evaluate('([x,y])=>document.elementFromPoint(x,y)?.id',[x,y]);assert hit=='ie-move-handle',hit
    out['grab_not_occluded']=True
    # Real drag commits once.
    r0=page.locator(target).bounding_box();hist0=page.evaluate('InlineEditor.diagnostics().history')
    page.mouse.move(x,y);page.mouse.down();page.mouse.move(x+80,y+40,steps=12);page.mouse.up();page.wait_for_timeout(80)
    r1=page.locator(target).bounding_box();hist1=page.evaluate('InlineEditor.diagnostics().history')
    assert hist1==hist0+1,(hist0,hist1);assert abs(r1['x']-r0['x'])>20 or abs(r1['y']-r0['y'])>20
    out['drag_commits_one_history_entry']=True
    # 500 synchronous pointer moves should be coalesced to frame cadence.
    target2='.device-imac' if page.locator('.device-imac').count() else target
    page.evaluate('(s)=>{document.querySelector(s).scrollIntoView({block:"center",behavior:"instant"});InlineEditor.select(document.querySelector(s));window.__ieMoveFrames=0;const G=InlineEditor.controllers.GeometryController;const o=G.move.bind(G);G.move=function(e){window.__ieMoveFrames++;return o(e)}}',target2);page.wait_for_timeout(80)
    h=page.locator('#ie-move-handle').bounding_box();x=h['x']+h['width']/2;y=h['y']+h['height']/2;page.mouse.move(x,y);page.mouse.down();pid=page.evaluate('InlineEditor.state.geometry.id')
    page.evaluate('''({pid,x,y})=>{for(let i=1;i<=500;i++)window.dispatchEvent(new PointerEvent('pointermove',{pointerId:pid,clientX:x+i*.2,clientY:y+i*.1,bubbles:true,cancelable:true}))}''',{'pid':pid,'x':x,'y':y});page.wait_for_timeout(45)
    frames=page.evaluate('window.__ieMoveFrames');assert frames<=4,frames;out['burst_500_pointermoves_processed_frames']=frames;page.mouse.up()
    # Visual drag performance sample.
    page.evaluate('window.__dragTimes=[];{const G=InlineEditor.controllers.GeometryController;const o=G.move.bind(G);G.move=function(e){const t=performance.now();const z=o(e);window.__dragTimes.push(performance.now()-t);return z}}')
    h=page.locator('#ie-move-handle').bounding_box();x=h['x']+h['width']/2;y=h['y']+h['height']/2;page.mouse.move(x,y);page.mouse.down();page.mouse.move(x+240,y+90,steps=60);page.mouse.up();page.wait_for_timeout(50)
    vals=page.evaluate('window.__dragTimes');out['move_handler_ms']={'mean':round(statistics.mean(vals),3),'p95':round(sorted(vals)[max(0,int(.95*len(vals))-1)],3),'max':round(max(vals),3),'samples':len(vals)}
    page.close(run_before_unload=False);b.close()
(ROOT/'qa/evidence/mobility-153.json').parent.mkdir(parents=True,exist_ok=True);(ROOT/'qa/evidence/mobility-153.json').write_text(json.dumps(out,indent=2,ensure_ascii=False),encoding='utf-8')
print(json.dumps(out,indent=2,ensure_ascii=False))
