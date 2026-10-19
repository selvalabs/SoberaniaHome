import test from 'node:test';
import assert from 'node:assert/strict';
import {createLeafReturn,LEAF_RETURN_SECONDS} from '../src/scripts/leaf-return.ts';

test('release rejoins a moving trajectory slowly, with continuous endpoints and flutter',()=>{
  const from={x:700,y:200,rotation:110,pitch:7,yaw:0,roll:360,scale:.68,pivot:50};
  const target={...from,x:450,y:500,rotation:95};
  const sample=createLeafReturn(from,3,390);
  assert.deepEqual(sample(0,target),from);
  assert.deepEqual(sample(LEAF_RETURN_SECONDS,target),target);
  const early=sample(.1,target);
  assert.ok(Math.hypot(early.x-from.x,early.y-from.y)<2,'release jumped');
  assert.ok(Math.hypot(sample(1,target).x-target.x,sample(1,target).y-target.y)>250,'return too fast');
  let curved=false,rotating=false;
  for(let t=0;t<=LEAF_RETURN_SECONDS;t+=.02){
    const p=sample(t,target),next=sample(t+.001,target);
    assert.ok(Object.values(p).every(Number.isFinite));
    assert.ok(Math.hypot(next.x-p.x,next.y-p.y)<.3,'discontinuous movement');
    curved ||= Math.abs((p.x-from.x)*300+(p.y-from.y)*250)>1000;
    rotating ||= Math.abs(p.roll-from.roll)>5;
  }
  assert.ok(curved&&rotating,'glide needs a curved path and torsion');
  const changed={...target,x:200,y:400,roll:800};
  assert.deepEqual(sample(LEAF_RETURN_SECONDS,changed),changed);
  const end=sample(LEAF_RETURN_SECONDS-.001,changed);
  assert.ok(Math.hypot(end.x-changed.x,end.y-changed.y)<.001,'end snapped');
});
