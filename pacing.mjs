const count=(flags,keys)=>keys.filter(k=>flags[k]).length;
export function activityProgress(s,label){const f=s.flags;let keys;
if(label==='逐條協商 · 管制與利益衝突')keys=['caucusScope','caucusReview','caucusConflict'];
if(label==='逐項協商 · 援助與自主')keys=['diplomacyAid','diplomacyData','diplomacySecrecy'];
if(label==='聽證前答問準備')keys=['mediaAid','mediaConflict','mediaPrivacy'];
if(label==='深入採訪：來源與更正')keys=['reporterSource','reporterCorrection'];
if(label==='深入訪談：作證與保護')keys=['witnessConsent','witnessSupport'];
if(keys){const done=count(f,keys);return done===keys.length?'已作答 · 可回看':`已作答 ${done}/${keys.length}`;}
if(label==='回應答問稿追問')return f.mediaReply?'已回覆 · 可回看':'尚未回覆';
if(label.startsWith('聽證追問 · ')){const key={hearing1:'hearingMethod',hearing2:'hearingContract',hearing3:'hearingRelief'}[s.scene];return f[key]?'已作答 · 可回看':'尚未作答';}
if(label==='討論後續回覆')return f.meetingReply?'已作答 · 可回看':'尚未作答';
if(label==='發布與回覆排程')return f.followupConfirmed?'已確認 · 可查看':'尚未確認';
if(label==='閱讀章末交接')return f.handoffPriority?'已選優先事項 · 可回看':'尚未完成交接';
return '可選';}
export function optionalActivity(label){return ['章末未決事項總覽','港口走訪：三個人的現場','深入訪談：作證與保護','比對維護合約與報修單','深入採訪：來源與更正','比對原始時間線','夜間補件桌','發布與回覆排程','討論後續回覆','閱讀章末交接','逐條協商 · 管制與利益衝突','逐項協商 · 援助與自主','聽證前答問準備','回應答問稿追問'].includes(label)||label.startsWith('聽證追問 · ');}
