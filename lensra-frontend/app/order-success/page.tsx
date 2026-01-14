"use client";

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { 
  CheckCircle, Package, Truck, ArrowRight, 
  ShoppingBag, Mail, Loader2
} from 'lucide-react';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';

const BaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000/";

export default function OrderSuccessPage() {
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
  }, [orderId, token]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <Loader2 className="w-12 h-12 animate-spin text-red-600" />
        <p className="mt-4 text-[10px] font-black uppercase tracking-[0.3em]">Confirming Order...</p>
      </div>
    );
  }

  if (!order) return null;

  return (
    <div className="min-h-screen bg-white text-black font-sans pb-20">
      {/* Success Header */}
      <div className="bg-zinc-950 text-white pt-32 pb-20 px-6 rounded-b-[60px] shadow-2xl">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-red-600 rounded-full mb-4 animate-bounce">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter leading-none">
            Success!
          </h1>
          <p className="text-zinc-400 font-bold uppercase text-xs tracking-[0.2em]">
            Order #{order.order_number} is being processed
          </p>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-6 -mt-10">
        <div className="grid md:grid-cols-12 gap-8">
          
          {/* Left Column: Order Items */}
          <div className="md:col-span-7 space-y-4">
            <div className="bg-white border-2 border-zinc-100 rounded-[40px] p-8 shadow-sm">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-8 flex items-center gap-2">
                <ShoppingBag className="w-4 h-4" /> Your Items
              </h3>
              
              <div className="space-y-6">
                {order.items?.map((item: any) => (
                  <div key={item.id} className="flex gap-6 items-center">
                    <div className="relative w-24 h-24 bg-zinc-50 rounded-3xl overflow-hidden border border-zinc-100 flex-shrink-0">
                      {item.design_preview ? (
                        <Image 
                          src={item.design_preview} 
                          alt={item.product_name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-zinc-300">
                          <Package className="w-8 h-8" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-black italic uppercase text-sm leading-tight">{item.product_name}</h4>
                      <p className="text-[10px] font-bold text-zinc-400 uppercase mt-1">
                        Qty: {item.quantity} • ₦{parseFloat(item.unit_price).toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-black italic text-sm">₦{parseFloat(item.subtotal).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-10 pt-8 border-t-2 border-dashed border-zinc-100 space-y-3">
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                  <span className="text-zinc-400">Total Amount Paid</span>
                  <span className="font-black text-red-600 text-lg">₦{parseFloat(order.total_amount).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Delivery Info */}
          <div className="md:col-span-5 space-y-6">
            <div className="bg-zinc-50 rounded-[40px] p-8 space-y-8">
              <div>
                <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-4 flex items-center gap-2">
                  <Truck className="w-4 h-4" /> Shipping To
                </h3>
                <div className="space-y-1">
                  <p className="font-black italic uppercase text-xs">{order.shipping_address}</p>
                  <p className="text-[10px] font-bold text-zinc-500 uppercase">
                    {order.shipping_city}, {order.shipping_state}
                  </p>
                  <p className="text-[10px] font-bold text-zinc-500 uppercase">{order.phone_number}</p>
                </div>
              </div>

              <div>
                <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-4 flex items-center gap-2">
                  <Mail className="w-4 h-4" /> Updates Sent To
                </h3>
                <p className="font-black italic uppercase text-xs truncate">
                  {order.customer_email}
                </p>
              </div>

              <button 
                onClick={() => router.push('/')}
                className="w-full py-5 bg-black text-white rounded-3xl font-black uppercase tracking-widest text-[10px] transition-transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3"
              >
                Keep Shopping <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}