// app/shop/[id]/ClientProductDetail.tsx
// Updated with fixed image dimensions and enhanced UI design

"use client";

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  Heart, Palette, Loader2, ShoppingBag, Plus, Minus,
  Sparkles, Check, ChevronDown, ChevronUp, Star,
  ChevronLeft, ChevronRight, X, Share2, Truck, Shield, RotateCcw, Package
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
    <div className="min-h-screen bg-zinc-950 text-white font-sans">
      {/* Sticky Header */}
      <div className="sticky top-0 z-40 bg-zinc-900/95 backdrop-blur-xl border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-sm font-semibold text-zinc-400 hover:text-white transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Back to Shop</span>
            </button>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsFavorited(!isFavorited)}
                className="p-2.5 rounded-full bg-zinc-800 hover:bg-zinc-700 transition-all"
              >
                <Heart className={`w-5 h-5 ${isFavorited ? 'fill-red-500 text-red-500' : 'text-zinc-400'}`} />
              </button>
              <button className="p-2.5 rounded-full bg-zinc-800 hover:bg-zinc-700 transition-all">
                <Share2 className="w-5 h-5 text-zinc-400" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-8 lg:py-16">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 mb-20">
          
          {/* LEFT: IMAGE GALLERY - FIXED DIMENSIONS */}
          <div className="space-y-6">
            {/* Main Image Container - Fixed Size */}
            <div className="lg:sticky lg:top-28 space-y-4">
              <div
                className="relative bg-zinc-900 rounded-3xl overflow-hidden shadow-2xl border-2 border-zinc-800 cursor-zoom-in group mx-auto"
                style={{ 
                  maxWidth: '600px', 
                  width: '100%',
                  aspectRatio: '1/1'
                }}
                onClick={() => setIsImageModalOpen(true)}
              >
                {allImages[selectedImageIndex] ? (
                  <div className="w-full h-full flex items-center justify-center p-8">
                    <img
                      src={allImages[selectedImageIndex]}
                      alt={product.name}
                      loading="lazy"
                      className="max-w-full max-h-full w-auto h-auto object-contain transition-transform duration-700 group-hover:scale-110"
                      style={{ maxHeight: '100%', maxWidth: '100%' }}
                    />
                  </div>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-zinc-600">
                    <Package className="w-24 h-24 mb-4" />
                    <p className="text-sm font-semibold">No image available</p>
                  </div>
                )}
                
                {/* Navigation Arrows */}
                {allImages.length > 1 && (
                  <>
                    <button
                      onClick={(e) => { e.stopPropagation(); handlePrevImage(); }}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-700 rounded-full flex items-center justify-center shadow-xl transition-all opacity-0 group-hover:opacity-100 backdrop-blur-sm"
                    >
                      <ChevronLeft className="w-5 h-5 text-white" />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleNextImage(); }}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-700 rounded-full flex items-center justify-center shadow-xl transition-all opacity-0 group-hover:opacity-100 backdrop-blur-sm"
                    >
                      <ChevronRight className="w-5 h-5 text-white" />
                    </button>
                  </>
                )}
                
                {/* Image Counter */}
                {allImages.length > 1 && (
                  <div className="absolute bottom-4 right-4 bg-black/80 backdrop-blur-sm text-white px-4 py-2 rounded-full text-xs font-bold border border-zinc-700">
                    {selectedImageIndex + 1} / {allImages.length}
                  </div>
                )}

                {/* Product Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {product.is_customizable && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-600 text-white rounded-lg text-xs font-bold shadow-lg">
                      <Sparkles className="w-3 h-3" />
                      Customizable
                    </span>
                  )}
                </div>
              </div>

              {/* Thumbnail Gallery */}
              {allImages.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide max-w-[600px] mx-auto">
                  {allImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleImageChange(idx)}
                      className={`relative flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all ${
                        selectedImageIndex === idx 
                          ? 'border-red-500 shadow-lg ring-2 ring-red-500/50' 
                          : 'border-zinc-700 opacity-60 hover:opacity-100 hover:border-zinc-600'
                      }`}
                      style={{ width: '80px', height: '80px' }}
                    >
                      <div className="w-full h-full flex items-center justify-center bg-zinc-900 p-2">
                        <img 
                          src={img} 
                          alt={`View ${idx + 1}`} 
                          loading="lazy" 
                          className="max-w-full max-h-full object-contain"
                        />
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Trust Badges - Desktop Only */}
              <div className="hidden lg:grid grid-cols-3 gap-4 pt-8 border-t border-zinc-800 max-w-[600px] mx-auto">
                <div className="flex flex-col items-center text-center gap-2">
                  <div className="w-12 h-12 rounded-xl bg-red-600/10 border border-red-600/20 flex items-center justify-center">
                    <Truck className="w-6 h-6 text-red-500" />
                  </div>
                  <p className="text-xs font-bold text-white">72hr Delivery</p>
                  <p className="text-[10px] text-zinc-500">Nationwide</p>
                </div>
                <div className="flex flex-col items-center text-center gap-2">
                  <div className="w-12 h-12 rounded-xl bg-red-600/10 border border-red-600/20 flex items-center justify-center">
                    <Shield className="w-6 h-6 text-red-500" />
                  </div>
                  <p className="text-xs font-bold text-white">Quality Guaranteed</p>
                  <p className="text-[10px] text-zinc-500">Premium materials</p>
                </div>
                <div className="flex flex-col items-center text-center gap-2">
                  <div className="w-12 h-12 rounded-xl bg-red-600/10 border border-red-600/20 flex items-center justify-center">
                    <RotateCcw className="w-6 h-6 text-red-500" />
                  </div>
                  <p className="text-xs font-bold text-white">Easy Returns</p>
                  <p className="text-[10px] text-zinc-500">30-day policy</p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: PRODUCT INFO */}
          <div className="flex flex-col">
            {/* Header */}
            <div className="space-y-6 pb-8 border-b border-zinc-800">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <span className="inline-flex items-center gap-2 bg-red-600/10 border border-red-600/20 text-red-400 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  {product.category_name}
                </span>
                {currentStock < 10 && currentStock > 0 && (
                  <span className="inline-flex items-center gap-1.5 bg-amber-600/10 border border-amber-600/20 text-amber-400 px-4 py-2 rounded-full text-xs font-bold">
                    🔥 Only {currentStock} left
                  </span>
                )}
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight">
                {product.name}
              </h1>
              
              <div className="flex flex-wrap items-baseline gap-6">
                <span className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-400">
                  ₦{parseFloat(currentPrice).toLocaleString()}
                </span>
                {!product.is_customizable && (
                  <div className="flex items-center gap-2 bg-gradient-to-r from-amber-600/10 to-yellow-600/10 border border-amber-600/20 px-4 py-2 rounded-full">
                    <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                    <span className="text-xs font-bold text-amber-400">+ Surprise Message</span>
                  </div>
                )}
              </div>

              {product.description && (
                <p className="text-zinc-400 leading-relaxed text-base">
                  {product.description.length > 200 
                    ? `${product.description.substring(0, 200)}...` 
                    : product.description}
                </p>
              )}
            </div>

            {/* SURPRISE REVEAL */}
            {!product.is_customizable && (
              <div className="py-8 space-y-4">
                <button
                  onClick={() => setShowSurprise(!showSurprise)}
                  className={`w-full flex items-center justify-between p-6 rounded-2xl border-2 transition-all duration-300 ${
                    showSurprise 
                      ? 'border-purple-600/50 bg-gradient-to-br from-purple-600/10 to-pink-600/10 shadow-lg shadow-purple-500/10' 
                      : 'border-zinc-800 bg-zinc-900 hover:border-zinc-700 hover:shadow-md'
                  }`}
                >
                  <div className="flex items-center gap-4 text-left">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${
                      showSurprise 
                        ? 'bg-gradient-to-br from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/30' 
                        : 'bg-zinc-800 text-zinc-500'
                    }`}>
                      <Sparkles className="w-7 h-7" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white mb-1">Add Secret Message</h3>
                      <p className="text-xs text-zinc-500">Create a magical reveal experience</p>
                    </div>
                  </div>
                  <div className={`transition-transform duration-300 ${showSurprise ? 'rotate-180' : ''}`}>
                    <ChevronDown className="w-5 h-5 text-zinc-500" />
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
                      <div className="p-6 bg-zinc-900 border-2 border-zinc-800 rounded-2xl space-y-6 shadow-sm">
                        <div className="space-y-3">
                          <label className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-purple-600 text-white text-xs font-black">1</span>
                            Choose an emotion
                          </label>
                          <div className="flex flex-wrap gap-2">
                            {EMOTIONS.map((e) => {
                              const isSelected = selectedEmotion === e.id;
                              return (
                                <button
                                  key={e.id}
                                  onClick={() => setSelectedEmotion(e.id)}
                                  className={`px-4 py-2.5 rounded-xl border-2 text-xs font-bold transition-all ${
                                    isSelected 
                                      ? `${emotionColorMap[e.color]} shadow-md scale-105` 
                                      : 'border-zinc-700 bg-zinc-800 text-zinc-400 hover:border-zinc-600'
                                  }`}
                                >
                                  <span className="mr-1.5">{e.emoji}</span>
                                  {e.label}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                        <div className="space-y-3">
                          <label className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-purple-600 text-white text-xs font-black">2</span>
                            Your secret message
                          </label>
                          <div className="relative">
                            <textarea
                              value={secretMessage}
                              onChange={(e) => setSecretMessage(e.target.value.slice(0, maxMessageLength))}
                              placeholder="Write something heartfelt that will be revealed when they receive their gift..."
                              className="w-full bg-zinc-800 border-2 border-zinc-700 rounded-xl p-4 text-sm text-white placeholder:text-zinc-600 outline-none focus:border-purple-500 focus:bg-zinc-800/80 transition-all h-32 font-medium resize-none"
                            />
                            <div className="absolute bottom-3 right-3 text-xs text-zinc-500 font-semibold">
                              {secretMessage.length} / {maxMessageLength}
                            </div>
                          </div>
                          {secretMessage.length > 0 && secretMessage.length < minMessageLength && (
                            <p className="text-xs text-amber-500 font-medium">
                              ✨ Add {minMessageLength - secretMessage.length} more characters
                            </p>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* VARIANT SELECTORS */}
            <div className="py-8 space-y-8 border-t border-zinc-800">
              {attributeTypes.map(type => {
                const values = Array.from(new Set(
                  product.variants.flatMap((v) => v.attributes).filter((a) => a.attribute_name === type).map((a) => a.value)
                ));
                
                return (
                  <div key={type}>
                    <label className="text-xs font-bold text-white uppercase tracking-wider mb-4 block">
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
                              className={`w-12 h-12 rounded-full border-2 transition-all shadow-md ${
                                isSelected 
                                  ? 'border-white scale-110 ring-2 ring-white ring-offset-2 ring-offset-zinc-950' 
                                  : 'border-zinc-700 hover:border-zinc-600'
                              } flex items-center justify-center`}
                              style={{ backgroundColor: val }}
                              title={val}
                            >
                              {isSelected && <Check className="w-5 h-5 text-white drop-shadow-lg" />}
                            </button>
                          );
                        }
                        return (
                          <button
                            key={val}
                            onClick={() => setSelectedAttributes(prev => ({ ...prev, [type]: val }))}
                            className={`px-6 py-3 rounded-xl border-2 text-sm font-bold transition-all ${
                              isSelected 
                                ? 'border-red-600 bg-red-600 text-white shadow-xl shadow-red-600/30' 
                                : 'border-zinc-700 text-zinc-300 hover:border-zinc-600 bg-zinc-900'
                            }`}
                          >
                            {val}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}

              {/* QUANTITY SELECTOR */}
              <div>
                <label className="text-xs font-bold text-white uppercase tracking-wider mb-4 block">Quantity</label>
                <div className="inline-flex items-center bg-zinc-900 border-2 border-zinc-800 rounded-xl overflow-hidden">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= (product.min_order_quantity || 1)}
                    className="w-14 h-14 flex items-center justify-center hover:bg-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <Minus className="w-5 h-5 text-white" />
                  </button>
                  <div className="w-20 h-14 flex items-center justify-center border-x-2 border-zinc-800 font-bold text-xl text-white">
                    {quantity}
                  </div>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= currentStock}
                    className="w-14 h-14 flex items-center justify-center hover:bg-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <Plus className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="sticky bottom-0 bg-zinc-950 pt-6 pb-4 border-t border-zinc-800 mt-auto">
              {product.is_customizable ? (
                <button
                  onClick={() => router.push(`/editor?product=${product.id}`)}
                  className="group relative w-full py-5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl font-bold text-base uppercase tracking-wider overflow-hidden shadow-lg shadow-purple-600/30 hover:shadow-xl hover:shadow-purple-600/40 transition-all"
                >
                  <span className="relative z-10 flex items-center justify-center gap-3">
                    <Palette className="w-5 h-5" />
                    Customize Your Design
                  </span>
                </button>
              ) : (
                <button
                  onClick={handleAddToCart}
                  disabled={isAdding || (product.variants.length > 0 && !activeVariant) || quantity > currentStock || currentStock === 0 || !isSurpriseValid}
                  className="w-full py-5 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-2xl font-bold text-base uppercase tracking-wider hover:shadow-xl hover:shadow-red-600/30 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isAdding ? (
                    <Loader2 className="animate-spin w-6 h-6" />
                  ) : (
                    <>
                      <ShoppingBag className="w-5 h-5" />
                      Add to Cart - ₦{(parseFloat(currentPrice) * quantity).toLocaleString()}
                    </>
                  )}
                </button>
              )}
            </div>

            {/* PRODUCT DETAILS TABS */}
            <div className="mt-8 space-y-2">
              {[
                { key: 'details', label: 'Product Details', content: product.description },
                { key: 'shipping', label: 'Shipping & Returns', content: '72-hour nationwide delivery. Premium packaging ensures your gift arrives perfectly. Free returns within 30 days of purchase.' }
              ].map((tab) => {
                const isActive = activeTab === tab.key;
                return (
                  <div key={tab.key} className="border-2 border-zinc-800 rounded-xl overflow-hidden bg-zinc-900">
                    <button
                      onClick={() => setActiveTab(isActive ? '' as any : tab.key as any)}
                      className="w-full flex items-center justify-between p-5 hover:bg-zinc-800 transition-colors"
                    >
                      <span className="font-bold text-sm text-white">{tab.label}</span>
                      <ChevronDown className={`w-5 h-5 text-zinc-500 transition-transform ${isActive ? 'rotate-180' : ''}`} />
                    </button>
                    <AnimatePresence>
                      {isActive && (
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: 'auto' }}
                          exit={{ height: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="p-5 pt-0 text-sm text-zinc-400 leading-relaxed border-t border-zinc-800">
                            {tab.content}
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

        {/* RELATED PRODUCTS */}
        {relatedProducts.length > 0 && (
          <section className="border-t border-zinc-800 pt-16">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-white">You May Also Like</h2>
              <button
                onClick={() => router.push('/shop')}
                className="text-sm font-semibold text-red-500 hover:text-red-400 flex items-center gap-2 group"
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
                  {/* Fixed aspect ratio card */}
                  <div className="relative rounded-2xl overflow-hidden bg-zinc-900 border-2 border-zinc-800 mb-4 shadow-lg hover:shadow-xl hover:border-red-600/50 transition-all duration-300"
                       style={{ aspectRatio: '1/1' }}>
                    <div className="w-full h-full flex items-center justify-center p-4">
                      {item.image_url ? (
                        <img
                          src={item.image_url}
                          alt={item.name}
                          loading="lazy"
                          className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-700"
                        />
                      ) : (
                        <Package className="w-16 h-16 text-zinc-700" />
                      )}
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <h3 className="text-sm font-bold text-white mb-1 group-hover:text-red-400 transition-colors line-clamp-2 leading-tight">
                    {item.name}
                  </h3>
                  <p className="text-base font-bold text-red-500">
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
              className="relative w-full h-full max-w-5xl max-h-[90vh] flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              {allImages[selectedImageIndex] && (
                <img
                  src={allImages[selectedImageIndex]}
                  alt={product.name}
                  loading='lazy'
                  className="max-w-full max-h-full object-contain"
                />
              )}
              <button
                onClick={() => setIsImageModalOpen(false)}
                className="absolute top-4 right-4 w-12 h-12 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors backdrop-blur-sm"
              >
                <X className="w-6 h-6 text-white" />
              </button>
              {allImages.length > 1 && (
                <>
                  <button
                    onClick={handlePrevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors backdrop-blur-sm"
                  >
                    <ChevronLeft className="w-6 h-6 text-white" />
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors backdrop-blur-sm"
                  >
                    <ChevronRight className="w-6 h-6 text-white" />
                  </button>
                </>
              )}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-sm text-white px-4 py-2 rounded-full text-xs font-bold">
                {selectedImageIndex + 1} / {allImages.length}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* SUCCESS MODAL */}
      <AnimatePresence>
        {showSuccessModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[100] p-6">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-zinc-900 border-2 border-zinc-800 p-8 lg:p-12 rounded-3xl max-w-lg w-full text-center shadow-2xl"
            >
              <div className="w-20 h-20 bg-green-600/20 border-2 border-green-600 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="w-10 h-10" />
              </div>
              <h2 className="text-3xl font-black mb-4 text-white">Added to Cart!</h2>
              <p className="text-zinc-400 mb-8 text-sm leading-relaxed">
                Your gift has been saved to your cart.
              </p>
              <div className="flex flex-col gap-3">
                <button 
                  onClick={() => { setShowSuccessModal(false); router.push('/cart'); }} 
                  className="w-full py-4 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-xl font-bold text-sm uppercase tracking-wider hover:shadow-xl hover:shadow-red-600/30 transition-all"
                >
                  View Cart & Checkout
                </button>
                <button 
                  onClick={() => setShowSuccessModal(false)} 
                  className="w-full py-4 border-2 border-zinc-800 text-zinc-400 rounded-xl font-bold text-sm uppercase tracking-wider hover:border-zinc-700 hover:text-white transition-all"
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