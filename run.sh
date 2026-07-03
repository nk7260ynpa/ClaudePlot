#!/usr/bin/env bash
#
# 一鍵啟動 ClaudePlot 圖表圖鑑。
# 每次執行都會重建映像檔並重啟 container（靜態內容重建很快），
# 符合「修改程式碼後自動重啟」的偏好。
# 遵循 Google Shell Style Guide。

set -euo pipefail

readonly SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
readonly COMPOSE_FILE="${SCRIPT_DIR}/docker/docker-compose.yaml"
readonly URL="http://localhost:8090"

main() {
  mkdir -p "${SCRIPT_DIR}/logs"

  echo "[run] 建置並啟動 ClaudePlot ..."
  docker compose -f "${COMPOSE_FILE}" up -d --build

  echo ""
  echo "  ✅ ClaudePlot 圖表圖鑑已啟動"
  echo "  ➜  ${URL}"
  echo ""
  echo "  停止： docker compose -f docker/docker-compose.yaml down"
}

main "$@"
