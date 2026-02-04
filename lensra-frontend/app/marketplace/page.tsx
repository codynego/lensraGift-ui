"use client";

import { useState, useEffect, useCallback, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  Search, ChevronRight, ArrowUpRight, Filter, Loader2, 
  ChevronLeft, ChevronDown, ChevronUp, X 
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

  const itemsPerPage = 12;
  
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
        // params.append('is_customizable', 'false');
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

  const isSubSelected = (sub: Category, main: Category) => {
    return selectedCategory === sub.slug || (selectedCategory === main.slug && false); // false since 'All in' is separate
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
          className={`flex items-center justify-between w-full py-2.5 px-4 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all ${
            selectedCategory === cat.slug ? 'bg-white text-zinc-900' : 'text-zinc-500 hover:bg-white'
          }`}
          style={{ paddingLeft: `${depth * 16 + 16}px` }}
        >
          {cat.name}
          {hasSubs ? (
            expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
          ) : (
            <ChevronRight className="w-3 h-3" />
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
          className={`flex items-center justify-between w-full py-3 px-4 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all ${
            selectedCategory === cat.slug ? 'bg-zinc-900 text-white' : 'text-zinc-500 hover:bg-zinc-50'
          }`}
          style={{ paddingLeft: `${depth * 16 + 16}px` }}
        >
          {cat.name}
          {hasSubs ? (
            expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
          ) : (
            <ChevronRight className="w-3 h-3" />
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
    `px-5 py-2.5 rounded-full text-[9px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${
      isSelected ? 'bg-red-600 text-white' : 'bg-zinc-100 text-zinc-400'
    }`;

  return (
    <div className="min-h-screen bg-white text-zinc-900">
      
      {/* HEADER */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-zinc-100">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12 py-4 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="flex items-center gap-4 w-full lg:w-auto">
            <h1 className="text-xl lg:text-2xl font-black uppercase tracking-tight italic text-zinc-900">
              Marketplace
            </h1>
            <p className="text-[9px] font-black text-zinc-400 uppercase tracking-[0.2em] hidden lg:block">
              {totalProductsCount} Items
            </p>
          </div>
          <div className="relative w-full lg:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input 
              type="text" 
              placeholder="Search by name, description, or tag..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-50 border-none rounded-2xl py-3 pl-11 pr-4 text-[11px] font-bold focus:ring-2 focus:ring-red-600/20"
            />
          </div>
          <div className="flex items-center gap-4">
            <div className="relative hidden lg:block">
              <select 
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="appearance-none bg-transparent border-none py-3 pr-8 pl-4 text-[10px] font-black uppercase tracking-widest text-zinc-900 cursor-pointer focus:ring-0"
              >
                {sortOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
            </div>
            <button 
              onClick={() => setShowMobileFilters(true)} 
              className="p-3 bg-zinc-50 rounded-xl flex items-center gap-2 lg:hidden"
            >
              <Filter className="w-4 h-4 text-zinc-900" />
            </button>
          </div>
        </div>

        {/* Mobile Category Bars */}
        <div className="lg:hidden px-6 pb-4">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
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
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar mt-2">
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

      {/* MOBILE FILTERS DRAWER */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 bg-black/50 lg:hidden" onClick={() => setShowMobileFilters(false)}>
          <div 
            className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl p-6 space-y-8 max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-300">Filters & Sort</h3>
              <button onClick={() => setShowMobileFilters(false)} className="p-2">
                <X className="w-5 h-5 text-zinc-600" />
              </button>
            </div>

            {/* Sort */}
            <div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-300 mb-4">Sort By</h4>
              <div className="space-y-2">
                {sortOptions.map((opt) => (
                  <label key={opt.value} className="flex items-center gap-3 cursor-pointer group">
                    <input 
                      type="radio" 
                      name="sort-mobile" 
                      checked={sortBy === opt.value} 
                      onChange={() => handleSortChange(opt.value)} 
                      className="w-4 h-4 accent-red-600" 
                    />
                    <span className={`text-[10px] font-bold uppercase tracking-widest ${
                      sortBy === opt.value ? 'text-zinc-900' : 'text-zinc-400'
                    }`}>
                      {opt.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Categories */}
            <div className="pt-6 border-t border-zinc-100">
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

            {/* Tags */}
            <div className="pt-6 border-t border-zinc-100">
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-300 mb-4">Tags</h4>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {tags.map((tag) => (
                  <label key={tag.slug} className="flex items-center gap-3 cursor-pointer group">
                    <input 
                      type="checkbox" 
                      checked={selectedTags.includes(tag.slug)} 
                      onChange={() => {
                        handleTagToggle(tag.slug);
                        // Don't close drawer to allow multiple selections
                      }} 
                      className="w-4 h-4 accent-red-600" 
                    />
                    <span className={`text-[10px] font-bold uppercase tracking-widest ${
                      selectedTags.includes(tag.slug) ? 'text-zinc-900' : 'text-zinc-400'
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
              className="w-full py-3 bg-red-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest"
            >
              Clear All Filters
            </button>
          </div>
        </div>
      )}

      <div className="max-w-[1600px] mx-auto px-6 lg:px-12 py-8 lg:py-12">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          
          {/* DESKTOP SIDEBAR */}
          <aside className="hidden lg:block lg:w-72 flex-shrink-0 sticky top-24 h-fit space-y-12 bg-zinc-50 p-6 rounded-3xl border border-zinc-100">
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
                      selectedCategory === 'all' ? 'bg-white text-zinc-900' : 'text-zinc-500 hover:bg-white'
                    }`}
                  >
                    All Products <ChevronRight className="w-3 h-3" />
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

            {/* Tags */}
            <div className="pt-10 border-t border-zinc-100">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-300 mb-6">Tags</h3>
              {tagsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-5 h-5 animate-spin text-zinc-400" />
                </div>
              ) : (
                <div className="space-y-4 max-h-60 overflow-y-auto">
                  {tags.map((tag) => (
                    <label key={tag.slug} className="flex items-center gap-3 cursor-pointer group">
                      <input 
                        type="checkbox" 
                        checked={selectedTags.includes(tag.slug)} 
                        onChange={() => handleTagToggle(tag.slug)} 
                        className="w-4 h-4 accent-red-600" 
                      />
                      <span className={`text-[10px] font-bold uppercase tracking-widest ${
                        selectedTags.includes(tag.slug) ? 'text-zinc-900' : 'text-zinc-400'
                      }`}>
                        {tag.name}
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            <button 
              onClick={clearAllFilters} 
              className="w-full py-3 bg-red-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest mt-8"
            >
              Clear Filters
            </button>
          </aside>

          {/* MAIN CONTENT */}
          <div className="flex-1">
            {/* Products Grid */}
            {loading ? (
              <div className="h-96 flex flex-col items-center justify-center gap-4">
                <Loader2 className="w-8 h-8 animate-spin text-red-600" />
                <span className="text-[8px] font-black uppercase tracking-widest text-zinc-300">
                  Loading Marketplace
                </span>
              </div>
            ) : products.length === 0 ? (
              <div className="h-96 flex flex-col items-center justify-center gap-4">
                <div className="text-5xl">🔍</div>
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
                  No Items Found
                </span>
                <p className="text-[9px] text-zinc-400 max-w-xs text-center">
                  Try different search terms or filters
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
                  {products.map((product) => (
                    <div key={product.id} className="group flex flex-col bg-white border border-zinc-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
                      <Link 
                        href={`/shop/${product.slug}`} 
                        className="relative aspect-[4/5] overflow-hidden"
                      >
                        {product.image_url ? (
                          <img 
                            src={product.image_url} 
                            alt={product.name} 
                            className="w-full h-full object-cover transition duration-500 group-hover:scale-105" 
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center uppercase font-black text-[8px] text-zinc-300 italic bg-zinc-50">
                            No Image
                          </div>
                        )}
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-zinc-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex justify-center">
                          <div className="bg-white text-zinc-900 px-4 py-2 rounded-full text-[8px] font-black uppercase tracking-widest flex items-center gap-1">
                            View <ArrowUpRight className="w-3 h-3" />
                          </div>
                        </div>
                      </Link>
                      <div className="p-4 space-y-1">
                        <div className="flex justify-between items-baseline gap-2">
                          <h3 className="text-base font-black uppercase tracking-tight italic text-zinc-900 leading-tight line-clamp-1">
                            {product.name}
                          </h3>
                          <p className="text-base font-black text-red-600 italic flex-shrink-0">
                            ₦{parseFloat(product.base_price).toLocaleString()}
                          </p>
                        </div>
                        <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-400">
                          {product.category_path}
                        </span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {product.tags.map((tag) => (
                            <span 
                              key={tag.slug} 
                              className="text-[8px] bg-zinc-100 px-2 py-0.5 rounded-full text-zinc-600 font-bold uppercase"
                            >
                              {tag.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* PAGINATION */}
                {totalPages > 1 && (
                  <div className="mt-12 flex items-center justify-center gap-2">
                    <button 
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(p => p - 1)}
                      className="px-4 py-2 rounded-full border border-zinc-100 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-zinc-50 transition-colors text-[10px] font-black uppercase"
                    >
                      <ChevronLeft className="w-4 h-4 inline" /> Prev
                    </button>
                    
                    <div className="flex gap-1">
                      {[...Array(totalPages)].map((_, i) => {
                        const pageNum = i + 1;
                        const isCurrent = currentPage === pageNum;
                        if (pageNum > 2 && pageNum < currentPage - 1) return null;
                        if (pageNum < totalPages - 1 && pageNum > currentPage + 1) return null;
                        if (pageNum === currentPage - 2 || pageNum === currentPage + 2) {
                          return <span key={i} className="px-3 py-2 text-zinc-400">...</span>;
                        }
                        return (
                          <button
                            key={i}
                            onClick={() => setCurrentPage(pageNum)}
                            className={`px-4 py-2 rounded-full text-[10px] font-black transition-all ${
                              isCurrent 
                                ? 'bg-red-600 text-white' 
                                : 'bg-zinc-50 text-zinc-900 hover:bg-zinc-100'
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
                      className="px-4 py-2 rounded-full border border-zinc-100 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-zinc-50 transition-colors text-[10px] font-black uppercase"
                    >
                      Next <ChevronRight className="w-4 h-4 inline" />
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

export default function MarketplacePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-red-600" />
          <span className="text-[8px] font-black uppercase tracking-widest text-zinc-300">
            Loading Marketplace
          </span>
        </div>
      </div>
    }>
      <ProductsContent />
    </Suspense>
  );
}