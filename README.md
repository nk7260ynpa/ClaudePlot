# ClaudePlot 圖表圖鑑 · Chart Codex

一個「圖鑑（Pokédex 風格）」網頁，收錄由 Claude 知識整理的 **32 種常用到進階圖表**，
以 [Apache ECharts](https://echarts.apache.org/) 即時渲染。每張卡片都標示
**中文名稱、英文名稱與適用場景**，可依分類篩選、關鍵字搜尋，並點卡片查看大圖與使用提示。

整個網站是純前端靜態站台，由 **nginx** 在 **Docker** container 中提供服務。

---

## 快速開始

前置需求：已安裝 Docker 與 Docker Compose。

```bash
./run.sh
```

啟動後開啟瀏覽器：**<http://localhost:8090>**

停止服務：

```bash
docker compose -f docker/docker-compose.yaml down
```

> `run.sh` 每次執行都會重建映像檔並重啟 container（靜態內容重建很快），
> 因此修改 `src/` 內容後重跑即可看到最新結果。

---

## 專案架構

```text
ClaudePlot/
├── run.sh                    # 一鍵建置並啟動 container（掛載 logs/，印出網址）
├── docker/
│   ├── Dockerfile            # nginx:alpine；build 時下載 ECharts + world geoJSON 到 vendor/
│   ├── build.sh              # 僅建置映像檔的腳本
│   ├── docker-compose.yaml   # 服務定義：專案名 claudeplot、port 8090:80、掛載 logs/
│   └── nginx.conf            # 站台設定，將 access/error log 寫成實體檔以持久化
├── logs/                     # nginx log（由 container 掛載寫入；已 gitignore）
└── src/                      # nginx 靜態網站根目錄（/usr/share/nginx/html）
    ├── index.html            # 主頁：Header + 分類列 + 搜尋 + 卡片牆 + 詳情彈窗
    ├── css/style.css         # 卡片、分類色票、RWD、明暗主題（CSS 變數）
    ├── js/
    │   ├── catalog.js        # 圖鑑資料：32 種圖表的中英標題／場景／提示／ECharts option
    │   └── app.js            # 渲染卡片牆、分類篩選、搜尋、延遲渲染、詳情彈窗、主題切換
    └── vendor/               # build 時下載的 echarts.min.js、world.json（已 gitignore）
```

### 運作方式

1. **建置階段**（Dockerfile）：以 `wget` 下載版本鎖定的 `echarts.min.js`
   與世界地圖 `world.json` 到 `vendor/`，再把 `src/` 複製進 nginx 的網站根目錄，
   產生一個完全自包含、可離線執行的映像檔。
2. **執行階段**：nginx 提供靜態檔案；`docker-compose.yaml` 將 host 的 `logs/`
   掛載到容器 `/var/log/nginx`，使 access／error log 持久化到專案內。
3. **前端**：`app.js` 註冊明暗兩套 ECharts 主題，以 `IntersectionObserver`
   延遲初始化圖表（僅在卡片進入視窗才渲染，避免一次建立 30+ 個實例卡頓）；
   地理類圖表會等 `world.json` 註冊完成後才渲染。

### 圖鑑內容（8 大分類，32 種）

| 分類 | 數量 | 代表圖表 |
| --- | --- | --- |
| 比較 Comparison | 5 | 長條圖、橫向長條圖、分組長條圖、象形長條圖、雷達圖 |
| 趨勢 Trend | 6 | 折線圖、面積圖、堆疊面積圖、階梯圖、K 線圖、河流圖 |
| 分佈 Distribution | 5 | 散佈圖、氣泡圖、直方圖、箱形圖、熱力圖 |
| 組成 Composition | 5 | 圓餅圖、環圈圖、玫瑰圖、堆疊長條圖、漏斗圖 |
| 關聯 Relationship | 3 | 關係圖、桑基圖、平行座標 |
| 階層 Hierarchy | 3 | 樹狀圖、矩形樹狀圖、旭日圖 |
| 流程/進度 Flow | 3 | 儀表板、甘特圖、日曆熱力圖 |
| 地理 Geo | 2 | 區域地圖、散點地圖 |

---

## 新增或修改圖表

所有圖表資料集中在 `src/js/catalog.js`，每筆格式如下：

```js
{
  id: 33,                    // 接續遞增，作為圖鑑編號
  category: 'comparison',    // 需為 CATEGORIES 既有分類
  titleZh: '中文標題',
  titleEn: 'English Title',
  scenario: '卡片上顯示的一行適用場景。',
  tips: '詳情頁的使用提示／注意事項。',
  // needsMap: true,         // 需世界地圖時才加
  option: { /* 含內建示範資料的 ECharts option */ },
}
```

顏色不需寫死在 option 內 —— 系列色與文字／軸線色由 `app.js` 依主題統一注入。
新增後重跑 `./run.sh` 即可。

---

## 設計備註

- **色彩**：類別色盤與明暗主題取自通過色盲安全性驗證的資料視覺化色盤，
  連續量級（熱力圖、地圖）採單一藍色漸層。
- **無 Python**：本專案為純靜態前端，故未包含 Python 程式碼與單元測試；
  驗收方式為容器 HTTP 狀態檢查與 ECharts SSR 離線渲染測試。
- **埠號**：預設 host port 為 `8090`（8080／8081 常被其他服務佔用），
  可於 `docker/docker-compose.yaml` 調整。
- **離線 build**：若 build 環境無法連網，請先手動將 `echarts.min.js` 與
  `world.json` 放入 `src/vendor/`，並移除 `docker/Dockerfile` 中的 `wget` 步驟。
