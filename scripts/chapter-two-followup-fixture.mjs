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

import {startSecondChapterDelivery} from '../engine.mjs';
export function deliveryFixture(mode='verified'){
 let s=startSecondChapterDelivery(followupFixture({scope:mode==='missing'?'full':'versions',next:'window'}));
 for(const id of [mode==='missing'?'notice':mode==='held'?'hold':'compare','relay','record'])s=advance(s,id);return s;
}
