const os = require("os");
const AWS = require("aws-sdk");
const { writeFileSync, readFileSync, existsSync, mkdirSync } = require("fs");
const path = require("path");

const TMP_DIR = path.join(os.tmpdir(), "dispo-rate-limit");
const RATE_LIMIT_FILE = path.join(TMP_DIR, "dispo-rate-limit.json");

function ensureTmpDir() {
  if (!existsSync(TMP_DIR)) {
    mkdirSync(TMP_DIR, { recursive: true });
  }
}

function loadRateLimitDb() {
  ensureTmpDir();
  if (!existsSync(RATE_LIMIT_FILE)) return {};
  try {
    return JSON.parse(readFileSync(RATE_LIMIT_FILE, "utf-8"));
  } catch {
    return {};
  }
}

function saveRateLimitDb(db) {
  ensureTmpDir();
  writeFileSync(RATE_LIMIT_FILE, JSON.stringify(db));
}

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_KEY,
  secretAccessKey: process.env.AWS_SECRET,
  region: "auto",
  endpoint: process.env.S3_ENDPOINT,
  s3ForcePathStyle: true,
  signatureVersion: "v4",
});

const BUCKET_NAME = process.env.S3_BUCKET_NAME;
const FILE_KEY = "data/dispos/dispos.json";

exports.handler = async (event) => {
  try {
    const body = JSON.parse(event.body);
    const now = new Date().toISOString();

    // 🛡️ Anti-spam par IP
    const ip = event.headers["x-forwarded-for"]?.split(",")[0] || "unknown";
    const db = loadRateLimitDb();
    const timestampNow = Date.now();
    const lastSubmit = db[ip] || 0;
    const MIN_DELAY = 30 * 1000;

    if (timestampNow - lastSubmit < MIN_DELAY) {
      return {
        statusCode: 429,
        body: JSON.stringify({
          error: "Trop de soumissions. Réessaie dans quelques secondes.",
        }),
      };
    }

    db[ip] = timestampNow;
    saveRateLimitDb(db);

    // FLUSH LOGIC
    if (body.flush === true) {
      let existingData = { meta: {}, reponses: [] };

      try {
        const data = await s3
          .getObject({ Bucket: BUCKET_NAME, Key: FILE_KEY })
          .promise();
        const parsed = JSON.parse(data.Body.toString("utf-8"));
        const archiveName = `dispos-${now.slice(0, 7)}.json`;

        await s3
          .putObject({
            Bucket: BUCKET_NAME,
            Key: `data/dispos/archive/${archiveName}.json`,
            Body: JSON.stringify(parsed, null, 2),
            ContentType: "application/json",
          })
          .promise();

        if (parsed.meta) {
          existingData.meta = parsed.meta;
        }
      } catch (e) {
        console.log("Aucune donnée à archiver.");
      }

      await s3
        .putObject({
          Bucket: BUCKET_NAME,
          Key: FILE_KEY,
          Body: JSON.stringify(existingData, null, 2),
          ContentType: "application/json",
        })
        .promise();

      return {
        statusCode: 200,
        body: JSON.stringify({ message: "Réinitialisation + archivage OK." }),
      };
    }

    let existingData = { meta: {}, reponses: [] };
    try {
      const s3obj = await s3
        .getObject({ Bucket: BUCKET_NAME, Key: FILE_KEY })
        .promise();
      existingData = JSON.parse(s3obj.Body.toString("utf-8"));
    } catch (e) {
      console.log("Pas de fichier, création nouvelle structure.");
    }

    // ENREGISTREMENT DISPOS
    if (body.pseudo && body.dates) {
      const { pseudo, dates, note } = body;

      const cleaned = existingData.reponses.filter(
        (r) => r.pseudo.toLowerCase() !== pseudo.toLowerCase()
      );
      cleaned.push({ pseudo, dates, note, submittedAt: now });
      existingData.reponses = cleaned;

      await s3
        .putObject({
          Bucket: BUCKET_NAME,
          Key: FILE_KEY,
          Body: JSON.stringify(existingData, null, 2),
          ContentType: "application/json",
        })
        .promise();

      return {
        statusCode: 200,
        body: JSON.stringify({
          status: "ok",
          message: "Disponibilités enregistrées.",
        }),
      };
    }

    if (body.meta) {
      existingData.meta = {
        ...existingData.meta,
        ...body.meta,
      };

      await s3
        .putObject({
          Bucket: BUCKET_NAME,
          Key: FILE_KEY,
          Body: JSON.stringify(existingData, null, 2),
          ContentType: "application/json",
        })
        .promise();

      return {
        statusCode: 200,
        body: JSON.stringify({ message: "Période mise à jour." }),
      };
    }

    // Aucun cas déclenché
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Requête non reconnue." }),
    };
  } catch (err) {
    console.error("Erreur serveur :", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Erreur serveur", detail: err.message }),
    };
  }
};
