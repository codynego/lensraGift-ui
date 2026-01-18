"use client";

import { useState, useEffect } from 'react';
import { 
  ShoppingBag, Zap, TrendingUp, Award, ArrowRight, 
  ShieldCheck, Loader2, Edit3, Palette, ChevronRight,
  Shirt, Coffee, Home, Briefcase, Gift, Sparkles, Clock, MapPin, Eye, Search, User, Heart, Menu, X, Cake, Image, ThumbsUp, HandHeart, Upload, Package, Truck, Star, Instagram, MessageCircle, Users
} from 'lucide-react';

const BaseUrl = "https://api.lensra.com/";

interface Product {
  id: number;
  slug: string;
  name: string;
  base_price: string;
  category: string;
  image_url: string | null;
  is_active: boolean;
  is_trending: boolean;
  is_featured: boolean;
}

interface Design {
  id: number;
  name: string;
  preview_image?: string | null;
}

const getImageUrl = (imagePath: string | null | undefined): string | null => {
  if (!imagePath) return null;
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  return `${BaseUrl.replace(/\/$/, '')}${imagePath.startsWith('/') ? imagePath : '/' + imagePath}`;
};

export default function LensraHomepage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [featuredDesigns, setFeaturedDesigns] = useState<Design[]>([]);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  const occasions = [
    {
      name: "For Love",
      icon: <Heart className="w-5 h-5" />,
      color: "from-red-500 to-red-600",
      tagline: "Show your love with a personalized gift they'll never forget",
      badge: "Most Popular"
    },
    {
      name: "For Birthdays",
      icon: <Cake className="w-5 h-5" />,
      color: "from-pink-500 to-pink-600",
      tagline: "Make every birthday unforgettable with a custom gift"
    },
    {
      name: "For Memories",
      icon: <Image className="w-5 h-5" />,
      color: "from-rose-500 to-rose-600",
      tagline: "Preserve your precious moments in beautiful, lasting gifts"
    },
    {
      name: "For Thanks",
      icon: <ThumbsUp className="w-5 h-5" />,
      color: "from-orange-500 to-orange-600",
      tagline: "Express gratitude with a thoughtful, personalized touch"
    },
    {
      name: "Just Because",
      icon: <Sparkles className="w-5 h-5" />,
      color: "from-emerald-500 to-emerald-600",
      tagline: "Surprise someone special without needing a reason"
    },
  ];

  const heroSlides = [
    {
      title: "Your Photo",
      description: "Upload your favorite memory",
      icon: <Upload className="w-8 h-8" />
    },
    {
      title: "Our Magic",
      description: "We create your perfect gift",
      icon: <Sparkles className="w-8 h-8" />
    },
    {
      title: "Pure Joy",
      description: "Delivered to their doorstep",
      icon: <Gift className="w-8 h-8" />
    }
  ];

  const testimonials = [
    {
      name: "Chioma A.",
      location: "Lagos",
      text: "Best Valentine's gift ever! My boyfriend loved the personalized mug. Quality is amazing!",
      rating: 5,
      image: null
    },
    {
      name: "Tunde O.",
      location: "Abuja",
      text: "Ordered a custom t-shirt for my mum's birthday. She cried happy tears. Thank you Lensra!",
      rating: 5,
      image: null
    },
    {
      name: "Sarah M.",
      location: "Port Harcourt",
      text: "Fast delivery and beautiful printing. I'm definitely ordering again for Christmas!",
      rating: 5,
      image: null
    }
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [prodRes, designRes] = await Promise.all([
          fetch(`${BaseUrl}api/products/`),
          fetch(`${BaseUrl}api/designs/public/`)
        ]);
        
        const prodData = await prodRes.json();
        const designData = await designRes.json();

        const extractedProducts = Array.isArray(prodData) ? prodData : (prodData.results || []);
        const extractedDesigns = Array.isArray(designData) ? designData : (designData.results || []);

        setProducts(extractedProducts);
        setFeaturedDesigns(extractedDesigns);
      } catch (err) {
        console.error("Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-white via-red-50/20 to-white">
      <div className="relative">
        <div className="w-20 h-20 rounded-full border-4 border-red-100 border-t-red-600 animate-spin" />
        <Sparkles className="w-6 h-6 text-red-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
      </div>
      <span className="text-xs font-black uppercase tracking-[0.4em] text-zinc-400 mt-6 animate-pulse">
        Loading Studio...
      </span>
    </div>
  );

  return (
    <div className="min-h-screen bg-white selection:bg-red-600 selection:text-white">
      
      {/* HERO SECTION - Enhanced with emotional headline + carousel */}
      <section className="relative overflow-hidden">
        <div className="max-w-[1600px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            
            {/* Left Content */}
            <div className="relative bg-gradient-to-br from-zinc-950 via-zinc-900 to-black px-6 md:px-12 py-16 md:py-24 flex items-center">
              <div className="absolute inset-0 opacity-[0.03]" 
                   style={{ 
                     backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', 
                     backgroundSize: '50px 50px' 
                   }} 
              />
              
              <div className="relative z-10 max-w-xl">
                <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-red-600/10 border border-red-600/20 rounded-full mb-6">
                  <Heart className="w-4 h-4 text-red-500 fill-red-500 animate-pulse" />
                  <span className="font-black uppercase tracking-[0.3em] text-[10px] text-red-500">
                    500+ Happy Nigerians Trust Us
                  </span>
                </div>
                
                <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-[0.95] mb-6 italic uppercase text-white">
                  Turn Your Photos Into Unforgettable Gifts
                </h1>
                
                <p className="text-base text-zinc-300 mb-4 font-bold uppercase tracking-wider leading-relaxed">
                  Delivered anywhere in Nigeria in 72 hours
                </p>
                
                <p className="text-sm text-zinc-400 mb-8 font-bold uppercase tracking-wide">
                  Fast, reliable, and personalized for every occasion
                </p>

                {/* Visual Process Carousel */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8">
                  <div className="flex items-center justify-between mb-4">
                    {heroSlides.map((_, idx) => (
                      <div
                        key={idx}
                        className={`h-1 flex-1 mx-1 rounded-full transition-all ${
                          idx === currentSlide ? 'bg-red-600' : 'bg-white/20'
                        }`}
                      />
                    ))}
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-red-600 to-red-700 rounded-2xl flex items-center justify-center mx-auto mb-4 text-white">
                      {heroSlides[currentSlide].icon}
                    </div>
                    <h3 className="text-lg font-black uppercase text-white mb-2">
                      {heroSlides[currentSlide].title}
                    </h3>
                    <p className="text-xs font-bold uppercase tracking-wide text-zinc-400">
                      {heroSlides[currentSlide].description}
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                  <div className="flex items-center gap-2 bg-white/5 px-4 py-3 rounded-lg border border-white/10">
                    <Clock className="w-5 h-5 text-red-500 flex-shrink-0" />
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-wider text-zinc-400">Delivery</p>
                      <p className="text-xs font-black uppercase text-white">72 Hours</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 bg-white/5 px-4 py-3 rounded-lg border border-white/10">
                    <ShieldCheck className="w-5 h-5 text-red-500 flex-shrink-0" />
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-wider text-zinc-400">Quality</p>
                      <p className="text-xs font-black uppercase text-white">Premium</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 bg-white/5 px-4 py-3 rounded-lg border border-white/10">
                    <MapPin className="w-5 h-5 text-red-500 flex-shrink-0" />
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-wider text-zinc-400">Coverage</p>
                      <p className="text-xs font-black uppercase text-white">All Nigeria</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <a 
                    href="/editor" 
                    className="inline-flex items-center justify-center gap-4 px-10 py-5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-full font-black uppercase text-xs tracking-[0.3em] hover:shadow-2xl hover:shadow-red-600/50 transition-all"
                  >
                    <span>Start Creating Your Gift</span>
                    <ArrowRight className="w-5 h-5" />
                  </a>
                  <a 
                    href="/products" 
                    className="inline-flex items-center justify-center gap-4 px-10 py-5 bg-white/10 border border-white/20 text-white rounded-full font-black uppercase text-xs tracking-[0.3em] hover:bg-white/20 transition-all"
                  >
                    <span>Browse Products</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Right Hero Image */}
            <div className="relative bg-zinc-100 min-h-[400px] lg:min-h-[600px] overflow-hidden">
              <img 
                src="/heroimg-4.png" 
                alt="Hero Banner" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-l from-transparent to-black/20" />
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS - Simple 3-step process */}
      <section className="py-16 bg-zinc-50">
        <div className="max-w-[1600px] mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-black tracking-tighter uppercase italic text-zinc-900 mb-2">
              How It Works
            </h2>
            <p className="text-xs font-black uppercase tracking-widest text-zinc-600">
              Three simple steps to your perfect gift
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-red-600 to-red-700 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Upload className="w-10 h-10 text-white" />
              </div>
              <div className="mb-4">
                <span className="inline-block px-4 py-1.5 bg-red-600 text-white rounded-full text-xs font-black uppercase tracking-wider">
                  Step 1
                </span>
              </div>
              <h3 className="text-lg font-black uppercase italic text-zinc-900 mb-3">Upload</h3>
              <p className="text-sm text-zinc-600 font-bold uppercase tracking-wide">
                Choose your favorite photo or design
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-red-600 to-red-700 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
              <div className="mb-4">
                <span className="inline-block px-4 py-1.5 bg-red-600 text-white rounded-full text-xs font-black uppercase tracking-wider">
                  Step 2
                </span>
              </div>
              <h3 className="text-lg font-black uppercase italic text-zinc-900 mb-3">We Design</h3>
              <p className="text-sm text-zinc-600 font-bold uppercase tracking-wide">
                We create your custom gift with premium quality
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-red-600 to-red-700 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Truck className="w-10 h-10 text-white" />
              </div>
              <div className="mb-4">
                <span className="inline-block px-4 py-1.5 bg-red-600 text-white rounded-full text-xs font-black uppercase tracking-wider">
                  Step 3
                </span>
              </div>
              <h3 className="text-lg font-black uppercase italic text-zinc-900 mb-3">Delivered</h3>
              <p className="text-sm text-zinc-600 font-bold uppercase tracking-wide">
                Fast delivery anywhere in Nigeria
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* OCCASIONS/BUNDLES - Enhanced with taglines and hover effects */}
      <section className="py-16 bg-white">
        <div className="max-w-[1600px] mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-black tracking-tighter uppercase italic text-zinc-900 mb-2">
              Shop By Occasion
            </h2>
            <p className="text-xs font-black uppercase tracking-widest text-zinc-600">
              Perfect gifts for every special moment
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {occasions.map((occasion) => (
              <a 
                key={occasion.name} 
                href={`/products?occasion=${occasion.name}`} 
                className="group relative bg-gradient-to-br from-zinc-50 to-zinc-100 rounded-2xl overflow-hidden hover:shadow-2xl transition-all hover:-translate-y-2 p-8"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${occasion.color} opacity-10 group-hover:opacity-20 transition-opacity`} />
                
                {occasion.badge && (
                  <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider shadow-lg">
                    {occasion.badge}
                  </div>
                )}

                <div className="relative">
                  <div className={`w-16 h-16 mb-6 rounded-full bg-gradient-to-br ${occasion.color} flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg`}>
                    <span className="text-white">{occasion.icon}</span>
                  </div>
                  
                  <p className="text-sm font-black uppercase tracking-widest text-zinc-900 mb-3">{occasion.name}</p>
                  
                  <p className="text-xs text-zinc-600 font-bold uppercase tracking-wide mb-4 leading-relaxed">
                    {occasion.tagline}
                  </p>

                  <div className="opacity-0 group-hover:opacity-100 transition-all">
                    <button className="w-full py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg text-xs font-black uppercase tracking-wider hover:shadow-lg transition-all">
                      Shop Bundle
                    </button>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* PRODUCTS - Grouped by category with emotional taglines */}
      <section className="py-16 bg-zinc-50">
        <div className="max-w-[1600px] mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-black tracking-tighter uppercase italic text-zinc-900 mb-2">
              Our Products
            </h2>
            <p className="text-xs font-black uppercase tracking-widest text-zinc-600">
              Premium quality gifts for every occasion
            </p>
          </div>

          {/* Home Category */}
          {products.filter(p => p.category?.toLowerCase().includes('home')).length > 0 && (
            <div className="mb-16">
              <h3 className="text-2xl font-black uppercase italic text-zinc-900 mb-6 flex items-center gap-3">
                <Home className="w-6 h-6 text-red-600" />
                Home & Living
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                {products.filter(p => p.category?.toLowerCase().includes('home')).slice(0, 6).map((product) => (
                  <EnhancedProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          )}

          {/* Daily Use Category */}
          {products.filter(p => p.category?.toLowerCase().includes('daily') || p.category?.toLowerCase().includes('mug') || p.category?.toLowerCase().includes('bottle')).length > 0 && (
            <div className="mb-16">
              <h3 className="text-2xl font-black uppercase italic text-zinc-900 mb-6 flex items-center gap-3">
                <Coffee className="w-6 h-6 text-red-600" />
                Daily Essentials
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                {products.filter(p => p.category?.toLowerCase().includes('daily') || p.category?.toLowerCase().includes('mug') || p.category?.toLowerCase().includes('bottle')).slice(0, 6).map((product) => (
                  <EnhancedProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          )}

          {/* Wearables Category */}
          {products.filter(p => p.category?.toLowerCase().includes('wear') || p.category?.toLowerCase().includes('shirt') || p.category?.toLowerCase().includes('apparel')).length > 0 && (
            <div className="mb-16">
              <h3 className="text-2xl font-black uppercase italic text-zinc-900 mb-6 flex items-center gap-3">
                <Shirt className="w-6 h-6 text-red-600" />
                Wearables
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                {products.filter(p => p.category?.toLowerCase().includes('wear') || p.category?.toLowerCase().includes('shirt') || p.category?.toLowerCase().includes('apparel')).slice(0, 6).map((product) => (
                  <EnhancedProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          )}

          {/* Fallback - All Products if no categories match */}
          {products.filter(p => p.category?.toLowerCase().includes('home')).length === 0 && 
           products.filter(p => p.category?.toLowerCase().includes('daily') || p.category?.toLowerCase().includes('mug')).length === 0 &&
           products.filter(p => p.category?.toLowerCase().includes('wear') || p.category?.toLowerCase().includes('shirt')).length === 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {products.slice(0, 12).map((product) => (
                <EnhancedProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* MYSTERY BOXES - With urgency and scarcity */}
      <section className="py-16 bg-gradient-to-br from-zinc-900 to-black relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" 
             style={{ 
               backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', 
               backgroundSize: '50px 50px' 
             }} 
        />
        
        <div className="max-w-[1600px] mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-600/10 rounded-full mb-4">
              <Gift className="w-4 h-4 text-red-500" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-red-500">Limited Edition</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black tracking-tighter uppercase italic text-white mb-3">
              Can't Decide? Try Our Mystery Box
            </h2>
            <p className="text-sm text-zinc-400 font-bold uppercase tracking-wide max-w-2xl mx-auto">
              Surprise gift bundles curated with love
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { name: "Love Edition", stock: 5, items: "1 premium gift + 1 surprise item" },
              { name: "Birthday Special", stock: 3, items: "2 personalized gifts + 1 surprise" },
              { name: "Deluxe Bundle", stock: 2, items: "3 premium items + special surprise" }
            ].map((box) => (
              <div key={box.name} className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center hover:bg-white/10 transition-all">
                <div className="w-20 h-20 bg-gradient-to-br from-red-600 to-red-700 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Gift className="w-10 h-10 text-white" />
                </div>
                
                <h3 className="text-lg font-black uppercase text-white mb-2">{box.name}</h3>
                <p className="text-xs font-bold uppercase tracking-wide text-zinc-400 mb-4">
                  {box.items}
                </p>
                
                <div className="inline-block px-4 py-2 bg-red-600/20 border border-red-600/40 rounded-full mb-6">
                  <span className="text-xs font-black uppercase tracking-wider text-red-400">
                    Only {box.stock} Left!
                  </span>
                </div>

                <a 
                  href="/mystery-box" 
                  className="block w-full py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg text-xs font-black uppercase tracking-wider hover:shadow-lg transition-all"
                >
                  Grab Yours Now
                </a>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <a 
              href="/mystery-boxes" 
              className="inline-flex items-center gap-3 text-xs font-black uppercase tracking-widest text-white hover:text-red-500 transition-colors"
            >
              See All Mystery Boxes
              <ChevronRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* SOCIAL PROOF - Testimonials & Instagram feed */}
      <section className="py-16 bg-white">
        <div className="max-w-[1600px] mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-600/10 rounded-full mb-4">
              <Heart className="w-4 h-4 text-red-600" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-red-600">Customer Love</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black tracking-tighter uppercase italic text-zinc-900 mb-3">
              What Our Customers Say
            </h2>
            <p className="text-sm text-zinc-600 font-bold uppercase tracking-wide max-w-2xl mx-auto">
              Real stories from real customers across Nigeria
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {testimonials.map((testimonial, idx) => (
              <div key={idx} className="bg-zinc-50 rounded-2xl p-8 border border-zinc-200">
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-red-600 fill-red-600" />
                  ))}
                </div>
                <p className="text-sm text-zinc-700 mb-6 leading-relaxed">"{testimonial.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-red-700 rounded-full flex items-center justify-center">
                    <span className="text-white font-black text-lg">{testimonial.name[0]}</span>
                  </div>
                  <div>
                    <p className="text-sm font-black uppercase text-zinc-900">{testimonial.name}</p>
                    <p className="text-xs font-bold uppercase tracking-wide text-zinc-500">{testimonial.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Instagram CTA */}
          <div className="text-center bg-gradient-to-br from-zinc-50 to-zinc-100 rounded-2xl p-12 border border-zinc-200">
            <Instagram className="w-12 h-12 text-red-600 mx-auto mb-4" />
            <h3 className="text-2xl font-black uppercase italic text-zinc-900 mb-3">Share Your Gift Story</h3>
            <p className="text-sm text-zinc-600 font-bold uppercase tracking-wide mb-6 max-w-md mx-auto">
              Tag us with #LensraGifts and get featured on our page
            </p>
            <a 
              href="https://instagram.com/lensragifts" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-full font-black uppercase text-xs tracking-widest hover:shadow-2xl hover:shadow-red-600/30 transition-all"
            >
              Follow @LensraGifts
              <Instagram className="w-5 h-5" />
            </a>
          </div>
        </div>
      </section>

      {/* RESELLER SECTION */}
      <section className="py-16 bg-zinc-50">
        <div className="max-w-[1600px] mx-auto px-4">
          <div className="bg-gradient-to-br from-zinc-900 to-black rounded-3xl p-12 md:p-16 text-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-[0.03]" 
                 style={{ 
                   backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', 
                   backgroundSize: '50px 50px' 
                 }} 
            />
            
            <div className="relative z-10 max-w-3xl mx-auto">
              <Users className="w-16 h-16 text-red-600 mx-auto mb-6" />
              <h2 className="text-3xl md:text-5xl font-black tracking-tighter uppercase italic text-white mb-4">
                Become A Reseller
              </h2>
              <p className="text-sm text-zinc-300 font-bold uppercase tracking-wide mb-8">
                Earn by selling LensraGifts. Join our growing network of resellers across Nigeria
              </p>
              <a 
                href="/reseller-program" 
                className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-full font-black uppercase text-xs tracking-[0.3em] hover:shadow-2xl hover:shadow-red-600/50 transition-all"
              >
                <span>Learn More</span>
                <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED DESIGNS */}
      <section className="py-16 bg-white">
        <div className="max-w-[1600px] mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-600/10 rounded-full mb-4">
              <Palette className="w-4 h-4 text-red-600" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-red-600">Design Library</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black tracking-tighter uppercase italic text-zinc-900 mb-3">
              Ready-Made Designs
            </h2>
            <p className="text-sm text-zinc-600 font-bold uppercase tracking-wide max-w-2xl mx-auto">
              Choose from our curated collection and customize in seconds
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {featuredDesigns.slice(0, 12).map((design) => (
              <DesignCard key={design.id} design={design} />
            ))}
          </div>

          <div className="text-center mt-12">
            <a 
              href="/design-ideas" 
              className="inline-flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-full text-xs font-black uppercase tracking-widest hover:shadow-2xl hover:shadow-red-600/30 transition-all"
            >
              Browse All Designs
              <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        </div>
      </section>

      {/* TRUST & VALUE PROPS */}
      <section className="py-16 bg-gradient-to-br from-zinc-950 via-zinc-900 to-black relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" 
             style={{ 
               backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', 
               backgroundSize: '50px 50px' 
             }} 
        />
        
        <div className="max-w-[1600px] mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-black tracking-tighter uppercase italic text-white mb-3">
              Why Choose Lensra?
            </h2>
            <p className="text-sm text-zinc-400 font-bold uppercase tracking-wide">
              Premium quality, lightning-fast delivery
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center hover:bg-white/10 transition-all">
              <div className="w-16 h-16 bg-gradient-to-br from-red-600 to-red-700 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <ShieldCheck className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-sm font-black uppercase tracking-widest text-white mb-3">Premium Quality</h3>
              <p className="text-xs font-bold uppercase tracking-wide text-zinc-400">Italian DTG Inks & Premium Materials</p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center hover:bg-white/10 transition-all">
              <div className="w-16 h-16 bg-gradient-to-br from-red-600 to-red-700 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-sm font-black uppercase tracking-widest text-white mb-3">Fast Delivery</h3>
              <p className="text-xs font-bold uppercase tracking-wide text-zinc-400">72-Hour Turnaround Time</p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center hover:bg-white/10 transition-all">
              <div className="w-16 h-16 bg-gradient-to-br from-red-600 to-red-700 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-sm font-black uppercase tracking-widest text-white mb-3">ISO Certified</h3>
              <p className="text-xs font-bold uppercase tracking-wide text-zinc-400">Quality Assurance Standards</p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center hover:bg-white/10 transition-all">
              <div className="w-16 h-16 bg-gradient-to-br from-red-600 to-red-700 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <MapPin className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-sm font-black uppercase tracking-widest text-white mb-3">Local Team</h3>
              <p className="text-xs font-bold uppercase tracking-wide text-zinc-400">Lagos-Based Support</p>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-zinc-900 text-white py-12 border-t border-zinc-800">
        <div className="max-w-[1600px] mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="text-xs font-black uppercase tracking-widest mb-4">Shop</h4>
              <ul className="space-y-2 text-xs font-bold uppercase tracking-wide text-zinc-400">
                <li><a href="/products" className="hover:text-red-500 transition-colors">All Products</a></li>
                <li><a href="/products?filter=trending" className="hover:text-red-500 transition-colors">Trending</a></li>
                <li><a href="/products?filter=new" className="hover:text-red-500 transition-colors">New Arrivals</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-black uppercase tracking-widest mb-4">Create</h4>
              <ul className="space-y-2 text-xs font-bold uppercase tracking-wide text-zinc-400">
                <li><a href="/design-ideas" className="hover:text-red-500 transition-colors">Design Ideas</a></li>
                <li><a href="/custom-design" className="hover:text-red-500 transition-colors">Custom Design</a></li>
                <li><a href="/editor" className="hover:text-red-500 transition-colors">Design Editor</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-black uppercase tracking-widest mb-4">Support</h4>
              <ul className="space-y-2 text-xs font-bold uppercase tracking-wide text-zinc-400">
                <li><a href="/contact" className="hover:text-red-500 transition-colors">Contact Us</a></li>
                <li><a href="/faq" className="hover:text-red-500 transition-colors">FAQ</a></li>
                <li><a href="/shipping" className="hover:text-red-500 transition-colors">Shipping</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-black uppercase tracking-widest mb-4">Company</h4>
              <ul className="space-y-2 text-xs font-bold uppercase tracking-wide text-zinc-400">
                <li><a href="/about" className="hover:text-red-500 transition-colors">About Us</a></li>
                <li><a href="/terms" className="hover:text-red-500 transition-colors">Terms</a></li>
                <li><a href="/privacy" className="hover:text-red-500 transition-colors">Privacy</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-zinc-800 text-center">
            <p className="text-xs font-black uppercase tracking-widest text-zinc-500">
              © 2025 Lensra Print Studio. All Rights Reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function EnhancedProductCard({ product }: { product: Product }) {
  const imageUrl = getImageUrl(product.image_url);
  
  return (
    <a href={`/products/${product.slug}`} className="group block">
      <div className="relative aspect-square bg-white rounded-2xl overflow-hidden mb-3 border border-zinc-200 group-hover:border-red-300 group-hover:shadow-2xl transition-all">
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={product.name} 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-zinc-50">
            <ShoppingBag className="w-12 h-12 text-zinc-200" />
          </div>
        )}
        
        {product.is_trending && (
          <div className="absolute top-3 right-3 bg-red-600 text-white px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-wider shadow-lg">
            Most Popular
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform">
          <button className="w-full py-2.5 bg-white text-zinc-900 rounded-lg text-xs font-black uppercase tracking-wider hover:bg-red-600 hover:text-white transition-colors">
            Customize Now
          </button>
        </div>
      </div>
      
      <div>
        <h3 className="font-black text-sm tracking-tight uppercase italic text-zinc-900 leading-tight mb-1.5 truncate group-hover:text-red-600 transition-colors">
          {product.name}
        </h3>
        <p className="text-xs text-zinc-600 font-bold uppercase tracking-wide mb-2">
          Perfect for gifting
        </p>
        <p className="font-black text-base text-red-600">
          From ₦{parseFloat(product.base_price || "0").toLocaleString()}
        </p>
      </div>
    </a>
  );
}

function DesignCard({ design }: { design: Design }) {
  const imageUrl = getImageUrl(design.preview_image);
  const [showPreview, setShowPreview] = useState(false);
  
  return (
    <>
      <div className="group bg-white rounded-2xl overflow-hidden border border-zinc-200 hover:border-red-300 hover:shadow-2xl transition-all">
        <div className="relative aspect-square bg-zinc-50">
          {imageUrl ? (
            <img 
              src={imageUrl} 
              alt={design.name} 
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Edit3 className="w-12 h-12 text-zinc-200" />
            </div>
          )}
          
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all flex items-center justify-center p-4">
            <div className="opacity-0 group-hover:opacity-100 transition-all space-y-2 w-full">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setShowPreview(true);
                }}
                className="w-full px-4 py-2.5 bg-white text-zinc-900 rounded-lg text-xs font-black uppercase tracking-wider hover:bg-zinc-100 transition-colors flex items-center justify-center gap-2"
              >
                <Eye className="w-4 h-4" />
                Preview
              </button>
              <a
                href={`/editor?template=${design.id}`}
                className="block w-full px-4 py-2.5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg text-xs font-black uppercase tracking-wider hover:shadow-lg transition-all text-center"
              >
                Use Design
              </a>
            </div>
          </div>
        </div>
      </div>

      {showPreview && (
        <div 
          className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowPreview(false)}
        >
          <div className="relative max-w-4xl w-full bg-white rounded-3xl overflow-hidden shadow-2xl">
            <button
              onClick={() => setShowPreview(false)}
              className="absolute top-4 right-4 w-12 h-12 bg-zinc-100 hover:bg-zinc-200 rounded-full flex items-center justify-center transition-all z-10 shadow-lg"
            >
              <X className="w-6 h-6 text-zinc-900" />
            </button>
            
            <div className="p-8">
              {imageUrl && (
                <img 
                  src={imageUrl} 
                  alt={design.name} 
                  className="w-full max-h-[70vh] object-contain"
                  onClick={(e) => e.stopPropagation()}
                />
              )}
            </div>
            
            <div className="border-t border-zinc-100 p-6 bg-zinc-50">
              <h3 className="text-lg font-black uppercase italic text-zinc-900 mb-4">{design.name}</h3>
              <a
                href={`/editor?template=${design.id}`}
                className="block w-full px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-black uppercase text-sm tracking-widest hover:shadow-2xl hover:shadow-red-600/30 transition-all text-center"
              >
                Use This Design
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}