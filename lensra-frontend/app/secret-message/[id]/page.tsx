"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Volume2, Share2, Gift, Loader2, Sparkles, Crown, Star, Zap, PartyPopper, TrendingUp, Mail } from 'lucide-react';
import confetti from 'canvas-confetti';

const BaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.lensra.com/";

// Occasion-based Experience Configuration
const OCCASION_CONFIG: any = {
  'love-confession': {
    color: "#ff006e",
    gradient: "from-pink-900/30 via-red-900/20 to-black",
    border: "border-pink-500/40",
    icon: <Heart className="w-8 h-8 text-pink-500" fill="currentColor" />,
    label: "Love Confession",
    shadow: "shadow-pink-500/30",
    particles: ['#ff006e', '#ff4d87', '#ff69b4', '#ffffff'],
    bgPattern: "hearts",
    animation: "pulse",
    textStyle: "romantic",
    message: "Someone's heart beats for you..."
  },
  'appreciation': {
    color: "#fbbf24",
    gradient: "from-amber-900/30 via-yellow-900/20 to-black",
    border: "border-amber-500/40",
    icon: <Star className="w-8 h-8 text-amber-500" fill="currentColor" />,
    label: "Appreciation",
    shadow: "shadow-amber-500/30",
    particles: ['#fbbf24', '#f59e0b', '#fcd34d', '#ffffff'],
    bgPattern: "stars",
    animation: "glow",
    textStyle: "warm",
    message: "You're valued more than you know..."
  },
  'celebration': {
    color: "#8b5cf6",
    gradient: "from-purple-900/30 via-indigo-900/20 to-black",
    border: "border-purple-500/40",
    icon: <PartyPopper className="w-8 h-8 text-purple-500" />,
    label: "Celebration",
    shadow: "shadow-purple-500/30",
    particles: ['#8b5cf6', '#a78bfa', '#c4b5fd', '#fbbf24', '#ffffff'],
    bgPattern: "confetti",
    animation: "bounce",
    textStyle: "festive",
    message: "Time to celebrate something amazing..."
  },
  'encouragement': {
    color: "#10b981",
    gradient: "from-emerald-900/30 via-green-900/20 to-black",
    border: "border-emerald-500/40",
    icon: <TrendingUp className="w-8 h-8 text-emerald-500" />,
    label: "Encouragement",
    shadow: "shadow-emerald-500/30",
    particles: ['#10b981', '#34d399', '#6ee7b7', '#ffffff'],
    bgPattern: "lines",
    animation: "rise",
    textStyle: "uplifting",
    message: "Believe in yourself, someone does..."
  },
  'apology': {
    color: "#60a5fa",
    gradient: "from-blue-900/30 via-sky-900/20 to-black",
    border: "border-blue-500/40",
    icon: <Mail className="w-8 h-8 text-blue-400" />,
    label: "Heartfelt Apology",
    shadow: "shadow-blue-500/30",
    particles: ['#60a5fa', '#93c5fd', '#bfdbfe', '#ffffff'],
    bgPattern: "gentle",
    animation: "gentle",
    textStyle: "sincere",
    message: "A heartfelt message awaits..."
  }
};

// Tier Configuration
const TIER_CONFIG: any = {
  premium: {
    icon: <Crown className="w-5 h-5" />,
    label: "Premium",
    boost: 1.3
  },
  standard: {
    icon: <Star className="w-5 h-5" />,
    label: "Standard",
    boost: 1
  },
  basic: {
    icon: <Zap className="w-5 h-5" />,
    label: "Basic",
    boost: 0.8
  }
};

export default function RevealPage() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [gift, setGift] = useState<any>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [audioPlaying, setAudioPlaying] = useState(false);

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

  const occasionSlug = gift?.occasion_slug?.toLowerCase() || 'celebration';
  const config = OCCASION_CONFIG[occasionSlug] || OCCASION_CONFIG.celebration;
  const tierKey = gift?.tier_name?.toLowerCase() || 'standard';
  const tierConfig = TIER_CONFIG[tierKey] || TIER_CONFIG.standard;

  const handleReveal = () => {
    setIsRevealed(true);
    
    // Occasion-specific confetti
    if (occasionSlug === 'celebration') {
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.6 },
        colors: config.particles,
        shapes: ['circle', 'square'],
        scalar: 1.2
      });
      setTimeout(() => {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { x: 0.3, y: 0.7 },
          colors: config.particles
        });
      }, 200);
    } else if (occasionSlug === 'love-confession') {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.7 },
        colors: config.particles,
        scalar: 1.5
      });
      setTimeout(() => {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { x: 0.7, y: 0.6 },
          colors: ['#ff006e', '#ff69b4']
        });
      }, 300);
    } else {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.7 },
        colors: config.particles
      });
    }
  };

  const getAnimationVariant = () => {
    switch (config.animation) {
      case 'pulse':
        return {
          scale: [1, 1.05, 1],
          transition: { duration: 2, repeat: Infinity }
        };
      case 'bounce':
        return {
          y: [0, -10, 0],
          transition: { duration: 1.5, repeat: Infinity }
        };
      case 'rise':
        return {
          y: [0, -5, 0],
          opacity: [0.8, 1, 0.8],
          transition: { duration: 2, repeat: Infinity }
        };
      default:
        return {
          scale: [1, 1.02, 1],
          transition: { duration: 3, repeat: Infinity }
        };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-10 h-10 text-red-600 animate-spin mx-auto" />
          <p className="text-xs font-black uppercase text-zinc-500 tracking-wider">Loading your gift...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col items-center justify-center p-4 bg-[#050505]">
      
      {/* Dynamic Animated Background */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1], 
          opacity: [0.15, 0.25, 0.15],
          rotate: [0, 5, 0]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className={`absolute inset-0 bg-gradient-to-br ${config.gradient} blur-[120px] pointer-events-none`} 
      />

      {/* Occasion-specific Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        {config.bgPattern === 'hearts' && (
          <div style={{ 
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 30c-5-4-10-8-10-12 0-3 2-5 5-5 2 0 4 1 5 3 1-2 3-3 5-3 3 0 5 2 5 5 0 4-5 8-10 12z' fill='${config.color.replace('#', '%23')}' fill-opacity='1'/%3E%3C/svg%3E")`,
            backgroundSize: '40px 40px'
          }} className="w-full h-full" />
        )}
        {config.bgPattern === 'stars' && (
          <div style={{ 
            backgroundImage: `radial-gradient(circle, ${config.color} 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }} className="w-full h-full" />
        )}
        {config.bgPattern === 'confetti' && (
          <div style={{ 
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M10 10h8v8h-8z' fill='${config.color.replace('#', '%23')}' fill-opacity='1'/%3E%3Ccircle cx='45' cy='15' r='3' fill='%23fbbf24'/%3E%3Cpath d='M25 45l4-4 4 4-4 4z' fill='%2360a5fa'/%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px'
          }} className="w-full h-full" />
        )}
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full"
            style={{ 
              backgroundColor: config.particles[i % config.particles.length],
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, Math.random() * 20 - 10, 0],
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.5, 1]
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2
            }}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        {!isRevealed ? (
          /* UNOPENED GIFT CARD */
          <motion.div 
            key="envelope"
            initial={{ opacity: 0, scale: 0.8, rotateY: -20 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            exit={{ opacity: 0, scale: 1.2, rotateY: 20, filter: "blur(10px)" }}
            transition={{ duration: 0.6, type: "spring" }}
            className="z-10 text-center"
          >
            <motion.div 
              onClick={handleReveal}
              whileHover={{ scale: 1.05, rotateY: 5 }}
              whileTap={{ scale: 0.95 }}
              className={`relative w-80 h-[480px] cursor-pointer rounded-[40px] border-2 ${config.border} bg-zinc-900/60 backdrop-blur-xl flex flex-col items-center justify-center transition-all ${config.shadow} shadow-2xl overflow-hidden group`}
              style={{
                background: `linear-gradient(135deg, rgba(24, 24, 27, 0.8) 0%, rgba(9, 9, 11, 0.9) 100%)`
              }}
            >
              {/* Top Badge */}
              <div className="absolute top-6 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full">
                <p className="text-[8px] font-black tracking-[0.3em] text-white/60 uppercase">
                  Lensra Exclusive
                </p>
              </div>
              
              {/* Animated Icon */}
              <motion.div 
                className="relative mb-8"
                animate={getAnimationVariant()}
              >
                <div className="relative z-10">
                  {config.icon}
                </div>
                <motion.div 
                  className="absolute inset-0 blur-2xl scale-150 opacity-60"
                  style={{ backgroundColor: config.color }}
                  animate={{
                    opacity: [0.4, 0.7, 0.4],
                    scale: [1.3, 1.6, 1.3]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </motion.div>

              {/* Message Hint */}
              <div className="space-y-3 mb-12">
                <motion.p 
                  className="text-white/90 font-black italic text-2xl uppercase tracking-tight"
                  animate={{ opacity: [0.8, 1, 0.8] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  Tap to Open
                </motion.p>
                <p className="text-zinc-400 font-medium text-xs tracking-wide px-8">
                  {config.message}
                </p>
              </div>

              {/* Sender Info */}
              <div className={`absolute bottom-8 left-1/2 -translate-x-1/2 px-5 py-2.5 bg-white/5 backdrop-blur-sm border ${config.border} rounded-full`}>
                <p className="text-[10px] font-black uppercase tracking-wider" style={{ color: config.color }}>
                  From {gift.sender_name}
                </p>
              </div>

              {/* Animated Dots */}
              <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex gap-1.5">
                {[0, 1, 2].map(i => (
                  <motion.div 
                    key={i}
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: config.color }}
                    animate={{ 
                      opacity: [0.3, 1, 0.3],
                      scale: [0.8, 1.2, 0.8]
                    }}
                    transition={{ 
                      repeat: Infinity, 
                      duration: 1.5, 
                      delay: i * 0.2 
                    }}
                  />
                ))}
              </div>

              {/* Shimmer Effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
                animate={{
                  x: ['-100%', '100%']
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  repeatDelay: 2
                }}
              />
            </motion.div>
          </motion.div>
        ) : (
          /* REVEALED CONTENT */
          <motion.div 
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="z-10 max-w-3xl w-full flex flex-col items-center px-4 pt-12 pb-24"
          >
            {/* Occasion & Tier Badge */}
            <motion.div 
              initial={{ y: -30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-3 mb-10"
            >
              <div className={`px-4 py-2 rounded-full border ${config.border} bg-white/5 backdrop-blur-sm flex items-center gap-2`}>
                {config.icon}
                <span className="text-[10px] font-black uppercase tracking-wider" style={{ color: config.color }}>
                  {config.label}
                </span>
              </div>
              
              <div className="px-4 py-2 rounded-full border border-zinc-700 bg-zinc-900/50 backdrop-blur-sm flex items-center gap-2">
                {tierConfig.icon}
                <span className="text-[10px] font-black uppercase tracking-wider text-zinc-400">
                  {tierConfig.label}
                </span>
              </div>
            </motion.div>

            {/* Main Message Card */}
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ type: "spring", damping: 20, delay: 0.3 }}
              className="w-full relative"
            >
              <div 
                className={`w-full bg-gradient-to-br from-zinc-900/90 to-zinc-950/90 backdrop-blur-2xl border-2 ${config.border} rounded-[48px] p-10 md:p-16 text-center relative overflow-hidden ${config.shadow} shadow-2xl`}
              >
                {/* Decorative Elements */}
                <motion.div
                  className="absolute top-8 right-8 opacity-20"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="w-6 h-6 text-white" />
                </motion.div>
                
                <motion.div
                  className="absolute bottom-8 left-8 opacity-20"
                  animate={{ rotate: -360 }}
                  transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                >
                  {config.icon}
                </motion.div>

                {/* Message Content */}
                <div className="relative z-10 space-y-8">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] mb-6" style={{ color: config.color }}>
                      {gift.occasion_name}
                    </p>
                    
                    <motion.p 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 }}
                      className={`text-2xl md:text-4xl font-medium leading-relaxed text-white tracking-tight ${
                        config.textStyle === 'romantic' ? 'italic font-serif' :
                        config.textStyle === 'festive' ? 'font-black uppercase' :
                        config.textStyle === 'uplifting' ? 'font-bold' :
                        'font-medium'
                      }`}
                      style={{ 
                        lineHeight: '1.5',
                        textShadow: `0 0 30px ${config.color}40`
                      }}
                    >
                      "{gift.text_message}"
                    </motion.p>
                  </motion.div>

                  {/* Voice Message Player */}
                  {gift.voice_message && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.9 }} 
                      animate={{ opacity: 1, scale: 1 }} 
                      transition={{ delay: 0.9 }}
                      className={`mt-10 p-5 bg-white/5 backdrop-blur-sm border ${config.border} rounded-3xl flex items-center gap-4`}
                    >
                      <button
                        onClick={() => setAudioPlaying(!audioPlaying)}
                        className={`p-3 rounded-full transition-all`}
                        style={{ backgroundColor: `${config.color}20` }}
                      >
                        <Volume2 className="w-5 h-5" style={{ color: config.color }} />
                      </button>
                      <div className="flex-1">
                        <audio 
                          controls 
                          className="w-full h-10"
                          style={{ filter: 'invert(1) hue-rotate(180deg)' }}
                        >
                          <source src={gift.voice_message} />
                        </audio>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Sender Info */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 1 }}
              className="mt-10 text-center space-y-2"
            >
              <p className="text-zinc-500 font-bold uppercase text-[9px] tracking-[0.3em]">With love from</p>
              <p 
                className="text-white font-black italic uppercase text-3xl tracking-tighter"
                style={{ textShadow: `0 0 20px ${config.color}40` }}
              >
                {gift.sender_name}
              </p>
            </motion.div>

            {/* Action Buttons */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 1.2 }}
              className="mt-14 w-full max-w-md space-y-4"
            >
              <div className="grid grid-cols-2 gap-3">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center justify-center gap-2 py-5 bg-zinc-900/80 border-2 border-zinc-800 rounded-full text-[10px] font-black uppercase tracking-wide hover:border-white hover:bg-white hover:text-black transition-all"
                >
                  <Heart className="w-4 h-4" /> React
                </motion.button>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({ 
                        title: `${config.label} from ${gift.sender_name}`,
                        text: gift.text_message,
                        url: window.location.href 
                      });
                    }
                  }}
                  className="flex items-center justify-center gap-2 py-5 bg-zinc-900/80 border-2 border-zinc-800 rounded-full text-[10px] font-black uppercase tracking-wide hover:border-white hover:bg-white hover:text-black transition-all"
                >
                  <Share2 className="w-4 h-4" /> Share
                </motion.button>
              </div>
              
              <motion.a 
                href="/create"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-6 flex items-center justify-center gap-3 rounded-full text-xs font-black uppercase tracking-wider shadow-xl transition-all"
                style={{
                  backgroundColor: config.color,
                  color: '#ffffff',
                  boxShadow: `0 10px 40px ${config.color}40`
                }}
              >
                Send a Gift Back <Gift className="w-5 h-5" />
              </motion.a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}