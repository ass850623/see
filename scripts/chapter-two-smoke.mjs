import {chromium} from 'playwright';import assert from 'node:assert/strict';
import {firstChapterFixture} from './chapter-two-fixture.mjs';
const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']});
try{
 const page=await browser.newPage({viewport:{width:390,height:844}});page.setDefaultTimeout(8000);const errors=[];page.on('pageerror',e=>errors.push(e.message));
 const original=firstChapterFixture();await page.addInitScript(s=>{if(!localStorage.getItem('mist-chapter-v1-auto'))localStorage.setItem('mist-chapter-v1-auto',JSON.stringify(s));},original);
 await page.goto(process.env.MIST_TEST_URL||'http://127.0.0.1:3000');await page.locator('#continue-story').click();await page.getByRole('button',{name:'開始第二章開場（原型）',exact:true}).click();
 assert.ok((await page.locator('#chapter-location').textContent()).includes('第 2 日'));assert.equal(await page.locator('.chapter-heading .eyebrow').textContent(),'第二章 · 昨日的承諾');assert.equal(await page.locator('#chapter-screen').getAttribute('aria-label'),'第二章開場原型');assert.equal(await page.locator('#journey-commitments').isVisible(),true);await page.locator('#game-settings').click();await page.getByRole('button',{name:'最大',exact:true}).click();await page.keyboard.press('Escape');
 await page.getByRole('button',{name:'繼續閱讀 →',exact:true}).click();await page.reload();await page.locator('#continue-story').click();assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('mist-chapter-v1-auto')).pageIndex),1);
 const finishReading=async()=>{while(await page.getByRole('button',{name:'繼續閱讀 →',exact:true}).count())await page.getByRole('button',{name:'繼續閱讀 →',exact:true}).click();};
 await finishReading();await page.locator('#chapter-choices button').first().click();await finishReading();
 await page.screenshot({path:'/tmp/mist-c02-board.png',fullPage:true});await page.getByRole('button',{name:'先跟進：發布公開更正與版本紀錄',exact:true}).click();await finishReading();assert.match(await page.locator('#chapter-text').textContent(),/故事第 2 日中午前/);
 await page.getByRole('button',{name:'送出現況回覆，明列仍待確認的部分。',exact:true}).click();await finishReading();assert.match(await page.locator('#chapter-text').textContent(),/正式稿件沒有自動發布/);
 await page.getByRole('button',{name:'列入下一輪追蹤，保留原期限。',exact:true}).click();assert.match(await page.locator('#chapter-text').textContent(),/原型的暫停點/);
 await page.getByRole('button',{name:'查看承諾追蹤',exact:true}).click();assert.match(await page.locator('#panel-content').textContent(),/已回覆 · 結果待追蹤/);assert.match(await page.locator('#panel-content').textContent(),/第 2 日/);await page.keyboard.press('Escape');
 const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('mist-chapter-v1-auto')));assert.deepEqual(saved.evidence,original.evidence);assert.deepEqual(saved.tasks,original.tasks);
 assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await page.reload();await page.locator('#continue-story').click();assert.equal(await page.locator('#main-action-title').textContent(),'章末工具');assert.deepEqual(errors,[]);
 console.log('第二章入口、逐頁存檔、原承諾期限、回覆結果分離、暫停點與讀檔通過');
}finally{await browser.close();}
