"use client";

import { RotateCcw, ShieldAlert, CheckCircle2, ArrowRight } from 'lucide-react';

export default function EasyReturns() {
  return (
    <div className="min-h-screen bg-white text-black selection:bg-red-600 selection:text-white">
      <div className="max-w-5xl mx-auto px-6 py-24">
        
        {/* Header Section */}
        <header className="text-center space-y-6 mb-32">
          <h1 className="text-7xl md:text-9xl font-black italic uppercase tracking-tighter leading-[0.8]">
            Fair <br/> <span className="text-red-600">Returns.</span>
          </h1>
          <p className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-400">Our commitment to your satisfaction</p>
        </header>

        {/* Policy Grid */}
        <div className="grid gap-6">
          
          {/* Standard Items */}
          <div className="group p-10 border-2 border-zinc-100 rounded-[32px] flex flex-col md:flex-row items-start justify-between hover:border-black transition-all duration-500">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <RotateCcw className="w-5 h-5 text-red-600 group-hover:rotate-[-90deg] transition-transform duration-500" />
                <h2 className="text-2xl font-black italic uppercase">14-Day Guarantee</h2>
              </div>
              <p className="text-sm text-zinc-500 font-bold max-w-md leading-relaxed">
                Not what you expected? Send it back within 14 days. Just keep it in its original Lab packaging and make sure it’s unused.
              </p>
            </div>
            <span className="mt-4 md:mt-0 text-[10px] font-black uppercase tracking-widest bg-zinc-100 px-4 py-2 rounded-full">Standard Items</span>
          </div>

          {/* Custom Items - The Important Part */}
          <div className="group p-10 border-2 border-zinc-100 rounded-[32px] flex flex-col md:flex-row items-start justify-between hover:border-red-600 transition-all duration-500">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <ShieldAlert className="w-5 h-5 text-red-600" />
                <h2 className="text-2xl font-black italic uppercase">Custom Creations</h2>
              </div>
              <p className="text-sm text-zinc-500 font-bold max-w-md leading-relaxed">
                Personalized gifts are made specifically for you. Because of this, we only accept returns if there is a mistake in production or a defect.
              </p>
            </div>
            <span className="mt-4 md:mt-0 text-[10px] font-black uppercase tracking-widest bg-red-50 text-red-600 px-4 py-2 rounded-full">Special Handling</span>
          </div>

          {/* Damage/Defects */}
          <div className="group p-10 border-2 border-zinc-100 rounded-[32px] flex flex-col md:flex-row items-start justify-between hover:border-black transition-all duration-500">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-red-600" />
                <h2 className="text-2xl font-black italic uppercase">Arrival Protection</h2>
              </div>
              <p className="text-sm text-zinc-500 font-bold max-w-md leading-relaxed">
                If your order arrives damaged, we will replace it immediately. Your experience at the Lensra Lab should be nothing less than perfect.
              </p>
            </div>
            <span className="mt-4 md:mt-0 text-[10px] font-black uppercase tracking-widest bg-zinc-100 px-4 py-2 rounded-full">Always Covered</span>
          </div>

        </div>

        {/* Call to Action */}
        <div className="mt-24 text-center space-y-8">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">Need to start a return?</p>
          <button className="group relative px-12 py-6 bg-black text-white rounded-full font-black uppercase tracking-[0.3em] text-[10px] overflow-hidden hover:bg-red-600 transition-all">
            <span className="relative z-10 flex items-center gap-4">
              Open Support Portal <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
            </span>
          </button>
        </div>

      </div>
    </div>
  );
}