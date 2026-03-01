import Hero2 from '@/components/section/Hero2';
import ProductsByCategory from '@/components/section/Products';
import React, { Fragment } from 'react'
import Sidebar from '@/components/section/Sidebar';

// export const metadata ={
//   title:'Acrylic Desk Photo'
// }

const Acrylic_Desk_Photo = () => {
    return (
        <Fragment>
            <Hero2 title="Acrylic Desk Photo" subtitle="Elegant desktop display" tagline="This acrylic desk photo showcases your memories with vivid clarity, a glossy finish, and a sturdy stand, creating a modern, eye-catching display perfect for workspaces, homes, and gifting" />

            <ProductsByCategory category='Acrylic Desk Photo' Heading='Acrylic Desk Photo' />
        </Fragment>
    )
}

export default Acrylic_Desk_Photo;