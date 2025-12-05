'use client'

import { useEffect, useState } from 'react'
import { useSession } from '@/app/components/providers/SessionProvider'

export default function UserChangeNotification() {
  const { user } = useSession()
  const [previousUser, setPreviousUser] = useState(null)
  const [notification, setNotification] = useState('')

  useEffect(() => {
    if (user && previousUser) {
      // Check for role changes
      if (user.role !== previousUser.role) {
        let message = ''
        
        if (user.role === 'admin' && previousUser.role !== 'admin') {
          message = 'Anda telah mendapatkan akses admin!'
        } else if (user.role !== 'admin' && previousUser.role === 'admin') {
          message = 'Akses admin Anda telah dicabut.'
        } else {
          message = `Role Anda telah diubah dari ${previousUser.role} ke ${user.role}.`
        }
        
        setNotification(message)
        
        // Auto hide after 5 seconds
        setTimeout(() => {
          setNotification('')
        }, 5000)
      }
      
      // Check for name changes
      if (user.name !== previousUser.name) {
        setNotification(`Nama Anda telah diubah menjadi "${user.name}".`)
        
        setTimeout(() => {
          setNotification('')
        }, 5000)
      }
      
      // Check for email changes
      if (user.email !== previousUser.email) {
        setNotification(`Email Anda telah diubah menjadi "${user.email}".`)
        
        setTimeout(() => {
          setNotification('')
        }, 5000)
      }
    }
    
    // Update previous user for next comparison
    if (user) {
      setPreviousUser({ ...user })
    }
  }, [user])

  if (!notification) return null

  return (
    <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50 max-w-md w-full mx-4">
      <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded shadow-lg">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">{notification}</span>
          <button 
            onClick={() => setNotification('')}
            className="text-blue-500 hover:text-blue-700 font-bold text-lg leading-none"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  )
}