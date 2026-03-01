import Hero2 from '@/components/section/Hero2'
import React, { Fragment } from 'react'
import ProductsByCategory from '@/components/section/Products'

const Acrylic_Keychains = () => {
    return (
        <Fragment>
            <Hero2 
                title="Acrylic Keychains" 
                subtitle="Carry memories anywhere" 
                tagline="These acrylic keychains combine vibrant printing, durable clarity, and smooth edges, offering a lightweight, stylish way to carry your favorite memories wherever you go with convenience"
                productType="acrylic-keychain"
                // Add custom keychain images/videos
                video1="https://i.pinimg.com/1200x/3b/c3/86/3bc386018ab0e5631374a2996d79d339.jpg"
                video2="https://i.pinimg.com/1200x/01/5e/3f/015e3f53a92b444b7b7544778e951934.jpg"
                video3="https://i.pinimg.com/736x/d2/38/c2/d238c2d52b0eb99aa2c35b50cda33159.jpg"
                mediaType="image"
            />
            <ProductsByCategory category='Acrylic KeyChains' Heading='Acrylic Keychains' />
        </Fragment>
    )
}

export default Acrylic_Keychains;
