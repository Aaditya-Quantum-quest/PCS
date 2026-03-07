'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Heart, ShoppingBag, Star, ArrowRight, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import Link from 'next/link';

export default function ProductsByCategory({ category, heading }) {
    const [favorites, setFavorites] = useState(new Set());
    const [cart, setCart] = useState(new Set());
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    // Sorting states
    const [sortBy, setSortBy] = useState('default');
    const [priceRange, setPriceRange] = useState({ min: '', max: '' });
    const [showFilters, setShowFilters] = useState(false);

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
                setFilteredProducts(res.data);
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
    
    // Apply filters and sorting
    useEffect(() => {
        let filtered = [...products];
        
        // Apply price range filter
        if (priceRange.min || priceRange.max) {
            filtered = filtered.filter(product => {
                const price = getNumericPrice(product);
                const min = priceRange.min ? Number(priceRange.min) : 0;
                const max = priceRange.max ? Number(priceRange.max) : Infinity;
                return price >= min && price <= max;
            });
        }
        
        // Apply sorting
        switch (sortBy) {
            case 'price-asc':
                filtered.sort((a, b) => getNumericPrice(a) - getNumericPrice(b));
                break;
            case 'price-desc':
                filtered.sort((a, b) => getNumericPrice(b) - getNumericPrice(a));
                break;
            case 'name-asc':
                filtered.sort((a, b) => a.title.localeCompare(b.title));
                break;
            case 'name-desc':
                filtered.sort((a, b) => b.title.localeCompare(a.title));
                break;
            default:
                // Keep original order
                break;
        }
        
        setFilteredProducts(filtered);
    }, [products, sortBy, priceRange]);
    
    // Helper function to get numeric price
    const getNumericPrice = (product) => {
        if (product.sizes && product.sizes.length > 0) {
            const numericPrices = product.sizes
                .map((s) => Number(s.price || 0))
                .filter((p) => !Number.isNaN(p));
            if (numericPrices.length > 0) {
                return Math.min(...numericPrices);
            }
        }
        return Number(product.price) || 0;
    };

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
            
            {/* Sorting and Filtering Controls */}
            {!loading && products.length > 0 && (
                <div className="mb-6 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                        {/* Sort Controls */}
                        <div className="flex flex-wrap items-center gap-3">
                            <span className="text-sm font-medium text-gray-700">Sort by:</span>
                            <div className="flex flex-wrap gap-2">
                                <button
                                    onClick={() => setSortBy('default')}
                                    className={`px-3 py-1.5 cursor-pointer text-xs font-medium rounded-md transition-colors ${
                                        sortBy === 'default'
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                >
                                    Default
                                </button>
                                <button
                                    onClick={() => setSortBy('price-asc')}
                                    className={`px-3 py-1.5 text-xs cursor-pointer font-medium rounded-md transition-colors flex items-center gap-1 ${
                                        sortBy === 'price-asc'
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                >
                                    <ArrowUp className="w-3 h-3" />
                                    Price Low to High
                                </button>
                                <button
                                    onClick={() => setSortBy('price-desc')}
                                    className={`px-3 py-1.5 text-xs cursor-pointer font-medium rounded-md transition-colors flex items-center gap-1 ${
                                        sortBy === 'price-desc'
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                >
                                    <ArrowDown className="w-3 h-3" />
                                    Price High to Low
                                </button>
                                <button
                                    onClick={() => setSortBy('name-asc')}
                                    className={`px-3 py-1.5 text-xs cursor-pointer font-medium rounded-md transition-colors ${
                                        sortBy === 'name-asc'
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                >
                                    Name A-Z
                                </button>
                                <button
                                    onClick={() => setSortBy('name-desc')}
                                    className={`px-3 py-1.5 text-xs cursor-pointer font-medium rounded-md transition-colors ${
                                        sortBy === 'name-desc'
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                >
                                    Name Z-A
                                </button>
                            </div>
                        </div>
                        
                        {/* Price Range Filter Toggle */}
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="px-3 py-1.5 text-xs font-medium rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors flex items-center gap-1"
                        >
                            <ArrowUpDown className="w-3 h-3" />
                            Price Filter
                        </button>
                    </div>
                    
                    {/* Price Range Filter */}
                    {showFilters && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                                <span className="text-sm font-medium text-gray-700">Price Range:</span>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="number"
                                        placeholder="Min"
                                        value={priceRange.min}
                                        onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                                        className="w-24 px-2 py-1 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                                        min="0"
                                    />
                                    <span className="text-gray-500">to</span>
                                    <input
                                        type="number"
                                        placeholder="Max"
                                        value={priceRange.max}
                                        onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                                        className="w-24 px-2 py-1 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                                        min="0"
                                    />
                                    <button
                                        onClick={() => setPriceRange({ min: '', max: '' })}
                                        className="px-2 py-1 text-xs bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-md transition-colors"
                                    >
                                        Clear
                                    </button>
                                </div>
                            </div>
                            {filteredProducts.length !== products.length && (
                                <p className="mt-2 text-xs text-gray-600">
                                    Showing {filteredProducts.length} of {products.length} products
                                </p>
                            )}
                        </div>
                    )}
                </div>
            )}
            
            {!loading && filteredProducts.length === 0 && !error && (
                <p className="mb-3 text-center text-sm text-slate-400">
                    {products.length === 0 ? 'No products found in this category yet.' : 'No products match your current filters.'}
                </p>
            )}
            {/* ── Product Grid — unchanged ── */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-px">
                {filteredProducts.map((product) => (
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