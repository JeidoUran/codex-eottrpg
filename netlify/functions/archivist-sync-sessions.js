// netlify/functions/archivist-sync-characters.js
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
const CAMPAIGN_ID = process.env.ARCHIVIST_CAMPAIGN_ID;
const API_KEY = process.env.ARCHIVIST_API_KEY;

// même logique que ton slugify Codex
function slugify(str) {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // accents → ascii
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function fetchAllSessions() {
  let page = 1;
  const size = 50;
  const all = [];

  while (true) {
    const url = `${API_BASE}/sessions?campaign_id=${CAMPAIGN_ID}&with_links=true&page=${page}&size=${size}`;
    const res = await fetch(url, {
      headers: { "x-api-key": API_KEY },
    });

    if (!res.ok) {
      throw new Error(`Archivist error ${res.status}: ${await res.text()}`);
    }

    const json = await res.json();
    all.push(...json.data);

    if (page >= json.pages) break;
    page++;
  }

  return all;
}

async function uploadSession(sessionData) {
  const slug = slugify(sessionData.title);
  const key = `data/archivist/sessions/${sessionData.id}-${slug}.json`;

  const payload = {
    id: sessionData.id,
    title: sessionData.title,
    type: sessionData.type,
    session_date: sessionData.session_date ?? null,
    summary: sessionData.summary ?? "",
    public: sessionData.public,
    pending: sessionData.pending,
  };

  const sessions = await fetchAllSessions();
  const index = {
    campaign_id: CAMPAIGN_ID,
    updated_at: new Date().toISOString(),
    total: sessions.length,
    sessions: sessions
      .map((s) => ({
        id: s.id,
        title: s.title || s.label,
        index: s.index,
        date: s.session_date,
      }))
      .sort((a, b) => {
        if (!a.date && !b.date) return 0;
        if (!a.date) return 1;
        if (!b.date) return -1;
        return new Date(b.date) - new Date(a.date);
      }),
  };

  await s3
    .putObject({
      Bucket: BUCKET,
      Key: key,
      Body: JSON.stringify(payload, null, 2),
      ContentType: "application/json; charset=utf-8",
      ACL: "public-read",
    })
    .promise();

  await s3
    .putObject({
      Bucket: BUCKET,
      Key: "data/archivist/sessions/index.json",
      Body: JSON.stringify(index, null, 2),
      ContentType: "application/json; charset=utf-8",
      CacheControl: "public, max-age=300",
    })
    .promise();

  return { slug, key };
}

export const handler = async () => {
  try {
    const sessions = await fetchAllSessions();

    const results = [];
    for (const s of sessions) {
      // optionnel : skip pending
      if (s.pending) continue;

      const res = await uploadSession(s);
      results.push(res);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        updated: results.length,
        files: results,
      }),
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
