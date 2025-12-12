// netlify/functions/archivist-sync-moments.js
const AWS = require("aws-sdk");

const API_BASE = "https://api.myarchivist.ai/v1";

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_KEY,
  secretAccessKey: process.env.AWS_SECRET,
  region: "auto",
  endpoint: process.env.S3_ENDPOINT,
  s3ForcePathStyle: true,
  signatureVersion: "v4",
});

const BUCKET = process.env.S3_BUCKET_NAME;

exports.handler = async function () {
  try {
    const API_KEY = process.env.ARCHIVIST_API_KEY;
    const CAMPAIGN_ID = process.env.ARCHIVIST_CAMPAIGN_ID;

    if (!API_KEY) return { statusCode: 500, body: "Missing ARCHIVIST_API_KEY" };
    if (!CAMPAIGN_ID)
      return { statusCode: 500, body: "Missing ARCHIVIST_CAMPAIGN_ID" };
    if (!BUCKET) return { statusCode: 500, body: "Missing S3_BUCKET_NAME" };

    // 1) récupérer la liste paginée des moments
    let page = 1;
    const size = 100;
    let pages = 1;
    const list = [];

    while (page <= pages) {
      const url = `${API_BASE}/moments?campaign_id=${encodeURIComponent(CAMPAIGN_ID)}&page=${page}&size=${size}&with_links=true`;
      const r = await fetch(url, { headers: { "x-api-key": API_KEY } });

      if (!r.ok) {
        const txt = await r.text();
        return { statusCode: r.status, body: txt };
      }

      const json = await r.json();
      list.push(...(json.data || []));
      pages = json.pages || 1;
      page += 1;
    }

    // 2) récupérer les détails (content + categories + session_id)
    // petit throttle simple pour pas spam l’API (batch de 10)
    const details = [];
    const batchSize = 10;

    for (let i = 0; i < list.length; i += batchSize) {
      const batch = list.slice(i, i + batchSize);

      const batchResults = await Promise.all(
        batch.map(async (m) => {
          const r = await fetch(`${API_BASE}/moments/${m.id}?with_links=true`, {
            headers: { "x-api-key": API_KEY },
          });

          if (!r.ok) return null;
          return await r.json();
        })
      );

      details.push(...batchResults.filter(Boolean));
    }

    // 3) construire l’index final
    const payload = {
      campaign_id: CAMPAIGN_ID,
      updated_at: new Date().toISOString(),
      total: details.length,
      moments: details.sort((a, b) => (a.index ?? 0) - (b.index ?? 0)),
    };

    const key = "data/archivist/moments/index.json";

    await s3
      .putObject({
        Bucket: BUCKET,
        Key: key,
        Body: JSON.stringify(payload, null, 2),
        ContentType: "application/json; charset=utf-8",
        CacheControl: "public, max-age=300",
      })
      .promise();

    return {
      statusCode: 200,
      body: JSON.stringify({ ok: true, key, total: payload.total }),
    };
  } catch (err) {
    return { statusCode: 500, body: String(err?.message || err) };
  }
};
