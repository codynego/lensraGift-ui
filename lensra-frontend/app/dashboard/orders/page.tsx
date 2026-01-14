"use client";

import { useState, useEffect, useMemo } from 'react';
import { 
  Package, Clock, Printer, Truck, CheckCircle, Search, 
  Eye, RotateCcw, Loader2, Zap, Filter, ChevronRight
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const BaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000/";

export default function OrdersDashboard() {
  const { token } = useAuth();
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
        alert("Order not found. Please check your ID.");
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
      shipping: { label: 'ON THE WAY', color: 'text-purple-600', bgColor: 'bg-purple-50', icon: <Truck className="w-3 h-3" /> },
      delivered: { label: 'DELIVERED', color: 'text-emerald-600', bgColor: 'bg-emerald-50', icon: <CheckCircle className="w-3 h-3" /> },
      cancelled: { label: 'CANCELLED', color: 'text-zinc-400', bgColor: 'bg-zinc-100', icon: <RotateCcw className="w-3 h-3" /> }
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
    <div className="flex flex-col items-center justify-center min-h-[50vh]">
      <Loader2 className="w-10 h-10 text-red-600 animate-spin mb-4" />
      <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-400">Loading Orders</p>
    </div>
  );

  return (
    <div className="space-y-10">
      {/* 1. HEADER SECTION */}
      <section className="bg-zinc-900 rounded-[32px] p-8 md:p-12 relative overflow-hidden text-white shadow-2xl">
        <div className="absolute right-0 top-0 w-1/3 h-full bg-red-600/10 blur-[100px] rounded-full" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div>
            <span className="text-red-500 font-bold text-[10px] uppercase tracking-[0.4em] mb-4 block">Delivery Status</span>
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight uppercase leading-none">
              {token ? 'Order History' : 'Track Order'}<span className="text-red-600">.</span>
            </h1>
          </div>
          
          {token && (
            <div className="flex gap-3">
              <div className="bg-zinc-800 border border-zinc-700 px-6 py-4 rounded-2xl text-center">
                <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Total Orders</p>
                <p className="text-2xl font-bold">{orders.length}</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 2. CONTROLS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-1 relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            placeholder="ORDER ID..."
            className="w-full pl-12 pr-4 py-4 bg-white border border-zinc-200 rounded-2xl outline-none font-bold text-[10px] tracking-[0.2em] transition-all uppercase focus:border-black"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !token && handleGuestSearch()}
          />
          {!token && searchQuery && (
             <button onClick={handleGuestSearch} className="absolute right-4 top-1/2 -translate-y-1/2 text-[9px] font-black text-red-600">SEARCH</button>
          )}
        </div>
        
        {token && (
          <div className="flex gap-4 md:col-span-2">
            <div className="flex-1 relative">
              <select 
                className="w-full pl-6 pr-10 py-4 bg-white border border-zinc-200 rounded-2xl outline-none font-bold text-[10px] tracking-[0.2em] appearance-none cursor-pointer"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">ALL STATUS</option>
                <option value="pending">PENDING</option>
                <option value="delivered">DELIVERED</option>
              </select>
              <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-3 h-3 text-zinc-400 rotate-90 pointer-events-none" />
            </div>
            
            <div className="flex-1 relative">
              <select 
                className="w-full px-6 py-4 bg-zinc-900 text-white rounded-2xl outline-none font-bold text-[10px] tracking-[0.2em] appearance-none cursor-pointer"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="recent">NEWEST FIRST</option>
                <option value="price-high">HIGHEST PRICE</option>
              </select>
              <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-3 h-3 text-zinc-400 rotate-90 pointer-events-none" />
            </div>
          </div>
        )}
      </div>

      {/* 3. ORDER LIST */}
      {filteredOrders.length > 0 ? (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const status = getStatusConfig(order.status);
            return (
              <div key={order.id} className="group bg-white rounded-3xl border border-zinc-200 overflow-hidden hover:border-black transition-all">
                <div className="p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex items-center gap-6">
                    <div className="w-14 h-14 bg-zinc-50 rounded-xl flex items-center justify-center border border-zinc-100 group-hover:bg-black group-hover:text-white transition-colors">
                      <Package className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className="text-lg font-bold uppercase">{order.order_number}</span>
                        <span className={`${status.bgColor} ${status.color} px-3 py-1 rounded-lg text-[8px] font-black tracking-widest flex items-center gap-1.5`}>
                          {status.icon} {status.label}
                        </span>
                      </div>
                      <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                        {new Date(order.created_at).toLocaleDateString()} — {order.shipping_city}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col md:items-end">
                    <p className="text-2xl font-black italic">₦{parseFloat(order.total_amount).toLocaleString()}</p>
                    <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">{order.is_paid ? 'PAID' : 'UNPAID'}</p>
                  </div>
                </div>

                <div className="px-8 pb-8 flex flex-wrap gap-3">
                  {order.items?.map((item: any) => (
                    <div key={item.id} className="flex items-center gap-2 bg-zinc-50 p-2 rounded-xl border border-zinc-100">
                      <div className="w-10 h-10 rounded-lg bg-white border overflow-hidden">
                        <img src={item.design_preview || '/placeholder.png'} className="w-full h-full object-cover" alt="" />
                      </div>
                      <span className="text-[9px] font-black uppercase text-zinc-600">
                        {item.product_name} <span className="text-red-600 ml-1">×{item.quantity}</span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-[32px] py-24 text-center border-2 border-dashed border-zinc-100">
            <Zap className="w-12 h-12 text-zinc-100 mx-auto mb-4" />
            <h2 className="text-lg font-bold uppercase tracking-widest text-zinc-400">No Orders</h2>
            <p className="text-[9px] font-bold text-zinc-300 uppercase tracking-widest mt-1">
              {token ? 'No orders found.' : 'Enter your Order ID to see status.'}
            </p>
        </div>
      )}
    </div>
  );
}