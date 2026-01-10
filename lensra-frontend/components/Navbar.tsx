"use client"
import { useState } from 'react';
import { Search, ShoppingCart, User, Heart, Menu, X, ChevronDown } from 'lucide-react';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  return (
    <>
      {/* Top Promotional Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center py-2 text-sm font-medium">
        🎁 Free Shipping on Orders Over ₦10,000 | Use Code: GIFT20 for 20% Off
      </div>

      {/* Main Navbar */}
      <header className="bg-white border-b sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          {/* Top Header Row */}
          <div className="py-3 flex items-center justify-between gap-4">
            {/* Logo */}
            <a href="/" className="text-3xl font-bold text-red-600 flex-shrink-0">
              Lensra
            </a>

            {/* Search Bar - Desktop */}
            <div className="hidden md:flex flex-1 max-w-2xl">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Search for products, designs, or ideas..."
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                  className={`w-full px-4 py-2 border-2 rounded-full transition focus:outline-none ${
                    searchFocused ? 'border-red-600' : 'border-gray-300'
                  }`}
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition">
                  <Search className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-4">
              {/* Sign In - Desktop */}
              <a href="/login" className="hidden md:flex items-center gap-2 hover:text-red-600 transition">
                <User className="w-5 h-5" />
                <span className="text-sm font-medium">Sign In</span>
              </a>

              {/* Wishlist */}
              <a href="/wishlist" className="relative hover:text-red-600 transition">
                <Heart className="w-6 h-6" />
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  3
                </span>
              </a>

              {/* Cart */}
              <a href="/cart" className="relative hover:text-red-600 transition">
                <ShoppingCart className="w-6 h-6" />
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  2
                </span>
              </a>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden text-gray-700 hover:text-red-600 transition"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Navigation Links - Desktop */}
          <nav className="hidden md:block border-t py-3">
            <ul className="flex items-center gap-8 text-sm font-medium">
              <li className="group relative">
                <a href="/products" className="flex items-center gap-1 hover:text-red-600 transition cursor-pointer">
                  Products <ChevronDown className="w-4 h-4" />
                </a>
                {/* Dropdown Menu */}
                <div className="absolute top-full left-0 mt-2 bg-white border shadow-lg rounded-lg p-4 min-w-[200px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition">
                  <a href="/products?category=apparel" className="block py-2 px-3 hover:bg-gray-50 rounded">Apparel</a>
                  <a href="/products?category=drinkware" className="block py-2 px-3 hover:bg-gray-50 rounded">Drinkware</a>
                  <a href="/products?category=home" className="block py-2 px-3 hover:bg-gray-50 rounded">Home Decor</a>
                  <a href="/products?category=accessories" className="block py-2 px-3 hover:bg-gray-50 rounded">Accessories</a>
                </div>
              </li>
              <li>
                <a href="/design-ideas" className="hover:text-red-600 transition">Design Ideas</a>
              </li>
              <li>
                <a href="/custom-gifts" className="hover:text-red-600 transition">Custom Gifts</a>
              </li>
              <li>
                <a href="/occasions" className="hover:text-red-600 transition">Occasions</a>
              </li>
              <li>
                <a href="/sale" className="text-red-600 font-bold hover:text-red-700 transition">Sale</a>
              </li>
              <li>
                <a href="/business" className="hover:text-red-600 transition">Business</a>
              </li>
              <li>
                <a href="/about" className="hover:text-red-600 transition">About</a>
              </li>
              <li>
                <a href="/contact" className="hover:text-red-600 transition">Contact</a>
              </li>
            </ul>
          </nav>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t bg-white">
            {/* Mobile Search */}
            <div className="p-4 border-b">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-full focus:border-red-600 focus:outline-none"
                />
                <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
            </div>

            {/* Mobile Navigation Links */}
            <nav className="p-4">
              <ul className="space-y-3">
                <li>
                  <a href="/login" className="flex items-center gap-2 py-2 hover:text-red-600 transition font-medium">
                    <User className="w-5 h-5" />
                    Sign In
                  </a>
                </li>
                <li className="border-t pt-3">
                  <a href="/products" className="block py-2 hover:text-red-600 transition font-medium">
                    All Products
                  </a>
                </li>
                <li>
                  <a href="/design-ideas" className="block py-2 hover:text-red-600 transition">
                    Design Ideas
                  </a>
                </li>
                <li>
                  <a href="/custom-gifts" className="block py-2 hover:text-red-600 transition">
                    Custom Gifts
                  </a>
                </li>
                <li>
                  <a href="/occasions" className="block py-2 hover:text-red-600 transition">
                    Occasions
                  </a>
                </li>
                <li>
                  <a href="/sale" className="block py-2 text-red-600 font-bold hover:text-red-700 transition">
                    Sale
                  </a>
                </li>
                <li>
                  <a href="/business" className="block py-2 hover:text-red-600 transition">
                    Business
                  </a>
                </li>
                <li className="border-t pt-3">
                  <a href="/about" className="block py-2 hover:text-red-600 transition">
                    About
                  </a>
                </li>
                <li>
                  <a href="/contact" className="block py-2 hover:text-red-600 transition">
                    Contact
                  </a>
                </li>
              </ul>
            </nav>

            {/* Mobile Quick Links */}
            <div className="p-4 border-t bg-gray-50 grid grid-cols-2 gap-3">
              <a href="/wishlist" className="flex items-center justify-center gap-2 py-3 bg-white border rounded-lg hover:border-red-600 transition">
                <Heart className="w-5 h-5" />
                <span className="font-medium">Wishlist</span>
              </a>
              <a href="/cart" className="flex items-center justify-center gap-2 py-3 bg-white border rounded-lg hover:border-red-600 transition">
                <ShoppingCart className="w-5 h-5" />
                <span className="font-medium">Cart</span>
              </a>
            </div>
          </div>
        )}
      </header>
    </>
  );
}