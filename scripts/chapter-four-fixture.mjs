import {thirdDueCloseFixture} from './chapter-two-followup-fixture.mjs';
import {startThirdChapterEnding,advance} from '../engine.mjs';
export function thirdEndingFixture({nextFocus='files',endingFocus='facts',...prior}={}){let s=startThirdChapterEnding(thirdDueCloseFixture(prior));for(const id of [endingFocus,'review',nextFocus,'review','finish'])s=advance(s,id);return s;}
