"use client";
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles, ArrowRight, Play, MessageSquare,
  Calendar, Heart, Video, Mic, Gift,
  ChevronDown, Smartphone, Star, Zap, Clock
} from 'lucide-react';
export default function ClientDigitalGifts() {
  const [revealed, setRevealed] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-zinc-950 to-black text-white selection:bg-red-600">
   
      {/* HERO SECTION */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-20 overflow-hidden">
        {/* Animated background grid */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:64px_64px]" />
          <motion.div
            className="absolute top-20 left-20 w-72 h-72 bg-red-600/20 rounded-full blur-[120px]"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{ duration: 8, repeat: Infinity }}
          />
          <motion.div
            className="absolute bottom-20 right-20 w-96 h-96 bg-red-700/20 rounded-full blur-[120px]"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.2, 0.4, 0.2]
            }}
            transition={{ duration: 10, repeat: Infinity }}
          />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10 text-center space-y-6 sm:space-y-8 max-w-5xl w-full"
        >
          {/* Badge */}
          <motion.div
            className="inline-flex items-center gap-2 sm:gap-3 px-3 sm:px-5 py-2 sm:py-2.5 border border-red-600/30 rounded-full bg-gradient-to-r from-red-600/10 to-red-600/10 backdrop-blur-sm"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
          >
            <motion.div
              className="w-2 h-2 rounded-full bg-red-600"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span className="text-[10px] sm:text-xs font-bold tracking-wider text-red-400">
              THE FUTURE OF GIFTING
            </span>
          </motion.div>
          {/* Main headline */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-black leading-[0.9] tracking-tight">
            Messages That
            <br />
            <span className="bg-gradient-to-r from-red-600 via-red-500 to-red-600 bg-clip-text text-transparent">
              Feel Like Magic
            </span>
          </h1>
         
          <p className="max-w-2xl mx-auto text-zinc-400 text-sm sm:text-base md:text-lg leading-relaxed px-4">
            Transform your words into unforgettable moments. Add your voice, face, and heart to every message.
            They'll remember this forever.
          </p>
          {/* Interactive Demo Card */}
          <div className="pt-8 sm:pt-12 relative max-w-md mx-auto px-4">
            <motion.div
              whileHover={{ scale: 1.03, rotateY: 5 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setRevealed(!revealed)}
              className="aspect-[5/3] bg-gradient-to-br from-zinc-900 to-zinc-950 border-2 border-slate-800 rounded-3xl sm:rounded-[40px] overflow-hidden cursor-pointer relative shadow-2xl shadow-red-600/10 transition-all hover:border-red-600/50 hover:shadow-red-600/30"
              style={{ transformStyle: 'preserve-3d' }}
            >
              <AnimatePresence mode="wait">
                {!revealed ? (
                  <motion.div
                    key="closed"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="absolute inset-0 flex flex-col items-center justify-center p-6 sm:p-8 text-center bg-gradient-to-br from-zinc-900 via-zinc-950 to-black"
                  >
                    <motion.div
                      animate={{
                        y: [0, -12, 0],
                        rotateZ: [0, 5, -5, 0]
                      }}
                      transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                      className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-red-600 to-red-700 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-red-600/50"
                    >
                      <Gift className="text-white w-8 h-8 sm:w-10 sm:h-10" />
                    </motion.div>
                    <p className="text-xs sm:text-sm font-bold tracking-wider mb-2">Tap to reveal</p>
                    <p className="text-[10px] sm:text-xs text-zinc-500">Your message awaits...</p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="open"
                    initial={{ opacity: 0, scale: 0.8, rotateY: -20 }}
                    animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                    className="absolute inset-0 bg-gradient-to-br from-white to-zinc-100 flex flex-col items-center justify-center p-6 sm:p-10 text-black"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      <Heart className="w-12 h-12 sm:w-16 sm:h-16 text-red-600 fill-red-600 mb-4" />
                    </motion.div>
                    <p className="text-2xl sm:text-3xl md:text-4xl font-black mb-2">You're Amazing!</p>
                    <p className="text-xs sm:text-sm text-zinc-600">This could be a voice message, video, or anything you imagine</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
            <motion.div
              className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-3/4 h-16 bg-red-600/30 blur-3xl rounded-full -z-10"
              animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
          </div>
          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-8 px-4">
            <a href="/digital-gifts/create" className="w-full sm:w-auto">
              <motion.button
                className="w-full sm:w-auto px-8 sm:px-10 py-4 sm:py-5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-full font-bold text-xs sm:text-sm tracking-wide hover:shadow-2xl hover:shadow-red-600/50 transition-all flex items-center justify-center gap-2 group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Create Your Gift
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </a>
            <motion.button
              className="w-full sm:w-auto px-8 sm:px-10 py-4 sm:py-5 border-2 border-slate-800 bg-zinc-900/50 backdrop-blur-sm rounded-full font-bold text-xs sm:text-sm tracking-wide flex items-center justify-center gap-3 hover:bg-zinc-800 transition-all group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Play className="w-4 h-4 fill-current group-hover:scale-110 transition-transform" />
              See It in Action
            </motion.button>
          </div>
          {/* Social proof */}
          <motion.div
            className="pt-8 sm:pt-12 flex items-center justify-center gap-2 text-zinc-500 text-xs sm:text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <div className="flex -space-x-2">
              {[1,2,3,4].map(i => (
                <div key={i} className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-red-600 to-red-700 border-2 border-black" />
              ))}
            </div>
            <span>Join <strong className="text-white">10,000+</strong> people creating magical moments</span>
          </motion.div>
        </motion.div>
      </section>
      {/* WHY IT MATTERS */}
      <section className="py-16 sm:py-24 lg:py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-zinc-950 to-zinc-900">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <motion.div
            className="space-y-6 sm:space-y-8"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-block px-4 py-2 bg-red-600/10 border border-red-600/20 rounded-full">
              <span className="text-xs font-bold text-red-400 tracking-wider">WHY CHOOSE US</span>
            </div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black leading-tight">
              Because Words
              <br />
              <span className="text-red-600">Deserve More</span>
            </h2>
            <div className="space-y-4 sm:space-y-6 text-zinc-400 text-sm sm:text-base leading-relaxed">
              <p className="text-base sm:text-lg">
                A text message fades. But your voice? Your face? The emotion in your eyes?
                <strong className="text-white"> That stays forever.</strong>
              </p>
              <p>
                We've made it ridiculously simple to send gifts that make people cry happy tears.
                No apps to download. No complicated setup. Just pure, unfiltered emotion delivered
                with a tap.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-4">
              {[
                { num: "10k+", label: "Gifts Sent" },
                { num: "4.9★", label: "Average Rating" }
              ].map((stat, i) => (
                <div key={i} className="bg-zinc-800/50 backdrop-blur-sm p-4 sm:p-6 rounded-2xl border border-slate-800">
                  <div className="text-2xl sm:text-3xl font-black text-red-600">{stat.num}</div>
                  <div className="text-xs sm:text-sm text-zinc-500 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </motion.div>
          <motion.div
            className="grid grid-cols-2 gap-3 sm:gap-4"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              className="aspect-[3/4] bg-gradient-to-br from-red-600 to-red-700 rounded-3xl sm:rounded-[40px] border border-white/10 overflow-hidden rotate-[-3deg] shadow-2xl"
              whileHover={{ rotate: 0, scale: 1.05 }}
            >
              <div className="p-4 sm:p-6 flex flex-col h-full justify-between">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <Mic className="w-5 h-5 sm:w-6 sm:h-6 text-white"/>
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-bold text-white/80 mb-1">Voice Message</p>
                  <p className="text-lg sm:text-xl font-black text-white">"Mom cried for an hour"</p>
                </div>
              </div>
            </motion.div>
            <motion.div
              className="aspect-[3/4] bg-gradient-to-br from-zinc-900 to-black rounded-3xl sm:rounded-[40px] border border-slate-800 overflow-hidden translate-y-8 sm:translate-y-12 rotate-[3deg] shadow-2xl"
              whileHover={{ rotate: 0, scale: 1.05 }}
            >
              <div className="p-4 sm:p-6 flex flex-col h-full justify-between bg-gradient-to-b from-red-600/20 to-transparent">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-white flex items-center justify-center">
                  <Video className="w-5 h-5 sm:w-6 sm:h-6 text-black"/>
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-bold text-zinc-400 mb-1">Video Surprise</p>
                  <p className="text-lg sm:text-xl font-black">"Best birthday ever!"</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
      {/* HOW IT WORKS */}
      <section className="py-16 sm:py-24 lg:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-12 sm:mb-16 lg:mb-20 space-y-4">
          <motion.div
            className="inline-block px-4 py-2 bg-red-600/10 border border-red-600/20 rounded-full"
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <span className="text-xs font-bold text-red-400 tracking-wider">SO SIMPLE</span>
          </motion.div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black">Create Magic in 3 Steps</h2>
          <p className="text-zinc-500 max-w-2xl mx-auto text-sm sm:text-base">No downloads. No accounts. Just you and your message.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6 sm:gap-8 relative">
          {/* Connection lines for desktop */}
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-red-600/20 to-transparent -translate-y-1/2 -z-10" />
         
          {[
            {
              step: "1",
              title: "Pick Your Moment",
              icon: Sparkles,
              desc: "Birthday? Anniversary? Just because? Choose what feels right.",
              color: "from-red-600 to-red-500"
            },
            {
              step: "2",
              title: "Add Your Magic",
              icon: Heart,
              desc: "Record your voice, shoot a quick video, or write something beautiful.",
              color: "from-red-600 to-red-700"
            },
            {
              step: "3",
              title: "Send & Smile",
              icon: Zap,
              desc: "Share instantly via link, or mail them a beautiful QR card.",
              color: "from-red-500 to-red-600"
            }
          ].map((item, idx) => (
            <motion.div
              key={idx}
              className="relative bg-gradient-to-br from-zinc-900 to-zinc-950 p-6 sm:p-8 lg:p-10 rounded-3xl sm:rounded-[40px] border border-slate-800 space-y-4 sm:space-y-6 hover:border-red-600/50 transition-all group"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.15 }}
              whileHover={{ y: -8, scale: 1.02 }}
            >
              <div className="flex items-start justify-between">
                <div className={`w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br ${item.color} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                  <item.icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                </div>
                <span className="text-5xl sm:text-6xl font-black text-zinc-800 group-hover:text-zinc-700 transition-colors">
                  {item.step}
                </span>
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-black mb-2 sm:mb-3">{item.title}</h3>
                <p className="text-zinc-500 text-sm sm:text-base leading-relaxed">{item.desc}</p>
              </div>
              <motion.div
                className="pt-2 sm:pt-4 flex items-center gap-2 text-red-600 font-bold text-xs sm:text-sm group-hover:gap-4 transition-all cursor-pointer"
                whileHover={{ x: 4 }}
              >
                Learn More <ArrowRight className="w-4 h-4" />
              </motion.div>
            </motion.div>
          ))}
        </div>
      </section>
      {/* FEATURES GRID */}
      <section className="py-16 sm:py-24 lg:py-32 px-4 sm:px-6 lg:px-8 bg-black text-white overflow-hidden rounded-t-[40px] sm:rounded-t-[80px]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="mb-12 sm:mb-16 lg:mb-20"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black mb-4 sm:mb-6">
              Packed With
              <br />
              <span className="bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent">
                Everything You Need
              </span>
            </h2>
            <p className="text-zinc-400 max-w-2xl text-sm sm:text-base">
              We've thought of every detail so you don't have to.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {[
              {
                title: "Stunning Animations",
                icon: Star,
                desc: "Watch their eyes light up with beautiful reveal effects",
                gradient: "from-red-600 to-red-500"
              },
              {
                title: "Schedule Delivery",
                icon: Clock,
                desc: "Set it to arrive at the perfect moment, down to the minute",
                gradient: "from-red-600 to-red-700"
              },
              {
                title: "Physical Cards",
                icon: Gift,
                desc: "Get gorgeous printed QR cards mailed to their door",
                gradient: "from-red-500 to-red-600"
              },
              {
                title: "Mix Media",
                icon: Video,
                desc: "Combine text, voice clips, videos, and photos seamlessly",
                gradient: "from-red-700 to-red-600"
              },
              {
                title: "No App Needed",
                icon: Smartphone,
                desc: "They just tap the link. Works on any device, anywhere",
                gradient: "from-red-600 to-red-500"
              },
              {
                title: "Unlimited Views",
                icon: Heart,
                desc: "They can relive the moment as many times as they want",
                gradient: "from-red-600 to-red-700"
              },
              {
                title: "Privacy First",
                icon: MessageSquare,
                desc: "Encrypted and private. Only they can see your message",
                gradient: "from-red-500 to-red-600"
              },
              {
                title: "Instant Sharing",
                icon: Zap,
                desc: "Share via text, email, social media, or QR code",
                gradient: "from-red-700 to-red-600"
              }
            ].map((f, i) => (
              <motion.div
                key={i}
                className="bg-zinc-950 p-6 sm:p-8 rounded-3xl border-2 border-slate-800 hover:border-red-300 transition-all space-y-4 group"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ y: -4 }}
              >
                <div className={`w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br ${f.gradient} rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform`}>
                  <f.icon className="w-6 h-6 sm:w-7 sm:h-7" />
                </div>
                <div>
                  <h4 className="text-lg sm:text-xl font-black mb-2">{f.title}</h4>
                  <p className="text-zinc-400 text-sm leading-relaxed">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      {/* LIMITED OFFER */}
      <section className="py-16 sm:py-24 lg:py-32 px-4 sm:px-6 lg:px-8">
        <motion.div
          className="max-w-4xl mx-auto bg-gradient-to-br from-red-600 via-red-600 to-red-700 p-1 rounded-[40px] sm:rounded-[60px]"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
        >
          <div className="bg-black p-8 sm:p-12 lg:p-16 rounded-[38px] sm:rounded-[58px] text-center space-y-6 sm:space-y-8 relative overflow-hidden">
            <motion.div
              className="absolute top-0 right-0 w-64 h-64 sm:w-96 sm:h-96 bg-red-600/20 rounded-full blur-[100px]"
              animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
              transition={{ duration: 5, repeat: Infinity }}
            />
            <motion.div
              className="absolute bottom-0 left-0 w-64 h-64 sm:w-96 sm:h-96 bg-red-600/20 rounded-full blur-[100px]"
              animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.4, 0.2] }}
              transition={{ duration: 7, repeat: Infinity }}
            />
           
            <div className="relative z-10 space-y-6 sm:space-y-8">
              <div className="inline-block px-5 py-2 bg-red-600/20 border border-red-600/30 rounded-full">
                <span className="text-xs sm:text-sm font-bold text-red-300 tracking-wider">LIMITED TIME OFFER</span>
              </div>
             
              <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black leading-tight">
                Start Free.<br />Make Someone's Day.
              </h2>
             
              <p className="text-zinc-400 text-sm sm:text-base max-w-xl mx-auto">
                First 100 gifts this month are completely free. No credit card.
                No strings attached. Just pure joy.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-4">
                <motion.button
                  className="w-full sm:w-auto px-10 sm:px-12 py-5 sm:py-6 bg-white text-black rounded-full font-black text-sm tracking-wide hover:scale-105 transition-transform shadow-2xl"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Claim Your Free Gift
                </motion.button>
                <p className="text-xs sm:text-sm text-zinc-500">
                  <strong className="text-red-400">87 spots</strong> left
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </section>
      {/* FAQ */}
      <section className="py-16 sm:py-24 lg:py-32 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <motion.div
          className="mb-12 sm:mb-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h3 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-4">Questions?</h3>
          <p className="text-zinc-500 text-sm sm:text-base">We've got answers.</p>
        </motion.div>
        <div className="space-y-4 sm:space-y-6">
          {[
            {
              q: "How does the recipient open their gift?",
              a: "They simply click the link you send them or scan the QR code on the card. No app downloads, no sign-ups. It opens instantly in their browser with a beautiful reveal animation."
            },
            {
              q: "Can I schedule when the gift is delivered?",
              a: "Absolutely! You can set the exact date and time for your gift to be revealed. Perfect for birthdays, anniversaries, or surprise moments. You can even send it years in advance!"
            },
            {
              q: "Is my message really private and secure?",
              a: "Yes, 100%. All messages are encrypted end-to-end. Only the person with the unique link can access the content. We never share or sell your data, and you can delete any gift at any time."
            },
            {
              q: "What if I want a physical card instead of just a link?",
              a: "You can order a beautiful, premium-quality QR card that we'll mail directly to their address. It's like giving them a treasure map to your heartfelt message."
            },
            {
              q: "Can I include videos and voice recordings?",
              a: "Yes! You can mix text, voice notes, videos, photos, and even GIFs all in one gift. Make it as personal as you want."
            },
            {
              q: "How much does it cost?",
              a: "Basic digital gifts are free. Premium features like physical cards, advanced animations, and unlimited storage start at just $4.99."
            },
            {
              q: "What devices are supported?",
              a: "Our gifts work on any modern smartphone, tablet, or computer with a web browser. No special software required."
            }
          ].map((faq, index) => (
            <motion.div
              key={index}
              className="bg-zinc-900 p-4 sm:p-6 rounded-3xl border border-slate-800 cursor-pointer overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              onClick={() => setActiveFaq(activeFaq === index ? null : index)}
            >
              <div className="flex justify-between items-center">
                <h4 className="text-base sm:text-lg font-bold">{faq.q}</h4>
                <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${activeFaq === index ? 'rotate-180' : ''}`} />
              </div>
              <AnimatePresence>
                {activeFaq === index && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-4 text-zinc-400 text-sm sm:text-base"
                  >
                    {faq.a}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}