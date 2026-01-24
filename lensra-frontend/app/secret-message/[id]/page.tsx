"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence, easeInOut } from 'framer-motion';
import { Heart, Volume2, Share2, Gift, Loader2, Sparkles, Crown, Star, Zap, PartyPopper, TrendingUp, Mail, Play, Pause } from 'lucide-react';

const BaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.lensra.com/";

// Helper to ensure full media URLs
const getMediaUrl = (path?: string) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return `${BaseUrl}${path.startsWith('/') ? path.slice(1) : path}`;
};

// Occasion-based Experience Configuration - Enhanced with more distinct feels
const OCCASION_CONFIG: any = {
  'love-confession': {
    color: "#ff1493", // Softer pink for romantic feel
    gradient: "from-pink-950/20 via-rose-950/10 to-black",
    border: "border-pink-400/30",
    icon: <Heart className="w-5 h-5 text-pink-400" fill="currentColor" />,
    label: "Love Confession",
    shadow: "shadow-pink-400/20",
    particles: ['#ff1493', '#ff69b4', '#ffb6c1', '#ffffff'],
    bgPattern: "hearts",
    animation: "pulse",
    textStyle: "romantic",
    message: "A secret admirer awaits..."
  },
  'appreciation': {
    color: "#ffd700",
    gradient: "from-yellow-950/20 via-amber-950/10 to-black",
    border: "border-yellow-400/30",
    icon: <Star className="w-5 h-5 text-yellow-400" fill="currentColor" />,
    label: "Appreciation",
    shadow: "shadow-yellow-400/20",
    particles: ['#ffd700', '#ffcc00', '#ffee58', '#ffffff'],
    bgPattern: "stars",
    animation: "glow",
    textStyle: "warm",
    message: "Gratitude is coming your way..."
  },
  'celebration': {
    color: "#7c3aed",
    gradient: "from-violet-950/20 via-purple-950/10 to-black",
    border: "border-violet-400/30",
    icon: <PartyPopper className="w-5 h-5 text-violet-400" />,
    label: "Celebration",
    shadow: "shadow-violet-400/20",
    particles: ['#7c3aed', '#a78bfa', '#d8b4fe', '#ffd700', '#ffffff'],
    bgPattern: "confetti",
    animation: "bounce",
    textStyle: "festive",
    message: "Joyful moments ahead..."
  },
  'encouragement': {
    color: "#22c55e",
    gradient: "from-green-950/20 via-emerald-950/10 to-black",
    border: "border-green-400/30",
    icon: <TrendingUp className="w-5 h-5 text-green-400" />,
    label: "Encouragement",
    shadow: "shadow-green-400/20",
    particles: ['#22c55e', '#4ade80', '#86efac', '#ffffff'],
    bgPattern: "lines",
    animation: "rise",
    textStyle: "uplifting",
    message: "Inspiration is here..."
  },
  'apology': {
    color: "#3b82f6",
    gradient: "from-blue-950/20 via-sky-950/10 to-black",
    border: "border-blue-400/30",
    icon: <Mail className="w-5 h-5 text-blue-300" />,
    label: "Heartfelt Apology",
    shadow: "shadow-blue-400/20",
    particles: ['#3b82f6', '#60a5fa', '#93c5fd', '#ffffff'],
    bgPattern: "gentle",
    animation: "gentle",
    textStyle: "sincere",
    message: "A sincere note awaits..."
  }
};

// Enhanced Tier Configuration - Smaller sizes, more refined differences
const TIER_CONFIG: any = {
  premium: {
    icon: <Crown className="w-3.5 h-3.5" />,
    label: "Premium",
    cardSize: "w-80 max-w-[320px] h-[420px]",
    revealCardPadding: "p-8 md:p-12",
    particleCount: 20,
    glowIntensity: "blur-2xl opacity-60",
    borderWidth: "border-2",
    animationDuration: 1.5,
    showExtraEffects: true
  },
  standard: {
    icon: <Star className="w-3.5 h-3.5" />,
    label: "Standard",
    cardSize: "w-72 max-w-[288px] h-[380px]",
    revealCardPadding: "p-6 md:p-10",
    particleCount: 15,
    glowIntensity: "blur-xl opacity-40",
    borderWidth: "border",
    animationDuration: 2,
    showExtraEffects: true
  },
  basic: {
    icon: <Zap className="w-3.5 h-3.5" />,
    label: "Basic",
    cardSize: "w-64 max-w-[256px] h-[340px]",
    revealCardPadding: "p-4 md:p-8",
    particleCount: 10,
    glowIntensity: "blur-lg opacity-20",
    borderWidth: "border",
    animationDuration: 2.5,
    showExtraEffects: false
  }
};

export default function RevealPage() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [gift, setGift] = useState<any>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [displayedMessage, setDisplayedMessage] = useState('');
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
  const [videoElement, setVideoElement] = useState<HTMLVideoElement | null>(null);
  const [showBurstParticles, setShowBurstParticles] = useState(false);

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

  useEffect(() => {
    if (audioElement) {
      if (audioPlaying) {
        audioElement.play().catch(e => console.log('Audio play prevented', e));
      } else {
        audioElement.pause();
      }
    }
  }, [audioPlaying, audioElement]);

  useEffect(() => {
    if (videoElement) {
      if (videoPlaying) {
        videoElement.play().catch(e => console.log('Video play prevented', e));
      } else {
        videoElement.pause();
      }
    }
  }, [videoPlaying, videoElement]);

  useEffect(() => {
    if (isRevealed && gift?.text_message) {
      setDisplayedMessage('');
      let i = 0;
      const typingSpeed = 40; // ms per character
      const timer = setInterval(() => {
        setDisplayedMessage(gift.text_message.slice(0, i + 1));
        i++;
        if (i >= gift.text_message.length) {
          clearInterval(timer);
        }
      }, typingSpeed);
      return () => clearInterval(timer);
    }
  }, [isRevealed, gift]);

  const occasionSlug = gift?.occasion_slug?.toLowerCase() || gift?.occasion_name?.toLowerCase().replace(/ /g, '-') || 'celebration';
  const config = OCCASION_CONFIG[occasionSlug] || OCCASION_CONFIG.celebration;
  const tierKey = gift?.tier_name?.toLowerCase() || 'standard';
  const tierConfig = TIER_CONFIG[tierKey] || TIER_CONFIG.standard;

  const handleReveal = () => {
    setIsRevealed(true);
    setShowBurstParticles(true);
    setTimeout(() => setShowBurstParticles(false), 2000); // Burst lasts 2s
    
    // Auto-play media on reveal (user interaction allows autoplay)
    if (tierConfig.showExtraEffects) {
      if (gift?.video_message) {
        setVideoPlaying(true);
      } else if (gift?.voice_message) {
        setAudioPlaying(true);
      }
    }
  };

  const getAnimationVariant = () => {
    const duration = tierConfig.animationDuration;
    switch (config.animation) {
      case 'pulse':
        return {
          scale: [1, 1.03, 1],
          transition: { duration, repeat: Infinity, ease: easeInOut }
        };
      case 'bounce':
        return {
          y: [0, -8, 0],
          transition: { duration: duration * 0.6, repeat: Infinity, ease: easeInOut }
        };
      case 'rise':
        return {
          y: [0, -4, 0],
          opacity: [0.7, 1, 0.7],
          transition: { duration, repeat: Infinity, ease: easeInOut }
        };
      case 'gentle':
        return {
          opacity: [0.8, 1, 0.8],
          transition: { duration: duration * 1.2, repeat: Infinity, ease: easeInOut }
        };
      default:
        return {
          scale: [1, 1.01, 1],
          transition: { duration, repeat: Infinity, ease: easeInOut }
        };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020202] flex items-center justify-center">
        <div className="text-center space-y-3">
          <Loader2 className="w-6 h-6 text-gray-400 animate-spin mx-auto" />
          <p className="text-[9px] font-bold uppercase text-gray-500 tracking-widest">Preparing your surprise...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col items-center justify-center p-4 bg-[#020202]">
      
      {/* Subtle Animated Background - Softer for better experience */}
      <motion.div 
        animate={{ 
          scale: [1, tierKey === 'premium' ? 1.2 : 1.1, 1], 
          opacity: tierKey === 'premium' ? [0.15, 0.25, 0.15] : [0.1, 0.2, 0.1],
          rotate: [0, tierKey === 'premium' ? 5 : 3, 0]
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className={`absolute inset-0 bg-gradient-to-br ${config.gradient} ${tierConfig.glowIntensity} pointer-events-none`} 
      />

      {/* Occasion-specific Background Pattern - More subtle opacity */}
      <div className={`absolute inset-0 pointer-events-none opacity-[0.02]`}>
        {config.bgPattern === 'hearts' && (
          <div style={{ 
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='30' height='30' viewBox='0 0 30 30' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M15 22c-3.75-3-7.5-6-7.5-9 0-2.25 1.5-3.75 3.75-3.75 1.5 0 3 0.75 3.75 2.25 0.75-1.5 2.25-2.25 3.75-2.25 2.25 0 3.75 1.5 3.75 3.75 0 3-3.75 6-7.5 9z' fill='${config.color.replace('#', '%23')}' fill-opacity='0.5'/%3E%3C/svg%3E")`,
            backgroundSize: '30px 30px'
          }} className="w-full h-full" />
        )}
        {config.bgPattern === 'stars' && (
          <div style={{ 
            backgroundImage: `radial-gradient(circle, ${config.color} 0.5px, transparent 0.5px)`,
            backgroundSize: '40px 40px'
          }} className="w-full h-full" />
        )}
        {config.bgPattern === 'confetti' && (
          <div style={{ 
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='50' height='50' viewBox='0 0 50 50' xmlns='http://www.w3.org/2000/svg'%3E%3Crect x='10' y='10' width='6' height='6' fill='${config.color.replace('#', '%23')}' fill-opacity='0.5'/%3E%3Ccircle cx='35' cy='15' r='2' fill='%23ffd700' fill-opacity='0.5'/%3E%3Cpath d='M20 35l3-3 3 3-3 3z' fill='%233b82f6' fill-opacity='0.5'/%3E%3C/svg%3E")`,
            backgroundSize: '50px 50px'
          }} className="w-full h-full" />
        )}
        {config.bgPattern === 'lines' && (
          <div style={{ 
            backgroundImage: `linear-gradient(45deg, ${config.color}20 0.5px, transparent 0.5px)`,
            backgroundSize: '20px 20px'
          }} className="w-full h-full" />
        )}
        {config.bgPattern === 'gentle' && (
          <div style={{ 
            backgroundImage: `radial-gradient(circle, ${config.color}10 2px, transparent 2px)`,
            backgroundSize: '60px 60px'
          }} className="w-full h-full" />
        )}
      </div>

      {/* Persistent Floating Particles - Visible for all tiers, count varies */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(tierConfig.particleCount)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-0.5 h-0.5 rounded-full"
            style={{ 
              backgroundColor: config.particles[i % config.particles.length],
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }}
            animate={{
              y: [0, -20 + Math.random() * 10, 0],
              x: [0, Math.random() * 10 - 5, 0],
              opacity: [0.1, 0.6, 0.1],
              scale: [0.8, 1.2, 0.8]
            }}
            transition={{
              duration: 4 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 3,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      {/* Burst Particles on Reveal - Replaces confetti with sparkle burst */}
      {showBurstParticles && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(tierConfig.particleCount * 2)].map((_, i) => (
            <motion.div
              key={`burst-${i}`}
              initial={{
                x: '50%',
                y: '50%',
                scale: 0,
                opacity: 1
              }}
              animate={{
                x: `calc(50% + ${Math.cos(i * Math.PI / 10) * (50 + Math.random() * 100)}px)`,
                y: `calc(50% + ${Math.sin(i * Math.PI / 10) * (50 + Math.random() * 100)}px)`,
                scale: [0, 1 + Math.random() * 0.5, 0],
                opacity: [1, 0.8, 0]
              }}
              transition={{
                duration: 1.5 + Math.random() * 0.5,
                ease: "easeOut"
              }}
              className="absolute w-1 h-1 rounded-full"
              style={{ backgroundColor: config.particles[i % config.particles.length] }}
            />
          ))}
        </div>
      )}

      <AnimatePresence mode="wait">
        {!isRevealed ? (
          /* UNOPENED GIFT CARD - Compact sizes, cleaner layout */
          <motion.div 
            key="envelope"
            initial={{ opacity: 0, scale: 0.9, rotate: -5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 1.1, rotate: 5, filter: "blur(8px)" }}
            transition={{ duration: 0.5, type: "spring", damping: 15 }}
            className="z-10 text-center"
          >
            <motion.div 
              onClick={handleReveal}
              whileHover={{ scale: 1.03, rotate: 2 }}
              whileTap={{ scale: 0.97 }}
              className={`relative ${tierConfig.cardSize} cursor-pointer rounded-3xl ${tierConfig.borderWidth} ${config.border} bg-zinc-950/70 backdrop-blur-lg flex flex-col items-center justify-center transition-all ${config.shadow} shadow-xl overflow-hidden group`}
              style={{
                background: `linear-gradient(145deg, rgba(15,15,15,0.9) 0%, rgba(5,5,5,0.95) 100%)`
              }}
            >
              {/* Top Badge - Smaller, subtler */}
              <div className="absolute top-3 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-white/3 backdrop-blur-md border border-white/5 rounded-full">
                <p className="text-[6px] font-bold tracking-[0.2em] text-white/50 uppercase">
                  Lensra Gift
                </p>
              </div>
              
              {/* Tier Indicator - Compact */}
              <div className="absolute top-3 right-3">
                <motion.div 
                  className="p-1 bg-white/3 backdrop-blur-md border border-white/5 rounded-full"
                  animate={tierKey === 'premium' ? { rotate: 360 } : {}}
                  transition={tierKey === 'premium' ? { duration: 30, repeat: Infinity, ease: "linear" } : {}}
                >
                  {tierConfig.icon}
                </motion.div>
              </div>
              
              {/* Animated Icon - Smaller scale */}
              <motion.div 
                className="relative mb-4"
                animate={getAnimationVariant()}
              >
                <div className="relative z-10 scale-150">
                  {config.icon}
                </div>
                <motion.div 
                  className={`absolute inset-0 ${tierConfig.glowIntensity} scale-125 rounded-full`}
                  style={{ backgroundColor: config.color }}
                  animate={{
                    opacity: tierKey === 'premium' ? [0.4, 0.7, 0.4] : [0.3, 0.6, 0.3],
                    scale: tierKey === 'premium' ? [1.2, 1.5, 1.2] : [1.1, 1.4, 1.1]
                  }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                />
              </motion.div>

              {/* Message Hint - Cleaner typography */}
              <div className="space-y-1 mb-8 px-4">
                <motion.p 
                  className="text-white/80 font-bold text-base uppercase tracking-tight"
                  animate={{ opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                >
                  Tap to Reveal
                </motion.p>
                <p className="text-gray-400 font-medium text-[9px] tracking-wide italic">
                  {config.message}
                </p>
              </div>

              {/* Sender Info - Subtler */}
              <div className={`absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 bg-white/3 backdrop-blur-md border ${config.border} rounded-full`}>
                <p className="text-[8px] font-bold uppercase tracking-wider" style={{ color: config.color }}>
                  From {gift.sender_name}
                </p>
              </div>

              {/* Animated Dots - Smaller, smoother */}
              <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-1">
                {[0, 1, 2].map(i => (
                  <motion.div 
                    key={i}
                    className="w-1 h-1 rounded-full"
                    style={{ backgroundColor: config.color }}
                    animate={{ 
                      opacity: [0.2, 0.8, 0.2],
                      scale: [0.7, 1.1, 0.7]
                    }}
                    transition={{ 
                      repeat: Infinity, 
                      duration: 1.2, 
                      delay: i * 0.15,
                      ease: "easeInOut"
                    }}
                  />
                ))}
              </div>

              {/* Shimmer Effect - Subtler for better UX */}
              <motion.div
                className={`absolute inset-0 bg-gradient-to-r from-transparent ${tierKey === 'premium' ? 'via-white/5' : 'via-white/3'} to-transparent`}
                animate={{
                  x: ['-100%', '100%']
                }}
                transition={{
                  duration: tierKey === 'premium' ? 1.5 : 2.5,
                  repeat: Infinity,
                  repeatDelay: tierKey === 'premium' ? 0.5 : 1.5,
                  ease: "linear"
                }}
              />
            </motion.div>
          </motion.div>
        ) : (
          /* REVEALED CONTENT - Compact layout, max-w-sm for smaller feel */
          <motion.div 
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="z-10 max-w-sm w-full flex flex-col items-center px-4 pt-6 pb-16"
          >
            {/* Occasion & Tier Badge - Horizontal, compact */}
            <motion.div 
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="flex items-center gap-1.5 mb-6"
            >
              <div className={`px-2 py-1 rounded-full border ${config.border} bg-white/3 backdrop-blur-md flex items-center gap-1`}>
                {config.icon}
                <span className="text-[8px] font-bold uppercase tracking-wider" style={{ color: config.color }}>
                  {config.label}
                </span>
              </div>
              
              <div className="px-2 py-1 rounded-full border border-zinc-800 bg-zinc-950/50 backdrop-blur-md flex items-center gap-1">
                {tierConfig.icon}
                <span className="text-[8px] font-bold uppercase tracking-wider text-gray-400">
                  {tierConfig.label}
                </span>
              </div>
            </motion.div>

            {/* Main Message Card - Adaptive padding, rounded */}
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ type: "spring", damping: 25, delay: 0.2 }}
              className="w-full relative"
            >
              <div 
                className={`w-full bg-gradient-to-br from-zinc-950/90 to-black/90 backdrop-blur-xl ${tierConfig.borderWidth} ${config.border} rounded-3xl ${tierConfig.revealCardPadding} text-center relative overflow-hidden ${config.shadow} shadow-lg`}
              >
                {/* Decorative Elements - Subtler for premium/standard */}
                {tierConfig.showExtraEffects && (
                  <>
                    <motion.div
                      className="absolute top-4 right-4 opacity-10"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                    >
                      <Sparkles className="w-4 h-4 text-white" />
                    </motion.div>
                    
                    <motion.div
                      className="absolute bottom-4 left-4 opacity-10"
                      animate={{ rotate: -360 }}
                      transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                    >
                      {config.icon}
                    </motion.div>
                  </>
                )}

                {/* Message Content - With typing effect */}
                <div className="relative z-10 space-y-4">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    <p className="text-[7px] font-bold uppercase tracking-[0.3em] mb-3" style={{ color: config.color }}>
                      {gift.occasion_name}
                    </p>
                    
                    <motion.p 
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                      className={`text-base md:text-xl font-medium leading-relaxed text-white tracking-tight ${
                        config.textStyle === 'romantic' ? 'italic font-serif' :
                        config.textStyle === 'festive' ? 'font-extrabold uppercase' :
                        config.textStyle === 'uplifting' ? 'font-semibold' :
                        'font-normal'
                      }`}
                      style={{ 
                        lineHeight: '1.5',
                        textShadow: tierKey === 'premium' ? `0 0 20px ${config.color}30` : `0 0 10px ${config.color}20`
                      }}
                    >
                      "{displayedMessage}"
                    </motion.p>
                  </motion.div>

                  {/* Video Message Player - Premium tier */}
                  {gift.video_message && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }} 
                      animate={{ opacity: 1, scale: 1 }} 
                      transition={{ delay: 0.8 }}
                      className={`mt-4 p-3 bg-white/3 backdrop-blur-md border ${config.border} rounded-xl`}
                    >
                      <video 
                        ref={setVideoElement}
                        src={getMediaUrl(gift.video_message)}
                        controls
                        playsInline
                        className="w-full rounded-lg"
                      />
                    </motion.div>
                  )}

                  {/* Voice Message Player - Standard/Premium (if no video) */}
                  {!gift.video_message && gift.voice_message && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }} 
                      animate={{ opacity: 1, scale: 1 }} 
                      transition={{ delay: 0.8 }}
                      className={`mt-4 p-3 bg-white/3 backdrop-blur-md border ${config.border} rounded-xl`}
                    >
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setAudioPlaying(!audioPlaying)}
                          className="p-1.5 rounded-full transition-all hover:scale-105"
                          style={{ backgroundColor: `${config.color}10` }}
                        >
                          {audioPlaying ? (
                            <Pause className="w-3.5 h-3.5" style={{ color: config.color }} />
                          ) : (
                            <Play className="w-3.5 h-3.5" style={{ color: config.color }} />
                          )}
                        </button>
                        <div className="flex-1 flex items-center gap-1.5">
                          <Volume2 className="w-3.5 h-3.5 text-gray-400" />
                          <span className="text-[9px] font-semibold text-gray-400">Voice Note</span>
                        </div>
                      </div>
                      <audio 
                        ref={setAudioElement}
                        src={getMediaUrl(gift.voice_message)}
                        className="hidden"
                      />
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Sender Info - Cleaner, smaller */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 0.9 }}
              className="mt-6 text-center space-y-0.5"
            >
              <p className="text-gray-500 font-semibold uppercase text-[7px] tracking-[0.2em]">Sent with care by</p>
              <p 
                className="text-white font-bold italic uppercase text-lg tracking-tight"
                style={{ textShadow: `0 0 15px ${config.color}30` }}
              >
                {gift.sender_name}
              </p>
            </motion.div>

            {/* Action Buttons - Grid layout, compact */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 1.1 }}
              className="mt-8 w-full space-y-2"
            >
              <div className="grid grid-cols-2 gap-1.5">
                <motion.button 
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center justify-center gap-1.5 py-2.5 bg-zinc-950/80 border border-zinc-900 rounded-2xl text-[8px] font-bold uppercase tracking-wide hover:border-gray-300 hover:bg-gray-300 hover:text-black transition-all"
                >
                  <Heart className="w-3 h-3" /> React
                </motion.button>
                <motion.button 
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({ 
                        title: `${config.label} from ${gift.sender_name}`,
                        text: gift.text_message,
                        url: window.location.href 
                      });
                    }
                  }}
                  className="flex items-center justify-center gap-1.5 py-2.5 bg-zinc-950/80 border border-zinc-900 rounded-2xl text-[8px] font-bold uppercase tracking-wide hover:border-gray-300 hover:bg-gray-300 hover:text-black transition-all"
                >
                  <Share2 className="w-3 h-3" /> Share
                </motion.button>
              </div>
              
              <motion.a 
                href="/digital-gifts/create"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="w-full py-3 flex items-center justify-center gap-1.5 rounded-2xl text-[9px] font-bold uppercase tracking-wider shadow-md transition-all"
                style={{
                  backgroundColor: config.color,
                  color: '#ffffff',
                  boxShadow: `0 5px 20px ${config.color}30`
                }}
              >
                Reply with Gift <Gift className="w-3.5 h-3.5" />
              </motion.a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}