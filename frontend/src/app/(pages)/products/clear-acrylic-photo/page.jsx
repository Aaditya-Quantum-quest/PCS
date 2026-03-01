import Hero2 from '@/components/section/Hero2';
import ProductsByCategory from '@/components/section/Products';
import React from 'react'
import Sidebar from '@/components/section/Sidebar';

const page = () => {
  return (
    <>
      <Sidebar /> 
      <Hero2
        title="Clear Acrylic Photo"
        subtitle="Modern clarity, vivid depth"
        tagline='Showcase moments on ultra-clear acrylic with rich color, sharp detail, and a sleek glossy finish for homes, and gifts'
        productType="clear-acrylic" // Add this
        video1="https://res.cloudinary.com/dewxpvl5s/video/upload/v1768994331/clear-acrylic-photo-hero-1_jk3uco.mp4"
        video2="https://res.cloudinary.com/dewxpvl5s/video/upload/v1768994331/clear-acrylic-photo-hero-2_hamsun.mp4"
        video3="https://res.cloudinary.com/dewxpvl5s/video/upload/v1768994331/clear-acrylic-photo-hero-3_ghbnoi.mp4"
        mediaType="video"

      />
      <ProductsByCategory category='Clear Acrylic Photo' Heading='Clear Acrylic Photo' />
    </>
  )
}

export default page;
