'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSession } from '@/app/components/providers/SessionProvider'
import Image from 'next/image'
import Link from 'next/link'

export default function AuthModal({ open, onClose }) {
  const { login } = useSession()
  const [tab, setTab] = useState('login') // 'login' | 'register'
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const form = new FormData(e.currentTarget)
    const email = form.get('email')
    const password = form.get('password')

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: email, password }),
      })

      const data = await res.json()
      setLoading(false)

      if (!data.success) {
        setError(data.error || 'Email atau password salah')
        return
      }

      // Use custom login function instead of localStorage directly
      login(data.user, data.token)

      onClose?.()
    } catch (err) {
      setLoading(false)
      setError('Terjadi kesalahan, coba lagi')
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const form = new FormData(e.currentTarget)
    const name = form.get('name')
    const email = form.get('email')
    const password = form.get('password')
    try {
      const resp = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      })
      const data = await resp.json()
      setLoading(false)
      if (!data.success) {
        setError(data.error || 'Registrasi gagal')
        return
      }
      setTab('login')
    } catch (err) {
      setLoading(false)
      setError('Terjadi kesalahan, coba lagi')
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div className='fixed inset-0 z-[60] flex items-center justify-center'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className='absolute inset-0 bg-black/50' onClick={onClose} />
          <motion.div
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -30, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className='relative z-[61] w-[90%] max-w-md rounded-xl bg-white p-6 shadow-xl'
          >
           
              <div className=' mb-6 pb-6 flex items-center justify-center'>
                <Image src="/logo.png" alt='logo-aplusadvertising' priority={true} width={150} height={100} />
              </div>
           
            <div className='flex items-center justify-between mb-4'>
              <div className='flex gap-2'>
                <button onClick={() => { setError(''); setTab('login') }} className={`px-3 py-1 rounded ${tab === 'login' ? 'bg-[#121212] text-white' : 'bg-gray-100 border-yellow-600 border '}`}>Login</button>
                <button onClick={() => { setError(''); setTab('register') }} className={`px-3 py-1 rounded ${tab === 'register' ? 'bg-[#121212] text-white' : 'bg-gray-100 border-yellow-600 border '}`}>Register</button>
              </div>
              
            </div>


            {error && (
              <div className='mb-3 rounded bg-red-100 border border-red-300 text-red-800 px-3 py-2 text-sm'>
                {error}
              </div>
            )}

            {tab === 'login' ? (
              <form onSubmit={handleLogin} className='grid gap-3 py-3'>
                <label className='grid gap-1 text-sm'>
                  <span>Nama atau Email</span>
                  <input name='email' type='text' required className='border rounded px-3 py-2' placeholder='Masukkan nama atau email' />
                </label>
                <label className='grid gap-1 text-sm'>
                  <span>Password</span>
                  <input name='password' type='password' required className='border rounded px-3 py-2' />
                </label>
                <button disabled={loading} className='mt-2 bg-[#f7a619] text-white rounded px-4 py-2 hover:opacity-90'>
                  {loading ? 'Loading...' : 'Login'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleRegister} className='grid gap-3'>
                <label className='grid gap-1 text-sm'>
                  <span>Nama</span>
                  <input name='name' type='text' className='border rounded px-3 py-2' />
                </label>
                <label className='grid gap-1 text-sm'>
                  <span>Email</span>
                  <input name='email' type='email' required className='border rounded px-3 py-2' />
                </label>
                <label className='grid gap-1 text-sm'>
                  <span>Password</span>
                  <input name='password' type='password' required className='border rounded px-3 py-2' />
                </label>
                <button disabled={loading} className='mt-2 bg-[#f7a619] text-white rounded px-4 py-2 hover:opacity-90'>
                  {loading ? 'Loading...' : 'Register'}
                </button>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
