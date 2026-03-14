"use client";

// app/ClientHomepage.tsx
// Adire — Personalised Ankara Gifts
// Brand: Warm luxury — indigo night, kola amber, harmattan cream, cocoa dark
// Products: Ankara Tote Bags + Ankara Pouches
// Tagline: "Made Personal. Made Nigerian."
// Fonts: Cormorant Garamond (display) · Instrument Sans (body)

import { useState, useEffect, useRef } from "react";
import { motion, useInView, type Variants } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

// ── Constants ────────────────────────────────────────────────────────────────

const BaseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.adire.ng/";

// ── Helpers ──────────────────────────────────────────────────────────────────

function getImageUrl(imagePath: string | null | undefined): string | null {
  if (!imagePath) return null;
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://"))
    return imagePath;
  return `${BaseUrl.replace(/\/$/, "")}${
    imagePath.startsWith("/") ? imagePath : "/" + imagePath
  }`;
}

function formatPrice(price: string | number) {
  const num = typeof price === "string" ? parseFloat(price) : price;
  return `₦${num.toLocaleString("en-NG", { minimumFractionDigits: 0 })}`;
}

// ── Motion variants ──────────────────────────────────────────────────────────

const EASE = [0.16, 1, 0.3, 1] as const;

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 0.75, ease: EASE } },
};

const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.9, ease: EASE } },
};

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.11, delayChildren: 0.05 } },
};

// ── Grain overlay ────────────────────────────────────────────────────────────

function GrainOverlay() {
  return (
    <svg
      aria-hidden
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 9999,
        opacity: 0.032,
        mixBlendMode: "multiply",
      }}
    >
      <filter id="ad-grain">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.68"
          numOctaves="3"
          stitchTiles="stitch"
        />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#ad-grain)" />
    </svg>
  );
}

// ── Adire pattern SVG (decorative) ───────────────────────────────────────────

function AdirePattern({ opacity = 0.06 }: { opacity?: number }) {
  return (
    <svg
      aria-hidden
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        opacity,
      }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern
          id="adire-dots"
          x="0"
          y="0"
          width="40"
          height="40"
          patternUnits="userSpaceOnUse"
        >
          <circle cx="20" cy="20" r="1.5" fill="#C17B3A" />
          <circle cx="0" cy="0" r="1.5" fill="#C17B3A" />
          <circle cx="40" cy="0" r="1.5" fill="#C17B3A" />
          <circle cx="0" cy="40" r="1.5" fill="#C17B3A" />
          <circle cx="40" cy="40" r="1.5" fill="#C17B3A" />
          <rect
            x="16" y="16" width="8" height="8"
            fill="none" stroke="#C17B3A" strokeWidth="0.5"
            transform="rotate(45 20 20)"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#adire-dots)" />
    </svg>
  );
}

// ── Product Card ─────────────────────────────────────────────────────────────

function ProductCard({ product }: { product: any }) {
  const imageUrl = getImageUrl(product.image_url);
  const isTote = product.category === "tote";

  return (
    <motion.div variants={fadeUp}>
      <Link href={`/shop/${product.slug}`} className="ad-product-card">
        <div className="ad-product-img-wrap">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 50vw, 33vw"
              style={{ objectFit: "cover" }}
              className="ad-product-img"
            />
          ) : (
            <div className="ad-product-placeholder">
              <div className="ad-placeholder-inner">
                <span className="ad-placeholder-icon">{isTote ? "👜" : "👝"}</span>
                <span className="ad-placeholder-label">
                  {isTote ? "Ankara Tote" : "Ankara Pouch"}
                </span>
              </div>
            </div>
          )}
          <div className="ad-product-overlay">
            <span className="ad-product-cta">Personalise →</span>
          </div>
          {product.is_trending && (
            <div className="ad-product-badge">Trending</div>
          )}
          {product.is_new && (
            <div className="ad-product-badge ad-badge-new">New</div>
          )}
        </div>
        <div className="ad-product-meta">
          <div className="ad-product-category">
            {isTote ? "Ankara Tote Bag" : "Ankara Pouch"}
          </div>
          <h3 className="ad-product-name">{product.name}</h3>
          <div className="ad-product-footer">
            <div className="ad-product-price">
              From {formatPrice(product.base_price || 0)}
            </div>
            <div className="ad-product-personalise">Personalised →</div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

// ── Section label ────────────────────────────────────────────────────────────

function SectionLabel({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return (
    <div className={`ad-section-label ${light ? "ad-section-label-light" : ""}`}>
      {children}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function ClientHomepage({
  initialProducts,
}: {
  initialProducts: any[];
}) {
  const [products] = useState(initialProducts);
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [activeFilter, setActiveFilter] = useState<"all" | "tote" | "pouch">("all");
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const productsRef = useRef(null);
  const processRef = useRef(null);
  const whyRef = useRef(null);
  const occasionsRef = useRef(null);

  const productsInView = useInView(productsRef, { once: true, margin: "-80px" });
  const processInView = useInView(processRef, { once: true, margin: "-80px" });
  const whyInView = useInView(whyRef, { once: true, margin: "-80px" });
  const occasionsInView = useInView(occasionsRef, { once: true, margin: "-80px" });

  // Scroll-aware nav
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Fetch featured products
  useEffect(() => {
    fetch(`${BaseUrl}api/products/featured/`)
      .then((r) => r.json())
      .then((d) => {
        const results = d.results || d || [];
        setFeaturedProducts(
          results.filter((p: any) => ["tote", "pouch"].includes(p.category))
        );
      })
      .catch(console.error);
  }, []);

  // Derived state
  const allProducts = products.filter((p) =>
    ["tote", "pouch"].includes(p.category)
  );
  const filtered =
    activeFilter === "all"
      ? allProducts
      : allProducts.filter((p) => p.category === activeFilter);
  const displayProducts = filtered.length > 0 ? filtered : featuredProducts;
  const toteCount = allProducts.filter((p) => p.category === "tote").length;
  const pouchCount = allProducts.filter((p) => p.category === "pouch").length;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400;1,600&family=Instrument+Sans:wght@300;400;500&display=swap');

        :root {
          --ad-indigo:      #1B2A4A;
          --ad-indigo-deep: #111d33;
          --ad-indigo-mid:  #243560;
          --ad-amber:       #C17B3A;
          --ad-amber-lt:    #D4956A;
          --ad-amber-pale:  #F0DFC4;
          --ad-cream:       #F5F0E8;
          --ad-cream-lt:    #FDF9F4;
          --ad-cocoa:       #2C1810;
          --ad-shea:        #E8D5B0;
          --ad-muted:       #7A6E60;
          --ad-rule:        #E2D4BE;
          --ad-rule-dark:   #1e2d4e;
          --ad-display:     'Cormorant Garamond', Georgia, serif;
          --ad-body:        'Instrument Sans', system-ui, sans-serif;
          --ad-ease:        cubic-bezier(0.16, 1, 0.3, 1);
        }

        html { scroll-behavior: smooth; }
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          background: var(--ad-cream);
          color: var(--ad-cocoa);
          font-family: var(--ad-body);
          font-weight: 400;
          -webkit-font-smoothing: antialiased;
          overflow-x: hidden;
        }

        /* ── NAV ── */
        .ad-nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 300;
          height: 68px;
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 5vw;
          transition: background 0.45s var(--ad-ease), border-color 0.45s;
          border-bottom: 1px solid transparent;
        }
        .ad-nav.scrolled {
          background: rgba(245,240,232,0.96);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-color: var(--ad-rule);
        }
        .ad-nav-logo {
          font-family: var(--ad-display);
          font-size: 28px; font-weight: 400;
          letter-spacing: 0.06em; text-transform: uppercase;
          color: #f5f0e8; text-decoration: none; line-height: 1;
          transition: color 0.3s;
        }
        .ad-nav-logo.dark { color: var(--ad-indigo); }
        .ad-nav-logo span { color: var(--ad-amber); font-style: italic; font-weight: 300; }
        .ad-nav-links {
          display: flex; align-items: center; gap: 40px; list-style: none;
        }
        .ad-nav-links a {
          font-size: 11px; font-weight: 400; letter-spacing: 0.22em;
          text-transform: uppercase;
          color: rgba(245,240,232,0.7); text-decoration: none; transition: color 0.2s;
        }
        .ad-nav-links.dark a { color: var(--ad-muted); }
        .ad-nav-links a:hover,
        .ad-nav-links.dark a:hover { color: var(--ad-amber); }
        .ad-nav-cta {
          background: var(--ad-amber) !important;
          color: #fff !important;
          padding: 10px 24px !important;
          letter-spacing: 0.18em !important;
          transition: background 0.2s !important;
        }
        .ad-nav-cta:hover { background: var(--ad-amber-lt) !important; color: #fff !important; }
        .ad-nav-links.dark .ad-nav-cta {
          background: var(--ad-indigo) !important;
          color: var(--ad-cream) !important;
        }

        /* ── HERO ── */
        .ad-hero {
          min-height: 100svh;
          display: grid;
          grid-template-columns: 52% 48%;
          background: var(--ad-indigo);
          position: relative;
          overflow: hidden;
        }

        /* Hero left */
        .ad-hero-left {
          display: flex; flex-direction: column;
          justify-content: flex-end;
          padding: 130px 5vw 100px;
          position: relative; z-index: 2;
        }
        .ad-hero-eyebrow {
          font-size: 10px; font-weight: 500;
          letter-spacing: 0.38em; text-transform: uppercase;
          color: var(--ad-amber);
          display: flex; align-items: center; gap: 16px;
          margin-bottom: 32px;
        }
        .ad-hero-eyebrow::before {
          content: '';
          width: 28px; height: 1px;
          background: var(--ad-amber); flex-shrink: 0;
        }
        .ad-hero-h1 {
          font-family: var(--ad-display);
          font-size: clamp(58px, 6.8vw, 108px);
          font-weight: 300; line-height: 0.9;
          letter-spacing: -0.01em;
          color: var(--ad-cream);
        }
        .ad-hero-h1 em {
          font-style: italic;
          color: var(--ad-amber-lt);
          display: block;
          margin-top: 4px;
        }
        .ad-hero-body {
          margin-top: 32px;
          font-size: 16px; font-weight: 300;
          color: rgba(232,213,176,0.75);
          max-width: 400px; line-height: 1.85;
        }
        .ad-hero-actions {
          margin-top: 48px;
          display: flex; gap: 12px; flex-wrap: wrap;
        }
        .ad-btn-amber {
          display: inline-flex; align-items: center; gap: 10px;
          background: var(--ad-amber); color: #fff;
          padding: 16px 36px;
          font-family: var(--ad-body);
          font-size: 11px; font-weight: 500;
          letter-spacing: 0.22em; text-transform: uppercase;
          text-decoration: none;
          transition: background 0.25s var(--ad-ease), transform 0.25s;
          white-space: nowrap;
        }
        .ad-btn-amber:hover { background: var(--ad-amber-lt); transform: translateY(-2px); }
        .ad-btn-ghost {
          display: inline-flex; align-items: center; gap: 10px;
          border: 1px solid rgba(232,213,176,0.25);
          color: rgba(232,213,176,0.6);
          padding: 16px 36px;
          font-family: var(--ad-body);
          font-size: 11px; font-weight: 400;
          letter-spacing: 0.22em; text-transform: uppercase;
          text-decoration: none;
          transition: border-color 0.25s, color 0.25s;
          white-space: nowrap;
        }
        .ad-btn-ghost:hover {
          border-color: var(--ad-amber);
          color: var(--ad-amber-lt);
        }

        /* Hero right */
        .ad-hero-right {
          position: relative; overflow: hidden;
          background: var(--ad-indigo-deep);
        }
        .ad-hero-pattern {
          position: absolute; inset: 0;
        }
        .ad-hero-ghost-text {
          position: absolute; bottom: 40px; right: -8px;
          font-family: var(--ad-display);
          font-size: clamp(70px, 10vw, 140px);
          font-weight: 300; font-style: italic;
          color: rgba(193,123,58,0.07);
          white-space: nowrap; line-height: 1;
          pointer-events: none; user-select: none;
          letter-spacing: -0.03em;
        }
        .ad-hero-cards {
          position: absolute; inset: 0;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          gap: 20px; padding: 110px 36px 90px;
        }
        .ad-hero-card {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(193,123,58,0.18);
          padding: 26px 28px;
          display: flex; align-items: center; gap: 20px;
          width: 100%; max-width: 300px;
          position: relative; overflow: hidden;
          backdrop-filter: blur(8px);
        }
        .ad-hero-card::before {
          content: '';
          position: absolute; left: 0; top: 0; bottom: 0;
          width: 3px; background: var(--ad-amber);
        }
        .ad-hero-card-icon {
          font-size: 36px; line-height: 1; flex-shrink: 0;
        }
        .ad-hero-card-label {
          font-size: 9px; font-weight: 500;
          letter-spacing: 0.32em; text-transform: uppercase;
          color: var(--ad-amber); margin-bottom: 5px;
        }
        .ad-hero-card-name {
          font-family: var(--ad-display);
          font-size: 19px; font-weight: 400;
          color: var(--ad-cream); line-height: 1.1;
        }
        .ad-hero-card-sub {
          font-size: 12px; font-weight: 300;
          color: rgba(193,123,58,0.65); margin-top: 3px;
        }
        .ad-hero-stats {
          position: absolute; bottom: 0; left: 0; right: 0;
          display: flex; gap: 1px;
        }
        .ad-hero-stat {
          flex: 1;
          background: rgba(255,255,255,0.025);
          border-top: 1px solid rgba(255,255,255,0.04);
          padding: 14px 0; text-align: center;
        }
        .ad-hero-stat-num {
          font-family: var(--ad-display);
          font-size: 24px; font-weight: 400;
          color: var(--ad-amber-lt); line-height: 1;
        }
        .ad-hero-stat-label {
          font-size: 9px; font-weight: 500;
          letter-spacing: 0.2em; text-transform: uppercase;
          color: rgba(193,123,58,0.4); margin-top: 3px;
        }

        /* ── SECTION COMMONS ── */
        .ad-section { padding: 100px 5vw; }
        .ad-section-inner { max-width: 1360px; margin: 0 auto; }
        .ad-section-label {
          font-size: 10px; font-weight: 500;
          letter-spacing: 0.38em; text-transform: uppercase;
          color: var(--ad-amber); margin-bottom: 16px;
          display: flex; align-items: center; gap: 12px;
        }
        .ad-section-label::after {
          content: '';
          width: 36px; height: 1px;
          background: var(--ad-rule);
        }
        .ad-section-label-light::after { background: var(--ad-rule-dark); }
        .ad-section-h2 {
          font-family: var(--ad-display);
          font-size: clamp(34px, 3.8vw, 58px);
          font-weight: 300; line-height: 1.05;
          letter-spacing: -0.01em; color: var(--ad-indigo);
        }
        .ad-section-h2-light { color: var(--ad-cream); }
        .ad-section-header {
          display: flex; align-items: flex-end;
          justify-content: space-between;
          margin-bottom: 56px; flex-wrap: wrap; gap: 28px;
        }

        /* ── PRODUCTS ── */
        .ad-products-section {
          background: var(--ad-cream); padding: 100px 5vw;
        }
        .ad-filter-row {
          display: flex; gap: 2px;
        }
        .ad-filter-btn {
          padding: 10px 22px;
          font-family: var(--ad-body);
          font-size: 11px; font-weight: 400;
          letter-spacing: 0.18em; text-transform: uppercase;
          background: var(--ad-cream-lt);
          border: none; cursor: pointer;
          color: var(--ad-muted);
          transition: background 0.2s, color 0.2s;
        }
        .ad-filter-btn:hover:not(.active) {
          background: var(--ad-amber-pale);
          color: var(--ad-cocoa);
        }
        .ad-filter-btn.active {
          background: var(--ad-indigo);
          color: var(--ad-cream);
          font-weight: 500;
        }
        .ad-products-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 2px;
        }
        .ad-products-empty {
          grid-column: 1/-1; padding: 80px 0; text-align: center;
          font-family: var(--ad-display);
          font-size: 26px; font-style: italic;
          color: var(--ad-muted);
        }

        /* Product card */
        .ad-product-card {
          display: block; text-decoration: none; color: inherit;
          background: var(--ad-cream-lt);
        }
        .ad-product-img-wrap {
          position: relative; aspect-ratio: 3/4; overflow: hidden;
          background: var(--ad-shea);
        }
        .ad-product-img { transition: transform 0.7s var(--ad-ease); }
        .ad-product-card:hover .ad-product-img { transform: scale(1.06); }
        .ad-product-placeholder {
          width: 100%; height: 100%;
          display: flex; align-items: center; justify-content: center;
          background: linear-gradient(160deg, var(--ad-shea) 0%, var(--ad-amber-pale) 100%);
        }
        .ad-placeholder-inner {
          display: flex; flex-direction: column; align-items: center; gap: 12px;
        }
        .ad-placeholder-icon { font-size: 56px; }
        .ad-placeholder-label {
          font-family: var(--ad-display);
          font-size: 14px; font-style: italic;
          color: var(--ad-amber); letter-spacing: 0.05em;
        }
        .ad-product-overlay {
          position: absolute; inset: 0;
          background: rgba(27,42,74,0);
          display: flex; align-items: flex-end; padding: 20px;
          transition: background 0.35s;
        }
        .ad-product-card:hover .ad-product-overlay {
          background: rgba(27,42,74,0.42);
        }
        .ad-product-cta {
          font-size: 10px; letter-spacing: 0.25em; text-transform: uppercase;
          color: var(--ad-cream); opacity: 0; transform: translateY(10px);
          transition: opacity 0.3s, transform 0.3s;
        }
        .ad-product-card:hover .ad-product-cta { opacity: 1; transform: translateY(0); }
        .ad-product-badge {
          position: absolute; top: 14px; left: 14px;
          background: var(--ad-amber); color: #fff;
          font-size: 8px; letter-spacing: 0.28em; text-transform: uppercase;
          padding: 5px 12px; font-family: var(--ad-body);
        }
        .ad-badge-new { background: var(--ad-indigo); }
        .ad-product-meta { padding: 18px 20px 24px; }
        .ad-product-category {
          font-size: 10px; font-weight: 500;
          letter-spacing: 0.28em; text-transform: uppercase;
          color: var(--ad-amber); margin-bottom: 6px;
        }
        .ad-product-name {
          font-family: var(--ad-display);
          font-size: 22px; font-weight: 400; line-height: 1.15;
          margin-bottom: 10px; color: var(--ad-indigo);
        }
        .ad-product-footer {
          display: flex; align-items: center; justify-content: space-between;
        }
        .ad-product-price {
          font-size: 14px; font-weight: 400;
          color: var(--ad-muted); letter-spacing: 0.02em;
        }
        .ad-product-personalise {
          font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase;
          color: var(--ad-amber); font-weight: 500;
        }

        /* ── OCCASIONS ── */
        .ad-occasions-section {
          background: var(--ad-indigo);
          padding: 80px 5vw; position: relative; overflow: hidden;
        }
        .ad-occasions-grid {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 2px; margin-top: 44px;
        }
        .ad-occasion-card {
          display: block; text-decoration: none;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(193,123,58,0.1);
          padding: 28px 16px; text-align: center;
          transition: background 0.25s, border-color 0.25s;
        }
        .ad-occasion-card:hover {
          background: rgba(193,123,58,0.08);
          border-color: rgba(193,123,58,0.3);
        }
        .ad-occasion-icon {
          font-size: 26px; margin-bottom: 10px; display: block;
        }
        .ad-occasion-name {
          font-family: var(--ad-display);
          font-size: 16px; font-weight: 400;
          color: var(--ad-cream); line-height: 1.2;
        }
        .ad-occasion-arrow {
          font-size: 12px; color: var(--ad-amber);
          margin-top: 6px; opacity: 0;
          transition: opacity 0.2s;
        }
        .ad-occasion-card:hover .ad-occasion-arrow { opacity: 1; }

        /* ── PROCESS ── */
        .ad-process-section {
          background: var(--ad-cocoa);
          padding: 100px 5vw;
          position: relative; overflow: hidden;
        }
        .ad-process-steps {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 2px; margin-top: 60px;
        }
        .ad-process-step {
          background: rgba(255,255,255,0.025);
          padding: 40px 26px;
          border-top: 1px solid rgba(193,123,58,0.12);
          position: relative;
        }
        .ad-process-num {
          font-family: var(--ad-display);
          font-size: 80px; font-weight: 300;
          color: rgba(193,123,58,0.1);
          line-height: 1; margin-bottom: 20px;
          letter-spacing: -0.03em;
        }
        .ad-process-icon {
          font-size: 26px; display: block; margin-bottom: 14px;
        }
        .ad-process-step h4 {
          font-size: 15px; font-weight: 500;
          color: var(--ad-cream); margin-bottom: 10px;
          font-family: var(--ad-body);
          letter-spacing: 0.03em;
        }
        .ad-process-step p {
          font-size: 13px; font-weight: 300;
          color: rgba(232,213,176,0.5); line-height: 1.8;
        }

        /* ── WHY ADIRE ── */
        .ad-why-section {
          background: var(--ad-cream-lt);
          padding: 100px 5vw;
          border-top: 1px solid var(--ad-rule);
        }
        .ad-why-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2px; margin-top: 56px;
        }
        .ad-why-card {
          background: #fff; padding: 44px 36px;
          border-top: 2px solid transparent;
          transition: border-color 0.3s;
        }
        .ad-why-card:hover { border-color: var(--ad-amber); }
        .ad-why-icon { font-size: 28px; margin-bottom: 20px; display: block; }
        .ad-why-card h3 {
          font-family: var(--ad-display);
          font-size: 26px; font-weight: 400;
          margin-bottom: 12px; color: var(--ad-indigo);
        }
        .ad-why-card p {
          font-size: 14px; font-weight: 300;
          color: var(--ad-muted); line-height: 1.85;
        }

        /* ── CRAFT STRIP ── */
        .ad-craft-strip {
          background: var(--ad-indigo);
          padding: 80px 5vw;
          display: flex; align-items: center;
          justify-content: space-between;
          gap: 48px; flex-wrap: wrap;
          position: relative; overflow: hidden;
        }
        .ad-craft-left { max-width: 560px; position: relative; z-index: 1; }
        .ad-craft-h2 {
          font-family: var(--ad-display);
          font-size: clamp(32px, 3.8vw, 54px);
          font-weight: 300; line-height: 1.05;
          letter-spacing: -0.01em; color: var(--ad-cream);
          margin-bottom: 16px;
        }
        .ad-craft-h2 em { font-style: italic; color: var(--ad-amber-lt); }
        .ad-craft-p {
          font-size: 15px; font-weight: 300;
          color: rgba(232,213,176,0.55); line-height: 1.85;
        }
        .ad-craft-actions {
          display: flex; flex-direction: column;
          gap: 12px; min-width: 220px; position: relative; z-index: 1;
        }
        .ad-btn-cream {
          display: block; text-align: center;
          background: var(--ad-cream); color: var(--ad-indigo);
          padding: 17px 36px;
          font-family: var(--ad-body);
          font-size: 11px; letter-spacing: 0.22em;
          text-transform: uppercase; text-decoration: none;
          font-weight: 400; transition: background 0.25s, color 0.25s;
        }
        .ad-btn-cream:hover { background: var(--ad-amber); color: #fff; }
        .ad-btn-outline-light {
          display: block; text-align: center;
          border: 1px solid rgba(193,123,58,0.3);
          color: rgba(193,123,58,0.65);
          padding: 17px 36px;
          font-family: var(--ad-body);
          font-size: 11px; letter-spacing: 0.22em;
          text-transform: uppercase; text-decoration: none;
          font-weight: 400; transition: border-color 0.25s, color 0.25s;
        }
        .ad-btn-outline-light:hover { border-color: var(--ad-amber); color: var(--ad-amber-lt); }

        /* ── FOOTER ── */
        .ad-footer { background: var(--ad-indigo-deep); padding: 72px 5vw 32px; }
        .ad-footer-top {
          display: grid; grid-template-columns: 2fr 1fr 1fr;
          gap: 56px; padding-bottom: 56px;
          border-bottom: 1px solid var(--ad-rule-dark);
        }
        .ad-footer-brand {
          font-family: var(--ad-display);
          font-size: 32px; font-weight: 300;
          letter-spacing: 0.08em; text-transform: uppercase;
          color: var(--ad-cream); margin-bottom: 6px; line-height: 1;
        }
        .ad-footer-brand span { color: var(--ad-amber); font-style: italic; font-weight: 300; }
        .ad-footer-tagline {
          font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase;
          color: rgba(193,123,58,0.5); margin-bottom: 16px;
        }
        .ad-footer-desc {
          font-size: 13px; font-weight: 300;
          color: rgba(193,123,58,0.35); line-height: 1.85; max-width: 260px;
        }
        .ad-footer-col h4 {
          font-size: 10px; font-weight: 500;
          letter-spacing: 0.32em; text-transform: uppercase;
          color: var(--ad-amber); margin-bottom: 20px;
        }
        .ad-footer-col ul { list-style: none; }
        .ad-footer-col li { margin-bottom: 10px; }
        .ad-footer-col a {
          font-size: 13px; font-weight: 300;
          color: rgba(193,123,58,0.35); text-decoration: none;
          transition: color 0.2s;
        }
        .ad-footer-col a:hover { color: var(--ad-amber-lt); }
        .ad-footer-bottom {
          display: flex; align-items: center;
          justify-content: space-between;
          padding-top: 28px; flex-wrap: wrap; gap: 16px;
        }
        .ad-footer-copy {
          font-size: 12px; font-weight: 300;
          color: rgba(193,123,58,0.25); letter-spacing: 0.06em;
        }
        .ad-footer-copy span { color: var(--ad-amber); }
        .ad-footer-legal { display: flex; gap: 24px; }
        .ad-footer-legal a {
          font-size: 11px; font-weight: 300;
          color: rgba(193,123,58,0.25); text-decoration: none;
          letter-spacing: 0.08em; transition: color 0.2s;
        }
        .ad-footer-legal a:hover { color: rgba(193,123,58,0.55); }

        /* ── RESPONSIVE ── */
        @media (max-width: 1100px) {
          .ad-process-steps { grid-template-columns: 1fr 1fr; }
          .ad-occasions-grid { grid-template-columns: repeat(3, 1fr); }
          .ad-footer-top { grid-template-columns: 1fr 1fr; }
        }
        @media (max-width: 800px) {
          .ad-hero { grid-template-columns: 1fr; min-height: auto; }
          .ad-hero-left { padding: 110px 6vw 72px; }
          .ad-hero-right { display: none; }
          .ad-nav-links { display: none; }
          .ad-why-grid { grid-template-columns: 1fr; }
          .ad-process-steps { grid-template-columns: 1fr; }
          .ad-craft-strip { flex-direction: column; }
          .ad-craft-actions { width: 100%; }
          .ad-products-grid { grid-template-columns: 1fr 1fr; }
          .ad-occasions-grid { grid-template-columns: repeat(3, 1fr); }
          .ad-footer-top { grid-template-columns: 1fr; gap: 36px; }
        }
        @media (max-width: 480px) {
          .ad-products-grid { grid-template-columns: 1fr; }
          .ad-occasions-grid { grid-template-columns: repeat(2, 1fr); }
        }
      `}</style>

      <GrainOverlay />

      {/* ── NAV ── */}
      <nav className={`ad-nav ${scrolled ? "scrolled" : ""}`}>
        <Link href="/" className={`ad-nav-logo ${scrolled ? "dark" : ""}`}>
          Adire<span>.</span>
        </Link>
        <ul className={`ad-nav-links ${scrolled ? "dark" : ""}`}>
          <li><Link href="/shop">Shop</Link></li>
          <li><Link href="/occasions">Occasions</Link></li>
          <li><Link href="/business">Business</Link></li>
          <li><Link href="/about">Our Story</Link></li>
          <li>
            <Link href="/shop" className="ad-nav-cta">
              Personalise Now
            </Link>
          </li>
        </ul>
      </nav>

      {/* ── HERO ── */}
      <section className="ad-hero">

        {/* Left — copy */}
        <div className="ad-hero-left">
          <motion.div
            className="ad-hero-eyebrow"
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: [0.16,1,0.3,1], delay: 0.1 }}
          >
            Benin City, Nigeria · Est. 2025
          </motion.div>

          <motion.h1
            className="ad-hero-h1"
            initial={{ opacity: 0, y: 36 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, ease: [0.16,1,0.3,1], delay: 0.22 }}
          >
            Made Personal.
            <em>Made Nigerian.</em>
          </motion.h1>

          <motion.p
            className="ad-hero-body"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16,1,0.3,1], delay: 0.38 }}
          >
            Personalised Ankara tote bags and pouches, embroidered with your
            name and made to order in Benin City. A gift that feels like it
            was always theirs.
          </motion.p>

          <motion.div
            className="ad-hero-actions"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16,1,0.3,1], delay: 0.52 }}
          >
            <Link href="/shop?category=tote" className="ad-btn-amber">
              Shop Tote Bags
            </Link>
            <Link href="/shop?category=pouch" className="ad-btn-ghost">
              Explore Pouches
            </Link>
          </motion.div>
        </div>

        {/* Right — decorative cards */}
        <motion.div
          className="ad-hero-right"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.35 }}
        >
          <div className="ad-hero-pattern">
            <AdirePattern opacity={0.07} />
          </div>

          <div className="ad-hero-ghost-text">Adire.</div>

          <div className="ad-hero-cards">
            <motion.div
              className="ad-hero-card"
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 6.5, ease: "easeInOut", repeat: Infinity }}
            >
              <div className="ad-hero-card-icon">👜</div>
              <div>
                <div className="ad-hero-card-label">Product 01</div>
                <div className="ad-hero-card-name">Ankara Tote Bag</div>
                <div className="ad-hero-card-sub">Embroidered · Made to order</div>
              </div>
            </motion.div>

            <motion.div
              className="ad-hero-card"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 7.5, ease: "easeInOut", repeat: Infinity, delay: 1.2 }}
            >
              <div className="ad-hero-card-icon">👝</div>
              <div>
                <div className="ad-hero-card-label">Product 02</div>
                <div className="ad-hero-card-name">Ankara Pouch</div>
                <div className="ad-hero-card-sub">Personalised · Gift-ready</div>
              </div>
            </motion.div>
          </div>

          <div className="ad-hero-stats">
            {[
              { num: "100%", label: "Handmade" },
              { num: "3–5d", label: "Delivery" },
              { num: "🇳🇬", label: "Nationwide" },
            ].map((s) => (
              <div className="ad-hero-stat" key={s.label}>
                <div className="ad-hero-stat-num">{s.num}</div>
                <div className="ad-hero-stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ── PRODUCTS ── */}
      <section className="ad-products-section">
        <div className="ad-section-inner">
          <div className="ad-section-header">
            <div>
              <SectionLabel>Our Products</SectionLabel>
              <h2 className="ad-section-h2">
                Two products.<br />Infinite occasions.
              </h2>
            </div>
            <div className="ad-filter-row">
              {(
                [
                  { key: "all",   label: `All (${allProducts.length})` },
                  { key: "tote",  label: `Tote Bags (${toteCount})` },
                  { key: "pouch", label: `Pouches (${pouchCount})` },
                ] as const
              ).map(({ key, label }) => (
                <button
                  key={key}
                  className={`ad-filter-btn ${activeFilter === key ? "active" : ""}`}
                  onClick={() => setActiveFilter(key)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <motion.div
            ref={productsRef}
            className="ad-products-grid"
            variants={stagger}
            initial="hidden"
            animate={productsInView ? "show" : "hidden"}
          >
            {displayProducts.length > 0 ? (
              displayProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : (
              <div className="ad-products-empty">New patterns arriving soon.</div>
            )}
          </motion.div>
        </div>
      </section>

      {/* ── OCCASIONS ── */}
      <section className="ad-occasions-section">
        <div className="ad-section-inner">
          <SectionLabel light>Shop by Occasion</SectionLabel>
          <h2 className="ad-section-h2 ad-section-h2-light">
            Every celebration<br />deserves something real.
          </h2>
          <motion.div
            ref={occasionsRef}
            className="ad-occasions-grid"
            variants={stagger}
            initial="hidden"
            animate={occasionsInView ? "show" : "hidden"}
          >
            {[
              { icon: "🎂", name: "Birthday",    slug: "birthday" },
              { icon: "💍", name: "Anniversary", slug: "anniversary" },
              { icon: "🎓", name: "Graduation",  slug: "graduation" },
              { icon: "🤍", name: "Wedding",     slug: "wedding" },
              { icon: "🎁", name: "Just Because",slug: "just-because" },
              { icon: "🏢", name: "Corporate",   slug: "corporate" },
            ].map((o) => (
              <motion.div key={o.slug} variants={fadeUp}>
                <Link href={`/shop?tag=${o.slug}`} className="ad-occasion-card">
                  <span className="ad-occasion-icon">{o.icon}</span>
                  <div className="ad-occasion-name">{o.name}</div>
                  <div className="ad-occasion-arrow">→</div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
        <AdirePattern opacity={0.05} />
      </section>

      {/* ── PROCESS ── */}
      <section className="ad-process-section">
        <div className="ad-section-inner">
          <SectionLabel light>How It Works</SectionLabel>
          <h2 className="ad-section-h2 ad-section-h2-light">
            From your name<br />to their hands.
          </h2>
          <motion.div
            ref={processRef}
            className="ad-process-steps"
            variants={stagger}
            initial="hidden"
            animate={processInView ? "show" : "hidden"}
          >
            {[
              {
                num: "01", icon: "🧵",
                title: "Choose your product",
                body: "Pick a tote bag or pouch. Browse our curated Ankara patterns and choose the one that speaks to the occasion.",
              },
              {
                num: "02", icon: "✍🏾",
                title: "Personalise it",
                body: "Tell us the name to be embroidered, any message, and the occasion. Every piece is made to your exact specification.",
              },
              {
                num: "03", icon: "🪡",
                title: "We craft it",
                body: "Your bag is cut, sewn, and embroidered by hand in Benin City. Packaged in kraft tissue so it arrives as a gift should.",
              },
              {
                num: "04", icon: "📦",
                title: "Delivered to them",
                body: "Shipped nationwide via GIG Logistics within 3–5 days. Trackable, insured, and beautifully packaged on arrival.",
              },
            ].map((step) => (
              <motion.div key={step.num} className="ad-process-step" variants={fadeUp}>
                <div className="ad-process-num">{step.num}</div>
                <span className="ad-process-icon">{step.icon}</span>
                <h4>{step.title}</h4>
                <p>{step.body}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── WHY ADIRE ── */}
      <section className="ad-why-section">
        <div className="ad-section-inner">
          <SectionLabel>Why Adire</SectionLabel>
          <h2 className="ad-section-h2">
            A gift they will keep.<br />Not just receive.
          </h2>
          <motion.div
            ref={whyRef}
            className="ad-why-grid"
            variants={stagger}
            initial="hidden"
            animate={whyInView ? "show" : "hidden"}
          >
            {[
              {
                icon: "🇳🇬",
                title: "Proudly Nigerian",
                body: "Every pattern is authentic Ankara fabric sourced locally. Every stitch is Nigerian craftsmanship. Not imported. Not mass-produced.",
              },
              {
                icon: "✏️",
                title: "Truly personalised",
                body: "Your person's name, embroidered directly onto the fabric. Not a sticker. Not a print. A permanent part of the bag that lasts for years.",
              },
              {
                icon: "📦",
                title: "Packaged like a gift",
                body: "Every order arrives in a kraft gift box with tissue paper and a handwritten-feel card. The unboxing is part of the experience.",
              },
              {
                icon: "🏢",
                title: "Adire for Business",
                body: "Staff appreciation packs. Client gifts. Corporate events. Branded Ankara sets that actually impress. Bulk pricing available.",
              },
            ].map((item) => (
              <motion.div key={item.title} className="ad-why-card" variants={fadeUp}>
                <span className="ad-why-icon">{item.icon}</span>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── CTA STRIP ── */}
      <div className="ad-craft-strip">
        <AdirePattern opacity={0.04} />
        <div className="ad-craft-left">
          <h2 className="ad-craft-h2">
            Give something they will
            <br />
            <em>remember forever.</em>
          </h2>
          <p className="ad-craft-p">
            Order in minutes. Made by hand in Benin City.
            Delivered across Nigeria within 3–5 days.
          </p>
        </div>
        <div className="ad-craft-actions">
          <Link href="/shop" className="ad-btn-cream">Browse All Gifts</Link>
          <Link href="/business" className="ad-btn-outline-light">Corporate Orders →</Link>
        </div>
      </div>

      {/* ── FOOTER ── */}
      <footer className="ad-footer">
        <div className="ad-footer-top">
          <div>
            <div className="ad-footer-brand">Adire<span>.</span></div>
            <div className="ad-footer-tagline">Made Personal. Made Nigerian.</div>
            <p className="ad-footer-desc">
              Personalised Ankara tote bags and pouches, embroidered with your
              name and made to order. Crafted in Benin City. Delivered
              nationwide.
            </p>
          </div>
          <div className="ad-footer-col">
            <h4>Shop</h4>
            <ul>
              <li><Link href="/shop?category=tote">Ankara Tote Bags</Link></li>
              <li><Link href="/shop?category=pouch">Ankara Pouches</Link></li>
              <li><Link href="/shop?tag=bundle">Gift Sets</Link></li>
              <li><Link href="/business">Corporate Gifts</Link></li>
            </ul>
          </div>
          <div className="ad-footer-col">
            <h4>Support</h4>
            <ul>
              <li><Link href="/track">Track Order</Link></li>
              <li><Link href="/delivery">Delivery Info</Link></li>
              <li><Link href="/returns">Returns</Link></li>
              <li><Link href="/contact">Contact Us</Link></li>
              <li><Link href="/about">Our Story</Link></li>
            </ul>
          </div>
        </div>
        <div className="ad-footer-bottom">
          <div className="ad-footer-copy">
            © 2025 <span>Adire</span>. Proudly Nigerian.
          </div>
          <div className="ad-footer-legal">
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
          </div>
        </div>
      </footer>
    </>
  );
}