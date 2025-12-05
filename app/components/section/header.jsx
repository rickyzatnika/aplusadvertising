'use client'

import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'
import React, { useRef } from 'react'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'

const Header = () => {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })

  // Parallax for hero image (moves slower than scroll)
  const yImageRaw = useTransform(scrollYProgress, [0, 1], [0, 100])
  const yImage = useSpring(yImageRaw, { stiffness: 60, damping: 24 })

  // Background decorative blob parallax (even slower)
  const yBlobRaw = useTransform(scrollYProgress, [0, 1], [0, 60])
  const yBlob = useSpring(yBlobRaw, { stiffness: 60, damping: 24 })

  return (
    <section ref={ref} className='w-full h-full flex flex-col lg:flex-row items-center justify-center gap-2 py-8 md:py-16 relative px-4 md:px-14 lg:px-24 xl:px-32 2xl:px-40 overflow-hidden'>
      <motion.div aria-hidden className='absolute -z-10 bottom-[-120px] right-[-120px] w-[520px] h-[520px] rounded-full bg-gradient-to-tr from-[#f7a619] to-indigo-500 blur-3xl opacity-40' style={{ y: yBlob }} />

      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1.0, ease: 'easeOut' }}
        className=' flex flex-col py-3 gap-4 w-full lg:w-[50%] '
      >
        <h1 className='text-white text-4xl md:text-5xl lg:text-7xl leading-tight'>
          Transforming Ideas Into Impactful <span className='font-extrabold text-[#f7a619]'>Advertising</span> Solutions
        </h1>
        <p className='text-white/80 text-md '>
          A Plus Advertising adalah perusahaan yang bergerak di bidang periklanan dan promosi, menyediakan berbagai layanan kreatif untuk mendukung kebutuhan branding, marketing, dan kampanye visual Anda.
        </p>
        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
          <Button variant='outline' size="lg" className='bg-[#f7a619] text-black hover:bg-[#f7a619]/90 mt-4 w-fit outline-none border-none text-lg'>
            <Link href="https://wa.me/6281214707415" target='_blank'>About Us</Link>
          </Button>
        </motion.div>
      </motion.div>

      <motion.div className='w-full lg:w-[1200px] xl:w-[800px] h-auto flex items-center justify-center' style={{ y: yImage }}>
        <Image src="/hero.png" alt='aplusadv-image' priority={true} width={800} height={475} className='w-full scale-90 object-contain' />
      </motion.div>
    </section>
  )
}

export default Header
