import test from 'node:test';import assert from 'node:assert/strict';
import {firstChapterFixture} from './scripts/chapter-two-fixture.mjs';
import {startSecondChapter,startSecondChapterInvestigation,advance,options,decodeSave,newGame} from './engine.mjs';
import {commitments} from './chapter-meta.mjs';import {exportSave,importSave} from './save-transfer.mjs';
import {investigationSummary} from './chapter-two-investigation.mjs';import {recordPlayTime} from './playtime.mjs';
const opening=()=>{let s=startSecondChapter(firstChapterFixture());for(const id of ['open','relief-report','reply','schedule'])s=advance(s,id);return s;};
test('Both investigation orders and 32 decision combinations persist without inventing evidence or fulfillment',()=>{
 const old=opening(),snapshot=JSON.stringify(old);let routes=0;
 for(const order of [['source','relief'],['relief','source']])for(const source of ['independent','relay'])for(const next of ['original','comparison'])for(const relief of ['criteria','barrier'])for(const response of ['referral','review']){
  let s=startSecondChapterInvestigation(old);assert.equal(JSON.stringify(old),snapshot);
  for(const branch of order){for(const id of [branch,...(branch==='source'?[source,next]:[relief,response])]){s=advance(s,id);assert.deepEqual(decodeSave(JSON.stringify(s)),s);}}
  assert.equal(s.scene,'c02InvestigationEnd');assert.deepEqual(options(s),[]);assert.deepEqual(importSave(JSON.stringify(exportSave(s))),s);
  assert.deepEqual(s.evidence,old.evidence);assert.deepEqual(s.tasks,old.tasks);assert.deepEqual(commitments(s),commitments(old));
  assert.ok(investigationSummary(s).every(i=>i.status.includes('待')));assert.equal(recordPlayTime(s,1000,true),s);
  assert.throws(()=>startSecondChapterInvestigation(s));routes++;
 }
 assert.equal(routes,32);
});
test('Old opening saves can continue while repeat branches and impossible progress are rejected',()=>{
 const old=opening();assert.deepEqual(decodeSave(JSON.stringify(old)),old);assert.throws(()=>startSecondChapterInvestigation(newGame()));
 let s=startSecondChapterInvestigation(old);assert.equal(options(s).length,2);s=advance(advance(advance(s,'source'),'independent'),'original');assert.deepEqual(options(s).map(c=>c.id),['relief']);assert.throws(()=>advance(s,'source'));
 for(const bad of [{...s,scene:'c02InvestigationEnd'},{...s,scene:'c02Letter'},{...s,flags:{...s.flags,c02SourceCheck:undefined}},{...s,flags:{...s.flags,c02SourceNext:'verified'}},{...old,flags:{...old.flags,c02ReliefNext:'referral'}}])assert.equal(decodeSave(JSON.stringify(bad)),null);
 const registry=advance(advance(startSecondChapterInvestigation(old),'source'),'relay');assert.equal(decodeSave(JSON.stringify({...registry,scene:'c02Relief'})),null);
});
