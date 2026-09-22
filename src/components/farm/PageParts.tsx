import { Link } from "@tanstack/react-router";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "./ProductCard";
import { products, type Product } from "@/lib/farm-data";

export function PageHero({ eyebrow, title, description, image, alt }: { eyebrow: string; title: string; description: string; image: string; alt: string }) {
  return <section className="relative min-h-[430px] overflow-hidden bg-primary"><img src={image} alt={alt} width={1600} height={1000} className="absolute inset-0 h-full w-full object-cover opacity-65"/><div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/80 to-primary/10"/><div className="relative mx-auto flex min-h-[430px] max-w-7xl items-end px-5 py-14 lg:px-6"><div className="max-w-3xl animate-rise text-primary-foreground"><p className="mb-3 text-sm font-bold uppercase tracking-[.16em] text-highlight">{eyebrow}</p><h1 className="font-display text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl">{title}</h1><p className="mt-5 max-w-2xl text-base leading-7 text-primary-foreground/85 sm:text-lg">{description}</p></div></div></section>;
}

export function ProductGrid({ items }: { items: Product[] }) { return <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{items.map((p) => <ProductCard key={p.slug} product={p}/>)}</div>; }

export function TrustBand() { return <section className="border-y border-border bg-secondary"><div className="mx-auto grid max-w-7xl grid-cols-2 gap-px md:grid-cols-4">{["Quality livestock","Healthy animals","Fresh farm products","Reliable customer service"].map((item) => <div key={item} className="flex items-center gap-2 px-4 py-5 text-sm font-bold"><CheckCircle2 className="size-5 text-primary"/>{item}</div>)}</div></section>; }

export function CtaBand() { return <section className="bg-primary px-5 py-14 text-primary-foreground"><div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 md:flex-row md:items-center"><div><h2 className="font-display text-3xl font-bold">Ready to order from the farm?</h2><p className="mt-2 text-primary-foreground/75">Tell us what you need and we’ll confirm availability and delivery.</p></div><Button asChild variant="hero" size="lg"><Link to="/order">Place an order</Link></Button></div></section>; }

export const chickenProducts = products.filter((p) => p.category === "Poultry" && p.slug !== "kienyeji-eggs");
