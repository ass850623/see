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

import {startThirdChapterRevision} from '../engine.mjs';
export function thirdRevisionFixture({revisionAction='revise',signature='joint',readiness='ready',...previous}={}){
 let s=startThirdChapterRevision(thirdManuscriptFixture(previous));for(const id of [revisionAction,signature,readiness,'record'])s=advance(s,id);return s;
}

import {startThirdChapterPublication} from '../engine.mjs';
export function thirdPublicationFixture({publication='publish',reporter='bounds',caucus='separate',publicationNext='files',...previous}={}){
 let s=startThirdChapterPublication(thirdRevisionFixture(previous));for(const id of [publication,reporter,caucus,publicationNext])s=advance(s,id);return s;
}

import {startThirdChapterFollowup} from '../engine.mjs';
export function thirdFollowupFixture({followupAction='follow',recheck='archive',followupNext='inquiry',...previous}={}){
 let s=startThirdChapterFollowup(thirdPublicationFixture(previous));for(const id of [followupAction,'record',recheck,followupNext])s=advance(s,id);return s;
}

import {startThirdChapterRound} from '../engine.mjs';
export function thirdRoundFixture({roundAction='follow',version='addendum',roundSignature='joint',roundDisposition='publish',...previous}={}){
 let s=startThirdChapterRound(thirdFollowupFixture(previous));for(const id of [roundAction,'record',version,roundSignature,roundDisposition])s=advance(s,id);return s;
}

import {startThirdChapterReception} from '../engine.mjs';
export function thirdReceptionFixture({pressApproach='bounds',caucusApproach='agenda',partner='west',foreignDecision='continue',receptionNext='terms',...previous}={}){
 let s=startThirdChapterReception(thirdRoundFixture(previous));for(const id of [pressApproach,caucusApproach,partner,foreignDecision,receptionNext])s=advance(s,id);return s;
}

import {startThirdChapterConfirmation} from '../engine.mjs';
export function thirdConfirmationFixture({termsAction='request',domesticAction='follow',termsOutcome='method',confirmationNext='meeting',...previous}={}){
 let s=startThirdChapterConfirmation(thirdReceptionFixture(previous));for(const id of [termsAction,'record',domesticAction,termsOutcome,confirmationNext])s=advance(s,id);return s;
}

import {startThirdChapterExecution} from '../engine.mjs';
export function thirdExecutionFixture({method='attend',national='follow',methodFollowup='archive',executionNext='report',...previous}={}){let s=startThirdChapterExecution(thirdConfirmationFixture(previous));for(const id of [method,'record',national,methodFollowup,executionNext])s=advance(s,id);return s;}

import {startThirdChapterReport} from '../engine.mjs';
export function thirdReportFixture({reportDisposition='publish',negotiation='follow',reportNext='meeting',...previous}={}){let s=startThirdChapterReport(thirdExecutionFixture(previous));for(const id of [reportDisposition,'record',negotiation,'record',reportNext])s=advance(s,id);return s;}

import {startThirdChapterDayFive} from '../engine.mjs';
export function thirdDayFiveFixture({dayFiveMethod='review',application='submit',dayFiveNext='results',...previous}={}){let s=startThirdChapterDayFive(thirdReportFixture(previous));for(const id of [dayFiveMethod,'record',application,'record',dayFiveNext])s=advance(s,id);return s;}

import {startThirdChapterProcessing} from '../engine.mjs';
export function thirdProcessingFixture({processing='receive',processingGap='check',processingNext='report',...previous}={}){let s=startThirdChapterProcessing(thirdDayFiveFixture(previous));for(const id of [processing,'record',processingGap,'record',processingNext])s=advance(s,id);return s;}

import {startThirdChapterMaterials} from '../engine.mjs';
export function thirdMaterialsFixture({materialsDisposition='publish',continuing='follow',materialsNext='scope',...previous}={}){let s=startThirdChapterMaterials(thirdProcessingFixture(previous));for(const id of [materialsDisposition,'record',continuing,'record',materialsNext])s=advance(s,id);return s;}

import {startThirdChapterScope} from '../engine.mjs';
export function thirdScopeFixture({scopeAction='supplement',councilPlan='procedure',councilDisposition='send',scopeNext='council',...previous}={}){let s=startThirdChapterScope(thirdMaterialsFixture(previous));for(const id of [scopeAction,'record',councilPlan,councilDisposition,scopeNext])s=advance(s,id);return s;}

import {startThirdChapterHandling} from '../engine.mjs';
export function thirdHandlingFixture({handling='receive',windowAction='follow',arrangement='meeting',...previous}={}){let s=startThirdChapterHandling(thirdScopeFixture(previous));for(const id of [handling,'record',windowAction,'record',arrangement])s=advance(s,id);return s;}

import {startThirdChapterDaySeven} from '../engine.mjs';
export function thirdDaySevenFixture({daySevenAction='attend',answerFocus='materials',answerDisposition='send',...previous}={}){let s=startThirdChapterDaySeven(thirdHandlingFixture(previous));for(const id of [daySevenAction,'record',answerFocus,'review',answerDisposition])s=advance(s,id);return s;}

import {startThirdChapterDeadline} from '../engine.mjs';
export function thirdDeadlineFixture({answerTrack='follow',deadlineFocus='dated',deadlineNext='report',...previous}={}){let s=startThirdChapterDeadline(thirdDaySevenFixture(previous));for(const id of [answerTrack,'record',deadlineFocus,'review',deadlineNext])s=advance(s,id);return s;}

import {startThirdChapterPreReport} from '../engine.mjs';
export function thirdPreReportFixture({preReportFocus='progress',preReportDisposition='publish',waitAction='notify-relief-report',preReportNext='reply',...previous}={}){let s=startThirdChapterPreReport(thirdDeadlineFixture(previous));const actions=s.flags.c03DeadlineNext==='contact'?[waitAction,'record',preReportFocus,preReportDisposition,'record',preReportNext]:[preReportFocus,preReportDisposition,'record',waitAction,'record',preReportNext];for(const id of actions)s=advance(s,id);return s;}

import {startThirdChapterSchedule} from '../engine.mjs';
export function thirdScheduleFixture({scheduleAction='receive',promiseTarget='relief-report',scheduleNext='response',...previous}={}){let s=startThirdChapterSchedule(thirdPreReportFixture(previous));for(const id of [scheduleAction,'record',promiseTarget,'review',scheduleNext])s=advance(s,id);return s;}

import {startThirdChapterGapReply} from '../engine.mjs';
export function thirdGapReplyFixture({gapReplyFocus='progress',gapReplyDisposition='send',gapQuery='send',gapReplyNext='reply',...previous}={}){let s=startThirdChapterGapReply(thirdScheduleFixture(previous));const actions=s.flags.c03ScheduleNext==='window'?[gapQuery,'record',gapReplyFocus,gapReplyDisposition,gapReplyNext]:[gapReplyFocus,gapReplyDisposition,'record',gapQuery,gapReplyNext];for(const id of actions)s=advance(s,id);return s;}

import {startThirdChapterGapFollow} from '../engine.mjs';
export function thirdGapFollowFixture({gapFollowAction='receive',queryFollowAction='receive',gapFollowNext='check',...previous}={}){let s=startThirdChapterGapFollow(thirdGapReplyFixture(previous));const actions=s.flags.c03GapReplyNext==='query'?[queryFollowAction,'record',gapFollowAction,'record',gapFollowNext]:[gapFollowAction,'record',queryFollowAction,'record',gapFollowNext];for(const id of actions)s=advance(s,id);return s;}

import {startThirdChapterResponsibility} from '../engine.mjs';
export function thirdResponsibilityFixture({responsibilityAction='check',responsibilityFocus='scope',responsibilityDisposition='send',...previous}={}){let s=startThirdChapterResponsibility(thirdGapFollowFixture(previous));for(const id of [responsibilityAction,'record',responsibilityFocus,'review',responsibilityDisposition])s=advance(s,id);return s;}

import {startThirdChapterPreclose} from '../engine.mjs';
export function thirdPrecloseFixture({supplementAction='receive',precloseFocus='progress',precloseNext='report',...previous}={}){let s=startThirdChapterPreclose(thirdResponsibilityFixture(previous));for(const id of [supplementAction,'record',precloseFocus,'review',precloseNext])s=advance(s,id);return s;}

import {startThirdChapterDayEight} from '../engine.mjs';
export function thirdDayEightFixture({dayEightFocus='progress',dayEightDisposition='publish',dayEightWaitAction='notify-relief-report',dayEightNext='reply',...previous}={}){let s=startThirdChapterDayEight(thirdPrecloseFixture(previous));const actions=s.flags.c03PrecloseNext==='contact'?[dayEightWaitAction,'record',dayEightFocus,dayEightDisposition,'record',dayEightNext]:[dayEightFocus,dayEightDisposition,'record',dayEightWaitAction,'record',dayEightNext];for(const id of actions)s=advance(s,id);return s;}

import {startThirdChapterDueTrack} from '../engine.mjs';
export function thirdDueTrackFixture({dueTrackAction='receive',duePromiseTarget='relief-report',dueTrackNext='response',...previous}={}){let s=startThirdChapterDueTrack(thirdDayEightFixture(previous));for(const id of [dueTrackAction,'record',duePromiseTarget,'review',dueTrackNext])s=advance(s,id);return s;}

import {startThirdChapterDueReply} from '../engine.mjs';
export function thirdDueReplyFixture({dueReplyFocus='progress',dueReplyDisposition='send',dueQuery='send',dueReplyNext='reply',...previous}={}){let s=startThirdChapterDueReply(thirdDueTrackFixture(previous));const actions=s.flags.c03DueTrackNext==='window'?[dueQuery,'record',dueReplyFocus,dueReplyDisposition,dueReplyNext]:[dueReplyFocus,dueReplyDisposition,'record',dueQuery,dueReplyNext];for(const id of actions)s=advance(s,id);return s;}
