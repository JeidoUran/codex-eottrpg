const AWS = require('aws-sdk');

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_KEY,
  secretAccessKey: process.env.AWS_SECRET,
  region: 'auto',
  endpoint: process.env.S3_ENDPOINT,
  s3ForcePathStyle: true,
  signatureVersion: 'v4'
});

const BUCKET_NAME = 'codex-eottrpg';
const FILE_KEY = 'data/dispos/dispos.json';

exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') {
      return { statusCode: 405, body: 'Méthode non autorisée' };
    }
  
    try {
      const body = JSON.parse(event.body);

      if (body.flush === true) {
        let existingData = { meta: {}, reponses: [] };
      
        try {
          const s3obj = await s3.getObject({ Bucket: BUCKET_NAME, Key: FILE_KEY }).promise();
          const parsed = JSON.parse(s3obj.Body.toString('utf-8'));
      
          // Archive dans un fichier daté
          const now = new Date();
          const archiveName = `dispos-${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}.json`;
      
          await s3.putObject({
            Bucket: BUCKET_NAME,
            Key: archiveName,
            Body: JSON.stringify(parsed, null, 2),
            ContentType: 'application/json'
          }).promise();
      
          // Préserver la meta si elle existe
          if (parsed.meta) {
            existingData.meta = parsed.meta;
          }
      
        } catch (e) {
          console.log("Aucune donnée à archiver ou fichier inexistant.");
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
      
      const now = new Date().toISOString();
  
      // Charger l'existant
      let existingData = { meta: {}, reponses: [] };
      try {
        const data = await s3.getObject({ Bucket: BUCKET_NAME, Key: FILE_KEY }).promise();
        const parsed = JSON.parse(data.Body.toString('utf-8'));
      
        // Si ancien format simple tableau : migrer
        if (Array.isArray(parsed)) {
          existingData.reponses = parsed;
        } else {
          existingData = parsed;
        }
      } catch (e) {
        console.log("Fichier inexistant ou vide, création d’un nouveau.");
      }      
  
      // ✅ Cas 1 : mise à jour de la période (meta)
      if (body.meta) {
        existingData.meta = {
          ...existingData.meta,
          ...body.meta
        };
  
        await s3.putObject({
          Bucket: BUCKET_NAME,
          Key: FILE_KEY,
          Body: JSON.stringify(existingData, null, 2),
          ContentType: 'application/json'
        }).promise();
  
        return {
          statusCode: 200,
          body: JSON.stringify({ message: 'Période mise à jour.' })
        };
      }
  
      // ✅ Cas 2 : envoi de disponibilités classique
      const { pseudo, dates, note } = body;
  
      if (!pseudo || !dates || !Array.isArray(dates)) {
        return { statusCode: 400, body: 'Format invalide' };
      }
  
      existingData.reponses.push({ pseudo, dates, note, submittedAt: now });
  
      await s3.putObject({
        Bucket: BUCKET_NAME,
        Key: FILE_KEY,
        Body: JSON.stringify(existingData, null, 2),
        ContentType: 'application/json'
      }).promise();
  
      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Disponibilités enregistrées !' })
      };
  
    } catch (err) {
      console.error('Erreur lors de l’enregistrement :', err);
      return { statusCode: 500, body: 'Erreur serveur.' };
    }
  };  