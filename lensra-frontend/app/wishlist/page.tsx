"use client"
import { useState } from 'react';
import { Heart, Trash2, ShoppingCart, Share2, X, Star, Package, Eye, ChevronDown, Filter, Grid, List } from 'lucide-react';

export default function LensraWishlist() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [sortBy, setSortBy] = useState('recent');
  const [showShareModal, setShowShareModal] = useState(false);

  const [wishlistItems, setWishlistItems] = useState([
    {
      id: 1,
      name: 'Custom Coffee Mug - Morning Vibes',
      price: 12.99,
      originalPrice: 16.99,
      rating: 4.8,
      reviews: 234,
      img: '☕',
      inStock: true,
      dateAdded: '2025-01-08',
      category: 'Mugs',
      customized: true
    },
    {
      id: 2,
      name: 'Vintage Print T-Shirt',
      price: 19.99,
      originalPrice: 24.99,
      rating: 4.9,
      reviews: 567,
      img: '👕',
      inStock: true,
      dateAdded: '2025-01-06',
      category: 'Apparel',
      customized: false
    },
    {
      id: 3,
      name: 'Canvas Wall Art 16x20',
      price: 34.99,
      originalPrice: 44.99,
      rating: 4.7,
      reviews: 123,
      img: '🖼️',
      inStock: true,
      dateAdded: '2025-01-05',
      category: 'Home Decor',
      customized: true
    },
    {
      id: 4,
      name: 'Premium Hoodie - Custom Design',
      price: 39.99,
      originalPrice: 49.99,
      rating: 4.9,
      reviews: 890,
      img: '🧥',
      inStock: false,
      dateAdded: '2025-01-03',
      category: 'Apparel',
      customized: true
    },
    {
      id: 5,
      name: 'Personalized Phone Case',
      price: 16.99,
      originalPrice: 19.99,
      rating: 4.6,
      reviews: 456,
      img: '📱',
      inStock: true,
      dateAdded: '2025-01-02',
      category: 'Accessories',
      customized: true
    },
    {
      id: 6,
      name: 'Canvas Tote Bag',
      price: 18.99,
      originalPrice: 22.99,
      rating: 4.8,
      reviews: 345,
      img: '👜',
      inStock: true,
      dateAdded: '2024-12-28',
      category: 'Accessories',
      customized: false
    }
  ]);

  const removeItem = (id: number) => {
    setWishlistItems(wishlistItems.filter(item => item.id !== id));
    setSelectedItems(selectedItems.filter(itemId => itemId !== id));
  };

  const addToCart = (id: number) => {
    const item = wishlistItems.find(item => item.id === id);
    alert(`Added "${item?.name}" to cart!`);
  };

  const addAllToCart = () => {
    alert(`Added ${wishlistItems.filter(item => item.inStock).length} items to cart!`);
  };

  const toggleSelectItem = (id: number) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter(itemId => itemId !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  const selectAll = () => {
    if (selectedItems.length === wishlistItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(wishlistItems.map(item => item.id));
    }
  };

  const removeSelected = () => {
    if (confirm(`Remove ${selectedItems.length} items from wishlist?`)) {
      setWishlistItems(wishlistItems.filter(item => !selectedItems.includes(item.id)));
      setSelectedItems([]);
    }
  };

  const totalValue = wishlistItems.reduce((sum, item) => sum + item.price, 0);
  const totalSavings = wishlistItems.reduce((sum, item) => sum + (item.originalPrice - item.price), 0);

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* Header */}
      <section className="bg-gradient-to-r from-pink-600 to-purple-600 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Heart className="w-8 h-8 fill-white" />
                <h1 className="text-4xl md:text-5xl font-bold">My Wishlist</h1>
              </div>
              <p className="text-pink-100 text-lg">
                {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} saved for later
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowShareModal(true)}
                className="px-6 py-3 bg-white/20 backdrop-blur-sm border-2 border-white text-white rounded-full font-semibold hover:bg-white/30 transition flex items-center gap-2"
              >
                <Share2 className="w-5 h-5" />
                Share Wishlist
              </button>
              <button
                onClick={addAllToCart}
                disabled={wishlistItems.filter(item => item.inStock).length === 0}
                className="px-6 py-3 bg-white text-purple-600 rounded-full font-semibold hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <ShoppingCart className="w-5 h-5" />
                Add All to Cart
              </button>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-8">
        
        {wishlistItems.length === 0 ? (
          /* Empty State */
          <div className="text-center py-20">
            <div className="text-8xl mb-6">💔</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Your Wishlist is Empty</h2>
            <p className="text-gray-600 text-lg mb-8">
              Start adding items you love and save them for later!
            </p>
            <button className="px-8 py-4 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-full font-bold text-lg hover:shadow-xl transition">
              Browse Products
            </button>
          </div>
        ) : (
          <>
            {/* Stats & Controls */}
            <div className="bg-white rounded-xl p-6 shadow-lg mb-6">
              <div className="grid md:grid-cols-3 gap-6 mb-6">
                <div className="text-center p-4 bg-gradient-to-br from-pink-50 to-purple-50 rounded-lg">
                  <div className="text-3xl font-bold text-purple-600">{wishlistItems.length}</div>
                  <div className="text-gray-600 text-sm">Total Items</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg">
                  <div className="text-3xl font-bold text-green-600">${totalValue.toFixed(2)}</div>
                  <div className="text-gray-600 text-sm">Total Value</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-red-50 rounded-lg">
                  <div className="text-3xl font-bold text-orange-600">${totalSavings.toFixed(2)}</div>
                  <div className="text-gray-600 text-sm">Total Savings</div>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t">
                <div className="flex items-center gap-3">
                  <button
                    onClick={selectAll}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium text-sm transition"
                  >
                    {selectedItems.length === wishlistItems.length ? 'Deselect All' : 'Select All'}
                  </button>
                  {selectedItems.length > 0 && (
                    <button
                      onClick={removeSelected}
                      className="px-4 py-2 bg-red-100 text-red-600 hover:bg-red-200 rounded-lg font-medium text-sm transition flex items-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      Remove ({selectedItems.length})
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <div className="relative">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="appearance-none px-4 py-2 pr-10 bg-gray-100 rounded-lg font-medium text-sm cursor-pointer hover:bg-gray-200 transition"
                    >
                      <option value="recent">Recently Added</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                      <option value="name">Name A-Z</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" />
                  </div>

                  <div className="flex bg-gray-100 rounded-lg p-1">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white shadow' : 'hover:bg-gray-200'} transition`}
                    >
                      <Grid className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 rounded ${viewMode === 'list' ? 'bg-white shadow' : 'hover:bg-gray-200'} transition`}
                    >
                      <List className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Wishlist Items */}
            <div className={viewMode === 'grid' ? 'grid md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
              {wishlistItems.map((item) => (
                viewMode === 'grid' ? (
                  /* Grid View */
                  <div key={item.id} className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition group relative">
                    <div className="absolute top-3 left-3 z-10">
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(item.id)}
                        onChange={() => toggleSelectItem(item.id)}
                        className="w-5 h-5 rounded cursor-pointer"
                      />
                    </div>

                    {item.customized && (
                      <div className="absolute top-3 right-3 bg-purple-600 text-white text-xs font-bold px-2 py-1 rounded-full z-10">
                        Custom
                      </div>
                    )}

                    <div className="relative bg-gray-100 h-56 flex items-center justify-center text-7xl group-hover:bg-gray-200 transition">
                      {item.img}
                      <button
                        onClick={() => removeItem(item.id)}
                        className="absolute top-3 right-3 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition hover:bg-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="p-4">
                      <div className="text-xs text-gray-500 mb-1">{item.category}</div>
                      <h3 className="font-bold text-lg mb-2 line-clamp-2">{item.name}</h3>

                      <div className="flex items-center gap-1 mb-3">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{item.rating}</span>
                        <span className="text-xs text-gray-500">({item.reviews})</span>
                      </div>

                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-2xl font-bold text-purple-600">${item.price}</span>
                        <span className="text-sm text-gray-400 line-through">${item.originalPrice}</span>
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-semibold">
                          {Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}% OFF
                        </span>
                      </div>

                      {!item.inStock && (
                        <div className="bg-red-50 text-red-600 text-sm font-semibold px-3 py-2 rounded-lg mb-3 flex items-center gap-2">
                          <Package className="w-4 h-4" />
                          Out of Stock
                        </div>
                      )}

                      <div className="flex gap-2">
                        <button
                          onClick={() => addToCart(item.id)}
                          disabled={!item.inStock}
                          className="flex-1 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                          <ShoppingCart className="w-4 h-4" />
                          Add to Cart
                        </button>
                        <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition">
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="text-xs text-gray-400 mt-3">
                        Added {new Date(item.dateAdded).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ) : (
                  /* List View */
                  <div key={item.id} className="bg-white rounded-xl p-4 shadow-lg hover:shadow-xl transition flex items-center gap-4">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(item.id)}
                      onChange={() => toggleSelectItem(item.id)}
                      className="w-5 h-5 rounded cursor-pointer"
                    />

                    <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center text-4xl flex-shrink-0">
                      {item.img}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-bold text-lg">{item.name}</h3>
                            {item.customized && (
                              <span className="bg-purple-100 text-purple-600 text-xs font-bold px-2 py-1 rounded-full">
                                Custom
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-gray-500">{item.category}</div>
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-red-500 hover:text-red-600 p-2"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>

                      <div className="flex items-center gap-4 mb-3">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium">{item.rating}</span>
                          <span className="text-xs text-gray-500">({item.reviews})</span>
                        </div>
                        <div className="text-xs text-gray-400">
                          Added {new Date(item.dateAdded).toLocaleDateString()}
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl font-bold text-purple-600">${item.price}</span>
                          <span className="text-sm text-gray-400 line-through">${item.originalPrice}</span>
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-semibold">
                            {Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}% OFF
                          </span>
                          {!item.inStock && (
                            <span className="text-sm text-red-600 font-semibold">Out of Stock</span>
                          )}
                        </div>

                        <div className="flex gap-2">
                          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => addToCart(item.id)}
                            disabled={!item.inStock}
                            className="px-6 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                          >
                            <ShoppingCart className="w-4 h-4" />
                            Add to Cart
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              ))}
            </div>
          </>
        )}
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold">Share Your Wishlist</h3>
              <button
                onClick={() => setShowShareModal(false)}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <p className="text-gray-600 mb-6">
              Share your wishlist with friends and family so they know what you'd love to receive!
            </p>

            <div className="space-y-3 mb-6">
              <button className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition">
                Share via Email
              </button>
              <button className="w-full py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition">
                Share on WhatsApp
              </button>
              <button className="w-full py-3 bg-gray-800 text-white rounded-lg font-semibold hover:bg-gray-900 transition">
                Copy Link
              </button>
            </div>

            <button
              onClick={() => setShowShareModal(false)}
              className="w-full py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Recommendations */}
      {wishlistItems.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8">You Might Also Like</h2>
            <div className="grid md:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-gray-50 rounded-xl p-4 text-center hover:shadow-lg transition cursor-pointer">
                  <div className="text-6xl mb-4">🎁</div>
                  <h3 className="font-bold mb-2">Recommended Item {i}</h3>
                  <p className="text-purple-600 font-bold">$24.99</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}