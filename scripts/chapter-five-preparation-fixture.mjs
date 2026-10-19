import {fifthReactionFixture} from './chapter-five-duty-fixture.mjs';
import {startFifthChapterDuty,advance} from '../engine.mjs';
export function fifthDutyFixture({dutyContact='call',dutyFocus='boundary',dutyResponse='spoken',dutyOwner='aide',dutyDisposition='confirmed',dutyNext='prepare',...prior}={}){let s=startFifthChapterDuty(fifthReactionFixture(prior));const caucus=[dutyContact,dutyFocus,dutyResponse,'next'],duty=[dutyOwner,dutyDisposition,'next'];for(const id of [...(s.flags.c05ReactNext==='caucus'?[...caucus,...duty]:[...duty,...caucus]),dutyNext])s=advance(s,id);return s;}
