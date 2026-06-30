#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

PORT="${SMOKE_PORT:-4010}"
BASE_URL="http://127.0.0.1:${PORT}"
STARTUP_TIMEOUT_SECONDS="${SMOKE_STARTUP_TIMEOUT_SECONDS:-90}"

SERVER_PID=""

cleanup() {
  if [[ -n "$SERVER_PID" ]] && kill -0 "$SERVER_PID" >/dev/null 2>&1; then
    kill "$SERVER_PID" >/dev/null 2>&1 || true
    wait "$SERVER_PID" >/dev/null 2>&1 || true
  fi
}
trap cleanup EXIT

echo "[smoke] Building application..."
npm run build >/tmp/apc-smoke-build.log 2>&1

echo "[smoke] Starting Next.js on port ${PORT}..."
PORT="$PORT" \
npm run start >/tmp/apc-smoke-start.log 2>&1 &
SERVER_PID=$!

echo "[smoke] Waiting for server readiness..."
READY=0
for ((i=1; i<=STARTUP_TIMEOUT_SECONDS; i++)); do
  if curl -fsS "$BASE_URL/" >/dev/null 2>&1; then
    READY=1
    break
  fi
  sleep 1
done

if [[ "$READY" -ne 1 ]]; then
  echo "[smoke] FAIL: server did not become ready in ${STARTUP_TIMEOUT_SECONDS}s"
  echo "[smoke] --- start log ---"
  cat /tmp/apc-smoke-start.log || true
  exit 1
fi

failures=0

check_page() {
  local path="$1"
  local expected="$2"

  local status
  status="$(curl -sS -D /tmp/apc-smoke-page.headers -o /tmp/apc-smoke-page.out -w '%{http_code}' "$BASE_URL$path")"

  if [[ "$status" != "200" ]]; then
    echo "[smoke] FAIL page $path -> HTTP $status"
    failures=$((failures + 1))
    return
  fi

  if [[ -n "$expected" ]] && ! grep -q "$expected" /tmp/apc-smoke-page.out; then
    echo "[smoke] FAIL page $path missing expected text: $expected"
    failures=$((failures + 1))
    return
  fi

  echo "[smoke] PASS page $path"
}

check_protected_page() {
  local path="$1"
  local status
  status="$(curl -sS -D /tmp/apc-smoke-protected-page.headers -o /tmp/apc-smoke-protected-page.out -w '%{http_code}' "$BASE_URL$path")"

  if [[ "$status" == "200" ]]; then
    echo "[smoke] PASS protected page $path -> HTTP 200"
    return
  fi

  if [[ "$status" == "307" ]] && grep -qi "^location: .*/login" /tmp/apc-smoke-protected-page.headers; then
    echo "[smoke] PASS protected page $path -> HTTP 307 login redirect"
    return
  fi

  echo "[smoke] FAIL protected page $path -> HTTP $status"
  failures=$((failures + 1))
}

check_api() {
  local path="$1"
  local key="$2"

  local status
  status="$(curl -sS -D /tmp/apc-smoke-api.headers -o /tmp/apc-smoke-api.out -w '%{http_code}' "$BASE_URL$path")"

  if [[ "$status" != "200" ]]; then
    echo "[smoke] FAIL api $path -> HTTP $status"
    failures=$((failures + 1))
    return
  fi

  if [[ -n "$key" ]] && ! grep -q "$key" /tmp/apc-smoke-api.out; then
    echo "[smoke] FAIL api $path missing expected key: $key"
    failures=$((failures + 1))
    return
  fi

  echo "[smoke] PASS api $path"
}

check_api_options() {
  local path="$1"
  local status
  status="$(curl -sS -o /tmp/apc-smoke-api-options.out -w '%{http_code}' -X OPTIONS "$BASE_URL$path")"

  if [[ "$status" != "204" ]]; then
    echo "[smoke] FAIL api options $path -> HTTP $status"
    failures=$((failures + 1))
    return
  fi

  echo "[smoke] PASS api options $path"
}

check_protected_api() {
  local path="$1"
  local status
  status="$(curl -sS -D /tmp/apc-smoke-protected-api.headers -o /tmp/apc-smoke-protected-api.out -w '%{http_code}' "$BASE_URL$path")"

  if [[ "$status" == "200" ]]; then
    echo "[smoke] PASS protected api $path -> HTTP 200"
    return
  fi

  if [[ "$status" == "307" ]] && grep -qi "^location: .*/login" /tmp/apc-smoke-protected-api.headers; then
    echo "[smoke] PASS protected api $path -> HTTP 307 login redirect"
    return
  fi

  echo "[smoke] FAIL protected api $path -> HTTP $status"
  failures=$((failures + 1))
}

check_page "/" "APC"
check_page "/login" "Sign in"
check_protected_page "/dashboard"
check_protected_page "/checklist"

check_api_options "/api/auth/login"
check_protected_api "/api/system-health"
check_protected_api "/api/platforms"
check_protected_api "/api/alerts"
check_protected_api "/api/notifications"
check_protected_api "/api/command-status"

if [[ "$failures" -gt 0 ]]; then
  echo "[smoke] FAIL: ${failures} check(s) failed"
  echo "[smoke] --- start log ---"
  cat /tmp/apc-smoke-start.log || true
  exit 1
fi

echo "[smoke] PASS: all checks succeeded"
