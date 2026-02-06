// app/categories/[slug]/page.tsx
// Subcategory Page - Shows subcategories of a parent category

"use client";

import { useState, useEffect } from 'react';
import { 
  Search, X, ChevronRight, Tag, Home, ArrowLeft
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';

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

export default function SubcategoryPage() {
  const params = useParams();
  const slug = params?.slug as string;
  
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!slug) return;

    // Fetch all categories and find the one with matching slug
    fetch(`${BaseUrl}api/products/categories/`)
      .then(res => res.json())
      .then(data => {
        const categories = data.results || data;
        const foundCategory = categories.find((cat: Category) => cat.slug === slug);
        setCategory(foundCategory || null);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching category:', err);
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="relative">
          <div className="w-16 h-16 rounded-full border-4 border-gray-200 border-t-red-600 animate-spin" />
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Category Not Found</h1>
            <p className="text-gray-600 mb-8">The category you're looking for doesn't exist.</p>
            <Link
              href="/categories"
              className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-full font-semibold hover:bg-red-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Categories
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const subcategories = category.subcategories || [];
  
  // Search filter for subcategories
  const filteredSubcategories = subcategories.filter(cat =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <section className="border-b border-gray-200 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-gray-500 hover:text-red-600 transition-colors">
              <Home className="w-4 h-4" />
            </Link>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <Link href="/categories" className="text-gray-500 hover:text-red-600 transition-colors">
              Categories
            </Link>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <span className="text-gray-900 font-semibold">{category.name}</span>
          </nav>
        </div>
      </section>

      {/* Hero Header */}
      <section className="bg-gradient-to-br from-gray-50 to-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="max-w-3xl">
            {/* Back Button */}
            <Link
              href="/categories"
              className="inline-flex items-center gap-2 text-gray-600 hover:text-red-600 mb-6 transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span className="font-medium">Back to All Categories</span>
            </Link>

            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 border border-red-100 rounded-full mb-6">
              <Tag className="w-4 h-4 text-red-600" />
              <span className="text-sm font-semibold text-red-600 uppercase tracking-wide">
                {subcategories.length} Subcategories
              </span>
            </div>

            {/* Main Title */}
            <h1 className="text-5xl md:text-6xl font-black text-gray-900 mb-6 tracking-tight">
              {category.name}
            </h1>

            <p className="text-lg text-gray-600 leading-relaxed">
              Explore all subcategories within {category.name} to find the perfect gift.
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mt-8">
            <div className="relative">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search subcategories..."
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

      {/* Subcategories Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {filteredSubcategories.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6">
              <Search className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-700 mb-2">No subcategories found</h3>
            <p className="text-gray-500 mb-6">Try adjusting your search</p>
            <Link
              href={`/shop?category=${category.slug}`}
              className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-full font-semibold hover:bg-red-700 transition-colors"
            >
              Browse All {category.name} Products
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {filteredSubcategories.map((subcategory) => (
              <SubcategoryCard 
                key={subcategory.id} 
                category={subcategory} 
                parentSlug={category.slug}
              />
            ))}
          </div>
        )}
      </section>

      {/* View All Products CTA */}
      <section className="border-t border-gray-200 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Want to see all {category.name} products?
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Browse the entire collection without filtering by subcategory
          </p>
          <Link
            href={`/shop?category=${category.slug}`}
            className="inline-flex items-center gap-2 px-8 py-4 bg-red-600 text-white rounded-full font-bold hover:bg-red-700 hover:shadow-xl transition-all group"
          >
            View All {category.name}
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>
    </div>
  );
}

function SubcategoryCard({ category, parentSlug }: { category: Category; parentSlug: string }) {
  const hasSubcategories = category.subcategories && category.subcategories.length > 0;
  
  // If has nested subcategories, go to another subcategory page, otherwise go to marketplace
  const href = hasSubcategories 
    ? `/categories/${category.slug}` 
    : `/shop?category=${category.slug}`;

  return (
    <Link href={href}>
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
          
          {/* Nested subcategory count badge */}
          {hasSubcategories && (
            <div className="absolute top-3 right-3 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-semibold text-gray-700 shadow-sm">
              {category.subcategories.length} types
            </div>
          )}
        </div>

        {/* Category Info */}
        <div className="p-5 flex-1 flex flex-col">
          {/* Category Name */}
          <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-red-600 transition-colors">
            {category.name}
          </h3>

          {/* Action Button */}
          <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
            <span className="text-sm font-semibold text-gray-600 group-hover:text-red-600 transition-colors">
              {hasSubcategories ? 'View Types' : 'Browse'}
            </span>
            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-red-600 group-hover:translate-x-1 transition-all" />
          </div>
        </div>
      </div>
    </Link>
  );
}