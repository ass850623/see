import {endingScenes,validEnding} from './chapter-two-ending.mjs';
export {endingScenes} from './chapter-two-ending.mjs';
const c=(id,text,next,flags={})=>({id,text,next,effects:{flags}});
export const stageScenes={
 c02CheckReply:{place:'辦公室 · 內部核對回覆',speaker:'林予澄',role:'幕僚長',portrait:'aide',
 beats:['予澄先看問題稿的處理欄。列入核對的那份，安禾與辦公室已按現有材料整理內部回覆；只存草稿的那份，還沒有啟動回覆工作。她沒有替未安排的工作補上一封信。','這一輪回答的範圍只及於已有程序與資料。來源身分、修訂原因和事故動機沒有新佐證，原卷與私人資料仍受各自的使用界線限制。'],
 text:'先核對本輪有沒有實際回覆，再決定保存、追問或繼續保留草稿。',choices:[]},
 c02StageBoard:{place:'辦公室 · 第二章階段工作板',speaker:'沈若川',role:'本土協進黨議員',portrait:'senior',
 beats:['窗外的燈亮起，予澄把這一天的紀錄收成幾疊：公開答覆、私人來信、受限資料與工作安排。看起來仍然很厚，但她終於能指出哪一張紙回答了哪個問題。','港口的人還等救助結果，記者還保留追問，黨團還有利益調查分歧。你只能選一個接下來優先推進的方向；其他未決事項仍列著，不會因為整理成冊而消失。'],
 text:'選擇下一段工作的優先方向。這只是交接意向，沒有新增期限或宣布第二章案件全部完成。',choices:[c('files','先推進原卷與限制處理，保留其他未決事項。','c02StageReview',{c02StagePriority:'files'}),c('source','先核對來源與原件，保留文件與救助缺口。','c02StageReview',{c02StagePriority:'source'}),c('relief','先回到救助個案窗口，保留來源與原卷問題。','c02StageReview',{c02StagePriority:'relief'})]},
 c02StageReview:{place:'辦公室 · 第二章階段整理審閱',speaker:'林予澄',role:'幕僚長',portrait:'aide',
 beats:['予澄逐項讀出階段紀錄，把已收到、已核對、已發布、已到任和仍待處理分開。「這份是我們辦公室的整理，不是調查結論，也不是對外發稿。」','她把原承諾與期限夾在最後一頁。私人來信和受限筆記沒有作成可公開附件，原公開說明保留原文，沒有用新整理去覆蓋舊發言。'],
 text:'審閱以下階段整理，再保存交接意向。',choices:[]},
 c02StageEnd:{place:'第二章階段整理 · 原型暫停點',speaker:'林予澄',role:'幕僚長',portrait:'aide',terminal:true,
 text:'內部核對處理與第二章階段整理已保存。這是開發原型的階段暫停，來源、原卷、救助及原承諾仍有未決事項。可接續第二章收束事件與第三章開場準備。',choices:[]}
};
export function internalReplyText(s){return {flow:'收件欄記錄受理登錄，移交欄記錄工作流轉，修訂登錄是另一筆流程紀錄。這些欄位不直接辨認實際經手者，也不說明修訂原因。',handoff:'現有公開索引只能核對文號與登錄順序；移交細節仍須符合閱覽範圍的原卷欄位佐證。日期相同不等於同一個人經手。',access:'已有交涉與安排結果須分開追蹤；下一次閱覽仍要確認有效範圍與時段。內部核對沒有新增時段、原卷複本或公開權限。',limits:'E08 說明公開附件與非公開原卷的申請界線，分項理由可沿既有管道追問或覆核。這份內部整理不替窗口作新的覆核決定。'}[s.flags.c02InternalTopic]+'\n這是辦公室與安禾核對現有材料後的內部回覆；沒有新的來源身分、事故動機或個案核定結果。';}
export function stageOptions(s){const f=s.flags;if(s.scene==='c02CheckReply')return f.c02QuestionDisposition==='review'?[c('record','保存已收到的內部回覆，保留未解問題。','c02StageBoard',{c02CheckOutcome:'received',c02InternalReply:internalReplyText(s)}),c('clarify','保存回覆，再列需補釐清的問題。','c02StageBoard',{c02CheckOutcome:'clarifying',c02InternalReply:internalReplyText(s)})]:[c('schedule','現在列入內部核對，回覆另行追蹤。','c02StageBoard',{c02CheckOutcome:'late-request'}),c('keep','繼續保存草稿，保留核對未安排。','c02StageBoard',{c02CheckOutcome:'kept'})];
 if(s.scene==='c02StageReview')return [c('save','保存階段整理與下一段優先意向。','c02StageEnd',{c02StageRecorded:true,c02StageText:stageText(s)})];return stageScenes[s.scene]?.choices||[];}
export function stageText(s){const f=s.flags;return [
 '內部核對：'+({received:'內部回覆已保存，未解問題保留。',clarifying:'內部回覆已保存，補釐清待回。','late-request':'本輪才列入核對，尚未收到回覆。',kept:'草稿繼續保留，核對仍未安排。'}[f.c02CheckOutcome]),
 '公開資料：E07 '+(s.evidence.E07?.verified?'已核對。':s.evidence.E07?'已取得但尚未核實。':'尚未取得。')+'E08 公開程序答覆已保存。',
 '私人與受限資料：E09 仍未核實、未授權公開；'+(s.evidence.E10?'E10 已核對但未授權公開，沒有原卷複本。':'本輪沒有 E10 閱覽筆記。'),
 '公開紀錄：'+(f.c02PublicDisposition==='published'?'本次補充說明已發布。':'補充說明仍是未發布草稿。')+(f.c02ListDisposition==='sent'?'查證問題清單已發布。':'查證問題清單只在內部保存。')+'原文不改寫，本整理沒有對外發布。',
 '人手與協商：'+(f.c02RoundStaff==='active'?'輪值已到任，只處理公開索引與窗口。':f.c02RoundStaff==='request'?'名額已確認，人選與到任待定。':'沒有新增已到任輪值人手。')+(f.c02ProposalOutcome==='limited'?'有限工作方法已簽署。':'修訂仍未簽署。')+'利益分歧仍保留。',
 '日期與來源：'+(f.c02DateResult==='compared'?'公開收件與修訂順序已分列核對。':'日期問題尚未判定。')+'來源身分、原件來源、修訂原因與事故動機尚未確認。',
 '救助與承諾：只有一般書面程序答覆，沒有個案核定或撥款結果；原正式更正、完整聽證紀錄及各項承諾仍按原範圍與期限追蹤。',
 '下一段優先意向：'+({files:'原卷與限制處理',source:'來源與原件核對',relief:'救助個案窗口'}[f.c02StagePriority])+'；未另排日期，其他未決事項保留。'
 ].join('\n');}
export function stageSummary(s){const f=s.flags;return [
 {title:'內部核對處理',status:{received:'內部回覆已保存',clarifying:'回覆已保存 · 補釐清待回','late-request':'本輪已列核對 · 回覆待收',kept:'草稿保留 · 核對未安排'}[f.c02CheckOutcome]||'本輪待處理',detail:f.c02InternalReply||'沒有保存已收到的內部回覆；不補寫答案。'},
 {title:'第二章階段整理',status:f.c02StageRecorded?'內部階段整理已保存':f.c02StagePriority?'階段整理待審閱':'優先意向尚未選定',detail:f.c02StageText||(f.c02StagePriority?stageText(s):'沒有對外發布，原公開紀錄與承諾期限保留。')}
 ];}
export function stageReaction(s){const f=s.flags;if(s.scene==='c02CheckReply')return f.c02QuestionDisposition==='review'?'本輪已收到的內部回覆：\n'+internalReplyText(s):'前輪只保存草稿，沒有核對回覆；可現在列入核對，或繼續保留。';if(s.scene==='c02StageReview')return '待審閱階段整理：\n'+stageText(s);if(['c02StageBoard','c02StageEnd'].includes(s.scene))return stageSummary(s).map(i=>`${i.title}｜${i.status}\n${i.detail}`).join('\n\n');return '';}
export function validStage(s){const f=s.flags,keys=['c02StageStarted','c02CheckOutcome','c02InternalReply','c02StagePriority','c02StageRecorded','c02StageText'];if(!validEnding(s))return false;if(!f.c02StageStarted)return !keys.some(k=>f[k]!==undefined)&&!stageScenes[s.scene];
 if(f.c02StageStarted!==true||(!stageScenes[s.scene]&&!endingScenes[s.scene])||!['review','draft'].includes(f.c02QuestionDisposition))return false;
 if(s.scene==='c02CheckReply'?f.c02CheckOutcome!==undefined:!(f.c02QuestionDisposition==='review'?['received','clarifying']:['late-request','kept']).includes(f.c02CheckOutcome))return false;
 if(['received','clarifying'].includes(f.c02CheckOutcome)?f.c02InternalReply!==internalReplyText(s):f.c02InternalReply!==undefined)return false;
 const focused=['c02StageReview','c02StageEnd'].includes(s.scene)||f.c02EndingStarted;if(focused?!['files','source','relief'].includes(f.c02StagePriority):f.c02StagePriority!==undefined)return false;
 return s.scene==='c02StageEnd'||f.c02EndingStarted?f.c02StageRecorded===true&&f.c02StageText===stageText(s):f.c02StageRecorded===undefined&&f.c02StageText===undefined;
}
