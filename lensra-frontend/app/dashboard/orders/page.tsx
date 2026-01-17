"use client";

import { useState, useEffect, useMemo } from 'react';
import { 
  Package, Clock, Printer, Truck, CheckCircle, Search, 
  Loader2, Zap, ChevronRight, AlertCircle, ShoppingBag
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const BaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.lensra.com/";

export default function OrdersDashboard() {
  const { token, isAuthenticated } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('recent');

  useEffect(() => {
    if (token) {
      fetchOrders();
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${BaseUrl}api/orders/orders/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      setOrders(Array.isArray(data) ? data : (data.results || []));
    } catch (err) {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleGuestSearch = async () => {
    if (!searchQuery) return;
    setLoading(true);
    try {
      const response = await fetch(`${BaseUrl}api/orders/orders/${searchQuery}/`);
      if (response.ok) {
        const data = await response.json();
        setOrders([data]);
      } else {
        alert("Order not found. Please check your Order ID.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusConfig = (status: string) => {
    const s = status?.toLowerCase() || 'pending';
    const configs: Record<string, { label: string; color: string; bgColor: string; icon: any }> = {
      pending: { label: 'PENDING', color: 'text-orange-600', bgColor: 'bg-orange-50', icon: <Clock className="w-3 h-3" /> },
      printing: { label: 'PRINTING', color: 'text-blue-600', bgColor: 'bg-blue-50', icon: <Printer className="w-3 h-3" /> },
      shipping: { label: 'SHIPPING', color: 'text-purple-600', bgColor: 'bg-purple-50', icon: <Truck className="w-3 h-3" /> },
      delivered: { label: 'DELIVERED', color: 'text-emerald-600', bgColor: 'bg-emerald-50', icon: <CheckCircle className="w-3 h-3" /> },
      cancelled: { label: 'CANCELLED', color: 'text-zinc-400', bgColor: 'bg-zinc-100', icon: <AlertCircle className="w-3 h-3" /> }
    };
    return configs[s] || configs.pending;
  };

  const filteredOrders = useMemo(() => {
    let result = orders.filter(order => {
      const matchesSearch = order.order_number.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || order.status.toLowerCase() === statusFilter.toLowerCase();
      return matchesSearch && matchesStatus;
    });

    return result.sort((a, b) => {
      if (sortBy === 'recent') return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      if (sortBy === 'price-high') return parseFloat(b.total_amount) - parseFloat(a.total_amount);
      return 0;
    });
  }, [orders, searchQuery, statusFilter, sortBy]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <Loader2 className="w-10 h-10 text-red-600 animate-spin mb-4" />
      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">Syncing with Lensra...</p>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 space-y-12">
      
      {/* 1. HERO HEADER */}
      <section className="bg-black rounded-[40px] p-10 md:p-16 relative overflow-hidden text-white shadow-2xl">
        <div className="absolute right-[-10%] top-[-20%] w-80 h-80 bg-red-600/20 blur-[120px] rounded-full" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-zinc-800 rounded-full text-[9px] font-black uppercase tracking-widest mb-6">
              <Zap className="w-3 h-3 text-red-500 fill-red-500" /> Live Tracking Enabled
            </div>
            <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter leading-none uppercase">
              {isAuthenticated ? 'Your Orders' : 'Track Order'}<span className="text-red-600">.</span>
            </h1>
          </div>
          
          {isAuthenticated && (
            <div className="bg-zinc-900/50 backdrop-blur-md border border-zinc-800 p-6 rounded-[28px] min-w-[180px]">
              <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-2">Total Purchases</p>
              <p className="text-4xl font-black italic tracking-tighter">
                {orders.length < 10 ? `0${orders.length}` : orders.length}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* 2. SEARCH & FILTERS */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1 relative group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-black transition-colors" />
          <input
            type="text"
            placeholder="ENTER ORDER NUMBER (E.G. LRG-XXXX)..."
            className="w-full pl-14 pr-6 py-5 bg-zinc-50 border-2 border-transparent focus:border-black focus:bg-white rounded-2xl outline-none font-bold text-[11px] tracking-widest transition-all uppercase"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !isAuthenticated && handleGuestSearch()}
          />
          {!isAuthenticated && (
            <button 
              onClick={handleGuestSearch}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-black text-white px-4 py-2 rounded-xl text-[9px] font-black uppercase hover:bg-red-600 transition-colors"
            >
              Search
            </button>
          )}
        </div>
        
        {isAuthenticated && (
          <div className="flex gap-4">
            <select 
              className="px-6 py-5 bg-white border-2 border-zinc-100 rounded-2xl outline-none font-black text-[10px] tracking-widest appearance-none cursor-pointer hover:border-zinc-300"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">ALL STATUS</option>
              <option value="pending">PENDING</option>
              <option value="delivered">DELIVERED</option>
            </select>
            
            <select 
              className="px-6 py-5 bg-zinc-900 text-white rounded-2xl outline-none font-black text-[10px] tracking-widest cursor-pointer hover:bg-red-600 transition-colors"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="recent">NEWEST</option>
              <option value="price-high">HIGHEST VALUE</option>
            </select>
          </div>
        )}
      </div>

      {/* 3. ORDER ITEMS */}
      {filteredOrders.length > 0 ? (
        <div className="grid gap-6">
          {filteredOrders.map((order) => {
            const status = getStatusConfig(order.status);
            return (
              <div key={order.id} className="group bg-white rounded-[32px] border border-zinc-100 overflow-hidden hover:shadow-xl hover:border-zinc-300 transition-all duration-300">
                <div className="p-8 flex flex-col md:flex-row md:items-center justify-between gap-8">
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-zinc-50 rounded-2xl flex items-center justify-center border border-zinc-100 group-hover:bg-black group-hover:text-white transition-all duration-500">
                      <Package className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-3 mb-2">
                        <h3 className="text-xl font-black tracking-tight">{order.order_number}</h3>
                        <span className={`${status.bgColor} ${status.color} px-3 py-1.5 rounded-full text-[9px] font-black tracking-tighter flex items-center gap-1.5 border border-current opacity-80`}>
                          {status.icon} {status.label}
                        </span>
                      </div>
                      <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                        Placed on {new Date(order.created_at).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center border-t md:border-t-0 pt-6 md:pt-0 border-zinc-50">
                    <p className="text-3xl font-black italic tracking-tighter">₦{parseFloat(order.total_amount).toLocaleString()}</p>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${order.is_paid ? 'bg-green-500' : 'bg-red-500'}`} />
                      <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">{order.is_paid ? 'Payment Received' : 'Awaiting Payment'}</p>
                    </div>
                  </div>
                </div>

                {/* ITEMS SUB-GRID */}
                <div className="bg-zinc-50/50 p-6 md:px-8 border-t border-zinc-50 flex flex-wrap gap-4">
                  {order.items?.map((item: any) => (
                    <div key={item.id} className="flex items-center gap-4 bg-white p-3 pr-6 rounded-2xl border border-zinc-100 shadow-sm">
                      <div className="w-12 h-12 rounded-xl bg-zinc-100 overflow-hidden flex-shrink-0">
                        <img 
                          src={item.design_preview_url || '/placeholder.png'} 
                          className="w-full h-full object-cover" 
                          alt={item.product_name} 
                        />
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-tight line-clamp-1">{item.product_name}</p>
                        <p className="text-[9px] font-bold text-red-600 uppercase">Qty: {item.quantity}</p>
                        {item.attributes && <p className="text-[8px] font-bold text-zinc-400 uppercase">{item.attributes}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-zinc-50 rounded-[40px] py-32 text-center border-2 border-dashed border-zinc-200">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
            <ShoppingBag className="w-8 h-8 text-zinc-200" />
          </div>
          <h2 className="text-xl font-black uppercase italic tracking-tighter text-zinc-400">Empty Horizon</h2>
          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] mt-2">
            {isAuthenticated ? "You haven't placed any orders yet." : "Search using your Order ID to track progress."}
          </p>
        </div>
      )}
    </div>
  );
}