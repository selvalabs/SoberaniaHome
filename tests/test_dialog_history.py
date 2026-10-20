"""Real history traversal must not overwrite a dialog's restored scroll."""
import argparse
from playwright.sync_api import sync_playwright

parser=argparse.ArgumentParser()
parser.add_argument('--url',default='http://127.0.0.1:4195/')
args=parser.parse_args()


def settled(page):
    page.evaluate('()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)))')
    page.wait_for_timeout(80)


def open_index(page):
    # Reveal the hidden mast without introducing a focus-induced page scroll.
    page.locator('#open-index').evaluate('el=>el.focus({preventScroll:true})')
    page.wait_for_function('document.querySelector("#mast").getBoundingClientRect().top>=-1')
    page.keyboard.press('Enter')
    page.wait_for_function('document.querySelector("#index-dialog").open')


def close_dialog(page,selector,method):
    if method=='escape':page.keyboard.press('Escape')
    elif method=='button':page.locator(selector+' [data-close-dialog]').click()
    else:page.go_back()
    page.wait_for_function('(s)=>!document.querySelector(s).open',arg=selector)
    settled(page)


def preserve(page,before,mode='auto'):
    after=page.evaluate('scrollY')
    assert abs(after-before)<3,{'before':before,'after':after,'url':page.url}
    assert page.evaluate('history.scrollRestoration')==mode,{'expected':mode,'actual':page.evaluate('history.scrollRestoration')}
    assert page.evaluate('document.body.style.position')==''


with sync_playwright() as pw:
    browser=pw.chromium.launch()
    for width,height,reading in [(390,844,False),(1440,900,False),(390,844,True),(1440,900,True)]:
        context=browser.new_context(viewport={'width':width,'height':height},is_mobile=width<760,
                                    has_touch=width<760,reduced_motion='reduce' if reading else 'no-preference')
        page=context.new_page();errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
        page.goto(args.url,wait_until='load');page.wait_for_function('window.__SL_DEBUG?.ready')
        # The stale #hero entry is essential to the original regression.
        open_index(page)
        page.locator('#index-dialog a[href="#hero"]').click()
        page.wait_for_timeout(250)
        for sid in ['trabalho','laboratorio']:
            page.evaluate('(id)=>SLMotion.jumpScene(id,1)',sid)
            page.wait_for_timeout(550)
            page.evaluate('scrollBy({top:-16,behavior:"instant"})');settled(page)
            before=page.evaluate('scrollY');assert before>1000
            state=page.evaluate('(id)=>__SL_DEBUG.scenes.find(s=>s.id===id).raw',sid)
            for method in ['escape','button','back']:
                open_index(page)
                close_dialog(page,'#index-dialog',method)
                preserve(page,before)
                assert page.locator('#open-index').evaluate('(el)=>el===document.activeElement')
                after=page.evaluate('(id)=>__SL_DEBUG.scenes.find(s=>s.id===id).raw',sid)
                assert abs(after-state)<.01,(sid,state,after)
            # Forward reopens the history entry; Back returns to the same view.
            page.go_forward();page.wait_for_function('document.querySelector("#index-dialog").open')
            close_dialog(page,'#index-dialog','back')
            preserve(page,before)
        # An explicit destination must win over the old scroll snapshot.
        open_index(page)
        page.locator('#index-dialog a[href="#sobre"]').click()
        page.wait_for_function('__SL_DEBUG.activeId==="sobre"')
        settled(page)
        assert page.url.endswith('#sobre')
        # Original manual mode is restored too.
        page.evaluate('history.scrollRestoration="manual"')
        before=page.evaluate('scrollY');open_index(page)
        close_dialog(page,'#index-dialog','escape');preserve(page,before,'manual')
        page.evaluate('history.scrollRestoration="auto"')
        # Map shares the lock/unlock path but has its own URL and opener.
        page.evaluate('SLMotion.jumpSection("referencias")');page.wait_for_timeout(500)
        page.locator('#open-map').focus();settled(page);before=page.evaluate('scrollY')
        page.keyboard.press('Enter');page.wait_for_function('document.querySelector("#content-dialog").open')
        close_dialog(page,'#content-dialog','escape');preserve(page,before)
        # Reopen in the same popstate turn, before unlock's deferred frame.
        page.evaluate('SLMotion.jumpScene("trabalho",1)');page.wait_for_timeout(500)
        settled(page);before=page.evaluate('scrollY');open_index(page)
        page.evaluate('''() => addEventListener('popstate',()=>{
            if(!document.querySelector('#index-dialog').open)document.querySelector('#open-index').click();
        },{once:true})''')
        page.keyboard.press('Escape');page.wait_for_timeout(180)
        assert page.locator('#index-dialog').evaluate('el=>el.open')
        assert page.evaluate('history.scrollRestoration')=='manual'
        close_dialog(page,'#index-dialog','escape');preserve(page,before)
        assert not errors,errors
        print(f'PASS dialog history {width}x{height} reading={reading}: stale anchor, both galleries, three closes, forward/back, focus, destinations, manual mode, map, immediate reopen',flush=True)
        context.close()

    for fragment,dialog in [('indice','#index-dialog'),('mapa-referencias','#content-dialog')]:
        context=browser.new_context(viewport={'width':390,'height':844},reduced_motion='reduce')
        page=context.new_page();page.goto(args.url+'#'+fragment,wait_until='load')
        page.wait_for_function('(s)=>document.querySelector(s).open',arg=dialog)
        close_dialog(page,dialog,'escape')
        assert page.url.endswith('#hero' if fragment=='indice' else '#referencias')
        assert page.evaluate('document.body.style.position')==''
        print(f'PASS direct #{fragment}: close stays inside the site',flush=True)
        context.close()
    browser.close()
