import { NextResponse } from 'next/server'
import { getProductById, updateProduct, deleteProduct } from '@/lib/catalog'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET(_request, { params: paramsPromise } = {}) {
  try {
    const p = typeof paramsPromise?.then === 'function' ? await paramsPromise : (paramsPromise || {})
    const { id } = p || {}
    if (!id) return NextResponse.json({ success: false, error: 'Missing id' }, { status: 400 })
    const result = await getProductById(id)
    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 500 })
    }
    if (!result.product) {
      return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 })
    }
    return NextResponse.json({ success: true, product: result.product }, { status: 200 })
  } catch (error) {
    console.error('Catalog detail API error:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request, { params: paramsPromise } = {}) {
  try {
    const p = typeof paramsPromise?.then === 'function' ? await paramsPromise : (paramsPromise || {})
    const { id } = p || {}
    if (!id) return NextResponse.json({ success: false, error: 'Missing id' }, { status: 400 })
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
    const result = await updateProduct(id, body)
    if (!result.success) {
      const status = result.error === 'Validation failed' ? 400 : (result.error === 'Not found' ? 404 : 400)
      return NextResponse.json({ success: false, error: result.error, details: result.details }, { status })
    }
    return NextResponse.json({ success: true, product: result.product }, { status: 200 })
  } catch (error) {
    console.error('Catalog update API error:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(_request, { params: paramsPromise } = {}) {
  try {
    const p = typeof paramsPromise?.then === 'function' ? await paramsPromise : (paramsPromise || {})
    const { id } = p || {}
    if (!id) return NextResponse.json({ success: false, error: 'Missing id' }, { status: 400 })
    const result = await deleteProduct(id)
    if (!result.success) {
      const status = result.error === 'Not found' ? 404 : 400
      return NextResponse.json({ success: false, error: result.error }, { status })
    }
    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error('Catalog delete API error:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
