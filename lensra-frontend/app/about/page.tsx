"use client";

import { Target, Heart, Award, Users, Zap, Shield, CheckCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
  const values = [
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Love for Detail",
      desc: "We treat every order like it's for our own family. If it's not perfect, it doesn't leave the shop."
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "Top-Tier Quality",
      desc: "We only use the best inks and fabrics so your designs stay vibrant and never fade away."
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Lightning Fast",
      desc: "Lagos moves fast, and so do we. Design today, and we'll have it ready for you in 24 hours."
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Safe & Secure",
      desc: "Your money and your data are safe with us. We use the most trusted payment systems in Nigeria."
    }
  ];

  return (
    <div className="min-h-screen bg-white text-black font-sans">
      
      {/* 1. HERO: BOLD & LOUD */}
      <section className="bg-zinc-950 text-white py-32 px-6 border-b-[12px] border-red-600 overflow-hidden relative">
        <div className="absolute top-0 right-0 opacity-10 text-[20rem] font-black italic select-none pointer-events-none translate-x-1/4 -translate-y-1/4">
          LENSRA
        </div>
        <div className="max-w-7xl mx-auto relative z-10">
          <h1 className="text-6xl md:text-[10rem] font-black tracking-tighter italic uppercase leading-[0.85] mb-12">
            WE PRINT <br /> <span className="text-red-600">STORYS.</span>
          </h1>
          <p className="text-xl md:text-3xl max-w-2xl font-bold uppercase tracking-tight text-zinc-400">
            Nigeria's most exciting studio for custom gifts. We turn your digital ideas into high-quality physical reality.
          </p>
        </div>
      </section>

      {/* 2. THE STORY: SIMPLE & RAW */}
      <section className="py-24 px-6 border-b border-zinc-100">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-8">
            <span className="text-red-600 font-black uppercase tracking-[0.4em] text-xs">Our Background</span>
            <h2 className="text-5xl font-black italic uppercase tracking-tighter">The Lensra Way</h2>
            <div className="space-y-6 text-zinc-500 font-bold uppercase text-sm leading-relaxed tracking-wide">
              <p>
                Lensra Gifts started with a simple problem: finding a gift that feels personal shouldn't be hard. 
                We hated slow deliveries and boring designs.
              </p>
              <p>
                As Nigeria's first high-speed print platform, we brought professional design tools to your phone. 
                Whether it's a birthday shirt or a corporate mug, we make the process fun and the result premium.
              </p>
              <p className="text-black italic">
                "We don't just print on shirts; we help people share moments."
              </p>
            </div>
          </div>
          <div className="relative group">
            <div className="absolute inset-0 bg-red-600 rounded-[60px] translate-x-4 translate-y-4 group-hover:translate-x-2 group-hover:translate-y-2 transition-transform"></div>
            <div className="bg-zinc-100 rounded-[60px] aspect-square flex items-center justify-center text-[10rem] relative z-10 border-4 border-black">
              🎁
            </div>
          </div>
        </div>
      </section>

      {/* 3. NUMBERS THAT MATTER */}
      <section className="py-20 bg-zinc-50 border-b border-zinc-100">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-12 text-center">
          <StatBox num="10K+" label="Happy People" />
          <StatBox num="50K+" label="Prints Made" />
          <StatBox num="4.9" label="Star Rating" />
          <StatBox num="24H" label="Quick Shipping" />
        </div>
      </section>

      {/* 4. OUR VALUES */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-black italic uppercase tracking-tighter mb-4">What We Stand For</h2>
            <div className="w-24 h-2 bg-red-600 mx-auto"></div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((v, i) => (
              <div key={i} className="p-10 border-2 border-zinc-100 rounded-[40px] hover:border-black transition-all group">
                <div className="text-red-600 mb-6 group-hover:scale-110 transition-transform">{v.icon}</div>
                <h3 className="text-xl font-black uppercase italic mb-4">{v.title}</h3>
                <p className="text-zinc-500 font-bold text-xs uppercase tracking-widest leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. BIG GOALS */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10">
          <div className="bg-black text-white rounded-[50px] p-12">
            <Target className="w-12 h-12 text-red-600 mb-6" />
            <h3 className="text-3xl font-black italic uppercase mb-6">Our Mission</h3>
            <p className="text-zinc-400 font-bold uppercase text-sm leading-loose tracking-widest">
              To make high-quality, personal gifting accessible to every Nigerian. We want to empower you to create products that tell your story without needing a design degree.
            </p>
          </div>
          <div className="bg-red-600 text-white rounded-[50px] p-12">
            <Users className="w-12 h-12 text-white mb-6" />
            <h3 className="text-3xl font-black italic uppercase mb-6">Our Vision</h3>
            <p className="text-red-100 font-bold uppercase text-sm leading-loose tracking-widest">
              To be the #1 creative hub in Africa. We are building a future where anyone can launch a brand or give a world-class gift with just a few clicks.
            </p>
          </div>
        </div>
      </section>

      {/* 6. CALL TO ACTION */}
      <section className="py-32 px-6 bg-zinc-50">
        <div className="max-w-4xl mx-auto text-center space-y-10">
          <h2 className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter">Ready to <br /><span className="text-red-600">Create?</span></h2>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link href="/products" className="px-12 py-6 bg-black text-white rounded-full font-black uppercase text-xs tracking-widest hover:bg-red-600 transition flex items-center justify-center gap-3">
              Start Designing <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/contact" className="px-12 py-6 border-2 border-black text-black rounded-full font-black uppercase text-xs tracking-widest hover:bg-black hover:text-white transition">
              Get in Touch
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

// Small UI Helper
function StatBox({ num, label }: { num: string, label: string }) {
  return (
    <div>
      <div className="text-5xl md:text-7xl font-black italic tracking-tighter text-red-600 mb-2">{num}</div>
      <div className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">{label}</div>
    </div>
  );
}