"""Fixed signature geometry, collision/recovery and reading-mode behavior."""
import argparse
from playwright.sync_api import sync_playwright
parser=argparse.ArgumentParser()
parser.add_argument('--url',default='http://127.0.0.1:4198/')
args=parser.parse_args()
with sync_playwright() as pw:
    browser=pw.chromium.launch()
    for width,height in [(390,844),(1440,900),(844,390)]:
        page=browser.new_page(viewport={'width':width,'height':height})
        errors=[]
        page.on('pageerror',lambda e:errors.append(str(e)))
        page.goto(args.url,wait_until='networkidle')
        page.wait_for_function('window.__SL_DEBUG?.ready')
        mark=page.locator('.brand-signature .eyebrow-tech')
        anchor=mark.bounding_box()
        for section in ['folha','trabalho','laboratorio','soberania','manifesto']:
            page.evaluate('(id)=>document.getElementById(id).scrollIntoView()',section)
            page.wait_for_timeout(300)
            box=mark.bounding_box()
            assert abs(box['x']-anchor['x'])<1 and abs(box['y']-anchor['y'])<1,(section,box,anchor)
        page.evaluate('''()=>{
            const r=document.querySelector('.brand-signature .eyebrow-tech').getBoundingClientRect();
            const probe=document.createElement('button');probe.id='signature-probe';probe.textContent='Conteúdo';
            Object.assign(probe.style,{position:'fixed',left:r.left+'px',top:r.top+'px',width:r.width+'px',height:r.height+'px',zIndex:'68'});
            document.querySelector('main').append(probe);SLMotion.request();
        }''')
        page.wait_for_timeout(300)
        assert mark.get_attribute('data-obstructed')=='true'
        assert float(mark.evaluate('(e)=>getComputedStyle(e).opacity'))<=.13
        assert page.locator('#signature-probe').evaluate('(e)=>{const r=e.getBoundingClientRect();return document.elementFromPoint(r.x+5,r.y+5)===e}'), 'signature blocks clicks'
        page.evaluate("document.getElementById('signature-probe').remove();scrollTo(0,0);SLMotion.request()")
        page.wait_for_timeout(350)
        if height>500:
            assert mark.get_attribute('data-obstructed')=='false'
            assert float(mark.evaluate('(e)=>getComputedStyle(e).opacity'))>.99
        page.emulate_media(reduced_motion='reduce');page.wait_for_timeout(200)
        assert mark.is_visible()
        page.evaluate('SLMotion.setReading(true)');page.wait_for_timeout(250)
        assert mark.is_visible()
        assert page.locator('.brand-signature .eyebrow-lab').count()==0
        assert not errors,errors
        print(f'PASS signature {width}x{height}')
        page.close()
    browser.close()
