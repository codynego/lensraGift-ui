"use client";

import { useState } from 'react';
import { Search, ShoppingCart, User, Heart, Menu, X, ChevronDown, LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();

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
            
            {/* Logo */}
            <Link href="/" className="text-3xl font-black tracking-tighter uppercase italic flex-shrink-0">
              Lensra<span className="text-red-600">.</span>
            </Link>

            {/* Simple Search Bar */}
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

            {/* Right Side Actions */}
            <div className="flex items-center gap-3 md:gap-6">
              
              {/* Account Section */}
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

              {/* Favorites & Cart */}
              <div className="flex items-center border-l border-zinc-100 pl-4 md:pl-6">
                <Link href="/wishlist" className="p-3 hover:text-red-600 transition relative group">
                  <Heart className="w-6 h-6 stroke-[2.5px]" />
                  <span className="absolute top-2 right-2 bg-black text-white text-[8px] font-black rounded-full w-4 h-4 flex items-center justify-center border-2 border-white">3</span>
                </Link>

                <Link href="/cart" className="p-3 hover:text-red-600 transition relative">
                  <ShoppingCart className="w-6 h-6 stroke-[2.5px]" />
                  <span className="absolute top-2 right-2 bg-red-600 text-white text-[8px] font-black rounded-full w-4 h-4 flex items-center justify-center border-2 border-white">2</span>
                </Link>
              </div>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-3 bg-zinc-100 rounded-2xl hover:bg-black hover:text-white transition"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* 3. DESKTOP CATEGORIES */}
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

        {/* 4. MOBILE MENU DRAWER */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-50 bg-white p-8 animate-in slide-in-from-right duration-300">
            <div className="flex justify-between items-center mb-12">
               <span className="text-2xl font-black italic uppercase">Menu</span>
               <button onClick={() => setMobileMenuOpen(false)} className="p-3 bg-zinc-100 rounded-full">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-10">
              <div className="flex flex-col gap-6">
                <MobileLink href="/products" label="Shop All" onClick={() => setMobileMenuOpen(false)} />
                <MobileLink href="/design-ideas" label="Top Designs" onClick={() => setMobileMenuOpen(false)} />
                <MobileLink href="/business" label="Business" onClick={() => setMobileMenuOpen(false)} />
                <MobileLink href="/sale" label="Sale" onClick={() => setMobileMenuOpen(false)} />
                <MobileLink href="/about" label="About Us" onClick={() => setMobileMenuOpen(false)} />
                <MobileLink href="/contact" label="Contact" onClick={() => setMobileMenuOpen(false)} />
              </div>

              <div className="h-px bg-zinc-100" />

              <div>
                {isAuthenticated ? (
                  <Link href="/dashboard" className="flex items-center gap-4 p-5 bg-zinc-50 rounded-[32px]">
                    <div className="w-14 h-14 bg-black text-white rounded-[20px] flex items-center justify-center text-xl font-black">
                      {user?.first_name?.charAt(0)}
                    </div>
                    <div>
                      <p className="font-black text-lg uppercase tracking-tight">{user?.first_name}</p>
                      <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">My Account</p>
                    </div>
                  </Link>
                ) : (
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="flex items-center justify-center gap-3 w-full py-6 bg-black text-white rounded-[32px] font-black uppercase text-sm tracking-widest">
                    <User className="w-5 h-5" /> Sign In / Register
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
}

// Small UI Helpers
function NavItem({ href, label, hasDropdown = false, isHighlight = false }: { href: string, label: string, hasDropdown?: boolean, isHighlight?: boolean }) {
  return (
    <li>
      <Link 
        href={href} 
        className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] transition-colors ${
          isHighlight ? 'text-red-600 hover:text-red-700' : 'text-zinc-500 hover:text-black'
        }`}
      >
        {label}
        {hasDropdown && <ChevronDown className="w-3 h-3 text-red-600" />}
      </Link>
    </li>
  );
}

function MobileLink({ href, label, onClick }: { href: string, label: string, onClick: () => void }) {
  return (
    <Link 
      href={href} 
      onClick={onClick} 
      className="text-4xl font-black uppercase italic tracking-tighter hover:text-red-600 transition"
    >
      {label}
    </Link>
  );
}