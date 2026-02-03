// app/shop/[slug]/ClientProductDetail.tsx
// Product Detail - Bold, immersive product showcase with fixed image sizes

"use client";

import { useState } from 'react';
import Link from 'next/link';
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
  slug: string;
  description: string;
  base_price: string;
  category_name: string;
  category_slug: string;
  image_url: string | null;
  gallery: ProductImage[];
  variants: ProductVariant[];
  min_order_quantity: number;
  is_customizable: boolean;
  is_active: boolean;
  is_featured: boolean;
  is_trending: boolean;
  stock_quantity?: number;
  sku?: string;
  // Add if API provides: ratings?: { average: number; count: number };
}

export default function ClientProductDetail({ product: initialProduct, relatedProducts: initialRelatedProducts }: { product: ProductDetail; relatedProducts: ProductDetail[] }) {
  const [product, setProduct] = useState<ProductDetail | null>(initialProduct);
  const [relatedProducts, setRelatedProducts] = useState<ProductDetail[]>(initialRelatedProducts);
  const [loading, setLoading] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showShareModal, setShowShareModal] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  const handleAddToCart = () => {
    // TODO: Implement cart logic
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 3000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product?.name,
          text: `Check out ${product?.name} on Lensra!`,
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950">
        <div className="relative">
          <div className="w-16 h-16 rounded-full border-4 border-zinc-800 border-t-red-500 animate-spin" />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-white">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-zinc-800 rounded-full mb-6">
            <Package className="w-10 h-10 text-zinc-600" />
          </div>
          <h2 className="text-2xl font-bold mb-4">Product not found</h2>
          <Link href="/shop" className="text-red-500 hover:text-red-400 flex items-center gap-2 justify-center">
            <ChevronLeft className="w-4 h-4" />
            Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  const price = parseFloat(product.base_price);
  const totalPrice = price * quantity;

  const productImages = [
    product.image_url,
    ...product.gallery.map((g) => g.image_url),
  ].filter((url): url is string => !!url);

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
              href={`/shop?category=${product.category_slug}`} 
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
                  <img
                    src={productImages[selectedImage]}
                    alt={product.name}
                    className="w-full h-full object-contain p-8"
                  />
                  
                  {/* Badges */}
                  <div className="absolute top-6 left-6 flex flex-col gap-2">
                    {product.is_trending && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-600 text-white rounded-lg text-xs font-bold shadow-lg">
                        <Zap className="w-3 h-3 fill-white" />
                        Trending
                      </span>
                    )}
                    {product.is_featured && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 text-white rounded-lg text-xs font-bold shadow-lg">
                        <Star className="w-3 h-3 fill-white" />
                        Featured
                      </span>
                    )}
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

            {/* Thumbnail Gallery - if multiple images exist */}
            {productImages.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {productImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`relative flex-shrink-0 w-20 h-20 bg-zinc-900 border-2 rounded-xl overflow-hidden transition-all ${
                      selectedImage === idx ? 'border-red-500' : 'border-zinc-800 hover:border-zinc-700'
                    }`}
                  >
                    <img src={img} alt={`${product.name} ${idx + 1}`} className="w-full h-full object-cover" />
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
                href={`/shop?category=${product.category_slug}`}
                className="inline-block mb-3 text-xs font-bold uppercase tracking-wider text-red-500 hover:text-red-400 transition-colors"
              >
                {product.category_name}
              </Link>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter leading-tight mb-4">
                {product.name}
              </h1>
              {product.sku && (
                <p className="text-sm text-zinc-500">SKU: {product.sku}</p>
              )}
            </div>

            {/* Price */}
            <div className="border-y border-zinc-800 py-6">
              <div className="flex items-baseline gap-3">
                <span className="text-5xl font-black text-red-500">
                  ₦{price.toLocaleString()}
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
            {product.stock_quantity !== undefined && (
              <div className="flex items-center gap-2">
                {product.stock_quantity > 0 ? (
                  <>
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-sm font-semibold text-green-500">
                      {product.stock_quantity > 10 ? 'In Stock' : `Only ${product.stock_quantity} left`}
                    </span>
                  </>
                ) : (
                  <>
                    <div className="w-2 h-2 bg-red-500 rounded-full" />
                    <span className="text-sm font-semibold text-red-500">Out of Stock</span>
                  </>
                )}
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
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="p-4 hover:bg-zinc-800 transition-colors"
                    disabled={quantity <= 1}
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-8 py-4 font-bold text-lg border-x border-zinc-800">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(q => q + 1)}
                    className="p-4 hover:bg-zinc-800 transition-colors"
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
                  disabled={product.stock_quantity === 0}
                  className={`w-full flex items-center justify-center gap-3 py-4 rounded-xl font-bold text-lg transition-all ${
                    addedToCart
                      ? 'bg-green-600 text-white'
                      : product.stock_quantity === 0
                      ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
                      : 'bg-gradient-to-r from-red-600 to-red-500 text-white hover:shadow-xl hover:shadow-red-500/30'
                  }`}
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
                >
                  <Heart className={`w-5 h-5 ${isFavorite ? 'fill-red-500' : ''}`} />
                  {isFavorite ? 'Saved' : 'Save'}
                </button>
                <button
                  onClick={handleShare}
                  className="flex-1 flex items-center justify-center gap-2 py-3 border-2 border-zinc-800 rounded-xl font-semibold text-zinc-400 hover:border-zinc-700 transition-all"
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
                href={`/shop?category=${product.category_slug}`}
                className="text-sm font-semibold text-red-500 hover:text-red-400 flex items-center gap-2"
              >
                View All
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {relatedProducts.slice(0, 4).map((relatedProduct) => (
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

function RelatedProductCard({ 
  product
}: { 
  product: ProductDetail; 
}) {
  const imageUrl = product.image_url;

  return (
    <Link href={`/shop/${product.slug}`} className="group block">
      <div className="relative bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden hover:border-red-500/50 transition-all duration-300">
        {/* Fixed aspect ratio image container */}
        <div className="relative aspect-square bg-zinc-800 overflow-hidden">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={product.name}
              loading="lazy"
              className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Package className="w-12 h-12 text-zinc-700" />
            </div>
          )}

          {/* Quick badges */}
          {product.is_trending && (
            <div className="absolute top-2 left-2">
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-600 text-white rounded-md text-xs font-bold shadow-lg">
                <Zap className="w-3 h-3 fill-white" />
                Hot
              </span>
            </div>
          )}

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute bottom-3 left-3 right-3">
              <button className="w-full py-2 bg-white text-zinc-900 rounded-lg text-xs font-bold hover:bg-red-500 hover:text-white transition-colors shadow-xl">
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