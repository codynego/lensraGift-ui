"use client";

import { useState, useEffect, useMemo } from 'react';
import { 
  Search, Filter, X, ChevronDown, SlidersHorizontal, 
  Grid3x3, LayoutGrid, Heart, ShoppingBag, ArrowUpDown,
  Star, TrendingUp, Sparkles, Gift, Package
} from 'lucide-react';

const getImageUrl = (imagePath: string | null | undefined): string | null => {
  const BaseUrl = "https://api.lensra.com/";
  if (!imagePath) return null;
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  return `${BaseUrl.replace(/\/$/, '')}${imagePath.startsWith('/') ? imagePath : '/' + imagePath}`;
};

// Types
interface Product {
  id: number;
  name: string;
  slug: string;
  base_price: string;
  image_url?: string;
  category?: string;
  is_featured?: boolean;
  is_trending?: boolean;
  occasions?: string[];
  tags?: string[];
}

interface FilterState {
  occasion: string[];
  category: string[];
  priceRange: [number, number];
  sortBy: string;
}

interface MarketplacePageProps {
  initialProducts?: Product[];
}

export default function MarketplacePage({ initialProducts = [] }: MarketplacePageProps) {
  // Ensure products is always an array
  const [products, setProducts] = useState<Product[]>(() => {
    if (!initialProducts) return [];
    return Array.isArray(initialProducts) ? initialProducts : [];
  });
  
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'large'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(false);

  // Filter state
  const [filters, setFilters] = useState<FilterState>({
    occasion: [],
    category: [],
    priceRange: [0, 50000],
    sortBy: 'popular'
  });

  // Available filter options
  const occasions = [
    { id: 'birthdays', name: 'Birthdays', emoji: '🎂', count: 50 },
    { id: 'love-romance', name: 'Love & Romance', emoji: '💝', count: 40 },
    { id: 'friendships', name: 'Friendships', emoji: '🤝', count: 35 },
    { id: 'breakup', name: 'Breakup Gifts', emoji: '💔', count: 15 },
    { id: 'inside-jokes', name: 'Inside Jokes', emoji: '😂', count: 30 },
    { id: 'thank-you', name: 'Thank You', emoji: '🙏', count: 25 },
    { id: 'graduation', name: 'Graduation', emoji: '🎓', count: 20 },
    { id: 'wedding', name: 'Wedding', emoji: '💍', count: 18 }
  ];

  const categories = [
    { id: 'mugs', name: 'Mugs & Drinkware', icon: '☕', count: 45 },
    { id: 'frames', name: 'Photo Frames', icon: '🖼️', count: 30 },
    { id: 'apparel', name: 'Apparel', icon: '👕', count: 55 },
    { id: 'home-decor', name: 'Home Decor', icon: '🏠', count: 40 },
    { id: 'accessories', name: 'Accessories', icon: '💼', count: 25 },
    { id: 'stationery', name: 'Stationery', icon: '📝', count: 20 }
  ];

  const sortOptions = [
    { id: 'popular', name: 'Most Popular' },
    { id: 'newest', name: 'Newest First' },
    { id: 'price-low', name: 'Price: Low to High' },
    { id: 'price-high', name: 'Price: High to Low' },
    { id: 'trending', name: 'Trending' }
  ];

  const priceRanges = [
    { id: 'under-2000', name: 'Under ₦2,000', min: 0, max: 2000 },
    { id: '2000-5000', name: '₦2,000 - ₦5,000', min: 2000, max: 5000 },
    { id: '5000-10000', name: '₦5,000 - ₦10,000', min: 5000, max: 10000 },
    { id: '10000-20000', name: '₦10,000 - ₦20,000', min: 10000, max: 20000 },
    { id: 'over-20000', name: 'Over ₦20,000', min: 20000, max: 50000 }
  ];

  // Filtered and sorted products
  const filteredProducts = useMemo(() => {
    if (!Array.isArray(products)) return [];
    
    let result = [...products];

    // Search filter
    if (searchQuery && searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(product =>
        product.name?.toLowerCase().includes(query) ||
        product.category?.toLowerCase().includes(query)
      );
    }

    // Occasion filter
    if (filters.occasion && filters.occasion.length > 0) {
      result = result.filter(product => {
        if (!product.occasions || !Array.isArray(product.occasions)) return false;
        return product.occasions.some(occ => filters.occasion.includes(occ));
      });
    }

    // Category filter
    if (filters.category && filters.category.length > 0) {
      result = result.filter(product => {
        if (!product.category) return false;
        return filters.category.some(cat => 
          product.category?.toLowerCase().includes(cat.toLowerCase())
        );
      });
    }

    // Price filter
    if (filters.priceRange) {
      result = result.filter(product => {
        const price = parseFloat(product.base_price || "0");
        return price >= filters.priceRange[0] && price <= filters.priceRange[1];
      });
    }

    // Sorting
    switch (filters.sortBy) {
      case 'price-low':
        result.sort((a, b) => parseFloat(a.base_price || "0") - parseFloat(b.base_price || "0"));
        break;
      case 'price-high':
        result.sort((a, b) => parseFloat(b.base_price || "0") - parseFloat(a.base_price || "0"));
        break;
      case 'trending':
        result.sort((a, b) => (b.is_trending ? 1 : 0) - (a.is_trending ? 1 : 0));
        break;
      case 'popular':
      default:
        result.sort((a, b) => (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0));
        break;
    }

    return result;
  }, [products, searchQuery, filters]);

  // Toggle filter
  const toggleFilter = (type: keyof FilterState, value: any) => {
    if (type === 'occasion' || type === 'category') {
      setFilters(prev => {
        const currentArray = prev[type] || [];
        return {
          ...prev,
          [type]: currentArray.includes(value)
            ? currentArray.filter(v => v !== value)
            : [...currentArray, value]
        };
      });
    }
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      occasion: [],
      category: [],
      priceRange: [0, 50000],
      sortBy: 'popular'
    });
    setSearchQuery('');
  };

  // Active filter count
  const activeFilterCount = 
    (filters.occasion?.length || 0) + 
    (filters.category?.length || 0) + 
    (filters.priceRange && (filters.priceRange[0] !== 0 || filters.priceRange[1] !== 50000) ? 1 : 0);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="relative">
          <div className="w-16 h-16 rounded-full border-4 border-neutral-200 border-t-red-500 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-br from-zinc-50 to-white border-b border-zinc-200">
        <div className="max-w-[1400px] mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase italic text-zinc-900 mb-2">
                Marketplace
              </h1>
              <p className="text-sm font-bold uppercase tracking-wide text-zinc-600">
                {filteredProducts?.length || 0} Ready-made designs
              </p>
            </div>

            {/* View Mode Toggle */}
            <div className="hidden md:flex items-center gap-2 bg-white border-2 border-zinc-200 rounded-xl p-1">
              <button
                onClick={() => setViewMode('large')}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === 'large'
                    ? 'bg-zinc-900 text-white'
                    : 'text-zinc-400 hover:text-zinc-900'
                }`}
              >
                <LayoutGrid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === 'grid'
                    ? 'bg-zinc-900 text-white'
                    : 'text-zinc-400 hover:text-zinc-900'
                }`}
              >
                <Grid3x3 className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
            <input
              type="text"
              placeholder="Search gifts, occasions, categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-12 py-4 bg-white border-2 border-zinc-200 rounded-xl text-sm font-semibold placeholder:text-zinc-400 focus:outline-none focus:border-red-500 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-900"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Filter & Sort Bar */}
      <div className="bg-white border-b border-zinc-200 sticky top-0 z-40">
        <div className="max-w-[1400px] mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Filter Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2.5 bg-zinc-900 text-white rounded-xl font-semibold text-sm hover:bg-zinc-800 transition-all relative"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Filters</span>
              {activeFilterCount > 0 && (
                <span className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs font-black flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>

            {/* Active Filters */}
            {activeFilterCount > 0 && (
              <div className="flex-1 flex items-center gap-2 overflow-x-auto">
                {(filters.occasion || []).map(occ => (
                  <FilterChip
                    key={occ}
                    label={occasions.find(o => o.id === occ)?.name || occ}
                    onRemove={() => toggleFilter('occasion', occ)}
                  />
                ))}
                {(filters.category || []).map(cat => (
                  <FilterChip
                    key={cat}
                    label={categories.find(c => c.id === cat)?.name || cat}
                    onRemove={() => toggleFilter('category', cat)}
                  />
                ))}
                <button
                  onClick={clearFilters}
                  className="text-xs font-semibold text-red-600 hover:text-red-700 whitespace-nowrap"
                >
                  Clear all
                </button>
              </div>
            )}

            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={filters.sortBy}
                onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value }))}
                className="appearance-none pl-4 pr-10 py-2.5 bg-white border-2 border-zinc-200 rounded-xl font-semibold text-sm cursor-pointer hover:border-zinc-300 transition-all focus:outline-none focus:border-red-500"
              >
                {sortOptions.map(option => (
                  <option key={option.id} value={option.id}>
                    {option.name}
                  </option>
                ))}
              </select>
              <ArrowUpDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1400px] mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Sidebar Filters */}
          <aside className={`
            fixed md:sticky top-0 left-0 z-50 md:z-0
            w-full md:w-80 h-screen md:h-auto
            bg-white md:bg-transparent
            transition-transform duration-300
            ${showFilters ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
            overflow-y-auto
            md:block
          `}>
            <div className="bg-white md:border-2 md:border-zinc-200 md:rounded-2xl p-6 md:sticky md:top-24">
              {/* Mobile Header */}
              <div className="flex items-center justify-between mb-6 md:hidden">
                <h2 className="text-xl font-black uppercase">Filters</h2>
                <button
                  onClick={() => setShowFilters(false)}
                  className="p-2 hover:bg-zinc-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Occasions */}
              <div className="mb-8">
                <h3 className="text-sm font-black uppercase tracking-wide text-zinc-900 mb-4">
                  Occasions
                </h3>
                <div className="space-y-2">
                  {occasions.map(occasion => (
                    <label
                      key={occasion.id}
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-zinc-50 cursor-pointer transition-all group"
                    >
                      <input
                        type="checkbox"
                        checked={(filters.occasion || []).includes(occasion.id)}
                        onChange={() => toggleFilter('occasion', occasion.id)}
                        className="w-4 h-4 accent-red-500 cursor-pointer"
                      />
                      <span className="text-2xl">{occasion.emoji}</span>
                      <span className="flex-1 text-sm font-semibold text-zinc-700 group-hover:text-zinc-900">
                        {occasion.name}
                      </span>
                      <span className="text-xs font-bold text-zinc-400">
                        {occasion.count}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Categories */}
              <div className="mb-8">
                <h3 className="text-sm font-black uppercase tracking-wide text-zinc-900 mb-4">
                  Categories
                </h3>
                <div className="space-y-2">
                  {categories.map(category => (
                    <label
                      key={category.id}
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-zinc-50 cursor-pointer transition-all group"
                    >
                      <input
                        type="checkbox"
                        checked={(filters.category || []).includes(category.id)}
                        onChange={() => toggleFilter('category', category.id)}
                        className="w-4 h-4 accent-red-500 cursor-pointer"
                      />
                      <span className="text-xl">{category.icon}</span>
                      <span className="flex-1 text-sm font-semibold text-zinc-700 group-hover:text-zinc-900">
                        {category.name}
                      </span>
                      <span className="text-xs font-bold text-zinc-400">
                        {category.count}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-8">
                <h3 className="text-sm font-black uppercase tracking-wide text-zinc-900 mb-4">
                  Price Range
                </h3>
                <div className="space-y-2">
                  {priceRanges.map(range => (
                    <button
                      key={range.id}
                      onClick={() => setFilters(prev => ({ 
                        ...prev, 
                        priceRange: [range.min, range.max] 
                      }))}
                      className={`w-full text-left p-3 rounded-xl transition-all ${
                        filters.priceRange && filters.priceRange[0] === range.min && filters.priceRange[1] === range.max
                          ? 'bg-red-50 border-2 border-red-500 text-red-700 font-semibold'
                          : 'hover:bg-zinc-50 text-zinc-700 border-2 border-transparent'
                      }`}
                    >
                      <span className="text-sm font-semibold">{range.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Clear Filters */}
              {activeFilterCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="w-full py-3 bg-zinc-100 hover:bg-zinc-200 rounded-xl font-semibold text-sm text-zinc-700 transition-all"
                >
                  Clear All Filters
                </button>
              )}
            </div>
          </aside>

          {/* Products Grid */}
          <main className="flex-1">
            {!filteredProducts || filteredProducts.length === 0 ? (
              <div className="text-center py-20">
                <ShoppingBag className="w-16 h-16 text-zinc-300 mx-auto mb-4" />
                <h3 className="text-2xl font-black uppercase text-zinc-900 mb-2">
                  No products found
                </h3>
                <p className="text-sm font-semibold text-zinc-600 mb-6">
                  Try adjusting your filters or search query
                </p>
                <button
                  onClick={clearFilters}
                  className="px-6 py-3 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition-all"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className={`
                grid gap-6
                ${viewMode === 'grid' 
                  ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4' 
                  : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                }
              `}>
                {filteredProducts.map(product => (
                  <ProductCard 
                    key={product.id} 
                    product={product} 
                    viewMode={viewMode}
                  />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filter Overlay */}
      {showFilters && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setShowFilters(false)}
        />
      )}
    </div>
  );
}

// Filter Chip Component
function FilterChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-red-50 border border-red-200 rounded-full text-xs font-semibold text-red-700 whitespace-nowrap">
      <span>{label}</span>
      <button
        onClick={onRemove}
        className="hover:bg-red-200 rounded-full p-0.5 transition-all"
      >
        <X className="w-3 h-3" />
      </button>
    </div>
  );
}

// Product Card Component
function ProductCard({ product, viewMode }: { product: Product; viewMode: 'grid' | 'large' }) {
  const imageUrl = getImageUrl(product.image_url);
  const [isFavorite, setIsFavorite] = useState(false);

  if (viewMode === 'large') {
    return (
      <a href={`/marketplace/${product.slug}`} className="group block">
        <div className="bg-white border-2 border-zinc-200 rounded-2xl overflow-hidden hover:border-zinc-300 hover:shadow-2xl transition-all">
          <div className="flex flex-col md:flex-row">
            {/* Image */}
            <div className="relative md:w-1/2 aspect-square md:aspect-auto bg-zinc-50">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={product.name || 'Product'}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ShoppingBag className="w-16 h-16 text-zinc-300" />
                </div>
              )}
              
              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.is_trending && (
                  <span className="px-3 py-1 bg-red-500 text-white rounded-full text-xs font-black uppercase tracking-wide">
                    Trending
                  </span>
                )}
                {product.is_featured && (
                  <span className="px-3 py-1 bg-zinc-900 text-white rounded-full text-xs font-black uppercase tracking-wide">
                    Featured
                  </span>
                )}
              </div>

              {/* Favorite */}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setIsFavorite(!isFavorite);
                }}
                className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-all"
              >
                <Heart className={`w-5 h-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-zinc-400'}`} />
              </button>
            </div>

            {/* Content */}
            <div className="md:w-1/2 p-6 flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-black uppercase tracking-tight text-zinc-900 mb-2 group-hover:text-red-600 transition-colors line-clamp-2">
                  {product.name}
                </h3>
                <p className="text-sm font-semibold text-zinc-600 mb-4">
                  {product.category || 'Personalized Gift'}
                </p>

                {/* Price */}
                <div className="flex items-baseline gap-2 mb-6">
                  <span className="text-3xl font-black text-red-600">
                    ₦{parseFloat(product.base_price || "0").toLocaleString()}
                  </span>
                </div>
              </div>

              {/* CTA */}
              <button className="w-full py-3 bg-zinc-900 text-white rounded-xl font-semibold hover:bg-red-600 transition-all">
                Quick View
              </button>
            </div>
          </div>
        </div>
      </a>
    );
  }

  // Grid View (Default)
  return (
    <a href={`/marketplace/${product.slug}`} className="group block">
      <div className="relative aspect-square bg-zinc-50 rounded-2xl overflow-hidden mb-3 border-2 border-zinc-200 group-hover:border-zinc-300 group-hover:shadow-xl transition-all">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={product.name || 'Product'}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ShoppingBag className="w-12 h-12 text-zinc-300" />
          </div>
        )}

        {/* Badges */}
        {(product.is_trending || product.is_featured) && (
          <div className="absolute top-3 left-3">
            <span className="px-3 py-1 bg-red-500 text-white rounded-full text-xs font-black uppercase tracking-wide shadow-lg">
              {product.is_trending ? 'Trending' : 'Featured'}
            </span>
          </div>
        )}

        {/* Favorite */}
        <button
          onClick={(e) => {
            e.preventDefault();
            setIsFavorite(!isFavorite);
          }}
          className="absolute top-3 right-3 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-all opacity-0 group-hover:opacity-100"
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-zinc-400'}`} />
        </button>

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        
        {/* Quick View Button */}
        <div className="absolute bottom-4 left-4 right-4 transform translate-y-full group-hover:translate-y-0 transition-transform">
          <button className="w-full py-3 bg-white text-zinc-900 rounded-xl text-sm font-semibold hover:bg-red-500 hover:text-white transition-colors">
            Quick View
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div>
        <h3 className="font-semibold text-zinc-900 mb-1 line-clamp-2 group-hover:text-red-500 transition-colors">
          {product.name}
        </h3>
        <p className="text-xs font-semibold text-zinc-500 mb-2">{product.category || 'Gift'}</p>
        <p className="text-lg font-black text-red-500">
          ₦{parseFloat(product.base_price || "0").toLocaleString()}
        </p>
      </div>
    </a>
  );
}

