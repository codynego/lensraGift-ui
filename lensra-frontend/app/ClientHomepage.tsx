// app/ClientHomepage.tsx
// Client component for interactivity

"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { 
  ShoppingBag, Zap, Award, ArrowRight, 
  ShieldCheck, Sparkles, Clock, MapPin, Heart, Upload, Gift, Star, Instagram, Users, Home, Coffee, Shirt, ChevronRight, Package, TrendingUp
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
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const processSteps = [
    {
      step: "01",
      title: "Choose Your Gift",
      description: "Browse our collection of premium customizable products",
      icon: <Package className="w-6 h-6" />
    },
    {
      step: "02",
      title: "Upload & Design",
      description: "Add your photo and personalize every detail",
      icon: <Upload className="w-6 h-6" />
    },
    {
      step: "03",
      title: "We Create Magic",
      description: "Our team crafts your gift with premium quality",
      icon: <Sparkles className="w-6 h-6" />
    },
    {
      step: "04",
      title: "Fast Delivery",
      description: "Delivered anywhere in Nigeria within 72 hours",
      icon: <Clock className="w-6 h-6" />
    }
  ];

  const occasions = [
    {
      name: "Love & Romance",
      icon: <Heart className="w-5 h-5" />,
      color: "from-red-500 to-red-600",
      tagline: "Express your feelings with personalized gifts that speak from the heart",
      count: "50+ Designs"
    },
    {
      name: "Birthday Celebrations",
      icon: <Gift className="w-5 h-5" />,
      color: "from-pink-500 to-pink-600",
      tagline: "Make their special day unforgettable with unique custom gifts",
      count: "40+ Options"
    },
    {
      name: "Memorable Moments",
      icon: <Sparkles className="w-5 h-5" />,
      color: "from-purple-500 to-purple-600",
      tagline: "Turn your favorite photos into lasting memories",
      count: "35+ Products"
    },
    {
      name: "Gratitude Gifts",
      icon: <Star className="w-5 h-5" />,
      color: "from-orange-500 to-orange-600",
      tagline: "Say thank you with thoughtful, personalized appreciation",
      count: "25+ Ideas"
    }
  ];

  const testimonials = [
    {
      name: "Osas E.",
      location: "Benin City",
      text: "Ordered a custom mug for my boyfriend's birthday. The quality blew my mind! Delivery was super fast too. Lensra is now my go-to for all special occasions.",
      rating: 5
    },
    {
      name: "Tunde O.",
      location: "Lagos",
      text: "My mum cried when she saw the personalized photo frame. The print quality is incredible and the customer service team was so helpful. 100% recommended!",
      rating: 5
    },
    {
      name: "Sarah M.",
      location: "Abuja",
      text: "I've ordered 3 times already! Fast delivery, beautiful printing, and the prices are very reasonable. Thank you Lensra for making gifting so easy!",
      rating: 5
    }
  ];

  const stats = [
    { value: "500+", label: "Happy Customers" },
    { value: "1000+", label: "Gifts Created" },
    { value: "72hrs", label: "Fast Delivery" },
    { value: "99%", label: "Satisfaction Rate" }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % processSteps.length);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5500);
    return () => clearInterval(timer);
  }, []);

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-white via-red-50/20 to-white">
      <div className="relative">
        <div className="w-20 h-20 rounded-full border-4 border-red-100 border-t-red-600 animate-spin" />
        <Sparkles className="w-6 h-6 text-red-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
      </div>
      <span className="text-xs font-black uppercase tracking-[0.4em] text-zinc-400 mt-6 animate-pulse">
        Loading...
      </span>
    </div>
  );

  return (
    <div className="min-h-screen bg-white selection:bg-red-600 selection:text-white">
      
      {/* HERO SECTION - Improved hierarchy and emotional connection */}
      <section className="relative overflow-hidden bg-gradient-to-br from-zinc-950 via-zinc-900 to-black">
        <div className="absolute inset-0 opacity-[0.03]" 
             style={{ 
               backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', 
               backgroundSize: '50px 50px' 
             }} 
        />
        
        <div className="max-w-[1400px] mx-auto px-4 py-20 md:py-32 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Content */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-red-600/10 border border-red-600/20 rounded-full mb-8">
                <Heart className="w-4 h-4 text-red-500 fill-red-500 animate-pulse" />
                <span className="font-black uppercase tracking-[0.3em] text-[10px] text-red-500">
                  Trusted By 500+ Nigerians
                </span>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.9] mb-6 italic uppercase text-white">
                Gifts That Tell Your Story
              </h1>
              
              <p className="text-lg md:text-xl text-zinc-300 mb-8 font-bold uppercase tracking-wide max-w-xl mx-auto lg:mx-0">
                Transform your photos into premium personalized gifts. Delivered anywhere in Nigeria in just 72 hours.
              </p>

              {/* Stats Bar */}
              <div className="grid grid-cols-4 gap-4 mb-10 max-w-2xl mx-auto lg:mx-0">
                {stats.map((stat) => (
                  <div key={stat.label} className="text-center lg:text-left">
                    <p className="text-2xl md:text-3xl font-black text-red-500">{stat.value}</p>
                    <p className="text-[9px] font-black uppercase tracking-wider text-zinc-400">{stat.label}</p>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <a 
                  href="/editor" 
                  className="inline-flex items-center justify-center gap-4 px-10 py-5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-full font-black uppercase text-xs tracking-[0.3em] hover:shadow-2xl hover:shadow-red-600/50 transition-all group"
                >
                  <span>Create Your Gift</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </a>
                <a 
                  href="/shop" 
                  className="inline-flex items-center justify-center gap-4 px-10 py-5 bg-white/10 border border-white/20 text-white rounded-full font-black uppercase text-xs tracking-[0.3em] hover:bg-white/20 transition-all"
                >
                  <span>Browse All Products</span>
                </a>
              </div>
            </div>

            {/* Right - Process Carousel */}
            <div className="relative">
              <div className="bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12 backdrop-blur-sm">
                <div className="flex justify-between mb-6">
                  {processSteps.map((_, idx) => (
                    <div
                      key={idx}
                      className={`h-1.5 flex-1 mx-1 rounded-full transition-all ${
                        idx === currentSlide ? 'bg-red-600' : 'bg-white/20'
                      }`}
                    />
                  ))}
                </div>
                
                <div className="text-center min-h-[280px] flex flex-col justify-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-red-600 to-red-700 rounded-2xl flex items-center justify-center mx-auto mb-6 text-white">
                    {processSteps[currentSlide].icon}
                  </div>
                  <p className="text-5xl font-black text-red-500 mb-2">{processSteps[currentSlide].step}</p>
                  <h3 className="text-2xl font-black uppercase text-white mb-4">
                    {processSteps[currentSlide].title}
                  </h3>
                  <p className="text-sm font-bold uppercase tracking-wide text-zinc-400 max-w-xs mx-auto">
                    {processSteps[currentSlide].description}
                  </p>
                </div>
              </div>

              {/* Trust badges */}
              <div className="grid grid-cols-3 gap-3 mt-6">
                <div className="flex flex-col items-center gap-2 bg-white/5 px-4 py-3 rounded-xl border border-white/10">
                  <Clock className="w-5 h-5 text-red-500" />
                  <p className="text-[9px] font-black uppercase tracking-wider text-zinc-400">72hr Delivery</p>
                </div>
                <div className="flex flex-col items-center gap-2 bg-white/5 px-4 py-3 rounded-xl border border-white/10">
                  <ShieldCheck className="w-5 h-5 text-red-500" />
                  <p className="text-[9px] font-black uppercase tracking-wider text-zinc-400">Premium Quality</p>
                </div>
                <div className="flex flex-col items-center gap-2 bg-white/5 px-4 py-3 rounded-xl border border-white/10">
                  <MapPin className="w-5 h-5 text-red-500" />
                  <p className="text-[9px] font-black uppercase tracking-wider text-zinc-400">All Nigeria</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SHOP BY OCCASION - Improved visual hierarchy */}
      <section className="py-20 bg-zinc-50">
        <div className="max-w-[1400px] mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic text-zinc-900 mb-4">
              Perfect For Every Occasion
            </h2>
            <p className="text-sm font-bold uppercase tracking-wide text-zinc-600">
              Find the ideal gift for your special moment
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {occasions.map((occasion) => (
              <a 
                key={occasion.name} 
                href="/shop?category=occasion"
                className="group relative bg-white rounded-2xl overflow-hidden hover:shadow-2xl transition-all hover:-translate-y-2 border border-zinc-200"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${occasion.color} opacity-5 group-hover:opacity-10 transition-opacity`} />
                
                <div className="relative p-8">
                  <div className={`w-16 h-16 mb-6 rounded-2xl bg-gradient-to-br ${occasion.color} flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg`}>
                    <span className="text-white">{occasion.icon}</span>
                  </div>
                  
                  <p className="text-base font-black uppercase tracking-wide text-zinc-900 mb-3">{occasion.name}</p>
                  
                  <p className="text-xs text-zinc-600 font-bold uppercase tracking-wide mb-4 leading-relaxed min-h-[48px]">
                    {occasion.tagline}
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase text-red-600">{occasion.count}</span>
                    <ChevronRight className="w-5 h-5 text-zinc-400 group-hover:text-red-600 group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
     {/* GIFT FINDER SECTION - NEW */}
    <section className="py-20 bg-gradient-to-br from-zinc-950 via-zinc-900 to-black relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03]" 
          style={{ 
            backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', 
            backgroundSize: '50px 50px' 
          }} 
      />
      
      {/* Subtle red glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-600/5 via-transparent to-red-600/5" />
      
      <div className="max-w-[1400px] mx-auto px-4 relative z-10 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="w-20 h-20 bg-gradient-to-br from-red-600 to-red-700 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-red-600/20">
            <Gift className="w-10 h-10 text-white" />
          </div>
          
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic text-white mb-6 leading-[0.95]" style={{ fontFamily: 'Syne, sans-serif' }}>
            Not Sure What To Gift?
          </h2>
          
          <p className="text-lg text-zinc-300 font-bold uppercase tracking-wide mb-10 max-w-2xl mx-auto" style={{ fontFamily: 'Inter, sans-serif' }}>
            Let our personal gift concierge help you find the perfect personalized gift in under 2 minutes
          </p>

          <a 
            href="/gift-finder" 
            className="inline-flex items-center gap-4 px-12 py-5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-full font-black uppercase text-xs tracking-[0.3em] hover:shadow-2xl hover:shadow-red-600/50 transition-all group"
            style={{ fontFamily: 'Archivo Black, sans-serif' }}
          >
            <Gift className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            <span>Start Gift Finder</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </a>
          
          <p className="text-xs text-zinc-400 font-bold uppercase tracking-wider mt-6" style={{ fontFamily: 'Inter, sans-serif' }}>
            ✨ Takes Less Than 2 Minutes • 100% Free
          </p>
        </div>
      </div>
    </section>

      {/* PRODUCTS SHOWCASE - Improved categorization */}
      <section className="py-20 bg-white">
        <div className="max-w-[1400px] mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic text-zinc-900 mb-4">
              Our Premium Collection
            </h2>
            <p className="text-sm font-bold uppercase tracking-wide text-zinc-600">
              High-quality personalized gifts for every style
            </p>
          </div>

          {/* Featured/Trending Products */}
          {products.filter(p => p.is_featured || p.is_trending).slice(0, 8).length > 0 && (
            <div className="mb-20">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-black uppercase italic text-zinc-900 flex items-center gap-3">
                  <TrendingUp className="w-6 h-6 text-red-600" />
                  Most Popular
                </h3>
                <a href="/shop" className="text-xs font-black uppercase tracking-wider text-red-600 hover:text-red-700 flex items-center gap-2">
                  View All
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.filter(p => p.is_featured || p.is_trending).slice(0, 8).map((product) => (
                  <EnhancedProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          )}

          {/* Categories */}
          {[
            { title: "For The Home", icon: Home, filter: (p: any) => p.category?.toLowerCase().includes('home') },
            { title: "Daily Essentials", icon: Coffee, filter: (p: any) => p.category?.toLowerCase().includes('daily') || p.category?.toLowerCase().includes('mug') || p.category?.toLowerCase().includes('bottle') },
            { title: "Wearables", icon: Shirt, filter: (p: any) => p.category?.toLowerCase().includes('wear') || p.category?.toLowerCase().includes('shirt') || p.category?.toLowerCase().includes('apparel') }
          ].map((category) => {
            const categoryProducts = products.filter(category.filter).slice(0, 4);
            if (categoryProducts.length === 0) return null;
            
            return (
              <div key={category.title} className="mb-20 last:mb-0">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-2xl font-black uppercase italic text-zinc-900 flex items-center gap-3">
                    <category.icon className="w-6 h-6 text-red-600" />
                    {category.title}
                  </h3>
                  <a href="/shop" className="text-xs font-black uppercase tracking-wider text-red-600 hover:text-red-700 flex items-center gap-2">
                    View All
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {categoryProducts.map((product) => (
                    <EnhancedProductCard key={product.id} product={product} />
                  ))}
                </div>
              </div>
            );
          })}

          {/* CTA */}
          <div className="text-center mt-16">
            <a 
              href="/shop" 
              className="inline-flex items-center gap-3 px-12 py-5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-full text-xs font-black uppercase tracking-widest hover:shadow-2xl hover:shadow-red-600/30 transition-all group"
            >
              Explore All Products
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>
      </section>

      {/* DIGITAL GIFTS - Better positioning and clarity */}
      <section className="py-20 bg-gradient-to-br from-zinc-900 to-black relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" 
             style={{ 
               backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', 
               backgroundSize: '50px 50px' 
             }} 
        />
        
        <div className="max-w-[1400px] mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Image First on Mobile */}
            <div className="order-2 lg:order-1">
              <img
                src="/dg-img.jpg" 
                alt="Digital gift reveal experience"
                className="w-full h-auto rounded-3xl shadow-2xl"
              />
            </div>

            {/* Text */}
            <div className="order-1 lg:order-2 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-600/10 rounded-full mb-6">
                <Sparkles className="w-4 h-4 text-red-500" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-red-500">Coming Soon</span>
              </div>
              
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-[0.95] mb-6 italic uppercase text-white">
                The Future of Gifting Is Digital
              </h2>
              
              <p className="text-lg text-zinc-300 mb-4 font-bold uppercase tracking-wide">
                Send messages, videos, and memories
              </p>
              
              <p className="text-base text-zinc-400 mb-8 font-bold leading-relaxed max-w-xl mx-auto lg:mx-0">
                Create personalized digital experiences that recipients unlock through a simple scan or link. Perfect for adding an emotional touch to any gift.
              </p>

              <a 
                href="/digital-gifts" 
                className="inline-flex items-center gap-4 px-10 py-5 bg-white/10 border border-white/20 text-white rounded-full font-black uppercase text-xs tracking-[0.3em] hover:bg-white/20 transition-all group"
              >
                <span>Learn More</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS - Better presentation */}
      <section className="py-20 bg-white">
        <div className="max-w-[1400px] mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-600/10 rounded-full mb-6">
              <Heart className="w-4 h-4 text-red-600 fill-red-600" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-red-600">Customer Stories</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic text-zinc-900 mb-4">
              Loved By Nigerians
            </h2>
            <p className="text-sm font-bold uppercase tracking-wide text-zinc-600">
              Real feedback from real customers
            </p>
          </div>

          {/* Testimonial Carousel */}
          <div className="max-w-4xl mx-auto mb-16">
            <div className="relative">
              <div className="bg-zinc-50 rounded-3xl p-12 md:p-16 border border-zinc-200">
                <div className="flex gap-1 mb-6 justify-center">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-6 h-6 text-red-600 fill-red-600" />
                  ))}
                </div>
                
                <p className="text-xl md:text-2xl text-zinc-700 mb-10 leading-relaxed text-center font-medium">
                  "{testimonials[currentTestimonial].text}"
                </p>
                
                <div className="flex items-center gap-4 justify-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-red-600 to-red-700 rounded-full flex items-center justify-center">
                    <span className="text-white font-black text-2xl">{testimonials[currentTestimonial].name[0]}</span>
                  </div>
                  <div className="text-left">
                    <p className="text-base font-black uppercase text-zinc-900">{testimonials[currentTestimonial].name}</p>
                    <p className="text-xs font-bold uppercase tracking-wide text-zinc-500">{testimonials[currentTestimonial].location}</p>
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
                      idx === currentTestimonial ? 'w-8 bg-red-600' : 'w-2 bg-zinc-300'
                    }`}
                    aria-label={`Go to testimonial ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Instagram CTA */}
          <div className="text-center bg-gradient-to-br from-zinc-50 to-zinc-100 rounded-3xl p-16 border border-zinc-200">
            <Instagram className="w-16 h-16 text-red-600 mx-auto mb-6" />
            <h3 className="text-3xl font-black uppercase italic text-zinc-900 mb-4">Join Our Community</h3>
            <p className="text-sm text-zinc-600 font-bold uppercase tracking-wide mb-8 max-w-md mx-auto">
              Share your Lensra gifts with #LensraGifts and get featured
            </p>
            <a 
              href="https://instagram.com/lensragifts" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-full font-black uppercase text-xs tracking-widest hover:shadow-2xl hover:shadow-red-600/30 transition-all group"
            >
              Follow @LensraGifts
              <Instagram className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </a>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE LENSRA - Clearer value props */}
      <section className="py-20 bg-zinc-50">
        <div className="max-w-[1400px] mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic text-zinc-900 mb-4">
              The Lensra Difference
            </h2>
            <p className="text-sm font-bold uppercase tracking-wide text-zinc-600">
              Why thousands choose us for their personalized gifts
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white rounded-2xl p-8 text-center hover:shadow-xl transition-all border border-zinc-200">
              <div className="w-20 h-20 bg-gradient-to-br from-red-600 to-red-700 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <ShieldCheck className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-base font-black uppercase tracking-wide text-zinc-900 mb-3">Premium Quality</h3>
              <p className="text-sm font-bold uppercase tracking-wide text-zinc-600 leading-relaxed">Italian DTG inks, premium materials, ISO certified production</p>
            </div>

            <div className="bg-white rounded-2xl p-8 text-center hover:shadow-xl transition-all border border-zinc-200">
              <div className="w-20 h-20 bg-gradient-to-br from-red-600 to-red-700 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Zap className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-base font-black uppercase tracking-wide text-zinc-900 mb-3">Lightning Fast</h3>
              <p className="text-sm font-bold uppercase tracking-wide text-zinc-600 leading-relaxed">72-hour delivery guarantee anywhere in Nigeria</p>
            </div>

            <div className="bg-white rounded-2xl p-8 text-center hover:shadow-xl transition-all border border-zinc-200">
              <div className="w-20 h-20 bg-gradient-to-br from-red-600 to-red-700 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Award className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-base font-black uppercase tracking-wide text-zinc-900 mb-3">Trusted Brand</h3>
              <p className="text-sm font-bold uppercase tracking-wide text-zinc-600 leading-relaxed">500+ satisfied customers, 99% satisfaction rate</p>
            </div>

            <div className="bg-white rounded-2xl p-8 text-center hover:shadow-xl transition-all border border-zinc-200">
              <div className="w-20 h-20 bg-gradient-to-br from-red-600 to-red-700 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <MapPin className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-base font-black uppercase tracking-wide text-zinc-900 mb-3">Local Support</h3>
              <p className="text-sm font-bold uppercase tracking-wide text-zinc-600 leading-relaxed">Lagos-based team ready to help you create magic</p>
            </div>
          </div>
        </div>
      </section>

      {/* RESELLER PROGRAM */}
      <section className="py-20 bg-white">
        <div className="max-w-[1400px] mx-auto px-4">
          <div className="bg-gradient-to-br from-zinc-900 to-black rounded-3xl p-16 md:p-20 text-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-[0.03]" 
                 style={{ 
                   backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', 
                   backgroundSize: '50px 50px' 
                 }} 
            />
            
            <div className="relative z-10 max-w-3xl mx-auto">
              <Users className="w-20 h-20 text-red-600 mx-auto mb-8" />
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic text-white mb-6">
                Become A Lensra Partner
              </h2>
              <p className="text-base text-zinc-300 font-bold uppercase tracking-wide mb-10 max-w-xl mx-auto">
                Join our network of resellers across Nigeria and earn while helping people create meaningful gifts
              </p>
              <a 
                href="/reseller-program" 
                className="inline-flex items-center gap-4 px-12 py-5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-full font-black uppercase text-xs tracking-[0.3em] hover:shadow-2xl hover:shadow-red-600/50 transition-all group"
              >
                <span>Start Earning Today</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function EnhancedProductCard({ product }: { product: any }) {
  const imageUrl = getImageUrl(product.image_url);
  
  return (
    <a href={`/shop/${product.slug}`} className="group block">
      <div className="relative aspect-square bg-white rounded-2xl overflow-hidden mb-4 border border-zinc-200 group-hover:border-red-300 group-hover:shadow-2xl transition-all">
        {imageUrl ? (
          <img
            src={imageUrl} 
            alt={`${product.name} - Personalized gift`}
            loading="lazy"
            className="object-cover group-hover:scale-105 transition-transform duration-500" 
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-zinc-50">
            <ShoppingBag className="w-12 h-12 text-zinc-200" />
          </div>
        )}
        
        {(product.is_trending || product.is_featured) && (
          <div className="absolute top-3 right-3 bg-red-600 text-white px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-wider shadow-lg">
            Popular
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform">
          <button className="w-full py-3 bg-white text-zinc-900 rounded-xl text-xs font-black uppercase tracking-wider hover:bg-red-600 hover:text-white transition-colors">
            Customize Now
          </button>
        </div>
      </div>
      
      <div>
        <h3 className="font-black text-sm tracking-tight uppercase italic text-zinc-900 leading-tight mb-2 line-clamp-2 group-hover:text-red-600 transition-colors">
          {product.name}
        </h3>
        <p className="font-black text-lg text-red-600">
          ₦{parseFloat(product.base_price || "0").toLocaleString()}
        </p>
      </div>
    </a>
  );
}