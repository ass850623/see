import {readingScenes,accessScenes,validAccess} from './chapter-two-access.mjs';
export {readingScenes,accessScenes} from './chapter-two-access.mjs';
const c=(id,text,next,flags={},evidence={})=>({id,text,next,effects:{flags,evidence}});
export const roundScenes={
 c02RoundDesk:{place:'辦公室 · 第二輪追蹤桌',speaker:'林予澄',role:'幕僚長',portrait:'aide',
 beats:['窗口新回了一封正式書面答覆。與此同時，黨團也傳來輪值或修訂條件的消息。予澄把兩封信放在不同資料夾：「這回有具體內容了，仍要分清哪一份回答哪件事。」','你先處理上一輪留下的優先方向，再回頭處理另一項。未完成的來源核對、利益調查與個案審核仍在工作板上，沒有因為收到新信而消失。'],
 text:'依上一輪追蹤方向，逐項處理文件與人手條件。',choices:[]},
 c02RoundFiles:{place:'正式受理窗口 · 調閱範圍書面答覆',speaker:'許安禾',role:'港口通訊技師',portrait:'worker',
 beats:['答覆的公開版列出兩條路徑：附件與版本紀錄可以依公開範圍提供；涉及值班與個人資料的原卷，須另列調閱目的並接受範圍審查。這份答覆沒有交付原卷，也沒有證明事故原因。','安禾把窗口文號與回信核對。「至少現在知道卡在哪裡。可以先按公開範圍補申請，也可以保留完整原卷需求，請他們分項說明限制。兩種都要留住這份答覆，別把它當成事故證據。」'],
 text:'選擇本輪申請方式。E08 保存已核對文號的公開程序答覆，公開授權只及於這份答覆。',choices:[c('public','先補公開範圍申請，保留原卷需求。','c02RoundDesk',{c02RoundFiles:'public'},{E08:{verified:true,authorized:true}}),c('reasons','保留完整原卷需求，要求分項說明限制。','c02RoundDesk',{c02RoundFiles:'reasons'},{E08:{verified:true,authorized:true}})]},
 c02RoundStaff:{place:'議會 · 輪值與修訂確認桌',speaker:'周岳',role:'黨團協調人',portrait:'politician',
 beats:['周岳先翻到上一輪的簽署與回報頁。「這次能安排什麼，得照那張紙。未簽的，我不能拿去替你開共同席；已確認名額的，也不能讓輪值助理取得所有資料。」','予澄把工作範圍寫在桌牌背面：公開索引、聯絡窗口、出入紀錄。來信來源、個案資料與未發布草稿仍由辦公室保管；贊助名冊調閱或利益迴避，也不由輪值人員決定。'],
 text:'依既有簽署與名額狀態處理本輪人手或修訂回覆。',choices:[]},
 c02RoundReport:{place:'辦公室 · 第二輪結果核對',speaker:'林予澄',role:'幕僚長',portrait:'aide',
 beats:['予澄把 E08 放進證據簿的程序資料欄，再把人手結果記入任務簿。她把先前的名額確認與這次到任分成兩筆，不覆蓋原來的回報。','「今天不只是再說待確認了。」她說。「但是公開答覆、申請送出、輪值到任各有範圍。我們仍欠原卷與來源的答案，別讓新進展替未完成的工作蓋章。」'],
 text:'核對本輪結果並保存。程序答覆不是原卷交付，人手安排不是正式調查決議或原承諾完成。',choices:[c('record','保存第二輪結果，保留原期限與未決事項。','c02RoundEnd',{c02RoundRecorded:true})]},
 c02RoundEnd:{place:'第二章第二輪處理 · 原型暫停點',speaker:'林予澄',role:'幕僚長',portrait:'aide',terminal:true,
 text:'調閱範圍答覆、申請方向與人手或修訂結果已保存。來源、非公開原卷與個案結果仍須追蹤。可接續原卷限制的交涉與來源回信。',choices:[]}
};
export const canOnboard=s=>s.flags.c02ProposalOutcome==='limited'&&s.flags.c02StaffTerm==='joint'&&s.flags.c02WorkAction==='confirm';
export function staffRoundOptions(s){const f=s.flags;
 if(f.c02ProposalOutcome==='counter')return [c('clarify','回覆修訂爭點，保留未簽署狀態。','c02RoundDesk',{c02RoundStaff:'clarify'}),c('retain','保留本方修訂，暫不回覆新條件。','c02RoundDesk',{c02RoundStaff:'retain'})];
 if(canOnboard(s))return [c('active','完成輪值到任登記，限定公開索引與窗口工作。','c02RoundDesk',{c02RoundStaff:'active'}),c('decline','暫不接受輪值到任，由辦公室自行整理。','c02RoundDesk',{c02RoundStaff:'decline'})];
 if(f.c02StaffTerm==='joint')return [c('request','確認本輪提供的名額，另等人選與到任。','c02RoundDesk',{c02RoundStaff:'request'}),c('defer','保留共同席需求，暫不啟用。','c02RoundDesk',{c02RoundStaff:'defer'})];
 return [c('transfer','接受窗口轉介，由辦公室自行聯絡。','c02RoundDesk',{c02RoundStaff:'transfer'}),c('solo','保留轉介紀錄，由辦公室維持原聯絡方式。','c02RoundDesk',{c02RoundStaff:'solo'})];
}
export function roundOptions(s){if(s.scene==='c02RoundStaff')return staffRoundOptions(s);if(s.scene!=='c02RoundDesk')return roundScenes[s.scene]?.choices||[];const f=s.flags,first=f.c02WorkNext,done=f.c02RoundFiles||f.c02RoundStaff;return [!f.c02RoundFiles&&(first==='files'||done)?c('files','處理調閱範圍書面答覆。','c02RoundFiles'):null,!f.c02RoundStaff&&(first==='staff'||done)?c('staff','處理人手與修訂條件回覆。','c02RoundStaff'):null].filter(Boolean);}
export function roundSummary(s){const f=s.flags;return [
 {title:'調閱範圍與程序答覆',status:f.c02RoundFiles==='public'?'E08 已核對 · 公開範圍申請已補送':f.c02RoundFiles==='reasons'?'E08 已核對 · 分項限制說明待回':'本輪答覆待處理',detail:'E08 僅是公開版程序答覆；非公開原卷未交付、來源身分未核實，申請結果仍待收。'},
 {title:'本輪人手與修訂',status:{active:'輪值已到任 · 僅公開索引與窗口',decline:'到任未接受 · 辦公室自行整理',request:'本輪名額已確認 · 人選與到任待定',defer:'共同席未啟用',clarify:'修訂爭點已回覆 · 仍未簽署',retain:'本方修訂保留 · 未回覆新條件',transfer:'窗口轉介已接受 · 沒有新到任人手',solo:'維持原聯絡方式 · 沒有新到任人手'}[f.c02RoundStaff]||'本輪待處理',detail:'未交付私人來源、個案資料或未發布草稿；利益調查、原期限與記者合作分歧保留。'}
 ];}
export function roundReaction(s){const f=s.flags;if(s.scene==='c02RoundDesk')return '本輪先處理：'+(f.c02WorkNext==='files'?'文件與原卷範圍。':'人手與修訂條件。');if(s.scene==='c02RoundFiles')return s.evidence.E07?'先前公開版 E07 的核實狀態保留；E08 不替代附件比對或來源核對。':'先前尚未取得 E07；這次 E08 只回答調閱程序，不補出缺少的附件。';if(s.scene==='c02RoundStaff')return f.c02ProposalOutcome==='counter'?(f.c02WorkAction==='resend'?'窗口已看過收到的修訂稿，請你確認爭點；尚未同意或簽署。':'本方尚未送回修訂，周岳提出條件確認問題；沒有取得未交付的私人草稿。'):canOnboard(s)?'周岳帶來已確認名額的輪值助理，可在你確認範圍後完成到任登記；拒絕則不啟用。':f.c02StaffTerm==='joint'?'上一輪未啟用共同席，本輪只提供名額確認，尚無到任人員。':'依自行整理約定，本輪提供正式窗口轉介，不增派新到任人手。';if(['c02RoundReport','c02RoundEnd'].includes(s.scene))return roundSummary(s).map(i=>`${i.title}｜${i.status}\n${i.detail}`).join('\n\n');return '';}
export function validRound(s){const f=s.flags,keys=['c02RoundStarted','c02RoundFiles','c02RoundStaff','c02RoundRecorded'];if(!validAccess(s))return false;if(!f.c02RoundStarted)return !keys.some(k=>f[k]!==undefined)&&!roundScenes[s.scene]&&!s.evidence.E08;
 if(f.c02RoundStarted!==true||(!roundScenes[s.scene]&&!accessScenes[s.scene]&&!readingScenes[s.scene])||!['files','staff'].includes(f.c02WorkNext))return false;
 if(f.c02RoundFiles!==undefined&&!['public','reasons'].includes(f.c02RoundFiles))return false;
 if(f.c02RoundStaff!==undefined&&!staffRoundOptions(s).some(o=>o.effects.flags.c02RoundStaff===f.c02RoundStaff))return false;
 const both=Boolean(f.c02RoundFiles&&f.c02RoundStaff),report=['c02RoundReport','c02RoundEnd'].includes(s.scene)||f.c02AccessStarted;if(report?!both:both)return false;
 if(s.scene==='c02RoundFiles'&&(f.c02RoundFiles||(f.c02WorkNext==='staff'&&!f.c02RoundStaff)))return false;
 if(s.scene==='c02RoundStaff'&&(f.c02RoundStaff||(f.c02WorkNext==='files'&&!f.c02RoundFiles)))return false;
 if(f.c02WorkNext==='files'&&f.c02RoundStaff&&!f.c02RoundFiles||f.c02WorkNext==='staff'&&f.c02RoundFiles&&!f.c02RoundStaff)return false;
 const e=s.evidence.E08;if(f.c02RoundFiles?!(e?.verified===true&&e?.authorized===true):e!==undefined)return false;
 return s.scene==='c02RoundEnd'||f.c02AccessStarted?f.c02RoundRecorded===true:f.c02RoundRecorded===undefined;
}
