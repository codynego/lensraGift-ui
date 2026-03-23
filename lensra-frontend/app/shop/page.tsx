"use client";

// app/shop/page.tsx
// Lensra — Premium Gift Boutique Shop
// Design: Apple × Luxury Boutique — spacious, emotional, minimal
// Palette: #0F0F0F · #FFFFFF · #DD183B
// Fonts: Montserrat (headings) · Inter (body)

import { useState, useEffect, useCallback, Suspense, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Search, Loader2, X, ChevronUp,
  ArrowRight, SlidersHorizontal,
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
  tags: { name: string; slug: string }[];
  is_active: boolean;
  is_trending?: boolean;
  is_new?: boolean;
  tagline?: string;
}

interface Category {
  id: number;
  name: string;
  slug: string;
  parent_id?: number;
  subcategories?: Category[];
  full_path: string;
}

interface Tag { name: string; slug: string; }

const PRICE_RANGES = [
  { label: "Any Price",         value: "all" },
  { label: "Under ₦10,000",    value: "u10k",  min: 0,     max: 9999   },
  { label: "₦10,000 – ₦20,000",value: "10_20k",min: 10000, max: 20000  },
  { label: "Over ₦20,000",     value: "o20k",  min: 20001, max: 9999999 },
];

const SORT_OPTIONS = [
  { label: "Featured",          value: "featured",   ordering: ""           },
  { label: "Price: Low → High", value: "price_asc",  ordering: "base_price" },
  { label: "Price: High → Low", value: "price_desc", ordering: "-base_price"},
  { label: "Newest",            value: "newest",     ordering: "-created_at"},
];

// ── Static showcase products (shown when API is empty) ───────────────────────
const SHOWCASE: Product[] = [
  {
    id: 1, slug: "surprise-memory-box",
    name: "Surprise Memory Box",
    base_price: "15000",
    image_url: null,
    category_path: "Memory Box",
    tags: [],
    is_active: true,
    is_trending: true,
    tagline: "A box filled with your most beautiful memories",
  },
  {
    id: 2, slug: "exploding-box",
    name: "Exploding Box",
    base_price: "20000",
    image_url: null,
    category_path: "Surprise Box",
    tags: [],
    is_active: true,
    is_new: true,
    tagline: "A surprise that unfolds with love",
  },
  {
    id: 3, slug: "video-memory-card",
    name: "Video Memory Card",
    base_price: "8000",
    image_url: null,
    category_path: "Digital Gift",
    tags: [],
    is_active: true,
    tagline: "A message they'll never forget",
  },
];

// ── Product emoji placeholders ────────────────────────────────────────────────
const PRODUCT_ICONS: Record<string, string> = {
  "surprise-memory-box": "🎁",
  "exploding-box": "🎀",
  "video-memory-card": "🎥",
};

// ── Grain overlay ─────────────────────────────────────────────────────────────
function Grain() {
  return (
    <svg aria-hidden style={{
      position: "fixed", inset: 0, width: "100%", height: "100%",
      pointerEvents: "none", zIndex: 9999, opacity: 0.018,
      mixBlendMode: "multiply",
    }}>
      <filter id="lx-g">
        <feTurbulence type="fractalNoise" baseFrequency="0.68"
          numOctaves="3" stitchTiles="stitch" />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#lx-g)" />
    </svg>
  );
}

// ── Product card ──────────────────────────────────────────────────────────────
function ProductCard({ product, priority = false }: {
  product: Product; priority?: boolean;
}) {
  const router = useRouter();
  const [hovered, setHovered] = useState(false);
  const [buying, setBuying] = useState(false);
  const [, start] = useTransition();

  const go = () => start(() => router.push(`/shop/${product.slug}`));

  const quickCustomize = async (e: React.MouseEvent) => {
    e.stopPropagation();
    go();
  };

  const icon = PRODUCT_ICONS[product.slug] || "🎁";
  const priceNum = parseFloat(product.base_price);
  const formattedPrice = `₦${priceNum.toLocaleString("en-NG")}`;

  return (
    <div
      className={`lx-card ${hovered ? "lx-card-hovered" : ""}`}
      onClick={go}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Badges */}
      <div className="lx-card-badges">
        {product.is_trending && <span className="lx-badge lx-badge-trending">Best Seller</span>}
        {product.is_new && <span className="lx-badge lx-badge-new">New</span>}
      </div>

      {/* Image area */}
      <div className="lx-card-visual">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="lx-card-img"
          />
        ) : (
          <div className="lx-card-placeholder">
            <div className="lx-placeholder-emoji">{icon}</div>
            <div className="lx-placeholder-shimmer" />
          </div>
        )}

        {/* Hover CTA overlay */}
        <div className="lx-card-overlay">
          <button
            onClick={quickCustomize}
            disabled={buying}
            className="lx-card-overlay-btn"
          >
            {buying ? (
              <Loader2 size={16} style={{ animation: "lx-spin 0.7s linear infinite" }} />
            ) : (
              <>Customize <ArrowRight size={15} /></>
            )}
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="lx-card-info">
        <span className="lx-card-category">{product.category_path}</span>
        <h3 className="lx-card-name">{product.name}</h3>
        {product.tagline && (
          <p className="lx-card-tagline">{product.tagline}</p>
        )}
        <div className="lx-card-footer">
          <div className="lx-card-price">
            <span className="lx-price-from">Starting from</span>
            <span className="lx-price-amount">{formattedPrice}</span>
          </div>
          <button
            onClick={quickCustomize}
            className="lx-card-cta"
          >
            Customize
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Filter drawer ─────────────────────────────────────────────────────────────
function FilterDrawer({
  open, onClose,
  categories, tags,
  selCat, setSelCat,
  selPrice, setSelPrice,
  selTags, setSelTags,
  sort, setSort,
  clearAll, activeCount,
}: any) {
  if (!open) return null;
  return (
    <div className="lx-drawer-backdrop" onClick={onClose}>
      <div className="lx-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="lx-drawer-head">
          <span className="lx-drawer-title">Filter & Sort</span>
          <button onClick={onClose} className="lx-drawer-close">
            <X size={20} />
          </button>
        </div>

        {/* Sort */}
        <div className="lx-drawer-block">
          <div className="lx-drawer-label">Sort By</div>
          <div className="lx-drawer-options">
            {SORT_OPTIONS.map((o) => (
              <button
                key={o.value}
                onClick={() => setSort(o.value)}
                className={`lx-drawer-option ${sort === o.value ? "active" : ""}`}
              >
                {o.label}
              </button>
            ))}
          </div>
        </div>

        {/* Category */}
        <div className="lx-drawer-block">
          <div className="lx-drawer-label">Category</div>
          <div className="lx-drawer-options">
            <button
              onClick={() => setSelCat("all")}
              className={`lx-drawer-option ${selCat === "all" ? "active" : ""}`}
            >
              All Products
            </button>
            {categories.map((c: Category) => (
              <button
                key={c.id}
                onClick={() => setSelCat(c.slug)}
                className={`lx-drawer-option ${selCat === c.slug ? "active" : ""}`}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>

        {/* Price */}
        <div className="lx-drawer-block">
          <div className="lx-drawer-label">Price Range</div>
          <div className="lx-drawer-options">
            {PRICE_RANGES.map((r) => (
              <button
                key={r.value}
                onClick={() => setSelPrice(r.value)}
                className={`lx-drawer-option ${selPrice === r.value ? "active" : ""}`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="lx-drawer-block">
            <div className="lx-drawer-label">Occasion</div>
            <div className="lx-drawer-options lx-drawer-tags">
              {tags.map((t: Tag) => (
                <button
                  key={t.slug}
                  onClick={() =>
                    setSelTags((p: string[]) =>
                      p.includes(t.slug) ? p.filter((s) => s !== t.slug) : [...p, t.slug]
                    )
                  }
                  className={`lx-drawer-option ${selTags.includes(t.slug) ? "active" : ""}`}
                >
                  {t.name}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="lx-drawer-actions">
          {activeCount > 0 && (
            <button onClick={() => { clearAll(); onClose(); }} className="lx-drawer-clear">
              Clear All ({activeCount})
            </button>
          )}
          <button onClick={onClose} className="lx-drawer-apply">
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main content ──────────────────────────────────────────────────────────────
function ShopContent() {
  const router = useRouter();
  const params = useSearchParams();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);

  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [scrollTop, setScrollTop] = useState(false);

  const [q, setQ] = useState("");
  const [selCat, setSelCat] = useState("all");
  const [selPrice, setSelPrice] = useState("all");
  const [selTags, setSelTags] = useState<string[]>([]);
  const [sort, setSort] = useState("featured");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const PER_PAGE = 12;

  useEffect(() => {
    const fn = () => setScrollTop(window.scrollY > 500);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    fetch(`${BaseUrl}api/products/categories/`)
      .then((r) => r.json())
      .then((d) => setCategories(Array.isArray(d) ? d : (d.results ?? [])))
      .catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    fetch(`${BaseUrl}api/products/tags/`)
      .then((r) => r.json())
      .then((d) => setTags(Array.isArray(d) ? d : (d.results ?? [])))
      .catch(() => setTags([]));
  }, []);

  useEffect(() => {
    setQ(params.get("q") || "");
    setSelCat(params.get("category") || "all");
    setSelPrice(params.get("price") || "all");
    setSelTags(params.get("tags") ? params.get("tags")!.split(",") : []);
    setSort(params.get("sort") || "featured");
    setPage(Number(params.get("page")) || 1);
  }, [params]);

  useEffect(() => {
    const t = setTimeout(async () => {
      setLoading(true);
      try {
        const p = new URLSearchParams();
        if (q) p.append("search", q);
        if (selCat !== "all") p.append("category", selCat);
        const range = PRICE_RANGES.find((r) => r.value === selPrice);
        if (range?.min !== undefined) p.append("min_price", range.min.toString());
        if (range?.max !== undefined) p.append("max_price", range.max.toString());
        if (selTags.length) p.append("tags", selTags.join(","));
        const so = SORT_OPTIONS.find((s) => s.value === sort);
        if (so?.ordering) p.append("ordering", so.ordering);
        p.append("page", page.toString());
        p.append("page_size", PER_PAGE.toString());
        const res = await fetch(`${BaseUrl}api/products/?${p}`);
        const data = await res.json();
        const raw: Product[] = data.results ?? (Array.isArray(data) ? data : []);
        setProducts(raw);
        setTotal(data.count ?? raw.length);
      } catch (e) {
        console.error(e);
        setProducts([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => clearTimeout(t);
  }, [q, selCat, selPrice, selTags, sort, page]);

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

  const clearAll = () => {
    setQ(""); setSelCat("all"); setSelPrice("all");
    setSelTags([]); setSort("featured"); setPage(1);
  };

  const activeCount =
    (selCat !== "all" ? 1 : 0) +
    (selPrice !== "all" ? 1 : 0) +
    selTags.length;

  const displayProducts = products.length > 0 ? products : (!loading && !q && selCat === "all" && selPrice === "all" && selTags.length === 0 ? SHOWCASE : []);
  const totalPages = Math.ceil(total / PER_PAGE);

  // Pagination numbers
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
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800;900&family=Inter:wght@300;400;500;600&display=swap');

        :root {
          --black:   #0F0F0F;
          --white:   #FFFFFF;
          --red:     #DD183B;
          --red-h:   #C2152F;
          --gray-50: #F9F9F9;
          --gray-100:#F3F3F3;
          --gray-200:#E8E8E8;
          --gray-400:#AAAAAA;
          --gray-600:#666666;
          --ease:    cubic-bezier(0.16, 1, 0.3, 1);
          --font-h:  'Montserrat', sans-serif;
          --font-b:  'Inter', sans-serif;
          --shadow:  0 2px 20px rgba(0,0,0,0.07);
          --shadow-hover: 0 12px 48px rgba(0,0,0,0.13);
        }

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          font-family: var(--font-b);
          background: var(--white);
          color: var(--black);
          -webkit-font-smoothing: antialiased;
        }

        /* ── PAGE HEADER ─────────────────────────────────────────── */
        .lx-shop-hero {
          background: var(--black);
          padding: 140px 6vw 80px;
          position: relative;
          overflow: hidden;
        }

        /* Subtle red glow top-right */
        .lx-shop-hero::before {
          content: '';
          position: absolute;
          top: -100px; right: -100px;
          width: 500px; height: 500px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(221,24,59,0.1) 0%, transparent 70%);
          pointer-events: none;
        }

        .lx-shop-hero-inner {
          position: relative; z-index: 1;
          max-width: 1400px; margin: 0 auto;
          display: flex; align-items: flex-end;
          justify-content: space-between;
          flex-wrap: wrap; gap: 40px;
        }

        .lx-shop-eyebrow {
          font-family: var(--font-h);
          font-size: 10px; font-weight: 700;
          letter-spacing: 0.35em; text-transform: uppercase;
          color: var(--red);
          display: flex; align-items: center; gap: 12px;
          margin-bottom: 20px;
        }
        .lx-shop-eyebrow::before {
          content: '';
          display: block; width: 28px; height: 1px;
          background: var(--red); opacity: 0.6;
        }

        .lx-shop-h1 {
          font-family: var(--font-h);
          font-size: clamp(36px, 5.5vw, 72px);
          font-weight: 900;
          line-height: 1.0;
          letter-spacing: -0.03em;
          color: var(--white);
          margin-bottom: 16px;
        }
        .lx-shop-h1 em {
          font-style: normal;
          color: var(--red);
        }

        .lx-shop-subtitle {
          font-family: var(--font-b);
          font-size: 15px; font-weight: 300;
          color: rgba(255,255,255,0.4);
          line-height: 1.75; max-width: 420px;
        }

        .lx-shop-count {
          font-family: var(--font-h);
          font-size: 11px; font-weight: 600;
          letter-spacing: 0.2em; text-transform: uppercase;
          color: rgba(255,255,255,0.2);
          margin-top: 12px;
        }

        /* Controls row */
        .lx-shop-controls {
          display: flex; align-items: center;
          gap: 12px; flex-shrink: 0; flex-wrap: wrap;
          justify-content: flex-end;
        }

        /* Search */
        .lx-search {
          position: relative;
        }
        .lx-search-icon {
          position: absolute; left: 16px; top: 50%;
          transform: translateY(-50%);
          color: rgba(255,255,255,0.25);
          pointer-events: none;
        }
        .lx-search-input {
          width: 280px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 2px;
          color: var(--white);
          font-family: var(--font-b);
          font-size: 14px; font-weight: 400;
          padding: 13px 40px 13px 44px;
          outline: none;
          transition: border-color 0.2s, background 0.2s;
        }
        .lx-search-input::placeholder { color: rgba(255,255,255,0.2); }
        .lx-search-input:focus {
          border-color: rgba(221,24,59,0.5);
          background: rgba(255,255,255,0.07);
        }
        .lx-search-clear {
          position: absolute; right: 14px; top: 50%;
          transform: translateY(-50%);
          background: none; border: none; cursor: pointer;
          color: rgba(255,255,255,0.3);
          display: flex; align-items: center;
          transition: color 0.2s;
        }
        .lx-search-clear:hover { color: var(--red); }

        /* Sort select */
        .lx-sort-wrap { position: relative; }
        .lx-sort {
          appearance: none;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 2px;
          color: rgba(255,255,255,0.6);
          font-family: var(--font-h);
          font-size: 10px; font-weight: 600;
          letter-spacing: 0.15em; text-transform: uppercase;
          padding: 13px 40px 13px 18px;
          cursor: pointer; outline: none;
          transition: border-color 0.2s;
        }
        .lx-sort:focus { border-color: rgba(221,24,59,0.4); }
        .lx-sort-chevron {
          position: absolute; right: 14px; top: 50%;
          transform: translateY(-50%);
          color: rgba(255,255,255,0.3); pointer-events: none;
          font-size: 11px;
        }

        /* Filter button */
        .lx-filter-btn {
          display: flex; align-items: center; gap: 8px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 2px;
          color: rgba(255,255,255,0.6);
          font-family: var(--font-h);
          font-size: 10px; font-weight: 700;
          letter-spacing: 0.15em; text-transform: uppercase;
          padding: 13px 20px;
          cursor: pointer; position: relative;
          transition: border-color 0.2s, color 0.2s;
        }
        .lx-filter-btn:hover { border-color: var(--red); color: var(--white); }
        .lx-filter-badge {
          position: absolute; top: -7px; right: -7px;
          width: 18px; height: 18px; border-radius: 50%;
          background: var(--red); color: var(--white);
          font-size: 9px; font-weight: 800;
          display: flex; align-items: center; justify-content: center;
        }

        /* ── ACTIVE FILTER CHIPS ──────────────────────────────────── */
        .lx-chips {
          background: var(--gray-50);
          border-bottom: 1px solid var(--gray-200);
        }
        .lx-chips-inner {
          max-width: 1400px; margin: 0 auto;
          padding: 14px 6vw;
          display: flex; align-items: center;
          flex-wrap: wrap; gap: 8px;
        }
        .lx-chip-label {
          font-family: var(--font-h);
          font-size: 10px; font-weight: 700;
          letter-spacing: 0.2em; text-transform: uppercase;
          color: var(--gray-400); margin-right: 4px;
        }
        .lx-chip {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 6px 14px;
          background: var(--white);
          border: 1px solid var(--gray-200);
          border-radius: 2px;
          font-family: var(--font-h);
          font-size: 10px; font-weight: 600;
          letter-spacing: 0.08em;
          color: var(--black);
          cursor: pointer;
          transition: border-color 0.2s, background 0.2s;
        }
        .lx-chip:hover { border-color: var(--red); color: var(--red); }
        .lx-chip-clear {
          background: var(--black); border-color: var(--black);
          color: var(--white);
        }
        .lx-chip-clear:hover { background: var(--red); border-color: var(--red); }

        /* ── PRODUCT GRID SECTION ─────────────────────────────────── */
        .lx-shop-section {
          max-width: 1400px;
          margin: 0 auto;
          padding: 80px 6vw 120px;
        }

        /* Grid: 3-col desktop, 2-col tablet, 1-col mobile */
        .lx-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2px;
        }

        /* Wide layout for boutique feel: 2 products = hero 2-col */
        .lx-grid.lx-grid-2 {
          grid-template-columns: repeat(2, 1fr);
          max-width: 900px;
          margin: 0 auto;
        }

        /* ── PRODUCT CARD ─────────────────────────────────────────── */
        .lx-card {
          cursor: pointer;
          background: var(--white);
          position: relative;
          transition: transform 0.4s var(--ease), box-shadow 0.4s var(--ease);
        }
        .lx-card:hover {
          transform: translateY(-6px);
          box-shadow: var(--shadow-hover);
          z-index: 2;
        }

        .lx-card-badges {
          position: absolute; top: 20px; left: 20px;
          display: flex; gap: 6px; z-index: 3;
        }
        .lx-badge {
          font-family: var(--font-h);
          font-size: 8px; font-weight: 800;
          letter-spacing: 0.22em; text-transform: uppercase;
          padding: 5px 12px; color: var(--white);
          border-radius: 1px;
        }
        .lx-badge-trending { background: var(--red); }
        .lx-badge-new { background: var(--black); }

        /* Image */
        .lx-card-visual {
          position: relative;
          aspect-ratio: 4/5;
          overflow: hidden;
          background: var(--gray-100);
        }
        .lx-card-img {
          width: 100%; height: 100%; object-fit: cover;
          transition: transform 0.9s var(--ease);
        }
        .lx-card:hover .lx-card-img { transform: scale(1.05); }

        /* Placeholder */
        .lx-card-placeholder {
          width: 100%; height: 100%;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          position: relative;
          background: linear-gradient(145deg, #f9f9f9 0%, #efefef 100%);
        }
        .lx-placeholder-emoji {
          font-size: 72px;
          position: relative; z-index: 1;
          filter: drop-shadow(0 4px 24px rgba(0,0,0,0.08));
          transition: transform 0.4s var(--ease);
        }
        .lx-card:hover .lx-placeholder-emoji { transform: scale(1.1) translateY(-4px); }
        .lx-placeholder-shimmer {
          position: absolute; inset: 0;
          background: linear-gradient(
            120deg,
            transparent 30%,
            rgba(255,255,255,0.5) 50%,
            transparent 70%
          );
          background-size: 200% 100%;
          animation: lx-shimmer 2.5s infinite;
        }
        @keyframes lx-shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }

        /* Hover overlay */
        .lx-card-overlay {
          position: absolute; inset: 0;
          background: rgba(15,15,15,0);
          display: flex; align-items: center; justify-content: center;
          transition: background 0.35s;
        }
        .lx-card:hover .lx-card-overlay { background: rgba(15,15,15,0.35); }
        .lx-card-overlay-btn {
          display: flex; align-items: center; gap: 8px;
          background: var(--white);
          color: var(--black);
          border: none; cursor: pointer;
          padding: 14px 32px;
          font-family: var(--font-h);
          font-size: 11px; font-weight: 700;
          letter-spacing: 0.15em; text-transform: uppercase;
          border-radius: 1px;
          opacity: 0; transform: translateY(16px) scale(0.96);
          transition: opacity 0.3s, transform 0.3s, background 0.2s, color 0.2s;
        }
        .lx-card:hover .lx-card-overlay-btn {
          opacity: 1; transform: translateY(0) scale(1);
        }
        .lx-card-overlay-btn:hover {
          background: var(--red); color: var(--white);
        }

        /* Info */
        .lx-card-info {
          padding: 24px 24px 28px;
          border: 1px solid var(--gray-200);
          border-top: none;
        }
        .lx-card-category {
          display: block;
          font-family: var(--font-h);
          font-size: 9px; font-weight: 700;
          letter-spacing: 0.3em; text-transform: uppercase;
          color: var(--gray-400);
          margin-bottom: 8px;
        }
        .lx-card-name {
          font-family: var(--font-h);
          font-size: 20px; font-weight: 800;
          line-height: 1.2;
          color: var(--black);
          margin-bottom: 8px;
          letter-spacing: -0.01em;
        }
        .lx-card-tagline {
          font-family: var(--font-b);
          font-size: 14px; font-weight: 400;
          color: var(--gray-600);
          line-height: 1.65;
          margin-bottom: 20px;
          font-style: italic;
        }
        .lx-card-footer {
          display: flex; align-items: center;
          justify-content: space-between;
          padding-top: 16px;
          border-top: 1px solid var(--gray-100);
        }
        .lx-card-price {
          display: flex; flex-direction: column; gap: 2px;
        }
        .lx-price-from {
          font-family: var(--font-b);
          font-size: 10px; font-weight: 500;
          letter-spacing: 0.05em;
          color: var(--gray-400);
        }
        .lx-price-amount {
          font-family: var(--font-h);
          font-size: 20px; font-weight: 800;
          color: var(--black);
          letter-spacing: -0.02em;
        }
        .lx-card-cta {
          display: flex; align-items: center; gap: 7px;
          background: var(--red);
          color: var(--white);
          border: none; cursor: pointer;
          padding: 11px 22px;
          font-family: var(--font-h);
          font-size: 10px; font-weight: 700;
          letter-spacing: 0.12em; text-transform: uppercase;
          border-radius: 1px;
          transition: background 0.2s, transform 0.15s;
        }
        .lx-card-cta:hover { background: var(--red-h); transform: scale(1.03); }

        /* ── STATES ───────────────────────────────────────────────── */
        .lx-state {
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          min-height: 500px; gap: 20px; text-align: center;
          padding: 80px 24px;
        }
        .lx-state-icon {
          width: 80px; height: 80px;
          background: var(--gray-100);
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 36px;
        }
        .lx-state-title {
          font-family: var(--font-h);
          font-size: 28px; font-weight: 800;
          color: var(--black); letter-spacing: -0.02em;
        }
        .lx-state-body {
          font-size: 15px; font-weight: 400;
          color: var(--gray-600);
          max-width: 360px; line-height: 1.75;
        }
        .lx-state-btn {
          display: flex; align-items: center; gap: 8px;
          background: var(--red); color: var(--white);
          border: none; cursor: pointer;
          padding: 14px 36px;
          font-family: var(--font-h);
          font-size: 11px; font-weight: 700;
          letter-spacing: 0.12em; text-transform: uppercase;
          border-radius: 1px;
          transition: background 0.2s;
        }
        .lx-state-btn:hover { background: var(--red-h); }
        .lx-loader {
          width: 44px; height: 44px;
          border: 2.5px solid var(--gray-200);
          border-top-color: var(--red);
          border-radius: 50%;
          animation: lx-spin 0.75s linear infinite;
        }
        @keyframes lx-spin { to { transform: rotate(360deg); } }

        /* ── PAGINATION ───────────────────────────────────────────── */
        .lx-pagination {
          display: flex; align-items: center;
          justify-content: center; gap: 4px;
          margin-top: 80px; flex-wrap: wrap;
        }
        .lx-page-btn {
          min-width: 44px; height: 44px;
          display: flex; align-items: center; justify-content: center;
          padding: 0 16px;
          font-family: var(--font-h);
          font-size: 12px; font-weight: 700;
          background: var(--white);
          border: 1px solid var(--gray-200);
          color: var(--gray-600);
          cursor: pointer; border-radius: 1px;
          transition: border-color 0.2s, color 0.2s, background 0.2s;
        }
        .lx-page-btn:hover:not(:disabled) {
          border-color: var(--black); color: var(--black);
        }
        .lx-page-btn.active {
          background: var(--black); border-color: var(--black);
          color: var(--white);
        }
        .lx-page-btn:disabled { opacity: 0.3; cursor: not-allowed; }
        .lx-page-dot { color: var(--gray-400); padding: 0 6px; font-size: 14px; }

        /* ── DRAWER ───────────────────────────────────────────────── */
        .lx-drawer-backdrop {
          position: fixed; inset: 0; z-index: 500;
          background: rgba(0,0,0,0.6);
          backdrop-filter: blur(4px);
        }
        .lx-drawer {
          position: absolute; bottom: 0; left: 0; right: 0;
          background: var(--white);
          border-radius: 16px 16px 0 0;
          padding: 32px 24px 48px;
          max-height: 90vh; overflow-y: auto;
        }
        .lx-drawer-head {
          display: flex; align-items: center;
          justify-content: space-between;
          padding-bottom: 24px;
          border-bottom: 1px solid var(--gray-200);
          margin-bottom: 28px;
        }
        .lx-drawer-title {
          font-family: var(--font-h);
          font-size: 20px; font-weight: 800;
          color: var(--black); letter-spacing: -0.02em;
        }
        .lx-drawer-close {
          background: var(--gray-100); border: none; cursor: pointer;
          width: 36px; height: 36px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          color: var(--gray-600);
          transition: background 0.2s;
        }
        .lx-drawer-close:hover { background: var(--gray-200); }
        .lx-drawer-block { margin-bottom: 28px; }
        .lx-drawer-label {
          font-family: var(--font-h);
          font-size: 9px; font-weight: 800;
          letter-spacing: 0.32em; text-transform: uppercase;
          color: var(--red);
          margin-bottom: 14px; display: block;
        }
        .lx-drawer-options {
          display: flex; flex-wrap: wrap; gap: 8px;
        }
        .lx-drawer-tags { gap: 6px; }
        .lx-drawer-option {
          padding: 9px 18px;
          font-family: var(--font-h);
          font-size: 11px; font-weight: 600;
          letter-spacing: 0.05em;
          background: var(--gray-100);
          border: 1px solid var(--gray-200);
          color: var(--gray-600);
          cursor: pointer; border-radius: 2px;
          transition: all 0.2s;
        }
        .lx-drawer-option:hover { border-color: var(--black); color: var(--black); }
        .lx-drawer-option.active {
          background: var(--black); border-color: var(--black);
          color: var(--white);
        }
        .lx-drawer-actions {
          display: flex; gap: 10px;
          margin-top: 8px;
          padding-top: 24px;
          border-top: 1px solid var(--gray-200);
        }
        .lx-drawer-clear {
          flex: 1; padding: 15px;
          background: var(--white);
          border: 1.5px solid var(--gray-200);
          border-radius: 2px;
          font-family: var(--font-h);
          font-size: 11px; font-weight: 700;
          letter-spacing: 0.1em; text-transform: uppercase;
          color: var(--gray-600); cursor: pointer;
          transition: border-color 0.2s, color 0.2s;
        }
        .lx-drawer-clear:hover { border-color: var(--red); color: var(--red); }
        .lx-drawer-apply {
          flex: 2; padding: 15px;
          background: var(--red);
          border: none; border-radius: 2px;
          font-family: var(--font-h);
          font-size: 11px; font-weight: 700;
          letter-spacing: 0.1em; text-transform: uppercase;
          color: var(--white); cursor: pointer;
          transition: background 0.2s;
        }
        .lx-drawer-apply:hover { background: var(--red-h); }

        /* ── SCROLL TOP ───────────────────────────────────────────── */
        .lx-scroll-top {
          position: fixed; bottom: 32px; right: 32px; z-index: 200;
          width: 48px; height: 48px;
          background: var(--black); color: var(--white);
          border: none; cursor: pointer; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 4px 24px rgba(0,0,0,0.2);
          transition: background 0.2s, transform 0.2s;
        }
        .lx-scroll-top:hover { background: var(--red); transform: translateY(-2px); }

        /* ── RESPONSIVE ───────────────────────────────────────────── */
        @media (max-width: 1024px) {
          .lx-grid { grid-template-columns: repeat(2, 1fr); }
          .lx-grid.lx-grid-2 { grid-template-columns: 1fr; max-width: 480px; }
        }
        @media (max-width: 768px) {
          .lx-shop-hero { padding: 120px 5vw 60px; }
          .lx-shop-section { padding: 60px 5vw 80px; }
          .lx-shop-h1 { font-size: clamp(32px, 9vw, 52px); }
          .lx-sort-wrap { display: none; }
          .lx-search-input { width: 220px; }
          .lx-grid { grid-template-columns: 1fr 1fr; gap: 2px; }
        }
        @media (max-width: 480px) {
          .lx-grid { grid-template-columns: 1fr; }
          .lx-grid.lx-grid-2 { grid-template-columns: 1fr; }
          .lx-shop-controls { gap: 8px; }
          .lx-search-input { width: 100%; }
        }
      `}</style>

      <Grain />

      {/* ── PAGE HEADER ── */}
      <header className="lx-shop-hero">
        <div className="lx-shop-hero-inner">
          <div>
            <div className="lx-shop-eyebrow">Lensra Shop</div>
            <h1 className="lx-shop-h1">
              Choose Your<br />
              <em>Gift Experience</em>
            </h1>
            <p className="lx-shop-subtitle">
              Each box is carefully crafted to create unforgettable moments.
            </p>
            {total > 0 && (
              <p className="lx-shop-count">
                {total} {total === 1 ? "gift" : "gifts"} available
              </p>
            )}
          </div>

          <div className="lx-shop-controls">
            {/* Search */}
            <div className="lx-search">
              <Search size={15} className="lx-search-icon" />
              <input
                type="text"
                placeholder="Search gifts..."
                value={q}
                onChange={(e) => { setQ(e.target.value); setPage(1); }}
                className="lx-search-input"
              />
              {q && (
                <button onClick={() => { setQ(""); setPage(1); }} className="lx-search-clear">
                  <X size={13} />
                </button>
              )}
            </div>

            {/* Sort */}
            <div className="lx-sort-wrap">
              <select
                value={sort}
                onChange={(e) => { setSort(e.target.value); setPage(1); }}
                className="lx-sort"
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
              <span className="lx-sort-chevron">▾</span>
            </div>

            {/* Filter button */}
            <button onClick={() => setDrawerOpen(true)} className="lx-filter-btn">
              <SlidersHorizontal size={14} />
              Filter
              {activeCount > 0 && (
                <span className="lx-filter-badge">{activeCount}</span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* ── ACTIVE CHIPS ── */}
      {activeCount > 0 && (
        <div className="lx-chips">
          <div className="lx-chips-inner">
            <span className="lx-chip-label">Active:</span>
            {selCat !== "all" && (
              <button className="lx-chip" onClick={() => { setSelCat("all"); setPage(1); }}>
                {selCat} <X size={10} />
              </button>
            )}
            {selPrice !== "all" && (
              <button className="lx-chip" onClick={() => { setSelPrice("all"); setPage(1); }}>
                {PRICE_RANGES.find((p) => p.value === selPrice)?.label} <X size={10} />
              </button>
            )}
            {selTags.map((t) => (
              <button key={t} className="lx-chip"
                onClick={() => { setSelTags((p) => p.filter((s) => s !== t)); setPage(1); }}>
                {t} <X size={10} />
              </button>
            ))}
            <button className="lx-chip lx-chip-clear" onClick={clearAll}>
              Clear all <X size={10} />
            </button>
          </div>
        </div>
      )}

      {/* ── PRODUCT GRID ── */}
      <section className="lx-shop-section">
        {loading ? (
          <div className="lx-state">
            <div className="lx-loader" />
            <p style={{
              fontFamily: "var(--font-h)",
              fontSize: 10, fontWeight: 700,
              letterSpacing: "0.3em", textTransform: "uppercase",
              color: "var(--gray-400)",
            }}>
              Loading gifts…
            </p>
          </div>
        ) : displayProducts.length === 0 ? (
          <div className="lx-state">
            <div className="lx-state-icon">🔍</div>
            <h3 className="lx-state-title">Nothing found</h3>
            <p className="lx-state-body">
              Try adjusting your search or removing a filter to find the perfect gift.
            </p>
            <button onClick={clearAll} className="lx-state-btn">
              Clear Filters <ArrowRight size={14} />
            </button>
          </div>
        ) : (
          <>
            <div className={`lx-grid ${displayProducts.length <= 2 ? "lx-grid-2" : ""}`}>
              {displayProducts.map((p, i) => (
                <ProductCard key={p.id} product={p} priority={i < 2} />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="lx-pagination">
                <button
                  className="lx-page-btn"
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  ← Prev
                </button>
                {pages.map((item, i) =>
                  item === "…" ? (
                    <span key={`e${i}`} className="lx-page-dot">…</span>
                  ) : (
                    <button
                      key={item}
                      className={`lx-page-btn ${page === item ? "active" : ""}`}
                      onClick={() => setPage(item as number)}
                    >
                      {item}
                    </button>
                  )
                )}
                <button
                  className="lx-page-btn"
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </section>

      {/* ── FILTER DRAWER ── */}
      <FilterDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        categories={categories}
        tags={tags}
        selCat={selCat} setSelCat={setSelCat}
        selPrice={selPrice} setSelPrice={setSelPrice}
        selTags={selTags} setSelTags={setSelTags}
        sort={sort} setSort={setSort}
        clearAll={clearAll}
        activeCount={activeCount}
      />

      {/* ── SCROLL TO TOP ── */}
      {scrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="lx-scroll-top"
          aria-label="Back to top"
        >
          <ChevronUp size={18} />
        </button>
      )}
    </>
  );
}

// ── Page wrapper ──────────────────────────────────────────────────────────────
export default function ShopPage() {
  return (
    <Suspense
      fallback={
        <div style={{
          minHeight: "100vh", background: "#fff",
          display: "flex", alignItems: "center", justifyContent: "center",
          flexDirection: "column", gap: 16,
        }}>
          <div style={{
            width: 44, height: 44,
            border: "2.5px solid #eee", borderTopColor: "#DD183B",
            borderRadius: "50%", animation: "lx-spin 0.75s linear infinite",
          }} />
          <p style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: 10, fontWeight: 700,
            letterSpacing: "0.3em", textTransform: "uppercase",
            color: "#aaa",
          }}>
            Loading…
          </p>
        </div>
      }
    >
      <ShopContent />
    </Suspense>
  );
}