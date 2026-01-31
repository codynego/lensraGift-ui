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
  base_fee: number | string;
  locations: ShippingLocation[];
}

interface ShippingOption {
  id: number;
  name: string;
  additional_cost: number | string;
  estimated_delivery: string;
}

interface ExtendedShippingLocation extends ShippingLocation {
  zone_name: string;
  base_fee: number | string;
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
    product_price: number | string;
  };
  product_details?: {
    name: string;
    base_price: number | string;
  };
  product_name?: string;
  name?: string;
  price?: number | string;
  secret_message?: string;
  emotion?: string;
}

const formatCurrency = (amount: number): string => {
  return `₦${amount.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  })}`;
};

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
  const [couponCode, setCouponCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [couponMessage, setCouponMessage] = useState<string | null>(null);

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

      if (token) {
        const localGuestCart = localStorage.getItem('guest_cart');
        if (localGuestCart) {
          try {
            const guestItems = JSON.parse(localGuestCart);
            await Promise.all(guestItems.map(async (item: any) => {
              const formData = new FormData();
              formData.append('product', item.product_id || item.product);
              if (item.placement) formData.append('placement', item.placement);
              formData.append('quantity', item.quantity.toString());
              await fetch(`${BaseUrl}api/orders/cart/`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData
              });
            }));
            localStorage.removeItem('guest_cart');
            localStorage.removeItem('guest_session_id');
          } catch (syncError) {
            console.error("Cart sync failed:", syncError);
            setErrorMessage("Failed to sync cart items.");
          }
        }
      }

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
          const localKey = token ? 'user_cart' : 'guest_cart';
          const localData = localStorage.getItem(localKey);
          if (localData) setCartItems(JSON.parse(localData));
        }
      } catch (err) {
        console.error("Cart Fetch Error:", err);
        const localKey = token ? 'user_cart' : 'guest_cart';
        const localData = localStorage.getItem(localKey);
        if (localData) setCartItems(JSON.parse(localData));
      }

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
          }
        } catch (err) {
          console.error("Address Fetch Error:", err);
        }
      } else {
        setShowManualForm(true);
      }

      try {
        const zonesRes = await fetch(`${BaseUrl}api/orders/shipping/zones/`, {
          headers: { ...(token && { 'Authorization': `Bearer ${token}` }) }
        });
        if (zonesRes.ok) {
          const zonesData = await zonesRes.json();
          setZones(Array.isArray(zonesData) ? zonesData : (zonesData.results || []));
        }
      } catch (err) {
        console.error("Shipping Zones Fetch Error:", err);
      }

      try {
        const optionsRes = await fetch(`${BaseUrl}api/orders/shipping/options/`, {
          headers: { ...(token && { 'Authorization': `Bearer ${token}` }) }
        });
        if (optionsRes.ok) {
          const optionsData = await optionsRes.json();
          const optionsList = Array.isArray(optionsData) ? optionsData : (optionsData.results || []);
          setOptions(optionsList);
          if (optionsList.length > 0) setSelectedOptionId(optionsList[0].id);
        }
      } catch (err) {
        console.error("Shipping Options Fetch Error:", err);
      }

      setIsLoading(false);
    };

    loadCheckoutData();
  }, [token]);

  useEffect(() => {
    const extendedLocations = zones
      .flatMap((z: ShippingZone) =>
        Array.isArray(z.locations)
          ? z.locations.map((l: ShippingLocation) => ({ ...l, zone_name: z.name, base_fee: z.base_fee }))
          : []
      )
      .sort((a, b) => a.city_name.localeCompare(b.city_name));
    setLocations(extendedLocations);
  }, [zones]);

  useEffect(() => {
    if (formData.city && locations.length > 0) {
      const matchedLoc = locations.find((l) => l.city_name.toLowerCase() === formData.city.toLowerCase());
      if (matchedLoc) setSelectedLocationId(matchedLoc.id);
      else setSelectedLocationId(null);
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

  const parseSafe = (val: number | string | undefined): number => {
    if (typeof val === 'number') return val;
    if (typeof val === 'string') {
      const cleaned = val.replace(/,/g, '');
      return parseFloat(cleaned) || 0;
    }
    return 0;
  };

  const subtotal = useMemo(() => {
    return cartItems.reduce((acc, item) => {
      const priceRaw = item.placement_details?.product_price ??
                       item.product_details?.base_price ??
                       item.price ??
                       0;
      const price = parseSafe(priceRaw);
      return acc + (price * (item.quantity || 1));
    }, 0);
  }, [cartItems]);

  const shipping = useMemo(() => {
    if (!selectedLocationId || !selectedOptionId) return 0;
    const selectedLoc = locations.find((l) => l.id === selectedLocationId);
    const selectedOpt = options.find((o) => o.id === selectedOptionId);
    const baseFee = selectedLoc ? parseSafe(selectedLoc.base_fee) : 0;
    const addCost = selectedOpt ? parseSafe(selectedOpt.additional_cost) : 0;
    return baseFee + addCost;
  }, [selectedLocationId, selectedOptionId, locations, options]);

  const totalBeforeDiscount = subtotal + shipping;
  const total = totalBeforeDiscount - appliedDiscount;

  const validateForm = () => {
    if (!formData.full_name || !formData.address || !formData.city || !formData.state || !formData.phone) {
      setErrorMessage("Please complete all required delivery fields.");
      return false;
    }
    if (!token && !formData.email) {
      setErrorMessage("Email is required for guest checkout.");
      return false;
    }
    if (!selectedLocationId) {
      setErrorMessage("Please select a delivery location.");
      return false;
    }
    if (!selectedOptionId) {
      setErrorMessage("Please select a shipping method.");
      return false;
    }
    if (cartItems.length === 0) {
      setErrorMessage("Your cart is empty.");
      return false;
    }
    return true;
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setIsApplyingCoupon(true);
    setCouponMessage(null);
    setErrorMessage(null);

    try {
      const res = await fetch(`${BaseUrl}api/orders/validate-coupon/`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }) 
        },
        body: JSON.stringify({
          code: couponCode,
          subtotal: subtotal
        })
      });

      const data = await res.json();

      if (res.ok) {
        setAppliedDiscount(data.discount_amount);
        setCouponMessage('Coupon applied!');
      } else {
        setCouponMessage(data.error || 'Invalid coupon');
        setAppliedDiscount(0);
      }
    } catch (err) {
      setCouponMessage('Failed to apply');
      setAppliedDiscount(0);
    } finally {
      setIsApplyingCoupon(false);
    }
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
    orderFormData.append('shipping_location_id', selectedLocationId!.toString());
    orderFormData.append('shipping_option_id', selectedOptionId!.toString());
    if (couponCode) orderFormData.append('coupon_code', couponCode);

    if (!token) {
      orderFormData.append('guest_email', formData.email);
      if (sessionId) orderFormData.append('session_id', sessionId);
    } else if (selectedAddressId) {
      orderFormData.append('address_id', selectedAddressId.toString());
    }

    try {
      const orderRes = await fetch(`${BaseUrl}api/orders/orders/`, {
        method: 'POST',
        headers: { ...(token && { 'Authorization': `Bearer ${token}` }) },
        body: orderFormData
      });

      const orderData = await orderRes.json();

      if (orderRes.ok) {
        localStorage.removeItem('guest_cart');
        localStorage.removeItem('user_cart');
        if (!token) localStorage.removeItem('guest_session_id');

        const payFormData = new FormData();
        payFormData.append('order_id', orderData.id.toString());
        payFormData.append('email', orderEmail);
        if (!token && sessionId) payFormData.append('session_id', sessionId);

        const payRes = await fetch(`${BaseUrl}api/payments/initialize/`, {
          method: 'POST',
          headers: { ...(token && { 'Authorization': `Bearer ${token}` }) },
          body: payFormData
        });

        const payData = await payRes.json();

        if (payRes.ok && payData.authorization_url) {
          window.location.href = payData.authorization_url;
        } else {
          router.push(`/order-success?id=${orderData.id}`);
        }
      } else {
        setErrorMessage(orderData.error || orderData.guest_email || "Failed to create order.");
      }
    } catch (err) {
      console.error(err);
      setErrorMessage("Network error. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const isGuest = !token;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-red-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <nav className="border-b border-zinc-100 py-3 px-4 sticky top-0 bg-white z-10 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button 
            onClick={() => router.back()} 
            className="flex items-center gap-1 text-sm font-medium text-zinc-600 hover:text-zinc-900 transition"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <div className="text-sm font-medium text-zinc-500 flex items-center gap-1">
            <ShieldCheck className="w-4 h-4" /> Secure
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-6 lg:grid lg:grid-cols-2 lg:gap-12 lg:py-8">
        {errorMessage && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
            {errorMessage}
          </div>
        )}
        {couponMessage && (
          <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-600 text-sm">
            {couponMessage}
          </div>
        )}

        <div className="space-y-6 lg:space-y-8">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold leading-tight mb-1 text-zinc-900">
              Checkout
            </h1>
            <p className="text-sm text-zinc-500">
              As {token ? 'Member' : 'Guest'}
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

        <div className="mt-6 lg:mt-0">
          <div className="bg-zinc-900 text-white p-6 rounded-2xl sticky top-20 shadow-md border border-zinc-800">
            <h2 className="text-xl font-bold mb-4 text-red-500">
              Summary
            </h2>

            <div className="space-y-3 mb-6 max-h-64 overflow-y-auto pr-2">
              {cartItems.length === 0 ? (
                <p className="text-zinc-400 text-sm text-center py-2">Empty</p>
              ) : (
                cartItems.map((item, i) => {
                  const name = item.placement_details?.product_name ||
                               item.product_details?.name ||
                               item.product_name ||
                               item.name || "Item";
                  const priceRaw = item.placement_details?.product_price ??
                                   item.product_details?.base_price ??
                                   item.price ??
                                   0;
                  const price = parseSafe(priceRaw);
                  const itemTotal = price * (item.quantity || 1);

                  return (
                    <div key={i} className="flex justify-between text-sm border-b border-zinc-800 pb-2">
                      <div className="flex-1 pr-2">
                        <p>{item.quantity}x {name}</p>
                        {item.secret_message && (
                          <span className="text-[10px] text-zinc-400 flex items-center gap-1 mt-0.5">
                            <Star className="w-3 h-3 text-red-500 fill-red-500" />
                            Surprise
                          </span>
                        )}
                      </div>
                      <span>{formatCurrency(itemTotal)}</span>
                    </div>
                  );
                })
              )}
            </div>

            {/* Coupon */}
            <div className="mb-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  placeholder="CODE"
                  className="flex-1 px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-[10px] uppercase text-zinc-300 placeholder-zinc-500 focus:border-red-500"
                />
                <button
                  onClick={handleApplyCoupon}
                  disabled={isApplyingCoupon || !couponCode.trim()}
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-[10px] font-medium disabled:opacity-50"
                >
                  {isApplyingCoupon ? <Loader2 className="animate-spin w-3 h-3 mx-auto" /> : 'Apply'}
                </button>
              </div>
            </div>

            <div className="space-y-2 text-sm border-t border-zinc-800 pt-3">
              <div className="flex justify-between text-zinc-400">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Shipping</span>
                <span>{shipping === 0 ? "TBD" : formatCurrency(shipping)}</span>
              </div>
              {appliedDiscount > 0 && (
                <div className="flex justify-between text-green-400">
                  <span>Discount</span>
                  <span>-{formatCurrency(appliedDiscount)}</span>
                </div>
              )}
              <div className="flex justify-between pt-2 border-t border-zinc-800 font-medium text-white">
                <span>Total</span>
                <span className="text-xl">{formatCurrency(total)}</span>
              </div>
            </div>

            <button
              onClick={handleOrder}
              disabled={isProcessing || cartItems.length === 0 || !selectedLocationId || !selectedOptionId}
              className="w-full mt-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium uppercase tracking-wide disabled:opacity-50 flex items-center justify-center gap-1 shadow-sm"
            >
              {isProcessing ? (
                <Loader2 className="animate-spin w-4 h-4" />
              ) : (
                <>
                  <CreditCard className="w-4 h-4" /> Pay
                </>
              )}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

// Reusable sub-components remain the same as previous version, with minor tweaks for consistency

function AddressSelector({ addresses, selectedId, onSelect, onAddNew }: {
  addresses: Address[];
  selectedId: number | null;
  onSelect: (addr: Address) => void;
  onAddNew: () => void;
}) {
  return (
    <div className="space-y-4">
      <h3 className="text-[10px] font-medium uppercase tracking-widest text-zinc-500">Addresses</h3>
      <div className="grid gap-3">
        {addresses.map((addr) => (
          <button
            key={addr.id}
            onClick={() => onSelect(addr)}
            className={`p-4 rounded-2xl border transition-all text-left ${
              selectedId === addr.id 
                ? "border-zinc-900 bg-zinc-50" 
                : "border-zinc-200 hover:border-zinc-400"
            }`}
          >
            <div className="flex items-start gap-3">
              <CheckCircle2 className={`w-5 h-5 mt-0.5 ${selectedId === addr.id ? "text-red-500" : "text-zinc-300"}`} />
              <div>
                <p className="font-medium text-sm">{addr.full_name}</p>
                <p className="text-[10px] text-zinc-500 mt-0.5">
                  {addr.street_address}, {addr.city}, {addr.state}
                </p>
                <p className="text-[10px] text-zinc-500 mt-0.5">{addr.phone_number}</p>
              </div>
            </div>
          </button>
        ))}
        <button
          onClick={onAddNew}
          className="flex items-center justify-center gap-2 p-4 rounded-2xl border border-dashed border-zinc-300 hover:border-zinc-500 transition-all text-[10px] font-medium uppercase tracking-widest text-zinc-600 hover:text-zinc-900"
        >
          <Plus className="w-4 h-4" /> New Address
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
    <div className="space-y-4 bg-zinc-50 p-4 rounded-2xl border border-zinc-200">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium text-zinc-900">
          {isGuest ? 'Delivery Details' : 'New Address'}
        </h3>
        {onCancel && (
          <button onClick={onCancel} className="text-zinc-500 hover:text-zinc-900 transition">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <div className="space-y-3">
        <div className="space-y-1">
          <label className="flex items-center gap-1 text-[10px] font-medium uppercase text-zinc-600">
            <User className="w-3 h-3" /> Name *
          </label>
          <input
            type="text"
            value={formData.full_name}
            onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
            className="w-full px-4 py-3 bg-white border border-zinc-200 rounded-lg focus:border-zinc-900 outline-none transition text-sm"
            placeholder="Full name"
            required
          />
        </div>

        {isGuest && (
          <div className="space-y-1">
            <label className="flex items-center gap-1 text-[10px] font-medium uppercase text-zinc-600">
              <Mail className="w-3 h-3" /> Email *
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 bg-white border border-zinc-200 rounded-lg focus:border-zinc-900 outline-none transition text-sm"
              placeholder="Email"
              required
            />
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="flex items-center gap-1 text-[10px] font-medium uppercase text-zinc-600">
              <Phone className="w-3 h-3" /> Phone *
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-3 bg-white border border-zinc-200 rounded-lg focus:border-zinc-900 outline-none transition text-sm"
              placeholder="Phone"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="flex items-center gap-1 text-[10px] font-medium uppercase text-zinc-600">
              <MapPin className="w-3 h-3" /> City *
            </label>
            <select
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              className="w-full px-4 py-3 bg-white border border-zinc-200 rounded-lg focus:border-zinc-900 outline-none transition text-sm"
            >
              <option value="">Select city</option>
              {cities.map((city) => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-1">
          <label className="flex items-center gap-1 text-[10px] font-medium uppercase text-zinc-600">
            <Globe className="w-3 h-3" /> State *
          </label>
          <select
            value={formData.state}
            onChange={(e) => setFormData({ ...formData, state: e.target.value })}
            className="w-full px-4 py-3 bg-white border border-zinc-200 rounded-lg focus:border-zinc-900 outline-none transition text-sm"
          >
            <option value="">Select state</option>
            {NIGERIAN_STATES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <div className="space-y-1">
          <label className="flex items-center gap-1 text-[10px] font-medium uppercase text-zinc-600">
            <MapPin className="w-3 h-3" /> Address *
          </label>
          <textarea
            rows={2}
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            className="w-full px-4 py-3 bg-white border border-zinc-200 rounded-lg focus:border-zinc-900 outline-none transition text-sm resize-none"
            placeholder="Street address"
            required
          />
        </div>
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
  const parseSafe = (val: number | string | undefined): number => {
    if (typeof val === 'number') return val;
    if (typeof val === 'string') {
      const cleaned = val.replace(/,/g, '');
      return parseFloat(cleaned) || 0;
    }
    return 0;
  };

  return (
    <div className="space-y-4">
      <h3 className="text-[10px] font-medium uppercase tracking-widest text-zinc-500">Location *</h3>
      <select
        className="w-full px-4 py-3 bg-white border border-zinc-200 rounded-lg focus:border-zinc-900 outline-none transition text-sm"
        value={selectedId || ""}
        onChange={(e) => onSelect(Number(e.target.value) || null)}
      >
        <option value="">Select area</option>
        {zones.map((z) => (
          <optgroup key={z.id} label={`${z.name} - ${formatCurrency(parseSafe(z.base_fee))}`}>
            {z.locations.map((l) => (
              <option key={l.id} value={l.id}>
                {l.city_name}
              </option>
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
  const parseSafe = (val: number | string | undefined): number => {
    if (typeof val === 'number') return val;
    if (typeof val === 'string') {
      const cleaned = val.replace(/,/g, '');
      return parseFloat(cleaned) || 0;
    }
    return 0;
  };

  return (
    <div className="space-y-4">
      <h3 className="text-[10px] font-medium uppercase tracking-widest text-zinc-500">Method *</h3>
      <div className="grid gap-3">
        {options.map((o) => (
          <button
            key={o.id}
            onClick={() => onSelect(o.id)}
            className={`p-4 rounded-2xl border transition-all text-left ${
              selectedId === o.id
                ? "border-zinc-900 bg-zinc-50"
                : "border-zinc-200 hover:border-zinc-400"
            }`}
          >
            <div className="flex justify-between items-center gap-3">
              <div>
                <p className="font-medium text-sm">{o.name}</p>
                <p className="text-[10px] text-zinc-500 mt-0.5">{o.estimated_delivery}</p>
              </div>
              <span className="font-medium text-sm">
                {formatCurrency(parseSafe(o.additional_cost))}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}