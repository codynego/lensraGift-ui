"use client";

import { useState, useEffect, useMemo } from 'react';
import { 
  Package, Clock, Printer, Truck, CheckCircle, Search, 
  Eye, RotateCcw, Loader2, ArrowRight, Zap, Filter, ChevronRight
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const BaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000/";

// --- Interfaces ---
interface ProductDetails {
  id: number;
  name: string;
  image: string | null;
  base_price: number;
}

interface OrderItem {
  id: number;
  product: number;
  product_details: ProductDetails;
  quantity: number;
  unit_price: string;
  subtotal: string;
}

interface Order {
  id: number;
  order_number: string;
  status: string;
  total_amount: string; 
  shipping_address: string;
  shipping_city: string;
  shipping_state: string;
  shipping_country: string;
  items: OrderItem[];
  created_at: string;
}

export default function OrdersDashboard() {
  const { token } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('recent');

  useEffect(() => {
    if (token) fetchOrders();
  }, [token]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${BaseUrl}api/orders/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      const results = Array.isArray(data) ? data : (data.results || []);
      setOrders(results);
    } catch (err) {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusConfig = (status: string) => {
    const s = status.toLowerCase();
    const configs: Record<string, { label: string; color: string; bgColor: string; icon: any }> = {
      pending: { label: 'QUEUEING', color: 'text-orange-600', bgColor: 'bg-orange-50', icon: <Clock className="w-3 h-3" /> },
      printing: { label: 'IN_PRODUCTION', color: 'text-blue-600', bgColor: 'bg-blue-50', icon: <Printer className="w-3 h-3" /> },
      shipping: { label: 'TRANSIT', color: 'text-purple-600', bgColor: 'bg-purple-50', icon: <Truck className="w-3 h-3" /> },
      delivered: { label: 'ARRIVED', color: 'text-emerald-600', bgColor: 'bg-emerald-50', icon: <CheckCircle className="w-3 h-3" /> },
      cancelled: { label: 'VOIDED', color: 'text-zinc-400', bgColor: 'bg-zinc-100', icon: <RotateCcw className="w-3 h-3" /> }
    };
    return configs[s] || configs.pending;
  };

  const filteredOrders = useMemo(() => {
    let result = orders.filter(order => {
      const matchesSearch = order.order_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            order.items.some(item => item.product_details.name.toLowerCase().includes(searchQuery.toLowerCase()));
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
      <div className="w-10 h-10 border-2 border-zinc-200 border-t-red-600 rounded-full animate-spin mb-4" />
      <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-400">Scanning Deployments</p>
    </div>
  );

  return (
    <div className="space-y-10">
      {/* 1. HEADER SECTION */}
      <section className="bg-zinc-900 rounded-[32px] p-8 md:p-12 relative overflow-hidden text-white shadow-2xl shadow-zinc-200">
        <div className="absolute right-0 top-0 w-1/3 h-full bg-red-600/10 blur-[100px] rounded-full" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div>
            <span className="text-red-500 font-bold text-[10px] uppercase tracking-[0.4em] mb-4 block">Fleet Logistics</span>
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight uppercase leading-none">
              Deployment <span className="text-zinc-500">History</span><span className="text-red-600">.</span>
            </h1>
          </div>
          
          <div className="flex gap-3">
            <div className="bg-zinc-800 border border-zinc-700 px-6 py-4 rounded-2xl">
              <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Fulfilled</p>
              <p className="text-2xl font-bold">{orders.filter(o => o.status === 'delivered').length}</p>
            </div>
            <div className="bg-red-600 px-6 py-4 rounded-2xl shadow-lg shadow-red-900/20">
              <p className="text-[9px] font-bold text-red-200 uppercase tracking-widest mb-1">In Transit</p>
              <p className="text-2xl font-bold">{orders.filter(o => ['pending', 'printing', 'shipping'].includes(o.status.toLowerCase())).length}</p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. COMMAND CONTROLS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-1 relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            placeholder="FILTER BY ORDER ID..."
            className="w-full pl-12 pr-4 py-4 bg-white border border-zinc-200 rounded-2xl focus:border-red-600/30 outline-none font-bold text-[10px] tracking-[0.2em] transition-all uppercase"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex gap-4 md:col-span-2">
          <div className="flex-1 relative">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <select 
              className="w-full pl-12 pr-10 py-4 bg-white border border-zinc-200 rounded-2xl outline-none font-bold text-[10px] tracking-[0.2em] appearance-none cursor-pointer hover:border-zinc-300"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">ALL STATUSES</option>
              <option value="pending">QUEUEING</option>
              <option value="printing">PRODUCTION</option>
              <option value="shipping">IN TRANSIT</option>
              <option value="delivered">ARRIVED</option>
            </select>
            <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-3 h-3 text-zinc-400 rotate-90 pointer-events-none" />
          </div>
          
          <div className="flex-1 relative">
            <select 
              className="w-full px-6 py-4 bg-zinc-900 text-white rounded-2xl outline-none font-bold text-[10px] tracking-[0.2em] appearance-none cursor-pointer"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="recent">CHRONOLOGICAL</option>
              <option value="price-high">MAX VALUE</option>
            </select>
            <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-3 h-3 text-zinc-400 rotate-90 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* 3. DEPLOYMENT LIST */}
      {filteredOrders.length > 0 ? (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const status = getStatusConfig(order.status);
            return (
              <div key={order.id} className="group bg-white rounded-3xl border border-zinc-200 overflow-hidden hover:shadow-xl hover:border-red-600/20 transition-all duration-300">
                <div className="p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
                  
                  <div className="flex items-center gap-6">
                    <div className="w-14 h-14 bg-zinc-50 rounded-xl flex items-center justify-center shrink-0 border border-zinc-100 group-hover:bg-zinc-900 group-hover:text-white transition-all">
                      <Package className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-lg font-bold tracking-tight uppercase">{order.order_number}</span>
                        <span className={`${status.bgColor} ${status.color} px-3 py-1 rounded-lg text-[8px] font-bold tracking-[0.2em] flex items-center gap-1.5 border border-current/10`}>
                          {status.icon} {status.label}
                        </span>
                      </div>
                      <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                        Timestamp: {new Date(order.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col md:items-end bg-zinc-50 md:bg-transparent p-4 md:p-0 rounded-2xl">
                    <p className="text-2xl font-bold tracking-tighter">₦{parseFloat(order.total_amount).toLocaleString()}</p>
                    <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Transaction Total</p>
                  </div>
                </div>

                <div className="px-6 md:px-8 pb-8 pt-0 flex flex-col md:flex-row md:items-center justify-between gap-6">
                  {/* Item Cluster */}
                  <div className="flex flex-wrap gap-2">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center gap-2 bg-zinc-50 p-1.5 pr-3 rounded-lg border border-zinc-100">
                        <div className="w-8 h-8 rounded-md bg-white border border-zinc-100 overflow-hidden">
                          <img 
                            src={item.product_details.image || '/placeholder.png'} 
                            className="w-full h-full object-cover" 
                            alt="" 
                          />
                        </div>
                        <span className="text-[9px] font-bold uppercase tracking-tight text-zinc-600">
                          {item.product_details.name} <span className="text-red-600 ml-1">×{item.quantity}</span>
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Context Actions */}
                  <div className="flex items-center gap-2">
                    <button className="flex-1 md:flex-none px-5 py-2.5 bg-zinc-100 text-zinc-900 hover:bg-zinc-900 hover:text-white rounded-xl font-bold text-[9px] tracking-widest transition-all flex items-center justify-center gap-2">
                      <Eye className="w-3.5 h-3.5" /> INSPECT
                    </button>
                    {order.status.toLowerCase() === 'delivered' && (
                      <button className="flex-1 md:flex-none px-5 py-2.5 bg-red-600 text-white rounded-xl font-bold text-[9px] tracking-widest hover:bg-red-700 transition-all flex items-center justify-center gap-2">
                        <RotateCcw className="w-3.5 h-3.5" /> RE-DEPLOY
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-[32px] py-24 text-center border border-zinc-200 border-dashed">
            <Zap className="w-12 h-12 text-zinc-100 mx-auto mb-4" />
            <h2 className="text-lg font-bold uppercase tracking-widest text-zinc-400">Zero Deployments</h2>
            <p className="text-[9px] font-bold text-zinc-300 uppercase tracking-widest mt-1">No data matches your current parameters.</p>
        </div>
      )}
    </div>
  );
}