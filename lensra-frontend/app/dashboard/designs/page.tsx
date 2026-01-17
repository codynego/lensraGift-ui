"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Plus, Trash2, Star, X, Upload, ShoppingCart, Edit3, 
  Loader2, CheckCircle2, ArrowRight, ShoppingBag, Sparkles 
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const BaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.lensra.com/";

export default function TemplateVault() {
  const { token } = useAuth();
  const router = useRouter();

  const [templates, setTemplates] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Create Modal States
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newTemplateName, setNewTemplateName] = useState('');
  const [templateImage, setTemplateImage] = useState<File | null>(null);
  const [isFeatured, setIsFeatured] = useState(false); // New state for creation
  const [templateNote, setTemplateNote] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    if (token) loadData();
  }, [token]);

  const getFullImageUrl = (path: string) => {
    if (!path) return '/placeholder.jpg';
    if (path.startsWith('http')) return path;
    return `${BaseUrl}${path.startsWith('/') ? path.slice(1) : path}`;
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [templateRes, productRes] = await Promise.all([
        fetch(`${BaseUrl}api/designs/`, { 
          headers: { 'Authorization': `Bearer ${token}` } 
        }),
        fetch(`${BaseUrl}api/products/`)
      ]);

      const templateData = await templateRes.json();
      const productData = await productRes.json();

      setTemplates(Array.isArray(templateData) ? templateData : templateData.results || []);
      const rawProducts = Array.isArray(productData) ? productData : productData.results || [];
      setProducts(rawProducts.filter((p: any) => p.is_customizable === true));
      
    } catch (err) {
      console.error("Failed to load data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTemplate = async () => {
    if (!newTemplateName || !templateImage) return alert("Please provide a name and an image.");

    setIsCreating(true);
    const formData = new FormData();
    formData.append('name', newTemplateName);
    formData.append('overall_instructions', templateNote);
    formData.append('preview_image', templateImage); 
    formData.append('image_0', templateImage);
    formData.append('is_featured', String(isFeatured)); // Save featured status

    try {
      const res = await fetch(`${BaseUrl}api/designs/`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData,
      });

      if (res.ok) {
        setIsCreateOpen(false);
        setNewTemplateName('');
        setTemplateImage(null);
        setTemplateNote('');
        setIsFeatured(false);
        loadData();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsCreating(false);
    }
  };

  const handleToggleFeatured = async (id: number, current: boolean) => {
    try {
      const res = await fetch(`${BaseUrl}api/designs/${id}/`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ is_featured: !current })
      });
      if (res.ok) {
        setTemplates(prev => prev.map(t => t.id === id ? { ...t, is_featured: !current } : t));
      }
    } catch (err) {
      console.error("Update failed");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this template?")) return;
    try {
      const res = await fetch(`${BaseUrl}api/designs/${id}/`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) loadData();
    } catch (err) {
      console.error("Delete failed");
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <Loader2 className="w-10 h-10 animate-spin text-red-600" />
    </div>
  );

  return (
    <div className="min-h-screen bg-zinc-50 pb-20">
      <div className="max-w-7xl mx-auto px-4 pt-8">

        {/* Header */}
        <section className="bg-zinc-950 text-white rounded-[2.5rem] p-8 md:p-12 mb-12 shadow-2xl flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter">Templates</h1>
            <p className="text-zinc-500 font-bold uppercase text-[10px] tracking-[0.3em] mt-2">Manage your custom library</p>
          </div>
          <button
            onClick={() => setIsCreateOpen(true)}
            className="bg-white text-black px-10 py-5 rounded-2xl font-black text-xs uppercase hover:bg-red-600 hover:text-white transition-all shadow-xl flex items-center gap-3 active:scale-95"
          >
            <Plus className="w-5 h-5" />
            Create Template
          </button>
        </section>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {templates.map((template) => (
            <div key={template.id} className="bg-white rounded-[2rem] border border-zinc-100 overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 group">
              <div className="relative aspect-square bg-zinc-50 overflow-hidden">
                <img
                  src={getFullImageUrl(template.preview_image_url)}
                  alt={template.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <button
                  onClick={() => handleToggleFeatured(template.id, template.is_featured)}
                  className={`absolute top-4 right-4 p-3 rounded-2xl backdrop-blur-md transition-all z-10 ${
                    template.is_featured ? 'bg-yellow-400 text-white shadow-lg' : 'bg-white/80 text-zinc-300 hover:text-zinc-600'
                  }`}
                >
                  <Star className={`w-4 h-4 ${template.is_featured ? 'fill-current' : ''}`} />
                </button>
              </div>

              <div className="p-5">
                <h3 className="font-black italic uppercase text-xs mb-5 truncate text-zinc-800">{template.name}</h3>

                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => router.push(`/editor?template=${template.id}`)}
                    className="w-full py-4 bg-zinc-950 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-red-600 transition-all flex items-center justify-center gap-2"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    Use Template
                  </button>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDelete(template.id)}
                      className="flex-1 py-4 bg-red-400 rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-red-200 transition-colors flex items-center justify-center gap-2"
                    >
                       <Trash2 className="w-4 h-4" /> Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CREATE MODAL */}
        {isCreateOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
            <div className="bg-white rounded-[3rem] w-full max-w-lg p-10 relative shadow-2xl animate-in zoom-in-95">
              <button onClick={() => setIsCreateOpen(false)} className="absolute top-8 right-8 text-zinc-400 hover:text-black transition-colors"><X className="w-6 h-6"/></button>

              <h2 className="text-3xl font-black italic uppercase tracking-tighter mb-2">New Template</h2>
              <p className="text-zinc-400 text-[10px] font-bold uppercase tracking-widest mb-8">Save a new design to your library</p>

              <div className="space-y-6">
                <div className="flex items-center justify-between bg-zinc-50 p-4 rounded-2xl">
                  <span className="text-[10px] font-black uppercase text-zinc-500">Feature this design?</span>
                  <button 
                    onClick={() => setIsFeatured(!isFeatured)}
                    className={`p-2 rounded-xl transition-all ${isFeatured ? 'bg-yellow-400 text-white' : 'bg-zinc-200 text-zinc-400'}`}
                  >
                    <Star className={`w-5 h-5 ${isFeatured ? 'fill-current' : ''}`} />
                  </button>
                </div>

                <input
                  type="text"
                  value={newTemplateName}
                  onChange={(e) => setNewTemplateName(e.target.value)}
                  placeholder="Template Name (e.g. Summer Logo)"
                  className="w-full p-5 bg-zinc-50 border-2 border-transparent rounded-2xl font-bold text-xs uppercase focus:border-red-600 transition-all outline-none"
                />

                <div className="aspect-video bg-zinc-50 border-2 border-dashed border-zinc-200 rounded-[2rem] flex flex-col items-center justify-center cursor-pointer hover:bg-zinc-100 hover:border-red-400 transition-all overflow-hidden relative">
                   <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setTemplateImage(e.target.files?.[0] || null)}
                    className="hidden"
                    id="template-image"
                  />
                  <label htmlFor="template-image" className="cursor-pointer w-full h-full flex flex-col items-center justify-center">
                    {templateImage ? (
                      <p className="font-black text-red-600 text-xs uppercase">{templateImage.name}</p>
                    ) : (
                      <>
                        <Upload className="w-8 h-8 text-zinc-300 mb-2" />
                        <p className="text-[10px] font-black uppercase text-zinc-400">Click to upload artwork</p>
                      </>
                    )}
                  </label>
                </div>

                <button
                  onClick={handleCreateTemplate}
                  disabled={isCreating || !newTemplateName || !templateImage}
                  className="w-full py-6 bg-red-600 text-white rounded-2xl font-black uppercase text-[11px] tracking-widest hover:bg-red-700 transition-all shadow-xl shadow-red-600/20 disabled:opacity-20"
                >
                  {isCreating ? "Saving..." : "Save Template"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}