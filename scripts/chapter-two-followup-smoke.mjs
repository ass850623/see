import {chromium} from 'playwright';import assert from 'node:assert/strict';
import {investigationFixture} from './chapter-two-followup-fixture.mjs';import {commitments} from '../chapter-meta.mjs';
const original=investigationFixture(true);const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']});
try{
 const page=await browser.newPage({viewport:{width:390,height:844}});page.setDefaultTimeout(8000);const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.addInitScript(s=>{if(!localStorage.getItem('mist-chapter-v1-auto'))localStorage.setItem('mist-chapter-v1-auto',JSON.stringify(s));},original);
 await page.goto(process.env.MIST_TEST_URL||'http://127.0.0.1:3000');await page.locator('#continue-story').click();await page.getByRole('button',{name:'接續原卷申請與救助回訪',exact:true}).click();
 const read=async()=>{while(await page.getByRole('button',{name:'繼續閱讀 →',exact:true}).count())await page.getByRole('button',{name:'繼續閱讀 →',exact:true}).click();};
 await read();await page.getByRole('button',{name:'提交原卷調閱申請。',exact:true}).click();await read();assert.match(await page.locator('#chapter-text').textContent(),/上一輪只整理/);
 await page.getByRole('button',{name:'申請完整卷宗，另列必要性與公開限制。',exact:true}).click();await page.getByRole('button',{name:'繼續閱讀 →',exact:true}).click();await page.reload();await page.locator('#continue-story').click();assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('mist-chapter-v1-auto')).pageIndex),1);await read();assert.match(await page.locator('#chapter-text').textContent(),/要求補充必要性/);
 await page.getByRole('button',{name:'保存收件紀錄，依目前範圍等候處理。',exact:true}).click();await read();assert.equal(await page.getByRole('button',{name:'提交原卷調閱申請。',exact:true}).count(),0);
 await page.getByRole('button',{name:'回訪救助文件卡點。',exact:true}).click();await read();assert.match(await page.locator('#chapter-text').textContent(),/上一輪留下/);await page.getByRole('button',{name:'先向等待者區分已知流程與未確認文件。',exact:true}).click();await read();assert.match(await page.locator('#chapter-text').textContent(),/尚未收到承辦/);
 await page.getByRole('button',{name:'送出一般替代文件詢問，保留待回覆欄位。',exact:true}).click();assert.match(await page.locator('#chapter-text').textContent(),/範圍待釐清/);assert.match(await page.locator('#chapter-text').textContent(),/答覆待收/);
 await page.getByRole('button',{name:'查看任務',exact:true}).click();assert.match(await page.locator('#panel-content').textContent(),/申請與回訪/);assert.match(await page.locator('#panel-content').textContent(),/沒有新增公開授權/);await page.keyboard.press('Escape');
 const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('mist-chapter-v1-auto')));assert.equal(saved.scene,'c02FollowupEnd');assert.deepEqual(saved.evidence,original.evidence);assert.deepEqual(commitments(saved),commitments(original));
 await page.locator('#game-settings').click();await page.getByRole('button',{name:'最大',exact:true}).click();await page.keyboard.press('Escape');assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await page.reload();await page.locator('#continue-story').click();assert.match(await page.locator('#chapter-text').textContent(),/答覆待收/);assert.deepEqual(errors,[]);
 console.log('舊調查續接、原卷申請、卡點回訪、選擇延續、逐頁讀檔與任務狀態通過');
}finally{await browser.close();}
