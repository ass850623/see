import {thirdDueCloseFixture} from './chapter-two-followup-fixture.mjs';
import {startThirdChapterEnding,startFourthChapter,advance} from '../engine.mjs';
export function thirdEndingFixture({nextFocus='files',endingFocus='facts',...prior}={}){let s=startThirdChapterEnding(thirdDueCloseFixture(prior));for(const id of [endingFocus,'review',nextFocus,'review','finish'])s=advance(s,id);return s;}

export function fourthOpeningFixture({orientation='facts',pressApproach='limits',workApproach='contact',disposition='queued',...prior}={}){let s=startFourthChapter(thirdEndingFixture(prior));for(const id of [orientation,'review',pressApproach,workApproach,disposition,'finish'])s=advance(s,id);return s;}
