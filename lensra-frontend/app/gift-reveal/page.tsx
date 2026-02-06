"use client";
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Gift, Heart, Sparkles, ArrowRight, Loader2, Check, MessageCircle, Copy } from 'lucide-react';
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
  const [leadData, setLeadData] = useState<any>(null);
  const [userInviteCode, setUserInviteCode] = useState('');
  const [recommendedProducts, setRecommendedProducts] = useState<any[]>([]);
  const [copied, setCopied] = useState(false);
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
        const errorData = await response.json();
        console.error('Lead creation error:', errorData);
        throw new Error('Failed to submit. Please try again.');
      }
      const data = await response.json();
      setLeadData(data);
      setLeadId(data.id);
      // Move to processing step
      setStep('processing');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (step === 'processing' && leadId) {
      const processLead = async () => {
        // Check for existing invite link
        if (leadData?.invite_links?.length > 0) {
          setUserInviteCode(leadData.invite_links[0].code);
        } else {
          try {
            // Create invite link
            const inviteResponse = await fetch(`${BaseUrl}api/leads/invites/`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ owner: leadId }),
            });
            if (!inviteResponse.ok) {
              const errorData = await inviteResponse.json();
              console.error('Invite creation error data:', errorData);
              throw new Error('Failed to create invite link');
            }
            const inviteData = await inviteResponse.json();
            setUserInviteCode(inviteData.code);
          } catch (err) {
            console.error('Invite creation error:', err);
            // Fallback
            setUserInviteCode(Math.random().toString(36).slice(2, 10).toUpperCase());
          }
        }

        // Fetch products
        await fetchRandomProducts();

        // Simulate processing delay
        setTimeout(() => {
          setStep('preview');
        }, 2000);
      };

      processLead();
    }
  }, [step, leadId, leadData]);
  const shareLink = `${typeof window !== 'undefined' ? window.location.origin : ''}/gift-reveal?ref=${userInviteCode}`;
  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  const shareOnWhatsApp = () => {
    const message = encodeURIComponent(
      `🎁 Someone might be sending you a surprise gift!\n\nCheck what it could be: ${shareLink}\n\n(Psst... you can also send someone a gift here 😉)`
    );
    window.open(`https://wa.me/?text=${message}`, '_blank');
  };
  if (step === 'processing') {
    return (
      <div className="min-h-screen bg-zinc-900 flex items-center justify-center p-4 sm:p-6">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="relative w-32 h-32 mx-auto">
            <div className="absolute inset-0 bg-red-500/30 rounded-full animate-ping" />
            <div className="relative w-32 h-32 bg-gradient-to-br from-red-600 to-red-800 rounded-full flex items-center justify-center shadow-2xl shadow-red-500/50">
              <Gift className="w-16 h-16 text-white animate-bounce" />
            </div>
          </div>
         
          <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">
            Crafting Your Surprise...
          </h2>
          <p className="text-base sm:text-lg text-zinc-300 font-semibold">
            Preparing a special reveal just for you
          </p>
         
          <div className="flex items-center justify-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-3 h-3 bg-red-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-3 h-3 bg-red-700 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
      </div>
    );
  }
  if (step === 'preview') {
    return (
      <div className="min-h-screen bg-zinc-900 p-4 sm:p-6 lg:p-8">
        <div className="max-w-6xl mx-auto py-8 lg:py-16 space-y-12 lg:space-y-16">
          {/* Header */}
          <div className="text-center space-y-4 lg:space-y-6">
            <div className="inline-flex items-center gap-2 bg-zinc-800 px-4 py-2 sm:px-6 sm:py-3 rounded-full shadow-lg shadow-red-500/20">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" />
              <span className="text-xs sm:text-sm font-black uppercase tracking-wide text-white">
                Preview Activated
              </span>
            </div>
           
            <h1 className="text-3xl sm:text-5xl lg:text-7xl font-black uppercase tracking-tighter text-white leading-none">
              Peek at Your<br />Potential Gift 👀
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-zinc-300 font-semibold max-w-2xl mx-auto">
              Someone special is contemplating a memory-turned-gift for you. 
              Here's a glimpse of what might arrive...
            </p>
          </div>
          {/* Blurred Gift Previews */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {recommendedProducts.length > 0 ? (
              recommendedProducts.map((product, idx) => (
                <div key={idx} className="relative group transform hover:scale-105 transition-transform duration-300">
                  <div className="bg-zinc-800 rounded-3xl overflow-hidden shadow-xl border border-zinc-700 group-hover:border-red-500 group-hover:shadow-red-500/30 transition-all">
                    {/* Product Image with Blur */}
                    <div className="relative aspect-square">
                      {product.image_url ? (
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-zinc-800 to-zinc-900" />
                      )}
                     
                      {/* Blur overlay */}
                      <div className="absolute inset-0 backdrop-blur-xl bg-black/50 flex items-center justify-center transition-opacity group-hover:opacity-80">
                        <div className="text-center p-4 sm:p-6">
                          <div className="text-4xl sm:text-5xl mb-2 sm:mb-3 opacity-70 group-hover:scale-110 transition-transform text-white">
                            🎁
                          </div>
                          <p className="text-[10px] sm:text-xs font-black uppercase text-zinc-300 mb-1">Mystery Preview</p>
                          <p className="text-xs sm:text-sm text-red-400 font-bold">
                            ₦{parseFloat(product.base_price).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                   
                    {/* Product Info */}
                    <div className="p-4 sm:p-6 bg-zinc-800">
                      <h3 className="font-black uppercase text-sm sm:text-base lg:text-lg text-white mb-2 line-clamp-2">
                        {product.name}
                      </h3>
                      <p className="text-[10px] sm:text-xs text-zinc-400 font-semibold line-clamp-2">
                        {product.description || product.category_path}
                      </p>
                      {product.is_featured && (
                        <div className="mt-2 sm:mt-3 inline-flex items-center gap-1 sm:gap-1.5 bg-red-900/50 text-red-400 px-2 py-1 sm:px-3 sm:py-1 rounded-full">
                          <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span className="text-[10px] sm:text-xs font-black uppercase">Featured</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              // Fallback placeholders
              [
                { icon: '☕', title: 'Personalized Mug', desc: 'With your photo & message', price: '5,000' },
                { icon: '🖼️', title: 'Custom Frame', desc: 'Your best memory, framed', price: '8,000' },
                { icon: '🎁', title: 'Surprise Box', desc: 'Multiple gifts in one', price: '12,000' }
              ].map((item, idx) => (
                <div key={idx} className="relative group transform hover:scale-105 transition-transform duration-300">
                  <div className="bg-zinc-800 rounded-3xl p-6 sm:p-8 shadow-xl border border-zinc-700 group-hover:border-red-500 group-hover:shadow-red-500/30 transition-all overflow-hidden">
                    {/* Blur overlay */}
                    <div className="absolute inset-0 backdrop-blur-xl bg-black/50 flex items-center justify-center z-10 transition-opacity group-hover:opacity-80">
                      <div className="text-center">
                        <div className="text-5xl sm:text-6xl mb-3 opacity-50 group-hover:scale-110 transition-transform text-white">
                          {item.icon}
                        </div>
                        <p className="text-[10px] sm:text-xs font-black uppercase text-zinc-400">Mystery Preview</p>
                      </div>
                    </div>
                   
                    {/* Content behind blur */}
                    <div className="relative z-0 space-y-4">
                      <div className="aspect-square bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-2xl" />
                      <h3 className="font-black uppercase text-base sm:text-lg text-white">{item.title}</h3>
                      <p className="text-xs sm:text-sm text-zinc-400 font-semibold">{item.desc}</p>
                      <p className="text-xs sm:text-sm text-red-400 font-bold">₦{item.price}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          {/* Mystery Message */}
          <div className="bg-gradient-to-r from-red-700 to-red-900 rounded-3xl p-6 sm:p-8 lg:p-12 text-center shadow-2xl shadow-red-900/50">
            <p className="text-white text-xl sm:text-2xl lg:text-3xl font-black uppercase tracking-tight mb-4">
              🎁 Unlock the Real Surprise
            </p>
            <p className="text-red-100 text-sm sm:text-base font-semibold max-w-2xl mx-auto">
              You'll get a WhatsApp alert when your gift is fully prepared and on its way.
            </p>
          </div>
          {/* CTA Section */}
          <div className="bg-zinc-800 rounded-3xl p-6 sm:p-8 lg:p-12 shadow-2xl border border-zinc-700 space-y-8 lg:space-y-10">
            <div className="text-center space-y-4">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase tracking-tight text-white">
                Pass On the Magic 💝
              </h2>
              <p className="text-base sm:text-lg text-zinc-300 font-semibold max-w-xl mx-auto">
                Create unforgettable moments for your circle. Share your link and spark joy!
              </p>
            </div>
            {/* Share Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
              <button
                onClick={shareOnWhatsApp}
                className="w-full bg-[#25D366] hover:bg-[#1FAF58] text-white py-4 sm:py-5 rounded-2xl font-black uppercase tracking-wide text-base sm:text-lg transition-all shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 flex items-center justify-center gap-2 sm:gap-3"
              >
                <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6" />
                WhatsApp Share
              </button>
              <button
                onClick={copyToClipboard}
                className="w-full bg-red-600 hover:bg-red-700 text-white py-4 sm:py-5 rounded-2xl font-black uppercase tracking-wide text-base sm:text-lg transition-all shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 flex items-center justify-center gap-2 sm:gap-3"
              >
                {copied ? (
                  <>
                    <Check className="w-5 h-5 sm:w-6 sm:h-6" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-5 h-5 sm:w-6 sm:h-6" />
                    Copy Link
                  </>
                )}
              </button>
            </div>
            <button
              onClick={() => router.push('/marketplace')}
              className="w-full max-w-2xl mx-auto bg-white hover:bg-zinc-100 text-zinc-900 py-4 sm:py-5 rounded-2xl font-black uppercase tracking-wide text-base sm:text-lg transition-all shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 flex items-center justify-center gap-2 sm:gap-3"
            >
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />
              Discover Gifts
            </button>
            {/* Shareable Link Display */}
            <div className="mt-6 p-4 bg-zinc-700 rounded-2xl border border-zinc-600">
              <p className="text-[10px] sm:text-xs font-bold uppercase text-zinc-400 mb-2 text-center">Your Secret Link</p>
              <p className="text-xs sm:text-sm font-mono text-white text-center break-all">{shareLink}</p>
            </div>
          </div>
          {/* Trust Indicators */}
          <div className="grid grid-cols-3 gap-4 sm:gap-6 max-w-2xl mx-auto">
            {[
              { icon: <Check className="w-6 h-6 sm:w-8 sm:h-8 text-red-500" />, text: 'Free Sharing' },
              { icon: <ArrowRight className="w-6 h-6 sm:w-8 sm:h-8 text-white" />, text: 'Quick Setup' },
              { icon: <Heart className="w-6 h-6 sm:w-8 sm:h-8 text-red-500" />, text: 'Heartfelt' }
            ].map((item, idx) => (
              <div key={idx} className="text-center space-y-2">
                <div className="mx-auto">{item.icon}</div>
                <p className="text-xs sm:text-sm font-bold text-zinc-300 uppercase">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  // Main Capture Page
  return (
    <div className="min-h-screen bg-zinc-900 flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      {/* Floating Elements */}
      <div className="absolute top-10 left-5 sm:left-20 animate-float" style={{ animationDelay: '0s' }}>
        <Heart className="w-6 h-6 sm:w-8 sm:h-8 text-red-600/30" fill="currentColor" />
      </div>
      <div className="absolute top-40 right-5 sm:right-20 animate-float" style={{ animationDelay: '1s' }}>
        <Gift className="w-8 h-8 sm:w-10 sm:h-10 text-red-700/30" />
      </div>
      <div className="absolute bottom-20 left-1/2 animate-float" style={{ animationDelay: '2s' }}>
        <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-red-500/30" />
      </div>
      <div className="max-w-md w-full bg-zinc-800 rounded-3xl shadow-2xl shadow-red-900/20 p-6 sm:p-8 border border-zinc-700 relative overflow-hidden">
        {/* Gradient Top Bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-600 to-red-800" />
        {/* Referral Badge */}
        {inviteInfo && (
          <div className="mb-6 text-center">
            <div className="inline-flex items-center gap-2 bg-red-900/50 px-4 py-2 sm:px-6 sm:py-3 rounded-full border border-red-700/50 shadow-sm">
              <Gift className="w-4 h-4 sm:w-5 sm:h-5 text-red-400" />
              <p className="text-xs sm:text-sm font-black uppercase text-red-300">
                {inviteInfo.inviter_name} invited you! 🎁
              </p>
            </div>
          </div>
        )}
        {/* Headline */}
        <div className="text-center mb-6 sm:mb-8 space-y-4">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-red-600 blur-3xl opacity-20 animate-pulse" />
            <div className="relative bg-gradient-to-br from-red-600 to-red-800 w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center shadow-xl shadow-red-900/50">
              <Gift className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tighter text-white leading-tight">
            A Mystery Gift<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-700">
              Awaits You 🎁
            </span>
          </h1>
          <p className="text-base sm:text-lg text-zinc-300 font-semibold">
            We craft memories into surprises. Enter your WhatsApp for a sneak peek.
          </p>
        </div>
        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
          <div>
            <label className="block text-xs sm:text-sm font-black uppercase tracking-wide text-white mb-2">
              📱 WhatsApp Number
            </label>
            <input
              type="tel"
              placeholder="e.g., 08012345678"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              className="w-full px-4 py-3 sm:px-6 sm:py-4 bg-zinc-900 border border-zinc-700 text-white rounded-2xl text-base sm:text-lg font-semibold focus:border-red-500 focus:ring-2 focus:ring-red-500/30 transition-all outline-none placeholder-zinc-500"
              required
            />
          </div>
          <div>
            <label className="block text-xs sm:text-sm font-black uppercase tracking-wide text-white mb-2">
              👤 Name (Optional)
            </label>
            <input
              type="text"
              placeholder="Your name here"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 sm:px-6 sm:py-4 bg-zinc-900 border border-zinc-700 text-white rounded-2xl text-base sm:text-lg font-semibold focus:border-red-500 focus:ring-2 focus:ring-red-500/30 transition-all outline-none placeholder-zinc-500"
            />
          </div>
          {error && (
            <div className="bg-red-900/50 border border-red-700 rounded-xl p-3 sm:p-4 text-center">
              <p className="text-xs sm:text-sm font-bold text-red-300">{error}</p>
            </div>
          )}
          <button
            type="submit"
            disabled={loading || !whatsapp}
            className="w-full bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white py-4 sm:py-5 rounded-2xl font-black uppercase tracking-wide text-base sm:text-lg transition-all shadow-lg shadow-red-900/50 hover:shadow-xl hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 sm:gap-3"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 animate-spin" />
                Revealing...
              </>
            ) : (
              <>
                <Gift className="w-5 h-5 sm:w-6 sm:h-6" />
                Unveil Gift
                <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6" />
              </>
            )}
          </button>
        </form>
        {/* Trust Signals */}
        <div className="mt-6 sm:mt-8 grid grid-cols-3 gap-3 sm:gap-4">
          {[
            { icon: '🔒', text: 'Secure' },
            { icon: '⚡', text: 'Fast' },
            { icon: '🎯', text: 'Free View' }
          ].map((item, idx) => (
            <div key={idx} className="text-center">
              <div className="text-2xl sm:text-3xl mb-1 sm:mb-2 text-red-500">{item.icon}</div>
              <p className="text-[10px] sm:text-xs font-bold text-zinc-300 uppercase">{item.text}</p>
            </div>
          ))}
        </div>
        {/* Fine Print */}
        <p className="text-[10px] sm:text-xs text-zinc-500 text-center mt-6 font-semibold">
          WhatsApp notifications for gift updates. Privacy protected - no unwanted messages.
        </p>
      </div>
      {/* Social Proof */}
      <div className="absolute bottom-4 left-0 right-0 text-center space-y-2">
        <p className="text-xs sm:text-sm text-zinc-400 font-bold">
          🔥 10,000+ gifts shared monthly
        </p>
        <div className="flex items-center justify-center gap-1 sm:gap-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-red-600 to-red-800 border-2 border-zinc-900 shadow-md -ml-2 first:ml-0" />
          ))}
          <span className="text-[10px] sm:text-xs font-black text-zinc-400 ml-2">+9,995</span>
        </div>
      </div>
    </div>
  );
}
export default function GiftRevealPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-zinc-900 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="relative w-24 h-24 mx-auto">
            <div className="absolute inset-0 bg-red-500/30 rounded-full animate-ping" />
            <div className="relative w-24 h-24 bg-gradient-to-br from-red-600 to-red-800 rounded-full flex items-center justify-center shadow-2xl shadow-red-900/50">
              <Gift className="w-12 h-12 text-white animate-bounce" />
            </div>
          </div>
          <p className="text-base sm:text-lg font-bold text-zinc-300">Loading your surprise...</p>
        </div>
      </div>
    }>
      <GiftRevealContent />
    </Suspense>
  );
}