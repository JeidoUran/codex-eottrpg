export default async (request, context) => {
  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }

  if (request.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  const API_KEY =
    (context?.env && context.env.ARCHIVIST_API_KEY) ||
    Deno.env.get("ARCHIVIST_API_KEY");
  const CAMPAIGN_ID =
    (context?.env && context.env.ARCHIVIST_CAMPAIGN_ID) ||
    Deno.env.get("ARCHIVIST_CAMPAIGN_ID");

  if (!API_KEY || !CAMPAIGN_ID) {
    return new Response(
      `Missing env. API_KEY=${Boolean(API_KEY)} CAMPAIGN_ID=${Boolean(CAMPAIGN_ID)}`,
      { status: 500 }
    );
  }

  const payload = await request.json().catch(() => null);
  if (!payload) return new Response("Invalid JSON", { status: 400 });

  payload.campaign_id = CAMPAIGN_ID;

  const upstream = await fetch("https://api.myarchivist.ai/v1/ask", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": API_KEY,
    },
    body: JSON.stringify(payload),
  });

  const contentType =
    upstream.headers.get("content-type") || "text/plain; charset=utf-8";

  return new Response(upstream.body, {
    status: upstream.status,
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "no-store",
    },
  });
};
