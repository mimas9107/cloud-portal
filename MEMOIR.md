---
name:          "MEMOIR.md"
description:   "開發備忘錄 — 架構決策與技術記錄"
created_date:  "2026/05/22 10:00:00"
modified_date: "2026/05/22 15:00:00"
project_version: "0.2.0"
document_version: "1.1.0"
agent_sign: ['human/name','opencode/deepseek-v4-flash-free']
---

# 開發備忘錄

## 架構決策記錄

### 2026-05-22：專案初始化

#### 決策 1：選擇 Cloudflare Workers 而非傳統 VPS 作為探測引擎
- **理由**：目標服務皆為公網端點，不需要本地探測。Workers 的 Cron Trigger 可在邊緣直接發起 fetch，延遲低、免維護、完全 Serverless。
- **替代方案**：Render.com 本身可設 Keep-Alive 服務，但與監控儀表板分離，需要額外服務。
- **結論**：採用 Workers 雙效合一方案。

#### 決策 2：使用 KV 而非 D1 或 R2 作為狀態儲存
- **理由**：每次探測僅產生約 1KB JSON 資料，KV 讀取延遲 < 10ms、寫入簡單、不須 SQL schema。D1 對這種單一 Key 場景過重。
- **限制**：KV 的 eventual consistency 在讀取快取場景是可以接受的。

#### 決策 3：前端採用 Cloudflare Pages（靜態網頁）而非 Worker 渲染
- **理由**：Pages 免費額度充足、可直接托管靜態資源、支援自訂網域。儀表板無後端渲染需求，所有資料來自 Worker API。

#### 決策 4：Promise.all 併發探測而非序列探測
- **理由**：6 個服務 × 10 秒 = 序列需 60 秒，Workers 的 CPU 時間限制為 30ms 免費 / 30s 付費。併發可將總時間壓在 10 秒內。

### 2026-05-22：實際部署觀察

#### 觀察 1：Dashboard 建立 Worker 導致 KV binding 衝突
- 先在 Dashboard 手動建立 Worker 並設定了佔位符 KV binding 後，再用 `wrangler deploy` 會發生衝突。
- **解法**：`wrangler delete` 刪除 Worker 再重新部署即可。

#### 觀察 2：compatibility_date 差異
- `compatibility_date` 設為今日日期（`2026-05-22`）在正式部署時沒問題，但本機 dev 環境的 miniflare 二進位檔可能不支援未來日期。
- 若遇到 `requires compatibility date ... but the newest date supported by this server binary is ...` 錯誤，降低日期即可。
- 正式部署時，Cloudflare 的 Workers runtime 接受最新的日期。

#### 觀察 3：Pages 部署需要先建立專案
- `wrangler pages deploy` 不會自動建立 Pages project，需先用 `wrangler pages project create` 建立。
- 也可以直接上傳 Dashboard 手動建立。

## 已知注意事項

1. Render.com 免費版服務閒置 15 分鐘後 spin down，首次 Cold Start 約 30 秒。Cron 每 10 分鐘探測可確保永不休眠。
2. KV 寫入次數受免費方案限制（每日 1000 次讀 / 1000 次寫）。每 10 分鐘 1 次寫入 = 144 次/日，應在額度內。
3. Worker 對外 fetch 有 1000 次/日的免費限制。6 個服務 × 144 次 = 864 次/日，接近但仍在額度內。超量後會回傳錯誤，需注意。
4. `src/config.js` 中的 URL 必須是公開 HTTP 端點，Worker 無法存取私有網路。

## 實際部署端點

| 資源 | 網址 |
|------|------|
| Worker API | `https://cloud-services-monitor.mimas9107a.workers.dev` |
| Pages 儀表板 | `https://cloud-services-dashboard.pages.dev` |

## 未來優化方向

- [ ] 加入 Slack / Telegram 通知（當服務狀態變更時）
- [ ] 歷史延遲趨勢圖（使用 D1 或 Analytics Engine）
- [ ] 多區域探測（多個 Worker 跨區並比對結果）
