import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const Navbar = () => {
  return (

    <nav className='w-full flex items-center justify-between h-24 p-4 bg-white/90 backdrop-blur-md '>
      <Link href="/">
        <Image src="/logo.png" alt='logo-aplusadvertising' priority={true} width={150} height={100} />
      </Link>
      <ul className='flex items-center justify-center gap-8'>
        <li>
          <Link href="">Home</Link>
        </li>
        <li>
          <Link href="">About Us</Link>
        </li>
        <li>
          <Link href="">Catalog</Link>
        </li>
        <li>
          <Link href="">Contact</Link>
        </li>
      </ul>
    </nav>

  )
}

export default Navbar
