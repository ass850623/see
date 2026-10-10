import {commitments} from './chapter-meta.mjs';
import {availableCorrections} from './corrections.mjs';
import {followupPlanSummary} from './followup-plan.mjs';
export function handoffPages(s){const duties=commitments(s);const drafts=availableCorrections(s);const dissent=Object.entries(s.flags).filter(([k,v])=>k.startsWith('draftReview_')&&v==='reserve').length;return [
 '予澄關掉直播畫面，留下交接表。「今天的流程結束了，不代表案件結束。明天接手的人需要知道哪些是紀錄、哪些是草稿，哪些只是我們說過會做。」你把文件夾重新打開，沒有先貼上勝利或失敗的標籤。',
 `公共承諾仍有${duties.length}項待履行。${duties.map(c=>c.title+'｜'+c.due).join('；')||'本次沒有新增具體期限承諾，仍有案件調查待進行。'}。予澄要求交接表保留期限原文；不能因為寫不下，就把明日中午改成有空再說。`,
 drafts.length?`補件工作有${drafts.length}份。${drafts.map(t=>t.title+'：'+(s.flags['correction_'+t.id]==='ready'?'備妥審閱稿，未發布':'尚未備妥')).join('；')}。${followupPlanSummary(s)||'尚未確認後續責任，不能替任何人補上一個名字。'}。予澄把稿件與責任分開放，準備好了什麼，和誰會去做，是兩張不同的清單。`:'這份交接沒有補件桌新增的問題稿。予澄仍保留原聽證的補交、救助與調查事項；沒有發生的追問與分工，不會為了讓表格完整而補寫。',
 dissent?`審閱紀錄仍有${dissent}項保留異議。工會與記者的意見附在原稿旁，沒有被另存到看不見的地方。予澄說：「明天若有人問大家是不是都同意，這幾頁就是不能省略的答案。」`:'予澄保留已收到的審閱紀錄，也把尚未收到回覆的欄位留白。「沒有保留異議紀錄，不表示每個人都已審閱或同意。請讓接手的人看得出差別。」',
 '你準備離開時，一封自稱熟悉維護採購流程的信進入公共信箱。寄件者說，某份評估文件的受理編號可能與公開卷宗對不上，願意明日補充來源。信中沒有附可核對的原件，也沒有確認寄件者身分。這是待核對線索，不是已證明竄改或貪污。',
 '同一晚，救助窗口仍在等主管單位說明資格。予澄把來信放進「未核對」資料夾，沒有替它排除原承諾。「明日第一件事，可以先聯絡這個來源，也可以先追救助窗口。但優先處理一件，不等於另一件不必回覆。」第二日的選擇尚未開始，你先留下交接優先事項。'
 ];}
export function readHandoffPage(s){if(s.scene!=='chapterEnd'||s.flags.handoffPriority)throw new Error('目前不能繼續交接');const page=Number(s.flags.handoffPage||0);if(page>=handoffPages(s).length-1)throw new Error('已讀到優先事項');const next=structuredClone(s);next.flags.handoffPage=String(page+1);return next;}
export function chooseHandoffPriority(s,id){if(s.scene!=='chapterEnd'||s.flags.handoffPriority||!['source','relief'].includes(id)||Number(s.flags.handoffPage||0)!==handoffPages(s).length-1)throw new Error('請先完成交接閱讀');const next=structuredClone(s);next.flags.handoffPriority=id;next.note=id==='source'?'交接優先：明日核對來信來源與受理編號；原承諾仍待履行。':'交接優先：明日追蹤救助資格與窗口；來信仍待核對。';next.history.push({scene:s.scene,speaker:'林予澄',text:handoffPages(s).join('\n\n'),choice:next.note});return next;}
export function handoffSummary(s){return s.flags.handoffPriority==='source'?'第二日交接：優先核對維護來信，尚未驗證來源或取得原件。':s.flags.handoffPriority==='relief'?'第二日交接：優先追救助窗口，資格與資金仍未核定。':'';}
