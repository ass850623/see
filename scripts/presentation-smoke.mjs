import {chromium} from 'playwright';
import assert from 'node:assert/strict';
const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']});
try{
 const page=await browser.newPage();page.setDefaultTimeout(8000);page.on('dialog',d=>d.accept());const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.addInitScript(()=>{window.performances=[];const original=Element.prototype.animate;Element.prototype.animate=function(...args){performances.push(this.id);return original.apply(this,args);};});
 await page.goto(process.env.MIST_TEST_URL||'http://127.0.0.1:3000');
 await page.getByRole('button',{name:/開始第一章/}).click();
 assert.deepEqual(await page.evaluate(()=>performances),[]);
 const portrait=await page.locator('#chapter-portrait img').elementHandle();
 await page.getByRole('button',{name:'繼續閱讀 →',exact:true}).click();
 assert.equal(await portrait.evaluate(e=>e.isConnected),true);
 assert.deepEqual(await page.evaluate(()=>performances),[]);
 const advance=async()=>{while(await page.getByRole('button',{name:'繼續閱讀 →',exact:true}).count())await page.getByRole('button',{name:'繼續閱讀 →',exact:true}).click();await page.locator('#chapter-choices button').first().click();};
 await advance();await advance();
 assert.ok((await page.evaluate(()=>performances)).includes('chapter-background'));
 assert.ok((await page.evaluate(()=>performances)).includes('chapter-portrait'));
 await page.locator('#game-settings').click();await page.getByRole('button',{name:'關閉場景演出',exact:true}).click();
 assert.equal(await page.evaluate(()=>document.getAnimations().length),0);
 await page.getByRole('button',{name:'關閉',exact:true}).click();
 const count=await page.evaluate(()=>performances.length);await advance();assert.equal(await page.evaluate(()=>performances.length),count);
 await page.reload();await page.locator('#title-settings').click();assert.equal(await page.getByRole('button',{name:'開啟場景演出',exact:true}).count(),1);
 await page.getByRole('button',{name:'開啟場景演出',exact:true}).click();await page.getByRole('button',{name:'關閉',exact:true}).click();
 await page.emulateMedia({reducedMotion:'reduce'});await page.locator('#continue-story').click();
 const reducedCount=await page.evaluate(()=>performances.length);await advance();assert.equal(await page.evaluate(()=>performances.length),reducedCount);
 assert.deepEqual(errors,[]);console.log('場景淡入、角色出場、翻頁保留圖片、設定保存與減少動態效果通過');
}finally{await browser.close();}
