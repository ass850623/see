export const staffMembers={yucheng:'林予澄',player:'沈若川'};
export const staffTasks=[
 {id:'timeline',title:'時間線與授權核對',brief:'整理 E02／E03 的時鐘校正、公開範圍與未知動機；寫成聽證可使用的核對稿。',pages:[
 '予澄把核對稿分成三欄：原始時間、校正後時間、允許公開的內容。「前兩欄正確，不表示第三欄自動成立。」她把工會的資料使用表放在旁邊，不讓方法與授權分開流轉。',
 '若由你親自整理，你必須把依據寫到別人也能重做；若交予澄，她會把方法與未解問題交回來讓你審閱。誰執筆都不能把「動機未知」改成「已排除一切動機」。'
 ]},
 {id:'relief',title:'救助窗口與資格問題',brief:'整理船員與周邊工作者的窗口、資格疑問與待主管單位回答事項；不把轉介當成撥款。',pages:[
 '桌上有兩種陳情：傷者家屬問何時拿到回覆，周邊工作者問自己是否在資格之內。予澄說，先把兩種問題分開，才不會用同一個電話號碼假裝已經有了答案。',
 '這份工作能產出的是窗口清單和待查問題，不是主管機關的核定書。沒有走訪過的人只能列出待訪需求，不能寫成他們已接受你的安排。'
 ]},
 {id:'bill',title:'管制草案審查',brief:'比較失效日期、申訴程序、執行紀錄與司法審查；整理可提案的修正，不代表法案已通過。',pages:[
 '草案使用了很多「必要時」與「主管機關得」。予澄在每一處旁邊問同一件事：必要由誰判斷、要留下什麼記錄、誰能要求停止？只把字改成「民主」並不會回答這些問題。',
 '你們可以提出一份修正對照稿，但黨團仍須協商，議會仍須表決。這項準備不等於你已獲得其他委員支持。它讓你知道自己要談哪一條，也讓對方能針對條文回應。'
 ]}
];
export function staffAssignments(s){return staffTasks.filter(t=>s.flags['staff_'+t.id]).map(t=>({...t,member:s.flags['staff_'+t.id]}));}
export function validStaffFlags(flags){if(flags.staffConfirmed!==undefined&&typeof flags.staffConfirmed!=='boolean')return false;if(flags.staffReview!==undefined&&!['ready','review'].includes(flags.staffReview))return false;const assignments=staffTasks.map(t=>flags['staff_'+t.id]).filter(x=>x!==undefined);return assignments.every(x=>Object.hasOwn(staffMembers,x))&&assignments.length<=2&&new Set(assignments).size===assignments.length&&(!flags.staffConfirmed||assignments.length===2);}
export function assignStaff(s,taskId,member){if(s.scene!=='aide'||s.flags.staffConfirmed)throw new Error('目前不能修改分工');if(!staffTasks.some(t=>t.id===taskId)||!Object.hasOwn(staffMembers,member))throw new Error('無效分工');if(s.flags['staff_'+taskId])throw new Error('工作已分配');if(staffAssignments(s).some(t=>t.member===member))throw new Error('此人今天的準備時段已用完');const next=structuredClone(s);next.flags['staff_'+taskId]=member;next.note=`${staffMembers[member]}負責${staffTasks.find(t=>t.id===taskId).title}。尚未確認分工。`;return next;}
export function resetStaff(s){if(s.scene!=='aide'||s.flags.staffConfirmed)throw new Error('已確認的分工不能重排');const next=structuredClone(s);for(const t of staffTasks)delete next.flags['staff_'+t.id];next.note='已清空尚未確認的分工。';return next;}
export function confirmStaff(s){if(s.scene!=='aide'||s.flags.staffConfirmed||staffAssignments(s).length!==2)throw new Error('請分配兩項工作後再確認');const next=structuredClone(s);next.flags.staffConfirmed=true;next.note='分工已確認：兩份準備稿將在聽證準備場景交付，第三項保留待辦。';next.history.push({scene:'aide',speaker:'林予澄',text:'每人一個準備時段，三項工作選兩項。',choice:staffAssignments(s).map(t=>`${staffMembers[t.member]}：${t.title}`).join('\n')});return next;}
export function staffReport(s,task){if(task.id==='timeline')return `核對稿：船上快四十秒，須校正；事故順序可核對，動機未知。${s.evidence.E02?.authorized?'E02 已取得遮蔽與完整脈絡下的公開授權。':'E02 尚未獲公開授權，不能在公開聽證直接出示。'}${s.evidence.E03?.verified?' E03 已核實。':' E03 仍待核實。'}`;if(task.id==='relief')return `窗口稿：船員救助與周邊工作者資格分開查詢。${s.flags.fieldShop==='criteria'?'秋月的資格疑問已記入追蹤。':'周邊工作者需求仍須確認，不能代稱已接受安排。'} ${s.flags.reliefPromise==='report'?'七日回報承諾仍待履行。':'轉介或資料整理不等於補助核定。'}`;return '草案稿：列出失效期限、司法審查、申訴管道與公開執行紀錄四項問題；這是協商準備，不代表修正已通過。';}
export function canReviewStaff(s){return s.scene==='checkpoint'&&s.flags.staffConfirmed===true;}
export function reviewStaff(s,answer){if(!canReviewStaff(s)||!['limits','finished'].includes(answer))throw new Error('目前不能審閱成果');const next=structuredClone(s);next.flags.staffReview=answer==='limits'?'ready':'review';next.note=answer==='limits'?'審閱完成：核對稿與窗口稿是準備成果，不代表授權、補助或法律已完成。未分配工作仍須追蹤。':'請重看成果限制：資料整理不會新增公開授權；窗口清單不等於補助，修正對照稿不等於表決通過。';return next;}
export function staffReaction(s,scene){if(!s.flags.staffConfirmed)return '';const done=staffAssignments(s).map(t=>`${staffMembers[t.member]}：${t.title}`).join('；');const missing=staffTasks.find(t=>!s.flags['staff_'+t.id]);const lines=[];if(scene==='checkpoint')lines.push(`準備稿已交付：${done}。尚未安排：${missing.title}。可開啟幕僚工作板審閱。`);if(scene==='caucus'&&s.flags.staff_bill)lines.push('你帶著失效期限、司法審查、申訴及公開紀錄四項修正問題，仍須逐條協商。');if(scene==='hearing1'&&s.flags.staff_timeline)lines.push('予澄把授權範圍放在時間線旁，提醒準備稿不能取代原始資料的公開同意。');if(scene==='hearing3'&&s.flags.staff_relief)lines.push('窗口稿區分船員與周邊工作者資格；你能提出追查方向，但不能承諾主管機關尚未核定的結果。');if(scene==='night'){lines.push(`今晚整理出的準備稿：${done}。${missing.title}仍保留待辦。`);if(s.flags.aideDelegation==='centralize')lines.push('予澄提醒，所有對外承諾仍須由你確認，集中決策讓後續回覆排程更緊。');if(s.flags.staffReview==='review')lines.push('準備稿的完成界線尚未釐清，團隊要求再次確認哪些事情只是提出、哪些已獲授權。');}return lines.join('\n\n');}
