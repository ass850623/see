import {fifthCandidateReplyFixture,newReportContexts} from './chapter-five-new-report-fixture.mjs';
import {startFifthChapterNewReport,advance} from '../engine.mjs';
import {newReportWorkPrimary} from '../chapter-five-new-report.mjs';
export function fifthNewReportFixture({nrFocus='progress',nrDisposition='published',nrWork='execute',nrNext='reactions',...prior}={}){let s=startFifthChapterNewReport(fifthCandidateReplyFixture(prior));const r=[nrFocus,nrDisposition,'next'],w=[nrWork==='keep'?'keep':newReportWorkPrimary(s),nrWork==='execute'?'execute':'hold','next'];for(const id of [...(s.flags.c05CRNext==='report'?[...r,...w]:[...w,...r]),nrNext])s=advance(s,id);return s;}
export const reportReactionContexts=newReportContexts.map((prior,index)=>({...prior,nrDisposition:index%2?'held':'published',nrWork:index%3?'execute':'hold'}));
