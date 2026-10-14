import {chapterPhases,chapterPhase} from './chapter-meta.mjs';
const objectives={
 c03DueReplyDesk:'準備第 8 日單項到期回覆。',c03DueReplyReview:'審閱全文，送交或保留。',c03DueReplyReceipt:'核對本日單項回覆收件。',c03DueQueryDesk:'閱讀責任追問全文，送交或保留。',c03DueQueryReceipt:'核對本版責任追問收件。',c03DueReplyEnd:'本輪已保存，下輪到期回信尚未開放。',
 c03DueTrackDesk:'沿本日實際通知或詢問收回覆。',c03DueTrackReply:'核對回覆、收件與未確認日期。',c03DuePromiseDesk:'選原承諾核對本日到期缺口。',c03DuePromiseReview:'審閱原期限與尚缺工作。',c03DueTrackRecord:'選到期回覆或責任追問優先。',c03DueTrackEnd:'可接續到期缺口回覆與責任追問。',
 c03DayEightDesk:'依實際成果準備第 8 日新稿。',c03DayEightReview:'審閱到期與未知，發布或保留。',c03DayEightResult:'核對本日實際公開版本。',c03DayEightWaitDesk:'選單項通知或時程詢問。',c03DayEightWaitResult:'核對本日收件與尚未得回覆。',c03DayEightRecord:'選第 8 日後續優先。',c03DayEightEnd:'可接續第 8 日回覆與到期缺口追蹤。',
 c03PrecloseDesk:'沿清單實際送件收處理或補送。',c03PrecloseReply:'核對交付、收件或路徑。',c03PrecloseSheetDesk:'選收束表的閱讀順序。',c03PrecloseReview:'審閱原承諾與實際進度。',c03PrecloseRecord:'選第 8 日回報或聯絡優先。',c03PrecloseEnd:'可接續第 8 日開場與到期回報。',
 c03ResponsibilityDesk:'沿實際送件核對責任窗口。',c03ResponsibilityReply:'核對分工、路徑或收件。',c03ResponsibilityListDesk:'選本版補列清單的重點順序。',c03ResponsibilityListReview:'審閱完整清單與程序前提。',c03ResponsibilityRecord:'按實際路徑送交或保留。',c03ResponsibilityEnd:'可接續補列處理與期限前收束。',
 c03GapFollowDesk:'沿單項實際送件收回信或補送。',c03GapFollowReply:'核對本輪回信或新收件。',c03QueryFollowDesk:'沿本版補問受理收處理或補送。',c03QueryFollowReply:'核對責任說明與未確認日期。',c03GapFollowRecord:'選責任窗口核對或未決整理。',c03GapFollowEnd:'可接續責任窗口核對與補列整理。',
 c03GapReplyDesk:'準備單項缺口回覆全文。',c03GapReplyReview:'審閱本版，送交或保留。',c03GapReplyReceipt:'核對本版單項回覆處理。',c03GapQueryDesk:'閱讀新補問全文，送交或保留。',c03GapQueryReceipt:'核對本版補問收件。',c03GapReplyEnd:'可接續缺口回信與補問處理。',
 c03ScheduleDesk:'沿實際通知或詢問收回覆。',c03ScheduleReply:'核對回覆、收件與未確認日期。',c03PromiseDesk:'選一項原承諾核對缺口。',c03PromiseReview:'審閱原日期與尚缺工作。',c03ScheduleRecord:'選缺口回覆或窗口補問優先。',c03ScheduleEnd:'可接續缺口回覆與窗口補問。',
 c03PreReportDesk:'準備獨立期限前新稿。',c03PreReportReview:'審閱全文，選發布或保留。',c03PreReportResult:'核對記者實際公開範圍。',c03WaitDesk:'選單項原承諾通知或時程詢問。',c03WaitResult:'核對實際收件，保留未得回覆。',c03PreReportRecord:'選下輪回覆或缺口核對優先。',c03PreReportEnd:'可接續時程回覆與承諾缺口核對。',
 c03DeadlineDesk:'沿答覆送件與方式確認選聯絡。',c03DeadlineReply:'核對實際移交、收件或方式回覆。',c03DeadlineDeskReview:'選原承諾期限表的閱讀順序。',c03DeadlineSheetReview:'審閱原期限與既有狀態。',c03DeadlineRecord:'選下一輪回報或聯絡優先。',c03DeadlineEnd:'可接續期限前回報與等待者聯絡。',
 c03DaySevenDesk:'依已確認方式選本日實際行動。',c03DaySevenOutcome:'核對本日到場、準備或聯絡結果。',c03DaySevenDraftDesk:'選本版答覆的重點順序。',c03DaySevenDraftReview:'審閱全文，不將準備當作送出。',c03DaySevenRecord:'依方式與結果送答覆或留稿。',c03DaySevenEnd:'可接續答覆追蹤與期限前整理。',
 c03HandlingDesk:'沿實際送件收處理回函或補送。',c03HandlingReply:'核對補列交付或覆核回函。',c03HandlingCouncilDesk:'沿議會問題實際受理追答覆。',c03HandlingCouncilReply:'核對程序回覆與邀請。',c03HandlingRecord:'選第 7 日到場、書面或保留。',c03HandlingEnd:'查看第 6 日回函，可接續第 7 日安排。',
 c03ScopeDesk:'依實際回覆選範圍補列或追路徑。',c03ScopeReply:'核對本輪收件、路徑或準備。',c03ScopeCouncilDesk:'選議會程序問題主軸。',c03ScopeCouncilReview:'審閱問題，選送交或保留。',c03ScopeRecord:'選範圍處理或議會回覆優先。',c03ScopeEnd:'查看補列與議會問題，可接續窗口回覆。',
 c03MaterialsDesk:'審閱本輪獨立材料回報。',c03MaterialsPress:'核對記者實際收到的範圍。',c03ContinuingDesk:'沿有效送件追處理說明。',c03ContinuingReply:'核對後收到的回函，不追加公開原文。',c03MaterialsRecord:'選範圍補列或議會整理。',c03MaterialsEnd:'查看材料回報，可接續範圍補列與議會整理。',
 c03ProcessingDesk:'沿實際送件追處理回覆或補送。',c03ProcessingReply:'核對實際交付、收件或說明聯絡。',c03ProcessingGapDesk:'選材料核對與缺件處理。',c03ProcessingGapReply:'核對原文與實際聯絡界線。',c03ProcessingRecord:'選材料回報或持續交涉優先。',c03ProcessingEnd:'查看實際交付與缺件，可接續材料回報。',
 c03DayFiveDesk:'依新邀請確認處理本日方法安排。',c03DayFiveMethod:'核對第 5 日實際結果。',c03ApplicationDesk:'依路徑與權限選程序申請或缺件準備。',c03ApplicationReceipt:'核對收件與尚缺材料。',c03DayFiveRecord:'選申請處理或缺件追蹤優先。',c03DayFiveEnd:'查看第 5 日申請，可接續處理與缺件追蹤。',
 c03ReportDesk:'審閱並決定獨立進度稿是否發布。',c03ReportPress:'核對記者實際收到的公開範圍。',c03NegotiationDesk:'沿有效送件交涉處理路徑。',c03NegotiationReply:'核對程序回覆與尚缺材料。',c03ReportRecord:'選第 5 日安排或國內申請優先。',c03ReportEnd:'查看第 4 日回報，可接續第 5 日方法安排。',
 c03ExecutionDesk:'依實際邀請選出席、改期或條件聯絡。',c03MethodSession:'核對完成紀要或本輪聯絡結果。',c03NationalContact:'沿國內送件追補充回覆。',c03NationalResult:'核對結果，保存紀要或新時段。',c03ExecutionRecord:'選成果回報或未決事項交涉。',c03ExecutionEnd:'查看故事第 4 日執行與新安排。',
 c03ConfirmationDesk:'依原洽談狀態選外方聯絡。',c03ForeignConfirmation:'核對條件回函或重新聯絡收件。',c03DomesticContact:'依實際送件選國內聯絡。',c03DomesticConfirmation:'核對兩項結果，決定限定方法安排。',c03ConfirmationRecord:'選方法會議或國內未決的後續工作。',c03ConfirmationEnd:'查看實際回覆與已確認／未確認安排。',
 c03ReceptionPress:'依實際公開版本回應記者追問。',c03ReceptionCaucus:'回應分段議程，保留利益調查。',c03ReceptionForeign:'選本輪先洽談的架空外方。',c03ReceptionTerms:'核對分案條件，回覆限定意向或暫緩。',c03ReceptionRecord:'選國內未決或外方條件的後續優先。',c03ReceptionEnd:'查看角色反應與分案協商狀態。',
 c03RoundDesk:'依實際送件選第二輪聯絡。',c03RoundReply:'核對第二輪程序文件或收件。',c03RoundDraft:'選原候選正文或獨立新稿。',c03RoundSignature:'核對本版全文與署名。',c03RoundRelease:'確認本輪原文，發布或保留。',c03RoundEnd:'查看第二輪文件與獨立版本紀錄。',
 c03FollowupDesk:'依選定分項與實際送件選聯絡動作。',c03FollowupReply:'核對承辦答覆、收件或保留狀態。',c03FollowupRecheck:'重審原版本，新回覆另存。',c03FollowupRecord:'選下一輪實際工作方向。',c03FollowupEnd:'查看本輪追問與重審紀錄。',
 c03PublicationDesk:'決定本輪發布或繼續保留。',c03PublicationReporter:'回答記者的實際追問。',c03PublicationCaucus:'回應黨團，保留利益調查分歧。',c03PublicationRecord:'選下輪優先事項，不宣稱取得結果。',c03PublicationEnd:'查看發布紀錄與後續未決事項。',
 c03RevisionDesk:'依審閱狀態決定實際改稿。',c03SignatureCheck:'確認本版可用的署名方式。',c03ReleaseReview:'審閱本版原文與公開範圍。',c03ReleaseRecord:'保存發布候選或內部保留狀態。',c03RevisionEnd:'查看版本與尚未發布的確認紀錄。',
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
  hint:state.chapter==='c03'?(scene.terminal?(state.scene==='c03OpeningEnd'?'可接續議會回應與正式窗口追問，進入會更新自動存檔；想保留暫停點可先保存手動欄位。':state.scene==='c03ReplyEnd'?'可接續分項窗口追蹤與利益協調，進入會更新自動存檔。':state.scene==='c03TrackEnd'?'可接續案件缺口與共同稿審閱，進入會更新自動存檔。':state.scene==='c03ManuscriptEnd'?'可接續改稿與發布前確認，進入會更新自動存檔。':state.scene==='c03RevisionEnd'?'可接續發布決定與角色反應，進入會更新自動存檔。':state.scene==='c03PublicationEnd'?'可接續後續追問與留稿重審，進入會更新自動存檔。':state.scene==='c03FollowupEnd'?'可接續第二輪答覆與稿件處理，進入會更新自動存檔。':state.scene==='c03RoundEnd'?'可接續新版追問與跨方協商，進入會更新自動存檔。':state.scene==='c03ReceptionEnd'?'可接續外方確認與國內未決，進入會更新自動存檔。':state.scene==='c03DueReplyEnd'?'本版到期回覆與責任追問已保存，下輪到期回信與責任窗口回覆尚未開放。':state.scene==='c03DueTrackEnd'?'可接續到期缺口回覆與責任追問，進入會更新自動存檔。':state.scene==='c03DayEightEnd'?'可接續第 8 日回覆與到期缺口追蹤，進入會更新自動存檔。':state.scene==='c03PrecloseEnd'?'可接續第 8 日開場與到期回報，進入會更新自動存檔。':state.scene==='c03ResponsibilityEnd'?'可接續補列處理與期限前收束，進入會更新自動存檔。':state.scene==='c03GapFollowEnd'?'可接續責任窗口核對與補列整理，進入會更新自動存檔。':state.scene==='c03GapReplyEnd'?'可接續缺口回信與補問處理，進入會更新自動存檔。':state.scene==='c03ScheduleEnd'?'可接續缺口回覆與窗口補問，進入會更新自動存檔。':state.scene==='c03PreReportEnd'?'可接續時程回覆與承諾缺口核對，進入會更新自動存檔。':state.scene==='c03DeadlineEnd'?'可接續期限前回報與等待者聯絡，進入會更新自動存檔。':state.scene==='c03DaySevenEnd'?'可接續答覆追蹤與期限前整理，進入會更新自動存檔。':state.scene==='c03HandlingEnd'?'可接續第 7 日安排與書面答覆準備，進入會更新自動存檔。':state.scene==='c03ScopeEnd'?'可接續範圍處理與議會窗口回覆，進入會更新自動存檔。':state.scene==='c03MaterialsEnd'?'可接續範圍補列與議會整理，進入會更新自動存檔。':state.scene==='c03ProcessingEnd'?'可接續新材料回報與持續交涉，進入會更新自動存檔。':state.scene==='c03DayFiveEnd'?'可接續申請處理與缺件追蹤，進入會更新自動存檔。':state.scene==='c03ReportEnd'?'可接續第 5 日方法安排與有效申請，進入會更新自動存檔。':state.scene==='c03ExecutionEnd'?'可接續成果回報與未決事項交涉，進入會更新自動存檔。':state.scene==='c03ConfirmationEnd'?'可接續方法執行與國內後續，進入故事第 4 日並更新自動存檔。':'故事第 4 日執行與新安排已保存，下一輪成果回報與未決交涉尚未開放。'):reading?'先閱讀本場對話，再準備追加詢問答覆。':'確認安排、準備稿與實際答覆分開記錄；原承諾與期限保留。'):scene.terminal?(state.scene==='c02ChapterEnd'?'可開始第三章追加詢問原型。進入會更新自動存檔；想保留章末，可先存入手動欄位。':state.chapter==='c02'?'第二章原型紀錄已保存。開場與調查暫停點可接續後段；回訪暫停點可接續交付核對；交付暫停點可接續來源與公開回覆；最後暫停點的後續反應與個案結果尚未開放。':'第一章流程已完成。可查看交接與未決事項，或開始第二章開場原型。進入會更新自動存檔；想保留結算點，可先存入手動欄位。'):state.chapter==='c02'?(reading?'先讀完本場對話，再決定這次追蹤如何進行。':state.scene==='c02Investigate'?'兩條分支均可處理；每次調查會記錄結果，另一條仍保留。':state.scene==='c02Board'?'本次原型先跟進一項原承諾；其他承諾與原期限保留。':'選擇本次聯絡方式或後續安排。回覆不代表原承諾已履行。'):scene.hub?`剩餘 ${state.slots} 個調查時段。每次拜訪消耗 1 個時段；最後一次訪談結束後進入案件整理。`:
   reading?'先閱讀本場對話，再選擇主線回應；本場支線可隨時查看。':'選擇主線回應會推進故事；離開前可先查看本場支線，未完成內容不會自動補做。'
 };
}
