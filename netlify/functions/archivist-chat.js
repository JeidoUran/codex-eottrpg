const ARCHIVIST_CHAT_URL = "https://api.myarchivist.ai/v1/ask";
const ARCHIVIST_API_KEY = process.env.ARCHIVIST_API_KEY;
const ARCHIVIST_CAMPAIGN_ID = process.env.ARCHIVIST_CAMPAIGN_ID;

export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  if (!ARCHIVIST_API_KEY || !ARCHIVIST_CAMPAIGN_ID) {
    return {
      statusCode: 500,
      body: "Missing ARCHIVIST_API_KEY or ARCHIVIST_CAMPAIGN_ID",
    };
  }

  let payload;
  try {
    payload = JSON.parse(event.body || "{}");
  } catch {
    return { statusCode: 400, body: "Invalid JSON" };
  }

  // 🔑 Injection automatique de la campagne
  payload.campaign_id = ARCHIVIST_CAMPAIGN_ID;

  try {
    const upstream = await fetch(ARCHIVIST_CHAT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${ARCHIVIST_API_KEY}`,
      },
      body: JSON.stringify(payload),
    });

    const contentType =
      upstream.headers.get("content-type") || "text/plain; charset=utf-8";

    if (!upstream.body) {
      const txt = await upstream.text();
      return {
        statusCode: upstream.status,
        headers: { "Content-Type": contentType, "Cache-Control": "no-store" },
        body: txt,
      };
    }

    const streamify = globalThis?.awslambda?.streamifyResponse;
    if (!streamify) {
      const txt = await upstream.text();
      return {
        statusCode: upstream.status,
        headers: { "Content-Type": contentType, "Cache-Control": "no-store" },
        body: txt,
      };
    }

    return streamify(async (responseStream) => {
      responseStream.setStatusCode(upstream.status);
      responseStream.setHeader("Content-Type", contentType);
      responseStream.setHeader("Cache-Control", "no-store");

      const reader = upstream.body.getReader();
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        responseStream.write(value);
      }
      responseStream.end();
    });
  } catch (err) {
    return {
      statusCode: 500,
      body: `Proxy error: ${err?.message || err}`,
    };
  }
}
