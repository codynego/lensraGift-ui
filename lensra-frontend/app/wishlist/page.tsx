"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Heart, Trash2, ShoppingCart, Share2, X, Star, 
  Package, Eye, ChevronDown, Grid, List, ArrowUpRight, Plus, Loader2 
} from 'lucide-react';

export default function LensraWishlist() {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [showShareModal, setShowShareModal] = useState(false);
  const [wishlistItems, setWishlistItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedWishlist = localStorage.getItem('wishlist');
    if (savedWishlist) {
      setWishlistItems(JSON.parse(savedWishlist));
    }
    setLoading(false);
  }, []);

  // --- ADD TO CART & CHECKOUT LOGIC ---
  const handleOrderNow = (item: any) => {
    // 1. Get existing cart
    const localCart = localStorage.getItem('local_cart');
    let cart = localCart ? JSON.parse(localCart) : [];

    // 2. Check if item already exists in cart
    const existingItemIndex = cart.findIndex((i: any) => i.product_id === item.id);

    if (existingItemIndex > -1) {
      // If it exists, just increment quantity
      cart[existingItemIndex].quantity += 1;
    } else {
      // If new, add with the required structure
      cart.push({
        product_id: item.id,
        quantity: 1,
        name: item.name,
        price: item.price,
        image: item.image
      });
    }

    // 3. Save and Redirect
    localStorage.setItem('local_cart', JSON.stringify(cart));
    router.push('/checkout');
  };

  const removeItem = (id: number) => {
    const updated = wishlistItems.filter(item => item.id !== id);
    setWishlistItems(updated);
    localStorage.setItem('wishlist', JSON.stringify(updated));
    setSelectedItems(selectedItems.filter(itemId => itemId !== id));
  };

  const toggleSelectItem = (id: number) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter(itemId => itemId !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  const totalValue = wishlistItems.reduce((sum, item) => sum + parseFloat(item.price || 0), 0);

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <Loader2 className="w-10 h-10 animate-spin text-red-600 mb-4" />
      <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Opening Archive...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <section className="bg-black text-white pt-24 pb-16 px-6 lg:px-10">
        <div className="max-w-[1600px] mx-auto">
          <div className="flex flex-col md:flex-row items-end justify-between gap-8 border-b border-white/10 pb-12">
            <div>
              <div className="flex items-center gap-4 mb-4">
                <Heart className="w-10 h-10 fill-red-600 text-red-600" />
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500">Member Archive</span>
              </div>
              <h1 className="text-5xl md:text-8xl font-black uppercase italic tracking-tighter leading-none">
                Saved Items
              </h1>
            </div>
            
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => setShowShareModal(true)}
                className="px-8 py-4 bg-white/5 border border-white/20 text-white rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all duration-300 flex items-center gap-2"
              >
                <Share2 className="w-4 h-4" /> Share Collection
              </button>
              <button
                onClick={() => router.push('/products')}
                className="px-8 py-4 bg-red-600 text-white rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-red-700 transition-all flex items-center gap-2"
              >
                <Plus className="w-4 h-4" /> Add More
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
            <div>
              <p className="text-gray-500 text-[9px] font-black uppercase tracking-widest mb-1">Total Pieces</p>
              <p className="text-2xl font-black italic uppercase tracking-tighter">{wishlistItems.length} Objects</p>
            </div>
            <div>
              <p className="text-gray-500 text-[9px] font-black uppercase tracking-widest mb-1">Estimated Value</p>
              <p className="text-2xl font-black italic uppercase tracking-tighter">₦{totalValue.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-[1600px] mx-auto px-6 lg:px-10 py-12">
        {wishlistItems.length === 0 ? (
          <div className="h-[50vh] flex flex-col items-center justify-center text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                <Heart className="w-10 h-10 text-gray-300" />
            </div>
            <h2 className="text-3xl font-black uppercase italic tracking-tighter mb-4 text-black">Empty Archive</h2>
            <button onClick={() => router.push('/shop')} className="px-12 py-5 bg-black text-white rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-red-600 transition-all">
              Browse Archive
            </button>
          </div>
        ) : (
          <>
            <div className="flex flex-wrap items-center justify-between gap-6 mb-16 border-b border-gray-100 pb-8">
              <div className="flex items-center gap-6">
                <button
                  onClick={() => setSelectedItems(selectedItems.length === wishlistItems.length ? [] : wishlistItems.map(i => i.id))}
                  className="text-[10px] font-black uppercase tracking-widest underline decoration-2 underline-offset-4 hover:text-red-600 transition"
                >
                  {selectedItems.length === wishlistItems.length ? 'Deselect all' : 'Select items'}
                </button>
                {selectedItems.length > 0 && (
                  <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-red-600">
                    <Trash2 className="w-4 h-4" /> Remove Selected ({selectedItems.length})
                  </button>
                )}
              </div>
            </div>

            <div className={viewMode === 'grid' ? 'grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-10 gap-y-16' : 'space-y-6'}>
              {wishlistItems.map((item) => (
                <div key={item.id} className="group relative">
                    <div className="relative aspect-[4/5] bg-zinc-50 rounded-[40px] overflow-hidden mb-6 border border-zinc-100">
                        <div className="absolute top-6 left-6 z-20">
                            <input
                                type="checkbox"
                                checked={selectedItems.includes(item.id)}
                                onChange={() => toggleSelectItem(item.id)}
                                className="w-6 h-6 rounded-lg border-2 border-zinc-200 bg-white checked:bg-red-600 transition-all cursor-pointer"
                            />
                        </div>

                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                        />

                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3">
                            <button 
                                onClick={() => removeItem(item.id)}
                                className="w-12 h-12 bg-white rounded-full flex items-center justify-center hover:bg-red-600 hover:text-white transition-colors"
                            >
                                <Trash2 className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    <div className="px-2">
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <p className="text-[9px] font-black uppercase tracking-widest text-red-600 mb-1">Premium Object</p>
                                <h3 className="text-xl font-black italic uppercase tracking-tighter leading-tight">
                                    {item.name}
                                </h3>
                            </div>
                            <div className="text-right">
                                <p className="text-xl font-black italic">₦{parseFloat(item.price).toLocaleString()}</p>
                            </div>
                        </div>
                        
                        <button 
                          onClick={() => handleOrderNow(item)}
                          className="w-full mt-4 py-4 bg-black text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
                        >
                            <ShoppingCart className="w-4 h-4" /> Order Now
                        </button>
                    </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[200] p-4">
          <div className="bg-white rounded-[50px] p-12 max-w-lg w-full relative">
            <button onClick={() => setShowShareModal(false)} className="absolute top-10 right-10"><X /></button>
            <h3 className="text-4xl font-black uppercase italic tracking-tighter mb-6">Dispatch Archive</h3>
            <div className="space-y-4">
              <button className="w-full py-6 bg-black text-white rounded-3xl text-[10px] font-black uppercase tracking-widest hover:bg-red-600 transition-all flex items-center justify-center gap-3">
                <ArrowUpRight className="w-4 h-4" /> Copy Direct Link
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}