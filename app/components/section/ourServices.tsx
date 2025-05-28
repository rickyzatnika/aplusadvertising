import { services } from '@/lib/data'
import Image from 'next/image'
import React from 'react'






const OurServices = () => {
  return (
    <div className='w-full bg-white py-8 lg:py-14'>

      <div className='w-full h-full flex flex-col items-center justify-center gap-4 py-8 md:py-16 px-4 md:px-14 lg:px-24 xl:px-32 2xl:px-40 relative'>
        <div className='w-full flex flex-col md:flex-row gap-8 item-center md:item-start justify-between'>
          <div className=' w-full '>
            <p className='text-md font-bold'>Innovate</p>
            <h1 className='text-4xl md:text-5xl lg:text-7xl font-semibold  relative z-10'>Our Core <span className='font-extrabold text-[#f7a619]'>Services </span></h1>
          </div>

          <p className='text-md text-accent-foreground/80 font-semibold leading-relaxed w-full md:Lw-[70%] ml-auto '>At APLUS ADVERTISING, we specialize in tailored marketing solution that elevate your brand. Our dedicate team combines creativity with strategy to deliver impactful result. Discover how our services can transform your business.</p>

        </div>
        <div className='w-full flex flex-col lg:flex-row gap-8 items-center justify-between py-12 '>
          {
            services.map((service, index) => (
              <div key={index} className='w-full h-72  flex flex-col gap-4 bg-[#f7a619] shadow-lg rounded-lg p-4 md:p-8'>
                <Image src={service.icon} alt="icons" priority={true} width={40} height={40} />
                <h2 className=' text-3xl font-bold'>{service.title}</h2>
                <p className=' text-md font-semibold text-accent-foreground/80 leading-relaxed'>{service.desc}</p>
              </div>
            ))
          }
        </div>
      </div>

    </div>
  )
}

export default OurServices
