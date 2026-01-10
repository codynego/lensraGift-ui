"use client"
import { useState } from 'react';
import { Search, TrendingUp, ChevronRight, Star, Sparkles, Package, Zap } from 'lucide-react';

export default function CategoriesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [hoveredCategory, setHoveredCategory] = useState<number | null>(null);

  const categories = [
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

  const filteredCategories = categories.filter(cat =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cat.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const trendingCategories = categories.filter(cat => cat.trending);
  const popularCategories = categories.filter(cat => cat.popular);

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white py-20 px-4">
        <div className="max-w-7xl mx-auto text-center space-y-6">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Package className="w-10 h-10" />
            <h1 className="text-5xl md:text-6xl font-bold">Browse Categories</h1>
          </div>
          <p className="text-2xl text-blue-100 max-w-3xl mx-auto">
            Explore our wide range of customizable products. From mugs to apparel, find the perfect item to personalize.
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mt-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search categories... (e.g., 'mugs', 'apparel', 'home')"
                className="w-full pl-14 pr-4 py-5 rounded-full text-gray-900 text-lg focus:outline-none focus:ring-4 focus:ring-white/50 shadow-2xl"
              />
            </div>
          </div>

          {/* Stats */}
          <div className="flex justify-center gap-12 pt-8 flex-wrap">
            <div>
              <div className="text-4xl font-bold">{categories.length}</div>
              <div className="text-blue-100">Categories</div>
            </div>
            <div>
              <div className="text-4xl font-bold">
                {categories.reduce((sum, cat) => sum + cat.productCount, 0).toLocaleString()}
              </div>
              <div className="text-blue-100">Products</div>
            </div>
            <div>
              <div className="text-4xl font-bold">1000+</div>
              <div className="text-blue-100">Templates</div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-12">
        
        {/* Trending Categories */}
        {!searchQuery && trendingCategories.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <TrendingUp className="w-8 h-8 text-purple-600" />
              <h2 className="text-3xl font-bold text-gray-900">Trending Now</h2>
              <Sparkles className="w-6 h-6 text-yellow-500" />
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {trendingCategories.map((category) => (
                <div
                  key={category.id}
                  className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all group cursor-pointer transform hover:-translate-y-1"
                >
                  <div className={`bg-gradient-to-br ${category.gradient} h-40 flex items-center justify-center text-8xl relative`}>
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1">
                      <Zap className="w-3 h-3 text-orange-500" />
                      <span className="text-xs font-bold text-gray-900">Hot</span>
                    </div>
                    <div className="group-hover:scale-110 transition">{category.icon}</div>
                  </div>
                  <div className="p-5">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{category.name}</h3>
                    <p className="text-sm text-gray-600 mb-3">{category.description}</p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">{category.productCount} products</span>
                      <span className="text-purple-600 font-semibold">From ${category.startingPrice}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Popular Categories */}
        {!searchQuery && popularCategories.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <Star className="w-8 h-8 text-yellow-500 fill-yellow-500" />
              <h2 className="text-3xl font-bold text-gray-900">Most Popular</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {popularCategories.slice(0, 3).map((category) => (
                <div
                  key={category.id}
                  className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all group cursor-pointer"
                >
                  <div className={`bg-gradient-to-br ${category.gradient} h-56 flex items-center justify-center text-9xl`}>
                    <div className="group-hover:scale-110 transition">{category.icon}</div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-2xl font-bold text-gray-900">{category.name}</h3>
                      <span className="bg-yellow-100 text-yellow-700 text-xs font-bold px-3 py-1 rounded-full">
                        Popular
                      </span>
                    </div>
                    <p className="text-gray-600 mb-4">{category.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500 text-sm">{category.productCount} products</span>
                      <span className="text-purple-600 font-bold text-lg">From ${category.startingPrice}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* All Categories */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-gray-900">
              {searchQuery ? `Search Results (${filteredCategories.length})` : 'All Categories'}
            </h2>
            {!searchQuery && (
              <div className="text-gray-500">
                {categories.length} categories available
              </div>
            )}
          </div>

          {filteredCategories.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCategories.map((category) => (
                <div
                  key={category.id}
                  onMouseEnter={() => setHoveredCategory(category.id)}
                  onMouseLeave={() => setHoveredCategory(null)}
                  className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all group cursor-pointer"
                >
                  <div className={`bg-gradient-to-br ${category.gradient} h-48 flex items-center justify-center text-8xl relative overflow-hidden`}>
                    {category.trending && (
                      <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        Trending
                      </div>
                    )}
                    {category.popular && (
                      <div className="absolute top-3 right-3 bg-yellow-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                        ★ Popular
                      </div>
                    )}
                    <div className="group-hover:scale-110 transition-transform duration-300">
                      {category.icon}
                    </div>
                    
                    {/* Hover Overlay with Subcategories */}
                    {hoveredCategory === category.id && (
                      <div className="absolute inset-0 bg-black/80 flex items-center justify-center p-6 animate-in fade-in duration-200">
                        <div className="text-center">
                          <div className="text-white font-bold mb-3 text-lg">Quick Browse</div>
                          <div className="grid grid-cols-2 gap-2">
                            {category.subcategories.map((sub, idx) => (
                              <button
                                key={idx}
                                className="bg-white/20 backdrop-blur-sm text-white px-3 py-2 rounded-lg text-sm hover:bg-white/30 transition"
                              >
                                {sub}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="p-5">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center justify-between">
                      {category.name}
                      <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-purple-600 group-hover:translate-x-1 transition" />
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">{category.description}</p>
                    <div className="flex items-center justify-between pt-3 border-t">
                      <div>
                        <div className="text-xs text-gray-500">Starting at</div>
                        <div className="text-lg font-bold text-purple-600">${category.startingPrice}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-gray-500">Products</div>
                        <div className="text-lg font-bold text-gray-900">{category.productCount}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="text-8xl mb-6">🔍</div>
              <h3 className="text-3xl font-bold text-gray-800 mb-4">No Categories Found</h3>
              <p className="text-gray-600 text-lg mb-8">
                We couldn't find any categories matching "{searchQuery}"
              </p>
              <button
                onClick={() => setSearchQuery('')}
                className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-bold hover:shadow-xl transition"
              >
                Clear Search
              </button>
            </div>
          )}
        </section>

        {/* CTA Banner */}
        {!searchQuery && (
          <section className="mt-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-white text-center">
            <h2 className="text-4xl font-bold mb-4">Can't Find What You're Looking For?</h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Start designing your custom product from scratch with our easy-to-use design editor
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <button className="px-8 py-4 bg-white text-purple-600 rounded-full font-bold text-lg hover:bg-gray-100 transition shadow-xl">
                Start Designing
              </button>
              <button className="px-8 py-4 bg-white/20 backdrop-blur-sm border-2 border-white text-white rounded-full font-bold text-lg hover:bg-white/30 transition">
                Contact Us
              </button>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}