export const correctionTasks=[
 {id:'method',title:'補上時間校正方法',needed:f=>f.hearingMethod==='authority',pages:[
 '予澄打開聽證錄影，你說「請相信團隊」的回答仍在原位置。「補件不能把這句話刪掉。我們要在它旁邊附上別人能重做的方法。」她把原始時間與校正後時間排成兩欄，要求每一個箭頭都能對到資料。',
 '船上時間快四十秒，校正應減四十秒。原始偏航 23:12:40、轉向 23:14:40、碰撞 23:15:40，對應 23:12、23:14、23:15；港口通訊中斷為 23:13–23:16。這能核對順序，不能單憑順序判定動機。',
 '你還需要確認公開範圍。即使校正稿準備好，未授權原件也不能附上。予澄留下資料限制欄：「不公開個資，也不能讓讀者以為我們已發布所有原檔。」'
 ],correct:'保留原回答，附原始時間、減四十秒的方法與未知動機。',wrong:'刪掉原回答，只寫「團隊已確認真相」。',draft:'時間方法稿：保留原答覆，列明四十秒校正及事故順序；政治動機仍未知。'},
 {id:'maintenance',title:'重開驗收與故障問題',needed:f=>f.hearingContract==='closed',pages:[
 '維護稿原來寫著「已解決」。安禾的通報卻沒有因此消失。予澄要求把例行驗收日期與本次報修日期並排：「先承認先前推論太快，再說清楚調閱什麼，不能把問題換個標題就當成改正。」',
 '上月例行驗收不等於本次故障已修復；卷宗缺風險評估附件，也不等於從未評估。稿件要區分現有文件、尚缺原件與待主管單位回答的履約問題。',
 '提出調閱尚未收到文件，更不代表已判定貪污。予澄把調閱清單保留為待辦，要求對外稿不要把「要求取得」改成「已查明」。'
 ],correct:'撤回已解決推論，列出調閱清單與未確認履約問題。',wrong:'維持已解決，只補上一句「將持續關心」。',draft:'維護釐清稿：撤回以驗收推論修復的說法；評估原件、故障處理與履約仍待調閱。'},
 {id:'relief',title:'更正七日領款保證',needed:f=>f.hearingRelief==='guarantee',pages:[
 '予澄重播七日領款那一句，沒有先替你緩頰。她問，誰核定資格、誰通過預算、誰能真的發款。「你現在能準備更正。不能叫受影響的人假裝沒聽過保證，也不能用進度報告取代回答。」',
 '更正稿應列出原保證、為何超出權限、現有窗口，以及預算與資格仍未核定的狀態。準備一份稿還沒有發布，也沒有通知每個曾聽到保證的人。',
 '救助進度報告仍是另一項工作。予澄把更正、受影響者回覆、主管窗口確認分成三欄：「今晚可以把文字準備到可審閱；明天還要安排發布與聯絡，不能提前標記全部完成。」'
 ],correct:'撤回領款保證，列明原說法、限制、窗口與待確認事項。',wrong:'不提原保證，只發布新的救助宣傳。',draft:'救助更正稿：撤回未核定七日領款保證；保留原發言，列明資格、預算與窗口限制，發布及聯絡仍待安排。'}
];
export function availableCorrections(s){return correctionTasks.filter(t=>t.needed(s.flags));}
export function prepareCorrection(s,id,answer){const t=availableCorrections(s).find(t=>t.id===id);if(!['night','postStaff'].includes(s.scene)||!t||!['bounded','erase'].includes(answer))throw new Error('目前無法整理此補件');const key='correction_'+id;if(s.flags[key]==='ready')throw new Error('此稿已完成審閱');const next=structuredClone(s);next.flags[key]=answer==='bounded'?'ready':'review';next.note=answer==='bounded'?t.draft+' 尚未發布。':'予澄要求重寫：保留原紀錄、說明修正與限制，不能把舊問題藏進新宣傳。';next.history.push({scene:s.scene,speaker:'林予澄',text:t.pages.join('\n\n'),choice:(answer==='bounded'?t.correct:t.wrong)+'\n'+next.note});return next;}
export function correctionReaction(s,scene){if(!['night','postStaff','chapterEnd'].includes(scene))return '';return availableCorrections(s).map(t=>s.flags['correction_'+t.id]==='ready'?`${t.title}：已備妥審閱稿，尚未發布或完成外部回覆。${['union','press'].some(r=>s.flags['draftReview_'+r+'_'+t.id])?' 外部意見已留在稿件審閱紀錄，不代表背書。':''}`:s.flags['correction_'+t.id]==='review'?`${t.title}：稿件仍須重寫，原問題未解除。`:`${t.title}：尚未整理，可在夜間補件桌處理。`).join('\n\n');}
const reviewerScenes={union:'postUnion',press:'postPress'};
const reviewerNames={union:'陳海寧',press:'許知言'};
export function reviewComment(s,id,reviewer){if(reviewer==='union'){const comments={method:'海寧要求公開稿與工會收到的稿保留同一套時間校正與個資限制，不能用工會交件宣稱全體會員支持政治結論。',maintenance:'海寧要求區分維護文件與會員意見；補上調閱項目，不把「要求調查」寫成工會已證明公司有罪。',relief:'海寧要求逐項列出船員與周邊工作者的資格疑問，以及回覆窗口；沒有核定金額，不以工會署名保證補助。'};return comments[id]+(!s.evidence.E02?.authorized?' 航行原件仍未獲公開授權。':' 原公開授權仍須遮蔽個資與保留完整脈絡。');}if(reviewer==='press'){const comments={method:'知言要求在補充稿附原問題、原回答與校正步驟，讓讀者看到修改理由；不能把原權威式回答剪成從未發生。',maintenance:'知言要求把「驗收不等於本次修復」寫進修正欄，並列出尚未取得的文件，而不是只更換標題。',relief:'知言要求明列原領款保證、撤回原因與待確認預算；新的救助資訊不能掩蓋先前過量承諾。'};return comments[id]+(s.flags.reporterSource==='bargain'||s.flags.pressFollowup==='spin'?' 她可以核對稿件，暫停的專訪合作仍未恢復。':' 她保留獨立報導與後續追問。');}return '';}
export function canReviewCorrection(s,id,reviewer){return s.scene===reviewerScenes[reviewer]&&availableCorrections(s).some(t=>t.id===id)&&s.flags['correction_'+id]==='ready'&&!s.flags[`draftReview_${reviewer}_${id}`];}
export function reviewCorrection(s,id,reviewer,answer){if(!canReviewCorrection(s,id,reviewer)||!['incorporate','reserve'].includes(answer))throw new Error('目前無法進行外部審閱');const next=structuredClone(s);next.flags[`draftReview_${reviewer}_${id}`]=answer;next.note=answer==='incorporate'?'你把審閱意見加入稿件附註；尚未發布，對方未替政治結論背書。':'你保留原稿，將對方異議附於審閱紀錄；合作分歧尚未解除。';next.history.push({scene:s.scene,speaker:reviewerNames[reviewer],text:reviewComment(s,id,reviewer),choice:(answer==='incorporate'?'納入限制與修正意見，保留原紀錄。':'保留原稿，附上對方異議。')+'\n'+next.note});return next;}
export function correctionPacket(s,id){const t=availableCorrections(s).find(t=>t.id===id);if(!t||s.flags['correction_'+id]!=='ready')return '';const parts=[t.draft];for(const [reviewer,name] of Object.entries(reviewerNames)){const answer=s.flags[`draftReview_${reviewer}_${id}`];if(answer)parts.push(`${name}審閱${answer==='incorporate'?'已納入附註':'保留異議'}：${reviewComment(s,id,reviewer)}`);}parts.push('版本仍為審閱稿，尚未發布；審閱不新增授權或恢復專訪合作。');return parts.join('\n\n');}
