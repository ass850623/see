import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {fourthNightFixture} from './chapter-four-fixture.mjs';
import {options} from '../engine.mjs';
import {publishedInitialReport,initialHasPortReport} from '../chapter-four-initial.mjs';
import {commitments} from '../chapter-meta.mjs';
const cases=[
 [{},'receive','published','information'],
 [{nightSource:'defer',nightResponse:'prepare'},'public','published','needs'],
 [{nightSource:'defer',nightResponse:'prepare'},'send','held','unheard'],
 [{nightDutyAction:'hold',nightSource:'public',nightResponse:'prepare'},'connect','held','information'],
 [{nightDutyAction:'hold',nightSource:'defer',nightResponse:'access'},'keep','published','unheard']
];
const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']});
try{for(const topic of ['files','source','relief'])for(const[index,[prior,action,disposition,concern]]of cases.entries()){
 const old=fourthNightFixture({nextFocus:topic,...prior});const context=await browser.newContext({viewport:{width:390,height:844}}),p=await context.newPage(),errors=[];p.setDefaultTimeout(8000);p.on('pageerror',e=>errors.push(e.message));
 await p.addInitScript(s=>{if(!localStorage.getItem('mist-chapter-v1-auto'))localStorage.setItem('mist-chapter-v1-auto',JSON.stringify(s));},old);
 const save=()=>p.evaluate(()=>JSON.parse(localStorage.getItem('mist-chapter-v1-auto')));
 const read=async()=>{while(await p.getByRole('button',{name:'繼續閱讀 →',exact:true}).count())await p.getByRole('button',{name:'繼續閱讀 →',exact:true}).click();};
 const ledger=async()=>{await p.getByRole('button',{name:'補充說明紀錄',exact:true}).click();const text=await p.locator('#panel-content').textContent();await p.keyboard.press('Escape');return text;};
 await p.goto('http://127.0.0.1:3008');await p.locator('#continue-story').click();const oldLedger=await ledger();await p.getByRole('button',{name:'接續第四章停電初報與現場協調',exact:true}).click();let publicationLedger;
 for(const id of [action,'confirm','continue',index%2?'people':'facts',disposition,concern==='unheard'?'hold':'call',concern==='unheard'?'keep':concern,index%2?'people':'window']){
  let s=await save();if(['c04InitialSourceReview','c04InitialReportReview','c04InitialCoordRecord'].includes(s.scene)){await p.getByRole('button',{name:'繼續閱讀 →',exact:true}).click();await p.reload();await p.locator('#continue-story').click();assert.equal((await save()).pageIndex,1);assert.equal((await save()).flags.c04InitialRecorded,undefined);}
  await read();s=await save();if(s.scene==='c04InitialCoordCall'){assert.equal(await p.locator('#chapter-speaker').textContent(),'陳海寧');await p.waitForFunction(()=>document.querySelector('#chapter-background').complete&&document.querySelector('#chapter-background').naturalWidth>0);}if(s.scene==='c04InitialCoordHeld')assert.equal(await p.locator('#chapter-speaker').textContent(),'林予澄');
  const choice=options(s).find(c=>c.id===id);assert.ok(choice);await p.getByRole('button',{name:choice.text,exact:true}).click();if(id===disposition)publicationLedger=await ledger();
 }
 const end=await save();assert.equal(end.scene,'c04InitialEnd');assert.equal(end.flags.c04InitialRecorded,true);for(const[k,v]of Object.entries(old.flags))assert.equal(end.flags[k],v);
 assert.deepEqual(commitments(end),commitments(old));const e={...end.evidence};delete e.E12;const oe={...old.evidence};delete oe.E12;assert.deepEqual(e,oe);assert.equal(!!end.evidence.E12,initialHasPortReport(end));
 const finalLedger=await ledger();assert.equal(finalLedger,publicationLedger);assert.ok(finalLedger.includes(oldLedger));assert.equal(!!publishedInitialReport(end),disposition==='published');if(disposition==='held')assert.equal(finalLedger,oldLedger);else assert.ok(finalLedger.includes(end.flags.c04InitialRecord));
 await p.getByRole('button',{name:'查看案件整理',exact:true}).click();assert.equal(await p.getByRole('heading',{name:'E12 · 港區夜間照明通報（公開範圍）',exact:true}).count(),initialHasPortReport(end)?1:0);if(index===1)assert.ok((await p.locator('#panel-content').textContent()).includes(end.flags.c04InitialPublicReport));await p.keyboard.press('Escape');
 await p.getByRole('button',{name:'任務簿',exact:true}).click();assert.match(await p.locator('#panel-content').textContent(),/初報與協調已保存/);await p.keyboard.press('Escape');await p.getByRole('button',{name:'遊戲設定',exact:true}).click();await p.getByRole('button',{name:'最大',exact:true}).click();await p.keyboard.press('Escape');assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 await p.reload();await p.locator('#continue-story').click();assert.equal((await save()).scene,'c04InitialEnd');assert.deepEqual(errors,[]);await context.close();
}console.log('Fifteen initial-report routes: actual sources and late E12, publication/holding, immutable published versions after calls, three review reloads and mobile layout passed');}finally{await browser.close();}
