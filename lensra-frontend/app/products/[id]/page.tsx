"use client";

import { useState, useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  Heart, Share2, ChevronRight, Check, Palette, 
  Loader2, ArrowLeft, ShoppingBag, Info, Plus, Minus 
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const BaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.lensra.com/";

// --- INTERFACES ---
interface ProductImage {
  id: number;
  image_url: string;
  alt_text: string;
}

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

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { token } = useAuth();
  
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [activeTab, setActiveTab] = useState('details');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string>>({});
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${BaseUrl}api/products/${params.id}/`);
        if (!response.ok) throw new Error('Product not found');
        const data = await response.json();
        
        setProduct(data);
        setSelectedImage(data.image);
        setQuantity(data.min_order_quantity || 1);
        
        // Fetch Related Products
        const relatedRes = await fetch(`${BaseUrl}api/products/?category__name=${data.category_name}`);
        if (relatedRes.ok) {
          const relatedData = await relatedRes.json();
          
          // 1. Extract the actual array (handles both paginated and non-paginated responses)
          const productsArray = Array.isArray(relatedData) ? relatedData : (relatedData.results || []);

          // 2. Filter and set state
          setRelatedProducts(
            productsArray
              .filter((p: any) => p.id !== data.id)
              .slice(0, 4)
          );
        }

        // Auto-select variants
        if (data.variants?.length > 0) {
          const initialAttrs: Record<string, string> = {};
          data.variants[0].attributes.forEach((attr: AttributeValue) => {
            initialAttrs[attr.attribute_name] = attr.value;
          });
          setSelectedAttributes(initialAttrs);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (params.id) fetchProductData();
  }, [params.id]);

  const activeVariant = useMemo(() => {
    if (!product?.variants || product.variants.length === 0) return null;
    return product.variants.find(v => 
      v.attributes.every(attr => selectedAttributes[attr.attribute_name] === attr.value)
    );
  }, [selectedAttributes, product]);

  const currentPrice = activeVariant?.price_override || product?.base_price || "0";
  const attributeTypes = Array.from(new Set(product?.variants?.flatMap(v => v.attributes.map(a => a.attribute_name)) || []));
  const allImages = product ? [product.image_url, ...product.gallery.map(g => g.image_url)].filter(Boolean) as string[] : [];

  const handleAddToCart = async () => {
    if (!product) return;
    setIsAdding(true);
    let sessionId = localStorage.getItem('guest_session_id');
    if (!sessionId) {
      sessionId = crypto.randomUUID();
      localStorage.setItem('guest_session_id', sessionId);
    }

    try {
      const res = await fetch(`${BaseUrl}api/orders/cart/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(token && { 'Authorization': `Bearer ${token}` }) },
        body: JSON.stringify({ 
          product: product.id, 
          variant: activeVariant?.id || null, 
          quantity: quantity,
          ...(!token && { session_id: sessionId })
        })
      });
      if (res.ok) {
        setShowSuccessModal(true);
        window.dispatchEvent(new Event('storage')); // Update cart count in Navbar
      }
    } catch (err) { console.error(err); } finally { setIsAdding(false); }
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <Loader2 className="w-12 h-12 animate-spin text-red-600 mb-4" />
      <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400">Loading details...</span>
    </div>
  );

  if (!product) return <div className="min-h-screen flex items-center justify-center font-black uppercase text-4xl italic">Item not found.</div>;

  return (
    <div className="min-h-screen bg-white text-zinc-900 font-sans">
      <main className="max-w-[1600px] mx-auto px-6 lg:px-12 py-12 lg:py-20">
        <div className="grid lg:grid-cols-12 gap-16 xl:gap-24 mb-32">
          
          {/* IMAGE GALLERY */}
          <div className="lg:col-span-6 space-y-6">
            <div className="relative bg-zinc-50 rounded-[40px] overflow-hidden aspect-square border border-zinc-100 group">
              <img 
                src={selectedImage || ''} 
                alt={product.name} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
              />
            </div>
            <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
              {allImages.map((img, idx) => (
                <button 
                  key={idx} 
                  onClick={() => setSelectedImage(img)} 
                  className={`relative flex-shrink-0 w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all ${selectedImage === img ? 'border-zinc-900 scale-95 shadow-lg' : 'border-transparent opacity-60 hover:opacity-100'}`}
                >
                  <img src={img} alt={`Angle ${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* PRODUCT INFO */}
          <div className="lg:col-span-6 flex flex-col pt-4">
            <div className="flex justify-between items-start mb-4">
               <span className="text-red-600 font-black text-[10px] uppercase tracking-[0.5em] block italic">{product.category_name}</span>
               <button className="text-zinc-300 hover:text-red-500 transition-colors"><Heart className="w-6 h-6" /></button>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-black text-zinc-900 uppercase italic tracking-tighter leading-[0.85] mb-6">{product.name}</h1>
            
            <div className="flex items-baseline gap-4 mb-10">
              <span className="text-4xl font-black text-zinc-900 tracking-tighter italic">
                ₦{parseFloat(currentPrice).toLocaleString()}
              </span>
            </div>

            {/* VARIANT SELECTORS */}
            <div className="space-y-8 mb-10">
              {attributeTypes.map(type => (
                <div key={type}>
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 block mb-4">{type}</label>
                  <div className="flex flex-wrap gap-3">
                    {Array.from(new Set(
                      product.variants.flatMap(v => v.attributes).filter(a => a.attribute_name === type).map(a => a.value)
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

            <div className="grid grid-cols-1 gap-4 mb-12">
              {product.is_customizable ? (
                <button onClick={() => router.push(`/editor?product=${product.id}`)} className="group relative w-full py-8 bg-zinc-900 text-white rounded-full font-black text-xs uppercase tracking-[0.4em] overflow-hidden active:scale-95 shadow-2xl">
                  <div className="absolute inset-0 bg-red-600 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                  <span className="relative z-10 flex items-center justify-center gap-4">Customize Now <Palette className="w-4 h-4" /></span>
                </button>
              ) : (
                <button onClick={handleAddToCart} disabled={isAdding || (product.variants.length > 0 && !activeVariant)} className="py-6 border-2 border-zinc-900 text-zinc-900 rounded-full font-black text-[10px] uppercase tracking-[0.2em] hover:bg-zinc-900 hover:text-white transition-all flex items-center justify-center gap-3 disabled:opacity-50">
                  {isAdding ? <Loader2 className="animate-spin w-4 h-4" /> : <><ShoppingBag className="w-4 h-4" /> Add to Cart</>}
                </button>
              )}
            </div>

            {/* TABS */}
            <div className="border-t border-zinc-100 pt-10">
              <div className="flex gap-10 mb-6">
                {['details', 'shipping'].map((tab) => (
                  <button key={tab} onClick={() => setActiveTab(tab)} className={`text-[10px] font-black uppercase tracking-[0.3em] transition-all relative ${activeTab === tab ? 'text-zinc-900' : 'text-zinc-300'}`}>
                    {tab} {activeTab === tab && <div className="absolute -bottom-2 left-0 w-full h-1 bg-red-600" />}
                  </button>
                ))}
              </div>
              <div className="text-[12px] font-bold text-zinc-500 uppercase tracking-widest italic leading-relaxed max-w-md">
                {activeTab === 'details' ? <p>{product.description}</p> : <p>Standard shipping: 3-5 business days. Express shipping available at checkout.</p>}
              </div>
            </div>
          </div>
        </div>

        {/* RELATED PRODUCTS */}
        {relatedProducts.length > 0 && (
          <section className="border-t border-zinc-100 pt-20">
            <div className="flex justify-between items-end mb-12">
              <h2 className="text-3xl font-black uppercase italic tracking-tighter">Related in {product.category_name}</h2>
              <button onClick={() => router.push('/shop')} className="text-[10px] font-black uppercase tracking-widest border-b-2 border-zinc-900 pb-1">View All</button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {relatedProducts.map((item) => (
                <div 
                  key={item.id} 
                  onClick={() => {
                    router.push(`/shop/${item.id}`);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="group cursor-pointer"
                >
                  <div className="aspect-[3/4] rounded-[30px] overflow-hidden bg-zinc-50 mb-6 border border-zinc-100">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
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
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-2xl max-w-sm w-full text-center shadow-2xl">
            <h2 className="text-2xl font-black uppercase italic mb-4 text-zinc-900">Added to Cart!</h2>
            <p className="text-zinc-500 mb-6 font-bold text-sm uppercase tracking-wide">Your item has been added successfully.</p>
            <div className="flex gap-4 justify-center">
              <button 
                onClick={() => { setShowSuccessModal(false); router.push('/cart'); }} 
                className="px-6 py-3 bg-zinc-900 text-white rounded-full font-black text-xs uppercase tracking-[0.2em] hover:bg-red-600 transition-colors"
              >
                View Cart
              </button>
              <button 
                onClick={() => setShowSuccessModal(false)} 
                className="px-6 py-3 border-2 border-zinc-900 text-zinc-900 rounded-full font-black text-xs uppercase tracking-[0.2em] hover:bg-zinc-900 hover:text-white transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}