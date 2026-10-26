import {_electron as electron} from 'playwright';
import assert from 'node:assert/strict';
import {mkdtemp} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {fifthHandoverReviewFixture,dutyExecutionContexts} from './chapter-five-duty-execution-fixture.mjs';
import {options,decodeSave} from '../engine.mjs';
import {dutyExecutionPrimary} from '../chapter-five-duty-execution.mjs';
const executablePath=path.resolve('dist/linux-unpacked/mist-islands-rpg');
for(const index of [0,1,3,6])for(const order of ['work','track']){
 const old=fifthHandoverReviewFixture({...dutyExecutionContexts[index],hrNext:order}),profile=await mkdtemp(path.join(tmpdir(),'mist-de-desktop-')),errors=[];
 let app,p;const launch=async()=>{app=await electron.launch({executablePath,args:['--no-sandbox'],env:{...process.env,DISPLAY:process.env.DISPLAY||':99',XDG_CONFIG_HOME:profile}});p=await app.firstWindow();p.on('pageerror',e=>errors.push(e.message));};
 const save=()=>p.evaluate(()=>JSON.parse(window.mistDesktop.read('mist-chapter-v1-auto').data));
 const read=async()=>{while(await p.getByRole('button',{name:'繼續閱讀 →',exact:true}).count())await p.getByRole('button',{name:'繼續閱讀 →',exact:true}).click();};
 const ledger=async()=>{await p.getByRole('button',{name:'補充說明紀錄',exact:true}).click();const rows=await p.locator('#panel-content').evaluate(n=>Array.from(n.childNodes,n=>n.textContent));await p.keyboard.press('Escape');return rows;};
 try{await launch();await p.locator('#title-quit').waitFor();assert.equal(new URL(p.url()).protocol,'mist:');assert.equal(await p.evaluate(()=>typeof window.require),'undefined');await p.evaluate(raw=>window.mistDesktop.write('mist-chapter-v1-auto',raw),JSON.stringify(old));await p.reload();await p.locator('#continue-story').click();const previousLedger=await ledger();await p.getByRole('button',{name:'接續第五章分工執行與交班追蹤',exact:true}).click();
 const action=dutyExecutionPrimary(old),execution=index===1&&order==='track'?'hold':'execute',tracked=index===6?'held':'checked',r=[action,execution,'next'],t=['duties',tracked,'next'];let firstDraft;
 for(const id of [...(order==='work'?[...r,...t]:[...t,...r]),'review']){let s=await save();if(['c05DEWorkReview','c05DETrackReview','c05DERecord'].includes(s.scene)){await p.getByRole('button',{name:'繼續閱讀 →',exact:true}).click();const before=await save();assert.equal(before.pageIndex,1);assert.equal(before.flags.c05DERecorded,undefined);await app.close();await launch();await p.locator('#continue-story').click();const restored=await save();const {playTimeMs:beforeTime,phaseTimesMs:beforePhases,...beforeStory}=before,{playTimeMs:afterTime,phaseTimesMs:afterPhases,...afterStory}=restored;assert.deepEqual(afterStory,beforeStory);assert.ok(afterTime>=beforeTime);}await read();s=await save();assert.ok(decodeSave(JSON.stringify(s)));firstDraft??=s.flags[order==='work'?'c05DEWorkDraft':'c05DETrackDraft'];await p.waitForFunction(()=>document.querySelector('#chapter-background').complete&&document.querySelector('#chapter-background').naturalWidth>0);const selected=options(s).find(c=>c.id===id);assert.ok(selected);await p.getByRole('button',{name:selected.text,exact:true}).click();}
 await app.close();await launch();await p.locator('#continue-story').click();const end=await save();assert.equal(end.scene,'c05DEEnd');assert.equal(end.flags.c05DERecorded,true);assert.equal(end.flags.c05DEWorkDisposition,execution==='execute'?'completed':'held');assert.equal(end.flags.c05DETrackDisposition,tracked);assert.equal(end.flags[order==='work'?'c05DEWorkDraft':'c05DETrackDraft'],firstDraft);for(const[k,v]of Object.entries(old.flags))assert.equal(end.flags[k],v);assert.deepEqual(end.evidence,old.evidence);assert.deepEqual(await ledger(),previousLedger);await p.getByRole('button',{name:'任務簿',exact:true}).click();assert.match(await p.locator('#panel-content').textContent(),/分工執行與交班追蹤交接｜本輪已保存/);assert.ok((await p.locator('#panel-content').textContent()).includes(end.flags.c05DEBrief));assert.deepEqual(errors,[]);
 }finally{if(app)await app.close();}
}
console.log('Eight packaged Linux duty-execution/handover-tracking routes passed: offline assets, isolated renderer, accepted/reopened duties, three output scopes, both orders, execute/hold, three mid-reading restarts, terminal restart, frozen drafts and unchanged public ledger');
