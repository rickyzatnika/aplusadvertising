import Image from 'next/image'
import React from 'react'

const AboutUs = () => {
  return (
    <div className='w-full py-8 lg:py-14'>

      <div className='w-full h-full flex flex-col items-center justify-center gap-4 py-8 md:py-16 px-4 md:px-14 lg:px-24 xl:px-32 2xl:px-40 relative'>
        <div className='w-full flex flex-col md:flex-row gap-8 item-center md:item-start justify-between'>
          <div className=' w-full h-screen flex flex-col items-start justify-around'>
            <div className='flex flex-col gap-2'>
              <p className='text-white text-md font-bold'>Innovate</p>
              <h1 className='text-white text-4xl md:text-5xl lg:text-7xl font-semibold  relative z-10'>About Us </h1>
              <p className='text-white text-md'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Et cum nemo beatae natus magnam non fuga, perferendis nulla? Iure voluptatem veniam corporis earum, corrupti tempora sunt nobis explicabo dolorem debitis repellat error aut ratione placeat cupiditate officiis temporibus aliquam impedit cumque incidunt fuga. Porro natus perferendis ratione rerum, fugit hic?</p>
            </div>
            <div className='flex items-center text-white '>
              <div>A</div>
              <div>B</div>
            </div>
          </div>
          <div className='w-full h-full'>
            <Image src="/kotak.png" alt="about-us" priority={true} width={900} height={600} />
          </div>
        </div>
      </div>

    </div>
  )
}

export default AboutUs
