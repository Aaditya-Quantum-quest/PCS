'use client'

import React, { useState, useEffect } from 'react';
import { ArrowRight, Sparkles, Frame, Upload } from 'lucide-react';
import Link from 'next/link';

export default function Hero() {
  const [activeGrid, setActiveGrid] = useState(0);

  // Simulate grid animation
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveGrid((prev) => (prev + 1) % 9);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const gridHeroVideos = [
    {
      id: 1,
      link: "acrylic-photo.mp4",
      linkToPage: '/products/acrylic-photo'
    },
    {
      id: 2,
      link: "clear-acrylic-photo.mp4",
      linkToPage: '/products/clear-acrylic-photo'
    },
    {
      id: 3,
      link: "acrylic-wall-clock.mp4",
      linkToPage: '/products/acrylic-wall-clock'
    },
    {
      id: 4,
      link: "framed-acrylic-photo.mp4",
      linkToPage: '/products/framed-acrylic-photo'
    },
    {
      id: 5,
      link: "collage-acrylic-photo.mp4",
      linkToPage: '/products/collage-acrylic-photo'
    },
    {
      id: 6,
      link: "acrylic-fridge-magnet.mp4",
      linkToPage: '/products/acrylic-fridge-magnets'
    },
    {
      id: 7,
      link: "acrylic-cutout.mp4",
      linkToPage: '/products/acrylic-cutout'
    },
    {
      id: 8,
      link: "acrylic-desk-photo.mp4",
      linkToPage: '/products/acrylic-desk-photo'
    },
    {
      id: 9,
      link: "acrylic-keychains.mp4",
      linkToPage: '/products/acrylic-keychains'
    },
  ];

  return (
    <div className="bg-linear-to-br from-gray-50 via-white to-amber-50/30 relative overflow-hidden py-12 lg:py-0 ">
      {/* Enhanced Decorative Background Elements with Animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-amber-300/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 -left-40 w-96 h-96 bg-orange-300/20 rounded-full blur-3xl animate-pulse delay-700"></div>
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-yellow-300/20 rounded-full blur-3xl animate-pulse delay-1000"></div>

        {/* Additional Subtle linear Overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-white/50 via-transparent to-transparent"></div>
      </div>

      <div className="container mx-auto px-6 lg:px-16 py-12 lg:py-24 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">

          {/* Left Side - Enhanced Video Grid */}
          <div className="relative order-2 lg:order-1 group">
            <div className="relative">
              {/* Grid Layout with Enhanced Styling */}
              <div className="grid grid-cols-3 gap-4 lg:gap-5">
                {gridHeroVideos.map((video, index) => (
                  <Link href={video.linkToPage} key={index}>
                    <div

                      className={`aspect-square rounded-3xl overflow-hidden shadow-xl transform transition-all duration-700 ease-out ${activeGrid === index
                          ? 'scale-110 ring-4 ring-amber-400 shadow-2xl shadow-amber-500/60 z-10'
                          : 'scale-100 hover:scale-105 hover:shadow-2xl hover:ring-2 hover:ring-amber-300'
                        }`}
                    >
                      <video
                        src={`/${video.link}`}
                        autoPlay
                        muted
                        loop
                        className="w-full h-full object-cover"
                      >
                        <source type='video/mp4' />
                      </video>
                    </div>

                  </Link>
                ))}
              </div>

              {/* Enhanced Yellow Accent Squares with linear */}
              <div className="absolute -bottom-8 -left-8 w-28 h-28 bg-linear-to-br from-amber-400 via-yellow-500 to-orange-400 rounded-3xl shadow-2xl transform -rotate-12 -z-10 opacity-90 group-hover:scale-110 transition-transform duration-500"></div>
              <div className="absolute -top-8 -right-8 w-20 h-20 bg-linear-to-br from-orange-400 via-amber-500 to-yellow-400 rounded-2xl shadow-xl transform rotate-12 -z-10 opacity-90 group-hover:scale-110 transition-transform duration-500"></div>

              {/* Additional Decorative Elements */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-linear-to-tr from-amber-200/10 via-transparent to-orange-200/10 rounded-full blur-2xl -z-20"></div>
            </div>
          </div>

          {/* Right Side - Enhanced Content */}
          <div className="space-y-10 order-1 lg:order-2 animate-fade-in">

            {/* Enhanced Badge with Subtle Animation */}
            <div className="inline-flex items-center gap-2.5 bg-linear-to-r from-amber-100 via-orange-50 to-amber-100 px-5 py-2.5 rounded-full border-2 border-amber-300/50 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 backdrop-blur-sm">
              <Sparkles className="w-5 h-5 text-amber-600 animate-pulse" />
              <span className="text-sm font-bold text-amber-900 tracking-wide">Premium Acrylic Photos</span>
            </div>

            {/* Enhanced Main Heading with Text Shadow */}
            <div className="space-y-5">
              <h1 className="md:text-6xl text-6xl font-black leading-[1.1] tracking-tight">
                <span className="bg-linear-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent drop-shadow-sm">
                  Crystal-Clear
                </span>
                <br />
                <span className="bg-linear-to-r from-amber-600 via-orange-500 to-amber-600 bg-clip-text text-transparent animate-linear drop-shadow-lg">
                  Acrylic Prints
                </span>
              </h1>
            </div>

            {/* Enhanced Tagline */}
            <div className="text-2xl lg:text-3xl text-gray-700 leading-relaxed font-semibold max-w-xl">
              Where your memories get a <span className="text-transparent bg-linear-to-r from-amber-600 to-orange-500 bg-clip-text font-bold">glossy, modern upgrade</span>.
            </div>

            {/* Enhanced Description with Better Typography */}
            <div className="space-y-5 max-w-xl hidden lg:block">
              <p className="text-lg lg:text-xl text-gray-800 leading-relaxed font-medium">
                Unmatched clarity and vibrant colors turn every photo into stunning acrylic art. Our ultra-HD acrylic prints add modern elegance to your walls, making every moment shine with impeccable depth and brilliance.
              </p>
              <p className="text-base text-gray-600 leading-relaxed">
                Transform ordinary snapshots into extraordinary centerpieces with frameless designs and crystal-clear surface.
              </p>
            </div>


            {/* Enhanced Features Section with Better Visual Hierarchy */}
            <div className="grid grid-cols-3 gap-8 md:pt-10 border-t border-gray-200/50">
              {[
                { label: 'Acrylic Perfection', value: 'Ultra-HD' },
                { label: 'Modern Frameless Style', value: '100% Sleek' },
                { label: 'Happy Customers', value: '10K+' }
              ].map((feature, index) => (
                <div
                  key={index}
                  className="space-y-2 text-center lg:text-left hover:scale-105 transition-transform duration-300"
                >
                  <p className="text-3xl font-black bg-linear-to-r from-amber-600 text-center via-orange-500 to-amber-600 bg-clip-text text-transparent drop-shadow-sm">
                    {feature.value}
                  </p>
                  <p className="text-xs lg:text-sm text-gray-600 font-medium text-center tracking-wide uppercase">
                    {feature.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
        
        .delay-700 {
          animation-delay: 700ms;
        }
        
        .delay-1000 {
          animation-delay: 1000ms;
        }
        
        @keyframes linear {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        
        .animate-linear {
          background-size: 200% auto;
          animation: linear 3s ease infinite;
        }
      `}</style>
    </div>
  );
}
