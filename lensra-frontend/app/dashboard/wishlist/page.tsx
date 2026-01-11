"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Heart, Trash2, ShoppingCart, Loader2, AlertCircle, X, 
  Package, Star, ArrowRight, Search, Filter, Zap, ChevronRight
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const BaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000/";

interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  original_price?: number;
  image?: string;
  stock_status?: 'in_stock' | 'low_stock' | 'out_of_stock';
  rating?: number;
}

interface WishlistItem {
  id: number;
  product: Product;
  added_at: string;
}

interface WishlistResponse {
  id: number;
  items: WishlistItem[];
  item_count: number;
  updated_at: string;
}

export default function WishlistPage() {
  const { token } = useAuth();
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('newest');

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async (): Promise<void> => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${BaseUrl}api/wishlists/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) throw new Error('Failed to fetch wishlist');
      const data: WishlistResponse = await response.json();
      setWishlistItems(data.items || []);
    } catch (err) {
      setError('UNABLE TO SYNC ARCHIVE.');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveItem = async (productId: number): Promise<void> => {
    setDeletingId(productId);
    try {
      const response = await fetch(`${BaseUrl}api/wishlists/remove/${productId}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) throw new Error('Failed to remove item');
      setWishlistItems(wishlistItems.filter(item => item.product.id !== productId));
      showMessage('success', 'ASSET REMOVED FROM VAULT');
    } catch (err) {
      showMessage('error', 'DELETION FAILED');
    } finally {
      setDeletingId(null);
    }
  };

  const showMessage = (type: 'error' | 'success', message: string): void => {
    if (type === 'error') {
      setError(message);
      setTimeout(() => setError(''), 5000);
    } else {
      setSuccess(message);
      setTimeout(() => setSuccess(''), 5000);
    }
  };

  const filteredItems = wishlistItems.filter(item => {
    const searchLower = searchQuery.toLowerCase();
    return (
      item.product.name?.toLowerCase().includes(searchLower) ||
      item.product.description?.toLowerCase().includes(searchLower)
    );
  });

  const sortedItems = [...filteredItems].sort((a, b) => {
    switch (sortBy) {
      case 'newest': return new Date(b.added_at).getTime() - new Date(a.added_at).getTime();
      case 'price-low': return a.product.price - b.product.price;
      case 'price-high': return b.product.price - a.product.price;
      case 'name': return a.product.name.localeCompare(b.product.name);
      default: return 0;
    }
  });

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-20 min-h-[60vh]">
      <div className="w-10 h-10 border-2 border-zinc-200 border-t-red-600 rounded-full animate-spin mb-4" />
      <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-400">Loading Wishlist</p>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* 1. STATUS NOTIFICATIONS */}
      {(error || success) && (
        <div className={`fixed top-24 right-6 z-50 max-w-sm w-full p-4 rounded-2xl backdrop-blur-xl shadow-2xl border animate-in slide-in-from-right-10 ${
          error ? 'bg-red-600 text-white border-red-500' : 'bg-zinc-900 text-white border-zinc-800'
        }`}>
          <div className="flex items-center gap-3">
            {error ? <AlertCircle className="w-4 h-4" /> : <Zap className="w-4 h-4 text-red-500 fill-current" />}
            <p className="text-[10px] font-bold uppercase tracking-widest flex-1">{error || success}</p>
            <button onClick={() => { setError(''); setSuccess(''); }} className="opacity-50 hover:opacity-100 transition-opacity">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* 2. HEADER SECTION */}
      <section className="bg-zinc-900 rounded-[32px] p-8 md:p-12 relative overflow-hidden text-white shadow-2xl shadow-zinc-200">
        <div className="absolute right-0 top-0 w-1/3 h-full bg-red-600/10 blur-[100px] rounded-full" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div>
            <span className="text-red-500 font-bold text-[10px] uppercase tracking-[0.4em] mb-4 block">Archive Management</span>
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight uppercase leading-none">
              Saved <span className="text-zinc-500">Creations</span><span className="text-red-600">.</span>
            </h1>
          </div>
          <Link href="/products" className="group px-8 py-4 bg-white text-zinc-900 rounded-xl font-bold uppercase text-[10px] tracking-widest hover:bg-red-600 hover:text-white transition-all flex items-center gap-2">
            <Package className="w-4 h-4" /> Catalog <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      {/* 3. CONTROLS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-red-600 transition-colors" />
          <input
            type="text"
            placeholder="FILTER SAVED ASSETS..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white border border-zinc-200 rounded-2xl focus:border-red-600/30 outline-none font-bold text-[10px] tracking-[0.2em] transition-all uppercase"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full pl-12 pr-10 py-4 bg-zinc-900 text-white rounded-2xl outline-none font-bold text-[10px] tracking-[0.2em] appearance-none cursor-pointer"
          >
            <option value="newest">RECENT ADDITIONS</option>
            <option value="price-low">MIN PRICE</option>
            <option value="price-high">MAX PRICE</option>
            <option value="name">ALPHABETICAL</option>
          </select>
          <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-3 h-3 text-zinc-400 rotate-90 pointer-events-none" />
        </div>
      </div>

      {/* 4. ASSET GRID */}
      {!error && sortedItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedItems.map((item) => (
            <div key={item.id} className="group bg-white rounded-3xl border border-zinc-200 overflow-hidden hover:shadow-xl transition-all duration-500 hover:border-red-600/20">
              <div className="relative aspect-square bg-zinc-50 overflow-hidden border-b border-zinc-100">
                {item.product.image ? (
                  <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-zinc-100"><Package className="w-10 h-10 text-zinc-300" /></div>
                )}
                
                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {item.product.stock_status && (
                    <span className={`px-3 py-1 rounded-lg text-[8px] font-bold tracking-widest uppercase border ${
                      item.product.stock_status === 'in_stock' ? 'bg-zinc-900 text-white border-zinc-900' : 'bg-white text-red-600 border-red-100'
                    }`}>
                      {item.product.stock_status.replace('_', ' ')}
                    </span>
                  )}
                </div>

                {/* Remove from Archive */}
                <button
                  onClick={() => handleRemoveItem(item.product.id)}
                  disabled={deletingId === item.product.id}
                  className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-md rounded-xl flex items-center justify-center text-zinc-400 hover:text-red-600 transition-all shadow-sm border border-zinc-100 disabled:opacity-50"
                >
                  {deletingId === item.product.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                </button>
              </div>

              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div className="min-w-0">
                    <h3 className="text-lg font-bold uppercase tracking-tight text-zinc-900 truncate mb-1">
                      {item.product.name}
                    </h3>
                    <div className="flex items-center gap-1.5 text-[9px] font-bold text-zinc-400 uppercase tracking-widest">
                      <Star className="w-3 h-3 text-red-600 fill-current" /> {item.product.rating || '5.0'}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold tracking-tighter text-zinc-900">₦{item.product.price?.toLocaleString()}</p>
                    {item.product.original_price && item.product.original_price > item.product.price && (
                      <p className="text-[9px] text-zinc-400 line-through font-bold">₦{item.product.original_price.toLocaleString()}</p>
                    )}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    disabled={item.product.stock_status === 'out_of_stock'}
                    className="flex-[3] bg-zinc-900 text-white py-3 rounded-xl font-bold text-[9px] tracking-widest hover:bg-red-600 transition-all flex items-center justify-center gap-2 disabled:opacity-20 shadow-lg shadow-zinc-200"
                  >
                    <ShoppingCart className="w-3.5 h-3.5" /> ADD TO CART
                  </button>
                  <Link href={`/products/${item.product.id}`} className="flex-1 bg-zinc-50 border border-zinc-100 rounded-xl flex items-center justify-center hover:bg-zinc-900 hover:text-white transition-all">
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-[32px] py-24 text-center border border-zinc-200 border-dashed">
          <Heart className="w-12 h-12 text-zinc-100 mx-auto mb-4" />
          <h2 className="text-lg font-bold uppercase tracking-widest text-zinc-400">Archive Offline</h2>
          <p className="text-[9px] font-bold text-zinc-300 uppercase tracking-widest mt-1 mb-8">No items have been flagged for production.</p>
          <Link href="/products" className="inline-flex items-center gap-2 bg-zinc-900 text-white px-8 py-4 rounded-xl font-bold text-[9px] tracking-widest hover:bg-red-600 transition-all">
            SCAN CATALOG <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* 5. SUMMARY ACTION */}
      {!loading && sortedItems.length > 0 && (
        <section className="bg-zinc-900 rounded-[32px] p-8 text-white relative overflow-hidden shadow-2xl shadow-zinc-300">
          <div className="absolute left-0 bottom-0 w-full h-1 bg-red-600" />
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
            <div>
              <h3 className="text-xl font-bold uppercase tracking-tight mb-2">Initialize Production?</h3>
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                Archive Batch Total: <span className="text-white ml-2">₦{wishlistItems.reduce((sum, item) => sum + (item.product.price || 0), 0).toLocaleString()}</span>
              </p>
            </div>
            <Link href="/checkout" className="group flex items-center gap-3 bg-red-600 text-white px-8 py-4 rounded-xl font-bold text-[9px] tracking-widest hover:bg-white hover:text-zinc-900 transition-all shadow-xl shadow-red-900/20">
              DEPLOY CHECKOUT <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}