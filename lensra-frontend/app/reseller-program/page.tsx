"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowRight, Check, Wallet, 
  HelpCircle, ChevronDown, Loader2, X, Send, Sparkles
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const BaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000/";

export default function ResellerLanding() {
  const { isAuthenticated, token } = useAuth();
  const router = useRouter();
  
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    whatsapp_number: '',
    marketing_plan: '',
    business_name: ''
  });

  const handleApplyClick = () => {
    if (!isAuthenticated) {
      router.push('/login?next=/reseller');
    } else {
      setShowForm(true);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${BaseUrl}api/reseller/apply/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => {
          setShowForm(false);
          router.push('/dashboard');
        }, 3000);
      } else {
        setError(data.detail || data.error || JSON.stringify(data) || "Something went wrong. Please try again.");
      }
    } catch (err) {
      setError("Connection error. Check your internet.");
      console.error('Application error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 font-sans">
      
      {/* HERO SECTION */}
      <section className="relative pt-24 pb-32 px-4 sm:px-6 overflow-hidden bg-white">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -right-40 -top-40 w-96 h-96 bg-red-600/10 blur-3xl rounded-full" />
          <div className="absolute -left-40 -bottom-40 w-96 h-96 bg-zinc-900/5 blur-3xl rounded-full" />
        </div>

        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-full text-[10px] font-bold uppercase tracking-[0.3em] mb-8 border border-red-100">
            <Sparkles className="w-3 h-3" /> Partner Program 2026
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold uppercase tracking-tighter leading-[0.9] mb-8">
            Become a Reseller <br /> 
            <span className="text-red-600">& Earn 5% Cashback</span>
          </h1>
          
          <p className="max-w-2xl mx-auto text-zinc-500 font-bold uppercase tracking-wider text-[11px] leading-relaxed mb-12">
            The easiest way to start your custom gift business. Earn on every order you place for customers or yourself. No inventory, no stress.
          </p>
          
          <button 
            onClick={handleApplyClick}
            className="inline-flex items-center gap-3 px-10 py-5 bg-zinc-900 text-white rounded-2xl font-bold text-[11px] uppercase tracking-[0.3em] hover:bg-red-600 transition-all duration-300 shadow-xl shadow-zinc-900/20 hover:shadow-red-600/20 hover:scale-105 active:scale-100"
          >
            {isAuthenticated ? "Apply to Become a Reseller" : "Sign in to Apply"} 
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-20 lg:py-32 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block text-[10px] font-bold uppercase tracking-[0.4em] text-zinc-400 mb-4">How It Works</span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold uppercase tracking-tight">Simple 4-Step Process</h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Step number="01" title="Apply" desc="Submit your application and get approved within 24 hours." />
            <Step number="02" title="Order" desc="Place orders for clients (or yourself) directly from your account." />
            <Step number="03" title="Fulfill" desc="Lensra handles the production and nationwide delivery." />
            <Step number="04" title="Earn" desc="Get 5% cashback credited to your wallet immediately." />
          </div>
        </div>
      </section>

      {/* EARNINGS & BENEFITS */}
      <section className="py-20 lg:py-32 px-4 sm:px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="bg-zinc-900 rounded-3xl lg:rounded-[40px] p-8 md:p-12 lg:p-20 text-white relative overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -right-20 -top-20 w-80 h-80 bg-red-600/20 blur-3xl rounded-full" />
            </div>
            
            <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl md:text-5xl font-bold uppercase tracking-tighter mb-8 leading-tight">
                  Earn While We Do <br /> The Heavy Work
                </h2>
                <div className="space-y-5">
                  <Benefit text="5% Cashback on every successful order" />
                  <Benefit text="Valid even on orders you place for yourself" />
                  <Benefit text="Withdraw to any Nigerian bank account" />
                  <Benefit text="No inventory or upfront investment needed" />
                </div>
              </div>
              
              <div className="bg-zinc-950 border border-zinc-800 p-8 rounded-3xl">
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-500 mb-6">Earnings Example</p>
                <div className="space-y-4">
                  <div className="flex justify-between items-end pb-3 border-b border-zinc-800">
                    <span className="text-sm font-bold text-zinc-400 uppercase tracking-tight">Total Sales</span>
                    <span className="text-2xl font-bold tracking-tight text-white">₦200,000</span>
                  </div>
                  <div className="flex justify-between items-end">
                    <span className="text-sm font-bold text-red-500 uppercase tracking-tight">Your Profit</span>
                    <span className="text-4xl font-bold tracking-tight text-red-600">₦10,000</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHO THIS IS FOR & FAQ */}
      <section className="py-20 lg:py-32 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-20">
          <div>
            <h3 className="text-3xl font-bold uppercase tracking-tight mb-8">Perfect For:</h3>
            <ul className="space-y-4 mb-12">
              {[
                'Designers & Creatives',
                'Content Creators & Influencers', 
                'Students & Entrepreneurs',
                'Boutique Owners & Gift Shops'
              ].map(item => (
                <li key={item} className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-red-600 rounded-full flex-shrink-0" />
                  <span className="font-bold uppercase tracking-wide text-[11px] text-zinc-700">{item}</span>
                </li>
              ))}
            </ul>
            <div className="bg-red-50 p-6 rounded-2xl border border-red-100">
              <p className="text-[10px] font-bold uppercase tracking-wide text-red-900 leading-relaxed">
                ⚠️ Not for people looking for "quick money" without placing real orders. This is a legitimate business partnership.
              </p>
            </div>
          </div>
          
          <div>
            <div className="flex items-center gap-3 mb-8">
              <HelpCircle className="w-6 h-6 text-red-600" />
              <h3 className="text-3xl font-bold uppercase tracking-tight">FAQs</h3>
            </div>
            <div className="space-y-3">
              <FaqItem 
                q="Do I earn if I buy for myself?" 
                a="Yes! Any order placed through your approved account qualifies for 5% cashback, whether it's for a customer or yourself." 
              />
              <FaqItem 
                q="Is there a registration fee?" 
                a="No. It is completely free to join. No hidden charges or monthly fees." 
              />
              <FaqItem 
                q="How do I get paid?" 
                a="Cashback is credited to your wallet immediately after order completion. You can withdraw to your bank account anytime." 
              />
              <FaqItem 
                q="How long does approval take?" 
                a="Most applications are reviewed within 24 hours. You'll receive an email once approved." 
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-20 px-4 sm:px-6 bg-white border-t border-zinc-200">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold uppercase tracking-tight mb-6">
            Ready to Start Earning?
          </h2>
          <p className="text-zinc-500 font-bold uppercase tracking-wider text-[11px] mb-8 max-w-2xl mx-auto">
            Join hundreds of resellers already earning passive income with Lensra
          </p>
          <button 
            onClick={handleApplyClick}
            className="inline-flex items-center gap-3 px-10 py-5 bg-zinc-900 text-white rounded-2xl font-bold text-[11px] uppercase tracking-[0.3em] hover:bg-red-600 transition-all duration-300 shadow-xl shadow-zinc-900/20"
          >
            {isAuthenticated ? "Submit Application Now" : "Sign in to Get Started"} 
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* APPLICATION MODAL */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-lg rounded-3xl p-8 md:p-10 relative shadow-2xl overflow-y-auto max-h-[90vh]">
            <button 
              onClick={() => setShowForm(false)} 
              className="absolute top-6 right-6 p-2 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 rounded-xl transition-all duration-300"
            >
              <X className="w-5 h-5" />
            </button>

            {success ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Check className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold uppercase tracking-tight mb-3">Application Sent!</h3>
                <p className="text-zinc-500 text-[11px] font-bold uppercase tracking-wide">
                  We will review your profile within 24 hours and send you an email.
                </p>
              </div>
            ) : (
              <div>
                <div className="mb-8">
                  <h2 className="text-3xl font-bold uppercase tracking-tight mb-2">
                    Reseller Application
                  </h2>
                  <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-wide">
                    Fill out the form below to get started
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 ml-1">
                      WhatsApp Number <span className="text-red-600">*</span>
                    </label>
                    <input 
                      required 
                      type="tel" 
                      placeholder="+234 800 000 0000"
                      className="w-full px-5 py-4 bg-zinc-50 border-2 border-zinc-200 focus:border-zinc-900 rounded-xl outline-none font-bold text-sm transition-all duration-300"
                      value={formData.whatsapp_number}
                      onChange={(e) => setFormData({...formData, whatsapp_number: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 ml-1">
                      Business Name (Optional)
                    </label>
                    <input 
                      type="text" 
                      placeholder="e.g. Lensra Gifts Store"
                      className="w-full px-5 py-4 bg-zinc-50 border-2 border-zinc-200 focus:border-zinc-900 rounded-xl outline-none font-bold text-sm transition-all duration-300"
                      value={formData.business_name}
                      onChange={(e) => setFormData({...formData, business_name: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 ml-1">
                      Where Will You Sell? <span className="text-red-600">*</span>
                    </label>
                    <textarea 
                      required 
                      rows={4}
                      placeholder="e.g. WhatsApp Status, Instagram, Facebook, Physical Store, etc."
                      className="w-full px-5 py-4 bg-zinc-50 border-2 border-zinc-200 focus:border-zinc-900 rounded-xl outline-none font-bold text-sm resize-none transition-all duration-300"
                      value={formData.marketing_plan}
                      onChange={(e) => setFormData({...formData, marketing_plan: e.target.value})}
                    />
                  </div>

                  {error && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                      <p className="text-red-600 text-[10px] font-bold uppercase tracking-wide text-center">
                        {error}
                      </p>
                    </div>
                  )}

                  <button 
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-full py-5 bg-zinc-900 text-white rounded-xl font-bold text-[11px] uppercase tracking-[0.3em] hover:bg-red-600 transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" /> Submitting...
                      </>
                    ) : (
                      <>
                        Submit Application <Send className="w-4 h-4"/>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function Step({ number, title, desc }: { number: string, title: string, desc: string }) {
  return (
    <div className="relative p-8 bg-white rounded-2xl border border-zinc-200 hover:border-zinc-900 hover:shadow-xl transition-all duration-300 group">
      <span className="text-5xl font-bold text-zinc-100 group-hover:text-red-50 transition-colors absolute top-6 right-6 uppercase">
        {number}
      </span>
      <h3 className="text-xl font-bold uppercase tracking-tight mb-4 relative z-10">{title}</h3>
      <p className="text-[11px] font-bold text-zinc-500 uppercase tracking-wide leading-relaxed relative z-10">
        {desc}
      </p>
    </div>
  );
}

function Benefit({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-4">
      <div className="w-6 h-6 bg-red-600 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
        <Check className="w-4 h-4 text-white" />
      </div>
      <span className="text-[11px] font-bold uppercase tracking-wide leading-relaxed">{text}</span>
    </div>
  );
}

function FaqItem({ q, a }: { q: string, a: string }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border border-zinc-200 rounded-xl overflow-hidden hover:border-zinc-900 transition-all duration-300">
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="w-full p-5 text-left flex justify-between items-center bg-white hover:bg-zinc-50 transition-colors"
      >
        <span className="text-[11px] font-bold uppercase tracking-wide pr-4">{q}</span>
        <ChevronDown className={`w-4 h-4 flex-shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="p-5 pt-0 bg-white text-[11px] font-bold text-zinc-500 uppercase tracking-wide leading-relaxed">
          {a}
        </div>
      )}
    </div>
  );
}