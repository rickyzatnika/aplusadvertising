import Image from 'next/image'
import Link from 'next/link'
import { listProducts } from '@/lib/catalog'

export async function generateMetadata() {
  const base = new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000')
  const title = 'Katalog Produk'
  const description = 'Jelajahi katalog produk Aplus Advertising: signage, neon box, digital printing, dan layanan kreatif lainnya.'
  return {
    title,
    description,
    alternates: { canonical: '/catalog' },
    openGraph: {
      title,
      description,
      url: new URL('/catalog', base).toString(),
      images: [{ url: '/hero.png', width: 1200, height: 630 }],
      type: 'website',
      locale: 'id_ID',
    },
    twitter: { card: 'summary_large_image', title, description, images: ['/hero.png'] },
  }
}

export default async function CatalogPage() {
  const result = await listProducts()
  const products = result.success && Array.isArray(result.products) ? result.products : []
  return (
    <div className='w-full bg-white py-8 lg:py-12 relative overflow-hidden min-h-[60vh]'>
      <div className='w-full h-full flex flex-col gap-6 md:gap-10 px-4 md:px-14 lg:px-24 xl:px-32 2xl:px-40'>
        <div className='w-full flex flex-col md:flex-row items-center justify-between gap-4'>
          <div>
            <p className='text-md font-bold'>Explore</p>
            <h1 className='text-4xl md:text-5xl lg:text-6xl font-semibold'>Product Catalog</h1>
          </div>
          <Link href='/contact' className='px-5 py-3 border text-[#0E121D] border-[#0E121D] font-semibold rounded-lg hover:bg-[#f7a619] hover:border-[#f7a619] hover:shadow-lg hover:text-white transition'>
            Need a custom item? Contact us
          </Link>
        </div>

        {products.length === 0 ? (
          <div className='w-full text-center text-accent-foreground/80 font-semibold py-20'>
            No products yet. Add items via POST /api/catalog (required: title, desc, content, date, place, category, price).
          </div>
        ) : (
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
            {products.map((p) => (
              <div key={p._id} className='border rounded-xl p-4 flex flex-col gap-3 hover:shadow-md transition bg-white'>
                <div className='w-full aspect-[4/3] bg-gray-100 rounded-lg overflow-hidden'>
                  <Image
                    src={(p.images && p.images[0]) || p.imageUrl || '/under.png'}
                    alt={p.title || 'item'}
                    width={600}
                    height={450}
                    className='w-full h-full object-cover'
                  />
                </div>
                <div className='flex items-start justify-between gap-3'>
                  <div>
                    <h3 className='text-xl font-bold'>{p.title}</h3>
                    <p className='text-sm text-accent-foreground/80 capitalize'>{p.category}{p.place ? ` • ${p.place}` : ''}</p>
                  </div>
                  <div className='text-right'>
                    <p className='text-lg font-extrabold'>
                      {new Intl.NumberFormat('id-ID', { style: 'currency', currency: p.currency || 'IDR', maximumFractionDigits: 0 }).format(p.price || 0)}
                    </p>
                    {!p.available && (
                      <p className='text-xs text-red-500 font-semibold'>Out of stock</p>
                    )}
                  </div>
                </div>
                {p.description && (
                  <p className='text-sm text-accent-foreground/80 line-clamp-3'>{p.description}</p>
                )}
                <div className='flex flex-wrap gap-2 mt-2'>
                  {(p.tags || []).slice(0, 4).map((t, i) => (
                    <span key={i} className='text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded'>#{t}</span>
                  ))}
                </div>
                <div className='flex items-center gap-2 mt-3'>
                  <Link href={`/catalog/${p.slug}`} className='inline-flex items-center justify-center px-4 py-2 rounded-md border border-[#0E121D] text-[#0E121D] font-semibold hover:bg-[#f7a619] hover:border-[#f7a619] hover:shadow-lg hover:text-white transition'>
                    Lihat Detail
                  </Link>
                  <Link href={`https://wa.me/6281234567890?text=${encodeURIComponent('Halo, saya tertarik dengan ' + (p.title || 'produk') + ' (' + (p.slug || '') + ')')}`} target='_blank' className='inline-flex items-center justify-center px-4 py-2 rounded-md bg-[#25D366] text-white font-semibold hover:bg-[#128C7E] transition'>
                    Tanya via WhatsApp
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
