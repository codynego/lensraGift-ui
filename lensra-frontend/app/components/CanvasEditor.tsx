"use client";

import { useEffect, useRef, useState } from "react";
import * as fabric from "fabric";
import { 
  Type, 
  Image, 
  Trash2, 
  Download, 
  AlignLeft, 
  AlignCenter, 
  AlignRight,
  Bold,
  Italic,
  Underline,
  Copy,
  Layers,
  ChevronUp,
  ChevronDown,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Shirt,
  Coffee,
  ShoppingBag
} from "lucide-react";

// Product templates with print areas
const PRODUCTS = {
  tshirt: {
    name: "T-Shirt",
    icon: Shirt,
    canvasWidth: 400,
    canvasHeight: 500,
    printArea: { x: 50, y: 100, width: 300, height: 300 },
    mockupColor: "#ffffff"
  },
  mug: {
    name: "Mug",
    icon: Coffee,
    canvasWidth: 500,
    canvasHeight: 400,
    printArea: { x: 125, y: 100, width: 250, height: 200 },
    mockupColor: "#ffffff"
  },
  totebag: {
    name: "Tote Bag",
    icon: ShoppingBag,
    canvasWidth: 450,
    canvasHeight: 450,
    printArea: { x: 75, y: 75, width: 300, height: 300 },
    mockupColor: "#f5f5dc"
  }
};

type ProductType = keyof typeof PRODUCTS;

export default function CanvasEditor() {
  const canvasRef = useRef<fabric.Canvas | null>(null);
  const htmlCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<ProductType>("tshirt");
  const [selectedObject, setSelectedObject] = useState<fabric.Object | null>(null);
  const [canvasObjects, setCanvasObjects] = useState<fabric.Object[]>([]);
  const [showPrintArea, setShowPrintArea] = useState(true);
  const [productColor, setProductColor] = useState("#ffffff");
  const [textProps, setTextProps] = useState({
    fontSize: 24,
    fontFamily: "Arial",
    fill: "#000000",
    fontWeight: "normal",
    fontStyle: "normal",
    underline: false,
    textAlign: "left"
  });

  // Initialize canvas
  useEffect(() => {
    if (!htmlCanvasRef.current) return;

    const product = PRODUCTS[selectedProduct];
    const canvas = new fabric.Canvas(htmlCanvasRef.current, {
      width: product.canvasWidth,
      height: product.canvasHeight,
      backgroundColor: productColor,
    });

    canvasRef.current = canvas;

    // Add print area guide
    if (showPrintArea) {
      addPrintAreaGuide(canvas);
    }

    // Selection events
    canvas.on("selection:created", (e) => {
      setSelectedObject(e.selected?.[0] || null);
      updateTextProps(e.selected?.[0]);
    });

    canvas.on("selection:updated", (e) => {
      setSelectedObject(e.selected?.[0] || null);
      updateTextProps(e.selected?.[0]);
    });

    canvas.on("selection:cleared", () => {
      setSelectedObject(null);
    });

    canvas.on("object:modified", updateObjectsList);
    canvas.on("object:added", updateObjectsList);
    canvas.on("object:removed", updateObjectsList);

    // Constrain objects to print area
    canvas.on("object:moving", (e) => {
      constrainToPrintArea(e.target);
    });

    canvas.on("object:scaling", (e) => {
      constrainToPrintArea(e.target);
    });

    return () => {
      canvas.dispose();
    };
  }, [selectedProduct, showPrintArea, productColor]);

  const addPrintAreaGuide = (canvas: fabric.Canvas) => {
    const product = PRODUCTS[selectedProduct];
    const { x, y, width, height } = product.printArea;

    const printAreaRect = new fabric.Rect({
      left: x,
      top: y,
      width: width,
      height: height,
      fill: "transparent",
      stroke: "#3b82f6",
      strokeWidth: 2,
      strokeDashArray: [5, 5],
      selectable: false,
      evented: false,
      name: "printAreaGuide"
    });

    canvas.add(printAreaRect);
    canvas.sendObjectToBack(printAreaRect);

    // Add label
    const label = new fabric.Text("Print Area", {
      left: x + 5,
      top: y + 5,
      fontSize: 12,
      fill: "#3b82f6",
      selectable: false,
      evented: false,
      name: "printAreaLabel"
    });

    canvas.add(label);
  };

  const constrainToPrintArea = (obj: any) => {
    if (!obj || obj.name === "printAreaGuide" || obj.name === "printAreaLabel") return;

    const product = PRODUCTS[selectedProduct];
    const { x, y, width, height } = product.printArea;

    const objBounds = obj.getBoundingRect();

    // Constrain to print area boundaries
    if (objBounds.left < x) {
      obj.left = x + (obj.left! - objBounds.left);
    }
    if (objBounds.top < y) {
      obj.top = y + (obj.top! - objBounds.top);
    }
    if (objBounds.left + objBounds.width > x + width) {
      obj.left = x + width - objBounds.width + (obj.left! - objBounds.left);
    }
    if (objBounds.top + objBounds.height > y + height) {
      obj.top = y + height - objBounds.height + (obj.top! - objBounds.top);
    }

    obj.setCoords();
  };

  const updateObjectsList = () => {
    if (!canvasRef.current) return;
    const objects = canvasRef.current.getObjects().filter(
      obj => !(obj as any).name?.includes("printArea")
    );
    setCanvasObjects([...objects]);
  };

  const updateTextProps = (obj: any) => {
    if (obj?.type === "i-text" || obj?.type === "text") {
      setTextProps({
        fontSize: obj.fontSize || 24,
        fontFamily: obj.fontFamily || "Arial",
        fill: obj.fill || "#000000",
        fontWeight: obj.fontWeight || "normal",
        fontStyle: obj.fontStyle || "normal",
        underline: obj.underline || false,
        textAlign: obj.textAlign || "left"
      });
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !canvasRef.current) return;

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      fabric.Image.fromURL(dataUrl, {}, (img: fabric.Image) => {
        const product = PRODUCTS[selectedProduct];
        const printArea = product.printArea;
        
        // Scale to fit print area
        const maxWidth = printArea.width * 0.7;
        const maxHeight = printArea.height * 0.7;
        
        if (img.width! > maxWidth || img.height! > maxHeight) {
          const scale = Math.min(maxWidth / img.width!, maxHeight / img.height!);
          img.scale(scale);
        }
        
        // Center in print area
        img.set({
          left: printArea.x + (printArea.width - img.getScaledWidth()) / 2,
          top: printArea.y + (printArea.height - img.getScaledHeight()) / 2,
        });
        
        canvasRef.current?.add(img);
        canvasRef.current?.setActiveObject(img);
        canvasRef.current?.renderAll();
      });
    };
    reader.readAsDataURL(file);
  };

  const addText = () => {
    if (!canvasRef.current) return;

    const product = PRODUCTS[selectedProduct];
    const printArea = product.printArea;

    const text = new fabric.IText("Double click to edit", {
      left: printArea.x + printArea.width / 2 - 75,
      top: printArea.y + printArea.height / 2,
      fontSize: textProps.fontSize,
      fontFamily: textProps.fontFamily,
      fill: textProps.fill,
    });

    canvasRef.current.add(text);
    canvasRef.current.setActiveObject(text);
    canvasRef.current.renderAll();
  };

  const deleteSelected = () => {
    if (!canvasRef.current || !selectedObject) return;
    canvasRef.current.remove(selectedObject);
    canvasRef.current.renderAll();
  };

  const duplicateSelected = async () => {
    if (!canvasRef.current || !selectedObject) return;
    
    const cloned = await selectedObject.clone();
    cloned.set({
      left: (cloned.left || 0) + 20,
      top: (cloned.top || 0) + 20,
    });
    canvasRef.current?.add(cloned);
    canvasRef.current?.setActiveObject(cloned);
    canvasRef.current?.renderAll();
  };

  const updateTextProperty = (prop: string, value: any) => {
    if (!canvasRef.current || !selectedObject) return;
    if (selectedObject.type !== "i-text" && selectedObject.type !== "text") return;

    selectedObject.set(prop as any, value);
    canvasRef.current.renderAll();
    setTextProps(prev => ({ ...prev, [prop]: value }));
  };

  const toggleTextStyle = (style: "bold" | "italic" | "underline") => {
    if (!selectedObject) return;

    if (style === "bold") {
      const newWeight = textProps.fontWeight === "bold" ? "normal" : "bold";
      updateTextProperty("fontWeight", newWeight);
    } else if (style === "italic") {
      const newStyle = textProps.fontStyle === "italic" ? "normal" : "italic";
      updateTextProperty("fontStyle", newStyle);
    } else if (style === "underline") {
      updateTextProperty("underline", !textProps.underline);
    }
  };

  const changeAlignment = (align: "left" | "center" | "right") => {
    updateTextProperty("textAlign", align);
  };

  const moveLayer = (obj: fabric.Object, direction: "up" | "down") => {
    if (!canvasRef.current) return;
    
    if (direction === "up") {
      canvasRef.current.bringObjectForward(obj);
    } else {
      canvasRef.current.sendObjectBackwards(obj);
    }
    canvasRef.current.renderAll();
    updateObjectsList();
  };

  const toggleVisibility = (obj: fabric.Object) => {
    obj.set("visible", !obj.visible);
    canvasRef.current?.renderAll();
    updateObjectsList();
  };

  const toggleLock = (obj: fabric.Object) => {
    const isLocked = !obj.selectable;
    obj.set({
      selectable: isLocked,
      evented: isLocked,
    });
    canvasRef.current?.renderAll();
    updateObjectsList();
  };

  const exportDesign = () => {
    if (!canvasRef.current) return;
    
    // Hide print area guide before export
    const objects = canvasRef.current.getObjects();
    const guides = objects.filter((obj: any) => obj.name?.includes("printArea"));
    guides.forEach(guide => guide.set("visible", false));
    canvasRef.current.renderAll();
    
    const dataURL = canvasRef.current.toDataURL({
      format: "png",
      quality: 1,
      multiplier: 3, // 3x for high resolution
    });

    // Restore guides
    guides.forEach(guide => guide.set("visible", true));
    canvasRef.current.renderAll();

    const link = document.createElement("a");
    link.download = `${selectedProduct}-design.png`;
    link.href = dataURL;
    link.click();
  };

  const changeProduct = (productType: ProductType) => {
    if (!canvasRef.current) return;
    
    // Save current design
    const json = canvasRef.current.toJSON();
    const userObjects = canvasRef.current.getObjects().filter(
      obj => !(obj as any).name?.includes("printArea")
    );
    
    setSelectedProduct(productType);
    
    // Clear and restore user objects
    setTimeout(() => {
      if (!canvasRef.current) return;
      userObjects.forEach(obj => {
        canvasRef.current?.add(obj);
      });
      canvasRef.current.renderAll();
    }, 100);
  };

  const isTextSelected = selectedObject?.type === "i-text" || selectedObject?.type === "text";

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Toolbar */}
      <div className="w-64 bg-white border-r p-4 space-y-4 overflow-y-auto">
        <h2 className="font-bold text-lg mb-4">Product Editor</h2>
        
        {/* Product Selection */}
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-gray-600">Product Type</h3>
          <div className="space-y-2">
            {Object.entries(PRODUCTS).map(([key, product]) => {
              const Icon = product.icon;
              return (
                <button
                  key={key}
                  onClick={() => changeProduct(key as ProductType)}
                  className={`w-full flex items-center gap-3 p-3 border rounded transition-colors ${
                    selectedProduct === key 
                      ? "bg-blue-500 text-white border-blue-600" 
                      : "bg-white hover:bg-gray-50 border-gray-200"
                  }`}
                >
                  <Icon size={20} />
                  <span className="text-sm font-medium">{product.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Product Color */}
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-gray-600">Product Color</h3>
          <div className="flex gap-2">
            {["#ffffff", "#000000", "#ef4444", "#3b82f6", "#10b981", "#f59e0b"].map(color => (
              <button
                key={color}
                onClick={() => setProductColor(color)}
                className={`w-8 h-8 rounded border-2 ${
                  productColor === color ? "border-blue-500 scale-110" : "border-gray-300"
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
          <input
            type="color"
            value={productColor}
            onChange={(e) => setProductColor(e.target.value)}
            className="w-full h-10 border rounded"
          />
        </div>

        {/* Print Area Toggle */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="showPrintArea"
            checked={showPrintArea}
            onChange={(e) => setShowPrintArea(e.target.checked)}
            className="w-4 h-4"
          />
          <label htmlFor="showPrintArea" className="text-sm">Show Print Area</label>
        </div>

        {/* Add Elements */}
        <div className="space-y-2 pt-4 border-t">
          <h3 className="text-sm font-semibold text-gray-600">Add Elements</h3>
          <label className="flex items-center gap-2 p-2 border rounded cursor-pointer hover:bg-gray-50">
            <Image size={20} />
            <span className="text-sm">Upload Image</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>
          
          <button
            onClick={addText}
            className="w-full flex items-center gap-2 p-2 border rounded hover:bg-gray-50"
          >
            <Type size={20} />
            <span className="text-sm">Add Text</span>
          </button>
        </div>

        {/* Text Properties */}
        {isTextSelected && (
          <div className="space-y-3 pt-4 border-t">
            <h3 className="text-sm font-semibold text-gray-600">Text Properties</h3>
            
            <div>
              <label className="text-xs text-gray-600">Font Family</label>
              <select
                value={textProps.fontFamily}
                onChange={(e) => updateTextProperty("fontFamily", e.target.value)}
                className="w-full p-2 border rounded text-sm"
              >
                <option>Arial</option>
                <option>Helvetica</option>
                <option>Times New Roman</option>
                <option>Courier New</option>
                <option>Georgia</option>
                <option>Verdana</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-gray-600">Font Size</label>
              <input
                type="number"
                value={textProps.fontSize}
                onChange={(e) => updateTextProperty("fontSize", parseInt(e.target.value))}
                className="w-full p-2 border rounded text-sm"
                min="8"
                max="200"
              />
            </div>

            <div>
              <label className="text-xs text-gray-600">Color</label>
              <input
                type="color"
                value={textProps.fill}
                onChange={(e) => updateTextProperty("fill", e.target.value)}
                className="w-full h-10 border rounded"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => toggleTextStyle("bold")}
                className={`flex-1 p-2 border rounded ${textProps.fontWeight === "bold" ? "bg-blue-100 border-blue-500" : ""}`}
              >
                <Bold size={16} className="mx-auto" />
              </button>
              <button
                onClick={() => toggleTextStyle("italic")}
                className={`flex-1 p-2 border rounded ${textProps.fontStyle === "italic" ? "bg-blue-100 border-blue-500" : ""}`}
              >
                <Italic size={16} className="mx-auto" />
              </button>
              <button
                onClick={() => toggleTextStyle("underline")}
                className={`flex-1 p-2 border rounded ${textProps.underline ? "bg-blue-100 border-blue-500" : ""}`}
              >
                <Underline size={16} className="mx-auto" />
              </button>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => changeAlignment("left")}
                className={`flex-1 p-2 border rounded ${textProps.textAlign === "left" ? "bg-blue-100 border-blue-500" : ""}`}
              >
                <AlignLeft size={16} className="mx-auto" />
              </button>
              <button
                onClick={() => changeAlignment("center")}
                className={`flex-1 p-2 border rounded ${textProps.textAlign === "center" ? "bg-blue-100 border-blue-500" : ""}`}
              >
                <AlignCenter size={16} className="mx-auto" />
              </button>
              <button
                onClick={() => changeAlignment("right")}
                className={`flex-1 p-2 border rounded ${textProps.textAlign === "right" ? "bg-blue-100 border-blue-500" : ""}`}
              >
                <AlignRight size={16} className="mx-auto" />
              </button>
            </div>
          </div>
        )}

        {/* Object Actions */}
        {selectedObject && (
          <div className="space-y-2 pt-4 border-t">
            <h3 className="text-sm font-semibold text-gray-600">Actions</h3>
            <button
              onClick={duplicateSelected}
              className="w-full flex items-center gap-2 p-2 border rounded hover:bg-gray-50"
            >
              <Copy size={16} />
              <span className="text-sm">Duplicate</span>
            </button>
            <button
              onClick={deleteSelected}
              className="w-full flex items-center gap-2 p-2 border rounded hover:bg-red-50 text-red-600"
            >
              <Trash2 size={16} />
              <span className="text-sm">Delete</span>
            </button>
          </div>
        )}

        {/* Export */}
        <div className="pt-4 border-t">
          <button
            onClick={exportDesign}
            className="w-full flex items-center gap-2 p-3 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            <Download size={20} />
            <span>Export Design</span>
          </button>
        </div>
      </div>

      {/* Canvas Area */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="bg-white shadow-lg rounded-lg p-6">
          <div className="mb-4 text-center">
            <h3 className="font-semibold text-lg">{PRODUCTS[selectedProduct].name}</h3>
            <p className="text-sm text-gray-500">
              Print area: {PRODUCTS[selectedProduct].printArea.width} × {PRODUCTS[selectedProduct].printArea.height}px
            </p>
          </div>
          <canvas ref={htmlCanvasRef} className="border shadow-sm" />
        </div>
      </div>

      {/* Right Panel - Layers */}
      <div className="w-64 bg-white border-l p-4 overflow-y-auto">
        <div className="flex items-center gap-2 mb-4">
          <Layers size={20} />
          <h2 className="font-bold text-lg">Layers</h2>
        </div>
        
        <div className="space-y-1">
          {canvasObjects.slice().reverse().map((obj, index) => {
            const actualIndex = canvasObjects.length - 1 - index;
            const objType = obj.type === "i-text" || obj.type === "text" ? "Text" : "Image";
            const objName = obj.type === "i-text" || obj.type === "text" 
              ? (obj as any).text?.substring(0, 20) || "Text"
              : "Image";
            
            return (
              <div
                key={actualIndex}
                className={`flex items-center gap-2 p-2 border rounded text-sm ${
                  selectedObject === obj ? "bg-blue-50 border-blue-500" : "hover:bg-gray-50"
                }`}
              >
                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => moveLayer(obj, "up")}
                    disabled={actualIndex === canvasObjects.length - 1}
                    className="p-0.5 hover:bg-gray-200 rounded disabled:opacity-30"
                  >
                    <ChevronUp size={12} />
                  </button>
                  <button
                    onClick={() => moveLayer(obj, "down")}
                    disabled={actualIndex === 0}
                    className="p-0.5 hover:bg-gray-200 rounded disabled:opacity-30"
                  >
                    <ChevronDown size={12} />
                  </button>
                </div>
                
                <div
                  className="flex-1 cursor-pointer"
                  onClick={() => {
                    canvasRef.current?.setActiveObject(obj);
                    canvasRef.current?.renderAll();
                  }}
                >
                  <div className="font-medium">{objType}</div>
                  <div className="text-xs text-gray-500 truncate">{objName}</div>
                </div>

                <button
                  onClick={() => toggleVisibility(obj)}
                  className="p-1 hover:bg-gray-200 rounded"
                >
                  {obj.visible ? <Eye size={16} /> : <EyeOff size={16} />}
                </button>

                <button
                  onClick={() => toggleLock(obj)}
                  className="p-1 hover:bg-gray-200 rounded"
                >
                  {obj.selectable ? <Unlock size={16} /> : <Lock size={16} />}
                </button>
              </div>
            );
          })}
          
          {canvasObjects.length === 0 && (
            <div className="text-center text-gray-400 text-sm py-8">
              No layers yet
            </div>
          )}
        </div>
      </div>
    </div>
  );
}