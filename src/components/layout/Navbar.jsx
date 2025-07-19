'use client'
import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function Navbar() {
const [isMenuOpen, setIsMenuOpen] = useState(false)

const toggleMenu = () => {
setIsMenuOpen(!isMenuOpen)
}

return (
<nav className="bg-white shadow-sm border-b font-outfit">
<div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
<div className="flex justify-between items-center h-16">
    
    {/* Logo */}
    <div className="flex-shrink-0">
    <Link href="/" className="flex items-center">
        <Image 
            src="/images/Logo.png"  
            alt="SkillSetGo Logo" 
            width={120}
            height={40}        
            className="h-8 w-auto sm:h-10 md:h-12 object-contain"
            priority
            quality={100}
            unoptimized={true}
        />
    </Link>
    </div>

    {/* Desktop Menu - Apply font-outfit here ONLY */}
    <div className="hidden md:block font-outfit">
    <div className="ml-10 flex items-baseline space-x-8">
        <Link 
        href="/for-students" 
        className="text-[#1F1F1F] hover:text-black px-3 py-2 text-md font-bold flex items-center gap-1"
        >
        For Students
        <Image src="/images/DropDown.png" alt="dropdown arrow" width={12} height={8} className="ml-1"/>
        </Link>
        <Link 
        href="/for-institutions" 
        className="text-[#1F1F1F] hover:text-gray-900 px-3 py-2 text-md font-bold flex items-center gap-1"
        >
        For Institutions
        <Image src="/images/DropDown.png" alt="dropdown arrow" width={12} height={8} className="ml-1"/>
        </Link>
        <Link 
        href="/resources" 
        className="text-[#1F1F1F] hover:text-gray-900 px-3 py-2 text-md font-bold flex items-center gap-1"
        >
        Resources
        <Image 
            src="/images/DropDown.png"  
            alt="dropdown arrow" 
            width={12} 
            height={8} 
            className="ml-1"
        />
        </Link>
        <Link 
        href="/pricing" 
        className="text-[#1F1F1F] hover:text-gray-900 px-3 py-2 text-md font-bold flex items-center gap-1"
        >
        Pricing
        <Image 
            src="/images/DropDown.png"  
            alt="dropdown arrow" 
            width={12} 
            height={8} 
            className="ml-1"
        />
        </Link>
    </div>
    </div>

    {/* Desktop Login & Get Started - Apply font-outfit here too */}
    <div className="hidden md:flex items-center space-x-4 font-outfit">
            <Link 
        href="/signup" 
        className="bg-[#FDD355] hover:bg-yellow-500 text-black px-5 py-2 rounded-md text-md font-bold transition-colors"
    >
        Get Started
    </Link>
    <Link 
        href="/login" 
        className="text-[#1F1F1F] hover:text-gray-900 px-4 py-2 text-md font-bold"
    >
        Login
    </Link>
    </div>

    {/* Mobile Menu Button */}
    <div className="md:hidden flex items-center space-x-4 font-outfit">
    <Link 
        href="/login" 
        className="bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-1 rounded text-md font-bold"
    >
        Login
    </Link>
    
    <button
        onClick={toggleMenu}
        className="text-[#1F1F1F] hover:text-gray-900 focus:outline-none focus:text-gray-900"
        aria-label="Toggle menu"
    >
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        {isMenuOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        )}
        </svg>
    </button>
    </div>
</div>

{/* Mobile Menu */}
{isMenuOpen && (
    <div className="md:hidden font-outfit">
    <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t">
        <Link
        href="/for-students"
        className="block px-3 py-2 text-base font-bold text-[#1F1F1F] hover:text-gray-900 hover:bg-gray-50"
        onClick={() => setIsMenuOpen(false)}
        >
        For Students
        </Link>
        <Link
        href="/for-institutions"
        className="block px-3 py-2 text-base font-bold text-[#1F1F1F] hover:text-gray-900 hover:bg-gray-50"
        onClick={() => setIsMenuOpen(false)}
        >
        For Institutions
        </Link>
        <Link
        href="/resources"
        className="block px-3 py-2 text-base font-bold text-[#1F1F1F] hover:text-gray-900 hover:bg-gray-50"
        onClick={() => setIsMenuOpen(false)}
        >
        Resources
        </Link>
        <Link
        href="/pricing"
        className="block px-3 py-2 text-base font-bold text-[#1F1F1F] hover:text-gray-900 hover:bg-gray-50"
        onClick={() => setIsMenuOpen(false)}
        >
        Pricing
        </Link>
        <Link
        href="/signup"
        className="block w-full text-left bg-yellow-400 hover:bg-yellow-500 text-black px-3 py-2 rounded-md text-base font-bold mt-4"
        onClick={() => setIsMenuOpen(false)}
        >
        Get Started
        </Link>
    </div>
    </div>
)}
</div>
</nav>
)
}