"use client";
import { useState } from 'react';
import { 
  Building2, Users, Package, TrendingUp, CheckCircle, 
  Truck, Headphones, Mail, Phone, MapPin, Star, 
  ArrowRight, Zap, Briefcase, Globe, ShieldCheck, X 
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
    alert('Thank you. Our business team will contact you within 24 hours.');
    setFormData({ companyName: '', contactName: '', email: '', phone: '', productType: '', quantity: '', budget: '', deadline: '', message: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const benefits = [
    { icon: <Package />, title: 'Bulk Savings', desc: 'Save up to 40% when you order in larger quantities.' },
    { icon: <Users />, title: 'Design Support', desc: 'Work directly with our experts to perfect your brand look.' },
    { icon: <TrendingUp />, title: 'Exact Colors', desc: 'We match your brand colors perfectly every single time.' },
    { icon: <Zap />, title: 'Fast Tracking', desc: 'Your business orders move to the front of our production line.' },
    { icon: <ShieldCheck />, title: 'Quality Check', desc: 'Every item is hand-inspected before it leaves our lab.' },
    { icon: <Briefcase />, title: 'Reseller Ready', desc: 'We can ship directly to your clients with your branding.' }
  ];

  const pricingTiers = [
    { range: '50-99 units', discount: '15%', label: 'Tier 1' },
    { range: '100-249 units', discount: '25%', label: 'Tier 2' },
    { range: '250-499 units', discount: '35%', label: 'Pro' },
    { range: '500+ units', discount: '40%', label: 'Enterprise' }
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-white selection:bg-red-600 overflow-x-hidden">
      
      {/* 1. HERO SECTION */}
      <section className="relative pt-32 pb-20 px-6 lg:px-12 border-b border-zinc-900">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-red-600/5 blur-[120px] -z-10" />
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900 border border-zinc-800 text-[10px] font-bold uppercase tracking-widest text-red-500">
                <Building2 className="w-3 h-3" />
                For Teams & Organizations
              </div>
              <h1 className="text-5xl md:text-7xl font-black leading-tight tracking-tighter uppercase italic">
                Grow Your <br /> <span className="text-red-600">Brand Image.</span>
              </h1>
              <p className="text-lg text-zinc-400 font-medium max-w-lg leading-relaxed">
                High-quality custom products for elite teams. We help you turn your company logo into premium physical gear.
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                <button 
                  onClick={() => document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' })}
                  className="px-10 py-5 bg-red-600 text-white rounded-2xl font-bold uppercase text-xs tracking-widest hover:bg-white hover:text-black transition-all flex items-center gap-3 group"
                >
                  Start an Order <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Partners', val: '10K+' },
                { label: 'Items Made', val: '500K+' },
                { label: 'Reliability', val: '99.9%' },
                { label: 'Support', val: '24/7' }
              ].map((stat, i) => (
                <div key={i} className="p-8 rounded-[32px] bg-zinc-900/40 border border-zinc-800 transition-colors">
                  <div className="text-4xl font-black mb-1 italic text-white">{stat.val}</div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 2. BENEFITS */}
      <section className="py-24 bg-white text-zinc-950">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-16">
            <span className="text-red-600 font-bold text-[10px] uppercase tracking-widest mb-2 block">Our Services</span>
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter uppercase italic">
              Built for <span className="text-zinc-400">Scale.</span>
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, idx) => (
              <div key={idx} className="bg-zinc-50 p-10 rounded-[32px] border border-zinc-100 hover:shadow-xl transition-all group">
                <div className="text-red-600 mb-6 group-hover:scale-110 transition-transform">
                  {cloneIcon(benefit.icon)}
                </div>
                <h3 className="text-xl font-black uppercase tracking-tighter mb-3 italic">{benefit.title}</h3>
                <p className="text-sm text-zinc-500 font-medium leading-relaxed">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. PRICING TIERS */}
      <section className="py-24 bg-zinc-950">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {pricingTiers.map((tier, idx) => (
              <div key={idx} className="p-10 rounded-[32px] border border-zinc-900 bg-zinc-900/30 hover:border-red-600 transition-all">
                <div className="text-[10px] font-bold tracking-widest text-red-500 mb-6 uppercase">{tier.label}</div>
                <div className="text-6xl font-black tracking-tighter mb-2 italic">{tier.discount}</div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-8 italic">Off Total Order</div>
                <div className="pt-6 border-t border-zinc-800">
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase">
                    <CheckCircle className="w-3 h-3 text-red-600" /> {tier.range}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. FORM */}
      <section id="contact-form" className="py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-5xl font-black tracking-tighter uppercase italic mb-4">Get a Quote</h2>
            <p className="text-zinc-500 font-bold uppercase text-[10px] tracking-widest">We respond to all inquiries within 24 hours</p>
          </div>
          
          <div className="bg-zinc-900 p-8 md:p-12 rounded-[40px] border border-zinc-800">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid md:grid-cols-2 gap-6">
                <FormInput label="Company Name" name="companyName" value={formData.companyName} onChange={handleChange} placeholder="Lensra Ltd" />
                <FormInput label="Your Name" name="contactName" value={formData.contactName} onChange={handleChange} placeholder="John Doe" />
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <FormInput label="Email" name="email" value={formData.email} onChange={handleChange} placeholder="john@company.com" type="email" />
                <FormInput label="Phone" name="phone" value={formData.phone} onChange={handleChange} placeholder="+234..." />
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1">What do you need?</label>
                  <select name="productType" className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-6 py-4 outline-none focus:border-red-600 transition text-xs font-bold text-white appearance-none">
                    <option value="">Select Service</option>
                    <option value="apparel">Bulk Apparel</option>
                    <option value="events">Event Merchandise</option>
                    <option value="branding">Full Brand Kit</option>
                  </select>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Estimated Quantity</label>
                  <select name="quantity" className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-6 py-4 outline-none focus:border-red-600 transition text-xs font-bold text-white appearance-none">
                    <option value="">Select Amount</option>
                    <option value="50">50-100 items</option>
                    <option value="500">100-500 items</option>
                    <option value="1000">500+ items</option>
                  </select>
                </div>
              </div>
              <div className="space-y-3">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Additional Details</label>
                  <textarea name="message" rows={4} className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-6 py-5 outline-none focus:border-red-600 transition text-sm font-medium" placeholder="Tell us more about your project..." />
              </div>
              <button type="submit" className="w-full py-6 bg-red-600 hover:bg-white hover:text-black text-white rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-xl shadow-red-600/10">
                Send Request
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* 5. FOOTER */}
      <footer className="py-16 border-t border-zinc-900 bg-black px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between gap-10">
            <ContactBlock icon={<Mail className="w-5 h-5" />} title="Email" val="hello@lensra.com" />
            <ContactBlock icon={<Phone className="w-5 h-5" />} title="Call Us" val="+234 800 000 0000" />
            <ContactBlock icon={<MapPin className="w-5 h-5" />} title="Location" val="Lagos, Nigeria" />
            <ContactBlock icon={<Globe className="w-5 h-5" />} title="Shipping" val="Worldwide" />
        </div>
      </footer>
    </div>
  );
}

// Helpers
function cloneIcon(icon: any) {
    return <icon.type {...icon.props} className="w-10 h-10" strokeWidth={2} />;
}

function FormInput({ label, ...props }: any) {
  return (
    <div className="space-y-3">
      <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1">{label}</label>
      <input 
        {...props} 
        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-6 py-4 outline-none focus:border-red-600 transition text-xs font-bold placeholder:text-zinc-700"
      />
    </div>
  );
}

function ContactBlock({ icon, title, val }: any) {
    return (
        <div className="flex items-center gap-4 group">
            <div className="w-12 h-12 rounded-2xl bg-zinc-900 flex items-center justify-center text-red-500 border border-zinc-800">
                {icon}
            </div>
            <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-600">{title}</p>
                <p className="text-sm font-black uppercase italic">{val}</p>
            </div>
        </div>
    );
}