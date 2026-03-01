'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { X, Sparkles } from 'lucide-react';

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
    <div className="bg-white px-4 sm:px-6 lg:px-8 py-20" id='Gallery' >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-8 bg-linear-to-r from-amber-100 to-orange-100 px-5 py-2.5 rounded-full border-2 border-amber-300/50 shadow-lg animate-fade-in">
            <Sparkles className="w-5 h-5 text-amber-600 animate-pulse" />
            <span className="text-sm font-bold text-amber-900 tracking-wide">
              Curated Collections
            </span>
          </div>
          <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            MemoryWall{' '}
            <span className="bg-linear-to-r from-amber-600 via-orange-500 to-rose-500 bg-clip-text text-transparent">
              Gallery
            </span>
          </h1>
          <p className="text-xl lg:text-2xl text-gray-600 font-medium max-w-3xl mx-auto leading-relaxed">
            Hang Your Happiness
          </p>
          {errorMsg && (
            <p className="mt-3 text-sm text-red-500">{errorMsg}</p>
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
