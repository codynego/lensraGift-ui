"use client";

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black px-6 text-center">
      {/* Large Stylized 404 */}
      <h1 className="text-[12rem] font-black text-zinc-900 leading-none select-none italic uppercase tracking-tighter relative">
        404
        <span className="absolute inset-0 flex items-center justify-center text-4xl text-white italic tracking-normal">
          Lost in <span className="text-[#dc2626] ml-2">Transit</span>
        </span>
      </h1>

      <div className="max-w-md mt-8">
        <h2 className="text-2xl font-bold text-white uppercase tracking-tight mb-4">
          Oops! This gift isn't wrapped yet.
        </h2>
        <p className="text-zinc-400 mb-8 leading-relaxed">
          The page you're looking for has moved, expired, or was never personalized in the first place. 
          Let’s get you back to the shop.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="px-8 py-3 bg-[#dc2626] text-white font-bold uppercase tracking-widest hover:bg-red-700 transition-all rounded-sm"
          >
            Back to Home
          </Link>
          <Link
            href="/shop"
            className="px-8 py-3 border border-zinc-800 text-white font-bold uppercase tracking-widest hover:bg-zinc-900 transition-all rounded-sm"
          >
            Browse Gifts
          </Link>
        </div>
      </div>

      {/* Subtle Brand Touch */}
      <p className="mt-16 text-zinc-600 text-xs uppercase tracking-[0.2em]">
        Lensra Gift Shop — Est. 2026
      </p>
    </div>
  );
}