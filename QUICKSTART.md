---
name:          "QUICKSTART.md"
description:   "新手部署設定手冊 — 從零開始部署多雲端服務監控儀表板"
created_date:  "2026/05/22 15:00:00"
modified_date: "2026/05/22 15:00:00"
project_version: "0.2.0"
document_version: "1.0.0"
agent_sign: ['human/name','opencode/deepseek-v4-flash-free']
---

# 新手部署設定手冊

本文件引導您從零開始，將此專案部署至 Cloudflare Edge。

---

## 目錄

1. [事前準備](#1-事前準備)
2. [Cloudflare 端設定](#2-cloudflare-端設定)
3. [專案設定](#3-專案設定)
4. [設定目標服務](#4-設定目標服務)
5. [部署 Worker](#5-部署-worker)
6. [部署儀表板](#6-部署儀表板)
7. [驗收測試](#7-驗收測試)
8. [故障排除](#8-故障排除)

---

## 1. 事前準備

### 需要的東西
- **Cloudflare 帳號**（免費版即可）：[註冊](https://dash.cloudflare.com/sign-up)
- **Node.js >= 18**：安裝方法見 [nodejs.org](https://nodejs.org/)
- **Cloudflare API Token**（見步驟 2.3）
- 要監控的服務**公開 HTTP 網址**

### 檢查 Node.js 版本
```bash
node -v
# 應顯示 v18.0.0 或更高
```

---

## 2. Cloudflare 端設定

### 2.1 登入 Cloudflare Dashboard
前往 [dash.cloudflare.com](https://dash.cloudflare.com) 並登入。

### 2.2 取得 Account ID
- 在 Dashboard 右側資訊欄或瀏覽器網址列中找到 **Account ID**
- 它是 32 字元的十六進位字串（例如 `15200a701************0413`）
- **複製下來備用**

### 2.3 建立 API Token
1. 右上角頭像 → **My Profile** → **API Tokens**
2. 點 **Create Token**
3. 找到 **Edit Cloudflare Workers** 範本，點右側 **Use template**
4. 此範本已包含 Workers 和 KV 的 Edit 權限
5. 捲到頁面底部，點 **Continue to Summary** → **Create Token**
6. **立即複製 Token**（只顯示一次，遺失需重新建立）

### 2.4 建立 KV Namespace
1. 左側選單 → **Workers & Pages** → **KV**
2. 點 **Create namespace**
3. 名稱輸入 `PORTAL_KV` → 建立
4. 建立後列表會顯示 **Namespace ID**（32 字元十六進位字串）
5. **複製這個 ID 備用**

### 2.5 （可選）建立 Pages 專案
> 部署儀表板時 `wrangler` 會自動建立，可先略過此步驟。

---

## 3. 專案設定

### 3.1 取得專案程式碼
```bash
git clone <your-repo-url> cloud-portal
cd cloud-portal
```

### 3.2 安裝相依套件
```bash
npm install
```

### 3.3 設定環境變數
```bash
cp .env.example .env
```

編輯 `.env` 檔案，填入剛剛取得的資訊：

```ini
CLOUDFLARE_API_TOKEN=cfut_你的API_TOKEN
CLOUDFLARE_ACCOUNT_ID=你的Account_ID
KV_NAMESPACE_ID=你的KV_Namespace_ID
WORKER_NAME=cloud-services-monitor
DASHBOARD_URL=https://cloud-services-monitor.你的子域.workers.dev
```

> `DASHBOARD_URL` 中的「你的子域」是 Cloudflare 帳號自動產生的子域（可在 Workers 頁面頂端看到，例如 `<YOUR_SUBDOMAIN>`）。

### 3.4 驗證連線
```bash
npx wrangler whoami
```
應顯示您的 Cloudflare 帳號資訊。如果失敗，請檢查 API Token 權限。

---

## 4. 設定目標服務

編輯 `src/config.js`，填入您要監控的服務：

```js
export const SERVICES = [
  {
    id: "my-app",             // 唯一識別碼（英文）
    name: "我的應用",          // 顯示名稱（可中文）
    platform: "Render.com",   // 平台分類（Render.com / Vercel / Cloudflare）
    url: "https://my-app.onrender.com/health",  // 服務網址
    type: "web"               // 類型（web / bot / api / keep-alive）
  },
  // 加入更多服務...
];
```

**欄位說明：**

| 欄位 | 必填 | 說明 |
|------|------|------|
| `id` | ✅ | 英文唯一識別碼，用於內部識別 |
| `name` | ✅ | 顯示在儀表板上的名稱 |
| `platform` | ✅ | 用於儀表板分區顯示，必須是 Render.com / Vercel / Cloudflare 之一 |
| `url` | ✅ | 服務的公開 HTTP/HTTPS 網址 |
| `type` | ✅ | web / bot / api / keep-alive |

---

## 5. 部署 Worker

### 5.1 本地測試（建議先執行）
```bash
npm run dev
```
- 啟動後訪問 `http://localhost:8787/api/status` 確認回傳 JSON
- 訪問 `http://localhost:8787/api/trigger` 手動觸發探測
- 按 `Ctrl+C` 停止

### 5.2 部署至 Cloudflare
```bash
npm run deploy
```
成功後會顯示：
```
Uploaded cloud-services-monitor (1.82 sec)
Deployed cloud-services-monitor triggers (1.31 sec)
  https://cloud-services-monitor.你的子域.workers.dev
  schedule: */10 * * * *
```

### 5.3 驗證 Worker
```bash
curl https://cloud-services-monitor.你的子域.workers.dev/api/status
curl https://cloud-services-monitor.你的子域.workers.dev/api/trigger
```

---

## 6. 部署儀表板

### 6.1 確認 Worker URL 設定
開啟 `dashboard/app.js`，確認第 1 行的 `WORKER_URL` 指向您的 Worker：

```js
const WORKER_URL = "https://cloud-services-monitor.你的子域.workers.dev";
```

### 6.2 部署至 Cloudflare Pages

**方法一：用 wrangler（推薦）**
```bash
npx wrangler pages project create cloud-services-dashboard --production-branch=main
npx wrangler pages deploy ./dashboard --project-name=cloud-services-dashboard
```

**方法二：手動上傳**
1. Workers & Pages → **Create application** → **Pages**
2. **Upload assets** → 選擇 `dashboard/` 資料夾
3. 專案名稱輸入 `cloud-services-dashboard`
4. 部署完成

### 6.3 驗證儀表板
用瀏覽器開啟 `https://cloud-services-dashboard.pages.dev`，應看到：
- 標題「雲端服務整合儀表板」
- 三區分類（Render.com / Vercel / Cloudflare）
- 綠色 `ONLINE` 徽章的服務卡片

---

## 7. 驗收測試

### 7.1 API 測試
```bash
# 狀態查詢（讀取快取）
curl -s https://cloud-services-monitor.你的子域.workers.dev/api/status

# 手動探測（即時檢測）
curl -s https://cloud-services-monitor.你的子域.workers.dev/api/trigger
```

### 7.2 檢查 Cron 定時器
```bash
npx wrangler triggers
```
應顯示 `schedule: */10 * * * *`，表示每 10 分鐘自動探測。

### 7.3 端到端確認清單
- [ ] Worker API 回傳 JSON 格式正確
- [ ] `/api/trigger` 所有服務狀態非 `offline`
- [ ] 儀表板可正常載入並顯示服務狀態
- [ ] 點擊服務卡片可跳轉至目標網址
- [ ] 「立即檢測」按鈕功能正常

---

## 8. 故障排除

### Worker 部署失敗
```
KV namespace '<xxx>' is not valid.
```
**原因**：`wrangler.toml` 中的 KV namespace ID 與 Cloudflare 上的實際 ID 不符。
**解法**：比對 `wrangler.toml` 和 Cloudflare Dashboard KV 頁面上的 ID 是否一致。

### 本地 dev 啟動失敗
```
This Worker requires compatibility date "2026-05-22",
but the newest date supported by this server binary is "2026-05-03".
```
**原因**：`wrangler.toml` 中的 `compatibility_date` 超過本機 miniflare 支援範圍。
**解法**：將日期改為較早的版本（如 `2026-05-03`），或更新 wrangler 版本。

### 服務顯示 offline
```
status: "offline", reason: "Timeout (10s)"
```
**原因**：目標服務在 10 秒內無回應。
**解法**：
1. 確認該服務 URL 是否可從公網訪問
2. 檢查服務是否正在執行（特別是 Render.com 免費版可能需要首次請求喚醒）
3. 可多次觸發 `/api/trigger` 嘗試喚醒

### Pages 部署失敗
```
Project not found.
```
**原因**：Pages 專案尚未建立。
**解法**：先用 `npx wrangler pages project create` 建立專案。

### Token 驗證失敗
```
wrangler whoami 顯示未登入
```
**解法**：
1. 確認 `.env` 中的 `CLOUDFLARE_API_TOKEN` 正確
2. 確認 Token 權限包含 Workers: Edit 和 KV: Edit
3. 測試：`curl -H "Authorization: Bearer 你的TOKEN" https://api.cloudflare.com/client/v4/user/tokens/verify`
