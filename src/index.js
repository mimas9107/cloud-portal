import { SERVICES } from "./config.js";
import { probeService } from "./utils.js";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

async function probeAll(env) {
  const results = await Promise.all(SERVICES.map(probeService));
  const payload = {
    lastUpdated: new Date().toISOString(),
    devices: results
  };
  await env.PORTAL_KV.put("cloud_services_status", JSON.stringify(payload));
  return payload;
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    if (url.pathname === "/api/status" && request.method === "GET") {
      const cachedData = await env.PORTAL_KV.get("cloud_services_status");
      return new Response(cachedData || JSON.stringify({ devices: [], lastUpdated: null }), {
        status: 200,
        headers: { "Content-Type": "application/json; charset=utf-8", ...corsHeaders }
      });
    }

    if (url.pathname === "/api/trigger" && request.method === "GET") {
      const payload = await probeAll(env);
      return new Response(JSON.stringify(payload), {
        status: 200,
        headers: { "Content-Type": "application/json; charset=utf-8", ...corsHeaders }
      });
    }

    return new Response(JSON.stringify({ error: "Not Found" }), {
      status: 404,
      headers: corsHeaders
    });
  },

  async scheduled(event, env, ctx) {
    ctx.waitUntil(probeAll(env));
  }
};
