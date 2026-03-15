"use client";

// Lensra — 2026 Premium Naija Atelier Edition
// Completely fresh layout & UI: Split hero with live product preview,
// clean vertical rhythm, generous whitespace, bold geometric typography,
// vibrant green + kola-orange energy. No more occasions section.
// Feels like a high-end Lagos/Benin City flagship store online.
// Fonts: Space Grotesk (headlines) + Satoshi (body) — add to globals.css
// --disp: "Space Grotesk", system-ui, sans-serif;
// --body: "Satoshi", system-ui, sans-serif;

import { useState, useEffect, useRef, useId } from "react";
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
  hidden: { opacity: 0, y: 60 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
};
const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
};

// ── Ankara Tile (bigger, bolder, modern) ─────────────────────────────────────
function AnkaraTile({ color = "#FF6B00", size = 120, opacity = 1 }: {
  color?: string; size?: number; opacity?: number;
}) {
  const h = size; const w = size;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} fill="none" xmlns="http://www.w3.org/2000/svg" style={{ opacity }}>
      <circle cx={w/2} cy={h/2} r={h*0.28} fill={color} />
      <circle cx={w/2} cy={h/2} r={h*0.42} fill="none" stroke={color} strokeWidth="3" />
      <line x1="0" y1={h/2} x2={w} y2={h/2} stroke={color} strokeWidth="2" />
      <line x1={w/2} y1="0" x2={w/2} y2={h} stroke={color} strokeWidth="2" />
    </svg>
  );
}

// ── Pattern (sparse & vibrant) ───────────────────────────────────────────────
function AnkaraPattern({ color = "#FF6B00", opacity = 0.08 }: {
  color?: string; opacity?: number;
}) {
  const uid = useId().replace(/:/g, "");
  const patternId = `ankara-${uid}`;
  return (
    <svg aria-hidden style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", opacity }} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id={patternId} x="0" y="0" width="92" height="92" patternUnits="userSpaceOnUse">
          <circle cx="46" cy="46" r="11" fill={color} />
          <line x1="0" y1="46" x2="92" y2="46" stroke={color} strokeWidth="1" />
          <line x1="46" y1="0" x2="46" y2="92" stroke={color} strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${patternId})`} />
    </svg>
  );
}

// ── Grain ────────────────────────────────────────────────────────────────────
function Grain() {
  return (
    <svg aria-hidden style={{ position: "fixed", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 9999, opacity: 0.015, mixBlendMode: "multiply" }}>
      <filter id="grain">
        <feTurbulence type="fractalNoise" baseFrequency="0.68" numOctaves="4" />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#grain)" />
    </svg>
  );
}

// ── Marquee (street-luxury energy) ───────────────────────────────────────────
function Marquee() {
  const items = ["BENIN CITY CRAFTED", "✦", "NAIJA PRIDE", "✦", "HAND EMBROIDERED", "✦", "DELIVERED NATIONWIDE", "✦", "YOUR NAME ON IT", "✦", "LENSRA 2026"];
  const repeated = [...items, ...items];
  return (
    <div className="ln-marquee">
      <motion.div className="ln-marquee-track" animate={{ x: ["0%", "-50%"] }} transition={{ duration: 20, ease: "linear", repeat: Infinity }}>
        {repeated.map((item, i) => (
          <span key={i} className={item === "✦" ? "ln-dot" : "ln-item"}>{item}</span>
        ))}
      </motion.div>
    </div>
  );
}

// ── Product Card (new premium look) ──────────────────────────────────────────
function ProductCard({ product }: { product: any }) {
  const imageUrl = getImageUrl(product.image_url);
  const isTote = product.category === "tote";

  return (
    <motion.div variants={fadeUp}>
      <Link href={`/shop/${product.slug}`} className="ln-card">
        <div className="ln-card-image">
          {product.is_trending && <div className="ln-badge hot">HOT</div>}
          {product.is_new && <div className="ln-badge new">NEW</div>}
          {imageUrl ? (
            <Image src={imageUrl} alt={product.name} fill sizes="(max-width: 768px) 100vw, 380px" className="ln-img" />
          ) : (
            <div className="ln-placeholder">
              <AnkaraTile color="#FF6B00" size={140} opacity={0.35} />
            </div>
          )}
          <div className="ln-overlay">
            <span>PERSONALISE →</span>
          </div>
        </div>
        <div className="ln-card-info">
          <div className="ln-cat">{isTote ? "TOTE BAG" : "POUCH"}</div>
          <h3 className="ln-name">{product.name}</h3>
          <div className="ln-price-row">
            <span className="ln-price">From {formatPrice(product.base_price || 0)}</span>
            <span className="ln-arrow">→</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

// ── Main Component (full, clean, modern) ─────────────────────────────────────
export default function ClientHomepage({ initialProducts }: { initialProducts: any[] }) {
  const [products] = useState(initialProducts);
  const [featured, setFeatured] = useState<any[]>([]);
  const [filter, setFilter] = useState<"all" | "tote" | "pouch">("all");

  const heroRef = useRef<HTMLElement>(null);
  const productsRef = useRef<HTMLDivElement>(null);
  const processRef = useRef<HTMLDivElement>(null);
  const whyRef = useRef<HTMLDivElement>(null);

  const productsInView = useInView(productsRef, { once: true });
  const processInView = useInView(processRef, { once: true });
  const whyInView = useInView(whyRef, { once: true });

  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "12%"]);

  useEffect(() => {
    fetch(`${BaseUrl}api/products/featured/`)
      .then(r => r.json())
      .then(d => {
        const list = d.results || d || [];
        setFeatured(list.filter((p: any) => ["tote", "pouch"].includes(p.category)));
      });
  }, []);

  const all = products.filter((p: any) => ["tote", "pouch"].includes(p.category));
  const filtered = filter === "all" ? all : all.filter((p: any) => p.category === filter);
  const display = filtered.length ? filtered : featured;

  return (
    <>
      <style>{`
        :root {
          --green: #0A3D2A;
          --orange: #FF6B00;
          --cream: #F8F1E3;
          --navy: #0F1C2E;
          --terra: #C14E2A;
        }

        /* HERO — Split luxury */
        .ln-hero {
          height: 100svh;
          background: var(--green);
          display: grid;
          grid-template-columns: 1fr 1fr;
          overflow: hidden;
          position: relative;
        }
        .ln-hero-bg { position: absolute; inset: 0; }
        .ln-hero-content {
          padding: 0 7vw;
          display: flex;
          flex-direction: column;
          justify-content: center;
          z-index: 2;
        }
        .ln-hero-overline {
          font-size: 11px; font-weight: 700; letter-spacing: 0.5em; color: var(--orange);
          margin-bottom: 16px;
        }
        .ln-hero-h1 {
          font-family: var(--disp); font-size: clamp(64px, 9vw, 152px); font-weight: 900;
          line-height: 0.84; letter-spacing: -0.06em; color: #fff;
        }
        .ln-hero-body {
          font-size: 18px; line-height: 1.7; color: rgba(255,255,255,0.85);
          max-width: 460px; margin: 32px 0 48px;
        }
        .ln-hero-buttons {
          display: flex; gap: 16px; flex-wrap: wrap;
        }
        .ln-btn {
          padding: 21px 48px; font-family: var(--body); font-size: 11px; font-weight: 700;
          letter-spacing: 0.3em; text-transform: uppercase; transition: all 0.3s;
        }
        .ln-btn-primary { background: var(--orange); color: #fff; }
        .ln-btn-primary:hover { transform: translateY(-4px); background: #ff8533; }
        .ln-btn-secondary { background: #fff; color: var(--navy); }

        /* Hero visual side */
        .ln-hero-visual {
          position: relative; display: flex; align-items: center; justify-content: center;
          background: var(--cream);
        }
        .ln-product-frame {
          width: 86%; max-width: 420px; aspect-ratio: 3/4;
          background: #fff; border: 18px solid var(--navy);
          box-shadow: 50px 60px 100px rgba(0,0,0,0.4);
          overflow: hidden; position: relative;
        }
        .ln-product-frame img, .ln-placeholder-frame {
          width: 100%; height: 100%; object-fit: cover;
        }
        .ln-name-float {
          position: absolute; bottom: 36px; left: 50%; transform: translateX(-50%);
          background: var(--navy); color: #fff; padding: 12px 36px;
          font-family: var(--disp); font-size: 18px; font-weight: 700;
        }

        /* Marquee */
        .ln-marquee {
          background: var(--orange); padding: 18px 0; overflow: hidden;
        }
        .ln-marquee-track { display: flex; white-space: nowrap; }
        .ln-item { font-size: 13px; font-weight: 700; letter-spacing: 0.35em; color: #fff; padding: 0 40px; }
        .ln-dot { color: rgba(255,255,255,0.35); font-size: 18px; }

        /* PRODUCTS */
        .ln-products {
          padding: 130px 6vw; background: var(--cream);
        }
        .ln-header {
          text-align: center; margin-bottom: 80px;
        }
        .ln-overline { font-size: 12px; font-weight: 700; letter-spacing: 0.45em; color: var(--orange); }
        .ln-h2 { font-family: var(--disp); font-size: clamp(46px, 6.5vw, 92px); font-weight: 900; line-height: 0.9; color: var(--navy); }
        .ln-filters {
          display: flex; justify-content: center; gap: 14px; flex-wrap: wrap; margin-top: 28px;
        }
        .ln-filter {
          padding: 13px 34px; border: 2px solid var(--navy); border-radius: 9999px;
          font-size: 11px; font-weight: 700; letter-spacing: 0.28em; cursor: pointer;
        }
        .ln-filter.active { background: var(--navy); color: var(--cream); }

        .ln-grid {
          display: grid; grid-template-columns: repeat(auto-fit, minmax(340px, 1fr)); gap: 36px;
        }

        /* Card */
        .ln-card {
          display: block; text-decoration: none; color: inherit; background: #fff;
          border: 1px solid #E5D9C0; overflow: hidden;
        }
        .ln-card-image {
          position: relative; aspect-ratio: 4/5; overflow: hidden;
        }
        .ln-img { transition: transform 0.95s cubic-bezier(0.23,1,0.32,1); }
        .ln-card:hover .ln-img { transform: scale(1.12); }
        .ln-badge {
          position: absolute; top: 24px; right: 24px; padding: 7px 16px;
          font-size: 9px; font-weight: 700; letter-spacing: 0.2em; color: #fff;
        }
        .ln-badge.hot { background: var(--terra); }
        .ln-badge.new { background: var(--green); }
        .ln-overlay {
          position: absolute; inset: 0; background: rgba(10,61,42,0.65);
          display: flex; align-items: flex-end; padding: 32px; opacity: 0; transition: opacity 0.4s;
        }
        .ln-card:hover .ln-overlay { opacity: 1; }
        .ln-overlay span {
          font-size: 12px; font-weight: 700; letter-spacing: 0.25em; color: #fff;
        }
        .ln-card-info { padding: 28px 24px 32px; }
        .ln-cat { font-size: 10px; font-weight: 700; letter-spacing: 0.4em; color: var(--orange); }
        .ln-name { font-family: var(--disp); font-size: 24px; font-weight: 900; color: var(--navy); margin: 8px 0 12px; }
        .ln-price-row { display: flex; justify-content: space-between; align-items: center; font-size: 15px; font-weight: 600; }

        /* PROCESS */
        .ln-process {
          padding: 130px 6vw; background: #fff; border-top: 1px solid #E5D9C0;
        }
        .ln-process-grid {
          display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 40px; margin-top: 70px;
        }
        .ln-step {
          text-align: center;
        }
        .ln-step-circle {
          width: 72px; height: 72px; border-radius: 9999px; background: var(--orange);
          margin: 0 auto 24px; display: flex; align-items: center; justify-content: center;
          font-family: var(--disp); font-size: 28px; font-weight: 900; color: #fff;
        }

        /* WHY */
        .ln-why {
          padding: 130px 6vw; background: var(--navy); color: #fff;
        }
        .ln-why-grid {
          display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 32px; margin-top: 64px;
        }
        .ln-why-card {
          background: rgba(255,255,255,0.06); padding: 40px 32px; border: 1px solid rgba(255,255,255,0.1);
        }
        .ln-why-icon { font-size: 42px; margin-bottom: 20px; }

        /* CTA */
        .ln-cta {
          padding: 130px 6vw; background: var(--orange); color: #fff; text-align: center;
        }
        .ln-cta h2 { font-family: var(--disp); font-size: clamp(48px, 7vw, 98px); font-weight: 900; line-height: 0.9; }

        @media (max-width: 920px) {
          .ln-hero { grid-template-columns: 1fr; }
          .ln-hero-visual { order: -1; min-height: 420px; }
          .ln-grid { grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); }
        }
      `}</style>

      <Grain />

      {/* HERO */}
      <section className="ln-hero" ref={heroRef}>
        <motion.div className="ln-hero-bg" style={{ y: heroY }}>
          <AnkaraPattern color="#FF6B00" opacity={0.09} />
        </motion.div>

        <div className="ln-hero-content">
          <motion.div className="ln-hero-overline" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
            BENIN CITY, NIGERIA • EST. 2024
          </motion.div>
          <motion.h1 className="ln-hero-h1" initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.9, ease: EASE }}>
            Your name.<br />Our fabric.<br />Pure Naija.
          </motion.h1>
          <motion.p className="ln-hero-body" initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}>
            Hand-embroidered tote bags &amp; pouches. Made in Benin City.<br />Delivered across Nigeria in 3–5 days.
          </motion.p>
          <motion.div className="ln-hero-buttons" initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.55 }}>
            <Link href="/shop?category=tote" className="ln-btn ln-btn-primary">SHOP TOTE BAGS</Link>
            <Link href="/shop?category=pouch" className="ln-btn ln-btn-secondary">EXPLORE POUChes</Link>
          </motion.div>
        </div>

        <div className="ln-hero-visual">
          <motion.div className="ln-product-frame" initial={{ scale: 0.85, rotate: -8 }} animate={{ scale: 1, rotate: 0 }} transition={{ duration: 1.2, ease: EASE }}>
            <div className="ln-placeholder-frame">
              <AnkaraTile color="#FF6B00" size={220} opacity={0.28} />
            </div>
            <div className="ln-name-float">CHIOMA • 2026</div>
          </motion.div>
        </div>
      </section>

      <Marquee />

      {/* PRODUCTS */}
      <section className="ln-products">
        <div className="ln-header">
          <div className="ln-overline">COLLECTION</div>
          <h2 className="ln-h2">Two icons.<br />Endless stories.</h2>
          <div className="ln-filters">
            {[
              { key: "all", label: `ALL (${all.length})` },
              { key: "tote", label: `TOTES (${all.filter(p => p.category === "tote").length})` },
              { key: "pouch", label: `POUCHES (${all.filter(p => p.category === "pouch").length})` },
            ].map(({ key, label }) => (
              <button key={key} onClick={() => setFilter(key as any)} className={`ln-filter ${filter === key ? "active" : ""}`}>
                {label}
              </button>
            ))}
          </div>
        </div>

        <motion.div ref={productsRef} className="ln-grid" variants={stagger} initial="hidden" animate={productsInView ? "show" : "hidden"}>
          {display.length > 0 ? (
            display.map((p: any) => <ProductCard key={p.id} product={p} />)
          ) : (
            <p style={{ gridColumn: "1/-1", textAlign: "center", fontSize: "32px", fontStyle: "italic", color: "#666" }}>New patterns arriving soon</p>
          )}
        </motion.div>
      </section>

      {/* PROCESS */}
      <section className="ln-process">
        <div className="ln-header" style={{ textAlign: "left", maxWidth: "620px" }}>
          <div className="ln-overline" style={{ color: "#FF6B00" }}>HOW IT WORKS</div>
          <h2 className="ln-h2" style={{ fontSize: "clamp(42px, 5.5vw, 78px)" }}>From your idea<br />to their hands in days.</h2>
        </div>

        <motion.div ref={processRef} className="ln-process-grid" variants={stagger} initial="hidden" animate={processInView ? "show" : "hidden"}>
          {[
            { num: "01", title: "Choose your style", desc: "Browse our curated Ankara patterns — bold, authentic, Nigerian." },
            { num: "02", title: "Add their name", desc: "Tell us the name + occasion. We embroider it by hand." },
            { num: "03", title: "We craft in Benin City", desc: "Cut, sewn, embroidered and gift-wrapped by our local artisans." },
            { num: "04", title: "Delivered nationwide", desc: "GIG Logistics. 3–5 days. Beautifully packaged." },
          ].map((step, i) => (
            <motion.div key={i} className="ln-step" variants={fadeUp}>
              <div className="ln-step-circle">{step.num}</div>
              <h4 style={{ fontFamily: "var(--disp)", fontSize: "22px", fontWeight: 900 }}>{step.title}</h4>
              <p style={{ marginTop: "16px", fontSize: "15px", lineHeight: 1.7, color: "#555" }}>{step.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* WHY LENSRA */}
      <section className="ln-why">
        <div className="ln-header" style={{ textAlign: "center", color: "#fff" }}>
          <div className="ln-overline" style={{ color: "#FF6B00" }}>WHY LENSRA</div>
          <h2 className="ln-h2" style={{ color: "#fff" }}>A gift they keep forever.</h2>
        </div>

        <motion.div ref={whyRef} className="ln-why-grid" variants={stagger} initial="hidden" animate={whyInView ? "show" : "hidden"}>
          {[
            { icon: "🇳🇬", title: "100% Nigerian", desc: "Fabric sourced in Lagos, embroidered in Benin City. Nothing imported." },
            { icon: "✍️", title: "Truly personal", desc: "Name embroidered directly into the fabric — permanent, not printed." },
            { icon: "🎁", title: "Gift-ready", desc: "Comes in a kraft box with tissue, handwritten note and tracking." },
          ].map((item, i) => (
            <motion.div key={i} className="ln-why-card" variants={fadeUp}>
              <div className="ln-why-icon">{item.icon}</div>
              <h3 style={{ fontFamily: "var(--disp)", fontSize: "26px", fontWeight: 900 }}>{item.title}</h3>
              <p style={{ marginTop: "16px", opacity: 0.85 }}>{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* FINAL CTA */}
      <section className="ln-cta">
        <motion.h2 className="ln-h2" style={{ color: "#fff" }} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}>
          Give something<br />they'll never forget.
        </motion.h2>
        <p style={{ fontSize: "18px", maxWidth: "560px", margin: "24px auto", opacity: 0.9 }}>
          Order in 60 seconds. Made by hand. Delivered across Nigeria.
        </p>
        <div style={{ marginTop: "48px", display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/shop" className="ln-btn" style={{ background: "#fff", color: "var(--orange)", padding: "21px 52px" }}>
            BROWSE ALL GIFTS
          </Link>
          <Link href="/business" className="ln-btn" style={{ border: "2px solid #fff", color: "#fff" }}>
            CORPORATE ORDERS
          </Link>
        </div>
      </section>
    </>
  );
}