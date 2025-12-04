import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const Header = () => {
  return (
    <div className='w-full h-full flex flex-col lg:flex-row items-center justify-center gap-2 py-8 md:py-16 relative px-4 md:px-14 lg:px-24 xl:px-32 2xl:px-40'>
      {/* <div className='absolute bottom-0 left-0 w-full h-full -z-10 bg-gradient-to-tr from-[#000000] to-transparent ' /> */}
      <div className=' flex flex-col py-3 gap-4 w-full lg:w-[50%] '>
        <h1 className='text-white text-4xl md:text-5xl lg:text-7xl leading-tight'>Transforming Ideas Into Impactful <span className='font-extrabold text-[#f7a619]'>Advertising</span> Solutions</h1>
        <p className='text-white/80 text-md '>A Plus Advertising adalah perusahaan yang
          bergerak di bidang periklanan dan promosi,
          menyediakan berbagai layanan kreatif
          untuk mendukung kebutuhan branding,
          marketing, dan kampanye visual Anda. </p>
        <Button variant='outline' size="lg" className='bg-[#f7a619] text-black hover:bg-[#f7a619]/90 mt-4 w-fit outline-none border-none text-lg'>
          <Link href="https://wa.me/6281214707415" target='_blank'>About Us</Link>
        </Button>
      </div>
      <div className='w-full lg:w-[1200px] xl:w-[800px] h-auto flex items-center justify-center'>
        <Image src="/hero.png" alt='aplusadv-image' priority={true} width={800} height={475} className='w-full scale-90 object-contain' />
      </div>
    </div>
  )
}

export default Header
