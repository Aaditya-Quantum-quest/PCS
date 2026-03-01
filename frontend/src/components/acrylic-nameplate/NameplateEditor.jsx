'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Type, X, Trash2, Move } from 'lucide-react';

export default function NameplateEditor() {
  const [backgroundImage, setBackgroundImage] = useState('');
  const [texts, setTexts] = useState([]);
  const [selectedTextId, setSelectedTextId] = useState(null);
  const [showTextInput, setShowTextInput] = useState(false);
  const [newTextValue, setNewTextValue] = useState('');
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const savedImage = localStorage.getItem('nameplateBackground');
    console.log('🔍 localStorage value:', savedImage); // Debug log

    if (savedImage && savedImage.trim() !== '') {
      setBackgroundImage(savedImage);
    } else {
      // Only set default if truly empty
      const defaultImage = 'https://images.unsplash.com/photo-1611095790749-9eeb5a0f8f4a?w=800&h=600&fit=crop';
      setBackgroundImage(defaultImage);
      localStorage.setItem('nameplateBackground', defaultImage);
    }
  }, []);

  // Add new text
  const handleAddText = () => {
    if (newTextValue.trim() && texts.length < 3) {
      const newText = {
        id: Date.now(),
        content: newTextValue,
        x: 50,
        y: 50 + (texts.length * 60),
        fontSize: 32,
        color: '#FFD700',
        fontFamily: 'Arial',
        isDragging: false
      };
      setTexts([...texts, newText]);
      setNewTextValue('');
      setShowTextInput(false);
      setSelectedTextId(newText.id);
    }
  };

  // Delete text
  const handleDeleteText = (id) => {
    setTexts(texts.filter(text => text.id !== id));
    if (selectedTextId === id) setSelectedTextId(null);
  };

  // Update text properties
  const updateText = (id, updates) => {
    setTexts(texts.map(text =>
      text.id === id ? { ...text, ...updates } : text
    ));
  };

  // Handle mouse down on text
  const handleMouseDown = (e, textId) => {
    e.preventDefault();
    const rect = containerRef.current.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;

    const text = texts.find(t => t.id === textId);
    const textOffsetX = offsetX - text.x;
    const textOffsetY = offsetY - text.y;

    updateText(textId, { isDragging: true, dragOffsetX: textOffsetX, dragOffsetY: textOffsetY });
    setSelectedTextId(textId);
  };

  // Handle mouse move
  const handleMouseMove = (e) => {
    const draggingText = texts.find(t => t.isDragging);
    if (!draggingText) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - draggingText.dragOffsetX;
    const y = e.clientY - rect.top - draggingText.dragOffsetY;

    updateText(draggingText.id, {
      x: Math.max(0, Math.min(x, rect.width - 100)),
      y: Math.max(0, Math.min(y, rect.height - 50))
    });
  };

  // Handle mouse up
  const handleMouseUp = () => {
    setTexts(texts.map(text => ({ ...text, isDragging: false })));
  };

  // Save design
  const handleSave = () => {
    alert('Design saved! You can now select size and proceed to checkout.');
    // Here you would typically save to backend or localStorage
    localStorage.setItem('nameplateDesign', JSON.stringify({ backgroundImage, texts }));
  };

  const selectedText = texts.find(t => t.id === selectedTextId);

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      {/* Header */}
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-md mb-4 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-black px-3 py-1.5 rounded-md">
              <span className="text-white font-bold text-lg">OMGS</span>
              <span className="text-red-500 text-xl ml-1">®</span>
            </div>
            <span className="text-xl font-bold text-gray-800">Editor</span>
          </div>
          <button
            onClick={() => window.history.back()}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-gray-700" />
          </button>
        </div>
        <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
          <span>Home</span>
          <span>/</span>
          <span>Acrylic Name Plate</span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Toolbar */}
        <div className="lg:col-span-1 bg-white rounded-lg shadow-md p-4 h-fit">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Tools</h3>

          {/* Add Text Button */}
          <button
            onClick={() => setShowTextInput(true)}
            disabled={texts.length >= 3}
            className={`w-full flex items-center gap-2 px-4 py-3 rounded-lg mb-4 transition-colors ${texts.length >= 3
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-gray-800 text-white hover:bg-gray-700'
              }`}
          >
            <Type className="w-5 h-5" />
            <span>Add Text ({texts.length}/3)</span>
          </button>

          {/* Text Input Dialog */}
          {showTextInput && (
            <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
              <input
                type="text"
                value={newTextValue}
                onChange={(e) => setNewTextValue(e.target.value)}
                placeholder="Enter text..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
              <div className="flex gap-2">
                <button
                  onClick={handleAddText}
                  className="flex-1 px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Add
                </button>
                <button
                  onClick={() => {
                    setShowTextInput(false);
                    setNewTextValue('');
                  }}
                  className="flex-1 px-3 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Text List */}
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-gray-600 mb-2">Text Layers</h4>
            {texts.map((text) => (
              <div
                key={text.id}
                className={`flex items-center justify-between p-2 rounded-md cursor-pointer ${selectedTextId === text.id ? 'bg-blue-100 border border-blue-300' : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                onClick={() => setSelectedTextId(text.id)}
              >
                <span className="text-sm truncate flex-1">{text.content}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteText(text.id);
                  }}
                  className="p-1 hover:bg-red-100 rounded"
                >
                  <Trash2 className="w-4 h-4 text-red-600" />
                </button>
              </div>
            ))}
          </div>

          {/* Text Properties */}
          {selectedText && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <h4 className="text-sm font-semibold text-gray-600 mb-3">Text Properties</h4>

              <div className="space-y-3">
                <div>
                  <label className="text-xs text-gray-600 block mb-1">Font Size</label>
                  <input
                    type="range"
                    min="16"
                    max="72"
                    value={selectedText.fontSize}
                    onChange={(e) => updateText(selectedText.id, { fontSize: parseInt(e.target.value) })}
                    className="w-full"
                  />
                  <span className="text-xs text-gray-500">{selectedText.fontSize}px</span>
                </div>

                <div>
                  <label className="text-xs text-gray-600 block mb-1">Color</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={selectedText.color}
                      onChange={(e) => updateText(selectedText.id, { color: e.target.value })}
                      className="w-12 h-8 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={selectedText.color}
                      onChange={(e) => updateText(selectedText.id, { color: e.target.value })}
                      className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-gray-600 block mb-1">Font Family</label>
                  <select
                    value={selectedText.fontFamily}
                    onChange={(e) => updateText(selectedText.id, { fontFamily: e.target.value })}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                  >
                    <option value="Arial">Arial</option>
                    <option value="Georgia">Georgia</option>
                    <option value="Times New Roman">Times New Roman</option>
                    <option value="Courier New">Courier New</option>
                    <option value="Verdana">Verdana</option>
                    <option value="Comic Sans MS">Comic Sans MS</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Canvas Area */}
        <div className="lg:col-span-3 bg-white rounded-lg shadow-md p-4">
          <div
            ref={containerRef}
            className="relative w-full bg-gray-200 rounded-lg overflow-hidden"
            style={{ aspectRatio: '4/3', maxHeight: '600px' }}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            
            {backgroundImage ? (
              <img
                src={backgroundImage}
                alt="Nameplate Background"
                className="w-full h-full object-cover"
                onLoad={() => console.log('✅ Background image loaded:', backgroundImage)}
                onError={(e) => {
                  console.error('❌ Failed to load image:', backgroundImage);
                  setBackgroundImage(null);
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-300">
                <div className="text-center text-gray-600">
                  <Type className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-semibold">No background image selected</p>
                  <p className="text-sm mt-2">Please select a product from the showcase</p>
                </div>
              </div>
            )}

            {/* Text Overlays */}
            {texts.map((text) => (
              <div
                key={text.id}
                className={`absolute cursor-move select-none ${selectedTextId === text.id ? 'ring-2 ring-blue-500 ring-offset-2' : ''
                  }`}
                style={{
                  left: `${text.x}px`,
                  top: `${text.y}px`,
                  fontSize: `${text.fontSize}px`,
                  color: text.color,
                  fontFamily: text.fontFamily,
                  fontWeight: 'bold',
                  textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                  whiteSpace: 'nowrap'
                }}
                onMouseDown={(e) => handleMouseDown(e, text.id)}
              >
                {text.content}
                {selectedTextId === text.id && (
                  <Move className="absolute -top-6 -left-6 w-4 h-4 text-blue-500" />
                )}
              </div>
            ))}

            {/* Helper Text */}
            {texts.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white">
                  <Type className="w-12 h-12 mx-auto mb-2" />
                  <p className="text-lg font-semibold">Click "Add Text" to start customizing</p>
                </div>
              </div>
            )}
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            className="w-full mt-4 bg-red-600 text-white font-semibold py-4 rounded-lg hover:bg-red-700 transition-colors text-lg flex items-center justify-center gap-2"
          >
            Save & Select Size
            <span className="text-2xl">›</span>
          </button>
        </div>
      </div>
    </div>
  );
}