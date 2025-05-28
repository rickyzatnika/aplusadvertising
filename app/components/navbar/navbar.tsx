import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import MobileNavbar from './mobile'
import { Button } from '@/components/ui/button'

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
            <Button className='bg-[#ffbd2d] text-[#0E121D] uppercase cursor-pointer hover:bg-[#faa51b]/50 hover:text-black'>Contact</Button>
          </Link>
        </li>
      </ul>
      {/* Mobile Navbar */}
      <MobileNavbar />
    </nav>
  )
}

export default Navbar
