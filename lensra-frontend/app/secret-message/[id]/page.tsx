"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Volume2, Share2, Gift, Loader2, Sparkles, Crown, Star, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';

const BaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.lensra.com/";

// Tier Styling Engine
const TIER_CONFIG: any = {
  premium: {
    color: "#fbbf24", // Gold
    bg: "from-amber-900/20 to-black",
    border: "border-amber-500/30",
    icon: <Crown className="w-6 h-6 text-amber-500" />,
    label: "Premium Experience",
    shadow: "shadow-amber-500/20",
    particles: ['#fbbf24', '#ffffff', '#f59e0b']
  },
  standard: {
    color: "#3b82f6", // Blue
    bg: "from-blue-900/20 to-black",
    border: "border-blue-500/30",
    icon: <Star className="w-6 h-6 text-blue-500" />,
    label: "Standard Experience",
    shadow: "shadow-blue-500/20",
    particles: ['#3b82f6', '#ffffff', '#60a5fa']
  },
  basic: {
    color: "#ef4444", // Red
    bg: "from-red-900/20 to-black",
    border: "border-red-500/30",
    icon: <Zap className="w-6 h-6 text-red-600" />,
    label: "Basic Experience",
    shadow: "shadow-red-600/20",
    particles: ['#ef4444', '#ffffff', '#f87171']
  }
};

export default function RevealPage() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [gift, setGift] = useState<any>(null);
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    const fetchGift = async () => {
      try {
        const res = await fetch(`${BaseUrl}api/digital-gifts/gifts/${id}/`);
        if (!res.ok) throw new Error("Gift not found");
        const data = await res.json();
        setGift(data);
      } catch (err) { console.error(err); } finally { setLoading(false); }
    };
    fetchGift();
  }, [id]);

  // Determine tier config (fallback to basic)
  const tierKey = gift?.tier_name?.toLowerCase() || 'basic';
  const config = TIER_CONFIG[tierKey] || TIER_CONFIG.basic;

  const handleReveal = () => {
    setIsRevealed(true);
    confetti({
      particleCount: 200,
      spread: 90,
      origin: { y: 0.7 },
      colors: config.particles
    });
  };

  if (loading) return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center">
      <Loader2 className="w-10 h-10 text-zinc-800 animate-spin" />
    </div>
  );

  return (
    <div className={`min-h-screen relative overflow-hidden flex flex-col items-center justify-center p-4 bg-[#050505]`}>
      
      {/* Dynamic Background Glow */}
      <motion.div 
        animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
        transition={{ duration: 8, repeat: Infinity }}
        className={`absolute inset-0 bg-gradient-to-b ${config.bg} blur-[100px] pointer-events-none`} 
      />

      <AnimatePresence mode="wait">
        {!isRevealed ? (
          /* --- INITIAL STATE: THE MYSTERY CARD --- */
          <motion.div 
            key="envelope"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1, filter: "blur(20px)" }}
            className="z-10 text-center"
          >
            <div 
              onClick={handleReveal}
              className={`relative w-72 h-[450px] cursor-pointer group rounded-[50px] border-2 ${config.border} bg-zinc-900/50 backdrop-blur-md flex flex-col items-center justify-center transition-all hover:scale-105 ${config.shadow} shadow-2xl`}
            >
              <div className="absolute top-8 left-1/2 -translate-x-1/2 opacity-50 uppercase text-[9px] font-black tracking-[0.5em] text-white">
                Lensra Exclusive
              </div>
              
              <div className="relative">
                <motion.div 
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 4 }}
                >
                  {config.icon}
                </motion.div>
                <div className={`absolute inset-0 blur-xl ${config.color} opacity-50 scale-150`} />
              </div>

              <div className="mt-12 space-y-2">
                <p className="text-white font-black italic text-2xl uppercase tracking-tighter">Tap to open</p>
                <p className="text-zinc-500 font-bold text-[10px] uppercase tracking-widest">A gift from {gift.sender_name}</p>
              </div>

              {/* Progress interaction hint */}
              <div className="absolute bottom-10 flex gap-1">
                {[1,2,3].map(i => (
                  <motion.div 
                    key={i}
                    animate={{ opacity: [0.2, 1, 0.2] }}
                    transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.2 }}
                    className={`w-1.5 h-1.5 rounded-full`}
                    style={{ backgroundColor: config.color }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        ) : (
          /* --- REVEALED STATE: THE MODERN MESSAGE --- */
          <motion.div 
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="z-10 max-w-2xl w-full flex flex-col items-center px-4 pt-10 pb-20"
          >
            {/* Header with Tier Badge */}
            <motion.div 
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className={`px-4 py-1.5 rounded-full border ${config.border} bg-white/5 backdrop-blur-sm flex items-center gap-2 mb-8`}
            >
              {config.icon}
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white" style={{ color: config.color }}>
                {config.label}
              </span>
            </motion.div>

            {/* Main Message Container */}
            <div className="w-full relative">
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", damping: 20 }}
                className={`w-full bg-zinc-900/80 backdrop-blur-2xl border-t-2 border-l-2 ${config.border} rounded-[60px] p-12 md:p-20 text-center relative overflow-hidden`}
              >
                {/* Decorative Sparkles inside card */}
                <Sparkles className="absolute top-8 right-8 w-5 h-5 opacity-20 text-white" />
                
                <h3 className="text-zinc-500 text-[11px] font-black uppercase tracking-[0.4em] mb-10">
                  {gift.occasion_name} Message
                </h3>

                {/* Text Message with nice typography */}
                <motion.p 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-3xl md:text-5xl font-medium leading-[1.3] text-white italic tracking-tight"
                >
                  "{gift.text_message}"
                </motion.p>

                {gift.voice_message && (
                  <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
                    className="mt-12 p-6 bg-white/5 rounded-full flex items-center gap-4"
                  >
                    <Volume2 className="w-6 h-6" style={{ color: config.color }} />
                    <audio controls className="w-full h-8 custom-audio-player">
                      <source src={gift.voice_message} />
                    </audio>
                  </motion.div>
                )}
              </motion.div>
            </div>

            {/* From Info */}
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
              className="mt-10 text-center"
            >
              <p className="text-zinc-500 font-bold uppercase text-[10px] tracking-widest mb-2">Sent by</p>
              <p className="text-white font-black italic uppercase text-3xl tracking-tighter">
                {gift.sender_name}
              </p>
            </motion.div>

            {/* Actions Section */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2 }}
              className="mt-16 w-full max-w-sm space-y-4"
            >
              <div className="grid grid-cols-2 gap-4">
                <button className="flex items-center justify-center gap-2 py-5 bg-zinc-900 border border-zinc-800 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all">
                  <Heart className="w-4 h-4" /> React
                </button>
                <button 
                  onClick={() => navigator.share({ title: 'Lensra Gift', url: window.location.href })}
                  className="flex items-center justify-center gap-2 py-5 bg-zinc-900 border border-zinc-800 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all"
                >
                  <Share2 className="w-4 h-4" /> Share
                </button>
              </div>
              
              <a href="/create" className="w-full py-6 flex items-center justify-center gap-3 bg-white text-black rounded-full text-[11px] font-black uppercase tracking-[0.2em] shadow-xl hover:bg-red-600 hover:text-white transition-all">
                Send a Gift Back <Gift className="w-4 h-4" />
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modern Background Texture */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" 
        style={{ backgroundImage: `radial-gradient(${config.color} 0.5px, transparent 0.5px)`, backgroundSize: '30px 30px' }} 
      />
    </div>
  );
}