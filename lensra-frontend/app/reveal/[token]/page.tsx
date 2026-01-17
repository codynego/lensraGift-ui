"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Heart, Sparkles, ShieldCheck, Loader2, Flame, Key, Eye, PartyPopper, HandHeart, Bird } from 'lucide-react';
import { useParams } from 'next/navigation';

// Emotion configurations with colors and icons
const EMOTION_CONFIG = {
  loved: {
    label: 'Loved',
    emoji: '❤️',
    color: 'red',
    glowColor: 'rgba(220,38,38,',
    icon: Heart,
    gradient: 'from-red-600/10 via-red-600/20 to-red-600/10',
    border: 'border-red-600/30'
  },
  joyful: {
    label: 'Joyful',
    emoji: '🎉',
    color: 'yellow',
    glowColor: 'rgba(234,179,8,',
    icon: PartyPopper,
    gradient: 'from-yellow-600/10 via-yellow-600/20 to-yellow-600/10',
    border: 'border-yellow-600/30'
  },
  emotional: {
    label: 'Emotional',
    emoji: '🥹',
    color: 'blue',
    glowColor: 'rgba(37,99,235,',
    icon: Sparkles,
    gradient: 'from-blue-600/10 via-blue-600/20 to-blue-600/10',
    border: 'border-blue-600/30'
  },
  appreciated: {
    label: 'Appreciated',
    emoji: '🙏',
    color: 'purple',
    glowColor: 'rgba(147,51,234,',
    icon: HandHeart,
    gradient: 'from-purple-600/10 via-purple-600/20 to-purple-600/10',
    border: 'border-purple-600/30'
  },
  remembered: {
    label: 'Remembered',
    emoji: '🕊',
    color: 'cyan',
    glowColor: 'rgba(6,182,212,',
    icon: Bird,
    gradient: 'from-cyan-600/10 via-cyan-600/20 to-cyan-600/10',
    border: 'border-cyan-600/30'
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
    emotion: "loved"
  });

  // Get emotion config
  const emotionConfig = EMOTION_CONFIG[data.emotion as keyof typeof EMOTION_CONFIG] || EMOTION_CONFIG.loved;
  const EmotionIcon = emotionConfig.icon;

  // Generate floating particles
  useEffect(() => {
    const newParticles: Particle[] = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 2,
      duration: 3 + Math.random() * 2
    }));
    setParticles(newParticles);
  }, []);

  // Fetch secret message from Django API
  useEffect(() => {
    const fetchSecret = async () => {
      try {
        // Replace with your actual API base URL
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.lensra.com';
        const url = `${API_BASE_URL}/api/orders/secret-message/${token}/`;
        
        console.log('Fetching from:', url);
        console.log('Token:', token);
        
        const response = await fetch(url);
        
        console.log('Response status:', response.status);
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.error('Error response:', errorData);
          
          if (response.status === 404) {
            throw new Error('Invalid or expired token');
          }
          throw new Error(errorData.error || 'Failed to fetch secret message');
        }

        const json = await response.json();
        console.log('Success! Data:', json);
        
        setData({
          secret_message: json.secret_message,
          emotion: json.emotion || 'loved'
        });
        setLoading(false);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
        setLoading(false);
      }
    };
    
    if (token) {
      fetchSecret();
    } else {
      setError('No token provided');
      setLoading(false);
    }
  }, [token]);

  // Typewriter effect
  useEffect(() => {
    if (isRevealed && displayText.length < data.secret_message.length) {
      const timeout = setTimeout(() => {
        setDisplayText(data.secret_message.slice(0, displayText.length + 1));
      }, 40);
      return () => clearTimeout(timeout);
    } else if (isRevealed && displayText.length === data.secret_message.length) {
      setTimeout(() => setShowEmotion(true), 800);
    }
  }, [isRevealed, displayText, data.secret_message]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-6"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
          >
            <Loader2 className={`w-12 h-12 text-${emotionConfig.color}-600`} />
          </motion.div>
          <motion.p
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className={`text-[10px] font-black uppercase tracking-[0.5em] text-${emotionConfig.color}-600`}
          >
            Decrypting
          </motion.p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md"
        >
          <div className="w-24 h-24 bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-8 border border-red-600/20">
            <Lock className="w-10 h-10 text-red-600" />
          </div>
          <h2 className="text-2xl font-black text-white mb-4 uppercase">Access Denied</h2>
          <p className="text-zinc-500 font-medium mb-8">{error}</p>
          <div className="h-[1px] w-32 bg-gradient-to-r from-transparent via-zinc-800 to-transparent mx-auto" />
        </motion.div>
      </div>
    );
  }

  const particleColorClass = `bg-${emotionConfig.color}-600/30`;
  const textColorClass = `text-${emotionConfig.color}-600`;

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 overflow-hidden selection:bg-red-500/30 relative">
      {/* Animated Background Particles */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className={particleColorClass}
            style={{ 
              left: `${particle.x}%`, 
              top: `${particle.y}%`,
              width: '4px',
              height: '4px',
              borderRadius: '50%',
              position: 'absolute'
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0, 1, 0],
              scale: [0, 1.5, 0]
            }}
            transition={{
              repeat: Infinity,
              duration: particle.duration,
              delay: particle.delay,
              ease: "easeInOut"
            }}
          />
        ))}
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%]"
          style={{
            background: `radial-gradient(circle at center, ${emotionConfig.glowColor}0.08) 0%, transparent 70%)`
          }}
        />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20" />
      </div>

      <AnimatePresence mode="wait">
        {!isRevealed ? (
          <motion.div 
            key="lock-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ 
              opacity: 0, 
              scale: 1.3, 
              filter: "blur(30px)",
              rotateY: 90
            }}
            transition={{ duration: 0.8 }}
            className="relative z-10 text-center max-w-2xl w-full"
          >
            {/* Lock Icon with Glow */}
            <motion.div 
              animate={{ 
                boxShadow: [
                  `0 0 30px ${emotionConfig.glowColor}0.3)`, 
                  `0 0 80px ${emotionConfig.glowColor}0.6)`, 
                  `0 0 30px ${emotionConfig.glowColor}0.3)`
                ] 
              }}
              transition={{ repeat: Infinity, duration: 2.5 }}
              className={`relative w-32 h-32 bg-gradient-to-br from-zinc-900 to-zinc-950 rounded-full flex items-center justify-center mx-auto mb-12 border-2 ${emotionConfig.border} shadow-2xl`}
            >
              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              >
                <Lock className={`w-12 h-12 text-${emotionConfig.color}-600`} strokeWidth={1.5} />
              </motion.div>
              
              {/* Rotating Ring */}
              <motion.div
                className={`absolute inset-0 rounded-full border-2 border-t-${emotionConfig.color}-600 border-r-transparent border-b-transparent border-l-transparent`}
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
              />
            </motion.div>

            {/* Title Section */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <div className="mb-6 flex items-center justify-center gap-3">
                <div className={`h-[1px] w-12 bg-gradient-to-r from-transparent to-${emotionConfig.color}-600/50`} />
                <div className="flex items-center gap-2">
                  <Key className={`w-3 h-3 text-${emotionConfig.color}-600`} />
                  <h2 className={`text-[9px] font-black uppercase tracking-[0.6em] text-${emotionConfig.color}-600`}>
                    {token?.slice(0, 8).toUpperCase()}...
                  </h2>
                </div>
                <div className={`h-[1px] w-12 bg-gradient-to-l from-transparent to-${emotionConfig.color}-600/50`} />
              </div>

              <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter text-white mb-3 uppercase leading-none">
                Secret Message
              </h1>
              
              <motion.div
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="flex items-center justify-center gap-2 mb-12"
              >
                <EmotionIcon className={`w-5 h-5 text-${emotionConfig.color}-600`} />
                <span className="text-base font-black uppercase tracking-[0.4em] text-zinc-600">
                  Waiting to be Revealed
                </span>
                <EmotionIcon className={`w-5 h-5 text-${emotionConfig.color}-600`} />
              </motion.div>
              
              {/* CTA Button */}
              <motion.button 
                onClick={() => setIsRevealed(true)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`group relative px-16 py-7 bg-white text-black rounded-full font-black uppercase tracking-[0.35em] text-[11px] transition-all hover:bg-${emotionConfig.color}-600 hover:text-white overflow-hidden shadow-2xl`}
              >
                <span className="relative z-10 flex items-center gap-4">
                  <Eye className="w-5 h-5" />
                  Reveal Now
                  <Sparkles className="w-5 h-5" />
                </span>
                
                {/* Shimmer Effect */}
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                  animate={{ x: ['-200%', '200%'] }}
                  transition={{ repeat: Infinity, duration: 2.5, ease: "linear" }}
                />
                
                {/* Glow on Hover */}
                <motion.div
                  className={`absolute inset-0 bg-${emotionConfig.color}-600 opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-xl`}
                />
              </motion.button>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="mt-8 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-700"
              >
                Tap to unlock the emotion
              </motion.p>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div 
            key="content-screen"
            initial={{ opacity: 0, rotateY: -90 }}
            animate={{ opacity: 1, rotateY: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="w-full max-w-4xl flex flex-col items-center relative z-10"
          >
            {/* Floating Icon */}
            <motion.div 
              initial={{ scale: 0, rotate: -180 }} 
              animate={{ 
                scale: 1, 
                rotate: 0,
                y: [0, -10, 0]
              }} 
              transition={{ 
                scale: { type: "spring", stiffness: 150, delay: 0.2 },
                y: { repeat: Infinity, duration: 3, ease: "easeInOut" }
              }} 
              className="mb-16 relative"
            >
              <motion.div
                animate={{ 
                  boxShadow: [
                    `0 0 20px ${emotionConfig.glowColor}0.4)`, 
                    `0 0 60px ${emotionConfig.glowColor}0.8)`, 
                    `0 0 20px ${emotionConfig.glowColor}0.4)`
                  ]
                }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="rounded-full p-4"
              >
                <EmotionIcon className={`w-16 h-16 text-${emotionConfig.color}-600 fill-${emotionConfig.color}-600`} />
              </motion.div>
            </motion.div>

            {/* Message Container */}
            <div className="min-h-[300px] flex items-center justify-center mb-12 relative">
              {/* Decorative Corner Brackets */}
              <div className={`absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 ${emotionConfig.border}`} />
              <div className={`absolute top-0 right-0 w-12 h-12 border-t-2 border-r-2 ${emotionConfig.border}`} />
              <div className={`absolute bottom-0 left-0 w-12 h-12 border-b-2 border-l-2 ${emotionConfig.border}`} />
              <div className={`absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 ${emotionConfig.border}`} />
              
              <p className="text-3xl md:text-5xl font-serif italic text-white text-center leading-[1.5] md:leading-[1.5] px-8 md:px-16">
                {displayText}
                <motion.span 
                  animate={{ opacity: [1, 0] }}
                  transition={{ repeat: Infinity, duration: 0.7 }}
                  className={`inline-block w-1 h-12 bg-${emotionConfig.color}-600 ml-2 align-middle`}
                />
              </p>
            </div>

            {/* Emotion Tag */}
            <AnimatePresence>
              {showEmotion && (
                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  className="mb-16"
                >
                  <div className={`relative px-10 py-5 bg-gradient-to-r ${emotionConfig.gradient} rounded-full border ${emotionConfig.border}`}>
                    <motion.div
                      className={`absolute inset-0 bg-gradient-to-r from-transparent via-${emotionConfig.color}-600/20 to-transparent rounded-full`}
                      animate={{ x: ['-100%', '100%'] }}
                      transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                    />
                    <div className="relative z-10 flex items-center gap-3">
                      <span className="text-2xl">{emotionConfig.emoji}</span>
                      <span className="text-sm font-black uppercase tracking-[0.4em] text-white">
                        {emotionConfig.label}
                      </span>
                      <span className="text-2xl">{emotionConfig.emoji}</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Footer */}
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              transition={{ delay: 2 }} 
              className="mt-8 flex flex-col items-center gap-6"
            >
              <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500">
                <ShieldCheck className="w-4 h-4" /> 
                <span>Strictly Confidential</span>
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div className={`h-[2px] w-32 bg-gradient-to-r from-transparent via-${emotionConfig.color}-600/40 to-transparent`} />
              <motion.p
                animate={{ opacity: [0.3, 0.6, 0.3] }}
                transition={{ repeat: Infinity, duration: 3 }}
                className="text-[9px] font-black uppercase tracking-[0.5em] text-zinc-700"
              >
                End Transmission
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}