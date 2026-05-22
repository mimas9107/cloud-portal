export async function probeService(service) {
  const startTime = Date.now();
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(service.url, {
      method: "GET",
      headers: {
        "User-Agent": "Cloudflare-Service-Monitor/1.0",
        "Cache-Control": "no-cache"
      },
      signal: controller.signal
    });

    clearTimeout(timeoutId);
    const latency = Date.now() - startTime;

    return {
      id: service.id,
      name: service.name,
      platform: service.platform,
      url: service.url,
      type: service.type,
      status: response.ok ? "online" : "degraded",
      statusCode: response.status,
      latency: latency,
      lastChecked: new Date().toISOString()
    };
  } catch (error) {
    return {
      id: service.id,
      name: service.name,
      platform: service.platform,
      url: service.url,
      type: service.type,
      status: "offline",
      statusCode: 0,
      latency: Date.now() - startTime,
      reason: error.name === "AbortError" ? "Timeout (10s)" : error.message,
      lastChecked: new Date().toISOString()
    };
  }
}
