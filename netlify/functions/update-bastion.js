const AWS = require("aws-sdk");

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_KEY,
  secretAccessKey: process.env.AWS_SECRET,
  endpoint: process.env.S3_ENDPOINT,
  region: "auto",
  signatureVersion: "v4",
});

exports.handler = async function () {
  const CLIENT_ID = process.env.FOUNDRY_CLIENT_ID;
  const UUID = "Actor.UAdz0mRoW741ZAzx";
  const API_KEY = process.env.FOUNDRY_API_KEY;
  const BUCKET_NAME = process.env.S3_BUCKET_NAME;

  const url = `https://api.codex.memiroa.com/get?clientId=${CLIENT_ID}&uuid=${UUID}`;

  try {
    const response = await fetch(url, {
      headers: { "x-api-key": API_KEY },
    });

    const data = await response.json();

    // 🔒 Sécurité : si l'API retourne une erreur, on ne touche pas au fichier
    if (data && typeof data === "object" && "error" in data) {
      console.error("Erreur API Foundry :", data.error);

      return {
        statusCode: 503,
        body: JSON.stringify({
          error: "API error: JSON not uploaded",
          message: data.error,
        }),
      };
    }

    // Sinon, upload classique
    data._codexLastUpdate = new Date().toISOString();

    await s3
      .putObject({
        Bucket: BUCKET_NAME,
        Key: "data/characters/bastion.json",
        Body: JSON.stringify(data, null, 2),
        ContentType: "application/json",
        ACL: "public-read",
      })
      .promise();

    return {
      statusCode: 200,
      body: JSON.stringify({ status: "ok", message: "Upload vers S3 terminé" }),
    };
  } catch (err) {
    console.error("Erreur inattendue :", err);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Exception during update",
        detail: err.message,
      }),
    };
  }
};
