import {fieldReaction} from './fieldwork.mjs';
import {maintenanceReaction} from './maintenance.mjs';
import {reporterReaction} from './reporter.mjs';
import {initialStats,applyChoice} from './story.mjs';
import {chapterScenes,evidenceCatalog,taskCatalog,visits} from './chapter.mjs';
export const SAVE_PREFIX='mist-chapter-v1-';
export function newGame(){return {schemaVersion:1,chapter:'c01',scene:'office',pageIndex:0,playTimeMs:0,stats:{...initialStats},relations:{yucheng:0,haining:0,anhe:0},flags:{},evidence:{},tasks:Object.fromEntries(Object.keys(taskCatalog).map(k=>[k,'pending'])),slots:3,visited:[],history:[],note:''};}
export function readNextPage(state){const max=chapterScenes[state.scene].beats?.length||0;if((state.pageIndex||0)>=max)throw new Error('已到選擇頁');return {...state,pageIndex:(state.pageIndex||0)+1};}
export function blockedReason(state,option){for(const id of option.requires||[]){const e=state.evidence[id];if(!e)return `尚未取得 ${id}`;if(!e.verified)return `${id} 尚未核實`;if(!e.authorized)return `${id} 未獲公開授權`;}return '';}
export function options(state){if(state.scene==='technician'&&state.flags.witnessConsent==='pressure')return chapterScenes.technician.choices.filter(c=>c.id!=='named');if(state.scene==='journalist'&&state.flags.reporterSource==='bargain')return chapterScenes.journalist.choices.filter(c=>c.id!=='interview');if(state.scene==='hub')return visits.filter(v=>!state.visited.includes(v.id)).map(v=>({id:v.id,text:v.title,next:v.id,effects:{}}));return chapterScenes[state.scene].choices;}
export function advance(state,id){const option=options(state).find(o=>o.id===id);if(!option)throw new Error('無效選項');if(blockedReason(state,option))throw new Error(blockedReason(state,option));const next=structuredClone(state);const scene=chapterScenes[state.scene];next.history.push({scene:state.scene,speaker:scene.speaker,text:[...(scene.beats||[]),scene.text,reporterReaction(state,state.scene),maintenanceReaction(state,state.scene),fieldReaction(state,state.scene)].filter(Boolean).join('\n\n'),choice:option.text});const e=option.effects;next.stats=applyChoice(next.stats,e.stats||{});Object.assign(next.flags,e.flags||{});Object.assign(next.tasks,e.tasks||{});for(const [key,value] of Object.entries(e.relations||{}))next.relations[key]=Math.max(-10,Math.min(10,next.relations[key]+value));for(const [key,value] of Object.entries(e.evidence||{}))next.evidence[key]={...next.evidence[key],...value};next.note=e.note||'';if(state.scene==='hub'){next.slots--;next.visited.push(option.id);}next.scene=option.next;next.pageIndex=0;if(next.scene==='hub'&&next.slots===0){next.scene='reconcile';for(const v of visits)if(v.task&&!next.visited.includes(v.id))next.tasks[v.task]='missed';if(!next.evidence.E03){next.evidence.E03={verified:true,authorized:true};next.note='正式調查簡報提供通訊摘要；技師個人訪談與維護文件尚未取得。';}next.evidence.E02.verified=true;}return next;}
const obj=x=>x&&typeof x==='object'&&!Array.isArray(x);
export function validState(s){if(!obj(s)||s.schemaVersion!==1||s.chapter!=='c01'||!chapterScenes[s.scene]||!obj(s.stats)||!obj(s.relations)||!obj(s.flags)||!obj(s.tasks)||!obj(s.evidence)||!Array.isArray(s.visited)||!Array.isArray(s.history)||typeof s.note!=='string')return false;
if(!Object.keys(initialStats).every(k=>Number.isFinite(s.stats[k])&&s.stats[k]>=0&&s.stats[k]<=100)||!['yucheng','haining','anhe'].every(k=>Number.isFinite(s.relations[k])&&s.relations[k]>=-10&&s.relations[k]<=10))return false;
if(!Number.isInteger(s.slots)||s.slots<0||s.slots>3||new Set(s.visited).size!==s.visited.length||s.visited.length!==3-s.slots||!s.visited.every(k=>visits.some(v=>v.id===k)))return false;
if(!Object.keys(taskCatalog).every(k=>['pending','active','complete','missed'].includes(s.tasks[k])))return false;
if(!Object.entries(s.evidence).every(([k,v])=>evidenceCatalog[k]&&obj(v)&&typeof v.verified==='boolean'&&typeof v.authorized==='boolean'))return false;
if(!Object.values(s.flags).every(v=>typeof v==='string'||typeof v==='boolean'))return false;
if(!s.history.every(h=>obj(h)&&chapterScenes[h.scene]&&['speaker','text','choice'].every(k=>typeof h[k]==='string')))return false;
if(['hub',...visits.map(v=>v.id),'reconcile','authorization','checkpoint'].includes(s.scene)&&!s.evidence.E02)return false;
if(s.playTimeMs!==undefined&&(!Number.isSafeInteger(s.playTimeMs)||s.playTimeMs<0))return false;
if(s.pageIndex!==undefined&&(!Number.isInteger(s.pageIndex)||s.pageIndex<0||s.pageIndex>(chapterScenes[s.scene].beats?.length||0)))return false;
if(s.scene==='hub'&&s.slots===0)return false;
if(['caucus','diplomacy','hearing1','clarify1','hearing2','clarify2','hearing3','night','chapterEnd'].includes(s.scene)&& (s.slots!==0||!s.evidence.E02?.verified||!s.evidence.E03?.verified))return false;
return true;}
export function decodeSave(raw){try{const data=JSON.parse(raw);if(!validState(data))return null;data.pageIndex??=0;data.playTimeMs??=0;return data;}catch{return null;}}
export function writeSave(storage,slot,state){if(!['auto','1','2','3'].includes(slot)||!validState(state))throw new Error('無效存檔');storage.setItem(SAVE_PREFIX+slot,JSON.stringify(state));}
export function readSave(storage,slot){if(!['auto','1','2','3'].includes(slot))return null;return decodeSave(storage.getItem(SAVE_PREFIX+slot));}
