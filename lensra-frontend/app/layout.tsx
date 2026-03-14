// app/layout.tsx
// Adire — Root layout
// Wires AdireNav + AdireFooter around all page content

import type { Metadata } from "next";
import AdireNav from "@/components/AdireNav";
import AdireFooter from "@/components/AdireFooter";
import { AuthProvider } from "@/context/AuthContext"; // ← adjust path to match yours
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.adire.ng"),
  title: {
    default: "Adire | Personalised Ankara Gifts — Made in Nigeria",
    template: "%s | Adire",
  },
  description:
    "Handmade personalised Ankara tote bags and pouches, embroidered with your name. Made to order in Benin City. Delivered across Nigeria.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Preconnect for Google Fonts used in Nav + Footer */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400;1,600&family=Instrument+Sans:wght@300;400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {/*
          AuthProvider must wrap everything — it supplies the auth context
          that useAuth() reads on /login, /signup, /reseller-program etc.
          It must be a Client Component ("use client" in AuthContext.tsx).
        */}
        <AuthProvider>
          <AdireNav />
          <main>{children}</main>
          <AdireFooter />
        </AuthProvider>
      </body>
    </html>
  );
}