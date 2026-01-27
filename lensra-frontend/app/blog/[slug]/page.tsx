"use client";
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Calendar, User, Share2, Loader2, Clock } from 'lucide-react';

const BaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.lensra.com/";

export default function BlogPostDetail() {
  const { slug } = useParams();
  const router = useRouter();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [readingTime, setReadingTime] = useState(0);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`${BaseUrl}api/blog/posts/${slug}/`);
        if (res.ok) {
          const data = await res.json();
          setPost(data);
          // Calculate reading time (average 200 words per minute)
          const wordCount = data.content.replace(/<[^>]*>/g, '').split(/\s+/).length;
          setReadingTime(Math.ceil(wordCount / 200));
        } else {
          router.push('/blog');
        }
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    if (slug) fetchPost();
  }, [slug]);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50">
      <div className="text-center">
        <Loader2 className="w-12 h-12 animate-spin text-red-600 mx-auto mb-4" />
        <p className="text-xs font-bold uppercase tracking-widest text-zinc-400">Loading Story</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-zinc-50 text-black font-sans">
      {/* NAVIGATION BAR */}
      <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-b border-zinc-100 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest hover:text-red-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <button 
            onClick={handleShare}
            className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest hover:text-red-600 transition-colors"
          >
            <Share2 className="w-4 h-4" /> Share
          </button>
        </div>
      </nav>

      {/* HERO SECTION */}
      <div className="pt-24 pb-12">
        <div className="max-w-5xl mx-auto px-6">
          {/* Category Badge */}
          <div className="mb-8">
            <span className="inline-block px-4 py-2 bg-red-600 text-white text-[9px] font-black uppercase tracking-[0.2em] rounded-full">
              Editorial
            </span>
          </div>

          {/* Title */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black italic uppercase tracking-tighter leading-[0.9] mb-10 max-w-4xl">
            {post.title}
          </h1>

          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-6 pb-8 border-b border-zinc-200">
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
              <Calendar className="w-3.5 h-3.5 text-red-600" />
              {new Date(post.created_at).toLocaleDateString('en-NG', { 
                year: 'numeric',
                month: 'short', 
                day: 'numeric' 
              })}
            </div>
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
              <User className="w-3.5 h-3.5 text-red-600" />
              Lensra Editorial
            </div>
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
              <Clock className="w-3.5 h-3.5 text-red-600" />
              {readingTime} Min Read
            </div>
          </div>
        </div>
      </div>

      {/* FEATURED IMAGE */}
      <div className="max-w-7xl mx-auto px-6 mb-20">
        <div className="relative overflow-hidden rounded-[32px] md:rounded-[48px] shadow-2xl">
          <img
            src={post.featured_image}
            alt={post.title}
            className="w-full h-[50vh] md:h-[70vh] object-cover"
          />
          {/* Gradient Overlay for depth */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none" />
        </div>
      </div>

      {/* CONTENT AREA */}
      <main className="bg-white">
        <div className="max-w-4xl mx-auto px-6 py-20">
          {/* Drop Cap Effect & Enhanced Typography */}
          <div
            className="prose prose-lg lg:prose-xl prose-red max-w-none
            prose-headings:font-black prose-headings:italic prose-headings:uppercase prose-headings:tracking-tighter prose-headings:mb-6 prose-headings:mt-12
            prose-h2:text-4xl prose-h3:text-3xl prose-h4:text-2xl
            prose-p:text-zinc-700 prose-p:leading-relaxed prose-p:mb-6
            prose-strong:text-black prose-strong:font-black
            prose-a:text-red-600 prose-a:font-bold prose-a:no-underline hover:prose-a:underline
            prose-blockquote:border-l-4 prose-blockquote:border-red-600 prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:text-zinc-600 prose-blockquote:font-medium
            prose-img:rounded-[24px] prose-img:shadow-xl prose-img:my-12
            prose-ul:list-disc prose-ul:pl-6 prose-ol:list-decimal prose-ol:pl-6
            prose-li:text-zinc-700 prose-li:mb-2
            first-letter:text-7xl first-letter:font-black first-letter:float-left first-letter:mr-3 first-letter:leading-none first-letter:text-red-600"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>
      </main>

      {/* DIVIDER */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="border-t-2 border-zinc-200" />
      </div>

      {/* RELATED TAGS / KEYWORDS (Optional Enhancement) */}
      <div className="max-w-4xl mx-auto px-6 pb-20">
        <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400 mb-4">
          Topics
        </h3>
        <div className="flex flex-wrap gap-3">
          {['Fashion', 'Eyewear', 'Style Guide', 'Editorial'].map((tag) => (
            <span 
              key={tag}
              className="px-4 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-[10px] font-bold uppercase tracking-wider rounded-full transition-colors cursor-pointer"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* FOOTER CTA */}
      <footer className="bg-zinc-950 py-24 px-6 rounded-t-[48px] md:rounded-t-[64px] relative overflow-hidden">
        {/* Decorative Element */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl" />
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <p className="text-red-600 text-xs font-black uppercase tracking-[0.3em] mb-4">
            Ready to Elevate Your Style?
          </p>
          <h2 className="text-white text-4xl md:text-5xl lg:text-6xl font-black italic uppercase tracking-tighter leading-tight mb-6">
            Inspired by this story?
          </h2>
          <p className="text-zinc-400 text-sm md:text-base max-w-2xl mx-auto mb-10 leading-relaxed">
            Discover our curated collection of premium eyewear designed to make you look and feel exceptional.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => router.push('/shop')}
              className="px-10 py-5 bg-red-600 hover:bg-red-700 text-white rounded-full font-black uppercase tracking-[0.2em] text-xs transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Explore Collection
            </button>
            <button
              onClick={() => router.push('/blog')}
              className="px-10 py-5 bg-transparent border-2 border-white/20 hover:border-white/40 text-white rounded-full font-black uppercase tracking-[0.2em] text-xs transition-all"
            >
              More Stories
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}