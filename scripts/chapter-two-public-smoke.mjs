import {chromium} from 'playwright';import assert from 'node:assert/strict';import {deliveryFixture} from './chapter-two-followup-fixture.mjs';
const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']});
try{for(const mode of ['verified','held','missing']){
 const context=await browser.newContext({viewport:{width:390,height:844}});const p=await context.newPage();p.setDefaultTimeout(8000);p.on('dialog',d=>d.accept());const errors=[];p.on('pageerror',e=>errors.push(e.message));
 const old=deliveryFixture(mode);await p.addInitScript(s=>{if(!localStorage.getItem('mist-chapter-v1-auto'))localStorage.setItem('mist-chapter-v1-auto',JSON.stringify(s));},old);
 await p.goto(process.env.MIST_TEST_URL||'http://127.0.0.1:3000');await p.locator('#continue-story').click();await p.getByRole('button',{name:'接續來源追問與公開補充說明',exact:true}).click();
 const read=async()=>{while(await p.getByRole('button',{name:'繼續閱讀 →',exact:true}).count())await p.getByRole('button',{name:'繼續閱讀 →',exact:true}).click();};await read();await p.getByRole('button',{name:'追問經手日期與資料取得方式，保留未核實。',exact:true}).click();await read();
 const versions=p.locator('#chapter-choices button').first();assert.equal(await versions.isDisabled(),mode!=='verified');if(mode==='verified')await versions.click();else await p.getByRole('button',{name:'只交代申請、窗口回覆與尚缺的結果。',exact:true}).click();
 await p.getByRole('button',{name:'繼續閱讀 →',exact:true}).click();await p.reload();await p.locator('#continue-story').click();await read();assert.match(await p.locator('#chapter-text').textContent(),/待審閱草稿/);
 await p.getByRole('button',{name:'補充說明紀錄',exact:true}).click();assert.match(await p.locator('#panel-content').textContent(),/沒有本輪已發布/);await p.keyboard.press('Escape');
 await p.getByRole('button',{name:mode==='held'?'先存為草稿，保留未發布狀態。':'發布這份補充說明，保留草稿與依據。',exact:true}).click();
 await p.getByRole('button',{name:'補充說明紀錄',exact:true}).click();assert.match(await p.locator('#panel-content').textContent(),mode==='held'?/沒有本輪已發布/:/故事第 2 日/);if(mode!=='held')assert.match(await p.locator('#panel-content').textContent(),/來源身分未核實/);await p.keyboard.press('Escape');
 const saved=await p.evaluate(()=>JSON.parse(localStorage.getItem('mist-chapter-v1-auto')));assert.equal(saved.scene,'c02PublicEnd');assert.deepEqual(saved.evidence,old.evidence);assert.equal(saved.flags.c02PublicDisposition,mode==='held'?'held':'published');
 await p.locator('#game-settings').click();await p.getByRole('button',{name:'最大',exact:true}).click();await p.keyboard.press('Escape');assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await p.reload();await p.locator('#continue-story').click();await p.getByRole('button',{name:'補充說明紀錄',exact:true}).click();assert.match(await p.locator('#panel-content').textContent(),mode==='held'?/沒有本輪已發布/:/故事第 2 日/);assert.deepEqual(errors,[]);await context.close();
}console.log('核實／未核實／缺件三路、草稿審閱、發布與暫存紀錄、途中讀檔通過');}finally{await browser.close();}
