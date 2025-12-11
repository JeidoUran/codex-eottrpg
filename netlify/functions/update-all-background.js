// netlify/functions/update-all-background.js
const updateOktar = require("./update-oktar.js");
const updateFeril = require("./update-feril.js");
const updateElsa = require("./update-elsa.js");
const updateIthil = require("./update-ithil.js");
const updateKay = require("./update-kay.js");
const updateChest = require("./update-chest.js");
const updateBastion = require("./update-bastion.js");
const updateSundayMarket = require("./update-sunday-market.js");

// petit helper pour insérer un délai
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// IMPORTANT : cette fonction tourne "en arrière-plan" (jusqu'à 15 min).
// La réponse HTTP réelle sera toujours 202 renvoyée par Netlify.
exports.handler = async function () {
  try {
    const tasks = [
      { name: "oktar", fn: updateOktar.handler },
      { name: "feril", fn: updateFeril.handler },
      { name: "elsa", fn: updateElsa.handler },
      { name: "ithil", fn: updateIthil.handler },
      { name: "kay", fn: updateKay.handler },
      { name: "chest", fn: updateChest.handler },
      { name: "bastion", fn: updateBastion.handler },
      { name: "sunday-market", fn: updateSundayMarket.handler },
    ];

    const results = [];

    for (const task of tasks) {
      try {
        const value = await task.fn();
        results.push({
          name: task.name,
          status: "fulfilled",
          value,
        });
      } catch (err) {
        results.push({
          name: task.name,
          status: "rejected",
          reason: err.message || String(err),
        });
      }

      // petit délai entre chaque update pour éviter les collisions
      await sleep(1000); // par ex. 200 ms, tu peux monter à 500 ou 1000 si besoin
    }

    const hasError = results.some((r) => r.status === "rejected");

    const summary = results.map((r) => ({
      name: r.name,
      status: r.status,
      ...(r.status === "fulfilled" ? { value: r.value } : { reason: r.reason }),
    }));

    return {
      statusCode: hasError ? 207 : 200,
      body: JSON.stringify({
        status: hasError ? "partial-failure" : "done",
        summary,
      }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ status: "error", message: err.message }),
    };
  }
};
