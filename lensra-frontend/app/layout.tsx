import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { GoogleAnalytics } from '@next/third-parties/google'; // Added: For easy GA integration
// import Script from 'next/script'; // Added: If using manual method (uncomment if needed)
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/context/AuthContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Lensra | Premium Digital Gift Shop & Personalised Experiences",
    template: "%s | Lensra Gifts",
  },
  description:
    "Lensra is a premium gift shop offering unique print-on-demand products and instant digital gift experiences. Send personalized messages, voice notes, and videos with every gift.",
  keywords: [
    "digital gift shop",
    "personalized gifts Nigeria",
    "customized gift benin city",
    "digital gift experiences",
    "personalized digital gifts",
    "custom gift shop",
    "gift delivery Nigeria",
    "instant gift delivery",
    "print on demand gifts",
    "unique gift experiences",
    "secret message gifts",
    "Lensra",
  ],
  authors: [{ name: "Lensra" }],
  creator: "Lensra",
  metadataBase: new URL("https://www.lensra.com"),
  alternates: {
    canonical: "/",
    languages: { // Added: If you support multiple languages
      "en-US": "/en-US",
    },
  },
  openGraph: {
    title: "Lensra | Unique Digital Gift Experiences",
    description: "The modern way to send love. Personalized physical gifts paired with magical digital reveals.",
    url: "https://www.lensra.com",
    siteName: "Lensra",
    images: [
      {
        url: "/logo.jpg",
        width: 1200,
        height: 630,
        alt: "Lensra Gift Experience",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lensra | Premium Digital Gift Shop",
    description: "Send personalized gifts with instant digital reveals. Experience the magic of giving.",
    images: ["/logo.jpg"],
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
  verification: { // Added: For Google Search Console verification
    google: "your-google-verification-code", // Replace with actual code
  },
  icons: { // Added: Favicons for better branding in search results
    icon: "/favicon.jpg",
    shortcut: "/favicon.jpg",
    apple: "/favicon.jpg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased flex flex-col min-h-screen bg-[#050505] text-white`}>
        <AuthProvider>
          <Navbar />
          <main className="flex-grow">{children}</main>
          <Footer />
        </AuthProvider>

        {/* Added: Google Analytics - Recommended Method */}
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID || ''} />

        {/* Alternative: Manual GA Script (uncomment if not using @next/third-parties) */}
        {/* 
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
          `}
        </Script>
        */}
      </body>
    </html>
  );
}