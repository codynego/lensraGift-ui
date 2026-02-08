// app/ClientHomepage.tsx
// Redesigned with modern UI, red/black/white brand colors, improved UX

"use client";

import { useState, useEffect } from 'react';
import { 
  ShoppingBag, Zap, Award, ArrowRight, 
  ShieldCheck, Sparkles, Clock, Heart, Gift, Star, Instagram, ChevronRight, TrendingUp, Palette, X, Cake, PartyPopper, GraduationCap, Package, Truck, RotateCcw, CreditCard
} from 'lucide-react';
import LensraSubscribe from '@/components/LensraSubscribe';
import { motion } from 'framer-motion';

const BaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.lensra.com/";

const getImageUrl = (imagePath: string | null | undefined): string | null => {
  if (!imagePath) return null;
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  return `${BaseUrl.replace(/\/$/, '')}${imagePath.startsWith('/') ? imagePath : '/' + imagePath}`;
};

export default function ClientHomepage({ initialProducts }: { initialProducts: any[] }) {
  const [products] = useState(initialProducts);
  const [popularProducts, setPopularProducts] = useState<any[]>([]);
  const [staffPicks, setStaffPicks] = useState<any[]>([]);
  const [selectedIntent, setSelectedIntent] = useState<string | null>(null);
  const [showSubscribeModal, setShowSubscribeModal] = useState(false);

  useEffect(() => {
    // Fetch popular products
    fetch(`${BaseUrl}api/products/featured/`)
      .then(res => res.json())
      .then(data => setPopularProducts(data.results || []))
      .catch(err => console.error('Error fetching popular products:', err));

    // Fetch staff picks
    const tag = selectedIntent || '';
    const endpoint = tag 
      ? `${BaseUrl}api/products/featured/?tag=${tag}`
      : `${BaseUrl}api/products/?is_featured=true&limit=8`;
    
    fetch(endpoint)
      .then(res => res.json())
      .then(data => setStaffPicks(data.results || []))
      .catch(err => console.error('Error fetching staff picks:', err));
  }, [selectedIntent]);

  useEffect(() => {
    const hasSeenPopup = localStorage.getItem('lensra_subscribe_popup_seen');
    
    if (!hasSeenPopup) {
      const timer = setTimeout(() => {
        setShowSubscribeModal(true);
        localStorage.setItem('lensra_subscribe_popup_seen', 'true');
      }, 15000);

      return () => clearTimeout(timer);
    }
  }, []);

  const handleIntentSelection = (intent: string) => {
    setSelectedIntent(intent);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('gift_intent', intent);
    }
  };

  const closeModal = () => {
    setShowSubscribeModal(false);
  };

  const occasions = [
    { 
      name: "Birthday", 
      icon: Cake, 
      gradient: "from-red-500 to-pink-500", 
      slug: "birthday",
      image: "https://images.unsplash.com/photo-1558636508-e0db3814bd1d?w=400&q=80"
    },
    { 
      name: "Anniversary", 
      icon: Heart, 
      gradient: "from-red-600 to-red-500", 
      slug: "anniversary",
      image: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=400&q=80"
    },
    { 
      name: "Valentine", 
      icon: Heart, 
      gradient: "from-pink-500 to-red-500", 
      slug: "valentine",
      image: "https://images.unsplash.com/photo-1518621736915-f3b1c41bfd00?w=400&q=80"
    },
    { 
      name: "Graduation", 
      icon: GraduationCap, 
      gradient: "from-black to-gray-700", 
      slug: "graduation",
      image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400&q=80"
    },
    { 
      name: "Wedding", 
      icon: PartyPopper, 
      gradient: "from-red-500 to-pink-500", 
      slug: "wedding",
      image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=400&q=80"
    },
    { 
      name: "Just Because", 
      icon: Gift, 
      gradient: "from-black to-gray-800", 
      slug: "just-because",
      image: "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=400&q=80"
    }
  ];

  const budgetRanges = [
    { label: "Under ₦5k", range: "0-5000", icon: "💰", max: 5000 },
    { label: "₦5k – ₦10k", range: "5000-10000", icon: "💵", min: 5000, max: 10000 },
    { label: "₦10k – ₦20k", range: "10000-20000", icon: "💸", min: 10000, max: 20000 },
    { label: "Premium", range: "20000+", icon: "👑", min: 20000 }
  ];

  const intentOptions = [
    { label: "For Him", emoji: "👨", value: "for-him" },
    { label: "For Her", emoji: "👩", value: "for-her" },
    { label: "Friends", emoji: "🤝", value: "for-friends" },
    { label: "Family", emoji: "👨‍👩‍👧", value: "for-family" },
    { label: "Kids", emoji: "👶", value: "for-kids" },
    { label: "Colleagues", emoji: "💼", value: "for-colleagues" },
    { label: "Couples", emoji: "💑", value: "for-couples" },
    { label: "Parents", emoji: "👪", value: "for-parents" }
  ];

  const trustFeatures = [
    {
      icon: Truck,
      title: "Express Delivery",
      description: "3-5 days nationwide shipping",
      color: "red"
    },
    {
      icon: ShieldCheck,
      title: "Secure Payment",
      description: "100% protected transactions",
      color: "black"
    },
    {
      icon: RotateCcw,
      title: "Easy Returns",
      description: "30-day hassle-free returns",
      color: "red"
    },
    {
      icon: Award,
      title: "Premium Quality",
      description: "Verified craftsmanship",
      color: "black"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      
      {/* SUBSCRIBE MODAL */}
      {showSubscribeModal && (
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={closeModal}
        >
          <div 
            className="relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeModal}
              className="absolute -top-3 -right-3 w-10 h-10 bg-black hover:bg-red-600 rounded-full flex items-center justify-center transition-all z-10 shadow-xl"
              aria-label="Close popup"
            >
              <X className="w-5 h-5 text-white" />
            </button>
            <LensraSubscribe source="first_gift_popup" />
          </div>
        </div>
      )}

      {/* HERO SECTION */}
      <section className="relative bg-black overflow-hidden">
        {/* Dotted Pattern */}
        <div className="absolute inset-0 opacity-5" 
             style={{ 
               backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', 
               backgroundSize: '40px 40px' 
             }} 
        />
        
        {/* Gradient Accent */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-red-600/20 to-transparent" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 relative z-10">
          <div className="max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-tight mb-6">
                Gifts That Make
                <span className="block text-red-600 mt-2">Moments Unforgettable</span>
              </h1>
              
              <p className="text-xl sm:text-2xl text-gray-300 mb-10 max-w-2xl font-medium">
                Personalized gifts for every special occasion. Delivered with love.
              </p>

              {/* Primary CTAs */}
              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <a 
                  href="/shop" 
                  className="group inline-flex items-center justify-center gap-3 px-8 py-5 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-bold text-base uppercase tracking-wide shadow-2xl shadow-red-600/30 transition-all hover:scale-105"
                >
                  <Gift className="w-6 h-6" />
                  Shop All Gifts
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </a>
                
                <a 
                  href="/editor" 
                  className="inline-flex items-center justify-center gap-3 px-8 py-5 bg-white hover:bg-gray-100 text-black rounded-2xl font-bold text-base uppercase tracking-wide transition-all border-2 border-white"
                >
                  <Palette className="w-6 h-6" />
                  Customize Gift
                </a>
              </div>

              {/* Trust Badges */}
              <div className="flex flex-wrap items-center gap-6 text-gray-400 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-600" />
                  <span className="font-medium">72hr Delivery</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-600" />
                  <span className="font-medium">Premium Quality</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-600" />
                  <span className="font-medium">500+ Happy Customers</span>
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

      {/* QUICK INTENT PICKER */}
      <section className="py-12 bg-white border-b-2 border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-xl font-black text-black mb-8 uppercase tracking-wide">
            Who Are You Shopping For?
          </h2>
          
          <div className="overflow-x-auto pb-4">
            <div className="flex gap-3 min-w-max">
              {intentOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleIntentSelection(option.value)}
                  className={`flex-shrink-0 px-6 py-3 rounded-xl font-bold text-sm transition-all border-2 ${
                    selectedIntent === option.value
                      ? 'bg-red-600 text-white border-red-600 shadow-lg scale-105'
                      : 'bg-white text-black border-gray-200 hover:border-red-600 hover:shadow-md'
                  }`}
                >
                  <span className="mr-2 text-lg">{option.emoji}</span>
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SHOP BY OCCASION */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl sm:text-5xl font-black text-black mb-4">
              Shop by Occasion
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Find the perfect gift for any celebration
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            {occasions.map((occasion, index) => (
              <motion.a
                key={occasion.slug}
                href={`/shop?tag=${occasion.slug}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group relative bg-white border-2 border-gray-200 rounded-2xl overflow-hidden hover:border-red-600 hover:shadow-2xl transition-all"
              >
                {/* Image */}
                <div className="relative aspect-square overflow-hidden">
                  <img
                    src={occasion.image}
                    alt={occasion.name}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  
                  {/* Gradient Overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${occasion.gradient} opacity-30 group-hover:opacity-40 transition-opacity`} />
                  
                  {/* Dark Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                </div>
                
                {/* Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-end p-4 text-center">
                  <h3 className="font-black text-base sm:text-lg text-white mb-1">
                    {occasion.name}
                  </h3>
                  <div className="inline-flex items-center gap-1 text-white text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                    Shop Now
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </motion.a>
            ))}
          </div>
          
          <div className="text-center">
            <a 
              href="/categories" 
              className="inline-flex items-center gap-2 px-8 py-4 bg-black hover:bg-red-600 text-white rounded-2xl font-bold text-base transition-all shadow-xl group"
            >
              Browse All Categories
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>
      </section>

      {/* POPULAR GIFTS */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-5 py-2 bg-red-600 rounded-full mb-6">
              <TrendingUp className="w-4 h-4 text-white" />
              <span className="text-xs font-black uppercase tracking-wider text-white">
                Trending Now
              </span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-black text-black mb-4">
              Popular Gifts
            </h2>
            <p className="text-xl text-gray-600">
              See what others are loving
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-10">
            {popularProducts.slice(0, 10).map((product) => (
              <ProductCard key={product.id} product={product} showTrending />
            ))}
          </div>

          <div className="text-center">
            <a 
              href="/shop" 
              className="inline-flex items-center gap-2 px-8 py-4 bg-black hover:bg-red-600 text-white rounded-2xl font-bold text-base transition-all shadow-xl group"
            >
              View All Gifts
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>
      </section>

      {/* SHOP BY BUDGET */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl sm:text-5xl font-black text-black mb-4">
              Shop by Budget
            </h2>
            <p className="text-xl text-gray-600">
              Great gifts at every price point
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {budgetRanges.map((budget) => {
              const params = new URLSearchParams();
              if (budget.min) params.set('price_min', budget.min.toString());
              if (budget.max) params.set('price_max', budget.max.toString());
              
              return (
                <a
                  key={budget.range}
                  href={`/shop?${params.toString()}`}
                  className="group relative bg-white border-2 border-gray-200 rounded-2xl p-8 hover:border-red-600 hover:shadow-2xl transition-all text-center overflow-hidden"
                >
                  <div className="absolute inset-0 bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  <div className="relative">
                    <div className="text-5xl mb-4">{budget.icon}</div>
                    <h3 className="font-black text-xl text-black mb-3">
                      {budget.label}
                    </h3>
                    <div className="inline-flex items-center gap-2 text-sm text-red-600 font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                      Shop Now
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      {/* STAFF PICKS */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-5 py-2 bg-black rounded-full mb-6">
              <Star className="w-4 h-4 text-white fill-white" />
              <span className="text-xs font-black uppercase tracking-wider text-white">
                {selectedIntent ? 'Recommended for You' : 'Staff Picks'}
              </span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-black text-black mb-4">
              {selectedIntent ? 'Recommended for You' : 'Staff Picks'}
            </h2>
            <p className="text-xl text-gray-600">
              {selectedIntent ? 'Curated based on your selection' : 'Handpicked by our team'}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {staffPicks.slice(0, 8).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* GIFT FINDER CTA */}
      <section className="relative py-20 bg-red-600 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 35px, white 35px, white 70px)`,
          }}></div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-3xl mb-8">
            <Sparkles className="w-10 h-10" />
          </div>
          
          <h2 className="text-4xl sm:text-5xl font-black mb-6">
            Not Sure What to Get?
          </h2>
          <p className="text-xl text-red-50 mb-10 max-w-2xl mx-auto font-medium">
            Answer a few quick questions and we'll recommend the perfect gift
          </p>
          
          <a 
            href="/gift-finder" 
            className="inline-flex items-center gap-3 px-10 py-5 bg-white hover:bg-black text-red-600 hover:text-white rounded-2xl font-black text-lg uppercase tracking-wide transition-all shadow-2xl hover:scale-105 group"
          >
            Start Gift Finder
            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </a>

          <p className="text-sm text-red-100 mt-8">
            Takes 2 minutes • Personalized • Completely free
          </p>
        </div>
      </section>

      {/* TRUST FEATURES */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {trustFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 ${
                    feature.color === 'red' ? 'bg-red-600' : 'bg-black'
                  }`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-black text-lg text-black mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* INSTAGRAM CTA */}
      <section className="py-20 bg-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Instagram className="w-16 h-16 text-red-600 mx-auto mb-6" />
          <h3 className="text-4xl font-black text-white mb-4">
            Join Our Community
          </h3>
          <p className="text-xl text-gray-400 mb-8">
            Share your gifts with <span className="text-red-600 font-bold">#LensraMoments</span> and get featured
          </p>
          <a 
            href="https://instagram.com/lensragift" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-pink-600 to-red-600 text-white rounded-2xl font-bold text-base hover:shadow-2xl hover:shadow-pink-500/30 transition-all hover:scale-105 group"
          >
            <Instagram className="w-6 h-6" />
            Follow @lensragift
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </section>

      {/* FLOATING CTA - Mobile */}
      <div className="fixed bottom-6 right-6 md:hidden z-40">
        <a 
          href="/gift-finder" 
          className="flex items-center gap-2 px-6 py-4 bg-red-600 hover:bg-red-700 text-white rounded-full font-bold shadow-2xl hover:shadow-red-600/50 transition-all"
        >
          <Gift className="w-5 h-5" />
          Gift Finder
        </a>
      </div>
    </div>
  );
}

function ProductCard({ product, showTrending = false }: { product: any; showTrending?: boolean }) {
  const imageUrl = getImageUrl(product.image_url);
  
  return (
    <a href={`/shop/${product.slug}`} className="group block">
      <div className="relative aspect-square bg-gray-100 rounded-2xl overflow-hidden mb-4 border-2 border-gray-200 group-hover:border-red-600 group-hover:shadow-2xl transition-all">
        {imageUrl ? (
          <img
            src={imageUrl} 
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ShoppingBag className="w-12 h-12 text-gray-300" />
          </div>
        )}
        
        {showTrending && (product.is_trending || product.is_featured) && (
          <div className="absolute top-3 left-3 bg-red-600 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            Trending
          </div>
        )}

        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all" />
        
        <div className="absolute bottom-4 left-4 right-4 transform translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all">
          <button className="w-full py-3 bg-white hover:bg-red-600 text-black hover:text-white rounded-xl text-sm font-bold transition-all shadow-xl">
            Quick View
          </button>
        </div>
      </div>
      
      <div>
        <h3 className="font-bold text-black mb-2 line-clamp-2 group-hover:text-red-600 transition-colors leading-tight">
          {product.name}
        </h3>
        <p className="font-black text-xl text-black">
          ₦{parseFloat(product.base_price || "0").toLocaleString()}
        </p>
      </div>
    </a>
  );
}