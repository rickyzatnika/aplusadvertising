import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import MobileNavbar from './mobile'

const Navbar = () => {
  return (

    <nav className='w-full flex items-center justify-between h-20 lg:h-24 px-4 md:px-14 lg:px-24 xl:px-32 2xl:px-40 bg-white/90  '>
      <Link href="/">
        <Image src="/logo.png" alt='logo-aplusadvertising' priority={true} width={150} height={100} />
      </Link>
      <ul className='hidden lg:flex uppercase items-center justify-center gap-8 text-md font-semibold text-[#0E121D]'>
        <li>
          <Link href="/">Home</Link>
        </li>
        <li>
          <Link href="/about">About Us</Link>
        </li>
        <li>
          <Link href="/catalog">Catalog</Link>
        </li>
        <li>
          <Link href="/contact">
            Contact
          </Link>
        </li>
      </ul>
      {/* Whatsapp Button */}
      <Link href="https://wa.me/6281214707415" target="_blank" className=' bg-[#25D366] text-sm lg:text-md text-white rounded-lg hover:bg-[#128C7E] transition-colors duration-300'>
        <button className='px-2 py-1.5 lg:px-4 lg:py-2 '>Chat On Whatsapp</button>
      </Link>
      {/* Mobile Navbar */}
      <MobileNavbar />
    </nav>
  )
}

export default Navbar
