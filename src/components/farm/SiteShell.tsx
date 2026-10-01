import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, Search, ShoppingBasket, X, Facebook, Instagram, Youtube, Phone, Mail, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { farmConfig, products } from "@/lib/farm-data";

const nav = [
  ["Home", "/"], ["About Us", "/about"], ["Kienyeji Chicken", "/kienyeji-chicken"], ["Eggs", "/eggs"],
  ["Cows & Milk", "/cows-milk"], ["Sheep", "/sheep"], ["Farm Products", "/products"], ["Product Finder", "/recommend"], ["Gallery", "/gallery"], ["Contact", "/contact"],
] as const;

export function Header() {
  const [open, setOpen] = useState(false); const [searchOpen, setSearchOpen] = useState(false); const [query, setQuery] = useState("");
  const matches = query.trim().length > 1 ? products.filter((p) => `${p.name} ${p.category}`.toLowerCase().includes(query.toLowerCase())).slice(0, 5) : [];
  return <>
    <div className="bg-primary px-4 py-2 text-center text-xs font-semibold text-primary-foreground">Farm-raised in Kenya · Retail & wholesale enquiries welcome</div>
    <header className="sticky top-0 z-40 border-b border-border/80 bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between gap-4 px-4 lg:px-6">
        <Link to="/" className="flex items-center gap-3" aria-label={farmConfig.name}><span className="grid size-10 place-items-center rounded-full bg-primary font-display text-lg font-black text-primary-foreground">K</span><span className="hidden font-display text-lg font-black leading-none text-primary sm:block">KENP <span className="block text-xs font-bold text-foreground">KIENYEJI FARM</span></span></Link>
        <nav className="hidden items-center gap-5 xl:flex">{nav.map(([label, to]) => <Link key={to} to={to} className="text-sm font-semibold text-foreground/80 transition hover:text-primary" activeProps={{ className: "text-primary" }}>{label}</Link>)}</nav>
        <div className="flex items-center gap-1"><Button variant="ghost" size="icon" onClick={() => setSearchOpen(!searchOpen)} aria-label="Search products"><Search /></Button><Button asChild className="hidden sm:inline-flex"><Link to="/order"><ShoppingBasket /> Order Now</Link></Button><Button variant="ghost" size="icon" className="xl:hidden" onClick={() => setOpen(!open)} aria-label="Open menu">{open ? <X /> : <Menu />}</Button></div>
      </div>
      {searchOpen && <div className="absolute inset-x-0 top-full border-b border-border bg-background p-4 shadow-xl"><div className="mx-auto max-w-xl"><label className="sr-only" htmlFor="site-search">Search farm products</label><input id="site-search" autoFocus value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search chicken, eggs, milk, cows or sheep…" className="h-12 w-full rounded-md border border-input bg-background px-4 text-base outline-none focus:ring-2 focus:ring-ring" />{matches.length > 0 && <div className="mt-2 rounded-md border bg-card p-2">{matches.map((p) => <Link key={p.slug} to="/products/$slug" params={{ slug: p.slug }} onClick={() => setSearchOpen(false)} className="flex items-center gap-3 rounded-md p-2 hover:bg-muted"><img src={p.image} alt="" className="size-12 rounded object-cover"/><span className="font-semibold">{p.name}</span></Link>)}</div>}</div></div>}
      {open && <nav className="border-t border-border bg-background p-4 xl:hidden"><div className="grid gap-1">{nav.map(([label, to]) => <Link key={to} to={to} onClick={() => setOpen(false)} className="rounded-md px-3 py-3 font-semibold hover:bg-muted">{label}</Link>)}<Button asChild className="mt-2 h-12"><Link to="/order" onClick={() => setOpen(false)}>Order Now</Link></Button></div></nav>}
    </header>
  </>;
}

export function Footer() { return <footer className="bg-footer text-footer-foreground"><div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 md:grid-cols-2 lg:grid-cols-4"><div><p className="font-display text-xl font-black">{farmConfig.name}</p><p className="mt-3 max-w-xs text-sm leading-6 text-footer-muted">{farmConfig.tagline}</p><div className="mt-5 flex gap-2">{[Facebook, Instagram, Youtube].map((Icon, i) => <span key={i} className="grid size-9 place-items-center rounded-full border border-footer-border"><Icon className="size-4" /></span>)}</div></div><FooterLinks title="Explore" links={[["Home","/"],["About","/about"],["Products","/products"],["Gallery","/gallery"],["Contact","/contact"]]} /><FooterLinks title="Farm products" links={[["Kienyeji Chicken","/kienyeji-chicken"],["Fresh Eggs","/eggs"],["Cows & Milk","/cows-milk"],["Sheep","/sheep"]]} /><div><p className="font-bold">Contact</p><div className="mt-4 space-y-3 text-sm text-footer-muted"><p className="flex gap-2"><Phone className="size-4" />{farmConfig.phone}</p><p className="flex gap-2"><Mail className="size-4" />{farmConfig.email}</p><p className="flex gap-2"><MapPin className="size-4" />{farmConfig.location}</p></div></div></div><div className="border-t border-footer-border px-5 py-5 text-center text-xs text-footer-muted">© 2026 {farmConfig.name}. All Rights Reserved.</div></footer>; }
function FooterLinks({ title, links }: { title: string; links: readonly (readonly [string,string])[] }) { return <div><p className="font-bold">{title}</p><div className="mt-4 grid gap-3">{links.map(([label,to]) => <Link key={to} to={to} className="text-sm text-footer-muted hover:text-footer-foreground">{label}</Link>)}</div></div>; }
