"use client"
import { useState } from 'react';
import { Heart, ShoppingCart, Share2, Star, ChevronLeft, ChevronRight, Check, Truck, Shield, RotateCcw, Ruler, Package, Palette, MessageCircle, ThumbsUp, ChevronDown, Zap } from 'lucide-react';

export default function ProductDetailPage() {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('11oz');
  const [selectedColor, setSelectedColor] = useState('white');
  const [activeTab, setActiveTab] = useState('description');
  const [isWishlisted, setIsWishlisted] = useState(false);

  const images = [
    { img: '☕', color: 'bg-white', label: 'Front View' },
    { img: '☕', color: 'bg-gray-100', label: 'Side View' },
    { img: '☕', color: 'bg-gray-200', label: 'Back View' },
    { img: '☕', color: 'bg-blue-50', label: 'In Use' }
  ];

  const sizes = [
    { id: '11oz', name: '11 oz', price: 12.99, popular: true },
    { id: '15oz', name: '15 oz', price: 14.99, popular: false },
    { id: '20oz', name: '20 oz', price: 16.99, popular: false }
  ];

  const colors = [
    { id: 'white', name: 'White', hex: '#FFFFFF', border: true },
    { id: 'black', name: 'Black', hex: '#000000', border: false },
    { id: 'red', name: 'Red', hex: '#EF4444', border: false },
    { id: 'blue', name: 'Blue', hex: '#3B82F6', border: false },
    { id: 'pink', name: 'Pink', hex: '#EC4899', border: false }
  ];

  const reviews = [
    { name: 'Sarah M.', rating: 5, date: '2 days ago', text: 'Love this mug! The print quality is amazing and it survived the dishwasher perfectly.', verified: true, helpful: 24 },
    { name: 'Mike R.', rating: 5, date: '1 week ago', text: 'Bought this as a gift and my friend absolutely loved it. Great quality and fast shipping!', verified: true, helpful: 18 },
    { name: 'Jennifer L.', rating: 4, date: '2 weeks ago', text: 'Nice mug, colors are vibrant. Only wish it was slightly bigger but overall very happy with it.', verified: true, helpful: 12 }
  ];

  const relatedProducts = [
    { name: 'Classic T-Shirt', price: 19.99, rating: 4.9, img: '👕' },
    { name: 'Tote Bag', price: 18.99, rating: 4.8, img: '👜' },
    { name: 'Phone Case', price: 16.99, rating: 4.7, img: '📱' },
    { name: 'Canvas Print', price: 34.99, rating: 4.8, img: '🖼️' }
  ];

  const currentPrice = sizes.find(s => s.id === selectedSize)?.price || 12.99;
  const originalPrice = currentPrice * 1.3;
  const discount = Math.round(((originalPrice - currentPrice) / originalPrice) * 100);

  const handleAddToCart = () => {
    alert(`Added ${quantity} x Custom Ceramic Mug (${selectedSize}, ${selectedColor}) to cart!`);
  };

  const handleCustomize = () => {
    alert('Opening design editor...');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <a href="/" className="hover:text-purple-600">Home</a>
            <ChevronRight className="w-4 h-4" />
            <a href="/products" className="hover:text-purple-600">Products</a>
            <ChevronRight className="w-4 h-4" />
            <a href="/products/mugs" className="hover:text-purple-600">Mugs</a>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900 font-medium">Custom Ceramic Mug</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-12">
          
          {/* Left - Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative bg-white rounded-2xl shadow-xl overflow-hidden aspect-square">
              <div className={`${images[selectedImage].color} h-full flex items-center justify-center text-9xl transition-all`}>
                {images[selectedImage].img}
              </div>
              
              {/* Image Navigation */}
              <button
                onClick={() => setSelectedImage((selectedImage - 1 + images.length) % images.length)}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-white transition"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={() => setSelectedImage((selectedImage + 1) % images.length)}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-white transition"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                <span className="bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                  {discount}% OFF
                </span>
                <span className="bg-purple-600 text-white text-sm font-bold px-3 py-1 rounded-full flex items-center gap-1">
                  <Zap className="w-3 h-3" />
                  Best Seller
                </span>
              </div>
            </div>

            {/* Thumbnail Images */}
            <div className="grid grid-cols-4 gap-3">
              {images.map((image, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`${image.color} rounded-lg p-4 text-4xl flex items-center justify-center aspect-square transition ${
                    selectedImage === idx
                      ? 'ring-4 ring-purple-600 shadow-lg'
                      : 'hover:ring-2 ring-gray-300'
                  }`}
                >
                  {image.img}
                </button>
              ))}
            </div>
          </div>

          {/* Right - Product Info */}
          <div className="space-y-6">
            {/* Title & Rating */}
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-3">
                Custom Ceramic Mug
              </h1>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <span className="font-semibold text-gray-900">4.9</span>
                  <span className="text-gray-500">(234 reviews)</span>
                </div>
                <span className="text-green-600 font-semibold flex items-center gap-1">
                  <Check className="w-4 h-4" />
                  In Stock
                </span>
              </div>
              <p className="text-gray-600 text-lg">
                Premium quality ceramic mug perfect for your morning coffee or tea. Customize with your own design or choose from our templates.
              </p>
            </div>

            {/* Price */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6">
              <div className="flex items-baseline gap-3 mb-2">
                <span className="text-4xl font-bold text-purple-600">${currentPrice}</span>
                <span className="text-2xl text-gray-400 line-through">${originalPrice.toFixed(2)}</span>
                <span className="bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                  Save {discount}%
                </span>
              </div>
              <p className="text-sm text-gray-600">Price varies by size. Free shipping on orders over $50!</p>
            </div>

            {/* Size Selection */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-bold text-gray-900">Size</label>
                <button className="text-sm text-purple-600 hover:underline flex items-center gap-1">
                  <Ruler className="w-4 h-4" />
                  Size Guide
                </button>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {sizes.map((size) => (
                  <button
                    key={size.id}
                    onClick={() => setSelectedSize(size.id)}
                    className={`relative p-4 rounded-lg border-2 transition ${
                      selectedSize === size.id
                        ? 'border-purple-600 bg-purple-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {size.popular && (
                      <span className="absolute -top-2 right-2 bg-purple-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                        Popular
                      </span>
                    )}
                    <div className="font-bold text-gray-900">{size.name}</div>
                    <div className="text-sm text-gray-600">${size.price}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Color Selection */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-3">
                Color: <span className="font-normal text-gray-600">{colors.find(c => c.id === selectedColor)?.name}</span>
              </label>
              <div className="flex gap-3">
                {colors.map((color) => (
                  <button
                    key={color.id}
                    onClick={() => setSelectedColor(color.id)}
                    className={`w-12 h-12 rounded-full transition ${
                      selectedColor === color.id
                        ? 'ring-4 ring-purple-600 ring-offset-2'
                        : 'hover:scale-110'
                    } ${color.border ? 'border-2 border-gray-300' : ''}`}
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-3">Quantity</label>
              <div className="flex items-center gap-4">
                <div className="flex items-center border-2 border-gray-200 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-3 hover:bg-gray-100 transition font-bold text-lg"
                  >
                    −
                  </button>
                  <span className="px-6 py-3 font-bold text-lg border-x-2 border-gray-200">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 py-3 hover:bg-gray-100 transition font-bold text-lg"
                  >
                    +
                  </button>
                </div>
                <span className="text-sm text-gray-600">
                  {quantity > 10 && '🎉 Bulk discount available!'}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-4">
              <button
                onClick={handleCustomize}
                className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-bold text-lg hover:shadow-xl transition flex items-center justify-center gap-2"
              >
                <Palette className="w-5 h-5" />
                Customize Design
              </button>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleAddToCart}
                  className="py-4 bg-gray-900 text-white rounded-lg font-bold hover:bg-gray-800 transition flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="w-5 h-5" />
                  Add to Cart
                </button>
                <button
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className={`py-4 rounded-lg font-bold transition flex items-center justify-center gap-2 ${
                    isWishlisted
                      ? 'bg-red-100 text-red-600 hover:bg-red-200'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-red-600' : ''}`} />
                  {isWishlisted ? 'Saved' : 'Save'}
                </button>
              </div>
              <button className="w-full py-3 bg-white border-2 border-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition flex items-center justify-center gap-2">
                <Share2 className="w-5 h-5" />
                Share
              </button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
              <div className="flex items-start gap-3">
                <div className="bg-green-100 p-2 rounded-lg">
                  <Truck className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <div className="font-semibold text-sm text-gray-900">Free Shipping</div>
                  <div className="text-xs text-gray-600">On orders over $50</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Shield className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <div className="font-semibold text-sm text-gray-900">Quality Guarantee</div>
                  <div className="text-xs text-gray-600">100% satisfaction</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-purple-100 p-2 rounded-lg">
                  <RotateCcw className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <div className="font-semibold text-sm text-gray-900">Easy Returns</div>
                  <div className="text-xs text-gray-600">30-day return policy</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-orange-100 p-2 rounded-lg">
                  <Package className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <div className="font-semibold text-sm text-gray-900">Fast Production</div>
                  <div className="text-xs text-gray-600">Ships in 3-5 days</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="mt-16">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            {/* Tab Headers */}
            <div className="border-b">
              <div className="flex">
                {['description', 'specifications', 'reviews'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 py-4 px-6 font-semibold capitalize transition ${
                      activeTab === tab
                        ? 'text-purple-600 border-b-4 border-purple-600 bg-purple-50'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <div className="p-8">
              {activeTab === 'description' && (
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold mb-4">Product Description</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Our premium ceramic mugs are perfect for coffee lovers and make excellent personalized gifts. Each mug is carefully crafted from high-quality ceramic material that's both microwave and dishwasher safe.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    The smooth, glossy finish provides vibrant color reproduction for your custom designs. Whether you're creating a gift for a loved one or promoting your business, these mugs deliver exceptional quality and durability.
                  </p>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-center gap-2">
                      <Check className="w-5 h-5 text-green-600" />
                      Premium ceramic construction
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-5 h-5 text-green-600" />
                      Microwave and dishwasher safe
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-5 h-5 text-green-600" />
                      Vibrant, long-lasting print quality
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-5 h-5 text-green-600" />
                      Comfortable C-shaped handle
                    </li>
                  </ul>
                </div>
              )}

              {activeTab === 'specifications' && (
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold mb-4">Specifications</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="flex justify-between py-2 border-b">
                        <span className="font-semibold">Material</span>
                        <span className="text-gray-600">Ceramic</span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span className="font-semibold">Capacity</span>
                        <span className="text-gray-600">11oz / 15oz / 20oz</span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span className="font-semibold">Print Method</span>
                        <span className="text-gray-600">Sublimation</span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span className="font-semibold">Care</span>
                        <span className="text-gray-600">Dishwasher safe</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between py-2 border-b">
                        <span className="font-semibold">Height</span>
                        <span className="text-gray-600">3.7" - 4.7"</span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span className="font-semibold">Diameter</span>
                        <span className="text-gray-600">3.2" - 3.5"</span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span className="font-semibold">Weight</span>
                        <span className="text-gray-600">0.7 - 1.2 lbs</span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span className="font-semibold">Colors Available</span>
                        <span className="text-gray-600">5 options</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-bold">Customer Reviews</h3>
                    <button className="px-6 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition">
                      Write a Review
                    </button>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-6 flex items-center justify-between">
                    <div className="text-center">
                      <div className="text-5xl font-bold text-gray-900">4.9</div>
                      <div className="flex justify-center mt-2">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">Based on 234 reviews</div>
                    </div>
                    <div className="flex-1 ml-12 space-y-2">
                      {[5, 4, 3, 2, 1].map((stars) => (
                        <div key={stars} className="flex items-center gap-3">
                          <span className="text-sm font-medium w-8">{stars}★</span>
                          <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-yellow-400"
                              style={{ width: `${stars === 5 ? 85 : stars === 4 ? 12 : 3}%` }}
                            />
                          </div>
                          <span className="text-sm text-gray-600 w-12">{stars === 5 ? 199 : stars === 4 ? 28 : 7}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    {reviews.map((review, idx) => (
                      <div key={idx} className="bg-white border rounded-xl p-6">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                              {review.name[0]}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-semibold">{review.name}</span>
                                {review.verified && (
                                  <span className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                                    ✓ Verified
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-2 mt-1">
                                <div className="flex">
                                  {[...Array(review.rating)].map((_, i) => (
                                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                  ))}
                                </div>
                                <span className="text-sm text-gray-500">{review.date}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <p className="text-gray-700 mb-3">{review.text}</p>
                        <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-purple-600 transition">
                          <ThumbsUp className="w-4 h-4" />
                          Helpful ({review.helpful})
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Related Products */}
        <div className="mt-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">You May Also Like</h2>
            <button className="text-purple-600 font-semibold hover:underline flex items-center gap-2">
              View All
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {relatedProducts.map((product, idx) => (
              <div key={idx} className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition group cursor-pointer">
                <div className="bg-gray-100 h-56 flex items-center justify-center text-7xl group-hover:bg-gray-200 transition">
                  {product.img}
                </div>
                <div className="p-4">
                  <h3 className="font-bold mb-2">{product.name}</h3>
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{product.rating}</span>
                  </div>
                  <div className="text-xl font-bold text-purple-600">${product.price}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}