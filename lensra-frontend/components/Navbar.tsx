"use client";

import { useState, useEffect, useCallback } from 'react';
import { Search, ShoppingCart, User, Heart, Menu, X, LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

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
      const sessionId = localStorage.getItem('guest_session_id');
      
      // Build URL with session_id as query parameter instead of custom header
      const url = new URL(`${BaseUrl}api/orders/cart/summary/`);
      if (sessionId && !token) {
        url.searchParams.append('session_id', sessionId);
      }
      
      const headers: HeadersInit = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const res = await fetch(url.toString(), {
        headers
      });

      if (res.ok) {
        const data = await res.json();
        setCartCount(data.total_quantity || 0);
        setWishlistCount(data.wishlist_count || 0);
      }
    } catch (err) {
      console.error("Failed to sync navbar counts:", err);
    }
  }, [token]);

  useEffect(() => {
    syncCounts();

    // Listen for custom events triggered by "Add to Cart" buttons
    window.addEventListener('cart-updated', syncCounts);
    
    return () => window.removeEventListener('cart-updated', syncCounts);
  }, [syncCounts]);

  return (
    <>
      {/* 1. TOP ANNOUNCEMENT BAR */}
      <div className="bg-[#050505] text-zinc-300 text-[9px] font-black uppercase tracking-[0.2em] py-2 text-center border-b border-zinc-800">
        🎁 Get 10% discount on your first order<span className="text-red-500 mx-2">|</span> Use Code: <span className="text-red-500">LENSRA26</span>
      </div>

      {/* 2. MAIN NAVIGATION */}
      <header className="bg-[#050505] sticky top-0 z-50 border-b border-zinc-800 shadow-md">
        <div className="max-w-[1600px] mx-auto px-4">
          <div className="py-4 flex items-center justify-between gap-8">
            
            <Link href="/" className="text-2xl font-black tracking-tighter uppercase italic flex-shrink-0 text-white hover:text-red-500 transition-colors">
              Lensra<span className="text-red-500">.</span>
            </Link>

            <div className="hidden lg:flex flex-1 max-w-lg">
              <div className="relative w-full group">
                <input
                  type="text"
                  placeholder="SEARCH FOR GIFTS OR DESIGNS..."
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                  className={`w-full px-5 py-2.5 bg-zinc-800 text-[9px] font-black tracking-widest uppercase rounded-xl transition-all border placeholder-zinc-500 text-zinc-300 ${
                    searchFocused ? 'bg-zinc-900 border-red-500' : 'border-zinc-800'
                  } outline-none focus:shadow-sm`}
                />
                <Search className={`absolute right-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 ${searchFocused ? 'text-red-500' : 'text-zinc-500'}`} />
              </div>
            </div>

            <div className="flex items-center gap-2 md:gap-4">
              <div className="hidden md:block">
                {isAuthenticated ? (
                  <div className="flex items-center gap-3">
                    <Link href="/dashboard" className="flex items-center gap-2 group">
                      <div className="w-8 h-8 bg-zinc-800 text-zinc-300 rounded-xl flex items-center justify-center font-black text-[10px] group-hover:bg-red-500 group-hover:text-white transition-colors shadow-sm">
                        {user?.first_name?.charAt(0) || 'U'}
                      </div>
                    </Link>
                    <button onClick={logout} className="p-1.5 text-zinc-500 hover:text-red-500 transition">
                      <LogOut className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <Link href="/login" className="flex items-center gap-1.5 px-5 py-2.5 bg-zinc-800 text-zinc-300 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all shadow-sm">
                    <User className="w-3.5 h-3.5" /> Sign In
                  </Link>
                )}
              </div>

              <div className="flex items-center border-l border-zinc-800 pl-3 md:pl-4">
                <Link href="/wishlist" className="p-2 hover:text-red-500 transition relative group text-zinc-500">
                  <Heart className="w-5 h-5 stroke-[2]" />
                  {wishlistCount > 0 && (
                    <span className="absolute top-1 right-1 bg-red-500 text-white text-[7px] font-black rounded-full min-w-3.5 h-3.5 flex items-center justify-center border border-[#050505] animate-in zoom-in duration-300 shadow-sm">
                      {wishlistCount}
                    </span>
                  )}
                </Link>

                <Link href="/cart" className="p-2 hover:text-red-500 transition relative text-zinc-500">
                  <ShoppingCart className="w-5 h-5 stroke-[2]" />
                  {cartCount > 0 && (
                    <span className="absolute top-1 right-1 bg-red-500 text-white text-[7px] font-black rounded-full min-w-3.5 h-3.5 flex items-center justify-center border border-[#050505] animate-in zoom-in duration-300 shadow-sm">
                      {cartCount}
                    </span>
                  )}
                </Link>
              </div>

              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden p-2 bg-zinc-800 rounded-xl text-zinc-300 hover:bg-red-500 hover:text-white transition-shadow shadow-sm">
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <nav className="hidden lg:block border-t border-zinc-800">
            <ul className="flex items-center justify-center gap-8 py-4">
              <NavItem href="/shop" label="Shop" />
              <NavItem href="/editor" label="Customize" />
              <NavItem href="/digital-gifts" label="Digital Gifts" isHighlight />
              <NavItem href="/business" label="Business" />
              <NavItem href="/about" label="About" />
              <NavItem href="/contact" label="Contact" />
              <NavItem href="/blog" label="Blog" /> 
            </ul>
          </nav>
        </div>
      </header>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 120 }}
            className="lg:hidden fixed inset-0 z-[60] bg-[#050505] p-6 overflow-y-auto shadow-2xl border-l border-zinc-800"
          >
            <div className="flex flex-col h-full">
              <div className="flex justify-between items-center mb-10">
                <Link href="/" className="text-2xl font-black tracking-tighter uppercase italic text-white hover:text-red-500 transition-colors">
                  Lensra<span className="text-red-500">.</span>
                </Link>
                <button onClick={() => setMobileMenuOpen(false)}>
                  <X className="w-6 h-6 text-zinc-400 hover:text-red-500 transition" />
                </button>
              </div>

              <div className="relative mb-6">
                <input
                  type="text"
                  placeholder="SEARCH FOR GIFTS OR DESIGNS..."
                  className="w-full px-5 py-2.5 bg-zinc-800 text-[9px] font-black tracking-widest uppercase rounded-xl border border-zinc-800 outline-none focus:border-red-500 transition text-zinc-300 placeholder-zinc-500 shadow-sm"
                />
                <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500" />
              </div>

              <ul className="flex flex-col gap-4 mb-10">
                <li>
                  <Link 
                    href="/marketplace" 
                    onClick={() => setMobileMenuOpen(false)} 
                    className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-400 hover:text-red-500 transition-colors"
                  >
                    Marketplace
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/shop" 
                    onClick={() => setMobileMenuOpen(false)} 
                    className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-400 hover:text-red-500 transition-colors"
                  >
                    Customize
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/digital-gifts" 
                    onClick={() => setMobileMenuOpen(false)} 
                    className="text-[9px] font-black uppercase tracking-[0.2em] text-red-500 hover:text-red-400 transition-colors"
                  >
                    Digital Gifts
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/business" 
                    onClick={() => setMobileMenuOpen(false)} 
                    className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-400 hover:text-red-500 transition-colors"
                  >
                    Business
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/about" 
                    onClick={() => setMobileMenuOpen(false)} 
                    className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-400 hover:text-red-500 transition-colors"
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/contact" 
                    onClick={() => setMobileMenuOpen(false)} 
                    className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-400 hover:text-red-500 transition-colors"
                  >
                    Contact
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/blog"
                    onClick={() => setMobileMenuOpen(false)} 
                    className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-400 hover:text-red-500 transition-colors"
                  >
                    Blog
                  </Link>
                </li>
              </ul>

              <div className="mt-auto border-t border-zinc-800 pt-4">
                {isAuthenticated ? (
                  <div className="space-y-3">
                    <Link 
                      href="/dashboard" 
                      onClick={() => setMobileMenuOpen(false)} 
                      className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-zinc-300 hover:text-red-500 transition-colors"
                    >
                      <User className="w-4 h-4" /> Dashboard
                    </Link>
                    <button 
                      onClick={() => { logout(); setMobileMenuOpen(false); }} 
                      className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-red-500 hover:text-red-400 transition-colors"
                    >
                      <LogOut className="w-4 h-4" /> Logout
                    </button>
                  </div>
                ) : (
                  <Link 
                    href="/login" 
                    onClick={() => setMobileMenuOpen(false)} 
                    className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-zinc-300 hover:text-red-500 transition-colors"
                  >
                    <User className="w-4 h-4" /> Sign In
                  </Link>
                )}

                <div className="flex gap-4 mt-4">
                  <Link 
                    href="/wishlist" 
                    onClick={() => setMobileMenuOpen(false)} 
                    className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-zinc-300 hover:text-red-500 relative transition-colors"
                  >
                    <Heart className="w-4 h-4" /> Wishlist
                    {wishlistCount > 0 && (
                      <span className="absolute top-0 right-0 bg-red-500 text-white text-[7px] font-black rounded-full min-w-3.5 h-3.5 flex items-center justify-center border border-[#050505] shadow-sm">
                        {wishlistCount}
                      </span>
                    )}
                  </Link>
                  <Link 
                    href="/cart" 
                    onClick={() => setMobileMenuOpen(false)} 
                    className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-zinc-300 hover:text-red-500 relative transition-colors"
                  >
                    <ShoppingCart className="w-4 h-4" /> Cart
                    {cartCount > 0 && (
                      <span className="absolute top-0 right-0 bg-red-500 text-white text-[7px] font-black rounded-full min-w-3.5 h-3.5 flex items-center justify-center border border-[#050505] shadow-sm">
                        {cartCount}
                      </span>
                    )}
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// Sub-components...
function NavItem({ href, label, isHighlight = false }: { href: string, label: string, isHighlight?: boolean }) {
  return (
    <li>
      <Link href={href} className={`text-[9px] font-black uppercase tracking-[0.2em] transition-colors ${isHighlight ? 'text-red-500 hover:text-red-400' : 'text-zinc-400 hover:text-white'}`}>
        {label}
      </Link>
    </li>
  );
}