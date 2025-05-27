import { services } from '@/lib/data'
import Image from 'next/image'
import React from 'react'






const OurServices = () => {
  return (
    <div className='w-full h-full flex flex-col items-center justify-center gap-4 py-8 md:py-16  '>
      <div className='w-full flex flex-col md:flex-row gap-8 item-center md:item-start justify-between'>
        <div className='text-white w-full'>
          <p className='text-md font-bold'>Innovate</p>
          <h1 className='text-4xl md:text-5xl lg:text-7xl font-semibold'>Our Core Services That Drive Succcess</h1>
        </div>
        <div>
          <p className='text-white/90 text-md leading-relaxed w-full md:Lw-[70%] ml-auto'>At APLUS ADVERTISING, we specialize in tailored marketing solution that elevate your brand. Our dedicate team combines creativity with strategy to deliver impactful result. Discover how our services can transform your business.</p>
        </div>
      </div>
      <div className='w-full flex flex-col md:flex-row gap-8 items-center justify-between py-12 '>
        {
          services.map((service, index) => (
            <div key={index} className='w-full flex flex-col gap-4 bg-gray-200 rounded-lg p-4'>
              <Image src={service.icon} alt="icons" priority={true} width={40} height={40} />
              <h2 className='text-white text-3xl font-semibold'>{service.title}</h2>
              <p className='text-white/90 text-md leading-relaxed'>{service.desc}</p>
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default OurServices
