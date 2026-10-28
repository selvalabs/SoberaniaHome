"""Marquee continuity, complete token glow, contrast and static fallbacks."""
from playwright.sync_api import sync_playwright
import argparse
parser=argparse.ArgumentParser();parser.add_argument('--url',default='http://127.0.0.1:4198/');args=parser.parse_args()
ink_metrics=r'''()=>{
 const ctx=document.createElement('canvas').getContext('2d',{willReadFrequently:true});
 const rgb=color=>{ctx.clearRect(0,0,1,1);ctx.fillStyle=color;ctx.fillRect(0,0,1,1);return [...ctx.getImageData(0,0,1,1).data]};
 const lum=c=>c.slice(0,3).map(x=>{x/=255;return x<=.04045?x/12.92:((x+.055)/1.055)**2.4}).reduce((s,x,i)=>s+x*[.2126,.7152,.0722][i],0);
 return [...document.querySelectorAll('[data-marquee-token]')].map((e,i)=>{
  const r=e.getBoundingClientRect(),s=getComputedStyle(e);let chain=[],bg=[255,255,255];
  for(let p=e;p;p=p.parentElement)chain.unshift(p);
  for(const p of chain){const c=rgb(getComputedStyle(p).backgroundColor),a=c[3]/255;bg=bg.map((v,j)=>c[j]*a+v*(1-a));}
  const a=lum(rgb(s.color)),b=lum(bg);
  return {i,word:e.textContent,visible:r.right>24&&r.left<innerWidth-24,lit:e.dataset.marqueeLit==='true',
   color:s.color,shadow:s.textShadow,fill:s.webkitTextFillColor,gradient:s.backgroundImage,
   contrast:(Math.max(a,b)+.05)/(Math.min(a,b)+.05)};
 });
}'''
with sync_playwright() as pw:
 b=pw.chromium.launch()
 for w,h in [(1440,900),(390,844),(320,568),(844,390)]:
  q=b.new_page(viewport={'width':w,'height':h});errors=[];q.on('pageerror',lambda e:errors.append(str(e)))
  q.goto(args.url,wait_until='networkidle');q.wait_for_function('window.__SL_DEBUG?.ready')
  marquee=q.locator('[data-work-marquee]');marquee.scroll_into_view_if_needed();q.mouse.move(2,2)
  q.wait_for_function('document.querySelector("[data-work-marquee]").dataset.marqueeVisible==="true"')
  track=q.locator('.work-marquee-track');button=q.locator('.work-marquee-toggle')
  assert q.locator('#trabalho h2').count()==1
  assert q.locator('#trabalho h2').inner_text()=='Do conhecimento à construção.'
  groups=q.locator('.work-marquee-group').evaluate_all('(es)=>es.map(e=>e.getBoundingClientRect().width)')
  assert max(groups)-min(groups)<1,groups
  assert sum(groups)>w,groups
  assert q.locator('#trabalho .work-intro').evaluate('(e)=>!!(e.compareDocumentPosition(document.querySelector("#trabalho .portfolio-sequence"))&Node.DOCUMENT_POSITION_FOLLOWING)')
  t=track.evaluate('(e)=>getComputedStyle(e).transform');q.wait_for_timeout(200)
  assert track.evaluate('(e)=>getComputedStyle(e).transform')!=t,'marquee not moving'
  q.locator('.work-marquee-window').hover();q.wait_for_timeout(250)
  assert track.evaluate('(e)=>e.getAnimations()[0].playbackRate')>2
  q.mouse.move(2,2);q.wait_for_timeout(250)
  assert track.evaluate('(e)=>e.getAnimations()[0].playbackRate')==1
  button.click();q.mouse.move(2,2);button.evaluate('(e)=>e.blur()');q.wait_for_timeout(100)
  assert button.get_attribute('aria-pressed')=='true'
  t=track.evaluate('(e)=>getComputedStyle(e).transform');q.wait_for_timeout(180)
  assert track.evaluate('(e)=>getComputedStyle(e).transform')==t
  button.click();q.mouse.move(2,2);button.evaluate('(e)=>e.blur()');q.wait_for_timeout(180)
  assert track.evaluate('(e)=>getComputedStyle(e).animationPlayState')=='running'
  q.screenshot(path=f'.playwright/marquee-{w}.png')
  q.evaluate('SLMotion.jumpScene("trabalho",2)');q.wait_for_timeout(350)
  assert q.evaluate('__SL_DEBUG.scenes.find(s=>s.id==="trabalho").lastIndex')==2
  q.evaluate('SLMotion.setReading(true)');q.wait_for_timeout(300)
  assert track.evaluate('(e)=>getComputedStyle(e).animationName')=='none'
  q.evaluate('SLMotion.setReading(false)');q.emulate_media(reduced_motion='reduce');q.wait_for_timeout(300)
  assert track.evaluate('(e)=>getComputedStyle(e).animationName')=='none'
  assert q.locator('[data-marquee-token]').first.evaluate('(e)=>{const s=getComputedStyle(e);return s.transitionProperty==="none"||s.transitionDuration.split(",").every(t=>parseFloat(t)<=.001)}')
  assert q.evaluate('document.documentElement.scrollWidth<=innerWidth')
  assert q.locator('#trabalho .portfolio-card').count()==4
  assert not errors,errors
  print('PASS marquee',w,h,flush=True);q.close()
 q=b.new_page(java_script_enabled=False,viewport={'width':320,'height':568});q.goto(args.url)
 assert all(e.is_hidden() for e in q.locator('.work-marquee-group[aria-hidden="true"]').all())
 assert q.locator('#trabalho h2').evaluate('(e)=>getComputedStyle(e).whiteSpace')=='normal'
 assert q.evaluate('document.documentElement.scrollWidth<=innerWidth')
 print('PASS marquee no-JS',flush=True);q.close()
 for w,h in [(1440,900),(390,844)]:
  q=b.new_page(viewport={'width':w,'height':h});q.goto(args.url,wait_until='networkidle')
  q.wait_for_function('window.__SL_DEBUG?.ready');q.mouse.move(2,2)
  assert 'tempo disponível' in q.locator('.choices-benefit').inner_text()
  assert q.locator('[data-edition-tab="liberdade"] b').inner_text()=='Portabilidade'
  assert q.locator('[data-marquee-token]').count()==16
  q.locator('[data-work-marquee]').scroll_into_view_if_needed()
  # Place the real leaf's painted center over the strip, without changing its
  # pose or mocking the proximity calculation.
  for _ in range(6):
   q.evaluate('''()=>{const a=document.querySelector('.work-marquee-window').getBoundingClientRect(),l=document.querySelector('#wind-leaf').getBoundingClientRect();scrollBy({top:a.top+a.height/2-l.top-l.height/2,behavior:'instant'});}''')
   q.wait_for_timeout(60)
  track=q.locator('.work-marquee-track');track.evaluate('(e)=>e.getAnimations()[0].pause()')
  for theme in ['dark','light']:
   q.evaluate('(t)=>{if(document.documentElement.dataset.theme!==t)document.querySelector("[data-theme-toggle]").click()}',theme)
   seen_words=set();seen_copies=set()
   for progress in [i/10 for i in range(11)]:
    track.evaluate('(e,p)=>{const a=e.getAnimations()[0];a.currentTime=a.effect.getTiming().duration*p;SLMotion.request()}',progress)
    q.wait_for_timeout(190)
    data=q.evaluate(ink_metrics)
    visible=[t for t in data if t['visible']]
    assert visible and all(t['contrast']>=4.5 for t in visible),(w,theme,data)
    for t in visible:
     if t['lit']:seen_words.add(t['word']);seen_copies.add(t['i']//4)
   assert seen_words=={'Do','conhecimento','à','construção.'},(w,theme,seen_words)
   assert len(seen_copies)>=2,('only original copy glows',w,theme,seen_copies)
   # Move the leaf away: hover must still paint one complete word, including
   # a repeated copy, rather than a band or a single nested character run.
   q.evaluate('scrollBy({top:-240,behavior:"instant"})');q.wait_for_timeout(150)
   track.evaluate('(e)=>e.getAnimations()[0].currentTime=13000')
   q.evaluate('SLMotion.request()');q.wait_for_timeout(190)
   data=q.evaluate(ink_metrics);targets=[t for t in data if t['visible']]
   for target in targets:
    token=q.locator('[data-marquee-token]').nth(target['i']);token.hover();q.wait_for_timeout(220)
    hovered=q.evaluate(ink_metrics)[target['i']]
    assert hovered['shadow']!='none' and hovered['fill']!='rgba(0, 0, 0, 0)' and hovered['gradient']=='none',hovered
    assert hovered['color']!=target['color'],'hover did not color the complete word'
    assert hovered['contrast']>=4.5,(theme,hovered)
    q.mouse.move(2,2);q.wait_for_timeout(220)
    assert q.evaluate(ink_metrics)[target['i']]['shadow']=='none','hover remained after pointer left'
   q.screenshot(path=f'.playwright/marquee-glow-{theme}-{w}.png')
   q.evaluate('scrollBy({top:240,behavior:"instant"})');q.wait_for_timeout(150)
  # CSS keeps moving under a stationary leaf, without waking the page's
  # physics/reveal renderer. Tokens entering/leaving the screen update too.
  track.evaluate('(e)=>{const a=e.getAnimations()[0];a.playbackRate=12;a.play()}')
  q.evaluate('SLMotion.request()');q.wait_for_timeout(80)
  frames=q.evaluate('__SL_DEBUG.metrics.frames');states=[]
  for _ in range(8):
   states.append([(t['i'],t['lit']) for t in q.evaluate(ink_metrics)]);q.wait_for_timeout(90)
  assert len({str(s) for s in states})>1,'moving copies left stale glow under stationary leaf'
  assert q.evaluate('__SL_DEBUG.metrics.frames')==frames,'marquee woke document physics at rest'
  q.evaluate('SLMotion.setReading(true)');q.wait_for_timeout(100)
  assert not any(t['lit'] for t in q.evaluate(ink_metrics))
  q.evaluate('SLMotion.setReading(false);SLMotion.jumpSection("contato")');q.wait_for_timeout(150)
  assert not any(t['lit'] for t in q.evaluate(ink_metrics)),'offscreen glow was not cleared'
  print('PASS marquee glow: all words, repeated copies, whole-token hover, themes and idle',w,h,flush=True);q.close()
 b.close()
