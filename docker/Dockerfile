# ClaudePlot 圖表圖鑑 — nginx 靜態網站映像檔
#
# build 階段會下載版本鎖定的第三方資源（ECharts 與 world geoJSON）到 vendor/，
# 讓最終映像檔完全自包含、可離線執行。
#
# 若 build 環境無網路，請改為將 echarts.min.js 與 world.json 手動放入 src/vendor/，
# 並移除下方的 wget 步驟（見 README「離線 build」段落）。
FROM nginx:alpine

# 第三方資源版本（可於 build 時以 --build-arg 覆寫）
ARG ECHARTS_VERSION=5.5.1
ARG WORLD_JSON_VERSION=4.9.0

# 先下載較少變動的第三方資源，善用 Docker layer 快取
RUN mkdir -p /usr/share/nginx/html/vendor \
    && wget -q -O /usr/share/nginx/html/vendor/echarts.min.js \
        "https://cdn.jsdelivr.net/npm/echarts@${ECHARTS_VERSION}/dist/echarts.min.js" \
    && wget -q -O /usr/share/nginx/html/vendor/world.json \
        "https://cdn.jsdelivr.net/npm/echarts@${WORLD_JSON_VERSION}/map/json/world.json"

# nginx 站台設定（access/error log 寫成實體檔，供 ./logs 掛載持久化）
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

# 靜態網站內容
COPY src/ /usr/share/nginx/html/

EXPOSE 80
