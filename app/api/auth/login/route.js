import { NextResponse } from 'next/server'
import { compare } from 'bcryptjs'
import { signJwtToken } from '@/lib/jwt'
import { User } from '@/lib/models/User'
import { getDb } from '@/lib/mongodb'

export async function POST(request) {
  try {

    await getDb()

    const { username, password } = await request.json()

    if (!username || !password) {
      return NextResponse.json({
        success: false,
        error: 'Username dan password harus diisi'
      }, { status: 400 })
    }

    // Cari user berdasarkan username atau email
    const user = await User.findOne({
      $or: [
        { name: username },
        { email: username }
      ]
    })

    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'Username atau password salah'
      }, { status: 401 })
    }

    // Verifikasi password
    const isValidPassword = await compare(password, user.password)

    if (!isValidPassword) {
      return NextResponse.json({
        success: false,
        error: 'Username atau password salah'
      }, { status: 401 })
    }

    // Generate JWT token
    const token = signJwtToken({
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role || 'user'
    })

    // Return user info dengan token
    return NextResponse.json({
      success: true,
      message: 'Login berhasil',
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role || 'user'
      },
      token
    })

  } catch (error) {
    console.error('[Login] Error:', error)
    return NextResponse.json({
      success: false,
      error: 'Terjadi kesalahan server'
    }, { status: 500 })
  }
}