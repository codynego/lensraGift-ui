"use client";

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { 
  Wallet, ArrowUpRight, ArrowDownLeft, 
  CheckCircle2, History, Banknote, Loader2,
  ExternalLink, TrendingUp
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function ResellerDashboard() {
  const { token, isAuthenticated } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = useCallback(async () => {
    if (!token) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reseller/dashboard/`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error("Failed to fetch dashboard");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchDashboardData();
    }
  }, [isAuthenticated, fetchDashboardData]);

  if (loading) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center bg-white gap-4">
      <Loader2 className="w-8 h-8 animate-spin text-red-600" />
      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">Loading Dashboard</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-white text-zinc-900 font-sans p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        
        {/* HEADER - Updated to match your specific heading preference */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-zinc-100 pb-10">
          <div>
            <h2 className="text-3xl md:text-5xl font-black uppercase italic tracking-tighter leading-none">
              Partner <span className="text-red-600">Dashboard</span>
            </h2>
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-400 mt-3">
              Account: {data?.business_name || 'Reseller Partner'}
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <StatusBadge status={data?.status} />
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* MAIN WALLET CARD */}
          <div className="lg:col-span-2 space-y-10">
            <div className="bg-zinc-950 rounded-[40px] p-8 md:p-12 text-white relative overflow-hidden shadow-2xl">
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-md">
                    <Wallet className="w-5 h-5 text-red-500" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Current Earnings</span>
                </div>
                
                <h2 className="text-6xl md:text-7xl font-black italic tracking-tighter mb-10">
                  ₦{parseFloat(data?.wallet_balance || 0).toLocaleString()}
                </h2>

                <div className="flex flex-wrap gap-4">
                  <Link 
                    href="/dashboard/reseller/withdraw" 
                    className="px-8 py-4 bg-red-600 rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-white hover:text-black transition-all flex items-center gap-2"
                  >
                    <Banknote className="w-4 h-4" /> Withdraw Funds
                  </Link>
                  <Link 
                    href="/dashboard/orders" 
                    className="px-8 py-4 bg-zinc-800 rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-zinc-700 transition-all flex items-center gap-2"
                  >
                    <History className="w-4 h-4" /> History
                  </Link>
                </div>
              </div>
              {/* Decorative gradient */}
              <div className="absolute -top-24 -right-24 w-80 h-80 bg-red-600/20 blur-[100px] rounded-full" />
            </div>

            {/* TRANSACTION HISTORY */}
            <div>
              <div className="flex items-center justify-between mb-6 px-4">
                <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-2 text-zinc-400">
                  <TrendingUp className="w-4 h-4 text-red-600" /> Recent Activity
                </h3>
              </div>
              
              <div className="space-y-3">
                {data?.transactions?.length > 0 ? (
                  data.transactions.slice(0, 5).map((tx: any) => (
                    <TransactionRow key={tx.id} tx={tx} />
                  ))
                ) : (
                  <div className="p-16 border-2 border-dashed border-zinc-100 rounded-[40px] text-center">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-300">No transactions recorded yet</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* SIDEBAR STATS */}
          <div className="space-y-6">
            <StatBox 
              label="Commission Rate" 
              value={`${data?.commission_rate || '5'}%`} 
              sub="Flat on all verified orders" 
            />
            <StatBox 
              label="Pending Payouts" 
              value={`₦${parseFloat(data?.pending_balance || 0).toLocaleString()}`} 
              sub="In processing / 7-day hold" 
            />
            
            <div className="bg-zinc-50 rounded-[32px] p-8 border border-zinc-100">
              <h4 className="text-[10px] font-black uppercase tracking-widest mb-6 flex items-center gap-2">
                <ExternalLink className="w-3 h-3" /> Partner Resources
              </h4>
              <ul className="space-y-5">
                <Tip text="Withdrawals are processed every Tuesday." />
                <Tip text="Bulk orders qualify for higher cashback." />
                <Tip text="Share unique links to track your sales." />
              </ul>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

// COMPONENTS
function StatusBadge({ status }: { status: string }) {
  const colors: any = {
    'APPROVED': 'bg-green-50 text-green-600 border-green-100',
    'ACTIVE': 'bg-green-50 text-green-600 border-green-100',
    'PENDING': 'bg-amber-50 text-amber-600 border-amber-100',
    'REJECTED': 'bg-red-50 text-red-600 border-red-100'
  };
  return (
    <div className={`px-5 py-2 rounded-full border text-[9px] font-black uppercase tracking-widest ${colors[status] || colors.PENDING}`}>
      {status || 'PENDING'}
    </div>
  );
}

function TransactionRow({ tx }: { tx: any }) {
  const isCashback = tx.transaction_type === 'CASHBACK' || tx.type === 'credit';
  return (
    <div className="flex items-center justify-between p-6 bg-white border border-zinc-100 rounded-[32px] hover:border-red-100 transition-all group">
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${isCashback ? 'bg-green-50 text-green-600' : 'bg-zinc-50 text-zinc-400 group-hover:bg-red-50 group-hover:text-red-600'}`}>
          {isCashback ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
        </div>
        <div>
          <p className="text-[11px] font-black uppercase tracking-tight text-zinc-800">{tx.description || 'Transaction'}</p>
          <p className="text-[9px] font-bold text-zinc-400 uppercase mt-1">
            {tx.timestamp ? new Date(tx.timestamp).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) : 'Recent'}
          </p>
        </div>
      </div>
      <div className={`text-base font-black italic tracking-tighter ${isCashback ? 'text-green-600' : 'text-zinc-900'}`}>
        {isCashback ? '+' : '-'}₦{parseFloat(tx.amount || 0).toLocaleString()}
      </div>
    </div>
  );
}

function StatBox({ label, value, sub }: { label: string, value: string, sub: string }) {
  return (
    <div className="bg-white border border-zinc-100 rounded-[32px] p-8 hover:shadow-xl hover:shadow-zinc-100/50 transition-all">
      <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400 mb-3">{label}</p>
      <h4 className="text-4xl font-black italic tracking-tighter mb-1">{value}</h4>
      <p className="text-[9px] font-bold text-zinc-400 uppercase leading-relaxed">{sub}</p>
    </div>
  );
}

function Tip({ text }: { text: string }) {
  return (
    <li className="flex gap-3 text-[10px] font-bold text-zinc-500 uppercase leading-snug">
      <CheckCircle2 className="w-3 h-3 text-red-600 flex-shrink-0 mt-0.5" />
      {text}
    </li>
  );
}