import {inquiryScenes,readingScenes,accessScenes,roundScenes,validRound} from './chapter-two-round.mjs';
export {inquiryScenes,readingScenes,accessScenes,roundScenes} from './chapter-two-round.mjs';
const c=(id,text,next,flags={})=>({id,text,next,effects:{flags}});
export const executionScenes={
 c02ExecutionDesk:{place:'辦公室 · 工作約定執行桌',speaker:'林予澄',role:'幕僚長',portrait:'aide',
 beats:['予澄把上一輪的版本翻到簽名頁，再把人手表放在旁邊。「先分清楚我們能開始的工作。簽過工作方法，不代表輪值人員已經來了；沒簽，也不表示辦公室不能整理自己的公開資料。」','她留出兩欄：今天實際做了什麼，以及還要等誰回覆。協商桌上的文字不會直接搬進完成欄。原公開說明、證據使用範圍與承諾期限仍照舊。'],
 text:'依已簽或未簽狀態決定第一個動作。人員到任、來源身分與個案核定都須另有結果。',choices:[]},
 c02WorkList:{place:'辦公室 · 查證問題清單',speaker:'沈若川',role:'本土協進黨議員',portrait:'senior',
 beats:['你把工作清單縮成三個問題：目前能核對什麼、哪些資料尚缺，以及誰能回答一般程序。清單不附來源聯絡方式、個人申請資料或未發布草稿。','予澄提醒，公開問題和回答問題不是同一件事。提出問題可以邀請獨立查證，不能寫成記者已接受專訪，更不能把一般流程說成任何人的核定結果。'],
 text:'依本輪有效條款保存清單。只有已簽公開問題條款的路線，可在這次發布清單；其他路線保留內部草稿。',choices:[]},
 c02FirstReport:{place:'議會聯絡窗口 · 首輪工作回報',speaker:'林予澄',role:'幕僚長',portrait:'aide',
 beats:['傍晚前，聯絡窗口回覆了這輪紀錄。予澄沒有把收件回條當成整件事的成果；她把實際回報和原簽署頁分別保存，未簽的草案仍是未簽。','「第一輪有進度，但還有缺口。」她把非公開原卷、來源身分、利益調查與個案結果圈起來。「下一輪先追哪個，都不會讓其他項目自動消失。」'],
 text:'看完本輪實際回報，決定下一輪優先追蹤。此處只記錄工作方向，未安排新期限。',choices:[c('files','先追尚缺文件與原卷範圍，保留人手問題。','c02ExecutionEnd',{c02WorkNext:'files'}),c('staff','先追人手或修訂條件，保留文件缺口。','c02ExecutionEnd',{c02WorkNext:'staff'})]},
 c02ExecutionEnd:{place:'第二章首輪回報 · 原型暫停點',speaker:'林予澄',role:'幕僚長',portrait:'aide',terminal:true,
 text:'第一輪執行動作、查證清單與回報已保存。簽署與未簽路線各保留原狀，文件、到任與個案結果仍須追蹤。可接續文件缺口與人手條件的第二輪處理。',choices:[]}
};
export const canSendQuestions=s=>s.flags.c02ProposalOutcome==='limited'&&s.flags.c02BoundaryTerm==='questions';
export function questionListText(s){return (s.evidence.E07?.verified?'已核對的公開附件版本差異，還需要哪些原件才能判斷原因？':s.evidence.E07?'公開附件清單與原截圖尚未核對，應如何逐項比對？':'完整卷宗範圍仍待釐清，何時能交付可公開的附件清單？')+'\n非公開原卷尚未取得，哪些調閱範圍與程序仍待確認？\n一般替代文件說明如何適用，由正式窗口另行審核個案；本清單不包含個人資料。';}
export function executionOptions(s){const f=s.flags;
 if(s.scene==='c02ExecutionDesk')return f.c02ProposalOutcome==='counter'?[c('own','先整理辦公室公開資料，保留未簽草案。','c02WorkList',{c02WorkAction:'own'}),c('resend','送回修訂條件，請窗口確認收件。','c02WorkList',{c02WorkAction:'resend'})]:f.c02StaffTerm==='joint'?[c('confirm','確認共同席輪值名額與公開資料範圍。','c02WorkList',{c02WorkAction:'confirm'}),c('wait','暫不啟用共同席，先保留人選待確認。','c02WorkList',{c02WorkAction:'wait'})]:[c('sort','按約定由辦公室整理公開資料與窗口索引。','c02WorkList',{c02WorkAction:'sort'})];
 if(s.scene==='c02WorkList')return [c('internal','保留內部問題清單，不在本輪發布。','c02FirstReport',{c02ListDisposition:'internal'}),...(canSendQuestions(s)?[c('send','發布這份查證問題清單，保留獨立追問。','c02FirstReport',{c02ListDisposition:'sent',c02SentQuestions:questionListText(s)})]:[])];return executionScenes[s.scene]?.choices||[];
}
export function executionSummary(s){const f=s.flags,reported=['c02FirstReport','c02ExecutionEnd'].includes(s.scene)||f.c02RoundStarted;return [
 {title:'首輪動作與實際回報',status:reported?{confirm:'輪值名額已確認 · 尚未到任',wait:'共同席暫未啟用 · 人選待確認',sort:'公開索引初步整理完成',own:'辦公室公開資料初整 · 草案未簽',resend:'修訂條件已收件 · 仍未簽署'}[f.c02WorkAction]||'待選執行動作':f.c02WorkAction?'動作已記錄 · 回報待收':'待選執行動作',detail:!reported?'本輪尚未收到回報，名額、整理與收件結果均保留待確認。':f.c02WorkAction==='confirm'?'周岳確認一個受限輪值名額，範圍僅公開資料與窗口；人選與實際到任仍待追蹤。':f.c02WorkAction==='resend'?'窗口回覆已收到修訂條件；沒有回覆同意或新簽署。':f.c02WorkAction==='wait'?'窗口保留共同席需求，沒有確認名額、人選或到任。':'予澄完成公開索引初整，缺件欄保留；沒有新增非公開原卷或核實來源。'},
 {title:'本輪查證問題清單',status:f.c02ListDisposition==='sent'?'問題清單已發布':f.c02ListDisposition==='internal'?'內部清單已保存 · 未發布':'清單待決定',detail:f.c02SentQuestions||questionListText(s)},
 {title:'下一輪優先方向',status:f.c02WorkNext==='files'?'先追文件與原卷範圍':f.c02WorkNext==='staff'?'先追人手與修訂條件':'尚未選定',detail:'其他缺口與原承諾仍保留，沒有新增履行期限或個案核定。'}
 ];}
export function executionReaction(s){const f=s.flags;
 if(s.scene==='c02ExecutionDesk')return f.c02ProposalOutcome==='counter'?'上一輪保留修訂，尚未簽署；共同席與公開問題條款都未生效。':f.c02StaffTerm==='joint'?'已有受限共同席工作方法，名額、人選與到任仍須分開確認。':'已有自行整理與窗口轉介約定；沒有新增黨團到任人手。';
 if(s.scene==='c02WorkList')return '待保存或發布的問題清單：\n'+questionListText(s)+'\n'+(canSendQuestions(s)?'已簽公開問題條款，可選本輪發布。':'沒有本輪公開問題條款，本次只提供內部保存。')+'\n'+((f.reporterSource==='bargain'||f.pressFollowup==='spin')?'原專訪合作仍暫停，發布清單不會自動恢復。':'記者保持獨立查證，發布清單不等於背書。');
 if(['c02FirstReport','c02ExecutionEnd'].includes(s.scene))return executionSummary(s).map(i=>`${i.title}｜${i.status}\n${i.detail}`).join('\n\n');return '';
}
export function validExecution(s){const f=s.flags,keys=['c02ExecutionStarted','c02WorkAction','c02ListDisposition','c02SentQuestions','c02WorkNext'];
 if(!validRound(s))return false;
 if(!f.c02ExecutionStarted)return !keys.some(k=>f[k]!==undefined)&&!executionScenes[s.scene];
 if(f.c02ExecutionStarted!==true||(!executionScenes[s.scene]&&!roundScenes[s.scene]&&!accessScenes[s.scene]&&!readingScenes[s.scene]&&!inquiryScenes[s.scene])||!['limited','counter'].includes(f.c02ProposalOutcome))return false;
 const actions=f.c02ProposalOutcome==='counter'?['own','resend']:f.c02StaffTerm==='joint'?['confirm','wait']:['sort'];
 if(s.scene==='c02ExecutionDesk'?f.c02WorkAction!==undefined:!actions.includes(f.c02WorkAction))return false;
 const listed=['c02FirstReport','c02ExecutionEnd'].includes(s.scene)||f.c02RoundStarted;
 if(listed?!['internal',...(canSendQuestions(s)?['sent']:[])].includes(f.c02ListDisposition):f.c02ListDisposition!==undefined)return false;
 if(f.c02ListDisposition==='sent'?f.c02SentQuestions!==questionListText(s):f.c02SentQuestions!==undefined)return false;
 return s.scene==='c02ExecutionEnd'||f.c02RoundStarted?['files','staff'].includes(f.c02WorkNext):f.c02WorkNext===undefined;
}
