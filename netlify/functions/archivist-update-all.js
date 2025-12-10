// netlify/functions/update-all.js
// Kicker synchrone : déclenche la background, puis répond 200 immédiatement.
export async function handler(event) {
  // Construit l'URL de la background
  const scheme = event.headers["x-forwarded-proto"] || "https";
  const host = event.headers.host; // ex: codex.eottrpg.memiroa.com
  const base = process.env.SITE_URL || (host ? `${scheme}://${host}` : "");
  const url = `${base}/.netlify/functions/archivist-update-all-background`;

  // Timeout court pour ne pas rester bloqué si le réseau accroche
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), 3000);

  try {
    // On "tape" la background en POST, mais on ignore son résultat (elle renverra 202)
    await fetch(url, { method: "POST", signal: controller.signal }).catch(
      () => {}
    );
  } finally {
    clearTimeout(t);
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      kicked: true,
      target: "archivist-update-all-background",
    }),
  };
}
