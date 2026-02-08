// app/sales/LimitedDeals.tsx

"use client";

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  Clock,
  Zap,
  Star,
  Heart,
  ShoppingBag,
  Truck,
  Shield,
  CreditCard,
  Gift,
  ChevronRight,
  Quote,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';

interface SaleProduct {
  id: number;
  name: string;
  slug: string;
  image_url: string;
  original_price: string;
  display_price: string;
  sale_label: string;
  is_best_seller?: boolean;
  description?: string;
}

const TESTIMONIALS = [
  {
    quote: "Absolutely loved the surprise element! Made gifting so special.",
    author: "Aisha O.",
    rating: 5,
  },
  {
    quote: "Fast delivery and beautiful quality. Will order again!",
    author: "Chinedu M.",
    rating: 5,
  },
  {
    quote: "The emotions feature is genius. Touched my heart.",
    author: "Fatima K.",
    rating: 5,
  },
];
const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.lensra.com/";
export default function LimitedDeals() {
  const router = useRouter();
  const { token } = useAuth();

  const [products, setProducts] = useState<SaleProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState<number | null>(null);
  const [remainingTime, setRemainingTime] = useState(48 * 60 * 60); // 48 hours in seconds

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${baseUrl}api/products/deals/`, {
          headers: {
            ...(token && { 'Authorization': `Bearer ${token}` }),
          },
        });

        if (!res.ok) {
          throw new Error('Failed to fetch deals');
        }

        const data = await res.json();
        setProducts(data.results || data.slice(0, 5)); // Limit to 5, assuming paginated or array
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [baseUrl, token]);

  useEffect(() => {
    const interval = setInterval(() => {
      setRemainingTime((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const addItemToCartAndCheckout = async (product: SaleProduct) => {
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
          quantity: 1, // Default quantity for quick buy
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

  const handleViewDetails = (slug: string) => {
    router.push(`/shop/${slug}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 via-white to-pink-50">
        <div className="text-center">
          <Clock className="w-8 h-8 animate-spin mx-auto mb-4 text-rose-600" />
          <p className="text-lg text-zinc-600">Loading deals...</p>
        </div>
      </div>
    );
  }

  if (error || products.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 via-white to-pink-50">
        <div className="text-center">
          <p className="text-lg text-zinc-600 mb-4">{error || "No deals available right now."}</p>
          <button
            onClick={() => router.push('/shop')}
            className="bg-rose-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-rose-700 transition-colors"
          >
            Browse All Gifts
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-pink-50 text-zinc-900 font-sans">
      {/* Top Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-rose-500 to-pink-600 text-white py-20 px-4">
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-black tracking-tight mb-6"
          >
            Limited-Time Gift Deals 🎁
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl md:text-2xl text-rose-100 max-w-3xl mx-auto mb-8 leading-relaxed"
          >
            Thoughtful gifts at special launch prices. Once the timer ends, prices go back up.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="inline-flex items-center gap-3 bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full text-lg font-bold"
          >
            <Clock className="w-5 h-5" />
            <span>Offer ends in</span>
            <span className="bg-white text-rose-600 px-4 py-2 rounded-full font-black">
              {formatTime(remainingTime)}
            </span>
          </motion.div>
        </div>
        <div className="absolute inset-0 bg-black/10" />
      </section>

      {/* Product Grid */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className="bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 border border-rose-100"
            >
              <div className="relative h-64 bg-gradient-to-br from-rose-50 to-pink-50">
                <Image
                  src={product.image_url}
                  alt={product.name}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-500"
                />
                {product.is_best_seller && (
                  <div className="absolute top-4 left-4 bg-amber-500 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                    <Star className="w-3 h-3 inline mr-1 fill-white" />
                    Best Seller
                  </div>
                )}
                <div className="absolute top-4 right-4 bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                  {product.sale_label}
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-zinc-900 mb-2 line-clamp-2">{product.name}</h3>
                {product.description && (
                  <p className="text-sm text-zinc-600 mb-4 line-clamp-2">{product.description}</p>
                )}
                <div className="space-y-2 mb-6">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-black text-zinc-900">
                      ₦{parseFloat(product.display_price).toLocaleString()}
                    </span>
                    <span className="text-lg text-zinc-500 line-through">
                      ₦{parseFloat(product.original_price).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-rose-600 font-semibold">
                    <Zap className="w-4 h-4" />
                    <span>Limited Offer</span>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => addItemToCartAndCheckout(product)}
                    disabled={isAdding === product.id}
                    className="flex-1 py-4 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white rounded-xl font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isAdding === product.id ? (
                      <>
                        <Clock className="w-4 h-4 animate-spin" />
                        Adding...
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4" />
                        Buy Now
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => handleViewDetails(product.slug)}
                    className="flex-1 py-4 border-2 border-zinc-200 hover:border-zinc-400 text-zinc-700 hover:text-zinc-900 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all"
                  >
                    <Heart className="w-4 h-4" />
                    View Details
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-white to-rose-50">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-3xl font-black text-zinc-900 mb-8"
          >
            Why Buy from LensraGift?
          </motion.h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            <div className="flex items-start gap-4 p-4 bg-white rounded-2xl shadow-md">
              <Gift className="w-8 h-8 text-rose-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-zinc-900 mb-1">Printed on Quality Materials</h3>
                <p className="text-sm text-zinc-600">Premium paper and inks for lasting memories.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 bg-white rounded-2xl shadow-md">
              <Truck className="w-8 h-8 text-emerald-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-zinc-900 mb-1">Fast Delivery Across Nigeria</h3>
                <p className="text-sm text-zinc-600">3-5 business days, free over ₦50,000.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 bg-white rounded-2xl shadow-md">
              <CreditCard className="w-8 h-8 text-blue-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-zinc-900 mb-1">Pay with Card or WhatsApp</h3>
                <p className="text-sm text-zinc-600">Secure and flexible payment options.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 bg-white rounded-2xl shadow-md">
              <Heart className="w-8 h-8 text-pink-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-zinc-900 mb-1">Perfect for Gifting</h3>
                <p className="text-sm text-zinc-600">Personalized touches that wow every time.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4 max-w-6xl mx-auto">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-3xl font-black text-zinc-900 text-center mb-12"
        >
          What Our Customers Say
        </motion.h2>
        <div className="grid md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 * (index + 1) }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index }}
              className="bg-white p-6 rounded-2xl shadow-lg border border-zinc-100"
            >
              <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-amber-500 fill-amber-500" />
                ))}
              </div>
              <Quote className="w-8 h-8 text-zinc-300 mb-4 -ml-2" />
              <p className="text-zinc-700 italic mb-4">"{testimonial.quote}"</p>
              <p className="font-bold text-zinc-900">— {testimonial.author}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Footer */}
      <section className="bg-gradient-to-r from-rose-600 to-pink-600 text-white py-12 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold mb-4">Don't Miss Out on These Deals</h3>
          <p className="text-rose-100 mb-6">Limited time only – grab yours before prices rise!</p>
          <div className="inline-flex items-center gap-3 bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full text-lg font-bold mb-6">
            <Clock className="w-5 h-5" />
            Ends in {formatTime(remainingTime)}
          </div>
          <button
            onClick={() => router.push('/shop')}
            className="bg-white text-rose-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-rose-50 transition-all shadow-lg"
          >
            Shop All Gifts
            <ChevronRight className="w-5 h-5 inline ml-2" />
          </button>
        </div>
      </section>
    </div>
  );
}