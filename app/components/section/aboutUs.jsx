'use client'

import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'
import React, { useRef } from 'react'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'

const AboutUs = () => {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })

  // Parallax accents (lebih lambat dan halus)
  const yAccentRaw = useTransform(scrollYProgress, [0, 1], [0, -40])
  const yAccent = useSpring(yAccentRaw, { stiffness: 60, damping: 24 })

  // Parallax image (lebih lambat dan halus)
  const yImageRaw = useTransform(scrollYProgress, [0, 1], [0, -80])
  const yImage = useSpring(yImageRaw, { stiffness: 60, damping: 24 })

  return (
    <section ref={ref} className='w-full py-8 lg:py-14 relative overflow-hidden'>
      <motion.div aria-hidden className=' absolute left-0 top-0 -z-10  origin-top-left opacity-20' style={{ y: yAccent }}>
        <Image src="/kotak.png" alt="about-us" priority={true} width={300} height={100} />
      </motion.div>
      <div className='w-full h-full flex flex-col items-start justify-center gap-4 py-8 md:py-16 px-4 md:px-14 lg:px-24 xl:px-32 2xl:px-40 relative'>
        <motion.div className='w-full flex flex-col md:flex-row gap-0 lg:gap-8 item-center md:item-start justify-between' initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.4 }} transition={{ duration: 0.9 }}>
          <div className=' w-full h-screen md:h-full flex gap-1 md:gap-6 flex-col items-start justify-evenly'>
            <div className='flex flex-col gap-2'>
              <p className='text-white text-md font-bold'>Innovate</p>
              <h1 className='text-white text-4xl md:text-5xl lg:text-7xl font-semibold  relative z-10 mb-3'>About Us </h1>
              <p className='text-white text-md'> 
                Aplus Advertising adalah perusahaan yang bergerak di bidang produksi visual dan kebutuhan branding, yang berfokus pada pembuatan berbagai media promosi seperti akrilik custom, signage, serta printing berkualitas tinggi. Kami hadir untuk membantu UMKM, event, hingga bisnis dalam menampilkan identitas brand secara lebih profesional dan menarik.  
              </p>
              <p className='text-white text-md'>
                Didukung dengan mesin produksi sendiri seperti UV Flatbed Printing, kami memastikan setiap produk yang dihasilkan memiliki detail yang tajam, warna yang solid, serta daya tahan yang optimal. Seluruh proses produksi kami kerjakan secara langsung untuk menjaga kualitas sekaligus memberikan harga yang tetap kompetitif.
              </p>
               <p className='text-white text-md'>
                Kami telah dipercaya untuk menangani berbagai kebutuhan produksi, termasuk oleh brand besar seperti Gojek, dalam pembuatan merchandise dan material branding.
              </p>
              <p className='text-white text-md'>
                Bagi kami, setiap brand memiliki kebutuhan yang berbeda. Karena itu, Aplus Advertising berkomitmen untuk memberikan solusi yang fleksibel, mulai dari produksi dalam jumlah kecil hingga skala besar, dengan hasil yang tetap konsisten dan berkualitas.
              </p>
              <p className='text-white text-md'>
                Kami percaya bahwa visual yang kuat bukan hanya menarik perhatian, tetapi juga mampu meningkatkan kepercayaan dan nilai sebuah brand. Itulah mengapa kami hadir sebagai partner produksi yang siap membantu mewujudkan kebutuhan branding Anda secara maksimal.
              </p>
            </div>
            <div className='flex items-center gap-8  '>
              <Link href="/contact">
                <Button className='bg-[#ffbd2d] text-[#0E121D] uppercase cursor-pointer hover:bg-[#faa51b]/50 hover:text-black'>Contact Us</Button>
              </Link>

            </div>
          </div>
          <motion.div className='w-full h-full' style={{ y: yImage }}>
            <Image src="/about-us.jpg" alt="about-us" priority={true} width={750} height={500} className='rounded-2xl object-contain'  />
          </motion.div>
        </motion.div>
      </div>

    </section>
  )
}

export default AboutUs
