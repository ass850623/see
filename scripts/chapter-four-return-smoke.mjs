import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {fourthContactFixture} from './chapter-four-fixture.mjs';
import {options} from '../engine.mjs';
import {returnWindowAction} from '../chapter-four-return.mjs';
import {commitments} from '../chapter-meta.mjs';
const routes=[{},{contactResult:'pending'},{contactDisposition:'held',contactResult:'held'},{contactAction:'retain',contactDisposition:'held',contactResult:'held'}];
const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']});
try{for(const topic of ['files','source','relief'])for(const[index,prior]of routes.entries()){
 const old=fourthContactFixture({nextFocus:topic,contactNext:index%2?'visit':'window',partner:topic==='source'?'continental':topic==='relief'?'sun':'west',...prior});
 const context=await browser.newContext({viewport:{width:390,height:844}}),p=await context.newPage(),errors=[];p.setDefaultTimeout(8000);p.on('pageerror',e=>errors.push(e.message));
 await p.addInitScript(s=>{if(!localStorage.getItem('mist-chapter-v1-auto'))localStorage.setItem('mist-chapter-v1-auto',JSON.stringify(s));},old);
 const save=()=>p.evaluate(()=>JSON.parse(localStorage.getItem('mist-chapter-v1-auto')));
 const read=async()=>{while(await p.getByRole('button',{name:'繼續閱讀 →',exact:true}).count())await p.getByRole('button',{name:'繼續閱讀 →',exact:true}).click();};
 const ledger=async()=>{await p.getByRole('button',{name:'補充說明紀錄',exact:true}).click();const text=await p.locator('#panel-content').textContent();await p.keyboard.press('Escape');return text;};
 await p.goto('http://127.0.0.1:3003');await p.locator('#continue-story').click();const priorLedger=await ledger();await p.getByRole('button',{name:'接續第四章窗口後續與在地回訪',exact:true}).click();
 const concern=index===2?'unheard':index===1?'information':'needs';
 for(let step=0;step<9;step++){
  let s=await save();if(s.scene==='c04ReturnEnd')break;
  if(['c04ReturnVisitReview','c04ReturnReview'].includes(s.scene)){await p.getByRole('button',{name:'繼續閱讀 →',exact:true}).click();await p.reload();await p.locator('#continue-story').click();assert.equal((await save()).pageIndex,1);}
  await read();s=await save();
  if(s.scene==='c04ReturnHarbor'){assert.equal(await p.locator('#chapter-speaker').textContent(),'陳海寧');await p.waitForFunction(()=>document.querySelector('#chapter-background').complete&&document.querySelector('#chapter-background').naturalWidth>0);}
  if(s.scene==='c04ReturnDeferred')assert.equal(await p.locator('#chapter-speaker').textContent(),'林予澄');
  const id={c04ReturnWindowDesk:topic==='source'&&index===3?'keep':returnWindowAction(s),c04ReturnWindowReply:'review',c04ReturnVisitDesk:concern==='unheard'?'defer':'go',c04ReturnHarbor:concern,c04ReturnDeferred:'keep',c04ReturnVisitReview:'review',c04ReturnReview:'review',c04ReturnRecord:index%2?'list':'readiness'}[s.scene];
  const choice=options(s).find(c=>c.id===id);assert.ok(choice);await p.getByRole('button',{name:choice.text,exact:true}).click();
 }
 const end=await save();assert.equal(end.scene,'c04ReturnEnd');assert.equal(end.flags.c04ReturnRecorded,true);assert.equal(end.flags.c04ReturnConcern,concern);
 for(const[k,v]of Object.entries(old.flags))assert.equal(end.flags[k],v);
 const scenes=end.history.slice(old.history.length+1).map(h=>h.scene);assert.equal(scenes.indexOf('c04ReturnWindowDesk')<scenes.indexOf('c04ReturnVisitDesk'),old.flags.c04ContactNext==='window');
 assert.deepEqual(commitments(end),commitments(old));assert.deepEqual(end.evidence,old.evidence);assert.equal(await ledger(),priorLedger);
 await p.getByRole('button',{name:'任務簿',exact:true}).click();assert.match(await p.locator('#panel-content').textContent(),/第四章 · 窗口後續與在地回訪/);assert.ok((await p.locator('#panel-content').textContent()).includes(end.flags.c04ReturnBrief));await p.keyboard.press('Escape');
 await p.getByRole('button',{name:'遊戲設定',exact:true}).click();await p.getByRole('button',{name:'最大',exact:true}).click();await p.keyboard.press('Escape');assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 await p.reload();await p.locator('#continue-story').click();assert.equal((await save()).scene,'c04ReturnEnd');assert.match(await p.locator('#chapter-progress').textContent(),/窗口後續與在地回訪原型暫停/);assert.deepEqual(errors,[]);await context.close();
}console.log('Twelve ordered return routes: both priorities, actual window progress, present/absent visits, both review reloads, unchanged public records and mobile layout passed');}finally{await browser.close();}
