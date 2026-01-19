"use client";

import { motion } from 'framer-motion';
import { Truck, ShieldCheck, Zap, Globe, PackageCheck } from 'lucide-react';

const STEPS = [
  { 
    icon: Zap, 
    title: "Fast Build", 
    desc: "Your custom order hits the production floor within 24 hours. We don't waste time." 
  },
  { 
    icon: ShieldCheck, 
    title: "Perfect Quality", 
    desc: "Every item is hand-checked by our team. If it isn't perfect, it doesn't ship." 
  },
  { 
    icon: Truck, 
    title: "Secure Travel", 
    desc: "Follow your package from our lab to your door with live, safe tracking." 
  }
];

export default function DeliveryInfo() {
  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-red-600/30">
      <main className="max-w-7xl mx-auto px-6 py-24">
        
        {/* Header Section */}
        <div className="space-y-4 mb-20">
          <div className="flex items-center gap-2 text-red-600">
            <div className="w-12 h-[2px] bg-red-600" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em]">Our Shipping Promise</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter leading-none">
            Built Fast. <br/> <span className="text-zinc-800">Shipped Faster.</span>
          </h1>
          <p className="text-zinc-500 max-w-lg font-bold uppercase text-[10px] tracking-widest leading-relaxed">
            We’ve simplified our shipping to get your custom gifts home as quickly as possible. No delays, just quality.
          </p>
        </div>

        {/* Process Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {STEPS.map((step, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="p-10 bg-zinc-900/40 border border-zinc-800 rounded-[40px] hover:border-red-600/50 transition-all group"
            >
              <step.icon className="w-10 h-10 text-red-600 mb-8 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-black italic uppercase mb-4 tracking-tight">{step.title}</h3>
              <p className="text-zinc-500 text-sm font-medium leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Shipping Rates Banner */}
        <div className="mt-20 p-12 bg-white text-black rounded-[40px] flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-6">
            <div className="hidden md:flex w-16 h-16 bg-black rounded-full items-center justify-center">
                <Globe className="text-white w-8 h-8" />
            </div>
            <div>
              <h2 className="text-3xl font-black italic uppercase tracking-tighter">Worldwide</h2>
              <p className="text-[10px] font-bold uppercase tracking-widest mt-1 opacity-60">We ship to over 50 countries</p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <div className="px-8 py-4 border-2 border-zinc-200 rounded-2xl text-center">
                <p className="text-[8px] font-black uppercase tracking-widest text-zinc-400 mb-1">Standard</p>
                <p className="text-xs font-black uppercase italic">5-7 Days</p>
            </div>
            <div className="px-8 py-4 bg-black text-white rounded-2xl text-center shadow-xl shadow-black/10">
                <p className="text-[8px] font-black uppercase tracking-widest text-zinc-500 mb-1">Express</p>
                <p className="text-xs font-black uppercase italic">2-3 Days</p>
            </div>
          </div>
        </div>

        {/* Footer Confirmation */}
        <div className="mt-24 flex flex-col items-center gap-4 opacity-20">
            <PackageCheck className="w-8 h-8" />
            <p className="text-[9px] font-black uppercase tracking-[0.5em]">Lensra Lab Shipping Protocol</p>
        </div>
      </main>
    </div>
  );
}