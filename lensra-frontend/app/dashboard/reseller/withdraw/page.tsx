"use client";

import { useState } from 'react';
import { 
  Banknote, 
  ArrowRight, 
  Loader2, 
  CheckCircle2, 
  AlertCircle,
  Building2,
  User,
  CreditCard
} from 'lucide-react';

interface WithdrawProps {
  balance?: number; // Made optional to handle undefined states
  onSuccess?: () => void;
}

export default function WithdrawFunds({ balance = 0, onSuccess }: WithdrawProps) {
  const [amount, setAmount] = useState("");
  const [bankDetails, setBankDetails] = useState({
    bankName: "",
    accountNumber: "",
    accountName: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // --- FIX: Ensure balance is treated as a number and amount is parsed safely ---
  const currentBalance = Number(balance ?? 0);
  const withdrawAmount = parseFloat(amount || "0");

  const canWithdraw = 
    withdrawAmount > 0 && 
    withdrawAmount <= currentBalance && 
    bankDetails.accountNumber.length === 10 &&
    bankDetails.bankName.trim() !== "";

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canWithdraw) return;

    setIsSubmitting(true);
    setStatus('idle');

    try {
      const res = await fetch('/api/resellers/withdraw/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: withdrawAmount,
          ...bankDetails
        }),
      });

      if (res.ok) {
        setStatus('success');
        if (onSuccess) onSuccess();
      } else {
        setStatus('error');
      }
    } catch (err) {
      setStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (status === 'success') {
    return (
      <div className="bg-zinc-950 text-white rounded-[48px] p-10 text-center space-y-6">
        <div className="bg-red-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-4xl font-black italic uppercase tracking-tighter">Request Sent</h2>
        <p className="text-zinc-400 text-[10px] font-bold uppercase tracking-widest">
          ₦{withdrawAmount.toLocaleString()} is on its way.
        </p>
        <button onClick={() => { setStatus('idle'); setAmount(""); }} className="text-red-600 text-[10px] font-black uppercase tracking-[0.3em] pt-4">
          Back to Wallet
        </button>
      </div>
    );
  }

  return (
    <div className="bg-zinc-950 text-white rounded-[48px] p-10 shadow-2xl border border-white/5">
      <div className="flex justify-between items-start mb-10">
        <div>
          <h2 className="text-3xl font-black italic uppercase tracking-tighter text-red-600">Withdraw</h2>
          <p className="text-zinc-500 font-bold uppercase text-[9px] tracking-widest mt-1">
            {/* FIX: Fallback to 0 if balance is undefined */}
            Available: ₦{currentBalance.toLocaleString()}
          </p>
        </div>
        <Banknote className="text-zinc-800 w-10 h-10" />
      </div>

      <form onSubmit={handleWithdraw} className="space-y-6">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-2">Amount</label>
          <div className="relative">
            <span className="absolute left-6 top-1/2 -translate-y-1/2 font-black italic text-xl">₦</span>
            <input 
              type="number" 
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full bg-zinc-900 border-2 border-zinc-800 rounded-3xl pl-12 pr-6 py-6 outline-none focus:border-red-600 transition text-2xl font-black italic tracking-tighter"
            />
          </div>
          {withdrawAmount > currentBalance && (
            <p className="flex items-center gap-1 text-red-500 text-[9px] font-bold uppercase tracking-tight ml-2">
              <AlertCircle className="w-3 h-3" /> Over available balance
            </p>
          )}
        </div>

        <div className="grid gap-4 bg-zinc-900/50 p-6 rounded-[32px] border border-white/5">
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-zinc-500">
              <Building2 className="w-3 h-3" /> Bank Name
            </label>
            <input 
              type="text" 
              placeholder="E.G. ACCESS BANK"
              value={bankDetails.bankName}
              onChange={(e) => setBankDetails({...bankDetails, bankName: e.target.value})}
              className="w-full bg-transparent border-b border-zinc-800 py-2 outline-none focus:border-white transition text-xs font-bold uppercase tracking-widest"
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-zinc-500">
              <CreditCard className="w-3 h-3" /> Account Number
            </label>
            <input 
              type="text" 
              maxLength={10}
              placeholder="0123456789"
              value={bankDetails.accountNumber}
              onChange={(e) => setBankDetails({...bankDetails, accountNumber: e.target.value.replace(/\D/g, '')})}
              className="w-full bg-transparent border-b border-zinc-800 py-2 outline-none focus:border-white transition text-xs font-bold uppercase tracking-widest"
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-zinc-500">
              <User className="w-3 h-3" /> Account Name
            </label>
            <input 
              type="text" 
              placeholder="NAME ON ACCOUNT"
              value={bankDetails.accountName}
              onChange={(e) => setBankDetails({...bankDetails, accountName: e.target.value})}
              className="w-full bg-transparent border-b border-zinc-800 py-2 outline-none focus:border-white transition text-xs font-bold uppercase tracking-widest"
            />
          </div>
        </div>

        <button 
          type="submit"
          disabled={!canWithdraw || isSubmitting}
          className="w-full py-6 bg-white text-black hover:bg-red-600 hover:text-white rounded-3xl font-black uppercase tracking-[0.3em] text-xs transition-all flex items-center justify-center gap-3 disabled:opacity-20"
        >
          {isSubmitting ? <Loader2 className="animate-spin w-4 h-4" /> : <>Confirm Payout <ArrowRight className="w-4 h-4" /></>}
        </button>
      </form>
    </div>
  );
}