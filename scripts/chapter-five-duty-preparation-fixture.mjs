import {fifthHandoverFixture,handoverResponseContexts} from './chapter-five-handover-response-fixture.mjs';
import {startFifthChapterHandoverResponse,advance} from '../engine.mjs';
import {handoverResponsePrimary} from '../chapter-five-handover-response.mjs';
export function fifthHandoverResponseFixture({hdAction,hdExecution='execute',hdOwner='aide',hdScope='table',hdDuty='confirmed',hdNext='prepare',...prior}={}){let s=startFifthChapterHandoverResponse(fifthHandoverFixture(prior));const action=hdAction||handoverResponsePrimary(s),r=[action,action==='keep'?'hold':hdExecution,'next'],d=[hdOwner+'-'+hdScope,hdDuty,'next'];for(const id of [...(s.flags.c05HONext==='response'?[...r,...d]:[...d,...r]),hdNext])s=advance(s,id);return s;}
export const dutyPreparationContexts=handoverResponseContexts.map((prior,index)=>({...prior,hdOwner:index%2?'self':'aide',hdScope:index%3===0?'outline':'table',hdDuty:index%3?'confirmed':'held',hdExecution:index===4?'hold':'execute'}));
