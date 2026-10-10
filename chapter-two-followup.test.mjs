import test from 'node:test';import assert from 'node:assert/strict';
import {investigationFixture} from './scripts/chapter-two-followup-fixture.mjs';
import {startSecondChapterFollowup,advance,options,decodeSave,newGame} from './engine.mjs';
import {commitments} from './chapter-meta.mjs';import {followupSummary,followupReaction} from './chapter-two-followup.mjs';
import {exportSave,importSave} from './save-transfer.mjs';import {recordPlayTime} from './playtime.mjs';
test('64 followup routes carry prior decisions and save requests separately from documents and awards',()=>{
 let routes=0;
 for(const alternate of [false,true]){const old=investigationFixture(alternate),snapshot=JSON.stringify(old);
 for(const order of [['files','barrier'],['barrier','files']])for(const scope of ['versions','full'])for(const disposition of ['keep','narrow'])for(const contact of ['callback','explain'])for(const reply of ['checklist','window']){
  let s=startSecondChapterFollowup(old);assert.equal(JSON.stringify(old),snapshot);
  for(const branch of order){s=advance(s,branch);assert.match(followupReaction(s),branch==='files'?(alternate?/上一輪只整理/:/上一輪已列/):(alternate?/上一輪留下/:/上一輪已提供/));
   for(const id of branch==='files'?[scope,disposition]:[contact,reply]){s=advance(s,id);assert.deepEqual(decodeSave(JSON.stringify(s)),s);}
  }
  assert.equal(s.scene,'c02FollowupEnd');assert.deepEqual(options(s),[]);assert.deepEqual(importSave(JSON.stringify(exportSave(s))),s);assert.deepEqual(s.evidence,old.evidence);assert.deepEqual(s.tasks,old.tasks);assert.deepEqual(commitments(s),commitments(old));
  const summary=followupSummary(s);assert.equal(summary[0].status,disposition==='narrow'?'修正申請已送 · 受理待確認':scope==='full'?'申請已收件 · 範圍待釐清':'版本申請已受理 · 原卷未交付');assert.ok(summary[1].status.includes(reply==='checklist'?'個案未審':'答覆待收'));assert.equal(recordPlayTime(s,1000,true),s);assert.throws(()=>startSecondChapterFollowup(s));routes++;
 }}assert.equal(routes,64);
});
test('Old investigation saves continue but duplicate branches and premature followup results fail validation',()=>{
 const old=investigationFixture();assert.deepEqual(decodeSave(JSON.stringify(old)),old);assert.throws(()=>startSecondChapterFollowup(newGame()));
 let s=startSecondChapterFollowup(old);assert.equal(options(s).length,2);s=advance(advance(advance(s,'files'),'full'),'keep');assert.deepEqual(options(s).map(c=>c.id),['barrier']);assert.throws(()=>advance(s,'files'));
 for(const bad of [{...s,scene:'c02FollowupEnd'},{...s,scene:'c02FileRequest'},{...s,flags:{...s.flags,c02FileScope:undefined}},{...s,flags:{...s.flags,c02BarrierNext:'awarded'}},{...old,flags:{...old.flags,c02FileDisposition:'keep'}}])assert.equal(decodeSave(JSON.stringify(bad)),null);
 const pending=advance(advance(startSecondChapterFollowup(old),'files'),'versions');assert.equal(decodeSave(JSON.stringify({...pending,scene:'c02ReliefReturn'})),null);
});
