"use client"
import { useState } from 'react';
import { Search, SlidersHorizontal, Heart, Star, ChevronDown, Grid3x3, List } from 'lucide-react';

const products = [
  { 
    id: "mug_white", 
    name: "White Ceramic Mug", 
    image: "/mockups/mug-white.png", 
    price: 2500,
    rating: 4.8,
    reviews: 324,
    category: "Drinkware",
    sale: false
  },
  { 
    id: "shirt_white", 
    name: "Premium Cotton T-Shirt", 
    image: "/mockups/shirt-white.png", 
    price: 4000,
    rating: 4.9,
    reviews: 567,
    category: "Apparel",
    sale: true,
    salePrice: 3200
  },
  { 
    id: "frame_wood", 
    name: "Wooden Photo Frame", 
    image: "/mockups/frame.png", 
    price: 3000,
    rating: 4.7,
    reviews: 189,
    category: "Home Decor",
    sale: false
  },
  { 
    id: "hoodie_black", 
    name: "Classic Pullover Hoodie", 
    image: "/mockups/hoodie.png", 
    price: 6500,
    rating: 4.9,
    reviews: 892,
    category: "Apparel",
    sale: false
  },
  { 
    id: "canvas_print", 
    name: "Canvas Wall Art 16x20", 
    image: "/mockups/canvas.png", 
    price: 5500,
    rating: 4.6,
    reviews: 234,
    category: "Home Decor",
    sale: true,
    salePrice: 4400
  },
  { 
    id: "tote_bag", 
    name: "Canvas Tote Bag", 
    image: "/mockups/tote.png", 
    price: 3500,
    rating: 4.8,
    reviews: 445,
    category: "Accessories",
    sale: false
  },
  { 
    id: "phone_case", 
    name: "Slim Phone Case", 
    image: "/mockups/phone-case.png", 
    price: 2800,
    rating: 4.7,
    reviews: 678,
    category: "Accessories",
    sale: false
  },
  { 
    id: "notebook", 
    name: "Spiral Notebook A5", 
    image: "/mockups/notebook.png", 
    price: 2200,
    rating: 4.8,
    reviews: 312,
    category: "Stationery",
    sale: true,
    salePrice: 1800
  },
  { 
    id: "pillow", 
    name: "Throw Pillow Cover", 
    image: "/mockups/pillow.png", 
    price: 3800,
    rating: 4.9,
    reviews: 523,
    category: "Home Decor",
    sale: false
  },
];

export default function ProductsPage() {
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('featured');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [favorites, setFavorites] = useState<string[]>([]);

  const categories = ['All Products', 'Apparel', 'Drinkware', 'Home Decor', 'Accessories', 'Stationery'];

  const toggleFavorite = (id: string) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(fid => fid !== id) : [...prev, id]
    );
  };

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center py-3 text-sm font-medium">
        🎨 Create Your Custom Design Today | Free Shipping Over ₦10,000
      </div>

      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-3 text-sm text-gray-600">
          <a href="/" className="hover:text-red-600">Home</a> / <span className="text-gray-900 font-medium">Products</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Sidebar Filters */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="bg-white rounded-lg border p-6 sticky top-6">
              <h3 className="font-bold text-lg mb-4">Categories</h3>
              <ul className="space-y-2">
                {categories.map((cat, idx) => (
                  <li key={idx}>
                    <button
                      onClick={() => setSelectedCategory(idx === 0 ? 'all' : cat)}
                      className={`w-full text-left px-3 py-2 rounded hover:bg-gray-100 transition ${
                        (idx === 0 && selectedCategory === 'all') || selectedCategory === cat
                          ? 'bg-red-50 text-red-600 font-medium'
                          : 'text-gray-700'
                      }`}
                    >
                      {cat}
                    </button>
                  </li>
                ))}
              </ul>

              <hr className="my-6" />

              <h3 className="font-bold text-lg mb-4">Price Range</h3>
              <div className="space-y-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded" />
                  <span className="text-sm">Under ₦3,000</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded" />
                  <span className="text-sm">₦3,000 - ₦5,000</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded" />
                  <span className="text-sm">Over ₦5,000</span>
                </label>
              </div>

              <hr className="my-6" />

              <h3 className="font-bold text-lg mb-4">Rating</h3>
              <div className="space-y-3">
                {[5, 4, 3].map(rating => (
                  <label key={rating} className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="rounded" />
                    <div className="flex items-center gap-1">
                      {[...Array(rating)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      ))}
                      <span className="text-sm ml-1">& Up</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </aside>

          {/* Products Section */}
          <div className="flex-1">
            {/* Top Bar */}
            <div className="bg-white rounded-lg border p-4 mb-6">
              <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold mb-1">All Products</h1>
                  <p className="text-sm text-gray-600">{filteredProducts.length} products available</p>
                </div>

                <div className="flex gap-3 items-center">
                  {/* Sort Dropdown */}
                  <div className="relative">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="appearance-none border rounded-lg px-4 py-2 pr-10 text-sm focus:outline-none focus:border-red-600"
                    >
                      <option value="featured">Featured</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                      <option value="rating">Top Rated</option>
                      <option value="newest">Newest</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" />
                  </div>

                  {/* View Toggle */}
                  <div className="flex gap-1 border rounded-lg p-1">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 rounded ${viewMode === 'grid' ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
                    >
                      <Grid3x3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 rounded ${viewMode === 'list' ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
                    >
                      <List className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className={`bg-white rounded-lg border hover:shadow-xl transition group cursor-pointer ${
                    viewMode === 'list' ? 'flex gap-6' : ''
                  }`}
                >
                  <div className={`relative bg-gray-50 ${viewMode === 'list' ? 'w-48 h-48' : 'h-64'} flex items-center justify-center overflow-hidden`}>
                    {/* Placeholder for product image */}
                    <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-6xl">
                      {product.category === 'Apparel' ? '👕' : product.category === 'Drinkware' ? '☕' : product.category === 'Home Decor' ? '🖼️' : product.category === 'Accessories' ? '👜' : '📓'}
                    </div>
                    
                    {product.sale && (
                      <span className="absolute top-3 left-3 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                        SALE
                      </span>
                    )}
                    
                    <button
                      onClick={() => toggleFavorite(product.id)}
                      className="absolute top-3 right-3 bg-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition shadow-lg hover:scale-110"
                    >
                      <Heart className={`w-5 h-5 ${favorites.includes(product.id) ? 'fill-red-600 text-red-600' : 'text-gray-600'}`} />
                    </button>
                  </div>

                  <div className={`p-4 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                    <div className="text-xs text-gray-500 mb-1">{product.category}</div>
                    <h3 className="font-semibold text-base mb-2 line-clamp-2 group-hover:text-red-600 transition">
                      {product.name}
                    </h3>
                    
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{product.rating}</span>
                      </div>
                      <span className="text-xs text-gray-500">({product.reviews} reviews)</span>
                    </div>

                    <div className="flex items-center gap-3 mb-4">
                      {product.sale && product.salePrice ? (
                        <>
                          <span className="text-xl font-bold text-red-600">₦{product.salePrice.toLocaleString()}</span>
                          <span className="text-sm text-gray-400 line-through">₦{product.price.toLocaleString()}</span>
                        </>
                      ) : (
                        <span className="text-xl font-bold text-gray-900">₦{product.price.toLocaleString()}</span>
                      )}
                    </div>

                    <button className="w-full px-4 py-2.5 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition transform group-hover:scale-105">
                      Customize Now
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Load More */}
            <div className="mt-8 text-center">
              <button className="px-8 py-3 border-2 border-gray-300 rounded-lg font-medium hover:border-red-600 hover:text-red-600 transition">
                Load More Products
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-12 mt-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Can't Find What You're Looking For?</h2>
          <p className="text-lg mb-6">Contact us and we'll help you create the perfect custom product</p>
          <button className="px-8 py-3 bg-white text-purple-600 rounded-full font-bold hover:bg-gray-100 transition shadow-xl">
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
}