"use client";

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, ShieldCheck, MapPin, Phone, User, 
  CreditCard, Mail, Loader2, Globe, Plus, CheckCircle2, X 
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const BaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000/";

const NIGERIAN_STATES = [
  "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno", 
  "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "FCT - Abuja", "Gombe", 
  "Imo", "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos", 
  "Nasarawa", "Niger", "Ogun", "Ondo", "Osun", "Oyo", "Plateau", "Rivers", "Sokoto", 
  "Taraba", "Yobe", "Zamfara"
];

export default function CheckoutPage() {
  const { token, user } = useAuth();
  const router = useRouter();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [savedAddresses, setSavedAddresses] = useState<any[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [showManualForm, setShowManualForm] = useState(false);

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: ""
  });

  useEffect(() => {
    const loadCheckoutData = async () => {
      const sessionId = localStorage.getItem('guest_session_id');

      // 1. Fetch Cart Items from Backend
      try {
        // We fetch from the API using either the Token (Auth) or Session ID (Guest)
        const cartUrl = token 
          ? `${BaseUrl}api/orders/cart/` 
          : `${BaseUrl}api/orders/cart/?session_id=${sessionId}`;

        const res = await fetch(cartUrl, {
          headers: { 
            ...(token && { 'Authorization': `Bearer ${token}` }),
            'Content-Type': 'application/json'
          }
        });

        if (res.ok) {
          const data = await res.json();
          const items = Array.isArray(data) ? data : (data.results || []);
          setCartItems(items);
        } else {
          // Fallback to localStorage if API fails or session is empty
          const localData = localStorage.getItem(token ? 'user_cart' : 'guest_cart');
          if (localData) setCartItems(JSON.parse(localData));
        }
      } catch (err) {
        console.error("Cart Fetch Error:", err);
      }

      // 2. Fetch Addresses (Auth only)
      if (token) {
        try {
          const res = await fetch(`${BaseUrl}api/users/addresses/`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          const data = await res.json();
          setSavedAddresses(data);
          
          if (data.length > 0) {
            const def = data.find((a: any) => a.is_default) || data[0];
            handleSelectAddress(def);
          } else {
            setShowManualForm(true);
          }
        } catch (err) {
          console.error("Address Fetch Error:", err);
        }
      } else {
        setShowManualForm(true);
      }
    };

    loadCheckoutData();
  }, [token]);

  const handleSelectAddress = (addr: any) => {
    setSelectedAddressId(addr.id);
    setFormData({
      full_name: addr.full_name,
      email: user?.email || "", 
      phone: addr.phone_number,
      address: addr.street_address,
      city: addr.city,
      state: addr.state
    });
    setShowManualForm(false);
  };

  // --- SAFE PRICE CALCULATION ---
  const subtotal = useMemo(() => {
    return cartItems.reduce((acc, item) => {
      // Logic for price extraction:
      // 1. Check placement_details (custom) 
      // 2. Check product_details (plain)
      // 3. Check direct properties (local storage fallback)
      const price = item.placement_details?.product_price || 
                    item.product_details?.base_price || 
                    item.price || 0;
      return acc + (parseFloat(price) * item.quantity);
    }, 0);
  }, [cartItems]);

  const shipping = subtotal > 50000 || cartItems.length === 0 ? 0 : 3500;
  const total = subtotal + shipping;

  const handleOrder = async () => {
    if (!formData.address || !formData.phone || !formData.state) {
      alert("Missing delivery information.");
      return;
    }

    setIsProcessing(true);
    const orderEmail = token ? (user?.email || formData.email) : formData.email;
    const sessionId = localStorage.getItem('guest_session_id');

    const orderPayload: any = {
      shipping_address: formData.address,
      shipping_city: formData.city,
      shipping_state: formData.state,
      shipping_country: "Nigeria",
      phone_number: formData.phone,
    };

    if (!token) {
      orderPayload.guest_email = formData.email;
      orderPayload.session_id = sessionId; // Link the guest session to the order
    } else {
      orderPayload.address_id = selectedAddressId;
    }

    try {
      const orderRes = await fetch(`${BaseUrl}api/orders/orders/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify(orderPayload)
      });

      const orderData = await orderRes.json();

      if (orderRes.ok) {
        // Clear local storage carts
        localStorage.removeItem('guest_cart');
        localStorage.removeItem('user_cart');

        const payRes = await fetch(`${BaseUrl}api/payments/initialize/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
          },
          body: JSON.stringify({
            order_id: orderData.id,
            email: orderEmail
          })
        });

        const payData = await payRes.json();

        if (payRes.ok && payData.authorization_url) {
          window.location.href = payData.authorization_url;
        } else {
          router.push(`/order-success?id=${orderData.id}`);
        }
      } else {
        const errorMsg = orderData.error || orderData.guest_email || "Order creation failed.";
        alert(errorMsg);
      }
    } catch (err) { 
      console.error(err);
      alert("A connection error occurred.");
    } finally { 
      setIsProcessing(false); 
    }
  };

  return (
    <div className="min-h-screen bg-white text-black font-sans">
      <nav className="border-b border-zinc-100 py-6 px-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button onClick={() => router.back()} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest hover:text-red-600 transition">
            <ArrowLeft className="w-4 h-4" /> Back to Bag
          </button>
          <div className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-300 flex items-center gap-2">
            <ShieldCheck className="w-3 h-3" /> Secure Checkout
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-12 gap-16">
          <div className="lg:col-span-7 space-y-12">
            <div>
              <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter leading-none mb-4">Shipping</h1>
              <p className="text-zinc-400 font-bold uppercase text-[10px] tracking-widest">
                Checkout as {token ? 'Member' : 'Guest'}
              </p>
            </div>

            {token && savedAddresses.length > 0 && !showManualForm ? (
              <div className="space-y-6">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-2">Saved Addresses</h3>
                <div className="grid gap-3">
                  {savedAddresses.map((addr) => (
                    <button
                      key={addr.id}
                      onClick={() => handleSelectAddress(addr)}
                      className={`flex items-center justify-between p-6 rounded-[24px] border-2 transition-all text-left ${
                        selectedAddressId === addr.id ? "border-black bg-zinc-50" : "border-zinc-100"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <CheckCircle2 className={`w-5 h-5 ${selectedAddressId === addr.id ? "text-red-600" : "text-zinc-200"}`} />
                        <div>
                          <p className="font-black italic uppercase text-xs">{addr.full_name}</p>
                          <p className="text-[10px] font-bold text-zinc-400 uppercase">{addr.street_address}, {addr.city}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                  <button 
                    onClick={() => setShowManualForm(true)}
                    className="flex items-center justify-center gap-3 p-6 rounded-[24px] border-2 border-dashed border-zinc-200 hover:border-zinc-400 transition-all text-[10px] font-black uppercase tracking-widest"
                  >
                    <Plus className="w-4 h-4" /> New Delivery Address
                  </button>
                </div>
              </div>
            ) : (
              <ManualAddressForm 
                formData={formData} 
                setFormData={setFormData} 
                isGuest={!token} 
                onCancel={token ? () => setShowManualForm(false) : null}
              />
            )}
          </div>

          <div className="lg:col-span-5">
            <div className="bg-zinc-950 text-white rounded-[48px] p-10 sticky top-12 shadow-2xl border border-white/5">
              <h2 className="text-3xl font-black italic uppercase tracking-tighter mb-8 text-red-600">Review</h2>
              
              <div className="space-y-4 mb-8 max-h-60 overflow-y-auto pr-2 no-scrollbar">
                {cartItems.map((item, i) => {
                  const name = item.placement_details?.product_name || 
                               item.product_details?.name || 
                               item.product_name || 
                               item.name || "Custom Design";
                  const price = item.placement_details?.product_price || 
                                item.product_details?.base_price || 
                                item.price || 0;

                  return (
                    <div key={i} className="flex justify-between items-center gap-4">
                      <span className="text-[9px] font-bold uppercase text-zinc-400 truncate flex-1">
                        {item.quantity}x {name}
                      </span>
                      <span className="text-[9px] font-black italic whitespace-nowrap">
                        ₦{(parseFloat(price) * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="space-y-4 mb-10 border-t border-white/10 pt-8">
                <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest text-zinc-500">
                  <span>Subtotal</span>
                  <span className="text-white font-black italic">₦{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest text-zinc-500">
                  <span>Shipping</span>
                  <span className="text-white font-black italic">{shipping === 0 ? "FREE" : `₦${shipping.toLocaleString()}`}</span>
                </div>
                <div className="h-px bg-zinc-800 my-4" />
                <div className="flex justify-between items-end">
                  <span className="text-[11px] font-bold uppercase tracking-widest">Total</span>
                  <span className="text-4xl font-black italic tracking-tighter text-white">₦{total.toLocaleString()}</span>
                </div>
              </div>

              <button 
                onClick={handleOrder}
                disabled={isProcessing || cartItems.length === 0}
                className="w-full py-6 bg-red-600 hover:bg-white hover:text-black text-white rounded-3xl font-black uppercase tracking-[0.3em] text-xs transition-all flex items-center justify-center gap-3 disabled:opacity-30"
              >
                {isProcessing ? <Loader2 className="animate-spin w-4 h-4" /> : <><CreditCard className="w-4 h-4" /> Complete & Pay</>}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function ManualAddressForm({ formData, setFormData, isGuest, onCancel }: any) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <h3 className="text-[10px] font-black uppercase tracking-widest text-red-600 ml-2">
          {isGuest ? 'Contact Information' : 'New Address'}
        </h3>
        {onCancel && <button onClick={onCancel} className="text-zinc-400 hover:text-black"><X className="w-4 h-4" /></button>}
      </div>
      
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-2"><User className="w-3 h-3" /> Full Name</label>
        <input type="text" value={formData.full_name} onChange={(e) => setFormData({...formData, full_name: e.target.value})} className="w-full bg-zinc-50 border-2 border-zinc-100 rounded-2xl px-6 py-4 outline-none focus:border-black transition text-sm font-bold uppercase" />
      </div>

      <div className="space-y-2">
        <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-2"><Mail className="w-3 h-3" /> Email Address</label>
        <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full bg-zinc-50 border-2 border-zinc-100 rounded-2xl px-6 py-4 outline-none focus:border-red-600 transition text-sm font-bold uppercase" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-2"><Phone className="w-3 h-3" /> Phone Number</label>
          <input type="tel" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full bg-zinc-50 border-2 border-zinc-100 rounded-2xl px-6 py-4 outline-none focus:border-black transition text-sm font-bold uppercase" />
        </div>
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-2"><MapPin className="w-3 h-3" /> City</label>
          <input type="text" value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})} className="w-full bg-zinc-50 border-2 border-zinc-100 rounded-2xl px-6 py-4 outline-none focus:border-black transition text-sm font-bold uppercase" />
        </div>
      </div>

      <div className="space-y-2">
        <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-2"><Globe className="w-3 h-3" /> State</label>
        <select value={formData.state} onChange={(e) => setFormData({...formData, state: e.target.value})} className="w-full bg-zinc-50 border-2 border-zinc-100 rounded-2xl px-6 py-4 outline-none focus:border-black transition text-sm font-bold uppercase appearance-none">
          <option value="">Select State</option>
          {NIGERIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div className="space-y-2">
        <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-2"><MapPin className="w-3 h-3" /> Street Address</label>
        <textarea rows={2} value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} className="w-full bg-zinc-50 border-2 border-zinc-100 rounded-3xl px-6 py-4 outline-none focus:border-black transition text-sm font-bold uppercase" />
      </div>
    </div>
  );
}