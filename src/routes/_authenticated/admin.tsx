import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { toast } from "sonner";
import { Banknote, ClipboardList, Package, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { formatKsh } from "@/lib/farm-data";

export const Route = createFileRoute("/_authenticated/admin")({
  beforeLoad: async () => {
    const { data } = await supabase.rpc("claim_first_admin");
    if (!data) throw redirect({ to: "/" });
  },
  head: () => ({ meta: [{ title: "Farm Manager | KENP Farm" }, { name: "robots", content: "noindex" }] }),
  component: Admin,
});

type Order = Tables<"orders"> & { order_items: Tables<"order_items">[] };
type ProductRow = Tables<"products">;
const STATUS = ["pending", "confirmed", "completed", "cancelled"] as const;
const STATUS_LABEL: Record<string, string> = { pending: "New", confirmed: "Confirmed", completed: "Delivered", cancelled: "Cancelled" };
const sel = "h-10 rounded-md border border-input bg-background px-2 text-sm";

function Admin() {
  const [tab, setTab] = useState<"summary" | "orders" | "stock">("summary");
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<ProductRow[]>([]);
  const reload = async () => {
    const [o, p] = await Promise.all([
      supabase.from("orders").select("*, order_items(*)").order("created_at", { ascending: false }),
      supabase.from("products").select("*").order("category").order("name"),
    ]);
    if (o.error || p.error) toast.error("Could not load farm data");
    setOrders((o.data as Order[]) ?? []); setProducts(p.data ?? []);
  };
  useEffect(() => { reload(); }, []);

  return <section className="bg-muted px-4 py-10 sm:px-5"><div className="mx-auto max-w-7xl">
    <div className="flex flex-wrap items-center justify-between gap-4"><div><p className="text-sm font-bold uppercase text-primary">KENP Farm Manager</p><h1 className="font-display text-4xl">Manage your farm</h1></div><Button asChild variant="outline"><Link to="/">View website</Link></Button></div>
    <div className="mt-6 flex gap-2 overflow-x-auto">{([["summary", "Sales summary"], ["orders", `Orders (${orders.length})`], ["stock", "Stock & prices"]] as const).map(([k, l]) => <Button key={k} variant={tab === k ? "default" : "outline"} className="h-11" onClick={() => setTab(k)}>{l}</Button>)}</div>
    <div className="mt-6">{tab === "summary" ? <Summary orders={orders} products={products} /> : tab === "orders" ? <Orders orders={orders} reload={reload} /> : <Stock products={products} reload={reload} />}</div>
  </div></section>;
}

function Summary({ orders, products }: { orders: Order[]; products: ProductRow[] }) {
  const s = useMemo(() => {
    const live = orders.filter((o) => o.status !== "cancelled");
    const paid = live.filter((o) => o.payment_status === "paid").reduce((t, o) => t + Number(o.amount_paid ?? o.estimated_total ?? 0), 0);
    const unpaid = live.filter((o) => o.payment_status !== "paid").reduce((t, o) => t + Number(o.estimated_total ?? 0), 0);
    const best = new Map<string, number>();
    live.forEach((o) => o.order_items.forEach((i) => best.set(i.product_name, (best.get(i.product_name) ?? 0) + Number(i.quantity))));
    return { paid, unpaid, pending: orders.filter((o) => o.status === "pending").length, best: [...best].sort((a, b) => b[1] - a[1]).slice(0, 5) };
  }, [orders]);
  const cards = [[Banknote, "Paid sales", formatKsh(s.paid)], [Wallet, "Waiting for payment", formatKsh(s.unpaid)], [ClipboardList, "New orders", String(s.pending)], [Package, "Products", String(products.length)]] as const;
  return <><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{cards.map(([Icon, l, v]) => <div key={l} className="rounded-lg border bg-card p-5"><Icon className="size-6 text-primary" /><p className="mt-3 text-sm text-muted-foreground">{l}</p><p className="mt-1 text-2xl font-bold">{v}</p></div>)}</div>
    <div className="mt-6 grid gap-4 lg:grid-cols-2"><div className="rounded-lg border bg-card p-5"><h2 className="font-display text-2xl">Best sellers</h2>{s.best.length ? <ul className="mt-3 grid gap-2 text-sm">{s.best.map(([n, q]) => <li key={n} className="flex justify-between"><span>{n}</span><b>{q}</b></li>)}</ul> : <p className="mt-3 text-sm text-muted-foreground">No orders yet.</p>}</div>
      <div className="rounded-lg border bg-card p-5"><h2 className="font-display text-2xl">Stock</h2><ul className="mt-3 grid gap-2 text-sm">{products.map((p) => <li key={p.id} className="flex justify-between"><span>{p.name}</span><b className={Number(p.quantity_available) <= 0 ? "text-destructive" : ""}>{p.quantity_available} {p.unit}</b></li>)}</ul></div></div></>;
}

function Orders({ orders, reload }: { orders: Order[]; reload: () => void }) {
  const [filter, setFilter] = useState("all");
  const update = async (id: string, patch: Partial<Tables<"orders">>) => {
    const { error } = await supabase.from("orders").update(patch).eq("id", id);
    if (error) toast.error("Could not save"); else { toast.success("Order updated"); reload(); }
  };
  const list = orders.filter((o) => filter === "all" || (filter === "unpaid" ? o.payment_status !== "paid" && o.status !== "cancelled" : o.status === filter));
  return <><select className={sel} value={filter} onChange={(e) => setFilter(e.target.value)}><option value="all">All orders</option><option value="unpaid">Not yet paid</option>{STATUS.map((s) => <option key={s} value={s}>{STATUS_LABEL[s]}</option>)}</select>
    <div className="mt-4 grid gap-4">{list.length === 0 && <p className="rounded-lg border bg-card p-6 text-muted-foreground">No orders here yet.</p>}
      {list.map((o) => <OrderCard key={o.id} o={o} update={update} />)}</div></>;
}

function OrderCard({ o, update }: { o: Order; update: (id: string, p: Partial<Tables<"orders">>) => void }) {
  const [method, setMethod] = useState(o.payment_method ?? "mpesa");
  const [code, setCode] = useState(o.mpesa_code ?? "");
  const [amount, setAmount] = useState(String(o.amount_paid ?? o.estimated_total ?? ""));
  const paid = o.payment_status === "paid";
  return <article className="rounded-lg border bg-card p-5">
    <div className="flex flex-wrap items-start justify-between gap-3"><div><h3 className="text-lg font-bold">{o.customer_name}</h3><p className="text-sm text-muted-foreground"><a className="underline" href={`tel:${o.phone}`}>{o.phone}</a> · {o.delivery_location}{o.preferred_delivery_date ? ` · ${o.preferred_delivery_date}` : ""}</p><p className="text-xs text-muted-foreground">{new Date(o.created_at).toLocaleString("en-KE")}</p></div>
      <span className={`rounded-full px-3 py-1 text-xs font-bold ${paid ? "bg-success/15 text-success" : "bg-highlight/30"}`}>{paid ? `Paid${o.payment_method ? ` · ${o.payment_method === "mpesa" ? "M-Pesa" : "Cash"}` : ""}` : "Not paid"}</span></div>
    <ul className="mt-3 text-sm">{o.order_items.map((i) => <li key={i.id}>{i.quantity} × {i.product_name}{i.line_total != null ? ` — ${formatKsh(Number(i.line_total))}` : ""}</li>)}</ul>
    {o.message && <p className="mt-2 text-sm italic text-muted-foreground">"{o.message}"</p>}
    <p className="mt-2 font-bold">Total: {o.estimated_total != null ? formatKsh(Number(o.estimated_total)) : "Price to confirm"}</p>
    <div className="mt-4 flex flex-wrap items-end gap-2 border-t pt-4">
      <label className="grid gap-1 text-xs font-semibold">Order status<select className={sel} value={o.status} onChange={(e) => update(o.id, { status: e.target.value as Order["status"] })}>{STATUS.map((s) => <option key={s} value={s}>{STATUS_LABEL[s]}</option>)}</select></label>
      <label className="grid gap-1 text-xs font-semibold">Paid with<select className={sel} value={method} onChange={(e) => setMethod(e.target.value)}><option value="mpesa">M-Pesa</option><option value="cash">Cash</option></select></label>
      {method === "mpesa" && <label className="grid gap-1 text-xs font-semibold">M-Pesa code<Input className="h-10 w-36 uppercase" value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} placeholder="e.g. SJK4XXXXXX" /></label>}
      <label className="grid gap-1 text-xs font-semibold">Amount (KSh)<Input className="h-10 w-28" type="number" min={0} value={amount} onChange={(e) => setAmount(e.target.value)} /></label>
      <Button className="h-10" onClick={() => update(o.id, { payment_status: "paid", payment_method: method, mpesa_code: method === "mpesa" ? code.trim() || null : null, amount_paid: amount ? Number(amount) : null })}>{paid ? "Save payment" : "Mark as paid"}</Button>
      {paid && <Button variant="outline" className="h-10" onClick={() => update(o.id, { payment_status: "unpaid", amount_paid: null, mpesa_code: null })}>Undo payment</Button>}
    </div>
  </article>;
}

function Stock({ products, reload }: { products: ProductRow[]; reload: () => void }) {
  const [adding, setAdding] = useState(false);
  return <><div className="grid gap-3">{products.map((p) => <StockRow key={p.id} p={p} reload={reload} />)}</div>
    {adding ? <NewProduct done={() => { setAdding(false); reload(); }} /> : <Button className="mt-4 h-11" onClick={() => setAdding(true)}>Add a new product</Button>}</>;
}

function StockRow({ p, reload }: { p: ProductRow; reload: () => void }) {
  const [f, setF] = useState({ qty: String(p.quantity_available), price: p.price == null ? "" : String(p.price), ws: p.wholesale_price == null ? "" : String(p.wholesale_price), availability: p.availability, status: p.status });
  const save = async () => {
    const { error } = await supabase.from("products").update({ quantity_available: Number(f.qty) || 0, price: f.price === "" ? null : Number(f.price), wholesale_price: f.ws === "" ? null : Number(f.ws), availability: f.availability, status: f.status }).eq("id", p.id);
    if (error) toast.error("Could not save"); else { toast.success(`${p.name} saved`); reload(); }
  };
  return <div className="flex flex-wrap items-end gap-2 rounded-lg border bg-card p-4">
    <div className="min-w-48 flex-1"><p className="font-bold">{p.name}</p><p className="text-xs text-muted-foreground">{p.category} · per {p.unit}</p></div>
    <label className="grid gap-1 text-xs font-semibold">In stock<Input className="h-10 w-24" type="number" min={0} value={f.qty} onChange={(e) => setF({ ...f, qty: e.target.value })} /></label>
    <label className="grid gap-1 text-xs font-semibold">Price (KSh)<Input className="h-10 w-28" type="number" min={0} placeholder="Ask" value={f.price} onChange={(e) => setF({ ...f, price: e.target.value })} /></label>
    <label className="grid gap-1 text-xs font-semibold">Wholesale<Input className="h-10 w-28" type="number" min={0} placeholder="None" value={f.ws} onChange={(e) => setF({ ...f, ws: e.target.value })} /></label>
    <label className="grid gap-1 text-xs font-semibold">Shown as<select className={sel} value={f.availability} onChange={(e) => setF({ ...f, availability: e.target.value })}>{["Available", "Contact to confirm", "Sold out"].map((a) => <option key={a}>{a}</option>)}</select></label>
    <label className="grid gap-1 text-xs font-semibold">On website<select className={sel} value={f.status} onChange={(e) => setF({ ...f, status: e.target.value })}><option value="available">Show</option><option value="hidden">Hide</option></select></label>
    <Button className="h-10" onClick={save}>Save</Button>
  </div>;
}

function NewProduct({ done }: { done: () => void }) {
  const [busy, setBusy] = useState(false);
  return <form className="mt-4 grid gap-3 rounded-lg border bg-card p-5 sm:grid-cols-2" onSubmit={async (e) => {
    e.preventDefault(); setBusy(true);
    const d = new FormData(e.currentTarget); const name = String(d.get("name")).trim(); const price = String(d.get("price"));
    const { error } = await supabase.from("products").insert({ name, slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""), category: String(d.get("category")), unit: String(d.get("unit")), description: String(d.get("description")), price: price ? Number(price) : null, quantity_available: Number(d.get("qty")) || 0, image_key: "farm" });
    setBusy(false); if (error) toast.error("Could not add product"); else { toast.success("Product added"); done(); }
  }}>
    <Input name="name" required placeholder="Product name" className="h-11" />
    <select name="category" className={sel + " h-11"}>{["Poultry", "Dairy", "Sheep", "Other"].map((c) => <option key={c}>{c}</option>)}</select>
    <Input name="unit" required placeholder="Unit (e.g. bird, tray, kg)" className="h-11" />
    <Input name="price" type="number" min={0} placeholder="Price KSh (leave empty to ask)" className="h-11" />
    <Input name="qty" type="number" min={0} placeholder="Quantity in stock" className="h-11" />
    <Input name="description" required placeholder="Short description" className="h-11" />
    <Button disabled={busy} className="h-11 sm:col-span-2">{busy ? "Saving…" : "Save product"}</Button>
  </form>;
}
