
const updateOktar = require("./update-oktar.js");
const updateFeril = require("./update-feril.js");
const updateElsa = require("./update-elsa.js");
const updateIthil = require("./update-ithil.js");
const updateKay = require("./update-kay.js");
const updateChest = require("./update-chest.js");

exports.handler = async function(event, context) {
  try {
    const results = await Promise.allSettled([
      updateOktar.handler(),
      updateFeril.handler(),
      updateElsa.handler(),
      updateIthil.handler(),
      updateKay.handler(),
      updateChest.handler(),
    ]);

    const summary = results.map((result, i) => {
      const name = ["oktar", "feril", "elsa", "ithil", "kay", "chest"][i];
      if (result.status === "fulfilled") {
        return { name, status: "ok" };
      } else {
        return {
          name,
          status: "error",
          reason: result.reason?.message || "Unknown error"
        };
      }
    });

    const hasError = results.some(r => r.status === "rejected");

    return {
      statusCode: hasError ? 207 : 200,
      body: JSON.stringify({
        status: hasError ? "partial-failure" : "done",
        summary
      })
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ status: "error", message: err.message })
    };
  }
};
