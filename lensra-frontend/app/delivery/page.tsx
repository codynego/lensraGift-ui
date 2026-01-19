"use client";

import { motion } from 'framer-motion';
import { Truck, Globe, ShieldCheck, Clock, Zap } from 'lucide-react';

const STEPS = [
  { icon: Zap, title: "Lab Processing", desc: "Custom items enter production within 24 hours of design confirmation." },
  { icon: ShieldCheck, title: "Quality Audit", desc: "Every piece undergoes a Lensra Lab Verified inspection." },
  { icon: Truck, title: "Secure Transit", desc: "Dispatched via premium couriers with real-time encrypted tracking." }
];

export default function DeliveryInfo() {
  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-red-600/30">
      <main className="max-w-7xl mx-auto px-6 py-24">
        <div className="space-y-4 mb-20">
          <div className="flex items-center gap-2 text-red-600">
            <div className="w-12 h-[2px] bg-red-600" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em]">Logistics Protocol</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter leading-none">
            Delivery <br/> Standards.
          </h1>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {STEPS.map((step, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="p-10 bg-zinc-900/50 border border-zinc-800 rounded-[40px] hover:border-red-600/50 transition-colors"
            >
              <step.icon className="w-10 h-10 text-red-600 mb-8" />
              <h3 className="text-xl font-black italic uppercase mb-4">{step.title}</h3>
              <p className="text-zinc-500 text-sm font-bold leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>

        <div className="mt-20 p-12 bg-white text-black rounded-[40px] flex flex-col md:flex-row justify-between items-center gap-8">
          <div>
            <h2 className="text-3xl font-black italic uppercase tracking-tighter">Global Shipping</h2>
            <p className="text-[10px] font-bold uppercase tracking-widest mt-2 opacity-60">Express delivery to 50+ countries</p>
          </div>
          <div className="flex gap-4">
            <div className="px-6 py-3 border-2 border-black rounded-full text-[10px] font-black uppercase">Standard: 5-7 Days</div>
            <div className="px-6 py-3 bg-black text-white rounded-full text-[10px] font-black uppercase italic">Priority: 2-3 Days</div>
          </div>
        </div>
      </main>
    </div>
  );
}