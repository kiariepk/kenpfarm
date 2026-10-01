import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const inputSchema = z.object({
  needs: z.string().trim().min(3).max(1000),
  quantity: z.string().trim().max(100).optional(),
  budget: z.number().nonnegative().max(100_000_000).nullable(),
});

export type Recommendation = { slug: string; quantity: number; reason: string };

export const recommendProducts = createServerFn({ method: "POST" })
  .inputValidator((data) => inputSchema.parse(data))
  .handler(async ({ data }) => {
    const apiKey = process.env["LOVABLE_API_KEY"];
    if (!apiKey) throw new Error("The recommendation service is not configured.");
    const { products } = await import("./farm-data");
    const { createOpenAI } = await import("@ai-sdk/openai");
    const { streamText } = await import("ai");

    const catalog = products
      .filter((p) => !/unavailable|sold out/i.test(p.availability))
      .map((p) => ({
        slug: p.slug, name: p.name, category: p.category, unit: p.unit,
        retailPriceKsh: p.price ?? null, wholesalePriceKsh: p.wholesalePrice ?? null,
        availability: p.availability, description: p.description,
      }));

    let runId: string | undefined;
    const provider = createOpenAI({
      baseURL: "https://ai.gateway.lovable.dev/v1",
      apiKey,
      headers: { "Lovable-API-Key": apiKey, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
      fetch: async (input, init) => {
        const headers = new Headers(init?.headers);
        if (runId) headers.set("X-Lovable-AIG-Run-ID", runId);
        const res = await fetch(input, { ...init, headers });
        runId ??= res.headers.get("X-Lovable-AIG-Run-ID") ?? undefined;
        return res;
      },
    });

    const result = streamText({
      model: provider.responses("openai/gpt-6-astra"),
      maxRetries: 0,
      system:
        "You are a helpful sales assistant for KENP Kienyeji Farm in Kenya. Recommend only products from the provided catalog, using their exact slug. Never invent products or prices. Products with null prices have a price on enquiry. Wholesale egg price applies from 5 trays. Respect the customer's budget when prices are known. Recommend 1 to 4 items. Reply ONLY with JSON: {\"summary\": string, \"items\": [{\"slug\": string, \"quantity\": number, \"reason\": string}]}. Keep reasons under 30 words and the summary under 50 words.",
      prompt: `Catalog: ${JSON.stringify(catalog)}\n\nCustomer needs: ${data.needs}\nQuantity: ${data.quantity || "not specified"}\nBudget: ${data.budget ? `KSh ${data.budget}` : "not specified"}`,
      providerOptions: {
        openai: { forceReasoning: true, reasoningEffort: "low", reasoningSummary: "auto", store: false, include: ["reasoning.encrypted_content"] },
      },
    });

    let text: string;
    try {
      text = await result.text;
    } catch (e) {
      const status = (e as { statusCode?: number }).statusCode;
      if (status === 429) throw new Error("Too many requests right now. Please try again in a minute.");
      if (status === 402 || status === 403) throw new Error("Recommendations are temporarily unavailable. Please contact the farm.");
      throw new Error("We could not get recommendations. Please try again.");
    }

    const match = text.match(/\{[\s\S]*\}/);
    let parsed: { summary?: unknown; items?: unknown } = {};
    try { parsed = match ? JSON.parse(match[0]) : {}; } catch { /* fall through */ }
    const valid = new Set(catalog.map((c) => c.slug));
    const items: Recommendation[] = (Array.isArray(parsed.items) ? parsed.items : [])
      .filter((i: any) => i && valid.has(i.slug))
      .slice(0, 4)
      .map((i: any) => ({ slug: i.slug, quantity: Math.max(1, Math.round(Number(i.quantity) || 1)), reason: String(i.reason ?? "").slice(0, 300) }));
    return { summary: typeof parsed.summary === "string" ? parsed.summary.slice(0, 500) : "", items };
  });
