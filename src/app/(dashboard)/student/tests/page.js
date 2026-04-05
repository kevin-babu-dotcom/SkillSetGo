'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { auth } from '@/firebase/config'
import { getUserProfile } from '@/firebase/firestore'

export default function TestsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (!currentUser) {
        router.push('/login')
        return
      }

      setUser(currentUser)
      try {
        const userProfile = await getUserProfile(currentUser.uid)
        setProfile(userProfile)
      } catch (error) {
        console.error('Error fetching profile:', error)
      } finally {
        setLoading(false)
      }
    })

    return () => unsubscribe()
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#6B8B23]"></div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-white font-outfit">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-6">My Tests</h1>
        
        <div className="bg-[#FAF0DC] rounded-lg p-8 text-center">
          <p className="text-gray-600 text-lg mb-4">No tests available yet</p>
          <p className="text-gray-500">Start your career journey by taking the Stream Fitness Test from your dashboard</p>
        </div>
      </div>
    </main>
  )
}
