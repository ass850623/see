export const reporterTopics=[
 {id:'source',title:'消息來源與採訪界線',question:'「有人把報導更新時間當成事發時間，進一步說提供資料的人都是收錢辦事。」知言把兩篇存檔並排。「我可以給你核對方法，但不會交出私人聯絡名單。你要怎麼處理來源？」',choices:[
 {id:'protect',text:'保護來源，公開可核對的方法與更正紀錄。',reply:'知言把來源欄的個資遮去。「匿名不是不用驗證。方法可以重做，身分不必成為攻擊目標。我會提供不含個資的存檔，仍獨立報導你的決策。」'},
 {id:'expose',text:'要求提供者具名，否則不相信資料。',reply:'「具名可以由本人選擇，但我不能替他答應。」知言拒絕交出名單。「你仍能核對公開報導。名字不能替代驗證，也不能用來換取我信任你。」'},
 {id:'bargain',text:'如果提供資料，要求報導先對自己有利。',reply:'知言把筆放下。「資料交換不能變成報導立場交易。公開存檔仍可以給你，專訪合作就到這裡。你可以提問，也必須接受答案不是你要的。」'}
 ]},
 {id:'correction',title:'更正的責任與期限',question:'「如果你的人轉貼了錯誤時間，原文已經被看過幾千次。悄悄把字換掉，讀者會知道嗎？」知言問。「我更正自己的報導，也要知道你會怎麼對待自己的錯誤。」',choices:[
 {id:'visible',text:'承諾故事第 2 日中午前，發布帶原因與版本紀錄的更正。',reply:'「我會追蹤那份更正。」知言記下時間。「要列出原說法、修正內容與依據；不是用新文章把舊文章蓋過去。這是你的公開承諾，不能在今晚結算時當作已經做完。」'},
 {id:'quiet',text:'先悄悄改掉轉貼，避免再放大錯誤。',reply:'「刪改可以停止擴散，但看過原文的人不一定回來。」知言要求你保留版本紀錄。她不會把悄悄修改當作完整更正，也會在聽證繼續追問。'},
 {id:'review',text:'先核對轉貼內容，再決定更正範圍，暫不承諾日期。',reply:'「核對是必要的。」知言說。「請給我追蹤窗口。沒有日期就表示仍待安排，不能寫成已完成更正。」她把你的說法和公開存檔分開記錄。'}
 ]}
];
export function chooseReporterReply(state,topicId,choiceId){if(state.scene!=='journalist')throw new Error('僅可在記者訪談進行');const topic=reporterTopics.find(t=>t.id===topicId);const selected=topic?.choices.find(c=>c.id===choiceId);if(!selected)throw new Error('無效訪談選項');const key=topicId==='source'?'reporterSource':'reporterCorrection';if(state.flags[key])throw new Error('此問題已作答');const next=structuredClone(state);next.flags[key]=choiceId;next.note=selected.reply;next.history.push({scene:'journalist',speaker:'許知言',text:topic.question,choice:selected.text+'\n許知言：'+selected.reply});return next;}
export function reporterReaction(state,scene){const f=state.flags;const lines=[];
if(scene==='journalist'){if(f.reporterSource==='protect')lines.push('知言同意提供匿名存檔，強調合作不改變她的獨立報導。');if(f.reporterSource==='expose')lines.push('知言拒絕交出私人名單；公開存檔仍可核對，專訪是否繼續由她決定。');if(f.reporterSource==='bargain')lines.push('知言拒絕有利報導的交易，這次只接受書面資料，不再提供具名專訪。');if(f.reporterCorrection==='visible')lines.push('你已承諾故事第 2 日中午前發布有版本紀錄的更正，知言會追蹤。');}
if(scene==='hearing1'){if(f.reporterSource==='bargain')lines.push('知言先聲明：「你曾要求有利報導，我拒絕了。今天仍按公開證據提問。」');if(f.reporterCorrection==='quiet')lines.push('知言追問：「悄悄修改的說法有版本紀錄嗎？請不要把刪改當成公開更正。」');if(f.reporterCorrection==='visible')lines.push('知言提醒：「你承諾明日中午前更正，今天的回答也會成為版本紀錄。」');}
if(scene==='night'){if(f.reporterCorrection==='visible')lines.push('予澄把明日中午的更正期限排進清單；文章尚未發布，承諾仍待履行。');if(f.reporterSource==='bargain')lines.push('知言的專訪合作暫停。予澄提醒，不能靠要求報導友善來修復關係。');if(f.reporterSource==='protect')lines.push('知言寄來匿名存檔核對方法，同時列出下一次要追問的問題。');}
return lines.join('\n\n');}
export function reporterRelationship(state){const f=state.flags;if(f.pressFollowup==='spin')return '許知言｜核對短片與完整紀錄，暫停專訪；原先採訪分歧仍保留。';if(f.reporterSource==='bargain')return '許知言｜拒絕報導交易，暫停專訪合作；公開核對仍可進行。';if(f.reporterSource==='expose')return '許知言｜來源保護存在分歧，拒絕提供私人名單。';if(f.reporterSource==='protect')return '許知言｜願意合作核對資料，維持獨立報導。';return '許知言｜尚未討論採訪界線。';}
