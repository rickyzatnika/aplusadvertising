"use client"

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

export default function WhatsappButton() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    let lastY = 0
    const onScroll = () => {
      const y = window.scrollY
      // Show when user scrolls down some distance
      if (y > 120 && y > lastY) {
        setVisible(true)
      }
      // Hide near top
      if (y < 40) {
        setVisible(false)
      }
      lastY = y
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="fixed right-4 bottom-4 z-40"
        >
          <Link
            href="https://wa.me/6281214707415"
            target="_blank"
            className="block rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            aria-label="Whatsapp Chat"
          >
            <Image src="/whatsapp.png" alt="whatsapp" width={56} height={56} priority />
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
