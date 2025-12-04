import { listProducts } from '@/lib/catalog'
import CategoryBarChart from './components/CategoryBarChart'

export const dynamic = 'force-dynamic'

export default async function AdminDashboardPage() {
  const result = await listProducts()
  const products = result?.success && Array.isArray(result.products) ? result.products : []
  const total = products.length
  const available = products.filter((p) => p && p.available).length
  const categories = Array.from(new Set(products.map((p) => (p?.category || '').trim()).filter(Boolean)))
  const categoryCount = categories.length

  // Aggregate category counts for chart
  const categoryMap = new Map()
  for (const p of products) {
    const cat = (p?.category || '').trim()
    if (!cat) continue
    categoryMap.set(cat, (categoryMap.get(cat) || 0) + 1)
  }
  const chartData = Array.from(categoryMap.entries()).map(([label, value]) => ({ label, value }))

  return (
    <div className='w-full h-full'>
      <div className='flex items-center justify-between mb-6'>
        <h1 className='text-2xl md:text-3xl font-bold'>Dashboard</h1>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        <div className='border rounded-lg p-4'>
          <div className='text-sm text-accent-foreground/70'>Total Produk</div>
          <div className='text-3xl font-extrabold'>{total}</div>
        </div>
        <div className='border rounded-lg p-4'>
          <div className='text-sm text-accent-foreground/70'>Produk Tersedia</div>
          <div className='text-3xl font-extrabold'>{available}</div>
        </div>
        <div className='border rounded-lg p-4'>
          <div className='text-sm text-accent-foreground/70'>Kategori</div>
          <div className='text-3xl font-extrabold'>{categoryCount}</div>
        </div>
      </div>

      <div className='mt-6'>
        <CategoryBarChart data={chartData} />
      </div>
    </div>
  )
}
