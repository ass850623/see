import test from 'node:test';import assert from 'node:assert/strict';
import {followupFixture} from './scripts/chapter-two-followup-fixture.mjs';
import {startSecondChapterDelivery,advance,options,decodeSave,newGame} from './engine.mjs';
import {canReceiveVersions,deliverySummary} from './chapter-two-delivery.mjs';import {commitments} from './chapter-meta.mjs';
import {exportSave,importSave} from './save-transfer.mjs';import {recordPlayTime} from './playtime.mjs';
test('64 delivery routes distinguish public version verification, missing documents and general relief replies',()=>{
 let count=0;
 for(const scope of ['versions','full'])for(const disposition of ['keep','narrow'])for(const contact of ['callback','explain'])for(const next of ['checklist','window']){
  const old=followupFixture({scope,disposition,contact,next}),snapshot=JSON.stringify(old);const entered=startSecondChapterDelivery(old);
  assert.equal(JSON.stringify(old),snapshot);assert.deepEqual(decodeSave(JSON.stringify(entered)),entered);
  for(const choice of options(entered))for(const response of ['relay','clarify']){
   let s=advance(entered,choice.id);assert.deepEqual(decodeSave(JSON.stringify(s)),s);s=advance(s,response);s=advance(s,'record');assert.equal(s.scene,'c02DeliveryEnd');assert.deepEqual(importSave(JSON.stringify(exportSave(s))),s);
   for(const [id,e] of Object.entries(old.evidence))assert.deepEqual(s.evidence[id],e);assert.deepEqual(s.tasks,old.tasks);assert.deepEqual(commitments(s),commitments(old));
   if(canReceiveVersions(s))assert.deepEqual(s.evidence.E07,{verified:choice.id==='compare',authorized:true});else assert.equal(s.evidence.E07,undefined);
   assert.ok(deliverySummary(s)[1].status.includes(response==='relay'?'個案未審':'界線待確認'));assert.equal(recordPlayTime(s,1000,true),s);assert.throws(()=>startSecondChapterDelivery(s));count++;
  }
 }assert.equal(count,64);
});
test('Old followup saves continue while forged evidence and premature delivery results are rejected',()=>{
 const old=followupFixture();assert.deepEqual(decodeSave(JSON.stringify(old)),old);assert.throws(()=>startSecondChapterDelivery(newGame()));
 const entered=startSecondChapterDelivery(old);
 for(const bad of [{...old,evidence:{...old.evidence,E07:{verified:true,authorized:true}}},{...entered,scene:'c02DeliveryEnd'},{...entered,evidence:{...entered.evidence,E07:{verified:true,authorized:true}}},{...entered,flags:{...entered.flags,c02FormalReply:'relayed'}},{...entered,flags:{...entered.flags,c02DeliveryRecorded:true}}])assert.equal(decodeSave(JSON.stringify(bad)),null);
 const missing=startSecondChapterDelivery(followupFixture({scope:'full'}));assert.throws(()=>advance(missing,'compare'));assert.equal(decodeSave(JSON.stringify({...missing,evidence:{...missing.evidence,E07:{verified:false,authorized:true}}})),null);
});
