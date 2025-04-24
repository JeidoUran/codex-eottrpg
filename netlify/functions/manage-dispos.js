
const AWS = require('aws-sdk');

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_KEY,
  secretAccessKey: process.env.AWS_SECRET,
  region: 'auto',
  endpoint: process.env.S3_ENDPOINT,
  s3ForcePathStyle: true,
  signatureVersion: 'v4'
});

const BUCKET_NAME = process.env.S3_BUCKET_NAME;
const FILE_KEY = 'data/dispos/dispos.json';

exports.handler = async (event) => {
  try {
    const body = JSON.parse(event.body);
    const now = new Date().toISOString();

    // FLUSH LOGIC
    if (body.flush === true) {
      let existingData = { meta: {}, reponses: [] };

      try {
        const data = await s3.getObject({ Bucket: BUCKET_NAME, Key: FILE_KEY }).promise();
        const parsed = JSON.parse(data.Body.toString('utf-8'));
        const archiveName = `dispos-${now.slice(0, 7)}.json`;

        await s3.putObject({
          Bucket: BUCKET_NAME,
          Key: archiveName,
          Body: JSON.stringify(parsed, null, 2),
          ContentType: 'application/json'
        }).promise();

        if (parsed.meta) {
          existingData.meta = parsed.meta;
        }
      } catch (e) {
        console.log("Aucune donnée à archiver.");
      }

      await s3.putObject({
        Bucket: BUCKET_NAME,
        Key: FILE_KEY,
        Body: JSON.stringify(existingData, null, 2),
        ContentType: 'application/json'
      }).promise();

      return {
        statusCode: 200,
        body: JSON.stringify({ message: "Réinitialisation + archivage OK." })
      };
    }

    // ENREGISTREMENT DISPOS
    if (body.pseudo && body.dates) {
      const { pseudo, dates, note } = body;

      let existingData = { meta: {}, reponses: [] };
      try {
        const s3obj = await s3.getObject({ Bucket: BUCKET_NAME, Key: FILE_KEY }).promise();
        existingData = JSON.parse(s3obj.Body.toString('utf-8'));
      } catch (e) {
        console.log("Pas de fichier, création nouvelle structure.");
      }

      const cleaned = existingData.reponses.filter(r => r.pseudo.toLowerCase() !== pseudo.toLowerCase());
      cleaned.push({ pseudo, dates, note, submittedAt: now });
      existingData.reponses = cleaned;

      await s3.putObject({
        Bucket: BUCKET_NAME,
        Key: FILE_KEY,
        Body: JSON.stringify(existingData, null, 2),
        ContentType: 'application/json'
      }).promise();

      return {
        statusCode: 200,
        body: JSON.stringify({ status: "ok", message: "Disponibilités enregistrées." })
      };
    }

    // Aucun cas déclenché
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Requête non reconnue." })
    };

  } catch (err) {
    console.error("Erreur serveur :", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Erreur serveur", detail: err.message })
    };
  }
};
