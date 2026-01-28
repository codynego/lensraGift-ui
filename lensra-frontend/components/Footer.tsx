import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin, ShieldCheck, Zap, Award, Globe } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-black text-white border-t border-zinc-900">
      <div className="max-w-[1600px] mx-auto px-6 py-20">
        
        {/* 1. MAIN LINKS AREA */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-16 mb-20">
          
          {/* Brand Box */}
          <div className="lg:col-span-2 space-y-8">
            <h3 className="text-4xl font-black tracking-tighter uppercase italic">
              Lensra<span className="text-red-600">Gifts.</span>
            </h3>
            <p className="text-zinc-500 text-sm font-bold uppercase leading-relaxed max-w-sm">
              We make custom gifts easy. From cool t-shirts to personalized mugs, we print and deliver across Nigeria in 24 hours.
            </p>
            
            <div className="space-y-4">
              <ContactLink icon={<Phone />} text="+2348051385049" href="tel:+2348051385049" />
              <ContactLink icon={<Mail />} text="lensrahq@gmail.com" href="mailto:lensrahq@gmail.com" />
              <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-zinc-600">
                <div className="w-10 h-10 rounded-2xl bg-zinc-900 flex items-center justify-center text-zinc-400">
                  <MapPin className="w-4 h-4" />
                </div>
                <span>Benin City, Edo, Nigeria</span>
              </div>
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-red-600 mb-8">Buy Now</h4>
            <ul className="space-y-4 text-[11px] font-black uppercase tracking-widest text-zinc-400">
              <li><Link href="/shop" className="hover:text-white transition">All Products</Link></li>
              <li><Link href="/shop?category=apparel" className="hover:text-white transition">T-Shirts & Wear</Link></li>
              <li><Link href="/shop?category=drinkware" className="hover:text-white transition">Cups & Mugs</Link></li>
              <li><Link href="/digital-gifts" className="text-white hover:text-red-600 transition italic">★ Digital Gifts</Link></li>
            </ul>
          </div>

          {/* Help Links */}
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-red-600 mb-8">Get Help</h4>
            <ul className="space-y-4 text-[11px] font-black uppercase tracking-widest text-zinc-400">
              <li><Link href="/support" className="hover:text-white transition">Support Center</Link></li>
              <li><Link href="/track" className="hover:text-white transition">Where is my order?</Link></li>
              <li><Link href="/delivery" className="hover:text-white transition">Delivery Info</Link></li>
              <li><Link href="/returns" className="hover:text-white transition">Easy Returns</Link></li>
              <li><Link href="/reseller-program" className="hover:text-white transition">Resellers</Link></li>
              <li><Link href="/blog" className="hover:text-white transition">Blog</Link></li>
            </ul>
          </div>

          {/* Social Icons */}
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-red-600 mb-8">Follow Us</h4>
            <div className="flex flex-wrap gap-3">
              <SocialIcon icon={<Facebook />} color="hover:bg-blue-600" />
              <SocialIcon icon={<Twitter />} color="hover:bg-zinc-700" />
              <SocialIcon icon={<Instagram />} color="hover:bg-pink-600" />
              <SocialIcon icon={<Youtube />} color="hover:bg-red-600" />
            </div>
          </div>
        </div>

        {/* 2. TRUST SYMBOLS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-zinc-900 border border-zinc-900 rounded-[32px] overflow-hidden mb-16">
          <Badge icon={<ShieldCheck />} title="Safe Pay" desc="100% Secure" />
          <Badge icon={<Zap />} title="Fast" desc="24hr Delivery" />
          <Badge icon={<Award />} title="Best" desc="Top Quality" />
          <Badge icon={<Globe />} title="Active" desc="Natiowide" />
        </div>

        {/* 3. FINAL FOOTNOTE */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 pt-8 border-t border-zinc-900">
          <div className="flex gap-6 text-[9px] font-black uppercase tracking-widest text-zinc-600">
            <Link href="/privacy" className="hover:text-white transition">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition">Terms of Use</Link>
          </div>

          <p className="text-[9px] font-black uppercase tracking-widest text-zinc-700">
            © {new Date().getFullYear()} Lensra Studio. Made in Nigeria.
          </p>

          <div className="flex items-center gap-2 opacity-50 grayscale hover:grayscale-0 transition-all">
             <div className="px-3 py-1 bg-zinc-900 rounded font-black text-[8px]">VISA</div>
             <div className="px-3 py-1 bg-zinc-900 rounded font-black text-[8px]">MASTERCARD</div>
             <div className="px-3 py-1 bg-zinc-900 rounded font-black text-[8px]">PAYSTACK</div>
          </div>
        </div>
      </div>
    </footer>
  );
}

// Helper Components
function ContactLink({ icon, text, href }: { icon: any, text: string, href: string }) {
  return (
    <a href={href} className="flex items-center gap-4 group">
      <div className="w-10 h-10 rounded-2xl bg-zinc-900 flex items-center justify-center text-zinc-400 group-hover:bg-red-600 group-hover:text-white transition-all">
        {cloneIcon(icon)}
      </div>
      <span className="text-[11px] font-black uppercase tracking-widest group-hover:text-red-600 transition">{text}</span>
    </a>
  );
}

function SocialIcon({ icon, color }: { icon: any, color: string }) {
  return (
    <a href="#" className={`w-12 h-12 rounded-2xl bg-zinc-900 flex items-center justify-center transition-all duration-300 ${color}`}>
      {cloneIcon(icon)}
    </a>
  );
}

function Badge({ icon, title, desc }: { icon: any, title: string, desc: string }) {
  return (
    <div className="bg-black p-8 flex items-center gap-4 hover:bg-zinc-950 transition-colors">
      <div className="text-red-600">{icon}</div>
      <div>
        <p className="text-[11px] font-black uppercase tracking-widest leading-none">{title}</p>
        <p className="text-[9px] font-bold text-zinc-600 uppercase mt-1">{desc}</p>
      </div>
    </div>
  );
}

function cloneIcon(icon: any) {
  return <icon.type {...icon.props} className="w-5 h-5" />;
}