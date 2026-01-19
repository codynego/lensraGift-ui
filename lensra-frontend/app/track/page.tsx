"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Loader2, Package, AlertCircle, CheckCircle2, Truck, Timer } from 'lucide-react';

const BaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.lensra.com/";

export default function OrderTracking() {
  const [orderNumber, setOrderNumber] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [orderData, setOrderData] = useState<any>(null);
  const [error, setError] = useState("");

  const handleTrackOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setOrderData(null);

    try {
      const res = await fetch(`${BaseUrl}api/orders/track-order/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order_number: orderNumber, email: email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Order not found.");
      }

      setOrderData(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Maps backend status to UI icons/labels
  const getStatusInfo = (status: string) => {
    const s = status?.toLowerCase();
    if (s === 'pending') return { icon: Timer, color: 'text-amber-500', step: 1 };
    if (s === 'processing') return { icon: Package, color: 'text-blue-500', step: 2 };
    if (s === 'shipped') return { icon: Truck, color: 'text-red-600', step: 3 };
    if (s === 'delivered') return { icon: CheckCircle2, color: 'text-green-500', step: 4 };
    return { icon: Package, color: 'text-zinc-500', step: 1 };
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-red-600/30">
      <main className="max-w-4xl mx-auto px-6 py-24">
        
        {/* Header */}
        <div className="mb-16 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-red-600">Secure Protocol v2.0</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter leading-[0.8]">
            Track <br/> <span className="text-zinc-700">Order.</span>
          </h1>
        </div>

        {/* Search Form */}
        <form onSubmit={handleTrackOrder} className="space-y-4 mb-20">
          <div className="grid md:grid-cols-2 gap-4">
            <input 
              type="text" 
              placeholder="ORDER NUMBER (E.G. LEN-1234)"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value.toUpperCase())}
              className="bg-zinc-900/50 border-2 border-zinc-800 rounded-2xl px-6 py-5 text-xs font-black uppercase tracking-widest outline-none focus:border-red-600 transition-all"
              required
            />
            <input 
              type="email" 
              placeholder="ASSOCIATED EMAIL"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-zinc-900/50 border-2 border-zinc-800 rounded-2xl px-6 py-5 text-xs font-black uppercase tracking-widest outline-none focus:border-red-600 transition-all"
              required
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-white text-black py-6 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-red-600 hover:text-white transition-all flex items-center justify-center gap-3"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
            {loading ? "Decrypting Data..." : "Locate Shipment"}
          </button>
        </form>

        <AnimatePresence mode="wait">
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }}
              className="p-6 bg-red-600/10 border border-red-600/20 rounded-2xl flex items-center gap-4 text-red-500"
            >
              <AlertCircle className="w-5 h-5" />
              <p className="text-[10px] font-black uppercase tracking-widest">{error}</p>
            </motion.div>
          )}

          {orderData && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-8"
            >
              {/* Result Card */}
              <div className="p-10 bg-zinc-900 border border-zinc-800 rounded-[40px] relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8">
                    {(() => {
                        const StatusIcon = getStatusInfo(orderData.status).icon;
                        return <StatusIcon className={`w-12 h-12 ${getStatusInfo(orderData.status).color} opacity-20`} />;
                    })()}
                </div>

                <div className="grid md:grid-cols-2 gap-12">
                  <div className="space-y-6">
                    <div>
                      <p className="text-[9px] font-black uppercase tracking-widest text-zinc-500 mb-2">Order Reference</p>
                      <h2 className="text-3xl font-black italic uppercase">{orderData.order_number}</h2>
                    </div>
                    <div>
                      <p className="text-[9px] font-black uppercase tracking-widest text-zinc-500 mb-2">Status</p>
                      <span className={`px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${getStatusInfo(orderData.status).color} border-current`}>
                        {orderData.status}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <p className="text-[9px] font-black uppercase tracking-widest text-zinc-500 mb-2">Destination</p>
                      <p className="text-sm font-bold uppercase tracking-tight leading-relaxed">
                        {orderData.shipping_city}, {orderData.shipping_country}
                      </p>
                    </div>
                    <div>
                      <p className="text-[9px] font-black uppercase tracking-widest text-zinc-500 mb-2">Amount Paid</p>
                      <p className="text-xl font-black italic">₦{parseFloat(orderData.total_amount).toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-4">
                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500 px-4">Manifest (Items)</h3>
                {orderData.items?.map((item: any, idx: number) => (
                  <div key={idx} className="bg-zinc-900/40 border border-zinc-800 p-6 rounded-3xl flex items-center justify-between group hover:border-zinc-600 transition-colors">
                    <div className="flex items-center gap-6">
                      <div className="w-12 h-12 bg-zinc-800 rounded-xl flex items-center justify-center font-black italic text-zinc-500">
                        {idx + 1}
                      </div>
                      <div>
                        <p className="text-xs font-black uppercase italic tracking-wider">Product ID: {item.product}</p>
                        <p className="text-[9px] font-bold text-zinc-500 uppercase mt-1">Quantity: {item.quantity}</p>
                      </div>
                    </div>
                    <div className="text-right">
                        <p className="text-xs font-black uppercase italic tracking-widest">₦{parseFloat(item.price).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}