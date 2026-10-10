import {roundScenes,executionScenes,proposalScenes,validProposal} from './chapter-two-proposal.mjs';
export {roundScenes,executionScenes,proposalScenes} from './chapter-two-proposal.mjs';
const c=(id,text,next,flags={},stats={})=>({id,text,next,effects:{flags,stats}});
export const receptionScenes={
 c02CaucusReply:{place:'議會 · 黨團協商室',speaker:'周岳',role:'黨團協調人',portrait:'politician',
 beats:['周岳把下午的協商議程放在桌上，議員們仍在爭論事故調查要先問設備、救助，還是政治金流。「你現在說得很仔細。但外面只會問，黨團到底有沒有一個立場。」','他提出兩種工作方式：把你的資料界線列入議程，讓各方各自發言；或由黨團先整合下一輪答問，換取協調人手。予澄提醒，選擇整合也不能讓黨團代替證人同意，更不能把版本差異改寫成事故責任。'],
 text:'如何回應黨團對下一輪發言的要求？這只是協商方式，尚未形成決議或有人正式到任。',choices:[c('separate','要求分開列明資料界線與各方立場。','c02ReporterReply',{c02CaucusReply:'separate'},{autonomy:1,tension:1}),c('coordinate','交黨團整合下一輪答問，要求保留未確認事項。','c02ReporterReply',{c02CaucusReply:'coordinate'},{autonomy:-1,tension:-1})]},
 c02ReporterReply:{place:'公共電視 · 採訪聯絡桌',speaker:'許知言',role:'公共電視主持人',portrait:'host',
 beats:['知言的訊息只有兩個問題：你願意回答哪些問題，以及回答能否逐句標出依據。「我不會把資料不足剪成你已經證明，也不會答應把追問剪掉。」','你可以回覆現有材料的使用界線，接受她獨立查證；也可以暫緩新增答問，先回到原卷與窗口核對。回信不附寄件者聯絡方式、個案資料或未發布草稿。'],
 text:'如何處理這次記者追問？回覆界線不等於專訪恢復，暫緩也不會撤回先前已發布的內容。',choices:[c('limits','回覆可回答的界線，保留記者獨立追問。','c02Negotiation',{c02ReporterReply:'limits'}),c('defer','暫緩新增答問，先補資料核對。','c02Negotiation',{c02ReporterReply:'defer'})]},
 c02Negotiation:{place:'辦公室 · 協商分歧整理',speaker:'林予澄',role:'幕僚長',portrait:'aide',
 beats:['予澄把黨團的工作意向與記者的問題放成兩疊。「兩邊都想要下一步，但他們要的不是同一件事。黨團問立場，記者問依據；我們還要回答港口的人。」','她拿出一張空白議程：可以先談新聞查證與調查界線，也可以先談協商人手及分工。只選一個先談，不會取消另一個問題；沒有實際回覆，就不能把提議寫成同意。'],
 text:'下一輪協商先處理哪個分歧？本次只保存議程意向，不新增履行期限或改寫原承諾。',choices:[c('boundaries','先談查證與調查界線，保留人手缺口。','c02ReceptionEnd',{c02NegotiationFocus:'boundaries'}),c('staffing','先談人手與分工，保留發言界線爭議。','c02ReceptionEnd',{c02NegotiationFocus:'staffing'})]},
 c02ReceptionEnd:{place:'第二章協商回應 · 原型暫停點',speaker:'林予澄',role:'幕僚長',portrait:'aide',terminal:true,
 text:'黨團回應、記者聯絡與下一輪議程意向已保存。沒有新增黨團決議、記者背書或正式人員到任；來源與個案仍待追蹤。可接續協商桌上的具體提案與條件取捨。',choices:[]}
};
export const reporterPaused=s=>s.flags.reporterSource==='bargain'||s.flags.pressFollowup==='spin';
export function receptionSummary(s){const f=s.flags;return [
 {title:'黨團協商',status:f.c02CaucusReply==='separate'?'要求分列立場 · 議程待確認':f.c02CaucusReply==='coordinate'?'答問整合意向 · 人手未到任':'待回應',detail:f.c02CaucusReply==='coordinate'?'下輪答問交由黨團協調整合，未確認事項要求保留；沒有交付私人來源資料。':'資料界線與政治立場要求分列；黨團尚未確認議程。'},
 {title:'記者追問',status:f.c02ReporterReply==='limits'?'已回覆使用界線':f.c02ReporterReply==='defer'?'新增答問暫緩':'待回應',detail:(reporterPaused(s)?'原專訪合作仍暫停。':'記者仍獨立查證。')+'未提供來源聯絡方式、個案資料或未發布草稿；沒有承諾刪除追問或記者背書。'},
 {title:'下輪協商',status:f.c02NegotiationFocus==='boundaries'?'擬先談查證與調查界線':f.c02NegotiationFocus==='staffing'?'擬先談人手與分工':'尚未選定議程焦點',detail:'只是本方議程意向，對方尚未同意；原承諾與期限保留。'}
 ];}
export function receptionReaction(s){const f=s.flags;
 if(s.scene==='c02CaucusReply')return (f.c02PublicDisposition==='published'?(f.c02PublicDraft==='versions'?'周岳讀過公開版本差異說明，要求下一輪回覆更有政治辨識度。':'周岳讀過公開進度說明，認為還缺少能帶進協商的具體結論。'):'周岳只知道本輪尚未發布說明，要求你交代工作進度；未發布草稿沒有交給黨團。')+'\n'+(f.caucusConflict==='recuse'?'昨日利益申報與迴避建議仍待處理，人手增派暫緩。':f.caucusConflict==='delay'?'昨日暫緩贊助名冊調閱的分歧保留，協調人手仍未到任。':'黨團尚未提出新的利益申報或調查決議。');
 if(s.scene==='c02ReporterReply')return (f.c02PublicDisposition==='published'?(f.c02PublicDraft==='versions'?'知言追問：版本差異能說明什麼？還有哪些結論無法支持？':'知言追問：目前進度之後，哪些結果仍未取得？'):'知言詢問本輪進度；她沒有收到未發布草稿，也不知道草稿採用哪個範圍。')+'\n'+(reporterPaused(s)?'原專訪合作仍暫停，本次只有聯絡與書面核對。':'本次聯絡不代表記者同意你的政治立場。');
 if(['c02Negotiation','c02ReceptionEnd'].includes(s.scene))return receptionSummary(s).map(i=>`${i.title}｜${i.status}\n${i.detail}`).join('\n\n');return '';
}
export function validReception(s){const f=s.flags,keys=['c02ReceptionStarted','c02CaucusReply','c02ReporterReply','c02NegotiationFocus'];
 if(!validProposal(s))return false;
 if(!f.c02ReceptionStarted)return !keys.some(k=>f[k]!==undefined)&&!receptionScenes[s.scene];
 if(f.c02ReceptionStarted!==true||(!receptionScenes[s.scene]&&!proposalScenes[s.scene]&&!executionScenes[s.scene]&&!roundScenes[s.scene])||!['published','held'].includes(f.c02PublicDisposition))return false;
 if(s.scene==='c02CaucusReply'?f.c02CaucusReply!==undefined:!['separate','coordinate'].includes(f.c02CaucusReply))return false;
 if((['c02Negotiation','c02ReceptionEnd'].includes(s.scene)||f.c02ProposalStarted)?!['limits','defer'].includes(f.c02ReporterReply):f.c02ReporterReply!==undefined)return false;
 return s.scene==='c02ReceptionEnd'||f.c02ProposalStarted?['boundaries','staffing'].includes(f.c02NegotiationFocus):f.c02NegotiationFocus===undefined;
}
