"""Project cards must finish navigation, render their screens and retain nested previews."""
import argparse
import json
from playwright.sync_api import sync_playwright

parser=argparse.ArgumentParser()
parser.add_argument('--url',default='http://127.0.0.1:4193/')
args=parser.parse_args()


def centered(page,sid,index):
    try:
        page.wait_for_function('''([id,index])=>{
      const scene=__SL_DEBUG.scenes.find(s=>s.id===id);
      const card=document.querySelectorAll(`#${id} .portfolio-card`)[index];
      const r=card.getBoundingClientRect();
      const frame=card.closest('.scene-frame').getBoundingClientRect();
      const destination=scene.start+(scene.end-scene.start)*index/(document.querySelectorAll(`#${id} .portfolio-card`).length-1);
      return Math.abs(scrollY-destination)<2 && frame.top>=-1 && frame.bottom<=innerHeight+1 && scene.lastIndex===index && Math.abs(scene.raw-index)<.01 && Math.abs(r.x+r.width/2-innerWidth/2)<2;
        }''',arg=[sid,index],timeout=8000)
    except Exception:
        print('FAILED CARD',sid,index,json.dumps(page.evaluate('''(id)=>({scroll:scrollY,scene:__SL_DEBUG.scenes.find(s=>s.id===id),viewportScroll:document.querySelector(`#${id} .track-viewport`).scrollLeft,cards:[...document.querySelectorAll(`#${id} .portfolio-card`)].map(e=>e.getBoundingClientRect().toJSON()),focus:document.activeElement.outerHTML.slice(0,200)})''',sid)),flush=True)
        raise


def click_visible(page,button,touch=False):
    # Locator.click auto-scrolls sticky descendants even when already visible,
    # moving the document before dispatch. Exercise the user's actual input.
    box=button.bounding_box()
    assert box and box['x']>=0 and box['y']>=0 and box['x']+box['width']<=page.viewport_size['width']+1 and box['y']+box['height']<=page.viewport_size['height']+1,box
    assert button.evaluate('(el)=>{const r=el.getBoundingClientRect();return el.contains(document.elementFromPoint(r.x+r.width/2,r.y+r.height/2))}'),'button is covered'
    point=(box['x']+box['width']/2,box['y']+box['height']/2)
    if touch: page.touchscreen.tap(*point)
    else: page.mouse.click(*point)


def loaded(page,card):
    card.locator('.work-screen img').first.wait_for(state='visible')
    page.wait_for_function('(el)=>el.complete&&el.naturalWidth>0',arg=card.locator('.work-screen img').first.element_handle())


with sync_playwright() as pw:
    browser=pw.chromium.launch()
    for w,h in [(390,844),(360,740),(390,640),(360,640),(1440,900)]:
        context=browser.new_context(viewport={'width':w,'height':h},is_mobile=w<760,has_touch=w<760)
        page=context.new_page();errors=[]
        page.on('pageerror',lambda error:errors.append(str(error)))
        page.goto(args.url,wait_until='load');page.wait_for_function('window.__SL_DEBUG?.ready')
        for sid,count in [('trabalho',4),('laboratorio',5)]:
            page.evaluate('([id])=>SLMotion.jumpScene(id,0)',[sid]);centered(page,sid,0)
            # A redundant browser resize used to abort the transition halfway.
            page.locator(f'#{sid} [data-next]').click()
            page.wait_for_timeout(60)
            page.evaluate('dispatchEvent(new Event("resize"))')
            centered(page,sid,1)
            if w<760:
                page.locator(f'#{sid} [data-next]').click()
                page.wait_for_timeout(60)
                page.set_viewport_size({'width':w,'height':h-60})
                centered(page,sid,2)
                page.set_viewport_size({'width':w,'height':h});page.wait_for_timeout(250)
                centered(page,sid,2)
            # Visit every card through real controls, in both spatial directions.
            page.evaluate('([id])=>SLMotion.jumpScene(id,0)',[sid]);centered(page,sid,0)
            for index in range(count):
                if index:
                    page.locator(f'#{sid} [data-next]').click();centered(page,sid,index)
                card=page.locator(f'#{sid} .portfolio-card').nth(index)
                if not card.locator('[data-landing-gallery]').count():
                    loaded(page,card)
                    for button in card.locator('.work-page-selector button').all():
                        click_visible(page,button,touch=w<760)
                        try:
                            page.wait_for_function('(el)=>el.getAttribute("aria-pressed")==="true"',arg=button.element_handle(),timeout=8000)
                        except Exception:
                            print('FAILED TAB',w,sid,index,button.inner_text(),json.dumps(card.evaluate('el=>({html:el.outerHTML,rect:el.getBoundingClientRect().toJSON(),scroll:scrollY,debug:__SL_DEBUG.scenes})')),errors,flush=True)
                            raise
                        loaded(page,card)
                    bounds=card.evaluate('el=>({r:el.getBoundingClientRect().toJSON(),scroll:el.scrollHeight,client:el.clientHeight,body:el.querySelector(":scope>.project-explainer").getBoundingClientRect().toJSON(),screen:el.querySelector(".work-screen").getBoundingClientRect().toJSON()})')
                    assert bounds['scroll']<=bounds['client']+2,(sid,index,bounds)
                    assert bounds['body']['bottom']<=bounds['r']['bottom']+1,(sid,index,bounds)
                    assert bounds['screen']['height']>=100,(sid,index,bounds)
                    detail=card.locator('.project-explainer')
                    click_visible(page,detail.locator('summary'),touch=w<760)
                    page.wait_for_timeout(80)
                    assert detail.locator('p').is_visible() and len(detail.locator('p').inner_text())>50
                    body=detail.locator('[data-independent-scroll]')
                    if body.evaluate('e=>e.scrollHeight>e.clientHeight+1'):
                        box=body.bounding_box();outer=page.evaluate('scrollY')
                        page.mouse.move(box['x']+box['width']/2,box['y']+box['height']/2)
                        page.mouse.wheel(0,180);page.wait_for_timeout(80)
                        assert body.evaluate('e=>e.scrollTop')>0,'project detail cannot scroll'
                        assert abs(page.evaluate('scrollY')-outer)<2,'project detail moved the gallery'
                    click_visible(page,detail.locator('summary'),touch=w<760)

                assert card.get_attribute('aria-hidden')=='false'
                assert not card.evaluate('el=>el.inert')
                controls=page.locator(f'#{sid} .scene-controls').bounding_box()
                assert controls['y']>=0 and controls['y']+controls['height']<=h+1,(sid,index,controls)
            for index in range(count-2,-1,-1):
                page.locator(f'#{sid} [data-prev]').click();centered(page,sid,index)
            assert page.locator(f'#{sid} [data-prev]').is_disabled()
            # A completed horizontal drag/swipe must settle on a whole card.
            sign=-1 if sid=='trabalho' else 1
            title=page.locator(f'#{sid} .portfolio-card h3').first.bounding_box()
            x=w*.5 if w<760 else title['x']+title['width']*.8
            y=title['y']+title['height']/2
            if w<760:
                client=context.new_cdp_session(page)
                def swipe(direction):
                    client.send('Input.dispatchTouchEvent',{'type':'touchStart','touchPoints':[{'x':x,'y':y}]})
                    for step in range(1,13):
                        client.send('Input.dispatchTouchEvent',{'type':'touchMove','touchPoints':[{'x':x+direction*160*step/12,'y':y}]})
                        page.wait_for_timeout(20)
                    client.send('Input.dispatchTouchEvent',{'type':'touchEnd','touchPoints':[]})
                swipe(sign);centered(page,sid,1)
                swipe(-sign);centered(page,sid,0)
                client.detach()
            else:
                def drag(direction):
                    page.mouse.move(x,y);page.mouse.down()
                    page.mouse.move(x+direction*380,y,steps=16);page.mouse.up()
                drag(sign);centered(page,sid,1)
                drag(-sign);centered(page,sid,0)
        assert not errors,errors
        print(f'PASS projects {w}x{h}: centered cards, resize during navigation, all screens decoded, all tabs, complete text, controls and real gestures in both directions',flush=True)
        context.close()
    browser.close()
