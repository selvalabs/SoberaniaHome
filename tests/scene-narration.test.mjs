import test from 'node:test';
import assert from 'node:assert/strict';
import {narrationIndex} from '../src/scripts/scene-narration.ts';
import {sampleNetwork} from '../src/scripts/network-flow-model.ts';
test('the spoken network beat follows the visible network state in both scroll directions',()=>{
 for(const p of [0,.12,.2,.38,.54,.64,.7,.98,1,.7,.38,0])assert.equal(narrationIndex(p,'network'),sampleNetwork(p).act);
 assert.equal(narrationIndex(.1,'time'),0);assert.equal(narrationIndex(.6,'time'),1);assert.equal(narrationIndex(.95,'time'),2);
});
