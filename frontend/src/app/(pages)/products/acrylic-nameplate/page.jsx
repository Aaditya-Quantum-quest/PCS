import Hero2 from '@/components/section/Hero2';
import ProductsByCategory from '@/components/section/Products';
import React, { Fragment } from 'react'
import Sidebar from '@/components/section/Sidebar';
import NamePlateShowcase from '@/components/acrylic-nameplate/NameplateShowcase';

// export const metadata ={
//   title:'Acrylic Nameplate'
// }


const Acrylic_NamePlate = () => {
  return (
    <Fragment>
      <Sidebar />
      {/* <Hero2 title="Acrylic Nameplate" productType="acrylic-nameplate" subtitle="Stylish identity display" tagline="This acrylic nameplate delivers vivid clarity, smooth polished edges, and a premium glossy finish, creating a modern, durable identity display perfect for homes, offices, desks, entrances, and gifting" />
      <ProductsByCategory category='Acrylic Nameplate' Heading='Acrylic Nameplate' /> */}
      <NamePlateShowcase />
    </Fragment>
  )
}

export default Acrylic_NamePlate;