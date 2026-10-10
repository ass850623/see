export const hearingFollowups=[
 {scene:'hearing1',key:'hearingMethod',speaker:'許知言',title:'時間校正能證明什麼',question:'「如果船上快了四十秒，你怎麼讓觀眾重做核對？又怎麼確定這四十秒沒有替任何一方掩蓋責任？」知言要求你區分原始紀錄、校正方法與政治結論。',choices:[
 {id:'reproduce',text:'列出原始時間與減四十秒的方法，動機仍未知。',reply:'知言要求公開稿附上方法與資料限制。「順序可核對，不等於動機已證明。原始文件能公開多少，仍由授權決定。」'},
 {id:'authority',text:'請觀眾相信調查團隊，不另外說明校正方法。',reply:'「團隊名稱不能替代核對方法。」知言要求補上原始時間與校正步驟，不接受以權威代替說明；這段回應會留在紀錄。'}]},
 {scene:'hearing2',key:'hearingContract',speaker:'周岳',title:'驗收與故障之間',question:'「公司說上月已驗收。你說卷宗缺風險評估附件。那是文件未到齊，還是已能證明這次故障修好了？」周岳要求你把疑點寫成可調閱的項目。',choices:[
 {id:'audit',text:'調閱評估與故障處理原件，不把例行驗收當成修復。',reply:'周岳同意記錄調閱要求。「缺附件不能證明從未評估，上月驗收也不能證明本次故障已修復。調查要能回答這兩個不同問題。」'},
 {id:'closed',text:'既然有驗收，先把維護問題視為已解決。',reply:'周岳指出驗收早於本次故障。「請保留報修與履約問題，不能把行政文件變成修復證明。」你尚未撤銷調查，這個推論仍被記錄為待釐清。'}]},
 {scene:'hearing3',key:'hearingRelief',speaker:'許知言',title:'七日內究竟交付什麼',question:'「有人需要補助，有人需要復航日期。七日報告到期時，如果預算仍沒通過，你會交出什麼？周邊店家又是否在適用範圍？」知言要求可追蹤的回覆，而不是再說一次會照顧大家。',choices:[
 {id:'limits',text:'分列窗口、資格、待審預算與進度，不能保證撥款。',reply:'知言會追蹤不同欄位。「請把沒答案的地方留下，說明要問誰。整理報告不是核定補助，公布窗口也不是復航許可。」'},
 {id:'guarantee',text:'先向所有受影響者保證七日內領到補助。',reply:'予澄當場提醒預算尚待審議，資格仍未確認。知言要求更正保證：「你能要求進度，不能替主管單位承諾尚未核定的款項。」這項過量保證會另列待回覆。'}]}
];
export function hearingTopic(s){return hearingFollowups.find(t=>t.scene===s.scene);}
export function answerHearingFollowup(s,id){const t=hearingTopic(s);const c=t?.choices.find(c=>c.id===id);if(!t||!c||s.flags[t.key])throw new Error('目前無法回答此追問');if(t.scene==='hearing2'&&!s.evidence.E04?.verified)throw new Error('維護文件尚未取得');const next=structuredClone(s);next.flags[t.key]=id;next.note=c.reply;next.history.push({scene:s.scene,speaker:t.speaker,text:t.question,choice:c.text+'\n'+c.reply});return next;}
export function hearingFollowupReaction(s,scene){const f=s.flags;if(scene==='hearing2'&&f.hearingMethod==='authority')return '周岳要求把校正方法補進紀錄，不能用團隊聲望替代可重做的核對。';if(['night','postStaff'].includes(scene)){const lines=[];if(f.hearingMethod==='authority')lines.push('時間校正方法仍需補充說明。');if(f.hearingContract==='closed')lines.push('予澄保留維護調查，驗收與本次修復尚未釐清。');if(f.hearingRelief==='guarantee')lines.push('七日領款保證超出權限，團隊須回覆與更正；原救助進度承諾仍待履行。');return lines.join('\n\n');}return '';}
