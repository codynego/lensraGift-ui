"use client";

// app/shop/page.tsx
// Adire — Shop / Marketplace page
// Brand: Bold, cultural, unapologetically Nigerian
// Fonts: Playfair Display (display) · Syne (body)
// Palette: indigo · amber · cream · terracotta · forest

import { useState, useEffect, useCallback, Suspense, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Search, ChevronRight, Filter, Loader2,
  ChevronLeft, ChevronDown, ChevronUp, X,
  Package, Tag as TagIcon, Eye, Heart, Zap,
} from "lucide-react";

const BaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.lensra.com/";

// ── Types ─────────────────────────────────────────────────────────────────────

interface Product {
  id: number;
  name: string;
  slug: string;
  base_price: string;
  image_url: string | null;
  category_path: string;
  tags: Tag[];
  is_active: boolean;
  is_trending?: boolean;
  is_new?: boolean;
}

interface Category {
  id: number;
  name: string;
  slug: string;
  parent_id?: number;
  parent_name?: string | null;
  subcategories?: Category[];
  full_path: string;
}

interface Tag { name: string; slug: string; }

interface PriceRange { label: string; value: string; min?: number; max?: number; }

interface SortOption { label: string; value: string; ordering: string; }

// ── Ankara pattern SVG ────────────────────────────────────────────────────────

function AnkaraPattern({ color = "#C17B3A", opacity = 0.07 }: {
  color?: string; opacity?: number;
}) {
  return (
    <svg aria-hidden style={{
      position: "absolute", inset: 0, width: "100%", height: "100%",
      pointerEvents: "none", opacity,
    }}>
      <defs>
        <pattern id={`ap-${color.replace("#","")}`}
          x="0" y="0" width="48" height="48" patternUnits="userSpaceOnUse">
          <circle cx="24" cy="24" r="4" fill={color} />
          <circle cx="24" cy="24" r="9"  fill="none" stroke={color} strokeWidth="0.6" />
          <circle cx="24" cy="24" r="15" fill="none" stroke={color} strokeWidth="0.35" />
          <circle cx="24" cy="24" r="21" fill="none" stroke={color} strokeWidth="0.2" />
          <line x1="0" y1="24" x2="48" y2="24" stroke={color} strokeWidth="0.2" />
          <line x1="24" y1="0" x2="24" y2="48" stroke={color} strokeWidth="0.2" />
          <line x1="0" y1="0"  x2="48" y2="48" stroke={color} strokeWidth="0.15" />
          <line x1="48" y1="0" x2="0"  y2="48" stroke={color} strokeWidth="0.15" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#ap-${color.replace("#","")})`} />
    </svg>
  );
}

// ── Grain ─────────────────────────────────────────────────────────────────────

function Grain() {
  return (
    <svg aria-hidden style={{
      position: "fixed", inset: 0, width: "100%", height: "100%",
      pointerEvents: "none", zIndex: 9999, opacity: 0.022,
      mixBlendMode: "multiply",
    }}>
      <filter id="g">
        <feTurbulence type="fractalNoise" baseFrequency="0.72"
          numOctaves="3" stitchTiles="stitch" />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#g)" />
    </svg>
  );
}

// ── Placeholder tile ──────────────────────────────────────────────────────────

function AnkaraTile() {
  return (
    <svg width="72" height="72" viewBox="0 0 72 72" fill="none" opacity={0.3}>
      <circle cx="36" cy="36" r="8"  fill="#C17B3A" />
      <circle cx="36" cy="36" r="16" fill="none" stroke="#C17B3A" strokeWidth="1" />
      <circle cx="36" cy="36" r="24" fill="none" stroke="#C17B3A" strokeWidth="0.5" />
      <line x1="0" y1="36" x2="72" y2="36" stroke="#C17B3A" strokeWidth="0.5" />
      <line x1="36" y1="0" x2="36" y2="72" stroke="#C17B3A" strokeWidth="0.5" />
      <line x1="0" y1="0"  x2="72" y2="72" stroke="#C17B3A" strokeWidth="0.3" />
      <line x1="72" y1="0" x2="0"  y2="72" stroke="#C17B3A" strokeWidth="0.3" />
    </svg>
  );
}

// ── Product card ──────────────────────────────────────────────────────────────

function ProductCard({ product, index }: { product: Product; index: number }) {
  const [isFav, setIsFav] = useState(false);
  const [buying, setBuying] = useState(false);
  const router = useRouter();
  const [pending, start] = useTransition();

  const go = () => start(() => router.push(`/shop/${product.slug}`));

  const quickBuy = async (e: React.MouseEvent) => {
    e.stopPropagation(); e.preventDefault();
    setBuying(true);
    let sid = localStorage.getItem("guest_session_id");
    if (!sid) { sid = crypto.randomUUID(); localStorage.setItem("guest_session_id", sid); }
    try {
      const token = localStorage.getItem("access_token");
      const res = await fetch(`${BaseUrl}api/orders/cart/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({
          product: product.id, quantity: 1,
          ...(!token && { session_id: sid }),
        }),
      });
      if (res.ok) { window.dispatchEvent(new Event("storage")); router.push("/checkout"); }
    } catch (e) { console.error(e); }
    finally { setBuying(false); }
  };

  const isOdd = index % 2 !== 0;

  return (
    <div
      onClick={go}
      className="ad-card"
      style={{ marginTop: isOdd ? "32px" : "0" }}
    >
      <div className="ad-card-img-wrap">
        {pending && (
          <div className="ad-card-loading">
            <Loader2 size={24} className="ad-spin" />
          </div>
        )}

        {product.image_url ? (
          <img src={product.image_url} alt={product.name} className="ad-card-img" />
        ) : (
          <div className="ad-card-placeholder">
            <AnkaraTile />
            <span className="ad-card-placeholder-text">
              {product.category_path || "Ankara Gift"}
            </span>
          </div>
        )}

        <div className="ad-card-overlay">
          <button onClick={quickBuy} disabled={buying} className="ad-card-quick">
            {buying ? <Loader2 size={14} className="ad-spin" /> : <Zap size={14} />}
            Quick Buy
          </button>
          <button onClick={(e) => { e.stopPropagation(); go(); }} className="ad-card-view">
            <Eye size={14} /> View
          </button>
        </div>

        <button
          onClick={(e) => { e.stopPropagation(); e.preventDefault(); setIsFav(v => !v); }}
          className={`ad-card-fav ${isFav ? "ad-fav-active" : ""}`}
        >
          <Heart size={15} fill={isFav ? "#8B3A2A" : "none"} />
        </button>

        {product.is_trending && <span className="ad-badge ad-badge-hot">Hot</span>}
        {product.is_new && <span className="ad-badge ad-badge-new">New</span>}
      </div>

      <div className="ad-card-body">
        <span className="ad-card-cat">{product.category_path}</span>
        <h3 className="ad-card-name">{product.name}</h3>
        <div className="ad-card-foot">
          <span className="ad-card-price">
            ₦{parseFloat(product.base_price).toLocaleString()}
          </span>
          <span className="ad-card-arrow">→</span>
        </div>
      </div>
    </div>
  );
}

// ── Category tree item ────────────────────────────────────────────────────────

interface CatItemProps {
  cat: Category; depth?: number;
  selectedCategory: string; onSelect: (s: string) => void;
}

function CatItem({ cat, depth = 0, selectedCategory, onSelect }: CatItemProps) {
  const [open, setOpen] = useState(false);
  const hasSubs = (cat.subcategories?.length ?? 0) > 0;
  const active = selectedCategory === cat.slug;

  return (
    <>
      <button
        onClick={() => { onSelect(cat.slug); if (hasSubs) setOpen(v => !v); }}
        className={`ad-cat-btn ${active ? "ad-cat-active" : ""}`}
        style={{ paddingLeft: `${depth * 14 + 14}px` }}
      >
        <span>{cat.name}</span>
        {hasSubs
          ? open ? <ChevronUp size={13} /> : <ChevronDown size={13} />
          : <ChevronRight size={13} />}
      </button>
      {open && hasSubs && cat.subcategories!.map(s => (
        <CatItem key={s.id} cat={s} depth={depth + 1}
          selectedCategory={selectedCategory} onSelect={onSelect} />
      ))}
    </>
  );
}

// ── Main content ──────────────────────────────────────────────────────────────

function ShopContent() {
  const router = useRouter();
  const params = useSearchParams();

  const [products,   setProducts]   = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [topCats,    setTopCats]    = useState<Category[]>([]);
  const [tags,       setTags]       = useState<Tag[]>([]);

  const [loading,  setLoading]  = useState(true);
  const [catLoad,  setCatLoad]  = useState(true);
  const [tagLoad,  setTagLoad]  = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [scrollTop,  setScrollTop]  = useState(false);

  const [q,        setQ]        = useState("");
  const [selCat,   setSelCat]   = useState("all");
  const [selPrice, setSelPrice] = useState("all");
  const [selTags,  setSelTags]  = useState<string[]>([]);
  const [sort,     setSort]     = useState("featured");
  const [page,     setPage]     = useState(1);
  const [total,    setTotal]    = useState(0);

  const PER_PAGE = 12;

  const PRICES: PriceRange[] = [
    { label: "Any Price",       value: "all" },
    { label: "Under ₦3,000",   value: "u3k",  min: 0,    max: 2999   },
    { label: "₦3,000 – ₦5,000",value: "3k5k", min: 3000, max: 5000   },
    { label: "Over ₦5,000",    value: "o5k",  min: 5001, max: 1000000 },
  ];

  const SORTS: SortOption[] = [
    { label: "Featured",        value: "featured",   ordering: ""           },
    { label: "Price: Low → High",value: "price_asc", ordering: "base_price" },
    { label: "Price: High → Low",value: "price_desc",ordering: "-base_price"},
    { label: "Newest",          value: "newest",     ordering: "-created_at"},
  ];

  // scroll-to-top visibility
  useEffect(() => {
    const fn = () => setScrollTop(window.scrollY > 400);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  // fetch categories
  useEffect(() => {
    fetch(`${BaseUrl}api/products/categories/`)
      .then(r => r.json())
      .then(d => {
        const a: Category[] = Array.isArray(d) ? d : (d.results ?? []);
        setCategories(a);
        setTopCats(a.filter(c => !c.parent_id));
      })
      .catch(() => { setCategories([]); setTopCats([]); })
      .finally(() => setCatLoad(false));
  }, []);

  // fetch tags
  useEffect(() => {
    fetch(`${BaseUrl}api/products/tags/`)
      .then(r => r.json())
      .then(d => setTags(Array.isArray(d) ? d : (d.results ?? [])))
      .catch(() => setTags([]))
      .finally(() => setTagLoad(false));
  }, []);

  // init from URL
  useEffect(() => {
    setQ(params.get("q") || "");
    setSelCat(params.get("category") || "all");
    setSelPrice(params.get("price") || "all");
    setSelTags(params.get("tags") ? params.get("tags")!.split(",") : []);
    setSort(params.get("sort") || "featured");
    setPage(Number(params.get("page")) || 1);
  }, [params]);

  // fetch products
  useEffect(() => {
    const t = setTimeout(async () => {
      setLoading(true);
      try {
        const p = new URLSearchParams();
        if (q) p.append("search", q);
        if (selCat !== "all") p.append("category", selCat);
        const range = PRICES.find(r => r.value === selPrice);
        if (range?.min !== undefined) p.append("min_price", range.min.toString());
        if (range?.max !== undefined) p.append("max_price", range.max.toString());
        if (selTags.length) p.append("tags", selTags.join(","));
        const so = SORTS.find(s => s.value === sort);
        if (so?.ordering) p.append("ordering", so.ordering);
        p.append("page", page.toString());
        p.append("page_size", PER_PAGE.toString());
        const res  = await fetch(`${BaseUrl}api/products/?${p}`);
        const data = await res.json();
        setProducts(data.results ?? (Array.isArray(data) ? data : []));
        setTotal(data.count ?? 0);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    }, 300);
    return () => clearTimeout(t);
  }, [q, selCat, selPrice, selTags, sort, page]);

  // sync URL
  const syncURL = useCallback(() => {
    const p = new URLSearchParams();
    if (q) p.set("q", q);
    if (selCat !== "all") p.set("category", selCat);
    if (selPrice !== "all") p.set("price", selPrice);
    if (selTags.length) p.set("tags", selTags.join(","));
    if (sort !== "featured") p.set("sort", sort);
    if (page > 1) p.set("page", page.toString());
    router.push(p.toString() ? `/shop?${p}` : "/shop", { scroll: false });
  }, [q, selCat, selPrice, selTags, sort, page, router]);

  useEffect(() => { syncURL(); }, [syncURL]);

  const totalPages = Math.ceil(total / PER_PAGE);

  const clearAll = () => {
    setQ(""); setSelCat("all"); setSelPrice("all");
    setSelTags([]); setSort("featured"); setPage(1);
  };

  const activeCount =
    (selCat !== "all" ? 1 : 0) +
    (selPrice !== "all" ? 1 : 0) +
    selTags.length;

  // find top-level category for a slug
  const findTop = (slug: string): Category | null => {
    if (slug === "all") return null;
    for (const c of topCats) {
      if (c.slug === slug) return c;
      if (c.subcategories?.find(s => s.slug === slug)) return c;
    }
    return null;
  };
  const selTop = findTop(selCat);

  // pagination numbers
  const pages: (number | "…")[] = [];
  if (totalPages > 1) {
    pages.push(1);
    if (page > 3) pages.push("…");
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) pages.push(i);
    if (page < totalPages - 2) pages.push("…");
    if (!pages.includes(totalPages)) pages.push(totalPages);
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=Syne:wght@400;500;600;700;800&display=swap');

        :root {
          --indigo:  #1B2A4A;
          --indigo-d:#0e1a30;
          --amber:   #C17B3A;
          --amber-l: #D4956A;
          --amber-p: #F0DFC4;
          --cream:   #F5F0E8;
          --cream-l: #FDF9F4;
          --terra:   #8B3A2A;
          --forest:  #2A4A2E;
          --cocoa:   #2C1810;
          --muted:   #7A6E60;
          --rule:    #E2D4BE;
          --disp:    'Playfair Display', Georgia, serif;
          --body:    'Syne', system-ui, sans-serif;
          --ease:    cubic-bezier(0.16,1,0.3,1);
        }

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body {
          background: var(--cream);
          color: var(--cocoa);
          font-family: var(--body);
          -webkit-font-smoothing: antialiased;
          overflow-x: hidden;
        }

        /* ── PAGE HEADER ── */
        .ad-shop-header {
          background: var(--indigo-d);
          padding: 120px 5vw 56px;
          position: relative; overflow: hidden;
        }
        .ad-shop-header-inner {
          position: relative; z-index: 1;
          display: flex; align-items: flex-end;
          justify-content: space-between;
          flex-wrap: wrap; gap: 32px;
        }
        .ad-shop-overline {
          font-size: 10px; font-weight: 700;
          letter-spacing: 0.4em; text-transform: uppercase;
          color: var(--amber); margin-bottom: 12px;
          display: flex; align-items: center; gap: 12px;
        }
        .ad-shop-overline::before {
          content: ''; width: 24px; height: 2px;
          background: var(--amber);
        }
        .ad-shop-h1 {
          font-family: var(--disp);
          font-size: clamp(40px, 6vw, 88px);
          font-weight: 900; line-height: 0.88;
          letter-spacing: -0.03em; color: var(--cream);
        }
        .ad-shop-h1 em {
          font-style: italic; font-weight: 400;
          color: var(--amber); display: block;
        }
        .ad-shop-count {
          font-size: 13px; font-weight: 600;
          letter-spacing: 0.18em; text-transform: uppercase;
          color: rgba(193,123,58,0.5);
          margin-top: 12px;
        }
        .ad-shop-header-right {
          display: flex; flex-direction: column;
          align-items: flex-end; gap: 12px;
        }

        /* Search bar */
        .ad-search-wrap {
          position: relative; width: 360px; max-width: 100%;
        }
        .ad-search-icon {
          position: absolute; left: 16px; top: 50%;
          transform: translateY(-50%);
          color: rgba(193,123,58,0.5);
          pointer-events: none;
        }
        .ad-search-input {
          width: 100%;
          background: rgba(255,255,255,0.05);
          border: 1.5px solid rgba(193,123,58,0.2);
          color: var(--cream);
          font-family: var(--body);
          font-size: 14px; font-weight: 400;
          padding: 14px 44px 14px 46px;
          outline: none;
          transition: border-color 0.2s;
        }
        .ad-search-input::placeholder { color: rgba(193,123,58,0.35); }
        .ad-search-input:focus { border-color: var(--amber); }
        .ad-search-clear {
          position: absolute; right: 14px; top: 50%;
          transform: translateY(-50%);
          background: none; border: none; cursor: pointer;
          color: rgba(193,123,58,0.5);
          display: flex; align-items: center;
          transition: color 0.2s;
        }
        .ad-search-clear:hover { color: var(--amber); }

        /* Sort */
        .ad-sort-wrap { position: relative; }
        .ad-sort-select {
          appearance: none;
          background: rgba(255,255,255,0.05);
          border: 1.5px solid rgba(193,123,58,0.2);
          color: var(--cream);
          font-family: var(--body);
          font-size: 11px; font-weight: 600;
          letter-spacing: 0.15em; text-transform: uppercase;
          padding: 12px 44px 12px 18px;
          cursor: pointer; outline: none;
          transition: border-color 0.2s;
        }
        .ad-sort-select:focus { border-color: var(--amber); }
        .ad-sort-chevron {
          position: absolute; right: 14px; top: 50%;
          transform: translateY(-50%);
          color: rgba(193,123,58,0.5); pointer-events: none;
        }

        /* Mobile filter button */
        .ad-mobile-filter-btn {
          display: none;
          align-items: center; gap: 8px;
          background: var(--amber); color: #fff;
          border: none; cursor: pointer;
          padding: 13px 22px;
          font-family: var(--body);
          font-size: 11px; font-weight: 700;
          letter-spacing: 0.2em; text-transform: uppercase;
          position: relative;
          transition: background 0.2s;
        }
        .ad-mobile-filter-btn:hover { background: var(--amber-l); }
        .ad-filter-badge {
          position: absolute; top: -8px; right: -8px;
          width: 20px; height: 20px; border-radius: 50%;
          background: var(--terra); color: #fff;
          font-size: 10px; font-weight: 800;
          display: flex; align-items: center; justify-content: center;
        }

        /* Mobile category pills */
        .ad-cat-pills {
          display: none;
          padding: 16px 5vw;
          background: var(--indigo-d);
          border-top: 1px solid rgba(193,123,58,0.1);
          gap: 8px; overflow-x: auto;
          scrollbar-width: none;
        }
        .ad-cat-pills::-webkit-scrollbar { display: none; }
        .ad-cat-pill {
          flex-shrink: 0;
          padding: 8px 18px;
          font-family: var(--body);
          font-size: 10px; font-weight: 700;
          letter-spacing: 0.18em; text-transform: uppercase;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(193,123,58,0.15);
          color: rgba(245,240,232,0.6);
          cursor: pointer;
          transition: all 0.2s; white-space: nowrap;
        }
        .ad-cat-pill.active {
          background: var(--amber);
          border-color: var(--amber);
          color: #fff;
        }

        /* ── LAYOUT ── */
        .ad-shop-body {
          display: flex; gap: 0;
          max-width: 1440px; margin: 0 auto;
        }

        /* ── SIDEBAR ── */
        .ad-sidebar {
          width: 280px; flex-shrink: 0;
          padding: 40px 28px;
          background: var(--cream-l);
          border-right: 1px solid var(--rule);
          position: sticky; top: 0;
          height: 100vh; overflow-y: auto;
          scrollbar-width: thin;
          scrollbar-color: var(--amber-p) transparent;
        }
        .ad-sidebar::-webkit-scrollbar { width: 4px; }
        .ad-sidebar::-webkit-scrollbar-thumb { background: var(--amber-p); }

        .ad-sidebar-section { margin-bottom: 36px; }
        .ad-sidebar-head {
          font-size: 9px; font-weight: 800;
          letter-spacing: 0.38em; text-transform: uppercase;
          color: var(--amber); margin-bottom: 16px;
          display: flex; align-items: center; gap: 8px;
          padding-bottom: 10px;
          border-bottom: 1.5px solid var(--amber-p);
        }

        /* Category buttons in sidebar */
        .ad-cat-btn {
          display: flex; align-items: center;
          justify-content: space-between;
          width: 100%; padding: 10px 14px;
          font-family: var(--body);
          font-size: 12px; font-weight: 600;
          color: var(--muted);
          background: none; border: none; cursor: pointer;
          transition: color 0.2s, background 0.2s;
          text-align: left;
        }
        .ad-cat-btn:hover { color: var(--indigo); background: var(--amber-p); }
        .ad-cat-btn.ad-cat-active {
          background: var(--indigo);
          color: var(--cream);
        }

        /* Price radio */
        .ad-radio-row {
          display: flex; align-items: center; gap: 12px;
          padding: 9px 0; cursor: pointer;
        }
        .ad-radio-row input { accent-color: var(--amber); width: 15px; height: 15px; }
        .ad-radio-label {
          font-size: 13px; font-weight: 500; color: var(--muted);
          transition: color 0.2s;
        }
        .ad-radio-row:hover .ad-radio-label { color: var(--indigo); }

        /* Tag checkbox */
        .ad-tag-row {
          display: flex; align-items: center; gap: 12px;
          padding: 8px 0; cursor: pointer;
        }
        .ad-tag-row input { accent-color: var(--amber); width: 14px; height: 14px; }
        .ad-tag-label {
          font-size: 13px; font-weight: 500; color: var(--muted);
          transition: color 0.2s;
        }
        .ad-tag-row:hover .ad-tag-label { color: var(--indigo); }
        .ad-tag-overflow {
          max-height: 220px; overflow-y: auto;
          scrollbar-width: thin;
          scrollbar-color: var(--amber-p) transparent;
        }

        /* Clear button */
        .ad-clear-btn {
          width: 100%; padding: 13px;
          background: var(--indigo);
          color: var(--cream);
          font-family: var(--body);
          font-size: 10px; font-weight: 700;
          letter-spacing: 0.22em; text-transform: uppercase;
          border: none; cursor: pointer;
          transition: background 0.2s;
          margin-top: 8px;
        }
        .ad-clear-btn:hover { background: var(--terra); }

        /* ── MAIN ── */
        .ad-shop-main { flex: 1; padding: 40px 5vw; }

        /* Active filter chips */
        .ad-active-filters {
          display: flex; align-items: center;
          flex-wrap: wrap; gap: 8px;
          margin-bottom: 32px;
        }
        .ad-filter-chip {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 6px 14px;
          background: var(--amber-p);
          border: 1px solid var(--amber);
          font-size: 11px; font-weight: 600;
          letter-spacing: 0.1em; color: var(--cocoa);
          cursor: pointer;
          transition: background 0.2s;
        }
        .ad-filter-chip:hover { background: var(--amber); color: #fff; }

        /* Products asymmetric grid */
        .ad-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 28px;
          align-items: start;
        }

        /* ── PRODUCT CARD ── */
        .ad-card {
          cursor: pointer;
          transition: transform 0.3s var(--ease);
        }
        .ad-card:hover { transform: translateY(-4px); }
        .ad-card-img-wrap {
          position: relative; aspect-ratio: 3/4;
          overflow: hidden; background: var(--amber-p);
        }
        .ad-card-img {
          width: 100%; height: 100%; object-fit: cover;
          transition: transform 0.8s var(--ease);
        }
        .ad-card:hover .ad-card-img { transform: scale(1.07); }
        .ad-card-placeholder {
          width: 100%; height: 100%;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center; gap: 12px;
          background: linear-gradient(145deg, var(--amber-p) 0%, var(--shea, #E8D5B0) 100%);
        }
        .ad-card-placeholder-text {
          font-family: var(--disp);
          font-size: 12px; font-style: italic; color: var(--amber);
        }
        .ad-card-loading {
          position: absolute; inset: 0;
          background: rgba(245,240,232,0.8);
          display: flex; align-items: center; justify-content: center;
          z-index: 10;
        }
        .ad-card-overlay {
          position: absolute; inset: 0;
          background: rgba(27,42,74,0);
          display: flex; flex-direction: column;
          align-items: stretch;
          justify-content: flex-end;
          padding: 16px; gap: 8px;
          transition: background 0.3s;
        }
        .ad-card:hover .ad-card-overlay { background: rgba(27,42,74,0.52); }
        .ad-card-quick, .ad-card-view {
          display: flex; align-items: center; justify-content: center; gap: 7px;
          padding: 11px;
          font-family: var(--body);
          font-size: 10px; font-weight: 700;
          letter-spacing: 0.2em; text-transform: uppercase;
          border: none; cursor: pointer;
          opacity: 0; transform: translateY(14px);
          transition: opacity 0.3s, transform 0.3s, background 0.2s;
        }
        .ad-card:hover .ad-card-quick,
        .ad-card:hover .ad-card-view { opacity: 1; transform: translateY(0); }
        .ad-card-quick {
          background: var(--amber); color: #fff;
          transition-delay: 0.04s;
        }
        .ad-card-quick:hover { background: var(--amber-l); }
        .ad-card-quick:disabled { opacity: 0.5; cursor: not-allowed; }
        .ad-card-view {
          background: #fff; color: var(--indigo);
          transition-delay: 0.08s;
        }
        .ad-card-view:hover { background: var(--indigo); color: #fff; }
        .ad-card-fav {
          position: absolute; top: 14px; right: 14px;
          width: 34px; height: 34px; border-radius: 50%;
          background: rgba(255,255,255,0.9);
          border: none; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          opacity: 0; transition: opacity 0.2s, transform 0.2s;
          color: var(--muted);
        }
        .ad-card:hover .ad-card-fav { opacity: 1; }
        .ad-card-fav:hover { transform: scale(1.1); }
        .ad-fav-active { color: var(--terra); }
        .ad-badge {
          position: absolute; top: 14px; left: 14px;
          font-family: var(--body);
          font-size: 8px; font-weight: 800;
          letter-spacing: 0.28em; text-transform: uppercase;
          padding: 5px 12px; color: #fff;
        }
        .ad-badge-hot { background: var(--terra); }
        .ad-badge-new { background: var(--forest); }
        .ad-card-body { padding: 14px 0 0; }
        .ad-card-cat {
          display: block;
          font-size: 9px; font-weight: 700;
          letter-spacing: 0.28em; text-transform: uppercase;
          color: var(--amber); margin-bottom: 5px;
        }
        .ad-card-name {
          font-family: var(--disp);
          font-size: 18px; font-weight: 700;
          color: var(--indigo); line-height: 1.15;
          margin-bottom: 10px;
          display: -webkit-box;
          -webkit-line-clamp: 2; -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .ad-card-foot {
          display: flex; align-items: center;
          justify-content: space-between;
        }
        .ad-card-price {
          font-size: 14px; font-weight: 700; color: var(--muted);
        }
        .ad-card-arrow {
          font-size: 20px; color: var(--amber);
          transition: transform 0.2s;
        }
        .ad-card:hover .ad-card-arrow { transform: translateX(4px); }

        /* ── EMPTY / LOADING STATES ── */
        .ad-state {
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          min-height: 480px; gap: 20px; text-align: center;
        }
        .ad-state-icon {
          width: 80px; height: 80px;
          background: var(--amber-p);
          display: flex; align-items: center; justify-content: center;
          font-size: 36px;
        }
        .ad-state-title {
          font-family: var(--disp);
          font-size: 28px; font-weight: 700; color: var(--indigo);
        }
        .ad-state-body {
          font-size: 14px; font-weight: 400; color: var(--muted);
          max-width: 340px; line-height: 1.75;
        }
        .ad-state-btn {
          background: var(--amber); color: #fff;
          border: none; cursor: pointer;
          padding: 15px 36px;
          font-family: var(--body);
          font-size: 11px; font-weight: 700;
          letter-spacing: 0.22em; text-transform: uppercase;
          transition: background 0.2s;
        }
        .ad-state-btn:hover { background: var(--amber-l); }

        .ad-spinner {
          width: 48px; height: 48px;
          border: 3px solid var(--amber-p);
          border-top-color: var(--amber);
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        .ad-spin { animation: spin 0.8s linear infinite; }

        /* ── PAGINATION ── */
        .ad-pagination {
          display: flex; align-items: center;
          justify-content: center; gap: 8px;
          margin-top: 64px; flex-wrap: wrap;
        }
        .ad-page-btn {
          padding: 10px 18px;
          font-family: var(--body);
          font-size: 12px; font-weight: 700;
          background: var(--cream-l);
          border: 1.5px solid var(--rule);
          color: var(--muted); cursor: pointer;
          transition: all 0.2s;
        }
        .ad-page-btn:hover:not(:disabled) {
          border-color: var(--amber); color: var(--amber);
        }
        .ad-page-btn.active {
          background: var(--indigo);
          border-color: var(--indigo);
          color: var(--cream);
        }
        .ad-page-btn:disabled { opacity: 0.35; cursor: not-allowed; }
        .ad-page-ellipsis {
          font-size: 14px; color: var(--muted); padding: 0 4px;
        }

        /* ── DRAWER ── */
        .ad-drawer-backdrop {
          position: fixed; inset: 0; z-index: 500;
          background: rgba(14,26,48,0.7);
          backdrop-filter: blur(4px);
        }
        .ad-drawer {
          position: absolute; bottom: 0; left: 0; right: 0;
          background: var(--cream);
          border-radius: 20px 20px 0 0;
          padding: 28px 24px 40px;
          max-height: 88vh; overflow-y: auto;
        }
        .ad-drawer-head {
          display: flex; align-items: center;
          justify-content: space-between;
          padding-bottom: 20px;
          border-bottom: 1.5px solid var(--rule);
          margin-bottom: 24px;
        }
        .ad-drawer-title {
          font-family: var(--disp);
          font-size: 22px; font-weight: 700; color: var(--indigo);
        }
        .ad-drawer-close {
          background: none; border: none; cursor: pointer;
          color: var(--muted); padding: 6px;
          transition: color 0.2s;
        }
        .ad-drawer-close:hover { color: var(--indigo); }
        .ad-drawer-section { margin-bottom: 28px; }
        .ad-drawer-section-head {
          font-size: 9px; font-weight: 800;
          letter-spacing: 0.38em; text-transform: uppercase;
          color: var(--amber); margin-bottom: 14px;
        }
        .ad-drawer-clear {
          width: 100%; padding: 16px;
          background: var(--amber); color: #fff;
          border: none; cursor: pointer;
          font-family: var(--body);
          font-size: 11px; font-weight: 700;
          letter-spacing: 0.22em; text-transform: uppercase;
          margin-top: 8px;
          transition: background 0.2s;
        }
        .ad-drawer-clear:hover { background: var(--amber-l); }

        /* ── SCROLL TOP ── */
        .ad-scroll-top {
          position: fixed; bottom: 32px; right: 32px; z-index: 200;
          width: 48px; height: 48px;
          background: var(--amber); color: #fff;
          border: none; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 4px 24px rgba(193,123,58,0.35);
          transition: background 0.2s, transform 0.2s;
        }
        .ad-scroll-top:hover { background: var(--indigo); transform: translateY(-2px); }

        /* ── RESPONSIVE ── */
        @media (max-width: 1100px) {
          .ad-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 900px) {
          .ad-sidebar { display: none; }
          .ad-mobile-filter-btn { display: flex; }
          .ad-cat-pills { display: flex; }
          .ad-shop-header-right { flex-direction: row; align-items: center; }
          .ad-sort-wrap { display: none; }
          .ad-grid { grid-template-columns: repeat(2, 1fr); gap: 16px; }
        }
        @media (max-width: 520px) {
          .ad-grid { grid-template-columns: 1fr; }
          .ad-shop-header { padding: 110px 5vw 40px; }
        }
      `}</style>

      <Grain />

      {/* ── PAGE HEADER ── */}
      <header className="ad-shop-header">
        <AnkaraPattern color="#C17B3A" opacity={0.06} />
        <div className="ad-shop-header-inner">
          <div>
            <div className="ad-shop-overline">Lensra Shop</div>
            <h1 className="ad-shop-h1">
              All<br /><em>Products.</em>
            </h1>
            <p className="ad-shop-count">
              {total} {total === 1 ? "product" : "products"} available
            </p>
          </div>

          <div className="ad-shop-header-right">
            {/* Search */}
            <div className="ad-search-wrap">
              <Search size={16} className="ad-search-icon" />
              <input
                type="text"
                placeholder="Search products..."
                value={q}
                onChange={e => setQ(e.target.value)}
                className="ad-search-input"
              />
              {q && (
                <button onClick={() => setQ("")} className="ad-search-clear">
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Sort — desktop */}
            <div className="ad-sort-wrap">
              <select value={sort} onChange={e => setSort(e.target.value)}
                className="ad-sort-select">
                {SORTS.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
              <ChevronDown size={14} className="ad-sort-chevron" />
            </div>

            {/* Mobile filter button */}
            <button onClick={() => setDrawerOpen(true)}
              className="ad-mobile-filter-btn">
              <Filter size={15} />
              Filters
              {activeCount > 0 && (
                <span className="ad-filter-badge">{activeCount}</span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* ── MOBILE CATEGORY PILLS ── */}
      <div className="ad-cat-pills">
        <button
          onClick={() => setSelCat("all")}
          className={`ad-cat-pill ${selCat === "all" ? "active" : ""}`}
        >
          All
        </button>
        {topCats.map(c => (
          <button key={c.id}
            onClick={() => setSelCat(c.slug)}
            className={`ad-cat-pill ${selCat === c.slug ? "active" : ""}`}
          >
            {c.name}
          </button>
        ))}
        {selTop?.subcategories?.map(s => (
          <button key={s.id}
            onClick={() => setSelCat(s.slug)}
            className={`ad-cat-pill ${selCat === s.slug ? "active" : ""}`}
          >
            {s.name}
          </button>
        ))}
      </div>

      {/* ── BODY ── */}
      <div className="ad-shop-body">

        {/* ── DESKTOP SIDEBAR ── */}
        <aside className="ad-sidebar">
          {/* Categories */}
          <div className="ad-sidebar-section">
            <div className="ad-sidebar-head">
              <Package size={12} /> Categories
            </div>
            {catLoad ? (
              <div style={{ display: "flex", justifyContent: "center", padding: "32px 0" }}>
                <div className="ad-spinner" style={{ width: 32, height: 32 }} />
              </div>
            ) : (
              <>
                <button
                  onClick={() => setSelCat("all")}
                  className={`ad-cat-btn ${selCat === "all" ? "ad-cat-active" : ""}`}
                >
                  <span>All Products</span>
                  <ChevronRight size={13} />
                </button>
                {categories.map(c => (
                  <CatItem key={c.id} cat={c}
                    selectedCategory={selCat}
                    onSelect={s => { setSelCat(s); setPage(1); }} />
                ))}
              </>
            )}
          </div>

          {/* Price */}
          <div className="ad-sidebar-section"
            style={{ borderTop: "1px solid var(--rule)", paddingTop: 28 }}>
            <div className="ad-sidebar-head">Price Range</div>
            {PRICES.map(r => (
              <label key={r.value} className="ad-radio-row">
                <input type="radio" name="price"
                  checked={selPrice === r.value}
                  onChange={() => { setSelPrice(r.value); setPage(1); }} />
                <span className="ad-radio-label">{r.label}</span>
              </label>
            ))}
          </div>

          {/* Tags */}
          <div className="ad-sidebar-section"
            style={{ borderTop: "1px solid var(--rule)", paddingTop: 28 }}>
            <div className="ad-sidebar-head">
              <TagIcon size={12} /> Tags
            </div>
            {tagLoad ? (
              <div style={{ display: "flex", justifyContent: "center", padding: "20px 0" }}>
                <div className="ad-spinner" style={{ width: 28, height: 28 }} />
              </div>
            ) : (
              <div className="ad-tag-overflow">
                {tags.map(t => (
                  <label key={t.slug} className="ad-tag-row">
                    <input type="checkbox"
                      checked={selTags.includes(t.slug)}
                      onChange={() => {
                        setSelTags(p => p.includes(t.slug)
                          ? p.filter(s => s !== t.slug)
                          : [...p, t.slug]);
                        setPage(1);
                      }} />
                    <span className="ad-tag-label">{t.name}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {activeCount > 0 && (
            <button onClick={clearAll} className="ad-clear-btn">
              Clear Filters ({activeCount})
            </button>
          )}
        </aside>

        {/* ── MAIN ── */}
        <main className="ad-shop-main">

          {/* Active filter chips */}
          {activeCount > 0 && (
            <div className="ad-active-filters">
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.2em",
                textTransform: "uppercase", color: "var(--muted)" }}>
                Filters:
              </span>
              {selCat !== "all" && (
                <button className="ad-filter-chip"
                  onClick={() => { setSelCat("all"); setPage(1); }}>
                  {selCat} <X size={11} />
                </button>
              )}
              {selPrice !== "all" && (
                <button className="ad-filter-chip"
                  onClick={() => { setSelPrice("all"); setPage(1); }}>
                  {PRICES.find(p => p.value === selPrice)?.label} <X size={11} />
                </button>
              )}
              {selTags.map(t => (
                <button key={t} className="ad-filter-chip"
                  onClick={() => { setSelTags(p => p.filter(s => s !== t)); setPage(1); }}>
                  {t} <X size={11} />
                </button>
              ))}
              <button className="ad-filter-chip" onClick={clearAll}
                style={{ background: "var(--indigo)", borderColor: "var(--indigo)", color: "var(--cream)" }}>
                Clear all <X size={11} />
              </button>
            </div>
          )}

          {/* Products */}
          {loading ? (
            <div className="ad-state">
              <div className="ad-spinner" />
              <p style={{ fontSize: 13, fontWeight: 600, color: "var(--muted)",
                letterSpacing: "0.15em", textTransform: "uppercase" }}>
                Loading products…
              </p>
            </div>
          ) : products.length === 0 ? (
            <div className="ad-state">
              <div className="ad-state-icon">🔍</div>
              <h3 className="ad-state-title">Nothing found</h3>
              <p className="ad-state-body">
                Try adjusting your filters or searching for something different.
              </p>
              <button onClick={clearAll} className="ad-state-btn">
                Clear All Filters
              </button>
            </div>
          ) : (
            <>
              <div className="ad-grid">
                {products.map((p, i) => (
                  <ProductCard key={p.id} product={p} index={i} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="ad-pagination">
                  <button
                    className="ad-page-btn"
                    disabled={page === 1}
                    onClick={() => setPage(p => p - 1)}
                  >
                    <ChevronLeft size={14} /> Prev
                  </button>

                  {pages.map((item, i) =>
                    item === "…" ? (
                      <span key={`e${i}`} className="ad-page-ellipsis">…</span>
                    ) : (
                      <button key={item}
                        className={`ad-page-btn ${page === item ? "active" : ""}`}
                        onClick={() => setPage(item as number)}
                      >
                        {item}
                      </button>
                    )
                  )}

                  <button
                    className="ad-page-btn"
                    disabled={page === totalPages}
                    onClick={() => setPage(p => p + 1)}
                  >
                    Next <ChevronRight size={14} />
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* ── MOBILE DRAWER ── */}
      {drawerOpen && (
        <div className="ad-drawer-backdrop" onClick={() => setDrawerOpen(false)}>
          <div className="ad-drawer" onClick={e => e.stopPropagation()}>
            <div className="ad-drawer-head">
              <span className="ad-drawer-title">Filters</span>
              <button onClick={() => setDrawerOpen(false)} className="ad-drawer-close">
                <X size={22} />
              </button>
            </div>

            {/* Sort */}
            <div className="ad-drawer-section">
              <div className="ad-drawer-section-head">Sort By</div>
              {SORTS.map(o => (
                <label key={o.value} className="ad-radio-row">
                  <input type="radio" name="sort-m"
                    checked={sort === o.value}
                    onChange={() => { setSort(o.value); setPage(1); }} />
                  <span className="ad-radio-label">{o.label}</span>
                </label>
              ))}
            </div>

            {/* Categories */}
            <div className="ad-drawer-section"
              style={{ borderTop: "1px solid var(--rule)", paddingTop: 24 }}>
              <div className="ad-drawer-section-head">Categories</div>
              <button
                className={`ad-cat-btn ${selCat === "all" ? "ad-cat-active" : ""}`}
                onClick={() => { setSelCat("all"); setPage(1); setDrawerOpen(false); }}
              >
                <span>All Products</span> <ChevronRight size={13} />
              </button>
              {categories.map(c => (
                <CatItem key={c.id} cat={c}
                  selectedCategory={selCat}
                  onSelect={s => { setSelCat(s); setPage(1); setDrawerOpen(false); }} />
              ))}
            </div>

            {/* Price */}
            <div className="ad-drawer-section"
              style={{ borderTop: "1px solid var(--rule)", paddingTop: 24 }}>
              <div className="ad-drawer-section-head">Price Range</div>
              {PRICES.map(r => (
                <label key={r.value} className="ad-radio-row">
                  <input type="radio" name="price-m"
                    checked={selPrice === r.value}
                    onChange={() => { setSelPrice(r.value); setPage(1); }} />
                  <span className="ad-radio-label">{r.label}</span>
                </label>
              ))}
            </div>

            {/* Tags */}
            <div className="ad-drawer-section"
              style={{ borderTop: "1px solid var(--rule)", paddingTop: 24 }}>
              <div className="ad-drawer-section-head">Tags</div>
              <div className="ad-tag-overflow">
                {tags.map(t => (
                  <label key={t.slug} className="ad-tag-row">
                    <input type="checkbox"
                      checked={selTags.includes(t.slug)}
                      onChange={() => {
                        setSelTags(p => p.includes(t.slug)
                          ? p.filter(s => s !== t.slug)
                          : [...p, t.slug]);
                        setPage(1);
                      }} />
                    <span className="ad-tag-label">{t.name}</span>
                  </label>
                ))}
              </div>
            </div>

            <button onClick={() => { clearAll(); setDrawerOpen(false); }}
              className="ad-drawer-clear">
              Clear All Filters
            </button>
          </div>
        </div>
      )}

      {/* ── SCROLL TO TOP ── */}
      {scrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="ad-scroll-top"
          aria-label="Scroll to top"
        >
          <ChevronUp size={20} />
        </button>
      )}
    </>
  );
}

// ── Page wrapper ──────────────────────────────────────────────────────────────

export default function ShopPage() {
  return (
    <Suspense fallback={
      <div style={{
        minHeight: "100vh", background: "var(--cream)",
        display: "flex", alignItems: "center", justifyContent: "center",
        flexDirection: "column", gap: 20,
      }}>
        <div style={{
          width: 48, height: 48,
          border: "3px solid #F0DFC4", borderTopColor: "#C17B3A",
          borderRadius: "50%", animation: "spin 0.8s linear infinite",
        }} />
        <p style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: 11, fontWeight: 700,
          letterSpacing: "0.3em", textTransform: "uppercase",
          color: "#7A6E60",
        }}>
          Loading Shop…
        </p>
      </div>
    }>
      <ShopContent />
    </Suspense>
  );
}