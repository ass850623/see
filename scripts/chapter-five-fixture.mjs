import {fourthFinalFixture} from './chapter-four-fixture.mjs';
import {startFourthChapterEnding,advance} from '../engine.mjs';
export function fourthEndingFixture({endingFocus='facts',nextFocusFive='caucus',...prior}={}){let s=startFourthChapterEnding(fourthFinalFixture(prior));const a=[endingFocus,'review'],n=[nextFocusFive,'review'];for(const id of [...(s.flags.c04FinalNext==='versions'?[...a,...n]:[...n,...a]),'finish'])s=advance(s,id);return s;}
