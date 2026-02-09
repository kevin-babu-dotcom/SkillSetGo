'use client'
import { useState, useEffect } from 'react'
import { auth } from '@/firebase/config'
import { getUserProfile } from '@/firebase/firestore'
import { useRouter } from 'next/navigation'

export default function UpgradePage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [tier3Sessions, setTier3Sessions] = useState(2)
  const [showCheckout, setShowCheckout] = useState(false)
  const [selectedTier, setSelectedTier] = useState(null)

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

  const calculateTier3Price = () => {
    const basePrice = 499
    const sessionPrice = 1000
    return basePrice + (tier3Sessions * sessionPrice)
  }

  const incrementSessions = () => {
    setTier3Sessions(prev => prev + 1)
  }

  const decrementSessions = () => {
    if (tier3Sessions > 1) {
      setTier3Sessions(prev => prev - 1)
    }
  }

  const handleUpgrade = (tier) => {
    setSelectedTier(tier)
    setShowCheckout(true)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl font-outfit">Loading...</div>
      </div>
    )
  }

  const tiers = [
    {
      name: 'Tier 1',
      subtitle: 'Get',
      price: '₹0',
      priceValue: 0,
      tag: 'Current Plan',
      features: [
        { name: 'Career Assessment', status: 'partial', note: 'Part 1 of 4' },
        { name: 'Career Library', status: 'available' },
        { name: 'Assessment Report', status: 'unavailable' },
        { name: 'Career Guidance', status: 'unavailable' }
      ],
      unlocks: [
        'Access to Interest Explorer (Part 1 of Career Assessment)',
        'Browse all careers in Career Library'
      ],
      buttonText: null,
      current: true
    },
    {
      name: 'Tier 2',
      subtitle: 'Set',
      price: '₹499',
      priceValue: 499,
      tag: null,
      features: [
        { name: 'Career Assessment', status: 'available' },
        { name: 'Career Library', status: 'available' },
        { name: 'Assessment Report', status: 'available' },
        { name: 'Career Guidance', status: 'unavailable' }
      ],
      unlocks: [
        'Complete 4-Part Career Assessment (Interest, Personality, Aptitude, Self-Efficacy)',
        'Detailed Assessment Report with career recommendations',
        'Full access to Career Library',
        'Download and save your reports'
      ],
      buttonText: 'Upgrade Now',
      current: false
    },
    {
      name: 'Tier 3',
      subtitle: 'Go',
      price: `₹${calculateTier3Price()}`,
      priceValue: calculateTier3Price(),
      tag: 'Recommended',
      features: [
        { name: 'Career Assessment', status: 'available' },
        { name: 'Career Library', status: 'available' },
        { name: 'Assessment Report', status: 'available' },
        { name: 'Career Guidance', status: 'available' }
      ],
      unlocks: [
        'Everything in Tier 2',
        `${tier3Sessions} One-on-One Career Counselling Sessions`,
        'Personalized career roadmap',
        'Direct guidance from career experts',
        'Action plan for your career journey'
      ],
      buttonText: 'Upgrade Now',
      showSessionSelector: true,
      current: false,
      sessions: tier3Sessions
    }
  ]

  return (
    <>
      <main className={`min-h-screen bg-[#F5F5DC] font-outfit transition-all duration-300 ${showCheckout ? 'blur-[2px]' : ''}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="text-center mb-4">
            <div className="flex items-center justify-center gap-2 mb-3">
              <div className="w-8 h-8 bg-[#FDD355] rounded-full flex items-center justify-center">
                <span className="text-xl">💡</span>
              </div>
            </div>
            <h1 className="text-4xl font-bold mb-2 font-outfit">SkillSetGo Tiers</h1>
            <p className="text-lg text-gray-700 font-outfit">
              Get started, set your goals, and go build your perfect career. <span className="font-bold">Upgrade Now!</span>
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {tiers.map((tier, index) => (
              <div 
                key={index}
                className={`bg-[#FAF0DC] rounded-xl p-6 relative ${tier.name === 'Tier 3' ? 'border-2 border-gray-400' : ''}`}
              >
                {/* Recommended Tag */}
                {tier.tag === 'Recommended' && (
                  <div className="absolute -top-3 right-6 bg-white px-4 py-1 rounded-full border border-gray-300 text-sm font-semibold">
                    Recommended
                  </div>
                )}

                {/* Tier Header */}
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold mb-1 font-outfit">
                    {tier.name}
                  </h2>
                  <p className="text-xl font-bold mb-4 font-outfit">{tier.subtitle}</p>
                  
                  {/* Icon/Character */}
                  <div className="flex justify-center mb-4">
                    <div className="w-20 h-20 bg-[#6B8B23] rounded-full flex items-center justify-center">
                      <span className="text-4xl">🎯</span>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="mb-2">
                    <p className="text-3xl font-bold font-outfit">{tier.price}</p>
                    {tier.tag === 'Current Plan' && (
                      <p className="text-sm font-semibold bg-[#FDD355] inline-block px-3 py-1 rounded-full mt-2">
                        Current Plan
                      </p>
                    )}
                    {tier.buttonText && (
                      <button 
                        onClick={() => handleUpgrade(tier)}
                        className="bg-[#FDD355] hover:bg-yellow-500 text-black font-bold px-6 py-2 rounded-full mt-2 transition-colors"
                      >
                        {tier.buttonText}
                      </button>
                    )}
                  </div>

                  {/* Session Selector for Tier 3 */}
                  {tier.showSessionSelector && (
                    <div className="mt-4">
                      <p className="text-sm text-gray-700 mb-2">Number of Counselling Sessions</p>
                      <div className="flex items-center justify-center gap-3">
                        <button 
                          onClick={decrementSessions}
                          className="w-8 h-8 bg-[#6B8B23] hover:bg-[#5a7a1e] text-white rounded-full flex items-center justify-center font-bold text-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled={tier3Sessions <= 1}
                        >
                          -
                        </button>
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center border-2 border-[#6B8B23]">
                          <span className="text-xl font-bold">{tier3Sessions}</span>
                        </div>
                        <button 
                          onClick={incrementSessions}
                          className="w-8 h-8 bg-[#6B8B23] hover:bg-[#5a7a1e] text-white rounded-full flex items-center justify-center font-bold text-xl transition-colors"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Features Comparison Table */}
          <div className="bg-white rounded-xl shadow-md p-8">
            <div className="space-y-6">
              {/* Career Assessment */}
              <div className="flex items-center justify-between border-b pb-4">
                <h3 className="text-xl font-bold font-outfit w-1/3">Career Assessment</h3>
                <div className="flex w-2/3 justify-around">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 bg-orange-400 rounded-full flex items-center justify-center mb-1">
                      <span className="text-white text-sm">1/4</span>
                    </div>
                    <span className="text-xs text-gray-600">Part 1 of 4</span>
                  </div>
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Career Library */}
              <div className="flex items-center justify-between border-b pb-4">
                <h3 className="text-xl font-bold font-outfit w-1/3">Career Library</h3>
                <div className="flex w-2/3 justify-around">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Assessment Report */}
              <div className="flex items-center justify-between border-b pb-4">
                <h3 className="text-xl font-bold font-outfit w-1/3">Assessment Report</h3>
                <div className="flex w-2/3 justify-around">
                  <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Career Guidance */}
              <div className="flex items-center justify-between pb-4">
                <h3 className="text-xl font-bold font-outfit w-1/3">Career Guidance</h3>
                <div className="flex w-2/3 justify-around">
                  <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Checkout Center Modal */}
      {showCheckout && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-opacity-10 z-40"
            onClick={() => setShowCheckout(false)}
          ></div>

          {/* Modal centered */}
          <div className={`fixed top-[55%] left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white z-50 shadow-2xl rounded-2xl transform transition-all duration-300 ease-in-out max-h-[80vh] w-full max-w-2xl overflow-y-auto ${showCheckout ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
            <div className="p-6">
              {/* Close Button */}
              <button 
                onClick={() => setShowCheckout(false)}
                className="absolute top-4 right-4 text-gray-600 hover:text-black"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Header */}
              <div className="mb-4">
                <h2 className="text-2xl font-bold mb-1 font-outfit">Checkout</h2>
                <p className="text-gray-600 text-sm font-outfit">Complete your upgrade to unlock premium features</p>
              </div>

              {/* Plan Summary */}
              <div className="bg-[#FAF0DC] rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold font-outfit">{selectedTier?.name} - {selectedTier?.subtitle}</h3>
                    {selectedTier?.sessions && (
                      <p className="text-xs text-gray-600 mt-1 font-outfit">
                        {selectedTier.sessions} Counselling Session{selectedTier.sessions > 1 ? 's' : ''}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold font-outfit">{selectedTier?.price}</p>
                  </div>
                </div>
              </div>

              {/* What You'll Unlock */}
              <div className="mb-4">
                <h3 className="text-lg font-bold mb-3 font-outfit">What You'll Unlock</h3>
                <div className="space-y-2">
                  {selectedTier?.unlocks.map((unlock, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <p className="text-gray-700 text-sm font-outfit">{unlock}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Button */}
              <button className="w-full bg-[#6B8B23] hover:bg-[#5a7a1e] text-white font-bold py-3 rounded-lg transition-colors mb-3 font-outfit">
                Proceed to Payment
              </button>

              {/* Important Notes */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-2">
                <h4 className="font-bold mb-1 text-blue-900 font-outfit text-sm">📋 Important Information</h4>
                <ul className="text-xs text-blue-800 space-y-1 font-outfit">
                  <li>• Access granted immediately after successful payment</li>
                  <li>• All features unlock automatically</li>
                  <li>• Lifetime access to purchased tier content</li>
                </ul>
              </div>

              {/* Refund Policy */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-2">
                <h4 className="font-bold mb-1 text-yellow-900 font-outfit text-sm">💰 Refund Policy</h4>
                <p className="text-xs text-yellow-800 font-outfit">
                  We offer a 7-day money-back guarantee. If you're not satisfied with your purchase, 
                  contact us within 7 days for a full refund. No questions asked.
                </p>
              </div>

              {/* Support */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                <h4 className="font-bold mb-1 text-gray-900 font-outfit text-sm">🤝 Need Help?</h4>
                <p className="text-xs text-gray-700 mb-2 font-outfit">
                  Our support team is here to help you with any questions.
                </p>
                <div className="flex flex-col gap-1 text-xs font-outfit">
                  <a href="mailto:support@skillsetgo.com" className="text-[#6B8B23] hover:underline">
                    📧 support@skillsetgo.com
                  </a>
                  <a href="tel:+911234567890" className="text-[#6B8B23] hover:underline">
                    📞 +91 123 456 7890
                  </a>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}
