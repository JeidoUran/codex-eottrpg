// netlify/functions/update-all-background.js
const updateCharas = import("./archivist-sync-characters.js");
const updateSessions = import("./archivist-sync-sessions.js");
const updateFactions = import("./archivist-sync-factions.js");

// IMPORTANT : cette fonction tourne "en arrière-plan" (jusqu'à 15 min).
// La réponse HTTP réelle sera toujours 202 renvoyée par Netlify.
export async function handler() {
  try {
    const results = await Promise.allSettled(
      [
        updateCharas.handler(),
        updateSessions.handler(),
        updateFactions.handler(),
      ].map((p) =>
        p.then((res) => {
          if (res && res.statusCode >= 400)
            throw new Error(`(${res.statusCode}) ${res.body}`);
          return res;
        })
      )
    );

    const names = ["characters", "sessions", "factions"];
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
}
