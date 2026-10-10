import test from 'node:test';import assert from 'node:assert/strict';
import {firstChapterFixture} from './scripts/chapter-two-fixture.mjs';
import {newGame,startSecondChapter,advance,readNextPage,options,decodeSave,validState} from './engine.mjs';
import {chapterScenes} from './chapter.mjs';import {commitments} from './chapter-meta.mjs';
import {secondChapterReaction} from './chapter-two.mjs';import {exportSave,importSave} from './save-transfer.mjs';
import {recordPlayTime} from './playtime.mjs';
test('Second chapter follows every existing commitment across reply and verification branches without completing it',()=>{
 let routes=0;
 for(const storm of [false,true]){
  const original=firstChapterFixture(storm);const snapshot=JSON.stringify(original);const initial=startSecondChapter(original);
  assert.equal(JSON.stringify(original),snapshot);assert.deepEqual(initial.evidence,original.evidence);assert.deepEqual(initial.tasks,original.tasks);assert.deepEqual(initial.stats,original.stats);assert.ok(secondChapterReaction(initial).includes(storm?'尚未更正':'昨天的聽證紀錄'));
  let board=initial;while(board.pageIndex<(chapterScenes[board.scene].beats?.length||0))board=readNextPage(board);board=advance(board,'open');
  for(const focus of options(board))for(const action of ['reply','verify'])for(const next of ['schedule','leave']){
   let s=advance(board,focus.id);assert.deepEqual(decodeSave(JSON.stringify(s)),s);s=advance(s,action);s=advance(s,next);
   assert.equal(s.scene,'c02End');assert.deepEqual(importSave(JSON.stringify(exportSave(s))),s);assert.deepEqual(s.evidence,original.evidence);assert.deepEqual(s.tasks,original.tasks);
   const tracked=commitments(s);assert.equal(tracked.length,commitments(original).length);
   for(const item of tracked){assert.equal(item.due,commitments(original).find(c=>c.id===item.id).due);assert.equal(item.status,item.id===focus.id?(action==='reply'?'已回覆 · 結果待追蹤':'核對中 · 尚未回覆'):'待履行');}
   assert.equal(recordPlayTime(s,1000,true),s);assert.throws(()=>startSecondChapter(s));routes++;
  }
 }
 assert.ok(routes>=40);
});
test('Old first chapter saves remain valid and impossible second chapter progress is rejected',()=>{
 const old=firstChapterFixture();assert.deepEqual(decodeSave(JSON.stringify(old)),old);assert.throws(()=>startSecondChapter(newGame()));
 const morning=startSecondChapter(old);assert.ok(validState(morning));
 for(const bad of [{...morning,chapter:'c01'},{...old,chapter:'c02'},{...morning,scene:'c02Response'},{...morning,flags:{...morning.flags,c02Action:'reply'}},{...morning,flags:{...morning.flags,c02Next:'scheduled'}}])assert.equal(decodeSave(JSON.stringify(bad)),null);
 const board=advance(morning,'open');assert.throws(()=>advance(board,'not-a-duty'));
 const contact=advance(board,options(board)[0].id);assert.equal(decodeSave(JSON.stringify({...contact,flags:{...contact.flags,c02Focus:'invented'}})),null);
 const legacyNoPromises={...old,flags:{}};assert.ok(validState(legacyNoPromises));let fallback=advance(startSecondChapter(legacyNoPromises),'open');assert.deepEqual(options(fallback).map(c=>c.id),['investigation']);fallback=advance(advance(advance(fallback,'investigation'),'verify'),'leave');assert.deepEqual(commitments(fallback),[]);assert.deepEqual(decodeSave(JSON.stringify(fallback)),fallback);
 const timed=recordPlayTime(morning,1000,true);assert.equal(timed.phaseTimesMs.c02,1000);assert.deepEqual(decodeSave(JSON.stringify(timed)),timed);
});

test('Second chapter feedback remains readable after saving locally',async()=>{
 const {createFeedback,readFeedback}=await import('./playtest-feedback.mjs');
 const s=startSecondChapter(firstChapterFixture());const feedback=createFeedback(s,{session:'unknown',active:'',breaks:'',discovery:'沒有',confusion:'',repetition:'',understanding:''});
 assert.deepEqual(readFeedback({getItem:()=>JSON.stringify(feedback)}),feedback);assert.equal(feedback.game.prototype,true);
});
