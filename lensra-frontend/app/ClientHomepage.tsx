// app/ClientHomepage.tsx
// Rewritten with MVP wireframe structure - clarity, speed, conversion

"use client";

import { useState, useEffect } from 'react';
import { 
  ShoppingBag, Zap, Award, ArrowRight, 
  ShieldCheck, Sparkles, Clock, MapPin, Heart, Upload, Gift, Star, Instagram, Users, Home, Coffee, Shirt, ChevronRight, Package, TrendingUp, Palette, Search, Filter, X, Cake, PartyPopper, GraduationCap, Banknote
} from 'lucide-react';
import LensraSubscribe from '@/components/LensraSubscribe';

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
    // Fetch popular products (trending/featured)
    fetch(`${BaseUrl}api/products/featured/`)
      .then(res => res.json())
      .then(data => setPopularProducts(data.results || []))
      .catch(err => console.error('Error fetching popular products:', err));

    // Fetch staff picks based on selected intent or default
    const tag = selectedIntent || '';
    const endpoint = tag 
      ? `${BaseUrl}api/products/featured/?tag=${tag}`
      : `${BaseUrl}api/products/?is_featured=true&limit=8`;
    
    fetch(endpoint)
      .then(res => res.json())
      .then(data => setStaffPicks(data.results || []))
      .catch(err => console.error('Error fetching staff picks:', err));
  }, [selectedIntent]);

  // Subscribe popup - shows after 15 seconds on first visit
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

  // Store intent in session
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
    { name: "Birthday", emoji: "🎂", icon: Cake, gradient: "from-pink-500 to-rose-500", slug: "birthday" },
    { name: "Anniversary", emoji: "❤️", icon: Heart, gradient: "from-red-500 to-pink-500", slug: "anniversary" },
    { name: "Valentine", emoji: "💝", icon: Heart, gradient: "from-rose-500 to-red-500", slug: "valentine" },
    { name: "Graduation", emoji: "🎓", icon: GraduationCap, gradient: "from-blue-500 to-indigo-500", slug: "graduation" },
    { name: "Wedding", emoji: "👰", icon: PartyPopper, gradient: "from-purple-500 to-pink-500", slug: "wedding" },
    { name: "Just Because", emoji: "🎁", icon: Gift, gradient: "from-amber-500 to-orange-500", slug: "just-because" }
  ];

  const budgetRanges = [
    { label: "Under ₦5k", range: "0-5000", icon: "💰", max: 5000 },
    { label: "₦5k – ₦10k", range: "5000-10000", icon: "💵", min: 5000, max: 10000 },
    { label: "₦10k – ₦20k", range: "10000-20000", icon: "💸", min: 10000, max: 20000 },
    { label: "Premium", range: "20000+", icon: "👑", min: 20000 }
  ];

  const intentOptions = [
    { label: "For Him", emoji: "❤️", value: "for-him" },
    { label: "For Her", emoji: "💖", value: "for-her" },
    { label: "Friend", emoji: "🤝", value: "for-friends" },
    { label: "Family", emoji: "👨‍👩‍👧", value: "for-family" },
    { label: "Kids", emoji: "👶", value: "for-kids" },
    { label: "Colleague", emoji: "💼", value: "for-colleagues" },
    { label: "Couples", emoji: "💑", value: "for-couples" },
    { label: "Parents", emoji: "👩‍👩‍👦", value: "for-parents" },
    { label: "Boss", emoji: "🧑‍💼", value: "for-boss" }
  ];


  return (
    <div className="min-h-screen bg-white selection:bg-red-100 selection:text-red-900">
      
      {/* SUBSCRIBE MODAL */}
      {showSubscribeModal && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-300"
          onClick={closeModal}
        >
          <div 
            className="relative animate-in zoom-in duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeModal}
              className="absolute -top-2 -right-2 w-8 h-8 bg-zinc-900 border border-zinc-700 rounded-full flex items-center justify-center hover:bg-red-600 transition-all z-10 group"
              aria-label="Close popup"
            >
              <X className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
            </button>
            <LensraSubscribe source="first_gift_popup" />
          </div>
        </div>
      )}

      {/* 1. HERO SECTION - Clear Value Proposition */}
      <section className="relative bg-gradient-to-br from-zinc-950 to-zinc-900 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.02]" 
             style={{ 
               backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', 
               backgroundSize: '40px 40px' 
             }} 
        />
        
        <div className="max-w-6xl mx-auto px-4 py-20 md:py-28 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            {/* Clear Value Prop */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-tight mb-6 text-white">
              Find the Perfect Gift
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-400">
                in Minutes 🎁
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-zinc-300 mb-10 font-medium max-w-xl mx-auto">
              Personalized gifts for every occasion
            </p>

            {/* Primary CTAs - Clear Split */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-lg mx-auto">
              <a 
                href="/marketplace" 
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-xl font-bold text-sm uppercase tracking-wide hover:shadow-xl hover:shadow-red-500/30 transition-all group"
              >
                <Gift className="w-5 h-5" />
                Find a Gift
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
              
              <a 
                href="/shop" 
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 border-2 border-white/20 text-white rounded-xl font-bold text-sm uppercase tracking-wide hover:bg-white/20 transition-all backdrop-blur-sm"
              >
                <Palette className="w-5 h-5" />
                Customize Your Gift
              </a>
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center justify-center gap-8 mt-12 text-zinc-400 text-sm">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-red-400" />
                <span>72hr Delivery</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-red-400" />
                <span>Premium Quality</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-red-400 fill-red-400" />
                <span>500+ Happy Customers</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. QUICK INTENT PICKER */}
      <section className="py-12 bg-zinc-50 border-b border-zinc-200">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-center text-lg font-semibold text-zinc-700 mb-6">
            Who are you buying for?
          </h2>
          
          <div className="w-full overflow-x-auto gap-3 pb-4 scrollbar-hide overscroll-x-contain">
            <div className="flex gap-3">
              {intentOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleIntentSelection(option.value)}
                  className={`flex-shrink-0 px-6 py-3 rounded-xl font-semibold text-sm transition-all border-2 ${
                    selectedIntent === option.value
                      ? 'bg-red-600 text-white border-red-600 shadow-lg'
                      : 'bg-white text-zinc-700 border-zinc-200 hover:border-red-300 hover:shadow-md'
                  }`}
                >
                  <span className="mr-2">{option.emoji}</span>
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 3. SHOP BY OCCASION - Main Discovery */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-3">
              Shop by Occasion
            </h2>
            <p className="text-zinc-600">
              Find the perfect gift for any celebration
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {occasions.map((occasion) => (
              <a
                key={occasion.slug}
                href={`/category/${occasion.slug}`}
                className="group relative bg-gradient-to-br from-zinc-50 to-white border-2 border-zinc-100 rounded-2xl p-6 hover:border-red-300 hover:shadow-xl transition-all overflow-hidden"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${occasion.gradient} opacity-0 group-hover:opacity-5 transition-opacity`} />
                
                <div className="relative text-center">
                  <div className="text-4xl mb-3">{occasion.emoji}</div>
                  <h3 className="font-bold text-sm text-zinc-900 mb-1">
                    {occasion.name}
                  </h3>
                  <ChevronRight className="w-4 h-4 text-red-500 mx-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* 4. POPULAR GIFTS - Social Proof */}
      <section className="py-16 bg-zinc-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-red-600/10 border border-red-600/20 rounded-full mb-4">
              <TrendingUp className="w-4 h-4 text-red-600" />
              <span className="text-xs font-bold uppercase tracking-wider text-red-600">
                Popular Right Now
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-3">
              Popular Gifts Right Now
            </h2>
            <p className="text-zinc-600">
              See what others are loving
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-8">
            {popularProducts.slice(0, 10).map((product) => (
              <ProductCard key={product.id} product={product} showTrending />
            ))}
          </div>

          <div className="text-center">
            <a 
              href="/marketplace" 
              className="inline-flex items-center gap-2 px-6 py-3 bg-zinc-900 text-white rounded-xl font-semibold text-sm hover:bg-red-600 transition-all group"
            >
              View All Gifts
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>
      </section>

      {/* 5. SHOP BY BUDGET */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-3">
              Shop by Budget
            </h2>
            <p className="text-zinc-600">
              Great gifts at every price point
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {budgetRanges.map((budget) => {
              const params = new URLSearchParams();
              if (budget.min) params.set('price_min', budget.min.toString());
              if (budget.max) params.set('price_max', budget.max.toString());
              
              return (
                <a
                  key={budget.range}
                  href={`/marketplace?${params.toString()}`}
                  className="group relative bg-gradient-to-br from-zinc-50 to-white border-2 border-zinc-100 rounded-2xl p-8 hover:border-red-300 hover:shadow-xl transition-all text-center overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-red-50 to-rose-50 opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  <div className="relative">
                    <div className="text-4xl mb-4">{budget.icon}</div>
                    <h3 className="font-bold text-lg text-zinc-900 mb-2">
                      {budget.label}
                    </h3>
                    <div className="inline-flex items-center gap-1 text-sm text-red-600 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                      Shop Now
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. RECOMMENDED / STAFF PICKS */}
      <section className="py-16 bg-zinc-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-600/10 border border-amber-600/20 rounded-full mb-4">
              <Star className="w-4 h-4 text-amber-600 fill-amber-600" />
              <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
                {selectedIntent ? 'Recommended for You' : 'Staff Picks'}
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-3">
              {selectedIntent ? 'Recommended for You' : 'Staff Picks'}
            </h2>
            <p className="text-zinc-600">
              {selectedIntent ? 'Curated based on your selection' : 'Handpicked by our team'}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {staffPicks.slice(0, 8).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* 7. GIFT FINDER FEATURE BLOCK */}
      <section className="py-16 bg-gradient-to-br from-red-600 to-red-500 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl mb-6">
            <Gift className="w-8 h-8" />
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Find the Perfect Gift 🎁
          </h2>
          <p className="text-lg md:text-xl text-red-50 mb-8 max-w-2xl mx-auto">
            Answer a few quick questions and we'll recommend the ideal gift
          </p>
          
          <a 
            href="/gift-finder" 
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-red-600 rounded-xl font-bold text-sm uppercase tracking-wide hover:shadow-2xl transition-all group"
          >
            Start Gift Finder
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </a>

          <p className="text-xs text-red-100 mt-6 max-w-md mx-auto">
            Takes 2 minutes • Personalized recommendations • Completely free
          </p>
        </div>
      </section>

      {/* 8. TRUST & SOCIAL PROOF */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-red-50 rounded-2xl mb-4">
                <Clock className="w-7 h-7 text-red-600" />
              </div>
              <h3 className="font-bold text-lg text-zinc-900 mb-2">72-Hour Delivery</h3>
              <p className="text-zinc-600 text-sm">Fast shipping across Nigeria</p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-red-50 rounded-2xl mb-4">
                <ShieldCheck className="w-7 h-7 text-red-600" />
              </div>
              <h3 className="font-bold text-lg text-zinc-900 mb-2">Premium Quality</h3>
              <p className="text-zinc-600 text-sm">Italian DTG inks & materials</p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-red-50 rounded-2xl mb-4">
                <Heart className="w-7 h-7 text-red-600" />
              </div>
              <h3 className="font-bold text-lg text-zinc-900 mb-2">99% Satisfaction</h3>
              <p className="text-zinc-600 text-sm">500+ happy customers</p>
            </div>
          </div>

          {/* Instagram CTA */}
          <div className="bg-gradient-to-br from-pink-50 to-rose-50 border-2 border-pink-100 rounded-3xl p-12 text-center">
            <Instagram className="w-12 h-12 text-pink-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-zinc-900 mb-3">
              Join Our Community
            </h3>
            <p className="text-zinc-600 mb-6 max-w-md mx-auto">
              Share your gifts with #LensraMoments and get featured
            </p>
            <a 
              href="https://instagram.com/lensragift" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-600 to-rose-600 text-white rounded-xl font-semibold text-sm hover:shadow-xl hover:shadow-pink-500/30 transition-all group"
            >
              <Instagram className="w-5 h-5" />
              Follow @lensragift
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>
      </section>

      {/* STICKY CTA - Mobile */}
      <div className="fixed bottom-4 right-4 md:hidden z-40">
        <a 
          href="/gift-finder" 
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-full font-bold text-sm shadow-2xl hover:shadow-red-500/50 transition-all"
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
      <div className="relative aspect-square bg-zinc-100 rounded-xl overflow-hidden mb-3 border-2 border-zinc-100 group-hover:border-red-300 group-hover:shadow-xl transition-all">
        {imageUrl ? (
          <img
            src={imageUrl} 
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ShoppingBag className="w-12 h-12 text-zinc-300" />
          </div>
        )}
        
        {showTrending && (product.is_trending || product.is_featured) && (
          <div className="absolute top-2 left-2 bg-gradient-to-r from-red-500 to-red-400 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            Trending
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="absolute bottom-3 left-3 right-3 transform translate-y-4 group-hover:translate-y-0 transition-transform">
          <button className="w-full py-2.5 bg-white text-zinc-900 rounded-lg text-xs font-bold hover:bg-red-500 hover:text-white transition-colors shadow-lg">
            Quick View
          </button>
        </div>
      </div>
      
      <div className="px-1">
        <h3 className="font-semibold text-zinc-900 mb-1 line-clamp-2 group-hover:text-red-600 transition-colors text-sm leading-tight">
          {product.name}
        </h3>
        <p className="font-bold text-lg text-red-600">
          ₦{parseFloat(product.base_price || "0").toLocaleString()}
        </p>
      </div>
    </a>
  );
}