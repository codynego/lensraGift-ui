"use client";

import { useEffect, useState, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2, CheckCircle2, XCircle, ArrowRight, ShoppingBag } from 'lucide-react';

const BaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000/";

export default function VerifyPaymentPage() {
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

    // Prevent double-calling in React Strict Mode
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
          setMessage('Payment successful! Your order is being processed.');
        } else {
          setStatus('error');
          setMessage(data.error || 'Payment verification failed.');
        }
      } catch (err) {
        setStatus('error');
        setMessage('A connection error occurred during verification.');
      }
    };

    verifyPayment();
  }, [reference]);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center space-y-8">
        
        {status === 'loading' && (
          <div className="flex flex-col items-center gap-4 animate-in fade-in zoom-in duration-500">
            <Loader2 className="w-16 h-16 text-red-600 animate-spin" />
            <h1 className="text-2xl font-black uppercase italic tracking-tighter">Securing Funds</h1>
            <p className="text-zinc-400 text-xs font-bold uppercase tracking-widest">{message}</p>
          </div>
        )}

        {status === 'success' && (
          <div className="flex flex-col items-center gap-6 animate-in scale-in duration-500">
            <div className="bg-green-50 p-6 rounded-full">
              <CheckCircle2 className="w-20 h-20 text-green-600" />
            </div>
            <h1 className="text-4xl font-black uppercase italic tracking-tighter">Order Confirmed</h1>
            <p className="text-zinc-500 text-sm font-medium">{message}</p>
            <button 
              onClick={() => router.push('/account/orders')}
              className="w-full py-4 bg-black text-white rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:bg-zinc-800 transition-all"
            >
              View My Orders <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {status === 'error' && (
          <div className="flex flex-col items-center gap-6 animate-in slide-in-from-bottom-4 duration-500">
            <div className="bg-red-50 p-6 rounded-full">
              <XCircle className="w-20 h-20 text-red-600" />
            </div>
            <h1 className="text-4xl font-black uppercase italic tracking-tighter">Payment Failed</h1>
            <p className="text-zinc-500 text-sm font-medium">{message}</p>
            <div className="flex flex-col w-full gap-3">
              <button 
                onClick={() => router.push('/checkout')}
                className="w-full py-4 bg-red-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs transition-all"
              >
                Try Again
              </button>
              <button 
                onClick={() => router.push('/')}
                className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 hover:text-black transition"
              >
                Back to Home
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}