"use client";

import { MessageCircle, Mail, Phone, LifeBuoy, ArrowUpRight } from 'lucide-react';

export default function SupportCenter() {
  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-red-600">
      <div className="max-w-7xl mx-auto px-6 py-24">
        
        {/* Hero Section */}
        <div className="relative mb-32">
          <h1 className="text-8xl md:text-[13rem] font-black italic uppercase tracking-tighter opacity-5 absolute -top-24 -left-4 select-none">
            Direct
          </h1>
          <div className="relative z-10 pt-12">
            <h2 className="text-5xl md:text-8xl font-black italic uppercase tracking-tighter leading-none">
              Get in <br/> <span className="text-red-600">Touch.</span>
            </h2>
            <p className="mt-6 text-zinc-500 max-w-md font-bold uppercase text-[10px] tracking-[0.3em] leading-relaxed">
              Have a question about your design? Our production team is standing by to help you get it right.
            </p>
          </div>
        </div>

        {/* Contact Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: MessageCircle, label: "Live Chat", value: "Instant Reply", desc: "Available 24/7", color: "bg-red-600" },
            { icon: Mail, label: "Email Us", value: "Lab Support", desc: "support@lensra.com", color: "bg-zinc-900/50" },
            { icon: Phone, label: "Call Direct", value: "Talk to us", desc: "+2348051385049", color: "bg-zinc-900/50" },
            { icon: LifeBuoy, label: "Guides", value: "How-To's", desc: "View Tutorials", color: "bg-zinc-900/50" }
          ].map((item, idx) => (
            <div key={idx} className={`${item.color} p-8 rounded-[40px] group hover:-translate-y-2 transition-all duration-500 cursor-pointer border border-transparent hover:border-white/10`}>
              <item.icon className="w-8 h-8 mb-12 group-hover:scale-110 transition-transform" />
              <div>
                <p className="text-[9px] font-black uppercase tracking-widest opacity-60 mb-1">{item.label}</p>
                <p className="text-xl font-black italic uppercase tracking-tight">{item.value}</p>
                <p className="text-[10px] font-bold text-white/40 uppercase mt-2">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-40 space-y-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-zinc-800 pb-10 gap-6">
            <div>
              <h3 className="text-4xl font-black italic uppercase tracking-tighter">Fast Answers</h3>
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600 mt-2">Commonly asked by our community</p>
            </div>
            <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-red-600 hover:text-white transition-colors">
              View All Questions <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
          
          <div className="grid md:grid-cols-2 gap-x-24 gap-y-16">
            {[
              { q: "Where is my order?", a: "Enter your order ID in our tracking portal for live updates." },
              { q: "Can I edit my design?", a: "You have 2 hours to make changes after placing an order." },
              { q: "Do you ship worldwide?", a: "Yes. We deliver to over 50 countries with express tracking." },
              { q: "Need a custom bulk order?", a: "Contact our VIP team for corporate and event pricing." }
            ].map((faq, i) => (
              <div key={i} className="group cursor-pointer">
                <div className="flex items-center gap-4 mb-4">
                    <span className="text-red-600 font-black italic text-xs tracking-widest">0{i+1}</span>
                    <h4 className="font-black uppercase italic text-lg tracking-tight group-hover:text-red-600 transition-colors">
                        {faq.q}
                    </h4>
                </div>
                <p className="text-zinc-500 text-sm font-bold pl-10 leading-relaxed uppercase tracking-tighter">
                    {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Closing Reassurance */}
        <div className="mt-32 p-16 bg-zinc-900/30 rounded-[50px] border border-zinc-800 text-center">
            <h4 className="text-2xl font-black italic uppercase mb-4">Still need help?</h4>
            <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em] mb-8">We usually respond in less than 10 minutes.</p>
            <button className="px-10 py-5 bg-white text-black rounded-full font-black uppercase tracking-widest text-[10px] hover:bg-red-600 hover:text-white transition-all">
                Launch Live Messenger
            </button>
        </div>
      </div>
    </div>
  );
}