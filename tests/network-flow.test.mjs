import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {sampleNetwork,networkWires,cableGeometry,cubicPoint,networkParticles} from '../src/scripts/network-flow-model.ts';

test('network cable endpoints stay attached during a bounded damped impulse',()=>{
  for(const wire of networkWires){
    let excursion=0;
    for(let i=0;i<=100;i++){
      const curve=cableGeometry(wire,i/100);
      assert.deepEqual(cubicPoint(curve,0),wire.from);
      assert.deepEqual(cubicPoint(curve,1),wire.to);
      excursion=Math.max(excursion,Math.abs(curve.c1.y-wire.c1.y));
      assert.ok(Math.abs(curve.c1.y-wire.c1.y)<75);
    }
    assert.ok(excursion>2,'cable has no physical response');
    assert.deepEqual(cableGeometry(wire,0).c1,wire.c1);
    assert.deepEqual(cableGeometry(wire,1).c1,wire.c1);
  }
});
test('drawing and collective routes advance monotonically and reverse exactly',()=>{
  let ink=0,collective=0;
  for(let i=0;i<=1000;i++){
    const state=sampleNetwork(i/1000);
    assert.ok(state.ink>=ink&&state.collective>=collective);
    ink=state.ink;collective=state.collective;
  }
  const middle=networkWires.map(w=>[cableGeometry(w,.73),networkParticles(w,.73)]);
  networkWires.forEach(w=>networkParticles(w,.94));
  assert.deepEqual(networkWires.map(w=>[cableGeometry(w,.73),networkParticles(w,.73)]),middle);
  assert.equal(sampleNetwork(1).ink,1);
  assert.ok(sampleNetwork(1).platformLight>0,'the platform should remain present');
});
test('particles remain on their cable, fade at endpoints and stop in reading mode',()=>{
  for(const wire of networkWires)for(let i=0;i<=100;i++){
    const packets=networkParticles(wire,i/100);
    assert.ok(packets.every(p=>Number.isFinite(p.x)&&Number.isFinite(p.y)&&p.opacity>=0&&p.opacity<=1));
  }
  for(const wire of networkWires)assert.ok(networkParticles(wire,.5,false).every(p=>p.opacity===0));
  assert.equal(sampleNetwork(.2,false).ink,1);
  assert.equal(sampleNetwork(.2,false).collective,1);
});
test('network guides reveal the exact commissioned raster artwork',()=>{
  const traces=JSON.parse(readFileSync(new URL('../src/data/network-traces.json',import.meta.url),'utf8'));
  const image=readFileSync(new URL('../public/assets/ink/network-generated-v1.png',import.meta.url));
  assert.equal(createHash('sha256').update(image).digest('hex'),traces.sourceSha256);
  assert.equal(traces.width,1536);assert.equal(traces.height,1024);
  const gaps=traces.paths.map(p=>p.gap).sort((a,b)=>a-b);
  assert.ok(gaps[Math.floor(gaps.length*.9)]<65,'pencil lifts should stay local');
  assert.ok(gaps.filter(g=>g>150).length<30,'large jumps must remain exceptional');
});
