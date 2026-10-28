import test from 'node:test';
import assert from 'node:assert/strict';
import { inkScenes } from '../src/data/ink-scenes.ts';
import { sampleInkScene, inkSpring, inkFragment, inkNoise, inkRopeImpulse, inkCamera } from '../src/scripts/ink-model.ts';

test('every narrative has contiguous stages and a complete drawing at the end', () => {
  for (const scene of inkScenes) {
    assert.equal(scene.stages[0].start,0);
    assert.equal(scene.stages.at(-1).end,1);
    scene.stages.forEach((stage,i) => {
      assert.ok(stage.end>stage.start);
      if(i)assert.equal(stage.start,scene.stages[i-1].end);
      const middle=sampleInkScene(scene,(stage.start+stage.end)/2);
      assert.equal(middle.stage,i);
      assert.ok(middle.draw.slice(i+1).every(p=>p===0),'future strokes leak into the current stage');
      assert.ok(middle.draw.slice(0,i).every(p=>p===1),'previous drawings must remain');
    });
    assert.ok(sampleInkScene(scene,0).draw.every(p=>p===0));
    assert.ok(sampleInkScene(scene,1).draw.every(p=>p===1));
  }
});

test('wind, springs and particles can seek backwards or directly without a simulation history', () => {
  for (const scene of inkScenes) {
    const reference=Array.from({length:1001},(_,i)=>sampleInkScene(scene,i/1000));
    for(let i=1000;i>=0;i--)assert.deepEqual(sampleInkScene(scene,i/1000),reference[i]);
    for(const fps of [30,60,90,120,144]){
      for(let frame=0;frame<=fps;frame++)sampleInkScene(scene,frame/fps);
      assert.deepEqual(sampleInkScene(scene,.517),reference[517]);
    }
  }
  const before=inkFragment(.47,1914,7);
  inkFragment(.9,1914,7,true);
  assert.deepEqual(inkFragment(.47,1914,7),before);
  assert.notDeepEqual(before,inkFragment(.47,1915,7));
  assert.equal(inkNoise(1914,3),inkNoise(1914,3));
});

test('the spring has continuous takeoff, overshoot and a settled endpoint', () => {
  assert.equal(inkSpring(0),0);
  assert.ok(inkSpring(.000001)<1e-8);
  assert.ok(Math.max(...Array.from({length:200},(_,i)=>inkSpring(i/100)))>1.05);
  assert.ok(Math.abs(inkSpring(4)-1)<1e-6);
  for(const scene of inkScenes){
    const end=sampleInkScene(scene,1);
    assert.ok(Math.abs(end.paper)<1e-8);
    for(let i=1;i<1000;i++){
      const a=sampleInkScene(scene,i/1000),b=sampleInkScene(scene,(i-.001)/1000);
      for(const key of ['hand','lever','paper','wind'])assert.ok(Math.abs(a[key]-b[key])<.05,`${scene.id}:${key} jumps`);
      assert.ok(Object.values(a).filter(v=>typeof v==='number').every(Number.isFinite));
    }
  }
});

test('particle transfers are bounded one-shot events with distinct collective destinations', () => {
  for(const proposal of [false,true])for(let i=0;i<18;i++){
    assert.equal(inkFragment(0,1914,i,proposal).opacity,0);
    assert.ok(inkFragment(1,1914,i,proposal).opacity<1e-20);
    for(let j=0;j<=100;j++){
      const v=inkFragment(j/100,1914,i,proposal);
      assert.ok(v.opacity>=0&&v.opacity<=1);
      assert.ok(v.x>=0&&v.x<=1040&&v.y>=0&&v.y<=680);
    }
  }
  assert.equal(new Set([0,1,2].map(i=>inkFragment(1,1914,i,true).x)).size,3);
});

test('tether waves start and settle at rest with coherent seeded propagation',()=>{
  for(let i=0;i<3;i++){
    assert.ok(Object.values(inkRopeImpulse(0,1967,i)).every(n=>Math.abs(n)<1e-20));
    const end=inkRopeImpulse(1,1967,i);
    assert.ok(Math.abs(end.first)+Math.abs(end.second)<1e-20);
    assert.ok(Math.abs(inkRopeImpulse(.7,1967,i).first)>1);
    assert.deepEqual(inkRopeImpulse(.7,1967,i),inkRopeImpulse(.7,1967,i));
  }
});

test('portrait framing moves continuously between meaningful stage compositions',()=>{
 for(const scene of inkScenes)for(const stage of scene.stages.slice(1)){
  const left=inkCamera(scene,stage.start-.000001),right=inkCamera(scene,stage.start+.000001);
  left.forEach((n,i)=>assert.ok(Math.abs(n-right[i])<.001));
 }
 for(const scene of inkScenes)for(let i=0;i<=100;i++){
  const [x,y,w,h]=inkCamera(scene,i/100);
  assert.ok([x,y,w,h].every(Number.isFinite));
  assert.ok(w>300&&h>200&&x>=0&&y>=0);
 }
});
