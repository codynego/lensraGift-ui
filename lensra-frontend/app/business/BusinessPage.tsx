"use client";

// app/business/page.tsx
// Lensra — Business / Corporate page
// Design: bold Nigerian editorial, matches homepage energy
// Fonts: Playfair Display · Syne (from globals.css)
// Sections: hero · why corporate · pricing tiers · how it works · form · contact strip

import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import {
  Package, Users, Zap, ShieldCheck,
  Truck, CheckCircle, Mail, Phone,
  MapPin, Building2, ArrowRight,
} from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────────────────

interface FormState {
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  productType: string;
  quantity: string;
  occasion: string;
  message: string;
}

// ── Animation ─────────────────────────────────────────────────────────────────

const EASE = [0.16, 1, 0.3, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 36 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.75, ease: EASE } },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.11, delayChildren: 0.05 } },
};

// ── Ankara pattern ────────────────────────────────────────────────────────────

function AnkaraPattern({ opacity = 0.06, light = false }: {
  opacity?: number; light?: boolean;
}) {
  const c = light ? "#F5F0E8" : "#C17B3A";
  return (
    <svg aria-hidden style={{
      position: "absolute", inset: 0, width: "100%", height: "100%",
      pointerEvents: "none", opacity,
    }}>
      <defs>
        <pattern id="biz-ap" x="0" y="0" width="52" height="52"
          patternUnits="userSpaceOnUse">
          <circle cx="26" cy="26" r="4"  fill={c} />
          <circle cx="26" cy="26" r="9"  fill="none" stroke={c} strokeWidth="0.6" />
          <circle cx="26" cy="26" r="16" fill="none" stroke={c} strokeWidth="0.35" />
          <circle cx="26" cy="26" r="22" fill="none" stroke={c} strokeWidth="0.2" />
          <line x1="0"  y1="26" x2="52" y2="26" stroke={c} strokeWidth="0.22" />
          <line x1="26" y1="0"  x2="26" y2="52" stroke={c} strokeWidth="0.22" />
          <line x1="0"  y1="0"  x2="52" y2="52" stroke={c} strokeWidth="0.15" />
          <line x1="52" y1="0"  x2="0"  y2="52" stroke={c} strokeWidth="0.15" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#biz-ap)" />
    </svg>
  );
}

// ── Reveal wrapper ────────────────────────────────────────────────────────────

function Reveal({ children, className = "" }: {
  children: React.ReactNode; className?: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-70px" });
  return (
    <motion.div ref={ref} className={className}
      variants={stagger} initial="hidden"
      animate={inView ? "show" : "hidden"}>
      {children}
    </motion.div>
  );
}

// ── Benefit card ──────────────────────────────────────────────────────────────

function BenefitCard({ icon: Icon, title, body, index }: {
  icon: any; title: string; body: string; index: number;
}) {
  const isOffset = index % 3 === 1;
  return (
    <motion.div variants={fadeUp}
      style={{ marginTop: isOffset ? "36px" : 0 }}
      className="biz-benefit-card">
      <div className="biz-benefit-icon">
        <Icon size={22} />
      </div>
      <h3 className="biz-benefit-title">{title}</h3>
      <p className="biz-benefit-body">{body}</p>
    </motion.div>
  );
}

// ── Pricing tier ──────────────────────────────────────────────────────────────

function PricingTier({ label, range, discount, featured }: {
  label: string; range: string; discount: string; featured?: boolean;
}) {
  return (
    <motion.div variants={fadeUp}
      className={`biz-tier ${featured ? "biz-tier-featured" : ""}`}>
      {featured && <div className="biz-tier-badge">Most Popular</div>}
      <span className="biz-tier-label">{label}</span>
      <span className="biz-tier-discount">{discount}</span>
      <span className="biz-tier-off">off total order</span>
      <div className="biz-tier-range">
        <CheckCircle size={12} />
        {range}
      </div>
    </motion.div>
  );
}

// ── Form input ────────────────────────────────────────────────────────────────

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="biz-field">
      <label className="biz-field-label">{label}</label>
      {children}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function BusinessPage() {
  const [form, setForm] = useState<FormState>({
    companyName: "", contactName: "", email: "", phone: "",
    productType: "", quantity: "", occasion: "", message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    // Replace with your actual form submission endpoint
    await new Promise(r => setTimeout(r, 1000));
    setSubmitted(true);
    setSubmitting(false);
  };

  const scrollToForm = () => {
    document.getElementById("biz-form")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <style>{`

        /* ── HERO ── */
        .biz-hero {
          background: var(--indigo-d);
          min-height: 88svh;
          display: grid;
          grid-template-columns: 55% 45%;
          position: relative; overflow: hidden;
        }
        .biz-hero-left {
          display: flex; flex-direction: column;
          justify-content: flex-end;
          padding: 140px 6vw 80px;
          position: relative; z-index: 2;
        }
        .biz-hero-left-bar {
          position: absolute; left: 0; top: 0; bottom: 0;
          width: 4px; background: var(--amber); z-index: 3;
        }
        .biz-hero-overline {
          font-size: 10px; font-weight: 700;
          letter-spacing: 0.42em; text-transform: uppercase;
          color: var(--amber);
          display: flex; align-items: center; gap: 14px;
          margin-bottom: 28px;
        }
        .biz-hero-overline::before {
          content: ''; width: 28px; height: 2px;
          background: var(--amber); flex-shrink: 0;
        }
        .biz-hero-h1 {
          font-family: var(--disp);
          font-size: clamp(52px, 7vw, 108px);
          font-weight: 900; line-height: 0.88;
          letter-spacing: -0.03em; color: var(--cream);
        }
        .biz-hero-h1 em {
          font-style: italic; font-weight: 400;
          color: var(--amber); display: block;
        }
        .biz-hero-h1 span {
          display: block;
          -webkit-text-stroke: 1.5px rgba(245,240,232,0.35);
          color: transparent;
        }
        .biz-hero-body {
          font-size: 16px; font-weight: 400; line-height: 1.85;
          color: rgba(232,213,176,0.6);
          max-width: 440px; margin-top: 28px;
        }
        .biz-hero-actions {
          display: flex; gap: 12px; flex-wrap: wrap;
          margin-top: 40px;
        }
        .biz-btn-primary {
          display: inline-flex; align-items: center; gap: 10px;
          background: var(--amber); color: #fff;
          padding: 18px 36px; border: none; cursor: pointer;
          font-family: var(--body);
          font-size: 11px; font-weight: 800;
          letter-spacing: 0.26em; text-transform: uppercase;
          text-decoration: none;
          transition: background 0.2s, transform 0.15s;
        }
        .biz-btn-primary:hover { background: var(--amber-l); transform: translateY(-1px); }
        .biz-btn-ghost {
          display: inline-flex; align-items: center; gap: 10px;
          border: 1.5px solid rgba(245,240,232,0.2);
          color: rgba(245,240,232,0.55);
          padding: 18px 36px;
          font-family: var(--body);
          font-size: 11px; font-weight: 600;
          letter-spacing: 0.24em; text-transform: uppercase;
          text-decoration: none;
          transition: border-color 0.2s, color 0.2s;
          background: none; cursor: pointer;
        }
        .biz-btn-ghost:hover { border-color: var(--amber); color: var(--amber-l); }

        /* Hero right — terracotta with stats */
        .biz-hero-right {
          background: var(--terra);
          position: relative; overflow: hidden;
          display: flex; flex-direction: column;
          justify-content: center;
          padding: 120px 5vw 80px;
          gap: 3px;
        }
        .biz-hero-watermark {
          position: absolute; bottom: -10px; right: -4px;
          font-family: var(--disp);
          font-size: clamp(72px, 10vw, 140px);
          font-weight: 900; font-style: italic;
          color: rgba(0,0,0,0.1);
          pointer-events: none; user-select: none;
          line-height: 1; letter-spacing: -0.04em;
        }
        .biz-hero-stat {
          background: rgba(0,0,0,0.15);
          border-left: 3px solid rgba(255,255,255,0.25);
          padding: 22px 24px;
          position: relative; z-index: 1;
        }
        .biz-hero-stat-num {
          font-family: var(--disp);
          font-size: clamp(32px, 4vw, 48px);
          font-weight: 900; color: #fff; line-height: 1;
          display: block;
        }
        .biz-hero-stat-label {
          font-size: 10px; font-weight: 700;
          letter-spacing: 0.24em; text-transform: uppercase;
          color: rgba(255,255,255,0.55); display: block; margin-top: 3px;
        }

        /* ── MARQUEE ── */
        .biz-marquee {
          background: var(--amber);
          padding: 14px 0; overflow: hidden;
        }
        .biz-marquee-track {
          display: flex; align-items: center;
          white-space: nowrap; width: max-content;
          animation: biz-scroll 20s linear infinite;
        }
        @keyframes biz-scroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        .biz-marquee-item {
          font-size: 11px; font-weight: 700;
          letter-spacing: 0.28em; text-transform: uppercase;
          color: #fff; padding: 0 28px;
        }
        .biz-marquee-sep {
          color: rgba(255,255,255,0.5); font-size: 14px; padding: 0 4px;
        }

        /* ── BENEFITS ── */
        .biz-benefits-section {
          background: var(--cream);
          padding: 100px 6vw;
        }
        .biz-section-overline {
          font-size: 10px; font-weight: 700;
          letter-spacing: 0.42em; text-transform: uppercase;
          color: var(--amber); margin-bottom: 16px;
          display: flex; align-items: center; gap: 12px;
        }
        .biz-section-overline::before {
          content: ''; width: 20px; height: 2px;
          background: var(--amber); flex-shrink: 0;
        }
        .biz-section-h2 {
          font-family: var(--disp);
          font-size: clamp(36px, 4vw, 60px);
          font-weight: 900; line-height: 0.92;
          letter-spacing: -0.02em; color: var(--indigo);
          margin-bottom: 56px;
        }
        .biz-section-h2 em { font-style: italic; font-weight: 400; color: var(--amber); }
        .biz-section-h2-light { color: var(--cream); }

        .biz-benefits-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px; align-items: start;
        }
        .biz-benefit-card {
          background: #fff; padding: 36px 28px;
          border-top: 2px solid transparent;
          transition: border-color 0.25s, transform 0.25s;
        }
        .biz-benefit-card:hover { border-color: var(--amber); transform: translateY(-3px); }
        .biz-benefit-icon {
          width: 48px; height: 48px;
          background: var(--amber-p); color: var(--amber);
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 20px;
          transition: background 0.2s;
        }
        .biz-benefit-card:hover .biz-benefit-icon { background: var(--amber); color: #fff; }
        .biz-benefit-title {
          font-family: var(--disp);
          font-size: 22px; font-weight: 700;
          color: var(--indigo); margin-bottom: 10px;
        }
        .biz-benefit-body {
          font-size: 13px; font-weight: 400;
          color: var(--muted); line-height: 1.85;
        }

        /* ── PRICING TIERS ── */
        .biz-pricing-section {
          background: var(--indigo-d);
          padding: 100px 6vw;
          position: relative; overflow: hidden;
        }
        .biz-pricing-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 2px; margin-top: 0;
        }
        .biz-tier {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(193,123,58,0.12);
          padding: 40px 28px;
          display: flex; flex-direction: column;
          position: relative;
          transition: border-color 0.25s, background 0.25s;
        }
        .biz-tier:hover { border-color: rgba(193,123,58,0.4); background: rgba(193,123,58,0.05); }
        .biz-tier-featured {
          border-color: var(--amber) !important;
          background: rgba(193,123,58,0.08) !important;
        }
        .biz-tier-badge {
          position: absolute; top: -1px; left: 50%;
          transform: translateX(-50%);
          background: var(--amber); color: #fff;
          font-size: 8px; font-weight: 800;
          letter-spacing: 0.24em; text-transform: uppercase;
          padding: 5px 16px; white-space: nowrap;
        }
        .biz-tier-label {
          font-size: 9px; font-weight: 800;
          letter-spacing: 0.38em; text-transform: uppercase;
          color: var(--amber); margin-bottom: 20px; display: block;
        }
        .biz-tier-discount {
          font-family: var(--disp);
          font-size: clamp(52px, 5vw, 72px);
          font-weight: 900; color: var(--cream);
          line-height: 1; display: block;
        }
        .biz-tier-off {
          font-size: 10px; font-weight: 600;
          letter-spacing: 0.18em; text-transform: uppercase;
          color: rgba(193,123,58,0.5);
          display: block; margin-top: 4px; margin-bottom: 28px;
        }
        .biz-tier-range {
          display: flex; align-items: center; gap: 8px;
          font-size: 11px; font-weight: 600;
          color: rgba(245,240,232,0.5);
          letter-spacing: 0.1em;
          border-top: 1px solid rgba(193,123,58,0.15);
          padding-top: 20px; margin-top: auto;
        }
        .biz-tier-range svg { color: var(--amber); flex-shrink: 0; }

        /* ── PROCESS ── */
        .biz-process-section {
          background: var(--cocoa);
          padding: 100px 6vw;
          position: relative; overflow: hidden;
        }
        .biz-process-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 2px; margin-top: 56px;
        }
        .biz-process-step {
          background: rgba(255,255,255,0.03);
          padding: 36px 24px;
          border-top: 3px solid transparent;
          transition: border-color 0.25s;
        }
        .biz-process-step:hover { border-color: var(--amber); }
        .biz-process-step:nth-child(even) { margin-top: 40px; }
        .biz-process-num {
          font-family: var(--disp);
          font-size: 72px; font-weight: 900; font-style: italic;
          color: rgba(193,123,58,0.1); line-height: 1;
          display: block; margin-bottom: 16px;
        }
        .biz-process-step h4 {
          font-family: var(--disp);
          font-size: 22px; font-weight: 700;
          color: var(--cream); margin-bottom: 10px;
        }
        .biz-process-step p {
          font-size: 13px; font-weight: 400;
          color: rgba(232,213,176,0.45); line-height: 1.85;
        }

        /* ── FORM ── */
        .biz-form-section {
          background: var(--cream);
          padding: 100px 6vw;
          border-top: 1px solid var(--rule);
        }
        .biz-form-layout {
          display: grid;
          grid-template-columns: 1fr 1.4fr;
          gap: 80px; align-items: start;
        }
        .biz-form-left { position: sticky; top: 100px; }
        .biz-form-tagline {
          font-family: var(--disp);
          font-size: clamp(28px, 3vw, 42px);
          font-weight: 900; line-height: 1.05;
          color: var(--indigo); margin-top: 20px; margin-bottom: 24px;
        }
        .biz-form-tagline em { font-style: italic; color: var(--amber); }
        .biz-form-desc {
          font-size: 14px; font-weight: 400;
          color: var(--muted); line-height: 1.85;
          margin-bottom: 32px;
        }
        .biz-form-promise {
          display: flex; flex-direction: column; gap: 12px;
        }
        .biz-promise-item {
          display: flex; align-items: center; gap: 12px;
          font-size: 13px; font-weight: 500; color: var(--muted);
        }
        .biz-promise-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: var(--amber); flex-shrink: 0;
        }

        /* Form itself */
        .biz-form-card {
          background: var(--indigo-d);
          padding: 48px 40px;
          position: relative; overflow: hidden;
        }
        .biz-form-row {
          display: grid; grid-template-columns: 1fr 1fr; gap: 16px;
          margin-bottom: 16px;
        }
        .biz-form-row-single { margin-bottom: 16px; }
        .biz-field { display: flex; flex-direction: column; gap: 8px; }
        .biz-field-label {
          font-size: 9px; font-weight: 800;
          letter-spacing: 0.36em; text-transform: uppercase;
          color: rgba(193,123,58,0.5);
        }
        .biz-input, .biz-select, .biz-textarea {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(193,123,58,0.15);
          color: var(--cream);
          font-family: var(--body);
          font-size: 13px; font-weight: 500;
          padding: 14px 18px; outline: none;
          transition: border-color 0.2s;
          width: 100%;
        }
        .biz-input:focus, .biz-select:focus, .biz-textarea:focus {
          border-color: var(--amber);
        }
        .biz-input::placeholder, .biz-textarea::placeholder {
          color: rgba(193,123,58,0.25);
        }
        .biz-select { appearance: none; cursor: pointer; }
        .biz-select option { background: #1B2A4A; color: #F5F0E8; }
        .biz-textarea { resize: none; height: 120px; }
        .biz-submit {
          width: 100%; padding: 20px;
          background: var(--amber); color: #fff;
          border: none; cursor: pointer;
          font-family: var(--body);
          font-size: 11px; font-weight: 800;
          letter-spacing: 0.28em; text-transform: uppercase;
          margin-top: 8px;
          transition: background 0.2s, transform 0.15s;
          display: flex; align-items: center;
          justify-content: center; gap: 10px;
        }
        .biz-submit:hover:not(:disabled) { background: var(--amber-l); transform: translateY(-1px); }
        .biz-submit:disabled { opacity: 0.5; cursor: not-allowed; }
        .biz-spin { animation: biz-spin 0.8s linear infinite; }
        @keyframes biz-spin { to { transform: rotate(360deg); } }

        /* Success state */
        .biz-success {
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          text-align: center; padding: 64px 40px;
          gap: 20px;
        }
        .biz-success-check {
          width: 72px; height: 72px;
          background: var(--amber); color: #fff;
          display: flex; align-items: center; justify-content: center;
          font-family: var(--disp); font-size: 32px; font-weight: 900;
        }
        .biz-success-title {
          font-family: var(--disp);
          font-size: 32px; font-weight: 900; color: var(--cream);
        }
        .biz-success-body {
          font-size: 13px; color: rgba(193,123,58,0.5); line-height: 1.75;
          max-width: 320px;
        }

        /* ── CONTACT STRIP ── */
        .biz-contact-strip {
          background: var(--indigo);
          padding: 60px 6vw;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 2px;
          position: relative; overflow: hidden;
        }
        .biz-contact-item {
          display: flex; align-items: flex-start; gap: 16px;
          padding: 28px 24px;
          background: rgba(255,255,255,0.02);
          border-top: 2px solid transparent;
          transition: border-color 0.2s;
        }
        .biz-contact-item:hover { border-color: var(--amber); }
        .biz-contact-icon {
          width: 40px; height: 40px; flex-shrink: 0;
          background: var(--amber); color: #fff;
          display: flex; align-items: center; justify-content: center;
        }
        .biz-contact-label {
          font-size: 9px; font-weight: 800;
          letter-spacing: 0.34em; text-transform: uppercase;
          color: rgba(193,123,58,0.4); display: block; margin-bottom: 4px;
        }
        .biz-contact-val {
          font-size: 14px; font-weight: 600;
          color: var(--cream); display: block;
          text-decoration: none; transition: color 0.2s;
        }
        a.biz-contact-val:hover { color: var(--amber-l); }

        /* ── RESPONSIVE ── */
        @media (max-width: 1100px) {
          .biz-hero { grid-template-columns: 1fr; }
          .biz-hero-right { display: none; }
          .biz-benefits-grid { grid-template-columns: 1fr 1fr; }
          .biz-pricing-grid { grid-template-columns: 1fr 1fr; }
          .biz-process-grid { grid-template-columns: 1fr 1fr; }
          .biz-process-step:nth-child(even) { margin-top: 0; }
          .biz-form-layout { grid-template-columns: 1fr; gap: 48px; }
          .biz-form-left { position: static; }
          .biz-contact-strip { grid-template-columns: 1fr 1fr; }
        }
        @media (max-width: 640px) {
          .biz-benefits-grid { grid-template-columns: 1fr; }
          .biz-pricing-grid { grid-template-columns: 1fr 1fr; }
          .biz-process-grid { grid-template-columns: 1fr; }
          .biz-form-row { grid-template-columns: 1fr; }
          .biz-contact-strip { grid-template-columns: 1fr; }
          .biz-form-card { padding: 32px 24px; }
        }
      `}</style>

      {/* ═══════════ HERO ═══════════ */}
      <section className="biz-hero">
        <AnkaraPattern opacity={0.055} />

        <div className="biz-hero-left">
          <div className="biz-hero-left-bar" />

          <motion.div className="biz-hero-overline"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.1 }}>
            Lensra Business · Corporate Gifting
          </motion.div>

          <motion.h1 className="biz-hero-h1"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.22 }}>
            Gifts your
            <em>clients remember.</em>
            <span>At scale.</span>
          </motion.h1>

          <motion.p className="biz-hero-body"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.4 }}>
            Branded Ankara tote bags and pouches for your staff, clients,
            and events. Each one personalised, embroidered, and packaged
            to impress. Bulk pricing from 10 units.
          </motion.p>

          <motion.div className="biz-hero-actions"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.54 }}>
            <button onClick={scrollToForm} className="biz-btn-primary">
              Get a Quote <ArrowRight size={15} />
            </button>
            <Link href="/shop" className="biz-btn-ghost">
              Browse Products
            </Link>
          </motion.div>
        </div>

        {/* Right — terracotta stats */}
        <motion.div className="biz-hero-right"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.1, delay: 0.3 }}>
          <AnkaraPattern light opacity={0.06} />
          <div className="biz-hero-watermark">Biz.</div>
          {[
            { num: "10+",   label: "Minimum order — no huge MOQs"   },
            { num: "40%",   label: "Maximum bulk discount"           },
            { num: "5 days",label: "Average corporate turnaround"    },
            { num: "100%",  label: "Handmade, every single order"    },
          ].map(s => (
            <div key={s.label} className="biz-hero-stat">
              <span className="biz-hero-stat-num">{s.num}</span>
              <span className="biz-hero-stat-label">{s.label}</span>
            </div>
          ))}
        </motion.div>
      </section>

      {/* ═══════════ MARQUEE ═══════════ */}
      <div className="biz-marquee">
        <div className="biz-marquee-track">
          {[
            "STAFF APPRECIATION PACKS", "✦", "CLIENT GIFTS", "✦",
            "EVENT MERCHANDISE", "✦", "BRANDED ANKARA", "✦",
            "BULK ORDERS WELCOME", "✦", "MADE IN NIGERIA", "✦",
            "STAFF APPRECIATION PACKS", "✦", "CLIENT GIFTS", "✦",
            "EVENT MERCHANDISE", "✦", "BRANDED ANKARA", "✦",
            "BULK ORDERS WELCOME", "✦", "MADE IN NIGERIA", "✦",
          ].map((item, i) => (
            <span key={i}
              className={item === "✦" ? "biz-marquee-sep" : "biz-marquee-item"}>
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* ═══════════ BENEFITS ═══════════ */}
      <section className="biz-benefits-section">
        <Reveal>
          <div className="biz-section-overline">Why Lensra Business</div>
          <h2 className="biz-section-h2">
            Corporate gifts that<br /><em>actually impress.</em>
          </h2>
        </Reveal>

        <Reveal>
          <div className="biz-benefits-grid">
            {[
              {
                icon: Package,
                title: "Bulk pricing",
                body: "Save up to 40% on orders of 100+ units. The more you order, the better your per-unit cost. Transparent pricing, no hidden fees.",
              },
              {
                icon: Users,
                title: "Each one personalised",
                body: "Unlike generic corporate gifts, every single bag can be embroidered with a different name. Your 200 staff each get one that feels made for them.",
              },
              {
                icon: Zap,
                title: "Priority production",
                body: "Corporate orders jump the production queue. We allocate dedicated maker time to your order from the moment payment is confirmed.",
              },
              {
                icon: ShieldCheck,
                title: "Quality guaranteed",
                body: "Every bag is inspected before it leaves us. If anything doesn't meet standard, we remake it at no cost. Your brand reputation is ours too.",
              },
              {
                icon: Truck,
                title: "Direct delivery",
                body: "We can ship to your office in one bulk delivery, or to individual staff and client addresses across Nigeria. You choose what works.",
              },
              {
                icon: Building2,
                title: "Brand alignment",
                body: "We can source Ankara patterns in colours that align with your brand palette, and embroider your company name alongside the recipient's name.",
              },
            ].map((b, i) => (
              <BenefitCard key={b.title}
                icon={b.icon} title={b.title} body={b.body} index={i} />
            ))}
          </div>
        </Reveal>
      </section>

      {/* ═══════════ PRICING TIERS ═══════════ */}
      <section className="biz-pricing-section">
        <AnkaraPattern opacity={0.04} />
        <Reveal>
          <div className="biz-section-overline">Bulk Pricing</div>
          <h2 className="biz-section-h2 biz-section-h2-light">
            The more you order,<br /><em>the more you save.</em>
          </h2>
        </Reveal>

        <Reveal>
          <div className="biz-pricing-grid">
            <PricingTier label="Starter"    range="10–49 units"   discount="10%" />
            <PricingTier label="Growth"     range="50–99 units"   discount="20%" />
            <PricingTier label="Scale"      range="100–249 units" discount="30%" featured />
            <PricingTier label="Enterprise" range="250+ units"    discount="40%" />
          </div>
        </Reveal>
      </section>

      {/* ═══════════ HOW IT WORKS ═══════════ */}
      <section className="biz-process-section">
        <AnkaraPattern opacity={0.04} />
        <Reveal>
          <div className="biz-section-overline">The Process</div>
          <h2 className="biz-section-h2 biz-section-h2-light">
            From enquiry to<br /><em>your door.</em>
          </h2>
        </Reveal>

        <Reveal>
          <div className="biz-process-grid">
            {[
              {
                n: "01", title: "Send an enquiry",
                body: "Fill in the form below with your company name, product type, quantity, and any specific requirements. We respond within 24 hours.",
              },
              {
                n: "02", title: "We send a quote",
                body: "You receive a detailed quote — per-unit price, bulk discount applied, packaging options, and estimated production timeline.",
              },
              {
                n: "03", title: "Confirm and pay",
                body: "Once you approve the quote, pay a 50% deposit to begin production. Balance is due before delivery. We accept Paystack and bank transfer.",
              },
              {
                n: "04", title: "We produce and deliver",
                body: "Your order is produced to specification, quality-checked, and shipped to your preferred address. You receive tracking information throughout.",
              },
            ].map(step => (
              <motion.div key={step.n} className="biz-process-step" variants={fadeUp}>
                <span className="biz-process-num">{step.n}</span>
                <h4>{step.title}</h4>
                <p>{step.body}</p>
              </motion.div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* ═══════════ FORM ═══════════ */}
      <section className="biz-form-section" id="biz-form">
        <div className="biz-form-layout">

          {/* Left — context */}
          <Reveal>
            <div className="biz-form-left">
              <div className="biz-section-overline">Get a Quote</div>
              <h2 className="biz-form-tagline">
                Tell us what<br />you need.<br />
                <em>We'll handle the rest.</em>
              </h2>
              <p className="biz-form-desc">
                Fill in the form and we'll come back to you with a
                full quote within 24 hours — pricing, timeline,
                and a sample recommendation.
              </p>
              <div className="biz-form-promise">
                {[
                  "Response within 24 hours, always",
                  "No commitment required for a quote",
                  "Minimum order of just 10 units",
                  "Nationwide delivery included in quote",
                  "Each bag personalised at no extra cost",
                ].map(p => (
                  <div key={p} className="biz-promise-item">
                    <span className="biz-promise-dot" />
                    {p}
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Right — form */}
          <div className="biz-form-card">
            <AnkaraPattern opacity={0.04} />

            {submitted ? (
              <div className="biz-success">
                <div className="biz-success-check">✓</div>
                <h3 className="biz-success-title">Request sent.</h3>
                <p className="biz-success-body">
                  We'll review your enquiry and come back to you
                  with a full quote within 24 hours.
                </p>
                <button
                  className="biz-btn-primary"
                  style={{ marginTop: 8 }}
                  onClick={() => setSubmitted(false)}>
                  Send Another
                </button>
              </div>
            ) : (
              <form onSubmit={onSubmit}>
                <div className="biz-form-row">
                  <Field label="Company Name">
                    <input name="companyName" value={form.companyName}
                      onChange={onChange} placeholder="Acme Nigeria Ltd"
                      required className="biz-input" />
                  </Field>
                  <Field label="Your Name">
                    <input name="contactName" value={form.contactName}
                      onChange={onChange} placeholder="Chukwuemeka Eze"
                      required className="biz-input" />
                  </Field>
                </div>

                <div className="biz-form-row">
                  <Field label="Email Address">
                    <input name="email" type="email" value={form.email}
                      onChange={onChange} placeholder="emeka@acme.ng"
                      required className="biz-input" />
                  </Field>
                  <Field label="Phone Number">
                    <input name="phone" value={form.phone}
                      onChange={onChange} placeholder="+234 800 000 0000"
                      className="biz-input" />
                  </Field>
                </div>

                <div className="biz-form-row">
                  <Field label="Product Type">
                    <select name="productType" value={form.productType}
                      onChange={onChange} required className="biz-select">
                      <option value="">Select product</option>
                      <option value="tote">Ankara Tote Bags</option>
                      <option value="pouch">Ankara Pouches</option>
                      <option value="both">Both — Tote + Pouch Sets</option>
                    </select>
                  </Field>
                  <Field label="Quantity Needed">
                    <select name="quantity" value={form.quantity}
                      onChange={onChange} required className="biz-select">
                      <option value="">Select quantity</option>
                      <option value="10-49">10–49 units</option>
                      <option value="50-99">50–99 units</option>
                      <option value="100-249">100–249 units</option>
                      <option value="250+">250+ units</option>
                    </select>
                  </Field>
                </div>

                <div className="biz-form-row-single">
                  <Field label="Occasion / Purpose">
                    <select name="occasion" value={form.occasion}
                      onChange={onChange} className="biz-select">
                      <option value="">Select occasion</option>
                      <option value="staff">Staff Appreciation</option>
                      <option value="client">Client Gifts</option>
                      <option value="event">Event / Conference</option>
                      <option value="wedding">Wedding Souvenirs</option>
                      <option value="other">Other</option>
                    </select>
                  </Field>
                </div>

                <div className="biz-form-row-single">
                  <Field label="Additional Details">
                    <textarea name="message" value={form.message}
                      onChange={onChange}
                      placeholder="Tell us about your brand colours, any text to embroider, your delivery deadline, or anything else we should know..."
                      className="biz-textarea" />
                  </Field>
                </div>

                <button type="submit" className="biz-submit" disabled={submitting}>
                  {submitting ? (
                    <>
                      <svg className="biz-spin" width="16" height="16" viewBox="0 0 24 24"
                        fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
                        <path d="M12 2a10 10 0 0 1 10 10" />
                      </svg>
                      Sending…
                    </>
                  ) : (
                    <>Send Enquiry <ArrowRight size={15} /></>
                  )}
                </button>
              </form>
            )}
          </div>

        </div>
      </section>

      {/* ═══════════ CONTACT STRIP ═══════════ */}
      <div className="biz-contact-strip">
        <AnkaraPattern opacity={0.04} />
        {[
          { Icon: Mail,   label: "Email us",    val: "hello@lensra.com",    href: "mailto:hello@lensra.com"         },
          { Icon: Phone,  label: "WhatsApp",    val: "+234 805 138 5049",   href: "https://wa.me/2348051385049"     },
          { Icon: MapPin, label: "We're based in", val: "Benin City, Edo", href: null                              },
          { Icon: Truck,  label: "We deliver to",  val: "All 36 states",   href: null                              },
        ].map(({ Icon, label, val, href }) => (
          <div key={label} className="biz-contact-item">
            <div className="biz-contact-icon"><Icon size={18} /></div>
            <div>
              <span className="biz-contact-label">{label}</span>
              {href
                ? <a href={href} className="biz-contact-val"
                    target="_blank" rel="noopener noreferrer">{val}</a>
                : <span className="biz-contact-val">{val}</span>
              }
            </div>
          </div>
        ))}
      </div>
    </>
  );
}