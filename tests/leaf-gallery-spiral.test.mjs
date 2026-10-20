import test from 'node:test';
import assert from 'node:assert/strict';
import {galleryLeafSpiral} from '../src/scripts/leaf-gallery-spiral.ts';

test('gallery helical flight joins the fall smoothly and retains complete turns',()=>{
 for(const direction of [-1,1])for(const turns of [3,4,5]){
  const before=galleryLeafSpiral(-1,turns,direction),after=galleryLeafSpiral(2,turns,direction);
  assert.ok(Math.abs(before.roll)<1e-9);assert.equal(after.roll,direction*turns*360);
  for(const key of ['x','y','pitch','yaw','bank']){
   assert.ok(Math.abs(before[key])<1e-9&&Math.abs(after[key])<1e-9,key);
   assert.ok(Math.abs(galleryLeafSpiral(.00001,turns,direction)[key])<.00001);
   assert.ok(Math.abs(galleryLeafSpiral(.99999,turns,direction)[key])<.00001);
  }
 }
});

test('spirals reverse deterministically, alternate lateral direction and remain bounded',()=>{
 const snapshots=[];let reversals=0,lastSign=0;
 for(let i=0;i<=1000;i++){
  const p=i/1000,a=galleryLeafSpiral(p,4,1),b=galleryLeafSpiral(p,4,-1);
  snapshots.push(a);
  assert.ok(Object.values(a).every(Number.isFinite));
  assert.ok(Math.abs(a.x)<=1&&Math.abs(a.y)<=1&&a.envelope>=0&&a.envelope<=1);
  assert.equal(a.roll,-b.roll);assert.equal(a.x,-b.x);assert.equal(a.y,b.y);
  const sign=Math.sign(a.x);
  if(i>2&&i<998&&sign&&lastSign&&sign!==lastSign)reversals++;
  if(sign)lastSign=sign;
 }
 assert.ok(reversals>=6,'helix must circle repeatedly');
 for(let i=1000;i>=0;i--)assert.deepEqual(galleryLeafSpiral(i/1000,4,1),snapshots[i]);
});
