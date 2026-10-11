import test from 'node:test';import assert from 'node:assert/strict';
import {endingFixture,stageFixture} from './scripts/chapter-two-followup-fixture.mjs';
import {newGame,startThirdChapter,advance,options,decodeSave,readNextPage} from './engine.mjs';
import {chapterScenes} from './chapter.mjs';import {chapterPhase,chapterPhases,commitments,backgroundFor,characterFor} from './chapter-meta.mjs';
import {createFeedback,readFeedback,feedbackKey,feedbackQuestions} from './playtest-feedback.mjs';
import {thirdChapterAnswer,thirdChapterReaction,publishedThirdChapterAnswer} from './chapter-three.mjs';import {publishedSupplement} from './chapter-two-public.mjs';
import {recordPlayTime,playtestRecord} from './playtime.mjs';import {ambienceFor} from './ambience.mjs';import {exportSave,importSave} from './save-transfer.mjs';import {access} from 'node:fs/promises';
test('3456 third-chapter routes retain the handoff, private evidence and original public records',()=>{
 let count=0;for(const mode of ['verified','held','missing'])for(const published of [true,false])for(const readingChoice of ['read','postpone'])for(const disposition of ['review','draft'])for(const priority of ['files','source','relief'])for(const response of ['attend','written'])for(const preparation of ['facts','people']){
 const old=endingFixture({mode,published,readingChoice,disposition,priority,response,preparation,topic:readingChoice==='read'?'flow':'access',checkAction:disposition==='review'?'record':'schedule'}),snapshot=JSON.stringify(old);
 for(const arrangement of ['confirm','defer'])for(const opening of ['facts','people'])for(const approach of ['bounded','followup'])for(const outcome of arrangement==='confirm'?['answer','hold']:['hold']){
 let s=startThirdChapter(old);assert.deepEqual(decodeSave(JSON.stringify(s)),s);for(const id of [arrangement,opening,approach,outcome]){
 while(s.pageIndex<(chapterScenes[s.scene].beats?.length||0)){s=readNextPage(s);assert.deepEqual(decodeSave(JSON.stringify(s)),s);}s=advance(s,id);assert.deepEqual(decodeSave(JSON.stringify(s)),s);
 }assert.deepEqual(importSave(JSON.stringify(exportSave(s))),s);assert.equal(s.chapter,'c03');assert.equal(s.scene,'c03OpeningEnd');assert.equal(s.flags.c03AnswerRecord,thirdChapterAnswer(s));assert.equal(s.flags.c03Route,arrangement==='confirm'?response:'internal');assert.equal(s.flags.c03AnswerStatus,outcome==='hold'?'held':response==='attend'?'spoken':'sent');
 for(const key of ['evidence','tasks','stats','relations','visited','slots'])assert.deepEqual(s[key],old[key]);for(const [key,value] of Object.entries(old.flags))assert.equal(s.flags[key],value);assert.deepEqual(commitments(s),commitments(old));assert.deepEqual(publishedSupplement(s),publishedSupplement(old));assert.equal(s.flags.c02SentQuestions,old.flags.c02SentQuestions);assert.equal(publishedThirdChapterAnswer(s)?.text,outcome==='hold'?undefined:s.flags.c03AnswerRecord);assert.doesNotMatch(s.flags.c03AnswerRecord,/E09|E10|私人補充回信|受限流程筆記/);assert.match(s.flags.c03AnswerRecord,mode==='verified'?/附件清單已核對/:/沒有可作已核實公開引用/);assert.equal(recordPlayTime(s,1000,true),s);assert.equal(ambienceFor(s.scene),null);assert.throws(()=>startThirdChapter(s));count++;
 }assert.equal(JSON.stringify(old),snapshot);}assert.equal(count,3456);
});
test('third chapter rejects premature starts, mismatched attendance and forged public answers',()=>{
 const old=endingFixture(),start=startThirdChapter(old);assert.throws(()=>startThirdChapter(newGame()));assert.throws(()=>startThirdChapter(stageFixture()));assert.deepEqual(decodeSave(JSON.stringify(old)),old);
 const check=advance(start,'confirm'),question=advance(check,'people'),review=advance(question,'followup'),end=advance(review,'answer');
 for(const bad of [{...old,chapter:'c03'},{...old,flags:{...old.flags,c03Started:true}},{...start,scene:'c03OpeningEnd'},{...start,flags:{...start.flags,c03Opening:'facts'}},{...check,flags:{...check.flags,c03Route:'written'}},{...question,flags:{...question.flags,c03AnswerStatus:'sent'}},{...review,flags:{...review.flags,c03AnswerRecord:'fake answer'}},{...end,chapter:'c02'},{...end,flags:{...end.flags,c03AnswerStatus:'sent'}},{...end,flags:{...end.flags,c03AnswerRecord:'私人材料已全部公開'}},{...end,flags:{...end.flags,c02EndingBrief:'cleared cases'}},{...end,flags:{...end.flags,c03AllDone:true}},{...end,evidence:{...end.evidence,E09:{verified:true,authorized:true}}}])assert.equal(decodeSave(JSON.stringify(bad)),null);
 const deferred=advance(advance(advance(start,'defer'),'facts'),'bounded');assert.deepEqual(options(deferred).map(c=>c.id),['hold']);assert.throws(()=>advance(deferred,'answer'));const held=advance(deferred,'hold');assert.equal(decodeSave(JSON.stringify({...held,flags:{...held.flags,c03AnswerStatus:'spoken'}})),null);
});
test('new chapter has its own clock and carries priority-specific questions and reporter friction',()=>{
 for(const priority of ['files','source','relief']){let s=startThirdChapter(endingFixture({priority,reporter:'limits'}));s=recordPlayTime(s,1250,true);assert.equal(s.phaseTimesMs.c03,1250);assert.equal(chapterPhases[chapterPhase(s)].id,'c03');assert.equal(playtestRecord(s).prototype,true);assert.equal(playtestRecord(s).completed,false);s=advance(advance(s,'confirm'),'facts');assert.match(thirdChapterReaction(s),priority==='files'?/完整原卷/:priority==='source'?/核實了那個人/:/資格/);}
 const old=endingFixture();old.flags.reporterSource='bargain';let s=advance(advance(startThirdChapter(old),'defer'),'people');assert.match(thirdChapterReaction(s),/原採訪分歧/);
});
test('third-chapter scenes have readable art and a distinct terminal pause',async()=>{
 const ids=['c03Morning','c03Checkin','c03Question','c03AnswerReview','c03OpeningEnd'];for(const id of ids){const scene=chapterScenes[id];for(const asset of [backgroundFor(id),characterFor(scene.speaker)].filter(Boolean))await access(new URL(asset,import.meta.url));assert.equal(chapterPhases[chapterPhase({scene:id})].id,'c03');}assert.equal(backgroundFor('c03OpeningEnd'),null);assert.equal(ambienceFor('c03Question'),'room');
});

test('third-chapter feedback can be read after restart without inventing manual playtime',()=>{
 const s=startThirdChapter(endingFixture()),answers={session:'replay',active:'',breaks:'',...Object.fromEntries(feedbackQuestions.map(q=>[q.id,'沒有']))},report=createFeedback(s,answers);const storage={getItem:key=>key===feedbackKey?JSON.stringify(report):null};assert.deepEqual(readFeedback(storage),report);assert.equal(report.manualActiveMinutes,null);assert.equal(report.game.chapter,'c03');report.game.chapter='c04';assert.equal(readFeedback(storage),null);
});
