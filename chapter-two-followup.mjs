import {proposalScenes,receptionScenes,publicScenes} from './chapter-two-public.mjs';
import {deliveryScenes,validDelivery} from './chapter-two-delivery.mjs';
const c=(id,text,next,flags={})=>({id,text,next,effects:{flags}});
export const followupScenes={
 c02Followup:{place:'第二章 · 辦公室 · 追蹤回訪桌',speaker:'林予澄',role:'幕僚長',portrait:'aide',
 beats:['予澄把初步調查的便條移到下一欄。左邊是原卷調閱要補的申請範圍，右邊是救助窗口沒有說清楚的文件問題。兩條線都有進展，卻還沒有可以貼上完成的答案。','「今天剩下的工作，是讓下一個接手的人找得到路。」她說。「申請送到哪裡、窗口究竟回答了哪個問題，都要有紀錄。不能用我們問過了代替對方回過了。」'],
 text:'安排原卷申請與救助卡點回訪的先後順序。兩條都可處理，完成一條後返回本桌。',choices:[]},
 c02FileRequest:{place:'辦公室 · 原卷調閱申請',speaker:'許安禾',role:'港口通訊技師',portrait:'worker',
 beats:['安禾把公開索引印在申請表旁。「目前我們要查的，是哪一版附件進了這個卷。把範圍寫成所有資料，可能拿到很多頁，也可能先被要求說明哪些內容和這次核對有關。」','她沒有把寄件者的聯絡方式填進申請。編號、附件名稱與版本紀錄足以說明第一輪問題；寄件者身分仍需另外驗證，不能順手交給被查的單位。'],
 text:'你要如何寫調閱範圍？版本紀錄可先處理文件對照，完整卷宗則需要另說明必要性與公開限制。',choices:[c('versions','先申請附件清單、版本紀錄與受理時間。','c02FileReceipt',{c02FileScope:'versions'}),c('full','申請完整卷宗，另列必要性與公開限制。','c02FileReceipt',{c02FileScope:'full'})]},
 c02FileReceipt:{place:'辦公室 · 調閱申請回執',speaker:'林予澄',role:'幕僚長',portrait:'aide',
 beats:['申請窗口回傳收件紀錄。予澄把它夾在申請表後，沒有夾進事故證據那一疊。「這只能證明申請被收到。原卷沒有交給我們，受理也不是同意公開。」','安禾提醒，無論回覆快慢，截圖缺頁與來源身分都仍要保留未核實標記。若調閱範圍需要補充說明，可以先縮到本次核對真正需要的部分。'],
 text:'保留目前申請範圍，或補送只限版本紀錄的修正？補送後仍須等窗口提供文件，不能先引用尚未取得的原卷。',choices:[c('keep','保存收件紀錄，依目前範圍等候處理。','c02Followup',{c02FileDisposition:'keep'}),c('narrow','補送版本紀錄範圍，留下修正前後紀錄。','c02Followup',{c02FileDisposition:'narrow'})]},
 c02ReliefReturn:{place:'南灣港 · 工會回訪',speaker:'陳海寧',role:'港口工會代表',portrait:'worker',
 beats:['海寧把先前的窗口說明摺好，放在一張沒有姓名的便條旁。「臨時排班的人問，沒有固定薪資單，要怎麼證明收入減少？我們不能替他判資格，也不能叫他把所有銀行紀錄交到工會。」','服務窗口曾說可以補文件，卻還沒說明哪些替代資料可用。有人聽成不必交，有人聽成怎樣都不會過。海寧問你，這次要先把問題交回承辦，還是先把已知與未知說清楚。'],
 text:'這次只處理一般文件卡點，不讀取個人申請資料。可以詢問替代文件的處理方式，也可以先向等待者澄清現有流程。',choices:[c('callback','向正式承辦詢問替代文件與補件方式。','c02BarrierReply',{c02ReliefContact:'callback'}),c('explain','先向等待者區分已知流程與未確認文件。','c02BarrierReply',{c02ReliefContact:'explain'})]},
 c02BarrierReply:{place:'南灣港 · 文件卡點整理',speaker:'陳海寧',role:'港口工會代表',portrait:'worker',
 beats:['海寧把收入證明、替代文件與個案資格寫成三個標題。「我們可以把一般問題問清楚，但哪一份材料能用，要由承辦核對。把文件種類問到，不是替某個人通過審核。」','她把空白便條遞給你，不把任何家庭的資料附上。「下一次回覆要讓人知道自己可以做什麼，也要讓人知道還有哪一項沒答案。只說再等等，跟直接保證會過，都會讓人找不到路。」'],
 text:'下一步如何留下可用的回覆？補件清單只涵蓋已知項目；替代文件仍需承辦確認，個案審核與撥款都未完成。',choices:[c('checklist','提供已知補件清單，標註替代文件仍待確認。','c02Followup',{c02BarrierNext:'checklist'}),c('window','送出一般替代文件詢問，保留待回覆欄位。','c02Followup',{c02BarrierNext:'window'})]},
 c02FollowupEnd:{place:'第二章回訪 · 原型暫停點',speaker:'林予澄',role:'幕僚長',portrait:'aide',terminal:true,
 text:'原卷調閱申請與救助文件卡點已留下追蹤紀錄。申請回執不代表原卷已取得，流程回覆不代表個案核定。可接續文件交付核對與正式窗口回覆；個案結果仍待追蹤。',choices:[]}
};
export function followupOptions(s){return [!s.flags.c02FileDisposition&&c('files','提交原卷調閱申請。','c02FileRequest'),!s.flags.c02BarrierNext&&c('barrier','回訪救助文件卡點。','c02ReliefReturn')].filter(Boolean);}
export function followupSummary(s){const f=s.flags;return [
 {title:'原卷調閱申請',status:f.c02FileDisposition?(f.c02FileDisposition==='narrow'?'修正申請已送 · 受理待確認':f.c02FileScope==='full'?'申請已收件 · 範圍待釐清':'版本申請已受理 · 原卷未交付'):f.c02FileScope?'申請處理中':'尚未申請',detail:f.c02FileDisposition?(f.c02FileDisposition==='narrow'?'已補送版本紀錄範圍，保留原申請與修正紀錄。':'已保存本次範圍的收件紀錄。')+(f.c02DeliveryStarted?'前輪申請時附件與原卷尚未取得；後續交付範圍見最新紀錄。':'附件與原卷尚未取得；沒有新增公開授權。'):'需釐清版本紀錄或完整卷宗的調閱範圍。'},
 {title:'救助卡點回訪',status:f.c02BarrierNext?(f.c02BarrierNext==='checklist'?'已知補件路徑已說明 · 個案未審':'替代文件詢問已送 · 答覆待收'):f.c02ReliefContact?'回訪中':'尚未回訪',detail:f.c02BarrierNext?(f.c02BarrierNext==='checklist'?'已提供已知文件清單，替代文件另標未確認。':'已送一般文件問題至正式承辦，沒有附個人申請資料。')+'沒有代判資格或保證撥款。':'需處理收入證明與替代文件的一般問題；個人資料由當事人直接交承辦。'}
 ];}
export function followupReaction(s){if(!s.flags.c02FollowupStarted)return '';const f=s.flags;
 if(s.scene==='c02Followup')return followupSummary(s).map(i=>`${i.title}｜${i.status}`).join('\n');
 if(s.scene==='c02FileRequest')return f.c02SourceNext==='original'?'上一輪已列原卷調閱需求，現在補上實際申請範圍與收件紀錄。':'上一輪只整理索引與截圖差異；這次開始申請，沒有把舊比對紀錄改成已取得原卷。';
 if(s.scene==='c02FileReceipt')return f.c02FileScope==='full'?'窗口已收完整卷宗申請，但要求補充必要性與限制；處理範圍尚待釐清，原卷未交付。':'窗口已受理版本紀錄申請，仍須整理可交付範圍；版本資料與原卷尚未交付。';
 if(s.scene==='c02ReliefReturn')return f.c02ReliefNext==='referral'?'上一輪已提供一般流程與正式窗口，這次跟進文件卡點；不能把轉介當作個案已核定。':'上一輪留下待承辦確認的疑問，這次先補上文件卡點的回覆方式。';
 if(s.scene==='c02BarrierReply')return f.c02ReliefContact==='callback'?'承辦回覆一般原則：收入證明可依程序補件，替代文件須核對；沒有替任何個案判定資格。':'你先說明現有流程，等待者仍要求確認替代文件；本次尚未收到承辦對這個問題的答覆。';
 if(s.scene==='c02FollowupEnd')return followupSummary(s).map(i=>`${i.title}｜${i.status}\n${i.detail}`).join('\n\n');return '';
}
export function validFollowup(s){const f=s.flags,keys=['c02FollowupStarted','c02FileScope','c02FileDisposition','c02ReliefContact','c02BarrierNext'];
 if(!validDelivery(s))return false;
 if(!f.c02FollowupStarted)return !keys.some(k=>f[k]!==undefined)&&!followupScenes[s.scene]&&!f.c02DeliveryStarted;
 if(f.c02FollowupStarted!==true||(!followupScenes[s.scene]&&!deliveryScenes[s.scene]&&!publicScenes[s.scene]&&!receptionScenes[s.scene]&&!proposalScenes[s.scene])||!f.c02SourceNext||!f.c02ReliefNext)return false;
 if(f.c02FileScope!==undefined&&!['versions','full'].includes(f.c02FileScope))return false;
 if(f.c02FileDisposition!==undefined&&(!['keep','narrow'].includes(f.c02FileDisposition)||!f.c02FileScope))return false;
 if(f.c02ReliefContact!==undefined&&!['callback','explain'].includes(f.c02ReliefContact))return false;
 if(f.c02BarrierNext!==undefined&&(!['checklist','window'].includes(f.c02BarrierNext)||!f.c02ReliefContact))return false;
 if(f.c02FileScope&&!f.c02FileDisposition&&s.scene!=='c02FileReceipt'||f.c02ReliefContact&&!f.c02BarrierNext&&s.scene!=='c02BarrierReply')return false;
 if(s.scene==='c02FileRequest'&&f.c02FileScope||s.scene==='c02FileReceipt'&&(!f.c02FileScope||f.c02FileDisposition))return false;
 if(s.scene==='c02ReliefReturn'&&f.c02ReliefContact||s.scene==='c02BarrierReply'&&(!f.c02ReliefContact||f.c02BarrierNext))return false;
 if(s.scene==='c02Followup'&&f.c02FileDisposition&&f.c02BarrierNext)return false;
 return s.scene!=='c02FollowupEnd'||Boolean(f.c02FileDisposition&&f.c02BarrierNext);
}
