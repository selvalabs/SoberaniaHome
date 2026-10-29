/** Lightweight natural-flow narration on the existing scroll clock. */
const clamp=(n:number)=>Math.max(0,Math.min(1,n));
export function createFieldNarration(){
 const fields=Array.from(document.querySelectorAll<HTMLElement>('[data-field-narrative]')).map(section=>({section,lines:Array.from(section.querySelectorAll<HTMLElement>('[data-field-line]')),start:0,span:1}));
 let enabled=false;
 function measure(active:boolean,height:number){enabled=active;for(const field of fields){const rect=field.section.getBoundingClientRect();field.start=rect.top+scrollY-height*.55;field.span=Math.max(height*.8,rect.height);}}
 function render(y:number){for(const field of fields){const p=enabled?clamp((y-field.start)/field.span):1;const index=Math.min(field.lines.length-1,Math.floor(p*field.lines.length));field.section.style.setProperty('--field-progress',String(p));field.section.dataset.fieldPhase=String(index);field.lines.forEach((line,i)=>line.dataset.current=String(!enabled||i===index));}}
 return {measure,render};
}
