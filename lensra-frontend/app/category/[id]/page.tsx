"use client"
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Search, ChevronRight, Star, Sparkles, Package, Zap, Filter, DollarSign, ArrowUpDown } from 'lucide-react';

interface Category {
  id: number;
  name: string;
  icon: string;
  description: string;
  productCount: number;
  startingPrice: number;
  trending: boolean;
  popular: boolean;
  gradient: string;
  subcategories: string[];
}

interface Product {
  id: number;
  categoryId: number;
  subcategory: string;
  name: string;
  description: string;
  price: number;
  imagePlaceholder: string; // For demo, use text for placeholder
  rating: number;
  reviewCount: number;
  trending: boolean;
  popular: boolean;
}

const categories: Category[] = [
  // ... (copy the full categories array from the previous component here to avoid duplication)
  {
    id: 1,
    name: 'Mugs & Drinkware',
    icon: '☕',
    description: 'Ceramic mugs, travel mugs, water bottles',
    productCount: 500,
    startingPrice: 12.99,
    trending: true,
    popular: true,
    gradient: 'from-amber-400 to-orange-600',
    subcategories: ['Ceramic Mugs', 'Travel Mugs', 'Water Bottles', 'Wine Glasses']
  },
  {
    id: 2,
    name: 'Apparel',
    icon: '👕',
    description: 'T-shirts, hoodies, tank tops, sweatshirts',
    productCount: 1200,
    startingPrice: 19.99,
    trending: true,
    popular: true,
    gradient: 'from-blue-400 to-indigo-600',
    subcategories: ['T-Shirts', 'Hoodies', 'Tank Tops', 'Long Sleeve']
  },
  {
    id: 3,
    name: 'Home Decor',
    icon: '🖼️',
    description: 'Canvas prints, posters, pillows, blankets',
    productCount: 800,
    startingPrice: 24.99,
    trending: false,
    popular: true,
    gradient: 'from-purple-400 to-pink-600',
    subcategories: ['Canvas Prints', 'Posters', 'Throw Pillows', 'Blankets']
  },
  {
    id: 4,
    name: 'Accessories',
    icon: '👜',
    description: 'Tote bags, phone cases, keychains, stickers',
    productCount: 950,
    startingPrice: 14.99,
    trending: true,
    popular: false,
    gradient: 'from-pink-400 to-red-600',
    subcategories: ['Tote Bags', 'Phone Cases', 'Keychains', 'Stickers']
  },
  {
    id: 5,
    name: 'Office & Stationery',
    icon: '📓',
    description: 'Notebooks, planners, mousepads, desk items',
    productCount: 450,
    startingPrice: 9.99,
    trending: false,
    popular: false,
    gradient: 'from-green-400 to-teal-600',
    subcategories: ['Notebooks', 'Planners', 'Mousepads', 'Calendars']
  },
  {
    id: 6,
    name: 'Kids & Baby',
    icon: '🧸',
    description: 'Baby clothes, bibs, toys, nursery decor',
    productCount: 350,
    startingPrice: 16.99,
    trending: false,
    popular: true,
    gradient: 'from-yellow-400 to-orange-500',
    subcategories: ['Baby Onesies', 'Bibs', 'Kids T-Shirts', 'Nursery Art']
  },
  {
    id: 7,
    name: 'Tech Accessories',
    icon: '📱',
    description: 'Phone cases, laptop sleeves, tablet covers',
    productCount: 600,
    startingPrice: 15.99,
    trending: true,
    popular: false,
    gradient: 'from-cyan-400 to-blue-600',
    subcategories: ['Phone Cases', 'Laptop Sleeves', 'AirPod Cases', 'PopSockets']
  },
  {
    id: 8,
    name: 'Seasonal & Holidays',
    icon: '🎄',
    description: 'Christmas, Halloween, birthdays, occasions',
    productCount: 550,
    startingPrice: 12.99,
    trending: false,
    popular: true,
    gradient: 'from-red-400 to-green-600',
    subcategories: ['Christmas', 'Halloween', 'Birthday', 'Valentine\'s']
  },
  {
    id: 9,
    name: 'Sports & Fitness',
    icon: '⚽',
    description: 'Gym bags, sports bottles, workout gear',
    productCount: 400,
    startingPrice: 18.99,
    trending: false,
    popular: false,
    gradient: 'from-orange-400 to-red-600',
    subcategories: ['Gym Bags', 'Sports Bottles', 'Workout Shirts', 'Headbands']
  },
  {
    id: 10,
    name: 'Pet Products',
    icon: '🐾',
    description: 'Pet bowls, bandanas, toys, pet apparel',
    productCount: 300,
    startingPrice: 13.99,
    trending: true,
    popular: false,
    gradient: 'from-purple-400 to-indigo-600',
    subcategories: ['Pet Bowls', 'Bandanas', 'Pet Toys', 'Pet Shirts']
  },
  {
    id: 11,
    name: 'Kitchen & Dining',
    icon: '🍽️',
    description: 'Aprons, cutting boards, coasters, placemats',
    productCount: 380,
    startingPrice: 14.99,
    trending: false,
    popular: false,
    gradient: 'from-red-400 to-pink-600',
    subcategories: ['Aprons', 'Cutting Boards', 'Coasters', 'Placemats']
  },
  {
    id: 12,
    name: 'Jewelry & Wearables',
    icon: '💍',
    description: 'Necklaces, bracelets, rings, watches',
    productCount: 250,
    startingPrice: 19.99,
    trending: false,
    popular: false,
    gradient: 'from-yellow-400 to-pink-600',
    subcategories: ['Necklaces', 'Bracelets', 'Rings', 'Custom Watches']
  }
];

// Sample products data (in a real app, this would come from an API)
const allProducts: Product[] = categories.flatMap(category => 
  category.subcategories.flatMap(subcat => 
    Array.from({ length: 5 }, (_, index) => ({ // 5 products per subcategory for demo
      id: category.id * 1000 + subcat.charCodeAt(0) * 10 + index,
      categoryId: category.id,
      subcategory: subcat,
      name: `${subcat} ${index + 1}`,
      description: `High-quality customizable ${subcat.toLowerCase()} in various styles and colors.`,
      price: category.startingPrice + index * 2.5,
      imagePlaceholder: `${subcat.charAt(0)}-${index + 1}`, // For placeholder text
      rating: Math.random() * 2 + 3, // 3-5 stars
      reviewCount: Math.floor(Math.random() * 1000),
      trending: Math.random() > 0.7,
      popular: Math.random() > 0.5,
    }))
  )
);

export default function CategoryDetailPage() {
  const params = useParams();
  const categoryId = parseInt(params.id as string, 10);
  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'price-asc' | 'price-desc' | 'rating' | 'popular'>('popular');

  useEffect(() => {
    const foundCategory = categories.find(cat => cat.id === categoryId);
    if (foundCategory) {
      setCategory(foundCategory);
      const categoryProducts = allProducts.filter(prod => prod.categoryId === categoryId);
      setProducts(categoryProducts);
    }
  }, [categoryId]);

  if (!category) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Category Not Found</h1>
          <p className="text-gray-600">Please check the URL or go back to the categories page.</p>
        </div>
      </div>
    );
  }

  const filteredProducts = products
    .filter(prod => 
      (prod.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
       prod.description.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (!selectedSubcategory || prod.subcategory === selectedSubcategory)
    )
    .sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'popular') return b.reviewCount - a.reviewCount;
      return 0;
    });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className={`bg-gradient-to-r ${category.gradient} text-white py-20 px-4`}>
        <div className="max-w-7xl mx-auto text-center space-y-6">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Package className="w-10 h-10" />
            <h1 className="text-5xl md:text-6xl font-bold">{category.name}</h1>
          </div>
          <p className="text-2xl text-white/90 max-w-3xl mx-auto">
            {category.description}
          </p>
          <div className="flex justify-center gap-12 pt-8 flex-wrap">
            <div>
              <div className="text-4xl font-bold">{category.productCount}</div>
              <div className="text-white/80">Products</div>
            </div>
            <div>
              <div className="text-4xl font-bold">${category.startingPrice.toFixed(2)}+</div>
              <div className="text-white/80">Starting Price</div>
            </div>
            <div>
              <div className="text-4xl font-bold">{category.subcategories.length}</div>
              <div className="text-white/80">Subcategories</div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
          {/* Search Bar */}
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search products in ${category.name}...`}
              className="w-full pl-12 pr-4 py-3 rounded-full text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-md"
            />
          </div>

          {/* Subcategory Filters */}
          <div className="flex items-center gap-3">
            <Filter className="w-5 h-5 text-gray-600" />
            <select
              value={selectedSubcategory || ''}
              onChange={(e) => setSelectedSubcategory(e.target.value || null)}
              className="px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">All Subcategories</option>
              {category.subcategories.map(sub => (
                <option key={sub} value={sub}>{sub}</option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div className="flex items-center gap-3">
            <ArrowUpDown className="w-5 h-5 text-gray-600" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="popular">Most Popular</option>
              <option value="rating">Highest Rated</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Products Grid */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            {searchQuery || selectedSubcategory ? `Results (${filteredProducts.length})` : 'All Products'}
          </h2>
          {filteredProducts.length > 0 ? (
            <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all group cursor-pointer transform hover:-translate-y-1"
                >
                  {/* Placeholder Image */}
                  <div className="h-48 bg-gray-200 flex items-center justify-center text-6xl font-bold text-gray-400 group-hover:scale-105 transition">
                    {product.imagePlaceholder}
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-bold text-gray-900 mb-1 flex items-center justify-between">
                      {product.name}
                      <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-purple-600 group-hover:translate-x-1 transition" />
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">{product.subcategory}</p>
                    <p className="text-sm text-gray-500 mb-3 line-clamp-2">{product.description}</p>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-purple-600 font-bold">${product.price.toFixed(2)}</span>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: Math.floor(product.rating) }).map((_, i) => (
                          <Star key={i} className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        ))}
                        {product.rating % 1 > 0 && <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" style={{ clipPath: 'inset(0 50% 0 0)' }} />}
                        <span className="text-xs text-gray-500">({product.reviewCount})</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {product.trending && (
                        <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                          <Zap className="w-3 h-3" /> Trending
                        </span>
                      )}
                      {product.popular && (
                        <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                          <Star className="w-3 h-3" /> Popular
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="text-8xl mb-6">🔍</div>
              <h3 className="text-3xl font-bold text-gray-800 mb-4">No Products Found</h3>
              <p className="text-gray-600 text-lg mb-8">
                Try adjusting your search or filters.
              </p>
              <button
                onClick={() => { setSearchQuery(''); setSelectedSubcategory(null); }}
                className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-bold hover:shadow-xl transition"
              >
                Reset Filters
              </button>
            </div>
          )}
        </section>

        {/* CTA Banner */}
        <section className="mt-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl p-12 text-white text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Customize?</h2>
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            Pick a product and start designing your unique item today!
          </p>
          <button className="px-8 py-4 bg-white text-purple-600 rounded-full font-bold text-lg hover:bg-gray-100 transition shadow-xl">
            Browse Templates
          </button>
        </section>
      </div>
    </div>
  );
}