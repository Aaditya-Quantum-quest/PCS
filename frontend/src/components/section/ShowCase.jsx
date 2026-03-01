'use client';

import React, { Fragment } from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';

const ShowCase = () => {
    const frames = [
        {
            id: 1,
            tag: 'CLASSIC COLLECTION',
            title: 'Acrylic Photo',
            subtitle: 'Timeless Beauty.',
            price: 'From ₹249.00',
            video: 'acrylic-photo.mp4',
            bgColor: 'bg-amber-50',
            textColor: 'text-amber-900',
            LinkToPage: "/products/acrylic-photo"
        },
        {
            id: 2,
            tag: 'NEW ARRIVAL',
            title: 'Clear Acrylic photo',
            subtitle: 'Sleek & Contemporary.',
            price: 'From ₹339.00',
            video: 'clear-acrylic-photo.mp4',
            bgColor: 'bg-rose-100',
            textColor: 'text-rose-900',
            LinkToPage: "/products/acrylic-photo",
            LinkToPage: "/products/clear-acrylic-photo"
        },
        {
            id: 3,
            tag: 'DESK ESSENTIAL',
            title: 'Acrylic Desk Photo',
            subtitle: 'Perfect for tables & workspaces.',
            price: 'From ₹239',
            video: 'acrylic-desk-photo.mp4',
            bgColor: 'bg-blue-50',
            textColor: 'text-blue-900',
            LinkToPage: "/products/acrylic-desk-photo",
        },


    ];

    const router = useRouter();

    const handleNavigate = (link) => {
        router.push(link)
    }

    return (


        <Fragment>
            <div className="bg-white p-8 pt-20">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16 lg:mb-20 space-y-6">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 bg-linear-to-r from-amber-100 to-orange-100 px-5 py-2.5 rounded-full border-2 border-amber-300/50 shadow-lg animate-fade-in">
                            <Sparkles className="w-5 h-5 text-amber-600 animate-pulse" />
                            <span className="text-sm font-bold text-amber-900 tracking-wide">Curated Collections</span>
                        </div>

                        {/* Main Heading with linear */}
                        <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                            Our <span className="bg-linear-to-r from-amber-600 via-orange-500 to-rose-500 bg-clip-text text-transparent">Acrylic Frame</span> Collection
                        </h1>

                        <p className="text-xl lg:text-2xl text-gray-600 font-medium max-w-3xl mx-auto leading-relaxed">
                            Discover the perfect frame for your memories with crystal-clear clarity and modern elegance
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {frames.map((frame) => (

                            <Link href={frame.LinkToPage} key={frame.id}>
                                <div

                                    className={`${frame.bgColor} rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer group relative overflow-hidden`}
                                >
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>

                                    {/* Image Section */}
                                    <div className="relative w-full h-48 mb-6 rounded-2xl overflow-hidden">
                                        {/* <Image
                                        src={frame.image}
                                        alt={frame.title}
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    /> */}
                                        <video
                                            loop
                                            autoPlay
                                            muted
                                            playsInline
                                            className='h-full w-full object-cover'>
                                            <source src={`${frame.video}`} type='video/mp4' />

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
                <div className='flex w-full  justify-center my-22'>
                    <button className='relative px-12 py-6 text-white font-semibold cursor-pointer text-lg rounded-full bg-linear-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 shadow-lg hover:shadow-2xl hover:shadow-red-500/50 transform hover:-translate-y-2 transition-all duration-300 ease-out group overflow-hidden' onClick={() => handleNavigate('/products/all-categories')}>
                        <span className='relative z-10'>View All Categories</span>
                        <div className='absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300'></div>
                    </button>
                </div>

            </div>


        </Fragment>
    );
};

export default ShowCase;
