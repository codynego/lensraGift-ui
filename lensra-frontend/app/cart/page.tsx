"use client";

import { useState } from 'react';
import { Trash2, Plus, Minus, ShoppingBag, Lock, ArrowLeft, ArrowRight, ShieldCheck } from 'lucide-react';

const initialCart = [
  { 
    id: "mug_white", 
    name: "Custom Coffee Mug", 
    qty: 1, 
    price: 2500,
    image: "☕",
    details: "Your Photo Print",
    color: "White",
    size: "Standard"
  },
  { 
    id: "shirt_white", 
    name: "Premium Cotton T-Shirt", 
    qty: 2, 
    price: 4000,
    image: "👕",
    details: "Logo: 'Lensra Studio'",
    color: "White",
    size: "Large"
  },
];

export default function CartPage() {
  const [cartItems, setCartItems] = useState(initialCart);
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);

  // Function to change item amount
  const updateQuantity = (id: string, newQty: number) => {
    if (newQty < 1) return;
    setCartItems(prev => 
      prev.map(item => item.id === id ? { ...item, qty: newQty } : item)
    );
  };

  // Function to delete item
  const removeItem = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  // Math for the checkout
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const discount = promoApplied ? subtotal * 0.2 : 0;
  const shipping = subtotal > 10000 ? 0 : 1500;
  const total = subtotal - discount + shipping;

  const applyPromo = () => {
    if (promoCode.toUpperCase() === 'LENSRA20') {
      setPromoApplied(true);
    }
  };

  return (
    <div className="min-h-screen bg-white text-black font-sans">
      
      {/* 1. Top Message Bar */}
      <div className="bg-black text-white py-3 px-6 text-center">
        <p className="text-[10px] font-bold uppercase tracking-widest">
          🎁 Free Delivery on orders over ₦10,000 — <span className="text-red-500">Use Code: LENSRA20</span>
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Go Back Link */}
        <button className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest mb-10 hover:text-red-600 transition">
          <ArrowLeft className="w-4 h-4" /> Back to Shopping
        </button>

        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* LEFT SIDE: List of Items */}
          <div className="flex-1">
            <div className="border-b-4 border-black pb-6 mb-8 flex justify-between items-end">
              <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter">My Bag</h1>
              <span className="text-xl font-bold text-zinc-400">{cartItems.length} Items</span>
            </div>

            {cartItems.length === 0 ? (
              <div className="py-20 text-center bg-zinc-50 rounded-[40px] border-2 border-dashed border-zinc-200">
                <ShoppingBag className="w-12 h-12 mx-auto mb-4 text-zinc-300" />
                <p className="text-lg font-bold uppercase italic">Your bag is empty</p>
                <button className="mt-6 px-8 py-4 bg-black text-white rounded-full text-[10px] font-bold uppercase tracking-widest">Shop Now</button>
              </div>
            ) : (
              <div className="divide-y divide-zinc-100">
                {cartItems.map((item) => (
                  <div key={item.id} className="py-8 flex flex-col md:flex-row gap-6 group">
                    {/* Item Image */}
                    <div className="w-full md:w-40 aspect-square bg-zinc-50 rounded-[30px] flex items-center justify-center text-6xl group-hover:bg-red-50 transition-colors">
                      {item.image}
                    </div>

                    {/* Item Text */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-xl font-black uppercase italic tracking-tight">{item.name}</h3>
                          <p className="text-[11px] font-bold text-zinc-500 uppercase mt-1">Design: {item.details}</p>
                          <p className="text-[11px] font-bold text-zinc-400 uppercase mt-1">Size: {item.size} | Color: {item.color}</p>
                        </div>
                        <button onClick={() => removeItem(item.id)} className="p-2 text-zinc-300 hover:text-red-600 transition">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>

                      {/* Item Price and Quantity */}
                      <div className="flex justify-between items-end mt-6">
                        <div className="flex items-center bg-zinc-100 rounded-xl p-1">
                          <button onClick={() => updateQuantity(item.id, item.qty - 1)} className="p-2 hover:bg-white rounded-lg transition"><Minus className="w-4 h-4" /></button>
                          <span className="px-4 font-bold">{item.qty}</span>
                          <button onClick={() => updateQuantity(item.id, item.qty + 1)} className="p-2 hover:bg-white rounded-lg transition"><Plus className="w-4 h-4" /></button>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-black italic">₦{(item.price * item.qty).toLocaleString()}</p>
                          <p className="text-[10px] text-zinc-400 font-bold uppercase">₦{item.price.toLocaleString()} each</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT SIDE: Payment Summary */}
          <div className="lg:w-96">
            <div className="bg-zinc-50 rounded-[40px] p-8 sticky top-10 border border-zinc-100">
              <h2 className="text-2xl font-black uppercase italic tracking-tight mb-8">Order Summary</h2>

              {/* Discount Box */}
              <div className="mb-8">
                <div className="flex gap-2 border-b-2 border-black pb-2">
                  <input
                    type="text"
                    placeholder="ENTER DISCOUNT CODE"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="bg-transparent border-none text-[10px] font-bold tracking-widest w-full focus:ring-0"
                  />
                  <button onClick={applyPromo} className="text-[10px] font-black uppercase hover:text-red-600 transition">Apply</button>
                </div>
                {promoApplied && <p className="text-[10px] font-bold text-green-600 mt-2 uppercase tracking-widest italic">Success: 20% Off Applied!</p>}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-[11px] font-bold uppercase text-zinc-500">
                  <span>Items Subtotal</span>
                  <span className="text-black italic">₦{subtotal.toLocaleString()}</span>
                </div>
                {promoApplied && (
                  <div className="flex justify-between text-[11px] font-bold uppercase text-red-600">
                    <span>Discount</span>
                    <span className="italic">-₦{discount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-[11px] font-bold uppercase text-zinc-500">
                  <span>Delivery Fee</span>
                  <span className="text-black italic">{shipping === 0 ? 'FREE' : `₦${shipping.toLocaleString()}`}</span>
                </div>
              </div>

              {/* Final Total */}
              <div className="border-t-2 border-zinc-200 pt-6 mb-8 flex justify-between items-end">
                <span className="text-[11px] font-black uppercase">Grand Total</span>
                <span className="text-4xl font-black italic text-red-600 tracking-tighter">₦{total.toLocaleString()}</span>
              </div>

              {/* Checkout Buttons */}
              <div className="space-y-3">
                <button className="w-full py-5 bg-black text-white rounded-2xl font-black uppercase text-[11px] tracking-widest flex items-center justify-center gap-2 hover:bg-red-600 transition-all shadow-lg shadow-black/10">
                  <Lock className="w-4 h-4" /> Pay Securely Now
                </button>
                <button className="w-full py-5 bg-white border border-black text-black rounded-2xl font-black uppercase text-[11px] tracking-widest flex items-center justify-center gap-2 hover:bg-zinc-50 transition-all">
                  Quick Pay <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Safety Badges */}
              <div className="mt-8 pt-6 border-t border-zinc-200 flex flex-col gap-3">
                <div className="flex items-center gap-3 text-[9px] font-bold uppercase text-zinc-400">
                  <ShieldCheck className="w-4 h-4 text-black" /> Safe & Encrypted Payment
                </div>
                <div className="flex items-center gap-3 text-[9px] font-bold uppercase text-zinc-400">
                  <ShoppingBag className="w-4 h-4 text-black" /> 100% Quality Guarantee
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}