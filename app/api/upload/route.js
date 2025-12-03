import { NextResponse } from 'next/server'
import crypto from 'crypto'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const revalidate = 0

function env(key, fallback = undefined) {
  return process.env[key] ?? fallback
}

function buildSignature(params, apiSecret) {
  const keys = Object.keys(params).filter((k) => params[k] !== undefined && params[k] !== null && params[k] !== '')
  keys.sort()
  const toSign = keys.map((k) => `${k}=${params[k]}`).join('&') + apiSecret
  return crypto.createHash('sha1').update(toSign).digest('hex')
}

async function uploadFileToCloudinary(fileOrString) {
  const cloudName = env('CLOUDINARY_CLOUD_NAME')
  const apiKey = env('CLOUDINARY_API_KEY')
  const apiSecret = env('CLOUDINARY_API_SECRET')
  const uploadPreset = env('CLOUDINARY_UPLOAD_PRESET')

  if (!cloudName) throw new Error('CLOUDINARY_CLOUD_NAME is not set')

  const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`

  // Normalize input: accept File/Blob, data URL string, or remote URL
  let file = fileOrString
  if (typeof fileOrString === 'string') {
    if (/^data:/.test(fileOrString)) {
      // Convert data URL to Blob
      const blob = await fetch(fileOrString).then(r => r.blob())
      file = blob
    } else if (/^https?:\/\//.test(fileOrString)) {
      // Remote URL can be sent directly
      file = fileOrString
    }
  }

  // We'll attempt unsigned first if a preset is configured; otherwise signed.
  // If unsigned fails due to preset issues and we have API credentials, we fallback to signed automatically.
  async function postUnsigned() {
    const form = new FormData()
    form.append('file', file)
    form.append('upload_preset', uploadPreset)
    const res = await fetch(url, { method: 'POST', body: form })
    if (!res.ok) {
      const text = await res.text().catch(() => '')
      throw new Error(`Cloudinary upload failed (${res.status}): ${text}`)
    }
    return res.json()
  }

  async function postSigned() {
    if (!apiKey || !apiSecret) {
      throw new Error('CLOUDINARY_API_KEY/SECRET are not set (or provide CLOUDINARY_UPLOAD_PRESET for unsigned upload)')
    }
    const timestamp = Math.floor(Date.now() / 1000)
    const paramsToSign = { timestamp }
    const signature = buildSignature(paramsToSign, apiSecret)

    const form = new FormData()
    form.append('file', file)
    form.append('timestamp', String(timestamp))
    form.append('api_key', apiKey)
    form.append('signature', signature)

    const res = await fetch(url, { method: 'POST', body: form })
    if (!res.ok) {
      const text = await res.text().catch(() => '')
      throw new Error(`Cloudinary upload failed (${res.status}): ${text}`)
    }
    return res.json()
  }

  let data
  if (uploadPreset) {
    try {
      data = await postUnsigned()
    } catch (e) {
      const msg = (e && e.message) ? e.message : ''
      const canFallback = apiKey && apiSecret
      if (canFallback && /preset not found|invalid preset|upload preset/i.test(msg)) {
        data = await postSigned()
      } else {
        throw e
      }
    }
  } else {
    data = await postSigned()
  }
  return {
    asset_id: data.asset_id,
    public_id: data.public_id,
    version: data.version,
    format: data.format,
    resource_type: data.resource_type,
    bytes: data.bytes,
    width: data.width,
    height: data.height,
    url: data.url,
    secure_url: data.secure_url,
    folder: data.folder ?? undefined,
    original_filename: data.original_filename,
  }
}

export async function POST(request) {
  try {
    const contentType = request.headers.get('content-type') || ''
    if (!contentType.includes('multipart/form-data')) {
      return NextResponse.json({ success: false, error: 'Content-Type must be multipart/form-data' }, { status: 415 })
    }
    const form = await request.formData()

    // Accept 'files' (multiple), 'file' (single), and 'images' (multiple alt)
    let files = form.getAll('files')
    if (!files || files.length === 0) {
      const single = form.get('file')
      if (single) files = [single]
    }
    if (!files || files.length === 0) {
      const imagesAlt = form.getAll('images')
      if (imagesAlt && imagesAlt.length > 0) files = imagesAlt
    }

    if (!files || files.length === 0) {
      console.error('[upload] No files in formData. Keys:', Array.from(form.keys()))
      return NextResponse.json({ success: false, error: 'No files provided. Use field name "files" or "file".' }, { status: 400 })
    }

    console.log('[upload] Received', files.length, 'items. Types:', files.map(f => typeof f))

    const uploads = []
    for (const item of files) {
      if (typeof item === 'string') {
        // Support remote URL or data URL string
        uploads.push(uploadFileToCloudinary(item))
      } else {
        // item is a File/Blob
        uploads.push(uploadFileToCloudinary(item))
      }
    }

    const results = await Promise.allSettled(uploads)
    const successes = results.filter(r => r.status === 'fulfilled').map(r => r.value)
    const failures = results.filter(r => r.status === 'rejected').map(r => ({ error: r.reason instanceof Error ? r.reason.message : String(r.reason) }))

    const status = successes.length > 0 ? (failures.length > 0 ? 207 : 201) : 400

    if (successes.length === 0) {
      console.error('[upload] All uploads failed:', failures)
    }

    return NextResponse.json({ success: successes.length > 0, uploaded: successes, failed: failures }, { status })
  } catch (error) {
    console.error('Upload API error:', error)
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : 'Internal server error' }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Upload API. POST multipart/form-data with files (or file). Optional: folder. Uses unsigned upload if CLOUDINARY_UPLOAD_PRESET is set, otherwise signed upload with CLOUDINARY_API_KEY/SECRET.'
  })
}
