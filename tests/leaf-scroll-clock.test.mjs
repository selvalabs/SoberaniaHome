import test from 'node:test';
import assert from 'node:assert/strict';
import {leafScrollClock} from '../src/scripts/leaf-scroll-clock.ts';

test('reveal slows the clock monotonically and returns to the original pace',()=>{
 const spans=[{start:68,end:3300,extra:2520},{start:3300,end:7200,extra:3200}];
 let previous=leafScrollClock(0,spans);
 for(let y=1;y<8000;y++){
  const value=leafScrollClock(y,spans);
  assert.ok(value>previous,'clock reverses or freezes');
  assert.ok(value-previous<=1.000001,'clock accelerates beyond normal pace');
  previous=value;
 }
 assert.equal(leafScrollClock(8000,spans),8000-2520-3200);
 assert.ok(leafScrollClock(1700,spans)-leafScrollClock(1600,spans)<30,'hold is not substantially slower');
 assert.equal(leafScrollClock(8100,spans)-leafScrollClock(8000,spans),100);
});

test('enter, exit and reverse preserve position and velocity without phase resets',()=>{
 const span={start:68,end:3300,extra:2520};
 for(const boundary of [span.start,span.end]){
  const left=(leafScrollClock(boundary,[span])-leafScrollClock(boundary-.01,[span]))/.01;
  const right=(leafScrollClock(boundary+.01,[span])-leafScrollClock(boundary,[span]))/.01;
  assert.ok(Math.abs(left-right)<.00001);
  assert.ok(Math.abs(left-1)<.00001);
 }
 const samples=[0,200,1700,3299,5000];
 assert.deepEqual([...samples].reverse().map(y=>leafScrollClock(y,[span])).reverse(),samples.map(y=>leafScrollClock(y,[span])));
 assert.equal(leafScrollClock(1700,[]),1700);
});
