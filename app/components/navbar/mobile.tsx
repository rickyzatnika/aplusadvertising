import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { MenuIcon } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const MobileNavbar = () => {
  return (
    <div className='md:hidden  flex items-center justify-center'>
      <Sheet>
        <SheetTrigger asChild>
          <MenuIcon size={32} className='text-orange-300 font-bold' />
        </SheetTrigger>
        <SheetContent className='bg-[#0E121D] border-none text-white'>
          <SheetHeader className='hidden'>
            <SheetTitle>Edit profile</SheetTitle>
            <SheetDescription>
              Make changes to your profile here. Click save when youre done.
            </SheetDescription>
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
            <p>FOLLOW US</p>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  )
}

export default MobileNavbar
