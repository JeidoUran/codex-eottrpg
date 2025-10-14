// netlify/functions/update-all-background.js
const updateOktar = require("./update-oktar.js");
const updateFeril = require("./update-feril.js");
const updateElsa = require("./update-elsa.js");
const updateIthil = require("./update-ithil.js");
const updateKay = require("./update-kay.js");
const updateChest = require("./update-chest.js");
const updateBastion = require("./update-bastion.js");
const updateSundayMarket = require("./update-sunday-market.js");

// IMPORTANT : cette fonction tourne "en arrière-plan" (jusqu'à 15 min).
// La réponse HTTP réelle sera toujours 202 renvoyée par Netlify.
exports.handler = async function () {
  try {
    const results = await Promise.allSettled(
      [
        updateOktar.handler(),
        updateFeril.handler(),
        updateElsa.handler(),
        updateIthil.handler(),
        updateKay.handler(),
        updateChest.handler(),
        updateBastion.handler(),
        updateSundayMarket.handler(),
      ].map((p) =>
        p.then((res) => {
          if (res && res.statusCode >= 400)
            throw new Error(`(${res.statusCode}) ${res.body}`);
          return res;
        })
      )
    );

    const names = [
      "oktar",
      "feril",
      "elsa",
      "ithil",
      "kay",
      "chest",
      "bastion",
      "sunday-market",
    ];
    const summary = results.map((r, i) => ({
      name: names[i],
      status: r.status,
      value: r.status === "fulfilled" ? r.value : String(r.reason),
    }));
    const hasError = results.some((r) => r.status === "rejected");

    // Utile pour les logs Netlify
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
