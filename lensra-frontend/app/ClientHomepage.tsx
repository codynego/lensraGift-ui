"use client";

// ClientHomepage.tsx — Lensra Premium Gift Brand
// Flow: Hero → How It Works → Hero Product → Testimonials → Occasions → CTA
// Design: Apple × Luxury — cinematic, emotional, conversion-focused
// Palette: #0F0F0F · #FFFFFF · #DD183B
// Fonts: Montserrat (headings/UI) · Playfair Display (emotional statements)

import { useState, useEffect, useRef } from "react";
import {
  motion,
  useInView,
  useScroll,
  useTransform,
  AnimatePresence,
  type Variants,
} from "framer-motion";
import Link from "next/link";
import Image from "next/image";

// ── Config ────────────────────────────────────────────────────────────────────
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

export interface Product {
  id: number;
  slug: string;
  name: string;
  base_price: string;
  category: string;
  image_url: string | null;
  is_active: boolean;
  is_trending?: boolean;
  is_featured?: boolean;
  is_new?: boolean;
  short_description?: string;
}

// ── Animation tokens ──────────────────────────────────────────────────────────
const EASE = [0.16, 1, 0.3, 1] as const;

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 0.75, ease: EASE } },
};

const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.7, ease: "easeOut" } },
};

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.11, delayChildren: 0.05 } },
};

// ── Grain overlay ─────────────────────────────────────────────────────────────
function Grain() {
  return (
    <svg
      aria-hidden
      style={{
        position: "fixed", inset: 0, width: "100%", height: "100%",
        pointerEvents: "none", zIndex: 9999,
        opacity: 0.016, mixBlendMode: "multiply",
      }}
    >
      <filter id="lx-grain">
        <feTurbulence type="fractalNoise" baseFrequency="0.68" numOctaves="3" stitchTiles="stitch" />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#lx-grain)" />
    </svg>
  );
}

// ── Scroll reveal ─────────────────────────────────────────────────────────────
function Reveal({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div ref={ref} className={className}
      variants={stagger} initial="hidden" animate={inView ? "show" : "hidden"}>
      {children}
    </motion.div>
  );
}

// ── Section label ─────────────────────────────────────────────────────────────
function Label({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return (
    <div className={`lx-label${light ? " lx-label-light" : ""}`}>
      <span className="lx-label-dot" />
      {children}
    </div>
  );
}

// ── Testimonials ──────────────────────────────────────────────────────────────
const TESTIMONIALS = [
  { quote: "I've never seen her cry happy tears like that. She couldn't stop hugging the box.", name: "Amara O.", occasion: "Anniversary Gift", initials: "AO" },
  { quote: "My mum called me three times after she opened it. She said it was the best gift of her life.", name: "Chidi B.", occasion: "Mother's Day", initials: "CB" },
  { quote: "Everyone at the surprise party was recording her reaction. Lensra made that moment.", name: "Fatima K.", occasion: "Birthday", initials: "FK" },
];

function TestimonialSlider() {
  const [active, setActive] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setActive(a => (a + 1) % TESTIMONIALS.length), 5200);
    return () => clearInterval(t);
  }, []);
  const t = TESTIMONIALS[active];
  return (
    <div className="lx-testi-wrap">
      <AnimatePresence mode="wait">
        <motion.div key={active} className="lx-testi-card"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.45, ease: EASE }}>
          <span className="lx-testi-open-quote">"</span>
          <p className="lx-testi-quote">{t.quote}"</p>
          <div className="lx-testi-meta">
            <div className="lx-testi-avatar">{t.initials}</div>
            <div>
              <div className="lx-testi-name">{t.name}</div>
              <div className="lx-testi-occ">{t.occasion}</div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
      <div className="lx-testi-dots">
        {TESTIMONIALS.map((_, i) => (
          <button key={i} className={`lx-dot${i === active ? " active" : ""}`}
            onClick={() => setActive(i)} aria-label={`Review ${i + 1}`} />
        ))}
      </div>
    </div>
  );
}

// ── Secondary product card (small) ────────────────────────────────────────────
function SmallProductCard({ product }: { product: Product }) {
  const imgUrl = getImageUrl(product.image_url);
  return (
    <Link href={`/shop/${product.slug}`} className="lx-sm-card">
      <div className="lx-sm-card-img">
        {imgUrl ? (
          <Image src={imgUrl} alt={product.name} fill style={{ objectFit: "cover" }}
            sizes="200px" className="lx-sm-card-photo" />
        ) : (
          <div className="lx-sm-card-placeholder">🎁</div>
        )}
      </div>
      <div className="lx-sm-card-info">
        <span className="lx-sm-card-name">{product.name}</span>
        <span className="lx-sm-card-price">From {formatPrice(product.base_price || 0)}</span>
      </div>
      <span className="lx-sm-card-arrow">→</span>
    </Link>
  );
}

// ── MAIN ──────────────────────────────────────────────────────────────────────
export default function ClientHomepage() {
  const heroRef = useRef(null);

  // ── Product state ───────────────────────────────────────────────────────────
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    setProductsLoading(true);

    fetch(`${BaseUrl}api/products/`, { signal: controller.signal })
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then(data => {
        const all: Product[] = Array.isArray(data) ? data : (data.results ?? []);
        console.log("[Lensra] fetched products:", all);
        // Only active tote / pouch / box products
        // const filtered = all.filter(
        //   p => p.is_active && ["tote", "pouch", "box", "memory", "surprise"].some(
        //     k => p.category?.toLowerCase().includes(k)
        //   )
        // );
        const filtered = all.filter(p => p.is_active);
        setProducts(filtered);
      })
      .catch(err => {
        if (err.name !== "AbortError") console.error("[Lensra] product fetch:", err);
      })
      .finally(() => setProductsLoading(false));

    return () => controller.abort();
  }, []);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.06]);

  // ── Derive hero + secondary from fetched products ──────────────────────────
  const heroProduct =
    products.find(p => /box|memory|surprise/i.test(p.name + " " + p.category))
    || products[0]
    || null;
    console.log("products", products)
    console.log("[Lensra] hero product:", heroProduct);

  const secondaryProducts = products
    .filter(p => p.id !== heroProduct?.id)
    .slice(0, 2);

  const heroImageUrl = getImageUrl(heroProduct?.image_url ?? null);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,700&family=Playfair+Display:ital,wght@0,700;0,900;1,400;1,700;1,900&display=swap');

        /* ── TOKENS ──────────────────────────────────────── */
        :root {
          --black:  #0F0F0F;
          --black2: #111111;
          --white:  #FFFFFF;
          --off:    #F7F4F0;
          --red:    #DD183B;
          --red-d:  #C2152F;
          --muted:  #666666;
          --rule:   rgba(255,255,255,0.07);
          --rule-l: rgba(0,0,0,0.08);
          --mont:   'Montserrat', sans-serif;
          --play:   'Playfair Display', serif;
          --ease:   cubic-bezier(0.16,1,0.3,1);
        }

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          font-family: var(--mont);
          background: var(--white);
          color: var(--black);
          -webkit-font-smoothing: antialiased;
          overflow-x: hidden;
        }

        /* ── LABEL ───────────────────────────────────────── */
        .lx-label {
          display: inline-flex; align-items: center; gap: 10px;
          font-family: var(--mont);
          font-size: 9px; font-weight: 800;
          letter-spacing: 0.36em; text-transform: uppercase;
          color: var(--red); margin-bottom: 18px;
        }
        .lx-label-light { color: var(--red); }
        .lx-label-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: var(--red); flex-shrink: 0;
        }

        /* ── BUTTONS ─────────────────────────────────────── */
        .lx-btn-red {
          display: inline-flex; align-items: center; gap: 8px;
          background: var(--red); color: var(--white);
          padding: 16px 40px;
          font-family: var(--mont);
          font-size: 11px; font-weight: 800;
          letter-spacing: 0.16em; text-transform: uppercase;
          text-decoration: none; border-radius: 1px;
          transition: background 0.2s, transform 0.15s;
          white-space: nowrap;
        }
        .lx-btn-red:hover { background: var(--red-d); transform: translateY(-2px); }

        .lx-btn-ghost-dark {
          display: inline-flex; align-items: center; gap: 8px;
          border: 1.5px solid rgba(255,255,255,0.18);
          color: rgba(255,255,255,0.55);
          padding: 16px 32px;
          font-family: var(--mont);
          font-size: 11px; font-weight: 700;
          letter-spacing: 0.14em; text-transform: uppercase;
          text-decoration: none; border-radius: 1px;
          transition: border-color 0.2s, color 0.2s;
          white-space: nowrap;
        }
        .lx-btn-ghost-dark:hover { border-color: rgba(255,255,255,0.5); color: var(--white); }

        .lx-btn-outline {
          display: inline-flex; align-items: center; gap: 8px;
          border: 1.5px solid var(--red); color: var(--red);
          padding: 14px 28px;
          font-family: var(--mont);
          font-size: 10px; font-weight: 700;
          letter-spacing: 0.14em; text-transform: uppercase;
          text-decoration: none; border-radius: 1px;
          transition: background 0.2s, color 0.2s;
          white-space: nowrap;
        }
        .lx-btn-outline:hover { background: var(--red); color: var(--white); }

        /* ══════════════════════════════════════════
           1. HERO
        ══════════════════════════════════════════ */
        .lx-hero {
          position: relative;
          width: 100%;
          height: 100svh;
          min-height: 600px;
          max-height: 900px;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* Background layer — contained, no overflow */
        .lx-hero-bg {
          position: absolute;
          inset: 0;
          will-change: transform;
          overflow: hidden;
        }
        .lx-hero-bg-inner {
          position: absolute;
          inset: -5%;  /* gives scale room without clipping */
          background: radial-gradient(ellipse at 60% 40%, #220008 0%, var(--black) 70%);
        }
        /* Red ambient glow */
        .lx-hero-glow {
          position: absolute;
          top: 35%; left: 55%;
          transform: translate(-50%, -50%);
          width: 700px; height: 700px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(221,24,59,0.14) 0%, transparent 65%);
          pointer-events: none;
        }

        /* Overlays */
        .lx-hero-vignette {
          position: absolute; inset: 0; z-index: 1; pointer-events: none;
          background: radial-gradient(ellipse at center, transparent 25%, rgba(0,0,0,0.65) 100%);
        }
        .lx-hero-fade {
          position: absolute; bottom: 0; left: 0; right: 0;
          height: 180px; z-index: 2; pointer-events: none;
          background: linear-gradient(to bottom, transparent, var(--black));
        }

        /* Content */
        .lx-hero-content {
          position: relative; z-index: 3;
          text-align: center;
          padding: 0 24px;
          max-width: 860px;
          width: 100%;
        }

        .lx-hero-eyebrow {
          font-family: var(--mont);
          font-size: 10px; font-weight: 700;
          letter-spacing: 0.32em; text-transform: uppercase;
          color: var(--red);
          margin-bottom: 28px;
          display: flex; align-items: center; justify-content: center; gap: 14px;
        }
        .lx-hero-eyebrow::before,
        .lx-hero-eyebrow::after {
          content: ''; display: block; width: 28px; height: 1px;
          background: rgba(221,24,59,0.5);
        }

        .lx-hero-h1 {
          font-family: var(--play);
          font-size: clamp(42px, 7vw, 88px);
          font-weight: 900; line-height: 0.95;
          letter-spacing: -0.03em; color: var(--white);
          margin-bottom: 24px;
        }
        .lx-hero-h1 em {
          font-style: italic; font-weight: 400;
          color: transparent;
          -webkit-text-stroke: 1.5px rgba(255,255,255,0.5);
          display: block;
        }

        .lx-hero-sub {
          font-family: var(--mont);
          font-size: clamp(14px, 1.6vw, 17px);
          font-weight: 400; line-height: 1.85;
          color: rgba(255,255,255,0.5);
          max-width: 480px; margin: 0 auto 44px;
        }

        .lx-hero-actions {
          display: flex; gap: 12px;
          justify-content: center; flex-wrap: wrap;
        }

        /* Scroll indicator */
        .lx-hero-scroll {
          position: absolute; bottom: 36px; left: 50%;
          transform: translateX(-50%); z-index: 3;
          display: flex; flex-direction: column; align-items: center; gap: 8px;
          pointer-events: none;
        }
        .lx-scroll-label {
          font-family: var(--mont); font-size: 8px; font-weight: 700;
          letter-spacing: 0.3em; text-transform: uppercase;
          color: rgba(255,255,255,0.25);
        }
        .lx-scroll-line {
          width: 1px; height: 36px;
          background: linear-gradient(to bottom, rgba(255,255,255,0.35), transparent);
          animation: lx-scroll-anim 2s ease-in-out infinite;
        }
        @keyframes lx-scroll-anim {
          0%, 100% { opacity: 0.3; transform: scaleY(0.7) translateY(0); }
          50%       { opacity: 1;   transform: scaleY(1)   translateY(4px); }
        }

        /* ══════════════════════════════════════════
           2. HOW IT WORKS
        ══════════════════════════════════════════ */
        .lx-how {
          background: var(--white);
          padding: 100px 6vw;
        }
        .lx-how-header { margin-bottom: 64px; }
        .lx-how-h2 {
          font-family: var(--play);
          font-size: clamp(30px, 3.5vw, 52px);
          font-weight: 900; line-height: 0.92;
          letter-spacing: -0.02em; color: var(--black);
        }
        .lx-how-h2 em { font-style: italic; font-weight: 400; color: var(--red); }

        .lx-how-steps {
          display: grid; grid-template-columns: repeat(3, 1fr);
          gap: 2px;
        }
        .lx-how-step {
          background: var(--off);
          padding: 48px 32px;
          position: relative; overflow: hidden;
          border-top: 2px solid transparent;
          transition: border-color 0.3s, background 0.3s;
        }
        .lx-how-step:hover {
          border-color: var(--red);
          background: #f0ede8;
        }
        .lx-how-num {
          font-family: var(--play);
          font-size: 88px; font-weight: 900; font-style: italic;
          color: rgba(0,0,0,0.05); line-height: 1;
          display: block; margin-bottom: 20px;
          letter-spacing: -0.04em;
          transition: color 0.3s;
        }
        .lx-how-step:hover .lx-how-num { color: rgba(221,24,59,0.08); }
        .lx-how-icon { font-size: 32px; display: block; margin-bottom: 16px; }
        .lx-how-title {
          font-family: var(--mont);
          font-size: 15px; font-weight: 800;
          letter-spacing: 0.05em; color: var(--black);
          margin-bottom: 10px;
        }
        .lx-how-body {
          font-family: var(--mont);
          font-size: 13px; font-weight: 400;
          color: var(--muted); line-height: 1.8;
        }

        /* ══════════════════════════════════════════
           3. HERO PRODUCT
        ══════════════════════════════════════════ */
        .lx-product-section {
          background: var(--black);
          padding: 100px 6vw;
          border-top: 1px solid var(--rule);
        }
        .lx-product-inner {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 80px; align-items: center;
          max-width: 1200px; margin: 0 auto;
        }

        /* Image side */
        .lx-product-img-wrap {
          position: relative;
          aspect-ratio: 4/5;
          overflow: hidden;
          background: #1a1a1a;
        }
        .lx-product-img-wrap img {
          width: 100%; height: 100%;
          object-fit: cover;
          transition: transform 0.9s var(--ease);
        }
        .lx-product-img-wrap:hover img { transform: scale(1.04); }
        .lx-product-img-placeholder {
          width: 100%; height: 100%;
          display: flex; align-items: center; justify-content: center;
          background: #1a1a1a; font-size: 80px;
        }

        /* Floating badge */
        .lx-product-badge {
          position: absolute; top: 24px; left: 24px;
          background: var(--red); color: var(--white);
          font-family: var(--mont);
          font-size: 8px; font-weight: 800;
          letter-spacing: 0.22em; text-transform: uppercase;
          padding: 6px 14px;
        }

        /* Content side */
        .lx-product-content { display: flex; flex-direction: column; gap: 0; }

        .lx-product-h2 {
          font-family: var(--play);
          font-size: clamp(32px, 3.5vw, 56px);
          font-weight: 900; line-height: 0.92;
          letter-spacing: -0.02em; color: var(--white);
          margin-bottom: 16px;
        }
        .lx-product-h2 em { font-style: italic; font-weight: 400; color: var(--red); }

        .lx-product-tagline {
          font-family: var(--play);
          font-size: clamp(15px, 1.5vw, 18px);
          font-weight: 400; font-style: italic;
          color: rgba(255,255,255,0.5);
          line-height: 1.7; margin-bottom: 32px;
        }

        .lx-product-features {
          list-style: none; margin-bottom: 36px;
          display: flex; flex-direction: column; gap: 12px;
        }
        .lx-product-feature {
          display: flex; align-items: center; gap: 12px;
          font-family: var(--mont);
          font-size: 13px; font-weight: 500;
          color: rgba(255,255,255,0.65);
        }
        .lx-product-feature::before {
          content: '';
          width: 18px; height: 1.5px;
          background: var(--red); flex-shrink: 0;
        }

        .lx-product-price-row {
          display: flex; align-items: baseline; gap: 10px;
          margin-bottom: 28px;
        }
        .lx-product-price {
          font-family: var(--mont);
          font-size: 28px; font-weight: 900;
          color: var(--white); letter-spacing: -0.02em;
        }
        .lx-product-price-label {
          font-family: var(--mont);
          font-size: 10px; font-weight: 600;
          letter-spacing: 0.12em; text-transform: uppercase;
          color: rgba(255,255,255,0.35);
        }

        .lx-product-cta-row {
          display: flex; gap: 12px; flex-wrap: wrap;
        }

        /* ── Other experiences ── */
        .lx-others {
          margin-top: 64px;
          border-top: 1px solid var(--rule);
          padding-top: 56px;
          max-width: 1200px; margin-inline: auto;
        }
        .lx-others-label {
          font-family: var(--mont);
          font-size: 9px; font-weight: 700;
          letter-spacing: 0.32em; text-transform: uppercase;
          color: rgba(255,255,255,0.3);
          margin-bottom: 24px; display: block;
        }
        .lx-others-grid {
          display: flex; gap: 2px; flex-wrap: wrap;
        }

        .lx-sm-card {
          display: flex; align-items: center; gap: 16px;
          flex: 1; min-width: 240px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.06);
          padding: 20px;
          text-decoration: none;
          transition: background 0.2s, border-color 0.2s;
        }
        .lx-sm-card:hover {
          background: rgba(255,255,255,0.06);
          border-color: rgba(221,24,59,0.3);
        }
        .lx-sm-card-img {
          width: 64px; height: 64px; flex-shrink: 0;
          position: relative; overflow: hidden;
          background: #1a1a1a;
        }
        .lx-sm-card-photo { transition: transform 0.4s var(--ease); }
        .lx-sm-card:hover .lx-sm-card-photo { transform: scale(1.08); }
        .lx-sm-card-placeholder {
          width: 100%; height: 100%;
          display: flex; align-items: center; justify-content: center;
          font-size: 24px;
        }
        .lx-sm-card-info { flex: 1; }
        .lx-sm-card-name {
          font-family: var(--mont);
          font-size: 13px; font-weight: 700;
          color: rgba(255,255,255,0.8);
          display: block; margin-bottom: 4px;
        }
        .lx-sm-card-price {
          font-family: var(--mont);
          font-size: 11px; font-weight: 500;
          color: rgba(255,255,255,0.35);
          display: block;
        }
        .lx-sm-card-arrow {
          font-size: 16px; color: rgba(221,24,59,0.5);
          transition: transform 0.2s, color 0.2s;
        }
        .lx-sm-card:hover .lx-sm-card-arrow { transform: translateX(4px); color: var(--red); }

        /* ══════════════════════════════════════════
           4. TESTIMONIALS
        ══════════════════════════════════════════ */
        .lx-proof {
          background: var(--black2);
          padding: 100px 6vw;
          border-top: 1px solid var(--rule);
        }
        .lx-proof-inner {
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 80px; align-items: center;
          max-width: 1200px; margin: 0 auto;
        }
        .lx-proof-h2 {
          font-family: var(--play);
          font-size: clamp(28px, 3vw, 48px);
          font-weight: 900; line-height: 0.92;
          letter-spacing: -0.02em; color: var(--white);
          margin-bottom: 16px;
        }
        .lx-proof-h2 em { font-style: italic; font-weight: 400; color: var(--red); }
        .lx-proof-lead {
          font-family: var(--mont);
          font-size: 14px; font-weight: 400;
          color: rgba(255,255,255,0.4); line-height: 1.8;
          margin-bottom: 40px; max-width: 400px;
        }
        .lx-proof-stats {
          display: grid; grid-template-columns: 1fr 1fr; gap: 2px;
        }
        .lx-proof-stat {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.06);
          padding: 24px 20px;
        }
        .lx-proof-stat-num {
          font-family: var(--mont);
          font-size: 36px; font-weight: 900;
          line-height: 1; color: var(--red);
          letter-spacing: -0.03em; display: block; margin-bottom: 6px;
        }
        .lx-proof-stat-label {
          font-family: var(--mont);
          font-size: 10px; font-weight: 600;
          letter-spacing: 0.12em; text-transform: uppercase;
          color: rgba(255,255,255,0.3);
        }

        /* Testimonial card */
        .lx-testi-wrap { position: relative; }
        .lx-testi-card {
          background: rgba(255,255,255,0.035);
          border: 1px solid rgba(255,255,255,0.07);
          padding: 48px 40px;
          position: relative;
        }
        .lx-testi-open-quote {
          font-family: var(--play);
          font-size: 100px; font-weight: 900; font-style: italic;
          color: var(--red); opacity: 0.2; line-height: 0.8;
          position: absolute; top: 16px; left: 28px;
          pointer-events: none; user-select: none;
        }
        .lx-testi-quote {
          font-family: var(--play);
          font-size: 18px; font-weight: 400; font-style: italic;
          color: var(--white); line-height: 1.7;
          margin-bottom: 28px; padding-top: 20px;
        }
        .lx-testi-meta { display: flex; align-items: center; gap: 14px; }
        .lx-testi-avatar {
          width: 42px; height: 42px; border-radius: 50%;
          background: var(--red); color: var(--white);
          font-family: var(--mont); font-size: 13px; font-weight: 800;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .lx-testi-name {
          font-family: var(--mont); font-size: 13px; font-weight: 700;
          color: var(--white); display: block;
        }
        .lx-testi-occ {
          font-family: var(--mont); font-size: 10px; font-weight: 600;
          color: var(--red); letter-spacing: 0.1em; text-transform: uppercase;
          display: block; margin-top: 3px;
        }
        .lx-testi-dots { display: flex; gap: 8px; margin-top: 20px; }
        .lx-dot {
          width: 6px; height: 6px; border-radius: 50%; border: none;
          cursor: pointer; background: rgba(255,255,255,0.15); padding: 0;
          transition: background 0.2s, transform 0.2s;
        }
        .lx-dot.active { background: var(--red); transform: scale(1.4); }

        /* ══════════════════════════════════════════
           5. OCCASIONS
        ══════════════════════════════════════════ */
        .lx-occasions {
          background: var(--white);
          padding: 100px 6vw;
          border-top: 1px solid var(--rule-l);
        }
        .lx-occasions-header {
          display: flex; justify-content: space-between;
          align-items: flex-end; margin-bottom: 56px;
          gap: 24px; flex-wrap: wrap;
        }
        .lx-occasions-h2 {
          font-family: var(--play);
          font-size: clamp(28px, 3vw, 44px);
          font-weight: 900; line-height: 0.92;
          letter-spacing: -0.02em; color: var(--black);
        }
        .lx-occasions-h2 em { font-style: italic; font-weight: 400; color: var(--red); }
        .lx-occasions-grid {
          display: grid; grid-template-columns: repeat(4, 1fr); gap: 2px;
        }
        .lx-occ-card {
          display: block; text-decoration: none;
          padding: 40px 24px;
          background: var(--off);
          border-top: 2px solid transparent;
          transition: border-color 0.25s, background 0.25s;
        }
        .lx-occ-card:hover { border-top-color: var(--red); background: #f0ede8; }
        .lx-occ-icon { font-size: 36px; display: block; margin-bottom: 16px; }
        .lx-occ-name {
          font-family: var(--mont); font-size: 16px; font-weight: 800;
          color: var(--black); display: block; margin-bottom: 6px;
        }
        .lx-occ-sub {
          font-family: var(--mont); font-size: 11px; font-weight: 500;
          color: #aaa; display: flex; align-items: center; gap: 6px;
          transition: color 0.2s;
        }
        .lx-occ-card:hover .lx-occ-sub { color: var(--red); }

        /* ══════════════════════════════════════════
           6. FINAL CTA
        ══════════════════════════════════════════ */
        .lx-cta {
          background: var(--black);
          padding: 120px 6vw;
          text-align: center;
          position: relative; overflow: hidden;
          border-top: 1px solid var(--rule);
        }
        .lx-cta-ghost {
          position: absolute; top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          font-family: var(--play);
          font-size: clamp(80px, 16vw, 220px);
          font-weight: 900; font-style: italic;
          color: rgba(255,255,255,0.015);
          white-space: nowrap; pointer-events: none; user-select: none;
          z-index: 0;
        }
        .lx-cta-inner { position: relative; z-index: 1; max-width: 640px; margin: 0 auto; }
        .lx-cta-h2 {
          font-family: var(--play);
          font-size: clamp(36px, 5vw, 72px);
          font-weight: 900; line-height: 0.92;
          letter-spacing: -0.025em; color: var(--white);
          margin-bottom: 20px;
        }
        .lx-cta-h2 em { font-style: italic; font-weight: 400; color: var(--red); display: block; }
        .lx-cta-sub {
          font-family: var(--mont);
          font-size: 15px; font-weight: 400;
          color: rgba(255,255,255,0.4); line-height: 1.85;
          margin-bottom: 44px;
        }
        .lx-cta-btns {
          display: flex; gap: 12px;
          justify-content: center; flex-wrap: wrap;
        }

        /* ══════════════════════════════════════════
           SKELETON LOADER
        ══════════════════════════════════════════ */
        @keyframes lx-shimmer {
          0%   { background-position: -600px 0; }
          100% { background-position:  600px 0; }
        }
        .lx-ske {
          border-radius: 2px;
          background: linear-gradient(
            90deg,
            rgba(255,255,255,0.04) 25%,
            rgba(255,255,255,0.09) 50%,
            rgba(255,255,255,0.04) 75%
          );
          background-size: 600px 100%;
          animation: lx-shimmer 1.6s ease-in-out infinite;
        }
        .lx-ske-img   { aspect-ratio: 4/5; width: 100%; }
        .lx-ske-label { height: 10px; width: 100px; margin-bottom: 20px; }
        .lx-ske-h-lg  { height: 52px; width: 90%;  margin-bottom: 10px; }
        .lx-ske-h-md  { height: 52px; width: 65%;  margin-bottom: 28px; }
        .lx-ske-body  { height: 14px; width: 100%; margin-bottom: 10px; }
        .lx-ske-short { width: 75%; }
        .lx-ske-price { height: 36px; width: 140px; margin: 24px 0; }
        .lx-ske-btn   { height: 52px; width: 200px; }

        /* ══════════════════════════════════════════
           RESPONSIVE
        ══════════════════════════════════════════ */
        @media (max-width: 960px) {
          .lx-how-steps { grid-template-columns: 1fr 1fr; }
          .lx-product-inner { grid-template-columns: 1fr; gap: 48px; }
          .lx-proof-inner { grid-template-columns: 1fr; gap: 56px; }
          .lx-occasions-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 640px) {
          .lx-how { padding: 72px 5vw; }
          .lx-how-steps { grid-template-columns: 1fr; }
          .lx-product-section { padding: 72px 5vw; }
          .lx-proof { padding: 72px 5vw; }
          .lx-occasions { padding: 72px 5vw; }
          .lx-cta { padding: 80px 5vw; }
          .lx-hero-actions { flex-direction: column; align-items: center; }
          .lx-hero-h1 { font-size: clamp(36px, 11vw, 56px); }
          .lx-product-cta-row { flex-direction: column; }
          .lx-product-price-row { flex-wrap: wrap; }
          .lx-proof-stats { grid-template-columns: 1fr 1fr; }
          .lx-occasions-grid { grid-template-columns: 1fr 1fr; }
        }
        @media (max-width: 420px) {
          .lx-occasions-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <Grain />

      {/* ═══ 1. HERO ═══════════════════════════════════════════════════════════ */}
      <section className="lx-hero" ref={heroRef}>
        <motion.div className="lx-hero-bg" style={{ scale: heroScale }}>
          <div className="lx-hero-bg-inner" />
          <div className="lx-hero-glow" />
        </motion.div>
        <div className="lx-hero-vignette" />
        <div className="lx-hero-fade" />

        <div className="lx-hero-content">
          <motion.div className="lx-hero-eyebrow"
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: EASE, delay: 0.1 }}>
            Personalised Gift Experiences · Nigeria
          </motion.div>

          <motion.h1 className="lx-hero-h1"
            initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.25 }}>
            Turn Memories Into
            <em>Unforgettable Gifts</em>
          </motion.h1>

          <motion.p className="lx-hero-sub"
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.42 }}>
            Handcrafted personalised surprise boxes that make your loved ones
            smile, cry, and remember forever.
          </motion.p>

          <motion.div className="lx-hero-actions"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease: EASE, delay: 0.58 }}>
            <Link href="/shop" className="lx-btn-red">Create Your Gift →</Link>
            <Link href="/about" className="lx-btn-ghost-dark">Our Story</Link>
          </motion.div>
        </div>

        <motion.div className="lx-hero-scroll"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 1.3, duration: 0.6 }}>
          <span className="lx-scroll-label">Scroll</span>
          <div className="lx-scroll-line" />
        </motion.div>
      </section>

      {/* ═══ 2. HOW IT WORKS ═══════════════════════════════════════════════════ */}
      <section className="lx-how">
        <Reveal>
          <motion.div className="lx-how-header" variants={fadeUp}>
            <Label>How It Works</Label>
            <h2 className="lx-how-h2">
              Simple steps to a<br /><em>perfect gift.</em>
            </h2>
          </motion.div>

          <div className="lx-how-steps">
            {[
              { num: "01", icon: "📸", title: "Share Your Memories", body: "Send us your photos, names, and a personal message. Takes less than 5 minutes." },
              { num: "02", icon: "✂️", title: "We Craft Your Gift",  body: "Our team handcrafts every detail of your personalised surprise box — nothing is generic." },
              { num: "03", icon: "🚚", title: "We Deliver the Wow",  body: "Beautifully packaged and shipped via GIG Logistics. Trackable delivery in 3–5 days." },
            ].map(step => (
              <motion.div key={step.num} className="lx-how-step" variants={fadeUp}>
                <span className="lx-how-num">{step.num}</span>
                <span className="lx-how-icon">{step.icon}</span>
                <h3 className="lx-how-title">{step.title}</h3>
                <p className="lx-how-body">{step.body}</p>
              </motion.div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* ═══ 3. HERO PRODUCT ═══════════════════════════════════════════════════ */}
      <section className="lx-product-section">
        {productsLoading ? (
          /* ── Skeleton while fetching ─────────────────────────────────────── */
          <div className="lx-product-inner lx-skeleton-wrap" aria-busy="true">
            <div className="lx-ske lx-ske-img" />
            <div className="lx-product-content">
              <div className="lx-ske lx-ske-label" />
              <div className="lx-ske lx-ske-h-lg" />
              <div className="lx-ske lx-ske-h-md" />
              <div className="lx-ske lx-ske-body" />
              <div className="lx-ske lx-ske-body lx-ske-short" />
              <div className="lx-ske lx-ske-body lx-ske-short" />
              <div className="lx-ske lx-ske-price" />
              <div className="lx-ske lx-ske-btn" />
            </div>
          </div>
        ) : heroProduct ? (
          /* ── Real product ────────────────────────────────────────────────── */
          <Reveal>
            <div className="lx-product-inner">
              {/* Image */}
              <motion.div variants={fadeIn}>
                <div className="lx-product-img-wrap">
                  {heroImageUrl ? (
                    <img src={heroImageUrl} alt={heroProduct.name} />
                  ) : (
                    <div className="lx-product-img-placeholder">🎁</div>
                  )}
                  {heroProduct.is_new && <div className="lx-product-badge">New</div>}
                  {heroProduct.is_featured && !heroProduct.is_new && (
                    <div className="lx-product-badge">Best Seller</div>
                  )}
                </div>
              </motion.div>

              {/* Content */}
              <motion.div className="lx-product-content" variants={stagger}>
                <motion.div variants={fadeUp}>
                  <Label light>Featured Gift</Label>
                </motion.div>

                <motion.h2 className="lx-product-h2" variants={fadeUp}>
                  {/memory|surprise/i.test(heroProduct.name) ? (
                    <>
                      {heroProduct.name.split(" ").slice(0, -2).join(" ")}<br />
                      <em>{heroProduct.name.split(" ").slice(-2).join(" ")}</em>
                    </>
                  ) : (
                    <>{heroProduct.name}</>
                  )}
                </motion.h2>

                <motion.p className="lx-product-tagline" variants={fadeUp}>
                  {heroProduct.short_description ||
                    "A personalised gift designed to turn your memories into an unforgettable experience."}
                </motion.p>

                <motion.ul className="lx-product-features" variants={fadeUp}>
                  <li className="lx-product-feature">Custom photos & personal message</li>
                  <li className="lx-product-feature">Handcrafted in Benin City, Nigeria</li>
                  <li className="lx-product-feature">Beautifully packaged & gift-ready</li>
                  <li className="lx-product-feature">Nationwide delivery in 3–5 days</li>
                </motion.ul>

                <motion.div className="lx-product-price-row" variants={fadeUp}>
                  <span className="lx-product-price">
                    {formatPrice(heroProduct.base_price || 0)}
                  </span>
                  <span className="lx-product-price-label">Starting from</span>
                </motion.div>

                <motion.div className="lx-product-cta-row" variants={fadeUp}>
                  <Link href={`/shop/${heroProduct.slug}`} className="lx-btn-red">
                    Create Your Gift →
                  </Link>
                  <Link href="/shop" className="lx-btn-outline">View All</Link>
                </motion.div>
              </motion.div>
            </div>

            {/* Secondary products */}
            {secondaryProducts.length > 0 && (
              <div className="lx-others">
                <span className="lx-others-label">Other Experiences</span>
                <div className="lx-others-grid">
                  {secondaryProducts.map(product => (
                    <SmallProductCard key={product.id} product={product} />
                  ))}
                </div>
              </div>
            )}
          </Reveal>
        ) : (
          /* ── Fetch succeeded but no products returned ────────────────────── */
          <Reveal>
            <div style={{ textAlign: "center", padding: "40px 0" }}>
              <motion.div variants={fadeUp}>
                <Label light>Our Gift Collection</Label>
                <h2 className="lx-product-h2" style={{ marginBottom: 24 }}>
                  The Surprise<br /><em>Memory Box.</em>
                </h2>
                <Link href="/shop" className="lx-btn-red">Browse All Gifts →</Link>
              </motion.div>
            </div>
          </Reveal>
        )}
      </section>

      {/* ═══ 4. TESTIMONIALS ═══════════════════════════════════════════════════ */}
      <section className="lx-proof">
        <Reveal>
          <div className="lx-proof-inner">
            <motion.div variants={stagger}>
              <motion.div variants={fadeUp}>
                <Label light>Real Reactions</Label>
                <h2 className="lx-proof-h2">
                  "I've never seen her<br /><em>this happy 😭❤️"</em>
                </h2>
                <p className="lx-proof-lead">
                  Every Lensra gift creates a moment people talk about for years.
                  Here's what real customers said.
                </p>
              </motion.div>
              <motion.div className="lx-proof-stats" variants={stagger}>
                {[
                  { num: "500+", label: "Happy customers" },
                  { num: "98%",  label: "Would recommend" },
                  { num: "4.9★", label: "Avg. rating" },
                  { num: "3–5d", label: "Delivery time" },
                ].map(s => (
                  <motion.div key={s.label} className="lx-proof-stat" variants={fadeUp}>
                    <span className="lx-proof-stat-num">{s.num}</span>
                    <span className="lx-proof-stat-label">{s.label}</span>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            <motion.div variants={fadeUp}>
              <TestimonialSlider />
            </motion.div>
          </div>
        </Reveal>
      </section>

      {/* ═══ 5. OCCASIONS ══════════════════════════════════════════════════════ */}
      <section className="lx-occasions">
        <Reveal>
          <motion.div className="lx-occasions-header" variants={fadeUp}>
            <div>
              <Label>Shop by Occasion</Label>
              <h2 className="lx-occasions-h2">
                Every celebration<br /><em>deserves a moment.</em>
              </h2>
            </div>
            <Link href="/shop" className="lx-btn-outline">View All →</Link>
          </motion.div>

          <div className="lx-occasions-grid">
            {[
              { icon: "🎂", name: "Birthday",     slug: "birthday",     sub: "Most gifted" },
              { icon: "💍", name: "Anniversary",  slug: "anniversary",  sub: "Celebrate love" },
              { icon: "❤️", name: "Valentine",    slug: "valentine",    sub: "For your person" },
              { icon: "🌸", name: "Mother's Day", slug: "mothers-day",  sub: "Show appreciation" },
              { icon: "🎓", name: "Graduation",   slug: "graduation",   sub: "Big milestone" },
              { icon: "🤍", name: "Wedding",      slug: "wedding",      sub: "Forever gift" },
              { icon: "🏢", name: "Corporate",    slug: "corporate",    sub: "Bulk orders welcome" },
              { icon: "🎁", name: "Just Because", slug: "just-because", sub: "No reason needed" },
            ].map(o => (
              <motion.div key={o.slug} variants={fadeUp}>
                <Link href={`/shop?tag=${o.slug}`} className="lx-occ-card">
                  <span className="lx-occ-icon">{o.icon}</span>
                  <span className="lx-occ-name">{o.name}</span>
                  <span className="lx-occ-sub">{o.sub} →</span>
                </Link>
              </motion.div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* ═══ 6. FINAL CTA ══════════════════════════════════════════════════════ */}
      <section className="lx-cta">
        <div className="lx-cta-ghost">Lensra.</div>
        <Reveal>
          <div className="lx-cta-inner">
            <motion.div variants={fadeUp}>
              <Label>Get Started Today</Label>
            </motion.div>
            <motion.h2 className="lx-cta-h2" variants={fadeUp}>
              Ready to make someone
              <em>feel truly special?</em>
            </motion.h2>
            <motion.p className="lx-cta-sub" variants={fadeUp}>
              Order in minutes. Handcrafted in Benin City.
              Delivered across Nigeria in 3–5 days.
            </motion.p>
            <motion.div className="lx-cta-btns" variants={fadeUp}>
              <Link href="/shop" className="lx-btn-red">Create Your Gift Now →</Link>
              <Link href="/business" className="lx-btn-ghost-dark">Corporate Orders</Link>
            </motion.div>
          </div>
        </Reveal>
      </section>
    </>
  );
}