"use client";

import { useEffect, useState, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2, CheckCircle2, XCircle, ArrowRight } from 'lucide-react';

const BaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.lensra.com/";

// 1. Move logic into an internal component
function VerifyPaymentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const reference = searchParams.get('reference');
  
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Verifying your payment...');
  const verifyStarted = useRef(false);

  useEffect(() => {
    if (!reference) {
      setStatus('error');
      setMessage('No payment reference found.');
      return;
    }

    if (verifyStarted.current) return;
    verifyStarted.current = true;

    const verifyPayment = async () => {
      try {
        const res = await fetch(`${BaseUrl}api/payments/verify/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ reference })
        });

        const data = await res.json();

        if (res.ok) {
          setStatus('success');
          setMessage('Funds secured successfully. Your order is now in production.');
        } else {
          setStatus('error');
          setMessage(data.error || 'Payment verification failed.');
        }
      } catch (err) {
        setStatus('error');
        setMessage('A connection error occurred. Please contact support if you were debited.');
      }
    };

    verifyPayment();
  }, [reference]);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center space-y-8">
        
        {/* LOADING STATE */}
        {status === 'loading' && (
          <div className="flex flex-col items-center gap-6 animate-in fade-in zoom-in duration-700">
            <div className="relative">
              <Loader2 className="w-20 h-20 text-red-600 animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-2 h-2 bg-red-600 rounded-full animate-ping" />
              </div>
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl md:text-4xl font-black uppercase italic tracking-tighter">
                Securing <span className="text-red-600">Funds</span>
              </h2>
              <p className="text-zinc-400 text-[10px] font-bold uppercase tracking-[0.3em]">{message}</p>
            </div>
          </div>
        )}

        {/* SUCCESS STATE */}
        {status === 'success' && (
          <div className="flex flex-col items-center gap-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="bg-zinc-950 p-8 rounded-[40px] shadow-2xl relative overflow-hidden group w-full">
              <CheckCircle2 className="w-16 h-16 text-red-600 mx-auto mb-6 relative z-10" />
              <div className="relative z-10 space-y-4">
                <h2 className="text-4xl font-black uppercase italic tracking-tighter text-white">
                  Payment <br /> <span className="text-red-600">Verified</span>
                </h2>
                <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest leading-relaxed">
                  {message}
                </p>
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/10 blur-[60px] rounded-full" />
            </div>

            <button 
              onClick={() => router.push('/account/orders')}
              className="w-full py-6 bg-black text-white rounded-3xl font-black uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-3 hover:bg-red-600 transition-all shadow-xl"
            >
              Track Your Order <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* ERROR STATE */}
        {status === 'error' && (
          <div className="flex flex-col items-center gap-8 animate-in fade-in slide-in-from-top-8 duration-700">
            <div className="bg-red-50 p-8 rounded-[40px] w-full border border-red-100">
              <XCircle className="w-16 h-16 text-red-600 mx-auto mb-6" />
              <h2 className="text-3xl font-black uppercase italic tracking-tighter text-zinc-900">
                Process <span className="text-red-600">Halted</span>
              </h2>
              <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mt-4 leading-relaxed">
                {message}
              </p>
            </div>
            
            <div className="flex flex-col w-full gap-4">
              <button 
                onClick={() => router.push('/checkout')}
                className="w-full py-6 bg-red-600 text-white rounded-3xl font-black uppercase tracking-[0.2em] text-[10px] transition-all hover:bg-black"
              >
                Attempt Repayment
              </button>
              <button 
                onClick={() => router.push('/')}
                className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 hover:text-red-600 transition"
              >
                Return to Shop
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// 2. Export the Page with a Suspense Boundary
export default function VerifyPaymentPage() {
  return (
    <Suspense 
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-white">
          <Loader2 className="w-10 h-10 animate-spin text-red-600" />
        </div>
      }
    >
      <VerifyPaymentContent />
    </Suspense>
  );
}