// app/page.tsx
// Server component — Adire homepage
// Brand: Personalised Ankara Gifts · Made in Benin City · Delivered Nationwide

import { Metadata } from "next";
import ClientHomepage from "./ClientHomepage";
import { WithContext, WebPage, Organization, BreadcrumbList } from "schema-dts";

const BaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.lensra.com/";
const SiteUrl = "https://www.lensra.com";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface Product {
  id: number;
  slug: string;
  name: string;
  base_price: string;
  category: "tote" | "pouch" | string;
  image_url: string | null;
  is_active: boolean;
  is_trending: boolean;
  is_featured: boolean;
  is_new?: boolean;
}

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

export default async function Homepage() {
  let products: Product[] = [];

  try {
    const res = await fetch(`${BaseUrl}api/products/`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) throw new Error("Failed to fetch products");
    const data = await res.json();
    console.log("Fetched products data:", data);
    products = Array.isArray(data) ? data : (data.results ?? []);

    products = products.filter(
      (p) => p.is_active
    );
    console.log("Filtered active tote/pouch products:", products);
  } catch (err) {
    console.error("[Lensra] Product fetch error:", err);
  }

  return (
    <>
      <HomepageSchema />
      <ClientHomepage initialProducts={products} />
    </>
  );
}