import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin, ShieldCheck, Zap, Award, Globe } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-black text-white border-t border-zinc-900">
      <div className="max-w-[1600px] mx-auto px-4 py-16">
        
        {/* 1. MAIN LINKS AREA */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          
          {/* Brand Box */}
          <div className="lg:col-span-2 space-y-6">
            <h3 className="text-3xl font-bold tracking-tight uppercase italic">
              Lensra<span className="text-red-500">.</span>
            </h3>
            <p className="text-zinc-400 text-sm font-medium leading-relaxed max-w-xs">
              Custom gifts made simple. Premium prints delivered fast across Nigeria.
            </p>
            
            <div className="space-y-3">
              <ContactLink icon={<Phone className="w-4 h-4" />} text="+2348051385049" href="tel:+2348051385049" />
              <ContactLink icon={<Mail className="w-4 h-4" />} text="lensrahq@gmail.com" href="mailto:lensrahq@gmail.com" />
              <div className="flex items-center gap-3 text-[9px] font-semibold uppercase tracking-widest text-zinc-500">
                <div className="w-8 h-8 rounded-xl bg-zinc-900 flex items-center justify-center text-zinc-400">
                  <MapPin className="w-4 h-4" />
                </div>
                <span>Benin City, Edo, Nigeria</span>
              </div>
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h4 className="text-[9px] font-semibold uppercase tracking-[0.3em] text-red-500 mb-6">Shop</h4>
            <ul className="space-y-3 text-[10px] font-semibold uppercase tracking-widest text-zinc-400">
              <li><Link href="/shop" className="hover:text-white transition">All Products</Link></li>
              <li><Link href="/shop?category=apparel" className="hover:text-white transition">Apparel</Link></li>
              <li><Link href="/shop?category=drinkware" className="hover:text-white transition">Drinkware</Link></li>
              <li><Link href="/digital-gifts" className="text-white hover:text-red-500 transition italic">Digital Gifts</Link></li>
            </ul>
          </div>

          {/* Help Links */}
          <div>
            <h4 className="text-[9px] font-semibold uppercase tracking-[0.3em] text-red-500 mb-6">Support</h4>
            <ul className="space-y-3 text-[10px] font-semibold uppercase tracking-widest text-zinc-400">
              <li><Link href="/support" className="hover:text-white transition">Help Center</Link></li>
              <li><Link href="/track" className="hover:text-white transition">Track Order</Link></li>
              <li><Link href="/delivery" className="hover:text-white transition">Shipping</Link></li>
              <li><Link href="/returns" className="hover:text-white transition">Returns</Link></li>
              <li><Link href="/reseller-program" className="hover:text-white transition">Resellers</Link></li>
              <li><Link href="/blog" className="hover:text-white transition">Blog</Link></li>
            </ul>
          </div>

          {/* Social Icons */}
          <div>
            <h4 className="text-[9px] font-semibold uppercase tracking-[0.3em] text-red-500 mb-6">Connect</h4>
            <div className="flex flex-wrap gap-2">
              <SocialIcon icon={<Facebook className="w-4 h-4" />} color="hover:bg-blue-600" href="https://www.facebook.com/lensragift" />
              <SocialIcon icon={<Twitter className="w-4 h-4" />} color="hover:bg-zinc-700" href='https://www.twitter.com/lensragift/'/>
              <SocialIcon icon={<Instagram className="w-4 h-4" />} color="hover:bg-pink-600" href="https://www.instagram.com/lensragift/" />
              <SocialIcon icon={<Youtube className="w-4 h-4" />} color="hover:bg-red-600" />
            </div>
          </div>
        </div>

        {/* 2. TRUST SYMBOLS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-zinc-900 border border-zinc-900 rounded-2xl overflow-hidden mb-12">
          <Badge icon={<ShieldCheck className="w-5 h-5" />} title="Secure" desc="100% Safe Payments" />
          <Badge icon={<Zap className="w-5 h-5" />} title="Fast" desc="24hr Delivery" />
          <Badge icon={<Award className="w-5 h-5" />} title="Quality" desc="Premium Materials" />
          <Badge icon={<Globe className="w-5 h-5" />} title="Nationwide" desc="All Over Nigeria" />
        </div>

        {/* 3. FINAL FOOTNOTE */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-6 border-t border-zinc-900">
          <div className="flex gap-4 text-[9px] font-semibold uppercase tracking-widest text-zinc-500">
            <Link href="/privacy" className="hover:text-white transition">Privacy</Link>
            <Link href="/terms" className="hover:text-white transition">Terms</Link>
          </div>

          <p className="text-[9px] font-semibold uppercase tracking-widest text-zinc-600">
            © {new Date().getFullYear()} Lensra. Proudly Nigerian.
          </p>

          <div className="flex items-center gap-2 opacity-70 hover:opacity-100 transition-all">
             <div className="px-2 py-0.5 bg-zinc-900 rounded font-semibold text-[8px]">VISA</div>
             <div className="px-2 py-0.5 bg-zinc-900 rounded font-semibold text-[8px]">MASTERCARD</div>
             <div className="px-2 py-0.5 bg-zinc-900 rounded font-semibold text-[8px]">PAYSTACK</div>
          </div>
        </div>
      </div>
    </footer>
  );
}

// Helper Components
function ContactLink({ icon, text, href }: { icon: any, text: string, href: string }) {
  return (
    <a href={href} className="flex items-center gap-3 group">
      <div className="w-8 h-8 rounded-xl bg-zinc-900 flex items-center justify-center text-zinc-400 group-hover:bg-red-500 group-hover:text-white transition-all">
        {icon}
      </div>
      <span className="text-[10px] font-semibold uppercase tracking-widest group-hover:text-red-500 transition">{text}</span>
    </a>
  );
}

function SocialIcon({ icon, color, href }: { icon: any, color: string, href?: string }) {
  return (
    <a href={href || "#"} className={`w-10 h-10 rounded-xl bg-zinc-900 flex items-center justify-center transition-all duration-300 ${color}`}>
      {icon}
    </a>
  );
}

function Badge({ icon, title, desc }: { icon: any, title: string, desc: string }) {
  return (
    <div className="bg-black p-6 flex items-center gap-3 hover:bg-zinc-950 transition-colors">
      <div className="text-red-500">{icon}</div>
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-widest leading-none">{title}</p>
        <p className="text-[9px] font-medium text-zinc-500 uppercase mt-0.5">{desc}</p>
      </div>
    </div>
  );
}