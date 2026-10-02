from pathlib import Path
import json,time
from playwright.sync_api import sync_playwright
from common import ROOT,HTML,R,launch
results=[];issues=[]
with sync_playwright() as pw:
 b=launch(pw)
 for w,h in [(360,800),(390,844),(412,915),(430,932),(1024,768),(1280,800),(1440,900)]:
  page=b.new_page(viewport={'width':w,'height':h},device_scale_factor=1,is_mobile=w<760,has_touch=w<760)
  errors=[];page.on('pageerror',lambda ex:errors.append(str(ex)))
  page.set_content(HTML);page.wait_for_function('window.__SL_DEBUG?.ready');page.wait_for_timeout(180)
  start=page.evaluate('__SL_DEBUG')
  initialwidth=page.evaluate('document.documentElement.scrollWidth')
  localIssues=[]
  for sid in ['deslocamento-1','deslocamento-2','trabalho','processo','editor','laboratorio','espiral']:
   states=page.evaluate('(id)=>__SL_DEBUG.scenes.find(s=>s.id===id)',sid)
   count=6 if sid=='deslocamento-1' else 5 if sid in ['trabalho','processo','laboratorio'] else 4
   for phase in range(count):
    page.evaluate('([id,n])=>SLMotion.jumpScene(id,n)',[sid,phase]);page.wait_for_timeout(75)
    data=page.evaluate('''(id)=>{
      const section=document.getElementById(id),active=section.querySelector('.portfolio-card:not([inert]),.process-panel:not([inert]),.word-panel:not([inert]),.spiral-caption:not([inert])');
      const sr=section.querySelector('.scene-frame').getBoundingClientRect();
      let violations=[];
      if(active){const ar=active.getBoundingClientRect();
       for(const el of active.querySelectorAll('h3,p,.card-tail')){
        const r=el.getBoundingClientRect();
        if(r.width&&r.height&&(r.left<ar.left-1||r.right>ar.right+1||r.bottom>ar.bottom+1||r.top<ar.top-1))violations.push({text:el.textContent.substring(0,70),rect:r.toJSON(),parent:ar.toJSON()});
        // Text may be wider than its CSS box. Range catches unbreakable headings.
        const range=document.createRange();range.selectNodeContents(el);const rr=range.getBoundingClientRect();
        if(rr.width&&rr.right>ar.right+1)violations.push({text:'text overflow '+el.textContent.substring(0,50),right:rr.right,parentRight:ar.right});
       }
      }
      const card=section.querySelector('.portfolio-card:not([inert])');
      let centre=null;if(card){const cr=card.getBoundingClientRect();centre=(cr.left+cr.right)/2;}
      return {violations,centre,width:document.documentElement.scrollWidth,debug:__SL_DEBUG.scenes.find(s=>s.id===id)};
    }''',sid)
    if data['violations']:localIssues.append({'section':sid,'phase':phase,'violations':data['violations']})
    if data['centre'] is not None and abs(data['centre']-w/2)>2:localIssues.append({'section':sid,'phase':phase,'badcentre':data['centre']})
    if data['width']>w:localIssues.append({'section':sid,'phase':phase,'overflowwidth':data['width']})
  # At rest the RAF must stop.
  page.wait_for_timeout(350);f1=page.evaluate('__SL_DEBUG.metrics.frames');page.wait_for_timeout(350);f2=page.evaluate('__SL_DEBUG.metrics.frames')
  page.evaluate('scrollTo({top:document.documentElement.scrollHeight,behavior:"instant"})');page.wait_for_timeout(180)
  end=page.evaluate('__SL_DEBUG');
  result={'viewport':[w,h],'errors':errors,'globalWidth':initialwidth,'maxScroll':start['maxScroll'],'idleFramesAdded':f2-f1,'landingMode':end['leaf']['mode'],'layoutIssues':localIssues}
  print(w,h,'issues',len(localIssues),'errors',errors,'idle',f2-f1,'landing',end['leaf']['mode'])
  results.append(result);issues.extend([{'width':w,**q} for q in localIssues]);page.close()
 b.close()
(R/'layout-results.json').write_text(json.dumps(results,ensure_ascii=False,indent=2))
(R/'layout-issues.json').write_text(json.dumps(issues,ensure_ascii=False,indent=2))
print('TOTAL',len(issues))
