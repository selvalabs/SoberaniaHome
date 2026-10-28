import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { sampleGeneratedInk, scheduleGeneratedGuides } from '../src/scripts/generated-ink-model.ts';

for(const name of ['knowledge','handover']) {
  const traces=JSON.parse(readFileSync(new URL(`../src/data/${name}-traces.json`,import.meta.url),'utf8'));
  const schedule=scheduleGeneratedGuides(traces.paths);
  test(`${name}: original art, locally continuous geometry and complete reversible drawing`,()=>{
    const png=readFileSync(new URL(`../public/assets/ink/${name}-generated-v1.png`,import.meta.url));
    assert.equal(createHash('sha256').update(png).digest('hex'),traces.sourceSha256);
    assert.equal(traces.width,1536);assert.equal(traces.height,1024);
    const gaps=traces.paths.map(p=>p.gap).sort((a,b)=>a-b);
    assert.ok(gaps[Math.floor(gaps.length*.9)]<65,'ninety percent of lifts stay in the local neighborhood');
    assert.ok(gaps.filter(g=>g>150).length<20,'large jumps are exceptional');
    for(const path of traces.paths){
      const points=path.d.match(/\d+/g).map(Number);
      for(let i=0;i<points.length;i+=2){assert.ok(points[i]<1536);assert.ok(points[i+1]<1024);}
    }
    let previous=0;
    for(const path of schedule){assert.ok(path.start>=previous);previous=path.end;}
    const mid=sampleGeneratedInk(schedule,.5);
    sampleGeneratedInk(schedule,.95);
    assert.deepEqual(sampleGeneratedInk(schedule,.5),mid);
    assert.equal(sampleGeneratedInk(schedule,1).complete,1);
    assert.equal(sampleGeneratedInk(schedule,1).pencil,false);
  });
}

test('each scene can direct its final light without changing the approved trace timing',()=>{
  const traces=JSON.parse(readFileSync(new URL('../src/data/knowledge-traces.json',import.meta.url),'utf8'));
  const schedule=scheduleGeneratedGuides(traces.paths);
  const lights=[{name:'common-plan',x:800,y:640,rx:230,ry:180,at:.855}];
  assert.deepEqual(sampleGeneratedInk(schedule,.8,lights).keyLights,[0]);
  assert.ok(sampleGeneratedInk(schedule,.94,lights).keyLights[0]>.38);
  assert.equal(sampleGeneratedInk(schedule,1,lights).keyLights[0],.38);
});
