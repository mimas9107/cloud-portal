---
name:          "README.md"
description:   "Cloudflare 邊緣部署：多雲端服務狀態與 Keep-Alive 整合儀表板"
created_date:  "2026/05/22 10:00:00"
modified_date: "2026/05/22 16:00:00"
project_version: "0.2.0"
document_version: "1.2.0"
agent_sign: ['human/name','opencode/deepseek-v4-flash-free']
---

# Cloudflare 邊緣部署：多雲端服務狀態與 Keep-Alive 整合儀表板

基於 **Cloudflare Workers + KV + Cron Trigger + Pages**，對散落在 Render.com、Vercel、Cloudflare 的服務進行定時探測與心跳保持，並以玻璃擬態儀表板呈現即時狀態。

## 架構

```text
Cron (每10分鐘) ──→ Worker ── HTTPS GET ──→ 各雲端服務
                        ↘ 寫入 KV
Pages 儀表板 ── GET /api/status ──→ Worker ──→ 讀取 KV
```

## 部署端點

| 資源 | 網址 |
|------|------|
| Worker API | `https://cloud-services-monitor.mimas9107a.workers.dev` |
| 儀表板 UI | `https://cloud-services-dashboard.pages.dev` |

### API

| 方法 | 路徑 | 說明 |
|------|------|------|
| `GET` | `/api/status` | 讀取 KV 快取（毫秒級） |
| `GET` | `/api/trigger` | 即時探測所有服務並更新 KV |

## 目錄

```
cloud-portal/
├── src/               # Worker 原始碼
│   ├── index.js       # 入口（路由 + Cron 排程）
│   ├── config.js      # 受監控服務清單
│   └── utils.js       # 探測邏輯（AbortController 10s 超時）
├── dashboard/         # 儀表板前端（Cloudflare Pages）
│   ├── index.html
│   ├── style.css      # 暗色玻璃擬態
│   └── app.js         # 呼叫 Worker API 並渲染
├── wrangler.toml      # KV binding + Cron triggers
├── package.json
├── .env.example
└── scripts/deploy.sh
```

## 前置需求

- Node.js >= 18
- Cloudflare 帳號（免費方案即可）
- 目標服務須為公開 HTTP 端點

## 開始使用

```bash
# 安裝
npm install

# 設定環境變數
cp .env.example .env
# 填入 CLOUDFLARE_API_TOKEN, CLOUDFLARE_ACCOUNT_ID, KV_NAMESPACE_ID

# 本地開發測試
npm run dev

# 部署至 Cloudflare
npm run deploy        # Worker
npm run publish:dashboard  # 儀表板
```

## 設定監控服務

編輯 `src/config.js`：

```js
export const SERVICES = [
  {
    id: "my-service",
    name: "我的服務",
    platform: "Render.com",   // Render.com / Vercel / Cloudflare
    url: "https://...",
    type: "web"                // web / bot / api / keep-alive
  },
];
```

## 相關文件

| 文件 | 說明 |
|------|------|
| [QUICKSTART.md](QUICKSTART.md) | 新手逐步部署手冊 |
| [SPEC.md](SPEC.md) | 技術規格書 |
| [PLAN.md](PLAN.md) | 實作計畫 |
| [TASK.md](TASK.md) | 工作任務清單 |
| [CHANGELOG.md](CHANGELOG.md) | 版本紀錄 |
| [MEMOIR.md](MEMOIR.md) | 開發備忘錄 |
