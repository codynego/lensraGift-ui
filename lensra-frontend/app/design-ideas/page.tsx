"use client"
import { useState } from 'react';
import { Search, Sparkles, TrendingUp, Heart, Clock, Star, ChevronRight, Filter, Download, Eye } from 'lucide-react';

export default function LensraDesignIdeas() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('trending');

  const categories = [
    { id: 'all', name: 'All Designs', icon: '🎨', count: 1247 },
    { id: 'quotes', name: 'Quotes & Typography', icon: '💬', count: 342 },
    { id: 'funny', name: 'Funny & Humor', icon: '😂', count: 289 },
    { id: 'nature', name: 'Nature & Animals', icon: '🌿', count: 198 },
    { id: 'abstract', name: 'Abstract & Patterns', icon: '✨', count: 156 },
    { id: 'minimalist', name: 'Minimalist', icon: '⚪', count: 234 },
    { id: 'holiday', name: 'Holidays & Seasons', icon: '🎄', count: 167 },
    { id: 'vintage', name: 'Vintage & Retro', icon: '📻', count: 123 },
    { id: 'sports', name: 'Sports & Fitness', icon: '⚽', count: 145 },
    { id: 'food', name: 'Food & Drink', icon: '🍕', count: 178 }
  ];

  const filters = [
    { id: 'trending', name: 'Trending', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'newest', name: 'Newest', icon: <Clock className="w-4 h-4" /> },
    { id: 'popular', name: 'Most Popular', icon: <Star className="w-4 h-4" /> },
    { id: 'favorites', name: 'Staff Picks', icon: <Heart className="w-4 h-4" /> }
  ];

  const designs = [
    { 
      id: 1, 
      title: 'Coffee First', 
      category: 'quotes',
      style: 'bg-gradient-to-br from-amber-600 to-amber-800',
      text: '☕',
      subtitle: 'But first, coffee',
      likes: 1234,
      views: 5678,
      trending: true,
      products: ['Mug', 'T-Shirt', 'Tote Bag']
    },
    { 
      id: 2, 
      title: 'Mountain Calling', 
      category: 'nature',
      style: 'bg-gradient-to-br from-green-700 to-blue-900',
      text: '⛰️',
      subtitle: 'The mountains are calling',
      likes: 892,
      views: 4321,
      trending: true,
      products: ['Hoodie', 'Canvas Print', 'Phone Case']
    },
    { 
      id: 3, 
      title: 'Sarcasm Loading', 
      category: 'funny',
      style: 'bg-gradient-to-br from-purple-600 to-pink-600',
      text: '🤖',
      subtitle: 'Sarcasm Loading... 99%',
      likes: 2145,
      views: 8932,
      trending: true,
      products: ['T-Shirt', 'Mug', 'Sticker']
    },
    { 
      id: 4, 
      title: 'Cosmic Vibes', 
      category: 'abstract',
      style: 'bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900',
      text: '🌌',
      subtitle: 'Lost in space',
      likes: 1567,
      views: 6543,
      trending: true,
      products: ['Phone Case', 'Canvas Print', 'Notebook']
    },
    { 
      id: 5, 
      title: 'Plant Parent', 
      category: 'nature',
      style: 'bg-gradient-to-br from-green-500 to-emerald-700',
      text: '🌱',
      subtitle: 'Plant Parent',
      likes: 1089,
      views: 4567,
      trending: false,
      products: ['Tote Bag', 'Mug', 'T-Shirt']
    },
    { 
      id: 6, 
      title: 'Good Vibes Only', 
      category: 'quotes',
      style: 'bg-gradient-to-br from-yellow-400 to-orange-500',
      text: '✨',
      subtitle: 'Good Vibes Only',
      likes: 3421,
      views: 12345,
      trending: true,
      products: ['T-Shirt', 'Tote Bag', 'Phone Case']
    },
    { 
      id: 7, 
      title: 'Retro Wave', 
      category: 'vintage',
      style: 'bg-gradient-to-br from-pink-500 via-purple-500 to-cyan-500',
      text: '🌆',
      subtitle: '80s Aesthetic',
      likes: 1876,
      views: 7654,
      trending: true,
      products: ['Hoodie', 'Canvas Print', 'Sticker']
    },
    { 
      id: 8, 
      title: 'Pizza Love', 
      category: 'food',
      style: 'bg-gradient-to-br from-red-600 to-yellow-600',
      text: '🍕',
      subtitle: 'Pizza is Life',
      likes: 2341,
      views: 9876,
      trending: false,
      products: ['T-Shirt', 'Mug', 'Tote Bag']
    },
    { 
      id: 9, 
      title: 'Zen Garden', 
      category: 'minimalist',
      style: 'bg-gradient-to-br from-gray-200 to-gray-400',
      text: '🪨',
      subtitle: 'Find peace',
      likes: 987,
      views: 3456,
      trending: false,
      products: ['Canvas Print', 'Notebook', 'Phone Case']
    },
    { 
      id: 10, 
      title: 'Gym Beast Mode', 
      category: 'sports',
      style: 'bg-gradient-to-br from-red-700 to-black',
      text: '💪',
      subtitle: 'Beast Mode ON',
      likes: 1654,
      views: 6789,
      trending: true,
      products: ['T-Shirt', 'Hoodie', 'Water Bottle']
    },
    { 
      id: 11, 
      title: 'Winter Wonderland', 
      category: 'holiday',
      style: 'bg-gradient-to-br from-blue-300 to-blue-600',
      text: '❄️',
      subtitle: 'Let it snow',
      likes: 2109,
      views: 8765,
      trending: false,
      products: ['Mug', 'Hoodie', 'Blanket']
    },
    { 
      id: 12, 
      title: 'Cat Life', 
      category: 'nature',
      style: 'bg-gradient-to-br from-orange-400 to-pink-500',
      text: '🐱',
      subtitle: 'Just cat things',
      likes: 2876,
      views: 11234,
      trending: true,
      products: ['T-Shirt', 'Tote Bag', 'Mug']
    }
  ];

  const filteredDesigns = designs.filter(design => {
    const matchesCategory = selectedCategory === 'all' || design.category === selectedCategory;
    const matchesSearch = design.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         design.subtitle.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleUseTemplate = (design: typeof designs[0]) => {
    alert(`Opening editor with "${design.title}" template...`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 text-white py-16 px-4">
        <div className="max-w-7xl mx-auto text-center space-y-6">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-8 h-8" />
            <h1 className="text-5xl md:text-6xl font-bold">Design Ideas & Templates</h1>
          </div>
          <p className="text-2xl text-pink-100">
            1,247 professionally designed templates ready to customize
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mt-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search designs... (e.g., 'coffee', 'motivation', 'funny')"
                className="w-full pl-12 pr-4 py-4 rounded-full text-gray-900 text-lg focus:outline-none focus:ring-4 focus:ring-white/50"
              />
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-4 gap-8">
          
          {/* Sidebar - Categories */}
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 shadow-lg sticky top-4">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Filter className="w-5 h-5" />
                Categories
              </h3>
              <div className="space-y-2">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition ${
                      selectedCategory === cat.id
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{cat.icon}</span>
                      <span className="font-medium text-sm">{cat.name}</span>
                    </div>
                    <span className={`text-xs ${
                      selectedCategory === cat.id ? 'text-purple-200' : 'text-gray-500'
                    }`}>
                      {cat.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-3">
            
            {/* Filter Tabs */}
            <div className="bg-white rounded-xl p-4 shadow-lg mb-6">
              <div className="flex flex-wrap gap-3">
                {filters.map((filter) => (
                  <button
                    key={filter.id}
                    onClick={() => setSelectedFilter(filter.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
                      selectedFilter === filter.id
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    }`}
                  >
                    {filter.icon}
                    {filter.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Results Count */}
            <div className="mb-6">
              <p className="text-gray-600">
                Showing <span className="font-bold text-gray-900">{filteredDesigns.length}</span> designs
                {selectedCategory !== 'all' && (
                  <span> in <span className="font-bold text-purple-600">
                    {categories.find(c => c.id === selectedCategory)?.name}
                  </span></span>
                )}
              </p>
            </div>

            {/* Design Grid */}
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredDesigns.map((design) => (
                <div key={design.id} className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition group">
                  
                  {/* Design Preview */}
                  <div className={`${design.style} h-64 flex flex-col items-center justify-center text-white relative overflow-hidden`}>
                    {design.trending && (
                      <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        Trending
                      </div>
                    )}
                    <button className="absolute top-3 right-3 bg-white/20 backdrop-blur-sm p-2 rounded-full hover:bg-white/30 transition opacity-0 group-hover:opacity-100">
                      <Heart className="w-5 h-5" />
                    </button>
                    <div className="text-8xl mb-4 group-hover:scale-110 transition">{design.text}</div>
                    <div className="text-2xl font-bold text-center px-4">{design.subtitle}</div>
                    
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                      <button
                        onClick={() => handleUseTemplate(design)}
                        className="px-6 py-3 bg-white text-purple-600 rounded-full font-bold hover:bg-gray-100 transition transform scale-90 group-hover:scale-100"
                      >
                        Use This Template
                      </button>
                    </div>
                  </div>

                  {/* Design Info */}
                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-2">{design.title}</h3>
                    
                    {/* Stats */}
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                      <div className="flex items-center gap-1">
                        <Heart className="w-4 h-4" />
                        {design.likes.toLocaleString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        {design.views.toLocaleString()}
                      </div>
                    </div>

                    {/* Product Tags */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      {design.products.map((product, idx) => (
                        <span key={idx} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                          {product}
                        </span>
                      ))}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleUseTemplate(design)}
                        className="flex-1 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition flex items-center justify-center gap-2"
                      >
                        Customize
                        <ChevronRight className="w-4 h-4" />
                      </button>
                      <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition">
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Load More */}
            {filteredDesigns.length > 0 && (
              <div className="text-center mt-12">
                <button className="px-8 py-3 bg-white text-purple-600 border-2 border-purple-600 rounded-full font-bold hover:bg-purple-50 transition">
                  Load More Designs
                </button>
              </div>
            )}

            {/* No Results */}
            {filteredDesigns.length === 0 && (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-2xl font-bold text-gray-700 mb-2">No designs found</h3>
                <p className="text-gray-500 mb-6">Try adjusting your search or filters</p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                  }}
                  className="px-6 py-3 bg-purple-600 text-white rounded-full font-semibold hover:bg-purple-700 transition"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Can't Find What You're Looking For?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Start from scratch with our easy-to-use design editor
          </p>
          <button className="px-8 py-4 bg-white text-purple-600 rounded-full font-bold text-lg hover:bg-gray-100 transition shadow-xl">
            Create Custom Design
          </button>
        </div>
      </section>
    </div>
  );
}