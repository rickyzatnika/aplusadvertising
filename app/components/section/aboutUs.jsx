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
      <div className='w-full h-full flex flex-col items-center justify-center gap-4 py-8 md:py-16 px-4 md:px-14 lg:px-24 xl:px-32 2xl:px-40 relative'>
        <motion.div className='w-full flex flex-col md:flex-row gap-0 lg:gap-8 item-center md:item-start justify-between' initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.4 }} transition={{ duration: 0.9 }}>
          <div className=' w-full h-screen flex flex-col items-start justify-evenly'>
            <div className='flex flex-col gap-2'>
              <p className='text-white text-md font-bold'>Innovate</p>
              <h1 className='text-white text-4xl md:text-5xl lg:text-7xl font-semibold  relative z-10 mb-3'>About Us </h1>
              <p className='text-white text-md'> <span className='font-bold'>Aplus Advertising</span> adalah perusahaan yang
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
                <Button className='bg-[#ffbd2d] text-[#0E121D] uppercase cursor-pointer hover:bg-[#faa51b]/50 hover:text-black'>Contact Us</Button>
              </Link>

            </div>
          </div>
          <motion.div className='w-full h-full' style={{ y: yImage }}>
            <Image src="/about.jpg" alt="about-us" priority={true} width={1200} height={900} className='rounded-2xl' />
          </motion.div>
        </motion.div>
      </div>

    </section>
  )
}

export default AboutUs
