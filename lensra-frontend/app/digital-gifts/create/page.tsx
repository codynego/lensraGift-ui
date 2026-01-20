"use client";

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Gift, ArrowRight, ArrowLeft, Loader2, Check, Mail, User, MapPin, Sparkles, Heart, Star, Calendar, Package, MessageCircle
} from 'lucide-react';
import CheckoutView from '@/components/CheckoutView';

const BaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.lensra.com/";

interface Occasion {
  id: number;
  name: string;
  slug: string;
}

interface ExperienceTier {
  id: number;
  name: string;
  description: string;
  price: string;
  recommended: boolean;
}

interface AddOn {
  id: number;
  name: string;
  price: string;
}

const occasionIcons: { [key: string]: any } = {
  'birthday': Gift,
  'anniversary': Heart,
  'celebration': Sparkles,
  'wedding': Heart,
  'default': Star
};

export default function GiftWizard() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdGiftData, setCreatedGiftData] = useState<{id: number, amount: number} | null>(null);

  const [occasions, setOccasions] = useState<Occasion[]>([]);
  const [tiers, setTiers] = useState<ExperienceTier[]>([]);
  const [addons, setAddons] = useState<AddOn[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  const [formData, setFormData] = useState({
    occasion: null as number | null,
    tier: null as number | null,
    addon_ids: [] as number[],
    text_message: '',
    sender_name: '',
    sender_email: '', 
    recipient_name: '',
    recipient_contact: '', 
    shipping_address: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [occRes, tierRes, addonRes] = await Promise.all([
          fetch(`${BaseUrl}api/digital-gifts/occasions/`),
          fetch(`${BaseUrl}api/digital-gifts/tiers/`),
          fetch(`${BaseUrl}api/digital-gifts/addons/`)
        ]);
        const [occData, tierData, addonData] = await Promise.all([occRes.json(), tierRes.json(), addonRes.json()]);
        setOccasions(Array.isArray(occData) ? occData : occData.results || []);
        setTiers(Array.isArray(tierData) ? tierData : tierData.results || []);
        setAddons(Array.isArray(addonData) ? addonData : addonData.results || []);
      } catch (err) {
        console.error("Initialization error:", err);
      } finally {
        setLoadingData(false);
      }
    };
    fetchData();
  }, []);

  const totalPrice = useMemo(() => {
    const selectedTier = tiers.find(t => t.id === formData.tier);
    const tierPrice = selectedTier ? parseFloat(selectedTier.price) : 0;
    const addonsPrice = formData.addon_ids.reduce((sum, id) => {
      const addon = addons.find(a => a.id === id);
      return sum + parseFloat(addon?.price || "0");
    }, 0);
    return tierPrice + addonsPrice;
  }, [formData.tier, formData.addon_ids, tiers, addons]);

  const handleCreateGift = async () => {
    if (!formData.sender_email || !formData.sender_name) {
      alert("Please provide your name and email to proceed to payment.");
      return;
    }

    setIsSubmitting(true);
    try {
      const params = new URLSearchParams();
      params.append('sender_name', formData.sender_name);
      params.append('sender_email', formData.sender_email);
      params.append('recipient_name', formData.recipient_name);
      params.append('occasion', String(formData.occasion));
      params.append('tier', String(formData.tier));
      params.append('text_message', formData.text_message);
      params.append('shipping_address', formData.shipping_address);
      
      formData.addon_ids.forEach(id => params.append('addon_ids', String(id)));

      const rEmail = formData.recipient_contact.includes('@') ? formData.recipient_contact : '';
      const rPhone = !formData.recipient_contact.includes('@') ? formData.recipient_contact : '';
      params.append('recipient_email', rEmail);
      params.append('recipient_phone', rPhone);

      const res = await fetch(`${BaseUrl}api/digital-gifts/gifts/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params,
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error("Server Error:", errorData);
        throw new Error('Gift creation failed');
      }
      
      const data = await res.json();
      setCreatedGiftData({ id: data.id, amount: totalPrice });
      setStep(6);
    } catch (err) {
      alert('Connection error. Please try again or check your network.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedOccasion = occasions.find(o => o.id === formData.occasion);
  const selectedTier = tiers.find(t => t.id === formData.tier);
  const selectedAddons = addons.filter(a => formData.addon_ids.includes(a.id));

  const canProceed = () => {
    if (step === 1) return formData.occasion !== null;
    if (step === 2) return formData.tier !== null;
    if (step === 4) return formData.sender_name && formData.sender_email;
    if (step === 5) return formData.recipient_name && formData.recipient_contact;
    return true;
  };

  if (loadingData) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-10 h-10 text-red-600 animate-spin mx-auto" />
          <p className="text-xs font-black uppercase text-zinc-500 tracking-wider">Loading Experience...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white pb-40">
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-zinc-900 z-50">
        <motion.div 
          className="h-full bg-gradient-to-r from-red-600 to-red-500" 
          initial={{ width: 0 }}
          animate={{ width: `${(step / 7) * 100}%` }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        />
      </div>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 pt-20 pb-8">
        <AnimatePresence mode="wait">
          {/* Step 1: Choose Occasion */}
          {step === 1 && (
            <motion.div 
              key="step1" 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="space-y-10"
            >
              <header className="space-y-3">
                <span className="text-red-600 text-[9px] font-black uppercase tracking-[0.4em]">Step 1 of 5</span>
                <h2 className="text-3xl md:text-4xl font-black italic uppercase tracking-tighter">Choose the Occasion</h2>
                <p className="text-sm text-zinc-400 font-medium">What's the celebration?</p>
              </header>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {occasions.map((occ) => {
                  const IconComponent = occasionIcons[occ.slug.toLowerCase()] || occasionIcons.default;
                  const isSelected = formData.occasion === occ.id;
                  
                  return (
                    <motion.button 
                      key={occ.id} 
                      onClick={() => setFormData({...formData, occasion: occ.id})}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`relative p-8 rounded-3xl border-2 transition-all duration-300 flex flex-col items-center gap-3 group overflow-hidden
                        ${isSelected 
                          ? 'border-red-600 bg-red-600/10 shadow-lg shadow-red-600/20' 
                          : 'border-zinc-800 hover:border-zinc-700 bg-zinc-900/50'}`}
                    >
                      <div className={`p-3 rounded-2xl transition-all ${isSelected ? 'bg-red-600/20' : 'bg-zinc-800 group-hover:bg-zinc-700'}`}>
                        <IconComponent className={`w-6 h-6 ${isSelected ? 'text-red-600' : 'text-zinc-400'}`} />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-wide">{occ.name}</span>
                      {isSelected && (
                        <motion.div 
                          layoutId="occasion-selected"
                          className="absolute top-3 right-3 w-5 h-5 bg-red-600 rounded-full flex items-center justify-center"
                        >
                          <Check className="w-3 h-3 text-white" />
                        </motion.div>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Step 2: Experience Tier */}
          {step === 2 && (
            <motion.div 
              key="step2" 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -20 }}
              className="space-y-10"
            >
              <header className="space-y-3">
                <span className="text-red-600 text-[9px] font-black uppercase tracking-[0.4em]">Step 2 of 5</span>
                <h2 className="text-3xl md:text-4xl font-black italic uppercase tracking-tighter">Choose Experience Level</h2>
                <p className="text-sm text-zinc-400 font-medium">Select the perfect tier for your gift</p>
              </header>
              
              <div className="space-y-4">
                {tiers.map((t) => {
                  const isSelected = formData.tier === t.id;
                  
                  return (
                    <motion.button 
                      key={t.id} 
                      onClick={() => setFormData({...formData, tier: t.id})}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      className={`relative w-full p-6 rounded-3xl border-2 transition-all duration-300 text-left overflow-hidden
                        ${isSelected 
                          ? 'border-red-600 bg-red-600/10 shadow-lg shadow-red-600/20' 
                          : 'border-zinc-800 hover:border-zinc-700 bg-zinc-900/50'}`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-3">
                            <h3 className="font-black italic uppercase text-lg">{t.name}</h3>
                            {t.recommended && (
                              <span className="px-3 py-1 bg-red-600/20 border border-red-600/30 rounded-full text-[9px] font-black uppercase text-red-600 tracking-wide">
                                Recommended
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-zinc-400 font-medium leading-relaxed">{t.description}</p>
                        </div>
                        
                        <div className="flex flex-col items-end gap-2">
                          <span className="font-black text-xl text-red-600">₦{parseFloat(t.price).toLocaleString()}</span>
                          {isSelected && (
                            <motion.div 
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center"
                            >
                              <Check className="w-4 h-4 text-white" />
                            </motion.div>
                          )}
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Step 3: Add-ons */}
          {step === 3 && (
            <motion.div 
              key="step3" 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -20 }}
              className="space-y-10"
            >
              <header className="space-y-3">
                <span className="text-red-600 text-[9px] font-black uppercase tracking-[0.4em]">Step 3 of 5</span>
                <h2 className="text-3xl md:text-4xl font-black italic uppercase tracking-tighter">Add Some Magic</h2>
                <p className="text-sm text-zinc-400 font-medium">Make it extra special (optional)</p>
              </header>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {addons.map((a) => {
                  const isSelected = formData.addon_ids.includes(a.id);
                  
                  return (
                    <motion.div 
                      key={a.id} 
                      onClick={() => setFormData(p => ({ 
                        ...p, 
                        addon_ids: p.addon_ids.includes(a.id) 
                          ? p.addon_ids.filter(id => id !== a.id) 
                          : [...p.addon_ids, a.id] 
                      }))}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`relative p-6 rounded-3xl border-2 cursor-pointer transition-all duration-300
                        ${isSelected 
                          ? 'border-red-600 bg-red-600/10 shadow-lg shadow-red-600/20' 
                          : 'border-zinc-800 hover:border-zinc-700 bg-zinc-900/50'}`}
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-xl transition-all ${isSelected ? 'bg-red-600/20' : 'bg-zinc-800'}`}>
                            <Sparkles className={`w-4 h-4 ${isSelected ? 'text-red-600' : 'text-zinc-400'}`} />
                          </div>
                          <span className="font-black italic uppercase text-sm">{a.name}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-[10px] font-black text-zinc-400">+₦{parseFloat(a.price).toLocaleString()}</span>
                          {isSelected && (
                            <motion.div 
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="w-5 h-5 bg-red-600 rounded-full flex items-center justify-center"
                            >
                              <Check className="w-3 h-3 text-white" />
                            </motion.div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {formData.addon_ids.length === 0 && (
                <p className="text-center text-xs text-zinc-500 font-medium italic">
                  No add-ons selected. Click "Next Step" to continue.
                </p>
              )}
            </motion.div>
          )}

          {/* Step 4: Sender Info */}
          {step === 4 && (
            <motion.div 
              key="step4" 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -20 }}
              className="space-y-10"
            >
              <header className="space-y-3">
                <span className="text-red-600 text-[9px] font-black uppercase tracking-[0.4em]">Step 4 of 5</span>
                <h2 className="text-3xl md:text-4xl font-black italic uppercase tracking-tighter">Your Information</h2>
                <p className="text-sm text-zinc-400 font-medium">Let us know who's sending this gift</p>
              </header>
              
              <div className="space-y-5">
                <div className="relative group">
                  <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 group-focus-within:text-red-600 transition-colors" />
                  <input 
                    placeholder="Your Name" 
                    value={formData.sender_name} 
                    onChange={e => setFormData({...formData, sender_name: e.target.value})} 
                    className="w-full bg-zinc-900/80 border-2 border-zinc-800 rounded-full pl-14 pr-6 py-5 text-xs font-black uppercase outline-none focus:border-red-600 focus:bg-zinc-900 transition-all" 
                  />
                </div>
                
                <div className="relative group">
                  <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 group-focus-within:text-red-600 transition-colors" />
                  <input 
                    type="email"
                    placeholder="Your Email" 
                    value={formData.sender_email} 
                    onChange={e => setFormData({...formData, sender_email: e.target.value})} 
                    className="w-full bg-zinc-900/80 border-2 border-zinc-800 rounded-full pl-14 pr-6 py-5 text-xs font-black uppercase outline-none focus:border-red-600 focus:bg-zinc-900 transition-all" 
                  />
                </div>
                
                <div className="relative group">
                  <MessageCircle className="absolute left-5 top-6 w-5 h-5 text-zinc-500 group-focus-within:text-red-600 transition-colors" />
                  <textarea 
                    placeholder="Write your personal message here... (Optional)" 
                    value={formData.text_message} 
                    onChange={e => setFormData({...formData, text_message: e.target.value})} 
                    className="w-full bg-zinc-900/80 border-2 border-zinc-800 rounded-3xl pl-14 pr-6 py-5 text-sm font-medium outline-none focus:border-red-600 focus:bg-zinc-900 transition-all min-h-[140px] resize-none" 
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 5: Recipient Info */}
          {step === 5 && (
            <motion.div 
              key="step5" 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -20 }}
              className="space-y-10"
            >
              <header className="space-y-3">
                <span className="text-red-600 text-[9px] font-black uppercase tracking-[0.4em]">Step 5 of 5</span>
                <h2 className="text-3xl md:text-4xl font-black italic uppercase tracking-tighter">Recipient Details</h2>
                <p className="text-sm text-zinc-400 font-medium">Who's receiving this special gift?</p>
              </header>
              
              <div className="space-y-5">
                <div className="relative group">
                  <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 group-focus-within:text-red-600 transition-colors" />
                  <input 
                    placeholder="Recipient Name" 
                    value={formData.recipient_name} 
                    onChange={e => setFormData({...formData, recipient_name: e.target.value})} 
                    className="w-full bg-zinc-900/80 border-2 border-zinc-800 rounded-full pl-14 pr-6 py-5 text-xs font-black uppercase outline-none focus:border-red-600 focus:bg-zinc-900 transition-all" 
                  />
                </div>
                
                <div className="relative group">
                  <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 group-focus-within:text-red-600 transition-colors" />
                  <input 
                    placeholder="Email or Phone Number" 
                    value={formData.recipient_contact} 
                    onChange={e => setFormData({...formData, recipient_contact: e.target.value})} 
                    className="w-full bg-zinc-900/80 border-2 border-zinc-800 rounded-full pl-14 pr-6 py-5 text-xs font-black uppercase outline-none focus:border-red-600 focus:bg-zinc-900 transition-all" 
                  />
                </div>
                
                <div className="relative group">
                  <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 group-focus-within:text-red-600 transition-colors" />
                  <input 
                    placeholder="Shipping Address (Optional)" 
                    value={formData.shipping_address} 
                    onChange={e => setFormData({...formData, shipping_address: e.target.value})} 
                    className="w-full bg-zinc-900/80 border-2 border-zinc-800 rounded-full pl-14 pr-6 py-5 text-xs font-black uppercase outline-none focus:border-red-600 focus:bg-zinc-900 transition-all" 
                  />
                </div>
              </div>

              {/* Summary Card */}
              <div className="mt-8 p-6 bg-zinc-900/50 border-2 border-zinc-800 rounded-3xl space-y-4">
                <h3 className="text-xs font-black uppercase text-zinc-400 tracking-wider">Order Summary</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-400 font-medium">Occasion</span>
                    <span className="font-black uppercase text-xs">{selectedOccasion?.name}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-400 font-medium">Tier</span>
                    <span className="font-black uppercase text-xs">{selectedTier?.name}</span>
                  </div>
                  {selectedAddons.length > 0 && (
                    <div className="flex justify-between items-start">
                      <span className="text-zinc-400 font-medium">Add-ons</span>
                      <span className="font-black uppercase text-xs text-right">{selectedAddons.map(a => a.name).join(', ')}</span>
                    </div>
                  )}
                  <div className="h-px bg-zinc-800 my-2" />
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-400 font-medium">Total</span>
                    <span className="font-black italic text-lg text-red-600">₦{totalPrice.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 6: Checkout */}
          {step === 6 && createdGiftData && (
            <CheckoutView 
              giftId={createdGiftData.id} 
              amount={createdGiftData.amount} 
              email={formData.sender_email} 
              baseUrl={BaseUrl} 
              onSuccess={() => setStep(7)} 
            />
          )}

          {/* Step 7: Success */}
          {step === 7 && (
            <motion.div 
              key="step7" 
              initial={{ opacity: 0, scale: 0.9 }} 
              animate={{ opacity: 1, scale: 1 }} 
              className="text-center py-16 space-y-8"
            >
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-green-500/30"
              >
                <Check className="w-12 h-12 text-white" />
              </motion.div>
              
              <div className="space-y-3">
                <h2 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter text-white">Gift Created!</h2>
                <p className="text-sm text-zinc-400 font-medium max-w-md mx-auto">
                  Your gift has been successfully created and sent. The recipient will receive it shortly.
                </p>
              </div>
              
              <button 
                onClick={() => window.location.reload()} 
                className="px-10 py-4 bg-white text-black rounded-full text-[10px] font-black uppercase tracking-wider hover:bg-zinc-100 transition-all shadow-lg"
              >
                Send Another Gift
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Navigation Footer */}
      {step < 6 && (
        <div className="fixed bottom-0 left-0 w-full bg-gradient-to-t from-[#050505] via-[#050505] to-transparent pt-8 pb-6 z-40">
          <div className="max-w-4xl mx-auto px-6 flex justify-between items-center gap-4">
            {/* Back Button */}
            {step > 1 ? (
              <motion.button 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                onClick={() => setStep(s => s - 1)} 
                className="w-14 h-14 rounded-full border-2 border-zinc-800 bg-zinc-900 flex items-center justify-center hover:border-zinc-700 hover:bg-zinc-800 transition-all group"
              >
                <ArrowLeft className="w-5 h-5 text-zinc-400 group-hover:text-white transition-colors" />
              </motion.button>
            ) : (
              <div className="w-14" />
            )}
            
            {/* Price & Next Button */}
            <div className="flex items-center gap-4">
              {/* Total Price */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="hidden sm:block text-right bg-zinc-900/80 border-2 border-zinc-800 rounded-full px-6 py-3"
              >
                <p className="text-[9px] font-black uppercase text-zinc-500 tracking-wide">Total</p>
                <p className="text-lg font-black italic text-red-600">₦{totalPrice.toLocaleString()}</p>
              </motion.div>
              
              {/* Next Button */}
              <motion.button 
                onClick={step === 5 ? handleCreateGift : () => setStep(s => s + 1)} 
                disabled={isSubmitting || !canProceed()}
                whileHover={{ scale: canProceed() ? 1.02 : 1 }}
                whileTap={{ scale: canProceed() ? 0.98 : 1 }}
                className={`px-8 md:px-12 py-5 rounded-full text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-3 transition-all shadow-lg
                  ${canProceed() && !isSubmitting
                    ? 'bg-red-600 text-white hover:bg-red-700 shadow-red-600/30' 
                    : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'}`}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="hidden md:inline">Processing...</span>
                  </>
                ) : (
                  <>
                    <span>{step === 5 ? 'Create & Pay' : 'Next Step'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </motion.button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}