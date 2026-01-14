"use client";

import { useEffect, useState, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2, CheckCircle2, XCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const BaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000/";

export default function VerifyPaymentPage() {
  const { token } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const reference = searchParams.get('reference');
  
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Verifying your transaction...');
  const verifyStarted = useRef(false);

  useEffect(() => {
    const verifyPayment = async () => {
      if (!reference || !token || verifyStarted.current) return;
      
      verifyStarted.current = true;
      try {
        const res = await fetch(`${BaseUrl}api/payments/verify/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ reference })
        });

        const data = await res.json();

        if (res.ok) {
          setStatus('success');
          setMessage('Payment Confirmed! Your order is now being processed.');
        } else {
          setStatus('error');
          setMessage(data.error || 'Verification failed. Please contact support.');
        }
      } catch (err) {
        setStatus('error');
        setMessage('A connection error occurred during verification.');
      }
    };

    verifyPayment();
  }, [reference, token]);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center space-y-8">
        {status === 'loading' && (
          <div className="space-y-6 animate-pulse">
            <div className="flex justify-center">
              <Loader2 className="w-16 h-16 text-red-600 animate-spin" />
            </div>
            <h1 className="text-2xl font-black uppercase italic tracking-tighter">
              Securing Payment
            </h1>
            <p className="text-zinc-400 text-xs font-bold uppercase tracking-widest leading-relaxed">
              Please do not refresh or close this window. We are confirming your transaction with Paystack.
            </p>
          </div>
        )}

        {status === 'success' && (
          <div className="space-y-6 animate-in zoom-in duration-500">
            <div className="flex justify-center">
              <CheckCircle2 className="w-20 h-20 text-green-500" />
            </div>
            <h1 className="text-4xl font-black uppercase italic tracking-tighter">
              Success
            </h1>
            <p className="text-zinc-500 font-bold uppercase text-[10px] tracking-[0.2em]">
              {message}
            </p>
            <button 
              onClick={() => router.push('/profile/orders')}
              className="w-full py-5 bg-black text-white rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-3 hover:bg-zinc-800 transition-all"
            >
              View My Orders <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {status === 'error' && (
          <div className="space-y-6 animate-in shake duration-500">
            <div className="flex justify-center">
              <XCircle className="w-20 h-20 text-red-600" />
            </div>
            <h1 className="text-4xl font-black uppercase italic tracking-tighter">
              Failed
            </h1>
            <p className="text-zinc-500 font-bold uppercase text-[10px] tracking-[0.2em]">
              {message}
            </p>
            <div className="flex flex-col gap-3">
              <button 
                onClick={() => router.push('/checkout')}
                className="w-full py-5 bg-red-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest"
              >
                Try Again
              </button>
              <button 
                onClick={() => router.push('/')}
                className="text-zinc-400 font-bold uppercase text-[9px] tracking-widest hover:text-black"
              >
                Return Home
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}