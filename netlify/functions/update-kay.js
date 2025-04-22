const AWS = require('aws-sdk');
const fetch = (...args) => import("node-fetch").then(({default: f}) => f(...args));

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_KEY,
  secretAccessKey: process.env.AWS_SECRET,
  endpoint: process.env.S3_ENDPOINT,
  region: "auto",
  signatureVersion: "v4"
});

exports.handler = async function() {
  const CLIENT_ID = "foundry-skQfvcSugPyn5XvR"; // à remplacer si nécessaire
  const UUID = "Actor.i86bsTOgiri7Krtq";
  const API_KEY = "codex-relay";

  const url = `http://api.codex.memiroa.com/get?clientId=${CLIENT_ID}&uuid=${UUID}`;

  try {
    const response = await fetch(url, {
      headers: { "x-api-key": API_KEY }
    });
    const data = await response.json();
    data._codexLastUpdate = new Date().toISOString();

    await s3.putObject({
      Bucket: "codex-eottrpg",
      Key: "data/characters/kay.json",
      Body: JSON.stringify(data, null, 2),
      ContentType: "application/json",
      ACL: "public-read"
    }).promise();

    return {
      statusCode: 200,
      body: JSON.stringify({ status: "ok", message: "Upload vers S3 terminé" })
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ status: "error", message: err.message })
    };
  }
};