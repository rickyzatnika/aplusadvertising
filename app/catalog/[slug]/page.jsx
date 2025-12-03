import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getProductBySlug } from '@/lib/catalog'

export const dynamic = 'force-dynamic'
export const revalidate = 0

function formatCurrency(amount, currency = 'IDR') {
  try {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount || 0)
  } catch {
    return `${currency} ${amount}`
  }
}

export async function generateMetadata({ params: paramsPromise }) {
  const { slug } = await paramsPromise
  if (!slug || typeof slug !== 'string') return {}
  const { success, product } = await getProductBySlug(slug)
  if (!success || !product) return { title: 'Produk Tidak Ditemukan', robots: { index: false, follow: false } }
  const base = new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000')
  const title = product.title ? `${product.title}` : 'Detail Produk'
  const description = product.description || `Detail produk ${product.title || ''} dari Aplus Advertising.`
  const cover = (product.images && product.images[0]) || product.imageUrl || '/under.png'
  return {
    title,
    description,
    alternates: { canonical: `/catalog/${slug}` },
    openGraph: {
      title,
      description,
      url: new URL(`/catalog/${slug}`, base).toString(),
      images: [{ url: cover, width: 1200, height: 630, alt: product.title }],
      type: 'product',
      locale: 'id_ID',
    },
    twitter: { card: 'summary_large_image', title, description, images: [cover] },
  }
}

export default async function ProductDetailPage({ params: paramsPromise }) {
  const { slug } = await paramsPromise
  if (!slug || typeof slug !== 'string') return notFound()

  const { success, product } = await getProductBySlug(slug)
  if (!success || !product) return notFound()

  const cover = (product.images && product.images[0]) || product.imageUrl || '/under.png'

  return (
    <div className='w-full bg-white py-8 lg:py-12 relative overflow-hidden'>
      <div className='w-full h-full flex flex-col gap-6 md:gap-10 px-4 md:px-14 lg:px-24 xl:px-32 2xl:px-40'>
        <div className='text-sm'>
          <Link href='/' className='text-accent-foreground/70 hover:underline'>Home</Link>
          <span className='mx-2'>/</span>
          <Link href='/catalog' className='text-accent-foreground/70 hover:underline'>Catalog</Link>
          <span className='mx-2'>/</span>
          <span className='text-accent-foreground/90'>{product.title}</span>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
          <div className='flex flex-col gap-3'>
            <div className='w-full aspect-[4/3] bg-gray-100 rounded-lg overflow-hidden'>
              <Image src={cover} alt={product.title} width={1200} height={900} className='w-full h-full object-cover' />
            </div>
            <div className='flex gap-2 flex-wrap'>
              {(product.images || []).map((img, i) => (
                <div key={i} className='w-24 h-20 rounded overflow-hidden bg-gray-100'>
                  <Image src={img} alt={`thumb-${i}`} width={200} height={150} className='w-full h-full object-cover' />
                </div>
              ))}
            </div>
          </div>

          <div className='flex flex-col gap-4'>
            <div>
              <h1 className='text-3xl md:text-4xl font-bold'>{product.title}</h1>
              <p className='text-accent-foreground/80 capitalize'>{product.category}{product.place ? ` • ${product.place}` : ''}</p>
              <p className='text-sm text-accent-foreground/70'>Tanggal: {product.date ? new Date(product.date).toLocaleDateString('id-ID') : '-'}</p>
            </div>
            <div className='text-2xl font-extrabold'>{formatCurrency(product.price, product.currency)}</div>
            {product.description && (
              <p className='text-accent-foreground/90'>{product.description}</p>
            )}
            {product.content && (
              <div className='prose prose-sm max-w-none mt-2 text-accent-foreground/90 whitespace-pre-wrap'>
                {product.content}
              </div>
            )}
            <div className='flex flex-wrap gap-2'>
              {(product.tags || []).map((t, i) => (
                <span key={i} className='text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded'>#{t}</span>
              ))}
            </div>
            <div className='flex gap-3 mt-4'>
              <Link href={`https://wa.me/6281234567890?text=${encodeURIComponent('Halo, saya tertarik dengan ' + (product.title || 'produk') + ' (' + (product.slug || '') + ')')}`} target='_blank' className='inline-flex items-center justify-center px-4 py-2 rounded-md bg-[#25D366] text-white font-semibold hover:bg-[#128C7E] transition'>
                Tanya via WhatsApp
              </Link>
              <Link href='/catalog' className='inline-flex items-center justify-center px-4 py-2 rounded-md border border-[#0E121D] text-[#0E121D] font-semibold hover:bg-[#f7a619] hover:border-[#f7a619] hover:shadow-lg hover:text-white transition'>
                Kembali ke Katalog
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
