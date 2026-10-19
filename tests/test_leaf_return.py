"""Real mouse release, re-grab, moving target and reduced-motion lifecycle."""
import argparse
import math
from playwright.sync_api import sync_playwright

parser=argparse.ArgumentParser()
parser.add_argument('--url',default='http://127.0.0.1:4196/')
args=parser.parse_args()

def state(page):
    return page.evaluate('__SL_DEBUG.leaf')

def distance(a,b):
    return math.hypot(a['x']-b['x'],a['y']-b['y'])

def grab(page,dx,dy):
    box=page.locator('#wind-leaf').bounding_box()
    x,y=box['x']+box['width']/2,box['y']+box['height']/2
    before=state(page)
    page.mouse.move(x,y);page.mouse.down();page.wait_for_timeout(35)
    assert state(page)['dragging'],'mouse did not grab leaf'
    assert distance(before,state(page))<3,'grab jumps to cursor'
    page.mouse.move(x+dx,y+dy,steps=15);page.wait_for_timeout(35)
    dropped=state(page);page.mouse.up();page.wait_for_timeout(70)
    assert state(page)['returning']
    assert distance(dropped,state(page))<4,'release snapped'
    return dropped

with sync_playwright() as pw:
    browser=pw.chromium.launch()
    page=browser.new_page(viewport={'width':1440,'height':900})
    errors=[]
    page.on('pageerror',lambda e:errors.append(str(e)))
    page.goto(args.url,wait_until='load')
    page.wait_for_function('window.__SL_DEBUG?.ready')
    page.bring_to_front();page.mouse.move(1400,850)
    page.evaluate('scrollTo({top:500,behavior:"instant"})')
    page.wait_for_function('__SL_DEBUG.scroll===500')
    origin=state(page)
    dropped=grab(page,200,-100)
    page.wait_for_timeout(800)
    assert distance(state(page),origin)>100,'return finishes too quickly'
    assert abs(state(page)['roll']-origin['roll'])>.1,'no torsion during return'
    grab(page,-80,80)  # re-grab from the displayed pose, without a jump
    page.evaluate('scrollBy({top:90,behavior:"instant"})')
    page.wait_for_function('!__SL_DEBUG.leaf.returning',timeout=9000)
    final=state(page)
    page.evaluate('SLMotion.request()');page.wait_for_timeout(40)
    assert distance(final,state(page))<.01,'return did not rejoin scroll trajectory'
    frames=page.evaluate('__SL_DEBUG.metrics.frames');page.wait_for_timeout(350)
    assert frames==page.evaluate('__SL_DEBUG.metrics.frames'),'return left an idle RAF loop'
    grab(page,120,-70)
    page.evaluate('SLMotion.pause()');paused=state(page)
    page.wait_for_timeout(250)
    assert distance(paused,state(page))==0
    page.evaluate('SLMotion.resume()');page.wait_for_timeout(40)
    assert distance(paused,state(page))<8,'resume jumped after pause'
    page.emulate_media(reduced_motion='reduce');page.wait_for_timeout(100)
    assert page.locator('#leaf-flight').is_hidden()
    page.emulate_media(reduced_motion='no-preference');page.wait_for_timeout(150)
    assert not state(page)['returning']
    assert not errors,errors
    browser.close()
print('PASS: slow leaf release, flutter, re-grab, scrolling, idle, pause and reduced motion')
