// Seed catalog data by calling the running Next.js API
// Usage: BASE_URL=http://localhost:3000 node scripts/seed_catalog.mjs

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000'

const samples = [
  {
    title: 'Neon Box Custom Premium',
    desc: 'Neon box premium untuk kebutuhan brand.',
    content: 'Neon box custom premium dengan material berkualitas, cocok untuk indoor maupun outdoor.',
    date: '2025-01-15',
    place: 'Jakarta',
    category: 'signage',
    price: 350000,
    imageUrl: '/under.png',
    tags: ['neon','box','custom'],
    available: true,
  },
  {
    title: 'Spanduk Promosi Outdoor',
    desc: 'Spanduk outdoor kuat dan tahan cuaca.',
    content: 'Spanduk outdoor dengan material tahan cuaca, cocok untuk promosi jangka panjang.',
    date: '2025-02-01',
    place: 'Surabaya',
    category: 'printing',
    price: 150000,
    images: ['/under.png','/under.png'],
    tags: ['spanduk','outdoor'],
    available: true,
  },
  {
    title: 'Acrylic Lettering 3D',
    desc: 'Huruf timbul akrilik elegan.',
    content: 'Huruf timbul akrilik 3D dengan finishing rapi untuk signage interior.',
    date: '2025-03-10',
    place: 'Bandung',
    category: 'acrylic',
    price: 420000,
    imageUrl: '/under.png',
    tags: ['acrylic','lettering','3d'],
    available: true,
  },
]

async function postJSON(url, body) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const text = await res.text()
  let data
  try { data = JSON.parse(text) } catch { data = { raw: text } }
  if (!res.ok) {
    const err = new Error(`Request failed ${res.status}`)
    err.data = data
    throw err
  }
  return data
}

async function main() {
  console.log(`[seed] Using BASE_URL=${BASE_URL}`)
  for (const item of samples) {
    try {
      const res = await postJSON(`${BASE_URL}/api/catalog`, item)
      console.log('[seed] Created:', res.product?.title, res.product?._id)
    } catch (e) {
      console.error('[seed] Failed:', item.title, e.data || e.message)
    }
  }
}

main().catch((e) => {
  console.error('[seed] Fatal:', e)
  process.exit(1)
})
