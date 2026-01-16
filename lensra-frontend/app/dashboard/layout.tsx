"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, Package, Heart, Palette, User, LogOut, 
  Menu, Settings, Bell, Search, Zap, Activity
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  // Close sidebar on mobile when route changes
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [pathname]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-3 border-zinc-100 border-t-red-600 rounded-full animate-spin" />
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-400">Loading Workspace</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  const menuItems = [
    { href: '/dashboard', name: 'Overview', icon: <LayoutDashboard className="w-5 h-5" /> },
    { href: '/dashboard/designs', name: 'Design Vault', icon: <Palette className="w-5 h-5" /> },
    { href: '/dashboard/orders', name: 'My Orders', icon: <Package className="w-5 h-5" /> },
    { href: '/dashboard/wishlist', name: 'WishList', icon: <Heart className="w-5 h-5" /> },
    { href: '/dashboard/rewards', name: 'Rewards', icon: <Zap className="w-5 h-5" /> },
    { href: '/dashboard/profile', name: 'Profile', icon: <User className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      
      {/* HEADER */}
      <header className="h-20 bg-white border-b border-zinc-200 flex items-center justify-between px-4 sm:px-6 lg:px-10 lg:pl-80 fixed top-0 left-0 right-0 z-50">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsSidebarOpen(true)} 
            className="lg:hidden p-2 -m-2 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 rounded-xl transition-all duration-300"
          >
            <Menu className="w-6 h-6" />
          </button>
          
          <div className="relative hidden md:flex items-center">
            <Search className="absolute left-4 w-4 h-4 text-zinc-400 pointer-events-none" />
            <input 
              type="text" 
              placeholder="Find in vault..." 
              className="w-80 pl-11 pr-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-full focus:bg-white focus:ring-2 focus:ring-red-600/10 focus:border-red-600 outline-none text-xs font-medium transition-all duration-300 placeholder:text-zinc-400" 
            />
          </div>
        </div>

        <div className="flex items-center gap-4 lg:gap-6">
          <div className="hidden xl:flex items-center gap-6 border-r border-zinc-100 pr-6">
            <div className="flex items-center gap-2">
              <div className="relative">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <div className="absolute inset-0 w-2 h-2 bg-green-500 rounded-full animate-ping opacity-75" />
              </div>
              <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-[0.2em]">System OK</span>
            </div>
            <div className="flex items-center gap-2">
              <Activity className="w-3.5 h-3.5 text-zinc-300" />
              <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-[0.2em]">42ms</span>
            </div>
          </div>

          <button className="relative p-2.5 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 rounded-xl transition-all duration-300">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-600 rounded-full border-2 border-white shadow-sm" />
          </button>
          
          <Link href="/dashboard/profile" className="flex items-center gap-3 group">
            <div className="hidden lg:block text-right">
              <p className="text-[10px] font-bold uppercase tracking-tight leading-none text-zinc-400 mb-0.5">Account</p>
              <p className="text-xs font-bold text-zinc-900">{user?.first_name || 'Agent'}</p>
            </div>
            <div className="w-11 h-11 rounded-full border-2 border-zinc-200 p-0.5 group-hover:border-red-600 transition-all duration-300">
              <div className="w-full h-full bg-zinc-100 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-zinc-400" />
              </div>
            </div>
          </Link>
        </div>
      </header>

      {/* SIDEBAR */}
      <aside className={`fixed top-20 bottom-0 left-0 z-40 w-72 bg-white border-r border-zinc-200 flex flex-col transform transition-transform duration-300 ease-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>

        <div className="p-6 border-b border-zinc-100 flex-shrink-0">
          <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-200">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-white border border-zinc-200 flex items-center justify-center flex-shrink-0">
                <User className="w-5 h-5 text-zinc-400" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[9px] font-bold text-red-600 uppercase tracking-[0.2em] leading-none mb-1.5">Authenticated</p>
                <p className="text-sm font-bold truncate text-zinc-900">{user?.first_name || 'Agent'}</p>
              </div>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group flex items-center px-4 py-3.5 rounded-xl transition-all duration-300 ${
                  isActive 
                    ? 'bg-zinc-900 text-white shadow-lg shadow-zinc-900/10' 
                    : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50'
                }`}
              >
                <span className={`mr-3 transition-colors duration-300 ${isActive ? 'text-red-500' : 'text-zinc-400 group-hover:text-red-600'}`}>
                  {item.icon}
                </span>
                <span className="font-bold uppercase tracking-wider text-[11px]">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-zinc-100 space-y-2 flex-shrink-0">
          <Link 
            href="/dashboard/settings" 
            className="flex items-center gap-3 px-4 py-3 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 rounded-xl transition-all duration-300"
          >
            <Settings className="w-4 h-4" />
            <span className="text-[11px] font-bold uppercase tracking-wider">Settings</span>
          </Link>
          <button 
            onClick={logout} 
            className="w-full flex items-center justify-center gap-2 py-3.5 bg-red-50 border border-red-200 text-red-600 hover:bg-red-600 hover:text-white transition-all duration-300 rounded-xl font-bold uppercase tracking-widest text-[10px]"
          >
            <LogOut className="w-4 h-4" /> Terminate Session
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="pt-20 lg:pl-72 min-h-screen">
        <div className="w-full max-w-[1400px] mx-auto p-4 sm:p-6 lg:p-10">
          {children}
        </div>
      </main>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          onClick={() => setIsSidebarOpen(false)} 
          className="fixed inset-0 bg-zinc-900/40 backdrop-blur-sm z-30 lg:hidden transition-opacity duration-300" 
        />
      )}
    </div>
  );
}