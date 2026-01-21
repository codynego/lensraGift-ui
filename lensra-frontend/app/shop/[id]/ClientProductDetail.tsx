// app/shop/[id]/ClientProductDetail.tsx
// This is the client component for interactivity

"use client";

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image'; // Added for optimized images
import { 
  Heart, Palette, Loader2, ShoppingBag, Plus, Minus, 
  Sparkles, Check, ChevronDown, ChevronUp, Star
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';

interface AttributeValue {
  id: number;
  attribute_name: string;
  value: string;
}

interface ProductVariant {
  id: number;
  attributes: AttributeValue[];
  price_override: string | null;
  stock_quantity: number;
}

interface ProductImage {
  id: number;
  image_url: string;
  alt_text: string;
}

interface ProductDetail {
  id: number;
  name: string;
  description: string;
  base_price: string;
  category_name: string;
  image_url: string | null;
  gallery: ProductImage[];
  variants: ProductVariant[];
  min_order_quantity: number;
  is_customizable: boolean;
}

const EMOTIONS = [
  { id: 'loved', label: 'Loved', emoji: '❤️' },
  { id: 'joyful', label: 'Joyful', emoji: '🎉' },
  { id: 'emotional', label: 'Emotional', emoji: '🥹' },
  { id: 'appreciated', label: 'Appreciated', emoji: '🙏' },
  { id: 'remembered', label: 'Remembered', emoji: '🕊' },
];

export default function ClientProductDetail({ 
  initialProduct, 
  initialRelatedProducts, 
  baseUrl 
}: { 
  initialProduct: ProductDetail; 
  initialRelatedProducts: ProductDetail[]; 
  baseUrl: string;
}) {
  const router = useRouter();
  const { token } = useAuth();
  
  const [product] = useState<ProductDetail>(initialProduct);
  const [relatedProducts] = useState<ProductDetail[]>(initialRelatedProducts);
  const [isAdding, setIsAdding] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'shipping'>('details');
  const [selectedImage, setSelectedImage] = useState<string | null>(initialProduct.image_url);
  const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string>>(() => {
    if (initialProduct.variants?.length > 0) {
      const initialAttrs: Record<string, string> = {};
      initialProduct.variants[0].attributes.forEach((attr) => {
        initialAttrs[attr.attribute_name] = attr.value;
      });
      return initialAttrs;
    }
    return {};
  });
  const [quantity, setQuantity] = useState(initialProduct.min_order_quantity || 1);

  // --- SURPRISE REVEAL STATE ---
  const [showSurprise, setShowSurprise] = useState(false);
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);
  const [secretMessage, setSecretMessage] = useState("");

  const activeVariant = useMemo(() => {
    if (!product?.variants || product.variants.length === 0) return null;
    return product.variants.find((v) => 
      v.attributes.every((attr) => selectedAttributes[attr.attribute_name] === attr.value)
    ) || null;
  }, [selectedAttributes, product]);

  const currentPrice = activeVariant?.price_override || product?.base_price || "0";
  const attributeTypes = Array.from(new Set(product?.variants?.flatMap((v) => v.attributes.map((a) => a.attribute_name)) || []));
  const allImages = [product.image_url, ...product.gallery.map((g) => g.image_url)].filter(Boolean) as string[];

  const handleAddToCart = async () => {
    if (!product) return;
    setIsAdding(true);
    let sessionId = localStorage.getItem('guest_session_id');
    if (!sessionId) {
      sessionId = crypto.randomUUID();
      localStorage.setItem('guest_session_id', sessionId);
    }

    try {
      const res = await fetch(`${baseUrl}api/orders/cart/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(token && { 'Authorization': `Bearer ${token}` }) },
        body: JSON.stringify({ 
          product: product.id, 
          variant: activeVariant?.id || null, 
          quantity: quantity,
          secret_message: showSurprise ? secretMessage : null,
          emotion: showSurprise ? selectedEmotion : null,
          ...(!token && { session_id: sessionId })
        })
      });
      if (res.ok) {
        setShowSuccessModal(true);
        window.dispatchEvent(new Event('storage'));
      }
    } catch (err) { console.error(err); } finally { setIsAdding(false); }
  };

  return (
    <div className="min-h-screen bg-white text-zinc-900 font-sans">
      <main className="max-w-[1600px] mx-auto px-6 lg:px-12 py-12 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 mb-24 lg:mb-32">
          
          {/* IMAGE GALLERY - Made sticky on desktop */}
          <div className="space-y-6 lg:sticky lg:top-24 self-start">
            <div className="relative bg-zinc-50 rounded-[40px] overflow-hidden aspect-square border border-zinc-100 group">
              {selectedImage && (
                <Image 
                  src={selectedImage} 
                  alt={product.name} 
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105" 
                  priority // For main image
                />
              )}
            </div>
            <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
              {allImages.map((img, idx) => (
                <button 
                  key={idx} 
                  onClick={() => setSelectedImage(img)} 
                  className={`relative flex-shrink-0 w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all ${selectedImage === img ? 'border-zinc-900 scale-95 shadow-lg' : 'border-transparent opacity-60 hover:opacity-100'}`}
                >
                  <Image src={img} alt={`Angle ${idx + 1} of ${product.name}`} fill className="object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* PRODUCT INFO */}
          <div className="flex flex-col gap-8">
            <div className="flex justify-between items-start">
               <span className="text-red-600 font-black text-[10px] uppercase tracking-[0.5em] block italic">{product.category_name}</span>
               <button className="text-zinc-300 hover:text-red-500 transition-colors"><Heart className="w-6 h-6" /></button>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-black text-zinc-900 uppercase italic tracking-tighter leading-[0.85]">{product.name}</h1>
            
            <div className="flex items-center gap-6">
              <span className="text-4xl font-black text-zinc-900 tracking-tighter italic">
                ₦{parseFloat(currentPrice).toLocaleString()}
              </span>
              <div className="flex items-center gap-2 bg-zinc-50 px-4 py-2 rounded-full border border-zinc-100">
                <Star className="w-3 h-3 text-red-600 fill-red-600" />
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Includes Surprise Reveal</span>
              </div>
            </div>

            {/* --- SURPRISE REVEAL COLLAPSIBLE --- */}
            {!product.is_customizable && (
              <div>
                <button 
                  onClick={() => setShowSurprise(!showSurprise)}
                  className={`w-full flex items-center justify-between p-6 rounded-[32px] border-2 transition-all duration-500 ${showSurprise ? 'border-red-600 bg-red-50/20' : 'border-zinc-100 bg-zinc-50 hover:border-zinc-200'}`}
                >
                  <div className="flex items-center gap-4 text-left">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${showSurprise ? 'bg-red-600 text-white' : 'bg-white text-zinc-400 border border-zinc-100 shadow-sm'}`}>
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-xs font-black uppercase italic tracking-tight text-zinc-900">Include Surprise Experience</h3>
                      <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Digital Secret Message Reveal</p>
                    </div>
                  </div>
                  {showSurprise ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </button>

                <AnimatePresence>
                  {showSurprise && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-4 p-8 bg-zinc-50 rounded-[40px] border-2 border-zinc-100 space-y-8">
                        <div className="space-y-4">
                          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">1. What do you want them to feel?</label>
                          <div className="flex flex-wrap gap-2">
                            {EMOTIONS.map((e) => (
                              <button
                                key={e.id}
                                onClick={() => setSelectedEmotion(e.id)}
                                className={`px-5 py-3 rounded-full border-2 text-[10px] font-black uppercase transition-all ${selectedEmotion === e.id ? 'border-red-600 bg-white text-red-600 shadow-lg' : 'border-zinc-200 bg-white text-zinc-400'}`}
                              >
                                {e.emoji} {e.label}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-4">
                          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">2. Type your secret message</label>
                          <textarea 
                            value={secretMessage}
                            onChange={(e) => setSecretMessage(e.target.value)}
                            placeholder="Type your secret message here... (50–300 characters)"
                            className="w-full bg-white border-2 border-zinc-200 rounded-3xl p-6 text-sm outline-none focus:border-red-600 transition-all h-32 font-medium"
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* VARIANT SELECTORS */}
            <div className="space-y-8">
              {attributeTypes.map(type => (
                <div key={type}>
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 block mb-4">{type}</label>
                  <div className="flex flex-wrap gap-3">
                    {Array.from(new Set(
                      product.variants.flatMap((v) => v.attributes).filter((a) => a.attribute_name === type).map((a) => a.value)
                    )).map(val => (
                      <button
                        key={val}
                        onClick={() => setSelectedAttributes(prev => ({ ...prev, [type]: val }))}
                        className={`px-6 py-3 rounded-full border-2 text-[10px] font-black uppercase tracking-widest transition-all ${selectedAttributes[type] === val ? 'border-zinc-900 bg-zinc-900 text-white shadow-xl scale-105' : 'border-zinc-100 text-zinc-400 hover:border-zinc-300'}`}
                      >
                        {val}
                      </button>
                    ))}
                  </div>
                </div>
              ))}

              {/* QUANTITY SELECTOR */}
              <div>
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 block mb-4">Quantity</label>
                <div className="flex items-center w-fit border-2 border-zinc-100 rounded-full p-1">
                  <button 
                    onClick={() => setQuantity(Math.max(product.min_order_quantity || 1, quantity - 1))}
                    className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-zinc-50"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center font-black text-sm">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-zinc-50"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {product.is_customizable ? (
                <button onClick={() => router.push(`/editor?product=${product.id}`)} className="group relative w-full py-8 bg-zinc-900 text-white rounded-full font-black text-xs uppercase tracking-[0.4em] overflow-hidden active:scale-95 shadow-2xl">
                  <div className="absolute inset-0 bg-red-600 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                  <span className="relative z-10 flex items-center justify-center gap-4">Customize Now <Palette className="w-4 h-4" /></span>
                </button>
              ) : (
                <button 
                  onClick={handleAddToCart} 
                  disabled={isAdding || (product.variants.length > 0 && !activeVariant)} 
                  className="py-8 border-2 border-zinc-900 text-zinc-900 rounded-full font-black text-[10px] uppercase tracking-[0.2em] hover:bg-zinc-900 hover:text-white transition-all flex items-center justify-center gap-3 disabled:opacity-50 shadow-lg active:scale-95"
                >
                  {isAdding ? <Loader2 className="animate-spin w-5 h-5" /> : <><ShoppingBag className="w-5 h-5" /> Add to Cart</>}
                </button>
              )}
            </div>

            {/* TABS */}
            <div className="border-t border-zinc-100 pt-10">
              <div className="flex gap-10 mb-8">
                {['details', 'shipping'].map((tab) => (
                  <button key={tab} onClick={() => setActiveTab(tab as 'details' | 'shipping')} className={`text-[10px] font-black uppercase tracking-[0.3em] transition-all relative pb-2 ${activeTab === tab ? 'text-zinc-900' : 'text-zinc-300'}`}>
                    {tab} {activeTab === tab && <div className="absolute bottom-0 left-0 w-full h-1 bg-red-600" />}
                  </button>
                ))}
              </div>
              <div className="prose prose-sm max-w-none text-zinc-700 leading-relaxed font-normal">
                {activeTab === 'details' ? (
                  <div dangerouslySetInnerHTML={{ __html: product.description.replace(/\n/g, '<br />') }} />
                ) : (
                  <p>Standard shipping: 3-5 business days. Express shipping available at checkout.</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* RELATED PRODUCTS */}
        {relatedProducts.length > 0 && (
          <section className="border-t border-zinc-100 pt-16 lg:pt-20">
            <div className="flex justify-between items-end mb-12">
              <h2 className="text-3xl font-black uppercase italic tracking-tighter">Related in {product.category_name}</h2>
              <button onClick={() => router.push('/shop')} className="text-[10px] font-black uppercase tracking-widest border-b-2 border-zinc-900 pb-1">View All</button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
              {relatedProducts.map((item) => (
                <div 
                  key={item.id} 
                  onClick={() => {
                    router.push(`/shop/${item.id}`);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="group cursor-pointer"
                >
                  <div className="aspect-[3/4] rounded-[30px] overflow-hidden bg-zinc-50 mb-4 lg:mb-6 border border-zinc-100 relative">
                    {item.image_url && (
                      <Image src={item.image_url} alt={item.name} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                    )}
                  </div>
                  <h3 className="text-[11px] font-black uppercase tracking-widest mb-1 group-hover:text-red-600 transition-colors">{item.name}</h3>
                  <p className="text-[11px] font-bold text-zinc-400 italic">₦{parseFloat(item.base_price).toLocaleString()}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* SUCCESS MODAL */}
      <AnimatePresence>
        {showSuccessModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-6">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white p-8 lg:p-10 rounded-[40px] max-w-md w-full text-center shadow-2xl border border-zinc-100"
            >
              <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6 lg:mb-8">
                <Check className="w-10 h-10" />
              </div>
              <h2 className="text-2xl lg:text-3xl font-black uppercase italic mb-4 text-zinc-900">Added to Cart!</h2>
              <p className="text-zinc-500 mb-8 lg:mb-10 font-bold text-xs uppercase tracking-widest leading-relaxed">Your custom experience has been saved to your bag.</p>
              <div className="flex flex-col gap-3">
                <button 
                  onClick={() => { setShowSuccessModal(false); router.push('/cart'); }} 
                  className="w-full py-5 bg-zinc-900 text-white rounded-full font-black text-xs uppercase tracking-[0.2em] hover:bg-red-600 transition-all active:scale-95"
                >
                  View Cart & Checkout
                </button>
                <button 
                  onClick={() => setShowSuccessModal(false)} 
                  className="w-full py-5 border-2 border-zinc-100 text-zinc-400 rounded-full font-black text-xs uppercase tracking-[0.2em] hover:border-zinc-900 hover:text-zinc-900 transition-all"
                >
                  Continue Shopping
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}