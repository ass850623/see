export const recordDetails={
 E02:[['船上 23:12:40','商船偏離指定航道'],['船上 23:14:40','拖船轉向'],['船上 23:15:40','發生碰撞']],
 E03:[['港口 23:13:00','通訊系統中斷'],['港口 23:16:00','通訊恢復'],['校正說明','船上時鐘比港口快四十秒，船上時間須減去四十秒。']],
 E04:[['事故前三週','值班單位通報通訊間歇中斷'],['事故前一週','外包維護排程仍待確認'],['文件限制','通報支持要求調查，不含證明政治對價的金流。']],
 E05:[['第一篇報導','誤將更新時間列為事發時間'],['更正紀錄','編輯已修正時間標示；沒有資料可證明收買。']]
};
export function canCompare(state){return state.scene==='reconcile'&&['E02','E03'].every(id=>state.evidence[id]?.verified);}
export function compareTimeline(state,answer){if(!canCompare(state))throw new Error('請先完成調查並進入證據整理');if(!['sequence','simultaneous','motive'].includes(answer))throw new Error('無效判讀');const next=structuredClone(state);const correct=answer==='sequence';next.flags.timelineComparison=correct?'verified':'review';next.note=correct?'時間比對完成：偏航 23:12 → 通訊中斷 23:13 → 轉向 23:14 → 碰撞 23:15。順序能核實，動機仍無法判定。':answer==='simultaneous'?'需要重看校正說明：船上快四十秒，直接比對原始時間會得到錯誤順序。':'順序不能證明政治動機；現有資料沒有蓄意干擾或策劃碰撞的證據。';return next;}
export function comparisonResponse(state){if(state.flags.timelineComparison==='verified')return state.visited.includes('technician')?'安禾回覆：「你們重做了校正，我就不用只靠你相信我的話。請把方法和結論一起公開。」':'予澄核對正式簡報：「即使沒有當面訪談，我們也能按照簡報重做時間校正。方法要和結論一起留存。」';if(state.flags.timelineComparison==='review')return '予澄提醒：「先把時間與資料限制對清楚，再決定聽證要說什麼。你可以重新比對。」';return '';}
