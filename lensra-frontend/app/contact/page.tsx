"use client";

import { Mail, MessageCircle, Send, MapPin, Clock } from 'lucide-react';
import { useState } from 'react';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ name, email, message });
    alert('Got it! We will get back to you shortly.');
    setName('');
    setEmail('');
    setMessage('');
  };

  return (
    <div className="min-h-screen bg-white text-black">
      
      {/* 1. HERO: BOLD & DIRECT */}
      <section className="bg-zinc-950 text-white py-24 px-6 border-b-[12px] border-red-600">
        <div className="max-w-7xl mx-auto">
          <span className="text-red-600 font-black uppercase tracking-[0.4em] text-[10px] mb-4 block">Help Center</span>
          <h1 className="text-6xl md:text-9xl font-black tracking-tighter italic uppercase leading-none">
            SAY <span className="text-zinc-700">HELLO</span><span className="text-red-600">.</span>
          </h1>
          <p className="mt-8 text-lg md:text-2xl font-bold uppercase tracking-tight text-zinc-400 max-w-xl">
            Have a question about a custom order or a design? Our team is ready to talk.
          </p>
        </div>
      </section>

      {/* 2. FAST CONTACT CHANNELS */}
      <section className="py-20 px-6 border-b border-zinc-100">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
          <ContactCard 
            icon={<MessageCircle className="w-8 h-8" />}
            title="WhatsApp"
            actionText="Chat Now"
            link="https://wa.me/234XXXXXXXXXX"
            desc="Fastest for quick questions."
            color="hover:border-green-500"
          />
          <ContactCard 
            icon={<Mail className="w-8 h-8" />}
            title="Email"
            actionText="Send Email"
            link="mailto:emonenaabednego@gmail.com"
            desc="Best for bulk orders & business."
            color="hover:border-red-600"
          />
          <ContactCard 
            icon={<Clock className="w-8 h-8" />}
            title="Hours"
            actionText="Mon - Sat"
            link="#"
            desc="9:00 AM — 6:00 PM WAT"
            color="hover:border-black"
          />
        </div>
      </section>

      {/* 3. MESSAGE FORM */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20">
          <div>
            <h2 className="text-4xl font-black italic uppercase tracking-tighter mb-6">Drop a Message</h2>
            <p className="font-bold text-zinc-400 uppercase tracking-widest text-xs leading-loose mb-10">
              Fill out the form and we'll reply within 2 hours during work days.
            </p>
            
            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="bg-zinc-100 p-3 rounded-xl"><MapPin className="w-5 h-5" /></div>
                <div>
                  <p className="font-black uppercase text-[10px] tracking-widest">Studio Location</p>
                  <p className="font-bold text-sm text-zinc-500">Lagos, Nigeria</p>
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-6 py-4 bg-zinc-50 border-2 border-transparent focus:border-black focus:bg-white rounded-2xl outline-none transition-all font-bold"
                  placeholder="JOHN DOE"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-6 py-4 bg-zinc-50 border-2 border-transparent focus:border-black focus:bg-white rounded-2xl outline-none transition-all font-bold"
                  placeholder="HELLO@EMAIL.COM"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Your Message</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={6}
                className="w-full px-6 py-4 bg-zinc-50 border-2 border-transparent focus:border-black focus:bg-white rounded-2xl outline-none transition-all font-bold"
                placeholder="TELL US ABOUT YOUR PROJECT..."
                required
              />
            </div>

            <button 
              type="submit"
              className="w-full py-6 bg-black text-white rounded-[24px] font-black uppercase text-xs tracking-[0.3em] hover:bg-red-600 transition-all flex items-center justify-center gap-3"
            >
              Send Message <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </section>

      {/* 4. NEWSLETTER: CLEANED UP */}
      <section className="py-24 px-6 bg-zinc-950 text-white relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter mb-4">Join the Club</h2>
          <p className="text-zinc-500 font-bold uppercase tracking-widest text-[10px] mb-10">Get 10% off your first order when you join.</p>
          
          <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
            <input
              type="email"
              placeholder="YOUR EMAIL"
              className="flex-1 px-8 py-5 rounded-full bg-zinc-900 border border-zinc-800 text-white focus:border-red-600 outline-none font-bold text-xs"
            />
            <button className="px-10 py-5 bg-white text-black rounded-full font-black uppercase text-[10px] tracking-widest hover:bg-red-600 hover:text-white transition-all">
              Join Now
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

// UI Components
function ContactCard({ icon, title, actionText, link, desc, color }: any) {
  return (
    <div className={`p-10 border-2 border-zinc-50 rounded-[40px] transition-all duration-300 group ${color}`}>
      <div className="text-black mb-6 group-hover:text-red-600 transition-colors">{icon}</div>
      <h3 className="text-2xl font-black italic uppercase mb-2">{title}</h3>
      <p className="text-zinc-400 font-bold uppercase text-[10px] tracking-widest mb-8">{desc}</p>
      <a href={link} className="inline-block px-8 py-3 bg-zinc-100 rounded-full font-black uppercase text-[10px] tracking-widest group-hover:bg-black group-hover:text-white transition-all">
        {actionText}
      </a>
    </div>
  );
}