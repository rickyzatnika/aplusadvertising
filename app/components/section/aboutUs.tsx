import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const AboutUs = () => {
  return (
    <div className='w-full py-8 lg:py-14 relative overflow-hidden'>
      <div className=' absolute left-0 top-0 -z-10  origin-top-left opacity-20'>
        <Image src="/kotak.png" alt="about-us" priority={true} width={300} height={100} />
      </div>
      <div className='w-full h-full flex flex-col items-center justify-center gap-4 py-8 md:py-16 px-4 md:px-14 lg:px-24 xl:px-32 2xl:px-40 relative'>
        <div className='w-full flex flex-col md:flex-row gap-0 lg:gap-8 item-center md:item-start justify-between'>
          <div className=' w-full h-screen flex flex-col items-start justify-evenly'>
            <div className='flex flex-col gap-2'>
              <p className='text-white text-md font-bold'>Innovate</p>
              <h1 className='text-white text-4xl md:text-5xl lg:text-7xl font-semibold  relative z-10'>About Us </h1>
              <p className='text-white text-md'> APlus Advertising adalah perusahaan yang
                bergerak di bidang periklanan dan komunikasi
                visual, hadir untuk membantu brand Anda tampil
                menonjol di tengah persaingan pasar yang
                semakin dinamis. Berdiri sejak tahun [Tahun
                Berdiri], kami telah menjadi mitra terpercaya
                berbagai perusahaan, instansi, dan pelaku usaha
                dalam membangun citra serta menjangkau
                audiens yang tepat.</p> <br />
              <p className='text-white text-md'>
                Dengan tim yang profesional, kreatif, dan
                berpengalaman, A Plus Advertising menghadirkan
                solusi iklan yang inovatif, efektif, dan tepat
                sasaran—mulai dari media luar ruang (outdoor),
                digital advertising, hingga strategi branding yang
                komprehensif.
                Kami percaya bahwa setiap brand memiliki cerita
                unik. Tugas kami adalah mengubah cerita itu
                menjadi pesan visual yang kuat dan berkesan.
              </p>
            </div>
            <div className='flex items-center gap-8 '>
              <Link href="/contact">
                <Button className='bg-[#ffbd2d] text-[#0E121D] uppercase cursor-pointer hover:bg-[#faa51b]/50 hover:text-black'>About Us</Button>
              </Link>

            </div>
          </div>
          <div className='w-full h-full'>
            <Image src="/about.jpg" alt="about-us" priority={true} width={1200} height={900} className='rounded-2xl' />
          </div>
        </div>
      </div>

    </div>
  )
}

export default AboutUs
