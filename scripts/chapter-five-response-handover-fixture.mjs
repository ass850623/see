import {fifthFollowupReactionFixture,reporterResponseContexts} from './chapter-five-reporter-response-fixture.mjs';
import {startFifthChapterReporterResponse,advance} from '../engine.mjs';
import {canAnswerReporter} from '../chapter-five-reporter-response.mjs';
export function fifthReporterResponseFixture({rpFocus='responsibility',rpReply,rpPendingFocus='cases',rpChecked='checked',rpNext='follow',...prior}={}){let s=startFifthChapterReporterResponse(fifthFollowupReactionFixture(prior));const reply=rpReply||(canAnswerReporter(s)?'spoken':'held'),r=[rpFocus,reply,'next'],p=[rpPendingFocus,rpChecked,'next'];for(const id of [...(s.flags.c05FRNext==='reporter'?[...r,...p]:[...p,...r]),rpNext])s=advance(s,id);return s;}
export const responseHandoverContexts=reporterResponseContexts.map((prior,index)=>({...prior,rpReply:index===1?'held':undefined,rpFocus:index%2?'limits':'responsibility',rpChecked:index%2?'held':'checked',frNext:index%2?'pending':'reporter'}));
