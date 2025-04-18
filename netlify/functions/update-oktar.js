const AWS = require('aws-sdk');
const fetch = require('node-fetch');

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_KEY,
  secretAccessKey: process.env.AWS_SECRET,
  endpoint: "https://s3.eottrpg.memiroa.com",
  region: "auto",
  signatureVersion: "v4"
});

exports.handler = async function(event, context) {
  const UUID = "Actor.DLc3BG2Qq87T57tk";
  const CLIENT_ID = "foundry-skQfvcSugPyn5XvR"; // remplace-moi
  const API_KEY = "codex-relay";

  const url = `http://api.codex.memiroa.com/get?clientId=${CLIENT_ID}&uuid=${UUID}&selected=true&actor=true`;

  try {
    const response = await fetch(url, {
      headers: { Authorization: API_KEY }
    });
    const data = await response.json();
    data._codexLastUpdate = new Date().toISOString();

    await s3.putObject({
      Bucket: "codex-eottrpg",
      Key: "data/oktar.json",
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