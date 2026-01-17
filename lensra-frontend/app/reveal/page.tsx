"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Lock, Heart, Sparkles, ShieldCheck, Loader2, 
  Key, Eye, PartyPopper, HandHeart, Bird 
} from 'lucide-react';
import { useParams } from 'next/navigation';

// Emotion configurations with explicit Tailwind class strings
const EMOTION_CONFIG = {
  Happy: {
    label: 'Joyful',
    emoji: '🎉',
    colorClass: 'text-yellow-500',
    borderClass: 'border-yellow-500/30',
    glowColor: 'rgba(234,179,8,',
    icon: PartyPopper,
    gradient: 'from-yellow-600/10 via-yellow-600/20 to-yellow-600/10',
    particleClass: 'bg-yellow-500/30',
    cursorClass: 'bg-yellow-500'
  },
  Romantic: {
    label: 'Loved',
    emoji: '❤️',
    colorClass: 'text-red-500',
    borderClass: 'border-red-500/30',
    glowColor: 'rgba(220,38,38,',
    icon: Heart,
    gradient: 'from-red-600/10 via-red-600/20 to-red-600/10',
    particleClass: 'bg-red-500/30',
    cursorClass: 'bg-red-500'
  },
  Emotional: {
    label: 'Deeply Touched',
    emoji: '🥹',
    colorClass: 'text-blue-500',
    borderClass: 'border-blue-500/30',
    glowColor: 'rgba(37,99,235,',
    icon: Sparkles,
    gradient: 'from-blue-600/10 via-blue-600/20 to-blue-600/10',
    particleClass: 'bg-blue-500/30',
    cursorClass: 'bg-blue-500'
  },
  Suprise: { // Matching your editor spelling "Suprise"
    label: 'Surprised',
    emoji: '🎁',
    colorClass: 'text-purple-500',
    borderClass: 'border-purple-500/30',
    glowColor: 'rgba(147,51,234,',
    icon: PartyPopper,
    gradient: 'from-purple-600/10 via-purple-600/20 to-purple-600/10',
    particleClass: 'bg-purple-500/30',
    cursorClass: 'bg-purple-500'
  },
  Hype: {
    label: 'Hyped',
    emoji: '🔥',
    colorClass: 'text-orange-500',
    borderClass: 'border-orange-500/30',
    glowColor: 'rgba(249,115,22,',
    icon: Sparkles,
    gradient: 'from-orange-600/10 via-orange-600/20 to-orange-600/10',
    particleClass: 'bg-orange-500/30',
    cursorClass: 'bg-orange-500'
  }
};

interface Particle {
  id: number;
  x: number;
  y: number;
  delay: number;
  duration: number;
}

export default function DramaticSecretReveal() {
  const params = useParams();
  const token = params.token as string;

  const [isRevealed, setIsRevealed] = useState(false);
  const [displayText, setDisplayText] = useState("");
  const [loading, setLoading] = useState(true);
  const [showEmotion, setShowEmotion] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  const [data, setData] = useState({
    secret_message: "",
    emotion: "Happy"
  });

  const emotionConfig = EMOTION_CONFIG[data.emotion as keyof typeof EMOTION_CONFIG] || EMOTION_CONFIG.Happy;
  const EmotionIcon = emotionConfig.icon;

  useEffect(() => {
    setParticles(Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 2,
      duration: 3 + Math.random() * 2
    })));
  }, []);

  useEffect(() => {
    const fetchSecret = async () => {
      try {
        const BaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000/";
        const response = await fetch(`${BaseUrl.replace(/\/$/, '')}/api/orders/reveal/${token}/`);
        
        if (!response.ok) {
          if (response.status === 404) throw new Error('Secret not found or already viewed.');
          throw new Error('Access Denied: Could not connect to Lensra Secure Server.');
        }

        const json = await response.json();
        setData({
          secret_message: json.secret_message,
          emotion: json.emotion || 'Happy'
        });
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    if (token) fetchSecret();
  }, [token]);

  useEffect(() => {
    if (isRevealed && displayText.length < data.secret_message.length) {
      const timeout = setTimeout(() => {
        setDisplayText(data.secret_message.slice(0, displayText.length + 1));
      }, 50);
      return () => clearTimeout(timeout);
    } else if (isRevealed && displayText.length === data.secret_message.length) {
      setTimeout(() => setShowEmotion(true), 800);
    }
  }, [isRevealed, displayText, data.secret_message]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-zinc-800 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 text-center">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
          <div className="w-20 h-20 bg-zinc-900/50 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-900/30 shadow-[0_0_30px_rgba(220,38,38,0.1)]">
            <Lock className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-white font-black uppercase tracking-widest mb-2">Access Denied</h2>
          <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest max-w-xs mx-auto leading-relaxed">{error}</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 overflow-hidden relative">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className={`absolute rounded-full ${emotionConfig.particleClass}`}
            style={{ left: `${p.x}%`, top: `${p.y}%`, width: '3px', height: '3px' }}
            animate={{ y: [0, -100], opacity: [0, 1, 0], scale: [0, 1.5, 0] }}
            transition={{ repeat: Infinity, duration: p.duration, delay: p.delay }}
          />
        ))}
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-20"
          style={{ background: `radial-gradient(circle at center, ${emotionConfig.glowColor}0.15) 0%, transparent 70%)` }}
        />
      </div>

      <AnimatePresence mode="wait">
        {!isRevealed ? (
          <motion.div 
            key="lock"
            exit={{ opacity: 0, scale: 1.1, filter: "blur(20px)" }}
            className="relative z-10 text-center max-w-lg w-full"
          >
            <motion.div 
              animate={{ boxShadow: [`0 0 20px ${emotionConfig.glowColor}0.2)`, `0 0 50px ${emotionConfig.glowColor}0.5)`, `0 0 20px ${emotionConfig.glowColor}0.2)`] }}
              transition={{ repeat: Infinity, duration: 3 }}
              className={`w-28 h-28 bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-10 border-2 ${emotionConfig.borderClass}`}
            >
              <Lock className={`w-10 h-10 ${emotionConfig.colorClass}`} />
            </motion.div>

            <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter text-white mb-4 uppercase leading-none">
              Lensra Secure <br/> Digital Gift
            </h1>
            <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.4em] mb-12">Encryption Level: 256-Bit Surprise</p>
            
            <motion.button 
              onClick={() => setIsRevealed(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group relative px-14 py-6 bg-white text-black rounded-full font-black uppercase tracking-[0.3em] text-[10px] shadow-2xl overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-3">
                <Eye className="w-4 h-4" /> Unlock Message
              </span>
              <motion.div className="absolute inset-0 bg-zinc-200" initial={{ x: '-100%' }} whileHover={{ x: 0 }} transition={{ duration: 0.4 }} />
            </motion.button>
          </motion.div>
        ) : (
          <motion.div 
            key="content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-3xl text-center z-10"
          >
            <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 4 }} className="mb-12">
              <EmotionIcon className={`w-16 h-16 mx-auto ${emotionConfig.colorClass} fill-current opacity-80`} />
            </motion.div>

            <div className="relative py-12 px-6 min-h-[200px] flex items-center justify-center">
              <p className="text-3xl md:text-5xl font-serif italic text-white leading-[1.6] text-center">
                {displayText}
                <motion.span animate={{ opacity: [1, 0] }} transition={{ repeat: Infinity, duration: 0.8 }} className={`inline-block w-1 h-10 ml-2 align-middle ${emotionConfig.cursorClass}`} />
              </p>
            </div>

            {showEmotion && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-16">
                <div className={`inline-flex items-center gap-3 px-8 py-4 rounded-full border ${emotionConfig.borderClass} bg-zinc-900/50 backdrop-blur-md`}>
                  <span className="text-xl">{emotionConfig.emoji}</span>
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white">Mood: {data.emotion}</span>
                  <span className="text-xl">{emotionConfig.emoji}</span>
                </div>
                
                <div className="mt-12 flex flex-col items-center gap-4 opacity-40">
                    <ShieldCheck className="w-5 h-5 text-zinc-500" />
                    <span className="text-[8px] font-black uppercase tracking-[0.5em] text-zinc-500">Transmission Complete</span>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}