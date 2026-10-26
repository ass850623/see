import {fifthReporterResponseFixture,responseHandoverContexts} from './chapter-five-response-handover-fixture.mjs';
import {startFifthChapterResponseHandover,advance} from '../engine.mjs';
import {responseHandoverPrimary} from '../chapter-five-response-handover.mjs';
export function fifthResponseHandoverFixture({rhAction,rhExecution='execute',rhFocus='versions',rhHandover='prepared',rhNext='review',...prior}={}){let s=startFifthChapterResponseHandover(fifthReporterResponseFixture(prior));const action=rhAction||responseHandoverPrimary(s),r=[action,action==='keep'?'hold':rhExecution,'next'],p=[rhFocus,rhHandover,'next'];for(const id of [...(s.flags.c05RPNext==='follow'?[...r,...p]:[...p,...r]),rhNext])s=advance(s,id);return s;}
export const handoverReviewContexts=responseHandoverContexts.map((prior,index)=>({...prior,rhHandover:[2,5,7].includes(index)?'held':'prepared',rhFocus:index%2?'people':'versions',rpNext:index%2?'handover':'follow'}));
