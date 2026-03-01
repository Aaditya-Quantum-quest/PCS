// FrameEditor.jsx
'use client';

import React, { useState, useRef, useEffect } from "react";
import { Stage, Layer, Image as KonvaImage, Rect } from "react-konva";

const DPI = 150;

const cmToPx = (cm) => (cm / 2.54) * DPI;

export default function FrameEditor() {
    const [photoSrc, setPhotoSrc] = useState(null);
    const [photoImg, setPhotoImg] = useState(null);

    // Size in cm
    const [widthCm, setWidthCm] = useState(30);
    const [heightCm, setHeightCm] = useState(20);

    // Frame thickness in mm
    const [thicknessMm, setThicknessMm] = useState(10);

    // Photo transform
    const [photoScale, setPhotoScale] = useState(1);
    const [photoPos, setPhotoPos] = useState({ x: 0, y: 0 });

    const stageRef = useRef(null);

    // Load image when photoSrc changes
    useEffect(() => {
        if (!photoSrc) return;
        const img = new window.Image();
        img.src = photoSrc;
        img.onload = () => setPhotoImg(img);
    }, [photoSrc]);

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => setPhotoSrc(reader.result);
        reader.readAsDataURL(file);
    };

    const widthPx = cmToPx(widthCm);
    const heightPx = cmToPx(heightCm);
    const borderPx = (thicknessMm / 10) * 8; // tune this mapping

    const exportDesign = () => {
        const uri = stageRef.current.toDataURL({ pixelRatio: 2 });
        // send this `uri` to backend or store in state
        console.log("Design data URL:", uri);
    };

    return (
        <div className="flex gap-6">
            {/* Left: Controls */}
            <div className="w-72 space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Upload Photo</label>
                    <input type="file" accept="image/*" onChange={handleFileChange} />
                </div>

                <div>
                    <label className="block text-sm font-medium">Width (cm)</label>
                    <input
                        type="number"
                        className="border px-2 py-1 w-full"
                        value={widthCm}
                        onChange={(e) => setWidthCm(Number(e.target.value) || 0)}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium">Height (cm)</label>
                    <input
                        type="number"
                        className="border px-2 py-1 w-full"
                        value={heightCm}
                        onChange={(e) => setHeightCm(Number(e.target.value) || 0)}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium">
                        Frame Thickness (mm)
                    </label>
                    <input
                        type="range"
                        min={5}
                        max={50}
                        value={thicknessMm}
                        onChange={(e) => setThicknessMm(Number(e.target.value))}
                    />
                    <div className="text-xs text-gray-500">
                        {thicknessMm} mm (visual only)
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium">Photo Zoom</label>
                    <input
                        type="range"
                        min={0.5}
                        max={2}
                        step={0.05}
                        value={photoScale}
                        onChange={(e) => setPhotoScale(Number(e.target.value))}
                    />
                </div>

                <button
                    onClick={exportDesign}
                    className="mt-2 px-4 py-2 rounded bg-black text-white text-sm"
                >
                    Save Design
                </button>
            </div>

            {/* Right: Canvas */}
            <div className="border rounded shadow p-2 bg-slate-100">
                <Stage
                    ref={stageRef}
                    width={widthPx + borderPx * 2 + 40}
                    height={heightPx + borderPx * 2 + 40}
                >
                    <Layer>
                        {/* Outer background */}
                        <Rect
                            x={0}
                            y={0}
                            width={widthPx + borderPx * 2 + 40}
                            height={heightPx + borderPx * 2 + 40}
                            fill="#e5e7eb"
                        />

                        {/* Frame border */}
                        <Rect
                            x={20}
                            y={20}
                            width={widthPx + borderPx * 2}
                            height={heightPx + borderPx * 2}
                            fill="#000" // frame color
                        />

                        {/* Photo area */}
                        {photoImg && (
                            <KonvaImage
                                image={photoImg}
                                x={20 + borderPx + photoPos.x}
                                y={20 + borderPx + photoPos.y}
                                width={widthPx * photoScale}
                                height={heightPx * photoScale}
                                draggable
                                onDragEnd={(e) =>
                                    setPhotoPos({ x: e.target.x() - 20 - borderPx, y: e.target.y() - 20 - borderPx })
                                }
                                clipFunc={(ctx) => {
                                    // Clip to exact visible area
                                    ctx.beginPath();
                                    ctx.rect(20 + borderPx, 20 + borderPx, widthPx, heightPx);
                                    ctx.closePath();
                                }}
                            />
                        )}

                        {/* Inner visible area outline */}
                        <Rect
                            x={20 + borderPx}
                            y={20 + borderPx}
                            width={widthPx}
                            height={heightPx}
                            stroke="#ffffff"
                            strokeWidth={1}
                        />
                    </Layer>
                </Stage>
            </div>
        </div>
    );
}
