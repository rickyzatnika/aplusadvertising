'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'

export default function ErrorHandler() {
  const searchParams = useSearchParams()
  const [error, setError] = useState('')

  useEffect(() => {
    const errorParam = searchParams.get('error')
    
    if (errorParam) {
      let errorMessage = ''
      
      switch (errorParam) {
        case 'access_denied':
          errorMessage = 'Akses ditolak. Anda tidak memiliki izin untuk mengakses halaman admin.'
          break
        case 'invalid_token':
          errorMessage = 'Sesi Anda telah berakhir. Silakan login kembali.'
          break
        case 'auth_error':
          errorMessage = 'Terjadi kesalahan autentikasi. Silakan login kembali.'
          break
        default:
          errorMessage = 'Terjadi kesalahan. Silakan coba lagi.'
      }
      
      setError(errorMessage)
      
      // Clear error after 5 seconds
      setTimeout(() => {
        setError('')
        // Remove error parameter from URL
        const url = new URL(window.location)
        url.searchParams.delete('error')
        window.history.replaceState({}, '', url.pathname)
      }, 5000)
    }
  }, [searchParams])

  if (!error) return null

  return (
    <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50 max-w-md w-full mx-4">
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded shadow-lg">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">{error}</span>
          <button 
            onClick={() => setError('')}
            className="text-red-500 hover:text-red-700 font-bold text-lg leading-none"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  )
}