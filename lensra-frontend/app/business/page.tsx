"use client";
import { useState } from 'react';
import { 
  Building2, Users, Package, TrendingUp, CheckCircle, 
  Truck, Headphones, Mail, Phone, MapPin, Star, 
  ArrowRight, Zap, Briefcase, Globe, ShieldCheck 
} from 'lucide-react';

export default function LensraBusinessPage() {
  const [formData, setFormData] = useState({
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
    productType: '',
    quantity: '',
    budget: '',
    deadline: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Strategic partnership request received. Our corporate lead will contact you within 24 hours.');
    setFormData({ companyName: '', contactName: '', email: '', phone: '', productType: '', quantity: '', budget: '', deadline: '', message: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const benefits = [
    { icon: <Package />, title: 'Volume Logistics', desc: 'Enterprise-grade savings up to 40% on bulk procurement.' },
    { icon: <Users />, title: 'Identity Strategy', desc: 'Direct access to a dedicated brand design consultant.' },
    { icon: <TrendingUp />, title: 'Brand Fidelity', desc: 'Precision-matched identity with total pantone accuracy.' },
    { icon: <Zap />, title: 'Priority Slotting', desc: 'Accelerated production for time-critical corporate deployments.' },
    { icon: <ShieldCheck />, title: 'Quality Protocol', desc: 'Multi-stage biometric QA for every single unit produced.' },
    { icon: <Briefcase />, title: 'White Label', desc: 'Stealth shipping protocols for agency and resale partners.' }
  ];

  const pricingTiers = [
    { range: '50-99 units', discount: '15%', label: 'TIER I', feature: 'Standard Support' },
    { range: '100-249 units', discount: '25%', label: 'TIER II', feature: 'Priority Shipping' },
    { range: '250-499 units', discount: '35%', label: 'PRO', feature: 'Custom Labelling' },
    { range: '500+ units', discount: '40%', label: 'ENTERPRISE', feature: 'Dedicated Account Lead' }
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-white selection:bg-red-600">
      
      {/* 1. ARCHIVE HEADER: IMPACT SECTION */}
      <section className="relative pt-40 pb-32 px-6 lg:px-12 overflow-hidden border-b-[1px] border-zinc-900">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-red-600/10 blur-[150px] -z-10 animate-pulse" />
        <div className="max-w-[1600px] mx-auto">
          <div className="grid lg:grid-cols-12 gap-20 items-center">
            <div className="lg:col-span-7 space-y-10">
              <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-zinc-900 border border-zinc-800 text-[10px] font-black uppercase tracking-[0.5em] text-red-600">
                <Building2 className="w-3.5 h-3.5" />
                Enterprise Operations
              </div>
              <h1 className="text-7xl md:text-[10rem] font-black leading-[0.8] tracking-tighter uppercase italic">
                Scale Your <br /> <span className="text-red-600">Identity.</span>
              </h1>
              <p className="text-xl text-zinc-400 font-bold max-w-xl leading-relaxed uppercase tracking-tight">
                High-volume customization for elite teams. We transform corporate identity into physical benchmarks.
              </p>
              <div className="flex flex-wrap gap-6 pt-6">
                <button 
                  onClick={() => document.getElementById('strategic-brief')?.scrollIntoView({ behavior: 'smooth' })}
                  className="px-12 py-6 bg-red-600 text-white rounded-[24px] font-black uppercase text-xs tracking-[0.3em] hover:bg-white hover:text-black transition-all flex items-center gap-4 group shadow-2xl shadow-red-600/20"
                >
                  Initiate Brief <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                </button>
                <button className="px-12 py-6 bg-zinc-900 border border-zinc-800 text-white rounded-[24px] font-black uppercase text-xs tracking-[0.3em] hover:bg-zinc-800 transition">
                  System Catalog
                </button>
              </div>
            </div>

            {/* Metrics Dashboard */}
            <div className="lg:col-span-5 grid grid-cols-2 gap-4">
              {[
                { label: 'Network Partners', val: '10K+' },
                { label: 'Assets Deployed', val: '500K+' },
                { label: 'Uptime Protocol', val: '99.9%' },
                { label: 'Sync Time', val: '<24H' }
              ].map((stat, i) => (
                <div key={i} className="p-10 rounded-[40px] bg-zinc-900/50 border border-zinc-800 hover:border-red-600/40 transition-colors group">
                  <div className="text-5xl font-black tracking-tighter mb-2 italic group-hover:text-red-500 transition-colors">{stat.val}</div>
                  <div className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 italic">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 2. CORE PROTOCOLS (BENEFITS) */}
      <section className="py-32 bg-white text-zinc-950">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
          <div className="mb-20">
            <span className="text-red-600 font-black text-[10px] uppercase tracking-[0.6em] mb-4 block italic">Process 01.</span>
            <h2 className="text-6xl md:text-8xl font-black tracking-tighter uppercase italic leading-[0.8]">
              Volume <br /> <span className="text-zinc-400">Engineering.</span>
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-zinc-200 border border-zinc-200 overflow-hidden rounded-[40px]">
            {benefits.map((benefit, idx) => (
              <div key={idx} className="bg-white p-16 hover:bg-zinc-50 transition-all group relative">
                <div className="text-zinc-950 mb-10 group-hover:text-red-600 transition-colors">
                  {cloneIcon(benefit.icon)}
                </div>
                <h3 className="text-2xl font-black uppercase tracking-tighter mb-4 italic italic">{benefit.title}</h3>
                <p className="text-sm text-zinc-500 font-bold leading-relaxed uppercase tracking-tight">{benefit.desc}</p>
                <div className="absolute top-8 right-8 text-[10px] font-black text-zinc-200 uppercase tracking-widest">
                  MOD_0{idx + 1}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. DISCOUNT MATRIX (TIERS) */}
      <section className="py-32 bg-zinc-950 border-t border-zinc-900">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
          <div className="grid md:grid-cols-4 gap-6">
            {pricingTiers.map((tier, idx) => (
              <div key={idx} className="group relative p-12 rounded-[48px] border-2 border-zinc-900 bg-zinc-900/20 hover:border-red-600 hover:bg-zinc-900 transition-all duration-500">
                <div className="text-[10px] font-black tracking-[0.5em] text-red-600 mb-8 uppercase">{tier.label}</div>
                <div className="text-7xl font-black tracking-tighter mb-4 italic">{tier.discount}</div>
                <div className="text-xs font-black uppercase tracking-widest text-zinc-500 mb-10 italic">Tier Rebate</div>
                <div className="space-y-4 pt-8 border-t border-zinc-800">
                   <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest">
                      <CheckCircle className="w-3 h-3 text-red-600" /> {tier.range}
                   </div>
                   <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-zinc-400">
                      <CheckCircle className="w-3 h-3 text-zinc-700" /> {tier.feature}
                   </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. STRATEGIC BRIEF (FORM) */}
      <section id="strategic-brief" className="py-40 relative">
        <div className="absolute inset-0 bg-red-600 -z-10 translate-y-1/2 opacity-10 blur-[120px]" />
        <div className="max-w-5xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-20 space-y-6">
            <h2 className="text-7xl md:text-9xl font-black tracking-tighter uppercase italic text-white leading-[0.8]">Brief <br /> <span className="text-red-600">Operations.</span></h2>
            <p className="text-zinc-500 font-black uppercase text-[10px] tracking-[0.4em]">Response Window: 24-Hour Cycle</p>
          </div>
          
          <div className="bg-zinc-900 p-10 lg:p-20 rounded-[60px] border border-zinc-800 shadow-3xl">
            <form onSubmit={handleSubmit} className="space-y-12">
              <div className="grid md:grid-cols-2 gap-12">
                <FormInput label="Corporation" name="companyName" value={formData.companyName} onChange={handleChange} placeholder="LENSRA GMBH" />
                <FormInput label="Officer" name="contactName" value={formData.contactName} onChange={handleChange} placeholder="KLEIN SMITH" />
              </div>
              <div className="grid md:grid-cols-2 gap-12">
                <FormInput label="Network Email" name="email" value={formData.email} onChange={handleChange} placeholder="K.SMITH@BRAND.COM" type="email" />
                <FormInput label="Direct Line" name="phone" value={formData.phone} onChange={handleChange} placeholder="+234..." />
              </div>
              <div className="grid md:grid-cols-2 gap-12">
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 ml-2">Mission Objective</label>
                  <select name="productType" className="w-full bg-zinc-950 border-2 border-zinc-800 rounded-[20px] px-8 py-6 outline-none focus:border-red-600 transition uppercase text-xs font-black tracking-[0.2em] text-white appearance-none">
                    <option value="">Select Protocol</option>
                    <option value="apparel">Bulk Apparel Deployment</option>
                    <option value="events">Strategic Event Assets</option>
                    <option value="branding">Full Ecosystem Identity</option>
                  </select>
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 ml-2">Deployment Scale</label>
                  <select name="quantity" className="w-full bg-zinc-950 border-2 border-zinc-800 rounded-[20px] px-8 py-6 outline-none focus:border-red-600 transition uppercase text-xs font-black tracking-[0.2em] text-white appearance-none">
                    <option value="">Asset Count</option>
                    <option value="50">50-100 Units</option>
                    <option value="500">500+ Units</option>
                    <option value="1000">1000+ (Enterprise Level)</option>
                  </select>
                </div>
              </div>
              <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 ml-2">The Mission Brief</label>
                  <textarea name="message" rows={5} className="w-full bg-zinc-950 border-2 border-zinc-800 rounded-[32px] px-8 py-8 outline-none focus:border-red-600 transition text-[13px] font-bold uppercase tracking-tight placeholder:text-zinc-800" placeholder="DESCRIBE YOUR VISION IN DETAIL..." />
              </div>
              <button type="submit" className="w-full py-8 bg-red-600 hover:bg-white hover:text-black text-white rounded-[32px] font-black uppercase tracking-[0.4em] text-xs transition-all transform active:scale-[0.98] shadow-2xl shadow-red-600/20">
                Transmit Strategic Briefing
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* 5. LOGISTICS FOOTER */}
      <section className="py-24 border-t border-zinc-900 bg-black">
        <div className="max-w-[1600px] mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-16">
            <ContactBlock icon={<Mail className="w-6 h-6" />} title="Secure Email" val="operations@lensra.com" />
            <ContactBlock icon={<Phone className="w-6 h-6" />} title="Priority Line" val="+234 812 000 0000" />
            <ContactBlock icon={<MapPin className="w-6 h-6" />} title="Main Lab" val="Lagos, Nigeria" />
            <ContactBlock icon={<Globe className="w-6 h-6" />} title="Logistics" val="Global Deployment" />
        </div>
      </section>
    </div>
  );
}

// Sub-components
function cloneIcon(icon: any) {
    return <icon.type {...icon.props} className="w-12 h-12" strokeWidth={1.5} />;
}

function FormInput({ label, ...props }: any) {
  return (
    <div className="space-y-4">
      <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 ml-2">{label}</label>
      <input 
        {...props} 
        className="w-full bg-zinc-950 border-2 border-zinc-800 rounded-[20px] px-8 py-6 outline-none focus:border-red-600 transition text-xs font-black uppercase tracking-[0.2em] placeholder:text-zinc-800"
      />
    </div>
  );
}

function ContactBlock({ icon, title, val }: any) {
    return (
        <div className="flex items-center gap-6 group cursor-pointer">
            <div className="w-16 h-16 rounded-[24px] bg-zinc-900 border border-zinc-800 flex items-center justify-center text-red-600 group-hover:bg-red-600 group-hover:text-white transition-all duration-500">
                {icon}
            </div>
            <div>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 mb-1 italic">{title}</p>
                <p className="text-lg font-black tracking-tighter uppercase italic">{val}</p>
            </div>
        </div>
    );
}