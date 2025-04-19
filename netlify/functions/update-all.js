const updateOktar = require("./update-oktar.js");
const updateFeril = require("./update-feril.js");
const updateElsa = require("./update-elsa.js");
const updateIthil = require("./update-ithil.js");
const updateKay = require("./update-kay.js");

exports.handler = async function(event, context) {
  try {
    const results = await Promise.allSettled([
      updateOktar.handler(),
      updateFeril.handler(),
      updateElsa.handler(),
      updateIthil.handler(),
      updateKay.handler()
    ]);

    const summary = results.map((result, i) => {
      const name = ["oktar", "feril", "elsa", "ithil", "kay"][i];
      if (result.status === "fulfilled") {
        return { name, status: "ok" };
      } else {
        return { name, status: "error", reason: result.reason?.message || "Unknown error" };
      }
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ status: "done", summary })
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ status: "error", message: err.message })
    };
  }
};
