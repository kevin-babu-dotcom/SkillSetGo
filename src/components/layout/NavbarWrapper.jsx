'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { auth } from '@/firebase/config'
import Navbar from './Navbar'
import AuthNavbar from './AuthNavbar'

export default function NavbarWrapper() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const pathname = usePathname()

  // Check if current page is an auth page (login/signup)
  const isAuthPage = pathname?.startsWith('/login') || 
                     pathname?.startsWith('/signup') || 
                     pathname?.startsWith('/verify-phone')

  // Listen to Firebase auth state changes
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsAuthenticated(!!user)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  // Don't render navbar while checking auth state
  if (loading) {
    return null
  }

  // If user is authenticated AND not on auth pages, show AuthNavbar
  if (isAuthenticated && !isAuthPage) {
    return <AuthNavbar />
  }

  // Otherwise show regular Navbar (including on auth pages)
  return <Navbar />
}