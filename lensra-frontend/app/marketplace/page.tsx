"use client";

import { useState, useEffect, useCallback, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  Search, ChevronRight, ArrowUpRight, Filter, Loader2, 
  ChevronLeft, ChevronDown, ChevronUp, X, Package, Tag as TagIcon,
  Eye, Heart, TrendingUp, Star
} from 'lucide-react';

const BaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.lensra.com/";

interface Product {
  id: number;
  name: string;
  slug: string;
  base_price: string;
  image_url: string | null;
  category_path: string;
  tags: Tag[];
  is_active: boolean;
}

interface Category {
  id: number;
  name: string;
  slug: string;
  parent_id?: number;
  parent_name?: string | null;
  subcategories?: Category[];
  full_path: string;
}

interface Tag {
  name: string;
  slug: string;
}

interface PriceRange {
  label: string;
  value: string;
  min?: number;
  max?: number;
}

interface SortOption {
  label: string;
  value: string;
  ordering: string;
}

function ProductsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [topLevelCategories, setTopLevelCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [tagsLoading, setTagsLoading] = useState(true);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPriceRange, setSelectedPriceRange] = useState('all');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('featured');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalProductsCount, setTotalProductsCount] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const itemsPerPage = 12;
  
  // Handle scroll to top button visibility
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const priceRanges: PriceRange[] = [
    { label: "Any Price", value: "all" },
    { label: "Under ₦3,000", value: "under-3k", min: 0, max: 2999 },
    { label: "₦3,000 - ₦5,000", value: "3k-5k", min: 3000, max: 5000 },
    { label: "Over ₦5,000", value: "over-5k", min: 5001, max: 1000000 },
  ];

  const sortOptions: SortOption[] = [
    { label: "Featured", value: "featured", ordering: "" },
    { label: "Price: Low to High", value: "price_asc", ordering: "base_price" },
    { label: "Price: High to Low", value: "price_desc", ordering: "-base_price" },
    { label: "Newest", value: "newest", ordering: "-created_at" },
  ];

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setCategoriesLoading(true);
        const response = await fetch(`${BaseUrl}api/products/categories/`);
        const data = await response.json();
        
        const categoriesArray = Array.isArray(data) ? data : (data.results ? data.results : []);
        setCategories(categoriesArray);
        setTopLevelCategories(categoriesArray.filter((cat: Category) => !cat.parent_id));
      } catch (err) {
        console.error("Categories Fetch Error:", err);
        setCategories([]);
        setTopLevelCategories([]);
      } finally {
        setCategoriesLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Fetch tags on mount
  useEffect(() => {
    const fetchTags = async () => {
      try {
        setTagsLoading(true);
        const response = await fetch(`${BaseUrl}api/products/tags/`);
        const data = await response.json();
        
        const tagsArray = Array.isArray(data) ? data : (data.results ? data.results : []);
        setTags(tagsArray);
      } catch (err) {
        console.error("Tags Fetch Error:", err);
        setTags([]);
      } finally {
        setTagsLoading(false);
      }
    };

    fetchTags();
  }, []);

  // Initialize state from URL params
  useEffect(() => {
    const q = searchParams.get('q') || '';
    const category = searchParams.get('category') || 'all';
    const price = searchParams.get('price') || 'all';
    const tagsParam = searchParams.get('tags') || '';
    const sort = searchParams.get('sort') || 'featured';
    const page = Number(searchParams.get('page')) || 1;

    setSearchQuery(q);
    setSelectedCategory(category);
    setSelectedPriceRange(price);
    setSelectedTags(tagsParam ? tagsParam.split(',') : []);
    setSortBy(sort);
    setCurrentPage(page);
  }, [searchParams]);

  // Fetch products when filters change
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        
        if (searchQuery) params.append('search', searchQuery);
        
        if (selectedCategory !== 'all') {
          params.append('category', selectedCategory); 
        }
        const range = priceRanges.find(r => r.value === selectedPriceRange);
        if (range && range.min !== undefined) {
          params.append('min_price', range.min.toString());
        }
        if (range && range.max !== undefined) {
          params.append('max_price', range.max.toString());
        }
        if (selectedTags.length > 0) {
          params.append('tags', selectedTags.join(','));
        }
        const sortOpt = sortOptions.find(s => s.value === sortBy);
        if (sortOpt && sortOpt.ordering) {
          params.append('ordering', sortOpt.ordering);
        }
        params.append('page', currentPage.toString());
        params.append('page_size', itemsPerPage.toString());

        const url = `${BaseUrl}api/products/?${params.toString()}`;
        
        const response = await fetch(url);
        const data = await response.json();
        
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
  }, [searchQuery, selectedCategory, selectedPriceRange, selectedTags, sortBy, currentPage]);

  // Update URL when filters change
  const updateURL = useCallback(() => {
    const params = new URLSearchParams();

    if (searchQuery) params.set('q', searchQuery);
    if (selectedCategory !== 'all') params.set('category', selectedCategory);
    if (selectedPriceRange !== 'all') params.set('price', selectedPriceRange);
    if (selectedTags.length > 0) params.set('tags', selectedTags.join(','));
    if (sortBy !== 'featured') params.set('sort', sortBy);
    if (currentPage > 1) params.set('page', currentPage.toString());

    const newUrl = params.toString() ? `/marketplace?${params.toString()}` : '/marketplace';
    router.push(newUrl, { scroll: false });
  }, [searchQuery, selectedCategory, selectedPriceRange, selectedTags, sortBy, currentPage, router]);

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

  const handleTagToggle = (slug: string) => {
    setSelectedTags(prev => 
      prev.includes(slug) ? prev.filter(s => s !== slug) : [...prev, slug]
    );
    setCurrentPage(1);
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
    setCurrentPage(1);
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedPriceRange('all');
    setSelectedTags([]);
    setSortBy('featured');
    setCurrentPage(1);
  };

  const findTopLevelForSlug = (slug: string): Category | null => {
    if (slug === 'all') return null;
    for (const cat of topLevelCategories) {
      if (cat.slug === slug) return cat;
      if (cat.subcategories) {
        const foundInSub = cat.subcategories.find(sub => sub.slug === slug);
        if (foundInSub) return cat;
        for (const sub of cat.subcategories) {
          if (sub.subcategories?.find(subsub => subsub.slug === slug)) return cat;
        }
      }
    }
    return null;
  };

  const selectedMainCat = findTopLevelForSlug(selectedCategory);

  const isTopLevelSelected = (cat: Category) => {
    if (selectedCategory === 'all') return false;
    if (selectedCategory === cat.slug) return true;
    const main = selectedMainCat;
    return main?.slug === cat.slug;
  };

  interface CategoryItemProps {
    cat: Category;
    depth?: number;
    selectedCategory: string;
    onSelect: (slug: string) => void;
  }

  const CategoryItem: React.FC<CategoryItemProps> = ({ cat, depth = 0, selectedCategory, onSelect }) => {
    const [expanded, setExpanded] = useState(false);
    const hasSubs = cat.subcategories && cat.subcategories.length > 0;

    return (
      <>
        <button 
          onClick={() => {
            onSelect(cat.slug);
            if (hasSubs) setExpanded(!expanded);
          }} 
          className={`flex items-center justify-between w-full py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wide transition-all ${
            selectedCategory === cat.slug 
              ? 'bg-zinc-900 text-white shadow-md' 
              : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900'
          }`}
          style={{ paddingLeft: `${depth * 16 + 16}px` }}
        >
          <span className="text-left">{cat.name}</span>
          {hasSubs ? (
            expanded ? <ChevronUp className="w-3.5 h-3.5 flex-shrink-0" /> : <ChevronDown className="w-3.5 h-3.5 flex-shrink-0" />
          ) : (
            <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" />
          )}
        </button>
        {expanded && hasSubs && cat.subcategories?.map(sub => (
          <CategoryItem 
            key={sub.id} 
            cat={sub} 
            depth={depth + 1} 
            selectedCategory={selectedCategory}
            onSelect={onSelect} 
          />
        ))}
      </>
    );
  };

  const MobileCategoryItem: React.FC<CategoryItemProps> = ({ cat, depth = 0, selectedCategory, onSelect }) => {
    const [expanded, setExpanded] = useState(false);
    const hasSubs = cat.subcategories && cat.subcategories.length > 0;

    return (
      <>
        <button 
          onClick={() => {
            onSelect(cat.slug);
            if (hasSubs) setExpanded(!expanded);
          }} 
          className={`flex items-center justify-between w-full py-3.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wide transition-all ${
            selectedCategory === cat.slug ? 'bg-zinc-900 text-white' : 'text-zinc-600 hover:bg-zinc-100'
          }`}
          style={{ paddingLeft: `${depth * 16 + 16}px` }}
        >
          <span className="text-left">{cat.name}</span>
          {hasSubs ? (
            expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />
          ) : (
            <ChevronRight className="w-3.5 h-3.5" />
          )}
        </button>
        {expanded && hasSubs && cat.subcategories?.map(sub => (
          <MobileCategoryItem 
            key={sub.id} 
            cat={sub} 
            depth={depth + 1} 
            selectedCategory={selectedCategory}
            onSelect={onSelect} 
          />
        ))}
      </>
    );
  };

  const categoryButtonClass = (isSelected: boolean) => 
    `px-6 py-3 rounded-full text-xs font-black uppercase tracking-wide whitespace-nowrap transition-all shadow-sm ${
      isSelected 
        ? 'bg-red-600 text-white shadow-md hover:bg-red-700' 
        : 'bg-zinc-100 text-zinc-500 hover:bg-zinc-200 hover:text-zinc-700'
    }`;

  // Active filter count
  const activeFilterCount = 
    (selectedCategory !== 'all' ? 1 : 0) +
    (selectedPriceRange !== 'all' ? 1 : 0) +
    selectedTags.length;

  return (
    <div className="min-h-screen bg-white text-zinc-900">
      
      {/* ENHANCED HEADER */}
      <div className="bg-white/95 backdrop-blur-lg border-b border-zinc-200 shadow-sm lg:sticky lg:top-0 lg:z-40">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12 py-6">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="flex items-center gap-6 w-full lg:w-auto">
              <div>
                <h1 className="text-3xl lg:text-4xl font-black uppercase tracking-tight italic text-zinc-900 leading-none mb-1">
                  Marketplace
                </h1>
                <p className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                  {totalProductsCount} {totalProductsCount === 1 ? 'Item' : 'Items'} Available
                </p>
              </div>
            </div>
            
            <div className="relative w-full lg:w-[500px]">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
              <input 
                type="text" 
                placeholder="Search by name, description, or tag..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl py-4 pl-14 pr-5 text-sm font-semibold placeholder:text-zinc-400 focus:outline-none focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-900 p-1 hover:bg-zinc-200 rounded-lg transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            
            <div className="flex items-center gap-4 w-full lg:w-auto">
              <div className="relative hidden lg:block flex-1 lg:flex-none">
                <select 
                  value={sortBy}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="appearance-none bg-white border border-zinc-200 rounded-xl py-3 pr-12 pl-5 text-xs font-bold uppercase tracking-wide text-zinc-900 cursor-pointer focus:outline-none focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition-all shadow-sm hover:border-zinc-300"
                >
                  {sortOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
              </div>
              
              <button 
                onClick={() => setShowMobileFilters(true)} 
                className="flex items-center gap-3 px-5 py-3 bg-zinc-900 text-white rounded-xl lg:hidden shadow-md hover:bg-zinc-800 transition-all relative"
              >
                <Filter className="w-4 h-4" />
                <span className="font-bold text-xs uppercase tracking-wide">Filters</span>
                {activeFilterCount > 0 && (
                  <span className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs font-black flex items-center justify-center shadow-lg">
                    {activeFilterCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Enhanced Mobile Category Bars */}
        <div className="lg:hidden px-6 pb-5 border-t border-zinc-100 pt-4 mt-4">
          <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-1">
            <button 
              onClick={() => handleCategoryChange('all')} 
              className={categoryButtonClass(selectedCategory === 'all')}
            >
              All
            </button>
            {topLevelCategories.map((cat) => (
              <button 
                key={cat.id} 
                onClick={() => handleCategoryChange(cat.slug)} 
                className={categoryButtonClass(isTopLevelSelected(cat))}
              >
                {cat.name}
              </button>
            ))}
          </div>
          {selectedMainCat && selectedMainCat.subcategories && selectedMainCat.subcategories.length > 0 && (
            <div className="flex items-center gap-3 overflow-x-auto no-scrollbar mt-3 pb-1">
              <button 
                onClick={() => handleCategoryChange(selectedMainCat.slug)} 
                className={categoryButtonClass(selectedCategory === selectedMainCat.slug)}
              >
                All in {selectedMainCat.name}
              </button>
              {selectedMainCat.subcategories.map((sub) => (
                <button 
                  key={sub.id} 
                  onClick={() => handleCategoryChange(sub.slug)} 
                  className={categoryButtonClass(selectedCategory === sub.slug)}
                >
                  {sub.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ENHANCED MOBILE FILTERS DRAWER */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 bg-black/60 lg:hidden backdrop-blur-sm" onClick={() => setShowMobileFilters(false)}>
          <div 
            className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl p-7 space-y-8 max-h-[85vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
              <h3 className="text-lg font-black uppercase tracking-tight text-zinc-900">Filters & Sort</h3>
              <button onClick={() => setShowMobileFilters(false)} className="p-2 hover:bg-zinc-100 rounded-xl transition-all">
                <X className="w-6 h-6 text-zinc-600" />
              </button>
            </div>

            {/* Sort */}
            <div>
              <h4 className="text-xs font-black uppercase tracking-wider text-zinc-400 mb-4 flex items-center gap-2">
                <ArrowUpRight className="w-3.5 h-3.5" />
                Sort By
              </h4>
              <div className="space-y-2">
                {sortOptions.map((opt) => (
                  <label key={opt.value} className="flex items-center gap-4 p-3 rounded-xl cursor-pointer group hover:bg-zinc-50 transition-all">
                    <input 
                      type="radio" 
                      name="sort-mobile" 
                      checked={sortBy === opt.value} 
                      onChange={() => handleSortChange(opt.value)} 
                      className="w-5 h-5 accent-red-600" 
                    />
                    <span className={`text-sm font-semibold ${
                      sortBy === opt.value ? 'text-zinc-900' : 'text-zinc-500'
                    }`}>
                      {opt.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Categories */}
            <div className="pt-6 border-t border-zinc-100">
              <h4 className="text-xs font-black uppercase tracking-wider text-zinc-400 mb-4 flex items-center gap-2">
                <Package className="w-3.5 h-3.5" />
                Categories
              </h4>
              <div className="space-y-2">
                <button 
                  onClick={() => {
                    handleCategoryChange('all');
                    setShowMobileFilters(false);
                  }} 
                  className={`flex items-center justify-between w-full py-3.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wide transition-all ${
                    selectedCategory === 'all' ? 'bg-zinc-900 text-white' : 'text-zinc-600 hover:bg-zinc-100'
                  }`}
                >
                  All Products <ChevronRight className="w-3.5 h-3.5" />
                </button>
                {categories.map((cat) => (
                  <MobileCategoryItem 
                    key={cat.id} 
                    cat={cat} 
                    selectedCategory={selectedCategory}
                    onSelect={(slug) => {
                      handleCategoryChange(slug);
                      setShowMobileFilters(false);
                    }} 
                  />
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div className="pt-6 border-t border-zinc-100">
              <h4 className="text-xs font-black uppercase tracking-wider text-zinc-400 mb-4">Price Range</h4>
              <div className="space-y-2">
                {priceRanges.map((range) => (
                  <label key={range.value} className="flex items-center gap-4 p-3 rounded-xl cursor-pointer group hover:bg-zinc-50 transition-all">
                    <input 
                      type="radio" 
                      name="price-mobile" 
                      checked={selectedPriceRange === range.value} 
                      onChange={() => {
                        handlePriceChange(range.value);
                        setShowMobileFilters(false);
                      }} 
                      className="w-5 h-5 accent-red-600" 
                    />
                    <span className={`text-sm font-semibold ${
                      selectedPriceRange === range.value ? 'text-zinc-900' : 'text-zinc-500'
                    }`}>
                      {range.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div className="pt-6 border-t border-zinc-100">
              <h4 className="text-xs font-black uppercase tracking-wider text-zinc-400 mb-4 flex items-center gap-2">
                <TagIcon className="w-3.5 h-3.5" />
                Tags
              </h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {tags.map((tag) => (
                  <label key={tag.slug} className="flex items-center gap-4 p-3 rounded-xl cursor-pointer group hover:bg-zinc-50 transition-all">
                    <input 
                      type="checkbox" 
                      checked={selectedTags.includes(tag.slug)} 
                      onChange={() => handleTagToggle(tag.slug)} 
                      className="w-5 h-5 accent-red-600 rounded" 
                    />
                    <span className={`text-sm font-semibold ${
                      selectedTags.includes(tag.slug) ? 'text-zinc-900' : 'text-zinc-500'
                    }`}>
                      {tag.name}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <button 
              onClick={() => {
                clearAllFilters();
                setShowMobileFilters(false);
              }} 
              className="w-full py-4 bg-red-600 text-white rounded-xl text-sm font-black uppercase tracking-wide hover:bg-red-700 transition-all shadow-lg"
            >
              Clear All Filters
            </button>
          </div>
        </div>
      )}

      <div className="max-w-[1600px] mx-auto px-6 lg:px-12 py-10 lg:py-12">
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-12">
          
          {/* ENHANCED DESKTOP SIDEBAR */}
          <aside className="hidden lg:block lg:w-80 flex-shrink-0 sticky top-32 h-fit space-y-10 bg-white border border-zinc-200 p-7 rounded-3xl shadow-sm">
            {/* Categories */}
            <div>
              <h3 className="text-xs font-black uppercase tracking-wider text-zinc-400 mb-6 flex items-center gap-2">
                <Package className="w-4 h-4" />
                Categories
              </h3>
              {categoriesLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-6 h-6 animate-spin text-zinc-400" />
                </div>
              ) : (
                <div className="space-y-1.5">
                  <button 
                    onClick={() => handleCategoryChange('all')} 
                    className={`flex items-center justify-between w-full py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wide transition-all ${
                      selectedCategory === 'all' 
                        ? 'bg-zinc-900 text-white shadow-md' 
                        : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900'
                    }`}
                  >
                    <span>All Products</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                  {categories.map((cat) => (
                    <CategoryItem 
                      key={cat.id} 
                      cat={cat} 
                      selectedCategory={selectedCategory}
                      onSelect={handleCategoryChange} 
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Price Range */}
            <div className="pt-8 border-t border-zinc-100">
              <h3 className="text-xs font-black uppercase tracking-wider text-zinc-400 mb-6">Price Range</h3>
              <div className="space-y-2">
                {priceRanges.map((range) => (
                  <label key={range.value} className="flex items-center gap-4 p-3 rounded-xl cursor-pointer group hover:bg-zinc-50 transition-all">
                    <input 
                      type="radio" 
                      name="price" 
                      checked={selectedPriceRange === range.value} 
                      onChange={() => handlePriceChange(range.value)} 
                      className="w-5 h-5 accent-red-600" 
                    />
                    <span className={`text-sm font-semibold ${
                      selectedPriceRange === range.value ? 'text-zinc-900' : 'text-zinc-500'
                    }`}>
                      {range.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div className="pt-8 border-t border-zinc-100">
              <h3 className="text-xs font-black uppercase tracking-wider text-zinc-400 mb-6 flex items-center gap-2">
                <TagIcon className="w-4 h-4" />
                Tags
              </h3>
              {tagsLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-6 h-6 animate-spin text-zinc-400" />
                </div>
              ) : (
                <div className="space-y-2 max-h-72 overflow-y-auto pr-2">
                  {tags.map((tag) => (
                    <label key={tag.slug} className="flex items-center gap-4 p-3 rounded-xl cursor-pointer group hover:bg-zinc-50 transition-all">
                      <input 
                        type="checkbox" 
                        checked={selectedTags.includes(tag.slug)} 
                        onChange={() => handleTagToggle(tag.slug)} 
                        className="w-5 h-5 accent-red-600 rounded" 
                      />
                      <span className={`text-sm font-semibold ${
                        selectedTags.includes(tag.slug) ? 'text-zinc-900' : 'text-zinc-500'
                      }`}>
                        {tag.name}
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {activeFilterCount > 0 && (
              <button 
                onClick={clearAllFilters} 
                className="w-full py-4 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl text-sm font-bold uppercase tracking-wide mt-8 transition-all shadow-md hover:shadow-lg"
              >
                Clear Filters ({activeFilterCount})
              </button>
            )}
          </aside>

          {/* ENHANCED MAIN CONTENT */}
          <div className="flex-1">
            {loading ? (
              <div className="h-[500px] flex flex-col items-center justify-center gap-6">
                <Loader2 className="w-10 h-10 animate-spin text-red-600" />
                <div className="text-center">
                  <p className="text-sm font-bold uppercase tracking-wide text-zinc-400">
                    Loading Marketplace
                  </p>
                  <p className="text-xs text-zinc-400 mt-1">Please wait...</p>
                </div>
              </div>
            ) : products.length === 0 ? (
              <div className="h-[500px] flex flex-col items-center justify-center gap-6 px-6">
                <div className="w-20 h-20 bg-zinc-100 rounded-full flex items-center justify-center">
                  <div className="text-4xl">🔍</div>
                </div>
                <div className="text-center max-w-md">
                  <h3 className="text-2xl font-black uppercase tracking-tight text-zinc-900 mb-2">
                    No Items Found
                  </h3>
                  <p className="text-sm text-zinc-500 mb-6">
                    We couldn't find any products matching your criteria. Try adjusting your filters or search query.
                  </p>
                  <button
                    onClick={clearAllFilters}
                    className="px-8 py-4 bg-red-600 text-white rounded-xl text-sm font-bold uppercase tracking-wide hover:bg-red-700 transition-all shadow-lg hover:shadow-xl"
                  >
                    Clear All Filters
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 lg:gap-6">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {/* ENHANCED PAGINATION */}
                {totalPages > 1 && (
                  <div className="mt-16 flex items-center justify-center gap-3">
                    <button 
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(p => p - 1)}
                      className="px-6 py-3 rounded-xl border border-zinc-200 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-zinc-50 hover:border-zinc-300 transition-all text-sm font-bold uppercase flex items-center gap-2 shadow-sm"
                    >
                      <ChevronLeft className="w-4 h-4" /> Prev
                    </button>
                    
                    <div className="flex gap-2">
                      {[...Array(totalPages)].map((_, i) => {
                        const pageNum = i + 1;
                        const isCurrent = currentPage === pageNum;
                        if (pageNum > 2 && pageNum < currentPage - 1) return null;
                        if (pageNum < totalPages - 1 && pageNum > currentPage + 1) return null;
                        if (pageNum === currentPage - 2 || pageNum === currentPage + 2) {
                          return <span key={i} className="px-4 py-3 text-zinc-400 font-bold">...</span>;
                        }
                        return (
                          <button
                            key={i}
                            onClick={() => setCurrentPage(pageNum)}
                            className={`px-5 py-3 rounded-xl text-sm font-bold transition-all ${
                              isCurrent 
                                ? 'bg-red-600 text-white shadow-md hover:bg-red-700' 
                                : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200 border border-zinc-200'
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
                      className="px-6 py-3 rounded-xl border border-zinc-200 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-zinc-50 hover:border-zinc-300 transition-all text-sm font-bold uppercase flex items-center gap-2 shadow-sm"
                    >
                      Next <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Floating Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 w-14 h-14 bg-red-600 text-white rounded-full shadow-2xl hover:bg-red-700 transition-all duration-300 flex items-center justify-center group hover:scale-110 active:scale-95"
          aria-label="Scroll to top"
        >
          <ChevronUp className="w-6 h-6 group-hover:translate-y-[-2px] transition-transform" />
        </button>
      )}
    </div>
  );
}

// Product Card Component
function ProductCard({ product }: { product: Product }) {
  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <div className="group flex flex-col bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:border-zinc-300 transition-all duration-300">
      <Link 
        href={`/shop/${product.slug}`} 
        className="relative aspect-[3/4] overflow-hidden bg-gradient-to-br from-zinc-50 to-zinc-100"
      >
        {product.image_url ? (
          <img 
            src={product.image_url} 
            alt={product.name} 
            className="w-full h-full object-cover transition duration-700 group-hover:scale-110" 
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center uppercase font-black text-xs text-zinc-300 italic">
            No Image
          </div>
        )}
        
        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Quick view button */}
        <div className="absolute bottom-4 left-4 right-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <div className="bg-white text-zinc-900 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wide flex items-center justify-center gap-2 shadow-xl hover:bg-red-500 hover:text-white transition-colors">
            <Eye className="w-3.5 h-3.5" />
            Quick View
          </div>
        </div>

        {/* Favorite button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            setIsFavorite(!isFavorite);
          }}
          className="absolute top-4 right-4 w-10 h-10 bg-white/95 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white transition-all opacity-0 group-hover:opacity-100 shadow-lg hover:scale-110"
        >
          <Heart className={`w-4 h-4 transition-all ${isFavorite ? 'fill-red-500 text-red-500' : 'text-zinc-400'}`} />
        </button>
      </Link>
      
      <div className="p-4 space-y-2">
        <div className="mb-1">
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 block mb-1">
            {product.category_path}
          </span>
          <h3 className="font-bold text-zinc-900 leading-tight line-clamp-2 group-hover:text-red-600 transition-colors text-base min-h-[2.5rem]">
            {product.name}
          </h3>
        </div>
        <p className="text-xl font-black text-red-600 italic">
          ₦{parseFloat(product.base_price).toLocaleString()}
        </p>
      </div>
    </div>
  );
}

export default function MarketplacePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-6">
          <Loader2 className="w-10 h-10 animate-spin text-red-600" />
          <div className="text-center">
            <p className="text-sm font-bold uppercase tracking-wide text-zinc-400">
              Loading Marketplace
            </p>
            <p className="text-xs text-zinc-400 mt-1">Please wait...</p>
          </div>
        </div>
      </div>
    }>
      <ProductsContent />
    </Suspense>
  );
}