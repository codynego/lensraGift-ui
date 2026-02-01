// app/page.tsx
// Server component for homepage

import { Metadata } from 'next';
import ClientHomepage from './ClientHomepage'; // Client component defined below
import { WithContext, WebPage, Organization, BreadcrumbList } from 'schema-dts';

const BaseUrl = "https://api.lensra.com/";

interface Product {
  id: number;
  slug: string;
  name: string;
  base_price: string;
  category: string;
  image_url: string | null;
  is_active: boolean;
  is_trending: boolean;
  is_featured: boolean;
}

export const metadata: Metadata = {
  title: 'Lensra | Premium Personalized Gifts & Digital Experiences in Nigeria',
  description: 'Create unforgettable personalized gifts with photos, messages, and more. Fast 72-hour delivery across Nigeria. Custom mugs, t-shirts, and mystery boxes for every occasion.',
  keywords: [
    'personalized gifts Nigeria',
    'custom gifts Lagos',
    'print on demand Nigeria',
    'digital gift experiences',
    'birthday gifts Nigeria',
    'mystery gift boxes',
    'Lensra gifts',
  ],
  openGraph: {
    title: 'Lensra | Turn Photos into Unforgettable Gifts',
    description: 'Premium custom gifts with digital reveals. Delivered in 72 hours anywhere in Nigeria.',
    url: 'https://www.lensra.com',
    images: [
      {
        url: '/heroimg-41.jpg',
        width: 1200,
        height: 630,
        alt: 'Lensra Personalized Gifts',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Lensra | Personalized Gifts in Nigeria',
    description: 'Create custom gifts with photos and messages. Fast delivery nationwide.',
    images: ['/heroimg-41.jpg'],
  },
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
  },
};

// Homepage Schema Component
function HomepageSchema() {
  const jsonLd: WithContext<WebPage> & { breadcrumb: WithContext<BreadcrumbList>; publisher: Organization } = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Lensra Homepage",
    "description": "Premium personalized gifts and digital experiences in Nigeria.",
    "url": "https://www.lensra.com",
    breadcrumb: {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://www.lensra.com"
        }
      ]
    },
    publisher: {
      "@type": "Organization",
      "name": "Lensra",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.lensra.com/logo.png" // Replace with actual logo
      },
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Lagos",
        "addressRegion": "Lagos",
        "addressCountry": "NG"
      }
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export default async function Homepage() {
  let products: Product[] = [];

  try {
    const prodRes = await fetch(`${BaseUrl}api/products/`, { next: { revalidate: 3600 } }); // ISR
    if (!prodRes.ok) throw new Error('Failed to fetch products');
    const prodData = await prodRes.json();
    products = Array.isArray(prodData) ? prodData : (prodData.results || []);
  } catch (err) {
    console.error("Fetch Error:", err);
  }

  return (
    <>
      <HomepageSchema />
      <ClientHomepage initialProducts={products} />
    </>
  );
}