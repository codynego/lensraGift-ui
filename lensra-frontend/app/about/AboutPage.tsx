"use client";

// app/about/page.tsx
// Lensra — About page
// Design: editorial magazine layout, bold asymmetric, culturally Nigerian
// Fonts: Playfair Display · Syne (from globals.css)
// Sections: hero statement · the gap we saw · how we work · values · Nigeria · CTA

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";

// ── Animation variants ────────────────────────────────────────────────────────

const EASE = [0.16, 1, 0.3, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 36 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
};

// ── Ankara SVG pattern ────────────────────────────────────────────────────────

function AnkaraPattern({ opacity = 0.06, light = false }: {
  opacity?: number; light?: boolean;
}) {
  const color = light ? "#F5F0E8" : "#C17B3A";
  return (
    <svg aria-hidden style={{
      position: "absolute", inset: 0, width: "100%", height: "100%",
      pointerEvents: "none", opacity,
    }}>
      <defs>
        <pattern id="about-ap" x="0" y="0" width="56" height="56"
          patternUnits="userSpaceOnUse">
          <circle cx="28" cy="28" r="4.5" fill={color} />
          <circle cx="28" cy="28" r="10"  fill="none" stroke={color} strokeWidth="0.7" />
          <circle cx="28" cy="28" r="17"  fill="none" stroke={color} strokeWidth="0.4" />
          <circle cx="28" cy="28" r="24"  fill="none" stroke={color} strokeWidth="0.25" />
          <line x1="0"  y1="28" x2="56" y2="28" stroke={color} strokeWidth="0.25" />
          <line x1="28" y1="0"  x2="28" y2="56" stroke={color} strokeWidth="0.25" />
          <line x1="0"  y1="0"  x2="56" y2="56" stroke={color} strokeWidth="0.18" />
          <line x1="56" y1="0"  x2="0"  y2="56" stroke={color} strokeWidth="0.18" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#about-ap)" />
    </svg>
  );
}

// ── Section reveal wrapper ─────────────────────────────────────────────────────

function Reveal({ children, className = "" }: {
  children: React.ReactNode; className?: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      className={className}
      variants={stagger}
      initial="hidden"
      animate={inView ? "show" : "hidden"}
    >
      {children}
    </motion.div>
  );
}

// ── Stat card ─────────────────────────────────────────────────────────────────

function Stat({ num, label, sub }: { num: string; label: string; sub: string }) {
  return (
    <motion.div variants={fadeUp} className="ab-stat">
      <span className="ab-stat-num">{num}</span>
      <span className="ab-stat-label">{label}</span>
      <span className="ab-stat-sub">{sub}</span>
    </motion.div>
  );
}

// ── Value card ────────────────────────────────────────────────────────────────

function Value({ n, title, body }: { n: string; title: string; body: string }) {
  return (
    <motion.div variants={fadeUp} className="ab-value-card">
      <span className="ab-value-num">{n}</span>
      <h3 className="ab-value-title">{title}</h3>
      <p className="ab-value-body">{body}</p>
    </motion.div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function AboutPage() {
  return (
    <>
      <style>{`

        /* ── PAGE HERO ── */
        .ab-hero {
          background: var(--indigo-d);
          min-height: 90svh;
          display: flex; flex-direction: column;
          justify-content: flex-end;
          padding: 140px 6vw 80px;
          position: relative; overflow: hidden;
        }

        .ab-hero-overline {
          font-size: 10px; font-weight: 700;
          letter-spacing: 0.42em; text-transform: uppercase;
          color: var(--amber);
          display: flex; align-items: center; gap: 14px;
          margin-bottom: 32px; position: relative; z-index: 1;
        }
        .ab-hero-overline::before {
          content: ''; width: 28px; height: 2px;
          background: var(--amber); flex-shrink: 0;
        }

        .ab-hero-h1 {
          font-family: var(--disp);
          font-size: clamp(52px, 8vw, 128px);
          font-weight: 900; line-height: 0.88;
          letter-spacing: -0.03em; color: var(--cream);
          max-width: 900px;
          position: relative; z-index: 1;
        }
        .ab-hero-h1 em {
          font-style: italic; font-weight: 400;
          color: var(--amber); display: block;
        }

        /* Big ghost outline text */
        .ab-hero-ghost {
          position: absolute; right: -2vw; bottom: -20px;
          font-family: var(--disp);
          font-size: clamp(80px, 14vw, 200px);
          font-weight: 900; font-style: italic;
          -webkit-text-stroke: 1.5px rgba(193,123,58,0.18);
          color: transparent;
          pointer-events: none; user-select: none;
          line-height: 1; letter-spacing: -0.04em;
          z-index: 0;
        }

        /* Terracotta slash accent */
        .ab-hero-slash {
          position: absolute; top: 0; right: 0;
          width: 32%; height: 100%;
          background: var(--terra);
          clip-path: polygon(22% 0, 100% 0, 100% 100%, 0% 100%);
          z-index: 0; overflow: hidden;
        }

        .ab-hero-left-bar {
          position: absolute; left: 0; top: 0; bottom: 0;
          width: 4px; background: var(--amber); z-index: 2;
        }

        .ab-hero-body {
          font-size: clamp(15px, 1.4vw, 18px);
          font-weight: 400; line-height: 1.85;
          color: rgba(232,213,176,0.6);
          max-width: 480px;
          margin-top: 32px;
          position: relative; z-index: 1;
        }

        /* ── STATS STRIP ── */
        .ab-stats-strip {
          background: var(--amber);
          display: grid; grid-template-columns: repeat(4, 1fr);
          position: relative; overflow: hidden;
        }
        .ab-stats-strip::before {
          content: 'EST. 2024';
          position: absolute; right: 3vw; top: 50%;
          transform: translateY(-50%);
          font-family: var(--disp);
          font-size: clamp(32px, 6vw, 80px);
          font-weight: 900; font-style: italic;
          color: rgba(0,0,0,0.07);
          pointer-events: none; user-select: none;
          letter-spacing: -0.03em; line-height: 1;
        }
        .ab-stat {
          padding: 36px 5vw;
          border-right: 1px solid rgba(255,255,255,0.15);
          position: relative; z-index: 1;
        }
        .ab-stat:last-child { border-right: none; }
        .ab-stat-num {
          font-family: var(--disp);
          font-size: clamp(36px, 4vw, 56px);
          font-weight: 900; color: #fff;
          line-height: 1; display: block; margin-bottom: 4px;
        }
        .ab-stat-label {
          font-size: 11px; font-weight: 700;
          letter-spacing: 0.22em; text-transform: uppercase;
          color: rgba(255,255,255,0.8); display: block;
        }
        .ab-stat-sub {
          font-size: 11px; font-weight: 400;
          color: rgba(255,255,255,0.5); display: block; margin-top: 2px;
        }

        /* ── THE GAP SECTION ── */
        .ab-gap-section {
          background: var(--cream);
          padding: 100px 6vw;
          display: grid;
          grid-template-columns: 1fr 1.2fr;
          gap: 80px; align-items: center;
        }
        .ab-gap-left { position: relative; }
        .ab-gap-overline {
          font-size: 10px; font-weight: 700;
          letter-spacing: 0.42em; text-transform: uppercase;
          color: var(--amber); margin-bottom: 16px;
          display: flex; align-items: center; gap: 12px;
        }
        .ab-gap-overline::before {
          content: ''; width: 20px; height: 2px;
          background: var(--amber); flex-shrink: 0;
        }
        .ab-gap-h2 {
          font-family: var(--disp);
          font-size: clamp(36px, 4vw, 60px);
          font-weight: 900; line-height: 0.92;
          letter-spacing: -0.02em; color: var(--indigo);
          margin-bottom: 32px;
        }
        .ab-gap-h2 em { font-style: italic; font-weight: 400; color: var(--amber); }

        /* Large pull quote on the left */
        .ab-gap-quote {
          font-family: var(--disp);
          font-size: clamp(18px, 2vw, 24px);
          font-weight: 400; font-style: italic;
          color: var(--muted); line-height: 1.6;
          border-left: 3px solid var(--amber);
          padding-left: 20px;
          margin-top: 32px;
        }

        .ab-gap-right { display: flex; flex-direction: column; gap: 24px; }
        .ab-gap-p {
          font-size: 15px; font-weight: 400;
          color: var(--muted); line-height: 1.9;
        }
        .ab-gap-p strong { color: var(--indigo); font-weight: 600; }

        /* Highlighted callout box */
        .ab-callout {
          background: var(--indigo);
          padding: 28px 32px;
          position: relative; overflow: hidden;
        }
        .ab-callout-text {
          font-family: var(--disp);
          font-size: clamp(18px, 2vw, 22px);
          font-weight: 700; color: var(--cream);
          line-height: 1.4; position: relative; z-index: 1;
        }
        .ab-callout-text em { color: var(--amber); font-style: italic; }

        /* ── HOW WE WORK ── */
        .ab-how-section {
          background: var(--cocoa);
          padding: 100px 6vw;
          position: relative; overflow: hidden;
        }
        .ab-how-overline {
          font-size: 10px; font-weight: 700;
          letter-spacing: 0.42em; text-transform: uppercase;
          color: var(--amber); margin-bottom: 16px;
          display: flex; align-items: center; gap: 12px;
        }
        .ab-how-overline::before {
          content: ''; width: 20px; height: 2px;
          background: var(--amber); flex-shrink: 0;
        }
        .ab-how-h2 {
          font-family: var(--disp);
          font-size: clamp(36px, 4vw, 60px);
          font-weight: 900; line-height: 0.92;
          letter-spacing: -0.02em; color: var(--cream);
          margin-bottom: 64px;
        }
        .ab-how-h2 em { font-style: italic; font-weight: 400; color: var(--amber); }

        /* Horizontal process steps — asymmetric */
        .ab-how-steps {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 2px;
        }
        .ab-how-step {
          background: rgba(255,255,255,0.03);
          border-top: 3px solid transparent;
          padding: 36px 24px;
          transition: border-color 0.3s;
        }
        .ab-how-step:hover { border-color: var(--amber); }
        .ab-how-step:nth-child(even) { margin-top: 40px; }
        .ab-how-step-num {
          font-family: var(--disp);
          font-size: 72px; font-weight: 900; font-style: italic;
          color: rgba(193,123,58,0.12); line-height: 1;
          margin-bottom: 16px; display: block;
        }
        .ab-how-step h4 {
          font-family: var(--disp);
          font-size: 22px; font-weight: 700;
          color: var(--cream); margin-bottom: 12px;
        }
        .ab-how-step p {
          font-size: 13px; font-weight: 400;
          color: rgba(232,213,176,0.45); line-height: 1.85;
        }

        /* ── VALUES ── */
        .ab-values-section {
          background: var(--cream-l);
          padding: 100px 6vw;
          border-top: 1px solid var(--rule);
        }
        .ab-values-header {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px; align-items: end;
          margin-bottom: 60px;
        }
        .ab-values-overline {
          font-size: 10px; font-weight: 700;
          letter-spacing: 0.42em; text-transform: uppercase;
          color: var(--amber); margin-bottom: 16px;
          display: flex; align-items: center; gap: 12px;
        }
        .ab-values-overline::before {
          content: ''; width: 20px; height: 2px;
          background: var(--amber); flex-shrink: 0;
        }
        .ab-values-h2 {
          font-family: var(--disp);
          font-size: clamp(36px, 4vw, 60px);
          font-weight: 900; line-height: 0.92;
          letter-spacing: -0.02em; color: var(--indigo);
        }
        .ab-values-h2 em { font-style: italic; font-weight: 400; color: var(--amber); }
        .ab-values-desc {
          font-size: 15px; font-weight: 400;
          color: var(--muted); line-height: 1.85;
        }

        .ab-values-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2px;
        }
        .ab-value-card {
          background: #fff; padding: 40px 32px;
          border-top: 2px solid transparent;
          transition: border-color 0.25s;
          position: relative;
        }
        .ab-value-card:hover { border-color: var(--amber); }
        .ab-value-num {
          font-family: var(--disp);
          font-size: 80px; font-weight: 900; font-style: italic;
          color: rgba(193,123,58,0.08); line-height: 1;
          display: block; margin-bottom: 12px;
        }
        .ab-value-title {
          font-family: var(--disp);
          font-size: 26px; font-weight: 700;
          color: var(--indigo); margin-bottom: 12px;
        }
        .ab-value-body {
          font-size: 14px; font-weight: 400;
          color: var(--muted); line-height: 1.85;
        }

        /* ── NIGERIA SECTION ── */
        .ab-nigeria-section {
          background: var(--terra);
          padding: 100px 6vw;
          position: relative; overflow: hidden;
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          gap: 80px; align-items: center;
        }
        .ab-nigeria-left { position: relative; z-index: 1; }
        .ab-nigeria-overline {
          font-size: 10px; font-weight: 700;
          letter-spacing: 0.42em; text-transform: uppercase;
          color: rgba(255,255,255,0.6); margin-bottom: 16px;
          display: flex; align-items: center; gap: 12px;
        }
        .ab-nigeria-overline::before {
          content: ''; width: 20px; height: 2px;
          background: rgba(255,255,255,0.5); flex-shrink: 0;
        }
        .ab-nigeria-h2 {
          font-family: var(--disp);
          font-size: clamp(40px, 5vw, 72px);
          font-weight: 900; line-height: 0.9;
          letter-spacing: -0.03em; color: #fff;
          margin-bottom: 28px;
        }
        .ab-nigeria-h2 em {
          font-style: italic; font-weight: 400;
          -webkit-text-stroke: 1.5px rgba(255,255,255,0.5);
          color: transparent; display: block;
        }
        .ab-nigeria-body {
          font-size: 15px; font-weight: 400;
          color: rgba(255,255,255,0.65); line-height: 1.9;
        }
        .ab-nigeria-right {
          position: relative; z-index: 1;
          display: flex; flex-direction: column; gap: 3px;
        }
        .ab-nigeria-fact {
          background: rgba(0,0,0,0.15);
          padding: 24px 28px;
          border-left: 3px solid rgba(255,255,255,0.3);
        }
        .ab-nigeria-fact-num {
          font-family: var(--disp);
          font-size: 32px; font-weight: 900;
          color: #fff; line-height: 1; display: block;
        }
        .ab-nigeria-fact-label {
          font-size: 12px; font-weight: 600;
          letter-spacing: 0.18em; text-transform: uppercase;
          color: rgba(255,255,255,0.55); display: block; margin-top: 4px;
        }

        /* ── CTA ── */
        .ab-cta-section {
          background: var(--indigo);
          padding: 100px 6vw;
          display: flex; align-items: center;
          justify-content: space-between;
          gap: 48px; flex-wrap: wrap;
          position: relative; overflow: hidden;
        }
        .ab-cta-section::before {
          content: 'LENSRA';
          position: absolute; right: -1vw; top: 50%;
          transform: translateY(-50%);
          font-family: var(--disp);
          font-size: clamp(80px, 14vw, 180px);
          font-weight: 900; font-style: italic;
          color: rgba(193,123,58,0.07);
          pointer-events: none; user-select: none;
          letter-spacing: -0.04em; line-height: 1;
        }
        .ab-cta-left { max-width: 560px; position: relative; z-index: 1; }
        .ab-cta-h2 {
          font-family: var(--disp);
          font-size: clamp(36px, 4.5vw, 64px);
          font-weight: 900; line-height: 0.92;
          letter-spacing: -0.03em; color: var(--cream);
          margin-bottom: 16px;
        }
        .ab-cta-h2 em { font-style: italic; font-weight: 400; color: var(--amber); }
        .ab-cta-body {
          font-size: 15px; font-weight: 400;
          color: rgba(232,213,176,0.55); line-height: 1.85;
        }
        .ab-cta-actions {
          display: flex; flex-direction: column;
          gap: 10px; min-width: 220px;
          position: relative; z-index: 1;
        }
        .ab-btn-primary {
          display: block; text-align: center;
          background: var(--amber); color: #fff;
          padding: 18px 36px;
          font-size: 11px; font-weight: 800;
          letter-spacing: 0.26em; text-transform: uppercase;
          text-decoration: none;
          transition: background 0.2s, transform 0.15s;
        }
        .ab-btn-primary:hover { background: var(--amber-l); transform: translateY(-1px); }
        .ab-btn-sec {
          display: block; text-align: center;
          border: 1.5px solid rgba(193,123,58,0.3);
          color: rgba(193,123,58,0.65);
          padding: 18px 36px;
          font-size: 11px; font-weight: 600;
          letter-spacing: 0.22em; text-transform: uppercase;
          text-decoration: none;
          transition: border-color 0.2s, color 0.2s;
        }
        .ab-btn-sec:hover { border-color: var(--amber); color: var(--amber-l); }

        /* ── RESPONSIVE ── */
        @media (max-width: 1100px) {
          .ab-how-steps { grid-template-columns: 1fr 1fr; }
          .ab-how-step:nth-child(even) { margin-top: 0; }
          .ab-values-grid { grid-template-columns: 1fr 1fr; }
          .ab-nigeria-section { grid-template-columns: 1fr; }
          .ab-stats-strip { grid-template-columns: 1fr 1fr; }
        }
        @media (max-width: 768px) {
          .ab-gap-section { grid-template-columns: 1fr; gap: 40px; }
          .ab-values-header { grid-template-columns: 1fr; gap: 24px; }
          .ab-values-grid { grid-template-columns: 1fr; }
          .ab-how-steps { grid-template-columns: 1fr; }
          .ab-cta-section { flex-direction: column; }
          .ab-cta-actions { width: 100%; }
          .ab-hero-slash { display: none; }
        }
        @media (max-width: 520px) {
          .ab-stats-strip { grid-template-columns: 1fr 1fr; }
          .ab-stat { padding: 24px 5vw; }
        }
      `}</style>

      {/* ═══════════ HERO ═══════════ */}
      <section className="ab-hero">
        <AnkaraPattern opacity={0.055} />
        <div className="ab-hero-slash">
          <AnkaraPattern light opacity={0.06} />
        </div>
        <div className="ab-hero-left-bar" />
        <div className="ab-hero-ghost">Lensra.</div>

        <motion.div
          className="ab-hero-overline"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: EASE, delay: 0.1 }}
        >
          Our Story · Benin City, Nigeria
        </motion.div>

        <motion.h1
          className="ab-hero-h1"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: EASE, delay: 0.22 }}
        >
          We saw a gap.
          <em>We filled it.</em>
        </motion.h1>

        <motion.p
          className="ab-hero-body"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.42 }}
        >
          Nigeria has 220 million people who love to celebrate. We couldn't find
          a single premium personalised gift brand that felt truly Nigerian.
          So we built one — from Benin City, for the whole country.
        </motion.p>
      </section>

      {/* ═══════════ STATS ═══════════ */}
      <Reveal>
        <div className="ab-stats-strip">
          <Stat num="500+"  label="Happy customers"    sub="And growing every week"       />
          <Stat num="100%"  label="Handmade"           sub="Every single order"           />
          <Stat num="3–5d"  label="Nationwide delivery"sub="Via GIG Logistics"            />
          <Stat num="2024"  label="Est. in Benin City" sub="Proudly Nigerian from day one"/>
        </div>
      </Reveal>

      {/* ═══════════ THE GAP WE SAW ═══════════ */}
      <section className="ab-gap-section">
        <Reveal>
          <div className="ab-gap-left">
            <div className="ab-gap-overline">The Problem</div>
            <h2 className="ab-gap-h2">
              Nigerian gifts<br />deserved<br /><em>better.</em>
            </h2>
            <blockquote className="ab-gap-quote">
              "Walk into any gift shop in Nigeria and you'll find imported mugs,
              generic teddy bears, and mass-produced items with no soul.
              Nothing that says — this was made for you, here, by someone who cares."
            </blockquote>
          </div>
        </Reveal>

        <Reveal>
          <div className="ab-gap-right">
            <p className="ab-gap-p">
              Nigerians are <strong>deeply celebratory people.</strong> Birthdays, weddings,
              graduations, child dedications — every milestone is a big deal. The culture
              of showing up for the people you love is embedded in who we are.
            </p>
            <p className="ab-gap-p">
              But the gifting market hadn't caught up. The options were either
              <strong> cheap and generic</strong> or <strong>expensive and imported</strong>
              — neither of which felt right for the occasion or the person receiving them.
            </p>
            <p className="ab-gap-p">
              We saw an opportunity to do something different. To take authentic Nigerian
              Ankara fabric — one of the most recognised and celebrated symbols of our
              culture — and turn it into a personalised gift that feels premium, intentional,
              and unmistakably ours.
            </p>
            <div className="ab-callout">
              <AnkaraPattern light opacity={0.05} />
              <p className="ab-callout-text">
                Every Lensra bag is embroidered with the recipient's name.
                Not printed. Not stickered. <em>Stitched in permanently.</em>
              </p>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ═══════════ HOW WE WORK ═══════════ */}
      <section className="ab-how-section">
        <AnkaraPattern opacity={0.04} />
        <Reveal>
          <div className="ab-how-overline">How We Work</div>
          <h2 className="ab-how-h2">
            Made to order.<br /><em>Every single time.</em>
          </h2>
        </Reveal>

        <Reveal>
          <div className="ab-how-steps">
            {[
              {
                n: "01",
                title: "You order",
                body: "You pick your Ankara pattern, tell us the name to embroider, and pay securely via Paystack. Takes two minutes.",
              },
              {
                n: "02",
                title: "We source",
                body: "We source the freshest Ankara fabric from Benin City markets — every order is cut fresh. Nothing sits in stock for weeks.",
              },
              {
                n: "03",
                title: "We craft",
                body: "Our seamstress cuts, sews, and lines your bag. Our embroidery partner stitches the name directly onto the fabric. Every piece is inspected before packaging.",
              },
              {
                n: "04",
                title: "We deliver",
                body: "Packaged in kraft tissue with a handwritten-feel card and shipped via GIG Logistics. Trackable, insured, and at your door in 3–5 days.",
              },
            ].map(step => (
              <motion.div key={step.n} className="ab-how-step" variants={fadeUp}>
                <span className="ab-how-step-num">{step.n}</span>
                <h4>{step.title}</h4>
                <p>{step.body}</p>
              </motion.div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* ═══════════ VALUES ═══════════ */}
      <section className="ab-values-section">
        <Reveal>
          <div className="ab-values-header">
            <div>
              <div className="ab-values-overline">What We Stand For</div>
              <h2 className="ab-values-h2">
                Three things we<br /><em>will not compromise.</em>
              </h2>
            </div>
            <p className="ab-values-desc">
              These aren't values we wrote for a website. They're the decisions
              we make every day — about which fabric to use, how to package an
              order, how to respond to a customer at 10pm on a Friday.
            </p>
          </div>
        </Reveal>

        <Reveal>
          <div className="ab-values-grid">
            <Value
              n="01"
              title="Genuine craft"
              body="Every bag is made to order. We don't hold finished stock and slap a name on it. Your order triggers a production process that begins with fresh fabric and ends with your person's name stitched in. That's not scalable in the traditional sense — and we're fine with that."
            />
            <Value
              n="02"
              title="Honest pricing"
              body="We charge a fair price for a handmade, personalised product. We don't inflate prices to look premium, and we don't cut corners to look affordable. What you pay reflects what actually goes into making your order — fabric, craft, embroidery, packaging, and delivery."
            />
            <Value
              n="03"
              title="Nigerian identity"
              body="Ankara isn't a trend for us. It's the fabric of our culture — literally. We source locally, produce locally, and deliver locally. Every Lensra bag is a small act of pride in what Nigeria makes and what Nigerian hands can do."
            />
          </div>
        </Reveal>
      </section>

      {/* ═══════════ NIGERIA ═══════════ */}
      <section className="ab-nigeria-section">
        <AnkaraPattern light opacity={0.06} />

        <div className="ab-nigeria-left">
          <div className="ab-nigeria-overline">Made Here. For Here.</div>
          <h2 className="ab-nigeria-h2">
            Benin City
            <em>to your door.</em>
          </h2>
          <p className="ab-nigeria-body">
            We're based in Benin City, Edo State — and we're proud of it.
            Every bag starts at a market stall in this city. Every stitch is
            made by a skilled craftsperson in this city. Every order ships from
            this city to every corner of Nigeria.
          </p>
          <p className="ab-nigeria-body" style={{ marginTop: 16 }}>
            We don't outsource production to China. We don't import fabric and
            rebrand it. We don't use Ankara as an aesthetic while the actual
            work happens elsewhere. Lensra is Nigerian from the first thread
            to the last delivery scan.
          </p>
        </div>

        <Reveal>
          <div className="ab-nigeria-right">
            {[
              { num: "🇳🇬",  label: "Proudly Nigerian, always"          },
              { num: "Benin City", label: "Where every bag is made"     },
              { num: "36+",  label: "States we deliver to"              },
              { num: "0",    label: "Imported products. Ever."          },
            ].map(f => (
              <motion.div key={f.label} className="ab-nigeria-fact" variants={fadeUp}>
                <span className="ab-nigeria-fact-num">{f.num}</span>
                <span className="ab-nigeria-fact-label">{f.label}</span>
              </motion.div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* ═══════════ CTA ═══════════ */}
      <section className="ab-cta-section">
        <AnkaraPattern opacity={0.04} />
        <div className="ab-cta-left">
          <h2 className="ab-cta-h2">
            Ready to give
            <br />
            <em>something real?</em>
          </h2>
          <p className="ab-cta-body">
            Browse our Ankara tote bags and pouches. Pick a pattern,
            tell us a name, and we'll handle the rest.
          </p>
        </div>
        <div className="ab-cta-actions">
          <Link href="/shop" className="ab-btn-primary">
            Shop All Products
          </Link>
          <Link href="/business" className="ab-btn-sec">
            Corporate Orders →
          </Link>
        </div>
      </section>
    </>
  );
}