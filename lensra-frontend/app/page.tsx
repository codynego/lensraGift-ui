"use client"
import { useState, useEffect } from 'react';
import { ShoppingCart, Search, User, Heart, ChevronDown, ChevronLeft, ChevronRight, Star } from 'lucide-react';

export default function LensraHomepage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const heroSlides = [
    {
      title: 'Design Your Perfect Gift',
      subtitle: 'Custom mugs, apparel & more',
      cta: 'Start Creating',
      bg: 'bg-gradient-to-r from-blue-600 to-purple-600'
    },
    {
      title: 'Express Yourself',
      subtitle: 'Personalized products made easy',
      cta: 'Browse Products',
      bg: 'bg-gradient-to-r from-pink-500 to-red-500'
    },
    {
      title: 'Gifts That Matter',
      subtitle: 'Create something unique today',
      cta: 'Get Started',
      bg: 'bg-gradient-to-r from-green-500 to-teal-500'
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const categories = [
    { name: 'Mugs', img: '☕', items: '500+ designs' },
    { name: 'T-Shirts', img: '👕', items: '1000+ styles' },
    { name: 'Hoodies', img: '🧥', items: '300+ options' },
    { name: 'Canvas Prints', img: '🖼️', items: '200+ sizes' },
    { name: 'Phone Cases', img: '📱', items: '400+ models' },
    { name: 'Tote Bags', img: '👜', items: '150+ styles' },
    { name: 'Stickers', img: '⭐', items: '600+ designs' },
    { name: 'Notebooks', img: '📓', items: '250+ options' }
  ];

  const featuredProducts = [
    { name: 'White Ceramic Mug', price: 12.99, rating: 4.8, reviews: 234, img: '☕', sale: false },
    { name: 'Classic Cotton Tee', price: 19.99, rating: 4.9, reviews: 567, img: '👕', sale: true, salePrice: 14.99 },
    { name: 'Canvas Wall Art 16x20', price: 34.99, rating: 4.7, reviews: 123, img: '🖼️', sale: false },
    { name: 'Premium Hoodie', price: 39.99, rating: 4.9, reviews: 890, img: '🧥', sale: false },
    { name: 'Slim Phone Case', price: 16.99, rating: 4.6, reviews: 456, img: '📱', sale: true, salePrice: 12.99 },
    { name: 'Canvas Tote Bag', price: 18.99, rating: 4.8, reviews: 345, img: '👜', sale: false },
    { name: 'Photo Blanket', price: 44.99, rating: 4.9, reviews: 678, img: '🛏️', sale: false },
    { name: 'Metal Water Bottle', price: 24.99, rating: 4.7, reviews: 234, img: '🍶', sale: false }
  ];

  const testimonials = [
    { name: 'Jennifer L.', text: 'Amazing quality! The mug I designed turned out exactly as I hoped.', rating: 5 },
    { name: 'Michael R.', text: 'Fast shipping and excellent customer service. Highly recommend!', rating: 5 },
    { name: 'Sarah P.', text: 'The design tool is so easy to use. Made a perfect gift for my sister!', rating: 5 }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Top Banner */}
      <div className="bg-red-600 text-white text-center py-2 text-sm font-medium">
        🎁 Free shipping on orders over $50 | Use code: GIFT20 for 20% off
      </div>

      {/* Header */}
      <header className="border-b sticky top-0 bg-white z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          {/* Top Header */}
          <div className="py-3 flex items-center justify-between">
            <div className="text-3xl font-bold text-red-600">Lensra</div>
            
            {/* Search Bar */}
            <div className="flex-1 max-w-2xl mx-8 hidden md:block">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for products, designs, or ideas..."
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-full focus:border-red-600 focus:outline-none"
                />
                <Search className="absolute right-4 top-2.5 w-5 h-5 text-gray-400" />
              </div>
            </div>

            {/* User Actions */}
            <div className="flex items-center gap-4">
              <button className="hidden md:flex items-center gap-2 hover:text-red-600 transition">
                <User className="w-5 h-5" />
                <span className="text-sm">Sign In</span>
              </button>
              <button className="relative hover:text-red-600 transition">
                <Heart className="w-6 h-6" />
              </button>
              <button className="relative hover:text-red-600 transition">
                <ShoppingCart className="w-6 h-6" />
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  0
                </span>
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="border-t py-3">
            <ul className="flex items-center gap-8 text-sm font-medium overflow-x-auto">
              <li className="flex items-center gap-1 cursor-pointer hover:text-red-600 transition whitespace-nowrap">
                Products <ChevronDown className="w-4 h-4" />
              </li>
              <li className="cursor-pointer hover:text-red-600 transition whitespace-nowrap">Design Ideas</li>
              <li className="cursor-pointer hover:text-red-600 transition whitespace-nowrap">Custom Gifts</li>
              <li className="cursor-pointer hover:text-red-600 transition whitespace-nowrap">Occasions</li>
              <li className="cursor-pointer hover:text-red-600 transition whitespace-nowrap">Sale</li>
              <li className="cursor-pointer hover:text-red-600 transition whitespace-nowrap">Business</li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Hero Carousel */}
      <section className="relative overflow-hidden">
        {heroSlides.map((slide, idx) => (
          <div
            key={idx}
            className={`transition-opacity duration-500 ${
              idx === currentSlide ? 'opacity-100' : 'opacity-0 absolute top-0 left-0 w-full'
            }`}
          >
            <div className={`${slide.bg} text-white py-20 px-4`}>
              <div className="max-w-7xl mx-auto text-center space-y-6">
                <h1 className="text-5xl md:text-6xl font-bold">{slide.title}</h1>
                <p className="text-2xl font-light">{slide.subtitle}</p>
                <button className="px-10 py-4 bg-white text-gray-900 rounded-full font-bold text-lg hover:bg-gray-100 transition shadow-xl">
                  {slide.cta}
                </button>
              </div>
            </div>
          </div>
        ))}
        
        {/* Carousel Controls */}
        <button
          onClick={() => setCurrentSlide((currentSlide - 1 + heroSlides.length) % heroSlides.length)}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full hover:bg-white transition"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={() => setCurrentSlide((currentSlide + 1) % heroSlides.length)}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full hover:bg-white transition"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Dots */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
          {heroSlides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`w-2 h-2 rounded-full transition ${
                idx === currentSlide ? 'bg-white w-8' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {categories.map((cat, idx) => (
              <div key={idx} className="bg-white rounded-lg p-4 text-center cursor-pointer hover:shadow-lg transition group">
                <div className="text-5xl mb-3 group-hover:scale-110 transition">{cat.img}</div>
                <h3 className="font-semibold text-sm mb-1">{cat.name}</h3>
                <p className="text-xs text-gray-500">{cat.items}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">Featured Products</h2>
            <button className="text-red-600 font-semibold hover:underline">View All →</button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {featuredProducts.map((product, idx) => (
              <div key={idx} className="bg-white rounded-lg overflow-hidden border hover:shadow-xl transition group cursor-pointer">
                <div className="relative bg-gray-100 h-48 flex items-center justify-center text-6xl group-hover:bg-gray-200 transition">
                  {product.img}
                  {product.sale && (
                    <span className="absolute top-3 left-3 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
                      SALE
                    </span>
                  )}
                  <button className="absolute top-3 right-3 bg-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition">
                    <Heart className="w-4 h-4" />
                  </button>
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-sm mb-2 line-clamp-2">{product.name}</h3>
                  <div className="flex items-center gap-1 mb-2">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs font-medium">{product.rating}</span>
                    <span className="text-xs text-gray-500">({product.reviews})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {product.sale ? (
                      <>
                        <span className="text-lg font-bold text-red-600">${product.salePrice}</span>
                        <span className="text-sm text-gray-400 line-through">${product.price}</span>
                      </>
                    ) : (
                      <span className="text-lg font-bold">${product.price}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-blue-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-bold mb-3">Choose a Product</h3>
              <p className="text-gray-600">Browse thousands of customizable products</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-bold mb-3">Personalize It</h3>
              <p className="text-gray-600">Add your photos, text, and designs</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-bold mb-3">Order & Enjoy</h3>
              <p className="text-gray-600">We'll print and ship it to your door</p>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Reviews */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">What Our Customers Say</h2>
          <div className="relative bg-gray-50 rounded-lg p-8">
            <div className="text-center space-y-4">
              <div className="flex justify-center gap-1 mb-4">
                {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                  <Star key={i} className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-lg italic text-gray-700">"{testimonials[currentTestimonial].text}"</p>
              <p className="font-semibold text-gray-900">— {testimonials[currentTestimonial].name}</p>
            </div>
            <button
              onClick={() => setCurrentTestimonial((currentTestimonial - 1 + testimonials.length) % testimonials.length)}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow hover:shadow-lg transition"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => setCurrentTestimonial((currentTestimonial + 1) % testimonials.length)}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow hover:shadow-lg transition"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Get 15% Off Your First Order</h2>
          <p className="text-lg mb-6">Join our newsletter for exclusive deals and design inspiration</p>
          <div className="flex gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-full text-gray-900 focus:outline-none"
            />
            <button className="px-8 py-3 bg-white text-purple-600 rounded-full font-bold hover:bg-gray-100 transition">
              Subscribe
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold text-white mb-4">Lensra</h3>
            <p className="text-sm">Create custom products that express your unique style.</p>
          </div>
          <div>
            <h4 className="font-bold text-white mb-4">Shop</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition">All Products</a></li>
              <li><a href="#" className="hover:text-white transition">Apparel</a></li>
              <li><a href="#" className="hover:text-white transition">Home & Living</a></li>
              <li><a href="#" className="hover:text-white transition">Accessories</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-white mb-4">Support</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition">Help Center</a></li>
              <li><a href="#" className="hover:text-white transition">Shipping Info</a></li>
              <li><a href="#" className="hover:text-white transition">Returns</a></li>
              <li><a href="#" className="hover:text-white transition">Contact Us</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-white mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition">About Us</a></li>
              <li><a href="#" className="hover:text-white transition">Careers</a></li>
              <li><a href="#" className="hover:text-white transition">Blog</a></li>
              <li><a href="#" className="hover:text-white transition">Affiliate Program</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 mt-8 pt-8 border-t border-gray-800 text-center text-sm">
          <p>© 2026 Lensra. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}