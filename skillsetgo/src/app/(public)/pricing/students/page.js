'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { auth } from '@/firebase/config'
import { getUserProfile } from '@/firebase/firestore'
import { useRouter } from 'next/navigation'
import { getDegreeExplorerPrice, isJuniorClass } from '@/lib/pricing'


export default function StudentsPricingPage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [studentClass, setStudentClass] = useState(null)
  const [degreeExplorerPrice, setDegreeExplorerPrice] = useState(69900) // Default ₹699 in paise
  const [isPaying, setIsPaying] = useState(false)
  const [selectedTier, setSelectedTier] = useState(null)

  // Set up auth listener and fetch profile data
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      setUser(currentUser)
      
      // Fetch student's class if logged in
      if (currentUser) {
        try {
          const profile = await getUserProfile(currentUser.uid)
          const studentClass = profile?.class
          setStudentClass(studentClass)
          
          // Calculate degree explorer price based on class
          const price = getDegreeExplorerPrice(studentClass)
          setDegreeExplorerPrice(price)
        } catch (error) {
          console.error('Error fetching profile:', error)
          // Default to senior pricing (₹699) if profile fetch fails
          setDegreeExplorerPrice(69900)
        }
      }
    })
    return unsubscribe
  }, [])

  /**
   * Loads Razorpay checkout script
   */
  const loadRazorpayScript = () =>
    new Promise((resolve) => {
      if (typeof window !== 'undefined' && window.Razorpay) {
        return resolve(true)
      }
      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.async = true
      script.onload = () => resolve(true)
      script.onerror = () => resolve(false)
      document.body.appendChild(script)
    })

  /**
   * Handles payment flow for a selected plan
   * SECURITY: Sends only tier to backend, never price
   */
  const handlePayment = async (tier) => {
    // Check if user is logged in
    if (!user) {
      alert('Please log in to purchase a plan')
      router.push('/login')
      return
    }

    setIsPaying(true)
    setSelectedTier(tier)

    try {
      // 1. Load Razorpay script
      const scriptLoaded = await loadRazorpayScript()
      if (!scriptLoaded) {
        throw new Error('Failed to load Razorpay SDK')
      }

      // 2. Get Firebase auth token
      const idToken = await user.getIdToken()

      // 3. SECURITY: Send ONLY tier to backend
      // Backend will recalculate the amount server-side
      console.log(`[Payment] Creating order for tier: ${tier}`)

      const createOrderRes = await fetch('/api/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({ tier }),
      })

      const createOrderData = await createOrderRes.json()

      if (!createOrderRes.ok) {
        throw new Error(createOrderData?.error || 'Failed to create order')
      }

      const { order, keyId } = createOrderData

      console.log(`[Payment] Order created: ${order.id}`)

      // 4. Open Razorpay checkout
      const rzp = new window.Razorpay({
        key: keyId,
        order_id: order.id,
        amount: order.amount,
        currency: order.currency,
        name: 'SkillSetGo',
        description: `Test Purchase - ${tier}`,
        prefill: {
          email: user?.email || '',
          name: user?.displayName || 'User',
        },
        notes: {
          tier,
        },
        handler: async function (response) {
          console.log(`[Payment] Payment received: ${response.razorpay_payment_id}`)

          // 5. SECURITY: Verify signature server-side
          // Frontend sends payment proof to backend for verification
          const verifyRes = await fetch('/api/verify-payment', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${idToken}`,
            },
            body: JSON.stringify({
              tier,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }),
          })

          const verifyData = await verifyRes.json()

          if (!verifyRes.ok) {
            alert(verifyData?.error || 'Payment verification failed')
            console.error('[Payment] Verification failed:', verifyData)
            return
          }

          console.log('[Payment] Verified successfully')
          alert('Payment successful! Your purchase is now active.')
          router.refresh()
        },

        modal: {
          ondismiss: function () {
            console.log('[Payment] User closed payment modal')
            alert('Payment cancelled.')
            setIsPaying(false)
            setSelectedTier(null)
          },
        },
      })

      rzp.on('payment.failed', function (response) {
        console.error('[Payment] Payment failed:', response.error)
        alert(`Payment failed: ${response.error.description}`)
        setIsPaying(false)
        setSelectedTier(null)
      })

      rzp.open()
    } catch (error) {
      console.error('[Payment] Error:', error)
      alert(error.message || 'Unable to start payment')
      setIsPaying(false)
      setSelectedTier(null)
    }
  }

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Header Section */}
      <div className="text-center py-8 px-4">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2 font-outfit">
          Launch Your Career Journey - Simple, Transparent Plans
        </h1>
        
        {/* Plan Toggle */}
        <div className="flex justify-center mt-6 space-x-4 relative">
          <Link href="/pricing/students" className="bg-[#FFF8E8] border-[3px] border-[#942705] px-12 py-2 rounded-full font-medium flex items-center justify-start relative font-outfit">
            <Image src="/images/pricing/pricing-students.png" alt="For Students" width={50} height={55} className="rounded-full absolute left-0 -mx-1.5" />
            <span>For Students</span>
          </Link>
          <Link href="/pricing/schools" className="bg-[#FFF8E8] px-12 py-2 rounded-full font-medium flex items-center space-x-3 font-outfit relative">
            <Image src="/images/pricing/pricing-schools.png" alt="For Schools" width={50} height={50} className="rounded-full absolute left-0" />
            <span>For Schools</span>
          </Link>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-6xl mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Stream Fit Test */}
          <div className="bg-[#FFF8E8] rounded-lg p-6 shadow-lg text-center flex flex-col h-full">
            <h3 className="font-bold text-2xl mb-4 text-black font-outfit">Stream Fit Test</h3>
            <div className="text-[#6B8B23] text-4xl font-bold mb-4 font-outfit">₹499</div>
            <p className="text-lg font-semibold text-black mb-6 font-outfit">Recommended for Classes 8-10</p>
            
            <div className="text-left mb-6 flex-grow">
              <h4 className="font-bold mb-4 text-black text-lg">Includes:</h4>
              <ul className="text-sm text-black space-y-2">
                <li className="flex items-start">
                  <span className="text-red-600 font-bold mr-2 text-lg leading-none">»</span>
                  <div>
                    <span className="font-semibold">Interest Assessment</span><br />
                    <span className="text-gray-600">RIASEC Based - Free Preview</span>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 font-bold mr-2 text-lg leading-none">»</span>
                  <span className="font-semibold">Personality Profiling</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 font-bold mr-2 text-lg leading-none">»</span>
                  <div>
                    <span className="font-semibold">Cognitive Aptitude Test</span><br />
                    <span className="text-gray-600">Numerical, Verbal, Spatial, Logical</span>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 font-bold mr-2 text-lg leading-none">»</span>
                  <span className="font-semibold">Self-Efficacy Assessment</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 font-bold mr-2 text-lg leading-none">»</span>
                  <div>
                    <span className="font-semibold">Stream Recommendations</span><br />
                    <span className="text-gray-600">Based on multi-factor (4D) analysis</span>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 font-bold mr-2 text-lg leading-none">»</span>
                  <span className="font-semibold">Personalized PDF Report</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 font-bold mr-2 text-lg leading-none">»</span>
                  <span className="font-semibold">Lifetime access to Student Dashboard</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 font-bold mr-2 text-lg leading-none">»</span>
                  <span className="font-semibold">Free Career Library Access</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 font-bold mr-2 text-lg leading-none">»</span>
                  <div>
                    <span className="font-semibold">Need expert help interpreting your report?</span><br />
                    <span className="text-gray-600">You'll have the option to connect with our certified career guide after completing the test.</span>
                  </div>
                </li>
              </ul>
            </div>
            
            <div className="space-y-3 mt-auto">
              {/* Two yellow buttons side by side */}
              <div className="grid grid-cols-2 gap-2">
                <button className="bg-[#FDD355] text-black py-3 rounded-lg font-semibold hover:bg-[#FCC419] font-outfit text-sm">
                  Try Free Interest Assessment
                </button>
                <button className="bg-[#FDD355] text-black py-3 rounded-lg font-semibold hover:bg-[#FCC419] font-outfit text-sm">
                  Talk to Our Team
                </button>
              </div>
              {/* Green button full width */}
              <button
                onClick={() => handlePayment('stream_fit')}
                disabled={isPaying}
                className="w-full bg-[#6B8B23] hover:bg-[#5A7A1A] disabled:opacity-60 disabled:cursor-not-allowed text-white py-3 rounded-lg font-semibold transition-colors font-outfit"
              >
                {isPaying && selectedTier === 'stream_fit' ? 'Processing...' : 'Take Full Test for ₹499'}
              </button>
            </div>
          </div>

          {/* Degree Explorer Test */}
          <div className="bg-[#FFF8E8] rounded-lg p-6 shadow-lg text-center flex flex-col h-full">
            <h3 className="font-bold text-2xl mb-4 text-black font-outfit">Degree Explorer Test</h3>
            <div className="text-[#6B8B23] text-4xl font-bold mb-4 font-outfit">
              ₹{(degreeExplorerPrice / 100).toFixed(0)}
            </div>
            <p className="text-lg font-semibold text-black mb-6 font-outfit">
              {user && studentClass ? (
                isJuniorClass(studentClass) 
                  ? `Your Price (Class ${studentClass})` 
                  : `Your Price (Class ${studentClass})`
              ) : (
                'Recommended for Classes 11-12'
              )}
            </p>
            
            <div className="text-left mb-6 flex-grow">
              <h4 className="font-bold mb-4 text-black text-lg">Includes:</h4>
              <ul className="text-sm text-black space-y-2">
                <li className="flex items-start">
                  <span className="text-red-600 font-bold mr-2 text-lg leading-none">»</span>
                  <span className="font-semibold">Interest Assessment</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 font-bold mr-2 text-lg leading-none">»</span>
                  <span className="font-semibold">Personality Profiling</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 font-bold mr-2 text-lg leading-none">»</span>
                  <span className="font-semibold">Cognitive Abilities Test (Preference)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 font-bold mr-2 text-lg leading-none">»</span>
                  <span className="font-semibold">Self Efficacy Assessment</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 font-bold mr-2 text-lg leading-none">»</span>
                  <span className="font-semibold">Subject Suggestions & More for Logical and right brained applicants</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 font-bold mr-2 text-lg leading-none">»</span>
                  <span className="font-semibold">Comprehensive Career Report (PDF)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 font-bold mr-2 text-lg leading-none">»</span>
                  <span className="font-semibold">Lifetime access to Student Dashboard</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 font-bold mr-2 text-lg leading-none">»</span>
                  <span className="font-semibold">Free Career Library Access</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 font-bold mr-2 text-lg leading-none">»</span>
                  <div>
                    <span className="font-semibold">Need expert help interpreting your report?</span><br />
                    <span className="text-gray-600">You'll have full ability to connect with our team with career goals after completing the test.</span>
                  </div>
                </li>
              </ul>
            </div>
            
            <div className="space-y-3 mt-auto">
              {/* Two yellow buttons side by side */}
              <div className="grid grid-cols-2 gap-2">
                <button className="bg-[#FDD355] text-black py-3 rounded-lg font-semibold hover:bg-[#FCC419] font-outfit text-sm">
                  Try Free Interest Assessment
                </button>
                <button className="bg-[#FDD355] text-black py-3 rounded-lg font-semibold hover:bg-[#FCC419] font-outfit text-sm">
                  Talk to Our Team
                </button>
              </div>
              {/* Green button full width */}
              <button
                onClick={() => handlePayment('degree_explorer')}
                disabled={isPaying}
                className="w-full bg-[#6B8B23] hover:bg-[#5A7A1A] disabled:opacity-60 disabled:cursor-not-allowed text-white py-3 rounded-lg font-semibold transition-colors font-outfit"
              >
                {isPaying && selectedTier === 'degree_explorer' ? 'Processing...' : `Take Full Test for ₹${(degreeExplorerPrice / 100).toFixed(0)}`}
              </button>
            </div>
          </div>

          {/* College Admission Plan */}
          <div className="bg-[#FFF8E8] rounded-lg p-6 shadow-lg text-center flex flex-col h-full">
            <h3 className="font-bold text-2xl mb-4 text-black font-outfit">College Admission Plan</h3>
            <div className="text-[#6B8B23] text-4xl font-bold mb-4 font-outfit">₹1999</div>
            <p className="text-lg font-semibold text-black mb-6 font-outfit">Long-term career planning</p>
            
            <div className="text-left mb-6 flex-grow">
              <h4 className="font-bold mb-4 text-black text-lg">Includes:</h4>
              <ul className="text-sm text-black space-y-2">
                <li className="flex items-start">
                  <span className="text-red-600 font-bold mr-2 text-lg leading-none">»</span>
                  <span className="font-semibold">Access All Test</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 font-bold mr-2 text-lg leading-none">»</span>
                  <span className="font-semibold">Stream Explorer Test</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 font-bold mr-2 text-lg leading-none">»</span>
                  <span className="font-semibold">1 to 1 Chat with our Expert (chat only)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 font-bold mr-2 text-lg leading-none">»</span>
                  <div>
                    <span className="font-semibold">1 hr 20 minute video call with our career counselor</span><br />
                    <span className="text-gray-600">to get personalized career guidance and live Q and A with Questions.</span>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 font-bold mr-2 text-lg leading-none">»</span>
                  <span className="font-semibold">Comprehensive Career Report (PDF)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 font-bold mr-2 text-lg leading-none">»</span>
                  <div>
                    <span className="font-semibold">Detailed analysis for personalized career</span><br />
                    <span className="text-gray-600">admissions and Plan B and C with Options.</span>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 font-bold mr-2 text-lg leading-none">»</span>
                  <span className="font-semibold">Lifetime access to Student Dashboard</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 font-bold mr-2 text-lg leading-none">»</span>
                  <span className="font-semibold">Free Career Library Access</span>
                </li>
              </ul>
            </div>
            
            <div className="space-y-3 mt-auto">
              {/* Two yellow buttons side by side */}
              <div className="grid grid-cols-2 gap-2">
                <button className="bg-[#FDD355] text-black py-3 rounded-lg font-semibold hover:bg-[#FCC419] font-outfit text-sm">
                  Try Free Interest Assessment
                </button>
                <button className="bg-[#FDD355] text-black py-3 rounded-lg font-semibold hover:bg-[#FCC419] font-outfit text-sm">
                  Talk to Our Team
                </button>
              </div>
              {/* Green button full width */}
              <button
                onClick={() => handlePayment('college_admission')}
                disabled={isPaying}
                className="w-full bg-[#6B8B23] hover:bg-[#5A7A1A] disabled:opacity-60 disabled:cursor-not-allowed text-white py-3 rounded-lg font-semibold transition-colors font-outfit"
              >
                {isPaying && selectedTier === 'college_admission' ? 'Processing...' : 'Subscribe for ₹1999'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}