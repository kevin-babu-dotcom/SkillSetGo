    'use client'
    import { useState, useEffect, useRef } from 'react'
    import Link from 'next/link'
    import Image from 'next/image'
    import { auth } from '@/firebase/config'
    import { getUserProfile } from '@/firebase/firestore'
    import { useRouter } from 'next/navigation'

    export default function AuthNavbar() {
    const router = useRouter()
    const [user, setUser] = useState(null)
    const [profile, setProfile] = useState(null)
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
    const profileMenuRef = useRef(null)

    // Close profile menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
                setIsProfileMenuOpen(false)
            }
        }

        if (isProfileMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside)
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [isProfileMenuOpen])

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
        setUser(currentUser)
        if (currentUser) {
            try {
            const userProfile = await getUserProfile(currentUser.uid)
            setProfile(userProfile)
            } catch (error) {
            console.error('Error fetching profile:', error)
            }
        }
        })

        return () => unsubscribe()
    }, [])

    const handleSignOut = async () => {
        try {
        await auth.signOut()
        router.push('/login')
        } catch (error) {
        console.error('Error signing out:', error)
        }
    }

    return (
        <nav className="bg-white sticky top-0 z-50 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06)] font-outfit">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-22">
            
            {/* Logo */}
            <div className="flex-shrink-0">
                <Link href="/" className="flex items-center">
                <Image 
                        src="/images/Logo.svg"  
                        alt="SkillSetGo Logo" 
                        width={400}    
                        height={130}    
                        className="h-16 w-auto sm:h-12 md:h-18 object-contain"
                        priority
                        quality={100}   
                    />
                </Link>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-8 font-outfit">
                <Link 
                href="/student/dashboard" 
                className="text-[#1F1F1F] hover:text-black px-3 py-2 text-lg font-bold flex items-center gap-1"
                >
                Dashboard
                <Image src="/images/DropDown.png" alt="dropdown arrow" width={12} height={8} className="ml-1 hover:rotate-180"/>
                </Link>
                <Link 
                href="/student/career-guidance" 
                className="text-[#1F1F1F] hover:text-black px-3 py-2 text-lg font-bold flex items-center gap-1"
                >
                Career Guidance
                <Image src="/images/DropDown.png" alt="dropdown arrow" width={12} height={8} className="ml-1 hover:rotate-180"/>
                </Link>
                <Link 
                href="/student/career-library" 
                className="text-[#1F1F1F] hover:text-black px-3 py-2 text-lg font-bold flex items-center gap-1"
                >
                Career Library
                <Image src="/images/DropDown.png" alt="dropdown arrow" width={12} height={8} className="ml-1 hover:rotate-180"/>
                </Link>
                <Link 
                href="/dashboard/assessment/career-interests" 
                className="text-[#1F1F1F] hover:text-black px-3 py-2 text-lg font-bold flex items-center gap-1"
                >
                Assessments
                <Image src="/images/DropDown.png" alt="dropdown arrow" width={12} height={8} className="ml-1 hover:rotate-180"/>
                </Link>
                <Link 
                href="/help" 
                className="text-[#1F1F1F] hover:text-black px-3 py-2 text-lg font-bold flex items-center gap-1"
                >
                Help
                <Image src="/images/DropDown.png" alt="dropdown arrow" width={12} height={8} className="ml-1 hover:rotate-180"/>
                </Link>
            </div>

            {/* Profile Section */}
            <div className="flex items-center">
                <div className="relative" ref={profileMenuRef}>
                <button
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    className="flex items-center focus:outline-none"
                >
                    <div className="w-10 h-10 rounded-full bg-[#6B8B23] flex items-center justify-center overflow-hidden">
                    {profile?.photoURL ? (
                        <Image
                        src={profile.photoURL}
                        alt="Profile"
                        width={40}
                        height={40}
                        className="w-full h-full object-cover"
                        />
                    ) : (
                        <span className="text-white font-bold text-lg">
                        {profile?.fullName?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'U'}
                        </span>
                    )}
                    </div>
                </button>

                {/* Dropdown Menu */}
                {isProfileMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-200">
                        <p className="text-sm font-semibold text-gray-800 truncate">
                        {profile?.fullName || user?.email || 'User'}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                        {user?.email}
                        </p>
                    </div>
                    <Link
                        href="/student/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsProfileMenuOpen(false)}
                    >
                        My Profile
                    </Link>
                    <Link
                        href="/student/tests"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsProfileMenuOpen(false)}
                    >
                        My Tests
                    </Link>
                    <Link
                        href="/dashboard/assessment/career-interests"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsProfileMenuOpen(false)}
                    >
                        Take Assessment
                    </Link>
                    <Link
                        href="/student/results"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsProfileMenuOpen(false)}
                    >
                        Results
                    </Link>
                    <button
                        onClick={handleSignOut}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                        Sign Out
                    </button>
                    </div>
                )}
                </div>
            </div>
            </div>

            {/* Mobile Navigation */}
            <div className="md:hidden py-3 space-y-1">
            <Link 
                href="/student/dashboard" 
                className="block px-3 py-2 text-base font-bold text-[#1F1F1F] hover:text-gray-900 hover:bg-gray-50"
            >
                Dashboard
            </Link>
            <Link 
                href="/student/career-guidance" 
                className="block px-3 py-2 text-base font-bold text-[#1F1F1F] hover:text-gray-900 hover:bg-gray-50"
            >
                Career Guidance
            </Link>
            <Link 
                href="/student/career-library" 
                className="block px-3 py-2 text-base font-bold text-[#1F1F1F] hover:text-gray-900 hover:bg-gray-50"
            >
                Career Library
            </Link>
            <Link 
                href="/dashboard/assessment/career-interests" 
                className="block px-3 py-2 text-base font-bold text-[#1F1F1F] hover:text-gray-900 hover:bg-gray-50"
            >
                Assessments
            </Link>
            <Link 
                href="/help" 
                className="block px-3 py-2 text-base font-bold text-[#1F1F1F] hover:text-gray-900 hover:bg-gray-50"
            >
                Help
            </Link>
            </div>
        </div>
        </nav>
    )
    }
