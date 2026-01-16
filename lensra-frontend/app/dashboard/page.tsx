"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ShoppingCart, Star, Palette, Package, Heart, Zap, 
  ChevronRight, UserCircle, Plus, ArrowRight, TrendingUp, 
  ShieldCheck, Activity
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const BaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000/";

export default function DashboardPage() {
  const { user, isAuthenticated, isLoading, token } = useAuth();
  const router = useRouter();
  
  const [dashboardStats, setDashboardStats] = useState({
    design_count: 0,
    active_orders_count: 0,
    wishlist_count: 0,
    reward_points: 0
  });
  const [recentOrder, setRecentOrder] = useState<any>(null);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) router.push('/login');
  }, [isAuthenticated, isLoading, router]);

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

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="flex flex-col items-center">
        <div className="w-10 h-10 border-2 border-zinc-200 border-t-red-600 rounded-full animate-spin mb-4" />
        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-400">Loading Account</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-12 animate-in fade-in duration-500">
      
      {/* 1. HERO SECTION */}
      <section className="bg-zinc-900 rounded-[32px] p-8 md:p-12 relative overflow-hidden text-white shadow-2xl">
        <div className="absolute right-0 top-0 w-1/3 h-full bg-red-600/10 blur-[100px] rounded-full" />
        <div className="relative z-10">
          <span className="text-red-500 font-bold text-[10px] uppercase tracking-[0.4em] mb-4 block">Account Overview</span>
          <h2 className="text-2xl md:text-4xl font-bold tracking-tight leading-tight mb-8 uppercase">
            Welcome <span className="text-zinc-500">Back,</span> <br /> 
            <span className="text-white">{user?.first_name || "Creator"}</span><span className="text-red-600">.</span>
          </h2>
          <div className="flex flex-wrap gap-4">
            <Link href="/dashboard/designs" className="px-6 py-3 bg-red-600 text-white rounded-xl font-bold uppercase text-[10px] tracking-widest hover:bg-red-700 transition-all flex items-center gap-2">
              <Plus className="w-4 h-4" /> Create New
            </Link>
            <Link href="/products" className="px-6 py-3 bg-zinc-800 text-zinc-300 border border-zinc-700 rounded-xl font-bold uppercase text-[10px] tracking-widest hover:bg-white hover:text-black transition-all">
              Shop Products
            </Link>
          </div>
        </div>
      </section>

      {/* 2. SUMMARY STATS */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Designs', value: dashboardStats.design_count, icon: <Palette className="w-5 h-5"/>, link: '/dashboard/designs' },
          { label: 'Orders', value: dashboardStats.active_orders_count, icon: <Package className="w-5 h-5"/>, link: '/dashboard/orders' },
          { label: 'Saved', value: dashboardStats.wishlist_count, icon: <Heart className="w-5 h-5"/>, link: '/dashboard/wishlist' },
          { label: 'Points', value: dashboardStats.reward_points, icon: <Star className="w-5 h-5"/>, link: '/dashboard/rewards' },
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
      </section>

      {/* 3. ORDER STATUS & QUICK LINKS */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-[32px] p-8 md:p-10 border border-zinc-200 flex flex-col justify-center">
          {recentOrder ? (
            <div className="w-full">
              <div className="flex items-center gap-2 mb-6">
                <div className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[9px] font-black tracking-widest uppercase flex items-center gap-1.5">
                  <Activity className="w-3 h-3" /> Active Order
                </div>
              </div>
              <h3 className="text-2xl font-bold uppercase mb-1">{recentOrder.order_number}</h3>
              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-8">
                Placed on {new Date(recentOrder.created_at).toLocaleDateString()} — Status: {recentOrder.status}
              </p>
              <Link href={`/dashboard/orders`} className="inline-flex items-center gap-2 text-red-600 font-bold uppercase text-[10px] tracking-widest hover:gap-4 transition-all">
                Track All Orders <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-zinc-50 flex items-center justify-center mb-6">
                 <TrendingUp className="w-8 h-8 text-zinc-200" />
              </div>
              <h3 className="text-xl font-bold uppercase tracking-tight mb-2">No Active Orders</h3>
              <p className="text-zinc-400 text-[11px] font-bold uppercase tracking-wider max-w-xs leading-relaxed mb-8">
                You don&apos;t have any orders in progress right now. Start a new design to see it here.
              </p>
              <Link href="/products" className="flex items-center gap-2 text-red-600 font-bold uppercase text-[10px] tracking-widest hover:gap-4 transition-all">
                Browse Products <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>

        <div className="space-y-3">
          <h3 className="font-bold uppercase tracking-[0.2em] text-[10px] text-zinc-400 mb-4 px-2">Quick Links</h3>
          {[
            { title: 'Store Front', icon: <ShoppingCart className="w-4 h-4"/>, link: '/products' },
            { title: 'Edit Profile', icon: <UserCircle className="w-4 h-4"/>, link: '/dashboard/profile' },
            { title: 'Rewards', icon: <Star className="w-4 h-4"/>, link: '/dashboard/rewards' },
          ].map((item, idx) => (
            <Link key={idx} href={item.link} className="flex items-center justify-between p-5 bg-white border border-zinc-200 rounded-2xl hover:border-black transition-all group">
              <div className="flex items-center gap-4">
                <div className="text-zinc-400 group-hover:text-red-600 transition-colors">{item.icon}</div>
                <span className="font-bold uppercase tracking-tight text-xs">{item.title}</span>
              </div>
              <ChevronRight className="w-4 h-4 text-zinc-300 group-hover:text-black transition-all" />
            </Link>
          ))}
        </div>
      </div>

      {/* 4. TRUST BADGES */}
      <section className="py-10 border-t border-zinc-200 grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { label: 'Secure Storage', icon: <ShieldCheck className="w-4 h-4"/> },
          { label: 'Fast Shipping', icon: <Zap className="w-4 h-4"/> },
          { label: 'Premium Quality', icon: <Palette className="w-4 h-4"/> },
          { label: 'Worldwide', icon: <Package className="w-4 h-4"/> },
        ].map((badge, i) => (
          <div key={i} className="flex flex-col items-center text-center">
            <div className="text-zinc-300 mb-2">{badge.icon}</div>
            <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-400">{badge.label}</span>
          </div>
        ))}
      </section>

    </div>
  );
}