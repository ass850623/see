import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {fourthVerificationFixture} from './chapter-four-fixture.mjs';
import {options} from '../engine.mjs';
import {commitments} from '../chapter-meta.mjs';
const cases=[['contact','window','query'],['hold','public','prepare'],['contact','defer','query'],['hold','defer','access']];
const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']});
try{for(const topic of ['files','source','relief'])for(const[index,[duty,source,response]]of cases.entries()){
 const old=fourthVerificationFixture({nextFocus:topic,verifyNext:index%2?'duty':'files',verifyFieldFocus:index>1?'unheard':'updates',prepStaff:index%2?'centralize':'delegate'});
 const context=await browser.newContext({viewport:{width:390,height:844}}),p=await context.newPage(),errors=[];p.setDefaultTimeout(8000);p.on('pageerror',e=>errors.push(e.message));
 await p.addInitScript(s=>{if(!localStorage.getItem('mist-chapter-v1-auto'))localStorage.setItem('mist-chapter-v1-auto',JSON.stringify(s));},old);
 const save=()=>p.evaluate(()=>JSON.parse(localStorage.getItem('mist-chapter-v1-auto')));
 const read=async()=>{while(await p.getByRole('button',{name:'繼續閱讀 →',exact:true}).count())await p.getByRole('button',{name:'繼續閱讀 →',exact:true}).click();};
 const ledger=async()=>{await p.getByRole('button',{name:'補充說明紀錄',exact:true}).click();const text=await p.locator('#panel-content').textContent();await p.keyboard.press('Escape');return text;};
 await p.goto('http://127.0.0.1:3006');await p.locator('#continue-story').click();const priorLedger=await ledger();await p.getByRole('button',{name:'接續第四章夜間值班與停電事件開場',exact:true}).click();assert.equal((await save()).flags.c04NightEventStarted,undefined);
 for(let step=0;step<9;step++){
  let s=await save();if(s.scene==='c04NightEnd')break;
  if(['c04NightOutage','c04NightReportReview','c04NightResponseReview'].includes(s.scene)){await p.getByRole('button',{name:'繼續閱讀 →',exact:true}).click();await p.reload();await p.locator('#continue-story').click();assert.equal((await save()).pageIndex,1);assert.equal((await save()).flags.c04NightRecorded,undefined);}
  await read();s=await save();if(s.scene==='c04NightOutage'){assert.equal(s.flags.c04NightEventStarted,true);assert.equal(s.evidence.E12,undefined);if(duty==='hold')assert.equal(await p.getByRole('button',{name:'向本夜已接通的值班窗口核對公共通報。',exact:true}).count(),0);await p.waitForFunction(()=>document.querySelector('#chapter-background').complete&&document.querySelector('#chapter-background').naturalWidth>0);}
  if(s.scene==='c04NightResponseDesk'&&duty==='hold')assert.equal(await p.getByRole('button',{name:'沿本夜確認路徑送交範圍詢問，先取得收件。',exact:true}).count(),0);
  const id={c04NightListDesk:index%2?'hold':'follow',c04NightListResult:'review',c04NightDutyDesk:duty,c04NightDutyResult:'review',c04NightOutage:source,c04NightReportReview:'review',c04NightResponseDesk:response,c04NightResponseReview:'finish'}[s.scene];
  const choice=options(s).find(c=>c.id===id);assert.ok(choice);await p.getByRole('button',{name:choice.text,exact:true}).click();
 }
 const end=await save();assert.equal(end.scene,'c04NightEnd');assert.equal(end.flags.c04NightRecorded,true);for(const[k,v]of Object.entries(old.flags))assert.equal(end.flags[k],v);
 const scenes=end.history.slice(old.history.length+1).map(h=>h.scene);assert.equal(scenes.indexOf('c04NightListDesk')<scenes.indexOf('c04NightDutyDesk'),old.flags.c04VerifyNext==='files');
 const evidence={...end.evidence};delete evidence.E12;assert.deepEqual(evidence,old.evidence);assert.deepEqual(end.evidence.E12,source==='defer'?undefined:{verified:true,authorized:true});assert.deepEqual(commitments(end),commitments(old));assert.equal(await ledger(),priorLedger);
 await p.getByRole('button',{name:'查看案件整理',exact:true}).click();assert.equal(await p.getByRole('heading',{name:'E12 · 港區夜間照明通報（公開範圍）',exact:true}).count(),source==='defer'?0:1);await p.keyboard.press('Escape');
 await p.getByRole('button',{name:'任務簿',exact:true}).click();assert.match(await p.locator('#panel-content').textContent(),/停電開場已保存/);assert.ok((await p.locator('#panel-content').textContent()).includes(end.flags.c04NightBrief));await p.keyboard.press('Escape');
 await p.getByRole('button',{name:'遊戲設定',exact:true}).click();await p.getByRole('button',{name:'最大',exact:true}).click();await p.keyboard.press('Escape');assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 await p.reload();await p.locator('#continue-story').click();assert.equal((await save()).scene,'c04NightEnd');assert.match(await p.locator('#chapter-progress').textContent(),/夜間值班與停電開場原型暫停/);assert.deepEqual(errors,[]);await context.close();
}console.log('Twelve night routes: both priorities, event/review restarts, gated public E12, no invented formal contacts, unchanged public ledger and mobile layout passed');}finally{await browser.close();}
