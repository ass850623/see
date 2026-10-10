import {commitments} from './chapter-meta.mjs';
import {availableCorrections} from './corrections.mjs';
import {planJobs,planAssignments,planMembers} from './followup-plan.mjs';
export const unresolvedGroups=[{id:'investigation',title:'待調查與調閱'},{id:'permission',title:'待授權與協商'},{id:'reply',title:'待回覆與公共承諾'},{id:'draft',title:'稿件與後續分工'}];
export function unresolvedItems(s){const f=s.flags,items=[];const add=(id,group,title,detail,status='待處理')=>items.push({id,group,title,detail,status});
add('accident','investigation','事故責任與政治動機','時間順序不等於動機；事故責任仍待正式調查。');
add('maintenance','investigation',s.evidence.E04?'核對維護履約與原件':'補取得維護文件',s.evidence.E04?'已取得 E04，風險評估附件與本次故障處理原件仍待調閱；文件缺漏不等於貪污成立。':'本次未取得 E04；公開通訊摘要不能替代維護合約與故障處理原件。');
if(f.caucusConflict)add('sponsor','investigation','贊助金流與利益申報',f.caucusConflict==='delay'?'名冊調閱暫緩，黨團人手尚未到任；需回應資源與調查範圍的取捨。':'申報、迴避與獨立調查仍為建議；贊助與事故的關聯尚未證實。');
if(Number(f.handoffPage||0)>=4)add('letter','investigation','核對維護來信','寄件者身分、受理編號與原件未核對；不是新增核實證據。');
for(const id of ['E02','E03'])if(s.evidence[id]&&!s.evidence[id].authorized)add('permission-'+id,'permission',id+' 公開使用授權','仍不可公開原件；核實與取得資料不等於來源已同意公開。');
if(f.diplomacyData)add('cross-border','permission','確認跨境資料用途','用途、必要欄位、留存與再轉交須另詢來源同意；現有公開授權不涵蓋跨境使用，原件未送出。');
if(f.foreignTerms)add('foreign','permission','確認外援條件與交付',f.foreignTerms==='rescue'?'民間救援窗口已建立；隊伍、政治聲明與分析資料未自動到位。':'合作立場已提出；援助交付、合作附件與公開範圍仍待確認。');
if(f.diplomacySecrecy)add('secrecy','permission','保密與撤回條款',f.diplomacySecrecy==='review'?'三十日重審與撤回權仍待伙伴同意。':'保密終止與退出條款尚未談妥。');
if(f.emergencyBill)add('bill','permission','追蹤管制草案',f.emergencyBill==='reject'?'反對原案；替代提案與跨黨合作待安排。':'協商立場不等於表決通過；修法與監督規則尚未生效。');
for(const c of commitments(s))add('commitment-'+c.id,'reply',c.title,c.detail+'\n期限：'+c.due+'\n來源：'+c.source,c.status);
if(f.unsupportedClaim)add('unsupported-claim','reply','回應證據不足的正式指控','聽證中的動機或賄賂指控仍留在正式紀錄；現有資料不足以支持，不能以整理總覽當作已更正。');
if(f.mediaReply==='defend')add('media','reply','回應答問稿未解疑問','外援成果、黨團自清與資料公開限制仍依本次草稿留下追問；沒有新增公開授權。');
if(f.mediaAid||f.mediaConflict||f.mediaPrivacy){if(!f.mediaReply)add('media','reply','答問稿追問尚未回覆','已完成的準備稿不是正式發言；未完成的草稿問題不會補寫為已作答。');}
if(f.reporterSource==='bargain'||f.pressFollowup==='spin')add('press-cooperation','reply','記者合作分歧','專訪合作暫停；書面回覆或稿件審閱不代表合作已恢復。');
const assigned=planAssignments(s);for(const t of availableCorrections(s)){const status=f['correction_'+t.id];add('draft-'+t.id,'draft',t.title,status==='ready'?'審閱稿已備妥，尚未發布或完成外部回覆。':status==='review'?'稿件須重寫，原問題未解除。':'尚未備妥稿件，原問題仍待處理。',status==='ready'?'稿已備妥 · 未發布':'待準備');for(const reviewer of ['union','press'])if(f['draftReview_'+reviewer+'_'+t.id]==='reserve')add('dissent-'+reviewer+'-'+t.id,'draft',t.title+'：'+(reviewer==='union'?'工會':'記者')+'保留異議','異議已附於審閱紀錄，不代表對方背書或分歧已解除。','異議保留');}
for(const j of planJobs(s)){const a=assigned.find(a=>a.id===j.id);add('job-'+j.id,'draft',j.title,a?(s.flags.followupConfirmed?'已確認負責：':'暫排負責：')+planMembers[a.member]+'；工作尚未執行。':'尚未分配負責人，不能替任何人補寫責任。',a?(s.flags.followupConfirmed?'已排程 · 待執行':'暫排 · 待確認'):'未安排');}
return items;}
