"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  Heart, Share2, Star, ChevronRight, 
  Check, Palette, Loader2, 
  ArrowLeft, ShoppingBag
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const BaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000/";

interface ProductDetail {
  id: number;
  name: string;
  description: string;
  base_price: string;
  category_name: string;
  image: string | null;
  gallery?: string[]; 
  printable_areas: any[];
}

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { token } = useAuth();
  
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
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
        
        const localWish = JSON.parse(localStorage.getItem('wishlist') ?? '[]');
        setIsWishlisted(localWish.some((item: any) => item.id === data.id));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (params.id) fetchProduct();
  }, [params.id]);

  const refreshNavbar = () => {
    window.dispatchEvent(new Event('storage'));
  };

  const handleAddToCart = async () => {
    if (!product) return;
    setIsAdding(true);

    // Use native Web Crypto API instead of uuid package
    let sessionId = localStorage.getItem('guest_session_id');
    if (!sessionId) {
      sessionId = crypto.randomUUID();
      localStorage.setItem('guest_session_id', sessionId);
    }

    try {
      const res = await fetch(`${BaseUrl}api/orders/cart/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify({ 
          product: product.id, 
          quantity: 1,
          ...(!token && { session_id: sessionId })
        })
      });

      if (res.ok) {
        const localCart = JSON.parse(localStorage.getItem('cart') ?? '[]');
        const existingIdx = localCart.findIndex((item: any) => item.product_id === product.id && !item.placement);
        
        if (existingIdx > -1) {
          localCart[existingIdx].quantity += 1;
        } else {
          localCart.push({
            product_id: product.id,
            quantity: 1,
            name: product.name,
            price: product.base_price,
            image: product.image
          });
        }
        localStorage.setItem('cart', JSON.stringify(localCart));
        
        setShowSuccessModal(true);
        refreshNavbar();
      } else {
        const errorData = await res.json();
        console.error("Cart Logic Error:", errorData);
      }
    } catch (err) {
      console.error("Network Error:", err);
    } finally {
      setIsAdding(false);
    }
  };

  const handleSaveProduct = () => {
    if (!product) return;
    const wishlist = JSON.parse(localStorage.getItem('wishlist') ?? '[]');
    const isAlreadySaved = wishlist.some((item: any) => item.id === product.id);
    
    let updatedWishlist;
    if (isAlreadySaved) {
      updatedWishlist = wishlist.filter((item: any) => item.id !== product.id);
      setIsWishlisted(false);
    } else {
      updatedWishlist = [...wishlist, { 
        id: product.id, 
        name: product.name, 
        image: product.image, 
        price: product.base_price 
      }];
      setIsWishlisted(true);
    }
    localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
    refreshNavbar();
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <Loader2 className="w-12 h-12 animate-spin text-red-600 mb-4" />
      <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400">Loading details...</span>
    </div>
  );

  if (!product) return <div className="min-h-screen flex items-center justify-center font-black uppercase text-4xl italic">Item not found.</div>;

  const galleryImages = product.gallery || [product.image].filter(Boolean) as string[];

  return (
    <div className="min-h-screen bg-white text-zinc-900 font-sans">
      {showSuccessModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-6">
          <div className="absolute inset-0 bg-zinc-900/90 backdrop-blur-md" onClick={() => setShowSuccessModal(false)} />
          <div className="relative bg-white rounded-[40px] p-10 max-w-sm w-full text-center shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-black uppercase italic tracking-tighter mb-2">Added to Bag</h3>
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-8">{product.name} is ready.</p>
            <div className="space-y-3">
              <button onClick={() => router.push('/cart')} className="w-full py-5 bg-zinc-900 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-3">
                View Cart <ChevronRight className="w-4 h-4" />
              </button>
              <button onClick={() => setShowSuccessModal(false)} className="w-full py-5 bg-zinc-100 text-zinc-500 rounded-2xl font-black uppercase tracking-widest text-[10px]">
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      )}

      <nav className="border-b border-zinc-100 sticky top-0 bg-white/80 backdrop-blur-md z-50">
        <div className="max-w-[1600px] mx-auto px-6 py-5 flex items-center justify-between">
          <button onClick={() => router.back()} className="group flex items-center gap-3 text-[10px] font-black uppercase tracking-widest">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Shop
          </button>
          <div className="hidden md:flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-400">
            <span>{product.category_name}</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-zinc-900">{product.name}</span>
          </div>
          <button className="p-2 hover:bg-zinc-50 rounded-full transition-colors"><Share2 className="w-4 h-4" /></button>
        </div>
      </nav>

      <main className="max-w-[1600px] mx-auto px-6 lg:px-12 py-12 lg:py-20">
        <div className="grid lg:grid-cols-12 gap-16 xl:gap-24">
          <div className="lg:col-span-6 space-y-6">
            <div className="relative bg-zinc-50 rounded-[40px] overflow-hidden aspect-[4/5] border border-zinc-100">
              <img src={selectedImage || ''} alt={product.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
              {galleryImages.map((img, idx) => (
                <button 
                  key={idx} 
                  onClick={() => setSelectedImage(img)} 
                  className={`relative flex-shrink-0 w-24 h-24 rounded-2xl overflow-hidden border-2 transition-all ${selectedImage === img ? 'border-red-600 scale-95 shadow-lg' : 'border-transparent hover:border-zinc-300'}`}
                >
                  <img src={img} alt={`View ${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          <div className="lg:col-span-6 flex flex-col pt-4">
            <span className="text-red-600 font-black text-[10px] uppercase tracking-[0.5em] mb-4 block italic">Ref: #00{product.id}</span>
            <h1 className="text-5xl md:text-7xl font-black text-zinc-900 uppercase italic tracking-tighter leading-[0.85] mb-6">{product.name}</h1>
            
            <div className="space-y-10">
              <div className="flex items-baseline gap-4">
                <span className="text-6xl font-black text-zinc-900 tracking-tighter italic">
                  ₦{parseFloat(product.base_price || '0').toLocaleString()}
                </span>
              </div>

              <div className="grid grid-cols-1 gap-4">
                 <button 
                  onClick={() => router.push(`/editor?product=${product.id}`)}
                  className="group relative w-full py-8 bg-zinc-900 text-white rounded-full font-black text-xs uppercase tracking-[0.4em] overflow-hidden active:scale-95 shadow-2xl"
                 >
                    <div className="absolute inset-0 bg-red-600 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                    <span className="relative z-10 flex items-center justify-center gap-4">Customize Now <Palette className="w-4 h-4" /></span>
                 </button>
                 
                 <div className="grid grid-cols-2 gap-4">
                    <button 
                      onClick={handleAddToCart}
                      disabled={isAdding}
                      className="py-6 border-2 border-zinc-900 text-zinc-900 rounded-full font-black text-[10px] uppercase tracking-[0.2em] hover:bg-zinc-900 hover:text-white transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                    >
                      {isAdding ? <Loader2 className="animate-spin w-4 h-4" /> : <><ShoppingBag className="w-4 h-4" /> Add to Cart</>}
                    </button>
                    <button 
                      onClick={handleSaveProduct}
                      className={`py-6 rounded-full border-2 transition-all flex items-center justify-center gap-3 ${isWishlisted ? 'bg-red-600 border-red-600 text-white' : 'border-zinc-200 text-zinc-900 hover:border-zinc-900'}`}
                    >
                      <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-white' : ''}`} />
                      <span className="font-black text-[10px] uppercase tracking-[0.2em]">{isWishlisted ? 'Saved' : 'Save'}</span>
                    </button>
                 </div>
              </div>

              <div className="border-t border-zinc-100 pt-10">
                <div className="flex gap-10 mb-6">
                  {['details', 'shipping'].map((tab) => (
                    <button key={tab} onClick={() => setActiveTab(tab)} className={`text-[10px] font-black uppercase tracking-[0.3em] transition-all relative ${activeTab === tab ? 'text-zinc-900' : 'text-zinc-300'}`}>
                      {tab} {activeTab === tab && <div className="absolute -bottom-2 left-0 w-full h-1 bg-red-600" />}
                    </button>
                  ))}
                </div>
                <div className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest italic leading-relaxed">
                  {activeTab === 'details' ? <p>{product.description}</p> : <p>Lagos: 24h Delivery. Other States: 3-5 Working Days.</p>}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}