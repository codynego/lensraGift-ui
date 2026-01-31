import React, { useState } from 'react';
import { Mail, Loader2, CheckCircle2 } from 'lucide-react';

interface SubscribeProps {
  source: 'first_gift_popup' | 'checkout' | 'gift_reminder';
}

const LensraSubscribe: React.FC<SubscribeProps> = ({ source }) => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setMessage('');

    try {
      const response = await fetch('https://api.lensra.com/api/users/subscribe/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, source }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setMessage("Welcome to the inner circle! ✨");
        setEmail('');
      } else {
        setStatus('error');
        // This captures our custom "Already part of the inner circle" message
        setMessage(data.email ? data.email[0] : "Something went wrong. Try again?");
      }
    } catch (err) {
      setStatus('error');
      setMessage("Connection lost. Please try again.");
    }
  };

  if (status === 'success') {
    return (
      <div className="flex flex-col items-center justify-center p-6 bg-zinc-900 border border-zinc-800 rounded-xl animate-in fade-in zoom-in duration-300">
        <CheckCircle2 className="w-12 h-12 text-red-600 mb-2" />
        <h3 className="text-xl font-semibold text-white">You're in!</h3>
        <p className="text-zinc-400 text-center text-sm">{message}</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md p-1 bg-gradient-to-r from-red-600/20 to-transparent rounded-2xl">
      <div className="bg-zinc-950 p-6 rounded-[14px] border border-zinc-800">
        <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
          <Mail className="w-5 h-5 text-red-600" />
          Join the Lensra List
        </h3>
        <p className="text-sm text-zinc-400 mb-4">
          Get exclusive gifting tips and 10% off your first order.
        </p>

        <form onSubmit={handleSubscribe} className="space-y-3">
          <div className="relative">
            <input
              type="email"
              required
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 transition-all placeholder:text-zinc-600"
            />
          </div>

          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full bg-red-600 hover:bg-red-700 disabled:bg-zinc-800 text-white font-bold py-3 rounded-lg transition-all flex items-center justify-center gap-2"
          >
            {status === 'loading' ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              'Subscribe'
            )}
          </button>
        </form>

        {status === 'error' && (
          <p className="mt-3 text-xs text-red-500 animate-pulse">{message}</p>
        )}
      </div>
    </div>
  );
};

export default LensraSubscribe;