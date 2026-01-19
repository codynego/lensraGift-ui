"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Box, ChevronRight, MapPin, CheckCircle2, Timer, PackageCheck } from 'lucide-react';

const TRACKING_STEPS = [
  { status: "Design Verified", date: "Jan 18, 2026", time: "09:00 AM", location: "Lensra Lab HQ", completed: true },
  { status: "Production Phase", date: "Jan 18, 2026", time: "02:30 PM", location: "Manufacturing Floor", completed: true },
  { status: "Quality Audit", date: "Jan 19, 2026", time: "10:15 AM", location: "Testing Wing", completed: true },
  { status: "In Transit", date: "Processing", time: "--:--", location: "Logistics Hub", completed: false },
  { status: "Out for Delivery", date: "Pending", time: "--:--", location: "Local Station", completed: false },
];

export default function OrderTracking() {
  const [orderId, setOrderId] = useState("");

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans">
      <main className="max-w-4xl mx-auto px-6 py-24">
        
        {/* Header */}
        <div className="mb-16 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-red-600">Live Satellite Tracking</span>
          </div>
          <h1 className="text-6xl md:text-7xl font-black italic uppercase tracking-tighter">
            Track <br/> <span className="text-zinc-500">Shipment.</span>
          </h1>
        </div>

        {/* Search Bar */}
        <div className="relative mb-20 group">
          <input 
            type="text" 
            placeholder="ENTER ORDER ID (E.G. LEN-9920-X)"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            className="w-full bg-zinc-900/50 border-2 border-zinc-800 rounded-3xl px-8 py-8 text-sm font-black uppercase tracking-widest outline-none focus:border-red-600 transition-all group-hover:bg-zinc-900"
          />
          <button className="absolute right-4 top-1/2 -translate-y-1/2 bg-red-600 p-4 rounded-2xl hover:scale-105 transition-transform">
            <Search className="w-6 h-6" />
          </button>
        </div>

        {/* Tracking Visualization */}
        <div className="space-y-12">
          {/* Summary Card */}
          <div className="p-8 bg-zinc-900 border border-zinc-800 rounded-[32px] flex flex-wrap gap-12 items-center">
            <div>
              <p className="text-[9px] font-black uppercase tracking-widest text-zinc-500 mb-1">Current Status</p>
              <p className="text-xl font-black italic uppercase text-red-600">Awaiting Dispatch</p>
            </div>
            <div>
              <p className="text-[9px] font-black uppercase tracking-widest text-zinc-500 mb-1">Estimated Arrival</p>
              <p className="text-xl font-black italic uppercase">Jan 21, 2026</p>
            </div>
            <div className="ml-auto">
                <div className="px-4 py-2 bg-white text-black text-[9px] font-black uppercase tracking-widest rounded-full">
                    Priority Air
                </div>
            </div>
          </div>

          {/* Vertical Timeline */}
          <div className="relative pl-8 space-y-12">
            {/* The Line */}
            <div className="absolute left-[11px] top-2 bottom-2 w-[2px] bg-zinc-800" />

            {TRACKING_STEPS.map((step, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="relative flex gap-8 group"
              >
                {/* Indicator Dot */}
                <div className={`absolute -left-[35px] w-6 h-6 rounded-full border-4 border-[#050505] z-10 transition-colors ${
                  step.completed ? 'bg-red-600' : 'bg-zinc-800'
                }`} />

                <div className="flex-1 pb-4 border-b border-zinc-900 group-last:border-none">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <div>
                      <h3 className={`font-black uppercase italic tracking-tight text-lg ${
                        step.completed ? 'text-white' : 'text-zinc-600'
                      }`}>
                        {step.status}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <MapPin className="w-3 h-3 text-zinc-500" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">{step.location}</span>
                      </div>
                    </div>
                    
                    <div className="text-left md:text-right">
                      <p className={`text-[10px] font-black uppercase tracking-widest ${
                        step.completed ? 'text-zinc-400' : 'text-zinc-700'
                      }`}>
                        {step.date}
                      </p>
                      <p className="text-[10px] font-bold text-zinc-600 uppercase mt-1">{step.time}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-24 p-12 rounded-[40px] border-2 border-dashed border-zinc-900 text-center space-y-6">
            <PackageCheck className="w-12 h-12 text-zinc-800 mx-auto" />
            <p className="text-zinc-500 text-xs font-bold uppercase tracking-[0.2em] max-w-sm mx-auto leading-relaxed">
                Our logistics are synchronized with the 2026 Lab Protocol. Any delays will be communicated via encrypted notification.
            </p>
            <button className="text-[10px] font-black uppercase tracking-[0.4em] text-red-600 hover:text-white transition-colors">
                Contact Dispatch Ops →
            </button>
        </div>
      </main>
    </div>
  );
}