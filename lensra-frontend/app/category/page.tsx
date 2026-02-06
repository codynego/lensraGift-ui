// app/categories/page.tsx
// Categories List - Clean, Redbubble-inspired layout with category images

"use client";

import { useState, useEffect } from 'react';
import { 
  Search, X, ChevronRight, Tag, TrendingUp, Star, 
  Heart, Sparkles, Gift, Camera, Palette, Coffee
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const BaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.lensra.com/";

interface Category {
  id: number;
  name: string;
  slug: string;
  parent_id: number | null;
  parent_name: string | null;
  subcategories: Category[];
  full_path: string;
  image_url?: string;
}

// Popular themes/tags for the "Shop by Theme" section
const popularThemes = [
  { name: 'Birthday', icon: Gift, color: 'from-pink-500 to-rose-500', tag: 'birthday' },
  { name: 'Anniversary', icon: Heart, color: 'from-red-500 to-pink-500', tag: 'anniversary' },
  { name: 'Wedding', icon: Sparkles, color: 'from-purple-500 to-pink-500', tag: 'wedding' },
  { name: 'Christmas', icon: Star, color: 'from-green-600 to-red-600', tag: 'christmas' },
  { name: 'Graduation', icon: TrendingUp, color: 'from-blue-500 to-indigo-500', tag: 'graduation' },
  { name: 'Photography', icon: Camera, color: 'from-slate-600 to-slate-800', tag: 'photography' },
  { name: 'Art & Design', icon: Palette, color: 'from-orange-500 to-pink-500', tag: 'art' },
  { name: 'Coffee Lovers', icon: Coffee, color: 'from-amber-700 to-amber-900', tag: 'coffee' },
];

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

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
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="relative">
          <div className="w-16 h-16 rounded-full border-4 border-gray-200 border-t-red-600 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Header - Clean and Bold */}
      <section className="bg-gradient-to-br from-gray-50 to-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
          <div className="text-center max-w-3xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 border border-red-100 rounded-full mb-6">
              <Tag className="w-4 h-4 text-red-600" />
              <span className="text-sm font-semibold text-red-600 uppercase tracking-wide">
                Shop by Category
              </span>
            </div>

            {/* Main Title */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-gray-900 mb-6 tracking-tight">
              Find the Perfect
              <span className="block text-red-600 mt-2">Gift Category</span>
            </h1>

            <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
              Browse our curated collections of unique gifts for every occasion, personality, and celebration.
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mt-10">
            <div className="relative">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border-2 border-gray-200 rounded-full pl-14 pr-14 py-4 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-red-500 focus:ring-4 focus:ring-red-100 transition-all shadow-sm"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Section Header */}
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            All Categories
          </h2>
          <p className="text-gray-600">
            <span className="font-semibold text-gray-900">{filteredCategories.length}</span> categories to explore
          </p>
        </div>

        {filteredCategories.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6">
              <Search className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-700 mb-2">No categories found</h3>
            <p className="text-gray-500">Try adjusting your search</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCategories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        )}
      </section>

      {/* Shop by Theme Section */}
      <section className="bg-gray-50 border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Section Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full mb-6 shadow-sm">
              <Sparkles className="w-4 h-4 text-red-600" />
              <span className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                Popular Themes
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Shop by Theme
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover gifts organized by occasion, interest, and celebration
            </p>
          </div>

          {/* Themes Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {popularThemes.map((theme) => (
              <ThemeCard key={theme.name} theme={theme} />
            ))}
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="bg-gradient-to-br from-red-600 to-red-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl mb-6">
            <Gift className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Need Help Finding Something?
          </h2>
          <p className="text-red-100 mb-8 max-w-2xl mx-auto text-lg">
            Use our smart Gift Finder to get personalized recommendations based on who you're shopping for.
          </p>
          <Link
            href="/gift-finder"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-red-600 rounded-full font-bold hover:bg-gray-50 hover:shadow-2xl transition-all group"
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
    <Link href={`/marketplace?category=${category.slug}`}>
      <div className="group bg-white border-2 border-gray-200 rounded-2xl overflow-hidden hover:border-red-500 hover:shadow-xl transition-all duration-300 h-full flex flex-col">
        {/* Category Image */}
        <div className="relative w-full aspect-square bg-gray-100 overflow-hidden">
          {category.image_url ? (
            <Image
              src={category.image_url}
              alt={category.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
              <Tag className="w-16 h-16 text-gray-300" />
            </div>
          )}
          
          {/* Overlay gradient on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Subcategory count badge */}
          {hasSubcategories && (
            <div className="absolute top-3 right-3 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-semibold text-gray-700 shadow-sm">
              {category.subcategories.length} types
            </div>
          )}
        </div>

        {/* Category Info */}
        <div className="p-5 flex-1 flex flex-col">
          {/* Category Name */}
          <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-red-600 transition-colors">
            {category.name}
          </h3>

          {/* Subcategories Preview */}
          {hasSubcategories && (
            <div className="mb-4 flex-1">
              <div className="flex flex-wrap gap-2">
                {category.subcategories.slice(0, 3).map((sub) => (
                  <span
                    key={sub.id}
                    className="text-xs px-3 py-1 bg-gray-100 text-gray-600 rounded-full border border-gray-200 hover:bg-gray-200 transition-colors"
                  >
                    {sub.name}
                  </span>
                ))}
                {category.subcategories.length > 3 && (
                  <span className="text-xs px-3 py-1 bg-red-50 text-red-600 rounded-full border border-red-100 font-medium">
                    +{category.subcategories.length - 3} more
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Action Button */}
          <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
            <span className="text-sm font-semibold text-gray-600 group-hover:text-red-600 transition-colors">
              Browse
            </span>
            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-red-600 group-hover:translate-x-1 transition-all" />
          </div>
        </div>
      </div>
    </Link>
  );
}

function ThemeCard({ theme }: { theme: typeof popularThemes[0] }) {
  const Icon = theme.icon;

  return (
    <Link href={`/marketplace?tag=${theme.tag}`}>
      <div className="group relative bg-white border-2 border-gray-200 rounded-2xl p-6 hover:border-red-500 hover:shadow-xl transition-all duration-300 overflow-hidden">
        {/* Background Gradient (subtle on default, vibrant on hover) */}
        <div className={`absolute inset-0 bg-gradient-to-br ${theme.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
        
        {/* Content */}
        <div className="relative z-10 text-center">
          {/* Icon */}
          <div className={`inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br ${theme.color} rounded-xl mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
            <Icon className="w-7 h-7 text-white" />
          </div>

          {/* Theme Name */}
          <h3 className="text-base font-bold text-gray-900 group-hover:text-red-600 transition-colors">
            {theme.name}
          </h3>
        </div>

        {/* Arrow indicator */}
        <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <ChevronRight className="w-4 h-4 text-red-600" />
        </div>
      </div>
    </Link>
  );
}