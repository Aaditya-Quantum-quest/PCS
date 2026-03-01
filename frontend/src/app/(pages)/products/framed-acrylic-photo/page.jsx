import Hero2 from '@/components/section/Hero2'
import ProductsByCategory from '@/components/section/Products'
import React, { Fragment } from 'react'
import Sidebar from '@/components/section/Sidebar'

// export const metadata ={
//   title:'Framed Acrylic Photo'
// }

const Framed_Acrylic_Photo = () => {
    return (
        <Fragment>
            <Sidebar />
            <Hero2 title="Framed Acrylic Photo"
                subtitle="Elegance in every frame"
                tagline="This framed acrylic photo combines vibrant clarity, premium glossy finish, and a sleek border, creating a durable, modern display perfect for decorating walls, gifting, and showcasing cherished memories beautifully"
                video1="https://res.cloudinary.com/dewxpvl5s/video/upload/v1768995415/framed-acrylic-photo-hero-1_ydaqel.mp4"
                video2="https://res.cloudinary.com/dewxpvl5s/video/upload/v1768995413/framed-acrylic-photo-hero-2_wqokqu.mp4"
                video3="https://res.cloudinary.com/dewxpvl5s/video/upload/v1768995423/framed-acrylic-photo-hero-3_wjwsyz.mp4"
                mediaType="video"
            />
            <ProductsByCategory category='Framed Acrylic Photo' Heading='Framed Acrylic Photo' />
        </Fragment>
    )
}

export default Framed_Acrylic_Photo