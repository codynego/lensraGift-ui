"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, ArrowRight, Play, MessageSquare, 
  Calendar, CreditCard, Video, Mic, 
  CheckCircle2, Lock, ChevronDown, Smartphone
} from 'lucide-react';

export default function LensraHome() {
  const [revealed, setRevealed] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-red-600">
      
      {/* 1. HERO SECTION */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="h-full w-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]" />
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 text-center space-y-8"
        >
          <div className="inline-flex items-center gap-3 px-4 py-2 border border-red-600/30 rounded-full bg-red-600/5 mb-4">
            <div className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
            <span className="text-[9px] font-black uppercase tracking-[0.4em] text-red-600">New Gifting Protocol</span>
          </div>

          <h1 className="text-7xl md:text-9xl font-black italic uppercase tracking-tighter leading-[0.8]">
            Your Words. <br/> <span className="text-zinc-800 text-6xl md:text-8xl">Their Surprise.</span>
          </h1>
          
          <p className="max-w-xl mx-auto text-zinc-500 font-bold uppercase text-[10px] tracking-[0.3em] leading-relaxed">
            Send a message they’ll unwrap, reveal, and remember — digitally or with a premium QR scan card.
          </p>

          {/* Interactive Demo Card */}
          <div className="pt-12 relative max-w-sm mx-auto group">
            <motion.div 
              whileHover={{ scale: 1.02 }}
              onClick={() => setRevealed(!revealed)}
              className="aspect-[4/3] bg-zinc-900 border-2 border-zinc-800 rounded-[32px] overflow-hidden cursor-pointer relative shadow-2xl transition-all group-hover:border-red-600/50"
            >
              <AnimatePresence mode="wait">
                {!revealed ? (
                  <motion.div 
                    key="closed"
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center"
                  >
                    <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mb-6 animate-bounce">
                      <Sparkles className="text-white" />
                    </div>
                    <p className="text-xs font-black uppercase tracking-widest">Click to reveal</p>
                  </motion.div>
                ) : (
                  <motion.div 
                    key="open"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute inset-0 bg-white flex flex-col items-center justify-center p-8 text-black"
                  >
                    <p className="text-2xl font-black italic uppercase tracking-tighter">"I Love You!"</p>
                    <p className="mt-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Message Unlocked</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-48 h-12 bg-red-600/20 blur-2xl rounded-full -z-10" />
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
            <button className="px-10 py-6 bg-white text-black rounded-full font-black uppercase tracking-widest text-[10px] hover:bg-red-600 hover:text-white transition-all shadow-xl shadow-white/5">
              Create Your Gift
            </button>
            <button className="px-10 py-6 border-2 border-zinc-800 rounded-full font-black uppercase tracking-widest text-[10px] flex items-center gap-3 hover:bg-zinc-900 transition-all">
              <Play className="w-3 h-3 fill-current" /> See How it Works
            </button>
          </div>
        </motion.div>
      </section>

      {/* 2. THE EMOTIONAL STORY */}
      <section className="py-32 px-6 bg-zinc-900/30">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-8">
            <h2 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter">
              Gifts That <br/> <span className="text-red-600">Speak.</span>
            </h2>
            <div className="space-y-6 text-zinc-400 font-bold uppercase text-xs tracking-widest leading-loose">
              <p>No more boring links or generic texts. We build digital experiences that feel magical.</p>
              <p>Add your voice, video, and personal touch to a gift they can hold or scan instantly.</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="aspect-[3/4] bg-zinc-800 rounded-[40px] border border-white/5 overflow-hidden rotate-[-2deg] shadow-2xl">
               <div className="p-6 flex flex-col h-full justify-between">
                  <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center"><Mic className="w-4 h-4"/></div>
                  <p className="text-[10px] font-black uppercase tracking-widest">"Tears of joy!"</p>
               </div>
            </div>
            <div className="aspect-[3/4] bg-zinc-800 rounded-[40px] border border-white/5 overflow-hidden translate-y-12 rotate-[2deg] shadow-2xl">
               <div className="p-6 flex flex-col h-full justify-between bg-gradient-to-b from-red-600/20 to-transparent">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-black"><Video className="w-4 h-4"/></div>
                  <p className="text-[10px] font-black uppercase tracking-widest">"Best gift ever!"</p>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. QUICK FLOW */}
      <section className="py-32 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-20 space-y-4">
          <h2 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter">3 Steps to a Smile</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { step: "01", title: "Pick Occasion", icon: Sparkles, desc: "Love, Birthday, or Surprise" },
            { step: "02", title: "Add Content", icon: MessageSquare, desc: "Text, Voice, or Video" },
            { step: "03", title: "Send Reveal", icon: Smartphone, desc: "Digital or Physical QR Card" }
          ].map((item, idx) => (
            <div key={idx} className="bg-zinc-900 p-12 rounded-[40px] border border-zinc-800 space-y-6 hover:border-red-600 transition-colors group">
              <span className="text-red-600 font-black italic tracking-widest">{item.step}</span>
              <item.icon className="w-8 h-8 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-black italic uppercase">{item.title}</h3>
              <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">{item.desc}</p>
              <button className="pt-4 text-xs font-black uppercase tracking-widest flex items-center gap-2 group-hover:gap-4 transition-all">
                Start Now <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* 4. FEATURE SHOWCASE */}
      <section className="py-32 px-6 bg-white text-black rounded-[60px]">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter mb-20">Enhance it.</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-12">
            {[
              { title: "Animations", icon: Sparkles, desc: "Bring your reveal to life" },
              { title: "Scheduling", icon: Calendar, desc: "Perfect timing, every time" },
              { title: "QR Cards", icon: CreditCard, desc: "A tactile physical surprise" },
              { title: "Mixed Media", icon: Video, desc: "Video, Voice & Text together" }
            ].map((f, i) => (
              <div key={i} className="space-y-4">
                <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center text-white"><f.icon className="w-5 h-5"/></div>
                <h4 className="text-lg font-black italic uppercase tracking-tight">{f.title}</h4>
                <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. LIMITED OFFER */}
      <section className="py-32 px-6 text-center">
        <div className="max-w-3xl mx-auto bg-zinc-900 border border-red-600/20 p-16 rounded-[50px] space-y-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10"><Sparkles className="w-32 h-32 text-red-600"/></div>
          <h2 className="text-4xl font-black italic uppercase tracking-tighter">Try a Free Gift</h2>
          <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Limited to the first 100 gifts this month</p>
          <button className="bg-red-600 text-white px-12 py-6 rounded-full font-black uppercase tracking-widest text-[10px] hover:bg-white hover:text-black transition-all">
            Create Free Gift
          </button>
        </div>
      </section>

      {/* 8. FAQ SECTION */}
      <section className="py-32 px-6 max-w-3xl mx-auto space-y-12">
        <h3 className="text-3xl font-black italic uppercase text-center mb-16 underline decoration-red-600">Common Questions</h3>
        {[
          { q: "How is it delivered?", a: "Instantly via a unique secure link or through a physical premium card sent to their door." },
          { q: "Can I schedule it?", a: "Yes. Set the exact time and date for the digital reveal." },
          { q: "Is it private?", a: "Your messages are encrypted and only accessible to the person with the link or card." }
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
        <button className="w-full bg-red-600 text-white py-6 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] shadow-2xl flex items-center justify-center gap-3">
          Create Gift Now <ArrowRight className="w-4 h-4"/>
        </button>
      </div>

    </div>
  );
}