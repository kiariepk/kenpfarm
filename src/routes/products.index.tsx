import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductGrid } from "@/components/farm/PageParts";
import { categoryImages, products } from "@/lib/farm-data";

export const Route = createFileRoute("/products/")({
  head: () => ({ meta: [
    { title: "Farm Products Kenya | KENP Kienyeji Farm Marketplace" },
    { name: "description", content: "Browse Kienyeji chicken, chicks, eggs, fresh milk, dairy cattle and sheep available from our Kenyan farm." },
    { property: "og:title", content: "Farm Products — KENP Kienyeji Farm" },
    { property: "og:description", content: "Browse our poultry, dairy and sheep marketplace." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ], links: [{ rel: "canonical", href: "/products" }] }),
  component: Products,
});

const categories = ["All", "Poultry", "Dairy", "Sheep"] as const;
type Category = typeof categories[number];

function Products() {
  const [category, setCategory] = useState<Category>("All");
  const [query, setQuery] = useState("");
  const [availability, setAvailability] = useState("All");
  const [price, setPrice] = useState("All");
  const filtered = useMemo(() => products.filter(p =>
    (category === "All" || p.category === category) &&
    (availability === "All" || (availability === "Available" ? p.availability === "Available" : p.availability !== "Available")) &&
    (price === "All" || (price === "Priced" ? p.price !== undefined : p.price === undefined)) &&
    `${p.name} ${p.description} ${p.category} ${p.slug}`.toLowerCase().includes(query.trim().toLowerCase())
  ), [category, query, availability, price]);
  const hasFilters = category !== "All" || query !== "" || availability !== "All" || price !== "All";
  const clear = () => { setCategory("All"); setQuery(""); setAvailability("All"); setPrice("All"); };

  return <>
    <section className="bg-primary px-5 py-12 text-primary-foreground sm:py-16"><div className="mx-auto max-w-7xl">
      <p className="text-sm font-bold uppercase text-highlight">Shop direct from the farm</p>
      <h1 className="mt-2 font-display text-5xl sm:text-6xl">Explore farm products</h1>
      <p className="mt-4 max-w-2xl leading-7 text-primary-foreground/85">Kienyeji poultry, fresh eggs, milk and livestock. Find what you need and order directly from the farm.</p>
    </div></section>
    <section className="mx-auto max-w-7xl px-5 pb-16 pt-9 lg:px-6">
      <div className="grid gap-3 sm:grid-cols-3">{(["Poultry", "Dairy", "Sheep"] as const).map(c => <Button key={c} type="button" variant="ghost" onClick={() => setCategory(category === c ? "All" : c)} aria-pressed={category === c} className={`group relative h-36 overflow-hidden rounded-md p-0 text-left sm:h-44 ${category === c ? "ring-4 ring-highlight ring-offset-2 ring-offset-background" : ""}`}>
        <img src={categoryImages[c]} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        <span className="absolute inset-0 bg-gradient-to-t from-primary via-primary/35 to-transparent" />
        <span className="absolute inset-x-0 bottom-0 flex items-end justify-between p-5 font-display text-3xl text-primary-foreground">{c}<ArrowRight className="size-6" /></span>
      </Button>)}</div>
      <div className="mt-10 flex flex-col gap-5 border-b border-border pb-6 lg:flex-row lg:items-end lg:justify-between">
        <div><p className="text-sm font-bold uppercase text-primary">The collection</p><h2 className="mt-1 font-display text-4xl sm:text-5xl">{category === "All" ? "Everything from the farm" : category}</h2></div>
        <div className="flex flex-wrap gap-2" aria-label="Filter by category">{categories.map(c => <Button type="button" key={c} size="sm" variant={category === c ? "default" : "outline"} onClick={() => setCategory(c)} aria-pressed={category === c} className="h-10 min-w-16">{c}</Button>)}</div>
      </div>
      <div className="my-6 grid gap-3 md:grid-cols-[1fr_180px_200px_auto]">
        <label className="relative"><span className="sr-only">Search products</span><Search className="absolute left-3 top-3.5 size-4 text-muted-foreground"/><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search chicks, eggs, milk, sheep…" className="h-11 w-full rounded-md border border-input bg-background pl-9 pr-3 outline-none focus:ring-2 focus:ring-ring"/></label>
        <label><span className="sr-only">Filter by price</span><select value={price} onChange={e => setPrice(e.target.value)} className="h-11 w-full rounded-md border border-input bg-background px-3"><option value="All">All prices</option><option value="Priced">Priced products</option><option value="Contact for price">Contact for price</option></select></label>
        <label><span className="sr-only">Filter by availability</span><select value={availability} onChange={e => setAvailability(e.target.value)} className="h-11 w-full rounded-md border border-input bg-background px-3"><option value="All">All availability</option><option value="Available">Available</option><option value="Confirm availability">Confirm availability</option></select></label>
        {hasFilters && <Button type="button" variant="ghost" onClick={clear} className="h-11"><X/> Clear</Button>}
      </div>
      <p className="mb-5 text-sm text-muted-foreground" aria-live="polite">Showing {filtered.length} {filtered.length === 1 ? "product" : "products"}</p>
      {filtered.length ? <ProductGrid items={filtered} explorer/> : <div className="border-y border-border py-14 text-center"><h3 className="font-display text-3xl">No products found</h3><p className="mt-2 text-muted-foreground">Try a different search or ask the farm for help.</p><div className="mt-5 flex justify-center gap-3"><Button onClick={clear}>Show all products</Button><Button asChild variant="outline"><Link to="/contact">Contact the farm</Link></Button></div></div>}
    </section>
  </>;
}