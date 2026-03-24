// app/page.tsx
// Server component — Lensra homepage
// Product fetching is handled client-side in ClientHomepage.tsx

import { Metadata } from "next";
import ClientHomepage from "./ClientHomepage";
import { WithContext, WebPage, Organization, BreadcrumbList } from "schema-dts";

const SiteUrl = "https://www.lensra.com";

// ── Metadata ──────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: "Lensra | Personalised Ankara Gifts — Made in Nigeria",
  description:
    "Handmade personalised Ankara tote bags and pouches, embroidered with your name and made to order in Benin City. The most meaningful gift you can give. Delivered across Nigeria.",
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
  ],
  openGraph: {
    title: "Lensra — Personalised Ankara Gifts. Made Nigerian.",
    description:
      "Handmade Ankara tote bags and pouches embroidered with your name. Made to order in Benin City. Delivered nationwide.",
    url: SiteUrl,
    siteName: "Lensra",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Lensra — Personalised Ankara Gifts",
      },
    ],
    type: "website",
    locale: "en_NG",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lensra — Gifts That Remember.",
    description:
      "Personalised Ankara tote bags and pouches. Embroidered, handmade, delivered nationwide.",
    images: ["/og-image.jpg"],
  },
  alternates: {
    canonical: SiteUrl,
  },
  robots: {
    index: true,
    follow: true,
  },
};

// ── Schema ────────────────────────────────────────────────────────────────────

function HomepageSchema() {
  const jsonLd: WithContext<WebPage> & {
    breadcrumb: WithContext<BreadcrumbList>;
    publisher: Organization;
  } = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Lensra — Personalised Ankara Gifts",
    description:
      "Handmade personalised Ankara tote bags and pouches, embroidered with your name and made to order in Benin City. Delivered across Nigeria.",
    url: SiteUrl,
    breadcrumb: {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: SiteUrl,
        },
      ],
    },
    publisher: {
      "@type": "Organization",
      name: "Lensra",
      url: SiteUrl,
      logo: {
        "@type": "ImageObject",
        url: `${SiteUrl}/logo.png`,
      },
      address: {
        "@type": "PostalAddress",
        addressLocality: "Benin City",
        addressRegion: "Edo",
        addressCountry: "NG",
      },
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer service",
        availableLanguage: "English",
      },
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function Homepage() {
  return (
    <>
      <HomepageSchema />
      <ClientHomepage />
    </>
  );
}