"use client";

// app/ClientHomepage.tsx
// Adire — Bold, cultural, unapologetically Nigerian
// Layout: asymmetric, overlapping, editorial with Ankara energy
// Fonts: Playfair Display (display) · Syne (body/labels)
// Palette: deep indigo · kola amber · harmattan cream · terracotta · forest

import { useState, useEffect, useRef } from "react";
import { motion, useInView, useScroll, useTransform, type Variants } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

const BaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.lensra.com/";

function getImageUrl(p: string | null | undefined): string | null {
  if (!p) return null;
  if (p.startsWith("http://") || p.startsWith("https://")) return p;
  return `${BaseUrl.replace(/\/$/, "")}${p.startsWith("/") ? p : "/" + p}`;
}

function formatPrice(price: string | number) {
  const n = typeof price === "string" ? parseFloat(price) : price;
  return `₦${n.toLocaleString("en-NG", { minimumFractionDigits: 0 })}`;
}

const EASE = [0.16, 1, 0.3, 1] as const;

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
};
const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.13, delayChildren: 0.05 } },
};

// ── Ankara SVG tile pattern ───────────────────────────────────────────────────
function AnkaraTile({ color = "#C17B3A", size = 60, opacity = 1 }: {
  color?: string; size?: number; opacity?: number;
}) {
  const h = size; const w = size;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} fill="none"
      xmlns="http://www.w3.org/2000/svg" style={{ opacity }}>
      <rect width={w} height={h} fill="none" />
      <circle cx={w/2} cy={h/2} r={h*0.18} fill={color} />
      <circle cx={w/2} cy={h/2} r={h*0.32} fill="none" stroke={color} strokeWidth="1" />
      <circle cx={w/2} cy={h/2} r={h*0.46} fill="none" stroke={color} strokeWidth="0.5" />
      <line x1="0" y1={h/2} x2={w} y2={h/2} stroke={color} strokeWidth="0.4" />
      <line x1={w/2} y1="0" x2={w/2} y2={h} stroke={color} strokeWidth="0.4" />
      <line x1="0" y1="0" x2={w} y2={h} stroke={color} strokeWidth="0.3" />
      <line x1={w} y1="0" x2="0" y2={h} stroke={color} strokeWidth="0.3" />
      <rect x={w*0.1} y={h*0.1} width={w*0.3} height={h*0.3}
        fill="none" stroke={color} strokeWidth="0.4"
        transform={`rotate(45 ${w*0.25} ${h*0.25})`} />
      <rect x={w*0.6} y={h*0.1} width={w*0.3} height={h*0.3}
        fill="none" stroke={color} strokeWidth="0.4"
        transform={`rotate(45 ${w*0.75} ${h*0.25})`} />
      <rect x={w*0.1} y={h*0.6} width={w*0.3} height={h*0.3}
        fill="none" stroke={color} strokeWidth="0.4"
        transform={`rotate(45 ${w*0.25} ${h*0.75})`} />
      <rect x={w*0.6} y={h*0.6} width={w*0.3} height={h*0.3}
        fill="none" stroke={color} strokeWidth="0.4"
        transform={`rotate(45 ${w*0.75} ${h*0.75})`} />
    </svg>
  );
}

// ── Full-bleed Ankara background pattern ──────────────────────────────────────
function AnkaraPattern({ color = "#C17B3A", opacity = 0.07 }: {
  color?: string; opacity?: number;
}) {
  return (
    <svg aria-hidden style={{
      position: "absolute", inset: 0, width: "100%", height: "100%",
      pointerEvents: "none", opacity,
    }} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id={`ankara-${color.replace("#","")}`}
          x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
          <circle cx="30" cy="30" r="5" fill={color} />
          <circle cx="30" cy="30" r="10" fill="none" stroke={color} strokeWidth="0.8" />
          <circle cx="30" cy="30" r="17" fill="none" stroke={color} strokeWidth="0.4" />
          <circle cx="30" cy="30" r="24" fill="none" stroke={color} strokeWidth="0.3" />
          <line x1="0" y1="30" x2="60" y2="30" stroke={color} strokeWidth="0.3" />
          <line x1="30" y1="0" x2="30" y2="60" stroke={color} strokeWidth="0.3" />
          <line x1="0" y1="0" x2="60" y2="60" stroke={color} strokeWidth="0.2" />
          <line x1="60" y1="0" x2="0" y2="60" stroke={color} strokeWidth="0.2" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#ankara-${color.replace("#","")})`} />
    </svg>
  );
}

// ── Grain overlay ─────────────────────────────────────────────────────────────
function Grain() {
  return (
    <svg aria-hidden style={{
      position: "fixed", inset: 0, width: "100%", height: "100%",
      pointerEvents: "none", zIndex: 9999, opacity: 0.025, mixBlendMode: "multiply",
    }}>
      <filter id="grain-f">
        <feTurbulence type="fractalNoise" baseFrequency="0.72"
          numOctaves="3" stitchTiles="stitch" />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#grain-f)" />
    </svg>
  );
}

// ── Marquee strip ─────────────────────────────────────────────────────────────
function Marquee() {
  const items = [
    "ANKARA TOTE BAGS", "✦", "MADE IN BENIN CITY", "✦",
    "EMBROIDERED BY HAND", "✦", "DELIVERED NATIONWIDE", "✦",
    "PERSONALISED FOR YOU", "✦", "PROUDLY NIGERIAN", "✦",
  ];
  const repeated = [...items, ...items];
  return (
    <div className="ad-marquee-wrap">
      <motion.div
        className="ad-marquee-track"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 22, ease: "linear", repeat: Infinity }}
      >
        {repeated.map((item, i) => (
          <span key={i} className={item === "✦" ? "ad-marquee-dot" : "ad-marquee-item"}>
            {item}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

// ── Product card ──────────────────────────────────────────────────────────────
function ProductCard({ product, index }: { product: any; index: number }) {
  const imageUrl = getImageUrl(product.image_url);
  const isTote = product.category === "tote";
  const isOffset = index % 3 === 1;

  return (
    <motion.div variants={fadeUp}
      style={{ marginTop: isOffset ? "48px" : "0" }}
    >
      <Link href={`/shop/${product.slug}`} className="ad-product-card">
        <div className="ad-product-img-wrap">
          {product.is_trending && (
            <div className="ad-product-badge">Hot</div>
          )}
          {product.is_new && (
            <div className="ad-product-badge ad-badge-new">New</div>
          )}
          {imageUrl ? (
            <Image src={imageUrl} alt={product.name} fill
              sizes="(max-width: 768px) 100vw, 33vw"
              style={{ objectFit: "cover" }} className="ad-product-img" />
          ) : (
            <div className="ad-product-placeholder">
              <AnkaraTile color="#C17B3A" size={80} opacity={0.35} />
              <span className="ad-placeholder-text">
                {isTote ? "Ankara Tote Bag" : "Ankara Pouch"}
              </span>
            </div>
          )}
          <div className="ad-product-hover">
            <span>Personalise this →</span>
          </div>
        </div>
        <div className="ad-product-info">
          <span className="ad-product-cat">
            {isTote ? "Tote Bag" : "Pouch"}
          </span>
          <h3 className="ad-product-name">{product.name}</h3>
          <div className="ad-product-row">
            <span className="ad-product-price">
              From {formatPrice(product.base_price || 0)}
            </span>
            <span className="ad-product-arrow">→</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function ClientHomepage({ initialProducts }: { initialProducts: any[] }) {
  const [products] = useState(initialProducts);
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [activeFilter, setActiveFilter] = useState<"all" | "tote" | "pouch">("all");
  const [scrolled, setScrolled] = useState(false);

  const heroRef = useRef(null);
  const productsRef = useRef(null);
  const processRef = useRef(null);
  const whyRef = useRef(null);

  const productsInView = useInView(productsRef, { once: true, margin: "-60px" });
  const processInView  = useInView(processRef,  { once: true, margin: "-60px" });
  const whyInView      = useInView(whyRef,      { once: true, margin: "-60px" });

  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", fn, { passive: true });
    fn();
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    fetch(`${BaseUrl}api/products/featured/`)
      .then(r => r.json())
      .then(d => {
        const r = d.results || d || [];
        setFeaturedProducts(r.filter((p: any) => ["tote","pouch"].includes(p.category)));
      })
      .catch(console.error);
  }, []);

  const allProducts = products.filter(p => ["tote","pouch"].includes(p.category));
  const filtered = activeFilter === "all" ? allProducts
    : allProducts.filter(p => p.category === activeFilter);
  const displayProducts = filtered.length > 0 ? filtered : featuredProducts;
  const toteCount  = allProducts.filter(p => p.category === "tote").length;
  const pouchCount = allProducts.filter(p => p.category === "pouch").length;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=Syne:wght@400;500;600;700;800&display=swap');

        :root {
          --indigo:    #1B2A4A;
          --indigo-d:  #0e1a30;
          --amber:     #C17B3A;
          --amber-l:   #D4956A;
          --amber-p:   #F0DFC4;
          --cream:     #F5F0E8;
          --cream-l:   #FDF9F4;
          --terra:     #8B3A2A;
          --forest:    #2A4A2E;
          --cocoa:     #2C1810;
          --muted:     #7A6E60;
          --rule:      #E2D4BE;
          --disp:      'Playfair Display', Georgia, serif;
          --body:      'Syne', system-ui, sans-serif;
          --ease:      cubic-bezier(0.16, 1, 0.3, 1);
        }

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body {
          background: var(--cream);
          color: var(--cocoa);
          font-family: var(--body);
          -webkit-font-smoothing: antialiased;
          overflow-x: hidden;
        }

        /* ── HERO ───────────────────────────────────────────────────── */
        .ad-hero {
          min-height: 100svh;
          background: var(--indigo-d);
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }

        .ad-hero-bg {
          position: absolute; inset: 0;
          will-change: transform;
        }

        /* Big rotated "ADIRE" watermark */
        .ad-hero-watermark {
          position: absolute;
          top: 50%; left: 50%;
          transform: translate(-50%, -50%) rotate(-12deg);
          font-family: var(--disp);
          font-size: clamp(120px, 18vw, 260px);
          font-weight: 900; font-style: italic;
          color: rgba(193,123,58,0.055);
          white-space: nowrap;
          pointer-events: none; user-select: none;
          letter-spacing: -0.04em; line-height: 1;
          z-index: 0;
        }

        /* Terracotta diagonal slash */
        .ad-hero-slash {
          position: absolute;
          top: 0; right: 0;
          width: 42%;
          height: 100%;
          background: var(--terra);
          clip-path: polygon(18% 0, 100% 0, 100% 100%, 0% 100%);
          z-index: 0;
          overflow: hidden;
        }

        /* Amber accent bar */
        .ad-hero-bar {
          position: absolute; left: 0; bottom: 0;
          width: 5px; height: 55%;
          background: var(--amber);
          z-index: 2;
        }

        .ad-hero-content {
          position: relative; z-index: 2;
          display: flex; flex-direction: column;
          justify-content: flex-end;
          flex: 1;
          padding: 120px 6vw 80px;
          max-width: 780px;
        }

        .ad-hero-overline {
          display: flex; align-items: center; gap: 14px;
          font-size: 10px; font-weight: 700;
          letter-spacing: 0.42em; text-transform: uppercase;
          color: var(--amber);
          margin-bottom: 28px;
        }
        .ad-hero-overline::before {
          content: '';
          display: block; width: 36px; height: 2px;
          background: var(--amber); flex-shrink: 0;
        }

        .ad-hero-h1 {
          font-family: var(--disp);
          font-size: clamp(64px, 9.5vw, 148px);
          font-weight: 900; line-height: 0.88;
          letter-spacing: -0.03em;
          color: var(--cream);
          position: relative;
        }
        .ad-hero-h1 .line-2 {
          display: block;
          color: var(--amber);
          font-style: italic;
          font-weight: 400;
          margin-left: clamp(32px, 5vw, 80px);
        }
        .ad-hero-h1 .line-3 {
          display: block;
          -webkit-text-stroke: 1.5px var(--cream);
          color: transparent;
        }

        /* Floating tag pinned to h1 */
        .ad-hero-tag {
          display: inline-flex; align-items: center; gap: 8px;
          background: var(--amber);
          padding: 6px 16px;
          font-size: 10px; font-weight: 700;
          letter-spacing: 0.28em; text-transform: uppercase;
          color: #fff;
          position: absolute; right: -12px; bottom: 16px;
        }

        .ad-hero-body {
          margin-top: 36px;
          font-size: 16px; font-weight: 400; line-height: 1.8;
          color: rgba(245,240,232,0.55);
          max-width: 440px;
        }

        .ad-hero-actions {
          margin-top: 44px;
          display: flex; gap: 12px; flex-wrap: wrap; align-items: center;
        }

        .ad-btn-primary {
          display: inline-flex; align-items: center; gap: 10px;
          background: var(--amber); color: #fff;
          padding: 18px 40px;
          font-family: var(--body);
          font-size: 11px; font-weight: 700;
          letter-spacing: 0.24em; text-transform: uppercase;
          text-decoration: none;
          transition: background 0.2s var(--ease), transform 0.2s;
        }
        .ad-btn-primary:hover { background: var(--amber-l); transform: translateY(-2px); }

        .ad-btn-secondary {
          display: inline-flex; align-items: center; gap: 10px;
          border: 1.5px solid rgba(245,240,232,0.2);
          color: rgba(245,240,232,0.55);
          padding: 18px 40px;
          font-family: var(--body);
          font-size: 11px; font-weight: 600;
          letter-spacing: 0.24em; text-transform: uppercase;
          text-decoration: none;
          transition: border-color 0.2s, color 0.2s;
        }
        .ad-btn-secondary:hover { border-color: var(--amber); color: var(--amber-l); }

        /* Hero stats — horizontal bottom strip */
        .ad-hero-stats {
          position: relative; z-index: 2;
          display: flex;
          border-top: 1px solid rgba(245,240,232,0.06);
        }
        .ad-hero-stat {
          flex: 1; padding: 22px 0 22px 5vw;
          border-right: 1px solid rgba(245,240,232,0.06);
        }
        .ad-hero-stat:last-child { border-right: none; }
        .ad-hero-stat-num {
          font-family: var(--disp);
          font-size: 36px; font-weight: 700;
          color: var(--amber); line-height: 1;
        }
        .ad-hero-stat-label {
          font-size: 10px; font-weight: 600;
          letter-spacing: 0.22em; text-transform: uppercase;
          color: rgba(245,240,232,0.3); margin-top: 4px;
        }

        /* Terracotta side image strip */
        .ad-hero-slash-inner {
          position: absolute; inset: 0;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          gap: 16px; padding: 120px 8% 80px;
        }

        .ad-slash-pill {
          background: rgba(0,0,0,0.2);
          border: 1px solid rgba(245,240,232,0.15);
          padding: 18px 20px;
          display: flex; align-items: center; gap: 14px;
          width: 100%; max-width: 260px;
          backdrop-filter: blur(6px);
        }
        .ad-slash-pill-icon { font-size: 32px; flex-shrink: 0; }
        .ad-slash-pill-label {
          font-size: 9px; font-weight: 700;
          letter-spacing: 0.3em; text-transform: uppercase;
          color: rgba(245,240,232,0.5); margin-bottom: 4px;
        }
        .ad-slash-pill-name {
          font-family: var(--disp);
          font-size: 17px; font-weight: 700;
          color: var(--cream); line-height: 1.1;
        }
        .ad-slash-pill-sub {
          font-size: 11px; font-weight: 400;
          color: rgba(245,240,232,0.4); margin-top: 3px;
        }

        /* ── MARQUEE ─────────────────────────────────────────────────── */
        .ad-marquee-wrap {
          background: var(--amber);
          padding: 14px 0; overflow: hidden;
          position: relative; z-index: 10;
        }
        .ad-marquee-track {
          display: flex; align-items: center; gap: 0;
          white-space: nowrap; width: max-content;
        }
        .ad-marquee-item {
          font-size: 11px; font-weight: 700;
          letter-spacing: 0.28em; text-transform: uppercase;
          color: #fff; padding: 0 28px;
        }
        .ad-marquee-dot {
          color: rgba(255,255,255,0.5);
          font-size: 14px; padding: 0 4px;
        }

        /* ── PRODUCTS ────────────────────────────────────────────────── */
        .ad-products-section {
          padding: 100px 6vw;
          background: var(--cream);
          position: relative;
        }

        /* Asymmetric section header */
        .ad-section-header {
          display: grid;
          grid-template-columns: 1fr auto;
          align-items: end;
          margin-bottom: 60px; gap: 32px;
        }
        .ad-section-overline {
          font-size: 10px; font-weight: 700;
          letter-spacing: 0.38em; text-transform: uppercase;
          color: var(--amber); margin-bottom: 12px;
          display: flex; align-items: center; gap: 12px;
        }
        .ad-section-overline::before {
          content: ''; width: 24px; height: 2px;
          background: var(--amber); flex-shrink: 0;
        }
        .ad-section-h2 {
          font-family: var(--disp);
          font-size: clamp(36px, 4.5vw, 68px);
          font-weight: 900; line-height: 0.92;
          letter-spacing: -0.02em; color: var(--indigo);
        }
        .ad-section-h2 em {
          font-style: italic; font-weight: 400; color: var(--amber);
        }
        .ad-section-h2-light { color: var(--cream); }

        /* Filter tabs */
        .ad-filters {
          display: flex; flex-direction: column;
          align-items: flex-end; gap: 6px;
        }
        .ad-filter-btn {
          display: block;
          font-family: var(--body);
          font-size: 10px; font-weight: 700;
          letter-spacing: 0.24em; text-transform: uppercase;
          padding: 8px 20px;
          background: none; border: 1.5px solid var(--rule);
          color: var(--muted); cursor: pointer;
          transition: all 0.2s; white-space: nowrap;
        }
        .ad-filter-btn:hover { border-color: var(--amber); color: var(--amber); }
        .ad-filter-btn.active {
          background: var(--indigo); border-color: var(--indigo);
          color: var(--cream);
        }

        /* Products asymmetric grid */
        .ad-products-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
          align-items: start;
        }
        .ad-products-empty {
          grid-column: 1/-1; padding: 80px 0; text-align: center;
          font-family: var(--disp);
          font-size: 28px; font-style: italic; color: var(--muted);
        }

        /* Product card */
        .ad-product-card {
          display: block; text-decoration: none; color: inherit;
          position: relative;
        }
        .ad-product-img-wrap {
          position: relative; aspect-ratio: 3/4;
          overflow: hidden; background: var(--amber-p);
        }
        .ad-product-img { transition: transform 0.8s var(--ease); }
        .ad-product-card:hover .ad-product-img { transform: scale(1.07); }
        .ad-product-placeholder {
          width: 100%; height: 100%;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center; gap: 16px;
          background: var(--amber-p);
        }
        .ad-placeholder-text {
          font-family: var(--disp);
          font-size: 13px; font-style: italic;
          color: var(--amber); letter-spacing: 0.05em;
        }
        .ad-product-hover {
          position: absolute; inset: 0;
          background: rgba(27,42,74,0);
          display: flex; align-items: flex-end;
          padding: 24px;
          transition: background 0.35s;
        }
        .ad-product-card:hover .ad-product-hover { background: rgba(27,42,74,0.5); }
        .ad-product-hover span {
          font-size: 11px; font-weight: 700;
          letter-spacing: 0.2em; text-transform: uppercase;
          color: var(--cream);
          opacity: 0; transform: translateY(12px);
          transition: opacity 0.3s, transform 0.3s;
        }
        .ad-product-card:hover .ad-product-hover span {
          opacity: 1; transform: translateY(0);
        }
        .ad-product-badge {
          position: absolute; top: 16px; right: 16px;
          background: var(--terra); color: #fff;
          font-size: 9px; font-weight: 700;
          letter-spacing: 0.22em; text-transform: uppercase;
          padding: 5px 12px;
          font-family: var(--body);
        }
        .ad-badge-new { background: var(--forest); }
        .ad-product-info {
          padding: 16px 0 0;
        }
        .ad-product-cat {
          font-size: 9px; font-weight: 700;
          letter-spacing: 0.3em; text-transform: uppercase;
          color: var(--amber); display: block; margin-bottom: 6px;
        }
        .ad-product-name {
          font-family: var(--disp);
          font-size: 20px; font-weight: 700;
          color: var(--indigo); line-height: 1.15; margin-bottom: 10px;
        }
        .ad-product-row {
          display: flex; align-items: center; justify-content: space-between;
        }
        .ad-product-price {
          font-size: 13px; font-weight: 600; color: var(--muted);
        }
        .ad-product-arrow {
          font-size: 18px; color: var(--amber);
          transition: transform 0.2s;
        }
        .ad-product-card:hover .ad-product-arrow { transform: translateX(4px); }

        /* ── OCCASIONS ───────────────────────────────────────────────── */
        .ad-occasions-section {
          background: var(--indigo);
          padding: 100px 6vw;
          position: relative; overflow: hidden;
        }
        .ad-occasions-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2px; margin-top: 56px;
        }
        .ad-occasion-tile {
          display: block; text-decoration: none;
          padding: 36px 28px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(193,123,58,0.12);
          position: relative; overflow: hidden;
          transition: background 0.25s, border-color 0.25s;
          group: true;
        }
        .ad-occasion-tile::before {
          content: '';
          position: absolute; bottom: 0; left: 0;
          width: 100%; height: 2px;
          background: var(--amber);
          transform: scaleX(0); transform-origin: left;
          transition: transform 0.3s var(--ease);
        }
        .ad-occasion-tile:hover { background: rgba(193,123,58,0.06); border-color: rgba(193,123,58,0.3); }
        .ad-occasion-tile:hover::before { transform: scaleX(1); }
        .ad-occasion-num {
          font-family: var(--disp);
          font-size: 56px; font-weight: 900; font-style: italic;
          color: rgba(193,123,58,0.1); line-height: 1;
          margin-bottom: 12px; display: block;
        }
        .ad-occasion-name {
          font-family: var(--disp);
          font-size: 26px; font-weight: 700;
          color: var(--cream); display: block; margin-bottom: 8px;
        }
        .ad-occasion-sub {
          font-size: 11px; font-weight: 600;
          letter-spacing: 0.18em; text-transform: uppercase;
          color: var(--amber); display: block;
        }

        /* ── PROCESS ─────────────────────────────────────────────────── */
        .ad-process-section {
          background: var(--cream-l);
          padding: 100px 6vw;
          border-top: 1px solid var(--rule);
        }
        .ad-process-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 2px; margin-top: 60px;
          position: relative;
        }
        /* connecting line */
        .ad-process-grid::before {
          content: '';
          position: absolute;
          top: 44px; left: 8%;  right: 8%;
          height: 1px;
          background: repeating-linear-gradient(
            90deg, var(--amber) 0, var(--amber) 8px, transparent 8px, transparent 16px
          );
          z-index: 0;
        }
        .ad-process-step {
          background: #fff;
          padding: 36px 24px;
          position: relative; z-index: 1;
        }
        .ad-process-step:nth-child(even) {
          margin-top: 32px;
        }
        .ad-process-circle {
          width: 48px; height: 48px; border-radius: 50%;
          background: var(--amber);
          display: flex; align-items: center; justify-content: center;
          font-family: var(--disp);
          font-size: 18px; font-weight: 900;
          color: #fff; margin-bottom: 20px;
        }
        .ad-process-step h4 {
          font-family: var(--disp);
          font-size: 20px; font-weight: 700;
          color: var(--indigo); margin-bottom: 10px;
        }
        .ad-process-step p {
          font-size: 13px; font-weight: 400;
          color: var(--muted); line-height: 1.8;
        }

        /* ── WHY ─────────────────────────────────────────────────────── */
        .ad-why-section {
          background: var(--indigo-d);
          padding: 100px 6vw;
          position: relative; overflow: hidden;
        }
        /* Asymmetric layout: large left block + 2-col right */
        .ad-why-layout {
          display: grid;
          grid-template-columns: 1.1fr 1fr;
          gap: 3px; margin-top: 60px;
          align-items: start;
        }
        .ad-why-hero-card {
          background: var(--terra);
          padding: 56px 44px;
          position: relative; overflow: hidden;
          grid-row: span 2;
          display: flex; flex-direction: column; justify-content: flex-end;
          min-height: 440px;
        }
        .ad-why-hero-num {
          font-family: var(--disp);
          font-size: 160px; font-weight: 900; font-style: italic;
          color: rgba(0,0,0,0.15);
          position: absolute; top: -20px; right: -10px;
          line-height: 1; user-select: none;
        }
        .ad-why-hero-title {
          font-family: var(--disp);
          font-size: 38px; font-weight: 900;
          color: var(--cream); margin-bottom: 14px; line-height: 1.05;
          position: relative; z-index: 1;
        }
        .ad-why-hero-body {
          font-size: 15px; font-weight: 400;
          color: rgba(245,240,232,0.6); line-height: 1.8;
          position: relative; z-index: 1;
        }
        .ad-why-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(193,123,58,0.1);
          padding: 32px 28px;
          transition: background 0.25s;
        }
        .ad-why-card:hover { background: rgba(193,123,58,0.06); }
        .ad-why-card-icon {
          font-size: 28px; margin-bottom: 16px; display: block;
        }
        .ad-why-card-title {
          font-family: var(--disp);
          font-size: 22px; font-weight: 700;
          color: var(--cream); margin-bottom: 10px;
        }
        .ad-why-card-body {
          font-size: 13px; font-weight: 400;
          color: rgba(193,123,58,0.4); line-height: 1.8;
        }

        /* ── CTA ─────────────────────────────────────────────────────── */
        .ad-cta-section {
          background: var(--amber);
          padding: 100px 6vw;
          display: flex; align-items: center;
          justify-content: space-between;
          gap: 48px; flex-wrap: wrap;
          position: relative; overflow: hidden;
        }
        .ad-cta-section::before {
          content: 'ADIRE';
          position: absolute; right: -2%;
          top: 50%; transform: translateY(-50%);
          font-family: var(--disp);
          font-size: clamp(100px, 15vw, 200px);
          font-weight: 900; font-style: italic;
          color: rgba(0,0,0,0.07);
          pointer-events: none; user-select: none;
          line-height: 1; letter-spacing: -0.04em;
        }
        .ad-cta-left { max-width: 580px; position: relative; z-index: 1; }
        .ad-cta-h2 {
          font-family: var(--disp);
          font-size: clamp(36px, 5vw, 72px);
          font-weight: 900; line-height: 0.9;
          letter-spacing: -0.03em; color: #fff;
          margin-bottom: 16px;
        }
        .ad-cta-h2 em { font-style: italic; font-weight: 400; }
        .ad-cta-p {
          font-size: 16px; font-weight: 400;
          color: rgba(255,255,255,0.65); line-height: 1.8;
        }
        .ad-cta-actions {
          display: flex; flex-direction: column;
          gap: 12px; min-width: 220px;
          position: relative; z-index: 1;
        }
        .ad-btn-white {
          display: block; text-align: center;
          background: #fff; color: var(--amber);
          padding: 18px 36px;
          font-family: var(--body);
          font-size: 11px; font-weight: 700;
          letter-spacing: 0.24em; text-transform: uppercase;
          text-decoration: none;
          transition: background 0.2s, color 0.2s;
        }
        .ad-btn-white:hover { background: var(--indigo); color: #fff; }
        .ad-btn-outline-white {
          display: block; text-align: center;
          border: 1.5px solid rgba(255,255,255,0.3);
          color: rgba(255,255,255,0.7);
          padding: 18px 36px;
          font-family: var(--body);
          font-size: 11px; font-weight: 600;
          letter-spacing: 0.24em; text-transform: uppercase;
          text-decoration: none;
          transition: border-color 0.2s, color 0.2s;
        }
        .ad-btn-outline-white:hover { border-color: #fff; color: #fff; }

        /* ── RESPONSIVE ──────────────────────────────────────────────── */
        @media (max-width: 1100px) {
          .ad-process-grid { grid-template-columns: 1fr 1fr; }
          .ad-process-grid::before { display: none; }
          .ad-process-step:nth-child(even) { margin-top: 0; }
          .ad-why-layout { grid-template-columns: 1fr; }
          .ad-why-hero-card { grid-row: auto; min-height: 320px; }
        }
        @media (max-width: 860px) {
          .ad-hero-slash { display: none; }
          .ad-hero-h1 { font-size: clamp(52px, 12vw, 88px); }
          .ad-hero-h1 .line-2 { margin-left: 0; }
          .ad-hero-content { max-width: 100%; }
          .ad-products-grid { grid-template-columns: 1fr 1fr; }
          .ad-occasions-grid { grid-template-columns: 1fr 1fr; }
          .ad-section-header { grid-template-columns: 1fr; }
          .ad-filters { flex-direction: row; align-items: flex-start; }
          .ad-cta-section { flex-direction: column; }
          .ad-cta-actions { width: 100%; }
        }
        @media (max-width: 520px) {
          .ad-products-grid { grid-template-columns: 1fr; }
          .ad-occasions-grid { grid-template-columns: 1fr; }
          .ad-process-grid { grid-template-columns: 1fr; }
          .ad-hero-stats { flex-wrap: wrap; }
          .ad-hero-stat { flex: 0 0 50%; }
        }
      `}</style>

      <Grain />

      {/* ═══════════════════════ HERO ═══════════════════════ */}
      <section className="ad-hero" ref={heroRef}>
        <motion.div className="ad-hero-bg" style={{ y: heroY }}>
          <AnkaraPattern color="#C17B3A" opacity={0.055} />
        </motion.div>

        <div className="ad-hero-watermark">ADIRE</div>

        {/* Terracotta slash — right side */}
        <div className="ad-hero-slash">
          <AnkaraPattern color="#F5F0E8" opacity={0.06} />
          <div className="ad-hero-slash-inner">
            <motion.div className="ad-slash-pill"
              animate={{ y: [0, -14, 0] }}
              transition={{ duration: 6, ease: "easeInOut", repeat: Infinity }}
            >
              <span className="ad-slash-pill-icon">👜</span>
              <div>
                <div className="ad-slash-pill-label">Product 01</div>
                <div className="ad-slash-pill-name">Ankara Tote</div>
                <div className="ad-slash-pill-sub">Embroidered · Made to order</div>
              </div>
            </motion.div>
            <motion.div className="ad-slash-pill"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 7.5, ease: "easeInOut", repeat: Infinity, delay: 1 }}
            >
              <span className="ad-slash-pill-icon">👝</span>
              <div>
                <div className="ad-slash-pill-label">Product 02</div>
                <div className="ad-slash-pill-name">Ankara Pouch</div>
                <div className="ad-slash-pill-sub">Personalised · Gift-ready</div>
              </div>
            </motion.div>
          </div>
        </div>

        <div className="ad-hero-bar" />

        {/* Main copy */}
        <div className="ad-hero-content">
          <motion.div className="ad-hero-overline"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.1 }}
          >
            Benin City, Nigeria · Est. 2025
          </motion.div>

          <motion.h1 className="ad-hero-h1"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.22 }}
          >
            Made
            <em className="line-2">Personal.</em>
            <span className="line-3">Nigerian.</span>
            <div className="ad-hero-tag">Ankara Gifts</div>
          </motion.h1>

          <motion.p className="ad-hero-body"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.4 }}
          >
            Personalised Ankara tote bags and pouches — embroidered with your
            name, made by hand in Benin City, and delivered anywhere in Nigeria.
          </motion.p>

          <motion.div className="ad-hero-actions"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.55 }}
          >
            <Link href="/shop?category=tote" className="ad-btn-primary">
              Shop Tote Bags
            </Link>
            <Link href="/shop?category=pouch" className="ad-btn-secondary">
              Explore Pouches
            </Link>
          </motion.div>
        </div>

        {/* Stats strip */}
        <motion.div className="ad-hero-stats"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.7 }}
        >
          {[
            { num: "100%", label: "Handmade" },
            { num: "3–5d", label: "Nationwide delivery" },
            { num: "₦0",   label: "Hidden fees" },
            { num: "500+", label: "Happy customers" },
          ].map(s => (
            <div key={s.label} className="ad-hero-stat">
              <div className="ad-hero-stat-num">{s.num}</div>
              <div className="ad-hero-stat-label">{s.label}</div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* ═══════════════════════ MARQUEE ═══════════════════════ */}
      <Marquee />

      {/* ═══════════════════════ PRODUCTS ═══════════════════════ */}
      <section className="ad-products-section">
        <div className="ad-section-header">
          <div>
            <div className="ad-section-overline">Our Products</div>
            <h2 className="ad-section-h2">
              Two products.<br /><em>Infinite occasions.</em>
            </h2>
          </div>
          <div className="ad-filters">
            {([
              { key: "all",   label: `All (${allProducts.length})` },
              { key: "tote",  label: `Totes (${toteCount})` },
              { key: "pouch", label: `Pouches (${pouchCount})` },
            ] as const).map(({ key, label }) => (
              <button key={key}
                className={`ad-filter-btn ${activeFilter === key ? "active" : ""}`}
                onClick={() => setActiveFilter(key)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <motion.div ref={productsRef}
          className="ad-products-grid"
          variants={stagger}
          initial="hidden"
          animate={productsInView ? "show" : "hidden"}
        >
          {displayProducts.length > 0 ? (
            displayProducts.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))
          ) : (
            <div className="ad-products-empty">New patterns arriving soon.</div>
          )}
        </motion.div>
      </section>

      {/* ═══════════════════════ OCCASIONS ═══════════════════════ */}
      <section className="ad-occasions-section">
        <AnkaraPattern color="#C17B3A" opacity={0.05} />
        <div className="ad-section-overline" style={{ color: "var(--amber)", marginBottom: "12px" }}>
          Shop by Occasion
        </div>
        <h2 className="ad-section-h2 ad-section-h2-light">
          Every celebration<br /><em>deserves Ankara.</em>
        </h2>
        <motion.div className="ad-occasions-grid"
          variants={stagger} initial="hidden"
          animate="show"
        >
          {[
            { icon: "🎂", name: "Birthday",     slug: "birthday",     sub: "Most gifted" },
            { icon: "🎓", name: "Graduation",   slug: "graduation",   sub: "Big moment" },
            { icon: "💍", name: "Anniversary",  slug: "anniversary",  sub: "Celebrate love" },
            { icon: "🤍", name: "Wedding",      slug: "wedding",      sub: "Forever gift" },
            { icon: "🏢", name: "Corporate",    slug: "corporate",    sub: "Bulk orders" },
            { icon: "🎁", name: "Just Because", slug: "just-because", sub: "No reason needed" },
          ].map((o, i) => (
            <motion.div key={o.slug} variants={fadeUp}>
              <Link href={`/shop?tag=${o.slug}`} className="ad-occasion-tile">
                <span className="ad-occasion-num">0{i + 1}</span>
                <span className="ad-occasion-name">{o.name}</span>
                <span className="ad-occasion-sub">{o.sub} →</span>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ═══════════════════════ PROCESS ═══════════════════════ */}
      <section className="ad-process-section">
        <div className="ad-section-overline">How It Works</div>
        <h2 className="ad-section-h2">
          From your name<br /><em>to their hands.</em>
        </h2>
        <motion.div ref={processRef}
          className="ad-process-grid"
          variants={stagger} initial="hidden"
          animate={processInView ? "show" : "hidden"}
        >
          {[
            { n: "1", title: "Choose your bag",
              body: "Pick a tote or pouch. Browse 3–4 Ankara patterns, each bold and curated." },
            { n: "2", title: "Personalise it",
              body: "Tell us the name to embroider and the occasion. That's all we need." },
            { n: "3", title: "We craft it",
              body: "Cut, sewn, and embroidered by hand in Benin City. Packaged like a proper gift." },
            { n: "4", title: "Delivered",
              body: "GIG Logistics. Trackable. Nationwide. Arrives in 3–5 days, beautifully wrapped." },
          ].map((step) => (
            <motion.div key={step.n} className="ad-process-step" variants={fadeUp}>
              <div className="ad-process-circle">{step.n}</div>
              <h4>{step.title}</h4>
              <p>{step.body}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ═══════════════════════ WHY ADIRE ═══════════════════════ */}
      <section className="ad-why-section">
        <AnkaraPattern color="#C17B3A" opacity={0.04} />
        <div className="ad-section-overline" style={{ color: "var(--amber)", marginBottom: "12px" }}>
          Why Adire
        </div>
        <h2 className="ad-section-h2 ad-section-h2-light">
          A gift they keep.<br /><em>Not just receive.</em>
        </h2>
        <motion.div ref={whyRef}
          className="ad-why-layout"
          variants={stagger} initial="hidden"
          animate={whyInView ? "show" : "hidden"}
        >
          {/* Hero card — left, spans 2 rows */}
          <motion.div className="ad-why-hero-card" variants={fadeUp}>
            <AnkaraPattern color="#F5F0E8" opacity={0.06} />
            <div className="ad-why-hero-num">01</div>
            <h3 className="ad-why-hero-title">
              Proudly<br />Nigerian.
            </h3>
            <p className="ad-why-hero-body">
              Every pattern is authentic Ankara fabric sourced locally.
              Every stitch is Nigerian craftsmanship. Not imported.
              Not mass-produced. Made here, with pride.
            </p>
          </motion.div>

          {/* Right cards */}
          {[
            { icon: "✏️", title: "Truly personalised",
              body: "Your person's name embroidered directly onto the fabric. Not a sticker. Not a print. Permanent." },
            { icon: "📦", title: "Packaged like a gift",
              body: "Kraft box, tissue paper, handwritten card. The unboxing is part of the experience." },
            { icon: "🏢", title: "Adire for Business",
              body: "Staff packs. Client gifts. Corporate events. Ankara sets that actually impress. Bulk pricing available." },
          ].map((item) => (
            <motion.div key={item.title} className="ad-why-card" variants={fadeUp}>
              <span className="ad-why-card-icon">{item.icon}</span>
              <h3 className="ad-why-card-title">{item.title}</h3>
              <p className="ad-why-card-body">{item.body}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ═══════════════════════ CTA ═══════════════════════ */}
      <section className="ad-cta-section">
        <div className="ad-cta-left">
          <h2 className="ad-cta-h2">
            Give something<br /><em>they'll never forget.</em>
          </h2>
          <p className="ad-cta-p">
            Order in minutes. Made by hand in Benin City.
            Delivered across Nigeria in 3–5 days.
          </p>
        </div>
        <div className="ad-cta-actions">
          <Link href="/shop" className="ad-btn-white">Browse All Gifts</Link>
          <Link href="/business" className="ad-btn-outline-white">Corporate Orders →</Link>
        </div>
      </section>
    </>
  );
}