// app/shop/[id]/ClientProductDetail.tsx
// This is the client component for interactivity

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
    rose: 'bg-rose-100 text-rose-600 border-rose-300',
    amber: 'bg-amber-100 text-amber-600 border-amber-300',
    blue: 'bg-blue-100 text-blue-600 border-blue-300',
    emerald: 'bg-emerald-100 text-emerald-600 border-emerald-300',
    purple: 'bg-purple-100 text-purple-600 border-purple-300',
  };

  const isColorAttribute = (type: string) => type.toLowerCase().includes('color');

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 via-white to-zinc-50 text-zinc-900 font-sans">
      {/* Sticky Header with Breadcrumb */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-zinc-100">
        <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-12 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-sm font-semibold text-zinc-600 hover:text-zinc-900 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Back to Shop</span>
            </button>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsFavorited(!isFavorited)}
                className="p-2.5 rounded-full hover:bg-zinc-100 transition-all"
              >
                <Heart className={`w-5 h-5 ${isFavorited ? 'fill-red-500 text-red-500' : 'text-zinc-400'}`} />
              </button>
              <button className="p-2.5 rounded-full hover:bg-zinc-100 transition-all">
                <Share2 className="w-5 h-5 text-zinc-400" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-12 py-8 lg:py-12">
        <div className="grid lg:grid-cols-[1.2fr,1fr] gap-8 lg:gap-16 mb-20">
          
          {/* FULL IMAGE GALLERY - Enhanced with fullscreen capability, using Next Image for optimization */}
          <div className="space-y-4 lg:sticky lg:top-24 self-start">
            <div
              className="relative bg-white rounded-3xl overflow-hidden aspect-[4/5] shadow-2xl shadow-zinc-900/5 cursor-zoom-in group border border-zinc-100"
              onClick={() => setIsImageModalOpen(true)}
            >
              {allImages[selectedImageIndex] && (
                <Image
                  src={allImages[selectedImageIndex]}
                  alt={product.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              )}
              
              {/* Navigation Arrows - Always visible on mobile, hover on desktop */}
              {allImages.length > 1 && (
                <>
                  <button
                    onClick={(e) => { e.stopPropagation(); handlePrevImage(); }}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/95 hover:bg-white rounded-full p-3 shadow-xl transition-all lg:opacity-0 lg:group-hover:opacity-100 backdrop-blur-sm"
                  >
                    <ChevronLeft className="w-5 h-5 text-zinc-900" />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleNextImage(); }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/95 hover:bg-white rounded-full p-3 shadow-xl transition-all lg:opacity-0 lg:group-hover:opacity-100 backdrop-blur-sm"
                  >
                    <ChevronRight className="w-5 h-5 text-zinc-900" />
                  </button>
                </>
              )}
              {/* Image Counter */}
              <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs font-semibold">
                {selectedImageIndex + 1} / {allImages.length}
              </div>
            </div>
            {/* Thumbnail Strip */}
            {allImages.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {allImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleImageChange(idx)}
                    className={`relative flex-shrink-0 w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all ${selectedImageIndex === idx ? 'border-zinc-900 shadow-lg ring-2 ring-zinc-900 ring-offset-2' : 'border-zinc-200 opacity-50 hover:opacity-100 hover:border-zinc-400'}`}
                  >
                    <Image src={img} alt={`View ${idx + 1}`} fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
            {/* Trust Badges */}
            <div className="hidden lg:grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-zinc-100">
              <div className="flex flex-col items-center text-center gap-2">
                <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center">
                  <Truck className="w-6 h-6 text-emerald-600" />
                </div>
                <p className="text-xs font-semibold text-zinc-900">Free Shipping</p>
                <p className="text-[10px] text-zinc-500">On orders over ₦50,000</p>
              </div>
              <div className="flex flex-col items-center text-center gap-2">
                <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-blue-600" />
                </div>
                <p className="text-xs font-semibold text-zinc-900">Secure Payment</p>
                <p className="text-[10px] text-zinc-500">100% protected</p>
              </div>
              <div className="flex flex-col items-center text-center gap-2">
                <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center">
                  <RotateCcw className="w-6 h-6 text-purple-600" />
                </div>
                <p className="text-xs font-semibold text-zinc-900">Easy Returns</p>
                <p className="text-[10px] text-zinc-500">30-day guarantee</p>
              </div>
            </div>
          </div>

          {/* PRODUCT INFO - Redesigned for better hierarchy */}
          <div className="flex flex-col">
            <div className="space-y-6 pb-8 border-b border-zinc-100">
              <div className="flex items-start justify-between gap-4">
                <span className="inline-flex items-center gap-2 bg-red-50 text-red-600 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
                  {product.category_name}
                </span>
                {currentStock < 10 && currentStock > 0 && (
                  <span className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-700 px-3 py-1.5 rounded-full text-xs font-bold">
                    🔥 Only {currentStock} left
                  </span>
                )}
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-zinc-900 leading-[0.95] tracking-tight">
                {product.name}
              </h1>
              
              <div className="flex flex-wrap items-center gap-4">
                <span className="text-5xl font-black text-zinc-900 tracking-tight">
                  ₦{parseFloat(currentPrice).toLocaleString()}
                </span>
                {!product.is_customizable && (
                  <div className="flex items-center gap-2 bg-gradient-to-r from-yellow-50 to-amber-50 px-4 py-2 rounded-full border border-amber-200">
                    <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                    <span className="text-xs font-bold text-amber-700">Includes Surprise</span>
                  </div>
                )}
              </div>
              {/* Quick Product Description */}
              <p className="text-zinc-600 leading-relaxed text-base">
                {product.description.split('\n')[0].substring(0, 150)}...
              </p>
            </div>

            {/* SURPRISE REVEAL - Redesigned as prominent feature */}
            {!product.is_customizable && (
              <div className="py-8 space-y-4">
                <button
                  onClick={() => setShowSurprise(!showSurprise)}
                  className={`w-full flex items-center justify-between p-6 rounded-2xl border-2 transition-all duration-300 ${showSurprise ? 'border-purple-300 bg-gradient-to-br from-purple-50 to-pink-50 shadow-lg' : 'border-zinc-200 bg-white hover:border-zinc-300 hover:shadow-md'}`}
                >
                  <div className="flex items-center gap-4 text-left">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${showSurprise ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/30' : 'bg-zinc-100 text-zinc-400'}`}>
                      <Sparkles className="w-7 h-7" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-zinc-900 mb-1">Add Secret Message</h3>
                      <p className="text-xs text-zinc-500">Create a magical reveal experience</p>
                    </div>
                  </div>
                  <div className={`transition-transform ${showSurprise ? 'rotate-180' : ''}`}>
                    <ChevronDown className="w-5 h-5 text-zinc-400" />
                  </div>
                </button>
                <AnimatePresence>
                  {showSurprise && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="p-6 bg-white rounded-2xl border-2 border-zinc-100 space-y-6 shadow-sm">
                        <div className="space-y-3">
                          <label className="text-xs font-bold text-zinc-900 uppercase tracking-wider flex items-center gap-2">
                            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-purple-100 text-purple-600 text-xs font-black">1</span>
                            Choose an emotion
                          </label>
                          <div className="flex flex-wrap gap-2">
                            {EMOTIONS.map((e) => {
                              const isSelected = selectedEmotion === e.id;
                              const colorClass = emotionColorMap[e.color];
                              return (
                                <button
                                  key={e.id}
                                  onClick={() => setSelectedEmotion(e.id)}
                                  className={`px-4 py-2.5 rounded-xl border-2 text-xs font-bold transition-all ${isSelected ? `${colorClass} shadow-md scale-105` : 'border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300'}`}
                                >
                                  <span className="mr-1.5">{e.emoji}</span>
                                  {e.label}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                        <div className="space-y-3">
                          <label className="text-xs font-bold text-zinc-900 uppercase tracking-wider flex items-center gap-2">
                            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-purple-100 text-purple-600 text-xs font-black">2</span>
                            Your secret message
                          </label>
                          <div className="relative">
                            <textarea
                              value={secretMessage}
                              onChange={(e) => setSecretMessage(e.target.value.slice(0, maxMessageLength))}
                              placeholder="Write something heartfelt that will be revealed when they receive their gift..."
                              className="w-full bg-zinc-50 border-2 border-zinc-200 rounded-xl p-4 text-sm outline-none focus:border-purple-400 focus:bg-white transition-all h-32 font-medium resize-none placeholder:text-zinc-400"
                            />
                            <div className="absolute bottom-3 right-3 text-xs text-zinc-400 font-semibold">
                              {secretMessage.length} / {maxMessageLength}
                            </div>
                          </div>
                          {secretMessage.length > 0 && secretMessage.length < minMessageLength && (
                            <p className="text-xs text-amber-600 font-medium">✨ Add {minMessageLength - secretMessage.length} more characters</p>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* VARIANT SELECTORS - Improved visual hierarchy with color swatches */}
            <div className="py-8 space-y-8 border-t border-zinc-100">
              {attributeTypes.map(type => {
                const values = Array.from(new Set(
                  product.variants.flatMap((v) => v.attributes).filter((a) => a.attribute_name === type).map((a) => a.value)
                ));
                
                return (
                  <div key={type}>
                    <label className="text-xs font-bold text-zinc-900 uppercase tracking-wider mb-4 block">
                      {type}: <span className="text-zinc-500 normal-case">{selectedAttributes[type] || 'Select'}</span>
                    </label>
                    <div className="flex flex-wrap gap-3">
                      {values.map(val => {
                        const isSelected = selectedAttributes[type] === val;
                        if (isColorAttribute(type)) {
                          return (
                            <button
                              key={val}
                              onClick={() => setSelectedAttributes(prev => ({ ...prev, [type]: val }))}
                              className={`w-10 h-10 rounded-full border-2 transition-all shadow-md ${isSelected ? 'border-zinc-900 scale-110 ring-2 ring-zinc-900 ring-offset-2' : 'border-zinc-200 hover:border-zinc-400'} flex items-center justify-center`}
                              style={{ backgroundColor: val }}
                              title={val}
                            >
                              {isSelected && <Check className="w-5 h-5 text-white drop-shadow" />}
                            </button>
                          );
                        }
                        return (
                          <button
                            key={val}
                            onClick={() => setSelectedAttributes(prev => ({ ...prev, [type]: val }))}
                            className={`px-6 py-3 rounded-xl border-2 text-sm font-bold transition-all ${isSelected ? 'border-zinc-900 bg-zinc-900 text-white shadow-xl shadow-zinc-900/20' : 'border-zinc-200 text-zinc-700 hover:border-zinc-400 bg-white'}`}
                          >
                            {val}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
              {/* QUANTITY SELECTOR - Modern design */}
              <div>
                <label className="text-xs font-bold text-zinc-900 uppercase tracking-wider mb-4 block">Quantity</label>
                <div className="inline-flex items-center bg-white border-2 border-zinc-200 rounded-xl overflow-hidden">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= (product.min_order_quantity || 1)}
                    className="w-12 h-12 flex items-center justify-center hover:bg-zinc-50 disabled:opacity-30 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <div className="w-16 h-12 flex items-center justify-center border-x-2 border-zinc-200 font-bold text-lg">
                    {quantity}
                  </div>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= currentStock}
                    className="w-12 h-12 flex items-center justify-center hover:bg-zinc-50 disabled:opacity-30 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* ACTION BUTTONS - Redesigned */}
            <div className="sticky bottom-0 bg-white pt-6 pb-4 -mx-4 px-4 sm:mx-0 sm:px-0 border-t border-zinc-100 mt-auto lg:static lg:border-0 lg:p-0">
              {product.is_customizable ? (
                <button
                  onClick={() => router.push(`/editor?product=${product.id}`)}
                  className="group relative w-full py-5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl font-bold text-sm uppercase tracking-wider overflow-hidden shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 transition-all active:scale-98"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="relative z-10 flex items-center justify-center gap-3">
                    <Palette className="w-5 h-5" />
                    Customize Your Design
                  </span>
                </button>
              ) : (
                <button
                  onClick={handleAddToCart}
                  disabled={isAdding || (product.variants.length > 0 && !activeVariant) || quantity > currentStock || currentStock === 0 || !isSurpriseValid}
                  className="w-full py-5 bg-zinc-900 text-white rounded-2xl font-bold text-sm uppercase tracking-wider hover:bg-zinc-800 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-zinc-900/20 active:scale-98"
                >
                  {isAdding ? (
                    <Loader2 className="animate-spin w-5 h-5" />
                  ) : (
                    <>
                      <ShoppingBag className="w-5 h-5" />
                      Add to Cart - ₦{(parseFloat(currentPrice) * quantity).toLocaleString()}
                    </>
                  )}
                </button>
              )}
            </div>

            {/* TABS - Modern accordion style */}
            <div className="mt-8 space-y-2">
              {[
                { key: 'details', label: 'Product Details', content: product.description },
                { key: 'shipping', label: 'Shipping & Returns', content: 'Standard shipping: 3-5 business days. Express shipping available at checkout. Free returns within 30 days.' }
              ].map((tab) => {
                const isActive = activeTab === tab.key;
                return (
                  <div key={tab.key} className="border border-zinc-200 rounded-xl overflow-hidden">
                    <button
                      onClick={() => setActiveTab(isActive ? '' as any : tab.key as any)}
                      className="w-full flex items-center justify-between p-5 hover:bg-zinc-50 transition-colors"
                    >
                      <span className="font-bold text-sm text-zinc-900">{tab.label}</span>
                      <ChevronDown className={`w-5 h-5 text-zinc-400 transition-transform ${isActive ? 'rotate-180' : ''}`} />
                    </button>
                    <AnimatePresence>
                      {isActive && (
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: 'auto' }}
                          exit={{ height: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="p-5 pt-0 text-sm text-zinc-600 leading-relaxed border-t border-zinc-100">
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
        </div>

        {/* RELATED PRODUCTS - Improved cards */}
        {relatedProducts.length > 0 && (
          <section className="border-t border-zinc-100 pt-16">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl sm:text-3xl font-black text-zinc-900">You May Also Like</h2>
              <button
                onClick={() => router.push('/shop')}
                className="text-sm font-bold text-zinc-600 hover:text-zinc-900 flex items-center gap-2 group"
              >
                View All
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
              {relatedProducts.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    router.push(`/shop/${item.id}`);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="group cursor-pointer"
                >
                  <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-zinc-50 mb-4 border border-zinc-100 relative shadow-sm hover:shadow-xl transition-all duration-300">
                    {item.image_url && (
                      <Image
                        src={item.image_url}
                        alt={item.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <h3 className="text-sm font-bold text-zinc-900 mb-1 group-hover:text-red-600 transition-colors line-clamp-1">
                    {item.name}
                  </h3>
                  <p className="text-sm font-bold text-zinc-500">
                    ₦{parseFloat(item.base_price).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* FULLSCREEN IMAGE MODAL */}
      <AnimatePresence>
        {isImageModalOpen && (
          <div
            className="fixed inset-0 bg-black/95 z-[200] flex items-center justify-center p-4"
            onClick={() => setIsImageModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative max-w-4xl w-full h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              {allImages[selectedImageIndex] && (
                <Image
                  src={allImages[selectedImageIndex]}
                  alt={product.name}
                  fill
                  className="object-contain"
                  sizes="100vw"
                />
              )}
              <button
                onClick={() => setIsImageModalOpen(false)}
                className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 p-2 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-white" />
              </button>
              {allImages.length > 1 && (
                <>
                  <button
                    onClick={handlePrevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 p-3 rounded-full transition-colors"
                  >
                    <ChevronLeft className="w-6 h-6 text-white" />
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 p-3 rounded-full transition-colors"
                  >
                    <ChevronRight className="w-6 h-6 text-white" />
                  </button>
                </>
              )}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs font-semibold">
                {selectedImageIndex + 1} / {allImages.length}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* SUCCESS MODAL - Enhanced with better design */}
      <AnimatePresence>
        {showSuccessModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-[100] p-6">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white p-8 lg:p-12 rounded-[40px] max-w-lg w-full text-center shadow-2xl border border-zinc-200"
            >
              <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="w-10 h-10" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-black uppercase italic mb-4 text-zinc-900">Added to Cart!</h2>
              <p className="text-zinc-600 mb-8 font-bold text-sm uppercase tracking-widest leading-relaxed">Your custom experience has been saved to your bag.</p>
              <div className="flex flex-col gap-3">
                <button 
                  onClick={() => { setShowSuccessModal(false); router.push('/cart'); }} 
                  className="w-full py-5 bg-zinc-900 text-white rounded-full font-black text-sm uppercase tracking-[0.2em] hover:bg-red-600 transition-all active:scale-95 shadow-md"
                >
                  View Cart & Checkout
                </button>
                <button 
                  onClick={() => setShowSuccessModal(false)} 
                  className="w-full py-5 border-2 border-zinc-200 text-zinc-600 rounded-full font-black text-sm uppercase tracking-[0.2em] hover:border-zinc-900 hover:text-zinc-900 transition-all"
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