'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ProductShowcase() {
  const router = useRouter();
  const [debugInfo, setDebugInfo] = useState('');

  const products = [
    {
      id: 1,
      image: 'https://res.cloudinary.com/dewxpvl5s/image/upload/v1767948688/nameplate-1_eqnnzt.webp',
      title: 'Ganesh Acrylic House Name Plate',
      description: 'Elegant acrylic nameplate featuring Lord Ganesh, perfect for modern home entrances.',
      customizable_image: 'https://res.cloudinary.com/dewxpvl5s/image/upload/v1767950031/nameplate-custom-1_erq5vs.png',
    },
    {
      id: 2,
      image: 'https://res.cloudinary.com/dewxpvl5s/image/upload/v1767948688/nameplate-2_r41hp8.webp',
      title: 'Square Ganesh Acrylic Name Plate',
      description: 'Minimal square acrylic nameplate with a premium Ganesh design for stylish homes.',
      customizable_image: 'https://res.cloudinary.com/dewxpvl5s/image/upload/v1767950031/nameplate-custom-2_zcgiqi.png',
    },
    {
      id: 3,
      image: 'https://res.cloudinary.com/dewxpvl5s/image/upload/v1767948688/nameplate-3_gi8p4s.webp',
      title: 'Portrait Ganesh Acrylic Name Plate',
      description: 'Vertical acrylic nameplate with a divine Ganesh motif and clean typography.',
      customizable_image: 'https://res.cloudinary.com/dewxpvl5s/image/upload/v1767950031/nameplate-custom-3_w2juiw.png',
    },
    {
      id: 4,
      image: 'https://res.cloudinary.com/dewxpvl5s/image/upload/v1768763412/beach-nameplate-front_wsi8k6.png',
      title: 'Beach Theme Acrylic Name Plate',
      description: 'Vibrant beach-inspired acrylic nameplate with a refreshing coastal design.',
      customizable_image: 'https://res.cloudinary.com/dewxpvl5s/image/upload/v1768762349/beach-nameplate-back_fiqjid.png',
    },
    {
      id: 5,
      image: 'https://res.cloudinary.com/dewxpvl5s/image/upload/v1768763723/black-nameplate-front_uf6ogp.png',
      title: 'Premium Black Acrylic Name Plate',
      description: 'Luxury black acrylic nameplate with a bold and modern finish.',
      customizable_image: 'https://res.cloudinary.com/dewxpvl5s/image/upload/v1768762486/black-nameplate-back_tqqc7i.png',
    },
    {
      id: 6,
      image: 'https://res.cloudinary.com/dewxpvl5s/image/upload/v1768763807/Screenshot_2026-01-19_004618_vuqhfe.png',
      title: 'Dark Blue Vertical Acrylic Name Plate',
      description: 'Stylish vertical acrylic nameplate in a rich dark blue theme.',
      customizable_image: 'https://res.cloudinary.com/dewxpvl5s/image/upload/v1768762909/verticle-darkblue-nameplate-back_iflupc.png',
    },
    {
      id: 7,
      image: 'https://res.cloudinary.com/dewxpvl5s/image/upload/v1768764999/purple-nameplate-front_bk7kof.png',
      title: 'Purple Designer Acrylic Name Plate',
      description: 'Elegant purple acrylic nameplate with a modern artistic touch.',
      customizable_image: 'https://res.cloudinary.com/dewxpvl5s/image/upload/v1768764995/purple-nameplate-back_zlhfcu.png',
    },
    {
      id: 8,
      image: 'https://res.cloudinary.com/dewxpvl5s/image/upload/v1768764992/poster-nameplate-front_yjk6to.png',
      title: 'Poster Style Acrylic Name Plate',
      description: 'Creative poster-style acrylic nameplate with vibrant design elements.',
      customizable_image: 'https://res.cloudinary.com/dewxpvl5s/image/upload/v1768764988/poster-nameplate-back_ppkrcg.png',
    },
    {
      id: 9,
      image: 'https://res.cloudinary.com/dewxpvl5s/image/upload/v1768764986/pink-white-nameplate-front_of49qw.png',
      title: 'Pink & White Acrylic Name Plate',
      description: 'Soft pink and white acrylic nameplate with a clean, elegant look.',
      customizable_image: 'https://res.cloudinary.com/dewxpvl5s/image/upload/v1768764985/pink-white-nameplate-back_ry9otx.png',
    },
    {
      id: 10,
      image: 'https://res.cloudinary.com/dewxpvl5s/image/upload/v1768764976/pink-nameplate-front_yufas2.png',
      title: 'Pink Designer Acrylic Name Plate',
      description: 'Modern pink acrylic nameplate perfect for stylish home decor.',
      customizable_image: 'https://res.cloudinary.com/dewxpvl5s/image/upload/v1768764976/pink-nameplate-back_l01dlm.png',
    },
    {
      id: 11,
      image: 'https://res.cloudinary.com/dewxpvl5s/image/upload/v1768764975/orange-nameplate-front_up7xh7.png',
      title: 'Orange Acrylic Name Plate',
      description: 'Bright orange acrylic nameplate adding warmth and energy to your entrance.',
      customizable_image: 'https://res.cloudinary.com/dewxpvl5s/image/upload/v1768764975/orange-nameplate-back_v1m0ph.png',
    },
    {
      id: 12,
      image: 'https://res.cloudinary.com/dewxpvl5s/image/upload/v1768805431/ali-nameplate-front_dpzywh.png',
      title: 'Personalized Photo Acrylic Name Plate',
      description: 'Custom photo acrylic nameplate designed for a truly personal touch.',
      customizable_image: 'https://res.cloudinary.com/dewxpvl5s/image/upload/v1768805431/ali-nameplate-back_q1hvtt.png',
    },
    {
      id: 13,
      image: 'https://res.cloudinary.com/dewxpvl5s/image/upload/v1768805537/blue-nameplate-front_ovbtit.png',
      title: 'Blue Modern Acrylic Name Plate',
      description: 'Sleek blue acrylic nameplate with a contemporary design.',
      customizable_image: 'https://res.cloudinary.com/dewxpvl5s/image/upload/v1768805536/blue-nameplate-back_yaau6n.png',
    },
    {
      id: 14,
      image: 'https://res.cloudinary.com/dewxpvl5s/image/upload/v1768805534/ca-nameplate-front_dkbiwg.png',
      title: 'CA Professional Acrylic Name Plate',
      description: 'Professional acrylic nameplate ideal for Chartered Accountants and offices.',
      customizable_image: 'https://res.cloudinary.com/dewxpvl5s/image/upload/v1768805528/ca-nameplate-back_ob8tbx.png',
    },
    {
      id: 15,
      image: 'https://res.cloudinary.com/dewxpvl5s/image/upload/v1768805664/cricket1-nameplate-front_agu78y.png',
      title: 'Cricket Theme Acrylic Name Plate',
      description: 'Sports-inspired acrylic nameplate for passionate cricket lovers.',
      customizable_image: 'https://res.cloudinary.com/dewxpvl5s/image/upload/v1768805667/cricket1-nameplate-back_fwnuhu.png',
    },
    {
      id: 16,
      image: 'https://res.cloudinary.com/dewxpvl5s/image/upload/v1768805658/circle-nameplate-front_mnlbfh.png',
      title: 'Round Acrylic Name Plate',
      description: 'Unique circular acrylic nameplate with a modern premium finish.',
      customizable_image: 'https://res.cloudinary.com/dewxpvl5s/image/upload/v1768805659/circle-nameplate-back_n7jpmf.png',
    },
  ];


  const handleCustomize = (productId) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      // ✅ FIXED: Clear any old data first, then set new values
      localStorage.removeItem('nameplateBackground');
      localStorage.removeItem('selectedProductId');
      localStorage.removeItem('selectedProductTitle');

      // ✅ Save with explicit verification
      localStorage.setItem('nameplateBackground', product.customizable_image);
      localStorage.setItem('selectedProductId', productId.toString());
      localStorage.setItem('selectedProductTitle', product.title);

      // ✅ IMMEDIATE VERIFICATION - Check if it actually saved
      const savedImage = localStorage.getItem('nameplateBackground');
      const savedId = localStorage.getItem('selectedProductId');

      console.log('🟢 SAVED TO LOCALSTORAGE:', {
        image: savedImage,
        id: savedId,
        title: localStorage.getItem('selectedProductTitle'),
        productImageLength: product.image.length // Should be > 0
      });

      // setDebugInfo(`✅ Saved: ${product.title}\nImage: ${savedImage?.substring(0, 50)}...`);

      // Navigate after DOM update
      setTimeout(() => {
        console.log('🚀 Navigating to /nameplate-editor');
        router.push('/nameplate-editor');
      }, 100);
    }
  };

  // Debug: Check localStorage on mount
  // useEffect(() => {
  //   const existing = localStorage.getItem('nameplateBackground');
  //   if (existing) {
  //     console.log('💾 Existing localStorage on load:', existing);
  //     setDebugInfo(`Found existing: ${existing.substring(0, 50)}...`);
  //   }
  // }, []);

  useEffect(() => {
    const existing = localStorage.getItem('nameplateBackground');
    if (existing) {
      console.log('💾 Existing localStorage on load:', existing);
    }
  }, []);


return (
    <div className="min-h-screen bg-white py-8 px-4 sm:px-6 lg:px-8 pt-24">
      <div className="max-w-7xl mx-auto">

        {/* Debug Panel */}
        {debugInfo && (
          <div className="bg-green-100 border border-green-400 text-green-800 px-4 py-3 mb-8 max-w-md text-sm">
            {debugInfo}
          </div>
        )}

        {/* Header */}
        <div className="border-b border-gray-200 pb-6 mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
            Designer Name Plates
          </h1>
          <p className="text-sm text-gray-500">
            Timeless Highly-themed acrylic designs that add elegance, positivity, and style to your home.
          </p>
        </div>

        {/* Product Grid */}
<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
  {products.map((product) => (
    <div
      key={product.id}
      className="group bg-white border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-200"
    >
      {/* Image */}
      <div className="relative bg-gray-50 h-44 overflow-hidden flex items-center justify-center border-b border-gray-100">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => console.error('❌ Image failed:', product.image)}
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-200" />
      </div>

      {/* Content */}
      <div className="p-3">
        <h3 className="text-sm font-medium text-gray-800 leading-snug line-clamp-2 mb-3 min-h-[40px]">
          {product.title}
        </h3>

        <button
          onClick={() => handleCustomize(product.id)}
          className="w-full cursor-pointer bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold py-1.5 px-3 text-xs uppercase tracking-wide transition-colors duration-150 active:scale-95 border border-yellow-500"
        >
          Customise
        </button>
      </div>
    </div>
  ))}
</div>

      </div>
    </div>
);
}
