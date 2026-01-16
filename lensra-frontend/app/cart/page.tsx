"use client";

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2, Plus, Minus, ShoppingBag, Lock, ArrowLeft, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const BaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000/";

// --- TYPESCRIPT INTERFACES ---
interface ProductDetails {
  id: number;
  name: string;
  base_price: string;
  image: string;
}

interface PlacementDetails {
  product_name: string;
  product_price: string;
  product_image: string;
  design_name: string;
  design_image: string;
}

interface CartItem {
  id?: number;           
  product_id?: number;   
  placement?: number;    
  quantity: number;
  price?: string;        
  image?: string;        
  name?: string;         
  placement_details?: PlacementDetails; 
  product_details?: ProductDetails; 
}

export default function CartPage() {
  const { token } = useAuth();
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCart = async () => {
    setLoading(true);
    let sessionId = localStorage.getItem('guest_session_id');
    if (!token) {
      if (!sessionId) {
        sessionId = crypto.randomUUID();
        localStorage.setItem('guest_session_id', sessionId);
      }
      try {
        const res = await fetch(`${BaseUrl}api/orders/cart/?session_id=${sessionId}`);
        if (res.ok) {
          const data = await res.json();
          setCartItems(data.items || data.results || (Array.isArray(data) ? data : []));
        } else {
          // Fallback to purely local data if API fails
          const localData = localStorage.getItem('cart');
          setCartItems(localData ? JSON.parse(localData) : []);
        }
      } catch (err) {
        console.error("Guest cart fetch failed:", err);
        const localData = localStorage.getItem('cart');
        setCartItems(localData ? JSON.parse(localData) : []);
      } finally {
        setLoading(false);
      }
      return;
    }

    // 2. Handling AUTHENTICATED users (Sync then Fetch)
    const localData = localStorage.getItem('cart');
    if (localData) {
      const guestItems: CartItem[] = JSON.parse(localData);
      if (guestItems.length > 0) {
        try {
          await Promise.all(guestItems.map((item: CartItem) => 
            fetch(`${BaseUrl}api/orders/cart/`, {
              method: 'POST',
              headers: { 
                'Authorization': `Bearer ${token}`, 
                'Content-Type': 'application/json' 
              },
              body: JSON.stringify({
                product: item.product_id,
                placement: item.placement || null,
                quantity: item.quantity
              })
            })
          ));
          localStorage.removeItem('cart');
        } catch (syncError) {
          console.error("Cart sync failed:", syncError);
        }
      }
    }

    try {
      const res = await fetch(`${BaseUrl}api/orders/cart/`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setCartItems(data.items || data.results || (Array.isArray(data) ? data : []));
    } catch (error) {
      console.error("Failed to fetch auth cart:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    fetchCart(); 
  }, [token]);

  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'cart_updated') {
        fetchCart();
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [token]);

  const updateQuantity = async (itemId: number | undefined, newQty: number) => {
    if (!itemId || newQty < 1) return;
    
    // Optimistic UI Update
    setCartItems(prev => prev.map(item => {
      const idToMatch = token ? item.id : (item.id || item.product_id);
      return idToMatch === itemId ? { ...item, quantity: newQty } : item;
    }));

    try {
      let sessionId = localStorage.getItem('guest_session_id');
      if (!token && !sessionId) {
        sessionId = crypto.randomUUID();
        localStorage.setItem('guest_session_id', sessionId);
      }
      const url = token 
        ? `${BaseUrl}api/orders/cart/${itemId}/` 
        : `${BaseUrl}api/orders/cart/${itemId}/?session_id=${sessionId}`;

      const res = await fetch(url, {
        method: 'PATCH',
        headers: { 
          ...(token && { 'Authorization': `Bearer ${token}` }),
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({ quantity: newQty })
      });

      if (res.ok) {
        window.dispatchEvent(new Event('cart-updated'));
        localStorage.setItem('cart_updated', Date.now().toString());
      }
    } catch (err) {
      console.error("Update failed:", err);
      // Revert optimistic update if failed
      fetchCart();
    }
  };

  const removeItem = async (itemId: number | undefined) => {
    if (!itemId) return;

    // Optimistic UI Update
    setCartItems(prev => prev.filter(item => {
      const idToMatch = token ? item.id : (item.id || item.product_id);
      return idToMatch !== itemId;
    }));

    try {
      let sessionId = localStorage.getItem('guest_session_id');
      if (!token && !sessionId) {
        sessionId = crypto.randomUUID();
        localStorage.setItem('guest_session_id', sessionId);
      }
      const url = token 
        ? `${BaseUrl}api/orders/cart/${itemId}/` 
        : `${BaseUrl}api/orders/cart/${itemId}/?session_id=${sessionId}`;

      const res = await fetch(url, {
        method: 'DELETE',
        headers: { 
          ...(token && { 'Authorization': `Bearer ${token}` })
        }
      });

      if (res.ok) {
        window.dispatchEvent(new Event('cart-updated'));
        localStorage.setItem('cart_updated', Date.now().toString());
      }
    } catch (err) {
      console.error("Delete failed:", err);
      // Revert optimistic update if failed
      fetchCart();
    }
  };

  const subtotal = useMemo(() => {
    return cartItems.reduce((acc: number, item: CartItem) => {
      const price = item.placement_details?.product_price || 
                    item.product_details?.base_price || 
                    item.price || "0";
      return acc + (parseFloat(price) * item.quantity);
    }, 0);
  }, [cartItems]);

  const shipping = subtotal > 50000 || cartItems.length === 0 ? 0 : 3500;
  const total = subtotal + shipping;

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <Loader2 className="w-10 h-10 animate-spin text-red-600 mb-4" />
      <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400">Loading your bag...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-white text-black font-sans">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <button onClick={() => router.push('/')} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest mb-10 hover:text-red-600 transition">
          <ArrowLeft className="w-4 h-4" /> Continue Shopping
        </button>

        <div className="flex flex-col lg:flex-row gap-12">
          <div className="flex-1">
            <div className="border-b-4 border-black pb-4 mb-8 flex justify-between items-end">
              <h1 className="text-6xl font-black italic uppercase tracking-tighter leading-none">My Bag</h1>
              <span className="text-xl font-bold text-zinc-300">{cartItems.length}</span>
            </div>
            
            {cartItems.length === 0 ? (
              <div className="py-20 text-center border-2 border-dashed border-zinc-100 rounded-[40px]">
                <ShoppingBag className="w-12 h-12 mx-auto mb-4 text-zinc-200" />
                <p className="font-bold uppercase italic text-zinc-400 tracking-widest text-xs">Your bag is currently empty</p>
              </div>
            ) : (
              <div className="divide-y divide-zinc-100">
                {cartItems.map((item: CartItem, index: number) => {
                  // Use backend ID if available, otherwise fallback to local product_id
                  const displayId = item.id || item.product_id;
                  
                  const displayName = item.placement_details?.product_name || 
                                    item.product_details?.name || 
                                    item.name;

                  const displayPrice = parseFloat(
                    item.placement_details?.product_price || 
                    item.product_details?.base_price || 
                    item.price || "0"
                  );

                  const displayImage = item.placement_details?.product_image || 
                                     item.product_details?.image || 
                                     item.image;
                  
                  return (
                    <div key={displayId || index} className="py-8 flex flex-col md:flex-row gap-8 group">
                      <div className="relative w-44 h-44 bg-zinc-50 rounded-[30px] overflow-hidden flex-shrink-0 border border-zinc-100">
                        {item.placement_details ? (
                          <div className="relative w-full h-full">
                            <img src={item.placement_details.product_image} className="absolute inset-0 w-full h-full object-contain p-4" alt="Base" />
                            <div className="absolute bottom-3 right-3 w-16 h-16 bg-white rounded-xl shadow-2xl border border-zinc-100 p-1 overflow-hidden">
                              <img src={item.placement_details.design_image} className="w-full h-full object-cover rounded-lg" alt="Design" />
                            </div>
                          </div>
                        ) : (
                          <img src={displayImage} className="w-full h-full object-cover p-4" alt={displayName} />
                        )}
                      </div>

                      <div className="flex-1 flex flex-col justify-between py-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-2xl font-black uppercase italic tracking-tighter leading-none mb-2">{displayName}</h3>
                            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                              {item.placement_details ? `Custom: ${item.placement_details.design_name}` : 'Standard Edition'}
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
                  <span className="text-black italic font-black">{shipping === 0 ? 'FREE' : `₦${shipping.toLocaleString()}`}</span>
                </div>
              </div>
              <div className="border-t-4 border-black pt-8 mb-10 flex justify-between items-end">
                <span className="text-[12px] font-black uppercase tracking-widest">Total</span>
                <span className="text-5xl font-black italic text-black tracking-tighter">₦{total.toLocaleString()}</span>
              </div>
              <button 
                disabled={cartItems.length === 0}
                onClick={() => router.push('/checkout')}
                className="w-full py-6 bg-black text-white rounded-[25px] font-black uppercase text-[11px] tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-red-600 transition-all disabled:opacity-30"
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