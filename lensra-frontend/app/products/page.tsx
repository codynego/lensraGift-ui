"use client";

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { 
  Search, ChevronRight, ArrowUpRight, Filter, Loader2, 
  ChevronLeft, X 
} from 'lucide-react';

const BaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000/";

interface Product {
  id: number;
  name: string;
  base_price: string;
  category_name: string; // Updated to match your Serializer source='category.name'
  image: string | null;
  is_active: boolean;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Products');
  const [selectedPriceRange, setSelectedPriceRange] = useState('all');

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const sidebarCategories = ["All Products", "Apparel", "Drinkware", "Home Decor", "Accessories", "Stationery"];
  const priceRanges = [
    { label: "Any Price", value: "all" },
    { label: "Under ₦3,000", value: "under-3k" },
    { label: "₦3,000 - ₦5,000", value: "3k-5k" },
    { label: "Over ₦5,000", value: "over-5k" },
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${BaseUrl}api/products/`);
        const data = await response.json();
        
        // FIX: Handle the "results" key from paginated DRF response
        const rawResults = data.results || (Array.isArray(data) ? data : []);
        
        // Filter for active products only
        const activeProducts = rawResults.filter((p: Product) => p.is_active !== false);
        setProducts(activeProducts);
      } catch (err) { 
        console.error("Fetch Error:", err); 
      } finally { 
        setLoading(false); 
      }
    };
    fetchProducts();
  }, []);

  // Filter Logic
  const filteredProducts = useMemo(() => {
    let result = products;

    if (searchQuery) {
      result = result.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    if (selectedCategory !== 'All Products') {
      // Checking category_name from serializer
      result = result.filter(p => p.category_name?.toLowerCase() === selectedCategory.toLowerCase());
    }
    if (selectedPriceRange !== 'all') {
      result = result.filter(p => {
        const price = parseFloat(p.base_price);
        if (selectedPriceRange === 'under-3k') return price < 3000;
        if (selectedPriceRange === '3k-5k') return price >= 3000 && price <= 5000;
        if (selectedPriceRange === 'over-5k') return price > 5000;
        return true;
      });
    }
    return result;
  }, [products, searchQuery, selectedCategory, selectedPriceRange]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const currentItems = useMemo(() => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
  }, [filteredProducts, currentPage]);

  useEffect(() => { setCurrentPage(1); }, [searchQuery, selectedCategory, selectedPriceRange]);

  return (
    <div className="min-h-screen bg-white text-zinc-900">
      
      {/* MOBILE HEADER */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-zinc-100 lg:hidden">
        <div className="p-4 flex flex-col gap-3">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input 
              type="text" 
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-50 border-none rounded-2xl py-3 pl-11 pr-4 text-[11px] font-bold focus:ring-2 focus:ring-red-600/20"
            />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            <button onClick={() => setShowMobileFilters(true)} className="p-3 bg-zinc-900 text-white rounded-xl flex-shrink-0"><Filter className="w-4 h-4" /></button>
            {sidebarCategories.map((cat) => (
              <button 
                key={cat} 
                onClick={() => setSelectedCategory(cat)} 
                className={`px-5 py-2.5 rounded-full text-[9px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${selectedCategory === cat ? 'bg-red-600 text-white' : 'bg-zinc-100 text-zinc-400'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-6 lg:px-12 py-10">
        <div className="flex flex-col lg:flex-row gap-16">
          
          {/* DESKTOP SIDEBAR */}
          <aside className="hidden lg:block lg:w-64 flex-shrink-0 sticky top-28 h-fit space-y-12">
            <div>
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-300 mb-6">Categories</h3>
              <div className="space-y-1">
                {sidebarCategories.map((cat) => (
                  <button 
                    key={cat} 
                    onClick={() => setSelectedCategory(cat)} 
                    className={`flex items-center justify-between w-full py-2.5 px-4 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all ${selectedCategory === cat ? 'bg-zinc-900 text-white' : 'text-zinc-500 hover:bg-zinc-50'}`}
                  >
                    {cat} <ChevronRight className="w-3 h-3" />
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-10 border-t border-zinc-100">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-300 mb-6">Price Range</h3>
              <div className="space-y-4">
                {priceRanges.map((range) => (
                  <label key={range.value} className="flex items-center gap-3 cursor-pointer group">
                    <input type="radio" name="price" checked={selectedPriceRange === range.value} onChange={() => setSelectedPriceRange(range.value)} className="w-4 h-4 accent-red-600" />
                    <span className={`text-[10px] font-bold uppercase tracking-widest ${selectedPriceRange === range.value ? 'text-zinc-900' : 'text-zinc-400'}`}>{range.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </aside>

          {/* MAIN GRID */}
          <div className="flex-1">
            <div className="hidden lg:flex items-center justify-between mb-12 border-b border-zinc-100 pb-10">
              <div className="relative w-full max-w-md">
                <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <input 
                  type="text" 
                  placeholder="SEARCH FOR A PRODUCT..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent border-none pl-8 text-[11px] font-black uppercase tracking-widest focus:ring-0"
                />
              </div>
              <p className="text-[9px] font-black text-zinc-400 uppercase tracking-[0.2em]">{filteredProducts.length} Products</p>
            </div>

            {loading ? (
              <div className="h-96 flex flex-col items-center justify-center gap-4">
                <Loader2 className="w-8 h-8 animate-spin text-red-600" />
                <span className="text-[8px] font-black uppercase tracking-widest text-zinc-300">Syncing Collection</span>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 xl:grid-cols-3 gap-x-6 gap-y-12 lg:gap-x-10 lg:gap-y-20">
                  {currentItems.map((product) => (
                    <div key={product.id} className="group flex flex-col">
                      <Link href={`/products/${product.slug}`} className="relative aspect-[4/5] bg-zinc-50 overflow-hidden rounded-[32px] border border-zinc-100">
                        {product.image ? (
                          <img src={product.image} alt={product.name} className="w-full h-full object-cover transition duration-700 group-hover:scale-105" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center uppercase font-black text-[8px] text-zinc-300 italic">No Preview</div>
                        )}
                        <div className="absolute inset-0 bg-zinc-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <div className="bg-white text-zinc-900 px-6 py-3 rounded-2xl text-[8px] font-black uppercase tracking-widest flex items-center gap-2">Customize <ArrowUpRight className="w-3 h-3" /></div>
                        </div>
                      </Link>
                      <div className="mt-6 space-y-2">
                        <div className="flex justify-between items-start gap-2">
                          <h3 className="text-sm lg:text-lg font-black uppercase tracking-tight italic text-zinc-900 leading-tight">{product.name}</h3>
                          <p className="text-sm lg:text-lg font-black text-red-600 italic">₦{parseFloat(product.base_price).toLocaleString()}</p>
                        </div>
                        <span className="text-[8px] font-bold uppercase tracking-widest text-zinc-400 bg-zinc-50 px-2 py-1 rounded inline-block">{product.category_name}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* PAGINATION */}
                {totalPages > 1 && (
                  <div className="mt-20 flex items-center justify-center gap-4 border-t border-zinc-100 pt-10">
                    <button 
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(p => p - 1)}
                      className="p-3 rounded-xl border border-zinc-100 disabled:opacity-30 hover:bg-zinc-50 transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    
                    <div className="flex gap-2">
                      {[...Array(totalPages)].map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setCurrentPage(i + 1)}
                          className={`w-10 h-10 rounded-xl text-[10px] font-black transition-all ${currentPage === i + 1 ? 'bg-red-600 text-white' : 'bg-zinc-50 text-zinc-400 hover:bg-zinc-100'}`}
                        >
                          {i + 1}
                        </button>
                      ))}
                    </div>

                    <button 
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage(p => p + 1)}
                      className="p-3 rounded-xl border border-zinc-100 disabled:opacity-30 hover:bg-zinc-50 transition-colors"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* MOBILE FILTERS SHEET */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-[100] lg:hidden">
          <div className="absolute inset-0 bg-zinc-900/60 backdrop-blur-sm" onClick={() => setShowMobileFilters(false)} />
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-[40px] p-8 pb-12 animate-in slide-in-from-bottom duration-500">
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-2xl font-black uppercase italic tracking-tighter">Filter Price</h2>
              <button onClick={() => setShowMobileFilters(false)} className="p-2 bg-zinc-100 rounded-full"><X className="w-4 h-4" /></button>
            </div>
            <div className="grid grid-cols-1 gap-3">
              {priceRanges.map((range) => (
                <button
                  key={range.value}
                  onClick={() => { setSelectedPriceRange(range.value); setShowMobileFilters(false); }}
                  className={`py-5 px-6 rounded-2xl text-[10px] font-black uppercase tracking-widest border text-left transition-all ${selectedPriceRange === range.value ? 'bg-zinc-900 text-white border-zinc-900' : 'bg-zinc-50 border-transparent text-zinc-400'}`}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}