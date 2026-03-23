"use client";

// components/LensraFooter.tsx
// Lensra — Footer
// Design: Premium black/white/red — clean, emotional, spacious
// Fonts: Montserrat · Inter

import Link from "next/link";

const IgIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
  </svg>
);

const TkIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.34 6.34 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.77 1.52V6.75a4.85 4.85 0 01-1-.06z" />
  </svg>
);

const WaIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

export default function LensraFooter() {
  const year = new Date().getFullYear();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800;900&family=Inter:wght@300;400;500;600&display=swap');

        /* ── CTA BAND ── */
        .lxf-band {
          background: #DD183B;
          padding: 48px 6vw;
          display: flex; align-items: center;
          justify-content: space-between;
          flex-wrap: wrap; gap: 28px;
          position: relative; overflow: hidden;
        }

        /* Large ghost text in background */
        .lxf-band::after {
          content: 'LENSRA';
          position: absolute; right: 4vw; top: 50%;
          transform: translateY(-50%);
          font-family: 'Montserrat', sans-serif;
          font-size: clamp(60px, 11vw, 140px);
          font-weight: 900;
          color: rgba(255,255,255,0.07);
          pointer-events: none; user-select: none;
          letter-spacing: -0.04em; line-height: 1;
        }

        .lxf-band-left { position: relative; z-index: 1; }
        .lxf-band-eyebrow {
          font-family: 'Montserrat', sans-serif;
          font-size: 9px; font-weight: 800;
          letter-spacing: 0.35em; text-transform: uppercase;
          color: rgba(255,255,255,0.55);
          margin-bottom: 10px; display: block;
        }
        .lxf-band-heading {
          font-family: 'Montserrat', sans-serif;
          font-size: clamp(22px, 3vw, 38px);
          font-weight: 900; line-height: 1.1;
          letter-spacing: -0.02em;
          color: #FFFFFF;
        }

        .lxf-band-right {
          display: flex; flex-direction: column;
          gap: 10px; position: relative; z-index: 1;
          min-width: 220px;
        }
        .lxf-band-cta-main {
          display: flex; align-items: center; justify-content: center; gap: 8px;
          padding: 16px 36px;
          background: #FFFFFF; color: #DD183B;
          font-family: 'Montserrat', sans-serif;
          font-size: 11px; font-weight: 800;
          letter-spacing: 0.15em; text-transform: uppercase;
          text-decoration: none; border-radius: 1px;
          transition: background 0.2s, color 0.2s;
        }
        .lxf-band-cta-main:hover { background: #0F0F0F; color: #fff; }
        .lxf-band-cta-sec {
          display: flex; align-items: center; justify-content: center; gap: 6px;
          padding: 12px 36px;
          background: transparent;
          border: 1px solid rgba(255,255,255,0.25);
          color: rgba(255,255,255,0.65);
          font-family: 'Montserrat', sans-serif;
          font-size: 10px; font-weight: 700;
          letter-spacing: 0.15em; text-transform: uppercase;
          text-decoration: none; border-radius: 1px;
          transition: border-color 0.2s, color 0.2s;
        }
        .lxf-band-cta-sec:hover { border-color: rgba(255,255,255,0.6); color: #fff; }

        /* ── MAIN FOOTER ── */
        .lxf-main {
          background: #0F0F0F;
          padding: 80px 6vw 0;
          position: relative;
        }

        /* Top row: brand + newsletter */
        .lxf-top {
          display: flex; align-items: flex-start;
          justify-content: space-between;
          gap: 48px; flex-wrap: wrap;
          padding-bottom: 64px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          margin-bottom: 64px;
        }

        /* Logo/brand in footer */
        .lxf-brand {}
        .lxf-flogo {
          display: flex; align-items: center; gap: 10px;
          text-decoration: none; margin-bottom: 16px;
        }
        .lxf-flogo-mark {
          width: 30px; height: 30px;
          background: #DD183B; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .lxf-flogo-word {
          font-family: 'Montserrat', sans-serif;
          font-size: 20px; font-weight: 900;
          letter-spacing: 0.12em; text-transform: uppercase;
          color: #FFFFFF;
        }
        .lxf-flogo-dot { color: #DD183B; }
        .lxf-brand-tagline {
          font-family: 'Montserrat', sans-serif;
          font-size: 9px; font-weight: 800;
          letter-spacing: 0.35em; text-transform: uppercase;
          color: rgba(221,24,59,0.6); display: block;
          margin-bottom: 16px;
        }
        .lxf-brand-desc {
          font-family: 'Inter', sans-serif;
          font-size: 13px; font-weight: 300;
          color: rgba(255,255,255,0.35);
          line-height: 1.85; max-width: 280px;
          margin-bottom: 28px;
        }
        .lxf-socials { display: flex; gap: 8px; }
        .lxf-social {
          width: 40px; height: 40px;
          display: flex; align-items: center; justify-content: center;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 50%;
          color: rgba(255,255,255,0.3);
          text-decoration: none;
          transition: border-color 0.2s, color 0.2s, background 0.2s;
          cursor: pointer; background: none;
        }
        .lxf-social:hover {
          border-color: #DD183B;
          color: #DD183B;
          background: rgba(221,24,59,0.06);
        }

        /* Newsletter */
        .lxf-newsletter { max-width: 380px; }
        .lxf-nl-label {
          font-family: 'Montserrat', sans-serif;
          font-size: 9px; font-weight: 800;
          letter-spacing: 0.35em; text-transform: uppercase;
          color: #DD183B; margin-bottom: 12px; display: block;
        }
        .lxf-nl-heading {
          font-family: 'Montserrat', sans-serif;
          font-size: 20px; font-weight: 800;
          color: #FFFFFF; line-height: 1.2;
          letter-spacing: -0.02em;
          margin-bottom: 8px;
        }
        .lxf-nl-sub {
          font-family: 'Inter', sans-serif;
          font-size: 13px; font-weight: 300;
          color: rgba(255,255,255,0.35);
          line-height: 1.7; margin-bottom: 20px;
        }
        .lxf-nl-form {
          display: flex; gap: 0;
        }
        .lxf-nl-input {
          flex: 1;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.08);
          border-right: none;
          border-radius: 1px 0 0 1px;
          color: #FFFFFF;
          font-family: 'Inter', sans-serif;
          font-size: 13px; font-weight: 400;
          padding: 13px 18px;
          outline: none;
          transition: border-color 0.2s;
        }
        .lxf-nl-input::placeholder { color: rgba(255,255,255,0.2); }
        .lxf-nl-input:focus { border-color: rgba(221,24,59,0.4); }
        .lxf-nl-btn {
          background: #DD183B; color: #fff;
          border: none; cursor: pointer;
          padding: 13px 22px;
          font-family: 'Montserrat', sans-serif;
          font-size: 10px; font-weight: 800;
          letter-spacing: 0.15em; text-transform: uppercase;
          border-radius: 0 1px 1px 0;
          white-space: nowrap;
          transition: background 0.2s;
        }
        .lxf-nl-btn:hover { background: #C2152F; }

        /* ── LINKS GRID ── */
        .lxf-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 40px;
          padding-bottom: 64px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }

        .lxf-col-head {
          font-family: 'Montserrat', sans-serif;
          font-size: 9px; font-weight: 800;
          letter-spacing: 0.36em; text-transform: uppercase;
          color: rgba(255,255,255,0.25);
          margin-bottom: 20px; display: block;
          padding-bottom: 12px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .lxf-links { list-style: none; }
        .lxf-links li { margin-bottom: 11px; }
        .lxf-link {
          font-family: 'Inter', sans-serif;
          font-size: 13px; font-weight: 400;
          color: rgba(255,255,255,0.4);
          text-decoration: none;
          display: inline-flex; align-items: center; gap: 8px;
          transition: color 0.2s;
        }
        .lxf-link:hover { color: #FFFFFF; }
        .lxf-link-badge {
          font-family: 'Montserrat', sans-serif;
          font-size: 7px; font-weight: 800;
          letter-spacing: 0.15em; text-transform: uppercase;
          background: #DD183B; color: #fff;
          padding: 2px 7px; border-radius: 1px;
        }

        /* Contact column */
        .lxf-contact-item { margin-bottom: 20px; }
        .lxf-contact-label {
          font-family: 'Montserrat', sans-serif;
          font-size: 8px; font-weight: 800;
          letter-spacing: 0.32em; text-transform: uppercase;
          color: rgba(255,255,255,0.2);
          display: block; margin-bottom: 4px;
        }
        .lxf-contact-val {
          font-family: 'Inter', sans-serif;
          font-size: 13px; font-weight: 400;
          color: rgba(255,255,255,0.55);
          text-decoration: none;
          transition: color 0.2s; display: block;
        }
        a.lxf-contact-val:hover { color: #DD183B; }
        .lxf-contact-sub {
          font-family: 'Inter', sans-serif;
          font-size: 11px; font-weight: 300;
          color: rgba(255,255,255,0.2);
          margin-top: 3px; display: block;
          line-height: 1.6;
        }

        /* ── BOTTOM BAR ── */
        .lxf-bottom {
          display: flex; align-items: center;
          justify-content: space-between;
          flex-wrap: wrap; gap: 16px;
          padding: 22px 0;
        }
        .lxf-copy {
          font-family: 'Inter', sans-serif;
          font-size: 11px; font-weight: 300;
          color: rgba(255,255,255,0.2);
          letter-spacing: 0.04em;
        }
        .lxf-copy strong { color: rgba(255,255,255,0.4); font-weight: 500; }
        .lxf-legal { display: flex; align-items: center; gap: 4px; }
        .lxf-legal-link {
          font-family: 'Inter', sans-serif;
          font-size: 11px; font-weight: 400;
          color: rgba(255,255,255,0.2);
          text-decoration: none; padding: 0 10px;
          transition: color 0.2s;
        }
        .lxf-legal-link:hover { color: rgba(255,255,255,0.6); }
        .lxf-legal-sep {
          width: 1px; height: 10px;
          background: rgba(255,255,255,0.1);
        }
        .lxf-secure {
          display: inline-flex; align-items: center; gap: 6px;
          font-family: 'Inter', sans-serif;
          font-size: 10px; font-weight: 400;
          color: rgba(255,255,255,0.18);
          letter-spacing: 0.05em;
        }
        .lxf-secure svg { opacity: 0.4; }

        /* ── RESPONSIVE ── */
        @media (max-width: 1024px) {
          .lxf-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 768px) {
          .lxf-top { flex-direction: column; }
          .lxf-newsletter { max-width: 100%; }
          .lxf-band { flex-direction: column; }
          .lxf-band-right { min-width: 0; width: 100%; }
        }
        @media (max-width: 560px) {
          .lxf-grid { grid-template-columns: 1fr; gap: 28px; }
          .lxf-bottom { flex-direction: column; align-items: flex-start; }
          .lxf-legal { flex-wrap: wrap; }
        }
      `}</style>

      <footer>

        {/* ── CTA BAND ── */}
        <div className="lxf-band">
          <div className="lxf-band-left">
            <span className="lxf-band-eyebrow">Start Today</span>
            <h2 className="lxf-band-heading">
              Make someone feel<br />unforgettable.
            </h2>
          </div>
          <div className="lxf-band-right">
            <Link href="/shop" className="lxf-band-cta-main">
              Create Your Gift →
            </Link>
            <Link href="/business" className="lxf-band-cta-sec">
              Corporate Orders
            </Link>
          </div>
        </div>

        {/* ── MAIN DARK SECTION ── */}
        <div className="lxf-main">

          {/* Top: brand + newsletter */}
          <div className="lxf-top">
            <div className="lxf-brand">
              <Link href="/" className="lxf-flogo" aria-label="Lensra home">
                <div className="lxf-flogo-mark">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
                    <path d="M7 2L7 12M2 7L12 7" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </div>
                <span className="lxf-flogo-word">
                  Lensra<span className="lxf-flogo-dot">.</span>
                </span>
              </Link>
              <span className="lxf-brand-tagline">Gifts That Remember.</span>
              <p className="lxf-brand-desc">
                Personalised surprise boxes that create unforgettable moments.
                Made with care in Benin City. Delivered across Nigeria in 3–5 days.
              </p>
              <div className="lxf-socials">
                <a href="https://instagram.com/lensraNG" className="lxf-social" aria-label="Instagram" target="_blank" rel="noopener noreferrer">
                  <IgIcon />
                </a>
                <a href="https://tiktok.com/@lensra" className="lxf-social" aria-label="TikTok" target="_blank" rel="noopener noreferrer">
                  <TkIcon />
                </a>
                <a href="https://wa.me/2348051385049" className="lxf-social" aria-label="WhatsApp" target="_blank" rel="noopener noreferrer">
                  <WaIcon />
                </a>
              </div>
            </div>

            <div className="lxf-newsletter">
              <span className="lxf-nl-label">Stay in the loop</span>
              <h3 className="lxf-nl-heading">
                Be first to know about<br />new gift experiences.
              </h3>
              <p className="lxf-nl-sub">
                No spam. Just meaningful updates, exclusive offers, and gift inspiration.
              </p>
              <div className="lxf-nl-form">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="lxf-nl-input"
                />
                <button className="lxf-nl-btn">Subscribe</button>
              </div>
            </div>
          </div>

          {/* Links grid */}
          <div className="lxf-grid">

            {/* Gifts */}
            <div>
              <span className="lxf-col-head">Our Gifts</span>
              <ul className="lxf-links">
                <li>
                  <Link href="/shop/surprise-memory-box" className="lxf-link">
                    Surprise Memory Box
                    <span className="lxf-link-badge">Popular</span>
                  </Link>
                </li>
                <li>
                  <Link href="/shop/exploding-box" className="lxf-link">
                    Exploding Box
                  </Link>
                </li>
                <li>
                  <Link href="/shop/video-memory-card" className="lxf-link">
                    Video Memory Card
                  </Link>
                </li>
                <li>
                  <Link href="/shop" className="lxf-link">
                    Browse All Gifts
                  </Link>
                </li>
                <li>
                  <Link href="/business" className="lxf-link">
                    Corporate Gifting
                  </Link>
                </li>
              </ul>
            </div>

            {/* Occasions */}
            <div>
              <span className="lxf-col-head">Occasions</span>
              <ul className="lxf-links">
                <li><Link href="/shop?tag=birthday"    className="lxf-link">Birthday</Link></li>
                <li><Link href="/shop?tag=anniversary" className="lxf-link">Anniversary</Link></li>
                <li><Link href="/shop?tag=valentine"   className="lxf-link">Valentine's Day</Link></li>
                <li><Link href="/shop?tag=mothers-day" className="lxf-link">Mother's Day</Link></li>
                <li><Link href="/shop?tag=graduation"  className="lxf-link">Graduation</Link></li>
                <li><Link href="/shop?tag=wedding"     className="lxf-link">Wedding</Link></li>
              </ul>
            </div>

            {/* Help */}
            <div>
              <span className="lxf-col-head">Help</span>
              <ul className="lxf-links">
                <li><Link href="/track"    className="lxf-link">Track My Order</Link></li>
                <li><Link href="/delivery" className="lxf-link">Delivery Info</Link></li>
                <li><Link href="/returns"  className="lxf-link">Returns Policy</Link></li>
                <li><Link href="/faq"      className="lxf-link">FAQs</Link></li>
                <li><Link href="/about"    className="lxf-link">Our Story</Link></li>
                <li><Link href="/contact"  className="lxf-link">Contact Us</Link></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <span className="lxf-col-head">Get in Touch</span>
              <div className="lxf-contact-item">
                <span className="lxf-contact-label">WhatsApp</span>
                <a href="https://wa.me/2348051385049" className="lxf-contact-val" target="_blank" rel="noopener noreferrer">
                  +234 805 138 5049
                </a>
                <span className="lxf-contact-sub">Fastest response</span>
              </div>
              <div className="lxf-contact-item">
                <span className="lxf-contact-label">Email</span>
                <a href="mailto:hello@lensra.com" className="lxf-contact-val">
                  hello@lensra.com
                </a>
                <span className="lxf-contact-sub">Within 24 hours</span>
              </div>
              <div className="lxf-contact-item">
                <span className="lxf-contact-label">Location</span>
                <span className="lxf-contact-val">Benin City, Edo State</span>
                <span className="lxf-contact-sub">Mon – Sat · 9am – 6pm WAT</span>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="lxf-bottom">
            <p className="lxf-copy">
              © {year} <strong>Lensra</strong>. Proudly made in Nigeria. All rights reserved.
            </p>
            <div className="lxf-legal">
              <Link href="/privacy" className="lxf-legal-link">Privacy</Link>
              <span className="lxf-legal-sep" />
              <Link href="/terms" className="lxf-legal-link">Terms</Link>
              <span className="lxf-legal-sep" />
              <Link href="/returns" className="lxf-legal-link">Returns</Link>
            </div>
            <div className="lxf-secure">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
              </svg>
              Secured by Paystack
            </div>
          </div>

        </div>
      </footer>
    </>
  );
}