"use client";

import { useState } from 'react';
import { 
  Heart, Trash2, ShoppingCart, Share2, X, Star, 
  Package, Eye, ChevronDown, Grid, List, ArrowUpRight, Plus 
} from 'lucide-react';

export default function LensraWishlist() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [sortBy, setSortBy] = useState('recent');
  const [showShareModal, setShowShareModal] = useState(false);

  const [wishlistItems, setWishlistItems] = useState([
    {
      id: 1,
      name: 'Custom Coffee Mug - Morning Vibes',
      price: 12.99,
      originalPrice: 16.99,
      rating: 4.8,
      reviews: 234,
      img: '☕',
      inStock: true,
      dateAdded: '2025-01-08',
      category: 'Drinkware',
      customized: true
    },
    {
      id: 2,
      name: 'Vintage Print T-Shirt',
      price: 19.99,
      originalPrice: 24.99,
      rating: 4.9,
      reviews: 567,
      img: '👕',
      inStock: true,
      dateAdded: '2025-01-06',
      category: 'Apparel',
      customized: false
    },
    {
      id: 3,
      name: 'Canvas Wall Art 16x20',
      price: 34.99,
      originalPrice: 44.99,
      rating: 4.7,
      reviews: 123,
      img: '🖼️',
      inStock: true,
      dateAdded: '2025-01-05',
      category: 'Home Decor',
      customized: true
    },
    {
      id: 4,
      name: 'Premium Hoodie - Custom Design',
      price: 39.99,
      originalPrice: 49.99,
      rating: 4.9,
      reviews: 890,
      img: '🧥',
      inStock: false,
      dateAdded: '2025-01-03',
      category: 'Apparel',
      customized: true
    }
  ]);

  const removeItem = (id: number) => {
    setWishlistItems(wishlistItems.filter(item => item.id !== id));
    setSelectedItems(selectedItems.filter(itemId => itemId !== id));
  };

  const toggleSelectItem = (id: number) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter(itemId => itemId !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  const totalValue = wishlistItems.reduce((sum, item) => sum + item.price, 0);
  const totalSavings = wishlistItems.reduce((sum, item) => sum + (item.originalPrice - item.price), 0);

  return (
    <div className="min-h-screen bg-white">
      
      {/* 1. Header Section */}
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
                className="px-8 py-4 bg-red-600 text-white rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-red-700 transition-all flex items-center gap-2"
              >
                <ShoppingCart className="w-4 h-4" /> Move All to Bag
              </button>
            </div>
          </div>

          {/* 2. Stats Summary */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
            <div>
              <p className="text-gray-500 text-[9px] font-black uppercase tracking-widest mb-1">Total Pieces</p>
              <p className="text-2xl font-black italic uppercase tracking-tighter">{wishlistItems.length} Objects</p>
            </div>
            <div>
              <p className="text-gray-500 text-[9px] font-black uppercase tracking-widest mb-1">Estimated Value</p>
              <p className="text-2xl font-black italic uppercase tracking-tighter">${totalValue.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-gray-500 text-[9px] font-black uppercase tracking-widest mb-1">Current Savings</p>
              <p className="text-2xl font-black italic uppercase tracking-tighter text-red-600">-${totalSavings.toFixed(2)}</p>
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
            <p className="text-gray-400 max-w-xs uppercase text-[10px] font-black tracking-widest leading-loose mb-8">
              No items have been reserved in your collection. Explore our latest drops to fill your space.
            </p>
            <button className="px-12 py-5 bg-black text-white rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-red-600 transition-all">
              Browse Archive
            </button>
          </div>
        ) : (
          <>
            {/* 3. Filter/Control Bar */}
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

              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                    <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">Sort By</span>
                    <select className="border-none bg-transparent text-[10px] font-black uppercase tracking-widest focus:ring-0 cursor-pointer">
                        <option value="recent">Date: Latest</option>
                        <option value="price-low">Price: Low</option>
                        <option value="price-high">Price: High</option>
                    </select>
                </div>
                <div className="h-4 w-px bg-gray-200 hidden md:block" />
                <div className="hidden md:flex gap-1 bg-gray-50 p-1 rounded-xl">
                    <button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-white shadow-sm' : ''}`}><Grid className="w-4 h-4" /></button>
                    <button onClick={() => setViewMode('list')} className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-white shadow-sm' : ''}`}><List className="w-4 h-4" /></button>
                </div>
              </div>
            </div>

            {/* 4. Wishlist Items */}
            <div className={viewMode === 'grid' ? 'grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-10 gap-y-16' : 'space-y-6'}>
              {wishlistItems.map((item) => (
                <div key={item.id} className="group relative">
                    <div className="relative aspect-[4/5] bg-gray-100 rounded-[40px] overflow-hidden mb-6">
                        {/* Checkbox Overlay */}
                        <div className="absolute top-6 left-6 z-20">
                            <input
                                type="checkbox"
                                checked={selectedItems.includes(item.id)}
                                onChange={() => toggleSelectItem(item.id)}
                                className="w-6 h-6 rounded-lg border-2 border-white/20 bg-black/20 checked:bg-red-600 transition-all cursor-pointer"
                            />
                        </div>

                        {/* Status Tags */}
                        {item.customized && (
                            <div className="absolute top-6 right-6 px-4 py-1.5 bg-white/90 backdrop-blur-md text-[9px] font-black uppercase tracking-widest rounded-full z-20">
                                Customized
                            </div>
                        )}

                        {/* Image Placeholder */}
                        <div className="w-full h-full flex items-center justify-center text-8xl group-hover:scale-110 transition-transform duration-700">
                            {item.img}
                        </div>

                        {/* Action Overlays */}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3">
                            <button 
                                onClick={() => removeItem(item.id)}
                                className="w-12 h-12 bg-white rounded-full flex items-center justify-center hover:bg-red-600 hover:text-white transition-colors"
                            >
                                <Trash2 className="w-5 h-5" />
                            </button>
                            <button className="px-8 py-3 bg-white text-black rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                                <Eye className="w-4 h-4" /> Quick View
                            </button>
                        </div>
                    </div>

                    <div className="px-2">
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <p className="text-[9px] font-black uppercase tracking-widest text-red-600 mb-1">{item.category}</p>
                                <h3 className="text-xl font-black italic uppercase tracking-tighter leading-tight group-hover:text-red-600 transition">
                                    {item.name}
                                </h3>
                            </div>
                            <div className="text-right">
                                <p className="text-xl font-black italic">${item.price}</p>
                                <p className="text-[10px] text-gray-400 line-through">${item.originalPrice}</p>
                            </div>
                        </div>
                        
                        {!item.inStock ? (
                            <div className="mt-4 py-3 border border-dashed border-gray-200 rounded-2xl flex items-center justify-center gap-2 text-gray-400 text-[9px] font-black uppercase tracking-widest">
                                <Package className="w-3 h-3" /> Out of Stock
                            </div>
                        ) : (
                            <button className="w-full mt-4 py-4 bg-black text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-red-600 transition-colors flex items-center justify-center gap-2">
                                <Plus className="w-4 h-4" /> Move to Bag
                            </button>
                        )}
                    </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* 5. Recommended Archive Section */}
      {wishlistItems.length > 0 && (
        <section className="py-32 bg-gray-50 mt-20">
          <div className="max-w-[1600px] mx-auto px-6">
            <div className="flex items-center justify-between mb-16">
                <h2 className="text-4xl lg:text-6xl font-black italic uppercase tracking-tighter">Recommended Additions</h2>
                <button className="text-[10px] font-black uppercase tracking-widest underline underline-offset-8">Explore Catalog</button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="group">
                  <div className="aspect-square bg-white rounded-[32px] mb-6 flex items-center justify-center text-5xl grayscale group-hover:grayscale-0 transition duration-500">🎁</div>
                  <h3 className="text-[10px] font-black uppercase tracking-widest mb-1 text-gray-400">Essentials</h3>
                  <p className="font-black italic uppercase tracking-tighter mb-2">Curated Object {i}</p>
                  <p className="text-sm font-black text-red-600">$24.99</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Share Modal Backdrop */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[200] p-4">
          <div className="bg-white rounded-[50px] p-12 max-w-lg w-full relative">
            <button onClick={() => setShowShareModal(false)} className="absolute top-10 right-10"><X /></button>
            <h3 className="text-4xl font-black uppercase italic tracking-tighter mb-6">Dispatch Archive</h3>
            <p className="text-gray-400 text-[10px] font-black tracking-widest uppercase mb-10 leading-loose">
              Sync your curated collection with friends or send as a digital gift guide.
            </p>
            <div className="space-y-4">
              <button className="w-full py-6 bg-black text-white rounded-3xl text-[10px] font-black uppercase tracking-widest hover:bg-red-600 transition-all flex items-center justify-center gap-3">
                <ArrowUpRight className="w-4 h-4" /> Copy Direct Link
              </button>
              <button className="w-full py-6 border-2 border-gray-100 text-black rounded-3xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-50 transition-all">
                Send via Messenger
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}