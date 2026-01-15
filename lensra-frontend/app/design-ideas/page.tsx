"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Heart, Zap, Loader2, ArrowUpRight, LayoutGrid, Type, Fingerprint } from 'lucide-react';

interface Design {
  id: number;
  name: string;
  design_image: string;
  preview_image: string | null;
  user_email: string;
  product_details: {
    id: number;
    name: string;
  };
  likes?: number;
  views?: number;
  category?: string;
}

const BaseUrl = (process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000/").replace(/\/$/, '');

// Helper to fix 404 errors by ensuring image points to Backend
const getImageUrl = (path: string | null | undefined) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return `${BaseUrl}${path.startsWith('/') ? '' : '/'}${path}`;
};

export default function LensraDesignIdeas() {
  const router = useRouter();
  const [designs, setDesigns] = useState<Design[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDesigns = async () => {
      try {
        setIsLoading(true);
        // Updated to the public designs endpoint
        const response = await fetch(`${BaseUrl}/api/designs/public/`);
        const data = await response.json();
        
        // Handle both direct arrays and DRF paginated results
        const extracted = Array.isArray(data) ? data : (data.results || []);
        setDesigns(extracted);
      } catch (error) {
        console.error("Archive Access Error:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDesigns();
  }, []);

  const categories = [
    { id: 'all', name: 'Global Archive', icon: <LayoutGrid className="w-4 h-4" /> },
    { id: 'typography', name: 'Type Lab', icon: <Type className="w-4 h-4" /> },
    { id: 'experimental', name: 'Raw Concepts', icon: <Fingerprint className="w-4 h-4" /> },
  ];

  const filteredDesigns = designs.filter(design => {
    const matchesCategory = selectedCategory === 'all' || design.category === selectedCategory;
    const matchesSearch = design.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-white text-zinc-900 selection:bg-red-600 selection:text-white">
      
      {/* 1. BRUTALIST HERO UNIT */}
      <section className="bg-zinc-950 text-white pt-32 pb-20 px-6 lg:px-12 border-b-[16px] border-red-600 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-red-600/10 to-transparent pointer-events-none" />
        
        <div className="max-w-[1600px] mx-auto flex flex-col lg:flex-row lg:items-end justify-between gap-12 relative z-10">
          <div className="space-y-6">
            <div className="flex items-center gap-4 text-red-500">
              <Zap className="w-10 h-10 fill-current" />
              <div className="h-px w-12 bg-zinc-800" />
              <span className="text-[10px] font-black uppercase tracking-[0.5em]">System.Intelligence</span>
            </div>
            <h1 className="text-7xl md:text-[9rem] font-black italic uppercase tracking-tighter leading-[0.8] mb-4">
              Creative <br /> <span className="text-red-600">Archive</span>
            </h1>
            <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest max-w-md leading-relaxed">
              Explore the collective intelligence of the Lensra Lab. 
              Inject verified community assets into your workspace.
            </p>
          </div>
          
          <div className="w-full lg:w-[460px]">
            <div className="relative">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="PROMPT ARCHIVE SEARCH..."
                className="w-full bg-zinc-900/50 backdrop-blur-xl border-2 border-zinc-800 pl-16 pr-8 py-6 rounded-2xl text-white text-[10px] font-black tracking-[0.2em] focus:border-red-600 transition-all outline-none focus:ring-4 focus:ring-red-600/20"
              />
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-[1600px] mx-auto px-6 lg:px-12 py-20">
        <div className="grid lg:grid-cols-12 gap-16">
          
          {/* 2. NAVIGATION SIDEBAR */}
          <aside className="lg:col-span-3 space-y-12">
            <div>
              <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-300 mb-8 px-4">Classification</h3>
              <div className="flex flex-col gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`flex items-center justify-between px-6 py-5 rounded-[24px] transition-all group ${
                      selectedCategory === cat.id 
                      ? 'bg-zinc-900 text-white shadow-2xl shadow-zinc-300' 
                      : 'bg-zinc-50 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-900'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <span className={selectedCategory === cat.id ? 'text-red-500' : ''}>{cat.icon}</span>
                      <span className="text-[11px] font-black uppercase tracking-widest">{cat.name}</span>
                    </div>
                    <ArrowUpRight className={`w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1 ${selectedCategory === cat.id ? 'opacity-100' : 'opacity-0'}`} />
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-red-50 rounded-[32px] p-8 border border-red-100">
               <h4 className="text-[10px] font-black uppercase tracking-widest text-red-600 mb-2">Lab Tip</h4>
               <p className="text-[11px] font-bold text-red-900 leading-relaxed uppercase tracking-tight">
                 You can remix any design in the archive by clicking "Inject Design".
               </p>
            </div>
          </aside>

          {/* 3. ASSET GRID */}
          <main className="lg:col-span-9">
            {isLoading ? (
                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="aspect-[4/5] bg-zinc-50 rounded-[48px] animate-pulse" />
                  ))}
                </div>
            ) : (
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
                {filteredDesigns.map((design) => (
                  <div 
                    key={design.id} 
                    className="group relative bg-zinc-50 rounded-[48px] overflow-hidden border border-zinc-100 hover:border-zinc-900 transition-all duration-700"
                  >
                    <div className="aspect-[4/5] flex flex-col items-center justify-center p-12 transition-all duration-700 group-hover:scale-90">
                      <img 
                        src={getImageUrl(design.preview_image || design.design_image)} 
                        alt={design.name}
                        className="w-full h-full object-contain grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700"
                      />
                    </div>

                    {/* OVERLAY ACTION PANEL */}
                    <div className="absolute inset-0 bg-zinc-950/95 opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col items-center justify-center p-10 text-center">
                      <div className="space-y-2 mb-8">
                        <span className="text-red-600 text-[10px] font-black uppercase tracking-[0.4em]">Asset Detected</span>
                        <h4 className="text-white text-3xl font-black italic uppercase tracking-tighter leading-none">{design.name}</h4>
                      </div>
                      
                      <div className="w-full h-px bg-zinc-800 mb-8" />
                      
                      <div className="space-y-6 w-full">
                        <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-zinc-500">
                          <span>Base Unit</span>
                          <span className="text-white truncate max-w-[120px]">{design.product_details?.name || 'Standard'}</span>
                        </div>
                        
                        <button 
                          onClick={() => router.push(`/editor?template=${design.id}`)}
                          className="w-full py-5 bg-red-600 text-white text-[10px] font-black uppercase tracking-[0.3em] rounded-full shadow-2xl shadow-red-600/20 hover:scale-105 active:scale-95 transition-all"
                        >
                          Inject Design
                        </button>
                        
                        <button className="flex items-center justify-center gap-2 text-zinc-400 hover:text-white transition-colors">
                           <Heart className="w-4 h-4" />
                           <span className="text-[9px] font-black uppercase tracking-widest">Add to Favs</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {!isLoading && filteredDesigns.length === 0 && (
              <div className="h-[40vh] flex flex-col items-center justify-center border-2 border-dashed border-zinc-100 rounded-[60px]">
                <span className="text-4xl mb-4">🔍</span>
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-300">No assets found in current search query</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}