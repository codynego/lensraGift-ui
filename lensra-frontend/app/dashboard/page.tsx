"use client";

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LogOut, ShoppingCart, Star, Palette, Package, 
  Heart, Sparkles, Zap, ChevronRight, UserCircle,
  Plus, ArrowRight, TrendingUp, ShieldCheck, Activity
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const BaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000/";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, isLoading, logout, token } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  
  const [dashboardStats, setDashboardStats] = useState({
    design_count: 0,
    active_orders_count: 0,
    wishlist_count: 0,
    reward_points: 0
  });
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) router.push('/login');
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    if (isAuthenticated && token) fetchDashboardStats();
  }, [isAuthenticated, token]);

  const fetchDashboardStats = async () => {
    setStatsLoading(true);
    try {
      const response = await fetch(`${BaseUrl}api/users/profile/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      setDashboardStats({
        design_count: data.design_count || 0,
        active_orders_count: data.active_orders_count || 0,
        wishlist_count: data.wishlist_count || 0,
        reward_points: data.reward_points || 0
      });
    } catch (error) {
      console.error('Stats fetch error');
    } finally {
      setStatsLoading(false);
    }
  };

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="flex flex-col items-center">
        <div className="w-10 h-10 border-2 border-zinc-200 border-t-red-600 rounded-full animate-spin mb-4" />
        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-400">Syncing Workspace</p>
      </div>
    </div>
  );

  const isOverview = pathname === '/dashboard' || pathname === '/dashboard/';

  return (
    <div className="min-h-screen bg-zinc-50/30 text-zinc-900 font-sans">
      
      <main className="max-w-7xl mx-auto px-6 py-10">
        {isOverview ? (
          <div className="space-y-12">
            
            {/* 2. HERO SECTION */}
            <section className="bg-zinc-900 rounded-[32px] p-8 md:p-12 relative overflow-hidden text-white shadow-2xl shadow-zinc-200">
              <div className="absolute right-0 top-0 w-1/3 h-full bg-red-600/10 blur-[100px] rounded-full" />
              <div className="relative z-10">
                <span className="text-red-500 font-bold text-[10px] uppercase tracking-[0.4em] mb-4 block">Workspace / Overview</span>
                <h1 className="text-3xl md:text-5xl font-bold tracking-tight leading-tight mb-8 uppercase">
                  Welcome <span className="text-zinc-500">Back,</span> <br /> 
                  <span className="text-white">{user?.first_name || "Creator"}</span><span className="text-red-600">.</span>
                </h1>
                <div className="flex flex-wrap gap-4">
                  <Link href="/dashboard/designs" className="px-6 py-3 bg-red-600 text-white rounded-xl font-bold uppercase text-[10px] tracking-widest hover:bg-red-700 transition-all flex items-center gap-2">
                    <Plus className="w-4 h-4" /> New Design
                  </Link>
                  <Link href="/products" className="px-6 py-3 bg-zinc-800 text-zinc-300 border border-zinc-700 rounded-xl font-bold uppercase text-[10px] tracking-widest hover:bg-white hover:text-black transition-all">
                    Browse Catalog
                  </Link>
                </div>
              </div>
            </section>

            {/* 3. TELEMETRY STATS */}
            <section>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-[0.3em]">Live Telemetry</h2>
                  <div className="h-1 w-8 bg-red-600 mt-2" />
                </div>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: 'Vault', value: dashboardStats.design_count, icon: <Palette className="w-5 h-5"/>, link: '/dashboard/designs' },
                  { label: 'Deploys', value: dashboardStats.active_orders_count, icon: <Package className="w-5 h-5"/>, link: '/dashboard/orders' },
                  { label: 'Archive', value: dashboardStats.wishlist_count, icon: <Heart className="w-5 h-5"/>, link: '/dashboard/wishlist' },
                  { label: 'Credits', value: dashboardStats.reward_points, icon: <Star className="w-5 h-5"/>, link: '/dashboard/rewards' },
                ].map((stat, i) => (
                  <Link key={i} href={stat.link} className="group bg-white hover:bg-zinc-900 p-6 md:p-8 rounded-[24px] border border-zinc-200 transition-all duration-300">
                    <div className="w-10 h-10 bg-zinc-50 rounded-lg flex items-center justify-center mb-6 group-hover:bg-red-600 group-hover:text-white transition-colors">
                      <div className="text-zinc-400 group-hover:text-white">{stat.icon}</div>
                    </div>
                    <p className="text-3xl md:text-4xl font-bold tracking-tighter mb-1 group-hover:text-white transition-colors">
                      {statsLoading ? '--' : stat.value}
                    </p>
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest group-hover:text-zinc-500 transition-colors">{stat.label}</p>
                  </Link>
                ))}
              </div>
            </section>

            {/* 4. ACTION INTERFACE */}
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white rounded-[32px] p-10 border border-zinc-200 flex flex-col justify-center items-center text-center">
                <div className="w-16 h-16 rounded-2xl bg-zinc-50 flex items-center justify-center mb-6">
                   <TrendingUp className="w-8 h-8 text-zinc-200" />
                </div>
                <h3 className="text-xl font-bold uppercase tracking-tight mb-2">No Active Drops</h3>
                <p className="text-zinc-400 text-[11px] font-bold uppercase tracking-wider max-w-xs leading-relaxed mb-8">
                  System queue is idle. Initiate a design sequence to track deployments.
                </p>
                <Link href="/products" className="flex items-center gap-2 text-red-600 font-bold uppercase text-[10px] tracking-widest hover:gap-4 transition-all">
                  Start Designing <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="space-y-3">
                <h3 className="font-bold uppercase tracking-[0.2em] text-[10px] text-zinc-400 mb-4 px-2">
                  System Shortcuts
                </h3>
                {[
                  { title: 'Global Store', icon: <ShoppingCart className="w-4 h-4"/>, link: '/products' },
                  { title: 'Identity Config', icon: <UserCircle className="w-4 h-4"/>, link: '/dashboard/profile' },
                  { title: 'Redeem Credits', icon: <Star className="w-4 h-4"/>, link: '/dashboard/rewards' },
                ].map((item, idx) => (
                  <Link key={idx} href={item.link} className="flex items-center justify-between p-5 bg-white border border-zinc-200 rounded-2xl hover:border-red-600/20 hover:shadow-lg hover:shadow-zinc-200/50 transition-all group">
                    <div className="flex items-center gap-4">
                      <div className="text-zinc-400 group-hover:text-red-600 transition-colors">{item.icon}</div>
                      <span className="font-bold uppercase tracking-tight text-xs">{item.title}</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-zinc-300 group-hover:text-red-600 transition-all" />
                  </Link>
                ))}
              </div>
            </div>

            {/* 5. STATUS INDICATORS */}
            <section className="py-10 border-t border-zinc-200 grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { label: 'Archive Secure', icon: <ShieldCheck className="w-4 h-4"/> },
                { label: 'Fast Link', icon: <Zap className="w-4 h-4"/> },
                { label: 'High Fidelity', icon: <Palette className="w-4 h-4"/> },
                { label: 'Global Node', icon: <Package className="w-4 h-4"/> },
              ].map((badge, i) => (
                <div key={i} className="flex flex-col items-center text-center">
                  <div className="text-zinc-300 mb-2">{badge.icon}</div>
                  <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-400">{badge.label}</span>
                </div>
              ))}
            </section>

          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            {children}
          </div>
        )}
      </main>
    </div>
  );
}