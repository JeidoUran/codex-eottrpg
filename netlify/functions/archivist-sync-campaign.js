// netlify/functions/archivist-sync-campaign.js
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

async function fetchCampaign() {
  const url = `${API_BASE}/campaigns/${CAMPAIGN_ID}`;
  const res = await fetch(url, { headers: { "x-api-key": API_KEY } });

  if (!res.ok) {
    throw new Error(`Archivist error ${res.status}: ${await res.text()}`);
  }

  const json = await res.json();

  // Selon l'API Archivist, c'est souvent { data: {...} } ici
  const campaign = json?.data ?? json;

  if (!campaign || typeof campaign !== "object") {
    throw new Error(
      "Unexpected Archivist response shape for campaign endpoint."
    );
  }

  return campaign;
}

async function uploadCampaign(campaignData) {
  const key = `data/archivist/campaign/campaign.json`;

  const payload = {
    id: campaignData.id,
    title: campaignData.title,
    system: campaignData.system,
    language: campaignData.language,
    image: campaignData.image,
    summary: campaignData.summary ?? "",
    description: campaignData.description,
    created_at: campaignData.created_at,
    owner_id: campaignData.owner_id,
    players: campaignData.players,
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

  return { key };
}

export const handler = async () => {
  try {
    const campaign = await fetchCampaign();

    // optionnel : skip archived
    if (campaign.archived) {
      return {
        statusCode: 200,
        body: JSON.stringify({ updated: 0, skipped: "archived" }),
      };
    }

    const file = await uploadCampaign(campaign);

    return {
      statusCode: 200,
      body: JSON.stringify({
        updated: 1,
        file,
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
