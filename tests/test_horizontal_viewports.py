"""Horizontal scenes remain usable in short, narrow, landscape and zoomed windows."""
import argparse
from pathlib import Path
from tempfile import gettempdir
from playwright.sync_api import sync_playwright

parser=argparse.ArgumentParser();parser.add_argument('--url',default='http://127.0.0.1:4185/')
args=parser.parse_args()

def jump(page,sid,index):
    page.evaluate('([id,i])=>SLMotion.jumpScene(id,i)',[sid,index])
    try:
        page.wait_for_function('''([id,i])=>{const s=__SL_DEBUG.scenes.find(s=>s.id===id),cards=document.querySelectorAll(`#${id} .portfolio-card`),r=cards[i].getBoundingClientRect(),f=cards[i].closest('.scene-frame').getBoundingClientRect();return !s.static&&s.end>s.start&&Math.abs(s.raw-i)<.01&&Math.abs(r.x+r.width/2-innerWidth/2)<2&&f.top>=-1&&f.bottom<=innerHeight+1}''',arg=[sid,index])
    except Exception:
        print('Gallery jump failure',sid,index,page.evaluate('(id)=>({scene:__SL_DEBUG.scenes.find(s=>s.id===id),y:scrollY,width:innerWidth,height:innerHeight,frame:document.querySelector(`#${id} .scene-frame`).getBoundingClientRect().toJSON(),card:document.querySelector(`#${id} .portfolio-card`).getBoundingClientRect().toJSON()})',sid),flush=True)
        raise
    page.wait_for_timeout(350)

with sync_playwright() as p:
    browser=p.chromium.launch()
    for w,h in [(240,320),(320,480),(360,568),(390,600),(667,375),(844,390),(760,540),(1024,600),(1280,480),(1440,900)]:
        context=browser.new_context(viewport={'width':w,'height':h},is_mobile=False,has_touch=False)
        page=context.new_page();errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
        page.goto(args.url,wait_until='load');page.wait_for_function('window.__SL_DEBUG?.ready');page.wait_for_timeout(300)
        assert page.evaluate('__SL_DEBUG.enabled'),'viewport disabled gallery motion'
        assert page.evaluate('document.documentElement.scrollWidth<=innerWidth'),'document overflows horizontally'
        for sid,sign in [('trabalho',-1),('laboratorio',1)]:
            jump(page,sid,0)
            card=page.locator(f'#{sid} .portfolio-card').first
            before=page.evaluate('scrollY')
            # Wheel over the frame footer always drives horizontal scrub.
            page.mouse.move(w*.45, h-24);page.mouse.wheel(0,140)
            page.wait_for_timeout(200)
            state=page.evaluate('(id)=>__SL_DEBUG.scenes.find(s=>s.id===id)',sid)
            assert 0<state['raw']<1,('vertical scroll did not scrub',w,h,sid,state,page.evaluate('({y:scrollY,dy:__SL_DEBUG.scroll,active:__SL_DEBUG.activeId,hit:document.elementFromPoint(innerWidth*.45,52)?.outerHTML,mast:document.documentElement.dataset.mastHidden})'),before)
            jump(page,sid,0)
            # On short screens all content is reachable by scrolling the card.
            if h<620:
                bounds=card.bounding_box();y=bounds['y']+min(70,bounds['height']/2)
                page.mouse.move(bounds['x']+5,y);outer=page.evaluate('scrollY');page.mouse.wheel(0,120);page.wait_for_timeout(150)
                assert card.evaluate('e=>e.scrollTop')>0,('card cannot scroll',w,h,sid)
                assert abs(page.evaluate('scrollY')-outer)<2,'card reading moved the outer gallery'
                card.evaluate('e=>e.scrollTop=e.scrollHeight');page.wait_for_timeout(40)
                tail=card.locator(':scope > *').last.bounding_box()
                assert bounds['y']<tail['y']+tail['height']<=bounds['y']+bounds['height']+1,('card tail is unreachable',w,h,sid,tail,bounds)
                # At the end of card reading, vertical wheel returns to gallery scrub.
                page.mouse.move(bounds['x']+5,y);page.mouse.wheel(0,100);page.wait_for_timeout(180)
                assert page.evaluate('scrollY')>outer+50,'card traps scrolling at its lower edge'
                jump(page,sid,0)
                # Horizontal wheel still works over a vertically scrolled card.
                page.mouse.move(bounds['x']+5,y);page.mouse.wheel(sign*-180,0);page.wait_for_timeout(100)
                assert page.evaluate('(id)=>__SL_DEBUG.scenes.find(s=>s.id===id).raw',sid)>.1,'horizontal wheel lost inside card'
                card.evaluate('e=>e.scrollTop=0')
            jump(page,sid,1)
            controls=page.locator(f'#{sid} .scene-controls').bounding_box()
            assert controls['y']>=0 and controls['y']+controls['height']<=h+1,(w,h,sid,controls)
            # Both ends return control to the normal vertical document flow.
            page.evaluate('(id)=>{const s=__SL_DEBUG.scenes.find(s=>s.id===id);scrollTo({top:s.end+100,behavior:"instant"})}',sid);page.wait_for_timeout(60)
            assert page.locator(f'#{sid} .scene-frame').bounding_box()['y']<0
            jump(page,sid,0)
            page.evaluate('(id)=>{const s=__SL_DEBUG.scenes.find(s=>s.id===id);scrollTo({top:s.start-100,behavior:"instant"})}',sid);page.wait_for_timeout(60)
            assert page.locator(f'#{sid} .scene-frame').bounding_box()['y']>50
        if (w,h) in [(320,480),(844,390)]:
            page.screenshot(path=str(Path(gettempdir())/f'viewports-{w}-{h}.png'))
        assert not errors,errors
        print(f'PASS viewport {w}x{h}: horizontal scrub, internal reading, controls, both directions and endpoint release',flush=True)
        context.close()
    # Real touch input on short portrait and landscape phones.
    for w,h in [(320,480),(360,568),(844,390)]:
        context=browser.new_context(viewport={'width':w,'height':h},is_mobile=True,has_touch=True)
        page=context.new_page();page.goto(args.url,wait_until='load');page.wait_for_function('window.__SL_DEBUG?.ready')
        client=context.new_cdp_session(page)
        def swipe(x,y,dx,dy):
            client.send('Input.dispatchTouchEvent',{'type':'touchStart','touchPoints':[{'x':x,'y':y}]})
            for i in range(1,13):
                client.send('Input.dispatchTouchEvent',{'type':'touchMove','touchPoints':[{'x':x+dx*i/12,'y':y+dy*i/12}]})
                page.wait_for_timeout(25)
            client.send('Input.dispatchTouchEvent',{'type':'touchEnd','touchPoints':[]})
        for sid,sign in [('trabalho',-1),('laboratorio',1)]:
            jump(page,sid,0)
            swipe(12,h-20,0,-80);page.wait_for_timeout(300)
            assert page.evaluate('(id)=>__SL_DEBUG.scenes.find(s=>s.id===id).raw',sid)>.05,('vertical touch did not scrub',w,h,sid)
            jump(page,sid,0)
            card=page.locator(f'#{sid} .portfolio-card').first;box=card.bounding_box();outer=page.evaluate('scrollY')
            swipe(box['x']+5,box['y']+box['height']-20,0,-80);page.wait_for_timeout(250)
            assert card.evaluate('e=>e.scrollTop')>0,'touch cannot read the card'
            assert abs(page.evaluate('scrollY')-outer)<2,'touch reading moved the outer gallery'
            card.evaluate('e=>e.scrollTop=0')
            top=box['y']+20
            swipe(w/2,top,sign*(160 if w<760 else 320),0)
            page.wait_for_function('(id)=>Math.abs(__SL_DEBUG.scenes.find(s=>s.id===id).raw-1)<.01',arg=sid)
            page.wait_for_timeout(300)
            page.screenshot(path=str(Path(gettempdir())/f'horizontal-touch-{w}-{h}-{sid}.png'))
            swipe(w/2,top,-sign*(160 if w<760 else 320),0)
            page.wait_for_function('(id)=>Math.abs(__SL_DEBUG.scenes.find(s=>s.id===id).raw)<.01',arg=sid)
        client.detach();context.close()
        print(f'PASS touch {w}x{h}: vertical scrub and lateral swipes in both galleries',flush=True)
    # Width/orientation changes preserve the logical gallery position.
    context=browser.new_context(viewport={'width':390,'height':844},is_mobile=True,has_touch=True)
    page=context.new_page();page.goto(args.url,wait_until='load');page.wait_for_function('window.__SL_DEBUG?.ready')
    for sid in ['trabalho','laboratorio']:
        jump(page,sid,2)
        for w,h in [(844,390),(1280,480),(320,480),(390,844)]:
            page.set_viewport_size({'width':w,'height':h});page.wait_for_timeout(400)
            state=page.evaluate('(id)=>__SL_DEBUG.scenes.find(s=>s.id===id)',sid)
            assert abs(state['raw']-2)<.01 and not state['static'],('resize lost gallery position',sid,w,h,state)
    print('PASS orientation/width changes preserve card in both galleries',flush=True)
    context.close();browser.close()

