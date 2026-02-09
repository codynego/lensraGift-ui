"use client";

import { useState, useEffect, useRef, Suspense, useMemo, Dispatch, SetStateAction } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { 
  X, Type, MessageSquare, Plus, Check, 
  Loader2, ArrowLeft, Image as ImageIcon, ShoppingBag,
  Palette, Ruler, Grid3x3, Sparkles, ChevronDown, ChevronUp, Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const BaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.lensra.com/";

// --- TYPES & CONSTANTS ---
interface Product {
  id: number;
  name: string;
  is_customizable: boolean;
  variants: Variant[];
  gallery: { image_url: string }[];
  image_url: string;
  base_price: string;
}

interface Variant {
  id: number;
  attributes: { id: number; attribute_name: string; value: string }[];
  price_override: string | null;
  stock_quantity: number;
}

interface Design {
  id: number;
  name: string;
  custom_text?: string;
  preview_image_url?: string;
}

interface UploadedImage {
  file: File;
  preview: string;
  note: string;
}

const EMOTIONS = [
  { id: 'loved', label: 'Loved', emoji: '❤️' },
  { id: 'joyful', label: 'Joyful', emoji: '😊' },
  { id: 'emotional', label: 'Emotional', emoji: '🥹' },
  { id: 'appreciated', label: 'Appreciated', emoji: '🙏' },
  { id: 'remembered', label: 'Remembered', emoji: '💭' },
];

// --- UTILITIES ---
const getGuestSessionId = () => {
  if (typeof window === 'undefined') return '';
  let id = localStorage.getItem('guest_session_id');
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem('guest_session_id', id);
  }
  return id;
};

const getImageUrl = (path: string) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return `${BaseUrl.replace(/\/$/, '')}${path.startsWith('/') ? path : '/' + path}`;
};

// --- MAIN COMPONENT ---
export default function ProductEditor() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <EditorContent />
    </Suspense>
  );
}

function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm font-bold uppercase tracking-wider text-gray-600">Loading Editor</p>
      </div>
    </div>
  );
}

function EditorContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const productId = searchParams.get('product');
  const templateId = searchParams.get('template');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Product & Template State
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [nextPageUrl, setNextPageUrl] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [templateDesign, setTemplateDesign] = useState<Design | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  
  // Variant Selection State
  const [selectedAttributes, setSelectedAttributes] = useState<{ [key: string]: string }>({});
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [currentGalleryIndex, setCurrentGalleryIndex] = useState<number>(0);

  // Customization State
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [customText, setCustomText] = useState<string>("");
  const [overallNote, setOverallNote] = useState<string>("");
  
  // Saving State
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [placementId, setPlacementId] = useState<number | null>(null);

  // Surprise Feature State
  const [showSurprise, setShowSurprise] = useState<boolean>(false);
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);
  const [secretMessage, setSecretMessage] = useState<string>("");

  // --- LOAD MORE PRODUCTS ---
  const loadMoreProducts = async () => {
    if (!nextPageUrl || loadingMore) return;
    setLoadingMore(true);
    try {
      const res = await fetch(nextPageUrl);
      const data = await res.json();
      const rawList = Array.isArray(data) ? data : (data.results || []);
      const newList = rawList.filter((p: any) => p.is_customizable === true);
      setProducts(prev => [...prev, ...newList]);

      let correctedNext = data.next;
      if (correctedNext) {
        try {
          const url = new URL(correctedNext);
          const baseUrlObj = new URL(BaseUrl);
          url.protocol = baseUrlObj.protocol;
          url.hostname = baseUrlObj.hostname;
          url.port = baseUrlObj.port;
          correctedNext = url.toString();
        } catch (e) {
          console.error("Failed to correct next URL:", e);
        }
      }
      setNextPageUrl(correctedNext || null);
      setHasMore(!!correctedNext);
    } catch (err) {
      console.error("Failed to load more products", err);
    } finally {
      setLoadingMore(false);
    }
  };

  // --- FETCH DATA ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        if (templateId) {
          const designRes = await fetch(`${BaseUrl}api/designs/${templateId}/`);
          if (designRes.ok) {
            const designData = await designRes.json();
            setTemplateDesign(designData);
            if (designData.custom_text) {
              setCustomText(designData.custom_text);
            }
          }
        }

        if (productId) {
          const productRes = await fetch(`${BaseUrl}api/products/id/${productId}/`);
          if (productRes.ok) {
            const found = await productRes.json();
            setSelectedProduct(found);
            const variants = found.variants || [];
            if (variants.length > 0) {
              const firstVariant = variants[0];
              setSelectedVariant(firstVariant);
              const initialAttrs: { [key: string]: string } = {};
              (firstVariant.attributes || []).forEach((av: { attribute_name: string; value: string }) => {
                initialAttrs[av.attribute_name] = av.value;
              });
              setSelectedAttributes(initialAttrs);
            }
          }
        } else {
          const productsRes = await fetch(`${BaseUrl}api/products/`);
          const productsData = await productsRes.json();
          const rawList = Array.isArray(productsData) ? productsData : (productsData.results || []);
          const productList = rawList.filter((p: any) => p.is_customizable === true);
          setProducts(productList);

          let correctedNext = productsData.next;
          if (correctedNext) {
            try {
              const url = new URL(correctedNext);
              const baseUrlObj = new URL(BaseUrl);
              url.protocol = baseUrlObj.protocol;
              url.hostname = baseUrlObj.hostname;
              url.port = baseUrlObj.port;
              correctedNext = url.toString();
            } catch (e) {
              console.error("Failed to correct next URL:", e);
            }
          }
          setNextPageUrl(correctedNext || null);
          setHasMore(!!correctedNext);
        }
      } catch (err) {
        console.error("Failed to fetch data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [productId, templateId]);

  // --- UPDATE VARIANT WHEN ATTRIBUTES CHANGE ---
  useEffect(() => {
    const variants = selectedProduct?.variants || [];
    if (variants.length === 0) return;
    
    const match = variants.find((v: Variant) => 
      (v.attributes || []).every((av: { attribute_name: string; value: string }) => 
        selectedAttributes[av.attribute_name] === av.value
      )
    );
    
    setSelectedVariant(match || null);
  }, [selectedAttributes, selectedProduct]);

  // --- GROUPED ATTRIBUTES ---
  const groupedAttributes = useMemo(() => {
    const variants = selectedProduct?.variants || [];
    const groups: { [key: string]: Set<string> } = {};
    
    variants.forEach((v: Variant) => {
      (v.attributes || []).forEach((av: { attribute_name: string; value: string }) => {
        if (!groups[av.attribute_name]) groups[av.attribute_name] = new Set();
        groups[av.attribute_name].add(av.value);
      });
    });
    return groups;
  }, [selectedProduct]);

  // --- DISPLAY IMAGES ---
  const displayImages = useMemo(() => {
    const gallery = selectedProduct?.gallery || [];
    const mainImage = selectedProduct?.image_url;
    
    if (gallery.length > 0) {
      return gallery.map((g: { image_url: string }) => getImageUrl(g.image_url));
    } else if (mainImage) {
      return [getImageUrl(mainImage)];
    }
    return [];
  }, [selectedProduct]);

  // --- ATTRIBUTE ICON ---
  const getAttributeIcon = (attrName: string) => {
    const lower = attrName.toLowerCase();
    if (lower.includes('color') || lower.includes('colour')) return <Palette className="w-4 h-4" />;
    if (lower.includes('size')) return <Ruler className="w-4 h-4" />;
    return <Grid3x3 className="w-4 h-4" />;
  };

  // --- IMAGE UPLOAD ---
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImages = Array.from(files).map((file: File) => ({
        file,
        preview: URL.createObjectURL(file),
        note: ""
      }));
      setImages([...images, ...newImages]);
    }
  };

  // --- FINISH DESIGN ---
  const handleFinishDesign = async () => {
    if (!selectedProduct) return;
    const hasVariants = selectedProduct.variants.length > 0;
    if (hasVariants && (!selectedVariant || selectedVariant.stock_quantity <= 0)) return;
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
      }

      const designFormData = new FormData();
      designFormData.append('name', effectiveName);
      designFormData.append('custom_text', effectiveCustomText);
      designFormData.append('overall_instructions', effectiveOverallNote);
      designFormData.append('session_id', sessionId); 
      
      images.forEach((img: UploadedImage, index: number) => {
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

      const placementFormData = new FormData();
      placementFormData.append('design', designId.toString());
      placementFormData.append('product', selectedProduct.id.toString());
      if (selectedVariant?.id) {
        placementFormData.append('variant', selectedVariant.id.toString());
      }
      placementFormData.append('layout_data', JSON.stringify({
        editor_version: "2.0", 
        platform: "web",
        custom_text: effectiveCustomText,
        special_instructions: effectiveOverallNote,
        template_used: templateDesign ? templateDesign.id : null
      }));

      const placementRes = await fetch(`${BaseUrl}api/products/placements/create/`, {
        method: 'POST',
        headers: token ? { 'Authorization': `Bearer ${token}` } : {},
        body: placementFormData,
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

  // --- ORDER NOW ---
  const handleOrderNow = async () => {
    if (!placementId || !selectedProduct) return;
    const hasVariants = selectedProduct.variants.length > 0;
    if (hasVariants && !selectedVariant) return;
    
    const token = localStorage.getItem('access_token');
    const sessionId = getGuestSessionId();

    try {
      const cartFormData = new FormData();
      cartFormData.append('placement', placementId.toString());
      cartFormData.append('product', selectedProduct.id.toString());
      if (selectedVariant?.id) {
        cartFormData.append('variant', selectedVariant.id.toString());
      }
      cartFormData.append('quantity', '1');
      if (!token) {
        cartFormData.append('session_id', sessionId);
      }
      if (showSurprise) {
        cartFormData.append('secret_message', secretMessage);
        cartFormData.append('emotion', selectedEmotion || '');
      }

      const res = await fetch(`${BaseUrl}api/orders/cart/`, {
        method: 'POST',
        headers: token ? { 'Authorization': `Bearer ${token}` } : {},
        body: cartFormData,
      });

      if (!res.ok) throw new Error("API Cart add failed");

      const cartItem = {
        placement_id: placementId,
        product_id: selectedProduct.id,
        variant_id: selectedVariant?.id,
        product_name: selectedProduct.name,
        variant_label: (selectedVariant?.attributes || []).map((av: { value: string }) => av.value).join(' / '),
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

  // --- PRODUCT SELECTION SCREEN ---
  if (!selectedProduct && !loading) {
    return <ProductSelectionScreen 
      products={products}
      hasMore={hasMore}
      loadingMore={loadingMore}
      onLoadMore={loadMoreProducts}
      templateDesign={templateDesign}
      onSelectProduct={(p: Product) => {
        setSelectedProduct(p);
        const url = templateDesign 
          ? `/editor?product=${p.id}&template=${templateDesign.id}`
          : `/editor?product=${p.id}`;
        router.push(url);
      }}
    />;
  }

  if (loading) {
    return <LoadingScreen />;
  }

  // --- MAIN EDITOR SCREEN ---
  return (
    <div className="min-h-screen bg-white text-black pb-24">
      {/* Navigation */}
      <Navigation 
        router={router}
        templateDesign={templateDesign}
        placementId={placementId}
        isSaving={isSaving}
        onFinishDesign={handleFinishDesign}
        onOrderNow={handleOrderNow}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Product Preview */}
          <ProductPreview 
            templateDesign={templateDesign}
            displayImages={displayImages}
            currentGalleryIndex={currentGalleryIndex}
            setCurrentGalleryIndex={setCurrentGalleryIndex}
            selectedProduct={selectedProduct}
            selectedVariant={selectedVariant}
          />

          {/* Customization Panel */}
          <div className="space-y-8">
            {/* Header */}
            <div className="space-y-3">
              <h2 className="text-4xl sm:text-5xl font-black text-black">
                Customize Your Gift
              </h2>
              <p className="text-gray-600 font-medium">
                {selectedProduct?.name}
              </p>
            </div>

            {/* Variant Selection */}
            {Object.entries(groupedAttributes).map(([attrName, values]) => (
              <VariantSelector 
                key={attrName}
                attrName={attrName}
                values={Array.from(values)}
                selectedAttributes={selectedAttributes}
                setSelectedAttributes={setSelectedAttributes}
                getAttributeIcon={getAttributeIcon}
              />
            ))}

            {/* Graphics Upload */}
            <GraphicsUpload 
              images={images}
              setImages={setImages}
              fileInputRef={fileInputRef}
              handleImageUpload={handleImageUpload}
              templateDesign={templateDesign}
            />

            {/* Text Customization */}
            <TextCustomization 
              customText={customText}
              setCustomText={setCustomText}
              templateDesign={templateDesign}
            />

            {/* Global Instructions */}
            <GlobalInstructions 
              overallNote={overallNote}
              setOverallNote={setOverallNote}
            />

            {/* Surprise Feature */}
            <SurpriseFeature 
              showSurprise={showSurprise}
              setShowSurprise={setShowSurprise}
              selectedEmotion={selectedEmotion}
              setSelectedEmotion={setSelectedEmotion}
              secretMessage={secretMessage}
              setSecretMessage={setSecretMessage}
            />

            {/* Final Actions */}
            <FinalActions 
              placementId={placementId}
              isSaving={isSaving}
              templateDesign={templateDesign}
              images={images}
              customText={customText}
              selectedVariant={selectedVariant}
              handleFinishDesign={handleFinishDesign}
              handleOrderNow={handleOrderNow}
              setPlacementId={setPlacementId}
            />
          </div>
        </div>
      </main>

      {/* Mobile Sticky Footer */}
      <MobileStickyFooter 
        placementId={placementId}
        isSaving={isSaving}
        selectedProduct={selectedProduct}
        selectedVariant={selectedVariant}
        handleFinishDesign={handleFinishDesign}
        handleOrderNow={handleOrderNow}
      />
    </div>
  );
}

// --- COMPONENT PARTS ---

function ProductSelectionScreen({ products, hasMore, loadingMore, onLoadMore, templateDesign, onSelectProduct }: { 
  products: Product[]; 
  hasMore: boolean; 
  loadingMore: boolean; 
  onLoadMore: () => void; 
  templateDesign: Design | null; 
  onSelectProduct: (p: Product) => void 
}) {
  return (
    <div className="min-h-screen bg-white p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          {templateDesign && (
            <div className="inline-flex items-center gap-2 px-5 py-2 bg-red-600 text-white rounded-full mb-6">
              <Sparkles className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">Template Selected</span>
            </div>
          )}
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-black mb-4">
            {templateDesign ? 'Choose Your Product' : 'Select Product to Customize'}
          </h1>
          <p className="text-lg text-gray-600">
            {templateDesign 
              ? `Apply "${templateDesign.name}" to your chosen product` 
              : 'Pick a product and make it uniquely yours'}
          </p>
        </div>

        {/* Template Preview */}
        {templateDesign && (
          <div className="max-w-sm mx-auto mb-12">
            <div className="relative aspect-square rounded-3xl overflow-hidden bg-gray-100 border-2 border-gray-200 shadow-xl">
              {templateDesign.preview_image_url && (
                <img
                  src={getImageUrl(templateDesign.preview_image_url)} 
                  alt={templateDesign.name}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <p className="text-white font-black text-xl">
                  {templateDesign.name}
                </p>
              </div>
            </div>
          </div>
        )}
        
        {/* Products Grid - 2 COLUMNS ON MOBILE */}
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {products.map((p: Product, index: number) => (
            <motion.button 
              key={p.id} 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => onSelectProduct(p)}
              className="group relative bg-white border-2 border-gray-200 rounded-2xl overflow-hidden hover:border-red-600 hover:shadow-2xl transition-all"
            >
              <div className="aspect-square relative overflow-hidden bg-gray-50">
                {p.image_url && (
                  <img
                    src={getImageUrl(p.image_url)} 
                    alt={p.name} 
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all" />
              </div>
              
              <div className="p-4">
                <h3 className="font-bold text-sm text-black mb-2 line-clamp-2 group-hover:text-red-600 transition-colors">
                  {p.name}
                </h3>
                <div className="flex items-center justify-between">
                  <p className="text-base font-black text-black">
                    ₦{parseFloat(p.base_price || "0").toLocaleString()}
                  </p>
                  <div className="w-8 h-8 rounded-full bg-red-600 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                    <Plus className="w-4 h-4 text-white" />
                  </div>
                </div>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Load More */}
        {hasMore && (
          <div className="text-center mt-12">
            <button 
              onClick={onLoadMore}
              disabled={loadingMore}
              className="px-8 py-4 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-bold uppercase tracking-wider shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2"
            >
              {loadingMore ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Loading...</span>
                </>
              ) : (
                <span>Load More Products</span>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function Navigation({ router, templateDesign, placementId, isSaving, onFinishDesign, onOrderNow }: { router: ReturnType<typeof useRouter>; templateDesign: Design | null; placementId: number | null; isSaving: boolean; onFinishDesign: () => Promise<void>; onOrderNow: () => Promise<void> }) {
  return (
    <nav className="sticky top-0 bg-white border-b-2 border-gray-200 py-4 px-4 sm:px-6 lg:px-8 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <button 
          onClick={() => router.back()} 
          className="flex items-center gap-2 text-sm font-bold text-black hover:text-red-600 transition-colors group"
        >
          <div className="w-10 h-10 rounded-full bg-gray-100 group-hover:bg-red-600 flex items-center justify-center transition-all">
            <ArrowLeft className="w-5 h-5 text-black group-hover:text-white transition-colors" />
          </div>
          <span className="hidden sm:inline">Exit Editor</span>
        </button>
        
        {templateDesign && (
          <div className="absolute left-1/2 -translate-x-1/2 hidden md:flex items-center gap-2 px-4 py-2 bg-red-50 border-2 border-red-600 rounded-full">
            <Sparkles className="w-4 h-4 text-red-600" />
            <span className="text-xs font-bold uppercase text-red-600">
              {templateDesign.name}
            </span>
          </div>
        )}
        
        <div className="flex gap-3">
          {!placementId ? (
            <button 
              onClick={onFinishDesign} 
              disabled={isSaving} 
              className="bg-red-600 hover:bg-red-700 text-white px-6 sm:px-8 py-3 rounded-2xl text-sm font-bold uppercase tracking-wider shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="hidden sm:inline">Saving...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span className="hidden sm:inline">Finish Design</span>
                </>
              )}
            </button>
          ) : (
            <button 
              onClick={onOrderNow} 
              className="bg-black hover:bg-red-600 text-white px-6 sm:px-10 py-3 rounded-2xl text-sm font-bold uppercase tracking-wider shadow-xl transition-all flex items-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Order Now</span>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

function ProductPreview({ templateDesign, displayImages, currentGalleryIndex, setCurrentGalleryIndex, selectedProduct, selectedVariant }: { templateDesign: Design | null; displayImages: string[]; currentGalleryIndex: number; setCurrentGalleryIndex: Dispatch<SetStateAction<number>>; selectedProduct: Product | null; selectedVariant: Variant | null }) {
  const hasVariants = (selectedProduct?.variants?.length ?? 0) > 0;
  const isOutOfStock = hasVariants && (selectedVariant?.stock_quantity ?? 0) <= 0;
  const price = selectedVariant?.price_override || selectedProduct?.base_price || "0";

  return (
    <div className="lg:sticky lg:top-24 self-start">
      <div className="space-y-6">
        {templateDesign && (
          <div className="p-6 bg-red-50 rounded-2xl border-2 border-red-200">
            <div className="flex gap-4 items-center">
              <div className="w-16 h-16 rounded-xl overflow-hidden bg-black flex-shrink-0">
                {templateDesign.preview_image_url && (
                  <img 
                    src={getImageUrl(templateDesign.preview_image_url)} 
                    alt={templateDesign.name}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold text-red-600 uppercase mb-1">
                  Template Design
                </p>
                <p className="text-base font-black text-black">
                  {templateDesign.name}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Image Gallery */}
        <div className="relative aspect-square bg-gray-100 rounded-3xl overflow-hidden border-2 border-gray-200">
          {displayImages.length > 0 && (
            <>
              <img
                src={displayImages[currentGalleryIndex]} 
                alt="Product preview"
                loading="lazy"
                className="w-full h-full object-cover" 
              />
              
              {displayImages.length > 1 && (
                <>
                  <button
                    onClick={() => setCurrentGalleryIndex((prev: number) => (prev - 1 + displayImages.length) % displayImages.length)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white hover:bg-black text-black hover:text-white shadow-xl flex items-center justify-center transition-all"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setCurrentGalleryIndex((prev: number) => (prev + 1) % displayImages.length)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white hover:bg-black text-black hover:text-white shadow-xl flex items-center justify-center transition-all"
                  >
                    <ArrowLeft className="w-5 h-5 rotate-180" />
                  </button>
                  
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                    {displayImages.map((_: string, idx: number) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentGalleryIndex(idx)}
                        className={`h-2 rounded-full transition-all ${
                          idx === currentGalleryIndex 
                            ? 'bg-red-600 w-8' 
                            : 'bg-white/60 w-2'
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
        <div className="p-6 bg-white rounded-2xl border-2 border-gray-200">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase mb-2">
                Price
              </p>
              {hasVariants && !selectedVariant ? (
                <p className="text-2xl font-black text-gray-400">Select options</p>
              ) : isOutOfStock ? (
                <p className="text-2xl font-black text-red-600">Out of stock</p>
              ) : (
                <p className="text-4xl font-black text-black">
                  ₦{parseFloat(price).toLocaleString()}
                </p>
              )}
            </div>
            {selectedVariant && (
              <div className="text-right">
                <p className="text-xs font-bold text-gray-500 uppercase mb-1">Variant</p>
                <p className="text-sm font-bold text-black">
                  {(selectedVariant.attributes || []).map((av: { value: string }) => av.value).join(' • ')}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function VariantSelector({ attrName, values, selectedAttributes, setSelectedAttributes, getAttributeIcon }: { attrName: string; values: string[]; selectedAttributes: { [key: string]: string }; setSelectedAttributes: Dispatch<SetStateAction<{ [key: string]: string }>>; getAttributeIcon: (attrName: string) => JSX.Element }) {
  const isColor = attrName.toLowerCase().includes('color') || attrName.toLowerCase().includes('colour');

  return (
    <div className="space-y-4 pb-6 border-b-2 border-gray-200">
      <label className="flex items-center gap-2 text-sm font-black uppercase text-black">
        {getAttributeIcon(attrName)}
        <span>{attrName}</span>
      </label>
      
      <div className="flex flex-wrap gap-3">
        {values.map((val: string) => {
          const isSelected = selectedAttributes[attrName] === val;
          
          if (isColor) {
            const color = val.toLowerCase();
            const bgColor = color === 'white' ? '#ffffff' : color === 'black' ? '#000000' : color;

            return (
              <button
                key={val}
                onClick={() => setSelectedAttributes((prev: { [key: string]: string }) => ({ ...prev, [attrName]: val }))}
                className={`w-14 h-14 rounded-full border-2 flex items-center justify-center transition-all shadow-md ${
                  isSelected ? 'border-black ring-4 ring-red-600 ring-offset-2 scale-110' : 'border-gray-300 hover:border-black'
                }`}
                style={{ backgroundColor: bgColor }}
                title={val}
              >
                {isSelected && <Check className="w-6 h-6 text-white mix-blend-difference" />}
              </button>
            );
          } else {
            return (
              <button
                key={val}
                onClick={() => setSelectedAttributes((prev: { [key: string]: string }) => ({ ...prev, [attrName]: val }))}
                className={`px-6 py-3 rounded-xl text-sm font-bold uppercase transition-all border-2 ${
                  isSelected 
                    ? 'border-red-600 bg-red-600 text-white shadow-lg scale-105' 
                    : 'border-gray-200 bg-white text-black hover:border-black'
                }`}
              >
                {val}
              </button>
            );
          }
        })}
      </div>
    </div>
  );
}

function GraphicsUpload({ images, setImages, fileInputRef, handleImageUpload, templateDesign }: { images: UploadedImage[]; setImages: Dispatch<SetStateAction<UploadedImage[]>>; fileInputRef: React.RefObject<HTMLInputElement>; handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void; templateDesign: Design | null }) {
  return (
    <div className="space-y-4 pb-6 border-b-2 border-gray-200">
      <label className="flex items-center gap-2 text-sm font-black uppercase text-black">
        <ImageIcon className="w-5 h-5" />
        <span>{templateDesign ? 'Additional Graphics' : 'Upload Graphics'}</span>
      </label>
      
      <div className="space-y-4">
        {images.map((img: UploadedImage, idx: number) => (
          <div key={idx} className="group flex gap-4 p-4 bg-gray-50 rounded-2xl border-2 border-gray-200 hover:border-red-600 transition-all">
            <div className="w-20 h-20 relative rounded-xl overflow-hidden flex-shrink-0">
              <img src={img.preview} className="w-full h-full object-cover" alt="upload" loading="lazy" />
              <button
                onClick={() => setImages((prev: UploadedImage[]) => prev.filter((_: UploadedImage, i: number) => i !== idx))} 
                className="absolute top-2 right-2 bg-red-600 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
            
            <textarea 
              placeholder="Placement instructions (e.g., 'Center front, 4 inches below collar')" 
              className="flex-1 bg-white rounded-xl px-4 py-3 text-sm outline-none resize-none border-2 border-gray-200 focus:border-red-600 transition-all"
              rows={3}
              value={img.note}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                const newImgs = [...images];
                newImgs[idx].note = e.target.value;
                setImages(newImgs);
              }}
            />
          </div>
        ))}
        
        <button 
          onClick={() => fileInputRef.current?.click()} 
          className="group w-full py-12 border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center gap-3 hover:bg-gray-50 hover:border-red-600 transition-all"
        >
          <div className="w-16 h-16 rounded-full bg-gray-100 group-hover:bg-red-600 flex items-center justify-center transition-all">
            <Plus className="w-8 h-8 text-gray-400 group-hover:text-white transition-colors" />
          </div>
          <div className="text-center">
            <p className="text-sm font-bold text-black group-hover:text-red-600 transition-colors">
              Upload Graphics & Logos
            </p>
            <p className="text-xs text-gray-500 mt-1">
              PNG, JPG up to 10MB
            </p>
          </div>
        </button>
        <input type="file" ref={fileInputRef} onChange={handleImageUpload} hidden multiple accept="image/*" />
      </div>
    </div>
  );
}

function TextCustomization({ customText, setCustomText, templateDesign }: { customText: string; setCustomText: Dispatch<SetStateAction<string>>; templateDesign: Design | null }) {
  return (
    <div className="space-y-4 pb-6 border-b-2 border-gray-200">
      <label className="flex items-center gap-2 text-sm font-black uppercase text-black">
        <Type className="w-5 h-5" />
        <span>Custom Text</span>
      </label>
      
      <textarea
        value={customText}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setCustomText(e.target.value)}
        placeholder={templateDesign ? "Add text to customize this template..." : "Enter text to print on your product..."}
        className="w-full bg-white border-2 border-gray-200 rounded-2xl px-6 py-4 text-base outline-none focus:border-red-600 transition-all min-h-[120px] resize-none"
      />
    </div>
  );
}

function GlobalInstructions({ overallNote, setOverallNote }: { overallNote: string; setOverallNote: Dispatch<SetStateAction<string>> }) {
  return (
    <div className="space-y-4 pb-6 border-b-2 border-gray-200">
      <label className="flex items-center gap-2 text-sm font-black uppercase text-black">
        <MessageSquare className="w-5 h-5" />
        <span>Special Instructions</span>
      </label>
      
      <div className="bg-black rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-2 text-red-600">
          <Sparkles className="w-4 h-4" />
          <span className="text-xs font-bold uppercase">Designer Notes</span>
        </div>
        
        <textarea
          value={overallNote}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setOverallNote(e.target.value)}
          placeholder="Tell our production team exactly how you want this (e.g., 'Oversized fit', 'Vibrant colors', 'Distressed edges')"
          className="w-full bg-gray-900 border-none text-white placeholder:text-gray-500 text-sm outline-none resize-none min-h-[100px] rounded-xl p-4"
        />
      </div>
    </div>
  );
}

function SurpriseFeature({ showSurprise, setShowSurprise, selectedEmotion, setSelectedEmotion, secretMessage, setSecretMessage }: { showSurprise: boolean; setShowSurprise: Dispatch<SetStateAction<boolean>>; selectedEmotion: string | null; setSelectedEmotion: Dispatch<SetStateAction<string | null>>; secretMessage: string; setSecretMessage: Dispatch<SetStateAction<string>> }) {
  return (
    <div className="pb-6 border-b-2 border-gray-200">
      <button 
        onClick={() => setShowSurprise(!showSurprise)}
        className={`w-full flex items-center justify-between p-6 rounded-2xl border-2 transition-all ${
          showSurprise ? 'border-red-600 bg-red-50' : 'border-gray-200 bg-white hover:border-gray-400'
        }`}
      >
        <div className="flex items-center gap-4">
          <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
            showSurprise ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-400'
          }`}>
            <Sparkles className="w-6 h-6" />
          </div>
          <div className="text-left">
            <h3 className="text-base font-black text-black">Add Secret Message</h3>
            <p className="text-sm text-gray-600">Digital surprise reveal</p>
          </div>
        </div>
        {showSurprise ? <ChevronUp className="w-6 h-6" /> : <ChevronDown className="w-6 h-6" />}
      </button>

      <AnimatePresence>
        {showSurprise && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-6 p-6 bg-gray-50 rounded-2xl border-2 border-gray-200 space-y-6">
              <div className="space-y-4">
                <label className="text-sm font-bold text-black uppercase">1. Choose Emotion</label>
                <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-3">
                  {EMOTIONS.map((e: { id: string; label: string; emoji: string }) => (
                    <button
                      key={e.id}
                      onClick={() => setSelectedEmotion(e.id)}
                      className={`px-4 py-3 rounded-xl border-2 text-sm font-bold transition-all ${
                        selectedEmotion === e.id 
                          ? 'border-red-600 bg-red-600 text-white shadow-lg' 
                          : 'border-gray-200 bg-white text-black hover:border-gray-400'
                      }`}
                    >
                      <span className="mr-2">{e.emoji}</span>
                      {e.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-sm font-bold text-black uppercase">2. Your Message</label>
                <textarea 
                  value={secretMessage}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setSecretMessage(e.target.value)}
                  placeholder="Write your secret message (50-300 characters)..."
                  className="w-full bg-white border-2 border-gray-200 rounded-2xl p-4 text-base outline-none focus:border-red-600 transition-all h-32"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function FinalActions({ placementId, isSaving, templateDesign, images, customText, selectedVariant, handleFinishDesign, handleOrderNow, setPlacementId }: { placementId: number | null; isSaving: boolean; templateDesign: Design | null; images: UploadedImage[]; customText: string; selectedVariant: Variant | null; handleFinishDesign: () => Promise<void>; handleOrderNow: () => Promise<void>; setPlacementId: Dispatch<SetStateAction<number | null>> }) {
  return (
    <div className="pt-6">
      {!placementId ? (
        <button 
          onClick={handleFinishDesign}
          disabled={isSaving || (!templateDesign && images.length === 0 && !customText) || !selectedVariant || selectedVariant.stock_quantity <= 0}
          className="w-full py-5 bg-black hover:bg-red-600 text-white rounded-2xl text-sm font-bold uppercase tracking-wider transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl flex items-center justify-center gap-2"
        >
          {isSaving ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Saving Design...
            </>
          ) : (
            <>
              <Check className="w-5 h-5" />
              Save & Continue
            </>
          )}
        </button>
      ) : (
        <div className="flex flex-col sm:flex-row gap-4">
          <button 
            onClick={handleOrderNow}
            className="flex-1 py-5 bg-red-600 hover:bg-red-700 text-white rounded-2xl text-sm font-bold uppercase tracking-wider transition-all shadow-xl flex items-center justify-center gap-2"
          >
            <ShoppingBag className="w-5 h-5" />
            Proceed to Checkout
          </button>
          <button 
            onClick={() => setPlacementId(null)}
            className="px-8 py-5 border-2 border-black hover:bg-black hover:text-white text-black rounded-2xl text-sm font-bold uppercase tracking-wider transition-all"
          >
            Edit Design
          </button>
        </div>
      )}
    </div>
  );
}

function MobileStickyFooter({ placementId, isSaving, selectedProduct, selectedVariant, handleFinishDesign, handleOrderNow }: { placementId: number | null; isSaving: boolean; selectedProduct: Product | null; selectedVariant: Variant | null; handleFinishDesign: () => Promise<void>; handleOrderNow: () => Promise<void> }) {
  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-white border-t-2 border-gray-200 z-50">
      {!placementId ? (
        <button 
          onClick={handleFinishDesign}
          disabled={isSaving || !selectedVariant || selectedVariant.stock_quantity <= 0}
          className="w-full py-4 bg-black hover:bg-red-600 text-white rounded-2xl text-sm font-bold uppercase flex items-center justify-center gap-2 shadow-xl transition-all disabled:opacity-50"
        >
          {isSaving ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Check className="w-5 h-5" />
              Save Design
            </>
          )}
        </button>
      ) : (
        <button 
          onClick={handleOrderNow}
          className="w-full py-4 bg-red-600 hover:bg-red-700 text-white rounded-2xl text-sm font-bold uppercase flex items-center justify-center gap-2 shadow-xl transition-all"
        >
          <ShoppingBag className="w-5 h-5" />
          Checkout - ₦{parseFloat(selectedVariant?.price_override || selectedProduct?.base_price || "0").toLocaleString()}
        </button>
      )}
    </div>
  );
}