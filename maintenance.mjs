export const maintenanceFiles=[
 {title:'合約附件 · 通訊維護',rows:[['受理','收到故障通報後四小時內回覆'],['評估','二十四小時內提出風險評估；修復時程另行核定'],['限制','受理或評估不等於完成修復，附件沒有保證設備永不故障。']]},
 {title:'報修單 · 事故前三週',rows:[['通報','值班單位記錄間歇斷線'],['受理','通報後兩小時確認收到'],['評估','現有卷宗未附二十四小時內風險評估'],['限制','缺附件需調閱原件，不代表評估一定未做。']]},
 {title:'驗收與活動登錄',rows:[['驗收','事故前一個月例行巡檢完成，不是這次故障修復證明'],['贊助','承包商曾登錄地方活動贊助'],['限制','沒有與採購對價相關的金流或往來紀錄，不能據此判定賄賂。']]}
];
export const witnessTopics=[
 {id:'consent',key:'witnessConsent',title:'誰決定是否作證',question:'安禾問：「文件可以核對，但我的名字公開後就收不回來。我不想讓拒絕具名被解讀成不支持群島。你會怎麼安排？」',choices:[
 {id:'private',text:'採匿名書面說明；具名由你自行決定。',reply:'安禾願意提供匿名書面說明；遮蔽資料仍須依原授權使用。她沒有答應具名出席。'},
 {id:'legal',text:'先安排獨立法律諮詢，再讓你決定是否具名。',reply:'安禾願意在諮詢後再考慮；尚未同意具名。你需要確認諮詢窗口，而不是替她簽下同意。'},
 {id:'pressure',text:'要求你為群島利益具名，否則難以合作。',reply:'安禾拒絕個人作證，也不接受你再要求具名。公開維護文件與已允許遮蔽使用的資料仍可核對，不能宣稱她支持你的說法。'}
 ]},
 {id:'support',key:'witnessSupport',title:'保護能做到多少',question:'「法律文件不會讓陌生電話停下來。」安禾說。「我需要的是清楚的聯絡窗口，不是你保證我永遠不會受影響。你能承諾什麼？」',choices:[
 {id:'followup',text:'故事第 2 日中午前確認獨立諮詢與申訴窗口。',reply:'安禾記下期限。你承諾的是確認窗口，不是消除所有風險，也不是保證資金已核定。'},
 {id:'refer',text:'提供現有申訴資訊，不承諾尚未安排的支援。',reply:'安禾收下聯絡方式；個人作證的決定仍保留，窗口是否能提供支援尚待確認。'},
 {id:'guarantee',text:'保證公開後絕不會受到任何影響。',reply:'安禾拒絕這個無法驗證的保證。「你做不到的承諾，不能替我承擔後果。」她要求你給出可確認的措施。'}
 ]}
];
export function chooseWitnessReply(state,topicId,answer){if(state.scene!=='technician')throw new Error('僅可在技師訪談作答');const topic=witnessTopics.find(t=>t.id===topicId);const choice=topic?.choices.find(c=>c.id===answer);if(!choice)throw new Error('無效作證選項');if(state.flags[topic.key])throw new Error('此問題已作答');const next=structuredClone(state);next.flags[topic.key]=answer;next.note=choice.reply;next.history.push({scene:'technician',speaker:'許安禾',text:topic.question,choice:choice.text+'\n許安禾：'+choice.reply});return next;}
export function canReviewMaintenance(state){return state.scene==='reconcile'&&Boolean(state.evidence.E04?.verified);}
export function reviewMaintenance(state,answer){if(!canReviewMaintenance(state))throw new Error('請取得維護文件並進入證據整理');if(!['audit','repaired','bribery'].includes(answer))throw new Error('無效合約判讀');const next=structuredClone(state);next.flags.maintenanceReview=answer==='audit'?'verified':'review';next.note=answer==='audit'?'卷宗缺風險評估附件，應調閱原件與核對履約；例行驗收不等於故障修復，贊助不等於賄賂。':answer==='repaired'?'例行巡檢早於本次故障，不能當作這次已修復的證明。':'活動贊助沒有證明採購對價；應調查，不能直接宣判賄賂。';return next;}
export function maintenanceReaction(state,scene){const f=state.flags;const lines=[];
if(scene==='technician'){if(f.witnessConsent==='pressure')lines.push('安禾拒絕個人作證，仍允許核對公開文件與遮蔽資料；具名邀請已取消。');if(f.witnessConsent==='legal')lines.push('是否具名須等待獨立諮詢，不能替安禾宣布同意。');if(f.witnessSupport==='guarantee')lines.push('安禾沒有接受「完全無風險」的保證。');}
if(scene==='hearing2'){if(f.maintenanceReview==='verified')lines.push('你已核對附件缺漏，能要求調閱履約原件；這仍不是貪污判決。');if(f.witnessConsent==='pressure')lines.push('委員提醒：「證人拒絕個人作證，請勿把文件說成她替你的政治結論背書。」');if(f.witnessConsent==='legal')lines.push('安禾尚未決定具名出席，聽證只能依獲授權的文件討論。');}
if(scene==='night'){if(f.witnessSupport==='followup')lines.push('予澄把明日的證人諮詢窗口確認放進清單，支援尚未安排完成。');if(f.witnessConsent==='pressure')lines.push('安禾不參加個人作證；修復關係需要尊重拒絕，而不是再追問姓名。');}
return lines.join('\n\n');}
export function witnessRelationship(state){if(state.flags.witnessConsent==='pressure')return '許安禾｜拒絕個人作證，文件可依授權核對；不支持強迫具名。';if(state.flags.witnessConsent==='legal')return '許安禾｜等待獨立諮詢後自行決定是否具名。';if(state.flags.witnessConsent==='private')return '許安禾｜願意匿名書面合作，未同意具名。';return '';}
