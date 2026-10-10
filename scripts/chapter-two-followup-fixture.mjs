import {firstChapterFixture} from './chapter-two-fixture.mjs';
import {startSecondChapter,startSecondChapterInvestigation,advance} from '../engine.mjs';
export function investigationFixture(alternate=false){
 let s=startSecondChapter(firstChapterFixture());for(const id of ['open','relief-report','reply','schedule'])s=advance(s,id);
 s=startSecondChapterInvestigation(s);for(const id of ['source',alternate?'relay':'independent',alternate?'comparison':'original','relief',alternate?'barrier':'criteria',alternate?'review':'referral'])s=advance(s,id);return s;
}
import {startSecondChapterFollowup} from '../engine.mjs';
export function followupFixture({scope='versions',disposition='keep',contact='callback',next='checklist'}={}){
 let s=startSecondChapterFollowup(investigationFixture(true));for(const id of ['files',scope,disposition,'barrier',contact,next])s=advance(s,id);return s;
}
