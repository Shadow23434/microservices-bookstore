#!/usr/bin/env bash
set -euo pipefail

BASE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

SERVICES=(
  "customer-service:customer_service"
  "book-service:book_service"
  "cart-service:cart_service"
  "staff-service:staff_service"
  "manager-service:manager_service"
  "catalog-service:catalog_service"
  "order-service:order_service"
  "ship-service:ship_service"
  "pay-service:pay_service"
  "comment-rate-service:comment_rate_service"
  "recommender-ai-service:recommender_ai_service"
  "api-gateway:api_gateway"
)

if ! command -v python3 >/dev/null 2>&1; then
  echo "[ERROR] python3 is required." >&2
  exit 1
fi

for item in "${SERVICES[@]}"; do
  svc="${item%%:*}"
  dj="${item##*:}"

  venv_path="$BASE_DIR/$svc/venv"
  py="$venv_path/bin/python"
  pip="$venv_path/bin/pip"
  req="$BASE_DIR/$svc/requirements.txt"
  manage="$BASE_DIR/$svc/$dj/manage.py"

  echo "=== Recreating venv & migrating for $svc ==="

  if [[ -d "$venv_path" ]]; then
    echo "1) Removing old venv..."
    rm -rf "$venv_path"
  fi

  echo "2) Creating new venv..."
  python3 -m venv "$venv_path"

  echo "3) Installing dependencies..."
  "$pip" install -r "$req" >/dev/null

  echo "4) Running migrations..."
  "$py" "$manage" makemigrations app || true
  "$py" "$manage" migrate

  db="$BASE_DIR/$svc/$dj/db.sqlite3"
  if [[ -f "$db" ]]; then
    echo "DB created: true"
  else
    echo "DB created: false"
  fi
  echo "------------------------------------------------"
done

echo "ALL PROCESSES COMPLETED!"
