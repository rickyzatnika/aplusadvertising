import { listProducts } from '@/lib/catalog'

export default async function sitemap() {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const staticUrls = [
    '',
    '/about',
    '/catalog',
    '/contact',
  ].map((p) => ({ url: `${base}${p}`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 }))

  try {
    const result = await listProducts()
    const products = result.success && Array.isArray(result.products) ? result.products : []
    const productUrls = products.map((p) => ({
      url: `${base}/catalog/${p.slug}`,
      lastModified: p.updatedAt ? new Date(p.updatedAt) : new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    }))
    return [...staticUrls, ...productUrls]
  } catch {
    return staticUrls
  }
}
