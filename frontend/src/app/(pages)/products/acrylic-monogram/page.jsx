import Hero2 from '@/components/section/Hero2';
import ProductsByCategory from '@/components/section/Products';
import React, { Fragment } from 'react'

// export const metadata ={
//   title:'Acrylic Monogram'
// }

const Acrylic_Monogram = () => {
    return (
        <Fragment>
            <Hero2 title="Acrylic Monogram" subtitle="Personalized glossy elegance" tagline="This acrylic monogram showcases your initials with bold clarity, smooth edges, and a premium glossy finish, creating a stylish, durable décor piece perfect for gifting, rooms, desks, and celebrations" />
              <ProductsByCategory category='Acrylic Monogram' Heading='Acrylic Monogram' />
        </Fragment>
    )
}

export default Acrylic_Monogram;