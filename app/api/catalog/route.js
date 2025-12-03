import { NextResponse } from 'next/server'
import { createProduct, listProducts } from '@/lib/catalog'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const q = searchParams.get('q') || undefined
  const category = searchParams.get('category') || undefined
  const availableParam = searchParams.get('available')
  const available = availableParam === null ? undefined : availableParam === 'true' ? true : availableParam === 'false' ? false : undefined

  const result = await listProducts({ q, category, available })
  if (!result.success) {
    console.error('[catalog][GET] listProducts failed:', result.error)
    return NextResponse.json({ success: false, error: result.error }, { status: 500 })
  }
  console.log('[catalog][GET] params:', { q, category, available }, 'count:', result.products?.length)
  return NextResponse.json({ success: true, products: result.products })
}

export async function POST(request) {
  try {
    const contentType = request.headers.get('content-type') || ''
    if (!contentType.includes('application/json')) {
      return NextResponse.json({ success: false, error: 'Content-Type must be application/json' }, { status: 415 })
    }

    let body
    try {
      const raw = await request.text()
      body = JSON.parse(raw)
    } catch {
      return NextResponse.json({ success: false, error: 'Invalid JSON' }, { status: 400 })
    }

    const result = await createProduct(body)
    if (!result.success) {
      const status = result.error === 'Validation failed' ? 400 : 400
      return NextResponse.json({ success: false, error: result.error, details: result.details }, { status })
    }

    return NextResponse.json({ success: true, product: result.product }, { status: 201 })
  } catch (error) {
    console.error('Catalog API error:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
