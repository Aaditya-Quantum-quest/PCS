'use client';

import { useRouter } from 'next/navigation';
import React from 'react';

const Hero2 = (props) => {
  const router = useRouter();

  const media = {
    video1: props.video1 || '/video2.mp4',
    video2: props.video2 || '/video3.mp4',
    video3: props.video3 || '/video4.mp4',
    mediaType: props.mediaType || 'video',
  };

  const handleGalleryNavigate = () => {
    router.push('/photo-gallery');
  };

  const handleAllCategoriesNavigate = () => {
    const productType = props.productType || 'default';
    const routes = {
      'mini-gallery': '/gallery-editor',
      'clear-acrylic': '/clear-acrylic-editor',
      'acrylic-clock': '/editor?type=acrylic-clock',
      'acrylic-cutout': '/editor?type=acrylic-cutout',
      'acrylic-keychain': '/keychain-editor',
      'acrylic-nameplate': '/nameplate-editor',
      'collage-acrylic-photo': '/gallery-editor',
    };

    router.push(routes[productType] || `/editor?type=${productType}`);
  };

  const MediaItem = ({ src, className }) => (
    <div className={`rounded-2xl overflow-hidden shadow-xl border-4 border-white ${className}`}>
      {media.mediaType === 'video' ? (
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        >
          <source src={src} type="video/mp4" />
        </video>
      ) : (
        <img src={src} alt="Product" className="w-full h-full object-cover" />
      )}
    </div>
  );

  return (
    <section className="relative bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50 overflow-hidden pt-22 md:py-24 lg:py-18">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
        <div className="absolute top-20 left-10 w-64 h-64 bg-purple-300 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-64 h-64 bg-blue-300 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">

          {/* Left Content */}
          <div className="space-y-8 text-center lg:text-left">

            {/* ✨ Badge */}
            <div className="inline-flex items-center gap-2 px-5 py-2 bg-white rounded-full shadow border border-indigo-100">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-indigo-600"></span>
              </span>
              <span className="text-sm font-medium text-slate-700 tracking-wide">
                Premium Quality Prints
              </span>
            </div>

            {/* 🖋 Title */}
            <h1 className="leading-tight font-serif">

              <span className="block text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium text-slate-900">
                {props.title}
              </span>

              <span className="block mt-3 text-3xl sm:text-4xl md:text-5xl lg:text-6xl 
    font-['Great_Vibes'] italic
    bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600
    bg-clip-text text-transparent">
                {props.subtitle}
              </span>

            </h1>

            {/* 🌿 Description */}
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl mx-auto lg:mx-0">
              {props.tagline}
            </p>

            {/* 🚀 Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">

              <button
                onClick={handleAllCategoriesNavigate}
                className="px-7 py-3 rounded-full font-semibold text-white
    bg-gradient-to-r from-indigo-600 to-purple-600
    hover:from-indigo-700 hover:to-purple-700
    shadow-md hover:shadow-lg
    transition-all duration-300 transform hover:-translate-y-1">
                Start Creating Your Custom Frame
              </button>

              <button
                onClick={handleGalleryNavigate}
                className="px-7 py-3 rounded-full font-semibold
    bg-white text-slate-700 border border-slate-200
    hover:border-indigo-400 hover:text-indigo-600
    shadow-sm hover:shadow-md
    transition-all duration-300 transform hover:-translate-y-1
    flex items-center justify-center gap-2">
                <span>View Gallery</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>

            </div>

            {/* 📊 Stats */}
            <div className="flex flex-wrap gap-8 pt-8 justify-center lg:justify-start">

              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  92%
                </div>
                <div className="text-sm text-slate-500 mt-1 tracking-wide">
                  Optical Clarity
                </div>
              </div>

              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  17x
                </div>
                <div className="text-sm text-slate-500 mt-1 tracking-wide">
                  Impact Resistant
                </div>
              </div>

              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-pink-600 to-orange-500 bg-clip-text text-transparent">
                  UV
                </div>
                <div className="text-sm text-slate-500 mt-1 tracking-wide">
                  Protected
                </div>
              </div>

            </div>

          </div>

          {/* Right - Media Grid */}
          {/* Container Height: Mobile(400px) | Tablet(600px) | Desktop(700px) - Adjust here */}
          <div className="relative h-[400px] md:h-[600px] lg:h-[700px]">

            {/* Top Badge */}
            {/* <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20 bg-linear-to-r from-emerald-500 to-teal-500 text-white px-4 py-2 rounded-full shadow-lg font-semibold text-sm">
              🎨 Premium Acrylic Prints
            </div> */}

            {/* Media Items - Responsive Layout */}
            <div className="relative h-full flex items-center justify-center">

              {/* LEFT VIDEO ITEM */}
              {/* Mobile: 128x160px | Tablet: 192x256px | Desktop: 224x300px */}
              {/* Position: Top-left corner with padding */}
              <MediaItem
                src={media.video1}
                className="absolute top-8 left-4 md:left-8 w-32 h-40 md:w-48 md:h-64 lg:w-56 lg:h-[300px] hover:scale-105 transition-transform duration-300 z-10"
              />

              {/* CENTER VIDEO ITEM (MAIN/LARGEST) */}
              {/* Mobile: 160x208px | Tablet: 224x300px | Desktop: 256x340px */}
              {/* Position: Center of container, highest z-index */}
              <MediaItem
                src={media.video2}
                className="w-40 h-52 md:w-56 md:h-[300px] lg:w-64 lg:h-[340px] hover:scale-105 transition-transform duration-300 z-20"
              />

              {/* RIGHT VIDEO ITEM */}
              {/* Mobile: 128x160px | Tablet: 176x235px | Desktop: 208x280px */}
              {/* Position: Bottom-right corner with padding */}
              <MediaItem
                src={media.video3}
                className="absolute bottom-8 right-4 md:right-8 w-32 h-40 md:w-44 md:h-[235px] lg:w-52 lg:h-[280px] hover:scale-105 transition-transform duration-300 z-10"
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero2;