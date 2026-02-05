// app/categories/page.tsx
// Categories List - Bold exploration layout with creative typography

"use client";

import { useState, useEffect } from 'react';
import { 
  Layers, ChevronRight, Search, Grid3x3, LayoutGrid, 
  Sparkles, TrendingUp, Filter, X, Package, Gift, Heart
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

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    fetch(`${BaseUrl}api/products/categories/`)
      .then(res => res.json())
      .then(data => {
        setCategories(data.results || data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching categories:', err);
        setLoading(false);
      });
  }, []);

  // Filter top-level categories
  const topLevelCategories = categories.filter(cat => !cat.parent_id);
  
  // Search filter
  const filteredCategories = topLevelCategories.filter(cat =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase())
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

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Hero Header - Bold Typography */}
      <section className="relative border-b border-zinc-800 overflow-hidden">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" 
               style={{
                 backgroundImage: `repeating-linear-gradient(
                   45deg,
                   transparent,
                   transparent 35px,
                   rgba(255, 255, 255, 0.05) 35px,
                   rgba(255, 255, 255, 0.05) 70px
                 )`
               }} 
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 py-20 md:py-32 relative z-10">
          <div className="max-w-4xl">
            {/* Overline */}
            <div className="inline-flex items-center gap-2 mb-6">
              <Layers className="w-5 h-5 text-red-500" />
              <span className="text-xs font-bold uppercase tracking-[0.3em] text-zinc-400">
                Explore Collections
              </span>
            </div>

            {/* Main Title - Dramatic Typography */}
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter leading-[0.85] mb-6">
              Browse
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-rose-500 to-pink-500 italic">
                Categories
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-zinc-400 font-light max-w-2xl leading-relaxed">
              Discover curated gift collections for every personality, occasion, and moment worth celebrating.
            </p>
          </div>
        </div>
      </section>

      {/* Search & Filter Bar */}
      <section className="sticky top-0 z-40 bg-zinc-900/95 backdrop-blur-xl border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative w-full md:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
              <input
                type="text"
                placeholder="Search categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl pl-12 pr-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* View Toggle */}
            <div className="flex items-center gap-2 bg-zinc-800 rounded-xl p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-4 py-2 rounded-lg transition-all ${
                  viewMode === 'grid'
                    ? 'bg-red-600 text-white'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Grid3x3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-4 py-2 rounded-lg transition-all ${
                  viewMode === 'list'
                    ? 'bg-red-600 text-white'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>

            {/* Stats */}
            <div className="text-sm text-zinc-400">
              <span className="font-semibold text-white">{filteredCategories.length}</span> categories
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid/List */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        {filteredCategories.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-zinc-800 rounded-full mb-6">
              <Search className="w-10 h-10 text-zinc-600" />
            </div>
            <h3 className="text-2xl font-bold text-zinc-300 mb-2">No categories found</h3>
            <p className="text-zinc-500">Try adjusting your search</p>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCategories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredCategories.map((category) => (
              <CategoryListItem key={category.id} category={category} />
            ))}
          </div>
        )}
      </section>

      {/* Footer CTA */}
      <section className="border-t border-zinc-800 bg-zinc-900/50">
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-600/10 rounded-2xl mb-6">
            <Gift className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Can't find what you're looking for?
          </h2>
          <p className="text-zinc-400 mb-8 max-w-2xl mx-auto">
            Use our Gift Finder to discover personalized recommendations based on who you're shopping for.
          </p>
          <Link
            href="/gift-finder"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-xl font-bold hover:shadow-xl hover:shadow-red-500/30 transition-all group"
          >
            Try Gift Finder
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>
    </div>
  );
}

function CategoryCard({ category }: { category: Category }) {
  const hasSubcategories = category.subcategories && category.subcategories.length > 0;

  return (
    <Link href={`/gifts/${category.slug}`}>
      <div className="group relative bg-zinc-900 border border-zinc-800 rounded-2xl p-8 hover:border-red-500/50 transition-all duration-300 overflow-hidden h-full">
        {/* Hover Gradient Effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-red-600/0 via-red-600/0 to-red-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Animated Corner Accent */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-red-500/10 to-transparent rounded-bl-full transform translate-x-16 -translate-y-16 group-hover:translate-x-8 group-hover:-translate-y-8 transition-transform duration-500" />

        <div className="relative z-10">
          {/* Icon */}
          <div className="inline-flex items-center justify-center w-14 h-14 bg-red-600/10 border border-red-600/20 rounded-xl mb-6 group-hover:bg-red-600/20 group-hover:scale-110 transition-all duration-300">
            <Package className="w-7 h-7 text-red-500" />
          </div>

          {/* Category Name */}
          <h3 className="text-2xl font-bold mb-3 group-hover:text-red-400 transition-colors">
            {category.name}
          </h3>

          {/* Subcategories Preview */}
          {hasSubcategories && (
            <div className="mb-4">
              <div className="flex flex-wrap gap-2">
                {category.subcategories.slice(0, 3).map((sub) => (
                  <span
                    key={sub.id}
                    className="text-xs px-3 py-1 bg-zinc-800 text-zinc-400 rounded-full border border-zinc-700"
                  >
                    {sub.name}
                  </span>
                ))}
                {category.subcategories.length > 3 && (
                  <span className="text-xs px-3 py-1 bg-zinc-800 text-zinc-400 rounded-full border border-zinc-700">
                    +{category.subcategories.length - 3} more
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Action */}
          <div className="flex items-center gap-2 text-sm font-semibold text-zinc-400 group-hover:text-red-400 transition-colors">
            Explore Category
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </Link>
  );
}

function CategoryListItem({ category }: { category: Category }) {
  const hasSubcategories = category.subcategories && category.subcategories.length > 0;

  return (
    <Link href={`/gifts/${category.slug}`}>
      <div className="group bg-zinc-900 border border-zinc-800 rounded-xl p-6 hover:border-red-500/50 transition-all duration-300 flex items-center justify-between">
        <div className="flex items-center gap-6">
          {/* Icon */}
          <div className="flex-shrink-0 w-12 h-12 bg-red-600/10 border border-red-600/20 rounded-lg flex items-center justify-center group-hover:bg-red-600/20 transition-all">
            <Package className="w-6 h-6 text-red-500" />
          </div>

          <div>
            {/* Name */}
            <h3 className="text-xl font-bold mb-1 group-hover:text-red-400 transition-colors">
              {category.name}
            </h3>

            {/* Subcategories */}
            {hasSubcategories && (
              <p className="text-sm text-zinc-500">
                {category.subcategories.length} subcategories
              </p>
            )}
          </div>
        </div>

        {/* Arrow */}
        <ChevronRight className="w-6 h-6 text-zinc-600 group-hover:text-red-500 group-hover:translate-x-1 transition-all flex-shrink-0" />
      </div>
    </Link>
  );
}