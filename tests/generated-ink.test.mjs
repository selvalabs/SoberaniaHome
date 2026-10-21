import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { generatedActs, sampleGeneratedInk, scheduleGeneratedGuides } from '../src/scripts/generated-ink-model.ts';

const traces=JSON.parse(readFileSync(new URL('../src/data/workbench-traces.json',import.meta.url),'utf8'));
const schedule=scheduleGeneratedGuides(traces.paths);

test('the contour guides belong to the exact original artwork and stay in its bounds',()=>{
  const original=readFileSync(new URL('../public/assets/ink/workbench-generated-v1.png',import.meta.url));
  assert.equal(createHash('sha256').update(original).digest('hex'),traces.sourceSha256);
  assert.equal(traces.width,1536);assert.equal(traces.height,1024);
  assert.ok(traces.paths.length>100);
  for(const path of traces.paths){
    assert.ok(path.length>0);
    const points=path.d.match(/\d+/g).map(Number);
    for(let i=0;i<points.length;i+=2){
      assert.ok(points[i]>=0&&points[i]<traces.width);
      assert.ok(points[i+1]>=0&&points[i+1]<traces.height);
    }
  }
});

test('the pencil cannot draw a future subject or stay visible after the final picture',()=>{
  for(let i=0;i<schedule.length;i++){
    const path=schedule[i];
    assert.ok(path.end>path.start);
    assert.ok(path.start>=generatedActs[path.phase].start);
    assert.ok(path.end<=generatedActs[path.phase].end);
    if(i)assert.ok(path.start>=schedule[i-1].end);
  }
  const empty=sampleGeneratedInk(schedule,0),finished=sampleGeneratedInk(schedule,1);
  assert.equal(empty.index,0);assert.equal(empty.draw,0);assert.equal(empty.complete,0);assert.equal(empty.pencil,false);
  assert.equal(finished.index,schedule.length);assert.equal(finished.complete,1);assert.equal(finished.pencil,false);
  assert.ok(Math.abs(finished.glow)<1e-12);
});

test('seeking backwards and different frame rates preserve the exact same reveal state',()=>{
  const baseline=Array.from({length:1001},(_,i)=>sampleGeneratedInk(schedule,i/1000));
  for(let i=1000;i>=0;i--)assert.deepEqual(sampleGeneratedInk(schedule,i/1000),baseline[i]);
  for(const fps of [30,60,120]){
    for(let i=0;i<=fps;i++)sampleGeneratedInk(schedule,i/fps);
    assert.deepEqual(sampleGeneratedInk(schedule,.732),baseline[732]);
  }
  for(let i=0;i<1000;i++)assert.ok(baseline[i].complete<=baseline[i+1].complete);
  assert.equal(sampleGeneratedInk(schedule,NaN).progress,0);
});
