"use client";

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Gift, ArrowRight, ArrowLeft, Loader2, Check, Mail, User, MapPin
} from 'lucide-react';
import CheckoutView from '@/components/CheckoutView';

const BaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.lensra.com/";

// Interfaces matching your Django Serializer
interface Occasion {
  id: number;
  name: string;
  slug: string;
}

interface ExperienceTier {
  id: number;
  name: string;
  price: string;
  recommended: boolean;
}

interface AddOn {
  id: number;
  name: string;
  price: string;
}

export default function GiftWizard() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdGiftData, setCreatedGiftData] = useState<{id: number, amount: number} | null>(null);

  // API Data State
  const [occasions, setOccasions] = useState<Occasion[]>([]);
  const [tiers, setTiers] = useState<ExperienceTier[]>([]);
  const [addons, setAddons] = useState<AddOn[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  // Form State aligned with DigitalGiftSerializer
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

  // 1. Fetch data from backend
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

  // 2. Calculate Total Price (Visible to all JSX)
  const totalPrice = useMemo(() => {
    const selectedTier = tiers.find(t => t.id === formData.tier);
    const tierPrice = selectedTier ? parseFloat(selectedTier.price) : 0;
    const addonsPrice = formData.addon_ids.reduce((sum, id) => {
      const addon = addons.find(a => a.id === id);
      return sum + parseFloat(addon?.price || "0");
    }, 0);
    return tierPrice + addonsPrice;
  }, [formData.tier, formData.addon_ids, tiers, addons]);

  // 3. Handle Submit to Serializer
  const handleCreateGift = async () => {
    if (!formData.sender_email || !formData.sender_name) {
      alert("Please provide your name and email to proceed to payment.");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        sender_name: formData.sender_name,
        sender_email: formData.sender_email,
        recipient_name: formData.recipient_name,
        occasion: formData.occasion,
        tier: formData.tier,
        text_message: formData.text_message,
        addon_ids: formData.addon_ids,
        shipping_address: formData.shipping_address,
        recipient_email: formData.recipient_contact.includes('@') ? formData.recipient_contact : '',
        recipient_phone: !formData.recipient_contact.includes('@') ? formData.recipient_contact : '',
      };

      const res = await fetch(`${BaseUrl}api/digital-gifts/gifts/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Gift creation failed');
      const data = await res.json();

      setCreatedGiftData({ id: data.id, amount: totalPrice });
      setStep(6);
    } catch (err) {
      alert('Error creating your gift. Please check all required fields.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loadingData) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-red-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white pb-32">
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-zinc-900 z-50">
        <motion.div 
          className="h-full bg-red-600" 
          initial={{ width: 0 }}
          animate={{ width: `${(step / 6) * 100}%` }} 
        />
      </div>

      <main className="max-w-3xl mx-auto px-6 pt-24">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-12">
              <header className="space-y-4">
                <span className="text-red-600 text-[10px] font-black uppercase tracking-[0.4em]">Step 1/5</span>
                <h2 className="text-5xl font-black italic uppercase tracking-tighter">Choose Occasion</h2>
              </header>
              <div className="grid grid-cols-2 gap-4">
                {occasions.map((occ) => (
                  <button key={occ.id} onClick={() => { setFormData({...formData, occasion: occ.id}); setStep(2); }}
                    className={`p-10 rounded-[32px] border-2 transition-all flex flex-col items-center gap-4 ${formData.occasion === occ.id ? 'border-red-600 bg-red-600/5' : 'border-zinc-800 hover:border-zinc-600'}`}>
                    <Gift className="w-8 h-8" />
                    <span className="text-[10px] font-black uppercase tracking-widest">{occ.name}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-12">
              <header className="space-y-4"><h2 className="text-5xl font-black italic uppercase tracking-tighter">Experience Level</h2></header>
              <div className="space-y-4">
                {tiers.map((t) => (
                  <button key={t.id} onClick={() => setFormData({...formData, tier: t.id})}
                    className={`w-full p-8 rounded-[32px] border-2 flex justify-between items-center transition-all ${formData.tier === t.id ? 'border-red-600 bg-red-600/5' : 'border-zinc-800'}`}>
                    <span className="font-black italic uppercase text-xl">{t.name}</span>
                    <span className="font-black text-red-600">₦{parseFloat(t.price).toLocaleString()}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-12">
              <header className="space-y-4"><h2 className="text-5xl font-black italic uppercase tracking-tighter">Add Magic</h2></header>
              <div className="space-y-4">
                {addons.map((a) => (
                  <div key={a.id} onClick={() => setFormData(p => ({ ...p, addon_ids: p.addon_ids.includes(a.id) ? p.addon_ids.filter(id => id !== a.id) : [...p.addon_ids, a.id] }))}
                    className={`w-full p-8 rounded-[32px] border-2 cursor-pointer flex justify-between items-center transition-all ${formData.addon_ids.includes(a.id) ? 'border-red-600 bg-red-600/5' : 'border-zinc-800'}`}>
                    <span className="font-black italic uppercase">{a.name}</span>
                    <span className="text-[10px] font-black">+₦{parseFloat(a.price).toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-12">
              <header className="space-y-4"><h2 className="text-5xl font-black italic uppercase tracking-tighter">Your Info</h2></header>
              <div className="space-y-6">
                <div className="relative">
                  <User className="absolute left-6 top-6 w-5 h-5 text-zinc-500" />
                  <input placeholder="Your Name" value={formData.sender_name} onChange={e => setFormData({...formData, sender_name: e.target.value})} className="w-full bg-zinc-900 border-2 border-zinc-800 rounded-full pl-16 pr-8 py-6 text-xs font-black uppercase outline-none focus:border-red-600" />
                </div>
                <div className="relative">
                  <Mail className="absolute left-6 top-6 w-5 h-5 text-zinc-500" />
                  <input placeholder="Your Email (Required for Receipt)" value={formData.sender_email} onChange={e => setFormData({...formData, sender_email: e.target.value})} className="w-full bg-zinc-900 border-2 border-zinc-800 rounded-full pl-16 pr-8 py-6 text-xs font-black uppercase outline-none focus:border-red-600" />
                </div>
                <textarea placeholder="Write your message here..." value={formData.text_message} onChange={e => setFormData({...formData, text_message: e.target.value})} className="w-full bg-zinc-900 border-2 border-zinc-800 rounded-[32px] p-8 text-sm font-bold outline-none focus:border-red-600 min-h-[150px]" />
              </div>
            </motion.div>
          )}

          {step === 5 && (
            <motion.div key="step5" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-12">
              <header className="space-y-4"><h2 className="text-5xl font-black italic uppercase tracking-tighter">Recipient</h2></header>
              <div className="space-y-6">
                <input placeholder="Recipient Name" value={formData.recipient_name} onChange={e => setFormData({...formData, recipient_name: e.target.value})} className="w-full bg-zinc-900 border-2 border-zinc-800 rounded-full px-8 py-6 text-xs font-black uppercase outline-none focus:border-red-600" />
                <input placeholder="Recipient Email or Phone Number" value={formData.recipient_contact} onChange={e => setFormData({...formData, recipient_contact: e.target.value})} className="w-full bg-zinc-900 border-2 border-zinc-800 rounded-full px-8 py-6 text-xs font-black uppercase outline-none focus:border-red-600" />
                <div className="relative">
                  <MapPin className="absolute left-6 top-6 w-5 h-5 text-zinc-500" />
                  <input placeholder="Shipping Address (Optional)" value={formData.shipping_address} onChange={e => setFormData({...formData, shipping_address: e.target.value})} className="w-full bg-zinc-900 border-2 border-zinc-800 rounded-full pl-16 pr-8 py-6 text-xs font-black uppercase outline-none focus:border-red-600" />
                </div>
              </div>
            </motion.div>
          )}

          {step === 6 && createdGiftData && (
            <CheckoutView 
              giftId={createdGiftData.id} 
              amount={createdGiftData.amount} 
              email={formData.sender_email} 
              baseUrl={BaseUrl} 
              onSuccess={() => setStep(7)} 
            />
          )}

          {step === 7 && (
            <motion.div key="step7" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-20 space-y-8">
              <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-green-500/20">
                <Check className="w-12 h-12 text-white" strokeWidth={3} />
              </div>
              <h2 className="text-6xl font-black italic uppercase tracking-tighter">Gift Created!</h2>
              <p className="text-zinc-500 uppercase font-bold text-xs tracking-widest">Your digital surprise is being processed.</p>
              <button onClick={() => window.location.reload()} className="px-12 py-5 bg-white text-black rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all">
                Send Another Gift
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation Bar */}
        {step < 6 && (
          <div className="fixed bottom-12 left-1/2 -translate-x-1/2 w-full max-w-3xl px-6 flex justify-between items-center z-40">
            {step > 1 ? (
              <button onClick={() => setStep(s => s - 1)} className="w-16 h-16 rounded-full border-2 border-zinc-800 bg-black flex items-center justify-center hover:border-white transition-all text-white">
                <ArrowLeft className="w-6 h-6" />
              </button>
            ) : <div />}

            <div className="flex items-center gap-6">
              <div className="hidden md:block text-right">
                <p className="text-[10px] font-black uppercase text-zinc-500">Estimated Total</p>
                <p className="text-xl font-black italic">₦{totalPrice.toLocaleString()}</p>
              </div>
              <button 
                onClick={step === 5 ? handleCreateGift : () => setStep(s => s + 1)} 
                disabled={isSubmitting} 
                className="px-12 py-6 bg-red-600 rounded-full text-white text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-3 hover:bg-red-700 transition-all disabled:opacity-50"
              >
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : (step === 5 ? 'Create & Pay' : 'Next Step')} 
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}