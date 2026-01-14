"use client";

import { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { 
  X, Type, MessageSquare, Plus, Check, 
  Loader2, ArrowLeft, Image as ImageIcon, RefreshCw, ShoppingBag 
} from 'lucide-react';
import Image from 'next/image';

const BaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000/";

// --- Helper: Get/Create a persistent Guest ID ---
const getGuestSessionId = () => {
  if (typeof window === 'undefined') return '';
  let id = localStorage.getItem('guest_session_id');
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem('guest_session_id', id);
  }
  return id;
};

export default function ProductEditor() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="w-8 h-8 animate-spin text-red-600" />
      </div>
    }>
      <EditorContent />
    </Suspense>
  );
}

function EditorContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const productId = searchParams.get('product');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [images, setImages] = useState<any[]>([]);
  const [customText, setCustomText] = useState("");
  const [overallNote, setOverallNote] = useState("");
  
  const [isSaving, setIsSaving] = useState(false);
  const [placementId, setPlacementId] = useState<number | null>(null);

  const getImageUrl = (path: string) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    return `${BaseUrl.replace(/\/$/, '')}${path}`;
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${BaseUrl}api/products/`);
        const data = await res.json();
        const productList = Array.isArray(data) ? data : (data.results || []);
        setAllProducts(productList);

        if (productId) {
          const found = productList.find((p: any) => p.id === parseInt(productId));
          if (found) setSelectedProduct(found);
        }
      } catch (err) {
        console.error("Failed to fetch products", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [productId]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImages = Array.from(files).map(file => ({
        file,
        preview: URL.createObjectURL(file),
        note: ""
      }));
      setImages([...images, ...newImages]);
    }
  };

  const handleFinishDesign = async () => {
    if (!selectedProduct) return;
    setIsSaving(true);
    
    const token = localStorage.getItem('access_token');
    const sessionId = getGuestSessionId();
    
    try {
      // 1. Create Design (Linked to session_id for guests)
      const designFormData = new FormData();
      designFormData.append('name', `${selectedProduct.name} - Custom Design`);
      designFormData.append('custom_text', customText);
      designFormData.append('overall_instructions', overallNote);
      designFormData.append('session_id', sessionId); 
      
      images.forEach((img, index) => {
        designFormData.append(`image_${index}`, img.file);
        designFormData.append(`note_${index}`, img.note);
      });

      const designRes = await fetch(`${BaseUrl}api/designs/`, {
        method: 'POST',
        headers: token ? { 'Authorization': `Bearer ${token}` } : {},
        body: designFormData,
      });
      const designData = await designRes.json();
      if (!designRes.ok) throw new Error("Design creation failed");

      // 2. Create Placement
      const placementRes = await fetch(`${BaseUrl}api/products/placements/create/`, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          design: designData.id,
          product: selectedProduct.id,
          layout_data: { editor_version: "2.0", platform: "web" }
        }),
      });
      const placementData = await placementRes.json();
      if (!placementRes.ok) throw new Error("Placement failed");

      setPlacementId(placementData.id);
    } catch (err) {
      console.error(err);
      alert("Something went wrong saving your design.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleOrderNow = async () => {
    if (!placementId || !selectedProduct) return;
    
    const token = localStorage.getItem('access_token');
    const sessionId = getGuestSessionId();

    try {
      // --- SYNC WITH BACKEND CART ---
      // We send the placement to the database using the session_id
      const res = await fetch(`${BaseUrl}api/orders/cart/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          placement: placementId,
          product: selectedProduct.id,
          quantity: 1,
          session_id: token ? null : sessionId // Only send session_id if guest
        }),
      });

      if (!res.ok) throw new Error("API Cart add failed");

      // --- SYNC LOCAL STORAGE ---
      // Keep this for immediate UI feedback in other parts of the app
      const cartItem = {
        placement_id: placementId,
        product_id: selectedProduct.id,
        product_name: selectedProduct.name,
        price: selectedProduct.base_price,
        image: selectedProduct.image,
        quantity: 1,
        added_at: new Date().toISOString()
      };

      const storageKey = token ? 'user_cart' : 'guest_cart';
      const existingCart = JSON.parse(localStorage.getItem(storageKey) || '[]');
      
      const exists = existingCart.find((i: any) => i.placement_id === placementId);
      if (!exists) {
        existingCart.push(cartItem);
        localStorage.setItem(storageKey, JSON.stringify(existingCart));
      }
      
      router.push('/checkout');
    } catch (err) {
      console.error(err);
      alert("Could not process your order. Please try again.");
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <Loader2 className="w-8 h-8 animate-spin text-red-600" />
    </div>
  );

  if (!selectedProduct) {
    return (
      <div className="min-h-screen bg-white p-8">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="text-center">
            <h1 className="text-5xl font-black italic uppercase tracking-tighter">Select a Base</h1>
            <p className="text-zinc-400 font-bold uppercase text-[10px] tracking-widest mt-4">Pick a product to start designing</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {allProducts.map((p) => (
              <button 
                key={p.id} 
                onClick={() => {
                  setSelectedProduct(p);
                  router.push(`/editor?product=${p.id}`);
                }}
                className="group p-4 border-2 border-zinc-100 rounded-[32px] hover:border-black transition-all text-left"
              >
                <div className="aspect-square relative rounded-2xl overflow-hidden bg-zinc-50 mb-4">
                  {p.image && (
                    <Image src={getImageUrl(p.image)} alt={p.name} fill className="object-cover group-hover:scale-105 transition-transform" />
                  )}
                </div>
                <h3 className="font-black italic uppercase text-xs truncate">{p.name}</h3>
                <p className="text-[10px] font-bold text-zinc-400">₦{parseFloat(p.base_price).toLocaleString()}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black font-sans pb-20">
      <nav className="border-b border-zinc-100 py-6 px-6 sticky top-0 bg-white/80 backdrop-blur-md z-50">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <button onClick={() => router.back()} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
            <ArrowLeft className="w-4 h-4" /> Exit
          </button>

          <div className="flex gap-4">
            {!placementId ? (
              <button 
                onClick={handleFinishDesign}
                disabled={isSaving}
                className="bg-red-600 text-white px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-black transition-colors disabled:opacity-50"
              >
                {isSaving ? <Loader2 className="w-3 h-3 animate-spin" /> : "Finish Design"}
              </button>
            ) : (
              <button 
                onClick={handleOrderNow}
                className="bg-black text-white px-10 py-3 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-red-600 transition-all animate-bounce"
              >
                Order Now <ShoppingBag className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-12">
        {placementId && (
          <div className="mb-12 p-6 bg-green-50 border-2 border-green-100 rounded-[32px] flex items-center justify-between animate-in fade-in zoom-in-95">
            <div>
              <p className="text-green-800 font-black italic uppercase text-lg">Configuration Saved</p>
              <p className="text-green-600 text-[10px] font-bold uppercase tracking-widest">Ready for production. Click Order Now to proceed.</p>
            </div>
            <Check className="w-10 h-10 text-green-500 bg-white rounded-full p-2 border-2 border-green-100" />
          </div>
        )}

        <div className="grid lg:grid-cols-12 gap-16">
          <div className="lg:col-span-5">
            <div className="sticky top-32">
              <div className="relative aspect-[4/5] bg-zinc-50 rounded-[48px] overflow-hidden border-2 border-zinc-100 shadow-inner">
                {selectedProduct.image && (
                  <Image src={getImageUrl(selectedProduct.image)} alt="Base" fill className="object-cover" />
                )}
              </div>
              <button 
                onClick={() => { setSelectedProduct(null); router.push('/editor'); }}
                className="w-full mt-4 flex items-center justify-center gap-2 py-4 border-2 border-zinc-100 rounded-2xl text-[9px] font-black uppercase tracking-widest hover:bg-zinc-50 transition"
              >
                <RefreshCw className="w-3 h-3" /> Change Product Base
              </button>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-12">
            <h2 className="text-6xl font-black italic uppercase tracking-tighter leading-none mb-4">Customize</h2>
            
            <div className="space-y-4">
               <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-2 flex items-center gap-2">
                 <ImageIcon className="w-4 h-4" /> Graphics & Logos
               </label>
               <div className="grid gap-4">
                  {images.map((img, idx) => (
                    <div key={idx} className="flex gap-4 p-4 bg-zinc-50 rounded-3xl border border-zinc-100">
                      <div className="w-20 h-20 relative rounded-xl overflow-hidden flex-shrink-0">
                        <img src={img.preview} className="object-cover w-full h-full" alt="upload" />
                        <button onClick={() => setImages(images.filter((_, i) => i !== idx))} className="absolute top-1 right-1 bg-black text-white p-1 rounded-full"><X className="w-2 h-2" /></button>
                      </div>
                      <textarea 
                        placeholder="Placement instructions..." 
                        className="flex-1 bg-transparent text-xs font-bold uppercase outline-none resize-none py-1"
                        value={img.note}
                        onChange={(e) => {
                          const newImgs = [...images];
                          newImgs[idx].note = e.target.value;
                          setImages(newImgs);
                        }}
                      />
                    </div>
                  ))}
                  <button onClick={() => fileInputRef.current?.click()} className="py-10 border-2 border-dashed border-zinc-200 rounded-[32px] flex flex-col items-center gap-2 hover:bg-zinc-50 transition">
                    <Plus className="w-5 h-5" />
                    <span className="text-[9px] font-black uppercase tracking-widest">Upload Graphic</span>
                  </button>
                  <input type="file" ref={fileInputRef} onChange={handleImageUpload} hidden multiple accept="image/*" />
               </div>
            </div>

            <div className="space-y-8 pt-6 border-t border-zinc-100">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-2 flex items-center gap-2"><Type className="w-4 h-4" /> Custom Text</label>
                <input 
                  type="text" 
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  className="w-full bg-zinc-50 border-2 border-zinc-100 rounded-2xl px-6 py-4 outline-none focus:border-black transition font-bold uppercase text-sm" 
                  placeholder="EX: YOUR BRAND NAME"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-2 flex items-center gap-2"><MessageSquare className="w-4 h-4" /> Final Instructions</label>
                <textarea 
                  rows={4}
                  value={overallNote}
                  onChange={(e) => setOverallNote(e.target.value)}
                  className="w-full bg-zinc-50 border-2 border-zinc-100 rounded-[32px] px-6 py-6 outline-none focus:border-black transition font-bold uppercase text-sm resize-none" 
                  placeholder="Anything else we should know?"
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}