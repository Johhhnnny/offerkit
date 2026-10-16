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
      const prompt = `You are OfferKit AI, a practical marketing copywriter for small businesses. Create ${kind} for ${businessName}, a ${businessType} business. Promotion: ${offer}. Target audience: ${audience}. Platform: ${platform}. Tone: ${tone}. Write clear, specific, engaging copy with a useful call to action. Avoid unsupported claims, fake discounts, and excessive hashtags. Return only the finished draft.`;
      const output = await env.AI.run("@cf/meta/llama-3.1-8b-instruct", {
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