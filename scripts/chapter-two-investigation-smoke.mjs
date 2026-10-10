import {chromium} from 'playwright';import assert from 'node:assert/strict';
import {firstChapterFixture} from './chapter-two-fixture.mjs';import {startSecondChapter,advance} from '../engine.mjs';import {commitments} from '../chapter-meta.mjs';
let original=startSecondChapter(firstChapterFixture());for(const id of ['open','relief-report','reply','schedule'])original=advance(original,id);
const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']});
try{
 const page=await browser.newPage({viewport:{width:390,height:844}});page.setDefaultTimeout(8000);const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.addInitScript(s=>{if(!localStorage.getItem('mist-chapter-v1-auto'))localStorage.setItem('mist-chapter-v1-auto',JSON.stringify(s));},original);
 await page.goto(process.env.MIST_TEST_URL||'http://127.0.0.1:3000');await page.locator('#continue-story').click();await page.getByRole('button',{name:'接續第二章調查',exact:true}).click();
 const read=async()=>{while(await page.getByRole('button',{name:'繼續閱讀 →',exact:true}).count())await page.getByRole('button',{name:'繼續閱讀 →',exact:true}).click();};
 await read();assert.equal(await page.locator('#main-action-title').textContent(),'選擇調查順序');
 await page.getByRole('button',{name:'追蹤救助資格與轉介窗口。',exact:true}).click();await read();await page.getByRole('button',{name:'先釐清轉介卡點與可詢問的承辦窗口。',exact:true}).click();
 await page.getByRole('button',{name:'繼續閱讀 →',exact:true}).click();await page.reload();await page.locator('#continue-story').click();assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('mist-chapter-v1-auto')).pageIndex),1);await read();
 assert.match(await page.locator('#chapter-text').textContent(),/沒有讀取個人申請資料/);await page.getByRole('button',{name:'先整理卡點與疑問，請承辦確認後再補充回覆。',exact:true}).click();await read();
 assert.equal(await page.getByRole('button',{name:'追蹤救助資格與轉介窗口。',exact:true}).count(),0);
 await page.getByRole('button',{name:'核對維護來信與受理編號。',exact:true}).click();await read();await page.getByRole('button',{name:'先請寄件者補完整版本，保留未核實標記。',exact:true}).click();await read();assert.match(await page.locator('#chapter-text').textContent(),/來源仍未驗證/);
 await page.getByRole('button',{name:'整理索引與截圖差異，暫不公開來信。',exact:true}).click();assert.match(await page.locator('#chapter-text').textContent(),/原卷待調閱/);assert.match(await page.locator('#chapter-text').textContent(),/個案待審/);
 await page.getByRole('button',{name:'查看任務',exact:true}).click();assert.match(await page.locator('#panel-content').textContent(),/初步調查/);assert.match(await page.locator('#panel-content').textContent(),/資格與撥款尚未核定/);await page.keyboard.press('Escape');
 const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('mist-chapter-v1-auto')));assert.equal(saved.scene,'c02InvestigationEnd');assert.deepEqual(saved.evidence,original.evidence);assert.deepEqual(commitments(saved),commitments(original));
 await page.locator('#game-settings').click();await page.getByRole('button',{name:'最大',exact:true}).click();await page.keyboard.press('Escape');assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 await page.reload();await page.locator('#continue-story').click();assert.match(await page.locator('#chapter-text').textContent(),/索引與截圖差異/);assert.deepEqual(errors,[]);
 console.log('舊開場續接、兩條調查、逐頁讀檔、任務結果與未授權資料保留通過');
}finally{await browser.close();}
