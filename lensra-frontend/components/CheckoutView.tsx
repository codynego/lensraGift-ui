"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2, ShieldCheck, CreditCard, Lock, CheckCircle2 } from 'lucide-react';

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
      const params = new URLSearchParams();
      params.append('digital_gift_id', String(giftId));
      params.append('email', email);

      const res = await fetch(`${baseUrl}api/payments/initialize/`, {
        method: 'POST',
        headers: {
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
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6 max-w-2xl mx-auto"
    >
      {/* Header */}
      <header className="space-y-3 text-center">
        <span className="text-red-600 text-[9px] font-black uppercase tracking-[0.4em]">Final Step</span>
        <h2 className="text-3xl md:text-4xl font-black italic uppercase tracking-tighter">Complete Your Payment</h2>
        <p className="text-sm text-zinc-400 font-medium">Secure checkout powered by Paystack</p>
      </header>

      {/* Main Checkout Card */}
      <div className="bg-zinc-900/50 border-2 border-zinc-800 rounded-3xl p-8 md:p-10 space-y-8">
        {/* Gift Reference */}
        <div className="flex items-center justify-between pb-6 border-b border-zinc-800">
          <span className="text-xs font-bold text-zinc-500 uppercase tracking-wide">Gift Reference</span>
          <span className="text-xs font-black uppercase tracking-wider text-white">#LNS-{giftId}</span>
        </div>

        {/* Amount Section */}
        <div className="text-center space-y-4 py-6">
          <div className="space-y-2">
            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Total Amount</p>
            <motion.h3 
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="text-5xl md:text-6xl font-black italic text-red-600 tracking-tighter"
            >
              ₦{amount.toLocaleString()}
            </motion.h3>
          </div>

          {/* Email Confirmation */}
          <div className="inline-flex items-center gap-2 bg-zinc-800/50 border border-zinc-700 rounded-full px-4 py-2">
            <CheckCircle2 className="w-4 h-4 text-green-500" />
            <span className="text-xs font-medium text-zinc-300">{email}</span>
          </div>
        </div>

        {/* Security Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="flex items-center gap-3 bg-zinc-800/30 border border-zinc-800 rounded-2xl p-4">
            <div className="p-2 bg-green-500/10 rounded-xl">
              <ShieldCheck className="w-5 h-5 text-green-500" />
            </div>
            <div className="text-left">
              <p className="text-[10px] font-black uppercase text-zinc-400 tracking-wide">Secure Payment</p>
              <p className="text-xs font-bold text-white">256-bit SSL Encrypted</p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-zinc-800/30 border border-zinc-800 rounded-2xl p-4">
            <div className="p-2 bg-blue-500/10 rounded-xl">
              <Lock className="w-5 h-5 text-blue-500" />
            </div>
            <div className="text-left">
              <p className="text-[10px] font-black uppercase text-zinc-400 tracking-wide">Protected Data</p>
              <p className="text-xs font-bold text-white">PCI DSS Compliant</p>
            </div>
          </div>
        </div>

        {/* Payment Button */}
        <motion.button
          onClick={handlePayment}
          disabled={loading}
          whileHover={{ scale: loading ? 1 : 1.02 }}
          whileTap={{ scale: loading ? 1 : 0.98 }}
          className={`w-full py-6 rounded-full text-xs font-black uppercase tracking-[0.3em] flex items-center justify-center gap-3 transition-all shadow-lg
            ${loading 
              ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed' 
              : 'bg-red-600 text-white hover:bg-red-700 shadow-red-600/30'}`}
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Processing...</span>
            </>
          ) : (
            <>
              <CreditCard className="w-5 h-5" />
              <span>Pay ₦{amount.toLocaleString()} Now</span>
            </>
          )}
        </motion.button>

        {/* Payment Methods Info */}
        <div className="pt-4 border-t border-zinc-800">
          <p className="text-center text-[10px] font-bold text-zinc-500 uppercase tracking-wide mb-3">
            Accepted Payment Methods
          </p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <div className="px-4 py-2 bg-zinc-800/50 border border-zinc-700 rounded-lg">
              <span className="text-[9px] font-black uppercase text-zinc-400">Visa</span>
            </div>
            <div className="px-4 py-2 bg-zinc-800/50 border border-zinc-700 rounded-lg">
              <span className="text-[9px] font-black uppercase text-zinc-400">Mastercard</span>
            </div>
            <div className="px-4 py-2 bg-zinc-800/50 border border-zinc-700 rounded-lg">
              <span className="text-[9px] font-black uppercase text-zinc-400">Verve</span>
            </div>
            <div className="px-4 py-2 bg-zinc-800/50 border border-zinc-700 rounded-lg">
              <span className="text-[9px] font-black uppercase text-zinc-400">Bank Transfer</span>
            </div>
          </div>
        </div>
      </div>

      {/* Terms and Conditions */}
      <div className="space-y-3">
        <p className="text-center text-[10px] text-zinc-500 font-medium leading-relaxed max-w-lg mx-auto">
          By completing this payment, you agree to Lensra's{' '}
          <span className="text-zinc-400 font-bold">Terms of Service</span> and{' '}
          <span className="text-zinc-400 font-bold">Digital Delivery Policy</span>.
          Your payment information is processed securely through Paystack.
        </p>

        {/* Powered by Paystack */}
        <div className="flex items-center justify-center gap-2 text-zinc-600">
          <span className="text-[9px] font-bold uppercase tracking-widest">Powered by</span>
          <span className="text-xs font-black uppercase text-zinc-500">Paystack</span>
        </div>
      </div>

      {/* Help Text */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-center bg-zinc-900/30 border border-zinc-800 rounded-2xl p-5"
      >
        <p className="text-xs text-zinc-400 font-medium">
          Need help? Contact us at{' '}
          <a href="mailto:support@lensra.com" className="text-red-600 font-bold hover:text-red-500 transition-colors">
            support@lensra.com
          </a>
        </p>
      </motion.div>
    </motion.div>
  );
}