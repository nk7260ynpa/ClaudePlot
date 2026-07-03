# ClaudePlot 圖表圖鑑 — 實作計畫

## Context（背景與目的）

`ClaudePlot` 目前是空專案（僅有 stub `README.md` 與空的 `plans/`）。使用者想要：

1. 用 **Docker** 建立一個「**圖鑑（Codex / Pokédex 風格）**」網頁。
2. 由 **Claude 的知識** 整理出**各種常見到進階的圖表**（約 30 種）。
3. 每個圖表卡片需標示 **中文標題 + 英文標題 + 適用場景**。

已與使用者確認的三項決策：

| 項目 | 決定 |
| --- | --- |
| 繪圖函式庫 | **Apache ECharts**（圖表種類最豐富、中文支援佳，最適合做圖鑑） |
| 服務架構 | **nginx 靜態網站**（純前端、輕量、離線可用，無 Python 故不需單元測試） |
| 收錄範圍 | **完整版 ~30 種**，分 8 大類 |

預期成果：`./run.sh` 一鍵啟動 container，瀏覽器開 `http://localhost:8080` 即可看到一面「圖表卡片牆」，可依分類篩選、關鍵字搜尋，點卡片彈出大圖與完整「適用場景」說明。

本專案同時遵循使用者全域 `CLAUDE.md` 的網頁專案結構規範（`docker/`、`logs/`、`run.sh`、README 含架構說明、文件用繁體中文、`*.log` 進 `.gitignore`）。

---

## 專案結構

```
ClaudePlot/
├── README.md                 # 專案說明 + 架構圖 + 使用方式（繁中）
├── run.sh                     # 一鍵：docker compose up -d --build，並印出網址
├── .gitignore                # *.log、logs/*、src/vendor/（build 時下載的第三方檔）
├── CLAUDE.md                 # 專案層說明（build/run 指令、架構），團隊共享故納入版控
├── docker/
│   ├── Dockerfile            # nginx:alpine，build 時下載 ECharts + world geoJSON，COPY src/
│   ├── build.sh              # 建立 image 的腳本
│   ├── docker-compose.yaml   # 服務、port 8080:80、掛載 ./logs → /var/log/nginx
│   └── nginx.conf            # 讓 access/error log 寫成實體檔（供 logs/ 持久化）
├── logs/
│   └── .gitkeep
└── src/                       # nginx 靜態網站根目錄
    ├── index.html            # 圖鑑主頁（Header + 分類列 + 搜尋 + 卡片牆 + 詳情彈窗）
    ├── css/
    │   └── style.css         # 卡片、分類色票、RWD、明暗主題
    ├── js/
    │   ├── catalog.js        # 圖鑑資料：每種圖的 id/分類/中英標題/適用場景/ECharts option
    │   ├── app.js            # 渲染卡片牆、分類篩選、搜尋、lazy 初始化、詳情彈窗
    │   └── (echarts 由 build 時放入 vendor/)
    └── vendor/               # build 時放入 echarts.min.js、world.json（.gitignore）
```

---

## 圖鑑內容（8 大類，約 32 種圖表）

`catalog.js` 內每筆資料格式：

```js
{
  id: 1,
  category: 'comparison',
  titleZh: '長條圖',
  titleEn: 'Bar Chart',
  scenario: '比較不同類別間的數值大小，例如各產品銷售額、各地區人口。',
  tips: '類別數量不宜過多（建議 < 12）；需從零基線開始以免誤導。', // 詳情頁補充
  option: { /* 含內建示範資料的 ECharts option */ }
}
```

分類與色票（`category` → 中文名 / 色）：`comparison 比較`、`trend 趨勢`、`distribution 分佈`、`composition 組成`、`relationship 關聯`、`hierarchy 階層`、`flowProgress 流程/進度`、`geo 地理`。

| # | 分類 | 中文 | English | 適用場景（摘要） |
| --- | --- | --- | --- | --- |
| 1 | comparison | 長條圖 | Bar Chart | 比較各類別數值大小 |
| 2 | comparison | 橫向長條圖 | Horizontal Bar | 類別名稱較長、排行榜 |
| 3 | comparison | 分組長條圖 | Grouped Bar | 多系列在各類別下的對比 |
| 4 | comparison | 象形長條圖 | Pictorial Bar | 以圖示強化的比較，重視覺傳達 |
| 5 | comparison | 雷達圖 | Radar Chart | 多維度能力/屬性比較（如角色數值） |
| 6 | trend | 折線圖 | Line Chart | 隨時間變化的趨勢 |
| 7 | trend | 面積圖 | Area Chart | 趨勢並強調累積量 |
| 8 | trend | 堆疊面積圖 | Stacked Area | 多系列隨時間的組成變化 |
| 9 | trend | 階梯圖 | Step Line | 階段性變動（費率、庫存位階） |
| 10 | trend | K 線圖 | Candlestick | 股價開高低收，金融時序 |
| 11 | trend | 河流圖 | ThemeRiver | 多主題隨時間的消長 |
| 12 | distribution | 散佈圖 | Scatter | 兩變數相關性 |
| 13 | distribution | 氣泡圖 | Bubble | 三變數（x/y/大小） |
| 14 | distribution | 直方圖 | Histogram | 單一變數分佈（預先分箱） |
| 15 | distribution | 箱形圖 | Box Plot | 分佈的中位數/四分位/離群值 |
| 16 | distribution | 熱力圖 | Heatmap | 二維密度/相關矩陣 |
| 17 | composition | 圓餅圖 | Pie Chart | 少數類別的佔比 |
| 18 | composition | 環圈圖 | Doughnut | 佔比並於中心放總計 |
| 19 | composition | 玫瑰圖 | Rose / Nightingale | 類別佔比且以半徑表數量 |
| 20 | composition | 堆疊長條圖 | Stacked Bar | 各類別內部組成 |
| 21 | composition | 漏斗圖 | Funnel | 轉換流程各階段留存 |
| 22 | relationship | 關係圖 | Graph / Network | 節點關聯、社群網路 |
| 23 | relationship | 桑基圖 | Sankey | 流量在節點間的流向與量 |
| 24 | relationship | 平行座標 | Parallel Coordinates | 高維資料多指標比較 |
| 25 | hierarchy | 樹狀圖 | Tree | 階層/組織/檔案結構 |
| 26 | hierarchy | 矩形樹狀圖 | Treemap | 階層佔比（面積表數量） |
| 27 | hierarchy | 旭日圖 | Sunburst | 多層階層佔比（環形） |
| 28 | flowProgress | 儀表板 | Gauge | 單一 KPI 對目標的達成度 |
| 29 | flowProgress | 甘特圖 | Gantt（custom series） | 專案排程/時間區段 |
| 30 | flowProgress | 日曆熱力圖 | Calendar Heatmap | 每日數值（如提交次數、活躍度） |
| 31 | geo | 區域地圖 | Choropleth Map | 各地區數值分佈（世界地圖） |
| 32 | geo | 散點地圖 | Scatter on Map | 地理座標點位（城市、事件） |

實作註記（ECharts 特性）：
- **Histogram** ECharts 無原生型別 → 以預先分箱的 `bar` 呈現。
- **Gantt** 使用 `custom` series + `renderItem`（進階，先給簡化版排程資料）。
- **Map / Scatter on Map** 需 `echarts.registerMap('world', geoJson)`；world geoJSON 於 build 時下載至 `vendor/world.json`。
- 其餘（ThemeRiver、Sankey、Graph、Parallel、Tree、Treemap、Sunburst、Funnel、Gauge、Candlestick、Boxplot、Calendar、Radar、PictorialBar）皆為 ECharts 原生 series。
- 所有 `option` 內建**合成示範資料**（不需外部資料源）。

---

## 各檔案關鍵實作

### `src/index.html`
- Header：標題「ClaudePlot 圖表圖鑑 / Chart Codex」+ 副標 + 明暗主題切換鈕。
- 分類篩選列：`全部` + 8 分類 chip（含各類數量、色票）。
- 搜尋框：即時過濾（比對中/英標題與適用場景關鍵字）。
- 卡片牆容器 `<div id="grid">`；詳情彈窗 `<div id="modal">`（預設隱藏）。
- 於底部依序載入 `vendor/echarts.min.js` → `js/catalog.js` → `js/app.js`。

### `src/js/catalog.js`
- 匯出全域陣列 `CATALOG`（上表 32 筆），每筆含完整 `option` 與示範資料。
- 分類中繼資料 `CATEGORIES`（key → {name, color}）。

### `src/js/app.js`
- 依 `CATALOG` 產生卡片：Pokédex 風格編號 `#001`、mini 圖、中文大標 + 英文小標、分類 tag、單行場景。
- **效能**：用 `IntersectionObserver` **lazy 初始化** ECharts，僅在卡片進入視窗才 `echarts.init`；離開視窗可 dispose，避免 30+ 實例同時渲染卡頓。
- 分類篩選 + 搜尋：純前端過濾重繪。
- 點卡片 → 彈窗：大圖（重新 init 一個較大 instance）、完整中英標題、分類、**適用場景**全文、`tips`（何時使用/注意事項），可附該圖的 ECharts option 片段。
- `window.resize` 時對可見圖表 `resize()`。

### `src/css/style.css`
- 卡片牆 CSS Grid（RWD：手機 1 欄、平板 2、桌面 3–4 欄）。
- 分類色票、tag chip、卡片 hover、彈窗遮罩。
- `@media (prefers-color-scheme)` + 手動主題切換（`data-theme`）。

---

## Docker / nginx 細節

### `docker/Dockerfile`
- `FROM nginx:alpine`。
- build 階段用 busybox `wget` 下載**版本鎖定**的第三方檔到 `/usr/share/nginx/html/vendor/`：
  - ECharts：`echarts@5.5.x/dist/echarts.min.js`
  - world geoJSON：固定來源的 `world.json`
- `COPY src/ /usr/share/nginx/html/`（vendor 由上一步產生）。
- `COPY docker/nginx.conf /etc/nginx/conf.d/default.conf`。
- 備援：若 build 環境無網路，改為將檔案 vendor 進 repo 再 COPY（README 註明）。

### `docker/nginx.conf`
- `listen 80`、root `/usr/share/nginx/html`。
- `access_log /var/log/nginx/access.log; error_log /var/log/nginx/error.log;`（寫成實體檔，供 `./logs` 掛載持久化；覆蓋官方 image 的 stdout 軟連結）。
- 靜態資源基本 gzip、cache-control。

### `docker/docker-compose.yaml`
- service `web`：build context 指向專案根、dockerfile `docker/Dockerfile`。
- `ports: "8080:80"`。
- `volumes: ./logs:/var/log/nginx`。
- `restart: unless-stopped`。

### `docker/build.sh`
- `docker compose -f docker/docker-compose.yaml build`（或 `docker build`），Google Shell Style、`set -euo pipefail`。

### `run.sh`（專案根）
- `set -euo pipefail`；`mkdir -p logs`。
- `docker compose -f docker/docker-compose.yaml up -d --build`（每次執行都重建+重啟，符合「修改後自動重啟」偏好；靜態 COPY 重建很快）。
- 印出 `➜ http://localhost:8080`。

### `.gitignore`
- `*.log`、`logs/*`（保留 `.gitkeep`）、`src/vendor/`（build 時產生的第三方檔）。

---

## 驗證方式（end-to-end）

1. `./run.sh` → container 起來，終端顯示網址。
2. `docker compose -f docker/docker-compose.yaml ps` 確認 `web` 為 running。
3. 瀏覽器開 `http://localhost:8080`：
   - 卡片牆顯示 ~32 種圖，每張都有 mini 圖 + 中英標題 + 分類 tag。
   - 點分類 chip 可篩選；搜尋框可比對中英關鍵字。
   - 點任一卡片 → 彈窗顯示大圖 + 完整適用場景。
   - 縮放視窗，圖表隨之 resize；手機寬度下版面正常。
4. 用 Claude in Chrome（`navigate` + `read_console_messages`）打開頁面，確認 **console 無錯誤**、每個 ECharts 容器都成功渲染。
5. `ls logs/` 應出現 `access.log`／`error.log`（驗證 log 掛載）。
6. `docker compose ... down` 收尾。

---

## 註記 / 後續

- 純靜態、無 Python，故依全域 `CLAUDE.md`「若專案包含 Python 才需單元測試」不建立 pytest；改以上述瀏覽器 + console 檢查作為驗收。
- 完成後更新 `README.md`（架構說明）與新增專案層 `CLAUDE.md`（build/run 指令），並依 Conventional Commits 提交、push（使用者偏好：改完自動 commit & push）。
- 未來可擴充：更多圖表、匯出 option 為程式碼片段的「複製」按鈕、i18n 切換全站語言。
```
