import {fifthHandoverReviewFixture,dutyExecutionContexts} from './chapter-five-duty-execution-fixture.mjs';
import {startFifthChapterDutyExecution,advance} from '../engine.mjs';
import {dutyExecutionPrimary} from '../chapter-five-duty-execution.mjs';
export function fifthDutyExecutionFixture({deAction,deExecution='execute',deFocus='versions',deTracked='checked',deNext='review',...prior}={}){let s=startFifthChapterDutyExecution(fifthHandoverReviewFixture(prior));const action=deAction||dutyExecutionPrimary(s),w=[action,action==='keep'?'hold':deExecution,'next'],t=[deFocus,deTracked,'next'];for(const id of [...(s.flags.c05HRNext==='work'?[...w,...t]:[...t,...w]),deNext])s=advance(s,id);return s;}
export const dutyReviewContexts=dutyExecutionContexts.map((prior,index)=>({...prior,deExecution:[2,5].includes(index)?'hold':'execute',deAction:[3,7].includes(index)?'keep':undefined,hrNext:index%2?'track':'work',deTracked:index%2?'held':'checked'}));
