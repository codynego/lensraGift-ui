// app/sales/LimitedDeals.tsx

"use client";

import { useState, useEffect } from 'react';
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
  TrendingUp,
  Flame,
  Tag,
  ArrowRight,
  Check,
  AlertCircle,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';

interface SaleProduct {
  id: number;
  name: string;
  slug: string;
  image_url: string;
  original_price: string;
  display_price: string;
  sale_label: string;
  sale_start_in?: number | null;
  sale_ends_in?: number | null;
  is_best_seller?: boolean;
  description?: string;
}

const TESTIMONIALS = [
  {
    quote: "The quality exceeded my expectations. Best gift I've ever sent!",
    author: "Aisha O.",
    rating: 5,
    verified: true,
  },
  {
    quote: "Lightning-fast delivery and exceptional packaging. Highly recommend!",
    author: "Chinedu M.",
    rating: 5,
    verified: true,
  },
  {
    quote: "Absolutely perfect for special occasions. The recipient was thrilled!",
    author: "Fatima K.",
    rating: 5,
    verified: true,
  },
];

const BENEFITS = [
  {
    icon: Gift,
    title: "Premium Quality",
    description: "Luxury materials and craftsmanship",
    color: "red"
  },
  {
    icon: Truck,
    title: "Express Delivery",
    description: "3-5 days nationwide",
    color: "black"
  },
  {
    icon: Shield,
    title: "Secure Payment",
    description: "100% protected transactions",
    color: "red"
  },
  {
    icon: Heart,
    title: "Gift Ready",
    description: "Beautiful packaging included",
    color: "black"
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
  const [globalRemainingTime, setGlobalRemainingTime] = useState(48 * 60 * 60);
  const [productTimers, setProductTimers] = useState<Record<number, { start: number; end: number }>>({});

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
        const fetchedProducts = (data.results || data).slice(0, 6);

        const initialTimers: Record<number, { start: number; end: number }> = {};
        fetchedProducts.forEach((p: SaleProduct) => {
          const startTime = Math.max(0, (p.sale_start_in || 0));
          const endTime = Math.max(0, (p.sale_ends_in || 0));
          if (startTime > 0 || endTime > 0) {
            initialTimers[p.id] = { start: startTime, end: endTime };
          }
        });

        setProducts(fetchedProducts);
        setProductTimers(initialTimers);
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
      setGlobalRemainingTime((prev) => (prev <= 1 ? 0 : prev - 1));

      setProductTimers((prevTimers) => {
        const updated = { ...prevTimers };
        Object.keys(updated).forEach((key) => {
          const id = parseInt(key);
          const timer = updated[id];
          if (timer.start > 0) {
            updated[id].start -= 1;
            if (updated[id].start <= 0) updated[id].start = 0;
          }
          if (timer.end > 0) {
            updated[id].end -= 1;
            if (updated[id].end <= 0) updated[id].end = 0;
          }
          if (updated[id].start === 0 && updated[id].end === 0) {
            delete updated[id];
          }
        });
        return updated;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number) => {
    if (seconds <= 0) return '00:00:00';
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const getProductTimerStatus = (productId: number) => {
    const timer = productTimers[productId];
    if (!timer) return { type: 'inactive' as const, seconds: 0, label: 'Sale Ended' };

    if (timer.start > 0) {
      return { type: 'upcoming' as const, seconds: timer.start, label: 'Starting Soon' };
    } else if (timer.end > 0) {
      return { type: 'active' as const, seconds: timer.end, label: 'Live Now' };
    } else {
      return { type: 'ended' as const, seconds: 0, label: 'Sale Ended' };
    }
  };

  const calculateDiscount = (original: string, display: string) => {
    const orig = parseFloat(original);
    const disp = parseFloat(display);
    return Math.round(((orig - disp) / orig) * 100);
  };

  const hasActiveProductTimers = Object.values(productTimers).some(t => t.end > 0);

  const addItemToCartAndCheckout = async (product: SaleProduct) => {
    const status = getProductTimerStatus(product.id);
    if (status.type !== 'active') return;

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

  const handleViewDetails = (slug: string) => {
    router.push(`/shop/${slug}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="relative">
            <Clock className="w-16 h-16 mx-auto mb-6 text-red-600 animate-pulse" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          </div>
          <p className="text-xl font-bold text-black">Loading Exclusive Deals...</p>
        </div>
      </div>
    );
  }

  if (error || products.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white px-4">
        <div className="text-center max-w-md">
          <AlertCircle className="w-16 h-16 mx-auto mb-6 text-red-600" />
          <h2 className="text-2xl font-bold text-black mb-4">No Active Deals</h2>
          <p className="text-gray-600 mb-8">{error || "Check back soon for new offers!"}</p>
          <button
            onClick={() => router.push('/shop')}
            className="bg-red-600 text-white px-8 py-4 rounded-full font-bold hover:bg-red-700 transition-all shadow-lg hover:shadow-xl inline-flex items-center gap-2"
          >
            Browse All Products
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-black text-white overflow-hidden">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="text-center">
            {/* Flash Sale Badge */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", duration: 0.6 }}
              className="inline-flex items-center gap-2 bg-red-600 text-white px-6 py-3 rounded-full mb-8 font-bold text-sm uppercase tracking-wider"
            >
              <Flame className="w-5 h-5 animate-pulse" />
              Flash Sale Live
              <Flame className="w-5 h-5 animate-pulse" />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-4xl sm:text-5xl md:text-7xl font-black mb-6 leading-tight"
            >
              Limited-Time
              <span className="block text-red-600 mt-2">Gift Deals</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto mb-12"
            >
              Exclusive launch prices on premium gifts. Don't miss out – these deals won't last!
            </motion.p>

            {/* Timer Display */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="inline-block"
            >
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 sm:p-8">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <Clock className="w-6 h-6 text-red-600" />
                  <span className="text-lg font-bold uppercase tracking-wider">
                    {hasActiveProductTimers ? 'Sale Ends In' : 'Next Sale Starts In'}
                  </span>
                </div>
                <div className="flex items-center gap-2 sm:gap-4">
                  {formatTime(hasActiveProductTimers ? getProductTimerStatus(products[0].id).seconds : globalRemainingTime)
                    .split(':')
                    .map((unit, index) => (
                      <div key={index}>
                        <div className="bg-red-600 text-white rounded-xl px-4 sm:px-6 py-3 sm:py-4 min-w-[70px] sm:min-w-[90px]">
                          <span className="text-3xl sm:text-5xl font-black">{unit}</span>
                        </div>
                        <p className="text-xs sm:text-sm text-gray-400 mt-2 font-medium uppercase">
                          {['Hours', 'Mins', 'Secs'][index]}
                        </p>
                      </div>
                    ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 48h1440V0s-168 48-720 48S0 0 0 0v48z" fill="white"/>
          </svg>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-black text-black mb-4">
              Today's Hot Deals
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Grab these limited offers before they're gone forever
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {products.map((product, index) => {
              const status = getProductTimerStatus(product.id);
              const isActive = status.type === 'active';
              const discount = calculateDiscount(product.original_price, product.display_price);

              return (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index, duration: 0.5 }}
                  className="group relative"
                >
                  <div className={`relative rounded-3xl overflow-hidden transition-all duration-500 ${
                    isActive 
                      ? 'bg-white border-2 border-red-600 shadow-2xl shadow-red-600/20' 
                      : 'bg-gray-50 border-2 border-gray-200'
                  }`}>
                    {/* Image Container */}
                    <div className="relative h-80 sm:h-96 bg-gray-100 overflow-hidden">
                      <img
                        src={product.image_url}
                        alt={product.name}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      
                      {/* Overlay Gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                      {/* Status Badge */}
                      <div className="absolute top-4 left-4 right-4 flex items-start justify-between gap-2">
                        {product.is_best_seller && (
                          <div className="bg-black text-white px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-lg">
                            <TrendingUp className="w-3.5 h-3.5" />
                            Best Seller
                          </div>
                        )}
                        
                        <div className={`ml-auto px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg ${
                          isActive 
                            ? 'bg-red-600 text-white animate-pulse' 
                            : status.type === 'upcoming'
                            ? 'bg-white text-black'
                            : 'bg-gray-800 text-white'
                        }`}>
                          {status.label}
                        </div>
                      </div>

                      {/* Discount Badge */}
                      {isActive && discount > 0 && (
                        <div className="absolute top-4 right-4">
                          <div className="bg-red-600 text-white rounded-full w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center shadow-xl border-4 border-white">
                            <div className="text-center">
                              <p className="text-xl sm:text-2xl font-black leading-none">-{discount}%</p>
                              <p className="text-[10px] font-medium uppercase">Off</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-black mb-2 line-clamp-2 group-hover:text-red-600 transition-colors">
                        {product.name}
                      </h3>
                      
                      {product.description && (
                        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                          {product.description}
                        </p>
                      )}

                      {/* Price Section */}
                      <div className="mb-4">
                        <div className="flex items-baseline gap-3 mb-2">
                          <span className="text-3xl font-black text-black">
                            ₦{parseFloat(product.display_price).toLocaleString()}
                          </span>
                          <span className="text-lg text-gray-400 line-through">
                            ₦{parseFloat(product.original_price).toLocaleString()}
                          </span>
                        </div>
                        
                        {/* Timer */}
                        <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-bold ${
                          isActive 
                            ? 'bg-red-50 text-red-600' 
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          <Clock className={`w-4 h-4 ${isActive ? 'animate-pulse' : ''}`} />
                          {formatTime(status.seconds)}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="space-y-3">
                        <button
                          onClick={() => addItemToCartAndCheckout(product)}
                          disabled={isAdding === product.id || !isActive}
                          className={`w-full py-4 rounded-full font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-300 ${
                            isActive
                              ? 'bg-red-600 text-white hover:bg-red-700 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]'
                              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                          } disabled:opacity-50`}
                        >
                          {isAdding === product.id ? (
                            <>
                              <Clock className="w-5 h-5 animate-spin" />
                              Processing...
                            </>
                          ) : (
                            <>
                              <Zap className="w-5 h-5" />
                              Buy Now
                            </>
                          )}
                        </button>

                        <button
                          onClick={() => handleViewDetails(product.slug)}
                          className="w-full py-4 border-2 border-black text-black rounded-full font-bold hover:bg-black hover:text-white transition-all duration-300 flex items-center justify-center gap-2 group/btn"
                        >
                          View Details
                          <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 sm:py-20 bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-black mb-4">
              Why Shop With Us?
            </h2>
            <p className="text-gray-400 text-lg">
              Premium quality meets unbeatable service
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {BENEFITS.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  viewport={{ once: true }}
                  className="text-center group"
                >
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                    benefit.color === 'red' 
                      ? 'bg-red-600 group-hover:bg-red-700' 
                      : 'bg-white group-hover:bg-gray-100'
                  }`}>
                    <Icon className={`w-8 h-8 ${
                      benefit.color === 'red' ? 'text-white' : 'text-black'
                    }`} />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{benefit.title}</h3>
                  <p className="text-gray-400">{benefit.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-black text-black mb-4">
              Loved By Thousands
            </h2>
            <p className="text-gray-600 text-lg">
              Join our community of satisfied customers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {TESTIMONIALS.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                viewport={{ once: true }}
                className="bg-gray-50 p-8 rounded-3xl border-2 border-gray-200 hover:border-red-600 transition-all duration-300 hover:shadow-xl"
              >
                <div className="flex items-center gap-2 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-red-600 fill-red-600" />
                  ))}
                </div>
                
                <p className="text-gray-700 mb-6 leading-relaxed">
                  "{testimonial.quote}"
                </p>
                
                <div className="flex items-center justify-between">
                  <p className="font-bold text-black">{testimonial.author}</p>
                  {testimonial.verified && (
                    <div className="flex items-center gap-1 text-xs text-green-600 font-medium">
                      <Check className="w-4 h-4" />
                      Verified
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative bg-red-600 text-white py-16 sm:py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 35px, white 35px, white 70px)`,
          }}></div>
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Flame className="w-12 h-12 mx-auto mb-6 animate-bounce" />
            <h2 className="text-3xl sm:text-5xl font-black mb-6">
              Don't Let These Deals Slip Away!
            </h2>
            <p className="text-xl text-red-100 mb-8 max-w-2xl mx-auto">
              Limited stock available. Once they're gone, prices return to normal.
            </p>

            {/* Countdown */}
            <div className="inline-flex items-center gap-3 bg-black/30 backdrop-blur-sm px-6 py-4 rounded-full mb-10 font-bold text-lg">
              <Clock className="w-6 h-6" />
              <span>Hurry! Sale ends in</span>
              <span className="bg-white text-red-600 px-4 py-2 rounded-full font-black">
                {formatTime(hasActiveProductTimers ? getProductTimerStatus(products[0].id).seconds : globalRemainingTime)}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="bg-black text-white px-8 py-5 rounded-full font-bold text-lg hover:bg-gray-900 transition-all shadow-2xl hover:scale-105 inline-flex items-center gap-2 group"
              >
                Shop Deals Now
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <button
                onClick={() => router.push('/shop')}
                className="bg-white text-red-600 px-8 py-5 rounded-full font-bold text-lg hover:bg-gray-100 transition-all shadow-2xl hover:scale-105 inline-flex items-center gap-2"
              >
                View All Products
                <ShoppingBag className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}