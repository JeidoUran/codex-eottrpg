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

async function fetchAllCharacters() {
  let page = 1;
  const size = 50;
  const all = [];

  while (true) {
    const url = `${API_BASE}/characters?campaign_id=${CAMPAIGN_ID}&with_links=true&page=${page}&size=${size}`;
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

async function uploadCharacter(charData) {
  const slug = slugify(charData.character_name);
  const key = `data/archivist/characters/${slug}.json`;

  const payload = {
    id: charData.id,
    name: charData.character_name,
    type: charData.type,
    player: charData.player_name ?? null,
    image: charData.image ?? null,
    description: charData.description ?? "",
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

  return { slug, key };
}

export const handler = async () => {
  try {
    const characters = await fetchAllCharacters();

    const results = [];
    for (const c of characters) {
      // optionnel : skip non-approved
      if (!c.approved) continue;

      const res = await uploadCharacter(c);
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
