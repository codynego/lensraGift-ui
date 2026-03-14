"use client";

// components/AdireFooter.tsx
// Adire — Footer component
// Design: bold, cultural, editorial — matches homepage energy
// Fonts: Playfair Display · Syne
// Sections: amber top band · asymmetric main grid · dark bottom bar

import Link from "next/link";

// ── Ankara background pattern ─────────────────────────────────────────────────

function AnkaraPattern() {
  return (
    <svg aria-hidden style={{
      position: "absolute", inset: 0, width: "100%", height: "100%",
      pointerEvents: "none", opacity: 0.05,
    }}>
      <defs>
        <pattern id="fp" x="0" y="0" width="56" height="56" patternUnits="userSpaceOnUse">
          <circle cx="28" cy="28" r="5"  fill="#C17B3A" />
          <circle cx="28" cy="28" r="11" fill="none" stroke="#C17B3A" strokeWidth="0.7" />
          <circle cx="28" cy="28" r="18" fill="none" stroke="#C17B3A" strokeWidth="0.4" />
          <circle cx="28" cy="28" r="25" fill="none" stroke="#C17B3A" strokeWidth="0.25" />
          <line x1="0"  y1="28" x2="56" y2="28" stroke="#C17B3A" strokeWidth="0.25" />
          <line x1="28" y1="0"  x2="28" y2="56" stroke="#C17B3A" strokeWidth="0.25" />
          <line x1="0"  y1="0"  x2="56" y2="56" stroke="#C17B3A" strokeWidth="0.18" />
          <line x1="56" y1="0"  x2="0"  y2="56" stroke="#C17B3A" strokeWidth="0.18" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#fp)" />
    </svg>
  );
}

// ── Social SVG icons ──────────────────────────────────────────────────────────

const IgIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
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

// ── Component ─────────────────────────────────────────────────────────────────

export default function AdireFooter() {
  const year = new Date().getFullYear();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=Syne:wght@400;500;600;700;800&display=swap');

        /* ── AMBER TOP BAND ── */
        .f-band {
          background: #C17B3A;
          padding: 20px 5vw;
          display: flex; align-items: center;
          justify-content: space-between;
          flex-wrap: wrap; gap: 16px;
          position: relative; overflow: hidden;
        }
        .f-band::before {
          content: 'LENSRA';
          position: absolute; right: 4vw;
          top: 50%; transform: translateY(-50%);
          font-family: 'Playfair Display', serif;
          font-size: clamp(48px, 8vw, 96px);
          font-weight: 900; font-style: italic;
          color: rgba(0,0,0,0.08);
          pointer-events: none; user-select: none;
          letter-spacing: -0.04em; line-height: 1;
        }
        .f-band-text {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: clamp(16px, 2vw, 22px);
          font-weight: 400; font-style: italic;
          color: rgba(255,255,255,0.9);
          position: relative; z-index: 1;
        }
        .f-band-cta {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 12px 28px;
          font-family: 'Syne', system-ui, sans-serif;
          font-size: 10px; font-weight: 800;
          letter-spacing: 0.28em; text-transform: uppercase;
          background: #fff; color: #C17B3A;
          text-decoration: none;
          transition: background 0.2s, color 0.2s;
          position: relative; z-index: 1;
          white-space: nowrap;
        }
        .f-band-cta:hover { background: #1B2A4A; color: #fff; }

        /* ── MAIN FOOTER ── */
        .f-main {
          background: #0e1a30;
          position: relative; overflow: hidden;
          padding: 72px 5vw 0;
        }

        /* Asymmetric grid: tall brand column + 3 link columns */
        .f-grid {
          display: grid;
          grid-template-columns: 1.6fr 1fr 1fr 1.2fr;
          gap: 48px;
          padding-bottom: 64px;
          border-bottom: 1px solid rgba(193,123,58,0.12);
          position: relative; z-index: 1;
        }

        /* Brand column */
        .f-brand { display: flex; flex-direction: column; }
        .f-logo {
          display: flex; align-items: center; gap: 10px;
          text-decoration: none; margin-bottom: 4px;
        }
        .f-logo-mark {
          width: 32px; height: 32px; flex-shrink: 0;
        }
        .f-logo-word {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 28px; font-weight: 900;
          letter-spacing: 0.14em; text-transform: uppercase;
          color: #F5F0E8; line-height: 1;
        }
        .f-logo-dot { color: #C17B3A; font-style: italic; font-weight: 400; }
        .f-tagline {
          font-family: 'Syne', system-ui, sans-serif;
          font-size: 9px; font-weight: 800;
          letter-spacing: 0.42em; text-transform: uppercase;
          color: rgba(193,123,58,0.7);
          margin-bottom: 20px;
        }
        .f-desc {
          font-family: 'Syne', system-ui, sans-serif;
          font-size: 13px; font-weight: 400;
          color: rgba(245,240,232,0.55);
          line-height: 1.9; max-width: 240px;
          margin-bottom: 28px;
        }

        /* Social row */
        .f-socials { display: flex; gap: 6px; }
        .f-social {
          width: 40px; height: 40px;
          display: flex; align-items: center; justify-content: center;
          border: 1px solid rgba(193,123,58,0.18);
          color: rgba(193,123,58,0.4);
          text-decoration: none;
          transition: border-color 0.2s, color 0.2s, background 0.2s;
          cursor: pointer; background: none;
        }
        .f-social:hover {
          border-color: #C17B3A;
          color: #C17B3A;
          background: rgba(193,123,58,0.07);
        }

        /* Link columns */
        .f-col {}
        .f-col-head {
          font-family: 'Syne', system-ui, sans-serif;
          font-size: 9px; font-weight: 800;
          letter-spacing: 0.42em; text-transform: uppercase;
          color: #C17B3A; margin-bottom: 20px;
          padding-bottom: 12px;
          border-bottom: 1px solid rgba(193,123,58,0.15);
          display: flex; align-items: center; gap: 8px;
        }
        .f-col-head::before {
          content: ''; width: 16px; height: 2px;
          background: #C17B3A; flex-shrink: 0;
        }
        .f-links { list-style: none; }
        .f-links li { margin-bottom: 10px; }
        .f-link {
          display: inline-flex; align-items: center; gap: 8px;
          font-family: 'Syne', system-ui, sans-serif;
          font-size: 13px; font-weight: 400;
          color: rgba(245,240,232,0.5);
          text-decoration: none;
          transition: color 0.2s;
        }
        .f-link:hover { color: #D4956A; }
        .f-link-badge {
          font-size: 8px; font-weight: 800;
          letter-spacing: 0.18em; text-transform: uppercase;
          background: rgba(193,123,58,0.15); color: #C17B3A;
          padding: 2px 7px;
        }

        /* Contact column */
        .f-contact-item { margin-bottom: 18px; }
        .f-contact-label {
          font-family: 'Syne', system-ui, sans-serif;
          font-size: 8px; font-weight: 800;
          letter-spacing: 0.36em; text-transform: uppercase;
          color: rgba(193,123,58,0.6); display: block; margin-bottom: 3px;
        }
        .f-contact-val {
          font-family: 'Syne', system-ui, sans-serif;
          font-size: 13px; font-weight: 500;
          color: rgba(245,240,232,0.7); text-decoration: none;
          transition: color 0.2s;
        }
        a.f-contact-val:hover { color: #C17B3A; }
        .f-hours {
          font-family: 'Syne', system-ui, sans-serif;
          font-size: 11px; font-weight: 400;
          color: rgba(245,240,232,0.35); line-height: 1.75; margin-top: 6px;
        }

        /* ── BOTTOM BAR ── */
        .f-bottom {
          position: relative; z-index: 1;
          display: flex; align-items: center;
          justify-content: space-between;
          flex-wrap: wrap; gap: 14px;
          padding: 20px 0;
        }
        .f-copy {
          font-family: 'Syne', system-ui, sans-serif;
          font-size: 11px; font-weight: 400;
          color: rgba(245,240,232,0.4); letter-spacing: 0.06em;
        }
        .f-copy strong { color: rgba(245,240,232,0.65); font-weight: 600; }
        .f-legal { display: flex; align-items: center; gap: 16px; }
        .f-legal-link {
          font-family: 'Syne', system-ui, sans-serif;
          font-size: 11px; font-weight: 400;
          color: rgba(245,240,232,0.4); text-decoration: none;
          letter-spacing: 0.08em; transition: color 0.2s;
        }
        .f-legal-link:hover { color: rgba(245,240,232,0.75); }
        .f-sep {
          width: 3px; height: 3px; border-radius: 50%;
          background: rgba(245,240,232,0.2);
        }
        .f-paystack {
          display: inline-flex; align-items: center; gap: 6px;
          font-family: 'Syne', system-ui, sans-serif;
          font-size: 10px; font-weight: 600;
          letter-spacing: 0.1em;
          color: rgba(245,240,232,0.35);
        }

        /* ── RESPONSIVE ── */
        @media (max-width: 1100px) {
          .f-grid { grid-template-columns: 1fr 1fr; gap: 36px; }
          .f-brand { grid-column: 1 / -1; flex-direction: row; flex-wrap: wrap; gap: 32px; }
          .f-desc  { max-width: 360px; }
        }
        @media (max-width: 640px) {
          .f-grid { grid-template-columns: 1fr; }
          .f-brand { grid-column: auto; flex-direction: column; }
          .f-band  { flex-direction: column; align-items: flex-start; }
          .f-band-cta { width: 100%; justify-content: center; }
          .f-bottom { flex-direction: column; align-items: flex-start; }
        }
      `}</style>

      <footer>

        {/* ── Amber top band ── */}
        <div className="f-band">
          <p className="f-band-text">
            Every gift starts with a name worth remembering.
          </p>
          <Link href="/shop" className="f-band-cta">
            Start Personalising →
          </Link>
        </div>

        {/* ── Main dark section ── */}
        <div className="f-main">
          <AnkaraPattern />

          <div className="f-grid">

            {/* Brand column */}
            <div className="f-brand">
              <div>
                <Link href="/" className="f-logo" aria-label="Lensra home">
                  <svg className="f-logo-mark" viewBox="0 0 32 32" fill="none" aria-hidden>
                    <circle cx="16" cy="16" r="15" stroke="#F5F0E8" strokeWidth="1" fill="none" />
                    <circle cx="16" cy="16" r="4"  fill="#C17B3A" />
                    <circle cx="16" cy="1"  r="2"  fill="#C17B3A" />
                    <circle cx="16" cy="31" r="2"  fill="#C17B3A" />
                    <circle cx="1"  cy="16" r="2"  fill="#C17B3A" />
                    <circle cx="31" cy="16" r="2"  fill="#C17B3A" />
                    <line x1="16" y1="5"  x2="16" y2="27" stroke="#F5F0E8" strokeWidth="0.6" />
                    <line x1="5"  y1="16" x2="27" y2="16" stroke="#F5F0E8" strokeWidth="0.6" />
                  </svg>
                  <span className="f-logo-word">
                    Lensra<span className="f-logo-dot">.</span>
                  </span>
                </Link>
                <p className="f-tagline">Gifts That Remember.</p>
                <p className="f-desc">
                  Personalised Ankara tote bags and pouches — embroidered
                  with your name. Made to order in Benin City.
                  Delivered anywhere in Nigeria in 3–5 days.
                </p>
              </div>
              <div className="f-socials">
                <a href="https://instagram.com/lensraNG"    className="f-social" aria-label="Instagram"  target="_blank" rel="noopener noreferrer"><IgIcon /></a>
                <a href="https://tiktok.com/@lensra"      className="f-social" aria-label="TikTok"     target="_blank" rel="noopener noreferrer"><TkIcon /></a>
                <a href="https://wa.me/2348051385049"          className="f-social" aria-label="WhatsApp"   target="_blank" rel="noopener noreferrer"><WaIcon /></a>
              </div>
            </div>

            {/* Shop column */}
            <div className="f-col">
              <div className="f-col-head">Shop</div>
              <ul className="f-links">
                <li>
                  <Link href="/shop?category=tote" className="f-link">
                    Ankara Tote Bags
                  </Link>
                </li>
                <li>
                  <Link href="/shop?category=pouch" className="f-link">
                    Ankara Pouches
                  </Link>
                </li>
                <li>
                  <Link href="/shop?tag=bundle" className="f-link">
                    Gift Sets
                    <span className="f-link-badge">Popular</span>
                  </Link>
                </li>
                <li>
                  <Link href="/business" className="f-link">
                    Corporate Gifts
                  </Link>
                </li>
                <li>
                  <Link href="/shop?tag=new" className="f-link">
                    New Arrivals
                  </Link>
                </li>
              </ul>
            </div>

            {/* Support column */}
            <div className="f-col">
              <div className="f-col-head">Help</div>
              <ul className="f-links">
                <li><Link href="/track"    className="f-link">Track My Order</Link></li>
                <li><Link href="/delivery" className="f-link">Delivery Info</Link></li>
                <li><Link href="/returns"  className="f-link">Returns Policy</Link></li>
                <li><Link href="/faq"      className="f-link">FAQs</Link></li>
                <li><Link href="/about"    className="f-link">Our Story</Link></li>
                <li><Link href="/contact"  className="f-link">Contact Us</Link></li>
              </ul>
            </div>

            {/* Contact column */}
            <div className="f-col">
              <div className="f-col-head">Reach Us</div>

              <div className="f-contact-item">
                <span className="f-contact-label">WhatsApp</span>
                <a href="https://wa.me/2348051385049" className="f-contact-val"
                  target="_blank" rel="noopener noreferrer">
                  +234 805 138 5049
                </a>
              </div>

              <div className="f-contact-item">
                <span className="f-contact-label">Email</span>
                <a href="mailto:hello@lensra.com" className="f-contact-val">
                  hello@lensra.com
                </a>
              </div>

              <div className="f-contact-item">
                <span className="f-contact-label">Made in</span>
                <span className="f-contact-val">Benin City, Edo</span>
              </div>

              <p className="f-hours">
                Mon – Sat · 9 am – 6 pm WAT<br />
                Orders processed same day
              </p>
            </div>

          </div>

          {/* ── Bottom bar ── */}
          <div className="f-bottom">
            <p className="f-copy">
              © {year} <strong>Lensra</strong>. Proudly Nigerian. All rights reserved.
            </p>
            <div className="f-legal">
              <Link href="/privacy" className="f-legal-link">Privacy</Link>
              <span className="f-sep" aria-hidden />
              <Link href="/terms"   className="f-legal-link">Terms</Link>
              <span className="f-sep" aria-hidden />
              <Link href="/returns" className="f-legal-link">Returns</Link>
            </div>
            <div className="f-paystack">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
              </svg>
              Secured by Paystack
            </div>
          </div>

        </div>
      </footer>
    </>
  );
}
