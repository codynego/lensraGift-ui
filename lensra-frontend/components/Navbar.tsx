"use client";

import { useState, useEffect, useCallback } from 'react';
import { Search, ShoppingCart, User, Heart, Menu, X, ChevronDown, LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

const BaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000/";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const { user, isAuthenticated, logout, token } = useAuth();

  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);

  // FETCH COUNTS FROM BACKEND
  const syncCounts = useCallback(async () => {
    try {
      // We send the guest_session_id in headers if not authenticated
      const sessionId = localStorage.getItem('guest_session_id');
      
      const res = await fetch(`${BaseUrl}api/orders/cart/summary/`, { // Adjust to your actual cart summary endpoint
        headers: {
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
          'X-Session-ID': sessionId || '', // Passing session for guest identification
        }
      });

      if (res.ok) {
        const data = await res.json();
        setCartCount(data.total_quantity || 0);
        setWishlistCount(data.wishlist_count || 0);
      }
    } catch (err) {
      console.error("Failed to sync navbar counts:", err);
    }
  }, [token, isAuthenticated]);

  useEffect(() => {
    syncCounts();

    // Listen for custom events triggered by "Add to Cart" buttons
    window.addEventListener('cart-updated', syncCounts);
    
    return () => window.removeEventListener('cart-updated', syncCounts);
  }, [syncCounts]);

  return (
    <>
      {/* 1. TOP ANNOUNCEMENT BAR */}
      <div className="bg-black text-white text-[10px] font-black uppercase tracking-[0.2em] py-2.5 text-center">
        🎁 Free Delivery over ₦10,000 <span className="text-red-600 mx-2">|</span> Use Code: <span className="text-red-600">LENSRA2026</span>
      </div>

      {/* 2. MAIN NAVIGATION */}
      <header className="bg-white sticky top-0 z-50 border-b border-zinc-100">
        <div className="max-w-[1600px] mx-auto px-6">
          <div className="py-5 flex items-center justify-between gap-10">
            
            <Link href="/" className="text-3xl font-black tracking-tighter uppercase italic flex-shrink-0">
              Lensra<span className="text-red-600">.</span>
            </Link>

            <div className="hidden lg:flex flex-1 max-w-xl">
              <div className="relative w-full group">
                <input
                  type="text"
                  placeholder="SEARCH FOR A GIFT OR DESIGN..."
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                  className={`w-full px-6 py-3 bg-zinc-50 text-[10px] font-black tracking-widest uppercase rounded-2xl transition-all border-2 ${
                    searchFocused ? 'bg-white border-black' : 'border-transparent'
                  } outline-none`}
                />
                <Search className={`absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 ${searchFocused ? 'text-red-600' : 'text-zinc-400'}`} />
              </div>
            </div>

            <div className="flex items-center gap-3 md:gap-6">
              <div className="hidden md:block">
                {isAuthenticated ? (
                  <div className="flex items-center gap-4">
                    <Link href="/dashboard" className="flex items-center gap-2 group">
                      <div className="w-10 h-10 bg-black text-white rounded-2xl flex items-center justify-center font-black text-xs group-hover:bg-red-600 transition-colors">
                        {user?.first_name?.charAt(0) || 'U'}
                      </div>
                    </Link>
                    <button onClick={logout} className="p-2 text-zinc-400 hover:text-red-600 transition">
                      <LogOut className="w-5 h-5" />
                    </button>
                  </div>
                ) : (
                  <Link href="/login" className="flex items-center gap-2 px-6 py-3 bg-black text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-red-600 transition-all">
                    <User className="w-4 h-4" /> Sign In
                  </Link>
                )}
              </div>

              <div className="flex items-center border-l border-zinc-100 pl-4 md:pl-6">
                <Link href="/wishlist" className="p-3 hover:text-red-600 transition relative group">
                  <Heart className="w-6 h-6 stroke-[2.5px]" />
                  {wishlistCount > 0 && (
                    <span className="absolute top-2 right-2 bg-black text-white text-[8px] font-black rounded-full min-w-4 h-4 flex items-center justify-center border-2 border-white animate-in zoom-in duration-300">
                      {wishlistCount}
                    </span>
                  )}
                </Link>

                <Link href="/cart" className="p-3 hover:text-red-600 transition relative">
                  <ShoppingCart className="w-6 h-6 stroke-[2.5px]" />
                  {cartCount > 0 && (
                    <span className="absolute top-2 right-2 bg-red-600 text-white text-[8px] font-black rounded-full min-w-4 h-4 flex items-center justify-center border-2 border-white animate-in zoom-in duration-300">
                      {cartCount}
                    </span>
                  )}
                </Link>
              </div>

              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden p-3 bg-zinc-100 rounded-2xl">
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          <nav className="hidden lg:block border-t border-zinc-50">
            <ul className="flex items-center justify-center gap-12 py-5">
              <NavItem href="/products" label="All Gifts" hasDropdown />
              <NavItem href="/design-ideas" label="Trending Designs" />
              <NavItem href="/sale" label="Discount Sale" isHighlight />
              <NavItem href="/business" label="Business" />
              <NavItem href="/about" label="Our Studio" />
              <NavItem href="/contact" label="Contact Us" />
            </ul>
          </nav>
        </div>

        {/* MOBILE MENU */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-[60] bg-white p-8 animate-in slide-in-from-right duration-300">
            <div className="flex flex-col h-full">
              <div className="flex justify-between items-center mb-12">
                <Link href="/" className="text-3xl font-black tracking-tighter uppercase italic">
                  Lensra<span className="text-red-600">.</span>
                </Link>
                <button onClick={() => setMobileMenuOpen(false)}>
                  <X className="w-8 h-8 text-zinc-800" />
                </button>
              </div>

              <div className="relative mb-8">
                <input
                  type="text"
                  placeholder="SEARCH FOR A GIFT OR DESIGN..."
                  className="w-full px-6 py-3 bg-zinc-50 text-[10px] font-black tracking-widest uppercase rounded-2xl border-2 border-transparent outline-none focus:border-black transition"
                />
                <Search className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              </div>

              <ul className="flex flex-col gap-6 mb-12">
                <li>
                  <Link 
                    href="/products" 
                    onClick={() => setMobileMenuOpen(false)} 
                    className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 hover:text-black flex items-center gap-2"
                  >
                    All Gifts <ChevronDown className="w-3 h-3 text-red-600" />
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/design-ideas" 
                    onClick={() => setMobileMenuOpen(false)} 
                    className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 hover:text-black"
                  >
                    Trending Designs
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/sale" 
                    onClick={() => setMobileMenuOpen(false)} 
                    className="text-[10px] font-black uppercase tracking-[0.2em] text-red-600 hover:text-red-700"
                  >
                    Discount Sale
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/business" 
                    onClick={() => setMobileMenuOpen(false)} 
                    className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 hover:text-black"
                  >
                    Business
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/about" 
                    onClick={() => setMobileMenuOpen(false)} 
                    className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 hover:text-black"
                  >
                    Our Studio
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/contact" 
                    onClick={() => setMobileMenuOpen(false)} 
                    className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 hover:text-black"
                  >
                    Contact Us
                  </Link>
                </li>
              </ul>

              <div className="mt-auto border-t border-zinc-100 pt-6">
                {isAuthenticated ? (
                  <div className="space-y-4">
                    <Link 
                      href="/dashboard" 
                      onClick={() => setMobileMenuOpen(false)} 
                      className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest"
                    >
                      <User className="w-5 h-5" /> Dashboard
                    </Link>
                    <button 
                      onClick={() => { logout(); setMobileMenuOpen(false); }} 
                      className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-red-600"
                    >
                      <LogOut className="w-5 h-5" /> Logout
                    </button>
                  </div>
                ) : (
                  <Link 
                    href="/login" 
                    onClick={() => setMobileMenuOpen(false)} 
                    className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest"
                  >
                    <User className="w-5 h-5" /> Sign In
                  </Link>
                )}

                <div className="flex gap-6 mt-6">
                  <Link 
                    href="/wishlist" 
                    onClick={() => setMobileMenuOpen(false)} 
                    className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest relative"
                  >
                    <Heart className="w-5 h-5" /> Wishlist
                    {wishlistCount > 0 && (
                      <span className="absolute top-0 right-0 bg-black text-white text-[8px] font-black rounded-full min-w-4 h-4 flex items-center justify-center border-2 border-white">
                        {wishlistCount}
                      </span>
                    )}
                  </Link>
                  <Link 
                    href="/cart" 
                    onClick={() => setMobileMenuOpen(false)} 
                    className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest relative"
                  >
                    <ShoppingCart className="w-5 h-5" /> Cart
                    {cartCount > 0 && (
                      <span className="absolute top-0 right-0 bg-red-600 text-white text-[8px] font-black rounded-full min-w-4 h-4 flex items-center justify-center border-2 border-white">
                        {cartCount}
                      </span>
                    )}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
}

// Sub-components...
function NavItem({ href, label, hasDropdown = false, isHighlight = false }: { href: string, label: string, hasDropdown?: boolean, isHighlight?: boolean }) {
  return (
    <li>
      <Link href={href} className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] transition-colors ${isHighlight ? 'text-red-600 hover:text-red-700' : 'text-zinc-500 hover:text-black'}`}>
        {label}
        {hasDropdown && <ChevronDown className="w-3 h-3 text-red-600" />}
      </Link>
    </li>
  );
}