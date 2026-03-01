import React from "react";

const HeadingDesign = () => {
    return (
        <div className="relative overflow-hidden bg-linear-to-br from-black via-gray-900 to-black py-20 px-4">
            {/* Animated background elements */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 -left-4 w-72 h-72 bg-white rounded-full mix-blend-overlay filter blur-xl animate-pulse"></div>
                <div className="absolute top-0 -right-4 w-72 h-72 bg-gray-400 rounded-full mix-blend-overlay filter blur-xl animate-pulse" style={{animationDelay: '2s'}}></div>
                <div className="absolute -bottom-8 left-20 w-72 h-72 bg-gray-600 rounded-full mix-blend-overlay filter blur-xl animate-pulse" style={{animationDelay: '4s'}}></div>
            </div>
            
            {/* Content */}
            <div className="relative z-10 max-w-4xl mx-auto text-center">
                {/* Decorative line */}
                <div className="flex items-center justify-center mb-6">
                    <div className="h-px w-12 bg-linear-to-r from-transparent via-gray-400 to-transparent"></div>
                    <div className="mx-4 w-2 h-2 rounded-full bg-white animate-ping"></div>
                    <div className="h-px w-12 bg-linear-to-r from-transparent via-gray-400 to-transparent"></div>
                </div>

                {/* Main heading with linear text */}
                <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-linear-to-r from-white via-gray-300 to-white animate-pulse">
                    Explore Our Varieties
                </h1>

                {/* Subtitle with subtle animation */}
                <p className="text-xl md:text-2xl font-light text-gray-300 mb-8 leading-relaxed max-w-2xl mx-auto">
                    Discover quality crafted selections tailored for every occasion
                </p>

                {/* Feature badges */}
                {/* <div className="flex flex-wrap justify-center gap-4 mt-8">
                    <span className="px-6 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white text-sm font-medium border border-gray-500 hover:bg-white/20 hover:border-white transition-all duration-300 cursor-default">
                        Premium Quality
                    </span>
                    <span className="px-6 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white text-sm font-medium border border-gray-500 hover:bg-white/20 hover:border-white transition-all duration-300 cursor-default">
                        Curated Selection
                    </span>
                    <span className="px-6 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white text-sm font-medium border border-gray-500 hover:bg-white/20 hover:border-white transition-all duration-300 cursor-default">
                        Expert Crafted
                    </span>
                </div> */}

                {/* Scroll indicator */}
                <div className="mt-12 flex justify-center">
                    <div className="animate-bounce">
                        <svg className="w-6 h-6 text-gray-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                            <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HeadingDesign;