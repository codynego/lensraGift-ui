"use client";

import { RotateCcw, ShieldAlert, CheckCircle2, FileText } from 'lucide-react';

export default function EasyReturns() {
  return (
    <div className="min-h-screen bg-white text-black">
      <div className="max-w-5xl mx-auto px-6 py-24">
        <header className="text-center space-y-6 mb-24">
          <h1 className="text-7xl md:text-9xl font-black italic uppercase tracking-tighter leading-[0.8]">
            Returns <br/> <span className="text-red-600">&</span> Policy.
          </h1>
          <p className="text-xs font-black uppercase tracking-[0.5em] text-zinc-400">The Lensra Lab Satisfaction Guarantee</p>
        </header>

        <div className="grid gap-4">
          <div className="group p-8 border-b-2 border-zinc-100 flex items-start justify-between hover:bg-zinc-50 transition-all">
            <div className="space-y-2">
              <h2 className="text-2xl font-black italic uppercase">The 14-Day Window</h2>
              <p className="text-sm text-zinc-500 font-bold max-w-md">Items must be returned within 14 days of delivery in original Lab packaging.</p>
            </div>
            <RotateCcw className="w-6 h-6 group-hover:rotate-[-45deg] transition-transform" />
          </div>

          <div className="group p-8 border-b-2 border-zinc-100 flex items-start justify-between hover:bg-zinc-50 transition-all">
            <div className="space-y-2">
              <h2 className="text-2xl font-black italic uppercase text-red-600">Customized Items</h2>
              <p className="text-sm text-zinc-500 font-bold max-w-md">Personalized designs are unique to you. Returns are only accepted for manufacturing defects.</p>
            </div>
            <ShieldAlert className="w-6 h-6" />
          </div>
        </div>

        <div className="mt-24 text-center">
          <button className="px-12 py-6 bg-black text-white rounded-full font-black uppercase tracking-[0.3em] text-[10px] hover:bg-red-600 hover:scale-105 transition-all">
            Initiate Return Portal
          </button>
        </div>
      </div>
    </div>
  );
}