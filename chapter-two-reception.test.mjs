import test from 'node:test';import assert from 'node:assert/strict';
import {deliveryFixture} from './scripts/chapter-two-followup-fixture.mjs';
import {advance,startSecondChapterPublic,startSecondChapterReception,decodeSave,newGame} from './engine.mjs';
import {receptionReaction,receptionSummary} from './chapter-two-reception.mjs';import {publishedSupplement} from './chapter-two-public.mjs';import {commitments} from './chapter-meta.mjs';import {recordPlayTime} from './playtime.mjs';import {exportSave,importSave} from './save-transfer.mjs';
export function publicFixture(mode='verified',published=true){let s=startSecondChapterPublic(deliveryFixture(mode));for(const id of ['records',mode==='verified'?'versions':'progress',published?'publish':'hold'])s=advance(s,id);return s;}
test('96 reception routes preserve publication, evidence, obligations and reporter disagreements',()=>{
 let count=0;for(const mode of ['verified','held','missing'])for(const published of [true,false])for(const paused of [true,false]){
 const old=publicFixture(mode,published);if(paused)old.flags.reporterSource='bargain';const snapshot=JSON.stringify(old);
 for(const caucus of ['separate','coordinate'])for(const reporter of ['limits','defer'])for(const focus of ['boundaries','staffing']){
 let s=startSecondChapterReception(old);assert.deepEqual(decodeSave(JSON.stringify(s)),s);const line=receptionReaction(s);assert.match(line,published?mode==='verified'?/公開版本差異/:/公開進度/:/未發布草稿沒有交給黨團/);
 s=advance(s,caucus);assert.match(receptionReaction(s),paused?/原專訪合作仍暫停/:/不代表記者同意/);assert.deepEqual(decodeSave(JSON.stringify(s)),s);s=advance(s,reporter);assert.deepEqual(decodeSave(JSON.stringify(s)),s);s=advance(s,focus);
 assert.equal(s.scene,'c02ReceptionEnd');assert.deepEqual(importSave(JSON.stringify(exportSave(s))),s);assert.deepEqual(s.evidence,old.evidence);assert.deepEqual(s.tasks,old.tasks);assert.deepEqual(commitments(s),commitments(old));assert.deepEqual(publishedSupplement(s),publishedSupplement(old));assert.equal(s.stats.trust,old.stats.trust);assert.equal(s.stats.autonomy,Math.max(0,Math.min(100,old.stats.autonomy+(caucus==='separate'?1:-1))));assert.match(receptionSummary(s)[1].detail,paused?/仍暫停/:/獨立查證/);assert.equal(recordPlayTime(s,1000,true),s);assert.throws(()=>startSecondChapterReception(s));count++;
 }assert.equal(JSON.stringify(old),snapshot);}assert.equal(count,96);
});
test('old saves remain readable; invalid reception progression and forged publication fail',()=>{
 const old=publicFixture();assert.deepEqual(decodeSave(JSON.stringify(old)),old);assert.throws(()=>startSecondChapterReception(newGame()));const s=startSecondChapterReception(old);
 for(const bad of [{...s,scene:'c02ReceptionEnd'},{...s,flags:{...s.flags,c02ReporterReply:'limits'}},{...old,flags:{...old.flags,c02NegotiationFocus:'staffing'}},{...s,flags:{...s.flags,c02PublicDisposition:'held'}}])assert.equal(decodeSave(JSON.stringify(bad)),null);
});
test('prior caucus conflicts and press spin retain distinct unresolved reactions',()=>{
 for(const conflict of ['recuse','delay']){
  const old=publicFixture();old.flags.caucusConflict=conflict;old.flags.pressFollowup='spin';let s=startSecondChapterReception(old);
  assert.match(receptionReaction(s),conflict==='recuse'?/利益申報與迴避建議仍待處理/:/暫緩贊助名冊調閱/);
  s=advance(s,'coordinate');assert.match(receptionReaction(s),/原專訪合作仍暫停/);s=advance(s,'limits');s=advance(s,'staffing');assert.equal(s.flags.caucusConflict,conflict);assert.equal(s.flags.pressFollowup,'spin');assert.match(receptionSummary(s)[1].detail,/仍暫停/);
 }
});
