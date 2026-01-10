"use client"
import { useState, useEffect } from 'react';
import { Gift, ChevronLeft, ChevronRight, Star, Heart } from 'lucide-react';

export default function GiftIdeasPage() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const heroSlides = [
    {
      title: 'Unique Gift Ideas',
      subtitle: 'Find the perfect personalized gift for any occasion',
      bg: 'bg-gradient-to-r from-pink-500 to-red-500'
    },
    {
      title: 'Personalized Perfection',
      subtitle: 'Make every gift special with customization',
      bg: 'bg-gradient-to-r from-green-500 to-teal-500'
    },
    {
      title: 'Gifts That Wow',
      subtitle: 'Discover trending ideas and designs',
      bg: 'bg-gradient-to-r from-blue-600 to-purple-600'
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const giftCategories = [
    { name: 'Birthdays', img: '🎂', description: 'Custom cakes, cards & more' },
    { name: 'Weddings', img: '💒', description: 'Personalized invites & gifts' },
    { name: 'Anniversaries', img: '💑', description: 'Romantic custom items' },
    { name: 'Holidays', img: '🎄', description: 'Festive decorations & apparel' },
    { name: 'Graduations', img: '🎓', description: 'Congratulatory prints' },
    { name: 'Baby Showers', img: '🍼', description: 'Adorable baby gear' },
    { name: 'Corporate', img: '🏢', description: 'Branded merchandise' },
    { name: 'Just Because', img: '🎁', description: 'Surprise gifts' }
  ];

  const featuredIdeas = [
    { name: 'Personalized Photo Mug', price: 14.99, rating: 4.8, reviews: 456, img: '☕', sale: true, salePrice: 9.99, occasion: 'Any' },
    { name: 'Custom Family T-Shirt', price: 24.99, rating: 4.9, reviews: 789, img: '👕', sale: false, occasion: 'Birthdays' },
    { name: 'Engraved Canvas Print', price: 39.99, rating: 4.7, reviews: 234, img: '🖼️', sale: false, occasion: 'Anniversaries' },
    { name: 'Holiday Ornament Set', price: 19.99, rating: 4.8, reviews: 567, img: '🎄', sale: true, salePrice: 14.99, occasion: 'Holidays' },
    { name: 'Baby Onesie Bundle', price: 29.99, rating: 4.9, reviews: 890, img: '👶', sale: false, occasion: 'Baby Showers' },
    { name: 'Corporate Branded Mug', price: 12.99, rating: 4.6, reviews: 345, img: '☕', sale: false, occasion: 'Corporate' },
    { name: 'Custom Phone Case', price: 18.99, rating: 4.7, reviews: 678, img: '📱', sale: false, occasion: 'Just Because' },
    { name: 'Personalized Notebook', price: 16.99, rating: 4.8, reviews: 123, img: '📓', sale: false, occasion: 'Graduations' }
  ];

  return (
    <div className="min-h-screen bg-white">
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

      {/* Gift Categories */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Gift Ideas by Occasion</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {giftCategories.map((cat, idx) => (
              <div key={idx} className="bg-white rounded-lg p-4 text-center cursor-pointer hover:shadow-lg transition group">
                <div className="text-5xl mb-3 group-hover:scale-110 transition">{cat.img}</div>
                <h3 className="font-semibold text-sm mb-1">{cat.name}</h3>
                <p className="text-xs text-gray-500">{cat.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Gift Ideas */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">Featured Gift Ideas</h2>
            <button className="text-red-600 font-semibold hover:underline">View More →</button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {featuredIdeas.map((idea, idx) => (
              <div key={idx} className="bg-white rounded-lg overflow-hidden border hover:shadow-xl transition group cursor-pointer">
                <div className="relative bg-gray-100 h-48 flex items-center justify-center text-6xl group-hover:bg-gray-200 transition">
                  {idea.img}
                  {idea.sale && (
                    <span className="absolute top-3 left-3 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
                      SALE
                    </span>
                  )}
                  <button className="absolute top-3 right-3 bg-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition">
                    <Heart className="w-4 h-4" />
                  </button>
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-sm mb-2 line-clamp-2">{idea.name}</h3>
                  <p className="text-xs text-gray-500 mb-2">{idea.occasion}</p>
                  <div className="flex items-center gap-1 mb-2">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs font-medium">{idea.rating}</span>
                    <span className="text-xs text-gray-500">({idea.reviews})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {idea.sale ? (
                      <>
                        <span className="text-lg font-bold text-red-600">${idea.salePrice}</span>
                        <span className="text-sm text-gray-400 line-through">${idea.price}</span>
                      </>
                    ) : (
                      <span className="text-lg font-bold">${idea.price}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
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
    </div>
  );
}