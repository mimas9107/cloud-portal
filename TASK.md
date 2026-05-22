---
name:          "TASK.md"
description:   "多雲端服務狀態儀表板 — 工作任務清單"
created_date:  "2026/05/22 10:00:00"
modified_date: "2026/05/22 10:00:00"
project_version: "0.1.0"
document_version: "1.0.0"
agent_sign: ['human/name','opencode/deepseek-v4-flash-free']
---

# 工作任務清單

## Phase 1：核心 Worker 開發

### T1.1 建立服務設定檔
- **檔案**: `src/config.js`
- **說明**: 定義 `SERVICES` 陣列，包含 id、name、platform、url、type
- **驗收**: 可 `import { SERVICES }` 且內容正確

### T1.2 實作探測工具函式
- **檔案**: `src/utils.js`
- **說明**: `probeService(service)` 非同步函式，含 10 秒 AbortController 超時
- **驗收**: 回傳 `{ id, status, statusCode, latency, lastChecked, reason? }`

### T1.3 實作 Worker 主程式
- **檔案**: `src/index.js`
- **說明**: 匯出 `{ fetch, scheduled }`，實作 `/api/status`、`/api/trigger`、Cron 全量探測
- **驗收**: `wrangler dev` 可正確回應 API 請求

### T1.4 撰寫 wrangler.toml
- **檔案**: `wrangler.toml`
- **說明**: 設定 Worker 名稱、KV binding、Cron trigger
- **驗收**: `wrangler deploy` 可成功部署

## Phase 2：儀表板前端開發

### T2.1 實作 CSS 樣式
- **檔案**: `dashboard/style.css`
- **說明**: 暗色玻璃擬態風格，定義 status-badge 顏色系統
- **驗收**: 在瀏覽器中呈現正確的視覺風格

### T2.2 實作前端邏輯
- **檔案**: `dashboard/app.js`
- **說明**: `fetchStatus()`、`triggerProbe()`、`renderDashboard()` 三個主要函式
- **驗收**: 可正確呼叫 Worker API 並渲染卡片

### T2.3 實作 HTML 結構
- **檔案**: `dashboard/index.html`
- **說明**: 三區網格佈局（Render / Vercel / Cloudflare）
- **驗收**: `npx wrangler pages dev ./dashboard` 可正常顯示

## Phase 3：部署與設定

### T3.1 部署腳本
- **檔案**: `scripts/deploy.sh`
- **說明**: 依序執行 Worker 部署、Pages 部署
- **驗收**: `bash scripts/deploy.sh` 一鍵完成部署

### T3.2 專案設定檔
- **檔案**: `package.json`
- **說明**: npm scripts：`dev`、`deploy`、`publish:dashboard`
- **驗收**: `npm run deploy` 可觸發 wrangler

### T3.3 環境與忽略檔案
- **檔案**: `.env.example`, `.gitignore`
- **說明**: 定義環境變數樣板與 git 忽略規則
- **驗收**: 格式正確，可直接複製使用

## Phase 4：測試與驗證

### T4.1 本地測試
- **說明**: 使用 `wrangler dev` 啟動本地環境
- **驗收**: 所有 API 路由回應正確

### T4.2 部署測試
- **說明**: 部署至 Cloudflare 測試帳號
- **驗收**: 可透過公網 URL 存取 Worker 與儀表板

### T4.3 端到端驗證
- **說明**: 確認 Cron 自動探測、KV 讀寫、前端渲染完整鏈路
- **驗收**: 儀表板顯示正確的服務狀態

## Phase 5：文件完善

### T5.1 更新 CHANGELOG
- **說明**: 記錄各版本變更
- **驗收**: 格式符合 AGENTS.md 規範

### T5.2 補齊 MEMOIR
- **說明**: 記錄開發過程中的關鍵決策
- **驗收**: 包含架構選擇理由與注意事項

### T5.3 版本同步
- **說明**: 執行 version-sync-checker 腳本
- **驗收**: 所有文件 project_version 一致
