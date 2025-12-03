export default function AdminDashboardPage() {
  return (
    <div className='w-full h-full p-4 md:p-8'>
      <div className='flex items-center justify-between mb-6'>
        <h1 className='text-2xl md:text-3xl font-bold'>Dashboard</h1>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        <div className='border rounded-lg p-4'>
          <div className='text-sm text-accent-foreground/70'>Total Produk</div>
          <div className='text-3xl font-extrabold'>--</div>
        </div>
        <div className='border rounded-lg p-4'>
          <div className='text-sm text-accent-foreground/70'>Produk Tersedia</div>
          <div className='text-3xl font-extrabold'>--</div>
        </div>
        <div className='border rounded-lg p-4'>
          <div className='text-sm text-accent-foreground/70'>Kategori</div>
          <div className='text-3xl font-extrabold'>--</div>
        </div>
      </div>

      <div className='mt-6 border rounded-lg p-4 min-h-[200px] flex items-center justify-center text-accent-foreground/70'>
        Grafik/Charts placeholder. (Dapat diintegrasi dengan chart library)
      </div>
    </div>
  )
}
