"use client";

import { useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, Heart, Cake, Gift, Smile, 
  Type, Mic, Video, Calendar, CreditCard, 
  ArrowRight, ArrowLeft, Check, Loader2, Upload, 
  X, Smartphone, ShoppingBag 
} from 'lucide-react';

// Pricing Configuration
const PRICING = {
  tiers: { basic: 1999, standard: 3999, premium: 5999 },
  addons: { animation: 1500, schedule: 500, physicalCard: 1500, multiFormat: 2000 }
};

export default function GiftWizard() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Gift State
  const [formData, setFormData] = useState({
    occasion: '',
    tier: 'basic',
    addons: [] as string[],
    message: '',
    recipientContact: '',
    deliveryDate: '',
    physicalAddress: '',
  });

  // Calculate Total
  const totalPrice = useMemo(() => {
    let total = PRICING.tiers[formData.tier as keyof typeof PRICING.tiers];
    formData.addons.forEach(addon => {
      total += PRICING.addons[addon as keyof typeof PRICING.addons];
    });
    return total;
  }, [formData.tier, formData.addons]);

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const toggleAddon = (id: string) => {
    setFormData(prev => ({
      ...prev,
      addons: prev.addons.includes(id) 
        ? prev.addons.filter(a => a !== id) 
        : [...prev.addons, id]
    }));
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-red-600 pb-32">
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-zinc-900 z-50">
        <motion.div 
          className="h-full bg-red-600" 
          initial={{ width: "0%" }}
          animate={{ width: `${(step / 8) * 100}%` }}
        />
      </div>

      <main className="max-w-3xl mx-auto px-6 pt-24">
        
        <AnimatePresence mode="wait">
          {/* STEP 1: OCCASION */}
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: -20 }} className="space-y-12">
              <header className="space-y-4">
                <span className="text-red-600 text-[10px] font-black uppercase tracking-[0.4em]">Step 01</span>
                <h2 className="text-5xl font-black italic uppercase tracking-tighter">The Occasion</h2>
              </header>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { id: 'birthday', label: 'Birthday', icon: Cake },
                  { id: 'love', label: 'Love', icon: Heart },
                  { id: 'friendship', label: 'Friendship', icon: Smile },
                  { id: 'congrats', label: 'Congrats', icon: Sparkles },
                ].map((item) => (
                  <button 
                    key={item.id}
                    onClick={() => { setFormData({...formData, occasion: item.id}); nextStep(); }}
                    className={`p-10 rounded-[32px] border-2 transition-all flex flex-col items-center gap-4 ${formData.occasion === item.id ? 'border-red-600 bg-red-600/5' : 'border-zinc-800 hover:border-zinc-600'}`}
                  >
                    <item.icon className="w-8 h-8" />
                    <span className="text-[10px] font-black uppercase tracking-widest">{item.label}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* STEP 2: TIER SELECTION */}
          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-12">
              <header className="space-y-4">
                <span className="text-red-600 text-[10px] font-black uppercase tracking-[0.4em]">Step 02</span>
                <h2 className="text-5xl font-black italic uppercase tracking-tighter">Experience Tier</h2>
              </header>
              <div className="space-y-4">
                {[
                  { id: 'basic', label: 'Basic', desc: 'Text Message Only', price: '₦1,999' },
                  { id: 'standard', label: 'Standard', desc: 'Text + Voice Note', price: '₦3,999' },
                  { id: 'premium', label: 'Premium', desc: 'Text, Voice, Video + Animation', price: '₦5,999' },
                ].map((tier) => (
                  <button 
                    key={tier.id}
                    onClick={() => setFormData({...formData, tier: tier.id})}
                    className={`w-full p-8 rounded-[32px] border-2 flex justify-between items-center transition-all ${formData.tier === tier.id ? 'border-red-600 bg-red-600/5' : 'border-zinc-800 hover:border-zinc-700'}`}
                  >
                    <div className="text-left">
                      <p className="font-black italic uppercase text-xl">{tier.label}</p>
                      <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{tier.desc}</p>
                    </div>
                    <p className="font-black text-red-600">{tier.price}</p>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* STEP 3: ADD-ONS */}
          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-12">
              <header className="space-y-4">
                <h2 className="text-5xl font-black italic uppercase tracking-tighter leading-none">Enhance <br/><span className="text-red-600">The Gift</span></h2>
              </header>
              <div className="space-y-4">
                {[
                  { id: 'animation', label: 'Premium Animation', price: 1500, icon: Sparkles },
                  { id: 'schedule', label: 'Scheduled Delivery', price: 500, icon: Calendar },
                  { id: 'physicalCard', label: 'Physical QR Card', price: 1500, icon: CreditCard },
                ].map((addon) => (
                  <div 
                    key={addon.id}
                    onClick={() => toggleAddon(addon.id)}
                    className={`w-full p-8 rounded-[32px] border-2 cursor-pointer flex justify-between items-center transition-all ${formData.addons.includes(addon.id) ? 'border-red-600 bg-red-600/5' : 'border-zinc-800'}`}
                  >
                    <div className="flex items-center gap-6">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${formData.addons.includes(addon.id) ? 'bg-red-600 border-red-600' : 'border-zinc-700'}`}>
                        {formData.addons.includes(addon.id) && <Check className="w-3 h-3 text-white" />}
                      </div>
                      <p className="font-black italic uppercase tracking-tight">{addon.label}</p>
                    </div>
                    <p className="text-[10px] font-black text-zinc-500">+₦{addon.price.toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* STEP 4: PERSONALIZE */}
          {step === 4 && (
            <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-12">
              <header className="space-y-4">
                <h2 className="text-5xl font-black italic uppercase tracking-tighter">Personalize</h2>
              </header>
              <div className="space-y-8">
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">Your Message</label>
                  <textarea 
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    placeholder="Type the magic words..."
                    className="w-full bg-zinc-900 border-2 border-zinc-800 rounded-[32px] p-8 text-sm font-bold uppercase outline-none focus:border-red-600 min-h-[150px] resize-none"
                  />
                </div>
                
                {/* Conditional Media Uploads based on Tier */}
                {formData.tier !== 'basic' && (
                  <div className="grid grid-cols-2 gap-4">
                    <button className="p-8 bg-zinc-900 rounded-[32px] border-2 border-dashed border-zinc-800 flex flex-col items-center gap-3 hover:border-red-600 transition-all">
                      <Mic className="w-6 h-6 text-zinc-500" />
                      <span className="text-[9px] font-black uppercase tracking-widest">Voice Record</span>
                    </button>
                    {formData.tier === 'premium' && (
                      <button className="p-8 bg-zinc-900 rounded-[32px] border-2 border-dashed border-zinc-800 flex flex-col items-center gap-3 hover:border-red-600 transition-all">
                        <Video className="w-6 h-6 text-zinc-500" />
                        <span className="text-[9px] font-black uppercase tracking-widest">Upload Video</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* STEP 5: RECIPIENT */}
          {step === 5 && (
            <motion.div key="step5" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-12">
              <header className="space-y-4">
                <h2 className="text-5xl font-black italic uppercase tracking-tighter">Delivery</h2>
              </header>
              <div className="space-y-6">
                <input 
                  type="text"
                  placeholder="RECIPIENT WHATSAPP OR EMAIL"
                  value={formData.recipientContact}
                  onChange={(e) => setFormData({...formData, recipientContact: e.target.value})}
                  className="w-full bg-zinc-900 border-2 border-zinc-800 rounded-full px-8 py-6 text-xs font-black uppercase tracking-widest outline-none focus:border-red-600"
                />
                
                {formData.addons.includes('physicalCard') && (
                  <textarea 
                    placeholder="PHYSICAL SHIPPING ADDRESS"
                    value={formData.physicalAddress}
                    onChange={(e) => setFormData({...formData, physicalAddress: e.target.value})}
                    className="w-full bg-zinc-900 border-2 border-zinc-800 rounded-[32px] p-8 text-xs font-black uppercase tracking-widest outline-none focus:border-red-600 min-h-[100px]"
                  />
                )}
              </div>
            </motion.div>
          )}

          {/* STEP 6: PREVIEW & CONFIRM */}
          {step === 6 && (
            <motion.div key="step6" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-12">
              <header className="text-center space-y-4">
                <h2 className="text-5xl font-black italic uppercase tracking-tighter">Review</h2>
                <p className="text-red-600 text-[10px] font-black uppercase tracking-widest">Double check the details</p>
              </header>
              
              <div className="bg-zinc-900 rounded-[40px] p-10 space-y-8 border border-zinc-800">
                <div className="flex justify-between border-b border-zinc-800 pb-6">
                  <span className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">Occasion</span>
                  <span className="font-black italic uppercase">{formData.occasion}</span>
                </div>
                <div className="flex justify-between border-b border-zinc-800 pb-6">
                  <span className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">Tier</span>
                  <span className="font-black italic uppercase">{formData.tier}</span>
                </div>
                <div className="space-y-2">
                   <span className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">Message Preview</span>
                   <p className="text-sm font-bold uppercase text-zinc-300 italic">"{formData.message}"</p>
                </div>
              </div>

              <div className="flex justify-between items-center p-8 bg-white text-black rounded-[32px]">
                <p className="text-[10px] font-black uppercase tracking-widest">Total Amount</p>
                <p className="text-3xl font-black italic uppercase tracking-tighter">₦{totalPrice.toLocaleString()}</p>
              </div>
            </motion.div>
          )}

          {/* STEP 7: SUCCESS */}
          {step === 7 && (
            <motion.div key="step7" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-12 py-12">
              <div className="w-24 h-24 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-red-600/40">
                <Check className="w-12 h-12 text-white" strokeWidth={3} />
              </div>
              <h2 className="text-6xl font-black italic uppercase tracking-tighter leading-none">Gift <br/><span className="text-red-600">Locked In.</span></h2>
              <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest max-w-xs mx-auto">Your surprise is being processed in our lab. They'll receive it soon.</p>
              <button 
                onClick={() => setStep(1)}
                className="px-12 py-6 bg-white text-black rounded-full text-[10px] font-black uppercase tracking-[0.3em] hover:bg-red-600 hover:text-white transition-all"
              >
                Create Another Gift
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation Controls */}
        {step < 7 && (
          <div className="fixed bottom-12 left-1/2 -translate-x-1/2 w-full max-w-3xl px-6 flex justify-between items-center z-40">
            {step > 1 ? (
              <button onClick={prevStep} className="w-16 h-16 rounded-full border-2 border-zinc-800 bg-black flex items-center justify-center hover:border-white transition-all">
                <ArrowLeft className="w-6 h-6" />
              </button>
            ) : <div />}

            <button 
              onClick={step === 6 ? nextStep : nextStep} 
              className="px-12 py-6 bg-white text-black rounded-full text-[10px] font-black uppercase tracking-[0.3em] hover:bg-red-600 hover:text-white transition-all shadow-2xl flex items-center gap-4"
            >
              {step === 6 ? "Confirm & Pay" : "Continue"} <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

      </main>
    </div>
  );
}