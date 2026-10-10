export const caucusTopics=[
 {key:'caucusScope',title:'第一條：誰的話可以被限制',question:'周岳圈起「足以影響公共安定」。「這幾個字可以處理偽造疏散命令，也可以處理批評港務局的人。行政部門要速度，你得告訴我哪一種風險值得留下。」',choices:[
 {id:'narrow',text:'限於可具體證明的迫切危害，保障批評與新聞查證。',reply:'周岳要求主管機關逐案說明危害，不能只拿負面聲量當理由。「審查會慢些；你得承受政府說我們綁住救援的批評。」'},
 {id:'broad',text:'暫留公共安定條款，讓行政機關先處置再說明。',reply:'周岳保留廣泛裁量。「快是真的快。但一篇追問失職的報導被下架時，你也不能只說那是承辦人的決定。」'}]},
 {key:'caucusReview',title:'第二條：臨時權力何時停止',question:'草案只有「情勢穩定後停止」。予澄問誰來認定穩定。周岳說，期限太短可能中斷危機處理，沒有期限則連續任的議員都未必收得回權力。',choices:[
 {id:'sunset',text:'七日自動失效；延長須表決，保留申訴與司法審查。',reply:'周岳把續行表決與申訴程序寫入修正清單。「這會多一場協商，也可能輸掉表決。期限不是危機結束的保證。」'},
 {id:'executive',text:'由行政部門決定終止，每週向黨團閉門報告。',reply:'周岳提醒閉門報告不能替代受影響者的申訴。「你保住了調度彈性；但民眾仍看不到為何限制他們。」'}]},
 {key:'caucusConflict',title:'第三條：贊助名冊與調查席位',question:'周岳承認地方活動收過維護公司的贊助，但金流尚未核對。「要查就查。有人會要求先放下名冊，換黨團給你調查席位與人手。」予澄把調閱單推回桌中央：接受人手，是否也等於接受調查邊界？',choices:[
 {id:'recuse',text:'先申報利益並要求迴避；合約與金流交獨立調查。',reply:'周岳答應提出申報與迴避建議，黨團增派人手暫緩。「你會少一些助手；我們也不能替自己審完自己。」贊助與事故的關係仍未證實。'},
 {id:'delay',text:'先保留名冊調閱，換取黨團提供協商與調查人手。',reply:'周岳記下資源協調意向，尚未有人正式到任。予澄要求把暫緩調閱寫清楚。「人手不是免費的；日後必須回答為什麼先查設備、後查政治金流。」'}]}
];
export function answerCaucus(s,key,id){const t=caucusTopics.find(t=>t.key===key),c=t?.choices.find(c=>c.id===id);if(s.scene!=='caucus'||!c||s.flags[key])throw new Error('目前無法重作黨團協商');const n=structuredClone(s);n.flags[key]=id;n.note=c.reply;n.history.push({scene:s.scene,speaker:'周岳',text:t.question,choice:c.text+'\n'+c.reply});return n;}
export function caucusReaction(s,scene){const f=s.flags,lines=[];if(!['caucus','hearing2','postStaff','chapterEnd'].includes(scene))return '';if(f.caucusScope)lines.push(f.caucusScope==='narrow'?'協商底線：具體迫切危害才可限制，保留新聞與批評空間。':'協商底線：保留廣泛行政裁量，新聞自由疑慮仍需回應。');if(f.caucusReview)lines.push(f.caucusReview==='sunset'?'監督提案：七日失效、延長表決與申訴；條文尚未通過。':'監督提案：行政決定終止與閉門報告，公開監督仍有缺口。');if(f.caucusConflict)lines.push(f.caucusConflict==='recuse'?'周岳的利益申報與迴避建議待處理；黨團增派人手暫緩，獨立調查尚未成立。':'黨團協調人手尚未到任；贊助名冊調閱被暫緩，予澄保留此項待辦。');if(scene!=='caucus'&&f.emergencyBill==='reject'&&(f.caucusScope||f.caucusReview))lines.push('你最後反對原案；上述條文要求保留作替代提案，沒有成為已通過的管制規則。');if(scene!=='caucus'&&f.emergencyBill==='accept'&&(f.caucusScope==='narrow'||f.caucusReview==='sunset'))lines.push('你最後接受原案，先前提出的限制尚未納入；予澄要求你回應這項立場落差。');return lines.join('\n\n');}
