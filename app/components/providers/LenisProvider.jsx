'use client'

import React, { useEffect, useRef } from 'react'
import Lenis from 'lenis'

export default function LenisProvider({ children }) {
  const lenisRef = useRef(null)
  const rafRef = useRef(null)

  useEffect(() => {
    const isClient = typeof window !== 'undefined'
    const prefersReduced = isClient && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const isTouch = isClient && ('ontouchstart' in window || navigator.maxTouchPoints > 0)
    const lowCore = isClient && (navigator.hardwareConcurrency || 4) <= 4

    const disableOnMobile = isTouch && (prefersReduced || lowCore)

    const lenis = new Lenis({
      duration: disableOnMobile ? 0.4 : prefersReduced ? 0.5 : isTouch ? 0.7 : 1.0,
      easing: (t) => (disableOnMobile ? t : t), // keep linear to minimize CPU
      smoothWheel: !prefersReduced && !isTouch, // wheel smooth on desktop only
      smoothTouch: !prefersReduced && isTouch && !disableOnMobile,  // touch smooth only on capable devices
      syncTouch: !lowCore && !prefersReduced && !disableOnMobile,
      touchMultiplier: isTouch ? 1.0 : 1.2,
    })

    lenisRef.current = lenis

    let running = false
    const start = () => {
      if (running) return
      running = true
      const raf = (time) => {
        if (!running) return
        lenis.raf(time)
        rafRef.current = requestAnimationFrame(raf)
      }
      rafRef.current = requestAnimationFrame(raf)
    }
    const stop = () => {
      running = false
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }

    // Start only when visible and not disabled on mobile
    if (!prefersReduced && !disableOnMobile && (!isClient || document.visibilityState === 'visible')) {
      start()
    }
    const onVisibility = () => {
      if (document.visibilityState === 'visible') start()
      else stop()
    }
    isClient && document.addEventListener('visibilitychange', onVisibility)

    return () => {
      isClient && document.removeEventListener('visibilitychange', onVisibility)
      stop()
      lenis.destroy()
    }
  }, [])

  return children
}
