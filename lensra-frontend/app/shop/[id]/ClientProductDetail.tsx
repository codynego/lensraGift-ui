// app/shop/[id]/ClientProductDetail.tsx
"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ChevronLeft, ChevronRight, Heart, Share2, ShoppingCart, 
  Check, Star, Package, Truck, ShieldCheck, Sparkles,
  Plus, Minus, X, ArrowRight, Zap, Info
} from 'lucide-react';

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
  // Assume no is_featured, is_trending, sku, stock_quantity on root (moved to variants)
}

interface ClientProductDetailProps {
  initialProduct: ProductDetail;
  initialRelatedProducts: ProductDetail[];
  baseUrl: string;
}

export default function ClientProductDetail({ initialProduct, initialRelatedProducts, baseUrl }: ClientProductDetailProps) {
  const product = initialProduct; // Rename for consistency; already non-null from server
  const relatedProducts = initialRelatedProducts;

  const [quantity, setQuantity] = useState(product.min_order_quantity || 1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showShareModal, setShowShareModal] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string>>({});

  // Process images (already absolute from server)
  const productImages = [
    product.image_url,
    ...product.gallery.map((g) => g.image_url),
  ].filter(Boolean) as string[];

  // Group attributes for selection
  const attributeGroups = product.variants.reduce((acc, variant) => {
    variant.attributes.forEach((attr) => {
      if (!acc[attr.attribute_name]) {
        acc[attr.attribute_name] = new Set<string>();
      }
      acc[attr.attribute_name].add(attr.value);
    });
    return acc;
  }, {} as Record<string, Set<string>>);

  // Find matching variant based on selected attributes
  const matchingVariant = product.variants.find((v) =>
    v.attributes.every((attr) => selectedAttributes[attr.attribute_name] === attr.value) &&
    Object.keys(selectedAttributes).length === v.attributes.length
  );

  const currentPrice = matchingVariant
    ? parseFloat(matchingVariant.price_override || product.base_price)
    : parseFloat(product.base_price);

  const currentStock = matchingVariant ? matchingVariant.stock_quantity : product.variants.reduce((sum, v) => sum + v.stock_quantity, 0);

  const maxQuantity = currentStock ?? Infinity;
  const minQuantity = product.min_order_quantity || 1;
  const totalPrice = currentPrice * quantity;
  const isValidSelection = !!matchingVariant || product.variants.length === 0;

  const handleAttributeChange = (attrName: string, value: string) => {
    setSelectedAttributes((prev) => ({ ...prev, [attrName]: value }));
  };

  const handleAddToCart = () => {
    if (!isValidSelection) return; // TODO: Show error toast
    // TODO: Implement cart logic with matchingVariant.id
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 3000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: `Check out ${product.name} on Lensra!`,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      setShowShareModal(true);
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setShowShareModal(false);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Share Modal */}
      {showShareModal && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowShareModal(false)}
        >
          <div 
            className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">Share Product</h3>
              <button onClick={() => setShowShareModal(false)} className="text-zinc-500 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <button
              onClick={copyLink}
              className="w-full py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-500 transition-colors"
            >
              Copy Link
            </button>
          </div>
        </div>
      )}

      {/* Breadcrumb */}
      <div className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-2 text-sm">
            <Link href="/shop" className="text-zinc-500 hover:text-red-500 transition-colors">
              Shop
            </Link>
            <ChevronRight className="w-4 h-4 text-zinc-700" />
            <Link 
              href={`/shop?category=${encodeURIComponent(product.category_name)}`} 
              className="text-zinc-500 hover:text-red-500 transition-colors"
            >
              {product.category_name}
            </Link>
            <ChevronRight className="w-4 h-4 text-zinc-700" />
            <span className="text-white font-semibold truncate">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-12 mb-20">
          {/* LEFT: Product Images */}
          <div className="space-y-6">
            {/* Main Image - Fixed Size */}
            <div className="relative bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden aspect-square max-w-2xl mx-auto">
              {productImages.length > 0 ? (
                <>
                  <Image
                    src={productImages[selectedImage]}
                    alt={product.gallery[selectedImage]?.alt_text || `${product.name} - Image ${selectedImage + 1}`}
                    fill
                    className="object-contain p-8"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                  />
                  
                  {/* Badges - assume based on data; add if API provides is_trending etc. */}
                  <div className="absolute top-6 left-6 flex flex-col gap-2">
                    {product.is_customizable && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-600 text-white rounded-lg text-xs font-bold shadow-lg">
                        <Sparkles className="w-3 h-3" />
                        Customizable
                      </span>
                    )}
                  </div>
                </>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-zinc-600">
                  <Package className="w-24 h-24 mb-4" />
                  <p className="text-sm font-semibold">No image available</p>
                </div>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {productImages.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {productImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`relative flex-shrink-0 w-20 h-20 bg-zinc-900 border-2 rounded-xl overflow-hidden transition-all ${
                      selectedImage === idx ? 'border-red-500' : 'border-zinc-800 hover:border-zinc-700'
                    }`}
                    aria-label={`Select image ${idx + 1}`}
                  >
                    <Image
                      src={img}
                      alt={product.gallery[idx]?.alt_text || `${product.name} thumbnail ${idx + 1}`}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: Product Info */}
          <div className="space-y-8">
            {/* Title & Category */}
            <div>
              <Link 
                href={`/shop?category=${encodeURIComponent(product.category_name)}`}
                className="inline-block mb-3 text-xs font-bold uppercase tracking-wider text-red-500 hover:text-red-400 transition-colors"
              >
                {product.category_name}
              </Link>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter leading-tight mb-4">
                {product.name}
              </h1>
            </div>

            {/* Price */}
            <div className="border-y border-zinc-800 py-6">
              <div className="flex items-baseline gap-3">
                <span className="text-5xl font-black text-red-500">
                  ₦{currentPrice.toLocaleString()}
                </span>
                {product.is_customizable && (
                  <span className="text-sm text-zinc-500">+ customization</span>
                )}
              </div>
            </div>

            {/* Description */}
            {product.description && (
              <div className="prose prose-invert max-w-none">
                <p className="text-zinc-300 leading-relaxed">
                  {product.description}
                </p>
              </div>
            )}

            {/* Stock Status */}
            <div className="flex items-center gap-2">
              {currentStock > 0 ? (
                <>
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-sm font-semibold text-green-500">
                    {currentStock > 10 ? 'In Stock' : `Only ${currentStock} left`}
                  </span>
                </>
              ) : (
                <>
                  <div className="w-2 h-2 bg-red-500 rounded-full" />
                  <span className="text-sm font-semibold text-red-500">Out of Stock</span>
                </>
              )}
            </div>

            {/* Attribute Selectors */}
            {Object.keys(attributeGroups).length > 0 && (
              <div className="space-y-4">
                {Object.entries(attributeGroups).map(([attrName, values]) => (
                  <div key={attrName}>
                    <label className="text-sm font-semibold uppercase tracking-wider text-zinc-400 block mb-2">
                      {attrName}
                    </label>
                    <div className="flex gap-2 flex-wrap">
                      {Array.from(values).map((value) => (
                        <button
                          key={value}
                          onClick={() => handleAttributeChange(attrName, value)}
                          className={`px-4 py-2 border rounded-xl font-semibold text-sm transition-all ${
                            selectedAttributes[attrName] === value
                              ? 'border-red-500 bg-red-500/10 text-red-500'
                              : 'border-zinc-800 text-zinc-400 hover:border-zinc-700'
                          }`}
                        >
                          {value}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Quantity Selector */}
            <div className="space-y-3">
              <label className="text-sm font-semibold uppercase tracking-wider text-zinc-400">
                Quantity
              </label>
              <div className="flex items-center gap-4">
                <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setQuantity(q => Math.max(minQuantity, q - 1))}
                    className="p-4 hover:bg-zinc-800 transition-colors"
                    disabled={quantity <= minQuantity}
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-8 py-4 font-bold text-lg border-x border-zinc-800">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(q => Math.min(maxQuantity, q + 1))}
                    className="p-4 hover:bg-zinc-800 transition-colors"
                    disabled={quantity >= maxQuantity}
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                {quantity > 1 && (
                  <span className="text-sm text-zinc-500">
                    Total: ₦{totalPrice.toLocaleString()}
                  </span>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              {product.is_customizable ? (
                <Link
                  href={`/editor?product=${product.id}`}
                  className="w-full flex items-center justify-center gap-3 py-4 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-xl font-bold text-lg hover:shadow-xl hover:shadow-red-500/30 transition-all group"
                >
                  <Sparkles className="w-5 h-5" />
                  Customize This Product
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              ) : (
                <button
                  onClick={handleAddToCart}
                  disabled={currentStock === 0 || !isValidSelection}
                  className={`w-full flex items-center justify-center gap-3 py-4 rounded-xl font-bold text-lg transition-all ${
                    addedToCart
                      ? 'bg-green-600 text-white'
                      : currentStock === 0 || !isValidSelection
                      ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
                      : 'bg-gradient-to-r from-red-600 to-red-500 text-white hover:shadow-xl hover:shadow-red-500/30'
                  }`}
                  aria-label={addedToCart ? 'Added to cart' : 'Add to cart'}
                >
                  {addedToCart ? (
                    <>
                      <Check className="w-5 h-5" />
                      Added to Cart!
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-5 h-5" />
                      Add to Cart
                    </>
                  )}
                </button>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => setIsFavorite(!isFavorite)}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 border-2 rounded-xl font-semibold transition-all ${
                    isFavorite
                      ? 'border-red-500 bg-red-500/10 text-red-500'
                      : 'border-zinc-800 text-zinc-400 hover:border-zinc-700'
                  }`}
                  aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                >
                  <Heart className={`w-5 h-5 ${isFavorite ? 'fill-red-500' : ''}`} />
                  {isFavorite ? 'Saved' : 'Save'}
                </button>
                <button
                  onClick={handleShare}
                  className="flex-1 flex items-center justify-center gap-2 py-3 border-2 border-zinc-800 rounded-xl font-semibold text-zinc-400 hover:border-zinc-700 transition-all"
                  aria-label="Share product"
                >
                  <Share2 className="w-5 h-5" />
                  Share
                </button>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 pt-8 border-t border-zinc-800">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-red-600/10 border border-red-600/20 rounded-xl mb-2">
                  <Truck className="w-6 h-6 text-red-500" />
                </div>
                <p className="text-xs font-semibold text-zinc-400">72hr Delivery</p>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-red-600/10 border border-red-600/20 rounded-xl mb-2">
                  <ShieldCheck className="w-6 h-6 text-red-500" />
                </div>
                <p className="text-xs font-semibold text-zinc-400">Quality Guaranteed</p>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-red-600/10 border border-red-600/20 rounded-xl mb-2">
                  <Package className="w-6 h-6 text-red-500" />
                </div>
                <p className="text-xs font-semibold text-zinc-400">Secure Packaging</p>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="border-t border-zinc-800 pt-12 mb-20">
          <div className="max-w-3xl">
            <h2 className="text-2xl font-bold mb-6">Product Details</h2>
            <div className="space-y-6">
              {product.description && (
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                  <div className="flex items-start gap-3">
                    <Info className="w-5 h-5 text-red-500 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-bold mb-2">Description</h3>
                      <p className="text-zinc-400 leading-relaxed">{product.description}</p>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                <div className="flex items-start gap-3">
                  <Package className="w-5 h-5 text-red-500 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold mb-2">Shipping Information</h3>
                    <p className="text-zinc-400 leading-relaxed">
                      Free delivery nationwide within 72 hours. Carefully packaged to ensure your gift arrives in perfect condition.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="border-t border-zinc-800 pt-20">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl md:text-4xl font-bold">You May Also Like</h2>
              <Link
                href={`/shop?category=${encodeURIComponent(product.category_name)}`}
                className="text-sm font-semibold text-red-500 hover:text-red-400 flex items-center gap-2"
              >
                View All
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <RelatedProductCard 
                  key={relatedProduct.id} 
                  product={relatedProduct}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

function RelatedProductCard({ product }: { product: ProductDetail }) {
  const imageUrl = product.image_url;

  const handleQuickView = () => {
    // TODO: Implement quick view modal
    console.log('Quick view for', product.name);
  };

  return (
    <Link href={`/shop/${product.id}`} className="group block">
      <div className="relative bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden hover:border-red-500/50 transition-all duration-300">
        {/* Fixed aspect ratio image container */}
        <div className="relative aspect-square bg-zinc-800 overflow-hidden">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={product.name}
              fill
              className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Package className="w-12 h-12 text-zinc-700" />
            </div>
          )}

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute bottom-3 left-3 right-3">
              <button 
                onClick={handleQuickView}
                className="w-full py-2 bg-white text-zinc-900 rounded-lg text-xs font-bold hover:bg-red-500 hover:text-white transition-colors shadow-xl"
                aria-label={`Quick view for ${product.name}`}
              >
                Quick View
              </button>
            </div>
          </div>
        </div>

        {/* Product info */}
        <div className="p-4">
          <h3 className="font-semibold text-white mb-1 line-clamp-2 group-hover:text-red-400 transition-colors text-sm leading-tight">
            {product.name}
          </h3>
          <p className="text-lg font-bold text-red-500">
            ₦{parseFloat(product.base_price).toLocaleString()}
          </p>
          {product.is_customizable && (
            <span className="inline-flex items-center gap-1 mt-2 text-xs text-purple-400">
              <Sparkles className="w-3 h-3" />
              Customizable
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}