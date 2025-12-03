import { getDb } from './mongodb'

export function slugify(text = '') {
  // convert to kebab-case

  return text
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

export function normalizeProduct(input = {}) {
  const now = new Date()
  const desc = typeof input.description === 'string' ? input.description : (typeof input.desc === 'string' ? input.desc : '')
  const title = typeof input.title === 'string' ? input.title.trim() : ''
  const baseSlug = typeof input.slug === 'string' && input.slug.trim() ? input.slug.trim().toLowerCase() : slugify(title)
  // normalize images and imageUrl
  const imagesArr = Array.isArray(input.images) ? input.images.filter(Boolean).map(String) : []
  const imageUrl = typeof input.imageUrl === 'string' ? input.imageUrl.trim() : ''
  const mergedImages = imagesArr.length > 0 ? imagesArr : (imageUrl ? [imageUrl] : [])

  return {
    title,
    slug: baseSlug,
    description: desc.trim(),
    content: typeof input.content === 'string' ? input.content.trim() : '',
    price: typeof input.price === 'number' && isFinite(input.price) ? input.price : NaN,
    currency: typeof input.currency === 'string' ? input.currency.toUpperCase() : 'IDR',
    category: typeof input.category === 'string' ? input.category.trim().toLowerCase() : '',
    tags: Array.isArray(input.tags) ? input.tags.filter(Boolean).map(String) : [],
    images: mergedImages,
    imageUrl, // keep original if provided for convenience
    available: typeof input.available === 'boolean' ? input.available : true,
    date: input.date ? new Date(input.date) : null,
    place: typeof input.place === 'string' ? input.place.trim() : '',
    metadata: input.metadata && typeof input.metadata === 'object' ? input.metadata : {},
    createdAt: input.createdAt ? new Date(input.createdAt) : now,
    updatedAt: now,
  }
}

export function validateProduct(p) {
  const errors = []
  if (!p.title) errors.push({ path: ['title'], message: 'Title is required' })
  if (!p.description) errors.push({ path: ['desc'], message: 'Description (desc) is required' })
  if (p.description && p.description.length < 6) errors.push({ path: ['desc'], message: 'Description must be at least 6 characters' })
  if (!p.content) errors.push({ path: ['content'], message: 'Content is required' })
  if (p.content && p.content.length < 6) errors.push({ path: ['content'], message: 'Content must be at least 6 characters' })
  if (!p.date) errors.push({ path: ['date'], message: 'Date is required' })
  if (p.date && !(p.date instanceof Date) || (p.date instanceof Date && isNaN(p.date))) errors.push({ path: ['date'], message: 'Date must be a valid date' })
  if (!p.place) errors.push({ path: ['place'], message: 'Place is required' })
  if (p.place && p.place.length < 2) errors.push({ path: ['place'], message: 'Place must be at least 2 characters' })
  if (!p.category) errors.push({ path: ['category'], message: 'Category is required' })
  if (p.category && p.category.length < 2) errors.push({ path: ['category'], message: 'Category must be at least 2 characters' })
  if (!Array.isArray(p.images) || p.images.length === 0) errors.push({ path: ['images'], message: 'At least one image is required (imageUrl or images[])' })
  if (typeof p.price !== 'number' || !isFinite(p.price)) errors.push({ path: ['price'], message: 'Price is required and must be a number' })
  if (typeof p.price === 'number' && p.price < 0) errors.push({ path: ['price'], message: 'Price must be non-negative' })
  // slug validation if provided
  if (p.slug) {
    const kebab = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
    if (p.slug.length < 3) errors.push({ path: ['slug'], message: 'Slug must be at least 3 characters' })
    if (!kebab.test(p.slug)) errors.push({ path: ['slug'], message: 'Slug must be lowercase kebab-case (a-z, 0-9, hyphen)' })
  }
  // slug can be empty at this stage; it will be generated if missing
  return errors
}

async function ensureUniqueSlug(db, base) {
  let candidate = base || 'item'
  let counter = 0
  // try base, then base-1, base-2, ... until unique
  // cap attempts to avoid infinite loop
  while (counter < 1000) {
    const exists = await db.collection('catalog').findOne({ slug: candidate })
    if (!exists) return candidate
    counter += 1
    candidate = `${base}-${counter}`
  }
  // fallback if something odd happens
  return `${base}-${Date.now()}`
}

export async function createProduct(data) {
  try {
    const db = await getDb()
    const product = normalizeProduct(data)

    // Validate basic fields (title, desc, price)
    const errors = validateProduct(product)
    if (errors.length) {
      return { success: false, error: 'Validation failed', details: errors }
    }

    // Generate a unique slug if missing
    if (!product.slug) {
      const base = slugify(product.title)
      product.slug = await ensureUniqueSlug(db, base)
    } else {
      // Ensure provided slug is unique
      const existing = await db.collection('catalog').findOne({ slug: product.slug })
      if (existing) {
        return { success: false, error: 'Slug already exists' }
      }
    }

    const result = await db.collection('catalog').insertOne(product)
    const saved = { _id: result.insertedId, ...product }
    return { success: true, product: saved }
  } catch (error) {
    console.error('Error creating product:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Failed to create product' }
  }
}

export async function listProducts({ q, category, available } = {}) {
  try {
    const db = await getDb()
    const filter = {}
    if (typeof available === 'boolean') filter.available = available
    if (category) filter.category = category.toLowerCase()
    if (q) {
      filter.$or = [
        { title: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { tags: { $elemMatch: { $regex: q, $options: 'i' } } },
      ]
    }
    const items = await db.collection('catalog').find(filter).sort({ createdAt: -1 }).toArray()
    return { success: true, products: items }
  } catch (error) {
    console.error('Error listing products:', error)
    return { success: false, error: 'Failed to list products' }
  }
}

export async function getProductById(id) {
  try {
    const db = await getDb()
    const { ObjectId } = await import('mongodb')
    if (!id || !ObjectId.isValid(id)) {
      return { success: false, error: 'Invalid id' }
    }
    const item = await db.collection('catalog').findOne({ _id: new ObjectId(id) })
    return { success: true, product: item }
  } catch (error) {
    console.error('Error getting product:', error)
    return { success: false, error: 'Failed to get product' }
  }
}

export async function getProductBySlug(slug) {
  try {
    const db = await getDb()
    const item = await db.collection('catalog').findOne({ slug })
    return { success: true, product: item }
  } catch (error) {
    console.error('Error getting product by slug:', error)
    return { success: false, error: 'Failed to get product by slug' }
  }
}

export async function updateProduct(id, data) {
  try {
    const db = await getDb()
    const { ObjectId } = await import('mongodb')

    if (!id || !ObjectId.isValid(id)) {
      return { success: false, error: 'Invalid id' }
    }

    // Find existing
    const existing = await db.collection('catalog').findOne({ _id: new ObjectId(id) })
    if (!existing) return { success: false, error: 'Not found' }

    // Normalize incoming
    const normalized = normalizeProduct({ ...existing, ...data, createdAt: existing.createdAt })

    // Validate
    const errors = validateProduct(normalized)
    if (errors.length) {
      return { success: false, error: 'Validation failed', details: errors }
    }

    // Handle slug uniqueness if changed or provided
    if (!normalized.slug) {
      normalized.slug = existing.slug || await ensureUniqueSlug(db, slugify(normalized.title))
    } else if (normalized.slug !== existing.slug) {
      const conflict = await db.collection('catalog').findOne({ slug: normalized.slug, _id: { $ne: existing._id } })
      if (conflict) {
        return { success: false, error: 'Slug already exists' }
      }
    }

    const update = { ...normalized, updatedAt: new Date() }
    await db.collection('catalog').updateOne({ _id: existing._id }, { $set: update })
    const saved = { ...existing, ...update }
    return { success: true, product: saved }
  } catch (error) {
    console.error('Error updating product:', error)
    return { success: false, error: 'Failed to update product' }
  }
}

export async function deleteProduct(id) {
  try {
    const db = await getDb()
    const { ObjectId } = await import('mongodb')
    if (!id || !ObjectId.isValid(id)) {
      return { success: false, error: 'Invalid id' }
    }
    const res = await db.collection('catalog').deleteOne({ _id: new ObjectId(id) })
    if (res.deletedCount === 0) return { success: false, error: 'Not found' }
    return { success: true }
  } catch (error) {
    console.error('Error deleting product:', error)
    return { success: false, error: 'Failed to delete product' }
  }
}
