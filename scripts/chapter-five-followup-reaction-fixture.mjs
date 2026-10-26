import {fifthWindowReportFixture,reportReviewContexts} from './chapter-five-report-review-fixture.mjs';
import {startFifthChapterReportReview,advance} from '../engine.mjs';
import {hasExecutionReport,canFollowReport} from '../chapter-five-report-review.mjs';
export function fifthReportReviewFixture({raFocus='facts',raPublication,raFollowFocus='scope',raFollow,raNext='response',...prior}={}){let s=startFifthChapterReportReview(fifthWindowReportFixture(prior));const publication=raPublication||(hasExecutionReport(s)?'published':'held'),follow=raFollow||(canFollowReport(s)?'sent':'held'),r=[raFocus,publication,'next'],q=[raFollowFocus,follow,'next'];for(const id of [...(s.flags.c05WRNext==='review'?[...r,...q]:[...q,...r]),raNext])s=advance(s,id);return s;}
export const followupReactionContexts=reportReviewContexts.map((prior,index)=>({...prior,raPublication:index===2?'held':undefined,raFollowFocus:index%2?'procedure':'scope'}));
