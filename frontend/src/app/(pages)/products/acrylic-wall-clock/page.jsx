import Hero2 from '@/components/section/Hero2';
import ProductsByCategory from '@/components/section/Products';
import React, { Fragment } from 'react'
import Sidebar from '@/components/section/Sidebar';

const Acrylic_Wall_Clock = () => {
    return (
        <Fragment>
            <Sidebar /> 
            <Hero2
                title="Acrylic Wall Clock"
                subtitle="Clear, modern timekeeping"
                tagline="This acrylic wall clock blends modern design with vibrant clarity, featuring a glossy finish, precise movement, and durable construction to elevate any room's décor with style"
                productType="acrylic-clock" // Add this prop
                video1="https://res.cloudinary.com/dewxpvl5s/video/upload/v1768994623/acrylic-wall-clock-hero-1_gojbwd.mp4"
                video2="https://res.cloudinary.com/dewxpvl5s/video/upload/v1768994623/acrylic-wall-clock-hero-2_jnumkb.mp4"
                video3="https://res.cloudinary.com/dewxpvl5s/video/upload/v1768994623/acrylic-wall-clock-hero-3_k9lr5s.mp4"
                mediaType="video"
            />
            <ProductsByCategory category='Acrylic Wall Clock' Heading='Acrylic Wall Clock' />
        </Fragment>
    )
}

export default Acrylic_Wall_Clock;
