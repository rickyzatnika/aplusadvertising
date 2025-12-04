'use client'

import { usePathname } from 'next/navigation'

export default function AdminLayout({ children }) {
  const pathname = usePathname()
  const linkBase = 'px-3 py-2 rounded-md border transition font-medium'
  const active = 'bg-black text-white border-black shadow-sm'
  const inactive = 'text-gray-700 hover:bg-gray-100 hover:text-black'

  function isActive(href, exact = false) {
    if (exact) return pathname === href
    return pathname?.startsWith(href)
  }
  function cls(href, exact = false) {
    return `${linkBase} ${isActive(href, exact) ? active : inactive}`
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
