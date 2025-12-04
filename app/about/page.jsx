import React from 'react'
import AboutSection from '@/app/components/section/aboutUs'

export const metadata = {
  title: 'Tentang Kami',
  description:
    'Kenali Aplus Advertising: partner tepercaya sejak 2015 di bidang periklanan dan komunikasi visual untuk berbagai brand dan instansi.',
  alternates: { canonical: '/about' },
}

export default function AboutPage() {
  return (
    <div className='bg-[#0E121D]'>
      <AboutSection />
    </div>
  )
}
