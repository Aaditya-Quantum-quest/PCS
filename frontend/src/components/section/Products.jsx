'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Heart, ShoppingBag, Star, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function ProductsByCategory({ category, heading }) {
    const [favorites, setFavorites] = useState(new Set());
    const [cart, setCart] = useState(new Set());
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!category) return;

        const fetchProducts = async () => {
            try {
                setLoading(true);
                setError('');
                const res = await axios.get('http://localhost:4000/api/products', {
                    params: { category },
                });
                setProducts(res.data);
            } catch (err) {
                const msg =
                    err.response?.data?.message ||
                    err.message ||
                    'Failed to load products';
                setError(msg);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [category]);

    const toggleFavorite = (id) => {
        setFavorites((prev) => {
            const s = new Set(prev);
            s.has(id) ? s.delete(id) : s.add(id);
            return s;
        });
    };

    const toggleCart = (id) => {
        setCart((prev) => {
            const s = new Set(prev);
            s.has(id) ? s.delete(id) : s.add(id);
            return s;
        });
    };

    const formatPrice = (price) =>
        `₹ ${Number(price || 0).toLocaleString('en-IN')}`;

    const getDisplayPrice = (product) => {
        if (product.sizes && product.sizes.length > 0) {
            const numericPrices = product.sizes
                .map((s) => Number(s.price || 0))
                .filter((p) => !Number.isNaN(p));
            if (numericPrices.length > 0) {
                return formatPrice(Math.min(...numericPrices));
            }
        }
        return formatPrice(product.price);
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

            {/* Page heading */}
            <div className="text-center mb-10 pt-8">

                {/* 🖋 Elegant Heading */}
                <h2 className="text-[clamp(2.2rem,5vw,3.5rem)] 
    font-serif leading-tight tracking-[-0.5px]">

                    <span className="text-black font-medium text-3xl md:text-4xl">
                        {heading || category}{" "}
                    </span>

                    <span className="font-['Great_Vibes'] italic
        bg-gradient-to-r from-[#ffb347] via-[#ff8c42] to-[#ffaa00]
        bg-clip-text text-transparent
        drop-shadow-[0_4px_15px_rgba(255,170,0,0.3)]
        text-3xl md:text-4xl">
                        Collection
                    </span>

                </h2>

                {/* 🌟 Decorative Divider */}
                <div className="flex items-center justify-center gap-2 my-4">
                    <div className="w-10 h-px bg-gradient-to-r from-transparent to-[#ffaa00]/70" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#ffaa00] shadow-md" />
                    <div className="w-16 h-[2px] rounded-full bg-gradient-to-r from-[#ff8c42] via-[#ffaa00] to-[#ff8c42]" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#ff8c42] shadow-md" />
                    <div className="w-10 h-px bg-gradient-to-l from-transparent to-[#ffaa00]/70" />
                </div>

                {/* 🌙 Subtitle */}
                <p className="text-[0.95rem] md:text-[1.05rem]
    text-gray-300 italic font-light
    max-w-xl mx-auto leading-relaxed">

                    Explore our finest{" "}
                    <span className="text-[#ffaa00] font-semibold">
                        {category}
                    </span>{" "}
                    creations — crafted to elevate your space with warmth & elegance.
                </p>

            </div>

            {/* Status messages */}
            {error && (
                <p className="mb-3 text-center text-sm text-red-500">{error}</p>
            )}
            {loading && (
                <p className="mb-3 text-center text-sm text-slate-400">Loading products…</p>
            )}
            {!loading && products.length === 0 && !error && (
                <p className="mb-3 text-center text-sm text-slate-400">
                    No products found in this category yet.
                </p>
            )}
            {/* ── Product Grid — unchanged ── */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-px">
                {products.map((product) => (
                    <div
                        key={product._id}
                        className="group bg-white hover:shadow-lg transition-shadow duration-200 cursor-pointer"
                    >
                        {/* Image */}
                        <div className="relative bg-gray-50 h-44 flex items-center justify-center overflow-hidden border-b border-gray-100">
                            <img
                                src={product.imageUrl}
                                alt={product.title}
                                className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                                loading="lazy"
                            />
                            {product.category && (
                                <span className="absolute top-2 left-2 bg-yellow-400 text-gray-900 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide">
                                    {product.category}
                                </span>
                            )}
                        </div>

                        {/* Content */}
                        <div className="p-3">
                            <h3 className="font-medium text-sm text-gray-800 leading-snug line-clamp-1 mb-1">
                                {product.title}
                            </h3>

                            {/* Price row */}
                            <div className="flex items-baseline gap-2 mb-2">
                                <span className="text-lg font-bold text-gray-900">
                                    {getDisplayPrice(product)}
                                </span>
                            </div>

                            {/* Rating strip */}
                            <div className="flex items-center gap-1 mb-3">
                                <div className="flex items-center bg-green-600 text-white text-[10px] font-bold px-1.5 py-0.5 gap-0.5">
                                    <span>4.8</span>
                                    <Star className="w-2.5 h-2.5 fill-white" />
                                </div>
                                <span className="text-[10px] text-gray-400">| 120+ ratings</span>
                            </div>

                            {/* Free shipping */}
                            <p className="text-[11px] text-green-600 font-medium mb-3">
                                FREE Delivery
                            </p>

                            <Link href={`/buy/${product._id}`}>
                                <button className="w-full cursor-pointer bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold py-1.5 px-3 text-xs uppercase tracking-wide transition-colors duration-150 active:scale-95 border border-yellow-500">
                                    Buy Now
                                </button>
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}