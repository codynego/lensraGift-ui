// app/ClientHomepage.tsx
// Redesigned sleek UI inspired by Redbubble

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
      description: "Make their day unforgettable"
    },
    {
      title: "Love & Romance",
      emoji: "💝",
      gradient: "from-red-500 via-pink-500 to-rose-500",
      count: "40+ designs",
      description: "Express your feelings"
    },
    {
      title: "Friendships",
      emoji: "🤝",
      gradient: "from-amber-500 via-orange-500 to-yellow-500",
      count: "35+ designs",
      description: "Celebrate your squad"
    },
    {
      title: "Breakup Gifts",
      emoji: "💔",
      gradient: "from-purple-500 via-violet-500 to-indigo-500",
      count: "15+ designs",
      description: "Heal with humor"
    },
    {
      title: "Inside Jokes",
      emoji: "😂",
      gradient: "from-cyan-500 via-blue-500 to-indigo-500",
      count: "30+ designs",
      description: "Only you two understand"
    },
    {
      title: "Thank You",
      emoji: "🙏",
      gradient: "from-green-500 via-emerald-500 to-teal-500",
      count: "25+ designs",
      description: "Show appreciation"
    }
  ];

  const testimonials = [
    {
      name: "Osas E.",
      location: "Benin City",
      text: "The marketplace saved me! Found a perfect birthday design in 2 minutes. Quality is amazing!",
      rating: 5,
      type: "marketplace"
    },
    {
      name: "Tunde O.",
      location: "Lagos",
      text: "I designed my own mug with our wedding photo. My wife cried. Worth every naira!",
      rating: 5,
      type: "custom"
    },
    {
      name: "Sarah M.",
      location: "Abuja",
      text: "I've used both the marketplace and custom editor. Both are fantastic! Fast delivery too.",
      rating: 5,
      type: "both"
    }
  ];

  const features = [
    {
      icon: <Clock className="w-6 h-6" />,
      title: "72-Hour Delivery",
      description: "Anywhere in Nigeria"
    },
    {
      icon: <ShieldCheck className="w-6 h-6" />,
      title: "Premium Quality",
      description: "Italian DTG inks"
    },
    {
      icon: <Heart className="w-6 h-6" />,
      title: "99% Love Rate",
      description: "500+ happy customers"
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Lagos-Based",
      description: "Local support team"
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
        <div className="w-16 h-16 rounded-full border-4 border-neutral-200 border-t-red-500 animate-spin" />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      
      {/* HERO SECTION - Dual Path */}
      <section className="relative bg-gradient-to-br from-neutral-50 via-white to-neutral-50 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-[0.03]" 
             style={{ 
               backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="black" fill-opacity="1"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
             }} 
        />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 relative z-10">
          <div className="text-center max-w-4xl mx-auto mb-16">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 rounded-full mb-8">
              <Sparkles className="w-4 h-4 text-red-500" />
              <span className="text-xs font-semibold text-red-600 tracking-wide">
                Nigeria's #1 Personalized Gift Platform
              </span>
            </div>
            
            {/* Main Heading */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-neutral-900 mb-6 leading-none">
              Gifts that tell
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-pink-500 to-orange-500">
                your story
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-neutral-600 mb-12 max-w-2xl mx-auto leading-relaxed">
              Choose from our curated marketplace or create something completely unique. Either way, you'll give a gift they'll never forget.
            </p>

            {/* Dual CTA Tabs */}
            <div className="inline-flex bg-neutral-100 p-1.5 rounded-2xl mb-8 shadow-sm">
              <button
                onClick={() => setActiveTab('marketplace')}
                className={`px-8 py-4 rounded-xl text-sm font-semibold transition-all ${
                  activeTab === 'marketplace'
                    ? 'bg-white text-neutral-900 shadow-md'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4" />
                  <span>Browse Marketplace</span>
                </div>
                <p className="text-xs text-neutral-500 mt-1">Ready-made designs</p>
              </button>
              <button
                onClick={() => setActiveTab('custom')}
                className={`px-8 py-4 rounded-xl text-sm font-semibold transition-all ${
                  activeTab === 'custom'
                    ? 'bg-white text-neutral-900 shadow-md'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Palette className="w-4 h-4" />
                  <span>Custom Creator</span>
                </div>
                <p className="text-xs text-neutral-500 mt-1">Design from scratch</p>
              </button>
            </div>

            {/* Dynamic CTA based on active tab */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {activeTab === 'marketplace' ? (
                <>
                  <a 
                    href="/marketplace" 
                    className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-full font-semibold hover:shadow-2xl hover:shadow-red-500/30 transition-all group"
                  >
                    <span>Explore Marketplace</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </a>
                  <a 
                    href="/gift-finder" 
                    className="inline-flex items-center gap-3 px-8 py-4 bg-white border-2 border-neutral-200 text-neutral-900 rounded-full font-semibold hover:border-neutral-300 transition-all"
                  >
                    <Gift className="w-5 h-5" />
                    <span>Gift Finder Quiz</span>
                  </a>
                </>
              ) : (
                <>
                  <a 
                    href="/editor" 
                    className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-full font-semibold hover:shadow-2xl hover:shadow-purple-500/30 transition-all group"
                  >
                    <span>Start Creating</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </a>
                  <a 
                    href="/products" 
                    className="inline-flex items-center gap-3 px-8 py-4 bg-white border-2 border-neutral-200 text-neutral-900 rounded-full font-semibold hover:border-neutral-300 transition-all"
                  >
                    <span>View All Products</span>
                  </a>
                </>
              )}
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {features.map((feature, idx) => (
              <div key={idx} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-red-50 text-red-500 rounded-xl mb-3">
                  {feature.icon}
                </div>
                <p className="font-semibold text-neutral-900 mb-1">{feature.title}</p>
                <p className="text-sm text-neutral-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MARKETPLACE SECTION */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-pink-50 rounded-full mb-4">
              <ShoppingBag className="w-4 h-4 text-pink-600" />
              <span className="text-xs font-semibold text-pink-600 tracking-wide">
                Shop Ready-Made Gifts
              </span>
            </div>
            <h2 className="text-4xl md:text-6xl font-bold text-neutral-900 mb-4">
              Find Your Perfect Gift
            </h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              Expertly designed gifts for every occasion. Just click, personalize a name (optional), and order.
            </p>
          </div>

          {/* Occasion Categories Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-16">
            {marketplaceCategories.map((category) => (
              <a
                key={category.title}
                href={`/marketplace?occasion=${category.title.toLowerCase()}`}
                className="group relative bg-white border-2 border-neutral-200 rounded-2xl p-6 hover:border-neutral-300 hover:shadow-xl transition-all overflow-hidden"
              >
                {/* Gradient Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-0 group-hover:opacity-5 transition-opacity`} />
                
                <div className="relative">
                  <div className="text-4xl mb-3">{category.emoji}</div>
                  <h3 className="font-semibold text-neutral-900 mb-1">{category.title}</h3>
                  <p className="text-xs text-neutral-500 mb-2">{category.description}</p>
                  <p className="text-xs font-semibold text-red-500">{category.count}</p>
                </div>
                
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ChevronRight className="w-5 h-5 text-neutral-400" />
                </div>
              </a>
            ))}
          </div>

          {/* Featured Marketplace Items */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-neutral-900">Trending This Week</h3>
              <a 
                href="/marketplace" 
                className="text-sm font-semibold text-red-500 hover:text-red-600 flex items-center gap-1"
              >
                View all
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.filter(p => p.is_featured || p.is_trending).slice(0, 8).map((product) => (
                <MarketplaceProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>

          {/* Gift Finder CTA */}
          <div className="bg-gradient-to-br from-orange-50 to-pink-50 rounded-3xl p-12 text-center border-2 border-orange-100">
            <Gift className="w-16 h-16 text-orange-500 mx-auto mb-6" />
            <h3 className="text-3xl font-bold text-neutral-900 mb-4">
              Not Sure What to Get?
            </h3>
            <p className="text-lg text-neutral-600 mb-8 max-w-xl mx-auto">
              Take our 2-minute quiz and we'll recommend the perfect gift based on the occasion, personality, and your budget.
            </p>
            <a 
              href="/gift-finder" 
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-full font-semibold hover:shadow-2xl hover:shadow-orange-500/30 transition-all group"
            >
              <Gift className="w-5 h-5" />
              <span>Start Gift Finder</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>
      </section>

      {/* CUSTOM CREATOR SECTION */}
      <section className="py-20 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-50 rounded-full mb-4">
              <Palette className="w-4 h-4 text-purple-600" />
              <span className="text-xs font-semibold text-purple-600 tracking-wide">
                Design Your Own
              </span>
            </div>
            <h2 className="text-4xl md:text-6xl font-bold text-neutral-900 mb-4">
              Unleash Your Creativity
            </h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              Upload your photos, add text, choose from premium products. Create something truly one-of-a-kind.
            </p>
          </div>

          {/* How It Works */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16">
            {[
              {
                step: "01",
                icon: <Package className="w-6 h-6" />,
                title: "Choose Product",
                description: "Pick from mugs, frames, t-shirts & more"
              },
              {
                step: "02",
                icon: <Upload className="w-6 h-6" />,
                title: "Upload & Design",
                description: "Add your photos and personalize"
              },
              {
                step: "03",
                icon: <Sparkles className="w-6 h-6" />,
                title: "We Create Magic",
                description: "Premium quality printing & production"
              },
              {
                step: "04",
                icon: <Clock className="w-6 h-6" />,
                title: "Fast Delivery",
                description: "72 hours anywhere in Nigeria"
              }
            ].map((item) => (
              <div key={item.step} className="relative">
                <div className="bg-white rounded-2xl p-8 border-2 border-neutral-200 hover:border-purple-300 transition-all h-full">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 text-purple-600 rounded-xl mb-4">
                    {item.icon}
                  </div>
                  <div className="absolute top-4 right-4 text-6xl font-bold text-neutral-100">
                    {item.step}
                  </div>
                  <h3 className="font-semibold text-neutral-900 mb-2 relative z-10">{item.title}</h3>
                  <p className="text-sm text-neutral-600 relative z-10">{item.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Product Categories */}
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-neutral-900 mb-6">Popular Categories</h3>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
              {[
                { name: "Home Decor", icon: Home, count: "12 products" },
                { name: "Drinkware", icon: Coffee, count: "8 products" },
                { name: "Wearables", icon: Shirt, count: "15 products" },
                { name: "Accessories", icon: Heart, count: "10 products" },
                { name: "Stationery", icon: Package, count: "7 products" }
              ].map((cat) => (
                <a
                  key={cat.name}
                  href={`/products?category=${cat.name.toLowerCase()}`}
                  className="group bg-white border-2 border-neutral-200 rounded-xl p-6 hover:border-purple-300 hover:shadow-lg transition-all text-center"
                >
                  <cat.icon className="w-8 h-8 text-purple-500 mx-auto mb-3" />
                  <h4 className="font-semibold text-neutral-900 mb-1">{cat.name}</h4>
                  <p className="text-xs text-neutral-500">{cat.count}</p>
                </a>
              ))}
            </div>
          </div>

          {/* Featured Custom Products */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
            {products.slice(0, 8).map((product) => (
              <CustomProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* CTA */}
          <div className="text-center">
            <a 
              href="/editor" 
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-full font-semibold hover:shadow-2xl hover:shadow-purple-500/30 transition-all group"
            >
              <Palette className="w-5 h-5" />
              <span>Start Designing Now</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 rounded-full mb-4">
              <Heart className="w-4 h-4 text-red-500 fill-red-500" />
              <span className="text-xs font-semibold text-red-600 tracking-wide">
                Customer Love
              </span>
            </div>
            <h2 className="text-4xl md:text-6xl font-bold text-neutral-900 mb-4">
              Loved by Thousands
            </h2>
            <p className="text-lg text-neutral-600">
              Real stories from real customers
            </p>
          </div>

          {/* Testimonial Carousel */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-neutral-50 rounded-3xl p-12 md:p-16 border-2 border-neutral-200">
              <div className="flex gap-1 mb-6 justify-center">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-6 h-6 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              
              <p className="text-xl md:text-2xl text-neutral-700 mb-8 leading-relaxed text-center">
                "{testimonials[currentTestimonial].text}"
              </p>
              
              <div className="flex items-center gap-4 justify-center">
                <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-pink-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-xl">{testimonials[currentTestimonial].name[0]}</span>
                </div>
                <div className="text-left">
                  <p className="font-semibold text-neutral-900">{testimonials[currentTestimonial].name}</p>
                  <p className="text-sm text-neutral-600">{testimonials[currentTestimonial].location}</p>
                </div>
              </div>
            </div>
            
            {/* Indicators */}
            <div className="flex justify-center gap-2 mt-8">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentTestimonial(idx)}
                  className={`h-2 rounded-full transition-all ${
                    idx === currentTestimonial ? 'w-8 bg-red-500' : 'w-2 bg-neutral-300'
                  }`}
                  aria-label={`Go to testimonial ${idx + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Instagram CTA */}
          <div className="mt-20 text-center bg-gradient-to-br from-pink-50 to-purple-50 rounded-3xl p-12 border-2 border-pink-100">
            <Instagram className="w-16 h-16 text-pink-500 mx-auto mb-6" />
            <h3 className="text-3xl font-bold text-neutral-900 mb-4">
              Join Our Community
            </h3>
            <p className="text-lg text-neutral-600 mb-8 max-w-xl mx-auto">
              Share your Lensra gifts with #LensraGifts and get featured
            </p>
            <a 
              href="https://instagram.com/lensragifts" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full font-semibold hover:shadow-2xl hover:shadow-pink-500/30 transition-all group"
            >
              <span>Follow @LensraGifts</span>
              <Instagram className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </a>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="py-20 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-bold text-neutral-900 mb-4">
              The Lensra Difference
            </h2>
            <p className="text-lg text-neutral-600">
              Why thousands choose us for their gifts
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <ShieldCheck className="w-8 h-8" />,
                title: "Premium Quality",
                description: "Italian DTG inks, premium materials, ISO certified"
              },
              {
                icon: <Zap className="w-8 h-8" />,
                title: "Lightning Fast",
                description: "72-hour delivery anywhere in Nigeria"
              },
              {
                icon: <Award className="w-8 h-8" />,
                title: "Trusted Brand",
                description: "500+ satisfied customers, 99% satisfaction"
              },
              {
                icon: <Users className="w-8 h-8" />,
                title: "Local Support",
                description: "Lagos-based team ready to help"
              }
            ].map((item, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-8 border-2 border-neutral-200 hover:border-neutral-300 hover:shadow-lg transition-all text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-red-50 text-red-500 rounded-xl mb-6">
                  {item.icon}
                </div>
                <h3 className="font-semibold text-neutral-900 mb-3">{item.title}</h3>
                <p className="text-neutral-600 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RESELLER PROGRAM */}
      <section className="py-20 bg-gradient-to-br from-neutral-900 to-neutral-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Users className="w-16 h-16 text-red-400 mx-auto mb-6" />
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            Become a Lensra Partner
          </h2>
          <p className="text-lg text-neutral-300 mb-10 max-w-2xl mx-auto">
            Join our network of resellers across Nigeria. Earn while helping people create meaningful gifts.
          </p>
          <a 
            href="/reseller-program" 
            className="inline-flex items-center gap-3 px-8 py-4 bg-white text-neutral-900 rounded-full font-semibold hover:shadow-2xl hover:shadow-white/20 transition-all group"
          >
            <span>Start Earning Today</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </section>
    </div>
  );
}

function MarketplaceProductCard({ product }: { product: any }) {
  const imageUrl = getImageUrl(product.image_url);
  
  return (
    <a href={`/marketplace/${product.slug}`} className="group block">
      <div className="relative aspect-square bg-neutral-100 rounded-2xl overflow-hidden mb-3 border-2 border-neutral-200 group-hover:border-neutral-300 group-hover:shadow-xl transition-all">
        {imageUrl ? (
          <img
            src={imageUrl} 
            alt={product.name}
            loading="lazy"
            className="object-cover group-hover:scale-105 transition-transform duration-500" 
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ShoppingBag className="w-12 h-12 text-neutral-300" />
          </div>
        )}
        
        {(product.is_trending || product.is_featured) && (
          <div className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
            Trending
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="absolute bottom-4 left-4 right-4 transform translate-y-full group-hover:translate-y-0 transition-transform">
          <button className="w-full py-3 bg-white text-neutral-900 rounded-xl text-sm font-semibold hover:bg-red-500 hover:text-white transition-colors">
            Quick View
          </button>
        </div>
      </div>
      
      <div>
        <h3 className="font-semibold text-neutral-900 mb-1 line-clamp-2 group-hover:text-red-500 transition-colors">
          {product.name}
        </h3>
        <p className="font-bold text-lg text-red-500">
          ₦{parseFloat(product.base_price || "0").toLocaleString()}
        </p>
      </div>
    </a>
  );
}

function CustomProductCard({ product }: { product: any }) {
  const imageUrl = getImageUrl(product.image_url);
  
  return (
    <a href={`/editor?product=${product.slug}`} className="group block">
      <div className="relative aspect-square bg-neutral-100 rounded-2xl overflow-hidden mb-3 border-2 border-neutral-200 group-hover:border-purple-300 group-hover:shadow-xl transition-all">
        {imageUrl ? (
          <img
            src={imageUrl} 
            alt={product.name}
            loading="lazy"
            className="object-cover group-hover:scale-105 transition-transform duration-500" 
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Palette className="w-12 h-12 text-neutral-300" />
          </div>
        )}
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="absolute bottom-4 left-4 right-4 transform translate-y-full group-hover:translate-y-0 transition-transform">
          <button className="w-full py-3 bg-white text-neutral-900 rounded-xl text-sm font-semibold hover:bg-purple-500 hover:text-white transition-colors">
            Start Designing
          </button>
        </div>
      </div>
      
      <div>
        <h3 className="font-semibold text-neutral-900 mb-1 line-clamp-2 group-hover:text-purple-500 transition-colors">
          {product.name}
        </h3>
        <p className="font-bold text-lg text-purple-500">
          ₦{parseFloat(product.base_price || "0").toLocaleString()}
        </p>
      </div>
    </a>
  );
}