// "use client";
// import React, { useState, useEffect, useRef } from 'react';
// import * as fabric from 'fabric';
// import {
//   Upload, Type, Package, Check,
//   ShoppingCart, Layers, Trash2,
//   Image, LayoutTemplate, Palette,
//   ZoomIn, ZoomOut, RotateCcw, Square, Circle,
//   Save, ChevronUp, ChevronDown, Smile, Shapes,
//   Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight
// } from 'lucide-react';

// export default function DesignFirstEditor() {
//   const [products, setProducts] = useState([]);
//   const [selectedProduct, setSelectedProduct] = useState<any>(null);
//   const [activePanel, setActivePanel] = useState<string | null>('upload');
//   const [showProductPrompt, setShowProductPrompt] = useState(false);
//   const [layers, setLayers] = useState<any[]>([]);
//   const [selectedObject, setSelectedObject] = useState<any>(null);
//   const [isMobile, setIsMobile] = useState(false);

//   const canvasRef = useRef<HTMLCanvasElement>(null);
//   const fabricCanvas = useRef<fabric.Canvas | null>(null);

//   // Check mobile and responsiveness
//   useEffect(() => {
//     const checkMobile = () => {
//       const mobile = window.innerWidth < 768;
//       setIsMobile(mobile);
//       setActivePanel(mobile ? null : 'upload');
//     };
//     checkMobile();
//     window.addEventListener('resize', checkMobile);
//     return () => window.removeEventListener('resize', checkMobile);
//   }, []);

//   // Fetch Products
//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         const response = await fetch('http://localhost:8000/api/products/');
//         const data = await response.json();
//         setProducts(data);
//       } catch (err) {
//         console.error("Error fetching products:", err);
//       }
//     };
//     fetchProducts();
//   }, []);


//   useEffect(() => {
//     if (canvasRef.current) {
//       const canvasWidth = isMobile ? Math.min(window.innerWidth - 40, 350) : 600;
//       const canvasHeight = isMobile ? Math.min(window.innerHeight * 0.6, 500) : 600;
//       const canvas = new fabric.Canvas(canvasRef.current, {
//         width: canvasWidth,
//         height: canvasHeight,
//         backgroundColor: '#ffffff',
//       });
//       fabricCanvas.current = canvas;
//       canvas.on('object:added', updateLayers);
//       canvas.on('object:removed', updateLayers);
//       canvas.on('object:modified', updateLayers);
//       canvas.on('selection:created', (e) => setSelectedObject(e.selected?.[0]));
//       canvas.on('selection:updated', (e) => setSelectedObject(e.selected?.[0]));
//       canvas.on('selection:cleared', () => setSelectedObject(null));

//       // Custom delete control
//       const deleteIcon = (ctx: CanvasRenderingContext2D, left: number, top: number, styleOverride: any, fabricObject: fabric.Object) => {
//         const size = 24;
//         ctx.save();
//         ctx.translate(left, top);
//         ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle || 0));
//         ctx.fillStyle = "#FF0000";
//         ctx.beginPath();
//         ctx.arc(0, 0, size / 2, 0, Math.PI * 2, true);
//         ctx.fill();
//         ctx.strokeStyle = "#FFFFFF";
//         ctx.lineWidth = 3;
//         ctx.beginPath();
//         ctx.moveTo(-size / 4, -size / 4);
//         ctx.lineTo(size / 4, size / 4);
//         ctx.moveTo(size / 4, -size / 4);
//         ctx.lineTo(-size / 4, size / 4);
//         ctx.stroke();
//         ctx.restore();
//       };

//       const deleteObject = (eventData: fabric.TPointerEvent, transform: fabric.Transform, x: number, y: number) => {
//         const target = transform.target;
//         const canvas = target?.canvas;
//         if (canvas && target) {
//           canvas.remove(target);
//           canvas.requestRenderAll();
//           setSelectedObject(null);
//         }
//         return true;
//       };

//       // Override createControls to add delete control
//       const originalCreateControls = fabric.Object.prototype.createControls;
//       fabric.Object.prototype.createControls = function(ctx: CanvasRenderingContext2D) {
//         const controls = originalCreateControls.call(this, ctx);
//         controls.deleteControl = new fabric.Control({
//           x: 0.5,
//           y: -0.5,
//           offsetY: -16,
//           offsetX: 16,
//           cursorStyle: 'pointer',
//           mouseUpHandler: deleteObject,
//           render: deleteIcon,
//         });
//         return controls;
//       };

//       return () => {
//         canvas.dispose();
//       };
//     }
//   }, [isMobile]);

//   // Keyboard event for deletion
//   useEffect(() => {
//     const handleKeyDown = (e: KeyboardEvent) => {
//       if (e.key === 'Delete' || e.key === 'Backspace') {
//         if (selectedObject && !document.activeElement?.tagName.match(/INPUT|TEXTAREA/)) {
//           deleteSelected();
//         }
//       }
//     };
//     window.addEventListener('keydown', handleKeyDown);
//     return () => window.removeEventListener('keydown', handleKeyDown);
//   }, [selectedObject]);

//   // Auto-switch panel based on selected object
//   useEffect(() => {
//     if (selectedObject) {
//       if (selectedObject.type === 'i-text') {
//         setActivePanel('elements');
//       } else if (isShape(selectedObject.type)) {
//         setActivePanel('shapes');
//       } else if (selectedObject.type === 'image') {
//         setActivePanel('upload');
//       }
//     }
//   }, [selectedObject]);

//   const updateLayers = () => {
//     if (fabricCanvas.current) {
//       const objects = fabricCanvas.current.getObjects().map((obj, i) => ({
//         id: i,
//         type: obj.type,
//         name: `${obj.type} ${i + 1}`,
//         object: obj
//       }));
//       setLayers(objects);
//     }
//   };

//   // Image Upload
//   const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;
//     const reader = new FileReader();
//     reader.onload = async (f) => {
//       const data = f.target?.result as string;
//       const img = await fabric.FabricImage.fromURL(data);
//       img.scaleToWidth(isMobile ? 150 : 300);
//       fabricCanvas.current?.add(img);
//       fabricCanvas.current?.centerObject(img);
//       fabricCanvas.current?.setActiveObject(img);
//       fabricCanvas.current?.renderAll();
//     };
//     reader.readAsDataURL(file);
//   };

//   // Add Text
//   const addText = () => {
//     const text = new fabric.IText('Click to edit', {
//       left: 100,
//       top: 100,
//       fontSize: 32,
//       fontWeight: 'bold',
//       fill: '#000000'
//     });
//     fabricCanvas.current?.add(text);
//     fabricCanvas.current?.setActiveObject(text);
//     fabricCanvas.current?.renderAll();
//   };

//   // Add Shape with color change support
//   const addShape = (type: 'rect' | 'circle' | 'triangle' | 'star' | 'ellipse' | 'heart' | 'arrow') => {
//     let shape: fabric.Rect | fabric.Circle | fabric.Triangle | fabric.Polygon | fabric.Ellipse | fabric.Path | fabric.Group;
//     switch (type) {
//       case 'rect':
//         shape = new fabric.Rect({ left: 100, top: 100, width: 150, height: 150, fill: '#FF6B6B' });
//         break;
//       case 'circle':
//         shape = new fabric.Circle({ left: 100, top: 100, radius: 75, fill: '#4ECDC4' });
//         break;
//       case 'triangle':
//         shape = new fabric.Triangle({ left: 100, top: 100, width: 150, height: 150, fill: '#FFD93D' });
//         break;
//       case 'star':
//         const points = [
//           {x: 50, y: 0}, {x: 61, y: 35}, {x: 98, y: 35}, {x: 68, y: 57},
//           {x: 79, y: 91}, {x: 50, y: 70}, {x: 21, y: 91}, {x: 32, y: 57},
//           {x: 2, y: 35}, {x: 39, y: 35}
//         ];
//         shape = new fabric.Polygon(points, { left: 100, top: 100, fill: '#A8E6CF', scaleX: 1.5, scaleY: 1.5 });
//         break;
//       case 'ellipse':
//         shape = new fabric.Ellipse({ left: 100, top: 100, rx: 100, ry: 50, fill: '#FF8C00' });
//         break;
//       case 'heart':
//         shape = new fabric.Path('M 272.70141,238.71731 C 206.46141,238.71731 158.16141,292.47731 158.16141,326.95731 C 158.16141,361.43731 206.46141,415.19731 272.70141,415.19731 C 338.94141,415.19731 387.24141,361.43731 387.24141,326.95731 C 387.24141,292.47731 338.94141,238.71731 272.70141,238.71731 M 272.70141,448.14331 C 189.08141,448.14331 102.14141,389.36731 102.14141,326.95731 C 102.14141,264.54731 175.95141,202.77731 272.70141,202.77731 C 369.45141,202.77731 443.26141,264.54731 443.26141,326.95731 C 443.26141,389.36731 356.32141,448.14331 272.70141,448.14331 L 272.70141,448.14331 Z', { left: 100, top: 100, fill: '#FF69B4', scaleX: 0.25, scaleY: 0.25 });
//         break;
//       case 'arrow':
//         const line = new fabric.Line([0, 0, 150, 0], { stroke: '#000000', strokeWidth: 5 });
//         const triangle = new fabric.Triangle({ width: 20, height: 20, fill: '#000000', left: 150, top: -10 });
//         shape = new fabric.Group([line, triangle], { left: 100, top: 100 });
//         break;
//     }
//     fabricCanvas.current?.add(shape);
//     fabricCanvas.current?.setActiveObject(shape);
//     fabricCanvas.current?.renderAll();
//   };

//   // Update Shape Color
//   const updateShapeColor = (color: string) => {
//     if (selectedObject && ['rect', 'circle', 'triangle', 'polygon', 'ellipse', 'path'].includes(selectedObject.type)) {
//       selectedObject.set('fill', color);
//       fabricCanvas.current?.renderAll();
//     } else if (selectedObject && selectedObject.type === 'group') { // For arrow
//       selectedObject.getObjects().forEach((obj: any) => {
//         if (obj.type === 'line') obj.set('stroke', color);
//         if (obj.type === 'triangle') obj.set('fill', color);
//       });
//       fabricCanvas.current?.renderAll();
//     }
//   };

//   // Add Emoji
//   const addEmoji = (emoji: string) => {
//     const text = new fabric.IText(emoji, {
//       left: 100,
//       top: 100,
//       fontSize: 80,
//       fill: '#000000'
//     });
//     fabricCanvas.current?.add(text);
//     fabricCanvas.current?.setActiveObject(text);
//     fabricCanvas.current?.renderAll();
//   };

//   // Layer Reordering
//   const moveLayer = (index: number, direction: 'up' | 'down') => {
//     const canvas = fabricCanvas.current;
//     if (!canvas) return;
//     const objects = canvas.getObjects();
//     const actualIndex = objects.length - 1 - index;

//     if (direction === 'up' && actualIndex < objects.length - 1) {
//       canvas.bringObjectToFront(objects[actualIndex]);
//     } else if (direction === 'down' && actualIndex > 0) {
//       canvas.sendObjectToBack(objects[actualIndex]);
//     }
//     canvas.renderAll();
//     updateLayers();
//   };

//   // Delete Selected
//   const deleteSelected = () => {
//     const active = fabricCanvas.current?.getActiveObject();
//     if (active) {
//       fabricCanvas.current?.remove(active);
//       fabricCanvas.current?.discardActiveObject();
//       fabricCanvas.current?.renderAll();
//       setSelectedObject(null);
//     }
//   };

//   // Text Styling
//   const updateTextStyle = (property: string, value: any) => {
//     if (selectedObject && selectedObject.type === 'i-text') {
//       selectedObject.set(property, value);
//       fabricCanvas.current?.renderAll();
//     }
//   };

//   const toggleTextStyle = (property: string) => {
//     if (selectedObject && selectedObject.type === 'i-text') {
//       const currentValue = selectedObject.get(property);
//       selectedObject.set(property, !currentValue || currentValue === 'normal' ?
//         (property === 'fontWeight' ? 'bold' : property === 'fontStyle' ? 'italic' : true) :
//         (property === 'fontWeight' || property === 'fontStyle' ? 'normal' : false)
//       );
//       fabricCanvas.current?.renderAll();
//     }
//   };

//   // Update Opacity
//   const updateOpacity = (value: number) => {
//     if (selectedObject) {
//       selectedObject.set('opacity', value);
//       fabricCanvas.current?.renderAll();
//     }
//   };

//   // Save Design
//   const saveDesign = async () => {
//     const designData = fabricCanvas.current?.toJSON();
//     const previewImage = fabricCanvas.current?.toDataURL({ format: 'png', multiplier: 2 });

//     console.log("💾 Saving design...", { designData, previewImage });
//     alert('✅ Design saved successfully!');
//   };

//   // Checkout
//   const handleCheckout = async () => {
//     if (!selectedProduct) {
//       setShowProductPrompt(true);
//       setActivePanel('product');
//       return;
//     }

//     const designData = fabricCanvas.current?.toJSON();
//     const previewImage = fabricCanvas.current?.toDataURL({ format: 'png', multiplier: 2 });

//     const payload = {
//       product_id: selectedProduct.id,
//       design_data: designData,
//       preview_image: previewImage
//     };

//     console.log("💾 Auto-saving design & proceeding to checkout:", payload);
//     alert(`✅ Design saved!\nProduct: ${selectedProduct.name}\nReady for checkout.`);
//   };

//   const emojis = ['😀', '❤️', '🎉', '⭐', '🔥', '💎', '🌟', '✨', '🎨', '🚀', '💡', '🎵', '🐶', '🐱', '🌈', '🍎', '📚', '🏀', '🎸', '🌺', '🍕', '🚗', '🦄', '🎂', '☕', '📱', '🕶️', '🎤', '🏞️', '🛡️'];

//   const handleMobilePanel = (panel: string) => {
//     setActivePanel(activePanel === panel ? null : panel);
//   };

//   const isShape = (type: string) => ['rect', 'circle', 'triangle', 'polygon', 'ellipse', 'path', 'group'].includes(type);

//   const getShapeColor = () => {
//     if (selectedObject && ['rect', 'circle', 'triangle', 'polygon', 'ellipse', 'path'].includes(selectedObject.type)) {
//       return selectedObject.fill || '#000000';
//     } else if (selectedObject && selectedObject.type === 'group') {
//       const line = selectedObject.getObjects()[0];
//       return line?.stroke || '#000000';
//     }
//     return '#000000';
//   };

//   const getOpacity = () => selectedObject?.opacity || 1;

//   const PanelContent = () => {
//     if (activePanel === 'upload') {
//       return (
//         <div className="p-6 space-y-6">
//           <div>
//             <h2 className="text-2xl font-black uppercase tracking-tighter">Uploads</h2>
//             <p className="text-xs text-zinc-400 mt-1">Add your images</p>
//           </div>
//           <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-zinc-200 rounded-3xl cursor-pointer hover:border-red-500 hover:bg-red-50/50 transition-all group">
//             <Upload className="text-zinc-300 group-hover:text-red-500 mb-3 transition-colors" size={32} />
//             <span className="text-xs font-bold text-zinc-600 group-hover:text-red-600 uppercase tracking-wider">Click to Upload</span>
//             <span className="text-xs text-zinc-400 mt-1">PNG, JPG, SVG</span>
//             <input type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
//           </label>
//           {selectedObject?.type === 'image' && (
//             <div className="space-y-4 p-4 bg-zinc-50 rounded-2xl">
//               <p className="text-xs font-bold text-zinc-700 uppercase">Image Styling</p>
//               <div>
//                 <label className="text-xs text-zinc-500 block mb-2">Opacity</label>
//                 <input
//                   type="range"
//                   min="0"
//                   max="1"
//                   step="0.01"
//                   value={getOpacity()}
//                   onChange={(e) => updateOpacity(parseFloat(e.target.value))}
//                   className="w-full"
//                 />
//               </div>
//               <div className="flex justify-end">
//                 <button onClick={deleteSelected} className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-1">
//                   <Trash2 size={16} /> Delete
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>
//       );
//     }
//     if (activePanel === 'elements') {
//       return (
//         <div className="p-6 space-y-6">
//           <div>
//             <h2 className="text-2xl font-black uppercase tracking-tighter">Text</h2>
//             <p className="text-xs text-zinc-400 mt-1">Add and style text</p>
//           </div>

//           <button onClick={addText} className="w-full p-4 bg-zinc-50 hover:bg-zinc-100 rounded-2xl flex items-center gap-3 transition-all group">
//             <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center group-hover:bg-red-50 transition-colors">
//               <Type size={20} className="text-zinc-700 group-hover:text-red-600" />
//             </div>
//             <div className="text-left">
//               <p className="text-sm font-bold">Add Text</p>
//               <p className="text-xs text-zinc-400">Click to edit</p>
//             </div>
//           </button>
//           {selectedObject?.type === 'i-text' && (
//             <div className="space-y-4 p-4 bg-zinc-50 rounded-2xl">
//               <p className="text-xs font-bold text-zinc-700 uppercase">Text Styling</p>

//               {/* Font Size */}
//               <div>
//                 <label className="text-xs text-zinc-500 block mb-2">Font Size</label>
//                 <input
//                   type="range"
//                   min="10"
//                   max="120"
//                   value={selectedObject.fontSize || 32}
//                   onChange={(e) => updateTextStyle('fontSize', parseInt(e.target.value))}
//                   className="w-full"
//                 />
//               </div>
//               {/* Color */}
//               <div>
//                 <label className="text-xs text-zinc-500 block mb-2">Color</label>
//                 <input
//                   type="color"
//                   value={selectedObject.fill || '#000000'}
//                   onChange={(e) => updateTextStyle('fill', e.target.value)}
//                   className="w-full h-10 rounded-lg cursor-pointer"
//                 />
//               </div>
//               {/* Opacity */}
//               <div>
//                 <label className="text-xs text-zinc-500 block mb-2">Opacity</label>
//                 <input
//                   type="range"
//                   min="0"
//                   max="1"
//                   step="0.01"
//                   value={getOpacity()}
//                   onChange={(e) => updateOpacity(parseFloat(e.target.value))}
//                   className="w-full"
//                 />
//               </div>
//               {/* Style Buttons */}
//               <div className="flex gap-2">
//                 <button onClick={() => toggleTextStyle('fontWeight')} className="flex-1 p-2 bg-white rounded-lg hover:bg-zinc-100 transition-colors">
//                   <Bold size={18} className="mx-auto" />
//                 </button>
//                 <button onClick={() => toggleTextStyle('fontStyle')} className="flex-1 p-2 bg-white rounded-lg hover:bg-zinc-100 transition-colors">
//                   <Italic size={18} className="mx-auto" />
//                 </button>
//                 <button onClick={() => toggleTextStyle('underline')} className="flex-1 p-2 bg-white rounded-lg hover:bg-zinc-100 transition-colors">
//                   <Underline size={18} className="mx-auto" />
//                 </button>
//               </div>
//               {/* Alignment */}
//               <div className="flex gap-2">
//                 <button onClick={() => updateTextStyle('textAlign', 'left')} className="flex-1 p-2 bg-white rounded-lg hover:bg-zinc-100 transition-colors">
//                   <AlignLeft size={18} className="mx-auto" />
//                 </button>
//                 <button onClick={() => updateTextStyle('textAlign', 'center')} className="flex-1 p-2 bg-white rounded-lg hover:bg-zinc-100 transition-colors">
//                   <AlignCenter size={18} className="mx-auto" />
//                 </button>
//                 <button onClick={() => updateTextStyle('textAlign', 'right')} className="flex-1 p-2 bg-white rounded-lg hover:bg-zinc-100 transition-colors">
//                   <AlignRight size={18} className="mx-auto" />
//                 </button>
//               </div>
//               {/* Font Family */}
//               <div>
//                 <label className="text-xs text-zinc-500 block mb-2">Font</label>
//                 <select
//                   value={selectedObject.fontFamily || 'Arial'}
//                   onChange={(e) => updateTextStyle('fontFamily', e.target.value)}
//                   className="w-full p-2 bg-white rounded-lg border border-zinc-200"
//                 >
//                   <option value="Arial">Arial</option>
//                   <option value="Helvetica">Helvetica</option>
//                   <option value="Times New Roman">Times New Roman</option>
//                   <option value="Courier New">Courier New</option>
//                   <option value="Georgia">Georgia</option>
//                   <option value="Verdana">Verdana</option>
//                   <option value="Impact">Impact</option>
//                   <option value="Comic Sans MS">Comic Sans MS</option>
//                   <option value="Tahoma">Tahoma</option>
//                   <option value="Trebuchet MS">Trebuchet MS</option>
//                 </select>
//               </div>
//               <div className="flex justify-end">
//                 <button onClick={deleteSelected} className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-1">
//                   <Trash2 size={16} /> Delete
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>
//       );
//     }
//     if (activePanel === 'shapes') {
//       return (
//         <div className="p-6 space-y-6">
//           <div>
//             <h2 className="text-2xl font-black uppercase tracking-tighter">Shapes</h2>
//             <p className="text-xs text-zinc-400 mt-1">Add geometric shapes</p>
//           </div>

//           <div className="grid grid-cols-2 gap-3">
//             <button onClick={() => addShape('rect')} className="p-6 bg-zinc-50 hover:bg-zinc-100 rounded-2xl transition-all group">
//               <div className="w-full h-20 bg-red-500 rounded-xl group-hover:scale-105 transition-transform" />
//               <p className="text-xs font-bold mt-3 text-center">Rectangle</p>
//             </button>
//             <button onClick={() => addShape('circle')} className="p-6 bg-zinc-50 hover:bg-zinc-100 rounded-2xl transition-all group">
//               <div className="w-20 h-20 bg-blue-500 rounded-full mx-auto group-hover:scale-105 transition-transform" />
//               <p className="text-xs font-bold mt-3 text-center">Circle</p>
//             </button>
//             <button onClick={() => addShape('triangle')} className="p-6 bg-zinc-50 hover:bg-zinc-100 rounded-2xl transition-all group">
//               <div className="w-0 h-0 border-l-[40px] border-l-transparent border-r-[40px] border-r-transparent border-b-[70px] border-b-yellow-500 mx-auto group-hover:scale-105 transition-transform" />
//               <p className="text-xs font-bold mt-3 text-center">Triangle</p>
//             </button>
//             <button onClick={() => addShape('star')} className="p-6 bg-zinc-50 hover:bg-zinc-100 rounded-2xl transition-all group">
//               <div className="text-5xl mx-auto text-center group-hover:scale-105 transition-transform">⭐</div>
//               <p className="text-xs font-bold mt-3 text-center">Star</p>
//             </button>
//             <button onClick={() => addShape('ellipse')} className="p-6 bg-zinc-50 hover:bg-zinc-100 rounded-2xl transition-all group">
//               <div className="w-24 h-16 bg-orange-500 rounded-full mx-auto group-hover:scale-105 transition-transform" />
//               <p className="text-xs font-bold mt-3 text-center">Ellipse</p>
//             </button>
//             <button onClick={() => addShape('heart')} className="p-6 bg-zinc-50 hover:bg-zinc-100 rounded-2xl transition-all group">
//               <div className="text-5xl mx-auto text-center text-pink-500 group-hover:scale-105 transition-transform">❤️</div>
//               <p className="text-xs font-bold mt-3 text-center">Heart</p>
//             </button>
//             <button onClick={() => addShape('arrow')} className="p-6 bg-zinc-50 hover:bg-zinc-100 rounded-2xl transition-all group">
//               <div className="text-5xl mx-auto text-center group-hover:scale-105 transition-transform">➡️</div>
//               <p className="text-xs font-bold mt-3 text-center">Arrow</p>
//             </button>
//           </div>

//           {selectedObject && isShape(selectedObject.type) && (
//             <div className="space-y-4 p-4 bg-zinc-50 rounded-2xl mt-4">
//               <p className="text-xs font-bold text-zinc-700 uppercase">Shape Styling</p>
//               <div>
//                 <label className="text-xs text-zinc-500 block mb-2">Color</label>
//                 <input
//                   type="color"
//                   value={getShapeColor()}
//                   onChange={(e) => updateShapeColor(e.target.value)}
//                   className="w-full h-10 rounded-lg cursor-pointer"
//                 />
//               </div>
//               <div>
//                 <label className="text-xs text-zinc-500 block mb-2">Opacity</label>
//                 <input
//                   type="range"
//                   min="0"
//                   max="1"
//                   step="0.01"
//                   value={getOpacity()}
//                   onChange={(e) => updateOpacity(parseFloat(e.target.value))}
//                   className="w-full"
//                 />
//               </div>
//               <div className="flex justify-end">
//                 <button onClick={deleteSelected} className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-1">
//                   <Trash2 size={16} /> Delete
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>
//       );
//     }
//     if (activePanel === 'emoji') {
//       return (
//         <div className="p-6 space-y-6">
//           <div>
//             <h2 className="text-2xl font-black uppercase tracking-tighter">Emojis</h2>
//             <p className="text-xs text-zinc-400 mt-1">Add fun emojis</p>
//           </div>

//           <div className="grid grid-cols-4 gap-3">
//             {emojis.map((emoji, i) => (
//               <button
//                 key={i}
//                 onClick={() => addEmoji(emoji)}
//                 className="p-4 bg-zinc-50 hover:bg-zinc-100 rounded-2xl text-3xl transition-all hover:scale-110"
//               >
//                 {emoji}
//               </button>
//             ))}
//           </div>
//         </div>
//       );
//     }
//     if (activePanel === 'templates') {
//       return (
//         <div className="p-6 space-y-6">
//           <div>
//             <h2 className="text-2xl font-black uppercase tracking-tighter">Templates</h2>
//             <p className="text-xs text-zinc-400 mt-1">Load & edit designs</p>
//           </div>
//           <div className="text-center text-zinc-400 text-sm py-12">
//             Templates coming soon...
//           </div>
//         </div>
//       );
//     }
//     if (activePanel === 'layers') {
//       return (
//         <div className="p-6 space-y-6">
//           <div className="flex items-center justify-between">
//             <div>
//               <h2 className="text-2xl font-black uppercase tracking-tighter">Layers</h2>
//               <p className="text-xs text-zinc-400 mt-1">{layers.length} objects</p>
//             </div>
//             <button onClick={deleteSelected} className="p-2 hover:bg-red-50 rounded-lg transition-colors">
//               <Trash2 size={18} className="text-red-500" />
//             </button>
//           </div>
//           <div className="space-y-2">
//             {layers.length === 0 ? (
//               <div className="text-center text-zinc-400 text-sm py-8">No layers yet</div>
//             ) : (
//               layers.slice().reverse().map((layer, i) => (
//                 <div key={layer.id} className="p-3 bg-zinc-50 rounded-xl flex items-center gap-3 hover:bg-zinc-100 transition-colors">
//                   <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
//                     {layer.type === 'image' ? <Image size={16} /> :
//                      layer.type === 'i-text' ? <Type size={16} /> :
//                      <Package size={16} />}
//                   </div>
//                   <span className="text-sm font-medium flex-1">{layer.name}</span>
//                   <div className="flex gap-1">
//                     <button onClick={() => moveLayer(i, 'up')} className="p-1 hover:bg-white rounded transition-colors">
//                       <ChevronUp size={16} />
//                     </button>
//                     <button onClick={() => moveLayer(i, 'down')} className="p-1 hover:bg-white rounded transition-colors">
//                       <ChevronDown size={16} />
//                     </button>
//                   </div>
//                 </div>
//               ))
//             )}
//           </div>
//         </div>
//       );
//     }
//     if (activePanel === 'product') {
//       return (
//         <div className="p-6 space-y-6">
//           <div>
//             <h2 className="text-2xl font-black uppercase tracking-tighter">Product</h2>
//             <p className="text-xs text-zinc-400 mt-1">Required for checkout</p>
//           </div>
//           {showProductPrompt && (
//             <div className="p-4 bg-red-50 border-2 border-red-200 text-red-600 rounded-2xl text-xs font-bold animate-pulse">
//               ⚠️ Please select a product before checkout
//             </div>
//           )}
//           <div className="space-y-3">
//             {products.map((p: any) => (
//               <button
//                 key={p.id}
//                 onClick={() => { setSelectedProduct(p); setShowProductPrompt(false); }}
//                 className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all ${selectedProduct?.id === p.id ? 'border-black bg-zinc-50 shadow-md' : 'border-zinc-100 hover:border-zinc-300'}`}
//               >
//                 <img src={p.image} className="w-14 h-14 rounded-xl object-cover bg-white" alt={p.name} />
//                 <div className="text-left flex-1">
//                   <p className="text-sm font-bold">{p.name}</p>
//                   <p className="text-xs text-zinc-500">${p.base_price}</p>
//                 </div>
//                 {selectedProduct?.id === p.id && <Check size={18} className="text-green-600" />}
//               </button>
//             ))}
//           </div>
//         </div>
//       );
//     }
//     return null;
//   };

//   return (
//     <div className="flex flex-col md:flex-row h-screen bg-[#FDFDFD] overflow-hidden font-sans">

//       {/* DESKTOP TOOLBAR */}
//       {!isMobile && (
//         <aside className="w-20 bg-zinc-950 flex flex-col items-center py-8 gap-6 z-30">
//           <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-orange-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
//             <Palette className="text-white" size={24} />
//           </div>

//           <button onClick={() => setActivePanel('upload')} className={`p-4 rounded-2xl transition-all ${activePanel === 'upload' ? 'bg-zinc-800 text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}>
//             <Upload size={22} />
//           </button>
//           <button onClick={() => setActivePanel('elements')} className={`p-4 rounded-2xl transition-all ${activePanel === 'elements' ? 'bg-zinc-800 text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}>
//             <Type size={22} />
//           </button>
//           <button onClick={() => setActivePanel('shapes')} className={`p-4 rounded-2xl transition-all ${activePanel === 'shapes' ? 'bg-zinc-800 text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}>
//             <Shapes size={22} />
//           </button>
//           <button onClick={() => setActivePanel('emoji')} className={`p-4 rounded-2xl transition-all ${activePanel === 'emoji' ? 'bg-zinc-800 text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}>
//             <Smile size={22} />
//           </button>

//           <button onClick={() => setActivePanel('templates')} className={`p-4 rounded-2xl transition-all ${activePanel === 'templates' ? 'bg-zinc-800 text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}>
//             <LayoutTemplate size={22} />
//           </button>
//           <button onClick={() => setActivePanel('layers')} className={`p-4 rounded-2xl transition-all ${activePanel === 'layers' ? 'bg-zinc-800 text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}>
//             <Layers size={22} />
//           </button>
//           <div className="h-px w-12 bg-zinc-800 my-2" />
//           <button onClick={() => setActivePanel('product')} className={`relative p-4 rounded-2xl transition-all ${activePanel === 'product' ? 'bg-red-600 text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}>
//             <Package size={22} />
//             {selectedProduct && <div className="absolute top-2 right-2 w-3 h-3 bg-green-500 rounded-full border-2 border-zinc-950" />}
//           </button>
//         </aside>
//       )}
//       {/* DESKTOP SIDE PANEL */}
//       {!isMobile && (
//         <div className="w-80 bg-white border-r border-zinc-100 overflow-y-auto">
//           <PanelContent />
//         </div>
//       )}
//       {/* MOBILE PANEL */}
//       {isMobile && activePanel && (
//         <div className="fixed bottom-16 left-0 right-0 max-h-[60vh] bg-white border-t border-zinc-200 overflow-y-auto p-4 shadow-lg z-30">
//           <PanelContent />
//         </div>
//       )}
//       {/* CANVAS VIEWPORT */}
//       <main className="flex-1 flex flex-col items-center justify-center bg-gradient-to-br from-zinc-50 to-zinc-100 p-4 md:p-12 relative">
//         <div className="bg-white p-4 md:p-8 rounded-3xl shadow-[0_32px_64px_-12px_rgba(0,0,0,0.12)] relative max-w-full">
//            <canvas ref={canvasRef} className="border border-zinc-100 rounded-lg" />

//            <div className="absolute top-2 right-2 bg-black/80 text-white text-xs px-3 py-1.5 rounded-full backdrop-blur-sm">
//              {isMobile ? `${Math.min(window.innerWidth - 40, 350)}×${Math.min(window.innerHeight * 0.6, 500)}` : '600×600'}px
//            </div>
//         </div>
//         {/* Floating Controls */}
//         {!isMobile && (
//           <div className="absolute bottom-8 flex gap-2 bg-white/95 backdrop-blur-md p-2 rounded-full border border-zinc-200 shadow-2xl">
//              <button className="p-3 hover:bg-zinc-50 rounded-full transition-colors"><ZoomIn size={18} /></button>
//              <button className="p-3 hover:bg-zinc-50 rounded-full transition-colors"><ZoomOut size={18} /></button>
//              <button className="p-3 hover:bg-zinc-50 rounded-full transition-colors"><RotateCcw size={18} /></button>
//           </div>
//         )}
//       </main>
//       {/* HEADER ACTIONS */}
//       <header className="fixed top-0 left-0 right-0 h-16 md:h-24 px-4 md:px-12 flex items-center justify-between pointer-events-none z-40 bg-gradient-to-b from-white/80 to-transparent backdrop-blur-sm">
//         <div className="pointer-events-auto">
//            <div className="text-lg md:text-xl font-black">DesignStudio</div>
//         </div>
//         <div className="pointer-events-auto flex gap-2">
//           <button onClick={saveDesign} className="bg-white text-black px-4 md:px-6 py-2 md:py-3 rounded-full font-bold text-xs uppercase flex items-center gap-2 hover:bg-zinc-100 transition-all shadow-lg border border-zinc-200">
//             <Save size={16} /> Save
//           </button>
//           <button onClick={handleCheckout} className="bg-black text-white px-4 md:px-8 py-2 md:py-3 rounded-full font-black text-xs uppercase tracking-wider flex items-center gap-2 hover:bg-red-600 hover:scale-105 transition-all shadow-xl">
//             <ShoppingCart size={16} /> Checkout
//           </button>
//         </div>
//       </header>
//       {/* MOBILE BOTTOM TOOLBAR */}
//       {isMobile && (
//         <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-zinc-200 p-4 z-40">
//           <div className="flex gap-2 overflow-x-auto pb-2">
//             <button onClick={() => handleMobilePanel('upload')} className={`flex-shrink-0 p-3 rounded-xl ${activePanel === 'upload' ? 'bg-zinc-900 text-white' : 'bg-zinc-100 text-zinc-600'}`}>
//               <Upload size={20} />
//             </button>
//             <button onClick={() => handleMobilePanel('elements')} className={`flex-shrink-0 p-3 rounded-xl ${activePanel === 'elements' ? 'bg-zinc-900 text-white' : 'bg-zinc-100 text-zinc-600'}`}>
//               <Type size={20} />
//             </button>
//             <button onClick={() => handleMobilePanel('shapes')} className={`flex-shrink-0 p-3 rounded-xl ${activePanel === 'shapes' ? 'bg-zinc-900 text-white' : 'bg-zinc-100 text-zinc-600'}`}>
//               <Shapes size={20} />
//             </button>
//             <button onClick={() => handleMobilePanel('emoji')} className={`flex-shrink-0 p-3 rounded-xl ${activePanel === 'emoji' ? 'bg-zinc-900 text-white' : 'bg-zinc-100 text-zinc-600'}`}>
//               <Smile size={20} />
//             </button>
//             <button onClick={() => handleMobilePanel('templates')} className={`flex-shrink-0 p-3 rounded-xl ${activePanel === 'templates' ? 'bg-zinc-900 text-white' : 'bg-zinc-100 text-zinc-600'}`}>
//               <LayoutTemplate size={20} />
//             </button>
//             <button onClick={() => handleMobilePanel('layers')} className={`flex-shrink-0 p-3 rounded-xl ${activePanel === 'layers' ? 'bg-zinc-900 text-white' : 'bg-zinc-100 text-zinc-600'}`}>
//               <Layers size={20} />
//             </button>
//             <button onClick={() => handleMobilePanel('product')} className={`flex-shrink-0 p-3 rounded-xl ${activePanel === 'product' ? 'bg-zinc-900 text-white' : 'bg-zinc-100 text-zinc-600'}`}>
//               <Package size={20} />
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }