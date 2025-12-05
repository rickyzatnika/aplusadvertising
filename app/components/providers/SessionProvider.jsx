'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext({
  user: null,
  loading: true,
  login: () => {},
  logout: () => {},
  refreshUser: async () => {},
  isAuthenticated: false,
})

export default function SessionProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuth()

    const handleFocus = () => {
      try {
        if (document.visibilityState === 'visible') {
          const lastCheck = localStorage.getItem('lastAuthCheck')
          const now = Date.now()
          if (!lastCheck || now - parseInt(lastCheck) > 60000) {
            refreshUser()
          }
        }
      } catch {}
    }

    const handleStorageChange = (e) => {
      if (e.key === 'authToken' && !e.newValue) {
        setUser(null)
      }
    }

    window.addEventListener('focus', handleFocus)
    window.addEventListener('visibilitychange', handleFocus)
    window.addEventListener('storage', handleStorageChange)

    return () => {
      window.removeEventListener('focus', handleFocus)
      window.removeEventListener('visibilitychange', handleFocus)
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [])

  const checkAuth = async (forceCheck = false) => {
    try {
      let token = localStorage.getItem('authToken')
      let userData = localStorage.getItem('userData')
      
      // Fallback to cookie if localStorage is empty
      if (!token) {
        const cookies = document.cookie.split(';').map(c => c.trim())
        const authCookie = cookies.find(c => c.startsWith('authToken='))
        if (authCookie) {
          token = authCookie.split('=')[1]
        }
      }
      
      if (!token) {
        setLoading(false)
        return
      }

      // If we have valid userData and not forcing check, use cached data
      if (!forceCheck && userData) {
        try {
          const parsedUser = JSON.parse(userData)
          setUser(parsedUser)
          setLoading(false)
          return
        } catch (e) {
          // If parsing fails, continue to server verification
        }
      }

      // Only verify with server when necessary
      const response = await fetch('/api/auth/verify', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        const newUser = data.user
        
        // Update last check timestamp
        localStorage.setItem('lastAuthCheck', Date.now().toString())
        
        // Check if role changed and handle accordingly
        if (user && user.role !== newUser.role) {
          console.log('Role changed from', user.role, 'to', newUser.role)
          
          // If user lost admin access while on admin page
          if (user.role === 'admin' && newUser.role !== 'admin' && window.location.pathname.startsWith('/admin')) {
            window.location.href = '/?error=access_denied'
            return
          }
          
          // If user gained admin access, could redirect to dashboard
          // (optional - uncomment if desired)
          // if (user.role !== 'admin' && newUser.role === 'admin') {
          //   window.location.href = '/admin/dashboard'
          //   return
          // }
        }
        
        setUser(newUser)
        
        // Update localStorage with fresh data from database
        localStorage.setItem('userData', JSON.stringify(newUser))
      } else {
        // Token invalid, remove from storage
        localStorage.removeItem('authToken')
        localStorage.removeItem('userData')
        localStorage.removeItem('lastAuthCheck')
        document.cookie = 'authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
        setUser(null)
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      // Clear invalid data
      localStorage.removeItem('authToken')
      localStorage.removeItem('userData')
      localStorage.removeItem('lastAuthCheck')
      document.cookie = 'authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const login = (userData, token) => {
    // Store in localStorage for client-side access
    localStorage.setItem('authToken', token)
    localStorage.setItem('userData', JSON.stringify(userData))
    
    // Store in cookie for server-side access (middleware)
    document.cookie = `authToken=${token}; path=/; secure; samesite=strict`
    
    setUser(userData)
    
    // Role-based redirect after successful login
    if (userData.role === 'admin') {
      window.location.href = '/admin/dashboard'
    } else {
      // For non-admin users, stay on current page or redirect to home
      // You can customize this behavior as needed
    }
  }

  const logout = () => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('userData')
    localStorage.removeItem('lastAuthCheck')
    
    // Clear the auth cookie
    document.cookie = 'authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
    
    setUser(null)
    
    // Redirect to home after logout
    window.location.href = '/'
  }

  const refreshUser = async () => {
    await checkAuth(true) // Force check with server
  }

  const value = {
    user,
    loading,
    login,
    logout,
    refreshUser,
    isAuthenticated: !!user
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useSession() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useSession must be used within SessionProvider')
  }
  return context
}
