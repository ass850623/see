import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {fourthOpeningFixture} from './chapter-four-fixture.mjs';
import {options} from '../engine.mjs';
import {commitments} from '../chapter-meta.mjs';
const routes=[['prepare','sent','reply'],['prepare','sent','pending'],['prepare','held','held'],['retain','held','held']];
const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']});
try{for(const topic of ['files','source','relief'])for(const[index,route]of routes.entries()){
 const old=fourthOpeningFixture({nextFocus:topic,disposition:index%2?'held':'queued',workApproach:index%2?'gaps':'contact',partner:topic==='source'?'continental':topic==='relief'?'sun':'west',...(index===3?{dayEightDisposition:'hold',preReportDisposition:'hold'}:{})});
 const context=await browser.newContext({viewport:{width:390,height:844}}),p=await context.newPage(),errors=[];p.setDefaultTimeout(8000);p.on('pageerror',e=>errors.push(e.message));
 await p.addInitScript(s=>{if(!localStorage.getItem('mist-chapter-v1-auto'))localStorage.setItem('mist-chapter-v1-auto',JSON.stringify(s));},old);
 const save=()=>p.evaluate(()=>JSON.parse(localStorage.getItem('mist-chapter-v1-auto')));
 const read=async()=>{while(await p.getByRole('button',{name:'繼續閱讀 →',exact:true}).count())await p.getByRole('button',{name:'繼續閱讀 →',exact:true}).click();};
 const ledger=async()=>{await p.getByRole('button',{name:'補充說明紀錄',exact:true}).click();const text=await p.locator('#panel-content').textContent();await p.keyboard.press('Escape');return text;};
 await p.goto('http://127.0.0.1:3002');await p.locator('#continue-story').click();const priorLedger=await ledger();await p.getByRole('button',{name:'接續第四章正式接洽與窗口回應',exact:true}).click();
 for(const id of [route[0],route[1],'continue',route[2],index%2?'window':'visit']){
  let s=await save();
  if(['c04ContactReview','c04ContactRecord'].includes(s.scene)){await p.getByRole('button',{name:'繼續閱讀 →',exact:true}).click();await p.reload();await p.locator('#continue-story').click();assert.equal((await save()).pageIndex,1);}
  await read();s=await save();
  if(s.scene==='c04ContactReview'){
   if(route[0]==='retain')assert.equal(await p.getByRole('button',{name:'審閱後送交本版程序詢問，取得本版收件。',exact:true}).count(),0);
   await p.waitForFunction(()=>document.querySelector('#chapter-background').complete&&document.querySelector('#chapter-background').naturalWidth>0);
  }
  if(s.scene==='c04ContactReply'&&route[1]==='held')assert.equal(await p.getByRole('button',{name:'收取已送本版詢問的程序答覆。',exact:true}).count(),0);
  const choice=options(s).find(c=>c.id===id);assert.ok(choice);await p.getByRole('button',{name:choice.text,exact:true}).click();
 }
 const end=await save();assert.equal(end.scene,'c04ContactEnd');assert.equal(end.flags.c04ContactResult,route[2]);assert.equal(end.flags.c04ContactRecorded,true);
 for(const[k,v]of Object.entries(old.flags))assert.equal(end.flags[k],v);
 assert.deepEqual(commitments(end),commitments(old));assert.deepEqual(end.evidence,old.evidence);assert.equal(await ledger(),priorLedger);
 await p.getByRole('button',{name:'任務簿',exact:true}).click();assert.match(await p.locator('#panel-content').textContent(),/第四章 · 正式接洽與窗口回應/);assert.ok((await p.locator('#panel-content').textContent()).includes(end.flags.c04ContactResponse));await p.keyboard.press('Escape');
 await p.getByRole('button',{name:'遊戲設定',exact:true}).click();await p.getByRole('button',{name:'最大',exact:true}).click();await p.keyboard.press('Escape');assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 await p.reload();await p.locator('#continue-story').click();assert.equal((await save()).scene,'c04ContactEnd');assert.match(await p.locator('#chapter-progress').textContent(),/正式接洽與窗口回應原型暫停/);assert.deepEqual(errors,[]);await context.close();
}console.log('Twelve fourth-chapter contact routes: three topics, reopened held work, send/hold and reply/pending, two review restarts, unchanged public records and mobile layout passed');}finally{await browser.close();}
