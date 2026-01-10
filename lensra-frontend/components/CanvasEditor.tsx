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
  Unlock
} from "lucide-react";

export default function CanvasEditor() {
  const canvasRef = useRef<fabric.Canvas | null>(null);
  const htmlCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [selectedObject, setSelectedObject] = useState<fabric.Object | null>(null);
  const [canvasObjects, setCanvasObjects] = useState<fabric.Object[]>([]);
  const [textProps, setTextProps] = useState({
    fontSize: 24,
    fontFamily: "Arial",
    fill: "#000000",
    fontWeight: "normal",
    fontStyle: "normal",
    underline: false,
    textAlign: "left"
  });

  useEffect(() => {
    if (!htmlCanvasRef.current) return;

    const canvas = new fabric.Canvas(htmlCanvasRef.current, {
      width: 600,
      height: 600,
      backgroundColor: "#ffffff",
    });

    canvasRef.current = canvas;

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

    return () => {
      canvas.dispose();
    };
  }, []);

  const updateObjectsList = () => {
    if (!canvasRef.current) return;
    setCanvasObjects([...canvasRef.current.getObjects()]);
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
        const maxWidth = 300;
        const maxHeight = 300;
        
        if (img.width! > maxWidth || img.height! > maxHeight) {
          const scale = Math.min(maxWidth / img.width!, maxHeight / img.height!);
          img.scale(scale);
        }
        
        img.set({
          left: 150,
          top: 150,
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

    const text = new fabric.IText("Double click to edit", {
      left: 150,
      top: 150,
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

  const duplicateSelected = () => {
    if (!canvasRef.current || !selectedObject) return;
    
    selectedObject.clone().then((cloned: fabric.Object) => {
      cloned.set({
        left: (cloned.left || 0) + 20,
        top: (cloned.top || 0) + 20,
      });
      canvasRef.current?.add(cloned);
      canvasRef.current?.setActiveObject(cloned);
      canvasRef.current?.renderAll();
    });
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
      (canvasRef.current as any).bringForward(obj);
    } else {
      (canvasRef.current as any).sendBackwards(obj);
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
    
    const dataURL = canvasRef.current.toDataURL({
      format: "png",
      quality: 1,
      multiplier: 2,
    });

    const link = document.createElement("a");
    link.download = "design.png";
    link.href = dataURL;
    link.click();
  };

  const isTextSelected = selectedObject?.type === "i-text" || selectedObject?.type === "text";

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Toolbar */}
      <div className="w-64 bg-white border-r p-4 space-y-4 overflow-y-auto">
        <h2 className="font-bold text-lg mb-4">Tools</h2>
        
        {/* Add Elements */}
        <div className="space-y-2">
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
        <div className="bg-white shadow-lg rounded-lg p-4">
          <canvas ref={htmlCanvasRef} className="border" />
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