'use client'

import { services } from '@/lib/data'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: 'easeOut' }
  }
}

const cardsVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.25
    }
  }
}

const cardVariant = {
  hidden: { opacity: 0, y: 24, scale: 0.98 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.75, ease: 'easeOut' } }
}

const OurServices = () => {
  return (
    <section className='w-full bg-white py-8 lg:py- relative overflow-hidden'>
      <motion.div aria-hidden className='w-[720px] h-[720px] rounded-full bg-gradient-to-tr from-[#f7a619] to-indigo-400  absolute  bottom-0 mx-auto blur-2xl opacity-65 translate-x-1/2 translate-y-1/2 ' initial={{ opacity: 0 }} whileInView={{ opacity: 0.65 }} viewport={{ once: true }} transition={{ duration: 1.2 }} />

      <div className='w-full h-full flex flex-col items-center justify-center gap-4 py-8 md:py-16 px-4 md:px-14 lg:px-24 xl:px-32 2xl:px-40 relative z-20'>
        <motion.div className='w-full flex flex-col md:flex-row gap-8 item-center md:item-start justify-between' variants={containerVariants} initial='hidden' whileInView='show' viewport={{ once: true, amount: 0.4 }}>
          <div className=' w-full '>
            <p className='text-md font-bold'>Innovate</p>
            <h1 className='text-4xl md:text-5xl lg:text-7xl font-semibold  relative z-10'>Our <span className='font-extrabold text-[#f7a619]'>Services </span></h1>
          </div>

          <p className='text-lg text-accent-foreground/80 font-semibold leading-relaxed w-full md:Lw-[70%] ml-auto '>Kami menyediakan layanan jasa print 3D
            profesional dengan teknologi mutakhir dan
            hasil berkualitas tinggi. Baik untuk
            kebutuhan prototyping, produksi custom,
            edukasi, hingga proyek kreatif, layanan kami
            siap membantu mewujudkan ide Anda
            menjadi kenyataan.</p>

        </motion.div>
        <motion.div className='w-full flex flex-col lg:flex-row gap-8 items-center justify-between py-12 ' variants={cardsVariants} initial='hidden' whileInView='show' viewport={{ once: true, amount: 0.35 }}>
          {
            services.map((service, index) => (
              <motion.div key={index} variants={cardVariant} className='w-full h-72  flex flex-col gap-4 bg-[#f7a619] shadow-lg rounded-lg p-4 md:p-8 hover:shadow-xl transition-shadow'>
                <Image src={service.icon} alt="icons" priority={true} width={40} height={40} />
                <h2 className=' text-3xl font-bold'>{service.title}</h2>
                <p className=' text-md font-semibold text-accent-foreground/80 leading-relaxed'>{service.desc}</p>
              </motion.div>
            ))
          }
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
          <Link href="/catalog" className=' px-6 py-3 border text-[#0E121D] border-[#0E121D]  font-semibold rounded-lg hover:bg-[#f7a619] hover:border-[#f7a619] hover:shadow-lg hover:text-white transition-colors duration-300 flex items-center justify-center mx-auto mt-8'>
            Explore Our Catalog
          </Link>
        </motion.div>
      </div>

    </section>
  )
}

export default OurServices
