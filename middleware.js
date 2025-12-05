import { NextResponse } from 'next/server'
import { verifyJwtTokenEdge } from './lib/jwt-edge'

export async function middleware(request) {
  const { pathname } = request.nextUrl
  
  // Only protect admin routes
  if (pathname.startsWith('/admin')) {
    const token = request.cookies.get('authToken')?.value || 
                 request.headers.get('authorization')?.replace('Bearer ', '')
    
    if (!token) {
      // No token, redirect to home with error
      const url = new URL('/', request.url)
      url.searchParams.set('error', 'access_denied')
      return NextResponse.redirect(url)
    }
    
    try {
      const decoded = await verifyJwtTokenEdge(token)
      
      if (!decoded) {
        // Invalid token, redirect to home
        const url = new URL('/', request.url)
        url.searchParams.set('error', 'invalid_token')
        return NextResponse.redirect(url)
      }
      
      // For server-side verification, we rely on token role
      // Client-side will do fresh database check
      if (decoded.role !== 'admin') {
        // Not admin, redirect to home with access denied
        const url = new URL('/', request.url)
        url.searchParams.set('error', 'access_denied')
        return NextResponse.redirect(url)
      }
      
      // User is admin based on token, allow access
      // Client-side will verify with fresh database data
      return NextResponse.next()
      
    } catch (error) {
      console.error('Middleware auth error:', error)
      const url = new URL('/', request.url)
      url.searchParams.set('error', 'auth_error')
      return NextResponse.redirect(url)
    }
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.).*)',
  ],
}