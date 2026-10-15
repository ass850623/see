import {thirdDueCloseFixture} from './chapter-two-followup-fixture.mjs';
import {startThirdChapterEnding,startFourthChapter,startFourthChapterContact,startFourthChapterReturn,advance} from '../engine.mjs';
export function thirdEndingFixture({nextFocus='files',endingFocus='facts',...prior}={}){let s=startThirdChapterEnding(thirdDueCloseFixture(prior));for(const id of [endingFocus,'review',nextFocus,'review','finish'])s=advance(s,id);return s;}

export function fourthOpeningFixture({orientation='facts',pressApproach='limits',workApproach='contact',disposition='queued',...prior}={}){let s=startFourthChapter(thirdEndingFixture(prior));for(const id of [orientation,'review',pressApproach,workApproach,disposition,'finish'])s=advance(s,id);return s;}

export function fourthContactFixture({contactAction='prepare',contactDisposition='sent',contactResult='reply',contactNext='window',...prior}={}){let s=startFourthChapterContact(fourthOpeningFixture(prior));for(const id of [contactAction,contactDisposition,'continue',contactResult,contactNext])s=advance(s,id);return s;}

export function fourthReturnFixture({returnWindowAction,returnConcern='needs',returnNext='list',...prior}={}){let s=startFourthChapterReturn(fourthContactFixture(prior));const window=()=>{const action=returnWindowAction||(s.flags.c04ContactResult==='reply'?'check':s.flags.c04ContactResult==='pending'?'receive':s.flags.c04ContactAction==='prepare'?'send':'route');s=advance(s,action);s=advance(s,'review');};const visit=()=>{s=advance(s,returnConcern==='unheard'?'defer':'go');s=advance(s,returnConcern==='unheard'?'keep':returnConcern);s=advance(s,'review');};if(s.flags.c04ContactNext==='window'){window();visit();}else{visit();window();}s=advance(s,'review');return advance(s,returnNext);}
