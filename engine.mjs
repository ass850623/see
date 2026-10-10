import {roundOptions} from './chapter-two-round.mjs';
import {executionOptions} from './chapter-two-execution.mjs';
import {proposalOptions} from './chapter-two-proposal.mjs';
import {publicReviewOptions} from './chapter-two-public.mjs';
import {deliveryOptions,canReceiveVersions} from './chapter-two-delivery.mjs';
import {followupOptions} from './chapter-two-followup.mjs';
import {investigationOptions} from './chapter-two-investigation.mjs';
import {chapterTwoScenes,secondChapterOptions,secondChapterReaction,validSecondChapter} from './chapter-two.mjs';
import {mediaReaction} from './media-prep.mjs';
import {diplomacyReaction} from './diplomacy.mjs';
import {caucusReaction} from './caucus.mjs';
import {meetingReaction} from './night-meeting.mjs';
import {validFollowupPlan,followupPlanSummary} from './followup-plan.mjs';
import {correctionReaction} from './corrections.mjs';
import {hearingFollowupReaction} from './hearing-followup.mjs';
import {validPhaseTimes} from './playtime.mjs';
import {aftermathReaction} from './aftermath.mjs';
import {staffReaction,validStaffFlags} from './staff.mjs';
import {fieldReaction} from './fieldwork.mjs';
import {maintenanceReaction} from './maintenance.mjs';
import {reporterReaction} from './reporter.mjs';
import {initialStats,applyChoice} from './story.mjs';
import {chapterScenes,evidenceCatalog,taskCatalog,visits} from './chapter.mjs';
export const SAVE_PREFIX='mist-chapter-v1-';
export function newGame(){return {schemaVersion:1,chapter:'c01',scene:'office',pageIndex:0,playTimeMs:0,phaseTimesMs:{},stats:{...initialStats},relations:{yucheng:0,haining:0,anhe:0},flags:{},evidence:{},tasks:Object.fromEntries(Object.keys(taskCatalog).map(k=>[k,'pending'])),slots:3,visited:[],history:[],note:''};}
export function readNextPage(state){const max=chapterScenes[state.scene].beats?.length||0;if((state.pageIndex||0)>=max)throw new Error('已到選擇頁');return {...state,pageIndex:(state.pageIndex||0)+1};}
export function blockedReason(state,option){for(const id of option.requires||[]){const e=state.evidence[id];if(!e)return `尚未取得 ${id}`;if(!e.verified)return `${id} 尚未核實`;if(!e.authorized)return `${id} 未獲公開授權`;}return '';}
export function options(state){if(['c02RoundDesk','c02RoundStaff'].includes(state.scene))return roundOptions(state);if(['c02ExecutionDesk','c02WorkList'].includes(state.scene))return executionOptions(state);if(['c02ProposalDesk','c02StaffTerms','c02TermsReview'].includes(state.scene))return proposalOptions(state);if(state.scene==='c02PublicReview')return publicReviewOptions(state);if(state.scene==='c02Delivery')return deliveryOptions(state);if(state.scene==='c02Followup')return followupOptions(state);if(state.scene==='c02Investigate')return investigationOptions(state);if(state.scene==='c02Board')return secondChapterOptions(state);if(state.scene==='technician'&&state.flags.witnessConsent==='pressure')return chapterScenes.technician.choices.filter(c=>c.id!=='named');if(state.scene==='journalist'&&state.flags.reporterSource==='bargain')return chapterScenes.journalist.choices.filter(c=>c.id!=='interview');if(state.scene==='hub')return visits.filter(v=>!state.visited.includes(v.id)).map(v=>({id:v.id,text:v.title,next:v.id,effects:{}}));return chapterScenes[state.scene].choices;}
export function advance(state,id){const option=options(state).find(o=>o.id===id);if(!option)throw new Error('無效選項');if(blockedReason(state,option))throw new Error(blockedReason(state,option));const next=structuredClone(state);const scene=chapterScenes[state.scene];next.history.push({scene:state.scene,speaker:scene.speaker,text:[...(scene.beats||[]),scene.text,secondChapterReaction(state),reporterReaction(state,state.scene),maintenanceReaction(state,state.scene),fieldReaction(state,state.scene),staffReaction(state,state.scene),aftermathReaction(state,state.scene),hearingFollowupReaction(state,state.scene),caucusReaction(state,state.scene),diplomacyReaction(state,state.scene),mediaReaction(state,state.scene),correctionReaction(state,state.scene),state.scene==='postStaff'?followupPlanSummary(state):'',state.scene==='postStaff'?meetingReaction(state):''].filter(Boolean).join('\n\n'),choice:option.text});const e=option.effects;next.stats=applyChoice(next.stats,e.stats||{});Object.assign(next.flags,e.flags||{});Object.assign(next.tasks,e.tasks||{});for(const [key,value] of Object.entries(e.relations||{}))next.relations[key]=Math.max(-10,Math.min(10,next.relations[key]+value));for(const [key,value] of Object.entries(e.evidence||{}))next.evidence[key]={...next.evidence[key],...value};next.note=e.note||'';if(state.scene==='hub'){next.slots--;next.visited.push(option.id);}next.scene=option.next;next.pageIndex=0;if(next.scene==='c02RoundDesk'&&next.flags.c02RoundFiles&&next.flags.c02RoundStaff)next.scene='c02RoundReport';if(next.scene==='c02ProposalDesk'&&next.flags.c02BoundaryTerm&&next.flags.c02StaffTerm)next.scene='c02TermsReview';if(next.scene==='c02Followup'&&next.flags.c02FileDisposition&&next.flags.c02BarrierNext)next.scene='c02FollowupEnd';if(next.scene==='c02Investigate'&&next.flags.c02SourceNext&&next.flags.c02ReliefNext)next.scene='c02InvestigationEnd';if(next.scene==='hub'&&next.slots===0){next.scene='reconcile';for(const v of visits)if(v.task&&!next.visited.includes(v.id))next.tasks[v.task]='missed';if(!next.evidence.E03){next.evidence.E03={verified:true,authorized:true};next.note='正式調查簡報提供通訊摘要；技師個人訪談與維護文件尚未取得。';}next.evidence.E02.verified=true;}return next;}
const obj=x=>x&&typeof x==='object'&&!Array.isArray(x);
export function validState(s){if(!obj(s)||s.schemaVersion!==1||!['c01','c02'].includes(s.chapter)||!chapterScenes[s.scene]||(s.chapter==='c01'&&chapterTwoScenes[s.scene])||!obj(s.stats)||!obj(s.relations)||!obj(s.flags)||!obj(s.tasks)||!obj(s.evidence)||!Array.isArray(s.visited)||!Array.isArray(s.history)||typeof s.note!=='string')return false;
if(!Object.keys(initialStats).every(k=>Number.isFinite(s.stats[k])&&s.stats[k]>=0&&s.stats[k]<=100)||!['yucheng','haining','anhe'].every(k=>Number.isFinite(s.relations[k])&&s.relations[k]>=-10&&s.relations[k]<=10))return false;
if(!Number.isInteger(s.slots)||s.slots<0||s.slots>3||new Set(s.visited).size!==s.visited.length||s.visited.length!==3-s.slots||!s.visited.every(k=>visits.some(v=>v.id===k)))return false;
if(!Object.keys(taskCatalog).every(k=>['pending','active','complete','missed'].includes(s.tasks[k])))return false;
if(!Object.entries(s.evidence).every(([k,v])=>evidenceCatalog[k]&&obj(v)&&typeof v.verified==='boolean'&&typeof v.authorized==='boolean'))return false;
if(s.flags.handoffPage!==undefined&&!['0','1','2','3','4','5'].includes(s.flags.handoffPage))return false;
if(s.flags.handoffPriority!==undefined&&(!['source','relief'].includes(s.flags.handoffPriority)||s.flags.handoffPage!=='5'))return false;
if(!validSecondChapter(s))return false;
if(!validFollowupPlan(s))return false;
if(!validStaffFlags(s.flags))return false;
if(!Object.values(s.flags).every(v=>typeof v==='string'||typeof v==='boolean'))return false;
if(!s.history.every(h=>obj(h)&&chapterScenes[h.scene]&&['speaker','text','choice'].every(k=>typeof h[k]==='string')))return false;
if(['hub',...visits.map(v=>v.id),'reconcile','authorization','checkpoint'].includes(s.scene)&&!s.evidence.E02)return false;
if(s.playTimeMs!==undefined&&(!Number.isSafeInteger(s.playTimeMs)||s.playTimeMs<0))return false;
if(!validPhaseTimes(s.phaseTimesMs,s.playTimeMs||0))return false;
if(s.pageIndex!==undefined&&(!Number.isInteger(s.pageIndex)||s.pageIndex<0||s.pageIndex>(chapterScenes[s.scene].beats?.length||0)))return false;
if(s.scene==='hub'&&s.slots===0)return false;
if(['caucus','diplomacy','hearing1','clarify1','hearing2','clarify2','hearing3','night','postUnion','postPress','postStaff','chapterEnd'].includes(s.scene)&& (s.slots!==0||!s.evidence.E02?.verified||!s.evidence.E03?.verified))return false;
return true;}
export function decodeSave(raw){try{const data=JSON.parse(raw);if(!validState(data))return null;data.pageIndex??=0;data.playTimeMs??=0;data.phaseTimesMs??={};return data;}catch{return null;}}
export function writeSave(storage,slot,state){if(!['auto','1','2','3'].includes(slot)||!validState(state))throw new Error('無效存檔');storage.setItem(SAVE_PREFIX+slot,JSON.stringify(state));}
export function readSave(storage,slot){if(!['auto','1','2','3'].includes(slot))return null;return decodeSave(storage.getItem(SAVE_PREFIX+slot));}

export function startSecondChapter(state){
 if(!validState(state)||state.chapter!=='c01'||state.scene!=='chapterEnd')throw new Error('請先完成第一章');
 const next=structuredClone(state);next.chapter='c02';next.scene='c02Morning';next.pageIndex=0;next.flags.c02Started=true;next.note='故事第 2 日開始：原承諾、授權與案件紀錄保留。';
 next.history.push({scene:'chapterEnd',speaker:'林予澄',text:'第一章交接保留；進入第二章開場原型。',choice:'開始第二章開場。'});return next;
}

export function startSecondChapterInvestigation(state){
 if(!validState(state)||state.scene!=='c02End'||state.chapter!=='c02')throw new Error('請先完成第二章開場');
 const next=structuredClone(state);next.scene='c02Investigate';next.pageIndex=0;next.flags.c02InvestigationStarted=true;
 next.history.push({scene:'c02End',speaker:'林予澄',text:chapterScenes.c02End.text+'\n'+secondChapterReaction(state),choice:'接續第二章調查。'});return next;
}

export function startSecondChapterFollowup(state){
 if(!validState(state)||state.chapter!=='c02'||state.scene!=='c02InvestigationEnd')throw new Error('請先完成第二章初步調查');
 const next=structuredClone(state);next.scene='c02Followup';next.pageIndex=0;next.flags.c02FollowupStarted=true;
 next.history.push({scene:'c02InvestigationEnd',speaker:'林予澄',text:chapterScenes.c02InvestigationEnd.text+'\n'+secondChapterReaction(state),choice:'接續原卷申請與救助回訪。'});return next;
}

export function startSecondChapterDelivery(state){
 if(!validState(state)||state.chapter!=='c02'||state.scene!=='c02FollowupEnd')throw new Error('請先完成原卷申請與救助回訪');
 const next=structuredClone(state);next.scene='c02Delivery';next.pageIndex=0;next.flags.c02DeliveryStarted=true;
 if(canReceiveVersions(next))next.evidence.E07={verified:false,authorized:true};
 next.history.push({scene:'c02FollowupEnd',speaker:'林予澄',text:chapterScenes.c02FollowupEnd.text+'\n'+secondChapterReaction(state),choice:'接續文件交付核對與正式回覆。'});return next;
}

export function startSecondChapterPublic(state){
 if(!validState(state)||state.chapter!=='c02'||state.scene!=='c02DeliveryEnd')throw new Error('請先完成文件交付核對');
 const next=structuredClone(state);next.scene='c02SourceInquiry';next.pageIndex=0;next.flags.c02PublicStarted=true;
 next.history.push({scene:'c02DeliveryEnd',speaker:'林予澄',text:chapterScenes.c02DeliveryEnd.text+'\n'+secondChapterReaction(state),choice:'接續來源追問與公開補充說明。'});return next;
}

export function startSecondChapterReception(state){
 if(!validState(state)||state.chapter!=='c02'||state.scene!=='c02PublicEnd')throw new Error('請先完成補充說明審閱');
 const next=structuredClone(state);next.scene='c02CaucusReply';next.pageIndex=0;next.flags.c02ReceptionStarted=true;
 next.history.push({scene:'c02PublicEnd',speaker:'林予澄',text:chapterScenes.c02PublicEnd.text+'\n'+secondChapterReaction(state),choice:'接續黨團與記者回應。'});return next;
}

export function startSecondChapterProposal(state){
 if(!validState(state)||state.chapter!=='c02'||state.scene!=='c02ReceptionEnd')throw new Error('請先完成黨團與記者回應');
 const next=structuredClone(state);next.scene='c02ProposalDesk';next.pageIndex=0;next.flags.c02ProposalStarted=true;
 next.history.push({scene:'c02ReceptionEnd',speaker:'林予澄',text:chapterScenes.c02ReceptionEnd.text+'\n'+secondChapterReaction(state),choice:'接續具體提案與條件取捨。'});return next;
}

export function startSecondChapterExecution(state){
 if(!validState(state)||state.chapter!=='c02'||state.scene!=='c02ProposalEnd')throw new Error('請先完成具體提案審閱');
 const next=structuredClone(state);next.scene='c02ExecutionDesk';next.pageIndex=0;next.flags.c02ExecutionStarted=true;
 next.history.push({scene:'c02ProposalEnd',speaker:'林予澄',text:chapterScenes.c02ProposalEnd.text+'\n'+secondChapterReaction(state),choice:'接續工作約定執行與首輪回報。'});return next;
}

export function startSecondChapterRound(state){
 if(!validState(state)||state.chapter!=='c02'||state.scene!=='c02ExecutionEnd')throw new Error('請先完成首輪執行回報');
 const next=structuredClone(state);next.scene='c02RoundDesk';next.pageIndex=0;next.flags.c02RoundStarted=true;
 next.history.push({scene:'c02ExecutionEnd',speaker:'林予澄',text:chapterScenes.c02ExecutionEnd.text+'\n'+secondChapterReaction(state),choice:'接續文件與人手的第二輪處理。'});return next;
}
