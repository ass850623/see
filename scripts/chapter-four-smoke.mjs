import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {thirdEndingFixture} from './chapter-four-fixture.mjs';
import {options} from '../engine.mjs';
import {commitments} from '../chapter-meta.mjs';
const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']});
try{
 for(const [index,topic] of ['files','source','relief','files','source','relief'].entries()){
  const old=thirdEndingFixture({nextFocus:topic,partner:['west','sun','continental'][index%3],...(index>2?{dueCloseAction:'keep',dayEightDisposition:'hold',preReportDisposition:'hold'}:{})});
  const context=await browser.newContext({viewport:{width:390,height:844}}),p=await context.newPage(),errors=[];
  p.on('pageerror',e=>errors.push(e.message));p.setDefaultTimeout(8000);
  await p.addInitScript(s=>{if(!localStorage.getItem('mist-chapter-v1-auto'))localStorage.setItem('mist-chapter-v1-auto',JSON.stringify(s));},old);
  const save=()=>p.evaluate(()=>JSON.parse(localStorage.getItem('mist-chapter-v1-auto')));
  const read=async()=>{while(await p.getByRole('button',{name:'繼續閱讀 →',exact:true}).count())await p.getByRole('button',{name:'繼續閱讀 →',exact:true}).click();};
  const ledger=async()=>{await p.getByRole('button',{name:'補充說明紀錄',exact:true}).click();const text=await p.locator('#panel-content').textContent();await p.keyboard.press('Escape');return text;};
  await p.goto('http://127.0.0.1:3001');await p.locator('#continue-story').click();const oldLedger=await ledger();
  await p.getByRole('button',{name:'開始第四章開場（原型）',exact:true}).click();
  assert.match(await p.locator('.chapter-heading .eyebrow').textContent(),/第四章/);
  for(const id of [index%2?'people':'facts','review',index%2?'waiting':'limits',index%2?'gaps':'contact',index%2?'held':'queued','finish']){
   let s=await save();
   if(['c04HandoffReview','c04DraftReview'].includes(s.scene)){
    await p.getByRole('button',{name:'繼續閱讀 →',exact:true}).click();await p.reload();await p.locator('#continue-story').click();assert.equal((await save()).pageIndex,1);
   }
   await read();s=await save();
   if(s.scene==='c04DraftReview'){assert.match(await p.locator('#chapter-text').textContent(),/第四章內部行動稿/);await p.waitForFunction(()=>document.querySelector('#chapter-background').complete&&document.querySelector('#chapter-background').naturalWidth>0);}
   await p.getByRole('button',{name:options(s).find(c=>c.id===id).text,exact:true}).click();
  }
  const end=await save();assert.equal(end.scene,'c04OpeningEnd');assert.equal(end.chapter,'c04');assert.equal(end.flags.c04OpeningRecorded,true);
  for(const[k,v]of Object.entries(old.flags))assert.equal(end.flags[k],v);
  assert.deepEqual(commitments(end),commitments(old));await p.getByRole('button',{name:'查看承諾追蹤',exact:true}).click();assert.match(await p.locator('#panel-content').textContent(),/目前為故事第 9 日/);await p.keyboard.press('Escape');assert.deepEqual(end.evidence,old.evidence);assert.equal(await ledger(),oldLedger);
  await p.getByRole('button',{name:'任務簿',exact:true}).click();assert.match(await p.locator('#panel-content').textContent(),/第四章 · 等待的代價/);assert.match(await p.locator('#panel-content').textContent(),/開場已保存/);await p.keyboard.press('Escape');
  await p.getByRole('button',{name:'遊戲設定',exact:true}).click();await p.getByRole('button',{name:'最大',exact:true}).click();await p.keyboard.press('Escape');assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  await p.reload();await p.locator('#continue-story').click();assert.equal((await save()).scene,'c04OpeningEnd');assert.match(await p.locator('#chapter-progress').textContent(),/第四章開場原型暫停/);assert.deepEqual(errors,[]);await context.close();
 }
 console.log('Six fourth-chapter routes: inherited priorities, both decisions, two review reloads, unchanged public ledger/commitments, artwork and mobile layout passed');
}finally{await browser.close();}
