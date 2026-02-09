"use client";

import { useState, useEffect, useCallback, Suspense, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  Search, ChevronRight, ArrowUpRight, Filter, Loader2, 
  ChevronLeft, ChevronDown, ChevronUp, X, Package, Tag as TagIcon,
  Eye, Heart, Zap, ShoppingBag
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

    const newUrl = params.toString() ? `/shop?${params.toString()}` : '/shop';
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
          className={`flex items-center justify-between w-full py-3 px-4 rounded-xl text-sm font-bold transition-all ${
            selectedCategory === cat.slug 
              ? 'bg-red-600 text-white shadow-md' 
              : 'text-black hover:bg-gray-100'
          }`}
          style={{ paddingLeft: `${depth * 16 + 16}px` }}
        >
          <span className="text-left">{cat.name}</span>
          {hasSubs ? (
            expanded ? <ChevronUp className="w-4 h-4 flex-shrink-0" /> : <ChevronDown className="w-4 h-4 flex-shrink-0" />
          ) : (
            <ChevronRight className="w-4 h-4 flex-shrink-0" />
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
          className={`flex items-center justify-between w-full py-3.5 px-4 rounded-xl text-sm font-bold transition-all ${
            selectedCategory === cat.slug ? 'bg-red-600 text-white' : 'text-black hover:bg-gray-100'
          }`}
          style={{ paddingLeft: `${depth * 16 + 16}px` }}
        >
          <span className="text-left">{cat.name}</span>
          {hasSubs ? (
            expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
          ) : (
            <ChevronRight className="w-4 h-4" />
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
    `px-6 py-3 rounded-full text-sm font-bold whitespace-nowrap transition-all shadow-sm ${
      isSelected 
        ? 'bg-red-600 text-white shadow-md hover:bg-red-700' 
        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
    }`;

  // Active filter count
  const activeFilterCount = 
    (selectedCategory !== 'all' ? 1 : 0) +
    (selectedPriceRange !== 'all' ? 1 : 0) +
    selectedTags.length;

  // Improved pagination items generation
  const generatePaginationItems = () => {
    const pagesToShow: (number | string)[] = [];

    if (totalPages <= 1) return [];

    // Add first page
    pagesToShow.push(1);

    // Add left ellipsis if needed
    if (currentPage > 3) {
      pagesToShow.push('left-ellipsis');
    }

    // Add pages around current
    const start = Math.max(2, currentPage - 2);
    const end = Math.min(totalPages - 1, currentPage + 2);
    for (let i = start; i <= end; i++) {
      pagesToShow.push(i);
    }

    // Add right ellipsis if needed
    if (currentPage < totalPages - 2) {
      pagesToShow.push('right-ellipsis');
    }

    // Add last page if not already included
    if (totalPages > 1 && !pagesToShow.includes(totalPages)) {
      pagesToShow.push(totalPages);
    }

    return pagesToShow;
  };

  const paginationItems = generatePaginationItems();

  return (
    <div className="min-h-screen bg-white text-black">
      
      {/* HEADER */}
      <div className="bg-white border-b-2 border-gray-200 lg:sticky lg:top-0 lg:z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="flex items-center gap-6 w-full lg:w-auto">
              <div>
                <h1 className="text-4xl lg:text-5xl font-black text-black leading-none mb-2">
                  Shop All Gifts
                </h1>
                <p className="text-sm font-bold text-gray-600">
                  {totalProductsCount} {totalProductsCount === 1 ? 'Product' : 'Products'}
                </p>
              </div>
            </div>
            
            <div className="relative w-full lg:w-[500px]">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-50 border-2 border-gray-200 rounded-2xl py-4 pl-14 pr-5 text-base font-medium placeholder:text-gray-400 focus:outline-none focus:border-red-600 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black p-1 hover:bg-gray-200 rounded-lg transition-all"
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
                  className="appearance-none bg-white border-2 border-gray-200 rounded-xl py-3 pr-12 pl-5 text-sm font-bold text-black cursor-pointer focus:outline-none focus:border-red-600 transition-all"
                >
                  {sortOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
              
              <button 
                onClick={() => setShowMobileFilters(true)} 
                className="flex items-center gap-3 px-5 py-3 bg-black text-white rounded-xl lg:hidden shadow-md hover:bg-gray-900 transition-all relative"
              >
                <Filter className="w-4 h-4" />
                <span className="font-bold text-sm">Filters</span>
                {activeFilterCount > 0 && (
                  <span className="absolute -top-2 -right-2 w-6 h-6 bg-red-600 text-white rounded-full text-xs font-black flex items-center justify-center">
                    {activeFilterCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Category Bars */}
        <div className="lg:hidden px-4 sm:px-6 pb-5 border-t-2 border-gray-200 pt-4 mt-4">
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

      {/* MOBILE FILTERS DRAWER */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 bg-black/60 lg:hidden backdrop-blur-sm" onClick={() => setShowMobileFilters(false)}>
          <div 
            className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl p-7 space-y-8 max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b-2 border-gray-200">
              <h3 className="text-xl font-black text-black">Filters & Sort</h3>
              <button onClick={() => setShowMobileFilters(false)} className="p-2 hover:bg-gray-100 rounded-xl transition-all">
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            {/* Sort */}
            <div>
              <h4 className="text-sm font-black uppercase text-gray-600 mb-4 flex items-center gap-2">
                <ArrowUpRight className="w-4 h-4" />
                Sort By
              </h4>
              <div className="space-y-2">
                {sortOptions.map((opt) => (
                  <label key={opt.value} className="flex items-center gap-4 p-3 rounded-xl cursor-pointer group hover:bg-gray-50 transition-all">
                    <input 
                      type="radio" 
                      name="sort-mobile" 
                      checked={sortBy === opt.value} 
                      onChange={() => handleSortChange(opt.value)} 
                      className="w-5 h-5 accent-red-600" 
                    />
                    <span className={`text-base font-semibold ${
                      sortBy === opt.value ? 'text-black' : 'text-gray-600'
                    }`}>
                      {opt.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Categories */}
            <div className="pt-6 border-t-2 border-gray-200">
              <h4 className="text-sm font-black uppercase text-gray-600 mb-4 flex items-center gap-2">
                <Package className="w-4 h-4" />
                Categories
              </h4>
              <div className="space-y-2">
                <button 
                  onClick={() => {
                    handleCategoryChange('all');
                    setShowMobileFilters(false);
                  }} 
                  className={`flex items-center justify-between w-full py-3.5 px-4 rounded-xl text-sm font-bold transition-all ${
                    selectedCategory === 'all' ? 'bg-red-600 text-white' : 'text-black hover:bg-gray-100'
                  }`}
                >
                  All Products <ChevronRight className="w-4 h-4" />
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
            <div className="pt-6 border-t-2 border-gray-200">
              <h4 className="text-sm font-black uppercase text-gray-600 mb-4">Price Range</h4>
              <div className="space-y-2">
                {priceRanges.map((range) => (
                  <label key={range.value} className="flex items-center gap-4 p-3 rounded-xl cursor-pointer group hover:bg-gray-50 transition-all">
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
                    <span className={`text-base font-semibold ${
                      selectedPriceRange === range.value ? 'text-black' : 'text-gray-600'
                    }`}>
                      {range.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div className="pt-6 border-t-2 border-gray-200">
              <h4 className="text-sm font-black uppercase text-gray-600 mb-4 flex items-center gap-2">
                <TagIcon className="w-4 h-4" />
                Tags
              </h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {tags.map((tag) => (
                  <label key={tag.slug} className="flex items-center gap-4 p-3 rounded-xl cursor-pointer group hover:bg-gray-50 transition-all">
                    <input 
                      type="checkbox" 
                      checked={selectedTags.includes(tag.slug)} 
                      onChange={() => handleTagToggle(tag.slug)} 
                      className="w-5 h-5 accent-red-600 rounded" 
                    />
                    <span className={`text-base font-semibold ${
                      selectedTags.includes(tag.slug) ? 'text-black' : 'text-gray-600'
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
              className="w-full py-4 bg-red-600 text-white rounded-2xl text-base font-bold uppercase hover:bg-red-700 transition-all shadow-lg"
            >
              Clear All Filters
            </button>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-12">
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-12">
          
          {/* DESKTOP SIDEBAR */}
          <aside className="hidden lg:block lg:w-80 flex-shrink-0 sticky top-32 h-fit space-y-10 bg-white border-2 border-gray-200 p-7 rounded-3xl">
            {/* Categories */}
            <div>
              <h3 className="text-sm font-black uppercase text-gray-600 mb-6 flex items-center gap-2">
                <Package className="w-4 h-4" />
                Categories
              </h3>
              {categoriesLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                </div>
              ) : (
                <div className="space-y-1.5">
                  <button 
                    onClick={() => handleCategoryChange('all')} 
                    className={`flex items-center justify-between w-full py-3 px-4 rounded-xl text-sm font-bold transition-all ${
                      selectedCategory === 'all' 
                        ? 'bg-red-600 text-white shadow-md' 
                        : 'text-black hover:bg-gray-100'
                    }`}
                  >
                    <span>All Products</span>
                    <ChevronRight className="w-4 h-4" />
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
            <div className="pt-8 border-t-2 border-gray-200">
              <h3 className="text-sm font-black uppercase text-gray-600 mb-6">Price Range</h3>
              <div className="space-y-2">
                {priceRanges.map((range) => (
                  <label key={range.value} className="flex items-center gap-4 p-3 rounded-xl cursor-pointer group hover:bg-gray-50 transition-all">
                    <input 
                      type="radio" 
                      name="price" 
                      checked={selectedPriceRange === range.value} 
                      onChange={() => handlePriceChange(range.value)} 
                      className="w-5 h-5 accent-red-600" 
                    />
                    <span className={`text-base font-semibold ${
                      selectedPriceRange === range.value ? 'text-black' : 'text-gray-600'
                    }`}>
                      {range.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div className="pt-8 border-t-2 border-gray-200">
              <h3 className="text-sm font-black uppercase text-gray-600 mb-6 flex items-center gap-2">
                <TagIcon className="w-4 h-4" />
                Tags
              </h3>
              {tagsLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                </div>
              ) : (
                <div className="space-y-2 max-h-72 overflow-y-auto pr-2">
                  {tags.map((tag) => (
                    <label key={tag.slug} className="flex items-center gap-4 p-3 rounded-xl cursor-pointer group hover:bg-gray-50 transition-all">
                      <input 
                        type="checkbox" 
                        checked={selectedTags.includes(tag.slug)} 
                        onChange={() => handleTagToggle(tag.slug)} 
                        className="w-5 h-5 accent-red-600 rounded" 
                      />
                      <span className={`text-base font-semibold ${
                        selectedTags.includes(tag.slug) ? 'text-black' : 'text-gray-600'
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
                className="w-full py-4 bg-black hover:bg-gray-900 text-white rounded-2xl text-base font-bold uppercase mt-8 transition-all shadow-md"
              >
                Clear Filters ({activeFilterCount})
              </button>
            )}
          </aside>

          {/* MAIN CONTENT */}
          <div className="flex-1">
            {loading ? (
              <div className="h-[500px] flex flex-col items-center justify-center gap-6">
                <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
                <div className="text-center">
                  <p className="text-base font-bold text-gray-600">
                    Loading Products...
                  </p>
                </div>
              </div>
            ) : products.length === 0 ? (
              <div className="h-[500px] flex flex-col items-center justify-center gap-6 px-6">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
                  <div className="text-4xl">🔍</div>
                </div>
                <div className="text-center max-w-md">
                  <h3 className="text-2xl font-black text-black mb-2">
                    No Products Found
                  </h3>
                  <p className="text-base text-gray-600 mb-6">
                    Try adjusting your filters or search query.
                  </p>
                  <button
                    onClick={clearAllFilters}
                    className="px-8 py-4 bg-red-600 text-white rounded-2xl text-base font-bold uppercase hover:bg-red-700 transition-all shadow-lg"
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

                {/* PAGINATION */}
                {totalPages > 1 && (
                  <div className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-4">
                    <button 
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(p => p - 1)}
                      className="px-6 py-3 rounded-xl border-2 border-gray-200 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 hover:border-gray-400 transition-all text-sm font-bold uppercase flex items-center gap-2"
                    >
                      <ChevronLeft className="w-4 h-4" /> Prev
                    </button>
                    
                    <div className="flex flex-wrap gap-2 justify-center">
                      {paginationItems.map((item, index) => {
                        if (typeof item === 'string') {
                          return <span key={`ellipsis-${index}`} className="px-4 py-3 text-gray-400 font-bold">...</span>;
                        }
                        const pageNum = item;
                        const isCurrent = currentPage === pageNum;
                        return (
                          <button
                            key={pageNum}
                            onClick={() => setCurrentPage(pageNum)}
                            className={`px-5 py-3 rounded-xl text-sm font-bold transition-all ${
                              isCurrent 
                                ? 'bg-red-600 text-white shadow-md hover:bg-red-700' 
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-2 border-gray-200'
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
                      className="px-6 py-3 rounded-xl border-2 border-gray-200 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 hover:border-gray-400 transition-all text-sm font-bold uppercase flex items-center gap-2"
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

// Product Card Component with Quick Buy
function ProductCard({ product }: { product: Product }) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleNavigate = () => {
    startTransition(() => {
      router.push(`/shop/${product.slug}`);
    });
  };

  const handleQuickBuy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    setIsAddingToCart(true);
    
    // Get or create session ID
    let sessionId = localStorage.getItem('guest_session_id');
    if (!sessionId) {
      sessionId = crypto.randomUUID();
      localStorage.setItem('guest_session_id', sessionId);
    }

    try {
      const token = localStorage.getItem('access_token');
      const res = await fetch(`${BaseUrl}api/orders/cart/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
        body: JSON.stringify({
          product: product.id,
          quantity: 1,
          ...(!token && { session_id: sessionId }),
        }),
      });

      if (res.ok) {
        window.dispatchEvent(new Event('storage'));
        router.push('/checkout');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsAddingToCart(false);
    }
  };

  return (
    <div 
      onClick={handleNavigate} 
      className="group flex flex-col bg-white border-2 border-gray-200 rounded-3xl overflow-hidden hover:shadow-2xl hover:border-red-600 transition-all duration-300 cursor-pointer"
    >
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        {product.image_url ? (
          <img 
            src={product.image_url} 
            alt={product.name} 
            className="w-full h-full object-cover transition duration-700 group-hover:scale-105" 
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-sm font-bold text-gray-300">
            No Image
          </div>
        )}
        
        {isPending && (
          <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-50">
            <Loader2 className="w-8 h-8 animate-spin text-red-600" />
          </div>
        )}
        
        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Quick actions - Show on hover */}
        <div className="absolute bottom-4 left-4 right-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 space-y-2">
          {/* Quick Buy Now Button */}
          <button
            onClick={handleQuickBuy}
            disabled={isAddingToCart}
            className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-xl text-sm font-bold uppercase flex items-center justify-center gap-2 shadow-xl transition-all disabled:opacity-50"
          >
            {isAddingToCart ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Zap className="w-4 h-4" />
                Quick Buy
              </>
            )}
          </button>
          
          {/* View Details Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleNavigate();
            }}
            className="w-full bg-white hover:bg-black text-black hover:text-white px-4 py-3 rounded-xl text-sm font-bold uppercase flex items-center justify-center gap-2 shadow-xl transition-all"
          >
            <Eye className="w-4 h-4" />
            View Details
          </button>
        </div>

        {/* Favorite button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            setIsFavorite(!isFavorite);
          }}
          className="absolute top-4 right-4 w-10 h-10 bg-white/95 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white transition-all opacity-0 group-hover:opacity-100 shadow-lg hover:scale-110"
        >
          <Heart className={`w-5 h-5 transition-all ${isFavorite ? 'fill-red-600 text-red-600' : 'text-gray-400'}`} />
        </button>
      </div>
      
      <div className="p-4 space-y-3">
        <div>
          <span className="text-xs font-bold uppercase text-gray-500 block mb-1">
            {product.category_path}
          </span>
          <h3 className="font-bold text-black leading-tight line-clamp-2 group-hover:text-red-600 transition-colors text-base min-h-[2.5rem]">
            {product.name}
          </h3>
        </div>
        <p className="text-xl font-black text-black">
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
          <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
          <div className="text-center">
            <p className="text-base font-bold text-gray-600">
              Loading Shop...
            </p>
          </div>
        </div>
      </div>
    }>
      <ProductsContent />
    </Suspense>
  );
}