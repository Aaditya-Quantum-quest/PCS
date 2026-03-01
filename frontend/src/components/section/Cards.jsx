'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Cards() {
  const [uploadedImages, setUploadedImages] = useState({});

  const products = [
    {
      id: 1,
      title: "Landscape Acrylic Wall Photo",
      image: "/frame-1.webp",
      orientation: "landscape",
      haveFrame: false,
      numberOfImages: 2, // ✅ Fixed: was numberOfIMages
      
    },
    {
      id: 2,
      title: "Portrait Canvas Print",
      image: "/frame-2.webp",
      orientation: "portrait",
      haveFrame: true,
      numberOfImages: 2, // ✅ Fixed: was numberOfIMages
      frameType: "oval"
    },
    {
      id: 3,
      title: "Square Acrylic Photo",
      image: "/frame-1.webp",
      orientation: "square",
      haveFrame: false,
      numberOfImages: 1, // ✅ Fixed: was numberOfIMages
    },
    {
      id: 4,
      title: "Modern Wall Art",
      image: "/frame-2.webp",
      orientation: "landscape",
      haveFrame: true,
      numberOfImages: 1, // ✅ Fixed: was numberOfIMages
      frameType: "hexagon"
    },
    {
      id: 5,
      title: "Premium Photo Print",
      image: "/frame-1.webp",
      orientation: "portrait",
      haveFrame: false,
      numberOfImages: 1 // ✅ Fixed: was numberOfIMages
    },
    {
      id: 6,
      title: "Nature Canvas Art",
      image: "/frame-2.webp",
      orientation: "landscape",
      haveFrame: true,
      numberOfImages: 1, // ✅ Fixed: was numberOfIMages
      frameType: "normal"
    }
  ];

  const handleFileUpload = (productId, event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImages(prev => ({
          ...prev,
          [productId]: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const router = useRouter();

  const handleNavigation = (item) => {
    const params = new URLSearchParams({
      id:item.id,
      img: item.image,
      title: item.title,
      orientation: item.orientation,
      haveFrame: item.haveFrame.toString(),
      frameType: item.frameType || 'normal',
      numberOfImages: item.numberOfImages.toString() // ✅ Fixed: was numberOfIMages
    });

    router.push(`/all-frames/acrylic-photo/editor/${item.id}?${params.toString()}`);
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-gray-50 to-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            <span className="bg-linear-to-r from-slate-900 via-red-700 to-slate-900 bg-clip-text text-transparent">
              Custom Photo Prints
            </span>
          </h1>
          <p className="text-slate-600 text-lg">
            Upload your favorite memories and create stunning wall art
          </p>
        </div>

        {/* Grid of Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden transform hover:-translate-y-2 animate-fade-in-up"
              style={{ animationDelay: `${product.id * 100}ms` }}
            >
              {/* Image Container */}
              <div className="relative aspect-4/3 bg-linear-to-br from-gray-100 to-gray-200 overflow-hidden">
                {uploadedImages[product.id] ? (
                  <img
                    src={uploadedImages[product.id]}
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                )}

                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <label className="cursor-pointer bg-white/90 backdrop-blur-sm px-6 py-3 rounded-full font-semibold text-slate-800 hover:bg-white transition-all duration-300 flex items-center gap-2 shadow-lg transform hover:scale-105">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Change Photo
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(product.id, e)}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {/* Upload indicator when no custom image */}
                {!uploadedImages[product.id] && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40 backdrop-blur-sm">
                    <svg className="w-16 h-16 text-white mb-2 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p className="text-white font-semibold">Upload Your Photo</p>
                  </div>
                )}

                {/* Decorative corner badge */}
                <div className="absolute top-4 right-4 bg-linear-to-r from-red-500 to-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg transform rotate-3 group-hover:rotate-6 transition-transform duration-300">
                  NEW
                </div>
              </div>

              {/* Card Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-slate-900 mb-4 group-hover:text-red-600 transition-colors duration-300">
                  {product.title}
                </h3>

                <button
                  className="w-full bg-linear-to-r from-red-600 to-red-700 hover:from-red-700 cursor-pointer hover:to-red-800 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group"
                  onClick={() => handleNavigation("/products")}
                >
                  <span>Customise</span>
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

              {/* Decorative linear line */}
              <div className="h-1 bg-linear-to-r from-red-500 via-pink-500 to-red-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-white px-6 py-3 rounded-full shadow-lg">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
            <span className="text-slate-700 font-medium">Free shipping on orders over $50</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out both;
        }
      `}</style>
    </div>
  );
}
