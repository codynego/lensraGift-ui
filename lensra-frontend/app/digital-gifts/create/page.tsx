"use client";
import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles, Heart, Cake, Gift, Smile,
  Type, Mic, Video, Calendar, CreditCard,
  ArrowRight, ArrowLeft, Check, Loader2, Upload,
  X, Smartphone, ShoppingBag
} from 'lucide-react';
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
    voiceOption: '', // 'record' | 'ai' | ''
    videoOption: '', // 'record' | 'upload' | ''
    voiceFile: null as File | null,
    videoFile: null as File | null,
  });
  // Fetch API data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingData(true);
        setFetchError(null);
       
        const [occRes, tierRes, addonRes] = await Promise.all([
          fetch(`${BaseUrl}api/digital-gifts/occasions/`),
          fetch(`${BaseUrl}api/digital-gifts/tiers/`),
          fetch(`${BaseUrl}api/digital-gifts/addons/`)
        ]);
       
        if (!occRes.ok || !tierRes.ok || !addonRes.ok) {
          throw new Error('Failed to fetch data');
        }
       
        const [occData, tierData, addonData] = await Promise.all([
          occRes.json(),
          tierRes.json(),
          addonRes.json()
        ]);
       
        setOccasions(Array.isArray(occData) ? occData : (occData?.results || []));
        setTiers(Array.isArray(tierData) ? tierData : (tierData?.results || []));
        setAddons(Array.isArray(addonData) ? addonData : (addonData?.results || []));
      } catch (err) {
        console.error(err);
        setFetchError('Failed to load gift options. Please try again later.');
      } finally {
        setLoadingData(false);
      }
    };
   
    fetchData();
  }, []);

  // Pre-select recommended tier
  useEffect(() => {
    if (tiers.length > 0 && !formData.tier) {
      const recommendedTier = tiers.find(t => t.recommended);
      const defaultTier = recommendedTier || tiers[0];
      setFormData(prev => ({ ...prev, tier: defaultTier.id.toString() }));
    }
  }, [tiers]);

  // Calculate Total
  const totalPrice = useMemo(() => {
    if (!tiers.length || !addons.length) return 0;
   
    const selectedTier = tiers.find(t => t.id === parseInt(formData.tier));
    let total = selectedTier ? parseFloat(selectedTier.price) : 0;
   
    formData.addons.forEach(addonId => {
      const addon = addons.find(a => a.id === parseInt(addonId));
      if (addon) total += parseFloat(addon.price);
    });
   
    return total;
  }, [formData.tier, formData.addons, tiers, addons]);
  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);
  const toggleAddon = (id: number) => {
    const addonStr = id.toString();
    setFormData(prev => ({
      ...prev,
      addons: prev.addons.includes(addonStr)
        ? prev.addons.filter(a => a !== addonStr)
        : [...prev.addons, addonStr]
    }));
  };
  const handleCreateGift = async () => {
    setIsSubmitting(true);
    try {
      // Create FormData for multipart/form-data to handle files
      const formDataToSend = new FormData();
     
      // Add text fields
      if (formData.senderName) formDataToSend.append('sender_name', formData.senderName);
      if (formData.senderEmail) formDataToSend.append('sender_email', formData.senderEmail);
      formDataToSend.append('recipient_name', formData.recipientName);
      formDataToSend.append('occasion', occasions.find(o => o.slug === formData.occasion)?.id.toString() || '');
      formDataToSend.append('tier', formData.tier);
      formDataToSend.append('text_message', formData.message);
     
      // Add recipient contact
      if (formData.recipientContact.includes('@')) {
        formDataToSend.append('recipient_email', formData.recipientContact);
      } else {
        formDataToSend.append('recipient_phone', formData.recipientContact);
      }
     
      // Add delivery date if set
      if (formData.deliveryDate) {
        formDataToSend.append('scheduled_delivery', formData.deliveryDate);
      }
     
      // Add addons
      formData.addons.forEach(addonId => {
        formDataToSend.append('addons', addonId);
      });
     
      // Add voice file or AI flag
      if (formData.voiceFile) {
        formDataToSend.append('voice_message', formData.voiceFile);
      } else if (formData.voiceOption === 'ai') {
        formDataToSend.append('use_ai_voice', 'true');
      }
     
      // Add video file
      if (formData.videoFile) {
        formDataToSend.append('video_message', formData.videoFile);
      }

      // Add physical address if applicable
      if (formData.physicalAddress) {
        formDataToSend.append('shipping_address', formData.physicalAddress);
      }
     
      const res = await fetch(`${BaseUrl}api/digital-gifts/gifts/`, {
        method: 'POST',
        body: formDataToSend,
        // Don't set Content-Type header - browser will set it with boundary for multipart/form-data
      });
     
      if (!res.ok) throw new Error('Failed to create gift');
     
      const data = await res.json();

      // Initialize payment after gift creation
      const paymentEmail = formData.senderEmail || (formData.recipientContact.includes('@') ? formData.recipientContact : '');
      if (!paymentEmail) {
        throw new Error('An email is required for payment initialization.');
      }

      const paymentRes = await fetch(`${BaseUrl}api/payments/initialize/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          digital_gift_id: data.id,
          email: paymentEmail,
        }),
      });

      if (!paymentRes.ok) throw new Error('Failed to initialize payment');

      const paymentData = await paymentRes.json();

      // Proceed to pay by redirecting to the authorization URL
      window.location.href = paymentData.authorization_url;

    } catch (err) {
      console.error(err);
      alert('Failed to create gift or initialize payment. Please try again.');
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
  if (fetchError) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center text-red-600">
        {fetchError}
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-red-600/30 pb-32">
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-zinc-900 z-50">
        <motion.div
          className="h-full bg-red-600"
          initial={{ width: "0%" }}
          animate={{ width: `${(step / 7) * 100}%` }}
        />
      </div>
      <main className="max-w-3xl mx-auto px-6 pt-24">
       
        <AnimatePresence mode="wait">
          {/* STEP 1: OCCASION */}
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-12">
              <header className="space-y-4">
                <span className="text-red-600 text-[10px] font-black uppercase tracking-[0.4em]">Step 1/6</span>
                <h2 className="text-5xl font-black italic uppercase tracking-tighter">What's the special moment?</h2>
                <p className="text-zinc-500 text-sm font-bold">Choose an occasion that captures the heart of your gift.</p>
              </header>
              <div className="grid grid-cols-2 gap-4">
                {occasions.map((occ: Occasion) => (
                  <button
                    key={occ.id}
                    onClick={() => { setFormData({...formData, occasion: occ.slug}); nextStep(); }}
                    className={`p-10 rounded-[32px] border-2 transition-all flex flex-col items-center gap-4 ${formData.occasion === occ.slug ? 'border-red-600 bg-red-600/5' : 'border-zinc-800 hover:border-zinc-600'}`}
                  >
                    <Gift className="w-8 h-8" />
                    <span className="text-[10px] font-black uppercase tracking-widest">{occ.name}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
          {/* STEP 2: TIER SELECTION */}
          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-12">
              <header className="space-y-4">
                <span className="text-red-600 text-[10px] font-black uppercase tracking-[0.4em]">Step 2/6</span>
                <h2 className="text-5xl font-black italic uppercase tracking-tighter">Select your experience level</h2>
                <p className="text-zinc-500 text-sm font-bold">Pick the perfect tier to make your gift unforgettable.</p>
              </header>
              <div className="space-y-4">
                {tiers.map((tier: ExperienceTier) => (
                  <button
                    key={tier.id}
                    onClick={() => setFormData({...formData, tier: tier.id.toString()})}
                    className={`w-full p-8 rounded-[32px] border-2 flex justify-between items-center transition-all ${formData.tier === tier.id.toString() ? 'border-red-600 bg-red-600/5' : 'border-zinc-800 hover:border-zinc-700'}`}
                  >
                    <div className="text-left">
                      <p className="font-black italic uppercase text-xl">{tier.name}</p>
                      <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{tier.description}</p>
                    </div>
                    <p className="font-black text-red-600">₦{parseFloat(tier.price).toLocaleString()}</p>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
          {/* STEP 3: ADD-ONS */}
          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-12">
              <header className="space-y-4">
                <span className="text-red-600 text-[10px] font-black uppercase tracking-[0.4em]">Step 3/6</span>
                <h2 className="text-5xl font-black italic uppercase tracking-tighter leading-none">Add a little extra magic</h2>
                <p className="text-zinc-500 text-sm font-bold">Choose add-ons to make your gift even more special.</p>
              </header>
              <div className="space-y-4">
                {addons.map((addon: AddOn) => (
                  <div
                    key={addon.id}
                    onClick={() => toggleAddon(addon.id)}
                    className={`w-full p-8 rounded-[32px] border-2 cursor-pointer flex justify-between items-center transition-all ${formData.addons.includes(addon.id.toString()) ? 'border-red-600 bg-red-600/5' : 'border-zinc-800'}`}
                  >
                    <div className="flex items-center gap-6">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${formData.addons.includes(addon.id.toString()) ? 'bg-red-600 border-red-600' : 'border-zinc-700'}`}>
                        {formData.addons.includes(addon.id.toString()) && <Check className="w-3 h-3 text-white" />}
                      </div>
                      <p className="font-black italic uppercase tracking-tight">{addon.name}</p>
                    </div>
                    <p className="text-[10px] font-black text-zinc-500">+₦{parseFloat(addon.price).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
          {/* STEP 4: PERSONALIZE */}
          {step === 4 && (
            <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-12">
              <header className="space-y-4">
                <span className="text-red-600 text-[10px] font-black uppercase tracking-[0.4em]">Step 4/6</span>
                <h2 className="text-5xl font-black italic uppercase tracking-tighter">Make it yours</h2>
                <p className="text-zinc-500 text-sm font-bold">Add your personal touch with a heartfelt message.</p>
              </header>
              <div className="space-y-8">
                {/* Sender Info (Optional) */}
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">Your Details (Optional)</label>
                  <input
                    type="text"
                    placeholder="Your Name"
                    value={formData.senderName}
                    onChange={(e) => setFormData({...formData, senderName: e.target.value})}
                    className="w-full bg-zinc-900 border-2 border-zinc-800 rounded-full px-8 py-6 text-xs font-black uppercase tracking-widest outline-none focus:border-red-600"
                  />
                  <input
                    type="email"
                    placeholder="Your Email"
                    value={formData.senderEmail}
                    onChange={(e) => setFormData({...formData, senderEmail: e.target.value})}
                    className="w-full bg-zinc-900 border-2 border-zinc-800 rounded-full px-8 py-6 text-xs font-black uppercase tracking-widest outline-none focus:border-red-600"
                  />
                </div>
               
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">Your Message</label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    placeholder="Share your thoughts from the heart..."
                    className="w-full bg-zinc-900 border-2 border-zinc-800 rounded-[32px] p-8 text-sm font-bold uppercase outline-none focus:border-red-600 min-h-[150px] resize-none"
                  />
                </div>
               
                {/* Voice Message Options */}
                {parseInt(formData.tier) !== tiers[0]?.id && (
                  <div className="space-y-4">
                    <p className="text-zinc-500 text-sm font-bold">Add voice to bring your message to life.</p>
                    <div className="grid grid-cols-2 gap-4">
                      <label className={`p-8 bg-zinc-900 rounded-[32px] border-2 cursor-pointer flex flex-col items-center gap-3 transition-all ${formData.voiceOption === 'record' ? 'border-red-600 bg-red-600/5' : 'border-dashed border-zinc-800 hover:border-red-600'}`}>
                        <input
                          type="file"
                          accept="audio/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              setFormData({...formData, voiceOption: 'record', voiceFile: file});
                            }
                          }}
                        />
                        <Mic className="w-6 h-6 text-zinc-500" />
                        <span className="text-[9px] font-black uppercase tracking-widest text-center">
                          {formData.voiceFile ? formData.voiceFile.name.substring(0, 15) + '...' : 'Record/Upload Voice'}
                        </span>
                      </label>
                     
                      <button
                        onClick={() => setFormData({...formData, voiceOption: formData.voiceOption === 'ai' ? '' : 'ai', voiceFile: null})}
                        className={`p-8 bg-zinc-900 rounded-[32px] border-2 flex flex-col items-center gap-3 transition-all ${formData.voiceOption === 'ai' ? 'border-red-600 bg-red-600/5' : 'border-dashed border-zinc-800 hover:border-red-600'}`}
                      >
                        <Sparkles className="w-6 h-6 text-zinc-500" />
                        <span className="text-[9px] font-black uppercase tracking-widest text-center">AI Voice for Me</span>
                      </button>
                    </div>
                  </div>
                )}
               
                {/* Video Message Options */}
                {parseInt(formData.tier) === tiers[tiers.length - 1]?.id && (
                  <div className="space-y-4">
                    <p className="text-zinc-500 text-sm font-bold">Make it unforgettable with video.</p>
                    <div className="grid grid-cols-2 gap-4">
                      <label className={`p-8 bg-zinc-900 rounded-[32px] border-2 cursor-pointer flex flex-col items-center gap-3 transition-all ${formData.videoOption === 'record' ? 'border-red-600 bg-red-600/5' : 'border-dashed border-zinc-800 hover:border-red-600'}`}>
                        <input
                          type="file"
                          accept="video/*"
                          capture="user"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              setFormData({...formData, videoOption: 'record', videoFile: file});
                            }
                          }}
                        />
                        <Video className="w-6 h-6 text-zinc-500" />
                        <span className="text-[9px] font-black uppercase tracking-widest text-center">Record Video</span>
                      </label>
                     
                      <label className={`p-8 bg-zinc-900 rounded-[32px] border-2 cursor-pointer flex flex-col items-center gap-3 transition-all ${formData.videoOption === 'upload' ? 'border-red-600 bg-red-600/5' : 'border-dashed border-zinc-800 hover:border-red-600'}`}>
                        <input
                          type="file"
                          accept="video/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              setFormData({...formData, videoOption: 'upload', videoFile: file});
                            }
                          }}
                        />
                        <Upload className="w-6 h-6 text-zinc-500" />
                        <span className="text-[9px] font-black uppercase tracking-widest text-center">
                          {formData.videoFile ? formData.videoFile.name.substring(0, 15) + '...' : 'Upload Video'}
                        </span>
                      </label>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
          {/* STEP 5: RECIPIENT */}
          {step === 5 && (
            <motion.div key="step5" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-12">
              <header className="space-y-4">
                <span className="text-red-600 text-[10px] font-black uppercase tracking-[0.4em]">Step 5/6</span>
                <h2 className="text-5xl font-black italic uppercase tracking-tighter">Who receives the joy?</h2>
                <p className="text-zinc-500 text-sm font-bold">Enter their contact details for seamless delivery.</p>
              </header>
              <div className="space-y-6">
                <input
                  type="text"
                  placeholder="Recipient's name"
                  value={formData.recipientName}
                  onChange={(e) => setFormData({...formData, recipientName: e.target.value})}
                  className="w-full bg-zinc-900 border-2 border-zinc-800 rounded-full px-8 py-6 text-xs font-black uppercase tracking-widest outline-none focus:border-red-600"
                />
                <input
                  type="text"
                  placeholder="Recipient's email or phone number"
                  value={formData.recipientContact}
                  onChange={(e) => setFormData({...formData, recipientContact: e.target.value})}
                  className="w-full bg-zinc-900 border-2 border-zinc-800 rounded-full px-8 py-6 text-xs font-black uppercase tracking-widest outline-none focus:border-red-600"
                />
               
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">Delivery Date (Optional)</label>
                  <input
                    type="datetime-local"
                    value={formData.deliveryDate}
                    onChange={(e) => setFormData({...formData, deliveryDate: e.target.value})}
                    className="w-full bg-zinc-900 border-2 border-zinc-800 rounded-full px-8 py-6 text-xs font-black uppercase tracking-widest outline-none focus:border-red-600"
                  />
                </div>
               
                {formData.addons.includes(addons.find((a: AddOn) => a.name.toLowerCase().includes('physical') || a.name.toLowerCase().includes('qr card'))?.id.toString() || '') && (
                  <textarea
                    placeholder="Enter shipping address for the physical card"
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
            <motion.div key="step6" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.05 }} className="space-y-12">
              <header className="text-center space-y-4">
                <span className="text-red-600 text-[10px] font-black uppercase tracking-[0.4em]">Step 6/6</span>
                <h2 className="text-5xl font-black italic uppercase tracking-tighter">Almost there</h2>
                <p className="text-red-600 text-[10px] font-black uppercase tracking-widest">Review your gift before sending.</p>
              </header>
             
              <div className="bg-zinc-900 rounded-[40px] p-10 space-y-8 border border-zinc-800">
                <div className="flex justify-between border-b border-zinc-800 pb-6">
                  <span className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">Occasion</span>
                  <span className="font-black italic uppercase">{occasions.find((o: Occasion) => o.slug === formData.occasion)?.name}</span>
                </div>
                <div className="flex justify-between border-b border-zinc-800 pb-6">
                  <span className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">Tier</span>
                  <span className="font-black italic uppercase">{tiers.find((t: ExperienceTier) => t.id === parseInt(formData.tier))?.name}</span>
                </div>
                {formData.addons.length > 0 && (
                  <div className="flex justify-between border-b border-zinc-800 pb-6">
                    <span className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">Add-ons</span>
                    <span className="font-black italic uppercase text-right">{formData.addons.length} selected</span>
                  </div>
                )}
                <div className="space-y-2">
                   <span className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">Your Message</span>
                   <p className="text-sm font-bold uppercase text-zinc-300 italic">"{formData.message}"</p>
                </div>
                {formData.voiceFile && (
                  <div className="flex justify-between border-t border-zinc-800 pt-6">
                    <span className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">Voice Message</span>
                    <span className="font-black italic uppercase text-green-500">✓ Attached</span>
                  </div>
                )}
                {formData.voiceOption === 'ai' && (
                  <div className="flex justify-between border-t border-zinc-800 pt-6">
                    <span className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">Voice Message</span>
                    <span className="font-black italic uppercase text-purple-500">✓ AI Generated</span>
                  </div>
                )}
                {formData.videoFile && (
                  <div className="flex justify-between border-t border-zinc-800 pt-6">
                    <span className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">Video Message</span>
                    <span className="font-black italic uppercase text-green-500">✓ Attached</span>
                  </div>
                )}
              </div>
              <div className="flex justify-between items-center p-8 bg-white text-black rounded-[32px]">
                <p className="text-[10px] font-black uppercase tracking-widest">Total</p>
                <p className="text-3xl font-black italic uppercase tracking-tighter">₦{totalPrice.toLocaleString()}</p>
              </div>
            </motion.div>
          )}
          {/* STEP 7: SUCCESS */}
          {step === 7 && (
            <motion.div key="step7" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="text-center space-y-12 py-12">
              <div className="w-24 h-24 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-red-600/40">
                <Check className="w-12 h-12 text-white" strokeWidth={3} />
              </div>
              <h2 className="text-6xl font-black italic uppercase tracking-tighter leading-none">Your gift is on its way</h2>
              <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest max-w-xs mx-auto">We've got it all set. They'll cherish this thoughtful surprise.</p>
              <button
                onClick={() => {
                  setStep(1);
                  setFormData({
                    occasion: '',
                    tier: '',
                    addons: [],
                    message: '',
                    recipientName: '',
                    recipientContact: '',
                    deliveryDate: '',
                    physicalAddress: '',
                    senderName: '',
                    senderEmail: '',
                    voiceOption: '',
                    videoOption: '',
                    voiceFile: null,
                    videoFile: null,
                  });
                }}
                className="px-12 py-6 bg-white text-black rounded-full text-[10px] font-black uppercase tracking-[0.3em] hover:bg-red-600 hover:text-white transition-all"
              >
                Send Another Gift
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
              onClick={step === 6 ? handleCreateGift : nextStep}
              disabled={isSubmitting}
              className="px-12 py-6 bg-red-600 rounded-full text-white text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-2 hover:bg-red-700 transition-all disabled:opacity-50"
            >
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : step === 6 ? 'Confirm & Pay' : 'Next'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </main>
    </div>
  );
}