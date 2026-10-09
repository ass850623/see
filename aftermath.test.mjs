import {reporterRelationship} from './reporter.mjs';
import test from 'node:test';import assert from 'node:assert/strict';import {newGame,advance,decodeSave} from './engine.mjs';import {chapterResult} from './hearing.mjs';import {aftermathReaction,aftermathSummary,canResumeAftermath,resumeAftermath} from './aftermath.mjs';import {commitments} from './chapter-meta.mjs';
const go=(s,...ids)=>ids.reduce((state,id)=>advance(state,id),s);const base=()=>go(newGame(),'verify','depart','listen','respect','review','schedule','technician','protect','family','refer','aide','delegate','bounded','authorize','continue','amend','oversight');
test('Every hearing outcome gets its own union reaction and eight aftermath routes preserve original result',()=>{const answers={credible:['timeline','contract'],pending:['defer','contract'],party:['party','contract'],storm:['clip','insist','contract']};let count=0;for(const [result,ids] of Object.entries(answers)){const start=go(base(),...ids,'safety','review');assert.equal(start.scene,'postUnion');assert.equal(chapterResult(start).id,result);assert.ok(aftermathReaction(start,'postUnion'));for(const union of ['repair','defend'])for(const press of ['transparent','spin'])for(const staff of ['prioritize','overpromise']){const end=go(start,union,press,staff);assert.equal(end.scene,'chapterEnd');assert.equal(chapterResult(end).id,result);assert.deepEqual(decodeSave(JSON.stringify(end)),end);assert.equal(end.evidence.E02.authorized,true);assert.equal(aftermathSummary(end).length,3);if(union==='repair')assert.ok(commitments(end).some(c=>c.id==='union-reply'));if(press==='transparent')assert.ok(commitments(end).some(c=>c.id==='hearing-addendum'));count++;}}assert.equal(count,32);});
test('Already finished old saves stay valid without invented follow-up commitments',()=>{const old=go(base(),'timeline','contract','safety');old.scene='chapterEnd';const loaded=decodeSave(JSON.stringify(old));assert.ok(loaded);assert.ok(canResumeAftermath(loaded));const resumed=resumeAftermath(loaded);assert.equal(resumed.scene,'postUnion');assert.deepEqual(resumed.stats,loaded.stats);const finished=go(resumed,'repair','transparent','prioritize');assert.equal(canResumeAftermath(finished),false);assert.throws(()=>resumeAftermath(finished));assert.equal(loaded.flags.pressFollowup,undefined);assert.equal(commitments(loaded).some(c=>c.id==='hearing-addendum'),false);});

test('Union and press choices carry into later dialogue and interview access without rewriting evidence',()=>{
 const start=go(base(),'timeline','contract','safety','review');
 for(const union of ['repair','defend']){
  const press=advance(start,union);
  assert.match(aftermathReaction(press,'postPress'),union==='repair'?/相同限制/:/工會的異議/);
  for(const answer of ['transparent','spin']){
   const staff=advance(press,answer);
   assert.match(aftermathReaction(staff,'postStaff'),answer==='transparent'?/草稿尚未發布/:/不能填掉補件/);
   if(answer==='spin')assert.match(reporterRelationship(staff),/暫停專訪/);
   const loaded=decodeSave(JSON.stringify({...staff,pageIndex:3}));
   assert.ok(loaded);assert.equal(loaded.pageIndex,3);
   assert.deepEqual(staff.evidence,start.evidence);assert.deepEqual(staff.tasks,start.tasks);
   assert.equal(chapterResult(staff).id,'credible');
  }
 }
 const bargain=go({...start,flags:{...start.flags,reporterSource:'bargain'}},'repair','transparent');
 assert.match(reporterRelationship(bargain),/暫停專訪/);
});
