import React from 'react'
import GetInTouch from '@/app/components/section/contact'

export const metadata = {
  title: 'Kontak',
  description:
    'Hubungi Aplus Advertising untuk konsultasi signage, neon box, dan digital printing. Tim kami siap membantu kebutuhan Anda.',
  alternates: { canonical: '/contact' },
}

export default function ContactPage() {
  return (
    <div className='bg-[#ffbd2d]'>
      <GetInTouch />
    </div>
  )
}
