const c=(id,text,next,flags={})=>({id,text,next,effects:{flags}});
export const endingScenes={
 c02ClosingNotice:{place:'辦公室 · 第二章收束通知',speaker:'林予澄',role:'幕僚長',portrait:'aide',
 beats:['議會秘書處送來追加詢問的準備通知：故事第 3 日將處理港口調查與救助進度，實際時段另行確認。手機上的短片仍在流傳，有人把「日期不同」說成「事故已經被證明是陰謀」。','予澄把通知與你保存的階段整理並排。「這就是明天會追來的問題。今天能確認多少，就帶多少；還沒得到的答案，也要照原樣帶過去。」通知沒有替來源具名，也沒有放寬私人材料的公開權限。'],
 text:'如何回覆準備方式？本次只保存辦公室的回覆意向，尚未提交稿件或確認出席時段。',choices:[c('attend','準備到場答問，另確認時段與可用資料。','c02ClosingTalk',{c02ClosingResponse:'attend'}),c('written','先準備書面答問，保留現場安排待確認。','c02ClosingTalk',{c02ClosingResponse:'written'})]},
 c02ClosingTalk:{place:'辦公室 · 章末聯絡',speaker:'林予澄',role:'幕僚長',portrait:'aide',
 beats:['你留下的優先意向決定這通章末聯絡先談哪個問題。予澄沒有把它換成一個比較容易結案的方向；她把對方提醒的缺口加在交接頁旁。','她說：「明天要用的，不只是我們找到的材料，還有別人為什麼仍然等不到答案。」私人來信、受限筆記、原公開發言與當事人的個案流程，各自保留原範圍。'],
 text:'第三章準備先從哪種工作方式開始？原卷、來源或救助的優先方向仍沿用，不取消其他事項。',choices:[c('facts','先整理可回答的事實與證據使用界線。','c02NextChapterBrief',{c02NextPreparation:'facts'}),c('people','先整理當事人與窗口的待回問題。','c02NextChapterBrief',{c02NextPreparation:'people'})]},
 c02NextChapterBrief:{place:'辦公室 · 第三章開場準備',speaker:'沈若川',role:'本土協進黨議員',portrait:'senior',
 beats:['你把第三章準備頁讀完，沒有在尚未核實的欄位填上結論。隔日追加詢問的工作目的，是把新的問題帶回可查證的範圍，不是把今天的整理重新包裝成勝利。','予澄把原期限與未決事項一同封存。「第二章這個流程到這裡。事情沒有全部結束，第三章也不能從沒有昨天的狀態開始。」'],
 text:'審閱以下交接準備，再保存第二章章末。這是開發版流程收束，不代表案件全部完成或目標時長驗收。',choices:[]},
 c02ChapterEnd:{place:'第二章章末 · 開發版流程收束',speaker:'林予澄',role:'幕僚長',portrait:'aide',terminal:true,
 text:'第二章可玩流程初版已收束，第三章準備頁與原案件狀態已保存。追加詢問尚未進行，原卷、來源與救助仍有待辦。可開始第三章追加詢問開場原型；可查看任務、保存手動欄位或返回主畫面。',choices:[]}
};
export function endingBrief(s){const f=s.flags;return '第三章準備｜追加詢問前的工作\n優先方向：'+({files:'原卷與限制處理',source:'來源與原件核對',relief:'救助個案窗口'}[f.c02StagePriority])+'\n回覆方式意向：'+(f.c02ClosingResponse==='attend'?'準備到場答問，時段與出席待確認。':'準備書面答問，稿件尚未提交。')+'\n第一項準備：'+(f.c02NextPreparation==='facts'?'列可回答的事實與證據使用範圍。':'列當事人與窗口仍待回覆的問題。')+'\n帶入：原階段整理、公開發言原文、資料取得與核實狀態、人手及協商分歧。\n使用界線：E09 私人回信未核實且未公開；E10 若存在仍不可公開，不交付輪值席或記者。\n未決：來源身分、原件來源、事故動機、完整原卷、個案核定與撥款；原承諾與期限不延後。\n這是內部準備頁，尚未進入第三章、提交答問或完成任何原承諾。';}
export function endingOptions(s){return [c('finish','保存章末與第三章準備頁。','c02ChapterEnd',{c02EndingRecorded:true,c02EndingBrief:endingBrief(s)})];}
export function endingSummary(s){const f=s.flags;return [{title:'第二章章末',status:f.c02EndingRecorded?'第二章流程初版已收束':'章末準備中',detail:'案件未全部完成；追加詢問、來源與個案仍須追蹤。'},{title:'第三章準備頁',status:f.c02EndingRecorded?'內部交接已保存 · 第三章未開始':f.c02NextPreparation?'交接準備待審閱':'準備方式尚未選定',detail:f.c02EndingBrief||(f.c02NextPreparation?endingBrief(s):'原階段整理及未決事項保留。')}];}
export function endingReaction(s){const f=s.flags;if(s.scene==='c02ClosingNotice')return f.c02PublicDisposition==='published'?'既有公開說明保留原文，新的片段解讀不會改變它能支持的結論。':'本輪補充說明尚未發布，章末通知不會替你公開草稿。';if(s.scene==='c02ClosingTalk')return {files:'安禾的章末提醒：'+(s.evidence.E10?'受限流程筆記可以支持內部追問，仍不能公開；原卷複本與原因認定未取得。':'目前沒有受限筆記，明日不能宣稱看過原卷；閱覽與限制問題仍待推進。'),source:'予澄的章末提醒：私人回信與公開日期是兩件事；對方未具名、未交原件，不能把日期符合當成身分確認。',relief:'海寧的章末提醒：一般補件說明已取得，但個案資格與撥款沒有結果；請回到正式窗口與當事人流程。'}[f.c02StagePriority]+'\n'+((f.reporterSource==='bargain'||f.pressFollowup==='spin')?'原專訪分歧仍保留，隔日答問意向不恢復合作。':'記者保留獨立追問，隔日答問不是新聞背書。');if(s.scene==='c02NextChapterBrief')return '待審閱第三章準備頁：\n'+endingBrief(s);if(s.scene==='c02ChapterEnd')return endingSummary(s).map(i=>`${i.title}｜${i.status}\n${i.detail}`).join('\n\n');return '';}
export function validEnding(s){const f=s.flags,keys=['c02EndingStarted','c02ClosingResponse','c02NextPreparation','c02EndingRecorded','c02EndingBrief'];if(!f.c02EndingStarted)return !keys.some(k=>f[k]!==undefined)&&!endingScenes[s.scene];
 if(f.c02EndingStarted!==true||!endingScenes[s.scene]||f.c02StageRecorded!==true)return false;
 if(s.scene==='c02ClosingNotice'?f.c02ClosingResponse!==undefined:!['attend','written'].includes(f.c02ClosingResponse))return false;
 if(['c02NextChapterBrief','c02ChapterEnd'].includes(s.scene)?!['facts','people'].includes(f.c02NextPreparation):f.c02NextPreparation!==undefined)return false;
 return s.scene==='c02ChapterEnd'?f.c02EndingRecorded===true&&f.c02EndingBrief===endingBrief(s):f.c02EndingRecorded===undefined&&f.c02EndingBrief===undefined;
}
