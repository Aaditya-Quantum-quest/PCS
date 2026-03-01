import Hero2 from '@/components/section/Hero2';
import ProductsByCategory from '@/components/section/Products';
import React, { Fragment } from 'react'
import Sidebar from '@/components/section/Sidebar';

const Miniphoto_Gallery = () => {
    return (
        <Fragment>
            <Sidebar /> 
            <Hero2
                title="Mini Photo Gallery"
                subtitle="Small moments, big impact"
                tagline="This mini photo gallery showcases multiple memories in compact acrylic frames, offering vibrant clarity, a glossy finish, and a modern display perfect for desks, shelves, gifting, and décor"
                productType="mini-gallery" // Add this
                video1="https://i.pinimg.com/736x/f9/c6/e5/f9c6e5d7a1d13d86864145f885092c78.jpg"
                video2="https://i.pinimg.com/736x/19/c2/a3/19c2a30df02f31816b0d0ebb9d7260ed.jpg"
                video3="https://i.pinimg.com/736x/36/84/55/3684557e2f83516bdad2e5866878fb99.jpg"
                mediaType="image"
            />
            <ProductsByCategory category='Miniphoto Gallery' Heading='MiniPhoto Gallery' />
        </Fragment>
    )
}

export default Miniphoto_Gallery;
