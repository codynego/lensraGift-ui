"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Heart, Sparkles, ShieldCheck } from 'lucide-react';

export default function DramaticSecretReveal({ 
  sender = "A Special Soul", 
  message = "In a world full of temporary things, you are my forever. Every day with you is a gift I never expected, but always needed."
}) {
  const [isRevealed, setIsRevealed] = useState(false);
  const [displayText, setDisplayText] = useState("");

  // Typewriter effect logic
  useEffect(() => {
    if (isRevealed && displayText.length < message.length) {
      const timeout = setTimeout(() => {
        setDisplayText(message.slice(0, displayText.length + 1));
      }, 50); // Speed of typing
      return () => clearTimeout(timeout);
    }
  }, [isRevealed, displayText, message]);

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 overflow-hidden selection:bg-red-500/30">
      <AnimatePresence mode="wait">
        {!isRevealed ? (
          /* --- STAGE 1: THE VIGIL (PRE-REVEAL) --- */
          <motion.div 
            key="lock-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.2, filter: "blur(20px)" }}
            transition={{ duration: 1 }}
            className="relative z-10 text-center"
          >
            {/* Pulsing Lock Icon */}
            <motion.div 
              animate={{ 
                boxShadow: ["0 0 20px rgba(220,38,38,0.2)", "0 0 60px rgba(220,38,38,0.5)", "0 0 20px rgba(220,38,38,0.2)"] 
              }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="w-24 h-24 bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-10 border border-white/10 shadow-2xl"
            >
              <Lock className="w-8 h-8 text-red-600" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <h2 className="text-[10px] font-black uppercase tracking-[0.6em] text-red-600 mb-4">
                Encrypted Connection Established
              </h2>
              <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter text-white mb-8 uppercase leading-none">
                {sender} <br />
                <span className="text-zinc-700">Sent a Secret.</span>
              </h1>
              
              <button 
                onClick={() => setIsRevealed(true)}
                className="group relative px-12 py-6 bg-white text-black rounded-full font-black uppercase tracking-[0.3em] text-[10px] transition-all hover:bg-red-600 hover:text-white active:scale-95 overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-3">
                  Unlock Emotion <Sparkles className="w-4 h-4" />
                </span>
                {/* Button Glow Effect */}
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  animate={{ x: ['-100%', '100%'] }}
                  transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                />
              </button>
            </motion.div>
          </motion.div>
        ) : (
          /* --- STAGE 2: THE REVEAL (POST-REVEAL) --- */
          <motion.div 
            key="content-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2 }}
            className="w-full max-w-3xl flex flex-col items-center relative z-10"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
              className="mb-12"
            >
              <Heart className="w-12 h-12 text-red-600 fill-red-600 animate-pulse" />
            </motion.div>

            {/* Typewriter Message */}
            <div className="min-h-[200px] flex items-center justify-center">
              <p className="text-3xl md:text-5xl font-serif italic text-white text-center leading-[1.4] md:leading-[1.4] px-4 bg-clip-text">
                {displayText}
                <motion.span 
                  animate={{ opacity: [1, 0] }}
                  transition={{ repeat: Infinity, duration: 0.8 }}
                  className="inline-block w-1 h-10 bg-red-600 ml-2 align-middle"
                />
              </p>
            </div>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 3 }}
              className="mt-20 flex flex-col items-center gap-4"
            >
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500">
                <ShieldCheck className="w-4 h-4" /> Strictly Confidential
              </div>
              <div className="h-[1px] w-24 bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Atmospheric Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-[radial-gradient(circle_at_center,rgba(220,38,38,0.05)_0%,transparent_70%)]" />
        {/* Animated Dust Particles (CSS only for performance) */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20" />
      </div>
    </div>
  );
}