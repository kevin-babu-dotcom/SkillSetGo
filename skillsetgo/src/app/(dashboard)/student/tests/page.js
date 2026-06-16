'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { auth } from '@/firebase/config'
import { getUserProfile } from '@/firebase/firestore'
import { Lock, Unlock, ArrowRight, ShieldCheck, ClipboardList } from 'lucide-react'
import { isTestInProgress, getTestStorageKey } from '@/lib/testProgress'

export default function TestsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [inProgressTests, setInProgressTests] = useState({})

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

        // Check for in-progress tests in localStorage
        const checkProgressTests = {}
        // This will be populated after we determine test type
        setInProgressTests(checkProgressTests)
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
      <div className="min-h-screen bg-white p-6 flex items-center justify-center relative">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
          <div className="text-9xl font-bold text-gray-100 opacity-5 absolute select-none">
            SkillSetGo
          </div>
        </div>
        <div className="relative z-10 text-center">
          <div className="w-12 h-12 border-4 border-gray-300 border-t-[#6B8B23] rounded-full mx-auto mb-4 animate-spin"></div>
          <p className="text-slate-600 font-medium">Loading tests...</p>
        </div>
      </div>
    )
  }

  const classVal = profile?.class || ''
  const classNum = parseInt(classVal.replace(/\D/g, ''), 10)
  // Determine if student is below 10th standard
  const isBelow10th = classNum && classNum < 10
  const testType = isBelow10th ? 'streamSelector' : 'degreeExplorer'

  const hasPaidPlan = !!profile?.subscription?.tier

  let testsList = []
  if (isBelow10th) {
    testsList = [
      {
        id: 1,
        title: 'Interests Quiz',
        description: 'Discover your core interests to guide your academic choices (Free to take, result requires paid plan).',
        isLocked: false,
        path: '/assessment/career-interests',
        icon: '🎯'
      },
      {
        id: 2,
        title: 'Personality Quiz',
        description: 'Understand your unique personality traits and how they align with various career paths.',
        isLocked: !hasPaidPlan,
        path: '/assessment/personality',
        icon: '🧠'
      },
      {
        id: 3,
        title: 'Aptitude Quiz',
        description: 'Evaluate your natural strengths and abilities across different cognitive areas.',
        isLocked: !hasPaidPlan,
        path: '/assessment/aptitude',
        icon: '🧩'
      },
      {
        id: 4,
        title: 'Self Efficacy',
        description: 'Assess your belief in your own capabilities to achieve academic and career goals.',
        isLocked: !hasPaidPlan,
        path: '/assessment/self-efficacy',
        icon: '⭐'
      }
    ]
  } else {
    testsList = [
      {
        id: 1,
        title: 'Interests Quiz',
        description: 'Discover your core interests to guide your academic choices (Free to take, result requires paid plan).',
        isLocked: false,
        path: '/assessment/career-interests',
        icon: '🎯'
      },
      {
        id: 2,
        title: 'Personality Quiz',
        description: 'Understand your unique personality traits and how they align with various career paths.',
        isLocked: !hasPaidPlan,
        path: '/assessment/personality',
        icon: '🧠'
      },
      {
        id: 3,
        title: 'Aptitude Quiz',
        description: 'Evaluate your natural strengths and abilities across different cognitive areas.',
        isLocked: !hasPaidPlan,
        path: '/assessment/aptitude',
        icon: '🧩'
      },
      {
        id: 4,
        title: 'Work Values Quiz',
        description: 'Identify what you value most in a work environment for long-term satisfaction.',
        isLocked: !hasPaidPlan,
        path: '/assessment/work-values',
        icon: '💼'
      },
      {
        id: 5,
        title: 'Emotional Quotient Test',
        description: 'Measure your emotional intelligence and understand how it impacts your career success.',
        isLocked: !hasPaidPlan,
        path: '/assessment/eq',
        icon: '💖'
      }
    ]
  }

  return (
    <main className="min-h-screen bg-[#ffffff] py-[30px] px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-[#FAF0DC] rounded-xl shadow-md p-8 mb-8 border border-[#e8ce91] flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-extrabold text-[#1F1F1F] mb-1 flex items-center gap-3">
                <ClipboardList className="w-8 h-8 text-[#6B8B23]" /> My Assessment Tests
              </h1>
              <p className="text-gray-700 text-lg">
                Complete your required assessments based on your class level ({classVal || 'Unspecified'}).
              </p>
            </div>
            <div className="hidden sm:block">
              {hasPaidPlan ? (
                  <div className="flex flex-col items-end">
                      <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-bold bg-[#6B8B23] text-white shadow-sm">
                          <ShieldCheck className="w-4 h-4 mr-1.5" /> Premium Unlocked
                      </span>
                  </div>
              ) : (
                  <div className="flex flex-col items-end">
                      <span className="inline-flex items-center justify-center px-4 py-2 rounded-full text-sm font-bold bg-gray-200 text-gray-700 shadow-sm mb-2">
                         Free Trial
                      </span>
                      <button onClick={() => router.push('/student/upgrade')} className="bg-[#FDD355] text-black text-xs px-4 py-1.5 rounded font-bold hover:bg-[#eab308] transition-colors shadow-sm">
                         Upgrade Plan
                      </button>
                  </div>
              )}
            </div>
        </div>
        
        <div className="space-y-6">
          {testsList.map((test, index) => (
            <div 
              key={test.id} 
              className={`relative bg-[#FAF0DC] border-2 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-sm transition-all duration-300 hover:shadow-md ${test.isLocked ? 'border-gray-200 opacity-90' : 'border-[#6B8B23]/30 hover:border-[#6B8B23]'}`}
            >
              {/* Optional blurred locked overlay */}
              {/* {test.isLocked && <div className="absolute inset-0 bg-[#FAF0DC]/40 backdrop-blur-[1px] rounded-2xl z-0"></div>} */}
              
              <div className="relative z-10 flex items-start gap-4 flex-1">
                <div className={`flex-shrink-0 w-14 h-14 rounded-full flex items-center justify-center text-2xl shadow-sm ${test.isLocked ? 'bg-gray-100 grayscale' : 'bg-white'}`}>
                  {test.icon}
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h2 className={`text-xl sm:text-2xl font-bold ${test.isLocked ? 'text-gray-500' : 'text-[#1F1F1F]'}`}>
                      {index + 1}. {test.title}
                    </h2>
                    {test.isLocked ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-gray-200 text-gray-600">
                        <Lock className="w-3 h-3 mr-1" /> Locked
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-green-100 text-green-700">
                        <Unlock className="w-3 h-3 mr-1" /> Unlocked
                      </span>
                    )}
                  </div>
                  <p className={`text-sm sm:text-base ${test.isLocked ? 'text-gray-400' : 'text-gray-700'}`}>
                    {test.description}
                  </p>
                </div>
              </div>

              <div className="relative z-10 w-full sm:w-auto flex-shrink-0 flex sm:justify-end">
                {test.isLocked ? (
                  <button
                    onClick={() => router.push('/student/upgrade')}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gray-800 text-white px-6 py-3 rounded-lg font-bold hover:bg-black transition-colors"
                  >
                    <Lock className="w-4 h-4" /> Upgrade to Access
                  </button>
                ) : (() => {
                  // Determine the section name for localStorage lookup
                  const moduleToSectionMap = {
                    'career-interests': 'interests',
                    'personality': 'personality',
                    'aptitude': 'aptitude',
                    'self-efficacy': 'selfEfficacy',
                    'work-values': 'workValues',
                    'eq': 'eq',
                  };
                  const moduleId = test.path.split('/').pop();
                  const section = moduleToSectionMap[moduleId];
                  const testInProgress = isTestInProgress(testType, section);

                  return (
                    <button
                      onClick={() => router.push(test.path)}
                      className={`w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3 rounded-lg font-bold shadow-md transition-all active:scale-95 ${
                        testInProgress
                          ? 'bg-[#6B8B23] text-white hover:bg-[#6B8B23]'
                          : 'bg-[#6B8B23] text-white hover:bg-[#5a761e] hover:shadow-lg'
                      }`}
                    >
                      {testInProgress ? (
                        <>▶ Continue Test</>
                      ) : (
                        <>Start Test <ArrowRight className="w-4 h-4" /></>
                      )}
                    </button>
                  );
                })()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
