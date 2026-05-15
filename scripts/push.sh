#!/usr/bin/env bash
# push.sh — Sync project to Raspberry Pi and deploy
# Usage: bash scripts/push.sh <PI_IP> [PI_USER] [REMOTE_DIR]
#
# First run: copy files, then create .env on the Pi before re-running.
#   ssh PI_USER@PI_IP "cp ~/you/.env.example ~/you/.env && nano ~/you/.env"
#   bash scripts/push.sh PI_IP
#
# Subsequent runs: rsync + docker compose rebuild + provision.

set -euo pipefail

PI_IP="${1:?Usage: $0 PI_IP [PI_USER] [REMOTE_DIR]}"
PI_USER="${2:-pi}"
REMOTE_DIR="${3:-/home/$PI_USER/you}"

echo "[push] Ensuring $REMOTE_DIR exists on Pi..."
ssh "$PI_USER@$PI_IP" "mkdir -p $REMOTE_DIR"

echo "[push] Syncing to $PI_USER@$PI_IP:$REMOTE_DIR ..."
rsync -az --progress \
  --exclude='.env' \
  --exclude='.git/' \
  --exclude='.github/' \
  --exclude='docker-compose.override.yml' \
  --exclude='www/analytics.js' \
  --exclude='node_modules/' \
  --exclude='playwright-report/' \
  --exclude='test-results/' \
  --exclude='*.pyc' \
  . "$PI_USER@$PI_IP:$REMOTE_DIR"

echo "[push] Running deploy on Pi..."
ssh "$PI_USER@$PI_IP" "
  set -euo pipefail
  cd $REMOTE_DIR

  if [[ ! -f .env ]]; then
    echo ''
    echo 'ERROR: no .env found on the Pi. Deploy skipped.'
    echo '  Create it from the template, then re-run push.sh:'
    echo ''
    echo '    cp $REMOTE_DIR/.env.example $REMOTE_DIR/.env'
    echo '    nano $REMOTE_DIR/.env'
    echo ''
    exit 0
  fi

  docker compose -f docker-compose.yml up -d umami-db umami
  docker compose -f docker-compose.yml build caddy
  docker compose -f docker-compose.yml up -d --no-deps caddy
  bash scripts/provision.sh
"
