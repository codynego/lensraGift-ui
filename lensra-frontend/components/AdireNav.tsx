"use client";

// components/AdireNav.tsx
// Adire — Top navigation component
// Behaviours: transparent on hero → frosted cream on scroll
//             mobile: hamburger → full-screen slide-down menu
//             desktop: inline links + CTA pill

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

// ── Types ─────────────────────────────────────────────────────────────────────

interface NavLink {
  label: string;
  href: string;
  sub?: { label: string; href: string }[];
}

// ── Nav link tree ─────────────────────────────────────────────────────────────

const NAV_LINKS: NavLink[] = [
  {
    label: "Shop",
    href: "/shop",
    sub: [
      { label: "Ankara Tote Bags", href: "/shop?category=tote" },
      { label: "Ankara Pouches",   href: "/shop?category=pouch" },
      { label: "Gift Sets",        href: "/shop?tag=bundle" },
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
      { label: "Corporate",    href: "/shop?tag=corporate" },
    ],
  },
  { label: "Business", href: "/business" },
  { label: "Our Story", href: "/about" },
];

// ── Adire pattern mark (small SVG logo element) ───────────────────────────────

function AdireMark({ dark = false }: { dark?: boolean }) {
  const colour = dark ? "#1B2A4A" : "#F5F0E8";
  const accent = "#C17B3A";
  return (
    <svg
      width="20" height="20" viewBox="0 0 20 20"
      fill="none" xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <rect x="2" y="2" width="16" height="16" rx="1"
        fill="none" stroke={colour} strokeWidth="0.75" />
      <circle cx="10" cy="10" r="2" fill={accent} />
      <circle cx="2"  cy="2"  r="1" fill={accent} />
      <circle cx="18" cy="2"  r="1" fill={accent} />
      <circle cx="2"  cy="18" r="1" fill={accent} />
      <circle cx="18" cy="18" r="1" fill={accent} />
    </svg>
  );
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function AdireNav() {
  const pathname = usePathname();
  const [scrolled,     setScrolled]     = useState(false);
  const [menuOpen,     setMenuOpen]     = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [dropdownTimer, setDropdownTimer]   = useState<ReturnType<typeof setTimeout> | null>(null);

  // ── Scroll detection ───────────────────────────────────────────────────────
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ── Close mobile menu on route change ─────────────────────────────────────
  useEffect(() => { setMenuOpen(false); }, [pathname]);

  // ── Lock body scroll when mobile menu open ────────────────────────────────
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  // ── Dropdown hover helpers ─────────────────────────────────────────────────
  const openDropdown  = useCallback((label: string) => {
    if (dropdownTimer) clearTimeout(dropdownTimer);
    setActiveDropdown(label);
  }, [dropdownTimer]);

  const closeDropdown = useCallback(() => {
    const t = setTimeout(() => setActiveDropdown(null), 140);
    setDropdownTimer(t);
  }, []);

  const isDark = scrolled || menuOpen;

  return (
    <>
      {/* ── Global nav styles ── */}
      <style>{`
        .ad-nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 400;
          height: 68px;
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 5vw;
          transition: background 0.45s cubic-bezier(0.16,1,0.3,1),
                      border-color 0.45s cubic-bezier(0.16,1,0.3,1);
          border-bottom: 1px solid transparent;
        }
        .ad-nav.scrolled {
          background: rgba(245,240,232,0.97);
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
          border-color: #E2D4BE;
        }
        .ad-nav.menu-open {
          background: #F5F0E8;
          border-color: #E2D4BE;
        }

        /* Logo */
        .ad-nav-logo {
          display: flex; align-items: center; gap: 10px;
          text-decoration: none; position: relative; z-index: 2;
        }
        .ad-nav-logo-word {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 26px; font-weight: 400;
          letter-spacing: 0.1em; text-transform: uppercase;
          line-height: 1; transition: color 0.3s;
          color: #F5F0E8;
        }
        .ad-nav-logo-word.dark { color: #1B2A4A; }
        .ad-nav-logo-word span {
          color: #C17B3A; font-style: italic; font-weight: 300;
        }

        /* Desktop links */
        .ad-nav-desktop {
          display: flex; align-items: center; gap: 0;
          list-style: none; position: relative;
        }
        .ad-nav-item { position: relative; }
        .ad-nav-link {
          display: flex; align-items: center; gap: 5px;
          padding: 8px 16px;
          font-family: 'Instrument Sans', system-ui, sans-serif;
          font-size: 11px; font-weight: 400;
          letter-spacing: 0.2em; text-transform: uppercase;
          text-decoration: none;
          transition: color 0.2s;
          color: rgba(245,240,232,0.65);
          background: none; border: none; cursor: pointer;
          white-space: nowrap;
        }
        .ad-nav-link.dark { color: #7A6E60; }
        .ad-nav-link:hover,
        .ad-nav-link.active { color: #C17B3A; }
        .ad-nav-link.dark:hover,
        .ad-nav-link.dark.active { color: #C17B3A; }
        .ad-nav-chevron {
          width: 8px; height: 8px;
          border-right: 1px solid currentColor;
          border-bottom: 1px solid currentColor;
          transform: rotate(45deg) translateY(-2px);
          transition: transform 0.2s;
          flex-shrink: 0;
        }
        .ad-nav-item:hover .ad-nav-chevron { transform: rotate(225deg) translateY(-2px); }

        /* Dropdown */
        .ad-dropdown {
          position: absolute; top: calc(100% + 8px); left: 0;
          min-width: 200px;
          background: #F5F0E8;
          border: 0.5px solid #E2D4BE;
          box-shadow: 0 8px 32px rgba(27,42,74,0.1);
          padding: 8px 0;
          z-index: 500;
        }
        .ad-dropdown-link {
          display: block; padding: 10px 20px;
          font-family: 'Instrument Sans', system-ui, sans-serif;
          font-size: 12px; font-weight: 400;
          letter-spacing: 0.1em;
          color: #7A6E60; text-decoration: none;
          transition: background 0.15s, color 0.15s;
          white-space: nowrap;
        }
        .ad-dropdown-link:hover {
          background: #F0DFC4; color: #1B2A4A;
        }

        /* CTA */
        .ad-nav-cta {
          margin-left: 16px;
          display: inline-flex; align-items: center;
          padding: 10px 22px;
          font-family: 'Instrument Sans', system-ui, sans-serif;
          font-size: 10px; font-weight: 500;
          letter-spacing: 0.22em; text-transform: uppercase;
          text-decoration: none;
          background: #C17B3A; color: #fff;
          transition: background 0.2s, transform 0.2s;
          white-space: nowrap;
        }
        .ad-nav-cta:hover { background: #D4956A; transform: translateY(-1px); }
        .ad-nav-cta.dark {
          background: #1B2A4A; color: #F5F0E8;
        }
        .ad-nav-cta.dark:hover { background: #243560; }

        /* Hamburger */
        .ad-hamburger {
          display: none;
          flex-direction: column; justify-content: center;
          gap: 5px; width: 36px; height: 36px;
          background: none; border: none; cursor: pointer;
          padding: 4px; position: relative; z-index: 2;
        }
        .ad-hamburger-line {
          width: 22px; height: 1px;
          transition: transform 0.3s cubic-bezier(0.16,1,0.3,1),
                      opacity 0.2s, background 0.3s;
        }
        .ad-hamburger-line.light { background: rgba(245,240,232,0.75); }
        .ad-hamburger-line.dark  { background: #1B2A4A; }
        .ad-hamburger.open .ad-hamburger-line:nth-child(1) {
          transform: translateY(6px) rotate(45deg);
          background: #1B2A4A;
        }
        .ad-hamburger.open .ad-hamburger-line:nth-child(2) {
          opacity: 0;
        }
        .ad-hamburger.open .ad-hamburger-line:nth-child(3) {
          transform: translateY(-6px) rotate(-45deg);
          background: #1B2A4A;
        }

        /* Mobile menu */
        .ad-mobile-menu {
          position: fixed; top: 68px; left: 0; right: 0; bottom: 0;
          background: #F5F0E8; z-index: 350;
          display: flex; flex-direction: column;
          padding: 0 6vw 40px; overflow-y: auto;
        }
        .ad-mobile-divider {
          width: 100%; height: 0.5px;
          background: #E2D4BE; margin: 0;
        }
        .ad-mobile-link {
          display: flex; align-items: center; justify-content: space-between;
          padding: 20px 0;
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 28px; font-weight: 300;
          color: #1B2A4A; text-decoration: none;
          letter-spacing: -0.01em;
          border-bottom: 0.5px solid #E2D4BE;
          transition: color 0.2s;
        }
        .ad-mobile-link:hover { color: #C17B3A; }
        .ad-mobile-link span {
          font-size: 16px; color: #C17B3A; font-style: italic;
        }
        .ad-mobile-sub {
          padding: 8px 0 16px 0;
          border-bottom: 0.5px solid #E2D4BE;
          display: flex; flex-direction: column; gap: 0;
        }
        .ad-mobile-sub-link {
          display: block; padding: 10px 0;
          font-family: 'Instrument Sans', system-ui, sans-serif;
          font-size: 13px; font-weight: 400;
          letter-spacing: 0.15em; text-transform: uppercase;
          color: #7A6E60; text-decoration: none;
          transition: color 0.15s;
        }
        .ad-mobile-sub-link:hover { color: #C17B3A; }
        .ad-mobile-footer {
          margin-top: auto; padding-top: 32px;
          display: flex; flex-direction: column; gap: 10px;
        }
        .ad-mobile-cta-main {
          display: block; text-align: center;
          background: #C17B3A; color: #fff;
          padding: 16px; text-decoration: none;
          font-family: 'Instrument Sans', system-ui, sans-serif;
          font-size: 11px; font-weight: 500;
          letter-spacing: 0.22em; text-transform: uppercase;
        }
        .ad-mobile-cta-sec {
          display: block; text-align: center;
          border: 0.5px solid #E2D4BE; color: #7A6E60;
          padding: 16px; text-decoration: none;
          font-family: 'Instrument Sans', system-ui, sans-serif;
          font-size: 11px; font-weight: 400;
          letter-spacing: 0.22em; text-transform: uppercase;
          transition: border-color 0.2s, color 0.2s;
        }
        .ad-mobile-cta-sec:hover { border-color: #C17B3A; color: #C17B3A; }
        .ad-mobile-contact {
          margin-top: 20px;
          font-family: 'Instrument Sans', system-ui, sans-serif;
          font-size: 12px; font-weight: 300;
          color: #B4A898; letter-spacing: 0.05em; text-align: center;
        }
        .ad-mobile-contact a {
          color: #C17B3A; text-decoration: none;
        }

        @media (max-width: 900px) {
          .ad-nav-desktop { display: none; }
          .ad-hamburger   { display: flex; }
        }
      `}</style>

      {/* ── Nav bar ── */}
      <nav className={[
        "ad-nav",
        scrolled ? "scrolled" : "",
        menuOpen ? "menu-open" : "",
      ].filter(Boolean).join(" ")}
        role="navigation" aria-label="Main navigation"
      >
        {/* Logo */}
        <Link href="/" className="ad-nav-logo" aria-label="Adire — home">
          <AdireMark dark={isDark} />
          <span className={`ad-nav-logo-word ${isDark ? "dark" : ""}`}>
            Adire<span>.</span>
          </span>
        </Link>

        {/* Desktop links */}
        <ul className="ad-nav-desktop" role="list">
          {NAV_LINKS.map((link) => (
            <li key={link.label} className="ad-nav-item"
              onMouseEnter={() => link.sub && openDropdown(link.label)}
              onMouseLeave={() => link.sub && closeDropdown()}
            >
              {link.sub ? (
                <>
                  <button
                    className={[
                      "ad-nav-link",
                      isDark ? "dark" : "",
                      pathname.startsWith(link.href) ? "active" : "",
                    ].filter(Boolean).join(" ")}
                    aria-expanded={activeDropdown === link.label}
                    aria-haspopup="true"
                  >
                    {link.label}
                    <span className="ad-nav-chevron" aria-hidden />
                  </button>
                  <AnimatePresence>
                    {activeDropdown === link.label && (
                      <motion.div
                        className="ad-dropdown"
                        role="menu"
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.18 }}
                        onMouseEnter={() => openDropdown(link.label)}
                        onMouseLeave={closeDropdown}
                      >
                        {link.sub.map((sub) => (
                          <Link
                            key={sub.label}
                            href={sub.href}
                            className="ad-dropdown-link"
                            role="menuitem"
                          >
                            {sub.label}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              ) : (
                <Link
                  href={link.href}
                  className={[
                    "ad-nav-link",
                    isDark ? "dark" : "",
                    pathname === link.href ? "active" : "",
                  ].filter(Boolean).join(" ")}
                >
                  {link.label}
                </Link>
              )}
            </li>
          ))}
          <li>
            <Link
              href="/shop"
              className={`ad-nav-cta ${isDark ? "dark" : ""}`}
            >
              Personalise Now
            </Link>
          </li>
        </ul>

        {/* Hamburger */}
        <button
          className={`ad-hamburger ${menuOpen ? "open" : ""}`}
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
        >
          {[1,2,3].map((n) => (
            <span
              key={n}
              className={`ad-hamburger-line ${isDark ? "dark" : "light"}`}
            />
          ))}
        </button>
      </nav>

      {/* ── Mobile menu ── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="ad-mobile-menu"
            role="dialog"
            aria-label="Mobile navigation"
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.32, ease: [0.16,1,0.3,1] }}
          >
            {NAV_LINKS.map((link, i) => (
              <motion.div
                key={link.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 + 0.05 }}
              >
                <Link href={link.href} className="ad-mobile-link">
                  {link.label}
                  <span>→</span>
                </Link>
                {link.sub && (
                  <div className="ad-mobile-sub">
                    {link.sub.map((sub) => (
                      <Link
                        key={sub.label}
                        href={sub.href}
                        className="ad-mobile-sub-link"
                      >
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                )}
              </motion.div>
            ))}

            <div className="ad-mobile-footer">
              <Link href="/shop" className="ad-mobile-cta-main">
                Shop All Products
              </Link>
              <Link href="/business" className="ad-mobile-cta-sec">
                Corporate Orders →
              </Link>
              <p className="ad-mobile-contact">
                Questions? <a href="https://wa.me/2348051385049">WhatsApp us</a>
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}