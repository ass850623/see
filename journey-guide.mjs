import {chapterPhases,chapterPhase} from './chapter-meta.mjs';
const objectives={
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
  actionTitle:scene.terminal?'章末工具':reading?'閱讀對話':state.scene==='c02Investigate'?'選擇調查順序':state.scene==='c02Board'?'選定追蹤焦點':scene.hub?'安排調查訪談':'主線回應',
  hint:scene.terminal?(state.chapter==='c02'?'第二章原型紀錄已保存。開場暫停點可接續調查；調查暫停點的後續原卷與個案結果尚未開放。':'第一章流程已完成。可查看交接與未決事項，或開始第二章開場原型。進入會更新自動存檔；想保留結算點，可先存入手動欄位。'):state.chapter==='c02'?(reading?'先讀完本場對話，再決定這次追蹤如何進行。':state.scene==='c02Investigate'?'兩條分支均可處理；每次調查會記錄結果，另一條仍保留。':state.scene==='c02Board'?'本次原型先跟進一項原承諾；其他承諾與原期限保留。':'選擇本次聯絡方式或後續安排。回覆不代表原承諾已履行。'):scene.hub?`剩餘 ${state.slots} 個調查時段。每次拜訪消耗 1 個時段；最後一次訪談結束後進入案件整理。`:
   reading?'先閱讀本場對話，再選擇主線回應；本場支線可隨時查看。':'選擇主線回應會推進故事；離開前可先查看本場支線，未完成內容不會自動補做。'
 };
}
