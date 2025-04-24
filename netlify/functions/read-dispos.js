const AWS = require('aws-sdk');

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_KEY,
  secretAccessKey: process.env.AWS_SECRET,
  region: 'auto',
  endpoint: process.env.S3_ENDPOINT,
  s3ForcePathStyle: true,
  signatureVersion: 'v4'
});

const BUCKET_NAME = process.env.S3_BUCKET_NAME; // adapte si besoin
const FILE_KEY = 'data/dispos/dispos.json';

exports.handler = async () => {
  try {
    const data = await s3.getObject({
      Bucket: BUCKET_NAME,
      Key: FILE_KEY
    }).promise();

    const dispoList = JSON.parse(data.Body.toString('utf-8'));

    return {
      statusCode: 200,
      body: JSON.stringify(dispoList, null, 2)
    };

  } catch (err) {
    console.error("Erreur lecture S3 :", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Impossible de lire le fichier de disponibilités.' })
    };
  }
};
