"use client";

// components/LensraNav.tsx
// Lensra — Navigation
// Design: Premium black/white/red — Apple × Luxury Gift
// Fonts: Montserrat · Inter

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const NAV = [
  {
    label: "Shop",
    href: "/shop",
    sub: [
      { label: "Surprise Memory Box",  href: "/shop/surprise-memory-box", tag: "Best Seller" },
      { label: "Exploding Box",         href: "/shop/exploding-box",       tag: "New" },
      { label: "Video Memory Card",     href: "/shop/video-memory-card" },
      { label: "Browse All Gifts",      href: "/shop" },
    ],
  },
  {
    label: "Occasions",
    href: "/occasions",
    sub: [
      { label: "Birthday",     href: "/shop?tag=birthday" },
      { label: "Anniversary",  href: "/shop?tag=anniversary" },
      { label: "Valentine",    href: "/shop?tag=valentine" },
      { label: "Mother's Day", href: "/shop?tag=mothers-day" },
      { label: "Corporate",    href: "/business", tag: "Bulk" },
    ],
  },
  { label: "Business", href: "/business" },
  { label: "Our Story", href: "/about" },
];

export function LensraNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [dropdown, setDropdown] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => { setOpen(false); }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn, { passive: true });
    fn();
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const openDrop = (label: string) => {
    if (timer.current) clearTimeout(timer.current);
    setDropdown(label);
  };
  const closeDrop = () => {
    timer.current = setTimeout(() => setDropdown(null), 180);
  };

  // On hero page (home), nav starts transparent then goes solid on scroll
  const isHome = pathname === "/";
  const navBg = isHome && !scrolled && !open
    ? "rgba(15,15,15,0)"
    : "rgba(15,15,15,0.97)";
  const navBorder = isHome && !scrolled && !open
    ? "1px solid rgba(255,255,255,0)"
    : "1px solid rgba(255,255,255,0.06)";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800;900&family=Inter:wght@300;400;500;600&display=swap');

        /* ── BAR ── */
        .lxn-bar {
          position: fixed; top: 0; left: 0; right: 0;
          z-index: 400;
          height: 68px;
          display: flex; align-items: center;
          justify-content: space-between;
          padding: 0 5vw;
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          transition: background 0.4s ease, border-color 0.4s ease;
        }

        /* ── LOGO ── */
        .lxn-logo {
          display: flex; align-items: center; gap: 10px;
          text-decoration: none; z-index: 2; flex-shrink: 0;
        }
        .lxn-logo-mark {
          width: 28px; height: 28px;
          background: #DD183B;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .lxn-logo-mark svg { display: block; }
        .lxn-logo-word {
          font-family: 'Montserrat', sans-serif;
          font-size: 18px; font-weight: 900;
          letter-spacing: 0.12em; text-transform: uppercase;
          line-height: 1; color: #FFFFFF;
        }
        .lxn-logo-dot { color: #DD183B; }

        /* ── DESKTOP LINKS ── */
        .lxn-links {
          display: flex; align-items: stretch;
          list-style: none; height: 68px; gap: 0;
        }
        .lxn-item {
          position: relative; display: flex; align-items: stretch;
        }
        .lxn-link {
          display: flex; align-items: center; gap: 6px;
          padding: 0 18px;
          font-family: 'Montserrat', sans-serif;
          font-size: 10px; font-weight: 700;
          letter-spacing: 0.2em; text-transform: uppercase;
          text-decoration: none; background: none; border: none;
          cursor: pointer; white-space: nowrap;
          color: rgba(255,255,255,0.55);
          position: relative;
          transition: color 0.2s;
        }
        .lxn-link::after {
          content: '';
          position: absolute; bottom: 0; left: 18px; right: 18px;
          height: 1px;
          background: #DD183B;
          transform: scaleX(0); transform-origin: left;
          transition: transform 0.25s cubic-bezier(0.16,1,0.3,1);
        }
        .lxn-link:hover,
        .lxn-link.active { color: #FFFFFF; }
        .lxn-link:hover::after,
        .lxn-link.active::after { transform: scaleX(1); }

        /* Chevron */
        .lxn-chevron {
          display: inline-block;
          width: 5px; height: 5px;
          border-right: 1.5px solid currentColor;
          border-bottom: 1.5px solid currentColor;
          transform: rotate(45deg) translateY(-1px);
          transition: transform 0.2s;
          flex-shrink: 0; opacity: 0.6;
        }
        .lxn-item:hover .lxn-chevron {
          transform: rotate(-135deg) translateY(-1px);
        }

        /* ── DROPDOWN ── */
        .lxn-drop {
          position: absolute; top: calc(100% + 0px); left: 50%;
          transform: translateX(-50%);
          min-width: 240px;
          background: #111111;
          border: 1px solid rgba(255,255,255,0.07);
          border-top: 2px solid #DD183B;
          box-shadow: 0 24px 64px rgba(0,0,0,0.4);
          padding: 8px 0; z-index: 600;
        }
        .lxn-drop-link {
          display: flex; align-items: center;
          justify-content: space-between;
          padding: 12px 22px;
          font-family: 'Montserrat', sans-serif;
          font-size: 11px; font-weight: 600;
          letter-spacing: 0.1em;
          color: rgba(255,255,255,0.5);
          text-decoration: none;
          transition: background 0.15s, color 0.15s;
          gap: 12px;
        }
        .lxn-drop-link:hover {
          background: rgba(255,255,255,0.04);
          color: #FFFFFF;
        }
        .lxn-drop-tag {
          font-size: 8px; font-weight: 800;
          letter-spacing: 0.18em; text-transform: uppercase;
          background: #DD183B; color: #fff;
          padding: 2px 8px; border-radius: 1px;
          flex-shrink: 0;
        }
        .lxn-drop-divider {
          height: 1px;
          background: rgba(255,255,255,0.06);
          margin: 6px 0;
        }

        /* ── NAV CTA ── */
        .lxn-cta {
          display: inline-flex; align-items: center; gap: 8px;
          margin-left: 16px;
          padding: 10px 24px;
          font-family: 'Montserrat', sans-serif;
          font-size: 10px; font-weight: 800;
          letter-spacing: 0.15em; text-transform: uppercase;
          text-decoration: none;
          background: #DD183B; color: #FFFFFF;
          border-radius: 1px;
          white-space: nowrap; flex-shrink: 0;
          transition: background 0.2s, transform 0.15s;
        }
        .lxn-cta:hover { background: #C2152F; transform: translateY(-1px); }

        /* ── HAMBURGER ── */
        .lxn-ham {
          display: none; flex-direction: column;
          justify-content: center; align-items: flex-end;
          gap: 5px; width: 44px; height: 44px;
          background: none; border: none;
          cursor: pointer; padding: 8px; z-index: 2;
        }
        .lxn-ham-line {
          height: 1.5px; background: #FFFFFF;
          transition: transform 0.4s cubic-bezier(0.16,1,0.3,1),
                      opacity 0.2s, width 0.3s;
        }
        .lxn-ham-line:nth-child(1) { width: 24px; }
        .lxn-ham-line:nth-child(2) { width: 16px; }
        .lxn-ham-line:nth-child(3) { width: 24px; }
        .lxn-ham.open .lxn-ham-line:nth-child(1) {
          width: 24px; transform: translateY(6.5px) rotate(45deg);
        }
        .lxn-ham.open .lxn-ham-line:nth-child(2) { opacity: 0; width: 0; }
        .lxn-ham.open .lxn-ham-line:nth-child(3) {
          width: 24px; transform: translateY(-6.5px) rotate(-45deg);
        }

        /* ── MOBILE MENU ── */
        .lxn-mob {
          position: fixed; inset: 0; z-index: 350;
          background: #0F0F0F;
          display: flex; flex-direction: column;
          padding: 100px 8vw 48px;
          overflow-y: auto;
        }
        .lxn-mob-link {
          display: flex; align-items: baseline;
          justify-content: space-between;
          padding: 20px 0;
          font-family: 'Montserrat', sans-serif;
          font-size: clamp(28px, 7vw, 48px);
          font-weight: 900; line-height: 1;
          color: rgba(255,255,255,0.85);
          text-decoration: none;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          transition: color 0.2s;
          letter-spacing: -0.02em;
        }
        .lxn-mob-link:hover { color: #DD183B; }
        .lxn-mob-arrow {
          font-size: 20px; color: #DD183B; opacity: 0.6;
          transition: transform 0.2s, opacity 0.2s;
        }
        .lxn-mob-link:hover .lxn-mob-arrow {
          transform: translateX(4px); opacity: 1;
        }
        .lxn-mob-subs {
          display: flex; flex-wrap: wrap; gap: 8px;
          padding: 14px 0 20px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .lxn-mob-sub {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 8px 16px;
          font-family: 'Montserrat', sans-serif;
          font-size: 10px; font-weight: 700;
          letter-spacing: 0.15em; text-transform: uppercase;
          color: rgba(255,255,255,0.4);
          text-decoration: none;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 1px;
          transition: border-color 0.2s, color 0.2s;
        }
        .lxn-mob-sub:hover { border-color: #DD183B; color: #fff; }
        .lxn-mob-sub-tag {
          font-size: 7px; font-weight: 800;
          background: #DD183B; color: #fff;
          padding: 1px 6px; letter-spacing: 0.15em;
        }
        .lxn-mob-footer {
          margin-top: auto; padding-top: 40px;
          display: flex; flex-direction: column; gap: 10px;
        }
        .lxn-mob-cta-main {
          display: flex; align-items: center; justify-content: center;
          padding: 18px;
          background: #DD183B; color: #fff;
          font-family: 'Montserrat', sans-serif;
          font-size: 11px; font-weight: 800;
          letter-spacing: 0.2em; text-transform: uppercase;
          text-decoration: none; border-radius: 1px;
          transition: background 0.2s;
        }
        .lxn-mob-cta-main:hover { background: #C2152F; }
        .lxn-mob-cta-row {
          display: flex; gap: 10px;
        }
        .lxn-mob-cta-sec {
          flex: 1; display: flex; align-items: center; justify-content: center;
          padding: 14px;
          background: none;
          border: 1px solid rgba(255,255,255,0.1);
          color: rgba(255,255,255,0.5);
          font-family: 'Montserrat', sans-serif;
          font-size: 10px; font-weight: 700;
          letter-spacing: 0.15em; text-transform: uppercase;
          text-decoration: none; border-radius: 1px;
          transition: border-color 0.2s, color 0.2s;
        }
        .lxn-mob-cta-sec:hover { border-color: #fff; color: #fff; }
        .lxn-mob-contact {
          text-align: center; padding-top: 8px;
          font-family: 'Inter', sans-serif;
          font-size: 12px; font-weight: 400;
          color: rgba(255,255,255,0.25);
        }
        .lxn-mob-contact a {
          color: #DD183B; text-decoration: none;
        }

        @media (max-width: 960px) {
          .lxn-links { display: none; }
          .lxn-cta   { display: none; }
          .lxn-ham   { display: flex; }
        }
      `}</style>

      <nav
        className="lxn-bar"
        role="navigation"
        aria-label="Main navigation"
        style={{ background: navBg, borderBottom: navBorder }}
      >
        {/* Logo */}
        <Link href="/" className="lxn-logo" aria-label="Lensra home">
          <div className="lxn-logo-mark">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
              <path d="M7 2L7 12M2 7L12 7" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
          <span className="lxn-logo-word">
            Lensra<span className="lxn-logo-dot">.</span>
          </span>
        </Link>

        {/* Desktop links */}
        <ul className="lxn-links" role="list">
          {NAV.map((item) => (
            <li
              key={item.label}
              className="lxn-item"
              onMouseEnter={() => item.sub && openDrop(item.label)}
              onMouseLeave={() => item.sub && closeDrop()}
            >
              {item.sub ? (
                <>
                  <button
                    className={[
                      "lxn-link",
                      pathname.startsWith(item.href) ? "active" : "",
                    ].filter(Boolean).join(" ")}
                    aria-haspopup="true"
                    aria-expanded={dropdown === item.label}
                  >
                    {item.label}
                    <span className="lxn-chevron" aria-hidden />
                  </button>

                  <AnimatePresence>
                    {dropdown === item.label && (
                      <motion.div
                        className="lxn-drop"
                        role="menu"
                        initial={{ opacity: 0, y: -8, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.98 }}
                        transition={{ duration: 0.18, ease: [0.16,1,0.3,1] }}
                        onMouseEnter={() => openDrop(item.label)}
                        onMouseLeave={closeDrop}
                      >
                        {item.sub.map((s, i) => (
                          <div key={s.label}>
                            {/* Divider before "Browse All" */}
                            {s.label.startsWith("Browse") && (
                              <div className="lxn-drop-divider" />
                            )}
                            <Link href={s.href} className="lxn-drop-link" role="menuitem">
                              {s.label}
                              {s.tag && (
                                <span className="lxn-drop-tag">{s.tag}</span>
                              )}
                            </Link>
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              ) : (
                <Link
                  href={item.href}
                  className={[
                    "lxn-link",
                    pathname === item.href ? "active" : "",
                  ].filter(Boolean).join(" ")}
                >
                  {item.label}
                </Link>
              )}
            </li>
          ))}
        </ul>

        <Link href="/shop" className="lxn-cta">
          Create Your Gift
        </Link>

        {/* Hamburger */}
        <button
          className={`lxn-ham${open ? " open" : ""}`}
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          <span className="lxn-ham-line" />
          <span className="lxn-ham-line" />
          <span className="lxn-ham-line" />
        </button>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="lxn-mob"
            role="dialog"
            aria-label="Navigation menu"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          >
            {NAV.map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 + 0.2, duration: 0.5, ease: [0.16,1,0.3,1] }}
              >
                <Link href={item.href} className="lxn-mob-link">
                  {item.label}
                  <span className="lxn-mob-arrow">→</span>
                </Link>
                {item.sub && (
                  <div className="lxn-mob-subs">
                    {item.sub.map((s) => (
                      <Link key={s.label} href={s.href} className="lxn-mob-sub">
                        {s.label}
                        {s.tag && <span className="lxn-mob-sub-tag">{s.tag}</span>}
                      </Link>
                    ))}
                  </div>
                )}
              </motion.div>
            ))}

            <motion.div
              className="lxn-mob-footer"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.45 }}
            >
              <Link href="/shop" className="lxn-mob-cta-main">
                Create Your Gift Now →
              </Link>
              <div className="lxn-mob-cta-row">
                <Link href="/business" className="lxn-mob-cta-sec">Corporate</Link>
                <Link href="/track" className="lxn-mob-cta-sec">Track Order</Link>
              </div>
              <p className="lxn-mob-contact">
                Need help?{" "}
                <a href="https://wa.me/2348051385049" target="_blank" rel="noopener noreferrer">
                  WhatsApp us
                </a>
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}