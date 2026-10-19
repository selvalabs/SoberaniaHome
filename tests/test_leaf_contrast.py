"""Real nested text runs must retain contrast with and without the leaf glow."""
import argparse
from playwright.sync_api import sync_playwright

parser=argparse.ArgumentParser();parser.add_argument('--url',default='http://127.0.0.1:4196/')
args=parser.parse_args()
selectors=['.hero-ink-note','.choices-paper','.choices-ink','.choices-closing strong',
           '.knowledge-copy-technical','.knowledge-cover-closing','.knowledge-note',
           '.technology-note','.technology-closing strong']
measure=r'''selector=>{
 const rgb=s=>(s.match(/[\d.]+/g)||[]).map(Number);
 const lum=c=>c.slice(0,3).map(x=>{x/=255;return x<=.04045?x/12.92:((x+.055)/1.055)**2.4}).reduce((sum,x,i)=>sum+x*[.2126,.7152,.0722][i],0);
 const contrast=(a,b)=>(Math.max(a,b)+.05)/(Math.min(a,b)+.05);
 return [...document.querySelectorAll(selector)].flatMap(mark=>{
  const runs=[...mark.querySelectorAll('.leaf-ink')];if(!runs.length)runs.push(mark);
  return runs.map(ink=>{
   let chain=[],p=ink,bg=[255,255,255];while(p){chain.unshift(p);p=p.parentElement;}
   for(const el of chain){const c=rgb(getComputedStyle(el).backgroundColor),a=c.length===3?1:c[3];if(a)bg=bg.map((v,i)=>c[i]*a+v*(1-a));}
   const s=getComputedStyle(ink),base=rgb(s.color),surface=lum(bg),lit=!!ink.closest('[data-leaf-lit="true"]');
   const glow=rgb(s.getPropertyValue('--leaf-glow-color'));
   const ratios=[contrast(lum(base),surface)];
   if(lit&&glow.length===3)for(let t=0;t<=1;t+=.1)ratios.push(contrast(lum(base.map((v,i)=>v+(glow[i]-v)*t)),surface));
   return {text:ink.textContent,lit,minimum:Math.min(...ratios),gradient:s.backgroundImage};
  });
 });
}'''
with sync_playwright() as pw:
    browser=pw.chromium.launch()
    for width,height in [(390,844),(1440,900)]:
        context=browser.new_context(viewport={'width':width,'height':height},color_scheme='dark')
        page=context.new_page();page.goto(args.url,wait_until='networkidle')
        page.wait_for_function('window.__SL_DEBUG?.ready')
        for theme in ['dark','light','dark']:
            page.evaluate('(theme)=>{if(document.documentElement.dataset.theme!==theme)document.querySelector("[data-theme-toggle]").click()}',theme)
            page.evaluate('SLMotion.setReading(false)')
            lit=0
            for selector in selectors:
                page.locator(selector).first.evaluate('e=>{const r=e.getBoundingClientRect();scrollTo({top:scrollY+r.top+r.height/2-innerHeight*.5,behavior:"instant"})}')
                page.evaluate('()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)))')
                results=page.evaluate(measure,selector)
                assert results and all(r['minimum']>=4.5 for r in results),(theme,selector,results)
                lit+=sum(r['lit'] and 'linear-gradient' in r['gradient'] for r in results)
            assert lit>=4,('glow not exercised',theme,lit)
            page.evaluate('SLMotion.setReading(true)')
            page.wait_for_function('!__SL_DEBUG.leafEnabled')
            for selector in selectors:
                results=page.evaluate(measure,selector)
                assert all(r['minimum']>=4.5 and not r['lit'] for r in results),(theme,selector,results)
            print(f'PASS contrast {width}x{height} {theme}: nested ink, paper labels, annotations, glow gradients and reading mode',flush=True)
        context.close()
    browser.close()
