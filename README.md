---
name:          "README.md"
description:   "Cloudflare 邊緣部署：多雲端服務狀態與 Keep-Alive 整合儀表板"
created_date:  "2026/05/22 10:00:00"
modified_date: "2026/05/22 15:00:00"
project_version: "0.2.0"
document_version: "1.1.0"
agent_sign: ['human/name','opencode/deepseek-v4-flash-free']
---

# Cloudflare 邊緣部署：多雲端服務狀態與 Keep-Alive 整合儀表板

基於 **Cloudflare Workers + KV + Cron Trigger + Pages**，對散落在 Render.com、Vercel、Cloudflare 等平台的服務進行定時探測與心跳保持，並以玻璃擬態儀表板呈現即時狀態。

## 已部署端點

| 服務 | 網址 |
|------|------|
| Worker API | `https://cloud-services-monitor.mimas9107a.workers.dev` |
| 儀表板 UI | `https://cloud-services-dashboard.pages.dev` |

### Worker API 路由
| 方法 | 路徑 | 說明 |
|------|------|------|
| `GET` | `/api/status` | 讀取 KV 快取的服務狀態 |
| `GET` | `/api/trigger` | 手動觸發即時探測 |

## 架構概覽

```
Cron (每10分鐘) → Worker → HTTPS GET → 各雲端服務
                      ↘ 寫入 KV
儀表板 (Pages) → GET /api/status ← Worker ← 讀取 KV
```

## 目錄結構

```
cloud-portal/
├── src/               # Worker 原始碼
│   ├── index.js       # 入口 (fetch + scheduled)
│   ├── config.js      # 服務清單設定
│   └── utils.js       # 探測工具
├── dashboard/         # 前端儀表板
│   ├── index.html
│   ├── style.css
│   └── app.js
├── scripts/           # 部署腳本
├── wrangler.toml      # Cloudflare 設定
└── package.json
```

## 快速開始

```bash
# 1. 安裝相依
npm install

# 2. 複製環境變數並編輯
cp .env.example .env
# 填入：CLOUDFLARE_API_TOKEN, CLOUDFLARE_ACCOUNT_ID, KV_NAMESPACE_ID

# 3. 本地開發測試
npm run dev

# 4. 部署至 Cloudflare
npm run deploy
npm run publish:dashboard
```

## 設定方法

編輯 `src/config.js`，加入您要監控的服務：

```js
export const SERVICES = [
  {
    id: "my-service",
    name: "我的服務",
    platform: "Render.com",
    url: "https://my-service.onrender.com",
    type: "web"
  },
];
```

## 必要條件

- Node.js >= 18
- Wrangler CLI（專案已內含，無需全域安裝）
- Cloudflare 帳號（Workers + KV + Pages）
- 目標服務須為公開 HTTP 端點

## 相關文件

| 文件 | 說明 |
|------|------|
| [QUICKSTART.md](QUICKSTART.md) | 🆕 新手部署設定手冊 |
| [SPEC.md](SPEC.md) | 技術規格書 |
| [PLAN.md](PLAN.md) | 實作計畫書 |
| [TASK.md](TASK.md) | 工作任務清單 |
| [CHANGELOG.md](CHANGELOG.md) | 版本變更紀錄 |
| [MEMOIR.md](MEMOIR.md) | 開發備忘錄 |
