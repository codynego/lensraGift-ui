// app/about/page.tsx
// Lensra — About page server component

import { Metadata } from "next";
import AboutPage from "./AboutPage";

export const metadata: Metadata = {
  title: "Our Story | About Lensra",
  description:
    "Lensra was built in Benin City to fill a gap in the Nigerian gifting market. Premium personalised Ankara tote bags and pouches — handmade, embroidered with your name, delivered nationwide.",
  openGraph: {
    title: "Our Story — Lensra | Made in Benin City",
    description:
      "We saw a gap in the Nigerian gifting market and built the brand we wished existed. Personalised Ankara gifts, handmade in Benin City.",
    url: "https://www.lensra.com/about",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Lensra — Our Story" }],
  },
  alternates: { canonical: "/about" },
};

export default function Page() {
  return <AboutPage />;
}