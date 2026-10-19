import test from 'node:test';
import assert from 'node:assert/strict';
import {luminance,contrast,glowColor} from '../src/scripts/leaf-contrast.ts';

test('colored ink remains readable across the hue cycle on paper, charcoal and colored labels',()=>{
  const surfaces=[
    [[238,234,225],[32,39,32]],[[24,30,28],[238,234,222]],
    [[238,234,222],[24,30,28]],[[52,65,56],[240,236,223]],
    [[173,80,50],[255,246,232]],[[230,167,125],[24,30,28]],
    [[32,39,32],[238,234,225]]
  ];
  for(const [paper,ink] of surfaces)for(let hue=0;hue<360;hue+=3){
    const bg=luminance(paper),color=glowColor(hue,bg,luminance(ink));
    assert.ok(contrast(luminance(color),bg)>=4.8,`${paper}: ${hue}`);
    // Check gradient interiors too: endpoints alone do not guarantee contrast.
    for(let t=0;t<=1;t+=.1){
      const mixed=ink.map((v,i)=>v+(color[i]-v)*t);
      assert.ok(contrast(luminance(mixed),bg)>=4.5,`${paper}: gradient ${hue}/${t}`);
    }
  }
});
