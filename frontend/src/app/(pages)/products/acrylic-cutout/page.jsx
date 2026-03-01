'use client';
import Hero2 from '@/components/section/Hero2';
import ProductsByCategory from '@/components/section/Products';
import React, { Fragment } from 'react'
import Sidebar from '@/components/section/Sidebar';


const Acrylin_Cutout = () => {
    return (
        <Fragment>
            <Sidebar />
            <Hero2
                title="Acrylic Cutout"
                subtitle="Sharp, glossy precision"
                tagline="This acrylic cutout delivers vibrant clarity, smooth edges, and a premium glossy finish, creating a bold, modern display that highlights any photo with impressive detail, durability, and style"
                // Pass a prop to identify this is acrylic cutout
                productType="acrylic-cutout"
                video1="https://res.cloudinary.com/dewxpvl5s/video/upload/v1768994987/acrylic-cutouts-hero-1_bpm6bd.mp4"
                video2="https://res.cloudinary.com/dewxpvl5s/video/upload/v1768994978/acrylic-cutouts-hero-2_tdstsd.mp4"
                video3="https://res.cloudinary.com/dewxpvl5s/video/upload/v1768994978/acrylic-cutouts-hero-3_w5oe91.mp4"
                mediaType="video"
            />
            <ProductsByCategory category='Acrylic Cutout' Heading='Acrylic Cutout' />
        </Fragment>
    )
}

export default Acrylin_Cutout;
