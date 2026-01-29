import GiftFinder from '@/components/GiftFinder';

export const metadata = {
  title: 'Gift Finder | Lensra Benin City',
  description: 'Not sure what to get? Use the Lensra Gift Finder to discover the perfect personalized gift in seconds.',
  keywords: [
    'gift finder Benin City',
    'personalized gifts Nigeria',
    'custom gifts Lagos',
    'Lensra gift recommendations',
    'anniversary gifts',
    'birthday surprises',
  ],
  openGraph: {
    title: 'Lensra Gift Finder - Find the Perfect Personalized Gift',
    description: 'Answer a few quick questions and get tailored gift recommendations from Lensra.',
    url: 'https://www.lensra.com/gift-finder',
    images: [
      {
        url: 'https://www.lensra.com/images/gift-finder-og.jpg', // Replace with actual OG image URL
        width: 1200,
        height: 630,
        alt: 'Lensra Gift Finder',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Discover Perfect Gifts with Lensra Finder',
    description: 'Personalized recommendations for every occasion.',
    images: ['https://www.lensra.com/images/gift-finder-og.jpg'], // Replace with actual image
  },
};

export default function GiftFinderPage() {
  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-12 px-4 md:py-20">
      {/* Brand Header */}
      <div className="text-center mb-10 max-w-2xl px-4">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 leading-tight">
          Lensra Gift Finder
        </h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-xl mx-auto">
          Let our smart algorithm be your personal shopper. Answer a few questions to uncover the ideal personalized gift for your loved one.
        </p>
      </div>

      {/* Quiz Component Wrapper */}
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
        <div className="p-6 md:p-12">
          <GiftFinder />
        </div>
      </div>

      {/* Trust Signals */}
      <div className="mt-12 text-center text-gray-500 text-sm md:text-base">
        <p className="font-medium">Trusted by over 1,000 gift-givers in Benin City and beyond.</p>
        <div className="flex flex-wrap justify-center gap-4 mt-2">
          <span className="flex items-center">⭐ Premium Quality Prints</span>
          <span className="flex items-center">🚚 Fast Delivery Across Nigeria</span>
          <span className="flex items-center">💯 Satisfaction Guaranteed</span>
        </div>
      </div>
    </main>
  );
}