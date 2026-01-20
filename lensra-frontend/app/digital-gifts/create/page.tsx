"use client";

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles, Heart, Cake, Gift, Smile,
  Type, Mic, Video, Calendar, CreditCard,
  ArrowRight, ArrowLeft, Check, Loader2, Upload,
  X, Smartphone, ShoppingBag
} from 'lucide-react';
import CheckoutView from '@/components/CheckoutView';

const BaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.lensra.com/";

interface Occasion {
  id: number;
  name: string;
  description: string;
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
  description: string;
  price: string;
}

export default function GiftWizard() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdGiftData, setCreatedGiftData] = useState<{id: number, amount: number} | null>(null);

  // Fetched Data
  const [occasions, setOccasions] = useState<Occasion[]>([]);
  const [tiers, setTiers] = useState<ExperienceTier[]>([]);
  const [addons, setAddons] = useState<AddOn[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Gift State
  const [formData, setFormData] = useState({
    occasion: '',
    tier: '',
    addons: [] as string[],
    message: '',
    recipientName: '',
    recipientContact: '',
    deliveryDate: '',
    physicalAddress: '',
    senderName: '',
    senderEmail: '',
    voiceOption: '', 
    videoOption: '', 
    voiceFile: null as File | null,
    videoFile: null as File | null,
  });

  // Fetch API data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingData(true);
        const [occRes, tierRes, addonRes] = await Promise.all([
          fetch(`${BaseUrl}api/digital-gifts/occasions/`),
          fetch(`${BaseUrl}api/digital-gifts/tiers/`),
          fetch(`${BaseUrl}api/digital-gifts/addons/`)
        ]);
        
        if (!occRes.ok || !tierRes.ok || !addonRes.ok) throw new Error('Fetch failed');
        
        const [occData, tierData, addonData] = await Promise.all([
          occRes.json(), tierRes.json(), addonRes.json()
        ]);
        
        setOccasions(Array.isArray(occData) ? occData : (occData?.results || []));
        setTiers(Array.isArray(tierData) ? tierData : (tierData?.results || []));
        setAddons(Array.isArray(addonData) ? addonData : (addonData?.results || []));
      } catch (err) {
        setFetchError('Failed to load gift options.');
      } finally {
        setLoadingData(false);
      }
    };
    fetchData();
  }, []);

  // Pre-select recommended tier
  useEffect(() => {
    if (tiers.length > 0 && !formData.tier) {
      const rec = tiers.find(t => t.recommended) || tiers[0];
      setFormData(prev => ({ ...prev, tier: rec.id.toString() }));
    }
  }, [tiers]);

  // Calculate Total (Moved inside component to fix 'Cannot find name' error)
  const totalPrice = useMemo(() => {
    if (!tiers.length) return 0;
    const selectedTier = tiers.find(t => t.id === parseInt(formData.tier));
    let total = selectedTier ? parseFloat(selectedTier.price) : 0;
    formData.addons.forEach(addonId => {
      const addon = addons.find(a => a.id === parseInt(addonId));
      if (addon) total += parseFloat(addon.price);
    });
    return total;
  }, [formData.tier, formData.addons, tiers, addons]);

  const handleCreateGift = async () => {
    setIsSubmitting(true);
    try {
      const fd = new FormData();
      fd.append('sender_name', formData.senderName);
      fd.append('sender_email', formData.senderEmail);
      fd.append('recipient_name', formData.recipientName);
      fd.append('occasion', occasions.find(o => o.slug === formData.occasion)?.id.toString() || '');
      fd.append('tier', formData.tier);
      fd.append('text_message', formData.message);
      
      if (formData.recipientContact.includes('@')) {
        fd.append('recipient_email', formData.recipientContact);
      } else {
        fd.append('recipient_phone', formData.recipientContact);
      }
      
      formData.addons.forEach(id => fd.append('selected_addons', id));
      if (formData.voiceFile) fd.append('voice_message', formData.voiceFile);
      if (formData.videoFile) fd.append('video_message', formData.videoFile);

      const res = await fetch(`${BaseUrl}api/digital-gifts/gifts/`, {
        method: 'POST',
        body: fd,
      });
      
      if (!res.ok) throw new Error('Gift creation failed');
      const data = await res.json();

      setCreatedGiftData({ id: data.id, amount: totalPrice });
      setStep(6);
    } catch (err) {
      alert('Failed to save gift details. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loadingData) return <div className="min-h-screen bg-[#050505] flex items-center justify-center"><Loader2 className="w-8 h-8 text-red-600 animate-spin" /></div>;

  return (
    <div className="min-h-screen bg-[#050505] text-white pb-32">
      <div className="fixed top-0 left-0 w-full h-1 bg-zinc-900 z-50">
        <motion.div className="h-full bg-red-600" animate={{ width: `${(step / 6) * 100}%` }} />
      </div>

      <main className="max-w-3xl mx-auto px-6 pt-24">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-12">
              <header className="space-y-4">
                <span className="text-red-600 text-[10px] font-black uppercase tracking-[0.4em]">Step 1/5</span>
                <h2 className="text-5xl font-black italic uppercase tracking-tighter">What's the moment?</h2>
              </header>
              <div className="grid grid-cols-2 gap-4">
                {occasions.map((occ) => (
                  <button key={occ.id} onClick={() => { setFormData({...formData, occasion: occ.slug}); setStep(2); }}
                    className={`p-10 rounded-[32px] border-2 transition-all flex flex-col items-center gap-4 ${formData.occasion === occ.slug ? 'border-red-600 bg-red-600/5' : 'border-zinc-800 hover:border-zinc-600'}`}>
                    <Gift className="w-8 h-8" /><span className="text-[10px] font-black uppercase">{occ.name}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-12">
              <header className="space-y-4"><h2 className="text-5xl font-black italic uppercase tracking-tighter">Experience Level</h2></header>
              <div className="space-y-4">
                {tiers.map((tier) => (
                  <button key={tier.id} onClick={() => setFormData({...formData, tier: tier.id.toString()})}
                    className={`w-full p-8 rounded-[32px] border-2 flex justify-between items-center transition-all ${formData.tier === tier.id.toString() ? 'border-red-600 bg-red-600/5' : 'border-zinc-800'}`}>
                    <div className="text-left"><p className="font-black italic uppercase text-xl">{tier.name}</p></div>
                    <p className="font-black text-red-600">₦{parseFloat(tier.price).toLocaleString()}</p>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-12">
              <header className="space-y-4"><h2 className="text-5xl font-black italic uppercase tracking-tighter">Add Magic</h2></header>
              <div className="space-y-4">
                {addons.map((addon) => (
                  <div key={addon.id} onClick={() => setFormData(p => ({ ...p, addons: p.addons.includes(addon.id.toString()) ? p.addons.filter(a => a !== addon.id.toString()) : [...p.addons, addon.id.toString()] }))}
                    className={`w-full p-8 rounded-[32px] border-2 cursor-pointer flex justify-between items-center ${formData.addons.includes(addon.id.toString()) ? 'border-red-600 bg-red-600/5' : 'border-zinc-800'}`}>
                    <p className="font-black italic uppercase">{addon.name}</p>
                    <p className="text-[10px] font-black">+₦{parseFloat(addon.price).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-12">
              <header className="space-y-4"><h2 className="text-5xl font-black italic uppercase tracking-tighter">Make it yours</h2></header>
              <div className="space-y-6">
                <input placeholder="Your Email" value={formData.senderEmail} onChange={e => setFormData({...formData, senderEmail: e.target.value})} className="w-full bg-zinc-900 border-2 border-zinc-800 rounded-full px-8 py-6 text-xs font-black uppercase outline-none focus:border-red-600" />
                <textarea placeholder="Your Message" value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} className="w-full bg-zinc-900 border-2 border-zinc-800 rounded-[32px] p-8 text-sm font-bold uppercase outline-none focus:border-red-600 min-h-[150px]" />
              </div>
            </motion.div>
          )}

          {step === 5 && (
            <motion.div key="step5" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-12">
              <header className="space-y-4"><h2 className="text-5xl font-black italic uppercase tracking-tighter">Recipient Details</h2></header>
              <div className="space-y-6">
                <input placeholder="Recipient Name" value={formData.recipientName} onChange={e => setFormData({...formData, recipientName: e.target.value})} className="w-full bg-zinc-900 border-2 border-zinc-800 rounded-full px-8 py-6 text-xs font-black uppercase outline-none focus:border-red-600" />
                <input placeholder="Email or Phone" value={formData.recipientContact} onChange={e => setFormData({...formData, recipientContact: e.target.value})} className="w-full bg-zinc-900 border-2 border-zinc-800 rounded-full px-8 py-6 text-xs font-black uppercase outline-none focus:border-red-600" />
              </div>
            </motion.div>
          )}

          {step === 6 && createdGiftData && (
            <CheckoutView 
              giftId={createdGiftData.id} 
              amount={createdGiftData.amount} 
              email={formData.senderEmail} 
              baseUrl={BaseUrl} 
              onSuccess={() => setStep(7)}
            />
          )}

          {step === 7 && (
            <motion.div key="step7" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-20 space-y-6">
              <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto"><Check className="w-10 h-10 text-white" /></div>
              <h2 className="text-5xl font-black italic uppercase tracking-tighter">Gift Sent!</h2>
              <button onClick={() => window.location.reload()} className="px-10 py-4 bg-white text-black rounded-full text-[10px] font-black uppercase">Send Another</button>
            </motion.div>
          )}
        </AnimatePresence>

        {step < 6 && (
          <div className="fixed bottom-12 left-1/2 -translate-x-1/2 w-full max-w-3xl px-6 flex justify-between items-center z-40">
            {step > 1 ? <button onClick={() => setStep(s => s - 1)} className="w-16 h-16 rounded-full border-2 border-zinc-800 bg-black flex items-center justify-center hover:border-white transition-all"><ArrowLeft /></button> : <div />}
            <button onClick={step === 5 ? handleCreateGift : () => setStep(s => s + 1)} disabled={isSubmitting} className="px-12 py-6 bg-red-600 rounded-full text-white text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-2 hover:bg-red-700 transition-all">
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : step === 5 ? 'Review & Pay' : 'Next'} <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </main>
    </div>
  );
}