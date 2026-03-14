"use client";

// app/shop/[id]/ClientProductDetail.tsx
// Adire — Product Detail Page
// Bold, cultural, unapologetically Nigerian
// Fonts: Playfair Display · Syne
// Palette: indigo · amber · cream · terracotta · forest

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Heart, Palette, Loader2, ShoppingBag, Plus, Minus,
  Sparkles, Check, ChevronDown, ChevronLeft, ChevronRight,
  X, Share2, Truck, Shield, RotateCcw, Zap, Clock,
  Award, MessageCircle, Info,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";

// ── Types ─────────────────────────────────────────────────────────────────────

interface AttributeValue { id: number; attribute_name: string; value: string; }
interface ProductVariant { id: number; attributes: AttributeValue[]; price_override: string | null; stock_quantity: number; }
interface ProductImage   { id: number; image_url: string; alt_text: string; }

interface ProductDetail {
  id: number; name: string; slug: string; description: string;
  base_price: string; display_price?: string; original_price?: string | null;
  is_on_sale?: boolean; sale_label?: string | null; sale_ends_in?: number | null;
  category_name: string; image_url: string | null;
  gallery: ProductImage[]; variants: ProductVariant[];
  min_order_quantity: number; is_customizable: boolean; message: string | null;
}

// ── Constants ─────────────────────────────────────────────────────────────────

const EMOTIONS = [
  { id: "loved",       label: "Loved",       emoji: "❤️" },
  { id: "joyful",      label: "Joyful",      emoji: "😊" },
  { id: "emotional",   label: "Emotional",   emoji: "🥹" },
  { id: "appreciated", label: "Appreciated", emoji: "🙏" },
  { id: "remembered",  label: "Remembered",  emoji: "💭" },
];

const TRUST = [
  { Icon: Truck,     title: "3–5 Day Delivery", sub: "Nationwide via GIG",    accent: true  },
  { Icon: Shield,    title: "Secure Payment",   sub: "Powered by Paystack",   accent: false },
  { Icon: RotateCcw, title: "Easy Returns",     sub: "30-day guarantee",      accent: true  },
  { Icon: Award,     title: "Handmade Quality", sub: "Crafted in Benin City", accent: false },
];

// ── Ankara pattern ────────────────────────────────────────────────────────────

function AnkaraPattern({ opacity = 0.07, color = "#C17B3A" }: { opacity?: number; color?: string }) {
  return (
    <svg aria-hidden style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", opacity }}>
      <defs>
        <pattern id="adp" x="0" y="0" width="48" height="48" patternUnits="userSpaceOnUse">
          <circle cx="24" cy="24" r="4"  fill={color} />
          <circle cx="24" cy="24" r="10" fill="none" stroke={color} strokeWidth="0.6" />
          <circle cx="24" cy="24" r="16" fill="none" stroke={color} strokeWidth="0.35" />
          <circle cx="24" cy="24" r="22" fill="none" stroke={color} strokeWidth="0.2" />
          <line x1="0" y1="24" x2="48" y2="24" stroke={color} strokeWidth="0.2" />
          <line x1="24" y1="0" x2="24" y2="48" stroke={color} strokeWidth="0.2" />
          <line x1="0" y1="0"  x2="48" y2="48" stroke={color} strokeWidth="0.15" />
          <line x1="48" y1="0" x2="0"  y2="48" stroke={color} strokeWidth="0.15" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#adp)" />
    </svg>
  );
}

function Grain() {
  return (
    <svg aria-hidden style={{ position: "fixed", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 9999, opacity: 0.022, mixBlendMode: "multiply" }}>
      <filter id="gf"><feTurbulence type="fractalNoise" baseFrequency="0.72" numOctaves="3" stitchTiles="stitch" /><feColorMatrix type="saturate" values="0" /></filter>
      <rect width="100%" height="100%" filter="url(#gf)" />
    </svg>
  );
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function ClientProductDetail({
  initialProduct, initialRelatedProducts, baseUrl,
}: {
  initialProduct: ProductDetail;
  initialRelatedProducts: ProductDetail[];
  baseUrl: string;
}) {
  const router = useRouter();
  const { token } = useAuth();

  const [product]         = useState<ProductDetail>(initialProduct);
  const [related]         = useState<ProductDetail[]>(initialRelatedProducts);
  const [isAdding,        setIsAdding]        = useState(false);
  const [successModal,    setSuccessModal]    = useState(false);
  const [activeTab,       setActiveTab]       = useState<"details" | "shipping">("details");
  const [imgIdx,          setImgIdx]          = useState(0);
  const [imgModal,        setImgModal]        = useState(false);
  const [fav,             setFav]             = useState(false);
  const [surprise,        setSurprise]        = useState(false);
  const [emotion,         setEmotion]         = useState<string | null>(null);
  const [msg,             setMsg]             = useState("");
  const [qty,             setQty]             = useState(initialProduct.min_order_quantity || 1);
  const [remaining,       setRemaining]       = useState(initialProduct.sale_ends_in || 0);
  const [selectedAttrs,   setSelectedAttrs]   = useState<Record<string, string>>(() => {
    if (initialProduct.variants?.length > 0) {
      const init: Record<string, string> = {};
      initialProduct.variants[0].attributes.forEach(a => { init[a.attribute_name] = a.value; });
      return init;
    }
    return {};
  });

  const allImages = [product.image_url, ...product.gallery.map(g => g.image_url)].filter(Boolean) as string[];
  const attrTypes = Array.from(new Set(product.variants?.flatMap(v => v.attributes.map(a => a.attribute_name)) || []));

  const activeVariant = useMemo(() =>
    product.variants?.find(v => v.attributes.every(a => selectedAttrs[a.attribute_name] === a.value)) || null,
    [selectedAttrs, product]);

  const currentPrice = useMemo(() =>
    activeVariant?.price_override || product.display_price || product.base_price || "0",
    [activeVariant, product]);

  const stock = activeVariant?.stock_quantity ?? Infinity;
  const discount = product.is_on_sale && product.original_price
    ? Math.round(((parseFloat(product.original_price) - parseFloat(currentPrice)) / parseFloat(product.original_price)) * 100)
    : 0;

  const MIN_MSG = 50; const MAX_MSG = 300;
  const surpriseValid = !surprise || (emotion && msg.length >= MIN_MSG && msg.length <= MAX_MSG);

  useEffect(() => {
    if (!product.is_on_sale || remaining <= 0) return;
    const t = setInterval(() => setRemaining(p => p <= 1 ? (clearInterval(t), 0) : p - 1), 1000);
    return () => clearInterval(t);
  }, [remaining, product.is_on_sale]);

  const fmt = (s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return `${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}:${String(sec).padStart(2,"0")}`;
  };

  const addToCart = async (checkout = false) => {
    if (!surpriseValid) return;
    setIsAdding(true);
    let sid = localStorage.getItem("guest_session_id");
    if (!sid) { sid = crypto.randomUUID(); localStorage.setItem("guest_session_id", sid); }
    try {
      const res = await fetch(`${baseUrl}api/orders/cart/`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(token && { Authorization: `Bearer ${token}` }) },
        body: JSON.stringify({
          product: product.id, variant: activeVariant?.id || null, quantity: qty,
          secret_message: surprise ? msg : null, emotion: surprise ? emotion : null,
          ...(!token && { session_id: sid }),
        }),
      });
      if (res.ok) {
        window.dispatchEvent(new Event("storage"));
        checkout ? router.push("/checkout") : setSuccessModal(true);
      }
    } catch (e) { console.error(e); }
    finally { setIsAdding(false); }
  };

  const prevImg = () => setImgIdx(p => (p - 1 + allImages.length) % allImages.length);
  const nextImg = () => setImgIdx(p => (p + 1) % allImages.length);

  const isDisabled = isAdding || (product.variants.length > 0 && !activeVariant) || qty > stock || stock === 0 || !surpriseValid;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=Syne:wght@400;500;600;700;800&display=swap');

        :root {
          --indigo:  #1B2A4A; --indigo-d: #0e1a30;
          --amber:   #C17B3A; --amber-l: #D4956A; --amber-p: #F0DFC4;
          --cream:   #F5F0E8; --cream-l: #FDF9F4;
          --terra:   #8B3A2A; --forest: #2A4A2E;
          --cocoa:   #2C1810; --muted: #7A6E60; --rule: #E2D4BE;
          --disp: 'Playfair Display', Georgia, serif;
          --body: 'Syne', system-ui, sans-serif;
          --ease: cubic-bezier(0.16,1,0.3,1);
        }
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: var(--cream); color: var(--cocoa); font-family: var(--body); -webkit-font-smoothing: antialiased; overflow-x: hidden; }

        /* ── STICKY NAV ── */
        .ad-pd-nav {
          position: sticky; top: 0; z-index: 100;
          background: rgba(245,240,232,0.97);
          backdrop-filter: blur(16px);
          border-bottom: 1px solid var(--rule);
          padding: 0 5vw; height: 64px;
          display: flex; align-items: center;
          justify-content: space-between;
        }
        .ad-pd-back {
          display: flex; align-items: center; gap: 8px;
          font-family: var(--body); font-size: 11px; font-weight: 700;
          letter-spacing: 0.22em; text-transform: uppercase;
          color: var(--indigo); background: none; border: none; cursor: pointer;
          transition: color 0.2s;
        }
        .ad-pd-back:hover { color: var(--amber); }
        .ad-pd-nav-actions { display: flex; gap: 8px; }
        .ad-pd-icon-btn {
          width: 40px; height: 40px;
          display: flex; align-items: center; justify-content: center;
          background: none; border: 1px solid var(--rule); cursor: pointer;
          color: var(--muted); transition: all 0.2s;
        }
        .ad-pd-icon-btn:hover { border-color: var(--amber); color: var(--amber); }
        .ad-pd-icon-btn.fav-active { color: var(--terra); border-color: var(--terra); background: rgba(139,58,42,0.06); }

        /* ── MAIN LAYOUT ── */
        .ad-pd-main {
          max-width: 1400px; margin: 0 auto;
          padding: 56px 5vw 100px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 64px; align-items: start;
        }

        /* ── LEFT: IMAGE ── */
        .ad-pd-gallery { position: sticky; top: 80px; }

        .ad-pd-main-img-wrap {
          position: relative; aspect-ratio: 3/4;
          overflow: hidden; background: var(--amber-p);
          cursor: zoom-in;
        }
        .ad-pd-main-img {
          width: 100%; height: 100%; object-fit: cover;
          transition: transform 0.8s var(--ease);
        }
        .ad-pd-main-img-wrap:hover .ad-pd-main-img { transform: scale(1.04); }

        /* Discount badge — angular not circular */
        .ad-discount-badge {
          position: absolute; top: 20px; right: 20px;
          background: var(--terra); color: #fff;
          padding: 10px 14px; text-align: center;
          font-family: var(--body);
        }
        .ad-discount-pct {
          font-size: 28px; font-weight: 800; line-height: 1; display: block;
        }
        .ad-discount-label {
          font-size: 9px; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase;
        }

        .ad-stock-pill {
          position: absolute; top: 20px; left: 20px;
          background: var(--indigo); color: var(--cream);
          padding: 6px 14px;
          font-size: 10px; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase;
          display: flex; align-items: center; gap: 6px;
        }

        /* Prev/next arrows */
        .ad-img-arrow {
          position: absolute; top: 50%; transform: translateY(-50%);
          width: 44px; height: 44px;
          background: var(--cream); color: var(--indigo);
          border: none; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          opacity: 0; transition: opacity 0.2s, background 0.2s;
        }
        .ad-pd-main-img-wrap:hover .ad-img-arrow { opacity: 1; }
        .ad-img-arrow:hover { background: var(--amber); color: #fff; }
        .ad-img-arrow-l { left: 12px; }
        .ad-img-arrow-r { right: 12px; }

        .ad-img-counter {
          position: absolute; bottom: 14px; right: 14px;
          background: rgba(27,42,74,0.75);
          color: var(--cream);
          font-size: 10px; font-weight: 700; letter-spacing: 0.15em;
          padding: 5px 12px;
        }

        /* Thumbnails */
        .ad-thumbnails {
          display: grid; grid-template-columns: repeat(5, 1fr);
          gap: 8px; margin-top: 12px;
        }
        .ad-thumb {
          aspect-ratio: 1; overflow: hidden;
          background: var(--amber-p);
          border: 2px solid transparent; cursor: pointer;
          transition: border-color 0.2s, opacity 0.2s;
          opacity: 0.55;
        }
        .ad-thumb.active { border-color: var(--amber); opacity: 1; }
        .ad-thumb:hover { opacity: 0.9; }
        .ad-thumb img { width: 100%; height: 100%; object-fit: cover; }

        /* Trust badges */
        .ad-trust-grid {
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 2px; margin-top: 28px;
          border-top: 1px solid var(--rule); padding-top: 24px;
        }
        .ad-trust-card {
          display: flex; align-items: flex-start; gap: 12px;
          padding: 16px;
          background: var(--cream-l);
        }
        .ad-trust-icon {
          width: 40px; height: 40px; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
        }
        .ad-trust-icon.accent { background: var(--amber); color: #fff; }
        .ad-trust-icon.plain  { background: var(--indigo); color: #fff; }
        .ad-trust-title {
          font-size: 12px; font-weight: 700; color: var(--indigo); display: block;
        }
        .ad-trust-sub {
          font-size: 11px; font-weight: 400; color: var(--muted); display: block; margin-top: 1px;
        }

        /* ── RIGHT: INFO ── */
        .ad-pd-info { display: flex; flex-direction: column; gap: 0; }

        /* Category + label row */
        .ad-pd-tag-row {
          display: flex; align-items: center; gap: 8px;
          flex-wrap: wrap; margin-bottom: 20px;
        }
        .ad-pd-cat-tag {
          padding: 6px 16px;
          font-family: var(--body); font-size: 9px; font-weight: 800;
          letter-spacing: 0.32em; text-transform: uppercase;
          background: var(--indigo); color: var(--cream);
        }
        .ad-pd-sale-tag {
          padding: 6px 16px;
          font-family: var(--body); font-size: 9px; font-weight: 800;
          letter-spacing: 0.28em; text-transform: uppercase;
          background: var(--terra); color: #fff;
          display: flex; align-items: center; gap: 6px;
        }

        /* Product name */
        .ad-pd-name {
          font-family: var(--disp);
          font-size: clamp(36px, 5vw, 64px);
          font-weight: 900; line-height: 0.9;
          letter-spacing: -0.03em; color: var(--indigo);
          margin-bottom: 28px;
        }

        /* Price block */
        .ad-pd-price-block {
          padding: 24px 0;
          border-top: 1px solid var(--rule);
          border-bottom: 1px solid var(--rule);
          margin-bottom: 28px;
        }
        .ad-pd-price {
          font-family: var(--disp);
          font-size: clamp(40px, 5vw, 64px);
          font-weight: 900; color: var(--indigo); line-height: 1;
        }
        .ad-pd-original {
          font-family: var(--disp);
          font-size: 24px; font-weight: 400;
          color: var(--muted); text-decoration: line-through;
          margin-left: 16px;
        }
        .ad-pd-timer {
          display: inline-flex; align-items: center; gap: 10px;
          background: var(--terra); color: #fff;
          padding: 10px 20px; margin-top: 14px;
          font-family: var(--body); font-size: 12px; font-weight: 700;
          letter-spacing: 0.1em;
        }
        .ad-pd-timer-count {
          background: #fff; color: var(--terra);
          font-size: 14px; font-weight: 800;
          padding: 3px 10px;
        }

        /* Description */
        .ad-pd-desc {
          font-size: 15px; font-weight: 400;
          color: var(--muted); line-height: 1.85;
          margin-bottom: 28px;
        }

        /* Special note */
        .ad-pd-note {
          background: rgba(193,123,58,0.07);
          border-left: 3px solid var(--amber);
          padding: 16px 20px; margin-bottom: 28px;
          display: flex; gap: 12px;
        }
        .ad-pd-note p { font-size: 14px; font-weight: 400; color: var(--cocoa); line-height: 1.75; }

        /* ── SECRET MESSAGE ── */
        .ad-surprise-toggle {
          width: 100%;
          display: flex; align-items: center; justify-content: space-between;
          padding: 20px 24px;
          background: var(--cream-l);
          border: 1.5px solid var(--rule);
          cursor: pointer; transition: all 0.2s;
          margin-bottom: 2px;
        }
        .ad-surprise-toggle.open {
          border-color: var(--amber);
          background: rgba(193,123,58,0.05);
        }
        .ad-surprise-toggle:hover { border-color: var(--amber); }
        .ad-surprise-left { display: flex; align-items: center; gap: 14px; }
        .ad-surprise-icon {
          width: 48px; height: 48px;
          display: flex; align-items: center; justify-content: center;
          background: var(--amber-p); color: var(--amber);
          transition: all 0.2s;
        }
        .ad-surprise-toggle.open .ad-surprise-icon { background: var(--amber); color: #fff; }
        .ad-surprise-title {
          font-family: var(--disp);
          font-size: 18px; font-weight: 700; color: var(--indigo);
        }
        .ad-surprise-sub {
          font-size: 11px; font-weight: 500; color: var(--muted);
          letter-spacing: 0.08em; display: block; margin-top: 2px;
        }
        .ad-surprise-body {
          border: 1.5px solid var(--amber);
          border-top: none; padding: 28px;
          background: var(--cream-l); margin-bottom: 28px;
          overflow: hidden;
        }
        .ad-step-label {
          font-size: 9px; font-weight: 800;
          letter-spacing: 0.38em; text-transform: uppercase;
          color: var(--amber); margin-bottom: 14px;
          display: flex; align-items: center; gap: 10px;
        }
        .ad-step-num {
          width: 24px; height: 24px;
          background: var(--amber); color: #fff;
          font-size: 11px; font-weight: 800;
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
        }
        .ad-emotions {
          display: grid; grid-template-columns: repeat(5, 1fr);
          gap: 8px; margin-bottom: 24px;
        }
        .ad-emotion-btn {
          padding: 12px 8px;
          background: var(--cream-l); border: 1.5px solid var(--rule);
          cursor: pointer; text-align: center;
          transition: all 0.2s; display: flex; flex-direction: column;
          align-items: center; gap: 6px;
        }
        .ad-emotion-btn.active { border-color: var(--amber); background: rgba(193,123,58,0.08); }
        .ad-emotion-emoji { font-size: 24px; display: block; }
        .ad-emotion-label {
          font-size: 9px; font-weight: 700;
          letter-spacing: 0.15em; text-transform: uppercase; color: var(--muted);
        }
        .ad-emotion-btn.active .ad-emotion-label { color: var(--amber); }
        .ad-msg-area {
          width: 100%; background: #fff;
          border: 1.5px solid var(--rule); color: var(--cocoa);
          font-family: var(--body); font-size: 14px; font-weight: 400;
          padding: 16px; resize: none; outline: none;
          transition: border-color 0.2s; height: 130px;
        }
        .ad-msg-area:focus { border-color: var(--amber); }
        .ad-msg-area::placeholder { color: var(--muted); }
        .ad-msg-count {
          font-size: 11px; font-weight: 600;
          color: var(--muted); text-align: right; margin-top: 6px;
        }
        .ad-msg-hint {
          font-size: 11px; font-weight: 600;
          color: var(--terra); margin-top: 6px;
          display: flex; align-items: center; gap: 6px;
        }

        /* ── VARIANTS ── */
        .ad-variants-section { padding: 24px 0; border-top: 1px solid var(--rule); }
        .ad-variant-label {
          font-size: 10px; font-weight: 800;
          letter-spacing: 0.32em; text-transform: uppercase;
          color: var(--muted); margin-bottom: 12px; display: block;
        }
        .ad-variant-label span { color: var(--amber); }
        .ad-variant-options { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 20px; }
        .ad-variant-btn {
          padding: 10px 20px;
          font-family: var(--body); font-size: 12px; font-weight: 700;
          background: var(--cream-l); border: 1.5px solid var(--rule);
          color: var(--muted); cursor: pointer;
          transition: all 0.2s;
        }
        .ad-variant-btn:hover { border-color: var(--amber); color: var(--amber); }
        .ad-variant-btn.active { background: var(--indigo); border-color: var(--indigo); color: var(--cream); }
        .ad-color-btn {
          width: 42px; height: 42px; border-radius: 50%;
          border: 2px solid transparent; cursor: pointer;
          transition: all 0.2s; position: relative;
          display: flex; align-items: center; justify-content: center;
        }
        .ad-color-btn.active {
          border-color: var(--amber);
          box-shadow: 0 0 0 3px var(--amber-p);
        }

        /* Quantity */
        .ad-qty-wrap {
          display: inline-flex; align-items: center;
          border: 1.5px solid var(--rule);
        }
        .ad-qty-btn {
          width: 52px; height: 52px;
          display: flex; align-items: center; justify-content: center;
          background: var(--cream-l); border: none; cursor: pointer;
          color: var(--indigo); transition: background 0.2s;
        }
        .ad-qty-btn:hover:not(:disabled) { background: var(--amber-p); }
        .ad-qty-btn:disabled { opacity: 0.3; cursor: not-allowed; }
        .ad-qty-num {
          width: 64px; height: 52px;
          display: flex; align-items: center; justify-content: center;
          font-family: var(--disp); font-size: 22px; font-weight: 700;
          color: var(--indigo);
          border-left: 1px solid var(--rule);
          border-right: 1px solid var(--rule);
        }

        /* ── CTA BUTTONS ── */
        .ad-cta-strip {
          position: sticky; bottom: 0; z-index: 10;
          background: rgba(245,240,232,0.97);
          backdrop-filter: blur(12px);
          padding: 16px 0;
          border-top: 1px solid var(--rule);
          display: flex; flex-direction: column; gap: 10px;
          margin-top: 28px;
        }
        .ad-btn-buy {
          width: 100%; padding: 20px;
          background: var(--amber); color: #fff;
          border: none; cursor: pointer;
          font-family: var(--body); font-size: 12px; font-weight: 800;
          letter-spacing: 0.28em; text-transform: uppercase;
          display: flex; align-items: center; justify-content: center; gap: 10px;
          transition: background 0.2s, transform 0.15s;
        }
        .ad-btn-buy:hover:not(:disabled) { background: var(--amber-l); transform: translateY(-1px); }
        .ad-btn-buy:disabled { opacity: 0.45; cursor: not-allowed; }
        .ad-btn-cart {
          width: 100%; padding: 18px;
          background: none; border: 1.5px solid var(--indigo); color: var(--indigo);
          cursor: pointer;
          font-family: var(--body); font-size: 12px; font-weight: 700;
          letter-spacing: 0.22em; text-transform: uppercase;
          display: flex; align-items: center; justify-content: center; gap: 10px;
          transition: all 0.2s;
        }
        .ad-btn-cart:hover:not(:disabled) { background: var(--indigo); color: var(--cream); }
        .ad-btn-cart:disabled { opacity: 0.45; cursor: not-allowed; }
        .ad-btn-customise {
          width: 100%; padding: 18px;
          background: var(--indigo-d); color: var(--cream);
          border: none; cursor: pointer;
          font-family: var(--body); font-size: 12px; font-weight: 700;
          letter-spacing: 0.22em; text-transform: uppercase;
          display: flex; align-items: center; justify-content: center; gap: 10px;
          transition: background 0.2s;
        }
        .ad-btn-customise:hover { background: var(--indigo); }
        .ad-spin { animation: spin 0.8s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* ── ACCORDION TABS ── */
        .ad-tabs { margin-top: 36px; }
        .ad-tab-item { border-top: 1px solid var(--rule); }
        .ad-tab-item:last-child { border-bottom: 1px solid var(--rule); }
        .ad-tab-trigger {
          width: 100%; display: flex; align-items: center;
          justify-content: space-between;
          padding: 18px 0;
          background: none; border: none; cursor: pointer;
          font-family: var(--disp); font-size: 18px; font-weight: 700;
          color: var(--indigo); text-align: left;
          transition: color 0.2s;
        }
        .ad-tab-trigger:hover { color: var(--amber); }
        .ad-tab-content {
          font-size: 14px; font-weight: 400;
          color: var(--muted); line-height: 1.85;
          padding-bottom: 20px;
          overflow: hidden;
        }

        /* ── RELATED ── */
        .ad-related-section {
          max-width: 1400px; margin: 0 auto;
          padding: 0 5vw 100px;
          border-top: 1px solid var(--rule);
          padding-top: 64px;
        }
        .ad-related-header {
          display: flex; align-items: flex-end;
          justify-content: space-between; margin-bottom: 48px;
        }
        .ad-related-h2 {
          font-family: var(--disp);
          font-size: clamp(28px, 3.5vw, 48px);
          font-weight: 900; color: var(--indigo); line-height: 0.92;
          letter-spacing: -0.02em;
        }
        .ad-related-h2 em { font-style: italic; color: var(--amber); font-weight: 400; }
        .ad-view-all {
          font-family: var(--body); font-size: 11px; font-weight: 700;
          letter-spacing: 0.22em; text-transform: uppercase;
          color: var(--amber); background: none; border: none; cursor: pointer;
          transition: color 0.2s;
        }
        .ad-view-all:hover { color: var(--indigo); }
        .ad-related-grid {
          display: grid; grid-template-columns: repeat(4, 1fr);
          gap: 24px; align-items: start;
        }
        .ad-related-card {
          cursor: pointer;
          transition: transform 0.3s var(--ease);
        }
        .ad-related-card:nth-child(even) { margin-top: 28px; }
        .ad-related-card:hover { transform: translateY(-4px); }
        .ad-related-img-wrap {
          aspect-ratio: 3/4; overflow: hidden;
          background: var(--amber-p); margin-bottom: 12px; position: relative;
        }
        .ad-related-img {
          width: 100%; height: 100%; object-fit: cover;
          transition: transform 0.7s var(--ease);
        }
        .ad-related-card:hover .ad-related-img { transform: scale(1.06); }
        .ad-related-cat {
          font-size: 9px; font-weight: 700;
          letter-spacing: 0.28em; text-transform: uppercase;
          color: var(--amber); display: block; margin-bottom: 4px;
        }
        .ad-related-name {
          font-family: var(--disp);
          font-size: 16px; font-weight: 700; color: var(--indigo);
          line-height: 1.2; margin-bottom: 6px;
          display: -webkit-box; -webkit-line-clamp: 2;
          -webkit-box-orient: vertical; overflow: hidden;
        }
        .ad-related-price {
          font-size: 14px; font-weight: 700; color: var(--muted);
        }

        /* ── MODALS ── */
        .ad-modal-backdrop {
          position: fixed; inset: 0;
          background: rgba(14,26,48,0.88);
          z-index: 500;
          display: flex; align-items: center; justify-content: center;
          padding: 24px;
        }
        .ad-img-modal {
          position: relative; max-width: 92vw; max-height: 90vh;
          display: flex; align-items: center; justify-content: center;
        }
        .ad-img-modal img { max-height: 88vh; max-width: 88vw; object-fit: contain; }
        .ad-modal-close {
          position: absolute; top: -16px; right: -16px;
          width: 44px; height: 44px;
          background: var(--cream); color: var(--indigo);
          border: none; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: background 0.2s;
        }
        .ad-modal-close:hover { background: var(--amber); color: #fff; }
        .ad-modal-arrow {
          position: absolute; top: 50%; transform: translateY(-50%);
          width: 48px; height: 48px;
          background: var(--cream); color: var(--indigo);
          border: none; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: background 0.2s;
        }
        .ad-modal-arrow:hover { background: var(--amber); color: #fff; }
        .ad-modal-arrow-l { left: -64px; }
        .ad-modal-arrow-r { right: -64px; }
        .ad-modal-counter {
          position: absolute; bottom: -40px; left: 50%;
          transform: translateX(-50%);
          font-size: 11px; font-weight: 700;
          letter-spacing: 0.2em; color: rgba(245,240,232,0.6);
        }
        .ad-success-modal {
          background: var(--cream); padding: 56px 48px;
          max-width: 440px; width: 100%; text-align: center;
        }
        .ad-success-check {
          width: 80px; height: 80px;
          background: var(--amber); color: #fff;
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 24px;
        }
        .ad-success-title {
          font-family: var(--disp);
          font-size: 36px; font-weight: 900; color: var(--indigo);
          margin-bottom: 12px;
        }
        .ad-success-body {
          font-size: 14px; font-weight: 400; color: var(--muted);
          line-height: 1.7; margin-bottom: 32px;
        }
        .ad-success-btns { display: flex; flex-direction: column; gap: 10px; }

        /* ── RESPONSIVE ── */
        @media (max-width: 1024px) {
          .ad-pd-main { grid-template-columns: 1fr; gap: 40px; }
          .ad-pd-gallery { position: static; }
          .ad-related-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 600px) {
          .ad-related-grid { grid-template-columns: repeat(2, 1fr); gap: 14px; }
          .ad-related-card:nth-child(even) { margin-top: 20px; }
          .ad-emotions { grid-template-columns: repeat(3, 1fr); }
          .ad-pd-main { padding: 32px 5vw 80px; }
          .ad-modal-arrow-l { left: -8px; }
          .ad-modal-arrow-r { right: -8px; }
        }
      `}</style>

      <Grain />

      {/* ── STICKY NAV ── */}
      <nav className="ad-pd-nav">
        <button className="ad-pd-back" onClick={() => router.back()}>
          <ChevronLeft size={16} /> Back to shop
        </button>
        <div className="ad-pd-nav-actions">
          <button
            className={`ad-pd-icon-btn ${fav ? "fav-active" : ""}`}
            onClick={() => setFav(v => !v)}
            aria-label="Save"
          >
            <Heart size={17} fill={fav ? "currentColor" : "none"} />
          </button>
          <button className="ad-pd-icon-btn" aria-label="Share">
            <Share2 size={17} />
          </button>
        </div>
      </nav>

      {/* ── MAIN GRID ── */}
      <div className="ad-pd-main">

        {/* LEFT: Gallery */}
        <div className="ad-pd-gallery">
          {/* Main image */}
          <div className="ad-pd-main-img-wrap" onClick={() => setImgModal(true)}>
            {allImages[imgIdx] && (
              <img src={allImages[imgIdx]} alt={product.name} className="ad-pd-main-img" />
            )}

            {discount > 0 && (
              <div className="ad-discount-badge">
                <span className="ad-discount-pct">-{discount}%</span>
                <span className="ad-discount-label">Off</span>
              </div>
            )}

            {stock < 10 && stock > 0 && (
              <div className="ad-stock-pill">
                <Zap size={12} /> Only {stock} left
              </div>
            )}

            {allImages.length > 1 && (
              <>
                <button className="ad-img-arrow ad-img-arrow-l"
                  onClick={e => { e.stopPropagation(); prevImg(); }}>
                  <ChevronLeft size={20} />
                </button>
                <button className="ad-img-arrow ad-img-arrow-r"
                  onClick={e => { e.stopPropagation(); nextImg(); }}>
                  <ChevronRight size={20} />
                </button>
              </>
            )}

            <div className="ad-img-counter">{imgIdx + 1} / {allImages.length}</div>
          </div>

          {/* Thumbnails */}
          {allImages.length > 1 && (
            <div className="ad-thumbnails">
              {allImages.slice(0, 5).map((img, i) => (
                <button key={i}
                  className={`ad-thumb ${imgIdx === i ? "active" : ""}`}
                  onClick={() => setImgIdx(i)}
                >
                  <img src={img} alt={`View ${i + 1}`} />
                </button>
              ))}
            </div>
          )}

          {/* Trust badges */}
          <div className="ad-trust-grid">
            {TRUST.map(({ Icon, title, sub, accent }) => (
              <div key={title} className="ad-trust-card">
                <div className={`ad-trust-icon ${accent ? "accent" : "plain"}`}>
                  <Icon size={18} />
                </div>
                <div>
                  <span className="ad-trust-title">{title}</span>
                  <span className="ad-trust-sub">{sub}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT: Product info */}
        <div className="ad-pd-info">

          {/* Tags */}
          <div className="ad-pd-tag-row">
            <span className="ad-pd-cat-tag">{product.category_name}</span>
            {product.is_on_sale && product.sale_label && (
              <span className="ad-pd-sale-tag">
                <Zap size={11} /> {product.sale_label}
              </span>
            )}
          </div>

          {/* Name */}
          <h1 className="ad-pd-name">{product.name}</h1>

          {/* Price */}
          <div className="ad-pd-price-block">
            <div>
              <span className="ad-pd-price">
                ₦{parseFloat(currentPrice).toLocaleString()}
              </span>
              {product.is_on_sale && product.original_price && (
                <span className="ad-pd-original">
                  ₦{parseFloat(product.original_price).toLocaleString()}
                </span>
              )}
            </div>
            {product.is_on_sale && remaining > 0 && (
              <div className="ad-pd-timer">
                <Clock size={14} />
                Sale ends in
                <span className="ad-pd-timer-count">{fmt(remaining)}</span>
              </div>
            )}
          </div>

          {/* Description */}
          <p className="ad-pd-desc">{product.description.split("\n")[0]}</p>

          {/* Special note */}
          {product.message && (
            <div className="ad-pd-note">
              <Info size={18} style={{ color: "var(--amber)", flexShrink: 0, marginTop: 2 }} />
              <p>{product.message}</p>
            </div>
          )}

          {/* Secret message */}
          {!product.is_customizable && (
            <>
              <button
                className={`ad-surprise-toggle ${surprise ? "open" : ""}`}
                onClick={() => setSurprise(v => !v)}
              >
                <div className="ad-surprise-left">
                  <div className="ad-surprise-icon">
                    <Sparkles size={22} />
                  </div>
                  <div style={{ textAlign: "left" }}>
                    <span className="ad-surprise-title">Add a Secret Message</span>
                    <span className="ad-surprise-sub">Create a personal reveal moment</span>
                  </div>
                </div>
                <ChevronDown size={18} style={{
                  color: "var(--muted)",
                  transform: surprise ? "rotate(180deg)" : "none",
                  transition: "transform 0.2s",
                }} />
              </button>

              <AnimatePresence>
                {surprise && (
                  <motion.div
                    className="ad-surprise-body"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="ad-step-label">
                      <span className="ad-step-num">1</span>
                      Pick an emotion
                    </div>
                    <div className="ad-emotions">
                      {EMOTIONS.map(e => (
                        <button key={e.id}
                          className={`ad-emotion-btn ${emotion === e.id ? "active" : ""}`}
                          onClick={() => setEmotion(e.id)}
                        >
                          <span className="ad-emotion-emoji">{e.emoji}</span>
                          <span className="ad-emotion-label">{e.label}</span>
                        </button>
                      ))}
                    </div>

                    <div className="ad-step-label" style={{ marginTop: 8 }}>
                      <span className="ad-step-num">2</span>
                      Write your message
                    </div>
                    <textarea
                      className="ad-msg-area"
                      value={msg}
                      onChange={e => setMsg(e.target.value.slice(0, MAX_MSG))}
                      placeholder="Write something heartfelt that will surprise them when they receive their gift…"
                    />
                    <div className="ad-msg-count">{msg.length} / {MAX_MSG}</div>
                    {msg.length > 0 && msg.length < MIN_MSG && (
                      <p className="ad-msg-hint">
                        <MessageCircle size={13} />
                        {MIN_MSG - msg.length} more characters needed
                      </p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          )}

          {/* Variants + quantity */}
          {attrTypes.length > 0 && (
            <div className="ad-variants-section">
              {attrTypes.map(type => {
                const vals = Array.from(new Set(
                  product.variants.flatMap(v => v.attributes)
                    .filter(a => a.attribute_name === type).map(a => a.value)
                ));
                const isColor = type.toLowerCase().includes("color");
                return (
                  <div key={type} style={{ marginBottom: 20 }}>
                    <span className="ad-variant-label">
                      {type}: <span>{selectedAttrs[type] || "Select"}</span>
                    </span>
                    <div className="ad-variant-options">
                      {vals.map(val => {
                        const active = selectedAttrs[type] === val;
                        if (isColor) {
                          return (
                            <button key={val}
                              className={`ad-color-btn ${active ? "active" : ""}`}
                              style={{ background: val }}
                              title={val}
                              onClick={() => setSelectedAttrs(p => ({ ...p, [type]: val }))}
                            >
                              {active && <Check size={16} style={{ color: "#fff", filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.5))" }} />}
                            </button>
                          );
                        }
                        return (
                          <button key={val}
                            className={`ad-variant-btn ${active ? "active" : ""}`}
                            onClick={() => setSelectedAttrs(p => ({ ...p, [type]: val }))}
                          >
                            {val}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}

              {/* Quantity */}
              <div>
                <span className="ad-variant-label">Quantity</span>
                <div className="ad-qty-wrap">
                  <button className="ad-qty-btn"
                    onClick={() => setQty(p => Math.max(product.min_order_quantity || 1, p - 1))}
                    disabled={qty <= (product.min_order_quantity || 1)}>
                    <Minus size={18} />
                  </button>
                  <div className="ad-qty-num">{qty}</div>
                  <button className="ad-qty-btn"
                    onClick={() => setQty(p => Math.min(p + 1, stock))}
                    disabled={qty >= stock}>
                    <Plus size={18} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* CTA */}
          <div className="ad-cta-strip">
            {product.is_customizable && (
              <button className="ad-btn-customise"
                onClick={() => router.push(`/editor?product=${product.id}`)}>
                <Palette size={18} /> Customise Your Design
              </button>
            )}

            <button className="ad-btn-buy" onClick={() => addToCart(true)} disabled={isDisabled}>
              {isAdding
                ? <Loader2 size={18} className="ad-spin" />
                : <><Zap size={18} /> Buy Now — ₦{(parseFloat(currentPrice) * qty).toLocaleString()}</>}
            </button>

            <button className="ad-btn-cart" onClick={() => addToCart(false)} disabled={isDisabled}>
              {isAdding
                ? <Loader2 size={18} className="ad-spin" />
                : <><ShoppingBag size={18} /> Add to Cart</>}
            </button>
          </div>

          {/* Accordion tabs */}
          <div className="ad-tabs">
            {[
              { key: "details",  label: "Product Details",    body: product.description },
              { key: "shipping", label: "Delivery & Returns", body: "Standard delivery 3–5 days nationwide via GIG Logistics. Express shipping available at checkout. Free delivery on orders over ₦50,000. Hassle-free 30-day returns — no questions asked." },
            ].map(tab => {
              const open = activeTab === tab.key;
              return (
                <div key={tab.key} className="ad-tab-item">
                  <button className="ad-tab-trigger"
                    onClick={() => setActiveTab(open ? ("" as any) : (tab.key as any))}>
                    {tab.label}
                    <ChevronDown size={18} style={{
                      color: "var(--muted)",
                      transform: open ? "rotate(180deg)" : "none",
                      transition: "transform 0.2s",
                      flexShrink: 0,
                    }} />
                  </button>
                  <AnimatePresence>
                    {open && (
                      <motion.div className="ad-tab-content"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.28 }}
                      >
                        <div dangerouslySetInnerHTML={{ __html: tab.body.replace(/\n/g, "<br />") }} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

        </div>
      </div>

      {/* ── RELATED PRODUCTS ── */}
      {related.length > 0 && (
        <section className="ad-related-section">
          <div className="ad-related-header">
            <h2 className="ad-related-h2">
              You may<br /><em>also love.</em>
            </h2>
            <button className="ad-view-all" onClick={() => router.push("/shop")}>
              View all →
            </button>
          </div>
          <div className="ad-related-grid">
            {related.map(item => (
              <div key={item.id} className="ad-related-card"
                onClick={() => { router.push(`/shop/${item.slug}`); window.scrollTo({ top: 0, behavior: "smooth" }); }}
              >
                <div className="ad-related-img-wrap">
                  {item.image_url && (
                    <img src={item.image_url} alt={item.name} className="ad-related-img" loading="lazy" />
                  )}
                </div>
                <span className="ad-related-cat">{item.category_name}</span>
                <h3 className="ad-related-name">{item.name}</h3>
                <p className="ad-related-price">
                  ₦{parseFloat((item.display_price || item.base_price) || "0").toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── IMAGE MODAL ── */}
      <AnimatePresence>
        {imgModal && (
          <motion.div className="ad-modal-backdrop"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setImgModal(false)}
          >
            <motion.div className="ad-img-modal"
              initial={{ scale: 0.93 }} animate={{ scale: 1 }} exit={{ scale: 0.93 }}
              onClick={e => e.stopPropagation()}
            >
              {allImages[imgIdx] && (
                <img src={allImages[imgIdx]} alt={product.name} />
              )}
              <button className="ad-modal-close" onClick={() => setImgModal(false)}>
                <X size={20} />
              </button>
              {allImages.length > 1 && (
                <>
                  <button className="ad-modal-arrow ad-modal-arrow-l" onClick={prevImg}>
                    <ChevronLeft size={22} />
                  </button>
                  <button className="ad-modal-arrow ad-modal-arrow-r" onClick={nextImg}>
                    <ChevronRight size={22} />
                  </button>
                </>
              )}
              <div className="ad-modal-counter">{imgIdx + 1} / {allImages.length}</div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── SUCCESS MODAL ── */}
      <AnimatePresence>
        {successModal && (
          <motion.div className="ad-modal-backdrop"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          >
            <motion.div className="ad-success-modal"
              initial={{ scale: 0.93, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.93, opacity: 0 }}
            >
              <div className="ad-success-check">
                <Check size={36} />
              </div>
              <h2 className="ad-success-title">Added to Cart!</h2>
              <p className="ad-success-body">
                Your personalised Ankara gift is in your cart and ready for checkout.
              </p>
              <div className="ad-success-btns">
                <button className="ad-btn-buy"
                  style={{ margin: 0 }}
                  onClick={() => { setSuccessModal(false); router.push("/cart"); }}>
                  View Cart & Checkout
                </button>
                <button className="ad-btn-cart"
                  onClick={() => setSuccessModal(false)}>
                  Continue Shopping
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}