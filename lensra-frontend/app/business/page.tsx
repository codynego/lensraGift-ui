// app/business/page.tsx
// Lensra — Business page server component

import { Metadata } from "next";
import BusinessPage from "./BusinessPage";

export const metadata: Metadata = {
  title: "Corporate & Bulk Orders | Lensra Business",
  description:
    "Branded Ankara tote bags and pouches for your staff, clients, and events. Each one personalised and embroidered. Bulk pricing from 10 units. Made in Benin City, delivered nationwide.",
  openGraph: {
    title: "Lensra Business — Corporate Ankara Gifts at Scale",
    description:
      "Personalised Ankara gifting for corporate clients. Staff packs, client gifts, event merchandise. Bulk pricing, priority production, nationwide delivery.",
    url: "https://www.lensra.com/business",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Lensra Business" }],
  },
  alternates: { canonical: "/business" },
};

export default function Page() {
  return <BusinessPage />;
}