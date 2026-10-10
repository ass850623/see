export const diplomacyTopics=[
 {key:'diplomacyAid',title:'援助清單背後的共同聲明',question:'艾琳展示三份不同的提案。海西聯邦提供航道分析，但希望聯合聲明引用它的安全判斷；旭輪國提出民間救援；西陸共同體願派調查顧問，要求群島公開採購與監督規則。「三方沒有共同的指揮官，也沒有相同的條件。你要先答應哪一項？」',choices:[
 {id:'separate',text:'接受技術與救援協商，政治聲明另案審議。',reply:'艾琳會轉達分案要求；海西的完整航道分析可能延後。旭輪的民間窗口可以繼續洽談，但沒有隊伍因這通電話就已出發。'},
 {id:'joint',text:'先協商共同聲明，爭取航道分析優先交付。',reply:'艾琳要求逐句確認聲明。「優先不等於保證到貨，聲明也不是由你單獨批准。」予澄標記對方的安全判斷為外部主張，不能拿它替代事故調查。'}]},
 {key:'diplomacyData',title:'顧問要的是原始航行紀錄',question:'海西顧問說遮蔽版本可能看不清船員操作，要求取得完整紀錄。艾琳問資料提供者是否同意跨境使用。予澄提醒：工會允許聽證公開的範圍，並不自動涵蓋外部顧問、資料留存或再次轉交。',choices:[
 {id:'minimal',text:'先提供去識別摘要與方法，另詢跨境使用同意。',reply:'艾琳接受先談方法，顧問仍可能要求補件。原始紀錄不會送出；授權、用途、留存與再轉交限制須另行確認。'},
 {id:'request',text:'要求顧問列出必要欄位，再向來源申請限定用途授權。',reply:'艾琳會索取欄位與用途清單，完整分析暫待授權。予澄拒絕在申請尚未同意前寄送原件；即使對方催促，也不會擴大現有 E02 或 E03 授權。'}]},
 {key:'diplomacySecrecy',title:'保密期限與撤回權',question:'艾琳把合作附件停在第六頁。對方希望直到聯合調查結束才公開條件，卻沒有預定結束日；還要求退出前先取得伙伴同意。「涉及船員的部分可以保護，但合作條件也要全部保密嗎？」',choices:[
 {id:'review',text:'要求三十日重審、公開條件摘要，保留群島撤回權。',reply:'艾琳會送交伙伴重談，資料交付速度可能受影響。三十日是審查節點，不是所有資料的解密日；群島仍須確認撤回後的留存與刪除安排。'},
 {id:'closed',text:'先接受閉門協商框架，將期限與退出條款列為待談。',reply:'艾琳只確認下一輪閉門會議，沒有宣告條約生效。予澄留下兩項缺口：誰決定保密結束、退出是否受外方否決。你不能把待談事項寫成自主權已獲保障。'}]}
];
export function answerDiplomacy(s,key,id){const t=diplomacyTopics.find(t=>t.key===key),c=t?.choices.find(c=>c.id===id);if(s.scene!=='diplomacy'||!c||s.flags[key])throw new Error('目前無法重作外交協商');const n=structuredClone(s);n.flags[key]=id;n.note=c.reply;n.history.push({scene:s.scene,speaker:'艾琳・維爾',text:t.question,choice:c.text+'\n'+c.reply});return n;}
export function diplomacyReaction(s,scene){const f=s.flags,lines=[];if(!['diplomacy','hearing3','postPress','postStaff','chapterEnd'].includes(scene))return '';if(f.diplomacyAid)lines.push(f.diplomacyAid==='separate'?'外援：救援與政治聲明分案洽談；航道分析可能延後，援助尚未交付。':'外援：共同聲明逐句待審；外方安全主張不等於事故動機的證據。');if(f.diplomacyData)lines.push(f.diplomacyData==='minimal'?'資料：先議去識別摘要與方法，跨境用途另詢同意；原件未送出。':'資料：必要欄位與限定用途另行申請；未經來源同意不交付原件。');if(f.diplomacySecrecy)lines.push(f.diplomacySecrecy==='review'?'合作附件：三十日重審、條件摘要與撤回權仍為協商要求，伙伴尚未同意。':'合作附件：保密終止與退出條款尚未談妥，閉門會議不是生效協議。');if(scene!=='diplomacy'&&f.foreignTerms==='rescue'&&(f.diplomacyAid||f.diplomacyData||f.diplomacySecrecy))lines.push('最後選擇民間救援優先；分析資料與政治聲明留待另案協商，未隨救援窗口自動成立。');if(scene!=='diplomacy'&&f.foreignTerms==='oversight'&&f.diplomacySecrecy==='closed')lines.push('公開監督立場仍須帶回閉門協商；尚未取得可公開的合作條件，予澄要求補上此項。');return lines.join('\n\n');}
