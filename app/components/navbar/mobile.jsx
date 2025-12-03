"use client"

import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { MenuIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const MobileNavbar = () => {
  return (
    <div className='lg:hidden flex items-center justify-center'>
      <Sheet>
        <SheetTrigger asChild>
          <MenuIcon size={32} className='text-orange-300 font-bold' />
        </SheetTrigger>
        <SheetContent className='bg-[#0a0d06] border-none text-white'>
          <SheetHeader className='hidden'>
            <SheetTitle>Edit profile</SheetTitle>

          </SheetHeader>
          <ul className='flex flex-col items-start pt-24 justify-center gap-8'>
            <li className='text-2xl font-bold pl-5'>
              <Link href="/">Home</Link>
            </li>
            <li className='text-2xl font-bold pl-5'>
              <Link href="/about">About Us</Link>
            </li>
            <li className='text-2xl font-bold pl-5'>
              <Link href="/catalog">Catalog</Link>
            </li>
            <li className='text-2xl font-bold pl-5'>
              <Link href="/contact">Contact</Link>
            </li>
          </ul>
          <SheetFooter>
            <p className='text-center mb-3 font-semibold'>FOLLOW US</p>
            <div className='w-full flex items-center justify-center gap-4'>
              <Link href="https://www.instagram.com/aplusadvertising/" target="_blank">
                <Image src="/instagram.png" alt="instagram" priority={true} width={40} height={30} />
              </Link>
              <Link href="https://www.facebook.com/aplusadvertising/" target="_blank">
                <Image src="/facebook.png" alt="facebook" priority={true} width={40} height={30} />
              </Link>
              <Link href="https://www.linkedin.com/company/aplusadvertising/" target="_blank">
                <Image src="/tiktok.png" alt="linkedin" priority={true} width={45} height={30} />
              </Link>
              <Link href="https://www.youtube.com/company/aplusadvertising/" target="_blank">
                <Image src="/youtube.png" alt="linkedin" priority={true} width={40} height={30} />
              </Link>
            </div>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  )
}

export default MobileNavbar
