// app/ClientHomepage.tsx
// Updated sleek UI inspired by Redbubble: cleaner layout, reduced text sizes, better copy, enhanced responsiveness, subtle animations, vibrant accents

"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { 
  ShoppingBag, Zap, Award, ArrowRight, 
  ShieldCheck, Sparkles, Clock, MapPin, Heart, Upload, Gift, Star, Instagram, Users, Home, Coffee, Shirt, ChevronRight, Package, TrendingUp, Palette, Search, Filter, X
} from 'lucide-react';

const getImageUrl = (imagePath: string | null | undefined): string | null => {
  const BaseUrl = "https://api.lensra.com/";
  if (!imagePath) return null;
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  return `${BaseUrl.replace(/\/$/, '')}${imagePath.startsWith('/') ? imagePath : '/' + imagePath}`;
};

export default function ClientHomepage({ initialProducts }: { initialProducts: any[] }) {
  const [products] = useState(initialProducts);
  const [loading] = useState(false);
  const [activeTab, setActiveTab] = useState<'marketplace' | 'custom'>('marketplace');
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const marketplaceCategories = [
    {
      title: "Birthdays",
      emoji: "🎂",
      gradient: "from-pink-500 via-rose-500 to-red-500",
      count: "50+ designs",
      description: "Unforgettable celebrations"
    },
    {
      title: "Love & Romance",
      emoji: "💝",
      gradient: "from-red-500 via-pink-500 to-rose-500",
      count: "40+ designs",
      description: "Heartfelt expressions"
    },
    {
      title: "Friendships",
      emoji: "🤝",
      gradient: "from-amber-500 via-orange-500 to-yellow-500",
      count: "35+ designs",
      description: "Bonds that last"
    },
    {
      title: "Breakup Gifts",
      emoji: "💔",
      gradient: "from-purple-500 via-violet-500 to-indigo-500",
      count: "15+ designs",
      description: "Healing with humor"
    },
    {
      title: "Inside Jokes",
      emoji: "😂",
      gradient: "from-cyan-500 via-blue-500 to-indigo-500",
      count: "30+ designs",
      description: "Shared laughs"
    },
    {
      title: "Thank You",
      emoji: "🙏",
      gradient: "from-green-500 via-emerald-500 to-teal-500",
      count: "25+ designs",
      description: "Grateful gestures"
    }
  ];

  const testimonials = [
    {
      name: "Osas E.",
      location: "Benin City",
      text: "Found the perfect birthday gift in minutes. Exceptional quality!",
      rating: 5,
      type: "marketplace"
    },
    {
      name: "Tunde O.",
      location: "Lagos",
      text: "Custom mug with our photo brought tears of joy. Absolutely worth it!",
      rating: 5,
      type: "custom"
    },
    {
      name: "Sarah M.",
      location: "Abuja",
      text: "Marketplace and custom options are both top-notch. Quick delivery!",
      rating: 5,
      type: "both"
    }
  ];

  const features = [
    {
      icon: <Clock className="w-5 h-5" />,
      title: "72-Hour Delivery",
      description: "Nationwide in Nigeria"
    },
    {
      icon: <ShieldCheck className="w-5 h-5" />,
      title: "Premium Quality",
      description: "Italian DTG inks"
    },
    {
      icon: <Heart className="w-5 h-5" />,
      title: "99% Satisfaction",
      description: "500+ happy customers"
    },
    {
      icon: <MapPin className="w-5 h-5" />,
      title: "Lagos-Based",
      description: "Local support"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="relative">
        <div className="w-12 h-12 rounded-full border-4 border-neutral-200 border-t-red-500 animate-spin" />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white selection:bg-red-100 selection:text-red-900">
      
      {/* HERO SECTION - Sleek Dual Path with Search Inspiration */}
      <section className="relative bg-gradient-to-br from-zinc-950 to-zinc-900 overflow-hidden">
        {/* Subtle Pattern */}
        <div className="absolute inset-0 opacity-[0.02]" 
             style={{ 
               backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', 
               backgroundSize: '40px 40px' 
             }} 
        />
        
        <div className="max-w-7xl mx-auto px-4 py-16 md:py-24 relative z-10">
          <div className="text-center max-w-4xl mx-auto mb-12">
            {/* Subtle Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-red-600/5 border border-red-600/10 rounded-full mb-6">
              <Heart className="w-3 h-3 text-red-400 fill-red-400 animate-pulse" />
              <span className="font-semibold uppercase tracking-wider text-[9px] text-red-400">
                Trusted by 500+ Nigerians
              </span>
            </div>
            
            {/* Reduced Heading Size */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight mb-4 italic uppercase text-white">
              Gifts That Create
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-400">
                Lasting Memories
              </span>
            </h1>
            
            <p className="text-base md:text-lg text-zinc-300 mb-10 font-medium tracking-wide max-w-2xl mx-auto">
              Discover curated designs or craft your own unique gift. Perfect for every moment.
            </p>

            {/* Tabs - Sleeker, Smaller */}
            <div className="inline-flex bg-white/5 border border-white/5 p-1 rounded-xl mb-6 backdrop-blur-md shadow-md">
              <button
                onClick={() => setActiveTab('marketplace')}
                className={`px-6 py-2.5 rounded-lg text-[10px] font-semibold uppercase tracking-wider transition-all ${
                  activeTab === 'marketplace'
                    ? 'bg-red-600 text-white shadow-md shadow-red-600/20'
                    : 'text-zinc-300 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <ShoppingBag className="w-3 h-3" />
                  Marketplace
                </div>
              </button>
              <button
                onClick={() => setActiveTab('custom')}
                className={`px-6 py-2.5 rounded-lg text-[10px] font-semibold uppercase tracking-wider transition-all ${
                  activeTab === 'custom'
                    ? 'bg-red-600 text-white shadow-md shadow-red-600/20'
                    : 'text-zinc-300 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <Palette className="w-3 h-3" />
                  Custom Design
                </div>
              </button>
            </div>

            {/* Dynamic CTA - Compact */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
              {activeTab === 'marketplace' ? (
                <>
                  <a 
                    href="/marketplace" 
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-lg font-semibold uppercase text-[10px] tracking-wide hover:shadow-lg hover:shadow-red-500/30 transition-all group"
                  >
                    Explore Now
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </a>
                  <a 
                    href="/gift-finder" 
                    className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 text-zinc-200 rounded-lg font-semibold uppercase text-[10px] tracking-wide hover:bg-white/10 transition-all"
                  >
                    <Gift className="w-3 h-3" />
                    Gift Finder
                  </a>
                </>
              ) : (
                <>
                  <a 
                    href="/editor" 
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-lg font-semibold uppercase text-[10px] tracking-wide hover:shadow-lg hover:shadow-red-500/30 transition-all group"
                  >
                    Start Designing
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </a>
                  <a 
                    href="/products" 
                    className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 text-zinc-200 rounded-lg font-semibold uppercase text-[10px] tracking-wide hover:bg-white/10 transition-all"
                  >
                    All Products
                  </a>
                </>
              )}
            </div>
          </div>

          {/* Compact Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {features.map((feature, idx) => (
              <div key={idx} className="text-center">
                <div className="inline-flex items-center justify-center w-10 h-10 bg-red-600/5 border border-red-600/10 text-red-400 rounded-lg mb-2">
                  {feature.icon}
                </div>
                <p className="font-semibold uppercase tracking-wide text-xs text-white mb-1">{feature.title}</p>
                <p className="text-[9px] font-medium uppercase tracking-wider text-zinc-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MARKETPLACE SECTION - Horizontal Categories, Carousel Inspiration */}
      <section className="py-16 bg-zinc-50">
        <div className="max-w-7xl mx-auto px-4">
          {/* Header - Smaller */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-600/5 border border-red-600/10 rounded-full mb-4">
              <ShoppingBag className="w-3 h-3 text-red-500" />
              <span className="text-[9px] font-semibold uppercase tracking-wider text-red-500">
                Ready-Made Gifts
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight uppercase italic text-zinc-900 mb-3">
              Discover Curated Designs
            </h2>
            <p className="text-sm font-medium tracking-wide text-zinc-600">
              Handpicked gifts for every occasion. Personalize and order instantly.
            </p>
          </div>

          {/* Categories - Horizontal Scroll on Mobile */}
          <div className="flex overflow-x-auto md:grid md:grid-cols-6 gap-3 pb-4 md:pb-0 snap-x snap-mandatory scrollbar-hide mb-12">
            {marketplaceCategories.map((category) => (
              <a
                key={category.title}
                href={`/marketplace?category=${category.title.toLowerCase()}`}
                className="group relative bg-white border border-zinc-100 rounded-xl p-4 hover:border-red-200 hover:shadow-md transition-all flex-shrink-0 w-[160px] md:w-auto snap-center overflow-hidden"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-0 group-hover:opacity-5 transition-opacity`} />
                <div className="relative">
                  <div className="text-3xl mb-2">{category.emoji}</div>
                  <h3 className="font-semibold uppercase tracking-tight text-xs text-zinc-900 mb-1">{category.title}</h3>
                  <p className="text-[9px] font-medium uppercase tracking-wide text-zinc-500 mb-1">{category.description}</p>
                  <p className="text-[9px] font-semibold uppercase text-red-500">{category.count}</p>
                </div>
                <ChevronRight className="absolute top-2 right-2 w-4 h-4 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
            ))}
          </div>

          {/* Trending - Grid with See More */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold uppercase italic text-zinc-900">Trending Designs</h3>
              <a 
                href="/marketplace" 
                className="text-[10px] font-semibold uppercase tracking-wider text-red-500 hover:text-red-600 flex items-center gap-1"
              >
                See More
                <ArrowRight className="w-3 h-3" />
              </a>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {products.filter(p => p.is_featured || (p.is_trending && !p.is_customizable)).slice(0, 8).map((product) => (
                <MarketplaceProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>

          {/* Gift Finder - Compact CTA */}
          <div className="bg-gradient-to-br from-zinc-900 to-zinc-800 rounded-2xl p-8 text-center border border-zinc-700 relative overflow-hidden">
            <div className="absolute inset-0 opacity-[0.02]" 
                 style={{ 
                   backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', 
                   backgroundSize: '40px 40px' 
                 }} 
            />
            <div className="relative z-10">
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-400 rounded-lg flex items-center justify-center mx-auto mb-4 shadow-md shadow-red-500/20">
                <Gift className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold tracking-tight uppercase italic text-white mb-3">
                Find the Perfect Gift
              </h3>
              <p className="text-sm text-zinc-300 font-medium tracking-wide mb-6 max-w-md mx-auto">
                Our quick quiz recommends gifts based on occasion, personality, and budget.
              </p>
              <a 
                href="/gift-finder" 
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-lg font-semibold uppercase text-[10px] tracking-wide hover:shadow-md hover:shadow-red-500/30 transition-all group"
              >
                <Gift className="w-3 h-3" />
                Start Quiz
                <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </a>
              <p className="text-[9px] text-zinc-400 font-medium uppercase tracking-wider mt-4">
                Takes 2 Minutes • Completely Free
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CUSTOM CREATOR SECTION - Streamlined Steps */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-600/5 border border-red-600/10 rounded-full mb-4">
              <Palette className="w-3 h-3 text-red-500" />
              <span className="text-[9px] font-semibold uppercase tracking-wider text-red-500">
                Create Your Own
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight uppercase italic text-zinc-900 mb-3">
              Design Unique Gifts
            </h2>
            <p className="text-sm font-medium tracking-wide text-zinc-600 max-w-md mx-auto">
              Upload photos, add text, select premium products for one-of-a-kind creations.
            </p>
          </div>

          {/* How It Works - Horizontal on Larger Screens */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {[
              {
                step: "01",
                icon: <Package className="w-5 h-5" />,
                title: "Select Product",
                description: "Mugs, frames, tees & more"
              },
              {
                step: "02",
                icon: <Upload className="w-5 h-5" />,
                title: "Customize",
                description: "Add photos & text"
              },
              {
                step: "03",
                icon: <Sparkles className="w-5 h-5" />,
                title: "We Produce",
                description: "High-quality printing"
              },
              {
                step: "04",
                icon: <Clock className="w-5 h-5" />,
                title: "Fast Shipping",
                description: "72 hours nationwide"
              }
            ].map((item) => (
              <div key={item.step} className="relative">
                <div className="bg-zinc-50 rounded-xl p-6 border border-zinc-100 hover:border-red-200 transition-all h-full">
                  <div className="inline-flex items-center justify-center w-10 h-10 bg-red-600/5 border border-red-600/10 text-red-500 rounded-lg mb-3">
                    {item.icon}
                  </div>
                  <div className="absolute top-3 right-3 text-4xl font-bold text-zinc-100 select-none">
                    {item.step}
                  </div>
                  <h3 className="font-semibold uppercase tracking-tight text-xs text-zinc-900 mb-1 relative z-10">{item.title}</h3>
                  <p className="text-[9px] font-medium uppercase tracking-wide text-zinc-600 relative z-10">{item.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Categories - Compact Grid */}
          <div className="mb-12">
            <h3 className="text-xl font-bold uppercase italic text-zinc-900 mb-4">Popular Items</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {[
                { name: "Home Decor", icon: Home, count: "12 items" },
                { name: "Drinkware", icon: Coffee, count: "8 items" },
                { name: "Apparel", icon: Shirt, count: "15 items" },
                { name: "Accessories", icon: Heart, count: "10 items" },
                { name: "Stationery", icon: Package, count: "7 items" }
              ].map((cat) => (
                <a
                  key={cat.name}
                  href={`/products?category=${cat.name.toLowerCase()}`}
                  className="group bg-zinc-50 border border-zinc-100 rounded-lg p-4 hover:border-red-200 hover:shadow-md transition-all text-center"
                >
                  <cat.icon className="w-6 h-6 text-red-500 mx-auto mb-2" />
                  <h4 className="font-semibold uppercase tracking-tight text-xs text-zinc-900 mb-1">{cat.name}</h4>
                  <p className="text-[9px] font-medium uppercase tracking-wide text-zinc-500">{cat.count}</p>
                </a>
              ))}
            </div>
          </div>

          {/* Featured Products Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-12">
            {products.filter(product => product.is_customizable).slice(0, 8).map((product) => (
              <CustomProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* CTA */}
          <div className="text-center">
            <a 
              href="/editor" 
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-lg font-semibold uppercase text-[10px] tracking-wide hover:shadow-md hover:shadow-red-500/30 transition-all group"
            >
              <Palette className="w-3 h-3" />
              Design Now
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </a>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS - Sleeker Carousel */}
      <section className="py-16 bg-zinc-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-600/5 border border-red-600/10 rounded-full mb-4">
              <Heart className="w-3 h-3 text-red-400 fill-red-400" />
              <span className="text-[9px] font-semibold uppercase tracking-wider text-red-400">
                Customer Stories
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-3">
              What Our Customers Say
            </h2>
            <p className="text-sm text-zinc-600">
              Real feedback from happy givers
            </p>
          </div>

          {/* Carousel */}
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-2xl p-8 border border-zinc-100 shadow-sm">
              <div className="flex gap-1 mb-4 justify-center">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              
              <p className="text-lg text-zinc-700 mb-6 leading-relaxed text-center">
                "{testimonials[currentTestimonial].text}"
              </p>
              
              <div className="flex items-center gap-3 justify-center">
                <div className="w-10 h-10 bg-gradient-to-br from-red-400 to-red-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-base">{testimonials[currentTestimonial].name[0]}</span>
                </div>
                <div className="text-left">
                  <p className="font-semibold text-zinc-900 text-sm">{testimonials[currentTestimonial].name}</p>
                  <p className="text-[10px] text-zinc-600">{testimonials[currentTestimonial].location}</p>
                </div>
              </div>
            </div>
            
            <div className="flex justify-center gap-1.5 mt-6">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentTestimonial(idx)}
                  className={`h-1.5 rounded-full transition-all ${
                    idx === currentTestimonial ? 'w-6 bg-red-500' : 'w-1.5 bg-zinc-300'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Instagram - Compact */}
          <div className="mt-16 text-center bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl p-8 border border-pink-100 shadow-sm">
            <Instagram className="w-12 h-12 text-pink-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-zinc-900 mb-3">
              Join the Community
            </h3>
            <p className="text-sm text-zinc-600 mb-6 max-w-md mx-auto">
              Share your gifts with #LensraMoments and get featured
            </p>
            <a 
              href="https://instagram.com/lensragifts" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-lg font-semibold text-[10px] uppercase tracking-wide hover:shadow-md hover:shadow-pink-500/20 transition-all group"
            >
              Follow Us
              <Instagram className="w-3 h-3 group-hover:scale-105 transition-transform" />
            </a>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US - Grid with Icons */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-3">
              Why Lensra?
            </h2>
            <p className="text-sm text-zinc-600">
              What sets us apart
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                icon: <ShieldCheck className="w-6 h-6" />,
                title: "Superior Quality",
                description: "Premium materials and inks"
              },
              {
                icon: <Zap className="w-6 h-6" />,
                title: "Speedy Delivery",
                description: "72 hours across Nigeria"
              },
              {
                icon: <Award className="w-6 h-6" />,
                title: "Trusted Service",
                description: "99% customer satisfaction"
              },
              {
                icon: <Users className="w-6 h-6" />,
                title: "Local Expertise",
                description: "Dedicated Lagos team"
              }
            ].map((item, idx) => (
              <div key={idx} className="bg-zinc-50 rounded-xl p-6 border border-zinc-100 hover:border-red-200 transition-all text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-red-600/5 border border-red-600/10 text-red-500 rounded-lg mb-3">
                  {item.icon}
                </div>
                <h3 className="font-semibold text-zinc-900 mb-2 text-sm">{item.title}</h3>
                <p className="text-zinc-600 text-[10px] leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RESELLER PROGRAM - Compact CTA */}
      <section className="py-16 bg-gradient-to-br from-zinc-900 to-zinc-800 text-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <Users className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            Partner with Lensra
          </h2>
          <p className="text-sm text-zinc-300 mb-6 max-w-md mx-auto">
            Join our reseller network and earn while spreading joy across Nigeria.
          </p>
          <a 
            href="/reseller-program" 
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-zinc-900 rounded-lg font-semibold text-[10px] uppercase tracking-wide hover:shadow-md hover:shadow-white/10 transition-all group"
          >
            Get Started
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </a>
        </div>
      </section>
    </div>
  );
}

function MarketplaceProductCard({ product }: { product: any }) {
  const imageUrl = getImageUrl(product.image_url);
  
  return (
    <a href={`/shop/${product.slug}`} className="group block">
      <div className="relative aspect-square bg-zinc-100 rounded-xl overflow-hidden mb-2 border border-zinc-100 group-hover:border-red-200 group-hover:shadow-md transition-all">
        {imageUrl ? (
          <img
            src={imageUrl} 
            alt={product.name}
            loading="lazy"
            className="object-cover group-hover:scale-105 transition-transform duration-300" 
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ShoppingBag className="w-8 h-8 text-zinc-300" />
          </div>
        )}
        
        {(product.is_trending || product.is_featured) && (
          <div className="absolute top-2 left-2 bg-gradient-to-r from-red-400 to-red-500 text-white px-2 py-0.5 rounded-full text-[9px] font-medium shadow-sm">
            Trending
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="absolute bottom-3 left-3 right-3 transform translate-y-4 group-hover:translate-y-0 transition-transform">
          <button className="w-full py-2 bg-white text-zinc-900 rounded-lg text-[10px] font-medium hover:bg-red-500 hover:text-white transition-colors">
            View
          </button>
        </div>
      </div>
      
      <div>
        <h3 className="font-medium text-zinc-900 mb-0.5 line-clamp-1 group-hover:text-red-500 transition-colors text-sm">
          {product.name}
        </h3>
        <p className="font-semibold text-base text-red-500">
          ₦{parseFloat(product.base_price || "0").toLocaleString()}
        </p>
      </div>
    </a>
  );
}

function CustomProductCard({ product }: { product: any }) {
  const imageUrl = getImageUrl(product.image_url);
  
  return (
    <a href={`/editor?product=${product.id}`} className="group block">
      <div className="relative aspect-square bg-zinc-100 rounded-xl overflow-hidden mb-2 border border-zinc-100 group-hover:border-red-200 group-hover:shadow-md transition-all">
        {imageUrl ? (
          <img
            src={imageUrl} 
            alt={product.name}
            loading="lazy"
            className="object-cover group-hover:scale-105 transition-transform duration-300" 
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Palette className="w-8 h-8 text-zinc-300" />
          </div>
        )}
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="absolute bottom-3 left-3 right-3 transform translate-y-4 group-hover:translate-y-0 transition-transform">
          <button className="w-full py-2 bg-white text-zinc-900 rounded-lg text-[10px] font-medium hover:bg-red-500 hover:text-white transition-colors">
            Design
          </button>
        </div>
      </div>
      
      <div>
        <h3 className="font-medium text-zinc-900 mb-0.5 line-clamp-1 group-hover:text-red-500 transition-colors text-sm">
          {product.name}
        </h3>
        <p className="font-semibold text-base text-red-500">
          ₦{parseFloat(product.base_price || "0").toLocaleString()}
        </p>
      </div>
    </a>
  );
}