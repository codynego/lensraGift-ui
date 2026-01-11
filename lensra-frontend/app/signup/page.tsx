"use client";

import { useState } from 'react';
import { Mail, Lock, User, Phone, UserPlus, Eye, EyeOff, Chrome, Facebook, Apple, Zap, CheckCircle, ShieldCheck, ChevronRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  
  const [error, setError] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { register } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== passwordConfirm) {
      setError({ password: ["Credentials mismatch: Passwords do not correlate."] });
      return;
    }
    if (!agreeToTerms) {
      setError({ non_field_errors: ["Policy acknowledgment required for initialization."] });
      return;
    }

    setIsLoading(true);
    try {
      await register({
        first_name: firstName,
        last_name: lastName,
        email,
        phone_number: phoneNumber,
        password,
        password_confirm: passwordConfirm,
      });
      router.push('/dashboard'); 
    } catch (err: any) {
      setError(err.response?.data || { non_field_errors: ["System error during initialization."] });
    } finally {
      setIsLoading(false);
    }
  };

  const passwordStrength = () => {
    if (!password) return { strength: 0, text: '', color: 'bg-zinc-100' };
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z\d]/.test(password)) strength++;

    const levels = [
      { strength: 0, text: '', color: 'bg-zinc-100' },
      { strength: 1, text: 'VULNERABLE', color: 'bg-red-500' },
      { strength: 2, text: 'BASIC', color: 'bg-orange-500' },
      { strength: 3, text: 'SECURE', color: 'bg-zinc-900' },
      { strength: 4, text: 'ENCRYPTED', color: 'bg-green-600' }
    ];
    return levels[strength];
  };

  const renderError = (field: string) => {
    if (error && error[field]) {
      return <p className="text-red-600 text-[9px] font-bold uppercase tracking-widest mt-2 ml-1 italic">{error[field][0]}</p>;
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-white text-zinc-900 selection:bg-red-600 selection:text-white">
      <div className="flex min-h-screen">
        
        {/* LEFT SIDE: CREATOR BRANDING */}
        <div className="hidden lg:flex lg:w-1/3 bg-zinc-900 text-white p-12 flex-col justify-between relative overflow-hidden border-r-[1px] border-zinc-800">
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
               style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 0)', backgroundSize: '30px 30px' }} />
          
          <div className="relative z-10">
            <div className="flex items-center gap-2 text-red-600 mb-16">
              <Zap className="w-6 h-6 fill-current" />
              <span className="font-bold uppercase tracking-[0.4em] text-[10px]">Lensra / Registry</span>
            </div>
            <h2 className="text-6xl font-bold uppercase tracking-tighter leading-[0.9] mb-8">
              Initialize <br /> <span className="text-zinc-500">Creator</span><span className="text-red-600">.</span>
            </h2>
            <p className="max-w-xs text-zinc-400 font-bold uppercase tracking-widest text-[9px] leading-relaxed border-l-2 border-red-600 pl-6">
              Join the elite archive. Access cloud-based design suites and global distribution networks.
            </p>
          </div>

          <div className="relative z-10 space-y-6">
            {['Cloud Design Archive', 'Real-time Telemetry', 'Production Pipeline'].map((feature) => (
              <div key={feature} className="flex items-center gap-4 group">
                <div className="w-1.5 h-1.5 bg-red-600 rounded-full" />
                <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-zinc-500 group-hover:text-white transition-colors">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT SIDE: REGISTRATION INTERFACE */}
        <div className="w-full lg:w-2/3 flex items-center justify-center p-8 md:p-16 bg-white overflow-y-auto">
          <div className="w-full max-w-2xl">
            <div className="mb-12">
              <h1 className="text-2xl font-bold uppercase tracking-tight text-zinc-900">Creator Registration</h1>
              <p className="text-zinc-400 text-[10px] font-bold uppercase tracking-widest mt-1">Personnel Onboarding Protocol</p>
            </div>

            {error?.non_field_errors && (
              <div className="mb-8 p-4 bg-red-50 border border-red-100 text-red-600 text-[10px] font-bold uppercase tracking-widest rounded-xl flex items-center gap-3">
                <ShieldCheck className="w-4 h-4" /> {error.non_field_errors[0]}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Row */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-400 ml-1">Legal First Name</label>
                  <div className="relative group">
                    <User className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-300 group-focus-within:text-red-600 transition-colors" />
                    <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="w-full pl-14 pr-4 py-4 bg-zinc-50 border border-zinc-200 rounded-2xl focus:bg-white focus:border-red-600/30 focus:outline-none transition-all font-bold text-sm uppercase" placeholder="First Name" required />
                  </div>
                  {renderError('first_name')}
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-400 ml-1">Legal Last Name</label>
                  <div className="relative group">
                    <User className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-300 group-focus-within:text-red-600 transition-colors" />
                    <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} className="w-full pl-14 pr-4 py-4 bg-zinc-50 border border-zinc-200 rounded-2xl focus:bg-white focus:border-red-600/30 focus:outline-none transition-all font-bold text-sm uppercase" placeholder="Last Name" required />
                  </div>
                  {renderError('last_name')}
                </div>
              </div>

              {/* Contact Row */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-400 ml-1">Communication Email</label>
                  <div className="relative group">
                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-300 group-focus-within:text-red-600 transition-colors" />
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full pl-14 pr-4 py-4 bg-zinc-50 border border-zinc-200 rounded-2xl focus:bg-white focus:border-red-600/30 focus:outline-none transition-all font-bold text-sm uppercase" placeholder="email@lensra.com" required />
                  </div>
                  {renderError('email')}
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-400 ml-1">Phone Protocol</label>
                  <div className="relative group">
                    <Phone className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-300 group-focus-within:text-red-600 transition-colors" />
                    <input type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} className="w-full pl-14 pr-4 py-4 bg-zinc-50 border border-zinc-200 rounded-2xl focus:bg-white focus:border-red-600/30 focus:outline-none transition-all font-bold text-sm" placeholder="+234 ..." required />
                  </div>
                  {renderError('phone_number')}
                </div>
              </div>

              {/* Security Row */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-400 ml-1">Encryption Key</label>
                  <div className="relative group">
                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-300 group-focus-within:text-red-600 transition-colors" />
                    <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full pl-14 pr-14 py-4 bg-zinc-50 border border-zinc-200 rounded-2xl focus:bg-white focus:border-red-600/30 focus:outline-none transition-all font-bold text-sm" placeholder="••••••••" required />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-5 top-1/2 -translate-y-1/2 text-zinc-300 hover:text-zinc-900 transition">{showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button>
                  </div>
                  <div className="flex items-center gap-1.5 mt-3 px-1">
                    {[1, 2, 3, 4].map((step) => (
                      <div key={step} className={`h-1 flex-1 rounded-full transition-all duration-700 ${step <= passwordStrength().strength ? passwordStrength().color : 'bg-zinc-100'}`} />
                    ))}
                    <span className="text-[8px] font-bold ml-2 text-zinc-400 tracking-widest">{passwordStrength().text}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-400 ml-1">Confirm Key</label>
                  <div className="relative group">
                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-300 group-focus-within:text-red-600 transition-colors" />
                    <input type={showPasswordConfirm ? 'text' : 'password'} value={passwordConfirm} onChange={(e) => setPasswordConfirm(e.target.value)} className={`w-full pl-14 pr-14 py-4 bg-zinc-50 border border-zinc-200 rounded-2xl focus:bg-white focus:border-red-600/30 focus:outline-none transition-all font-bold text-sm ${passwordConfirm && (password === passwordConfirm ? 'border-green-500/30' : 'border-red-500/30')}`} placeholder="••••••••" required />
                    <button type="button" onClick={() => setShowPasswordConfirm(!showPasswordConfirm)} className="absolute right-5 top-1/2 -translate-y-1/2 text-zinc-300 hover:text-zinc-900 transition">{showPasswordConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button>
                  </div>
                  {renderError('password_confirm')}
                </div>
              </div>

              <div className="pt-4">
                <label className="flex items-start gap-4 cursor-pointer group">
                  <div className="relative flex items-center justify-center mt-0.5">
                    <input type="checkbox" checked={agreeToTerms} onChange={(e) => setAgreeToTerms(e.target.checked)} className="peer appearance-none w-4 h-4 border border-zinc-200 rounded checked:bg-zinc-900 checked:border-zinc-900 transition-all cursor-pointer" />
                    <CheckCircle className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" />
                  </div>
                  <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-400 group-hover:text-zinc-900 transition leading-relaxed">
                    I acknowledge the Lensra Studio <a href="#" className="text-red-600 hover:underline">Terms of Protocol</a> and <a href="#" className="text-red-600 hover:underline">Privacy Policy</a>
                  </span>
                </label>
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
                    <UserPlus className="w-3.5 h-3.5" />
                    Initialize Account
                  </>
                )}
              </button>
            </form>

            <div className="mt-12 text-center border-t border-zinc-50 pt-10">
              <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-400">
                Authorized personnel? <a href="/login" className="text-red-600 hover:underline inline-flex items-center gap-1">Access Vault <ChevronRight className="w-3 h-3" /></a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}