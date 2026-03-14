"use client";

// components/AdireFooter.tsx
// Adire — Footer component
// Sections: brand + tagline · shop links · support links · social + contact
// Bottom bar: copyright · legal · payment badges

import Link from "next/link";

// ── Adire pattern (decorative) ────────────────────────────────────────────────

function FooterPattern() {
  return (
    <svg
      aria-hidden
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        opacity: 0.045,
      }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern
          id="ad-footer-pattern"
          x="0" y="0" width="48" height="48"
          patternUnits="userSpaceOnUse"
        >
          <circle cx="24" cy="24" r="1.5" fill="#C17B3A" />
          <circle cx="0"  cy="0"  r="1.5" fill="#C17B3A" />
          <circle cx="48" cy="0"  r="1.5" fill="#C17B3A" />
          <circle cx="0"  cy="48" r="1.5" fill="#C17B3A" />
          <circle cx="48" cy="48" r="1.5" fill="#C17B3A" />
          <rect
            x="19" y="19" width="10" height="10"
            fill="none" stroke="#C17B3A" strokeWidth="0.5"
            transform="rotate(45 24 24)"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#ad-footer-pattern)" />
    </svg>
  );
}

// ── Social icon paths ─────────────────────────────────────────────────────────

const SOCIALS = [
  {
    label: "Instagram",
    href: "https://instagram.com/adiregifts",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    label: "TikTok",
    href: "https://tiktok.com/@adiregifts",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.77 1.52V6.75a4.85 4.85 0 0 1-1-.06z" />
      </svg>
    ),
  },
  {
    label: "WhatsApp",
    href: "https://wa.me/2348051385049",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
      </svg>
    ),
  },
];

// ── Payment mark ──────────────────────────────────────────────────────────────

function PaystackBadge() {
  return (
    <div className="ad-footer-payment-badge">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
      </svg>
      Secured by Paystack
    </div>
  );
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function AdireFooter() {
  return (
    <>
      <style>{`
        .ad-footer {
          background: #111d33;
          position: relative; overflow: hidden;
        }

        /* ── Top band ── */
        .ad-footer-top-band {
          background: #C17B3A;
          padding: 18px 5vw;
          display: flex; align-items: center;
          justify-content: space-between;
          flex-wrap: wrap; gap: 12px;
          position: relative; z-index: 1;
        }
        .ad-footer-band-text {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 18px; font-weight: 400; font-style: italic;
          color: rgba(255,255,255,0.9);
        }
        .ad-footer-band-cta {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 10px 24px;
          font-family: 'Instrument Sans', system-ui, sans-serif;
          font-size: 10px; font-weight: 500;
          letter-spacing: 0.22em; text-transform: uppercase;
          background: #fff; color: #C17B3A;
          text-decoration: none;
          transition: background 0.2s, color 0.2s;
          white-space: nowrap;
        }
        .ad-footer-band-cta:hover { background: #1B2A4A; color: #fff; }

        /* ── Main footer grid ── */
        .ad-footer-main {
          padding: 72px 5vw 56px;
          position: relative; z-index: 1;
          display: grid;
          grid-template-columns: 2.2fr 1fr 1fr 1.2fr;
          gap: 56px;
          border-bottom: 1px solid rgba(193,123,58,0.1);
        }

        /* Brand column */
        .ad-footer-brand-col {}
        .ad-footer-logo {
          display: flex; align-items: center; gap: 10px;
          text-decoration: none; margin-bottom: 8px;
        }
        .ad-footer-logo-mark {
          width: 28px; height: 28px; flex-shrink: 0;
        }
        .ad-footer-logo-word {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 30px; font-weight: 300;
          letter-spacing: 0.12em; text-transform: uppercase;
          color: #F5F0E8; line-height: 1;
        }
        .ad-footer-logo-word span {
          color: #C17B3A; font-style: italic; font-weight: 300;
        }
        .ad-footer-tagline {
          font-family: 'Instrument Sans', system-ui, sans-serif;
          font-size: 10px; font-weight: 500;
          letter-spacing: 0.28em; text-transform: uppercase;
          color: rgba(193,123,58,0.45); margin-bottom: 20px;
        }
        .ad-footer-desc {
          font-family: 'Instrument Sans', system-ui, sans-serif;
          font-size: 13px; font-weight: 300;
          color: rgba(193,123,58,0.3);
          line-height: 1.9; max-width: 240px;
          margin-bottom: 28px;
        }

        /* Social icons */
        .ad-footer-socials {
          display: flex; gap: 8px;
        }
        .ad-footer-social {
          width: 36px; height: 36px;
          display: flex; align-items: center; justify-content: center;
          border: 0.5px solid rgba(193,123,58,0.2);
          color: rgba(193,123,58,0.4);
          text-decoration: none;
          transition: border-color 0.2s, color 0.2s, background 0.2s;
        }
        .ad-footer-social:hover {
          border-color: #C17B3A; color: #C17B3A;
          background: rgba(193,123,58,0.06);
        }

        /* Link columns */
        .ad-footer-col-head {
          font-family: 'Instrument Sans', system-ui, sans-serif;
          font-size: 9px; font-weight: 500;
          letter-spacing: 0.36em; text-transform: uppercase;
          color: #C17B3A; margin-bottom: 22px;
          display: flex; align-items: center; gap: 10px;
        }
        .ad-footer-col-head::after {
          content: ''; flex: 1; height: 0.5px;
          background: rgba(193,123,58,0.15);
        }
        .ad-footer-links { list-style: none; }
        .ad-footer-links li { margin-bottom: 11px; }
        .ad-footer-links a {
          font-family: 'Instrument Sans', system-ui, sans-serif;
          font-size: 13px; font-weight: 300;
          color: rgba(193,123,58,0.3);
          text-decoration: none; transition: color 0.2s;
          display: inline-flex; align-items: center; gap: 6px;
        }
        .ad-footer-links a:hover { color: #D4956A; }
        .ad-footer-links .ad-link-badge {
          font-size: 8px; font-weight: 500;
          letter-spacing: 0.15em; text-transform: uppercase;
          background: rgba(193,123,58,0.12); color: #C17B3A;
          padding: 2px 6px;
        }

        /* Contact column */
        .ad-footer-contact-item {
          display: flex; flex-direction: column; gap: 2px;
          margin-bottom: 18px;
        }
        .ad-footer-contact-label {
          font-family: 'Instrument Sans', system-ui, sans-serif;
          font-size: 9px; font-weight: 500;
          letter-spacing: 0.28em; text-transform: uppercase;
          color: rgba(193,123,58,0.3);
        }
        .ad-footer-contact-value {
          font-family: 'Instrument Sans', system-ui, sans-serif;
          font-size: 13px; font-weight: 300;
          color: rgba(193,123,58,0.5);
          text-decoration: none; transition: color 0.2s;
        }
        a.ad-footer-contact-value:hover { color: #C17B3A; }
        .ad-footer-hours {
          margin-top: 6px;
          font-family: 'Instrument Sans', system-ui, sans-serif;
          font-size: 11px; font-weight: 300;
          color: rgba(193,123,58,0.2); line-height: 1.7;
        }

        /* ── Bottom bar ── */
        .ad-footer-bottom {
          padding: 20px 5vw;
          display: flex; align-items: center;
          justify-content: space-between;
          flex-wrap: wrap; gap: 16px;
          position: relative; z-index: 1;
        }
        .ad-footer-copy {
          font-family: 'Instrument Sans', system-ui, sans-serif;
          font-size: 11px; font-weight: 300;
          color: rgba(193,123,58,0.2);
          letter-spacing: 0.06em;
        }
        .ad-footer-copy strong { color: rgba(193,123,58,0.4); font-weight: 400; }
        .ad-footer-legal {
          display: flex; align-items: center; gap: 20px;
        }
        .ad-footer-legal a {
          font-family: 'Instrument Sans', system-ui, sans-serif;
          font-size: 11px; font-weight: 300;
          color: rgba(193,123,58,0.2);
          text-decoration: none; letter-spacing: 0.08em;
          transition: color 0.2s;
        }
        .ad-footer-legal a:hover { color: rgba(193,123,58,0.5); }
        .ad-footer-legal-dot {
          width: 2px; height: 2px; border-radius: 50%;
          background: rgba(193,123,58,0.15);
        }
        .ad-footer-payment-badge {
          display: inline-flex; align-items: center; gap: 6px;
          font-family: 'Instrument Sans', system-ui, sans-serif;
          font-size: 10px; font-weight: 400;
          letter-spacing: 0.1em;
          color: rgba(193,123,58,0.2);
        }

        /* ── Responsive ── */
        @media (max-width: 1100px) {
          .ad-footer-main {
            grid-template-columns: 1fr 1fr;
            gap: 40px;
          }
          .ad-footer-brand-col { grid-column: 1 / -1; }
        }
        @media (max-width: 600px) {
          .ad-footer-main {
            grid-template-columns: 1fr;
            padding: 48px 6vw 40px;
          }
          .ad-footer-brand-col { grid-column: auto; }
          .ad-footer-top-band {
            flex-direction: column; align-items: flex-start;
          }
          .ad-footer-band-cta { width: 100%; justify-content: center; }
          .ad-footer-bottom { flex-direction: column; align-items: flex-start; gap: 12px; }
        }
      `}</style>

      <footer className="ad-footer" role="contentinfo">

        {/* ── Top amber band ── */}
        <div className="ad-footer-top-band">
          <p className="ad-footer-band-text">
            Every gift starts with a name worth remembering.
          </p>
          <Link href="/shop" className="ad-footer-band-cta">
            Start Personalising →
          </Link>
        </div>

        {/* ── Main grid ── */}
        <div className="ad-footer-main">

          {/* Brand column */}
          <div className="ad-footer-brand-col">
            <Link href="/" className="ad-footer-logo" aria-label="Adire home">
              <svg
                className="ad-footer-logo-mark"
                viewBox="0 0 28 28" fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden
              >
                <rect x="1" y="1" width="26" height="26" rx="1"
                  fill="none" stroke="#F5F0E8" strokeWidth="0.75" />
                <circle cx="14" cy="14" r="3" fill="#C17B3A" />
                <circle cx="1"  cy="1"  r="1.5" fill="#C17B3A" />
                <circle cx="27" cy="1"  r="1.5" fill="#C17B3A" />
                <circle cx="1"  cy="27" r="1.5" fill="#C17B3A" />
                <circle cx="27" cy="27" r="1.5" fill="#C17B3A" />
              </svg>
              <span className="ad-footer-logo-word">
                Adire<span>.</span>
              </span>
            </Link>
            <p className="ad-footer-tagline">Made Personal. Made Nigerian.</p>
            <p className="ad-footer-desc">
              Personalised Ankara tote bags and pouches, embroidered with
              your name. Made to order in Benin City. Delivered across
              Nigeria within 3–5 days.
            </p>
            <div className="ad-footer-socials">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  className="ad-footer-social"
                  aria-label={s.label}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Shop column */}
          <div>
            <div className="ad-footer-col-head">Shop</div>
            <ul className="ad-footer-links">
              <li><Link href="/shop?category=tote">Ankara Tote Bags</Link></li>
              <li><Link href="/shop?category=pouch">Ankara Pouches</Link></li>
              <li>
                <Link href="/shop?tag=bundle">
                  Gift Sets
                  <span className="ad-link-badge">Popular</span>
                </Link>
              </li>
              <li><Link href="/business">Corporate Gifts</Link></li>
              <li><Link href="/shop?tag=new">New Arrivals</Link></li>
            </ul>
          </div>

          {/* Support column */}
          <div>
            <div className="ad-footer-col-head">Support</div>
            <ul className="ad-footer-links">
              <li><Link href="/track">Track My Order</Link></li>
              <li><Link href="/delivery">Delivery Info</Link></li>
              <li><Link href="/returns">Returns Policy</Link></li>
              <li><Link href="/faq">FAQs</Link></li>
              <li><Link href="/about">Our Story</Link></li>
              <li><Link href="/contact">Contact Us</Link></li>
            </ul>
          </div>

          {/* Contact column */}
          <div>
            <div className="ad-footer-col-head">Get in Touch</div>

            <div className="ad-footer-contact-item">
              <span className="ad-footer-contact-label">WhatsApp</span>
              <a
                href="https://wa.me/2348051385049"
                className="ad-footer-contact-value"
                target="_blank" rel="noopener noreferrer"
              >
                +234 805 138 5049
              </a>
            </div>

            <div className="ad-footer-contact-item">
              <span className="ad-footer-contact-label">Email</span>
              <a
                href="mailto:hello@adire.ng"
                className="ad-footer-contact-value"
              >
                hello@adire.ng
              </a>
            </div>

            <div className="ad-footer-contact-item">
              <span className="ad-footer-contact-label">Location</span>
              <span className="ad-footer-contact-value">
                Benin City, Edo State
              </span>
            </div>

            <p className="ad-footer-hours">
              Orders processed<br />
              Mon – Sat · 9am – 6pm WAT
            </p>
          </div>

        </div>

        {/* ── Bottom bar ── */}
        <div className="ad-footer-bottom">
          <p className="ad-footer-copy">
            © {new Date().getFullYear()} <strong>Adire</strong>. Proudly Nigerian. All rights reserved.
          </p>
          <div className="ad-footer-legal">
            <Link href="/privacy">Privacy Policy</Link>
            <span className="ad-footer-legal-dot" aria-hidden />
            <Link href="/terms">Terms of Service</Link>
            <span className="ad-footer-legal-dot" aria-hidden />
            <Link href="/returns">Returns</Link>
          </div>
          <PaystackBadge />
        </div>

        {/* Decorative pattern */}
        <FooterPattern />

      </footer>
    </>
  );
}