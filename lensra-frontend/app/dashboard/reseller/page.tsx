"use client";

import { useState, useEffect } from 'react';
import { 
  Wallet, ArrowUpRight, ArrowDownLeft, 
  Clock, CheckCircle2, AlertCircle, 
  LayoutDashboard, History, Banknote, Loader2,
  Link
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function ResellerDashboard() {
  const { token } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
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
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <Loader2 className="w-8 h-8 animate-spin text-red-600" />
    </div>
  );

  return (
    <div className="min-h-screen bg-white text-zinc-900 font-sans p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter leading-none">
              Partner <br /> <span className="text-red-600">Dashboard</span>
            </h1>
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-400 mt-4">
              Welcome back, {data?.business_name || 'Reseller'}
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <StatusBadge status={data?.status} />
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* MAIN WALLET CARD */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-black rounded-[40px] p-10 text-white relative overflow-hidden">
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 bg-zinc-800 rounded-full flex items-center justify-center">
                    <Wallet className="w-5 h-5 text-red-500" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Total Wallet Balance</span>
                </div>
                
                <h2 className="text-6xl md:text-7xl font-black italic tracking-tighter mb-10">
                  ₦{parseFloat(data?.wallet_balance || 0).toLocaleString()}
                </h2>

                <div className="flex flex-wrap gap-4">
                  <button className="px-8 py-4 bg-red-600 rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-white hover:text-black transition-all flex items-center gap-2">
                    <Banknote className="w-4 h-4" /> Withdraw Funds
                  </button>
                  <button className="px-8 py-4 bg-zinc-800 rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-zinc-700 transition-all">
                    <Link href="/dashboard/orders">Order History</Link>
                  </button>
                </div>
              </div>
              <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/20 blur-[100px]" />
            </div>

            {/* TRANSACTION HISTORY */}
            <div>
              <div className="flex items-center justify-between mb-6 px-4">
                <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                  <History className="w-4 h-4 text-red-600" /> Recent Activity
                </h3>
              </div>
              
              <div className="space-y-3">
                {data?.transactions?.length > 0 ? (
                  data.transactions.map((tx: any) => (
                    <TransactionRow key={tx.id} tx={tx} />
                  ))
                ) : (
                  <div className="p-12 border-2 border-dashed border-zinc-100 rounded-[32px] text-center">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">No transactions yet. Start selling to earn cashback!</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* SIDEBAR STATS */}
          <div className="space-y-6">
            <StatBox 
              label="Commission Rate" 
              value="5%" 
              sub="Flat on all orders" 
            />
            <StatBox 
              label="Pending Payouts" 
              value={`₦${parseFloat(data?.pending_balance || 0).toLocaleString()}`} 
              sub="From processing orders" 
            />
            <div className="bg-zinc-50 rounded-[32px] p-8 border border-zinc-100">
              <h4 className="text-[10px] font-black uppercase tracking-widest mb-6">Partner Tips</h4>
              <ul className="space-y-4">
                <Tip text="Share direct product links to track sales." />
                <Tip text="Bulk orders for yourself qualify for cashback." />
                <Tip text="Withdrawals are processed every Tuesday." />
              </ul>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

// HELPERS
function StatusBadge({ status }: { status: string }) {
  const colors: any = {
    'APPROVED': 'bg-green-50 text-green-600 border-green-100',
    'PENDING': 'bg-amber-50 text-amber-600 border-amber-100',
    'REJECTED': 'bg-red-50 text-red-600 border-red-100'
  };
  return (
    <div className={`px-4 py-2 rounded-full border text-[9px] font-black uppercase tracking-widest ${colors[status] || colors.PENDING}`}>
      {status || 'PENDING'}
    </div>
  );
}

function TransactionRow({ tx }: { tx: any }) {
  const isCashback = tx.transaction_type === 'CASHBACK';
  return (
    <div className="flex items-center justify-between p-6 bg-white border border-zinc-100 rounded-3xl hover:border-zinc-200 transition-all">
      <div className="flex items-center gap-4">
        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${isCashback ? 'bg-green-50 text-green-600' : 'bg-zinc-50 text-zinc-400'}`}>
          {isCashback ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
        </div>
        <div>
          <p className="text-[11px] font-black uppercase tracking-tight">{tx.description}</p>
          <p className="text-[9px] font-bold text-zinc-400 uppercase mt-1">{new Date(tx.timestamp).toLocaleDateString()}</p>
        </div>
      </div>
      <div className={`text-sm font-black italic tracking-tighter ${isCashback ? 'text-green-600' : 'text-zinc-900'}`}>
        {isCashback ? '+' : '-'}₦{parseFloat(tx.amount).toLocaleString()}
      </div>
    </div>
  );
}

function StatBox({ label, value, sub }: { label: string, value: string, sub: string }) {
  return (
    <div className="bg-white border border-zinc-100 rounded-[32px] p-8">
      <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400 mb-2">{label}</p>
      <h4 className="text-3xl font-black italic tracking-tighter mb-1">{value}</h4>
      <p className="text-[9px] font-bold text-zinc-400 uppercase">{sub}</p>
    </div>
  );
}

function Tip({ text }: { text: string }) {
  return (
    <li className="flex gap-3 text-[10px] font-bold text-zinc-500 uppercase leading-relaxed">
      <CheckCircle2 className="w-4 h-4 text-red-600 flex-shrink-0" />
      {text}
    </li>
  );
}