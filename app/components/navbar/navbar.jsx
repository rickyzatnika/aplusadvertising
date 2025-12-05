'use client'

import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useRef, useState } from 'react'
import MobileNavbar from './mobile'
import { motion } from 'framer-motion'
import AuthModal from '@/app/components/auth/AuthModal'
import { useSession } from '@/app/components/providers/SessionProvider'
import { usePathname } from 'next/navigation'

const Navbar = () => {
  const { user, logout, isAuthenticated, loading } = useSession()
  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About Us' },
    { href: '/catalog', label: 'Catalog' },
    { href: '/contact', label: 'Contact' },
  ]

  const [hidden, setHidden] = useState(false)
  const lastYRef = useRef(0)
  const tickingRef = useRef(false)
  const pathname = usePathname()

  const isDashboard = pathname?.startsWith('/admin')

  useEffect(() => {
    lastYRef.current = window.scrollY
    const onScroll = () => {
      const update = () => {
        const y = window.scrollY
        const lastY = lastYRef.current
        const delta = y - lastY

        // Always show near top
        if (y < 10) {
          setHidden(false)
        } else {
          const threshold = 4
          if (delta > threshold) {
            // scrolling down
            setHidden(true)
          } else if (delta < -threshold) {
            // scrolling up
            setHidden(false)
          }
        }
        lastYRef.current = y
        tickingRef.current = false
      }
      if (!tickingRef.current) {
        window.requestAnimationFrame(update)
        tickingRef.current = true
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const [authOpen, setAuthOpen] = useState(false)

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: hidden ? -80 : 0, opacity: hidden ? 0 : 1 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className={`${isDashboard ? 'bg-yellow-400' : 'bg-white'} fixed top-0 left-0 right-0 z-50 w-full flex items-center justify-between h-20 lg:h-24 px-4 md:px-14 lg:px-24 xl:px-32 2xl:px-40  backdrop-blur  shadow-sm`}
      >
        <Link href="/">
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
            <Image src="/logo.png" alt='logo-aplusadvertising' priority={true} width={150} height={100} />
          </motion.div>
        </Link>

        <ul className='hidden lg:flex uppercase items-center justify-center gap-8 text-md font-semibold text-[#141414]'>
          {navItems?.map((item) => (
            <motion.li key={item?.href} whileHover={{ y: -2 }}>
              <Link href={item?.href} className='relative group'>
                <span>{item?.label}</span>
                <span className='absolute left-0 -bottom-1 h-[2px] w-0 bg-[#f7a619] transition-all duration-300 group-hover:w-full' />
              </Link>
            </motion.li>
          ))}
        </ul>

        {/* Auth Section */}
        {loading ? (
          <div className='hidden md:inline-block bg-gray-200 text-gray-500 text-sm lg:text-md rounded-lg px-4 py-2'>
            Loading...
          </div>
        ) : isAuthenticated ? (
          <div className='hidden md:flex items-center gap-3'>
            <span className='text-sm text-gray-700'>
              Hi, {user?.name || 'User'}
            </span>
            <motion.button
              onClick={logout}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className='bg-red-600 text-white text-sm lg:text-md rounded-lg hover:opacity-90 px-4 py-2'
            >
              Logout
            </motion.button>
          </div>
        ) : (
          <motion.button
            onClick={() => setAuthOpen(true)}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className='hidden md:inline-block bg-[#0E121D] text-white text-sm lg:text-md rounded-lg hover:opacity-90 px-4 py-2'
          >
            Login
          </motion.button>
        )}

        {/* Mobile Navbar */}
        <MobileNavbar />
      </motion.nav>

      {/* Auth Modal */}
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  )
}

export default Navbar
