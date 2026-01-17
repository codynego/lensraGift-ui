"use client";

import { useState, useEffect } from 'react';
import { 
  ShoppingBag, Zap, TrendingUp, Award, ArrowRight, 
  ShieldCheck, Loader2, Edit3, Palette, ChevronRight,
  Shirt, Coffee, Home, Briefcase, Gift, Sparkles, Clock, MapPin, Eye, Search, User, Heart, Menu
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
      
      {/* TOP NAVIGATION BAR - Zazzle Style */}
      <header className="bg-white border-b border-zinc-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-[1400px] mx-auto px-4">
          {/* Top Bar */}
          <div className="flex items-center justify-between py-3 border-b border-zinc-100">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center">
                  <Palette className="w-4 h-4 text-white" />
                </div>
                <span className="text-xl font-black uppercase tracking-tight text-zinc-900">Lensra</span>
              </div>
              
              <nav className="hidden lg:flex items-center gap-6">
                <a href="/products" className="text-xs font-black uppercase tracking-widest text-zinc-600 hover:text-red-600 transition-colors">Products</a>
                <a href="/design-ideas" className="text-xs font-black uppercase tracking-widest text-zinc-600 hover:text-red-600 transition-colors">Designs</a>
                <a href="/custom" className="text-xs font-black uppercase tracking-widest text-zinc-600 hover:text-red-600 transition-colors">Custom</a>
              </nav>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-zinc-50 rounded-full">
                <Search className="w-4 h-4 text-zinc-400" />
                <input 
                  type="text" 
                  placeholder="Search products..." 
                  className="bg-transparent border-none outline-none text-xs font-bold text-zinc-600 placeholder:text-zinc-400 w-48"
                />
              </div>
              
              <button className="w-8 h-8 flex items-center justify-center text-zinc-600 hover:text-red-600 transition-colors">
                <Heart className="w-5 h-5" />
              </button>
              <button className="w-8 h-8 flex items-center justify-center text-zinc-600 hover:text-red-600 transition-colors">
                <User className="w-5 h-5" />
              </button>
              <button className="w-8 h-8 flex items-center justify-center text-zinc-600 hover:text-red-600 transition-colors lg:hidden">
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Category Bar */}
          <div className="py-3 flex items-center gap-6 overflow-x-auto no-scrollbar">
            {categories.map((cat) => (
              <a 
                key={cat.name} 
                href={`/products?category=${cat.name}`} 
                className="flex items-center gap-2 flex-shrink-0 text-xs font-black uppercase tracking-widest text-zinc-600 hover:text-red-600 transition-colors whitespace-nowrap"
              >
                {cat.icon}
                {cat.name}
              </a>
            ))}
          </div>
        </div>
      </header>

      {/* HERO BANNER - Zazzle Style Wide Banner */}
      <section className="relative bg-gradient-to-br from-zinc-950 via-zinc-900 to-black">
        <div className="absolute inset-0 opacity-[0.03]" 
             style={{ 
               backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', 
               backgroundSize: '50px 50px' 
             }} 
        />
        
        <div className="max-w-[1400px] mx-auto px-4 py-16 md:py-24 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-red-600/10 border border-red-600/20 rounded-full mb-6">
                <Zap className="w-4 h-4 text-red-500 fill-red-500 animate-pulse" />
                <span className="font-black uppercase tracking-[0.3em] text-[10px] text-red-500">
                  Lagos Print Studio
                </span>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.9] mb-6 italic uppercase text-white">
                Design<span className="text-red-600">.</span> Print<span className="text-red-600">.</span> Deliver<span className="text-red-600">.</span>
              </h1>
              
              <p className="text-base text-zinc-300 mb-8 font-bold uppercase tracking-wider leading-relaxed max-w-lg">
                Premium custom printing in 24 hours. Turn your ideas into stunning apparel, gifts, and branded merchandise.
              </p>
              
              <div className="flex flex-wrap gap-6 mb-8 text-zinc-400">
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

              <a 
                href="/products" 
                className="inline-flex items-center justify-center gap-4 px-10 py-5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-full font-black uppercase text-xs tracking-[0.3em] hover:shadow-2xl hover:shadow-red-600/50 transition-all"
              >
                <span>Start Creating</span>
                <ArrowRight className="w-5 h-5" />
              </a>
            </div>

            <div className="hidden lg:block">
              <div className="grid grid-cols-2 gap-4">
                {products.slice(0, 4).map((product, idx) => {
                  const imageUrl = getImageUrl(product.image_url);
                  return (
                    <div key={idx} className="aspect-square bg-white/5 rounded-2xl overflow-hidden border border-white/10">
                      {imageUrl ? (
                        <img src={imageUrl} alt={product.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ShoppingBag className="w-12 h-12 text-white/20" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* QUICK CATEGORIES - Zazzle Style Cards */}
      <section className="py-12 bg-zinc-50">
        <div className="max-w-[1400px] mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.map((cat) => (
              <a 
                key={cat.name} 
                href={`/products?category=${cat.name}`} 
                className="group bg-white rounded-2xl p-6 text-center hover:shadow-lg transition-all border border-zinc-100"
              >
                <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br ${cat.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <span className="text-white">{cat.icon}</span>
                </div>
                <p className="text-xs font-black uppercase tracking-widest text-zinc-900">{cat.name}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* TRENDING PRODUCTS - Grid Layout */}
      <section className="py-16 bg-white">
        <div className="max-w-[1400px] mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl md:text-5xl font-black tracking-tighter uppercase italic text-zinc-900">
                Trending Now
              </h2>
              <p className="text-xs font-black uppercase tracking-widest text-red-600 mt-2">Most Popular This Week</p>
            </div>
            <a href="/products" className="hidden md:flex items-center gap-2 text-xs font-black uppercase tracking-widest text-zinc-600 hover:text-red-600 transition-colors">
              View All
              <ChevronRight className="w-4 h-4" />
            </a>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {(products.filter(p => p.is_trending).length > 0 
              ? products.filter(p => p.is_trending) 
              : products
            ).slice(0, 10).map((product) => (
              <ZazzleProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED DESIGNS - Masonry Style */}
      <section className="py-16 bg-zinc-50">
        <div className="max-w-[1400px] mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-black tracking-tighter uppercase italic text-zinc-900 mb-2">
              Ready-Made Designs
            </h2>
            <p className="text-xs font-black uppercase tracking-widest text-zinc-600">
              Choose from our curated collection
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {featuredDesigns.slice(0, 12).map((design) => (
              <ZazzleDesignCard key={design.id} design={design} />
            ))}
          </div>

          <div className="text-center mt-12">
            <a 
              href="/design-ideas" 
              className="inline-flex items-center gap-3 px-8 py-4 bg-zinc-900 text-white rounded-full text-xs font-black uppercase tracking-widest hover:bg-red-600 transition-all"
            >
              See More Ideas
              <ChevronRight className="w-5 h-5" />
            </a>
          </div>
        </div>
      </section>

      {/* NEW ARRIVALS */}
      <section className="py-16 bg-white">
        <div className="max-w-[1400px] mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl md:text-5xl font-black tracking-tighter uppercase italic text-zinc-900">
              New Arrivals
            </h2>
            <a href="/products" className="hidden md:flex items-center gap-2 text-xs font-black uppercase tracking-widest text-zinc-600 hover:text-red-600 transition-colors">
              Shop All
              <ChevronRight className="w-4 h-4" />
            </a>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {(products.filter(p => p.is_featured).length > 0 
              ? products.filter(p => p.is_featured) 
              : products
            ).slice(0, 6).map((product) => (
              <ZazzleProductCard key={product.id} product={product} compact />
            ))}
          </div>
        </div>
      </section>

      {/* TRUST BADGES - Horizontal Strip */}
      <section className="py-12 bg-zinc-900">
        <div className="max-w-[1400px] mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <ShieldCheck className="w-10 h-10 text-red-500 mx-auto mb-3" />
              <p className="text-xs font-black uppercase tracking-widest text-white mb-1">Premium Quality</p>
              <p className="text-xs font-bold uppercase tracking-wide text-zinc-400">Italian DTG Inks</p>
            </div>
            <div className="text-center">
              <Zap className="w-10 h-10 text-red-500 mx-auto mb-3" />
              <p className="text-xs font-black uppercase tracking-widest text-white mb-1">Fast Delivery</p>
              <p className="text-xs font-bold uppercase tracking-wide text-zinc-400">24hr Turnaround</p>
            </div>
            <div className="text-center">
              <Award className="w-10 h-10 text-red-500 mx-auto mb-3" />
              <p className="text-xs font-black uppercase tracking-widest text-white mb-1">Certified</p>
              <p className="text-xs font-bold uppercase tracking-wide text-zinc-400">ISO Compliant</p>
            </div>
            <div className="text-center">
              <TrendingUp className="w-10 h-10 text-red-500 mx-auto mb-3" />
              <p className="text-xs font-black uppercase tracking-widest text-white mb-1">Local Team</p>
              <p className="text-xs font-bold uppercase tracking-wide text-zinc-400">Lagos Based</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function ZazzleProductCard({ product, compact = false }: { product: Product, compact?: boolean }) {
  const imageUrl = getImageUrl(product.image_url);
  
  return (
    <a href={`/products/${product.slug}`} className="group block">
      <div className={`relative ${compact ? 'aspect-square' : 'aspect-[3/4]'} bg-white rounded-lg overflow-hidden mb-3 border border-zinc-100 group-hover:border-red-200 group-hover:shadow-lg transition-all`}>
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={product.name} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-zinc-200">
            <ShoppingBag className="w-12 h-12" />
          </div>
        )}
        
        {product.is_trending && (
          <div className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded text-[9px] font-black uppercase tracking-wider">
            Trending
          </div>
        )}
      </div>
      
      <div>
        <h3 className="font-black text-sm tracking-tight uppercase italic text-zinc-900 leading-tight mb-1 truncate group-hover:text-red-600 transition-colors">
          {product.name}
        </h3>
        <p className="font-black text-sm text-red-600">
          ₦{parseFloat(product.base_price || "0").toLocaleString()}
        </p>
      </div>
    </a>
  );
}

function ZazzleDesignCard({ design }: { design: Design }) {
  const imageUrl = getImageUrl(design.preview_image);
  const [showPreview, setShowPreview] = useState(false);
  
  return (
    <>
      <div className="group bg-white rounded-lg overflow-hidden border border-zinc-100 hover:border-red-200 hover:shadow-lg transition-all">
        <div className="relative aspect-square bg-zinc-50">
          {imageUrl ? (
            <img 
              src={imageUrl} 
              alt={design.name} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-zinc-200">
              <Edit3 className="w-12 h-12" />
            </div>
          )}
          
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition-all space-y-2">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setShowPreview(true);
                }}
                className="w-full px-4 py-2 bg-white text-zinc-900 rounded text-xs font-black uppercase tracking-wider hover:bg-zinc-100 transition-colors flex items-center justify-center gap-2"
              >
                <Eye className="w-4 h-4" />
                Preview
              </button>
              <a
                href={`/editor?template=${design.id}`}
                className="block w-full px-4 py-2 bg-red-600 text-white rounded text-xs font-black uppercase tracking-wider hover:bg-red-700 transition-colors text-center"
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
          <div className="relative max-w-4xl w-full bg-white rounded-2xl overflow-hidden">
            <button
              onClick={() => setShowPreview(false)}
              className="absolute top-4 right-4 w-10 h-10 bg-zinc-100 hover:bg-zinc-200 rounded-full flex items-center justify-center transition-all z-10"
            >
              <span className="text-zinc-900 text-2xl">×</span>
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
              <a
                href={`/editor?template=${design.id}`}
                className="block w-full px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-black uppercase text-sm tracking-widest hover:shadow-xl transition-all text-center"
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