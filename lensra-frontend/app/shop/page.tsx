"use client";

import { useState, useEffect, useCallback, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  Search, ChevronRight, ArrowUpRight, Filter, Loader2, 
  ChevronLeft, X 
} from 'lucide-react';
import { console } from 'inspector/promises';

const BaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.lensra.com/";

interface Product {
  id: number;
  name: string;
  slug: string;
  base_price: string;
  category_name: string;
  image_url: string | null;
  is_active: boolean;
}

interface Category {
  id: number;
  name: string;
  slug: string;
}

interface PriceRange {
  label: string;
  value: string;
  min?: number;
  max?: number;
}

function ProductsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPriceRange, setSelectedPriceRange] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalProductsCount, setTotalProductsCount] = useState(0);

  const itemsPerPage = 6;
  
  const priceRanges: PriceRange[] = [
    { label: "Any Price", value: "all" },
    { label: "Under ₦3,000", value: "under-3k", min: 0, max: 2999 },
    { label: "₦3,000 - ₦5,000", value: "3k-5k", min: 3000, max: 5000 },
    { label: "Over ₦5,000", value: "over-5k", min: 5001, max: 1000000 },
  ];

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setCategoriesLoading(true);
        const response = await fetch(`${BaseUrl}api/products/categories/`);
        const data = await response.json();
        
        // Ensure we set an array
        const categoriesArray = Array.isArray(data) ? data : (data.results ? data.results : []);
        setCategories(categoriesArray);
      } catch (err) {
        console.error("Categories Fetch Error:", err);
        setCategories([]);
      } finally {
        setCategoriesLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Initialize state from URL params
  useEffect(() => {
    const q = searchParams.get('q') || '';
    const category = searchParams.get('category') || 'all';
    const price = searchParams.get('price') || 'all';
    const page = Number(searchParams.get('page')) || 1;

    setSearchQuery(q);
    setSelectedCategory(category);
    setSelectedPriceRange(price);
    setCurrentPage(page);
  }, [searchParams]);

  // Fetch products when filters change
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        
        if (searchQuery) params.append('search', searchQuery);
        
        // Filter by category slug - assuming backend filter is named 'category' and expects the slug
        if (selectedCategory !== 'all') {
          params.append('category__slug', selectedCategory);
        }

        const range = priceRanges.find(r => r.value === selectedPriceRange);
        if (range && range.min !== undefined && range.max !== undefined) {
          params.append('min_price', range.min.toString());
          params.append('max_price', range.max.toString());
        }

        params.append('page', currentPage.toString());

        const url = `${BaseUrl}api/products/?${params.toString()}`;
        
        const response = await fetch(url);
        const data = await response.json();
        console.log("Fetched Products Data:", data);
        
        setProducts(data.results || (Array.isArray(data) ? data : []));
        setTotalProductsCount(data.count || 0);
      } catch (err) { 
        console.error("Fetch Error:", err); 
      } finally { 
        setLoading(false); 
      }
    };

    const timer = setTimeout(() => fetchProducts(), 300);
    return () => clearTimeout(timer);
  }, [searchQuery, selectedCategory, selectedPriceRange, currentPage]);

  // Update URL when filters change
  const updateURL = useCallback(() => {
    const params = new URLSearchParams();

    if (searchQuery) params.set('q', searchQuery);
    if (selectedCategory !== 'all') params.set('category', selectedCategory);
    if (selectedPriceRange !== 'all') params.set('price', selectedPriceRange);
    if (currentPage > 1) params.set('page', currentPage.toString());

    const newUrl = params.toString() ? `/shop?${params.toString()}` : '/shop';
    router.push(newUrl, { scroll: false });
  }, [searchQuery, selectedCategory, selectedPriceRange, currentPage, router]);

  useEffect(() => {
    updateURL();
  }, [updateURL]);

  const totalPages = Math.ceil(totalProductsCount / itemsPerPage);

  const handleCategoryChange = (slug: string) => {
    setSelectedCategory(slug);
    setCurrentPage(1);
  };

  const handlePriceChange = (value: string) => {
    setSelectedPriceRange(value);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-white text-zinc-900">
      
      {/* MOBILE HEADER */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-zinc-100 lg:hidden">
        <div className="p-4 flex flex-col gap-4">
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
            <button 
              onClick={() => setShowMobileFilters(true)} 
              className="p-3 bg-zinc-900 text-white rounded-xl flex-shrink-0"
            >
              <Filter className="w-4 h-4" />
            </button>
            <button 
              onClick={() => handleCategoryChange('all')} 
              className={`px-5 py-2.5 rounded-full text-[9px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${
                selectedCategory === 'all' ? 'bg-red-600 text-white' : 'bg-zinc-100 text-zinc-400'
              }`}
            >
              All Products
            </button>
            {categories.map((cat) => (
              <button 
                key={cat.id} 
                onClick={() => handleCategoryChange(cat.slug)} 
                className={`px-5 py-2.5 rounded-full text-[9px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${
                  selectedCategory === cat.slug ? 'bg-red-600 text-white' : 'bg-zinc-100 text-zinc-400'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* MOBILE FILTERS DRAWER */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 bg-black/50 lg:hidden" onClick={() => setShowMobileFilters(false)}>
          <div 
            className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl p-6 space-y-8 max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-300">Filters</h3>
              <button onClick={() => setShowMobileFilters(false)} className="p-2">
                <X className="w-5 h-5 text-zinc-600" />
              </button>
            </div>

            {/* Categories */}
            <div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-300 mb-4">Categories</h4>
              <div className="space-y-2">
                <button 
                  onClick={() => {
                    handleCategoryChange('all');
                    setShowMobileFilters(false);
                  }} 
                  className={`flex items-center justify-between w-full py-3 px-4 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all ${
                    selectedCategory === 'all' ? 'bg-zinc-900 text-white' : 'text-zinc-500 hover:bg-zinc-50'
                  }`}
                >
                  All Products <ChevronRight className="w-3 h-3" />
                </button>
                {categories.map((cat) => (
                  <button 
                    key={cat.id} 
                    onClick={() => {
                      handleCategoryChange(cat.slug);
                      setShowMobileFilters(false);
                    }} 
                    className={`flex items-center justify-between w-full py-3 px-4 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all ${
                      selectedCategory === cat.slug ? 'bg-zinc-900 text-white' : 'text-zinc-500 hover:bg-zinc-50'
                    }`}
                  >
                    {cat.name} <ChevronRight className="w-3 h-3" />
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div className="pt-6 border-t border-zinc-100">
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-300 mb-4">Price Range</h4>
              <div className="space-y-4">
                {priceRanges.map((range) => (
                  <label key={range.value} className="flex items-center gap-3 cursor-pointer group">
                    <input 
                      type="radio" 
                      name="price-mobile" 
                      checked={selectedPriceRange === range.value} 
                      onChange={() => {
                        handlePriceChange(range.value);
                        setShowMobileFilters(false);
                      }} 
                      className="w-4 h-4 accent-red-600" 
                    />
                    <span className={`text-[10px] font-bold uppercase tracking-widest ${
                      selectedPriceRange === range.value ? 'text-zinc-900' : 'text-zinc-400'
                    }`}>
                      {range.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-[1600px] mx-auto px-6 lg:px-12 py-12 lg:py-20">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
          
          {/* DESKTOP SIDEBAR */}
          <aside className="hidden lg:block lg:w-64 flex-shrink-0 sticky top-28 h-fit space-y-12">
            {/* Categories */}
            <div>
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-300 mb-6">Categories</h3>
              {categoriesLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-5 h-5 animate-spin text-zinc-400" />
                </div>
              ) : (
                <div className="space-y-1">
                  <button 
                    onClick={() => handleCategoryChange('all')} 
                    className={`flex items-center justify-between w-full py-2.5 px-4 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all ${
                      selectedCategory === 'all' ? 'bg-zinc-900 text-white' : 'text-zinc-500 hover:bg-zinc-50'
                    }`}
                  >
                    All Products <ChevronRight className="w-3 h-3" />
                  </button>
                  {categories.map((cat) => (
                    <button 
                      key={cat.id} 
                      onClick={() => handleCategoryChange(cat.slug)} 
                      className={`flex items-center justify-between w-full py-2.5 px-4 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all ${
                        selectedCategory === cat.slug ? 'bg-zinc-900 text-white' : 'text-zinc-500 hover:bg-zinc-50'
                      }`}
                    >
                      {cat.name} <ChevronRight className="w-3 h-3" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Price Range */}
            <div className="pt-10 border-t border-zinc-100">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-300 mb-6">Price Range</h3>
              <div className="space-y-4">
                {priceRanges.map((range) => (
                  <label key={range.value} className="flex items-center gap-3 cursor-pointer group">
                    <input 
                      type="radio" 
                      name="price" 
                      checked={selectedPriceRange === range.value} 
                      onChange={() => handlePriceChange(range.value)} 
                      className="w-4 h-4 accent-red-600" 
                    />
                    <span className={`text-[10px] font-bold uppercase tracking-widest ${
                      selectedPriceRange === range.value ? 'text-zinc-900' : 'text-zinc-400'
                    }`}>
                      {range.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </aside>

          {/* MAIN CONTENT */}
          <div className="flex-1">
            {/* Desktop Search & Count */}
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
              <p className="text-[9px] font-black text-zinc-400 uppercase tracking-[0.2em]">
                {totalProductsCount} Products Total
              </p>
            </div>

            {/* Products Grid */}
            {loading ? (
              <div className="h-96 flex flex-col items-center justify-center gap-4">
                <Loader2 className="w-8 h-8 animate-spin text-red-600" />
                <span className="text-[8px] font-black uppercase tracking-widest text-zinc-300">
                  Loading Products
                </span>
              </div>
            ) : products.length === 0 ? (
              <div className="h-96 flex flex-col items-center justify-center gap-4">
                <div className="text-5xl">🔍</div>
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
                  No Products Found
                </span>
                <p className="text-[9px] text-zinc-400 max-w-xs text-center">
                  Try adjusting your filters or search query
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10 lg:gap-x-8 lg:gap-y-14">
                  {products.map((product) => (
                    <div key={product.id} className="group flex flex-col">
                      <Link 
                        href={`/shop/${product.slug}`} 
                        className="relative aspect-square bg-zinc-50 overflow-hidden rounded-[32px] border border-zinc-100 group-hover:shadow-xl transition-shadow duration-300"
                      >
                        {product.image_url ? (
                          <img 
                            src={product.image_url} 
                            alt={product.name} 
                            className="w-full h-full object-cover transition duration-700 group-hover:scale-105" 
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center uppercase font-black text-[8px] text-zinc-300 italic">
                            No Preview
                          </div>
                        )}
                        <div className="absolute inset-0 bg-zinc-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <div className="bg-white text-zinc-900 px-6 py-3 rounded-2xl text-[8px] font-black uppercase tracking-widest flex items-center gap-2">
                            View Details <ArrowUpRight className="w-3 h-3" />
                          </div>
                        </div>
                      </Link>
                      <div className="mt-4 space-y-1">
                        <div className="flex justify-between items-start gap-2">
                          <h3 className="text-base lg:text-xl font-black uppercase tracking-tight italic text-zinc-900 leading-tight line-clamp-2">
                            {product.name}
                          </h3>
                          <p className="text-base lg:text-xl font-black text-red-600 italic flex-shrink-0">
                            ₦{parseFloat(product.base_price).toLocaleString()}
                          </p>
                        </div>
                        <span className="text-[10px] lg:text-xs font-bold uppercase tracking-widest text-zinc-400 bg-zinc-50 px-2 py-1 rounded inline-block">
                          {product.category_name}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* PAGINATION */}
                {totalPages > 1 && (
                  <div className="mt-16 flex items-center justify-center gap-4 border-t border-zinc-100 pt-8">
                    <button 
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(p => p - 1)}
                      className="p-3 rounded-xl border border-zinc-100 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-zinc-50 transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    
                    <div className="flex gap-2">
                      {[...Array(totalPages)].map((_, i) => {
                        const pageNum = i + 1;
                        const showPage = 
                          pageNum === 1 || 
                          pageNum === totalPages || 
                          (pageNum >= currentPage - 1 && pageNum <= currentPage + 1);
                        
                        if (!showPage && pageNum === currentPage - 2) {
                          return <span key={i} className="px-2 text-zinc-400">...</span>;
                        }
                        if (!showPage && pageNum === currentPage + 2) {
                          return <span key={i} className="px-2 text-zinc-400">...</span>;
                        }
                        if (!showPage) return null;

                        return (
                          <button
                            key={i}
                            onClick={() => setCurrentPage(pageNum)}
                            className={`w-10 h-10 rounded-xl text-[10px] font-black transition-all ${
                              currentPage === pageNum 
                                ? 'bg-red-600 text-white' 
                                : 'bg-zinc-50 text-zinc-400 hover:bg-zinc-100'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                    </div>

                    <button 
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage(p => p + 1)}
                      className="p-3 rounded-xl border border-zinc-100 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-zinc-50 transition-colors"
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
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-red-600" />
          <span className="text-[8px] font-black uppercase tracking-widest text-zinc-300">
            Loading Products
          </span>
        </div>
      </div>
    }>
      <ProductsContent />
    </Suspense>
  );
}