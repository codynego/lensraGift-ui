"use client";

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, ShieldCheck, MapPin, Phone, User, 
  CreditCard, Mail, Loader2, Plus, CheckCircle2, X, Star, Truck
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const BaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.lensra.com/";

// --- TYPES ---
interface Location {
  id: number;
  city_name: string;
}

interface ShippingZone {
  id: number;
  name: string;
  base_fee: string;
  locations: Location[];
}

interface ShippingOption {
  id: number;
  name: string;
  additional_cost: string;
  estimated_delivery: string;
}

// --- CONFIG ---
const EMOTIONS = [
  { id: 'loved', label: 'Loved', emoji: '❤️' },
  { id: 'joyful', label: 'Joyful', emoji: '🎉' },
  { id: 'emotional', label: 'Emotional', emoji: '🥹' },
  { id: 'appreciated', label: 'Appreciated', emoji: '🙏' },
  { id: 'remembered', label: 'Remembered', emoji: '🕊' },
];

export default function CheckoutPage() {
  const { token, user } = useAuth();
  const router = useRouter();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [savedAddresses, setSavedAddresses] = useState<any[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [showManualForm, setShowManualForm] = useState(false);

  // --- SHIPPING STATE ---
  const [shippingZones, setShippingZones] = useState<ShippingZone[]>([]);
  const [shippingOptions, setShippingOptions] = useState<ShippingOption[]>([]);
  const [selectedLocationId, setSelectedLocationId] = useState<number | "">("");
  const [selectedOptionId, setSelectedOptionId] = useState<number | "">("");

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
      // 1. Fetch Shipping Data from API
      try {
        const [zonesRes, optionsRes] = await Promise.all([
          fetch(`${BaseUrl}api/orders/shipping/zones/`),
          fetch(`${BaseUrl}api/orders/shipping/options/`)
        ]);
        if (zonesRes.ok) setShippingZones(await zonesRes.json());
        if (optionsRes.ok) {
            const opts = await optionsRes.json();
            setShippingOptions(opts);
            if (opts.length > 0) setSelectedOptionId(opts[0].id);
        }
      } catch (err) {
        console.error("Shipping Fetch Error:", err);
      }

      // 2. Cart & Address Logic
      let sessionId = localStorage.getItem('guest_session_id');
      if (!token && !sessionId) {
        sessionId = crypto.randomUUID();
        localStorage.setItem('guest_session_id', sessionId!);
      }

      const cartUrl = token 
        ? `${BaseUrl}api/orders/cart/` 
        : `${BaseUrl}api/orders/cart/?session_id=${sessionId}`;

      const res = await fetch(cartUrl, {
        headers: { ...(token && { 'Authorization': `Bearer ${token}` }) }
      });

      if (res.ok) {
        const data = await res.json();
        setCartItems(Array.isArray(data) ? data : (data.results || []));
      }

      if (token) {
        const addrRes = await fetch(`${BaseUrl}api/users/addresses/`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const addrData = await addrRes.json();
        setSavedAddresses(addrData);
        if (addrData.length > 0) {
          handleSelectAddress(addrData.find((a: any) => a.is_default) || addrData[0]);
        } else {
          setShowManualForm(true);
        }
      } else {
        setShowManualForm(true);
      }
    };

    loadCheckoutData();
  }, [token, user]);

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

  // --- CALCULATION ---
  const subtotal = useMemo(() => {
    return cartItems.reduce((acc, item) => {
      const price = item.placement_details?.product_price || item.product_details?.base_price || item.price || 0;
      return acc + (parseFloat(price) * item.quantity);
    }, 0);
  }, [cartItems]);

  const shippingFees = useMemo(() => {
    const selectedZone = shippingZones.find(z => z.locations.some(l => l.id === selectedLocationId));
    const base = selectedZone ? parseFloat(selectedZone.base_fee) : 0;
    const selectedOpt = shippingOptions.find(o => o.id === selectedOptionId);
    const extra = selectedOpt ? parseFloat(selectedOpt.additional_cost) : 0;
    return { base, extra, total: base + extra };
  }, [selectedLocationId, selectedOptionId, shippingZones, shippingOptions]);

  const total = subtotal + shippingFees.total;

  const handleOrder = async () => {
    if (!selectedLocationId || !selectedOptionId || !formData.address) {
      alert("Please complete delivery details.");
      return;
    }

    setIsProcessing(true);
    const orderFormData = new FormData();
    orderFormData.append('shipping_location_id', selectedLocationId.toString());
    orderFormData.append('shipping_option_id', selectedOptionId.toString());
    orderFormData.append('shipping_address', formData.address);
    orderFormData.append('shipping_city', formData.city);
    orderFormData.append('shipping_state', formData.state);
    orderFormData.append('shipping_country', "Nigeria");
    orderFormData.append('phone_number', formData.phone);

    if (!token) {
      orderFormData.append('guest_email', formData.email);
      const sid = localStorage.getItem('guest_session_id');
      if (sid) orderFormData.append('session_id', sid);
    } else if (selectedAddressId) {
      orderFormData.append('address_id', selectedAddressId.toString());
    }

    try {
      const res = await fetch(`${BaseUrl}api/orders/orders/`, {
        method: 'POST',
        headers: { ...(token && { 'Authorization': `Bearer ${token}` }) },
        body: orderFormData
      });
      const data = await res.json();
      if (res.ok) {
        // Initialize payment
        const payBody = new FormData();
        payBody.append('order_id', data.id.toString());
        payBody.append('email', token ? (user?.email || '') : formData.email);
        const payRes = await fetch(`${BaseUrl}api/payments/initialize/`, {
          method: 'POST',
          headers: { ...(token && { 'Authorization': `Bearer ${token}` }) },
          body: payBody
        });
        const payData = await payRes.json();
        if (payRes.ok && payData.authorization_url) window.location.href = payData.authorization_url;
        else router.push(`/order-success?id=${data.id}`);
      } else {
        alert(data.error || "Failed to create order");
      }
    } catch (e) {
      alert("Connection error.");
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

      <main className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-12 gap-16">
          <div className="lg:col-span-7 space-y-12">
            <h1 className="text-6xl font-black italic uppercase tracking-tighter">Shipping</h1>

            {/* 1. LOCATION SELECTION */}
            <section className="space-y-4">
               <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-red-600 ml-2">
                 <MapPin className="w-3 h-3" /> 1. Select Delivery City
               </label>
               <select 
                value={selectedLocationId}
                onChange={(e) => {
                    const locId = Number(e.target.value);
                    setSelectedLocationId(locId);
                    const zone = shippingZones.find(z => z.locations.some(l => l.id === locId));
                    const loc = zone?.locations.find(l => l.id === locId);
                    if (loc && zone) setFormData({...formData, city: loc.city_name, state: zone.name});
                }}
                className="w-full bg-zinc-50 border-2 border-zinc-100 rounded-2xl px-6 py-4 outline-none focus:border-black transition text-sm font-bold uppercase appearance-none"
               >
                 <option value="">Choose City...</option>
                 {shippingZones.map(zone => (
                   <optgroup key={zone.id} label={zone.name.toUpperCase()}>
                     {zone.locations.map(loc => (
                       <option key={loc.id} value={loc.id}>{loc.city_name}</option>
                     ))}
                   </optgroup>
                 ))}
               </select>
            </section>

            {/* 2. ADDRESS */}
            {token && savedAddresses.length > 0 && !showManualForm ? (
                <div className="space-y-4">
                   <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-red-600 ml-2">
                    <User className="w-3 h-3" /> 2. Delivery Address
                  </label>
                  {savedAddresses.map(addr => (
                    <button key={addr.id} onClick={() => handleSelectAddress(addr)} className={`w-full flex items-center justify-between p-6 rounded-[24px] border-2 transition-all text-left ${selectedAddressId === addr.id ? "border-black bg-zinc-50" : "border-zinc-100"}`}>
                      <div>
                        <p className="font-black italic uppercase text-xs">{addr.full_name}</p>
                        <p className="text-[10px] font-bold text-zinc-400 uppercase">{addr.street_address}</p>
                      </div>
                      <CheckCircle2 className={`w-5 h-5 ${selectedAddressId === addr.id ? "text-red-600" : "text-zinc-200"}`} />
                    </button>
                  ))}
                  <button onClick={() => setShowManualForm(true)} className="w-full p-4 border-2 border-dashed border-zinc-200 rounded-2xl text-[10px] font-black uppercase tracking-widest">+ New Address</button>
                </div>
            ) : (
                <ManualAddressForm formData={formData} setFormData={setFormData} isGuest={!token} onCancel={token ? () => setShowManualForm(false) : null} />
            )}

            {/* 3. SPEED */}
            <section className="space-y-4">
               <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-red-600 ml-2">
                 <Truck className="w-3 h-3" /> 3. Speed & Timing
               </label>
               <div className="grid gap-3">
                 {shippingOptions.map(opt => (
                   <button key={opt.id} onClick={() => setSelectedOptionId(opt.id)} className={`flex items-center justify-between p-6 rounded-[24px] border-2 transition-all ${selectedOptionId === opt.id ? "border-black bg-zinc-50" : "border-zinc-100"}`}>
                     <div className="flex items-center gap-4">
                       <CheckCircle2 className={`w-5 h-5 ${selectedOptionId === opt.id ? "text-red-600" : "text-zinc-200"}`} />
                       <div>
                         <p className="font-black italic uppercase text-xs">{opt.name}</p>
                         <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">{opt.estimated_delivery}</p>
                       </div>
                     </div>
                     <p className="font-black text-xs">+ ₦{parseFloat(opt.additional_cost).toLocaleString()}</p>
                   </button>
                 ))}
               </div>
            </section>
          </div>

          {/* SUMMARY SIDEBAR */}
          <div className="lg:col-span-5">
            <div className="bg-zinc-950 text-white rounded-[48px] p-10 sticky top-12 border border-white/5 shadow-2xl">
              <h2 className="text-3xl font-black italic uppercase mb-8 text-red-600">Review</h2>
              <div className="space-y-4 mb-10 border-t border-white/10 pt-8">
                <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest text-zinc-500">
                  <span>Subtotal</span>
                  <span className="text-white font-black italic">₦{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest text-zinc-500">
                  <span>Shipping Fee</span>
                  <span className="text-white font-black italic">₦{shippingFees.base.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest text-zinc-500">
                  <span>Speed Surcharge</span>
                  <span className="text-white font-black italic">₦{shippingFees.extra.toLocaleString()}</span>
                </div>
                <div className="h-px bg-zinc-800 my-4" />
                <div className="flex justify-between items-end">
                  <span className="text-[11px] font-bold uppercase tracking-widest">Total</span>
                  <span className="text-4xl font-black italic tracking-tighter text-white">₦{total.toLocaleString()}</span>
                </div>
              </div>
              <button 
                onClick={handleOrder} 
                disabled={isProcessing || !selectedLocationId} 
                className="w-full py-6 bg-red-600 hover:bg-white hover:text-black text-white rounded-3xl font-black uppercase tracking-[0.3em] text-xs transition-all flex items-center justify-center gap-3 disabled:opacity-30"
              >
                {isProcessing ? <Loader2 className="animate-spin w-4 h-4" /> : "Complete & Pay"}
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-[10px] font-black uppercase tracking-widest text-red-600">Address Details</h3>
        {onCancel && <button onClick={onCancel} className="text-zinc-400 hover:text-black"><X className="w-4 h-4" /></button>}
      </div>
      <div className="space-y-4">
        <input type="text" placeholder="FULL NAME" value={formData.full_name} onChange={(e) => setFormData({...formData, full_name: e.target.value})} className="w-full bg-zinc-50 border-2 border-zinc-100 rounded-2xl px-6 py-4 outline-none focus:border-black font-bold uppercase text-sm" />
        {isGuest && <input type="email" placeholder="EMAIL ADDRESS" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full bg-zinc-50 border-2 border-zinc-100 rounded-2xl px-6 py-4 outline-none focus:border-black font-bold uppercase text-sm" />}
        <input type="tel" placeholder="PHONE NUMBER" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full bg-zinc-50 border-2 border-zinc-100 rounded-2xl px-6 py-4 outline-none focus:border-black font-bold uppercase text-sm" />
        <textarea placeholder="STREET ADDRESS" rows={2} value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} className="w-full bg-zinc-50 border-2 border-zinc-100 rounded-2xl px-6 py-4 outline-none focus:border-black font-bold uppercase text-sm" />
      </div>
    </div>
  );
}