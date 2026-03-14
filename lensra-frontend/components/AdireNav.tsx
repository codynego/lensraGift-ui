"use client";

// components/AdireNav.tsx
// Adire — Navigation component
// Design: bold, cultural, matches homepage energy
// Fonts: Playfair Display (logo) · Syne (links)
// States: transparent on hero → cream frosted on scroll
//         mobile: full-takeover menu with staggered Playfair links

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

// ── Types ─────────────────────────────────────────────────────────────────────

interface NavItem {
  label: string;
  href: string;
  sub?: { label: string; href: string; tag?: string }[];
}

// ── Data ──────────────────────────────────────────────────────────────────────

const NAV: NavItem[] = [
  {
    label: "Shop",
    href: "/shop",
    sub: [
      { label: "Ankara Tote Bags", href: "/shop?category=tote" },
      { label: "Ankara Pouches",   href: "/shop?category=pouch" },
      { label: "Gift Sets",        href: "/shop?tag=bundle",   tag: "Popular" },
      { label: "New Arrivals",     href: "/shop?tag=new" },
    ],
  },
  {
    label: "Occasions",
    href: "/occasions",
    sub: [
      { label: "Birthdays",    href: "/shop?tag=birthday" },
      { label: "Anniversaries",href: "/shop?tag=anniversary" },
      { label: "Graduations",  href: "/shop?tag=graduation" },
      { label: "Weddings",     href: "/shop?tag=wedding" },
      { label: "Corporate",    href: "/shop?tag=corporate",  tag: "Bulk" },
    ],
  },
  { label: "Business", href: "/business" },
  { label: "Our Story",href: "/about"    },
];

// ── Ankara mark SVG ───────────────────────────────────────────────────────────

function Mark({ light }: { light: boolean }) {
  const ring  = light ? "rgba(245,240,232,0.6)" : "#1B2A4A";
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden>
      <circle cx="11" cy="11" r="10" stroke={ring}  strokeWidth="1"   fill="none" />
      <circle cx="11" cy="11" r="3"  fill="#C17B3A" />
      <circle cx="11" cy="1"  r="1.5" fill="#C17B3A" />
      <circle cx="11" cy="21" r="1.5" fill="#C17B3A" />
      <circle cx="1"  cy="11" r="1.5" fill="#C17B3A" />
      <circle cx="21" cy="11" r="1.5" fill="#C17B3A" />
      <line x1="11" y1="4"  x2="11" y2="18" stroke={ring} strokeWidth="0.6" />
      <line x1="4"  y1="11" x2="18" y2="11" stroke={ring} strokeWidth="0.6" />
    </svg>
  );
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function AdireNav() {
  const pathname  = usePathname();
  const [scrolled,  setScrolled]  = useState(false);
  const [open,      setOpen]      = useState(false);
  const [dropdown,  setDropdown]  = useState<string | null>(null);
  const timerRef  = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", fn, { passive: true });
    fn();
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => { setOpen(false); }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const openDrop  = (label: string) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setDropdown(label);
  };
  const closeDrop = () => {
    timerRef.current = setTimeout(() => setDropdown(null), 160);
  };

  const light = !scrolled && !open; // nav is over dark hero

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=Syne:wght@400;500;600;700;800&display=swap');

        .n-bar {
          position: fixed; top: 0; left: 0; right: 0; z-index: 400;
          height: 68px;
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 5vw;
          transition: background 0.4s cubic-bezier(0.16,1,0.3,1),
                      border-color 0.4s;
          border-bottom: 1px solid transparent;
        }
        .n-bar.solid {
          background: rgba(245,240,232,0.97);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-color: #E2D4BE;
        }

        /* ── Logo ── */
        .n-logo {
          display: flex; align-items: center; gap: 10px;
          text-decoration: none; z-index: 2; flex-shrink: 0;
        }
        .n-logo-word {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 24px; font-weight: 900;
          letter-spacing: 0.14em; text-transform: uppercase;
          line-height: 1; transition: color 0.3s;
          color: #F5F0E8;
        }
        .n-logo-word.dark { color: #1B2A4A; }
        .n-logo-dot { color: #C17B3A; font-style: italic; font-weight: 400; }

        /* ── Desktop links ── */
        .n-links {
          display: flex; align-items: stretch;
          list-style: none; height: 68px;
        }
        .n-item { position: relative; display: flex; align-items: stretch; }

        .n-link {
          display: flex; align-items: center; gap: 6px;
          padding: 0 18px;
          font-family: 'Syne', system-ui, sans-serif;
          font-size: 10px; font-weight: 700;
          letter-spacing: 0.26em; text-transform: uppercase;
          text-decoration: none; background: none; border: none; cursor: pointer;
          color: rgba(245,240,232,0.6);
          transition: color 0.2s;
          white-space: nowrap;
          border-bottom: 2px solid transparent;
          transition: color 0.2s, border-color 0.2s;
        }
        .n-link.dark  { color: #7A6E60; }
        .n-link.active,
        .n-link:hover { color: #C17B3A; }
        .n-link.dark.active,
        .n-link.dark:hover { color: #C17B3A; border-color: #C17B3A; }

        /* chevron — CSS only, no icon dep */
        .n-chevron {
          width: 6px; height: 6px;
          border-right: 1.5px solid currentColor;
          border-bottom: 1.5px solid currentColor;
          transform: rotate(45deg) translateY(-1px);
          transition: transform 0.2s; flex-shrink: 0;
        }
        .n-item:hover .n-chevron { transform: rotate(225deg) translateY(-1px); }

        /* ── Dropdown ── */
        .n-drop {
          position: absolute; top: 100%; left: 0;
          min-width: 220px;
          background: #F5F0E8;
          border: 1px solid #E2D4BE;
          border-top: 3px solid #C17B3A;
          box-shadow: 0 16px 48px rgba(27,42,74,0.12);
          padding: 10px 0;
          z-index: 600;
        }
        .n-drop-link {
          display: flex; align-items: center;
          justify-content: space-between;
          padding: 11px 20px;
          font-family: 'Syne', system-ui, sans-serif;
          font-size: 11px; font-weight: 600;
          letter-spacing: 0.12em;
          color: #7A6E60; text-decoration: none;
          transition: background 0.15s, color 0.15s;
        }
        .n-drop-link:hover { background: #F0DFC4; color: #1B2A4A; }
        .n-drop-tag {
          font-size: 8px; font-weight: 800;
          letter-spacing: 0.2em; text-transform: uppercase;
          background: #C17B3A; color: #fff;
          padding: 2px 7px;
        }

        /* ── CTA button ── */
        .n-cta {
          display: inline-flex; align-items: center;
          margin-left: 20px;
          padding: 11px 24px;
          font-family: 'Syne', system-ui, sans-serif;
          font-size: 10px; font-weight: 800;
          letter-spacing: 0.26em; text-transform: uppercase;
          text-decoration: none;
          background: #C17B3A; color: #fff;
          transition: background 0.2s, transform 0.15s;
          white-space: nowrap; flex-shrink: 0;
          border: none;
        }
        .n-cta:hover { background: #D4956A; transform: translateY(-1px); }
        .n-cta.dark  { background: #1B2A4A; }
        .n-cta.dark:hover { background: #243560; }

        /* ── Hamburger ── */
        .n-ham {
          display: none; flex-direction: column;
          justify-content: center; align-items: flex-end;
          gap: 5px; width: 44px; height: 44px;
          background: none; border: none; cursor: pointer;
          padding: 6px; z-index: 2;
        }
        .n-ham-line {
          height: 1.5px; background: rgba(245,240,232,0.8);
          transition: transform 0.35s cubic-bezier(0.16,1,0.3,1),
                      opacity 0.2s, width 0.3s, background 0.3s;
        }
        .n-ham-line:nth-child(1) { width: 22px; }
        .n-ham-line:nth-child(2) { width: 16px; }
        .n-ham-line:nth-child(3) { width: 22px; }
        .n-ham-line.dark { background: #1B2A4A; }
        .n-ham.open .n-ham-line:nth-child(1) {
          width: 22px;
          transform: translateY(6.5px) rotate(45deg);
          background: #1B2A4A;
        }
        .n-ham.open .n-ham-line:nth-child(2) { opacity: 0; }
        .n-ham.open .n-ham-line:nth-child(3) {
          width: 22px;
          transform: translateY(-6.5px) rotate(-45deg);
          background: #1B2A4A;
        }

        /* ── Mobile menu — full takeover ── */
        .n-mob {
          position: fixed; inset: 0; z-index: 350;
          background: #F5F0E8;
          display: flex; flex-direction: column;
          padding: 90px 8vw 48px;
          overflow-y: auto;
        }
        .n-mob-link {
          display: flex; align-items: baseline;
          justify-content: space-between;
          padding: 18px 0;
          font-family: 'Playfair Display', Georgia, serif;
          font-size: clamp(32px, 7vw, 52px);
          font-weight: 900; line-height: 1;
          color: #1B2A4A; text-decoration: none;
          border-bottom: 1px solid #E2D4BE;
          transition: color 0.2s;
          letter-spacing: -0.02em;
        }
        .n-mob-link:hover { color: #C17B3A; }
        .n-mob-link-arrow {
          font-family: 'Playfair Display', serif;
          font-size: 20px; font-style: italic;
          color: #C17B3A;
        }
        .n-mob-subs {
          display: flex; flex-wrap: wrap; gap: 8px;
          padding: 12px 0 20px;
          border-bottom: 1px solid #E2D4BE;
        }
        .n-mob-sub-link {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 7px 14px;
          font-family: 'Syne', system-ui, sans-serif;
          font-size: 10px; font-weight: 700;
          letter-spacing: 0.2em; text-transform: uppercase;
          color: #7A6E60; text-decoration: none;
          background: rgba(193,123,58,0.08);
          transition: background 0.15s, color 0.15s;
        }
        .n-mob-sub-link:hover { background: #C17B3A; color: #fff; }
        .n-mob-sub-tag {
          font-size: 8px; font-weight: 800;
          background: #C17B3A; color: #fff; padding: 1px 6px;
        }
        .n-mob-footer {
          margin-top: auto; padding-top: 36px;
          display: grid; grid-template-columns: 1fr 1fr; gap: 10px;
        }
        .n-mob-cta {
          display: flex; align-items: center; justify-content: center;
          padding: 16px;
          font-family: 'Syne', system-ui, sans-serif;
          font-size: 10px; font-weight: 800;
          letter-spacing: 0.22em; text-transform: uppercase;
          text-decoration: none; transition: background 0.2s;
        }
        .n-mob-cta-primary {
          background: #C17B3A; color: #fff;
          grid-column: 1 / -1;
        }
        .n-mob-cta-primary:hover { background: #D4956A; }
        .n-mob-cta-sec {
          background: none; border: 1px solid #E2D4BE; color: #7A6E60;
        }
        .n-mob-cta-sec:hover { border-color: #C17B3A; color: #C17B3A; }
        .n-mob-contact {
          grid-column: 1 / -1; text-align: center;
          padding-top: 16px;
          font-family: 'Syne', system-ui, sans-serif;
          font-size: 11px; font-weight: 500;
          color: #B4A898;
        }
        .n-mob-contact a { color: #C17B3A; text-decoration: none; }

        @media (max-width: 960px) {
          .n-links { display: none; }
          .n-cta   { display: none; }
          .n-ham   { display: flex; }
        }
      `}</style>

      {/* ── Bar ── */}
      <nav
        className={`n-bar ${scrolled || open ? "solid" : ""}`}
        role="navigation" aria-label="Main navigation"
      >
        <Link href="/" className="n-logo" aria-label="Lensra home">
          <Mark light={light} />
          <span className={`n-logo-word ${light ? "" : "dark"}`}>
            Lensra<span className="n-logo-dot">.</span>
          </span>
        </Link>

        {/* Desktop */}
        <ul className="n-links" role="list">
          {NAV.map(item => (
            <li key={item.label} className="n-item"
              onMouseEnter={() => item.sub && openDrop(item.label)}
              onMouseLeave={() => item.sub && closeDrop()}
            >
              {item.sub ? (
                <>
                  <button
                    className={[
                      "n-link",
                      light ? "" : "dark",
                      pathname.startsWith(item.href) ? "active" : "",
                    ].filter(Boolean).join(" ")}
                    aria-haspopup="true"
                    aria-expanded={dropdown === item.label}
                  >
                    {item.label}
                    <span className="n-chevron" aria-hidden />
                  </button>

                  <AnimatePresence>
                    {dropdown === item.label && (
                      <motion.div
                        className="n-drop"
                        role="menu"
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.16 }}
                        onMouseEnter={() => openDrop(item.label)}
                        onMouseLeave={closeDrop}
                      >
                        {item.sub.map(s => (
                          <Link
                            key={s.label}
                            href={s.href}
                            className="n-drop-link"
                            role="menuitem"
                          >
                            {s.label}
                            {s.tag && <span className="n-drop-tag">{s.tag}</span>}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              ) : (
                <Link
                  href={item.href}
                  className={[
                    "n-link",
                    light ? "" : "dark",
                    pathname === item.href ? "active" : "",
                  ].filter(Boolean).join(" ")}
                >
                  {item.label}
                </Link>
              )}
            </li>
          ))}
        </ul>

        <Link href="/shop" className={`n-cta ${light ? "" : "dark"}`}>
          Personalise Now
        </Link>

        {/* Hamburger */}
        <button
          className={`n-ham ${open ? "open" : ""}`}
          onClick={() => setOpen(v => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {[1, 2, 3].map(n => (
            <span key={n}
              className={`n-ham-line ${!light ? "dark" : ""}`}
            />
          ))}
        </button>
      </nav>

      {/* ── Mobile menu ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="n-mob"
            role="dialog"
            aria-label="Lensra navigation"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          >
            {NAV.map((item, i) => (
              <motion.div key={item.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 + 0.2, duration: 0.5, ease: [0.16,1,0.3,1] }}
              >
                <Link href={item.href} className="n-mob-link">
                  {item.label}
                  <span className="n-mob-link-arrow">→</span>
                </Link>

                {item.sub && (
                  <div className="n-mob-subs">
                    {item.sub.map(s => (
                      <Link key={s.label} href={s.href} className="n-mob-sub-link">
                        {s.label}
                        {s.tag && <span className="n-mob-sub-tag">{s.tag}</span>}
                      </Link>
                    ))}
                  </div>
                )}
              </motion.div>
            ))}

            <motion.div
              className="n-mob-footer"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.45 }}
            >
              <Link href="/shop"     className="n-mob-cta n-mob-cta-primary">Shop All Products</Link>
              <Link href="/business" className="n-mob-cta n-mob-cta-sec">Business</Link>
              <Link href="/track"    className="n-mob-cta n-mob-cta-sec">Track Order</Link>
              <p className="n-mob-contact">
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