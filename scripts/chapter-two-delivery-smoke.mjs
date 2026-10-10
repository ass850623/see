import {chromium} from 'playwright';import assert from 'node:assert/strict';import {followupFixture} from './chapter-two-followup-fixture.mjs';
const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']});
try{for(const full of [false,true]){
 const context=await browser.newContext({viewport:{width:390,height:844}});const p=await context.newPage();p.setDefaultTimeout(8000);const errors=[];p.on('pageerror',e=>errors.push(e.message));
 const old=followupFixture({scope:full?'full':'versions',next:'window'});await p.addInitScript(s=>{if(!localStorage.getItem('mist-chapter-v1-auto'))localStorage.setItem('mist-chapter-v1-auto',JSON.stringify(s));},old);
 await p.goto(process.env.MIST_TEST_URL||'http://127.0.0.1:3000');await p.locator('#continue-story').click();await p.getByRole('button',{name:'接續文件交付核對與正式回覆',exact:true}).click();
 const read=async()=>{while(await p.getByRole('button',{name:'繼續閱讀 →',exact:true}).count())await p.getByRole('button',{name:'繼續閱讀 →',exact:true}).click();};await read();
 if(full){assert.match(await p.locator('#chapter-text').textContent(),/沒有交付附件清單/);await p.getByRole('button',{name:'補送版本範圍申請，等候交付。',exact:true}).click();}else{
  await p.getByRole('button',{name:'證據簿',exact:true}).click();assert.match(await p.locator('#panel-content').textContent(),/公開版附件清單/);await p.keyboard.press('Escape');
  assert.equal(await p.evaluate(()=>JSON.parse(localStorage.getItem('mist-chapter-v1-auto')).evidence.E07.verified),false);await p.getByRole('button',{name:'比對公開版本清單與原截圖，記錄差異。',exact:true}).click();
 }
 await p.getByRole('button',{name:'繼續閱讀 →',exact:true}).click();await p.reload();await p.locator('#continue-story').click();assert.equal(await p.evaluate(()=>JSON.parse(localStorage.getItem('mist-chapter-v1-auto')).pageIndex),1);await read();assert.match(await p.locator('#chapter-text').textContent(),/已收到書面答覆/);
 await p.getByRole('button',{name:'轉達書面補件路徑，明列個案仍須審核。',exact:true}).click();await read();await p.getByRole('button',{name:'保存交付範圍、核對結果與正式回覆。',exact:true}).click();
 await p.getByRole('button',{name:'查看任務',exact:true}).click();assert.match(await p.locator('#panel-content').textContent(),/文件交付與正式回覆/);await p.keyboard.press('Escape');const saved=await p.evaluate(()=>JSON.parse(localStorage.getItem('mist-chapter-v1-auto')));assert.equal(saved.scene,'c02DeliveryEnd');assert.deepEqual(saved.evidence.E07,full?undefined:{verified:true,authorized:true});for(const [id,e] of Object.entries(old.evidence))assert.deepEqual(saved.evidence[id],e);
 await p.locator('#game-settings').click();await p.getByRole('button',{name:'最大',exact:true}).click();await p.keyboard.press('Escape');assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await p.reload();await p.locator('#continue-story').click();assert.match(await p.locator('#chapter-text').textContent(),/個案未審/);assert.deepEqual(errors,[]);await context.close();
}console.log('公開交付與補正分支、E07 核實、正式回覆、途中讀檔與舊資料保留通過');}finally{await browser.close();}
