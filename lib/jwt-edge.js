// JWT verification compatible with Edge Runtime using Web Crypto API

// Pure JS base64 encoder/decoder (no atob/btoa/Buffer) to work in Edge runtime
const BASE64_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'

function base64ToBytes(base64) {
 // Remove padding
 base64 = base64.replace(/\s+/g, '')
 if (base64.length % 4 === 1) {
   throw new Error('Invalid base64 string length')
 }
 let bytes = []
 let buffer = 0
 let bits = 0
 for (let i = 0; i < base64.length; i++) {
   const ch = base64[i]
   if (ch === '=') break
   const val = BASE64_ALPHABET.indexOf(ch)
   if (val === -1) continue // ignore non-base64 chars (shouldn't occur)
   buffer = (buffer << 6) | val
   bits += 6
   if (bits >= 8) {
     bits -= 8
     bytes.push((buffer >> bits) & 0xff)
   }
 }
 return new Uint8Array(bytes)
}

function bytesToBase64(bytes) {
 let out = ''
 let i
 for (i = 0; i + 2 < bytes.length; i += 3) {
   const triple = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2]
   out += BASE64_ALPHABET[(triple >> 18) & 0x3f]
   out += BASE64_ALPHABET[(triple >> 12) & 0x3f]
   out += BASE64_ALPHABET[(triple >> 6) & 0x3f]
   out += BASE64_ALPHABET[triple & 0x3f]
 }
 const remaining = bytes.length - i
 if (remaining === 1) {
   const triple = bytes[i] << 16
   out += BASE64_ALPHABET[(triple >> 18) & 0x3f]
   out += BASE64_ALPHABET[(triple >> 12) & 0x3f]
   out += '=='
 } else if (remaining === 2) {
   const triple = (bytes[i] << 16) | (bytes[i + 1] << 8)
   out += BASE64_ALPHABET[(triple >> 18) & 0x3f]
   out += BASE64_ALPHABET[(triple >> 12) & 0x3f]
   out += BASE64_ALPHABET[(triple >> 6) & 0x3f]
   out += '='
 }
 return out
}

function base64UrlDecode(base64Url) {
 const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
 try {
   return base64ToBytes(base64)
 } catch (error) {
   throw new Error('Invalid base64url encoding')
 }
}

function base64UrlEncode(bytes) {
 const base64 = bytesToBase64(bytes)
 return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
}

async function importHmacKey(secret) {
 const encoder = new TextEncoder()
 const keyData = encoder.encode(secret)

 return await crypto.subtle.importKey(
   'raw',
   keyData,
   { name: 'HMAC', hash: 'SHA-256' },
   false,
   ['sign', 'verify']
 )
}

export async function verifyJwtTokenEdge(token) {
  try {
    if (!token || typeof token !== 'string') {
      return null
    }

    const parts = token.split('.')
    if (parts.length !== 3) {
      return null
    }

    const [headerB64, payloadB64, signatureB64] = parts
    
    // Decode header and payload
    const headerBytes = base64UrlDecode(headerB64)
    const payloadBytes = base64UrlDecode(payloadB64)
    
    const header = JSON.parse(new TextDecoder().decode(headerBytes))
    const payload = JSON.parse(new TextDecoder().decode(payloadBytes))
    
    // Check if token is expired
    if (payload.exp && Date.now() >= payload.exp * 1000) {
      return null
    }
    
    // Verify signature
    const secret = process.env.JWT_SECRET
    if (!secret) {
      throw new Error('JWT_SECRET is not defined')
    }
    
    const key = await importHmacKey(secret)
    const dataToVerify = headerB64 + '.' + payloadB64
    const encoder = new TextEncoder()
    const dataBytes = encoder.encode(dataToVerify)
    
    const signatureBytes = base64UrlDecode(signatureB64)
    
    const isValid = await crypto.subtle.verify(
      'HMAC',
      key,
      signatureBytes,
      dataBytes
    )
    
    if (!isValid) {
      return null
    }
    
    return payload
  } catch (error) {
    console.error('JWT verification failed:', error)
    return null
  }
}