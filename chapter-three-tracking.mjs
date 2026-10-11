const c=(id,text,next,flags={},evidence={})=>({id,text,next,effects:{flags,evidence}});
export const trackingFlagKeys=['c03TrackingStarted','c03TrackTopic','c03TrackAction','c03TrackResult','c03UnitText','c03TrackRecorded','c03Coordination'];
export const trackingScenes={
 c03TrackDesk:{place:'第三章 · 分項追蹤桌',speaker:'林予澄',role:'幕僚長',portrait:'aide',
 beats:['午間的電話開始回來。予澄把受理窗口的程序回信與各承辦單位的答覆分開：「前一封只告訴我們去哪裡問。這一輪才要確認，哪個單位真正回答了哪一項。」','她攤開原追問範圍。分列三項的人可選這輪先處理哪項；集中原優先方向的人仍沿原範圍。未送草稿沒有被列作待回信件，必須先決定是否實際送交。'],
 text:'選擇本輪先處理的分項。其他問題與原期限保留，沒有替未送的問題生成結果。',choices:[]},
 c03TrackContact:{place:'辦公室 · 承辦窗口聯絡',speaker:'沈若川',role:'本土協進黨議員',portrait:'senior',
 beats:['承辦單位的工作表要求指明問題範圍，不能把「我們都還不滿意」當作一個可回覆的欄位。你把這輪焦點圈出來，讓予澄確認送件紀錄。','已送路線可追蹤原問題或補列缺口；草稿路線可現在送交程序追問，也可繼續保留。新送件只會先有受理紀錄，不會補寫成昨天就已交辦。'],
 text:'依原實際送件狀態，決定這次聯絡動作。',choices:[]},
 c03UnitResult:{place:'辦公室 · 分項實際結果',speaker:'林予澄',role:'幕僚長',portrait:'aide',
 beats:['予澄把本輪結果攤在桌上。已有送件的路線收到分項承辦的公開程序答覆；本輪才送交者只有收件回覆；仍留草稿者沒有本輪回信。她沒有把三種情況排成同一個進度。','可公開的程序內容可以另存證據簿，卻沒有使私人來源、受限筆記或個案資料取得新的公開權限。正式調查與個案核定仍有自己的結果欄。'],
 text:'確認下方實際結果後保存。新文件只支持其中寫明的程序，沒有確認事故動機或個案通過。',choices:[c('record','保存本輪分項結果，保留其他缺口。','c03InterestTalk',{c03TrackRecorded:true})]},
 c03InterestTalk:{place:'辦公室 · 利益協調回電',speaker:'周岳',role:'議會同僚',portrait:'senior',
 beats:['周岳回電時，先問你願不願意把公開程序問題放進共同工作方法。予澄把贊助名冊與調查席位的原分歧放在旁邊，沒有讓它們因為窗口回信而消失。','「能協調的範圍要說清楚。」你說。共同整理只能處理已公開的程序與聯絡索引，不交出私人來信、受限筆記或家庭資料，也不能以人手交換撤回利益調查。'],
 text:'根據前輪協調立場，決定本輪共同工作方法。沒有新增調閱權、人員到任或事故結論。',choices:[]},
 c03TrackEnd:{place:'第三章分項追蹤與利益協調 · 原型暫停點',speaker:'林予澄',role:'幕僚長',portrait:'aide',terminal:true,
 text:'本輪分項聯絡、實際文件或收件狀態，以及利益協調結果已保存。原卷、來源、救助與原期限保留；下一輪案件缺口與共同稿審閱尚未開放。',choices:[]}
};
const topics={files:'原卷公開範圍',source:'公開登錄查核',relief:'救助補件程序'};
export function trackingTopics(s){return s.flags.c03WindowScope==='broader'?['files','source','relief']:[s.flags.c02StagePriority];}
export function unitText(s){const f=s.flags;return '分項承辦公開程序答覆｜'+topics[f.c03TrackTopic]+'\n'+(f.c03TrackAction==='clarify'?'本輪釐清原回覆尚缺的程序欄位。':'本輪跟進原已送的程序問題。')+'\n'+{files:'可另申請移交索引的遮蔽個資公開版，收件、移交及修訂登錄欄位須分列；非公開原卷仍依原有效閱覽或覆核安排。本信不含索引複本、不新增閱覽時段，也不交付完整原卷。',source:'公開登錄的收件日期與修訂登錄日期由不同欄位記錄，資料承辦提供分欄核對方法；原件來源資訊仍須依有效申請範圍另辦。欄位方法不核實私人寄件者或修訂原因。',relief:'周邊臨時工作者可詢問收入證明的替代文件，由服務窗口先核對補件清單，再交個案承辦審核。文件可以補正不等於個案已符合資格，沒有核定金額或撥款結果。'}[f.c03TrackTopic]+'\n本回覆已核對承辦文號，可引用公開程序範圍；不包括個人資料、事故原因或利益調查結論。';}
export function trackingOptions(s){const f=s.flags;if(s.scene==='c03TrackDesk')return trackingTopics(s).map(topic=>c(topic,'本輪先處理：'+topics[topic],'c03TrackContact',{c03TrackTopic:topic}));if(s.scene==='c03TrackContact'){if(f.c03WindowDisposition==='sent')return ['follow','clarify'].map(action=>c(action,action==='follow'?'追蹤已送問題，取得分項承辦程序答覆。':'補列原回覆缺口，取得分項程序釐清。','c03UnitResult',{c03TrackAction:action,c03TrackResult:'answered',c03UnitText:unitText({...s,flags:{...f,c03TrackAction:action}})},{E11:{verified:true,authorized:true}}));return [c('send','現在送交原程序追問，先保存收件回覆。','c03UnitResult',{c03TrackAction:'send',c03TrackResult:'late-receipt'}),c('keep','繼續保留草稿，本輪不送件。','c03UnitResult',{c03TrackAction:'keep',c03TrackResult:'draft'})];}if(s.scene==='c03InterestTalk'){const independent=c('independent','維持辦公室自行追蹤，不加入共同方法。','c03TrackEnd',{c03Coordination:'independent'});return f.c03CouncilPosition==='separate'?[c('limited','同意限定程序協調，分列利益調查。','c03TrackEnd',{c03Coordination:'limited'}),independent]:[independent,c('reopen','提出重談限定方法，待周岳另行答覆。','c03TrackEnd',{c03Coordination:'reopen'})];}return trackingScenes[s.scene]?.choices||[];}
export function trackingSummary(s){const f=s.flags;return [{title:'分項聯絡',status:topics[f.c03TrackTopic]||'焦點待選',detail:{answered:'原已送問題已取得分項公開程序答覆。','late-receipt':'本輪才送交，已收件；分項承辦答覆仍待取得。',draft:'原追問仍是未送草稿，沒有本輪收件。'}[f.c03TrackResult]||'本輪聯絡動作尚未選定。'},{title:'分項公開文件 E11',status:s.evidence.E11?'已核對 · 可引用程序範圍':'本輪未取得',detail:f.c03UnitText||'沒有分項承辦新文件；收件或草稿不當作實質答覆。'},{title:'本輪利益協調',status:{limited:'限定程序工作方法已同意',independent:'維持自行追蹤',reopen:'已提出重談 · 對方答覆待收'}[f.c03Coordination]||'方法待決定',detail:f.c03Coordination==='limited'?'周岳接受限定方法：只協調公開程序與聯絡索引；利益調查分歧分列，沒有撤回調查要求、新增到任人手或私人資料權限。':'原利益分歧、工作約定與人手保留，沒有自動形成共同方法。'}];}
export function trackingReaction(s){const f=s.flags;if(s.scene==='c03TrackDesk')return '前輪工作意向：'+({track:'分項追蹤',clarify:'再列具體答覆缺口',keep:'安排待定',rework:'下輪修稿'}[f.c03WindowNext])+'。\n'+(f.c03WindowDisposition==='sent'?'原程序追問已送交，這輪可跟進分項承辦。':'原程序追問未送，沒有交辦中的分項問題。');if(s.scene==='c03TrackContact')return '本輪焦點：'+topics[f.c03TrackTopic]+'。\n'+(f.c03WindowDisposition==='sent'?'原文與受理程序回覆保留，本輪另記承辦答覆。':'本輪即使現在送交，也只從現在開始計入受理，原草稿歷史不改寫。');if(s.scene==='c03UnitResult')return f.c03UnitText|| (f.c03TrackResult==='late-receipt'?'本輪實際回覆：原程序追問已收件，選定分項已列入轉辦；分項承辦答覆尚未取得。':'本輪沒有送件或回信，追問草稿保留。');if(s.scene==='c03InterestTalk')return f.c03CouncilPosition==='separate'?'前輪願談程序協調，周岳願接受限定方法；你仍可選自行追蹤。原利益分歧不得省略。':'前輪暫不加入共同稿，周岳沒有替你成立工作方法。可維持自行追蹤，或提出重談後再等他的答覆。';if(s.scene==='c03TrackEnd')return trackingSummary(s).map(i=>`${i.title}｜${i.status}\n${i.detail}`).join('\n\n');return '';}
export function validTracking(s){const f=s.flags;if(!f.c03TrackingStarted)return !trackingFlagKeys.some(k=>f[k]!==undefined)&&!trackingScenes[s.scene]&&s.evidence.E11===undefined;if(s.chapter!=='c03'||f.c03TrackingStarted!==true||!trackingScenes[s.scene])return false;
 if(s.scene==='c03TrackDesk'?f.c03TrackTopic!==undefined:!trackingTopics(s).includes(f.c03TrackTopic))return false;
 if(['c03TrackDesk','c03TrackContact'].includes(s.scene))return f.c03TrackAction===undefined&&f.c03TrackResult===undefined&&f.c03UnitText===undefined&&s.evidence.E11===undefined&&f.c03TrackRecorded===undefined&&f.c03Coordination===undefined;
 if(f.c03WindowDisposition==='sent'){if(!['follow','clarify'].includes(f.c03TrackAction)||f.c03TrackResult!=='answered'||f.c03UnitText!==unitText(s)||s.evidence.E11?.verified!==true||s.evidence.E11?.authorized!==true)return false;}else if(!['send','keep'].includes(f.c03TrackAction)||f.c03TrackResult!==(f.c03TrackAction==='send'?'late-receipt':'draft')||f.c03UnitText!==undefined||s.evidence.E11!==undefined)return false;
 if(s.scene==='c03UnitResult')return f.c03TrackRecorded===undefined&&f.c03Coordination===undefined;
 if(f.c03TrackRecorded!==true)return false;
 return s.scene==='c03TrackEnd'?(f.c03CouncilPosition==='separate'?['limited','independent']:['independent','reopen']).includes(f.c03Coordination):f.c03Coordination===undefined;
}
