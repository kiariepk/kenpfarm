import { Link } from "@tanstack/react-router";
import { ArrowUpRight, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatKsh, type Product } from "@/lib/farm-data";

export function ProductCard({ product, wide = false }: { product: Product; wide?: boolean }) {
  return <article className={`group overflow-hidden rounded-md border border-border bg-card transition duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg ${wide ? "lg:col-span-2 lg:flex" : ""}`}>
    <Link to="/products/$slug" params={{ slug: product.slug }} className={`block overflow-hidden ${wide ? "lg:w-[55%] lg:shrink-0" : ""}`}>
      <img src={product.image} alt={product.imageAlt} loading="lazy" width={800} height={600} className={`w-full object-cover transition duration-500 group-hover:scale-[1.03] ${wide ? "aspect-[4/3] lg:h-full lg:aspect-auto" : "aspect-[4/3]"}`} />
    </Link>
    <div className={`flex flex-col p-5 ${wide ? "lg:flex-1 lg:justify-center lg:p-8" : ""}`}>
      <div className="mb-3 flex items-center justify-between gap-3"><span className="text-xs font-bold uppercase tracking-wider text-primary">{product.category}</span><span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground"><span className="size-2 rounded-full bg-success" />{product.availability}</span></div>
      <h3 className={`font-display text-2xl text-foreground ${wide ? "lg:text-4xl" : ""}`}>{product.name}</h3>
      <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">{product.description}</p>
      <p className="mt-4 font-bold text-primary">{product.price ? `${formatKsh(product.price)} / ${product.unit}` : "Contact us for current price"}</p>
      <div className="mt-5 flex gap-2">
        <Button asChild className="h-11 flex-1"><Link to="/products/$slug" params={{ slug: product.slug }}>View details <ArrowUpRight /></Link></Button>
        <Button asChild variant="outline" size="icon" className="h-11 w-11"><Link to="/order" search={{ product: product.slug }} aria-label={`Order ${product.name}`}><MessageCircle /></Link></Button>
      </div>
    </div>
  </article>;
}
