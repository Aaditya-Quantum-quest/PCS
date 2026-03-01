import Hero2 from '@/components/section/Hero2';
import ProductsByCategory from '@/components/section/Products';
import React, { Fragment } from 'react'

// export const metadata ={
//   title:'Acrylic Fridge Magnets'
// }

const Acrylic_Fridge_Magnets = () => {
    return (
        <Fragment>
            <Hero2 title="Acrylic Fridge Magnets" subtitle="Mini memories that stick" tagline="These acrylic fridge magnets feature vibrant printing, a glossy finish, and strong magnetic hold, turning your favorite photos into durable mini displays perfect for personalizing spaces" />
            <ProductsByCategory category='Acrylic Fridge Magnets' Heading='Acrylic Fridge Magnets' />

        </Fragment>
    )
}

export default Acrylic_Fridge_Magnets;