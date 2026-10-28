"""HTTP smoke tests for the experimental motion runtime.
Run: python tests/test_motion_edition.py --url http://127.0.0.1:4334/
No legacy fixture, root HTML, or generated repository artifacts required.
"""
import argparse
from playwright.sync_api import sync_playwright

parser=argparse.ArgumentParser();parser.add_argument('--url',default='http://127.0.0.1:4334/')
args=parser.parse_args()

def ready(page):
    page.goto(args.url,wait_until='load')
    page.wait_for_function('window.__SL_DEBUG?.ready')
    page.wait_for_timeout(250)

def scene(page,sid,index):
    page.evaluate('([id,i])=>SLMotion.jumpScene(id,i)',[sid,index])
    page.wait_for_function('([id,i])=>__SL_DEBUG.scenes.find(s=>s.id===id).lastIndex===i',arg=[sid,index])
    page.wait_for_timeout(300)

def open_index(page):
    # The preceding upward scroll reveals the mast. Wait for its transition
    # before sampling coordinates; locator auto-scroll can move a sticky mast.
    page.wait_for_function('document.querySelector("#mast").getBoundingClientRect().top>=-1')
    box=page.locator('#open-index').bounding_box()
    page.mouse.click(box['x']+box['width']/2,box['y']+box['height']/2)
    page.wait_for_function('document.querySelector("#index-dialog").open')


def ordered_navigation(page):
    expected=['hero','folha','trabalho','deslocamento-2','processo','laboratorio',
              'deslocamento-1','editor','soberania','espiral','sobre','manifesto',
              'referencias','caderno','possibilidades','contato']
    actual=page.locator('main > section[data-number]').evaluate_all('(els)=>els.map(e=>e.id)')
    assert actual==expected,actual
    index=page.locator('#index-dialog .index-links a')
    assert index.evaluate_all('(links)=>links.map(a=>a.hash.slice(1))')==expected
    assert index.locator('span').all_text_contents()==[f'{i:02}' for i in range(1,17)]
    # Activate the actual index links and check the hash, active chapter and
    # mast counter, including the newly numbered atelier near the footer.
    for number,sid in enumerate(expected,1):
        page.locator('#open-index').focus()
        open_index(page)
        page.locator(f'#index-dialog a[href="#{sid}"]').click()
        page.wait_for_function('(id)=>location.hash==="#"+id&&!document.querySelector("#index-dialog").open&&__SL_DEBUG.activeId===id',arg=sid)
        assert page.locator('#section-counter').text_content()==f'{number:02} / 16'
    page.locator('#open-index').focus()
    open_index(page)
    page.locator('#index-dialog a[href="#hero"]').click()
    page.wait_for_function('__SL_DEBUG.activeId==="hero"')

def leaf_state(page):
    return page.evaluate('''() => {
      const flight=document.querySelector('#leaf-flight'),leaf=document.querySelector('#wind-leaf');
      const rect=leaf.getBoundingClientRect(),style=getComputedStyle(leaf);
      return {hidden:flight.hidden,display:getComputedStyle(document.querySelector('#wind-global')).display,
        visibility:getComputedStyle(flight).visibility,opacity:Number(getComputedStyle(flight).opacity),
        bounds:rect.toJSON(),asset:style.backgroundImage,pointer:style.pointerEvents,
        hit:document.elementFromPoint(rect.x+rect.width/2,rect.y+rect.height/2)?.closest('#wind-global')!==null,
        pseudo:getComputedStyle(flight,'::before').pointerEvents};
    }''')

def visible_leaf(page,w,h,allow_covered=False):
    state=leaf_state(page);rect=state['bounds']
    assert not state['hidden'] and state['display']!='none' and state['visibility']=='visible',state
    if not allow_covered: assert state['opacity']>0,state
    # A rolling blade becomes thin in profile; its long axis must stay visible.
    assert max(rect['width'],rect['height'])>35 and rect['width']*rect['height']>120 and 'leaf-a.webp' in state['asset'],state
    assert rect['left']>=8 and rect['right']<=w-8 and rect['top']>=8 and rect['bottom']<=h-8,state
    return state

def readable_process(page,w,h):
    if w>=760:
        rows=page.locator('#processo .process-panel').evaluate_all('(els)=>els.map(e=>({bottom:e.getBoundingClientRect().bottom,height:e.scrollHeight,client:e.clientHeight}))')
        assert len(rows)==6 and all(r['bottom']<=h-35 and r['height']<=r['client']+2 for r in rows),rows
    else:
        state=page.evaluate('''()=>{const board=document.querySelector('.process-periphery').getBoundingClientRect(),panel=document.querySelector('.process-panel.is-active'),r=panel.getBoundingClientRect();return {intro:document.querySelector('#processo .process-intro').getBoundingClientRect().toJSON(),head:document.querySelector('#processo .scene-head').getBoundingClientRect().toJSON(),board:board.toJSON(),panel:r.toJSON(),font:parseFloat(getComputedStyle(panel.querySelector('.process-body')).fontSize),overflow:panel.scrollHeight>panel.clientHeight+2}}''')
        assert state['font']>=16 and not state['overflow'],state
        # The title and counter now remain above the adaptive board on mobile.
        assert 100<=state['board']['height']<=240 and state['board']['top']>=0,state
        assert state['intro']['top']>=0 and state['intro']['bottom']<=state['head']['top']+2,state
        assert state['head']['bottom']<=state['board']['top']+2,state
        assert state['panel']['top']>=state['board']['bottom'] and state['panel']['bottom']<=h,state

with sync_playwright() as pw:
    browser=pw.chromium.launch()
    for w,h in [(390,844),(1440,900)]:
        context=browser.new_context(viewport={'width':w,'height':h},is_mobile=w<760,has_touch=w<760)
        page=context.new_page();page.route_web_socket('**',lambda websocket: None);errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
        ready(page)
        visible_leaf(page,w,h)
        assert page.evaluate('document.documentElement.scrollWidth<=innerWidth'), 'horizontal page overflow'
        for sid in ['processo','espiral']:
            scene(page,sid,2)
            bounds=page.locator(f'#{sid} .scene-frame').bounding_box()
            if sid!='processo' or w>=760:
                assert bounds['y']>=0 and bounds['y']+bounds['height']<=h+1,(sid,bounds)
            if sid=='processo':
                readable_process(page,w,h)
        page.locator('[data-orbit-node="4"]').click()
        assert page.locator('#orbit-note-title').inner_text()=='Infraestrutura encontra território.'
        page.wait_for_timeout(200);frames=page.evaluate('__SL_DEBUG.metrics.frames');page.wait_for_timeout(400)
        assert page.evaluate('__SL_DEBUG.metrics.frames')==frames,'motion renders at rest'
        scene(page,'trabalho',0)
        page.locator('#trabalho [data-next]').click();page.wait_for_function('__SL_DEBUG.scenes.find(s=>s.id==="trabalho").lastIndex===1')
        page.wait_for_timeout(400)
        page.evaluate('scrollBy({top:-16,behavior:"instant"})');page.wait_for_timeout(280)
        before=page.evaluate('scrollY')
        open_index(page);page.keyboard.press('Escape')
        page.wait_for_function('!document.querySelector("#index-dialog").open')
        assert abs(page.evaluate('scrollY')-before)<3,'modal changes underlying scroll'
        open_index(page);page.locator('#reading-switch').check();page.keyboard.press('Escape')
        page.wait_for_function('!document.querySelector("#index-dialog").open')
        assert not page.evaluate('__SL_DEBUG.enabled')
        assert page.locator('.pin-spacer').count()==0
        assert page.locator('.portfolio-card[inert]').count()==0
        dimensions=page.locator('#processo .sequence').evaluate('(el)=>[el.offsetHeight,el.querySelector(".scene-frame").offsetHeight]')
        assert abs(dimensions[0]-dimensions[1])<2,dimensions
        page.reload(wait_until='load');page.wait_for_function('window.__SL_DEBUG?.ready')
        assert not page.evaluate('__SL_DEBUG.enabled'),'reading preference not persisted'
        page.evaluate('SLMotion.setReading(false)');page.wait_for_function('__SL_DEBUG.enabled')
        page.emulate_media(reduced_motion='reduce');page.wait_for_function('!__SL_DEBUG.enabled')
        open_index(page);page.keyboard.press('Escape');page.wait_for_timeout(150)
        assert not page.evaluate('__SL_DEBUG.enabled'),'closing modal re-enabled reduced motion'
        if w>=760:
            page.emulate_media(reduced_motion='no-preference');page.wait_for_function('__SL_DEBUG.enabled')
            page.set_viewport_size({'width':w,'height':500});page.wait_for_timeout(350)
            assert page.evaluate('__SL_DEBUG.enabled'),'short desktop disabled horizontal scenes'
            assert page.evaluate('__SL_DEBUG.scenes.filter(s=>["trabalho","laboratorio"].includes(s.id)).every(s=>!s.static&&s.end>s.start)')
            assert page.evaluate('__SL_DEBUG.leafEnabled'),'short desktop hid the leaf'
            page.set_viewport_size({'width':w,'height':h});page.wait_for_function('__SL_DEBUG.enabled')
        ordered_navigation(page)
        assert not errors,errors
        print(f'PASS {w}x{h}: ordered index, scenes, nodes, controls, modal, idle, reading, persistence, reduced motion',flush=True)
        context.close()

    # Browser toolbars change available height without changing the user's
    # motion preference. Compact native flow must retain the leaf and glow.
    for w,h,short in [(390,844,690),(360,740,640),(412,915,760),(390,640,740)]:
        context=browser.new_context(viewport={'width':w,'height':h},is_mobile=True,has_touch=True)
        page=context.new_page();ready(page)
        state=visible_leaf(page,w,h)
        assert state['pointer']=='none' and not state['hit'] and state['pseudo']=='none',state
        enabled=page.evaluate('__SL_DEBUG.enabled')
        if enabled: scene(page,'trabalho',1)
        else:
            assert page.evaluate('__SL_DEBUG.leafEnabled'),'compact layout hid the leaf'
            assert not page.locator('[data-edition-reading]').is_disabled()
        frame_position=page.locator('#trabalho .scene-frame').evaluate('el=>getComputedStyle(el).position')
        for new_height in [short,h]:
            page.set_viewport_size({'width':w,'height':new_height});page.wait_for_timeout(450)
            assert page.evaluate('__SL_DEBUG.enabled')==enabled,'toolbar changed the scene layout mode'
            assert page.evaluate('__SL_DEBUG.leafEnabled'),'toolbar disabled the leaf'
            visible_leaf(page,w,new_height,allow_covered=True)
            if enabled:
                assert page.evaluate('__SL_DEBUG.scenes.find(s=>s.id==="trabalho").lastIndex')==1,'toolbar lost gallery position'
                scene(page,'processo',2)
                readable_process(page,w,new_height)
                scene(page,'trabalho',1)
            assert page.locator('#trabalho .scene-frame').evaluate('el=>getComputedStyle(el).position')==frame_position,'toolbar changed the gallery layout'
        page.evaluate('''()=>{const r=document.querySelector('.choices-closing strong').getBoundingClientRect();
          scrollTo({top:scrollY+r.top+r.height/2-innerHeight*.49,behavior:'instant'});}''')
        page.wait_for_function('document.querySelector(".choices-closing [data-leaf-lit]")')
        assert page.locator('.choices-closing [data-leaf-lit] .leaf-ink').first.evaluate('el=>getComputedStyle(el).textShadow')!='none','leaf glow did not render'
        page.locator('#toggle-motion-footer').evaluate('el=>el.click()')
        page.wait_for_function('!__SL_DEBUG.leafEnabled')
        assert leaf_state(page)['hidden'],'reading mode left the leaf visible'
        assert page.locator('[data-leaf-lit]').count()==0,'reading mode left the glow visible'
        page.locator('#toggle-motion-footer').evaluate('el=>el.click()')
        page.wait_for_function('__SL_DEBUG.leafEnabled')
        page.emulate_media(reduced_motion='reduce');page.wait_for_function('!__SL_DEBUG.leafEnabled')
        assert leaf_state(page)['hidden'],'system reduced-motion left the leaf visible'
        page.set_viewport_size({'width':w,'height':short});page.wait_for_timeout(250)
        assert not page.evaluate('__SL_DEBUG.leafEnabled'),'resize overrode reduced-motion'
        print(f'PASS leaf {w}x{h}: rendered bounds, touch pass-through, toolbar resize, glow, reading and reduced motion',flush=True)
        context.close()

    context=browser.new_context(viewport={'width':390,'height':844},is_mobile=True,has_touch=True)
    page=context.new_page();ready(page)
    page.locator('#folha').evaluate('el=>{if(parseFloat(getComputedStyle(el).paddingLeft)<20)throw new Error("Missing editorial gutter")}')
    hero_bottom=page.locator('#hero').evaluate('el=>el.getBoundingClientRect().bottom+scrollY')
    previous=None;positions=[];attitudes=[]
    # Reading runway now slows physical time. Include that extra scroll so
    # the sample still covers a complete glide/gust cycle at the approved pace.
    reading_runway=page.locator('#folha').evaluate('e=>Number(e.dataset.printRun)||0')
    sweep_end=hero_bottom+844*5+reading_runway
    for y in range(0,int(sweep_end),20):
        page.evaluate('(y)=>scrollTo({top:y,behavior:"instant"})',y);page.wait_for_timeout(20)
        point=page.evaluate('({...__SL_DEBUG.leaf})')
        if previous: assert abs(point['x']-previous['x'])<(70 if point.get('galleryEnvelope',0)>.0001 else 30),('leaf path jumps',y,previous,point)
        if y>hero_bottom:
            positions.append(point['x'])
            if point.get('galleryEnvelope',0)<.0001:attitudes.append(point)
        previous=point
    assert max(positions)-min(positions)>150,'leaf remains parked beside the page'
    assert all(abs(point['rotation']-90)<30 for point in attitudes),'free-flight blade stops being horizontal'
    assert max(p['pitch'] for p in attitudes)-min(p['pitch'] for p in attitudes)>25,'torsion remains rigid'
    assert max(p['y'] for p in attitudes)-min(p['y'] for p in attitudes)>35,'glide has no rising turns'
    assert all(.38*844<p['y']<.62*844 for p in attitudes),'leaf leaves the middle of the reading viewport'
    # Both horizontal directions retain visible wind-driven rolls. Interfaces
    # remain reachable under the leaf, rather than making the leaf disappear.
    for sid in ['trabalho','laboratorio']:
        data=page.evaluate('(id)=>__SL_DEBUG.scenes.find(s=>s.id===id)',sid)
        samples=[]
        for fraction in [0,.08,.16,.25,.36,.48,.6,.72,.86,1]:
            page.evaluate('(y)=>scrollTo({top:y,behavior:"instant"})',data['start']+(data['end']-data['start'])*fraction)
            page.wait_for_timeout(45)
            state=leaf_state(page);samples.append(page.evaluate('({...__SL_DEBUG.leaf})'))
            assert state['opacity']>=.4 and not state['hidden'],(sid,fraction,state)
            assert state['pointer']=='none' and not state['hit'],(sid,fraction,state)
        assert max(p['roll'] for p in samples)-min(p['roll'] for p in samples)>250,(sid,samples)
        assert max(p['drift'] for p in samples)-min(p['drift'] for p in samples)>.7,(sid,samples)
        assert max(p['x'] for p in samples)-min(p['x'] for p in samples)>100,(sid,samples)
        for fraction in [.72,.36,.08]:
            page.evaluate('(y)=>scrollTo({top:y,behavior:"instant"})',data['start']+(data['end']-data['start'])*fraction)
            page.wait_for_timeout(60)
            replay=page.evaluate('({...__SL_DEBUG.leaf})')
            prior=samples[[0,.08,.16,.25,.36,.48,.6,.72,.86,1].index(fraction)]
            for key in ['x','y','roll','drift']:
                assert abs(replay[key]-prior[key])<.01,('wind changes on scroll reversal',sid,key,replay,prior)

    for sid in ['processo','espiral','referencias']:
        page.evaluate('(id)=>SLMotion.jumpSection(id)',sid);page.wait_for_timeout(450)
        assert leaf_state(page)['opacity']>=.4,('leaf disappeared in fold',sid)
    print('PASS mobile composition: pendular glide, inertial rolls, both galleries and visibility across interactive folds',flush=True)
    context.close()
    browser.close()
