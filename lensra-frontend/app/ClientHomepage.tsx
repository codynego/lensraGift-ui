"use client";

// ClientHomepage.tsx — Premium Gift Brand
// Design: Apple × Luxury Gift — cinematic, emotional, spacious
// Palette: #0F0F0F · #FFFFFF · #DD183B
// Fonts: Montserrat (headings) · Inter (body)

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
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 0.75, ease: EASE } },
};

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};

const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.9, ease: "easeOut" } },
};

// ── Noise/grain overlay ───────────────────────────────────────────────────────
function Grain() {
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
        opacity: 0.018,
        mixBlendMode: "multiply",
      }}
    >
      <filter id="g-f">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.68"
          numOctaves="3"
          stitchTiles="stitch"
        />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#g-f)" />
    </svg>
  );
}

// ── Red dot divider ───────────────────────────────────────────────────────────
function Divider({ light = false }: { light?: boolean }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        marginBottom: "20px",
      }}
    >
      <div
        style={{
          width: "8px",
          height: "8px",
          borderRadius: "50%",
          background: "#DD183B",
          flexShrink: 0,
        }}
      />
      <div
        style={{
          width: "40px",
          height: "1px",
          background: light
            ? "rgba(255,255,255,0.15)"
            : "rgba(15,15,15,0.15)",
        }}
      />
    </div>
  );
}

// ── Testimonial carousel ──────────────────────────────────────────────────────
const TESTIMONIALS = [
  {
    quote: "I've never seen her cry happy tears like that. She couldn't stop hugging the box.",
    name: "Amara O.",
    occasion: "Anniversary Gift",
    initials: "AO",
  },
  {
    quote: "My mum called me three times after she opened it. She said it was the best gift of her life.",
    name: "Chidi B.",
    occasion: "Mother's Day",
    initials: "CB",
  },
  {
    quote: "Everyone at the surprise party was recording her reaction. Lensra made that moment.",
    name: "Fatima K.",
    occasion: "Birthday",
    initials: "FK",
  },
];

function TestimonialSlider() {
  const [active, setActive] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setActive((a) => (a + 1) % TESTIMONIALS.length), 5000);
    return () => clearInterval(t);
  }, []);
  const t = TESTIMONIALS[active];
  return (
    <div className="lx-testimonial-slider">
      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.5, ease: EASE }}
          className="lx-testimonial-card"
        >
          <div className="lx-testimonial-quote">"{t.quote}"</div>
          <div className="lx-testimonial-meta">
            <div className="lx-testimonial-avatar">{t.initials}</div>
            <div>
              <div className="lx-testimonial-name">{t.name}</div>
              <div className="lx-testimonial-occasion">{t.occasion}</div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
      <div className="lx-testimonial-dots">
        {TESTIMONIALS.map((_, i) => (
          <button
            key={i}
            className={`lx-dot ${i === active ? "active" : ""}`}
            onClick={() => setActive(i)}
            aria-label={`Testimonial ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

// ── Product card ──────────────────────────────────────────────────────────────
function ProductCard({ product, index }: { product: any; index: number }) {
  const imageUrl = getImageUrl(product.image_url);
  return (
    <motion.div variants={fadeUp}>
      <Link href={`/shop/${product.slug}`} className="lx-product-card">
        <div className="lx-product-img-wrap">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              style={{ objectFit: "cover" }}
              className="lx-product-img"
            />
          ) : (
            <div className="lx-product-placeholder">
              <div className="lx-placeholder-icon">🎁</div>
            </div>
          )}
          <div className="lx-product-overlay">
            <span className="lx-product-cta">Customize Yours →</span>
          </div>
          {product.is_new && <div className="lx-product-badge">New</div>}
        </div>
        <div className="lx-product-info">
          <h3 className="lx-product-name">{product.name}</h3>
          <div className="lx-product-price">From {formatPrice(product.base_price || 0)}</div>
        </div>
      </Link>
    </motion.div>
  );
}

// ── MAIN ──────────────────────────────────────────────────────────────────────
export default function ClientHomepage({ initialProducts }: { initialProducts: any[] }) {
  const [products] = useState(initialProducts);
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const heroRef = useRef(null);
  const howRef = useRef(null);
  const productsRef = useRef(null);
  const proofRef = useRef(null);
  const occasionsRef = useRef(null);
  const ctaRef = useRef(null);

  const howInView = useInView(howRef, { once: true, margin: "-80px" });
  const productsInView = useInView(productsRef, { once: true, margin: "-80px" });
  const proofInView = useInView(proofRef, { once: true, margin: "-80px" });
  const occasionsInView = useInView(occasionsRef, { once: true, margin: "-80px" });
  const ctaInView = useInView(ctaRef, { once: true, margin: "-80px" });

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  useEffect(() => {
    fetch(`${BaseUrl}api/products/featured/`)
      .then((r) => r.json())
      .then((d) => {
        const r = d.results || d || [];
        setFeaturedProducts(r.filter((p: any) => ["tote", "pouch"].includes(p.category)));
      })
      .catch(console.error);
  }, []);

  const displayProducts =
    products.filter((p) => ["tote", "pouch"].includes(p.category)).length > 0
      ? products.filter((p) => ["tote", "pouch"].includes(p.category)).slice(0, 4)
      : featuredProducts.slice(0, 4);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800;900&family=Inter:wght@300;400;500;600&display=swap');

        :root {
          --black: #0F0F0F;
          --white: #FFFFFF;
          --red: #DD183B;
          --red-hover: #C2152F;
          --gray-100: #F7F7F7;
          --gray-200: #EFEFEF;
          --gray-400: #AAAAAA;
          --gray-600: #666666;
          --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
          --font-head: 'Montserrat', sans-serif;
          --font-body: 'Inter', sans-serif;
        }

        * { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          font-family: var(--font-body);
          background: var(--white);
          color: var(--black);
          -webkit-font-smoothing: antialiased;
        }

        /* ── HERO ─────────────────────────────────────────────── */
        .lx-hero {
          position: relative;
          height: 100svh;
          min-height: 640px;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .lx-hero-bg {
          position: absolute;
          inset: 0;
          background: var(--black);
          will-change: transform;
        }

        /* Cinematic vignette */
        .lx-hero-vignette {
          position: absolute;
          inset: 0;
          background: radial-gradient(
            ellipse at center,
            transparent 30%,
            rgba(0,0,0,0.6) 100%
          );
          z-index: 1;
          pointer-events: none;
        }

        /* Bottom gradient fade into next section */
        .lx-hero-fade {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 200px;
          background: linear-gradient(to bottom, transparent, var(--black));
          z-index: 2;
          pointer-events: none;
        }

        .lx-hero-content {
          position: relative;
          z-index: 3;
          text-align: center;
          padding: 0 24px;
          max-width: 820px;
        }

        .lx-hero-eyebrow {
          font-family: var(--font-head);
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: var(--red);
          margin-bottom: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
        }
        .lx-hero-eyebrow::before,
        .lx-hero-eyebrow::after {
          content: '';
          display: block;
          width: 32px;
          height: 1px;
          background: var(--red);
          opacity: 0.6;
        }

        .lx-hero-h1 {
          font-family: var(--font-head);
          font-size: clamp(44px, 7.5vw, 96px);
          font-weight: 900;
          line-height: 1.0;
          letter-spacing: -0.03em;
          color: var(--white);
          margin-bottom: 28px;
        }

        .lx-hero-h1 .lx-h1-accent {
          color: var(--red);
          display: inline;
        }

        .lx-hero-sub {
          font-family: var(--font-body);
          font-size: clamp(15px, 2vw, 18px);
          font-weight: 300;
          line-height: 1.8;
          color: rgba(255,255,255,0.55);
          max-width: 500px;
          margin: 0 auto 44px;
        }

        .lx-hero-actions {
          display: flex;
          gap: 14px;
          justify-content: center;
          flex-wrap: wrap;
        }

        /* ── BUTTONS ──────────────────────────────────────────── */
        .lx-btn-red {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: var(--red);
          color: var(--white);
          padding: 16px 40px;
          font-family: var(--font-head);
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          text-decoration: none;
          border-radius: 2px;
          transition: background 0.2s, transform 0.2s;
        }
        .lx-btn-red:hover {
          background: var(--red-hover);
          transform: translateY(-2px);
        }

        .lx-btn-ghost {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          border: 1.5px solid rgba(255,255,255,0.2);
          color: rgba(255,255,255,0.6);
          padding: 16px 40px;
          font-family: var(--font-head);
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          text-decoration: none;
          border-radius: 2px;
          transition: border-color 0.2s, color 0.2s;
        }
        .lx-btn-ghost:hover {
          border-color: rgba(255,255,255,0.5);
          color: var(--white);
        }

        .lx-btn-red-outline {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          border: 1.5px solid var(--red);
          color: var(--red);
          padding: 16px 40px;
          font-family: var(--font-head);
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          text-decoration: none;
          border-radius: 2px;
          transition: background 0.2s, color 0.2s;
        }
        .lx-btn-red-outline:hover {
          background: var(--red);
          color: var(--white);
        }

        /* Hero scroll indicator */
        .lx-hero-scroll {
          position: absolute;
          bottom: 48px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 3;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
        }
        .lx-scroll-text {
          font-size: 9px;
          font-weight: 600;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.3);
          font-family: var(--font-head);
        }
        .lx-scroll-line {
          width: 1px;
          height: 40px;
          background: linear-gradient(to bottom, rgba(255,255,255,0.4), transparent);
          animation: lx-scroll-pulse 2s ease-in-out infinite;
        }
        @keyframes lx-scroll-pulse {
          0%, 100% { opacity: 0.3; transform: scaleY(0.8); }
          50% { opacity: 1; transform: scaleY(1); }
        }

        /* ── SECTION COMMONS ──────────────────────────────────── */
        .lx-section {
          padding: 120px 6vw;
        }
        .lx-section-dark {
          background: var(--black);
          color: var(--white);
        }
        .lx-section-light {
          background: var(--white);
          color: var(--black);
        }
        .lx-section-gray {
          background: var(--gray-100);
          color: var(--black);
        }

        .lx-overline {
          font-family: var(--font-head);
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.35em;
          text-transform: uppercase;
          color: var(--red);
          margin-bottom: 16px;
          display: block;
        }

        .lx-h2 {
          font-family: var(--font-head);
          font-size: clamp(32px, 4.5vw, 60px);
          font-weight: 800;
          line-height: 1.05;
          letter-spacing: -0.025em;
          color: var(--black);
        }
        .lx-h2-light { color: var(--white); }

        .lx-h2 em {
          font-style: normal;
          color: var(--red);
        }

        .lx-section-intro {
          font-size: 16px;
          font-weight: 400;
          line-height: 1.8;
          color: var(--gray-600);
          max-width: 480px;
          margin-top: 16px;
        }
        .lx-section-intro-light { color: rgba(255,255,255,0.45); }

        /* ── HOW IT WORKS ─────────────────────────────────────── */
        .lx-how-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2px;
          margin-top: 64px;
        }
        .lx-how-step {
          background: var(--gray-100);
          padding: 52px 36px;
          position: relative;
          overflow: hidden;
          transition: background 0.3s;
        }
        .lx-how-step:hover { background: var(--gray-200); }
        .lx-how-step::after {
          content: '';
          position: absolute;
          top: 0; left: 0;
          width: 2px; height: 0;
          background: var(--red);
          transition: height 0.4s var(--ease-out);
        }
        .lx-how-step:hover::after { height: 100%; }

        .lx-how-num {
          font-family: var(--font-head);
          font-size: 72px;
          font-weight: 900;
          line-height: 1;
          color: var(--gray-200);
          margin-bottom: 24px;
          display: block;
          letter-spacing: -0.04em;
          transition: color 0.3s;
        }
        .lx-how-step:hover .lx-how-num { color: rgba(221,24,59,0.1); }

        .lx-how-icon {
          font-size: 36px;
          margin-bottom: 20px;
          display: block;
        }
        .lx-how-title {
          font-family: var(--font-head);
          font-size: 20px;
          font-weight: 700;
          color: var(--black);
          margin-bottom: 12px;
        }
        .lx-how-body {
          font-size: 14px;
          color: var(--gray-600);
          line-height: 1.75;
          font-weight: 400;
        }

        /* ── PRODUCTS ─────────────────────────────────────────── */
        .lx-products-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 56px;
          gap: 32px;
          flex-wrap: wrap;
        }
        .lx-products-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 2px;
        }
        .lx-product-card {
          display: block;
          text-decoration: none;
          color: inherit;
          position: relative;
        }
        .lx-product-img-wrap {
          position: relative;
          aspect-ratio: 4/5;
          overflow: hidden;
          background: var(--gray-200);
        }
        .lx-product-img { transition: transform 0.9s var(--ease-out); }
        .lx-product-card:hover .lx-product-img { transform: scale(1.05); }
        .lx-product-placeholder {
          width: 100%; height: 100%;
          display: flex; align-items: center; justify-content: center;
          background: var(--gray-200);
        }
        .lx-placeholder-icon { font-size: 64px; opacity: 0.3; }
        .lx-product-overlay {
          position: absolute; inset: 0;
          background: rgba(15,15,15,0);
          display: flex; align-items: flex-end;
          padding: 32px;
          transition: background 0.35s;
        }
        .lx-product-card:hover .lx-product-overlay { background: rgba(15,15,15,0.45); }
        .lx-product-cta {
          font-family: var(--font-head);
          font-size: 11px; font-weight: 700;
          letter-spacing: 0.15em; text-transform: uppercase;
          color: var(--white);
          opacity: 0; transform: translateY(12px);
          transition: opacity 0.3s, transform 0.3s;
        }
        .lx-product-card:hover .lx-product-cta {
          opacity: 1; transform: translateY(0);
        }
        .lx-product-badge {
          position: absolute; top: 20px; left: 20px;
          background: var(--red); color: var(--white);
          font-family: var(--font-head);
          font-size: 9px; font-weight: 700;
          letter-spacing: 0.2em; text-transform: uppercase;
          padding: 5px 12px;
        }
        .lx-product-info {
          padding: 20px 0;
        }
        .lx-product-name {
          font-family: var(--font-head);
          font-size: 18px; font-weight: 700;
          color: var(--black); margin-bottom: 6px;
        }
        .lx-product-price {
          font-size: 13px; font-weight: 500;
          color: var(--gray-600);
        }

        /* ── PROOF / TESTIMONIALS ─────────────────────────────── */
        .lx-proof-inner {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 80px;
          align-items: center;
        }
        .lx-proof-left h2 { margin-bottom: 16px; }
        .lx-proof-left p {
          font-size: 16px; font-weight: 400;
          color: rgba(255,255,255,0.45);
          line-height: 1.8;
          margin-bottom: 36px;
          max-width: 420px;
        }

        .lx-proof-stats {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2px;
          margin-top: 48px;
        }
        .lx-proof-stat {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.06);
          padding: 28px 24px;
        }
        .lx-proof-stat-num {
          font-family: var(--font-head);
          font-size: 40px; font-weight: 900;
          line-height: 1; color: var(--red);
          letter-spacing: -0.03em;
          margin-bottom: 6px;
        }
        .lx-proof-stat-label {
          font-size: 11px; font-weight: 500;
          letter-spacing: 0.08em;
          color: rgba(255,255,255,0.35);
          text-transform: uppercase;
        }

        .lx-testimonial-slider { flex: 1; }
        .lx-testimonial-card {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.07);
          padding: 48px 40px;
          position: relative;
        }
        .lx-testimonial-card::before {
          content: '\u201C';
          position: absolute; top: 24px; left: 32px;
          font-family: var(--font-head);
          font-size: 80px; font-weight: 900;
          color: var(--red); opacity: 0.3; line-height: 1;
        }
        .lx-testimonial-quote {
          font-size: 18px; font-weight: 400;
          line-height: 1.75; color: var(--white);
          margin-bottom: 32px;
          font-style: italic;
          padding-top: 24px;
        }
        .lx-testimonial-meta {
          display: flex; align-items: center; gap: 16px;
        }
        .lx-testimonial-avatar {
          width: 44px; height: 44px;
          border-radius: 50%;
          background: var(--red);
          display: flex; align-items: center; justify-content: center;
          font-family: var(--font-head);
          font-size: 14px; font-weight: 700;
          color: var(--white); flex-shrink: 0;
        }
        .lx-testimonial-name {
          font-family: var(--font-head);
          font-size: 14px; font-weight: 700;
          color: var(--white);
        }
        .lx-testimonial-occasion {
          font-size: 11px; font-weight: 500;
          color: var(--red); letter-spacing: 0.1em;
          text-transform: uppercase; margin-top: 3px;
        }
        .lx-testimonial-dots {
          display: flex; gap: 8px; margin-top: 24px;
        }
        .lx-dot {
          width: 6px; height: 6px; border-radius: 50%;
          border: none; cursor: pointer;
          background: rgba(255,255,255,0.15);
          transition: background 0.2s, transform 0.2s;
          padding: 0;
        }
        .lx-dot.active {
          background: var(--red);
          transform: scale(1.4);
        }

        /* ── OCCASIONS ────────────────────────────────────────── */
        .lx-occasions-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 56px;
          flex-wrap: wrap;
          gap: 24px;
        }
        .lx-occasions-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 2px;
        }
        .lx-occasion-card {
          display: block; text-decoration: none;
          padding: 44px 28px;
          background: var(--white);
          border: 1px solid var(--gray-200);
          position: relative; overflow: hidden;
          transition: border-color 0.25s, transform 0.3s;
          group: true;
        }
        .lx-occasion-card::before {
          content: '';
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 0;
          background: var(--red);
          transition: height 0.35s var(--ease-out);
        }
        .lx-occasion-card:hover { border-color: transparent; transform: translateY(-2px); }
        .lx-occasion-card:hover::before { height: 3px; }
        .lx-occasion-icon {
          font-size: 40px; margin-bottom: 20px; display: block;
        }
        .lx-occasion-name {
          font-family: var(--font-head);
          font-size: 19px; font-weight: 700;
          color: var(--black); margin-bottom: 6px;
          display: block;
        }
        .lx-occasion-sub {
          font-size: 12px; font-weight: 500;
          color: var(--gray-400);
          display: flex; align-items: center; gap: 6px;
          transition: color 0.2s;
        }
        .lx-occasion-card:hover .lx-occasion-sub { color: var(--red); }

        /* ── CTA ──────────────────────────────────────────────── */
        .lx-cta-inner {
          text-align: center;
          max-width: 700px;
          margin: 0 auto;
        }
        .lx-cta-inner h2 {
          margin-bottom: 20px;
        }
        .lx-cta-inner p {
          font-size: 16px; font-weight: 300;
          color: rgba(255,255,255,0.45);
          line-height: 1.8; margin-bottom: 48px;
        }
        .lx-cta-actions {
          display: flex; gap: 14px;
          justify-content: center; flex-wrap: wrap;
        }

        /* ── RESPONSIVE ───────────────────────────────────────── */
        @media (max-width: 1024px) {
          .lx-how-grid { grid-template-columns: 1fr 1fr; }
          .lx-occasions-grid { grid-template-columns: repeat(2, 1fr); }
          .lx-proof-inner { grid-template-columns: 1fr; gap: 56px; }
        }
        @media (max-width: 768px) {
          .lx-section { padding: 80px 5vw; }
          .lx-how-grid { grid-template-columns: 1fr; }
          .lx-products-grid { grid-template-columns: 1fr; }
          .lx-occasions-grid { grid-template-columns: 1fr 1fr; }
          .lx-hero-h1 { font-size: clamp(36px, 10vw, 56px); }
          .lx-products-header { flex-direction: column; align-items: flex-start; }
        }
        @media (max-width: 480px) {
          .lx-occasions-grid { grid-template-columns: 1fr; }
          .lx-proof-stats { grid-template-columns: 1fr 1fr; }
          .lx-hero-actions { flex-direction: column; align-items: center; }
        }
      `}</style>

      <Grain />

      {/* ═══════════════════ HERO ═══════════════════ */}
      <section className="lx-hero" ref={heroRef}>
        <motion.div className="lx-hero-bg" style={{ scale: heroScale }}>
          {/* Placeholder background — replace with actual video/image */}
          <div
            style={{
              width: "100%",
              height: "100%",
              background:
                "radial-gradient(ellipse at 60% 40%, #1a0008 0%, #0F0F0F 70%)",
            }}
          />
          {/* Subtle red ambient glow */}
          <div
            style={{
              position: "absolute",
              top: "20%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "600px",
              height: "600px",
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(221,24,59,0.12) 0%, transparent 70%)",
              pointerEvents: "none",
            }}
          />
        </motion.div>

        <div className="lx-hero-vignette" />
        <div className="lx-hero-fade" />

        <motion.div
          className="lx-hero-content"
          style={{ opacity: heroOpacity }}
        >
          <motion.div
            className="lx-hero-eyebrow"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.1 }}
          >
            Personalised Gift Experiences
          </motion.div>

          <motion.h1
            className="lx-hero-h1"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.25 }}
          >
            Turn Memories Into{" "}
            <span className="lx-h1-accent">
              Unforgettable Gifts
            </span>
          </motion.h1>

          <motion.p
            className="lx-hero-sub"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.42 }}
          >
            We create personalised surprise boxes that make your loved ones smile,
            cry, and remember forever.
          </motion.p>

          <motion.div
            className="lx-hero-actions"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.58 }}
          >
            <Link href="/shop" className="lx-btn-red">
              Create Your Gift
            </Link>
            <Link href="/how-it-works" className="lx-btn-ghost">
              See How It Works
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          className="lx-hero-scroll"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <span className="lx-scroll-text">Scroll</span>
          <div className="lx-scroll-line" />
        </motion.div>
      </section>

      {/* ═══════════════════ HOW IT WORKS ═══════════════════ */}
      <section className="lx-section lx-section-light" ref={howRef}>
        <motion.div
          initial="hidden"
          animate={howInView ? "show" : "hidden"}
          variants={stagger}
        >
          <motion.div variants={fadeUp}>
            <Divider />
            <span className="lx-overline">How It Works</span>
            <h2 className="lx-h2">
              Simple steps to a<br />
              <em>perfect gift.</em>
            </h2>
          </motion.div>

          <motion.div className="lx-how-grid" variants={stagger}>
            {[
              {
                icon: "📷",
                num: "01",
                title: "Upload Your Photos",
                body: "Share the memories — photos, messages, and the moments that mean the most to you.",
              },
              {
                icon: "✂️",
                num: "02",
                title: "We Create Your Gift",
                body: "Our team handcrafts your personalised surprise box with care, precision, and love.",
              },
              {
                icon: "🎁",
                num: "03",
                title: "We Deliver the Surprise",
                body: "Beautifully packaged and delivered to their door. The reaction is always worth it.",
              },
            ].map((step) => (
              <motion.div key={step.num} className="lx-how-step" variants={fadeUp}>
                <span className="lx-how-num">{step.num}</span>
                <span className="lx-how-icon">{step.icon}</span>
                <h3 className="lx-how-title">{step.title}</h3>
                <p className="lx-how-body">{step.body}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════════════════ PRODUCTS ═══════════════════ */}
      <section className="lx-section lx-section-gray" ref={productsRef}>
        <motion.div
          initial="hidden"
          animate={productsInView ? "show" : "hidden"}
          variants={stagger}
        >
          <motion.div className="lx-products-header" variants={fadeUp}>
            <div>
              <Divider />
              <span className="lx-overline">Our Products</span>
              <h2 className="lx-h2">
                The Surprise<br />
                <em>Memory Box.</em>
              </h2>
              <p className="lx-section-intro">
                Handcrafted. Personalised. Delivered with love.
              </p>
            </div>
            <Link href="/shop" className="lx-btn-red">
              Browse All Gifts
            </Link>
          </motion.div>

          <motion.div className="lx-products-grid" variants={stagger}>
            {displayProducts.length > 0 ? (
              displayProducts.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))
            ) : (
              // Placeholder cards when no products loaded
              [
                { id: 1, slug: "#", name: "Ankara Tote Bag", base_price: "12500", image_url: null, is_new: true, category: "tote" },
                { id: 2, slug: "#", name: "Ankara Pouch", base_price: "7500", image_url: null, is_new: false, category: "pouch" },
              ].map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))
            )}
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════════════════ SOCIAL PROOF ═══════════════════ */}
      <section className="lx-section lx-section-dark" ref={proofRef}>
        <motion.div
          className="lx-proof-inner"
          initial="hidden"
          animate={proofInView ? "show" : "hidden"}
          variants={stagger}
        >
          <motion.div className="lx-proof-left" variants={fadeUp}>
            <Divider light />
            <span className="lx-overline">Real Reactions</span>
            <h2 className="lx-h2 lx-h2-light">
              "I've never seen her<br />
              <em>this happy 😭❤️"</em>
            </h2>
            <p>
              Every gift we send is a moment someone will talk about for years.
              These are the reactions that keep us going.
            </p>

            <div className="lx-proof-stats">
              {[
                { num: "500+", label: "Happy customers" },
                { num: "98%",  label: "Recommend us" },
                { num: "4.9★", label: "Average rating" },
                { num: "3–5d", label: "Delivery time" },
              ].map((s) => (
                <div key={s.label} className="lx-proof-stat">
                  <div className="lx-proof-stat-num">{s.num}</div>
                  <div className="lx-proof-stat-label">{s.label}</div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div variants={fadeUp}>
            <TestimonialSlider />
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════════════════ OCCASIONS ═══════════════════ */}
      <section className="lx-section lx-section-light" ref={occasionsRef}>
        <motion.div
          initial="hidden"
          animate={occasionsInView ? "show" : "hidden"}
          variants={stagger}
        >
          <motion.div className="lx-occasions-header" variants={fadeUp}>
            <div>
              <Divider />
              <span className="lx-overline">Shop by Occasion</span>
              <h2 className="lx-h2">
                Every celebration<br />
                <em>deserves a gift.</em>
              </h2>
            </div>
            <Link href="/shop" className="lx-btn-red-outline">
              View All Occasions
            </Link>
          </motion.div>

          <motion.div className="lx-occasions-grid" variants={stagger}>
            {[
              { icon: "🎂", name: "Birthday",    slug: "birthday",    sub: "Most gifted" },
              { icon: "💍", name: "Anniversary", slug: "anniversary", sub: "Celebrate love" },
              { icon: "❤️", name: "Valentine",   slug: "valentine",   sub: "For your person" },
              { icon: "🌸", name: "Mother's Day", slug: "mothers-day", sub: "Show appreciation" },
              { icon: "🎓", name: "Graduation",  slug: "graduation",  sub: "Big milestone" },
              { icon: "🤍", name: "Wedding",     slug: "wedding",     sub: "Forever gift" },
              { icon: "🏢", name: "Corporate",   slug: "corporate",   sub: "Bulk orders welcome" },
              { icon: "🎁", name: "Just Because", slug: "just-because", sub: "No reason needed" },
            ].map((o) => (
              <motion.div key={o.slug} variants={fadeUp}>
                <Link href={`/shop?tag=${o.slug}`} className="lx-occasion-card">
                  <span className="lx-occasion-icon">{o.icon}</span>
                  <span className="lx-occasion-name">{o.name}</span>
                  <span className="lx-occasion-sub">{o.sub} →</span>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════════════════ FINAL CTA ═══════════════════ */}
      <section className="lx-section lx-section-dark" ref={ctaRef}>
        <motion.div
          className="lx-cta-inner"
          initial="hidden"
          animate={ctaInView ? "show" : "hidden"}
          variants={stagger}
        >
          <motion.div variants={fadeUp}>
            <span className="lx-overline" style={{ display: "block", textAlign: "center" }}>
              Get Started Today
            </span>
            <h2
              className="lx-h2 lx-h2-light"
              style={{ textAlign: "center", fontSize: "clamp(36px, 5.5vw, 72px)" }}
            >
              Ready to make someone<br />
              <em>feel special?</em>
            </h2>
            <p>
              Order in minutes. Handcrafted with love in Benin City.
              Delivered across Nigeria in 3–5 days.
            </p>
          </motion.div>

          <motion.div className="lx-cta-actions" variants={fadeUp}>
            <Link href="/shop" className="lx-btn-red">
              Create Your Gift Now
            </Link>
            <Link href="/business" className="lx-btn-ghost">
              Corporate Orders →
            </Link>
          </motion.div>
        </motion.div>
      </section>
    </>
  );
}