"use client"
import { useState } from 'react';
import { Mail, Lock, LogIn, Eye, EyeOff, Chrome, Facebook, Apple } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ email, password, rememberMe });
    alert('Logged in successfully! (Simulation)');
    setEmail('');
    setPassword('');
  };

  const handleSocialLogin = (provider: string) => {
    alert(`Logging in with ${provider}... (Simulation)`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      
      <div className="min-h-screen flex items-center justify-center px-4 py-12">
        <div className="max-w-6xl w-full grid lg:grid-cols-2 gap-8 items-center">
          
          {/* Left Side - Branding */}
          <div className="hidden lg:block space-y-6">
            <div className="space-y-4">
              <div className="text-6xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Lensra
              </div>
              <h2 className="text-4xl font-bold text-gray-800">
                Welcome Back!
              </h2>
              <p className="text-xl text-gray-600">
                Sign in to access your designs, wishlist, and orders
              </p>
            </div>

            <div className="space-y-4 pt-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-2xl">
                  🎨
                </div>
                <div>
                  <div className="font-semibold text-gray-800">Create Custom Designs</div>
                  <div className="text-sm text-gray-600">Design unique products with our editor</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center text-2xl">
                  💖
                </div>
                <div>
                  <div className="font-semibold text-gray-800">Save Your Favorites</div>
                  <div className="text-sm text-gray-600">Build wishlists and track your orders</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-2xl">
                  ⚡
                </div>
                <div>
                  <div className="font-semibold text-gray-800">Fast Checkout</div>
                  <div className="text-sm text-gray-600">Quick ordering with saved info</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Sign In</h1>
              <p className="text-gray-600">Enter your credentials to access your account</p>
            </div>

            {/* Social Login Buttons */}
            <div className="space-y-3 mb-8">
              <button
                onClick={() => handleSocialLogin('Google')}
                className="w-full py-3 px-4 border-2 border-gray-200 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition flex items-center justify-center gap-3"
              >
                <Chrome className="w-5 h-5 text-red-500" />
                Continue with Google
              </button>
              <button
                onClick={() => handleSocialLogin('Facebook')}
                className="w-full py-3 px-4 border-2 border-gray-200 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition flex items-center justify-center gap-3"
              >
                <Facebook className="w-5 h-5 text-blue-600" />
                Continue with Facebook
              </button>
              <button
                onClick={() => handleSocialLogin('Apple')}
                className="w-full py-3 px-4 border-2 border-gray-200 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition flex items-center justify-center gap-3"
              >
                <Apple className="w-5 h-5" />
                Continue with Apple
              </button>
            </div>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">Or continue with email</span>
              </div>
            </div>

            {/* Email/Password Form */}
            <div className="space-y-5">
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-12 pr-12 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 text-purple-600 rounded cursor-pointer"
                  />
                  <span className="text-sm text-gray-600">Remember me</span>
                </label>
                <a href="/forgot-password" className="text-sm text-purple-600 font-semibold hover:underline">
                  Forgot password?
                </a>
              </div>

              <button
                onClick={handleSubmit}
                className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-bold text-lg hover:shadow-xl transition flex items-center justify-center gap-2"
              >
                <LogIn className="w-5 h-5" />
                Sign In
              </button>

              <div className="text-center text-sm text-gray-600">
                Don't have an account?{' '}
                <a href="/signup" className="text-purple-600 font-semibold hover:underline">
                  Sign up for free
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trust Indicators */}
      <section className="py-12 bg-white border-t">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl mb-2">🔒</div>
              <div className="font-semibold text-gray-800">Secure Login</div>
              <div className="text-sm text-gray-600">256-bit encryption</div>
            </div>
            <div>
              <div className="text-3xl mb-2">⚡</div>
              <div className="font-semibold text-gray-800">Fast Access</div>
              <div className="text-sm text-gray-600">Quick sign-in options</div>
            </div>
            <div>
              <div className="text-3xl mb-2">💾</div>
              <div className="font-semibold text-gray-800">Auto-Save</div>
              <div className="text-sm text-gray-600">Designs saved to cloud</div>
            </div>
            <div>
              <div className="text-3xl mb-2">🎁</div>
              <div className="font-semibold text-gray-800">Member Perks</div>
              <div className="text-sm text-gray-600">Exclusive discounts</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}