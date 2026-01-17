"use client";

import { useState, useEffect, useRef, Suspense, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { 
  X, Type, MessageSquare, Plus, Check, 
  Loader2, ArrowLeft, Image as ImageIcon, RefreshCw, ShoppingBag,
  Palette, Ruler, Grid3x3, Sparkles, ChevronDown, ChevronUp
} from 'lucide-react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

const BaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.lensra.com/";

// --- CONFIG ---
const EMOTIONS = [
  { id: 'loved', label: 'Loved', emoji: '❤️' },
  { id: 'joyful', label: 'Joyful', emoji: '🎉' },
  { id: 'emotional', label: 'Emotional', emoji: '🥹' },
  { id: 'appreciated', label: 'Appreciated', emoji: '🙏' },
  { id: 'remembered', label: 'Remembered', emoji: '🕊' },
];

const getGuestSessionId = () => {
  if (typeof window === 'undefined') return '';
  let id = localStorage.getItem('guest_session_id');
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem('guest_session_id', id);
  }
  return id;
};

const getImageUrl = (path: string | null | undefined): string => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return `${BaseUrl.replace(/\/$/, '')}${path.startsWith('/') ? path : '/' + path}`;
};

export default function ProductEditor() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-zinc-50">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin text-red-600 mx-auto" />
          <p className="text-xs font-black uppercase tracking-widest text-zinc-400">Loading Editor</p>
        </div>
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
  const templateId = searchParams.get('template');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [templateDesign, setTemplateDesign] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string>>({});
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [currentGalleryIndex, setCurrentGalleryIndex] = useState(0);

  const [images, setImages] = useState<any[]>([]);
  const [customText, setCustomText] = useState("");
  const [overallNote, setOverallNote] = useState("");
  
  const [isSaving, setIsSaving] = useState(false);
  const [placementId, setPlacementId] = useState<number | null>(null);

  // --- SURPRISE REVEAL STATE ---
  const [showSurprise, setShowSurprise] = useState(false);
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);
  const [secretMessage, setSecretMessage] = useState("");

  // Fetch products and template design
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch products
        const productsRes = await fetch(`${BaseUrl}api/products/`);
        const productsData = await productsRes.json();
        const rawList = Array.isArray(productsData) ? productsData : (productsData.results || []);
        const productList = rawList.filter((p: any) => p.is_customizable === true);
        setAllProducts(productList);

        // Fetch template design if provided
        if (templateId) {
          const designRes = await fetch(`${BaseUrl}api/designs/${templateId}/`);
          if (designRes.ok) {
            const designData = await designRes.json();
            setTemplateDesign(designData);
          }
        }

        // Set selected product if productId is provided
        if (productId) {
          const found = productList.find((p: any) => p.id === parseInt(productId));
          if (found) {
            setSelectedProduct(found);
            const variants = found.variants || [];
            if (variants.length > 0) {
              const firstVariant = variants[0];
              setSelectedVariant(firstVariant);
              
              const initialAttrs: Record<string, string> = {};
              (firstVariant.attributes || []).forEach((av: any) => {
                initialAttrs[av.attribute_name] = av.value;
              });
              setSelectedAttributes(initialAttrs);
            }
          }
        }
      } catch (err) {
        console.error("Failed to fetch data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [productId, templateId]);

  useEffect(() => {
    const variants = selectedProduct?.variants || [];
    if (variants.length === 0) return;
    
    const match = variants.find((v: any) => 
      (v.attributes || []).every((av: any) => 
        selectedAttributes[av.attribute_name] === av.value
      )
    );
    
    if (match) setSelectedVariant(match);
  }, [selectedAttributes, selectedProduct]);

  const groupedAttributes = useMemo(() => {
    const variants = selectedProduct?.variants || [];
    const groups: Record<string, Set<string>> = {};
    
    variants.forEach((v: any) => {
      (v.attributes || []).forEach((av: any) => {
        if (!groups[av.attribute_name]) groups[av.attribute_name] = new Set();
        groups[av.attribute_name].add(av.value);
      });
    });
    return groups;
  }, [selectedProduct]);

  const getAttributeIcon = (attrName: string) => {
    const lower = attrName.toLowerCase();
    if (lower.includes('color') || lower.includes('colour')) return <Palette className="w-4 h-4" />;
    if (lower.includes('size')) return <Ruler className="w-4 h-4" />;
    if (lower.includes('type') || lower.includes('style')) return <Grid3x3 className="w-4 h-4" />;
    return <Grid3x3 className="w-4 h-4" />;
  };

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
      let designId: number;
      let effectiveOverallNote = overallNote;
      let effectiveCustomText = customText;
      let effectiveName = `${selectedProduct.name} - Custom Design`;

      if (templateDesign) {
        effectiveName += ` - Based on ${templateDesign.name}`;
        effectiveOverallNote = `Based on template ID: ${templateDesign.id} - ${templateDesign.name}\n${overallNote}`;
        // Assuming templateDesign might have custom_text, but if not, just append
        if (templateDesign.custom_text) {
          effectiveCustomText = `${templateDesign.custom_text}\n${customText}`;
        }
      }

      // Always create a new design, as customizations might be added
      const designFormData = new FormData();
      designFormData.append('name', effectiveName);
      designFormData.append('custom_text', effectiveCustomText);
      designFormData.append('overall_instructions', effectiveOverallNote);
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
      designId = designData.id;

      // Create placement
      const placementRes = await fetch(`${BaseUrl}api/products/placements/create/`, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          design: designId,
          product: selectedProduct.id,
          variant: selectedVariant?.id || null,
          layout_data: { 
            editor_version: "2.0", 
            platform: "web",
            custom_text: effectiveCustomText,
            special_instructions: effectiveOverallNote,
            template_used: templateDesign ? templateDesign.id : null,
            ...(showSurprise && { secret_message: secretMessage, emotion: selectedEmotion })
          }
        }),
      });
      
      if (!placementRes.ok) throw new Error("Placement failed");
      const placementData = await placementRes.json();
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
      const res = await fetch(`${BaseUrl}api/orders/cart/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          placement: placementId,
          product: selectedProduct.id,
          variant: selectedVariant?.id || null,
          quantity: 1,
          session_id: token ? null : sessionId,
          secret_message: showSurprise ? secretMessage : null,
          emotion: showSurprise ? selectedEmotion : null
        }),
      });

      if (!res.ok) throw new Error("API Cart add failed");

      const cartItem = {
        placement_id: placementId,
        product_id: selectedProduct.id,
        variant_id: selectedVariant?.id,
        product_name: selectedProduct.name,
        variant_label: (selectedVariant?.attributes || []).map((av: any) => av.value).join(' / '),
        price: selectedVariant?.price_override || selectedProduct.base_price,
        image: selectedProduct.image_url,
        quantity: 1,
        added_at: new Date().toISOString()
      };

      const storageKey = token ? 'user_cart' : 'guest_cart';
      const existingCart = JSON.parse(localStorage.getItem(storageKey) || '[]');
      existingCart.push(cartItem);
      localStorage.setItem(storageKey, JSON.stringify(existingCart));
      
      router.push('/checkout');
    } catch (err) {
      console.error(err);
      alert("Could not process your order.");
    }
  };

  const displayImages = useMemo(() => {
    const gallery = selectedProduct?.gallery || [];
    const mainImage = selectedProduct?.image_url;
    
    if (gallery.length > 0) {
      return gallery.map((g: any) => getImageUrl(g.image_url));
    } else if (mainImage) {
      return [getImageUrl(mainImage)];
    }
    return [];
  }, [selectedProduct]);

  // Product Selection Screen (when no product selected but template exists)
  if (!selectedProduct && !loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-zinc-50 to-white p-6 md:p-12">
        <div className="max-w-7xl mx-auto space-y-16">
          {/* Header with Template Info */}
          <div className="text-center space-y-6">
            {templateDesign && (
              <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-full shadow-xl shadow-red-600/30 mb-4">
                <Sparkles className="w-5 h-5" />
                <span className="text-xs font-black uppercase tracking-[0.3em]">Template Selected</span>
              </div>
            )}
            
            <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter bg-gradient-to-r from-black to-zinc-600 bg-clip-text text-transparent">
              {templateDesign ? 'Choose Product' : 'Select a Base'}
            </h1>
            <p className="text-xs font-bold uppercase tracking-widest text-zinc-400">
              {templateDesign 
                ? `Apply "${templateDesign.name}" to your product` 
                : 'Choose your product to customize'}
            </p>
          </div>

          {/* Template Preview (if exists) */}
          {templateDesign && (
            <div className="max-w-md mx-auto">
              <div className="relative aspect-square rounded-3xl overflow-hidden bg-zinc-950 border-2 border-zinc-800 shadow-2xl">
                {templateDesign.preview_image_url && (
                  <Image 
                    src={getImageUrl(templateDesign.preview_image_url)} 
                    alt={templateDesign.name}
                    fill
                    className="object-cover"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <p className="text-white font-black uppercase text-lg italic">
                    {templateDesign.name}
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {(allProducts || []).map((p) => (
              <button 
                key={p.id} 
                onClick={() => {
                  setSelectedProduct(p);
                  const url = templateDesign 
                    ? `/editor?product=${p.id}&template=${templateDesign.id}`
                    : `/editor?product=${p.id}`;
                  router.push(url);
                }}
                className="group relative p-6 bg-white border border-zinc-100 rounded-3xl hover:shadow-2xl hover:shadow-zinc-200/50 hover:-translate-y-1 transition-all duration-300 text-left overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-red-50 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="aspect-square relative rounded-2xl overflow-hidden bg-gradient-to-br from-zinc-50 to-zinc-100 mb-4 ring-1 ring-zinc-200/50 group-hover:ring-red-200 transition-all">
                  {p.image_url && (
                    <Image 
                      src={getImageUrl(p.image_url)} 
                      alt={p.name} 
                      fill 
                      className="object-cover group-hover:scale-105 transition-transform duration-300" 
                    />
                  )}
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-black italic uppercase text-sm truncate text-zinc-900">
                    {p.name}
                  </h3>
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-black text-red-600">
                      ₦{parseFloat(p.base_price || "0").toLocaleString()}
                    </p>
                    <div className="w-8 h-8 rounded-full bg-black/5 group-hover:bg-red-600 flex items-center justify-center transition-colors">
                      <Plus className="w-4 h-4 text-zinc-600 group-hover:text-white transition-colors" />
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-zinc-50 to-white text-black font-sans pb-24">
      {/* Modern Navigation */}
      <nav className="border-b border-zinc-200/50 py-5 px-6 sticky top-0 bg-white/90 backdrop-blur-xl z-50 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button 
            onClick={() => router.back()} 
            className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest hover:gap-4 transition-all group"
          >
            <div className="w-8 h-8 rounded-full bg-zinc-100 group-hover:bg-black flex items-center justify-center transition-colors">
              <ArrowLeft className="w-4 h-4 text-zinc-600 group-hover:text-white transition-colors" />
            </div>
            <span className="hidden sm:inline">Exit Editor</span>
          </button>
          
          {/* Template Badge */}
          {templateDesign && (
            <div className="absolute left-1/2 -translate-x-1/2 hidden md:flex items-center gap-2 px-4 py-2 bg-red-50 border border-red-200 rounded-full">
              <Sparkles className="w-4 h-4 text-red-600" />
              <span className="text-[9px] font-black uppercase tracking-widest text-red-600">
                Using: {templateDesign.name}
              </span>
            </div>
          )}
          
          <div className="flex gap-3">
            {!placementId ? (
              <button 
                onClick={handleFinishDesign} 
                disabled={isSaving} 
                className="bg-gradient-to-r from-red-600 to-red-700 text-white px-8 py-3.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-red-600/30 hover:shadow-xl hover:shadow-red-600/40 hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Finish Design</span>
                  </>
                )}
              </button>
            ) : (
              <button 
                onClick={handleOrderNow} 
                className="bg-black text-white px-10 py-3.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl shadow-black/20 hover:shadow-2xl hover:shadow-black/30 hover:scale-105 transition-all flex items-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Order Now</span>
              </button>
            )}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-12 gap-12 xl:gap-16">
          {/* Product Preview */}
          <div className="lg:col-span-5 xl:col-span-4">
            <div className="sticky top-32 space-y-6">
              {/* Template Preview (if exists) */}
              {templateDesign && (
                <div className="p-6 bg-gradient-to-br from-red-50 to-white rounded-3xl border border-red-200 shadow-lg">
                  <div className="flex gap-4">
                    <div className="w-20 h-20 rounded-2xl overflow-hidden bg-zinc-950 flex-shrink-0">
                      {templateDesign.preview_image_url && (
                        <img 
                          src={getImageUrl(templateDesign.preview_image_url)} 
                          alt={templateDesign.name}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-[9px] font-black text-red-600 uppercase tracking-widest mb-1">
                        Template Design
                      </p>
                      <p className="text-sm font-black uppercase italic text-zinc-900">
                        {templateDesign.name}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Image Gallery */}
              <div className="relative aspect-[4/5] bg-gradient-to-br from-zinc-100 to-zinc-50 rounded-[40px] overflow-hidden border border-zinc-200/50 shadow-2xl shadow-zinc-200/50">
                {displayImages.length > 0 && (
                  <>
                    <Image 
                      src={displayImages[currentGalleryIndex]} 
                      alt="Product preview" 
                      fill 
                      className="object-cover" 
                    />
                    
                    {/* Gallery Navigation */}
                    {displayImages.length > 1 && (
                      <>
                        <button
                          onClick={() => setCurrentGalleryIndex((prev) => (prev - 1 + displayImages.length) % displayImages.length)}
                          className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
                        >
                          <ArrowLeft className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => setCurrentGalleryIndex((prev) => (prev + 1) % displayImages.length)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
                        >
                          <ArrowLeft className="w-5 h-5 rotate-180" />
                        </button>
                        
                        {/* Dots indicator */}
                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                          {displayImages.map((_: string, idx: number) => (
                            <button
                              key={idx}
                              onClick={() => setCurrentGalleryIndex(idx)}
                              className={`w-2 h-2 rounded-full transition-all ${
                                idx === currentGalleryIndex 
                                  ? 'bg-white w-8' 
                                  : 'bg-white/50 hover:bg-white/75'
                              }`}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </>
                )}
              </div>

              {/* Price Card */}
              <div className="p-6 bg-white rounded-3xl border border-zinc-200/50 shadow-lg">
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-2">
                      Estimated Price
                    </p>
                    <p className="text-4xl font-black italic bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent">
                      ₦{parseFloat(selectedVariant?.price_override || selectedProduct?.base_price || "0").toLocaleString()}
                    </p>
                  </div>
                  {selectedVariant && (
                    <div className="text-right">
                      <p className="text-[8px] font-black text-zinc-400 uppercase tracking-widest mb-1">Variant</p>
                      <p className="text-xs font-bold text-zinc-600">
                        {(selectedVariant.attributes || []).map((av: any) => av.value).join(' · ')}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Customization Panel */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-10">
            {/* Header */}
            <div className="space-y-3">
              <h2 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter leading-none bg-gradient-to-r from-black to-zinc-600 bg-clip-text text-transparent">
                Customize
              </h2>
              <p className="text-zinc-400 font-bold uppercase text-xs tracking-[0.2em]">
                {selectedProduct?.name}
              </p>
            </div>

            {/* Variant Selection */}
            {Object.entries(groupedAttributes).map(([attrName, values]) => (
              <div key={attrName} className="space-y-5">
                <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-zinc-600">
                  {getAttributeIcon(attrName)}
                  <span>Select {attrName}</span>
                </label>
                
                <div className="flex flex-wrap gap-3">
                  {Array.from(values).map((val) => {
                    const isSelected = selectedAttributes[attrName] === val;
                    const isColor = attrName.toLowerCase().includes('color') || attrName.toLowerCase().includes('colour');
                    
                    return (
                      <button
                        key={val}
                        onClick={() => setSelectedAttributes(prev => ({ ...prev, [attrName]: val }))}
                        className={`group relative px-6 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all border-2 overflow-hidden ${
                          isSelected 
                            ? 'border-black bg-black text-white shadow-lg shadow-black/20 scale-105' 
                            : 'border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300 hover:shadow-md'
                        }`}
                      >
                        {isColor && (
                          <div 
                            className={`absolute top-2 right-2 w-3 h-3 rounded-full border-2 ${
                              isSelected ? 'border-white' : 'border-zinc-300'
                            }`}
                            style={{ 
                              backgroundColor: val.toLowerCase() === 'white' ? '#fff' : 
                                             val.toLowerCase() === 'black' ? '#000' : 
                                             val.toLowerCase() 
                            }}
                          />
                        )}
                        
                        {isSelected && (
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                        )}
                        
                        <span className="relative z-10">{val}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

            {/* Graphics Upload - Always show, adjust label if template */}
            <div className="space-y-5 pt-8 border-t-2 border-zinc-100">
              <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-zinc-600">
                <ImageIcon className="w-5 h-5" />
                <span>{templateDesign ? 'Additional Graphics & Logos' : 'Graphics & Logos'}</span>
              </label>
              
              <div className="grid gap-4">
                {images.map((img, idx) => (
                  <div key={idx} className="group flex gap-4 p-5 bg-white rounded-3xl border border-zinc-200/50 shadow-md hover:shadow-xl transition-all">
                    <div className="w-24 h-24 relative rounded-2xl overflow-hidden flex-shrink-0 ring-2 ring-zinc-100">
                      <img src={img.preview} className="object-cover w-full h-full" alt="upload" />
                      <button 
                        onClick={() => setImages(images.filter((_, i) => i !== idx))} 
                        className="absolute top-2 right-2 bg-red-600 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110 shadow-lg"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                    
                    <textarea 
                      placeholder={templateDesign ? "Add placement instructions for this additional image (e.g., 'Replace logo on template')" : "Add placement instructions (e.g., 'Center front, 4 inches below collar')"} 
                      className="flex-1 bg-zinc-50 rounded-xl px-4 py-3 text-xs font-bold uppercase outline-none resize-none focus:bg-white focus:ring-2 focus:ring-black/10 transition-all"
                      rows={3}
                      value={img.note}
                      onChange={(e) => {
                        const newImgs = [...images];
                        newImgs[idx].note = e.target.value;
                        setImages(newImgs);
                      }}
                    />
                  </div>
                ))}
                
                <button 
                  onClick={() => fileInputRef.current?.click()} 
                  className="group py-12 border-2 border-dashed border-zinc-200 rounded-3xl flex flex-col items-center gap-3 hover:bg-zinc-50 hover:border-red-300 transition-all"
                >
                  <div className="w-14 h-14 rounded-full bg-zinc-100 group-hover:bg-red-100 flex items-center justify-center transition-colors">
                    <Plus className="w-6 h-6 text-zinc-400 group-hover:text-red-600 transition-colors" />
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-black uppercase tracking-widest text-zinc-600 group-hover:text-red-600 transition-colors">
                      Upload Graphics
                    </p>
                    <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider mt-1">
                      PNG, JPG up to 10MB
                    </p>
                  </div>
                </button>
                <input type="file" ref={fileInputRef} onChange={handleImageUpload} hidden multiple accept="image/*" />
              </div>
            </div>

            {/* 4. TEXT LAB (Custom Messaging) */}
            <div className="space-y-5 pt-8 border-t-2 border-zinc-100">
              <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-zinc-600">
                <Type className="w-5 h-5" />
                <span>Text Customization</span>
              </label>
              
              <div className="relative group">
                <textarea
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  placeholder={templateDesign ? "Add additional text to this template..." : "Enter text to print on product..."}
                  className="w-full bg-white border-2 border-zinc-200 rounded-[32px] px-8 py-6 text-sm font-bold uppercase outline-none focus:border-black focus:ring-4 focus:ring-black/5 transition-all min-h-[120px] resize-none"
                />
                <div className="absolute right-6 bottom-6 flex items-center gap-2 text-zinc-300 group-focus-within:text-black transition-colors">
                  <span className="text-[9px] font-black uppercase tracking-widest">Type Lab</span>
                  <RefreshCw className="w-3 h-3" />
                </div>
              </div>
            </div>

            {/* 5. SPECIAL LAB NOTES (Overall Instructions) */}
            <div className="space-y-5 pt-8 border-t-2 border-zinc-100">
              <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-zinc-600">
                <MessageSquare className="w-5 h-5" />
                <span>Global Instructions</span>
              </label>
              
              <div className="bg-zinc-950 rounded-[32px] p-8 space-y-4">
                <div className="flex items-center gap-3 text-red-500">
                  <Sparkles className="w-4 h-4" />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em]">Designer Briefing</span>
                </div>
                
                <textarea
                  value={overallNote}
                  onChange={(e) => setOverallNote(e.target.value)}
                  placeholder="Tell our production team exactly how you want this to look. (e.g., 'Oversized fit feel', 'distressed edges', 'vibrant colors')"
                  className="w-full bg-zinc-900 border-none text-white placeholder:text-zinc-600 text-xs font-bold uppercase outline-none resize-none min-h-[100px]"
                />
              </div>
            </div>

            {/* --- NEW: SURPRISE REVEAL COLLAPSIBLE --- */}
            <div className="space-y-5 pt-8 border-t-2 border-zinc-100">
              <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-zinc-600">
                <Sparkles className="w-5 h-5" />
                <span>Include Surprise Experience</span>
              </label>

              <button 
                onClick={() => setShowSurprise(!showSurprise)}
                className={`w-full flex items-center justify-between p-6 rounded-[32px] border-2 transition-all duration-500 ${showSurprise ? 'border-red-600 bg-red-50/20' : 'border-zinc-100 bg-zinc-50 hover:border-zinc-200'}`}
              >
                <div className="flex items-center gap-4 text-left">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${showSurprise ? 'bg-red-600 text-white' : 'bg-white text-zinc-400 border border-zinc-100 shadow-sm'}`}>
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-black uppercase italic tracking-tight text-zinc-900">Digital Secret Message</h3>
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Emotional Reveal</p>
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

            {/* Final Action (Desktop Only) */}
            <div className="pt-12">
              {!placementId ? (
                <button 
                  onClick={handleFinishDesign}
                  disabled={isSaving || (!templateDesign && images.length === 0 && !customText)}
                  className="w-full py-6 bg-black text-white rounded-full text-xs font-black uppercase tracking-[0.4em] hover:bg-red-600 hover:scale-[1.02] transition-all disabled:opacity-30 disabled:grayscale disabled:hover:scale-100 shadow-2xl shadow-black/20"
                >
                  {isSaving ? "Locking Design Assets..." : "Confirm Customizations"}
                </button>
              ) : (
                <div className="flex flex-col sm:flex-row gap-4">
                   <button 
                    onClick={handleOrderNow}
                    className="flex-1 py-6 bg-red-600 text-white rounded-full text-xs font-black uppercase tracking-[0.4em] hover:bg-red-700 transition-all flex items-center justify-center gap-3"
                  >
                    <ShoppingBag className="w-5 h-5" />
                    Move to Checkout
                  </button>
                  <button 
                    onClick={() => setPlacementId(null)}
                    className="px-10 py-6 border-2 border-zinc-200 rounded-full text-xs font-black uppercase tracking-[0.4em] hover:bg-zinc-50 transition-all"
                  >
                    Edit
                  </button>
                </div>
              )}
              
              <p className="mt-6 text-center text-[9px] font-black uppercase tracking-widest text-zinc-400">
                Lensra Lab Verified Production Standard • 2026 Edition
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* MOBILE STICKY FOOTER */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-xl border-t border-zinc-200 z-[60]">
        {!placementId ? (
          <button 
            onClick={handleFinishDesign}
            disabled={isSaving}
            className="w-full py-5 bg-black text-white rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
            Save Progress
          </button>
        ) : (
          <button 
            onClick={handleOrderNow}
            className="w-full py-5 bg-red-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2"
          >
            <ShoppingBag className="w-4 h-4" />
            Checkout - ₦{parseFloat(selectedVariant?.price_override || selectedProduct?.base_price || "0").toLocaleString()}
          </button>
        )}
      </div>
    </div>
  );
}