import {fifthDutyPreparationFixture,candidateFeedbackContexts} from './chapter-five-candidate-feedback-fixture.mjs';
import {startFifthChapterCandidateFeedback,advance} from '../engine.mjs';
import {candidateFeedbackPrimary} from '../chapter-five-candidate-feedback.mjs';
export function fifthCandidateFeedbackFixture({cfAction,cfExecution='execute',cfAuditFocus='cases',cfAudit='checked',cfNext='revise',...prior}={}){let s=startFifthChapterCandidateFeedback(fifthDutyPreparationFixture(prior));const action=cfAction||candidateFeedbackPrimary(s),r=[action,action==='keep'?'hold':cfExecution,'next'],a=[cfAuditFocus,cfAudit,'next'];for(const id of [...(s.flags.c05DPNext==='reply'?[...r,...a]:[...a,...r]),cfNext])s=advance(s,id);return s;}
export const revisionConditionContexts=candidateFeedbackContexts.map((prior,index)=>({...prior,cfExecution:index===6?'hold':'execute',cfAudit:index%2?'held':'checked'}));
