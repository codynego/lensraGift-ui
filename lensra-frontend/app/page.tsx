"use client";

import { useState, useEffect } from 'react';
import { 
  ShoppingBag, Zap, TrendingUp, Award, ArrowRight, 
  ShieldCheck, Loader2, Edit3, Palette, ChevronRight,
  Shirt, Coffee, Home, Briefcase, Gift, Sparkles, Clock, MapPin, Eye, Search, User, Heart, Menu, X
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
      
      {/* HERO SECTION - Full Width Split */}
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
                  <Zap className="w-4 h-4 text-red-500 fill-red-500 animate-pulse" />
                  <span className="font-black uppercase tracking-[0.3em] text-[10px] text-red-500">
                    Lagos Print Studio
                  </span>
                </div>
                
                <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.9] mb-6 italic uppercase text-white">
                  Design<span className="text-red-600">.</span><br/>
                  Print<span className="text-red-600">.</span><br/>
                  Deliver<span className="text-red-600">.</span>
                </h1>
                
                <p className="text-base text-zinc-300 mb-8 font-bold uppercase tracking-wider leading-relaxed">
                  Premium custom printing in 24 hours. Turn your ideas into stunning apparel, gifts, and branded merchandise.
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                  <div className="flex items-center gap-2 bg-white/5 px-4 py-3 rounded-lg border border-white/10">
                    <Clock className="w-5 h-5 text-red-500 flex-shrink-0" />
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-wider text-zinc-400">Turnaround</p>
                      <p className="text-xs font-black uppercase text-white">24 Hours</p>
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
                      <p className="text-[10px] font-black uppercase tracking-wider text-zinc-400">Location</p>
                      <p className="text-xs font-black uppercase text-white">Lagos</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <a 
                    href="/editor" 
                    className="inline-flex items-center justify-center gap-4 px-10 py-5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-full font-black uppercase text-xs tracking-[0.3em] hover:shadow-2xl hover:shadow-red-600/50 transition-all"
                  >
                    <span>Start Creating</span>
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
                src="/heroimg-2.png" 
                alt="Hero Banner" 
                className="w-full h-full object-cover"
              />
              {/* Overlay gradient for better text readability if needed */}
              <div className="absolute inset-0 bg-gradient-to-l from-transparent to-black/20" />
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORY SHOWCASE - Visual Cards */}
      <section className="py-16 bg-white">
        <div className="max-w-[1600px] mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-black tracking-tighter uppercase italic text-zinc-900 mb-2">
              Shop By Category
            </h2>
            <p className="text-xs font-black uppercase tracking-widest text-zinc-600">
              Everything you need to express yourself
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.map((cat) => (
              <a 
                key={cat.name} 
                href={`/products?category=${cat.name}`} 
                className="group relative aspect-[4/5] bg-gradient-to-br from-zinc-50 to-zinc-100 rounded-2xl overflow-hidden hover:shadow-2xl transition-all hover:-translate-y-2"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${cat.color} opacity-10 group-hover:opacity-20 transition-opacity`} />
                <div className="relative h-full flex flex-col items-center justify-center p-6">
                  <div className={`w-20 h-20 mb-6 rounded-full bg-gradient-to-br ${cat.color} flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg`}>
                    <span className="text-white">{cat.icon}</span>
                  </div>
                  <p className="text-sm font-black uppercase tracking-widest text-zinc-900 mb-2">{cat.name}</p>
                  <div className="flex items-center gap-1 text-xs font-black uppercase tracking-wider text-red-600 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>Explore</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* TRENDING PRODUCTS - Featured Layout */}
      <section className="py-16 bg-zinc-50">
        <div className="max-w-[1600px] mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-600/10 rounded-full mb-3">
                <TrendingUp className="w-4 h-4 text-red-600" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-red-600">Hot Right Now</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-black tracking-tighter uppercase italic text-zinc-900">
                Trending Products
              </h2>
            </div>
            <a href="/products?filter=trending" className="inline-flex items-center gap-2 px-6 py-3 bg-zinc-900 text-white rounded-full text-xs font-black uppercase tracking-widest hover:bg-red-600 transition-all">
              View All Trending
              <ChevronRight className="w-4 h-4" />
            </a>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {(products.filter(p => p.is_trending).length > 0 
              ? products.filter(p => p.is_trending) 
              : products
            ).slice(0, 10).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED DESIGNS - Inspiration Gallery */}
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

      {/* NEW ARRIVALS - Compact Grid */}
      <section className="py-16 bg-zinc-50">
        <div className="max-w-[1600px] mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-600/10 rounded-full mb-3">
                <Sparkles className="w-4 h-4 text-red-600" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-red-600">Just Added</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-black tracking-tighter uppercase italic text-zinc-900">
                New Arrivals
              </h2>
            </div>
            <a href="/products?filter=new" className="inline-flex items-center gap-2 px-6 py-3 bg-zinc-900 text-white rounded-full text-xs font-black uppercase tracking-widest hover:bg-red-600 transition-all">
              Shop New Items
              <ChevronRight className="w-4 h-4" />
            </a>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {(products.filter(p => p.is_featured).length > 0 
              ? products.filter(p => p.is_featured) 
              : products
            ).slice(0, 6).map((product) => (
              <ProductCard key={product.id} product={product} compact />
            ))}
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
              <p className="text-xs font-bold uppercase tracking-wide text-zinc-400">24-Hour Turnaround Time</p>
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

function ProductCard({ product, compact = false }: { product: Product, compact?: boolean }) {
  const imageUrl = getImageUrl(product.image_url);
  
  return (
    <a href={`/products/${product.slug}`} className="group block">
      <div className={`relative ${compact ? 'aspect-square' : 'aspect-[3/4]'} bg-white rounded-2xl overflow-hidden mb-3 border border-zinc-200 group-hover:border-red-300 group-hover:shadow-2xl transition-all`}>
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
            Trending
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform">
          <button className="w-full py-2.5 bg-white text-zinc-900 rounded-lg text-xs font-black uppercase tracking-wider hover:bg-red-600 hover:text-white transition-colors">
            Quick View
          </button>
        </div>
      </div>
      
      <div>
        <h3 className="font-black text-sm tracking-tight uppercase italic text-zinc-900 leading-tight mb-1.5 truncate group-hover:text-red-600 transition-colors">
          {product.name}
        </h3>
        <p className="font-black text-base text-red-600">
          ₦{parseFloat(product.base_price || "0").toLocaleString()}
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