// app/categories/[slug]/page.tsx
// Category Detail - Immersive product exploration with creative layout

"use client";

import { useState, useEffect } from 'react';
import { 
  ChevronRight, ArrowLeft, Grid3x3, LayoutGrid, Filter, 
  SlidersHorizontal, X, TrendingUp, Star, ShoppingBag,
  Sparkles, Package, Heart, Search, ChevronDown
} from 'lucide-react';
import Link from 'next/link';

const BaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.lensra.com/";

interface Category {
  id: number;
  name: string;
  slug: string;
  parent_id: number | null;
  parent_name: string | null;
  subcategories: Category[];
  full_path: string;
}

interface Product {
  id: number;
  name: string;
  slug: string;
  base_price: string;
  image_url: string;
  is_featured: boolean;
  is_trending: boolean;
  is_customizable: boolean;
}

export default function CategoryDetailPage({ params }: { params: { slug: string } }) {
  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'masonry'>('grid');
  const [sortBy, setSortBy] = useState<'popular' | 'price_low' | 'price_high' | 'newest'>('popular');
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50000]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  useEffect(() => {
    // Fetch category details
    fetch(`${BaseUrl}api/products/categories/${params.slug}/`)
      .then(res => res.json())
      .then(data => {
        setCategory(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching category:', err);
        setLoading(false);
      });

    // Fetch products in this category
    fetch(`${BaseUrl}api/products/?category=${params.slug}`)
      .then(res => res.json())
      .then(data => {
        setProducts(data.results || data);
      })
      .catch(err => console.error('Error fetching products:', err));
  }, [params.slug]);

  const getImageUrl = (imagePath: string | null | undefined): string | null => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    return `${BaseUrl.replace(/\/$/, '')}${imagePath.startsWith('/') ? imagePath : '/' + imagePath}`;
  };

  // Sort products
  const sortedProducts = [...products].sort((a, b) => {
    switch (sortBy) {
      case 'price_low':
        return parseFloat(a.base_price) - parseFloat(b.base_price);
      case 'price_high':
        return parseFloat(b.base_price) - parseFloat(a.base_price);
      case 'newest':
        return b.id - a.id;
      default: // popular
        return (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0);
    }
  });

  // Filter products by price
  const filteredProducts = sortedProducts.filter(
    product => parseFloat(product.base_price) >= priceRange[0] && parseFloat(product.base_price) <= priceRange[1]
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950">
        <div className="relative">
          <div className="w-16 h-16 rounded-full border-4 border-zinc-800 border-t-red-500 animate-spin" />
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-white">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-zinc-800 rounded-full mb-6">
            <Package className="w-10 h-10 text-zinc-600" />
          </div>
          <h2 className="text-2xl font-bold mb-4">Category not found</h2>
          <Link href="/gifts" className="text-red-500 hover:text-red-400">
            ← Back to categories
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Breadcrumb & Header */}
      <section className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm mb-4">
            <Link href="/gifts" className="text-zinc-500 hover:text-red-500 transition-colors">
              Categories
            </Link>
            {category.full_path.split(' > ').map((part, idx, arr) => (
              <div key={idx} className="flex items-center gap-2">
                <ChevronRight className="w-4 h-4 text-zinc-700" />
                <span className={idx === arr.length - 1 ? 'text-white font-semibold' : 'text-zinc-500'}>
                  {part}
                </span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between">
            {/* Title */}
            <div>
              <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-2">
                {category.name}
              </h1>
              <p className="text-zinc-400">
                {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
              </p>
            </div>

            {/* Back Button - Desktop */}
            <Link
              href="/gifts"
              className="hidden md:flex items-center gap-2 px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg hover:border-red-500 transition-all text-sm font-semibold"
            >
              <ArrowLeft className="w-4 h-4" />
              All Categories
            </Link>
          </div>
        </div>
      </section>

      {/* Subcategories - Horizontal Scroll */}
      {category.subcategories && category.subcategories.length > 0 && (
        <section className="border-b border-zinc-800 bg-zinc-900/30">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
              <span className="text-sm font-semibold text-zinc-500 flex-shrink-0">
                Subcategories:
              </span>
              {category.subcategories.map((sub) => (
                <Link
                  key={sub.id}
                  href={`/gifts/${sub.slug}`}
                  className="flex-shrink-0 px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg hover:border-red-500 hover:bg-zinc-750 transition-all text-sm font-medium whitespace-nowrap"
                >
                  {sub.name}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Toolbar - Sort & Filters */}
      <section className="border-b border-zinc-800 sticky top-[120px] z-30 bg-zinc-900/95 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="appearance-none bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 pr-10 text-sm font-medium cursor-pointer hover:border-red-500 focus:outline-none focus:border-red-500 transition-all"
              >
                <option value="popular">Most Popular</option>
                <option value="newest">Newest</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
            </div>

            <div className="flex items-center gap-3">
              {/* Filters Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                  showFilters
                    ? 'bg-red-600 text-white'
                    : 'bg-zinc-800 border border-zinc-700 hover:border-red-500'
                }`}
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filters
              </button>

              {/* View Mode Toggle */}
              <div className="hidden md:flex items-center gap-1 bg-zinc-800 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded transition-all ${
                    viewMode === 'grid'
                      ? 'bg-red-600 text-white'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  <Grid3x3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('masonry')}
                  className={`p-2 rounded transition-all ${
                    viewMode === 'masonry'
                      ? 'bg-red-600 text-white'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-zinc-800 animate-in slide-in-from-top duration-200">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Price Range */}
                <div>
                  <label className="text-sm font-semibold mb-3 block">
                    Price Range
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      type="number"
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-red-500"
                      placeholder="Min"
                    />
                    <span className="text-zinc-600">—</span>
                    <input
                      type="number"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-red-500"
                      placeholder="Max"
                    />
                  </div>
                </div>

                {/* Quick Filters */}
                <div>
                  <label className="text-sm font-semibold mb-3 block">
                    Quick Filters
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {['Featured', 'Trending', 'Customizable'].map((tag) => (
                      <button
                        key={tag}
                        onClick={() => {
                          setSelectedTags(prev =>
                            prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
                          );
                        }}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                          selectedTags.includes(tag)
                            ? 'bg-red-600 text-white'
                            : 'bg-zinc-800 border border-zinc-700 hover:border-red-500'
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Reset Button */}
              <button
                onClick={() => {
                  setPriceRange([0, 50000]);
                  setSelectedTags([]);
                }}
                className="mt-4 text-sm text-red-500 hover:text-red-400 font-semibold"
              >
                Reset all filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Products Grid */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-zinc-800 rounded-full mb-6">
              <ShoppingBag className="w-10 h-10 text-zinc-600" />
            </div>
            <h3 className="text-2xl font-bold text-zinc-300 mb-2">No products found</h3>
            <p className="text-zinc-500 mb-6">Try adjusting your filters</p>
            <button
              onClick={() => {
                setPriceRange([0, 50000]);
                setSelectedTags([]);
              }}
              className="text-red-500 hover:text-red-400 font-semibold"
            >
              Reset filters
            </button>
          </div>
        ) : (
          <div className={
            viewMode === 'grid'
              ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'
              : 'columns-2 md:columns-3 lg:columns-4 gap-6 space-y-6'
          }>
            {filteredProducts.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                getImageUrl={getImageUrl}
                isMasonry={viewMode === 'masonry'}
              />
            ))}
          </div>
        )}
      </section>

      {/* Related Categories CTA */}
      {category.parent_name && (
        <section className="border-t border-zinc-800 bg-zinc-900/50">
          <div className="max-w-7xl mx-auto px-4 py-16">
            <h3 className="text-2xl font-bold mb-6">
              More in {category.parent_name}
            </h3>
            <Link
              href={`/gifts`}
              className="inline-flex items-center gap-2 px-6 py-3 bg-zinc-800 border border-zinc-700 rounded-xl hover:border-red-500 transition-all font-semibold"
            >
              Browse All Categories
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}

function ProductCard({ 
  product, 
  getImageUrl,
  isMasonry 
}: { 
  product: Product; 
  getImageUrl: (path: string | null | undefined) => string | null;
  isMasonry: boolean;
}) {
  const imageUrl = getImageUrl(product.image_url);

  return (
    <Link 
      href={`/shop/${product.slug}`} 
      className={`group block ${isMasonry ? 'break-inside-avoid' : ''}`}
    >
      <div className="relative bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden hover:border-red-500/50 transition-all duration-300">
        {/* Image Container */}
        <div className={`relative bg-zinc-800 overflow-hidden ${isMasonry ? 'aspect-auto' : 'aspect-square'}`}>
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={product.name}
              loading="lazy"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Package className="w-16 h-16 text-zinc-700" />
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.is_trending && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-600 text-white rounded-md text-xs font-bold shadow-lg">
                <TrendingUp className="w-3 h-3" />
                Trending
              </span>
            )}
            {product.is_customizable && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-600 text-white rounded-md text-xs font-bold shadow-lg">
                <Sparkles className="w-3 h-3" />
                Custom
              </span>
            )}
          </div>

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute bottom-4 left-4 right-4">
              <button className="w-full py-2.5 bg-white text-zinc-900 rounded-lg text-sm font-bold hover:bg-red-500 hover:text-white transition-colors shadow-xl">
                Quick View
              </button>
            </div>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-4">
          <h3 className="font-semibold text-white mb-2 line-clamp-2 group-hover:text-red-400 transition-colors leading-tight">
            {product.name}
          </h3>
          <div className="flex items-center justify-between">
            <p className="text-lg font-bold text-red-500">
              ₦{parseFloat(product.base_price).toLocaleString()}
            </p>
            {product.is_featured && (
              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}