import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Product } from "@/lib/farm-data";

type Live = { slug: string; price: number | null; wholesale_price: number | null; availability: string; quantity_available: number };
let cache: Promise<Map<string, Live>> | null = null;
const load = () => (cache ??= Promise.resolve(supabase.from("products").select("slug,price,wholesale_price,availability,quantity_available")).then(({ data }) => new Map((data ?? []).map((r) => [r.slug, r as Live]))).catch(() => new Map()));

/** Overlays prices and availability managed in the farm dashboard onto the catalog product. */
export function useLiveProduct(product: Product): Product {
  const [live, setLive] = useState<Live | undefined>();
  useEffect(() => { load().then((m) => setLive(m.get(product.slug))); }, [product.slug]);
  if (!live) return product;
  return { ...product, price: live.price ?? undefined, wholesalePrice: live.wholesale_price ?? undefined, availability: live.availability };
}
