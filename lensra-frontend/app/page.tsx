"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ShoppingBag, Zap, TrendingUp, Award, ArrowRight, 
  ShieldCheck, Loader2, Edit3, Palette, ChevronRight,
  Shirt, Coffee, Home, Briefcase, Gift, Sparkles, Clock, MapPin, Eye
} from 'lucide-react';

const BaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.lensra.com/";

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

// Helper function to get full image URL
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

  const categories = [
    { name: "Shirts", icon: <Shirt className="w-5 h-5" />, color: "from-blue-500 to-blue-600" },
    { name: "Mugs", icon: <Coffee className="w-5 h-5" />, color: "from-orange-500 to-orange-600" },
    { name: "Home", icon: <Home className="w-5 h-5" />, color: "from-green-500 to-green-600" },
    { name: "Office", icon: <Briefcase className="w-5 h-5" />, color: "from-purple-500 to-purple-600" },
    { name: "Gifts", icon: <Gift className="w-5 h-5" />, color: "from-pink-500 to-pink-600" },
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
        console.log("Fetched Products:", prodData);
        console.log("Fetched Designs:", designData);

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
      
      {/* 1. HERO SECTION - Enhanced */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-950 via-zinc-900 to-black" />
        <div className="absolute inset-0 opacity-[0.03]" 
             style={{ 
               backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', 
               backgroundSize: '50px 50px' 
             }} 
        />
        
        {/* Gradient Overlays */}
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-red-600/20 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-red-600/10 rounded-full blur-[150px] translate-x-1/2 translate-y-1/2" />
        
        <div className="max-w-7xl mx-auto w-full px-6 py-20 relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-red-600/10 border border-red-600/20 rounded-full mb-8 backdrop-blur-sm">
            <Zap className="w-4 h-4 text-red-500 fill-red-500 animate-pulse" />
            <span className="font-black uppercase tracking-[0.3em] text-[10px] text-red-500">
              Lagos Print Studio
            </span>
          </div>
          
          {/* Main Headline */}
          <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-[10rem] font-black tracking-tighter leading-[0.85] mb-12 italic uppercase text-white">
            Design<span className="text-red-600">.</span><br />
            Print<span className="text-red-600">.</span><br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-400 to-zinc-600">
              Deliver
            </span>
            <span className="text-red-600">.</span>
          </h1>
          
          {/* Subheadline & CTA */}
          <div className="flex flex-col lg:flex-row lg:items-center gap-10 max-w-4xl">
            <div className="flex-1">
              <p className="text-base md:text-lg text-zinc-300 max-w-xl font-bold uppercase tracking-wider leading-relaxed border-l-4 border-red-600 pl-6">
                Premium custom printing in 24 hours. Turn your ideas into stunning apparel, gifts, and branded merchandise.
              </p>
              
              <div className="flex flex-wrap gap-6 mt-8 text-zinc-400">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-red-500" />
                  <span className="text-xs font-black uppercase tracking-widest">24hr Turnaround</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-red-500" />
                  <span className="text-xs font-black uppercase tracking-widest">Premium Quality</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-red-500" />
                  <span className="text-xs font-black uppercase tracking-widest">Lagos Delivery</span>
                </div>
              </div>
            </div>
            
            <Link 
              href="/products" 
              className="group relative inline-flex items-center justify-center gap-4 px-10 py-6 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-full font-black uppercase text-xs tracking-[0.3em] hover:shadow-2xl hover:shadow-red-600/50 transition-all overflow-hidden"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              <span className="relative z-10">Start Creating</span>
              <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Bottom Accent */}
        <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-red-600 via-red-500 to-red-600" />
      </section>

      {/* 2. CATEGORY BAR - Modern Pills */}
      <section className="py-8 border-b border-zinc-100 bg-white/95 backdrop-blur-xl sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-6 overflow-x-auto no-scrollbar pb-2">
            <div className="flex items-center gap-3 pr-8 flex-shrink-0">
               <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-lg shadow-red-600/30">
                 <Palette className="w-5 h-5 text-white" />
               </div>
               <span className="text-xs font-black uppercase tracking-widest text-zinc-900">Shop By</span>
            </div>
            
            {categories.map((cat) => (
              <Link 
                key={cat.name} 
                href={`/products?category=${cat.name}`} 
                className="group relative flex items-center gap-3 flex-shrink-0 px-6 py-3.5 rounded-2xl bg-zinc-50 hover:bg-zinc-900 transition-all overflow-hidden"
              >
                <div className={`absolute inset-0 bg-gradient-to-r ${cat.color} opacity-0 group-hover:opacity-100 transition-opacity`} />
                <span className="relative z-10 text-zinc-600 group-hover:text-white transition-colors">{cat.icon}</span>
                <span className="relative z-10 text-xs font-black uppercase tracking-widest text-zinc-900 group-hover:text-white transition-colors">
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 3. FRESH DROPS - Improved Grid */}
      <section className="py-20 md:py-32 bg-gradient-to-b from-white to-zinc-50">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeader 
            title="New Arrivals" 
            subtitle="Just Dropped" 
            description="The latest additions to our collection. Fresh styles ready for your custom touch."
          />
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {(products.filter(p => p.is_featured).length > 0 
              ? products.filter(p => p.is_featured) 
              : products
            ).slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="text-center mt-16">
            <Link 
              href="/products" 
              className="inline-flex items-center gap-3 text-sm font-black uppercase tracking-widest text-zinc-900 hover:text-red-600 transition-colors group"
            >
              Explore All Products 
              <div className="w-10 h-10 rounded-full bg-zinc-100 group-hover:bg-red-600 flex items-center justify-center transition-all">
                <ChevronRight className="w-5 h-5 text-zinc-600 group-hover:text-white transition-colors" />
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* 4. TRENDING PRODUCTS - Split Layout */}
      <section className="py-20 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          {/* Section Badge */}
          <div className="flex justify-center mb-12">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-full shadow-xl shadow-red-600/30">
              <TrendingUp className="w-5 h-5" />
              <span className="text-xs font-black uppercase tracking-[0.3em]">Most Popular</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left Content */}
            <div className="lg:col-span-5 space-y-8">
              <div>
                <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic leading-none mb-6">
                  What's<br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-700">
                    Trending
                  </span>
                </h2>
                <div className="h-1.5 w-24 bg-gradient-to-r from-red-600 to-red-700 rounded-full" />
              </div>

              <p className="text-zinc-600 font-bold uppercase text-sm tracking-wide leading-relaxed max-w-md">
                These are the hottest picks right now. Bestsellers chosen by customers who demand quality and style.
              </p>

              <div className="flex flex-wrap gap-4">
                <div className="px-5 py-3 bg-zinc-50 rounded-xl border border-zinc-100">
                  <p className="text-xs font-black uppercase tracking-widest text-zinc-400">This Week</p>
                  <p className="text-2xl font-black text-zinc-900 mt-1">
                    {products.filter(p => p.is_trending).length || products.length}
                  </p>
                </div>
                <div className="px-5 py-3 bg-zinc-50 rounded-xl border border-zinc-100">
                  <p className="text-xs font-black uppercase tracking-widest text-zinc-400">Categories</p>
                  <p className="text-2xl font-black text-zinc-900 mt-1">{categories.length}</p>
                </div>
              </div>

              <Link 
                href="/products" 
                className="inline-flex items-center gap-4 px-8 py-4 bg-zinc-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-red-600 transition-all shadow-lg hover:shadow-xl group"
              >
                View All Trending 
                <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </Link>
            </div>

            {/* Right Grid */}
            <div className="lg:col-span-7">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 lg:gap-6">
                {(products.filter(p => p.is_trending).length > 0 
                  ? products.filter(p => p.is_trending) 
                  : products
                ).slice(0, 6).map((product, idx) => (
                  <TrendingCard key={product.id} product={product} index={idx} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. DESIGN SHOWCASE - Dark Theme Enhanced - 2 COLUMNS */}
      <section className="py-20 md:py-32 bg-zinc-950 text-white relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 opacity-[0.02]" 
             style={{ 
               backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', 
               backgroundSize: '40px 40px' 
             }} 
        />
        <div className="absolute top-20 right-20 w-[400px] h-[400px] bg-red-600/10 rounded-full blur-[100px]" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-16 gap-8">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-600/10 border border-red-600/20 rounded-full">
                <Sparkles className="w-4 h-4 text-red-500" />
                <span className="text-red-500 font-black text-[10px] uppercase tracking-[0.4em]">
                  Artist Gallery
                </span>
              </div>
              
              <h2 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter uppercase italic leading-none">
                Ready-Made<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-700">
                  Designs
                </span>
              </h2>
            </div>
            
            <p className="text-zinc-400 max-w-md lg:text-right text-sm font-bold uppercase tracking-wide leading-loose">
              Skip the design process. Choose from our curated collection of exclusive artwork and apply it to any product.
            </p>
          </div>

          {/* Changed to 2 columns for bigger cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {featuredDesigns.slice(0, 8).map((design, idx) => (
              <DesignCard key={design.id} design={design} index={idx} />
            ))}
          </div>

          {/* See More Ideas Button */}
          <div className="text-center mt-16">
            <Link 
              href="/design-ideas" 
              className="inline-flex items-center gap-4 px-10 py-5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-2xl text-sm font-black uppercase tracking-widest hover:shadow-2xl hover:shadow-red-600/50 transition-all group"
            >
              See More Ideas
              <ChevronRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* 6. TRUST BADGES - Modern Cards */}
      <section className="py-20 md:py-32 bg-gradient-to-b from-white to-zinc-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic mb-4">
              Why Choose <span className="text-red-600">Us</span>
            </h2>
            <p className="text-zinc-500 text-sm font-bold uppercase tracking-widest">
              Quality, Speed, and Reliability
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Badge 
              icon={<ShieldCheck className="w-7 h-7" />} 
              title="Premium Quality" 
              desc="Italian DTG Inks" 
              color="from-blue-500 to-blue-600"
            />
            <Badge 
              icon={<Zap className="w-7 h-7" />} 
              title="Fast Delivery" 
              desc="24hr Turnaround" 
              color="from-yellow-500 to-orange-600"
            />
            <Badge 
              icon={<Award className="w-7 h-7" />} 
              title="Certified" 
              desc="ISO Compliant" 
              color="from-purple-500 to-purple-600"
            />
            <Badge 
              icon={<TrendingUp className="w-7 h-7" />} 
              title="Local Team" 
              desc="Lagos Based" 
              color="from-green-500 to-green-600"
            />
          </div>
        </div>
      </section>
    </div>
  );
}

function SectionHeader({ title, subtitle, description }: { title: string, subtitle: string, description?: string }) {
  return (
    <div className="mb-16 text-center lg:text-left max-w-3xl mx-auto lg:mx-0">
      <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 rounded-full mb-4">
        <span className="text-red-600 font-black text-[10px] uppercase tracking-[0.5em]">{subtitle}</span>
      </div>
      <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic leading-none mb-4">
        {title}
      </h2>
      {description && (
        <p className="text-zinc-500 font-bold uppercase text-xs tracking-widest leading-relaxed mt-4">
          {description}
        </p>
      )}
    </div>
  );
}

function ProductCard({ product }: { product: Product }) {
  const imageUrl = getImageUrl(product.image_url);
  
  return (
    <Link href={`/products/${product.slug}`} className="group">
      <div className="relative aspect-[4/5] bg-gradient-to-br from-zinc-100 to-zinc-50 rounded-3xl overflow-hidden mb-5 transition-all duration-500 group-hover:shadow-2xl group-hover:-translate-y-2 border border-zinc-200/50 group-hover:border-red-200">
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={product.name} 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-zinc-300">
            <ShoppingBag className="w-16 h-16" />
          </div>
        )}
        
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity" />
        
        {/* Quick View Button */}
        <div className="absolute bottom-4 right-4 translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all">
          <div className="bg-white text-black p-3 rounded-xl shadow-2xl hover:bg-red-600 hover:text-white transition-colors">
             <ArrowRight className="w-5 h-5" />
          </div>
        </div>
      </div>
      
      <div className="px-2 space-y-2">
        <p className="text-[9px] font-black text-red-600 uppercase tracking-[0.3em]">
          {product.category || 'Featured'}
        </p>
        <h3 className="font-black text-lg tracking-tight uppercase italic text-zinc-900 leading-tight truncate">
          {product.name}
        </h3>
        <p className="font-black text-sm text-zinc-400">
          ₦{parseFloat(product.base_price || "0").toLocaleString()}
        </p>
      </div>
    </Link>
  );
}

function TrendingCard({ product, index }: { product: Product, index: number }) {
  const imageUrl = getImageUrl(product.image_url);
  
  return (
    <Link 
      href={`/products/${product.slug}`} 
      className="group relative"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Trending Badge */}
      <div className="absolute -top-2 -right-2 z-10 w-8 h-8 bg-gradient-to-br from-red-600 to-red-700 rounded-full flex items-center justify-center shadow-lg shadow-red-600/50">
        <TrendingUp className="w-4 h-4 text-white" />
      </div>

      <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-white border border-zinc-100 group-hover:border-red-200 transition-all shadow-md group-hover:shadow-xl">
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={product.name} 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-zinc-200">
            <ShoppingBag className="w-10 h-10" />
          </div>
        )}
      </div>
      
      <div className="mt-3 px-1">
        <h4 className="text-xs font-black uppercase italic tracking-tight truncate text-zinc-900">
          {product.name}
        </h4>
        <p className="text-xs font-black text-red-600 mt-1">
          ₦{parseFloat(product.base_price || "0").toLocaleString()}
        </p>
      </div>
    </Link>
  );
}

function DesignCard({ design, index }: { design: Design, index: number }) {
  const router = useRouter();
  const imageUrl = getImageUrl(design.preview_image);
  const [showPreview, setShowPreview] = useState(false);
  
  return (
    <>
      <div 
        className="group relative bg-zinc-900/50 backdrop-blur-sm rounded-3xl p-8 border border-zinc-800 hover:border-red-600/50 transition-all duration-500 hover:shadow-2xl hover:shadow-red-600/10"
        style={{ animationDelay: `${index * 50}ms` }}
      >
        <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-zinc-950 relative">
          {imageUrl ? (
            <img 
              src={imageUrl} 
              alt={design.name} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-zinc-800">
              <Edit3 className="w-16 h-16" />
            </div>
          )}
          
          {/* Top Right Action Buttons */}
          <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowPreview(true);
              }}
              className="w-10 h-10 bg-white/90 backdrop-blur-sm hover:bg-white rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all hover:scale-110"
              title="Preview Design"
            >
              <Eye className="w-5 h-5 text-zinc-900" />
            </button>
          </div>
        </div>
        
        {/* Use Design Button - Below Image */}
        <div className="mt-5">
          <button 
            onClick={() => router.push(`/editor?template=${design.id}`)}
            className="w-full px-6 py-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-xl font-black uppercase text-sm tracking-widest shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all flex items-center justify-center gap-3"
          >
            <Edit3 className="w-5 h-5" />
            Use Design
          </button>
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div 
          className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowPreview(false)}
        >
          <div className="relative max-w-4xl w-full max-h-[90vh] bg-zinc-900 rounded-3xl overflow-hidden shadow-2xl">
            {/* Close Button */}
            <button
              onClick={() => setShowPreview(false)}
              className="absolute top-4 right-4 w-10 h-10 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center transition-all z-10"
            >
              <span className="text-white text-2xl">×</span>
            </button>
            
            {/* Image */}
            <div className="w-full h-full flex items-center justify-center p-8">
              {imageUrl ? (
                <img 
                  src={imageUrl} 
                  alt={design.name} 
                  className="max-w-full max-h-full object-contain rounded-2xl"
                  onClick={(e) => e.stopPropagation()}
                />
              ) : (
                <div className="flex items-center justify-center text-zinc-600">
                  <Edit3 className="w-24 h-24" />
                </div>
              )}
            </div>
            
            {/* Bottom Action Bar */}
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(`/editor?template=${design.id}`);
                }}
                className="w-full px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-xl font-black uppercase text-sm tracking-widest shadow-2xl hover:shadow-red-600/50 transform hover:scale-[1.02] transition-all flex items-center justify-center gap-3"
              >
                <Edit3 className="w-5 h-5" />
                Use This Design
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function Badge({ icon, title, desc, color }: { icon: any, title: string, desc: string, color: string }) {
  return (
    <div className="group relative bg-white rounded-3xl p-8 border border-zinc-100 hover:border-zinc-200 transition-all hover:shadow-xl overflow-hidden">
      {/* Gradient Background on Hover */}
      <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-5 transition-opacity`} />
      
      <div className="relative z-10 flex flex-col items-center text-center space-y-4">
        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
          <span className="text-white">{icon}</span>
        </div>
        <div>
          <p className="text-sm font-black uppercase tracking-wide text-zinc-900 mb-1">
            {title}
          </p>
          <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">
            {desc}
          </p>
        </div>
      </div>
    </div>
  );
}