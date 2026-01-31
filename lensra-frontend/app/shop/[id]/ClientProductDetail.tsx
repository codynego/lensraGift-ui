// app/shop/[id]/ClientProductDetail.tsx
// Updated sleek UI: smaller text, concise copy, Redbubble-inspired layout with large images, quick actions, responsive design, subtle animations

"use client";

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  Heart, Palette, Loader2, ShoppingBag, Plus, Minus,
  Sparkles, Check, ChevronDown, ChevronUp, Star,
  ChevronLeft, ChevronRight, X, Share2, Truck, Shield, RotateCcw
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
  { id: 'loved', label: 'Loved', emoji: '❤️', color: 'rose' },
  { id: 'joyful', label: 'Joyful', emoji: '🎉', color: 'amber' },
  { id: 'emotional', label: 'Emotional', emoji: '🥹', color: 'blue' },
  { id: 'appreciated', label: 'Appreciated', emoji: '🙏', color: 'emerald' },
  { id: 'remembered', label: 'Remembered', emoji: '🕊', color: 'purple' },
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
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
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
  const currentStock = activeVariant?.stock_quantity ?? Infinity;
  const minMessageLength = 50;
  const maxMessageLength = 300;
  const isSurpriseValid = !showSurprise || (selectedEmotion && secretMessage.length >= minMessageLength && secretMessage.length <= maxMessageLength);

  const handleImageChange = (index: number) => {
    setSelectedImageIndex(index);
  };

  const handlePrevImage = () => {
    setSelectedImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  const handleNextImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % allImages.length);
  };

  const handleQuantityChange = (delta: number) => {
    const newQuantity = Math.max(product.min_order_quantity || 1, quantity + delta);
    setQuantity(Math.min(newQuantity, currentStock));
  };

  const handleAddToCart = async () => {
    if (!product || !isSurpriseValid) return;
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

  const emotionColorMap: Record<string, string> = {
    rose: 'bg-rose-50 text-rose-600 border-rose-200',
    amber: 'bg-amber-50 text-amber-600 border-amber-200',
    blue: 'bg-blue-50 text-blue-600 border-blue-200',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-200',
    purple: 'bg-purple-50 text-purple-600 border-purple-200',
  };

  const isColorAttribute = (type: string) => type.toLowerCase().includes('color');

  return (
    <div className="min-h-screen bg-white text-zinc-900">
      {/* Sticky Header - Compact */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-zinc-100">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1 text-sm font-medium text-zinc-600 hover:text-zinc-900 transition"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsFavorited(!isFavorited)}
              className="p-1.5 rounded-full hover:bg-zinc-100 transition"
            >
              <Heart className={`w-4 h-4 ${isFavorited ? 'fill-red-500 text-red-500' : 'text-zinc-500'}`} />
            </button>
            <button className="p-1.5 rounded-full hover:bg-zinc-100 transition">
              <Share2 className="w-4 h-4 text-zinc-500" />
            </button>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-6 lg:py-8 lg:grid lg:grid-cols-2 lg:gap-12">
        
        {/* IMAGE GALLERY - Large, responsive, with zoom */}
        <div className="space-y-3 lg:sticky lg:top-20 self-start">
          <div
            className="relative aspect-[3/4] bg-white rounded-2xl overflow-hidden shadow-md border border-zinc-100 cursor-zoom-in group"
            onClick={() => setIsImageModalOpen(true)}
          >
            {allImages[selectedImageIndex] && (
              <img
                src={allImages[selectedImageIndex]}
                alt={product.name}
                loading="lazy"
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            )}
            
            {allImages.length > 1 && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); handlePrevImage(); }}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-1.5 shadow-md transition-all opacity-75 hover:opacity-100"
                >
                  <ChevronLeft className="w-4 h-4 text-zinc-900" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); handleNextImage(); }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-1.5 shadow-md transition-all opacity-75 hover:opacity-100"
                >
                  <ChevronRight className="w-4 h-4 text-zinc-900" />
                </button>
              </>
            )}
            <div className="absolute bottom-2 right-2 bg-black/50 text-white px-2 py-1 rounded-full text-[10px] font-medium">
              {selectedImageIndex + 1}/{allImages.length}
            </div>
          </div>
          {allImages.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {allImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => handleImageChange(idx)}
                  className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border ${selectedImageIndex === idx ? 'border-red-500 shadow-md' : 'border-zinc-200 hover:border-zinc-400'}`}
                >
                  <img src={img} alt={`View ${idx + 1}`} loading="lazy" className="object-cover" />
                </button>
              ))}
            </div>
          )}
          {/* Trust Badges - Compact */}
          <div className="hidden lg:flex gap-4 mt-4">
            <div className="flex-1 flex items-center gap-2 bg-zinc-50 p-3 rounded-lg border border-zinc-100">
              <Truck className="w-4 h-4 text-emerald-500" />
              <span className="text-[10px] font-medium">Free Shipping over ₦50k</span>
            </div>
            <div className="flex-1 flex items-center gap-2 bg-zinc-50 p-3 rounded-lg border border-zinc-100">
              <Shield className="w-4 h-4 text-blue-500" />
              <span className="text-[10px] font-medium">Secure Payments</span>
            </div>
            <div className="flex-1 flex items-center gap-2 bg-zinc-50 p-3 rounded-lg border border-zinc-100">
              <RotateCcw className="w-4 h-4 text-purple-500" />
              <span className="text-[10px] font-medium">30-Day Returns</span>
            </div>
          </div>
        </div>

        {/* PRODUCT INFO - Concise, sticky on desktop */}
        <div className="mt-6 lg:mt-0 space-y-6 lg:sticky lg:top-20 self-start">
          <div className="space-y-3">
            <span className="inline-flex items-center gap-1 bg-red-50 text-red-500 px-2 py-1 rounded-full text-[10px] font-medium uppercase">
              <span className="w-1 h-1 rounded-full bg-red-500 animate-pulse" />
              {product.category_name}
            </span>
            <h1 className="text-3xl lg:text-4xl font-bold text-zinc-900 leading-tight">
              {product.name}
            </h1>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-zinc-900">
                ₦{parseFloat(currentPrice).toLocaleString()}
              </span>
              {!product.is_customizable && (
                <span className="text-[10px] font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded-full">
                  Includes Surprise
                </span>
              )}
            </div>
            <p className="text-sm text-zinc-600 leading-relaxed">
              {product.description.split('\n')[0].substring(0, 120)}...
            </p>
          </div>

          {/* SURPRISE - Compact accordion */}
          {!product.is_customizable && (
            <div className="space-y-2">
              <button
                onClick={() => setShowSurprise(!showSurprise)}
                className={`w-full flex items-center justify-between p-4 rounded-lg border border-zinc-100 transition-all ${showSurprise ? 'bg-purple-50 border-purple-200 shadow-sm' : 'hover:bg-zinc-50'}`}
              >
                <div className="flex items-center gap-2">
                  <Sparkles className={`w-4 h-4 ${showSurprise ? 'text-purple-500' : 'text-zinc-500'}`} />
                  <span className="text-sm font-medium">Add Secret Message</span>
                </div>
                <ChevronDown className={`w-4 h-4 text-zinc-500 transition-transform ${showSurprise ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {showSurprise && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="p-4 bg-zinc-50 rounded-lg space-y-4 border border-zinc-100">
                      <div className="space-y-2">
                        <label className="text-[10px] font-medium text-zinc-900 uppercase">Emotion</label>
                        <div className="flex flex-wrap gap-2">
                          {EMOTIONS.map((e) => {
                            const isSelected = selectedEmotion === e.id;
                            const colorClass = emotionColorMap[e.color];
                            return (
                              <button
                                key={e.id}
                                onClick={() => setSelectedEmotion(e.id)}
                                className={`px-3 py-1.5 rounded-lg border text-[10px] font-medium transition-all ${isSelected ? `${colorClass} shadow-sm` : 'border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300'}`}
                              >
                                <span className="mr-1">{e.emoji}</span>
                                {e.label}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-medium text-zinc-900 uppercase">Message</label>
                        <textarea
                          value={secretMessage}
                          onChange={(e) => setSecretMessage(e.target.value.slice(0, maxMessageLength))}
                          placeholder="Your heartfelt note..."
                          className="w-full bg-white border border-zinc-200 rounded-lg p-3 text-sm outline-none focus:border-purple-300 transition-all h-24 resize-none placeholder:text-zinc-400"
                        />
                        <div className="text-[10px] text-zinc-500 text-right">
                          {secretMessage.length}/{maxMessageLength}
                        </div>
                        {secretMessage.length > 0 && secretMessage.length < minMessageLength && (
                          <p className="text-[10px] text-amber-500">Add {minMessageLength - secretMessage.length} more characters</p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* VARIANTS - Swatches for colors */}
          <div className="space-y-4">
            {attributeTypes.map(type => {
              const values = Array.from(new Set(
                product.variants.flatMap((v) => v.attributes).filter((a) => a.attribute_name === type).map((a) => a.value)
              ));
              
              return (
                <div key={type}>
                  <label className="text-[10px] font-medium text-zinc-900 uppercase mb-2 block">
                    {type}: <span className="text-zinc-500">{selectedAttributes[type] || 'Select'}</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {values.map(val => {
                      const isSelected = selectedAttributes[type] === val;
                      if (isColorAttribute(type)) {
                        return (
                          <button
                            key={val}
                            onClick={() => setSelectedAttributes(prev => ({ ...prev, [type]: val }))}
                            className={`w-8 h-8 rounded-full border transition-all ${isSelected ? 'border-zinc-900 shadow-md ring-1 ring-zinc-900' : 'border-zinc-200 hover:border-zinc-400'}`}
                            style={{ backgroundColor: val }}
                            title={val}
                          >
                            {isSelected && <Check className="w-4 h-4 text-white m-2 drop-shadow" />}
                          </button>
                        );
                      }
                      return (
                        <button
                          key={val}
                          onClick={() => setSelectedAttributes(prev => ({ ...prev, [type]: val }))}
                          className={`px-4 py-2 rounded-lg border text-[10px] font-medium transition-all ${isSelected ? 'border-zinc-900 bg-zinc-900 text-white' : 'border-zinc-200 text-zinc-700 hover:border-zinc-400 bg-white'}`}
                        >
                          {val}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
            {/* Quantity - Compact */}
            <div>
              <label className="text-[10px] font-medium text-zinc-900 uppercase mb-2 block">Quantity</label>
              <div className="inline-flex items-center bg-white border border-zinc-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= (product.min_order_quantity || 1)}
                  className="w-10 h-10 flex items-center justify-center hover:bg-zinc-50 disabled:opacity-30 transition"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <div className="w-12 h-10 flex items-center justify-center border-x border-zinc-200 font-medium text-base">
                  {quantity}
                </div>
                <button
                  onClick={() => handleQuantityChange(1)}
                  disabled={quantity >= currentStock}
                  className="w-10 h-10 flex items-center justify-center hover:bg-zinc-50 disabled:opacity-30 transition"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* ACTIONS - Sticky on mobile */}
          <div className="sticky bottom-0 bg-white py-4 -mx-4 px-4 border-t border-zinc-100 lg:static lg:p-0 lg:border-0">
            {product.is_customizable ? (
              <button
                onClick={() => router.push(`/editor?product=${product.id}`)}
                className="w-full py-4 bg-red-600 text-white rounded-lg font-medium text-sm uppercase tracking-wide hover:bg-red-700 transition shadow-md active:scale-98"
              >
                <div className="flex items-center justify-center gap-2">
                  <Palette className="w-4 h-4" />
                  Customize Now
                </div>
              </button>
            ) : (
              <button
                onClick={handleAddToCart}
                disabled={isAdding || (product.variants.length > 0 && !activeVariant) || quantity > currentStock || currentStock === 0 || !isSurpriseValid}
                className="w-full py-4 bg-zinc-900 text-white rounded-lg font-medium text-sm uppercase tracking-wide hover:bg-zinc-800 transition flex items-center justify-center gap-2 disabled:opacity-50 shadow-md active:scale-98"
              >
                {isAdding ? (
                  <Loader2 className="animate-spin w-4 h-4" />
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    Add to Cart - ₦{(parseFloat(currentPrice) * quantity).toLocaleString()}
                  </>
                )}
              </button>
            )}
          </div>

          {/* TABS - Accordion */}
          <div className="space-y-2">
            {[
              { key: 'details', label: 'Details', content: product.description },
              { key: 'shipping', label: 'Shipping & Returns', content: 'Standard: 3-5 days. Express available. Free returns in 30 days.' }
            ].map((tab) => {
              const isActive = activeTab === tab.key;
              return (
                <div key={tab.key} className="border border-zinc-100 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setActiveTab(isActive ? '' as any : tab.key as any)}
                    className="w-full flex items-center justify-between p-4 hover:bg-zinc-50 transition"
                  >
                    <span className="text-sm font-medium text-zinc-900">{tab.label}</span>
                    <ChevronDown className={`w-4 h-4 text-zinc-500 transition-transform ${isActive ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: 'auto' }}
                        exit={{ height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="p-4 pt-0 text-sm text-zinc-600 leading-relaxed border-t border-zinc-100">
                          <div dangerouslySetInnerHTML={{ __html: tab.content.replace(/\n/g, '<br />') }} />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>

        {/* RELATED - Compact cards */}
        {relatedProducts.length > 0 && (
          <section className="mt-12 border-t border-zinc-100 pt-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-zinc-900">Similar Items</h2>
              <button
                onClick={() => router.push('/shop')}
                className="text-[10px] font-medium text-zinc-600 hover:text-zinc-900 flex items-center gap-1"
              >
                View All
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {relatedProducts.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    router.push(`/shop/${item.id}`);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="group cursor-pointer"
                >
                  <div className="aspect-[3/4] rounded-lg overflow-hidden bg-zinc-50 mb-2 border border-zinc-100 shadow-sm hover:shadow-md transition">
                    {item.image_url && (
                      <img
                        src={item.image_url}
                        alt={item.name}
                        loading="lazy"
                        className="object-cover group-hover:scale-105 transition duration-300"
                      />
                    )}
                  </div>
                  <h3 className="text-sm font-medium text-zinc-900 mb-0.5 group-hover:text-red-500 transition line-clamp-1">
                    {item.name}
                  </h3>
                  <p className="text-sm font-medium text-zinc-600">
                    ₦{parseFloat(item.base_price).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* IMAGE MODAL - Fullscreen */}
      <AnimatePresence>
        {isImageModalOpen && (
          <div
            className="fixed inset-0 bg-black/90 z-[200] flex items-center justify-center p-4"
            onClick={() => setIsImageModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative max-w-5xl w-full h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              {allImages[selectedImageIndex] && (
                <img
                  src={allImages[selectedImageIndex]}
                  alt={product.name}
                  loading='lazy'
                  className="object-contain rounded-lg shadow-2xl"
                  sizes="100vw"
                />
              )}
              <button
                onClick={() => setIsImageModalOpen(false)}
                className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 p-1.5 rounded-full transition"
              >
                <X className="w-5 h-5 text-white" />
              </button>
              {allImages.length > 1 && (
                <>
                  <button
                    onClick={handlePrevImage}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 p-2 rounded-full transition"
                  >
                    <ChevronLeft className="w-5 h-5 text-white" />
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 p-2 rounded-full transition"
                  >
                    <ChevronRight className="w-5 h-5 text-white" />
                  </button>
                </>
              )}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/50 text-white px-2 py-1 rounded-full text-[10px] font-medium">
                {selectedImageIndex + 1}/{allImages.length}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* SUCCESS MODAL - Compact */}
      <AnimatePresence>
        {showSuccessModal && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100] p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white p-6 rounded-2xl max-w-sm w-full text-center shadow-lg border border-zinc-100"
            >
              <div className="w-12 h-12 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold mb-2 text-zinc-900">Added!</h2>
              <p className="text-[10px] text-zinc-600 mb-4 font-medium">Item added to your cart.</p>
              <div className="flex gap-2">
                <button 
                  onClick={() => { setShowSuccessModal(false); router.push('/cart'); }} 
                  className="flex-1 py-3 bg-zinc-900 text-white rounded-lg text-[10px] font-medium uppercase tracking-wide hover:bg-red-600 transition active:scale-95"
                >
                  View Cart
                </button>
                <button 
                  onClick={() => setShowSuccessModal(false)} 
                  className="flex-1 py-3 border border-zinc-200 text-zinc-600 rounded-lg text-[10px] font-medium uppercase tracking-wide hover:border-zinc-400 transition"
                >
                  Continue
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}