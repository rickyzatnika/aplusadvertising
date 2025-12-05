'use client'

import React, { useEffect, useRef } from 'react'
import Lenis from 'lenis'

export default function LenisProvider({ children }) {
  const lenisRef = useRef(null)
  const rafRef = useRef(null)

  useEffect(() => {
    // Respect reduced motion
    const prefersReduced = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const lenis = new Lenis({
      duration: prefersReduced ? 0.6 : 1.0, // overall smoothing
      easing: (t) => 1 - Math.pow(1 - t, 2), // easeOutQuad
      smoothWheel: !prefersReduced,
      smoothTouch: !prefersReduced,
      syncTouch: true,
      touchMultiplier: 1.2,
    })

    lenisRef.current = lenis

    const raf = (time) => {
      lenis.raf(time)
      rafRef.current = requestAnimationFrame(raf)
    }

    rafRef.current = requestAnimationFrame(raf)

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      lenis.destroy()
    }
  }, [])

  return children
}
