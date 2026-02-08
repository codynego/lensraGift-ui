// app/shop/[id]/ClientProductDetail.tsx

"use client";

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  Heart,
  Palette,
  Loader2,
  ShoppingBag,
  Plus,
  Minus,
  Sparkles,
  Check,
  ChevronDown,
  Star,
  ChevronLeft,
  ChevronRight,
  X,
  Share2,
  Truck,
  Shield,
  RotateCcw,
  Zap,
  Clock,
  Package,
  Award,
  TrendingUp,
  MessageCircle,
  Info,
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
  slug: string;
  description: string;
  base_price: string;
  display_price?: string;
  original_price?: string | null;
  is_on_sale?: boolean;
  sale_label?: string | null;
  sale_ends_in?: number | null;
  category_name: string;
  image_url: string | null;
  gallery: ProductImage[];
  variants: ProductVariant[];
  min_order_quantity: number;
  is_customizable: boolean;
  message: string | null;
}

const EMOTIONS = [
  { id: 'loved', label: 'Loved', emoji: '❤️', color: 'red' },
  { id: 'joyful', label: 'Joyful', emoji: '😊', color: 'amber' },
  { id: 'emotional', label: 'Emotional', emoji: '🥹', color: 'blue' },
  { id: 'appreciated', label: 'Appreciated', emoji: '🙏', color: 'green' },
  { id: 'remembered', label: 'Remembered', emoji: '💭', color: 'purple' },
];

const TRUST_BADGES = [
  {
    icon: Truck,
    title: 'Express Delivery',
    description: '3-5 days nationwide',
    color: 'red',
  },
  {
    icon: Shield,
    title: 'Secure Payment',
    description: '100% protected',
    color: 'black',
  },
  {
    icon: RotateCcw,
    title: '30-Day Returns',
    description: 'Hassle-free guarantee',
    color: 'red',
  },
  {
    icon: Award,
    title: 'Premium Quality',
    description: 'Verified craftsmanship',
    color: 'black',
  },
];

export default function ClientProductDetail({
  initialProduct,
  initialRelatedProducts,
  baseUrl,
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
  const [remainingTime, setRemainingTime] = useState(initialProduct.sale_ends_in || 0);

  const activeVariant = useMemo(() => {
    if (!product?.variants || product.variants.length === 0) return null;
    return product.variants.find((v) =>
      v.attributes.every((attr) => selectedAttributes[attr.attribute_name] === attr.value)
    ) || null;
  }, [selectedAttributes, product]);

  const currentPrice = useMemo(() => {
    return activeVariant?.price_override || product.display_price || product.base_price || "0";
  }, [activeVariant, product]);

  const calculateDiscount = () => {
    if (!product.is_on_sale || !product.original_price) return 0;
    const original = parseFloat(product.original_price);
    const current = parseFloat(currentPrice);
    return Math.round(((original - current) / original) * 100);
  };

  const attributeTypes = Array.from(new Set(product?.variants?.flatMap((v) => v.attributes.map((a) => a.attribute_name)) || []));
  const allImages = [product.image_url, ...product.gallery.map((g) => g.image_url)].filter(Boolean) as string[];
  const currentStock = activeVariant?.stock_quantity ?? Infinity;
  const minMessageLength = 50;
  const maxMessageLength = 300;
  const isSurpriseValid = !showSurprise || (selectedEmotion && secretMessage.length >= minMessageLength && secretMessage.length <= maxMessageLength);

  useEffect(() => {
    if (!product.is_on_sale || remainingTime <= 0) return;

    const interval = setInterval(() => {
      setRemainingTime((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [remainingTime, product.is_on_sale]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const addItemToCart = async (redirectToCheckout: boolean = false) => {
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
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
        body: JSON.stringify({
          product: product.id,
          variant: activeVariant?.id || null,
          quantity: quantity,
          secret_message: showSurprise ? secretMessage : null,
          emotion: showSurprise ? selectedEmotion : null,
          ...(!token && { session_id: sessionId }),
        }),
      });

      if (res.ok) {
        window.dispatchEvent(new Event('storage'));

        if (redirectToCheckout) {
          router.push('/checkout');
        } else {
          setShowSuccessModal(true);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsAdding(false);
    }
  };

  const handleAddToCart = () => addItemToCart(false);
  const handleBuyNow = () => addItemToCart(true);

  const handleImageChange = (index: number) => setSelectedImageIndex(index);
  const handlePrevImage = () => setSelectedImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  const handleNextImage = () => setSelectedImageIndex((prev) => (prev + 1) % allImages.length);

  const handleQuantityChange = (delta: number) => {
    const newQuantity = Math.max(product.min_order_quantity || 1, quantity + delta);
    setQuantity(Math.min(newQuantity, currentStock));
  };

  const handleCustomize = () => {
    router.push(`/editor?product=${product.id}`);
  };

  const isColorAttribute = (type: string) => type.toLowerCase().includes('color');

  const discount = calculateDiscount();

  return (
    <div className="min-h-screen bg-white">
      {/* Sticky Header */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-sm font-bold text-black hover:text-red-600 transition-colors group"
            >
              <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span>Back</span>
            </button>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsFavorited(!isFavorited)}
                className="p-3 rounded-full hover:bg-gray-100 transition-all group"
              >
                <Heart className={`w-5 h-5 transition-all ${isFavorited ? 'fill-red-600 text-red-600 scale-110' : 'text-gray-400 group-hover:text-red-600'}`} />
              </button>
              <button className="p-3 rounded-full hover:bg-gray-100 transition-all group">
                <Share2 className="w-5 h-5 text-gray-400 group-hover:text-black" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-16">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 mb-20">
          {/* IMAGE GALLERY */}
          <div className="lg:sticky lg:top-24 self-start">
            <div className="space-y-6">
              {/* Main Image */}
              <div
                className="relative bg-gray-50 rounded-3xl overflow-hidden aspect-square cursor-zoom-in group border-2 border-gray-200 hover:border-red-600 transition-all"
                onClick={() => setIsImageModalOpen(true)}
              >
                {allImages[selectedImageIndex] && (
                  <img
                    src={allImages[selectedImageIndex]}
                    alt={product.name}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                )}

                {/* Sale Badge */}
                {product.is_on_sale && discount > 0 && (
                  <div className="absolute top-6 right-6">
                    <div className="bg-red-600 text-white rounded-full w-20 h-20 flex items-center justify-center shadow-2xl border-4 border-white">
                      <div className="text-center">
                        <p className="text-2xl font-black leading-none">-{discount}%</p>
                        <p className="text-xs font-bold uppercase">Off</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Stock Warning */}
                {currentStock < 10 && currentStock > 0 && (
                  <div className="absolute top-6 left-6">
                    <div className="bg-black text-white px-4 py-2 rounded-full text-xs font-bold uppercase flex items-center gap-2">
                      <Zap className="w-3.5 h-3.5" />
                      Only {currentStock} Left
                    </div>
                  </div>
                )}

                {/* Navigation Arrows */}
                {allImages.length > 1 && (
                  <>
                    <button
                      onClick={(e) => { e.stopPropagation(); handlePrevImage(); }}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-white hover:bg-black text-black hover:text-white rounded-full p-3 shadow-xl transition-all opacity-0 group-hover:opacity-100"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleNextImage(); }}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-white hover:bg-black text-black hover:text-white rounded-full p-3 shadow-xl transition-all opacity-0 group-hover:opacity-100"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  </>
                )}

                <div className="absolute bottom-6 right-6 bg-black/80 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-bold">
                  {selectedImageIndex + 1} / {allImages.length}
                </div>
              </div>

              {/* Thumbnail Gallery */}
              {allImages.length > 1 && (
                <div className="grid grid-cols-5 gap-4">
                  {allImages.slice(0, 5).map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleImageChange(idx)}
                      className={`relative aspect-square rounded-2xl overflow-hidden border-2 transition-all ${
                        selectedImageIndex === idx
                          ? 'border-red-600 scale-95 shadow-lg'
                          : 'border-gray-200 hover:border-gray-400 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt={`View ${idx + 1}`} loading="lazy" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* Trust Badges */}
              <div className="grid grid-cols-2 gap-4 pt-8 border-t-2 border-gray-200">
                {TRUST_BADGES.map((badge, index) => {
                  const Icon = badge.icon;
                  return (
                    <div key={index} className="flex items-start gap-3 p-4 bg-gray-50 rounded-2xl">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        badge.color === 'red' ? 'bg-red-600' : 'bg-black'
                      }`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-black">{badge.title}</p>
                        <p className="text-xs text-gray-600">{badge.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* PRODUCT INFO */}
          <div className="flex flex-col">
            {/* Header Info */}
            <div className="space-y-6 pb-8 border-b-2 border-gray-200">
              <div className="flex items-center gap-3 flex-wrap">
                <span className="inline-flex items-center gap-2 bg-black text-white px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider">
                  {product.category_name}
                </span>
                {product.is_on_sale && product.sale_label && (
                  <span className="inline-flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider border-2 border-red-600">
                    <Zap className="w-3.5 h-3.5" />
                    {product.sale_label}
                  </span>
                )}
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-black leading-tight">
                {product.name}
              </h1>

              {/* Price Section */}
              <div className="space-y-3">
                <div className="flex flex-wrap items-baseline gap-4">
                  <span className="text-5xl sm:text-6xl font-black text-black">
                    ₦{parseFloat(currentPrice).toLocaleString()}
                  </span>
                  {product.is_on_sale && product.original_price && (
                    <span className="text-3xl font-bold text-gray-400 line-through">
                      ₦{parseFloat(product.original_price).toLocaleString()}
                    </span>
                  )}
                </div>

                {/* Sale Timer */}
                {product.is_on_sale && remainingTime > 0 && (
                  <div className="inline-flex items-center gap-3 bg-red-600 text-white px-6 py-3 rounded-full">
                    <Clock className="w-5 h-5 animate-pulse" />
                    <span className="text-sm font-bold">Sale ends in</span>
                    <span className="text-lg font-black bg-white text-red-600 px-4 py-1 rounded-full">
                      {formatTime(remainingTime)}
                    </span>
                  </div>
                )}
              </div>

              {/* Description */}
              <p className="text-gray-700 leading-relaxed text-lg">
                {product.description.split('\n')[0]}
              </p>

              {/* Special Message */}
              {product.message && (
                <div className="bg-red-50 border-2 border-red-200 p-6 rounded-2xl">
                  <div className="flex items-start gap-3">
                    <Info className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-lg font-bold text-black mb-2">Special Note</h3>
                      <p className="text-gray-700 leading-relaxed">{product.message}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Secret Message Feature */}
            {!product.is_customizable && (
              <div className="py-8 border-b-2 border-gray-200">
                <button
                  onClick={() => setShowSurprise(!showSurprise)}
                  className={`w-full flex items-center justify-between p-6 rounded-2xl border-2 transition-all ${
                    showSurprise
                      ? 'border-red-600 bg-red-50 shadow-lg'
                      : 'border-gray-200 bg-white hover:border-gray-400'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all ${
                      showSurprise ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-400'
                    }`}>
                      <Sparkles className="w-8 h-8" />
                    </div>
                    <div className="text-left">
                      <h3 className="text-xl font-black text-black mb-1">Add Secret Message ✨</h3>
                      <p className="text-sm text-gray-600">Create a magical reveal moment</p>
                    </div>
                  </div>
                  <ChevronDown className={`w-6 h-6 text-gray-400 transition-transform ${showSurprise ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {showSurprise && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-6 p-8 bg-white rounded-2xl border-2 border-gray-200 space-y-8">
                        {/* Step 1: Emotion Selection */}
                        <div className="space-y-4">
                          <label className="flex items-center gap-3 text-sm font-black text-black uppercase tracking-wider">
                            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-red-600 text-white text-sm font-black">1</span>
                            Choose Emotion
                          </label>
                          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                            {EMOTIONS.map((e) => {
                              const isSelected = selectedEmotion === e.id;
                              return (
                                <button
                                  key={e.id}
                                  onClick={() => setSelectedEmotion(e.id)}
                                  className={`p-4 rounded-xl border-2 text-sm font-bold transition-all text-center ${
                                    isSelected 
                                      ? 'border-red-600 bg-red-50 text-red-600 scale-105 shadow-lg' 
                                      : 'border-gray-200 bg-white text-gray-600 hover:border-gray-400'
                                  }`}
                                >
                                  <div className="text-3xl mb-2">{e.emoji}</div>
                                  <div className="text-xs font-bold">{e.label}</div>
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Step 2: Message */}
                        <div className="space-y-4">
                          <label className="flex items-center gap-3 text-sm font-black text-black uppercase tracking-wider">
                            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-red-600 text-white text-sm font-black">2</span>
                            Your Secret Message
                          </label>
                          <div className="relative">
                            <textarea
                              value={secretMessage}
                              onChange={(e) => setSecretMessage(e.target.value.slice(0, maxMessageLength))}
                              placeholder="Write something heartfelt that will surprise them when they receive their gift..."
                              className="w-full bg-gray-50 border-2 border-gray-200 rounded-2xl p-6 text-base outline-none focus:border-red-600 focus:bg-white transition-all h-40 resize-none placeholder:text-gray-400"
                            />
                            <div className="absolute bottom-4 right-4 text-sm font-bold text-gray-400">
                              {secretMessage.length} / {maxMessageLength}
                            </div>
                          </div>
                          {secretMessage.length > 0 && secretMessage.length < minMessageLength && (
                            <p className="text-sm text-red-600 font-medium flex items-center gap-2">
                              <MessageCircle className="w-4 h-4" />
                              Add {minMessageLength - secretMessage.length} more characters
                            </p>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Variants & Quantity */}
            <div className="py-8 space-y-8 border-b-2 border-gray-200">
              {/* Variant Selection */}
              {attributeTypes.map((type) => {
                const values = Array.from(
                  new Set(
                    product.variants
                      .flatMap((v) => v.attributes)
                      .filter((a) => a.attribute_name === type)
                      .map((a) => a.value)
                  )
                );

                return (
                  <div key={type}>
                    <label className="text-sm font-black text-black uppercase tracking-wider mb-4 block">
                      {type}: <span className="text-red-600">{selectedAttributes[type] || 'Select'}</span>
                    </label>
                    <div className="flex flex-wrap gap-3">
                      {values.map((val) => {
                        const isSelected = selectedAttributes[type] === val;
                        if (isColorAttribute(type)) {
                          return (
                            <button
                              key={val}
                              onClick={() => setSelectedAttributes((prev) => ({ ...prev, [type]: val }))}
                              className={`w-14 h-14 rounded-full border-2 transition-all ${
                                isSelected
                                  ? 'border-black scale-110 ring-4 ring-red-600 ring-offset-2'
                                  : 'border-gray-300 hover:border-black'
                              }`}
                              style={{ backgroundColor: val }}
                              title={val}
                            >
                              {isSelected && <Check className="w-6 h-6 text-white drop-shadow-lg m-auto" />}
                            </button>
                          );
                        }
                        return (
                          <button
                            key={val}
                            onClick={() => setSelectedAttributes((prev) => ({ ...prev, [type]: val }))}
                            className={`px-6 py-3 rounded-xl border-2 text-base font-bold transition-all ${
                              isSelected
                                ? 'border-red-600 bg-red-600 text-white shadow-lg'
                                : 'border-gray-200 text-black hover:border-black bg-white'
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

              {/* Quantity Selector */}
              <div>
                <label className="text-sm font-black text-black uppercase tracking-wider mb-4 block">Quantity</label>
                <div className="inline-flex items-center bg-white border-2 border-gray-200 rounded-xl overflow-hidden">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= (product.min_order_quantity || 1)}
                    className="w-16 h-16 flex items-center justify-center hover:bg-gray-50 disabled:opacity-30 transition-all font-bold text-xl"
                  >
                    <Minus className="w-6 h-6" />
                  </button>
                  <div className="w-24 h-16 flex items-center justify-center border-x-2 border-gray-200 font-black text-2xl">
                    {quantity}
                  </div>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= currentStock}
                    className="w-16 h-16 flex items-center justify-center hover:bg-gray-50 disabled:opacity-30 transition-all font-bold text-xl"
                  >
                    <Plus className="w-6 h-6" />
                  </button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="sticky bottom-0 bg-white pt-8 pb-4 -mx-4 px-4 sm:mx-0 sm:px-0 lg:static">
              <div className="space-y-4">
                {/* Customize Button */}
                {product.is_customizable && (
                  <button
                    onClick={handleCustomize}
                    className="w-full py-5 bg-black hover:bg-gray-900 text-white rounded-2xl font-bold text-base uppercase tracking-wider flex items-center justify-center gap-3 shadow-xl transition-all active:scale-95"
                  >
                    <Palette className="w-6 h-6" />
                    Customize Your Design
                  </button>
                )}

                {/* Buy Now - Primary CTA */}
                <button
                  onClick={handleBuyNow}
                  disabled={isAdding || (product.variants.length > 0 && !activeVariant) || quantity > currentStock || currentStock === 0 || !isSurpriseValid}
                  className="w-full py-6 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-black text-lg uppercase tracking-wider flex items-center justify-center gap-3 shadow-2xl shadow-red-600/30 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isAdding ? (
                    <Loader2 className="animate-spin w-6 h-6" />
                  ) : (
                    <>
                      <Zap className="w-6 h-6" />
                      Buy Now - ₦{(parseFloat(currentPrice) * quantity).toLocaleString()}
                    </>
                  )}
                </button>

                {/* Add to Cart - Secondary */}
                <button
                  onClick={handleAddToCart}
                  disabled={isAdding || (product.variants.length > 0 && !activeVariant) || quantity > currentStock || currentStock === 0 || !isSurpriseValid}
                  className="w-full py-6 border-2 border-black hover:bg-black hover:text-white text-black rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isAdding ? (
                    <Loader2 className="animate-spin w-6 h-6" />
                  ) : (
                    <>
                      <ShoppingBag className="w-6 h-6" />
                      Add to Cart
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Product Details Tabs */}
            <div className="mt-12 space-y-4">
              {[
                { key: 'details', label: 'Product Details', content: product.description },
                { key: 'shipping', label: 'Shipping & Returns', content: 'Standard delivery: 3-5 business days nationwide. Express shipping available at checkout. Free shipping on orders over ₦50,000. Easy 30-day returns - no questions asked.' },
              ].map((tab) => {
                const isActive = activeTab === tab.key;
                return (
                  <div key={tab.key} className="border-2 border-gray-200 rounded-2xl overflow-hidden">
                    <button
                      onClick={() => setActiveTab(isActive ? ('' as any) : (tab.key as any))}
                      className="w-full flex items-center justify-between p-6 hover:bg-gray-50 transition-colors"
                    >
                      <span className="font-black text-lg text-black">{tab.label}</span>
                      <ChevronDown className={`w-6 h-6 text-gray-400 transition-transform ${isActive ? 'rotate-180' : ''}`} />
                    </button>
                    <AnimatePresence>
                      {isActive && (
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: 'auto' }}
                          exit={{ height: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="p-6 pt-0 text-base text-gray-700 leading-relaxed border-t-2 border-gray-200">
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

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="border-t-2 border-gray-200 pt-16">
            <div className="flex justify-between items-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-black text-black">You May Also Like</h2>
              <button
                onClick={() => router.push('/shop')}
                className="text-base font-bold text-black hover:text-red-600 flex items-center gap-2 group"
              >
                View All
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
              {relatedProducts.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    router.push(`/shop/${item.slug}`);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="group cursor-pointer"
                >
                  <div className="aspect-square rounded-2xl overflow-hidden bg-gray-50 mb-4 border-2 border-gray-200 relative group-hover:border-red-600 transition-all">
                    {item.image_url && (
                      <img
                        src={item.image_url}
                        alt={item.name}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all" />
                  </div>
                  <h3 className="text-base font-bold text-black mb-2 group-hover:text-red-600 transition-colors line-clamp-2">
                    {item.name}
                  </h3>
                  <p className="text-lg font-black text-black">
                    ₦{parseFloat((item.display_price || item.base_price) || '0').toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Image Modal */}
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
              className="relative max-w-6xl w-full h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              {allImages[selectedImageIndex] && (
                <img
                  src={allImages[selectedImageIndex]}
                  alt={product.name}
                  loading="lazy"
                  className="w-full h-full object-contain"
                />
              )}
              <button
                onClick={() => setIsImageModalOpen(false)}
                className="absolute top-4 right-4 bg-white hover:bg-red-600 text-black hover:text-white p-3 rounded-full transition-all"
              >
                <X className="w-7 h-7" />
              </button>
              {allImages.length > 1 && (
                <>
                  <button
                    onClick={handlePrevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white hover:bg-red-600 text-black hover:text-white p-4 rounded-full transition-all"
                  >
                    <ChevronLeft className="w-7 h-7" />
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white hover:bg-red-600 text-black hover:text-white p-4 rounded-full transition-all"
                  >
                    <ChevronRight className="w-7 h-7" />
                  </button>
                </>
              )}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white text-black px-6 py-3 rounded-full text-sm font-black">
                {selectedImageIndex + 1} / {allImages.length}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Success Modal */}
      <AnimatePresence>
        {showSuccessModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[100] p-6">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white p-12 rounded-3xl max-w-md w-full text-center shadow-2xl"
            >
              <div className="w-24 h-24 bg-red-600 text-white rounded-full flex items-center justify-center mx-auto mb-8">
                <Check className="w-12 h-12" />
              </div>
              <h2 className="text-4xl font-black text-black mb-4">Added to Cart!</h2>
              <p className="text-gray-600 mb-10 text-lg">
                Your item is ready for checkout
              </p>
              <div className="space-y-4">
                <button
                  onClick={() => {
                    setShowSuccessModal(false);
                    router.push('/cart');
                  }}
                  className="w-full py-5 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-bold text-base uppercase tracking-wider transition-all active:scale-95 shadow-xl"
                >
                  View Cart & Checkout
                </button>
                <button
                  onClick={() => setShowSuccessModal(false)}
                  className="w-full py-5 border-2 border-black text-black hover:bg-black hover:text-white rounded-2xl font-bold text-base uppercase tracking-wider transition-all"
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