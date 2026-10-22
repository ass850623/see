import {fifthCandidateFixture,candidateReplyContexts} from './chapter-five-candidate-reply-fixture.mjs';
import {startFifthChapterCandidateReply,advance} from '../engine.mjs';
import {candidateReplyPrimary} from '../chapter-five-candidate-reply.mjs';
export function fifthCandidateReplyFixture({crAction,crExecution='execute',crOwner='aide',crDuty='confirmed',crNext='report',...prior}={}){let s=startFifthChapterCandidateReply(fifthCandidateFixture(prior));const action=crAction||candidateReplyPrimary(s),r=[action,action==='keep'?'hold':crExecution,'next'],d=[crOwner,crDuty,'next'];for(const id of [...(s.flags.c05CandidateNext==='reply'?[...r,...d]:[...d,...r]),crNext])s=advance(s,id);return s;}
export const newReportContexts=candidateReplyContexts.map((prior,index)=>({...prior,crAction:index===2?'keep':undefined,crExecution:index===3?'hold':'execute',crOwner:index%2?'self':'aide',crDuty:index%3?'confirmed':'held'}));
