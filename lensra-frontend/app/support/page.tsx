"use client";

import { MessageCircle, Mail, Phone, LifeBuoy, Search } from 'lucide-react';

export default function SupportCenter() {
  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <div className="max-w-7xl mx-auto px-6 py-24">
        {/* Hero Section */}
        <div className="relative mb-32">
          <h1 className="text-8xl md:text-[12rem] font-black italic uppercase tracking-tighter opacity-10 absolute -top-20 -left-4 select-none">
            Help
          </h1>
          <div className="relative z-10 pt-12">
            <h2 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter">
              Support <br/> <span className="text-red-600">Center</span>
            </h2>
          </div>
        </div>

        {/* Contact Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: MessageCircle, label: "Live Chat", value: "Active 24/7", color: "bg-red-600" },
            { icon: Mail, label: "Email Lab", value: "support@lensra.com", color: "bg-zinc-800" },
            { icon: Phone, label: "Direct Line", value: "+234 LAB OPS", color: "bg-zinc-800" },
            { icon: LifeBuoy, label: "Resources", value: "Documentation", color: "bg-zinc-800" }
          ].map((item, idx) => (
            <div key={idx} className={`${item.color} p-8 rounded-[32px] space-y-6 hover:-translate-y-2 transition-transform cursor-pointer`}>
              <item.icon className="w-8 h-8" />
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest opacity-70">{item.label}</p>
                <p className="text-sm font-black uppercase italic mt-1">{item.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ Teaser */}
        <div className="mt-32 space-y-12">
          <div className="flex items-end justify-between border-b border-zinc-800 pb-8">
            <h3 className="text-3xl font-black italic uppercase">Common Queries</h3>
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Lensra Lab Knowledge Base</span>
          </div>
          
          <div className="grid md:grid-cols-2 gap-x-20 gap-y-12">
            {[
              "How do I track my custom order?",
              "Can I change my design after confirmation?",
              "What is the Lab Verified standard?",
              "Bulk orders for organizations?"
            ].map((q, i) => (
              <div key={i} className="flex gap-6 group cursor-pointer">
                <span className="text-red-600 font-black italic">0{i+1}</span>
                <p className="font-bold uppercase text-sm tracking-tight group-hover:text-red-600 transition-colors">{q}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}