import {publicationScenes,publicationOptions,publicationReaction,validPublication,publicationFlagKeys} from './chapter-three-publication.mjs';
const c=(id,text,next,flags={})=>({id,text,next,effects:{flags}});
export const revisionFlagKeys=['c03RevisionStarted','c03RevisionAction','c03RevisionText','c03Signature','c03SignatureConsent','c03ReleaseReadiness','c03ReleaseText',...publicationFlagKeys];
export const revisionScenes={
 ...publicationScenes,
 c03RevisionDesk:{place:'第三章 · 改稿處理桌',speaker:'林予澄',role:'幕僚長',portrait:'aide',
 beats:['予澄把上輪原稿與意見並排，沒有在舊檔上直接覆寫。「上次選的是下一輪意向，今天才處理實際版本。想採納也可以重新考慮，保留原稿也不能說已經修好了。」','共同審閱的意見、重談的條件與未送的草稿各自留下。新的稿件仍只使用公開程序，未知的來源、事故原因與個案結果沒有補成答案。'],
 text:'依實際審閱狀態決定本輪改稿動作。原稿、回覆與原期限保留。',choices:[]},
 c03SignatureCheck:{place:'辦公室 · 署名範圍確認',speaker:'沈若川',role:'本土協進黨議員',portrait:'senior',
 beats:['稿件有了新版本，署名仍要逐一確認。共同審閱曾提出的修改沒有處理，就不能拿對方曾讀過原稿當作同意署名；重談提案更不能跳過共同審閱。','予澄把辦公室署名與共同署名分開。只有完成共同審閱修改的路線，可以請周岳核對這份版本並確認共同署名；其他路線仍由辦公室負責。'],
 text:'選擇這份版本的署名方式。共同署名限定本稿的公開程序範圍，不取代利益調查或任何原承諾。',choices:[]},
 c03ReleaseReview:{place:'辦公室 · 發布前原文確認',speaker:'林予澄',role:'幕僚長',portrait:'aide',
 beats:['署名結果與使用範圍寫在稿件頁首。你讀到「沒有個案結果」時停了一下，沒有改成比較好聽的完成宣告。程序文件即使可引用，也沒有讓私人回信或受限筆記變成附件。','予澄說：「今天只確認這一份版本能怎麼用。發布要留下自己的決定與紀錄，不能讓準備完成代替發布本身。」'],
 text:'審閱下方原文，標記可進入下一輪發布決定，或繼續保留內部。兩種選擇都尚未發布。',choices:[]},
 c03ReleaseRecord:{place:'辦公室 · 發布前處理紀錄',speaker:'林予澄',role:'幕僚長',portrait:'aide',
 beats:['你留下的決定與稿件版本綁在一起。予澄沒有把待發布版本放進公開發言簿，也沒有把內部保留的版本寄給記者。','她把上輪原稿、對方意見與本輪版本各留一份。「之後有人問你改了哪裡，我們拿得出實際版本；如果還沒發布，也能明白說還沒有。」'],
 text:'保存本輪發布前確認。對外發布、發布後追問與個案結果仍須後續處理。',choices:[c('record','保存版本、署名與發布前狀態。','c03RevisionEnd')]},
 c03RevisionEnd:{place:'第三章改稿與發布前確認 · 原型暫停點',speaker:'林予澄',role:'幕僚長',portrait:'aide',terminal:true,
 text:'本輪改稿版本、署名與發布前確認已保存，沒有對外發布。可接續發布決定與角色反應；原稿、資料授權、利益分歧與承諾期限保留。',choices:[]}
};
export function canJointSignature(s){return s.flags.c03ManuscriptDisposition==='joint-review'&&s.flags.c03RevisionAction==='revise';}
export function revisionText(s){const f=s.flags;if(f.c03RevisionAction==='retain')return f.c03ManuscriptText;return [f.c03RevisionAction==='accept'?'本輪辦公室稿｜接受重談條件，對方確認與共同審閱仍待進行':'本輪改稿｜公開程序與未決結果分段',
 '已取得的程序範圍：',f.c03TrackResult==='answered'?f.c03UnitText:f.c03TrackResult==='late-receipt'?'本輪晚送追問已收件，分項承辦答覆尚未取得。':'原追問仍未送交，沒有本輪收件或承辦答覆。',
 '仍需回答的事項：完整原卷、原件來源、寄件者身分、修訂原因與事故動機；救助資格、金額與撥款仍沒有個案結果。',
 '另列利益分歧：贊助名冊與調查席位仍依原要求追蹤，不以程序工作交換撤回調查。',
 '使用範圍：只引用已核對且可公開的程序；不附私人回信、受限筆記或個人資料。原更正、補件與其他承諾及期限保留。'].join('\n');}
export function releaseText(s){const f=s.flags;return '本輪發布候選版本（尚未發布）\n署名：'+(f.c03Signature==='joint'?'沈若川、周岳｜本版限定公開程序署名已確認':'沈若川辦公室｜不代表周岳共同同意或署名')+'\n'+(f.c03RevisionAction==='retain'?'沿用原稿，原稿標記仍是當時的草稿狀態；本輪署名與發布前決定以本頁為準。\n':'')+f.c03RevisionText+'\n發布範圍不包括私人或受限材料；沒有宣布調查結案或個案核定。';}
export function revisionOptions(s){if(publicationScenes[s.scene])return publicationOptions(s);const f=s.flags;if(s.scene==='c03RevisionDesk'){const action=f.c03ManuscriptDisposition==='joint-review'?'revise':f.c03ManuscriptDisposition==='proposal-review'?'accept':'prepare';return [c(action,{revise:'採納分段與利益分歧要求，保存改稿版本。',accept:'回覆接受重談條件，另存辦公室版本。',prepare:'整理未送草稿，另存公開程序版本。'}[action],'c03SignatureCheck',{c03RevisionAction:action,c03RevisionText:revisionText({...s,flags:{...f,c03RevisionAction:action}})}),c('retain','保留上輪原稿，沒有採納修改或條件。','c03SignatureCheck',{c03RevisionAction:'retain',c03RevisionText:f.c03ManuscriptText})];}if(s.scene==='c03SignatureCheck'){const office=c('office','本輪採辦公室署名，由辦公室負責。','c03ReleaseReview',{c03Signature:'office'});return canJointSignature(s)?[c('joint','請周岳核對本版，確認限定共同署名。','c03ReleaseReview',{c03Signature:'joint',c03SignatureConsent:true}),office]:[office];}if(s.scene==='c03ReleaseReview')return [c('ready','標記可進入發布決定，這輪先不發布。','c03ReleaseRecord',{c03ReleaseReadiness:'ready',c03ReleaseText:releaseText(s)}),c('hold','繼續保留內部，發布安排待定。','c03ReleaseRecord',{c03ReleaseReadiness:'internal',c03ReleaseText:releaseText(s)})];return revisionScenes[s.scene]?.choices||[];}
export function revisionSummary(s){const f=s.flags;return [{title:'本輪實際版本',status:{revise:'共同審閱要求已改稿',accept:'接受重談條件 · 共同確認待取得',prepare:'未送草稿已另存整理版',retain:'沿用原稿 · 未採納修改'}[f.c03RevisionAction]||'動作待選',detail:f.c03RevisionText||'原稿與回覆保留，尚未另存本輪版本。'},{title:'本版署名',status:f.c03Signature==='joint'?'限定共同署名已確認':f.c03Signature==='office'?'辦公室署名':'方式待選',detail:f.c03Signature==='joint'?'周岳已核對本版並同意限定公開程序署名；利益分歧、原權限與人手保留。':'沒有本版共同署名同意；共同審閱或重談提案不當作署名。'},{title:'發布前確認',status:f.c03ReleaseReadiness==='ready'?'已備妥候選版 · 尚未發布':f.c03ReleaseReadiness==='internal'?'保留內部 · 尚未發布':'待審閱',detail:f.c03ReleaseText||'沒有本輪對外發布，原公開答覆紀錄保留。'}];}
export function revisionReaction(s){if(s.flags.c03PublicationStarted)return publicationReaction(s);const f=s.flags;if(s.scene==='c03RevisionDesk')return '上輪意向：'+({revise:'列入修改／條件釐清',reserve:'保留原稿與意見',keep:'安排待定',prepare:'列修稿需求'}[f.c03ManuscriptNext])+'；本輪仍由你決定實際動作。';if(s.scene==='c03SignatureCheck')return canJointSignature(s)?'本輪已處理共同審閱的分段與利益分歧要求，可請周岳核對本版；選定後才記錄署名結果。':f.c03RevisionAction==='accept'?'本輪已回覆接受重談條件，對方確認與共同審閱仍待進行，只能使用辦公室署名。':'這份版本沒有可用的共同署名確認，本輪只提供辦公室署名。';if(s.scene==='c03ReleaseReview')return (f.c03Signature==='joint'?'周岳已核對本版並確認限定共同署名。':'本版由辦公室署名，沒有周岳的共同署名。')+'\n待確認發布候選原文：\n'+releaseText(s);if(['c03ReleaseRecord','c03RevisionEnd'].includes(s.scene))return revisionSummary(s).map(i=>`${i.title}｜${i.status}\n${i.detail}`).join('\n\n');return '';}
export function validRevision(s){if(!validPublication(s))return false;return validRevisionStage(s.flags.c03PublicationStarted?{...s,scene:'c03RevisionEnd'}:s);}
function validRevisionStage(s){const f=s.flags;if(!f.c03RevisionStarted)return !revisionFlagKeys.some(k=>f[k]!==undefined)&&!revisionScenes[s.scene];if(s.chapter!=='c03'||f.c03RevisionStarted!==true||!revisionScenes[s.scene])return false;
 const action=f.c03ManuscriptDisposition==='joint-review'?'revise':f.c03ManuscriptDisposition==='proposal-review'?'accept':'prepare';if(s.scene==='c03RevisionDesk'){if(f.c03RevisionAction!==undefined||f.c03RevisionText!==undefined)return false;}else if(![action,'retain'].includes(f.c03RevisionAction)||f.c03RevisionText!==revisionText(s))return false;
 if(['c03RevisionDesk','c03SignatureCheck'].includes(s.scene)){if(f.c03Signature!==undefined||f.c03SignatureConsent!==undefined)return false;}else if(!['office','joint'].includes(f.c03Signature)||(f.c03Signature==='joint'?(!canJointSignature(s)||f.c03SignatureConsent!==true):f.c03SignatureConsent!==undefined))return false;
 return ['c03ReleaseRecord','c03RevisionEnd'].includes(s.scene)?['ready','internal'].includes(f.c03ReleaseReadiness)&&f.c03ReleaseText===releaseText(s):f.c03ReleaseReadiness===undefined&&f.c03ReleaseText===undefined;
}
