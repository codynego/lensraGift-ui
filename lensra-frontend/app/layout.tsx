// app/layout.tsx
// Adire — Root layout
// Preserves: AuthProvider, GoogleAnalytics, Pinterest verify meta, favicon, robots
// Updates: brand, fonts (Playfair Display + Syne via next/font), metadata, site URL

import "./globals.css";
import type { Metadata } from "next";
import { Playfair_Display, Syne } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import AdireNav from "@/components/AdireNav";
import AdireFooter from "@/components/AdireFooter";
import { AuthProvider } from "@/context/AuthContext";

// ── Fonts ─────────────────────────────────────────────────────────────────────
// Using next/font instead of @import — faster, no FOUT, self-hosted automatically

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
  display: "swap",
});

const syne = Syne({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-syne",
  display: "swap",
});

// ── Metadata ──────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: {
    default: "Lensra | Personalised Ankara Gifts — Made in Nigeria",
    template: "%s | Lensra",
  },
  description:
    "Handmade personalised Ankara tote bags and pouches, embroidered with your name and made to order in Benin City. The most meaningful gift you can give. Delivered across Nigeria in 3–5 days.",
  keywords: [
    "personalised Ankara gifts Nigeria",
    "custom Ankara tote bag Nigeria",
    "Ankara pouch personalised",
    "personalised gifts Benin City",
    "Ankara gifts Nigeria",
    "handmade Nigerian gifts",
    "embroidered Ankara bag Nigeria",
    "Lensra gifts Nigeria",
    "custom gifts Nigeria",
    "Nigerian gifting brand",
    "Ankara gift delivery Nigeria",
    "made in Nigeria gifts",
  ],
  authors: [{ name: "Lensra" }],
  creator: "Lensra",
  metadataBase: new URL("https://www.lensra.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Lensra — Personalised Ankara Gifts. Made Nigerian.",
    description:
      "Handmade Ankara tote bags and pouches embroidered with your name. Made to order in Benin City. Delivered nationwide.",
    url: "https://www.lensra.com",
    siteName: "Lensra",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Lensra — Personalised Ankara Gifts",
      },
    ],
    locale: "en_NG",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lensra | Personalised Ankara Gifts",
    description:
      "Embroidered with your name. Made by hand in Benin City. Delivered across Nigeria.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    // Replace with your actual Google Search Console verification code
    google: "your-google-verification-code",
  },
  icons: {
    icon:     "/favicon.png",
    shortcut: "/favicon.png",
    apple:    "/favicon.png",
  },
};

// ── Layout ────────────────────────────────────────────────────────────────────

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${syne.variable}`}>
      <head>
        {/*
          Pinterest domain verification — kept from original.
          Replace value if your Pinterest account changes.
        */}
        <meta name="p:domain_verify" content="f8b7975759669136bd46bcbf56ffd0e5" />
      </head>

      <body
        style={{
          fontFamily: "var(--font-syne), system-ui, sans-serif",
          background: "#F5F0E8",
          color: "#2C1810",
          WebkitFontSmoothing: "antialiased",
          MozOsxFontSmoothing: "grayscale" as any,
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          overflowX: "hidden",
        }}
      >
        {/*
          AuthProvider wraps everything so useAuth() works on every page —
          including /login, /signup, /reseller-program etc.
          It must have "use client" at the top of AuthContext.tsx.
        */}
        <AuthProvider>
          <AdireNav />
          <main style={{ flexGrow: 1, paddingTop: "68px" }}>
            {children}
          </main>
          <AdireFooter />
        </AuthProvider>

        {/*
          Google Analytics — same @next/third-parties implementation as original.
          Set NEXT_PUBLIC_GA_ID in your .env file.
        */}
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID || ""} />
      </body>
    </html>
  );
}