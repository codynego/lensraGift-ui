"use client";

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, ShieldCheck, MapPin, Phone, User, 
  CreditCard, Mail, Loader2, Globe, Plus, CheckCircle2, X, Star 
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const BaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.lensra.com/";

// --- CONFIG ---
const EMOTIONS = [
  { id: 'loved', label: 'Loved', emoji: '❤️' },
  { id: 'joyful', label: 'Joyful', emoji: '🎉' },
  { id: 'emotional', label: 'Emotional', emoji: '🥹' },
  { id: 'appreciated', label: 'Appreciated', emoji: '🙏' },
  { id: 'remembered', label: 'Remembered', emoji: '🕊' },
];

const NIGERIAN_STATES = [
  "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno", 
  "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "FCT - Abuja", "Gombe", 
  "Imo", "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos", 
  "Nasarawa", "Niger", "Ogun", "Ondo", "Osun", "Oyo", "Plateau", "Rivers", "Sokoto", 
  "Taraba", "Yobe", "Zamfara"
].sort();

interface ShippingLocation {
  id: number;
  city_name: string;
}

interface ShippingZone {
  id: number;
  name: string;
  base_fee: number;
  locations: ShippingLocation[];
}

interface ShippingOption {
  id: number;
  name: string;
  additional_cost: number;
  estimated_delivery: string;
}

interface ExtendedShippingLocation extends ShippingLocation {
  zone_name: string;
  base_fee: number;
}

interface Address {
  id: number;
  full_name: string;
  phone_number: string;
  street_address: string;
  city: string;
  state: string;
  is_default?: boolean;
}

interface CartItem {
  quantity: number;
  placement_details?: {
    product_name: string;
    product_price: number;
  };
  product_details?: {
    name: string;
    base_price: number;
  };
  product_name?: string;
  name?: string;
  price?: number;
  secret_message?: string;
  emotion?: string;
}

export default function CheckoutPage() {
  const { token, user } = useAuth();
  const router = useRouter();
  
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [savedAddresses, setSavedAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [showManualForm, setShowManualForm] = useState(false);
  const [zones, setZones] = useState<ShippingZone[]>([]);
  const [locations, setLocations] = useState<ExtendedShippingLocation[]>([]);
  const [options, setOptions] = useState<ShippingOption[]>([]);
  const [selectedLocationId, setSelectedLocationId] = useState<number | null>(null);
  const [selectedOptionId, setSelectedOptionId] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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
      setIsLoading(true);
      setErrorMessage(null);
      let sessionId = localStorage.getItem('guest_session_id');
      if (!token) {
        if (!sessionId) {
          sessionId = crypto.randomUUID();
          localStorage.setItem('guest_session_id', sessionId);
        }
      }

      // 1. Sync Guest Cart if Authenticated
      if (token) {
        const localGuestCart = localStorage.getItem('guest_cart');
        if (localGuestCart) {
          const guestItems = JSON.parse(localGuestCart);
          if (guestItems.length > 0) {
            try {
              await Promise.all(guestItems.map(async (item: any) => {
                const formData = new FormData();
                formData.append('product', item.product_id || item.product);
                if (item.placement) {
                  formData.append('placement', item.placement);
                }
                formData.append('quantity', item.quantity.toString());

                await fetch(`${BaseUrl}api/orders/cart/`, {
                  method: 'POST',
                  headers: { 
                    'Authorization': `Bearer ${token}`
                  },
                  body: formData
                });
              }));
              localStorage.removeItem('guest_cart');
              localStorage.removeItem('guest_session_id');
            } catch (syncError) {
              console.error("Cart sync failed:", syncError);
              setErrorMessage("Failed to sync cart. Please try again.");
            }
          }
        }
      }

      // 2. Fetch Cart Items from Backend
      try {
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
          // Fallback to localStorage if API fails
          const localKey = token ? 'user_cart' : 'guest_cart';
          const localData = localStorage.getItem(localKey);
          if (localData) setCartItems(JSON.parse(localData));
          else setErrorMessage("Failed to load cart. Please check your connection.");
        }
      } catch (err) {
        console.error("Cart Fetch Error:", err);
        const localKey = token ? 'user_cart' : 'guest_cart';
        const localData = localStorage.getItem(localKey);
        if (localData) setCartItems(JSON.parse(localData));
        else setErrorMessage("Failed to load cart. Please check your connection.");
      }

      // 3. Fetch Addresses (Auth only)
      if (token) {
        try {
          const res = await fetch(`${BaseUrl}api/users/addresses/`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (res.ok) {
            const data = await res.json();
            const addresses = Array.isArray(data) ? data : (data.results || []);
            setSavedAddresses(addresses);
            
            if (addresses.length > 0) {
              const def = addresses.find((a: Address) => a.is_default) || addresses[0];
              handleSelectAddress(def);
            } else {
              setShowManualForm(true);
            }
          } else {
            setErrorMessage("Failed to load addresses.");
          }
        } catch (err) {
          console.error("Address Fetch Error:", err);
          setErrorMessage("Failed to load addresses.");
        }
      } else {
        setShowManualForm(true);
      }

      // 4. Fetch Shipping Zones and Options
      try {
        const zonesRes = await fetch(`${BaseUrl}api/orders/shipping/zones/`, {
          headers: { ...(token && { 'Authorization': `Bearer ${token}` }) }
        });
        if (zonesRes.ok) {
          const zonesData = await zonesRes.json();
          const zonesList = Array.isArray(zonesData) ? zonesData : (zonesData.results || []);
          setZones(zonesList);
        } else {
          setErrorMessage("Failed to load shipping zones.");
        }
      } catch (err) {
        console.error("Shipping Zones Fetch Error:", err);
        setErrorMessage("Failed to load shipping zones.");
      }

      try {
        const optionsRes = await fetch(`${BaseUrl}api/orders/shipping/options/`, {
          headers: { ...(token && { 'Authorization': `Bearer ${token}` }) }
        });
        if (optionsRes.ok) {
          const optionsData = await optionsRes.json();
          const optionsList = Array.isArray(optionsData) ? optionsData : (optionsData.results || []);
          setOptions(optionsList);
          if (optionsList.length > 0) {
            setSelectedOptionId(optionsList[0].id);
          }
        } else {
          setErrorMessage("Failed to load shipping options.");
        }
      } catch (err) {
        console.error("Shipping Options Fetch Error:", err);
        setErrorMessage("Failed to load shipping options.");
      }

      setIsLoading(false);
    };

    loadCheckoutData();
  }, [token, user]);

  useEffect(() => {
    const extendedLocations = zones.flatMap((z: ShippingZone) =>
      Array.isArray(z.locations)
        ? z.locations.map((l: ShippingLocation) => ({ ...l, zone_name: z.name, base_fee: z.base_fee }))
        : []
    ).sort((a, b) => a.city_name.localeCompare(b.city_name));
    setLocations(extendedLocations);
  }, [zones]);

  useEffect(() => {
    if (formData.city && locations.length > 0) {
      const matchedLoc = locations.find((l: ExtendedShippingLocation) => l.city_name.toLowerCase() === formData.city.toLowerCase());
      if (matchedLoc) {
        setSelectedLocationId(matchedLoc.id);
      } else {
        setSelectedLocationId(null);
      }
    }
  }, [formData.city, locations]);

  const handleSelectAddress = (addr: Address) => {
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
      const price = item.placement_details?.product_price || 
                    item.product_details?.base_price || 
                    item.price || 0;
      return acc + (parseFloat(price.toString()) * item.quantity);
    }, 0);
  }, [cartItems]);

  const shipping = useMemo(() => {
    if (!selectedLocationId || !selectedOptionId) return 0;
    const selectedLoc = locations.find((l: ExtendedShippingLocation) => l.id === selectedLocationId);
    const baseFee = selectedLoc?.base_fee || 0;
    const selectedOpt = options.find((o: ShippingOption) => o.id === selectedOptionId);
    const additionalCost = selectedOpt?.additional_cost || 0;
    return baseFee + additionalCost;
  }, [selectedLocationId, selectedOptionId, locations, options]);

  const total = parseFloat(subtotal.toString()) + shipping;

  const validateForm = () => {
    if (!formData.full_name || !formData.address || !formData.city || !formData.state || !formData.phone) {
      setErrorMessage("Please fill in all required delivery information.");
      return false;
    }
    if (isGuest && !formData.email) {
      setErrorMessage("Please provide an email address.");
      return false;
    }
    if (!selectedLocationId) {
      setErrorMessage("Please select a valid delivery location.");
      return false;
    }
    if (!selectedOptionId) {
      setErrorMessage("Please select a shipping method.");
      return false;
    }
    return true;
  };

  const handleOrder = async () => {
    setErrorMessage(null);
    if (!validateForm()) return;

    setIsProcessing(true);
    const orderEmail = token ? (user?.email || formData.email) : formData.email;
    let sessionId = localStorage.getItem('guest_session_id');
    if (!token && !sessionId) {
      sessionId = crypto.randomUUID();
      localStorage.setItem('guest_session_id', sessionId);
    }

    const orderFormData = new FormData();
    orderFormData.append('shipping_address', formData.address);
    orderFormData.append('shipping_city', formData.city);
    orderFormData.append('shipping_state', formData.state);
    orderFormData.append('shipping_country', "Nigeria");
    orderFormData.append('phone_number', formData.phone);
    if (selectedLocationId !== null) {
      orderFormData.append('shipping_location_id', selectedLocationId.toString());
    }
    if (selectedOptionId !== null) {
      orderFormData.append('shipping_option_id', selectedOptionId.toString());
    }

    if (!token) {
      orderFormData.append('guest_email', formData.email);
      if (sessionId) {
        orderFormData.append('session_id', sessionId);
      }
    } else if (selectedAddressId) {
      orderFormData.append('address_id', selectedAddressId.toString());
    }

    try {
      const orderRes = await fetch(`${BaseUrl}api/orders/orders/`, {
        method: 'POST',
        headers: {
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: orderFormData
      });

      const orderData = await orderRes.json();

      if (orderRes.ok) {
        // Clear local storage carts
        localStorage.removeItem('guest_cart');
        localStorage.removeItem('user_cart');
        if (!token) localStorage.removeItem('guest_session_id');

        const payFormData = new FormData();
        payFormData.append('order_id', orderData.id.toString());
        payFormData.append('email', orderEmail);
        if (!token && sessionId) {
          payFormData.append('session_id', sessionId);
        }

        const payRes = await fetch(`${BaseUrl}api/payments/initialize/`, {
          method: 'POST',
          headers: {
            ...(token && { 'Authorization': `Bearer ${token}` })
          },
          body: payFormData
        });

        const payData = await payRes.json();

        if (payRes.ok && payData.authorization_url) {
          window.location.href = payData.authorization_url;
        } else {
          router.push(`/order-success?id=${orderData.id}`);
        }
      } else {
        const errorMsg = orderData.error || orderData.guest_email || "Order creation failed. Please try again.";
        setErrorMessage(errorMsg);
      }
    } catch (err) { 
      console.error(err);
      setErrorMessage("A connection error occurred. Please check your internet.");
    } finally { 
      setIsProcessing(false); 
    }
  };

  const isGuest = !token;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-red-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black font-sans">
      <nav className="border-b border-zinc-100 py-4 px-4 md:py-6 md:px-6 sticky top-0 bg-white z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button onClick={() => router.back()} className="flex items-center gap-2 text-xs font-black uppercase tracking-widest hover:text-red-600 transition">
            <ArrowLeft className="w-4 h-4" /> Back to Bag
          </button>
          <div className="text-xs font-black uppercase tracking-[0.3em] text-zinc-300 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4" /> Secure Checkout
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8 md:px-6 md:py-16">
        {errorMessage && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-600 text-sm font-medium">
            {errorMessage}
          </div>
        )}
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-16">
          <div className="lg:col-span-7 space-y-12">
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black italic uppercase tracking-tighter leading-none mb-4">Shipping</h1>
              <p className="text-zinc-400 font-bold uppercase text-xs tracking-widest">
                Checkout as {token ? 'Member' : 'Guest'}
              </p>
            </div>

            {token && savedAddresses.length > 0 && !showManualForm ? (
              <AddressSelector
                addresses={savedAddresses}
                selectedId={selectedAddressId}
                onSelect={handleSelectAddress}
                onAddNew={() => setShowManualForm(true)}
              />
            ) : (
              <ManualAddressForm 
                formData={formData} 
                setFormData={setFormData} 
                isGuest={isGuest} 
                onCancel={token ? () => setShowManualForm(false) : null}
                locations={locations}
              />
            )}

            <ShippingLocationSelector
              zones={zones}
              selectedId={selectedLocationId}
              onSelect={setSelectedLocationId}
            />

            <ShippingOptionSelector
              options={options}
              selectedId={selectedOptionId}
              onSelect={setSelectedOptionId}
            />
          </div>

          <div className="lg:col-span-5">
            <div className="bg-zinc-950 text-white rounded-[32px] md:rounded-[48px] p-6 md:p-10 sticky top-20 lg:top-24 shadow-xl border border-white/5">
              <h2 className="text-2xl md:text-3xl font-black italic uppercase tracking-tighter mb-8 text-red-600">Review</h2>
              
              <div className="space-y-4 mb-8 max-h-[40vh] overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-zinc-800">
                {cartItems.length === 0 ? (
                  <p className="text-zinc-400 text-sm italic">Your cart is empty.</p>
                ) : (
                  cartItems.map((item, i) => {
                    const name = item.placement_details?.product_name || 
                                 item.product_details?.name || 
                                 item.product_name || 
                                 item.name || "Custom Design";
                    const price = item.placement_details?.product_price || 
                                  item.product_details?.base_price || 
                                  item.price || 0;

                    return (
                      <div key={i} className="space-y-2">
                        <div className="flex justify-between items-center gap-4">
                          <span className="text-xs font-bold uppercase text-zinc-400 truncate flex-1">
                            {item.quantity}x {name}
                          </span>
                          <span className="text-xs font-black italic whitespace-nowrap">
                            ₦{(parseFloat(price.toString()) * item.quantity).toLocaleString()}
                          </span>
                        </div>
                        {item.secret_message && (
                          <div className="flex items-center gap-2 bg-zinc-800 px-4 py-2 rounded-full">
                            <Star className="w-3 h-3 text-red-600 fill-red-600" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Surprise Reveal</span>
                            {item.emotion && <span>{EMOTIONS.find(e => e.id === item.emotion)?.emoji}</span>}
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>

              <div className="space-y-4 mb-10 border-t border-white/10 pt-8">
                <div className="flex justify-between text-sm font-bold uppercase tracking-widest text-zinc-500">
                  <span>Subtotal</span>
                  <span className="text-white font-black italic">₦{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm font-bold uppercase tracking-widest text-zinc-500">
                  <span>Shipping</span>
                  <span className="text-white font-black italic">{shipping === 0 ? "TBD" : `₦${shipping.toLocaleString()}`}</span>
                </div>
                <div className="h-px bg-zinc-800 my-4" />
                <div className="flex justify-between items-end">
                  <span className="text-sm font-bold uppercase tracking-widest">Total</span>
                  <span className="text-3xl md:text-4xl font-black italic tracking-tighter text-white">₦{total.toLocaleString()}</span>
                </div>
              </div>

              <button 
                onClick={handleOrder}
                disabled={isProcessing || cartItems.length === 0 || !selectedLocationId || !selectedOptionId}
                className="w-full py-4 md:py-6 bg-red-600 hover:bg-red-700 text-white rounded-3xl font-black uppercase tracking-[0.3em] text-xs md:text-sm transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? <Loader2 className="animate-spin w-4 h-4 md:w-5 md:h-5" /> : <><CreditCard className="w-4 h-4 md:w-5 md:h-5" /> Complete & Pay</>}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function AddressSelector({ 
  addresses, 
  selectedId, 
  onSelect, 
  onAddNew 
}: { 
  addresses: Address[]; 
  selectedId: number | null; 
  onSelect: (addr: Address) => void; 
  onAddNew: () => void; 
}) {
  return (
    <div className="space-y-6">
      <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400 ml-2">Saved Addresses</h3>
      <div className="grid gap-3">
        {addresses.map((addr) => (
          <button
            key={addr.id}
            onClick={() => onSelect(addr)}
            className={`flex items-center justify-between p-4 md:p-6 rounded-3xl border-2 transition-all text-left ${
              selectedId === addr.id ? "border-black bg-zinc-50" : "border-zinc-100 hover:border-zinc-300"
            }`}
          >
            <div className="flex items-center gap-4">
              <CheckCircle2 className={`w-5 h-5 ${selectedId === addr.id ? "text-red-600" : "text-zinc-200"}`} />
              <div>
                <p className="font-black italic uppercase text-sm">{addr.full_name}</p>
                <p className="text-xs font-bold text-zinc-400 uppercase">{addr.street_address}, {addr.city}, {addr.state}</p>
              </div>
            </div>
          </button>
        ))}
        <button 
          onClick={onAddNew}
          className="flex items-center justify-center gap-3 p-4 md:p-6 rounded-3xl border-2 border-dashed border-zinc-200 hover:border-zinc-400 transition-all text-xs font-black uppercase tracking-widest"
        >
          <Plus className="w-4 h-4" /> New Delivery Address
        </button>
      </div>
    </div>
  );
}

function ManualAddressForm({ 
  formData, 
  setFormData, 
  isGuest, 
  onCancel,
  locations 
}: { 
  formData: any; 
  setFormData: any; 
  isGuest: boolean; 
  onCancel: (() => void) | null;
  locations: ExtendedShippingLocation[];
}) {
  const cities = useMemo(() => [...new Set(locations.map(l => l.city_name))].sort(), [locations]);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <h3 className="text-xs font-black uppercase tracking-widest text-red-600 ml-2">
          {isGuest ? 'Contact Information' : 'New Address'}
        </h3>
        {onCancel && <button onClick={onCancel} className="text-zinc-400 hover:text-black"><X className="w-5 h-5" /></button>}
      </div>
      
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-zinc-500 ml-2"><User className="w-4 h-4" /> Full Name</label>
        <input 
          type="text" 
          value={formData.full_name} 
          onChange={(e) => setFormData({...formData, full_name: e.target.value})} 
          className="w-full bg-zinc-50 border-2 border-zinc-100 rounded-2xl px-4 py-3 md:px-6 md:py-4 outline-none focus:border-black transition text-sm font-bold uppercase" 
          placeholder="Enter your full name"
        />
      </div>

      {isGuest && (
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-zinc-500 ml-2"><Mail className="w-4 h-4" /> Email Address</label>
          <input 
            type="email" 
            value={formData.email} 
            onChange={(e) => setFormData({...formData, email: e.target.value})} 
            className="w-full bg-zinc-50 border-2 border-zinc-100 rounded-2xl px-4 py-3 md:px-6 md:py-4 outline-none focus:border-black transition text-sm font-bold uppercase" 
            placeholder="Enter your email"
          />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-zinc-500 ml-2"><Phone className="w-4 h-4" /> Phone Number</label>
          <input 
            type="tel" 
            value={formData.phone} 
            onChange={(e) => setFormData({...formData, phone: e.target.value})} 
            className="w-full bg-zinc-50 border-2 border-zinc-100 rounded-2xl px-4 py-3 md:px-6 md:py-4 outline-none focus:border-black transition text-sm font-bold uppercase" 
            placeholder="Enter your phone number"
          />
        </div>
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-zinc-500 ml-2"><MapPin className="w-4 h-4" /> City</label>
          <select 
            value={formData.city} 
            onChange={(e) => setFormData({...formData, city: e.target.value})} 
            className="w-full bg-zinc-50 border-2 border-zinc-100 rounded-2xl px-4 py-3 md:px-6 md:py-4 outline-none focus:border-black transition text-sm font-bold uppercase appearance-none"
          >
            <option value="">Select City</option>
            {cities.map(city => <option key={city} value={city}>{city}</option>)}
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-zinc-500 ml-2"><Globe className="w-4 h-4" /> State</label>
        <select 
          value={formData.state} 
          onChange={(e) => setFormData({...formData, state: e.target.value})} 
          className="w-full bg-zinc-50 border-2 border-zinc-100 rounded-2xl px-4 py-3 md:px-6 md:py-4 outline-none focus:border-black transition text-sm font-bold uppercase appearance-none"
        >
          <option value="">Select State</option>
          {NIGERIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div className="space-y-2">
        <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-zinc-500 ml-2"><MapPin className="w-4 h-4" /> Street Address</label>
        <textarea 
          rows={3} 
          value={formData.address} 
          onChange={(e) => setFormData({...formData, address: e.target.value})} 
          className="w-full bg-zinc-50 border-2 border-zinc-100 rounded-3xl px-4 py-3 md:px-6 md:py-4 outline-none focus:border-black transition text-sm font-bold uppercase resize-none" 
          placeholder="Enter your street address"
        />
      </div>
    </div>
  );
}

function ShippingLocationSelector({
  zones,
  selectedId,
  onSelect
}: {
  zones: ShippingZone[];
  selectedId: number | null;
  onSelect: (id: number | null) => void;
}) {
  return (
    <div className="space-y-6">
      <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400 ml-2">Delivery Location</h3>
      <select 
        className="w-full bg-zinc-50 border-2 border-zinc-100 rounded-2xl px-4 py-3 md:px-6 md:py-4 outline-none focus:border-black transition text-sm font-bold uppercase appearance-none"
        value={selectedId || ""}
        onChange={(e) => onSelect(Number(e.target.value) || null)}
      >
        <option value="">Select delivery area</option>
        {zones.map((z) => (
          <optgroup key={z.id} label={`${z.name} (Base ₦${z.base_fee.toLocaleString()})`}>
            {z.locations.map((l) => (
              <option key={l.id} value={l.id}>{l.city_name}</option>
            ))}
          </optgroup>
        ))}
      </select>
    </div>
  );
}

function ShippingOptionSelector({
  options,
  selectedId,
  onSelect
}: {
  options: ShippingOption[];
  selectedId: number | null;
  onSelect: (id: number) => void;
}) {
  return (
    <div className="space-y-6">
      <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400 ml-2">Shipping Method</h3>
      <div className="grid gap-3">
        {options.map((o) => (
          <button
            key={o.id}
            onClick={() => onSelect(o.id)}
            className={`flex items-center justify-between p-4 md:p-6 rounded-3xl border-2 transition-all text-left ${
              selectedId === o.id ? "border-black bg-zinc-50" : "border-zinc-100 hover:border-zinc-300"
            }`}
          >
            <div>
              <p className="font-black italic uppercase text-sm">{o.name}</p>
              <p className="text-xs font-bold text-zinc-400 uppercase">{o.estimated_delivery}</p>
            </div>
            <span className="font-black italic text-sm">₦{o.additional_cost.toLocaleString()}</span>
          </button>
        ))}
      </div>
    </div>
  );
}