import { NextResponse } from 'next/server'
import { verifyJwtToken } from '@/lib/jwt'
import { User } from '@/lib/models/User'

export async function GET(request) {
  try {
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({
        success: false,
        error: 'Token tidak ditemukan'
      }, { status: 401 })
    }

    const token = authHeader.substring(7) // Remove 'Bearer ' prefix
    const decoded = verifyJwtToken(token)

    if (!decoded) {
      return NextResponse.json({
        success: false,
        error: 'Token tidak valid'
      }, { status: 401 })
    }

    // Verify user still exists in database and get current data
    const currentUser = await User.findById(decoded.id)
    
    if (!currentUser) {
      return NextResponse.json({
        success: false,
        error: 'User tidak ditemukan'
      }, { status: 401 })
    }

    // Return current user data from database (not from token)
    const userData = {
      id: currentUser._id.toString(),
      name: currentUser.name,
      email: currentUser.email,
      role: currentUser.role || 'user'
    }

    return NextResponse.json({
      success: true,
      user: userData
    })

  } catch (error) {
    console.error('[Verify] Error:', error)
    return NextResponse.json({
      success: false,
      error: 'Terjadi kesalahan server'
    }, { status: 500 })
  }
}