import {followupScenes,validFollowup} from './chapter-two-followup.mjs';
const c=(id,text,next,flags={})=>({id,text,next,effects:{flags}});
export const investigationScenes={
 c02Investigate:{place:'第二章 · 辦公室 · 調查分流桌',speaker:'林予澄',role:'幕僚長',portrait:'aide',
 beats:['聯絡紀錄歸檔後，予澄攤開兩張新便條。一張寫著維護來信的受理編號，另一張寫著救助窗口的接聽時段。它們不會因為你先回覆了某個人，就自動得到答案。','「先去哪邊，由你決定。」她說。「來信值得查，但等著申請的人也不是背景。兩邊都要留下可交接的紀錄，不要把尚未確認的部分藏起來。」'],
 text:'選擇先核對維護來信或追蹤救助窗口。兩條調查都可完成；走完一條會返回此桌，已處理的分支不會重複出現。',choices:[]},
 c02Letter:{place:'辦公室 · 維護來信核對',speaker:'許安禾',role:'港口通訊技師',portrait:'worker',
 beats:['安禾看過信裡的受理編號，沒有立刻點頭。「這個格式像我們用過的表單，但格式正確不等於寄件者真的經手過。」她把信放回桌上，不在寄件者身分欄簽名。','信裡附了一張低解析度截圖，看不見附件版本與完整頁碼。寄件者要求你先保證不聯絡原單位，才願意補充。安禾說，保護聯絡者和放棄獨立核對，是兩件不同的事。'],
 text:'如何開始核對？聯絡公開受理窗口不需要轉交來信內容；先請寄件者補件也可以，但截圖與自述仍須另行驗證。',choices:[c('independent','只帶受理編號，向公開窗口獨立核對。','c02Registry',{c02SourceCheck:'independent'}),c('relay','先請寄件者補完整版本，保留未核實標記。','c02Registry',{c02SourceCheck:'relay'})]},
 c02Registry:{place:'辦公室 · 公開受理窗口回電',speaker:'林予澄',role:'幕僚長',portrait:'aide',
 beats:['公開受理窗口回覆：索引列有這個編號，但索引沒有附件版本。原卷調閱須另提出申請，不能從編號存在推論信中描述為真。窗口沒有確認寄件者身分，也沒有提供非公開原件。','安禾指著你們原有的維護文件。「第一章拿到的內容不會因此失效，但它也不能替這張截圖補上缺頁。把兩件資料混成一件，看起來完整，後來更難追查。」'],
 text:'現在能確認的是公開索引中的受理編號。下一步如何留下紀錄？兩種方式都保留來源與附件版本未核實的限制。',choices:[c('original','記下原卷調閱需求，保留來源未核實。','c02Investigate',{c02SourceNext:'original'}),c('comparison','整理索引與截圖差異，暫不公開來信。','c02Investigate',{c02SourceNext:'comparison'})]},
 c02Relief:{place:'南灣港 · 救助服務窗口',speaker:'陳海寧',role:'港口工會代表',portrait:'worker',
 beats:['海寧在服務台外等你。今天的隊伍短了一些，因為有人去找臨時工作，有人以為昨天聽證後補助就會入帳。她把一張空白申請表遞給你，沒有把任何人的名單交出來。','「船員、臨時排班的人、港邊店家，問的不是同一套資格。」她說。「窗口願意解釋流程，可是承辦人不能替還沒完成的審核保證結果。我們也不能為了幫忙，把大家的身分證照片收進自己的信箱。」'],
 text:'這次先核對哪一個環節？先問一般資格與申請路徑，或先找出先前轉介卡住的原因；都不需要收取當事人的個人文件。',choices:[c('criteria','先釐清一般資格、文件種類與申請窗口。','c02Eligibility',{c02ReliefApproach:'criteria'}),c('barrier','先釐清轉介卡點與可詢問的承辦窗口。','c02Eligibility',{c02ReliefApproach:'barrier'})]},
 c02Eligibility:{place:'南灣港 · 救助窗口說明桌',speaker:'陳海寧',role:'港口工會代表',portrait:'worker',
 beats:['承辦人提供現行申請路徑與文件種類的說明，提醒停航影響不等於所有申請都符合資格。船員與周邊工作者須依各自適用的方案確認；審核、預算與撥款仍有程序。','海寧在便條上寫下正式窗口，不寫當事人的姓名。「這至少讓人知道該去哪裡問。但拿到流程不是拿到補助，回去對等待的人說明時，這句不能漏掉。」'],
 text:'要如何把本次取得的窗口說明用於後續回覆？兩種方式都不替個案判定資格，也不保證領款日期。',choices:[c('referral','提供一般流程與正式窗口，讓當事人自行送件。','c02Investigate',{c02ReliefNext:'referral'}),c('review','先整理卡點與疑問，請承辦確認後再補充回覆。','c02Investigate',{c02ReliefNext:'review'})]},
 c02InvestigationEnd:{place:'第二章調查 · 原型暫停點',speaker:'林予澄',role:'幕僚長',portrait:'aide',terminal:true,
 text:'維護來信與救助窗口的調查紀錄已交回辦公室。原卷、來源身分、個案審核與正式履行仍有待追蹤。可接續原卷申請與救助卡點回訪；後續文件交付與個案結果仍待追蹤。',choices:[]}
};
export function investigationOptions(s){return [!s.flags.c02SourceNext&&c('source','核對維護來信與受理編號。','c02Letter'),!s.flags.c02ReliefNext&&c('relief','追蹤救助資格與轉介窗口。','c02Relief')].filter(Boolean);}
export function investigationSummary(s){const f=s.flags;return [
 {title:'維護來信',status:f.c02SourceNext?'初步核對已記錄 · 原卷待調閱':f.c02SourceCheck?'核對中':'尚未開始',detail:f.c02SourceNext?(f.c02SourceNext==='original'?'已記下原卷調閱需求。':'已整理索引與截圖差異，來信未公開。')+'公開索引編號存在；寄件者與附件版本仍未核實。':'需核對受理編號、來源身分與附件版本；來信不是已核實證據。'},
 {title:'救助窗口',status:f.c02ReliefNext?'窗口說明已記錄 · 個案待審':f.c02ReliefApproach?'詢問中':'尚未開始',detail:f.c02ReliefNext?(f.c02ReliefNext==='referral'?'已提供一般流程與正式申請窗口。':'已整理卡點與待承辦確認的疑問。')+'沒有代收個人文件，資格與撥款尚未核定。':'需釐清一般資格、申請路徑與轉介卡點；不保證個案通過。'}
 ];}
export function investigationReaction(s){const f=s.flags;if(!f.c02InvestigationStarted)return '';
 if(s.scene==='c02Investigate')return investigationSummary(s).map(i=>`${i.title}｜${i.status}`).join('\n')+(f.handoffPriority?'\n昨晚交接優先：'+(f.handoffPriority==='source'?'維護來信':'救助窗口')+'；你仍可自行決定本次順序。':'');
 if(s.scene==='c02Registry')return f.c02SourceCheck==='independent'?'你只使用受理編號聯絡公開窗口，沒有轉交寄件者聯絡方式或來信原文。':'寄件者只補了另一張截圖，沒有完整版本；公開索引另行查詢，來源仍未驗證。';
 if(s.scene==='c02Eligibility')return f.c02ReliefApproach==='criteria'?'本次先取得一般申請路徑與文件種類說明；個案是否適用仍由正式窗口判定。':'本次確認：轉介後仍須向正式窗口確認適用方案，缺少的文件由當事人直接與承辦核對；你沒有讀取個人申請資料。';
 if(s.scene==='c02InvestigationEnd')return investigationSummary(s).map(i=>`${i.title}｜${i.status}\n${i.detail}`).join('\n\n');return '';
}
export function validInvestigation(s){const f=s.flags;const keys=['c02InvestigationStarted','c02SourceCheck','c02SourceNext','c02ReliefApproach','c02ReliefNext'];
 if(!validFollowup(s))return false;
 if(!f.c02InvestigationStarted)return !keys.some(k=>f[k]!==undefined)&&!investigationScenes[s.scene]&&!f.c02FollowupStarted;
 if(f.c02InvestigationStarted!==true||(!investigationScenes[s.scene]&&!followupScenes[s.scene]))return false;
 if(f.c02SourceCheck!==undefined&&!['independent','relay'].includes(f.c02SourceCheck))return false;
 if(f.c02SourceNext!==undefined&&(!['original','comparison'].includes(f.c02SourceNext)||!f.c02SourceCheck))return false;
 if(f.c02ReliefApproach!==undefined&&!['criteria','barrier'].includes(f.c02ReliefApproach))return false;
 if(f.c02ReliefNext!==undefined&&(!['referral','review'].includes(f.c02ReliefNext)||!f.c02ReliefApproach))return false;
 if(f.c02SourceCheck&&!f.c02SourceNext&&s.scene!=='c02Registry')return false;
 if(f.c02ReliefApproach&&!f.c02ReliefNext&&s.scene!=='c02Eligibility')return false;
 if(s.scene==='c02Letter'&&(f.c02SourceCheck||f.c02SourceNext)||s.scene==='c02Registry'&&(!f.c02SourceCheck||f.c02SourceNext))return false;
 if(s.scene==='c02Relief'&&(f.c02ReliefApproach||f.c02ReliefNext)||s.scene==='c02Eligibility'&&(!f.c02ReliefApproach||f.c02ReliefNext))return false;
 if(s.scene==='c02Investigate'&&((f.c02SourceCheck&&!f.c02SourceNext)||(f.c02ReliefApproach&&!f.c02ReliefNext)||(f.c02SourceNext&&f.c02ReliefNext)))return false;
 return s.scene!=='c02InvestigationEnd'||Boolean(f.c02SourceNext&&f.c02ReliefNext);
}
