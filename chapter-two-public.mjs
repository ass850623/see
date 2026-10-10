import {receptionScenes,validReception} from './chapter-two-reception.mjs';
export {receptionScenes} from './chapter-two-reception.mjs';
const c=(id,text,next,flags={},extra={})=>({id,text,next,effects:{flags},...extra});
export const publicScenes={
 c02SourceInquiry:{place:'辦公室 · 來信來源追問',speaker:'許安禾',role:'港口通訊技師',portrait:'worker',
 beats:['安禾把公開清單與原來那封信分開放。「文件可以核對，寫信的人是誰，還是另一個問題。不要因為編號存在，就替他的每一句話背書。」','來源留下的聯絡方式仍然可用。你可以追問可核對的經手日期與資料取得方式，也可以先暫停追問，保留他尚未提供的內容。兩種做法都不會把他的姓名或聯絡方式交給記者。','安禾提醒你，昨日取得的公開授權仍各有範圍。這封新來信的寄件者沒有授權公開原文，公開版清單也不能替他作出同意。'],
 text:'這次如何追問來源？回覆只會加入聯絡紀錄，不自動確認身分、動機或具名作證。',choices:[c('records','追問經手日期與資料取得方式，保留未核實。','c02PublicDraft',{c02SourceQuestion:'records'}),c('pause','暫停追問，保留未回覆事項與原聯絡紀錄。','c02PublicDraft',{c02SourceQuestion:'pause'})]},
 c02PublicDraft:{place:'公共電視 · 書面核對桌',speaker:'許知言',role:'公共電視主持人',portrait:'host',
 beats:['知言把你的上一輪回覆印在桌上。「現在有進展，你可以說清楚。但進展要說的是得到什麼，不是把還沒得到的部分藏進我們已經處理了。」','她沒有索取寄件者聯絡方式，只問哪份資料已核實、哪份能公開。「版本不同和有人竄改，是兩個結論。一般補件說明和補助核定，也是兩件事。」'],
 text:'選擇本次公開補充說明的範圍。只有核實且可公開的 E07 能支持版本差異說明；也可只交代已完成的動作與限制。',choices:[c('versions','引用 E07，只說明版本差異與未確認部分。','c02PublicReview',{c02PublicDraft:'versions'},{requires:['E07']}),c('progress','只交代申請、窗口回覆與尚缺的結果。','c02PublicReview',{c02PublicDraft:'progress'})]},
 c02PublicReview:{place:'辦公室 · 公開補充說明審閱',speaker:'沈若川',role:'本土協進黨議員',portrait:'senior',
 beats:['予澄把草稿和資料使用範圍再對一次。寄件者姓名、聯絡方式、個人申請資料與非公開原卷都沒有附在稿件裡。','「要發布，可以。」她說。「但這份只是一則新的補充說明。昨天待辦的正式更正、完整聽證紀錄與原承諾，仍然各有自己的工作，不能全部畫成完成。」'],
 text:'審閱以下草稿，再決定發布或暫存。發布會把本段文字記入發言紀錄；暫存不會出現在公開紀錄中。',choices:[]},
 c02PublicEnd:{place:'第二章公開回覆 · 原型暫停點',speaker:'林予澄',role:'幕僚長',portrait:'aide',terminal:true,
 text:'來源追問與本次補充說明已保存。寄件者身分、非公開原卷與個案結果仍待追蹤；本次說明沒有取代原正式更正或完整聽證紀錄。可接續黨團與記者回應及協商分歧。',choices:[]}
};
export function publicDraftText(s){
 const basis=s.flags.c02PublicDraft==='versions'?'已核對的公開版 E07 列有初版與修訂版附件編號；來信截圖只顯示初版。這能確認版本差異，不能證明竄改或寄件者身分。':'本輪已完成申請與回覆紀錄整理；'+(s.evidence.E07?'收到公開版清單，'+(s.evidence.E07.verified?'版本核對結果已記錄。':'尚未完成與來信截圖的核對。'):'完整卷宗範圍仍待釐清，尚未取得附件清單。');
 return basis+'\n一般書面答覆已說明替代文件核對路徑；個案資格與撥款仍須正式審核。非公開原卷未取得，來源身分未核實，來信原文與個人資料未公開。';
}
export function publishedSupplement(s){return s.flags.c02PublicDisposition==='published'?{day:2,title:'本次公開補充說明',text:s.flags.c02PublishedText}:null;}
export function publicReviewOptions(s){const publish=c('publish','發布這份補充說明，保留草稿與依據。','c02PublicEnd',{c02PublicDisposition:'published',c02PublishedText:publicDraftText(s)});publish.effects.stats={trust:s.flags.c02PublicDraft==='versions'?3:1};return [publish,c('hold','先存為草稿，保留未發布狀態。','c02PublicEnd',{c02PublicDisposition:'held'})];}
export function publicSummary(s){const f=s.flags;return [
 {title:'來源追問',status:f.c02SourceQuestion==='records'?'已收到部分回覆 · 身分未核實':f.c02SourceQuestion==='pause'?'追問暫停 · 身分未核實':'待決定追問方式',detail:f.c02SourceQuestion==='records'?'來源只補充自述的經手日期，未提供可核對的原件或身分證明；來信沒有公開授權。':'原聯絡紀錄與未回覆事項保留，沒有替來源補寫同意或身分。'},
 {title:'本次補充說明',status:f.c02PublicDisposition==='published'?'已發布本次說明':f.c02PublicDisposition==='held'?'草稿已保存 · 未發布':f.c02PublicDraft?'草稿待審閱':'尚未起草',detail:f.c02PublicDraft?publicDraftText(s):'依現有核實與公開範圍準備說明。'}
 ];}
export function publicReaction(s){if(!s.flags.c02PublicStarted)return '';
 if(s.scene==='c02PublicDraft')return publicSummary(s)[0].detail+'\n'+(s.flags.reporterSource==='bargain'||s.flags.pressFollowup==='spin'?'專訪合作仍暫停；本次只進行書面核對，不代表合作分歧已解除。':'知言保留追問權；提供資料不等於記者背書。');
 if(s.scene==='c02PublicReview')return '待審閱草稿：\n'+publicDraftText(s);
 if(s.scene==='c02PublicEnd')return publicSummary(s).map(i=>`${i.title}｜${i.status}
${i.detail}`).join('\n\n');return '';
}
export function validPublic(s){const f=s.flags,keys=['c02PublicStarted','c02SourceQuestion','c02PublicDraft','c02PublicDisposition','c02PublishedText'];
 if(!validReception(s))return false;
 if(!f.c02PublicStarted)return !keys.some(k=>f[k]!==undefined)&&!publicScenes[s.scene];
 if(f.c02PublicStarted!==true||(!publicScenes[s.scene]&&!receptionScenes[s.scene])||f.c02DeliveryRecorded!==true)return false;
 if(s.scene==='c02SourceInquiry'?f.c02SourceQuestion!==undefined:!['records','pause'].includes(f.c02SourceQuestion))return false;
 const drafted=['c02PublicReview','c02PublicEnd'].includes(s.scene)||f.c02ReceptionStarted;
 if(drafted?!['versions','progress'].includes(f.c02PublicDraft):f.c02PublicDraft!==undefined)return false;
 if(f.c02PublicDraft==='versions'&&(!s.evidence.E07?.verified||!s.evidence.E07?.authorized))return false;
 if(f.c02PublicDisposition==='published'?f.c02PublishedText!==publicDraftText(s):f.c02PublishedText!==undefined)return false;
 return s.scene==='c02PublicEnd'||f.c02ReceptionStarted?['published','held'].includes(f.c02PublicDisposition):f.c02PublicDisposition===undefined;
}
