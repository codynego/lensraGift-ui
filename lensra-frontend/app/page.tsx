// app/page.tsx
// Server component — Lensra rebranded homepage

import { Metadata } from 'next';
import ClientHomepage from './ClientHomepage';
import { WithContext, WebPage, Organization, BreadcrumbList } from 'schema-dts';

const BaseUrl = "https://api.lensra.com/";

export interface Product {
  id: number;
  slug: string;
  name: string;
  base_price: string;
  category: 'mug' | 'canvas' | string;
  image_url: string | null;
  is_active: boolean;
  is_trending: boolean;
  is_featured: boolean;
}

// ── Metadata ──────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: 'Lensra | Gifts That Remember — Custom Mugs & Canvas Prints in Nigeria',
  description:
    'Turn your most precious moments into lasting gifts. Custom mugs and premium canvas prints, personalised with your photos and words. Delivered across Nigeria from Benin City.',
  keywords: [
    'custom mugs Nigeria',
    'personalised canvas prints Nigeria',
    'custom gifts Benin City',
    'premium personalised gifts Nigeria',
    'photo gifts Nigeria',
    'custom mug Nigeria',
    'canvas print gift Nigeria',
    'Lensra gifts',
  ],
  openGraph: {
    title: 'Lensra — Gifts That Remember',
    description:
      'Custom mugs and premium canvas prints, personalised with your photos and words. Delivered across Nigeria.',
    url: 'https://www.lensra.com',
    siteName: 'Lensra',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Lensra — Custom Mugs & Canvas Prints',
      },
    ],
    type: 'website',
    locale: 'en_NG',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Lensra — Gifts That Remember',
    description:
      'Custom mugs and premium canvas prints. Personalised, premium, delivered nationwide.',
    images: ['/og-image.jpg'],
  },
  alternates: {
    canonical: 'https://www.lensra.com',
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
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Lensra — Gifts That Remember',
    description:
      'Custom mugs and premium canvas prints, personalised with your photos and words. Delivered across Nigeria.',
    url: 'https://www.lensra.com',
    breadcrumb: {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: 'https://www.lensra.com',
        },
      ],
    },
    publisher: {
      '@type': 'Organization',
      name: 'Lensra',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.lensra.com/logo.png',
      },
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Benin City',
        addressRegion: 'Edo',
        addressCountry: 'NG',
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
    if (!res.ok) throw new Error('Failed to fetch products');
    const data = await res.json();
    products = Array.isArray(data) ? data : (data.results ?? []);
    // Only surface active mug + canvas products on the homepage
    products = products.filter(
      (p) => p.is_active && ['mug', 'canvas'].includes(p.category),
    );
  } catch (err) {
    console.error('[Lensra] Product fetch error:', err);
  }

  return (
    <>
      <HomepageSchema />
      <ClientHomepage initialProducts={products} />
    </>
  );
}