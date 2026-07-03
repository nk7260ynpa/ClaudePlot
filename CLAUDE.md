# CLAUDE.md — ClaudePlot 專案指引

供未來 Claude Code 工作階段快速掌握本專案。此檔為團隊共享，納入版本控制。

## 專案本質

「圖鑑（Pokédex 風格）」網頁，收錄 32 種圖表（8 大分類），以 Apache ECharts 渲染，
由 nginx 在 Docker container 提供服務。**純前端靜態站台，無後端、無 Python、無單元測試。**

## 常用指令

| 目的 | 指令 |
| --- | --- |
| 建置並啟動 | `./run.sh`（等同 `docker compose -f docker/docker-compose.yaml up -d --build`） |
| 僅建置映像檔 | `./docker/build.sh` |
| 停止 | `docker compose -f docker/docker-compose.yaml down` |
| 檢視狀態 | `docker compose -f docker/docker-compose.yaml ps` |
| 網址 | <http://localhost:8090> |

修改 `src/` 後重跑 `./run.sh` 即可看到最新結果。

## 架構重點

- `docker/`：Dockerfile（nginx:alpine + build 時 `wget` 下載 ECharts／world.json 到 vendor/）、
  docker-compose.yaml（**專案名固定為 `claudeplot`**，避免與其他位於 `docker/` 的專案撞名；port `8090:80`；掛載 `../logs`）、nginx.conf。
- `src/js/catalog.js`：**所有圖表資料的唯一來源**（`CATEGORIES` + `CATALOG`）。新增圖表只改這裡。
- `src/js/app.js`：主題註冊、延遲渲染（IntersectionObserver）、篩選／搜尋、詳情彈窗。
  option **不寫死顏色**，色盤與軸線色由主題統一注入。地理類（`needsMap: true`）待 `world.json` 註冊後才渲染。

## 驗證方式（無瀏覽器時）

1. 容器 HTTP 檢查：`curl -s -o /dev/null -w '%{http_code}' http://localhost:8090/`（應為 200）。
2. ECharts SSR 離線渲染：從容器 `docker cp` 取出 `vendor/echarts.min.js` 與 `world.json`，
   在 Node 以 `echarts.init(null, null, {renderer:'svg', ssr:true, ...})` 對每個 option
   `setOption` + `renderToSVGString`，確認無 error。
3. `logs/` 內應出現 `access.log`／`error.log`。

## 注意事項

- port 8080／8081 在本機常被 gitlab／nginx 佔用，故本專案用 8090。
- `src/vendor/` 與 `*.log` 已 gitignore；vendor 由 build 時下載。
- 文件、註解使用繁體中文；commit message 用繁體中文並遵循 Conventional Commits。
