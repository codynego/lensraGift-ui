// app/layout.tsx
// Adire — Root layout
// Wires AdireNav + AdireFooter around all page content

import type { Metadata } from "next";
import AdireNav from "@/components/AdireNav";
import AdireFooter from "@/components/AdireFooter";
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
          Nav sits fixed at z-index 400 — no wrapper needed.
          Page content should have padding-top: 68px to clear the nav height.
        */}
        <AdireNav />

        <main>{children}</main>

        <AdireFooter />
      </body>
    </html>
  );
}