"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Plus, Trash2, Star, X, Upload, ShoppingCart, Edit3, Loader2, CheckCircle2, ArrowRight, ShoppingBag
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const BaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000/";

export default function MyDesigns() {
  const { token } = useAuth();
  const router = useRouter();
  
  const [designs, setDesigns] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal & Form States
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [useDesignData, setUseDesignData] = useState<any>(null);
  const [showSuccess, setShowSuccess] = useState(false); 
  
  const [newDesignName, setNewDesignName] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (token) loadData();
  }, [token]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [designRes, productRes] = await Promise.all([
        fetch(`${BaseUrl}api/designs/`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`${BaseUrl}api/products/`)
      ]);
      const designData = await designRes.json();
      const productData = await productRes.json();
      setDesigns(Array.isArray(designData) ? designData : designData.results || []);
      setProducts(Array.isArray(productData) ? productData : productData.results || []);
    } finally { setLoading(false); }
  };

  // --- UPDATED LOGIC: CREATE PLACEMENT -> THEN CREATE CART ITEM ---
  const handleCreatePlacement = async () => {
    const product = products.find(p => p.id === parseInt(selectedProductId));
    if (!product) return;

    const areaId = product.printable_areas?.[0]?.id;
    if (!areaId) return alert("No printable areas found for this product.");

    setIsSubmitting(true);
    try {
      // 1. Create the Design Placement
      const placementRes = await fetch(`${BaseUrl}api/products/placements/create/`, {
        method: 'POST',
        headers: { 
            'Authorization': `Bearer ${token}`, 
            'Content-Type': 'application/json' 
        },
        body: JSON.stringify({
          design: useDesignData.id,
          product: product.id,
          printable_area: areaId,
          layout_data: { scale: 1, x: 0, y: 0 }
        })
      });

      if (!placementRes.ok) throw new Error("Failed to create design placement");
      const placementData = await placementRes.json();

      // 2. Create the Cart Item using the new placement ID
      const cartRes = await fetch(`${BaseUrl}api/orders/cart/`, {
        method: 'POST',
        headers: { 
            'Authorization': `Bearer ${token}`, 
            'Content-Type': 'application/json' 
        },
        body: JSON.stringify({
          placement: placementData.id,
          quantity: 1 // Default to 1
        })
      });

      if (cartRes.ok) {
        setShowSuccess(true); 
      } else {
        alert("Placement created, but failed to add to cart.");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred while adding to cart.");
    } finally { setIsSubmitting(false); }
  };

  const handleToggleFeatured = async (id: number, currentStatus: boolean) => {
    await fetch(`${BaseUrl}api/designs/${id}/`, {
      method: 'PATCH',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_featured: !currentStatus })
    });
    loadData();
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Permanently delete this design?")) return;
    const res = await fetch(`${BaseUrl}api/designs/${id}/`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) loadData();
  };

  const closeUseModal = () => {
    setUseDesignData(null);
    setShowSuccess(false);
    setSelectedProductId('');
  };

  if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin text-red-600" /></div>;

  return (
    <div className="min-h-screen px-4 pb-20 max-w-7xl mx-auto pt-6">
      
      {/* HEADER */}
      <section className="bg-zinc-900 py-10 px-8 rounded-[2.5rem] mb-10 flex flex-col md:flex-row justify-between items-center gap-6 shadow-xl">
        <div className="text-center md:text-left">
          <h1 className="text-4xl font-bold text-white tracking-tighter uppercase">Design Vault</h1>
          <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mt-1">Your Creative Blueprints</p>
        </div>
        <button 
          onClick={() => setIsCreateOpen(true)}
          className="bg-white text-black px-8 py-4 rounded-2xl font-bold text-[10px] uppercase hover:bg-red-600 hover:text-white transition-all shadow-lg active:scale-95 flex items-center gap-2"
        >
          Add New Design <Plus className="w-4 h-4" />
        </button>
      </section>

      {/* GRID */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
        {designs.map(design => (
          <div key={design.id} className="bg-white border border-zinc-100 rounded-[2rem] p-3 md:p-5 flex flex-col group hover:shadow-2xl transition-all duration-300">
            <div className="aspect-square bg-zinc-50 rounded-[1.5rem] mb-4 relative overflow-hidden">
              <img src={design.preview_image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={design.name} />
              <button 
                onClick={() => handleToggleFeatured(design.id, design.is_featured)}
                className={`absolute top-3 right-3 p-2.5 rounded-xl backdrop-blur-md transition-all ${design.is_featured ? 'bg-yellow-400 text-white shadow-lg' : 'bg-white/90 text-zinc-300 hover:text-zinc-600'}`}
              >
                <Star className={`w-3.5 h-3.5 ${design.is_featured ? 'fill-current' : ''}`} />
              </button>
            </div>
            
            <h3 className="text-[11px] md:text-xs font-bold uppercase truncate px-1 mb-4">{design.name}</h3>
            
            <div className="flex flex-col gap-2 mt-auto">
              <button 
                onClick={() => setUseDesignData(design)}
                className="w-full py-3 bg-zinc-900 text-white rounded-xl text-[9px] font-bold uppercase hover:bg-red-600 flex items-center justify-center gap-2 transition-colors"
              >
                <ShoppingCart className="w-3 h-3" /> Add to Order
              </button>
              <div className="flex gap-2">
                <button 
                  onClick={() => router.push(`/editor?design=${design.id}`)}
                  className="flex-1 py-3 bg-zinc-100 rounded-xl text-[9px] font-bold uppercase hover:bg-zinc-200 flex items-center justify-center gap-1"
                >
                  <Edit3 className="w-3 h-3" /> Edit
                </button>
                <button 
                  onClick={() => handleDelete(design.id)}
                  className="p-3 bg-zinc-100 rounded-xl text-zinc-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL */}
      {useDesignData && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white p-8 md:p-10 rounded-[2.5rem] w-full max-w-md relative shadow-2xl animate-in zoom-in-95">
            <button onClick={closeUseModal} className="absolute top-6 right-6 text-zinc-400 hover:text-black transition-colors"><X /></button>
            
            {!showSuccess ? (
              <div className="animate-in fade-in duration-300">
                <h2 className="text-xl font-bold uppercase tracking-tighter mb-1 text-zinc-900">Apply Design</h2>
                <p className="text-zinc-400 text-[10px] font-bold uppercase tracking-widest mb-8">Select target product</p>
                <div className="space-y-6">
                  <select 
                    className="w-full p-4 bg-zinc-50 border border-zinc-100 rounded-2xl text-xs font-bold uppercase outline-none focus:ring-2 focus:ring-red-600/20"
                    value={selectedProductId}
                    onChange={(e) => setSelectedProductId(e.target.value)}
                  >
                    <option value="">Select a base...</option>
                    {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                  <button 
                    onClick={handleCreatePlacement}
                    disabled={!selectedProductId || isSubmitting}
                    className="w-full py-5 bg-zinc-900 text-white rounded-2xl font-bold uppercase text-[11px] tracking-widest hover:bg-red-600 transition-all disabled:opacity-20 flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? <Loader2 className="animate-spin w-4 h-4" /> : <><ShoppingBag className="w-4 h-4" /> Confirm Placement</>}
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-4 animate-in slide-in-from-bottom-4 duration-500">
                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h2 className="text-2xl font-bold uppercase tracking-tighter mb-2">Added to Cart</h2>
                <p className="text-zinc-500 text-xs mb-8">Ready for checkout or keep designing.</p>
                <div className="space-y-3">
                  <button onClick={() => router.push('/cart')} className="w-full py-4 bg-red-600 text-white rounded-2xl font-bold uppercase text-[11px] tracking-widest hover:bg-red-700 transition-all flex items-center justify-center gap-2">
                    Go to Cart <ArrowRight className="w-4 h-4" />
                  </button>
                  <button onClick={closeUseModal} className="w-full py-4 bg-zinc-100 text-zinc-900 rounded-2xl font-bold uppercase text-[11px] tracking-widest hover:bg-zinc-200 transition-all">
                    Continue Shopping
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}