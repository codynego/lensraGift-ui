"use client";

import { useState } from 'react';
import { ArrowLeft, Truck, ShieldCheck, MapPin, Phone, User, CreditCard } from 'lucide-react';

export default function CheckoutPage() {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleOrder = () => {
    setIsProcessing(true);
    // Simulate a brief wait for the order to process
    setTimeout(() => {
      alert("Order Received! We are now preparing your items.");
      setIsProcessing(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-white text-black">
      {/* 1. Header Navigation */}
      <nav className="border-b border-zinc-100 py-6 px-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest hover:text-red-600 transition">
            <ArrowLeft className="w-4 h-4" /> Back to Bag
          </button>
          <div className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-300">
            Secure Checkout
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-12 gap-16">
          
          {/* LEFT: Shipping Form */}
          <div className="lg:col-span-7 space-y-12">
            <div>
              <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter leading-none mb-4">
                Shipping
              </h1>
              <p className="text-zinc-400 font-bold uppercase text-[10px] tracking-widest">
                Step 01: Where should we send your order?
              </p>
            </div>

            <div className="space-y-6">
              {/* Name Input */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-2">
                  <User className="w-3 h-3" /> Full Name
                </label>
                <input 
                  type="text" 
                  placeholder="e.g. John Doe" 
                  className="w-full bg-zinc-50 border-2 border-zinc-100 rounded-2xl px-6 py-4 outline-none focus:border-red-600 focus:bg-white transition text-sm font-bold uppercase tracking-tight"
                />
              </div>

              {/* Phone Input */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-2">
                  <Phone className="w-3 h-3" /> Phone Number
                </label>
                <input 
                  type="tel" 
                  placeholder="e.g. 0812 000 0000" 
                  className="w-full bg-zinc-50 border-2 border-zinc-100 rounded-2xl px-6 py-4 outline-none focus:border-red-600 focus:bg-white transition text-sm font-bold uppercase tracking-tight"
                />
              </div>

              {/* Address Input */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-2">
                  <MapPin className="w-3 h-3" /> Delivery Address
                </label>
                <textarea 
                  rows={3}
                  placeholder="Enter your street address, city, and state..." 
                  className="w-full bg-zinc-50 border-2 border-zinc-100 rounded-3xl px-6 py-4 outline-none focus:border-red-600 focus:bg-white transition text-sm font-bold uppercase tracking-tight"
                />
              </div>
            </div>

            {/* Delivery Method (Visual Choice) */}
            <div className="pt-8">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-4 ml-2">Delivery Method</h3>
              <div className="p-6 border-2 border-black rounded-[32px] flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-black text-white rounded-2xl flex items-center justify-center">
                    <Truck className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-black italic uppercase text-sm">Standard Delivery</p>
                    <p className="text-[10px] font-bold text-zinc-400 uppercase">3 - 5 Business Days</p>
                  </div>
                </div>
                <span className="font-black italic">FREE</span>
              </div>
            </div>
          </div>

          {/* RIGHT: Final Summary & Action */}
          <div className="lg:col-span-5">
            <div className="bg-zinc-950 text-white rounded-[48px] p-10 sticky top-12 shadow-2xl">
              <h2 className="text-3xl font-black italic uppercase tracking-tighter mb-8 text-red-600">Review</h2>
              
              <div className="space-y-4 mb-10">
                <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest text-zinc-500">
                  <span>Subtotal</span>
                  <span className="text-white">₦10,500</span>
                </div>
                <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest text-zinc-500">
                  <span>Shipping</span>
                  <span className="text-white">FREE</span>
                </div>
                <div className="h-px bg-zinc-800 my-4" />
                <div className="flex justify-between items-end">
                  <span className="text-[11px] font-bold uppercase tracking-widest">Grand Total</span>
                  <span className="text-4xl font-black italic tracking-tighter text-white leading-none">₦10,500</span>
                </div>
              </div>

              <button 
                onClick={handleOrder}
                disabled={isProcessing}
                className="w-full py-6 bg-red-600 hover:bg-white hover:text-black text-white rounded-3xl font-black uppercase tracking-[0.3em] text-xs transition-all flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {isProcessing ? "Processing..." : (
                  <> <CreditCard className="w-4 h-4" /> Place My Order </>
                )}
              </button>

              <div className="mt-10 space-y-4">
                <div className="flex items-center gap-3 text-[9px] font-bold uppercase tracking-widest text-zinc-500">
                  <ShieldCheck className="w-4 h-4 text-red-600" /> Secure Payment Gateway
                </div>
                <p className="text-[8px] leading-relaxed text-zinc-600 uppercase font-bold">
                  By clicking Place Order, you agree to our terms of service and refund policy.
                </p>
              </div>
            </div>
          </div>
          
        </div>
      </main>
    </div>
  );
}