import test from 'node:test';
import assert from 'node:assert/strict';
import {createLeafFlight,leafGust} from '../src/scripts/leaf-physics.ts';

test('wind impulse drifts, turns with inertia and settles without rewinding',()=>{
  assert.deepEqual(leafGust(-1),{drift:0,turn:0,spin:0});
  let previous=leafGust(0),peak=0;
  for(let t=.01;t<12;t+=.01){
    const state=leafGust(t),reverse=leafGust(t,-1);
    assert.ok(state.turn>=previous.turn&&state.turn<=360);
    assert.ok(Math.abs(state.turn-previous.turn)<6,'angular impulse jumps');
    for(const key of ['drift','turn','spin'])assert.equal(state[key],-reverse[key]);
    peak=Math.max(peak,state.drift);previous=state;
  }
  assert.ok(peak>.99&&peak<=1.001);
  assert.ok(previous.drift<.00001&&previous.spin<.00001&&previous.turn>359.99);
  assert.ok(leafGust(.02).spin<leafGust(.5).spin,'rotation must accelerate from rest');
});

test('flutter is reversible and independent of scroll sampling order',()=>{
  const sequential=createLeafFlight(),jumped=createLeafFlight();
  for(let t=0;t<35;t+=.017)sequential(t);
  jumped(90);
  for(const t of [0,2.31,11.77,3.5,35,7])assert.deepEqual(sequential(t),jumped(t));
});

test('flutter converges with finer integration and remains bounded over long pages',()=>{
  const sample=createLeafFlight(),fine=createLeafFlight(1/240);
  let reversals=0,previous=sample(0),maxAngle=0,minSpeed=Infinity,maxSpeed=0;
  for(let t=.1;t<=180;t+=.1){
    const current=sample(t);
    assert.ok(Object.values(current).every(Number.isFinite));
    assert.ok(current.fallSpeed>0&&current.fallSpeed<1.5,'descent cannot reverse or accelerate without limit');
    maxAngle=Math.max(maxAngle,Math.abs(current.bank));
    if(t<20&&Math.sign(previous.vx)!==Math.sign(current.vx))reversals++;
    minSpeed=Math.min(minSpeed,current.fallSpeed);maxSpeed=Math.max(maxSpeed,current.fallSpeed);
    if(t<20){
      const precise=fine(t);
      assert.ok(Math.abs(precise.x-current.x)<.025,'horizontal integration did not converge');
      assert.ok(Math.abs(precise.bank-current.bank)<.025,'angular integration did not converge');
    }
    previous=current;
  }
  assert.ok(reversals>=8,'leaf needs repeated gliding reversals');
  assert.ok(maxAngle<.6,'flutter should not become continuous tumbling');
  assert.ok(maxSpeed-minSpeed>.1,'vertical drag should produce variable fall speed');
});

test('blade banks before lateral momentum reverses',()=>{
  const sample=createLeafFlight();let reversals=0,anticipated=0;
  let previous=sample(4);
  for(let t=4.02;t<32;t+=.02){
    const current=sample(t);
    if(Math.sign(previous.vx)!==Math.sign(current.vx)){
      reversals++;
      if(Math.sign(sample(t-.18).bank)===Math.sign(current.vx))anticipated++;
    }
    previous=current;
  }
  assert.ok(reversals>=10&&anticipated/reversals>.8,'attitude and translation lost their physical phase lag');
});
