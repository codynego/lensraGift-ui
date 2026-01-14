"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, Package, Heart, Palette, User, LogOut, 
  Menu, X, Settings, Bell, Search, Zap, ChevronRight,
  Globe, Cpu, Activity
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center">
          <div className="w-10 h-10 border-2 border-zinc-200 border-t-red-600 rounded-full animate-spin mb-4" />
          <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-zinc-400">Loading Workspace</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  const menuItems = [
    { href: '/dashboard', name: 'Overview', icon: <LayoutDashboard className="w-5 h-5" /> },
    { href: '/dashboard/designs', name: 'Design Vault', icon: <Palette className="w-5 h-5" />, badge: '03' },
    { href: '/dashboard/orders', name: 'My Orders', icon: <Package className="w-5 h-5" />, badge: '02' },
    { href: '/dashboard/wishlist', name: 'WishList', icon: <Heart className="w-5 h-5" /> },
    { href: '/dashboard/rewards', name: 'Rewards', icon: <Zap className="w-5 h-5" /> },
    { href: '/dashboard/profile', name: 'Profile', icon: <User className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen bg-white text-zinc-900 flex overflow-hidden font-sans">
      
      {/* 1. MINIMAL SIDEBAR */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-zinc-50 border-r border-zinc-200 transform transition-transform duration-300 ease-in-out 
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>

        {/* Profile Card Summary */}
        <div className="p-4 mx-4 my-6 bg-white border border-zinc-200 rounded-2xl shadow-sm">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-zinc-100 flex items-center justify-center border border-zinc-200">
                   <User className="w-5 h-5 text-zinc-400" />
                </div>
                <div>
                    <p className="text-[10px] font-bold text-red-600 uppercase tracking-widest leading-none mb-1">Authenticated</p>
                    <p className="text-sm font-bold truncate">{user?.first_name || 'Agent'}</p>
                </div>
            </div>
        </div>

        {/* Navigation */}
        <nav className="px-3 space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive 
                    ? 'bg-zinc-900 text-white shadow-md shadow-zinc-200' 
                    : 'text-zinc-500 hover:text-zinc-900 hover:bg-white hover:border-zinc-200 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={isActive ? 'text-red-500' : 'text-zinc-400 group-hover:text-red-600'}>
                    {item.icon}
                  </span>
                  <span className="font-bold uppercase tracking-wider text-[11px]">{item.name}</span>
                </div>
                {item.badge && (
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${isActive ? 'bg-red-600 text-white' : 'bg-zinc-200 text-zinc-600'}`}>
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-zinc-200 bg-zinc-50/50">
          <Link href="/dashboard/settings" className="flex items-center gap-3 px-4 py-3 text-zinc-500 hover:text-zinc-900 transition-colors mb-2">
            <Settings className="w-4 h-4" />
            <span className="text-[11px] font-bold uppercase tracking-wider">Settings</span>
          </Link>
          <button 
            onClick={logout} 
            className="w-full flex items-center justify-center gap-2 py-3 bg-white border border-red-100 text-red-600 hover:bg-red-50 transition-all rounded-xl font-bold uppercase tracking-widest text-[10px]"
          >
            <LogOut className="w-4 h-4" /> Terminate Session
          </button>
        </div>
      </aside>

      {/* 2. MAIN WORKSPACE */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Workspace Header */}
        <header className="h-20 bg-white border-b border-zinc-200 flex items-center justify-between px-6 lg:px-10 sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <button 
                onClick={() => setIsSidebarOpen(true)} 
                className="lg:hidden p-2 text-zinc-500 hover:text-black"
            >
              <Menu className="w-6 h-6" />
            </button>
            
            <div className="relative hidden md:flex items-center group">
              <Search className="absolute left-4 w-4 h-4 text-zinc-300 group-focus-within:text-red-500 transition-colors" />
              <input 
                type="text" 
                placeholder="Find in vault..." 
                className="w-72 pl-11 pr-4 py-2 bg-zinc-50 border border-zinc-200 rounded-full focus:bg-white focus:ring-2 focus:ring-red-600/5 focus:border-red-600/20 outline-none text-xs font-medium transition-all" 
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            {/* System Status Indicators */}
            <div className="hidden xl:flex items-center gap-6 border-r border-zinc-100 pr-6">
                <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.4)]" />
                    <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">SVR_OK</span>
                </div>
                <div className="flex items-center gap-2">
                    <Activity className="w-3.5 h-3.5 text-zinc-300" />
                    <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">42ms</span>
                </div>
            </div>

            <button className="p-2 text-zinc-400 hover:text-zinc-900 transition relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-600 rounded-full border-2 border-white" />
            </button>
            
            <Link href="/dashboard/profile" className="flex items-center gap-3 group">
               <div className="hidden text-right lg:block">
                  <p className="text-[10px] font-bold uppercase tracking-tight leading-none text-zinc-400">Account</p>
                  <p className="text-xs font-bold">{user?.first_name || 'Agent'}</p>
               </div>
               <div className="w-10 h-10 rounded-full border border-zinc-200 p-0.5 group-hover:border-red-600 transition-colors">
                  <div className="w-full h-full bg-zinc-100 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-zinc-400" />
                  </div>
               </div>
            </Link>
          </div>
        </header>

        {/* Canvas Area */}
        <main className="flex-1 overflow-y-auto bg-zinc-50/30">
          <div className="max-w-[1400px] mx-auto p-6 lg:p-10">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Interaction Overlay */}
      {isSidebarOpen && (
        <div 
          onClick={() => setIsSidebarOpen(false)} 
          className="fixed inset-0 bg-zinc-900/20 backdrop-blur-sm z-40 lg:hidden transition-opacity" 
        />
      )}
    </div>
  );
}