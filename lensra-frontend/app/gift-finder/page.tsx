import GiftFinder from '@/components/GiftFinder';

export const metadata = {
  title: 'Gift Finder | Lensra Benin City',
  description: 'Not sure what to get? Use the Lensra Gift Finder to discover the perfect personalized gift in seconds.',
};

export default function GiftFinderPage() {
  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-12 px-4">
      {/* 1. Brand Header for the Standalone Page */}
      <div className="text-center mb-10 max-w-xl">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
          The Lensra Gift Finder
        </h1>
        <p className="text-lg text-gray-600">
          Answer a few questions and let our "Personal Shopper" algorithm find the perfect match for your loved one.
        </p>
      </div>

      {/* 2. The Reusable Quiz Component */}
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
        <div className="p-8 md:p-12">
          <GiftFinder />
        </div>
      </div>

      {/* 3. Trust Signals (Social Proof) */}
      <div className="mt-12 text-center text-gray-500 text-sm">
        <p>Trusted by 1,000+ gift-givers in Benin City.</p>
        <div className="flex justify-center gap-4 mt-2">
          <span>⭐ Premium Quality</span>
          <span>🚚 Fast Benin Delivery</span>
        </div>
      </div>
    </main>
  );
}