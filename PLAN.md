---
name:          "PLAN.md"
description:   "多雲端服務狀態儀表板 — 實作計畫書"
created_date:  "2026/05/22 10:00:00"
modified_date: "2026/05/22 10:00:00"
project_version: "0.1.0"
document_version: "1.0.0"
agent_sign: ['human/name','opencode/deepseek-v4-flash-free']
---

# 實作計畫書

## 階段劃分

### Phase 0：專案初始化（預計 1 日）
- [x] 審閱提案文件
- [x] 規劃專案目錄結構
- [x] 產生 SPEC.md、PLAN.md、TASK.md、CHANGELOG.md、README.md、MEMOIR.md
- [x] 設定版本同步機制

### Phase 1：核心 Worker 開發（預計 2 日）
- [ ] 實作 `src/config.js` — 服務清單設定檔
- [ ] 實作 `src/utils.js` — 探測工具函式（含超時控制）
- [ ] 實作 `src/index.js` — Worker 主程式（`fetch` + `scheduled` 路由）
- [ ] 撰寫 `wrangler.toml` 設定檔

### Phase 2：儀表板前端開發（預計 2 日）
- [ ] 實作 `dashboard/style.css` — 暗色玻璃擬態樣式
- [ ] 實作 `dashboard/app.js` — 前端狀態擷取與渲染邏輯
- [ ] 實作 `dashboard/index.html` — 儀表板結構

### Phase 3：部署腳本與設定（預計 1 日）
- [ ] 撰寫 `scripts/deploy.sh` — 一鍵部署腳本
- [ ] 設定 `package.json` — npm scripts
- [ ] 建立 `.env.example` 與 `.gitignore`

### Phase 4：測試與驗證（預計 1 日）
- [ ] 本地 Wrangler dev 測試
- [ ] 部署至 Cloudflare 測試帳號
- [ ] 驗證 KV 讀寫與 Cron 觸發

### Phase 5：文件完善與版本鎖定（預計 1 日）
- [ ] 更新 CHANGELOG.md
- [ ] 補齊 MEMOIR.md 開發紀錄
- [ ] 執行版本同步檢查

## 相依性圖

```
Phase 0 → Phase 1 → Phase 2 → Phase 3 → Phase 4 → Phase 5
                ↘          ↗
            (Worker API  決定前端資料格式)
```

## 風險評估

| 風險 | 影響 | 緩解措施 |
|------|------|----------|
| Render.com URL 格式變更 | 探測失敗 | 抽離 URL 至 config.js，更新不需改程式碼 |
| Cloudflare KV 免費額度超限 | 寫入失敗 | 設定合理 Cron 間隔（10 分鐘），單一 Key 控制大小 |
| Worker CPU 時間超限 | 探測中斷 | 使用 Promise.all 併發 + 10 秒超時限制 |
