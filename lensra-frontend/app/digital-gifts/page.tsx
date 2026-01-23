// app/digital-gifts/page.tsx
// Assuming this is the route for digital gifts; adjust if needed
// Server component

import { Metadata } from 'next';
import ClientDigitalGifts from './ClientDigitalGifts'; // Client component below
import { WithContext, WebPage, BreadcrumbList, Service } from 'schema-dts';

export const metadata: Metadata = {
  title: 'Lensra Digital Gifts | Personalized Voice, Video & Message Experiences in Nigeria',
  description: 'Send emotional digital gifts with custom text, voice notes, or videos. Share via link or QR code card. Ideal for birthdays, love messages, surprises. Fast, secure, and easy in Nigeria, Lagos, Benin City.',
  keywords: [
    'digital gifts Nigeria',
    'personalized digital messages Nigeria',
    'voice message gifts Lagos',
    'video gift experiences Benin City',
    'QR code gifts Nigeria',
    'surprise digital reveals Lagos',
    'emotional digital gifts Benin City',
    'send voice messages as gifts Nigeria',
    'personalized video greetings Lagos',
    'digital surprise cards Benin City',
    'Lensra digital gifts',
    'custom digital experiences Nigeria',
    'QR reveal gifts Lagos',
    'voice note surprises Benin City',
  ],
  openGraph: {
    title: 'Lensra Digital Gifts | Create Heartfelt Experiences',
    description: 'Make simple messages special with voice or video. Share instantly via link or card. Perfect for any occasion.',
    url: 'https://www.lensra.com/digital-gifts',
    images: [
      {
        url: '/digital-gift-og.jpg', // Add relevant image
        width: 1200,
        height: 630,
        alt: 'Lensra Digital Gift Reveal Experience',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Lensra Digital Gifts | Personalized Voice & Video',
    description: 'Turn your words into joy. Custom messages with voice/video. Tap to reveal the surprise.',
    images: ['/digital-gift-og.jpg'],
  },
  alternates: {
    canonical: '/digital-gifts',
  },
};

// Digital Gifts Schema
function DigitalGiftsSchema() {
  const jsonLd: WithContext<WebPage> & { breadcrumb: WithContext<BreadcrumbList>; offers: Service } = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Lensra Digital Gifts",
    "description": "Create and send personalized digital gift experiences with messages, voice notes, or videos. Share via links or QR cards for emotional surprises.",
    "url": "https://www.lensra.com/digital-gifts",
    breadcrumb: {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://www.lensra.com"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Digital Gifts",
          "item": "https://www.lensra.com/digital-gifts"
        }
      ]
    },
    offers: {
      "@type": "Service",
      "@id": "https://www.lensra.com/digital-gifts#service",
      "name": "Digital Gift Creation",
      "description": "Personalized digital messages with voice/video and QR reveals for birthdays, love, surprises in Nigeria.",
      "provider": {
        "@type": "Organization",
        "name": "Lensra"
      },
      "areaServed": "NG",
      "serviceType": "Digital Gift Experiences"
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export default function DigitalGiftsPage() {
  return (
    <>
      <DigitalGiftsSchema />
      <ClientDigitalGifts />
    </>
  );
}