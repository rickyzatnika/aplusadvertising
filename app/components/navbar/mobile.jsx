"use client"

import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { MenuIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'
import { useSession } from '@/app/components/providers/SessionProvider'
import AuthModal from '@/app/components/auth/AuthModal'

const MobileNavbar = () => {
  const { isAuthenticated, user, logout, loading } = useSession()
  const [open, setOpen] = useState(false)
  const [authOpen, setAuthOpen] = useState(false)

  const closeAnd = (fn) => {
    setOpen(false)
    setTimeout(() => fn && fn(), 250)
  }

  const MenuLink = ({ href, children }) => (
    <li className='text-2xl font-bold pl-5'>
      <Link href={href} onClick={() => setOpen(false)}>{children}</Link>
    </li>
  )

  return (
    <div className='lg:hidden flex items-center justify-center'>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <button aria-label='Open menu' className='p-2 rounded-md active:scale-95'>
            <MenuIcon size={32} className='text-[#141414] font-extrabold' />
          </button>
        </SheetTrigger>
        <SheetContent className='bg-[#0a0d06] border-none text-white'>
          <SheetHeader className='hidden'>
            <SheetTitle>Menu</SheetTitle>
          </SheetHeader>
          <ul className='flex flex-col items-start pt-24 justify-center gap-8'>
            <MenuLink href='/'>Home</MenuLink>
            <MenuLink href='/about'>About Us</MenuLink>
            <MenuLink href='/catalog'>Catalog</MenuLink>
            <MenuLink href='/contact'>Contact</MenuLink>
          </ul>
          <div className='mt-10 px-5'>
            {loading ? (
              <div className='w-full text-center bg-gray-200 text-gray-600 rounded-md py-2 text-sm'>Loading...</div>
            ) : isAuthenticated ? (
              <div className='flex items-center justify-between gap-3'>
                <span className='capitalize text-sm text-gray-200'>Hi, {user?.name || 'User'}</span>
                <button
                  onClick={() => closeAnd(logout)}
                  className='w-28 h-10 rounded-md bg-red-600 text-white text-sm active:scale-95'
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => closeAnd(() => setAuthOpen(true))}
                className='w-full h-11 rounded-md bg-white text-black font-semibold active:scale-95'
              >
                Login
              </button>
            )}
          </div>
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
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </div>
  )
}

export default MobileNavbar
