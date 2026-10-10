# Steam 桌面發行方向

本專案以 Windows 64 位元桌面遊戲為首個發行平台，Electron 包裝現有視覺小說 RPG。網頁版保留作開發與快速試玩；第一章不是完整 70 小時遊戲，目前只能作內部測試版本。Steam 商店頁尚未建立，也沒有上傳任何 Steam depot。

## 開發與打包

需要 Node.js 22.12 或更新版本。玩家不需要安裝 Node.js、開啟伺服器或保持網路連線。

```sh
npm ci
npm run desktop
npm run build:win
```

Windows 完整發行資料夾為 `dist/win-unpacked`，執行檔為 `VoicesOfTheMist.exe`。必須連同 resources、DLL 與其餘檔案一起配送，不能只上傳 exe。版本目前未簽署、使用 Electron 預設圖示；正式發行需製作專用圖示與版本資訊，再按需要設定程式簽署。跨平台建置 Windows 包不代表 Windows 執行驗收通過。

`npm run build:desktop` 在當前作業系統建立未封裝資料夾。Linux 圖形環境可執行 `npm run test:desktop` 驗證離線資源、隔離的渲染程序及關閉後續玩；無顯示器的測試環境須另外提供 X server。受限雲端環境可加 `--config.electronDownload.cache=/tmp/mist-electron-cache` 指定下載快取，開發 Electron 二進位下載可用 `electron_config_cache=/tmp/mist-electron-cache node node_modules/electron/install.js`。

桌面透過固定 `mist://game/` 來源載入本機資源，不使用 localhost 埠。F11 切換全螢幕，Escape 可退出全螢幕；全螢幕、輸入法與縮放仍需 Windows 實機測試。程式不開放 Node.js 給頁面，阻擋新視窗與外部導覽。

## 存檔

桌面資料固定保存在 Electron appData 下的 `voices-of-the-mist/saves` 資料夾，Windows 通常位於 `%APPDATA%\voices-of-the-mist\saves`。正式第一章每個欄位保存為獨立、帶版本的 JSON envelope；內容仍使用既有 schemaVersion 1，先驗證後寫入暫存檔再 rename。上一次有效資料保存為 `.bak`，主檔損壞時讀取有效備份並提示。損壞原檔讀取時不改寫；後續保存前將其另存 `.corrupt-時間戳`。主檔與備份均損壞時提示錯誤，不拿舊瀏覽器資料覆蓋。

首次升級會把同一桌面來源內有效的 localStorage 欄位遷移至空白檔案欄位，原資料保留；已有檔案優先，無效或損壞檔案不自動遷移覆寫。網頁瀏覽器屬另一來源，不會自動匯入。概念序章與試玩回饋目前仍存於 localStorage，正式存檔與遊戲設定使用獨立檔案。手動匯入匯出已加入，Steam Cloud 尚未實作；後續 Cloud 只考慮正式 saves 目錄的有效檔案，不同步整個 Chromium profile。

設定介面可在主畫面或遊玩中開啟，提供三種對話字級、高對比文字底色及桌面全螢幕操作。設定獨立保存，不隨讀檔回退。尚無音訊，因此沒有音量控制。Tab 與 Enter 使用原生按鈕鍵盤操作；全螢幕與中文輸入法仍待 Windows 實機確認。


## Steamworks 銜接

1. 由作品持有人建立 Steamworks 合作伙伴帳戶與遊戲 App，完成平台要求的身分、稅務及付款設定。
2. 取得真實 App ID 與 Windows Depot ID。將 `steam/*.vdf.example` 複製為 `.vdf` 並取代佔位字。範本預設 `Preview 1`，先檢查映射，不會發布分支；設定檔由 scripts 目錄執行時路徑須確認。
3. 透過 Steamworks SDK ContentBuilder／SteamPipe 上傳 `dist/win-unpacked` 的全部內容。Steamworks 的 Windows 啟動選項設定為 `VoicesOfTheMist.exe`。本專案不含帳戶登入或自動發布指令。
4. 在私人測試分支安裝與驗證，確認離線遊玩、存檔升級、Steam 啟動及關閉、Overlay、不同螢幕與系統權限。未測的平台不列為支援平台。
5. 商店素材、遊戲與內容問卷完成後，依 Steamworks 當時的審查與發布流程送審。Steam SDK、成就或 Cloud 並非目前已完成的功能，不在商店宣稱。

官方文件：[SteamPipe](https://partner.steamgames.com/doc/features/steampipe)、[上傳版本](https://partner.steamgames.com/doc/sdk/uploading)、[發行流程](https://partner.steamgames.com/doc/store/releasing)、[Steam Cloud](https://partner.steamgames.com/doc/features/cloud)。依實際帳戶介面確認最新要求。

## 發行前工作包

- 桌面垂直切片：設定介面、字級與音量、鍵盤操作、獨立存檔檔案與備份、專用圖示；先驗收第一章，不以工具數量計算遊玩時長。
- 完整製作：24 章／4 部的劇情、任務、分支承接、角色演出與音效；70 小時為全作目標，需實際內容與真人樣本支持。
- 素材與商店：核對所有圖片、字型、音樂與聲音的發行權利；目前生成美術須按 Steam 內容問卷如實填寫預生成 AI 素材使用情況。製作 capsule、截圖、預告片與準確的內容描述。
- 平台測試：Windows 10/11 支援版本、低配設備、重啟及更新存檔、下載與桌面路徑、鍵盤與中文輸入法；未承諾控制器或 Steam Deck 支援。

本輪驗證：Windows x64 與 Linux 發行資料夾均成功建置；Linux 打包版的離線圖片、渲染隔離、存檔與重開續玩通過。57 項遊戲測試及章節內容整合檢查通過。Windows 實機、Steam 上傳與完整內容均未驗收。


## 玩家搬移與備份管理

遊玩中開啟「存檔／讀檔」，每個有效欄位可匯出 `mist-save-欄位.json`。匯出是版本化遊戲存檔，與試玩回饋／時間紀錄 JSON 不同。

選擇匯入檔案後先檢查場景、選擇次數與累計時間，再選擇手動欄位 1–3；確認覆寫才寫入，當前遊玩狀態不變。之後按該欄位讀取接續。支援本版匯出格式及正式桌面存檔 envelope，拒絕不相容版本、不合法狀態與超過 8 MB 的檔案。匯入不包含設定、概念序章或回饋，也不擴大遊戲證據授權。

桌面每個欄位可預覽上一份有效 `.bak`。恢復手動備份只取代該欄位；恢復自動備份會取代自動欄位及當前遊玩進度，均要求確認。恢復也沿用寫入時的有效備份保護。只有一份輪替有效備份，不是完整歷史版本清單；損壞檔案仍另外保留。瀏覽器版提供匯入匯出，但沒有桌面檔案備份入口。

Linux 桌面與瀏覽器已驗證匯入預覽、取消不寫入、確認指定欄位寫入及備份預覽；桌面重開自動回復備份也通過。Windows 實機仍待驗收。
