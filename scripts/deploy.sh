#!/usr/bin/env bash
set -euo pipefail

echo "=== 部署 Cloudflare Worker ==="
npx wrangler deploy

echo ""
echo "=== 部署儀表板至 Cloudflare Pages ==="
npx wrangler pages deploy ./dashboard

echo ""
echo "=== 部署完成 ==="
