import {readingScenes,validReading} from './chapter-two-reading.mjs';
export {readingScenes} from './chapter-two-reading.mjs';
const c=(id,text,next,flags={},evidence={})=>({id,text,next,effects:{flags,evidence}});
const reply={E09:{verified:false,authorized:false}};
export const accessScenes={
 c02AccessTalk:{place:'正式受理窗口 · 原卷限制交涉',speaker:'許安禾',role:'港口通訊技師',portrait:'worker',
 beats:['窗口把前次 E08 答覆附在新信後，要求你區分附件清單、值班資料與個人紀錄。安禾逐項對照申請。「不能把所有不給的東西都說成被藏起來，也不能因為有個資就連限制理由都不問。」','原公開資料的使用範圍保留。這次談的是原卷限制如何處理；即使取得閱覽安排，也不等於拿到可複製、可公開的原卷。'],
 text:'依上一輪申請方向，選擇這次交涉方式。',choices:[]},
 c02SourceReply:{place:'辦公室 · 來源補充回信',speaker:'林予澄',role:'幕僚長',portrait:'aide',
 beats:['來源的聯絡管道又出現一封短回信。予澄先把它放進私人資料夾，沒有轉給輪值席或採訪聯絡人。「這是新來信，不是這個人終於被證明可信。」','信中提到一個可公開查到的受理日期，卻沒有交付原件或身分證明。你可以獨立查核那筆公開登錄，也可以先保留信件。查到日期存在，只能支持日期與登錄這一點。'],
 text:'E09 保存這封未核實、未獲公開授權的私人補充回信。如何處理可核對部分？',choices:[c('check','獨立查核公開受理日期，保留來源未核實。','c02LeadReview',{c02SourceFollowup:'check'}),c('hold','保存私人回信，暫不查核或對外引用。','c02LeadReview',{c02SourceFollowup:'hold'})]},
 c02LeadReview:{place:'辦公室 · 新線索與閱覽整理',speaker:'許安禾',role:'港口通訊技師',portrait:'worker',
 beats:['安禾把程序進展、公開登錄與來源自述分成三列。「同一天有一筆收件，不足以證明寫信的人經手過文件。更不能直接推成事故有人策劃。」','予澄問你，接下來要先整理哪些問題。可以把已知日期與既有公開資料做內部比對，也可以先集中處理原卷的閱覽或限制理由。兩條都不會讓 E09 變成可公開證據。'],
 text:'選下一輪核對重點，保存本次交涉與回信結果。未讀原卷與私人來信不會因選擇而取得公開權限。',choices:[c('timeline','先列內部日期比對問題，保留原卷缺口。','c02AccessEnd',{c02AccessNext:'timeline'}),c('access','先追閱覽或限制理由，保留日期線索。','c02AccessEnd',{c02AccessNext:'access'})]},
 c02AccessEnd:{place:'第二章原卷交涉與來源回信 · 原型暫停點',speaker:'林予澄',role:'幕僚長',portrait:'aide',terminal:true,
 text:'原卷限制交涉與來源補充回信已保存。程序進展、公開日期與來源身分仍各有界線；私人回信未公開。可接續受限閱覽與日期交叉核對。',choices:[]}
};
export function accessOptions(s){return s.flags.c02RoundFiles==='public'?[c('onsite','接受受限閱覽安排，另確認時間與範圍。','c02SourceReply',{c02AccessAction:'onsite'},reply),c('defer','暫不接受閱覽安排，要求書面釐清範圍。','c02SourceReply',{c02AccessAction:'defer'},reply)]:[c('appeal','要求覆核分項限制理由，保留完整需求。','c02SourceReply',{c02AccessAction:'appeal'},reply),c('split','拆列公開與非公開需求，另談受限閱覽。','c02SourceReply',{c02AccessAction:'split'},reply)];}
export function accessSummary(s){const f=s.flags;return [
 {title:'原卷限制交涉',status:{onsite:'受限閱覽方式已接受 · 時間範圍待確認',defer:'閱覽暫未接受 · 書面範圍待回',appeal:'分項限制覆核已收件 · 結果待回',split:'需求已拆列 · 閱覽方式待談'}[f.c02AccessAction]||'本輪待交涉',detail:'沒有新增原卷複本、正式事故結論或公開原卷授權；E08 程序答覆保留。'},
 {title:'私人補充回信 E09',status:f.c02SourceFollowup==='check'?'公開受理日期已查核 · 來源仍未核實':f.c02SourceFollowup==='hold'?'回信已保存 · 尚未查核':s.evidence.E09?'私人回信已收到 · 待決定查核':'尚未收到本輪回信',detail:f.c02SourceFollowup==='check'?'公開索引確有所述日期的收件登錄，但不能連結寄件者身分、原件或事故動機；E09 本身未核實且無公開授權。':'回信自述與身分尚未核實，沒有原件或公開同意；不交付輪值席或記者。'},
 {title:'下輪核對方向',status:f.c02AccessNext==='timeline'?'先列內部日期比對問題':f.c02AccessNext==='access'?'先追閱覽與限制理由':'尚未選定',detail:'保留原承諾、來源保護、人手範圍與原期限。'}
 ];}
export function accessReaction(s){const f=s.flags;if(s.scene==='c02AccessTalk')return f.c02RoundFiles==='public'?'公開範圍補申請後，窗口提出可談受限閱覽方式，沒有交付原卷。':'分項限制說明指出值班與個人資料須另審；你可以覆核理由或拆列需求。';if(s.scene==='c02SourceReply')return f.c02SourceQuestion==='records'?'這封回信延續先前的日期追問，仍只補充自述與公開索引線索；沒有身分或原件佐證。':'先前追問已暫停，這次是來源主動補充；收到回信不代表恢復具名作證或取得公開同意。';if(['c02LeadReview','c02AccessEnd'].includes(s.scene))return accessSummary(s).map(i=>`${i.title}｜${i.status}\n${i.detail}`).join('\n\n');return '';}
export function validAccess(s){const f=s.flags,keys=['c02AccessStarted','c02AccessAction','c02SourceFollowup','c02AccessNext'];if(!validReading(s))return false;if(!f.c02AccessStarted)return !keys.some(k=>f[k]!==undefined)&&!accessScenes[s.scene]&&!s.evidence.E09;
 if(f.c02AccessStarted!==true||(!accessScenes[s.scene]&&!readingScenes[s.scene])||f.c02RoundRecorded!==true)return false;
 const acted=s.scene!=='c02AccessTalk';if(acted?!accessOptions(s).some(o=>o.effects.flags.c02AccessAction===f.c02AccessAction):f.c02AccessAction!==undefined)return false;
 const e=s.evidence.E09;if(acted?!(e?.verified===false&&e?.authorized===false):e!==undefined)return false;
 if((['c02LeadReview','c02AccessEnd'].includes(s.scene)||f.c02ReadingStarted)?!['check','hold'].includes(f.c02SourceFollowup):f.c02SourceFollowup!==undefined)return false;
 return s.scene==='c02AccessEnd'||f.c02ReadingStarted?['timeline','access'].includes(f.c02AccessNext):f.c02AccessNext===undefined;
}
