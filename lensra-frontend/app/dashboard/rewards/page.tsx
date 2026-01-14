"use client";

import { useState, useEffect, useCallback } from 'react';
import { 
  Star, Gift, History, ArrowUpRight, ArrowDownLeft,
  Ticket, ShoppingBag, ShieldCheck, Zap, Loader2,
  Package, Copy, CheckCircle2, AlertCircle, ChevronDown
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const BaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000/";

interface Perk {
  id: number;
  title: string;
  description: string;
  point_cost: number;
  icon_name: string;
}

interface Transaction {
  id: number;
  amount: number;
  description: string;
  transaction_type: 'earned' | 'redeemed';
  created_at: string;
  coupon_code?: string; // Integrated backend field
  is_used?: boolean;    // Integrated backend field
}

export default function RewardCenter() {
  const { token, isAuthenticated } = useAuth();
  const [points, setPoints] = useState<number>(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [perks, setPerks] = useState<Perk[]>([]);
  const [loading, setLoading] = useState(true);
  const [redeemingId, setRedeemingId] = useState<number | null>(null);
  const [expandedTx, setExpandedTx] = useState<number | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const fetchInitialData = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const [dashRes, perksRes] = await Promise.all([
        fetch(`${BaseUrl}api/rewards/dashboard/`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${BaseUrl}api/rewards/perks/`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      const dashData = await dashRes.json();
      const perksRawData = await perksRes.json();
      const perksArray = Array.isArray(perksRawData) ? perksRawData : (perksRawData.results || []);

      setPoints(dashData.points || 0);
      setTransactions(dashData.transactions || []);
      setPerks(perksArray);
    } catch (err) {
      console.error("Failed to sync rewards data", err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (isAuthenticated && token) fetchInitialData();
  }, [isAuthenticated, token, fetchInitialData]);

  const handleRedeem = async (perk: Perk) => {
    if (points < perk.point_cost || redeemingId !== null) return;
    if (!window.confirm(`Redeem ${perk.point_cost} points for ${perk.title}?`)) return;

    setRedeemingId(perk.id);
    try {
      const response = await fetch(`${BaseUrl}api/rewards/redeem/${perk.id}/`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        await fetchInitialData(); // This will now include the new transaction with its coupon
      } else {
        const error = await response.json();
        alert(error.error || "Redemption failed");
      }
    } catch (err) {
      alert("System error during redemption");
    } finally {
      setRedeemingId(null);
    }
  };

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const getIcon = (name: string) => {
    switch (name?.toLowerCase()) {
      case 'zap': return <Zap className="w-5 h-5" />;
      case 'ticket': return <Ticket className="w-5 h-5" />;
      case 'shoppingbag': return <ShoppingBag className="w-5 h-5" />;
      case 'package': return <Package className="w-5 h-5" />;
      case 'shieldcheck': return <ShieldCheck className="w-5 h-5" />;
      case 'star': return <Star className="w-5 h-5" />;
      default: return <Gift className="w-5 h-5" />;
    }
  };

  if (loading && perks.length === 0) {
    return (
      <div className="h-96 flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-red-600" />
        <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Syncing Rewards...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* 1. BALANCE HEADER */}
      <section className="bg-zinc-900 rounded-[32px] p-8 md:p-12 relative overflow-hidden text-white shadow-2xl">
        <div className="absolute right-0 top-0 w-1/3 h-full bg-red-600/10 blur-[100px] rounded-full" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div>
            <span className="text-red-500 font-bold text-[10px] uppercase tracking-[0.4em] mb-4 block">Loyalty Program</span>
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight uppercase leading-none">
              Reward <span className="text-zinc-500">Center</span><span className="text-red-600">.</span>
            </h1>
          </div>
          <div className="bg-zinc-800 border border-zinc-700 px-8 py-6 rounded-[24px] flex items-center gap-6">
            <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center">
              <Star className="w-6 h-6 fill-white text-white" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Available Points</p>
              <p className="text-4xl font-black italic tracking-tighter">{points.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. REDEEMABLE PERKS */}
      <section>
        <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-[0.3em] mb-8">Available Perks</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {perks.map((perk) => (
            <div key={perk.id} className="group bg-white p-8 rounded-[32px] border border-zinc-200 hover:border-black transition-all">
              <div className="w-12 h-12 bg-zinc-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-red-600 group-hover:text-white transition-colors">
                {getIcon(perk.icon_name)}
              </div>
              <h3 className="text-lg font-bold uppercase mb-2">{perk.title}</h3>
              <p className="text-zinc-400 text-[10px] font-bold uppercase tracking-wider mb-6 min-h-[32px]">{perk.description}</p>
              <button 
                onClick={() => handleRedeem(perk)}
                disabled={points < perk.point_cost || redeemingId !== null}
                className={`w-full py-4 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
                  points >= perk.point_cost ? 'bg-zinc-900 text-white hover:bg-red-600' : 'bg-zinc-100 text-zinc-400 cursor-not-allowed'
                }`}
              >
                {redeemingId === perk.id ? <Loader2 className="w-4 h-4 animate-spin" /> : points >= perk.point_cost ? `Redeem for ${perk.point_cost} pts` : `Need ${perk.point_cost - points} more pts`}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* 3. POINT HISTORY & COUPON STORAGE */}
      <section className="bg-white rounded-[32px] border border-zinc-200 overflow-hidden">
        <div className="p-8 border-b border-zinc-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <History className="w-4 h-4 text-red-600" />
            <h3 className="font-bold uppercase text-xs tracking-widest">Points History</h3>
          </div>
          <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest italic">Click redeemed items to reveal codes</span>
        </div>

        <div className="divide-y divide-zinc-50">
          {transactions.length > 0 ? (
            transactions.map((item) => (
              <div key={item.id} className="group">
                <div 
                  onClick={() => item.coupon_code && setExpandedTx(expandedTx === item.id ? null : item.id)}
                  className={`p-6 flex items-center justify-between hover:bg-zinc-50/50 transition-colors ${item.coupon_code ? 'cursor-pointer' : 'cursor-default'}`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${item.transaction_type === 'earned' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                      {item.transaction_type === 'earned' ? <ArrowUpRight className="w-5 h-5" /> : <Ticket className="w-5 h-5" />}
                    </div>
                    <div>
                      <p className="text-[11px] font-bold uppercase flex items-center gap-2">
                        {item.description}
                        {item.coupon_code && <ChevronDown className={`w-3 h-3 transition-transform ${expandedTx === item.id ? 'rotate-180' : ''}`} />}
                      </p>
                      <p className="text-[9px] text-zinc-400 font-bold uppercase tracking-widest">{new Date(item.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <span className={`text-sm font-black ${item.transaction_type === 'earned' ? 'text-emerald-600' : 'text-red-600'}`}>
                    {item.amount > 0 ? `+${item.amount}` : item.amount}
                  </span>
                </div>

                {/* EXPANDABLE COUPON VIEW */}
                {expandedTx === item.id && item.coupon_code && (
                  <div className="px-6 pb-6 animate-in slide-in-from-top-2 duration-300">
                    <div className="bg-zinc-900 rounded-2xl p-6 text-white flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
                      <div className="absolute left-0 top-0 h-full w-1 bg-red-600" />
                      <div className="flex items-center gap-4">
                        <div className="hidden sm:flex w-12 h-12 bg-zinc-800 rounded-full items-center justify-center">
                          <Ticket className="w-6 h-6 text-red-500" />
                        </div>
                        <div>
                          <p className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.3em] mb-1">Coupon Reward</p>
                          <p className="text-2xl font-mono font-bold tracking-widest">{item.coupon_code}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 w-full md:w-auto">
                        <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${item.is_used ? 'border-zinc-800 text-zinc-600' : 'border-emerald-500/30 text-emerald-400 bg-emerald-500/5'}`}>
                          {item.is_used ? <AlertCircle className="w-3 h-3" /> : <CheckCircle2 className="w-3 h-3" />}
                          <span className="text-[9px] font-black uppercase tracking-widest">{item.is_used ? 'Used' : 'Active'}</span>
                        </div>
                        {!item.is_used && (
                          <button 
                            onClick={(e) => { e.stopPropagation(); copyToClipboard(item.coupon_code!); }}
                            className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white text-black px-5 py-2 rounded-lg font-bold text-[10px] uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all"
                          >
                            {copiedCode === item.coupon_code ? 'Copied!' : <><Copy className="w-3 h-3" /> Copy</>}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="p-12 text-center text-zinc-400 text-[10px] font-bold uppercase tracking-widest">No transactions yet</div>
          )}
        </div>
      </section>
    </div>
  );
}