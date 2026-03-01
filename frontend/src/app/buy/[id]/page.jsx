'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import {
  ShoppingCart,
  Zap,
  Star,
  ChevronLeft,
  ChevronRight,
  Frame,
  Ruler,
  Package,
  Sparkles,
} from 'lucide-react';
import Sidebar from '@/components/section/Sidebar';
import Breadcrumbs from '@/components/section/Breadcrumbs';
import { useCart } from '@/context/cartContext';
import Link from 'next/link';

export default function BuyNowClient() {
  const { id } = useParams();
  const router = useRouter();
  const { addToCart, getTotalItems, toggleCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loadingProduct, setLoadingProduct] = useState(true);
  const [productError, setProductError] = useState('');

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('8x10');
  const [selectedColor, setSelectedColor] = useState('Natural Oak');

  const [frameMaterial, setFrameMaterial] = useState('wood');
  const [frameThickness, setFrameThickness] = useState('');
  const [orientation, setOrientation] = useState('portrait');
  const [uploadedImageUrl, setUploadedImageUrl] = useState('');
  const [placingOrder, setPlacingOrder] = useState(false);
  const [orderError, setOrderError] = useState('');
  const [orderSuccess, setOrderSuccess] = useState('');
  const [uploading, setUploading] = useState(false);

  // Default sizes for legacy products (no per-product sizes configured)
  const defaultSizes = ['5x7', '8x10', '11x14', '16x20'];
  const colors = ['Natural Oak', 'Walnut Brown', 'Pure White', 'Matte Black'];

  // Price multipliers based on size for legacy products
  const sizeMultipliers = {
    '5x7': 1.0,
    '8x10': 1.3,
    '11x14': 1.6,
    '16x20': 2.0,
  };

  // Calculate current price based on selected size
  const getCurrentPrice = () => {
    // If product has per-size prices configured, use them
    if (product?.sizes && product.sizes.length > 0) {
      const found =
        product.sizes.find((s) => s.label === selectedSize) ||
        product.sizes[0];

      if (!found) return 0;
      return Math.round(found.price);
    }

    // Legacy behaviour: single base price + multipliers
    if (!product?.price) return 0;
    const multiplier = sizeMultipliers[selectedSize] || 1.0;
    return Math.round(product.price * multiplier);
  };

  const features = [
    { icon: <Frame className="w-8 h-8" />, title: 'Premium Wood', desc: 'Handcrafted solid wood frame' },
    { icon: <Sparkles className="w-8 h-8" />, title: 'UV Protection', desc: 'Crystal clear acrylic glass' },
    { icon: <Ruler className="w-8 h-8" />, title: 'Perfect Fit', desc: 'Pre-cut mat board included' },
    { icon: <Package className="w-8 h-8" />, title: 'Easy Hanging', desc: 'Hardware & stand included' },
  ];

  const handleAddToCart = () => {
    if (!uploadedImageUrl) {
      setOrderError('Please upload a photo to be framed.');
      return;
    }

    const customization = {
      quantity,
      size: selectedSize,
      frameColor: selectedColor,
      frameMaterial,
      frameThickness,
      orientation,
      uploadedImageUrl,
      price: getCurrentPrice(), // Include current price in customization
    };

    addToCart(product, customization);
    setOrderError('');
    setOrderSuccess('Added to cart successfully!');

    setTimeout(() => setOrderSuccess(''), 3000);
  };

  // Fetch product by id
  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      try {
        setLoadingProduct(true);
        setProductError('');
        const token = localStorage.getItem('token');
        const res = await axios.get(
          `http://localhost:4000/api/products/${id}`,
          token ? { headers: { Authorization: `Bearer ${token}` } } : undefined
        );
        setProduct(res.data);

        // If product has per-size options, default selected size to the first one
        if (res.data.sizes && res.data.sizes.length > 0) {
          setSelectedSize(res.data.sizes[0].label);
        }
      } catch (err) {
        const msg =
          err.response?.data?.message ||
          err.message ||
          'Failed to load product';
        setProductError(msg);
      } finally {
        setLoadingProduct(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleBuyNow = () => {
    if (!uploadedImageUrl) {
      setOrderError('Please upload a photo to be framed.');
      return;
    }

    if (!product?._id) {
      setOrderError('Product data not loaded.');
      return;
    }

    const checkoutProduct = {
      productId: product._id,
      title: product.title,
      category: product.category || '',
      price: getCurrentPrice(), // Use calculated price
      quantity,
      size: selectedSize,
      frameColor: selectedColor,
      frameMaterial,
      frameThickness,
      orientation,
      imageUrl: product.imageUrl,
      uploadedImageUrl,
    };

    if (typeof window !== 'undefined') {
      sessionStorage.setItem('checkoutProduct', JSON.stringify(checkoutProduct));
    }

    setOrderError('');
    router.push('/checkout');
  };

  const handleUpload = async (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      setOrderError('');
      const formData = new FormData();
      formData.append('file', file);

      const token = localStorage.getItem('token');

      const res = await axios.post(
        'http://localhost:4000/api/upload',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: token ? `Bearer ${token}` : '',
          },
        }
      );

      setUploadedImageUrl(res.data.imageUrl);
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.message ||
        'Failed to upload image';
      setOrderError(msg);
    } finally {
      setUploading(false);
    }
  };

  if (loadingProduct) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-600">
        Loading product…
      </div>
    );
  }

  if (productError || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        {productError || 'Product not found'}
      </div>
    );
  }

  const mainImage = product.imageUrl;

  // Available sizes: use per-product sizes if present, otherwise legacy defaults
  const availableSizes =
    product?.sizes && product.sizes.length > 0
      ? product.sizes.map((s) => s.label)
      : defaultSizes;
  const images = product
    ? [
      product.imageUrl,
      ...(product.additionalImages || []).filter(img => img !== product.imageUrl)
    ]
    : [];

  const currentPrice = getCurrentPrice();
  const originalPrice = Math.round(currentPrice * 1.6);

  return (
    <div className="min-h-screen bg-linear-to-br from-amber-50 via-orange-50 to-rose-50 py-15 lg:py-20">
      <Sidebar />
      <Breadcrumbs />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left column - images */}
          <div className="space-y-4">
            <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden group ">
              <img
                src={images[selectedImage]}
                alt={product?.title}
                className="w-full h-[300px] lg:h-[500px] object-fit transition-transform duration-500 group-hover:scale-105"
              />

              <div className="absolute top-6 left-6 px-4 py-2 bg-linear-to-r from-amber-500 to-orange-500 text-white text-sm font-bold rounded-full shadow-lg">
                Handcrafted
              </div>

              <button
                onClick={() =>
                  setSelectedImage((selectedImage - 1 + images.length) % images.length)
                }
                aria-label="Previous image"
                className="absolute cursor-pointer left-4 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center rounded-full bg-linear-to-br from-white/90 to-white/70 text-gray-800 shadow-xl backdrop-blur-md transition-all duration-300 ease-out hover:scale-110 hover:shadow-2xl hover:text-black active:scale-95 focus:outline-none focus:ring-2 focus:ring-black/30"
              >
                <ChevronLeft className="w-6 h-6 stroke-[2.2]" />
              </button>

              <button
                onClick={() =>
                  setSelectedImage((selectedImage + 1) % images.length)
                }
                aria-label="Next image"
                className="absolute cursor-pointer right-4 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center rounded-full bg-linear-to-br from-white/90 to-white/70 text-gray-800 shadow-xl backdrop-blur-md transition-all duration-300 ease-out hover:scale-110 hover:shadow-2xl hover:text-black active:scale-95 focus:outline-none focus:ring-2 focus:ring-black/30"
              >
                <ChevronRight className="w-6 h-6 stroke-[2.2]" />
              </button>
            </div>

            <div className="grid grid-cols-4 gap-4">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`relative rounded-xl overflow-hidden border-4 transition ${selectedImage === idx
                    ? 'border-amber-500 shadow-lg'
                    : 'border-transparent hover:border-gray-300'
                    }`}
                >
                  <img src={img} alt={`View ${idx + 1}`} className="w-full h-24 object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Right column - details */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-semibold rounded-full">
                  In Stock
                </span>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-semibold rounded-full">
                  Free Shipping
                </span>
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                {product.title}
              </h1>
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="text-gray-600 font-medium">(487 reviews)</span>
              </div>
            </div>

            <div className="flex items-baseline gap-3">
              <span className="text-5xl font-bold bg-linear-to-r from-amber-600 to-rose-600 bg-clip-text text-transparent">
                ₹{currentPrice}
              </span>
              <span className="text-2xl text-gray-400 line-through">
                ₹{originalPrice}
              </span>
              <span className="px-3 py-1 bg-red-100 text-red-600 text-sm font-semibold rounded-full">
                38% OFF
              </span>
            </div>

            <p className="text-gray-600 text-lg leading-relaxed">
              Elevate your cherished memories with our handcrafted frames, made to fit your exact
              preferences in size, color, and orientation.
            </p>

            {/* Size */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                Select Size
              </label>
              <div className="grid grid-cols-4 gap-3">
                {availableSizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`py-3 px-4 rounded-xl cursor-pointer font-semibold transition ${selectedSize === size
                      ? 'bg-linear-to-r from-amber-500 to-orange-500 text-white shadow-lg'
                      : 'bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200'
                      }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Color */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                Select Color
              </label>
              <div className="grid grid-cols-2 gap-3">
                {colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`py-3 px-4 cursor-pointer rounded-xl font-medium transition text-left ${selectedColor === color
                      ? 'bg-linear-to-r from-amber-500 to-orange-500 text-white shadow-lg'
                      : 'bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200'
                      }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* Material / thickness / orientation */}
            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-900 mb-1">
                  Frame Material
                </label>
                <select
                  value={frameMaterial}
                  onChange={(e) => setFrameMaterial(e.target.value)}
                  className="w-full px-3 py-2 cursor-pointer rounded-xl border text-black border-gray-200 text-sm active:ring-2"
                >
                  <option className='cursor-pointer' value="wood">Wood</option>
                  <option className='cursor-pointer' value="metal">Metal</option>
                  <option className='cursor-pointer' value="acrylic">Acrylic</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-900 mb-1">
                  Frame Thickness (mm)
                </label>
                <input
                  type="number"
                  min={5}
                  max={50}
                  value={frameThickness}
                  onChange={(e) => setFrameThickness(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border text-black border-gray-200 text-sm active:ring-2"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-900 mb-1">
                  Orientation
                </label>
                <select
                  value={orientation}
                  onChange={(e) => setOrientation(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border cursor-pointer text-black border-gray-200 text-sm active:ring-2 "
                >
                  <option className='cursor-pointer' value="portrait">Portrait</option>
                  <option className='cursor-pointer' value="landscape">Landscape</option>
                  <option className='cursor-pointer' value="square">Square</option>
                </select>
              </div>
            </div>

            {/* Upload */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Upload Photo to Frame <span className="text-xs text-gray-500">(JPEG - Max 5MB)</span>
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleUpload}
                className="block w-full text-sm text-gray-700
                           file:mr-4 file:py-2 file:px-4
                           file:rounded-full file:border-0
                           file:text-sm file:font-semibold
                           file:bg-amber-50 file:text-amber-700
                           hover:file:bg-amber-100"
              />
              {uploading && (
                <p className="mt-2 text-xs text-gray-500">Uploading image…</p>
              )}
              {uploadedImageUrl && !uploading && (
                <p className="mt-2 text-xs text-emerald-600">
                  Image uploaded and ready to frame.
                </p>
              )}
            </div>


            {/* Quantity */}
            <div className="flex items-center gap-4">
              <span className="font-semibold text-gray-900">Quantity:</span>
              <div className="flex items-center gap-3  rounded-full shadow-md px-2 border border-gray-200 bg-black">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-full hover:bg-gray-100 hover:text-black cursor-pointer transition font-bold text-xl"
                >
                  −
                </button>
                <span className="w-12 text-center font-semibold text-lg">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 rounded-full hover:bg-gray-100 hover:text-black cursor-pointer transition font-bold text-xl"
                >
                  +
                </button>
              </div>
            </div>

            {orderError && (
              <p className="text-sm text-red-600">{orderError}</p>
            )}
            {orderSuccess && (
              <p className="text-sm text-emerald-600">{orderSuccess}</p>
            )}

            {/* Buttons */}
            <div className="flex gap-4">
              <button
                onClick={handleAddToCart}
                className="flex-1 py-4 bg-linear-to-r cursor-pointer from-amber-500 to-orange-500 text-white font-semibold rounded-2xl hover:shadow-2xl hover:scale-105 transition transform flex items-center justify-center gap-2"
              >
                <ShoppingCart className="w-5 h-5" />
                Add to Cart
              </button>

              <button
                onClick={handleAddToCart}
                disabled={uploading || !uploadedImageUrl}
                className="flex-1 py-4 bg-linear-to-r from-rose-500 to-pink-500 text-white font-semibold rounded-2xl hover:shadow-2xl hover:scale-105 transition transform flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <Zap className="w-5 h-5" />
                {placingOrder ? 'Placing Order...' : 'Buy Now'}
              </button>
            </div>

            {/* Trust badges */}
            <div className="flex items-center justify-center gap-6 pt-4 border-t border-gray-200">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">500+</p>
                <p className="text-xs text-gray-600">Happy Customers</p>
              </div>
              <div className="w-px h-10 bg-gray-300"></div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">4.9★</p>
                <p className="text-xs text-gray-600">Average Rating</p>
              </div>
              <div className="w-px h-10 bg-gray-300"></div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">100%</p>
                <p className="text-xs text-gray-600">Eco-Friendly</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}