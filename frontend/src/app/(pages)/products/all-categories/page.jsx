import React from 'react';
import { ArrowRight, Video } from 'lucide-react';
import Link from 'next/link';

const ShowCase = () => {
    const frames = [
        {
            id: 1,
            tag: 'CUSTOM CUT DESIGN',
            title: 'Acrylic Cutout',
            subtitle: 'Precision-cut glossy shapes.',
            price: 'From ₹249',
            video: 'acrylic-cutout.mp4',
            bgColor: 'bg-red-50',
            textColor: 'text-red-900',
            LinkToPage: "/products/acrylic-cutout",
        },
        {
            id: 2,
            tag: 'DESK ESSENTIAL',
            title: 'Acrylic Desk Photo',
            subtitle: 'Perfect for tables & workspaces.',
            price: 'From ₹239',
            video: 'acrylic-desk-photo.mp4',
            bgColor: 'bg-blue-50',
            textColor: 'text-blue-900',
            LinkToPage: "/products/acrylic-desk-photo",
        },
        {
            id: 3,
            tag: 'MAGNETIC SPECIAL',
            title: 'Acrylic Fridge Magnets',
            subtitle: 'Tiny memories with big impact.',
            price: 'From ₹179',
            video: 'acrylic-fridge-magnet.mp4',
            bgColor: 'bg-green-50',
            textColor: 'text-green-900',
            LinkToPage: "/products/acrylic-fridge-magnets",
        },
        {
            id: 4,
            tag: 'POPULAR PICK',
            title: 'Acrylic Keychains',
            subtitle: 'Carry your memories anywhere.',
            price: 'From ₹129',
            video: 'acrylic-keychains.mp4', // FIXED: Was 'image' before
            bgColor: 'bg-rose-50',
            textColor: 'text-rose-900',
            LinkToPage: "/products/acrylic-keychains",
        },
        {
            id: 5,
            tag: 'DESIGNER MONOGRAM',
            title: 'Acrylic Monogram',
            subtitle: 'Stylish initials that stand out.',
            price: 'From ₹299',
            video: 'acrylic-monogram.mp4',
            bgColor: 'bg-indigo-50',
            textColor: 'text-indigo-900',
            LinkToPage: "/products/acrylic-monogram",
        },
        {
            id: 6,
            tag: 'NAMEPLATE SPECIAL',
            title: 'Acrylic Nameplates',
            subtitle: 'Modern look for your entrances.',
            price: 'From ₹349',
            video: 'acrylic-nameplate.mp4',
            bgColor: 'bg-yellow-50',
            textColor: 'text-yellow-900',
            LinkToPage: "/products/acrylic-nameplate",
        },
        {
            id: 7,
            tag: 'CUSTOM PHOTO PRINT',
            title: 'Acrylic Photo',
            subtitle: 'Crystal-clear glossy finish.',
            price: 'From ₹269',
            video: 'acrylic-photo.mp4',
            bgColor: 'bg-emerald-50',
            textColor: 'text-emerald-900',
            LinkToPage: "/products/acrylic-photo",
        },
        {
            id: 8,
            tag: 'TRENDING CLOCK',
            title: 'Acrylic Wall Clock',
            subtitle: 'Functional wall art.',
            price: 'From ₹499',
            video: 'acrylic-wall-clock.mp4',
            bgColor: 'bg-orange-50',
            textColor: 'text-orange-900',
            LinkToPage: "/products/acrylic-wall-clock",
        },
        {
            id: 9,
            tag: 'ALUMINIUM FRAME SERIES',
            title: 'Aluminium Framed Acrylic Photo',
            subtitle: 'Premium metal-finished edging.',
            price: 'From ₹799',
            video: 'acrylic-wall-clock.mp4', // Changed from duplicate
            bgColor: 'bg-slate-50',
            textColor: 'text-slate-900',
            LinkToPage: "/products/aluminium-framed-acrylic-photo",
        },
        {
            id: 10,
            tag: 'CRYSTAL CLEAR EDITION',
            title: 'Clear Acrylic Photo',
            subtitle: 'Ultra-transparent, HD sharpness.',
            price: 'From ₹349',
            video: 'clear-acrylic-photo.mp4',
            bgColor: 'bg-cyan-50',
            textColor: 'text-cyan-900',
            LinkToPage: "/products/clear-acrylic-photo",
        },
        {
            id: 11,
            tag: 'MULTI-PHOTO LAYOUT',
            title: 'Collage Acrylic Photo',
            subtitle: 'Showcase many moments together.',
            price: 'From ₹499',
            video: 'collage-acrylic-photo.mp4',
            bgColor: 'bg-violet-50',
            textColor: 'text-violet-900',
            LinkToPage: "/products/collage-acrylic-photo",
        },
        {
            id: 13,
            tag: 'MINI GALLERY SET',
            title: 'Mini Photo Gallery',
            subtitle: 'Small prints, big memories.',
            price: 'From ₹199',
            video: 'mini-photo-gallery.mp4',
            bgColor: 'bg-pink-50',
            textColor: 'text-pink-900',
            LinkToPage: "/products/miniphoto-gallery",
        }
    ];

    return (
        <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 px-8 py-20 my-15">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12 max-w-4xl mx-auto px-4">
                    <div className="inline-block mb-4">
                        <span className="text-sm font-normal tracking-widest text-red-600 uppercase bg-red-50 px-4 py-2 rounded-full">
                            Premium Quality
                        </span>
                    </div>
                    <h1 className="text-6xl md:text-7xl font-medium mb-6 bg-linear-to-r from-gray-900 via-gray-800 to-gray-600 bg-clip-text text-transparent leading-tight">
                        Our Frame <span className='bg-clip-text text-transparent bg-linear-to-r from-red-600 to-pink-600'>Collection</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                        Discover the perfect frame for your memories
                    </p>
                    <div className="mt-8 flex items-center justify-center gap-2">
                        <div className="h-1 w-20 bg-linear-to-r from-red-600 to-pink-600 rounded-full"></div>
                        <div className="h-1 w-1 bg-red-600 rounded-full"></div>
                        <div className="h-1 w-1 bg-red-600 rounded-full"></div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {frames.map((frame) => (

                    <Link href={frame.LinkToPage} key={frame.id}>
                        <div
                            className={`${frame.bgColor} rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer group relative overflow-hidden`}
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>

                            {/* Video Section - FIXED */}
                            <div className="relative w-full h-48 mb-6 rounded-2xl overflow-hidden">
                                <video
                                    src={`/${frame.video}`}
                                    autoPlay
                                    muted
                                    loop
                                    playsInline
                                    className='h-full w-full object-cover group-hover:scale-110 transition-transform duration-500'
                                >
                                    <source src={`/${frame.video}`} type='video/mp4' />
                                    Your browser does not support the video tag.
                                </video>
                            </div>

                            <div className="relative z-10">
                                <span className={`text-xs font-bold ${frame.textColor} tracking-wider opacity-70`}>
                                    {frame.tag}
                                </span>

                                <h3 className={`text-2xl font-bold ${frame.textColor} mt-4 mb-2`}>
                                    {frame.title}
                                </h3>

                                <p className={`text-lg ${frame.textColor} opacity-80 mb-6`}>
                                    {frame.subtitle}
                                </p>

                                <div className="flex items-center justify-between mt-8">
                                    <span className={`text-xl font-semibold ${frame.textColor}`}>
                                        {frame.price}
                                    </span>

                                    <button className={`${frame.textColor.replace('text-', 'bg-')} text-white px-6 py-2.5 rounded-full font-semibold hover:opacity-90 transition-opacity flex items-center gap-2 group-hover:gap-3`}>
                                        View
                                        <ArrowRight size={18} />
                                    </button>
                                </div>
                            </div>

                            <div className={`absolute bottom-0 right-0 w-40 h-40 ${frame.textColor.replace('text-', 'bg-')} opacity-5 rounded-tl-full`}></div>
                        </div>
                    </Link>
                    ))}
                </div>
            </div>

            <div className='flex w-full justify-center my-22'>
                <Link href="/">
                    <button className='relative px-12 py-6 text-white font-semibold cursor-pointer text-lg rounded-full bg-linear-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 shadow-lg hover:shadow-2xl hover:shadow-red-500/50 transform hover:-translate-y-2 transition-all duration-300 ease-out group overflow-hidden'>
                        <span className='relative z-10'>Go Back</span>
                        <div className='absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300'></div>
                    </button>
                </Link>
            </div>
        </div>
    );
};

export default ShowCase;
