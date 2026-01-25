"use client";

const TermsOfUse = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16 text-zinc-400 leading-relaxed">
      <h1 className="text-4xl font-black text-white italic mb-4 uppercase tracking-tighter">
        Terms of <span className="text-[#dc2626]">Use</span>
      </h1>
      <p className="mb-12 text-sm uppercase tracking-widest text-zinc-500">Last Updated: January 2026</p>

      <div className="space-y-12">
        <section>
          <h2 className="text-xl font-bold text-white mb-4 uppercase tracking-tight">1. The Agreement</h2>
          <p>Welcome to Lensra. By accessing our website or using our services, you agree to be bound by these Terms of Use. These terms apply to all visitors, customers, and registered users in the Lensra ecosystem.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-4 uppercase tracking-tight">2. Accounts & Security</h2>
          <p>To access certain features, you must provide accurate information. You are responsible for safeguarding your login credentials. Lensra reserves the right to suspend or terminate accounts suspected of fraudulent activity or misuse.</p>
        </section>

        <section className="border-l-2 border-[#dc2626] pl-6 py-2">
          <h2 className="text-xl font-bold text-white mb-4 uppercase tracking-tight">3. Orders, Payments & Currency</h2>
          <p>All prices on Lensra are listed in **Naira (₦)**. Orders are only processed upon successful payment verification. Because our products are custom-made, orders cannot be cancelled once the production phase has commenced.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-4 uppercase tracking-tight">4. Custom Content & Intellectual Property</h2>
          <p>You retain rights to your uploaded images and messages, but you confirm you have the legal right to use them. Lensra prohibits the upload of illegal, offensive, or copyrighted material without permission. Our branding and site designs remain the exclusive property of Lensra.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-4 uppercase tracking-tight">5. Delivery & Returns</h2>
          <p>Estimated delivery times are guides, not guarantees. Risk of loss passes to you upon delivery to our logistics partners. **Custom items are non-refundable** unless they arrive damaged or defective, which must be reported within 48 hours of receipt.</p>
        </section>

        <section className="text-xs text-zinc-600 border-t border-zinc-800 pt-8">
          <p>These terms are governed by the laws of the Federal Republic of Nigeria. Lensra reserves the right to update these terms at any time.</p>
        </section>
      </div>
    </div>
  );
};

export default TermsOfUse