---
name:          "CHANGELOG.md"
description:   "專案版本變更紀錄"
created_date:  "2026/05/22 10:00:00"
modified_date: "2026/05/22 16:00:00"
project_version: "0.2.0"
document_version: "1.1.0"
agent_sign: ['human/name','opencode/deepseek-v4-flash-free']
---

# 版本變更紀錄

## [0.2.0] — 2026-05-22
### 新增
- 部署 Worker 至 Cloudflare Edge（KV binding + Cron 定時器）
- 部署儀表板至 Cloudflare Pages
- 端到端驗證：6 個服務全部回應正常
- QUICKSTART.md 新手部署手冊
- 本地 dev 測試流程驗證

### 變更
- wrangler.toml 更新為實際 KV namespace ID
- dashboard/app.js 設定實際 Worker URL
- src/config.js 更新為實際服務 URL
- package.json publish:dashboard 補上 project-name 參數
- README.md 重新整理結構

## [0.1.0] — 2026-05-22
### 新增
- 初始專案建置：基於 Cloudflare 邊緣部署提案
- 技術規格書 (SPEC.md) 完成
- 實作計畫書 (PLAN.md) 完成
- 工作任務清單 (TASK.md) 完成
- 專案 README 與 CHANGELOG 初始化
- 開發備忘錄 (MEMOIR.md) 初始化
- 專案目錄結構與設定檔格式規劃
