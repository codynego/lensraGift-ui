"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, Package, Heart, Palette, User, LogOut, 
  Menu, Settings, Bell, Search, Zap, Plus, ArrowRight, 
  TrendingUp, ShieldCheck, Activity, ShoppingCart, Star,
  ChevronRight, UserCircle
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const BaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000/";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, isLoading, logout, token } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [dashboardStats, setDashboardStats] = useState({
    design_count: 0,
    active_orders_count: 0,
    wishlist_count: 0,
    reward_points: 0
  });
  const [recentOrder, setRecentOrder] = useState<any>(null);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (isAuthenticated && token) {
      fetchDashboardData();
    }
  }, [isAuthenticated, token]);

  const fetchDashboardData = async () => {
    setStatsLoading(true);
    try {
      const profileRes = await fetch(`${BaseUrl}api/users/profile/`, {
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
      });
      const profileData = await profileRes.json();
      
      const ordersRes = await fetch(`${BaseUrl}api/orders/orders/`, {
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
      });
      const ordersData = await ordersRes.json();
      const ordersList = Array.isArray(ordersData) ? ordersData : (ordersData.results || []);

      setDashboardStats({
        design_count: profileData.design_count || 0,
        active_orders_count: ordersList.length,
        wishlist_count: profileData.wishlist_count || 0,
        reward_points: profileData.reward_points || 0
      });

      if (ordersList.length > 0) {
        setRecentOrder(ordersList[0]);
      }
    } catch (error) {
      console.error('Data fetch error');
    } finally {
      setStatsLoading(false);
    }
  };

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
    { href: '/dashboard/designs', name: 'Design Vault', icon: <Palette className="w-5 h-5" />, badge: dashboardStats.design_count },
    { href: '/dashboard/orders', name: 'My Orders', icon: <Package className="w-5 h-5" />, badge: dashboardStats.active_orders_count },
    { href: '/dashboard/wishlist', name: 'WishList', icon: <Heart className="w-5 h-5" />, badge: dashboardStats.wishlist_count },
    { href: '/dashboard/rewards', name: 'Rewards', icon: <Zap className="w-5 h-5" /> },
    { href: '/dashboard/profile', name: 'Profile', icon: <User className="w-5 h-5" /> },
  ];

  const isOverview = pathname === '/dashboard' || pathname === '/dashboard/';

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      
      {/* HEADER - Fixed at top */}
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
          {/* System Status */}
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

      {/* SIDEBAR - Fixed below header */}
      <aside className={`fixed top-20 bottom-0 left-0 z-40 w-72 bg-white border-r border-zinc-200 flex flex-col transform transition-transform duration-300 ease-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>

        {/* Profile Card */}
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

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group flex items-center justify-between px-4 py-3.5 rounded-xl transition-all duration-300 ${
                  isActive 
                    ? 'bg-zinc-900 text-white shadow-lg shadow-zinc-900/10' 
                    : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`transition-colors duration-300 ${isActive ? 'text-red-500' : 'text-zinc-400 group-hover:text-red-600'}`}>
                    {item.icon}
                  </span>
                  <span className="font-bold uppercase tracking-wider text-[11px]">{item.name}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className={`text-[9px] font-bold px-2 py-1 rounded-md transition-colors duration-300 ${
                    isActive ? 'bg-red-600 text-white' : 'bg-zinc-200 text-zinc-600 group-hover:bg-zinc-300'
                  }`}>
                    {statsLoading ? '—' : item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
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
            className="w-full flex items-center justify-center gap-2 py-3.5 bg-red-50 border border-red-200 text-red-600 hover:bg-red-600 hover:text-white transition-all duration-300 rounded-xl font-bold uppercase tracking-widest text-[10px] shadow-sm"
          >
            <LogOut className="w-4 h-4" /> Terminate Session
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT - Offset by header and sidebar */}
      <main className="pt-20 lg:pl-72 min-h-screen">
        <div className="w-full max-w-[1400px] mx-auto p-4 sm:p-6 lg:p-10">
          {isOverview ? (
            <div className="space-y-8 lg:space-y-12">
              
              {/* HERO SECTION */}
              <section className="relative bg-zinc-900 rounded-3xl lg:rounded-[40px] p-8 md:p-12 lg:p-16 shadow-xl overflow-hidden">
                <div className="absolute inset-0">
                  <div className="absolute -right-20 -top-20 w-80 h-80 bg-red-600/20 blur-3xl rounded-full" />
                  <div className="absolute -left-20 -bottom-20 w-60 h-60 bg-zinc-800/50 blur-3xl rounded-full" />
                </div>
                
                <div className="relative z-10 max-w-3xl">
                  <span className="inline-block text-red-500 font-bold text-[10px] uppercase tracking-[0.4em] mb-6">Account Overview</span>
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] mb-8 lg:mb-10">
                    <span className="block text-white uppercase">Welcome <span className="text-zinc-500">Back,</span></span>
                    <span className="block text-white uppercase mt-2">{user?.first_name || "Creator"}<span className="text-red-600">.</span></span>
                  </h1>
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                    <Link href="/dashboard/designs" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-red-600 text-white rounded-2xl font-bold uppercase text-[11px] tracking-widest hover:bg-red-700 transition-all duration-300 shadow-lg shadow-red-600/20">
                      <Plus className="w-4 h-4" /> Create New
                    </Link>
                    <Link href="/products" className="inline-flex items-center justify-center px-8 py-4 bg-white/10 backdrop-blur-sm text-white border border-white/20 rounded-2xl font-bold uppercase text-[11px] tracking-widest hover:bg-white hover:text-zinc-900 transition-all duration-300">
                      Shop Products
                    </Link>
                  </div>
                </div>
              </section>

              {/* STATS GRID */}
              <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                {[
                  { label: 'Designs', value: dashboardStats.design_count, icon: <Palette className="w-5 h-5"/>, link: '/dashboard/designs', color: 'bg-purple-50 text-purple-600' },
                  { label: 'Orders', value: dashboardStats.active_orders_count, icon: <Package className="w-5 h-5"/>, link: '/dashboard/orders', color: 'bg-blue-50 text-blue-600' },
                  { label: 'Saved', value: dashboardStats.wishlist_count, icon: <Heart className="w-5 h-5"/>, link: '/dashboard/wishlist', color: 'bg-pink-50 text-pink-600' },
                  { label: 'Points', value: dashboardStats.reward_points, icon: <Star className="w-5 h-5"/>, link: '/dashboard/rewards', color: 'bg-amber-50 text-amber-600' },
                ].map((stat, i) => (
                  <Link key={i} href={stat.link} className="group relative bg-white hover:bg-zinc-900 p-6 lg:p-8 rounded-2xl lg:rounded-3xl border border-zinc-200 hover:border-zinc-900 transition-all duration-500 hover:shadow-2xl hover:shadow-zinc-900/10 hover:-translate-y-1">
                    <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${stat.color} mb-6 group-hover:bg-red-600 group-hover:text-white transition-all duration-300`}>
                      {stat.icon}
                    </div>
                    <p className="text-4xl lg:text-5xl font-bold tracking-tighter mb-2 group-hover:text-white transition-colors">
                      {statsLoading ? '—' : stat.value}
                    </p>
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] group-hover:text-zinc-500 transition-colors">{stat.label}</p>
                  </Link>
                ))}
              </section>

              {/* MAIN CONTENT GRID */}
              <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
                
                {/* ORDER STATUS */}
                <div className="lg:col-span-2 bg-white rounded-2xl lg:rounded-3xl p-8 lg:p-12 border border-zinc-200 min-h-[280px] flex items-center">
                  {recentOrder ? (
                    <div className="w-full">
                      <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black tracking-widest uppercase mb-8">
                        <Activity className="w-3.5 h-3.5" /> Active Order
                      </div>
                      <h3 className="text-2xl lg:text-3xl font-bold uppercase mb-2 tracking-tight">{recentOrder.order_number}</h3>
                      <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-10">
                        Placed {new Date(recentOrder.created_at).toLocaleDateString()} • Status: {recentOrder.status}
                      </p>
                      <Link href="/dashboard/orders" className="inline-flex items-center gap-3 text-red-600 font-bold uppercase text-[11px] tracking-widest group hover:gap-5 transition-all">
                        Track All Orders <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  ) : (
                    <div className="w-full flex flex-col items-center text-center py-8">
                      <div className="w-20 h-20 rounded-2xl bg-zinc-50 flex items-center justify-center mb-6">
                        <TrendingUp className="w-10 h-10 text-zinc-200" />
                      </div>
                      <h3 className="text-xl lg:text-2xl font-bold uppercase tracking-tight mb-3">No Active Orders</h3>
                      <p className="text-zinc-400 text-[11px] font-bold uppercase tracking-wider max-w-sm leading-relaxed mb-8">
                        You don&apos;t have any orders in progress right now. Start a new design to see it here.
                      </p>
                      <Link href="/products" className="inline-flex items-center gap-3 text-red-600 font-bold uppercase text-[11px] tracking-widest group hover:gap-5 transition-all">
                        Browse Products <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  )}
                </div>

                {/* QUICK LINKS */}
                <div className="space-y-4">
                  <h3 className="font-bold uppercase tracking-[0.2em] text-[10px] text-zinc-400 mb-5 px-1">Quick Links</h3>
                  {[
                    { title: 'Store Front', icon: <ShoppingCart className="w-4 h-4"/>, link: '/products' },
                    { title: 'Edit Profile', icon: <UserCircle className="w-4 h-4"/>, link: '/dashboard/profile' },
                    { title: 'Rewards', icon: <Star className="w-4 h-4"/>, link: '/dashboard/rewards' },
                  ].map((item, idx) => (
                    <Link key={idx} href={item.link} className="flex items-center justify-between p-5 lg:p-6 bg-white border border-zinc-200 rounded-2xl hover:border-zinc-900 hover:shadow-lg transition-all duration-300 group">
                      <div className="flex items-center gap-4">
                        <div className="text-zinc-400 group-hover:text-red-600 transition-colors duration-300">{item.icon}</div>
                        <span className="font-bold uppercase tracking-tight text-xs lg:text-sm">{item.title}</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-zinc-300 group-hover:text-zinc-900 group-hover:translate-x-1 transition-all duration-300" />
                    </Link>
                  ))}
                </div>
              </div>

              {/* TRUST BADGES */}
              <section className="pt-12 border-t border-zinc-200">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
                  {[
                    { label: 'Secure Storage', icon: <ShieldCheck className="w-5 h-5"/> },
                    { label: 'Fast Shipping', icon: <Zap className="w-5 h-5"/> },
                    { label: 'Premium Quality', icon: <Palette className="w-5 h-5"/> },
                    { label: 'Worldwide', icon: <Package className="w-5 h-5"/> },
                  ].map((badge, i) => (
                    <div key={i} className="flex flex-col items-center text-center gap-3">
                      <div className="text-zinc-300">{badge.icon}</div>
                      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">{badge.label}</span>
                    </div>
                  ))}
                </div>
              </section>

            </div>
          ) : (
            <div className="animate-in fade-in duration-500">
              {children}
            </div>
          )}
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