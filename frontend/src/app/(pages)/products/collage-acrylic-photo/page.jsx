import Hero2 from '@/components/section/Hero2';
import ProductsByCategory from '@/components/section/Products';
import React, { Fragment } from 'react'
import Sidebar from '@/components/section/Sidebar';

// export const metadata ={
//   title:'Collage Acrylic Photo'
// }

const Collage_Acrylic_Photo = () => {
    return (
        <Fragment>
            <Sidebar />

            <Hero2 title="Collage Acrylic Photo"
                productType="collage-acrylic-photo"
                subtitle="Many moments, one frame"
                tagline="This collage acrylic photo blends multiple memories into one vibrant display, featuring glossy clarity, smooth edges, and modern durability—perfect for celebrating stories, gifting, and decorating any space beautifully"

                video1="https://res.cloudinary.com/dewxpvl5s/video/upload/v1768983066/collage-hero-video-1_ii6z4q.mp4"
                video2="https://res.cloudinary.com/dewxpvl5s/video/upload/v1768983067/collage-hero-video-2_x7lrdk.mp4"
                video3="https://res.cloudinary.com/dewxpvl5s/video/upload/v1768983068/collage-hero-video-3_o9n7c5.mp4"
                mediaType="video"
            />
            <ProductsByCategory category='Collage Acrylic Photo' Heading='Collage Acrylic Photo' />
        </Fragment>
    )
}

export default Collage_Acrylic_Photo;