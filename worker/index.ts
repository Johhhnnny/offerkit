export interface Env {
  AI: { run(model: string, input: Record<string, unknown>): Promise<unknown> };
  ALLOWED_ORIGIN?: string;
}

const headers = (origin: string, allowed: string) => ({
  "Access-Control-Allow-Origin": allowed === "*" ? "*" : origin,
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Content-Type": "application/json; charset=utf-8",
  "Vary": "Origin"
});

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const origin = request.headers.get("Origin") || "";
    const allowed = env.ALLOWED_ORIGIN || "*";
    const cors = headers(origin, allowed);
    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });
    if (request.method !== "POST") return Response.json({ error: "Use POST to generate content." }, { status: 405, headers: cors });
    if (allowed !== "*" && origin !== allowed) return Response.json({ error: "Origin not allowed." }, { status: 403, headers: cors });

    try {
      const body = await request.json() as Record<string, unknown>;
      const businessName = String(body.businessName || "the business").slice(0, 120);
      const businessType = String(body.businessType || "small business").slice(0, 120);
      const offer = String(body.offer || "a special offer").slice(0, 500);
      const audience = String(body.audience || "potential customers").slice(0, 160);
      const platform = String(body.platform || "social media").slice(0, 80);
      const tone = String(body.tone || "Friendly").slice(0, 60);
      const kind = String(body.kind || "Social caption").slice(0, 80);
      const prompt = `You are OfferKit AI, a careful marketing copywriter for small businesses. Create ${kind} for the business named exactly "${businessName}" (business type: ${businessType}). The exact products, services, or promotion supplied by the owner are: "${offer}". Target audience: ${audience}. Posting platform: ${platform}. Desired tone: ${tone}.\n\nSTRICT RULES: Base the draft on the supplied details only. Mention the actual products/services from the offer and do not replace them with unrelated products, cuisine, countries, or themes. Never call the business Caribbean, tropical, luxury, or anything else unless the owner said so. Do not invent a location, price, discount, opening hours, booking/table reservation system, phone number, address, guarantee, or other facts. Never include placeholders such as [Your Phone Number]. Do not claim an item is available unless it is part of the supplied offer. Use natural, locally neutral language and a clear call to action that works without inventing contact details (for example, "Send us a message to enquire"). Make it ready to copy and post, not an explanation. Return only the finished draft.`;
      const output = await env.AI.run("@cf/meta/llama-3.1-8b-instruct-fast", {
        messages: [
          { role: "system", content: "You write natural, concise marketing copy for small businesses. Do not invent facts such as prices, locations, guarantees or contact details." },
          { role: "user", content: prompt }
        ],
        max_tokens: 700
      }) as { response?: string };
      const text = output?.response?.trim();
      if (!text) return Response.json({ error: "The AI returned an empty response." }, { status: 502, headers: cors });
      return Response.json({ text }, { headers: cors });
    } catch {
      return Response.json({ error: "Could not generate content. Check the request and Worker AI configuration." }, { status: 500, headers: cors });
    }
  }
};