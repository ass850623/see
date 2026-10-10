const c=(id,text,next,flags={},stats={})=>({id,text,next,effects:{flags,stats}});
export const proposalScenes={
 c02ProposalDesk:{place:'議會 · 第二輪協商桌',speaker:'周岳',role:'黨團協調人',portrait:'politician',
 beats:['會議室裡只有三把椅子。周岳沒有帶來新的事故結論，而是把一份兩欄的工作約定推到你面前：資料如何查問，以及由誰整理。「你要的界線得有人做；我給的人手，也要知道不能碰什麼。」','予澄在原期限旁畫了一條線。「今天可以談工作方法。不要把這張紙寫成已經發布更正、成立獨立調查或把補助發出去了。」周岳點頭，但堅持最後要有一份雙方能執行的書面版本。'],
 text:'依上一輪選定的焦點逐項談條件。兩項談完後再審閱整份約定，尚未接受前都只是草案。',choices:[]},
 c02BoundaryTerms:{place:'協商桌 · 查證與發言條款',speaker:'沈若川',role:'本土協進黨議員',portrait:'senior',
 beats:['第一張紙寫著「資料先由黨團確認」。你問，確認的是格式，還是連記者要問什麼都要先看？周岳把筆停下。「我能接受外部提問，但無法替所有議員回答。」','予澄提出兩個版本：設一份可公開的問題清單，容許記者自行追問；或先在閉門工作會議核對，再另行決定對外答問。兩者都不交付私人來源、未發布草稿或個案資料。'],
 text:'選擇查證條款。公開問題清單不是公開卷宗；閉門核對也不會撤回已發布說明。',choices:[c('questions','列公開查證問題，保留記者獨立追問。','c02ProposalDesk',{c02BoundaryTerm:'questions'}),c('closed','先閉門核對工作資料，對外答問另議。','c02ProposalDesk',{c02BoundaryTerm:'closed'})]},
 c02StaffTerms:{place:'協商桌 · 人手與調閱條款',speaker:'周岳',role:'黨團協調人',portrait:'politician',
 beats:['周岳把工作內容限在整理公開資料編號與聯絡窗口，不含代替承辦審核，也不含調閱來源的私人紀錄。「即使談成，還得確認輪值人選，不會有人今晚就坐進你辦公室。」','予澄指出另一種做法：由辦公室自行整理，保留黨團提供聯絡轉介的可能。這樣少一層共同答問協調，卻要自己承擔整理時間；原承諾期限仍不延後。'],
 text:'決定人手條件。沿用獨立整理，或在已有合作意向且利益迴避未卡住時，提出受限共同工作席。',choices:[]},
 c02TermsReview:{place:'協商桌 · 工作約定審閱',speaker:'林予澄',role:'幕僚長',portrait:'aide',
 beats:['予澄逐行念出剛才選定的文字，周岳對照自己的修訂。「這些工作方法我可以簽。但不能寫成全黨團已決議，也不能替記者同意。」他把簽名欄留給你。','你也可以帶回修訂，要求下一輪再談。那會保留自己的條件，但今天沒有雙方約定；人手缺口與發言爭議仍列在工作板上。'],
 text:'審閱完整條件後，接受本次有限工作約定，或保留修訂草案。簽署只確認這份工作方法，不代表執行完畢。',choices:[]},
 c02ProposalEnd:{place:'第二章具體提案 · 原型暫停點',speaker:'林予澄',role:'幕僚長',portrait:'aide',terminal:true,
 text:'本次提案、條件與審閱結果已保存。非公開原卷、來源身分、利益調查與個案審核仍待處理；原期限沒有延後。下一段工作約定的執行與首輪回報尚未開放。',choices:[]}
};
export const canJointDesk=s=>s.flags.c02CaucusReply==='coordinate'&&s.flags.caucusConflict!=='recuse';
export function proposalOptions(s){const f=s.flags;
 if(s.scene==='c02ProposalDesk'){
  const first=f.c02NegotiationFocus==='boundaries'?'boundary':'staff',done=f.c02BoundaryTerm||f.c02StaffTerm;
  return [(!f.c02BoundaryTerm&&(done||first==='boundary'))?c('boundary','協商查證與發言條款。','c02BoundaryTerms'):null,(!f.c02StaffTerm&&(done||first==='staff'))?c('staff','協商人手與調閱條款。','c02StaffTerms'):null].filter(Boolean);
 }
 if(s.scene==='c02StaffTerms')return [c('independent','由辦公室自行整理，黨團僅提供窗口轉介。','c02ProposalDesk',{c02StaffTerm:'independent'}),...(canJointDesk(s)?[c('joint','提出受限共同工作席，只整理公開資料與窗口。','c02ProposalDesk',{c02StaffTerm:'joint'})]:[])];
 if(s.scene==='c02TermsReview')return [c('accept','簽署本次有限工作約定，執行結果另行追蹤。','c02ProposalEnd',{c02ProposalOutcome:'limited'},{autonomy:f.c02BoundaryTerm==='questions'?1:-1,tension:-1}),c('revise','保留修訂草案，這次不簽署。','c02ProposalEnd',{c02ProposalOutcome:'counter'})];return proposalScenes[s.scene]?.choices||[];
}
export function proposalSummary(s){const f=s.flags;return [
 {title:'查證與發言條款',status:f.c02BoundaryTerm==='questions'?'公開問題清單 · 保留獨立追問':f.c02BoundaryTerm==='closed'?'閉門工作核對 · 對外答問另議':'尚未選定',detail:'只涉及工作方法，不提供私人來源、未發布草稿或個案資料；已發布說明保留。'},
 {title:'人手與調閱條款',status:f.c02StaffTerm==='joint'?'受限共同席 · 人選待確認':f.c02StaffTerm==='independent'?'辦公室自行整理 · 保留時間負擔':'尚未選定',detail:f.c02StaffTerm==='joint'?'僅整理公開資料與窗口，沒有新增非公開調閱權限，人員尚未到任。':'黨團只協助窗口轉介，不提供新到任人手或私有資料調閱權限。'},
 {title:'本次工作約定',status:f.c02ProposalOutcome==='limited'?'雙方已簽有限工作方法 · 尚待執行':f.c02ProposalOutcome==='counter'?'修訂草案保留 · 未簽署':'草案待審閱',detail:'不是全黨團決議、新聞背書或承諾履行；原期限與利益調查分歧保留。'}
 ];}
export function proposalReaction(s){const f=s.flags;
 if(s.scene==='c02ProposalDesk')return '上一輪焦點：'+(f.c02NegotiationFocus==='boundaries'?'先談查證與調查界線。':'先談人手與分工。')+'兩項須各自確認。';
 if(s.scene==='c02StaffTerms')return canJointDesk(s)?'既有答問整合意向容許提出受限共同席；人選、範圍與執行仍須確認。':f.caucusConflict==='recuse'?'昨日利益迴避建議尚未處理，共同席方案本輪暫不提供。可保留獨立整理與窗口轉介。':'上一輪採分列立場，本輪未談妥共同席前提，先以獨立整理與窗口轉介提出條件。';
 if(s.scene==='c02BoundaryTerms')return (f.c02PublicDisposition==='published'?'既有公開說明不因新條款撤回。':'本輪未發布草稿保留在辦公室，不交付協商桌。')+'\n'+(f.c02ReporterReply==='defer'?'上一輪新增答問暫緩；本條款不直接送出新答問。':'上一輪已回覆使用界線；新條款不等於記者接受安排。')+((f.reporterSource==='bargain'||f.pressFollowup==='spin')?'原專訪合作仍暫停。':'記者保留獨立查證。');
 if(['c02TermsReview','c02ProposalEnd'].includes(s.scene))return proposalSummary(s).map(i=>`${i.title}｜${i.status}\n${i.detail}`).join('\n\n');return '';
}
export function validProposal(s){const f=s.flags,keys=['c02ProposalStarted','c02BoundaryTerm','c02StaffTerm','c02ProposalOutcome'];
 if(!f.c02ProposalStarted)return !keys.some(k=>f[k]!==undefined)&&!proposalScenes[s.scene];
 if(f.c02ProposalStarted!==true||!proposalScenes[s.scene]||!['boundaries','staffing'].includes(f.c02NegotiationFocus))return false;
 if(f.c02BoundaryTerm!==undefined&&!['questions','closed'].includes(f.c02BoundaryTerm))return false;
 if(f.c02StaffTerm!==undefined&&(!['independent','joint'].includes(f.c02StaffTerm)||(f.c02StaffTerm==='joint'&&!canJointDesk(s))))return false;
 const both=Boolean(f.c02BoundaryTerm&&f.c02StaffTerm),first=f.c02NegotiationFocus==='boundaries'?'boundary':'staff';
 if(['c02TermsReview','c02ProposalEnd'].includes(s.scene)?!both:both)return false;
 if(s.scene==='c02BoundaryTerms'&&(f.c02BoundaryTerm||(first==='staff'&&!f.c02StaffTerm)))return false;
 if(s.scene==='c02StaffTerms'&&(f.c02StaffTerm||(first==='boundary'&&!f.c02BoundaryTerm)))return false;
 if(first==='boundary'&&f.c02StaffTerm&&!f.c02BoundaryTerm||first==='staff'&&f.c02BoundaryTerm&&!f.c02StaffTerm)return false;
 return s.scene==='c02ProposalEnd'?['limited','counter'].includes(f.c02ProposalOutcome):f.c02ProposalOutcome===undefined;
}
