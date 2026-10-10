import {readingScenes,accessScenes,roundScenes,executionScenes,proposalScenes,receptionScenes,publicScenes,validPublic} from './chapter-two-public.mjs';
const c=(id,text,next,flags={},evidence={})=>({id,text,next,effects:{flags,evidence}});
export const deliveryScenes={
 c02Delivery:{place:'第二章 · 辦公室 · 文件交付桌',speaker:'許安禾',role:'港口通訊技師',portrait:'worker',
 beats:['新的回信進來時，安禾先看申請編號，再看附件名稱。她把回覆放在申請表旁，沒有先翻到自己最想證明的那一頁。','「先看窗口實際交了什麼。」她說。「公開版清單能回答版本問題，不能替我們補出整份原卷；補正通知也不是一份調查證據。」'],
 text:'先核對交付範圍，再決定如何保存。寄件者身分與事故動機仍須另外調查。',choices:[]},
 c02ReliefAnswer:{place:'南灣港 · 正式窗口書面答覆',speaker:'陳海寧',role:'港口工會代表',portrait:'worker',
 beats:['海寧把承辦的書面說明攤在服務台上。這次答覆列出補件路徑：沒有固定薪資單者，可向正式窗口詢問排班、勞務紀錄等替代資料的核對方式。能提出資料，不等於已符合資格。','「至少現在不用只說再等等。」她說。「但是這份是一般說明，不是任何人的核定書。我們可以轉達這些步驟，不能把個案姓名填在上面，好像承辦已經看過他的申請。」'],
 text:'如何使用這份一般書面答覆？已知流程可以轉達，個案材料仍由當事人直接交承辦，審核與撥款保留原程序。',choices:[c('relay','轉達書面補件路徑，明列個案仍須審核。','c02DeliveryReview',{c02FormalReply:'relayed'}),c('clarify','保留書面答覆，再列出需確認的文件界線。','c02DeliveryReview',{c02FormalReply:'clarify'})]},
 c02DeliveryReview:{place:'辦公室 · 交付與回覆整理',speaker:'林予澄',role:'幕僚長',portrait:'aide',
 beats:['予澄在案件簿裡新增兩列：收到什麼，以及這份內容能支持什麼。她沒有覆蓋先前的收件回執，也沒有把原本的未核實來信刪掉。','「這次有一部分答案了。」她說。「下一次別再把拿到的東西說成完全沒有進展，也別把這一部分說成整件事情已經結束。」'],
 text:'確認本輪紀錄後，原有承諾仍依原期限追蹤。一般文件回覆不是正式更正發布、原卷全部交付或個案補助核定。',choices:[c('record','保存交付範圍、核對結果與正式回覆。','c02DeliveryEnd',{c02DeliveryRecorded:true})]},
 c02DeliveryEnd:{place:'第二章交付核對 · 原型暫停點',speaker:'林予澄',role:'幕僚長',portrait:'aide',terminal:true,
 text:'本輪文件與正式窗口回覆已保存。來源身分、非公開原卷、個案審核與正式承諾履行仍需追蹤。可接續來源追問與公開補充說明。',choices:[]}
};
export const canReceiveVersions=s=>!(s.flags.c02FileScope==='full'&&s.flags.c02FileDisposition==='keep');
export function deliveryOptions(s){return canReceiveVersions(s)?[
 c('compare','比對公開版本清單與原截圖，記錄差異。','c02ReliefAnswer',{c02DocumentResult:'compared'},{E07:{verified:true,authorized:true}}),
 c('hold','保存公開版清單，暫不判定截圖差異。','c02ReliefAnswer',{c02DocumentResult:'held'})
 ]:[c('resubmit','補送版本範圍申請，等候交付。','c02ReliefAnswer',{c02DocumentResult:'resubmitted'}),c('notice','保存補正通知，先保留完整卷宗需求。','c02ReliefAnswer',{c02DocumentResult:'notice'})];}
export function deliverySummary(s){const f=s.flags;return [
 {title:'文件交付與核對',status:f.c02DocumentResult==='compared'?'公開清單已核對 · 原卷仍缺':f.c02DocumentResult==='held'?'公開清單已取得 · 尚未核對':f.c02DocumentResult==='resubmitted'?'範圍已補送 · 交付待收':f.c02DocumentResult==='notice'?'補正通知已保存 · 範圍待定':canReceiveVersions(s)?'公開清單已交付 · 待核對':'僅收到補正通知',detail:canReceiveVersions(s)?'E07 僅含可公開的附件清單與版本紀錄，不含非公開原卷；寄件者身分仍未核實。':'完整卷宗範圍尚待釐清，沒有取得 E07 或原卷。'},
 {title:'救助正式書面回覆',status:f.c02FormalReply==='relayed'?'一般補件路徑已轉達 · 個案未審':f.c02FormalReply==='clarify'?'書面說明已保存 · 界線待確認':'待閱讀書面說明',detail:'書面答覆列出替代文件核對路徑，不是個案核定書；沒有取得個人申請資料或撥款結果。'}
 ];}
export function deliveryReaction(s){const f=s.flags;if(!validPublic(s))return false;
 if(!f.c02DeliveryStarted)return '';
 if(s.scene==='c02Delivery')return canReceiveVersions(s)?(f.c02FileDisposition==='narrow'?'窗口已確認修正範圍並交付公開版附件清單。':'窗口交付本次版本紀錄申請的公開版附件清單。')+'清單列有初版與修訂版；只允許引用這份公開版，不含原卷內容。':'窗口只回覆補正通知，完整卷宗範圍仍需釐清；沒有交付附件清單或原卷。';
 if(s.scene==='c02ReliefAnswer')return (f.c02BarrierNext==='window'?'上一輪一般文件詢問已收到書面答覆。':'先前清單標成未確認的替代文件問題，現在已有一般書面說明。')+'\n'+(f.c02DocumentResult==='compared'?'公開清單顯示初版與修訂版均有附件編號；來信截圖只顯示初版。這可確認版本差異，不足以證明竄改或寄件者身分。':f.c02DocumentResult==='held'?'E07 已保存，但與來信截圖的比對尚未完成。':'本輪只處理補正或範圍申請，沒有新增文件證據。');
 if(['c02DeliveryReview','c02DeliveryEnd'].includes(s.scene))return deliverySummary(s).map(i=>`${i.title}｜${i.status}\n${i.detail}`).join('\n\n');return '';
}
export function validDelivery(s){const f=s.flags,keys=['c02DeliveryStarted','c02DocumentResult','c02FormalReply','c02DeliveryRecorded'];
 if(!validPublic(s))return false;
 if(!f.c02DeliveryStarted)return !keys.some(k=>f[k]!==undefined)&&!deliveryScenes[s.scene]&&!s.evidence.E07&&!f.c02PublicStarted;
 if(f.c02DeliveryStarted!==true||(!deliveryScenes[s.scene]&&!publicScenes[s.scene]&&!receptionScenes[s.scene]&&!proposalScenes[s.scene]&&!executionScenes[s.scene]&&!roundScenes[s.scene]&&!accessScenes[s.scene]&&!readingScenes[s.scene])||!f.c02FileDisposition||!f.c02BarrierNext)return false;
 const result=f.c02DocumentResult,focused=s.scene!=='c02Delivery',answered=['c02DeliveryReview','c02DeliveryEnd'].includes(s.scene)||f.c02PublicStarted;
 if(focused?!(canReceiveVersions(s)?['compared','held']:['resubmitted','notice']).includes(result):result!==undefined)return false;
 if(answered?!['relayed','clarify'].includes(f.c02FormalReply):f.c02FormalReply!==undefined)return false;
 if(s.scene==='c02DeliveryEnd'||f.c02PublicStarted?f.c02DeliveryRecorded!==true:f.c02DeliveryRecorded!==undefined)return false;
 const e=s.evidence.E07;return canReceiveVersions(s)?Boolean(e&&e.authorized===true&&e.verified===(result==='compared')):e===undefined;
}
