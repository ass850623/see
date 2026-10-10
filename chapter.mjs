import {chapterTwoScenes} from './chapter-two.mjs';
import {aftermathScenes} from './aftermath.mjs';
import {narrativeBeats} from './narrative.mjs';
import {hearingScenes} from './hearing.mjs';
const choice=(id,text,next,effects={})=>({id,text,next,effects});
export const evidenceCatalog={
 E10:{title:'受限閱覽工作筆記',source:'窗口准許抄記的流程欄位，現場核對',summary:'記錄收件、移交與修訂登錄流程，不含值班姓名或原因認定；沒有原卷複本，未獲公開授權。'},
 E09:{title:'來源補充回信（私人）',source:'原來信聯絡管道再次寄來的私人補充',summary:'自述受理日期與公開索引線索，沒有原件或身分佐證；來源未核實、未獲公開授權。核對公開日期不等於核實本信。'},
 E08:{title:'調閱範圍書面答覆（公開版）',source:'正式受理窗口公開版程序答覆',summary:'已核對文號，說明公開附件與非公開原卷的申請範圍；不包含原卷或事故原因，不確認來源身分。'},
 E07:{title:'公開版附件清單與版本紀錄',source:'正式受理窗口交付的公開版',summary:'列有初版與修訂版的附件編號；可公開引用本清單，不含非公開原卷，不能證明竄改或來源身分。'},
 E01:{title:'十秒流傳影片',source:'社群轉傳',summary:'只呈現碰撞末段；來源未明，不能判定政治動機。'},
 E02:{title:'工會原始航行紀錄',source:'陳海寧提供的原始檔',summary:'記錄商船偏航與拖船轉向；必須與通訊紀錄核對。'},
 E03:{title:'港口通訊紀錄',source:'技師或正式調查簡報',summary:'事故前通訊中斷。時間可與航行紀錄核對；不能證明有人蓄意干擾。'},
 E04:{title:'維護缺失通報',source:'許安禾提供的公開合約與通報',summary:'通訊設備曾多次報修。支持要求調查，不能證明賄賂。'},
 E05:{title:'報導更正紀錄',source:'許知言核對的新聞存檔',summary:'兩篇報導的時間不同，其中一篇已更正。不能推論記者被收買。'},
 E06:{title:'停航與傷者公告',source:'港口公開公告',summary:'兩人受傷，航線暫停；停工家庭的收入受到影響。'}
};
export const taskCatalog={M01:'還原碰撞：核實事故時間線',M02:'保護作證的人：確認公開範圍',M03:'在議會說清楚：完成公開聽證與安全措施',S01:'停航之後：了解船員家庭',S02:'沒有發出的稿件：核對報導',S03:'予澄的清單：安排幕僚工作'};
export const chapterScenes={
 office:{place:'競選辦公室 · 07:40',speaker:'林予澄',role:'幕僚長',portrait:'aide',text:'電話從清晨就沒有停過。南灣港昨夜發生碰撞，兩人受傷。這十秒影片已經被當成「群島挑釁」的證據，但我們連拍攝者是誰都不知道。你要先見記者，還是去現場？',choices:[choice('verify','先查證。請你安排現場訪談。','brief',{stats:{trust:4},flags:{firstResponse:'verify'},note:'予澄通知記者：你會先查證，稍後回應。'}),choice('stance','先表明自主立場，但不判定事故原因。','brief',{stats:{autonomy:4,tension:3},flags:{firstResponse:'stance'},note:'你公開表明立場，同時保留對事故原因的判斷。'})]},
 brief:{place:'競選辦公室 · 簡報桌',speaker:'林予澄',role:'幕僚長',portrait:'aide',text:'我們只知道碰撞與傷者確實存在。影片裡看得到轉向，卻看不到此前發生的事。我替你開了案件簿。取得資料、核實資料，以及獲准公開，是三件不同的事。今天不能把它們混在一起。',choices:[choice('depart','收下影片，前往南灣港。','harbor',{evidence:{E01:{verified:false,authorized:false}},tasks:{M01:'active',M02:'active',M03:'pending'}})]},
 harbor:{place:'南灣港 · 08:30',speaker:'港口廣播',role:'公開公告',portrait:'worker',text:'候船室空了一半，玻璃門上貼著停航公告。兩名傷者正在治療，事故航道暫時封閉。有人問何時復航，也有人問昨天的加班費還算不算。碼頭不是新聞背景，而是他們的工作場所。',choices:[choice('listen','記下公告，先聽居民的問題。','harborTalk',{evidence:{E06:{verified:true,authorized:true}},stats:{trust:3}})]},
 harborTalk:{place:'南灣港 · 候船室',speaker:'陳海寧',role:'港口工會代表',portrait:'worker',text:'議員，你來得比攝影機早，這很好。但我不想再聽「會照顧大家」這種話。停航一天，就有人少一天薪水。你如果要談國家的未來，請先記住這些人的名字。我願意讓你看完整紀錄，不代表我答應讓所有船員上新聞。',choices:[choice('respect','我們先談資料使用範圍，不要求船員出鏡。','union',{relations:{haining:2},note:'海寧願意在工會休息室和你談。'}),choice('urgent','調查很急，但公開姓名仍由當事人同意。','union',{relations:{haining:1},stats:{autonomy:2},note:'海寧提醒你：急迫不能取代同意。'})]},
 union:{place:'工會休息室 · 09:20',speaker:'陳海寧',role:'港口工會代表',portrait:'worker',text:'完整紀錄放在這裡。你會看到商船偏離航道，也會看到我們的拖船應變不夠好。我們不要求你幫忙掩蓋。但請不要只挑有利的片段，讓船員成為另一場宣傳的工具。你準備怎麼處理？',choices:[choice('redacted','核實後公開完整時間線，遮蔽個資。','unionAfter',{evidence:{E02:{verified:false,authorized:true}},flags:{recordRelease:'redacted'},relations:{haining:2},tasks:{M02:'complete'},note:'取得遮蔽個資後的公開授權；原始檔仍不可任意散布。'}),choice('review','先供獨立調查，公開前再徵求同意。','unionAfter',{evidence:{E02:{verified:false,authorized:false}},flags:{recordRelease:'review'},relations:{haining:1},tasks:{M02:'active'},note:'你取得調查使用權，尚未取得公開授權。'}),choice('selective','先使用對群島有利的片段。','unionAfter',{evidence:{E02:{verified:false,authorized:false}},flags:{recordRelease:'selective'},relations:{haining:-2},stats:{trust:-5,autonomy:3},tasks:{M02:'active'},note:'海寧拒絕公開授權，仍允許你查閱完整檔案。'})]},
 unionAfter:{place:'工會休息室 · 09:35',speaker:'林予澄',role:'幕僚長',portrait:'aide',text:'紀錄已取得，但船上的時間可能和港口系統不一致。下午有三個調查時段，四個人可以見。技師能核對通訊、船員家屬能說明停航影響、記者能查報導時間。我也想和你談談團隊能承擔多少承諾。',choices:[choice('schedule','打開行程，安排三次訪談。','hub')]},
 hub:{place:'南灣港 · 調查行程',speaker:'林予澄',role:'幕僚長',portrait:'aide',text:'每次訪談占用一個時段，同一個人只能訪問一次。錯過的支線會記錄在任務簿；必要通訊資料仍可從正式簡報取得。請選擇接下來要見的人。',hub:true,choices:[]},
 technician:{place:'港口維護室',speaker:'許安禾',role:'港口技師',portrait:'worker',text:'這份報修紀錄不是今天才寫的。我們早就提過通訊斷線。事故前兩分鐘，港口系統確實中斷，但這不等於有人故意切斷。我能幫你核對時間；公開時請先拿掉值班同事的名字。',choices:[choice('protect','保護身分，公開資料前遮蔽個資。','hub',{evidence:{E03:{verified:true,authorized:true},E04:{verified:true,authorized:true}},flags:{witnessProtection:'protected'},relations:{anhe:2},stats:{trust:4},note:'取得已核實的通訊資料與公開維護文件。'}),choice('named','詢問是否願意具名；不同意也不影響調查。','hub',{evidence:{E03:{verified:true,authorized:true},E04:{verified:true,authorized:true}},flags:{witnessProtection:'consent'},relations:{anhe:1},note:'安禾暫不願具名，接受遮蔽個資後使用資料。'})]},
 family:{place:'候船室外 · 救助服務台',speaker:'陳海寧',role:'港口工會代表',portrait:'worker',text:'傷者家屬正在排隊填表。他們最怕的不是今天沒有補助，而是明天換一位承辦人，又要從頭證明自己遇到了什麼。你可以承諾多少？不要為了讓這一刻好看，答應辦不到的事。',choices:[choice('process','要求公開救助流程與進度，下週回報。','hub',{tasks:{S01:'complete'},flags:{reliefPromise:'report'},relations:{haining:2},stats:{trust:4},note:'新增承諾：下一章回報救助進度。'}),choice('refer','先轉介現有救助，不承諾尚未通過的預算。','hub',{tasks:{S01:'complete'},flags:{reliefPromise:'referral'},stats:{trust:2},note:'家屬取得申請窗口；資金問題仍待處理。'})]},
 journalist:{place:'港邊咖啡店',speaker:'許知言',role:'公共電視主持人',portrait:'host',text:'兩篇報導標的時間不同，其中一篇把更新時間寫成事發時間。我可以提供更正紀錄。但別期待我因為你提供資料，就替你寫好看的稿子。若工會紀錄也顯示拖船犯錯，你還會接受具名採訪嗎？',choices:[choice('interview','接受，說清楚我們知道與不知道的事。','hub',{evidence:{E05:{verified:true,authorized:true}},tasks:{S02:'complete'},flags:{pressInterview:true},stats:{trust:3},note:'你接受採訪，更正紀錄加入證據簿。'}),choice('written','先提供可核實的書面回答，稍後接受追問。','hub',{evidence:{E05:{verified:true,authorized:true}},tasks:{S02:'complete'},flags:{pressInterview:false},note:'知言接受書面資料，也保留追問。'})]},
 aide:{place:'辦公室 · 午間',speaker:'林予澄',role:'幕僚長',portrait:'aide',text:'你今天答應的事，我每一件都寫下來了。但我們只有三個人。上次我待的團隊，人人都答應選民，最後卻沒人知道誰要負責。我需要你給我權限安排工作，也需要你接受我說「這週做不到」。',choices:[choice('delegate','你可以安排分工；無法履行的承諾一起公開說明。','hub',{tasks:{S03:'complete'},flags:{aideDelegation:'delegate'},relations:{yucheng:2},note:'予澄獲得調度權，團隊開始整理承諾期限。'}),choice('centralize','先由我確認每項承諾，暫時集中決策。','hub',{tasks:{S03:'complete'},flags:{aideDelegation:'centralize'},relations:{yucheng:-1},note:'予澄接受安排，但提醒你注意決策瓶頸。'})]},
 reconcile:{place:'辦公室 · 證據整理桌',speaker:'林予澄',role:'幕僚長',portrait:'aide',text:'通訊資料已到齊。船上與港口的時間相差四十秒，校正後可確認：商船先偏離航道，通訊中斷期間拖船轉向失誤。這是可以核實的事故順序，仍不足以判定政治動機。你想把哪一句帶到聽證會？',choices:[choice('bounded','各方失誤都有證據；動機仍需調查。','authorization',{stats:{trust:4},flags:{hearingClaim:'bounded'},tasks:{M01:'complete'},note:'你建立了可信的時間線，保留未知事項。'}),choice('accuse','這一定是有人策劃的挑釁。','authorization',{stats:{trust:-4,tension:5},flags:{hearingClaim:'accusation'},tasks:{M01:'complete'},note:'予澄提出異議：現有證據不支持這個動機指控。'})]},
 authorization:{place:'辦公室 · 工會回電',speaker:'陳海寧',role:'港口工會代表',portrait:'worker',text:'我看過你們校正後的時間線了。我仍然要求遮蔽個資。如果你願意保留完整脈絡，我可以授權使用；如果你只想拿一句話當標語，請不要說工會支持你。',choices:[choice('authorize','承諾完整脈絡與個資保護，取得授權。','checkpoint',{evidence:{E02:{verified:true,authorized:true}},tasks:{M02:'complete'},flags:{recordRelease:'redacted'},relations:{haining:1},note:'公開授權已確認。你仍須遵守遮蔽個資與完整脈絡的條件。'}),choice('private','暫不公開原始資料，只提交調查。','checkpoint',{evidence:{E02:{verified:true,authorized:false}},tasks:{M02:'pending'},flags:{recordRelease:'review'},note:'公開授權仍未完成，資料保留供調查使用。'})]},
 checkpoint:{place:'議會走廊 · 聽證準備',speaker:'沈若川',role:'本土協進黨議員',portrait:'senior',text:'窗外天色開始轉暗。證據有了，承諾也留下了。接下來是黨團協商與公開聽證。你仍可以查看案件簿，或先存檔再前進。',choices:[choice('continue','前往黨團協商。','caucus')]},
 ...hearingScenes,
 ...chapterTwoScenes,
 ...aftermathScenes
};
export const visits=[{id:'technician',title:'拜訪技師 · 通訊與維護資料'},{id:'family',title:'探望船員家庭 · 停航之後',task:'S01'},{id:'journalist',title:'與記者核對 · 報導時間線',task:'S02'},{id:'aide',title:'和予澄談談 · 幕僚工作量',task:'S03'}];

for(const [id,beats] of Object.entries(narrativeBeats))chapterScenes[id].beats=beats;
