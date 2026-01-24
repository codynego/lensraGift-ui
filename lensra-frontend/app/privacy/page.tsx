// components/legal/PrivacyPolicy.tsx
const PrivacyPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16 text-zinc-400 leading-relaxed">
      <h1 className="text-4xl font-black text-white italic mb-4 uppercase tracking-tighter">
        Privacy <span className="text-[#dc2626]">Policy</span>
      </h1>
      <p className="mb-12 text-sm uppercase tracking-widest text-zinc-500">Last Updated: January 2026</p>

      <div className="space-y-12">
        <section>
          <h2 className="text-xl font-bold text-white mb-4 uppercase tracking-tight">1. Data Collection</h2>
          <p>To fulfill your orders, we collect personal information including your name, email, phone number, and delivery address. We also store your uploaded designs and order history to ensure a seamless experience.</p>
        </section>

        <section className="bg-zinc-900/50 p-6 rounded-lg border border-zinc-800">
          <h2 className="text-xl font-bold text-white mb-4 uppercase tracking-tight text-[#dc2626]">2. WhatsApp & Communication</h2>
          <p>With your consent, we use your WhatsApp number to provide real-time order updates and marketing messages. You may opt out of marketing communications at any time by following the "Unsubscribe" instructions in our messages.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-4 uppercase tracking-tight">3. Data Sharing & Security</h2>
          <p>We do not sell your data. Information is shared only with trusted third-party partners (Logistics, Payment Processors, and Hosting) necessary to run our service. While we take reasonable measures to protect your data, no digital system is 100% secure.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-4 uppercase tracking-tight">4. Your Rights</h2>
          <p>You have the right to access, correct, or request the deletion of your personal data. We retain information only for as long as necessary for business or legal compliance.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-4 uppercase tracking-tight">5. Contact Us</h2>
          <p>For any privacy-related inquiries, please reach out to our team at **support@lensragifts.com** or via our official WhatsApp contact channel.</p>
        </section>
      </div>
    </div>
  );
};