import {fifthDutyExecutionFixture,dutyReviewContexts} from './chapter-five-duty-review-fixture.mjs';
import {startFifthChapterDutyReview,advance} from '../engine.mjs';
import {hasDutyOutput} from '../chapter-five-duty-review.mjs';
export function fifthDutyReviewFixture({drFocus='scope',drFiled,drReportFocus='versions',drReport='prepared',drNext='review',...prior}={}){let s=startFifthChapterDutyReview(fifthDutyExecutionFixture(prior));const filed=drFiled||(hasDutyOutput(s)?'filed':'held'),r=[drFocus,filed,'next'],p=[drReportFocus,drReport,'next'];for(const id of [...(s.flags.c05DENext==='review'?[...r,...p]:[...p,...r]),drNext])s=advance(s,id);return s;}
export const trackingReviewContexts=dutyReviewContexts.map((prior,index)=>({...prior,drReport:[5,7].includes(index)?'held':'prepared',deNext:index%2?'report':'review'}));
