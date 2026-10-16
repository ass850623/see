import {chapterFourScenes,fourthOptions,fourthReaction,validFourthChapter} from './chapter-four.mjs';
import {chapterThreeScenes,thirdChapterOptions,thirdChapterReaction,validThirdChapter} from './chapter-three.mjs';
import {endingOptions} from './chapter-two-ending.mjs';
import {stageOptions} from './chapter-two-stage.mjs';
import {inquiryOptions} from './chapter-two-inquiry.mjs';
import {readingOptions} from './chapter-two-reading.mjs';
import {accessOptions} from './chapter-two-access.mjs';
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
export function options(state){if(state.chapter==='c04')return fourthOptions(state);if(state.chapter==='c03')return thirdChapterOptions(state);if(state.scene==='c02NextChapterBrief')return endingOptions(state);if(['c02CheckReply','c02StageReview'].includes(state.scene))return stageOptions(state);if(['c02InternalAsk','c02QuestionDraft'].includes(state.scene))return inquiryOptions(state);if(['c02ReadingDesk','c02RestrictedRead'].includes(state.scene))return readingOptions(state);if(state.scene==='c02AccessTalk')return accessOptions(state);if(['c02RoundDesk','c02RoundStaff'].includes(state.scene))return roundOptions(state);if(['c02ExecutionDesk','c02WorkList'].includes(state.scene))return executionOptions(state);if(['c02ProposalDesk','c02StaffTerms','c02TermsReview'].includes(state.scene))return proposalOptions(state);if(state.scene==='c02PublicReview')return publicReviewOptions(state);if(state.scene==='c02Delivery')return deliveryOptions(state);if(state.scene==='c02Followup')return followupOptions(state);if(state.scene==='c02Investigate')return investigationOptions(state);if(state.scene==='c02Board')return secondChapterOptions(state);if(state.scene==='technician'&&state.flags.witnessConsent==='pressure')return chapterScenes.technician.choices.filter(c=>c.id!=='named');if(state.scene==='journalist'&&state.flags.reporterSource==='bargain')return chapterScenes.journalist.choices.filter(c=>c.id!=='interview');if(state.scene==='hub')return visits.filter(v=>!state.visited.includes(v.id)).map(v=>({id:v.id,text:v.title,next:v.id,effects:{}}));return chapterScenes[state.scene].choices;}
export function advance(state,id){const option=options(state).find(o=>o.id===id);if(!option)throw new Error('無效選項');if(blockedReason(state,option))throw new Error(blockedReason(state,option));const next=structuredClone(state);const scene=chapterScenes[state.scene];next.history.push({scene:state.scene,speaker:scene.speaker,text:[...(scene.beats||[]),scene.text,fourthReaction(state),thirdChapterReaction(state),secondChapterReaction(state),reporterReaction(state,state.scene),maintenanceReaction(state,state.scene),fieldReaction(state,state.scene),staffReaction(state,state.scene),aftermathReaction(state,state.scene),hearingFollowupReaction(state,state.scene),caucusReaction(state,state.scene),diplomacyReaction(state,state.scene),mediaReaction(state,state.scene),correctionReaction(state,state.scene),state.scene==='postStaff'?followupPlanSummary(state):'',state.scene==='postStaff'?meetingReaction(state):''].filter(Boolean).join('\n\n'),choice:option.text});const e=option.effects;next.stats=applyChoice(next.stats,e.stats||{});Object.assign(next.flags,e.flags||{});Object.assign(next.tasks,e.tasks||{});for(const [key,value] of Object.entries(e.relations||{}))next.relations[key]=Math.max(-10,Math.min(10,next.relations[key]+value));for(const [key,value] of Object.entries(e.evidence||{}))next.evidence[key]={...next.evidence[key],...value};next.note=e.note||'';if(state.scene==='hub'){next.slots--;next.visited.push(option.id);}next.scene=option.next;next.pageIndex=0;if(next.scene==='c02ReadingDesk'&&next.flags.c02ReadResult&&next.flags.c02DateResult)next.scene='c02ReadingReport';if(next.scene==='c02RoundDesk'&&next.flags.c02RoundFiles&&next.flags.c02RoundStaff)next.scene='c02RoundReport';if(next.scene==='c02ProposalDesk'&&next.flags.c02BoundaryTerm&&next.flags.c02StaffTerm)next.scene='c02TermsReview';if(next.scene==='c02Followup'&&next.flags.c02FileDisposition&&next.flags.c02BarrierNext)next.scene='c02FollowupEnd';if(next.scene==='c02Investigate'&&next.flags.c02SourceNext&&next.flags.c02ReliefNext)next.scene='c02InvestigationEnd';if(next.scene==='hub'&&next.slots===0){next.scene='reconcile';for(const v of visits)if(v.task&&!next.visited.includes(v.id))next.tasks[v.task]='missed';if(!next.evidence.E03){next.evidence.E03={verified:true,authorized:true};next.note='正式調查簡報提供通訊摘要；技師個人訪談與維護文件尚未取得。';}next.evidence.E02.verified=true;}return next;}
const obj=x=>x&&typeof x==='object'&&!Array.isArray(x);
export function validState(s){if(!obj(s)||s.schemaVersion!==1||!['c01','c02','c03','c04'].includes(s.chapter)||!chapterScenes[s.scene]||(s.chapter!=='c04'&&chapterFourScenes[s.scene])||(s.chapter==='c01'&&(chapterTwoScenes[s.scene]||chapterThreeScenes[s.scene]))||(s.chapter==='c02'&&chapterThreeScenes[s.scene])||!obj(s.stats)||!obj(s.relations)||!obj(s.flags)||!obj(s.tasks)||!obj(s.evidence)||!Array.isArray(s.visited)||!Array.isArray(s.history)||typeof s.note!=='string')return false;
// Do not accept progress flags for chapters that have not been implemented.
if(Object.keys(s.flags).some(k=>/^c\d{2}/.test(k)&&!['c02','c03','c04'].includes(k.slice(0,3))))return false;
if(!Object.keys(initialStats).every(k=>Number.isFinite(s.stats[k])&&s.stats[k]>=0&&s.stats[k]<=100)||!['yucheng','haining','anhe'].every(k=>Number.isFinite(s.relations[k])&&s.relations[k]>=-10&&s.relations[k]<=10))return false;
if(!Number.isInteger(s.slots)||s.slots<0||s.slots>3||new Set(s.visited).size!==s.visited.length||s.visited.length!==3-s.slots||!s.visited.every(k=>visits.some(v=>v.id===k)))return false;
if(!Object.keys(taskCatalog).every(k=>['pending','active','complete','missed'].includes(s.tasks[k])))return false;
if(!Object.entries(s.evidence).every(([k,v])=>evidenceCatalog[k]&&obj(v)&&typeof v.verified==='boolean'&&typeof v.authorized==='boolean'))return false;
if(s.flags.handoffPage!==undefined&&!['0','1','2','3','4','5'].includes(s.flags.handoffPage))return false;
if(s.flags.handoffPriority!==undefined&&(!['source','relief'].includes(s.flags.handoffPriority)||s.flags.handoffPage!=='5'))return false;
if(!validFourthChapter(s))return false;
if(!validThirdChapter(s.chapter==='c04'?{...s,chapter:'c03',scene:'c03ChapterEnd'}:s))return false;
// In chapter three, validate the retained chapter-two handoff at its completed scene.
// New chapter-three flags are checked separately; chapter-two snapshots remain canonical.
if(!validSecondChapter(['c03','c04'].includes(s.chapter)?{...s,chapter:'c02',scene:'c02ChapterEnd'}:s))return false;
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

export function startSecondChapterAccess(state){
 if(!validState(state)||state.chapter!=='c02'||state.scene!=='c02RoundEnd')throw new Error('請先完成第二輪處理');
 const next=structuredClone(state);next.scene='c02AccessTalk';next.pageIndex=0;next.flags.c02AccessStarted=true;
 next.history.push({scene:'c02RoundEnd',speaker:'林予澄',text:chapterScenes.c02RoundEnd.text+'\n'+secondChapterReaction(state),choice:'接續原卷交涉與來源回信。'});return next;
}

export function startSecondChapterReading(state){
 if(!validState(state)||state.chapter!=='c02'||state.scene!=='c02AccessEnd')throw new Error('請先完成原卷交涉與來源回信');
 const next=structuredClone(state);next.scene='c02ReadingDesk';next.pageIndex=0;next.flags.c02ReadingStarted=true;
 next.history.push({scene:'c02AccessEnd',speaker:'林予澄',text:chapterScenes.c02AccessEnd.text+'\n'+secondChapterReaction(state),choice:'接續受限閱覽與日期交叉核對。'});return next;
}

export function startSecondChapterInquiry(state){
 if(!validState(state)||state.chapter!=='c02'||state.scene!=='c02ReadingEnd')throw new Error('請先完成受限閱覽與日期核對');
 const next=structuredClone(state);next.scene='c02InternalAsk';next.pageIndex=0;next.flags.c02InquiryStarted=true;
 next.history.push({scene:'c02ReadingEnd',speaker:'林予澄',text:chapterScenes.c02ReadingEnd.text+'\n'+secondChapterReaction(state),choice:'接續內部追問與調查問題整理。'});return next;
}

export function startSecondChapterStage(state){
 if(!validState(state)||state.chapter!=='c02'||state.scene!=='c02InquiryEnd')throw new Error('請先完成內部問題稿審閱');
 const next=structuredClone(state);next.scene='c02CheckReply';next.pageIndex=0;next.flags.c02StageStarted=true;
 next.history.push({scene:'c02InquiryEnd',speaker:'林予澄',text:chapterScenes.c02InquiryEnd.text+'\n'+secondChapterReaction(state),choice:'接續內部核對回覆與第二章階段整理。'});return next;
}

export function startSecondChapterEnding(state){
 if(!validState(state)||state.chapter!=='c02'||state.scene!=='c02StageEnd')throw new Error('請先保存第二章階段整理');
 const next=structuredClone(state);next.scene='c02ClosingNotice';next.pageIndex=0;next.flags.c02EndingStarted=true;
 next.history.push({scene:'c02StageEnd',speaker:'林予澄',text:chapterScenes.c02StageEnd.text+'\n'+secondChapterReaction(state),choice:'接續第二章收束與第三章準備。'});return next;
}

export function startThirdChapter(state){
 if(!validState(state)||state.chapter!=='c02'||state.scene!=='c02ChapterEnd')throw new Error('請先保存第二章章末');
 const next=structuredClone(state);next.chapter='c03';next.scene='c03Morning';next.pageIndex=0;next.flags.c03Started=true;next.note='故事第 3 日開始：原準備頁、案件與承諾期限保留。';
 next.history.push({scene:'c02ChapterEnd',speaker:'林予澄',text:chapterScenes.c02ChapterEnd.text+'\n'+secondChapterReaction(state),choice:'開始第三章追加詢問開場。'});return next;
}

export function startThirdChapterReply(state){
 if(!validState(state)||state.chapter!=='c03'||state.scene!=='c03OpeningEnd')throw new Error('請先完成第三章第一輪答覆審閱');
 const next=structuredClone(state);next.scene='c03CouncilReply';next.pageIndex=0;next.flags.c03ReplyStarted=true;next.note='本輪議會回應與正式窗口追問開始，原答覆與案件狀態保留。';
 next.history.push({scene:'c03OpeningEnd',speaker:'林予澄',text:chapterScenes.c03OpeningEnd.text+'\n'+thirdChapterReaction(state),choice:'接續議會回應與正式窗口追問。'});return next;
}

export function startThirdChapterTracking(state){
 if(!validState(state)||state.chapter!=='c03'||state.scene!=='c03ReplyEnd')throw new Error('請先保存議會回應與窗口追問');
 const next=structuredClone(state);next.scene='c03TrackDesk';next.pageIndex=0;next.flags.c03TrackingStarted=true;next.note='分項追蹤開始；原實際送件、答覆與利益立場保留。';
 next.history.push({scene:'c03ReplyEnd',speaker:'林予澄',text:chapterScenes.c03ReplyEnd.text+'\n'+thirdChapterReaction(state),choice:'接續分項窗口追蹤與利益協調。'});return next;
}

export function startThirdChapterManuscript(state){
 if(!validState(state)||state.chapter!=='c03'||state.scene!=='c03TrackEnd')throw new Error('請先保存分項追蹤與利益協調');
 const next=structuredClone(state);next.scene='c03GapDesk';next.pageIndex=0;next.flags.c03ManuscriptStarted=true;next.note='案件缺口與稿件審閱開始，原文件、協調狀態與期限保留。';
 next.history.push({scene:'c03TrackEnd',speaker:'林予澄',text:chapterScenes.c03TrackEnd.text+'\n'+thirdChapterReaction(state),choice:'接續案件缺口與共同稿審閱。'});return next;
}

export function startThirdChapterRevision(state){
 if(!validState(state)||state.chapter!=='c03'||state.scene!=='c03ManuscriptEnd')throw new Error('請先保存案件缺口稿與審閱結果');
 const next=structuredClone(state);next.scene='c03RevisionDesk';next.pageIndex=0;next.flags.c03RevisionStarted=true;next.note='本輪另存改稿與發布前確認，原稿與原案件狀態保留。';
 next.history.push({scene:'c03ManuscriptEnd',speaker:'林予澄',text:chapterScenes.c03ManuscriptEnd.text+'\n'+thirdChapterReaction(state),choice:'接續改稿與發布前確認。'});return next;
}

export function startThirdChapterPublication(state){
 if(!validState(state)||state.chapter!=='c03'||state.scene!=='c03RevisionEnd')throw new Error('請先完成改稿與發布前確認');
 const next=structuredClone(state);next.scene='c03PublicationDesk';next.pageIndex=0;next.flags.c03PublicationStarted=true;next.note='本輪發布須另行決定，原稿、確認版本與案件狀態保留。';
 next.history.push({scene:'c03RevisionEnd',speaker:'林予澄',text:chapterScenes.c03RevisionEnd.text+'\n'+thirdChapterReaction(state),choice:'接續發布決定與角色反應。'});return next;
}

export function startThirdChapterFollowup(state){
 if(!validState(state)||state.chapter!=='c03'||state.scene!=='c03PublicationEnd')throw new Error('請先保存發布決定與角色反應');
 const next=structuredClone(state);next.scene='c03FollowupDesk';next.pageIndex=0;next.flags.c03FollowupStarted=true;next.note='本輪正式追問與重審另存，原公開／內部版本與案件紀錄保留。';
 next.history.push({scene:'c03PublicationEnd',speaker:'林予澄',text:chapterScenes.c03PublicationEnd.text+'\n'+thirdChapterReaction(state),choice:'接續後續追問與留稿重審。'});return next;
}

export function startThirdChapterRound(state){
 if(!validState(state)||state.chapter!=='c03'||state.scene!=='c03FollowupEnd')throw new Error('請先保存後續追問與留稿重審');
 const next=structuredClone(state);next.scene='c03RoundDesk';next.pageIndex=0;next.flags.c03RoundStarted=true;next.note='第二輪答覆與本輪稿件另存，原確認與公開紀錄保留。';
 next.history.push({scene:'c03FollowupEnd',speaker:'林予澄',text:chapterScenes.c03FollowupEnd.text+'\n'+thirdChapterReaction(state),choice:'接續第二輪答覆與稿件處理。'});return next;
}

export function startThirdChapterReception(state){
 if(!validState(state)||state.chapter!=='c03'||state.scene!=='c03RoundEnd')throw new Error('請先保存第二輪答覆與稿件處理');
 const next=structuredClone(state);next.scene='c03ReceptionPress';next.pageIndex=0;next.flags.c03ReceptionStarted=true;next.note='新版追問與分案協商另存，原公開／內部版本與有效授權保留。';
 next.history.push({scene:'c03RoundEnd',speaker:'林予澄',text:chapterScenes.c03RoundEnd.text+'\n'+thirdChapterReaction(state),choice:'接續新版追問與跨方協商。'});return next;
}

export function startThirdChapterConfirmation(state){
 if(!validState(state)||state.chapter!=='c03'||state.scene!=='c03ReceptionEnd')throw new Error('請先保存新版追問與跨方協商');
 const next=structuredClone(state);next.scene='c03ConfirmationDesk';next.pageIndex=0;next.flags.c03ConfirmationStarted=true;next.note='外方回函、國內未決與限定安排另存，原提案與案件紀錄保留。';
 next.history.push({scene:'c03ReceptionEnd',speaker:'林予澄',text:chapterScenes.c03ReceptionEnd.text+'\n'+thirdChapterReaction(state),choice:'接續外方確認與國內未決。'});return next;
}

export function startThirdChapterExecution(state){
 if(!validState(state)||state.chapter!=='c03'||state.scene!=='c03ConfirmationEnd')throw new Error('請先保存外方確認與國內未決');
 const next=structuredClone(state);next.scene='c03ExecutionDesk';next.pageIndex=0;next.flags.c03ExecutionStarted=true;next.note='故事第 4 日開始，方法執行與國內後續另存，原邀請、公開原文與期限保留。';
 next.history.push({scene:'c03ConfirmationEnd',speaker:'林予澄',text:chapterScenes.c03ConfirmationEnd.text+'\n'+thirdChapterReaction(state),choice:'接續方法執行與國內後續。'});return next;
}

export function startThirdChapterReport(state){
 if(!validState(state)||state.chapter!=='c03'||state.scene!=='c03ExecutionEnd')throw new Error('請先完成方法執行與國內後續');
 const next=structuredClone(state);next.scene='c03ReportDesk';next.pageIndex=0;next.flags.c03ReportStarted=true;next.note='故事第 4 日午後進度稿與程序交涉另存，舊公開原文與署名保留。';
 next.history.push({scene:'c03ExecutionEnd',speaker:'林予澄',text:chapterScenes.c03ExecutionEnd.text+'\n'+thirdChapterReaction(state),choice:'接續成果回報與未決事項交涉。'});return next;
}

export function startThirdChapterDayFive(state){
 if(!validState(state)||state.chapter!=='c03'||state.scene!=='c03ReportEnd')throw new Error('請先完成成果回報與未決交涉');
 const next=structuredClone(state);next.scene='c03DayFiveDesk';next.pageIndex=0;next.flags.c03DayFiveStarted=true;next.note='故事第 5 日方法安排與有效申請另存，舊公開稿、署名與承諾期限保留。';
 next.history.push({scene:'c03ReportEnd',speaker:'林予澄',text:chapterScenes.c03ReportEnd.text+'\n'+thirdChapterReaction(state),choice:'接續第 5 日方法安排與有效申請。'});return next;
}

export function startThirdChapterProcessing(state){
 if(!validState(state)||state.chapter!=='c03'||state.scene!=='c03DayFiveEnd')throw new Error('請先完成第 5 日方法安排與有效申請');
 const next=structuredClone(state);next.scene='c03ProcessingDesk';next.pageIndex=0;next.flags.c03ProcessingStarted=true;next.note='第 5 日午後申請處理與缺件另存，舊公開原文、資料授權與期限保留。';
 next.history.push({scene:'c03DayFiveEnd',speaker:'林予澄',text:chapterScenes.c03DayFiveEnd.text+'\n'+thirdChapterReaction(state),choice:'接續申請處理與缺件追蹤。'});return next;
}

export function startThirdChapterMaterials(state){
 if(!validState(state)||state.chapter!=='c03'||state.scene!=='c03ProcessingEnd')throw new Error('請先完成申請處理與缺件追蹤');
 const next=structuredClone(state);next.scene='c03MaterialsDesk';next.pageIndex=0;next.flags.c03MaterialsStarted=true;next.note='第 5 日傍晚材料回報與持續交涉另存，舊公開原文與家庭決定保留。';
 next.history.push({scene:'c03ProcessingEnd',speaker:'林予澄',text:chapterScenes.c03ProcessingEnd.text+'\n'+thirdChapterReaction(state),choice:'接續新材料回報與持續交涉。'});return next;
}

export function startThirdChapterScope(state){
 if(!validState(state)||state.chapter!=='c03'||state.scene!=='c03MaterialsEnd')throw new Error('請先完成新材料回報與持續交涉');
 const next=structuredClone(state);next.scene='c03ScopeDesk';next.pageIndex=0;next.flags.c03ScopeStarted=true;next.note='故事第 6 日範圍補列與議會問題另存，舊公開原文、授權與承諾期限保留。';
 next.history.push({scene:'c03MaterialsEnd',speaker:'林予澄',text:chapterScenes.c03MaterialsEnd.text+'\n'+thirdChapterReaction(state),choice:'接續範圍補列與議會整理。'});return next;
}

export function startThirdChapterHandling(state){
 if(!validState(state)||state.chapter!=='c03'||state.scene!=='c03ScopeEnd')throw new Error('請先完成範圍補列與議會整理');
 const next=structuredClone(state);next.scene='c03HandlingDesk';next.pageIndex=0;next.flags.c03HandlingStarted=true;next.note='第 6 日範圍處理與議會窗口另存，第 7 日邀請不當作已執行。';
 next.history.push({scene:'c03ScopeEnd',speaker:'林予澄',text:chapterScenes.c03ScopeEnd.text+'\n'+thirdChapterReaction(state),choice:'接續範圍處理與議會窗口回覆。'});return next;
}

export function startThirdChapterDaySeven(state){
 if(!validState(state)||state.chapter!=='c03'||state.scene!=='c03HandlingEnd')throw new Error('請先完成範圍處理與議會窗口回覆');
 const next=structuredClone(state);next.scene='c03DaySevenDesk';next.pageIndex=0;next.flags.c03DaySevenStarted=true;next.note='故事第 7 日實際安排與本版答覆另存，舊公開原文、授權與期限保留。';
 next.history.push({scene:'c03HandlingEnd',speaker:'林予澄',text:chapterScenes.c03HandlingEnd.text+'\n'+thirdChapterReaction(state),choice:'接續第 7 日安排與書面答覆準備。'});return next;
}

export function startThirdChapterDeadline(state){
 if(!validState(state)||state.chapter!=='c03'||state.scene!=='c03DaySevenEnd')throw new Error('請先完成第 7 日安排與書面答覆準備');
 const next=structuredClone(state);next.scene='c03DeadlineDesk';next.pageIndex=0;next.flags.c03DeadlineStarted=true;next.note='答覆追蹤與內部期限工作表另存，原承諾日期與狀態保留。';
 next.history.push({scene:'c03DaySevenEnd',speaker:'林予澄',text:chapterScenes.c03DaySevenEnd.text+'\n'+thirdChapterReaction(state),choice:'接續答覆追蹤與期限前整理。'});return next;
}

export function startThirdChapterPreReport(state){
 if(!validState(state)||state.chapter!=='c03'||state.scene!=='c03DeadlineEnd')throw new Error('請先完成答覆追蹤與期限前整理');
 const next=structuredClone(state);next.scene=state.flags.c03DeadlineNext==='contact'?'c03WaitDesk':'c03PreReportDesk';next.pageIndex=0;next.flags.c03PreReportStarted=true;next.note='期限前新稿與單項聯絡另存，原優先決定本輪先後順序。';
 next.history.push({scene:'c03DeadlineEnd',speaker:'林予澄',text:chapterScenes.c03DeadlineEnd.text+'\n'+thirdChapterReaction(state),choice:'接續期限前回報與等待者聯絡。'});return next;
}

export function startThirdChapterSchedule(state){
 if(!validState(state)||state.chapter!=='c03'||state.scene!=='c03PreReportEnd')throw new Error('請先完成期限前回報與等待者聯絡');
 const next=structuredClone(state);next.scene='c03ScheduleDesk';next.pageIndex=0;next.flags.c03ScheduleStarted=true;next.note='時程回覆與原承諾缺口內部另存，原日期、狀態與公開稿保留。';
 next.history.push({scene:'c03PreReportEnd',speaker:'林予澄',text:chapterScenes.c03PreReportEnd.text+'\n'+thirdChapterReaction(state),choice:'接續時程回覆與承諾缺口核對。'});return next;
}

export function startThirdChapterGapReply(state){
 if(!validState(state)||state.chapter!=='c03'||state.scene!=='c03ScheduleEnd')throw new Error('請先完成時程回覆與承諾缺口核對');
 const next=structuredClone(state);next.scene=state.flags.c03ScheduleNext==='window'?'c03GapQueryDesk':'c03GapReplyDesk';next.pageIndex=0;next.flags.c03GapReplyStarted=true;next.note='單項缺口回覆與本版補問另存，原优先決定先後。'.replace('优','優');
 next.history.push({scene:'c03ScheduleEnd',speaker:'林予澄',text:chapterScenes.c03ScheduleEnd.text+'\n'+thirdChapterReaction(state),choice:'接續缺口回覆與窗口補問。'});return next;
}

export function startThirdChapterGapFollow(state){
 if(!validState(state)||state.chapter!=='c03'||state.scene!=='c03GapReplyEnd')throw new Error('請先完成缺口回覆與窗口補問');
 const next=structuredClone(state);next.scene=state.flags.c03GapReplyNext==='query'?'c03QueryFollowDesk':'c03GapFollowDesk';next.pageIndex=0;next.flags.c03GapFollowStarted=true;next.note='單項回信與本版補問處理另存，保留原日期與公開原文。';
 next.history.push({scene:'c03GapReplyEnd',speaker:'林予澄',text:chapterScenes.c03GapReplyEnd.text+'\n'+thirdChapterReaction(state),choice:'接續缺口回信與補問處理。'});return next;
}

export function startThirdChapterResponsibility(state){
 if(!validState(state)||state.chapter!=='c03'||state.scene!=='c03GapFollowEnd')throw new Error('請先完成缺口回信與補問處理');
 const next=structuredClone(state);next.scene='c03ResponsibilityDesk';next.pageIndex=0;next.flags.c03ResponsibilityStarted=true;next.note='責任窗口核對與本版補列另存，原日期與公開原文保留。';
 next.history.push({scene:'c03GapFollowEnd',speaker:'林予澄',text:chapterScenes.c03GapFollowEnd.text+'\n'+thirdChapterReaction(state),choice:'接續責任窗口核對與補列整理。'});return next;
}

export function startThirdChapterPreclose(state){
 if(!validState(state)||state.chapter!=='c03'||state.scene!=='c03ResponsibilityEnd')throw new Error('請先完成責任窗口核對與補列整理');
 const next=structuredClone(state);next.scene='c03PrecloseDesk';next.pageIndex=0;next.flags.c03PrecloseStarted=true;next.note='補列處理與內部期限前收束表另存，原日期與公開原文保留。';
 next.history.push({scene:'c03ResponsibilityEnd',speaker:'林予澄',text:chapterScenes.c03ResponsibilityEnd.text+'\n'+thirdChapterReaction(state),choice:'接續補列處理與期限前收束。'});return next;
}

export function startThirdChapterDayEight(state){
 if(!validState(state)||state.chapter!=='c03'||state.scene!=='c03PrecloseEnd')throw new Error('請先完成補列處理與期限前收束');
 const next=structuredClone(state);next.scene=state.flags.c03PrecloseNext==='contact'?'c03DayEightWaitDesk':'c03DayEightDesk';next.pageIndex=0;next.flags.c03DayEightStarted=true;next.note='故事第 8 日開始，原期限已到，新稿與本日單項聯絡另存。';
 next.history.push({scene:'c03PrecloseEnd',speaker:'林予澄',text:chapterScenes.c03PrecloseEnd.text+'\n'+thirdChapterReaction(state),choice:'接續第 8 日開場與到期回報。'});return next;
}

export function startThirdChapterDueTrack(state){
 if(!validState(state)||state.chapter!=='c03'||state.scene!=='c03DayEightEnd')throw new Error('請先完成第 8 日開場與到期回報');
 const next=structuredClone(state);next.scene='c03DueTrackDesk';next.pageIndex=0;next.flags.c03DueTrackStarted=true;next.note='第 8 日實際回覆與到期缺口另存，不補記為期限前履行。';
 next.history.push({scene:'c03DayEightEnd',speaker:'林予澄',text:chapterScenes.c03DayEightEnd.text+'\n'+thirdChapterReaction(state),choice:'接續第 8 日回覆與到期缺口追蹤。'});return next;
}

export function startThirdChapterDueReply(state){
 if(!validState(state)||state.chapter!=='c03'||state.scene!=='c03DueTrackEnd')throw new Error('請先完成第 8 日回覆與到期缺口追蹤');
 const next=structuredClone(state);next.scene=state.flags.c03DueTrackNext==='window'?'c03DueQueryDesk':'c03DueReplyDesk';next.pageIndex=0;next.flags.c03DueReplyStarted=true;next.note='第 8 日單項到期回覆與責任追問另存，原優先決定先後。';
 next.history.push({scene:'c03DueTrackEnd',speaker:'林予澄',text:chapterScenes.c03DueTrackEnd.text+'\n'+thirdChapterReaction(state),choice:'接續到期缺口回覆與責任追問。'});return next;
}

export function startThirdChapterDueFollow(state){
 if(!validState(state)||state.chapter!=='c03'||state.scene!=='c03DueReplyEnd')throw new Error('請先完成到期缺口回覆與責任追問');
 const next=structuredClone(state);next.scene=state.flags.c03DueReplyNext==='query'?'c03DueWindowDesk':'c03DueFollowDesk';next.pageIndex=0;next.flags.c03DueFollowStarted=true;next.note='第 8 日到期回信與責任窗口回覆另存，原日期與公開稿保留。';
 next.history.push({scene:'c03DueReplyEnd',speaker:'林予澄',text:chapterScenes.c03DueReplyEnd.text+'\n'+thirdChapterReaction(state),choice:'接續到期回信與責任窗口回覆。'});return next;
}

export function startThirdChapterDueClose(state){
 if(!validState(state)||state.chapter!=='c03'||state.scene!=='c03DueFollowEnd')throw new Error('請先完成到期回信與責任窗口回覆');
 const next=structuredClone(state);next.scene='c03DueCloseDesk';next.pageIndex=0;next.flags.c03DueCloseStarted=true;next.note='第 8 日責任核對與內部未決收束另存，原日期與公開原文保留。';
 next.history.push({scene:'c03DueFollowEnd',speaker:'林予澄',text:chapterScenes.c03DueFollowEnd.text+'\n'+thirdChapterReaction(state),choice:'接續第 8 日責任核對與未決收束。'});return next;
}

export function startThirdChapterEnding(state){
 if(!validState(state)||state.chapter!=='c03'||state.scene!=='c03DueCloseEnd')throw new Error('請先完成第 8 日責任核對與未決收束');
 const next=structuredClone(state);next.scene='c03EndingDesk';next.pageIndex=0;next.flags.c03EndingStarted=true;next.note='第三章章末核對與第四章內部準備開始，原案件紀錄與期限保留。';
 next.history.push({scene:'c03DueCloseEnd',speaker:'林予澄',text:chapterScenes.c03DueCloseEnd.text+'\n'+thirdChapterReaction(state),choice:'接續第三章章末核對與第四章準備。'});return next;
}

export function startFourthChapter(state){
 if(!validState(state)||state.chapter!=='c03'||state.scene!=='c03ChapterEnd')throw new Error('請先完成第三章章末與第四章準備審閱');
 const next=structuredClone(state);next.chapter='c04';next.scene='c04Morning';next.pageIndex=0;next.flags.c04Started=true;next.flags.c04Handoff=state.flags.c03NextBrief;next.note='故事第 9 日開始：第三章章末原文與優先方向保留，原期限不重設。';
 next.history.push({scene:state.scene,speaker:chapterScenes[state.scene].speaker,text:state.flags.c03EndingBrief,choice:'開始第四章開場。'});return next;
}

export function startFourthChapterContact(state){
 if(!validState(state)||state.chapter!=='c04'||state.scene!=='c04OpeningEnd')throw new Error('請先保存第四章開場與行動稿審閱');
 const next=structuredClone(state);next.scene='c04ContactDesk';next.pageIndex=0;next.flags.c04ContactStarted=true;next.note='本輪正式接洽另存，早上待辦或留稿未自動送交，原期限與公開原文保留。';
 next.history.push({scene:state.scene,speaker:chapterScenes[state.scene].speaker,text:state.flags.c04Record,choice:'接續第四章正式接洽與窗口回應。'});return next;
}

export function startFourthChapterReturn(state){
 if(!validState(state)||state.chapter!=='c04'||state.scene!=='c04ContactEnd')throw new Error('請先保存第四章正式接洽與窗口回應');
 const next=structuredClone(state);next.scene=state.flags.c04ContactNext==='window'?'c04ReturnWindowDesk':'c04ReturnVisitDesk';next.pageIndex=0;next.flags.c04ReturnStarted=true;next.note='依已選優先順序開始窗口後續與在地回訪；原送件、公開原文與期限保留。';
 next.history.push({scene:state.scene,speaker:chapterScenes[state.scene].speaker,text:state.flags.c04ContactBrief,choice:'接續第四章窗口後續與在地回訪。'});return next;
}

export function startFourthChapterPreparation(state){
 if(!validState(state)||state.chapter!=='c04'||state.scene!=='c04ReturnEnd')throw new Error('請先保存第四章窗口後續與在地回訪');
 const next=structuredClone(state);next.scene=state.flags.c04ReturnNext==='list'?'c04PrepListDesk':'c04PrepReadyDesk';next.pageIndex=0;next.flags.c04PrepStarted=true;next.note='依原優先順序準備清單與現場內部稿，原送件、到場紀錄與期限保留。';
 next.history.push({scene:state.scene,speaker:chapterScenes[state.scene].speaker,text:state.flags.c04ReturnBrief,choice:'接續第四章清單與現場應變準備。'});return next;
}

export function startFourthChapterVerification(state){
 if(!validState(state)||state.chapter!=='c04'||state.scene!=='c04PrepEnd')throw new Error('請先保存第四章兩份準備稿與擬分工');
 const next=structuredClone(state);next.scene=state.flags.c04PrepNext==='verify'?'c04VerifyListDesk':'c04VerifyFieldDesk';next.pageIndex=0;next.flags.c04VerifyStarted=true;next.note='依原優先順序執行或暫緩清單與現場核對，原稿、觀察與期限保留。';
 next.history.push({scene:state.scene,speaker:chapterScenes[state.scene].speaker,text:state.flags.c04PrepBrief,choice:'接續第四章現場核對與應變分工執行。'});return next;
}

export function startFourthChapterNight(state){
 if(!validState(state)||state.chapter!=='c04'||state.scene!=='c04VerifyEnd')throw new Error('請先保存第四章現場核對與分工執行');
 const next=structuredClone(state);next.scene=state.flags.c04VerifyNext==='files'?'c04NightListDesk':'c04NightDutyDesk';next.pageIndex=0;next.flags.c04NightStarted=true;next.note='故事第 9 日進入夜間：按原優先順序處理清單與值班聯絡，停電尚未發生。';
 next.history.push({scene:state.scene,speaker:chapterScenes[state.scene].speaker,text:state.flags.c04VerifyBrief,choice:'接續第四章夜間值班與停電事件開場。'});return next;
}

export function startFourthChapterInitial(state){
 if(!validState(state)||state.chapter!=='c04'||state.scene!=='c04NightEnd')throw new Error('請先保存第四章夜間值班與停電開場');
 const next=structuredClone(state);next.scene='c04InitialSourceDesk';next.pageIndex=0;next.flags.c04InitialStarted=true;next.note='本輪初報、來源核對與工會協調另存，原通報與公開版本不覆寫。';
 next.history.push({scene:state.scene,speaker:chapterScenes[state.scene].speaker,text:state.flags.c04NightBrief,choice:'接續第四章停電初報與現場協調。'});return next;
}

export function startFourthChapterTriage(state){
 if(!validState(state)||state.chapter!=='c04'||state.scene!=='c04InitialEnd')throw new Error('請先保存第四章停電初報與現場協調');
 const next=structuredClone(state);next.scene=state.flags.c04InitialNext==='window'?'c04TriageWindowDesk':'c04TriagePeopleDesk';next.pageIndex=0;next.flags.c04TriageStarted=true;next.note='依原優先順序處理窗口與需求分流，初報原文與前輪協調不覆寫。';
 next.history.push({scene:state.scene,speaker:chapterScenes[state.scene].speaker,text:state.flags.c04InitialBrief,choice:'接續第四章停電回覆與需求分流。'});return next;
}

export function startFourthChapterAccess(state){
 if(!validState(state)||state.chapter!=='c04'||state.scene!=='c04TriageEnd')throw new Error('請先保存第四章停電回覆與需求分流');
 const next=structuredClone(state);next.scene=state.flags.c04TriageNext==='access'?'c04AccessDesk':'c04AccessHandoffDesk';next.pageIndex=0;next.flags.c04AccessStarted=true;next.note='依原優先順序追通行問題與安排內部承接，交班當時版本不隨後來回覆改寫。';
 next.history.push({scene:state.scene,speaker:chapterScenes[state.scene].speaker,text:state.flags.c04TriageBrief,choice:'接續第四章通行追問與夜間交班。'});return next;
}

export function startFourthChapterUpdate(state){
 if(!validState(state)||state.chapter!=='c04'||state.scene!=='c04AccessEnd')throw new Error('請先保存第四章通行追問與夜間交班');
 const next=structuredClone(state);next.scene=state.flags.c04AccessNext==='updates'?'c04UpdateDesk':'c04UpdateFieldDesk';next.pageIndex=0;next.flags.c04UpdateStarted=true;next.note='依原優先順序核對新公告與電話回報，原通報、初報及交班原版不覆寫。';
 next.history.push({scene:state.scene,speaker:chapterScenes[state.scene].speaker,text:state.flags.c04AccessBrief,choice:'接續第四章夜間公告更新與現場回報。'});return next;
}

export function startFourthChapterProgress(state){
 if(!validState(state)||state.chapter!=='c04'||state.scene!=='c04UpdateEnd')throw new Error('請先保存第四章夜間公告更新與現場回報');
 const next=structuredClone(state);next.scene=state.flags.c04UpdateNext==='statement'?'c04ProgressStatementDesk':'c04ProgressTrafficDesk';next.pageIndex=0;next.flags.c04ProgressStarted=true;next.note='依原優先順序準備獨立進展說明與追蹤通行，發布或留稿原文不隨後來回覆改寫。';
 next.history.push({scene:state.scene,speaker:chapterScenes[state.scene].speaker,text:state.flags.c04UpdateBrief,choice:'接續第四章停電進展說明與通行追蹤。'});return next;
}

export function startFourthChapterClose(state){
 if(!validState(state)||state.chapter!=='c04'||state.scene!=='c04ProgressEnd')throw new Error('請先保存第四章停電進展說明與通行追蹤');
 const next=structuredClone(state);next.scene=state.flags.c04ProgressNext==='access'?'c04CloseTrafficDesk':'c04CloseTableDesk';next.pageIndex=0;next.flags.c04CloseStarted=true;next.note='依原優先順序處理通行與夜間未決表；內部收束不自動結案、跨日或改寫公開原文。';
 next.history.push({scene:state.scene,speaker:chapterScenes[state.scene].speaker,text:state.flags.c04ProgressBrief,choice:'接續第四章通行回覆與夜間收束。'});return next;
}
