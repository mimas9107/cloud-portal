const WORKER_URL = "https://cloud-services-monitor.mimas9107a.workers.dev";

async function fetchStatus() {
  try {
    const response = await fetch(`${WORKER_URL}/api/status`);
    if (!response.ok) throw new Error("API 異常");
    const payload = await response.json();
    renderDashboard(payload);
  } catch (err) {
    document.getElementById('status-meta').innerText = "獲取狀態失敗";
    document.getElementById('loader').innerText = "無法載入狀態快取，請確認 Worker 與 KV 是否正常配置。";
  }
}

async function triggerProbe() {
  const btn = document.getElementById('btn-refresh');
  const meta = document.getElementById('status-meta');
  btn.disabled = true;
  btn.innerText = "探測中...";
  meta.innerText = "正在向各雲端平台發送探測與喚醒請求，請稍候...";

  try {
    const response = await fetch(`${WORKER_URL}/api/trigger`);
    if (!response.ok) throw new Error("觸發失敗");
    const payload = await response.json();
    renderDashboard(payload);
  } catch (err) {
    meta.innerText = "手動探測失敗";
  } finally {
    btn.disabled = false;
    btn.innerText = "立即檢測";
  }
}

function renderDashboard(payload) {
  const loader = document.getElementById('loader');
  if (loader) loader.style.display = 'none';

  if (payload.lastUpdated) {
    const date = new Date(payload.lastUpdated);
    document.getElementById('status-meta').innerText = `最後更新時間：${date.toLocaleTimeString()}`;
  } else {
    document.getElementById('status-meta').innerText = "尚未有更新紀錄";
  }

  const grids = {
    "Render.com": document.getElementById('grid-render'),
    "Vercel": document.getElementById('grid-vercel'),
    "Cloudflare": document.getElementById('grid-cloudflare')
  };

  Object.values(grids).forEach(g => g.innerHTML = "");

  if (!payload.devices || payload.devices.length === 0) {
    Object.values(grids).forEach(g => g.innerHTML = "<div class='loading-text'>尚無資料，請點擊立即檢測。</div>");
    return;
  }

  payload.devices.forEach(dev => {
    const card = document.createElement('a');
    card.href = dev.url;
    card.target = "_blank";
    card.className = `card ${dev.status}`;

    const isOnline = dev.status === "online";
    const metaText = isOnline ? `反應時間: ${dev.latency}ms` : `原因: ${dev.reason || 'HTTP ' + dev.statusCode}`;

    card.innerHTML = `
      <div class="card-header">
        <div class="info-group">
          <span class="device-name">${dev.name}</span>
          <span class="device-platform">${dev.type.toUpperCase()}</span>
        </div>
        <span class="status-badge">${dev.status}</span>
      </div>
      <div class="card-footer">
        <span>網址: 連結</span>
        <span class="latency">${metaText}</span>
      </div>
    `;

    if (grids[dev.platform]) {
      grids[dev.platform].appendChild(card);
    }
  });
}

document.addEventListener('DOMContentLoaded', fetchStatus);
