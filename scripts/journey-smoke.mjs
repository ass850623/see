import {chromium} from 'playwright';
import assert from 'node:assert/strict';
const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']});
try{
 const page=await browser.newPage({viewport:{width:390,height:844}});page.setDefaultTimeout(8000);page.on('dialog',d=>d.accept());const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(process.env.MIST_TEST_URL||'http://127.0.0.1:3000');await page.getByRole('button',{name:/開始第一章/}).click();
 assert.equal(await page.locator('#main-action-title').textContent(),'閱讀對話');
 await page.getByRole('button',{name:'查看任務',exact:true}).click();await page.keyboard.press('Escape');assert.equal(await page.evaluate(()=>document.activeElement.textContent),'查看任務');
 await page.locator('#game-settings').click();await page.getByRole('button',{name:'最大',exact:true}).click();await page.keyboard.press('Escape');
 let hubs=0,steps=0;
 while((await page.locator('#main-action-title').textContent())!=='章末工具'){
  assert.ok((await page.locator('#journey-objective').textContent()).length>0);
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  if(await page.locator('#journey-side').isVisible()){
   await page.locator('#journey-side').click();assert.equal(await page.evaluate(()=>document.activeElement.closest('#chapter-activities')?.id),'chapter-activities');
  }
  const read=page.getByRole('button',{name:'繼續閱讀 →',exact:true});
  if(await read.count()){await read.click();}else{
   if((await page.locator('#main-action-title').textContent())==='安排調查訪談'){
    hubs++;assert.ok((await page.locator('#journey-hint').textContent()).includes(`剩餘 ${4-hubs} 個調查時段`));
   }
   await page.locator('#chapter-choices button:not([disabled])').first().click();
  }
  assert.ok(++steps<200);
 }
 assert.equal(hubs,3);assert.ok((await page.locator('#journey-hint').textContent()).includes('第二章尚未開放'));
 const objective=await page.locator('#journey-objective').textContent();await page.reload();await page.locator('#continue-story').click();assert.equal(await page.locator('#journey-objective').textContent(),objective);assert.equal(await page.locator('#main-action-title').textContent(),'章末工具');
 assert.deepEqual(errors,[]);console.log('全章導引、三個調查時段、支線焦點、任務面板、大字級窄視窗與讀檔同步通過');
}finally{await browser.close();}
