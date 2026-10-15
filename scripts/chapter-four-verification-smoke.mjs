import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {fourthPreparationFixture} from './chapter-four-fixture.mjs';
import {options} from '../engine.mjs';
import {commitments} from '../chapter-meta.mjs';
const dispositions=[['ready','ready'],['ready','held'],['held','ready'],['held','held']];
const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']});
try{for(const topic of ['files','source','relief'])for(const[index,[prepListDisposition,prepReadyDisposition]]of dispositions.entries()){
 const old=fourthPreparationFixture({nextFocus:topic,prepNext:index%2?'coordination':'verify',prepStaff:index%2?'centralize':'delegate',prepListDisposition,prepReadyDisposition,returnConcern:index===2?'unheard':'needs',...(index===3?{contactDisposition:'held',contactResult:'held'}:{})});
 const context=await browser.newContext({viewport:{width:390,height:844}}),p=await context.newPage(),errors=[];p.setDefaultTimeout(8000);p.on('pageerror',e=>errors.push(e.message));
 await p.addInitScript(s=>{if(!localStorage.getItem('mist-chapter-v1-auto'))localStorage.setItem('mist-chapter-v1-auto',JSON.stringify(s));},old);
 const save=()=>p.evaluate(()=>JSON.parse(localStorage.getItem('mist-chapter-v1-auto')));
 const read=async()=>{while(await p.getByRole('button',{name:'繼續閱讀 →',exact:true}).count())await p.getByRole('button',{name:'繼續閱讀 →',exact:true}).click();};
 const ledger=async()=>{await p.getByRole('button',{name:'補充說明紀錄',exact:true}).click();const text=await p.locator('#panel-content').textContent();await p.keyboard.press('Escape');return text;};
 await p.goto('http://127.0.0.1:3005');await p.locator('#continue-story').click();const priorLedger=await ledger();await p.getByRole('button',{name:'接續第四章現場核對與應變分工執行',exact:true}).click();
 for(let step=0;step<7;step++){
  let s=await save();if(s.scene==='c04VerifyEnd')break;
  if(['c04VerifyListResult','c04VerifyFieldReview'].includes(s.scene)){await p.getByRole('button',{name:'繼續閱讀 →',exact:true}).click();await p.reload();await p.locator('#continue-story').click();assert.equal((await save()).pageIndex,1);}
  await read();s=await save();if(s.scene==='c04VerifyOnsite'){assert.equal(await p.locator('#chapter-speaker').textContent(),'許安禾');await p.waitForFunction(()=>document.querySelector('#chapter-background').complete&&document.querySelector('#chapter-background').naturalWidth>0);}if(s.scene==='c04VerifyFieldHeld')assert.equal(await p.locator('#chapter-speaker').textContent(),'林予澄');
  const id={c04VerifyListDesk:index===1?'hold':'check',c04VerifyListResult:'review',c04VerifyFieldDesk:index===3?'hold':'go',c04VerifyOnsite:index===2?'access':'updates',c04VerifyFieldHeld:'keep',c04VerifyFieldReview:'review',c04VerifyRecord:index%2?'files':'duty'}[s.scene];
  const choice=options(s).find(c=>c.id===id);assert.ok(choice);await p.getByRole('button',{name:choice.text,exact:true}).click();
 }
 const end=await save();assert.equal(end.scene,'c04VerifyEnd');assert.equal(end.flags.c04VerifyRecorded,true);for(const[k,v]of Object.entries(old.flags))assert.equal(end.flags[k],v);
 const scenes=end.history.slice(old.history.length+1).map(h=>h.scene);assert.equal(scenes.indexOf('c04VerifyListDesk')<scenes.indexOf('c04VerifyFieldDesk'),old.flags.c04PrepNext==='verify');
 assert.match(end.flags.c04VerifyFieldText,index===3?/沒有本次安禾談話/:/本次觀察：候船區當下照明正常/);assert.deepEqual(commitments(end),commitments(old));assert.deepEqual(end.evidence,old.evidence);assert.equal(await ledger(),priorLedger);
 await p.getByRole('button',{name:'任務簿',exact:true}).click();assert.match(await p.locator('#panel-content').textContent(),/本輪核對已保存/);assert.ok((await p.locator('#panel-content').textContent()).includes(end.flags.c04VerifyBrief));await p.keyboard.press('Escape');
 await p.getByRole('button',{name:'遊戲設定',exact:true}).click();await p.getByRole('button',{name:'最大',exact:true}).click();await p.keyboard.press('Escape');assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 await p.reload();await p.locator('#continue-story').click();assert.equal((await save()).scene,'c04VerifyEnd');assert.match(await p.locator('#chapter-progress').textContent(),/現場核對與分工執行原型暫停/);assert.deepEqual(errors,[]);await context.close();
}console.log('Twelve verification routes: both priorities, held/active drafts, explicit execution, present/absent Anhe scene, review reloads, unchanged public records and mobile layout passed');}finally{await browser.close();}
