"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2, Plus, Minus, ShoppingBag, Lock, ArrowLeft, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const BaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000/";

export default function CartPage() {
  const { token } = useAuth();
  const router = useRouter();
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCart = async () => {
    setLoading(true);
    
    if (!token) {
      const localData = localStorage.getItem('local_cart');
      if (localData) {
        setCartItems(JSON.parse(localData));
      }
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${BaseUrl}api/orders/cart/`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      const items = data.items || data.results || (Array.isArray(data) ? data : []);
      setCartItems(items);
    } catch (error) {
      console.error("Failed to fetch cart:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCart(); }, [token]);

  const updateQuantity = async (id: any, newQty: number) => {
    if (newQty < 1) return;
    
    // Update local state first for instant feedback
    const updatedItems = cartItems.map(item => {
      const itemId = token ? item.id : item.product_id;
      return itemId === id ? { ...item, quantity: newQty } : item;
    });
    setCartItems(updatedItems);

    if (token) {
      await fetch(`${BaseUrl}api/orders/cart/items/${id}/`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity: newQty })
      });
    } else {
      localStorage.setItem('local_cart', JSON.stringify(updatedItems));
    }
  };

  const removeItem = async (id: any) => {
    const updatedItems = cartItems.filter(item => {
      const itemId = token ? item.id : item.product_id;
      return itemId !== id;
    });
    setCartItems(updatedItems);

    if (token) {
      await fetch(`${BaseUrl}api/orders/cart/items/${id}/`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
    } else {
      localStorage.setItem('local_cart', JSON.stringify(updatedItems));
    }
  };

  // Helper to calculate totals based on data structure
  const subtotal = cartItems.reduce((acc, item) => {
    const price = item.placement_details?.product_price || item.price || 0;
    return acc + (parseFloat(price) * item.quantity);
  }, 0);

  const shipping = subtotal > 25000 || cartItems.length === 0 ? 0 : 2500;
  const total = subtotal + shipping;

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <Loader2 className="w-10 h-10 animate-spin text-red-600 mb-4" />
      <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Syncing your bag...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-white text-black font-sans">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <button onClick={() => router.push('/')} className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest mb-10 hover:text-red-600 transition">
          <ArrowLeft className="w-4 h-4" /> Continue Shopping
        </button>

        <div className="flex flex-col lg:flex-row gap-12">
          <div className="flex-1">
            <div className="border-b-4 border-black pb-4 mb-8 flex justify-between items-end">
              <h1 className="text-6xl font-black italic uppercase tracking-tighter">My Bag</h1>
              <span className="text-xl font-bold text-zinc-300">{cartItems.length}</span>
            </div>
            
            {cartItems.length === 0 ? (
              <div className="py-20 text-center border-2 border-dashed border-zinc-100 rounded-[40px]">
                <ShoppingBag className="w-12 h-12 mx-auto mb-4 text-zinc-200" />
                <p className="font-bold uppercase italic text-zinc-400">Your bag is currently empty</p>
              </div>
            ) : (
              <div className="divide-y divide-zinc-100">
                {cartItems.map((item) => {
                  // Fallback Logic for Guest vs Auth
                  const displayId = token ? item.id : item.product_id;
                  const displayName = item.placement_details?.product_name || item.name;
                  const displayPrice = parseFloat(item.placement_details?.product_price || item.price || 0);
                  
                  // IMAGE LOGIC: If guest, use item.image directly. If auth, use the dual-layer preview.
                  return (
                    <div key={displayId} className="py-8 flex flex-col md:flex-row gap-8 group">
                      <div className="relative w-44 h-44 bg-zinc-50 rounded-[30px] overflow-hidden flex-shrink-0">
                        {!token ? (
                          /* GUEST IMAGE VIEW */
                          <img 
                            src={item.image} 
                            className="w-full h-full object-cover" 
                            alt={displayName} 
                          />
                        ) : (
                          /* AUTHENTICATED DESIGN VIEW */
                          <div className="relative w-full h-full">
                            <img 
                              src={item.placement_details?.product_image} 
                              className="absolute inset-0 w-full h-full object-contain p-4" 
                              alt="Base" 
                            />
                            <div className="absolute bottom-3 right-3 w-16 h-16 bg-white rounded-xl shadow-2xl border border-zinc-100 p-1 overflow-hidden">
                              <img 
                                src={item.placement_details?.design_image} 
                                className="w-full h-full object-cover rounded-lg" 
                                alt="Design" 
                              />
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex-1 flex flex-col justify-between py-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-2xl font-black uppercase italic tracking-tighter leading-none mb-2">
                              {displayName}
                            </h3>
                            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                              {token ? `Design: ${item.placement_details?.design_name}` : 'Standard Edition'}
                            </p>
                          </div>
                          <button onClick={() => removeItem(displayId)} className="p-2 text-zinc-200 hover:text-red-600 transition-colors">
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>

                        <div className="flex justify-between items-end mt-6">
                          <div className="flex items-center bg-zinc-100 rounded-2xl p-1">
                            <button onClick={() => updateQuantity(displayId, item.quantity - 1)} className="p-2.5 hover:bg-white rounded-xl transition-all">
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="px-5 font-black text-lg">{item.quantity}</span>
                            <button onClick={() => updateQuantity(displayId, item.quantity + 1)} className="p-2.5 hover:bg-white rounded-xl transition-all">
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                          
                          <div className="text-right">
                            <p className="text-3xl font-black italic tracking-tighter leading-none">
                              ₦{(displayPrice * item.quantity).toLocaleString()}
                            </p>
                            <p className="text-[9px] text-zinc-400 font-bold uppercase mt-1 tracking-tighter">
                              ₦{displayPrice.toLocaleString()} each
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="lg:w-96">
            <div className="bg-zinc-50 rounded-[40px] p-10 sticky top-10 border border-zinc-100 shadow-sm">
              <h2 className="text-3xl font-black uppercase italic tracking-tighter mb-10 text-red-600">Summary</h2>
              
              <div className="space-y-5 mb-10">
                <div className="flex justify-between text-[11px] font-bold uppercase text-zinc-400 tracking-widest">
                  <span>Subtotal</span>
                  <span className="text-black italic font-black">₦{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-[11px] font-bold uppercase text-zinc-400 tracking-widest">
                  <span>Delivery</span>
                  <span className="text-black italic font-black">
                    {shipping === 0 ? 'FREE' : `₦${shipping.toLocaleString()}`}
                  </span>
                </div>
              </div>

              <div className="border-t-4 border-black pt-8 mb-10 flex justify-between items-end">
                <span className="text-[12px] font-black uppercase tracking-widest">Total</span>
                <span className="text-5xl font-black italic text-black tracking-tighter">
                  ₦{total.toLocaleString()}
                </span>
              </div>

              <button 
                disabled={cartItems.length === 0}
                onClick={() => router.push(token ? '/checkout' : '/login?next=/checkout')}
                className="w-full py-6 bg-black text-white rounded-[25px] font-black uppercase text-[11px] tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-red-600 transition-all shadow-2xl shadow-black/20 disabled:opacity-30"
              >
                <Lock className="w-4 h-4" /> Checkout Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}