'use client'
import { useState, useEffect, useRef } from 'react'
import { auth } from '@/firebase/config'
import { getUserProfile } from '@/firebase/firestore'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function StudentDashboard() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showRoadmap, setShowRoadmap] = useState(false)
  const roadmapRef = useRef(null)
  
  // Close roadmap when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (roadmapRef.current && !roadmapRef.current.contains(event.target)) {
        setShowRoadmap(false)
      }
    }

    if (showRoadmap) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showRoadmap])
  
  useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
        if (!currentUser) {
            router.push('/login')
            return
        }

        setUser(currentUser)
        try {
            const userProfile = await getUserProfile(currentUser.uid)
            console.log('Profile data:', userProfile) // Add this line
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
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-xl font-outfit">Loading...</div>
        </div>
        )
    }

    const levels = [
        {
        tier: 'Tier 1 — Get',
        number: 1,
        title: 'Start Interest Explorer',
        subtitle: 'Quick assessment designed to uncover your passions and interests.',
        color: 'bg-[#FDD355]'
        },
        {
        tier: 'Tier 1 — Get',
        number: 2,
        title: 'Explore Career Library',
        subtitle: 'Get full access to our detailed career pathways, insights, and future trends.',
        color: 'bg-[#FDD355]'
        },
        {
        tier: 'Tier 2 — Set',
        number: 3,
        title: 'Unlock Full Test',
        subtitle: 'Access the remaining test sections for a complete evaluation.',
        color: 'bg-[#6B8B23]'
        },
        {
        tier: 'Tier 2 — Set',
        number: 4,
        title: 'Complete Profile & Tips',
        subtitle: 'Personalize your test and career journey.',
        color: 'bg-[#6B8B23]'
        },
        {
        tier: 'Tier 2 — Set',
        number: 5,
        title: 'Generate My Report',
        subtitle: 'View your personalized career report with insights and recommendations.',
        color: 'bg-[#6B8B23]'
        },
        {
        tier: 'Tier 3 — Go',
        number: 6,
        title: 'Book Career Guidance (Session 1)',
        subtitle: 'Discuss your report with our experts to review your results.',
        color: 'bg-[#8B4513]'
        },
        {
        tier: 'Tier 3 — Go',
        number: 7,
        title: 'Discover Plan A, B & C',
        subtitle: 'Download your top three suggested career paths.',
        color: 'bg-[#8B4513]'
        },
        {
        tier: 'Tier 3 — Go',
        number: 8,
        title: 'Action Plan & Next Steps (Session 2)',
        subtitle: 'Get personalized advice and actionable steps on how to proceed further.',
        color: 'bg-[#8B4513]'
        },
        {
        tier: 'Tier 3 — Go',
        number: 9,
        title: 'Exam & Admission Insights',
        subtitle: 'Understand relevant entrance exams and admission requirements for chosen path.',
        color: 'bg-[#8B4513]'
        },
        {
        tier: 'Tier 3 — Go',
        number: 10,
        title: 'Career Readiness Roadmap',
        subtitle: 'Access your long-term plan combining results, sessions, and insights.',
        color: 'bg-[#8B4513]'
        }
    ]

    return (
        <>
        {/* Blur Overlay for Navbar, Main Content, and Footer */}
        {showRoadmap && (
            <div className="fixed inset-0 backdrop-blur-sm z-[60]"></div>
        )}
        
        <main className="min-h-screen bg-[#ffffff] font-outfit relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header Section */}
            <div className="bg-[#FAF0DC] rounded-lg p-6 mb-6 flex flex-col lg:flex-row items-start lg:items-center justify-between shadow-md hover:shadow-lg transition-shadow">
                <div className="mb-4 lg:mb-0">
                <h1 className="text-2xl lg:text-3xl font-bold mb-2 font-outfit">
                    Hi There! {profile?.fullName || 'Student Name'}
                </h1>
                <p className="text-gray-700 text-lg font-outfit">
                    Get Set, Get Going on Your Career Journey
                </p>
                </div>
                <div className="flex items-center gap-4">
                <div className="text-right">
                    <p className="text-sm text-gray-600 font-outfit">Your Current Plan:</p>
                    <p className="font-bold text-lg font-outfit">Tier 1 - Get</p>
                </div>
                <button 
                    onClick={() => router.push('/student/upgrade')}
                    className="bg-[#6B8B23] hover:bg-[#5a7a1e] text-white px-6 py-3 rounded-lg font-bold transition-colors font-outfit"
                >
                    UPGRADE
                </button>
                </div>
            </div>

            {/* Status Cards Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Current Status */}
                <div className="bg-[#FAF0DC] rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow flex flex-col h-full">
                <h2 className="text-xl font-bold mb-4 text-center font-outfit">CURRENT STATUS</h2>
                <div className="flex items-center justify-center mb-4">
                    <div className="w-20 h-20 bg-[#6B8B23] rounded-full flex items-center justify-center">
                    <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    </div>
                </div>
                <div className="text-center mb-4 flex-grow">
                    <p className="text-2xl font-bold font-outfit">0/10</p>
                    <p className="text-gray-700 font-outfit">Levels Completed</p>
                </div>
                <div className="text-center mt-auto">
                    <button 
                    onClick={() => setShowRoadmap(true)}
                    className="w-full bg-[#FDD355] hover:bg-yellow-500 text-black px-6 py-2 rounded font-bold transition-colors font-outfit shadow-sm hover:shadow-md"
                    >
                    See Progress
                    </button>
                </div>
                </div>

                {/* Ongoing Level */}
                <div className="bg-[#FAF0DC] rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow flex flex-col h-full">
                <h2 className="text-xl font-bold mb-4 text-center font-outfit">ONGOING LEVEL</h2>
                <div className="flex items-center justify-center mb-4">
                    <div className="w-20 h-20 bg-[#6B8B23] rounded-full flex items-center justify-center">
                    <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    </div>
                </div>
                <div className="text-center mb-4 flex-grow">
                    <p className="text-gray-700 font-bold font-outfit">Continue Upcoming</p>
                    <p className="text-gray-700 font-outfit">Level</p>
                </div>
                <div className="text-center mt-auto">
                    <button className="w-full bg-[#FDD355] hover:bg-yellow-500 text-black px-6 py-2 rounded font-bold transition-colors font-outfit">
                    See Progress
                    </button>
                </div>
                </div>

                {/* Upcoming Level */}
                <div className="bg-[#FAF0DC] rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow flex flex-col h-full">
                <h2 className="text-xl font-bold mb-4 text-center font-outfit">UPCOMING LEVEL</h2>
                <div className="flex items-center justify-center mb-4">
                    <div className="w-20 h-20 bg-[#6B8B23] rounded-full flex items-center justify-center">
                    <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    </div>
                </div>
                <div className="text-center mb-4 flex-grow">
                    <p className="text-gray-700 font-bold font-outfit">Start Interest</p>
                    <p className="text-gray-700 font-outfit">Explorer</p>
                </div>
                <div className="text-center mt-auto">
                    <button 
                    onClick={() => router.push('/student/tests')}
                      className="w-full bg-[#FDD355] hover:bg-yellow-500 text-black px-6 py-2 rounded font-bold transition-colors font-outfit"
                    >
                    Start Now
                    </button>
                </div>
                </div>
            </div>

            {/* Main Content Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 auto-rows-max lg:auto-rows-max">
                {/* Left Sidebar - Profile & Menu */}
                <div className="lg:col-span-1">
                <div className="bg-[#FAF0DC] rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow flex flex-col h-full\">
                    <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-full bg-[#6B8B23] flex items-center justify-center overflow-hidden">
                        {profile?.photoURL ? (
                        <Image
                            src={profile.photoURL}
                            alt="Profile"
                            width={64}
                            height={64}
                            className="w-full h-full object-cover"
                        />
                        ) : (
                        <span className="text-white font-bold text-2xl">
                            {profile?.fullName?.charAt(0)?.toUpperCase() || 'S'}
                        </span>
                        )}
                    </div>
                    <div>
                        <p className="font-bold text-lg font-outfit">{profile?.fullName || 'STUDENT NAME'}</p>
                        <p className="text-sm text-gray-600 font-outfit">+91{profile?.phone || 'xxxxxxxxxx'}</p>
                    </div>
                    </div>

                    <nav className="space-y-2 flex flex-col flex-grow mt-6\">
                    <a
                        href="/student/dashboard"
                        className="block py-3 px-4 rounded font-bold bg-white text-black font-outfit shadow-sm hover:shadow-md transition-shadow"
                    >
                        Dashboard
                    </a>
                    <a
                        href="/student/profile"
                        className="block py-3 px-4 rounded font-bold hover:bg-white text-black transition-colors bg-[#FAF0DC] hover:shadow-md shadow-sm font-outfit"
                    >
                        My Profile
                    </a>
                    <a
                        href="/student/career-library"
                        className="block py-3 px-4 rounded font-bold hover:bg-white text-black transition-colors bg-[#FAF0DC] hover:shadow-md shadow-sm font-outfit"
                    >
                        Career Library
                    </a>
                    <a
                        href="/help"
                        className="block py-3 px-4 rounded font-bold hover:bg-white text-black transition-colors bg-[#FAF0DC] hover:shadow-md shadow-sm font-outfit"
                    >
                        Help & Support
                    </a>
                    <button
                        onClick={() => auth.signOut().then(() => router.push('/login'))}
                        className="block w-full text-left py-3 px-4 rounded font-bold text-black transition-colors bg-[#FAF0DC] hover:bg-red-100 hover:text-red-600 hover:shadow-md shadow-sm font-outfit mt-auto\"
                    >
                        Log Out
                    </button>
                    </nav>
                </div>
                </div>

                {/* Right Content - Test Info & Events */}
                <div className="lg:col-span-2 space-y-6">
                {/* Stream Fitness Test Card */}
                <div className="bg-[#FAF0DC] rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
                    <div className="flex flex-col md:flex-row gap-6">
                    <div className="md:w-1/3">
                        <Image
                        src="/images/dashboard/test-illustration.png"
                        alt="Test Illustration"
                        width={200}
                        height={200}
                        className="w-full h-auto rounded"
                        />
                    </div>
                    <div className="md:w-2/3">
                        <p className="text-gray-700 mb-4 font-outfit">
                        Discover the stream where you'll thrive. The SkillSetGo Stream Fitness Test 
                        evaluates you across four sections to give a complete picture of your strengths 
                        and perfect stream fit.
                        </p>
                        <p className="text-sm text-gray-600 mb-2">
                        <strong>Sections Covered:</strong> Interests, Personality, Aptitude, and Self Efficacy
                        </p>
                        <p className="text-sm text-gray-600 mb-4">
                        <strong>Test Duration:</strong> 90-120 min (approx.)
                        </p>
                        <button 
                          onClick={() => router.push('/student/tests')}
                          className="w-full bg-[#FDD355] hover:bg-yellow-500 text-black py-3 rounded font-bold transition-colors font-outfit shadow-sm hover:shadow-md"
                        >
                        Start Now
                        </button>
                    </div>
                    </div>
                </div>

                {/* Upcoming Events */}
                <div className="bg-[#FAF0DC] rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
                    <h2 className="text-2xl font-bold mb-4 font-outfit">UPCOMING EVENTS / ANNOUNCEMENTS</h2>
                    <div className="text-gray-600 font-outfit">
                    <p>No upcoming events at the moment.</p>
                    </div>
                </div>
                </div>
            </div>
            </div>
        </main>

        {/* Slide-in Roadmap Panel */}
        {/* Slide Panel - Always rendered but slides in/out */}
        <div ref={roadmapRef} className={`fixed top-0 right-0 h-full w-full md:w-2/3 lg:w-1/2 bg-white z-[70] shadow-2xl transform transition-transform duration-300 ease-in-out overflow-y-auto ${showRoadmap ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="p-6">
                {/* Close Button */}
                <button 
                    onClick={() => setShowRoadmap(false)}
                    className="absolute top-4 right-4 text-gray-600 hover:text-black"
                >
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                {/* Header */}
                <div className="mb-6">
                    <h2 className="text-3xl font-bold mb-2 font-outfit">SkillSetGo Levels</h2>
                    <div className="bg-[#FDD355] rounded-full px-4 py-2 inline-block">
                    <p className="font-bold text-sm font-outfit">Your Current Tier: Tier 1 — Get</p>
                    </div>
                </div>

                {/* Levels List */}
                <div className="space-y-3">
                    {levels.map((level) => (
                    <div 
                        key={level.number} 
                        className="bg-white rounded-lg p-4 flex items-start gap-3 shadow-sm hover:shadow-md transition-shadow border border-gray-100"
                    >
                        {/* Level Number Circle */}
                        <div className={`${level.color} rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0`}>
                        <span className="text-white font-bold text-lg">{level.number}</span>
                        </div>

                        {/* Level Content */}
                        <div className="flex-1">
                        <p className="text-xs text-gray-600 font-semibold mb-1">{level.tier}</p>
                        <h3 className="text-base font-bold mb-1 font-outfit">{level.title}</h3>
                        <p className="text-gray-700 text-sm font-outfit">{level.subtitle}</p>
                        </div>

                        {/* Status Checkmark */}
                        <div className="flex-shrink-0">
                        {level.number === 1 ? (
                            <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            </div>
                        ) : (
                            <div className="w-6 h-6 rounded-full border-2 border-gray-300"></div>
                        )}
                        </div>
                    </div>
                    ))}
                </div>
                </div>
            </div>
        </>
    )
}
