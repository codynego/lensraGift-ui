"use client";

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Gift, Heart, Sparkles, ArrowRight, Loader2, Check, MessageCircle } from 'lucide-react';

const BaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.lensra.com/";

interface InviteInfo {
  inviter_name?: string;
  inviter_code?: string;
}

function GiftRevealContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const inviteCode = searchParams.get('ref') || searchParams.get('invite');
  
  const [step, setStep] = useState<'capture' | 'processing' | 'preview'>('capture');
  const [whatsapp, setWhatsapp] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [inviteInfo, setInviteInfo] = useState<InviteInfo | null>(null);
  const [leadId, setLeadId] = useState<string>('');
  const [userInviteCode, setUserInviteCode] = useState('');
  const [recommendedProducts, setRecommendedProducts] = useState<any[]>([]);

  // Fetch invite info if there's a referral code
  useEffect(() => {
    if (inviteCode) {
      // In production, you'd fetch the inviter's name from the API
      setInviteInfo({ inviter_name: 'Your Friend', inviter_code: inviteCode });
    }
  }, [inviteCode]);

  const formatWhatsApp = (value: string) => {
    // Remove non-numeric characters
    const cleaned = value.replace(/\D/g, '');
    // Add Nigeria prefix if not present
    if (cleaned.length > 0 && !cleaned.startsWith('234')) {
      return '234' + cleaned;
    }
    return cleaned;
  };

  const fetchRandomProducts = async () => {
    try {
      // Fetch 3 random products
      const products = [];
      for (let i = 0; i < 3; i++) {
        const response = await fetch(`${BaseUrl}api/leads/recommend/`);
        if (response.ok) {
          const product = await response.json();
          products.push(product);
        }
      }
      setRecommendedProducts(products);
    } catch (err) {
      console.error('Failed to fetch products:', err);
      // Keep empty array, will show placeholders
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const formattedWhatsApp = formatWhatsApp(whatsapp);
      
      // Validate WhatsApp number
      if (formattedWhatsApp.length < 13) {
        setError('Please enter a valid WhatsApp number');
        setLoading(false);
        return;
      }

      // Submit to API
      const response = await fetch(`${BaseUrl}api/leads/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          whatsapp: formattedWhatsApp,
          name: name || undefined,
          invited_by: inviteCode || undefined,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit. Please try again.');
      }

      const data = await response.json();
      setLeadId(data.id);

      // Move to processing step
      setStep('processing');

      // Fetch random products while processing
      fetchRandomProducts();

      // After 2 seconds, move to preview
      setTimeout(() => {
        setStep('preview');
        // Generate user's invite code (in production, this comes from API)
        setUserInviteCode(data.id?.slice(0, 8) || Math.random().toString(36).substr(2, 8));
      }, 2000);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const shareLink = `${typeof window !== 'undefined' ? window.location.origin : ''}/gift-reveal?ref=${userInviteCode}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareLink);
    alert('Link copied! Share it with someone special 💝');
  };

  const shareOnWhatsApp = () => {
    const message = encodeURIComponent(
      `🎁 Someone might be sending you a surprise gift!\n\nCheck what it could be: ${shareLink}\n\n(Psst... you can also send someone a gift here 😉)`
    );
    window.open(`https://wa.me/?text=${message}`, '_blank');
  };

  if (step === 'processing') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-orange-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center">
          <div className="relative w-32 h-32 mx-auto mb-8">
            <div className="absolute inset-0 bg-red-500/20 rounded-full animate-ping" />
            <div className="relative w-32 h-32 bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center shadow-2xl">
              <Gift className="w-16 h-16 text-white animate-bounce" />
            </div>
          </div>
          
          <h2 className="text-3xl font-black uppercase tracking-tight text-zinc-900 mb-4">
            Processing Your Gift...
          </h2>
          <p className="text-lg text-zinc-600 font-semibold">
            We're preparing something special for you
          </p>
          
          <div className="flex items-center justify-center gap-2 mt-8">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-3 h-3 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-3 h-3 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
      </div>
    );
  }

  if (step === 'preview') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-orange-50 p-6">
        <div className="max-w-4xl mx-auto py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-white px-6 py-3 rounded-full shadow-lg mb-6">
              <Sparkles className="w-5 h-5 text-yellow-500" />
              <span className="text-sm font-black uppercase tracking-wide text-zinc-900">
                Gift Preview Ready
              </span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-zinc-900 mb-4">
              This Could Be<br />Your Surprise 👀
            </h1>
            <p className="text-lg text-zinc-600 font-semibold max-w-2xl mx-auto">
              Someone is thinking about turning a memory into a gift for you.<br />
              Here's what they might send...
            </p>
          </div>

          {/* Blurred Gift Previews - Real Products */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {recommendedProducts.length > 0 ? (
              recommendedProducts.map((product, idx) => (
                <div key={idx} className="relative group">
                  <div className="bg-white rounded-2xl overflow-hidden shadow-xl border-2 border-zinc-200 hover:border-red-500 transition-all">
                    {/* Product Image with Blur */}
                    <div className="relative aspect-square">
                      {product.image_url ? (
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-red-100 to-pink-100" />
                      )}
                      
                      {/* Blur overlay */}
                      <div className="absolute inset-0 backdrop-blur-lg bg-white/40 flex items-center justify-center">
                        <div className="text-center p-6">
                          <div className="text-5xl mb-3 opacity-70 group-hover:scale-110 transition-transform">
                            🎁
                          </div>
                          <p className="text-xs font-black uppercase text-zinc-600 mb-1">Preview Only</p>
                          <p className="text-xs text-zinc-500 font-semibold">
                            ₦{parseFloat(product.base_price).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Product Info */}
                    <div className="p-5 bg-gradient-to-b from-white to-zinc-50">
                      <h3 className="font-black uppercase text-base text-zinc-900 mb-2 line-clamp-2">
                        {product.name}
                      </h3>
                      <p className="text-xs text-zinc-600 font-semibold line-clamp-2">
                        {product.description || product.category_path}
                      </p>
                      {product.is_featured && (
                        <div className="mt-3 inline-flex items-center gap-1.5 bg-red-100 text-red-700 px-3 py-1 rounded-full">
                          <Sparkles className="w-3 h-3" />
                          <span className="text-xs font-black uppercase">Featured</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              // Fallback placeholders while loading
              [
                { icon: '☕', title: 'Personalized Mug', desc: 'With your photo & message' },
                { icon: '🖼️', title: 'Custom Frame', desc: 'Your best memory, framed' },
                { icon: '🎁', title: 'Surprise Box', desc: 'Multiple gifts in one' }
              ].map((item, idx) => (
                <div key={idx} className="relative group">
                  <div className="bg-white rounded-2xl p-8 shadow-xl border-2 border-zinc-200 hover:border-red-500 transition-all overflow-hidden">
                    {/* Blur overlay */}
                    <div className="absolute inset-0 backdrop-blur-md bg-white/60 flex items-center justify-center z-10">
                      <div className="text-center">
                        <div className="text-6xl mb-3 opacity-50 group-hover:scale-110 transition-transform">
                          {item.icon}
                        </div>
                        <p className="text-xs font-black uppercase text-zinc-400">Preview Only</p>
                      </div>
                    </div>
                    
                    {/* Content behind blur */}
                    <div className="relative z-0">
                      <div className="aspect-square bg-gradient-to-br from-red-100 to-pink-100 rounded-xl mb-4" />
                      <h3 className="font-black uppercase text-lg text-zinc-900 mb-2">{item.title}</h3>
                      <p className="text-sm text-zinc-600 font-semibold">{item.desc}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Mystery Message */}
          <div className="bg-gradient-to-r from-red-500 to-pink-600 rounded-2xl p-8 text-center mb-8 shadow-2xl">
            <p className="text-white text-xl md:text-2xl font-black uppercase tracking-tight mb-4">
              🎁 The Real Gift Unlocks When Someone Completes It
            </p>
            <p className="text-red-100 text-sm font-semibold max-w-md mx-auto">
              You'll get notified via WhatsApp when your surprise arrives
            </p>
          </div>

          {/* CTA Section */}
          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-2xl border-2 border-zinc-200">
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-zinc-900 mb-4">
                Want to Gift Someone Too? 💝
              </h2>
              <p className="text-zinc-600 font-semibold text-lg">
                Share your special link and help someone feel loved today
              </p>
            </div>

            {/* Share Options */}
            <div className="space-y-4 max-w-md mx-auto">
              <button
                onClick={shareOnWhatsApp}
                className="w-full bg-[#25D366] hover:bg-[#20BA5A] text-white py-5 rounded-2xl font-black uppercase tracking-wide text-lg transition-all shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 flex items-center justify-center gap-3"
              >
                <MessageCircle className="w-6 h-6" />
                Share on WhatsApp
              </button>

              <button
                onClick={copyToClipboard}
                className="w-full bg-zinc-900 hover:bg-zinc-800 text-white py-5 rounded-2xl font-black uppercase tracking-wide text-lg transition-all shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 flex items-center justify-center gap-3"
              >
                <Gift className="w-6 h-6" />
                Copy Gift Link
              </button>

              <button
                onClick={() => router.push('/marketplace')}
                className="w-full bg-red-600 hover:bg-red-700 text-white py-5 rounded-2xl font-black uppercase tracking-wide text-lg transition-all shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 flex items-center justify-center gap-3"
              >
                <Sparkles className="w-6 h-6" />
                Browse All Gifts
              </button>
            </div>

            {/* Shareable Link Display */}
            <div className="mt-8 p-4 bg-zinc-50 rounded-xl border border-zinc-200">
              <p className="text-xs font-bold uppercase text-zinc-400 mb-2 text-center">Your Personal Gift Link</p>
              <p className="text-sm font-mono text-zinc-700 text-center break-all">{shareLink}</p>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            {[
              { icon: '✅', text: 'Free to Share' },
              { icon: '🚀', text: 'Instant Delivery' },
              { icon: '❤️', text: 'Made with Love' }
            ].map((item, idx) => (
              <div key={idx} className="text-center">
                <div className="text-4xl mb-2">{item.icon}</div>
                <p className="text-sm font-bold text-zinc-600">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Main Capture Page
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-orange-50 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full">
        {/* Floating Hearts Animation */}
        <div className="absolute top-20 left-10 animate-bounce" style={{ animationDelay: '0s' }}>
          <Heart className="w-8 h-8 text-red-300 fill-red-300" />
        </div>
        <div className="absolute top-40 right-20 animate-bounce" style={{ animationDelay: '1s' }}>
          <Gift className="w-10 h-10 text-pink-300" />
        </div>
        <div className="absolute bottom-40 left-20 animate-bounce" style={{ animationDelay: '2s' }}>
          <Sparkles className="w-6 h-6 text-orange-300" />
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border-2 border-zinc-200 relative overflow-hidden">
          {/* Gradient Overlay */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-red-500 via-pink-500 to-orange-500" />

          {/* Referral Badge */}
          {inviteInfo && (
            <div className="mb-6 text-center">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-red-50 to-pink-50 px-6 py-3 rounded-full border-2 border-red-200">
                <Gift className="w-5 h-5 text-red-600" />
                <p className="text-sm font-black uppercase text-red-600">
                  {inviteInfo.inviter_name} invited you! 🎁
                </p>
              </div>
            </div>
          )}

          {/* Headline */}
          <div className="text-center mb-8">
            <div className="inline-block mb-4">
              <div className="relative">
                <div className="absolute inset-0 bg-red-500 blur-3xl opacity-30 animate-pulse" />
                <div className="relative bg-gradient-to-br from-red-500 to-pink-600 w-24 h-24 rounded-full flex items-center justify-center shadow-2xl">
                  <Gift className="w-12 h-12 text-white" />
                </div>
              </div>
            </div>

            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-zinc-900 mb-4 leading-none">
              Someone Is About<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-pink-600">
                To Gift You 🎁
              </span>
            </h1>

            <p className="text-lg md:text-xl text-zinc-600 font-semibold max-w-lg mx-auto leading-relaxed">
              We help people turn memories into surprise gifts.<br />
              <span className="text-red-600 font-black">Enter your WhatsApp to see what they might send.</span>
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5 max-w-md mx-auto">
            <div>
              <label className="block text-sm font-black uppercase tracking-wide text-black mb-3">
                📱 Your WhatsApp Number
              </label>
              <input
                type="tel"
                placeholder="e.g., 08012345678"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                className="w-full px-6 py-5 border-2 border-zinc-200 rounded-2xl text-lg font-semibold focus:border-red-500 focus:ring-4 focus:ring-red-500/20 transition-all outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-black uppercase tracking-wide text-black mb-3">
                👤 Your Name (Optional)
              </label>
              <input
                type="text"
                placeholder="What should we call you?"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-6 py-5 border-2 border-zinc-200 rounded-2xl text-lg font-semibold focus:border-red-500 focus:ring-4 focus:ring-red-500/20 transition-all outline-none"
              />
            </div>

            {error && (
              <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 text-center">
                <p className="text-sm font-bold text-red-600">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !whatsapp}
              className="w-full bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white py-6 rounded-2xl font-black uppercase tracking-wide text-xl transition-all shadow-2xl hover:shadow-3xl hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              {loading ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Gift className="w-6 h-6" />
                  Reveal My Gift 🎁
                  <ArrowRight className="w-6 h-6" />
                </>
              )}
            </button>
          </form>

          {/* Trust Signals */}
          <div className="mt-8 grid grid-cols-3 gap-4 max-w-md mx-auto">
            {[
              { icon: '🔒', text: 'Secure' },
              { icon: '⚡', text: 'Instant' },
              { icon: '🎯', text: 'Free' }
            ].map((item, idx) => (
              <div key={idx} className="text-center">
                <div className="text-3xl mb-2">{item.icon}</div>
                <p className="text-xs font-bold text-zinc-500 uppercase tracking-wide">{item.text}</p>
              </div>
            ))}
          </div>

          {/* Fine Print */}
          <p className="text-xs text-zinc-400 text-center mt-8 font-semibold">
            By continuing, you'll receive WhatsApp updates about your gift status.<br />
            We respect your privacy. No spam, ever.
          </p>
        </div>

        {/* Social Proof */}
        <div className="mt-8 text-center">
          <p className="text-sm text-zinc-600 font-bold mb-4">
            🔥 Over 10,000 gifts sent this month
          </p>
          <div className="flex items-center justify-center gap-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="w-10 h-10 rounded-full bg-gradient-to-br from-red-400 to-pink-400 border-2 border-white shadow-lg" />
            ))}
            <span className="text-xs font-black text-zinc-500 ml-2">+9,995 more</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function GiftRevealPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-24 h-24 mx-auto mb-6">
            <div className="absolute inset-0 bg-red-500/20 rounded-full animate-ping" />
            <div className="relative w-24 h-24 bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center shadow-2xl">
              <Gift className="w-12 h-12 text-white animate-bounce" />
            </div>
          </div>
          <p className="text-lg font-bold text-zinc-600">Loading your surprise...</p>
        </div>
      </div>
    }>
      <GiftRevealContent />
    </Suspense>
  );
}