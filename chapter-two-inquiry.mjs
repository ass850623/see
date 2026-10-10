const c=(id,text,next,flags={})=>({id,text,next,effects:{flags}});
export const inquiryScenes={
 c02InternalAsk:{place:'辦公室 · 內部調查追問',speaker:'許安禾',role:'港口通訊技師',portrait:'worker',
 beats:['安禾把公開索引放在桌面，把受限與私人資料留在各自的資料夾。「現在要問的，不是誰最像壞人，而是哪個步驟還缺一個能核對的答案。」','你可以依實際閱覽結果追問流程，也可以先處理閱覽或限制卡點。沒有閱覽筆記的路線，不能假裝已看過移交欄位；輪值席的工作範圍仍只有公開索引與窗口。'],
 text:'選本輪內部追問。這次不向外部轉交私人回信或受限筆記。',choices:[]},
 c02QuestionDraft:{place:'辦公室 · 調查問題草稿',speaker:'林予澄',role:'幕僚長',portrait:'aide',
 beats:['予澄把問題稿分成兩欄：目前支持的事實，以及還要查的問題。「哪一天有收件，可以查；誰經手、為什麼修訂、是否影響事故，是另外的問題。」','她把原承諾放在最下方，沒有打完成勾。「這份問題稿要幫我們接著查，不是用一個新標題把更正、調查或救助承諾全部結掉。」'],
 text:'選擇整理重點。日期尚未分列核對時，先整理程序與缺件問題；私人與受限材料不進公開說明。',choices:[]},
 c02QuestionReview:{place:'辦公室 · 內部問題稿審閱',speaker:'沈若川',role:'本土協進黨議員',portrait:'senior',
 beats:['你逐行讀過問題稿。每一個問題都列出所依據的範圍，不寫來源姓名，不附 E09 原文或 E10 筆記複本。內部使用不等於可以轉給黨團輪值席或記者。','予澄可以把它列入辦公室內部核對，也可以先存作草稿。列入核對表示開始安排下一輪回覆，不代表回答已經取得，更沒有新增對外發布或履行期限。'],
 text:'審閱以下內部問題稿，再選擇列入核對或保存草稿。',choices:[c('review','列入辦公室內部核對，另追實際回覆。','c02InquiryEnd',{c02QuestionDisposition:'review'}),c('hold','保存內部問題草稿，暫不安排核對。','c02InquiryEnd',{c02QuestionDisposition:'draft'})]},
 c02InquiryEnd:{place:'第二章內部追問與問題整理 · 原型暫停點',speaker:'林予澄',role:'幕僚長',portrait:'aide',terminal:true,
 text:'本輪內部追問、調查問題稿與處理狀態已保存。沒有對外發布，也沒有替私人或受限資料補寫授權。下一段內部核對回覆與第二章階段整理尚未開放。',choices:[]}
};
export function inquiryOptions(s){const f=s.flags;if(s.scene==='c02InternalAsk')return f.c02ReadResult==='read'?[c('flow','追問收件、移交與修訂登錄各欄的定義。','c02QuestionDraft',{c02InternalTopic:'flow'}),c('handoff','追問移交紀錄如何核對，保留身分與動機未明。','c02QuestionDraft',{c02InternalTopic:'handoff'})]:[c('access','追問有效閱覽的下一個條件或時間卡點。','c02QuestionDraft',{c02InternalTopic:'access'}),c('limits','追問未交付欄位的限制理由與覆核路徑。','c02QuestionDraft',{c02InternalTopic:'limits'})];
 if(s.scene==='c02QuestionDraft'){const make=(id,text,focus)=>{const next={...s,flags:{...f,c02QuestionFocus:focus}};return c(id,text,'c02QuestionReview',{c02QuestionFocus:focus,c02QuestionText:questionOutline(next)});};return [make('procedure','整理閱覽條件、程序與仍缺材料。','procedure'),...(f.c02DateResult==='compared'?[make('dates','分列已核對日期，整理尚缺的流程問題。','dates')]:[])];}return inquiryScenes[s.scene]?.choices||[];
}
export function questionOutline(s){const f=s.flags;const topic={flow:'收件、移交與修訂登錄欄位各自代表哪個步驟？',handoff:'移交記錄應如何與正式受理索引核對？',access:'下一次有效閱覽尚缺哪些條件與時間確認？',limits:'未交付欄位的限制理由能否分項覆核？'}[f.c02InternalTopic];return '整理重點：'+(f.c02QuestionFocus==='dates'?'公開日期與流程問題':'閱覽程序與缺件')+'\n支持的事實：'+(f.c02QuestionFocus==='dates'?'公開索引收件為事發前三日，修訂登錄為前一日；僅確認登錄順序。':'已收到 E08 公開程序答覆；'+(f.c02ReadResult==='read'?'有效受限閱覽已完成，但筆記無公開授權。':'本輪沒有完成受限閱覽，不推定看過原卷。'))+'\n內部追問：'+topic+'\n待查：來源身分、原件來源、修訂原因與事故動機。已知日期不替代這些答案。\n使用界線：不附 E09 原文、E10 筆記複本或個人資料；不交付輪值席或記者。原公開說明、原承諾與期限保留。';}
export function inquirySummary(s){const f=s.flags;return [
 {title:'本輪內部追問',status:{flow:'流程欄位定義待回',handoff:'移交核對方法待回',access:'閱覽條件與時間待回',limits:'限制理由與覆核路徑待回'}[f.c02InternalTopic]||'尚未選定',detail:'只保存問題，沒有收到來源身分、修訂原因或事故動機的新答案。'},
 {title:'內部調查問題稿',status:f.c02QuestionDisposition==='review'?'已列入內部核對 · 回覆待收':f.c02QuestionDisposition==='draft'?'內部草稿已保存 · 核對未安排':f.c02QuestionText?'問題稿待審閱':'尚未整理',detail:f.c02QuestionText||'尚未生成問題稿；本輪沒有對外發布。'}
 ];}
export function inquiryReaction(s){const f=s.flags;if(s.scene==='c02InternalAsk')return f.c02ReadResult==='read'?'已有 E10 受限流程筆記，本輪可以追問欄位或移交核對方法，仍不能轉交輪值席。':'沒有 E10 工作筆記，本輪只追閱覽條件或限制理由。';if(s.scene==='c02QuestionDraft')return (f.c02DateResult==='compared'?'公開日期已分列，可選日期與流程問題稿。':'公開日期尚未分列判定，本輪只提供程序與缺件問題稿。')+'\n'+inquirySummary(s)[0].status;if(s.scene==='c02QuestionReview')return '待審閱內部問題稿：\n'+f.c02QuestionText;if(s.scene==='c02InquiryEnd')return inquirySummary(s).map(i=>`${i.title}｜${i.status}\n${i.detail}`).join('\n\n');return '';}
export function validInquiry(s){const f=s.flags,keys=['c02InquiryStarted','c02InternalTopic','c02QuestionFocus','c02QuestionText','c02QuestionDisposition'];if(!f.c02InquiryStarted)return !keys.some(k=>f[k]!==undefined)&&!inquiryScenes[s.scene];
 if(f.c02InquiryStarted!==true||!inquiryScenes[s.scene]||f.c02ReadingRecorded!==true)return false;
 if(s.scene==='c02InternalAsk'?f.c02InternalTopic!==undefined:!(f.c02ReadResult==='read'?['flow','handoff']:['access','limits']).includes(f.c02InternalTopic))return false;
 const drafted=['c02QuestionReview','c02InquiryEnd'].includes(s.scene);if(drafted?!(f.c02DateResult==='compared'?['procedure','dates']:['procedure']).includes(f.c02QuestionFocus):f.c02QuestionFocus!==undefined)return false;
 if(drafted?f.c02QuestionText!==questionOutline(s):f.c02QuestionText!==undefined)return false;
 return s.scene==='c02InquiryEnd'?['review','draft'].includes(f.c02QuestionDisposition):f.c02QuestionDisposition===undefined;
}
