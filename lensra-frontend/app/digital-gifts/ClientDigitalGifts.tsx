// app/digital-gifts/ClientDigitalGifts.tsx
// Client component for interactivity

"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles, ArrowRight, Play, MessageSquare,
  Calendar, CreditCard, Video, Mic,
  CheckCircle2, Lock, ChevronDown, Smartphone
} from 'lucide-react';

export default function ClientDigitalGifts() {
  const [revealed, setRevealed] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-red-600">
    
      {/* 1. HERO SECTION - Made layout cleaner, added subtle parallax bg */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="h-full w-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center space-y-8 max-w-4xl"
        >
          <div className="inline-flex items-center gap-3 px-4 py-2 border border-red-600/30 rounded-full bg-red-600/5 mb-4">
            <div className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
            <span className="text-[9px] font-black uppercase tracking-[0.4em] text-red-600">New Way to Gift</span>
          </div>

          <h1 className="text-7xl md:text-9xl font-black italic uppercase tracking-tighter leading-[0.8]">
            Send Words. <br/> <span className="text-zinc-800 text-6xl md:text-8xl">Create Joy.</span>
          </h1>
          
          <p className="max-w-xl mx-auto text-zinc-500 font-bold uppercase text-[10px] tracking-[0.3em] leading-relaxed">
            Forget plain texts. Add voice or video to your message. They open it with a simple link or QR card.
          </p>

          {/* Interactive Demo Card - Added accessibility and smooth transitions */}
          <div className="pt-12 relative max-w-sm mx-auto group">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setRevealed(!revealed)}
              className="aspect-[4/3] bg-zinc-900 border-2 border-zinc-800 rounded-[32px] overflow-hidden cursor-pointer relative shadow-2xl transition-all group-hover:border-red-600/50 group-hover:shadow-red-600/20"
              aria-label="Tap to see demo"
            >
              <AnimatePresence mode="wait">
                {!revealed ? (
                  <motion.div
                    key="closed"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center"
                  >
                    <motion.div
                      animate={{ y: [0, -10, 0] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mb-6"
                    >
                      <Sparkles className="text-white" />
                    </motion.div>
                    <p className="text-xs font-black uppercase tracking-widest">Tap to Open Your Message</p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="open"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200 }}
                    className="absolute inset-0 bg-white flex flex-col items-center justify-center p-8 text-black"
                  >
                    <p className="text-2xl font-black italic uppercase tracking-tighter">"I Love You!"</p>
                    <p className="mt-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Your Message Appears Here</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-48 h-12 bg-red-600/20 blur-2xl rounded-full -z-10" />
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
            <a href="/digital-gifts/create">
            <button className="px-10 py-6 bg-white text-black rounded-full font-black uppercase tracking-widest text-[10px] hover:bg-red-600 hover:text-white transition-all shadow-xl shadow-white/5">
              Create Your Gift Now
            </button>
            </a>
            <button className="px-10 py-6 border-2 border-zinc-800 rounded-full font-black uppercase tracking-widest text-[10px] flex items-center gap-3 hover:bg-zinc-900 transition-all">
              <Play className="w-3 h-3 fill-current" /> Watch Demo
            </button>
          </div>
        </motion.div>
      </section>

      {/* 2. THE EMOTIONAL STORY - Simplified layout, clearer emotional pull */}
      <section className="py-32 px-6 bg-zinc-900/30">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-8">
            <h2 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter">
              Gifts That <br/> <span className="text-red-600">Make People Smile.</span>
            </h2>
            <div className="space-y-6 text-zinc-400 font-bold uppercase text-xs tracking-widest leading-loose">
              <p>Not just text. Add your voice or video to show real feelings.</p>
              <p>It's simple to share love in a special way.</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="aspect-[3/4] bg-zinc-800 rounded-[40px] border border-white/5 overflow-hidden rotate-[-2deg] shadow-2xl">
              <div className="p-6 flex flex-col h-full justify-between">
                <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center"><Mic className="w-4 h-4"/></div>
                <p className="text-[10px] font-black uppercase tracking-widest">"Happy Tears!"</p>
              </div>
            </div>
            <div className="aspect-[3/4] bg-zinc-800 rounded-[40px] border border-white/5 overflow-hidden translate-y-12 rotate-[2deg] shadow-2xl">
              <div className="p-6 flex flex-col h-full justify-between bg-gradient-to-b from-red-600/20 to-transparent">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-black"><Video className="w-4 h-4"/></div>
                <p className="text-[10px] font-black uppercase tracking-widest">"Best Ever!"</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. QUICK FLOW - Made steps shorter and direct */}
      <section className="py-32 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-20 space-y-4">
          <h2 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter">3 Simple Steps</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { step: "01", title: "Choose Occasion", icon: Sparkles, desc: "Pick love, birthday, or surprise" },
            { step: "02", title: "Add Message", icon: MessageSquare, desc: "Use text, voice, or video" },
            { step: "03", title: "Share It", icon: Smartphone, desc: "Send link or QR card" }
          ].map((item, idx) => (
            <motion.div 
              key={idx} 
              className="bg-zinc-900 p-12 rounded-[40px] border border-zinc-800 space-y-6 hover:border-red-600 transition-colors group"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.2 }}
            >
              <span className="text-red-600 font-black italic tracking-widest">{item.step}</span>
              <item.icon className="w-8 h-8 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-black italic uppercase">{item.title}</h3>
              <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">{item.desc}</p>
              <button className="pt-4 text-xs font-black uppercase tracking-widest flex items-center gap-2 group-hover:gap-4 transition-all">
                Start <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 4. FEATURE SHOWCASE - Simplified descriptions */}
      <section className="py-32 px-6 bg-white text-black rounded-[60px]">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter mb-20">Make It Yours.</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-12">
            {[
              { title: "Fun Effects", icon: Sparkles, desc: "Add excitement when they open it" },
              { title: "Pick Time", icon: Calendar, desc: "Choose when it opens" },
              { title: "Real Cards", icon: CreditCard, desc: "Get a printed QR card" },
              { title: "Add Media", icon: Video, desc: "Mix text, voice, video" }
            ].map((f, i) => (
              <motion.div 
                key={i} 
                className="space-y-4"
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center text-white"><f.icon className="w-5 h-5"/></div>
                <h4 className="text-lg font-black italic uppercase tracking-tight">{f.title}</h4>
                <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. LIMITED OFFER - Clear call to action */}
      <section className="py-32 px-6 text-center">
        <div className="max-w-3xl mx-auto bg-zinc-900 border border-red-600/20 p-16 rounded-[50px] space-y-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10"><Sparkles className="w-32 h-32 text-red-600"/></div>
          <h2 className="text-4xl font-black italic uppercase tracking-tighter">Try Free Now</h2>
          <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Limited to first 100 this month</p>
          <button className="bg-red-600 text-white px-12 py-6 rounded-full font-black uppercase tracking-widest text-[10px] hover:bg-white hover:text-black transition-all">
            Get Free Gift
          </button>
        </div>
      </section>

      {/* 8. FAQ SECTION - Easy to read */}
      <section className="py-32 px-6 max-w-3xl mx-auto space-y-12">
        <h3 className="text-3xl font-black italic uppercase text-center mb-16 underline decoration-red-600">Common Questions</h3>
        {[
          { q: "How do I send the gift?", a: "Share a link or mail a QR card to their home." },
          { q: "Can I choose when it opens?", a: "Yes, set the exact time it reveals." },
          { q: "Is my message private?", a: "Yes, only the receiver can see it." }
        ].map((faq, i) => (
          <div key={i} className="border-b border-zinc-800 pb-6">
            <button
              onClick={() => setActiveFaq(activeFaq === i ? null : i)}
              className="w-full flex justify-between items-center text-left"
            >
              <span className="font-black uppercase italic tracking-tight">{faq.q}</span>
              <ChevronDown className={`w-5 h-5 transition-transform ${activeFaq === i ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
              {activeFaq === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <p className="pt-4 text-zinc-500 text-[10px] font-bold uppercase tracking-widest leading-relaxed">
                    {faq.a}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </section>

      {/* 9. STICKY BOTTOM CTA */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-md z-[100] sm:hidden">
      <a href="/digital-gifts/create">
        <button className="w-full bg-red-600 text-white py-6 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] shadow-2xl flex items-center justify-center gap-3">
          Create Gift <ArrowRight className="w-4 h-4"/>
        </button>
      </a>
      </div>

    </div>
  );
}