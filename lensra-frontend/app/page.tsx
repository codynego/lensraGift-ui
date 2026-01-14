"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ShoppingBag, Zap, TrendingUp, Award, ArrowRight, 
  ShieldCheck, Loader2, Edit3, Palette, ChevronRight,
  Shirt, Coffee, Home, Briefcase, Gift
} from 'lucide-react';

const BaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000/";

interface Product {
  id: number;
  slug: string;
  name: string;
  base_price: string;
  category: string;
  image: string | null;
  is_active: boolean;
  is_trending: boolean;
  is_featured: boolean;
}

interface Design {
  id: number;
  name: string;
  preview_image?: string | null;
}

export default function LensraHomepage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [featuredDesigns, setFeaturedDesigns] = useState<Design[]>([]);
  const [loading, setLoading] = useState(true);

  const categories = [
    { name: "Shirts", icon: <Shirt className="w-5 h-5" /> },
    { name: "Mugs", icon: <Coffee className="w-5 h-5" /> },
    { name: "Home", icon: <Home className="w-5 h-5" /> },
    { name: "Office", icon: <Briefcase className="w-5 h-5" /> },
    { name: "Gifts", icon: <Gift className="w-5 h-5" /> },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [prodRes, designRes] = await Promise.all([
          fetch(`${BaseUrl}api/products/`),
          fetch(`${BaseUrl}api/designs/`)
        ]);
        
        const prodData = await prodRes.json();
        console.log("Products Data:", prodData);
        const designData = await designRes.json();

        // FIX: Extracting results from paginated response
        const extractedProducts = Array.isArray(prodData) ? prodData : (prodData.results || []);
        console.log("Extracted Products:", extractedProducts);
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <Loader2 className="w-12 h-12 animate-spin text-red-600 mb-4" />
      <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400">Opening Studio...</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-white selection:bg-red-600 selection:text-white">
      
      {/* 1. HERO SECTION */}
      <section className="bg-zinc-950 min-h-[85vh] flex items-center relative overflow-hidden px-6 border-b-[12px] border-red-600">
        <div className="absolute inset-0 opacity-10 pointer-events-none" 
             style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        
        <div className="max-w-7xl mx-auto w-full text-white z-10">
          <div className="flex items-center gap-3 text-red-600 mb-6">
            <Zap className="w-5 h-5 fill-current" />
            <span className="font-black uppercase tracking-[0.4em] text-[10px]">Print Studio Lagos</span>
          </div>
          
          <h1 className="text-6xl md:text-[11rem] font-black tracking-tighter leading-[0.8] mb-12 italic uppercase">
            YOUR <br /><span className="text-zinc-700">IDEA</span> LOUD<span className="text-red-600">.</span>
          </h1>
          
          <div className="flex flex-col md:flex-row md:items-center gap-10">
            <p className="text-sm md:text-base text-zinc-400 max-w-sm font-bold uppercase tracking-widest leading-relaxed border-l-2 border-red-600 pl-6">
              Custom printing for the bold. High-end gifts and apparel made ready in 24 hours.
            </p>
            <Link href="/products" className="group flex items-center justify-center gap-4 px-12 py-6 bg-white text-black rounded-full font-black uppercase text-xs tracking-[0.3em] hover:bg-red-600 hover:text-white transition-all shadow-2xl">
              Start Creating <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* 2. CATEGORY BAR */}
      <section className="py-12 border-b border-zinc-100 bg-white sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-8 overflow-x-auto no-scrollbar pb-2">
            <div className="flex items-center gap-2 pr-6 border-r-2 border-zinc-100 flex-shrink-0">
               <Palette className="w-4 h-4 text-red-600" />
               <span className="text-[10px] font-black uppercase tracking-widest">Aisles</span>
            </div>
            {categories.map((cat) => (
              <Link 
                key={cat.name} 
                href={`/products?category=${cat.name}`} 
                className="group flex items-center gap-3 flex-shrink-0 px-5 py-3 rounded-2xl hover:bg-zinc-900 hover:text-white transition-all"
              >
                <span className="text-zinc-400 group-hover:text-red-600 transition-colors">{cat.icon}</span>
                <span className="text-xs font-black uppercase tracking-widest">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 3. FRESH DROPS */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <SectionHeader title="Fresh Drops" subtitle="The Latest Gear" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10">
          {/* Fallback to all products if none are marked as featured */}
          {(products.filter(p => p.is_featured).length > 0 
            ? products.filter(p => p.is_featured) 
            : products
          ).slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 4. TRENDING PRODUCTS */}
      <section className="py-24 bg-zinc-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-4 mb-12">
            <div className="h-px bg-zinc-200 flex-grow" />
            <div className="flex items-center gap-2 px-6 py-2 bg-black text-white rounded-full">
              <TrendingUp className="w-4 h-4 text-red-600" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">Hottest Now</span>
            </div>
            <div className="h-px bg-zinc-200 flex-grow" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-5">
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic leading-none mb-8">
                Trending <br />On The <span className="text-red-600">Streets</span>
              </h2>
              <p className="text-zinc-500 font-bold uppercase text-[11px] tracking-widest mb-10 leading-loose max-w-sm">
                The pieces everyone is talking about. Hand-picked based on this week's most popular custom orders.
              </p>
              <Link href="/products" className="inline-flex items-center gap-4 text-xs font-black uppercase tracking-widest group">
                View All Trending <ChevronRight className="w-5 h-5 group-hover:translate-x-2 transition-transform text-red-600" />
              </Link>
            </div>

            <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-6">
              {(products.filter(p => p.is_trending).length > 0 
                ? products.filter(p => p.is_trending) 
                : products
              ).slice(0, 6).map((product) => (
                <div key={product.id} className="relative group">
                  <Link href={`/products/${product.slug}`}>
                    <div className="aspect-[3/4] rounded-[32px] overflow-hidden bg-white mb-4 border border-zinc-100 group-hover:border-red-600 transition-colors">
                      {product.image ? (
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-zinc-200"><ShoppingBag className="w-8 h-8" /></div>
                      )}
                    </div>
                    <h4 className="text-[11px] font-black uppercase italic tracking-tight truncate">{product.name}</h4>
                    <p className="text-[10px] font-bold text-red-600 mt-1">
                      ₦{parseFloat(product.base_price || "0").toLocaleString()}
                    </p>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5. DESIGN SHOWCASE */}
      <section className="py-24 bg-zinc-950 text-white px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
            <div>
              <span className="text-red-500 font-bold text-[10px] uppercase tracking-[0.4em]">Ready-To-Wear Art</span>
              <h2 className="text-5xl md:text-8xl font-black tracking-tighter uppercase mt-4 italic leading-none">Cool <br />Designs<span className="text-red-600">.</span></h2>
            </div>
            <p className="text-zinc-500 max-w-xs md:text-right text-[10px] font-bold uppercase tracking-widest leading-loose">
              Don't want to design from scratch? Pick a masterpiece from our artist community.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
            {featuredDesigns.slice(0, 8).map((design) => (
              <div key={design.id} className="group bg-zinc-900/50 rounded-[32px] p-4 border border-zinc-800 hover:border-red-600 transition-all duration-500">
                <div className="aspect-square rounded-[24px] overflow-hidden mb-5 bg-black relative">
                  {design.preview_image ? (
                    <img src={design.preview_image} alt="" className="w-full h-full object-cover group-hover:scale-110 transition duration-700 opacity-80 group-hover:opacity-100" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-800"><Edit3 className="w-10 h-10" /></div>
                  )}
                </div>
                <div className="flex items-center justify-between px-1">
                  <h3 className="text-sm font-black uppercase italic tracking-tight truncate mr-2">{design.name}</h3>
                  <Link href={`/designs/${design.id}`} className="w-10 h-10 flex-shrink-0 flex items-center justify-center bg-zinc-800 group-hover:bg-red-600 rounded-xl transition-all">
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. TRUST BADGES */}
      <section className="py-24 px-6 bg-white border-t border-zinc-100">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-12">
          <Badge icon={<ShieldCheck className="w-6 h-6" />} title="Verified" desc="High Standards" />
          <Badge icon={<Zap className="w-6 h-6" />} title="Rapid" desc="24hr Service" />
          <Badge icon={<Award className="w-6 h-6" />} title="Premium" desc="Italian Inks" />
          <Badge icon={<TrendingUp className="w-6 h-6" />} title="Logistics" desc="Lagos Delivery" />
        </div>
      </section>
    </div>
  );
}

function SectionHeader({ title, subtitle }: { title: string, subtitle: string }) {
  return (
    <div className="mb-12 border-l-8 border-red-600 pl-8">
      <span className="text-red-600 font-black text-[10px] uppercase tracking-[0.5em]">{subtitle}</span>
      <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase mt-2 italic leading-none">{title}</h2>
    </div>
  );
}

function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/products/${product.slug}`} className="group">
      <div className="relative aspect-[4/5] bg-zinc-100 rounded-[40px] overflow-hidden mb-6 transition-all duration-500 group-hover:shadow-2xl group-hover:-translate-y-2">
        {product.image ? (
          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-zinc-300"><ShoppingBag className="w-12 h-12" /></div>
        )}
        <div className="absolute bottom-4 right-4 translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all">
          <div className="bg-white p-4 rounded-2xl shadow-xl text-black">
             <ArrowRight className="w-5 h-5" />
          </div>
        </div>
      </div>
      <div className="px-4">
        <p className="text-[10px] font-black text-red-600 uppercase tracking-widest mb-1">{product.category}</p>
        <h3 className="font-black text-xl tracking-tight uppercase italic text-zinc-900 leading-tight mb-2 truncate">{product.name}</h3>
        <p className="font-black text-sm text-zinc-400">₦{parseFloat(product.base_price || "0").toLocaleString()}</p>
      </div>
    </Link>
  );
}

function Badge({ icon, title, desc }: { icon: any, title: string, desc: string }) {
  return (
    <div className="flex flex-col items-center text-center group">
      <div className="w-16 h-16 bg-white text-zinc-400 group-hover:text-red-600 group-hover:scale-110 shadow-sm rounded-3xl flex items-center justify-center mb-6 transition-all border border-zinc-100">{icon}</div>
      <p className="text-xs font-black uppercase tracking-[0.2em] text-zinc-900">{title}</p>
      <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest mt-1">{desc}</p>
    </div>
  );
}