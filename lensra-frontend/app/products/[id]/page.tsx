"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  Heart, ShoppingCart, Share2, Star, ChevronRight, 
  Check, Truck, Shield, Palette, Zap, Loader2, 
  Maximize2, ArrowLeft, Info
} from 'lucide-react';

const BaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000/";

interface ProductDetail {
  id: number;
  name: string;
  description: string;
  base_price: string;
  category: string;
  image: string | null;
  // Assuming the API might return an array of images; if not, we use the main image as the default
  gallery?: string[]; 
  printable_areas: any[];
}

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('details');
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${BaseUrl}api/products/${params.id}/`);
        if (!response.ok) throw new Error('Product not found');
        const data = await response.json();
        setProduct(data);
        setSelectedImage(data.image);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (params.id) fetchProduct();
  }, [params.id]);

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <Loader2 className="w-12 h-12 animate-spin text-red-600 mb-4" />
      <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400">Loading your canvas...</span>
    </div>
  );

  if (!product) return (
    <div className="min-h-screen flex items-center justify-center font-black uppercase tracking-tighter text-4xl">
      Item not found.
    </div>
  );

  // Mocking extra images if the gallery is empty for UI demonstration
  const galleryImages = product.gallery || [product.image, product.image, product.image].filter(Boolean) as string[];

  return (
    <div className="min-h-screen bg-white text-zinc-900 selection:bg-red-600 selection:text-white">
      
      <nav className="border-b border-zinc-100 sticky top-0 bg-white/80 backdrop-blur-md z-50">
        <div className="max-w-[1600px] mx-auto px-6 py-5 flex items-center justify-between">
          <button onClick={() => router.back()} className="group flex items-center gap-3 text-[10px] font-black uppercase tracking-widest">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Shop
          </button>
          <div className="hidden md:flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-400">
            <span>{product.category}</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-zinc-900">{product.name}</span>
          </div>
          <button className="p-2 hover:bg-zinc-50 rounded-full transition-colors"><Share2 className="w-4 h-4" /></button>
        </div>
      </nav>

      <main className="max-w-[1600px] mx-auto px-6 lg:px-12 py-12 lg:py-20">
        <div className="grid lg:grid-cols-12 gap-16 xl:gap-24">
          
          {/* 2. LEFT: REDUCED IMAGE & GALLERY */}
          <div className="lg:col-span-6 space-y-6">
            <div className="relative bg-zinc-50 rounded-[40px] overflow-hidden aspect-[4/5] border border-zinc-100 group">
              {selectedImage ? (
                <img 
                  src={selectedImage} 
                  alt={product.name} 
                  className="w-full h-full object-cover transition-all duration-700"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center font-black text-zinc-200 uppercase tracking-tighter text-6xl italic">No Preview</div>
              )}
              
              <div className="absolute top-8 left-8">
                <div className="bg-red-600 text-white text-[10px] font-black px-5 py-2 rounded-full uppercase tracking-[0.2em] shadow-xl">
                  Premium
                </div>
              </div>

              <button className="absolute bottom-8 right-8 p-4 bg-white rounded-2xl shadow-xl opacity-0 group-hover:opacity-100 transition-opacity">
                <Maximize2 className="w-5 h-5 text-zinc-900" />
              </button>
            </div>

            {/* THUMBNAILS UNDER THE MAIN IMAGE */}
            <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
              {galleryImages.map((img, idx) => (
                <button 
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`relative flex-shrink-0 w-24 h-24 rounded-2xl overflow-hidden border-2 transition-all ${
                    selectedImage === img ? 'border-red-600 scale-95 shadow-lg' : 'border-transparent hover:border-zinc-300'
                  }`}
                >
                  <img src={img} alt={`View ${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            {/* PRINT ZONES MAPPING (Lower priority) */}
            <div className="bg-zinc-900 text-white rounded-[32px] p-8 mt-12">
               <span className="text-red-500 font-bold text-[10px] uppercase tracking-[0.4em]">Customize</span>
               <h4 className="text-xl font-black italic uppercase mt-2">Printable Areas</h4>
               <div className="flex flex-wrap gap-2 mt-6">
                 {product.printable_areas.map((area) => (
                   <div key={area.id} className="flex items-center gap-3 bg-white/10 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest">
                     {area.name} <Zap className="w-3 h-3 text-red-500" />
                   </div>
                 ))}
               </div>
            </div>
          </div>

          {/* 3. RIGHT: INFO & ACTIONS */}
          <div className="lg:col-span-6 flex flex-col justify-start pt-4">
            <span className="text-red-600 font-black text-[10px] uppercase tracking-[0.5em] mb-4 block italic">Ref: #00{product.id}</span>
            <h1 className="text-5xl md:text-7xl font-black text-zinc-900 uppercase italic tracking-tighter leading-[0.85] mb-6">
              {product.name}
            </h1>
            
            <div className="flex items-center gap-8 mb-10">
              <div className="flex items-center gap-2">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 fill-zinc-900 text-zinc-900" />)}
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest border-b border-zinc-900">480 Reviews</span>
              </div>
              <div className="h-4 w-px bg-zinc-200" />
              <span className="text-emerald-500 font-black text-[10px] uppercase tracking-widest flex items-center gap-2">
                <Check className="w-3 h-3" /> Ready to Print
              </span>
            </div>

            <div className="space-y-10">
              <div className="flex items-baseline gap-4">
                <span className="text-6xl font-black text-zinc-900 tracking-tighter italic">₦{parseFloat(product.base_price).toLocaleString()}</span>
                <span className="text-zinc-300 font-bold text-[10px] uppercase tracking-widest">Start Price</span>
              </div>

              <div className="grid grid-cols-1 gap-4">
                 <button className="group relative w-full py-8 bg-zinc-900 text-white rounded-full font-black text-xs uppercase tracking-[0.4em] overflow-hidden active:scale-95 shadow-2xl">
                    <div className="absolute inset-0 bg-red-600 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                    <span className="relative z-10 flex items-center justify-center gap-4">
                      Start Designing <Palette className="w-4 h-4" />
                    </span>
                 </button>
                 
                 <div className="grid grid-cols-2 gap-4">
                    <button className="py-6 border-2 border-zinc-900 text-zinc-900 rounded-full font-black text-[10px] uppercase tracking-[0.2em] hover:bg-zinc-900 hover:text-white transition-all flex items-center justify-center gap-3">
                      <ShoppingCart className="w-4 h-4" /> Add to Cart
                    </button>
                    <button 
                      onClick={() => setIsWishlisted(!isWishlisted)}
                      className={`py-6 rounded-full border-2 transition-all flex items-center justify-center gap-3 ${
                        isWishlisted ? 'bg-red-600 border-red-600 text-white' : 'border-zinc-200 text-zinc-900'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-white' : ''}`} />
                      <span className="font-black text-[10px] uppercase tracking-[0.2em]">{isWishlisted ? 'Saved' : 'Save'}</span>
                    </button>
                 </div>
              </div>

              <div className="border-t border-zinc-100 pt-10">
                <div className="flex gap-10 mb-6">
                  {['details', 'shipping'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`text-[10px] font-black uppercase tracking-[0.3em] transition-all relative ${
                        activeTab === tab ? 'text-zinc-900' : 'text-zinc-300'
                      }`}
                    >
                      {tab}
                      {activeTab === tab && <div className="absolute -bottom-2 left-0 w-full h-1 bg-red-600" />}
                    </button>
                  ))}
                </div>
                <div className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest italic">
                  {activeTab === 'details' ? <p>{product.description}</p> : <p>Get it fast. 24h Lagos delivery. Nationwide shipping via Priority Logistics.</p>}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-zinc-100 py-12 bg-zinc-50">
        <div className="max-w-[1600px] mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-8">
           <Badge icon={<Truck className="w-5 h-5" />} title="Delivery" text="Nationwide" />
           <Badge icon={<Shield className="w-5 h-5" />} title="Security" text="Safe Pay" />
           <Badge icon={<Zap className="w-5 h-5" />} title="Fast" text="24h Turnaround" />
           <Badge icon={<Star className="w-5 h-5" />} title="Quality" text="Guaranteed" />
        </div>
      </footer>
    </div>
  );
}

function Badge({ icon, title, text }: { icon: any, title: string, text: string }) {
  return (
    <div className="flex items-center gap-4">
      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-red-600 shadow-sm">{icon}</div>
      <div>
        <h5 className="text-[9px] font-black uppercase tracking-widest text-zinc-900">{title}</h5>
        <p className="text-[8px] font-bold uppercase tracking-widest text-zinc-400">{text}</p>
      </div>
    </div>
  );
}