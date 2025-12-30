// netlify/functions/archivist-chat.js
const ARCHIVIST_CHAT_URL = "https://api.myarchivist.ai/v1/ask";

exports.handler = async function (event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const ARCHIVIST_API_KEY = process.env.ARCHIVIST_API_KEY;
  const ARCHIVIST_CAMPAIGN_ID = process.env.ARCHIVIST_CAMPAIGN_ID;

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

  // Injection campagne côté serveur
  payload.campaign_id = ARCHIVIST_CAMPAIGN_ID;

  try {
    const upstream = await fetch(ARCHIVIST_CHAT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${ARCHIVIST_API_KEY}`,
        "x-api-key": ARCHIVIST_API_KEY,
      },
      body: JSON.stringify(payload),
    });

    const contentType =
      upstream.headers.get("content-type") || "text/plain; charset=utf-8";

    const text = await upstream.text(); // bufferise (robuste)

    return {
      statusCode: upstream.status,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "no-store",
      },
      body: text,
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: `Proxy error: ${err?.message || err}`,
    };
  }
};
