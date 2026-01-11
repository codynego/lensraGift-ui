"use client";

import { useState } from 'react';
import { Mail, Lock, LogIn, Eye, EyeOff, Chrome, Facebook, Apple, Zap, ShieldCheck, ChevronRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext'; 
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      await login(email, password);
      router.push('/dashboard'); 
    } catch (err: any) {
      const msg = err.response?.data?.detail || err.response?.data?.error || 'ACCESS DENIED. VERIFY CREDENTIALS.';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-zinc-900 selection:bg-red-600 selection:text-white">
      <div className="flex min-h-screen">
        
        {/* LEFT SIDE: COMMAND CENTER BRANDING */}
        <div className="hidden lg:flex lg:w-1/2 bg-zinc-900 text-white p-16 flex-col justify-between relative overflow-hidden border-r-[1px] border-zinc-800">
          {/* Subtle Grid Overlay */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
               style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 0)', backgroundSize: '40px 40px' }} />
          
          <div className="relative z-10">
            <div className="flex items-center gap-2 text-red-600 mb-16">
              <Zap className="w-6 h-6 fill-current" />
              <span className="font-bold uppercase tracking-[0.4em] text-[10px]">Lensra Studio / Auth</span>
            </div>
            
            <h2 className="text-6xl xl:text-7xl font-bold uppercase tracking-tighter leading-[0.9] mb-8">
              Terminal <br /> <span className="text-zinc-500">Access</span><span className="text-red-600">.</span>
            </h2>
            
            <p className="max-w-sm text-zinc-400 font-bold uppercase tracking-widest text-[10px] leading-relaxed border-l-2 border-red-600 pl-6">
              Authorize your session to manage active production pipelines and access the private asset archive.
            </p>
          </div>

          <div className="relative z-10 space-y-12">
            <div className="grid grid-cols-2 gap-12 border-t border-zinc-800 pt-10">
              <div>
                <div className="text-white font-bold text-lg mb-1 uppercase tracking-tighter">Encrypted</div>
                <div className="text-[9px] text-zinc-500 uppercase font-bold tracking-[0.2em]">AES-256 Standard</div>
              </div>
              <div>
                <div className="text-red-600 font-bold text-lg mb-1 uppercase tracking-tighter">Synced</div>
                <div className="text-[9px] text-zinc-500 uppercase font-bold tracking-[0.2em]">Global Database</div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE: AUTHENTICATION INTERFACE */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-16 bg-white">
          <div className="w-full max-w-md">
            {/* Mobile Branding */}
            <div className="mb-12 lg:hidden">
                <div className="flex items-center gap-2 text-red-600">
                  <Zap className="w-6 h-6 fill-current" />
                  <span className="font-bold uppercase tracking-[0.4em] text-[10px] text-zinc-900">Lensra Studio</span>
                </div>
            </div>

            <div className="mb-10">
              <h2 className="text-2xl font-bold uppercase tracking-tight text-zinc-900">Identity Verification</h2>
              <p className="text-zinc-400 text-[10px] font-bold uppercase tracking-widest mt-1">Personnel Login Required</p>
            </div>

            {/* Social Auth Terminal */}
            <div className="grid grid-cols-3 gap-3 mb-10">
              {[
                { name: 'Google', icon: <Chrome className="w-4 h-4" /> },
                { name: 'Apple', icon: <Apple className="w-4 h-4" /> },
                { name: 'Facebook', icon: <Facebook className="w-4 h-4" /> }
              ].map((provider) => (
                <button
                  key={provider.name}
                  className="flex items-center justify-center py-4 border border-zinc-200 rounded-2xl hover:bg-zinc-900 hover:text-white hover:border-zinc-900 transition-all duration-300 shadow-sm"
                >
                  {provider.icon}
                </button>
              ))}
            </div>

            <div className="relative mb-10">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-zinc-100"></div>
              </div>
              <div className="relative flex justify-center text-[9px] font-bold uppercase tracking-[0.3em]">
                <span className="bg-white px-4 text-zinc-300">Internal Credentials</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="bg-red-50 border border-red-100 p-4 text-red-600 text-[10px] font-bold uppercase tracking-widest rounded-xl flex items-center gap-3">
                  <ShieldCheck className="w-4 h-4" /> {error}
                </div>
              )}

              <div className="space-y-2">
                <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-400 ml-1">Operator Email</label>
                <div className="relative group">
                  <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-300 group-focus-within:text-red-600 transition-colors" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-14 pr-4 py-4 bg-zinc-50 border border-zinc-200 rounded-2xl focus:bg-white focus:border-red-600/30 focus:outline-none transition-all font-bold text-sm uppercase placeholder:text-zinc-200"
                    placeholder="email@lensra.com"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-400 ml-1">Security Key</label>
                <div className="relative group">
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-300 group-focus-within:text-red-600 transition-colors" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-14 pr-14 py-4 bg-zinc-50 border border-zinc-200 rounded-2xl focus:bg-white focus:border-red-600/30 focus:outline-none transition-all font-bold text-sm"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-zinc-300 hover:text-zinc-900 transition"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between px-1 pb-2">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <div className="relative flex items-center justify-center">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="peer appearance-none w-4 h-4 border border-zinc-200 rounded checked:bg-zinc-900 checked:border-zinc-900 transition-all cursor-pointer"
                    />
                    <Check className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" />
                  </div>
                  <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-400 group-hover:text-zinc-900 transition">Persistent Session</span>
                </label>
                <a href="/forgot-password" className="text-[9px] font-bold uppercase tracking-widest text-red-600 hover:underline">
                  Key Recovery
                </a>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-5 bg-zinc-900 text-white rounded-2xl font-bold uppercase tracking-[0.3em] text-[10px] hover:bg-red-600 transition-all shadow-xl shadow-zinc-200 flex items-center justify-center gap-3 disabled:bg-zinc-200"
              >
                {isLoading ? (
                  <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <LogIn className="w-3.5 h-3.5" />
                    Authorize Access
                  </>
                )}
              </button>
            </form>

            <div className="mt-12 text-center">
              <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-400">
                New to the Studio?{' '}
                <a href="/signup" className="text-red-600 hover:underline inline-flex items-center gap-1">
                  Create Account <ChevronRight className="w-3 h-3" />
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER SECURITY BADGE */}
      <div className="fixed bottom-8 left-8 hidden lg:flex items-center gap-2 text-zinc-600">
        <ShieldCheck className="w-4 h-4 text-red-600" />
        <span className="text-[8px] font-bold uppercase tracking-[0.3em]">System Status: Secured Session</span>
      </div>
    </div>
  );
}

// Simple internal component for the checkbox checkmark
function Check(props: any) {
  return (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4} {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}