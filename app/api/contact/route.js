import { NextResponse } from 'next/server'
import { createContact } from '@/lib/contact'

// Ensure this route always runs on Node.js runtime (Prisma is not Edge-compatible)
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const revalidate = 0

// Simple manual validation without Zod

export async function POST(request) {
  try {
    // Reject requests that are clearly not JSON
    const contentType = request.headers.get('content-type') || ''
    if (!contentType.includes('application/json')) {
      return NextResponse.json(
        { success: false, error: 'Content-Type must be application/json' },
        { status: 415 }
      )
    }

    // Read raw text first to be more tolerant of various clients (curl, Powershell, etc.)
    let body
    try {
      const raw = await request.text()
      if (!raw || raw.trim().length === 0) {
        return NextResponse.json(
          { success: false, error: 'Request body is empty' },
          { status: 400 }
        )
      }
      try {
        body = JSON.parse(raw)
      } catch (e) {
        // Some shells (e.g., PowerShell) may wrap JSON in single quotes; try to normalize
        const trimmed = raw.trim()
        if (trimmed.startsWith("'") && trimmed.endsWith("'")) {
          const unquoted = trimmed.slice(1, -1)
          try {
            body = JSON.parse(unquoted)
          } catch {
            return NextResponse.json(
              { success: false, error: 'Invalid JSON in request body' },
              { status: 400 }
            )
          }
        } else {
          return NextResponse.json(
            { success: false, error: 'Invalid JSON in request body' },
            { status: 400 }
          )
        }
      }
    } catch (parseError) {
      return NextResponse.json(
        { success: false, error: 'Unable to read request body' },
        { status: 400 }
      )
    }

    // Validate and normalize the request body (manual)
    const payload = body && typeof body === 'object' ? body : {}
    const name = typeof payload.name === 'string' ? payload.name.trim() : ''
    const email = typeof payload.email === 'string' ? payload.email.trim().toLowerCase() : ''
    const message = typeof payload.message === 'string' ? payload.message.trim() : ''

    const errors = []
    if (!name) errors.push({ path: ['name'], message: 'Name is required' })
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push({ path: ['email'], message: 'Invalid email address' })
    if (!message) errors.push({ path: ['message'], message: 'Message is required' })

    if (errors.length > 0) {
      return NextResponse.json({ success: false, error: 'Validation failed', details: errors }, { status: 400 })
    }

    // Create contact in database
    const result = await createContact({ name, email, message })

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error || 'Failed to save contact' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Contact form submitted successfully',
        contact: result.contact,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json(
    { message: 'Contact API endpoint. Use POST to submit a contact form.' },
    { status: 200 }
  )
}

