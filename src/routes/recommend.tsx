import { useState, type FormEvent } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, Wheat } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { getProduct, getPrice, formatKsh } from "@/lib/farm-data";
import { recommendProducts, type Recommendation } from "@/lib/recommend.functions";

export const Route = createFileRoute("/recommend")({
  head: () => ({
    meta: [
      { title: "Find the Right Farm Products | KENP Kienyeji Farm" },
      { name: "description", content: "Tell us what you need, how much and your budget — get matching Kienyeji chicken, eggs, milk and livestock suggestions from our farm." },
      { property: "og:title", content: "Product Finder | KENP Kienyeji Farm" },
      { property: "og:description", content: "Describe your needs and budget to get matching farm product suggestions." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [{ rel: "canonical", href: "/recommend" }],
  }),
  component: RecommendPage,
});

function RecommendPage() {
  const ask = useServerFn(recommendProducts);
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [error, setError] = useState("");
  const [result, setResult] = useState<{ summary: string; items: Recommendation[] } | null>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const budgetRaw = String(fd.get("budget") ?? "").replace(/[^\d.]/g, "");
    setState("loading"); setError("");
    try {
      const r = await ask({ data: { needs: String(fd.get("needs")), quantity: String(fd.get("quantity") ?? ""), budget: budgetRaw ? Number(budgetRaw) : null } });
      setResult(r); setState("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong."); setState("error");
    }
  }

  return (
    <section className="bg-muted px-5 py-14">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 text-center">
          <p className="text-sm font-bold uppercase text-primary">Product finder</p>
          <h1 className="mt-2 font-display text-4xl font-bold">Tell us what you need</h1>
          <p className="mt-3 text-muted-foreground">Describe your plans, quantity and budget, and we'll suggest matching products from our farm.</p>
        </div>
        <form onSubmit={onSubmit} className="grid gap-5 rounded-lg border border-border bg-card p-5 shadow-lg sm:p-8">
          <div className="grid gap-2"><Label htmlFor="needs">What are you looking for?</Label><Textarea id="needs" name="needs" required minLength={3} maxLength={1000} placeholder="e.g. I'm starting a small poultry project and also need eggs for my café every week" /></div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="grid gap-2"><Label htmlFor="quantity">Quantity</Label><Input id="quantity" name="quantity" maxLength={100} placeholder="e.g. 20 chicks, 10 trays" /></div>
            <div className="grid gap-2"><Label htmlFor="budget">Budget (KSh)</Label><Input id="budget" name="budget" inputMode="numeric" maxLength={15} placeholder="e.g. 10000" /></div>
          </div>
          <Button size="lg" className="h-12" disabled={state === "loading"}>{state === "loading" ? <><Loader2 className="animate-spin" /> Finding matches…</> : <><Wheat /> Get recommendations</>}</Button>
          {state === "error" && <p className="text-sm text-destructive">{error}</p>}
        </form>

        {state === "done" && result && (
          <div className="mt-8 grid gap-4">
            {result.summary && <p className="rounded-md bg-secondary p-4 text-secondary-foreground">{result.summary}</p>}
            {result.items.length === 0 && <p className="text-muted-foreground">No close matches found. Please <Link to="/contact" className="font-semibold text-primary underline">contact the farm</Link> and we'll help.</p>}
            {result.items.map((item) => {
              const p = getProduct(item.slug); if (!p) return null;
              const total = getPrice(p, item.quantity, item.quantity >= 5);
              return (
                <article key={item.slug} className="flex flex-col gap-4 rounded-lg border border-border bg-card p-4 shadow-sm sm:flex-row">
                  <img src={p.image} alt={p.imageAlt} loading="lazy" className="h-40 w-full rounded-md object-cover sm:h-32 sm:w-40" />
                  <div className="flex flex-1 flex-col gap-2">
                    <h2 className="font-display text-xl font-bold">{p.name}</h2>
                    <p className="text-sm text-muted-foreground">{item.reason}</p>
                    <p className="text-sm font-semibold">Suggested: {item.quantity} {p.unit}{item.quantity > 1 ? "s" : ""} · <span className="text-primary">{total === null ? "Contact us for current price" : `Est. ${formatKsh(total)}`}</span></p>
                    <div className="mt-auto flex flex-wrap gap-2">
                      <Button asChild size="sm"><Link to="/order" search={{ product: p.slug }}>Order</Link></Button>
                      <Button asChild size="sm" variant="outline"><Link to="/products/$slug" params={{ slug: p.slug }}>View details</Link></Button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
