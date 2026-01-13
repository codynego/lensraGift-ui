"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  Heart, ShoppingCart, Share2, Star, ChevronRight, 
  Check, Truck, Shield, Palette, Zap, Loader2, 
  Maximize2, ArrowLeft, Info, X, ShoppingBag
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
        // Corrected path to match common API structure
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

  // --- ADD TO CART LOGIC ---
  const handleAddToCart = async () => {
    if (!product) return;
    setIsAdding(true);

    // Explicitly creating item with image for Local Storage
    const cartItem = {
      product_id: product.id,
      quantity: 1,
      name: product.name,
      price: product.base_price,
      image: product.image // Ensure image is saved here
    };

    if (token) {
      try {
        const res = await fetch(`${BaseUrl}api/orders/cart/items/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ product: product.id, quantity: 1 })
        });
        if (res.ok) setShowSuccessModal(true);
      } catch (err) {
        console.error("Cart Sync Error:", err);
      }
    } else {
      const localCart = JSON.parse(localStorage.getItem('local_cart') || '[]');
      const existingIndex = localCart.findIndex((item: any) => item.product_id === product.id);
      
      if (existingIndex > -1) {
        localCart[existingIndex].quantity += 1;
      } else {
        localCart.push(cartItem);
      }
      
      localStorage.setItem('local_cart', JSON.stringify(localCart));
      setShowSuccessModal(true);
    }
    setIsAdding(false);
  };

  // --- SAVE/WISHLIST LOGIC ---
  const handleSaveProduct = () => {
    if (!product) return;
    
    const newStatus = !isWishlisted;
    setIsWishlisted(newStatus);
    
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    
    if (newStatus) {
      // Add to wishlist with image
      const alreadyIn = wishlist.find((item: any) => item.id === product.id);
      if (!alreadyIn) {
        wishlist.push({ 
          id: product.id, 
          name: product.name, 
          image: product.image, // Saving image to wishlist
          price: product.base_price 
        });
      }
    } else {
      // Remove from wishlist
      const filtered = wishlist.filter((item: any) => item.id !== product.id);
      localStorage.setItem('wishlist', JSON.stringify(filtered));
      return;
    }
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <Loader2 className="w-12 h-12 animate-spin text-red-600 mb-4" />
      <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400">Loading your canvas...</span>
    </div>
  );

  if (!product) return <div className="min-h-screen flex items-center justify-center font-black uppercase text-4xl">Item not found.</div>;

  const galleryImages = product.gallery || [product.image].filter(Boolean) as string[];

  return (
    <div className="min-h-screen bg-white text-zinc-900 selection:bg-red-600 selection:text-white">
      
      {/* SUCCESS MODAL */}
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
              <button 
                onClick={() => router.push('/checkout')}
                className="w-full py-5 bg-zinc-900 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-3"
              >
                Order Now <ChevronRight className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setShowSuccessModal(false)}
                className="w-full py-5 bg-zinc-100 text-zinc-500 rounded-2xl font-black uppercase tracking-widest text-[10px]"
              >
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
            <div className="relative bg-zinc-50 rounded-[40px] overflow-hidden aspect-[4/5] border border-zinc-100 group">
              <img src={selectedImage || ''} alt={product.name} className="w-full h-full object-cover transition-all duration-700" />
              <div className="absolute top-8 left-8">
                <div className="bg-red-600 text-white text-[10px] font-black px-5 py-2 rounded-full uppercase tracking-[0.2em] shadow-xl">Premium</div>
              </div>
            </div>

            <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
              {galleryImages.map((img, idx) => (
                <button key={idx} onClick={() => setSelectedImage(img)} className={`relative flex-shrink-0 w-24 h-24 rounded-2xl overflow-hidden border-2 transition-all ${selectedImage === img ? 'border-red-600 scale-95 shadow-lg' : 'border-transparent hover:border-zinc-300'}`}>
                  <img src={img} alt={`View ${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          <div className="lg:col-span-6 flex flex-col justify-start pt-4">
            <span className="text-red-600 font-black text-[10px] uppercase tracking-[0.5em] mb-4 block italic">Ref: #00{product.id}</span>
            <h1 className="text-5xl md:text-7xl font-black text-zinc-900 uppercase italic tracking-tighter leading-[0.85] mb-6">{product.name}</h1>
            
            <div className="flex items-center gap-8 mb-10">
              <div className="flex items-center gap-2">
                <div className="flex gap-0.5">{[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 fill-zinc-900 text-zinc-900" />)}</div>
                <span className="text-[10px] font-black uppercase tracking-widest border-b border-zinc-900">Verified Quality</span>
              </div>
              <div className="h-4 w-px bg-zinc-200" />
              <span className="text-emerald-500 font-black text-[10px] uppercase tracking-widest flex items-center gap-2"><Check className="w-3 h-3" /> In Stock</span>
            </div>

            <div className="space-y-10">
              <div className="flex items-baseline gap-4">
                <span className="text-6xl font-black text-zinc-900 tracking-tighter italic">₦{parseFloat(product.base_price).toLocaleString()}</span>
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
                      className={`py-6 rounded-full border-2 transition-all flex items-center justify-center gap-3 ${isWishlisted ? 'bg-red-600 border-red-600 text-white' : 'border-zinc-200 text-zinc-900'}`}
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
                  {activeTab === 'details' ? <p>{product.description}</p> : <p>Get it fast. 24h Lagos delivery. Nationwide shipping via Priority Logistics.</p>}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}