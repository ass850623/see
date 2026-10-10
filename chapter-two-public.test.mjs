import test from 'node:test';import assert from 'node:assert/strict';
import {deliveryFixture} from './scripts/chapter-two-followup-fixture.mjs';import {startSecondChapterPublic,advance,options,blockedReason,decodeSave,newGame} from './engine.mjs';
import {publicDraftText,publishedSupplement} from './chapter-two-public.mjs';import {commitments} from './chapter-meta.mjs';import {exportSave,importSave} from './save-transfer.mjs';import {recordPlayTime} from './playtime.mjs';
test('16 source and publication routes enforce evidence scope, preserve duties and record published text only',()=>{
 let count=0;for(const mode of ['verified','held','missing']){const old=deliveryFixture(mode),snapshot=JSON.stringify(old);
 for(const inquiry of ['records','pause']){const draft=advance(startSecondChapterPublic(old),inquiry);
 for(const choice of options(draft)){
  if(blockedReason(draft,choice)){assert.notEqual(mode,'verified');assert.throws(()=>advance(draft,choice.id));continue;}
  const review=advance(draft,choice.id);assert.deepEqual(decodeSave(JSON.stringify(review)),review);assert.equal(publishedSupplement(review),null);assert.match(publicDraftText(review),/來源身分未核實/);
  for(const disposition of ['publish','hold']){const s=advance(review,disposition);assert.equal(s.scene,'c02PublicEnd');assert.deepEqual(importSave(JSON.stringify(exportSave(s))),s);assert.deepEqual(s.evidence,old.evidence);assert.deepEqual(s.tasks,old.tasks);assert.deepEqual(commitments(s),commitments(old));
   assert.equal(s.stats.trust,Math.min(100,old.stats.trust+(disposition==='publish'?(choice.id==='versions'?3:1):0)));assert.equal(Boolean(publishedSupplement(s)),disposition==='publish');if(disposition==='publish')assert.equal(publishedSupplement(s).text,publicDraftText(review));assert.equal(recordPlayTime(s,1000,true),s);assert.throws(()=>startSecondChapterPublic(s));count++;
  }
 }}assert.equal(JSON.stringify(old),snapshot);}assert.equal(count,16);
});
test('Old delivery saves continue and forged public scope or publication progress is rejected',()=>{
 const old=deliveryFixture();assert.deepEqual(decodeSave(JSON.stringify(old)),old);assert.throws(()=>startSecondChapterPublic(newGame()));const entered=startSecondChapterPublic(old);
 for(const bad of [{...entered,scene:'c02PublicEnd'},{...entered,flags:{...entered.flags,c02PublicDisposition:'published'}},{...old,flags:{...old.flags,c02PublicDraft:'versions'}}])assert.equal(decodeSave(JSON.stringify(bad)),null);
 const missing=advance(startSecondChapterPublic(deliveryFixture('missing')),'records');assert.equal(decodeSave(JSON.stringify({...missing,scene:'c02PublicReview',flags:{...missing.flags,c02PublicDraft:'versions'}})),null);
});
