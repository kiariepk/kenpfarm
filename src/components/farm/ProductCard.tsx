import { Link } from "@tanstack/react-router";
import { ArrowUpRight, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatKsh, type Product } from "@/lib/farm-data";

export function ProductCard({ product }: { product: Product }) {
  return <article className="group overflow-hidden rounded-lg border border-border bg-card shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
    <Link to="/products/$slug" params={{ slug: product.slug }} className="block overflow-hidden">
      <img src={product.image} alt={product.imageAlt} loading="lazy" width={800} height={600} className="aspect-[4/3] w-full object-cover transition duration-500 group-hover:scale-[1.03]" />
    </Link>
    <div className="p-5">
      <div className="mb-3 flex items-center justify-between gap-3"><span className="text-xs font-bold uppercase tracking-wider text-primary">{product.category}</span><span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground"><span className="size-2 rounded-full bg-success" />{product.availability}</span></div>
      <h3 className="font-display text-xl font-bold text-foreground">{product.name}</h3>
      <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">{product.description}</p>
      <p className="mt-4 font-bold text-primary">{product.price ? `${formatKsh(product.price)} / ${product.unit}` : "Contact us for current price"}</p>
      <div className="mt-5 flex gap-2">
        <Button asChild className="h-11 flex-1"><Link to="/products/$slug" params={{ slug: product.slug }}>View details <ArrowUpRight /></Link></Button>
        <Button asChild variant="outline" size="icon" className="h-11 w-11"><Link to="/order" search={{ product: product.slug }} aria-label={`Order ${product.name}`}><MessageCircle /></Link></Button>
      </div>
    </div>
  </article>;
}
