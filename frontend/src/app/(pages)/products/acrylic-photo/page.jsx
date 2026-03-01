'use client';

import Hero2 from '@/components/section/Hero2';
import ProductsByCategory from '@/components/section/Products';
import { Fragment } from 'react';
import Sidebar from '@/components/section/Sidebar';

// export const metadata ={
//   title:'Acrylic Photo'
// }

export default function HeroSection() {
  return (
    <>
      <Fragment>
        <Sidebar />
        <Hero2
          title=' Acrylic Photo'
          subtitle="Modern Elegance in Every Detail"
          tagline="Transform your memories into vibrant, high-definition Acrylic Photo prints with ultra-clear acrylic, rich colors, and a sleek modern finish — perfect for homes, offices, or gifting."
          video1="https://res.cloudinary.com/dewxpvl5s/video/upload/v1768994074/acrylic-photo-hero-1_ltailv.mp4"
          video2="https://res.cloudinary.com/dewxpvl5s/video/upload/v1768994094/acrylic-photo-hero-2_btm2x4.mp4"
          video3="https://res.cloudinary.com/dewxpvl5s/video/upload/v1768994094/acrylic-photo-hero-3_qubafa.mp4"
          mediaType="video"
        />
        <ProductsByCategory category="Acrylic Photo" heading="Acrylic Photo" />
      </Fragment>
    </>
  );
}
