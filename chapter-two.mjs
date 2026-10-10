import {commitments} from './chapter-meta.mjs';
const c=(id,text,next,flags={})=>({id,text,next,effects:{flags}});
export const chapterTwoScenes={
 c02Morning:{place:'第二章 · 辦公室 · 第 2 日 08:10',speaker:'林予澄',role:'幕僚長',portrait:'aide',
 beats:['雨停了一個鐘頭，窗沿還滴著水。你走進辦公室時，予澄已經把昨天的聽證逐字稿和公共信箱分開放好。桌上沒有新的勝利標語，只有幾張寫著日期的便條。','她把手機螢幕轉向你。昨天的片段仍在流傳，有人只留下你的承諾，有人把更正剪掉。那不是今天能一鍵清除的東西；受影響的人等的是回覆，不是另一支漂亮影片。','「我們先處理一件。」予澄說，「昨天答應了什麼，今天知道了什麼，都要分開寫。若主管單位還沒回信，就不能用我們已經聯絡過代替事情已經辦好。」'],
 text:'今天先開一張承諾追蹤單。昨天留下的期限、資料授權和分工都保留；你可以先查看承諾簿，再決定這個早晨的第一件工作。',choices:[c('open','打開今日追蹤桌。','c02Board')]},
 c02Board:{place:'辦公室 · 今日追蹤桌',speaker:'林予澄',role:'幕僚長',portrait:'aide',
 beats:['予澄沒有把所有欄位都塗成進行中。「接了電話、送出稿件、收到主管機關答覆，是三個不同的時間點。我們今天只能先跟進一項，其他項目仍然列著。」','她把昨晚的暫排分工夾在清單後面。名字寫上去，不代表對方已完成工作；沒有排到人的項目，也不能因為天亮就消失。'],
 text:'選擇一項原有承諾先跟進。這只決定本次原型的工作焦點，不會取消其他承諾，也不會自動公開證據或稿件。',choices:[]},
 c02Contact:{place:'辦公室 · 回覆草稿桌',speaker:'沈若川',role:'本土協進黨議員',portrait:'senior',
 beats:['公共信箱裡有一封追問：「昨天說會處理，今天可以告訴我們到哪裡了嗎？」信很短，沒有新的事故證據，也沒有替任何人放寬公開條件。','你把原承諾放在草稿旁。最容易寫的句子是「已經妥善處理」，卻不是你現在能證明的句子。予澄圈出尚未收到答覆的部分，等你決定這次是否先回覆。'],
 text:'可以先送出一封只說明現況與限制的追蹤回覆，也可以先補核對、暫不送出。這封信不替代正式更正稿、救助審核、外援報告或作證同意。',choices:[c('reply','送出現況回覆，明列仍待確認的部分。','c02Response',{c02Action:'reply'}),c('verify','先補核對，暫不送出回覆。','c02Response',{c02Action:'verify'})]},
 c02Response:{place:'辦公室 · 聯絡紀錄',speaker:'林予澄',role:'幕僚長',portrait:'aide',
 beats:['予澄打開聯絡紀錄，把這次動作和原承諾分成兩列。送出訊息能證明我們曾回覆，不能證明對方已收到、同意或拿到結果。','她指著下一次追蹤欄。「可以把這件事排進下一輪確認，也可以先留下尚未安排。若沒有實際日期，就不要替它造一個時間。」'],
 text:'是否把本次焦點列入下一輪追蹤？本原型尚未實作主管單位答覆或正式履行，原期限不會因為安排追蹤而延後。',choices:[c('schedule','列入下一輪追蹤，保留原期限。','c02End',{c02Next:'scheduled'}),c('leave','保留未安排狀態，列出缺少的確認。','c02End',{c02Next:'unassigned'})]},
 c02End:{place:'第二章開場 · 原型暫停點',speaker:'林予澄',role:'幕僚長',portrait:'aide',terminal:true,
 text:'早晨的第一筆聯絡紀錄已保存。這裡是第二章開場原型的暫停點，後續調查、正式發布與主管單位回覆尚未開放。可查看承諾簿、存檔或返回主畫面。',choices:[]}
};
export function secondChapterOptions(s){const items=commitments(s);return (items.length?items:[{id:'investigation',title:'確認事故調查窗口與尚缺資料'}]).map(item=>c(item.id,'先跟進：'+item.title,'c02Contact',{c02Focus:item.id}));}
export function secondChapterReaction(s){if(s.chapter!=='c02')return '';const f=s.flags;
 if(s.scene==='c02Morning')return (f.handoffPriority==='source'?'昨晚留下的優先意向是核對維護來信；來源與原件仍未核實。':f.handoffPriority==='relief'?'昨晚留下的優先意向是追蹤救助窗口；資格與資金仍未核定。':'昨晚沒有留下交接優先意向；今天由你決定先跟進的工作。')+'\n'+(f.unsupportedClaim?'予澄把尚未更正的證據不足指控放在清單最上方：「先別讓今天的回覆重複昨天的指控。」':f.hearingAnswer==='party'?'工會仍要求補上被省略的完整脈絡；新的聯絡不會抹去昨天的說法。':'昨天的聽證紀錄保留，事故動機與責任仍待正式調查。');
 const item=commitments(s).find(c=>c.id===f.c02Focus);const focus=item?`${item.title}\n原期限：${item.due}\n原範圍：${item.detail}`:'確認事故調查窗口與尚缺資料；本次沒有新增期限承諾。';
 if(s.scene==='c02Contact')return '本次焦點：'+focus;
 if(['c02Response','c02End'].includes(s.scene))return '本次焦點：'+focus+'\n'+(f.c02Action==='reply'?'一封現況追蹤回覆已送入原聯絡窗口；收件、對方答覆與實際結果仍待確認，正式稿件沒有自動發布。':'核對工作已記入追蹤單，回覆尚未送出；原承諾仍待履行。')+(s.scene==='c02End'?'\n'+(f.c02Next==='scheduled'?'已列入下一輪追蹤，日期尚未安排；原期限保留。':'下一輪追蹤尚未安排，未確認事項保留。'):'');
 return '';
}
export function validSecondChapter(s){const f=s.flags;const keys=['c02Started','c02Focus','c02Action','c02Next'];
 if(s.chapter==='c01')return !keys.some(k=>f[k]!==undefined);
 if(!chapterTwoScenes[s.scene]||f.c02Started!==true||s.slots!==0||!s.evidence.E02?.verified||!s.evidence.E03?.verified)return false;
 const focused=['c02Contact','c02Response','c02End'].includes(s.scene),acted=['c02Response','c02End'].includes(s.scene);
 if(focused?!secondChapterOptions(s).some(c=>c.id===f.c02Focus):f.c02Focus!==undefined)return false;
 if(acted?!['reply','verify'].includes(f.c02Action):f.c02Action!==undefined)return false;
 return s.scene==='c02End'?['scheduled','unassigned'].includes(f.c02Next):f.c02Next===undefined;
}
