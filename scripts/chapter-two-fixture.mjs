import {newGame,advance} from '../engine.mjs';
import {chooseReporterReply} from '../reporter.mjs';
import {chooseWitnessReply} from '../maintenance.mjs';
export function firstChapterFixture(storm=false){
 let s=newGame();const go=(...ids)=>{for(const id of ids)s=advance(s,id);};
 go('verify','depart','listen','respect','review','schedule','technician');
 s=chooseWitnessReply(s,'consent','legal');s=chooseWitnessReply(s,'support','followup');
 go('protect','family','process','journalist');s=chooseReporterReply(s,'correction','visible');
 go('interview','bounded','authorize','continue','amend','oversight');
 if(storm)go('clip','insist');else go('timeline');
 go('contract','safety','review','repair','transparent','prioritize');return s;
}
