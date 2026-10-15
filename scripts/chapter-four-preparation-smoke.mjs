import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {fourthReturnFixture} from './chapter-four-fixture.mjs';
import {options} from '../engine.mjs';
import {commitments} from '../chapter-meta.mjs';
const routes=[{},{contactResult:'pending',returnWindowAction:'keep'},{contactDisposition:'held',contactResult:'held'},{contactAction:'retain',contactDisposition:'held',contactResult:'held'}];
const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']});
try{for(const topic of ['files','source','relief'])for(const[index,prior]of routes.entries()){
 const old=fourthReturnFixture({nextFocus:topic,returnNext:index%2?'readiness':'list',returnConcern:index===2?'unheard':index%2?'information':'needs',...prior});
 const context=await browser.newContext({viewport:{width:390,height:844}}),p=await context.newPage(),errors=[];p.setDefaultTimeout(8000);p.on('pageerror',e=>errors.push(e.message));
 await p.addInitScript(s=>{if(!localStorage.getItem('mist-chapter-v1-auto'))localStorage.setItem('mist-chapter-v1-auto',JSON.stringify(s));},old);
 const save=()=>p.evaluate(()=>JSON.parse(localStorage.getItem('mist-chapter-v1-auto')));
 const read=async()=>{while(await p.getByRole('button',{name:'繼續閱讀 →',exact:true}).count())await p.getByRole('button',{name:'繼續閱讀 →',exact:true}).click();};
 const ledger=async()=>{await p.getByRole('button',{name:'補充說明紀錄',exact:true}).click();const text=await p.locator('#panel-content').textContent();await p.keyboard.press('Escape');return text;};
 await p.goto('http://127.0.0.1:3004');await p.locator('#continue-story').click();const priorLedger=await ledger();await p.getByRole('button',{name:'接續第四章清單與現場應變準備',exact:true}).click();
 for(let step=0;step<7;step++){
  let s=await save();if(s.scene==='c04PrepEnd')break;
  if(['c04PrepListReview','c04PrepReadyReview'].includes(s.scene)){await p.getByRole('button',{name:'繼續閱讀 →',exact:true}).click();await p.reload();await p.locator('#continue-story').click();assert.equal((await save()).pageIndex,1);}
  await read();s=await save();if(s.scene==='c04PrepReadyReview'){assert.match(await p.locator('#chapter-text').textContent(),index===2?/沒有本次到場談話或照明觀察/:/原回訪曾見候船區照明/);await p.waitForFunction(()=>document.querySelector('#chapter-background').complete&&document.querySelector('#chapter-background').naturalWidth>0);}
  const id={c04PrepListDesk:index%2?'route':'fields',c04PrepListReview:index%2?'held':'ready',c04PrepReadyDesk:index%2?'information':'needs',c04PrepStaffTalk:index%2?'centralize':'delegate',c04PrepReadyReview:index===2?'held':'ready',c04PrepRecord:index%2?'verify':'coordination'}[s.scene];
  const choice=options(s).find(c=>c.id===id);assert.ok(choice);await p.getByRole('button',{name:choice.text,exact:true}).click();
 }
 const end=await save();assert.equal(end.scene,'c04PrepEnd');assert.equal(end.flags.c04PrepRecorded,true);for(const[k,v]of Object.entries(old.flags))assert.equal(end.flags[k],v);
 const scenes=end.history.slice(old.history.length+1).map(h=>h.scene);assert.equal(scenes.indexOf('c04PrepListDesk')<scenes.indexOf('c04PrepReadyDesk'),old.flags.c04ReturnNext==='list');
 assert.deepEqual(commitments(end),commitments(old));assert.deepEqual(end.evidence,old.evidence);assert.equal(await ledger(),priorLedger);
 await p.getByRole('button',{name:'任務簿',exact:true}).click();assert.match(await p.locator('#panel-content').textContent(),/兩份準備稿已保存/);assert.ok((await p.locator('#panel-content').textContent()).includes(end.flags.c04PrepBrief));await p.keyboard.press('Escape');
 await p.getByRole('button',{name:'遊戲設定',exact:true}).click();await p.getByRole('button',{name:'最大',exact:true}).click();await p.keyboard.press('Escape');assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 await p.reload();await p.locator('#continue-story').click();assert.equal((await save()).scene,'c04PrepEnd');assert.match(await p.locator('#chapter-progress').textContent(),/清單與現場應變準備原型暫停/);assert.deepEqual(errors,[]);await context.close();
}console.log('Twelve preparation routes: both priorities, actual conditions, present/absent observations, independent staff/draft decisions, two review reloads and mobile layout passed');}finally{await browser.close();}
