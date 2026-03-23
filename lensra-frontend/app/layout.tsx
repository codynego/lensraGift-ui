// app/layout.tsx
// Lensra — Root layout
// Design: Premium Black × White × Red
// Fonts: Montserrat + Inter via next/font

import "./globals.css";
import type { Metadata } from "next";
import { Montserrat, Inter } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import { LensraNav } from "@/components/LensraNav";
import LensraFooter from "@/components/LensraFooter";
import { AuthProvider } from "@/context/AuthContext";

// ── Fonts ─────────────────────────────────────────────────────────────────────

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
  variable: "--font-montserrat",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

// ── Metadata ──────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: {
    default: "Lensra | Personalised Gift Experiences — Made in Nigeria",
    template: "%s | Lensra",
  },
  description:
    "We create personalised surprise boxes that make your loved ones smile, cry, and remember forever. Handcrafted in Benin City. Delivered across Nigeria in 3–5 days.",
  keywords: [
    "personalised gifts Nigeria",
    "surprise memory box Nigeria",
    "custom gift box Nigeria",
    "exploding box gift Nigeria",
    "personalised gifts Benin City",
    "meaningful gifts Nigeria",
    "video memory card gift",
    "Lensra gifts Nigeria",
    "custom gifts Nigeria",
    "Nigerian gifting brand",
    "gift delivery Nigeria",
    "made in Nigeria gifts",
  ],
  authors: [{ name: "Lensra" }],
  creator: "Lensra",
  metadataBase: new URL("https://www.lensra.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Lensra — Turn Memories Into Unforgettable Gifts",
    description:
      "Personalised surprise boxes handcrafted with love. Made in Benin City. Delivered nationwide in 3–5 days.",
    url: "https://www.lensra.com",
    siteName: "Lensra",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Lensra — Personalised Gift Experiences",
      },
    ],
    locale: "en_NG",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lensra | Personalised Gift Experiences",
    description:
      "Surprise boxes that make people cry happy tears. Made in Benin City. Delivered across Nigeria.",
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
    <html lang="en" className={`${montserrat.variable} ${inter.variable}`}>
      <head>
        <meta name="p:domain_verify" content="f8b7975759669136bd46bcbf56ffd0e5" />
      </head>

      <body
        style={{
          fontFamily: "var(--font-inter), system-ui, sans-serif",
          background: "#FFFFFF",
          color: "#0F0F0F",
          WebkitFontSmoothing: "antialiased",
          MozOsxFontSmoothing: "grayscale" as any,
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          overflowX: "hidden",
        }}
      >
        <AuthProvider>
          <LensraNav />
          <main style={{ flexGrow: 1, paddingTop: "68px" }}>
            {children}
          </main>
          <LensraFooter />
        </AuthProvider>

        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID || ""} />
      </body>
    </html>
  );
}