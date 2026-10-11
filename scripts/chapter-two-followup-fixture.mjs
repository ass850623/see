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

import {startSecondChapterPublic,startSecondChapterReception} from '../engine.mjs';
export function receptionFixture({mode='verified',published=true,caucus='coordinate',focus='boundaries',reporter='limits',conflict='delay',inquiry='records'}={}){
 let s=startSecondChapterPublic(deliveryFixture(mode));for(const id of [inquiry,mode==='verified'?'versions':'progress',published?'publish':'hold'])s=advance(s,id);
 s.flags.caucusConflict=conflict;s=startSecondChapterReception(s);for(const id of [caucus,reporter,focus])s=advance(s,id);return s;
}

import {startSecondChapterProposal} from '../engine.mjs';
export function proposalFixture({boundary='questions',staff='independent',accepted=true,...previous}={}){
 let s=startSecondChapterProposal(receptionFixture(previous));for(const branch of s.flags.c02NegotiationFocus==='boundaries'?['boundary','staff']:['staff','boundary']){s=advance(s,branch);s=advance(s,branch==='boundary'?boundary:staff);}return advance(s,accepted?'accept':'revise');
}

import {startSecondChapterExecution} from '../engine.mjs';
export function executionFixture({action='sort',list='internal',next='files',...previous}={}){
 let s=startSecondChapterExecution(proposalFixture(previous));for(const id of [action,list,next])s=advance(s,id);return s;
}

import {startSecondChapterRound} from '../engine.mjs';
export function roundFixture({file='public',staffReply='transfer',...previous}={}){
 let s=startSecondChapterRound(executionFixture(previous));for(const branch of s.flags.c02WorkNext==='files'?['files','staff']:['staff','files']){s=advance(s,branch);s=advance(s,branch==='files'?file:staffReply);}return advance(s,'record');
}

import {startSecondChapterAccess} from '../engine.mjs';
export function accessFixture({accessAction='onsite',sourceCheck='check',accessNext='access',...previous}={}){
 let s=startSecondChapterAccess(roundFixture(previous));for(const id of [accessAction,sourceCheck,accessNext])s=advance(s,id);return s;
}

import {startSecondChapterReading} from '../engine.mjs';
export function readingFixture({readingChoice='read',dateChoice='compare',...previous}={}){
 let s=startSecondChapterReading(accessFixture(previous));for(const branch of s.flags.c02AccessNext==='access'?['reading','dates']:['dates','reading']){s=advance(s,branch);s=advance(s,branch==='reading'?readingChoice:dateChoice);}return advance(s,'record');
}

import {startSecondChapterInquiry} from '../engine.mjs';
export function inquiryFixture({topic='flow',questionFocus='procedure',disposition='review',...previous}={}){
 let s=startSecondChapterInquiry(readingFixture(previous));for(const id of [topic,questionFocus,disposition==='review'?'review':'hold'])s=advance(s,id);return s;
}

import {startSecondChapterStage} from '../engine.mjs';
export function stageFixture({checkAction='record',priority='files',...previous}={}){
 let s=startSecondChapterStage(inquiryFixture(previous));for(const id of [checkAction,priority,'save'])s=advance(s,id);return s;
}

import {startSecondChapterEnding} from '../engine.mjs';
export function endingFixture({response='attend',preparation='facts',...previous}={}){
 let s=startSecondChapterEnding(stageFixture(previous));for(const id of [response,preparation,'finish'])s=advance(s,id);return s;
}

import {startThirdChapter} from '../engine.mjs';
export function thirdOpeningFixture({arrangement='confirm',opening='facts',approach='bounded',outcome='answer',...previous}={}){
 let s=startThirdChapter(endingFixture(previous));for(const id of [arrangement,opening,approach,outcome])s=advance(s,id);return s;
}

import {startThirdChapterReply} from '../engine.mjs';
export function thirdReplyFixture({position='separate',scope='broader',delivery='send',windowNext='track',...previous}={}){
 let s=startThirdChapterReply(thirdOpeningFixture(previous));for(const id of [position,scope,delivery,windowNext])s=advance(s,id);return s;
}

import {startThirdChapterTracking} from '../engine.mjs';
export function thirdTrackingFixture({trackTopic='files',trackAction='follow',coordination='limited',...previous}={}){
 let s=startThirdChapterTracking(thirdReplyFixture(previous));for(const id of [trackTopic,trackAction,'record',coordination])s=advance(s,id);return s;
}

import {startThirdChapterManuscript} from '../engine.mjs';
export function thirdManuscriptFixture({gap='document',manuscript='joint',manuscriptDisposition='send',manuscriptNext='revise',...previous}={}){
 let s=startThirdChapterManuscript(thirdTrackingFixture(previous));for(const id of [gap,manuscript,manuscriptDisposition,manuscriptNext])s=advance(s,id);return s;
}
