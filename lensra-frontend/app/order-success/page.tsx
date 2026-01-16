"use client";

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { 
  CheckCircle, Package, Truck, ArrowRight, 
  ShoppingBag, Mail, Loader2
} from 'lucide-react';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';

const BaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000/";

// 1. Create a "Inner" component for the logic
function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { token } = useAuth();
  const orderId = searchParams.get('id');
  
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) {
      router.push('/');
      return;
    }

    const fetchOrder = async () => {
      try {
        const res = await fetch(`${BaseUrl}api/orders/orders/${orderId}/`, {
          headers: {
            ...(token && { 'Authorization': `Bearer ${token}` })
          }
        });
        if (res.ok) {
          const data = await res.json();
          setOrder(data);
        }
      } catch (err) {
        console.error("Order Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, token, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <Loader2 className="w-12 h-12 animate-spin text-red-600" />
        <p className="mt-4 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">Confirming Order...</p>
      </div>
    );
  }

  if (!order) return null;

  return (
    <div className="min-h-screen bg-white text-black font-sans pb-20">
      {/* HEADER - Updated Design */}
      <div className="bg-zinc-950 text-white pt-32 pb-24 px-6 rounded-b-[60px] shadow-2xl relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-red-600 rounded-full mb-4">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter leading-none">
            Order <span className="text-red-600">Confirmed</span>
          </h2>
          <p className="text-zinc-400 font-bold uppercase text-[10px] tracking-[0.3em]">
            Reference: #{order.order_number}
          </p>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/10 blur-[120px]" />
      </div>

      <main className="max-w-4xl mx-auto px-6 -mt-12 relative z-20">
        <div className="grid md:grid-cols-12 gap-8">
          
          {/* Left Column: Order Items */}
          <div className="md:col-span-7 space-y-4">
            <div className="bg-white border-2 border-zinc-100 rounded-[48px] p-8 md:p-10 shadow-xl">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-8 flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-red-600" /> Package Details
              </h3>
              
              <div className="space-y-8">
                {order.items?.map((item: any) => (
                  <div key={item.id} className="flex gap-6 items-center">
                    <div className="relative w-24 h-24 bg-zinc-50 rounded-[24px] overflow-hidden border border-zinc-100 flex-shrink-0">
                      {item.design_preview ? (
                        <Image 
                          src={item.design_preview} 
                          alt={item.product_name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-zinc-200">
                          <Package className="w-8 h-8" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-black italic uppercase text-sm leading-tight text-zinc-800">{item.product_name}</h4>
                      <p className="text-[10px] font-bold text-zinc-400 uppercase mt-2">
                        Quantity: {item.quantity} • ₦{parseFloat(item.unit_price).toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-black italic text-sm text-zinc-950">₦{parseFloat(item.subtotal).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-12 pt-8 border-t-2 border-dashed border-zinc-100">
                <div className="flex justify-between items-end">
                  <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Total Paid</span>
                  <span className="font-black text-2xl italic tracking-tighter">₦{parseFloat(order.total_amount).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Delivery Info */}
          <div className="md:col-span-5 space-y-6">
            <div className="bg-zinc-50 rounded-[48px] p-8 md:p-10 border border-zinc-100">
              <div className="space-y-10">
                <div>
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-5 flex items-center gap-2">
                    <Truck className="w-4 h-4 text-red-600" /> Destination
                  </h3>
                  <div className="space-y-2">
                    <p className="font-black italic uppercase text-xs text-zinc-800 leading-relaxed">{order.shipping_address}</p>
                    <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wide">
                      {order.shipping_city}, {order.shipping_state}
                    </p>
                    <p className="text-[10px] font-bold text-zinc-400 uppercase">{order.phone_number}</p>
                  </div>
                </div>

                <div className="pt-8 border-t border-zinc-200">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-4 flex items-center gap-2">
                    <Mail className="w-4 h-4 text-red-600" /> Receipt sent to
                  </h3>
                  <p className="font-black italic uppercase text-[11px] text-zinc-800 truncate">
                    {order.customer_email}
                  </p>
                </div>

                <button 
                  onClick={() => router.push('/')}
                  className="w-full py-6 bg-zinc-950 text-white rounded-[24px] font-black uppercase tracking-[0.2em] text-[10px] transition-all hover:bg-red-600 flex items-center justify-center gap-3 shadow-xl"
                >
                  Return to Store <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

// 2. Export the Default Page wrapped in Suspense
export default function OrderSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="w-10 h-10 animate-spin text-red-600" />
      </div>
    }>
      <OrderSuccessContent />
    </Suspense>
  );
}