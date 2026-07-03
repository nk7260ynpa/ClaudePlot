#!/usr/bin/env bash
#
# 建立 ClaudePlot 圖表圖鑑的 Docker image。
# 遵循 Google Shell Style Guide。

set -euo pipefail

readonly SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
readonly COMPOSE_FILE="${SCRIPT_DIR}/docker-compose.yaml"

main() {
  echo "[build] 建立 ClaudePlot image ..."
  docker compose -f "${COMPOSE_FILE}" build "$@"
  echo "[build] 完成。"
}

main "$@"
