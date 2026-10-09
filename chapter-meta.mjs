export const chapterPhases=[
 {id:'brief',label:'接案',scenes:['office','brief']},
 {id:'harbor',label:'港口與工會',scenes:['harbor','harborTalk','union','unionAfter']},
 {id:'investigate',label:'調查與核實',scenes:['hub','technician','family','journalist','aide','reconcile','authorization','checkpoint']},
 {id:'negotiate',label:'黨團與外交',scenes:['caucus','diplomacy']},
 {id:'hearing',label:'公開聽證',scenes:['hearing1','clarify1','hearing2','clarify2','hearing3']},
 {id:'end',label:'章末整理',scenes:['night','postUnion','postPress','postStaff','chapterEnd']}
];
export function chapterPhase(state){return chapterPhases.findIndex(p=>p.scenes.includes(state.scene));}
export function commitments(state){const f=state.flags;const items=[];
const add=(id,title,due,source,detail)=>items.push({id,title,due,source,detail,status:'待履行'});
if(f.reliefPromise==='report'||f.safetyPlan==='report')add('relief-report','回報救助進度','故事第 8 日前（第二章追蹤）',f.reliefPromise==='report'?'船員家庭訪談':'公開聽證','公開窗口、申請進度與仍未通過的預算；提出方案不等於補助已到位。');
if(f.safetyPlan==='report')add('repair-report','公開檢修進度','故事第 8 日前（第二章追蹤）','公開聽證','確認檢修責任與時程，不承諾尚未完成的修復。');
if(f.safetyPlan==='inquiry')add('repair-schedule','確認調查、檢修與救助時程','待安排（第二章追蹤）','公開聽證','本章尚未訂明日期，必須另行確認負責窗口。');
if(f.foreignTerms==='oversight')add('cooperation-report','提交合作條件公開報告','待安排（第二章追蹤）','外交協商','列出監督方式與合作條件；尚未提交報告。');
if(f.hearingAnswer==='defer')add('evidence-followup','補交可公開的事故資料','待安排（聽證要求補件）','公開聽證','先處理授權與核實，不能用未公開檔案冒充已完成說明。');
if(f.reliefPromise==='referral')add('relief-referral','追蹤家屬救助轉介','待安排（第二章追蹤）','船員家庭訪談','已提供窗口，尚未確認申請結果。');
if(f.reporterCorrection==='visible')add('news-correction','發布公開更正與版本紀錄','故事第 2 日中午前（第二章追蹤）','許知言訪談','列出原說法、修正內容與核對依據；尚未完成發布。');if(f.reporterCorrection==='review')add('news-review','核對轉貼消息並回覆更正範圍','待安排（第二章追蹤）','許知言訪談','確認錯誤與回覆窗口，目前未承諾更正日期。');if(f.witnessSupport==='followup')add('witness-support','確認獨立諮詢與申訴窗口','故事第 2 日中午前（第二章追蹤）','許安禾訪談','確認可聯絡窗口，不保證零風險或補助已核定。');if(f.witnessConsent==='legal')add('witness-consult','安排作證前獨立法律諮詢','具名作證前（時間待安排）','許安禾訪談','諮詢後由本人決定是否具名，尚未取得個人作證同意。');if(f.fieldShop==='criteria')add('local-eligibility','回覆停航周邊工作者救助資格','故事第 8 日前（待主管單位回覆）','江秋月走訪','釐清適用範圍，不保證金額或申請通過。');if(f.fieldDispatch==='schedule')add('port-updates','確認復航公告窗口與更新時段','待主管單位確認（尚未實施）','值班窗口走訪','提出公告機制建議，安排仍須港務單位確認。');if(f.unionFollowup==='repair')add('union-reply','回覆工會資料使用範圍與待辦問題','故事第 2 日（待安排回覆時段）','聽證後工會回訪','保持原授權，回覆不等於合作分歧已消失。');if(f.pressFollowup==='transparent')add('hearing-addendum','發布聽證補充稿與完整紀錄','故事第 2 日中午前','聽證後媒體回覆','補充脈絡與未知事項，不抹除原發言，也不代表原更正已完成。');return items;}
export function backgroundFor(scene){if(['night','postStaff'].includes(scene))return 'assets/office-night.png';if(['office','brief','aide','reconcile','authorization'].includes(scene))return 'assets/office-day.png';if(['hearing1','clarify1','hearing2','clarify2','hearing3'].includes(scene))return 'assets/hearing-room.png';if(['harbor','harborTalk','family','hub'].includes(scene))return 'assets/harbor-day.png';if(['union','unionAfter','postUnion'].includes(scene))return 'assets/union-room.png';return null;}

export function characterFor(speaker){return {'許知言':'assets/zhiyan.png','林予澄':'assets/yucheng.png','陳海寧':'assets/haining.png','許安禾':'assets/anhe.png'}[speaker]||null;}
