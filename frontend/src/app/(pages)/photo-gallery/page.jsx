'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { X, Sparkles } from 'lucide-react';
import Sidebar from "@/components/section/Sidebar"

const WeddingGallery = () => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [images, setImages] = useState([]);
    const [errorMsg, setErrorMsg] = useState('');

    // Load images from backend
    useEffect(() => {
        axios
            .get('http://localhost:4000/api/gallery')
            .then((res) => {
                // expecting [{ _id, title, imageUrl }]
                const mapped = res.data.map((img, idx) => ({
                    id: img._id || idx,
                    src: img.imageUrl,
                    alt: img.title || 'Gallery image',
                }));
                setImages(mapped);
            })
            .catch((err) => {
                const msg =
                    err.response?.data?.message ||
                    err.message ||
                    'Failed to load gallery images';
                setErrorMsg(msg);
            });
    }, []);

    const openLightbox = (image) => {
        setSelectedImage(image);
        document.body.style.overflow = 'hidden';
    };

    const closeLightbox = () => {
        setSelectedImage(null);
        document.body.style.overflow = 'unset';
    };

    return (
        <div className="bg-white px-4 sm:px-6 lg:px-8 md:py-32 py-28" id='Gallery' >
            <Sidebar />
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16">

                    {/* ✨ Badge */}
                    <div className="inline-flex items-center gap-2 mb-10 
  bg-gradient-to-r from-[#fff3e6] to-[#ffe8d6] 
  px-6 py-2.5 rounded-full 
  border border-[#ffd2b3] 
  shadow-md">

                        <Sparkles className="w-4 h-4 text-[#ff8c42] animate-pulse" />

                        <span className="text-xs md:text-sm font-semibold tracking-[0.2em] uppercase
    text-[#c05621] font-serif">
                            Curated Collections
                        </span>
                    </div>

                    {/* 🖋 Elegant Heading */}
                    <h1 className="text-center leading-tight mb-6
  text-[clamp(3rem,8vw,5rem)]
  font-serif tracking-[-1px]">

                        <span className="text-[#2a1f1a] font-medium">
                            MemoryWall{" "}
                        </span>

                        <span className="font-['Great_Vibes'] italic
    bg-gradient-to-r from-[#ff6b1a] via-[#ff8c00] to-[#ffaa00]
    bg-clip-text text-transparent
    drop-shadow-[0_5px_15px_rgba(255,120,40,0.25)]">
                            Gallery
                        </span>

                    </h1>

                    {/* 🌿 Subtitle */}
                    <p className="text-[1.2rem] md:text-[1.4rem]
  text-[#6b5b53] italic
  font-light tracking-wide
  max-w-2xl mx-auto leading-relaxed">

                        Hang Your
                        <span className="text-[#ff6b1a] font-semibold"> Happiness</span>
                    </p>

                    {/* Error */}
                    {errorMsg && (
                        <p className="mt-4 text-sm text-red-500 font-medium">
                            {errorMsg}
                        </p>
                    )}

                </div>

                {/* Gallery Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                    {images.map((image) => (
                        <div
                            key={image.id}
                            className="relative group cursor-pointer overflow-hidden rounded-tl-4xl rounded-tr-4xl rounded-br-4xl shadow-lg transition-transform duration-300 hover:scale-105"
                            onClick={() => openLightbox(image)}
                        >
                            <div className="aspect-square">
                                <img
                                    src={image.src}
                                    alt={image.alt}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                                <span className="text-white text-lg font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    View Image
                                </span>
                            </div>
                        </div>
                    ))}
                    {images.length === 0 && !errorMsg && (
                        <p className="text-center text-gray-500 col-span-full">
                            No images in gallery yet.
                        </p>
                    )}
                </div>
            </div>

            {/* Lightbox Modal */}
            {selectedImage && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 p-4"
                    onClick={closeLightbox}
                >
                    <div className="relative max-w-7xl max-h-full">
                        <button
                            onClick={closeLightbox}
                            className="absolute -top-12 right-0 sm:-right-12 sm:top-0 text-white hover:text-gray-300 transition-colors duration-200 z-10"
                            aria-label="Close"
                        >
                            <X size={40} className="drop-shadow-lg" />
                        </button>

                        <div
                            className="relative"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <img
                                src={selectedImage.src}
                                alt={selectedImage.alt}
                                className="max-w-full max-h-[85vh] w-auto h-auto object-contain rounded-lg shadow-2xl"
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WeddingGallery;
