export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen w-full grid grid-cols-1 md:grid-cols-[260px_1fr]">
      <aside className="border-r bg-white p-4 md:p-6 flex md:flex-col gap-3 items-center md:items-stretch">
        <div className="text-xl font-extrabold">Admin</div>
        <nav className="flex gap-3 md:flex-col md:gap-2 ml-auto md:ml-0">
          <a href="/admin/dashboard" className="px-3 py-2 rounded-md border hover:bg-gray-100">Dashboard</a>
          <a href="/admin/dashboard/catalog" className="px-3 py-2 rounded-md border hover:bg-gray-100">Catalog</a>
        </nav>
      </aside>
      <main className="bg-white min-h-screen">{children}</main>
    </div>
  )
}
