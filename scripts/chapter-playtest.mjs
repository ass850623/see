import assert from 'node:assert/strict';
import {writeFile} from 'node:fs/promises';
import {newGame,advance,readNextPage,decodeSave,blockedReason,options} from '../engine.mjs';
import {chapterScenes} from '../chapter.mjs';
import {chapterResult} from '../hearing.mjs';
import {chapterPhases,chapterPhase,commitments} from '../chapter-meta.mjs';
import {reporterTopics,chooseReporterReply} from '../reporter.mjs';
import {witnessTopics,chooseWitnessReply} from '../maintenance.mjs';
import {fieldVisits,readFieldPage,answerField} from '../fieldwork.mjs';
const routes=[
 {name:'透明調查',result:'credible',ids:['verify','depart','listen','respect','review','schedule','technician','protect','family','process','journalist','interview','bounded','authorize','continue','amend','oversight','timeline','contract','safety','review','repair','transparent','prioritize'],extras:true},
 {name:'黨團優先',result:'party',ids:['stance','depart','listen','urgent','selective','schedule','technician','protect','journalist','written','aide','centralize','bounded','private','continue','accept','confidential','party','contract','inquiry','review','defend','spin','overpromise']},
 {name:'調查未完',result:'pending',ids:['verify','depart','listen','respect','review','schedule','family','refer','journalist','written','aide','delegate','bounded','private','continue','reject','rescue','defer','briefing','inquiry','review','repair','transparent','prioritize']}
];
const reports=[];
for(const route of routes){let state=newGame();const stages=chapterPhases.map(p=>({name:p.label,pages:0,scenes:0}));const choices=[];let extras=0;
 for(const id of route.ids){
  const scene=chapterScenes[state.scene];const phase=stages[chapterPhase(state)];phase.scenes++;phase.pages+=(scene.beats?.length||0)+1;
  while(state.pageIndex<(scene.beats?.length||0))state=readNextPage(state);
  if(route.extras&&state.scene==='harborTalk')for(const visit of fieldVisits){for(const _ of visit.pages)state=readFieldPage(state,visit.id);state=answerField(state,visit.id,visit.choices[0].id);choices.push(`現場走訪 · ${visit.title}: ${visit.choices[0].text}`);extras+=visit.pages.length+1;}
  if(route.extras&&state.scene==='technician')for(const topic of witnessTopics){state=chooseWitnessReply(state,topic.id,topic.choices[0].id);choices.push(`技師深入訪談 · ${topic.title}: ${topic.choices[0].text}`);extras++;}
  if(route.extras&&state.scene==='journalist')for(const topic of reporterTopics){state=chooseReporterReply(state,topic.id,topic.choices[0].id);choices.push(`記者深入訪談 · ${topic.title}: ${topic.choices[0].text}`);extras++;}
  if(state.scene==='hearing1'&&!state.evidence.E02.authorized){const snapshot=JSON.stringify(state);assert.match(blockedReason(state,options(state).find(c=>c.id==='timeline')),/授權/);assert.throws(()=>advance(state,'timeline'));assert.equal(JSON.stringify(state),snapshot);}
  const choice=options(state).find(c=>c.id===id);assert.ok(choice,`${route.name}: ${state.scene}/${id}`);choices.push(`${state.scene}: ${choice.text}`);state=advance(state,id);assert.deepEqual(decodeSave(JSON.stringify(state)),state);
 }
 assert.equal(state.scene,'chapterEnd');assert.equal(chapterResult(state).id,route.result);assert.ok(commitments(state).every(c=>c.status==='待履行'));assert.equal(state.playTimeMs,0);
 reports.push({name:route.name,result:chapterResult(state).title,stages,extras,chars:state.history.reduce((n,h)=>n+h.text.length+h.choice.length,0),choices,commitments:commitments(state).map(c=>`${c.title}：${c.due}`),missed:Object.entries(state.tasks).filter(([,v])=>v==='missed').map(([k])=>k)});
}
const lines=['# 第一章代表路線流程檢查','','此檔由 `npm run playtest:report` 產生。這是自動流程檢查，沒有真人時長資料。閱讀頁數包含決策頁及重複行程頁；字元只統計這條路線對話紀錄中的敘事與已選回答，不包含所有可開啟的案件簿、工作板或選項。不得換算成實測分鐘。','','| 路線 | 章末結果 | 主線閱讀／決策頁 | 已走支線頁 | 紀錄字元 | 真人分鐘 |','| --- | --- | ---: | ---: | ---: | --- |',...reports.map(r=>`| ${r.name} | ${r.result} | ${r.stages.reduce((n,p)=>n+p.pages,0)} | ${r.extras} | ${r.chars} | 尚未測量 |`),'','每個主線選擇後驗證存檔可讀；未授權路線確認無法公開出示原始紀錄，失敗操作不改寫狀態；所有承諾保持待履行。'];
for(const r of reports){lines.push('',`## ${r.name}`,'','| 階段 | 場景次數 | 閱讀／決策頁 |','| --- | ---: | ---: |',...r.stages.map(p=>`| ${p.name} | ${p.scenes} | ${p.pages} |`),'','選擇順序：','',...r.choices.map((s,i)=>`${i+1}. ${s}`),'','章末待辦：','',...r.commitments.map(s=>`- ${s}`),'',`錯過的任務：${r.missed.join('、')||'無'}。`);}
if(process.argv.includes('--write'))await writeFile(new URL('../docs/chapter-01-route-report.md',import.meta.url),lines.join('\n')+'\n');
console.log(reports.map(r=>`${r.name} → ${r.result}；${r.stages.reduce((n,p)=>n+p.pages,0)} 主線頁，${r.extras} 支線頁；存檔與承諾驗證通過`).join('\n'));
