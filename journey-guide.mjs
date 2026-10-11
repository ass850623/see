import {chapterPhases,chapterPhase} from './chapter-meta.mjs';
const objectives={
 c03GapDesk:'依實際進展選案件缺口起點。',c03DraftMethod:'依協調結果選稿件方式。',c03DraftReview:'審閱原文，送審或保留草稿。',c03ManuscriptReply:'按實際送審狀態保存回覆與意向。',c03ManuscriptEnd:'查看稿件與尚未發布的處理狀態。',
 c03TrackDesk:'在原追問範圍中選本輪分項。',c03TrackContact:'依實際送件狀態追蹤或處理草稿。',c03UnitResult:'保存實際承辦答覆、收件或草稿狀態。',c03InterestTalk:'依前輪立場決定限定協調或重談。',c03TrackEnd:'查看分項文件與本輪利益協調結果。',
 c03CouncilReply:'處理協調意向與原利益分歧。',c03WindowDraft:'選擇正式追問涵蓋的程序問題。',c03WindowReview:'審閱正式追問，決定送交或暫存。',c03WindowReceipt:'按實際送件狀態保存程序回覆或草稿。',c03ReplyEnd:'查看議會立場、窗口回覆與下一輪意向。',
 c03Morning:'確認昨日答問意向或暫緩安排。',c03Checkin:'決定答覆從事實或等待者說起。',c03Question:'依優先方向回答第一輪追問。',c03AnswerReview:'審閱答覆，選擇使用或保留草稿。',c03OpeningEnd:'查看第一輪答覆與未決事項。',
 c02ClosingNotice:'準備隔日答問方式，保留安排待確認。',c02ClosingTalk:'依優先方向選開場準備方式。',c02NextChapterBrief:'審閱第三章內部準備頁。',c02ChapterEnd:'保存章末並查看下一章準備。',
 c02CheckReply:'依核對或草稿狀態處理實際回覆。',c02StageBoard:'選下一段優先意向。',c02StageReview:'審閱成果與未決事項。',c02StageEnd:'查看第二章內部階段整理。',
 c02InternalAsk:'依閱覽結果選內部追問。',c02QuestionDraft:'分開事實與待查問題。',c02QuestionReview:'審閱內部問題稿，安排核對或暫存。',c02InquiryEnd:'查看問題稿與未取得的回覆。',
 c02ReadingDesk:'依上輪重點處理閱覽與日期。',c02RestrictedRead:'核對有效閱覽或限制範圍。',c02DateCrosscheck:'分清收件與修訂登錄日期。',c02ReadingReport:'整理可支持的結果與使用界線。',c02ReadingEnd:'查看受限閱覽與日期結果。',
 c02AccessTalk:'依申請方向處理原卷限制。',c02SourceReply:'保存私人回信並決定是否獨立查核。',c02LeadReview:'區分程序進展與來源線索。',c02AccessEnd:'查看原卷交涉與來源回信結果。',
 c02RoundDesk:'依上輪方向處理文件與人手。',c02RoundFiles:'閱讀程序答覆並選申請方向。',c02RoundStaff:'依簽署與名額處理本輪人手。',c02RoundReport:'核對第二輪結果與未決事項。',c02RoundEnd:'查看程序答覆及人手結果。',
 c02ExecutionDesk:'依簽署與人手條件開始工作。',c02WorkList:'審閱查證清單，依條款保存或發布。',c02FirstReport:'閱讀首輪實際回報並選下一步。',c02ExecutionEnd:'查看工作進展與未完成事項。',
 c02ProposalDesk:'依上輪焦點逐項協商。',c02BoundaryTerms:'選擇查證與發言條款。',c02StaffTerms:'選擇人手與調閱條件。',c02TermsReview:'審閱完整條件，簽署或保留修訂。',c02ProposalEnd:'查看工作約定與待執行事項。',
 c02CaucusReply:'回應黨團對下一輪發言的要求。',c02ReporterReply:'處理記者追問與資料界線。',c02Negotiation:'選擇下輪協商的議程焦點。',c02ReceptionEnd:'查看回應與協商意向紀錄。',
 c02SourceInquiry:'選擇來信來源的追問方式。',c02PublicDraft:'依核實與授權範圍準備補充說明。',c02PublicReview:'審閱草稿，選擇發布或暫存。',c02PublicEnd:'查看來源聯絡與本次發言紀錄。',
 c02Delivery:'核對窗口實際交付內容與公開範圍。',c02ReliefAnswer:'閱讀並使用一般書面補件答覆。',c02DeliveryReview:'整理已取得與仍待確認的結果。',c02DeliveryEnd:'查看文件核對與正式回覆紀錄。',
 c02Followup:'安排原卷申請與救助卡點回訪。',c02FileRequest:'選擇原卷調閱範圍。',c02FileReceipt:'保存或修正申請，保留收件紀錄。',c02ReliefReturn:'決定如何追蹤文件卡點。',c02BarrierReply:'說明補件路徑，標記尚缺答覆。',c02FollowupEnd:'查看申請與回訪紀錄。',
 c02Investigate:'完成來信與救助兩條初步調查。',c02Letter:'選擇維護來信的核對方式。',c02Registry:'記錄索引核對結果與下一步。',c02Relief:'選擇救助窗口的詢問重點。',c02Eligibility:'記錄窗口說明與後續回覆方式。',c02InvestigationEnd:'查看兩條調查紀錄與尚缺的結果。',
 c02Morning:'接續昨日紀錄，開始隔日追蹤。',c02Board:'選擇一項原承諾先跟進。',c02Contact:'決定先回覆現況，或補核對後再回覆。',c02Response:'記錄下一輪追蹤安排，保留原期限。',c02End:'查看本次聯絡紀錄與待追蹤承諾。',
 office:'回應南灣港事故消息，決定接案方式。',brief:'聽取簡報，前往南灣港查訪。',
 harbor:'了解現場情況，決定如何接近當事人。',harborTalk:'回應工會代表，建立對話方式。',union:'了解原始紀錄與使用限制。',unionAfter:'安排接下來的調查行程。',
 hub:'選擇本次要拜訪的人物。',technician:'核對技師說明，決定資料使用範圍。',family:'聽取家庭遭遇，決定救助回應。',journalist:'核對報導時間線，決定採訪回應。',aide:'了解幕僚工作量，決定分工方式。',
 reconcile:'整理時間線，區分已知事實與尚待調查的動機。',authorization:'確認工會資料的公開使用條件。',checkpoint:'檢查案件資料，準備進入協商。',
 caucus:'討論管制草案，決定黨團立場。',diplomacy:'討論外援條件，決定合作立場。',
 hearing1:'在聽證中說明事故，選擇正式回應。',clarify1:'回應聽證追問，釐清資料限制。',hearing2:'回應維護與契約問題。',clarify2:'釐清維護文件能支持的說法。',hearing3:'回應救助與後續調查安排。',
 night:'整理聽證結果與今晚待辦。',postUnion:'回訪工會，回應聽證後的分歧。',postPress:'回覆媒體，決定補充說明方式。',postStaff:'和幕僚確認工作量與後續安排。',chapterEnd:'回看本章結果、未決事項與交接。'
};
export function journeyGuide(state,scene){
 const reading=(state.pageIndex||0)<(scene.beats?.length||0);
 const phase=chapterPhases[chapterPhase(state)];
 return {
  title:`目前目標 · ${phase.label}`,
  objective:objectives[state.scene],
  actionTitle:scene.terminal?'章末工具':reading?'閱讀對話':state.scene==='c02Followup'?'選擇回訪順序':state.scene==='c02Investigate'?'選擇調查順序':state.scene==='c02Board'?'選定追蹤焦點':scene.hub?'安排調查訪談':'主線回應',
  hint:state.chapter==='c03'?(scene.terminal?(state.scene==='c03OpeningEnd'?'可接續議會回應與正式窗口追問，進入會更新自動存檔；想保留暫停點可先保存手動欄位。':state.scene==='c03ReplyEnd'?'可接續分項窗口追蹤與利益協調，進入會更新自動存檔。':state.scene==='c03TrackEnd'?'可接續案件缺口與共同稿審閱，進入會更新自動存檔。':'本輪稿件審閱已保存；下一輪改稿與發布前確認尚未開放。'):reading?'先閱讀本場對話，再準備追加詢問答覆。':'確認安排、準備稿與實際答覆分開記錄；原承諾與期限保留。'):scene.terminal?(state.scene==='c02ChapterEnd'?'可開始第三章追加詢問原型。進入會更新自動存檔；想保留章末，可先存入手動欄位。':state.chapter==='c02'?'第二章原型紀錄已保存。開場與調查暫停點可接續後段；回訪暫停點可接續交付核對；交付暫停點可接續來源與公開回覆；最後暫停點的後續反應與個案結果尚未開放。':'第一章流程已完成。可查看交接與未決事項，或開始第二章開場原型。進入會更新自動存檔；想保留結算點，可先存入手動欄位。'):state.chapter==='c02'?(reading?'先讀完本場對話，再決定這次追蹤如何進行。':state.scene==='c02Investigate'?'兩條分支均可處理；每次調查會記錄結果，另一條仍保留。':state.scene==='c02Board'?'本次原型先跟進一項原承諾；其他承諾與原期限保留。':'選擇本次聯絡方式或後續安排。回覆不代表原承諾已履行。'):scene.hub?`剩餘 ${state.slots} 個調查時段。每次拜訪消耗 1 個時段；最後一次訪談結束後進入案件整理。`:
   reading?'先閱讀本場對話，再選擇主線回應；本場支線可隨時查看。':'選擇主線回應會推進故事；離開前可先查看本場支線，未完成內容不會自動補做。'
 };
}
