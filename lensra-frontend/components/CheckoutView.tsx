"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2, ShieldCheck, CreditCard } from 'lucide-react';

interface CheckoutProps {
  giftId: number;
  email: string;
  amount: number;
  onSuccess: () => void;
  baseUrl: string;
}

export default function CheckoutView({ giftId, email, amount, onSuccess, baseUrl }: CheckoutProps) {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    try {
      /**
       * CORS FIX: Using URLSearchParams to bypass the preflight OPTIONS check.
       * This matches the 'PaymentInitializeSerializer' expectations.
       */
      const params = new URLSearchParams();
      params.append('digital_gift_id', String(giftId));
      params.append('email', email);

      const res = await fetch(`${baseUrl}api/payments/initialize/`, {
        method: 'POST',
        headers: {
          // Sending as form-urlencoded instead of application/json to bypass CORS preflight
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params,
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Initialization failed:", errorText);
        throw new Error('Payment initialization failed');
      }

      const data = await res.json();
      
      // Redirect to the Paystack/Gateway authorization URL
      if (data.authorization_url) {
        window.location.href = data.authorization_url;
      } else {
        throw new Error("No authorization URL received");
      }
      
    } catch (err) {
      alert("Payment failed to initialize. Please try again.");
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }} 
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-8 text-center max-w-md mx-auto"
    >
      <div className="bg-zinc-900 border border-zinc-800 rounded-[40px] p-10 space-y-6">
        <header className="space-y-2">
          <h2 className="text-4xl font-black italic uppercase tracking-tighter text-white">Secure Checkout</h2>
          <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">
            Gift Reference: #LNS-{giftId}
          </p>
        </header>

        <div className="py-8 border-y border-zinc-800 flex flex-col items-center">
          <span className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-2">Amount to Pay</span>
          <h3 className="text-6xl font-black italic text-red-600 tracking-tighter">
            ₦{amount.toLocaleString()}
          </h3>
        </div>

        <div className="flex items-center justify-center gap-4 text-zinc-500">
          <ShieldCheck className="w-5 h-5 text-green-500" />
          <span className="text-[10px] font-black uppercase tracking-widest">
            Encrypted Payment via Paystack
          </span>
        </div>

        <button
          onClick={handlePayment}
          disabled={loading}
          className="w-full py-6 bg-white text-black rounded-full text-[10px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-3 hover:bg-red-600 hover:text-white transition-all disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>Pay Now <CreditCard className="w-4 h-4" /></>
          )}
        </button>
      </div>
      
      <p className="text-zinc-600 text-[9px] font-bold uppercase tracking-widest px-6">
        By clicking pay, you agree to Lensra's digital delivery terms and conditions.
      </p>
    </motion.div>
  );
}