"use client";

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { 
  Palette, Search, Plus, Edit2, Trash2, Clock, 
  Grid, List, Zap, ArrowRight, ChevronDown
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const BaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000/";

interface ProductDetails {
  id: number;
  name: string;
  image: string | null;
  base_price: string;
}

interface Design {
  id: number;
  user: number;
  user_email: string;
  product: number;
  product_details: ProductDetails;
  name: string;
  design_image: string;
  preview_image: string | null;
  created_at: string;
  updated_at: string;
}

export default function MyDesigns() {
  const { token } = useAuth();
  const [designs, setDesigns] = useState<Design[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    if (token) fetchDesigns();
  }, [token]);

  const fetchDesigns = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${BaseUrl}api/designs/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) throw new Error('Failed to fetch designs');
      const data = await response.json();
      setDesigns(Array.isArray(data) ? data : data.results || []);
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Permanently delete this design?')) return;
    try {
      const response = await fetch(`${BaseUrl}api/designs/${id}/`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        setDesigns(designs.filter(d => d.id !== id));
      }
    } catch (err) {
      alert("Error: Action failed.");
    }
  };

  const filteredDesigns = useMemo(() => {
    let result = designs.filter(d => 
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.product_details.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return result.sort((a, b) => {
      if (sortBy === 'recent') return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return 0;
    });
  }, [designs, searchQuery, sortBy]);

  if (loading) return (
    <div className="min-h-[60vh] flex items-center justify-center bg-white">
      <div className="flex flex-col items-center">
        <div className="w-10 h-10 border-2 border-zinc-200 border-t-red-600 rounded-full animate-spin mb-4" />
        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-400">Querying Vault</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-transparent">
      
      {/* 1. HEADER SECTION */}
      <section className="bg-zinc-900 py-12 px-8 relative overflow-hidden rounded-[32px] shadow-2xl shadow-zinc-200 mb-8">
        <div className="absolute left-0 bottom-0 w-1/3 h-full bg-red-600/10 blur-[120px] rounded-full" />
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 relative z-10">
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3 mb-3">
              <Zap className="w-4 h-4 text-red-600 fill-current" />
              <span className="text-red-500 font-bold text-[10px] uppercase tracking-[0.4em]">Design Archive</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight leading-none mb-3 uppercase">
              The <span className="text-zinc-500">Vault</span><span className="text-red-600">.</span>
            </h1>
            <p className="text-zinc-400 text-[11px] font-bold uppercase tracking-widest max-w-sm">
              Blueprints & Custom Deployments
            </p>
          </div>
          <Link href="/products" className="group flex items-center gap-3 px-8 py-4 bg-white text-black rounded-xl font-bold uppercase text-[10px] tracking-widest hover:bg-red-600 hover:text-white transition-all">
            Initiate Sequence <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" />
          </Link>
        </div>
      </section>

      {/* 2. CONTROL TOOLBAR */}
      <div className="sticky top-[80px] z-30 bg-zinc-50/80 backdrop-blur-md border border-zinc-200 rounded-2xl py-3 px-4 mb-8">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-[280px] relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="SEARCH ASSETS..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white border border-zinc-200 rounded-xl text-[10px] font-bold tracking-[0.2em] outline-none focus:border-red-600/30 transition-all uppercase"
            />
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex bg-zinc-100 p-1 rounded-lg border border-zinc-200">
              <button 
                onClick={() => setViewMode('grid')} 
                className={`p-2 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white text-red-600 shadow-sm' : 'text-zinc-400 hover:text-zinc-900'}`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setViewMode('list')} 
                className={`p-2 rounded-md transition-all ${viewMode === 'list' ? 'bg-white text-red-600 shadow-sm' : 'text-zinc-400 hover:text-zinc-900'}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            <div className="relative">
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none pl-5 pr-10 py-3 bg-zinc-900 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest outline-none cursor-pointer hover:bg-black transition-colors"
              >
                <option value="recent">RECENT</option>
                <option value="name">ALPHA</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-3 h-3 text-zinc-400 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* 3. ASSET GRID/LIST */}
      <section className="max-w-7xl mx-auto">
        {filteredDesigns.length > 0 ? (
          <div className={viewMode === 'grid' ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
            {filteredDesigns.map((design) => (
              <div 
                key={design.id} 
                className={`group relative bg-white rounded-3xl border border-zinc-200 hover:border-red-600/20 transition-all duration-500 hover:shadow-xl overflow-hidden ${viewMode === 'list' ? 'flex items-center gap-6 p-4 rounded-2xl' : 'p-4'}`}
              >
                {/* Image Container */}
                <div className={`${viewMode === 'grid' ? 'aspect-square w-full mb-6' : 'w-24 h-24 shrink-0'} rounded-2xl overflow-hidden bg-zinc-50 relative border border-zinc-100`}>
                  {design.preview_image ? (
                    <img 
                      src={design.preview_image} 
                      alt={design.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-700" 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center opacity-20">
                      <Palette className="w-10 h-10 text-zinc-400" />
                    </div>
                  )}

                  {/* Hover Actions (Grid Only) */}
                  {viewMode === 'grid' && (
                    <div className="absolute inset-0 bg-zinc-900/60 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-3">
                      <button className="p-3 bg-white text-zinc-900 rounded-xl hover:bg-red-600 hover:text-white transition-all">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(design.id)}
                        className="p-3 bg-white text-red-600 rounded-xl hover:bg-black hover:text-white transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Info Container */}
                <div className="flex-1 min-w-0">
                  <p className="text-[9px] font-bold text-red-600 uppercase tracking-widest mb-1">
                    {design.product_details.name}
                  </p>
                  <h3 className="text-lg font-bold tracking-tight truncate text-zinc-900 uppercase mb-2">
                    {design.name}
                  </h3>
                  
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2 text-zinc-400">
                       <Clock className="w-3 h-3" />
                       <span className="text-[9px] font-bold uppercase tracking-widest">
                         {new Date(design.updated_at).toLocaleDateString()}
                       </span>
                    </div>

                    <Link 
                      href={`/products/${design.product}`}
                      className="flex items-center justify-center gap-2 px-4 py-2 bg-zinc-100 text-zinc-900 rounded-lg font-bold text-[9px] uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all"
                    >
                      Deploy <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                  
                  {/* List Mode Specific Tools */}
                  {viewMode === 'list' && (
                    <div className="flex gap-4 mt-4 pt-4 border-t border-zinc-100">
                       <button className="text-[9px] font-bold uppercase text-zinc-400 hover:text-zinc-900 tracking-widest flex items-center gap-1">
                         <Edit2 className="w-3 h-3" /> Edit
                       </button>
                       <button 
                        onClick={() => handleDelete(design.id)}
                        className="text-[9px] font-bold uppercase text-zinc-400 hover:text-red-600 tracking-widest flex items-center gap-1"
                       >
                         <Trash2 className="w-3 h-3" /> Remove
                       </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-white rounded-[32px] border border-zinc-200 border-dashed">
            <div className="w-16 h-16 bg-zinc-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Palette className="w-8 h-8 text-zinc-200" />
            </div>
            <h2 className="text-xl font-bold text-zinc-400 uppercase tracking-widest mb-2">Archive Offline</h2>
            <p className="text-zinc-400 text-[10px] font-bold uppercase tracking-widest mb-8">No custom blueprints detected.</p>
            <Link href="/products" className="inline-block px-8 py-4 bg-zinc-900 text-white rounded-xl font-bold uppercase text-[10px] tracking-widest hover:bg-red-600 transition-all">
              Initialize Creation
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}