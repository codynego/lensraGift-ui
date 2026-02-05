"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, Clock, ArrowRight, Loader2, Search, Filter } from 'lucide-react';

const BaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.lensra.com/";

interface CategoryDetails {
  id: number;
  name: string;
  slug: string;
}

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  featured_image_url: string;
  content: string;
  created_at: string;
  is_published: boolean;
  category_details?: CategoryDetails;
}

export default function BlogPostList() {
  const router = useRouter();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<string[]>(['All']);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(`${BaseUrl}api/blog/posts/`);
        if (res.ok) {
          const data = await res.json();
          
          let postsArray: BlogPost[] = [];
          
          if (Array.isArray(data)) {
            postsArray = data;
          } else if (data.results && Array.isArray(data.results)) {
            postsArray = data.results;
          } else if (data.data && Array.isArray(data.data)) {
            postsArray = data.data;
          } else {
            console.error('Unexpected API response format:', data);
            setError('Unexpected data format from server');
            return;
          }
          
          const publishedPosts = postsArray.filter((post: BlogPost) => post.is_published);
          setPosts(publishedPosts);
          setFilteredPosts(publishedPosts);

          // Extract unique categories dynamically
          const uniqueCats = [...new Set(publishedPosts.map(post => post.category_details?.name).filter(Boolean))];
          setCategories(['All', ...uniqueCats as string[]]);
        } else {
          setError(`Failed to fetch posts: ${res.status} ${res.statusText}`);
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err instanceof Error ? err.message : 'Failed to fetch posts');
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  // Search and filter functionality
  useEffect(() => {
    let filtered = posts;

    if (searchQuery) {
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory !== 'All') {
      filtered = filtered.filter(post =>
        post.category_details?.name === selectedCategory
      );
    }

    setFilteredPosts(filtered);
  }, [searchQuery, selectedCategory, posts]);

  const getReadingTime = (content: string) => {
    const wordCount = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
    return Math.ceil(wordCount / 200);
  };

  const getExcerpt = (content: string, maxLength = 150) => {
    const text = content.replace(/<[^>]*>/g, '');
    return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50">
      <div className="text-center">
        <Loader2 className="w-12 h-12 animate-spin text-red-600 mx-auto mb-4" />
        <p className="text-xs font-bold uppercase tracking-widest text-zinc-400">Loading Stories</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50">
      <div className="text-center max-w-md px-6">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl">⚠️</span>
        </div>
        <h2 className="text-2xl font-black italic uppercase tracking-tighter text-zinc-800 mb-2">
          Oops! Something went wrong
        </h2>
        <p className="text-zinc-600 mb-6">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-8 py-4 bg-red-600 hover:bg-red-700 text-white rounded-full font-black uppercase tracking-[0.2em] text-xs transition-all"
        >
          Try Again
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-zinc-50 text-black font-sans">
      {/* HERO HEADER */}
      <header className="bg-white border-b border-zinc-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12">
          {/* Breadcrumb */}
          <nav className="mb-8">
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-400">
              Home / <span className="text-red-600">Stories</span>
            </span>
          </nav>

          {/* Main Title */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black italic uppercase tracking-tighter leading-[0.85] mb-6 max-w-4xl">
            Latest Stories
          </h1>
          <p className="text-base md:text-lg text-zinc-600 max-w-2xl leading-relaxed">
            Explore our collection of insights, trends, and perspectives on eyewear, fashion, and style.
          </p>
        </div>
      </header>

      {/* SEARCH & FILTER BAR */}
      <section className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-zinc-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search Input */}
            <div className="relative w-full md:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input
                type="search"
                placeholder="Search stories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-zinc-50 border border-zinc-200 rounded-full text-sm font-medium focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all"
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-hide">
              <Filter className="w-4 h-4 text-zinc-400 flex-shrink-0" />
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-wider whitespace-nowrap transition-all ${
                    selectedCategory === category
                      ? 'bg-red-600 text-white shadow-md'
                      : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
              {filteredPosts.length} {filteredPosts.length === 1 ? 'Story' : 'Stories'} Found
            </p>
          </div>
        </div>
      </section>

      {/* FEATURED POST (First Post - Large) */}
      {filteredPosts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="mb-8">
            <span className="inline-block px-4 py-2 bg-red-600 text-white text-[9px] font-black uppercase tracking-[0.2em] rounded-full">
              Featured Story
            </span>
          </div>
          
          <article 
            onClick={() => router.push(`/blog/${filteredPosts[0].slug}`)}
            className="group cursor-pointer bg-white rounded-3xl md:rounded-[3rem] overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.01]"
          >
            <div className="grid md:grid-cols-2 gap-0">
              {/* Image */}
              <div className="relative h-64 sm:h-80 md:h-[28rem] overflow-hidden">
                <img
                  src={filteredPosts[0].featured_image_url}
                  alt={filteredPosts[0].title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-70 group-hover:opacity-50 transition-opacity" />
              </div>

              {/* Content */}
              <div className="p-6 sm:p-8 md:p-12 flex flex-col justify-center">
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                    <Calendar className="w-3.5 h-3.5 text-red-600" />
                    {new Date(filteredPosts[0].created_at).toLocaleDateString('en-NG', { 
                      month: 'short', 
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                    <Clock className="w-3.5 h-3.5 text-red-600" />
                    {getReadingTime(filteredPosts[0].content)} Min
                  </div>
                </div>

                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black italic uppercase tracking-tighter leading-[0.9] mb-6 group-hover:text-red-600 transition-colors">
                  {filteredPosts[0].title}
                </h2>

                <p className="text-zinc-600 leading-relaxed mb-8 line-clamp-3 text-sm md:text-base">
                  {getExcerpt(filteredPosts[0].content, 200)}
                </p>

                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-red-600 group-hover:gap-4 transition-all">
                  Read Full Story <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          </article>
        </section>
      )}

      {/* POSTS GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        {filteredPosts.length > 1 ? (
          <>
            <div className="mb-12">
              <h2 className="text-3xl md:text-4xl font-black italic uppercase tracking-tighter">
                More Stories
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {filteredPosts.slice(1).map((post) => (
                <article
                  key={post.id}
                  onClick={() => router.push(`/blog/${post.slug}`)}
                  className="group cursor-pointer bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  {/* Image */}
                  <div className="relative h-48 sm:h-56 md:h-64 overflow-hidden">
                    <img
                      src={post.featured_image_url}
                      alt={post.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>

                  {/* Content */}
                  <div className="p-5 sm:p-6">
                    {/* Meta */}
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest text-zinc-400">
                        <Calendar className="w-3 h-3 text-red-600" />
                        {new Date(post.created_at).toLocaleDateString('en-NG', { 
                          month: 'short', 
                          day: 'numeric'
                        })}
                      </div>
                      <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest text-zinc-400">
                        <Clock className="w-3 h-3 text-red-600" />
                        {getReadingTime(post.content)} Min
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl md:text-2xl font-black italic uppercase tracking-tighter leading-tight mb-3 group-hover:text-red-600 transition-colors line-clamp-2">
                      {post.title}
                    </h3>

                    {/* Excerpt */}
                    <p className="text-sm text-zinc-600 leading-relaxed mb-4 line-clamp-3">
                      {getExcerpt(post.content, 150)}
                    </p>

                    {/* Read More Link */}
                    <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-red-600 group-hover:gap-3 transition-all">
                      Read More <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-20">
            <div className="mb-6">
              <Search className="w-16 h-16 text-zinc-300 mx-auto" />
            </div>
            <h3 className="text-2xl font-black italic uppercase tracking-tighter text-zinc-400 mb-2">
              No Stories Found
            </h3>
            <p className="text-zinc-500 mb-8">
              Try adjusting your search or filter criteria
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
              className="px-8 py-4 bg-red-600 hover:bg-red-700 text-white rounded-full font-black uppercase tracking-[0.2em] text-xs transition-all"
            >
              Reset Filters
            </button>
          </div>
        ) : null}
      </section>

      {/* CTA SECTION */}
      <section className="bg-zinc-950 py-20 md:py-24 px-4 sm:px-6 rounded-t-3xl md:rounded-t-[4rem] relative overflow-hidden">
        {/* Decorative Element */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-red-600/10 rounded-full blur-3xl" />
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <p className="text-red-600 text-xs font-black uppercase tracking-[0.3em] mb-4">
            Stay Updated
          </p>
          <h2 className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black italic uppercase tracking-tighter leading-tight mb-6">
            Never Miss a Story
          </h2>
          <p className="text-zinc-400 text-sm md:text-base max-w-2xl mx-auto mb-10 leading-relaxed">
            Subscribe to our newsletter and get the latest insights delivered straight to your inbox.
          </p>
          
          {/* Newsletter Form */}
          <form className="max-w-md mx-auto mb-8">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-6 py-4 bg-white/10 border border-white/20 rounded-full text-white placeholder:text-zinc-500 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
                required
              />
              <button type="submit" className="px-8 py-4 bg-red-600 hover:bg-red-700 text-white rounded-full font-black uppercase tracking-[0.2em] text-xs transition-all transform hover:scale-105 shadow-lg">
                Subscribe
              </button>
            </div>
          </form>

          {/* Or Divider */}
          <div className="flex items-center gap-4 max-w-md mx-auto mb-8">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Or</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* Shop CTA */}
          <button
            onClick={() => router.push('/marketplace')}
            className="px-10 py-5 bg-transparent border-2 border-white/20 hover:border-white/40 text-white rounded-full font-black uppercase tracking-[0.2em] text-xs transition-all hover:bg-white/5"
          >
            Explore Collection
          </button>
        </div>
      </section>
    </div>
  );
}