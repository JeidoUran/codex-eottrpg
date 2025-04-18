const fetch = require("node-fetch");
const fs = require("fs");
const path = require("path");

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

    const outputPath = path.join(__dirname, "../../data/oktar.json");
    data.data[0]._codexLastUpdate = new Date().toISOString();
    fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));

    return {
      statusCode: 200,
      body: JSON.stringify({ status: "ok", message: "Données mises à jour" })
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ status: "error", message: err.message })
    };
  }
};
