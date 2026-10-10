import {inquiryScenes,validInquiry} from './chapter-two-inquiry.mjs';
export {inquiryScenes} from './chapter-two-inquiry.mjs';
const c=(id,text,next,flags={},evidence={})=>({id,text,next,effects:{flags,evidence}});
export const readingScenes={
 c02ReadingDesk:{place:'辦公室 · 閱覽與日期核對桌',speaker:'林予澄',role:'幕僚長',portrait:'aide',
 beats:['予澄把上一輪交涉回信放在桌角。這次窗口已回覆閱覽或限制處理的進度，公開受理索引也能重新核對；兩件事要分開完成。','她把私人來信留在辦公室的資料夾。「日期能比，身分不能靠日期猜。輪值席仍只處理公開索引，不接觸來信或受限筆記。」'],
 text:'依上一輪選定重點，先處理閱覽進度或日期核對，再完成另一項。',choices:[]},
 c02RestrictedRead:{place:'正式窗口 · 受限閱覽與限制回覆',speaker:'許安禾',role:'港口通訊技師',portrait:'worker',
 beats:['窗口回覆的是你上一輪實際選擇的交涉方式。安禾先確認回覆範圍，再把它與閱覽安排對照。可以讀到什麼、可以抄記什麼、可以公開什麼，仍是不同的權限。','若完成受限閱覽，工作筆記只保存允許抄記的流程欄位；值班姓名與私人資料遮蔽，原卷不能拍照、複製或對外散布。未談妥閱覽者則只處理安排或限制理由，不補出一份沒有看過的筆記。'],
 text:'依有效安排選擇本輪動作。受限工作筆記即使核對過，也沒有公開授權。',choices:[]},
 c02DateCrosscheck:{place:'辦公室 · 公開受理日期交叉核對',speaker:'沈若川',role:'本土協進黨議員',portrait:'senior',
 beats:['公開索引把收件與修訂登錄列成不同欄位：收件在事發前三日，修訂登錄在事發前一日。把修訂日當成第一次收件日，會把事情的先後順序改掉。','你可以逐項核對公開日期，或先保存待核對問題。即使來信提到其中一個日期，也不能證明寄件者經手文件，更不能用這兩個日期證明事故有人策劃。'],
 text:'如何處理收件日與修訂登錄日？本次只核對公開索引的順序，不替私人來信確認身分或公開原卷。',choices:[c('compare','分列收件日與修訂登錄日，核對先後順序。','c02ReadingDesk',{c02DateResult:'compared'}),c('hold','保存日期問題，暫不作先後判定。','c02ReadingDesk',{c02DateResult:'held'})]},
 c02ReadingReport:{place:'辦公室 · 閱覽與日期結果整理',speaker:'林予澄',role:'幕僚長',portrait:'aide',
 beats:['予澄把閱覽進展與日期核對放成兩列，沒有把新的流程筆記貼到公開發言稿。「我們更接近能問清楚的問題了，不是突然拿到所有答案。」','原公開說明與問題清單保留原文。這次的內部結果若要另行使用，仍須符合自己的範圍；來源身分、個案結果與利益調查沒有因此完成。'],
 text:'保存本輪可支持的結果與仍缺的材料。',choices:[c('record','保存閱覽與日期核對結果，保留使用界線。','c02ReadingEnd',{c02ReadingRecorded:true})]},
 c02ReadingEnd:{place:'第二章受限閱覽與日期核對 · 原型暫停點',speaker:'林予澄',role:'幕僚長',portrait:'aide',terminal:true,
 text:'閱覽或限制進展、公開日期核對結果已保存。受限筆記與私人回信沒有公開授權，來源及事故動機仍未確認。可接續內部追問與調查問題整理。',choices:[]}
};
export function restrictedOptions(s){switch(s.flags.c02AccessAction){
 case 'onsite':return [c('read','完成已確認範圍的受限閱覽，保存流程欄位筆記。','c02ReadingDesk',{c02ReadResult:'read'},{E10:{verified:true,authorized:false}}),c('postpone','暫緩本次閱覽，保留已確認範圍。','c02ReadingDesk',{c02ReadResult:'postponed'})];
 case 'defer':return [c('arrange','接受書面釐清的範圍，另排受限閱覽。','c02ReadingDesk',{c02ReadResult:'arranged'}),c('clarify','繼續詢問遮蔽與筆記界線，暫不排閱覽。','c02ReadingDesk',{c02ReadResult:'clarifying'})];
 case 'appeal':return [c('narrow','依覆核回覆縮列可談閱覽欄位，保留異議。','c02ReadingDesk',{c02ReadResult:'narrowed'}),c('maintain','維持完整需求與分項異議，另等處理。','c02ReadingDesk',{c02ReadResult:'reviewing'})];
 default:return [c('confirm','確認拆列需求的閱覽條件，另等時間安排。','c02ReadingDesk',{c02ReadResult:'conditions'}),c('wait','保留拆列需求，暫不接受閱覽條件。','c02ReadingDesk',{c02ReadResult:'split-pending'})];
 }}
export function readingOptions(s){if(s.scene==='c02RestrictedRead')return restrictedOptions(s);if(s.scene!=='c02ReadingDesk')return readingScenes[s.scene]?.choices||[];const f=s.flags,done=f.c02ReadResult||f.c02DateResult;return [!f.c02ReadResult&&(done||f.c02AccessNext==='access')?c('reading','處理受限閱覽與限制回覆。','c02RestrictedRead'):null,!f.c02DateResult&&(done||f.c02AccessNext==='timeline')?c('dates','核對公開收件與修訂日期。','c02DateCrosscheck'):null].filter(Boolean);}
export function readingSummary(s){const f=s.flags;return [
 {title:'受限閱覽與限制進度',status:{read:'受限閱覽已完成 · E10 未授權公開',postponed:'閱覽已暫緩 · 沒有工作筆記',arranged:'範圍已接受 · 閱覽待安排',clarifying:'筆記界線仍待釐清',narrowed:'欄位已縮列 · 異議保留',reviewing:'完整需求異議保留 · 未閱覽',conditions:'拆列條件已確認 · 時間待排','split-pending':'拆列需求保留 · 條件未接受'}[f.c02ReadResult]||'本輪待處理',detail:f.c02ReadResult==='read'?'E10 記錄准許抄記的收件與流程欄位；流程列有收件、移交與修訂登錄，未包含姓名或原因認定。沒有原卷複本或公開權限。':'本輪沒有受限閱覽筆記，不把程序回覆當成讀過原卷。'},
 {title:'公開日期交叉核對',status:f.c02DateResult==='compared'?'收件與修訂日期已分列核對':f.c02DateResult==='held'?'日期問題已保存 · 尚未判定':'本輪待核對',detail:f.c02DateResult==='compared'?'公開索引收件為事發前三日，修訂登錄為前一日，收件早於修訂；這僅支持登錄順序，不證明來源身分或事故動機。':'保留收件與修訂日期問題；不新增核實結論或來源同意。'}
 ];}
export function readingReaction(s){const f=s.flags;if(s.scene==='c02ReadingDesk')return '上一輪重點：'+(f.c02AccessNext==='access'?'先追閱覽與限制理由。':'先列日期核對問題。');if(s.scene==='c02RestrictedRead')return {onsite:'窗口已確認本次時段與允許抄記的流程欄位，可選完成閱覽或暫緩。',defer:'書面範圍釐清已收到，尚未安排閱覽時段；本輪可接受範圍或繼續追問。',appeal:'覆核回覆保留值班與個人資料限制，列出可談的流程欄位；沒有完整交付。',split:'公開與非公開需求已分列回覆，本輪只能談條件，尚未排閱覽時段。'}[f.c02AccessAction];if(s.scene==='c02DateCrosscheck')return (f.c02SourceFollowup==='check'?'前輪只查到公開日期有收件登錄，本輪可進一步區分收件與修訂。':'前輪私人回信尚未查核，本輪可先核對公開索引，不替回信背書。')+'\n'+(s.evidence.E07?.verified?'既有 E07 版本核對保留，本輪只核對公開日期欄位。':'E07 缺件或尚未核實的狀態保留；查到公開索引日期不等於取得或核實附件清單。');if(['c02ReadingReport','c02ReadingEnd'].includes(s.scene))return readingSummary(s).map(i=>`${i.title}｜${i.status}\n${i.detail}`).join('\n\n');return '';}
export function validReading(s){const f=s.flags,keys=['c02ReadingStarted','c02ReadResult','c02DateResult','c02ReadingRecorded'];if(!validInquiry(s))return false;if(!f.c02ReadingStarted)return !keys.some(k=>f[k]!==undefined)&&!readingScenes[s.scene]&&!s.evidence.E10;
 if(f.c02ReadingStarted!==true||(!readingScenes[s.scene]&&!inquiryScenes[s.scene])||!['timeline','access'].includes(f.c02AccessNext))return false;
 if(f.c02ReadResult!==undefined&&!restrictedOptions(s).some(o=>o.effects.flags.c02ReadResult===f.c02ReadResult))return false;
 if(f.c02DateResult!==undefined&&!['compared','held'].includes(f.c02DateResult))return false;
 const both=Boolean(f.c02ReadResult&&f.c02DateResult),report=['c02ReadingReport','c02ReadingEnd'].includes(s.scene)||f.c02InquiryStarted;if(report?!both:both)return false;
 if(s.scene==='c02RestrictedRead'&&(f.c02ReadResult||(f.c02AccessNext==='timeline'&&!f.c02DateResult)))return false;
 if(s.scene==='c02DateCrosscheck'&&(f.c02DateResult||(f.c02AccessNext==='access'&&!f.c02ReadResult)))return false;
 if(f.c02AccessNext==='access'&&f.c02DateResult&&!f.c02ReadResult||f.c02AccessNext==='timeline'&&f.c02ReadResult&&!f.c02DateResult)return false;
 const e=s.evidence.E10;if(f.c02ReadResult==='read'?!(e?.verified===true&&e?.authorized===false):e!==undefined)return false;
 return s.scene==='c02ReadingEnd'||f.c02InquiryStarted?f.c02ReadingRecorded===true:f.c02ReadingRecorded===undefined;
}
