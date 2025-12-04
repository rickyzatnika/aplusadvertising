import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getProductBySlug } from '@/lib/catalog'

function formatCurrency(amount, currency = 'IDR') {
  try {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount || 0)
  } catch {
    return `${currency} ${amount}`
  }
}

// Removed generateMetadata to avoid metadata creation errors

export const dynamic = 'force-dynamic'

export default async function ProductDetailPage({ params }) {
  const resolvedParams = params && typeof params.then === 'function' ? await params : (params || {})
  const slug = resolvedParams?.slug
  
  if (!slug || typeof slug !== 'string') {
    return (
      <div className='w-full bg-white py-8 lg:py-12 relative overflow-hidden'>
        <div className='w-full h-full flex flex-col gap-6 md:gap-10 px-4 md:px-14 lg:px-24 xl:px-32 2xl:px-40'>
          <div className='text-center py-20'>
            <h1 className='text-3xl font-bold mb-4'>Halaman Tidak Ditemukan</h1>
            <p className='text-gray-600 mb-6'>Halaman yang Anda cari tidak tersedia.</p>
            <Link href='/catalog' className='inline-flex items-center justify-center px-4 py-2 rounded-md border border-[#0E121D] text-[#0E121D] font-semibold hover:bg-[#f7a619] hover:border-[#f7a619] hover:shadow-lg hover:text-white transition'>
              Kembali ke Katalog
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Fetch product from database
  const title = slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
  const { success, product } = await getProductBySlug(slug)
  if (!success || !product) {
    return notFound()
  }

  const cover = (product.images && product.images[0]) || product.imageUrl || '/under.png'
  const displayPrice = typeof product.price === 'number' && isFinite(product.price) 
    ? formatCurrency(product.price, product.currency)
    : 'Hubungi Kami'

    return (
      <div className='w-full bg-white py-8 lg:py-12 relative overflow-hidden' suppressHydrationWarning>
        <div className='w-full h-full flex flex-col gap-6 md:gap-10 px-4 md:px-14 lg:px-24 xl:px-32 2xl:px-40'>
          {/* Breadcrumb */}
          <nav className='text-sm' aria-label="Breadcrumb">
            <ol className='flex items-center space-x-2'>
              <li>
                <Link href='/' className='text-accent-foreground/70 hover:underline'>
                  Home
                </Link>
              </li>
              <li className='text-accent-foreground/50'>/</li>
              <li>
                <Link href='/catalog' className='text-accent-foreground/70 hover:underline'>
                  Catalog
                </Link>
              </li>
              <li className='text-accent-foreground/50'>/</li>
              <li className='text-accent-foreground/90' aria-current="page">
                {product.title || 'Produk'}
              </li>
            </ol>
          </nav>

          {/* Product Details */}
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
            {/* Images Section */}
            <div className='flex flex-col gap-3'>
              <div className='w-full aspect-[4/3] bg-gray-100 rounded-lg overflow-hidden'>
                <Image 
                  src={cover} 
                  alt={product.title || 'Product image'} 
                  width={1200} 
                  height={900} 
                  className='w-full h-full object-cover' 
                  unoptimized
                  priority
                />
              </div>
              {/* Thumbnail Gallery */}
              {product.images && product.images.length > 1 && (
                <div className='flex gap-2 flex-wrap'>
                  {product.images.map((img, i) => (
                    <div key={i} className='w-24 h-20 rounded overflow-hidden bg-gray-100 cursor-pointer hover:opacity-80 transition-opacity'>
                      <Image 
                        src={img} 
                        alt={`${product.title} - image ${i + 1}`} 
                        width={200} 
                        height={150} 
                        className='w-full h-full object-cover' 
                        unoptimized 
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info Section */}
            <div className='flex flex-col gap-4'>
              <div>
                <h1 className='text-3xl md:text-4xl font-bold mb-2'>
                  {product.title || 'Produk Tanpa Nama'}
                </h1>
                {(product.category || product.place) && (
                  <p className='text-accent-foreground/80 capitalize'>
                    {product.category}
                    {product.category && product.place ? ' • ' : ''}
                    {product.place}
                  </p>
                )}
                {product.date && (
                  <p className='text-sm text-accent-foreground/70'>
                    Tanggal: {(() => {
                      try {
                        const date = new Date(product.date)
                        return date.toLocaleDateString('id-ID', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })
                      } catch {
                        return '-'
                      }
                    })()}
                  </p>
                )}
              </div>
              
              {/* Price */}
              <div className='text-2xl font-extrabold text-green-600'>
                {displayPrice}
              </div>
              
              {/* Description */}
              {product.description && (
                <div className='space-y-2'>
                  <h3 className='font-semibold text-lg'>Deskripsi</h3>
                  <p className='text-accent-foreground/90 leading-relaxed'>
                    {product.description}
                  </p>
                </div>
              )}
              
              {/* Content */}
              {product.content && (
                <div className='space-y-2'>
                  <h3 className='font-semibold text-lg'>Detail</h3>
                  <div className='prose prose-sm max-w-none text-accent-foreground/90 whitespace-pre-wrap leading-relaxed'>
                    {product.content}
                  </div>
                </div>
              )}
              
              {/* Tags */}
              {product.tags && product.tags.length > 0 && (
                <div className='space-y-2'>
                  <h3 className='font-semibold text-sm'>Tags</h3>
                  <div className='flex flex-wrap gap-2'>
                    {product.tags.map((tag, i) => (
                      <span key={i} className='text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full'>
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Action Buttons */}
              <div className='flex flex-col sm:flex-row gap-3 mt-6'>
                <Link 
                  href={`https://wa.me/6281214707415?text=${encodeURIComponent(
                    `Halo, saya tertarik dengan ${product.title || 'produk ini'} (${product.slug || slug}). Bisa minta info lebih lanjut?`
                  )}`} 
                  target='_blank' 
                  rel='noopener noreferrer'
                  className='inline-flex items-center justify-center px-6 py-3 rounded-md bg-[#25D366] text-white font-semibold hover:bg-[#128C7E] transition-colors focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:ring-offset-2'
                >
                  💬 Tanya via WhatsApp
                </Link>
                <Link 
                  href='/catalog' 
                  className='inline-flex items-center justify-center px-6 py-3 rounded-md border border-[#0E121D] text-[#0E121D] font-semibold hover:bg-[#f7a619] hover:border-[#f7a619] hover:shadow-lg hover:text-white transition-all focus:outline-none focus:ring-2 focus:ring-[#f7a619] focus:ring-offset-2'
                >
                  ← Kembali ke Katalog
                </Link>
              </div>
              
              {/* Availability Status */}
              <div className='text-sm text-accent-foreground/70 mt-2'>
                Status: <span className={`font-medium ${typeof product.available === 'boolean' && product.available === false ? 'text-red-600' : 'text-green-600'}`}>
                  {typeof product.available === 'boolean' && product.available === false ? 'Tidak Tersedia' : 'Tersedia'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
}