// app/sale/page.tsx
"use client";

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  Zap, Clock, ShoppingBag, Loader2, Check, ArrowRight,
  Truck, Shield, RotateCcw
} from 'lucide-react';
import { motion } from 'framer-motion';

interface DealProduct {
  id: number;
  name: string;
  slug: string;
  image_url: string;
  base_price: string;        // This will be the sale price
  old_price: string;         // Crossed out price
  category_name: string;
  is_best_seller?: boolean;
}

const SAMPLE_DEALS: DealProduct[] = [
  {
    id: 101,
    name: "Personalized Luxury Mug",
    slug: "personalized-luxury-mug",
    image_url: "https://picsum.photos/id/669/600/800",
    base_price: "6999",
    old_price: "8500",
    category_name: "Mugs",
    is_best_seller: true,
  },
  {
    id: 102,
    name: "Custom Scented Candle Set",
    slug: "custom-scented-candle-set",
    image_url: "https://picsum.photos/id/870/600/800",
    base_price: "9500",
    old_price: "12000",
    category_name: "Home & Living",
  },
  {
    id: 103,
    name: "Elegant Photo Frame Gift",
    slug: "elegant-photo-frame-gift",
    image_url: "https://picsum.photos/id/201/600/800",
    base_price: "5800",
    old_price: "7200",
    category_name: "Frames",
    is_best_seller: true,
  },
  {
    id: 104,
    name: "Premium Notebook & Pen Set",
    slug: "premium-notebook-pen-set",
    image_url: "https://picsum.photos/id/367/600/800",
    base_price: "4200",
    old_price: "5500",
    category_name: "Stationery",
  },
];

export default function SalePage() {
  const router = useRouter();
  const { token } = useAuth();
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://your-api.com/'; // ← Change to your real baseUrl

  const [isAdding, setIsAdding] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState({ hours: 48, minutes: 12, seconds: 45 });

  // Live countdown (48 hours from page load for demo)
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        let { hours, minutes, seconds } = prev;
        if (seconds > 0) seconds--;
        else if (minutes > 0) { minutes--; seconds = 59; }
        else if (hours > 0) { hours--; minutes = 59; seconds = 59; }
        return { hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Shared Buy Now logic (same as product detail)
  const handleBuyNow = async (product: DealProduct) => {
    setIsAdding(product.id);
    let sessionId = localStorage.getItem('guest_session_id');
    if (!sessionId) {
      sessionId = crypto.randomUUID();
      localStorage.setItem('guest_session_id', sessionId);
    }

    try {
      const res = await fetch(`${baseUrl}api/orders/cart/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
        body: JSON.stringify({
          product: product.id,
          quantity: 1,
          ...(!token && { session_id: sessionId }),
        }),
      });

      if (res.ok) {
        window.dispatchEvent(new Event('storage'));
        router.push('/checkout');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsAdding(null);
    }
  };

  const formatPrice = (price: string) => parseFloat(price).toLocaleString();

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 via-white to-zinc-50 font-sans">
      {/* HERO / ABOVE THE FOLD */}
      <div className="bg-gradient-to-br from-red-600 to-rose-600 text-white py-16 lg:py-24 relative overflow-hidden">
        <div className="max-w-[1800px] mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-5 py-2 rounded-full text-sm font-bold mb-6">
                <Clock className="w-5 h-5" />
                LIMITED-TIME LAUNCH OFFERS
              </div>

              <h1 className="text-5xl lg:text-6xl font-black leading-[1.05] tracking-tighter mb-4">
                Limited-Time Gift Deals 🎁
              </h1>

              <p className="text-xl text-white/90 max-w-lg mb-8">
                Thoughtful gifts at special launch prices.<br />
                Once the timer ends, prices return to normal.
              </p>

              {/* Countdown Timer */}
              <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-6 inline-block">
                <p className="uppercase text-xs tracking-[3px] font-bold text-white/70 mb-3">Offer ends in</p>
                <div className="flex gap-6 text-4xl font-black tabular-nums">
                  <div>{timeLeft.hours.toString().padStart(2, '0')}<span className="text-sm font-normal opacity-70 block text-xs">HRS</span></div>
                  <div>{timeLeft.minutes.toString().padStart(2, '0')}<span className="text-sm font-normal opacity-70 block text-xs">MIN</span></div>
                  <div>{timeLeft.seconds.toString().padStart(2, '0')}<span className="text-sm font-normal opacity-70 block text-xs">SEC</span></div>
                </div>
              </div>
            </div>

            {/* Featured product images (decorative) */}
            <div className="hidden lg:grid grid-cols-2 gap-6">
              <img src="https://picsum.photos/id/669/600/800" className="rounded-3xl shadow-2xl" alt="deal" />
              <img src="https://picsum.photos/id/870/600/800" className="rounded-3xl shadow-2xl mt-12" alt="deal" />
            </div>
          </div>
        </div>
      </div>

      {/* DEALS GRID */}
      <div className="max-w-[1800px] mx-auto px-6 lg:px-12 py-16">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-4xl font-black text-zinc-900">Today’s Limited Deals</h2>
            <p className="text-zinc-600 mt-2">Handpicked gifts at launch prices</p>
          </div>
          <button
            onClick={() => router.push('/shop')}
            className="flex items-center gap-2 text-sm font-semibold text-zinc-500 hover:text-zinc-900"
          >
            View all gifts <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {SAMPLE_DEALS.map((product) => {
            const saving = Math.round(((parseFloat(product.old_price) - parseFloat(product.base_price)) / parseFloat(product.old_price)) * 100);
            return (
              <motion.div
                key={product.id}
                whileHover={{ y: -8 }}
                className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-zinc-100"
              >
                <div className="relative">
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full aspect-[4/4.5] object-cover group-hover:scale-105 transition-transform duration-700"
                  />

                  {product.is_best_seller && (
                    <div className="absolute top-4 left-4 bg-amber-500 text-white text-xs font-bold px-4 py-1.5 rounded-full flex items-center gap-1">
                      ⭐ Best Seller
                    </div>
                  )}

                  <div className="absolute top-4 right-4 bg-white text-red-600 text-xs font-bold px-4 py-1.5 rounded-full shadow">
                    -{saving}%
                  </div>
                </div>

                <div className="p-6">
                  <p className="text-xs uppercase tracking-widest text-zinc-500 font-semibold mb-1">{product.category_name}</p>
                  <h3 className="font-bold text-lg leading-tight line-clamp-2 mb-4 min-h-[3.2em]">{product.name}</h3>

                  <div className="flex items-baseline gap-3 mb-6">
                    <span className="text-3xl font-black text-zinc-900">
                      ₦{formatPrice(product.base_price)}
                    </span>
                    <span className="text-zinc-400 line-through text-lg">
                      ₦{formatPrice(product.old_price)}
                    </span>
                  </div>

                  <div className="flex gap-3">
                    {/* Buy Now - Primary */}
                    <button
                      onClick={() => handleBuyNow(product)}
                      disabled={isAdding === product.id}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-70"
                    >
                      {isAdding === product.id ? (
                        <Loader2 className="animate-spin w-5 h-5" />
                      ) : (
                        <>
                          <Zap className="w-5 h-5" />
                          Buy Now
                        </>
                      )}
                    </button>

                    {/* View Details */}
                    <button
                      onClick={() => router.push(`/shop/${product.slug}`)}
                      className="flex-1 border-2 border-zinc-900 font-semibold py-4 rounded-2xl hover:bg-zinc-50 transition-all"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* TRUST SECTION */}
      <div className="bg-white py-16 border-t border-b border-zinc-100">
        <div className="max-w-[1800px] mx-auto px-6 lg:px-12">
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold text-zinc-900 mb-2">Why buy from LensraGift?</h3>
            <p className="text-zinc-600">We make gifting meaningful and stress-free</p>
          </div>

          <div className="grid md:grid-cols-4 gap-10">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mb-4">
                <Truck className="w-8 h-8 text-emerald-600" />
              </div>
              <p className="font-semibold">Fast Delivery Across Nigeria</p>
              <p className="text-sm text-zinc-500 mt-1">3–5 business days</p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-4">
                <Shield className="w-8 h-8 text-blue-600" />
              </div>
              <p className="font-semibold">Secure Payment</p>
              <p className="text-sm text-zinc-500 mt-1">Card or WhatsApp Pay</p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mb-4">
                <RotateCcw className="w-8 h-8 text-purple-600" />
              </div>
              <p className="font-semibold">Easy Returns</p>
              <p className="text-sm text-zinc-500 mt-1">30-day guarantee</p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-rose-100 rounded-2xl flex items-center justify-center mb-4">
                <Check className="w-8 h-8 text-rose-600" />
              </div>
              <p className="font-semibold">Premium Quality</p>
              <p className="text-sm text-zinc-500 mt-1">Materials that last</p>
            </div>
          </div>
        </div>
      </div>

      {/* FINAL CTA */}
      <div className="py-20 text-center">
        <p className="text-zinc-500 mb-4">Not sure which gift to choose?</p>
        <button
          onClick={() => router.push('/shop')}
          className="bg-zinc-900 text-white px-10 py-4 rounded-2xl font-bold text-lg hover:bg-black transition-all inline-flex items-center gap-3"
        >
          Browse All Gifts
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}