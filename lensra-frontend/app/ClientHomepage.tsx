"use client";

// app/ClientHomepage.tsx
// Lensra — rebranded homepage client component
// Brand: Premium & minimal — ink black, warm cream, brushed gold
// Products: Custom Mugs + Canvas Prints only
// Tagline: "Gifts That Remember."
// Fonts: Cormorant Garamond (display) · DM Sans (body)

import { useState, useEffect, useRef } from "react";
import { motion, useInView, type Variants } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import LensraSubscribe from "@/components/LensraSubscribe";

// ── Constants ─────────────────────────────────────────────────────────────────

const BaseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.lensra.com/";

// ── Helpers ───────────────────────────────────────────────────────────────────

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

// ── Motion variants ───────────────────────────────────────────────────────────

// framer-motion requires ease bezier as a const tuple, not a plain number[]
const EASE = [0.16, 1, 0.3, 1] as const;

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  // custom prop (index) controls per-child delay via variants + staggerChildren
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
};

// ── Sub-components ────────────────────────────────────────────────────────────

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
        opacity: 0.028,
        mixBlendMode: "multiply",
      }}
    >
      <filter id="ln-grain">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.65"
          numOctaves="3"
          stitchTiles="stitch"
        />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#ln-grain)" />
    </svg>
  );
}

function ProductCard({ product }: { product: any }) {
  const imageUrl = getImageUrl(product.image_url);
  const isMug = product.category === "mug";

  return (
    <motion.div variants={fadeUp}>
      <Link href={`/shop/${product.slug}`} className="ln-product-card">
        <div className="ln-product-img-wrap">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 50vw, 33vw"
              style={{ objectFit: "cover" }}
              className="ln-product-img"
            />
          ) : (
            <div className="ln-product-placeholder">
              {isMug ? "☕" : "🖼"}
            </div>
          )}
          <div className="ln-product-hover-overlay">
            <span className="ln-product-hover-cta">Customise →</span>
          </div>
          {product.is_trending && (
            <div className="ln-product-badge">Trending</div>
          )}
        </div>
        <div className="ln-product-meta">
          <div className="ln-product-category">
            {isMug ? "Custom Mug" : "Canvas Print"}
          </div>
          <h3 className="ln-product-name">{product.name}</h3>
          <div className="ln-product-price">
            From {formatPrice(product.base_price || 0)}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <div className="ln-section-label">{children}</div>;
}

// ── Main component ────────────────────────────────────────────────────────────

export default function ClientHomepage({
  initialProducts,
}: {
  initialProducts: any[];
}) {
  const [products] = useState(initialProducts);
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [activeFilter, setActiveFilter] = useState<"all" | "mug" | "canvas">("all");
  const [showModal, setShowModal] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // In-view refs for scroll-triggered animation
  const productsRef = useRef(null);
  const howRef = useRef(null);
  const whyRef = useRef(null);
  const productsInView = useInView(productsRef, { once: true, margin: "-80px" });
  const howInView = useInView(howRef, { once: true, margin: "-80px" });
  const whyInView = useInView(whyRef, { once: true, margin: "-80px" });

  // Scroll-aware nav
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 56);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Fetch featured products (mug + canvas only)
  useEffect(() => {
    fetch(`${BaseUrl}api/products/featured/`)
      .then((r) => r.json())
      .then((d) => {
        const results = d.results || d || [];
        setFeaturedProducts(
          results.filter((p: any) => ["mug", "canvas"].includes(p.category))
        );
      })
      .catch(console.error);
  }, []);

  // Subscribe modal — once after 20s
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (localStorage.getItem("lensra_subscribe_seen")) return;
    const t = setTimeout(() => {
      setShowModal(true);
      localStorage.setItem("lensra_subscribe_seen", "true");
    }, 20000);
    return () => clearTimeout(t);
  }, []);

  // Derived state
  const allProducts = products.filter((p) =>
    ["mug", "canvas"].includes(p.category)
  );
  const filtered =
    activeFilter === "all"
      ? allProducts
      : allProducts.filter((p) => p.category === activeFilter);
  const displayProducts = filtered.length > 0 ? filtered : featuredProducts;
  const mugCount = allProducts.filter((p) => p.category === "mug").length;
  const canvasCount = allProducts.filter((p) => p.category === "canvas").length;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap');

        :root {
          --ln-ink:       #0e0e0d;
          --ln-warm:      #f7f2ea;
          --ln-white:     #ffffff;
          --ln-gold:      #b8965a;
          --ln-gold-lt:   #d4b07a;
          --ln-gold-pale: #f0e6d0;
          --ln-muted:     #7a7168;
          --ln-rule:      #e2d9cc;
          --ln-display:   'Cormorant Garamond', Georgia, serif;
          --ln-body:      'DM Sans', system-ui, sans-serif;
          --ln-ease:      cubic-bezier(0.16, 1, 0.3, 1);
        }

        html { scroll-behavior: smooth; }
        *, *::before, *::after { box-sizing: border-box; }
        body {
          background: var(--ln-warm);
          color: var(--ln-ink);
          font-family: var(--ln-body);
          font-weight: 300;
          -webkit-font-smoothing: antialiased;
        }

        /* NAV */
        .ln-nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 200;
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 5vw; height: 64px;
          transition: background 0.4s var(--ln-ease), border-color 0.4s;
          border-bottom: 1px solid transparent;
        }
        .ln-nav.scrolled {
          background: rgba(247,242,234,0.94);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          border-color: var(--ln-rule);
        }
        .ln-nav-logo {
          font-family: var(--ln-display);
          font-size: 26px; font-weight: 400; letter-spacing: -0.02em;
          color: #f5f0e8; text-decoration: none; line-height: 1;
          transition: color 0.3s;
        }
        .ln-nav-logo.dark { color: var(--ln-ink); }
        .ln-nav-logo em { font-style: italic; color: var(--ln-gold); }
        .ln-nav-links {
          display: flex; align-items: center; gap: 36px; list-style: none;
        }
        .ln-nav-links a {
          font-size: 11px; letter-spacing: 0.22em; text-transform: uppercase;
          color: rgba(245,240,232,0.5); text-decoration: none; transition: color 0.2s;
        }
        .ln-nav-links.dark a { color: var(--ln-muted); }
        .ln-nav-links a:hover { color: #f5f0e8; }
        .ln-nav-links.dark a:hover { color: var(--ln-ink); }
        .ln-nav-cta {
          background: rgba(184,150,90,0.85) !important;
          color: var(--ln-white) !important;
          padding: 10px 22px !important;
        }
        .ln-nav-links.dark .ln-nav-cta {
          background: var(--ln-ink) !important;
          color: var(--ln-warm) !important;
        }
        .ln-nav-cta:hover { background: var(--ln-gold) !important; }

        /* HERO */
        .ln-hero {
          min-height: 100svh;
          display: grid; grid-template-columns: 55% 45%;
          background: var(--ln-ink);
          position: relative; overflow: hidden;
        }
        .ln-hero-left {
          display: flex; flex-direction: column; justify-content: flex-end;
          padding: 128px 5vw 88px; position: relative; z-index: 2;
        }
        .ln-hero-left::before {
          content: ''; position: absolute; inset: 0; pointer-events: none;
          background: radial-gradient(ellipse 80% 70% at 0% 100%, #141007, transparent 65%);
        }
        .ln-hero-eyebrow {
          font-size: 10px; letter-spacing: 0.45em; text-transform: uppercase;
          color: var(--ln-gold); margin-bottom: 30px;
          display: flex; align-items: center; gap: 14px; position: relative;
        }
        .ln-hero-eyebrow::before {
          content: ''; width: 32px; height: 1px;
          background: var(--ln-gold); display: block; flex-shrink: 0;
        }
        .ln-hero-h1 {
          font-family: var(--ln-display);
          font-size: clamp(56px, 6.5vw, 100px);
          font-weight: 300; line-height: 0.9;
          letter-spacing: -0.025em; color: #f5f0e8; position: relative;
        }
        .ln-hero-h1 em {
          font-style: italic; color: var(--ln-gold-lt); display: block; margin-top: 4px;
        }
        .ln-hero-body {
          margin-top: 32px; font-size: 15px;
          color: #5a5248; max-width: 400px; line-height: 1.85; position: relative;
        }
        .ln-hero-actions {
          margin-top: 48px; display: flex; gap: 14px; flex-wrap: wrap; position: relative;
        }
        .ln-btn-gold {
          display: inline-flex; align-items: center; gap: 10px;
          background: var(--ln-gold); color: var(--ln-white);
          padding: 16px 34px; font-size: 11px; letter-spacing: 0.25em;
          text-transform: uppercase; text-decoration: none; font-weight: 400;
          transition: background 0.25s var(--ln-ease), transform 0.25s; white-space: nowrap;
        }
        .ln-btn-gold:hover { background: var(--ln-gold-lt); transform: translateY(-2px); }
        .ln-btn-ghost-light {
          display: inline-flex; align-items: center; gap: 10px;
          border: 1px solid #2e2820; color: #4a4438;
          padding: 16px 34px; font-size: 11px; letter-spacing: 0.25em;
          text-transform: uppercase; text-decoration: none; font-weight: 400;
          transition: border-color 0.25s, color 0.25s; white-space: nowrap;
        }
        .ln-btn-ghost-light:hover { border-color: var(--ln-gold); color: var(--ln-gold-lt); }

        /* Hero right */
        .ln-hero-right {
          position: relative; overflow: hidden; background: #100e08;
        }
        .ln-hero-right::before {
          content: ''; position: absolute; inset: 0;
          background: radial-gradient(ellipse 60% 80% at 80% 30%, #1e1a0f, transparent);
        }
        .ln-hero-ghost {
          position: absolute; bottom: 60px; right: -12px;
          font-family: var(--ln-display);
          font-size: clamp(80px, 12vw, 160px);
          font-weight: 300; font-style: italic;
          color: rgba(184,150,90,0.06); white-space: nowrap;
          line-height: 1; pointer-events: none; user-select: none;
          letter-spacing: -0.04em;
        }
        .ln-float-wrap {
          position: absolute; inset: 0;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          gap: 20px; padding: 100px 32px 80px;
        }
        .ln-float-card {
          background: rgba(255,255,255,0.035);
          border: 1px solid rgba(184,150,90,0.15);
          padding: 28px 32px;
          display: flex; align-items: center; gap: 20px;
          width: 100%; max-width: 320px;
          position: relative; overflow: hidden; backdrop-filter: blur(4px);
        }
        .ln-float-card::before {
          content: ''; position: absolute;
          left: 0; top: 0; bottom: 0; width: 2px; background: var(--ln-gold);
        }
        .ln-float-icon { font-size: 40px; line-height: 1; flex-shrink: 0; }
        .ln-float-label {
          font-size: 9px; letter-spacing: 0.35em; text-transform: uppercase;
          color: var(--ln-gold); margin-bottom: 5px;
        }
        .ln-float-name {
          font-family: var(--ln-display); font-size: 20px;
          font-weight: 300; color: #e8e0d0; line-height: 1.1;
        }
        .ln-float-sub { font-size: 12px; color: #3a3428; margin-top: 4px; }
        .ln-hero-stats {
          display: flex; gap: 2px;
          position: absolute; bottom: 0; left: 0; right: 0;
        }
        .ln-hero-stat {
          flex: 1; background: rgba(255,255,255,0.02);
          border-top: 1px solid #1a1812;
          padding: 16px 18px; text-align: center;
        }
        .ln-hero-stat-num {
          font-family: var(--ln-display); font-size: 26px;
          font-weight: 300; color: var(--ln-gold-lt); line-height: 1;
        }
        .ln-hero-stat-label {
          font-size: 9px; letter-spacing: 0.25em; text-transform: uppercase;
          color: #2e2a22; margin-top: 4px;
        }

        /* SECTION COMMONS */
        .ln-section { padding: 100px 5vw; }
        .ln-section-inner { max-width: 1360px; margin: 0 auto; }
        .ln-section-label {
          font-size: 10px; letter-spacing: 0.4em; text-transform: uppercase;
          color: var(--ln-gold); margin-bottom: 18px;
          display: flex; align-items: center; gap: 10px;
        }
        .ln-section-label::after {
          content: ''; width: 40px; height: 1px; background: var(--ln-rule); display: block;
        }
        .ln-section-h2 {
          font-family: var(--ln-display);
          font-size: clamp(32px, 3.5vw, 52px);
          font-weight: 300; line-height: 1.05; letter-spacing: -0.01em;
        }
        .ln-section-header {
          display: flex; align-items: flex-end; justify-content: space-between;
          margin-bottom: 52px; flex-wrap: wrap; gap: 24px;
        }

        /* PRODUCTS */
        .ln-products-section { background: var(--ln-warm); padding: 100px 5vw; }
        .ln-filter-tabs { display: flex; gap: 2px; }
        .ln-filter-tab {
          padding: 11px 24px; font-size: 11px; letter-spacing: 0.2em;
          text-transform: uppercase; background: var(--ln-white);
          border: none; cursor: pointer; color: var(--ln-muted);
          transition: background 0.2s, color 0.2s;
          font-family: var(--ln-body); font-weight: 300;
        }
        .ln-filter-tab:hover:not(.active) { background: var(--ln-gold-pale); color: var(--ln-ink); }
        .ln-filter-tab.active { background: var(--ln-ink); color: var(--ln-warm); }
        .ln-products-grid {
          display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 2px;
        }
        .ln-products-empty {
          grid-column: 1/-1; padding: 80px 0; text-align: center;
          font-family: var(--ln-display); font-size: 28px;
          font-style: italic; color: var(--ln-muted);
        }
        .ln-product-card {
          display: block; text-decoration: none; color: inherit; background: var(--ln-white);
        }
        .ln-product-img-wrap {
          position: relative; aspect-ratio: 4/3; overflow: hidden; background: var(--ln-gold-pale);
        }
        .ln-product-img { transition: transform 0.65s var(--ln-ease); }
        .ln-product-card:hover .ln-product-img { transform: scale(1.05); }
        .ln-product-placeholder {
          width: 100%; height: 100%;
          display: flex; align-items: center; justify-content: center; font-size: 72px;
        }
        .ln-product-hover-overlay {
          position: absolute; inset: 0; background: rgba(14,14,13,0);
          display: flex; align-items: flex-end; padding: 20px; transition: background 0.35s;
        }
        .ln-product-card:hover .ln-product-hover-overlay { background: rgba(14,14,13,0.38); }
        .ln-product-hover-cta {
          font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase;
          color: var(--ln-warm); opacity: 0; transform: translateY(10px);
          transition: opacity 0.3s, transform 0.3s;
        }
        .ln-product-card:hover .ln-product-hover-cta { opacity: 1; transform: translateY(0); }
        .ln-product-badge {
          position: absolute; top: 16px; left: 16px;
          background: var(--ln-gold); color: var(--ln-white);
          font-size: 9px; letter-spacing: 0.25em; text-transform: uppercase;
          padding: 5px 12px; font-family: var(--ln-body);
        }
        .ln-product-meta { padding: 20px 22px 26px; }
        .ln-product-category {
          font-size: 10px; letter-spacing: 0.3em; text-transform: uppercase;
          color: var(--ln-gold); margin-bottom: 6px;
        }
        .ln-product-name {
          font-family: var(--ln-display); font-size: 22px;
          font-weight: 400; line-height: 1.15; margin-bottom: 8px;
        }
        .ln-product-price { font-size: 13px; color: var(--ln-muted); letter-spacing: 0.05em; }

        /* OCCASIONS */
        .ln-occasions-section {
          background: var(--ln-white); padding: 80px 5vw;
          border-top: 1px solid var(--ln-rule);
        }
        .ln-occasions-grid {
          display: grid; grid-template-columns: repeat(6, 1fr);
          gap: 2px; margin-top: 40px;
        }
        .ln-occasion-card {
          display: block; text-decoration: none;
          background: var(--ln-warm); padding: 28px 16px;
          text-align: center; transition: background 0.25s;
        }
        .ln-occasion-card:hover { background: var(--ln-gold-pale); }
        .ln-occasion-icon { font-size: 28px; margin-bottom: 10px; display: block; }
        .ln-occasion-name {
          font-family: var(--ln-display); font-size: 16px;
          font-weight: 400; color: var(--ln-ink);
        }
        .ln-occasion-arrow {
          font-size: 11px; color: var(--ln-gold); margin-top: 6px;
          opacity: 0; transition: opacity 0.2s;
        }
        .ln-occasion-card:hover .ln-occasion-arrow { opacity: 1; }

        /* HOW IT WORKS */
        .ln-how-section {
          background: var(--ln-ink); padding: 100px 5vw;
          position: relative; overflow: hidden;
        }
        .ln-how-section::before {
          content: ''; position: absolute; inset: 0; pointer-events: none;
          background: radial-gradient(ellipse 70% 60% at 100% 100%, #18130a, transparent 60%);
        }
        .ln-how-section .ln-section-label { color: var(--ln-gold); }
        .ln-how-section .ln-section-label::after { background: #222018; }
        .ln-how-section .ln-section-h2 { color: #f0ebe0; }
        .ln-how-steps {
          display: grid; grid-template-columns: repeat(4, 1fr);
          gap: 2px; margin-top: 60px;
        }
        .ln-how-step {
          background: rgba(255,255,255,0.025); padding: 40px 28px;
          border-top: 1px solid #1a1812;
        }
        .ln-how-step-num {
          font-family: var(--ln-display); font-size: 72px; font-weight: 300;
          color: rgba(184,150,90,0.12); line-height: 1; margin-bottom: 24px;
        }
        .ln-how-step-icon { font-size: 28px; display: block; margin-bottom: 14px; }
        .ln-how-step h4 {
          font-size: 15px; font-weight: 500; color: #d8d0c4;
          margin-bottom: 10px; font-family: var(--ln-body);
        }
        .ln-how-step p { font-size: 13.5px; color: #4a4438; line-height: 1.78; margin: 0; }

        /* WHY LENSRA */
        .ln-why-section { padding: 100px 5vw; background: var(--ln-warm); }
        .ln-why-grid {
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 2px; margin-top: 56px;
        }
        .ln-why-card {
          background: var(--ln-white); padding: 44px 36px;
          border-top: 2px solid transparent; transition: border-color 0.3s;
        }
        .ln-why-card:hover { border-color: var(--ln-gold); }
        .ln-why-icon { font-size: 32px; margin-bottom: 20px; display: block; }
        .ln-why-card h3 {
          font-family: var(--ln-display); font-size: 26px;
          font-weight: 400; margin-bottom: 12px;
        }
        .ln-why-card p { font-size: 14px; color: var(--ln-muted); line-height: 1.82; margin: 0; }

        /* CTA STRIP */
        .ln-cta-strip {
          display: flex; align-items: center; justify-content: space-between;
          gap: 48px; flex-wrap: wrap;
          padding: 100px 5vw; border-top: 1px solid var(--ln-rule);
          background: var(--ln-warm);
        }
        .ln-cta-strip-left { max-width: 580px; }
        .ln-cta-h2 {
          font-family: var(--ln-display);
          font-size: clamp(32px, 4vw, 54px);
          font-weight: 300; line-height: 1.05;
          letter-spacing: -0.01em; margin-bottom: 16px;
        }
        .ln-cta-h2 em { font-style: italic; color: var(--ln-gold); }
        .ln-cta-p { font-size: 15px; color: var(--ln-muted); line-height: 1.82; margin: 0; }
        .ln-cta-actions { display: flex; gap: 12px; flex-direction: column; min-width: 220px; }
        .ln-btn-ink {
          display: block; text-align: center;
          background: var(--ln-ink); color: var(--ln-warm);
          padding: 17px 36px; font-size: 11px; letter-spacing: 0.25em;
          text-transform: uppercase; text-decoration: none; font-weight: 400;
          transition: background 0.25s;
        }
        .ln-btn-ink:hover { background: var(--ln-gold); }
        .ln-btn-outline {
          display: block; text-align: center;
          border: 1px solid var(--ln-rule); color: var(--ln-muted);
          padding: 17px 36px; font-size: 11px; letter-spacing: 0.25em;
          text-transform: uppercase; text-decoration: none; font-weight: 400;
          transition: border-color 0.25s, color 0.25s;
        }
        .ln-btn-outline:hover { border-color: var(--ln-gold); color: var(--ln-gold); }

        /* SUBSCRIBE MODAL */
        .ln-modal-backdrop {
          position: fixed; inset: 0; background: rgba(14,14,13,0.75);
          backdrop-filter: blur(6px); -webkit-backdrop-filter: blur(6px);
          z-index: 500; display: flex; align-items: center; justify-content: center; padding: 24px;
        }
        .ln-modal-inner { position: relative; }
        .ln-modal-close {
          position: absolute; top: -14px; right: -14px;
          width: 36px; height: 36px;
          background: var(--ln-ink); color: var(--ln-warm);
          border: none; cursor: pointer; font-size: 16px;
          display: flex; align-items: center; justify-content: center;
          z-index: 10; transition: background 0.2s;
        }
        .ln-modal-close:hover { background: var(--ln-gold); }

        /* FOOTER */
        .ln-footer { background: var(--ln-ink); padding: 72px 5vw 32px; }
        .ln-footer-top {
          display: grid; grid-template-columns: 2fr 1fr 1fr;
          gap: 56px; padding-bottom: 56px; border-bottom: 1px solid #1a1812;
        }
        .ln-footer-brand {
          font-family: var(--ln-display); font-size: 30px;
          font-weight: 300; color: #f5f0e8;
          margin-bottom: 14px; letter-spacing: -0.02em; line-height: 1;
        }
        .ln-footer-brand em { font-style: italic; color: var(--ln-gold); }
        .ln-footer-desc { font-size: 13.5px; color: #3a3630; line-height: 1.8; max-width: 280px; }
        .ln-footer-col h4 {
          font-size: 10px; letter-spacing: 0.35em; text-transform: uppercase;
          color: var(--ln-gold); margin-bottom: 20px;
        }
        .ln-footer-col ul { list-style: none; padding: 0; margin: 0; }
        .ln-footer-col li { margin-bottom: 10px; }
        .ln-footer-col a { font-size: 13.5px; color: #3a3630; text-decoration: none; transition: color 0.2s; }
        .ln-footer-col a:hover { color: var(--ln-gold-lt); }
        .ln-footer-bottom {
          display: flex; align-items: center; justify-content: space-between;
          padding-top: 28px; flex-wrap: wrap; gap: 16px;
        }
        .ln-footer-copy { font-size: 12px; color: #2a2620; letter-spacing: 0.1em; }
        .ln-footer-copy span { color: var(--ln-gold); }
        .ln-footer-legal { display: flex; gap: 24px; }
        .ln-footer-legal a {
          font-size: 11px; color: #2a2620; text-decoration: none;
          letter-spacing: 0.1em; transition: color 0.2s;
        }
        .ln-footer-legal a:hover { color: #3a3630; }

        /* RESPONSIVE */
        @media (max-width: 1100px) {
          .ln-how-steps { grid-template-columns: 1fr 1fr; }
          .ln-occasions-grid { grid-template-columns: repeat(3, 1fr); }
          .ln-footer-top { grid-template-columns: 1fr 1fr; }
        }
        @media (max-width: 800px) {
          .ln-hero { grid-template-columns: 1fr; min-height: auto; }
          .ln-hero-left { padding: 108px 6vw 64px; }
          .ln-hero-right { display: none; }
          .ln-nav-links { display: none; }
          .ln-why-grid { grid-template-columns: 1fr; }
          .ln-how-steps { grid-template-columns: 1fr; }
          .ln-cta-strip { flex-direction: column; }
          .ln-cta-actions { width: 100%; }
          .ln-products-grid { grid-template-columns: 1fr 1fr; }
          .ln-occasions-grid { grid-template-columns: repeat(3, 1fr); }
          .ln-footer-top { grid-template-columns: 1fr; gap: 36px; }
        }
        @media (max-width: 480px) {
          .ln-products-grid { grid-template-columns: 1fr; }
          .ln-occasions-grid { grid-template-columns: repeat(2, 1fr); }
        }
      `}</style>

      <GrainOverlay />

      {/* SUBSCRIBE MODAL */}
      {showModal && (
        <div className="ln-modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="ln-modal-inner" onClick={(e) => e.stopPropagation()}>
            <button
              className="ln-modal-close"
              onClick={() => setShowModal(false)}
              aria-label="Close"
            >
              ✕
            </button>
            <LensraSubscribe source="first_gift_popup" />
          </div>
        </div>
      )}

      {/* NAV */}
      <nav className={`ln-nav ${scrolled ? "scrolled" : ""}`}>
        <Link href="/" className={`ln-nav-logo ${scrolled ? "dark" : ""}`}>
          Lens<em>ra</em>
        </Link>
        <ul className={`ln-nav-links ${scrolled ? "dark" : ""}`}>
          <li><Link href="/shop">Shop</Link></li>
          <li><Link href="/business">Business</Link></li>
          <li><Link href="/about">Our Story</Link></li>
          <li>
            <Link href="/shop" className="ln-nav-cta">
              Start Customising
            </Link>
          </li>
        </ul>
      </nav>

      {/* HERO */}
      <section className="ln-hero">
        {/* Left — text */}
        <div className="ln-hero-left">
          <motion.div
            className="ln-hero-eyebrow"
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          >
            Benin City, Nigeria · Est. 2024
          </motion.div>

          <motion.h1
            className="ln-hero-h1"
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1], delay: 0.22 }}
          >
            Gifts
            <em>That Remember.</em>
          </motion.h1>

          <motion.p
            className="ln-hero-body"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.38 }}
          >
            Custom mugs and premium canvas prints — personalised with your
            photos, names, and words. Crafted with care. Delivered across
            Nigeria.
          </motion.p>

          <motion.div
            className="ln-hero-actions"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.52 }}
          >
            <Link href="/shop?category=mug" className="ln-btn-gold">
              ☕ Custom Mugs
            </Link>
            <Link href="/shop?category=canvas" className="ln-btn-ghost-light">
              🖼 Canvas Prints
            </Link>
          </motion.div>
        </div>

        {/* Right — decorative */}
        <motion.div
          className="ln-hero-right"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.4 }}
        >
          <div className="ln-hero-ghost">Remember.</div>

          <div className="ln-float-wrap">
            <motion.div
              className="ln-float-card"
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 6, ease: "easeInOut", repeat: Infinity }}
            >
              <div className="ln-float-icon">☕</div>
              <div>
                <div className="ln-float-label">Product 01</div>
                <div className="ln-float-name">Custom Ceramic Mug</div>
                <div className="ln-float-sub">Your photo · Your words</div>
              </div>
            </motion.div>

            <motion.div
              className="ln-float-card"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 7, ease: "easeInOut", repeat: Infinity, delay: 1 }}
            >
              <div className="ln-float-icon">🖼</div>
              <div>
                <div className="ln-float-label">Product 02</div>
                <div className="ln-float-name">Premium Canvas Print</div>
                <div className="ln-float-sub">Archival quality · Any size</div>
              </div>
            </motion.div>
          </div>

          <div className="ln-hero-stats">
            {[
              { num: "500+", label: "Customers" },
              { num: "72h", label: "Delivery" },
              { num: "🇳🇬", label: "Nationwide" },
            ].map((s) => (
              <div className="ln-hero-stat" key={s.label}>
                <div className="ln-hero-stat-num">{s.num}</div>
                <div className="ln-hero-stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* PRODUCTS */}
      <section className="ln-products-section">
        <div className="ln-section-inner">
          <div className="ln-section-header">
            <div>
              <SectionLabel>Our Products</SectionLabel>
              <h2 className="ln-section-h2">
                Two products.<br />Every occasion.
              </h2>
            </div>
            <div className="ln-filter-tabs">
              {(
                [
                  { key: "all", label: `All (${allProducts.length})` },
                  { key: "mug", label: `Mugs (${mugCount})` },
                  { key: "canvas", label: `Canvas (${canvasCount})` },
                ] as const
              ).map(({ key, label }) => (
                <button
                  key={key}
                  className={`ln-filter-tab ${activeFilter === key ? "active" : ""}`}
                  onClick={() => setActiveFilter(key)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <motion.div
            ref={productsRef}
            className="ln-products-grid"
            variants={stagger}
            initial="hidden"
            animate={productsInView ? "show" : "hidden"}
          >
            {displayProducts.length > 0 ? (
              displayProducts.map((product, i) => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : (
              <div className="ln-products-empty">New designs arriving soon.</div>
            )}
          </motion.div>
        </div>
      </section>

      {/* OCCASIONS */}
      <section className="ln-occasions-section">
        <div className="ln-section-inner">
          <SectionLabel>Shop by Occasion</SectionLabel>
          <h2 className="ln-section-h2">
            Every moment deserves<br />to be remembered.
          </h2>
          <div className="ln-occasions-grid">
            {[
              { icon: "🎂", name: "Birthday",    slug: "birthday" },
              { icon: "💍", name: "Anniversary", slug: "anniversary" },
              { icon: "💝", name: "Valentine",   slug: "valentine" },
              { icon: "🎓", name: "Graduation",  slug: "graduation" },
              { icon: "🤍", name: "Wedding",     slug: "wedding" },
              { icon: "🎁", name: "Just Because",slug: "just-because" },
            ].map((o) => (
              <Link
                key={o.slug}
                href={`/shop?tag=${o.slug}`}
                className="ln-occasion-card"
              >
                <span className="ln-occasion-icon">{o.icon}</span>
                <div className="ln-occasion-name">{o.name}</div>
                <div className="ln-occasion-arrow">→</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="ln-how-section">
        <div className="ln-section-inner">
          <SectionLabel>The Process</SectionLabel>
          <h2 className="ln-section-h2">
            From idea to doorstep<br />in four steps.
          </h2>
          <motion.div
            ref={howRef}
            className="ln-how-steps"
            variants={stagger}
            initial="hidden"
            animate={howInView ? "show" : "hidden"}
          >
            {[
              { num: "01", icon: "🎨", title: "Pick your product",
                body: "Choose a custom mug or premium canvas print — two products, each designed to become a lasting gift." },
              { num: "02", icon: "📐", title: "Choose a template",
                body: "Pick from five curated styles: Minimal, Celebration, Romantic, Corporate, or Quote." },
              { num: "03", icon: "✍🏾", title: "Personalise it",
                body: "Upload your photo, type a name, a date, a message. Watch it come to life on screen before you order." },
              { num: "04", icon: "📦", title: "We make & deliver",
                body: "Produced in Benin City with premium materials. Shipped nationwide, packaged beautifully, within 72 hours." },
            ].map((step, i) => (
              <motion.div key={step.num} className="ln-how-step" variants={fadeUp}>
                <div className="ln-how-step-num">{step.num}</div>
                <span className="ln-how-step-icon">{step.icon}</span>
                <h4>{step.title}</h4>
                <p>{step.body}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* WHY LENSRA */}
      <section className="ln-why-section">
        <div className="ln-section-inner">
          <SectionLabel>Why Lensra</SectionLabel>
          <h2 className="ln-section-h2">
            Premium isn't a price.<br />It's a standard.
          </h2>
          <motion.div
            ref={whyRef}
            className="ln-why-grid"
            variants={stagger}
            initial="hidden"
            animate={whyInView ? "show" : "hidden"}
          >
            {[
              { icon: "🎯", title: "Made for the moment",
                body: "Every gift is designed around a specific memory. Not mass-produced. Made for one person, one occasion." },
              { icon: "🏺", title: "Crafted, not printed",
                body: "Premium ceramic mugs and archival-grade canvas at full resolution. Quality that sits on a shelf for years." },
              { icon: "⚡", title: "72-hour delivery",
                body: "Produced in Benin City. Shipped to Lagos, Abuja, Port Harcourt — anywhere in Nigeria — within 72 hours." },
              { icon: "🏢", title: "Lensra Business",
                body: "Corporate gifts that actually impress. Branded mugs, staff packs, client gifts at volume. Dedicated support." },
            ].map((item, i) => (
              <motion.div key={item.title} className="ln-why-card" variants={fadeUp}>
                <span className="ln-why-icon">{item.icon}</span>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA STRIP */}
      <div className="ln-cta-strip">
        <div className="ln-cta-strip-left">
          <h2 className="ln-cta-h2">
            Every gift starts with
            <br />
            <em>a memory worth keeping.</em>
          </h2>
          <p className="ln-cta-p">
            Start customising your mug or canvas print today.
            It takes two minutes — and lasts a lifetime.
          </p>
        </div>
        <div className="ln-cta-actions">
          <Link href="/shop" className="ln-btn-ink">Browse All Gifts</Link>
          <Link href="/business" className="ln-btn-outline">Corporate Gifting →</Link>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="ln-footer">
        <div className="ln-footer-top">
          <div>
            <div className="ln-footer-brand">Lens<em>ra</em></div>
            <p className="ln-footer-desc">
              Custom mugs and premium canvas prints. Personalised with your
              photos and words. Made in Benin City, delivered across Nigeria.
            </p>
          </div>
          <div className="ln-footer-col">
            <h4>Shop</h4>
            <ul>
              <li><Link href="/shop?category=mug">Custom Mugs</Link></li>
              <li><Link href="/shop?category=canvas">Canvas Prints</Link></li>
              <li><Link href="/business">Corporate Gifts</Link></li>
            </ul>
          </div>
          <div className="ln-footer-col">
            <h4>Support</h4>
            <ul>
              <li><Link href="/track">Track Order</Link></li>
              <li><Link href="/delivery">Delivery Info</Link></li>
              <li><Link href="/returns">Returns</Link></li>
              <li><Link href="/contact">Contact Us</Link></li>
            </ul>
          </div>
        </div>
        <div className="ln-footer-bottom">
          <div className="ln-footer-copy">© 2026 <span>Lensra</span>. Proudly Nigerian.</div>
          <div className="ln-footer-legal">
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
          </div>
        </div>
      </footer>
    </>
  );
}