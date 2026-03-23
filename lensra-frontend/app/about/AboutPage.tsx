"use client";

// app/about/page.tsx
// Lensra — About Page (Rewrite)
// Goal: Relate → Explain → Show → Invite
// Design: Black/white/red Lensra system — Montserrat + Playfair Display
// Emotion-first, conversion-focused, image-heavy

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";

// ── Easings & variants ────────────────────────────────────────────────────────
const EASE = [0.16, 1, 0.3, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 0.75, ease: EASE } },
};

const fadeIn = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.6, ease: EASE } },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};

// ── Scroll reveal wrapper ──────────────────────────────────────────────────────
function Reveal({ children, className = "" }: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
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

// ── Testimonial card ──────────────────────────────────────────────────────────
function Testimonial({ quote, name, occasion }: {
  quote: string; name: string; occasion: string;
}) {
  return (
    <motion.div className="at-testi-card" variants={fadeUp}>
      <div className="at-testi-stars">★★★★★</div>
      <p className="at-testi-quote">"{quote}"</p>
      <div className="at-testi-meta">
        <span className="at-testi-name">{name}</span>
        <span className="at-testi-occ">{occasion}</span>
      </div>
    </motion.div>
  );
}

// ── Differentiator item ───────────────────────────────────────────────────────
function Diff({ icon, title, body }: { icon: string; title: string; body: string }) {
  return (
    <motion.div className="at-diff-item" variants={fadeUp}>
      <span className="at-diff-icon">{icon}</span>
      <h4 className="at-diff-title">{title}</h4>
      <p className="at-diff-body">{body}</p>
    </motion.div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function AboutPage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,700&family=Playfair+Display:ital,wght@0,700;0,900;1,400;1,700;1,900&display=swap');

        /* ── TOKENS ── */
        :root {
          --red:    #DD183B;
          --red-d:  #C2152F;
          --black:  #0F0F0F;
          --black2: #111111;
          --white:  #FFFFFF;
          --off:    #F7F4F0;
          --muted:  rgba(255,255,255,0.45);
          --rule:   rgba(255,255,255,0.07);
          --mont:   'Montserrat', sans-serif;
          --play:   'Playfair Display', serif;
        }

        /* ══════════════════════════════════════
           1. HERO
        ══════════════════════════════════════ */
        .at-hero {
          position: relative;
          min-height: 100svh;
          background: var(--black);
          display: grid;
          place-items: center;
          overflow: hidden;
          padding: 120px 6vw 80px;
        }

        /* Full-bleed emotional photo overlay */
        .at-hero-img {
          position: absolute; inset: 0;
          background:
            linear-gradient(to bottom,
              rgba(15,15,15,0.55) 0%,
              rgba(15,15,15,0.35) 40%,
              rgba(15,15,15,0.85) 100%),
            url('https://images.unsplash.com/photo-1513519107519-8ff31a7cd9b7?w=1600&q=80&fit=crop')
            center/cover no-repeat;
          z-index: 0;
          transform: scale(1.04);
          animation: at-hero-zoom 12s ease-out forwards;
        }
        @keyframes at-hero-zoom {
          from { transform: scale(1.04); }
          to   { transform: scale(1.00); }
        }

        /* Red left accent bar */
        .at-hero-bar {
          position: absolute; left: 0; top: 0; bottom: 0;
          width: 4px; background: var(--red); z-index: 2;
        }

        .at-hero-inner {
          position: relative; z-index: 2;
          max-width: 820px;
          text-align: center;
          display: flex; flex-direction: column;
          align-items: center; gap: 0;
        }

        .at-hero-pill {
          display: inline-flex; align-items: center; gap: 8px;
          background: rgba(221,24,59,0.15);
          border: 1px solid rgba(221,24,59,0.3);
          color: var(--red);
          font-family: var(--mont);
          font-size: 9px; font-weight: 800;
          letter-spacing: 0.28em; text-transform: uppercase;
          padding: 7px 16px; margin-bottom: 28px;
        }
        .at-hero-pill-dot {
          width: 5px; height: 5px;
          border-radius: 50%; background: var(--red);
          animation: at-pulse 2s ease-in-out infinite;
        }
        @keyframes at-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.4; transform: scale(0.7); }
        }

        .at-hero-h1 {
          font-family: var(--play);
          font-size: clamp(40px, 6.5vw, 96px);
          font-weight: 900; line-height: 0.9;
          letter-spacing: -0.025em; color: var(--white);
          margin-bottom: 28px;
        }
        .at-hero-h1 em {
          font-style: italic; font-weight: 400;
          color: transparent;
          -webkit-text-stroke: 1.5px rgba(255,255,255,0.55);
          display: block;
        }

        .at-hero-sub {
          font-family: var(--mont);
          font-size: clamp(14px, 1.4vw, 17px);
          font-weight: 400; line-height: 1.85;
          color: rgba(255,255,255,0.6);
          max-width: 520px;
          margin-bottom: 44px;
        }

        .at-hero-cta {
          display: inline-flex; align-items: center; gap: 10px;
          background: var(--red); color: var(--white);
          padding: 16px 36px;
          font-family: var(--mont);
          font-size: 10px; font-weight: 800;
          letter-spacing: 0.2em; text-transform: uppercase;
          text-decoration: none;
          transition: background 0.2s, transform 0.15s;
        }
        .at-hero-cta:hover { background: var(--red-d); transform: translateY(-2px); }

        /* Scroll indicator */
        .at-hero-scroll {
          position: absolute; bottom: 36px; left: 50%;
          transform: translateX(-50%);
          display: flex; flex-direction: column; align-items: center; gap: 8px;
          z-index: 2;
        }
        .at-hero-scroll span {
          font-family: var(--mont); font-size: 8px;
          font-weight: 700; letter-spacing: 0.3em; text-transform: uppercase;
          color: rgba(255,255,255,0.3);
        }
        .at-hero-scroll-line {
          width: 1px; height: 40px;
          background: linear-gradient(to bottom, rgba(255,255,255,0.3), transparent);
          animation: at-scroll-line 2s ease-in-out infinite;
        }
        @keyframes at-scroll-line {
          0%   { transform: scaleY(0); transform-origin: top; }
          50%  { transform: scaleY(1); transform-origin: top; }
          51%  { transform: scaleY(1); transform-origin: bottom; }
          100% { transform: scaleY(0); transform-origin: bottom; }
        }

        /* ══════════════════════════════════════
           2. THE PROBLEM
        ══════════════════════════════════════ */
        .at-prob-section {
          background: var(--off);
          padding: 100px 6vw;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 80px; align-items: center;
        }
        .at-prob-left { position: relative; }

        /* Big ghost number */
        .at-prob-ghost {
          position: absolute; top: -30px; left: -20px;
          font-family: var(--play);
          font-size: 200px; font-weight: 900; font-style: italic;
          color: rgba(221,24,59,0.05);
          line-height: 1; user-select: none; pointer-events: none;
          z-index: 0;
        }

        .at-prob-overline {
          font-family: var(--mont);
          font-size: 9px; font-weight: 800;
          letter-spacing: 0.36em; text-transform: uppercase;
          color: var(--red); margin-bottom: 20px;
          display: flex; align-items: center; gap: 12px;
          position: relative; z-index: 1;
        }
        .at-prob-overline::before {
          content: ''; width: 24px; height: 2px;
          background: var(--red); flex-shrink: 0;
        }

        .at-prob-h2 {
          font-family: var(--play);
          font-size: clamp(32px, 3.5vw, 52px);
          font-weight: 900; line-height: 0.92;
          letter-spacing: -0.02em; color: var(--black);
          margin-bottom: 0;
          position: relative; z-index: 1;
        }
        .at-prob-h2 em { font-style: italic; font-weight: 400; color: var(--red); }

        .at-prob-right { display: flex; flex-direction: column; gap: 20px; }

        .at-prob-scenario {
          background: var(--white);
          border-left: 3px solid transparent;
          padding: 24px 28px;
          transition: border-color 0.25s;
        }
        .at-prob-scenario:hover { border-left-color: var(--red); }
        .at-prob-scenario-emoji {
          font-size: 24px; display: block; margin-bottom: 10px;
        }
        .at-prob-scenario p {
          font-family: var(--mont);
          font-size: 14px; font-weight: 500;
          color: #2a2a2a; line-height: 1.75;
          margin: 0;
        }
        .at-prob-scenario p strong {
          color: var(--black); font-weight: 700;
        }

        /* ══════════════════════════════════════
           3. THE SOLUTION
        ══════════════════════════════════════ */
        .at-sol-section {
          background: var(--black);
          padding: 100px 6vw;
          text-align: center;
          position: relative; overflow: hidden;
        }

        .at-sol-bg-text {
          position: absolute; top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          font-family: var(--play);
          font-size: clamp(80px, 16vw, 220px);
          font-weight: 900; font-style: italic;
          color: rgba(255,255,255,0.02);
          white-space: nowrap; pointer-events: none; user-select: none;
          z-index: 0;
        }

        .at-sol-inner { position: relative; z-index: 1; max-width: 720px; margin: 0 auto; }

        .at-sol-overline {
          font-family: var(--mont);
          font-size: 9px; font-weight: 800;
          letter-spacing: 0.36em; text-transform: uppercase;
          color: var(--red); margin-bottom: 24px;
          display: flex; align-items: center; justify-content: center; gap: 12px;
        }
        .at-sol-overline::before,
        .at-sol-overline::after {
          content: ''; flex: 1; max-width: 40px; height: 1px;
          background: rgba(221,24,59,0.4);
        }

        .at-sol-h2 {
          font-family: var(--play);
          font-size: clamp(36px, 4vw, 64px);
          font-weight: 900; line-height: 0.92;
          letter-spacing: -0.025em; color: var(--white);
          margin-bottom: 24px;
        }
        .at-sol-h2 em { font-style: italic; font-weight: 400; color: var(--red); }

        .at-sol-body {
          font-family: var(--mont);
          font-size: clamp(15px, 1.4vw, 18px);
          font-weight: 400; line-height: 1.9;
          color: rgba(255,255,255,0.5);
          margin-bottom: 48px;
        }
        .at-sol-body strong { color: rgba(255,255,255,0.85); font-weight: 600; }

        /* ══════════════════════════════════════
           4. WHAT WE ACTUALLY DO (HOW IT WORKS)
        ══════════════════════════════════════ */
        .at-how-section {
          background: var(--black2);
          padding: 100px 6vw;
          border-top: 1px solid var(--rule);
        }
        .at-how-header { text-align: center; margin-bottom: 72px; }

        .at-how-overline {
          font-family: var(--mont);
          font-size: 9px; font-weight: 800;
          letter-spacing: 0.36em; text-transform: uppercase;
          color: var(--red); margin-bottom: 16px;
          display: flex; align-items: center; justify-content: center; gap: 12px;
        }
        .at-how-overline::before,
        .at-how-overline::after {
          content: ''; flex: 1; max-width: 40px; height: 1px;
          background: rgba(221,24,59,0.4);
        }

        .at-how-h2 {
          font-family: var(--play);
          font-size: clamp(32px, 3.5vw, 52px);
          font-weight: 900; line-height: 0.92;
          letter-spacing: -0.02em; color: var(--white);
        }
        .at-how-h2 em { font-style: italic; font-weight: 400; color: var(--red); }

        .at-how-steps {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 2px;
        }
        .at-how-step {
          background: rgba(255,255,255,0.025);
          padding: 40px 28px;
          border-top: 2px solid transparent;
          transition: border-color 0.25s, background 0.25s;
          position: relative;
        }
        .at-how-step:hover {
          border-color: var(--red);
          background: rgba(255,255,255,0.045);
        }
        .at-how-step:nth-child(even) { margin-top: 32px; }

        .at-how-step-num {
          font-family: var(--play);
          font-size: 72px; font-weight: 900; font-style: italic;
          color: rgba(221,24,59,0.1); line-height: 1;
          display: block; margin-bottom: 16px;
        }
        .at-how-step-icon {
          font-size: 28px; display: block; margin-bottom: 16px;
        }
        .at-how-step h4 {
          font-family: var(--mont);
          font-size: 13px; font-weight: 800;
          letter-spacing: 0.1em; text-transform: uppercase;
          color: var(--white); margin-bottom: 10px;
        }
        .at-how-step p {
          font-family: var(--mont);
          font-size: 13px; font-weight: 400;
          color: rgba(255,255,255,0.4); line-height: 1.8;
        }

        /* ══════════════════════════════════════
           5. WHAT MAKES US DIFFERENT
        ══════════════════════════════════════ */
        .at-diff-section {
          background: var(--off);
          padding: 100px 6vw;
        }
        .at-diff-header {
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 64px; align-items: end; margin-bottom: 64px;
        }

        .at-diff-overline {
          font-family: var(--mont);
          font-size: 9px; font-weight: 800;
          letter-spacing: 0.36em; text-transform: uppercase;
          color: var(--red); margin-bottom: 16px;
          display: flex; align-items: center; gap: 12px;
        }
        .at-diff-overline::before {
          content: ''; width: 24px; height: 2px;
          background: var(--red); flex-shrink: 0;
        }

        .at-diff-h2 {
          font-family: var(--play);
          font-size: clamp(32px, 3.5vw, 52px);
          font-weight: 900; line-height: 0.92;
          letter-spacing: -0.02em; color: var(--black);
        }
        .at-diff-h2 em { font-style: italic; font-weight: 400; color: var(--red); }

        .at-diff-lead {
          font-family: var(--mont);
          font-size: 15px; font-weight: 400;
          color: #555; line-height: 1.9;
        }
        .at-diff-lead strong { color: var(--black); font-weight: 700; }

        .at-diff-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 2px;
        }
        .at-diff-item {
          background: var(--white);
          padding: 36px 28px;
          border-top: 2px solid transparent;
          transition: border-color 0.25s;
        }
        .at-diff-item:hover { border-top-color: var(--red); }
        .at-diff-icon {
          font-size: 32px; display: block; margin-bottom: 16px;
        }
        .at-diff-title {
          font-family: var(--mont);
          font-size: 12px; font-weight: 800;
          letter-spacing: 0.12em; text-transform: uppercase;
          color: var(--black); margin-bottom: 10px;
        }
        .at-diff-body {
          font-family: var(--mont);
          font-size: 13px; font-weight: 400;
          color: #666; line-height: 1.8;
        }

        /* ══════════════════════════════════════
           6. BEHIND THE SCENES
        ══════════════════════════════════════ */
        .at-bts-section {
          background: var(--black);
          padding: 100px 6vw;
          border-top: 1px solid var(--rule);
        }
        .at-bts-header { text-align: center; margin-bottom: 56px; }

        .at-bts-overline {
          font-family: var(--mont);
          font-size: 9px; font-weight: 800;
          letter-spacing: 0.36em; text-transform: uppercase;
          color: var(--red); margin-bottom: 16px;
          display: flex; align-items: center; justify-content: center; gap: 12px;
        }
        .at-bts-overline::before,
        .at-bts-overline::after {
          content: ''; flex: 1; max-width: 40px; height: 1px;
          background: rgba(221,24,59,0.4);
        }

        .at-bts-h2 {
          font-family: var(--play);
          font-size: clamp(32px, 3.5vw, 52px);
          font-weight: 900; line-height: 0.92;
          letter-spacing: -0.02em; color: var(--white);
        }
        .at-bts-h2 em { font-style: italic; font-weight: 400; color: var(--red); }

        /* Masonry-style photo grid */
        .at-bts-grid {
          display: grid;
          grid-template-columns: 1.4fr 1fr 1fr;
          grid-template-rows: auto auto;
          gap: 3px;
        }
        .at-bts-img {
          overflow: hidden; position: relative;
          background: #1a1a1a;
        }
        .at-bts-img:first-child {
          grid-row: span 2;
        }
        .at-bts-img img {
          width: 100%; height: 100%;
          object-fit: cover; display: block;
          transition: transform 0.6s cubic-bezier(0.16,1,0.3,1);
        }
        .at-bts-img:hover img { transform: scale(1.04); }
        .at-bts-img-label {
          position: absolute; bottom: 0; left: 0; right: 0;
          padding: 40px 20px 16px;
          background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);
          font-family: var(--mont);
          font-size: 10px; font-weight: 700;
          letter-spacing: 0.2em; text-transform: uppercase;
          color: rgba(255,255,255,0.7);
        }
        /* height for grid cells */
        .at-bts-img { min-height: 240px; }
        .at-bts-img:first-child { min-height: 484px; }

        /* Story ribbon below photos */
        .at-bts-story {
          margin-top: 56px;
          display: grid;
          grid-template-columns: auto 1fr auto;
          gap: 48px; align-items: center;
        }
        .at-bts-story-line {
          width: 1px; height: 80px;
          background: linear-gradient(to bottom, transparent, rgba(221,24,59,0.5), transparent);
        }
        .at-bts-story-inner { text-align: center; }
        .at-bts-story-h3 {
          font-family: var(--play);
          font-size: clamp(20px, 2vw, 28px);
          font-weight: 700; font-style: italic;
          color: rgba(255,255,255,0.8); margin-bottom: 10px;
        }
        .at-bts-story-p {
          font-family: var(--mont);
          font-size: 14px; font-weight: 400;
          color: rgba(255,255,255,0.4); line-height: 1.8;
          max-width: 560px; margin: 0 auto;
        }

        /* ══════════════════════════════════════
           7. YOUR STORY
        ══════════════════════════════════════ */
        .at-story-section {
          background: var(--red);
          padding: 80px 6vw;
          position: relative; overflow: hidden;
        }
        .at-story-bg {
          position: absolute; inset: 0;
          background:
            linear-gradient(135deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0) 60%);
          z-index: 0;
        }
        .at-story-ghost {
          position: absolute; right: -2vw; top: 50%;
          transform: translateY(-50%);
          font-family: var(--play);
          font-size: clamp(80px, 14vw, 200px);
          font-weight: 900; font-style: italic;
          color: rgba(255,255,255,0.06);
          pointer-events: none; user-select: none;
          line-height: 1;
        }
        .at-story-inner {
          position: relative; z-index: 1;
          max-width: 680px;
        }
        .at-story-quote-mark {
          font-family: var(--play);
          font-size: 120px; font-weight: 900; font-style: italic;
          color: rgba(255,255,255,0.2);
          line-height: 0.5; display: block;
          margin-bottom: 16px;
        }
        .at-story-text {
          font-family: var(--play);
          font-size: clamp(22px, 2.5vw, 32px);
          font-weight: 700; font-style: italic;
          color: var(--white); line-height: 1.45;
          margin-bottom: 24px;
        }
        .at-story-attr {
          font-family: var(--mont);
          font-size: 11px; font-weight: 700;
          letter-spacing: 0.22em; text-transform: uppercase;
          color: rgba(255,255,255,0.65);
          display: flex; align-items: center; gap: 12px;
        }
        .at-story-attr::before {
          content: ''; width: 24px; height: 1.5px;
          background: rgba(255,255,255,0.4); flex-shrink: 0;
        }

        /* ══════════════════════════════════════
           8. SOCIAL PROOF
        ══════════════════════════════════════ */
        .at-testi-section {
          background: var(--black2);
          padding: 100px 6vw;
          border-top: 1px solid var(--rule);
        }
        .at-testi-header { text-align: center; margin-bottom: 64px; }

        .at-testi-overline {
          font-family: var(--mont);
          font-size: 9px; font-weight: 800;
          letter-spacing: 0.36em; text-transform: uppercase;
          color: var(--red); margin-bottom: 16px;
          display: flex; align-items: center; justify-content: center; gap: 12px;
        }
        .at-testi-overline::before,
        .at-testi-overline::after {
          content: ''; flex: 1; max-width: 40px; height: 1px;
          background: rgba(221,24,59,0.4);
        }

        .at-testi-h2 {
          font-family: var(--play);
          font-size: clamp(28px, 3vw, 44px);
          font-weight: 900; line-height: 0.95;
          letter-spacing: -0.02em; color: var(--white);
        }
        .at-testi-h2 em { font-style: italic; font-weight: 400; color: var(--red); }

        .at-testi-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2px;
        }
        .at-testi-card {
          background: rgba(255,255,255,0.025);
          padding: 36px 28px;
          border-top: 2px solid transparent;
          transition: border-color 0.25s;
        }
        .at-testi-card:hover { border-top-color: var(--red); }
        .at-testi-stars {
          color: #F5A623; font-size: 13px;
          letter-spacing: 2px; margin-bottom: 16px;
          display: block;
        }
        .at-testi-quote {
          font-family: var(--play);
          font-size: 16px; font-weight: 400; font-style: italic;
          color: rgba(255,255,255,0.75); line-height: 1.7;
          margin: 0 0 24px;
        }
        .at-testi-meta {
          display: flex; flex-direction: column; gap: 3px;
        }
        .at-testi-name {
          font-family: var(--mont);
          font-size: 11px; font-weight: 700;
          letter-spacing: 0.12em; text-transform: uppercase;
          color: var(--white);
        }
        .at-testi-occ {
          font-family: var(--mont);
          font-size: 10px; font-weight: 400;
          color: rgba(255,255,255,0.3);
          letter-spacing: 0.08em;
        }

        /* ══════════════════════════════════════
           9. FINAL CTA
        ══════════════════════════════════════ */
        .at-cta-section {
          background: var(--black);
          padding: 120px 6vw;
          display: flex; flex-direction: column;
          align-items: center; text-align: center;
          position: relative; overflow: hidden;
        }

        .at-cta-bg-img {
          position: absolute; inset: 0;
          background:
            linear-gradient(to bottom,
              rgba(15,15,15,0.7) 0%,
              rgba(15,15,15,0.5) 50%,
              rgba(15,15,15,0.85) 100%),
            url('https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=1400&q=80&fit=crop')
            center/cover no-repeat;
          z-index: 0;
        }

        .at-cta-inner { position: relative; z-index: 1; max-width: 640px; }

        .at-cta-overline {
          font-family: var(--mont);
          font-size: 9px; font-weight: 800;
          letter-spacing: 0.36em; text-transform: uppercase;
          color: var(--red); margin-bottom: 24px;
          display: flex; align-items: center; justify-content: center; gap: 12px;
        }
        .at-cta-overline::before,
        .at-cta-overline::after {
          content: ''; flex: 1; max-width: 36px; height: 1px;
          background: rgba(221,24,59,0.4);
        }

        .at-cta-h2 {
          font-family: var(--play);
          font-size: clamp(40px, 5vw, 72px);
          font-weight: 900; line-height: 0.9;
          letter-spacing: -0.025em; color: var(--white);
          margin-bottom: 20px;
        }
        .at-cta-h2 em {
          font-style: italic; font-weight: 400; color: var(--red);
          display: block;
        }

        .at-cta-body {
          font-family: var(--mont);
          font-size: 15px; font-weight: 400;
          color: rgba(255,255,255,0.5); line-height: 1.85;
          margin-bottom: 44px;
        }

        .at-cta-btns {
          display: flex; align-items: center; justify-content: center;
          gap: 12px; flex-wrap: wrap;
        }
        .at-cta-btn-main {
          display: inline-flex; align-items: center; gap: 10px;
          background: var(--red); color: var(--white);
          padding: 18px 40px;
          font-family: var(--mont);
          font-size: 10px; font-weight: 800;
          letter-spacing: 0.2em; text-transform: uppercase;
          text-decoration: none;
          transition: background 0.2s, transform 0.15s;
        }
        .at-cta-btn-main:hover { background: var(--red-d); transform: translateY(-2px); }
        .at-cta-btn-sec {
          display: inline-flex; align-items: center; gap: 8px;
          border: 1.5px solid rgba(255,255,255,0.15);
          color: rgba(255,255,255,0.55);
          padding: 18px 32px;
          font-family: var(--mont);
          font-size: 10px; font-weight: 700;
          letter-spacing: 0.18em; text-transform: uppercase;
          text-decoration: none;
          transition: border-color 0.2s, color 0.2s;
        }
        .at-cta-btn-sec:hover { border-color: rgba(255,255,255,0.5); color: var(--white); }

        /* ══════════════════════════════════════
           RESPONSIVE
        ══════════════════════════════════════ */
        @media (max-width: 960px) {
          .at-prob-section { grid-template-columns: 1fr; gap: 48px; }
          .at-how-steps { grid-template-columns: 1fr 1fr; }
          .at-how-step:nth-child(even) { margin-top: 0; }
          .at-diff-grid { grid-template-columns: 1fr 1fr; }
          .at-diff-header { grid-template-columns: 1fr; gap: 24px; }
          .at-bts-grid { grid-template-columns: 1fr 1fr; }
          .at-bts-img:first-child { grid-row: span 1; min-height: 300px; grid-column: span 2; }
          .at-testi-grid { grid-template-columns: 1fr 1fr; }
          .at-bts-story { grid-template-columns: 1fr; text-align: center; }
          .at-bts-story-line { display: none; }
        }
        @media (max-width: 640px) {
          .at-how-steps { grid-template-columns: 1fr; }
          .at-diff-grid { grid-template-columns: 1fr; }
          .at-testi-grid { grid-template-columns: 1fr; }
          .at-bts-grid { grid-template-columns: 1fr; }
          .at-bts-img:first-child { grid-column: span 1; }
          .at-cta-btns { flex-direction: column; align-items: stretch; }
          .at-cta-btn-main, .at-cta-btn-sec { justify-content: center; }
        }
      `}</style>

      {/* ═══ 1. HERO ═══════════════════════════════════════════════════════════ */}
      <section className="at-hero">
        <div className="at-hero-bar" />
        <div className="at-hero-img" />

        <div className="at-hero-inner">
          <motion.div
            className="at-hero-pill"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: EASE, delay: 0.1 }}
          >
            <span className="at-hero-pill-dot" />
            Nigeria's Premium Gift Studio
          </motion.div>

          <motion.h1
            className="at-hero-h1"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.25 }}
          >
            We Help You Create
            <em>Moments That Matter</em>
          </motion.h1>

          <motion.p
            className="at-hero-sub"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.45 }}
          >
            Because sometimes, words aren't enough —
            and the people you love deserve more than a last-minute gift.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.6 }}
          >
            <Link href="/shop" className="at-hero-cta">
              Create Your Gift →
            </Link>
          </motion.div>
        </div>

        <div className="at-hero-scroll">
          <span>Scroll</span>
          <div className="at-hero-scroll-line" />
        </div>
      </section>

      {/* ═══ 2. THE PROBLEM ════════════════════════════════════════════════════ */}
      <section className="at-prob-section">
        <Reveal>
          <div className="at-prob-left">
            <div className="at-prob-ghost">?</div>
            <div className="at-prob-overline">We Get It</div>
            <h2 className="at-prob-h2">
              We've all been
              <br />there
              <em>before.</em>
            </h2>
          </div>
        </Reveal>

        <Reveal>
          <div className="at-prob-right">
            {[
              {
                emoji: "😞",
                text: "You want to make someone feel truly special — but <strong>you don't know how to go beyond a simple 'happy birthday.'</strong>",
              },
              {
                emoji: "🛍️",
                text: "You walk into a gift shop and find the same generic mugs, teddy bears, and imported items with <strong>no soul and no story.</strong>",
              },
              {
                emoji: "⏰",
                text: "You spend hours searching, panic-buying something mediocre, and it <strong>never quite captures how you really feel.</strong>",
              },
              {
                emoji: "💔",
                text: "The occasion passes. The gift is forgotten. And the moment — <strong>that once-in-a-lifetime moment</strong> — is gone.",
              },
            ].map((s, i) => (
              <motion.div key={i} className="at-prob-scenario" variants={fadeUp}>
                <span className="at-prob-scenario-emoji">{s.emoji}</span>
                <p dangerouslySetInnerHTML={{ __html: s.text }} />
              </motion.div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* ═══ 3. THE SOLUTION ═══════════════════════════════════════════════════ */}
      <section className="at-sol-section">
        <div className="at-sol-bg-text">Lensra.</div>
        <Reveal>
          <div className="at-sol-inner">
            <div className="at-sol-overline">The Answer</div>
            <motion.h2 className="at-sol-h2" variants={fadeUp}>
              That's exactly why
              <br />
              <em>we built Lensra.</em>
            </motion.h2>
            <motion.p className="at-sol-body" variants={fadeUp}>
              To help you turn <strong>memories, emotions, and love</strong> into
              something real that people can hold, unwrap, and remember forever.
              We take your photos, your words, and your feelings — and transform
              them into a beautifully crafted personalised gift, delivered to your
              loved one's door.
            </motion.p>
            <motion.div variants={fadeUp}>
              <Link href="/shop" className="at-hero-cta" style={{ display: "inline-flex" }}>
                See Our Gifts →
              </Link>
            </motion.div>
          </div>
        </Reveal>
      </section>

      {/* ═══ 4. HOW IT WORKS ═══════════════════════════════════════════════════ */}
      <section className="at-how-section">
        <Reveal>
          <div className="at-how-header">
            <div className="at-how-overline">How It Works</div>
            <h2 className="at-how-h2">
              Simple for you.
              <em>Magical for them.</em>
            </h2>
          </div>
        </Reveal>

        <Reveal>
          <div className="at-how-steps">
            {[
              {
                n: "01", icon: "📸",
                title: "You share",
                body: "Send us your photos, names, and a personal message. Takes less than 5 minutes.",
              },
              {
                n: "02", icon: "🎨",
                title: "We design",
                body: "Our team handcrafts your personalised gift — every detail tailored specifically for your person.",
              },
              {
                n: "03", icon: "📦",
                title: "We package",
                body: "Beautifully wrapped and packed with care. Every order is inspected before it leaves our hands.",
              },
              {
                n: "04", icon: "🚚",
                title: "We deliver",
                body: "Delivered nationwide in 3–5 days via GIG Logistics. Trackable and insured to your door.",
              },
            ].map(step => (
              <motion.div key={step.n} className="at-how-step" variants={fadeUp}>
                <span className="at-how-step-num">{step.n}</span>
                <span className="at-how-step-icon">{step.icon}</span>
                <h4>{step.title}</h4>
                <p>{step.body}</p>
              </motion.div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* ═══ 5. WHAT MAKES US DIFFERENT ════════════════════════════════════════ */}
      <section className="at-diff-section">
        <Reveal>
          <div className="at-diff-header">
            <div>
              <div className="at-diff-overline">Why Lensra</div>
              <h2 className="at-diff-h2">
                Not just a gift.
                <em>An experience.</em>
              </h2>
            </div>
            <p className="at-diff-lead">
              Anyone can buy a gift. <strong>We help you give a moment</strong> —
              one that makes the person on the other end feel seen, valued, and
              deeply loved. Here's what makes us different.
            </p>
          </div>
        </Reveal>

        <Reveal>
          <div className="at-diff-grid">
            <Diff
              icon="🎯"
              title="100% Personalised"
              body="Every single gift is made specifically for your recipient. Names, photos, messages — nothing is generic."
            />
            <Diff
              icon="✋"
              title="Handcrafted with Care"
              body="No factory lines. Real hands, real craft, real attention to every detail on every order."
            />
            <Diff
              icon="💛"
              title="Emotion First"
              body="We don't think about products — we think about the moment someone opens your gift and bursts into tears."
            />
            <Diff
              icon="🇳🇬"
              title="Proudly Nigerian"
              body="Built in Benin City, delivering to all 36 states. We celebrate Nigerian culture in every piece we make."
            />
          </div>
        </Reveal>
      </section>

      {/* ═══ 6. BEHIND THE SCENES ══════════════════════════════════════════════ */}
      <section className="at-bts-section">
        <Reveal>
          <div className="at-bts-header">
            <div className="at-bts-overline">Behind The Scenes</div>
            <h2 className="at-bts-h2">
              Made by real hands,
              <em>with real love.</em>
            </h2>
          </div>
        </Reveal>

        <Reveal>
          <div className="at-bts-grid">
            {[
              {
                src: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&q=80&fit=crop",
                label: "The Final Product",
                tall: true,
              },
              {
                src: "https://images.unsplash.com/photo-1607082349566-187342175e2f?w=600&q=80&fit=crop",
                label: "The Crafting Process",
              },
              {
                src: "https://images.unsplash.com/photo-1513519107519-8ff31a7cd9b7?w=600&q=80&fit=crop",
                label: "The Packaging",
              },
              {
                src: "https://images.unsplash.com/photo-1512909006721-3d6018887383?w=600&q=80&fit=crop",
                label: "The Reaction",
              },
              {
                src: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80&fit=crop",
                label: "The Details",
              },
            ].map((img, i) => (
              <motion.div key={i} className="at-bts-img" variants={fadeIn}>
                <img src={img.src} alt={img.label} loading="lazy" />
                <div className="at-bts-img-label">{img.label}</div>
              </motion.div>
            ))}
          </div>
        </Reveal>

        <div className="at-bts-story">
          <div className="at-bts-story-line" />
          <div className="at-bts-story-inner">
            <h3 className="at-bts-story-h3">
              "Started with a simple idea — to make gifting more meaningful."
            </h3>
            <p className="at-bts-story-p">
              Today, we help hundreds of people across Nigeria express what words alone
              cannot. Every order that leaves our studio carries a piece of someone's
              love in it. That responsibility is something we take seriously.
            </p>
          </div>
          <div className="at-bts-story-line" />
        </div>
      </section>

      {/* ═══ 7. YOUR STORY ═════════════════════════════════════════════════════ */}
      <section className="at-story-section">
        <div className="at-story-bg" />
        <div className="at-story-ghost">Lensra.</div>
        <Reveal>
          <div className="at-story-inner">
            <motion.span className="at-story-quote-mark" variants={fadeIn}>"</motion.span>
            <motion.p className="at-story-text" variants={fadeUp}>
              We couldn't find a single gift brand in Nigeria that felt
              truly intentional, truly personal, truly ours.
              So we stopped looking — and built it ourselves.
            </motion.p>
            <motion.div className="at-story-attr" variants={fadeUp}>
              Lensra · Est. 2024 · Benin City, Nigeria
            </motion.div>
          </div>
        </Reveal>
      </section>

      {/* ═══ 8. SOCIAL PROOF ═══════════════════════════════════════════════════ */}
      <section className="at-testi-section">
        <Reveal>
          <div className="at-testi-header">
            <div className="at-testi-overline">Real Customers. Real Reactions.</div>
            <h2 className="at-testi-h2">
              Don't take our word
              <em>for it.</em>
            </h2>
          </div>
        </Reveal>

        <Reveal>
          <div className="at-testi-grid">
            <Testimonial
              quote="My mum literally cried when she opened it. I've never seen her react like that to a gift before. Lensra understood exactly what I wanted."
              name="Chiamaka O."
              occasion="Mother's Day Gift"
            />
            <Testimonial
              quote="The quality is incredible. I was skeptical ordering online but when my boyfriend saw his name on the box, he couldn't believe it was made in Nigeria."
              name="Temi A."
              occasion="Birthday Surprise Box"
            />
            <Testimonial
              quote="Fast delivery, beautiful packaging, and the personalisation made it feel like a ₦50k gift for a fraction of the price. 100% ordering again."
              name="Emeka D."
              occasion="Anniversary Gift"
            />
          </div>
        </Reveal>
      </section>

      {/* ═══ 9. FINAL CTA ══════════════════════════════════════════════════════ */}
      <section className="at-cta-section">
        <div className="at-cta-bg-img" />
        <Reveal>
          <div className="at-cta-inner">
            <motion.div className="at-cta-overline" variants={fadeUp}>
              Ready?
            </motion.div>
            <motion.h2 className="at-cta-h2" variants={fadeUp}>
              Make someone feel
              <em>truly special.</em>
            </motion.h2>
            <motion.p className="at-cta-body" variants={fadeUp}>
              Browse our personalised gifts. Pick what feels right,
              tell us the details — and we'll handle everything else.
            </motion.p>
            <motion.div className="at-cta-btns" variants={fadeUp}>
              <Link href="/shop" className="at-cta-btn-main">
                Create Your Gift →
              </Link>
              <a
                href="https://wa.me/2348051385049"
                target="_blank"
                rel="noopener noreferrer"
                className="at-cta-btn-sec"
              >
                💬 Chat with Us
              </a>
            </motion.div>
          </div>
        </Reveal>
      </section>
    </>
  );
}