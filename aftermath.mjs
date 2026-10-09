import {chapterResult} from './hearing.mjs';
const c=(id,text,next,effects)=>({id,text,next,effects});
export const aftermathScenes={
 postUnion:{place:'工會休息室 · 聽證後回訪',speaker:'陳海寧',role:'港口工會代表',portrait:'worker',beats:[
 '海寧沒有打開新聞，而是把完整聽證紀錄放在桌上。「我看過你回答的問題，也看過被剪走的部分。我要談的不是哪一段比較多人分享，而是你有沒有照我們談好的範圍使用資料。」',
 '休息室裡有人準備交班。海寧說，工會不是一個隨時都說同一句話的人。「有人覺得你幫了忙，也有人怕再一次成為政治故事的背景。合作能不能繼續，要看接下來怎麼做。」'
 ],text:'「你可以說明、修正，也可以堅持。但別把我們願意提供資料，說成我們接受你所有政治結論。現在你準備怎麼回覆工會？」',choices:[c('repair','明日回覆完整使用範圍，承認尚待處理的問題。','postPress',{flags:{unionFollowup:'repair'},relations:{haining:1},note:'你承諾回覆資料使用與待辦問題；海寧沒有因此自動恢復所有信任。'}),c('defend','維持聽證說法，不另安排工會說明。','postPress',{flags:{unionFollowup:'defend'},relations:{haining:-1},note:'工會保留異議，合作仍受原授權範圍限制。'})]},
 postPress:{place:'公共電視 · 直播後採訪區',speaker:'許知言',role:'主持人',portrait:'host',beats:[
 '直播燈已關，知言仍留著原始錄影。她把網路上的短片和完整回答並排：「有些剪輯省略了你說不知道的部分，也有些只是重播你真正說過的話。不能因為不喜歡，就把每一段都叫成造假。」',
 '她請你區分澄清與改寫。澄清可以補上脈絡；改寫則可能讓人以為你從未說過某句話。予澄在旁邊記下版本、時間和原始問題，沒有先替你發出聲明。'
 ],text:'「你希望下一份說明怎麼寫？留下完整紀錄和未知事項，還是只整理最有利的片段？」知言提醒，願意回覆不等於她會替你背書。',choices:[c('transparent','明日中午前發布完整脈絡與版本紀錄，保留未知。','postStaff',{flags:{pressFollowup:'transparent'},stats:{trust:1},note:'你提出補充說明承諾；尚未發布，不抹除原聽證回答。'}),c('spin','只製作有利短片，不附完整問題與限制。','postStaff',{flags:{pressFollowup:'spin'},stats:{trust:-2},note:'知言會比對短片與原始紀錄，暫不安排進一步專訪。'})]},
 postStaff:{place:'辦公室 · 夜間工作會議',speaker:'林予澄',role:'幕僚長',portrait:'aide',beats:[
 '予澄把新增的回覆放回清單，沒有立刻寫上完成。「如果每一個人都等明天，明天就得先決定順序。」她把已確認的窗口、還沒有回覆的問題，以及需要你簽名的文字分成三疊。',
 '你問哪一項可以再晚一點。予澄說，期限可以重新協商，但不能只在辦公室裡把日期改掉。「需要對方知道新的安排，也需要有人負責通知。排程不是把別人的等待藏起來。」'
 ],text:'今晚最後一個決定，是如何面對未完成的工作。你可以排定優先順序，也可以要求團隊明日全部完成。予澄等你說清楚，誰來承擔後者的風險。',choices:[c('prioritize','列出優先事項，逾期風險逐一聯絡與說明。','chapterEnd',{flags:{staffFollowup:'prioritize'},relations:{yucheng:1},note:'團隊留下可追蹤排程；尚未完成的公共承諾仍保持待履行。'}),c('overpromise','要求明日全部完成，先不要對外談限制。','chapterEnd',{flags:{staffFollowup:'overpromise'},relations:{yucheng:-2},note:'予澄記錄排程風險，提醒工作量沒有因命令而減少。'})]}
};
export function aftermathReaction(s,scene){const result=chapterResult(s).id;const f=s.flags;
if(scene==='postUnion'){const replies={credible:'海寧承認時間線保留了拖船失誤，也守住了授權。「你沒有把我們說成全對。這樣才有繼續合作的理由。但救助與安全還沒完成。」',pending:'海寧知道你沒有任意公開資料。「保留授權不是逃避調查。我仍需要知道，後續補件怎麼做、什麼時候再談。」',party:'海寧指出，被省略的拖船失誤就是工會最在意的事。「我們交出完整紀錄，不是要讓你只拿對自己有利的部分。」',storm:'海寧拒絕替沒有依據的指控背書。「你可以要求調查，不能把你的判斷寫成工會已證明。下一份說明請把這兩件事分開。」'};return replies[result]+(!s.evidence.E02.authorized?' 原始航行紀錄仍未獲公開授權。':' 公開授權仍以個資保護與完整脈絡為條件。');}
if(scene==='postPress'){let text=result==='storm'?'知言指出，拒絕澄清的指控已在正式紀錄，補充稿不能把它變成從未發生。':result==='party'?'知言會追問選擇性呈現省略了什麼，不因新短片聲量高就停止核對。':result==='credible'?'知言認為核對方法可以追溯，但仍會追問哪些責任尚未查明。':'知言要求補件與更正進度；承認未知仍需要後續回覆。';if(f.reporterSource==='bargain')text+=' 先前報導交易的分歧仍在，專訪合作尚未恢復。';if(f.reporterCorrection==='visible')text+=' 原先明日中午的更正承諾仍有效。';return text;}
if(scene==='postStaff'){let text=f.staffConfirmed?'已分配的兩份準備稿完成了準備，未分配項目與公共承諾仍要追蹤。':'沒有正式分工，予澄先整理待辦，不能宣稱所有任務已有負責人。';if(f.aideDelegation==='centralize')text+=' 你選擇集中決策，對外回覆仍須等待你確認。';if(f.witnessConsent==='pressure')text+=' 安禾拒絕個人作證，不能把她列成明日具名出席者。';return text;}
return '';}
export function aftermathSummary(s){const f=s.flags;return [f.unionFollowup==='repair'?'工會回訪：承諾說明使用範圍，信任仍需後續行動。':f.unionFollowup==='defend'?'工會回訪：維持原說法，合作分歧保留。':'工會回訪：舊版本結算尚未進行。',f.pressFollowup==='transparent'?'媒體回覆：待發布完整補充稿，原紀錄仍保留。':f.pressFollowup==='spin'?'媒體回覆：選擇有利短片，知言繼續核對且暫停專訪。':'媒體回覆：尚未安排補充說明。',f.staffFollowup==='prioritize'?'團隊排程：先列優先順序，未完成事項仍需說明。':f.staffFollowup==='overpromise'?'團隊排程：要求全數完成，工作量與風險尚未消失。':'團隊排程：尚未進行夜間檢討。'];}
export function canResumeAftermath(s){return s.scene==='chapterEnd'&&s.tasks.M03==='complete'&&Boolean(s.flags.hearingAnswer&&s.flags.safetyPlan)&&!['unionFollowup','pressFollowup','staffFollowup'].some(k=>s.flags[k]);}
export function resumeAftermath(s){if(!canResumeAftermath(s))throw new Error('這份存檔不能重複回訪');const next=structuredClone(s);next.scene='postUnion';next.pageIndex=0;next.note='已接續新增回訪；原聽證結果與承諾保留。';return next;}
