"use client";

import { useState, useEffect, useMemo } from 'react';
import { 
  Gift, Check, Loader2, ArrowRight, ArrowLeft, 
  Mic, Video, Sparkles, Heart, Star
} from 'lucide-react';

const BaseUrl = "https://api.lensra.com/";

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
  
  const [occasions, setOccasions] = useState<Occasion[]>([]);
  const [tiers, setTiers] = useState<ExperienceTier[]>([]);
  const [addons, setAddons] = useState<AddOn[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  
  const [formData, setFormData] = useState({
    occasionSlug: '',
    tierId: '',
    addonIds: [] as string[],
    message: '',
    recipientContact: '',
    deliveryDate: '',
    physicalAddress: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingData(true);
        
        const [occRes, tierRes, addonRes] = await Promise.all([
          fetch(`${BaseUrl}api/digital-gifts/occasions/`),
          fetch(`${BaseUrl}api/digital-gifts/tiers/`),
          fetch(`${BaseUrl}api/digital-gifts/addons/`)
        ]);
        
        const [occData, tierData, addonData] = await Promise.all([
          occRes.json(),
          tierRes.json(),
          addonRes.json()
        ]);
        
        setOccasions(Array.isArray(occData) ? occData : []);
        setTiers(Array.isArray(tierData) ? tierData : []);
        setAddons(Array.isArray(addonData) ? addonData : []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingData(false);
      }
    };
    
    fetchData();
  }, []);

  const selectedOccasion = occasions.find(o => o.slug === formData.occasionSlug);
  const selectedTier = tiers.find(t => t.id.toString() === formData.tierId);
  const selectedAddons = addons.filter(a => formData.addonIds.includes(a.id.toString()));

  const totalPrice = useMemo(() => {
    let total = selectedTier ? parseFloat(selectedTier.price) : 0;
    selectedAddons.forEach(addon => {
      total += parseFloat(addon.price);
    });
    return total;
  }, [selectedTier, selectedAddons]);

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const toggleAddon = (id: number) => {
    const idStr = id.toString();
    setFormData(prev => ({
      ...prev,
      addonIds: prev.addonIds.includes(idStr) 
        ? prev.addonIds.filter(a => a !== idStr) 
        : [...prev.addonIds, idStr]
    }));
  };

  const handleCreateGift = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch(`${BaseUrl}api/digital-gifts/gifts/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          occasion: selectedOccasion?.id,
          tier: parseInt(formData.tierId),
          addons: formData.addonIds.map(id => parseInt(id)),
          message: formData.message,
          recipient_email: formData.recipientContact.includes('@') ? formData.recipientContact : null,
          recipient_phone: !formData.recipientContact.includes('@') ? formData.recipientContact : null,
          scheduled_delivery: formData.deliveryDate || null,
          physical_address: formData.physicalAddress || null,
        })
      });
      
      if (!res.ok) throw new Error('Failed to create gift');
      
      nextStep();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const canProceed = () => {
    if (step === 1) return formData.occasionSlug !== '';
    if (step === 2) return formData.tierId !== '';
    if (step === 4) return formData.message.trim() !== '';
    if (step === 5) return formData.recipientContact.trim() !== '';
    return true;
  };

  if (loadingData) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-red-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-red-600/30 pb-40">
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-zinc-900 z-50">
        <div 
          className="h-full bg-red-600 transition-all duration-500 ease-out" 
          style={{ width: `${(step / 7) * 100}%` }}
        />
      </div>

      <main className="max-w-4xl mx-auto px-6 pt-32">
        
        {/* STEP 1: OCCASION */}
        {step === 1 && (
          <div className="space-y-16">
            <header className="space-y-6 text-center max-w-2xl mx-auto">
              <span className="text-red-600 text-[10px] font-black uppercase tracking-[0.4em]">Step 1 of 6</span>
              <h2 className="text-6xl md:text-7xl font-black italic uppercase tracking-tighter leading-[0.9]">
                What's the special moment?
              </h2>
              <p className="text-zinc-500 text-sm font-bold uppercase tracking-wide">
                Choose an occasion that captures the heart of your gift
              </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
              {occasions.map((occ) => (
                <button 
                  key={occ.id}
                  onClick={() => {
                    setFormData(prev => ({...prev, occasionSlug: occ.slug}));
                  }}
                  className={`group relative p-12 rounded-[40px] border-2 transition-all duration-300 flex flex-col items-center gap-6 ${
                    formData.occasionSlug === occ.slug 
                      ? 'border-red-600 bg-red-600/10 shadow-2xl shadow-red-600/20' 
                      : 'border-zinc-800 hover:border-zinc-600 hover:bg-zinc-900/50'
                  }`}
                >
                  {formData.occasionSlug === occ.slug && (
                    <div className="absolute top-6 right-6 w-8 h-8 rounded-full bg-red-600 flex items-center justify-center">
                      <Check className="w-5 h-5 text-white" strokeWidth={3} />
                    </div>
                  )}
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${
                    formData.occasionSlug === occ.slug ? 'bg-red-600' : 'bg-zinc-800 group-hover:bg-zinc-700'
                  }`}>
                    <Gift className="w-8 h-8" />
                  </div>
                  <div className="text-center space-y-2">
                    <span className="text-base font-black uppercase tracking-wider block">{occ.name}</span>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 block">
                      {occ.description}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 2: TIER SELECTION */}
        {step === 2 && (
          <div className="space-y-16">
            <header className="space-y-6 text-center max-w-2xl mx-auto">
              <span className="text-red-600 text-[10px] font-black uppercase tracking-[0.4em]">Step 2 of 6</span>
              <h2 className="text-6xl md:text-7xl font-black italic uppercase tracking-tighter leading-[0.9]">
                Select your experience level
              </h2>
              <p className="text-zinc-500 text-sm font-bold uppercase tracking-wide">
                Pick the perfect tier to make your gift unforgettable
              </p>
            </header>

            <div className="space-y-5 max-w-2xl mx-auto">
              {tiers.map((tier) => (
                <button 
                  key={tier.id}
                  onClick={() => setFormData(prev => ({...prev, tierId: tier.id.toString()}))}
                  className={`group relative w-full p-10 rounded-[40px] border-2 flex justify-between items-center transition-all duration-300 ${
                    formData.tierId === tier.id.toString() 
                      ? 'border-red-600 bg-red-600/10 shadow-2xl shadow-red-600/20' 
                      : 'border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/50'
                  }`}
                >
                  <div className="flex items-center gap-6">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                      formData.tierId === tier.id.toString() 
                        ? 'bg-red-600 border-red-600' 
                        : 'border-zinc-700 group-hover:border-zinc-600'
                    }`}>
                      {formData.tierId === tier.id.toString() && (
                        <Check className="w-4 h-4 text-white" strokeWidth={3} />
                      )}
                    </div>
                    <div className="text-left">
                      <div className="flex items-center gap-3">
                        <p className="font-black italic uppercase text-xl tracking-tight">{tier.name}</p>
                        {tier.recommended && (
                          <span className="px-3 py-1 bg-red-600 text-white text-[8px] font-black uppercase tracking-widest rounded-full">
                            Recommended
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] font-bold text-zinc-500 uppercase tracking-wide mt-2">
                        {tier.description}
                      </p>
                    </div>
                  </div>
                  <p className="font-black text-red-600 text-2xl">₦{parseFloat(tier.price).toLocaleString()}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 3: ADD-ONS */}
        {step === 3 && (
          <div className="space-y-16">
            <header className="space-y-6 text-center max-w-2xl mx-auto">
              <span className="text-red-600 text-[10px] font-black uppercase tracking-[0.4em]">Step 3 of 6</span>
              <h2 className="text-6xl md:text-7xl font-black italic uppercase tracking-tighter leading-[0.9]">
                Add a little extra magic
              </h2>
              <p className="text-zinc-500 text-sm font-bold uppercase tracking-wide">
                Choose add-ons to make your gift even more special
              </p>
            </header>

            <div className="space-y-5 max-w-2xl mx-auto">
              {addons.map((addon) => {
                const isSelected = formData.addonIds.includes(addon.id.toString());
                return (
                  <div 
                    key={addon.id}
                    onClick={() => toggleAddon(addon.id)}
                    className={`group w-full p-10 rounded-[40px] border-2 cursor-pointer flex justify-between items-center transition-all duration-300 ${
                      isSelected 
                        ? 'border-red-600 bg-red-600/10 shadow-2xl shadow-red-600/20' 
                        : 'border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/50'
                    }`}
                  >
                    <div className="flex items-center gap-6">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                        isSelected ? 'bg-red-600 border-red-600' : 'border-zinc-700 group-hover:border-zinc-600'
                      }`}>
                        {isSelected && <Check className="w-4 h-4 text-white" strokeWidth={3} />}
                      </div>
                      <div className="text-left">
                        <p className="font-black italic uppercase tracking-tight text-lg">{addon.name}</p>
                        <p className="text-[11px] font-bold text-zinc-500 uppercase tracking-wide mt-1">
                          {addon.description}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm font-black text-zinc-400">
                      +₦{parseFloat(addon.price).toLocaleString()}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 4: PERSONALIZE */}
        {step === 4 && (
          <div className="space-y-16">
            <header className="space-y-6 text-center max-w-2xl mx-auto">
              <span className="text-red-600 text-[10px] font-black uppercase tracking-[0.4em]">Step 4 of 6</span>
              <h2 className="text-6xl md:text-7xl font-black italic uppercase tracking-tighter leading-[0.9]">
                Make it yours
              </h2>
              <p className="text-zinc-500 text-sm font-bold uppercase tracking-wide">
                Add your personal touch with a heartfelt message
              </p>
            </header>

            <div className="space-y-10 max-w-2xl mx-auto">
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 block">
                  Your Message
                </label>
                <textarea 
                  value={formData.message}
                  onChange={(e) => setFormData(prev => ({...prev, message: e.target.value}))}
                  placeholder="Share your thoughts from the heart..."
                  className="w-full bg-zinc-900/50 border-2 border-zinc-800 rounded-[40px] p-10 text-sm font-bold uppercase outline-none focus:border-red-600 focus:bg-zinc-900 min-h-[200px] resize-none transition-all"
                />
              </div>
              
              {selectedTier && selectedTier.id !== tiers[0]?.id && (
                <div className="space-y-6">
                  <p className="text-zinc-500 text-xs font-bold uppercase tracking-wide text-center">
                    Enhance with voice or video
                  </p>
                  <div className="grid grid-cols-2 gap-5">
                    <button className="group p-10 bg-zinc-900/50 rounded-[40px] border-2 border-dashed border-zinc-800 flex flex-col items-center gap-4 hover:border-red-600 hover:bg-zinc-900 transition-all">
                      <Mic className="w-8 h-8 text-zinc-500 group-hover:text-red-600 transition-all" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Record Voice</span>
                    </button>
                    {selectedTier.id === tiers[tiers.length - 1]?.id && (
                      <button className="group p-10 bg-zinc-900/50 rounded-[40px] border-2 border-dashed border-zinc-800 flex flex-col items-center gap-4 hover:border-red-600 hover:bg-zinc-900 transition-all">
                        <Video className="w-8 h-8 text-zinc-500 group-hover:text-red-600 transition-all" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Upload Video</span>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* STEP 5: RECIPIENT */}
        {step === 5 && (
          <div className="space-y-16">
            <header className="space-y-6 text-center max-w-2xl mx-auto">
              <span className="text-red-600 text-[10px] font-black uppercase tracking-[0.4em]">Step 5 of 6</span>
              <h2 className="text-6xl md:text-7xl font-black italic uppercase tracking-tighter leading-[0.9]">
                Who receives the joy?
              </h2>
              <p className="text-zinc-500 text-sm font-bold uppercase tracking-wide">
                Enter their contact details for seamless delivery
              </p>
            </header>

            <div className="space-y-8 max-w-2xl mx-auto">
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 block">
                  Contact Information
                </label>
                <input 
                  type="text"
                  placeholder="Email or phone number"
                  value={formData.recipientContact}
                  onChange={(e) => setFormData(prev => ({...prev, recipientContact: e.target.value}))}
                  className="w-full bg-zinc-900/50 border-2 border-zinc-800 rounded-full px-10 py-7 text-xs font-black uppercase tracking-widest outline-none focus:border-red-600 focus:bg-zinc-900 transition-all"
                />
              </div>
              
              {selectedAddons.some(a => a.name.toLowerCase().includes('physical')) && (
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 block">
                    Shipping Address
                  </label>
                  <textarea 
                    placeholder="Enter full shipping address for physical delivery"
                    value={formData.physicalAddress}
                    onChange={(e) => setFormData(prev => ({...prev, physicalAddress: e.target.value}))}
                    className="w-full bg-zinc-900/50 border-2 border-zinc-800 rounded-[40px] p-10 text-xs font-black uppercase tracking-widest outline-none focus:border-red-600 focus:bg-zinc-900 min-h-[140px] resize-none transition-all"
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* STEP 6: PREVIEW & CONFIRM */}
        {step === 6 && (
          <div className="space-y-16">
            <header className="text-center space-y-6">
              <span className="text-red-600 text-[10px] font-black uppercase tracking-[0.4em]">Step 6 of 6</span>
              <h2 className="text-6xl md:text-7xl font-black italic uppercase tracking-tighter leading-[0.9]">
                Almost there
              </h2>
              <p className="text-zinc-500 text-sm font-bold uppercase tracking-wide">
                Review your gift before sending
              </p>
            </header>
            
            <div className="max-w-2xl mx-auto space-y-8">
              <div className="bg-zinc-900/50 rounded-[48px] p-12 space-y-10 border-2 border-zinc-800 shadow-2xl">
                <div className="flex justify-between items-center pb-8 border-b border-zinc-800">
                  <span className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">Occasion</span>
                  <span className="font-black italic uppercase text-lg">{selectedOccasion?.name}</span>
                </div>
                
                <div className="flex justify-between items-center pb-8 border-b border-zinc-800">
                  <span className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">Experience Tier</span>
                  <span className="font-black italic uppercase text-lg">{selectedTier?.name}</span>
                </div>
                
                {selectedAddons.length > 0 && (
                  <div className="pb-8 border-b border-zinc-800 space-y-4">
                    <span className="text-zinc-500 text-[10px] font-black uppercase tracking-widest block">Add-ons</span>
                    <div className="space-y-2">
                      {selectedAddons.map(addon => (
                        <div key={addon.id} className="flex justify-between items-center">
                          <span className="text-sm font-bold uppercase text-zinc-400">{addon.name}</span>
                          <span className="text-xs font-black text-zinc-600">+₦{parseFloat(addon.price).toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="space-y-4">
                  <span className="text-zinc-500 text-[10px] font-black uppercase tracking-widest block">Your Message</span>
                  <p className="text-sm font-bold uppercase text-zinc-300 italic leading-relaxed">
                    "{formData.message}"
                  </p>
                </div>

                <div className="flex justify-between items-center pt-8 border-t border-zinc-800">
                  <span className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">Recipient</span>
                  <span className="text-sm font-bold uppercase text-zinc-400">{formData.recipientContact}</span>
                </div>
              </div>

              <div className="flex justify-between items-center p-10 bg-gradient-to-br from-white to-zinc-100 text-black rounded-[40px] shadow-2xl">
                <p className="text-xs font-black uppercase tracking-[0.3em]">Total Amount</p>
                <p className="text-4xl font-black italic uppercase tracking-tighter">₦{totalPrice.toLocaleString()}</p>
              </div>
            </div>
          </div>
        )}

        {/* STEP 7: SUCCESS */}
        {step === 7 && (
          <div className="text-center space-y-16 py-20">
            <div className="relative">
              <div className="absolute inset-0 blur-3xl bg-red-600/30 rounded-full"></div>
              <div className="relative w-32 h-32 bg-red-600 rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-red-600/50">
                <Check className="w-16 h-16 text-white" strokeWidth={3} />
              </div>
            </div>
            
            <div className="space-y-8">
              <h2 className="text-6xl md:text-7xl font-black italic uppercase tracking-tighter leading-[0.9] max-w-2xl mx-auto">
                Your gift is on its way
              </h2>
              <p className="text-zinc-500 text-sm font-bold uppercase tracking-widest max-w-md mx-auto leading-relaxed">
                We've got it all set. They'll cherish this thoughtful surprise.
              </p>
            </div>
            
            <button 
              onClick={() => {
                setStep(1);
                setFormData({
                  occasionSlug: '',
                  tierId: '',
                  addonIds: [],
                  message: '',
                  recipientContact: '',
                  deliveryDate: '',
                  physicalAddress: '',
                });
              }}
              className="px-16 py-7 bg-white text-black rounded-full text-[10px] font-black uppercase tracking-[0.3em] hover:bg-red-600 hover:text-white transition-all shadow-2xl"
            >
              Send Another Gift
            </button>
          </div>
        )}

        {/* Navigation Controls */}
        {step < 7 && (
          <div className="fixed bottom-12 left-1/2 -translate-x-1/2 w-full max-w-4xl px-6 flex justify-between items-center z-40">
            {step > 1 ? (
              <button 
                onClick={prevStep} 
                className="w-16 h-16 rounded-full border-2 border-zinc-800 bg-black/80 backdrop-blur-sm flex items-center justify-center hover:border-white hover:bg-zinc-900 transition-all shadow-2xl"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
            ) : <div />}

            <button 
              onClick={step === 6 ? handleCreateGift : nextStep} 
              disabled={isSubmitting || !canProceed()}
              className="px-14 py-7 bg-white text-black rounded-full text-[10px] font-black uppercase tracking-[0.3em] hover:bg-red-600 hover:text-white transition-all shadow-2xl flex items-center gap-4 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-black"
            >
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
              {step === 6 ? "Confirm and Pay" : "Next Step"} 
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}

      </main>
    </div>
  );
}