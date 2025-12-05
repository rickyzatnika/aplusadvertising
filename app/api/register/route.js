import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { getDb } from '@/lib/mongodb'
import { User } from '@/lib/models/User'

export async function POST(req) {
  try {
    await getDb()
    const body = await req.json()
    const { name, email, password, role } = body || {}

    if (!email || !password) {
      return NextResponse.json({ success: false, error: 'Email and password are required' }, { status: 400 })
    }

    // Check jika user sudah ada
    const existing = await User.findOne({ 
      $or: [
        { email: email },
        { name: name }
      ]
    })
    
    if (existing) {
      return NextResponse.json({ 
        success: false, 
        error: 'Email atau username sudah terdaftar' 
      }, { status: 409 })
    }

    // Hash password
    const hashed = await bcrypt.hash(password, 12)
    
    // Buat user baru
    const userData = {
      name: name || email.split('@')[0],
      email,
      password: hashed,
      role: role === 'admin' ? 'admin' : 'user',
    }

    const newUser = await User.create(userData)

    return NextResponse.json({ success: true })
  } catch (e) {
    console.error('register error', e)
    return NextResponse.json({ success: false, error: 'Internal error' }, { status: 500 })
  }
}
