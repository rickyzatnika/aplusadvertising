'use client'

import { useSession } from '@/app/components/providers/SessionProvider'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLayout({ children }) {
  const { user, loading, isAuthenticated } = useSession()
  const router = useRouter()

  useEffect(() => {
    // Client-side check for admin access
    if (!loading && (!isAuthenticated || user?.role !== 'admin')) {
      router.replace('/?error=access_denied')
    }
  }, [loading, isAuthenticated, user, router])

  const linkBase = 'px-3 py-2 rounded-md border transition font-medium'
  const active = 'bg-black text-white border-black shadow-sm'
  const inactive = 'text-gray-700 hover:bg-gray-100 hover:text-black'

  function isActive(href, exact = false) {
    const current = typeof window !== 'undefined' ? window.location.pathname : ''
    if (exact) return current === href
    return current?.startsWith(href)
  }
  function cls(href, exact = false) {
    return `${linkBase} ${isActive(href, exact) ? active : inactive}`
  }

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memverifikasi akses...</p>
        </div>
      </div>
    )
  }

  // Don't render admin content if not authenticated or not admin
  if (!isAuthenticated || user?.role !== 'admin') {
    return null
  }

  return (
    <div className="min-h-screen w-full grid grid-cols-1 md:grid-cols-[260px_1fr]">
      <aside className="border-r bg-white p-4 md:p-6 flex md:flex-col gap-4 items-center md:items-stretch">
        <div className="text-2xl font-extrabold tracking-tight">Dashboard</div>
        <nav className="flex gap-3 md:flex-col md:gap-2 w-full">
          <a href="/admin/dashboard" className={cls('/admin/dashboard', true)}>Dashboard</a>
          <a href="/admin/dashboard/catalog" className={cls('/admin/dashboard/catalog')}>Catalog</a>
        </nav>
      </aside>
      <main className="bg-white min-h-screen p-4 md:p-8">{children}</main>
    </div>
  )
}
