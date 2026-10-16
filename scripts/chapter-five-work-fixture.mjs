import {fourthEndingFixture} from './chapter-five-fixture.mjs';
import {startFifthChapter,advance} from '../engine.mjs';
export function fifthOpeningFixture({openingRoute='call',openingDisposition='spoken',openingApproach='coordinate',openingNext='terms',...prior}={}){let s=startFifthChapter(fourthEndingFixture(prior));for(const id of ['facts','review',openingRoute,openingApproach,openingDisposition,openingNext])s=advance(s,id);return s;}
