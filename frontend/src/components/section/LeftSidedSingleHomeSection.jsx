'use cleint';

import React from 'react';
import { useRouter } from 'next/navigation';

export default function LeftSidedSingleHomeSections(props) {

  const router = useRouter();
  const handleIndividualNavigate = (link) => {
    router.push(link);
  }


  return (
    <section className="w-full bg-black lg:py-12 px-4 sm:px-6 lg:px-8 pt-10 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Side - Video Container */}
          <div className="w-full h-[300px] sm:h-[550px] lg:h-[550px] rounded-lg overflow-hidden bg-white shadow-2xl">
            <video
              className="w-full h-full object-cover"
              autoPlay
              loop
              muted
              playsInline
            >
              <source src={props.videoUrl} type="video/mp4" />
              {/* Fallback content */}
              <div className="w-full h-full bg-linear-to-br from-gray-200 to-gray-400 flex items-center justify-center">
                <p className="text-gray-600 text-lg">Video preview</p>
              </div>
            </video>
          </div>

          {/* Right Side - Content */}
          <div className="text-center lg:text-left px-4 lg:px-8">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
              PCS<sup className="text-xl"></sup> {props.title}
            </h1>

            <p className="text-gray-300 text-base sm:text-lg leading-relaxed mb-8 max-w-xl mx-auto lg:mx-0">
              {props.description}
            </p>
            <div className='flex justify-center '>
              <button className="bg-transparent cursor-pointer border-2 border-white text-white px-8 py-3 rounded-lg font-semibold text-lg hover:bg-white hover:text-black transition-all duration-300 transform hover:scale-105" onClick={() => handleIndividualNavigate(props.path)}>
                Shop now
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}