"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Volume2, Play, Share2, Gift, Loader2, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

const BaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.lensra.com/";

export default function RevealPage() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [gift, setGift] = useState<any>(null);
  const [isRevealed, setIsRevealed] = useState(false);

  // 1. Fetch the Gift Data
  useEffect(() => {
    const fetchGift = async () => {
      try {
        const res = await fetch(`${BaseUrl}api/digital-gifts/gifts/${id}/`);
        if (!res.ok) throw new Error("Gift not found");
        const data = await res.json();
        setGift(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchGift();
  }, [id]);

  const handleReveal = () => {
    setIsRevealed(true);
    // Trigger Confetti
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#dc2626', '#f472b6', '#ffffff']
    });
  };

  if (loading) return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center">
      <Loader2 className="w-10 h-10 text-red-600 animate-spin" />
    </div>
  );

  if (!gift) return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center text-white">
      <p className="font-black uppercase tracking-widest">Message not found</p>
    </div>
  );

  // Dynamic Theme based on occasion (Love, Birthday, etc.)
  const isLove = gift.occasion_name?.toLowerCase().includes('love');

  return (
    <div className={`min-h-screen relative overflow-hidden flex flex-col items-center justify-center p-6 ${isLove ? 'bg-zinc-950' : 'bg-[#050505]'}`}>
      
      {/* Background Glow */}
      <div className={`absolute inset-0 opacity-20 blur-[120px] pointer-events-none ${isLove ? 'bg-red-600' : 'bg-zinc-500'}`} />

      <AnimatePresence mode="wait">
        {!isRevealed ? (
          /* --- UNREVEALED STATE (The "Hook") --- */
          <motion.div 
            key="envelope"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: -100, rotate: -5 }}
            className="z-10 text-center space-y-8"
          >
            <div className="relative group cursor-pointer" onClick={handleReveal}>
               <motion.div 
                 animate={{ y: [0, -10, 0] }} 
                 transition={{ repeat: Infinity, duration: 3 }}
                 className="w-64 h-80 bg-zinc-900 border-2 border-zinc-800 rounded-[40px] flex flex-col items-center justify-center shadow-2xl relative z-10"
               >
                 <Sparkles className="w-12 h-12 text-red-600 mb-4 animate-pulse" />
                 <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500">For {gift.recipient_name}</p>
               </motion.div>
               {/* Decorative Stack */}
               <div className="absolute top-4 left-4 w-full h-full bg-zinc-800/50 rounded-[40px] -z-10 translate-x-2 translate-y-2" />
            </div>

            <button 
              onClick={handleReveal}
              className="px-12 py-5 bg-white text-black rounded-full text-[10px] font-black uppercase tracking-widest hover:scale-110 transition-transform active:scale-95"
            >
              Tap to Reveal
            </button>
          </motion.div>
        ) : (
          /* --- REVEALED STATE (The "Magic") --- */
          <motion.div 
            key="content"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="z-10 max-w-2xl w-full space-y-12 text-center"
          >
            <header className="space-y-2">
              <motion.span 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
                className="text-red-600 text-[10px] font-black uppercase tracking-[0.5em]"
              >
                A Special {gift.occasion_name} Gift
              </motion.span>
              <h1 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter text-white">
                From {gift.sender_name}
              </h1>
            </header>

            {/* Main Message Display */}
            <div className="bg-zinc-900/50 backdrop-blur-xl border border-white/5 p-10 md:p-16 rounded-[60px] shadow-2xl">
              
              {/* Voice Message Player (If exists) */}
              {gift.voice_message && (
                <div className="mb-10 flex flex-col items-center gap-4 p-6 bg-red-600/10 rounded-[32px] border border-red-600/20">
                  <div className="flex items-center gap-3">
                    <Volume2 className="text-red-600 w-5 h-5" />
                    <span className="text-[10px] font-black uppercase text-red-600">Audio Message</span>
                  </div>
                  <audio controls className="w-full h-10 accent-red-600">
                    <source src={gift.voice_message} type="audio/mpeg" />
                  </audio>
                </div>
              )}

              {/* Text Message */}
              <motion.p 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
                className="text-2xl md:text-3xl font-medium leading-relaxed text-zinc-100 italic"
              >
                "{gift.text_message}"
              </motion.p>
            </div>

            {/* Reactions & CTAs */}
            <motion.div 
               initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
               className="flex flex-col items-center gap-8"
            >
              <div className="flex gap-4">
                <button className="p-6 bg-zinc-900 border border-zinc-800 rounded-full hover:bg-white hover:text-black transition-all">
                  <Heart className="w-6 h-6" />
                </button>
                <button 
                  onClick={() => navigator.share({ title: 'Lensra Gift', url: window.location.href })}
                  className="p-6 bg-zinc-900 border border-zinc-800 rounded-full hover:bg-white hover:text-black transition-all"
                >
                  <Share2 className="w-6 h-6" />
                </button>
              </div>

              {/* Reciprocate Loop */}
              <div className="pt-12 border-t border-zinc-900 w-full">
                <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-6">Want to send a moment of magic?</p>
                <a 
                  href="/create" 
                  className="inline-flex items-center gap-3 px-10 py-6 bg-red-600 text-white rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-red-700 transition-all shadow-xl shadow-red-600/20"
                >
                  Send a Gift Back <Gift className="w-4 h-4" />
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Background Particles Decoration */}
      <div className="absolute top-0 left-0 w-full h-full -z-10 overflow-hidden opacity-30 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-white rounded-full"
            style={{
              width: Math.random() * 4,
              height: Math.random() * 4,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 5 + Math.random() * 5,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>
    </div>
  );
}