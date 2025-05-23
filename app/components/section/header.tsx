import { Button } from '@/components/ui/button'
import Image from 'next/image'
import React from 'react'

const Header = () => {
  return (
    <div className='w-full h-full flex items-center justify-between gap-8 py-4 px-4 md:px-24 lg:px-32 relative'>
      <div className='absolute bottom-0 left-0 w-full h-full -z-10 bg-gradient-to-tr from-[#000000] to-transparent ' />
      <div className=' flex flex-col gap-4'>
        <h1 className='text-white text-7xl font-bold'>APLUS ADVERTISING</h1>
        <p className='text-white/70 text-xl '>adalah perusahaan yang
          bergerak di bidang periklanan dan komunikasi
          visual, hadir untuk membantu brand Anda tampil
          menonjol di tengah persaingan pasar yang
          semakin dinamis.</p>
        <Button variant='outline' size="lg" className='bg-white/90 text-black hover:bg-white/80 mt-4 w-fit text-lg'>
          <a href="https://wa.me/6281212345678" target='_blank'>Contact Us</a>
        </Button>
      </div>
      <div className='w-full'>
        <Image src="/hero.png" alt='aplusadv-image' priority={true} width={800} height={475} className='w-full scale-90s object-contain' />
      </div>
    </div>
  )
}

export default Header
