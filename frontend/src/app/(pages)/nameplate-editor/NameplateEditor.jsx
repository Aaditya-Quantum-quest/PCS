

'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Type, X, Trash2, Move } from 'lucide-react';
import { domToPng } from 'modern-screenshot'; // ✅ Add this line
import Sidebar from '@/components/section/Sidebar';

export default function NameplateEditor() {
    const [backgroundImage, setBackgroundImage] = useState(null);
    const [texts, setTexts] = useState([]);
    const [selectedTextId, setSelectedTextId] = useState(null);
    const [showTextInput, setShowTextInput] = useState(false);
    const [newTextValue, setNewTextValue] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const canvasRef = useRef(null);
    const containerRef = useRef(null);


    const handleAddText = useCallback(() => {
        if (newTextValue.trim() && texts.length < 10) {
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
    }, [newTextValue, texts]);


    const handleDeleteText = useCallback((id) => {
        setTexts(texts.filter(text => text.id !== id));
        if (selectedTextId === id) setSelectedTextId(null);
    }, [texts, selectedTextId]);


    const updateText = useCallback((id, updates) => {
        setTexts(texts.map(text =>
            text.id === id ? { ...text, ...updates } : text
        ));
    }, [texts]);


    const handleMouseDown = useCallback((e, textId) => {
        e.preventDefault();
        const rect = containerRef.current.getBoundingClientRect();
        const offsetX = e.clientX - rect.left;
        const offsetY = e.clientY - rect.top;

        const text = texts.find(t => t.id === textId);
        const textOffsetX = offsetX - text.x;
        const textOffsetY = offsetY - text.y;


        updateText(textId, { isDragging: true, dragOffsetX: textOffsetX, dragOffsetY: textOffsetY });
        setSelectedTextId(textId);
    }, [texts, updateText]);


    const handleMouseMove = useCallback((e) => {
        const draggingText = texts.find(t => t.isDragging);
        if (!draggingText) return;


        const rect = containerRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left - draggingText.dragOffsetX;
        const y = e.clientY - rect.top - draggingText.dragOffsetY;


        updateText(draggingText.id, {
            x: Math.max(0, Math.min(x, rect.width - 100)),
            y: Math.max(0, Math.min(y, rect.height - 50))
        });
    }, [texts, updateText]);


    const handleMouseUp = useCallback(() => {
        setTexts(texts.map(text => ({ ...text, isDragging: false })));
    }, [texts]);



    const handleSave = useCallback(async () => {
        try {
            // Show loading state
            const saveButton = document.querySelector('.save-button');
            if (saveButton) {
                saveButton.innerHTML = '<span class="animate-pulse">Saving...</span>';
                saveButton.disabled = true;
            }

            // ✅ Temporarily deselect all text to remove blue outline
            const previousSelectedId = selectedTextId;
            setSelectedTextId(null);

            // Wait for React to re-render without the selection
            await new Promise(resolve => setTimeout(resolve, 100));

            // Capture the container as PNG
            const element = containerRef.current;
            const dataUrl = await domToPng(element, {
                quality: 1,        // Maximum quality
                scale: 2,          // 2x resolution for sharp image
                backgroundColor: '#1f2937', // Gray background (matches your design)
                style: {
                    // Ensure consistent rendering
                    transform: 'scale(1)',
                }
            });

            // ✅ Restore the selection after capture
            setSelectedTextId(previousSelectedId);

            // Save to localStorage
            localStorage.setItem('customizedNameplate', dataUrl);
            localStorage.setItem('nameplateDesign', JSON.stringify({
                backgroundImage,
                texts,
                timestamp: new Date().toISOString()
            }));

            console.log('✅ Design saved successfully!');

            // Navigate to checkout page
            window.location.href = '/nameplate-checkout';
            // Or if using Next.js App Router:
            // router.push('/checkout');

        } catch (error) {
            console.error('❌ Error saving design:', error);
            alert('Failed to save design. Please try again.');

            // Reset button state
            const saveButton = document.querySelector('.save-button');
            if (saveButton) {
                saveButton.innerHTML = 'Save & Select Size <span class="text-2xl">›</span>';
                saveButton.disabled = false;
            }
        }
    }, [backgroundImage, texts, selectedTextId]);



    // ✅ FIXED: Load background image properly with separate state updates
    useEffect(() => {
        console.log('🔍 Checking localStorage...');
        const savedImage = localStorage.getItem('nameplateBackground');
        console.log('💾 Raw localStorage:', savedImage);

        if (savedImage && savedImage.trim() !== '') {
            console.log('✅ Valid image found, setting background');
            setBackgroundImage(savedImage);
            // Small delay to ensure state update processes
            setTimeout(() => setIsLoading(false), 100);
        } else {
            console.log('❌ No valid image, using default');
            const defaultImage = 'https://images.unsplash.com/photo-1611095790749-9eeb5a0f8f4a?w=800&h=600&fit=crop';
            setBackgroundImage(defaultImage);
            setTimeout(() => setIsLoading(false), 100);
        }
    }, []);


    // ✅ ADDED: Ensure loading state resets when image changes
    useEffect(() => {
        if (backgroundImage) {
            console.log('🖼️ Background image set:', backgroundImage);
        }
    }, [backgroundImage]);


    const selectedText = texts.find(t => t.id === selectedTextId);


    const handleTouchStart = useCallback((e, textId) => {
        e.preventDefault();
        const touch = e.touches[0];
        const rect = containerRef.current.getBoundingClientRect();
        const offsetX = touch.clientX - rect.left;
        const offsetY = touch.clientY - rect.top;

        const text = texts.find(t => t.id === textId);
        const textOffsetX = offsetX - text.x;
        const textOffsetY = offsetY - text.y;

        updateText(textId, { isDragging: true, dragOffsetX: textOffsetX, dragOffsetY: textOffsetY });
        setSelectedTextId(textId);
    }, [texts, updateText]);

    const handleTouchMove = useCallback((e) => {
        const draggingText = texts.find(t => t.isDragging);
        if (!draggingText) return;

        e.preventDefault();
        const touch = e.touches[0];
        const rect = containerRef.current.getBoundingClientRect();
        const x = touch.clientX - rect.left - draggingText.dragOffsetX;
        const y = touch.clientY - rect.top - draggingText.dragOffsetY;

        updateText(draggingText.id, {
            x: Math.max(0, Math.min(x, rect.width - 100)),
            y: Math.max(0, Math.min(y, rect.height - 50))
        });
    }, [texts, updateText]);

    const handleTouchEnd = useCallback(() => {
        setTexts(texts.map(text => ({ ...text, isDragging: false })));
    }, [texts]);



    return (
        <div className="min-h-screen bg-gray-100 p-4 pt-25">
            <Sidebar />
            {/* Header */}
            <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-md mb-4 p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="bg-black px-3 py-1.5 rounded-md">
                            <span className="text-white font-bold text-lg">PCS</span>
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

                    <button
                        onClick={() => setShowTextInput(true)}
                        disabled={texts.length >= 10}
                        className={`w-full flex items-center gap-2 px-4 py-3 rounded-lg mb-4 transition-colors ${texts.length >= 10
                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            : 'bg-gray-800 text-white hover:bg-gray-700'
                            }`}
                    >
                        <Type className="w-5 h-5" />
                        <span>Add Text ({texts.length}/10)</span>
                    </button>


                    {showTextInput && (
                        <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                            <input
                                type="text"
                                value={newTextValue}
                                onChange={(e) => setNewTextValue(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        handleAddText();
                                    } else if (e.key === 'Escape') {
                                        setShowTextInput(false);
                                        setNewTextValue('');
                                    }
                                }}
                                placeholder="Enter text..."
                                className="w-full px-3 py-2 border text-black border-gray-300 rounded-md mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                autoFocus
                            />
                            <div className="flex gap-2">
                                <button
                                    onClick={handleAddText}
                                    className="flex-1 px-3 py-2 cursor-pointer bg-green-600 text-white rounded-md hover:bg-green-700"
                                >
                                    Add
                                </button>
                                <button
                                    onClick={() => {
                                        setShowTextInput(false);
                                        setNewTextValue('');
                                    }}
                                    className="flex-1 px-3 py-2 cursor-pointer bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}


                    <div className="space-y-2">
                        <h4 className="text-sm font-semibold text-gray-600 mb-2">Text Layers</h4>
                        {texts.map((text) => (
                            <div
                                key={text.id}
                                className={`flex items-center justify-between p-2 rounded-md cursor-pointer ${selectedTextId === text.id ? 'bg-blue-100 border border-blue-300' : 'bg-gray-50 hover:bg-gray-100'
                                    }`}
                                onClick={() => setSelectedTextId(text.id)}
                            >
                                <span className="text-sm text-black truncate flex-1">{text.content}</span>
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


                    {selectedText && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                            <h4 className="text-sm font-semibold text-gray-600 mb-3">Text Properties</h4>
                            <div className="space-y-3">
                                <div>
                                    <label className="text-sm text-gray-600 block mb-1">Text Size</label>
                                    <input
                                        type="range"
                                        min="16"
                                        max="200"
                                        value={selectedText.fontSize}
                                        onChange={(e) => updateText(selectedText.id, { fontSize: parseInt(e.target.value) })}
                                        className="w-full"
                                    />
                                    <span className="text-xs text-gray-500">{selectedText.fontSize}px</span>
                                </div>
                                <div>
                                    <label className="text-sm text-gray-600 block mb-1">Color</label>
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
                                            className="flex-1 px-2 py-1 border text-black border-gray-300 rounded text-sm "
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-sm text-gray-600 block mb-1">Font Family</label>
                                    <select
                                        value={selectedText.fontFamily}
                                        onChange={(e) => updateText(selectedText.id, { fontFamily: e.target.value })}
                                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm text-black cursor-pointer"
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


                <div className="lg:col-span-3 bg-white rounded-lg shadow-md p-4 flex flex-col items-center justify-center">
                    <div
                        ref={containerRef}
                        className="relative bg-gray-200 rounded-lg overflow-hidden 
                   w-full max-w-[500px] h-[350px]
                   sm:max-w-[550px] sm:h-[380px]
                   md:max-w-[600px] md:h-[420px]
                   lg:max-w-[650px] lg:h-[450px]
                   xl:max-w-[700px] xl:h-[480px]"
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                        onMouseLeave={handleMouseUp}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                    >
                        {isLoading ? (
                            <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-gray-200 to-gray-300">
                                <div className="text-center">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
                                    <p className="text-lg font-semibold text-gray-700">Loading design...</p>
                                </div>
                            </div>
                        ) : backgroundImage ? (
                            <>
                                <img
                                    src={backgroundImage}
                                    alt="Nameplate Background"
                                    className="w-full h-full object-contain"
                                    onLoad={() => console.log('✅ Image loaded successfully:', backgroundImage)}
                                    onError={(e) => {
                                        console.error('❌ Image failed to load:', backgroundImage);
                                        setBackgroundImage(null);
                                    }}
                                />

                                {/* Overlay for texts */}
                                {texts.map((text) => (
                                    <div
                                        key={text.id}
                                        className={`absolute cursor-move select-none touch-none ${selectedTextId === text.id ? 'ring-2 ring-blue-500' : ''
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
                                        onTouchStart={(e) => handleTouchStart(e, text.id)}
                                    >
                                        {text.content}
                                        {selectedTextId === text.id && (
                                            <Move className="absolute -top-6 -left-6 w-4 h-4 text-blue-500" />
                                        )}
                                    </div>
                                ))}


                                {texts.length === 0 && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-opacity-30 pointer-events-none">
                                        <div className="text-center text-white">
                                            <Type className="w-12 h-12 mx-auto mb-2" />
                                            <p className="text-sm font-semibold">Click "Add Text" to start customizing</p>
                                        </div>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-orange-50 to-yellow-50">
                                <div className="text-center text-gray-700 p-8 max-w-md">
                                    <Type className="w-20 h-20 mx-auto mb-6 text-orange-500 opacity-70" />
                                    <h3 className="text-2xl font-bold mb-4">Ready to Customize</h3>
                                    <p className="text-lg mb-6">Select a nameplate design from the showcase to get started</p>
                                    <button
                                        onClick={() => window.location.href = '/products/acrylic-nameplate'}
                                        className="bg-orange-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-orange-700 transition-all transform hover:scale-105"
                                    >
                                        Choose Design
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    <button
                        onClick={handleSave}
                        className="save-button w-full max-w-[700px] mt-4 mx-auto bg-red-600 text-white font-semibold py-4 rounded-lg hover:bg-red-700 transition-colors text-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Save & Select Size
                        <span className="text-2xl">›</span>
                    </button>


                </div>


            </div>
        </div>
    );
}
