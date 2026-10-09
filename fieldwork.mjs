export const fieldVisits=[
 {id:'dispatch',key:'fieldDispatch',title:'值班窗口 · 誰知道何時復航',speaker:'值班員吳芷',pages:[
 '值班窗口的玻璃上貼著停航公告。吳芷每隔幾分鐘就要回答一次相同的問題：今天還有船嗎？她指向牆上的時鐘。「公告只有停止服務，沒有下一次更新時間。就算我不知道答案，也得讓旅客知道什麼時候能再問。」',
 '她拿出昨天的工作紀錄。接到事故通報後，服務台一直等待港務單位回覆，臨時接駁的消息卻先從乘客手機傳回來。「不是每一個錯誤都是有人撒謊。有時候是每一個窗口都以為另一個人會先說。」',
 '這份紀錄說明資訊窗口失靈，不能證明碰撞動機。你可以爭取明確的公告責任，也可以先把疑問交給調查。吳芷說：「請不要叫我保證何時復航。問清楚誰能公布、多久更新，比叫我們笑著說快了更有用。」'
 ],choices:[{id:'schedule',text:'提出單一公告窗口與固定更新時段。',reply:'吳芷願意提供服務流程，要求保留「尚待確認」的資訊，不用錯誤日期安撫乘客。你把公告機制列為聽證建議。'},{id:'investigate',text:'先確認各單位通知順序，不承諾更新機制。',reply:'吳芷提供通知紀錄供追查。你留下流程問題，尚未提出可執行的公告安排。'}]},
 {id:'shop',key:'fieldShop',title:'港邊小店 · 停航之外的生計',speaker:'店主江秋月',pages:[
 '小店已經備好午餐，卻沒有昨天預訂的團體。秋月把盒飯放回保溫箱。「我們不是船員，也沒有船員證。停航讓客人不來，但表格上沒有這一欄。」她想知道的是資格，不是請你拍一張合照。',
 '你問能否把她的情況公開。她先問會不會出現店名。「我不想讓人說，支持哪個黨就可以拿到補助。我只想知道，誰規定哪些損失可以申請。如果規定不包括我們，至少把理由說清楚。」',
 '她提供的是自身營業受影響的說明，不是全港損失估算。予澄提醒，不能用一家店代表所有人，也不能把一則陳情寫成政府已答應撥款。你要先追資格，還是先讓她使用現有窗口？'
 ],choices:[{id:'criteria',text:'七日內回覆救助資格，不保證尚未審定的補助。',reply:'秋月同意匿名引用自身困境；你承諾查明資格並回覆，不保證任何尚未審定的金額。'},{id:'refer',text:'先轉介現有服務台，保留資格是否適用的疑問。',reply:'秋月收下聯絡方式，但希望下次不必再被不同窗口互相轉介。你尚未承諾資格調查期限。'}]},
 {id:'crew',key:'fieldCrew',title:'船員休息區 · 那十秒之外',speaker:'船員鄭曜',pages:[
 '鄭曜坐在休息區最遠的椅子上。「影片裡是我的同事，不是我。」他一開始就說清楚。他昨晚在另一艘船上，聽過部分無線電呼叫，沒有看到全部碰撞過程。',
 '他記得岸上有一段時間沒有回話，但不知道原因。「有人說我可以替他們證明對方先挑釁。我證明不了。我只能說那時候我聽到什麼。」他要求你把這個限制和他的說法寫在同一頁。',
 '你可以邀請他留下匿名陳述，再和正式紀錄核對；也可以請他面對鏡頭。兩者都需要本人同意。你不能用另一名船員的口述，替原始紀錄取得公開授權。'
 ],choices:[{id:'anonymous',text:'記錄匿名陳述與觀察限制，再核對原始資料。',reply:'鄭曜同意匿名紀錄，不同意公開姓名或影像。這份陳述仍是待核對口述，不可替代 E02／E03。'},{id:'camera',text:'詢問是否願意出鏡；拒絕也不影響調查。',reply:'鄭曜拒絕出鏡，只願意提供匿名陳述。你接受拒絕，仍需核對完整紀錄。'}]}
];
export function canFieldwork(s){return ['harborTalk','union','unionAfter'].includes(s.scene)&&Boolean(s.evidence.E06);}
export function readFieldPage(s,id){const visit=fieldVisits.find(v=>v.id===id);if(!canFieldwork(s)||!visit)throw new Error('目前無法走訪');const next=structuredClone(s);const key='fieldPage_'+id;const page=Number(next.flags[key]||'0');if(page>=visit.pages.length)throw new Error('已讀到作答頁');next.flags[key]=String(page+1);return next;}
export function answerField(s,id,answer){const visit=fieldVisits.find(v=>v.id===id);const option=visit?.choices.find(c=>c.id===answer);if(!canFieldwork(s)||!visit||!option)throw new Error('無效走訪回答');if(Number(s.flags['fieldPage_'+id]||0)<visit.pages.length)throw new Error('請先完成訪談閱讀');if(s.flags[visit.key])throw new Error('此訪談已完成');const next=structuredClone(s);next.flags[visit.key]=answer;next.note=option.reply;next.history.push({scene:s.scene,speaker:visit.speaker,text:visit.pages.join('\n\n'),choice:option.text+'\n'+option.reply});return next;}
export function fieldReaction(s,scene){const f=s.flags;const lines=[];if(scene==='reconcile'){if(f.fieldCrew)lines.push('鄭曜的匿名口述有觀察限制，仍須與 E02／E03 核對；不新增動機證據。');if(f.fieldDispatch)lines.push('值班窗口紀錄顯示公告責任不清，這是復航資訊問題，不能當作碰撞原因。');}if(scene==='hearing3'){if(f.fieldDispatch==='schedule')lines.push('你帶來固定更新時段與單一公告窗口建議；港務單位仍須確認可執行安排。');if(f.fieldShop==='criteria')lines.push('秋月的案例提醒，停航救助資格可能漏掉周邊工作者；你將要求說明適用範圍。');}if(scene==='night'){if(f.fieldShop==='criteria')lines.push('秋月等待資格說明，不是已取得補助。予澄把回覆窗口與期限列入待辦。');if(f.fieldDispatch==='schedule')lines.push('吳芷詢問公告機制何時確認；聽證提出建議還不是已實施。');}return lines.join('\n\n');}
export function fieldNotes(s){return fieldVisits.filter(v=>s.flags[v.key]).map(v=>({title:v.title,speaker:v.speaker,answer:v.choices.find(c=>c.id===s.flags[v.key])?.text||'',reply:v.choices.find(c=>c.id===s.flags[v.key])?.reply||''}));}
