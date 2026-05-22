export const SERVICES = [
  {
    id: "viewpoints",
    name: "Viewpoints監視器牆",
    platform: "Render.com",
    url: "https://<service_name>.onrender.com/index.html",
    type: "web"
  },
  {
    id: "mytelebot",
    name: "My Telegram Bot",
    platform: "Render.com",
    url: "https://<service_name>.onrender.com/api/health",
    type: "bot"
  },
  {
    id: "linebot-rev",
    name: "LINEBOT-REV 機器人",
    platform: "Render.com",
    url: "https://<service_name>.onrender.com/health",
    type: "bot"
  },
  {
    id: "mock-target",
    name: "Mock Target 模擬端點",
    platform: "Render.com",
    url: "https://<service_name>.onrender.com/_mock/ping",
    type: "api"
  },
  {
    id: "vercel-keepalive",
    name: "Vercel Keep-Alive 服務",
    platform: "Vercel",
    url: "https://<service_name>.vercel.app/api/ping",
    type: "keep-alive"
  },
  {
    id: "cloudflare-keepalive",
    name: "Cloudflare Keep-Alive Worker",
    platform: "Cloudflare",
    url: "https://<service_name>.workers.dev/",
    type: "keep-alive"
  }
];
